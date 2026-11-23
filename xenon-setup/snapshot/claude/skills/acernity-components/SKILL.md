---
disable-model-invocation: true
name: acernity-components
description: Reference Acernity UI animated-component patterns (spotlight, beams, meteors, 3D cards, mouse-follow tooltips, moving borders, text reveals) when building or adapting high-craft motion-heavy React/Tailwind UI.
---

# Acernity UI Components — Design & Animation Reference

A self-contained reference for the Acernity UI component catalog and the motion
methodology behind it. Use this when you need to build, port, or adapt
high-craft animated components in a React + Tailwind (v3/v4) + Motion (Framer
Motion) stack — the aesthetic Aceternity popularized: dark backgrounds, SVG
beam/path effects, mouse-driven 3D, staggered text reveals, and ambient
backgrounds.

## When to invoke

Invoke this skill when any of these apply:

- The user asks for an "Acernity-style" / "Aceternity" component or effect.
- You are building hero sections, marketing landing pages, waitlist/CTA blocks,
  feature cards, or portfolios that want a premium animated feel.
- You need a mouse-driven 3D tilt, a spotlight, animated background beams,
  meteor showers, moving gradient borders, staggered text generation, or a
  floating macOS-style dock/navbar.
- You are porting an Aceternity component to a non-shadcn setup and need to know
  the motion primitives underneath.

Do **not** invoke for: plain shadcn/ui admin components, data tables, or
accessibility-critical form UI — Aceternity components prioritize visual effect
over strict a11y and should be decorative enhancement, not the primary
interface.

## Core methodology (the Aceternity formula)

Almost every Aceternity component is a recipe of four ingredients. Learn the
recipe, not the individual components.

### 1. Two animation paradigms — pick by trigger type

Aceternity splits cleanly into two animation engines. Choose by *what triggers
the animation*:

| Trigger | Engine | Examples |
|---|---|---|
| Ambient / on-load / infinite loop | **Pure CSS keyframes** via Tailwind v4 `@theme inline` + `@keyframes` | Spotlight, Meteors, Background Beams, Shooting Stars, Aurora, Wavy/Vortex bg, Sparkles, Background Gradient |
| Pointer / hover / scroll / gesture | **Motion (Framer Motion / `motion/react`)** runtime values | 3D Card, Animated Tooltip, Moving Border, Wobble Card, Text Generate, Draggable Card, Magnetic Button, Floating Dock |

**Rule of thumb:** if it loops forever or needs no JS state, use CSS keyframes
(no JS bundle cost, GPU-friendly, survives reduced-motion via `prefers-reduced-motion`).
If it reacts to the cursor, scroll position, or mount/unmount, use Motion's
`useMotionValue` / `useSpring` / `useTransform` / `useAnimationFrame`.

### 2. The `cn()` helper (shadcn convention)

Every component merges classes through a `cn()` util = `clsx` + `tailwind-merge`.
Always forward the consumer's `className` through `cn()` so it wins over
defaults and dedupes conflicting Tailwind utilities:

```ts
// lib/utils.ts — required by every Aceternity component
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 3. shadcn registry distribution (you own the source)

Components install via `npx shadcn@latest add @aceternity/<name>` and the
source is **copied into your repo** (typically `components/ui/`). There is no
runtime npm dependency on `@aceternity/*`. Consequence: you can edit anything,
but you also own upgrades. Treat each installed file as your code, not a
black box.

### 4. Layered composition — effect layer behind content, `pointer-events-none`

Background/overlay effects are an absolutely-positioned, `inset-0`,
`pointer-events-none` layer sitting behind semantic content. The content stays
fully interactive; the effect never steals clicks.

```
<div className="relative ...">            {/* stage */}
  <Spotlight className="... pointer-events-none absolute ..." fill="blue" />
  <h1>Real content, clickable</h1>
</div>
```

## Concrete recipes

### Recipe A — CSS-keyframe ambient effect (Spotlight / Meteors pattern)

Register the keyframe in Tailwind v4 with `@theme inline`, then apply the
generated `animate-*` class to an absolutely-positioned SVG/span. This is the
exact pattern for `spotlight`, `meteors`, `shooting-stars`, `background-beams`.

```css
/* app/globals.css — Tailwind v4 */
@import "tailwindcss";

@theme inline {
  --animate-spotlight: spotlight 2s ease 0.75s 1 forwards;
  --animate-meteor: meteor 5s linear infinite;
}

@keyframes spotlight {
  0%   { opacity: 0; transform: translate(-72%, -62%) scale(0.5); }
  100% { opacity: 1; transform: translate(-50%, -40%) scale(1); }
}

@keyframes meteor {
  0%   { transform: rotate(215deg) translateX(0);    opacity: 1; }
  70%  { opacity: 1; }
  100% { transform: rotate(215deg) translateX(-500px); opacity: 0; }
}
```

```tsx
// Spotlight.tsx
import { cn } from "@/lib/utils";
export const Spotlight = ({ className, fill }: { className?: string; fill?: string }) => (
  <svg className={cn("animate-spotlight absolute -top-40 -left-40 h-[200%] w-[138%]", className)}
       xmlns="http://www.w3.org/2000/svg" viewBox="0 0 378 378" fill="none">
    <g filter="url(#f)">
      <ellipse cx="189" cy="189" rx="189" ry="189" fill={fill ?? "white"} />
    </g>
    <defs>...</defs>
  </svg>
);
```

```tsx
// Meteors.tsx — render N spans, each with randomized left/top/delay
const meteors = new Array(number).fill(true);
return (
  <div className={cn("relative", className)}>
    {meteors.map((_, idx) => (
      <span key={idx}
        className="animate-meteor absolute left-1/2 top-1/2 h-0.5 w-0.5 rounded-full bg-slate-300 shadow"
        style={{ animationDelay: `${idx * 0.15}s`, /* randomize left/top */ }} />
    ))}
  </div>
);
```

**Meteors prop:** `number` (count), `className`. Randomize per-meteor
`animationDelay` and start position so they don't look mechanical.

### Recipe B — Mouse-driven 3D tilt (3D Card Effect pattern)

Compound component: `CardContainer` (perspective + mouse rotation) /
`CardBody` (the transformed plane) / `CardItem` (per-element depth via
`translateZ`/`rotate*`). This same mouse→rotate math powers
`wobble-card`, `comet-card`, `glare-card`, `draggable-card`.

```tsx
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";

export const CardContainer = ({ children, className }) => {
  const x = useMotionValue(0);            // -0.5..0.5  (pointer rel to center)
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], ["17deg", "-17deg"]), { stiffness: 150, damping: 20 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], ["-17deg", "17deg"]), { stiffness: 150, damping: 20 });

  return (
    <div style={{ perspective: "1000px" }} className={className}>
      <motion.div
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          x.set((e.clientX - r.left) / r.width - 0.5);
          y.set((e.clientY - r.top)  / r.height - 0.5);
        }}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="relative [transform-style:preserve-3d]"
      >
        {children}
      </motion.div>
    </div>
  );
};

export const CardItem = ({ as: Tag = "div", children, translateZ = 0, className, ...rest }) => (
  <Tag className={cn("transition duration-200", className)}
       style={{ transform: `translateZ(${translateZ}px)`, ...rest.style }}>
    {children}
  </Tag>
);
```

**The math that matters:** convert pointer position to a `-0.5..0.5` range,
map that to ±15–20deg rotation, and wrap in `useSpring` so it eases rather
than snaps. `translateZ` on inner items is what creates the parallax pop —
closer items move more. Keep `transformStyle: "preserve-3d"` on every ancestor
or the depth flattens.

### Recipe C — Mouse-follow tooltip (Animated Tooltip pattern)

Hover reveals a card that tracks the cursor. Uses `AnimatePresence` for
mount/unmount and `useMotionValue` + spring for the lagging follow.

```tsx
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";

export const Person = ({ item }: { item: { name: string; designation: string; image: string } }) => {
  const [hover, setHover] = useState(false);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 100, damping: 10 });
  const sy = useSpring(y, { stiffness: 100, damping: 10 });

  return (
    <div className="relative" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <img src={item.image} alt={item.name}
        onMouseMove={(e) => { x.set(e.clientX - /* offset */ ); y.set(e.clientY - /* offset */ ); }}
        className="rounded-full ..." />
      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}
            style={{ left: sx, top: sy, translateX: 12, translateY: 10 }}
            className="pointer-events-none absolute z-50 ...">
            {item.name} · {item.designation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
```

**`items` prop:** `Array<{ id, name, designation, image }>`. Spring `stiffness: 100, damping: 10`
gives the characteristic slight lag.

### Recipe D — Moving gradient border (Moving Border pattern)

A gradient dot travels the perimeter on a loop, driven by
`useAnimationFrame` (not CSS — the path math needs per-frame calculation).
Props: `duration` (ms, default 2000), `borderRadius` (default `1.75rem`),
`as`, `borderClassName`, `containerClassName`, `className`.

```tsx
import { motion, useAnimationFrame, useMotionValue } from "motion/react";

export const MovingBorderButton = ({ children, duration = 2000, borderRadius = "1.75rem", ...p }) => {
  const [w, setW] = useState(0), [h, setH] = useState(0);          // perimeter
  const t = useMotionValue(0);
  useAnimationFrame((_) => t.set((t.get() + 1000 / duration) % 100)); // 0..100 loop
  // map t → (x,y) walking the rect border, render a small radial-gradient span at that point
  return (
    <button style={{ borderRadius }} className={cn("relative overflow-hidden", p.containerClassName)}>
      <motion.span style={{ left: /* x from t */, top: /* y from t */ }}
        className="absolute h-20 w-20 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 blur-xl" />
      <span className="relative z-10 ..." style={{ borderRadius }}>{children}</span>
    </button>
  );
};
```

The traveling glow is a blurred gradient circle whose `left/top` are computed
each frame from a `0..100` progress value walking the border path.

### Recipe E — Staggered text reveal (Text Generate Effect)

Split `words` on spaces, render each word in a `motion.span` with a stagger
via a parent `variants` container. Props: `words`, `duration`, `filter`
(blur during transition), `className`.

```tsx
import { motion } from "motion/react";

export const TextGenerateEffect = ({ words, className, duration = 0.5, filter = true }) => {
  const arr = words.split(" ");
  const container = { hidden: { opacity: 0 }, visible: (i=1) => ({ opacity: 1, transition: { staggerChildren: duration * 0.4, delayChildren: 0.04 * i } }) };
  const child = { visible: { opacity: 1, filter: filter ? "blur(0px)" : "none" }, hidden: { opacity: 0, filter: filter ? "blur(4px)" : "none", transition: { duration } } };
  return (
    <motion.h1 variants={container} initial="hidden" animate="visible" className={className}>
      {arr.map((w, i) => <motion.span key={i} variants={child} className="inline-block">{w}&nbsp;</motion.span>)}
    </motion.h1>
  );
};
```

Related text components share this stagger idea: `flip-words` (cross-fade cycles),
`typewriter-effect`, `encrypted-text` (gibberish→reveal), `container-text-flip`,
`layout-text-flip`, `text-hover-effect` (x.ai-style outline gradient on hover).

### Recipe F — SVG path beams (Background Beams / Tracing Beam)

Beams travel along SVG `<path>` via animated `pathLength` (0→1) with staggered
delays. `motion.path` exposes `pathLength` as an animatable prop. `tracing-beam`
varies beam *length* with scroll speed instead.

```tsx
<motion.path d="M -50 200 C 50 150 150 250 250 200 ..." stroke="url(#g)" strokeWidth="2"
  initial={{ pathLength: 0, opacity: 0 }}
  animate={{ pathLength: 1, opacity: [0, 1, 0] }}
  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay }} />
```

## Tokens & scales

- **3D rotation cap:** ±15–20deg (`"17deg"` is the Aceternity default). More looks nauseating.
- **Perspective:** `1000px` on the outer stage. Lower = stronger 3D, higher = flatter.
- **Spring for pointer follow:** `stiffness: 100–150, damping: 10–20`. Lower damping = more wobble.
- **Stagger:** `staggerChildren: duration * 0.3–0.4`, `delayChildren: 0.04 * index`.
- **Ambient loop durations:** spotlight reveal `2s ease ... forwards`; meteors `5s linear infinite`; beams `3–6s easeInOut infinite`.
- **Effect blur:** traveling glows use `blur-xl` / `blur-2xl` to read as light, not shapes.
- **Effect layer:** always `absolute inset-0 -z-10 pointer-events-none` (or `absolute` + explicit z behind content).
- **Border radius default:** `1.75rem` (matches shadcn card). Keep consistent.

## Anti-patterns to avoid (anti-AI-slop)

1. **Don't animate everything.** Aceternity pages work because *one* hero effect carries the section and the rest is calm. Stacking spotlight + beams + meteors + wobble + moving border on a single view is slop — it triggers, it never composes.
2. **Don't put the effect above content.** Effect layers must be `pointer-events-none` and behind content. A spotlight that eats clicks is a bug.
3. **Don't use Motion where CSS suffices.** Infinite ambient loops as `useAnimationFrame` loops waste main-thread time and battery. Use `@keyframes` + `prefers-reduced-motion` guard for anything ambient.
4. **Don't drop `prefers-reduced-motion`.** Wrap motion in a check or gate keyframes with `motion-safe:`/`motion-reduce:` Tailwind variants. Premium ≠ inaccessible.
5. **Don't forget `transformStyle: "preserve-3d"`.** Missing it on any ancestor flattens 3D depth to nothing — the #1 reason a ported 3D card "doesn't pop."
6. **Don't hardcode positions for meteor/beam counts.** Randomize `animationDelay` and start offsets per instance, or N meteors move in lockstep and look fake.
7. **Don't skip the `cn()` forward.** If you bake classes inline and ignore the consumer's `className`, the component isn't reusable. Always `cn(base, className)`.
8. **Don't ship huge SVG glow filters uncapped.** Heavy `feGaussianBlur`/`feTurbulence` filters (squiggly-text, noise-background, aurora) are GPU-expensive — scope them to small areas or gate on visibility.
9. **Don't use these for primary navigation/forms.** Floating navbars and gooey inputs are demos; for real app chrome prefer tested a11y primitives and layer Aceternity aesthetics on top.
10. **Don't blindly `npx add` then not read.** The source is *yours*. Read it, trim what you don't need, and align props to your app before shipping.

## Dependencies (the standard Aceternity stack)

- **react** + **next.js** (most demos assume App Router; works in any React)
- **tailwindcss** v3 or v4 (v4 uses `@theme inline` for custom animations; v3 uses `tailwind.config.js` `theme.extend.keyframes/animation`)
- **motion** (`motion/react`) — the current name; `framer-motion` is the legacy import path, equivalent API
- **clsx** + **tailwind-merge** → the `cn()` util
- Per-component extras: `react-syntax-highlighter` (code-block, terminal), `next-themes` (dark mode), sometimes `three`/`mini.glb` (globe), `usehooks-ts` (viewport tracking)

## Catalog at a glance

The full 109-component catalog with categories, effect type, and engine
(CSS-keyframe vs Motion) is in `references/component-catalog.md`. Use it to
pick the right component by intent (hero background, card, text, navigation,
loader) before reading its specific recipe above.

## Quick-pick by intent

- **Hero background:** Spotlight, Background Beams (+ Collision), Meteors, Aurora Background, Wavy/Vortex Background, Shooting Stars, Grid & Dot Backgrounds, Sparkles.
- **Hero scroll:** Hero Parallax, Container Scroll Animation, Macbook Scroll, Tracing Beam, Sticky Scroll Reveal, Timeline.
- **Cards (interactive):** 3D Card Effect, Wobble Card, Glare Card, Comet Card, Evervault Card, Draggable Card, Card Spotlight, Focus Cards, Expandable Cards, Card Stack, Card Hover Effect.
- **Text reveals:** Text Generate, Flip Words, Typewriter, Encrypted Text, Container Text Flip, Layout Text Flip, Text Hover Effect, Pointer Highlight, Colourful Text, Squiggly Text, Canvas Text.
- **Navigation:** Floating Dock, Floating Navbar, Resizable Navbar, Navbar Menu, Sidebar, Sticky Banner, Notch.
- **Buttons:** Moving Border, Hover Border Gradient, Magnetic Button, Stateful Button, Tailwind CSS Buttons, Glowing Effect.
- **Tooltips / pointers:** Animated Tooltip, Tooltip Card, Following Pointer, Link Preview.
- **Loaders:** Loaders, Multi Step Loader.
- **Containers/compare:** Lens, Compare, SVG Mask Effect, Container Cover, Bento Grid, Layout Grid, Background Boxes.
- **Images/media:** Images Slider, Apple Cards Carousel, Infinite Moving Cards, Parallax Scroll, Pixelated Canvas, Dither Shader, Webcam Pixel Grid, ASCII Art, Code Block, Terminal, Keyboard.