#!/usr/bin/env node
/**
 * beyond-ui craft check — static audit of the build against references/CRAFT.md (G17).
 *
 *   node scripts/craft-check.mjs [projectDir]
 *
 * Every rule here is a defect that shipped on a real site and was caught late: split headings that
 * screen readers spell out, SVG-refraction glass that renders nothing in Safari, WebGL that flickers on
 * phones and leaks contexts, a cursor that blurs because it scales up, rAF loops that never stop.
 * Writes `.beyond-ui/craft-audit.json`; exit 1 when a critical finding exists.
 */
import fs from "node:fs";
import path from "node:path";

const projectDir = path.resolve(process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : process.cwd());
const beyondDir = path.join(projectDir, ".beyond-ui");
const outPath = path.join(beyondDir, "craft-audit.json");

const SRC_DIRS = ["app", "src", "components", "pages", "routes", "views", "ui", "widgets", "features", "layouts", "lib", "hooks"];
const SKIP = /node_modules|\.next|\.nuxt|\.svelte-kit|\/dist\/|\/build\/|\/out\/|coverage|\.beyond-ui|\.agents|\.git\//;
const EXT = /\.(tsx|jsx|vue|svelte|ts|js|mjs|css|astro)$/;

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (SKIP.test(p.replace(/\\/g, "/") + (e.isDirectory() ? "/" : ""))) continue;
    if (e.isDirectory()) walk(p, out);
    else if (EXT.test(e.name)) out.push(p);
  }
  return out;
}

const files = [...new Set(SRC_DIRS.flatMap((d) => walk(path.join(projectDir, d))))];
const texts = new Map(files.map((f) => [f, fs.readFileSync(f, "utf8")]));
const rel = (f) => path.relative(projectDir, f).replace(/\\/g, "/");
const lineOf = (t, i) => t.slice(0, i).split("\n").length;
const findings = [];
const add = (severity, rule, recipe, file, index, detail) =>
  findings.push({ severity, rule, recipe, file: rel(file), line: index == null ? null : lineOf(texts.get(file), index), detail });

const REDUCED = /prefers-reduced-motion|useReducedMotion|reducedMotion/;
const MOBILE_GATE = /max-width|min-width|useMedia|matchMedia|pointer:\s*(coarse|fine)|hover:\s*none|isMobile|useIsMobile|innerWidth|hardwareConcurrency/;

function importersOf(file) {
  const base = path.basename(file).replace(/\.(tsx|jsx|ts|js|vue|svelte)$/, "");
  if (base === "index") return [];
  const re = new RegExp(`from\\s+["'][^"']*[/"']${base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`);
  return files.filter((f) => f !== file && re.test(texts.get(f)));
}

let usesLenis = false;
let usesCssSmooth = null;

for (const [file, t] of texts) {
  if (/\.css$/.test(file)) {
    const m = t.match(/scroll-behavior:\s*smooth/);
    if (m) usesCssSmooth = { file, index: m.index };
    continue;
  }
  const isComponent = /\.(tsx|jsx|vue|svelte|astro)$/.test(file);

  if (isComponent) {
    for (const m of t.matchAll(/<(div|span|p|section|li|h[1-6])\b([^>]*?)\saria-label=/g)) {
      if (!/\brole=/.test(m[2])) add("critical", "CR-ARIA", "R2", file, m.index, `aria-label on a <${m[1]}> without a role is invalid ARIA; use sr-only text and aria-hidden on the visual`);
    }
    const splits = t.match(/\.split\(\s*["'`]\s?["'`]\s*\)/);
    if (splits && /motion\.|gsap|animate\(|SplitText|anime\(/.test(t) && !/sr-only|visually-hidden|VisuallyHidden/.test(t)) {
      add("critical", "CR-SPLIT", "R2", file, splits.index, "animated split text without an sr-only full sentence; screen readers read fragments or spell letters");
    }
    const clip = t.match(/(y:\s*["'`]1\d\d%|translateY\(1\d\d%\)|yPercent:\s*1\d\d)/);
    if (clip && /overflow-hidden|overflow:\s*["']?hidden/.test(t) && !/pb-\[0?\.\d+em\]|pb-\[\d*\.?\d+em\]|paddingBottom:\s*["']0?\.\d+em|padding-bottom:\s*0?\.\d+em|pb-\[0\.\d+em\]/.test(t)) {
      add("warn", "CR-OVERHANG", "R2", file, clip.index, "mask/clip reveal without em-based overhang padding; italic tails, descenders and '?' will clip");
    }
    const tall = [...t.matchAll(/className=["'`{][^"'`}]*\bh-screen\b[^"'`}]*/g)].find((m) => !/\b(sticky|fixed)\b/.test(m[0]));
    if (tall) add("warn", "CR-VIEWPORT", "PARITY", file, tall.index, "h-screen outside a sticky/fixed stage (first in this file); use min-h-[100svh] (stable under the mobile URL bar)");
  }

  const raf = t.match(/requestAnimationFrame\(/);
  if (raf && /useEffect|onMounted|onMount|connectedCallback/.test(t) && !/cancelAnimationFrame|autoRaf|gsap\.ticker/.test(t)) {
    add("warn", "CR-RAF", "R9", file, raf.index, "rAF started in an effect with no cancelAnimationFrame in cleanup; a self-scheduling loop keeps running after unmount");
  }

  for (const m of t.matchAll(/addEventListener\(\s*["'](scroll|wheel|touchstart|touchmove|pointermove|mousemove)["'][^;\n]*/g)) {
    if (!/passive/.test(m[0])) add("warn", "CR-PASSIVE", "R9", file, m.index, `${m[1]} listener without { passive: true }`);
  }

  const webgl = t.match(/getContext\(\s*["'](webgl2?|experimental-webgl)["']|new\s+(THREE\.)?WebGLRenderer|<Canvas[\s>]|from\s+["']ogl["']|new\s+Renderer\(/);
  if (webgl) {
    const scope = [t, ...importersOf(file).map((f) => texts.get(f))].join("\n");
    const isR3F = /<Canvas[\s>]/.test(t);
    if (!REDUCED.test(scope)) add("critical", "CR-WEBGL-MOTION", "R5", file, webgl.index, "WebGL animation ignores prefers-reduced-motion; draw once and stop");
    if (!/IntersectionObserver|useInView|frameloop=|document\.hidden|visibilitychange|inView/.test(scope)) add("warn", "CR-WEBGL-PAUSE", "R5", file, webgl.index, "WebGL keeps rendering off-screen; pause with IntersectionObserver / document.hidden / frameloop=\"demand\"");
    if (!isR3F && !/loseContext|dispose\(|forceContextLoss/.test(t)) add("warn", "CR-WEBGL-LEAK", "R5", file, webgl.index, "WebGL context never released on unmount (WEBGL_lose_context); browsers cap live contexts");
    if (!MOBILE_GATE.test(scope)) add("critical", "CR-WEBGL-MOBILE", "R5", file, webgl.index, "no mobile gate in this file or its importers; phones should get the static fallback");
    if (!/[Ff]allback|poster|placeholder|bg-gradient|radial-gradient|linear-gradient/.test(scope)) add("warn", "CR-WEBGL-FALLBACK", "R5", file, webgl.index, "no designed fallback painted under the canvas (no-WebGL devices and first paint)");
  }

  const glass = t.match(/backdrop-?[Ff]ilter[^;\n]*url\(\s*#|backdropFilter[^\n]*`url\(#|backdropFilter:\s*["']url\(#/);
  if (glass && !/CSS\.supports|userAgent|style\.backdropFilter\s*=|supports\(/.test(t)) {
    add("critical", "CR-GLASS", "R3", file, glass.index, "SVG-filter backdrop without a capability probe; Safari and Firefox render nothing behind the element");
  }

  if (/cursor/i.test(path.basename(file)) && isComponent && /pointermove|mousemove/.test(t)) {
    if (!/pointer:\s*fine|hover:\s*hover|pointerType/.test(t)) add("critical", "CR-CURSOR-TOUCH", "R7", file, null, "custom cursor not limited to (pointer: fine); it renders on touch screens");
    if (!REDUCED.test(t)) add("warn", "CR-CURSOR-MOTION", "R7", file, null, "custom cursor ignores prefers-reduced-motion");
    const up = t.match(/scale:\s*[^,}\n]*?\b([2-9](\.\d+)?)\b|scale\(\s*([2-9](\.\d+)?)\s*\)/);
    if (up && !/\/\s*[A-Z_]*MAX|\/\s*\w*[Mm]ax/.test(t)) add("warn", "CR-CURSOR-BLUR", "R7", file, up.index, "cursor scales up from a small element and rasterises blurry; render at max size and scale down");
  }

  if (/new\s+Lenis\(/.test(t)) {
    usesLenis = true;
    if (!REDUCED.test(t)) add("warn", "CR-LENIS", "R8", file, t.indexOf("new Lenis("), "Lenis runs under prefers-reduced-motion");
  }
  if (/\bscroll-smooth\b/.test(t)) usesCssSmooth = usesCssSmooth || { file, index: t.indexOf("scroll-smooth") };
}

if (usesLenis && usesCssSmooth) add("warn", "CR-SMOOTH", "R8", usesCssSmooth.file, usesCssSmooth.index, "CSS smooth scrolling and Lenis together fight each other");

const critical = findings.filter((f) => f.severity === "critical").length;
const warn = findings.length - critical;
const report = { at: new Date().toISOString(), filesScanned: files.length, critical, warn, pass: files.length > 0 && critical === 0, findings };
fs.mkdirSync(beyondDir, { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(report, null, 2) + "\n");

console.log(`craft-check — ${projectDir} (${files.length} files)`);
for (const f of findings) console.log(`  ${f.severity === "critical" ? "CRIT" : "warn"}  ${f.rule} [CRAFT ${f.recipe}] ${f.file}${f.line ? `:${f.line}` : ""} — ${f.detail}`);
if (!files.length) console.log("  no source files found — run from the project root");
console.log(`\ncraft: ${report.pass ? "PASS" : "FAIL"} — ${critical} critical, ${warn} warn -> ${path.relative(projectDir, outPath)}`);
process.exit(report.pass ? 0 : 1);
