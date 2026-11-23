# Craft recipes — the techniques that make a site read as studio work

Load this in phase 7 (BUILD) whenever the direction contract calls for scroll choreography, text reveals,
glass, shader backgrounds, page transitions or a custom cursor. Every recipe here was shipped on a
production marketing site, broke in a specific way first, and was fixed. The fix is the recipe.

Use the registries first (`references/COMPONENTS.md`). These recipes cover what the registries get
wrong or do not ship: choreography across a whole section, glass that survives Safari, shaders that do
not flicker on phones, a cursor that stays sharp. Each recipe ends with its **failure signature** — the
symptom you will see if you skip a step — and the mechanical check that catches it
(`scripts/craft-check.mjs`, G17).

Stack assumed: React 19 + `motion` / `framer-motion` 12 + Tailwind v4 + Lenis. The ideas port to GSAP
ScrollTrigger and to Vue/Svelte unchanged.

---

## R1. Scroll-timeline sections (pinned choreography in one unit)

The section is tall (N × 100vh); a `sticky top-0 h-screen` viewport inside it holds the stage; one
`scrollYProgress` drives everything. Pacing is authored as named **windows in viewport-heights**, so
"this beat takes one screen of scrolling" is literally `["beat", 100]`.

```ts
export type Win = [number, number];
export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const seg = (v: number, w: Win) =>
  w[1] === w[0] ? (v >= w[1] ? 1 : 0) : clamp01((v - w[0]) / (w[1] - w[0]));
export const sub = (w: Win, a: number, b: number): Win => [w[0] + (w[1] - w[0]) * a, w[0] + (w[1] - w[0]) * b];
export const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
export const easeInOutQuint = (t: number) => (t < 0.5 ? 16 * t ** 5 : 1 - Math.pow(-2 * t + 2, 5) / 2);

export function buildTimeline<K extends string>(steps: [K, number][]) {
  const total = steps.reduce((s, [, len]) => s + len, 0);
  let cursor = 0;
  const wins = {} as Record<K, Win>;
  for (const [key, len] of steps) {
    wins[key] = [cursor / total, (cursor + len) / total];
    cursor += len;
  }
  return { total, wins };
}
```

```tsx
const T = buildTimeline([["enter", 60], ["hold", 120], ["lift", 80]]);

export function Pillars() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const live = useInView(ref, { margin: "100% 0px 100% 0px" });
  const y = useTransform(scrollYProgress, (v) => `${easeInOutQuint(seg(v, T.wins.enter)) * -10}vh`);
  const fade = useTransform(scrollYProgress, (v) => 1 - seg(v, sub(T.wins.lift, 0.25, 0.7)));
  return (
    <section ref={ref} style={{ height: `${T.total + 100}vh` }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.h2 style={{ y, opacity: fade }}>…</motion.h2>
        {live ? <HeavyLayer progress={scrollYProgress} /> : <StaticLayer />}
      </div>
    </section>
  );
}
```

Rules:
- Height = `total + 100` vh: the extra screen is the sticky viewport itself.
- Function-form `useTransform` with `seg()` + an easing; never a raw linear `[0,1] → [a,b]` map for
  anything that moves. Easing family: expo/quint/cubic. No bounce, no elastic.
- Mount expensive layers (WebGL, video, long lists) only while `useInView(ref, { margin: "100% 0px" })`.
- **Touch has no hover.** If a beat reveals content on hover, on `(hover: none)` the "hold" window walks
  through the items by scroll position instead (`Math.floor(seg(v, hold) * n)`), so phone users see
  every item.
- Build a transform per property (y, scale, opacity, filter) from the same windows so beats stay in sync.

Failure signature: the section "jumps" at its ends (height did not include the sticky screen), or a
hover-only reveal is unreachable on phones. Check: G19 parity screenshots at scroll stops on 390px.

---

## R2. Mask and clip reveals with overhang padding

Line and word reveals translate text out of an `overflow-hidden` wrapper. The wrapper's box is the
**layout** box, not the **ink** box: italic glyphs lean past the right edge, descenders hang below
`leading-none`, and `?`, `f`, `j`, `g` get sliced. Pad the clip box out, then pull it back with a
matching negative margin so layout does not move:

```tsx
<span className="-mx-[0.12em] inline-block overflow-hidden px-[0.12em] pb-[0.12em] align-bottom">
  <motion.span
    className="inline-block will-change-transform"
    initial={{ y: "110%", rotate: 4 }}
    animate={inView ? { y: "0%", rotate: 0 } : undefined}
    transition={{ duration: 1, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
  >
    {word}
  </motion.span>
</span>
```

- Overhang: `0.12em` for roman, `0.15em` horizontal + `0.14em` bottom for italic display sizes and
  tight tracking (`-0.045em`). Always `em`, so it scales with the font size.
- Split text is for eyes only. Put the full sentence once in `<span className="sr-only">` and mark every
  split span `aria-hidden`. Never `aria-label` a `div`/`span`/`p` (invalid ARIA, and screen readers
  spell the letters).
- One `<h1>` per page, containing the whole sentence, even when the visual is two stacked animated
  lines.

**Scroll-driven gradient wipe** (text that rises out of nothing and leaves the same way, scrubbed by a
pinned section). Build all four stops in one transform so they never drift apart:

```ts
const FEATHER = 14;
function maskAt(v: number, inWin: Win, outWin?: Win) {
  const a = seg(v, inWin);
  const b = outWin ? seg(v, outWin) : 0;
  if (a <= 0 || b >= 1) return "linear-gradient(to top, transparent 0%, transparent 100%)";
  const head = -FEATHER + a * (100 + 2 * FEATHER);
  const tail = -FEATHER + b * (100 + 2 * FEATHER);
  const s1 = tail - FEATHER, s2 = Math.max(tail, s1), s3 = Math.max(head - FEATHER, s2), s4 = Math.max(head, s3);
  return `linear-gradient(to top, transparent ${s1}%, #000 ${s2}%, #000 ${s3}%, transparent ${s4}%)`;
}
const mask = useTransform(progress, (v) => maskAt(v, inWin, outWin));
<motion.div style={{ WebkitMaskImage: mask, maskImage: mask }} />
```

**Ink-in characters** (a quote that darkens glyph by glyph as you scroll): each char gets its own
window `[s, s + 0.06·span]`, starts spread evenly across the window, colour interpolated from a "ghost"
one step off the page tone to ink. sr-only full text again.

Failure signature: clipped italic tails and question marks, letters spelled out by VoiceOver.
Check: `craft-check` R2 (split text without `sr-only`, `aria-label` on non-interactive elements).

---

## R3. Liquid glass that survives every browser

Real refraction uses an SVG `feDisplacementMap` as a `backdrop-filter: url(#id)`. Only Chromium
supports that. Safari and Firefox silently render **nothing** behind the element. So:

1. Feature-detect: not Safari, not Firefox, and `probe.style.backdropFilter = "url(#id)"` sticks.
2. Disable refraction below 768px (cost, and the effect is invisible at that size).
3. Fallback is frosted: `blur(max(14px, frost)) saturate(1.8) brightness(1.08)`.
4. Regenerate the displacement map from a `ResizeObserver` (the map is sized to the element; a stale
   map smears).
5. Layer stack, top to bottom: specular gradient (`170deg, white .32 → transparent → white .08`),
   inset rim shadows (`inset 0 0 2px 1px white/.45`, soft inner falloff), the backdrop layer with a
   faint tint, then the content.
6. Chromatic aberration: three displacement passes at `scale`, `scale + a`, `scale + 2a`, isolate R, G
   and B with `feColorMatrix`, screen-blend them back.

**Frosted panels** (dropdowns, popovers, the founders card): same component with refraction off, a
high tint alpha (`rgba(page-tone, 0.84–0.86)`) and `frost` 36–40px. Text on glass must still pass
4.5:1 — the tint alpha is what buys that, not the blur.

Glass is a component of the system, not the personality of the page (see Traps in SKILL.md): nav,
menus and one hero object at most.

Failure signature: an empty, transparent nav bar on iPhone. Check: `craft-check` R3 (`backdrop-filter:
url(` without a capability probe).

---

## R4. Jelly hover pill (nav, tabs, segmented controls)

One pill behind the nav items, moved by springs, squashed by its own velocity:

```tsx
const pillX = useSpring(0, { stiffness: 420, damping: 30, mass: 0.7 });
const pillW = useSpring(0, { stiffness: 420, damping: 30, mass: 0.7 });
const press = useSpring(1, { stiffness: 520, damping: 13, mass: 0.6 });
const vel = useVelocity(pillX);
const stretch = useTransform(vel, [-2200, 0, 2200], [1.22, 1, 1.22]);
const squash = useTransform(vel, [-2200, 0, 2200], [0.8, 1, 0.8]);
const scaleX = useTransform([stretch, press], ([s, p]: number[]) => s * p);
const scaleY = useTransform([squash, press], ([s, p]: number[]) => s * (2 - p) * p);

const movePill = (el: HTMLElement) => {
  if (!shown.current) {
    pillX.jump(el.offsetLeft); pillW.jump(el.offsetWidth);
    press.jump(0.82); press.set(1);
    shown.current = true;
    return;
  }
  pillX.set(el.offsetLeft); pillW.set(el.offsetWidth);
};
```

- First hover **jumps** to the item and pops (press 0.82 → 1); later hovers slide. A pill that slides
  in from x=0 on first hover is the tell of a hand-rolled version.
- Leave on a 140ms timer, cancelled by the next enter, so moving between items never flickers.
- Keyboard: drive the same `movePill` from `onFocus`; the pill is `aria-hidden`, focus rings stay.
- Nav colour flips over dark sections: tag dark sections `data-nav-dark` and, inside a rAF-throttled
  passive scroll handler, test whether any of them spans the nav's centre line (y ≈ 44px).
- Hide on scroll down, show on scroll up, with a 4px dead zone and "always shown within 8px of top".
- Esc closes menus; the mobile sheet traps focus (use the shadcn `Sheet`, restyled).

Failure signature: pill slides in from the left edge; nav text unreadable over a dark section.

---

## R5. Shader-gradient backgrounds with a static fallback

A single-pass fragment shader (simplex noise, 3 brand colours, faint grain) on a full-screen triangle.
The engineering is what keeps it from being the thing that makes the site stutter:

- **Paint the CSS fallback first.** The host always renders a layered radial-gradient of the same three
  colours. The canvas starts at `opacity: 0` and fades in on its first drawn frame. No flash, and
  no-WebGL devices still look designed.
- **One shared rAF scheduler** for every shader on the page (a `Set` of jobs, the loop stops when the
  set is empty). N canvases must not mean N loops.
- **Render below native resolution**: `min(devicePixelRatio, 1.5) × density × 0.5`. Noise gradients do
  not need retina pixels.
- **Pause when not visible**: `IntersectionObserver` (rootMargin 120px) and `document.hidden`.
- **30fps on weak hardware** (`navigator.hardwareConcurrency <= 4`).
- **Reduced motion**: draw once, then stop.
- **Cleanup**: remove the job, disconnect observers, `WEBGL_lose_context().loseContext()`. Browsers cap
  live contexts (~16); leaking them on route changes kills the page.
- **Phones get the static fallback, not WebGL.** Under `(max-width: 767px)` render the CSS gradient with
  its drift animation off. Mobile WebGL behind scroll-driven content flickers (URL-bar resizes trigger
  canvas resizes mid-scroll) and costs battery for an effect nobody can see at that size.
- Mount the shader only while its section is in range (`useInView` margin "100% 0px").

Failure signature: flicker while scrolling on iOS; "Too many active WebGL contexts" in the console.
Check: `craft-check` R5 (WebGL without reduced-motion, visibility pause, context loss or a mobile gate).

---

## R6. Page-transition curtain

A two-layer curtain (accent colour, then page tone 90ms behind) rises over the page, the route
changes underneath, then both continue upward and leave.

- Intercept clicks in the **capture** phase on `document`. Bail on: modifier keys, non-left button,
  `target` other than `_self`, `download`, `#` and `mailto:`/`tel:` links, other origins, the same
  pathname, `prefers-reduced-motion`.
- `router.prefetch(dest)` immediately; navigate in `onAnimationComplete` of the cover.
- Ease `[0.76, 0, 0.24, 1]`, 0.62s in, 0.72s out. Morph `border-radius` from a curved leading edge
  (`50% 50% 0 0 / 14vh 14vh 0 0`) to flat, so the curtain reads as a liquid sheet, not a slide.
- The destination's name rides inside an overhang-padded mask (R2) and a 2px progress rule scales in.
- When the pathname changes: reset scroll **immediately** (`lenis.scrollTo(y, { immediate: true,
  force: true })` and `window.scrollTo`), honour `#hash` targets, wait ~140ms for layout, then reveal.
- Safety timeout (3s) from "wait" to "reveal", so a slow route never strands the user behind a curtain.
- `pointer-events-auto` only while active; `visibility: hidden` when idle.

Failure signature: the new page appears scrolled halfway down; cmd-click opens nothing; the curtain
hangs on a slow network.

---

## R7. A crisp custom cursor

Render the dot at its **largest** size and only ever scale **down**. Scaling a 12px element up to 5×
rasterises it at 12px and stretches the bitmap: a blurry blob on hover.

```tsx
const DOT = 12;
const MAX = 5.4;
<div style={{ width: DOT * MAX, height: DOT * MAX }}
  className="pointer-events-none fixed left-0 top-0 z-[400] rounded-full bg-white mix-blend-difference will-change-transform max-[1023px]:hidden" />
dot.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%) scale(${s / MAX})`;
```

- Only on `(pointer: fine)` and not under `prefers-reduced-motion`; hidden below 1024px.
- Lerp position (0.24) and scale (0.18) in a rAF loop that **sleeps** when settled and wakes on input.
- Targets: `a, button, [role=button], [data-cursor], summary, label` grow to 3.2; elements with a
  `data-cursor="View"` label grow to `MAX` and show the label; text inputs shrink it to 0 so the caret is
  visible.
- Keep the native cursor unless the brief insists. `mix-blend-difference` keeps it visible on any
  background.

Failure signature: soft, blurry circle when hovering a link. Check: `craft-check` R7.

---

## R8. Smooth scroll that does not fight the platform

```tsx
useEffect(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const lenis = new Lenis({ autoRaf: true, lerp: 0.11, touchMultiplier: 1.2, anchors: { offset: -80 } });
  window.__lenis = lenis;
  return () => { lenis.destroy(); delete window.__lenis; };
}, []);
```

Import `lenis/dist/lenis.css`. Expose the instance so transitions and anchor buttons can call
`scrollTo`. Never smooth-scroll under reduced motion. Never put `scroll-behavior: smooth` on `html`
as well (they fight).

---

## R9. Details that separate studio work from templates

- Display type: `clamp()` sizes, tracking `-0.03em` to `-0.045em`, `leading-none` plus overhang
  padding (R2). Body: 16–18px, 1.5–1.6, measure 60–75ch, `text-wrap: pretty`; headings `balance`.
- One page tone that is not `#fff` (a warm off-white like `#F9F6EE`) and one ink that is not `#000`
  (`#1D1C1A`). The "ghost" colour for unrevealed text is one step off the page tone.
- Shadows are stacks of low-alpha layers tinted with the ink, never one grey `shadow-lg`.
- Magnetic buttons: translate toward the pointer by ≤ 30% of the offset, spring back; pointer-fine only.
- Loading screen: only when there is real loading to hide (fonts + hero media), capped at ~1.5s,
  skipped on repeat visits within the session.
- `will-change` only on elements that are animating now; remove it after.
- Every `requestAnimationFrame` loop has a matching `cancelAnimationFrame` in cleanup, and every scroll
  or pointer listener is `{ passive: true }`.

---

## Which recipe for which brief

| Brief signal | Recipes |
|---|---|
| Story-led marketing page, product launch, studio site | R1, R2, R6, R8, R9 (+R5 if the brand has colour to spend) |
| Premium nav on any marketing site | R3 (frosted only), R4 |
| Brand with a strong colour identity, "alive" hero | R5 |
| Portfolio, agency, award-chasing | R1, R2, R6, R7, R8 |
| SaaS app / dashboard | R9 only. No cursor, no curtain, no pinned scroll inside an app |
| Docs, legal, checkout | none — R9 typography rules only |
