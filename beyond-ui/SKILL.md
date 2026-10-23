---
name: beyond-ui
description: Use when building, redesigning, styling or polishing any user interface on any platform - websites, landing pages, SaaS and dashboards, web apps, mobile apps (Expo/React Native, Capacitor, Flutter, SwiftUI, Compose), desktop apps (Tauri, Electron), or a single component - including when the user only describes a product idea and says nothing about the UI. Produces award-level studio work (Awwwards, Dribbble, motionsites.ai level) with micro-interactions and page transitions, by fetching references, templates and fonts from ranked catalogs with Scrapling, copying 85% of the design from an anchor reference, importing components from shadcn/ui and animated registries, following Apple HIG and designer rules, and proving every step with gates G1-G22.
license: MIT
---

# Beyond UI

The user gives an idea. You ship a UI and an experience that look like a top studio made them, on
whatever platform the idea needs, without asking the user how it should look.

## How to run it

```bash
node <skill>/scripts/next.mjs        # prints the current phase card; run it again after every phase
```

Each card gives the commands, the rules binding that phase, the one section to read (if any), how to use
skills, and the done condition. The 16 phases: bootstrap → brief → recon → **source** (Scrapling fetches
references and you look at the images) → select an **anchor** → teardown → digest → **direction** (85/15
map, fonts from a specimen) → compose (import) → **build** (with micro-interactions) → QA → critique →
freeze → harden → ship → gate. Do not skip ahead; the gates check files on disk.

Run the loop without stopping for approval. The idea is the only required input. Ask only for what would
be wrong to invent (real customers and numbers, existing brand assets); a stated user preference always
wins. Deploying, pushing and store submission need the user's word.

## The design core (always binding — these decide quality)

**References, not memory**
1. Design starts from fetched references for this exact surface (a dashboard from dashboards, an app from
   app screens), never from memory. Open every saved reference image before deciding anything.
2. One **anchor** reference supplies ~85%: layout and composition, spacing rhythm, component styling
   (radius, borders, shadows, surfaces), type scale and weight contrast, motion grammar. The product
   supplies ~15%: its content, its domain sections, its theme. Copy, logos, imagery and proprietary fonts
   are never copied.
3. Import before you build: the platform's base kit for every control (shadcn/ui on React web), the
   animated registries for effects (Magic UI, Aceternity, React Bits, Animate UI…), harvested template
   sections for gaps. Hand-written UI that a library ships is a defect.
4. If an existing UI is called bad or fails critique, overhaul from new references; do not patch.

**Visual craft**
5. Type: one text family carries the app (hierarchy by size and weight, tabular numerals for data); a
   display face only on marketing heroes; mono only for code and data; never ALL-CAPS monospace labels,
   never reflex defaults (Inter, Roboto, Poppins, Montserrat, Space Grotesk…). Chosen via `fonts.mjs`.
6. Colour: tinted neutrals (no pure #000/#fff), one accent, one signal colour, OKLCH tokens; contrast
   ≥ 4.5:1 for text, 3:1 for large text and UI. Theme comes from the user or the anchor, never habit.
7. Space and shape: a single spacing scale, generous section rhythm, concentric radii (inner = outer −
   padding), borders or shadows (not both heavy), no card-in-card, no three-identical-cards row.
8. Hierarchy: one primary action per view, content before chrome, the eye path designed (Refactoring UI:
   de-emphasise rather than emphasise; labels quieter than values).

**Motion and micro-interactions (every component, every platform)**
9. Every interactive element answers within one frame: hover, press (scale ≈ .97), focus-visible,
   disabled, loading — 120–320ms, exits ≈70% of enters, ease-out curves, no `transition: all`, no bounce
   on chrome.
10. Overlays (popover, dialog, sheet, toast) enter from their origin and exit faster; tabs and nav move a
    shared indicator; lists animate add/remove/reorder; numbers roll; charts draw in; skeletons hold the
    final layout and content cross-fades in.
11. Every page or screen change has a transition: View Transitions or AnimatePresence on web (the shell
    stays still), native stack + shared elements on mobile, cross-fades on desktop panes.
12. Marketing pages get choreography: GSAP + ScrollTrigger + Lenis, mask/line reveals, one orchestrated
    moment (CRAFT.md). App UIs get purposeful motion only. Native apps use platform springs and haptics
    (selection, success, warning — never on scroll).
13. Reduced motion swaps movement for opacity everywhere; nothing is hidden when motion is off.

**UX and platform (Apple HIG as the tie-breaker)**
14. Hierarchy, harmony, consistency: content first and controls recede; follow each platform's conventions
    (tab bars and stacks on mobile, menus and shortcuts on desktop, sheets with detents, swipe-back).
15. Targets ≥ 44pt (iOS) / 48dp (Android) / 24px (web); safe areas; dynamic type; keyboard-complete web
    with visible focus; forms that never block paste and say what went wrong.
16. Every async surface designs loading, empty (with a next action) and error (with recovery).
17. Every item in the brief's domain content inventory is on screen; no lorem, no invented metrics.
18. Mobile is not a small website: no hover states, no custom cursor, no Lenis, native scroll physics.

## Gates (verify-run.mjs; exit 1 = not done)

G1 state · G2/G2b sources fetched with Scrapling and images viewed · G3/G3b 10 routed skills + digest ·
G4–G6 5 references, teardown, synthesis · G7 citations · G8 critique scores · G9/G14 QA journey ·
G10–G13 plan built and imported · G15 rendered critique · G16 states · G17 craft · G18 production ·
G19 parity · G20 85/15 fidelity · G21 type from specimen · **G22 micro-interaction coverage**.
Native apps without a web preview satisfy G9/G14/G15/G19 with `native-evidence.json` and G18 with
`store-checklist.json`. A failing gate is fixed by doing the work, never by relaxing it.

## Token discipline (read less, apply more)

- The 5 permanent skills (frontend-design, ui-ux-pro-max, taste, impeccable, frontend-ui-engineering) are
  condensed into `.beyond-ui/SKILL.md` at phase 4 — read the digest, do not invoke them in full. Use one
  only for its tool (ui-ux-pro-max search, impeccable detectors).
- At most **4 full skill invocations** per run, chosen by the phase cards (the lane skill; the motion or
  platform skill; accesslint; production-suite-completion). Studio `*-design` skills: first 150 lines only.
- Read references by the section a card names, when it names it. Never read: README.md, the full
  SOURCES-CATALOG.md (use `sources.mjs list <category>`), fetched `.beyond-ui/sources/*.md` pages,
  `fonts/candidates.json`, node_modules.
- Look at images instead of reading pages: references, harvested sections and font specimens are PNGs.

## Where things are (open only when a card points there)

`references/`: PLAYBOOK (skills per phase, lane table, defaults) · BRIEF · FIDELITY · TYPE · MICRO
(per-component motion, transitions, haptics) · CRAFT (scroll choreography recipes) · PLATFORMS · PARITY ·
PRODUCTION · CRITIQUE · COMPONENTS · SHADCN · DESIGN · MOTION · EFFECTS · THREEJS · CONTENT · A11Y-PERF ·
STACKS · SKILLS · TEARDOWN · USAGE · SCOUT · INSPIRATION · PROMPTS · LIBRARIES · EXAMPLES.
`assets/`: sources.json (461 ranked sources, 8 categories) · phases.json (the cards) · skills-catalog ·
block-catalog · motion-catalog · page-archetypes · registry-sources · state-template.
`scripts/`: next · sources · fonts · fidelity · harvest · motion-audit · teardown · plan · import-ledger ·
qa · critique · states · craft-check · parity · production-check · verify-run · skills-router ·
bootstrap-upstream-skills · install-tools · scrapling · capture-site · scaffold-state.
