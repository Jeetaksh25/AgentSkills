#!/usr/bin/env node
/**
 * Scaffold a beyond-ui run in the target project.
 *
 *   node <skill>/scripts/scaffold-state.mjs [projectDir]
 *
 * Creates .beyond-ui/state.json and .beyond-ui/scout.md from the skill's assets, without overwriting
 * an existing run. Prints the next action.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectArg = process.argv.slice(2).find((a) => !a.startsWith("-"));
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log("usage: node <skill>/scripts/scaffold-state.mjs [projectDir]   (run from the target project, never from the skill folder)");
  process.exit(0);
}
const projectDir = path.resolve(projectArg || process.cwd());
if (path.relative(skillRoot, projectDir) === "" || !path.relative(skillRoot, projectDir).startsWith("..")) {
  console.log("scaffold-state: refusing to create a run inside the skill folder — cd into the target project first");
  process.exit(1);
}
const outDir = path.join(projectDir, ".beyond-ui");

fs.mkdirSync(outDir, { recursive: true });

const pairs = [
  ["assets/state-template.json", "state.json"],
  ["assets/scout-template.md", "scout.md"],
];

for (const [src, dest] of pairs) {
  const target = path.join(outDir, dest);
  if (fs.existsSync(target)) {
    console.log(`  keep    ${path.relative(projectDir, target)} (exists)`);
    continue;
  }
  fs.copyFileSync(path.join(skillRoot, src), target);
  console.log(`  create  ${path.relative(projectDir, target)}`);
}

const state = JSON.parse(fs.readFileSync(path.join(outDir, "state.json"), "utf8"));
state.started = new Date().toISOString();
fs.writeFileSync(path.join(outDir, "state.json"), JSON.stringify(state, null, 2) + "\n");

console.log(`
next:
  1. node ${path.relative(projectDir, path.join(skillRoot, "scripts/bootstrap-upstream-skills.mjs"))}   # install upstream design skills (no bypass)
  2. fill .beyond-ui/state.json -> stack, skills
  3. scout per references/SCOUT.md -> .beyond-ui/scout.md
`);
