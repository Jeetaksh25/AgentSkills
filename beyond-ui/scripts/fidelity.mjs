#!/usr/bin/env node
/**
 * beyond-ui fidelity — the 85/15 contract, checked (G20).
 *
 *   node scripts/fidelity.mjs init  [projectDir]   -> scaffold .beyond-ui/fidelity.json from the selection + harvest
 *   node scripts/fidelity.mjs check [projectDir]   -> .beyond-ui/fidelity-report.json, exit 1 on failure
 *
 * 85% of the design comes from the references: the ANCHOR reference sets layout, spacing rhythm,
 * component styling, type scale and motion; supporting references and harvested template sections
 * fill what the anchor lacks. 15% is the product's own: content, domain sections, brand colour/theme,
 * and the adaptations each section needs. Copy, logos, imagery and proprietary fonts are never copied.
 * See references/FIDELITY.md.
 */
import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const cmd = argv[0];
const projectDir = path.resolve(argv.slice(1).find((a) => !a.startsWith("--") && fs.existsSync(a)) || process.cwd());
const beyondDir = path.join(projectDir, ".beyond-ui");
const fidPath = path.join(beyondDir, "fidelity.json");
const readJson = (p, d = null) => { try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return d; } };
const writeJson = (p, v) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n"); };
const log = (...a) => console.log(...a);
const SYSTEM = ["layout", "spacing", "components", "type", "motion", "radius", "colour"];
const OWN_OK = new Set(["colour"]);

function exists(ref) {
  if (!ref) return false;
  const clean = String(ref).replace(/#.*$/, "");
  return [clean, path.join(".beyond-ui", clean)].some((p) => fs.existsSync(path.resolve(projectDir, p)));
}

function init() {
  if (fs.existsSync(fidPath)) { log("fidelity: .beyond-ui/fidelity.json exists (kept)"); return; }
  const sel = readJson(path.join(beyondDir, "references-selection.json"), { selected: [] });
  const selected = sel.selected || [];
  const anchor = selected.find((s) => s.anchor) || selected[0] || { url: "" };
  const refsDir = path.join(beyondDir, "refs");
  const images = fs.existsSync(refsDir) ? fs.readdirSync(refsDir, { recursive: true }).filter((f) => /\.(png|jpe?g|webp|avif)$/i.test(f)).map((f) => path.join(".beyond-ui", "refs", f).replace(/\\/g, "/")) : [];
  const plan = readJson(path.join(beyondDir, "PLAN.json"), { sections: [] });
  const sections = (plan.sections || []).map((s) => ({ id: s.id, source: "anchor", evidence: "", adapted: "" }));
  writeJson(fidPath, {
    _howto: "source: anchor | support:<n> | template:<harvest id> | own. evidence: a file under .beyond-ui (refs image, harvest png/html, teardown dir). adapted: what the 15% changed for this product. own: reason required.",
    anchor: { url: anchor.url || "", why: "", evidence: images.slice(0, 2) },
    supporting: selected.filter((s) => s !== anchor).map((s) => ({ url: s.url, evidence: [] })),
    system: Object.fromEntries(SYSTEM.map((k) => [k, k === "colour" ? "own" : "anchor"])),
    sections: sections.length ? sections : [{ id: "hero", source: "anchor", evidence: "", adapted: "" }],
    own: ["copy and content", "domain sections from brief.md", "brand colour / theme"],
    neverCopied: ["copy", "logos", "photography and illustration", "proprietary fonts", "non-OSS code"],
  });
  log("fidelity -> .beyond-ui/fidelity.json scaffolded; fill evidence + adapted for every section, then `fidelity.mjs check`");
}

function check() {
  const f = readJson(fidPath);
  const problems = [];
  if (!f) { log("fidelity: no .beyond-ui/fidelity.json — run `fidelity.mjs init`"); process.exit(1); }
  if (!f.anchor?.url) problems.push("anchor.url missing — one reference must be the anchor");
  if (!(f.anchor?.evidence || []).some(exists)) problems.push("anchor.evidence must point at a file you actually looked at (refs image, harvest png, teardown dir)");
  const sections = f.sections || [];
  if (sections.length < 3) problems.push(`only ${sections.length} section(s) mapped — map every section/screen`);
  const own = sections.filter((s) => s.source === "own");
  const borrowed = sections.filter((s) => s.source !== "own");
  const fromAnchor = borrowed.filter((s) => s.source === "anchor");
  const ownAllowed = Math.max(1, Math.floor(sections.length * 0.15));
  if (own.length > ownAllowed) problems.push(`${own.length}/${sections.length} sections are 'own' (max ${ownAllowed} = 15%) — source the rest from the anchor, supporting refs or harvested templates`);
  if (borrowed.length && fromAnchor.length / borrowed.length < 0.5) problems.push(`anchor supplies ${fromAnchor.length}/${borrowed.length} borrowed sections (< 50%) — the anchor must carry the design`);
  for (const s of borrowed) {
    if (!exists(s.evidence)) problems.push(`section ${s.id}: evidence "${s.evidence || ""}" does not exist`);
    if (!s.adapted || s.adapted.length < 12) problems.push(`section ${s.id}: 'adapted' must say what changed for this product`);
    if (!/^(anchor|support:\d+|template:.+)$/.test(s.source)) problems.push(`section ${s.id}: source "${s.source}" must be anchor | support:<n> | template:<harvest id> | own`);
  }
  for (const s of own) if (!s.reason || s.reason.length < 12) problems.push(`section ${s.id}: an 'own' section needs a reason (e.g. domain content no reference has)`);
  const sys = f.system || {};
  const ownSystem = SYSTEM.filter((k) => sys[k] === "own" && !OWN_OK.has(k));
  if (ownSystem.length > 1) problems.push(`system aspects invented instead of referenced: ${ownSystem.join(", ")} (at most one besides colour)`);
  for (const k of SYSTEM) if (!sys[k]) problems.push(`system.${k} has no source`);
  const share = sections.length ? Math.round((borrowed.length / sections.length) * 100) : 0;
  const report = { at: new Date().toISOString(), sections: sections.length, borrowedPct: share, anchorSections: fromAnchor.length, ownSections: own.length, ownSystem, pass: problems.length === 0, problems };
  writeJson(path.join(beyondDir, "fidelity-report.json"), report);
  for (const p of problems) log(`  FAIL ${p}`);
  log(`fidelity: ${report.pass ? "PASS" : "FAIL"} — ${share}% of sections from references (${fromAnchor.length} from the anchor), ${own.length} own`);
  process.exit(report.pass ? 0 : 1);
}

if (cmd === "init") init();
else if (cmd === "check") check();
else { log("usage: node scripts/fidelity.mjs init|check [projectDir]"); process.exit(2); }
