#!/usr/bin/env node
/**
 * beyond-ui bootstrap — install the upstream design skills this skill composes.
 * Cross-platform (Windows/macOS/Linux); requires Node + git only.
 *
 *   node <skill>/scripts/bootstrap-upstream-skills.mjs            # project scope
 *   node <skill>/scripts/bootstrap-upstream-skills.mjs --global   # user scope (~/.agents/skills)
 *   node <skill>/scripts/bootstrap-upstream-skills.mjs --check    # report only
 *
 * DETERMINISTIC SELECTION — this no longer installs the whole catalogue (~33 skill folders, the
 * waste this replaces). It installs EXACTLY the 10 that assets/skills-catalog.json routes for this
 * project: the 5 permanent top-star design skills + 5 routed from the pool against the detected
 * project profile (scripts/skills-router.mjs detect -> select -> install). Re-running is idempotent;
 * a globally-installed skill satisfies the check.
 *
 * ONE destination, never two. Everything lands in the cross-agent skills directory for the scope —
 * `.agents/skills` beside the project, `~/.agents/skills` at user level. Set BEYOND_UI_SKILLS_DIR to
 * point the single destination somewhere else.
 *
 * CLI-installable skills go through `npx skills add -a universal` (the -a is load-bearing: without it
 * the CLI fans out to every agent it detects). Repos that are not skills-CLI native are cloned and
 * their SKILL.md folders copied. Nothing is skipped silently: every miss is reported and must be
 * handled (fetch the raw SKILL.md and read it) before UI work.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const args = process.argv.slice(2);
const globalScope = args.includes("--global") || args.includes("-g");
const checkOnly = args.includes("--check");
const projectDir = path.resolve(args.find((a, i) => i > 0 && !a.startsWith("--") && fs.existsSync(a)) || process.cwd());

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(fs.readFileSync(path.join(skillRoot, "assets", "skills-catalog.json"), "utf8"));

const skillsDir = process.env.BEYOND_UI_SKILLS_DIR
  ? path.resolve(process.env.BEYOND_UI_SKILLS_DIR)
  : globalScope
    ? path.join(os.homedir(), ".agents", "skills")
    : path.join(projectDir, ".agents", "skills");

const run = (cmd, cmdArgs, opts = {}) =>
  execFileSync(cmd, cmdArgs, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], shell: process.platform === "win32", ...opts });

function installedSkills() {
  const found = new Set();
  if (!fs.existsSync(skillsDir)) return found;
  for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
    if (entry.isDirectory() || entry.isSymbolicLink()) found.add(entry.name);
  }
  return found;
}

// The 10 active skills + their destination folder names, derived from the catalog and the router's
// selection (falling back to permanent-only when selection has not run yet).
function expectedSkills() {
  const activePath = path.join(projectDir, ".beyond-ui", "active-skills.json");
  let active = null;
  try { active = JSON.parse(fs.readFileSync(activePath, "utf8")); } catch { /* not selected yet */ }
  const units = new Map([...catalog.permanent, ...catalog.pool].map((u) => [u.id, u]));
  const chosen = active
    ? [...active.permanent, ...active.selected].map((s) => units.get(s.id)).filter(Boolean)
    : catalog.permanent;
  const expected = [];
  for (const u of chosen) {
    const inst = u.install;
    const dests = inst.type === "clone" ? Object.values(inst.paths) : (inst.skills || [inst.skill]).filter(Boolean);
    dests.forEach((d) => expected.push([d, u.repo, u.id]));
  }
  return { chosen, expected };
}

console.log(`beyond-ui bootstrap — ${checkOnly ? "CHECK ONLY" : globalScope ? "global scope" : "project scope"}`);
console.log(`destination: ${skillsDir}${process.env.BEYOND_UI_SKILLS_DIR ? "  (BEYOND_UI_SKILLS_DIR)" : ""}`);

const { chosen, expected } = expectedSkills();
console.log(`expected skills: ${chosen.length} routed units (${expected.length} folders) — the 5 permanent + 5 selected; never the whole catalogue`);

if (checkOnly) {
  const have = installedSkills();
  const missing = expected.filter(([name]) => !have.has(name));
  const extra = [...have].filter((h) => !expected.some(([n]) => n === h));
  console.log(`\n== skills present in ${skillsDir.replace(projectDir, ".")} ==`);
  console.log(have.size ? [...have].sort().map((s) => `  ${s}`).join("\n") : "  (none found)");
  console.log("\n== capability report ==");
  if (missing.length) {
    console.log(missing.map(([name, src, unit]) => `  MISSING:   ${name} (${unit} @ ${src})`).join("\n"));
    console.log(`
  ACTION REQUIRED — for each miss, run 'node scripts/skills-router.mjs install', or fetch the raw
  SKILL.md URL and read it before doing UI work, then record it in .beyond-ui/state.json ->
  skills.missing (name, reason, readInstead). Do NOT proceed as though the skill had been followed.`);
    process.exit(1);
  }
  if (extra.length) console.log(`  note: ${extra.length} folder(s) not routed for this project (prune with 'node scripts/skills-router.mjs prune'): ${extra.join(", ")}`);
  console.log(`  all ${expected.length} routed skill folders present (${chosen.length} units).`);
  process.exit(0);
}

// ---- install: delegate to the router so the catalog stays the single source of truth ------------
const routerCmd = (c, extra = []) => {
  try {
    const out = run(process.execPath, [path.join(skillRoot, "scripts", "skills-router.mjs"), c, projectDir, ...extra],
      { env: { ...process.env, BEYOND_UI_SKILLS_DIR: skillsDir } });
    console.log(out.trim().split("\n").map((l) => `  ${l}`).join("\n"));
    return true;
  } catch (e) {
    console.log(String((e.stdout || "") + (e.stderr || "")).trim() || e.message);
    return false;
  }
};

routerCmd("detect");
const selected = routerCmd("select");
if (!selected) console.log("  ROUTER SELECTION FAILED — installing the 5 permanent skills only; fix the router error before UI work.");
const ok = routerCmd("install");

// ---- verification: are all 10 present? -----------------------------------------------------------
const have = installedSkills();
const stillMissing = expected.filter(([name]) => !have.has(name));
console.log("\n== capability report ==");
if (stillMissing.length) {
  console.log(stillMissing.map(([name, src, unit]) => `  FAILED:    ${name} (${unit} @ ${src})`).join("\n"));
  console.log(`
  ACTION REQUIRED — for each failure, fetch the upstream SKILL.md raw URL and read it before doing
  UI work, then record the miss in .beyond-ui/state.json -> skills.missing (name, reason, readInstead).
  Do NOT proceed as though the skill had been followed.`);
  process.exit(1);
}
console.log(`  all ${expected.length} routed skill folders present (${chosen.length} units: ${catalog.selection.permanentCount} permanent + ${catalog.selection.poolCount} selected).`);
if (!ok) process.exit(1);

// ---------------------------------------------------------------- tool layer (always installed, skip-if-present)
// playwright + chromium, skillui, opensrc, scrapling (keyless), browser-use, agent skills from GitHub.
console.log("\n== tool layer (capture/teardown/QA) ==");
try {
  const out = execFileSync(process.execPath, [path.join(skillRoot, "scripts", "install-tools.mjs"), projectDir], {
    encoding: "utf8", stdio: ["ignore", "pipe", "pipe"],
  });
  console.log(out.trim().split("\n").map((l) => `  ${l}`).join("\n"));
} catch (e) {
  // install-tools exits 1 only when chromium is unavailable — surface it, never swallow it
  console.log(String((e.stdout || "") + (e.stderr || "")).trim() || e.message);
  console.log("  TOOL LAYER INCOMPLETE — ultra teardown and verify are degraded until chromium is installed.");
}
