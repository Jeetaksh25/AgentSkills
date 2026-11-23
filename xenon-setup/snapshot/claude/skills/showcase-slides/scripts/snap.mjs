#!/usr/bin/env node
/**
 * Screenshots every slide of a built deck at 1920x1080 in its final animated state, so the agent
 * can look at each slide before handing the deck over.
 *
 *   node snap.mjs <index.html> [--out <dir>] [--slides 1,4,7]
 *
 * Writes <dir>/slide-01.png ... (default dir: <deck folder>/snaps). Uses the engine's ?static mode,
 * which disables transitions, completes count-ups and reveals all build steps.
 */
import fs from "node:fs";
import path from "node:path";
import { runChrome, fileUrl } from "./chrome.mjs";

const args = process.argv.slice(2);
const value = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const file = args.find((a, i) => !a.startsWith("--") && !["--out", "--slides"].includes(args[i - 1]));
if (!file || !fs.existsSync(file)) {
  console.error("usage: node snap.mjs <index.html> [--out <dir>] [--slides 1,4,7]");
  process.exit(2);
}

const html = fs.readFileSync(file, "utf8");
const total = (html.match(/<section\b[^>]*class="[^"]*\bslide\b/g) || []).length;
const pick = value("--slides") ? value("--slides").split(",").map((n) => parseInt(n, 10)).filter((n) => n >= 1 && n <= total) : Array.from({ length: total }, (_, i) => i + 1);
const outDir = path.resolve(value("--out") || path.join(path.dirname(path.resolve(file)), "snaps"));
fs.mkdirSync(outDir, { recursive: true });

for (const n of pick) {
  const png = path.join(outDir, `slide-${String(n).padStart(2, "0")}.png`);
  runChrome(["--virtual-time-budget=8000", "--run-all-compositor-stages-before-draw", `--screenshot=${png}`, fileUrl(file, "?static", `#${n}`)]);
  console.log(fs.existsSync(png) ? `  ${png}` : `  FAILED slide ${n}`);
}
console.log(`${pick.length} snapshot(s) in ${outDir}`);
