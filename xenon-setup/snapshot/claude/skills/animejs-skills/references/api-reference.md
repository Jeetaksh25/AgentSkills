# Anime.js v4 API Reference

Consult for exact parameter names, callback signatures, and method lists. SKILL.md holds the principles and recipes; this file holds the parameter tables.

## animate(targets, parameters)

Animates properties of targeted elements. Targets: CSS selector string, DOM element, NodeList, Array of elements, JS object, or array mixing these.

### Animatable properties
- **CSS properties**: opacity, backgroundColor, borderRadius, width, height, etc.
- **Individual CSS transforms**: translateX/Y/Z, rotate, rotateX/Y/Z, scale, scaleX/Y, skew, perspective. (Do not use the `transform` shorthand.)
- **CSS variables**: `--my-var`.
- **JS object properties**: any numeric/string property.
- **HTML attributes**: any attribute (e.g. `width`, `height`).
- **SVG attributes**: `d`, `cx/cy/r`, `points`, `strokeWidth`, `fill`, `stroke`, etc.

### Tween value types
- Numerical / unitless: `250`
- Unit conversion: `'100%'`, `'2rem'`, `'1turn'`
- Relative: `'+=100'`, `'-=50'`, `'*=2'`
- From-to pair: `[from, to]` — `[-100, 0]`, `['#000', '#fff']`
- Color: hex `'#3498db'`, `rgb(...)`, `hsl(...)`, or array of two colors
- Function-based: `(el, i, total) => i * 50` — receives element, index, total count

### Per-property parameters (object form)
```js
animate('.el', {
  translateX: {
    to: 500,            // target value
    from: 0,            // start value (optional)
    delay: 100,         // per-property delay (ms)
    duration: 800,      // per-property duration (ms)
    ease: 'outExpo',    // per-property ease
    composition: 'replace', // 'replace' | 'blend' | 'none'
    modifier: v => Math.round(v / 10) * 10, // transform output value
  }
});
```

### Keyframes
Array (equal slices):
```js
animate('.el', { translateY: [0, -30, 0], duration: 600, loop: true });
```
Object keyframes (explicit timing per step):
```js
animate('.el', {
  translateX: [
    { to: 100, duration: 500 },
    { to: 0, duration: 500, delay: 200 },
  ],
});
```

### Playback settings (top-level)
`delay`, `duration` (default 1000), `loop` (true | number), `loopDelay`, `alternate` (bool), `reversed` (bool), `autoplay` (bool | onScroll driver), `frameRate`, `playbackRate`, `playbackEase`, `persist`.

### Callbacks
`onBegin`, `onComplete`, `onBeforeUpdate`, `onUpdate`, `onRender`, `onLoop`, `onPause`. Animation is thenable — `await animate(...)` or `animate(...).then(...)`.

### Methods
`play`, `pause`, `restart`, `reverse`, `alternate`, `resume`, `complete`, `reset`, `cancel`, `revert`, `seek(time)` (ms or `'50%'`), `stretch(ratio)`, `refresh`.

### Properties
`currentTime`, `progress` (0–1), `paused`, `began`, `completed`, `reversed`, `duration`, `targets`.

---

## createTimeline(parameters)

Synchronizes multiple animations on one clock.

### Parameters
`defaults` (object applied to all `.add` calls), `delay`, `loop`, `loopDelay`, `alternate`, `reversed`, `autoplay`, `frameRate`, `playbackRate`, `playbackEase`.

### Time positions (third arg of `.add`)
- Absolute ms: `500`
- `'<'` — start of previous added tween
- `'>'` — end of previous added tween
- With offsets: `'<+=150'`, `'>-=100'`, `'<=+200'`
- Label: `'content'`, `'content+=100'`

### Methods
`add(targets, params, position)`, `set(targets, params, position)` (instant set, no tween), `call(fn, position)`, `sync(animatableOrTimeline, position)`, `label(name, position?)`, `remove(target)`, `init`, plus playback controls (`play`, `pause`, `restart`, `reverse`, `alternate`, `resume`, `complete`, `reset`, `cancel`, `revert`, `seek`, `stretch`, `refresh`).

### Callbacks
`onBegin`, `onComplete`, `onBeforeUpdate`, `onUpdate`, `onRender`, `onLoop`, `onPause`. Thenable.

---

## createTimer(parameters)

rAF-synced alternative to setTimeout/setInterval that stays in sync with anime animations.

### Parameters
`duration`, `delay`, `loop`, `loopDelay`, `alternate`, `reversed`, `autoplay`, `frameRate`, `playbackRate`, `onBegin`, `onUpdate`, `onLoop`, `onComplete`, `onPause`. Methods: same playback controls as animate. Use for driving custom renderers or scheduling within a timeline.

---

## stagger(value, parameters)

Returns a function used as a `delay` (or value) that distributes timing across targets.

### Parameters
- `value`: number, or `[min, max]` for a range, or array
- `start`: ms offset before staggering begins
- `from`: `'first'` | `'last'` | `'center'` | `'random'` | index | `[x, y]` grid coords
- `reversed`: bool
- `ease`: easing applied across the stagger distribution
- `grid`: `[cols, rows]` — enables 2D staggering
- `axis`: `'x'` | `'y'` — direction in 2D grids
- `modifier`: fn(value, i, total) => adjusted value

```js
delay: stagger(80, { grid: [10, 10], from: 'center', ease: 'outQuad' })
```

---

## onScroll(parameters)

Scroll driver usable as `autoplay` value, or standalone scroll observer.

### Settings
`container` (scroll container, default window), `target` (element whose visibility drives playback), `debug` (bool), `axis` (`'y'` | `'x'`), `repeat` (bool — re-trigger each enter).

### Thresholds
`enter`: position shorthand `'bottom 80%'` or numeric. `leave`: same. Supports relative `+=`/`-=`.

### Synchronization modes
- Omit `sync` → threshold-triggered (plays on enter, completes on its own).
- `sync: true` → playback progress tied 1:1 to scroll progress.
- `sync: 'smooth'` → eased scroll following.
- `sync: 'ease'` + `ease` → eased mapping.

### Callbacks
`onEnter`, `onEnterForward`, `onEnterBackward`, `onLeave`, `onLeaveForward`, `onLeaveBackward`, `onUpdate`, `onSyncComplete`, `onResize`.

### Methods
`link(target)`, `refresh()`, `revert()`.

---

## createDraggable(target, parameters)

### Axes parameters
`x`, `y` — each an object or bool: `{ snap, modifier, mapTo }`. `snap`: number (grid) or fn(x) => snappedX.

### Settings
`trigger` (separate grab handle), `container` (bounds element/selector), `containerPadding`, `containerFriction`, `releaseContainerFriction`, `releaseMass`, `releaseStiffness`, `releaseDamping`, `velocityMultiplier`, `minVelocity`, `maxVelocity`, `releaseEase` (typically `createSpring(...)`), `dragSpeed`, `dragThreshold`, `scrollThreshold`, `scrollSpeed`, `cursor`.

### Callbacks
`onGrab(self)`, `onDrag(self)`, `onUpdate(self)`, `onRelease(self)`, `onSnap(self)`, `onSettle(self)`, `onResize(self)`, `onAfterResize(self)`. `self` exposes `target`, `x`, `y`, and methods.

### Methods
`disable()`, `enable()`, `setX(v)`, `setY(v)`, `animateInView()`, `scrollInView()`, `stop()`, `reset()`, `revert()`, `refresh()`.

---

## createScope(parameters)

Framework integration + scoping boundary.

### Parameters
`root` (DOM node; selectors resolve within it), `defaults` (applied to inner animates), `mediaQueries` (map of name → media query string).

### Methods
`add(fn)` — fn receives `{ root, defaults, matches }` where `matches` reflects mediaQueries. `addOnce(fn)`, `keepTime()`, `revert()` (cleans up everything added inside), `refresh()`.

```js
const scope = createScope({ root, mediaQueries: { mobile: '(max-width:768px)' } });
scope.add(({ matches }) => { if (matches.mobile) animate(...); });
```

---

## createAnimatable(target, settings)

Low-level: create a long-lived animatable handle with setters/getters instead of one-shot tweens. Settings: `unit`, `duration`, `ease`, `modifier`. Methods: getters, setters, `revert()`. Use for frequently-rewritten values (e.g., cursor-following element).

---

## createLayout(parameters) — NEW in v4

FLIP-style enter/exit/swap layout animations.

### Settings
`root`, `children` (selector), `delay`, `duration`, `ease`, `properties` (which props to animate during reorder), states: `enterFrom`, `leaveTo`, `swapAt`.

### Methods
`record()` (capture positions before change), `animate()` (transition to new layout), `update()`, `revert()`. Layout id attribute tracks elements across reorder. Use for list reorders, modal/dialog swaps, grid filter transitions.

---

## SVG utilities

- **`morphTo(shape)`** — returns a value for the `d` property that morphs between current path and `shape` (selector or path element). Paths should have matching command structure for clean morphs.
- **`createDrawable(path)`** — wraps a path element so the `draw` property animates stroke drawing. Values are normalized pairs: `['0 0', '0 1']` (undrawn → fully drawn). `['0 1', '1 1']` draws from the end. Map over `querySelectorAll` for multi-path stagger.
- **`createMotionPath(path)`** — returns an object spread into `animate()` params; element follows the path. Adds translate/rotate based on path tangent.

---

## splitText(target, parameters)

Splits text nodes into animatable lines/words/chars wrapped in spans.

### Settings
`lines`, `words`, `chars` (bool — choose what to split), `debug` (bool), `includeSpaces`, `accessible` (bool — keeps aria-readable). Split params: `class` (prefix), `wrap` (bool), `clone` (bool). Supports HTML template overrides.

### Methods
`addEffect(name, fn)`, `revert()` (restore original text — call on cleanup), `refresh()` (re-split on resize/font change).

Returns `{ lines, words, chars }` arrays of element references to animate.

---

## Easings

### Built-in
`linear`, `in`/`out`/`inOut` + `Quad`/`Cubic`/`Quart`/`Quint`/`Sine`/`Expo`/`Circ`/`Back`/`Elastic`/`Bounce`. e.g. `outExpo`, `inOutQuad`, `outBack`, `inElastic`, `outBounce`.

### Custom
- `cubicBezier(x1, y1, x2, y2)`
- `steps(n)`, `steps(n, position)`
- Linear multi-point: `linear([ [0,0], [0.5, 0.8], [1,1] ])`
- Irregular: irregular easing functions
- `createSpring({ stiffness, damping, mass, velocity })` — physics ease; use as per-tween `ease` or draggable `releaseEase`.

### WAAPI interop
`waapi.convertEase(easingString)` — convert anime ease string to CSS-compatible WAAPI easing for `element.animate()`. Useful when offloading to WAAPI for hardware acceleration.

---

## Utility functions

### DOM
- `$(selector, root?)` — querySelector
- `get(target, prop)` / `set(target, props)` — read/write CSS
- `remove(targets)` — remove animations from targets
- `sync(animation)` — synchronize a WAAPI animation onto the anime clock
- `keepTime(animation, time)` — time-keeper utility
- `cleanInlineStyles(targets)` — strip inline styles added by anime

### Random
- `random(min, max)` — float
- `randomPick(array)` — pick one
- `shuffle(array)` — Fisher-Yates
- `createSeededRandom(seed)` — deterministic PRNG

### Math
- `round(v, decimals?)`, `clamp(v, min, max)`, `snap(step)`(returns fn), `wrap(v, min, max)`
- `mapRange(inMin, inMax, outMin, outMax)`(returns fn), `lerp(a, b, t)`, `damp(current, target, lambda, time?)`
- `degToRad(d)`, `radToDeg(r)`

### String
- `roundPad(v, decimals)`, `padStart(str, len, char)`, `padEnd(str, len, char)`

Utilities are chainable where applicable.

---

## Engine configuration

```js
import { engine } from 'animejs';
engine.timeUnit = 'ms';          // 'ms' | 's'
engine.speed = 1;                 // global time multiplier
engine.fps = 60;                   // target frame rate
engine.precision = 4;             // rounding precision
engine.pauseOnDocumentHidden = true; // pause when tab hidden (recommended)
engine.update(); engine.pause(); engine.resume();
```

---

## WAAPI (Web Animation API) notes

Use WAAPI (`element.animate()`) when you want hardware-accelerated, main-thread-independent animations of CSS properties (transforms, opacity). Anime's `sync()` can bring a WAAPI animation onto the anime clock for coordination with timelines. API differences from anime: WAAPI uses `iterations` (not `loop`), `direction` (not `alternate`), `easing` per-keyframe, and `finished` (promise). Use `waapi.convertEase()` to translate anime ease strings to CSS easing for WAAPI keyframes.

---

## Method/parameter naming gotchas (v3 → v4)

| v3 | v4 |
|----|----|
| `anime({ targets, ... })` | `animate(targets, params)` |
| `anime.timeline()` | `createTimeline(params)` |
| `anime.stagger()` | `stagger()` (imported) |
| `anime.random()` | `random()` (imported) |
| `targets:` property | first argument |
| `loop:` | `loop` (unchanged) but `direction: 'alternate'` → `alternate: true` |
| `elasticity` | use `createSpring` or per-ease `Back`/`Elastic` |
| `anime.remove()` | `remove()` (imported) |

Always use named imports in v4. Do not write `anime.xxx` — there is no default export with methods.