# Micro-interactions and transitions — every component, every platform

Load in phase 7 (BUILD) when wiring a component's states, and in phase 11 when `motion-audit.mjs` (G22)
reports gaps. The ten rules at the top of SKILL.md are the always-on summary; this file is the spec.

Motion here is **feedback and continuity**, not decoration: every state change a user causes gets a
response within one frame and settles in 120–320ms; every navigation preserves a sense of place.

## Timing and easing tokens (define once, use everywhere)

| Token | Web (CSS / Motion) | React Native (Reanimated) | SwiftUI | Compose | Flutter |
|---|---|---|---|---|---|
| instant feedback (press, toggle) | 100–140ms `cubic-bezier(.2,0,0,1)` | `withTiming(…, {duration:120})` | `.snappy(duration: 0.15)` | `tween(120, easing = FastOutSlowInEasing)` | `Duration(milliseconds: 120)`, `Curves.easeOutCubic` |
| state change (hover, focus, tab, accordion) | 160–220ms `cubic-bezier(.2,.8,.2,1)` | `withSpring({damping:18, stiffness:220})` | `.smooth(duration: 0.25)` | `spring(dampingRatio = 0.8f, stiffness = 500f)` | `Curves.easeOutQuart` |
| enter / overlay (popover, sheet, dialog, toast) | 220–320ms enter, 160–200ms exit; `cubic-bezier(.16,1,.3,1)` | `withSpring({damping:20, stiffness:180})` | `.spring(response: 0.35, dampingFraction: 0.85)` | `spring(0.85f, 400f)` | `Curves.easeOutExpo` |
| page / route | 300–500ms | native stack animation | `NavigationStack` push / `matchedGeometryEffect` | `AnimatedContent` / nav animations | `PageTransitionsTheme` |
| exits | always shorter than enters (≈70%) | | | | |

No bounce or elastic on UI chrome. Springs are critically damped or close (damping ratio ≥ 0.8) except
for playful brands, and even then never on text.

## Per component

| Component | Feedback | Implementation (web) | Native equivalent |
|---|---|---|---|
| Button | hover: bg/colour shift 160ms; press: `scale(.97)` 100ms; focus-visible ring fades in; loading: label cross-fades to spinner, width locked | Tailwind `transition-[background-color,transform,box-shadow] active:scale-[.97]`; Motion `whileTap={{scale:.97}}` | RN `Pressable` + Reanimated scale .96 + `Haptics.selectionAsync()`; SwiftUI `.buttonStyle` with `.scaleEffect(isPressed ? 0.97 : 1)` + `.sensoryFeedback(.impact, trigger:)` |
| Link / nav item | underline or pill slides (shared layout), colour 160ms | Motion `layoutId` pill; CRAFT R4 jelly pill on marketing nav | tab bar icon fill + label weight change, haptic selection |
| Input | focus: border/ring 160ms, label floats; error: 2-cycle 4px shake 240ms + message height-animates in; success: check draws in | ring via `focus-visible`, `aria-invalid` styles, Motion `AnimatePresence` for the message | RN Reanimated shake; SwiftUI `.phaseAnimator`; error haptic `.notificationAsync(Error)` |
| Toggle / switch / checkbox | thumb slides with spring; check path draws (stroke-dashoffset) 180ms | Radix/shadcn Switch + `transition-transform`; SVG check draw | native `Switch` / `Toggle` (never re-skinned to look non-native on mobile) |
| Tabs / segmented control | indicator slides between tabs (shared layout), content cross-fades 160ms | Motion `layoutId="tab-indicator"` | iOS `Picker(.segmented)`; Compose `TabRow` indicator |
| Dropdown / popover / tooltip | scale .96→1 + fade from the trigger's origin, 180ms; tooltip delay 400ms, instant on subsequent | Radix `data-[state=open]:animate-in zoom-in-95 fade-in` with `transform-origin: var(--radix-*-transform-origin)` | `Menu` / `contextMenu` native |
| Dialog / modal | backdrop fade 200ms, panel scale .96→1 + fade 240ms; exit faster | shadcn Dialog + tw-animate-css or Motion | iOS `.sheet` with detents; Android `ModalBottomSheet` |
| Sheet / drawer | slides from edge with spring, drag-to-dismiss on touch | shadcn Sheet / Vaul drawer | native sheets, swipe-down to dismiss |
| Toast | slides+fades in from its edge, stacks, auto-dismiss with a progress affordance, swipe away | Sonner (shadcn) | iOS banner-style overlay; Android Snackbar |
| Accordion / disclosure | height animates (auto), chevron rotates 180° 200ms | Radix Accordion + `animate-accordion-down/up` | SwiftUI `DisclosureGroup` |
| List add / remove / reorder | items enter fade+8px rise staggered 30ms, exit collapse, reorder via layout animation | Motion `AnimatePresence` + `layout`, AutoAnimate | Reanimated `Layout`/`Entering`/`Exiting`; SwiftUI `.animation(.default, value: items)` |
| Loading → content | skeleton in the final layout, shimmer, content cross-fades in 200ms; never layout shift | shadcn Skeleton | RN skeleton (Moti), SwiftUI `.redacted(reason: .placeholder)` |
| Numbers / metrics | count/roll to new value 400–600ms, tabular numerals | Number Flow, Motion `animate()` | SwiftUI `.contentTransition(.numericText())`; Compose `AnimatedContent` |
| Charts | draw-in on first view 600–900ms (lines stroke, bars grow from baseline, staggered), tooltip follows pointer smoothly, hover dims siblings | Recharts/visx `isAnimationActive`, Motion | Swift Charts animations; Victory Native |
| Cards (clickable) | hover lift 2–4px + shadow deepen 200ms, image subtle zoom 1.03 | `hover:-translate-y-0.5` + shadow token | press scale .98 + haptic |
| Drag / swipe | follows finger 1:1, rubber-band at limits, snaps with velocity | use-gesture / dnd-kit | Gesture Handler + Reanimated; SwiftUI `DragGesture` |
| Pull to refresh | native control, brand-tinted | — | `RefreshControl` / `.refreshable` |
| Copy / success actions | icon morphs to check 1.2s then back | Motion `AnimatePresence mode="wait"` | SF Symbol `.symbolEffect(.bounce)` / `.contentTransition(.symbolEffect(.replace))` |
| Empty / error states | illustration or icon eases in; retry button gets the button rules | — | — |

## Page and screen transitions

| Platform | Transition | How |
|---|---|---|
| Next.js marketing | curtain or mask wipe (CRAFT R6) | client wrapper intercepting links, or View Transitions API |
| Next.js / React app UI | content cross-fade + 8px rise 200–250ms, persistent shell (sidebar/nav) never animates; shared element for list → detail | `next-view-transitions` / React `ViewTransition` (`vercel-react-view-transitions`), or Motion `AnimatePresence` keyed on pathname |
| Vue / Nuxt | `<Transition>` on `<NuxtPage>` / route view transitions | Nuxt `pageTransition` |
| SvelteKit | `onNavigate` + `document.startViewTransition` | — |
| Expo / React Native | native stack push/pop, modal presentation, shared element where it explains (list → detail) | Expo Router stack options, Reanimated shared transitions |
| SwiftUI | `NavigationStack` push, `.navigationTransition(.zoom(sourceID:in:))` for detail views, `matchedGeometryEffect` | — |
| Compose | Navigation `enterTransition`/`exitTransition`, shared element transitions | `SharedTransitionLayout` |
| Flutter | `PageTransitionsTheme` per platform, `Hero` for shared elements | `animations` package `OpenContainer` |
| Desktop (Tauri/Electron) | pane/content cross-fade, no full-window wipes | same as web app UI |

Route transitions must not delay input: the new route is interactive as soon as it renders, and
`prefers-reduced-motion` / OS reduce-motion swaps movement for an opacity cross-fade.

## Haptics (mobile)

Selection change → selection haptic; success/failure of a meaningful action → notification haptic;
destructive confirm → warning. Never on scroll, never on every keystroke.
Expo: `expo-haptics`; SwiftUI: `.sensoryFeedback`; Android: `HapticFeedbackConstants`.

## Verification

`node scripts/motion-audit.mjs <url>` (G22) hovers, focuses and presses every interactive element on
the rendered page and reports which ones show no state change, which use `transition: all`, which run
longer than 500ms, whether a route transition exists, and whether reduced motion is honoured.
Native: record a screen video or before/after screenshots of each component state in
`native-evidence.json -> microInteractions`.
