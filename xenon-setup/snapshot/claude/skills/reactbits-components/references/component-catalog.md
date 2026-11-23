# ReactBits Component Catalog (139 components)

Source: reactbits.dev `llms.txt` + repo `DavidHDev/react-bits`. License: MIT + Commons Clause (free for personal & commercial use).

Every component ships in **4 variants** — pick your stack:

| Variant | Path | Use when |
|---|---|---|
| JS + CSS | `src/content` | No build tooling, plain CSS |
| JS + Tailwind | `src/tailwind` | Tailwind, no TS |
| TS + CSS | `src/ts-default` | Typed, plain CSS |
| TS + Tailwind | `src/ts-tailwind` | **Default recommendation** |

Install (copies source into your repo — not a dep):
```
npx shadcn@latest add https://reactbits.dev/r/<Component>-<LANG>-<STYLE>
npx jsrepo@latest add https://reactbits.dev/r/<Component>-<LANG>-<STYLE>
```
`<LANG>` = `JS`|`TS`, `<STYLE>` = `CSS`|`TW`. Page URL is kebab-case (`/text-animations/split-text`); CLI ID is PascalCase (`SplitText`).

---

## Text Animations (23)

| Name | CLI ID | Animation approach | Key props |
|---|---|---|---|
| ASCII Text | `ASCIIText` | Animated ASCII glyph background, retro | text, ascii chars |
| Blur Text | `BlurText` | Blurred → crisp resolve on scroll | text, delay, ease, blur |
| Circular Text | `CircularText` | Chars around a circle + rotation | text, radius, spin |
| Count Up | `CountUp` | Motion spring number counter | `to`, `from`, `duration`, `separator`, `startWhen`, `direction` |
| Curved Loop | `CurvedLoop` | Looping text along curve + drag | curve, drag |
| Decrypted Text | `DecryptedText` | Glyph scramble → resolve | text, speed, maxIterations, sequential |
| Falling Text | `FallingText` | Gravity + bounce per char | text, gravity |
| Fuzzy Text | `FuzzyText` | Vibration, hover intensity | text, baseIntensity, hoverIntensity |
| Glitch Text | `GlitchText` | RGB split + jitter | text, speed |
| Gradient Text | `GradientText` | Animated gradient sweep | text, colors, speed |
| Rotating Text | `RotatingText` | 3D rotate/flip phrase cycle | words, interval, transition |
| Scrambled Text | `ScrambledText` | Cursor-proximity distortion | text, radius |
| Scroll Float | `ScrollFloat` | Parallax float on scroll | text, scroll data |
| Scroll Reveal | `ScrollReveal` | Unblur reveal on scroll | text, threshold |
| Scroll Velocity | `ScrollVelocity` | Marquee; speed/distortion from scroll | texts, baseVelocity, scrollContainerRef |
| Shiny Text | `ShinyText` | Metallic sheen sweep | text, speed |
| Shuffle | `Shuffle` | Chars shuffle then settle | text, delay |
| Split Text | `SplitText` | GSAP split chars/words/lines stagger | `text`, `delay`, `duration`, `ease`, `splitType`, `from`, `to`, `threshold`, `rootMargin`, `tag`, `onLetterAnimationComplete` |
| Text Cursor | `TextCursor` | Text follows cursor leaving trail | text |
| Text Pressure | `TextPressure` | Char scale from pointer zone | text, radius |
| Text Type | `TextType` | Typewriter + blinking cursor | text, typingSpeed, blinkSpeed |
| True Focus | `TrueFocus` | Blur/clarity over word series | text, blur |
| Variable Proximity | `VariableProximity` | Letter styling by pointer distance | text, radius |

## Animations (31)

| Name | CLI ID | Animation approach | Key props |
|---|---|---|---|
| Animated Content | `AnimatedContent` | GSAP scroll wrapper, any children | `distance`, `direction`, `reverse`, `duration`, `ease`, `initialOpacity`, `animateOpacity`, `scale`, `threshold`, `delay`, `disappearAfter`, `disappearDuration`, `container`, `onComplete` |
| Antigravity | `Antigravity` | 3D particle field repels cursor | three.js |
| Blob Cursor | `BlobCursor` | Elastic blob follows pointer | |
| Click Spark | `ClickSpark` | Particle spark burst at click | sparkSize, sparkColor |
| Crosshair | `Crosshair` | Custom crosshair + link hover | |
| Cubes | `Cubes` | 3D rotating cube cluster | three.js, auto-rotate |
| Cursor Grid | `CursorGrid` | Canvas grid lights near cursor | radius, falloff |
| Electric Border | `ElectricBorder` | Jittery electric arcs + glow | color, intensity |
| Fade Content | `FadeContent` | Directional fade/slide wrapper | threshold, direction |
| Ghost Cursor | `GhostCursor` | Trailing ghost cursor | |
| Glare Hover | `GlareHover` | Glare highlight on hover | glare color |
| Gradual Blur | `GradualBlur` | Un-blur on scroll/trigger | blur amount |
| Image Trail | `ImageTrail` | Cursor image trail variants | images, variant |
| Laser Flow | `LaserFlow` | Flowing laser light | |
| Logo Loop | `LogoLoop` | Seamless marquee of logos | logos, speed, hover pause |
| Magic Rings | `MagicRings` | Interactive rings | |
| Magnet | `Magnet` | Spring ease toward cursor | padding, strength, radius |
| Magnet Lines | `MagnetLines` | Field lines bend to cursor | |
| Meta Balls | `MetaBalls` | Liquid metaballs merge/separate | three.js, color |
| Metallic Paint | `MetallicPaint` | Liquid metallic shader on SVG | |
| Noise | `Noise` | Film-grain noise overlay | opacity, grain size |
| Orbit Images | `OrbitImages` | SVG-path orbiting images | images, path |
| Pixel Trail | `PixelTrail` | Pixelated fading cursor trail | |
| Pixel Transition | `PixelTransition` | Pixel dissolve reveal on hover | |
| Ribbons | `Ribbons` | Physics ribbon cursor trail | |
| Shape Blur | `ShapeBlur` | Morphing blurred shape on hover | shape |
| Splash Cursor | `SplashCursor` | Liquid splash burst at cursor | |
| Star Border | `StarBorder` | CSS gradient "star" sweeps border | `color`, `speed`, `thickness`, `as`, `className` (Tailwind keyframes required) |
| Sticker Peel | `StickerPeel` | 3D corner lift + peel | |
| Strands | `Strands` | Glowing rippling strands | |
| Target Cursor | `TargetCursor` | 4-corner lock-on cursor | |

## Components (40)

| Name | CLI ID | Animation approach | Key props |
|---|---|---|---|
| Animated List | `AnimatedList` | Motion staggered variants | items |
| Border Glow | `BorderGlow` | Mesh-gradient border follows cursor | |
| Bounce Cards | `BounceCards` | Cards bounce in on mount | |
| Bubble Menu | `BubbleMenu` | Circular expanding menu | items |
| Card Nav | `CardNav` | Expandable nav w/ card panels | |
| Card Swap | `CardSwap` | Layout swap transitions | |
| Carousel | `Carousel` | Touch gestures + looping | |
| Chroma Grid | `ChromaGrid` | Grayscale → color on hover | items |
| Circular Gallery | `CircularGallery` | Orbit rotation gallery | images |
| Counter | `Counter` | Animated counter + easing | value |
| Curved Input | `CurvedInput` | Arc-bent input bar | |
| Decay Card | `DecayCard` | Hover disintegrate parallax | |
| Dock | `Dock` | macOS magnifying dock | items, proximity |
| Dome Gallery | `DomeGallery` | 3D hemispheric gallery | three.js |
| Elastic Slider | `ElasticSlider` | Stretch + snap slider | |
| Flowing Menu | `FlowingMenu` | Liquid active indicator | items |
| Fluid Glass | `FluidGlass` | Glassmorphism + liquid refraction | |
| Flying Posters | `FlyingPosters` | 3D posters rotate on scroll | three.js |
| Folder | `Folder` | Interactive folder reveal | |
| Glass Icons | `GlassIcons` | Frosted-glass icon set | |
| Glass Surface | `GlassSurface` | Apple-style glass + distortion | |
| Gooey Nav | `GooeyNav` | Gooey blob indicator morph | items |
| Infinite Menu | `InfiniteMenu` | Endless horizontal loop | items |
| Lanyard | `Lanyard` | Swinging 3D lanyard/badge | three.js |
| Line Sidebar | `LineSidebar` | Proximity highlight nav | items |
| Magic Bento | `MagicBento` | Bento tiles expand/animate | items |
| Masonry | `Masonry` | Animated reflow masonry | items, gap |
| Model Viewer | `ModelViewer` | three.js orbit + lighting | model src |
| Option Wheel | `OptionWheel` | Spinning curved picker | options |
| Pill Nav | `PillNav` | Sliding pill highlight | items |
| Pixel Card | `PixelCard` | Pixel expansion reveal | |
| Profile Card | `ProfileCard` | 3D hover + glare | avatar, name |
| Reflective Card | `ReflectiveCard` | Webcam reflection + glare | |
| Scroll Stack | `ScrollStack` | Overlapping stack on scroll | |
| Specular Button | `SpecularButton` | Shader rim light sweeps edge | |
| Spotlight Card | `SpotlightCard` | Pointer-tracked radial gradient | `className`, `spotlightColor` (`rgba(...)`) |
| Stack | `Stack` | Swipe stack + autoplay | items |
| Staggered Menu | `StaggeredMenu` | Staggered item open/close | items |
| Stepper | `Stepper` | Multi-step progress | steps, current |
| Tilted Card | `TiltedCard` | 3D perspective tilt on pointer | image, tilt |

## Backgrounds (45)

| Name | CLI ID | Animation approach | Key props |
|---|---|---|---|
| Aurora | `Aurora` | OGL GLSL simplex-noise shader, rAF | `colorStops[]`, `amplitude`, `blend`, `time`, `speed` |
| Balatro | `Balatro` | Balatro shader, interactive | |
| Ballpit | `Ballpit` | Physics ball-pit sim | three.js |
| Beams | `Beams` | Crossing animated ribbons | |
| Color Bends | `ColorBends` | Flowing color bends | |
| Dark Veil | `DarkVeil` | Dark + postprocessing | |
| Dither | `Dither` | Retro dithered noise shader | |
| Dot Field | `DotField` | Interactive dot grid, bulge/glow | |
| Dot Grid | `DotGrid` | Animated dot grid + cursor | |
| Evil Eye | `EvilEye` | Procedural eye shader | |
| Faulty Terminal | `FaultyTerminal` | CRT scanline + flicker | |
| Ferrofluid | `Ferrofluid` | Magnetic fluid + cursor magnet | |
| Floating Lines | `FloatingLines` | 3D lines react to cursor | three.js |
| Galaxy | `Galaxy` | Parallax starfield + pointer | |
| Gradient Blinds | `GradientBlinds` | Layered blinds + spotlight | |
| Grainient | `Grainient` | Grainy gradient swirls | |
| Grid Distortion | `GridDistortion` | Warped mesh reacts to cursor | |
| Grid Motion | `GridMotion` | Perspective grid lines | |
| Grid Scan | `GridScan` | 3D grid room scan | |
| Hyperspeed | `Hyperspeed` | Hold-click hyperspace lines | |
| Iridescence | `Iridescence` | Iridescent shifting-wave shader | |
| Letter Glitch | `LetterGlitch` | Matrix-style letters | |
| Lightfall | `Lightfall` | Light streaks in glowing tunnel | |
| Lightning | `Lightning` | Procedural branching bolts | |
| Light Pillar | `LightPillar` | Vertical pillar of light | |
| Light Rays | `LightRays` | Volumetric light rays | |
| Line Waves | `LineWaves` | Warped line-wave pattern | |
| Liquid Chrome | `LiquidChrome` | Liquid metallic chrome shader | |
| Liquid Ether | `LiquidEther` | Interactive liquid shader | |
| Orb | `Orb` | Floating energy orb + hover | |
| Particles | `Particles` | Configurable particle system | |
| Pixel Blast | `PixelBlast` | Exploding pixel bursts | |
| Pixel Snow | `PixelSnow` | Falling pixelated snow | |
| Plasma | `Plasma` | Plasma gradient swirl/morph | |
| Plasma Wave | `PlasmaWave` | Raymarched plasma, OGL | |
| Prism | `Prism` | Rotating prism | |
| Prismatic Burst | `PrismaticBurst` | Burst of light rays | |
| Radar | `Radar` | Radar sweep + rings/spokes | |
| Ripple Grid | `RippleGrid` | Continuous ripple grid | |
| Shape Grid | `ShapeGrid` | Grid w/ shape variants | shape, direction |
| Side Rays | `SideRays` | Side light rays | |
| Silk | `Silk` | Smooth waves + soft lighting | |
| Soft Aurora | `SoftAurora` | 3D Perlin aurora shader | |
| Threads | `Threads` | Fabric-like line pattern | |
| Waves | `Waves` | Layered smooth wave lines | |

---

## Dependency map (install before use)

| Tech | When a component needs it | npm |
|---|---|---|
| GSAP | SplitText, AnimatedContent, ScrollVelocity, most scroll-triggered reveals | `gsap @gsap/react` |
| Motion (Framer) | CountUp, AnimatedList, FadeContent, Dock, Stack enter/exit | `motion` (v11+ import `motion/react`) |
| three.js | MetaBalls, Cubes, DomeGallery, FlyingPosters, Lanyard, FloatingLines, Ballpit | `three` |
| ogl | Aurora, PlasmaWave, and most GLSL-shader backgrounds | `ogl` |
| (none) | StarBorder, SpotlightCard, GradientText, ShinyText, many CSS-only | — |