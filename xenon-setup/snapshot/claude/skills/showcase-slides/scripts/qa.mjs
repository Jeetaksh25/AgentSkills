#!/usr/bin/env node
/**
 * Audits a built deck in headless Chrome and prints a per-slide report.
 *
 *   node qa.mjs <index.html> [--json] [--strict]
 *
 * The engine's ?qa mode lays out every slide exactly as it is presented (1920x1080, fonts loaded)
 * and checks: overflow, underfill, over-shrinking, text below 20 px, WCAG contrast, clipped text,
 * content spilling out of cards, word budget, missing action titles, missing speaker notes,
 * placeholder text, broken images, three identical layouts in a row, and the share of slides that
 * carry a visual exhibit. Exit code is 1 when any error is found (or any warning with --strict).
 */
import fs from "node:fs";
import { runChrome, fileUrl } from "./chrome.mjs";

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
if (!file || !fs.existsSync(file)) {
  console.error("usage: node qa.mjs <index.html> [--json] [--strict]");
  process.exit(2);
}

const r = runChrome(["--virtual-time-budget=12000", "--run-all-compositor-stages-before-draw", "--dump-dom", fileUrl(file, "?qa")]);
const m = /<script type="application\/json" id="qa-result">([\s\S]*?)<\/script>/.exec(r.stdout || "");
if (!m) {
  console.error("QA did not produce a report. Chrome output:\n" + (r.stderr || "").slice(-2000));
  process.exit(2);
}
const report = JSON.parse(m[1]);

if (args.includes("--json")) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`QA ${report.deck}  (theme ${report.theme})`);
  for (const d of report.deckIssues || []) console.log(`  deck  ${d.level.toUpperCase().padEnd(5)} ${d.rule}: ${d.msg}`);
  for (const s of report.slides) {
    const flag = s.issues.some((i) => i.level === "error") ? "x" : s.issues.length ? "!" : "ok";
    console.log(`  ${flag.padEnd(2)} #${String(s.n).padEnd(3)} zoom ${s.zoom.toFixed(2)}  fill ${String(Math.round(s.fill * 100)).padStart(3)}%  ${String(s.words).padStart(3)}w  ${s.title.slice(0, 60)}`);
    for (const i of s.issues) console.log(`        ${i.level.toUpperCase().padEnd(5)} ${i.rule}: ${i.msg}`);
  }
  console.log(`\n${report.errors} error(s), ${report.warnings} warning(s)`);
}

process.exit(report.errors > 0 || (args.includes("--strict") && report.warnings > 0) ? 1 : 0);
