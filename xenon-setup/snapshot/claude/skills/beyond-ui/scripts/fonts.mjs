#!/usr/bin/env node
/**
 * beyond-ui fonts — choose type like a designer, from the 10 best free font libraries, never by reflex.
 *
 *   node scripts/fonts.mjs search [projectDir] [--mood "editorial calm"]   -> .beyond-ui/fonts/candidates.json + shortlist.json
 *   node scripts/fonts.mjs specimen [projectDir] [--headline "..."]        -> .beyond-ui/fonts/specimen.html + specimen-*.png
 *   node scripts/fonts.mjs choose --display "X" --text "Y" [--mono "Z"] --why "..." [projectDir]
 *
 * Libraries searched automatically:
 *   API:      Google Fonts (popularity + trending), Fontshare, Fontsource (incl. non-Google open fonts)
 *   Scrapling: Velvetyne, Uncut, Collletttivo, Open Foundry, Use & Modify, Tunera, Font Squirrel
 * The most-used families on Google Fonts are excluded automatically (they ARE the AI-slop look), on top
 * of an explicit ban list. The shortlist is rendered as a specimen with the product's real copy; the
 * agent looks at the screenshots and decides, then records the choice and the reason (G21).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { launchChromium } from "./lib/browser.mjs";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const cmd = argv[0];
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : d; };
const valueIdx = new Set(argv.flatMap((a, i) => (a.startsWith("--") ? [i + 1] : [])));
const positional = argv.slice(1).filter((a, i) => !a.startsWith("--") && !valueIdx.has(i + 1));
const projectDir = path.resolve(positional.find((a) => fs.existsSync(a)) || process.cwd());
if (!path.relative(skillRoot, projectDir).startsWith("..")) { console.log("fonts: run from the target project, not the skill folder"); process.exit(1); }
const beyondDir = path.join(projectDir, ".beyond-ui");
const fontsDir = path.join(beyondDir, "fonts");
const log = (...a) => console.log(...a);
const readJson = (p, d = null) => { try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return d; } };
const writeJson = (p, v) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n"); };
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, "");

const BANNED = ["Inter", "Roboto", "Open Sans", "Poppins", "Montserrat", "Lato", "Raleway", "Nunito", "Nunito Sans", "Oswald", "Bebas Neue", "Playfair Display", "Merriweather", "Lora", "Space Grotesk", "Space Mono", "Roboto Mono", "Roboto Slab", "Roboto Condensed", "Source Sans 3", "Source Code Pro", "Fira Code", "Courier Prime", "Ubuntu", "Arimo", "PT Sans", "Quicksand", "Comic Neue", "Pacifico", "Lobster", "Righteous", "Orbitron", "Exo 2", "Josefin Sans", "Dancing Script", "Abril Fatface"].map(norm);
const OVERUSED_RANK = 80;
const TASTE = ["Satoshi", "General Sans", "Switzer", "Clash Display", "Clash Grotesk", "Cabinet Grotesk", "Zodiak", "Erode", "Gambetta", "Sentient", "Supreme", "Boska", "Chillax", "Ranade", "Author", "Excon", "Synonym", "Telma", "Gambarino", "Bespoke Serif", "Bespoke Sans", "Array", "Instrument Sans", "Instrument Serif", "Bricolage Grotesque", "Fraunces", "Newsreader", "Hanken Grotesk", "Schibsted Grotesk", "Onest", "Geist", "Geist Mono", "Familjen Grotesk", "Hubot Sans", "Mona Sans", "Funnel Display", "Funnel Sans", "Host Grotesk", "Gloock", "Young Serif", "Literata", "Source Serif 4", "Spectral", "Libre Caslon Text", "Syne", "Unbounded", "Albert Sans", "Red Hat Display", "Rethink Sans", "Reddit Sans", "Golos Text", "Martian Mono", "Commit Mono", "Fragment Mono", "DM Mono", "Azeret Mono", "Departure Mono", "Spline Sans Mono", "Sometype Mono", "Bagnard", "Apfel Grotezk", "Gelasio", "Petrona", "Brygada 1918", "Epilogue", "Archivo", "Sora", "Figtree", "Be Vietnam Pro", "Bodoni Moda", "Cormorant", "EB Garamond", "Crimson Pro", "Inter Tight", "Manrope"].map(norm);
const NOVELTY = /(rough|sketch|pixel|hand|script|brush|marker|doodle|shadow|outline|stencil|glitch|graffiti|comic|kids|hollow|inline|3d|dots?|stripes?)/i;
const SCRIPT_SPECIFIC = /(HK|TC|SC|JP|KR|Sung|Hei|Mincho|Gothic A1|Arabic|Hebrew|Devanagari|Thai|Bangla|Tamil|Telugu|Kannada|Gujarati|Gurmukhi|Malayalam|Sinhala|Khmer|Lao|Myanmar|Ethiopic|Georgian|Armenian)/;
const SCRAPED = [
  { library: "Velvetyne", url: "https://velvetyne.fr", licence: "OFL (per font)" },
  { library: "Uncut", url: "https://uncut.wtf", licence: "free/open (per font)" },
  { library: "Collletttivo", url: "https://www.collletttivo.it", licence: "OFL (per font)" },
  { library: "Open Foundry", url: "https://open-foundry.com", licence: "OFL (per font)" },
  { library: "Use & Modify", url: "https://usemodify.com", licence: "open (per font)" },
  { library: "Tunera", url: "https://www.tunera.xyz/fonts/", licence: "OFL" },
  { library: "Font Squirrel", url: "https://www.fontsquirrel.com/fonts/list/hot_web", licence: "free commercial (per font)" },
];

const MOODS = {
  devtool: { display: ["sans-serif", "monospace"], text: ["sans-serif"], mono: true, words: "precise technical engineered" },
  ai: { display: ["sans-serif", "serif"], text: ["sans-serif"], mono: true, words: "intelligent calm modern" },
  dashboard: { display: ["sans-serif"], text: ["sans-serif"], mono: true, words: "dense legible numeric" },
  saas: { display: ["sans-serif", "serif"], text: ["sans-serif"], mono: false, words: "confident clean" },
  fintech: { display: ["sans-serif", "serif"], text: ["sans-serif"], mono: true, words: "trustworthy numeric" },
  editorial: { display: ["serif", "display"], text: ["serif", "sans-serif"], mono: false, words: "literary expressive" },
  productivity: { display: ["serif", "sans-serif"], text: ["sans-serif"], mono: false, words: "calm focused" },
  portfolio: { display: ["display", "serif", "sans-serif"], text: ["sans-serif"], mono: false, words: "distinctive personal" },
  agency: { display: ["display", "serif"], text: ["sans-serif"], mono: false, words: "bold expressive" },
  ecommerce: { display: ["serif", "sans-serif"], text: ["sans-serif"], mono: false, words: "premium tactile" },
  health: { display: ["serif", "sans-serif"], text: ["sans-serif"], mono: false, words: "warm soft reassuring" },
  education: { display: ["sans-serif", "serif"], text: ["sans-serif"], mono: false, words: "friendly clear" },
  game: { display: ["display", "sans-serif"], text: ["sans-serif"], mono: false, words: "loud energetic" },
};

async function getJson(url, strip = false) {
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (beyond-ui)" } });
  const t = await res.text();
  return JSON.parse(strip ? t.replace(/^\)\]\}'\n?/, "") : t);
}

const weightsOf = (arr) => [...new Set(arr.map(Number).filter((w) => w >= 100 && w <= 1000 && w % 50 === 0))].sort((a, b) => a - b);
const cat = (c) => { const s = String(c || "").toLowerCase(); return s.includes("mono") ? "monospace" : s.includes("sans") ? "sans-serif" : s.includes("serif") || s.includes("slab") ? "serif" : s.includes("hand") || s.includes("script") ? "handwriting" : s.includes("display") ? "display" : s; };

async function search() {
  const brief = readJson(path.join(beyondDir, "brief.json"), {});
  const moodArg = opt("mood", "");
  const tags = [...new Set([...(brief.tags || []), ...moodArg.split(/[\s,]+/).filter(Boolean)])];
  const moods = tags.map((t) => MOODS[t]).filter(Boolean);
  const want = {
    display: new Set(moods.flatMap((m) => m.display).concat(moods.length ? [] : ["sans-serif", "serif", "display"])),
    text: new Set(moods.flatMap((m) => m.text).concat(moods.length ? [] : ["sans-serif"])),
    mono: moods.some((m) => m.mono),
  };
  const fonts = new Map();
  const put = (f) => { const k = norm(f.family); const cur = fonts.get(k); fonts.set(k, cur ? { ...cur, ...Object.fromEntries(Object.entries(f).filter(([, v]) => v !== undefined && v !== null)), libraries: [...new Set([...(cur.libraries || []), ...f.libraries])] } : f); };
  const status = {};

  try {
    const g = await getJson("https://fonts.google.com/metadata/fonts", true);
    const byPop = g.familyMetadataList.slice().sort((a, b) => a.popularity - b.popularity);
    byPop.forEach((f, i) => {
      if (f.isNoto || f.isBrandFont || !(f.subsets || []).includes("latin")) return;
      const keys = Object.keys(f.fonts || {});
      put({ family: f.family, primaryScript: f.primaryScript || "", category: cat(f.category), weights: weightsOf(keys.map((k) => parseInt(k, 10))), italic: keys.some((k) => k.endsWith("i")), variable: (f.axes || []).length > 0, popularityRank: i + 1, trending: f.trending, added: f.dateAdded, libraries: ["Google Fonts"], licence: "OFL", load: { type: "google" }, url: `https://fonts.google.com/specimen/${encodeURIComponent(f.family).replace(/%20/g, "+")}` });
    });
    status.google = g.familyMetadataList.length;
  } catch (e) { status.google = `failed: ${e.message}`; }

  try {
    const fs1 = await getJson("https://api.fontshare.com/v2/fonts");
    for (const f of fs1.fonts || []) {
      put({ family: f.name, category: cat(f.category), weights: weightsOf((f.styles || []).map((s) => s.weight?.number)), italic: (f.styles || []).some((s) => s.is_italic), variable: (f.axes || []).length > 0, curated: !!(f.is_top || f.is_hot || f.is_shortlisted), libraries: ["Fontshare"], licence: "ITF Free Font License (free commercial)", load: { type: "fontshare", slug: f.slug }, url: `https://www.fontshare.com/fonts/${f.slug}` });
    }
    status.fontshare = (fs1.fonts || []).length;
  } catch (e) { status.fontshare = `failed: ${e.message}`; }

  try {
    const fsrc = await getJson("https://api.fontsource.org/v1/fonts?subsets=latin");
    for (const f of fsrc) {
      if (f.type === "google") { const cur = fonts.get(norm(f.family)); if (cur) cur.fontsource = f.id; continue; }
      put({ family: f.family, category: cat(f.category), weights: weightsOf(f.weights || []), italic: (f.styles || []).includes("italic"), variable: !!f.variable, libraries: ["Fontsource"], licence: f.license || "open", load: { type: "fontsource", id: f.id }, fontsource: f.id, url: `https://fontsource.org/fonts/${f.id}` });
    }
    status.fontsource = fsrc.length;
  } catch (e) { status.fontsource = `failed: ${e.message}`; }

  const scrapedDir = path.join(fontsDir, "libraries");
  for (const lib of SCRAPED) {
    const out = path.join(scrapedDir, `${norm(lib.library)}.md`);
    fs.mkdirSync(scrapedDir, { recursive: true });
    if (!fs.existsSync(out)) spawnSync(process.execPath, [path.join(skillRoot, "scripts", "scrapling.mjs"), "scrape", lib.url, out], { encoding: "utf8", timeout: 180000 });
    const ok = fs.existsSync(out) && fs.statSync(out).size > 200;
    status[lib.library] = ok ? `scraped -> ${path.relative(projectDir, out)}` : "scrape failed";
    if (!ok) continue;
    const md = fs.readFileSync(out, "utf8");
    const names = [...new Set([...md.matchAll(/^#{1,4}\s+([A-Z][\w &'-]{2,40})\s*$/gm), ...md.matchAll(/\[([A-Z][\w &'-]{2,30})\]\([^)]*(font|typeface)[^)]*\)/gi)].map((m) => m[1].trim()))].slice(0, 80);
    for (const n of names) if (!fonts.has(norm(n))) put({ family: n, category: "unknown", weights: [], libraries: [lib.library], licence: lib.licence, load: { type: "manual", url: lib.url }, url: lib.url, scraped: true });
  }

  const all = [...fonts.values()];
  const banned = (f) => BANNED.includes(norm(f.family)) || (f.popularityRank && f.popularityRank <= OVERUSED_RANK);
  const yearOf = (f) => parseInt(String(f.added || "").slice(0, 4), 10) || 0;
  const usable = (f) => !SCRIPT_SPECIFIC.test(f.family) && (!f.primaryScript || f.primaryScript === "Latn");
  const popBand = (f) => !f.popularityRank ? 4 : f.popularityRank <= 700 ? 10 : f.popularityRank <= 1400 ? 2 : -8;
  const base = (f) => (TASTE.includes(norm(f.family)) ? 25 : 0) + popBand(f) + (f.variable ? 8 : 0) + (f.curated ? 14 : 0) + (f.libraries.includes("Fontshare") ? 22 : f.libraries.includes("Fontsource") && !f.popularityRank ? 8 : 0) + (f.trending && f.trending < 300 ? 10 : 0) + (yearOf(f) >= 2020 ? 6 : 0) + Math.min(f.weights.length, 9) + (f.italic ? 3 : 0);
  const role = {
    display: (f) => (want.display.has(f.category) ? 20 : f.category === "display" ? 6 : -50) + (f.weights.some((w) => w >= 600) || f.category === "display" ? 6 : -10) + (/mono/i.test(f.family) ? -60 : 0) + (NOVELTY.test(f.family) && !tags.some((t) => ["game", "agency", "portfolio"].includes(t)) ? -60 : 0),
    text: (f) => (want.text.has(f.category) ? 20 : -50) + (/mono/i.test(f.family) || NOVELTY.test(f.family) ? -80 : 0) + (f.weights.includes(400) && f.weights.some((w) => w >= 600) ? 10 : -40) + (f.weights.length >= 4 ? 6 : -20),
    mono: (f) => (f.category === "monospace" ? 30 : -100) + (f.weights.length >= 3 ? 5 : 0),
  };
  const shortlist = {};
  for (const [r, fn] of Object.entries(role)) {
    if (r === "mono" && !want.mono) continue;
    const n = r === "mono" ? 4 : r === "display" ? 10 : 8;
    const ranked = all.filter((f) => !banned(f) && !f.scraped && f.weights.length && usable(f)).map((f) => ({ ...f, score: Math.round(base(f) + fn(f)) })).filter((f) => f.score > 20).sort((a, b) => b.score - a.score);
    const others = ranked.filter((f) => !f.libraries.includes("Google Fonts")).slice(0, r === "mono" ? 1 : 3);
    shortlist[r] = [...ranked.filter((f) => !others.includes(f)).slice(0, n - others.length), ...others].sort((a, b) => b.score - a.score);
  }
  writeJson(path.join(fontsDir, "candidates.json"), { at: new Date().toISOString(), status, count: all.length, excluded: all.filter(banned).map((f) => f.family), fonts: all });
  writeJson(path.join(fontsDir, "shortlist.json"), { at: new Date().toISOString(), tags, want: { display: [...want.display], text: [...want.text], mono: want.mono }, shortlist, scrapedLibraries: SCRAPED.map((s) => ({ ...s, file: status[s.library] })) });
  for (const [k, v] of Object.entries(status)) log(`  ${k.padEnd(14)} ${v}`);
  for (const [r, list] of Object.entries(shortlist)) log(`  ${r.padEnd(8)} ${list.map((f) => `${f.family} (${f.libraries[0]})`).join(" · ")}`);
  log(`fonts: ${all.length} families from ${Object.keys(status).length} libraries; ${all.filter(banned).length} overused/banned excluded`);
  log("next: `node <skill>/scripts/fonts.mjs specimen`, LOOK at the screenshots, then `fonts.mjs choose`. Browse the scraped libraries in .beyond-ui/fonts/libraries/ for faces the APIs do not carry.");
}

function cssFor(f, weights) {
  const ws = (f.weights.length ? f.weights : [400, 700]).filter((w) => weights.includes(w) || f.weights.length <= 2);
  const use = ws.length ? ws : f.weights.slice(0, 3);
  if (f.load?.type === "google") return `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(f.family).replace(/%20/g, "+")}:wght@${use.join(";")}&display=swap">`;
  if (f.load?.type === "fontshare") return `<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=${f.load.slug}@${use.join(",")}&display=swap">`;
  if (f.fontsource || f.load?.type === "fontsource") {
    const id = f.fontsource || f.load.id;
    return `<style>${use.map((w) => `@font-face{font-family:"${f.family}";font-weight:${w};font-display:swap;src:url(https://cdn.jsdelivr.net/fontsource/fonts/${id}@latest/latin-${w}-normal.woff2) format("woff2")}`).join("")}</style>`;
  }
  return "";
}

async function specimen() {
  const sl = readJson(path.join(fontsDir, "shortlist.json"));
  if (!sl) { log("specimen: run `fonts.mjs search` first"); process.exit(1); }
  const brief = readJson(path.join(beyondDir, "brief.json"), {});
  const headline = opt("headline", brief.idea ? brief.idea.split(/\s+/).slice(0, 5).join(" ").replace(/[,.;:]$/, "").replace(/^./, (c) => c.toUpperCase()) : "The quick brown fox jumps over the lazy dog");
  const body = opt("body", "Every pairing below is rendered with this product's own words, at real sizes, so the choice is made by eye, the way a designer makes it: rhythm, colour on the page, numerals, and how it holds up small.");
  const mix = (list, n, others) => { const o = list.filter((f) => !f.libraries.includes("Google Fonts")).slice(0, others); return [...list.filter((f) => !o.includes(f)).slice(0, n - o.length), ...o]; };
  const D = mix(sl.shortlist.display || [], 6, 2);
  const T = mix(sl.shortlist.text || [], 4, 1);
  const M = (sl.shortlist.mono || [])[0];
  const fontsUsed = [...new Map([...D, ...T, ...(M ? [M] : [])].map((f) => [f.family, f])).values()];
  const cards = [];
  for (const d of D) for (const t of T.filter((x) => x.family !== d.family).slice(0, 2)) {
    cards.push(`<article><div class="meta">${d.family} <span>${d.libraries[0]}</span> + ${t.family} <span>${t.libraries[0]}</span></div>
<h1 style="font-family:'${d.family}',serif">${headline}</h1>
<h2 style="font-family:'${d.family}',serif">Built for people who notice the details</h2>
<p style="font-family:'${t.family}',sans-serif">${body}</p>
<div class="ui" style="font-family:'${t.family}',sans-serif"><b>Get started</b><i>Pricing</i><i>Docs</i><em>0123456789 · 98.4% · $1,240.00</em></div>
${M ? `<code style="font-family:'${M.family}',monospace">const model = await load("v2.3") // ${M.family}</code>` : ""}</article>`);
  }
  const html = `<!doctype html><html><head><meta charset="utf-8">${fontsUsed.map((f) => cssFor(f, [400, 500, 600, 700])).join("\n")}
<style>body{margin:0;padding:40px;background:#f6f5f2;color:#161514;display:grid;grid-template-columns:repeat(2,1fr);gap:28px;font-family:system-ui}
article{background:#fff;border-radius:14px;padding:32px;box-shadow:0 1px 2px #0001}
.meta{font:12px/1.4 system-ui;color:#777;margin-bottom:18px}.meta span{color:#aaa}
h1{font-size:46px;line-height:1.02;letter-spacing:-.02em;margin:0 0 14px;font-weight:600}
h2{font-size:22px;line-height:1.2;margin:0 0 12px;font-weight:500}
p{font-size:16px;line-height:1.6;max-width:60ch;margin:0 0 18px}
.ui{display:flex;gap:18px;align-items:center;font-size:14px}.ui b{background:#161514;color:#fff;padding:9px 14px;border-radius:8px;font-weight:600}.ui i{font-style:normal;color:#555}.ui em{font-style:normal;font-variant-numeric:tabular-nums;margin-left:auto}
code{display:block;margin-top:16px;font-size:13px;color:#444}</style></head><body>${cards.join("\n")}</body></html>`;
  fs.mkdirSync(fontsDir, { recursive: true });
  const htmlPath = path.join(fontsDir, "specimen.html");
  fs.writeFileSync(htmlPath, html);
  const shots = [];
  const browser = await launchChromium(projectDir);
  if (browser) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.goto("file:///" + htmlPath.replace(/\\/g, "/"), { waitUntil: "networkidle" }).catch(() => {});
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(800);
    const height = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0, i = 1; y < height; y += 1000, i++) {
      const file = path.join(fontsDir, `specimen-${i}.png`);
      await page.screenshot({ path: file, fullPage: true, clip: { x: 0, y, width: 1440, height: Math.min(1000, height - y) } });
      shots.push(path.relative(projectDir, file).replace(/\\/g, "/"));
    }
    await browser.close();
  }
  writeJson(path.join(fontsDir, "specimen.json"), { at: new Date().toISOString(), html: path.relative(projectDir, htmlPath), shots, pairings: cards.length });
  log(`specimen -> ${path.relative(projectDir, htmlPath)}${shots.length ? ` + ${shots.length} screenshot(s): ${shots.join(", ")}` : " (playwright missing: open the html and screenshot it)"}`);
  log("next: LOOK at every specimen screenshot, then `fonts.mjs choose --display X --text Y [--mono Z] --why \"...\"`");
}

function choose() {
  const cands = readJson(path.join(fontsDir, "candidates.json"));
  if (!cands) { log("choose: run `fonts.mjs search` first"); process.exit(1); }
  const find = (n) => n && cands.fonts.find((f) => norm(f.family) === norm(n));
  const display = opt("display"), text = opt("text"), mono = opt("mono"), why = opt("why", "");
  const problems = [];
  const pick = {};
  for (const [role, name] of Object.entries({ display, text, mono })) {
    if (!name) continue;
    const f = find(name);
    if (!f) { problems.push(`${role} "${name}" is not in any searched library (re-run search, or add --allow-licensed "<licence note>")`); continue; }
    if (BANNED.includes(norm(f.family)) || (f.popularityRank && f.popularityRank <= OVERUSED_RANK)) problems.push(`${role} "${f.family}" is an overused default (Google popularity #${f.popularityRank ?? "-"}) — pick a face a designer would`);
    pick[role] = { family: f.family, library: f.libraries[0], licence: f.licence, url: f.url, load: f.load, fontsource: f.fontsource || null };
  }
  const licensed = opt("allow-licensed", null);
  if (licensed && problems.every((p) => p.includes("not in any searched library"))) problems.length = 0;
  if (!display || !text) problems.push("both --display and --text are required");
  if (why.length < 40) problems.push("--why must explain the choice (mood, reference match, legibility) in at least 40 characters");
  const spec = readJson(path.join(fontsDir, "specimen.json"));
  if (!spec?.shots?.length) problems.push("no specimen screenshots — run `fonts.mjs specimen` and look at them first");
  const choice = { at: new Date().toISOString(), ...pick, why, licensedOverride: licensed, specimen: spec?.shots || [], pass: problems.length === 0, problems };
  writeJson(path.join(fontsDir, "choice.json"), choice);
  for (const p of problems) log(`  FAIL ${p}`);
  log(choice.pass ? `fonts: chosen — ${display} / ${text}${mono ? ` / ${mono}` : ""}` : "fonts: choice rejected");
  process.exit(choice.pass ? 0 : 1);
}

const cmds = { search, specimen, choose };
if (!cmds[cmd]) { log("usage: node scripts/fonts.mjs search|specimen|choose  (see header)"); process.exit(2); }
await cmds[cmd]();
