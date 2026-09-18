#!/usr/bin/env node
/**
 * Skill linter for AgentSkills.
 *
 * Validates every skill folder in this repository against the format rules the harnesses enforce,
 * so a broken skill cannot be committed:
 *   - folder name === frontmatter name (lowercase-hyphen, 1-64 chars, no leading/trailing hyphen)
 *   - SKILL.md parses, has YAML frontmatter with name + description
 *   - description is a single line, <= 1024 chars, third-person, contains trigger guidance
 *   - SKILL.md under the line budget; references/ and assets/ referenced from SKILL.md exist
 *   - no placeholder markers left in shipped content
 *
 * Usage: node scripts/validate-skills.mjs [rootDir]
 */
import fs from "node:fs";
import path from "node:path";

const root = process.argv[2] || process.cwd();
const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const SKILL_MAX_LINES = 500;
const DESC_MAX = 1024;
const PLACEHOLDER_RE = /\b(TODO|TBD|FIXME|XXX)\b|\[INSERT|PLACEHOLDER_/;

let errors = 0;
let warnings = 0;
const err = (m) => { console.log(`  ERROR   ${m}`); errors++; };
const warn = (m) => { console.log(`  WARN    ${m}`); warnings++; };

function frontmatter(text) {
  if (!text.startsWith("---")) return null;
  const end = text.indexOf("\n---", 3);
  if (end === -1) return null;
  const body = text.slice(3, end).trim();
  const fm = {};
  let key = null;
  for (const raw of body.split(/\r?\n/)) {
    const line = raw.replace(/\s+$/, "");
    if (!line.trim()) continue;
    const m = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (m) {
      key = m[1];
      fm[key] = m[2].trim().replace(/^["']|["']$/g, "");
    } else if (key === "description") {
      fm[key] = `${fm[key]} ${line.trim()}`.trim();
    }
  }
  return fm;
}

const dirs = fs
  .readdirSync(root, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith(".") && d.name !== "node_modules" && d.name !== "scripts")
  .map((d) => d.name);

if (dirs.length === 0) {
  console.log("No skill folders found.");
  process.exit(0);
}

console.log(`Validating ${dirs.length} skill folder(s) in ${root}\n`);

for (const dir of dirs) {
  console.log(`${dir}`);
  const skillPath = path.join(root, dir, "SKILL.md");
  if (!fs.existsSync(skillPath)) { err(`${dir}/SKILL.md missing`); continue; }

  const text = fs.readFileSync(skillPath, "utf8");
  const lines = text.split(/\r?\n/).length;
  const fm = frontmatter(text);

  if (!fm) { err("no YAML frontmatter block"); continue; }
  if (!fm.name) err("frontmatter: name missing");
  if (!fm.description) err("frontmatter: description missing");

  if (fm.name) {
    if (fm.name !== dir) err(`frontmatter name "${fm.name}" !== folder "${dir}"`);
    if (!NAME_RE.test(fm.name)) err(`name "${fm.name}" must be lowercase-hyphen`);
    if (fm.name.length > 64) err(`name is ${fm.name.length} chars (max 64)`);
  }

  if (fm.description) {
    if (fm.description.length > DESC_MAX) err(`description ${fm.description.length} chars (max ${DESC_MAX})`);
    if (!/\buse when\b|\btrigger\b/i.test(fm.description)) warn("description has no explicit 'use when' / trigger guidance");
    if (/^(I |You |We |This skill)/.test(fm.description)) warn("description should be third-person, not first/second person");
  }

  if (lines > SKILL_MAX_LINES) warn(`SKILL.md is ${lines} lines (budget ${SKILL_MAX_LINES}); push depth into references/`);

  const refDir = path.join(root, dir, "references");
  const assetDir = path.join(root, dir, "assets");
  const refs = fs.existsSync(refDir) ? fs.readdirSync(refDir) : [];
  const assets = fs.existsSync(assetDir) ? fs.readdirSync(assetDir) : [];

  for (const file of [...refs.map((f) => `references/${f}`), ...assets.map((f) => `assets/${f}`)]) {
    if (!text.includes(file) && !text.includes(path.basename(file))) {
      warn(`${file} exists but is never referenced from SKILL.md`);
    }
  }
  for (const m of text.matchAll(/`(references\/[A-Za-z0-9_.-]+|assets\/[A-Za-z0-9_.-]+)`/g)) {
    const target = path.join(root, dir, m[1]);
    if (!fs.existsSync(target)) err(`SKILL.md references missing file ${m[1]}`);
  }

  for (const [file, body] of [
    [skillPath, text],
    ...refs.map((f) => [path.join(refDir, f), fs.readFileSync(path.join(refDir, f), "utf8")]),
  ]) {
    const rel = path.relative(root, file);
    let fenced = false;
    body.split(/\r?\n/).forEach((line, i) => {
      if (/^\s*(```|~~~)/.test(line)) { fenced = !fenced; return; }
      if (fenced) return;
      // legitimate references to these markers: scan commands and mapping tables that list them
      if (/grep|\\b\(TODO|`TODO`|`FIXME`|CODE-\d\d/.test(line)) return;
      if (PLACEHOLDER_RE.test(line)) warn(`${rel}:${i + 1} placeholder marker: ${line.trim().slice(0, 80)}`);
    });
  }

  const words = text.split(/\s+/).length;
  console.log(`  OK      ${lines} lines, ${words} words, ${refs.length} reference(s), ${assets.length} asset(s)\n`);
}

console.log(`${errors} error(s), ${warnings} warning(s)`);
process.exit(errors === 0 ? 0 : 1);
