# Motion (Framer Motion) Hooks & Component — Full Reference

Canonical import path: `motion/react` (Motion v11+; package `motion`). Legacy `framer-motion` exposes the same API. RSC-safe server import: `motion/react-client`.

---

## `useScroll`

```ts
const { scrollY, scrollYProgress, scrollX, scrollXProgress } = useScroll(options?)
```

| Return | Type | Description |
|---|---|---|
| `scrollY` | `MotionValue<number>` | Vertical scroll position, px |
| `scrollX` | `MotionValue<number>` | Horizontal scroll position, px |
| `scrollYProgress` | `MotionValue<number>` | Vertical progress `0 → 1` |
| `scrollXProgress` | `MotionValue<number>` | Horizontal progress `0 → 1` |

Options:

| Option | Type | Default | Description |
|---|---|---|---|
| `container` | `RefObject<HTMLElement>` | `window` | Scrollable element to track |
| `target` | `RefObject<HTMLElement>` | — | Element whose progress through the viewport to track |
| `offset` | `string[]` | `["start start", "end end"]` (with `target`) | Boundary definition, e.g. `["start end", "end start"]` |
| `axis` | `"x" \| "y"` | `"y"` | Which axis to measure |

`offset` strings combine an edge of the target with an edge of the container: `start`/`center`/`end` for both, e.g. `"start end"` = target top meets container bottom (element just entered from bottom).

Examples:

```tsx
// Full-page progress bar
const { scrollYProgress } = useScroll()
<motion.div style={{ scaleX: scrollYProgress, transformOrigin: "0%" }} />

// Element-scoped: animates while element scrolls through viewport
const ref = useRef(null)
const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
const y = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])
<motion.img ref={ref} style={{ y }} />

// Horizontal scroll section driven by vertical scroll
const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] })
const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"])

// Scroll direction
const { scrollY } = useScroll()
useMotionValueEvent(scrollY, "change", (v) => {
  const prev = scrollY.getPrevious()  // note: getPrevious exists on scrollY; generic MotionValue uses on("change") + closure
  const dir = v > prev ? "down" : "up"
})
```

---

## `useTransform`

```ts
// Map a source MotionValue through input/output ranges
useTransform(source: MotionValue, inputRange: number[], outputRange: (number|string)[], options?): MotionValue

// Multi-output: returns an object of MotionValues
useTransform(source, inputRange, { key: outputRange, ... }, options?): Record<string, MotionValue>

// Derive a new value from a function reading other values
useTransform(fn: () => (number|string)): MotionValue
```

Options:

| Option | Type | Default | Description |
|---|---|---|---|
| `clamp` | `boolean` | `true` | Clamp output to `outputRange` bounds |

Ranges can be numbers, colors, or unit strings (`"0%"`, `"blur(0px)"`, `"inset(...)"`). Motion interpolates compatible types.

```tsx
const { scrollYProgress } = useScroll({ target: ref })
const blur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(12px)"])
const bg = useTransform(scrollYProgress, [0, 1], ["#000", "#fff"])

// Non-clamped (overshoot allowed)
const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.3, 1], { clamp: false })

// Function form (reads multiple values)
const y = useTransform(() => scrollY.get() * -0.3)
```

---

## `useInView`

```ts
const isInView = useInView(ref: RefObject<Element>, options?): boolean
```

| Option | Type | Default | Description |
|---|---|---|---|
| `root` | `RefObject<Element>` | `window` | Scrollable parent to use as viewport |
| `margin` | `string` | `"0px"` | Margin on viewport detection area, e.g. `"0px 100px -50px 0px"` |
| `amount` | `"some" \| "all" \| number(0–1)` | `"some"` | Proportion that must be visible |
| `once` | `boolean` | `false` | If true, lock to `true` after first enter and stop observing |
| `initial` | `boolean` | `false` | Value returned before first measurement |

```tsx
const ref = useRef(null)
const inView = useInView(ref, { once: true, amount: 0.4 })
useEffect(() => { if (inView) /* start video / load chart */ }, [inView])
```

0.6kb, uses `IntersectionObserver`. Use `whileInView` prop on `motion` instead when you only need to trigger an animation target.

---

## `useMotionValue`

```ts
const value = useMotionValue(initialState: number | string): MotionValue
```

Methods:

| Method | Description |
|---|---|
| `get()` | Latest value |
| `set(next)` | Set state; DOM updates without React re-render |
| `getVelocity()` | Velocity per second (0 for non-numeric) |
| `jump(next)` | Set immediately, reset velocity to 0, end active animations |
| `isAnimating()` | Whether currently animating |
| `stop()` | Stop active animation |
| `on(event, cb)` | Subscribe to `"change" \| "animationStart" \| "animationComplete" \| "animationCancel"`. Returns unsubscribe. |
| `destroy()` | Cleanup (auto-managed for hook-created values) |

```tsx
const x = useMotionValue(0)
const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0])
return <motion.div drag="x" style={{ x, opacity }} />
```

---

## `useSpring`

```ts
useSpring(source: number | string | MotionValue, options?): MotionValue
```

Spring options (same as transition spring): `stiffness` (default 100), `damping` (10), `mass` (1), `bounce` (0.25), `duration`, `velocity`, `restSpeed` (0.1), `restDelta` (0.01). Plus:

| Option | Type | Default | Description |
|---|---|---|---|
| `skipInitialAnimation` | `boolean` | `false` | Jump to source value on mount without animating (useful when tracking `useScroll` which jumps after DOM measure) |

Methods on the returned value: `.set(target)` (spring to it), `.jump(value)` (instant).

```tsx
const { scrollYProgress } = useScroll()
const smooth = useSpring(scrollYProgress, { stiffness: 100, damping: 30, skipInitialAnimation: true })

// Manual control
const x = useSpring(0, { stiffness: 300, damping: 26 })
x.set(100)
```

---

## `useVelocity`

```ts
useVelocity(value: MotionValue<number>): MotionValue<number>
```

Returns a MotionValue tracking the source's velocity per second. Chainable for acceleration.

```tsx
const x = useMotionValue(0)
const xVelocity = useVelocity(x)
const scale = useTransform(xVelocity, [-3000, 0, 3000], [1.5, 1, 1.5], { clamp: false })
return <motion.div drag="x" style={{ x, scale }} />
// acceleration:
const xAccel = useVelocity(xVelocity)
```

---

## `useMotionValueEvent`

```ts
useMotionValueEvent(value: MotionValue, event: "change" | "animationStart" | "animationComplete" | "animationCancel", callback: (latest) => void): void
```

React-safe subscription (auto-unsubscribes on unmount). Prefer over `value.on()` inside components.

```tsx
useMotionValueEvent(scrollY, "change", (latest) => console.log(latest))
```

---

## `useReducedMotion`

```ts
const shouldReduce: boolean = useReducedMotion()
```

Responds live to the OS `prefers-reduced-motion` setting. Substitute `x/y` with `opacity`; disable looping/parallax.

```tsx
const reduce = useReducedMotion()
const closedX = reduce ? 0 : "-100%"
<motion.div animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : closedX }} />
```

Global: `<MotionConfig reducedMotion="user">` auto-reduces transform/opacity springs.

---

## The `motion` component

`motion.<element>` for every HTML/SVG element. Custom: `motion.create(Component)` (must forward a ref; do it at module scope, never inside render).

Props:

| Prop | Description |
|---|---|
| `initial` | Start state (object / variant label / `false`). `false` disables enter anim and is SSR-final. |
| `animate` | Target state (object / variant label). Re-animates on change. |
| `exit` | Target on removal (needs `AnimatePresence` parent). |
| `transition` | Default transition for the above when they don't define one. |
| `variants` | Named animation states. |
| `custom` | Data passed to dynamic variants (functions). |
| `whileHover` / `whileTap` / `whileFocus` / `whileDrag` / `whileInView` | Gesture/viewport targets. |
| `viewport` | Options for `whileInView`: `{ once?, root?, margin?, amount? }` |
| `layout` / `layoutId` / `layoutScroll` / `layoutRoot` / `layoutAnchor` | Layout animation (see below). |
| `drag` | `"x" \| "y" \| true`. Pair with `dragConstraints`, `dragElastic`, `dragMomentum`. |
| `style` | Accepts `MotionValue`s and independent transforms (`x`, `y`, `rotate`, `scale`, `originX/Y/Z`). |
| `transformTemplate` | Reorder transforms: `({x, rotate}) => \`rotate(...) translateX(...)\``. |
| `inherit` | `false` stops variant propagation from parent. |
| `onUpdate` / `onAnimationStart` / `onAnimationComplete` | Lifecycle callbacks. |

Gesture callbacks: `onHoverStart/End`, `onTapStart/onTap/onTapCancel`, `onViewportEnter/Leave`, `onDragStart/End/DirectionLock`.

Variants propagate: parent `animate="visible"` triggers `animate="visible"` on children with matching variant names, enabling orchestrated staggers.

```tsx
const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.4 } } }
<motion.ul variants={container} initial="hidden" animate="visible">
  {items.map(it => <motion.li key={it.id} variants={item} />)}
</motion.ul>
```

Dynamic variant (per-item delay via `custom`):

```tsx
const item = { visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06 } }) }
<motion.li custom={index} variants={item} animate="visible" />
```

---

## `AnimatePresence`

```tsx
<AnimatePresence mode? initial? custom? onExitComplete? propagate? root?>
  {condition && <motion.X key="stable-id" exit={{...}} />}
</AnimatePresence>
```

| Prop | Default | Description |
|---|---|---|
| `mode` | `"sync"` | `"sync"` (in+out together), `"wait"` (enter after exit — single child only), `"popLayout"` (exit removed from flow; pair with `layout`) |
| `initial` | `true` | `false` disables first-render enter anims |
| `custom` | — | Passed to exiting children (read via `usePresenceData()`); used for directional transitions |
| `onExitComplete` | — | Fires when all exits done |
| `propagate` | `false` | Nested children also exit when this AnimatePresence exits from a parent |
| `root` | `document.head` | Where to inject `popLayout` styles (set to a `ShadowRoot` for shadow DOM) |

Hooks:
- `usePresence()` → `[isPresent, safeToRemove]` (call `safeToRemove` when ready to unmount).
- `useIsPresent()` → boolean.
- `usePresenceData()` → the `custom` value (available even to exiting children).

Rules: every direct child needs a unique stable `key`; the conditional goes *inside* `AnimatePresence`; nested `motion` components inside an exiting element also animate their `exit` before removal.

---

## Layout animation props

| Prop | Type | Description |
|---|---|---|
| `layout` | `boolean \| "position"` | Animate layout changes from React re-render. `"position"` only animates position (size snaps). |
| `layoutId` | `string` | Shared element transition between two elements with the same id |
| `layoutScroll` | `boolean` | On scrollable container: account for scroll offset |
| `layoutRoot` | `boolean` | On `position: fixed` container: account for page scroll offset |
| `layoutAnchor` | `{ x: 0–1, y: 0–1 }` | Anchor for parent-relative layout calc |

`LayoutGroup` synchronizes layout anims across siblings that affect each other's layout.

```tsx
<motion.img layoutId="hero" src={src} onClick={open} />   {/* tile */}
<AnimatePresence>
  {isOpen && <motion.img layoutId="hero" src={src} exit={{ opacity: 0 }} />}  {/* full modal */}
</AnimatePresence>
```

Border-radius/box-shadow are auto scale-corrected but must be set via `style`/`animate`, not CSS classes Motion can't read. Add `layout` to direct children to counter-scale them and prevent distortion. Customize transition per-property:

```tsx
<motion.div layout animate={{ opacity: 0.5 }} transition={{ ease: "linear", layout: { duration: 0.3 } }} />
```

---

## Transitions

Set via `transition` prop or inside a variant. Three types:

### Tween
`type: "tween"` (implicit when `duration` set). Props: `duration` (s, default 0.3), `ease` (name | cubic-bezier `[a,b,c,d]` | array per keyframe), `times` (keyframe positions 0–1).

Easing names: `linear`, `easeIn`, `easeOut`, `easeInOut`, `circIn/Out/InOut`, `backIn/Out/InOut`, `anticipate`.

### Spring
`type: "spring"`. Props: `stiffness` (100), `damping` (10), `mass` (1), `bounce` (0.25), `velocity`, `restSpeed` (0.1), `restDelta` (0.01), `visualDuration` (s — when it visually reaches target).

### Inertia
`type: "inertia"`. Props: `power` (0.8), `timeConstant` (700), `modifyTarget` (fn → snapped target), `min`, `max`, `bounceStiffness` (500), `bounceDamping` (10).

### Orchestration (variants only)
`delay`, `repeat` (number | `Infinity`), `repeatType` (`"loop"|"reverse"|"mirror"`), `repeatDelay`, `when` (`"beforeChildren"|"afterChildren"`), `delayChildren` (number or `stagger(step, opts)`).

Value-specific: `transition: { default: {...}, opacity: {...} }`. Inherit: `inherit: true`. Global default via `<MotionConfig transition={...}>`.

### Stagger helper
```tsx
import { stagger } from "motion/react"
const t = { delayChildren: stagger(0.08, { from: "first" | "last" | "center" | index }) }
```