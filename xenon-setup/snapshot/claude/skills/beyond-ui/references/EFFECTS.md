# Effects — WebGL, shaders, SVG, glass, grain, text

Effects are where a page becomes memorable — and where it becomes slow, inaccessible, or cliché. Read
the decision matrix before adding any of them, and the guards after.

## Decision matrix

| Goal | Use | Cost | Do not |
|---|---|---|---|
| Ambient animated background | ShaderGradient, CSS mesh gradient, or a generated SVG/CSS asset | low–med | Hand-written GLSL you cannot optimise |
| Signature hero moment | ONE effect: shader background, 3D product view, kinetic type, or a scroll-driven scene | high | Two or more competing effects |
| Depth/parallax | Motion `useScroll` + `useTransform` on layered images/SVG | low | Real 3D for a fake parallax |
| Product showcase | Real screenshots with annotations, or a 3D model of the *actual* product | med | Generic 3D blobs/abstract shapes |
| 3D product viewer / configurator | Three.js via react-three-fiber + drei, assets compressed with gltfjsx `--transform` — see `references/THREEJS.md` | high | A hand-rolled WebGL viewer or a video pretending to be interactive |
| Just displaying a GLB (with AR) | `model-viewer` (poster, camera-controls, built-in AR) | low | Rebuilding a viewer around three for a static model |
| Section transition | View Transitions API, Motion `layoutId`, or a scroll-pinned GSAP scene | low–med | Curtain wipes on every dashboard route |
| Texture/grain/paper | fffuel/haikei asset, or an SVG `feTurbulence` overlay | very low | A 2MB noise PNG |
| Glass surface | `backdrop-filter` + border + highlight, with `@supports` fallback | med | Glass over busy imagery with small text |
| Text effect | Motion Primitives/Magic UI text components, SplitText, NumberFlow | low | Typewriter on a headline a user needs to read quickly |
| Loading state | Skeletons, shimmer (Magic UI), or a brand loader | low | A full-page spinner on a marketing page |
| Empty state | Illustration (one set) + a real next action | low | "No data" with no action |
| Celebration | canvas-confetti on a genuine success, once | low | Confetti on every save |

## WebGL / shaders

For 3D scenes specifically — library choice, scene patterns, asset pipeline, R3F skeleton, performance
and a11y guards — read **`references/THREEJS.md`**. What follows is the WebGL-as-effect summary.

- **Only if it is the concept.** A lead-gen page with a heavy 3D hero trades conversions for a demo.
- Lazy-load: `dynamic(() => import("./Hero3D"), { ssr: false })` (Next) or dynamic import in a
  `useEffect`; keep it out of the initial bundle.
- Provide a **static poster** (generated image or a CSS gradient) for: reduced motion, slow network,
  no-WebGL browsers, and the pre-hydration frame. The LCP element must never be inside the canvas.
- Budget: ≤ 1–2MB of assets, DPR capped (`dpr={[1, 2]}`), `frameloop="demand"` for static scenes,
  frustum culling, and Draco/KTX2 via gltf-transform for models.
- Never put essential text or CTAs inside the canvas — it is invisible to search, screen readers,
  translation, and keyboard users.
- Test with 4× CPU throttling and on a mid-range Android profile, not just your machine.
- ShaderGradient is the sanctioned shortcut for gradients: generate parameters on shadergradient.co,
  copy them into the component, keep the animation subtle and slow.

## SVG animation

- Prefer **CSS** for simple cases: `stroke-dasharray`/`dashoffset` draw-on, `transform-origin` spins,
  `<animate>`/SMIL only for self-contained icon loops (SMIL has weak tooling and ignores reduced-motion).
- For path morphing and long draw-on sequences, GSAP (MorphSVG, DrawSVG) or Anime.js v4.
- **Optimise with SVGO before shipping** (`npm i -g svgo && svgo -rf in/ -o out/`): strips editor
  metadata, dead defs and minifies paths — the standard pre-ship step for hand-animated SVG.
- Ids must be unique per instance if the SVG is inlined more than once (broken gradients/masks otherwise).
- Inline SVG inherits `currentColor` — use it so icons follow text colour and dark mode.
- Animated illustrations: reuse assets rather than hand-authoring path data —
  **Lottie/dotLottie** (`@lottiefiles/dotlottie-react`, `lottie-web`), **useAnimations**
  (`react-useanimations`, 90+ MIT micro-animations), **Lordicon** (`@lordicon/element` web component,
  9.7k free animated icons with intro/hover/morph states), **IconScout** (1.5M Lottie), **Rive**
  (`@rive-app/react-canvas` — state machines, GPU vector, 120fps), **SVGator** (exports a single
  self-contained SVG, no runtime).
- Text splitting for staggered reveals: **Splitting.js** (`splitting`, MIT, CSS variables) or GSAP
  SplitText — never hand-rolled char-splitting.
- Respect reduced motion: a draw-on animation should complete instantly, not sit half-drawn.

## Liquid glass

Verified, currently-maintained implementations (2026-09):

| Implementation | Consume | Notes |
|---|---|---|
| `liquid-glass-react` (rdev, MIT, ~6k★) | `npm i liquid-glass-react` | `<LiquidGlass>` with real refraction via SVG displacement; mouse-reactive; configurable displacement/blur/aberration. **Safari & Firefox fall back to plain blur** (no `backdrop-filter: url()`) |
| `nikdelvin/liquid-glass` (MIT) | clone, copy the Astro component + displacement/specular assets | iOS 26-accurate; `feDisplacementMap` + `backdrop-filter: url()`; auto-falls back to glassmorphism on Safari |
| `shuding/liquid-glass` (MIT) | paste the single JS file / copy the SVG filter technique | The original Apple-demo reproduction + `shuding/svg-shaders` |
| shadcn.io glass blocks | `npx shadcn@latest add <block url>` | Glassmorphism navbar, dark glass hero, liquid button, liquid text (SVG goo filter), mercury background |
| 21st.dev liquid-glass collection | `npx shadcn@latest add "https://21st.dev/@<author>/components/liquid-glass"` | 13 community variants in shadcn-registry format — inspect quality before adopting |

CSS baseline, always ship this fallback:

```css
.glass {
  background: color-mix(in oklab, var(--surface) 72%, transparent);
  backdrop-filter: blur(16px) saturate(140%);
  border: 1px solid color-mix(in oklab, white 18%, transparent);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / .22), 0 8px 30px rgb(0 0 0 / .12);
}
@supports not (backdrop-filter: blur(1px)) { .glass { background: var(--surface); } }
@media (prefers-reduced-transparency: reduce) { .glass { background: var(--surface); backdrop-filter: none; } }
```

Warnings that matter: **`prefers-reduced-transparency` is not baseline** (Chromium 118+ only; Firefox
flagged; Safari unsupported) — so the `@supports` fallback is mandatory, not optional.
`prefers-contrast` *is* baseline — use it for the high-contrast variant. Glass needs something behind
it (gradient, imagery, colour); over a flat background it reads as a bug, and over busy imagery small
text fails contrast. Never stack `backdrop-filter` on dozens of elements — paint cost scales with
blur radius × layer count.

## Grain, texture, and "designed" substrates

- A subtle noise overlay (SVG turbulence at 2–4% opacity, `mix-blend-mode: overlay`) warms up flat
  surfaces and is the single cheapest way to make a page feel crafted. Keep it in a token.
- Generate assets instead of writing them (all free, all export SVG/CSS/PNG): **fffuel.co** (~60
  generators: `/nnnoise` noise, `/gggrain` grainy gradients, `/ffflux` fluid gradients, `/ssshape`
  blobs, `/sssurf` waves), **Haikei** (blob scenes, layered waves, low-poly grids), **MagicPattern**
  (seamless patterns, halftone, dither, god rays, shader-gradient editor), **meshgradient.in** (seeded
  mesh gradients), **Transparent Textures** (seamless PNG tiles), **Cool Backgrounds**.
- Ship textures as static layers (SVG/CSS/base64), never as runtime-generated noise per frame.
- Patterns (grid, dots, isometric, diagonal hatch) belong in the background at low contrast — never
  behind body text without a scrim.
- Icons and type have their own sourcing rules: Lucide is shadcn's default (one set per project,
  one stroke weight); alternatives Phosphor, Tabler, Iconify (367k icons across 222 sets, searchable).
  Faces: Google Fonts, Fontshare (Satoshi, Clash Display, General Sans), Velvetyne, Font Squirrel.

## Text effects (with restraint)

Legitimate: gradient/shimmer on a *short* accent label, number roll-ups, char stagger on a headline
that appears once, morph on a state label (`Draft → Published`), scramble/decode for a developer-tool
aesthetic (and only there).

Illegitimate: typewriter on long copy, per-letter hover effects on navigation, text that is invisible
until animation runs (breaks no-JS, SEO and screen readers), effects on error messages.

Rule: the final text must exist in the DOM as plain readable text — animate a *visual layer*, never
the content itself.

## Performance & a11y guards (apply to every effect)

1. Effect never delays LCP: the poster/static state must be paintable from CSS before JS.
2. Effect never causes CLS: reserve the container's size, including fonts.
3. Effect never blocks input: no synchronous heavy work in handlers; keep INP ≤ 200ms.
4. Effect never hides content: with JS disabled, everything is readable.
5. Reduced motion: replaced by a static or gently-faded equivalent — verified by rendering it.
6. Contrast: text over effects/gradients measured, not assumed (≥ 4.5:1).
7. Bundle: measure the delta of every added effect library; delete what is not used.
8. Mobile: effects get cheaper, not just smaller — reduce particle counts, drop post-processing,
   disable parallax on touch if it fights scroll.
