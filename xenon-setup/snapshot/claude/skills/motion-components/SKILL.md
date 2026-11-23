---
disable-model-invocation: true
name: motion-components
description: Reference for Motion (Framer Motion) React animation hooks and components — use when building scroll-linked, layout, gesture, page-transition, or reduced-motion animations with `motion/react`.
---

# Motion (Framer Motion) Components & Hooks Reference

Motion (formerly Framer Motion, package `motion`, import path `motion/react`) is a declarative animation library for React. This skill is a self-contained reference for its hooks and components. Read it before writing Motion-based animation code so you reach for the right primitive and avoid common anti-patterns.

## When to invoke this skill

Use this skill when the task involves any of:
- **Scroll-linked/scroll-driven** animation (progress bars, parallax, reveal-on-scroll, sticky section transforms).
- **Layout animation** — smoothly animating position/size changes, shared-element transitions (list reorders, expanding cards, modal-from-tile).
- **Gesture animation** — hover/tap/focus/drag affordances on interactive elements.
- **Page/route transitions** — enter/exit animations, route-change morphs.
- **Reduced-motion** — making animations respect `prefers-reduced-motion`.
- **Performance-sensitive continuous animation** — driving DOM from `MotionValue`s without React re-renders.

Do NOT use this skill (and reach for something else) when: you need timeline-orchestrated, multi-actor keyframe sequences (GSAP/Remotion fit better), or GPU-heavy particle/3D work (Three.js / WebGL).

## Package & imports

```bash
npm install motion
```

```ts
// Current (Motion v11+, formerly "Framer Motion")
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "motion/react"

// React Server Components (Next.js App Router server components)
import * as motion from "motion/react-client"
```

Legacy `framer-motion` installs still expose the same API under `framer-motion`. The `motion/react` path is canonical now.

## Core principles

1. **Animate `transform` and `opacity`, not layout-affecting props.** Motion is optimized to animate `x/y/scale/rotate/opacity` on the compositor thread. Animating `width/height/top/left/margin` forces layout each frame and jank. If you must change size, prefer `scale` or the `layout` prop.
2. **Prefer `MotionValue` over React state for per-frame values.** `useMotionValue` + `useTransform`/`useSpring` update the DOM directly, bypassing React's render cycle. Never put a value that changes every frame into `useState`.
3. **Declarative over imperative.** Use `animate`/`whileHover`/`whileInView` + `variants` instead of `useEffect` + `animate(...)` whenever the trigger is a React state or gesture. Reach for the imperative `animate()` function only for one-off sequences or values outside the React tree.
4. **Compose with hooks.** `useScroll → useTransform → useSpring` is the canonical scroll pipeline. Each hook returns a `MotionValue` that feeds the next, all off the React render path.
5. **Variants propagate.** A parent with `variants` + `animate="label"` propagates the label to children that also define `variants`, enabling orchestrated staggered reveals without per-child wiring.
6. **Exit animations need `AnimatePresence`.** A `motion` element removed from the tree won't animate its `exit` unless it is a direct child of an `AnimatePresence` (and has a stable `key`).
7. **Reduced motion is a first-class concern.** Wrap motion-affecting logic in `useReducedMotion()` checks. Prefer substituting `opacity` for `x/y` displacement when reduced motion is requested.

## Animation token scale

Use these as defaults; they are the values Motion's own defaults and examples converge on. Keep durations short and easings mostly `easeOut` for UI work.

| Token | Value | Use |
|---|---|---|
| Duration — micro (hover/tap) | `0.15s` | Gesture feedback |
| Duration — standard (enter/exit) | `0.3s` | Modal, dropdown, tooltip |
| Duration — emphasis | `0.5–0.8s` | Page transition, hero reveal |
| Duration — scroll-linked | `0` (driven by scroll) | Parallax, progress — value comes from `useScroll`, not `duration` |
| Easing — default UI | `"easeOut"` | Most entrances; snappy start, soft land |
| Easing — symmetric | `"easeInOut"` | Toggle/ reversible transitions |
| Easing — spring (default) | `type:"spring"`, `stiffness:100`, `damping:10`, `mass:1` (Motion defaults) | Playful, physical motion |
| Easing — spring (tight UI) | `stiffness:300–500`, `damping:25–40` | Snappy button/tooltip |
| Easing — spring (gentle) | `stiffness:50–100`, `damping:15–20` | Page/section transitions |
| Stagger | `staggerChildren: 0.05–0.1` per child | List reveals |
| Spring rest thresholds | `restSpeed: 0.1`, `restDelta: 0.01` (defaults) | Leave alone unless tuning |

### Standard variant set (copy-paste)

A reusable, opinionated variant set that covers most enter/exit needs. Set `custom` to the item index for staggering.

```tsx
export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, ease: "easeOut", delay: i * 0.06 },
  }),
  exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeIn" } },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 26 } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.15, ease: "easeIn" } },
}
```

## The hooks (quick catalog — full detail in `references/hooks.md`)

### `useScroll` — scroll position/progress as MotionValues

```tsx
const { scrollY, scrollYProgress, scrollX, scrollXProgress } = useScroll(options?)
```

- `scrollY` / `scrollX`: pixel position. `scrollYProgress` / `scrollXProgress`: `0 → 1`.
- Options: `target` (ref to track an element through viewport), `offset` (boundary definition like `["start end", "end start"]`), `container` (scrollable parent ref, default `window`), `axis`.

```tsx
// Page-wide progress bar
const { scrollYProgress } = useScroll()
return <motion.div style={{ scaleX: scrollYProgress, transformOrigin: "0%" }} className="h-1 bg-blue-500" />

// Element-scoped parallax
const ref = useRef(null)
const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
const y = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])
return <motion.img ref={ref} style={{ y }} />
```

### `useTransform` — map a MotionValue to another range

```tsx
useTransform(source, inputRange, outputRange, options?)   // array form
useTransform(source, inputRange, { key: outputRange }, options?) // multi-output
useTransform(() => derivedValue)                            // function form
```

Options: `{ clamp: true }` (default). Set `clamp: false` to let values overshoot the range.

```tsx
const { scrollYProgress } = useScroll({ target: ref })
const blur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(12px)"])
const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2], { clamp: true })
return <motion.div style={{ filter: blur, scale }} />
```

### `useInView` — boolean viewport detection (0.6kb)

```tsx
const isInView = useInView(ref, { root?, margin?, amount?, once?, initial? })
```

Returns a boolean. Use `once: true` to fire only on first enter. `amount`: `"some"` | `"all"` | number `0–1`. Use this when you need a plain boolean to drive React logic (start a video, lazy-mount a chart). For one-shot CSS-like reveals prefer `whileInView` on `motion` instead.

```tsx
const ref = useRef(null)
const isInView = useInView(ref, { once: true, amount: 0.4 })
return <div ref={ref}>{isInView && <HeavyChart />}</div>
```

### `useMotionValue` / `useSpring` / `useVelocity` / `useMotionValueEvent`

- `useMotionValue(init)` — a mutable value that updates the DOM without re-renders. Methods: `get`, `set`, `getVelocity`, `jump`, `isAnimating`, `stop`, `on`.
- `useSpring(source, options?)` — a spring-smoothed version of a value/number. Use it to smooth scroll progress or a drag value.
- `useVelocity(motionValue)` — a MotionValue of the source's velocity. Chain for acceleration.
- `useMotionValueEvent(value, "change", cb)` — React-safe subscription (auto-cleans up).

```tsx
// Smooth a scroll progress + react to direction
const { scrollYProgress } = useScroll()
const smooth = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
// direction detection:
const { scrollY } = useScroll()
useMotionValueEvent(scrollY, "change", (v) => {
  const dir = v > (scrollY.getPrevious?.() ?? v) ? "down" : "up"
})
```

### `useReducedMotion` — respect the OS setting

```tsx
const reduce = useReducedMotion()
const closedX = reduce ? 0 : "-100%"  // fall back to opacity-only when reduced
return <motion.div animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : closedX }} />
```

## The `motion` component

`motion.div`, `motion.button`, `motion.circle`... a drop-in animated version of every HTML/SVG element. Wrap custom components with `motion.create(Component)` (the component must forward a ref to the animated DOM node).

Key props:
- `initial` — start state (object, variant label, or `false` to disable enter anim). `initial={false}` makes SSR output the final state.
- `animate` — target state (object or variant label). Re-animates whenever it changes.
- `exit` — target on removal (requires `AnimatePresence` parent).
- `transition` — timing for the above when they don't define their own.
- `variants` — named states. A parent's variant label propagates to children.
- `whileHover` / `whileTap` / `whileFocus` / `whileDrag` / `whileInView` — gesture/viewport targets.
- `layout` / `layoutId` — layout & shared-layout animation (see below).
- `style` — accepts `MotionValue`s and independent transform props (`x`, `y`, `rotate`, `scale`, `originX`).

### Gestures

```tsx
<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} />
<motion.div drag whileDrag={{ scale: 1.1, cursor: "grabbing" }} />
<motion.section whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.3 }} />
```

Callbacks: `onHoverStart/End`, `onTapStart/onTap/onTapCancel`, `onViewportEnter/Leave`, `onDragStart/End`, `onAnimationStart/Complete`, `onUpdate`.

### Variants + propagation + stagger

```tsx
const list = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.4 } },
}
<motion.ul variants={list} initial="hidden" animate="visible">
  {items.map((it) => <motion.li key={it.id} variants={item} />)}
</motion.ul>
```
Set `inherit={false}` on a child to stop propagation. Use the `custom` prop + a variant-as-function for per-item delays.

## `AnimatePresence` — exit animations

```tsx
<AnimatePresence mode="popLayout" initial={false} onExitComplete={...}>
  {items.map((it) => <motion.li key={it.id} layout exit={{ opacity: 0, y: -10 }} />)}
</AnimatePresence>
```

- `mode`: `"sync"` (default, in+out together) | `"wait"` (enter after exit done — single child only) | `"popLayout"` (exit element removed from flow so siblings reflow immediately; pair with `layout`).
- `initial={false}` — disable first-render enter anims (good for SSR/initial mount where you don't want a flash).
- `custom={dir}` — pass data to exiting children (read via `usePresenceData()`); essential for directional page transitions.
- `propagate` — nested `AnimatePresence` children exit when the parent does.
- Hooks: `usePresence` (`[isPresent, safeToRemove]`), `useIsPresent()` (bool), `usePresenceData()` (the `custom` value).

**Common mistake:** the conditional must be *inside* `AnimatePresence`, not wrapping it.
```tsx
// WRONG: exit anims never fire because AnimatePresence itself unmounts
{show && <AnimatePresence><X/></AnimatePresence>}
// RIGHT
<AnimatePresence>{show && <X key="x"/>}</AnimatePresence>
```

## Layout animations

- `layout` — animate any layout change caused by React re-render (reorder, resize, toggle). Make changes via `style`/`className`, **not** `animate`.
- `layout="position"` — animate only position, snap size (good for aspect-ratio-changing media).
- `layoutId="shared"` — two elements with the same `layoutId` morph between each other across mount/unmount (tile → modal, list → detail). Wrap the disappearing side in `AnimatePresence` to keep it mounted during the morph.
- `layoutScroll` — on a scrollable container so Motion corrects for scroll offset.
- `layoutRoot` — on a `position: fixed` container so page-scroll offset is accounted for.
- `LayoutGroup` — synchronize layout anims across siblings that affect each other's layout but don't re-render together.
- Border-radius and box-shadow are auto scale-corrected, but must be set via `style`/`animate`, not raw CSS classes Motion can't read.

```tsx
// Shared element: thumbnail expands to fullscreen modal
<motion.img layoutId="hero" src={src} onClick={open} />
<AnimatePresence>
  {isOpen && <motion.img layoutId="hero" src={src} exit={{ opacity: 0 }} />}
</AnimatePresence>
```

## Page transitions recipe

Directional crossfade using `custom` + a variant that reads direction:

```tsx
const variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -80 : 80 }),
}

function Page({ dir, children }) {
  return (
    <AnimatePresence mode="wait" custom={dir} initial={false}>
      <motion.main
        key={location.pathname}
        custom={dir}
        variants={variants}
        initial="enter" animate="center" exit="exit"
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  )
}
```
With Next.js App Router, wrap `<motion.main>` inside the `template.tsx` (template re-mounts on navigation, unlike layout). In `mode="wait"`, use `ease: "easeIn"` on exit and `ease: "easeOut"` on enter so the overall feel reads as `easeInOut`.

## Reduced-motion patterns

1. Substitute displacement with opacity: `x: reduce ? 0 : "-100%"`.
2. Drop parallax: short-circuit `useTransform` chains when `reduce` is true (return a static value).
3. For scroll-driven reveals, keep the reveal but disable the parallax `y` offset.
4. Disable autoplay/looping background motion (`repeat: Infinity`).
5. Consider a global `<MotionConfig reducedMotion="user">` to have Motion auto-reduce transform/opacity springs; combine with explicit `useReducedMotion()` checks for cases Motion can't infer.

```tsx
import { MotionConfig } from "motion/react"
<MotionConfig reducedMotion="user">{children}</MotionConfig>
```

## Anti-patterns (avoid these)

- **Animating `width`/`height`/`top`/`left`/`margin`.** Causes layout recalculation each frame. Use `scale`, the `layout` prop, or `useTransform` on a transform property.
- **Putting per-frame values in `useState`.** Re-renders the whole subtree every frame. Use `useMotionValue`.
- **Reaching for `useEffect` + `animate()` for gesture/state-driven motion.** That's what `animate`/`whileHover`/`whileInView` props are for — declarative, and Motion manages cleanup.
- **Forgetting `key` on `AnimatePresence` children, or using array index as key.** Breaks exit animations on reorder. Use stable IDs.
- **Wrapping `AnimatePresence` in the conditional** instead of putting the conditional inside it (see above).
- **Using `mode="wait"` with multiple children.** `wait` supports one child at a time; for lists use `popLayout` or `sync`.
- **Forgetting `layoutScroll`/`layoutRoot`** on scrollable/fixed parents — layout anims will be misaligned by the scroll/fixed offset.
- **Over-springing everything.** Default spring (`stiffness:100, damping:10`) is bouncy and wrong for most UI affordances. Tighten to `stiffness:300–500, damping:25–40` for buttons/tooltips.
- **`staggerChildren` without `delayChildren` on a parent that also animates.** Set the parent's own `transition` to `{}` (no-op) so it doesn't compete with the stagger orchestration.
- **Border radius / box shadow via CSS classes on `layout` elements.** Motion can't read them for scale correction. Set them via `style` or `animate`.
- **Ignoring reduced motion.** Always branch on `useReducedMotion()` for displacement and looping animations.
- **Calling `motion.create(Component)` inside render.** It must be module-scope (it creates a new component type; calling in render remounts every render and breaks animation continuity).

## Performance notes

- Motion animates `transform`/`opacity` on the compositor thread where possible.
- `MotionValue`s bypass React's render cycle — wire scroll/continuous input through `useScroll → useTransform → style`, not through state.
- For lists with many animating items, prefer `layout` (single measurement pass) over per-item `animate` targets that each trigger a render.
- `useInView` is 0.6kb and uses `IntersectionObserver`; it does not itself animate — pair it with a conditional `animate` target or lazy-mount heavy children.

## See also

- `references/hooks.md` — full signatures, options tables, and more code examples for every hook (`useScroll`, `useTransform`, `useInView`, `useMotionValue`, `useSpring`, `useVelocity`, `useMotionValueEvent`, `useReducedMotion`) and the `motion` component props.
- Official docs: https://motion.dev/docs — for behavior beyond what's distilled here.