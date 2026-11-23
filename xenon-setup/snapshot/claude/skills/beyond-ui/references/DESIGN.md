# Design craft

The rules that separate a designed page from an assembled one. Framework-agnostic; applies equally
to a marketing site, a dashboard, and a mobile screen.

## Type

**Scale.** Pick a ratio and obey it. A 1.25 (major third) scale for dense/product UI, 1.333 for
editorial, 1.5+ for a display-led landing page. Five to seven steps total; more means the page has
no hierarchy.

```
display  clamp(2.75rem, 5vw, 4.5rem) / 0.98 / -0.03em
h1       clamp(2rem, 3.5vw, 3rem)    / 1.05 / -0.02em
h2       1.5rem / 1.2  / -0.01em
body     1rem   / 1.6  / 0
small    0.875rem / 1.5
mono/code 0.8125rem / 1.5
```

**Line length** 45–75 characters for body (measure, not width). **Line height** inverse to size:
tight on display (0.95–1.1), generous on body (1.5–1.7). **Letter-spacing** negative on large type,
slightly positive on small caps/labels. **Optical alignment** — quotes, bullets and big numerals get
hung or shifted; `text-wrap: balance` on headings, `pretty` on short paragraphs.

**Pairing that works:** a distinctive display face + a neutral workhorse + a mono for data/code.
Sources: Fontshare (free, less-used), Google Fonts (variable), Velvetyne (experimental/display),
plus the project's existing faces. Load with `next/font` or `@fontsource`, `font-display: swap`,
subset, preload the one face used above the fold. **Never** ship three weights of three families, and
never leave a layout that shifts when the webfont lands (`size-adjust`/fallback metrics).

**Bans (unless the project already uses them):** Inter as the reflexive choice, Poppins/Montserrat
because they look "modern", emoji as icons, more than two families, all-caps for body text.

## Colour

- **Work in OKLCH.** Perceptually even ramps; predictable lightness for contrast maths.
- **Structure:** neutral ramp (7–10 steps) → one accent (the brand) → one signal colour
  (success/warning/danger share a family, not three random hues) → surfaces.
- **60/30/10.** Neutrals dominate; accent is for action and emphasis only. An accent used on
  decoration cannot also mean "click me".
- **Elevation** = background + border + shadow *together*, not a bigger shadow. Dark themes use
  lighter surfaces, not stronger shadows.
- **Contrast:** body text ≥ 4.5:1, large text ≥ 3:1, UI borders/focus rings ≥ 3:1 — verified against
  the *actual* background, including gradients, glass and images (use a scrim).
- **Gradients** are a deliberate choice with a direction and a reason. Purple→blue on dark is the
  signature AI default; if you keep it, it must be the brand's, not the model's.
- **Dark mode is designed, not inverted**: desaturate accents, reduce pure-white text to ~92%,
  keep shadows subtle, re-verify contrast.

## Space, grid, rhythm

- **Spacing scale** 4px base, tokens only (`space-1…`), no 13px/27px one-offs.
- **Section rhythm:** vary it. Uniform `py-24` between every section is why generated pages feel
  flat. Alternate dense and airy sections; let one section be full-bleed, one contained.
- **Container widths:** one content width (e.g. 72rem) + one prose width (65ch) + one wide (90rem).
- **Optical whitespace:** more space *above* a heading than below (it belongs to what follows).
- **Grid:** commit to 12 columns (or a deliberate asymmetric one) and place elements on it. Cards
  that are 1px off each other look broken; a deliberate overlap looks designed.
- **Alignment:** pick left-aligned or centered for a section and hold it. Mixed alignment inside one
  block is the most common "AI look".

## Hierarchy

Every viewport answers, in order: what is this? what do I do? why should I care? Achieve it with
**size, weight, colour, position, and whitespace** — not with five boxes and five borders. Rules of
thumb: one dominant element per viewport; borders should be earned (they are a crutch for weak
grouping); if everything is a card, nothing is.

## Components and detail

- Reuse the project's primitives (`references/SHADCN.md`). Consistency beats novelty per component.
- **States are the design:** hover, active, focus-visible, disabled, loading, empty, error,
  success, partial, offline, permission-denied, long-content, RTL, 200% zoom, 390px width.
- **Density** fits the product: a fintech dashboard is dense; a brand landing page is airy. Do not
  apply landing-page airiness to a data table.
- **Details that signal craft:** consistent icon stroke width and size, aligned baselines in card
  footers, real avatar fallbacks, truncated-with-tooltip long strings, skeletons that match final
  geometry, sensible focus order, keyboard shortcuts surfaced in UI, and empty states with a next
  action.
- **Microcopy** is design: verbs on buttons (`Create project`, not `Submit`), errors that say what
  to do, empty states that teach.

## Layout patterns worth stealing (structure, not pixels)

Editorial hero (asymmetric type + one image, generous margins) · split hero with a real product
surface · bento grid with one dominant tile · sticky scroll narrative with pinned media · marquee /
logo wall with real logos · comparison table instead of three identical cards · testimonial with
attribution and context · feature detail with annotated UI · process timeline · pricing with a
recommended tier and honest differences · FAQ as an accordion · footer with real navigation and
status links. Pick the ones the *content* implies; a page of three-card rows is a content failure
more often than a design one.

## Anti-generic checklist (visual)

- [ ] No default system font stack as the deliberate choice
- [ ] No purple/blue gradient on dark unless it is the brand
- [ ] No emoji icons; icons from one set at one weight
- [ ] No `bg-white/10 backdrop-blur` glass used as a personality
- [ ] No 3-equal-cards row with centered icon + title + lorem
- [ ] Section spacing varies; not every section is `py-24 text-center max-w-2xl`
- [ ] Real copy, real numbers, real names, real screenshots
- [ ] One accent colour doing one job
- [ ] One entrance grammar, one easing family, one duration set
- [ ] Nothing looks like a template you could name
