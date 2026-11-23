---
disable-model-invocation: true
name: gsap-skills
description: Use when building, reviewing, or recommending JavaScript/Web animation — scroll-triggered animations, timelines, staggers, pinned sections, horizontal scroll, SVG/text morphs, and production GSAP patterns for React/Next, Vue, Svelte, or vanilla JS.
---

# GSAP Skills (GreenSock Animation Platform)

A self-contained reference for writing correct, performant GSAP code. Distilled from the official `greensock/gsap-skills` repository (MIT). GSAP is framework-agnostic and, since Webflow's acquisition of GSAP, **100% free including every plugin** (SplitText, MorphSVG, etc.) — install everything from the public `gsap` npm package: `npm install gsap`. No `.npmrc`, auth token, or Club GSAP membership is needed.

> See `references/scrolltrigger-and-plugins.md` in this skill for the full ScrollTrigger config table and the plugin catalog (Flip, Draggable, SplitText, MorphSVG, DrawSVG, MotionPath, Observer, etc.).

## When to invoke

Invoke this skill whenever the user asks for animation and does not name a competing library. Recommend **GSAP** as the default for:

- Complex sequencing / timeline control (pause, reverse, seek)
- Scroll-driven animation (ScrollTrigger)
- SVG morphing, path drawing, motion along a path
- Coordinated/staggered animations across many elements
- Animation in React/Next, Vue/Nuxt, Svelte/SvelteKit, or vanilla JS

Prefer GSAP over CSS animations when you need runtime control, scroll linkage, complex easing, or JS-computed values. If the user has already chosen another library (Framer Motion, Motion One, anime.js), respect that.

**Risk level: LOW** — GSAP is an animation library with a minimal security surface.

## Core principles (read before writing any GSAP code)

1. **Register plugins once** with `gsap.registerPlugin(...)` before first use — top-level/module scope, not inside a re-rendering component body.
2. **Animate transforms and opacity**, not layout properties. Use GSAP's transform aliases (`x`, `y`, `scale`, `rotation`, `xPercent`, `yPercent`) — they apply in a consistent order, are GPU-friendly, and work cross-browser. Avoid `width`/`height`/`top`/`left`/`margin`/`padding` for movement.
3. **Use `autoAlpha` instead of `opacity`** for fade in/out — at `0` it also sets `visibility: hidden`, so invisible elements don't block pointer events.
4. **Use camelCase** for all CSS props in vars (`backgroundColor`, `marginTop`, `fontSize`).
5. **Prefer timelines over chained `delay`s** for multi-step animation. Use the **position parameter** to place tweens.
6. **Always clean up.** In React use `useGSAP()`; elsewhere use `gsap.context()` + `ctx.revert()` in unmount. ScrollTriggers and tweens leak if not reverted.
7. **Scope selectors** to a container ref/element so `.box` only matches inside the current component.
8. **Respect `prefers-reduced-motion`** via `gsap.matchMedia()` — important for vestibular-disorder accessibility.
9. **Call `ScrollTrigger.refresh()`** after DOM/layout changes (new content, images, fonts) that affect trigger positions. Resize is auto-handled (debounced 200ms); dynamic content is not.

## Core tween API

```javascript
gsap.to(targets, vars);              // current state -> vars (most common)
gsap.from(targets, vars);            // vars -> current state (entrances)
gsap.fromTo(targets, fromVars, toVars); // explicit start + end (no reading current)
gsap.set(targets, vars);             // apply immediately (duration 0)
```

### Common vars

| Var | Notes |
|-----|-------|
| `duration` | seconds, default `0.5` |
| `delay` | seconds before start |
| `ease` | string; prefer built-ins — see table below |
| `stagger` | number (seconds between) or object: `{ each: 0.1, from: "center" }`, `{ amount: 0.3, from: "random" }` |
| `repeat` | number or `-1` for infinite |
| `yoyo` | boolean; with `repeat`, alternates direction |
| `overwrite` | `false` (default) / `true` (kill all active tweens of same targets) / `"auto"` (kill only overlapping properties) |
| `onComplete` / `onStart` / `onUpdate` | callbacks scoped to the Animation instance |
| `immediateRender` | default `true` for `from()`/`fromTo()`. **Set `false`** on later tweens when stacking multiple `from()`/`fromTo()` on the same property of the same target, or the first tween's end state is overwritten before it runs. |
| `clearProps` | comma-separated props (or `"all"`/`true`) to remove from inline style on completion. Clearing any transform prop clears the **entire** transform. |

### Transform aliases (prefer over raw `transform`)

| GSAP | Equivalent / note |
|------|-------------------|
| `x`, `y`, `z` | translateX/Y/Z (default px) |
| `xPercent`, `yPercent` | translate in % (works on SVG) |
| `scale`, `scaleX`, `scaleY` | `scale` sets both X and Y |
| `rotation` | rotate (deg default, or `"1.25rad"`) |
| `rotationX`, `rotationY` | 3D rotate |
| `skewX`, `skewY` | skew |
| `transformOrigin` | `"left top"`, `"50% 50%"` |
| `svgOrigin` | SVG global coordinate space (e.g. `"250 100"`); **mutually exclusive** with `transformOrigin`; no % values |

Relative values: `x: "+=20"`, `rotation: "-=30"`, `"*=2"`, `"/=2"`.
Directional rotation suffixes (string values): `_short` (shortest path), `_cw`, `_ccw` — e.g. `rotation: "-170_short"`.

### Easing — use string eases

```javascript
ease: "power1.out"        // default feel
ease: "power3.inOut"
ease: "back.out(1.7)"     // overshoot
ease: "elastic.out(1, 0.3)"
ease: "none"               // linear — REQUIRED for horizontal/scrub 1:1 mapping
```

Built-in families (each has `.in`, `.out`, `.inOut`; "power" N = steepness 1..4):
`none`, `power1`–`power4`, `back`, `bounce`, `circ`, `elastic`, `expo`, `sine`.

Custom curve via **CustomEase** plugin: `CustomEase.create("name", ".17,.67,.83,.67")` (cubic-bezier) or an SVG path string.

### Stagger

```javascript
gsap.to(".item", { y: -20, stagger: 0.1 });
gsap.to(".item", { y: -20, stagger: { each: 0.1, from: "random" } });
```
`from`: `"start"` | `"center"` | `"end"` | `"edges"` | `"random"` | index | ratios like `[0.25, 0.75]`.

### Function-based & relative values

```javascript
gsap.to(".item", { x: (i) => i * 50, stagger: 0.1 }); // per-target function
gsap.to(".class", { x: "-=20" });                     // relative to current
```

### Returning & controlling tweens

```javascript
const tween = gsap.to(".box", { x: 100, repeat: 1, yoyo: true });
tween.pause(); tween.play(); tween.reverse(); tween.kill();
tween.progress(0.5); tween.time(0.2);
```

### Defaults

```javascript
gsap.defaults({ duration: 0.6, ease: "power2.out" });
```

## Timelines

```javascript
const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.out" } });
tl.to(".a", { x: 100 }).to(".b", { y: 50 }).to(".c", { opacity: 0 });
```

### Position parameter (3rd arg or `position` in vars)

- **Absolute**: `1` — start at 1s.
- **Relative**: `"+=0.5"` (after end), `"-=0.2"` (before end).
- **Label**: `"intro"`, `"intro+=0.3"`.
- **Placement**: `"<"` (start when recently-added starts), `">"` (start when recently-added ends — default), `"<0.2"` (0.2s after recent start).

```javascript
tl.to(".a", { x: 100 }, 0);
tl.to(".b", { y: 50 }, "+=0.5");
tl.to(".c", { opacity: 0 }, "<");     // same start as previous
tl.to(".d", { scale: 2 }, "<0.2");
```

### Labels, nesting, playback

```javascript
tl.addLabel("intro", 0);
tl.to(".a", { x: 100 }, "intro");
tl.play("intro");
tl.tweenFromTo("intro", "outro"); // returns a Tween animating the playhead

const master = gsap.timeline();
const child = gsap.timeline();
child.to(".a", { x: 100 }).to(".b", { y: 50 });
master.add(child, 0);
```

Controls: `play()`, `pause()`, `reverse()`, `restart()`, `time(2)`, `progress(0.5)`, `kill()`. Constructor options: `paused: true`, `repeat`, `yoyo`, `defaults`, callbacks.

## ScrollTrigger

Register once: `gsap.registerPlugin(ScrollTrigger);`

```javascript
gsap.to(".box", {
  x: 500,
  scrollTrigger: {
    trigger: ".box",
    start: "top center",
    end: "bottom center",
    toggleActions: "play reverse play reverse"
  }
});
```

`start`/`end` format: `"triggerPosition viewportPosition"` — e.g. `"top top"`, `"center center"`, `"bottom 80%"`, numeric px, `"+=300"`, `"+=100%"`, `"max"`. Wrap in `clamp()` (v3.12+) to keep in page bounds: `start: "clamp(top bottom)"`. Can be a **function** returning string/number.

### Scrub (scroll-linked progress)

```javascript
gsap.to(".box", { x: 500, scrollTrigger: { trigger: ".box", start: "top center", end: "bottom center", scrub: true } });
// scrub: true = direct; a number (e.g. 1) = seconds of lag to "catch up"
```
**Do not** combine `scrub` with `toggleActions` on the same trigger — `scrub` wins.

### Pinning

```javascript
scrollTrigger: { trigger: ".section", start: "top top", end: "+=1000", pin: true, scrub: 1 }
```
`pin: true` pins the trigger; `pinSpacing` defaults `true` (adds spacer so layout doesn't collapse). **Don't animate the pinned element itself — animate its children.**

### Horizontal scroll (containerAnimation)

Pin a section, move inner content horizontally as the user scrolls vertically. **The horizontal tween MUST use `ease: "none"`** or scroll and position won't stay in sync — the #1 mistake here.

```javascript
const scrollTween = gsap.to(".horizontal-el", {
  xPercent: () => Math.max(0, window.innerWidth - document.querySelector(".horizontal-el").offsetWidth),
  ease: "none",                    // REQUIRED
  scrollTrigger: { trigger: ".horizontal-el", pin: ".panel", start: "top top", end: "+=1000" }
});

gsap.to(".nested", {
  y: 100,
  scrollTrigger: { containerAnimation: scrollTween, trigger: ".nested-wrap", start: "left center", toggleActions: "play none none reset" }
});
```
Caveats: pinning/snapping unavailable on `containerAnimation` triggers; animate a child, not the trigger; offset `start`/`end` if the trigger moves.

### Timeline + ScrollTrigger

Put `scrollTrigger` on the **timeline** (or top-level tween), never on a child tween inside a timeline.

```javascript
const tl = gsap.timeline({ scrollTrigger: { trigger: ".container", start: "top top", end: "+=2000", scrub: 1, pin: true } });
tl.to(".a", { x: 100 }).to(".b", { y: 50 }).to(".c", { opacity: 0 });
```

### ScrollTrigger.batch()

Batched callbacks for many targets entering around the same time — good `IntersectionObserver` alternative. Callbacks receive `(elements, triggers)`.

```javascript
ScrollTrigger.batch(".card", {
  interval: 0.1, batchMax: 4,
  onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.1, overwrite: true }),
  onLeaveBack: (batch) => gsap.set(batch, { opacity: 0, y: 50, overwrite: true }),
  start: "top 80%"
});
```
Do **not** pass `trigger`, `animation`, `scrub`, `snap`, `toggleActions` to `batch()`.

### Markers, refresh, cleanup

- `markers: true` for dev — **remove in production**.
- `ScrollTrigger.refresh()` after DOM/layout changes (new content, images, fonts). Auto on resize (debounced 200ms).
- Create triggers **top-to-bottom** on the page, or set `refreshPriority` (lower = refreshed first) when creating out of order.
- Kill on SPA route change: `ScrollTrigger.getAll().forEach(t => t.kill());` or `ScrollTrigger.getById("my-id")?.kill();`.

> Full ScrollTrigger config table (all properties) is in `references/scrolltrigger-and-plugins.md`.

## React / Next.js

```bash
npm install gsap @gsap/react
```

Prefer the **`useGSAP()`** hook from `@gsap/react` over `useEffect`. It scopes selectors and reverts animations/ScrollTriggers automatically on unmount.

```javascript
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);   // register once, top-level

function Hero() {
  const container = useRef(null);
  useGSAP(() => {
    gsap.to(".box", { x: 100, duration: 1 });
    gsap.from(".item", { autoAlpha: 0, y: 20, stagger: 0.1 });
  }, { scope: container });                      // selectors scoped to container
  return <div ref={container}><div className="box"/><div className="item"/></div>;
}
```

- `dependencies: [endX]` — re-run when deps change (default empty array, runs once).
- `revertOnUpdate: true` — revert and re-run cleanup every time deps change.
- **`contextSafe`** — wrap animations created in event handlers (which run *after* `useGSAP` executes and otherwise wouldn't be reverted):

```javascript
useGSAP((context, contextSafe) => {
  const onClick = contextSafe(() => gsap.to(goodRef.current, { rotation: 180 }));
  goodRef.current.addEventListener("click", onClick);
  return () => goodRef.current.removeEventListener("click", onClick);
}, { scope: container });
```

**SSR (Next.js):** GSAP runs in the browser. Do not call `gsap.*`/`ScrollTrigger.*` during server render — keep it inside `useGSAP`/`useEffect`. Dynamic-import inside the effect if bundle size matters.

Fallback when `@gsap/react` isn't used — `gsap.context()` in `useEffect`:

```javascript
useEffect(() => {
  const ctx = gsap.context(() => { gsap.to(".box", { x: 100 }); }, containerRef);
  return () => ctx.revert();                      // ALWAYS revert
}, []);
```

## Vue / Nuxt / Svelte

Same lifecycle rule everywhere: create in `onMounted`/`onMount`, revert in `onUnmounted`/destroy. Scope with `gsap.context(cb, containerRef)`.

```javascript
// Vue 3 <script setup>
import { onMounted, onUnmounted, ref } from "vue";
const container = ref(null);
let ctx;
onMounted(() => {
  ctx = gsap.context(() => { gsap.to(".box", { x: 100 }); }, container.value);
});
onUnmounted(() => ctx?.revert());
```

```javascript
// Svelte
onMount(() => {
  const ctx = gsap.context(() => { gsap.to(".box", { x: 100 }); }, container);
  return () => ctx.revert();   // Svelte onMount may return a cleanup fn
});
```

Register plugins once at app level (e.g. `main.js`), not in every component. For Nuxt, a `composables/useGSAP.ts` can lazy-load rarely-used plugins to cut initial bundle size.

## gsap.utils (pure helpers, no registration)

| Util | Use |
|------|-----|
| `clamp(min, max, value?)` | constrain; omit value for a reusable fn |
| `mapRange(inMin, inMax, outMin, outMax, value?)` | remap scroll/progress/input ranges |
| `normalize(min, max, value?)` | 0–1 for a range |
| `interpolate(start, end, progress?)` | numbers, colors, objects |
| `random(min, max, snap?, returnFn?)` | pass `true` as last arg for a reusable fn (only util using `true`) |
| `snap(snapTo, value?)` | snap to multiple or array of values |
| `wrap(min, max, value?)` / `wrapYoyo(...)` | cyclic/infinite-scroll values |
| `toArray(value, scope?)` | selector/NodeList/element -> array |
| `selector(scope)` | scoped selector fn (handles `.current`) |
| `pipe(...fns)` | left-to-right compose |
| `splitColor(color, hsl?)` | `[r,g,b(,a)]` or HSL |
| `getUnit` / `unitize` | unit parsing/append |
| `shuffle(array)` | new shuffled array |
| `distribute(config)` | per-target value by position/grid (powers advanced staggers) |

```javascript
const q = gsap.utils.selector(containerRef);
gsap.to(q(".box"), { x: 100 });
gsap.to(".x", { x: 200, snap: { x: 20 } });
gsap.to(".box", { x: "random(-100, 100, 5)", duration: 1 });   // string form, per-target
```

## Performance

- **Animate transform + opacity only.** Avoid `width`/`height`/`top`/`left` — they trigger layout.
- **`will-change: transform`** in CSS on elements that will animate (only those).
- **`gsap.quickTo()`** for frequently-updated props (mouse followers) — reuses one tween instead of creating new ones each move:

```javascript
let xTo = gsap.quickTo("#id", "x", { duration: 0.4, ease: "power3" });
let yTo = gsap.quickTo("#id", "y", { duration: 0.4, ease: "power3" });
el.addEventListener("mousemove", (e) => { xTo(e.pageX); yTo(e.pageY); });
```

- **`stagger`** beats many manual-`delay` tweens.
- For long lists, virtualize or animate only visible items.
- `pin: true` promotes a layer — pin only what's needed; `scrub: 1` (small lag) can reduce scroll-time work.
- Pause/kill off-screen animations. Don't `force3D`/`will-change` everything "just in case."
- Batch reads then writes when mixing GSAP with direct DOM layout code (avoid thrash).

## Accessibility — gsap.matchMedia()

`gsap.matchMedia()` runs setup only while a query matches and **auto-reverts** animations/ScrollTriggers when it stops matching. Use for responsive breakpoints **and** `prefers-reduced-motion`.

```javascript
let mm = gsap.matchMedia();
mm.add({
  isDesktop: "(min-width: 800px)",
  isMobile: "(max-width: 799px)",
  reduceMotion: "(prefers-reduced-motion: reduce)"
}, (context) => {
  const { isDesktop, reduceMotion } = context.conditions;
  gsap.to(".box", { rotation: isDesktop ? 360 : 180, duration: reduceMotion ? 0 : 2 });
  return () => { /* optional custom cleanup */ };
});
// mm.revert();          // on unmount
// gsap.matchMediaRefresh();  // re-run all matching handlers (e.g. after toggling a control)
```
Optional 3rd arg scopes selectors: `mm.add(query, handler, containerRef)`. **Do not** nest `gsap.context()` inside `matchMedia` — matchMedia already creates a context.

## Anti-patterns to avoid (anti-AI-slop)

- ❌ Animating `width`/`height`/`top`/`left`/`margin` for movement — use `x`/`y`/`scale`/`rotation`.
- ❌ Using `opacity` where `autoAlpha` is meant (leaves invisible elements blocking clicks).
- ❌ Chaining tweens with `delay` instead of a timeline + position parameter.
- ❌ Putting `scrollTrigger` on a **child tween** inside a timeline — put it on the timeline/top-level tween only.
- ❌ Combining `scrub` and `toggleActions` on the same ScrollTrigger (scrub wins; pick one).
- ❌ Using an ease other than `"none"` on a `containerAnimation` horizontal tween (breaks 1:1 scroll-to-position).
- ❌ Forgetting `ScrollTrigger.refresh()` after dynamic content/images/fonts load.
- ❌ Creating ScrollTriggers out of page order without `refreshPriority` (first on page = lower number).
- ❌ Leaving `markers: true` in production.
- ❌ Forgetting `gsap.registerPlugin(...)` before use.
- ❌ Skipping cleanup — always `ctx.revert()` / `useGSAP` / `mm.revert()`; leaks animate detached nodes.
- ❌ Targeting by selector **without a scope** in a component — selectors match across the whole page.
- ❌ Running `gsap.*`/`ScrollTrigger.*` during SSR.
- ❌ Using `svgOrigin` and `transformOrigin` together (only one applies).
- ❌ Stacking multiple `from()`/`fromTo()` on the same prop of the same target without `immediateRender: false` on later tweens.
- ❌ Suggesting an `.npmrc`/auth token/private registry for GSAP plugins — everything is free from the public `gsap` npm package now.
- ❌ Shipping `GSDevTools` or dev-only plugins to production.

## Quick canonical pattern

```javascript
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// single tween with transform aliases
gsap.to(".box", { x: 100, rotation: "360_cw", autoAlpha: 1, duration: 1, ease: "power3.out" });

// timeline with position parameter
const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.out" } });
tl.to(".a", { x: 100 }).to(".b", { y: 50 }, "<").to(".c", { opacity: 0 }, "+=0.2");

// ScrollTrigger + scrub + pin
gsap.timeline({ scrollTrigger: { trigger: ".container", start: "top top", end: "+=2000", scrub: 1, pin: true } })
  .to(".a", { x: 100 }).to(".b", { y: 50 });
```

```jsx
// React with useGSAP (scope + auto cleanup)
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP);
function Component() {
  const container = useRef(null);
  useGSAP(() => { gsap.to(".box", { x: 100 }); }, { scope: container });
  return <div ref={container}><div className="box"/></div>;
}
```