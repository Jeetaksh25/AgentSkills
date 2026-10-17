---
name: beyond-ui
description: Use when building, redesigning, styling or polishing any user interface - landing pages, marketing or SaaS sites, portfolios, dashboards, web, mobile or desktop apps, or a single component - where the result must match award-level studio work (Awwwards, Godly, motionsites.ai, Dribbble shots) instead of looking AI-generated. Covers skill routing, reference teardowns, component sourcing from shadcn/ui and animated registries, scroll choreography and motion craft, mobile/desktop parity, the production/SEO pass, and mechanical gates (G1-G19) that prove each step happened.
license: MIT
---

# Beyond UI

The output must read like work a design studio charged five figures for, produced without the user
directing each step. That never comes from inventing a gradient hero from memory. It comes from five
moves, in order:

1. **ROUTE** the right skills — 10 routed (5 permanent + 5 for this project) plus phase specialists.
2. **STUDY** what already wins — exactly 5 award-level references, torn down to their systems.
3. **IMPORT** what already exists — shadcn/ui for controls, the animated registries for effects.
4. **CRAFT** what registries get wrong — choreography, reveals, glass, shaders, transitions, cursor.
5. **PROVE** it — exercised like a human, measured, frozen, shipped, gated.

## Failure modes this skill exists to kill

1. **AI slop** — centred hero, three feature cards, Inter everywhere, purple-blue gradient, emoji icons,
   `transition-all` on everything, `rounded-2xl bg-white/10 backdrop-blur`.
2. **Reinventing the wheel** — hand-writing a marquee, dialog or text effect a registry ships.
3. **Unused tooling** — skills installed and never read; skills read and never cited.
4. **Static craft** — the right components, no choreography: nothing moves with intent, nothing reveals.
5. **The fix that flattens** — a responsive, performance or production pass that quietly changes the
   signed-off design, or a phone that gets the desktop squeezed.
6. **Finished but not shipped** — no metadata, share images, sitemap, headers or 404.

## Contracts (numbers are enforced, not suggested)

| Contract | Value | Enforced by |
|---|---|---|
| Routed skills | **exactly 10** (5 permanent + 5 by project profile) | `skills-router.mjs verify` · G3 |
| Phase specialists | invoked at their phase **when present**, never installed for it | `state.skills.invoked` · G7 citations |
| Reference sites | **exactly 5** | G4 |
| Components | shadcn/ui first, registries second, custom last (with a reason) | `import-ledger.mjs audit` · G13 |
| Citations | ≥5, plus one per routed skill | G7 |
| QA | journey through the real app | `qa.mjs journey` · G14 |
| Rendered critique | 0 critical hard fails | `critique.mjs` · G15 |
| States | loading + empty + error on every async surface | `states.mjs` · G16 |
| Craft | 0 critical CRAFT.md defects | `craft-check.mjs` · G17 |
| Production | crawl surface, metadata, headers, 404 verified live | `production-check.mjs` · G18 |
| Parity | signed-off design unchanged by later passes | `parity.mjs` · G19 |

## Autonomy

Run the whole loop without stopping for approval. Decide unspecified choices with
`references/PLAYBOOK.md` §7 and record them. Ask the user only for what cannot be inferred and changes
the outcome: real proof (customers, numbers), brand assets that exist somewhere, or a hard constraint
that contradicts the brief. Never invent those; ship a labelled gap instead. Deploying, publishing and
pushing still need the user's word.

## The operating loop

Each phase names what to load, what to invoke and what proves it. Scripts live in `scripts/` and run
from the target project (`node <skill>/scripts/<name>.mjs`).

| # | Phase | Load | Invoke (PLAYBOOK §2) | Run / produce | Gate |
|---|---|---|---|---|---|
| 0a | BOOTSTRAP | `references/PLAYBOOK.md` | — | empty repo: scaffold the default stack first (PLAYBOOK §7); then `scaffold-state.mjs`, `bootstrap-upstream-skills.mjs` (`.sh` on POSIX) | G1, G3 |
| 0b | ROUTE | `references/SKILLS.md` | — | `skills-router.mjs status` | G3 |
| 0c | RECON | `references/STACKS.md` | redesign/audit skills if a UI exists | stack, brand, design system, audience into `state.json` | — |
| 1 | SCOUT | `references/SCOUT.md`, `INSPIRATION.md`, `PROMPTS.md` | `design-inspiration-index`, `hallmark` (URL extraction) | `.beyond-ui/scout.md` (frame, refs, prompts, library map) | G2 |
| 2 | SELECT | `references/TEARDOWN.md` | studio `*-design` skills as candidate references | `teardown.mjs init` → exactly 5 | G4 |
| 3 | TEARDOWN | `references/TEARDOWN.md` | — | `teardown.mjs run` → `DESIGN-SKILL.md`, `PLAN.json` | G5, G6, G10, G11 |
| 4 | DIGEST | — | — | `skills-router.mjs digest` → `.beyond-ui/SKILL.md` | G3b |
| 5 | DIRECTION | `references/DESIGN.md`, `MOTION.md`, `CONTENT.md` | `frontend-design`, `ui-ux-pro-max`, `taste`, one lane skill, typography, refactoring-ui | the direction contract in `scout.md` | G7 |
| 6 | COMPOSE | `references/COMPONENTS.md`, `SHADCN.md` | shadcn + the 2–3 registries in play | `import-ledger.mjs plan` | G13 |
| 7 | BUILD | `references/CRAFT.md`, `PARITY.md`, `EFFECTS.md`, `THREEJS.md` (3D only) | `frontend-ui-engineering`, `impeccable`, motion-engine skill | tokens, real copy, real states, recipes | G12, G13 |
| 8 | QA | — | `playwright-skill`, `browser-use` | `qa.mjs journey <url>` at 390 and 1440 | G9, G14 |
| 9 | CRITIQUE | `references/CRITIQUE.md` | `hallmark`, `impeccable` critique, accesslint scan + inspect | `critique.mjs <url>`; fix; re-render | G8, G15 |
| 10 | FREEZE | `references/PARITY.md` | — | `parity.mjs baseline <url> --routes …` | G19 |
| 11 | HARDEN | `references/A11Y-PERF.md`, `PARITY.md` | `accesslint-accessibility-fix` / `-diff` | `states.mjs`, `craft-check.mjs`, perf + a11y fixes, `parity.mjs check` | G16, G17, G19 |
| 12 | SHIP | `references/PRODUCTION.md` | `production-suite-completion` | production build → `production-check.mjs <url>` → smoke tests → `parity.mjs check` | G18, G19 |
| 13 | GATE | `references/USAGE.md` | — | `import-ledger.mjs audit && skills-router.mjs verify && verify-run.mjs` | G1–G19 |

Phases 1–5 are a third of the work and the ones agents skip. Output quality is decided there.
A single-component brief runs the same loop at component scale: 3+ references, no SHIP phase
(`surface: "component"` makes G18 n/a), FREEZE on the page that hosts the component.

## Non-negotiables

1. **Route before you work.** Bootstrap, then read `.beyond-ui/SKILL.md`. A skill that cannot be
   installed is fetched from its raw `SKILL.md` URL, read, and recorded in `state.skills.missing`. The
   bootstrap also installs the tool layer, skip-if-present: Playwright + Chromium (the only hard
   requirement), skillui, opensrc, Scrapling, browser-use.
2. **Follow the skills, and show it.** Every load-bearing decision cites its source
   (`skill://<id> -> <rule>`, `DESIGN-SKILL.md §n`, `teardown/<slug>`, `CRAFT R<n>`), every routed skill
   at least once, every invoked specialist at least once.
3. **Scout before you design.** No layout, palette, type scale or motion before `scout.md` exists and
   names its URLs and what was taken from each.
4. **Import, don't reinvent.** shadcn/ui supplies every control; the plan's registries supply every
   animated piece. Hand-rolling what a library ships is a defect; custom code carries
   `beyond-ui:custom <reason>` or an entry in `state.components.handWritten`.
5. **Choreograph, don't decorate.** A marketing page gets a motion system (CRAFT R1/R2/R6/R8 by
   default): scroll-timeline sections authored in viewport-heights, overhang-padded reveals, one
   entrance grammar, expo/quint easing, no bounce. App UI gets micro-interactions only. Everything
   respects `prefers-reduced-motion`.
6. **Every viewport is designed.** Design 390 / 768 / 1440. Hover reveals become scroll- or
   tap-driven on touch; WebGL becomes a static gradient on phones; mobile work on a signed-off desktop
   lives behind max-width queries only (`references/PARITY.md`).
7. **Remove cost, not design.** Performance and accessibility fixes make the same effect cheaper,
   deferred or device-scoped; a fix that can only be reached by changing the look is an accepted risk
   reported to the user, not a silent edit. `parity.mjs check` proves it.
8. **Real content, real states.** No lorem, no "Empower your workflow", no invented metrics or logos.
   Loading, empty (with a next action) and error (with recovery) on every async surface.
9. **Preserve identity.** An existing brand or design system wins over your taste; extend it.
10. **Ship, then claim.** Metadata per page, generated share images, sitemap, robots, manifest,
    JSON-LD, security headers, a designed 404, smoke tests and CI (`references/PRODUCTION.md`).
11. **No unverified claims.** Done means rendered, measured, frozen-compared and gated. A failing gate
    is fixed by doing the work, never by relaxing the gate, re-baselining without a reason, or editing
    `state.json` by hand.

## What to load, by need

| Need | File |
|---|---|
| Which skill, source, fetch tool or default — the decision procedure | `references/PLAYBOOK.md` |
| Scroll timelines, mask reveals, liquid glass, jelly pill, shader backgrounds, page curtain, cursor, Lenis | `references/CRAFT.md` |
| Mobile/desktop parity, freeze-and-compare, perf/a11y without flattening | `references/PARITY.md` |
| Production/SEO pass, smoke-test template | `references/PRODUCTION.md` |
| Upstream skill catalogue, inheritance, conflict rulings | `references/SKILLS.md` |
| Scout protocol, galleries, prompt/template sources | `references/SCOUT.md`, `INSPIRATION.md`, `PROMPTS.md` |
| Select 5, teardown, synthesis, plan | `references/TEARDOWN.md` |
| Registries, install commands, compatibility; shadcn setup | `references/COMPONENTS.md`, `SHADCN.md` |
| Type, colour, spacing, hierarchy; motion contract; effects; 3D | `references/DESIGN.md`, `MOTION.md`, `EFFECTS.md`, `THREEJS.md` |
| Copy and metadata surface | `references/CONTENT.md` |
| Accessibility and performance constraints | `references/A11Y-PERF.md` |
| Stack recipes | `references/STACKS.md` |
| Hard fails and the 12 quality gates | `references/CRITIQUE.md` |
| Citation contract and gate list | `references/USAGE.md` |
| Worked walkthroughs | `references/EXAMPLES.md` |
| Library index | `references/LIBRARIES.md` |
| Machine-readable catalogs (skills, blocks, motion, archetypes, registries, galleries) | `assets/*.json` |

## Traps

- **Installing everything.** Install the 10; read the 10; cite the 10. Specialists are used if present,
  never installed to tick a box.
- **Ten references.** Five, handpicked. G4 fails anything else.
- **Registry roulette.** Eight animated components that share no aesthetic. 2–3 registries, max.
- **Scout and teardown theatre.** Galleries opened, then the same generic hero built from memory.
  Every direction choice cites its contributing site.
- **Version drift.** Tailwind v3 snippets in a v4 project; `framer-motion` registry code in a `motion`
  project. Check the stack first.
- **Motion everywhere.** Every element fading up on scroll is its own slop. One grammar, one
  orchestrated moment, choreography where the story is.
- **Clipped reveals.** `overflow-hidden` line reveals without em overhang padding slice italic tails,
  descenders and question marks (CRAFT R2).
- **Glass as a personality, glass without a fallback.** SVG-refraction glass renders nothing in Safari
  and Firefox (CRAFT R3).
- **WebGL on phones.** Flicker, battery, leaked contexts. Static fallback on mobile (CRAFT R5).
- **A blurry cursor.** Scaling a small dot up rasterises it; render large, scale down (CRAFT R7).
- **Split headings read letter by letter.** sr-only sentence + `aria-hidden` spans; never `aria-label`
  on a `div`/`span` (CRAFT R2).
- **Squeezed mobile, flattened desktop.** See PARITY.md; G19 catches the second.
- **Happy-path UI.** Looks finished until the data is slow, empty or fails (G16).
- **Finished, not shipped.** Root-layout canonical inherited by every page, no share images, soft 404s
  (G18).
- **Copying a reference wholesale.** Steal grammar — section order, rhythm, motion behaviour — never
  identity, copy, imagery or assets. Studio `*-design` skills say "match exactly"; here they are
  evidence, not a costume.
- **Evidence fabrication.** Citations to files that do not exist, screenshots listed but not on disk:
  the gates check artifacts, not claims.
