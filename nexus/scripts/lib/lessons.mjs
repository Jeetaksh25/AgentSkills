import fs from "node:fs";
import path from "node:path";
import { NexusError, homeDir } from "./config.mjs";

const MAX_LESSONS = 25;
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export const lessonsPath = (global, cwd = process.cwd()) => (global ? path.join(homeDir(), ".claude", "nexus-lessons.md") : path.join(cwd, ".claude", "nexus-lessons.md"));

function parse(file) {
  if (!fs.existsSync(file)) return [];
  const out = [];
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = /^- (?:\[([a-z-]+)\] )?(.+)$/.exec(line);
    if (m) out.push({ role: m[1] || null, text: m[2] });
  }
  return out;
}

function write(file, items) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const body = items.map((i) => `- ${i.role ? `[${i.role}] ` : ""}${i.text}`).join("\n");
  fs.writeFileSync(file, `# Nexus lessons\n\nHard rules learnt from earlier reviews. Pasted into delegation briefs by \`nexus.mjs lessons show\`.\n\n${body}\n`);
}

export function addLesson(text, { role, global, cwd } = {}) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (clean.length < 12) throw new NexusError("a lesson is a rule with a reason, at least a sentence");
  const file = lessonsPath(global, cwd);
  const items = parse(file);
  const r = role ? role.replace(/^nexus-/, "") : null;
  if (items.some((i) => norm(i.text) === norm(clean))) return { file, added: false, count: items.length };
  items.push({ role: r, text: clean });
  while (items.length > MAX_LESSONS) items.shift();
  write(file, items);
  return { file, added: true, count: items.length };
}

export function removeLesson(n, { global, cwd } = {}) {
  const file = lessonsPath(global, cwd);
  const items = parse(file);
  if (!(n >= 1 && n <= items.length)) throw new NexusError(`no lesson ${n} (there are ${items.length})`);
  const [gone] = items.splice(n - 1, 1);
  write(file, items);
  return gone;
}

export function listLessons({ cwd } = {}) {
  return [...parse(lessonsPath(true, cwd)).map((l) => ({ ...l, scope: "global" })), ...parse(lessonsPath(false, cwd)).map((l) => ({ ...l, scope: "project" }))];
}

export function showLessons(role, { cwd } = {}) {
  const r = role ? role.replace(/^nexus-/, "") : null;
  const items = listLessons({ cwd }).filter((l) => !l.role || !r || l.role === r);
  if (!items.length) return "";
  return `Hard rules from earlier reviews (every one applies to your edits):\n${items.map((l) => `- ${l.text}`).join("\n")}`;
}
