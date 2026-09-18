# Worked examples

Four walkthroughs showing the full loop. Read the one closest to your task; the shape is identical
every time: bootstrap → scout → contract → compose → build → critique → verify.

---

## Example A — Marketing landing page for a developer tool (Next.js 15, Tailwind v4)

**Brief:** "Landing page for a CLI that turns Postgres queries into shareable charts. Make it look
like it was designed, not generated."

**0 Bootstrap.** `bash scripts/bootstrap-upstream-skills.sh` → Vercel skills + addyosmani +
Anthropic frontend-design installed; `impeccable` and `hallmark` cloned (no `SKILL.md` layout match)
→ stored under `.beyond-ui/upstream/` and read from there. State recorded.

**0 Recon.** `package.json` → Next 15.1, React 19, Tailwind v4, `components.json` absent (no shadcn
yet), `motion` absent, `recharts` present. Copy inventory: README has real mechanics (`pg_dump` →
chart in 3s, self-hosted, no data leaves the VPC). Those facts become the copy.

**1 Scout.** Frame: *domain* = developer data tooling; *aesthetic* = terminal-native, dense, honest,
warm-neutral. Sources opened: Awwwards (developer-tool winners), Land-book (dev-tool category),
Minimal Gallery, motionsites.ai (for the hero motion grammar), 21st.dev (technique level), Refero
(real product screenshots for a similar tool), Prompt sources → templatemo AI prompt generator +
Cruip + Tailwind UI blocks for section inventory. Library map produced: shadcn/ui (button, dialog,
tabs, sonner, tooltip, command), Magic UI `terminal` + `marquee`, NumberFlow for the timing stat,
shadergradient **rejected** (would be the fourth purple-gradient hero in the category), Lenis
accepted for the long scroll, three.js **rejected** (no concept need, bundle cost).

**2 Contract.**
- Type: `Berkeley Mono` (fallback `JetBrains Mono`) for code + display eyebrows, `Instrument Sans`
  for body. Ratio 1.333. (Ban applied: no Inter, no system stack as the choice.)
- Colour: warm-neutral OKLCH ramp, one accent = the tool's terminal-green `oklch(0.72 0.17 155)`,
  signal amber for warnings. Dark-first, light verified.
- Spacing: 4px base; sections alternate `py-28` / `py-16`; content 68rem, prose 62ch.
- Motion: `motion/react`, ease `[0.16,1,0.3,1]`, entrance grammar = "type-on + 16px rise, 60ms
  stagger", Lenis, reduced-motion → fades only.
- Non-goals: no 3D, no glass, no testimonial wall, no emoji.

**3 Compose.** `npx shadcn@latest add button card dialog tabs sonner tooltip command separator` →
theme tokens rewritten in `globals.css` (`@theme`) → `npx shadcn@latest add @magicui/terminal
@magicui/marquee` → `npm i @number-flow/react lenis motion` → Lenis provider + `MotionConfig
reducedMotion="user"` in a `Providers` client component.

**4 Build.** Hero = asymmetric type-led with a real terminal panel showing a real query and a real
chart output (screenshotted from the actual product, not faked). Sections: mechanism (3 steps with
artefacts), a real benchmark table, install command with copy button, self-hosting/security section
(the actual differentiator), FAQ from real support questions, docs + changelog links in the footer.
States: CLI install widget has loading/copied/error; the demo chart has skeleton + empty.

**5 Critique.** Score 3.4 → hard fail #1 (three-equal-cards pattern in the "features" row) and #5
(emoji in the benchmark labels) → replaced the card row with a comparison table, removed emoji, added
the honest "what it doesn't do" list → re-render → 4.3 mean. Lowest gate: distinctiveness 4 (the
terminal type-on hero + green-on-warm-paper is ownable).

**6 Verify.** Screenshots 390/768/1440 (dark + light). Reduced-motion forced: type-on becomes an
instant fade, Lenis disabled, nothing missing. Keyboard: command palette, dialog, copy button all
reachable. Lighthouse mobile on the production build: 97 / 100 / 100 / 100; LCP 1.6s (the hero text is
CSS-animated, the chart image is `priority`). Bundle delta: +34KB gz (motion + number-flow), terminal
component 2KB.

**Report:** direction, 14 files, libraries used, hard fails fixed 2, mean gate 4.3, deferred: real
customer logos (none exist — honest "used by" section omitted rather than faked).

---

## Example B — Dashboard redesign inside an existing design system (Vite + React, Tailwind v3)

**Recon finding that changes everything:** `components.json` exists, tokens are customised, Tailwind
is **v3**. Every v4 snippet and every registry component written for v4 must be adapted. `framer-motion`
v11 is installed → registries requiring `motion` must **not** add a second motion library.

**Scout.** Domain = billing analytics; audience = finance operators, dense screens; aesthetic =
"Swiss financial newspaper". Sources: Mobbin (finance app flows), Refero (real dashboard screenshots),
Tremor + shadcn charts for data-viz patterns, Uiverse for one bespoke toggle, 21st.dev for a technique
reference. Library map: shadcn `table/card/select/popover/skeleton`, Tremor-style chart tokens,
`@formkit/auto-animate` for row reorder (1 line, works with v3), Recharts already present.

**Contract.** Restrained: one accent (existing brand blue), tabular numerals for all figures, 4px
radius, no motion libraries beyond auto-animate, entrance = none (dashboards should not fade in —
it delays data). Non-goals: no scroll animations, no 3D, no glass.

**Build & critique.** Hierarchy gate initially 3 ("everything is a card with a border") → removed 60%
of card borders, introduced section headers and a left-aligned title block, grouped KPIs by decision
rather than by data type → 4.5. States: 4 empty states, skeleton geometry matched the real table,
error state for a failed query, permission-denied for viewers.

**Verify.** Contrast on the muted-text-on-tinted-card pair was 4.1:1 → darkened token to 4.6:1.
Dark mode separately verified. No new long tasks; INP unchanged (nothing animated on the interaction
path). Keyboard: table row actions, filters, date picker all operable.

**Lesson recorded in scout.md → Rejected:** "Aceternity/Magic UI components rejected wholesale —
a Tailwind v4 + `motion` dependency chain would have broken the v3 system and added 2 libraries to a
tool whose aesthetic is restraint."

---

## Example C — Single bespoke component (animated pricing toggle, any React stack)

**Scope:** one component, so the scout is smaller but not absent: 3 references minimum.

**Scout (3 refs).** Refero (how real SaaS pricing toggles read), Aceternity `tabs`/`animated-tabs`
for the technique, animate-ui for the layout-animation approach. Registry check: `motion` present and
v12 → Aceternity registry compatible.

**Contract.** Local motion contract (durations 180/260ms, spring for the thumb), one accent, the
existing token set, keyboard semantics from Radix `Tabs`, labels must exist for screen readers.

**Compose.** `npx shadcn@latest add @aceternity/tabs` → adapted: motion thumb via `layoutId`, the
`Tabs` primitive keeps `aria-selected`/arrow-key behaviour, prices animate with NumberFlow rather than
hand-rolled digit transitions.

**Build/critique.** Hard fails caught: (a) the toggle initially animated the container height causing
layout shift on the card below → replaced with a fixed-height card and cross-faded price rows;
(b) `prefers-reduced-motion` left the thumb mid-flight → guarded with `useReducedMotion`.

**Verify.** Screenshot of all three states + focus ring; keyboard arrow keys switch plans, focus
visible; reduced-motion render is instant; contrast of the selected pill ≥ 4.5:1 in both themes.

---

## What these walkthroughs show

1. The scout is short for small work but never zero.
2. The design contract prevents mid-build aesthetic drift.
3. The registry install fact (Tailwind version, motion peer) is checked **before** installing.
4. Every "no library" decision is written down with a reason.
5. Verification is a render + an interaction + a reduced-motion pass, not a code read.

---

## Example D — 3D product page (Next.js, R3F, configurable product)

**Brief:** "3D shoe configurator page — rotate it, pick a colourway, make it feel premium and fast."

**0a/0b Bootstrap + Recon.** Next 15, React 19, Tailwind v4, shadcn present, `motion` present,
no 3D deps. `references/THREEJS.md` §1 → **3D justified** (the product *is* physical and configurable,
and 3D is the differentiator). R3F 9 + drei chosen; drei already the ecosystem standard on this stack.

**1 Scout.** References: 21st.dev three-js collection (a particle/depth background pattern), a
threejsresources showcase entry for a scroll-linked product page (technique: camera dolly on scroll,
not scroll-jacking), a Poly Haven studio HDRI for lighting, and two non-3D galleries (Land-book,
SaaSpo) for the surrounding page structure — the canvas sits *inside* a shadcn layout, not instead of
one. Rejected: Spline (runtime weight, no need for an editor-authored scene), Babylon (no game logic),
a WebGL hero background (would compete with the product scene).

**2 Contract.** Direction: "product photography studio on deep charcoal" — the scene mirrors a real
studio (HDRI + contact shadow), one accent colour drives the selected colourway chip, motion = the
camera dolly (≤ 220ms ease) + a 900ms material cross-fade. Type/colour from the existing tokens; the
3D introduces no new palette.

**3 Compose.** `npx shadcn@latest add button toggle-group tooltip skeleton` for the configurator chrome;
`npm i three @react-three/fiber @react-three/drei`; `npx gltfjsx shoe.glb --transform --types`
→ 18.4MB source becomes 1.6MB (Draco + KTX2 + pruned nodes). Poster: a rendered still exported from
the scene, served as an AVIF at the card's aspect ratio.

**4 Build.** Canvas is `dynamic(..., { ssr: false })`, `dpr={[1, 2]}`, `frameloop="demand"` (re-render
only on interaction), `IntersectionObserver` pauses it off-screen, `aria-hidden` on the decorative
canvas, colourways as an accessible `ToggleGroup` (real DOM), a keyboard-operable rotate control, and
the material swap mutates the existing scene instead of reloading it.

**5 Critique.** Hard fails caught: a gradient text headline crept in on the hero (removed), and the
"3D" section initially had no poster so the canvas was the LCP element (fixed — poster is LCP, canvas
cross-fades in). Gate: Distinctiveness 5 (the studio-lit scene with a real HDRI is the ownable moment).

**6 Verify.** With WebGL blocked → poster + full page still usable. Reduced motion → auto-rotation
stopped, dolly disabled, material fade instant. Off-screen → frameloop stops (DevTools performance
confirms no rAF). Payload: 1.6MB model + 0.9MB HDRI + 34KB poster; +412KB gz JS. FPS ≥ 55 on the
throttled mid-range profile. Keyboard: colourways, rotate control and the CTA all reachable. Licences:
Poly Haven CC0 HDRI, product model owned by the client — both recorded in `scout.md`.
