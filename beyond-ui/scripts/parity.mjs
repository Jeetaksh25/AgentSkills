#!/usr/bin/env node
/**
 * beyond-ui parity — freeze a signed-off design, then prove later passes did not change it (G19).
 *
 *   node scripts/parity.mjs baseline <url> [--routes / /pricing] [--viewports 1440x900,390x844] [--reason "..."] [--mask ".marquee"] [--settle 2000]
 *   node scripts/parity.mjs check <url> [--threshold 1.5] [projectDir]
 *
 * Captures viewport screenshots of each route at five scroll stops per viewport, with canvas/video/iframe
 * hidden and CSS animations frozen, then compares pixels in the browser (no extra dependencies).
 * A shot fails when more than `threshold`% of its pixels differ. Writes `.beyond-ui/parity-report.json`.
 * An intended change is re-baselined with --reason; the reason is carried into the report.
 * See references/PARITY.md.
 */
import fs from "node:fs";
import path from "node:path";
import { launchChromium } from "./lib/browser.mjs";

const argv = process.argv.slice(2);
const mode = argv[0];
const flag = (name, many = false) => {
  const i = argv.indexOf(`--${name}`);
  if (i < 0) return many ? [] : null;
  if (!many) return argv[i + 1] ?? null;
  const out = [];
  for (let j = i + 1; j < argv.length && !argv[j].startsWith("--"); j++) out.push(argv[j]);
  return out;
};
const flagged = new Set(["--routes", "--viewports", "--reason", "--mask", "--threshold", "--settle"].flatMap((f) => {
  const i = argv.indexOf(f);
  if (i < 0) return [];
  const vals = [];
  for (let j = i + 1; j < argv.length && !argv[j].startsWith("--"); j++) { vals.push(j); if (f !== "--routes" && f !== "--mask") break; }
  return vals;
}));
const positional = argv.slice(1).filter((a, i) => !a.startsWith("--") && !flagged.has(i + 1));
const url = positional.find((a) => /^https?:\/\//.test(a));
const projectDir = path.resolve(positional.find((a) => !/^https?:\/\//.test(a)) || process.cwd());
const parityDir = path.join(projectDir, ".beyond-ui", "parity");
const baselineMeta = path.join(parityDir, "baseline.json");
const reportPath = path.join(projectDir, ".beyond-ui", "parity-report.json");
const STOPS = [0, 0.25, 0.5, 0.75, 1];

if (!["baseline", "check"].includes(mode) || !url) {
  console.log("usage: node scripts/parity.mjs baseline|check <url> [--routes / /x] [--viewports 1440x900,390x844] [--reason \"...\"] [--mask sel] [--threshold 1.5]");
  process.exit(2);
}

const normRoute = (r) => {
  const clean = String(r).split("\\").join("/").replace(/^[A-Za-z]:\/.*?\/Git(?=\/|$)/, "");
  return clean.startsWith("/") ? clean : "/" + clean;
};
const slug = (route) => (route === "/" ? "home" : route.replace(/^\/|\/$/g, "").replace(/[^a-z0-9]+/gi, "-"));
const shotPath = (kind, vp, route, stop) => path.join(parityDir, kind, vp, `${slug(route)}-${String(Math.round(stop * 100)).padStart(3, "0")}.png`);

async function diffBuffers(differ, a, b) {
  const da = "data:image/png;base64," + a.toString("base64");
  const db = "data:image/png;base64," + b.toString("base64");
  return differ.evaluate(async ([sa, sb]) => {
    const load = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
    const [ia, ib] = await Promise.all([load(sa), load(sb)]);
    if (ia.width !== ib.width || ia.height !== ib.height) return { ratio: 100, sizeMismatch: true };
    const px = (img) => { const c = document.createElement("canvas"); c.width = img.width; c.height = img.height; const x = c.getContext("2d"); x.drawImage(img, 0, 0); return x.getImageData(0, 0, c.width, c.height).data; };
    const pa = px(ia), pb = px(ib);
    let diff = 0;
    for (let i = 0; i < pa.length; i += 4) {
      if (Math.abs(pa[i] - pb[i]) > 24 || Math.abs(pa[i + 1] - pb[i + 1]) > 24 || Math.abs(pa[i + 2] - pb[i + 2]) > 24) diff++;
    }
    return { ratio: +(diff / (pa.length / 4) * 100).toFixed(3) };
  }, [da, db]);
}

async function stableShot(page, differ) {
  let prev = await page.screenshot({ animations: "disabled" });
  for (let i = 0; i < 10; i++) {
    await page.waitForTimeout(400);
    const cur = await page.screenshot({ animations: "disabled" });
    if ((await diffBuffers(differ, prev, cur)).ratio <= 0.2) return { buf: cur, settled: true };
    prev = cur;
  }
  return { buf: prev, settled: false };
}

async function capture(browser, kind, cfg, differ) {
  const shots = [];
  const base = url.replace(/\/$/, "");
  for (const vp of cfg.viewports) {
    const [width, height] = vp.split("x").map(Number);
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: "no-preference" });
    const page = await context.newPage();
    for (const route of cfg.routes) {
      await page.goto(base + route, { waitUntil: "networkidle", timeout: 60000 }).catch(() => page.goto(base + route, { waitUntil: "load", timeout: 60000 }));
      await page.evaluate(() => document.fonts?.ready);
      await page.addStyleTag({ content: `canvas,video,iframe${cfg.mask.length ? "," + cfg.mask.join(",") : ""}{visibility:hidden!important}*{caret-color:transparent!important}` });
      await page.waitForTimeout(cfg.settle);
      const max = await page.evaluate(() => Math.max(0, document.documentElement.scrollHeight - window.innerHeight));
      for (const stop of STOPS) {
        const y = Math.round(max * stop);
        await page.evaluate((top) => {
          window.__lenis?.scrollTo?.(top, { immediate: true, force: true });
          window.scrollTo(0, top);
        }, y);
        const { buf, settled } = await stableShot(page, differ);
        const file = shotPath(kind, vp, route, stop);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, buf);
        shots.push({ viewport: vp, route, stop, file, settled });
      }
    }
    await context.close();
  }
  return shots;
}

const browser = await launchChromium(projectDir);
if (!browser) { console.log("parity: playwright not installed — run `node scripts/install-tools.mjs`"); process.exit(1); }
const differ = await browser.newPage();

if (mode === "baseline") {
  const routes = flag("routes", true);
  const cfg = {
    url,
    routes: routes.length ? routes.map(normRoute) : ["/"],
    viewports: (flag("viewports") || "1440x900,390x844").split(","),
    mask: flag("mask", true),
    settle: parseInt(flag("settle") || "2000", 10),
    reason: flag("reason") || "design sign-off",
    at: new Date().toISOString(),
  };
  fs.rmSync(path.join(parityDir, "baseline"), { recursive: true, force: true });
  const shots = await capture(browser, "baseline", cfg, differ);
  cfg.shots = shots.length;
  fs.mkdirSync(parityDir, { recursive: true });
  fs.writeFileSync(baselineMeta, JSON.stringify(cfg, null, 2) + "\n");
  const history = (() => { try { return JSON.parse(fs.readFileSync(reportPath, "utf8")).baselines || []; } catch { return []; } })();
  fs.writeFileSync(reportPath, JSON.stringify({ at: cfg.at, pass: null, baseline: cfg, baselines: [...history, { at: cfg.at, reason: cfg.reason, routes: cfg.routes }], shots: [] }, null, 2) + "\n");
  console.log(`parity baseline — ${shots.length} shots of ${cfg.routes.join(", ")} at ${cfg.viewports.join(", ")} (${cfg.reason})`);
  await browser.close();
  process.exit(0);
}

let cfg;
try { cfg = JSON.parse(fs.readFileSync(baselineMeta, "utf8")); } catch {
  console.log("parity: no baseline — run `node scripts/parity.mjs baseline <url>` at design sign-off");
  await browser.close();
  process.exit(1);
}
const threshold = parseFloat(flag("threshold") || "1.5");
fs.rmSync(path.join(parityDir, "current"), { recursive: true, force: true });
cfg.settle = cfg.settle ?? 2000;
const current = await capture(browser, "current", cfg, differ);
const results = [];
for (const s of current) {
  const base = shotPath("baseline", s.viewport, s.route, s.stop);
  if (!fs.existsSync(base)) { results.push({ ...s, ratio: 100, missingBaseline: true, pass: false }); continue; }
  const d = await diffBuffers(differ, fs.readFileSync(base), fs.readFileSync(s.file));
  results.push({ viewport: s.viewport, route: s.route, stop: s.stop, ratio: d.ratio, sizeMismatch: !!d.sizeMismatch, settled: s.settled, pass: d.ratio <= threshold, baseline: path.relative(projectDir, base), current: path.relative(projectDir, s.file) });
}
await browser.close();

const failed = results.filter((r) => !r.pass);
const prior = (() => { try { return JSON.parse(fs.readFileSync(reportPath, "utf8")); } catch { return {}; } })();
const report = { at: new Date().toISOString(), url, threshold, pass: results.length > 0 && failed.length === 0, baseline: cfg, baselines: prior.baselines || [{ at: cfg.at, reason: cfg.reason, routes: cfg.routes }], shots: results };
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n");

console.log(`parity check — ${results.length} shots vs baseline of ${cfg.at} (${cfg.reason})`);
for (const r of results) console.log(`  ${r.pass ? "PASS" : "FAIL"}  ${r.viewport} ${r.route} @${Math.round(r.stop * 100)}% — ${r.ratio}% pixels differ${r.sizeMismatch ? " (size mismatch)" : ""}${r.settled === false ? " (never settled: mask the moving element with --mask)" : ""}`);
console.log(`\nparity: ${report.pass ? "PASS" : "FAIL"}${failed.length ? ` — ${failed.length} shot(s) over ${threshold}%: fix the regression, or re-baseline with --reason if the user asked for the change` : ""}`);
process.exit(report.pass ? 0 : 1);
