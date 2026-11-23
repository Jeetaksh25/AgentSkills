# Aceternity UI — Component Catalog

109 components from https://ui.aceternity.com/components. Engine column:
**CSS** = pure Tailwind keyframes (`@theme inline` / `@keyframes`), no JS anim lib.
**Motion** = Framer Motion / `motion/react` runtime values (useMotionValue/useSpring/useTransform/useAnimationFrame/AnimatePresence).
**Mixed** = CSS ambient + Motion for the interactive bit.
Install any with `npx shadcn@latest add @aceternity/<slug>` (source copied into your repo).

## Backgrounds / ambiance (hero sections, CTAs)

| Component | Effect | Engine | Key props |
|---|---|---|---|
| Spotlight | Radial ellipse sweeps in once on load | CSS | `className`, `fill` |
| Spotlight New | Left/right configurable spotlight | Motion | — |
| Background Beams | SVG-path beams, infinite | Motion (pathLength) | `className` |
| Background Beams With Collision | Beams that explode/collide | Motion | — |
| Background Lines | SVG paths in wave pattern | Motion | — |
| Background Ripple Effect | Grid of cells ripple on click | Motion | — |
| Background Gradient Animation | Animated gradient position | CSS | — |
| Background Gradient | Animated gradient behind card/button | CSS | — |
| Background Boxes | Full-width boxes highlight on hover | Motion | — |
| Aurora Background | Southern-lights soft glow | CSS | — |
| Wavy Background | Moving wave layers | CSS | — |
| Vortex Background | Swirly vortex (CTA bg) | Motion | — |
| Meteors | Diagonal meteor streaks, loop | CSS | `number`, `className` |
| Shooting Stars and Stars Background | Shooting star over starfield | CSS | — |
| Sparkles | Configurable sparkle field | Motion | — |
| Dotted Glow Background | Dot grid + glow + opacity anim | CSS | — |
| Noise Background | Gradient + noise texture + motion | CSS | — |
| Grid and Dot Backgrounds | Static grid/dot section bg | CSS | — |
| Scales | Repeating diagonal/line pattern | CSS | — |
| Google Gemini Effect | SVG gemini-style effect | Motion | — |

## 3D / perspective / tilt cards

| Component | Effect | Engine | Key props |
|---|---|---|---|
| 3D Card Effect | Mouse rotate + per-item translateZ depth | Motion | `CardContainer`/`CardBody`/`CardItem`: `translateX/Y/Z`,`rotateX/Y/Z` |
| Wobble Card | Translates+scales on mousemove | Motion | `children`, `containerClassName`, `className` |
| Glare Card | Linear-style glare on hover | Motion | — |
| Comet Card | Perplexity-style 3D tilt | Motion | — |
| Evervault Card | Hover reveals encrypted text + gradient | Motion | — |
| Draggable Card | Tilt + drag, jumps at bounds | Motion | — |
| Card Spotlight | Radial-gradient spotlight reveal | CSS | — |
| Focus Cards | Hover focuses one, blurs rest | Motion | — |
| Expandable Cards | Click to expand | Motion | — |
| Card Stack | Cards stack at intervals (testimonials) | Motion | — |
| Card Hover Effect | Slide effect to hovered card | Motion | — |
| Glowing Stars Effect | Card stars animate on hover | Motion | — |
| Direction Aware Hover | Reveal direction follows cursor | Motion | — |

## Text effects

| Component | Effect | Engine | Key props |
|---|---|---|---|
| Text Generate Effect | Word-by-word staggered fade-in | Motion | `words`, `duration`, `filter`, `className` |
| Flip Words | Cycles through word list | Motion | `words` |
| Typewriter Effect | Typed-on-screen text | Motion | — |
| Encrypted Text | Gibberish→reveal | Motion | — |
| Container Text Flip | Flips words, animates width | Motion | — |
| Layout Text Flip | Word flip changes surrounding layout | Motion | — |
| Text Hover Effect | x.ai outline-gradient on hover | Motion | — |
| Pointer Highlight | Text highlights in view w/ pointer+border | Motion | — |
| Colourful Text | Multi-color filter+scale text | CSS | — |
| Squiggly Text | SVG turbulence/displacement, Motion animated | Motion | — |
| Canvas Text | Curved colored lines clipped to text | Canvas | — |
| Hero Highlight | Background highlight + text | Motion | — |
| Text Reveal Card | Mousemove reveals bottom text | Motion | — |
| Text Flipping Board | Vestaboard split-flap chars | Motion | — |

## Navigation / layout

| Component | Effect | Engine | Key props |
|---|---|---|---|
| Floating Dock | macOS-style nav dock | Motion | `items`, `className` |
| Floating Navbar | Hides on scroll-down, reveals on scroll-up | Motion | — |
| Resizable Navbar | Width changes on scroll | Motion | — |
| Navbar Menu | Children animate on hover (bignav) | Motion | — |
| Sidebar | Expand on hover, mobile + dark | Motion | — |
| Sticky Banner | Sticks top, hides on down-scroll | Motion | — |
| Notch | Floating notch w/ active states | Motion | — |
| Tabs (Animated Tabs) | Click tab, background animates | Motion | — |
| Bento Grid | Skewed grid + header | Motion | — |
| Layout Grid | Grid item animates on click (layoutId) | Motion | — |
| Timeline | Sticky header + scroll-follow beam | Motion | — |

## Buttons / inputs / forms

| Component | Effect | Engine | Key props |
|---|---|---|---|
| Moving Border | Gradient travels perimeter | Motion | `duration`(ms,2000),`borderRadius`(`1.75rem`),`as`,`borderClassName` |
| Hover Border Gradient | Expands to full gradient border on hover | CSS | — |
| Magnetic Button | Drifts toward cursor, springs back | Motion | — |
| Stateful Button | Loading→success states | Motion | — |
| Tailwind CSS Buttons | Curated button set | CSS | — |
| Glowing Effect | Border glow adapts to container | CSS | — |
| Gooey Input | Gooey-filter expanding search input | Motion | — |
| Placeholders And Vanish Input | Sliding placeholders + vanish on submit | Motion | — |
| File Upload | Grid bg + drag-drop + micro-interactions | Motion | — |
| Signup Form | shadcn input/label + Motion | Motion | — |

## Loaders

| Component | Effect | Engine | Key props |
|---|---|---|---|
| Loaders | Minimal loader set | CSS | — |
| Multi Step Loader | Step loader for long loads | Motion | — |

## Tooltips / pointers / previews

| Component | Effect | Engine | Key props |
|---|---|---|---|
| Animated Tooltip | Reveals on hover, follows pointer | Motion | `items: {id,name,designation,image}[]` |
| Tooltip Card | Card follows mouse on hover | Motion | — |
| Following Pointer | Custom pointer + animated content | Motion | — |
| Link Preview | Dynamic anchor previews | Motion | — |
| 3D Animated Pin | Gradient pin animates on hover | Motion | — |

## Scroll / parallax / reveal

| Component | Effect | Engine | Key props |
|---|---|---|---|
| Hero Parallax | Rotation+translation+opacity on scroll | Motion | — |
| Container Scroll Animation | 3D rotate on scroll | Motion | — |
| Macbook Scroll | Image comes out of screen (Fey.com) | Motion | — |
| Tracing Beam | Beam follows SVG, length w/ scroll speed | Motion | — |
| Sticky Scroll Reveal | Sticks while scrolling, text reveals | Motion | — |
| Parallax Scroll (Grid) | Two cols scroll opposite | Motion | — |
| Parallax Hero Images | Mouse-driven depth blur fade | Motion | — |

## Media / image / comparison

| Component | Effect | Engine | Key props |
|---|---|---|---|
| Lens | Zoom into image/video/anything | Motion | — |
| Compare | Slide/drag two-image compare | Motion | — |
| SVG Mask Effect | Cursor reveals underneath | Motion | — |
| Container Cover | Beams + space wrap children | Motion | — |
| Images Slider | Full-page keyboard-nav slider | Motion | — |
| Apple Cards Carousel | apple.com sleek carousel | Motion | — |
| Infinite Moving Cards | Infinite loop card marquee | Motion | — |
| Pixelated Canvas | Image→pixel canvas + mouse distortion | Canvas | — |
| Dither Shader | Ordered dithering, pixel/retro | WebGL | — |
| Webcam Pixel Grid | Real-time webcam pixel grid | Canvas | — |
| ASCII Art | Image→ASCII, charsets/colors/anim | Canvas | — |
| Code Block | react-syntax-highlighter block | — | — |
| Terminal | Mac terminal + bash highlight + typewriter | Motion | — |
| Keyboard | Mac keyboard + mechanical key sounds | Motion | — |
| Images Badge | Badge w/ images, hover reveals more | Motion | — |

## Globe / map

| Component | Effect | Engine | Key props |
|---|---|---|---|
| 3D Globe | Realistic globe + tooltips/avatar tips | three/mini.glb | — |
| GitHub Globe | Globe as on GitHub homepage | three | — |
| World Map | Animated lines+dots, programmatic | Motion | — |

## Bundled sections (free sets)

| Component | What | Engine |
|---|---|---|
| Feature Sections (Free) | Bento→simple feature layouts | Mixed |
| Hero Sections (Free) | Simple→complex hero layouts | Mixed |
| Cards (Free) | Multi-use card set | Mixed |

## Notes

- "Engine" reflects the dominant animation source; many components use a little CSS (transitions, blur) alongside Motion. When porting to a no-Motion project, the CSS-only ones (Spotlight, Meteors, Aurora, Wavy/Vortex bg, Sparkles-as-CSS, Grid/Dot, Scales, Colourful Text, Tailwind Buttons, Glowing Effect, Loaders, Hover Border Gradient) port with zero JS animation deps.
- `number`/count props (meteors, sparkles, background boxes) should randomize per-instance delay and start position — see SKILL.md anti-pattern #6.
- All components forward `className` through `cn()` (clsx + tailwind-merge) — keep that contract when editing.