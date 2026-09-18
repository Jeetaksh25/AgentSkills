# Library index — animation, 3D, effects, assets

Install facts and framework support. Check the project's framework and version column before adding:
a Vue project cannot take a React registry, and a Tailwind v4 project must not paste v3 snippets.

## Motion & interaction

| Library | Install | Strength | Support | Notes |
|---|---|---|---|---|
| **Motion** (ex-Framer Motion) | `npm i motion` (13.x) → `motion/react` | React component animation: variants, `whileInView`, `layout`/`layoutId`, `AnimatePresence`, gestures, `useScroll`/`useTransform`, `motion/three` for 3D, View Transitions (`AnimateView`) | React, Vue (`motion-v`), vanilla, three | The default. `MotionConfig reducedMotion="user"` |
| **framer-motion** | `npm i framer-motion` (13.x) | Legacy name; `motion` re-exports it | React | Do not install both — check which the project already has |
| **GSAP** | `npm i gsap` (3.15) | Timelines, ScrollTrigger, pinning, MorphSVG, SplitText, Flip, ScrollSmoother — **all plugins free** under the standard no-charge licence | framework-agnostic | Best for scroll scenes and precise sequencing; lazy-load, use `gsap.matchMedia()` for reduced motion |
| **Anime.js v4** | `npm i animejs` (4.5) | Small, declarative DOM/SVG animation: `animate`, `createTimeline`, `createDraggable`, `stagger`; subpaths `animejs/svg`, `animejs/text` (splitText), `animejs/engine` | framework-agnostic | Great for SVG/icons and non-React stacks; no React lock-in |
| **Lenis** | `npm i lenis` (1.3) | Smooth scrolling (the standard); subpaths `lenis/react`, `lenis/vue`, `lenis/nuxt`; `locomotive-scroll` v5 now wraps it | framework-agnostic | Bridge to ScrollTrigger; never enable where it breaks inner scroll panes |
| **View Transitions API** | native (+ `npm i next-view-transitions`) | Route + shared-element transitions | Chrome/Edge/Safari; graceful no-op elsewhere | Cheapest page-transition win; always guard with reduced motion |
| **AutoAnimate** | `npm i @formkit/auto-animate` | One-line add/remove/reorder animations for lists | React/Vue/Svelte/vanilla | Perfect for dashboards and tables |
| **tailwindcss-motion** | Tailwind plugin | CSS-only motion utilities, no JS | any Tailwind project | The right answer when a bundle is unjustified |
| **@vueuse/motion** | `npm i @vueuse/motion` | Vue directives for entrance/hover motion | Vue/Nuxt | Vue equivalent of Motion's ergonomics |
| **Reanimated** | `npm i react-native-reanimated` (Expo) | UI-thread animation for React Native | RN | Must run worklets on the UI thread; pair with Gesture Handler |
| **Theatre.js** | `npm i @theatre/core` | Visual sequencing/editor export | framework-agnostic | Niche; use when a designer authors the timeline |
| **Motion Canvas** | `npm i @motion-canvas/core` | Programmatic vector motion (video-like) | — | For explainers, not app UI |
| **Swapy** | `npm i swapy` | Drag-to-reorder with layout persistence | framework-agnostic | Draggable lists/grids |
| **Embla Carousel** | `npm i embla-carousel-react` | Accessible, tiny carousels | React/Vue/Svelte/vanilla | Preferred over hand-rolled carousels; shadcn `Carousel` wraps it |
| **Swiper** | `npm i swiper` | Feature-rich carousels/sliders | all | Heavier; use when the feature set is needed |
| **use-gesture** | `npm i @use-gesture/react` | Drag/pinch/wheel gesture state | React | Compose with Motion for gesture-driven UI |
| **Popmotion / springs** | `npm i popmotion` | Spring primitives | vanilla | Usually unnecessary now that Motion covers it |
| **Barba.js / Swup** | `npm i @barba/core` / `npm i swup` | MPA page transitions | vanilla/SSR | For non-SPA sites with real page loads |
| **ScrollReveal** | `npm i scrollreveal` (GPL-3.0 — commercial licence sold separately) | Simple scroll reveals | vanilla | Prefer `IntersectionObserver` + CSS / `whileInView`; license alone disqualifies it from many projects |
| **Swapy** | `npm i swapy` (GPL-3.0) | Drag-to-swap layouts | framework-agnostic | Check the licence before shipping in a closed-source product |

## Text, numbers, icons

| Library | Install | Strength |
|---|---|---|
| **NumberFlow** | `npm i @number-flow/react` | Animated digits/counters/currency — the correct way to animate numbers |
| **Torph** | `npm i torph` | Text morph between states |
| **SplitText / GSAP Text** | part of GSAP (free) | Char/word/line splitting for stagger reveals |
| **TypeIt / typed.js** | `npm i typeit` / `typed.js` | Typewriter effects (use sparingly) |
| **Lottie** | `npm i lottie-react` or `npm i @lottiefiles/dotlottie-react` | Vector micro-animations from LottieFiles |
| **Rive** | `npm i @rive-app/react-canvas` | Interactive state-machine animations (the premium option) |
| **Lordicon / useAnimations / IconScout Lottie** | asset libraries | Ready-made animated icons — reuse instead of animating SVG paths |
| **Lucide** | `npm i lucide-react` | Default icon set for shadcn; one weight, consistent stroke |
| **Phosphor / Tabler / Heroicons / Iconify** | `npm i @phosphor-icons/react`, `@tabler/icons-react`, `@iconify/react` | Alternative single sets; never mix sets on one page |
| **SVG Repo / Basicons / Iconbuddy** | asset libraries | Bulk SVG sourcing |

## 3D, shaders, backgrounds

| Library | Install | Strength | Notes |
|---|---|---|---|
| **Three.js** | `npm i three` | The engine: WebGL + WebGPU renderers, addons under `three/addons/*` | 115k★, MIT. Baseline for everything below |
| **React Three Fiber** | `npm i three @react-three/fiber` | Declarative React scene graph | Pair with drei. React 19 + three ≥0.156 for R3F 9.x |
| **drei** | `npm i @react-three/drei` | `Environment`, `useGLTF`, `OrbitControls`, `Html`, `Text`, `Instances`, `ContactShadows`, `ScrollControls`, `useProgress`, `Globe` | The reason R3F builds faster than raw three |
| **@react-three/rapier** | `npm i @react-three/rapier` | Real physics (collisions, constraints) | WASM; only when physics is the feature |
| **@react-three/postprocessing** | `npm i @react-three/postprocessing` | Bloom, DOF, chromatic aberration, SSAO | One full-res pass each — budget it |
| **Threlte** | `npm i @threlte/core` | SvelteKit equivalent of R3F | Same patterns, same asset pipeline |
| **TresJS** | `npm i @tresjs/core` | Vue/Nuxt equivalent | Same |
| **model-viewer** | `npm i @google/model-viewer` or script tag | Show a GLB with camera controls, poster and built-in AR | Use instead of a custom viewer when you only need to display a model |
| **Babylon.js** | `npm i @babylonjs/core` | Game-like apps, PBR-heavy scenes, node materials, strong WebGPU support | Heavier API; never alongside three |
| **PlayCanvas** | `npm i playcanvas` | Editor + engine, browser games | Entity-component workflow |
| **Spline** | `npm i @splinetool/react-spline @splinetool/runtime` | Designer-authored scene, fast to place | MBs of runtime — lazy load + poster |
| **Vanta.js** | `npm i vanta` | Quick WebGL backgrounds (waves, fog, net) | Author's warning: ≤1–2 per page, mobile fallback |
| **Paper Shaders** | `npm i @paper-design/shaders-react` | Ready shader effects (MeshGradient, LiquidMetal, GodRays, GrainGradient) | Zero-dependency, Apache-2.0; pin versions |
| **ShaderGradient** | `npm i @shadergradient/react` | Parametric animated gradient backgrounds | Params generated on shadergradient.co |
| **gltfjsx / gltf-transform** | `npx gltfjsx model.glb --transform` · `npx @gltf-transform/cli optimize` | Convert GLTF → R3F JSX; Draco + KTX2 + webp compression, prune unused nodes (70–90% smaller) | The mandatory pre-ship step for any model |
| **glTF assets** | Poly Haven (CC0), Sketchfab (per-model licence), IconScout 3D | Models, HDRIs, photoscanned PBR textures | Record every licence in `scout.md` |
| **leva / maath / zustand** | npm | Dev-time scene controls, math helpers, scene state | pmndrs ecosystem |
| **tsparticles** | `npm i @tsparticles/react @tsparticles/engine` | Particle systems (presets: snow, stars, confetti) | Only when particles are the concept |

Full playbook — when 3D is justified at all, scene patterns, the R3F skeleton, performance guards and
the a11y/fallback story — is `references/THREEJS.md`. WebGPU today: ship WebGL2 as the default path and
treat WebGPU (three `WebGPURenderer`, Babylon's engine) as progressive enhancement only.

## Textures, patterns, generated assets

| Source | Use |
|---|---|
| **fffuel** | Generators: SVG noise/grain, mesh gradients, pattern makers (copy SVG/CSS) |
| **Haikei** | SVG blobs/waves/mesh gradients, exportable |
| **Coolbackgrounds / Meshgradient.in / Gradient.page** | Static gradient and mesh assets |
| **Transparent Textures** | Repeating noise/texture PNGs |
| **MagicPattern** | CSS/SVG patterns, blobs, backgrounds |
| **3dicons / Iconscout 3D** | Free 3D icon sets (consistent lighting — check licence) |
| **unDraw / Storyset / Humaaans / Open Peeps** | Illustration sets: pick ONE and keep its style |
| **Google Fonts / Fontshare / Velvetyne / Font Squirrel** | Type sourcing (`references/DESIGN.md` rules for pairing) |
| **SVGOMG / svgo** | Optimise every SVG before shipping |

## Liquid glass & glassmorphism

Glass must be a decision, not a default. When it *is* the direction:

- CSS: `backdrop-filter: blur() saturate()`, a 1px translucent border, an inner highlight
  (`inset 0 1px 0 rgb(255 255 255 / .25)`), and a real underlying surface (glass over nothing looks broken).
- SVG displacement (Apple's approach): `feDisplacementMap` + `feTurbulence` on a backdrop layer for
  refraction — implement via an SVG filter referenced by `filter: url(#…)`; expensive, test on mobile.
- React ports of Apple's liquid glass exist (e.g. `liquid-glass-react` and several shadcn registry
  variants) — verify maintenance, licence and that they degrade where `backdrop-filter` is unsupported.
- Always provide a `@supports not (backdrop-filter: blur(1px))` fallback (solid tinted surface).
- Respect `prefers-reduced-transparency` where supported.
- Never place small text on glass over a busy image: contrast fails. Scrim it.

## Cursor, canvas, celebration

`canvas-confetti` (`npm i canvas-confetti`) for genuine celebrations (a first success, a completed
onboarding) · `cursor-effects` (tholman) for playful cursor trails — marketing sites only, never in
product UI · magnetic buttons and spotlight cards are Aceternity/React Bits patterns, not libraries ·
custom cursors break accessibility: never hide the native cursor.

## Decision guidance

| Goal | Reach for | Avoid |
|---|---|---|
| Reveal content on scroll | Motion `whileInView` or `IntersectionObserver` + CSS | AOS/ScrollReveal in new React projects |
| Precise multi-step scroll scene | GSAP + ScrollTrigger (+ Lenis) | Hand-rolled scroll math |
| Small, non-React site | Anime.js v4 or CSS | Three.js |
| Hero visual identity | ShaderGradient, one Aceternity/Magic UI effect, or a static generated asset | Stacking three effects |
| **3D scene / product viewer** | **Three.js → react-three-fiber + drei** (+ gltfjsx `--transform`) — `references/THREEJS.md` | Raw canvas/WebGL written by hand, unoptimised GLB exports, 3D without a poster |
| **Just show a GLB (with AR)** | `model-viewer` | A custom scene graph for a static model |
| **Svelte / Vue 3D** | Threlte / TresJS | Porting R3F snippets into a non-React app |
| **Game-like / PBR-heavy app** | Babylon.js or PlayCanvas (one engine only) | three *and* Babylon in one bundle |
| List/table choreography | AutoAnimate | Custom FLIP code |
| Route transitions | View Transitions API | A JS curtain on every navigation of a dashboard |
| Numbers | NumberFlow | Hand-rolled digit roll |
| Icons that animate | Lottie/Rive assets | Animating a Lucide icon's paths by hand |
| A one-off hover | CSS transitions | Installing any library |
