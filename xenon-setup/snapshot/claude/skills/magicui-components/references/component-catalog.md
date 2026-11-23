# MagicUI Component Catalog & Keyframes Reference

Distilled from `https://magicui.design/docs` and the source registry at
`github.com/magicuidesign/magicui` (`apps/www/registry/magicui/*.tsx` and
`apps/www/styles/globals.css`). 70 components across 9 categories.

## How MagicUI animations are wired

MagicUI uses **Tailwind CSS v4** `@theme inline` to register animation
utilities. Each animated component references a class like `animate-marquee`,
which is *not* a built-in Tailwind utility — it is generated from a
`--animate-<name>` variable inside `@theme inline`, which names a `@keyframes`
block. So a self-contained setup needs three things in global CSS:

```css
/* 1. the keyframes */
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(calc(-100% - var(--gap))); } }

/* 2. the @theme inline registration (Tailwind v4 generates the animate-* utility) */
@theme inline {
  --animate-marquee: marquee var(--duration) infinite linear;
}
```

Then `className="animate-marquee"` works. The `shadcn add @magicui/<name>`
command injects both for you; if you copy source manually you must add them.

---

## Complete @keyframes catalog (from globals.css)

```css
@keyframes blink-cursor {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
@keyframes aurora {
  0%   { background-position: 0% 50%; transform: rotate(-5deg) scale(0.9); }
  25%  { background-position: 50% 100%; transform: rotate(5deg) scale(1.1); }
  50%  { background-position: 100% 50%; transform: rotate(-3deg) scale(0.95); }
  75%  { background-position: 50% 0%; transform: rotate(3deg) scale(1.05); }
  100% { background-position: 0% 50%; transform: rotate(-5deg) scale(0.9); }
}
@keyframes accordion-down { from { height: 0; } to { height: var(--radix-accordion-content-height); } }
@keyframes accordion-up   { from { height: var(--radix-accordion-content-height); } to { height: 0; } }
@keyframes background-position-spin { 0% { background-position: top center; } 100% { background-position: bottom center; } }
@keyframes gradient { to { background-position: var(--bg-size, 300%) 0; } }
@keyframes meteor {
  0%   { transform: rotate(var(--angle)) translateX(0); opacity: 1; }
  70%  { opacity: 1; }
  100% { transform: rotate(var(--angle)) translateX(-500px); opacity: 0; }
}
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(calc(-100% - var(--gap))); } }
@keyframes marquee-vertical { from { transform: translateY(0); } to { transform: translateY(calc(-100% - var(--gap))); } }
@keyframes spin-around {
  0%          { transform: translateZ(0) rotate(0); }
  15%, 35%    { transform: translateZ(0) rotate(90deg); }
  65%, 85%    { transform: translateZ(0) rotate(270deg); }
  100%        { transform: translateZ(0) rotate(360deg); }
}
@keyframes ripple { 0%,100% { transform: translate(-50%,-50%) scale(1); } 50% { transform: translate(-50%,-50%) scale(0.9); } }
@keyframes rippling { 0% { opacity: 1; } 100% { transform: scale(2); opacity: 0; } }
@keyframes shimmer-slide { to { transform: translate(calc(100cqw - 100%), 0); } }
@keyframes line { 0% { mask-position-x: 0%; } 100% { mask-position-x: 100%; } }
@keyframes shiny-text {
  0%, 90%, 100% { background-position: calc(-100% - var(--shiny-width)) 0; }
  30%, 60%     { background-position: calc(100% + var(--shiny-width)) 0; }
}
@keyframes orbit {
  0%   { transform: rotate(calc(var(--angle) * 1deg)) translateY(calc(var(--radius) * 1px)) rotate(calc(var(--angle) * -1deg)); }
  100% { transform: rotate(calc(var(--angle) * 1deg + 360deg)) translateY(calc(var(--radius) * 1px)) rotate(calc((var(--angle) * -1deg) - 360deg)); }
}
@keyframes shine { 0% { background-position: 0% 0%; } 50% { background-position: 100% 100%; } to { background-position: 0% 0%; } }
@keyframes pulse {
  0%,100% { box-shadow: 0 0 0 0 var(--pulse-color, oklch(from var(--bg) l c h / 0.5)); }
  50%     { box-shadow: 0 0 0 var(--distance) var(--pulse-color, oklch(from var(--bg) l c h / 0.5)); }
}
@keyframes pulse-ripple {
  0%   { box-shadow: 0 0 0 0 oklch(from var(--pulse-color, var(--bg)) l c h / 1); }
  100% { box-shadow: 0 0 0 var(--distance) oklch(from var(--pulse-color, var(--bg)) l c h / 0); }
}
@keyframes rainbow { 0% { background-position: 0%; } 100% { background-position: 200%; } }
@keyframes line-shadow { 0% { background-position: 0 0; } 100% { background-position: 100% -100%; } }
@keyframes ping { 75%,100% { transform: scale(2); opacity: 0; } }
```

### `@theme inline` animation variable map

```css
@theme inline {
  --animate-accordion-down: accordion-down 0.2s ease-out;
  --animate-accordion-up: accordion-up 0.2s ease-out;
  --animate-gradient: gradient 8s linear infinite;
  --animate-meteor: meteor 5s linear infinite;
  --animate-marquee: marquee var(--duration) infinite linear;
  --animate-marquee-vertical: marquee-vertical var(--duration) linear infinite;
  --animate-spin-around: spin-around calc(var(--speed) * 2) infinite linear;
  --animate-shiny-text: shiny-text 8s infinite;
  --animate-shimmer-slide: shimmer-slide var(--speed) ease-in-out infinite alternate;
  --animate-ripple: ripple var(--duration, 2s) ease calc(var(--i, 0) * 0.2s) infinite;
  --animate-rippling: rippling var(--duration, 0.6s) ease-out;
  --animate-line: line 2s linear infinite;
  --animate-orbit: orbit calc(var(--duration) * 1s) linear infinite;
  --animate-background-position-spin: background-position-spin 3000ms infinite alternate;
  --animate-shine: shine var(--duration) infinite linear;
  --animate-pulse: pulse var(--duration) ease-out infinite;
  --animate-pulse-ripple: pulse-ripple var(--duration) cubic-bezier(0.16, 1, 0.3, 1) infinite;
  --animate-rainbow: rainbow var(--speed, 2s) infinite linear;
  --animate-line-shadow: line-shadow 15s linear infinite;
  --animate-aurora: aurora 8s ease-in-out infinite alternate;
  --animate-ping: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
  --animate-blink-cursor: blink-cursor 1.2s step-end infinite;
}
```

### Keyframe → component mapping

| Keyframe | Used by |
|---|---|
| `marquee` / `marquee-vertical` | Marquee |
| `meteor` | Meteors |
| `shimmer-slide` + `spin-around` | ShimmerButton, ShinyButton |
| `shine` | ShineBorder |
| `aurora` | AuroraText |
| `rainbow` | RainbowButton |
| `ripple` / `rippling` | Ripple, RippleButton |
| `orbit` | OrbitingCircles |
| `line` | BorderBeam (mask sweep) |
| `line-shadow` | LineShadowText |
| `shiny-text` | AnimatedShinyText |
| `pulse` / `pulse-ripple` | PulsatingButton |
| `background-position-spin` | AnimatedGradientText |
| `gradient` | AnimatedGradientText |
| `blink-cursor` | TypingAnimation |
| `ping` | (radix/legacy) |

(Components not listed — BorderBeam core, NumberTicker, BlurFade, TextAnimate,
AnimatedBeam, MagicCard, Particles, Confetti, Globe, Icon Cloud — are driven
by framer-motion or canvas/WebGL rather than CSS keyframes.)

---

## Full component catalog (70)

### Components
- **Marquee** — scrolling horizontal/vertical carousel. Props: `reverse=false`, `pauseOnHover=false`, `vertical=false`, `repeat=4`, `className`. CSS vars `[--duration:40s]`, `[--gap:1rem]`. Anim: `marquee`/`marquee-vertical`.
- **Terminal** — animated terminal code display.
- **Hero Video Dialog** — video preview expanding into a modal dialog.
- **Bento Grid** — modular grid for feature showcases.
- **Animated List** — list items animate in sequentially.
- **Dock** — macOS-style floating dock nav.
- **Globe** — 3D WebGL globe. Props: `className`, `config: COBEOptions={}`. Built on Cobe.
- **Tweet Card** — styled tweet replica.
- **Orbiting Circles** — circles orbiting a center. Anim: `orbit` via `--angle`/`--radius`/`--duration`.
- **Avatar Circles** — stacked avatar group.
- **Icon Cloud** — 3D sphere of icons.
- **Lens** — magnifying lens over content.
- **Pointer** — custom animated cursor follower.
- **Smooth Cursor** — interpolated cursor trail.
- **Progressive Blur** — gradual blur effect.
- **Dotted Map** *(new)* — dotted world map.

### Special Effects
- **Animated Beam** — light beam connecting two refs. Props: `containerRef`, `fromRef`, `toRef` (required), `curvature=0`, `duration`, `reverse=false`, `startYOffset=0`, `endYOffset=0`. framer-motion SVG path.
- **Border Beam** — traveling border light. Props: `size=50`, `duration=6`, `delay=0`, `colorFrom="#ffaa40"`, `colorTo="#9c40ff"`, `reverse=false`, `initialOffset=0`, `borderWidth=1`, `transition`, `style`, `className`.
- **Shine Border** — gradient shine sweep. Props: `duration=14`, `shineColor="#000000"|string[]`, `borderWidth=1`, `style`, `className`. Anim: `shine`.
- **Magic Card** — spotlight hover card. Props: `mode="gradient"|"orb"`, `gradientSize=200`, `gradientColor="#262626"`, `gradientOpacity=0.8`, `gradientFrom="#9E7AFF"`, `gradientTo="#FE8BBB"`, `glowFrom="#ee4f27"`, `glowTo="#6b21ef"`, `glowAngle=90`, `glowSize=420`, `glowBlur=60`, `glowOpacity=0.9`.
- **Glare Hover** *(new)* — glare/reflection on hover.
- **Meteors** — falling meteor streaks. Props: `number=20`, `minDelay=0.2`, `maxDelay=1.2`, `minDuration=2`, `maxDuration=10`, `angle=215`, `className`. Anim: `meteor`.
- **Confetti** — burst confetti (canvas).
- **Particles** — floating particle background (canvas). Props: `quantity=100`, `staticity=50`, `ease=50`, `size=0.4`, `refresh=false`, `color="#ffffff"`, `vx=0`, `vy=0`, `className`.
- **Animated Theme Toggler** *(new)* — animated theme switch.

### Animations
- **Blur Fade** — blur fade-in. Props: `duration=0.4`, `delay=0`, `offset=6`, `direction="down"`, `inView=false`, `inViewMargin="-50px"`, `blur="6px"`, `variant`, `className`. framer-motion. Stagger pattern: `delay={0.25 + i*0.05}`.

### Text Animations
- **Text Animate** — general text anim. Props: `delay=0`, `duration=0.3`, `by="word"` (`text|word|character|line`), `as="p"`, `startOnView=true`, `once=false`, `animation="fadeIn"` (`fadeIn|blurIn|blurInUp|slideUp|slideLeft|scaleUp`), `accessible=true`, `variants`, `segmentClassName`.
- **Typing Animation** *(new)* — typing effect. Anim: `blink-cursor`.
- **Line Shadow Text** — layered line shadow text. Anim: `line-shadow`.
- **Aurora Text** — animated aurora gradient text. Anim: `aurora`.
- **Video Text** — text filled with video texture.
- **Number Ticker** — count up/down. Props: `value=0`, `direction="up"`, `delay=0`, `decimalPlaces=0`, `startValue=0`, `className`.
- **Animated Shiny Text** — shimmer sweep. Anim: `shiny-text`.
- **Animated Gradient Text** — shifting gradient text. Anim: `background-position-spin` / `gradient`.
- **Text Reveal** — scroll-triggered text reveal.
- **Dia Text Reveal** *(new)* — dialog text reveal.
- **Hyper Text** — glitchy/decoded transition.
- **Word Rotate** — rotating word cycle.
- **Scroll Based Velocity** — scroll-driven text movement.
- **Sparkles Text** — twinkling sparkles. Props: `children`, `sparklesCount=10`, `colors={{first:"#A07CFE", second:"#FE8FB5"}}`, `className`.
- **Morphing Text** — smooth text morphing.
- **Spinning Text** — circular spinning text.
- **Text Highlighter** *(new)* — animated highlighting.
- **Text 3D Flip** *(new)* — 3D card-flip text transition.

### Device Mocks
- **Safari**, **iPhone**, **Android** — device frame mockups (browser/phone shells for screenshots/previews).

### Buttons
- **Rainbow Button** — animated rainbow gradient. Anim: `rainbow`.
- **Shimmer Button** — shimmering light sweep. Props: `shimmerColor="#ffffff"`, `shimmerSize="0.05em"`, `borderRadius="100px"`, `shimmerDuration="3s"`, `background="rgba(0,0,0,1)"`, `className`, `children`. Anim: `shimmer-slide` + `spin-around`.
- **Ripple Button** — radiating ripple. Anim: `ripple`/`rippling`.

### Backgrounds
- **Flickering Grid** — flickering grid cells (canvas).
- **Animated Grid Pattern** — slow-moving grid. Props include `squares`, `direction` (diagonal), `speed`. Anim: CSS transform.
- **Retro Grid** — perspective retro grid.
- **Ripple** — expanding ripple background. Anim: `ripple`.
- **Dot Pattern** — repeating dots (SVG mask pattern; pair with `mask-image` for fades).
- **Grid Pattern** — repeating grid lines (SVG mask pattern).
- **Hexagon Pattern** *(new)* — honeycomb hexagons.
- **Striped Pattern** *(new)* — diagonal stripes.
- **Interactive Grid Pattern** — cursor-reactive grid.
- **Light Rays** *(new)* — radiating light rays.
- **Noise Texture** *(new)* — subtle grain overlay.

DotPattern / GridPattern usage idiom (common in MagicUI demos):
```tsx
<div className="relative ...">
  <DotPattern className="[mask-image:radial-gradient(white,transparent)] ..." />
</div>
```

### Community
- **Shiny Button** — glossy shine reflection.
- **File Tree** — collapsible directory view (radix Collapsible).
- **Code Comparison** — side-by-side diff.
- **Scroll Progress** — reading progress bar.
- **Neon Gradient Card** — neon glow border card.
- **Comic Text** — comic-book text effect.
- **Kinetic Text** *(new)* — kinetic typography.
- **Cool Mode** — click/tap confetti burst.
- **Pixel Image** — pixelated/retro image.
- **Pulsating Button** — pulsing scale. Anim: `pulse`.
- **Warp Background** — warping/distorting bg.
- **Interactive Hover Button** — animated hover state.
- **Animated Circular Progress Bar** — circular progress.
- **Backlight** *(new)* — backlit glow behind content.
- **Glyph Matrix** *(new)* — matrix falling-glyph animation.

---

## Source file map (registry)

Component sources: `apps/www/registry/magicui/<name>.tsx` (e.g.
`marquee.tsx`, `meteors.tsx`, `shimmer-button.tsx`, `animated-beam.tsx`,
`border-beam.tsx`, `magic-card.tsx`, `particles.tsx`, `number-ticker.tsx`,
`text-animate.tsx`, `blur-fade.tsx`, `globe.tsx`, `shine-border.tsx`).

Global keyframes + `@theme inline` registrations:
`apps/www/styles/globals.css`.

`cn()` helper: `apps/www/lib/utils.ts` (`clsx` + `tailwind-merge`).