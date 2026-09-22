#!/usr/bin/env node
/**
 * beyond-ui deep capture — Playwright design extraction from a live URL. Deterministic; no LLM.
 *
 *   node scripts/capture-site.mjs <url> <outDir> [--viewports 390,768,1440] [--steps 7] [--video]
 *
 * Produces <outDir>/capture.json + <outDir>/shots/*.png:
 *   tokens      :root CSS custom properties (plus [class*=theme] scoped vars)
 *   fonts       loaded webfonts + @font-face faces + font-family usage
 *   keyframes   every @keyframes rule reachable from the page (incl. inside @media)
 *   transitions unique `transition:` values in use
 *   styles      computed styles for a canonical selector set (h1/h2/a/button/input/nav/footer...)
 *   interactions hover/focus state diffs via CDP CSS.forcePseudoState (deterministic)
 *   layout      flex/grid usage table + structural containers
 *   sections    section inventory with tag + heading
 *   motionLibs  detected animation libraries from window globals/script srcs
 *   shots       full-page + scroll-journey screenshots at each viewport
 *
 * Requires playwright + chromium (scripts/install-tools.mjs installs both).
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const argv = process.argv.slice(2);
const url = argv[0];
const outDir = path.resolve(argv[1] || "./capture");
const getOpt = (name, dflt) => {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : dflt;
};
const viewports = getOpt("--viewports", "390,768,1440").split(",").map((v) => parseInt(v.trim(), 10));
const steps = parseInt(getOpt("--steps", "7"), 10);
const wantVideo = argv.includes("--video");
const timeoutMs = parseInt(getOpt("--timeout", "60000"), 10);

if (!url) {
  console.error("usage: node scripts/capture-site.mjs <url> <outDir> [--viewports 390,768,1440] [--steps 7] [--video]");
  process.exit(1);
}

const require2 = createRequire(path.join(process.cwd(), "package.json"));
let chromium;
try { ({ chromium } = require2("playwright")); }
catch {
  try { ({ chromium } = createRequire(path.join(process.cwd(), "node_modules", "playwright")).default ?? require2("playwright")); }
  catch { console.error("playwright not installed in the project — run scripts/install-tools.mjs first"); process.exit(1); }
}

fs.mkdirSync(path.join(outDir, "shots"), { recursive: true });
if (wantVideo) fs.mkdirSync(path.join(outDir, "video"), { recursive: true });

const EXTRACT_FN = `(() => {
  const out = {};
  // --- tokens: :root custom properties (+ scoped theme containers) ---
  const readVars = (el) => {
    const vars = {}; if (!el) return vars;
    const cs = getComputedStyle(el);
    for (const name of cs) if (name.startsWith("--")) vars[name] = cs.getPropertyValue(name).trim();
    return vars;
  };
  out.rootTokens = readVars(document.documentElement);
  const themed = document.querySelector('[class*="theme"], [data-theme], [class*="tokens"]');
  out.scopedTokens = themed && themed !== document.documentElement ? readVars(themed) : {};

  // --- fonts ---
  out.fonts = {
    loaded: [...new Set([...document.fonts].filter(f => f.status === "loaded").map(f => f.family + "|" + f.weight + "|" + f.style))],
    faces: [], used: new Set(),
  };
  for (const sheet of document.styleSheets) {
    let rules; try { rules = sheet.cssRules; } catch { continue; }
    for (const r of rules) {
      if (r instanceof CSSFontFaceRule) out.fonts.faces.push({ family: r.style.getPropertyValue("font-family"), src: r.style.getPropertyValue("src") });
      if (r.style && r.style.fontFamily) r.style.fontFamily.split(",").forEach(f => out.fonts.used.add(f.trim().replace(/["']/g, "")));
    }
  }
  out.fonts.used = [...out.fonts.used];

  // --- keyframes (incl. inside @media) ---
  out.keyframes = [];
  const walkRules = (rules) => {
    for (const r of rules) {
      if (r instanceof CSSKeyframesRule) out.keyframes.push({ name: r.name, css: r.cssText });
      else if (r instanceof CSSMediaRule) walkRules(r.cssRules);
    }
  };
  for (const sheet of document.styleSheets) { let rules; try { rules = sheet.cssRules; } catch { continue; } walkRules(rules); }

  // --- transitions in use ---
  const transitions = new Set();
  for (const sheet of document.styleSheets) {
    let rules; try { rules = sheet.cssRules; } catch { continue; }
    for (const r of rules) if (r.style && r.style.transition) transitions.add(r.style.transition);
  }
  out.transitions = [...transitions].slice(0, 24);

  // --- computed styles for canonical selectors ---
  const props = ["font-family","font-size","font-weight","line-height","letter-spacing","color","background-color",
    "border-radius","box-shadow","padding","margin","display","gap","max-width","text-transform"];
  const sels = ["h1","h2","h3","p","a","button","input","nav","header","footer","section"];
  out.styles = {};
  for (const sel of sels) {
    const el = document.querySelector(sel);
    if (!el) { out.styles[sel] = null; continue; }
    const cs = getComputedStyle(el); const pick = {};
    for (const p of props) pick[p] = cs.getPropertyValue(p);
    out.styles[sel] = pick;
  }

  // --- layout: flex/grid usage + containers ---
  out.layout = { flex: [], grid: [], containers: {} };
  const seen = new Set();
  for (const el of document.querySelectorAll("header, nav, main, footer, section, article")) {
    const cs = getComputedStyle(el);
    const row = { tag: el.tagName.toLowerCase(), display: cs.display, justify: cs.justifyContent, align: cs.alignItems, gap: cs.gap,
      cols: cs.gridTemplateColumns ? cs.gridTemplateColumns.slice(0, 60) : null, children: el.children.length };
    const key = JSON.stringify(row);
    if (!seen.has(key) && out.layout.flex.length + out.layout.grid.length < 25) {
      seen.add(key);
      if (cs.display.includes("grid")) out.layout.grid.push(row);
      else if (cs.display.includes("flex")) out.layout.flex.push(row);
    }
    out.layout.containers[el.tagName.toLowerCase()] = { maxWidth: cs.maxWidth, padding: cs.padding, display: cs.display };
  }

  // --- section inventory ---
  out.sections = [...document.querySelectorAll("section, [class*='hero'], [class*='feature'], [class*='pricing'], [class*='testimonial'], [class*='faq'], [class*='cta'], footer")]
    .filter((el, i, arr) => arr.indexOf(el) === i)
    .slice(0, 24)
    .map((el) => {
      const h = el.querySelector("h1,h2,h3");
      return { tag: el.tagName.toLowerCase(), cls: (el.className || "").toString().slice(0, 80),
        heading: h ? h.textContent.trim().slice(0, 100) : null, y: Math.round(el.getBoundingClientRect().top + window.scrollY) };
    });

  // --- animation libraries detected ---
  const libs = [];
  const probe = [["gsap", "GSAP"], ["ScrollTrigger", "GSAP ScrollTrigger"], ["Three", "Three.js"], ["framerMotion", "Motion/Framer"],
    ["Motion", "Motion"], ["anime", "Anime.js"], ["lenis", "Lenis"], ["lottie", "Lottie"], ["barba", "Barba.js"], ["AOS", "AOS"]];
  for (const [global_, label] of probe) { try { if (window[global_]) libs.push(label); } catch { /* cross-origin */ } }
  const scripts = [...document.scripts].map(s => s.src || "").filter(Boolean);
  for (const [needle, label] of [["gsap", "GSAP"], ["three", "Three.js"], ["framer-motion", "Motion/Framer"], ["animejs", "Anime.js"],
    ["lenis", "Lenis"], ["lottie", "Lottie"], ["scrolltrigger", "GSAP ScrollTrigger"], ["scroll-driven", "CSS scroll-driven"]]) {
    if (scripts.some(s => s.toLowerCase().includes(needle)) && !libs.includes(label)) libs.push(label);
  }
  out.motionLibs = [...new Set(libs)];
  return out;
})()`;

async function captureInteractions(context, page) {
  // Real pseudo-states on real elements: page.hover() fires true :hover; el.focus() fires true :focus(:focus-visible).
  // No CDP node bookkeeping, no selector mismatches, works on every engine playwright supports.
  const diffs = [];
  const SNAP = `(n) => { const cs = getComputedStyle(n);
    return Object.fromEntries(["backgroundColor","color","borderColor","boxShadow","opacity","transform","outline"]
      .map(p => [p, cs.getPropertyValue(p)])); }`;
  const snap = (el) => el.evaluate(SNAP);
  const types = [["button", 3], ["a", 3], ["input", 2]];
  for (const [sel, max] of types) {
    const handles = await page.$$(sel);
    for (let i = 0; i < Math.min(handles.length, max); i++) {
      const el = handles[i];
      if (!(await el.isVisible().catch(() => false))) continue;
      const label = (await el.textContent().catch(() => "")).trim().slice(0, 40);
      try {
        const before = await snap(el);
        await el.hover().catch(() => {});
        await page.waitForTimeout(350);
        const hovered = await snap(el);
        await el.evaluate("(n) => n.focus()").catch(() => {});
        await page.waitForTimeout(150);
        const focused = await snap(el);
        diffs.push({ type: sel, index: i, label, before, hovered, focused });
      } catch { /* element detached or unhoverable — skip */ }
    }
  }
  return diffs;
}

const browser = await chromium.launch();
const capture = { url, capturedAt: new Date().toISOString(), viewports, interactions: [] };
let firstPage = null;

for (const width of viewports) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    recordVideo: wantVideo && width === viewports[viewports.length - 1] ? { dir: path.join(outDir, "video"), size: { width, height: 900 } } : undefined,
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: timeoutMs }).catch((e) => console.error(`  goto failed @${width}: ${e.message}`));
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  await page.waitForTimeout(800);

  await page.screenshot({ path: path.join(outDir, "shots", `full-${width}.png`), fullPage: true }).catch(() => {});
  for (let i = 0; i < steps; i++) {
    await page.evaluate(([n, total]) => {
      const max = Math.max(0, document.documentElement.scrollHeight - 900);
      window.scrollTo({ top: (max / (total - 1)) * n, behavior: "instant" });
    }, [i, steps]).catch(() => {});
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(outDir, "shots", `scroll-${width}-${String(i).padStart(3, "0")}.png`) }).catch(() => {});
  }

  if (width === viewports[viewports.length - 1]) {
    firstPage = page;
    capture.extract = await page.evaluate(EXTRACT_FN).catch((e) => ({ error: String(e) }));
    capture.pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    capture.title = await page.title();
  }
  if (wantVideo && width === viewports[viewports.length - 1]) { /* video saved on context.close() */ }
  await context.close();
}

// interactions at desktop viewport with a fresh page
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: timeoutMs }).catch(() => {});
  await page.waitForTimeout(500);
  capture.interactions = await captureInteractions(context, page).catch(() => []);
  await context.close();
}

await browser.close();
fs.writeFileSync(path.join(outDir, "capture.json"), JSON.stringify(capture, null, 2));
console.log(`capture complete: ${url}`);
console.log(`  shots: ${fs.readdirSync(path.join(outDir, "shots")).length} png | keyframes: ${capture.extract?.keyframes?.length ?? 0} | tokens: ${Object.keys(capture.extract?.rootTokens ?? {}).length} | fonts: ${capture.extract?.fonts?.loaded?.length ?? 0} | interactions: ${capture.interactions.length}`);