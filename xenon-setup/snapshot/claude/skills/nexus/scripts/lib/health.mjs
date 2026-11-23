import fs from "node:fs";
import path from "node:path";
import { EFFORTS, MODELS } from "./config.mjs";

export function frontmatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (kv) fm[kv[1]] = kv[2].trim();
  }
  return fm;
}

export function checkAgentSources(agentsDir) {
  const problems = [];
  if (!fs.existsSync(agentsDir)) return [`agents directory missing: ${agentsDir}`];
  for (const file of fs.readdirSync(agentsDir).filter((f) => f.endsWith(".md"))) {
    const where = `agents/${file}`;
    const text = fs.readFileSync(path.join(agentsDir, file), "utf8");
    const fm = frontmatter(text);
    if (!fm) { problems.push(`${where}: no frontmatter`); continue; }
    if (fm.name !== file.replace(/\.md$/, "")) problems.push(`${where}: name "${fm.name}" does not match the file name`);
    if (!fm.description || fm.description.length < 40) problems.push(`${where}: description is missing or too short to route on`);
    if (!MODELS.includes(String(fm.model).toLowerCase())) problems.push(`${where}: model "${fm.model}" must be one of ${MODELS.join("|")} (never inherit or fable)`);
    if (!EFFORTS.includes(fm.effort) || ["xhigh", "max"].includes(fm.effort)) problems.push(`${where}: effort "${fm.effort}" must be low, medium or high`);
    if (/\bfable\b/i.test(text.replace(/never (uses|routes)[^.]*fable[^.]*\./gi, ""))) problems.push(`${where}: mentions fable`);
    if (!/BLOCKED:/.test(text)) problems.push(`${where}: missing the BLOCKED protocol line`);
  }
  return problems;
}

export function checkSkillBudget(skillFile, maxLines) {
  if (!fs.existsSync(skillFile)) return [`SKILL.md missing: ${skillFile}`];
  const lines = fs.readFileSync(skillFile, "utf8").split(/\r?\n/).length;
  return lines > maxLines ? [`SKILL.md is ${lines} lines (budget ${maxLines}); it loads on every activation, so push detail into references/`] : [];
}
