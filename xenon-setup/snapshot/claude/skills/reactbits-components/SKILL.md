---
disable-model-invocation: true
name: reactbits-components
description: Add polished animated React UI (text reveals, backgrounds, loaders, toggles, cards) using the ReactBits catalog — pick the right variant, install it, wire props, and avoid the common pitfalls.
---

# ReactBits Components — Animated React UI Reference

ReactBits (`reactbits.dev`, repo `DavidHDev/react-bits`, MIT + Commons Clause) is a curated library of **~139 copy-paste animated React components** across four categories: Text Animations (23), Animations (31), Components (40), Backgrounds (45). Each component ships in four source variants (JS/TS × CSS/Tailwind). Components are **copied into your repo** (not installed as a dependency), so you own and edit the source directly.

> The full per-component catalog with CLI IDs, props, and animation approach lives in [`references/component-catalog.md`](./references/component-catalog.md). This file is the methodology and recipe layer; reach for the catalog when you need to pick a specific component.

## When to invoke

Invoke this skill when the task involves adding motion, life, or "wow" to a React UI and one of these is true:
- The user asks for an animated background, a text reveal/typewriter/glitch/decrypt effect, a magnifying dock, a spotlight/tilt card, a scroll-triggered entrance, or a cursor effect.
- The user mentions "reactbits", "react-bits", "react bits", or links a reactbits.dev component page.
- You're about to hand-roll a CSS keyframe animation or reach for a heavy animation library for an effect ReactBits already ships copy-paste.

Do NOT invoke for: static, content-first UI where animation adds noise; accessibility-critical flows where motion must be minimal (prefer `prefers-reduced-motion` guards); non-React targets (there are official Vue/Svelte ports — point the user there instead).

## Core principles

1. **Copy-paste, not a dependency.** Components land as source files in your codebase. Customize via props first; edit the copied source when props are insufficient. Never `npm install react-bits`.
2. **Pick the variant that matches your stack.** Default to **TS + Tailwind** (`ts-tailwind`). Use `ts-default` if you have no Tailwind. The four variants are kept in sync — pick once and stay consistent within a file.
3. **Match the animation tech to the job.** ReactBits uses five distinct methodologies. Choosing the wrong one is the #1 source of bugs (missing plugins, missing keyframes, WebGL context leaks):
   - **GSAP + ScrollTrigger** — scroll-linked reveals, splits, marquees tied to scroll velocity. Requires `gsap`, `@gsap/react`, and explicit `gsap.registerPlugin(...)`.
   - **Motion (Framer)** — declarative enter/exit/stagger, spring counters. Import from `motion/react` (Motion v11+), not `framer-motion`.
   - **Pure CSS keyframes (Tailwind config)** — borders, sheens, gradients. Requires adding the component's keyframes to `tailwind.config.js` or they silently do nothing.
   - **Pointer-tracked state** — spotlight/tilt cards. No animation lib; uses `requestAnimationFrame`-free `onMouseMove` + `getBoundingClientRect`.
   - **WebGL / GLSL (ogl or three.js)** — shader backgrounds (Aurora, LiquidChrome, PlasmaWave, Iridescence). Needs a `<canvas>`, a `requestAnimationFrame` loop, and careful context-loss cleanup.
4. **Respect fonts and layout before splitting text.** GSAP `SplitText` measures glyph boxes; if a web font hasn't loaded it splits on fallback metrics and reflows when the font swaps in. The library guards with `document.fonts.ready` — keep that guard when you edit.
5. **Reduced motion is your responsibility.** Most components don't ship a `prefers-reduced-motion` branch. Wrap heavy WebGL/scroll animations in a `matchMedia('(prefers-reduced-motion: reduce)')` check and fall back to the static end state.
6. **One hero animation per viewport.** Two WebGL backgrounds or two cursor trackers on screen fight for the main thread and the compositor. Use at most one full-bleed shader background and one cursor effect per route.

## Installation

```
# shadcn (preferred if you use shadcn/ui)
npx shadcn@latest add https://reactbits.dev/r/<Component>-<LANG>-<STYLE>

# jsrepo
npx jsrepo@latest add https://reactbits.dev/r/<Component>-<LANG>-<STYLE>
```
- `<LANG>` = `JS` | `TS`, `<STYLE>` = `CSS` | `TW`.
- Example: `npx shadcn@latest add https://reactbits.dev/r/SplitText-TS-TW`
- Page URLs are kebab-case (`/text-animations/split-text`); CLI IDs are PascalCase (`SplitText`).

Install the animation dependency the component needs (see the dependency map at the bottom of the catalog) **before** the component will run.

## Recipes — the five methodologies

### 1. GSAP + ScrollTrigger — scroll reveal (SplitText, AnimatedContent)

Pattern: register plugins once at module top, guard on font load, use `useGSAP` for scoped cleanup, build the `ScrollTrigger` inside the effect, and `revert()`/`kill()` on teardown.

```tsx
import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

// SplitText props (TS-TW variant):
// text, className, delay=50(ms), duration=1.25, ease='power3.out',
// splitType='chars'|'words'|'lines'|'words, chars', from={opacity:0,y:40},
// to={opacity:1,y:0}, threshold=0.1, rootMargin='-100px',
// tag, textAlign, onLetterAnimationComplete

<SplitText
  text="Ship memorable interfaces"
  splitType="chars"
  delay={40}
  duration={1.1}
  from={{ opacity: 0, y: 50 }}
  to={{ opacity: 1, y: 0 }}
  onLetterAnimationComplete={() => console.log('done')}
/>
```
Gotchas:
- `splitType: 'lines'` needs `autoSplit` (set internally) and re-runs on resize; `chars`/`words` don't.
- The `delay` prop is **milliseconds**, converted to `stagger: delay/1000` (seconds). Don't pass seconds.
- `rootMargin` must match `/^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/` or it silently falls back to `0px`.
- Store the `GSAPSplitText` instance on the element (`el._rbsplitInstance`) and `revert()` before re-splitting — re-splitting without reverting leaks DOM nodes.
- Cleanup must `ScrollTrigger.getAll().forEach(st => st.trigger === el && st.kill())` plus `splitInstance.revert()`.

`AnimatedContent` is the generic scroll wrapper (GSAP, no SplitText plugin). Key props: `distance`, `direction` ('vertical'|'horizontal'), `reverse`, `duration`, `ease`, `initialOpacity`, `animateOpacity`, `scale`, `threshold`, `delay`, `disappearAfter`, `disappearDuration`, `container` (scroller element/selector — falls back to `#snap-main-container` then window), `onComplete`. It renders children `invisible` and reveals on enter — so never wrap content that must be visible without JS.

### 2. Motion (Framer) — spring counters (CountUp), enter/exit

Import from `motion/react` in Motion v11+. Pattern: drive a `useMotionValue` through a `useSpring`, subscribe, and write to the DOM via `ref.current.textContent` (not a re-render) for 60fps.

```tsx
import { useInView, useMotionValue, useSpring } from 'motion/react';
// CountUp props: to, from=0, direction='up'|'down', delay, duration=2,
// className, startWhen=true, separator, onStart, onEnd
<CountUp to={12450} from={0} duration={2.5} separator="," />
```
Spring tuning derived from `duration`: `damping = 20 + 40*(1/duration)`, `stiffness = 100*(1/duration)` — shorter durations give stiffer, snappier springs. Decimal places are auto-detected from `from`/`to`; `separator` enables `Intl.NumberFormat` grouping then swaps commas for your separator.

### 3. Pure CSS keyframes via Tailwind config — StarBorder

These components animate with `@keyframes` declared in `tailwind.config.js`. **If you forget the keyframes, the component renders static.** This is the most common "it does nothing" bug.

```tsx
// StarBorder props: color='white', speed='6s', thickness=1, as='button', className, children
<StarBorder as="a" color="#a78bfa" speed="4s" thickness={1} href="/signup">
  Get started
</StarBorder>
```
Required `tailwind.config.js` extension (the component file comments this out — copy it into your real config):
```js
theme: { extend: {
  animation: {
    'star-movement-bottom': 'star-movement-bottom linear infinite alternate',
    'star-movement-top': 'star-movement-top linear infinite alternate',
  },
  keyframes: {
    'star-movement-bottom': { '0%': { transform: 'translate(0%,0%)', opacity: '1' }, '100%': { transform: 'translate(-100%,0%)', opacity: '0' } },
    'star-movement-top': { '0%': { transform: 'translate(0%,0%)', opacity: '1' }, '100%': { transform: 'translate(100%,0%)', opacity: '0' } },
  },
}}
```
`StarBorder` is polymorphic via `as` (defaults to `button`); the gradient "stars" are 300%-wide radial gradients translated along the top/bottom edges. `thickness` sets vertical padding of the border layer.

### 4. Pointer-tracked gradient — SpotlightCard (no animation lib)

Pattern: `onMouseMove` → `getBoundingClientRect()` → store `{x,y}` relative to card → render a `radial-gradient(circle at x y, color, transparent 80%)` overlay whose `opacity` is driven by enter/leave/focus. Transitions the opacity with CSS `transition-opacity duration-500`.

```tsx
// SpotlightCard props: className, spotlightColor='rgba(255,255,255,0.25)', children
<SpotlightCard className="w-80" spotlightColor="rgba(167,139,250,0.35)">
  <h3>Plan</h3><p>Everything in Free, plus teams.</p>
</SpotlightCard>
```
`spotlightColor` is typed as a template literal `` `rgba(${number},${number},${number},${number})` `` — pass a full `rgba()` string, not a hex. While focused (keyboard nav), the component suppresses mouse-driven position updates so keyboard focus isn't visually overridden.

### 5. WebGL / GLSL shader — Aurora (ogl)

Pattern: create an `ogl` `Renderer` (alpha + premultiplied), a single full-screen `Triangle` geometry (delete its `uv` attribute — the shader derives UV from `gl_FragCoord`), a `Program` with `uniforms`, and a `requestAnimationFrame` loop that updates `uTime` and re-reads live prop values from a ref. Cleanup: cancel rAF, remove the canvas, and call `gl.getExtension('WEBGL_lose_context')?.loseContext()`.

```tsx
// Aurora props: colorStops=['#5227FF','#7cff67','#5227FF'], amplitude=1.0,
// blend=0.5, time, speed=1.0  → renders a full-bleed <div>; size from parent.
<div className="fixed inset-0 -z-10">
  <Aurora colorStops={['#6d28d9','#22d3ee','#6d28d9']} amplitude={1.2} blend={0.6} speed={1.1} />
</div>
```
- `colorStops` is exactly 3 hex strings; the GLSL `COLOR_RAMP` macro expects a 3-stop ramp at positions 0 / 0.5 / 1.0.
- The fragment shader uses 2D simplex noise (`snoise`) for the aurora height field; `amplitude` scales it, `blend` widens the `smoothstep` alpha band.
- Live prop updates happen **inside the rAF loop** via `propsRef.current` — the effect deps are deliberately narrow (`[amplitude]`) to avoid re-initializing WebGL on every prop change. Mirror this pattern when adapting: read live props in the loop, don't re-run the effect.
- The container `<div>` is `w-full h-full` — the parent must size it (Aurora reads `offsetWidth/Height`). A parent with zero height yields a zero-size canvas.

## Choosing a component (quick map)

| You want… | Reach for |
|---|---|
| Headline reveal on scroll | `SplitText` (chars) or `BlurText` |
| Counting stat | `CountUp` |
| Cycling phrases | `RotatingText` |
| Hacker/terminal vibe | `DecryptedText`, `GlitchText`, `ScrambledText`, `FaultyTerminal` |
| Scroll-driven marquee | `ScrollVelocity` |
| Generic scroll entrance for any block | `AnimatedContent` or `FadeContent` |
| Animated CTA button border | `StarBorder` |
| Magnetic button | `Magnet` |
| Tilt/spotlight card | `TiltedCard`, `SpotlightCard`, `DecayCard` |
| macOS dock | `Dock` |
| Animated nav indicator | `PillNav`, `GooeyNav`, `FlowingMenu` |
| Hero background, no 3D | `Aurora`, `Silk`, `Plasma`, `Waves`, `Lightning` |
| Hero background, liquid/chrome | `LiquidChrome`, `LiquidEther`, `Iridescence` |
| Hero background, 3D | `Galaxy`, `GridScan`, `Hyperspeed`, `Ballpit`, `DomeGallery` |
| Cursor flourish | `SplashCursor`, `BlobCursor`, `Ribbons`, `ClickSpark`, `Crosshair` |
| Film grain / texture | `Noise`, `Dither` |

## Anti-patterns (anti-AI-slop)

- **Don't `npm install react-bits` or `import from 'react-bits'`.** Components are copy-paste source. An `npm install` will either fail or pull a stale wrapper.
- **Don't forget the `tailwind.config.js` keyframes** for CSS-keyframe components (`StarBorder`, `GradientText`, `ShinyText`). The file ships them commented out — uncomment into your real config.
- **Don't skip `gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)`** at the top of the file. Without registration, GSAP throws `Plugin not registered` at runtime, not at build.
- **Don't pass seconds to `SplitText`'s `delay`** — it's milliseconds (converted internally to a seconds-based `stagger`). `delay={0.05}` is a 50-microsecond stagger and looks broken.
- **Don't re-run the WebGL effect on every prop change.** Shader components narrow their effect deps and read live props in the rAF loop. If you "fix" the dep array to include all props, you'll tear down and rebuild the GL context on every render — visible flicker + context loss.
- **Don't stack two WebGL backgrounds or two cursor trackers** on one screen. Pick one hero. Multiple contexts thrash the compositor.
- **Don't drop the `document.fonts.ready` guard** on text-split components, or you'll split on fallback-metric glyph boxes and reflow when the web font swaps.
- **Don't leave `prefers-reduced-motion` users watching a full shader.** Gate with `window.matchMedia('(prefers-reduced-motion: reduce)')` and render the static end state.
- **Don't pass a hex to `SpotlightCard`'s `spotlightColor`** — it's typed `rgba(...)`. A hex compiles away to the default.
- **Don't forget `force3D: true` / `willChange: 'transform, opacity'`** when adapting GSAP reveals — without GPU compositing hints, long staggers jank on lower-end devices.
- **Don't copy a `ts-tailwind` component into a `ts-default` (no-Tailwind) project** and expect the `animate-*` classes to work. Either switch to the `ts-default` variant or add the keyframes/utility classes yourself.
- **Don't leave the GSAP `ScrollTrigger` scroller unconfigured** in a custom scroll container. `AnimatedContent` falls back to `#snap-main-container` then `window`; if your scroll lives in a different element, pass `container` or scroll will never trigger.

## Performance budget

- One WebGL background per route. `Aurora`-class shaders cost a full-time rAF; two on screen halves your frame budget.
- Prefer CSS-keyframe components (`StarBorder`, `GradientText`) over GSAP/Motion when the animation is constant and not scroll- or pointer-driven — cheaper, no JS per frame.
- `CountUp` writes to `textContent` outside React render (subscription) — keep that pattern; re-rendering on every spring tick defeats the purpose.
- GSAP scroll components set `once: true` so they animate once and release the ScrollTrigger. If you change to `once: false`, also add a cleanup that kills the trigger, or they accumulate across route changes.

## Porting notes

- Official Vue port: `vue-bits.dev`. Official Svelte port: `sveltebits.xyz`. If the user is on Vue/Svelte, point them there rather than hand-porting.
- The four variants are generated from one source; props are identical across variants. Code you write against `ts-tailwind` props works on `ts-default` after swapping classes for inline styles.
- ReactBits components assume React 18+. `useGSAP`, `useInView`, and the GLSL components all rely on concurrent-safe effects.