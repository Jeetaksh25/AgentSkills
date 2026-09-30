#!/usr/bin/env node
/**
 * Installs every skill in this repository into the agent-harness skills directories.
 *
 *   node scripts/install-skills.mjs                      # install into EVERY detected harness dir
 *   node scripts/install-skills.mjs --target <dir>       # explicit destination (repeatable)
 *   node scripts/install-skills.mjs --copy               # copy instead of symlink
 *   node scripts/install-skills.mjs --list               # list skills, install nothing
 *
 * The default is intentionally "all detected", not "the first one": a machine can have Claude Code,
 * OMP and the cross-tool .agents/ layout at once, and installing into only one of them is how a
 * skill silently goes stale in the others. Symlinked targets stay current forever; copied targets
 * need this script re-run after a repo update (that is what --copy gives up).
 *
 * Windows note: symlinks/junctions need Developer Mode or an elevated shell; the script falls back
 * to copying automatically when symlink creation fails.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const values = (name) => args.reduce((acc, a, i) => (a === name && args[i + 1] ? [...acc, args[i + 1]] : acc), []);
const value = (name) => values(name)[0] ?? null;

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");

// Every harness skills directory this repo knows how to feed. Only the ones whose parent already
// exists are used, so an uninstalled harness is never created from nothing.
const ALL_TARGETS = [
  path.join(os.homedir(), ".claude", "skills"),
  path.join(os.homedir(), ".omp", "skills"),
  path.join(os.homedir(), ".config", "omp", "skills"),
  path.join(process.env.APPDATA || "", "omp", "skills"),
  path.join(os.homedir(), ".agents", "skills"),
].filter((p) => p && path.isAbsolute(p));

const explicitTargets = values("--target");
const targets = explicitTargets.length
  ? explicitTargets.map((t) => path.resolve(t))
  : ALL_TARGETS.filter((c) => fs.existsSync(path.dirname(c)));

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
if (targets.length === 0) {
  console.error("Could not resolve any skills directory. Pass --target <dir>.");
  process.exit(1);
}

const mode = flag("--copy") ? "copy" : "link";
console.log(`Installing ${skills.length} skill(s) into ${targets.length} harness dir(s) (${mode})\n`);

let failures = 0;
for (const target of targets) {
  fs.mkdirSync(target, { recursive: true });
  console.log(target);
  for (const name of skills) {
    const src = path.join(repoRoot, name);
    const dest = path.join(target, name);
    try {
      // already the right kind of install? leave it alone (idempotent, including broken symlinks)
      const stat = fs.lstatSync(dest, { throwIfNoEntry: false });
      if (stat) {
        if (mode === "link" && stat.isSymbolicLink() && path.resolve(fs.readlinkSync(dest)) === src) {
          console.log(`  ok      ${name} (linked)`);
          continue;
        }
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
  console.log("");
}

console.log(`${skills.length * targets.length - failures}/${skills.length * targets.length} installs succeeded.`);
console.log(`Verify with:  node ${path.relative(process.cwd(), path.join(repoRoot, "scripts", "validate-skills.mjs"))} ${repoRoot}`);
process.exit(failures === 0 ? 0 : 1);
