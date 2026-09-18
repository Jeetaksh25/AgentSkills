# Accessibility and performance constraints on visual design

Every visual decision in this skill is bounded by these rules. They are not a later phase — a design
that violates them is not finished, and retrofitting them costs more than designing with them.

## Accessibility (WCAG 2.2 AA is the floor)

**Motion**
- **2.2.2 Pause, Stop, Hide** — any auto-playing/animated content that runs > 5s needs a pause
  control, or it must be purely decorative and stoppable by the reduced-motion setting.
- **2.3.1 Three Flashes** — nothing flashes more than 3×/second.
- **2.3.3 Animation from Interactions (AAA, aim for it)** — motion triggered by interaction must be
  disableable; we do this globally via `prefers-reduced-motion`.
- `prefers-reduced-motion: reduce` → remove parallax, auto-play, spin, scroll-linked scale; keep
  opacity fades and instant state changes. Test by rendering with the media query forced on.
- Motion must never be the only signal of a state change; pair it with a text/ARIA/visual change
  (e.g. don't communicate "saved" with a green pulse only).

**Contrast**
- 1.4.3: body ≥ 4.5:1, large (≥ 24px or 19px bold) ≥ 3:1 — measured against the *rendered*
  background, including gradients, glass and images. Text over media needs a scrim or a solid plate.
- 1.4.11 (non-text contrast): borders of inputs, focus rings, chart lines, icon-only controls ≥ 3:1
  against their adjacent colours, in every state and both themes.
- Never use colour alone to convey meaning (1.4.1) — add an icon, label or pattern.
- Forced colours / high contrast: verify `forced-colors: active` does not make the UI unusable
  (no `background-image`-only buttons, respect `Highlight`/`ButtonText`).

**Interaction**
- Keyboard-complete: everything reachable in a logical order, no traps (except intentional modal
  traps), escape closes overlays and returns focus to the trigger.
- Visible focus always (2.4.7 / 2.4.11 focus not obscured) — a designed focus ring ≥ 2px with offset,
  never `outline: none` without a replacement.
- Target size ≥ 24×24 CSS px (2.5.8); 44×44 for primary mobile actions.
- Dragging alternatives (2.5.7): any drag interaction needs a non-drag path.
- Accessible authentication (3.3.8): no cognitive-test password entry, support paste and password managers.

**Semantics**
- One `h1`, sequential headings, landmarks (`header`/`nav`/`main`/`footer`/`aside`), skip link.
- Form controls have programmatic labels; errors are announced (`aria-live`) and describe the fix.
- Images: meaningful `alt`; decorative `alt=""`. Icon-only buttons get `aria-label`.
- Route changes announce the new page (title + focus management) in SPAs.
- Animations must not hide content from the accessibility tree or from no-JS rendering — if JS fails,
  content stays visible (`opacity: 0` entrance animations need a no-JS fallback).

**Zoom & reflow**
- Usable at 200% zoom and 320px width without horizontal scrolling (1.4.10); body text must resize
  to 200% without loss (1.4.4). Use `rem`, not `px`, for type.

## Performance (Core Web Vitals are design constraints)

| Metric | Budget | Design decisions that control it |
|---|---|---|
| LCP | ≤ 2.5s | Hero text/image must paint without JS; animate from CSS or keep the LCP element out of the animation; preload the hero image/font; no client component wrapping the hero |
| CLS | ≤ 0.1 | Explicit image dimensions; font fallback with `size-adjust`/`ascent-override`; reserve space for banners, marquees and countdowns |
| INP | ≤ 200ms | No heavy work in interaction handlers; animations off the critical interaction path; virtualise long lists |

Additional guards:

- **Bundle discipline**: every animated registry component drags deps. Install, measure
  (`next build` output or `vite-bundle-visualizer`), and remove what is not used. A hero that costs
  400KB of JS to fade in is a bad trade; do it in CSS.
- **Three.js/WebGL**: only when it is the concept. Lazy-load it (`dynamic import`, `Suspense`), keep
  the scene ≤ 1–2MB of assets, provide a static poster for slow connections and reduced motion, and
  never put text the user must read *inside* the canvas.
- **Fonts**: subset, `font-display: swap`, preload the one above-the-fold face, at most 2–3 files;
  never load 6 weights "just in case".
- **Images**: AVIF/WebP with fallback, responsive `srcset`/`sizes`, correct priority, blur/dominant
  colour placeholders.
- **Animation**: transform/opacity only; no layout-animating properties; `content-visibility: auto`
  for long pages; avoid animating inside `backdrop-filter` subtrees; test with 4× CPU throttling
  (target: no long task > 50ms during scroll or entrance).
- **Third-party**: every embed (video, chat, map, analytics) is measured before shipping; no
  blocking third-party script above the fold.

## When a library or effect must NOT be used

| Situation | Ruling |
|---|---|
| Lead-gen / conversion page wants a WebGL hero | No. Page weight + GPU cost hurt LCP/INP; use a CSS gradient, generated mesh-gradient asset or static poster instead |
| WebGL backgrounds in general | Max 1–2 per page, with a static fallback. Vanta's own README warns about slow machines and mobile |
| Infinite marquee / auto-carousel | Only with a pause control (WCAG 2.2.2) or `prefers-reduced-motion` gating |
| Flashing/strobe effects | Never near the 3-flashes-per-second threshold (WCAG 2.3.1) |
| One element needs to move | CSS transition/`@keyframes` — a library has to earn its bytes (scroll-linked timelines, spring physics, FLIP layout, text splitting) |
| Custom cursors | Skip entirely for reduced-motion users; `cursor-effects` disables itself automatically — replicate that pattern in any custom implementation |
| Liquid glass | Only with the `@supports not (backdrop-filter)` fallback and a contrast check for text on it |
| `backdrop-filter` on many elements | Paint cost scales with blur radius × layer count — budget it |

## Verification steps (part of § Verify in SKILL.md)

1. Render with `prefers-reduced-motion: reduce` → screenshot → nothing missing, nothing broken.
2. Render with `prefers-contrast: more` and (where supported) `prefers-reduced-transparency: reduce`
   → glass surfaces stay legible, no invisible text.
3. Keyboard-only run through the primary flow → focus always visible, order logical, escape works.
4. Contrast check on new colour pairs in both themes, against real backgrounds including the worst
   frame of any animation — a tool, not the eye.
5. Automated a11y pass (axe/Lighthouse) → zero serious/critical; waivers need a reason and an id.
6. Lighthouse on the production build, mobile preset: performance ≥ 0.90, accessibility = 1.0,
   best-practices ≥ 0.95. Record numbers before/after any heavy visual addition.
7. 320px width and 200% zoom → no horizontal scroll, no clipped controls.
8. Long-task check with 4× CPU throttling during load, scroll and the heaviest interaction.

## Primary sources

`prefers-reduced-motion` (MDN) · `web.dev/articles/prefers-reduced-motion` · WCAG 2.2 Understanding:
[2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) ·
[2.3.1 Three Flashes](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html) ·
[2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) ·
[1.4.3 Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) ·
[1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) ·
web.dev [animations guide](https://web.dev/articles/animations-guide),
[LCP](https://web.dev/articles/lcp), [CLS](https://web.dev/articles/cls),
[optimize long tasks](https://web.dev/articles/optimize-long-tasks) ·
`MotionConfig reducedMotion="user"` (motion.dev) · `prefers-reduced-transparency` support
(chrome developers blog + caniuse) · View Transitions API (MDN).
