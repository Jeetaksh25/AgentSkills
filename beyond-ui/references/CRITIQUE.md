# Critique — scoring the rendered page

Run this **against the built page in a browser**, not against the source. Source review cannot see
specificity fights, contrast failures over gradients, focus order, or the actual rhythm of the page.
Screenshot the full page at 390 / 768 / 1440 first; score from the images and the live DOM.

## Part 1 — Hard fails (any one fails the critique)

Inherited from hallmark's slop test, impeccable's detector rules and the Vercel web-interface
guidelines. Each one is mechanically checkable on the rendered page.

1. **Template smell.** A designer would say "I've seen this exact page" — centered hero, three
   features, logo strip, FAQ, footer, no product specifics.
2. **Gradient text headlines.** `background-clip: text` on a headline, purple→blue gradients, or a
   gradient used as the whole visual concept.
3. **Three equal columns** of icon-above-heading-above-lorem, or **card-in-card** nesting.
4. **Full-viewport centred hero** where everything is centred with nothing to look at.
5. **Placeholder content.** Lorem, "Coming soon", invented metrics, unnamed logos, stock copy that
   could belong to any company.
6. **Default type.** System stack or Inter as the *display* face, one weight everywhere, no scale.
   Four or more families is also a fail. Headers in italics.
7. **Untinted neutrals and pure black/white.** Grey text on a coloured background; `#000`/`#fff` as
   the actual values.
8. **Emoji icons**, mismatched icon sets/weights, or hand-rolled SVG glyphs.
9. **Raw HTML controls** where the design system has a component (buttons, inputs, selects, modals).
10. **`transition: all`**, bounce/elastic easing, or decorative-only motion.
11. **No motion at all** on a page whose brief is "beautiful" — or blanket identical scroll reveals on
    every section.
12. **Re-drawn chrome**: fake browser bars, phone frames, terminal window chrome, div-based fake
    screenshots. (`code` blocks with real chrome from the syntax highlighter are fine.)
13. **Broken states.** Missing loading/empty/error; a loading state that jumps layout; an empty state
    with no action; any component brief missing its 8 states (default, hover, focus-visible, active,
    disabled, loading, error, success).
14. **Mobile is a shrink.** Text under 14px, tap targets under 44px, horizontal scroll, two-line
    button labels, or a desktop layout squeezed into 390px.
15. **Accessibility floor missed.** Unlabeled controls, `outline: none` with no replacement, contrast
    < 4.5:1 for body, `<div onClick>`, `user-scalable=no`, motion ignoring `prefers-reduced-motion`.
16. **Focus or contrast failure in the second theme** if the app has both.
17. **Invented proof.** A metric, testimonial, customer logo or award that the user never supplied.
18. **Unlocked tokens.** Inline hex/OKLCH/px colours mid-render instead of named tokens.
19. **CTA intent duplication.** Two labels for the same intent, or a button label that wraps.
20. **Performance regression.** Hero animation pushes LCP past budget, visible late font swap, jank on
    scroll, or a 3D scene on the critical path.

## Part 1b — Repetition bans (structure, not just visuals)

Inherited from hallmark's structural-variety rules. Across a multi-page build, and within a single page:

- Only **one** instance of each layout family per page (no two zigzag image/text splits in a row,
  no two bento grids, no two centred CTA bands).
- Nav and footer archetypes must not repeat between pages of the same site.
- **Maximum one eyebrow label per three sections** (count them).
- One CTA intent per label across the page; buttons 1–3 words and never wrapping.
- No `h-screen` — use `min-h-[100dvh]`; no flex percentage math — CSS Grid.
- Bento cell count equals content count (do not pad a grid to make it look full).

## Part 2 — Quality gates (score 1–5, and justify in one line each)

| # | Gate | What a 5 looks like |
|---|---|---|
| 1 | **Hierarchy** | Each viewport has an obvious first, second, third read; the eye is led, not shouted at |
| 2 | **Type** | A deliberate scale and pairing; measured line lengths; tightened display type; zero orphan lines |
| 3 | **Colour** | Tokenised, restrained, one accent doing one job; both themes verified on real backgrounds |
| 4 | **Rhythm & space** | Varied section rhythm, consistent vertical scale, generous but intentional whitespace |
| 5 | **Layout** | Grid-committed, intentional breakpoints, asymmetric interest where content justifies it |
| 6 | **Motion** | Purposeful, one grammar, fast feedback, reduced-motion honoured, nothing decorative-only |
| 7 | **Craft detail** | Aligned baselines, consistent radii/strokes, real avatars/images, truncated long strings, tasteful focus rings |
| 8 | **Content** | Specific, product-true copy; numbers and names are real; microcopy tells the user what happens next |
| 9 | **States** | Every state designed, load/empty/error/disabled/long-data, and they are consistent with the loaded view |
| 10 | **Distinctiveness** | Could be attributed to a real studio; has at least one memorable, ownable moment |
| 11 | **Restraint** | Nothing extra: no unused sections, no decorative blobs, no "just in case" UI |
| 12 | **System coherence** | One system across pages/components; a new page could be built and look native |

Threshold: no gate below 3, mean ≥ 4.0 for "designed", mean ≥ 4.5 for "portfolio-grade".

## Part 3 — Evidence

For every hard fail and every gate ≤ 3, record: viewport (390/768/1440), selector or file:line,
screenshot path, and the fix applied. An unaudited claim ("looks good now") is not evidence — the
re-render after the fix is.

## Part 4 — Adversarial re-read

After fixing, re-read the page as if you were these users, in order:

1. **First-time visitor on a phone, on 4G** — what do they see in the first second? Is the value legible?
2. **Skeptic** — what claim would they distrust? Is there proof, or just adjectives?
3. **Someone who wants to act now** — is the primary action obvious without scrolling back?
4. **Keyboard-only user** — can they complete the flow without a mouse, and do they always know where focus is?
5. **Screen-reader user** — does the landmark/heading structure describe the page?
6. **Maintainer** — can they add a page and inherit the system, or must they copy a file?
7. **Designer with taste** — name the three weakest things on the page and fix the worst one.

## Reporting format

```
DESIGN READ <one line: surface, audience, aesthetic language>          # written before any code
DIRECTION   <aesthetic name + 1 line>
LIBRARIES   <registries used, with which elements>
HARD FAILS  <count> fixed: <list, or "none">
GATES       mean <x.x>; lowest: <gate> <score>
EVIDENCE    <screenshot paths, viewport set, reduced-motion + keyboard results>
DEFERRED    <what and why>
/* beyond-ui · critique: P5 H4 E5 S4 R5 V5 */
```

The stamp on the last line is the six-axis pre-emit critique inherited from hallmark; anything below
3 forces a revision pass before the work is called done. Axes: **P**hilosophy (does it commit to one
idea?), **H**ierarchy, **E**xecution, **S**pecificity (only this product), **R**estraint,
**V**ariety (not a repeat of the last thing you built). A `V` of 3 usually means the same macrostructure
or theme has been reused; change the layout family or the palette band, not just the accent colour.

## Where each rule comes from

| Rule family | Upstream source (see `references/SKILLS.md`) |
|---|---|
| Slop gates 1–12, no fake chrome, honest copy, token locking, 8 states, repetition bans | hallmark |
| Tinted neutrals, no card-in-card, no bounce easing, live iteration | impeccable |
| `transition: all`, focus-visible replacement, `tabular-nums`, `text-wrap: balance`, paste, destructive confirms | Vercel web-interface-guidelines |
| Design Read, palette rotation, layout-family repetition, eyebrow cap, no placeholder-as-label | taste-skill |
| One orchestrated moment, spend boldness in one place, brief's words win | Anthropic frontend-design |
| Spacing scale, semantic tokens, real `<button>`, skeletons over spinners | addyosmani frontend-ui-engineering |
| Evidence basis (verified / confirm-with-human / human-required) on every finding | accesslint |
| Hierarchy → spacing → type → colour → clutter → empty states ordering | Refactoring UI port |
