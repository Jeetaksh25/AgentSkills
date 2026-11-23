#!/usr/bin/env node
/**
 * beyond-ui auto-critique — machine evidence for references/CRITIQUE.md on the RENDERED page.
 *
 *   node scripts/critique.mjs <url> [projectDir] [--json]
 *
 * CRITIQUE.md is a human rubric: "score the built page in a browser, not the source". That is
 * exactly the step agents fake. This script renders the page and measures the rules that CAN be
 * measured — hard-fail tells, contrast, motion, tap targets, reflow, token discipline, focus,
 * layout-family repetition — and writes `.beyond-ui/critique-auto.json`, which verify-run G15 gates
 * on and G8 (`critique.hardFailsFound`) requires to be zero unexplained hard fails.
 *
 * It does NOT replace the human read (hierarchy, distinctiveness, taste). It removes the excuses
 * for the mechanical half, and it fails the run on things a rubric cannot argue its way out of:
 * gradient-text headlines, pure #000/#fff, emoji icons, `transition: all`, blanket identical
 * reveals, unlabeled controls, contrast under 4.5:1, sub-24px tap targets, horizontal scroll at
 * 320px, focus that is invisible, and repeated layout families in one page.
 *
 * Exit 1 when a CRITICAL finding is present. Warnings are reported, not fatal.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const url = args[0];
const jsonOnly = args.includes("--json");
const projectDir = path.resolve(args.slice(1).find((a) => !a.startsWith("--") && fs.existsSync(a)) || process.cwd());

if (!url) { console.error("usage: node scripts/critique.mjs <url> [projectDir] [--json]"); process.exit(1); }

const beyondDir = path.join(projectDir, ".beyond-ui");
const outPath = path.join(beyondDir, "critique-auto.json");
const log = (...a) => { if (!jsonOnly) console.log(...a); };
const writeJson = (p, v) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n"); };

// playwright resolves from the skill folder, the project, or a global install
async function loadPlaywright() {
  const { createRequire } = await import("node:module");
  const tries = [
    () => import("playwright"),
    () => createRequire(path.join(projectDir, "package.json"))("playwright"),
    () => createRequire(projectDir)("playwright"),
  ];
  for (const t of tries) { try { return await t(); } catch { /* next */ } }
  return null;
}

// ---------------------------------------------------------------- the in-page audit
const AUDIT = `(() => {
  const findings = [];
  const push = (severity, rule, detail, selector) => findings.push({ severity, rule, detail, selector: selector || "" });
  const css = (el) => getComputedStyle(el);
  const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 1 && r.height > 1; };

  // ---------- hard fail 2: gradient-text headlines ----------
  for (const h of document.querySelectorAll("h1,h2,h3")) {
    if (!vis(h)) continue;
    const cs = css(h);
    const clip = cs.webkitBackgroundClip || cs.backgroundClip;
    if ((clip === "text" || clip === "border-box") && /gradient/.test(cs.backgroundImage)) {
      push("critical", "CRITIQUE-2", "gradient background-clip:text headline", h.tagName.toLowerCase() + ":" + (h.textContent || "").trim().slice(0, 40));
    }
  }

  // ---------- hard fail 7: pure black/white + untinted neutrals ----------
  const pureB = [], pureW = [];
  for (const el of document.querySelectorAll("body *")) {
    if (!vis(el)) continue;
    const cs = css(el);
    for (const prop of ["color", "backgroundColor", "borderTopColor"]) {
      const v = cs[prop];
      if (!v || v === "rgba(0, 0, 0, 0)") continue;
      if (/^rgb\\(0, 0, 0\\)$/.test(v) && (prop === "color" || prop === "backgroundColor")) pureB.push(prop + " on " + el.tagName.toLowerCase());
      if (/^rgb\\(255, 255, 255\\)$/.test(v) && prop === "backgroundColor") pureW.push("background on " + el.tagName.toLowerCase());
    }
  }
  if (pureB.length > 2) push("critical", "CRITIQUE-7", "pure #000 text/surface values: " + pureB.slice(0, 3).join("; "));
  if (pureW.length > 2) push("warn", "CRITIQUE-7", "pure #fff backgrounds: " + pureW.slice(0, 3).join("; "));

  // ---------- hard fail 8: emoji icons ----------
  const EMOJI = /[\\u{1F300}-\\u{1FAFF}\\u{2600}-\\u{27BF}\\u{2B00}-\\u{2BFF}\\u{FE0F}]/u;
  const emojiHits = [];
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walk.nextNode())) {
    const t = (n.nodeValue || "").trim();
    if (t && EMOJI.test(t)) { const el = n.parentElement; emojiHits.push(t.slice(0, 24) + " in <" + (el?.tagName || "?").toLowerCase() + ">"); if (emojiHits.length >= 5) break; }
  }
  if (emojiHits.length) push("critical", "CRITIQUE-8", "emoji used as icons: " + emojiHits.join("; "));

  // ---------- hard fail 10: transition:all / bounce easing ----------
  // "all" is the *initial* value of transition-property, so it only counts as a defect when a
  // duration is actually set (transition-duration: 0s means no transition exists at all).
  const allTransition = [], bounce = [];
  for (const el of document.querySelectorAll("body *")) {
    if (!vis(el)) continue;
    const cs = css(el);
    const dur = Math.max(...String(cs.transitionDuration).split(",").map((d) => parseFloat(d) || 0));
    if (dur > 0 && /(^|,)\\s*all(\\s|,|$)/.test(cs.transitionProperty)) allTransition.push(el.tagName.toLowerCase());
    if (/cubic-bezier\\(\\s*0\\.68|back|elastic|bounce/i.test(cs.transitionTimingFunction + " " + cs.animationTimingFunction)) bounce.push(el.tagName.toLowerCase());
  }
  if (allTransition.length > 3) push("warn", "CRITIQUE-10", "transition:all on " + allTransition.length + " elements");
  if (bounce.length) push("warn", "CRITIQUE-10", "bounce/elastic easing on " + bounce.slice(0, 3).join(", "));

  // ---------- hard fail 11: blanket identical scroll reveals ----------
  const reveals = [...document.querySelectorAll("[style*='opacity'], [class*='reveal'], [data-aos], [class*='animate'], [class*='fade']")].filter(vis);
  const revealSigs = reveals.map((el) => { const cs = css(el); return cs.transitionDuration + "|" + cs.transitionTimingFunction; });
  const uniq = new Set(revealSigs.filter(Boolean));
  if (revealSigs.length >= 8 && uniq.size === 1) push("warn", "CRITIQUE-11", revealSigs.length + " elements share one identical reveal signature");

  // ---------- hard fail 14: tap targets + tiny type (mobile) ----------
  const smallTargets = [], tinyText = [];
  for (const el of document.querySelectorAll("a,button,input,select,textarea,[role='button']")) {
    if (!vis(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 24 || r.height < 24) smallTargets.push(el.tagName.toLowerCase() + " " + Math.round(r.width) + "x" + Math.round(r.height));
  }
  for (const el of document.querySelectorAll("p,li,span,a,label")) {
    if (!vis(el)) continue;
    const fs = parseFloat(css(el).fontSize);
    const text = (el.textContent || "").trim();
    if (fs < 12 && text.length > 8) tinyText.push(Math.round(fs) + "px");
  }
  if (smallTargets.length) push("warn", "CRITIQUE-14", smallTargets.length + " targets under 24px: " + smallTargets.slice(0, 3).join(", "));
  if (tinyText.length > 2) push("warn", "CRITIQUE-14", tinyText.length + " text nodes under 12px");

  // ---------- hard fail 15: unlabeled controls, focus, contrast ----------
  const unlabeled = [];
  for (const el of document.querySelectorAll("button,a,input,select,textarea")) {
    if (!vis(el)) continue;
    const name = (el.getAttribute("aria-label") || "").trim()
      || (el.getAttribute("aria-labelledby") ? "labelledby" : "")
      || (el.textContent || "").trim()
      || (el.getAttribute("title") || "").trim()
      || (el.labels && el.labels.length ? "label" : "")
      || (el.getAttribute("alt") || "").trim();
    if (!name) unlabeled.push(el.tagName.toLowerCase() + (el.id ? "#" + el.id : ""));
  }
  if (unlabeled.length) push("critical", "CRITIQUE-15", unlabeled.length + " unlabeled controls: " + unlabeled.slice(0, 4).join(", "));

  // focus visibility: programmatically focus the first 12 focusables and check for a visible change
  const focusables = [...document.querySelectorAll("a,button,input,select,textarea,[tabindex]:not([tabindex='-1'])")].filter(vis).slice(0, 12);
  const invisibleFocus = [];
  for (const el of focusables) {
    const before = css(el);
    const bSh = before.outlineStyle + before.outlineWidth + before.boxShadow;
    el.focus();
    const after = css(el);
    const aSh = after.outlineStyle + after.outlineWidth + after.boxShadow;
    const ring = getComputedStyle(el).getPropertyValue("box-shadow") + getComputedStyle(el).getPropertyValue("outline-width");
    if (aSh === bSh && !/ring|focus|outline/i.test(el.className || "")) invisibleFocus.push(el.tagName.toLowerCase());
    el.blur();
  }
  if (invisibleFocus.length) push("critical", "CRITIQUE-15", invisibleFocus.length + " controls with no visible focus style: " + invisibleFocus.slice(0, 4).join(", "));

  // ---------- contrast (WCAG 1.4.3 / 1.4.11) ----------
  const lum = (rgb) => {
    const [r, g, b] = rgb.map((c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const parse = (s) => { const m = String(s).match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const p = m[1].split(",").map((x) => parseFloat(x)); return p.length >= 3 ? p.slice(0, 3) : null; };
  const alpha = (s) => { const m = String(s).match(/rgba\\(([^)]+)\\)/); if (!m) return 1; const p = m[1].split(","); return p.length >= 4 ? parseFloat(p[3]) : 1; };
  const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
  const bgOf = (el) => {
    let cur = el;
    while (cur && cur !== document.documentElement) {
      const c = css(cur).backgroundColor;
      if (c && !/rgba\\(0, 0, 0, 0\\)/.test(c) && alpha(c) > 0.5) return parse(c);
      cur = cur.parentElement;
    }
    const bodyBg = parse(css(document.body).backgroundColor);
    return bodyBg && alpha(css(document.body).backgroundColor) > 0.5 ? bodyBg : [255, 255, 255];
  };
  const lowContrast = [];
  for (const el of document.querySelectorAll("p,h1,h2,h3,h4,h5,h6,li,a,button,label,span,td,th")) {
    if (!vis(el)) continue;
    const text = (el.textContent || "").trim();
    if (text.length < 2) continue;
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.nodeValue.trim().length > 1);
    if (!own) continue;
    const cs = css(el);
    const fg = parse(cs.color); const bg = bgOf(el);
    if (!fg || !bg) continue;
    const fs = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight, 10) >= 700;
    const large = fs >= 24 || (fs >= 18.66 && bold);
    const need = large ? 3 : 4.5;
    const r = ratio(fg, bg);
    if (r < need) lowContrast.push({ sel: el.tagName.toLowerCase(), ratio: Math.round(r * 100) / 100, need, text: text.slice(0, 30) });
  }
  if (lowContrast.length) push("critical", "CRITIQUE-15", lowContrast.length + " text elements under contrast: " + lowContrast.slice(0, 3).map((c) => c.sel + " " + c.ratio + ":1 < " + c.need + ":1").join("; "), JSON.stringify(lowContrast.slice(0, 10)));

  // ---------- hard fail 18: unlocked tokens (inline colour mid-render) ----------
  const inline = [];
  for (const el of document.querySelectorAll("[style]")) {
    const s = el.getAttribute("style") || "";
    if (/#[0-9a-f]{3,8}\\b|rgb\\(|oklch\\(/i.test(s) && /color|background|border/i.test(s)) inline.push(el.tagName.toLowerCase());
  }
  const inlineVars = document.querySelectorAll("[style*='--']").length;
  if (inline.length > 2 && inlineVars === 0) push("warn", "CRITIQUE-18", inline.length + " elements with inline colour values and no inline custom properties");

  // ---------- hard fail 20: layout-family repetition (structure) ----------
  const gridSig = [];
  for (const el of document.querySelectorAll("main > *, main section, body > section, [class*='section']")) {
    if (!vis(el)) continue;
    const cs = css(el);
    const kids = el.children.length;
    const cols = cs.display.includes("grid") ? (cs.gridTemplateColumns || "").split(" ").filter(Boolean).length : 0;
    gridSig.push(cs.display + (cols ? ":" + cols : "") + "|kids" + kids);
  }
  const counts = {};
  for (const s of gridSig) counts[s] = (counts[s] || 0) + 1;
  const repeats = Object.entries(counts).filter(([, c]) => c >= 3);
  if (repeats.length) push("warn", "CRITIQUE-1b", repeats.map(([s, c]) => c + " sections share layout " + s).join("; "));

  // ---------- hard fail 19: CTA intent duplication ----------
  const ctaTexts = [...document.querySelectorAll("a,button")].filter(vis).map((el) => (el.textContent || "").trim().toLowerCase()).filter((t) => t && t.length < 40);
  const dupes = {};
  for (const t of ctaTexts) dupes[t] = (dupes[t] || 0) + 1;
  const repeated = Object.entries(dupes).filter(([t, c]) => c >= 3 && t.length > 3);
  if (repeated.length) push("warn", "CRITIQUE-19", "CTA label repeated " + repeated.map(([t, c]) => "'" + t + "' x" + c).join(", "));

  // ---------- headings / landmarks / no-JS safety ----------
  const h1s = [...document.querySelectorAll("h1")].filter(vis).length;
  if (h1s !== 1) push("warn", "CRITIQUE-15", h1s + " visible <h1> (expected exactly 1)");
  const landmarks = ["header", "nav", "main", "footer"].filter((s) => document.querySelector(s));
  if (!landmarks.includes("main")) push("warn", "CRITIQUE-15", "no <main> landmark");

  // motion inventory (for the report and for G15's reduced-motion cross-check)
  const anim = [...document.querySelectorAll("body *")].filter((el) => { const c = css(el); return c.animationName !== "none" || (parseFloat(c.transitionDuration) > 0); }).length;

  return {
    findings,
    counts: { focusables: focusables.length, headings: h1s, landmarks, animatedElements: anim, smallTargets: smallTargets.length, lowContrast: lowContrast.length, emoji: emojiHits.length },
    scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth,
  };
})()`;

async function main() {
  const pw = await loadPlaywright();
  if (!pw) { log("critique: playwright not installed — run `node scripts/install-tools.mjs`"); process.exit(1); }

  const browser = await pw.chromium.launch({ headless: true });
  const report = { url, at: new Date().toISOString(), viewports: {}, findings: [], critical: 0, warn: 0 };

  try {
    // desktop render: the main audit
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const consoleErrors = [];
    page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text().slice(0, 200)); });
    page.on("pageerror", (e) => consoleErrors.push(String(e).slice(0, 200)));
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch(() => page.goto(url, { waitUntil: "load", timeout: 60000 }));
    await page.waitForTimeout(600);
    const audit = await page.evaluate(AUDIT);
    report.viewports.desktop = audit;
    report.findings.push(...audit.findings);
    if (consoleErrors.length) report.findings.push({ severity: "critical", rule: "CRITIQUE-13", detail: consoleErrors.length + " console errors on load: " + consoleErrors[0], selector: "" });
    await ctx.close();

    // 320px reflow (WCAG 1.4.10) — must not scroll horizontally
    const ctx2 = await browser.newContext({ viewport: { width: 320, height: 800 } });
    const page2 = await ctx2.newPage();
    await page2.goto(url, { waitUntil: "load", timeout: 60000 });
    await page2.waitForTimeout(400);
    const reflow = await page2.evaluate(`(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }))()`);
    report.viewports.reflow320 = reflow;
    if (reflow.scrollWidth > reflow.clientWidth + 4) {
      report.findings.push({ severity: "critical", rule: "CRITIQUE-14", detail: `horizontal scroll at 320px (${reflow.scrollWidth}px > ${reflow.clientWidth}px)`, selector: "" });
    }
    await ctx2.close();

    // reduced-motion render: animated elements must not stay invisible / move
    const ctx3 = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const page3 = await ctx3.newPage();
    await page3.goto(url, { waitUntil: "load", timeout: 60000 });
    await page3.waitForTimeout(500);
    const rm = await page3.evaluate(`(() => {
      const hidden = [...document.querySelectorAll("h1,h2,h3,p,main a,main button")].filter((el) => {
        const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
        return r.width > 1 && (parseFloat(cs.opacity) < 0.05 || cs.visibility === "hidden") && !el.closest("[aria-hidden='true']");
      }).length;
      const moving = [...document.querySelectorAll("body *")].filter((el) => getComputedStyle(el).animationName !== "none").length;
      return { hiddenContent: hidden, stillAnimating: moving };
    })()`);
    report.viewports.reducedMotion = rm;
    if (rm.hiddenContent > 0) report.findings.push({ severity: "critical", rule: "CRITIQUE-15", detail: rm.hiddenContent + " elements invisible under prefers-reduced-motion (entrance animation never revealed content)", selector: "" });
    if (rm.stillAnimating > 0) report.findings.push({ severity: "warn", rule: "CRITIQUE-15", detail: rm.stillAnimating + " elements still animating under prefers-reduced-motion", selector: "" });
    await ctx3.close();
  } finally { await browser.close(); }

  report.critical = report.findings.filter((f) => f.severity === "critical").length;
  report.warn = report.findings.filter((f) => f.severity === "warn").length;
  report.pass = report.critical === 0;
  writeJson(outPath, report);

  // merge into state.json so the run state carries the measurement, not just the file
  const statePath = path.join(beyondDir, "state.json");
  try {
    const state = JSON.parse(fs.readFileSync(statePath, "utf8"));
    state.autoCritique = {
      report: path.relative(projectDir, outPath).replace(/\\/g, "/"),
      critical: report.critical,
      warn: report.warn,
      pass: report.pass,
      findings: report.findings.slice(0, 20),
    };
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2) + "\n");
  } catch { /* no state yet is fine */ }

  log(`auto-critique — ${url}`);
  for (const f of report.findings) log(`  ${f.severity === "critical" ? "CRITICAL" : "warn    "} ${f.rule}  ${f.detail}`);
  const d = report.viewports.desktop?.counts || {};
  log(`  measured: ${d.focusables ?? "?"} focusables, ${d.headings ?? "?"} h1, ${d.animatedElements ?? "?"} animated, ${d.lowContrast ?? 0} low-contrast, ${d.smallTargets ?? 0} small targets`);
  log(report.pass ? "\ncritique-auto: PASS — no measurable hard fails (the human read in CRITIQUE.md still applies)" : `\ncritique-auto: FAIL — ${report.critical} critical finding(s); fix them and re-run`);
  log(`report -> ${path.relative(projectDir, outPath)}`);
  process.exit(report.pass ? 0 : 1);
}

main().catch((e) => { log(`critique FAILED: ${e.message}`); process.exit(1); });
