# Motion

Motion is where AI-generated UI gives itself away fastest — either nothing moves, or everything
fades up on scroll with the same 300ms ease-in-out. This file defines the motion system, the
technology choice, and the limits.

## The motion contract (write these before animating)

```ts
// tokens, not vibes
const ease = {
  out:   [0.16, 1, 0.3, 1],      // expo-out: entrances, reveals
  inOut: [0.65, 0, 0.35, 1],     // state transitions
  spring: { type: "spring", stiffness: 300, damping: 30 }, // interactive
};
const dur = { micro: 120, ui: 200, surface: 320, hero: 700 };
```

Rules that hold for every animation:

1. **Purpose test.** Before animating, name the job: hierarchy (this matters more), causality
   (this came from there), state (this changed), or focus (look here). No job → no animation.
2. **Animate `transform` and `opacity`** almost exclusively. Animating layout properties
   (`width`, `height`, `top`, `margin`) causes reflow. Use `grid-template-rows`/`height` with
   measured auto-height only when unavoidable, and never in a list.
3. **Never animate something the user is reading** at a speed that delays comprehension. Content
   reveals are fast (150–320ms) and stagger ~40–80ms, not 500ms each.
4. **Interaction feedback is instant** (≤ 150ms) — hover, press, focus. Anything slower feels broken.
5. **Respect `prefers-reduced-motion`.** Motion (`motion/react`) via `<MotionConfig reducedMotion="user">`;
   GSAP via `gsap.matchMedia()`; CSS via `@media (prefers-reduced-motion: reduce)`. Reduced motion
   means *fewer and gentler*, not *none*: opacity fades stay, parallax/spin/auto-play stop.
6. **Scroll animation never blocks scroll.** Never hijack the wheel. Never scroll-jack a marketing
   page's body; use scroll-linked effects that track the user, not drive them.
7. **Nothing animates on the critical path to LCP.** The hero's LCP element must be paintable
   before JS runs — animate from CSS, or keep the animated element out of the LCP slot.
8. **One entrance grammar per page.** A page where cards fade-up, sections slide-in and headers
   scale-in looks assembled from three tutorials. Pick one grammar, apply it consistently.

## Technology decision

| Need | Use | Why |
|---|---|---|
| React component motion, layout animations, gestures, exit animations | **Motion** (`motion/react`, formerly Framer Motion) | Best React ergonomics; layout/`AnimatePresence`; the peer dep of nearly every animated registry |
| Timeline/sequencing, SVG morph, ScrollTrigger, pinning | **GSAP** (+ ScrollTrigger; all plugins free since Webflow) | Precise timelines, unmatched SVG/path control, robust scroll scenes |
| Framework-agnostic, tiny, declarative DOM/SVG animation | **Anime.js v4** | v4 API (`animate`, `createTimeline`, `createDraggable`, `stagger`), ESM, no React lock-in |
| Smooth scrolling | **Lenis** | The standard; pair with GSAP ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)` |
| View Transitions (page/route transitions) | **View Transitions API** + `next-view-transitions` | Native, no library, works for route changes and shared-element morphs |
| CSS-only micro-interactions, hovers, loaders | **Tailwind + `@keyframes` / `tailwindcss-motion`** | Zero JS, zero bundle; often the correct answer |
| Lists entering/leaving without a motion lib | **`@formkit/auto-animate`** | One line, handles add/remove/reorder |
| Text: numbers ticking, char stagger, typewriter | **NumberFlow**, **split-text via GSAP SplitText**, registry `TextAnimate`/`AnimatedShinyText` | Do not hand-roll char-splitting |
| Animated icons | **Lottie/dotlottie**, `lucide` + CSS, **Lordicon**, **useAnimations** | Reuse; hand-authored SVG path animation is a rabbit hole |
| 3D / WebGL scenes | **React Three Fiber + drei** (+ `gltfjsx`, Rapier for physics), **shaders** | See `references/EFFECTS.md` — and read the "when not to" section there |

Never ship two libraries that do the same job. Motion **or** GSAP as the primary; the other only with
a named reason.

## Patterns that read as designed

**Staggered entrance (the good version).** Container variants with `staggerChildren: 0.06`, children
`y: 12 → 0` + opacity, `ease.out`, 320ms. Once per session per section, not re-triggered on every
scroll direction change.

**Shared-element transition.** Card → detail uses Motion `layoutId` (same route tree) or the View
Transitions API (across routes). The element the user clicked visibly becomes the thing they see.

**Scroll-linked progress** — a heading that scales with scroll position (`useScroll` +
`useTransform`) reads as craft when subtle (0.98 → 1.0 scale), as a gimmick when loud.

**Number/stat reveals** on first viewport entry, with the *final value correct in the DOM* for
no-JS and screen readers.

**Hover depth without jitter.** One transform axis + one shadow step. Never combine scale, rotate,
translate and blur on the same hover.

**State continuity.** Loading → loaded must not jump: skeleton geometry equals final geometry; list
items animate into place rather than snapping.

**Page transitions.** Short (200–400ms), consistent direction, no white flash, respects reduced
motion. A curtain wipe on a dashboard is wrong; on an agency site it might be the whole point.

## Anti-patterns (hard fails)

- `transition-all duration-300` on everything, especially on elements with layout changes.
- Every section fading up on scroll with identical timing (the "scroll reveal template").
- Animations longer than ~700ms on a conversion path.
- `animation: infinite` decorative movement in the user's peripheral vision while they read.
- Auto-playing carousels that cannot be paused (WCAG 2.2.2).
- Parallax that moves text faster than the viewport can render it (motion sickness, blur).
- Framer Motion imported for one hover effect that CSS does better.
- Entrance animations that only work on first paint and break on client-side navigation.
- Motion that hides content from `aria-hidden` or from a no-JS render, or that leaves
  `opacity: 0` when the library fails to hydrate. Content must be visible without JS.

## Reduced-motion implementation (do all three layers)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
```

```tsx
<MotionConfig reducedMotion="user">…</MotionConfig>   // motion/react
gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => { /* heavy stuff */ });
```

Plus a manual pass: the reduced-motion render is screenshotted and inspected — nothing may disappear
or shift layout.

## Performance guards

- Budget: entrance animations add 0 long tasks; a scroll scene must hold 60fps on a mid-range laptop
  (test with 4× CPU throttling in DevTools).
- `will-change` only during the animation, removed after — permanent `will-change` costs GPU memory
  and can *lower* frame rate.
- Prefer `IntersectionObserver` (or Motion's `whileInView`) over scroll-event math.
- Don't animate inside `overflow: hidden` + `filter`/`backdrop-filter` stacks — expensive compositing
  on every frame.
- Verify INP: no animation on the interaction path adds more than ~50ms.
- Lazy-init heavy libraries (`gsap`, three) behind `useEffect` or dynamic import so they stay out of
  the initial bundle.
