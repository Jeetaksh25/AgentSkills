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

// installs can legitimately live at either scope; the capability report checks both, so a globally
// installed roster is not reported as missing just because the run is project-scoped
const globalSkillsDir = process.env.BEYOND_UI_GLOBAL_SKILLS_DIR
  ? path.resolve(process.env.BEYOND_UI_GLOBAL_SKILLS_DIR)
  : path.join(os.homedir(), ".agents", "skills");
const SKILLS_ROOTS = [...new Set([skillsDir, globalSkillsDir])];

const run = (cmd, cmdArgs, opts = {}) =>
  execFileSync(cmd, cmdArgs, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], shell: process.platform === "win32", ...opts });

// Candidate folder names for a unit: the catalog id, the CLI skill names, and the frontmatter
// aliases (the `skills` CLI names folders from the skill's own frontmatter — anthropics/skills
// ships `frontend-design` as `anthropic-frontend-design`, taste-skill as `design-taste-frontend`).
function candidateNames(unit) {
  const inst = unit.install || {};
  const cliNames = inst.type === "clone" ? [] : [inst.skill, ...(inst.skills || [])].filter(Boolean);
  return [...new Set([unit.id, ...cliNames, ...(unit.aliases || [])])];
}

// find the folder a unit actually installed into, across every root
function findUnitFolder(unit) {
  const roots = process.env.BEYOND_UI_SKILLS_DIR ? [skillsDir, globalSkillsDir] : [globalSkillsDir, skillsDir];
  for (const root of roots) {
    for (const name of candidateNames(unit)) {
      if (fs.existsSync(path.join(root, name, "SKILL.md"))) return { root, name };
    }
    if (unit.install?.type === "clone") {
      for (const d of Object.values(unit.install.paths || {})) {
        if (fs.existsSync(path.join(root, d, "SKILL.md"))) return { root, name: d };
      }
    }
  }
  return null;
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
  return { chosen };
}

console.log(`beyond-ui bootstrap — ${checkOnly ? "CHECK ONLY" : globalScope ? "global scope" : "project scope"}`);
console.log(`destination: ${skillsDir}${process.env.BEYOND_UI_SKILLS_DIR ? "  (BEYOND_UI_SKILLS_DIR)" : ""}`);

const { chosen } = expectedSkills();
console.log(`expected skills: ${chosen.length} routed units — the 5 permanent + 5 selected; never the whole catalogue`);

if (checkOnly) {
  const locate = (u) => findUnitFolder(u);
  const missing = chosen.filter((u) => !locate(u));
  console.log(`\n== skills present ==`);
  for (const root of SKILLS_ROOTS) console.log(`  ${root}${fs.existsSync(root) ? "" : "  (absent)"}`);
  console.log("\n== capability report ==");
  if (missing.length) {
    console.log(missing.map((u) => `  MISSING:   ${u.id} @ ${u.repo} — expected one of: ${candidateNames(u).join(", ")}`).join("\n"));
    console.log(`
  ACTION REQUIRED — for each miss, run 'node scripts/skills-router.mjs install', or fetch the raw
  SKILL.md URL and read it before doing UI work, then record it in .beyond-ui/state.json ->
  skills.missing (name, reason, readInstead). Do NOT proceed as though the skill had been followed.`);
    process.exit(1);
  }
  const found = chosen.map((u) => { const l = locate(u); return `${u.id} -> ${l.name}  (${l.root})`; });
  console.log(found.map((s) => `  OK        ${s}`).join("\n"));
  console.log(`  all ${chosen.length} routed units present (${catalog.selection.permanentCount} permanent + ${catalog.selection.poolCount} selected).`);
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
const stillMissing = chosen.filter((u) => !findUnitFolder(u));
console.log("\n== capability report ==");
if (stillMissing.length) {
  console.log(stillMissing.map((u) => `  FAILED:    ${u.id} @ ${u.repo} — expected one of: ${candidateNames(u).join(", ")}`).join("\n"));
  console.log(`
  ACTION REQUIRED — for each failure, fetch the upstream SKILL.md raw URL and read it before doing
  UI work, then record the miss in .beyond-ui/state.json -> skills.missing (name, reason, readInstead).
  Do NOT proceed as though the skill had been followed.`);
  process.exit(1);
}
console.log(`  all ${chosen.length} routed units present (${catalog.selection.permanentCount} permanent + ${catalog.selection.poolCount} selected).`);
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
