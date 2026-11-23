---
disable-model-invocation: true
name: animejs-skills
description: Implement Anime.js v4 web animations (timelines, SVG morph/draw, stagger, scroll-driven, draggable, micro-interactions, React integration) when authoring motion for the web.
---

# Anime.js v4 Animation Skill

Anime.js v4 is a modular, tree-shakeable JavaScript animation library. It animates CSS properties, individual CSS transforms, CSS variables, JS object properties, HTML/SVG attributes, and provides timelines, scroll drivers, draggables, SVG utilities, and text splitting. This skill targets **v4** specifically — the API differs substantially from v3 (named imports, `create*` factories, `onScroll`, `createDraggable`, `createScope`, `createLayout`).

## When to invoke this skill

Invoke when the task involves any of: Anime.js, animejs, "animate elements with JS," CSS-property/transform animation, timeline sequencing, staggered reveals, SVG line-drawing or path morphing, motion-path animation, scroll-driven or scroll-synced animation, draggable elements with spring release, text split/typewriter effects, React animation hooks, micro-interactions (hover/modal/accordion/hamburger), or choosing an easing/spring. Also invoke when migrating v3 `anime({...})` call-site code to v4 named-import style.

Do NOT use this skill for: pure CSS `@keyframes` animation, Web Animations API (`element.animate()`) unless comparing, canvas/WebGL particle systems, or non-web runtimes. Anime.js targets DOM/SVG/JS objects in a browser.

## Core principles

1. **Named imports, not a default export.** v4 ships modular functions. `import { animate, createTimeline, stagger, onScroll, createDraggable, createScope, createSpring, createDrawable, morphTo, createMotionPath, splitText, createTimer, createLayout, createAnimatable } from 'animejs';`. For smallest bundles, import from subpaths: `animejs/animation`, `animejs/timeline`, `animejs/timer`, `animejs/scroll`, `animejs/draggable`.
2. **Everything is a value or a from-to pair.** `translateX: 250` animates from current to 250. `translateX: [-100, 0]` animates from -100 to 0. `opacity: [0, 1]` is the canonical fade-in. Use from-to pairs for deterministic, layout-independent reveals — never assume the start state.
3. **Use individual transforms, not `transform:` strings.** Animate `translateX`, `translateY`, `translateZ`, `rotate`, `scale`, `scaleX`, `scaleY`, `skewX`, `skewY`, `perspective` as separate properties. This avoids clobbering other transforms and lets each be tweened independently. Composing `transform: 'translateX(100px) rotate(45deg)'` is a v3 anti-pattern in v4.
4. **Composition controls interruption.** `composition: 'replace'` (default) replaces running tweens on the same property; `'blend'` smoothly blends a new tween into a running one; `'none'` is ignored. Use `'blend'` for smooth re-targeting (e.g., a draggable element that also has a release animation).
5. **`autoplay` can be a scroll driver.** Instead of `autoplay: false` + manual `play()`, pass `autoplay: onScroll({ target, sync, enter, leave })` to bind playback to scroll position. `sync: true` ties progress 1:1 to scroll; omit it for threshold-triggered playback.
6. **Cleanup via `revert()`.** Timelines, scopes, draggables, scroll handlers, and splitText expose `.revert()`. In React, call it in the effect cleanup. Without cleanup, animations leak inline styles and event listeners across route changes/remounts.
7. **`createScope` is the React/FW boundary.** It scopes selector queries to a root, supports `defaults`, `mediaQueries`, and registered methods, and gives you one `.revert()` for everything inside. Always wrap framework animation in a scope.

## Easing & spring scale (the load-bearing tokens)

Easing is the single biggest determinant of perceived quality. Defaults to `outExpo`-family for reveals. Pick deliberately.

**Built-in named eases** — `in|out|inOut` + `Quad|Cubic|Quart|Quint|Sine|Expo|Circ|Back|Elastic|Bounce`. e.g. `outExpo`, `inOutQuad`, `outBack`, `inElastic`. As a rule:
- **Reveals / entrances:** `outExpo`, `outQuint`, `outBack` (slight overshoot for playfulness).
- **Exits / dismissals:** `inQuad`, `inCubic` (accelerate away).
- **Continuous / loops:** `inOutQuad`, `inOutSine` (avoid bounce/elastic on loops — they read as glitches).
- **Precise stops:** `outCubic` or `outQuart` when you need a controlled landing without overshoot.

**Custom eases:**
- `cubicBezier(x1, y1, x2, y2)` — CSS-curve parity.
- `steps(n)` / `steps(n, 'in-place'|'end')` — steppy/typewriter/8-bit feel.
- `createSpring({ stiffness, damping, mass, velocity })` — physics; **must be used as a tween's `ease` or a draggable's `releaseEase`**, not a timeline default. Typical ranges:
  - Snappy UI: stiffness 150–250, damping 12–18, mass 1.
  - Soft/bouncy: stiffness 80–140, damping 8–12.
  - Heavy/resolute: stiffness 300+, damping 20+.

**Spring vs ease rule:** Use springs for momentum-driven release (drag end, physics settle, scroll snap). Use named eases for scripted entrances where you control start/end exactly. Mixing a spring into a timeline's `defaults.ease` does not work as people expect — set `ease` per-tween or via `releaseEase`.

## Duration / stagger scale (concrete tokens)

- **Micro-interaction** (hover, tap, toggle): 150–250 ms, `outQuad`/`outCubic`.
- **Small reveal** (single element, icon): 300–450 ms, `outExpo`.
- **Section/choreographed entrance**: 500–800 ms, `outQuint`/`outExpo`.
- **Page-level hero**: 800–1200 ms, `outExpo`.
- **Looping ambient**: 600–1500 ms, `inOutSine`/`inOutQuad`.

**Stagger step values:**
- Tightly related items (menu, tabs): 30–60 ms.
- List/grid reveal: 50–100 ms.
- Character reveal (splitText): 25–40 ms.
- Wave/ambient grid: 60–120 ms with `loop: true`.

Total cascade time = `(count - 1) * staggerStep + elementDuration`. Keep total under ~1200 ms for entrances; longer feels sluggish. Use `from: 'center'` for symmetric grids, `from: 'first'` for lists reading top-down/left-right, and `[x, y]` coordinates for directional wipes.

## Recipes (copy-paste, named-import v4)

### Fade + slide reveal (the default entrance)
```js
import { animate } from 'animejs';
animate('.reveal', {
  translateY: [24, 0],   // from 24px below
  opacity: [0, 1],
  duration: 600,
  ease: 'outExpo',
});
```

### Staggered list / nav cascade
```js
import { animate, stagger } from 'animejs';
animate('.nav-item', {
  translateY: [-20, 0],
  opacity: [0, 1],
  delay: stagger(60, { from: 'first' }),
  duration: 500,
  ease: 'outQuart',
});
```

### Grid reveal from center (symmetric)
```js
animate('.grid-cell', {
  scale: [0, 1],
  opacity: [0, 1],
  delay: stagger(40, { grid: [10, 10], from: 'center' }),
  duration: 400,
  ease: 'outBack',
});
```

### Timeline with overlap syntax
```js
import { createTimeline, stagger } from 'animejs';
const tl = createTimeline({ defaults: { duration: 600, ease: 'outExpo' } });
tl.label('start')
  .add('.header', { translateY: [-40, 0], opacity: [0, 1] })
  .add('.nav-item', { translateY: [-20, 0], opacity: [0, 1], delay: stagger(50) }, '<+=150')
  .add('.hero-image', { scale: [0.85, 1], opacity: [0, 1] }, '>-=100');
```
Overlap syntax: `'<'` = previous tween start, `'>'` = previous tween end, with offsets `'<+=150'`, `'>-=100'`. Use labels (`tl.label('content')` then `add(..., 'content+=100')`) for readable choreography.

### SVG line draw (signature look)
```js
import { animate, createDrawable, stagger } from 'animejs';
const paths = document.querySelectorAll('svg.path');
animate(Array.from(paths).map(createDrawable), {
  draw: ['0 0', '0 1'],     // normalized start->end of stroke
  delay: stagger(150),
  duration: 1800,
  ease: 'inOutQuad',
});
```

### SVG morph between paths
```js
import { animate, morphTo } from 'animejs';
animate('#shape', {
  d: morphTo('#target-shape'),
  duration: 1000,
  ease: 'inOutQuad',
});
```

### Motion path (element follows an SVG path)
```js
import { animate, createMotionPath } from 'animejs';
animate('.mover', {
  ...createMotionPath('#road-path'),
  duration: 5000,
  ease: 'linear',
  loop: true,
});
```

### Scroll reveal (threshold-triggered)
```js
import { animate, onScroll } from 'animejs';
animate('.reveal', {
  translateY: [60, 0],
  opacity: [0, 1],
  duration: 800,
  ease: 'outExpo',
  autoplay: onScroll({ target: '.reveal', enter: 'bottom 80%' }),
});
```

### Scroll-synced progress / parallax (progress tied 1:1 to scroll)
```js
animate('.progress-fill', {
  scaleX: [0, 1],
  transformOrigin: '0% 50%',
  autoplay: onScroll({ container: document.documentElement, sync: true }),
});
animate('.parallax', {
  translateY: [0, -200],
  autoplay: onScroll({ target: '.parallax-section', sync: true, ease: 'linear' }),
});
```

### Draggable with spring release
```js
import { createDraggable, createSpring } from 'animejs';
createDraggable('.handle', {
  container: '.bounds',
  releaseEase: createSpring({ stiffness: 180, damping: 15, mass: 1 }),
  onGrab: (s) => s.target.classList.add('dragging'),
  onRelease: (s) => s.target.classList.remove('dragging'),
});
```

### Draggable snap-to-grid / carousel
```js
createDraggable('.track', {
  x: true, y: false,
  snap: (x) => Math.round(x / slideWidth) * slideWidth,
  onSnap: (s) => updateIndicator(Math.abs(s.x / slideWidth)),
});
```

### Text reveal (chars/words/lines)
```js
import { splitText, animate, stagger } from 'animejs';
const { chars } = splitText('.title', { chars: true });
animate(chars, {
  translateY: [20, 0],
  opacity: [0, 1],
  delay: stagger(30),
  duration: 500,
  ease: 'outQuad',
});
// Typewriter: duration ~10, delay stagger(50), ease 'steps(1)'.
```

### React with createScope (the correct pattern)
```jsx
import { useRef, useEffect } from 'react';
import { animate, stagger, createScope } from 'animejs';

function AnimatedList({ items }) {
  const root = useRef(null);
  const scope = useRef(null);
  useEffect(() => {
    scope.current = createScope({ root: root.current }).add(() => {
      animate('.list-item', {
        translateY: [-40, 0], opacity: [0, 1],
        delay: stagger(50), duration: 450, ease: 'outExpo',
      });
    });
    return () => scope.current.revert();   // mandatory cleanup
  }, [items]);
  return <ul ref={root}>{items.map(i => <li key={i.id} className="list-item">{i.name}</li>)}</ul>;
}
```

### Modal open/close as a timeline (returnable for chaining)
```js
function openModal() {
  animate('.modal-backdrop', { opacity: [0, 1], duration: 250 });
  animate('.modal-content', { scale: [0.92, 1], opacity: [0, 1], duration: 380, ease: 'outBack' });
}
function closeModal() {
  const tl = createTimeline();
  tl.add('.modal-content', { scale: [1, 0.92], opacity: [1, 0], duration: 200, ease: 'inQuad' })
    .add('.modal-backdrop', { opacity: [1, 0], duration: 200 }, '<+=80');
  return tl;   // await tl.finished if needed
}
```

### Promise chaining (sequential, no timeline)
```js
async function seq() {
  await animate('.a', { translateX: 100 }).then;
  await animate('.b', { translateY: 100 }).then;
  await animate('.c', { scale: 1.5 }).then;
}
```
Note: anime.js animations are thenable; call `.then` (property) or `await` on the animation.

### Responsive via createScope mediaQueries
```js
import { createScope, animate } from 'animejs';
const scope = createScope({
  mediaQueries: { mobile: '(max-width: 768px)', desktop: '(min-width: 769px)' },
});
scope.add(({ matches }) => {
  if (matches.mobile)  animate('.hero', { translateY: [50, 0], duration: 500 });
  else                 animate('.hero', { translateX: [-100, 0], duration: 800 });
});
```

### Animating a JS object (counters, custom renderers)
```js
const counter = { n: 0 };
animate(counter, {
  n: 1000,
  duration: 1500,
  ease: 'outQuart',
  onUpdate: () => { el.textContent = Math.round(counter.n).toLocaleString(); },
});
```

### Modifier (snap to grid mid-tween)
```js
animate('.knob', {
  translateX: { to: 500, modifier: v => Math.round(v / 10) * 10 },
});
```

## Keyframes

Two flavors. Array-of-values animates through each in equal time slices:
```js
animate('.el', { translateY: [0, -30, 0], duration: 600, loop: true });
```
Object keyframes with explicit per-step durations/delays:
```js
animate('.el', {
  translateX: [
    { to: 100, duration: 500 },
    { to: 0,   duration: 500, delay: 200 },
  ],
});
```
Mix only across the same property; mixing keyframe and scalar on the same property is an error.

## Playback control cheatsheet

Every animation/timeline/timer exposes: `play()`, `pause()`, `restart()`, `reverse()`, `alternate()`, `resume()`, `complete()`, `reset()`, `cancel()`, `revert()`, `seek(time)` (ms or `'50%'`), `stretch(ratio)`. Read-only props: `currentTime`, `progress` (0–1), `paused`, `began`, `completed`, `reversed`, `duration`, `targets`. Set `autoplay: false` to drive manually. Use `loop: true`, `alternate: true`, `loopDelay: ms` for ambient motion.

## Engine tuning

`import { engine } from 'animejs';` — `engine.speed` (global time multiplier), `engine.fps`, `engine.timeUnit` (`'ms'` default, or `'s'`), `engine.precision`, `engine.pauseOnDocumentHidden` (pause when tab hidden — keep `true` to save CPU). `engine.pause()` / `engine.resume()` for global control.

## Anti-patterns to avoid (anti-AI-slop)

- **Don't assume the start state.** Always use from-to pairs (`[from, to]`) for entrances/exits so the animation is deterministic regardless of CSS. Animating `translateX: 100` only works if you know the current value is 0.
- **Don't animate the `transform` shorthand string.** Use `translateX`/`rotate`/`scale` individually. Shorthand `transform:` overwrites and can't compose with other tweens.
- **Don't put a spring in `timeline.defaults.ease`.** Springs are for per-tween `ease` or `releaseEase`. A timeline default must be a deterministic named ease.
- **Don't skip `revert()` in frameworks.** Without cleanup, splitText leaves wrapper spans, scroll/onScroll leaves listeners, draggable leaves handlers, inline styles persist. Always revert on unmount/unroute.
- **Don't use `bounce`/`elastic` for loops or scroll-sync.** They oscillate around the endpoint and read as jitter on continuous motion. Reserve them for one-shot playful entrances.
- **Don't animate `height: 'auto'`.** Measure `scrollHeight` first, then animate to that pixel value. Animating to `auto` is undefined.
- **Don't re-query DOM inside loops.** Capture targets (and `createDrawable` results) once. Re-running `document.querySelectorAll` each frame leaks and thrashes.
- **Don't mix scroll `sync: true` with `loop`/`alternate`.** Sync ties progress to scroll; loops fight it and produce flicker.
- **Don't forget `transformOrigin` for scale/rotate reveals.** Default `50% 50%` centers scaling; for directional grows set `transformOrigin: '0% 0%'` etc. before animating.
- **Don't use v3 syntax.** `anime({ targets, ... })` and `anime.timeline()` are v3. v4 is `animate(targets, params)` and `createTimeline(params)` then `.add(targets, params, position)`.
- **Don't recreate scroll/draggable handlers in React effects without reverting the previous one.** Use `scope.current.revert()` in cleanup before re-creating.

## Choosing the right primitive

| Need | Use |
|------|-----|
| One element, one shot | `animate()` |
| Sequenced/overlapping multi-element | `createTimeline().add()` |
| Threshold-triggered on scroll | `animate(..., { autoplay: onScroll({ target, enter }) })` |
| Scroll-tied progress (parallax, progress bar) | `autoplay: onScroll({ sync: true })` |
| Drag with physics | `createDraggable` + `createSpring` `releaseEase` |
| SVG stroke draw | `createDrawable()` targets + `draw` property |
| SVG path morph | `morphTo()` as the value of `d` |
| Follow a path | `createMotionPath()` spread into params |
| Text reveal | `splitText()` then `animate(chars/words/lines)` |
| React / scoped + responsive | `createScope({ root, mediaQueries }).add(fn)` |
| Counter / non-DOM | animate a plain JS object, read in `onUpdate` |
| setTimeout replacement synced to rAF | `createTimer({ duration, onUpdate })` |
| Layout enter/exit/swap (FLIP-like) | `createLayout({ root, enterFrom, leaveTo, swapAt })` |

## Quick install / import

```bash
npm install animejs
```
```js
// ES module
import { animate, createTimeline, stagger, onScroll, createDraggable, createScope, createSpring, createDrawable, morphTo, createMotionPath, splitText, createTimer, createLayout } from 'animejs';
// Tree-shakeable subpaths
import { animate } from 'animejs/animation';
import { createTimeline } from 'animejs/timeline';
// CDN (UMD, global `anime`)
// <script src="https://cdn.jsdelivr.net/npm/animejs/dist/bundles/anime.umd.min.js"></script>
```

Bundle (min+gz, approximate): full ~24.5 KB; animation alone +5.2 KB; timeline +0.55 KB; scroll +4.3 KB; draggable +6.4 KB; scope +0.22 KB; svg ~0.35 KB; stagger +0.48 KB; spring ~0.52 KB. Import only what you use.

## References

- `references/api-reference.md` — full per-function parameter tables (animate, createTimeline, createTimer, stagger, onScroll, createDraggable, createScope, createAnimatable, createLayout, SVG utils, splitText, easings, utilities, engine) and method lists. Consult when you need exact parameter names, callback signatures, or method names.
- `references/recipes.md` — the complete recipe catalog (basic, stagger, timeline, scroll, SVG, draggable, text, UI components, React, advanced) with copy-paste code. Consult when you need a named pattern.

## External

- Official docs: https://animejs.com/documentation
- Easing editor: https://animejs.com/easing-editor
- GitHub (upstream): https://github.com/juliangarnier/anime — Anime.js is MIT-licensed.