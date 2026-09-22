#!/usr/bin/env node
/**
 * beyond-ui teardown orchestrator — the reference pipeline: SELECT 10 -> TEARDOWN 10 -> SYNTHESIZE 1.
 *
 *   node scripts/teardown.mjs init [projectDir]              -> writes .beyond-ui/references-selection.json
 *   node scripts/teardown.mjs run   [projectDir] [--only <i,j>] [--skip-skillui] [--skip-capture]
 *                                                             --skip-firecrawl [--screens 5]
 *                                                             -> tears down the selected sites + synthesizes
 *                                                             .beyond-ui/DESIGN-SKILL.md
 *   node scripts/teardown.mjs synth [projectDir]             -> re-run only the synthesis step
 *
 * Per selected site, the teardown runs up to three capture layers (each independent):
 *   1. skillui (pinned version, ultra mode when playwright present; auto static fallback otherwise)
 *        -> <root>/<slug>/ SKILL.md references/ tokens/ screens/
 *   2. deep capture (scripts/capture-site.mjs, playwright)   -> <root>/<slug>-capture/capture.json + shots/
 *   3. firecrawl deep crawl (scripts/firecrawl.mjs, optional key) -> <root>/<slug>-capture/content.md pages
 *
 * Then SYNTHESIS merges all teardowns into ONE condensed project skill: .beyond-ui/DESIGN-SKILL.md.
 * Every step updates .beyond-ui/state.json -> selection / teardown / synthesis.
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
const run = (c, a, o = {}) => execFileSync(c, a, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], shell: process.platform === "win32", ...o });

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

  // 3. firecrawl deep content crawl (optional; soft-fails by design)
  if (!hasFlag("--skip-firecrawl")) {
    try {
      run("node", [path.join(skillRoot, "scripts", "firecrawl.mjs"), "deep", site.url, capDir, "--pages", "3"], { timeout: 180000 });
      result.contentMd = fs.existsSync(path.join(capDir, "content.md"));
    } catch { /* firecrawl.mjs soft-exits; only a hard crash lands here */ }
  } else log("  firecrawl skipped (--skip-firecrawl)");

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

function synthesize(cfg, state) {
  const sel = JSON.parse(fs.readFileSync(selPath, "utf8"));
  const sites = sel.selected.slice(0, cfg.teardown.targetSites);
  if (sites.length === 0) { log("no selected sites in references-selection.json — run selection first (references/TEARDOWN.md §2)"); process.exit(1); }

  const contributors = [];
  const agg = { accents: new Set(), neutrals: new Set(), families: new Set(), monoFamilies: new Set(), bases: new Set(),
    radii: new Set(), keyframeNames: [], transitions: new Set(), motionLibs: new Set(), sections: [], layouts: [], interactions: 0,
    themes: new Set() };

  for (const site of sites) {
    const slug = slugify(site.url);
    const dir = path.join(teardownRoot, slug);
    const capDir = path.join(teardownRoot, `${slug}-capture`);
    if (!fs.existsSync(dir) && !fs.existsSync(capDir)) { log(`  ! no teardown for ${site.url} — skipped (run 'teardown.mjs run' first)`); continue; }
    const tokens = parseSkilluiTokens(dir);
    const cap = parseCapture(capDir);
    const entry = { url: site.url, slug, why: site.why || "", award: site.award || "", parts: [] };

    if (tokens.colors) {
      entry.parts.push("tokens");
      const core = tokens.colors.core || {};
      if (core.accent) agg.accents.add(core.accent.value);
      if (core.background) agg.neutrals.add(core.background.value);
      if (core.surface) agg.neutrals.add(core.surface.value);
      if (tokens.colors.meta?.theme) agg.themes.add(tokens.colors.meta.theme);
    }
    if (tokens.typography) {
      for (const f of tokens.typography.families || []) agg.families.add(f);
      for (const role of Object.values(tokens.typography.scale || {})) if (/\b(mono|code)\b/i.test(role.fontFamily || "")) agg.monoFamilies.add(role.fontFamily);
    }
    if (tokens.spacing?.base?.value) agg.bases.add(tokens.spacing.base.value);
    if (fs.existsSync(path.join(dir, "references", "ANIMATIONS.md"))) {
      entry.parts.push("animations");
      const anim = fs.readFileSync(path.join(dir, "references", "ANIMATIONS.md"), "utf8");
      const kf = [...anim.matchAll(/^### `@keyframes ([\w-]+)`/gm)].map((m) => m[1]);
      agg.keyframeNames.push(...kf.slice(0, 12));
      const motion = mdSection(anim, "Motion Technology Stack");
      for (const m of motion.matchAll(/^\| \*\*([^|]+?)\*\*/gm)) agg.motionLibs.add(m[1].trim());
    }
    if (fs.existsSync(path.join(dir, "references", "LAYOUT.md"))) {
      entry.parts.push("layout");
      agg.layouts.push(mdSection(fs.readFileSync(path.join(dir, "references", "LAYOUT.md"), "utf8"), "Structural Containers").slice(0, 600));
    }
    if (cap) {
      entry.parts.push("capture");
      for (const k of cap.extract?.keyframes?.slice(0, 10) || []) agg.keyframeNames.push(k.name);
      for (const t of cap.extract?.transitions || []) agg.transitions.add(t);
      for (const lib of cap.extract?.motionLibs || []) agg.motionLibs.add(lib);
      for (const s of cap.extract?.sections || []) agg.sections.push(s.heading ? `${s.tag}: ${s.heading}` : s.tag);
      agg.interactions += (cap.interactions || []).length;
      for (const f of cap.extract?.fonts?.loaded || []) agg.families.add(f.split("|")[0]);
    }
    contributors.push(entry);
  }

  // ---- write the single condensed project skill ----
  const top = sites.slice(0, 3).map((s) => `[${slugify(s.url)}](${s.url})${s.award ? ` (${s.award})` : ""}`).join(" · ");
  const famList = [...agg.families].filter((f) => !/mono|code/i.test(f)).slice(0, 6);
  const monoList = [...agg.monoFamilies].slice(0, 3);
  const md = `# DESIGN-SKILL — this project's condensed design skill

> Synthesized ${new Date().toISOString()} from ${contributors.length} award-winning reference teardowns (10 -> 1).
> Sources: ${sites.map((s) => slugify(s.url)).join(", ")}
> This file is BINDING for the build. The Design Read and direction contract (scout.md) resolve conflicts
> in their favour ONLY where they name this project's brand/content; otherwise these patterns win over invention.

## 0. The one-line read
${sel.frame.domain || "<domain>"} · ${sel.frame.pageType || "<page type>"} · ${sel.frame.platform} — top references: ${top}

## 1. Colour (evidence: extracted tokens)
- Accent candidates (steal ONE, re-tune to brand): ${[...agg.accents].slice(0, 8).join(", ") || "none extracted — fall back to references/DESIGN.md rules"}
- Neutral substrates seen: ${[...agg.neutrals].slice(0, 8).join(", ") || "n/a"}
- Dominant theme among references: ${[...agg.themes].join(", ") || "mixed"}
- Rule: pick the accent from the winner site's role in ITS layout (action/emphasis), not its hue value alone.

## 2. Type (evidence: extracted families)
- Display/body families in play: ${famList.join(", ") || "none extracted"}
- Mono faces: ${monoList.join(", ") || "none"}
- Rule: choose ONE pairing from these plus the project's own brand faces; load per references/DESIGN.md.

## 3. Spacing & grid (evidence: extracted base units)
- Base units observed: ${[...agg.bases].join(", ") || "8px default"} — pick one and obey it.

## 4. Motion (evidence: keyframes + transitions + libraries detected)
- Motion libraries detected across references: ${[...agg.motionLibs].slice(0, 10).join(", ") || "css-only"}
- Keyframe vocabulary (recreate the FEELING, not the name): ${[...new Set(agg.keyframeNames)].slice(0, 24).join(", ") || "none extracted"}
- Transition durations/easings in use: ${[...agg.transitions].slice(0, 12).join(" | ") || "n/a"}
- Rule: one entrance grammar, easings from references/MOTION.md, animate transform/opacity only, reduced-motion honoured.

## 5. Structure (evidence: section inventories)
- Section grammar observed (ordered): ${agg.sections.slice(0, 18).join(" -> ") || "see per-site references/DESIGN.md Page Structure"}
- Layout containers worth reusing:
${agg.layouts.filter(Boolean).slice(0, 3).map((l) => "```\n" + l + "\n```").join("\n") || "  (none extracted — see per-site references/LAYOUT.md)"}

## 6. Interaction states (evidence: ${agg.interactions} captured state diffs)
- Per-site hover/focus diffs live in teardown/<slug>-capture/capture.json and teardown/<slug>/references/INTERACTIONS.md.
- Rule: hover changes colour/border/shadow, never size; feedback <= 150ms; focus rings visible.

## 7. Per-site deep-dives (full evidence)
${contributors.map((c) => `- **${c.slug}** (${c.award || "reference"}) — ${c.parts.join(" + ") || "no artifacts"} — ${c.why}`).join("\n") || "  (none)"}

## 8. Judgement still open (the agent MUST decide, evidence provided)
- Which single accent + neutral pair fits THIS product's brand.
- Which motion grammar fits THIS page's density (dashboards: near-none; landing: one signature moment).
- Which 2-3 sections from the vocabulary THIS product's content actually needs.
- Registry mapping for every element (scout.md library map) — this file does not replace it.

## 9. Hard limits (unchanged, from the upstream skills)
The full anti-slop rules still apply: references/CRITIQUE.md hard fails, references/SKILLS.md conflict
rulings, references/A11Y-PERF.md floors. A reference showing a banned pattern (gradient text, three equal
cards) is evidence of what wins awards TODAY, not permission to copy it.
`;
  fs.mkdirSync(beyondDir, { recursive: true });
  fs.writeFileSync(designSkillPath, md);

  const sectionsFilled = ["colour", "type", "spacing", "motion", "structure", "states", "per-site", "open-judgement"];
  saveStateSafe((s) => {
    s.synthesis = { artifact: path.relative(projectDir, designSkillPath), contributors: contributors.map((c) => c.slug), sectionsFilled };
    if (s.teardown) s.teardown.complete = contributors.filter((c) => c.parts.length).length;
  });
  log(`\nsynthesis complete -> ${path.relative(projectDir, designSkillPath)} (${contributors.length} contributors)`);
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
  log(`layers: skillui=${!hasFlag("--skip-skillui")} capture=${!hasFlag("--skip-capture") && pwReady()} firecrawl=${!hasFlag("--skip-firecrawl")}`);
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