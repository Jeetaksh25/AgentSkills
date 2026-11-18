#!/usr/bin/env node
/**
 * Builds a showcase-slides deck into one self-contained HTML file.
 *
 *   node build.mjs <deck.html> [--out <file.html>] [--open]
 *
 * <deck.html> holds one <deck ...> element whose children are <section class="slide"> blocks and,
 * optionally, <style> blocks with deck-specific CSS. Attributes on <deck>:
 *   title    browser tab and slide-list title            (required)
 *   theme    paper | midnight | editorial | swiss         (default paper)
 *   footer   left footer text on every content slide      (optional)
 *   accent   hex colour that replaces the theme accent    (optional)
 *   font     Google Fonts family for body and headings    (optional)
 *   lang     html lang attribute                          (default en)
 *   zoom-max largest auto-fit zoom, 1.0 to 2.0            (default 1.6)
 *
 * The engine (assets/engine.css, themes.css, engine.js, shell.html) is inlined untouched, so every
 * deck gets the same controls, auto-fit, animations, QA mode and print-to-PDF behaviour.
 */
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const assets = path.resolve(here, "..", "assets");
const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const value = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const input = args.find((a, i) => !a.startsWith("--") && args[i - 1] !== "--out");

if (!input) {
  console.error("usage: node build.mjs <deck.html> [--out <file.html>] [--open]");
  process.exit(2);
}

const THEMES = {
  paper: ["Geist:wght@400;500;600;700", "Geist+Mono:wght@500"],
  midnight: ["Inter:wght@400;500;600;700", "Inter+Tight:wght@600;700;800", "JetBrains+Mono:wght@500"],
  editorial: ["Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700", "Inter:wght@400;500;600;700", "JetBrains+Mono:wght@500"],
  swiss: ["Inter+Tight:wght@400;500;600;700;800", "JetBrains+Mono:wght@500"],
};

const src = fs.readFileSync(input, "utf8");
const m = /<deck\b([^>]*)>([\s\S]*?)<\/deck>/i.exec(src);
if (!m) {
  console.error(`${input}: no <deck ...> ... </deck> element found`);
  process.exit(1);
}

const attrs = {};
for (const a of m[1].matchAll(/([a-zA-Z][\w-]*)\s*=\s*"([^"]*)"/g)) attrs[a[1].toLowerCase()] = a[2];
let body = m[2];

const styles = [];
body = body.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, (_, css) => { styles.push(css); return ""; });

const theme = (attrs.theme || "paper").toLowerCase();
if (!THEMES[theme]) {
  console.error(`unknown theme "${theme}". Use one of: ${Object.keys(THEMES).join(", ")}`);
  process.exit(1);
}
if (!attrs.title) console.warn("warning: <deck> has no title attribute");

const families = [...THEMES[theme]];
const overrides = [];
if (attrs.font) {
  families.unshift(`${attrs.font.trim().replace(/\s+/g, "+")}:wght@400;500;600;700;800`);
  overrides.push(`--font: "${attrs.font}", system-ui, sans-serif;`, `--font-display: "${attrs.font}", system-ui, sans-serif;`);
}
if (attrs.accent) {
  const c = attrs.accent.trim();
  if (!/^#[0-9a-f]{6}$/i.test(c)) {
    console.error(`accent must be a 6-digit hex colour like #1976d2, got "${c}"`);
    process.exit(1);
  }
  overrides.push(
    `--accent: ${c};`,
    `--accent-strong: color-mix(in srgb, ${c} 80%, #000);`,
    `--accent-ink: color-mix(in srgb, ${c} 74%, #000);`,
    `--accent-soft: color-mix(in srgb, ${c} 12%, var(--card));`,
    `--accent-line: color-mix(in srgb, ${c} 34%, var(--card));`,
    `--accent-halo: color-mix(in srgb, ${c} 14%, transparent);`,
    `--accent-glow: color-mix(in srgb, ${c} 24%, transparent);`,
    `--inv-accent: color-mix(in srgb, ${c} 58%, #fff);`,
    `--inv-accent-soft: color-mix(in srgb, ${c} 16%, transparent);`,
  );
}
const overrideCss = overrides.length ? `\n[data-theme="${theme}"] { ${overrides.join(" ")} }\n` : "";

const fonts = [
  '<link rel="preconnect" href="https://fonts.googleapis.com">',
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
  `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${families.map((f) => `family=${f}`).join("&")}&display=swap">`,
].join("\n");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const config = JSON.stringify({ footer: attrs.footer || "", zoomMax: attrs["zoom-max"] ? Number(attrs["zoom-max"]) : 1.6 }).replace(/</g, "\\u003c");
const read = (f) => fs.readFileSync(path.join(assets, f), "utf8");
const css = [read("themes.css"), read("engine.css"), overrideCss, ...styles].join("\n");

const fill = (tpl, map) => Object.entries(map).reduce((out, [k, v]) => out.split(`{{${k}}}`).join(v), tpl);
const html = fill(read("shell.html"), {
  LANG: esc(attrs.lang || "en"),
  THEME: theme,
  TITLE: esc(attrs.title || "Slides"),
  FONTS: fonts,
  CSS: css,
  SLIDES: body.trim(),
  CONFIG: config,
  JS: read("engine.js"),
});

const inDir = path.dirname(path.resolve(input));
let out = value("--out");
if (!out) out = path.basename(input).toLowerCase() === "index.html" ? path.join(inDir, "dist", "index.html") : path.join(inDir, "index.html");
out = path.resolve(out);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);

const sections = (body.match(/<section\b[^>]*class="[^"]*\bslide\b/g) || []).length;
const noted = (body.match(/<aside\b[^>]*class="[^"]*\bnotes\b/g) || []).length;
const refsAll = [...body.matchAll(/<img\b[^>]*src="([^"]+)"/g), ...body.matchAll(/\sdata-bg="([^"]+)"/g)].map((x) => x[1]);
const remote = refsAll.filter((s) => /^https?:/.test(s));
const images = refsAll.filter((s) => !/^(https?:|data:)/.test(s));
const missing = images.filter((s) => !fs.existsSync(path.resolve(path.dirname(out), s)));

console.log(`built ${out}`);
console.log(`  ${sections} slide(s), theme ${theme}${attrs.accent ? `, accent ${attrs.accent}` : ""}${attrs.font ? `, font ${attrs.font}` : ""}, ${(html.length / 1024).toFixed(0)} KB`);
console.log(`  speaker notes on ${noted} of ${sections} slide(s)`);
if (sections === 0) console.log("  WARN no <section class=\"slide\"> found");
if (missing.length) console.log(`  WARN images not found next to the output: ${missing.join(", ")}`);
if (remote.length) console.log(`  WARN ${remote.length} image(s) are hotlinked from the internet and will be blank offline: download them with fetch-images.mjs`);
console.log(`  next: node ${path.join(here, "qa.mjs")} "${out}"`);

if (flag("--open")) {
  const opener = process.platform === "win32" ? ["cmd", ["/c", "start", "", out]] : process.platform === "darwin" ? ["open", [out]] : ["xdg-open", [out]];
  spawn(opener[0], opener[1], { detached: true, stdio: "ignore" }).unref();
}
