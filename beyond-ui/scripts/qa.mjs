#!/usr/bin/env node
/**
 * beyond-ui QA runner — the "use it like a human" evidence layer.
 *
 *   node scripts/qa.mjs journey <url> [projectDir] [--journey <name>] [--headed]
 *   node scripts/qa.mjs check   <url> [projectDir]          # verify-style checks, no journey
 *
 * Walks the built UI in a real browser (Playwright; browser-use drives the same flows when its MCP
 * server is registered), and records MACHINE-GENERATED evidence into .beyond-ui/qa/<journey>.json +
 * screenshots, then merges the result into state.json -> verify + qa. Nothing here is self-reported:
 * the gate (verify-run G14) reads these files, so "it works on my machine" claims cannot pass it.
 *
 * Checks per journey:
 *   - screenshot at 390 / 768 / 1440 (real files on disk)
 *   - keyboard walk: Tab through interactive elements, focus visible (outline/ring/box-shadow)
 *   - reduced-motion pass: emulate prefers-reduced-motion, nothing critical disappears
 *   - console clean: no errors/warnings from app code
 *   - human-like steps: click the primary CTA, type into the first form field, scroll the journey
 *
 * Requires chromium (installed by scripts/install-tools.mjs). Exits 1 when the journey fails.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const cmd = args[0] || "check";
const url = args[1] || "";
const projectDir = path.resolve(args.slice(2).find((a) => !a.startsWith("--") && fs.existsSync(a)) || process.cwd());
const getOpt = (n, d) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : d; };

const beyondDir = path.join(projectDir, ".beyond-ui");
const qaDir = path.join(beyondDir, "qa");
const statePath = path.join(beyondDir, "state.json");

const log = (...a) => console.log(...a);
const readJson = (p, d = null) => { try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return d; } };
const writeJson = (p, v) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n"); };

const VIEWPORTS = [{ w: 390, h: 844 }, { w: 768, h: 1024 }, { w: 1440, h: 900 }];
const FOCUS_HINT = /ring|outline|shadow|border/i;

async function loadPlaywright() {
  // resolve from the skill folder first, then from the TARGET project's node_modules (the normal
  // case: playwright is installed into the project by scripts/install-tools.mjs, not into the skill)
  const { createRequire } = await import("node:module");
  const tries = [
    () => import("playwright"),
    () => import("playwright-core"),
    () => createRequire(path.join(projectDir, "package.json"))("playwright"),
    () => createRequire(path.join(projectDir, "package.json"))("playwright-core"),
    () => createRequire(path.join(projectDir, "package.json"))("@playwright/test"),
  ];
  for (const t of tries) { try { return await t(); } catch { /* next */ } }
  return null;
}

async function main() {
  if (!url) { log("usage: node scripts/qa.mjs journey|check <url> [projectDir]"); process.exit(1); }
  const pw = await loadPlaywright();
  if (!pw) { log("qa: playwright not installed — run `node scripts/install-tools.mjs` first"); process.exit(1); }
  const journeyName = getOpt("--journey", cmd === "journey" ? "hero-to-cta" : "check");
  fs.mkdirSync(qaDir, { recursive: true });

  const browser = await pw.chromium.launch({ headless: !process.argv.includes("--headed") });
  const report = { journey: journeyName, url, at: new Date().toISOString(), screenshots: [], keyboard: "unchecked", reducedMotion: "unchecked", console: "unchecked", steps: [], errors: [] };
  const consoleIssues = [];

  try {
    // ---- 1. screenshots at 3 viewports -----------------------------------------------
    for (const v of VIEWPORTS) {
      const ctx = await browser.newContext({ viewport: { width: v.w, height: v.h } });
      const page = await ctx.newPage();
      page.on("console", (m) => { if (["error", "warning"].includes(m.type())) consoleIssues.push(`${m.type()}: ${m.text().slice(0, 200)}`); });
      page.on("pageerror", (e) => consoleIssues.push(`pageerror: ${String(e).slice(0, 200)}`));
      await page.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch(() => page.goto(url, { waitUntil: "load", timeout: 60000 }));
      await page.waitForTimeout(800);
      const file = path.join(qaDir, `${journeyName}-${v.w}.png`);
      await page.screenshot({ path: file, fullPage: true });
      report.screenshots.push(path.relative(projectDir, file).replace(/\\/g, "/"));
      await ctx.close();
    }
    log(`screenshots: ${report.screenshots.length} (${VIEWPORTS.map((v) => v.w).join("/")})`);

    // ---- 2. keyboard walk (desktop viewport) ------------------------------------------
    {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: "load", timeout: 60000 });
      const stops = [];
      for (let i = 0; i < 30; i++) {
        await page.keyboard.press("Tab");
        const info = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el || el === document.body) return null;
          const cs = getComputedStyle(el);
          const visible = cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0
            || /ring|shadow/i.test(cs.boxShadow) || /ring|outline/i.test(el.className || "");
          return { tag: el.tagName.toLowerCase(), text: (el.textContent || "").trim().slice(0, 40), focusVisible: visible };
        });
        if (info) stops.push(info);
      }
      const visibleCount = stops.filter((s) => s.focusVisible).length;
      report.keyboard = stops.length > 0 && visibleCount === stops.length ? "pass" : stops.length === 0 ? "fail" : "fail";
      report.steps.push({ step: "keyboard-walk", stops: stops.length, focusVisible: visibleCount, detail: stops.slice(0, 12) });
      log(`keyboard: ${visibleCount}/${stops.length} stops with visible focus`);
      await ctx.close();
    }

    // ---- 3. reduced-motion pass -------------------------------------------------------
    {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: "load", timeout: 60000 });
      await page.waitForTimeout(500);
      const vis = await page.evaluate(() => {
        const heads = [...document.querySelectorAll("h1,h2")].filter((h) => { const r = h.getBoundingClientRect(); return r.width > 0 && r.height > 0; }).length;
        return { headings: heads, bodyHeight: document.body.scrollHeight };
      });
      const file = path.join(qaDir, `${journeyName}-reduced-motion.png`);
      await page.screenshot({ path: file });
      report.screenshots.push(path.relative(projectDir, file).replace(/\\/g, "/"));
      report.reducedMotion = vis.headings > 0 && vis.bodyHeight > 200 ? "pass" : "fail";
      report.steps.push({ step: "reduced-motion", ...vis });
      log(`reduced-motion: headings=${vis.headings} bodyHeight=${vis.bodyHeight}`);
      await ctx.close();
    }

    // ---- 4. human-like journey (CTA + form + scroll) -----------------------------------
    if (cmd === "journey") {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      page.on("console", (m) => { if (m.type() === "error") consoleIssues.push(`journey console: ${m.text().slice(0, 200)}`); });
      await page.goto(url, { waitUntil: "load", timeout: 60000 });
      // click the first primary-looking CTA
      const cta = page.locator("a,button").filter({ hasText: /start|try|get|book|sign|buy|join|demo/i }).first();
      if (await cta.count()) {
        await cta.scrollIntoViewIfNeeded().catch(() => {});
        await cta.click({ timeout: 5000 }).catch((e) => report.errors.push(`cta click: ${e.message.slice(0, 120)}`));
        await page.waitForTimeout(700);
        report.steps.push({ step: "click-cta", text: (await cta.textContent().catch(() => "")).trim().slice(0, 40), url: page.url() });
        log(`journey: clicked CTA -> ${page.url()}`);
      } else report.steps.push({ step: "click-cta", skipped: "no CTA matched" });
      // type into the first text input on the page (or back on the landing page)
      const input = page.locator("input[type=text],input[type=email],textarea").first();
      if (await input.count()) {
        await input.fill("qa@beyond-ui.test").catch((e) => report.errors.push(`type: ${e.message.slice(0, 120)}`));
        report.steps.push({ step: "type-input", ok: true });
        log("journey: typed into first input");
      } else report.steps.push({ step: "type-input", skipped: "no text input" });
      // scroll the whole journey
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } });
      report.steps.push({ step: "scroll-journey", ok: true });
      const file = path.join(qaDir, `${journeyName}-journey.png`);
      await page.screenshot({ path: file, fullPage: true });
      report.screenshots.push(path.relative(projectDir, file).replace(/\\/g, "/"));
      await ctx.close();
    }

    report.console = consoleIssues.length === 0 ? "clean" : "errors";
    report.consoleIssues = consoleIssues.slice(0, 20);
    log(`console: ${report.console}${consoleIssues.length ? ` (${consoleIssues.length} issue(s))` : ""}`);
  } finally {
    await browser.close();
  }

  const outFile = path.join(qaDir, `${journeyName}.json`);
  writeJson(outFile, report);
  log(`qa report -> ${path.relative(projectDir, outFile)}`);

  // merge into state.json so verify-run can gate on it
  const state = readJson(statePath);
  if (state) {
    state.verify = {
      ...(state.verify || {}),
      screenshots: [...new Set([...(state.verify?.screenshots || []), ...report.screenshots])],
      reducedMotion: report.reducedMotion,
      keyboard: report.keyboard,
      console: report.console,
    };
    state.qa = {
      ...(state.qa || {}),
      journeys: [...new Set([...(state.qa?.journeys || []), journeyName])],
      last: path.relative(projectDir, outFile).replace(/\\/g, "/"),
      passed: report.keyboard === "pass" && report.reducedMotion === "pass" && report.console === "clean",
    };
    writeJson(statePath, state);
  }

  const failed = report.keyboard !== "pass" || report.reducedMotion !== "pass" || report.console !== "clean" || report.errors.length > 0;
  log(failed ? "qa: FAIL — fix the reported issues and re-run" : "qa: PASS");
  process.exit(failed ? 1 : 0);
}

main().catch((e) => { log(`qa FAILED: ${e.message}`); process.exit(1); });
