# Teardown — select 10, tear down 10, synthesize 1, plan the build

This is the deep-insight phase between SCOUT and DIRECTION. The old scout looked at references from
the outside (screenshots, gallery cards); the teardown opens them up and reads their design systems
from the inside, condenses the evidence into a single binding project skill, and then **picks the real
blocks for this project** so the build never starts from a blank page.

**Timebox:** this phase is 25–40% of the total UI task. It replaces guesswork with extracted tokens,
keyframes, section inventories and interaction diffs from sites that already won.

```
1 SELECT   score candidates from verified galleries      -> .beyond-ui/references-selection.json
2 TEARDOWN skillui ultra + playwright capture +          -> .beyond-ui/teardown/<slug>/
           scrapling acquisition (keyless)                 + <slug>-capture/
3 SYNTH    condense 10 teardowns into ONE project skill  -> .beyond-ui/DESIGN-SKILL.md
4 PLAN     score the block catalog against THIS frame     -> .beyond-ui/{PLAN.json,
                                                             SECTION-PLAN.md,BLOCK-MAP.md}
                                                             (+ embedded as DESIGN-SKILL.md §10)
```

## 1. Why this exists

Two failure modes of the old scout:

1. **Gallery skimming.** Opening a listing, "getting inspired", writing the same generic hero. A
   reference you cannot name three techniques from is not a reference.
2. **Shallow evidence.** A screenshot tells you what a site looks like. It does not tell you the
   easing curve, the spacing base, the keyframe vocabulary, the section order, or how a button
   behaves on hover. Those live in the DOM and the CSS — which is exactly what this phase extracts.

## 2. SELECT — the best 10 for THIS project (rubric, not vibes)

Frame first (5 lines, in `references-selection.json` -> frame):

```
domain:    <product domain, user's words>
pageType:  <landing | pricing | dashboard | onboarding | component | app-store page | ...>
aesthetic: <3-5 keywords>
platform:  web | mobile-app | both
constraints: <stack, brand, dark mode, a11y target>
```

Fetch **2–4 galleries** with domain/pageType facets (all verified plain-HTTP fetchable; see
`assets/config.json` -> galleries):

| Platform | Primary (rankable) | Facet grammar |
|---|---|---|
| web | Awwwards | `/websites/?text=<domain>` — SOTD/HM/DEV badges + dates in HTML |
| web | Land-book | `/design/<pageType>?sort=featured` (+ `Accept: text/markdown` twin) |
| web | Saaspo | `/industry/<industry>` + `/page-types/<type>-examples` with counts |
| web | Minimal Gallery | `/tag/<domain>/` — age labels |
| web | CSSDA | `/wotd-award-winners` — numeric UI/UX/INN scores |
| mobile-app | Mobbin | `mobbin.com/llms.txt` + `/index.md`; MCP `api.mobbin.com/mcp` (paid plans) |
| mobile-app | Page Flows | `/ios/`, `/android/`, `/web/` — real recorded flows |

Playwright-capture-only sources (JS-rendered/bot-walled; never plain-HTTP): thefwa.com, dribbble.com,
behance.net, dark.design, refero.design listings, siteinspire (429 — backoff).

**Score every candidate 0–10 per criterion, weighted:**

| Criterion | Weight | Signal |
|---|---|---|
| Domain fit | ×3 (hard gate <4 = reject) | gallery facet match |
| Page-type match | ×2 | saaspo page-types, land-book `/design/*` |
| Award status | ×2 | Awwwards badge, CSSDA avg score ≥ 8.0 |
| Recency | ×1.5 | dates in markup; penalize pre-2023 |
| Aesthetic keyword fit | ×1.5 | facet tags + card text |
| Technique richness | ×1 | DEV awards, motion/WebGL evidence — only if this stack can reproduce it |
| Platform match | ×1 | mobile evidence for mobile-app projects is mandatory |

**Constraints on the final 10:** ≤ 2 from any single gallery · ≥ 3 with an explicit award signal ·
≥ 1 with mobile evidence even for web projects · ≤ 2 duplicates of the same product.

Write `references-selection.json` with per-site `{url, title, gallery, award, score, why}` + `rejected`
(with reasons). Record the outcome in `state.json -> selection`. This file is the audit trail for why
THESE 10 and not others.

## 3. TEARDOWN — run it

```bash
node scripts/teardown.mjs init     # scaffold .beyond-ui/references-selection.json (+ teardown dir)
# ... fill the selection (agent work: fetch galleries, score, pick 10) ...
node scripts/teardown.mjs run      # teardown all 10 + synthesize
node scripts/teardown.mjs run --only 3,7   # re-run just sites 3 and 7
node scripts/teardown.mjs synth    # re-run only the synthesis
```

Per site, three independent layers run (skip flags exist for each):

| Layer | Tool | Produces | Fallback when unavailable |
|---|---|---|---|
| Design system | `skillui` (pinned `skillui@1.3.4`, ultra mode) | `SKILL.md` + `references/{DESIGN,ANIMATIONS,LAYOUT,COMPONENTS,INTERACTIONS}.md` + `tokens/{colors,spacing,typography}.json` + `screens/{scroll,pages,sections,states}/` | skillui's own static HTTP mode (no screens, tokens still written) |
| Live computed truth | `scripts/capture-site.mjs` (playwright) | `capture.json`: :root tokens, loaded fonts, all keyframes, transitions in use, computed styles (body/h1/h2/h3/p/a/button/input/nav/header/footer/section), flex/grid usage, section inventory, motion-library detection, hover/focus diffs, shots at 390/768/1440 full + scroll journey | skipped; skillui static output still present |
| Content shape | Scrapling MCP tools, fanned out by `scripts/scrapling.mjs deep` (keyless) | `content.md` + `pages/*.md` (top same-origin pages) + `links.json` — the real copy structure, section text, proof patterns | the CLI bridge (`scrapling.mjs deep`) alone; then skipped, and Playwright capture still gives structure and tokens |

**Why Scrapling and not a keyed crawler.** The content layer used to depend on an API key, so on most
machines it silently did nothing. No key, no account, no LLM, no quota: **the layer that was
usually skipped now always runs.** It also replaces the old LLM-driven browser fallback, which was
needed only because the previous crawler could not get past bot walls.

**Two routes to the same engine.** `scripts/install-tools.mjs` registers the
[Scrapling-Plugin](https://github.com/Jeetaksh25/Scrapling-Plugin) MCP server for `claude-code`
(`npx -y github:Jeetaksh25/Scrapling-Plugin --agent claude-code`). That server exposes 13 tools and
is the **preferred** path — the agent calls them directly, with no shell and no intermediate file:

| need | tool |
|---|---|
| simple page / article / API / JSON | `mcp__scrapling__make_request` |
| JS-rendered page | `mcp__scrapling__fetch` |
| Cloudflare / anti-bot | `mcp__scrapling__stealthy_fetch` |
| many URLs at once | `mcp__scrapling__bulk_get` · `bulk_fetch` · `bulk_stealthy_fetch` |
| login, cookies, pagination | `open_session` → `session_fetch` → `close_session` |
| screenshot | `mcp__scrapling__screenshot` |

Escalate `make_request → fetch → stealthy_fetch`; the browser tiers cost about the same wall-clock,
so escalating costs stealth, not speed. Always pass a `css_selector` when you know the field — it is
the biggest token saver and the reason these beat a generic fetch. The `scrapling` skill
(§ selectors, MCP server, spiders) is the API reference.

`scripts/scrapling.mjs` is the fallback: batch/CI runs, `deep` fan-out, and any harness with no MCP
server. It resolves its engine itself — `scrapling` on PATH → `<python> -m scrapling.cli` → Docker
(`--docker`) — escalates `get → fetch → stealthy-fetch` on its own, and passes `--ai-targeted` on
every call (nav/ads stripped, hidden prompt-injection content sanitized — the MCP tools sanitize
equally). Use it directly whenever you need a page as text, including during SCOUT:

```bash
node scripts/scrapling.mjs check                                        # preferred path + engine (JSON)
node scripts/scrapling.mjs scrape <url> <out.md>          # one page, markdown
node scripts/scrapling.mjs scrape <url> <out.md> --css ".pricing-table"   # narrow before extraction
node scripts/scrapling.mjs map    <url> <out.json> --limit 30            # same-origin link inventory
node scripts/scrapling.mjs deep   <url> <outDir>  --pages 3              # content.md + pages/ + links.json
```

`check` reports `"preferred": "mcp"` or `"cli"` — read it once at 0a and do not re-derive it.
Options: `--mode get|fetch|stealthy-fetch` (pin a tier instead of escalating), `--timeout <ms>`,
`--python <exe>`, `--docker`. `--css-selector` is accepted as an alias of `--css`. Proxy support lives
in `assets/config.json → scrapling.proxy`; MCP-vs-CLI and install toggles in
`assets/config.json → scrapling.mcp`. Respect each target's terms: fetch what the task needs, not
a whole site.

Status per site is recorded honestly: `ultra` (screens present) / `degraded` (tokens only) / `static`
(skillui static fallback) / `failed`. Budget 1–4 min per site with playwright; 15–40 min for 10.
A site that fails both skillui and capture must be re-selected — replace it with the next-best
candidate from the selection and re-run `--only <i>`.

**Plagiarism boundary (unchanged and non-negotiable):** teardown evidence is for *pattern and
grammar* — easing curves, spacing base, section order, state behaviour, type pairing. Never lift
identity: copy text, logos, imagery, illustration style, or a site's full visual identity wholesale.
One or two references may dominate the direction; ten must contribute evidence.

## 4. SYNTH — the one condensed project skill

`node scripts/teardown.mjs synth` merges the teardowns into **`.beyond-ui/DESIGN-SKILL.md`** — a single
file that carries REAL values, not adjectives:

0. One-line read (frame + top references)
1. Colour — accent/neutral candidates **ranked by how many references used them**, with owner slugs,
   the resolved semantic roles, the dominant theme and the observed radii (pick ONE, re-tune to brand)
2. Type — families observed with owner counts, plus the **extracted scale** (`h1: 72px/0.98 -0.03em
   Instrument Sans`) derived from the captured computed styles
3. Spacing, grid, radius — the base units actually observed across the references
4. Motion — libraries detected, keyframe vocabulary with owner counts, the transitions in use with
   their real durations/easings, and the captured hover/focus deltas
5. Structure — the section inventory **in DOM order with owner counts**
6. Interaction states — how many state diffs were captured and where they live
7. Contrast — **WCAG ratios computed from the captured computed styles**, with failing pairs named
   "do not reproduce"
8. Per-site deep-dives — which artifact came from which reference
9. Judgement still open — what the agent MUST still decide
9b. Hard limits — pointer back to CRITIQUE/SKILLS/A11Y-PERF
10. **HAND-PICKED BUILD PLAN** — the embedded `SECTION-PLAN.md` + `BLOCK-MAP.md` (see §5)

**The synthesis is evidence, not a decision.** Sections 1–7 narrow the choice; section 9 names the
decisions that remain; the DIRECTION step (scout.md contract) makes them. An award-winning reference
that uses gradient text does not override the gradient-text ban — its *easing curve* is what you steal.

## 5. PLAN — hand-picked real blocks for THIS project

The old synthesizer stopped at evidence, which left the agent a direction and a blank page. `synth`
now also runs **`scripts/plan.mjs`**, deterministically:

1. Resolve the **archetype** from the frame's `pageType`/`platform` against `assets/page-archetypes.json`
   (landing, saas-marketing, pricing, dashboard, docs, onboarding, component, content, auth, error,
   mobile-app). The archetype supplies the section ORDER.
2. Score every entry of **`assets/block-catalog.json`** against this project: archetype role (+10),
   page-type fit (+4), aesthetic/domain keyword overlap (+3 each), and match against the **real section
   inventory captured from the references** (+up to 4). Constraints veto (`no WebGL` kills an orbit
   block; a web-only block is penalised on a mobile project).
3. Pick one block per role in archetype order (deduplicated, `features` may take a second complementary
   family), choose the **motion grammar** from `assets/motion-catalog.json`, and emit:
   - `.beyond-ui/PLAN.json` — machine-readable (gate G10 reads it)
   - `.beyond-ui/SECTION-PLAN.md` — the ordered build sheet
   - `.beyond-ui/BLOCK-MAP.md` — element → exact install → restyle → states
   - the same two documents embedded verbatim as DESIGN-SKILL.md **§10**

Each planned section carries: the **primary block and its exact command**
(`npx shadcn@latest add @magicui/hero-video-dialog`), its alternatives, its peers, its build rules, its
content rules, its motion instruction, its a11y duties, the hard fails specific to it, when to omit it,
and the citation back to `block-catalog.json#<id>`. The plan also lists the **de-duplicated base
primitives as one install**, the **peer dependencies to check before installing** (Tailwind major,
`motion` vs `framer-motion`), and an explicit **forbidden** list.

**Registry discipline is enforced by the planner, not asked for in prose.** `COMPONENTS.md` rule 1
says one aesthetic and 2–3 registries; the planner holds the plan to it. While the picked primaries
would span a fourth registry, the section that can move *and* whose registry is rarest is re-pointed
at an already-in-play alternative (preferring a move that eliminates a registry outright, then the
busiest destination). Every swap is recorded in `PLAN.json -> registryDiscipline.swaps` and printed in
SECTION-PLAN.md, so `"we swapped @animate-ui for @aceternity because the plan was spanning four
registries"` is auditable rather than silent. G10 fails a plan that still exceeds three.

**Section count is archetype-aware.** A `docs` page genuinely has three roles and a `component`
delivery has one; G10 demands `min(4, archetype.sequence.length)` rather than a flat four.

**Why deterministic.** The same frame yields the same plan, so the choice is auditable rather than
vibes: run it again and diff. `PLAN.json` is what G10 checks and what G12 traces the finished build
back to.

**The plan proposes; the content decides.** Deleting a planned section because the content cannot
support it is correct and expected. Hand-writing a section that the catalog already covers is a defect
unless scout.md records why (licence, bundle, incompatibility, genuinely bespoke). Extending the
catalog is how this skill gets better — add a verified entry to `assets/block-catalog.json` and every
future run can use it.

## 6. What the agent does with it

- **DIRECTION** reads DESIGN-SKILL.md §1–§7 and picks, citing the contributing site per choice, inside
  the bounds §10 sets.
- **COMPOSE** installs what BLOCK-MAP.md names: the de-duplicated primitive list, then each section's
  **primary** block, in SECTION-PLAN order — and records the result in `state.components` /
  `state.composedSections` so G12 can trace it.
- **BUILD** treats SECTION-PLAN.md as the starting sheet and prunes by content: delete a section the
  content cannot support, keep the order of the rest.
- **CRITIQUE** checks the result against the upstream gates, the DESIGN-SKILL.md §9b limits, and the
  per-section "hard fails to avoid" the plan printed for that section.
- Every decision that came from a teardown cites it in `state.json -> ruleCitations`
  (source: `DESIGN-SKILL.md §n` or `teardown/<slug>`), so `verify-run.mjs` can prove usage.

## 7. Quality bar

- 6–10 teardowns with at least one artifact layer each; a run with fewer is a partial teardown and
  the report must say so.
- `capture.json` without keyframes means the site's motion is CSS-in-JS or cross-origin — say so
  rather than claiming "no motion".
- The synthesized file names its contributors; an unsourced section is a defect.
- §10 must be present with real commands. A synthesis with evidence but no plan is a run from v2 and
  fails G11.
- Every planned section names a primary block with a full `npx shadcn@latest add …` command; a section
  whose "block" is a paragraph of adjectives is a defect.
- Re-running `teardown.mjs run` is idempotent per site (skillui overwrites its own output; stale
  rich files are replaced, not accumulated). Re-running `synth` is idempotent too, and the planner is
  deterministic — same frame, same plan.