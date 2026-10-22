---
name: beyond-ui
description: Use when building, redesigning, styling or polishing any user interface on any platform - websites, landing pages, SaaS and dashboards, web apps, mobile apps (Expo/React Native, Capacitor, Flutter, SwiftUI, Compose), desktop apps (Tauri, Electron), or a single component - including when the user only describes a product idea and says nothing about the UI. Produces award-level studio work (Awwwards, Dribbble, motionsites.ai level) instead of AI-generated slop by automatically fetching references, templates and fonts from ranked catalogs with Scrapling, copying 85% of the design from a chosen anchor reference, importing components from shadcn/ui and animated registries, and proving every step with gates G1-G21.
license: MIT
---

# Beyond UI

The user gives an idea. The agent ships a UI that looks like a design studio made it, on whichever
platform the idea needs, without asking the user how it should look. That never comes from inventing a
design from memory. It comes from six moves, in order:

1. **BRIEF** the idea into screens, sections and the domain content an expert expects.
2. **SOURCE** automatically: ranked catalogs (8 categories × 50+ sites) fetched with Scrapling,
   reference images saved and looked at.
3. **ANCHOR** the design: one reference supplies 85% (layout, spacing, components, type, motion); the
   product supplies 15% (content, domain sections, theme).
4. **IMPORT** what exists: the platform's base kit for controls, animated registries for effects,
   harvested template sections for what the anchor lacks. Custom code is the last resort.
5. **CRAFT** what registries get wrong: choreography, reveals, glass, shaders, transitions.
6. **PROVE** it: exercised like a human, measured, frozen, shipped, gated (G1–G21).

## Failure modes this skill exists to kill

1. **AI slop** — centred hero, three cards, Inter everywhere, purple gradient, emoji icons, decorative
   display fonts on app page titles, ALL-CAPS MONO LABELS as decoration.
2. **Waiting to be told** — asking the user which sites to look at, what the UI should be, to "use
   Scrapling", to "use the skills". The skill does all of that by itself.
3. **Inventing instead of referencing** — a design composed from memory instead of from a real anchor.
4. **Reinventing the wheel** — hand-writing a dialog, marquee or text effect a registry ships.
5. **Incomplete domain** — an ML dashboard without accuracy, curves, parameters or hyperparameters.
6. **The fix that flattens, the phone that gets squeezed, the site that is finished but not shipped.**

## Contracts (numbers are enforced)

| Contract | Value | Enforced by |
|---|---|---|
| Auto-sourcing | catalog fetched via Scrapling, 8+ reference images saved **and viewed** | `sources.mjs` · G2b |
| Reference fidelity | ≥85% of sections from the anchor/references, anchor carries ≥50% | `fidelity.mjs` · G20 |
| Type | chosen from 10 free libraries via a rendered specimen; overused defaults excluded | `fonts.mjs` · G21 |
| Routed skills | exactly 10 (5 permanent + 5 by profile) + phase specialists when present | `skills-router.mjs` · G3, G7 |
| References | exactly 5 (one anchor) | G4 |
| Components | base kit first, registries second, custom last (with a reason) | `import-ledger.mjs` · G13 |
| QA · critique · states | journey passes · 0 critical hard fails · loading+empty+error | G14 · G15 · G16 |
| Craft · production · parity | 0 critical CRAFT defects · ship surface verified · design unchanged by later passes | G17 · G18 · G19 |

## Autonomy

Run the whole loop without stopping for approval. The only input needed is the idea. Decide everything
unspecified with `references/PLAYBOOK.md` §7 and record it. Ask the user only for what would be wrong to
invent: real customers and numbers, brand assets that exist somewhere, a constraint that contradicts
the brief. A user preference (theme, font, layout, platform) always wins over the defaults and the
anchor. Deploying, publishing, pushing and store submission still need the user's word.

## The operating loop

Scripts live in `scripts/` and run from the target project: `node <skill>/scripts/<name>.mjs`.

| # | Phase | Load | Invoke (PLAYBOOK §2) | Run / produce | Gate |
|---|---|---|---|---|---|
| 0a | BOOTSTRAP | `PLAYBOOK.md`, `PLATFORMS.md` | — | empty repo: scaffold the platform's stack first; `scaffold-state.mjs`; `bootstrap-upstream-skills.mjs` (skills + Playwright, Scrapling + browsers, browser-use, skillui) | G1, G3 |
| 0b | BRIEF | `BRIEF.md` | — | `sources.mjs brief "<idea>"` → complete `.beyond-ui/brief.md` (screens, domain inventory) | — |
| 0c | RECON | `PLATFORMS.md`, `STACKS.md` | redesign/audit skills if a UI exists | `sources.mjs detect`, `skills-router.mjs status` | G3 |
| 1 | SOURCE | `SOURCES-CATALOG.md`, `SCOUT.md` | `design-inspiration-index`, `browser-use` when needed | `sources.mjs pick` → `fetch`; **open every image** in `.beyond-ui/refs/`; `sources.mjs viewed <images>`; write `scout.md` | G2, G2b |
| 2 | SELECT | `FIDELITY.md`, `TEARDOWN.md` | matching `<studio>-design` skill | anchor + 4 in `references-selection.json` (`"anchor": true`) | G4 |
| 3 | TEARDOWN | `TEARDOWN.md` | — | `teardown.mjs run` → `DESIGN-SKILL.md`, `PLAN.json` | G5, G6, G10, G11 |
| 4 | DIGEST | — | — | `skills-router.mjs digest` → `.beyond-ui/SKILL.md` | G3b |
| 5 | DIRECTION | `FIDELITY.md`, `TYPE.md`, `DESIGN.md`, `MOTION.md`, `CONTENT.md` | `frontend-design`, `ui-ux-pro-max`, `taste`, one lane skill, typography, refactoring-ui | `fidelity.mjs init` + map; `fonts.mjs search` → `specimen` → look → `choose`; direction contract | G7, G20, G21 |
| 6 | COMPOSE | `COMPONENTS.md`, `SHADCN.md`, `PLATFORMS.md` | base kit + 2–3 registries | `import-ledger.mjs plan`; `harvest.mjs page|prompt --pick …` for missing sections | G13 |
| 7 | BUILD | `CRAFT.md`, `PARITY.md`, `EFFECTS.md`, `THREEJS.md` (3D) | `frontend-ui-engineering`, `impeccable`, motion-engine skill, platform skill | tokens, real copy, the full domain inventory, real states, recipes | G12, G13 |
| 8 | QA | `PLATFORMS.md` (native) | `playwright-skill`, `browser-use` | `qa.mjs journey <url>` at phone + desktop sizes; native: `native-evidence.json` | G9, G14 |
| 9 | CRITIQUE | `CRITIQUE.md` | `hallmark`, `impeccable` critique, accesslint | `critique.mjs <url>`; fix; re-render. Any gate < 3 on an existing UI → full overhaul | G8, G15 |
| 10 | FREEZE | `PARITY.md` | — | `parity.mjs baseline <url> --routes …` | G19 |
| 11 | HARDEN | `A11Y-PERF.md`, `PARITY.md` | accesslint fix / diff | `states.mjs`, `craft-check.mjs`, `fidelity.mjs check`, `parity.mjs check` | G16, G17, G19, G20 |
| 12 | SHIP | `PRODUCTION.md` | `production-suite-completion` | `production-check.mjs <url>` (web) or `store-checklist.json` (store apps); `parity.mjs check` | G18, G19 |
| 13 | GATE | `USAGE.md` | — | `import-ledger.mjs audit && skills-router.mjs verify && verify-run.mjs` | G1–G21 |

Phases 0b–5 are about a third of the work and decide the quality. A single-component brief runs the same
loop at component scale (`surface: "component"`: G18 and G20 n/a).

## Non-negotiables

1. **Never ask the user to describe the UI.** The idea is enough: BRIEF.md turns it into screens,
   sections and the domain inventory.
2. **Sourcing is automatic and uses Scrapling.** `sources.mjs fetch` runs before any design decision; the
   saved images are opened and recorded as viewed. A design chosen before that is a defect.
3. **85% from the anchor, 15% the product's own.** Layout, spacing, component styling, type system and
   motion come from the anchor and supporting references; content, domain sections and theme are the
   product's. Copy, logos, imagery and proprietary fonts are never copied.
4. **Type like a designer.** `fonts.mjs` across 10 free libraries, a rendered specimen, a recorded
   reason. No reflex defaults; no decorative display faces on app page titles; mono only for code and
   data; no all-caps monospace decoration.
5. **Route and follow the skills, and show it.** Bootstrap, read `.beyond-ui/SKILL.md`, invoke phase
   specialists when present, cite every routed skill and specialist (`skill://<id> -> <rule>`).
6. **Import, don't reinvent.** The platform's base kit supplies every control; registries supply every
   animated piece; harvested template sections fill gaps. Custom code carries `beyond-ui:custom <reason>`.
7. **Choreograph, don't decorate.** Marketing pages get GSAP + ScrollTrigger + Lenis + registry effects
   + CRAFT recipes; app UIs get purposeful micro-interactions; native apps get platform springs.
   Everything respects reduced motion.
8. **Complete the domain.** Every item in `brief.md -> Domain content inventory` is on screen.
9. **Every viewport and platform is designed.** PARITY.md for the web, PLATFORMS.md for native and
   desktop. Performance and accessibility fixes remove cost, not design.
10. **Overhaul, don't patch.** When an existing UI is called bad or fails critique, rerun from phase 1
    with fresh references and a new anchor; keep data and routes, replace the presentation.
11. **No theme by habit.** Light, dark or both comes from the user's request or project, else the anchor.
12. **Real content, real states, preserved identity, shipped.** No lorem, no invented metrics; loading,
    empty and error designed; an existing brand wins; metadata, share images, sitemap, headers, 404 and
    smoke tests (or the store checklist).
13. **No unverified claims.** A failing gate is fixed by doing the work, never by relaxing it,
    re-baselining without a reason, or editing `state.json` by hand.

## What to load, by need

| Need | File |
|---|---|
| Decision procedure: skills per phase, lane skill, sources, fetch chain, defaults | `references/PLAYBOOK.md` |
| Idea → brief, domain content inventory | `references/BRIEF.md` |
| The ranked catalogs (461 sources, 8 categories) | `assets/sources.json`, `references/SOURCES-CATALOG.md` |
| Anchor + 85/15 contract, overhaul rule | `references/FIDELITY.md` |
| Font selection procedure | `references/TYPE.md` |
| Web, mobile, desktop stacks and native gates | `references/PLATFORMS.md` |
| Scroll timelines, mask reveals, glass, jelly pill, shaders, page curtain, cursor, Lenis | `references/CRAFT.md` |
| Mobile/desktop parity, freeze-and-compare, perf/a11y without flattening | `references/PARITY.md` |
| Production/SEO pass, store-app checklist, smoke tests | `references/PRODUCTION.md` |
| Upstream skill catalogue, inheritance, conflict rulings | `references/SKILLS.md` |
| Scout artefact, galleries and prompt sources in depth | `references/SCOUT.md`, `INSPIRATION.md`, `PROMPTS.md` |
| Select 5, teardown, synthesis, plan | `references/TEARDOWN.md` |
| Registries and install commands; shadcn setup | `references/COMPONENTS.md`, `SHADCN.md` |
| Type, colour, spacing, hierarchy; motion; effects; 3D | `references/DESIGN.md`, `MOTION.md`, `EFFECTS.md`, `THREEJS.md` |
| Copy and metadata · a11y/perf · stack recipes | `references/CONTENT.md` · `A11Y-PERF.md` · `STACKS.md` |
| Hard fails and quality gates · citation contract · walkthroughs · library index | `CRITIQUE.md` · `USAGE.md` · `EXAMPLES.md` · `LIBRARIES.md` |

## Traps

- **Waiting for site names.** The catalogs exist so the agent never needs them from the user.
- **Fetched but not looked at.** Saving 40 images and designing from memory anyway. Open them; G2b
  counts what was viewed.
- **The flashy anchor.** Pick the reference closest to this product's surface and audience with the
  most complete system, not the most impressive shot.
- **Copying identity.** 85% of the *design system*, 0% of the copy, logos and imagery.
- **Reflex fonts and theme.** Inter + dark mode + purple accent is the default the skill exists to
  avoid; let the anchor, the specimen and the user decide.
- **Monospace as decoration.** Uppercase mono labels and terminal-style headings on a non-terminal
  product read as AI.
- **Thin domain.** A beautiful dashboard missing the numbers its users came for.
- **Patching ugliness.** Tweaking spacing on a UI that failed critique instead of overhauling it.
- **Web habits on mobile.** Hover states, Lenis, custom cursors, web easing curves in a native app.
- **Registry roulette, motion everywhere, glass as a personality, WebGL on phones, a blurry cursor,
  split headings read letter by letter** — see CRAFT.md.
- **Finished, not shipped; squeezed mobile; flattened desktop** — PRODUCTION.md and PARITY.md.
- **Evidence fabrication.** The gates check files on disk, not claims.
