#!/usr/bin/env node
/**
 * beyond-ui next — the phase runner. Run it between phases; it reads the project's artifacts, finds the
 * first phase that is not done, and prints that phase's card: goal, commands, the rules that bind it
 * (inline, so nothing depends on opening a file), what to read (one scoped section, only when), how to
 * use skills (digest / full / head / tool, against a budget), and the done condition.
 *
 *   node <skill>/scripts/next.mjs [projectDir]          -> the current phase card
 *   node <skill>/scripts/next.mjs --phase 7             -> a specific card
 *   node <skill>/scripts/next.mjs --list                -> every phase with its status
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const flagVal = (n) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : null; };
const projectDir = path.resolve(argv.find((a, i) => !a.startsWith("--") && argv[i - 1] !== "--phase" && fs.existsSync(a)) || process.cwd());
const B = (...p) => path.join(projectDir, ".beyond-ui", ...p);
const has = (...p) => fs.existsSync(B(...p));
const json = (...p) => { try { return JSON.parse(fs.readFileSync(B(...p), "utf8")); } catch { return null; } };
const text = (...p) => { try { return fs.readFileSync(B(...p), "utf8"); } catch { return ""; } };
const { phases, budget } = JSON.parse(fs.readFileSync(path.join(skillRoot, "assets", "phases.json"), "utf8"));
const rel = (p) => p.replace(/<skill>/g, skillRoot.replace(/\\/g, "/"));

const state = json("state.json") || {};
const surface = String(state.surface || "");
const platform = json("platform.json") || {};
const DONE = {
  "0a": () => has("state.json") && has("active-skills.json"),
  "0b": () => has("brief.md") && !/TODO/.test(text("brief.md")),
  "0c": () => has("platform.json"),
  "1": () => { const f = json("fetch-log.json"); const urls = new Set(text("scout.md").match(/https?:\/\/[^\s)|`"\]]+/g) || []); return !!f && f.okCount >= 8 && (f.categoriesOk || []).length >= 4 && (state.scout?.imagesViewed || []).length >= 8 && urls.size >= 4; },
  "2": () => { const s = json("references-selection.json"); return !!s && (s.selected || []).length === 5 && (s.selected || []).filter((x) => x.anchor).length === 1; },
  "3": () => has("DESIGN-SKILL.md") && has("PLAN.json"),
  "4": () => has("SKILL.md"),
  "5": () => (json("fidelity-report.json")?.pass === true || /^\s*component\s*$/i.test(surface)) && (json("fonts", "choice.json")?.pass === true || state.fonts?.brandLocked === true),
  "6": () => has("import-ledger.json"),
  "7": () => state.build?.complete === true || fs.existsSync(B("qa")) && fs.readdirSync(B("qa")).some((f) => f.endsWith(".json")),
  "8": () => platform.webPreview === false ? json("native-evidence.json")?.pass === true : fs.existsSync(B("qa")) && fs.readdirSync(B("qa")).filter((f) => f.endsWith(".json")).some((f) => { const r = json("qa", f); return r?.keyboard === "pass" && r?.reducedMotion === "pass" && r?.console === "clean"; }),
  "9": () => (platform.webPreview === false || (json("critique-auto.json")?.pass === true && json("motion-audit.json")?.pass === true)) && (state.critique?.mean ?? 0) >= 4,
  "10": () => (json("parity-report.json")?.baselines || []).length > 0 || platform.webPreview === false,
  "11": () => json("states-audit.json")?.pass === true && json("craft-audit.json")?.pass === true && (json("fidelity-report.json")?.pass === true || /component/i.test(surface)) && (json("parity-report.json")?.pass === true || platform.webPreview === false),
  "12": () => /^\s*component\s*$/i.test(surface) || json("production-audit.json")?.pass === true || json("store-checklist.json")?.pass === true,
  "13": () => state.enforcement?.verifyRun === "pass",
};

const status = phases.map((p) => ({ id: p.id, title: p.title, done: (() => { try { return DONE[p.id](); } catch { return false; } })() }));
if (argv.includes("--list")) {
  for (const s of status) console.log(`  ${s.done ? "✓" : "·"} ${s.id.padEnd(3)} ${s.title}`);
  process.exit(0);
}

const wanted = flagVal("phase");
const current = wanted ? phases.find((p) => p.id === wanted) : phases.find((p, i) => !status[i].done);
if (!current) { console.log("beyond-ui: every phase is done — report the gate output, screenshots and accepted risks to the user."); process.exit(0); }

const progress = status.map((s) => (s.id === current.id ? "▶" : s.done ? "✓" : "·")).join("");
const out = [];
out.push(`beyond-ui ▸ phase ${current.id} ${current.title}   [${progress}]`);
out.push(`goal: ${current.goal}`);
out.push("");
out.push("run:");
current.run.forEach((r, i) => out.push(`  ${i + 1}. ${rel(r)}`));
out.push("");
out.push("rules (binding for this phase):");
current.rules.forEach((r) => out.push(`  - ${r}`));
if (current.read.length) {
  out.push("");
  out.push("read (only this, only then):");
  current.read.forEach((r) => out.push(`  - ${r.file} ${r.section} — ${r.when}`));
}
if (current.invoke.length) {
  out.push("");
  out.push(`skills (full invocations budget: ${budget.fullInvocations} per run; used so far: ${(state.skills?.invoked || []).filter((x) => x.how === "full").length}):`);
  current.invoke.forEach((r) => out.push(`  - ${r.skill} [${r.how}${r.how === "head" ? ` ${budget.headLines} lines` : ""}] — ${r.when}`));
}
out.push("");
out.push(`done when: ${current.done}`);
out.push("then: run next.mjs again.");
if (current.id === "0a" || current.id === "0b") out.push(`never read: ${budget.neverRead.join("; ")}`);
console.log(out.join("\n"));
