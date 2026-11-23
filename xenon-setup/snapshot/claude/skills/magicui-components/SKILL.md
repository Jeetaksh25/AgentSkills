---
disable-model-invocation: true
name: magicui-components
description: Reference MagicUI animated React components (marquee, border beam, sparkles, number ticker, particles, beams, globe, etc.) with exact props, keyframes, and copy-paste patterns when building modern animated marketing/landing UIs.
---

# MagicUI Components

MagicUI is a free, open-source component library of 70+ animated, modern React
components built on the **shadcn/ui** CLI workflow. Components are copied into
your project at `@/components/ui/*` (or `@/registry/magicui/*` in the docs) — they
are not an npm runtime dependency. They are composed from **Tailwind CSS v4**,
**framer-motion** (motion), and (for a few) **Cobe** (WebGL globe) /
**canvas 2D** (particles, confetti). MagicUI is best understood as "shadcn/ui +
animation presets + a registry of `@keyframes` definitions."

## When to invoke this skill

Invoke when the task involves building or refining **animated, high-polish
React UI**: landing-page hero sections, marketing sites, product showcases,
testimonial marquees, "social proof" avatar stacks, animated stats/counters,
feature bento grids, device mockups, or any UI that wants the modern
"animated SaaS landing" aesthetic. Also invoke when integrating or debugging
MagicUI components specifically (wrong prop, missing keyframe, beam not
rendering, marquee not scrolling, etc.).

Do **not** invoke for: plain shadcn/ui (non-animated) primitives, admin
dashboards where motion is a distraction, or accessibility-strict contexts
(reduced-motion) without reading the anti-patterns below.

## Core principles

1. **Copy-in, not install-from-npm.** Every component is added via
   `pnpm dlx shadcn@latest add @magicui/<name>` and lands as source in your
   repo. You own and edit it. The `@/lib/utils` `cn()` helper (shadcn's
   clsx+tailwind-merge) is required — it ships with `shadcn init`.
2. **Animation lives in CSS `@keyframes`, registered via Tailwind v4
   `@theme inline`.** MagicUI does not ship JS-driven keyframes for most
   effects. It defines `@keyframes` in a global CSS file and registers them as
   Tailwind animation utilities like `animate-marquee`, `animate-meteor`,
   `animate-shimmer-slide`. When you add a component the CLI injects the
   needed keyframes; when you build a **custom** animated component you must
   add the matching `@keyframes` + `@theme inline` entry yourself. The full
   keyframe catalog is in `references/component-catalog.md`.
3. **`relative` + `overflow-hidden` is the law.** Every full-bleed effect
   component (BorderBeam, ShineBorder, Meteors, Particles, AnimatedBeam, Globe,
   MagicCard) must be a child of a `relative overflow-hidden` container, or it
   will paint outside bounds and look broken.
4. **Theme-awareness via `next-themes`.** Many demos call `useTheme()` and pick
   colors for dark/light (`theme === "dark" ? "#262626" : "#D9D9D955"`). Always
   render the theme-dependent branch behind a mounted guard to avoid SSR
   hydration mismatch (`const [mounted,setMounted]=useState(false);
   useEffect(()=>setMounted(true),[])`).
5. **Composable, not opinionated.** Components expose `className` everywhere
   and accept arbitrary children. Style with Tailwind utility classes; pass
   CSS custom properties via bracket notation (`[--duration:20s]`,
   `[--gap:1rem]`).
6. **framer-motion `Variants` is the extension point.** TextAnimate,
   BlurFade, NumberTicker etc. accept `variants`/`transition` props for custom
   motion. Index-based variant functions `(i)=>({...})` enable per-segment
   stagger.

## Installation setup (one-time)

```bash
# 1. shadcn base (if not already in project)
pnpm dlx shadcn@latest init

# 2. add any MagicUI component (auto-installs deps + injects keyframes)
pnpm dlx shadcn@latest add @magicui/marquee
pnpm dlx shadcn@latest add @magicui/border-beam
pnpm dlx shadcn@latest add @magicui/number-ticker
# ...etc — one per component
```

The CLI handles dependency installation (framer-motion/motion, cobe, etc.) and
injects the required `@keyframes` + `@theme inline { --animate-* }` into your
global CSS. **If you copy a component source manually, you must also copy its
keyframes** — see `references/component-catalog.md`.

Import path in your app: `@/components/ui/<name>` (the docs use
`@/registry/magicui/<name>` — same file, different alias).

## Quick recipes (copy-paste)

### Two-row testimonial marquee (the canonical MagicUI pattern)

```tsx
import { Marquee } from "@/components/ui/marquee"

// container: [--duration:20s]; edge-fade via gradient overlay siblings
<div className="relative flex h-[500px] w-full flex-col items-center justify-center gap-4 overflow-hidden">
  <Marquee pauseOnHover className="[--duration:20s]">
    {firstRow.map((r) => <ReviewCard key={r.username} {...r} />)}
  </Marquee>
  <Marquee reverse pauseOnHover className="[--duration:20s]">
    {secondRow.map((r) => <ReviewCard key={r.username} {...r} />)}
  </Marquee>
  {/* edge fades */}
  <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background" />
  <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background" />
</div>
```

### Border beam on a login card

```tsx
import { BorderBeam } from "@/components/ui/border-beam"

<Card className="relative w-[350px] overflow-hidden">
  {/* ...form content... */}
  <BorderBeam duration={8} size={100} />
</Card>
```

### Animated count-up stat

```tsx
import { NumberTicker } from "@/components/ui/number-ticker"

<NumberTicker value={5.67} decimalPlaces={2}
  className="text-8xl font-medium tracking-tighter" />
```

### Sparkles on a headline

```tsx
import { SparklesText } from "@/components/ui/sparkles-text"

<SparklesText sparklesCount={15}
  colors={{ first: "#A07CFE", second: "#FE8FB5" }}>
  Ship faster
</SparklesText>
```

### Connection beam between two nodes

```tsx
const containerRef = useRef<HTMLDivElement>(null)
const fromRef = useRef<HTMLDivElement>(null)
const toRef = useRef<HTMLDivElement>(null)

<div ref={containerRef} className="relative flex w-full items-center justify-center overflow-hidden p-10">
  <div ref={fromRef} className="z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]">A</div>
  <div ref={toRef} className="z-10 flex size-12 ...">B</div>
  <AnimatedBeam containerRef={containerRef} fromRef={fromRef} toRef={toRef}
    duration={3} curvature={-20} startYOffset={10} endYOffset={10} />
</div>
```
- Bi-directional: render a second `<AnimatedBeam>` with `reverse` and mirrored
  offsets (positive curvature, negative startY/endY).
- Hub layout (one center node, many edges): give each edge its own
  `<AnimatedBeam>` + ref pair.

### Staggered blur-in gallery / section headers

```tsx
import { BlurFade } from "@/components/ui/blur-fade"

// gallery — stagger with index
{images.map((url, i) => (
  <BlurFade key={url} delay={0.25 + i * 0.05} inView>
    <img src={url} className="mb-4 size-full rounded-lg object-contain" />
  </BlurFade>
))}

// header text — multiply delay per line
<BlurFade delay={0.25} inView><h2 className="text-5xl font-bold tracking-tighter">Hello</h2></BlurFade>
<BlurFade delay={0.5} inView><span className="text-3xl tracking-tighter">Nice to meet you</span></BlurFade>
```

### Text animation presets

```tsx
<TextAnimate animation="blurInUp" by="character" once>Blur in by character</TextAnimate>
<TextAnimate animation="slideUp" by="word">Slide up by word</TextAnimate>
<TextAnimate animation="fadeIn" by="line" as="p">{"Line one\n\nLine two"}</TextAnimate>
// custom springy variants (framer-motion Variants, index-based for stagger):
<TextAnimate by="character" variants={{
  hidden: { opacity:0, y:30, rotate:45, scale:0.5 },
  show: (i) => ({ opacity:1, y:0, rotate:0, scale:1,
    transition: { delay:i*0.1, duration:0.4,
      y: { type:"spring", damping:12, stiffness:200, mass:0.8 } } }),
}} >Wavy Motion!</TextAnimate>
```
Animation presets: `fadeIn`, `blurIn`, `blurInUp`, `slideUp`, `slideLeft`,
`scaleUp`. Split via `by`: `text | word | character | line`.

### Spotlight card (gradient or orb glow)

```tsx
import { MagicCard } from "@/components/ui/magic-card"

<MagicCard gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"} className="p-0">
  {/* content */}
</MagicCard>

// orb glow mode
<MagicCard mode="orb" glowFrom="#ee4f27" glowTo="#6b21ef" className="p-0">
  {/* content */}
</MagicCard>
```

### Background particles (canvas)

```tsx
import { Particles } from "@/components/ui/particles"

<div className="relative flex h-[500px] w-full overflow-hidden rounded-lg border">
  <Particles className="absolute inset-0 z-0" quantity={100} ease={80} color={color} refresh />
  <span className="pointer-events-none z-10 ...">Particles</span>
</div>
```
- `ease` higher = particles lag mouse more; `staticity` higher = more resistant
  to displacement; `vx`/`vy` apply constant drift.

### Meteors background

```tsx
<div className="relative flex h-[500px] w-full overflow-hidden rounded-lg border">
  <Meteors number={30} />
</div>
```

### Shimmer button

```tsx
<ShimmerButton shimmerColor="#ffffff" shimmerDuration="3s" borderRadius="100px"
  background="rgba(0,0,0,1)" className="shadow-2xl">
  <span className="text-sm font-medium tracking-tight text-white">Shimmer Button</span>
</ShimmerButton>
```

## Component-by-component prop reference

See `references/component-catalog.md` for the **full 70-component catalog**
with categories, one-line descriptions, and the keyframes each one uses. The
high-traffic components with complete prop tables:

| Component | Key props (type / default) | Keyframe / engine |
|---|---|---|
| **Marquee** | `reverse=false` `pauseOnHover=false` `vertical=false` `repeat=4` `className`; CSS vars `[--duration:40s]` `[--gap:1rem]` | `@keyframes marquee` / `marquee-vertical` |
| **BorderBeam** | `size=50` `duration=6` `delay=0` `colorFrom="#ffaa40"` `colorTo="#9c40ff"` `reverse=false` `initialOffset=0` `borderWidth=1` `transition` `style` | framer-motion stroke gradient |
| **NumberTicker** | `value=0` `direction="up"` `delay=0` `decimalPlaces=0` `startValue=0` `className` | framer-motion count |
| **SparklesText** | `children` `sparklesCount=10` `colors={{first:"#A07CFE",second:"#FE8FB5"}}` `className` | internal (random spawn) |
| **AnimatedBeam** | `containerRef` `fromRef` `toRef` (all required) `curvature=0` `duration` `reverse=false` `startYOffset=0` `endYOffset=0` | framer-motion SVG path dash |
| **MagicCard** | `mode="gradient"\|"orb"` `gradientSize=200` `gradientColor="#262626"` `gradientOpacity=0.8` `gradientFrom/To` `glowFrom/To/Size/Blur/Opacity/Angle` | mouse-tracking gradient |
| **Particles** | `quantity=100` `staticity=50` `ease=50` `size=0.4` `refresh=false` `color="#ffffff"` `vx=0` `vy=0` | canvas rAF |
| **Meteors** | `number=20` `minDelay=0.2` `maxDelay=1.2` `minDuration=2` `maxDuration=10` `angle=215` `className` | `@keyframes meteor` |
| **BlurFade** | `duration=0.4` `delay=0` `offset=6` `direction="down"` `inView=false` `inViewMargin="-50px"` `blur="6px"` `variant` | framer-motion |
| **ShineBorder** | `duration=14` `shineColor="#000000"\|string[]` `borderWidth=1` `style` | `@keyframes shine` |
| **TextAnimate** | `delay=0` `duration=0.3` `by="word"` `as="p"` `startOnView=true` `once=false` `animation="fadeIn"` `accessible=true` `variants` | framer-motion variants |
| **ShimmerButton** | `shimmerColor="#ffffff"` `shimmerSize="0.05em"` `borderRadius="100px"` `shimmerDuration="3s"` `background="rgba(0,0,0,1)"` | `@keyframes shimmer-slide` + `spin-around` |
| **Globe** | `className` `config={}` (Cobe `COBEOptions`) | Cobe WebGL |

### Full category map (70 components)

- **Components (16):** Marquee, Terminal, Hero Video Dialog, Bento Grid, Animated List, Dock, Globe, Tweet Card, Orbiting Circles, Avatar Circles, Icon Cloud, Lens, Pointer, Smooth Cursor, Progressive Blur, Dotted Map.
- **Special Effects (9):** Animated Beam, Border Beam, Shine Border, Magic Card, Glare Hover, Meteors, Confetti, Particles, Animated Theme Toggler.
- **Animations (1):** Blur Fade.
- **Text Animations (18):** Text Animate, Typing Animation, Line Shadow Text, Aurora Text, Video Text, Number Ticker, Animated Shiny Text, Animated Gradient Text, Text Reveal, Dia Text Reveal, Hyper Text, Word Rotate, Scroll Based Velocity, Sparkles Text, Morphing Text, Spinning Text, Text Highlighter, Text 3D Flip.
- **Device Mocks (3):** Safari, iPhone, Android.
- **Buttons (3):** Rainbow Button, Shimmer Button, Ripple Button.
- **Backgrounds (11):** Flickering Grid, Animated Grid Pattern, Retro Grid, Ripple, Dot Pattern, Grid Pattern, Hexagon Pattern, Striped Pattern, Interactive Grid Pattern, Light Rays, Noise Texture.
- **Community (12):** Shiny Button, File Tree, Code Comparison, Scroll Progress, Neon Gradient Card, Comic Text, Kinetic Text, Cool Mode, Pixel Image, Pulsating Button, Warp Background, Interactive Hover Button, Animated Circular Progress Bar, Backlight, Glyph Matrix.

## Anti-patterns to avoid (anti-AI-slop)

1. **Forgetting `relative overflow-hidden` on the parent.** This is the #1 bug.
   BorderBeam/ShineBorder/Meteors/Particles/AnimatedBeam/Globe/MagicCard all
   absolutely-position themselves and need clipping. Without it the effect
   spills outside the card / leaks into neighbors.
2. **Hardcoding colors instead of theme-aware.** Use `bg-background`,
   `text-foreground`, `border-border`, and `next-themes` `useTheme()` for
   effect colors. Demo hardcodes like `bg-white` only work in light mode.
3. **SSR hydration mismatch on theme-dependent renders.** `useTheme()` is
   undefined during SSR; guard with a `mounted` flag or the value flashes / the
   tree throws.
4. **No reduced-motion fallback.** Motion-heavy pages are hostile to
   vestibular-sensitive users. Wrap motion in `@media (prefers-reduced-motion:
   reduce)` or gate behind a setting. MagicUI itself does not enforce this.
5. **Stacking too many effects.** Meteors + Particles + BorderBeam + Shimmer
   Button + animated gradient text on one card is visual noise, not polish.
   Pick **one** signature effect per section.
6. **Over-animating data UI.** NumberTicker on a live KPI that updates
   frequently causes constant re-count noise. Use it for on-mount/hero stats,
   not streaming dashboards.
7. **Using npm install instead of the shadcn CLI.** There is no `magicui`
   runtime package to `npm i`. The components are source you own. If you
   `npm i magicui` you'll get a unrelated/unmaintained package.
8. **Editing the copied source and expecting `shadcn add` to upgrade it.** Once
   copied in, the component is yours; re-adding will overwrite your edits.
9. **Not adding keyframes for custom animations.** If you build a custom
   animated element referencing `animate-foo`, you must add both `@keyframes
   foo {…}` and `@theme inline { --animate-foo: foo …; }` to global CSS. The
   `animate-*` utilities come from the `@theme inline` registration, not from a
   class hardcoded in Tailwind core.
10. **Ignoring `pointer-events-none` on overlay layers.** Edge-fade gradients
    and text overlays must be `pointer-events-none` or they steal clicks from
    the marquee/cards beneath.

## Dependencies the CLI installs

- `framer-motion` (now `motion`) — drives AnimatedBeam, NumberTicker,
  BlurFade, TextAnimate, BorderBeam, MagicCard, OrbitingCircles, Ripple, etc.
- `cobe` — Globe (WebGL). `react` wrapper uses a `useRef` + rAF.
- `next-themes` — theme-aware color selection (optional but idiomatic).
- `clsx` + `tailwind-merge` — behind the `cn()` helper from `@/lib/utils`.
- `lucide-react` — icons used by some demos (Dock, File Tree).

## Where to look up the rest

- Full prop tables + every `@keyframes` definition + the `@theme inline`
  animation variable map: `references/component-catalog.md`.
- Live docs: `https://magicui.design/docs/components/<kebab-name>`.
- Source registry: `github.com/magicuidesign/magicui` →
  `apps/www/registry/magicui/<name>.tsx`. Keyframes live in
  `apps/www/styles/globals.css`.