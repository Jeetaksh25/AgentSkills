#!/usr/bin/env node
/**
 * Nexus CLI — install, switch profile, configure and check the Nexus orchestration skill.
 *
 *   node scripts/nexus.mjs install [--project] [--link]   # skill -> ~/.claude/skills/nexus, agents -> ~/.claude/agents
 *   node scripts/nexus.mjs mode <auto|low|medium|high|off> # switch profile; saved in ~/.claude/nexus.json (persists across sessions)
 *   node scripts/nexus.mjs status                         # one line: active profile + pins (what the skill reads on activation)
 *   node scripts/nexus.mjs sync    [--project]            # re-write agent pins from the effective config
 *   node scripts/nexus.mjs show                           # print the effective (merged) config
 *   node scripts/nexus.mjs doctor  [--project]            # verify installation, pins, and that Fable/max are never used
 *   node scripts/nexus.mjs uninstall [--project]          # remove the skill and the nexus-* agents
 *
 * Profiles: auto (recommended: medium pins + per-unit adaptation), low, medium, high, off (Nexus disabled:
 * agents removed, Claude Code behaves as default). --project targets <cwd>/.claude; `mode --project`
 * saves the profile in <cwd>/.claude/nexus.json for that project only.
 *
 * Config layering (later wins, per field): assets/nexus.config.json <- ~/.claude/nexus.json <- <cwd>/.claude/nexus.json
 * No network, no API keys, no dependencies: Node >= 18 only.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SKILL_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MODELS = ["haiku", "sonnet", "opus"];
const EFFORTS = ["low", "medium", "high", "xhigh"]; // max is never allowed; xhigh is escalation-only
const PROFILES = ["auto", "low", "medium", "high", "off"];
const CAP = { haiku: "Haiku", sonnet: "Sonnet", opus: "Opus" };

const [cmd = "help", ...rest] = process.argv.slice(2);
const has = (f) => rest.includes(f);
const positional = rest.filter((a) => !a.startsWith("--"));
const base = has("--project") ? path.join(process.cwd(), ".claude") : path.join(os.homedir(), ".claude");
const skillDest = path.join(base, "skills", "nexus");
const agentsDest = path.join(base, "agents");
const userCfgPath = path.join(base, "nexus.json");

function fail(msg) { console.error(`nexus: ${msg}`); process.exit(1); }
function readJson(p) {
  if (!fs.existsSync(p)) return null;
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch (e) { fail(`Cannot parse ${p}: ${e.message}`); }
}
function merge(a, b) {
  if (!b) return a;
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) {
    out[k] = v && typeof v === "object" && !Array.isArray(v) && a[k] && typeof a[k] === "object" ? merge(a[k], v) : v;
  }
  return out;
}

function loadConfig() {
  const layers = [
    ["defaults", path.join(SKILL_DIR, "assets", "nexus.config.json")],
    ["user", path.join(os.homedir(), ".claude", "nexus.json")],
    ["project", path.join(process.cwd(), ".claude", "nexus.json")],
  ];
  let cfg = {};
  const used = [];
  for (const [label, p] of layers) {
    const j = readJson(p);
    if (j) { cfg = merge(cfg, j); used.push(`${label}: ${p}`); }
  }
  return { cfg, used };
}

/** Resolve the active profile into concrete {model, effort} per role (+ user role overrides). */
function resolve(cfg) {
  const profile = cfg.profile || "auto";
  if (profile === "off") return { profile, adaptive: false, roles: {} };
  const p = cfg.profiles?.[profile];
  if (!p) fail(`unknown profile "${profile}" (use ${PROFILES.join("|")})`);
  const baseRoles = p.base ? cfg.profiles[p.base].roles : p.roles;
  const roles = merge(baseRoles, cfg.roles || {});
  const out = {};
  for (const [role, r] of Object.entries(roles)) out[role] = { model: String(r.model).toLowerCase(), effort: r.effort };
  return { profile, adaptive: !!p.adaptive, summary: p.summary, roles: out };
}

function validate(cfg) {
  const problems = [];
  if (!PROFILES.includes(cfg.profile || "auto")) problems.push(`profile must be one of ${PROFILES.join("|")}`);
  const forbidden = new Set([...(cfg.policy?.forbiddenModels || []), "fable", "inherit"].map((m) => String(m).toLowerCase()));
  const check = (where, r) => {
    if (r.model !== undefined) {
      const m = String(r.model).toLowerCase();
      if (forbidden.has(m)) problems.push(`${where}: model "${r.model}" is forbidden (Nexus never routes to Fable or inherit)`);
      else if (!MODELS.includes(m)) problems.push(`${where}: model must be one of ${MODELS.join("|")}`);
    }
    if (r.effort !== undefined) {
      if (r.effort === "max") problems.push(`${where}: max effort is never allowed`);
      else if (r.effort === "xhigh") problems.push(`${where}: xhigh cannot be a default effort; it is a last-resort escalation only`);
      else if (!EFFORTS.includes(r.effort)) problems.push(`${where}: effort must be one of low|medium|high`);
    }
  };
  for (const [name, p] of Object.entries(cfg.profiles || {})) for (const [role, r] of Object.entries(p.roles || {})) check(`profiles.${name}.${role}`, r);
  for (const [role, r] of Object.entries(cfg.roles || {})) check(`roles.${role}`, r);
  return problems;
}

function removeAgents() {
  let n = 0;
  if (fs.existsSync(agentsDest)) for (const f of fs.readdirSync(agentsDest)) if (/^nexus-.*\.md$/.test(f)) { fs.rmSync(path.join(agentsDest, f)); n++; }
  return n;
}

function writeAgents(cfg, quiet = false) {
  const { profile, roles } = resolve(cfg);
  if (profile === "off") { const n = removeAgents(); if (!quiet) console.log(`  agents  removed ${n} (Nexus is off)`); return 0; }
  fs.mkdirSync(agentsDest, { recursive: true });
  const srcDir = path.join(SKILL_DIR, "agents");
  let n = 0;
  for (const file of fs.readdirSync(srcDir).filter((f) => f.endsWith(".md"))) {
    const role = file.replace(/\.md$/, "");
    let text = fs.readFileSync(path.join(srcDir, file), "utf8");
    const pin = roles[role];
    if (pin) {
      text = text
        .replace(/^model:.*$/m, `model: ${pin.model}`)
        .replace(/^effort:.*$/m, `effort: ${pin.effort}`)
        .replace(/\((Haiku|Sonnet|Opus), \w+ effort\)/, `(${CAP[pin.model]}, ${pin.effort} effort)`);
    }
    fs.writeFileSync(path.join(agentsDest, file), text);
    if (!quiet) console.log(`  agent   ${role.padEnd(17)} ${pin ? `${pin.model}/${pin.effort}` : "(as shipped)"}`);
    n++;
  }
  return n;
}

function installSkill() {
  const stat = fs.lstatSync(skillDest, { throwIfNoEntry: false });
  if (stat) {
    if (stat.isSymbolicLink() && path.resolve(fs.readlinkSync(skillDest)) === SKILL_DIR) { console.log(`  skill   already linked -> ${SKILL_DIR}`); return; }
    if (path.resolve(skillDest) === SKILL_DIR) { console.log("  skill   running from the installed copy; left in place"); return; }
    fs.rmSync(skillDest, { recursive: true, force: true });
  }
  fs.mkdirSync(path.dirname(skillDest), { recursive: true });
  if (has("--link")) {
    try { fs.symlinkSync(SKILL_DIR, skillDest, "junction"); console.log(`  skill   linked -> ${SKILL_DIR}`); return; }
    catch { console.log("  skill   symlink unavailable, copying instead"); }
  }
  fs.cpSync(SKILL_DIR, skillDest, { recursive: true });
  console.log(`  skill   copied -> ${skillDest}`);
}

function statusLine(cfg) {
  const r = resolve(cfg);
  if (r.profile === "off") return "Nexus profile: off — disabled. Behave as default Claude Code; do not route to nexus-* agents.";
  const pins = Object.entries(r.roles).map(([k, v]) => `${k.replace("nexus-", "")}=${v.model}/${v.effort}`).join(" ");
  return `Nexus profile: ${r.profile}${r.adaptive ? " (adaptive)" : " (fixed pins)"} — ${pins}`;
}

function doctor() {
  const { cfg, used } = loadConfig();
  const bad = validate(cfg);
  console.log(`config layers: ${used.join("; ")}`);
  console.log(statusLine(cfg));
  if (!fs.existsSync(path.join(skillDest, "SKILL.md"))) bad.push(`skill not installed at ${skillDest}`);
  const { profile, roles } = resolve(cfg);
  if (profile === "off") {
    const left = fs.existsSync(agentsDest) ? fs.readdirSync(agentsDest).filter((f) => /^nexus-.*\.md$/.test(f)) : [];
    if (left.length) bad.push(`profile is off but ${left.length} nexus agents are still installed (run: nexus.mjs sync)`);
  } else {
    for (const [role, pin] of Object.entries(roles)) {
      const p = path.join(agentsDest, `${role}.md`);
      if (!fs.existsSync(p)) { bad.push(`agent missing: ${p} (run: nexus.mjs sync)`); continue; }
      const t = fs.readFileSync(p, "utf8");
      const m = /^model:\s*(\S+)/m.exec(t)?.[1];
      const e = /^effort:\s*(\S+)/m.exec(t)?.[1];
      if (!m || ["fable", "inherit"].includes(m.toLowerCase())) bad.push(`${role}: model pin "${m}" would allow Fable/inherit`);
      else if (e === "max") bad.push(`${role}: max effort pinned`);
      else if (m !== pin.model || e !== pin.effort) bad.push(`${role}: installed ${m}/${e}, profile says ${pin.model}/${pin.effort} (run: nexus.mjs sync)`);
      else console.log(`  ok      ${role.padEnd(17)} ${m}/${e}`);
    }
  }
  if (bad.length) { bad.forEach((b) => console.log(`  ERROR   ${b}`)); process.exit(1); }
  console.log("Nexus is healthy.");
}

function loadValid() {
  const { cfg } = loadConfig();
  const problems = validate(cfg);
  if (problems.length) fail(`invalid config:\n  ${problems.join("\n  ")}`);
  return cfg;
}

switch (cmd) {
  case "install": {
    const cfg = loadValid();
    console.log(`Installing Nexus into ${base}`);
    installSkill();
    const n = writeAgents(cfg);
    console.log(`\n${statusLine(cfg)}\nDone: skill + ${n} agents. Start a new Claude Code session so it picks up the agents.`);
    break;
  }
  case "mode": {
    const want = (positional[0] || "").toLowerCase();
    if (!PROFILES.includes(want)) fail(`usage: nexus.mjs mode <${PROFILES.join("|")}>`);
    const saved = readJson(userCfgPath) || {};
    saved.profile = want;
    fs.mkdirSync(path.dirname(userCfgPath), { recursive: true });
    fs.writeFileSync(userCfgPath, JSON.stringify(saved, null, 2) + "\n");
    const cfg = loadValid();
    const effective = resolve(cfg).profile;
    writeAgents(cfg, true);
    console.log(`Saved profile "${want}" to ${userCfgPath}`);
    if (effective !== want) console.log(`note: a project override (.claude/nexus.json) sets "${effective}", which wins in this directory.`);
    console.log(statusLine(cfg));
    if (want === "off") console.log("Nexus disabled: nexus agents removed; Claude Code uses its default behaviour. Re-enable with: nexus.mjs mode auto");
    else console.log("Agent pins updated. New pins apply to new sessions; the current session also follows them via per-call overrides.");
    break;
  }
  case "status": console.log(statusLine(loadValid())); break;
  case "sync": writeAgents(loadValid()); break;
  case "show": {
    const { cfg, used } = loadConfig();
    const r = resolve(cfg);
    console.log(JSON.stringify({ layers: used, profile: r.profile, adaptive: r.adaptive, summary: r.summary, policy: cfg.policy, effective: r.roles }, null, 2));
    const problems = validate(cfg);
    if (problems.length) fail(`invalid config:\n  ${problems.join("\n  ")}`);
    break;
  }
  case "doctor": doctor(); break;
  case "uninstall": {
    removeAgents();
    const stat = fs.lstatSync(skillDest, { throwIfNoEntry: false });
    if (stat) stat.isSymbolicLink() ? fs.unlinkSync(skillDest) : fs.rmSync(skillDest, { recursive: true, force: true });
    console.log(`Removed Nexus from ${base} (your ${userCfgPath} is kept)`);
    break;
  }
  default:
    console.log("usage: node scripts/nexus.mjs <install|mode <auto|low|medium|high|off>|status|sync|show|doctor|uninstall> [--project] [--link]");
}
