# Parity — every viewport designed, and no later pass flattens the design

Load this in phase 7 (BUILD) before the first breakpoint and again before any pass that comes after
design sign-off (responsive, performance, accessibility, production). Gate: G19 (`scripts/parity.mjs`).

Two failure modes this file exists to kill:

1. **Mobile as an afterthought.** The desktop is designed; the phone gets the same layout squeezed,
   hover-only reveals nobody can reach, a WebGL canvas that flickers, a cursor on a touch screen.
2. **The fix that flattens.** A responsive or performance pass "simplifies" the desktop: an animation
   removed to save a frame, a font swapped, a section re-spaced. The design that was signed off is gone
   and nobody noticed, because nobody compared.

## The freeze-and-compare rule

The moment a viewport's design is approved (by the user, or by passing CRITIQUE in phase 9), freeze it:

```bash
node scripts/parity.mjs baseline http://localhost:3100 --routes / /pricing   # 1440 + 390 by default
```

Every later pass ends with:

```bash
node scripts/parity.mjs check http://localhost:3100
```

Run the baseline and every check against a **production build** (`next build && next start -p 3100`,
`vite build && vite preview`): dev servers add overlays, HMR and timing noise.

`check` re-captures the same routes at the same viewports and scroll stops, compares pixels, and fails
when any shot differs by more than 1.5% (canvas/video hidden, CSS animations frozen, each shot taken
only once two consecutive frames match). Elements that never settle (marquees, tickers, clocks) are
masked with `--mask ".marquee" "[data-clock]"` at baseline time. On Git Bash for Windows, prefix with
`MSYS_NO_PATHCONV=1` or pass routes without a leading slash; the script normalises both.

An **intended** change is re-baselined with a reason that lands in the report:

```bash
node scripts/parity.mjs baseline http://localhost:3100 --reason "user asked for a larger hero on desktop"
```

Re-baselining to make a failing check pass, without a reason the user or the brief supports, is the
same defect as editing `state.json` by hand.

## Scoping rules (how to change one viewport without touching the other)

- **Mobile work on a signed-off desktop goes behind max-width queries only**: Tailwind `max-md:`,
  `max-lg:`, `max-[1023px]:`; CSS `@media (max-width: 767px)`; JS `matchMedia("(max-width: 767px)")`.
  Base classes are the desktop. Touching a base class during a mobile pass is a desktop change.
- **Gate by capability, not width, when the question is capability**: hover effects on
  `(hover: hover)`, custom cursor on `(pointer: fine)`, heavy GPU work on width **and**
  `hardwareConcurrency`, motion on `prefers-reduced-motion`.
- Breakpoints the skill tests: 320, 375, 390, 768, 1024, 1440, 1920. Design at 390, 768 and 1440; the
  others must not break.

## What changes on small screens (and how)

| Desktop pattern | Phone treatment |
|---|---|
| Pinned horizontal scroll / side-by-side pinned panels | Stacked vertical sequence; same content order; keep the sticky beat only if it reads at 390px |
| Hover reveals (cards, pillars, nav pill) | Scroll-driven activation through the hold window, or tap; never hover-only |
| WebGL / shader backgrounds | Static CSS gradient of the same colours, drift animation off (CRAFT R5) |
| SVG-refraction liquid glass | Frosted blur fallback (CRAFT R3) |
| Custom cursor, magnetic buttons | Off (`pointer: fine` only) |
| 400–500vh scroll sections | Shorter timelines (fewer vh per beat), so a phone user is not scrolling for 10 seconds per idea |
| Large display type | `clamp()` with a phone floor that still fits the longest word at 320px without hyphenation |
| Mega-menu / dropdown | Full-height sheet with focus trap, Esc, body scroll lock, 44px rows |
| Multi-column footers, tables | Stack, or horizontal scroll inside the component (never the page) |

Viewport units: `h-screen` only on a `sticky` stage inside a tall section; full-height heroes use
`min-h-[100svh]` (stable under the mobile URL bar) or `100dvh` where the layout must track it.

## Mechanical checks

- `scripts/parity.mjs check` — pixel parity of the frozen viewports (G19).
- `scripts/critique.mjs` — horizontal scroll at 320px, tap targets < 24px, hover-only content (G15).
- `scripts/qa.mjs journey` at 390 — the journey must complete on a phone viewport (G14).
- `scripts/craft-check.mjs` — WebGL without a mobile gate, cursor without `pointer: fine` (G17).

## Performance and accessibility without flattening

The rule: **remove cost, not design.** In order of preference:

1. Do the same effect cheaper (lower render scale, shared rAF, pause off-screen, `transform`/`opacity`
   only, `content-visibility: auto` on below-fold sections, AVIF/WebP with explicit sizes).
2. Defer it (mount on `useInView`, `next/dynamic` with a designed placeholder, idle callback).
3. Swap it on constrained devices only (phone gets the static gradient; desktop keeps the shader).
4. Only then, and only with the user's agreement, remove it.

Contrast fixes change the token, not the look: darken the ink or raise the tint alpha behind text
on glass, keep the hue. A11y fixes that need markup (sr-only text for split headings, one `h1`,
`aria-hidden` on decorative layers, real list structure) are visually identical, so `parity check`
must still pass after them. If a Lighthouse number can only be reached by changing the look, record it
as an accepted risk in the production report instead of quietly flattening the page.
