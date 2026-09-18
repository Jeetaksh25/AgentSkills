#!/usr/bin/env node
/**
 * Installs every skill in this repository into an agent harness skills directory.
 *
 *   node scripts/install-skills.mjs                      # auto-detect Claude Code / OMP skills dir
 *   node scripts/install-skills.mjs --target <dir>       # explicit destination
 *   node scripts/install-skills.mjs --copy               # copy instead of symlink
 *   node scripts/install-skills.mjs --list               # list skills, install nothing
 *
 * Windows note: symlinks need Developer Mode or an elevated shell; the script falls back to
 * copying automatically when symlink creation fails.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const value = (name) => {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : null;
};

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");

const candidates = [
  value("--target"),
  path.join(os.homedir(), ".claude", "skills"),
  path.join(os.homedir(), ".omp", "skills"),
  path.join(os.homedir(), ".config", "omp", "skills"),
  path.join(process.env.APPDATA || "", "omp", "skills"),
  path.join(os.homedir(), ".agents", "skills"),
].filter(Boolean);

const skills = fs
  .readdirSync(repoRoot, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith(".") && d.name !== "scripts" && d.name !== "node_modules")
  .map((d) => d.name)
  .filter((name) => fs.existsSync(path.join(repoRoot, name, "SKILL.md")));

if (flag("--list")) {
  console.log(skills.join("\n"));
  process.exit(0);
}
if (skills.length === 0) {
  console.error("No skills found in " + repoRoot);
  process.exit(1);
}

const explicit = value("--target");
const target = explicit || candidates.find((c) => fs.existsSync(path.dirname(c))) || candidates[1];
const mode = flag("--copy") ? "copy" : "link";

if (!target) {
  console.error("Could not resolve a skills directory. Pass --target <dir>.");
  process.exit(1);
}

fs.mkdirSync(target, { recursive: true });
console.log(`Installing ${skills.length} skill(s) into ${target} (${mode})\n`);

let failures = 0;
for (const name of skills) {
  const src = path.join(repoRoot, name);
  const dest = path.join(target, name);
  try {
    if (fs.existsSync(dest)) {
      const stat = fs.lstatSync(dest);
      if (stat.isSymbolicLink() || stat.isFile()) fs.unlinkSync(dest);
      else fs.rmSync(dest, { recursive: true, force: true });
    }
    if (mode === "link") {
      try {
        fs.symlinkSync(src, dest, "junction");
        console.log(`  linked  ${name}`);
      } catch {
        fs.cpSync(src, dest, { recursive: true });
        console.log(`  copied  ${name} (symlink unavailable)`);
      }
    } else {
      fs.cpSync(src, dest, { recursive: true });
      console.log(`  copied  ${name}`);
    }
  } catch (e) {
    failures++;
    console.log(`  FAILED  ${name}: ${e.message}`);
  }
}

console.log(`\n${skills.length - failures}/${skills.length} installed.`);
console.log(`Verify with:  node ${path.relative(process.cwd(), path.join(repoRoot, "scripts", "validate-skills.mjs"))} ${repoRoot}`);
process.exit(failures === 0 ? 0 : 1);
