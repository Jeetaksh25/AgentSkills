#!/usr/bin/env node
/**
 * beyond-ui bootstrap — install the upstream design skills this skill composes.
 * Cross-platform (Windows/macOS/Linux); requires Node + git only.
 *
 *   node <skill>/scripts/bootstrap-upstream-skills.mjs            # project scope
 *   node <skill>/scripts/bootstrap-upstream-skills.mjs --global   # user scope (~/.agents/skills)
 *   node <skill>/scripts/bootstrap-upstream-skills.mjs --check    # report only
 *
 * ONE destination, never two. Everything lands in the cross-agent skills directory for the scope —
 * `.agents/skills` beside the project, `~/.agents/skills` at user level. That is the layout the
 * `skills` CLI itself calls "universal", and the one Amp, Codex, Cursor, Gemini CLI, OpenCode,
 * Windsurf and ~15 other agents read. Writing `.agents/skills` AND `.claude/skills` (what earlier
 * versions did) double-installs every skill; the harness dirs are therefore left alone. Set
 * BEYOND_UI_SKILLS_DIR to point the single destination somewhere else (e.g. a harness that reads
 * only its own directory).
 *
 * CLI-installable skills go through `npx skills add -a universal` — the -a is load-bearing: without
 * it the CLI fans out to every agent it detects and recreates the duplicate tree. Repos that are not
 * skills-CLI native are cloned and their SKILL.md folders copied (or kept as reference material).
 * Nothing is skipped silently: every miss is reported and must be handled before UI work.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const args = process.argv.slice(2);
const globalScope = args.includes("--global") || args.includes("-g");
const checkOnly = args.includes("--check");
const projectDir = process.cwd();

// The single install destination. Not one-per-harness — see the header.
const skillsDir = process.env.BEYOND_UI_SKILLS_DIR
  ? path.resolve(process.env.BEYOND_UI_SKILLS_DIR)
  : globalScope
    ? path.join(os.homedir(), ".agents", "skills")
    : path.join(projectDir, ".agents", "skills");

// Skill ids exactly as published upstream. The `skills` CLI matches these strings literally: a
// guessed name installs nothing and still exits 0, so every id below was verified with
// `npx skills add <repo> -l`. (The old list shipped four names that silently matched nothing.)
const CLI_SKILLS = [
  ["vercel-labs/agent-skills", ["web-design-guidelines", "vercel-react-best-practices", "vercel-composition-patterns", "vercel-react-view-transitions", "vercel-react-native-skills"]],
  ["addyosmani/agent-skills", ["frontend-ui-engineering"]],
  ["anthropics/skills", ["frontend-design", "skill-creator"]],
];

// Repos that are not skills-CLI native: each ships one or more SKILL.md folders at a known path, and
// several ship dozens of near-duplicates (impeccable alone repeats one skill across 20 harness dirs,
// each with different content). So the install set is an explicit table, not a recursive walk: relPath
// inside the clone -> destination folder name. Destinations use each skill's own frontmatter `name`,
// which is what agents match on. Adding a repo means adding its paths here; a path that moves upstream
// fails loudly instead of silently installing the wrong copy.
const CLONE_SKILLS = [
  { repo: "https://github.com/pbakaus/impeccable", alt: "npx impeccable install",
    paths: { ".agent/skills/impeccable": "impeccable" } },
  { repo: "https://github.com/nutlope/hallmark",
    paths: { "skills/hallmark": "hallmark" } },
  { repo: "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill",
    paths: {
      ".claude/skills/ui-ux-pro-max": "ui-ux-pro-max",
      ".claude/skills/ui-styling": "ui-styling",
      ".claude/skills/design-system": "design-system",
    } },
  { repo: "https://github.com/leonxlnx/taste-skill",
    paths: { "skills/taste-skill": "taste" } },
  { repo: "https://github.com/bencium/bencium-claude-code-design-skill",
    paths: {
      "bencium-controlled-ux-designer/skills/bencium-controlled-ux-designer": "bencium-controlled-ux-designer",
      "bencium-innovative-ux-designer/skills/bencium-innovative-ux-designer": "bencium-innovative-ux-designer",
      "bencium-impact-designer/skills/bencium-impact-designer": "bencium-impact-designer",
    } },
  { repo: "https://github.com/accesslint/claude-marketplace",
    paths: {
      "plugins/accesslint/skills/accessibility-scan": "accessibility-scan",
      "plugins/accesslint/skills/accessibility-inspect": "accessibility-inspect",
      "plugins/accesslint/skills/accessibility-audit": "accessibility-audit",
      "plugins/accesslint/skills/accessibility-fix": "accessibility-fix",
      "plugins/accesslint/skills/accessibility-diff": "accessibility-diff",
    } },
  { repo: "https://github.com/gnurio/refactoring-ui-plugin",
    paths: {
      "skills/meta-refactor-ui": "refactor-ui",
      "skills/01-establish-visual-hierarchy": "establish-visual-hierarchy",
      "skills/02-apply-typography-scale": "apply-typography-scale",
      "skills/03-build-color-palette": "build-color-palette",
      "skills/04-apply-consistent-spacing": "apply-consistent-spacing",
      "skills/05-design-button-hierarchy": "design-button-hierarchy",
      "skills/06-eliminate-visual-clutter": "eliminate-visual-clutter",
      "skills/07-design-empty-states": "design-empty-states",
      "skills/08-use-shadows-appropriately": "use-shadows-appropriately",
      "skills/09-manage-color-contrast": "manage-color-contrast",
      "skills/10-group-related-elements": "group-related-elements",
    } },
];

// Every skill this bootstrap is responsible for — the single list `--check` verifies.
const EXPECTED = [
  ...CLI_SKILLS.flatMap(([repo, skills]) => skills.map((s) => [s, repo])),
  ...CLONE_SKILLS.flatMap((r) => Object.values(r.paths).map((d) => [d, r.repo])),
];

// npx/npm are .cmd shims on Windows — execFileSync cannot launch them without a shell.
const run = (cmd, cmdArgs, opts = {}) =>
  execFileSync(cmd, cmdArgs, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], shell: process.platform === "win32", ...opts });

// The canonical directory is the only place searched — checking a second dir would report skills as
// present that this run never installed, which is how the duplicate-tree bug stayed invisible.
function installedSkills() {
  const found = new Set();
  if (!fs.existsSync(skillsDir)) return found;
  for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
    if (entry.isDirectory() || entry.isSymbolicLink()) found.add(entry.name);
  }
  return found;
}

function reportInstalled() {
  const found = [...installedSkills()].sort();
  console.log(`\n== skills present in ${skillsDir.replace(projectDir, ".")} ==`);
  console.log(found.length ? found.map((s) => `  ${s}`).join("\n") : "  (none found)");
}

const failures = [];
const installed = [];

function cliInstall(repo, skills) {
  if (checkOnly) return;
  // -a universal pins the destination to .agents/skills; without it the CLI installs a real tree
  // plus a symlink tree for every agent it detects.
  const cmdArgs = ["-y", "skills", "add", repo, "-a", "universal"];
  for (const s of skills) cmdArgs.push("--skill", s);
  if (globalScope) cmdArgs.push("-g");
  cmdArgs.push("-y");
  console.log(`-> npx ${cmdArgs.join(" ")}`);
  try {
    const out = run("npx", cmdArgs);
    console.log(out.trim().split("\n").slice(-4).map((l) => `   ${l}`).join("\n"));
    skills.forEach((s) => installed.push(`${s} (${repo})`));
  } catch (e) {
    const msg = (e.stderr || e.message || "").toString().split("\n")[0];
    failures.push(`${repo} [${skills.join(", ")}] — ${msg || "cli install failed"}`);
  }
}

function cloneInstall(entry) {
  if (checkOnly) return;
  const { repo, paths, alt } = entry;
  // Skip the clone entirely when every destination is already installed.
  const pending = Object.entries(paths).filter(([, dest]) => !fs.existsSync(path.join(skillsDir, dest, "SKILL.md")));
  if (pending.length === 0) {
    console.log(`-> ${repo}: all ${Object.keys(paths).length} skill(s) already present — skipping clone`);
    return;
  }
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "beyond-ui-"));
  console.log(`-> git clone ${repo}`);
  try {
    run("git", ["clone", "--depth", "1", repo, path.join(tmp, "repo")]);
  } catch (e) {
    failures.push(`${repo} — clone failed (${(e.stderr || e.message || "").toString().split("\n")[0]})`
      + (alt ? `; alternative: ${alt}` : ""));
    fs.rmSync(tmp, { recursive: true, force: true });
    return;
  }
  fs.mkdirSync(skillsDir, { recursive: true });
  for (const [rel, dest] of pending) {
    const src = path.join(tmp, "repo", rel);
    if (!fs.existsSync(path.join(src, "SKILL.md"))) {
      // The upstream layout moved. Say so — a silent skip here is how a skill goes missing for months.
      failures.push(`${repo} — expected skill at "${rel}" (upstream layout changed?)`);
      continue;
    }
    const out = path.join(skillsDir, dest);
    fs.rmSync(out, { recursive: true, force: true });
    fs.cpSync(src, out, { recursive: true });
    console.log(`   installed ${dest}`);
    installed.push(dest);
  }
  fs.rmSync(tmp, { recursive: true, force: true });
}

console.log(`beyond-ui bootstrap — ${checkOnly ? "CHECK ONLY" : globalScope ? "global scope" : "project scope"}`);
console.log(`destination: ${skillsDir}${process.env.BEYOND_UI_SKILLS_DIR ? "  (BEYOND_UI_SKILLS_DIR)" : ""}`);

// --check must answer "are the upstream skills here?", not just print a tree. Reporting an empty
// install list as success is the same false green the missing-import bug produced.
if (checkOnly) {
  const have = installedSkills();
  const missing = EXPECTED.filter(([name]) => !have.has(name));
  reportInstalled();
  console.log("\n== capability report ==");
  if (missing.length) {
    console.log(missing.map(([name, src]) => `  MISSING:   ${name} (${src})`).join("\n"));
    console.log(`
  ACTION REQUIRED — for each miss, fetch the upstream SKILL.md raw URL and read it before doing
  UI work, then record it in .beyond-ui/state.json -> skills.missing (name, reason, readInstead).
  Do NOT proceed as though the skill had been followed.`);
    process.exit(1);
  }
  console.log(`  all ${EXPECTED.length} upstream skills present.`);
  process.exit(0);
}

for (const [repo, skills] of CLI_SKILLS) cliInstall(repo, skills);
for (const entry of CLONE_SKILLS) cloneInstall(entry);

reportInstalled();

console.log("\n== capability report ==");
if (installed.length) console.log(installed.map((s) => `  installed: ${s}`).join("\n"));
if (failures.length) {
  console.log(failures.map((f) => `  FAILED:    ${f}`).join("\n"));
  console.log(`
  ACTION REQUIRED — for each failure, fetch the upstream SKILL.md raw URL and read it before doing
  UI work, then record the miss in .beyond-ui/state.json -> skills.missing (name, reason, readInstead).
  Do NOT proceed as though the skill had been followed.`);
  process.exit(1);
}
console.log("  all upstream skills present.");

// ---------------------------------------------------------------- tool layer (beyond-ui v3 — always installed, skip-if-present)
// playwright + chromium, skillui, opensrc, scrapling (keyless), agent skills from GitHub.
console.log("\n== tool layer (capture/teardown) ==");
try {
  const out = execFileSync(process.execPath, [path.join(path.dirname(fileURLToPath(import.meta.url)), "install-tools.mjs"), projectDir], {
    encoding: "utf8", stdio: ["ignore", "pipe", "pipe"],
  });
  console.log(out.trim().split("\n").map((l) => `  ${l}`).join("\n"));
} catch (e) {
  // install-tools exits 1 only when chromium is unavailable — surface it, never swallow it
  console.log(String((e.stdout || "") + (e.stderr || "")).trim() || e.message);
  console.log("  TOOL LAYER INCOMPLETE — ultra teardown and verify are degraded until chromium is installed.");
}
