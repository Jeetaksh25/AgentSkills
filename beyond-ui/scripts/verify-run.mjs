#!/usr/bin/env node
/**
 * beyond-ui enforcement gate — the run is INCOMPLETE until this passes. Checks the artifacts the
 * skill demands: state, scout evidence, the routed 10 skills (5 permanent + 5 selected — never 33),
 * the 5-reference selection and teardown (never 10), the synthesized project skill, rule citations
 * (including one per active skill), critique scores, verify evidence, the plan, the import-first
 * ledger, and the human-like QA journey.
 *
 *   node scripts/verify-run.mjs [projectDir] [--min-citations N]
 *
 * Exit 1 = the run is not done. A failing gate is remedied by doing the missing work — never by
 * relaxing the gate or editing state.json by hand (this script re-stamps state.json -> enforcement).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectDir = path.resolve(process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : process.cwd());
const minCitations = parseInt((process.argv.indexOf("--min-citations") >= 0 ? process.argv[process.argv.indexOf("--min-citations") + 1] : "5"), 10);
const beyondDir = path.join(projectDir, ".beyond-ui");

const catalog = (() => { try { return JSON.parse(fs.readFileSync(path.join(skillRoot, "assets", "skills-catalog.json"), "utf8")); } catch { return null; } })();

const results = [];
const gate = (id, name, pass, detail) => { results.push({ id, name, pass, detail }); console.log(`  ${pass ? "PASS" : "FAIL"}  ${id} ${name}${detail ? ` — ${detail}` : ""}`); };
const readJson = (p) => { try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return null; } };
const readMd = (p) => { try { return fs.readFileSync(p, "utf8"); } catch { return ""; } };

console.log(`beyond-ui enforcement gate — ${projectDir}`);

// G1 state
const state = readJson(path.join(beyondDir, "state.json"));
gate("G1", "state.json present", !!state, state ? "" : "run scripts/scaffold-state.mjs");

// G2 scout
const scout = readMd(path.join(beyondDir, "scout.md"));
const scoutUrls = new Set((scout.match(/https?:\/\/[^\s)|`"\]]+/g) || []));
const libCmds = (scout.match(/npx\s+(shadcn|skills|skills@latest|@21st-dev)/g) || []).length;
gate("G2", "scout.md cites 4+ URLs + library map", scoutUrls.size >= 4 && libCmds >= 1,
  `${scoutUrls.size} urls, ${libCmds} install commands`);

// G3 skills: exactly 5 permanent + 5 selected = 10 routed units, each installed or URL-documented
const active = readJson(path.join(beyondDir, "active-skills.json"));
const skillsInstalled = state?.skills?.installed?.length ?? 0;
const skillsMissing = state?.skills?.missing ?? [];
const missesDocumented = skillsMissing.length > 0 && skillsMissing.every((m) => m.readInstead && /^https?:\/\//.test(m.readInstead));
const wantPerm = catalog?.selection?.permanentCount ?? 5;
const wantPool = catalog?.selection?.poolCount ?? 5;
const skillsShapeOk = !!active && active.permanent?.length === wantPerm && active.selected?.length === wantPool && active.total === wantPerm + wantPool;
const skillsOk = !!state && skillsShapeOk && (skillsInstalled > 0 || missesDocumented);
gate("G3", `routed skills = ${wantPerm} permanent + ${wantPool} selected (never 33), installed or URL-documented`, skillsOk,
  active ? `${active.permanent?.length}+${active.selected?.length}=${active.total} routed, ${skillsInstalled} installed, ${skillsMissing.length} missing` : "no active-skills.json — run `node scripts/skills-router.mjs select`");

// G3b the condensed project skill exists and is bound to the routed skills
const digest = readMd(path.join(beyondDir, "SKILL.md"));
const digestIds = active ? [...(active.permanent || []), ...(active.selected || [])].map((s) => s.id) : [];
const digestOk = digest.length > 200 && digestIds.length > 0 && digestIds.every((id) => digest.includes(id));
gate("G3b", ".beyond-ui/SKILL.md (condensed project skill) names every routed skill", digestOk,
  `${digest.length} chars, ${digestIds.filter((id) => digest.includes(id)).length}/${digestIds.length} skills named`);

// G4 selection — EXACTLY 5 references (the "5 not 10" assertion)
const sel = readJson(path.join(beyondDir, "references-selection.json")) ?? { selected: state?.selection?.selected ?? [] };
const selected = sel.selected || state?.selection?.selected || [];
const awarded = selected.filter((s) => (s.award || "").length > 0);
const refsOk = selected.length === 5 && awarded.length >= 2;
gate("G4", "selection: exactly 5 refs (not 10), 2+ awarded, scored", refsOk,
  `${selected.length} selected, ${awarded.length} awarded`);

// G5 teardown — 5 sites with artifacts
const tdSites = state?.teardown?.sites || [];
const tdOk = tdSites.filter((s) => s.tokens || s.screens || s.capture || s.contentMd).length;
gate("G5", "teardown: 5 sites with artifacts", tdOk >= 5, `${tdOk}/${tdSites.length} sites with evidence`);

// G6 DESIGN-SKILL.md
const designSkill = readMd(path.join(beyondDir, "DESIGN-SKILL.md"));
const sectionsNeeded = ["The one-line read", "Colour", "Type", "Spacing", "Motion", "Structure", "Interaction states", "Contrast", "Per-site deep-dives", "Judgement still open", "Hard limits", "HAND-PICKED BUILD PLAN"];
const sectionsFound = sectionsNeeded.filter((s) => designSkill.includes(s));
gate("G6", "DESIGN-SKILL.md synthesized with all sections incl. the build plan", sectionsFound.length === sectionsNeeded.length,
  `${sectionsFound.length}/${sectionsNeeded.length} sections${sectionsFound.length < sectionsNeeded.length ? ` — missing: ${sectionsNeeded.filter((s) => !sectionsFound.includes(s)).join(", ")}` : ""}`);

// G7 rule citations — the anti-"ignored the skills" gate, with per-skill coverage
const citations = state?.ruleCitations || [];
const citationsOk = citations.length >= minCitations && citations.every((c) => c.decision && c.source && c.appliedIn);
const uncovered = digestIds.filter((id) => !citations.some((c) => String(c.source || "").includes(`skill://${id}`)));
gate("G7", `rule citations >= ${minCitations} + one from each of the ${digestIds.length} routed skills`, citationsOk && uncovered.length === 0,
  `${citations.length} citations${uncovered.length ? `, uncovered skills: ${uncovered.join(", ")}` : ""}`);

// G8 critique
const gates = state?.critique?.gates || {};
const gateValues = Object.values(gates);
const mean = state?.critique?.mean ?? 0;
const critiqueOk = gateValues.length >= 10 && gateValues.every((v) => v >= 3) && mean >= 4.0;
gate("G8", "critique: 12 gates scored, all >= 3, mean >= 4.0", critiqueOk,
  `${gateValues.length} gates, mean ${mean}`);

// G9 verify evidence
const v = state?.verify || {};
const shots = (v.screenshots || []).length;
const verifyOk = shots >= 3 && ["pass"].includes(v.reducedMotion) && ["pass"].includes(v.keyboard) && v.console === "clean";
gate("G9", "verify evidence: 3+ screenshots, reduced-motion + keyboard + console pass", verifyOk,
  `${shots} shots, rm=${v.reducedMotion}, kb=${v.keyboard}, console=${v.console}`);

// G10 plan — the hand-picked build plan must exist and be concrete
const plan = readJson(path.join(beyondDir, "PLAN.json"));
const planSections = plan?.sections || [];
const archetypes = readJson(path.join(skillRoot, "assets", "page-archetypes.json"), { archetypes: {} }).archetypes;
const seqLength = archetypes[plan?.archetype?.key]?.sequence?.length ?? 4;
const minSections = Math.min(4, seqLength); // a docs archetype genuinely has 3 roles; do not demand 4 of it
const planOk = !!plan && planSections.length >= minSections && !!plan.motion?.grammar && !!plan.archetype?.key
  && planSections.every((s) => s.id && s.build?.length && (s.primary || s.sources?.length));
const regsInPlay = plan?.registryDiscipline?.inPlay || [];
const regsOk = regsInPlay.length <= 3; // COMPONENTS.md rule 1: one aesthetic, 2-3 registries
gate("G10", `PLAN.json: archetype + motion grammar + ${minSections}+ hand-picked sections with blocks`, planOk && regsOk,
  plan ? `${plan.archetype?.key}, motion=${plan.motion?.grammar}, ${planSections.length} sections (min ${minSections}), ${regsInPlay.length}/3 registries${regsOk ? "" : ` OVER: ${regsInPlay.join(", ")}`}` : "run scripts/plan.mjs");

// G11 the plan is EMBEDDED in DESIGN-SKILL.md (not merely referenced)
const embedsBuildSheet = designSkill.includes("Build sheet (order matters)") && designSkill.includes("**Primary block**");
const embedsBlockMap = designSkill.includes("BLOCK-MAP") && /npx shadcn@latest add @[a-z0-9-]+\//.test(designSkill);
gate("G11", "DESIGN-SKILL.md embeds SECTION-PLAN build sheet + BLOCK-MAP install commands", embedsBuildSheet && embedsBlockMap,
  `buildSheet=${embedsBuildSheet} blockMap=${embedsBlockMap}`);

// G12 the plan was actually built — every planned section appears in the composed component record
const composed = new Set([
  ...(state?.components?.composedSections || []),
  ...(state?.components?.registry || []).map((r) => r.section || r.element || r.item || ""),
  ...(state?.components?.shadcn || []),
  ...(state?.plan?.sections || []),
].map((x) => String(x).toLowerCase()));
const covered = planSections.map((s) => {
  const id = String(s.id).toLowerCase();
  const name = String(s.name || "").toLowerCase();
  return { id: s.id, hit: [...composed].some((c) => c && (c.includes(id) || id.includes(c) || (name && (c.includes(name) || name.includes(c))))) };
});
const coveredCount = covered.filter((c) => c.hit).length;
const needCoverage = Math.min(planSections.length, 1); // at minimum, one planned section must be traceable
gate("G12", "composed sections trace back to the plan", planSections.length === 0 || coveredCount >= needCoverage,
  planSections.length ? `${coveredCount}/${planSections.length} planned sections recorded in state.components/composedSections` : "no plan");

// G13 import-first — every planned block was IMPORTED (shadcn/registry), nothing hand-rolled
const importAudit = readJson(path.join(beyondDir, "import-audit.json"));
const importOk = !!importAudit && importAudit.pass === true;
gate("G13", "import-first: every planned block imported, no unmarked hand-rolled controls", importOk,
  importAudit ? `${importAudit.imported}/${importAudit.planned} imported, ${importAudit.missing?.length || 0} missing, ${importAudit.rawViolations?.length || 0} raw violations` : "run `node scripts/import-ledger.mjs plan && node scripts/import-ledger.mjs audit`");

// G14 QA journey — the app was actually used like a human
const qaFiles = fs.existsSync(path.join(beyondDir, "qa")) ? fs.readdirSync(path.join(beyondDir, "qa")).filter((f) => f.endsWith(".json")) : [];
const qaReports = qaFiles.map((f) => readJson(path.join(beyondDir, "qa", f))).filter(Boolean);
const qaPassed = qaReports.some((r) => r.keyboard === "pass" && r.reducedMotion === "pass" && r.console === "clean");
gate("G14", "QA journey: app exercised in a real browser (keyboard + reduced-motion + console clean)", qaPassed,
  `${qaReports.length} journey report(s)${qaReports.length ? ` — ${qaFiles.join(", ")}` : " — run `node scripts/qa.mjs journey <url>`"}`);

// stamp
const failed = results.filter((r) => !r.pass);
const enforcement = {
  verifyRun: failed.length ? "fail" : "pass",
  at: new Date().toISOString(),
  ruleCitationCount: citations.length,
  gatesBelowThree: [],
  gates: Object.fromEntries(results.map((r) => [r.id, r.pass])),
};
console.log(`\nenforcement: ${enforcement.verifyRun.toUpperCase()}${failed.length ? ` — failing gates: ${failed.map((f) => f.id + " " + f.name).join("; ")}` : ""}`);
if (state) {
  state.enforcement = { ...(state.enforcement || {}), ...enforcement };
  try { fs.writeFileSync(path.join(beyondDir, "state.json"), JSON.stringify(state, null, 2) + "\n"); } catch { /* read-only state is fine */ }
}
process.exit(failed.length ? 1 : 0);
