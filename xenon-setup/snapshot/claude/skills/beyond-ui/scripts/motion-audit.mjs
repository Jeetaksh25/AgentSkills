#!/usr/bin/env node
/**
 * beyond-ui motion audit — every interactive element answers the user (G22). See references/MICRO.md.
 *
 *   node scripts/motion-audit.mjs <url> [projectDir] [--max 60]
 *
 * Renders the page, then hovers, focuses and presses each visible interactive element and records
 * whether anything visibly changes (background, colour, transform, shadow, border, outline, opacity,
 * decoration). Flags elements with no feedback, `transition: all`, and transitions longer than 600ms;
 * checks the source for a route/page transition when the app has more than one route.
 * Writes .beyond-ui/motion-audit.json; pass = >= 80% of elements give feedback, page transition present
 * when needed, nothing slower than 600ms.
 */
import fs from "node:fs";
import path from "node:path";
import { launchChromium } from "./lib/browser.mjs";

const argv = process.argv.slice(2);
const url = argv.find((a) => /^(https?|file):\/\//.test(a));
const projectDir = path.resolve(argv.find((a) => !a.startsWith("--") && !/^(https?|file):\/\//.test(a) && fs.existsSync(a)) || process.cwd());
const maxI = argv.indexOf("--max");
const MAX = maxI >= 0 ? parseInt(argv[maxI + 1], 10) : 60;
if (!url) { console.log("usage: node scripts/motion-audit.mjs <url> [projectDir]"); process.exit(2); }
const beyondDir = path.join(projectDir, ".beyond-ui");

const SRC_DIRS = ["app", "src", "pages", "components", "routes", "lib", "screens", "navigation"];
const walk = (dir, out = []) => {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (/^(node_modules|\.next|dist|build|\.git|\.beyond-ui)$/.test(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else if (/\.(tsx|jsx|ts|js|vue|svelte|astro|css|swift|kt|dart)$/.test(e.name)) out.push(p);
  }
  return out;
};
const files = SRC_DIRS.flatMap((d) => walk(path.join(projectDir, d)));
const routeFiles = files.filter((f) => /[\\/](page|\+page)\.(tsx|jsx|svelte|vue)$|[\\/]pages[\\/].+\.(tsx|jsx|vue)$|[\\/]app[\\/].+\.(tsx)$/.test(f) && !/layout|_app|_document/.test(f));
const multiRoute = routeFiles.length > 1;
const TRANSITION_RE = /startViewTransition|::view-transition|<ViewTransition|unstable_ViewTransition|next-view-transitions|AnimatePresence|pageTransition|PageTransition|onNavigate|barba|swup|sharedTransition|navigationTransition|matchedGeometryEffect|SharedTransitionLayout|PageTransitionsTheme|Hero\(|animation:\s*["'](slide|fade)/;
const hasPageTransition = files.some((f) => TRANSITION_RE.test(fs.readFileSync(f, "utf8")));

const browser = await launchChromium(projectDir);
if (!browser) { console.log("motion-audit: playwright not installed — run `node <skill>/scripts/install-tools.mjs`"); process.exit(1); }
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch(() => page.goto(url, { waitUntil: "load", timeout: 60000 }));
await page.waitForTimeout(1200);

const count = await page.evaluate((max) => {
  const sel = "a[href], button, [role=button], input:not([type=hidden]), select, textarea, [role=tab], [role=switch], [role=checkbox], summary, [tabindex='0']";
  const reachable = (el) => !el.closest("[aria-hidden='true'], [inert]") && el.getAttribute("tabindex") !== "-1" && getComputedStyle(el).pointerEvents !== "none";
  const els = [...document.querySelectorAll(sel)].filter((el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 8 && r.height > 8 && r.left >= 0 && cs.visibility !== "hidden" && cs.display !== "none" && cs.opacity !== "0" && reachable(el); }).slice(0, max);
  els.forEach((el, i) => el.setAttribute("data-motion-audit", String(i)));
  return els.length;
}, MAX);

const snap = (loc) => loc.evaluate((el) => {
  const pick = (n) => { const cs = getComputedStyle(n); return [cs.backgroundColor, cs.color, cs.transform, cs.boxShadow, cs.borderColor, cs.outlineStyle + cs.outlineColor + cs.outlineWidth, cs.opacity, cs.textDecorationLine, cs.filter, cs.scale].join("|"); };
  return [pick(el), ...[...el.children].slice(0, 3).map(pick)].join("#");
});

const results = [];
for (let i = 0; i < count; i++) {
  const loc = page.locator(`[data-motion-audit="${i}"]`).first();
  try {
    await loc.scrollIntoViewIfNeeded({ timeout: 2000 });
    const meta = await loc.evaluate((el) => {
      const cs = getComputedStyle(el);
      const durs = cs.transitionDuration.split(",").map((d) => parseFloat(d) * (d.includes("ms") ? 1 : 1000));
      return { tag: el.tagName.toLowerCase(), label: (el.getAttribute("aria-label") || el.innerText || el.getAttribute("placeholder") || "").trim().slice(0, 40), property: cs.transitionProperty, maxDuration: Math.max(...durs, 0), animation: cs.animationName !== "none" };
    });
    await page.mouse.move(0, 0);
    await page.waitForTimeout(60);
    const base = await snap(loc);
    await loc.hover({ timeout: 2000 }).catch(() => {});
    await page.waitForTimeout(320);
    const hover = await snap(loc);
    await loc.focus().catch(() => {});
    await page.keyboard.press("Shift").catch(() => {});
    await page.waitForTimeout(220);
    const focus = await snap(loc);
    const box = await loc.boundingBox();
    let press = focus;
    if (box && meta.tag !== "a") {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.waitForTimeout(90);
      press = await snap(loc);
      await page.mouse.move(0, 0);
      await page.mouse.up();
    }
    await loc.evaluate((el) => el.blur()).catch(() => {});
    results.push({ i, ...meta, hover: hover !== base, focus: focus !== hover && focus !== base, press: press !== focus, feedback: hover !== base || press !== focus || (/^(input|select|textarea)$/.test(meta.tag) && focus !== base) });
  } catch { /* detached or covered element */ }
}
await browser.close();

const withFeedback = results.filter((r) => r.feedback);
const none = results.filter((r) => !r.feedback);
const transitionAll = results.filter((r) => r.maxDuration > 0 && /(^|,\s*)all(\s|,|$)/.test(r.property));
const slow = results.filter((r) => r.maxDuration > 600);
const focusless = results.filter((r) => !r.focus && !r.hover && r.tag !== "a");
const coverage = results.length ? Math.round((withFeedback.length / results.length) * 100) : 0;
const findings = [];
if (coverage < 80) findings.push({ severity: "critical", rule: "MICRO-COVERAGE", detail: `${coverage}% of ${results.length} interactive elements give visible feedback (need 80%); silent: ${none.slice(0, 6).map((r) => `${r.tag} "${r.label}"`).join(", ")}` });
if (multiRoute && !hasPageTransition) findings.push({ severity: "critical", rule: "MICRO-ROUTE", detail: `${routeFiles.length} routes but no page/route transition in the source (View Transitions, AnimatePresence, native stack/shared element)` });
if (slow.length) findings.push({ severity: "critical", rule: "MICRO-SLOW", detail: `${slow.length} element(s) transition longer than 600ms: ${slow.slice(0, 4).map((r) => `${r.tag} ${r.maxDuration}ms`).join(", ")}` });
if (transitionAll.length) findings.push({ severity: "warn", rule: "MICRO-ALL", detail: `${transitionAll.length} element(s) use transition: all — list the properties` });
if (focusless.length) findings.push({ severity: "warn", rule: "MICRO-FOCUS", detail: `${focusless.length} control(s) show no hover or focus change` });
const critical = findings.filter((f) => f.severity === "critical").length;
const report = { at: new Date().toISOString(), url, elements: results.length, coverage, routes: routeFiles.length, pageTransition: hasPageTransition, critical, pass: results.length > 0 && critical === 0, findings, results };
fs.mkdirSync(beyondDir, { recursive: true });
fs.writeFileSync(path.join(beyondDir, "motion-audit.json"), JSON.stringify(report, null, 2) + "\n");
for (const f of findings) console.log(`  ${f.severity === "critical" ? "CRIT" : "warn"}  ${f.rule} — ${f.detail}`);
console.log(`motion-audit: ${report.pass ? "PASS" : "FAIL"} — ${coverage}% feedback coverage over ${results.length} elements, page transition ${hasPageTransition ? "present" : multiRoute ? "MISSING" : "n/a (single route)"} -> .beyond-ui/motion-audit.json`);
process.exit(report.pass ? 0 : 1);
