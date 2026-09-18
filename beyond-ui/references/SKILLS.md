# Upstream skills — mandatory install and inheritance

Beyond UI is a **composition layer**. It does not re-teach design from scratch; it forces the agent to
install, read and obey the upstream design skills below, then binds them to a scout-first workflow
over real galleries, prompt libraries, component registries and shadcn/ui.

**Bootstrap is not optional and may not be skipped, "worked around", or simulated from memory.**
If a source skill is absent, install it. If installation is impossible (no network, no `npx`), say so
explicitly and fetch the raw `SKILL.md` URL instead. Never proceed as though a skill existed, and
never paraphrase one from memory instead of fetching it.

## Phase 0 — Bootstrap

```bash
bash scripts/bootstrap-upstream-skills.sh          # from the beyond-ui skill folder (or --global)
```

Run it from the target project. It reports what is already present, installs what is missing, and
prints a capability report; anything that fails is listed with the reason and must be handled (fetch
the raw `SKILL.md` and read it) before UI work starts.

## The catalogue (verified 2026-09; re-check paths, repos get reorganised)

| Skill | Source | Install | What it actually contains |
|---|---|---|---|
| **impeccable** | `pbakaus/impeccable` (Apache-2.0) · `.agent/skills/impeccable/SKILL.md` | `npx impeccable install` | 24 design commands (`polish`, `audit`, `critique`, `distill`, `animate`, `bolder`, `quieter`, `harden`, `delight`, `overdrive`…) plus **61 deterministic detector rules** that run without an LLM, and live in-browser iteration. Descends from Anthropic's frontend-design skill. |
| **hallmark** | `Nutlope/hallmark` (MIT) · `skills/hallmark/SKILL.md` | clone + copy; skills-CLI if the layout matches | The anti-AI-slop skill: 21 named macrostructures × 21 themes, a **57-gate slop test**, pre-emit self-critique scored on six axes, honest-copy rule (never invent a metric), locked tokens, no fake browser chrome, typography purity (no italic headers). |
| **ui-ux-pro-max** | `nextlevelbuilder/ui-ux-pro-max-skill` (MIT) · `.claude/skills/design/SKILL.md` + `ui-styling` + `design-system` | clone + copy | A design-intelligence database: 192 industry reasoning rules, 79 UI styles, 192 palettes, 34 landing patterns, 74 font pairings, selected by BM25 search rather than invented. Ships the mandatory pre-delivery checklist and prescribes shadcn/ui + Tailwind + token architecture. |
| **taste-skill** | `leonxlnx/taste-skill` (MIT) · `skills/taste-skill/SKILL.md` | clone + copy | ~1200 lines of prescriptive taste rules with three dials (`DESIGN_VARIANCE`/`MOTION_INTENSITY`/`VISUAL_DENSITY`). Design Read first, anti-default discipline, palette rotation, layout-repetition bans, 8 states, image strategy priority, no div-based fake screenshots. |
| **frontend-design** | `anthropics/skills` → `skills/frontend-design/SKILL.md` (Apache-2.0; also in `anthropics/claude-code` plugins path) | `npx skills add <path>` or clone | The origin skill. Names the AI-tell clusters (warm-cream + serif + terracotta, near-black + acid accent, broadsheet hairlines, SaaS-card kit, template chrome) as **calibration data**, not bans; two-pass process (token plan + ASCII wireframe → review against brief → build); one orchestrated moment; "spend your boldness in one place"; Chanel rule. |
| **frontend-ui-engineering** | `addyosmani/agent-skills` (MIT) · `skills/frontend-ui-engineering/SKILL.md` | `npx skills add addyosmani/agent-skills --skill frontend-ui-engineering` | Engineering craft: AI-aesthetic avoidance table, spacing scales, semantic tokens, state-management ladder, WCAG 2.1 AA floor, skeletons over spinners, composition over configuration, 320/768/1024/1440 testing. (Repo has 25 skills — pull the others when relevant.) |
| **web-design-guidelines** | `vercel-labs/agent-skills` (MIT) | `npx skills add vercel-labs/agent-skills --skill web-design-guidelines` | A fetcher: pulls Vercel's **Web Interface Guidelines** (100+ rules across a11y, focus, forms, animation, typography, content, images, performance, navigation, touch, safe areas, dark mode, i18n, hydration) and audits with `file:line` output. |
| **react-best-practices** | same repo | `--skill react-best-practices` | 70 rules by impact: kill waterfalls (`Promise.all`), bundle discipline (no barrel imports, `next/dynamic`), server perf (auth in server actions, `React.cache()`), re-render and JS micro-optimisation. |
| **composition-patterns** | same repo | `--skill composition-patterns` | Compound components over boolean props, decouple state from implementation, explicit variants over modes, `children` over render props, React 19 no-`forwardRef`. |
| **react-view-transitions** | same repo | `--skill react-view-transitions` | The View Transition API done properly: shared element > Suspense reveal > list identity > state change; every transition must communicate continuity. |
| **react-native-skills** | same repo | `--skill react-native-skills` | FlashList for long lists, animate only transform/opacity (Reanimated), native stack/tabs, `expo-image`, Pressable over TouchableOpacity, safe areas. |
| **bencium design skills** | `bencium/bencium-marketplace` (MIT) | clone + copy | Three designers with a conflict-resolution philosophy: controlled (enterprise, WCAG-first), innovative (campaigns, concept rounds), impact (production anti-slop). Explicit NEVER list: Inter/Roboto/Space Grotesk, generic SaaS blue, purple gradients, glass morphism, Apple mimicry, blob backgrounds; commit-to-one-of-~40 named aesthetic directions. |
| **accesslint** | `AccessLint/skills` (MIT) | clone + copy | Five a11y skills driving `@accesslint/core` over a **live rendered DOM**: scan (locate only), inspect (keyboard, names/roles/states, reflow, zoom, reduced motion), audit (WCAG-EM sampling), fix (baseline → edit → verify), diff (regression guard). Two-axis findings: severity × evidence basis (verified · confirm-with-human · human-required). |
| **refactoring-ui** | `gnurio/refactoring-ui-plugin` (MIT) | clone + copy | Refactoring UI's principles as 10 atomic skills in composition order: hierarchy → spacing → type scale → palette → button hierarchy → remove clutter → shadows → empty states → contrast → proximity/grouping. |

## Inheritance matrix — what Beyond UI takes from each

| Source | Non-negotiables inherited into Beyond UI |
|---|---|
| impeccable | Tinted neutrals (never pure black/grey); no gray text on colour; no card-in-card; no bounce/elastic easing; live iteration on the rendered page, not in imagination |
| hallmark | Structural variety across outputs (not colour swaps); the 57-gate slop test; six-axis pre-emit self-critique; honest copy (never invent a metric — use an honest gap); locked tokens (no inline hex/OKLCH mid-render); no re-drawn browser/phone chrome; headers roman; 8 states for any component brief |
| ui-ux-pro-max | Brief → pattern/style/palette/type pairing must be *selected*, not invented; industry anti-pattern lists; mandatory pre-delivery checklist; token architecture (primitive → semantic layers) |
| taste-skill | Write the one-line **Design Read** before code; anti-default discipline; max one accent; palette rotation (never ship the same beige+brass family twice running); layout-family repetition ban (each layout once per page); max 1 eyebrow per 3 sections; never `h-screen` (use `min-h-[100dvh]`); no placeholder-as-label; no div-based fake screenshots; one CTA intent per label |
| frontend-design | Brief's own words win, including when it asks for a listed tell; two-pass plan-then-review; one orchestrated moment; spend boldness in one place; quality floor without announcing it |
| frontend-ui-engineering | Spacing scale discipline (no invented `13px`); semantic tokens; real `<button>`; focus management in dialogs; skeletons over spinners; composition over configuration |
| web-design-guidelines | Never `outline:none` without a `focus-visible` replacement; never `transition: all`; honour `prefers-reduced-motion`; animate transform/opacity only; never block paste; submit stays enabled; URL reflects state; destructive actions need confirm or undo; real typographic punctuation; `tabular-nums`; `text-wrap: balance`; explicit image dimensions; no `<div onClick>` |
| react-best-practices / composition-patterns | No waterfalls; no barrel imports; explicit variants instead of boolean prop soup; server actions authenticated |
| react-native-skills | Native idioms per platform; UI-thread animation; FlashList |
| bencium | Commit to one named aesthetic direction fully; the NEVER list (generic SaaS blue, purple gradients, glass morphism as identity); deliberate anti-sameness |
| accesslint | Findings carry an **evidence basis** (verified / confirm-with-a-human / human-required); audits run against the rendered DOM; a11y regression diff on every change |
| refactoring-ui | Hierarchy first, then spacing, then type, then colour; clutter removal before decoration; empty states are designed |

## Conflict resolution (upstream skills disagree — these rulings win)

| Conflict | Ruling |
|---|---|
| shadcn/ui vs hand-written CSS | **shadcn/ui is the base** for every control (beyond-ui non-negotiable #3). Style with tokens/variants, not forks. Aesthetic bans apply *on top* — an unthemed shadcn default is itself an AI tell. |
| Inter | Banned as the **display** choice; permissible as a body face when the brief is explicitly neutral/system or Linear-style. Never the reflexive default. |
| Serif display | Allowed via hallmark's catalogue (as an allowlist) but governed by taste-skill's frequency rule: never the default, never the same serif across consecutive projects. Cream + serif + terracotta is a known tell — use it only if it is genuinely the brand. |
| Italic/emphasis in headings | Headers stay roman; emphasise with weight, colour or underline; never mix families inside a headline (hallmark's rule subsumes the others). |
| Eyebrows (ALL-CAPS labels) | Default **off**; never a tag-left/header-right split head; at most one per three sections. |
| Centred hero | Allowed only when the message itself is the design (manifesto/editorial); otherwise bias away from centre. |
| Gradient text | Banned (no purple→blue, no `background-clip: text` headlines) unless the brand literally owns it. |
| Invented content | Never. Metrics, logos, testimonials and screenshots that do not exist are replaced by an honest gap plus a labelled placeholder. |
| Icon library | One library per project, driven by what is already installed; never emoji as icons; never hand-rolled SVG glyphs. |
| Animation | Motion (`motion/react`) is the default React engine; CSS for micro-interactions; GSAP/Anime for timelines/SVG. No bounce/elastic easing. Decorative-only motion is a defect. |
| A11y ceiling | WCAG 2.2 AA is a floor owned by the Vercel/accesslint rule sets; aesthetics never trade it away. |
| Em dashes | UI copy: proper typographic punctuation is correct (hallmark). Prose/docs written by `writing-guidelines` scope: avoid em dashes as punctuation. Keep the scopes separate. |

## Proof that inheritance happened

Do not claim "followed the upstream skills". Show it:

1. `.beyond-ui/state.json` → `skills.installed` / `skills.missing` (with the blocking reason and the
   raw `SKILL.md` URL that was read instead).
2. `.beyond-ui/scout.md` → the Design Read line (taste-skill) and at least one named rule from a named
   skill that changed a decision ("hallmark gate: cream+serif+terracotta rejected as a listed tell").
3. `.beyond-ui/scout.md` → the **pre-emit critique stamp**, e.g.
   `/* beyond-ui · critique: P5 H4 E5 S4 R5 V5 */` on six axes (Philosophy, Hierarchy, Execution,
   Specificity, Restraint, Variety); anything below 3 forces a revision pass.
4. `references/CRITIQUE.md` scores the rendered page; every hard fail traces to a named upstream rule.
5. Run `npx skills update` / re-run the bootstrap periodically — a stale local copy silently diverges
   from the current rule set.
