# ScrollTrigger config & plugin catalog

Reference companion to `SKILL.md`. Distilled from the official `greensock/gsap-skills` repository (MIT). All plugins are free — install from the public `gsap` npm package.

## Full ScrollTrigger config table

Properties for the `scrollTrigger` config object (shorthand `scrollTrigger: ".selector"` sets only `trigger`).

| Property | Type | Description |
|----------|------|-------------|
| `trigger` | String \| Element | Element whose position defines start. Required (or use shorthand). |
| `start` | String \| Number \| Function | When active. Default `"top bottom"` (or `"top top"` if `pin: true`). |
| `end` | String \| Number \| Function | When it ends. Default `"bottom top"`. Use `endTrigger` if based on a different element. |
| `endTrigger` | String \| Element | Element used for `end` when different from trigger. |
| `scrub` | Boolean \| Number | Link progress to scroll. `true` = direct; number = seconds of catch-up lag. |
| `toggleActions` | String | Four actions: `onEnter onLeave onEnterBack onLeaveBack`. Each: `play`/`pause`/`resume`/`reset`/`restart`/`complete`/`reverse`/`none`. Default `"play none none none"`. |
| `pin` | Boolean \| String \| Element | Pin while active. `true` = pin trigger. **Don't animate the pinned element — animate children.** |
| `pinSpacing` | Boolean \| String | Default `true` (adds spacer). `false` or `"margin"`. |
| `horizontal` | Boolean | `true` for horizontal scrolling. |
| `scroller` | String \| Element | Scroll container (default viewport). Selector or element for a scrollable div. |
| `markers` | Boolean \| Object | `true` for dev markers; or `{ startColor, endColor, fontSize, ... }`. **Remove in production.** |
| `once` | Boolean | If `true`, kills the ScrollTrigger after end reached once (animation keeps running). |
| `id` | String | Unique id for `ScrollTrigger.getById(id)`. |
| `refreshPriority` | Number | Lower = refreshed first. Use when creating triggers out of page order. |
| `toggleClass` | String \| Object | Add/remove class when active. String = on trigger; or `{ targets: ".x", className: "active" }`. |
| `snap` | Number \| Array \| Function \| "labels" \| Object | Number = increments (e.g. `0.25`); array = values; `"labels"` = timeline labels; object: `{ snapTo, duration, delay, ease }`. |
| `containerAnimation` | Tween \| Timeline | For "fake" horizontal scroll. Pinning/snapping not available. Horizontal tween **must** use `ease: "none"`. |
| `onEnter` / `onLeave` / `onEnterBack` / `onLeaveBack` | Function | Crossing start/end; receive the ScrollTrigger instance (`progress`, `direction`, `isActive`, `getVelocity()`). |
| `onUpdate` / `onToggle` / `onRefresh` / `onScrubComplete` | Function | `onUpdate` on progress change; `onToggle` on active flip; `onRefresh` after recalc; `onScrubComplete` when numeric scrub finishes. |

### Standalone ScrollTrigger.create()

```javascript
ScrollTrigger.create({
  trigger: "#id",
  start: "top top",
  end: "bottom 50%+=100px",
  onUpdate: (self) => console.log(self.progress.toFixed(3), self.direction)
});
```

### ScrollTrigger.scrollerProxy()

Override how ScrollTrigger reads/writes scroll for a third-party smooth-scroll library. `scrollTop(value)` is a setter when called with an arg, getter when called with none. **Critical:** register `ScrollTrigger.update` as a listener so ScrollTrigger stays in sync.

```javascript
ScrollTrigger.scrollerProxy(document.body, {
  scrollTop(value) { if (arguments.length) scrollbar.scrollTop = value; return scrollbar.scrollTop; },
  getBoundingClientRect() { return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }; }
});
scrollbar.addListener(ScrollTrigger.update);
```
Optional vars: `getBoundingClientRect`, `scrollWidth`/`scrollHeight`, `fixedMarkers` (Boolean, markers `position: fixed` when scroller is translated), `pinType` (`"fixed"` if pins jitter, `"transform"` if pins don't stick).

## Plugin catalog

Register every plugin with `gsap.registerPlugin(...)` once, before first use. Import from `gsap/<Plugin>`.

### Scroll / DOM / UI

**ScrollToPlugin** — animate scroll position.
```javascript
gsap.to(window, { duration: 1, scrollTo: { y: "#section", offsetY: 50 } });
gsap.to(scrollContainer, { duration: 1, scrollTo: { x: "max" } });
```
Options: `x`/`y` (number or `"max"`), `element` (selector/element to scroll into view), `offsetX`/`offsetY`.

**ScrollSmoother** — smooths native scroll. Requires ScrollTrigger + specific DOM:
```html
<div id="smooth-wrapper"><div id="smooth-content"><!-- content --></div></div>
```
Register after ScrollTrigger.

**Flip** — FLIP layout transitions (First, Last, Invert, Play). Capture `Flip.getState()`, change DOM, then `Flip.from(state, vars)`.
```javascript
const state = Flip.getState(".item");
// reorder / add / remove / change classes
Flip.from(state, { duration: 0.5, ease: "power2.inOut" });
```
Vars: `absolute`, `nested`, `scale` (default `true`), `simple` (position/scale only, faster), `duration`, `ease`.

**Draggable** — drag/spin/throw with mouse/touch. `Draggable.create(".box", { type: "x,y", bounds: "#container", inertia: true })`. `type`: `"x"`,`"y"`,`"x,y"`,`"rotation"`,`"scroll"`. `bounds`: element/selector/`{minX,maxX,minY,maxY}`. `edgeResistance` 0–1. Callbacks: `onDragStart`/`onDrag`/`onDragEnd`, `onThrowUpdate`/`onThrowComplete`.

**InertiaPlugin** — momentum after release (with Draggable `inertia: true`) or track velocity of any property: `InertiaPlugin.track(".box", "x")` then `gsap.to(obj, { inertia: { x: "auto" } })`. Register with Draggable.

**Observer** — normalized pointer/scroll input for swipe/direction/gesture logic.
```javascript
Observer.create({ target: "#area", onUp: () => {}, onDown: () => {}, onLeft: () => {}, onRight: () => {}, tolerance: 10 });
```
`type`: `"touch"`,`"pointer"`,`"wheel"` (default `"touch,pointer"`).

### Text

**SplitText** — split text into chars/words/lines for per-unit animation. `SplitText.create(target, vars)` returns instance with `chars`/`words`/`lines` (and `masks` when `mask` set). Revert with `split.revert()` or via `gsap.context()`/`useGSAP()`.
```javascript
const split = SplitText.create(".heading", { type: "words, chars" });
gsap.from(split.chars, { opacity: 0, y: 20, stagger: 0.03, duration: 0.4 });
```
With `autoSplit: true`, animations **must** be created inside `onSplit()` and returned for cleanup/sync on re-split (e.g. font load). Key vars: `type` (default `"chars,words,lines"` — split only what you animate), `charsClass`/`wordsClass`/`linesClass` (`"++"` appends incremented index), `aria` (`"auto"`/`"hidden"`/`"none"`), `mask` (`"lines"|"words"|"chars"`), `tag` (default `"div"`, use `"span"` for inline), `ignore`, `smartWrap`, `wordDelimiter`, `propIndex`, `reduceWhiteSpace`.
Tips: split after fonts load (`document.fonts.ready` or `autoSplit`); avoid `text-wrap: balance`; use `font-kerning: none; text-rendering: optimizeSpeed` to avoid kerning shift on chars; SplitText does **not** support SVG `<text>`.

**ScrambleTextPlugin** — scramble/glitch text. `gsap.to(".text", { scrambleText: { text: "New message", chars: "01", revealDelay: 0.5 } })`.

### SVG

**DrawSVGPlugin** — reveal/hide stroke by animating `stroke-dasharray`/`stroke-dashoffset`. `drawSVG` value = visible segment `"start end"` (e.g. `"0% 100%"`, `"20% 80%"`); single value means start is 0. Works on `<path>`,`<line>`,`<polyline>`,`<polygon>`,`<rect>`,`<ellipse>`. **Element must have a visible stroke** (`stroke` + `stroke-width`). `DrawSVGPlugin.getLength(el)` / `getPosition(el)`. Caveat: only affects stroke (not fill); prefer single-segment `<path>`; `<use>` contents can't be changed.
```javascript
gsap.from("#path", { duration: 1, drawSVG: 0 });
gsap.fromTo("#path", { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 1 });
```

**MorphSVGPlugin** — morph one shape into another via `d`. Start/end need not share point count. Works on `<path>`,`<polyline>`,`<polygon>`; `<circle>/<rect>/<ellipse>/<line>` via `MorphSVGPlugin.convertToPath(...)`. Value can be selector, element, raw path data, or object `{ shape, ... }`.
```javascript
gsap.to("#diamond", { duration: 1, morphSVG: "#lightning", ease: "power2.inOut" });
gsap.to("#diamond", { duration: 1, morphSVG: { shape: "#lightning", type: "rotational", shapeIndex: 2 } });
```
Object vars: `shape` (required), `type` (`"linear"` default / `"rotational"` — try when linear kinks), `map` (`"size"`/`"position"`/`"complexity"`), `shapeIndex` (number, array for multi-segment, or `"log"` to print auto value; use `findShapeIndex(start,end)` UI), `smooth` (v3.14+), `curveMode` (v3.14+, avoid curve kinks), `origin`, `precision`, `precompile` (array or `"log"`), `render`/`updateTarget` (for canvas-only). Utils: `convertToPath`, `rawPathToString`/`stringToRawPath`.

**MotionPathPlugin** — animate an element along an SVG path.
```javascript
gsap.to(".dot", { duration: 2, motionPath: { path: "#path", align: "#path", alignOrigin: [0.5, 0.5], autoRotate: true, curviness: 1 } });
```
`path` (element/selector/path data), `align`, `alignOrigin` `[x,y]` 0–1, `autoRotate`, `curviness` 0–2.

**MotionPathHelperPlugin** — dev visual editor for MotionPath alignment. `MotionPathHelper.create(".dot", "#path", { end: 0.5 })`. Dev only.

### Easing

**CustomEase** — `CustomEase.create("name", ".17,.67,.83,.67")` (cubic-bezier) or SVG path data. Covered in SKILL.md.
**EasePack** — SlowMo, RoughEase, ExpoScaleEase.
**CustomWiggle** — wiggle/shake easing (multiple oscillations).
**CustomBounce** — configurable bounce easing.

### Physics

**Physics2DPlugin** — `gsap.to(".ball", { duration: 2, physics2D: { velocity: 250, angle: 80, gravity: 500 } })`.
**PhysicsPropsPlugin** — physics per property: `gsap.to(".obj", { physicsProps: { x: { velocity: 100, end: 300 }, y: { velocity: -50, acceleration: 200 } } })`.

### Other / dev

**PixiPlugin** — animate Pixi display objects: `gsap.to(sprite, { pixi: { x: 200, y: 100, scale: 1.5 } })`.
**GSDevTools** — dev UI for scrubbing/toggling timelines. `GSDevTools.create({ animation: tl })`. **Do not ship to production.**
**CSSRulePlugin**, **EaselPlugin**, **TextPlugin** — register and import as needed.

## Plugin best practices

- Register every plugin used with `gsap.registerPlugin()` before first use.
- `Flip.getState()` -> DOM change -> `Flip.from()` for layout transitions; `Draggable` + `InertiaPlugin` for drag with momentum.
- Revert plugin instances (`split.revert()`, `ctx.revert()`) on unmount/element removal.
- Register at app/module top level, not in a re-rendering component body.
- Do **not** generate an `.npmrc`/auth token/private registry for any GSAP plugin — everything is free from the public `gsap` package now.

## Links

- ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- ScrollTrigger.batch(): https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.batch/
- ScrollTrigger.scrollerProxy(): https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.scrollerProxy/
- Flip: https://gsap.com/docs/v3/Plugins/Flip
- SplitText: https://gsap.com/docs/v3/Plugins/SplitText/
- DrawSVG: https://gsap.com/docs/v3/Plugins/DrawSVGPlugin
- MorphSVG: https://gsap.com/docs/v3/Plugins/MorphSVGPlugin
- gsap.utils: https://gsap.com/docs/v3/HelperFunctions
- React: https://gsap.com/resources/React
- matchMedia: https://gsap.com/docs/v3/GSAP/gsap.matchMedia/