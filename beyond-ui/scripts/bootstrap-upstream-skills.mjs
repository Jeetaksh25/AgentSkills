#!/usr/bin/env node
/**
 * beyond-ui bootstrap — install the upstream design skills this skill composes.
 * Cross-platform (Windows/macOS/Linux); requires Node + git only.
 *
 *   node <skill>/scripts/bootstrap-upstream-skills.mjs            # project scope
 *   node <skill>/scripts/bootstrap-upstream-skills.mjs --global   # user scope (~/.claude/skills)
 *   node <skill>/scripts/bootstrap-upstream-skills.mjs --check    # report only
 *
 * CLI-installable skills go through `npx skills add`; repos that are not skills-CLI
 * native are cloned and their SKILL.md folders copied (or kept as reference material).
 * Nothing is skipped silently: every miss is reported and must be handled before UI work.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const globalScope = args.includes("--global") || args.includes("-g");
const checkOnly = args.includes("--check");
const projectDir = process.cwd();

const agentSkillsDir = globalScope
  ? path.join(os.homedir(), ".claude", "skills")
  : path.join(projectDir, ".agents", "skills");
const referenceDir = path.join(projectDir, ".beyond-ui", "upstream");

const CLI_SKILLS = [
  ["vercel-labs/agent-skills", ["web-design-guidelines", "react-best-practices", "composition-patterns", "react-view-transitions", "react-native-skills"]],
  ["addyosmani/agent-skills", ["frontend-ui-engineering"]],
  ["https://github.com/anthropics/skills", ["frontend-design"]],
  ["anthropics/skills", ["skill-creator"]],
];

const CLONE_SKILLS = [
  ["https://github.com/pbakaus/impeccable", "impeccable", "npx impeccable install"],
  ["https://github.com/nutlope/hallmark", "hallmark", null],
  ["https://github.com/nextlevelbuilder/ui-ux-pro-max-skill", "ui-ux-pro-max", null],
  ["https://github.com/leonxlnx/taste-skill", "taste", null],
  ["https://github.com/bencium/bencium-claude-code-design-skill", "bencium-design", null],
  ["https://github.com/accesslint/claude-marketplace", "accesslint", null],
  ["https://github.com/gnurio/refactoring-ui-plugin", "refactoring-ui", null],
];

const run = (cmd, cmdArgs, opts = {}) =>
  execFileSync(cmd, cmdArgs, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], ...opts });

function installedSkills() {
  const found = new Set();
  const dirs = [
    globalScope ? path.join(os.homedir(), ".claude", "skills") : path.join(projectDir, ".agents", "skills"),
    globalScope ? path.join(os.homedir(), ".agents", "skills") : path.join(projectDir, ".claude", "skills"),
  ];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory() || entry.isSymbolicLink()) found.add(entry.name);
    }
  }
  return found;
}

function reportInstalled() {
  const found = [...installedSkills()].sort();
  console.log(`\n== skills present in ${agentSkillsDir.replace(projectDir, ".")} and siblings ==`);
  console.log(found.length ? found.map((s) => `  ${s}`).join("\n") : "  (none found)");
}

const failures = [];
const installed = [];

function cliInstall(repo, skills) {
  if (checkOnly) return;
  const cmdArgs = ["-y", "skills", "add", repo];
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

function cloneInstall(url, name, altInstall) {
  if (checkOnly) return;
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "beyond-ui-"));
  console.log(`-> git clone ${url}`);
  try {
    run("git", ["clone", "--depth", "1", url, path.join(tmp, "repo")]);
  } catch (e) {
    failures.push(`${url} — clone failed (${(e.stderr || e.message || "").toString().split("\n")[0]})`
      + (altInstall ? `; alternative: ${altInstall}` : ""));
    fs.rmSync(tmp, { recursive: true, force: true });
    return;
  }
  const found = [];
  const walk = (dir, depth) => {
    if (depth > 4) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === ".git" || entry.name === "node_modules") continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (fs.existsSync(path.join(full, "SKILL.md"))) found.push(full);
        else walk(full, depth + 1);
      }
    }
  };
  walk(path.join(tmp, "repo"), 0);

  if (found.length === 0) {
    // No SKILL.md: keep the repo as reference material rather than pretending it installed.
    fs.mkdirSync(referenceDir, { recursive: true });
    const dest = path.join(referenceDir, name);
    fs.cpSync(path.join(tmp, "repo"), dest, { recursive: true });
    console.log(`   no SKILL.md found — stored as reference material at ${dest.replace(projectDir, ".")}`);
    installed.push(`${name} (reference copy)`);
  } else {
    fs.mkdirSync(agentSkillsDir, { recursive: true });
    for (const dir of found) {
      const dest = path.join(agentSkillsDir, found.length === 1 ? name : `${name}-${path.basename(dir)}`);
      if (fs.existsSync(dest)) {
        console.log(`   keep ${dest.replace(projectDir, ".")} (exists)`);
        continue;
      }
      fs.cpSync(dir, dest, { recursive: true });
      console.log(`   installed ${dest.replace(projectDir, ".")}`);
      installed.push(path.basename(dest));
    }
  }
  fs.rmSync(tmp, { recursive: true, force: true });
}

console.log(`beyond-ui bootstrap — ${checkOnly ? "CHECK ONLY" : globalScope ? "global scope" : "project scope"}`);
for (const [repo, skills] of CLI_SKILLS) cliInstall(repo, skills);
for (const [url, name, alt] of CLONE_SKILLS) cloneInstall(url, name, alt);

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
if (checkOnly) console.log("  (--check: nothing installed by this run)");

// ---------------------------------------------------------------- tool layer (beyond-ui v2 — always installed, skip-if-present)
// playwright + chromium, skillui, opensrc, firecrawl (key-gated, optional), agent skills from GitHub.
if (!checkOnly) {
  console.log("\n== tool layer (capture/teardown) ==");
  try {
    const out = execFileSync(process.execPath, [path.join(path.dirname(fileURLToPath(import.meta.url)), "install-tools.mjs")], {
      encoding: "utf8", stdio: ["ignore", "pipe", "pipe"],
    });
    console.log(out.trim().split("\n").map((l) => `  ${l}`).join("\n"));
  } catch (e) {
    // install-tools exits 1 only when chromium is unavailable — surface it, never swallow it
    console.log(String((e.stdout || "") + (e.stderr || "")).trim() || e.message);
    console.log("  TOOL LAYER INCOMPLETE — ultra teardown and verify are degraded until chromium is installed.");
  }
}
