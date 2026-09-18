# 3D on the web — WebGL, Three.js and friends

When a brief says "3D", the answer is almost always **Three.js** — directly, or through
**react-three-fiber** on a React stack. This file is the playbook: when 3D is justified, which library,
how to build the scene, how to ship assets, and where the performance and accessibility cliffs are.

Read this **before** installing anything 3D. Then check `references/EFFECTS.md` § WebGL for the
decision matrix and `references/A11Y-PERF.md` for the hard limits.

## 1. Decide first: does this page actually need 3D?

| Situation | Verdict |
|---|---|
| Product is physical/styled/configurable (furniture, cars, devices, shoes, packaging) | **Yes** — 3D *is* the value proposition |
| Creative/agency hero where the visual concept is the point | **Yes** — one scene, one idea |
| Data with a genuine spatial structure (globe, network, terrain, molecular) | **Yes** |
| "It would look cool" on a lead-gen or pricing page | **No** — use ShaderGradient, a generated mesh gradient, or a real product screenshot |
| Marketing page whose goal is signups | **No** at the hero; a small 3D moment further down is acceptable |
| Dashboard/product UI | **No**, unless the product's subject is 3D (CAD, maps, games) |

Rule: 3D must be the *concept*, not the decoration. If you removed the 3D and the page still said the
same thing, remove the 3D. Cost of being wrong: 1–3MB of assets, a GPU-bound main thread, and a worse
LCP on every device that is not yours.

## 2. Library selection

| Library | Install | Use when | Notes |
|---|---|---|---|
| **Three.js** | `npm i three` | Engine for everything below; vanilla/other frameworks | WebGL + WebGPU renderers, 115k★, MIT. The baseline |
| **react-three-fiber** | `npm i three @react-three/fiber` | Any React/Next stack (the default choice) | Declarative scene graph; React 19 + three ≥0.156 for R3F 9.x |
| **drei** | `npm i @react-three/drei` | With R3F, always | `Environment`, `useGLTF`, `OrbitControls`, `Html`, `Text`, `Instances`, `ContactShadows` — the reason R3F is faster than raw three |
| **@react-three/rapier** | `npm i @react-three/rapier` | Genuine physics (collisions, constraints, ragdolls) | Rapier via WASM; heavy — only when physics is the feature |
| **@react-three/postprocessing** | `npm i @react-three/postprocessing` | Bloom, DOF, chromatic aberration | Budget-aware: costs a full-res pass per effect; ≤1–2 on mobile |
| **Threlte** | `npm i @threlte/core` | SvelteKit projects | The Svelte equivalent of R3F; same patterns, same asset pipeline |
| **TresJS** | `npm i @tresjs/core` | Vue/Nuxt projects | Same idea for Vue |
| **model-viewer** | `<script type="module" src="…/model-viewer.min.js">` / `@google/model-viewer` | You only need to *show* a GLB (product/AR) | Zero-code, built-in AR (iOS Quick Look / Android Scene Viewer), poster, camera controls, a11y story. Prefer it over a custom viewer |
| **Babylon.js** | `npm i @babylonjs/core` | Large game-like apps, PBR-heavy scenes, node materials, first-class WebGPU | More batteries-included than three; heavier API surface. Choose one engine per project, never both |
| **PlayCanvas** | `npm i playcanvas` | Team wants an editor + engine, browser games | Excellent editor, GPU-driven; different workflow (entity-component) |
| **Spline** | `npm i @splinetool/react-spline @splinetool/runtime` | Designer-authored scene, short timeline | Runtime is heavy (MBs); always pair with a static poster and lazy load |
| **Vanta.js** | `npm i vanta` | Quick WebGL background (waves, fog, net) | Author's own warning: ≤1–2 per page, slow on old hardware, mobile fallback needed |
| **Paper Shaders** | `npm i @paper-design/shaders-react` | Animated shader backgrounds without authoring GLSL | Zero-dependency, Apache-2.0; pin the version (0.0.x breaking) |
| **ShaderGradient** | `npm i @shadergradient/react` | Parametric animated gradient backgrounds | Generate params on shadergradient.co, paste them in |
| **three.js add-ons** | bundled with `three` (`three/examples/jsm/…`, `three/addons/`) | Post-processing, loaders, controls | Import from `three/addons/*` rather than copying files |
| **Unity / Unreal / Godot web export** | — | **Avoid for websites** | 20–100MB payloads, no SEO, no a11y. Only for embedded game experiences the user explicitly clicks into |

**WebGPU** (three's `WebGPURenderer`, Babylon's WebGPU engine): supported in current Chromium and
Safari, not yet a safe sole target. Ship WebGL2 as the default path and treat WebGPU as a progressive
enhancement — or skip it entirely unless the scene genuinely exceeds WebGL2's ceiling.

**Never mix engines.** One of {three/R3F, Babylon, PlayCanvas, Spline} per project.

## 3. Component and scene sources — reuse, do not start from a blank canvas

| Source | What to take | How |
|---|---|---|
| **21st.dev Three.js collection** | 49 ready React 3D components: shader backgrounds, globes, particle waves, distorted spheres | `npx shadcn@latest add "https://21st.dev/r/<author>/<component>"` (fetch the tag page with `.md`) |
| **threejsresources.com/showcase** | What ships in production, filterable by technology (R3F, GSAP, GLSL, Tailwind) | `/showcase/technologies/react-three-fiber`, `/showcase/categories/…` |
| **drei** | Every common scene helper — cameras, controls, environments, instancing, text, HTML overlays | `import { … } from "@react-three/drei"` |
| **pmndrs ecosystem** | `@react-three/postprocessing`, `leva` (dev-time controls), `maath`, `zustand` for scene state | npm |
| **ShaderGradient / Paper Shaders** | Full-bleed animated backgrounds that read as 3D without a scene graph | npm |
| **Basement.studio / Awwwards WebGL tag / Codrops** | Reference grammar for scroll-linked scenes and transitions | `awwwards.com/websites/webgl/`, `/websites/three-js/`, `tympanus.net/codrops` |
| **shadcn/ui** | The *surrounding* UI: buttons, dialogs, labels, loaders over the canvas | `npx shadcn@latest add …` — the canvas is a component inside a shadcn layout, not a whole page |

## 4. Asset pipeline (this is where 3D projects fail)

```
model.glb  →  gltf-transform / gltfjsx --transform  →  DRACO + KTX2 + webp textures
           →  polyhaven (CC0 HDRI) + drei <Environment>
           →  static poster fallback (PNG/WebP) for no-JS, no-WebGL, reduced-motion
```

- **Models**: `.glb` (single file). Sources with clear licences: **Poly Haven** (CC0 models, HDRIs,
  photoscanned PBR textures, 16k+ HDRIs / 8k+ textures), **Sketchfab** (per-model licence — check it),
  **IconScout** 3D (paid/free tiers), **market.pmnd.rs** (verify availability). Record the licence of
  every asset in `scout.md`.
- **Convert + compress**: `npx gltfjsx model.glb --transform --types` (R3F) or
  `npx @gltf-transform/cli optimize in.glb out.glb --compress draco --texture-compress ktx2`.
  `--transform` typically removes 70–90% of the bytes: Draco mesh compression, KTX2/WebP textures,
  pruned unused nodes. Never ship a raw 20MB export from Blender.
- **Budget**: hero scene ≤ 1–2MB total assets; product viewer ≤ 3MB; anything above 5MB needs a
  loading strategy the user can see and a very good reason.
- **Draco/KTX2 loaders** must be wired (`useGLTF(url, true)` + `setDecoderPath`, or
  `<DRACOLoader>`/`<KTX2Loader>` in drei) — a compressed asset without its decoder silently fails.
- **Textures**: power-of-two sizes, ≤2048px unless a close-up demands more, KTX2 for GPU-compressed,
  correct `colorSpace` (`SRGBColorSpace` for colour maps, linear for normal/roughness data).
- **Lighting**: an HDRI environment map from Poly Haven beats hand-placed lights for realism, and
  costs ~0 draw calls. `ContactShadows` (drei) fakes ground contact cheaply.
- **Instancing**: trees, particles, crowd, products → `<Instances>`/`InstancedMesh`. One draw call for
  hundreds of objects is the difference between 60fps and 20fps.

## 5. Scene patterns (the ones that actually ship)

1. **Hero scene** — one subject, slow rotation or mouse-parallax, dark or gradient environment, camera
   locked. Load lazily, render a poster first, swap in when ready.
2. **Product configurator** — OrbitControls (or a constrained turntable), colour/material variants
   driven by React state, an isolated `<Suspense>` per swap, `useGLTF.preload` for variants.
3. **Scroll-linked 3D** — GSAP ScrollTrigger driving scene values, or drei `ScrollControls`; always
   sync the scroll source (Lenis) with `gsap.ticker`, and never scroll-jack.
4. **Canvas-as-background with real DOM on top** — the safest pattern: the canvas is decorative,
   absolutely positioned, `pointer-events: none`; all text/CTAs stay real DOM. Best for accessibility.
5. **Inline 3D in a shadcn layout** — a `<Card>` containing a small canvas (icon/logo/product chip).
   Constrain the height, `frameloop="demand"`, invalidate on interaction only.
6. **Data globe / network** — drei `Globe` or instanced points; keep labels in DOM overlays, not canvas.
7. **Particle/shader field** — points + a custom shader or Paper Shaders; cheap, scales well, good
   with reduced motion (freeze or remove).
8. **Model viewer with AR** — `model-viewer` with `ar`, `poster`, `camera-controls`, `loading="lazy"`.

## 6. R3F skeleton (copy this shape, then adapt)

```tsx
"use client";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, OrbitControls, useGLTF, Html, useProgress } from "@react-three/drei";
import { Suspense } from "react";

function Loader() {
  const { progress } = useProgress();
  return <Html center><span className="text-sm">{Math.round(progress)}%</span></Html>;
}

export function ProductScene() {
  return (
    <Canvas
      dpr={[1, 2]}                         // never render at 3x on a phone
      frameloop="demand"                   // static scenes: render only when something changed
      camera={{ position: [0, 0.6, 3], fov: 40 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      aria-hidden                            // decorative: keep it out of the a11y tree
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <Suspense fallback={<Loader />}>
        <Model />
        <Environment preset="city" files="/hdri/studio.hdr" />
        <ContactShadows position={[0, -0.8, 0]} opacity={0.4} blur={2.5} />
      </Suspense>
    </Canvas>
  );
}

function Model() {
  const { scene } = useGLTF("/models/product-transformed.glb"); // run gltfjsx --transform first
  return <primitive object={scene} />;
}
useGLTF.preload("/models/product-transformed.glb");
```

Interactive scene: drop `frameloop="demand"`'s constraint (use `frameloop="demand"` + `invalidate()`
on interaction), add `<OrbitControls enablePan={false} minDistance={2} maxDistance={5} />`, and give the
canvas `tabIndex={0}` with a keyboard-operable alternative (arrow-key rotate, or a set of buttons that
change the camera/material) whenever the 3D is the product rather than decoration.

## 7. Performance guards (non-negotiable)

- **Lazy-load the whole 3D stack.** `const Scene = dynamic(() => import("./Scene"), { ssr: false })`
  (Next) or `React.lazy` + `<Suspense>`; three + drei + scene ≈ 400–700KB of JS before assets.
- **Static poster first.** The LCP element is the poster (an image), never the canvas. The canvas
  fades in when ready (`useProgress`).
- **`dpr={[1, 2]}`**, and lower on mobile (`[1, 1.5]`).
- **`frameloop="demand"`** for anything not continuously animating; pause when off-screen
  (`<Canvas frameloop={visible ? "always" : "never"} />` driven by `IntersectionObserver`).
- **Cap postprocessing** — each pass is a full-resolution buffer; bloom-only is usually enough.
- **Frustum culling + instancing + LOD**; drop shadow map resolution (`shadow-mapSize={[1024,1024]}`),
  or fake shadows with `ContactShadows`.
- **Dispose properly** — `useEffect` cleanup for geometries/materials/textures created imperatively;
  R3F disposes scene-graph objects automatically, but not things you create outside it.
- **Never ship an unoptimised GLB**, and never load a model you do not render (preload exactly what
  the first frame needs, nothing more).
- **Test on a mid-range Android profile with 4× CPU throttling** — the machine you are building on is
  not the machine that will run it.
- Budget check in the report: total 3D asset bytes, JS bytes added, FPS on the throttled profile, LCP
  before/after.

## 8. Accessibility and fallbacks

- Decorative 3D: `aria-hidden="true"` on the canvas, `pointer-events: none`, and the same information
  available as text or an image. Nothing essential lives in the canvas — not headings, not prices, not
  CTAs, not legal text. Canvas content is invisible to search engines, screen readers and translation.
- Product 3D: it *is* the content, so provide an equivalent — a gallery of real images, a description,
  and keyboard controls (`tabIndex`, arrow keys / buttons for rotate, zoom, variant switch), plus
  `role="img"` with a descriptive `aria-label` on the canvas container.
- `prefers-reduced-motion: reduce` → freeze the scene on a good frame (or show the poster), stop
  auto-rotation and camera drift, disable postprocessing animation.
- No-WebGL / blocked WebGL / SSR (three cannot render on the server): detect and fall back to the
  poster image. `react-three-fiber` + a `useDetectGPU`/context check, or just render the poster and
  swap in after mount.
- Load failure, slow network, old device: poster + a "view 3D" button that loads the scene on demand.
- Contrast: if DOM text sits over the canvas, it needs a scrim or a solid plate — the canvas colour at
  any given frame is not a controllable background.

## 9. Verification specific to 3D

| Check | Pass condition |
|---|---|
| Poster path | With JS disabled and with WebGL blocked, the page shows the poster and remains usable |
| Reduced motion | Scene freezes/removes; no auto-rotation; nothing disappears |
| Off-screen pause | `frameloop` stops when the canvas scrolls out of view (verify in DevTools performance) |
| Payload | Total 3D assets and JS delta recorded; hero scene ≤ 2MB |
| FPS | ≥ 50fps on the throttled mid-range profile during the heaviest interaction |
| LCP/CLS | Poster is the LCP element; canvas adds no layout shift (fixed container + `aspect-ratio`) |
| Keyboard | If 3D is the content, the flow is completable by keyboard |
| Licences | Every model/HDRI/texture licence recorded in `scout.md` |

## 10. Anti-patterns

- A 3D hero on a lead-gen page because it looked good in the demo.
- Shipping the Blender export as-is (no Draco, no KTX2, 4K textures on a thumbnail).
- Rendering the canvas at DPR 3 on a phone and wondering why it melts.
- Text, prices or CTAs baked into the canvas (invisible to SEO/a11y; unreadable when the camera moves).
- WebGL backgrounds on top of WebGL scenes (Vanta + three + particles on one page).
- Scroll-jacking to drive a camera path.
- Auto-rotating scenes with no pause control (WCAG 2.2.2) or that ignore reduced motion.
- Spline/Vanta dropped in without a poster, a lazy load, or a mobile fallback.
- Two 3D engines in one project.
- A canvas with no dimensions reserved → CLS on every load.
