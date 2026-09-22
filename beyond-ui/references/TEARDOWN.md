# Teardown — select 10, tear down 10, synthesize 1

This is the deep-insight phase between SCOUT and DIRECTION. The old scout looked at references from
the outside (screenshots, gallery cards); the teardown opens them up and reads their design systems
from the inside, then condenses the evidence into a single binding project skill.

**Timebox:** this phase is 20–35% of the total UI task. It replaces guesswork with extracted tokens,
keyframes, section inventories and interaction diffs from sites that already won.

```
1 SELECT   score candidates from verified galleries      -> .beyond-ui/references-selection.json
2 TEARDOWN skillui ultra + playwright capture +          -> .beyond-ui/teardown/<slug>/
           firecrawl deep crawl (optional key)              + <slug>-capture/
3 SYNTH    condense 10 teardowns into ONE project skill  -> .beyond-ui/DESIGN-SKILL.md
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
| Live computed truth | `scripts/capture-site.mjs` (playwright) | `capture.json`: :root tokens, loaded fonts, all keyframes, transitions in use, computed styles, flex/grid usage, section inventory, motion-library detection, hover/focus diffs (CDP `forcePseudoState`), shots at 390/768/1440 full + scroll journey | skipped; skillui static output still present |
| Content shape | `scripts/firecrawl.mjs deep` (optional) | `content.md` + top same-origin pages as markdown — real copy structure, section text, proof patterns | skipped silently — no key means no firecrawl, never a blocker |

Status per site is recorded honestly: `ultra` (screens present) / `degraded` (tokens only) / `static`
(skillui static fallback) / `failed`. Budget 1–4 min per site with playwright; 15–40 min for 10.
A site that fails both skillui and capture must be re-selected — replace it with the next-best
candidate from the selection and re-run `--only <i>`.

**Plagiarism boundary (unchanged and non-negotiable):** teardown evidence is for *pattern and
grammar* — easing curves, spacing base, section order, state behaviour, type pairing. Never lift
identity: copy text, logos, imagery, illustration style, or a site's full visual identity wholesale.
One or two references may dominate the direction; ten must contribute evidence.

## 4. SYNTH — the one condensed project skill

`node scripts/teardown.mjs synth` merges the teardowns into **`.beyond-ui/DESIGN-SKILL.md`** — a
single file with nine sections:

0. One-line read (frame + top references)
1. Colour — accent/neutral candidates extracted from tokens (pick ONE, re-tune to brand)
2. Type — families observed (choose ONE pairing)
3. Spacing — base units observed (pick one and obey it)
4. Motion — libraries detected, keyframe vocabulary, transitions in use
5. Structure — section grammar + container patterns
6. Interaction states — where the diffs live + the rules they imply
7. Per-site deep-dives — which artifact came from which reference
8. Judgement still open — what the agent MUST still decide (this section is what keeps synthesis
   from becoming copy-paste)
9. Hard limits — pointer back to CRITIQUE/SKILLS/A11Y-PERF: evidence of what wins is not permission
   to reproduce a banned pattern

**The synthesis is evidence, not a decision.** Sections 1–5 narrow the choice; section 8 names the
decisions that remain; the DIRECTION step (scout.md contract) makes them. An award-winning reference
that uses gradient text does not override the gradient-text ban — its *easing curve* is what you steal.

## 5. What the agent does with it

- **DIRECTION** reads DESIGN-SKILL.md sections 1–5 and picks, citing the contributing site per choice.
- **COMPOSE** maps each element to a library as before; the motion section tells it WHICH grammar
  the references actually used (GSAP scroll scenes vs Motion stagger vs CSS-only).
- **BUILD** treats section 5's section grammar as the starting inventory and prunes by content.
- **CRITIQUE** checks the result against both the upstream gates AND the DESIGN-SKILL.md section 9
  limits.
- Every decision that came from a teardown cites it in `state.json -> ruleCitations`
  (source: `DESIGN-SKILL.md §n` or `teardown/<slug>`), so `verify-run.mjs` can prove usage.

## 6. Quality bar

- 6–10 teardowns with at least one artifact layer each; a run with fewer is a partial teardown and
  the report must say so.
- `capture.json` without keyframes means the site's motion is CSS-in-JS or cross-origin — say so
  rather than claiming "no motion".
- The synthesized file names its contributors; an unsourced section is a defect.
- Re-running `teardown.mjs run` is idempotent per site (skillui overwrites its own output; stale
  rich files are replaced, not accumulated).