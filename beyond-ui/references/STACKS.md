# Stack recipes

Beyond UI is stack-agnostic; these are the concrete adaptations. Read only your section.

## Next.js (App Router) — the default target

- **Tokens**: Tailwind v4 (`@theme` in `globals.css`, OKLCH) or v3 (`tailwind.config.ts`). `next-themes`
  for the class-based dark mode with `suppressHydrationWarning` on `<html>`.
- **Fonts**: `next/font/google` or `next/font/local` with `display: "swap"`, `variable` where useful,
  subset, and one preloaded display face.
- **Client boundaries**: registry components are `"use client"` — import them into server pages as
  leaves. A `"use client"` page root forfeits RSC and is a defect when a leaf would do.
- **Motion**: `motion/react` with `<MotionConfig reducedMotion="user">` mounted in a client provider.
  GSAP only in a client component, dynamically imported (`await import("gsap")`) so ScrollTrigger
  stays out of the initial bundle.
- **Images**: `next/image` with explicit `width`/`height`, `priority` on the LCP image, `sizes`
  matching the real layout, `placeholder="blur"` for photos.
- **View transitions**: `next-view-transitions` for route morphs; Motion `layoutId` within a route.
- **Lenis**: mount in a client provider; bridge to ScrollTrigger with
  `lenis.on("scroll", ScrollTrigger.update)` and `gsap.ticker.add(t => lenis.raf(t * 1000))`.
  Never enable Lenis on a page with a modal/scrollable inner pane without handling the lock.
- **3D**: `@react-three/fiber` + `drei` in a `"use client"` leaf, loaded with
  `dynamic(() => import("./Scene"), { ssr: false })`; `useGLTF` for compressed models; render a poster
  image as the LCP element and cross-fade the canvas in. Full playbook: `references/THREEJS.md`.
- **Verify**: `next build` bundle output before/after a heavy addition; hydration warnings are
  failures (they usually mean a `Date`/`Math.random`/`window` read during render).

## Vite + React (SPA)

- Tailwind v4 via `@tailwindcss/vite`; shadcn init works the same (`components.json` paths use `@/`).
- Set path aliases in both `tsconfig.json` and `vite.config.ts` or `shadcn add` writes broken imports.
- Prefer CSS/`IntersectionObserver` reveals over a motion library for a static marketing page —
  the JS budget is smaller than Next's by habit, and a 200KB motion bundle is visible there.
- React Router: use the View Transitions API (`document.startViewTransition`) for route morphs,
  with a `prefers-reduced-motion` guard.
- SEO/OG/structured data need `react-helmet-async` or SSR — do not forget the metadata surface.

## Astro

- Islands: shadcn/React components hydrate only where interactive (`client:visible` for below-fold,
  `client:load` only for the hero CTA). Most of the page should be zero-JS HTML/CSS.
- Tailwind v4 via `@tailwindcss/vite`; use `astro:assets` `<Image>` for optimisation.
- Astro's native View Transitions (`<ClientRouter />`) are the cheapest page-transition win available
  — prefer them over any JS library.
- Animated registries work, but each one is an island: install the minimum, `client:visible` it, and
  measure. A 12-component landing page with 12 islands is a performance trap.

## Svelte / SvelteKit

- **shadcn-svelte** (bits-ui based) replaces shadcn/ui; same token contract, same registry patterns,
  and it can consume ported Magic UI/animate-ui registry variants.
- Motion: `motion` (Svelte support) or `svelte/transition` + `svelte/motion` for the simple cases —
  native transitions are tiny and should be the default; reach for a library only for layout
  animations and gestures.
- GSAP works unchanged; bind ScrollTrigger inside `onMount` and clean up in `onDestroy`.
- SvelteKit: `$app/navigation` + View Transitions via `onNavigate` for route morphs.
- 3D: **Threlte** (`@threlte/core` + `@threlte/extras`) is the R3F equivalent — same asset pipeline,
  same lazy-load + poster rules (`references/THREEJS.md`).

## Vue / Nuxt

- **shadcn-vue** (Reka UI) or **Park UI**; same theming variables.
- Motion: `@vueuse/motion` for declarative entrance directives, `motion-v` for Motion's API,
  Anime.js v4 for timelines (framework-agnostic by design).
- Nuxt: `<NuxtImg>`/`<NuxtPicture>`, `useSeoMeta` for the metadata surface, `pageTransition` with a
  reduced-motion guard.
- 3D: **TresJS** (`@tresjs/core`, `@tresjs/cientos` for helpers) — the Vue equivalent of R3F; same
  Draco/KTX2 pipeline, same lazy-load + poster requirements.

## React Native / Expo

- **react-native-reusables** is the shadcn port; NativeWind for Tailwind-style styling; keep the same
  token names so web and native stay coherent.
- Motion: **Reanimated 3** worklets must drive animation on the UI thread (this is the whole point —
  never animate layout with the JS thread), **Gesture Handler** for interactions, `LayoutAnimation`
  only for trivial cases.
- Respect the OS reduce-motion setting via `AccessibilityInfo.isReduceMotionEnabled()`.
- Haptics (`expo-haptics`) on primary actions; skeleton screens instead of spinners for content.
- Platform fidelity: iOS large-title nav + blur headers, Android Material 3 (dynamic colour, ripple,
  elevation). One codebase, two idioms — do not ship iOS chrome on Android.

## Static sites / no build step

- CSS-first: custom properties for tokens, `@layer` for structure, `@keyframes` + `animation-timeline:
  scroll()` where supported. Drop the JS motion library entirely.
- Alpine/HTMX for interactivity; View Transitions API for navigation if the browser supports it.
- Even here, use real component patterns (Radix-free HTML with correct `aria-*` wiring) — the
  accessibility contract applies regardless of stack.

## Universal rules (all stacks)

1. Detect the Tailwind version from the lockfile before copying any snippet.
2. Detect `motion` vs `framer-motion` before installing a registry component (they conflict if both
   are present).
3. One component library per primitive; never two `Button`s in one project.
4. Keep the token file single-source; every stack above has exactly one place it lives.
5. Screenshot the production build, not the dev server, before declaring done.
