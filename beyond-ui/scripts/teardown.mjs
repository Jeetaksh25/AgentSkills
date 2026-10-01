#!/usr/bin/env node
/**
 * beyond-ui teardown orchestrator — the reference pipeline: SELECT 10 -> TEARDOWN 10 -> SYNTHESIZE 1.
 *
 *   node scripts/teardown.mjs init [projectDir]              -> writes .beyond-ui/references-selection.json
 *   node scripts/teardown.mjs run   [projectDir] [--only <i,j>] [--skip-skillui] [--skip-capture]
 *                                                             --skip-scrapling [--screens 5]
 *                                                             -> tears down the selected sites, synthesizes
 *                                                             .beyond-ui/DESIGN-SKILL.md, then plans
 *                                                             .beyond-ui/{PLAN.json,SECTION-PLAN.md,BLOCK-MAP.md}
 *   node scripts/teardown.mjs synth [projectDir]             -> re-run only the synthesis step
 *
 * Per selected site, the teardown runs up to three capture layers (each independent):
 *   1. skillui (pinned version, ultra mode when playwright present; auto static fallback otherwise)
 *        -> <root>/<slug>/ SKILL.md references/ tokens/ screens/
 *   2. deep capture (scripts/capture-site.mjs, playwright)   -> <root>/<slug>-capture/capture.json + shots/
 *   3. scrapling acquisition (keyless)                     -> <root>/<slug>-capture/content.md pages/
 *        The batch fan-out runs through the scripts/scrapling.mjs CLI because it writes N files per
 *        site unattended; interactive one-off fetches prefer the mcp__scrapling__* tools directly.
 *
 * Then SYNTHESIS merges all teardowns into ONE condensed project skill: .beyond-ui/DESIGN-SKILL.md —
 * real extracted tokens/type/spacing/motion/structure, then the HAND-PICKED plan from scripts/plan.mjs.
 * Every step updates .beyond-ui/state.json -> selection / teardown / synthesis / plan.
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectDir = path.resolve(process.argv[3] && !process.argv[3].startsWith("--") ? process.argv[3] : process.cwd());

const cmd = process.argv[2] || "run";
const argv = process.argv.slice(3).filter((a) => !a.startsWith("--"));
const hasFlag = (f) => process.argv.includes(f);
const getOpt = (n, d) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : d; };

const beyondDir = path.join(projectDir, ".beyond-ui");
const selPath = path.join(beyondDir, "references-selection.json");
const statePath = path.join(beyondDir, "state.json");
const teardownRoot = path.join(beyondDir, "teardown");
const designSkillPath = path.join(beyondDir, "DESIGN-SKILL.md");

const log = (...a) => console.log(...a);
// Windows resolves npx/npm through cmd.exe, which means args are concatenated rather than passed as
// argv — quote anything containing whitespace so paths like "E:/My Projects/app" survive intact.
const quoteArg = (x) => { const s = String(x); return /[\s"&|<>^]/.test(s) ? `"${s.replace(/"/g, '\\"')}"` : s; };
const run = (c, a, o = {}) => {
  const useShell = process.platform === "win32";
  return execFileSync(c, useShell ? a.map(quoteArg) : a, {
    encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], shell: useShell, ...o,
  });
};

function loadState() { return fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, "utf8")) : null; }
function saveState(s) { if (fs.existsSync(statePath)) fs.writeFileSync(statePath, JSON.stringify(s, null, 2) + "\n"); }

function loadConfig() {
  const defaults = JSON.parse(fs.readFileSync(path.join(skillRoot, "assets", "config.json"), "utf8"));
  let project = {};
  try { project = JSON.parse(fs.readFileSync(path.join(beyondDir, "config.json"), "utf8")); } catch { /* absent */ }
  return { ...defaults, ...project, teardown: { ...defaults.teardown, ...project.teardown } };
}

const slugify = (u) => { try { const host = new URL(u).hostname.replace(/^www\./, ""); return host.split(".")[0].toLowerCase().replace(/[^a-z0-9-]/g, "-"); } catch { return u.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase().slice(0, 30); } };

// ------------------------------------------------------------------ init: scaffold selection file
function init() {
  fs.mkdirSync(beyondDir, { recursive: true });
  fs.mkdirSync(teardownRoot, { recursive: true });
  if (!fs.existsSync(selPath)) {
    fs.writeFileSync(selPath, JSON.stringify({
      frame: { domain: "", pageType: "", aesthetic: [], platform: "web", constraints: "" },
      selected: [], rejected: [], filledBy: "<agent — fill frame + selected after scouting galleries>",
    }, null, 2) + "\n");
    log(`created ${path.relative(projectDir, selPath)} — fill frame + selected (10 URLs) per references/TEARDOWN.md §2`);
  } else log(`keep ${path.relative(projectDir, selPath)} (exists)`);
}

function pwReady() {
  const pwRoot = path.join(process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local"), "ms-playwright");
  const hasBin = fs.existsSync(pwRoot) && fs.readdirSync(pwRoot).some((d) => d.startsWith("chromium"));
  let hasPkg = false;
  try { run("npx", ["--no-install", "playwright", "--version"], { stdio: "pipe" }); hasPkg = true; } catch { /* absent */ }
  return hasPkg && hasBin;
}

async function teardownSite(site, cfg, state) {
  const slug = slugify(site.url);
  const dir = path.join(teardownRoot, slug);
  const capDir = path.join(teardownRoot, `${slug}-capture`);
  fs.mkdirSync(capDir, { recursive: true }); // do NOT pre-create dir: skillui rename needs it absent
  const result = { url: site.url, slug, dir: path.relative(projectDir, dir), status: "failed", tokens: false, screens: false, contentMd: false, capture: false, seconds: 0 };
  const t0 = Date.now();
  log(`\n=== teardown ${site.url} ===`);

  // 1. skillui — pinned; ultra when playwright ready; static fallback is built-in to skillui itself
  if (!hasFlag("--skip-skillui")) {
    const mode = pwReady() ? ["--mode", "ultra"] : [];
    const screens = getOpt("--screens", String(cfg.teardown.screens));
    try {
      run("npx", ["-y", cfg.teardown.skilluiVersion, "--url", site.url, ...mode, "--screens", screens,
        "--out", teardownRoot, "--name", slug, "--format", "skill"], { timeout: cfg.teardown.timeoutSeconds * 1000 });
      // skillui writes <out>/<slug>-design/ ; normalize the directory name
      const gen = path.join(teardownRoot, `${slug}-design`);
      if (fs.existsSync(gen)) {
        if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true }); // stale pre-created dir
        fs.renameSync(gen, dir);
      }
      result.tokens = fs.existsSync(path.join(dir, "tokens", "colors.json"));
      result.screens = fs.existsSync(path.join(dir, "screens", "scroll", "scroll-000.png"));
      result.status = result.screens ? "ultra" : result.tokens ? "degraded" : "static";
      log(`  skillui: ${result.status}`);
    } catch (e) {
      log(`  skillui FAILED: ${String(e.stderr || e.message).split("\n")[0]}`);
      if (!fs.existsSync(dir) || fs.readdirSync(dir).length === 0) fs.rmSync(dir, { recursive: true, force: true });
    }
  } else log("  skillui skipped (--skip-skillui)");

  // 2. deep capture (playwright) — tokens, keyframes, interactions, shots at 390/768/1440
  if (!hasFlag("--skip-capture") && pwReady()) {
    try {
      run("node", [path.join(skillRoot, "scripts", "capture-site.mjs"), site.url, capDir], { timeout: cfg.teardown.timeoutSeconds * 1000 });
      result.capture = fs.existsSync(path.join(capDir, "capture.json"));
    } catch (e) { log(`  capture FAILED: ${String(e.stderr || e.message).split("\n")[0].slice(0, 200)}`); }
  } else log(pwReady() ? "  capture skipped (--skip-capture)" : "  capture skipped (playwright unavailable)");

  // 3. scrapling acquisition (keyless; soft-fails by design) — real copy structure per reference
  if (!hasFlag("--skip-scrapling")) {
    try {
      run("node", [path.join(skillRoot, "scripts", "scrapling.mjs"), "deep", site.url, capDir, "--pages", "3"], { timeout: 300000 });
      result.contentMd = fs.existsSync(path.join(capDir, "content.md"));
    } catch { /* scrapling.mjs exits non-zero only when every tier failed; the other layers still stand */ }
  } else log("  scrapling skipped (--skip-scrapling)");

  result.seconds = Math.round((Date.now() - t0) / 1000);
  return result;
}

// ------------------------------------------------------------------ synthesis: 10 -> 1 condensed skill
function parseSkilluiTokens(dir) {
  const out = { colors: null, spacing: null, typography: null };
  try { out.colors = JSON.parse(fs.readFileSync(path.join(dir, "tokens", "colors.json"), "utf8")); } catch { /* absent */ }
  try { out.spacing = JSON.parse(fs.readFileSync(path.join(dir, "tokens", "spacing.json"), "utf8")); } catch { /* absent */ }
  try { out.typography = JSON.parse(fs.readFileSync(path.join(dir, "tokens", "typography.json"), "utf8")); } catch { /* absent */ }
  return out;
}
function parseCapture(capDir) {
  try { return JSON.parse(fs.readFileSync(path.join(capDir, "capture.json"), "utf8")); } catch { return null; }
}
function mdSection(md, heading) {
  const m = typeof md === "string" && md.match(new RegExp(`^#{1,3} .*${heading}[^\n]*\\n([\\s\\S]*?)(?=\\n#{1,3} |$)`, "mi"));
  return m ? m[1].trim() : "";
}

// ---------------------------------------------------------------- colour maths (real WCAG numbers, not claims)
function parseColor(v) {
  if (typeof v !== "string") return null;
  const s = v.trim();
  let m = s.match(/^#([0-9a-f]{3,8})$/i);
  if (m) {
    let h = m[1];
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    if (h.length < 6) return null;
    return { r: parseInt(h.slice(0, 2), 16) / 255, g: parseInt(h.slice(2, 4), 16) / 255, b: parseInt(h.slice(4, 6), 16) / 255, a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1 };
  }
  m = s.match(/^rgba?\(([^)]+)\)$/i);
  if (m) {
    const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    if (p.length < 3 || p.some((n) => !isFinite(n))) return null;
    const [r, g, b, a = 1] = p;
    return { r: r / 255, g: g / 255, b: b / 255, a };
  }
  m = s.match(/^oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)/i);
  if (m) return oklchToRgb(parseFloat(m[1]) / (m[1].includes("%") ? 100 : 1), parseFloat(m[2]), parseFloat(m[3]));
  m = s.match(/^hsl\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/i);
  if (m) return hslToRgb(parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]));
  return null;
}
function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return { r: f(0), g: f(8), b: f(4), a: 1 };
}
function srgbToLinear(c) { return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
function relLum({ r, g, b }) { return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b); }
function contrast(a, b) {
  const l1 = relLum(a), l2 = relLum(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}
function oklchToRgb(L, C, H) {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h), bb = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * bb;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * bb;
  const s_ = L - 0.0894841775 * a - 1.291485548 * bb;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const b2 = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  const g2 = (x) => { const v = x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(Math.max(x, 0), 1 / 2.4) - 0.055; return Math.min(1, Math.max(0, v)); };
  return { r: g2(r), g: g2(g), b: g2(b2), a: 1 };
}
const hex = (c) => c ? "#" + [c.r, c.g, c.b].map((x) => Math.round(x * 255).toString(16).padStart(2, "0")).join("") : "";


function synthesize(cfg, state) {
  const sel = JSON.parse(fs.readFileSync(selPath, "utf8"));
  const sites = sel.selected.slice(0, cfg.teardown.targetSites);
  if (sites.length === 0) { log("no selected sites in references-selection.json — run selection first (references/TEARDOWN.md §2)"); process.exit(1); }

  const contributors = [];
  const agg = { accents: new Map(), neutrals: new Map(), families: new Map(), monoFamilies: new Map(), bases: new Map(),
    radii: new Map(), keyframeNames: [], keyframeOwners: new Map(), transitions: new Map(), motionLibs: new Map(),
    sections: [], sectionOwners: new Map(), layouts: [], interactions: 0, themes: new Map(),
    rootTokens: new Map(), typeScale: new Map(), roles: new Map(), contrast: [], interactionsDetail: [] };

  for (const site of sites) {
    const slug = slugify(site.url);
    const dir = path.join(teardownRoot, slug);
    const capDir = path.join(teardownRoot, `${slug}-capture`);
    if (!fs.existsSync(dir) && !fs.existsSync(capDir)) { log(`  ! no teardown for ${site.url} — skipped (run 'teardown.mjs run' first)`); continue; }
    const tokens = parseSkilluiTokens(dir);
    const cap = parseCapture(capDir);
    const entry = { url: site.url, slug, why: site.why || "", award: site.award || "", parts: [] };
    const owners = (map, key) => { if (key === undefined || key === null || key === "") return; map.set(String(key), [...(map.get(String(key)) || []), slug]); };

    if (tokens.colors) {
      entry.parts.push("tokens");
      const core = tokens.colors.core || {};
      if (core.accent) owners(agg.accents, core.accent.value);
      if (core.background) owners(agg.neutrals, core.background.value);
      if (core.surface) owners(agg.neutrals, core.surface.value);
      if (tokens.colors.meta?.theme) owners(agg.themes, tokens.colors.meta.theme);
      for (const [role, v] of Object.entries(tokens.colors.roles || core)) {
        const value = typeof v === "object" ? v.value : v;
        if (value) owners(agg.roles, `${role}=${value}`);
      }
    }
    if (tokens.typography) {
      entry.parts.push("type");
      for (const f of tokens.typography.families || []) owners(agg.families, f);
      for (const [role, def] of Object.entries(tokens.typography.scale || {})) {
        const key = `${role}: ${def.size || def.fontSize || ""}/${def.lineHeight || ""}${def.letterSpacing ? ` ${def.letterSpacing}` : ""}`.trim();
        if (key.length > 3) owners(agg.typeScale, key);
        if (/\b(mono|code)\b/i.test(def.fontFamily || "")) owners(agg.monoFamilies, def.fontFamily);
      }
    }
    if (tokens.spacing?.base?.value) owners(agg.bases, tokens.spacing.base.value);
    if (tokens.spacing?.scale) for (const v of Object.values(tokens.spacing.scale)) owners(agg.bases, typeof v === "object" ? v.value : v);
    if (tokens.colors?.radius || tokens.spacing?.radius) owners(agg.radii, tokens.colors?.radius || tokens.spacing?.radius);
    if (fs.existsSync(path.join(dir, "references", "ANIMATIONS.md"))) {
      entry.parts.push("animations");
      const anim = fs.readFileSync(path.join(dir, "references", "ANIMATIONS.md"), "utf8");
      const kf = [...anim.matchAll(/^### `@keyframes ([\w-]+)`/gm)].map((m) => m[1]);
      agg.keyframeNames.push(...kf.slice(0, 12));
      kf.slice(0, 12).forEach((k) => owners(agg.keyframeOwners, k));
      const motion = mdSection(anim, "Motion Technology Stack");
      for (const m of motion.matchAll(/^\| \*\*([^|]+?)\*\*/gm)) owners(agg.motionLibs, m[1].trim());
    }
    if (fs.existsSync(path.join(dir, "references", "LAYOUT.md"))) {
      entry.parts.push("layout");
      agg.layouts.push(mdSection(fs.readFileSync(path.join(dir, "references", "LAYOUT.md"), "utf8"), "Structural Containers").slice(0, 600));
    }
    if (cap) {
      entry.parts.push("capture");
      for (const k of cap.extract?.keyframes?.slice(0, 10) || []) { agg.keyframeNames.push(k.name); owners(agg.keyframeOwners, k.name); }
      for (const t of cap.extract?.transitions || []) owners(agg.transitions, t);
      for (const lib of cap.extract?.motionLibs || []) owners(agg.motionLibs, lib);
      for (const s of cap.extract?.sections || []) {
        const key = s.heading ? `${s.tag}: ${s.heading}` : s.tag;
        agg.sections.push(key); owners(agg.sectionOwners, key);
      }
      agg.interactions += (cap.interactions || []).length;
      for (const d of (cap.interactions || []).slice(0, 3)) {
        const changed = Object.keys(d.hovered || {}).filter((k) => d.before?.[k] !== d.hovered?.[k]);
        if (changed.length) agg.interactionsDetail.push({ slug, element: d.type, changed, hovered: d.hovered, focused: d.focused });
      }
      for (const f of cap.extract?.fonts?.loaded || []) owners(agg.families, f.split("|")[0]);
      for (const [k, v] of Object.entries(cap.extract?.rootTokens || {})) {
        if (!k.startsWith("--")) continue;
        owners(agg.rootTokens, `${k}: ${v}`);
        if (/radius/i.test(k)) owners(agg.radii, v);
      }
      // a real type scale from the captured computed styles (independent of skillui tokens)
      const st = cap.extract?.styles || {};
      for (const sel of ["h1", "h2", "h3", "p", "a", "button"]) {
        const s = st[sel];
        if (!s?.["font-size"]) continue;
        const parts = [`${sel}: ${s["font-size"]}`];
        if (s["line-height"] && s["line-height"] !== "normal") parts.push(`/${s["line-height"]}`);
        if (s["letter-spacing"] && s["letter-spacing"] !== "normal" && s["letter-spacing"] !== "0px") parts.push(` ${s["letter-spacing"]}`);
        if (s["font-family"]) parts.push(` ${String(s["font-family"]).split(",")[0].replace(/["']/g, "")}`);
        owners(agg.typeScale, parts.join(""));
        const r = s["border-radius"];
        if (r && r !== "0px") owners(agg.radii, `${r} (${sel})`);
      }
      // REAL contrast measurements over the captured computed styles
      const cs = cap.extract?.styles || {};
      const bgOf = (...sels) => { for (const s of sels) { const v = cs[s]?.["background-color"]; if (v && !/^(transparent|rgba?\(0,\s*0,\s*0,\s*0\))$/.test(v.trim())) return v; } return null; };
      const bodyBgRaw = bgOf("body", "section", "nav", "header", "footer");
      const bodyBg = parseColor(bodyBgRaw);
      if (bodyBg) {
        const pColour = parseColor(cs.p?.color);
        if (pColour) agg.contrast.push({ slug, pair: "body text / page background", ratio: +contrast(pColour, bodyBg).toFixed(2), fg: cs.p.color, bg: bodyBgRaw });
        const aColour = parseColor(cs.a?.color);
        if (aColour) agg.contrast.push({ slug, pair: "link text / page background", ratio: +contrast(aColour, bodyBg).toFixed(2), fg: cs.a.color, bg: bodyBgRaw });
        const h1Colour = parseColor(cs.h1?.color);
        if (h1Colour) agg.contrast.push({ slug, pair: "h1 / page background", ratio: +contrast(h1Colour, bodyBg).toFixed(2), fg: cs.h1.color, bg: bodyBgRaw });
      }
    }
    contributors.push(entry);
  }

  // ---- write the single condensed project skill ----
  const top = sites.slice(0, 3).map((s) => `[${slugify(s.url)}](${s.url})${s.award ? ` (${s.award})` : ""}`).join(" · ");
  const ranked = (map, limit, extra = true) => [...map.entries()]
    .sort((a, b) => b[1].length - a[1].length || String(a[0]).localeCompare(String(b[0])))
    .slice(0, limit)
    .map(([v, slugs]) => extra && slugs.length > 1 ? `${v}  [${slugs.length}x: ${[...new Set(slugs)].slice(0, 3).join(", ")}]` : v);
  const famList = ranked(new Map([...agg.families].filter(([f]) => !/mono|code/i.test(f))), 6);
  const monoList = ranked(agg.monoFamilies, 3);
  const kfList = [...new Set(agg.keyframeNames)].slice(0, 24);
  const kfWithOwners = kfList.map((k) => agg.keyframeOwners.has(k) ? `${k} [${[...new Set(agg.keyframeOwners.get(k))].length}x]` : k);
  const contrastFails = (agg.contrast || []).filter((c) => c.ratio < 4.5);
  const contrastPass = (agg.contrast || []).filter((c) => c.ratio >= 4.5);

  // the plan's concrete content is appended verbatim so DESIGN-SKILL.md is build-ready, not directional.
  // --no-plan means "do not re-run the planner", NOT "omit the plan": an existing plan is still embedded,
  // because a synthesis without §10 fails G11 by design.
  let planBlock = "";
  const sectionPlanPath = path.join(beyondDir, "SECTION-PLAN.md");
  const blockMapPath = path.join(beyondDir, "BLOCK-MAP.md");
  try {
    if (!hasFlag("--no-plan")) run("node", [path.join(skillRoot, "scripts", "plan.mjs"), projectDir], { stdio: "pipe" });
    else log("  (--no-plan) reusing the existing plan artifacts instead of re-running scripts/plan.mjs");
    if (fs.existsSync(sectionPlanPath) && fs.existsSync(blockMapPath)) {
      planBlock = `\n## 10. HAND-PICKED BUILD PLAN (real blocks, not a direction)\n\n${fs.readFileSync(sectionPlanPath, "utf8")}\n\n${fs.readFileSync(blockMapPath, "utf8")}\n`;
    } else {
      log("  ! no plan artifacts found — §10 will be missing and G11 will fail. Run scripts/plan.mjs.");
    }
  } catch (e) { log(`  ! plan step failed: ${String(e.stdout || e.message).split("\n")[0]}`); }

  const md = `# DESIGN-SKILL — this project's condensed design skill

> Synthesized ${new Date().toISOString()} from ${contributors.length} reference teardowns (10 -> 1).
> Sources: ${sites.map((s) => slugify(s.url)).join(", ")}
> This file is BINDING for the build. The Design Read and direction contract (scout.md) resolve conflicts
> in their favour ONLY where they name this project's brand/content; otherwise these patterns win over invention.

## 0. The one-line read
${sel.frame.domain || "<domain>"} · ${sel.frame.pageType || "<page type>"} · ${sel.frame.platform} — top references: ${top}

## 1. Colour — REAL extracted values (cite the owner per choice)
- Accent candidates, ranked by how many references used them:
${ranked(agg.accents, 8).map((v) => `  - \`${v}\``).join("\n") || "  - none extracted — use references/DESIGN.md and the project's own brand"}
- Neutral substrates observed:
${ranked(agg.neutrals, 8).map((v) => `  - \`${v}\``).join("\n") || "  - n/a"}
- Semantic roles resolved from the references (use these names in the token layer):
${ranked(agg.roles, 12, false).map((v) => `  - \`${v}\``).join("\n") || "  - n/a"}
- Dominant theme among references: ${[...agg.themes.keys()].join(", ") || "mixed"}
- Radii observed: ${[...agg.radii.keys()].slice(0, 6).join(", ") || "n/a"}
- Rule: pick the accent by the ROLE it plays in the winning reference's layout (action/emphasis), then re-tune to brand. One accent does one job (DESIGN.md 60/30/10).

## 2. Type — REAL extracted families
- Display/body families in play: ${famList.join(" · ") || "none extracted"}
- Mono faces: ${monoList.join(", ") || "none"}
- Extracted scale entries (pick one pairing and obey the ratio):
${ranked(agg.typeScale, 10, false).map((v) => `  - \`${v}\``).join("\n") || "  - none extracted — use the DESIGN.md scale (1.25 dense / 1.333 editorial / 1.5 display-led)"}
- Rule: ONE pairing from these plus the project's own brand faces; load per references/DESIGN.md (font-display swap, subset, preload the above-fold face).

## 3. Spacing, grid, radius
- Base units observed: ${ranked(agg.bases, 8, false).join(", ") || "8px default"} — pick ONE and obey it.
- Rules: 4px-base scale, tokens only; vary section rhythm (uniform py-24 is the flat-page tell); one content width + one prose width + one wide.

## 4. Motion — the measured evidence, then the grammar
- Motion libraries detected across references: ${ranked(agg.motionLibs, 10, false).join(", ") || "css-only"}
- Keyframe vocabulary (recreate the FEELING, not the name): ${kfWithOwners.join(", ") || "none extracted"}
- Transitions actually in use (durations + easings):
${ranked(agg.transitions, 12, false).map((v) => `  - \`${v}\``).join("\n") || "  - n/a"}
- Captured hover/focus deltas (what real award sites change on interaction):
${(agg.interactionsDetail || []).slice(0, 6).map((d) => `  - ${d.slug}: ${d.element} changes ${d.changed.join(", ")}`).join("\n") || "  - none captured — say so in the report rather than claiming there is no motion"}
- Rule: ONE entrance grammar for the whole page, easings from references/MOTION.md, transform/opacity only, reduced motion honoured. The chosen grammar is in §10 (SECTION-PLAN).

## 5. Structure — REAL section inventory from the references
- Section grammar observed (in DOM order, deduplicated, with owner counts):
${(() => { const seen = new Set(); const rows = []; for (const s of agg.sections) { if (seen.has(s)) continue; seen.add(s); const n = agg.sectionOwners.get(s)?.length || 1; rows.push(`  - ${s}${n > 1 ? `  [${n}x]` : ""}`); if (rows.length >= 24) break; } return rows.join("\n") || "  - none extracted — see per-site references/DESIGN.md Page Structure"; })()}
- Layout containers worth reusing:
${agg.layouts.filter(Boolean).slice(0, 3).map((l) => "```\n" + l + "\n```").join("\n") || "  (none extracted — see per-site references/LAYOUT.md)"}

## 6. Interaction states — ${agg.interactions} captured state diffs
- Per-site hover/focus evidence: teardown/<slug>-capture/capture.json → interactions, and teardown/<slug>/references/INTERACTIONS.md.
- Rule: hover changes colour/border/shadow, never size; feedback <= 150ms; focus rings always visible.

## 7. Contrast — measured from the captured computed styles
${contrastPass.length ? contrastPass.slice(0, 8).map((c) => `- PASS ${c.ratio}:1 — ${c.pair} (\`${c.slug}\`: ${c.fg} on ${c.bg})`).join("\n") : "- no passing pair measured from the references"}
${contrastFails.length ? contrastFails.slice(0, 8).map((c) => `- FAIL ${c.ratio}:1 — ${c.pair} (\`${c.slug}\`: ${c.fg} on ${c.bg}) — do NOT reproduce`).join("\n") : ""}
- Your own build must be measured the same way over the ACTUAL substrate (gradients, glass and images included).

## 8. Per-site deep-dives (full evidence)
${contributors.map((c) => `- **${c.slug}** (${c.award || "reference"}) — ${c.parts.join(" + ") || "no artifacts"} — ${c.why}`).join("\n") || "  (none)"}

## 9. Judgement still open (the agent MUST decide — evidence provided, not a decision)
${(sel.frame.judgementOpen || []).length ? sel.frame.judgementOpen.map((j) => `- ${j}`).join("\n") : `- Which single accent + neutral pair fits THIS product's brand (candidates in §1).
- Which pairing in §2, and the ratio.
- Which sections from §5 the content actually needs — the plan in §10 already proposes the order; delete what the content cannot support.
- Where the second kinetic moment goes, if at all (§4 gives the grammar; one page gets at most one signature moment plus one hero moment).`}

## 9b. Hard limits (unchanged, from the upstream skills)
references/CRITIQUE.md hard fails, references/SKILLS.md conflict rulings and references/A11Y-PERF.md floors
all still apply. A reference showing a banned pattern (gradient text, three equal cards) is evidence of what
wins awards TODAY, not permission to copy it. §10's \`forbidden\` list is binding.
${planBlock}`;
  fs.mkdirSync(beyondDir, { recursive: true });
  fs.writeFileSync(designSkillPath, md);

  const sectionsFilled = ["colour", "type", "spacing", "motion", "structure", "states", "contrast", "per-site", "open-judgement", "build-plan"];
  saveStateSafe((s) => {
    s.synthesis = {
      artifact: path.relative(projectDir, designSkillPath),
      contributors: contributors.map((c) => c.slug),
      sectionsFilled,
      realTokens: {
        accents: [...agg.accents.keys()].slice(0, 8),
        neutrals: [...agg.neutrals.keys()].slice(0, 8),
        families: [...agg.families.keys()].slice(0, 8),
        bases: [...agg.bases.keys()].slice(0, 6),
        keyframes: [...new Set(agg.keyframeNames)].slice(0, 24),
        transitions: [...agg.transitions.keys()].slice(0, 12),
        motionLibs: [...agg.motionLibs.keys()].slice(0, 8),
      },
      contrastMeasured: (agg.contrast || []).length,
      contrastFailing: (agg.contrast || []).filter((c) => c.ratio < 4.5).map((c) => `${c.slug} ${c.ratio}:1`),
      interactionsCaptured: agg.interactions,
    };
    if (s.teardown) s.teardown.complete = contributors.filter((c) => c.parts.length).length;
  });
  const plan = (() => { try { return JSON.parse(fs.readFileSync(path.join(beyondDir, "PLAN.json"), "utf8")); } catch { return null; } })();
  log(`\nsynthesis complete -> ${path.relative(projectDir, designSkillPath)} (${contributors.length} contributors)`);
  if (plan && planBlock) log(`  plan embedded: ${plan.sections.length} hand-picked sections, motion=${plan.motion.grammar}, archetype=${plan.archetype.key}`);
  else log("  §10 plan NOT embedded — G11 will fail until scripts/plan.mjs runs");
}

function saveStateSafe(mut) {
  const s = loadState();
  if (s) { mut(s); saveState(s); }
}

// ------------------------------------------------------------------ main
async function main() {
  const cfg = loadConfig();
  const state = loadState();
  if (cmd === "init") { init(); return; }
  if (!fs.existsSync(selPath)) { init(); }
  if (cmd === "synth") { synthesize(cfg, state); return; }
  if (cmd !== "run") { log(`unknown command '${cmd}' — init | run | synth`); process.exit(1); }

  const sel = JSON.parse(fs.readFileSync(selPath, "utf8"));
  let sites = sel.selected.slice(0, cfg.teardown.targetSites);
  const only = getOpt("--only", null);
  if (only) { const idx = only.split(",").map((n) => parseInt(n, 10) - 1).filter((n) => !isNaN(n)); sites = sites.filter((_, i) => idx.includes(i)); }
  if (sites.length === 0) { log("references-selection.json has no selected sites — run selection per references/TEARDOWN.md §2 first"); process.exit(1); }

  log(`teardown: ${sites.length} site(s) -> ${path.relative(projectDir, teardownRoot)}`);
  log(`layers: skillui=${!hasFlag("--skip-skillui")} capture=${!hasFlag("--skip-capture") && pwReady()} scrapling=${!hasFlag("--skip-scrapling")}`);
  log(`  (content fan-out uses the scrapling CLI; ad-hoc fetches during SCOUT prefer the mcp__scrapling__* tools when installed)`);
  const results = [];
  for (const [i, site] of sites.entries()) {
    log(`[${i + 1}/${sites.length}]`, site.url);
    try { results.push(await teardownSite(site, cfg, state)); }
    catch (e) { log(`  site FAILED: ${e.message}`); results.push({ url: site.url, slug: slugify(site.url), status: "failed", tokens: false, screens: false, contentMd: false, capture: false, seconds: 0 }); }
  }
  saveStateSafe((s) => {
    s.teardown = { ...(s.teardown || {}), root: path.relative(projectDir, teardownRoot),
      manifest: path.relative(projectDir, path.join(teardownRoot, "manifest.json")),
      sites: results, complete: results.filter((r) => r.status !== "failed").length, target: cfg.teardown.targetSites };
  });
  fs.writeFileSync(path.join(teardownRoot, "manifest.json"), JSON.stringify(results, null, 2) + "\n");

  synthesize(cfg, state);
}

main();