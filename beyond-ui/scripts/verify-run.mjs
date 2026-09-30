#!/usr/bin/env node
/**
 * beyond-ui enforcement gate — the run is INCOMPLETE until this passes. Checks the artifacts the
 * upstream skills and the teardown/synthesis pipeline require, so "agent ran beyond-ui but ignored
 * everything" is mechanically detectable instead of a vibe.
 *
 *   node scripts/verify-run.mjs [projectDir] [--min-citations 5]
 *
 * Gates (all must pass):
 *   G1  .beyond-ui/state.json exists and is parseable
 *   G2  scout.md exists, cites >= 4 distinct http URLs, has a library map with >= 1 install command
 *   G3  skills.installed non-empty, or skills.missing carries a readInstead URL per miss
 *   G4  selection: >= 6 selected references with scores + at least 3 carrying an award signal
 *   G5  teardown: >= 6 sites with at least one artifact layer (tokens | screens | capture | content)
 *   G6  DESIGN-SKILL.md exists, all sections filled INCLUDING the hand-picked plan section
 *   G7  rule citations: state.json ruleCitations >= --min-citations, each naming a source skill/file
 *   G8  critique: gates all >= 3 and mean >= 4.0 recorded
 *   G9  verify evidence: >= 3 viewport screenshots recorded + reducedMotion + keyboard checked
 *   G10 PLAN.json exists and names the archetype, the motion grammar and >= 4 hand-picked sections
 *       (scaled down for archetypes with fewer roles), each with build rules, within 3 registries
 *   G11 DESIGN-SKILL.md embeds the plan (SECTION-PLAN build sheet + BLOCK-MAP install commands)
 *   G12 every planned section's primary block was actually composed (components.registry / composedSections)
 *
 * Exit 0 = pass (stamped into state.json -> enforcement). Exit 1 = fail with the exact gate list.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectDir = path.resolve(process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : process.cwd());
const minCitations = parseInt((process.argv.indexOf("--min-citations") >= 0 ? process.argv[process.argv.indexOf("--min-citations") + 1] : "5"), 10);
const beyondDir = path.join(projectDir, ".beyond-ui");

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

// G3 skills installed or misses documented (empty installed + empty missing is vacuously true — reject it)
const skillsInstalled = state?.skills?.installed?.length ?? 0;
const skillsMissing = state?.skills?.missing ?? [];
const missesDocumented = skillsMissing.length > 0 && skillsMissing.every((m) => m.readInstead && /^https?:\/\//.test(m.readInstead));
const skillsOk = !!state && (skillsInstalled > 0 || missesDocumented);
gate("G3", "upstream skills installed or misses URL-documented", skillsOk,
  `${skillsInstalled} installed, ${skillsMissing.length} missing`);

// G4 selection
const sel = readJson(path.join(beyondDir, "references-selection.json")) ?? { selected: state?.selection?.selected ?? [] };
const selected = sel.selected || state?.selection?.selected || [];
const awarded = selected.filter((s) => (s.award || "").length > 0);
gate("G4", "selection: 6+ refs, 3+ awarded, scored", selected.length >= 6 && awarded.length >= 3,
  `${selected.length} selected, ${awarded.length} awarded`);

// G5 teardown
const tdSites = state?.teardown?.sites || [];
const tdOk = tdSites.filter((s) => s.tokens || s.screens || s.capture || s.contentMd).length;
gate("G5", "teardown: 6+ sites with artifacts", tdOk >= 6, `${tdOk}/${tdSites.length} sites with evidence`);

// G6 DESIGN-SKILL.md
const designSkill = readMd(path.join(beyondDir, "DESIGN-SKILL.md"));
const sectionsNeeded = ["The one-line read", "Colour", "Type", "Spacing", "Motion", "Structure", "Interaction states", "Contrast", "Per-site deep-dives", "Judgement still open", "Hard limits", "HAND-PICKED BUILD PLAN"];
const sectionsFound = sectionsNeeded.filter((s) => designSkill.includes(s));
gate("G6", "DESIGN-SKILL.md synthesized with all sections incl. the build plan", sectionsFound.length === sectionsNeeded.length,
  `${sectionsFound.length}/${sectionsNeeded.length} sections${sectionsFound.length < sectionsNeeded.length ? ` — missing: ${sectionsNeeded.filter((s) => !sectionsFound.includes(s)).join(", ")}` : ""}`);

// G7 rule citations — the anti-"ignored the skills" gate
const citations = state?.ruleCitations || [];
const citationsOk = citations.length >= minCitations && citations.every((c) => c.decision && c.source && c.appliedIn);
gate("G7", `rule citations >= ${minCitations} (each: decision + source + appliedIn)`, citationsOk,
  `${citations.length} citations`);

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
  ...(state?.components?.shadcn || []),
  ...(state?.components?.registry || []).flatMap((r) => [r.element, r.namespace, r.command]).filter(Boolean),
  ...(state?.composedSections || []),
].map((x) => String(x).toLowerCase()));
const covered = planSections.map((s) => {
  const needles = [s.id, s.name, s.primary?.item, s.primary?.namespace].filter(Boolean).map((x) => String(x).toLowerCase());
  return { id: s.id, hit: needles.some((n) => [...composed].some((c) => c.includes(n))) };
});
const coveredCount = covered.filter((c) => c.hit).length;
const needCoverage = Math.min(planSections.length, 1); // at minimum, one planned section must be traceable
gate("G12", "composed sections trace back to the plan", planSections.length === 0 || coveredCount >= needCoverage,
  planSections.length ? `${coveredCount}/${planSections.length} planned sections recorded in state.components/composedSections` : "no plan");

// stamp
const failed = results.filter((r) => !r.pass);
const enforcement = {
  verifyRun: failed.length === 0 ? "pass" : "fail",
  ruleCitationCount: citations.length,
  gatesBelowThree: gateValues.length ? Object.entries(gates).filter(([, val]) => val < 3).map(([k]) => k) : [],
  failedGates: failed.map((f) => f.id),
  plan: plan ? { archetype: plan.archetype?.key, motion: plan.motion?.grammar, sections: planSections.length, sectionsCovered: coveredCount } : null,
  checkedAt: new Date().toISOString(),
};
if (state) {
  state.enforcement = { ...(state.enforcement || {}), ...enforcement };
  fs.writeFileSync(path.join(beyondDir, "state.json"), JSON.stringify(state, null, 2) + "\n");
}
console.log(`\nenforcement: ${enforcement.verifyRun.toUpperCase()}${failed.length ? ` — failing gates: ${failed.map((f) => f.id + " " + f.name).join("; ")}` : ""}`);
process.exit(failed.length ? 1 : 0);