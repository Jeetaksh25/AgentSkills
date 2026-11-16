#!/usr/bin/env node
/**
 * Nexus CLI — install, configure, route, budget and learn for the Nexus orchestration skill.
 *
 *   Setup
 *     install [--project] [--link]      skill -> ~/.claude/skills/nexus, agents -> ~/.claude/agents
 *     mode <auto|low|medium|high|off>   switch profile (saved; persists across sessions)
 *     status                            one line: active profile + pins (what the skill reads on activation)
 *     sync [--project]                  re-write agent pins from the effective config
 *     show                              print the effective (merged) config
 *     doctor [--project]                verify installation, pins, agent files, budgets; Fable/max never used
 *     uninstall [--project]             remove the skill and the nexus-* agents
 *
 *   Working
 *     route "<task>"                    deterministic first-pass flow: roles, model/effort and a routing line each
 *     estimate builder:4 reviewer:4     relative cost of a plan, with parallelism and confirmation warnings
 *     preflight                         can this session fan out safely? (writable tree, git state, pins)
 *     lessons add "<rule>" [--role r] [--global] | show [--role r] | list | rm <n> [--global]
 *     ledger add --role r --model m --effort e --tokens n --ms n --verdict clean|fixes|blocked|escalated|wasted --note "..."
 *     report [--days n] [--here]        per-role results and advice drawn from the ledger
 *
 * Profiles: auto (recommended: medium pins + per-unit adaptation), low, medium, high, off.
 * Config layering (later wins): assets/nexus.config.json <- ~/.claude/nexus.json <- <cwd>/.claude/nexus.json
 * No network, no API keys, no dependencies: Node >= 18 only.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { CAP, NexusError, PROFILES, SKILL_DIR, loadConfig, loadValid, paths, readJson, resolve, statusLine, validate } from "./lib/config.mjs";
import { estimate, formatEstimate } from "./lib/cost.mjs";
import { checkAgentSources, checkSkillBudget } from "./lib/health.mjs";
import { addEntry, formatSummary, readEntries, summarize } from "./lib/ledger.mjs";
import { addLesson, listLessons, removeLesson, showLessons } from "./lib/lessons.mjs";
import { formatRoute, route } from "./lib/route.mjs";

const BOOLEAN = new Set(["project", "link", "global", "here", "json"]);

function parseArgs(argv) {
  const pos = [];
  const opt = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) { pos.push(a); continue; }
    const k = a.slice(2);
    if (BOOLEAN.has(k) || argv[i + 1] === undefined || argv[i + 1].startsWith("--")) opt[k] = true;
    else opt[k] = argv[++i];
  }
  return { pos, opt };
}

const [cmd = "help", ...rest] = process.argv.slice(2);
const { pos, opt } = parseArgs(rest);
const where = paths(!!opt.project);

function removeAgents() {
  let n = 0;
  if (fs.existsSync(where.agentsDest)) for (const f of fs.readdirSync(where.agentsDest)) if (/^nexus-.*\.md$/.test(f)) { fs.rmSync(path.join(where.agentsDest, f)); n++; }
  return n;
}

function writeAgents(cfg, quiet = false) {
  const { profile, roles } = resolve(cfg);
  if (profile === "off") { const n = removeAgents(); if (!quiet) console.log(`  agents  removed ${n} (Nexus is off)`); return 0; }
  fs.mkdirSync(where.agentsDest, { recursive: true });
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
    fs.writeFileSync(path.join(where.agentsDest, file), text);
    if (!quiet) console.log(`  agent   ${role.padEnd(17)} ${pin ? `${pin.model}/${pin.effort}` : "(as shipped)"}`);
    n++;
  }
  return n;
}

function installSkill() {
  const dest = where.skillDest;
  const stat = fs.lstatSync(dest, { throwIfNoEntry: false });
  if (stat) {
    if (stat.isSymbolicLink() && path.resolve(fs.readlinkSync(dest)) === SKILL_DIR) { console.log(`  skill   already linked -> ${SKILL_DIR}`); return; }
    if (path.resolve(dest) === SKILL_DIR) { console.log("  skill   running from the installed copy; left in place"); return; }
    fs.rmSync(dest, { recursive: true, force: true });
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (opt.link) {
    try { fs.symlinkSync(SKILL_DIR, dest, "junction"); console.log(`  skill   linked -> ${SKILL_DIR}`); return; }
    catch { console.log("  skill   symlink unavailable, copying instead"); }
  }
  fs.cpSync(SKILL_DIR, dest, { recursive: true });
  console.log(`  skill   copied -> ${dest}`);
}

function agentPinProblems(cfg, log = false) {
  const bad = [];
  const { profile, roles } = resolve(cfg);
  if (profile === "off") {
    const left = fs.existsSync(where.agentsDest) ? fs.readdirSync(where.agentsDest).filter((f) => /^nexus-.*\.md$/.test(f)) : [];
    if (left.length) bad.push(`profile is off but ${left.length} nexus agents are still installed (run: nexus.mjs sync)`);
    return bad;
  }
  for (const [role, pin] of Object.entries(roles)) {
    const p = path.join(where.agentsDest, `${role}.md`);
    if (!fs.existsSync(p)) { bad.push(`agent missing: ${p} (run: nexus.mjs sync)`); continue; }
    const t = fs.readFileSync(p, "utf8");
    const m = /^model:\s*(\S+)/m.exec(t)?.[1];
    const e = /^effort:\s*(\S+)/m.exec(t)?.[1];
    if (!m || ["fable", "inherit"].includes(m.toLowerCase())) bad.push(`${role}: model pin "${m}" would allow Fable/inherit`);
    else if (e === "max") bad.push(`${role}: max effort pinned`);
    else if (m !== pin.model || e !== pin.effort) bad.push(`${role}: installed ${m}/${e}, profile says ${pin.model}/${pin.effort} (run: nexus.mjs sync)`);
    else if (log) console.log(`  ok      ${role.padEnd(17)} ${m}/${e}`);
  }
  return bad;
}

function doctor() {
  const { cfg, used } = loadConfig();
  const bad = validate(cfg);
  console.log(`config layers: ${used.join("; ")}`);
  console.log(statusLine(cfg));
  if (!fs.existsSync(path.join(where.skillDest, "SKILL.md"))) bad.push(`skill not installed at ${where.skillDest}`);
  bad.push(...agentPinProblems(cfg, true));
  bad.push(...checkAgentSources(path.join(SKILL_DIR, "agents")));
  bad.push(...checkSkillBudget(path.join(SKILL_DIR, "SKILL.md"), cfg.policy?.skillMaxLines ?? 170));
  const major = Number(process.versions.node.split(".")[0]);
  if (major < 18) bad.push(`Node ${process.versions.node} is too old (need 18+)`);
  console.log(`ledger: ${readEntries().length} delegation(s) recorded`);
  if (bad.length) { bad.forEach((b) => console.log(`  ERROR   ${b}`)); process.exit(1); }
  console.log("Nexus is healthy.");
}

function preflight() {
  const cfg = loadValid();
  const lines = [];
  let ok = true;
  const probe = path.join(process.cwd(), `.nexus-preflight-${process.pid}`);
  try {
    fs.writeFileSync(probe, "ok");
    fs.rmSync(probe);
    lines.push("ok      the working tree is writable");
  } catch (e) {
    ok = false;
    lines.push(`BLOCKED the working tree is not writable: ${e.message}`);
  }
  try {
    const dirty = execFileSync("git", ["status", "--porcelain"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).split("\n").filter(Boolean).length;
    lines.push(dirty ? `warn    ${dirty} uncommitted path(s): commit or stash first, so each agent's diff is attributable` : "ok      git tree is clean");
  } catch {
    lines.push("info    not a git repository, or git is unavailable");
  }
  const pins = agentPinProblems(cfg);
  if (pins.length) { ok = false; pins.forEach((p) => lines.push(`BLOCKED ${p}`)); } else lines.push("ok      agent pins match the profile");
  lines.push(`info    maxParallel ${cfg.policy?.maxParallel ?? 4}: stage larger fan-outs in waves and review each wave`);
  lines.push("rule    before a fan-out, do one tiny write yourself; if the environment blocks it, do not dispatch");
  console.log(lines.join("\n"));
  console.log(ok ? "fan-out: OK" : "fan-out: NOT OK");
  if (!ok) process.exit(1);
}

function main() {
  switch (cmd) {
    case "install": {
      const cfg = loadValid();
      console.log(`Installing Nexus into ${where.base}`);
      installSkill();
      const n = writeAgents(cfg);
      console.log(`\n${statusLine(cfg)}\nDone: skill + ${n} agents. Start a new Claude Code session so it picks up the agents.`);
      break;
    }
    case "mode": {
      const want = (pos[0] || "").toLowerCase();
      if (!PROFILES.includes(want)) throw new NexusError(`usage: nexus.mjs mode <${PROFILES.join("|")}>`);
      const saved = readJson(where.userCfgPath) || {};
      saved.profile = want;
      fs.mkdirSync(path.dirname(where.userCfgPath), { recursive: true });
      fs.writeFileSync(where.userCfgPath, `${JSON.stringify(saved, null, 2)}\n`);
      const cfg = loadValid();
      const effective = resolve(cfg).profile;
      writeAgents(cfg, true);
      console.log(`Saved profile "${want}" to ${where.userCfgPath}`);
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
      console.log(JSON.stringify({ layers: used, profile: r.profile, adaptive: r.adaptive, summary: r.summary, policy: cfg.policy, cost: cfg.cost, effective: r.roles }, null, 2));
      const problems = validate(cfg);
      if (problems.length) throw new NexusError(`invalid config:\n  ${problems.join("\n  ")}`);
      break;
    }
    case "doctor": doctor(); break;
    case "uninstall": {
      removeAgents();
      const stat = fs.lstatSync(where.skillDest, { throwIfNoEntry: false });
      if (stat) stat.isSymbolicLink() ? fs.unlinkSync(where.skillDest) : fs.rmSync(where.skillDest, { recursive: true, force: true });
      console.log(`Removed Nexus from ${where.base} (your ${where.userCfgPath}, ledger and lessons are kept)`);
      break;
    }
    case "route": {
      if (!pos.length) throw new NexusError('usage: nexus.mjs route "<task description>"');
      const r = route(pos.join(" "), loadValid());
      console.log(opt.json ? JSON.stringify(r, null, 2) : formatRoute(r));
      break;
    }
    case "estimate": {
      if (!pos.length) throw new NexusError("usage: nexus.mjs estimate builder:4 reviewer:4 runner:1 [role:n@model/effort]");
      const e = estimate(pos, loadValid());
      console.log(opt.json ? JSON.stringify(e, null, 2) : formatEstimate(e));
      break;
    }
    case "preflight": preflight(); break;
    case "lessons": {
      const sub = pos[0];
      if (sub === "add") {
        const r = addLesson(pos.slice(1).join(" "), { role: opt.role, global: !!opt.global });
        console.log(r.added ? `lesson saved (${r.count}) -> ${r.file}` : "already recorded");
      } else if (sub === "show") {
        console.log(showLessons(opt.role) || "(no lessons yet)");
      } else if (sub === "list") {
        const items = listLessons();
        console.log(items.length ? items.map((l, i) => `${i + 1}. [${l.scope}${l.role ? `/${l.role}` : ""}] ${l.text}`).join("\n") : "(no lessons yet)");
      } else if (sub === "rm") {
        console.log(`removed: ${removeLesson(Number(pos[1]), { global: !!opt.global }).text}`);
      } else throw new NexusError('usage: nexus.mjs lessons add "<rule>" [--role r] [--global] | show [--role r] | list | rm <n> [--global]');
      break;
    }
    case "ledger": {
      if (pos[0] === "add") {
        const e = addEntry(opt);
        console.log(`recorded ${e.role} (${e.verdict})`);
      } else if (pos[0] === "show") {
        const rows = readEntries().slice(-(Number(opt.n) || 15));
        console.log(rows.length ? rows.map((e) => `${e.at.slice(0, 16)} ${e.role.padEnd(11)} ${`${e.model || "?"}/${e.effort || "?"}`.padEnd(14)} ${e.verdict.padEnd(9)} ${e.tokens ? `${Math.round(e.tokens / 1000)}k` : ""} ${e.note}`).join("\n") : "(empty)");
      } else throw new NexusError("usage: nexus.mjs ledger add --role r [--model m --effort e --tokens n --ms n --verdict v --note t] | show [--n 15]");
      break;
    }
    case "report": {
      const s = summarize(readEntries(), { days: opt.days ? Number(opt.days) : undefined, project: opt.here ? path.basename(process.cwd()) : undefined }, loadValid());
      console.log(opt.json ? JSON.stringify(s, null, 2) : formatSummary(s));
      break;
    }
    default:
      console.log("usage: node scripts/nexus.mjs <install|mode|status|sync|show|doctor|uninstall|route|estimate|preflight|lessons|ledger|report> [...]\nrun a command with no arguments for its usage");
  }
}

try {
  main();
} catch (e) {
  if (e instanceof NexusError) {
    console.error(`nexus: ${e.message}`);
    process.exit(1);
  }
  throw e;
}
