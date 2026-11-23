#!/usr/bin/env node
/**
 * beyond-ui planner — turns the run's evidence into a HAND-PICKED build plan.
 *
 *   node scripts/plan.mjs [projectDir]
 *
 * Inputs
 *   .beyond-ui/references-selection.json   frame (domain/pageType/aesthetic/platform) + the 10 selected refs
 *   .beyond-ui/teardown/*-capture/capture.json   real section inventory + motion evidence per reference
 *   <skill>/assets/block-catalog.json      verified sections, each with real registry items + commands
 *   <skill>/assets/motion-catalog.json     motion grammars with concrete recipes
 *   <skill>/assets/page-archetypes.json    section order per surface
 *
 * Outputs
 *   .beyond-ui/PLAN.json        machine-readable plan (gate G10 reads this)
 *   .beyond-ui/SECTION-PLAN.md  the ordered build sheet: what to build, in what order, with what rules
 *   .beyond-ui/BLOCK-MAP.md     element -> exact registry item + install command + restyle/states + citation
 *
 * Deterministic: no LLM, no network. Selection is a scored function of the frame against the catalog,
 * so the same frame always yields the same plan, and every chosen block carries the rule that justifies it.
 * Registry discipline (COMPONENTS.md rule 1: one aesthetic, 2-3 registries) is enforced here, not merely
 * requested — swaps are recorded in PLAN.json -> registryDiscipline.swaps.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectDir = path.resolve(process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : process.cwd());
const beyondDir = path.join(projectDir, ".beyond-ui");
const selPath = path.join(beyondDir, "references-selection.json");
const teardownRoot = path.join(beyondDir, "teardown");

const readJson = (p, dflt = null) => { try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return dflt; } };
const slugify = (u) => { try { return new URL(u).hostname.replace(/^www\./, "").split(".")[0].toLowerCase().replace(/[^a-z0-9-]/g, "-"); } catch { return String(u).replace(/[^a-zA-Z0-9]/g, "-").toLowerCase().slice(0, 30); } };

if (!fs.existsSync(selPath)) {
  console.error("plan: .beyond-ui/references-selection.json missing — fill the frame + selected refs first (references/TEARDOWN.md §2)");
  process.exit(1);
}

const catalog = readJson(path.join(skillRoot, "assets", "block-catalog.json"), { sections: [] });
const motion = readJson(path.join(skillRoot, "assets", "motion-catalog.json"), { grammars: [] });
const archetypes = readJson(path.join(skillRoot, "assets", "page-archetypes.json"), { archetypes: {} }).archetypes;
const sel = JSON.parse(fs.readFileSync(selPath, "utf8"));
const state = readJson(path.join(beyondDir, "state.json"), {});

const frame = sel.frame || {};
const aesthetic = (Array.isArray(frame.aesthetic) ? frame.aesthetic : String(frame.aesthetic || "").split(/[,;|]/)).map((s) => String(s).trim().toLowerCase()).filter(Boolean);
const platform = frame.platform || "web";
const pageTypeRaw = String(frame.pageType || "").toLowerCase();
const domain = String(frame.domain || "").toLowerCase();
const constraints = String(frame.constraints || "").toLowerCase();

// ---------------------------------------------------------------- archetype resolution
function resolveArchetype() {
  const norm = (s) => s.replace(/[^a-z0-9]/g, "");
  for (const key of Object.keys(archetypes)) {
    if (norm(key) === norm(pageTypeRaw) || pageTypeRaw.includes(key) || key.includes(pageTypeRaw)) return key;
  }
  if (platform === "mobile-app") return "mobile-app";
  if (/dash|admin|analytics|console|panel/.test(pageTypeRaw)) return "dashboard";
  if (/doc/.test(pageTypeRaw)) return "docs";
  if (/price/.test(pageTypeRaw)) return "pricing";
  if (/component/.test(pageTypeRaw)) return "component";
  if (/blog|article|changelog|news|post|journal/.test(pageTypeRaw)) return "content";
  if (/login|signin|signup|auth|register/.test(pageTypeRaw)) return "auth";
  if (/404|error|not-?found/.test(pageTypeRaw)) return "error";
  if (/onboard|wizard|setup|signup-?flow|get-?started/.test(pageTypeRaw)) return "onboarding";
  if (/land|market|home|saas|product/.test(pageTypeRaw)) return "landing";
  return "landing";
}
const archetypeKey = resolveArchetype();
const archetype = archetypes[archetypeKey];

// ---------------------------------------------------------------- evidence from teardowns
const evidenceSites = [];
const sectionEvidence = new Map(); // normalized heading/tag -> [slug]
const motionEvidence = [];
for (const s of sel.selected || []) {
  const slug = slugify(s.url);
  const cap = readJson(path.join(teardownRoot, `${slug}-capture`, "capture.json"), null);
  const tokensDir = path.join(teardownRoot, slug, "tokens");
  const hasTokens = fs.existsSync(tokensDir);
  if (!cap && !hasTokens) continue;
  const entry = { slug, url: s.url, award: s.award || "", hasTokens, capture: !!cap,
    keyframes: cap?.extract?.keyframes?.length || 0, transitions: cap?.extract?.transitions?.length || 0,
    motionLibs: cap?.extract?.motionLibs || [], interactions: (cap?.interactions || []).length };
  evidenceSites.push(entry);
  if (cap?.extract?.sections) {
    for (const sec of cap.extract.sections) {
      const key = String(sec.heading || sec.cls || sec.tag || "").toLowerCase().slice(0, 40);
      if (!key) continue;
      if (!sectionEvidence.has(key)) sectionEvidence.set(key, []);
      sectionEvidence.get(key).push(slug);
    }
  }
  if (entry.keyframes || entry.transitions || entry.motionLibs.length) {
    motionEvidence.push(`${slug} (keyframes=${entry.keyframes}, transitions=${entry.transitions}${entry.motionLibs.length ? `, libs=${entry.motionLibs.join("+")}` : ""})`);
  }
}

// ---------------------------------------------------------------- scoring a section for THIS project
// Roles that genuinely serve a given archetype. A marketing page must not take an app shell just
// because it happened to be listed for the `nav` role, and an app must not take a marketing hero.
const ROLE_WEIGHTS = {
  landing: { nav: 1, hero: 1.25, "social-proof": 1, features: 1, proof: 1, integrations: 1, process: 1, pricing: 1, faq: 1, cta: 1.15, footer: 1 },
  "saas-marketing": { nav: 1, hero: 1.25, "social-proof": 1, features: 1, proof: 1, integrations: 1, faq: 1, cta: 1.15, footer: 1 },
  pricing: { nav: 1, hero: 0.8, pricing: 1.4, "social-proof": 0.8, features: 1, proof: 1, faq: 1.1, cta: 1.1, footer: 1 },
  dashboard: { shell: 1.3, overview: 1.3, chart: 1.2, table: 1.2, data: 1.2, states: 1.1, nav: 0.6, docs: 0.7 },
  docs: { nav: 1, docs: 1.5, shell: 1.1, footer: 0.8 },
  onboarding: { nav: 0.7, shell: 0.9, flow: 1.5, form: 1.15, states: 1.1, auth: 0.9 },
  component: { component: 1.5, states: 1.1 },
  content: { nav: 1, docs: 0.9, content: 1.5, cta: 1, footer: 1 },
  auth: { auth: 1.5, form: 1.15, states: 0.9 },
  error: { error: 1.5, states: 1.1 },
  "mobile-app": { mobile: 1.6, states: 1.2, form: 1.1 },
};

function scoreSection(sec) {
  let score = 0;
  const notes = [];
  const roleInSeq = sec.roles.filter((r) => archetype.sequence.includes(r));
  if (roleInSeq.length) {
    const w = ROLE_WEIGHTS[archetypeKey] || {};
    const best = Math.max(...roleInSeq.map((r) => w[r] ?? 1));
    score += Math.round(10 * best);
    if (best !== 1) notes.push(`archetype role (${roleInSeq.join("/")}) x${best}`);
    else notes.push(`archetype role (${roleInSeq.join("/")})`);
  } else if (sec.roles.some((r) => Object.keys(ROLE_WEIGHTS[archetypeKey] || {}).includes(r))) {
    // it serves a role this archetype knows, but not at this position in the sequence
    score += 2; notes.push("adjacent role");
  }
  // page-type fit: a docs/dashboard block must not win a marketing page just because a keyword overlapped
  const pt = (sec.pageTypes || []).map((p) => p.toLowerCase());
  if (pt.includes(archetypeKey)) { score += 4; notes.push(`page-type fit (${archetypeKey})`); }
  else if (pt.some((p) => pageTypeRaw.includes(p) || p.includes(pageTypeRaw))) { score += 2; notes.push("page-type near match"); }
  else if (pt.length) { score -= 3; notes.push(`page-type mismatch (${pt.join("/")})`); }
  const kw = sec.keywords.map((k) => k.toLowerCase());
  const overlap = kw.filter((k) => aesthetic.includes(k) || domain.includes(k) || pageTypeRaw.includes(k));
  if (overlap.length) { score += 3 * overlap.length; notes.push(`aesthetic/domain match (${overlap.join("/")})`); }
  // real section evidence from the references (name-level, from capture section inventory)
  const nameWords = sec.id.split("-").concat(sec.name.toLowerCase().split(/\W+/)).filter((w) => w.length > 4);
  let ev = 0;
  for (const [key, slugs] of sectionEvidence) if (nameWords.some((w) => key.includes(w))) ev += slugs.length;
  if (ev) { score += Math.min(4, ev); notes.push(`observed in ${Math.min(ev, 4)} reference(s)`); }
  // constraints can veto
  if (/no webgl|no 3d/.test(constraints) && /three|webgl|orbit/.test(sec.id)) { score -= 6; notes.push("constraint: no WebGL"); }
  if (platform === "mobile-app" && sec.id !== "mobile-screen-rn" && sec.roles.some((r) => ["shell","docs","hero"].includes(r))) { score -= 4; notes.push("web-only on a mobile project"); }
  return { score, notes };
}

const byRole = new Map();
for (const sec of catalog.sections) {
  const { score, notes } = scoreSection(sec);
  for (const role of sec.roles) {
    if (!byRole.has(role)) byRole.set(role, []);
    byRole.get(role).push({ sec, score, notes });
  }
}
for (const arr of byRole.values()) arr.sort((a, b) => b.score - a.score || a.sec.id.localeCompare(b.sec.id));

// ---------------------------------------------------------------- pick, following the archetype order
const chosen = [];
const usedRoles = new Set();
const usedSectionIds = new Set();
const roleCap = { features: 2, proof: 2, "social-proof": 1, nav: 1, hero: 1, footer: 1, cta: 1, pricing: 1, faq: 1, shell: 1 };
for (const role of archetype.sequence) {
  if (role === "states") {
    // cross-cutting: always planned, never a visible section
    const s = (byRole.get("states") || [])[0];
    if (s) chosen.push({ role, sec: s.sec, score: s.score, notes: [...s.notes, "cross-cutting state set"], crossCutting: true });
    continue;
  }
  const cands = (byRole.get(role) || []).filter((c) => c.score > 0 && !usedSectionIds.has(c.sec.id));
  const pick = cands[0];
  if (!pick) continue;
  const count = chosen.filter((c) => c.role === role).length;
  if (count >= (roleCap[role] ?? 1)) continue;
  chosen.push({ role, sec: pick.sec, score: pick.score, notes: pick.notes });
  usedRoles.add(role);
  usedSectionIds.add(pick.sec.id);
}
// features may take a second, complementary family (bento beside a comparison table is a legitimate pair)
if (archetype.sequence.includes("features") && chosen.filter((c) => c.role === "features").length < 2) {
  const second = (byRole.get("features") || []).find((c) => c.score > 0 && !usedSectionIds.has(c.sec.id));
  if (second) {
    usedSectionIds.add(second.sec.id);
    const at = chosen.findIndex((c) => c.role === "features");
    const entry = { role: "features", sec: second.sec, score: second.score, notes: [...second.notes, "complementary family (one layout family per page rule respected)"] };
    if (at >= 0) chosen.splice(at + 1, 0, entry); else chosen.push(entry);
  }
}

// ---------------------------------------------------------------- registry discipline (COMPONENTS.md rule 1: 2-3 registries, one aesthetic)
// Enforced on the PLAN, not just asked for in prose. Each section keeps a primary; while the plan
// would span more than `maxRegistries`, the section whose primary sits in the least-used registry is
// re-pointed at an alternative from a registry already in play. Every swap is recorded so the run can
// report it and cite it.
const registryOf = (src) => (src && src.kind === "shadcn-registry" ? src.namespace : null);
function applyRegistryDiscipline(chosen, maxRegistries = 3) {
  const swaps = [];
  for (const c of chosen) c.pick = c.sec.sources.find((s) => registryOf(s)) || c.sec.sources[0];
  for (let guard = 0; guard < 24; guard++) {
    const counts = {};
    for (const c of chosen) { const r = registryOf(c.pick); if (r) counts[r] = (counts[r] || 0) + 1; }
    if (Object.keys(counts).length <= maxRegistries) break;

    // every section that COULD move into a registry already in play, best candidate first:
    // eliminating a registry outright (count 1) beats consolidating, and a busier destination beats a quiet one
    const candidates = [];
    for (const c of chosen) {
      const from = registryOf(c.pick);
      if (!from || counts[from] === undefined) continue;
      for (const s of c.sec.sources) {
        const to = registryOf(s);
        if (!to || s === c.pick || to === from || counts[to] === undefined) continue;
        candidates.push({ c, alt: s, from, to, fromCount: counts[from], toCount: counts[to] });
      }
    }
    candidates.sort((a, b) => a.fromCount - b.fromCount || b.toCount - a.toCount || a.c.sec.id.localeCompare(b.c.sec.id));
    const move = candidates[0];
    if (!move) break; // nothing movable — leave the count and let the report state it honestly

    swaps.push({ section: move.c.sec.id, from: `${move.c.pick.namespace}/${move.c.pick.item}`, to: `${move.alt.namespace}/${move.alt.item}`, reason: `keep the plan within ${maxRegistries} registries (COMPONENTS.md rule 1)` });
    move.c.pick = move.alt;
    move.c.notes.push(`re-pointed to ${move.alt.namespace} for registry discipline`);
  }
  return swaps;
}
const planSwaps = applyRegistryDiscipline(chosen, 3);

// ---------------------------------------------------------------- motion grammar for this project
function pickMotion() {
  const scored = motion.grammars.map((g) => {
    let s = 0;
    if (g.whenPageTypes.includes(archetypeKey)) s += 5;
    if (g.whenPageTypes.some((t) => pageTypeRaw.includes(t))) s += 2;
    if (g.id === "grammar-dashboard-none" && archetypeKey === "dashboard") s += 8;
    if (g.id === "grammar-type-reveal" && chosen.some((c) => c.role === "hero")) s += 3;
    return { g, s };
  }).sort((a, b) => b.s - a.s || a.g.id.localeCompare(b.g.id));
  const primary = scored[0]?.g || motion.grammars[0];
  const interactive = motion.grammars.find((g) => g.id === "grammar-interaction-spring");
  const pinned = motion.grammars.find((g) => g.id === "grammar-pinned-narrative");
  const usePinned = /pinned|scroll narrative|story/.test(aesthetic.join(" ")) || /scroll narrative/.test(domain);
  return { primary, secondary: [interactive, ...(usePinned ? [pinned] : [])].filter(Boolean) };
}
const motionPlan = pickMotion();

// ---------------------------------------------------------------- primitive de-dup + license set
const primitiveNeed = new Map(); // primitive -> [sectionId]
const registryItems = [];
const peerDeps = new Set();
const seenCitation = new Set();
for (const c of chosen) {
  // c.pick is the registry-discipline-aware primary; the rest are documented alternatives
  c.primary = c.pick;
  c.alternatives = c.sec.sources.filter((s) => s !== c.pick && s.kind !== "shadcn-primitives");
  for (const src of c.sec.sources) {
    const isPrimary = src === c.pick;

    if (src.kind === "shadcn-primitives") {
      for (const p of src.items) {
        if (!primitiveNeed.has(p)) primitiveNeed.set(p, []);
        primitiveNeed.get(p).push(c.sec.id);
      }
    } else {
      registryItems.push({ section: c.sec.id, primary: isPrimary, ...src });
      (src.peers || []).forEach((d) => peerDeps.add(d));
      if (src.kind === "npm") peerDeps.add(src.install);
    }
  }
  const key = `${c.sec.id}::${c.primary ? (c.primary.command || c.primary.install) : "primitives"}`;
  c.citations = seenCitation.has(key) ? [] : [{ decision: c.primary ? `${c.sec.name}: use ${c.primary.command || c.primary.install}` : `${c.sec.name}: shadcn primitives`, source: `block-catalog.json#${c.sec.id}`, appliedIn: c.primary ? c.primary.command || c.primary.install : "components/ui" }];
  seenCitation.add(key);
}
const primitiveCmd = `npx shadcn@latest add ${[...primitiveNeed.keys()].join(" ")}`;

// ---------------------------------------------------------------- write PLAN.json
const plan = {
  skill: "beyond-ui", version: 3, generatedAt: new Date().toISOString(),
  frame: { domain: frame.domain || "", pageType: frame.pageType || "", platform, aesthetic, constraints: frame.constraints || "" },
  archetype: { key: archetypeKey, label: archetype.label, sequence: archetype.sequence, rules: archetype.rules },
  references: evidenceSites,
  motion: {
    grammar: motionPlan.primary.id, grammarName: motionPlan.primary.name,
    easing: motionPlan.primary.easing, durations: motionPlan.primary.durations, recipe: motionPlan.primary.recipe,
    alsoApplies: motionPlan.secondary.map((g) => g.id),
    evidence: motionEvidence,
  },
  sections: chosen.map((c, i) => ({
    order: i + 1, id: c.sec.id, role: c.role, name: c.sec.name, crossCutting: !!c.crossCutting,
    primary: c.primary, alternatives: c.alternatives, sources: c.sec.sources,
    build: c.sec.build, content: c.sec.content, motion: c.sec.motion,
    a11y: c.sec.a11y, hardFails: c.sec.hardFails, avoidWhen: c.sec.avoidWhen,
    why: `role=${c.role}; score=${c.score}; ${c.notes.join(", ")}`,
    citations: c.citations,
  })),
  primitives: { items: [...primitiveNeed.keys()], command: primitiveCmd, neededBy: Object.fromEntries(primitiveNeed) },
  registryInstall: registryItems,
  registryDiscipline: { maxRegistries: 3, inPlay: [...new Set(registryItems.filter((r) => r.kind === "shadcn-registry" && r.primary).map((r) => r.namespace))], swaps: planSwaps },
  peers: [...peerDeps],
  forbidden: [
    "three equal columns of icon+title+lorem (CRITIQUE Part 1 #3)",
    "gradient-text headline (Part 1 #2)", "transition: all (Part 1 #10)",
    "emoji icons (Part 1 #8)", "invented metrics/logos/testimonials (Part 1 #17)",
    "div-based fake browser/phone/terminal chrome (Part 1 #12)",
    "card-in-card nesting (Part 1 #3)", "placeholder-as-label (Part 1 #5)",
    "h-screen instead of min-h-[100dvh] (Part 1b)", "two layout families of the same kind on one page (Part 1b)",
  ],
};
fs.mkdirSync(beyondDir, { recursive: true });
fs.writeFileSync(path.join(beyondDir, "PLAN.json"), JSON.stringify(plan, null, 2) + "\n");

// ---------------------------------------------------------------- SECTION-PLAN.md
const cite = (c) => c.citations.map((x) => x.source).join(", ");
let md = `# SECTION-PLAN — ${archetype.label} — hand-picked for this project

> Generated by \`scripts/plan.mjs\` from the run's own evidence. Deterministic: the same frame yields the
> same plan. Every section below is a REAL block with a REAL install command — not a direction.

## Frame
\`\`\`
domain:      ${plan.frame.domain || "<unset>"}
pageType:    ${plan.frame.pageType || "<unset>"}  -> archetype: ${archetypeKey}
platform:    ${platform}
aesthetic:   ${aesthetic.join(", ") || "<unset>"}
constraints: ${plan.frame.constraints || "<unset>"}
\`\`\`

## Archetype rules (from assets/page-archetypes.json)
${archetype.rules.map((r) => `- ${r}`).join("\n")}

## Registry discipline (COMPONENTS.md rule 1: one aesthetic, 2–3 registries)
- In play: ${plan.registryDiscipline.inPlay.join(", ") || "primitives only"}  (${plan.registryDiscipline.inPlay.length}/3)
${plan.registryDiscipline.swaps.length
  ? plan.registryDiscipline.swaps.map((s) => `- swapped \`${s.section}\`: ${s.from} -> ${s.to} — ${s.reason}`).join("\n")
  : "- no swaps were needed: every primary already falls inside the registry set"}

## Motion grammar — ${motionPlan.primary.name} (\`${motionPlan.primary.id}\`)
- easing: \`${JSON.stringify(motionPlan.primary.easing)}\`
- durations: \`${JSON.stringify(motionPlan.primary.durations)}\`
- engine: ${motionPlan.primary.engine}
${motionPlan.primary.recipe.map((r) => `- ${r}`).join("\n")}
- budget: ${motionPlan.primary.budget}
${motionPlan.secondary.length ? `- also applies: ${motionPlan.secondary.map((g) => `\`${g.id}\` (${g.name})`).join(", ")}` : ""}
- evidence: ${motionEvidence.length ? motionEvidence.join(" · ") : "no motion evidence captured — say so in the report rather than claiming none exists"}

## Build sheet (order matters)
`;
let n = 0;
for (const s of plan.sections) {
  n += 1;
  md += `
### ${n}. ${s.name}  —  role: \`${s.role}\`${s.crossCutting ? "  (cross-cutting, not a section)" : ""}

**Why picked:** ${s.why}

**Primary block**
${s.primary
    ? `- \`${s.primary.command || s.primary.install}\`${s.primary.note ? ` — ${s.primary.note}` : ""}${s.primary.peers?.length ? ` (peers: ${s.primary.peers.join(", ")})` : ""}`
    : "- shadcn primitives only"}

**Alternatives (use if the primary is unavailable or mismatched)**
${s.alternatives.length
    ? s.alternatives.map((a) => `- \`${a.command || a.install}\`${a.note ? ` — ${a.note}` : ""}`).join("\n")
    : "- none"}

**Base primitives**
${(s.sources.filter((x) => x.kind === "shadcn-primitives")[0]?.items || []).length
    ? `- \`${s.sources.filter((x) => x.kind === "shadcn-primitives")[0].command}\``
    : "- none"}

**Build rules**
${s.build.map((b) => `- ${b}`).join("\n")}

**Content rules**
- ${s.content}

**Motion**
- ${s.motion}

**A11y**
${s.a11y.map((a) => `- ${a}`).join("\n")}

**Hard fails to avoid here**
${s.hardFails.map((h) => `- ${h}`).join("\n")}
${s.avoidWhen.length ? `\n**Omit this section when:** ${s.avoidWhen.join("; ")}\n` : ""}
**Citation:** ${cite(s)}
`;
}
md += `
## Do not install
${plan.forbidden.map((f) => `- ${f}`).join("\n")}

## Evidence this plan is grounded in
${evidenceSites.length
  ? evidenceSites.map((e) => `- \`${e.slug}\`${e.award ? ` (${e.award})` : ""} — tokens=${e.hasTokens ? "yes" : "no"}, capture=${e.capture ? "yes" : "no"}, keyframes=${e.keyframes}, transitions=${e.transitions}, interactions=${e.interactions}`).join("\n")
  : "- none — the teardown did not produce evidence. The plan is still deterministic, but the report MUST state that no per-reference evidence was captured."}
`;
fs.writeFileSync(path.join(beyondDir, "SECTION-PLAN.md"), md);

// ---------------------------------------------------------------- BLOCK-MAP.md
const grouped = new Map();
for (const c of plan.sections) for (const src of c.sources) grouped.set(`${c.id}::${src.command || src.install}`, { c, src });

let bm = `# BLOCK-MAP — element -> exact install -> restyle -> states -> citation

> Every element is pre-mapped to something that already ships. Hand-written is the exception and must be
> justified in scout.md. Commands verified against the live shadcn registry index on ${catalog.verified}.

## 1. Base primitives (one install, shared)
\`\`\`
${primitiveCmd}
\`\`\`
${[...primitiveNeed.entries()].map(([p, secs]) => `- \`${p}\` — needed by: ${[...new Set(secs)].join(", ")}`).join("\n")}

## 2. Registry components (aesthetic-specific, 2-3 registries max)
| Section | Pick | Element | Install | Peers | Restyle to tokens | States to ship |
|---|---|---|---|---|---|---|
${[...grouped.values()].filter(({ src }) => src.kind === "shadcn-registry").map(({ c, src }) =>
  `| ${c.name} | ${src === c.primary ? "**primary**" : "alt"} | \`${src.namespace}/${src.item}\` | \`${src.command}\` | ${(src.peers || []).join(", ") || "—"} | colours/spacing/radius -> project tokens before commit | default · hover · focus-visible · active · disabled · loading · error · success |`).join("\n") || "| — | — | — | — | — | — | — |"}

## 3. npm libraries
${[...grouped.values()].filter(({ src }) => src.kind === "npm").map(({ c, src }) => `- \`${src.install}\` — ${src.note || ""} (for ${c.name})`).join("\n") || "- none required by this plan"}

## 4. Peers / peer-conflicts to check BEFORE installing
${plan.peers.length ? plan.peers.map((p) => `- ${p}`).join("\n") : "- none"}
- Verify Tailwind major (v3 vs v4) and whether \`motion\` or \`framer-motion\` is already present — never install a second motion library (COMPONENTS.md rule 1).

## 5. Explicitly rejected for this project
${plan.forbidden.map((f) => `- ${f}`).join("\n")}
- Any registry whose demo colours would ship as-is (COMPONENTS.md rule 2).
`;
fs.writeFileSync(path.join(beyondDir, "BLOCK-MAP.md"), bm);

// ---------------------------------------------------------------- state
if (fs.existsSync(path.join(beyondDir, "state.json"))) {
  state.plan = { artifact: ".beyond-ui/PLAN.json", sectionPlan: ".beyond-ui/SECTION-PLAN.md", blockMap: ".beyond-ui/BLOCK-MAP.md",
    archetype: archetypeKey, sections: plan.sections.map((s) => s.id), motionGrammar: motionPlan.primary.id,
    registries: [...new Set(registryItems.filter((r) => r.kind === "shadcn-registry").map((r) => r.namespace))],
    evidenceSites: evidenceSites.map((e) => e.slug) };
  fs.writeFileSync(path.join(beyondDir, "state.json"), JSON.stringify(state, null, 2) + "\n");
}

console.log(`plan: ${archetype.label} (${archetypeKey}) — ${plan.sections.length} sections, ${primitiveNeed.size} primitives, ${registryItems.filter((r) => r.kind === "shadcn-registry").length} registry items`);
console.log(`  motion: ${motionPlan.primary.id}`);
console.log(`  wrote .beyond-ui/{PLAN.json,SECTION-PLAN.md,BLOCK-MAP.md}`);
