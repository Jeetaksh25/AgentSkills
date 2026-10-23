# Platforms — the same pipeline for web, mobile and desktop

Load at phase 0c (RECON), after `sources.mjs detect`. Every platform runs the same loop (brief,
references, fidelity, type, import-first, craft, QA, gates); what changes is the base kit, the
motion engine, the verification tool and which gates have a native equivalent.

## Choosing the platform and framework (when the repo has none)

| The idea says | Build with | Why |
|---|---|---|
| website, landing, SaaS, dashboard, web app | **Next.js** App Router + Tailwind v4 + shadcn/ui + Motion + Lenis | Largest component ecosystem; every registry targets it |
| mobile app, iOS/Android app | **Expo** (React Native) + NativeWind + React Native Reusables + Reanimated/Moti | One codebase, native feel, web preview for the gates |
| "web app that also ships to the stores", existing web codebase | **Capacitor** + the web stack + Ionic or Konsta UI | Reuses the web build; native shell and plugins |
| performance-critical or heavy custom graphics mobile, or the team uses Dart | **Flutter** + shadcn_ui or Forui + flutter_animate + Rive | Own renderer, consistent pixels |
| iOS/macOS only and native feel matters most | **SwiftUI** | Platform conventions for free |
| Android only, native | **Jetpack Compose** + Material 3 | Platform conventions for free |
| desktop app | **Tauri** (default) or **Electron** + the web stack; Fluent UI React on Windows-first products | Web stack, native window; Tauri is lighter |
| content site, blog, docs | **Astro** + Tailwind + shadcn (React islands) | Ships no JS by default |
| Vue / Svelte / Angular / Solid team or repo | Nuxt + shadcn-vue + Inspira UI · SvelteKit + shadcn-svelte · Angular + Spartan · Solid + Solid UI | Use the shadcn port for that framework |

## The stack per platform

| Platform | Base components (import) | Animated / effects | Motion engine | Smooth scroll | Icons | Fonts | Verify with |
|---|---|---|---|---|---|---|---|
| Next.js / React web | shadcn/ui (+ blocks) | Magic UI, Aceternity, React Bits, Animate UI, Motion Primitives, 21st.dev | Motion; GSAP for timelines/pinning | Lenis | Lucide (one set) | next/font | Playwright: qa, critique, parity, harvest |
| Vue / Nuxt | shadcn-vue, Nuxt UI, Reka UI | Inspira UI, Vue Bits | Motion for Vue, GSAP | Lenis | Lucide | @nuxt/fonts | Playwright |
| Svelte / SvelteKit | shadcn-svelte, Bits UI | Svelte transitions + GSAP | GSAP / svelte/motion | Lenis | Lucide | Fontsource | Playwright |
| Angular | Spartan, Angular Material | GSAP | Angular animations, GSAP | Lenis | Lucide | Fontsource | Playwright |
| Expo / React Native | React Native Reusables (NativeWind), gluestack-ui, Tamagui | Animate React Native, Moti, Skia, Lottie, Rive | Reanimated 3 + Gesture Handler | native scroll physics (never emulate) | lucide-react-native, Ionicons | expo-font | Expo web for the Playwright gates + simulator screenshots, Maestro flows |
| Capacitor | Ionic or Konsta UI (+ shadcn for web screens) | same as web | Motion / Ionic Animations | native scroll on device, Lenis only for the web build | Ionicons, Lucide | bundled | Playwright on the web build + device screenshots |
| Flutter | shadcn_ui, Forui, Material 3 | flutter_animate, Rive, Lottie | implicit/explicit animations, `animations` package | platform physics | Phosphor, Lucide | pubspec fonts | `flutter run -d web-server` for Playwright gates + golden tests |
| SwiftUI | native components | Pow, Lottie iOS, Rive | springs, `matchedGeometryEffect`, phase animators | native | SF Symbols | bundled | Xcode previews + `xcrun simctl io booted screenshot`, XCUITest |
| Jetpack Compose | Material 3 | Lottie Compose, Rive | Compose animation APIs | native | Material Symbols | bundled | `adb exec-out screencap -p`, Compose UI tests |
| Tauri / Electron | the web stack; Fluent UI React for Windows-native feel | same as web | Motion, GSAP | Lenis in long content views only | Lucide, Fluent icons | bundled | Playwright against the dev URL + window screenshots |

## Platform rules that override web habits

- **Mobile is not a small website.** Bottom tab bar or native stack navigation, thumb-reach primary
  actions, 44pt (iOS) / 48dp (Android) targets, safe areas, haptics on meaningful actions, system
  sheet and swipe-back gestures. No hover states, no custom cursor, no Lenis.
- **Respect the platform's motion.** iOS springs and Android Material motion tokens, not web easing
  curves. Reduced motion: `AccessibilityInfo.isReduceMotionEnabled` / `useReducedMotion` (Reanimated),
  `MediaQuery.disableAnimations` (Flutter), `accessibilityReduceMotion` (SwiftUI).
- **Dynamic type.** Text scales with the OS setting; layouts survive the largest accessibility size.
- **Dark mode follows the system** unless the brief fixes a theme.
- **Desktop** gets keyboard shortcuts, menus, resizable panes, dense layouts and a native title bar
  treatment. Never the marketing site inside a window.
- **References come from the platform.** `sources.mjs pick` filters by platform: Mobbin,
  Screensdesign, Uiland, Scrnshts, Apple Design Awards and Dribbble mobile shots for apps; Refero,
  SaaSFrame and Nicelydone for product UI.

## Gates on non-web platforms

`sources.mjs detect` writes `.beyond-ui/platform.json` (`kinds`, `framework`, `webPreview`).

- **Web preview available** (Expo web, Capacitor, Flutter web, Tauri/Electron dev URL): run every
  Playwright gate (QA, critique, parity, harvest) against the preview, then add device screenshots.
- **No web preview** (SwiftUI, Compose): G9, G14, G15 and G19 accept native evidence instead: write
  `.beyond-ui/native-evidence.json` with at least 3 screenshots across at least 2 device sizes (files
  on disk), a reduced-motion pass, a largest-dynamic-type pass, a screen-reader label pass and a flow
  run (Maestro/XCUITest/Compose test) and `microInteractions` (before/after captures of each component state and a screen transition, MICRO.md) — each `"pass"`. G17 runs on JS/TS/Vue/Svelte sources and is
  n/a for pure Swift/Kotlin/Dart projects (record why in `state.json -> notes`). G18 (web production) is replaced by the store checklist in
  `references/PRODUCTION.md` -> "Store apps".
