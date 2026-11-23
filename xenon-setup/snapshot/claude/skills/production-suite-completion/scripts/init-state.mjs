#!/usr/bin/env node
/**
 * Scaffold the run state file for a production-suite-completion run.
 *
 *   node <skill-dir>/scripts/init-state.mjs [projectRoot]
 *
 * Reads assets/checklist.json (the source of truth for item IDs) and writes
 * <projectRoot>/.production-suite/state.json with every item set to "open".
 * Refuses to overwrite an existing state file unless --force is passed, so a
 * resumed run keeps its evidence.
 */
import fs from "node:fs";
import path from "node:path";

const scriptDir = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const checklistPath = path.join(scriptDir, "..", "assets", "checklist.json");
const args = process.argv.slice(2).filter((a) => a !== "--force");
const force = process.argv.includes("--force");
const projectRoot = path.resolve(args[0] || process.cwd());
const outDir = path.join(projectRoot, ".production-suite");
const outFile = path.join(outDir, "state.json");

if (!fs.existsSync(checklistPath)) {
  console.error(`checklist.json not found at ${checklistPath}`);
  process.exit(1);
}
if (fs.existsSync(outFile) && !force) {
  const existing = JSON.parse(fs.readFileSync(outFile, "utf8"));
  const total = Object.keys(existing.items || {}).length;
  console.log(`state.json already exists (${total} items tracked) — resuming. Pass --force to reset.`);
  process.exit(0);
}

const checklist = JSON.parse(fs.readFileSync(checklistPath, "utf8"));
const items = {};
for (const item of checklist.items) {
  items[item.id] = { status: "open", sev: item.sev, domain: item.domain, title: item.title, verify: item.verify, evidence: "", files: [], note: "" };
}

const bySev = Object.values(items).reduce((acc, i) => ({ ...acc, [i.sev]: (acc[i.sev] || 0) + 1 }), {});
const domains = [...new Set(checklist.items.map((i) => i.domain))];

const state = {
  started: new Date().toISOString(),
  skill: checklist.name,
  checklistVersion: checklist.version,
  stack: { framework: "", runtime: "", db: "", auth: "", deployTarget: "" },
  commands: { typecheck: "", lint: "", unit: "", integration: "", build: "", start: "", audit: "" },
  gates: { typecheck: "unrun", lint: "unrun", tests: "unrun", build: "unrun", lighthouse: "unrun", a11y: "unrun", security: "unrun" },
  verdict: null,
  items,
  findings: [],
  blocked: [],
  batch: 0,
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(state, null, 2) + "\n");

console.log(`Wrote ${outFile}`);
console.log(`  ${checklist.items.length} items across ${domains.length} domains (${domains.join(", ")})`);
console.log(`  severity mix: ${Object.entries(bySev).map(([k, v]) => `${k}=${v}`).join(" ")}`);
console.log(`\nNext: fill state.stack and state.commands, then work batches and update items with evidence.`);
