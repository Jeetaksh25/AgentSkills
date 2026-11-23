---
name: brilliant-design
description: Design system skill for brilliant. Activate when building UI components, pages, or any visual elements. Provides exact color tokens, typography scale, spacing grid, component patterns, and craft rules. Read references/DESIGN.md before writing any CSS or JSX. Includes ultra-mode visual journey: read references/ANIMATIONS.md, references/LAYOUT.md, references/COMPONENTS.md, and references/INTERACTIONS.md for full motion and layout details.
---

# brilliant Design System

You are building UI for **brilliant**. Light-themed, warm palette, sans-serif typography (KaTeX_Caligraphic), compact density on a 4px grid, expressive motion.

## Visual Reference

**IMPORTANT**: Study ALL screenshots below before writing any UI. Match colors, typography, spacing, layout, and motion exactly as shown.

### Homepage

![brilliant Homepage](screenshots/homepage.png)

### Scroll Journey (Cinematic Visual States)

> These screenshots capture the website at different scroll depths. The design changes dramatically as you scroll — each frame shows a different cinematic state. Replicate these exact visual transitions.

#### 0% — Hero / Above the fold

![Scroll 0%](screens/scroll/scroll-000.png)

#### 17% — Mid-page at 17% scroll

![Scroll 17%](screens/scroll/scroll-017.png)

#### 33% — Mid-page at 33% scroll

![Scroll 33%](screens/scroll/scroll-033.png)

#### 50% — Mid-page at 50% scroll

![Scroll 50%](screens/scroll/scroll-050.png)

#### 67% — Mid-page at 67% scroll

![Scroll 67%](screens/scroll/scroll-067.png)

#### 83% — Mid-page at 83% scroll

![Scroll 83%](screens/scroll/scroll-083.png)

#### 100% — Footer / End of page

![Scroll 100%](screens/scroll/scroll-100.png)

### Video Backgrounds (First Frames)

![Video 1 (content)](screens/scroll/video-1-frame.png)

> Read `references/DESIGN.md` for full token details. Read `references/ANIMATIONS.md` for motion specs. Read `references/LAYOUT.md` for layout structure. Read `references/COMPONENTS.md` for component patterns.

## Ultra Reference Files

This package includes extended documentation. **Read these files before implementing:**

| File | Contents |
|------|----------|
| `references/DESIGN.md` | Full design system tokens, colors, typography, spacing |
| `references/VISUAL_GUIDE.md` | **START HERE** — Master visual guide with all screenshots embedded |
| `references/ANIMATIONS.md` | CSS keyframes, scroll triggers, motion library stack, video specs |
| `references/LAYOUT.md` | Flex/grid containers, page structure, spacing relationships |
| `references/COMPONENTS.md` | DOM component patterns, HTML structure, class fingerprints |
| `references/INTERACTIONS.md` | Hover/focus states with before/after style diffs |
| `screens/scroll/` | 7 scroll journey screenshots showing cinematic states |

## Design Philosophy

- **Layered depth** — use shadow tokens to create a sense of physical layering. Each elevation level has a specific shadow.
- **Gradient accents** — gradients are used thoughtfully for emphasis, not decoration.
- **Type pairing** — KaTeX_Caligraphic for body/UI text, KaTeX_AMS for headings/display. Never introduce a third typeface.
- **compact density** — 4px base grid. Every dimension is a multiple of 4.
- **warm palette** — the color temperature runs warm, matching the sans-serif typography.
- **Restrained accent** — `#ffcc9c` is the only pop of color. Used exclusively for CTAs, links, focus rings, and active states.
- **Expressive motion** — animations are an integral part of the experience. Use spring physics and layout animations.

## Color System

### Core Palette

| Role | Token | Hex | Use |
|------|-------|-----|-----|
| Background | `--background` | `#ffffff` | Page/app background |
| Text Primary | `--text-primary` | `#000000` | Headings, body text |
| Text Muted | `--text-muted` | `#999999` | Captions, placeholders |
| Accent | `--accent` | `#ffcc9c` | CTAs, links, focus rings |

### Status Colors

| Status | Hex | Use |
|--------|-----|-----|
| Success | `#29cc57` | Confirmations, positive trends |
| Warning | `#fdf3d3` | Caution states, pending items |
| Danger | `#cc563d` | Errors, destructive actions |

### Extended Palette

- **panda-colors-orange-700:** `#ce6809`
- **panda-colors-red-300:** `#ffb6b6`
- **panda-colors-yellow-700:** `#b78900`
- **panda-colors-blue-300:** `#abbdff`
- **panda-colors-purple-300:** `#d3b8ff`
- **panda-colors-gray-950:** `#141414` — Deep background layer or shadow color
- **panda-colors-gray-100:** `#e7eef1` — Light surface or highlight color
- **panda-colors-gray-200:** `#e4ecde` — Light surface or highlight color

### CSS Variable Tokens

```css
--panda-z-index-popover: 1500;
--panda-z-index-in-content-glossary-card: 895;
--panda-shadows-plan-card-base: 0px -6px 0px 0px #00000026 inset;
--panda-colors-bg-blue-primary: var(--panda-colors-blue-500);
--panda-colors-bg-blue-secondary: var(--panda-colors-blue-200);
--panda-colors-bg-danger-primary: var(--panda-colors-red-500);
--panda-colors-bg-danger-secondary: var(--panda-colors-red-200);
--panda-colors-bg-danger-secondary-active: var(--panda-colors-red-200);
--panda-colors-bg-danger-secondary-hover: var(--panda-colors-red-100);
--panda-colors-bg-green-primary: var(--panda-colors-green-500);
--panda-colors-bg-green-secondary: var(--panda-colors-green-200);
--panda-colors-bg-inverse-primary: var(--panda-colors-black);
--panda-colors-bg-inverse-secondary: var(--panda-colors-gray-900);
--panda-colors-bg-orange-primary: var(--panda-colors-orange-500);
--panda-colors-bg-orange-secondary: var(--panda-colors-orange-200);
--panda-colors-bg-papaya-primary: var(--panda-colors-papaya-500);
--panda-colors-bg-papaya-secondary: var(--panda-colors-papaya-200);
--panda-colors-bg-pear-primary: var(--panda-colors-pear-500);
--panda-colors-bg-pear-secondary: var(--panda-colors-pear-200);
--panda-colors-bg-pink-primary: var(--panda-colors-pink-500);
```

## Typography

### Font Stack

- **KaTeX_Caligraphic** — Heading 1, Heading 2, Heading 3
- **KaTeX_AMS** — Body, Caption
- **Source Code Pro** — Code

### Font Sources

```css
@font-face {
  font-family: "KaTeX_AMS";
  src: url("fonts/KaTeX_AMS-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "KaTeX_Caligraphic";
  src: url("fonts/KaTeX_Caligraphic-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "KaTeX_Caligraphic";
  src: url("fonts/KaTeX_Caligraphic-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "KaTeX_Fraktur";
  src: url("fonts/KaTeX_Fraktur-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "KaTeX_Fraktur";
  src: url("fonts/KaTeX_Fraktur-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "KaTeX_Main";
  src: url("fonts/KaTeX_Main-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "KaTeX_Main";
  src: url("fonts/KaTeX_Main-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "KaTeX_Math";
  src: url("fonts/KaTeX_Math-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "KaTeX_Math";
  src: url("fonts/KaTeX_Math-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "KaTeX_SansSerif";
  src: url("fonts/KaTeX_SansSerif-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "KaTeX_SansSerif";
  src: url("fonts/KaTeX_SansSerif-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "KaTeX_Script";
  src: url("fonts/KaTeX_Script-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "KaTeX_Size1";
  src: url("fonts/KaTeX_Size1-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "KaTeX_Size2";
  src: url("fonts/KaTeX_Size2-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "KaTeX_Size3";
  src: url("fonts/KaTeX_Size3-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "KaTeX_Size4";
  src: url("fonts/KaTeX_Size4-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "KaTeX_Typewriter";
  src: url("fonts/KaTeX_Typewriter-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "CoFo Brilliant";
  src: url("fonts/CoFoBrilliant-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "CoFo Brilliant";
  src: url("fonts/CoFoBrilliant-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "CoFo Robert";
  src: url("fonts/CoFoRobert-500.woff2") format("woff2");
  font-weight: 500;
}
@font-face {
  font-family: "Source Code Pro";
  src: url("fonts/SourceCodePro-Bold.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "Source Code Pro";
  src: url("fonts/SourceCodePro-Regular.ttf") format("truetype");
  font-weight: 400;
}
@font-face {
  font-family: "Soleil";
  src: url("fonts/Soleil-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Soleil";
  src: url("fonts/Soleil-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "CoFo Semi Mono";
  src: url("fonts/CoFoSemiMono-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "CoFo Semi Mono";
  src: url("fonts/CoFoSemiMono-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "coFoRobertFont";
  src: url("fonts/coFoRobertFont-500.woff2") format("woff2");
  font-weight: 500;
}
@font-face {
  font-family: "sourceCodeProFont";
  src: url("fonts/sourceCodeProFont-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "sourceCodeProFont";
  src: url("fonts/sourceCodeProFont-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "coFoBrilliantFont";
  src: url("fonts/coFoBrilliantFont-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "coFoBrilliantFont";
  src: url("fonts/coFoBrilliantFont-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "swiper-icons";
  src: url("data:application/font-woff;charset=utf-8;base64, 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");
  font-weight: 400;
}
```

### Type Scale

| Role | Family | Size | Weight |
|------|--------|------|--------|
| Heading 1 | KaTeX_Caligraphic | 96px | 700 |
| Heading 2 | KaTeX_Caligraphic | 76px | 700 |
| Heading 3 | KaTeX_Caligraphic | 74px | 700 |
| Body | KaTeX_AMS | 20px | 400 |
| Caption | KaTeX_AMS | 16px | 400 |
| Code | Source Code Pro | 14px | 400 |

### Typography Rules

- Body/UI: **KaTeX_Caligraphic**, Headings: **KaTeX_AMS** — these are the only display fonts
- Max 3-4 font sizes per screen
- Headings: weight 600-700, body: weight 400
- Use color and opacity for text hierarchy, not additional font sizes
- Line height: 1.5 for body, 1.2 for headings

## Spacing & Layout

### Base Grid: 4px

Every dimension (margin, padding, gap, width, height) must be a multiple of **4px**.

### Spacing Scale

`2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24` px

### Spacing as Meaning

| Spacing | Use |
|---------|-----|
| 4-8px | Tight: related items (icon + label, avatar + name) |
| 12-16px | Medium: between groups within a section |
| 24-32px | Wide: between distinct sections |
| 48px+ | Vast: major page section breaks |

### Border Radius

Scale: `.25rem, .375rem, .5rem, .75rem, 1px, 1rem, 1.25rem, 2rem, 2px, 3px, 5px, 6px, 12px, 14px, 15px, 16px, 17px, 18px, 20px, 22px, 24px, 26px, 28px, 32px, 36px, 40px, 54px, 60px, 176px, inherit, btn, card, input, pill, popover, 30px, 44px, 45px, 50px`
Default: `22px`

### Container

Max-width: `1216px`, centered with auto margins.

### Breakpoints

| Name | Value |
|------|-------|
| xs | 20rem |
| xs | 22.5rem |
| xs | 24.875rem |
| sm | 30.0625rem |
| lg | 48.0625rem |
| lg | 62rem |
| lg | 62em |
| xl | 80rem |
| xs | 380px |
| xs | 393px |
| xs | 420px |
| sm | 481px |
| sm | 491px |
| sm | 600px |
| sm | 640px |
| md | 767px |
| md | 768px |
| lg | 769px |
| lg | 782px |
| lg | 900px |
| lg | 992px |
| lg | 1000px |
| lg | 1024px |
| xl | 1279px |
| xl | 1280px |
| 2xl | 1440px |
| 2xl | 1536px |

Mobile-first: design for small screens, layer on responsive overrides.

## Component Patterns

### Card

```css
.card {
  background: #ffffff;
  border-radius: 22px;
  padding: 16px;
  box-shadow: 0 0 0 1px var(--panda-colors-bg-primary),0 0 0 3px var(--panda-colors-border-select);
}
```

```html
<div class="card">
  <h3>Card Title</h3>
  <p>Card content goes here.</p>
</div>
```

### Button

```css
/* Primary */
.btn-primary {
  background: #ffcc9c;
  color: #000000;
  border-radius: 22px;
  padding: 8px 16px;
  font-weight: 500;
  transition: opacity 150ms ease;
}
.btn-primary:hover { opacity: 0.9; }

/* Ghost */
.btn-ghost {
  background: transparent;
  border: 1px solid #cccccc;
  color: #000000;
  border-radius: 22px;
  padding: 8px 16px;
}
```

```html
<button class="btn-primary">Get Started</button>
<button class="btn-ghost">Learn More</button>
```

### Input

```css
.input {
  background: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 22px;
  padding: 8px 12px;
  color: #000000;
  font-size: 14px;
}
.input:focus { border-color: #ffcc9c; outline: none; }
```

```html
<input class="input" type="text" placeholder="Search..." />
```

### Badge / Chip

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  background: #ffffff;
  color: #999999;
}
```

```html
<span class="badge">New</span>
<span class="badge">Beta</span>
```

### Modal / Dialog

```css
.modal-backdrop { background: rgba(0, 0, 0, 0.6); }
.modal {
  background: #ffffff;
  border-radius: 50px;
  padding: 24px;
  max-width: 480px;
  width: 90vw;
  box-shadow: 0px 0px 20px 8px color-mix(in srgb,var(--border-glow-color) 30%,transparent);
}
```

```html
<div class="modal-backdrop">
  <div class="modal">
    <h2>Dialog Title</h2>
    <p>Dialog content.</p>
    <button class="btn-primary">Confirm</button>
    <button class="btn-ghost">Cancel</button>
  </div>
</div>
```

### Table

```css
.table { width: 100%; border-collapse: collapse; }
.table th {
  text-align: left;
  padding: 8px 12px;
  font-weight: 500;
  font-size: 12px;
  color: #999999;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #cccccc;
}
.table td {
  padding: 12px;
  border-bottom: 1px solid #cccccc;
}
```

```html
<table class="table">
  <thead><tr><th>Name</th><th>Status</th><th>Date</th></tr></thead>
  <tbody>
    <tr><td>Item One</td><td>Active</td><td>Jan 1</td></tr>
    <tr><td>Item Two</td><td>Pending</td><td>Jan 2</td></tr>
  </tbody>
</table>
```

### Navigation

```css
.nav {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
}
.nav-link {
  color: #999999;
  padding: 8px 12px;
  border-radius: 22px;
  transition: color 150ms;
}
.nav-link:hover { color: #000000; }
.nav-link.active { color: #ffcc9c; }
```

```html
<nav class="nav">
  <a href="/" class="nav-link active">Home</a>
  <a href="/about" class="nav-link">About</a>
  <a href="/pricing" class="nav-link">Pricing</a>
  <button class="btn-primary" style="margin-left: auto">Get Started</button>
</nav>
```

### Extracted Components

These components were found in the codebase:

**Button** (`html`)

**Card** (`html`)
- Variants: `blur))`, `opacity)`, `scale))`, `z)`

**Navigation** (`html`)

**Footer** (`html`)

## Page Structure

The following page sections were detected:

- **Navigation** — Top navigation bar (1 items)
- **Hero** — Hero section (detected from heading structure)
- **Features** — Feature/benefit cards grid (31 items)
- **Faq** — FAQ/accordion section
- **Footer** — Page footer with links and info (22 items)
- **Cta** — Call-to-action section
- **Testimonials** — Testimonials/reviews section
- **Hero** — Hero/banner section with headline and CTAs

When building pages, follow this section order and structure.

## Animation & Motion

This project uses **expressive motion**. Animations are part of the design language.

### CSS Animations

- `contentLoadingGradientFadeIn`
- `evalFadeIn`
- `evalFlashHighlight`
- `evalPulse`
- `fadeIn`

### Motion Tokens

- **Duration scale:** `0ms`, `0s`, `.01ms`, `.1s`, `.15s`, `.2s`, `.25s`, `.3s`, `.35s`, `.4s`, `.5s`, `1s`, `30ms`, `80ms`, `100ms`, `120ms`, `140ms`, `150ms`, `160ms`, `166.667ms`, `180ms`, `200ms`, `240ms`, `250ms`, `300ms`, `333.33299999999997ms`, `350ms`, `400ms`, `450ms`, `500ms`, `600ms`, `750ms`, `800ms`, `1500ms`, `2000ms`
- **Easing functions:** `cubic-bezier(0,0,.5,1)`, `cubic-bezier(.5,0,1,1)`, `cubic-bezier(.5,0,0,1)`, `cubic-bezier(.5,0,.2,1)`, `cubic-bezier(0,0,0,1)`, `cubic-bezier(.5,0,.5,1)`, `linear`, `ease-in-out`, `ease-out`, `cubic-bezier(.22,1,.36,1)`, `cubic-bezier(.16,1,.3,1)`, `ease-in`, `cubic-bezier(0,0,.2,1)`, `cubic-bezier(.4,0,.2,1)`, `cubic-bezier(.34,1.56,.64,1)`, `cubic-bezier(.25,.75,.18,1.09)`, `ease`, `cubic-bezier(.4,0,1,1)`
- **Animated properties:** `opacity`

### Motion Guidelines

- **Duration:** Use values from the duration scale above. Short (0ms) for micro-interactions, long (2000ms) for page transitions
- **Easing:** Use `cubic-bezier(0,0,.5,1)` as the default easing curve
- **Direction:** Elements enter from bottom/right, exit to top/left
- **Reduced motion:** Always respect `prefers-reduced-motion` — disable animations when set

## Depth & Elevation

### Shadow Tokens

- Subtle: `0px 0px 0px 0px color-mix(in srgb,var(--border-glow-color) 40%,transparent)`
- Subtle: `0px 0px 0px 0px color-mix(in srgb,var(--border-glow-color) 0%,transparent)`
- Subtle: `0 2px 2px #0000000a`
- Subtle: `0_0_0_2px_var(--bobs-colors-bg-elevated)`
- Subtle: `0px 2px 0px 0px var(--panda-colors-border-active)`
- Subtle: `inset 0 0 0 1px var(--panda-colors-bg-danger-primary)`

### Z-Index Scale

`0, 1, 2, 3, 4, 5, 6, 10, 20, 25, 40, 50, 100, 140, 150, 202, 300, 400, 401, 1000, 1001`

Use these exact values — never invent z-index values.

## Anti-Patterns (Never Do)

- **No zebra striping** — tables and lists use borders for separation
- **No invented colors** — every hex value must come from the palette above
- **No arbitrary spacing** — every dimension is a multiple of 4px
- **No extra fonts** — only KaTeX_Caligraphic and KaTeX_AMS and Source Code Pro are allowed
- **No arbitrary border-radius** — use the scale: .25rem, .375rem, .5rem, .75rem, 1px, 1rem, 1.25rem, 2rem, 2px, 3px
- **No opacity for disabled states** — use muted colors instead

## Workflow

1. **Read** `references/DESIGN.md` before writing any UI code
2. **Pick colors** from the Color System section — never invent new ones
3. **Set typography** — KaTeX_Caligraphic, KaTeX_AMS, Source Code Pro only, using the type scale
4. **Build layout** on the 4px grid — check every margin, padding, gap
5. **Match components** to patterns above before creating new ones
6. **Apply elevation** — use shadow tokens
7. **Validate** — every value traces back to a design token. No magic numbers.

## Brand Spec

- **Favicon:** `/favicon.ico`
- **Site URL:** `https://brilliant.org`
- **Brand color:** `#ffcc9c`
- **Brand typeface:** KaTeX_Caligraphic

## Quick Reference

```
Background:     #ffffff
Surface:        (not extracted)
Text:           #000000 / #999999
Accent:         #ffcc9c
Border:         (not extracted)
Font:           KaTeX_Caligraphic
Spacing:        4px grid
Radius:         22px
Components:     9 detected
```

## When to Trigger

Activate this skill when:
- Creating new components, pages, or visual elements for brilliant
- Writing CSS, Tailwind classes, styled-components, or inline styles
- Building page layouts, templates, or responsive designs
- Reviewing UI code for design consistency
- The user mentions "brilliant" design, style, UI, or theme
- Generating mockups, wireframes, or visual prototypes

---

# Full Reference Files

> Every output file is embedded below. Claude has full design system context from /skills alone.

## Design System Tokens (DESIGN.md)

# brilliant DESIGN.md

> Auto-generated design system — reverse-engineered via static analysis by skillui.
> Frameworks: None detected
> Colors: 20 · Fonts: 3 · Components: 9
> Icon library: not detected · State: not detected
> Primary theme: light · Dark mode toggle: no · Motion: expressive

## Visual Reference

**Match this design exactly** — study colors, fonts, spacing, and component shapes before writing any UI code.

![brilliant Homepage](../screenshots/homepage.png)

---

## 1. Visual Theme & Atmosphere

This is a **light-themed** interface with a warm, approachable feel. The light background emphasizes content clarity. Typography pairs **KaTeX_AMS** for display/headings with **KaTeX_Caligraphic** for body text, creating clear visual hierarchy through type contrast. Spacing follows a **4px base grid** (compact density), with scale: 2, 4, 6, 8, 10, 12, 14, 16px. The accent color **#ffcc9c** anchors interactive elements (buttons, links, focus rings). Motion is expressive — spring physics, layout animations, and staggered reveals are part of the visual language.

---

## 2. Color Palette & Roles

| Token | Hex | Role | Use |
|---|---|---|---|
| panda-colors-white | `#ffffff` | background | Page background, darkest surface |
| panda-colors-black | `#000000` | text-primary | Headings and body text |
| panda-colors-gray-500 | `#999999` | text-muted | Captions, placeholders, secondary info |
| panda-colors-orange-300 | `#ffcc9c` | accent | CTAs, links, focus rings, active states |
| panda-colors-papaya-700 | `#cc563d` | danger | Error states, destructive actions |
| panda-colors-green-500 | `#29cc57` | success | Success states, positive indicators |
| panda-colors-yellow-200 | `#fdf3d3` | warning | Warning states, caution indicators |
| panda-colors-blue-300 | `#abbdff` | info | Informational highlights |
| panda-colors-orange-700 | `#ce6809` | unknown | Palette color |
| panda-colors-red-300 | `#ffb6b6` | unknown | Palette color |
| panda-colors-yellow-700 | `#b78900` | unknown | Palette color |
| panda-colors-purple-300 | `#d3b8ff` | unknown | Palette color |
| panda-colors-gray-950 | `#141414` | unknown | Palette color |
| panda-colors-gray-100 | `#e7eef1` | unknown | Palette color |
| panda-colors-gray-200 | `#e4ecde` | unknown | Palette color |
| panda-colors-red-200 | `#ffdfdf` | unknown | Palette color |
| panda-colors-yellow-300 | `#fce49d` | unknown | Palette color |
| panda-colors-pear-300 | `#edf5a1` | unknown | Palette color |
| panda-colors-teal-300 | `#a0dcd5` | unknown | Palette color |
| panda-colors-gray-400 | `#b3b3b3` | unknown | Palette color |

### CSS Variable Tokens

```css
--panda-z-index-popover: 1500;
--panda-z-index-in-content-glossary-card: 895;
--panda-shadows-plan-card-base: 0px -6px 0px 0px #00000026 inset;
--panda-colors-bg-blue-primary: var(--panda-colors-blue-500);
--panda-colors-bg-blue-secondary: var(--panda-colors-blue-200);
--panda-colors-bg-danger-primary: var(--panda-colors-red-500);
--panda-colors-bg-danger-secondary: var(--panda-colors-red-200);
--panda-colors-bg-danger-secondary-active: var(--panda-colors-red-200);
--panda-colors-bg-danger-secondary-hover: var(--panda-colors-red-100);
--panda-colors-bg-green-primary: var(--panda-colors-green-500);
--panda-colors-bg-green-secondary: var(--panda-colors-green-200);
--panda-colors-bg-inverse-primary: var(--panda-colors-black);
--panda-colors-bg-inverse-secondary: var(--panda-colors-gray-900);
--panda-colors-bg-orange-primary: var(--panda-colors-orange-500);
--panda-colors-bg-orange-secondary: var(--panda-colors-orange-200);
--panda-colors-bg-papaya-primary: var(--panda-colors-papaya-500);
--panda-colors-bg-papaya-secondary: var(--panda-colors-papaya-200);
--panda-colors-bg-pear-primary: var(--panda-colors-pear-500);
--panda-colors-bg-pear-secondary: var(--panda-colors-pear-200);
--panda-colors-bg-pink-primary: var(--panda-colors-pink-500);
```


---

## 3. Typography Rules

**Font Stack:**
- **KaTeX_Caligraphic** — Heading 1, Heading 2, Heading 3
- **KaTeX_AMS** — Body, Caption
- **Source Code Pro** — Code

**Font Sources:**

```css
@font-face {
  font-family: "KaTeX_AMS";
  src: url("fonts/KaTeX_AMS-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "KaTeX_Caligraphic";
  src: url("fonts/KaTeX_Caligraphic-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "KaTeX_Caligraphic";
  src: url("fonts/KaTeX_Caligraphic-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "KaTeX_Fraktur";
  src: url("fonts/KaTeX_Fraktur-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "KaTeX_Fraktur";
  src: url("fonts/KaTeX_Fraktur-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "KaTeX_Main";
  src: url("fonts/KaTeX_Main-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "KaTeX_Main";
  src: url("fonts/KaTeX_Main-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "KaTeX_Math";
  src: url("fonts/KaTeX_Math-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "KaTeX_Math";
  src: url("fonts/KaTeX_Math-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "KaTeX_SansSerif";
  src: url("fonts/KaTeX_SansSerif-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "KaTeX_SansSerif";
  src: url("fonts/KaTeX_SansSerif-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "KaTeX_Script";
  src: url("fonts/KaTeX_Script-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "KaTeX_Size1";
  src: url("fonts/KaTeX_Size1-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "KaTeX_Size2";
  src: url("fonts/KaTeX_Size2-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "KaTeX_Size3";
  src: url("fonts/KaTeX_Size3-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "KaTeX_Size4";
  src: url("fonts/KaTeX_Size4-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "KaTeX_Typewriter";
  src: url("fonts/KaTeX_Typewriter-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "CoFo Brilliant";
  src: url("fonts/CoFoBrilliant-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "CoFo Brilliant";
  src: url("fonts/CoFoBrilliant-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "CoFo Robert";
  src: url("fonts/CoFoRobert-500.woff2") format("woff2");
  font-weight: 500;
}
@font-face {
  font-family: "Source Code Pro";
  src: url("fonts/SourceCodePro-Bold.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "Source Code Pro";
  src: url("fonts/SourceCodePro-Regular.ttf") format("truetype");
  font-weight: 400;
}
@font-face {
  font-family: "Soleil";
  src: url("fonts/Soleil-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Soleil";
  src: url("fonts/Soleil-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "CoFo Semi Mono";
  src: url("fonts/CoFoSemiMono-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "CoFo Semi Mono";
  src: url("fonts/CoFoSemiMono-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "coFoRobertFont";
  src: url("fonts/coFoRobertFont-500.woff2") format("woff2");
  font-weight: 500;
}
@font-face {
  font-family: "sourceCodeProFont";
  src: url("fonts/sourceCodeProFont-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "sourceCodeProFont";
  src: url("fonts/sourceCodeProFont-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "coFoBrilliantFont";
  src: url("fonts/coFoBrilliantFont-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "coFoBrilliantFont";
  src: url("fonts/coFoBrilliantFont-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "swiper-icons";
  src: url("data:application/font-woff;charset=utf-8;base64, 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");
  font-weight: 400;
}
```

| Role | Font | Size | Weight |
|---|---|---|---|
| Heading 1 | KaTeX_Caligraphic | 96px | 700 |
| Heading 2 | KaTeX_Caligraphic | 76px | 700 |
| Heading 3 | KaTeX_Caligraphic | 74px | 700 |
| Body | KaTeX_AMS | 20px | 400 |
| Caption | KaTeX_AMS | 16px | 400 |
| Code | Source Code Pro | 14px | 400 |

**Typographic Rules:**
- Limit to 3 font families max per screen
- Use **KaTeX_Caligraphic** for body/UI text, **KaTeX_AMS** for display/headings
- Maintain consistent hierarchy: no more than 3-4 font sizes per screen
- Headings use bold (600-700), body uses regular (400)
- Line height: 1.5 for body text, 1.2 for headings
- Use color and opacity for secondary hierarchy, not additional font sizes


---

## 4. Component Stylings

### Layout (1)

**Footer** — `html`

### Navigation (1)

**Navigation** — `html`

### Data Display (3)

**Card** — `html`
- Variants: `blur))`, `opacity)`, `scale))`, `z)`

**Badge** — `html`

**List** — `html`

### Data Input (1)

**Button** — `html`
- Animation: 

### Media (3)

**Image** — `html`

**Icon** — `html`

**Map/Canvas** — `html`



---

## 5. Layout Principles

- **Base spacing unit:** 4px
- **Spacing scale:** 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24
- **Border radius:** .25rem, .375rem, .5rem, .75rem, 1px, 1rem, 1.25rem, 2rem, 2px, 3px, 5px, 6px, 12px, 14px, 15px, 16px, 17px, 18px, 20px, 22px, 24px, 26px, 28px, 32px, 36px, 40px, 54px, 60px, 176px, inherit, btn, card, input, pill, popover, 30px, 44px, 45px, 50px
- **Max content width:** 1216px

**Spacing as Meaning:**
| Spacing | Use |
|---|---|
| 4-8px | Tight: related items within a group |
| 12-16px | Medium: between groups |
| 24-32px | Wide: between sections |
| 48px+ | Vast: major section breaks |


---

## 6. Depth & Elevation

### Flat — subtle depth hints

- `0px 0px 0px 0px color-mix(in srgb,var(--border-glow-color) 40%,transparent)`
- `0px 0px 0px 0px color-mix(in srgb,var(--border-glow-color) 0%,transparent)`
- `0 2px 2px #0000000a`

### Raised — cards, buttons, interactive elements

- `0 0 0 1px var(--panda-colors-bg-primary),0 0 0 3px var(--panda-colors-border-select)`
- `0 0 0 100vmax var(--panda-colors-bg-oat)`
- `0 0 0 2px colors\.bg,0 0 0 4px colors\.blue`

### Floating — dropdowns, popovers, modals

- `0px 0px 20px 8px color-mix(in srgb,var(--border-glow-color) 30%,transparent)`
- `0 0 15px #0000001a`
- `0 2px 10px #00000059`

### Overlay — full-screen overlays, top-level dialogs

- `0 0 24px #00000029`
- `0 0 25px 0 var(--panda-colors-black-alpha-300)`
- `0 0 25px 0 var(--panda-colors-blackAlpha-300)`

### Z-Index Scale

`0, 1, 2, 3, 4, 5, 6, 10, 20, 25, 40, 50, 100, 140, 150, 202, 300, 400, 401, 1000, 1001`



---

## 7. Animation & Motion

This project uses **expressive motion**. Animations are an integral part of the experience.

### CSS Animations

- `@keyframes contentLoadingGradientFadeIn`
- `@keyframes evalFadeIn`
- `@keyframes evalFlashHighlight`
- `@keyframes evalPulse`
- `@keyframes fadeIn`
- `@keyframes fadeOut`
- `@keyframes fillProgress`
- `@keyframes hide`

### Animated Components

- **Button**: 

### Motion Guidelines

- Duration: 150-300ms for micro-interactions, 300-500ms for page transitions
- Easing: `ease-out` for enters, `ease-in` for exits
- Always respect `prefers-reduced-motion`


---

## 8. Do's and Don'ts

### Do's

- Use `#ffcc9c` for interactive elements (buttons, links, focus rings)
- Use `#ffffff` as the primary page background
- Pair **KaTeX_Caligraphic** (body) with **KaTeX_AMS** (display) — these are the only allowed fonts
- Follow the **4px** spacing grid for all margins, padding, and gaps
- Use the defined shadow tokens for elevation — see Section 6
- Use border-radius from the scale: .25rem, .375rem, .5rem, .75rem, 1px
- Reuse existing components from Section 4 before creating new ones

### Don'ts

- Don't introduce colors outside this palette — extend the design tokens first
- Don't introduce additional font families beyond KaTeX_Caligraphic and KaTeX_AMS and Source Code Pro
- Don't use arbitrary spacing values — stick to multiples of 4px
- Don't create custom box-shadow values outside the system tokens
- Don't use arbitrary border-radius values — pick from the defined scale
- Don't duplicate component patterns — check Section 4 first


---

## 9. Responsive Behavior

| Name | Value | Source |
|---|---|---|
| xs | 20rem | css |
| xs | 22.5rem | css |
| xs | 24.875rem | css |
| sm | 30.0625rem | css |
| lg | 48.0625rem | css |
| lg | 62rem | css |
| lg | 62em | css |
| xl | 80rem | css |
| xs | 380px | css |
| xs | 393px | css |
| xs | 420px | css |
| sm | 481px | css |
| sm | 491px | css |
| sm | 600px | css |
| sm | 640px | css |
| md | 767px | css |
| md | 768px | css |
| lg | 769px | css |
| lg | 782px | css |
| lg | 900px | css |
| lg | 992px | css |
| lg | 1000px | css |
| lg | 1024px | css |
| xl | 1279px | css |
| xl | 1280px | css |
| 2xl | 1440px | css |
| 2xl | 1536px | css |

**Approach:** Use `@media (min-width: ...)` queries matching the breakpoints above.


---

## 10. Agent Prompt Guide

Use these as starting points when building new UI:

### Build a Card

```
Background: #ffffff
Border: 1px solid var(--border)
Radius: 22px
Padding: 16px
Font: KaTeX_Caligraphic
Use shadow tokens from Section 6.
```

### Build a Button

```
Primary: bg #ffcc9c, text white
Ghost: bg transparent, border var(--border)
Padding: 8px 16px
Radius: 22px
Hover: opacity 0.9 or lighter shade
Focus: ring with #ffcc9c
```

### Build a Page Layout

```
Background: #ffffff
Max-width: 1216px, centered
Grid: 4px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface: #ffffff
Label: #999999 (muted, 12px, uppercase)
Value: #000000 (primary, 24-32px, bold)
Status: use success/warning/danger from Section 2
```

### Build a Form

```
Input bg: #ffffff
Input border: 1px solid var(--border)
Focus: border-color #ffcc9c
Label: #999999 12px
Spacing: 16px between fields
Radius: 22px
```

### General Component

```
1. Read DESIGN.md Sections 2-6 for tokens
2. Colors: only from palette
3. Font: KaTeX_Caligraphic, type scale from Section 3
4. Spacing: 4px grid
5. Components: match patterns from Section 4
6. Elevation: shadow tokens
```

## Visual Guide — Screenshots (VISUAL_GUIDE.md)

# brilliant — Visual Guide

> Master visual reference. Study every screenshot carefully before implementing any UI.
> Match colors, layout, typography, spacing, and motion states exactly.

## Scroll Journey

The page has cinematic scroll animations. Each screenshot below shows the exact visual state at that scroll depth.
**Replicate these transitions precisely** — the design changes dramatically as you scroll.

### Hero — Above the fold

*Scroll position: 0px of 8431px total*

![Hero — Above the fold](../screens/scroll/scroll-000.png)

### 17% scroll depth

*Scroll position: 1280px of 8431px total*

![17% scroll depth](../screens/scroll/scroll-017.png)

### 33% scroll depth

*Scroll position: 2485px of 8431px total*

![33% scroll depth](../screens/scroll/scroll-033.png)

### 50% scroll depth

*Scroll position: 3766px of 8431px total*

![50% scroll depth](../screens/scroll/scroll-050.png)

### 67% scroll depth

*Scroll position: 5046px of 8431px total*

![67% scroll depth](../screens/scroll/scroll-067.png)

### 83% scroll depth

*Scroll position: 6251px of 8431px total*

![83% scroll depth](../screens/scroll/scroll-083.png)

### Footer — End of page

*Scroll position: 7531px of 8431px total*

![Footer — End of page](../screens/scroll/scroll-100.png)

## Video Backgrounds

These videos play as background elements. Use first-frame as poster image while video loads.

### Video 1 (content)

*Source: `/_next/static/media/lohp-rebrand-hero.1k_a2eh2e5-pa.webm...`*

![Video 1 first frame](../screens/scroll/video-1-frame.png)

## Full Page Screenshots

### Brilliant | Your Personal Tutor for Math and Coding

*URL: `https://brilliant.org`*

![Brilliant | Your Personal Tutor for Math and Coding](../screens/pages/home.png)

### Coding Skills That Matter in the Age of AI | Brilliant

*URL: `https://brilliant.org/coding-skills/`*

![Coding Skills That Matter in the Age of AI | Brilliant](../screens/pages/coding-skills.png)

### Brilliant for Educators

*URL: `https://brilliant.org/educators/?from=brilliant`*

![Brilliant for Educators](../screens/pages/educators.png)

### Topics | Brilliant | Your Personal Tutor for Math & Coding

*URL: `https://brilliant.org/courses/`*

![Topics | Brilliant | Your Personal Tutor for Math & Coding](../screens/pages/courses.png)

### Brilliant Premium | Learn Without Limits

*URL: `https://brilliant.org/subscribe/`*

![Brilliant Premium | Learn Without Limits](../screens/pages/subscribe.png)

## Section Screenshots

Clipped sections showing individual components in context.

### Section 1 — `section`

*1296×760px*

![Section 1](../screens/sections/home-section-1.png)

### Section 2 — `section`

*1296×254px*

![Section 2](../screens/sections/home-section-2.png)

### Section 9 — `[class*="section"]`

*1440×1200px*

![Section 9](../screens/sections/home-section-9.png)

### Section 1 — `section`

*1440×612px*

![Section 1](../screens/sections/educators-section-1.png)

### Section 2 — `section`

*1440×260px*

![Section 2](../screens/sections/educators-section-2.png)

## Animations & Motion (ANIMATIONS.md)

# Animation Reference

> Cinematic motion design extracted from live DOM. Follow these specs exactly to recreate the experience.

## Motion Technology Stack

| Library | Type | Notes |
|---------|------|-------|
| Canvas (1 elements) | 2D Canvas | 2D canvas rendering |

## Scroll Journey

The page is **8,431px** tall. Each frame below shows what the user sees at that scroll depth.

> **Use these screenshots to understand WHAT animates, WHEN it animates, and HOW it moves.**

### 0% — Top / Hero
Scroll position: 0px

![Scroll 0%](../screens/scroll/scroll-000.png)

### 17% — Opening Section
Scroll position: 1,280px

![Scroll 17%](../screens/scroll/scroll-017.png)

### 33% — First Feature Section
Scroll position: 2,485px

![Scroll 33%](../screens/scroll/scroll-033.png)

### 50% — Mid-Page
Scroll position: 3,766px

![Scroll 50%](../screens/scroll/scroll-050.png)

### 67% — Lower Content
Scroll position: 5,046px

![Scroll 67%](../screens/scroll/scroll-067.png)

### 83% — Near Footer
Scroll position: 6,251px

![Scroll 83%](../screens/scroll/scroll-083.png)

### 100% — Bottom / Footer
Scroll position: 7,531px

![Scroll 100%](../screens/scroll/scroll-100.png)

## Video Elements

| # | Role | Autoplay | Loop | Muted | Size | First Frame |
|---|------|----------|------|-------|------|-------------|
| 1 | content | ✓ | ✓ | ✓ | 440×600 | [view](../screens/scroll/video-1-frame.png) |
| 2 | content | ✓ | ✓ | ✓ | 555×387 | — |
| 3 | content | ✓ | ✓ | ✓ | 555×387 | — |
| 4 | content | ✓ | ✓ | ✓ | 555×387 | — |
| 5 | content | ✓ | ✓ | ✓ | 633×413 | — |
| 6 | content | ✓ | ✓ | ✓ | 633×413 | — |

**Video 1 first frame:**

![Video 1 Frame](../screens/scroll/video-1-frame.png)

- **Source:** `/_next/static/media/lohp-rebrand-hero.1k_a2eh2e5-pa.webm`
- **Poster:** `https://brilliant.org/_next/static/media/lohp-rebrand-hero-poster.1t0vj3-0sz7ib.png`
- **Source:** `/_next/static/media/refresh-math-interactive-desktop.3snx7ei6id7ls.webm`
- **Poster:** `https://brilliant.org/_next/static/media/refresh-math-interactive-desktop.08inwfkmo43qb.webp`
- **Source:** `/_next/static/media/refresh-math-adapts-desktop.38p-nxkbssnf-.webm`
- **Poster:** `https://brilliant.org/_next/static/media/refresh-math-adapts-desktop.0s2dvcldsttej.webp`
- **Source:** `/_next/static/media/refresh-progress-desktop.2is9uvzvo4-0s.webm`
- **Poster:** `https://brilliant.org/_next/static/media/refresh-progress-desktop.1hm-an4x-z-d1.webp`
- **Source:** `/_next/static/media/math-refresh.0ajyik0juqh5g.webm`
- **Poster:** `https://brilliant.org/_next/static/media/math-refresh.2pwdoxq7povj0.png`
- **Source:** `/_next/static/media/cs-refresh.3p60mznj2ylol.webm`
- **Poster:** `https://brilliant.org/_next/static/media/cs-refresh.016valy3_3ycv.png`

## Scroll Animation Patterns

| Pattern | Library | Element Count | Duration | Delay | Easing |
|---------|---------|---------------|----------|-------|--------|
| parallax / sticky scroll | CSS | 1 | — | — | — |

### CSS Implementation

## CSS Keyframes (58 extracted)

### `@keyframes fadeIn`

Duration: `0.7s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.panda-anim_fadeIn_0\.7s_ease:not(#\##\##\##\##\##\##\##\##\##\#)`, `.panda-anim_fadeIn_350ms_ease:not(#\##\##\##\##\##\##\##\##\##\#)`, `.panda-anim_fadeIn_660ms_cubic-bezier\(0\,0\,0\,1\)\,_slideFromBottom_660ms_cubi`, `.panda-anim-n_fadeIn\,_slideFromBottom:not(#\##\##\##\##\##\##\##\##\##\#)`

```css
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes spin`

Duration: `0.7s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.panda-anim_spin_0\.7s_linear_infinite:not(#\##\##\##\##\##\##\##\##\##\#)`, `.panda-anim_spin_0\.9s_linear_infinite:not(#\##\##\##\##\##\##\##\##\##\#)`, `.panda-anim_spin_1s_linear_infinite:not(#\##\##\##\##\##\##\##\##\##\#)`, `.panda-anim_spin_600ms_linear_infinite:not(#\##\##\##\##\##\##\##\##\##\#)`

```css
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

> Transform/motion animation

### `@keyframes slideFromBottom`

Duration: `0.66s, 0.66s` · Easing: `cubic-bezier(0, 0, 0, 1), cubic-bezier(0, 0, 0, 1)` · Delay: `0s, 0s` · Iteration: `1, 1` · Fill: `none, none`

Used by: `.panda-anim_fadeIn_660ms_cubic-bezier\(0\,0\,0\,1\)\,_slideFromBottom_660ms_cubi`, `.panda-anim-n_fadeIn\,_slideFromBottom:not(#\##\##\##\##\##\##\##\##\##\#)`, `[data-reduced-motion="false"]:not(#\##\##\##\##\##\##\##\##\##\#) .allowMotion\:`

```css
@keyframes slideFromBottom {
  0% {
    transform: translateY(var(--slide-from-bottom-distance,8px));
  }
  100% {
    transform: translateY(0px);
  }
}
```

> Transform/motion animation

### `@keyframes hide`

Used by: `.\[\&\[data-visible\=\"false\"\]\[data-animate\=\"true\"\]\]\:panda-anim-n_hide[`, `[data-reduced-motion="false"]:not(#\##\##\##\##\##\##\##\##\##\#) .allowMotion\:`

```css
@keyframes hide {
  0% {
    visibility: visible;
  }
  99% {
    visibility: visible;
  }
  100% {
    visibility: hidden;
  }
}
```

### `@keyframes reveal`

Used by: `.\[\&\[data-visible\=\"true\"\]\]\:panda-anim-n_reveal[data-visible="true"]:not(`, `[data-reduced-motion="false"]:not(#\##\##\##\##\##\##\##\##\##\#) .allowMotion\:`

```css
@keyframes reveal {
  0% {
    visibility: hidden;
  }
  1% {
    visibility: visible;
  }
  100% {
    visibility: visible;
  }
}
```

### `@keyframes noopOpacity`

Duration: `0.45s, 0.45s` · Easing: `ease, ease` · Delay: `0s, 0s` · Iteration: `1, 1` · Fill: `none, none`

Used by: `[data-reduced-motion="false"]:not(#\##\##\##\##\##\##\##\##\##\#) .allowMotion\:`, `.\[\&\[data-evaluation\=\"skipped\"\]\]\:panda-anim_noopOpacity_0s_ease[data-eva`

```css
@keyframes noopOpacity {
  0%, 100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes panda-kf_dqSRBo`

Duration: `0.45s` · Easing: `ease-out` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.panda-anim_panda-kf_dqSRBo_450ms_ease-out:not(#\##\##\##\##\##\##\##\##\##\#)`, `.\[\&\[data-state\=\"current\"\]\]\:panda-anim_panda-kf_dqSRBo_500ms_ease-out\,_`

```css
@keyframes panda-kf_dqSRBo {
  0% {
    opacity: 0;
  }
}
```

> Opacity fade

### `@keyframes contentLoadingGradientFadeIn`

Duration: `0.2s` · Easing: `ease-out` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.before\:panda-anim_contentLoadingGradientFadeIn_0\.2s_ease-out:not(#\##\##\##\#`

```css
@keyframes contentLoadingGradientFadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.2;
  }
}
```

> Opacity fade

### `@keyframes evalFadeIn`

Duration: `0.2s` · Easing: `ease-out` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.panda-anim_evalFadeIn_0\.2s_ease-out:not(#\##\##\##\##\##\##\##\##\##\#)`

```css
@keyframes evalFadeIn {
  0% {
    opacity: 0;
    transform: translateY(4px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes evalFlashHighlight`

Duration: `1s` · Easing: `ease-out` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.panda-anim_evalFlashHighlight_1s_ease-out:not(#\##\##\##\##\##\##\##\##\##\#)`

```css
@keyframes evalFlashHighlight {
  0% {
    background-color: rgba(59, 130, 246, 0.08);
  }
  100% {
    background-color: var(--panda-colors-transparent);
  }
}
```

> Background color/gradient shift · Text color shift

### `@keyframes evalPulse`

Duration: `2s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.panda-anim_evalPulse_2s_ease-in-out_infinite:not(#\##\##\##\##\##\##\##\##\##\#`

```css
@keyframes evalPulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
```

> Opacity fade

### `@keyframes fillProgress`

Used by: `.after\:panda-anim-n_fillProgress:not(#\##\##\##\##\##\##\##\##\##\#)::after`

```css
@keyframes fillProgress {
  0% {
    transform: scaleX(0);
  }
  100% {
    transform: scaleX(1);
  }
}
```

> Transform/motion animation

### `@keyframes skeletonPulse`

Duration: `0.8s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.panda-anim_skeletonPulse_0\.8s_linear_infinite_alternate:not(#\##\##\##\##\##\#`

```css
@keyframes skeletonPulse {
  0% {
    background-color: rgb(242, 242, 242);
  }
  100% {
    background-color: rgb(229, 229, 229);
  }
}
```

> Background color/gradient shift · Background position (shimmer/scroll)

### `@keyframes skeletonPulseDark`

Duration: `0.8s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `[data-theme="dark"]:not(#\##\##\##\##\##\##\##\##\##\#) .dark\:panda-anim_skelet`

```css
@keyframes skeletonPulseDark {
  0% {
    background-color: rgb(76, 76, 76);
  }
  100% {
    background-color: gray;
  }
}
```

> Background color/gradient shift · Background position (shimmer/scroll)

### `@keyframes unstableShakeAnimation`

Duration: `0.42s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `[data-reduced-motion="false"]:not(#\##\##\##\##\##\##\##\##\##\#) [data-sonner-t`

```css
@keyframes unstableShakeAnimation {
  0% {
    opacity: 0;
    transform: translate(0px);
  }
  20% {
    opacity: 1;
    transform: translate(-7px);
  }
  40% {
    opacity: 1;
    transform: translate(7px);
  }
  60% {
    opacity: 1;
    transform: translate(-4.55px);
  }
  80% {
    opacity: 1;
    transform: translate(3.15px);
  }
  100% {
    opacity: 1;
    transform: translate(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes unstableToastDismiss`

Duration: `0.12s` · Easing: `ease-in` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.\[\&\[data-sonner-toast\]\[data-removed\=\"true\"\]\[data-swipe-out\=\"false\"\`

```css
@keyframes unstableToastDismiss {
  0% {
    opacity: 1;
    transform: translate(0px) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-4px) scale(0.96);
  }
}
```

> Fade + motion enter animation

### `@keyframes shakeX`

Duration: `0.45s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `[data-reduced-motion="false"]:not(#\##\##\##\##\##\##\##\##\##\#) .allowMotion\:`

```css
@keyframes shakeX {
  0% {
    transform: translate(0px);
  }
  12% {
    transform: translate(-9px);
  }
  30% {
    transform: translate(9px);
  }
  48% {
    transform: translate(-7px);
  }
  65% {
    transform: translate(5px);
  }
  80% {
    transform: translate(-3px);
  }
  90% {
    transform: translate(2px);
  }
  100% {
    transform: translate(0px);
  }
}
```

> Transform/motion animation

### `@keyframes shakeXInverse`

Duration: `0.45s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `[data-reduced-motion="false"]:not(#\##\##\##\##\##\##\##\##\##\#) .allowMotion\:`

```css
@keyframes shakeXInverse {
  0% {
    transform: translate(0px);
  }
  12% {
    transform: translate(9px);
  }
  30% {
    transform: translate(-9px);
  }
  48% {
    transform: translate(7px);
  }
  65% {
    transform: translate(-5px);
  }
  80% {
    transform: translate(3px);
  }
  90% {
    transform: translate(-2px);
  }
  100% {
    transform: translate(0px);
  }
}
```

> Transform/motion animation

### `@keyframes borderGlow`

Duration: `1s` · Easing: `ease-out` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.\[\&\[data-animate\]\[data-evaluation\=\"correct\"\]\]\:panda-anim_borderGlow_1`

```css
@keyframes borderGlow {
  0% {
    box-shadow: 0px 0px 0px 0px color-mix(in srgb, var(--border-glow-color) 40%, transparent);
  }
  50% {
    box-shadow: 0px 0px 20px 8px color-mix(in srgb, var(--border-glow-color) 30%, transparent);
  }
  100% {
    box-shadow: 0px 0px 0px 0px color-mix(in srgb, var(--border-glow-color) 0%, transparent);
  }
}
```

> Shadow pulse/glow effect

### `@keyframes endstate-streakBgFadeIn`

Duration: `2s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.before\:panda-anim_endstate-streakBgFadeIn_2s_ease-in-out_forwards:not(#\##\##\`

```css
@keyframes endstate-streakBgFadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.5;
  }
}
```

> Opacity fade

### `@keyframes floatyNudge`

Duration: `1.2s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.panda-anim_floatyNudge_1200ms_ease-in-out_infinite:not(#\##\##\##\##\##\##\##\#`

```css
@keyframes floatyNudge {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}
```

> Transform/motion animation

### `@keyframes flyToTarget`

Used by: `.panda-anim-n_flyToTarget:not(#\##\##\##\##\##\##\##\##\##\#)`

```css
@keyframes flyToTarget {
  0% {
    opacity: 0;
    transform: translate(-50%, calc(50% + var(--fly-to-target-starting-offset-y,46px))) scale(.8);
  }
  25% {
    opacity: 1;
    transform: translate(-50%, calc(50% + var(--fly-to-target-starting-offset-y,46px))) scale(1);
  }
  45% {
    opacity: 1;
    transform: translate(-50%, calc(50% + var(--fly-to-target-starting-offset-y,46px))) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.3);
  }
}
```

> Fade + motion enter animation

### `@keyframes routerKojiBottomMask`

Used by: `.panda-anim-n_routerKojiTopMask\,_routerKojiBottomMask:not(#\##\##\##\##\##\##\#`

```css
@keyframes routerKojiBottomMask {
  0% {
    --router-koji-bottom-mask-alpha: 0;
  }
  100% {
    --router-koji-bottom-mask-alpha: 1;
  }
}
```

### `@keyframes routerKojiTopMask`

Used by: `.panda-anim-n_routerKojiTopMask\,_routerKojiBottomMask:not(#\##\##\##\##\##\##\#`

```css
@keyframes routerKojiTopMask {
  0% {
    --router-koji-top-mask-alpha: 1;
  }
  100% {
    --router-koji-top-mask-alpha: 0;
  }
}
```

### `@keyframes scaleIn`

Duration: `0.1s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.panda-anim_scaleIn_0\.1s_forwards:not(#\##\##\##\##\##\##\##\##\##\#)`

```css
@keyframes scaleIn {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
```

> Fade + motion enter animation

### `@keyframes selfDashboardBlurIn`

Duration: `0.3s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `[data-reduced-motion="false"]:not(#\##\##\##\##\##\##\##\##\##\#) .allowMotion\:`

```css
@keyframes selfDashboardBlurIn {
  0% {
    filter: none;
  }
  100% {
    filter: blur(7px);
  }
}
```

> Filter effect (blur/brightness)

### `@keyframes shimmer`

Duration: `6.4s` · Easing: `cubic-bezier(0.16, 1, 0.7, 1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.panda-anim_shimmer_6400ms_cubic-bezier\(\.16\,_1\,_0\.7\,_1\)_infinite:not(#\##`

```css
@keyframes shimmer {
  0% {
    opacity: 1;
    left: -100%;
  }
  25% {
    opacity: 1;
    left: 100%;
  }
  26% {
    opacity: 0;
  }
  100% {
    opacity: 0;
    left: 100%;
  }
}
```

> Opacity fade

### `@keyframes slideToBottom`

Used by: `[data-reduced-motion="false"]:not(#\##\##\##\##\##\##\##\##\##\#) .allowMotion\:`

```css
@keyframes slideToBottom {
  0% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(var(--slide-to-bottom-distance,8px));
  }
}
```

> Transform/motion animation

### `@keyframes slideUp`

Duration: `0.4s` · Easing: `ease-in-out` · Delay: `0.35s` · Iteration: `1` · Fill: `both`

Used by: `[data-reduced-motion="false"]:not(#\##\##\##\##\##\##\##\##\##\#) .allowMotion\:`

```css
@keyframes slideUp {
  0% {
    opacity: 0;
    transform: translateY(var(--slide-up-distance,8px));
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes typingDotWave`

Used by: `.panda-anim-n_typingDotWave:not(#\##\##\##\##\##\##\##\##\##\#)`

```css
@keyframes typingDotWave {
  0% {
    transform: translateY(0px);
  }
  20% {
    transform: translateY(-4px);
  }
  40% {
    transform: translateY(0px);
  }
}
```

> Transform/motion animation

### `@keyframes endstateStreakColorOutline`

Duration: `1.333s, 0.4s, 0.5s` · Easing: `ease, cubic-bezier(0.5, 0, 0.5, 1), cubic-bezier(0.5, 0, 0.5, 1)` · Delay: `0s, 0.267s, 0.833s` · Iteration: `1, 1, 1` · Fill: `forwards, forwards, forwards`

Used by: `.\[\&\[data-animate\]\]\:panda-anim_endstateStreakScaleOutline_1333ms_forwards\,`

```css
@keyframes endstateStreakColorOutline {
  100% {
  }
}
```

> Border animation · Text color shift

### `@keyframes endstateStreakDayBounce`

Duration: `0.833s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.\[\&\[data-animate\]\]\:panda-anim_endstateStreakDayBounce_833ms_forwards[data-`

```css
@keyframes endstateStreakDayBounce {
  0% {
    animation-timing-function: cubic-bezier(0.5, 0, 0, 1);
    transform: translateY(0px);
  }
  84% {
    animation-timing-function: cubic-bezier(0.5, 0, 1, 1);
    transform: translateY(13.3333px);
  }
  100% {
    transform: translateY(0px);
  }
}
```

> Transform/motion animation

### `@keyframes endstateStreakFadeOutline`

Duration: `1.333s, 0.4s, 0.5s` · Easing: `ease, cubic-bezier(0.5, 0, 0.5, 1), cubic-bezier(0.5, 0, 0.5, 1)` · Delay: `0s, 0.267s, 0.833s` · Iteration: `1, 1, 1` · Fill: `forwards, forwards, forwards`

Used by: `.\[\&\[data-animate\]\]\:panda-anim_endstateStreakScaleOutline_1333ms_forwards\,`

```css
@keyframes endstateStreakFadeOutline {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
```

> Opacity fade

### `@keyframes endstateStreakScaleBackgroundCircle`

Duration: `0.566s` · Easing: `ease` · Delay: `0.667s` · Iteration: `1` · Fill: `forwards`

Used by: `.\[\&\[data-animate\]\]\:panda-anim_endstateStreakScaleBackgroundCircle_566ms_66`

```css
@keyframes endstateStreakScaleBackgroundCircle {
  0% {
    opacity: 1;
    animation-timing-function: cubic-bezier(0, 0, 0, 1);
    transform: scale(1);
  }
  59% {
    opacity: 1;
    animation-timing-function: cubic-bezier(0.5, 0, 0.5, 1);
    transform: scale(0.9);
  }
  79% {
    opacity: 1;
    animation-timing-function: cubic-bezier(0.5, 0, 0.5, 1);
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
```

> Fade + motion enter animation

### `@keyframes endstateStreakScaleBolt`

Duration: `0.566s` · Easing: `ease` · Delay: `0.667s` · Iteration: `1` · Fill: `forwards`

Used by: `.\[\&\[data-animate\]\]\:panda-anim_endstateStreakScaleBolt_566ms_667ms_forwards`

```css
@keyframes endstateStreakScaleBolt {
  0% {
    opacity: 1;
    animation-timing-function: cubic-bezier(0, 0, 0, 1);
    transform: scale(1.2);
  }
  59% {
    opacity: 1;
    animation-timing-function: cubic-bezier(0.5, 0, 0.5, 1);
    transform: scale(0.9);
  }
  79% {
    opacity: 1;
    animation-timing-function: cubic-bezier(0.5, 0, 0.5, 1);
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
```

> Fade + motion enter animation

### `@keyframes endstateStreakScaleOutline`

Duration: `1.333s, 0.4s, 0.5s` · Easing: `ease, cubic-bezier(0.5, 0, 0.5, 1), cubic-bezier(0.5, 0, 0.5, 1)` · Delay: `0s, 0.267s, 0.833s` · Iteration: `1, 1, 1` · Fill: `forwards, forwards, forwards`

Used by: `.\[\&\[data-animate\]\]\:panda-anim_endstateStreakScaleOutline_1333ms_forwards\,`

```css
@keyframes endstateStreakScaleOutline {
  0% {
    animation-timing-function: cubic-bezier(0.5, 0, 0, 1);
    transform: scale(1);
  }
  50% {
    animation-timing-function: cubic-bezier(0.5, 0, 1, 1);
    transform: scale(1.5);
  }
  62.5% {
    animation-timing-function: cubic-bezier(0, 0, 0, 1);
    transform: scale(1);
  }
  100% {
    transform: scale(1.5);
  }
}
```

> Transform/motion animation

### `@keyframes panda-kf_lbAflV`

Duration: `0.5s, 0.7s` · Easing: `ease-out, cubic-bezier(0.22, 1, 0.36, 1)` · Delay: `0s, 0s` · Iteration: `1, 1` · Fill: `none, none`

Used by: `.\[\&\[data-state\=\"current\"\]\]\:panda-anim_panda-kf_dqSRBo_500ms_ease-out\,_`

```css
@keyframes panda-kf_lbAflV {
  0% {
    transform: scale(1.02);
  }
}
```

> Transform/motion animation

### `@keyframes swiper-preloader-spin`

Duration: `1s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.swiper:not(.swiper-watch-progress) .swiper-lazy-preloader, .swiper-watch-progre`

```css
@keyframes swiper-preloader-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

> Transform/motion animation

### `@keyframes swipe-out-left`

Used by: `[data-sonner-toast][data-swipe-out="true"][data-swipe-direction="left"]`

```css
@keyframes swipe-out-left {
  0% {
    transform: var(--y) translateX(var(--swipe-amount-x));
    opacity: 1;
  }
  100% {
    transform: var(--y) translateX(calc(var(--swipe-amount-x) - 100%));
    opacity: 0;
  }
}
```

> Fade + motion enter animation

### `@keyframes swipe-out-right`

Used by: `[data-sonner-toast][data-swipe-out="true"][data-swipe-direction="right"]`

```css
@keyframes swipe-out-right {
  0% {
    transform: var(--y) translateX(var(--swipe-amount-x));
    opacity: 1;
  }
  100% {
    transform: var(--y) translateX(calc(var(--swipe-amount-x) + 100%));
    opacity: 0;
  }
}
```

> Fade + motion enter animation

### `@keyframes swipe-out-up`

Used by: `[data-sonner-toast][data-swipe-out="true"][data-swipe-direction="up"]`

```css
@keyframes swipe-out-up {
  0% {
    transform: var(--y) translateY(var(--swipe-amount-y));
    opacity: 1;
  }
  100% {
    transform: var(--y) translateY(calc(var(--swipe-amount-y) - 100%));
    opacity: 0;
  }
}
```

> Fade + motion enter animation

### `@keyframes swipe-out-down`

Used by: `[data-sonner-toast][data-swipe-out="true"][data-swipe-direction="down"]`

```css
@keyframes swipe-out-down {
  0% {
    transform: var(--y) translateY(var(--swipe-amount-y));
    opacity: 1;
  }
  100% {
    transform: var(--y) translateY(calc(var(--swipe-amount-y) + 100%));
    opacity: 0;
  }
}
```

> Fade + motion enter animation

### `@keyframes sonner-fade-in`

Duration: `0.3s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `[data-sonner-toast][data-promise="true"] [data-icon] > svg`

```css
@keyframes sonner-fade-in {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
```

> Fade + motion enter animation

### `@keyframes sonner-fade-out`

Duration: `0.2s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.sonner-loading-wrapper[data-visible="false"]`

```css
@keyframes sonner-fade-out {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.8);
  }
}
```

> Fade + motion enter animation

### `@keyframes sonner-spin`

Duration: `1.2s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.sonner-loading-bar`

```css
@keyframes sonner-spin {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.15;
  }
}
```

> Opacity fade

### `@keyframes fadeOut`

```css
@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
```

> Opacity fade

### `@keyframes noop`

```css
@keyframes noop {
}
```

### `@keyframes endstate-habitFadeIn`

```css
@keyframes endstate-habitFadeIn {
  0% {
    opacity: 0;
  }
  90% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes endstate-habitMoveUp`

```css
@keyframes endstate-habitMoveUp {
  0% {
    transform: translateY(var(--habit-start-y,0px));
  }
  100% {
    transform: translateY(48px);
  }
}
```

> Transform/motion animation

### `@keyframes popularCardShine`

```css
@keyframes popularCardShine {
  0% {
  }
  100% {
  }
}
```

> Background color/gradient shift · Background position (shimmer/scroll)

### `@keyframes suppressDuringTransition`

```css
@keyframes suppressDuringTransition {
  0%, 100% {
    visibility: hidden;
  }
}
```

### `@keyframes xpCounterPulse`

```css
@keyframes xpCounterPulse {
  0%, 100% {
    transform: scale(1);
  }
  60% {
    transform: scale(1.2);
  }
}
```

> Transform/motion animation

### `@keyframes endstateParticleBurstOut`

```css
@keyframes endstateParticleBurstOut {
  0% {
    background-color: var(--panda-colors-bg-pear-primary);
    transform: translate(calc(var(--particle-direction-x) * var(--particle-starting-distance)), calc(var(--particle-direction-y) * var(--particle-starting-distance)));
  }
  100% {
    background-color: var(--panda-colors-bg-pear-primary);
    transform: translate(calc(var(--particle-direction-x) * var(--particle-ending-distance)), calc(var(--particle-direction-y) * var(--particle-ending-distance)));
  }
}
```

> Transform/motion animation · Background color/gradient shift

### `@keyframes endstateParticleScaleAndFade`

```css
@keyframes endstateParticleScaleAndFade {
  0% {
    background-color: var(--panda-colors-bg-pear-primary);
    opacity: 1;
    animation-timing-function: cubic-bezier(0, 0, 0.5, 1);
    transform: rotate(45deg) scale(1);
  }
  40% {
    background-color: var(--panda-colors-bg-pear-primary);
    opacity: 1;
    animation-timing-function: cubic-bezier(0.5, 0, 1, 1);
    transform: rotate(45deg) scale(2);
  }
  100% {
    background-color: var(--panda-colors-bg-pear-primary);
    opacity: 0;
    transform: rotate(45deg) scale(0);
  }
}
```

> Fade + motion enter animation · Background color/gradient shift

### `@keyframes endstateStreakDayRipple`

```css
@keyframes endstateStreakDayRipple {
  0% {
    animation-timing-function: cubic-bezier(0, 0, 0.5, 1);
    transform: translate(0px);
  }
  20% {
    transform: translateX(calc(var(--ripple-direction) * 6.66667px));
    animation-timing-function: cubic-bezier(0.5, 0, 0.2, 1);
  }
  100% {
    transform: translate(0px);
  }
}
```

> Transform/motion animation

### `@keyframes leaguesRowDrop`

```css
@keyframes leaguesRowDrop {
  0% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
```

> Transform/motion animation

### `@keyframes leaguesRowRaise`

```css
@keyframes leaguesRowRaise {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}
```

> Transform/motion animation

### `@keyframes panda-kf_isxolt`

```css
@keyframes panda-kf_isxolt {
  0% {
    transform: translateY(24px);
  }
}
```

> Transform/motion animation

## Motion Tokens (CSS Variables)

### Animation Tokens

```css
--panda-z-index-in-content-ask-koji-animation: 31;
```

### Other Tokens

```css
--panda-z-index-lesson-transition-overlay: 10;
```

## Global Transition Declarations

These `transition` values were extracted from CSS rules across the site:

```css
transition: opacity 0.1s linear;
transition: 0.3s ease-in-out;
transition: 0.3s;
transition: background 0.15s, border-color 0.15s;
transition: background 0.15s, color 0.15s;
transition: background-color 0.2s, color 0.2s, opacity 0.2s;
transition: background-color 0.2s;
transition: background-color 0.15s ease-in-out;
transition: max-height 0.2s, opacity 0.2s;
transition: opacity 0.2s;
transition: opacity 1.5s ease-out, transform 1.5s ease-out;
transition: opacity 0.2s ease-out 0.3s;
```

## How to Recreate This Motion Design

### Step 2 — Scroll-Reveal Pattern

Elements that animate into view follow this pattern:

```css
/* Initial hidden state */
.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.1s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.1s cubic-bezier(0.4, 0, 0.2, 1);
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Step 3 — Key Motion Principles

- **Canvas elements (1)** — animated via requestAnimationFrame loop. Use canvas for particle effects, gradient animations, and WebGL scenes
- **Duration scale:** `0.1s` · `0.3s` · `0.15s` — use these values, never invent new durations
- **Always add** `@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`

### Step 4 — Scroll Journey Reference

Match what happens at each scroll position:

- **0%** (`0px`) → `screens/scroll/scroll-000.png`
- **17%** (`1280px`) → `screens/scroll/scroll-017.png`
- **33%** (`2485px`) → `screens/scroll/scroll-033.png`
- **50%** (`3766px`) → `screens/scroll/scroll-050.png`
- **67%** (`5046px`) → `screens/scroll/scroll-067.png`
- **83%** (`6251px`) → `screens/scroll/scroll-083.png`
- **100%** (`7531px`) → `screens/scroll/scroll-100.png`

## Layout & Grid (LAYOUT.md)

# Layout Reference

> Auto-extracted from live DOM. Use this to understand how the site is structured spatially.

## Spacing System

**Base grid:** 4px

**Scale:** `2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30` px

| Spacing | Semantic Use |
|---------|-------------|
| 4px | Tight — within a component |
| 8px | Medium — between sibling items |
| 16px | Wide — between sections |
| 32px | Vast — major section breaks |

## Flex Layouts

| Element | Direction | Justify | Align | Gap | Children |
|---------|-----------|---------|-------|-----|----------|
| `div.panda-ai_stretch.panda-d_flex` | column | — | stretch | 0px | 3 |
| `div.panda-bg_bg.oat.xl:panda-bg_bg.primary` | column | — | — | — | 9 |
| `div.panda-ai_center.panda-d_flex` | column | center | center | 32px | 3 |
| `nav.panda-ai_center.panda-bg_bg.primary` | row | space-between | center | 10px | 2 |
| `div.panda-d_flex.panda-flex-d_column` | column | — | — | — | 2 |
| `div.panda-d_flex.panda-ai_center` | row | — | center | 16px | 2 |
| `section.panda-ai_center.panda-d_flex` | column | — | center | — | 4 |
| `div.panda-anim_panda-kf_dqSRBo_700ms_ease-out_var(--reveal-d` | column | — | center | — | 3 |
| `button.panda-bdr_[calc(56px_/_var(--button3d-x-scale,_1))_/_` | row | — | — | — | 1 |
| `div.panda-ai_center.panda-d_flex` | row | center | center | 22px | 2 |
| `article.panda-anim_panda-kf_dqSRBo_700ms_ease-out_var(--reve` | column | — | — | — | 3 |
| `article.panda-anim_panda-kf_dqSRBo_700ms_ease-out_var(--reve` | column | — | — | — | 3 |
| `article.panda-anim_panda-kf_dqSRBo_700ms_ease-out_var(--reve` | column | — | — | — | 3 |
| `div.panda-d_flex.[@media_(scripting:_none)]:panda-anim_none` | row | — | — | 12px | 2 |
| `div.panda-d_flex.[@supports_(corner-shape:_superellipse(2))]` | row | — | — | 48px | 2 |

## Grid Layouts

| Element | Template Columns | Gap | Children |
|---------|-----------------|-----|----------|
| `div.panda-d_grid.panda-cg_0` | `283px 184px 184px 184px 184px 157px` | 0px | 6 |
| `div.panda-d_grid.panda-cg_4` | `378.656px 378.672px 378.656px` | 24px 20px | 4 |
| `article.panda-anim_panda-kf_dqSRBo_700ms_ease-out_var(--reve` | `subgrid [] [] [] []` | 8px 20px | 2 |
| `div.panda-d_flex.lg:panda-d_grid` | `376px 376px 376px` | 24px | 3 |
| `div.panda-d_grid.panda-h_365px` | `297px` | — | 10 |

## Structural Containers

### `<footer>` (`footer.panda-bg_black.panda-c_oat.50`)

```
display:          block
padding:          90px 0px 0px
children:         2
```

### `<section>` (`section.panda-bg_gray.950.panda-ov_hidden`)

```
display:          block
children:         2
```

### `<section>` 

```
display:          block
children:         2
```

### `<section>` (`section.panda-bg_bg.oat.panda-pb_0`)

```
display:          block
padding:          97px 0px 0px
children:         1
```

### `<nav>` (`nav.panda-ai_center.panda-bg_bg.primary`)

```
display:          flex
flex-direction:   row
justify-content:  space-between
align-items:      center
gap:              10px
padding:          0px 8px 0px 32px
children:         2
```

### `<section>` (`section.panda-isolation_isolate.panda-ov-x_clip`)

```
display:          block
padding:          39px 0px 0px
children:         3
```

### `<section>` (`section.panda-bg_bg.oat.panda-pb_16`)

```
display:          block
padding:          88px 0px 117px
children:         1
```

### `<section>` (`section.panda-bg_bg.primary.panda-pb_16`)

```
display:          block
padding:          104px 0px 110px
children:         1
```

### `<section>` (`section.panda-bg_bg.oat.panda-ov-x_clip`)

```
display:          block
padding:          131px 0px 56px
children:         3
```

### `<section>` (`section.panda-ai_center.panda-d_flex`)

```
display:          flex
flex-direction:   column
justify-content:  —
align-items:      center
padding:          32px 20px 0px
children:         4
```

### `<article>` (`article.panda-anim_panda-kf_dqSRBo_700ms_ease-out_var(--reve`)

```
display:          grid
grid-template-columns: subgrid [] [] [] []
gap:              8px 20px
padding:          14px 16px 14px 14px
children:         2
```

### `<article>` (`article.panda-anim_panda-kf_dqSRBo_700ms_ease-out_var(--reve`)

```
display:          flex
flex-direction:   column
justify-content:  —
align-items:      —
padding:          32px
children:         3
```

## Layout Rules

- **Container max-width:** `100%` — always center with `margin: auto`
- Primary layout system: **Flexbox**
- Secondary layout system: **CSS Grid** (used for card grids and multi-column layouts)
- Every spacing value must be a multiple of **4px**
- Never use arbitrary margin/padding values outside the spacing scale

## Component Patterns (COMPONENTS.md)

# Component Reference

> Repeated DOM patterns detected by structural analysis. Each component appeared 3+ times.

## Detected Components

| Component | Category | Instances | Key Classes |
|-----------|----------|-----------|-------------|
| **Panda C Text.Secondary** | unknown | 10× | `.panda-c_text.secondary`, `.panda-fs_14.5px`, `.panda-lh_1.55` |
| **Panda C Text.Secondary** | unknown | 10× | `.panda-c_text.secondary`, `.panda-fs_15px`, `.panda-lh_1.6` |
| **[[Data Expanded] > &]:Panda Vis Hidden** | unknown | 8× | `.[[data-expanded]_>_&]:panda-vis_hidden`, `.panda-d_block`, `.panda-h_full` |
| **[&:Has(> Button:Focus Visible)]:Panda Bx Sh Elevation.Outline** | button | 6× | `.[&:has(>_button:focus-visible)]:panda-bx-sh_elevation.outline`, `.[&[data-expanded]]:panda-bd-w_0`, `.[&[data-expanded]]:panda-bdr_none` |
| **[&[Data Revealed]]:Panda Anim Ps Running** | unknown | 6× | `.[&[data-revealed]]:panda-anim-ps_running`, `.[@media_(scripting:_none)]:panda-anim_none`, `.panda-anim_panda-kf_dqSRBo_700ms_ease-out_var(--reveal-delay)_backwards_paused,_panda-kf_isxolt_1000ms_cubic-bezier(0.22,_1,_0.36,_1)_var(--reveal-delay)_backwards_paused` |
| **[&[Data State="Current"]]:Panda Op 1** | unknown | 5× | `.[&[data-state="current"]]:panda-op_1`, `.[&[data-state="current"]]:panda-trs_opacity_800ms_cubic-bezier(0.4,_0,_0.2,_1)`, `.[&[data-state="current"]]:panda-vis_visible` |
| **Panda C Text.Primary** | unknown | 5× | `.panda-c_text.primary`, `.panda-d_block`, `.panda-lh_1.3` |
| **Li** | list-item | 5× |  |
| **[&:Not([Aria Current="True"]):Hover]:Panda C Text.Tertiary** | button | 5× | `.[&:not([aria-current="true"]):hover]:panda-c_text.tertiary`, `.focusVisible:panda-bx-sh_elevation.outline`, `.panda-bd-w_0` |
| **Panda Bd W 0** | button | 5× | `.panda-bd-w_0`, `.panda-bg_transparent`, `.panda-cursor_pointer` |
| **[&:Active]:Panda Trf Scale(0.98)** | button | 5× | `.[&:active]:panda-trf_scale(0.98)`, `.[&:active]:panda-trs-dur_80ms`, `.[&:not([aria-selected="true"]):hover]:panda-c_text.primary` |
| **Div** | unknown | 4× |  |
| **Panda C Text.Primary** | unknown | 4× | `.panda-c_text.primary`, `.panda-textStyle_display.xl` |
| **[&[Data Current]]:Panda Op 1** | unknown | 4× | `.[&[data-current]]:panda-op_1`, `.[&[data-current]]:panda-trs_opacity_450ms_ease_150ms`, `.[&[data-current]]:panda-vis_visible` |
| **Panda C Text.Primary** | unknown | 4× | `.panda-c_text.primary`, `.panda-textStyle_ui.actions.lg` |
| **Panda H Full** | unknown | 3× | `.panda-h_full`, `.panda-pos_relative`, `.panda-w_full` |
| **Panda D Block** | unknown | 3× | `.panda-d_block`, `.panda-h_full`, `.panda-obj-f_cover` |
| **Panda Bg P Center** | unknown | 3× | `.panda-bg-p_center`, `.panda-bg-s_cover`, `.panda-h_full` |
| **[@Supports Not (Text Wrap: Pretty)]:Panda Tw Balance** | unknown | 3× | `.[@supports_not_(text-wrap:_pretty)]:panda-tw_balance`, `.panda-c_text.secondary`, `.panda-ls_[-0.16px]` |
| **Panda Max W Calc(1176px + 2 * Token(Spacing.8))** | unknown | 3× | `.panda-max-w_calc(1176px_+_2_*_token(spacing.8))`, `.panda-mx_auto`, `.panda-px_5` |

## List Items

### Li

**Instances found:** 5

**HTML structure:**

```html
<li data-slot="li" class=""><button data-slot="button" type="button" class="panda-c_text.primary panda-d_block panda-lh_1.3 panda-textStyle_ui.actions.lg panda-bg_transparent panda-bd-w_0 panda-cursor_pointer panda-ring_none panda-p_0 panda-ta_left panda-trs_color_200ms_ease panda-w_full [&amp;:not([aria-current=&quot;true&quot;]):hover]:panda-c_text.tertiary focusVisible:panda-bx-sh_elevation.outline" aria-current="true">Visual, interactive tutoring</button><div data-slot="box" class="panda-d_grid panda-grid-tr_minmax(0,_0fr) panda-op_0 panda-ov_hidden panda-trs_grid-template-rows_400ms_ease,
```

**Base styles (from design tokens):**

```css
.li {
  padding: 4px 0;
}```

## Buttons

### [&:Has(> Button:Focus Visible)]:Panda Bx Sh Elevation.Outline

**Instances found:** 6

**CSS classes:** `.[&:has(>_button:focus-visible)]:panda-bx-sh_elevation.outline` `.[&[data-expanded]]:panda-bd-w_0` `.[&[data-expanded]]:panda-bdr_none` `.[&[data-expanded]]:panda-bg_black` `.[&[data-expanded]]:panda-bx-sh_none` `.[&[data-expanded]]:panda-pos_fixed`

**HTML structure:**

```html
<div data-slot="box" class="panda-bg_bg.primary panda-bd-c_border.oat panda-bdr_2xl panda-border-style_solid panda-bd-w_1px panda-bx-sh_[0px_0px_70px_0px_token(colors.blackAlpha.100)] panda-inset_0 panda-op_var(--slide-opacity) panda-ov_hidden panda-pos_absolute panda-trf_translateX(calc(var(--slide-offset)_*_(92.5%_+_70px)))_scale(var(--slide-scale)) panda-trs_transform_750ms_cubic-bezier(0.22,_1,_0.36,_1),_opacity_750ms_ease [&amp;:has(&gt;_button:focus-visible)]:panda-bx-sh_elevation.outline [&amp;[data-expanded]]:panda-bg_black [&amp;[data-expanded]]:panda-bdr_none [&amp;[data-expanded]]:p
```

**Base styles (from design tokens):**

```css
.[&:has(>_button:focus-visible)]:panda-bx-sh_elevation.outline {
  background: #ffcc9c;
  color: #000000;
  border-radius: 22px;
  padding: 4px 8px;
  cursor: pointer;
}```

### [&:Not([Aria Current="True"]):Hover]:Panda C Text.Tertiary

**Instances found:** 5

**CSS classes:** `.[&:not([aria-current="true"]):hover]:panda-c_text.tertiary` `.focusVisible:panda-bx-sh_elevation.outline` `.panda-bd-w_0` `.panda-bg_transparent` `.panda-c_text.primary` `.panda-cursor_pointer`

**HTML structure:**

```html
<button data-slot="button" type="button" class="panda-c_text.primary panda-d_block panda-lh_1.3 panda-textStyle_ui.actions.lg panda-bg_transparent panda-bd-w_0 panda-cursor_pointer panda-ring_none panda-p_0 panda-ta_left panda-trs_color_200ms_ease panda-w_full [&amp;:not([aria-current=&quot;true&quot;]):hover]:panda-c_text.tertiary focusVisible:panda-bx-sh_elevation.outline" aria-current="true">Visual, interactive tutoring</button>
```

**Base styles (from design tokens):**

```css
.[&:not([aria-current="true"]):hover]:panda-c_text.tertiary {
  background: #ffcc9c;
  color: #000000;
  border-radius: 22px;
  padding: 4px 8px;
  cursor: pointer;
}```

### Panda Bd W 0

**Instances found:** 5

**CSS classes:** `.panda-bd-w_0` `.panda-bg_transparent` `.panda-cursor_pointer` `.panda-inset_0` `.panda-pos_absolute` `.panda-ring_none`

**HTML structure:**

```html
<button data-slot="button" type="button" class="panda-bg_transparent panda-bd-w_0 panda-cursor_pointer panda-inset_0 panda-ring_none panda-pos_absolute" aria-label="Show Science-backed learning"></button>
```

**Base styles (from design tokens):**

```css
.panda-bd-w_0 {
  background: #ffcc9c;
  color: #000000;
  border-radius: 22px;
  padding: 4px 8px;
  cursor: pointer;
}```

### [&:Active]:Panda Trf Scale(0.98)

**Instances found:** 5

**CSS classes:** `.[&:active]:panda-trf_scale(0.98)` `.[&:active]:panda-trs-dur_80ms` `.[&:not([aria-selected="true"]):hover]:panda-c_text.primary` `.focusVisible:panda-bx-sh_elevation.outline` `.panda-bd-c_border.oat` `.panda-bd-w_1px`

**HTML structure:**

```html
<button type="button" data-orientation="horizontal" aria-disabled="false" tabindex="-1" role="tab" aria-selected="false" id="base-ui-:R1b5bhlakm:" class="panda-bg_bg.primary panda-bd-c_border.oat panda-bdr_full panda-border-style_solid panda-bd-w_1px panda-bx-sh_[0px_4px_10px_0px_token(colors.blackAlpha.100)] panda-c_text.tertiary panda-ls_[-0.176px] panda-ring_none panda-px_5 panda-textStyle_body.base panda-trs_color_150ms_ease,_transform_250ms_cubic-bezier(0.22,_1,_0.36,_1) focusVisible:panda-bx-sh_elevation.outline panda-cursor_pointer panda-h_10 lg:panda-h_46px panda-white-space_nowrap [&a
```

**Base styles (from design tokens):**

```css
.[&:active]:panda-trf_scale(0.98) {
  background: #ffcc9c;
  color: #000000;
  border-radius: 22px;
  padding: 4px 8px;
  cursor: pointer;
}```

## Other Components

### Panda C Text.Secondary

**Instances found:** 10

**CSS classes:** `.panda-c_text.secondary` `.panda-fs_14.5px` `.panda-lh_1.55` `.panda-pb_3` `.panda-pt_3` `.panda-textStyle_body.sm`

**HTML structure:**

```html
<span data-slot="span" class="panda-c_text.secondary panda-fs_14.5px panda-lh_1.55 panda-pb_3 panda-pt_3 panda-textStyle_body.sm">Brilliant sees your work and notices when you’re off track. It asks guiding questions, patiently explains concepts with interactive diagrams, and sketches on your screen until you actually understand what to do and why.</span>
```

**Base styles (from design tokens):**

```css
.panda-c_text.secondary {
  padding: 4px;
}```

### Panda C Text.Secondary

**Instances found:** 10

**CSS classes:** `.panda-c_text.secondary` `.panda-fs_15px` `.panda-lh_1.6` `.panda-ls_[-0.15px]` `.panda-textStyle_body.base`

**HTML structure:**

```html
<p data-slot="p" class="panda-c_text.secondary panda-fs_15px panda-ls_[-0.15px] panda-lh_1.6 panda-textStyle_body.base">When you’re stuck, Koji asks guiding questions and offers visual hints to help you spot where you went wrong and solve the problem yourself.</p>
```

**Base styles (from design tokens):**

```css
.panda-c_text.secondary {
  padding: 4px;
}```

### [[Data Expanded] > &]:Panda Vis Hidden

**Instances found:** 8

**CSS classes:** `.[[data-expanded]_>_&]:panda-vis_hidden` `.panda-d_block` `.panda-h_full` `.panda-obj-f_cover` `.panda-w_full`

**HTML structure:**

```html
<img data-slot="img" alt="" class="panda-d_block panda-h_full panda-obj-f_cover panda-w_full [[data-expanded]_&gt;_&amp;]:panda-vis_hidden" loading="lazy" width="3456" height="1944" decoding="async" style="color:transparent" sizes="min(1024px, calc(100vw - 40px))" srcset="/cdn-cgi/image/width=32,quality=75,format=auto/_next/static/media/blake-1.2m3yhr8ri6zhl.png 32w, /cdn-cgi/image/width=48,quality=75,format=auto/_next/static/media/blake-1.2m3yhr8ri6zhl.png 48w, /cdn-cgi/image/width=64,quality=75,format=auto/_next/static/media/blake-1.2m3yhr8ri6zhl.png 64w, /cdn-cgi/image/width=96,quality=75,f
```

**Base styles (from design tokens):**

```css
.[[data-expanded]_>_&]:panda-vis_hidden {
  padding: 4px;
}```

### [&[Data Revealed]]:Panda Anim Ps Running

**Instances found:** 6

**CSS classes:** `.[&[data-revealed]]:panda-anim-ps_running` `.[@media_(scripting:_none)]:panda-anim_none` `.panda-anim_panda-kf_dqSRBo_700ms_ease-out_var(--reveal-delay)_backwards_paused,_panda-kf_isxolt_1000ms_cubic-bezier(0.22,_1,_0.36,_1)_var(--reveal-delay)_backwards_paused` `.reduceMotion:panda-anim_none`

**HTML structure:**

```html
<div class="panda-anim_panda-kf_dqSRBo_700ms_ease-out_var(--reveal-delay)_backwards_paused,_panda-kf_isxolt_1000ms_cubic-bezier(0.22,_1,_0.36,_1)_var(--reveal-delay)_backwards_paused [&amp;[data-revealed]]:panda-anim-ps_running reduceMotion:panda-anim_none [@media_(scripting:_none)]:panda-anim_none" data-reveal="" style="--reveal-delay:0ms"><div data-slot="vstack" class="panda-ai_center panda-d_flex panda-flex-d_column panda-ta_center"><h2 data-slot="heading" class="panda-c_text.primary panda-textStyle_display.xl md:panda-textStyle_display.2xl lg:panda-textStyle_display.3xl">From 5<sup data-sl
```

**Base styles (from design tokens):**

```css
.[&[data-revealed]]:panda-anim-ps_running {
  padding: 4px;
}```

### [&[Data State="Current"]]:Panda Op 1

**Instances found:** 5

**CSS classes:** `.[&[data-state="current"]]:panda-op_1` `.[&[data-state="current"]]:panda-trs_opacity_800ms_cubic-bezier(0.4,_0,_0.2,_1)` `.[&[data-state="current"]]:panda-vis_visible` `.[&[data-state="current"]]:panda-z_relativeFront2` `.[&[data-state="previous"]]:panda-trs_opacity_800ms_cubic-bezier(0.4,_0,_0.2,_1)` `.[&[data-state="previous"]]:panda-vis_visible`

**HTML structure:**

```html
<div data-slot="box" class="panda-h_full panda-inset_0 panda-op_0 panda-pos_absolute panda-trs_opacity_800ms_cubic-bezier(0.4,_0,_0.2,_1),_visibility_0s_linear_800ms panda-vis_hidden panda-w_full [&amp;[data-state=&quot;current&quot;]]:panda-op_1 [&amp;[data-state=&quot;current&quot;]]:panda-trs_opacity_800ms_cubic-bezier(0.4,_0,_0.2,_1) [&amp;[data-state=&quot;current&quot;]]:panda-vis_visible [&amp;[data-state=&quot;current&quot;]]:panda-z_relativeFront2 [&amp;[data-state=&quot;previous&quot;]]:panda-trs_opacity_800ms_cubic-bezier(0.4,_0,_0.2,_1) [&amp;[data-state=&quot;previous&quot;]]:pand
```

**Base styles (from design tokens):**

```css
.[&[data-state="current"]]:panda-op_1 {
  padding: 4px;
}```

### Panda C Text.Primary

**Instances found:** 5

**CSS classes:** `.panda-c_text.primary` `.panda-d_block` `.panda-lh_1.3` `.panda-textStyle_ui.actions.lg`

**HTML structure:**

```html
<span data-slot="span" class="panda-c_text.primary panda-d_block panda-lh_1.3 panda-textStyle_ui.actions.lg">Visual, interactive tutoring</span>
```

**Base styles (from design tokens):**

```css
.panda-c_text.primary {
  padding: 4px;
}```

### Div

**Instances found:** 4

**HTML structure:**

```html
<div data-slot="box" class=""><span data-slot="span" class="panda-c_text.primary panda-d_block panda-lh_1.3 panda-textStyle_ui.actions.lg">Help on demand</span></div>
```

**Base styles (from design tokens):**

```css
.div {
  padding: 4px;
}```

### Panda C Text.Primary

**Instances found:** 4

**CSS classes:** `.panda-c_text.primary` `.panda-textStyle_display.xl`

**HTML structure:**

```html
<h2 data-slot="heading" class="panda-c_text.primary panda-textStyle_display.xl md:panda-textStyle_display.2xl lg:panda-textStyle_display.3xl">Watch how Brilliant works</h2>
```

**Base styles (from design tokens):**

```css
.panda-c_text.primary {
  padding: 4px;
}```

### [&[Data Current]]:Panda Op 1

**Instances found:** 4

**CSS classes:** `.[&[data-current]]:panda-op_1` `.[&[data-current]]:panda-trs_opacity_450ms_ease_150ms` `.[&[data-current]]:panda-vis_visible` `.panda-d_flex` `.panda-flex-d_column` `.panda-gap_4`

**HTML structure:**

```html
<div data-slot="stack" class="panda-d_flex panda-flex-d_column panda-gap_4 panda-grid-area_1_/_1 panda-op_0 panda-trs_opacity_300ms_ease,_visibility_0s_linear_300ms panda-vis_hidden [&amp;[data-current]]:panda-op_1 [&amp;[data-current]]:panda-trs_opacity_450ms_ease_150ms [&amp;[data-current]]:panda-vis_visible reduceMotion:panda-trs_none" data-current="true"><p data-slot="p" class="panda-c_text.primary panda-textStyle_ui.actions.lg">Help when you need it</p><p data-slot="p" class="panda-c_text.secondary panda-fs_15px panda-ls_[-0.15px] panda-lh_1.6 panda-textStyle_body.base">When you’re stuck,
```

**Base styles (from design tokens):**

```css
.[&[data-current]]:panda-op_1 {
  padding: 4px;
}```

### Panda C Text.Primary

**Instances found:** 4

**CSS classes:** `.panda-c_text.primary` `.panda-textStyle_ui.actions.lg`

**HTML structure:**

```html
<p data-slot="p" class="panda-c_text.primary panda-textStyle_ui.actions.lg">Help when you need it</p>
```

**Base styles (from design tokens):**

```css
.panda-c_text.primary {
  padding: 4px;
}```

### Panda H Full

**Instances found:** 3

**CSS classes:** `.panda-h_full` `.panda-pos_relative` `.panda-w_full`

**HTML structure:**

```html
<div data-slot="box" class="panda-h_full panda-pos_relative panda-w_full"><video data-slot="video" class="panda-d_block panda-h_full panda-obj-f_cover panda-w_full" autoplay="" playsinline="" poster="/_next/static/media/visual-tutoring-v5.1j662sn5tur0o.jpg" preload="auto"><source src="/_next/static/media/visual-tutoring-v5.2z8h8qiqwav8s.webm" type="video/webm"><source src="/_next/static/media/visual-tutoring-v5.20ld4y0tz5fi5.mp4" type="video/mp4"></video></div>
```

**Base styles (from design tokens):**

```css
.panda-h_full {
  padding: 4px;
}```

### Panda D Block

**Instances found:** 3

**CSS classes:** `.panda-d_block` `.panda-h_full` `.panda-obj-f_cover` `.panda-w_full`

**HTML structure:**

```html
<video data-slot="video" class="panda-d_block panda-h_full panda-obj-f_cover panda-w_full" autoplay="" playsinline="" poster="/_next/static/media/visual-tutoring-v5.1j662sn5tur0o.jpg" preload="auto"><source src="/_next/static/media/visual-tutoring-v5.2z8h8qiqwav8s.webm" type="video/webm"><source src="/_next/static/media/visual-tutoring-v5.20ld4y0tz5fi5.mp4" type="video/mp4"></video>
```

**Base styles (from design tokens):**

```css
.panda-d_block {
  padding: 4px;
}```

### Panda Bg P Center

**Instances found:** 3

**CSS classes:** `.panda-bg-p_center` `.panda-bg-s_cover` `.panda-h_full` `.panda-w_full`

**HTML structure:**

```html
<div data-slot="box" class="panda-bg-p_center panda-bg-s_cover panda-h_full panda-w_full" aria-hidden="true" style="background-color:#eae1f1;background-image:url(/_next/static/media/skill-mastery-v3.1yxxzrh0uln-_.jpg)"></div>
```

**Base styles (from design tokens):**

```css
.panda-bg-p_center {
  padding: 4px;
}```

### [@Supports Not (Text Wrap: Pretty)]:Panda Tw Balance

**Instances found:** 3

**CSS classes:** `.[@supports_not_(text-wrap:_pretty)]:panda-tw_balance` `.panda-c_text.secondary` `.panda-ls_[-0.16px]` `.panda-max-w_720px` `.panda-mt_5` `.panda-textStyle_body.base`

**HTML structure:**

```html
<p data-slot="p" class="panda-tw_pretty [@supports_not_(text-wrap:_pretty)]:panda-tw_balance panda-c_text.secondary panda-ls_[-0.16px] panda-mt_5 panda-max-w_720px panda-textStyle_body.base">Learn with our tutor, Koji, on a shared interactive canvas. He sees where you’re getting stuck, then asks guiding questions, sketches on your screen, and gives hints to help you work through it.</p>
```

**Base styles (from design tokens):**

```css
.[@supports_not_(text-wrap:_pretty)]:panda-tw_balance {
  padding: 4px;
}```

### Panda Max W Calc(1176px + 2 * Token(Spacing.8))

**Instances found:** 3

**CSS classes:** `.panda-max-w_calc(1176px_+_2_*_token(spacing.8))` `.panda-mx_auto` `.panda-px_5` `.panda-w_full`

**HTML structure:**

```html
<div data-slot="box" class="panda-mx_auto panda-max-w_calc(1176px_+_2_*_token(spacing.8)) panda-px_5 md:panda-px_6 lg:panda-px_8 panda-w_full"><div class="panda-anim_panda-kf_dqSRBo_700ms_ease-out_var(--reveal-delay)_backwards_paused,_panda-kf_isxolt_1000ms_cubic-bezier(0.22,_1,_0.36,_1)_var(--reveal-delay)_backwards_paused [&amp;[data-revealed]]:panda-anim-ps_running reduceMotion:panda-anim_none [@media_(scripting:_none)]:panda-anim_none" data-reveal="" style="--reveal-delay:0ms"><div data-slot="vstack" class="panda-ai_center panda-d_flex panda-flex-d_column panda-ta_center"><h2 data-slot="he
```

**Base styles (from design tokens):**

```css
.panda-max-w_calc(1176px_+_2_*_token(spacing.8)) {
  padding: 4px;
}```

## Component Rules

- Match class names exactly from the patterns above
- Each component instance must be visually identical to others of its type
- Do not add extra wrappers or change the DOM structure
- Use `#ffcc9c` for all interactive/active states

## Interactions & States (INTERACTIONS.md)

# Interaction Reference

> Micro-interactions extracted from live DOM. Recreate these exactly for authentic feel.

## Coverage

| Component Type | Count | States Captured |
|----------------|-------|----------------|
| Button | 3 | default, hover, focus |
| Link | 3 | default, hover, focus |
| Input | 2 | default, focus |

## Transition System

These transition declarations were extracted from interactive elements:

```css
transition: all;
transition: background-color 0.2s, color 0.2s, opacity 0.2s;
```

Apply these to all interactive elements. Never invent new durations or easings.

## Button Interactions

### Button 1 — `Sign in`

**States:**

- Default: `../screens/states/button-1-default.png`
- Hover: `../screens/states/button-1-hover.png`
- Focus: `../screens/states/button-1-focus.png`

**On hover:**

```css
/* border-color: rgba(0, 0, 0, 0.1) → */ border-color: rgba(0, 0, 0, 0.3);
```

**On focus:**

```css
/* box-shadow: none → */ box-shadow: rgb(69, 109, 255) 0px 0px 0px 3px;
```

**Transition:** `all`

### Button 2 — `Pause`

**States:**

- Default: `../screens/states/button-2-default.png`
- Hover: `../screens/states/button-2-hover.png`
- Focus: `../screens/states/button-2-focus.png`

**On focus:**

```css
/* color: rgba(0, 0, 0, 0.3) → */ color: rgb(0, 0, 0);
/* border-color: rgba(0, 0, 0, 0.3) → */ border-color: rgb(0, 0, 0);
/* box-shadow: none → */ box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 0px 2px;
/* opacity: 0 → */ opacity: 1;
```

**Transition:** `background-color 0.2s, color 0.2s, opacity 0.2s`

### Button 3 — `I’m a learner`

**States:**

- Default: `../screens/states/button-3-default.png`
- Hover: `../screens/states/button-3-hover.png`
- Focus: `../screens/states/button-3-focus.png`

**On hover:**

```css
/* background-color: rgb(41, 204, 87) → */ background-color: rgb(21, 180, 65);
```

**On focus:**

```css
/* box-shadow: rgba(0, 0, 0, 0.05) 0px 4px 7px 0px → */ box-shadow: rgb(69, 109, 255) 0px 0px 0px 3px;
```

**Transition:** `all`

## Link Interactions

### Link 1 — `Brilliant home`

**States:**

- Default: `../screens/states/link-1-default.png`
- Hover: `../screens/states/link-1-hover.png`
- Focus: `../screens/states/link-1-focus.png`

**On focus:**

```css
/* outline: rgb(0, 0, 0) none 3px → */ outline: rgb(16, 16, 16) auto 1px;
/* outline-color: rgb(0, 0, 0) → */ outline-color: rgb(16, 16, 16);
```

**Transition:** `all`

### Link 2 — `kidSAFE COPPA Certified seal`

**States:**

- Default: `../screens/states/link-2-default.png`
- Hover: `../screens/states/link-2-hover.png`
- Focus: `../screens/states/link-2-focus.png`

**On focus:**

```css
/* outline: rgb(0, 0, 0) none 3px → */ outline: rgb(16, 16, 16) auto 1px;
/* outline-color: rgb(0, 0, 0) → */ outline-color: rgb(16, 16, 16);
```

**Transition:** `all`

### Link 3 — `www.kidsafe.com`

**States:**

- Default: `../screens/states/link-3-default.png`
- Hover: `../screens/states/link-3-hover.png`
- Focus: `../screens/states/link-3-focus.png`

**On focus:**

```css
/* outline: rgba(0, 0, 0, 0.6) none 3px → */ outline: rgb(16, 16, 16) auto 1px;
/* outline-color: rgba(0, 0, 0, 0.6) → */ outline-color: rgb(16, 16, 16);
```

**Transition:** `all`

## Input Interactions

### Input 1 — `radio`

**States:**

- Default: `../screens/states/input-1-default.png`
- Focus: `../screens/states/input-1-focus.png`

**Transition:** `all`

_No visible style changes detected for this element._

### Input 2 — `radio`

**States:**

- Default: `../screens/states/input-2-default.png`
- Focus: `../screens/states/input-2-focus.png`

**Transition:** `all`

_No visible style changes detected for this element._

## Interaction Rules

- Accent color `#ffcc9c` is used for focus rings, active states, and hover highlights
- Hover effects include **color transitions** — use the extracted values, not approximations
- Focus states use **outline** (not box-shadow) — always match the extracted focus ring
- Transition durations in use: `0.2s`
- Always respect `prefers-reduced-motion` — set all transitions to `0s` when enabled

## Design Tokens — JSON Files

### tokens/colors.json
```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "core": {
    "text-primary": {
      "value": "#000000",
      "role": "text-primary",
      "name": "panda-colors-black"
    },
    "background": {
      "value": "#ffffff",
      "role": "background",
      "name": "panda-colors-white"
    },
    "text-muted": {
      "value": "#999999",
      "role": "text-muted",
      "name": "panda-colors-gray-500"
    },
    "accent": {
      "value": "#ffcc9c",
      "role": "accent",
      "name": "panda-colors-orange-300"
    }
  },
  "status": {
    "danger": {
      "value": "#cc563d",
      "role": "danger",
      "name": "panda-colors-papaya-700"
    },
    "warning": {
      "value": "#fdf3d3",
      "role": "warning",
      "name": "panda-colors-yellow-200"
    },
    "success": {
      "value": "#29cc57",
      "role": "success",
      "name": "panda-colors-green-500"
    }
  },
  "extended": {
    "panda-colors-orange-700": {
      "value": "#ce6809",
      "role": "unknown",
      "name": "panda-colors-orange-700"
    },
    "panda-colors-red-300": {
      "value": "#ffb6b6",
      "role": "unknown",
      "name": "panda-colors-red-300"
    },
    "panda-colors-yellow-700": {
      "value": "#b78900",
      "role": "unknown",
      "name": "panda-colors-yellow-700"
    },
    "panda-colors-blue-300": {
      "value": "#abbdff",
      "role": "info",
      "name": "panda-colors-blue-300"
    },
    "panda-colors-purple-300": {
      "value": "#d3b8ff",
      "role": "unknown",
      "name": "panda-colors-purple-300"
    },
    "panda-colors-gray-950": {
      "value": "#141414",
      "role": "unknown",
      "name": "panda-colors-gray-950"
    },
    "panda-colors-gray-100": {
      "value": "#e7eef1",
      "role": "unknown",
      "name": "panda-colors-gray-100"
    },
    "panda-colors-gray-200": {
      "value": "#e4ecde",
      "role": "unknown",
      "name": "panda-colors-gray-200"
    },
    "panda-colors-red-200": {
      "value": "#ffdfdf",
      "role": "unknown",
      "name": "panda-colors-red-200"
    },
    "panda-colors-yellow-300": {
      "value": "#fce49d",
      "role": "unknown",
      "name": "panda-colors-yellow-300"
    },
    "panda-colors-pear-300": {
      "value": "#edf5a1",
      "role": "unknown",
      "name": "panda-colors-pear-300"
    },
    "panda-colors-teal-300": {
      "value": "#a0dcd5",
      "role": "unknown",
      "name": "panda-colors-teal-300"
    },
    "panda-colors-gray-400": {
      "value": "#b3b3b3",
      "role": "unknown",
      "name": "panda-colors-gray-400"
    }
  },
  "meta": {
    "theme": "light",
    "extracted": "2026-10-21"
  }
}
```

### tokens/spacing.json
```json
{
  "base": {
    "value": "4px",
    "description": "Grid unit — all spacing must be multiples of this"
  },
  "unit": "px",
  "scale": {
    "xs": {
      "value": "2px",
      "px": 2
    },
    "sm": {
      "value": "4px",
      "px": 4
    },
    "md": {
      "value": "6px",
      "px": 6
    },
    "lg": {
      "value": "8px",
      "px": 8
    },
    "xl": {
      "value": "10px",
      "px": 10
    },
    "2xl": {
      "value": "12px",
      "px": 12
    },
    "3xl": {
      "value": "14px",
      "px": 14
    },
    "4xl": {
      "value": "16px",
      "px": 16
    },
    "5xl": {
      "value": "18px",
      "px": 18
    },
    "6xl": {
      "value": "20px",
      "px": 20
    }
  },
  "multipliers": {
    "1x": {
      "value": "4px",
      "raw": 4
    },
    "2x": {
      "value": "8px",
      "raw": 8
    },
    "3x": {
      "value": "12px",
      "raw": 12
    },
    "4x": {
      "value": "16px",
      "raw": 16
    },
    "5x": {
      "value": "20px",
      "raw": 20
    },
    "6x": {
      "value": "24px",
      "raw": 24
    },
    "7x": {
      "value": "28px",
      "raw": 28
    },
    "8x": {
      "value": "32px",
      "raw": 32
    },
    "9x": {
      "value": "36px",
      "raw": 36
    },
    "10x": {
      "value": "40px",
      "raw": 40
    },
    "11x": {
      "value": "44px",
      "raw": 44
    },
    "12x": {
      "value": "48px",
      "raw": 48
    },
    "13x": {
      "value": "52px",
      "raw": 52
    },
    "14x": {
      "value": "56px",
      "raw": 56
    },
    "15x": {
      "value": "60px",
      "raw": 60
    },
    "16x": {
      "value": "64px",
      "raw": 64
    }
  },
  "meta": {
    "totalValues": 15,
    "min": 2,
    "max": 30
  }
}
```

### tokens/typography.json
```json
{
  "families": [
    "KaTeX_Caligraphic",
    "KaTeX_AMS",
    "Source Code Pro"
  ],
  "scale": {
    "heading-1": {
      "fontFamily": "KaTeX_Caligraphic",
      "fontSize": "96px",
      "fontWeight": "700",
      "lineHeight": null,
      "source": "css"
    },
    "heading-2": {
      "fontFamily": "KaTeX_Caligraphic",
      "fontSize": "76px",
      "fontWeight": "700",
      "lineHeight": null,
      "source": "css"
    },
    "heading-3": {
      "fontFamily": "KaTeX_Caligraphic",
      "fontSize": "74px",
      "fontWeight": "700",
      "lineHeight": null,
      "source": "css"
    },
    "body": {
      "fontFamily": "KaTeX_AMS",
      "fontSize": "20px",
      "fontWeight": "400",
      "lineHeight": null,
      "source": "css"
    },
    "caption": {
      "fontFamily": "KaTeX_AMS",
      "fontSize": "16px",
      "fontWeight": "400",
      "lineHeight": null,
      "source": "css"
    },
    "code": {
      "fontFamily": "Source Code Pro",
      "fontSize": "14px",
      "fontWeight": "400",
      "lineHeight": null,
      "source": "css"
    }
  },
  "fontFaces": [
    {
      "family": "KaTeX_AMS",
      "src": "https://brilliant.org/_next/static/media/KaTeX_AMS-Regular.25ieegmnh38ts.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "KaTeX_Caligraphic",
      "src": "https://brilliant.org/_next/static/media/KaTeX_Caligraphic-Bold.06b-ya9t43ioz.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "KaTeX_Caligraphic",
      "src": "https://brilliant.org/_next/static/media/KaTeX_Caligraphic-Regular.2eph4dlhid_m9.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "KaTeX_Fraktur",
      "src": "https://brilliant.org/_next/static/media/KaTeX_Fraktur-Bold.2sasz-d-jtw8y.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "KaTeX_Fraktur",
      "src": "https://brilliant.org/_next/static/media/KaTeX_Fraktur-Regular.2d10y4xmjvzlf.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "KaTeX_Main",
      "src": "https://brilliant.org/_next/static/media/KaTeX_Main-Bold.0n6oi11axpkvx.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "KaTeX_Main",
      "src": "https://brilliant.org/_next/static/media/KaTeX_Main-BoldItalic.14r2naom8mrec.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "KaTeX_Main",
      "src": "https://brilliant.org/_next/static/media/KaTeX_Main-Italic.0lig0v9j0700p.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "KaTeX_Main",
      "src": "https://brilliant.org/_next/static/media/KaTeX_Main-Regular.3tdhqncfyz6v_.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "KaTeX_Math",
      "src": "https://brilliant.org/_next/static/media/KaTeX_Math-BoldItalic.42kxjidd8c439.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "KaTeX_Math",
      "src": "https://brilliant.org/_next/static/media/KaTeX_Math-Italic.01p18qqkhiku9.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "KaTeX_SansSerif",
      "src": "https://brilliant.org/_next/static/media/KaTeX_SansSerif-Bold.0h3wi2z_eouyg.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "KaTeX_SansSerif",
      "src": "https://brilliant.org/_next/static/media/KaTeX_SansSerif-Italic.0wkjc4dm2kcit.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "KaTeX_SansSerif",
      "src": "https://brilliant.org/_next/static/media/KaTeX_SansSerif-Regular.2peiewu59z3d-.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "KaTeX_Script",
      "src": "https://brilliant.org/_next/static/media/KaTeX_Script-Regular.11h14300o9pd0.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "KaTeX_Size1",
      "src": "https://brilliant.org/_next/static/media/KaTeX_Size1-Regular.03lhvx36ekcou.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "KaTeX_Size2",
      "src": "https://brilliant.org/_next/static/media/KaTeX_Size2-Regular.14s5gg-puz6h-.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "KaTeX_Size3",
      "src": "https://brilliant.org/_next/static/media/KaTeX_Size3-Regular.1n1rgzz84z8r9.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "KaTeX_Size4",
      "src": "https://brilliant.org/_next/static/media/KaTeX_Size4-Regular.2sgotkdv3dcyv.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "KaTeX_Typewriter",
      "src": "https://brilliant.org/_next/static/media/KaTeX_Typewriter-Regular.11gr2d2wuwz77.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "CoFo Brilliant",
      "src": "https://brilliant.org/_next/static/media/cofo-brilliant-regular.0x-1wd4a7iit8.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "CoFo Brilliant",
      "src": "https://brilliant.org/_next/static/media/cofo-brilliant-bold.00peqb48xfqwb.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "CoFo Brilliant",
      "src": "https://brilliant.org/_next/static/media/cofo-brilliant-italic.01uthtfhv3qu6.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "CoFo Brilliant",
      "src": "https://brilliant.org/_next/static/media/cofo-brilliant-bold-italic.3orrcir-ph8bn.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "CoFo Brilliant",
      "src": "https://brilliant.org/_next/static/media/cofo-brilliant-medium.1vop2d5y_jpw2.woff2",
      "format": "woff2",
      "weight": "500"
    },
    {
      "family": "CoFo Brilliant",
      "src": "https://brilliant.org/_next/static/media/cofo-brilliant-medium-italic.30ni91w93hr35.woff2",
      "format": "woff2",
      "weight": "500"
    },
    {
      "family": "CoFo Robert",
      "src": "https://brilliant.org/_next/static/media/cofo-robert-medium.3krozkcg6qt-u.woff2",
      "format": "woff2",
      "weight": "500"
    },
    {
      "family": "CoFo Robert",
      "src": "https://brilliant.org/_next/static/media/cofo-robert-medium-italic.2b_znar3654ya.woff2",
      "format": "woff2",
      "weight": "500"
    },
    {
      "family": "Source Code Pro",
      "src": "https://brilliant.org/_next/static/media/source-code-pro-regular.1nc1izk0q8l8t.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Source Code Pro",
      "src": "https://brilliant.org/_next/static/media/source-code-pro-medium.0k2a2_pd11ndo.woff2",
      "format": "woff2",
      "weight": "500"
    },
    {
      "family": "Source Code Pro",
      "src": "https://brilliant.org/_next/static/media/source-code-pro-bold.05unrvrd219vv.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "Source Code Pro",
      "src": "https://brilliant.org/_next/static/media/source-code-pro-italic.2uutxim5qrm63.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Source Code Pro",
      "src": "https://brilliant.org/_next/static/media/source-code-pro-mediumitalic.15pt67uudl65v.woff2",
      "format": "woff2",
      "weight": "500"
    },
    {
      "family": "Source Code Pro",
      "src": "https://brilliant.org/_next/static/media/source-code-pro-bolditalic.447_bjs8ef4vm.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "Soleil",
      "src": "https://brilliant.org/_next/static/media/soleil-regular-webfont.24o-c-ixr_l-p.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Soleil",
      "src": "https://brilliant.org/_next/static/media/soleil-bold-webfont.1l9tu7y5buvzg.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "Soleil",
      "src": "https://brilliant.org/_next/static/media/soleil-semibold-webfont.3wa1wtzfcmcus.woff2",
      "format": "woff2",
      "weight": "600"
    },
    {
      "family": "Soleil",
      "src": "https://brilliant.org/_next/static/media/soleil-italic-webfont.00ef2mv5_w_9u.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "CoFo Semi Mono",
      "src": "https://brilliant.org/_next/static/media/cofo-semi-mono-regular.3v9k946ik-em8.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "CoFo Semi Mono",
      "src": "https://brilliant.org/_next/static/media/cofo-semi-mono-medium.1iddyc_5734lg.woff2",
      "format": "woff2",
      "weight": "500"
    },
    {
      "family": "CoFo Semi Mono",
      "src": "https://brilliant.org/_next/static/media/cofo-semi-mono-bold.1qe0sfg4gp6lt.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "coFoRobertFont",
      "src": "https://brilliant.org/_next/static/media/cofo_robert_medium-s.p.3krozkcg6qt-u.woff2",
      "format": "woff2",
      "weight": "500"
    },
    {
      "family": "coFoRobertFont",
      "src": "https://brilliant.org/_next/static/media/cofo_robert_medium_italic-s.p.2b_znar3654ya.woff2",
      "format": "woff2",
      "weight": "500"
    },
    {
      "family": "sourceCodeProFont",
      "src": "https://brilliant.org/_next/static/media/source_code_pro_regular.p.1nc1izk0q8l8t.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "sourceCodeProFont",
      "src": "https://brilliant.org/_next/static/media/source_code_pro_medium.p.0k2a2_pd11ndo.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "sourceCodeProFont",
      "src": "https://brilliant.org/_next/static/media/source_code_pro_bold.p.05unrvrd219vv.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "sourceCodeProFont",
      "src": "https://brilliant.org/_next/static/media/source_code_pro_italic.p.2uutxim5qrm63.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "sourceCodeProFont",
      "src": "https://brilliant.org/_next/static/media/source_code_pro_mediumitalic.p.15pt67uudl65v.woff2",
      "format": "woff2",
      "weight": "500"
    },
    {
      "family": "sourceCodeProFont",
      "src": "https://brilliant.org/_next/static/media/source_code_pro_bolditalic.p.447_bjs8ef4vm.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "coFoBrilliantFont",
      "src": "https://brilliant.org/_next/static/media/cofo_brilliant_regular-s.p.0x-1wd4a7iit8.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "coFoBrilliantFont",
      "src": "https://brilliant.org/_next/static/media/cofo_brilliant_bold-s.p.00peqb48xfqwb.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "coFoBrilliantFont",
      "src": "https://brilliant.org/_next/static/media/cofo_brilliant_italic-s.p.01uthtfhv3qu6.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "coFoBrilliantFont",
      "src": "https://brilliant.org/_next/static/media/cofo_brilliant_bold_italic-s.p.3orrcir-ph8bn.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "coFoBrilliantFont",
      "src": "https://brilliant.org/_next/static/media/cofo_brilliant_medium-s.p.1vop2d5y_jpw2.woff2",
      "format": "woff2",
      "weight": "500"
    },
    {
      "family": "coFoBrilliantFont",
      "src": "https://brilliant.org/_next/static/media/cofo_brilliant_medium_italic-s.p.30ni91w93hr35.woff2",
      "format": "woff2",
      "weight": "500"
    },
    {
      "family": "swiper-icons",
      "src": "data:application/font-woff;charset=utf-8;base64, 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",
      "format": "truetype",
      "weight": "400"
    },
    {
      "family": "coFoBrilliantFont",
      "src": "https://brilliant.org/educators/_next/static/media/41e280766329a0cc-s.p.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "coFoBrilliantFont",
      "src": "https://brilliant.org/educators/_next/static/media/53112b13ab129fdd-s.p.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "coFoBrilliantFont",
      "src": "https://brilliant.org/educators/_next/static/media/189b71049a3838fb-s.p.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "coFoBrilliantFont",
      "src": "https://brilliant.org/educators/_next/static/media/5cb2bc2ee4299d9c-s.p.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "coFoBrilliantFont",
      "src": "https://brilliant.org/educators/_next/static/media/9c65703b9855ebf3-s.p.woff2",
      "format": "woff2",
      "weight": "500"
    },
    {
      "family": "coFoBrilliantFont",
      "src": "https://brilliant.org/educators/_next/static/media/8e674f1a01a45790-s.p.woff2",
      "format": "woff2",
      "weight": "500"
    },
    {
      "family": "coFoRobertFont",
      "src": "https://brilliant.org/educators/_next/static/media/7fa4d975ef3c9645-s.p.woff2",
      "format": "woff2",
      "weight": "500"
    },
    {
      "family": "coFoRobertFont",
      "src": "https://brilliant.org/educators/_next/static/media/5bf60685b58e6558-s.p.woff2",
      "format": "woff2",
      "weight": "500"
    },
    {
      "family": "KaTeX_AMS",
      "src": "https://brilliant.org/educators/_next/static/media/KaTeX_AMS-Regular.a79f1c31.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "KaTeX_Caligraphic",
      "src": "https://brilliant.org/educators/_next/static/media/KaTeX_Caligraphic-Bold.ec17d132.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "KaTeX_Caligraphic",
      "src": "https://brilliant.org/educators/_next/static/media/KaTeX_Caligraphic-Regular.55fac258.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "KaTeX_Fraktur",
      "src": "https://brilliant.org/educators/_next/static/media/KaTeX_Fraktur-Bold.d42a5579.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "KaTeX_Fraktur",
      "src": "https://brilliant.org/educators/_next/static/media/KaTeX_Fraktur-Regular.d3c882a6.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "KaTeX_Main",
      "src": "https://brilliant.org/educators/_next/static/media/KaTeX_Main-Bold.dd55baff.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "KaTeX_Main",
      "src": "https://brilliant.org/educators/_next/static/media/KaTeX_Main-BoldItalic.6f2bb1df.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "KaTeX_Main",
      "src": "https://brilliant.org/educators/_next/static/media/KaTeX_Main-Italic.8916142b.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "KaTeX_Main",
      "src": "https://brilliant.org/educators/_next/static/media/KaTeX_Main-Regular.b1140fae.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "KaTeX_Math",
      "src": "https://brilliant.org/educators/_next/static/media/KaTeX_Math-BoldItalic.869745bb.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "KaTeX_Math",
      "src": "https://brilliant.org/educators/_next/static/media/KaTeX_Math-Italic.9c583ce7.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "KaTeX_SansSerif",
      "src": "https://brilliant.org/educators/_next/static/media/KaTeX_SansSerif-Bold.8c5b5494.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "KaTeX_SansSerif",
      "src": "https://brilliant.org/educators/_next/static/media/KaTeX_SansSerif-Italic.3b1e59b3.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "KaTeX_SansSerif",
      "src": "https://brilliant.org/educators/_next/static/media/KaTeX_SansSerif-Regular.ba21ed5f.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "KaTeX_Script",
      "src": "https://brilliant.org/educators/_next/static/media/KaTeX_Script-Regular.03e9641d.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "KaTeX_Size1",
      "src": "https://brilliant.org/educators/_next/static/media/KaTeX_Size1-Regular.eae34984.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "KaTeX_Size2",
      "src": "https://brilliant.org/educators/_next/static/media/KaTeX_Size2-Regular.5916a24f.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "KaTeX_Size3",
      "src": "https://brilliant.org/educators/_next/static/media/KaTeX_Size3-Regular.b4230e7e.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "KaTeX_Size4",
      "src": "https://brilliant.org/educators/_next/static/media/KaTeX_Size4-Regular.10d95fd3.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "KaTeX_Typewriter",
      "src": "https://brilliant.org/educators/_next/static/media/KaTeX_Typewriter-Regular.a8709e36.woff2",
      "format": "woff2",
      "weight": "400"
    }
  ],
  "rules": {
    "maxSizesPerScreen": 4,
    "headingWeightRange": "600-700",
    "bodyWeight": 400,
    "lineHeightBody": 1.5,
    "lineHeightHeading": 1.2
  }
}
```

## Bundled Fonts (fonts/)

The following font files are bundled in the `fonts/` directory:

- `fonts/CoFoBrilliant-500.woff2`
- `fonts/CoFoBrilliant-700.woff2`
- `fonts/CoFoBrilliant-Regular.woff2`
- `fonts/coFoBrilliantFont-500.woff2`
- `fonts/coFoBrilliantFont-700.woff2`
- `fonts/coFoBrilliantFont-Regular.woff2`
- `fonts/CoFoRobert-500.woff2`
- `fonts/coFoRobertFont-500.woff2`
- `fonts/CoFoSemiMono-500.woff2`
- `fonts/CoFoSemiMono-700.woff2`
- `fonts/CoFoSemiMono-Regular.woff2`
- `fonts/KaTeX_AMS-Regular.woff2`
- `fonts/KaTeX_Caligraphic-700.woff2`
- `fonts/KaTeX_Caligraphic-Regular.woff2`
- `fonts/KaTeX_Fraktur-700.woff2`
- `fonts/KaTeX_Fraktur-Regular.woff2`
- `fonts/KaTeX_Main-700.woff2`
- `fonts/KaTeX_Main-Regular.woff2`
- `fonts/KaTeX_Math-700.woff2`
- `fonts/KaTeX_Math-Regular.woff2`
- `fonts/KaTeX_SansSerif-700.woff2`
- `fonts/KaTeX_SansSerif-Regular.woff2`
- `fonts/KaTeX_Script-Regular.woff2`
- `fonts/KaTeX_Size1-Regular.woff2`
- `fonts/KaTeX_Size2-Regular.woff2`
- `fonts/KaTeX_Size3-Regular.woff2`
- `fonts/KaTeX_Size4-Regular.woff2`
- `fonts/KaTeX_Typewriter-Regular.woff2`
- `fonts/Soleil-600.woff2`
- `fonts/Soleil-700.woff2`
- `fonts/Soleil-Regular.woff2`
- `fonts/SourceCodePro-Black.ttf`
- `fonts/SourceCodePro-Bold.ttf`
- `fonts/SourceCodePro-ExtraBold.ttf`
- `fonts/SourceCodePro-ExtraLight.ttf`
- `fonts/SourceCodePro-Light.ttf`
- `fonts/SourceCodePro-Medium.ttf`
- `fonts/SourceCodePro-Regular.ttf`
- `fonts/SourceCodePro-SemiBold.ttf`
- `fonts/sourceCodeProFont-500.woff2`
- `fonts/sourceCodeProFont-700.woff2`
- `fonts/sourceCodeProFont-Regular.woff2`

Use these local font files in `@font-face` declarations instead of fetching from Google Fonts.

## Screenshots Inventory (screens/)

> Study all screenshots carefully before implementing any UI. Match every visual detail exactly.

### Scroll Journey (screens/scroll/)

*Cinematic scroll states — page visual at each scroll depth*

![scroll-000.png](screens/scroll/scroll-000.png)

![scroll-017.png](screens/scroll/scroll-017.png)

![scroll-033.png](screens/scroll/scroll-033.png)

![scroll-050.png](screens/scroll/scroll-050.png)

![scroll-067.png](screens/scroll/scroll-067.png)

![scroll-083.png](screens/scroll/scroll-083.png)

![scroll-100.png](screens/scroll/scroll-100.png)

![video-1-frame.png](screens/scroll/video-1-frame.png)

### Full Page Screenshots (screens/pages/)

*Full-page screenshots of each crawled URL*

![coding-skills.png](screens/pages/coding-skills.png)

![courses.png](screens/pages/courses.png)

![educators.png](screens/pages/educators.png)

![home.png](screens/pages/home.png)

![subscribe.png](screens/pages/subscribe.png)

### Section Clips (screens/sections/)

*Clipped individual sections and components*

![educators-section-1.png](screens/sections/educators-section-1.png)

![educators-section-2.png](screens/sections/educators-section-2.png)

![home-section-1.png](screens/sections/home-section-1.png)

![home-section-2.png](screens/sections/home-section-2.png)

![home-section-9.png](screens/sections/home-section-9.png)

### Interaction States (screens/states/)

*Hover, focus, and active state captures*

![button-1-default.png](screens/states/button-1-default.png)

![button-1-focus.png](screens/states/button-1-focus.png)

![button-1-hover.png](screens/states/button-1-hover.png)

![button-2-default.png](screens/states/button-2-default.png)

![button-2-focus.png](screens/states/button-2-focus.png)

![button-2-hover.png](screens/states/button-2-hover.png)

![button-3-default.png](screens/states/button-3-default.png)

![button-3-focus.png](screens/states/button-3-focus.png)

![button-3-hover.png](screens/states/button-3-hover.png)

![input-1-default.png](screens/states/input-1-default.png)

![input-1-focus.png](screens/states/input-1-focus.png)

![input-2-default.png](screens/states/input-2-default.png)

![input-2-focus.png](screens/states/input-2-focus.png)

![link-1-default.png](screens/states/link-1-default.png)

![link-1-focus.png](screens/states/link-1-focus.png)

![link-1-hover.png](screens/states/link-1-hover.png)

![link-2-default.png](screens/states/link-2-default.png)

![link-2-focus.png](screens/states/link-2-focus.png)

![link-2-hover.png](screens/states/link-2-hover.png)

![link-3-default.png](screens/states/link-3-default.png)

![link-3-focus.png](screens/states/link-3-focus.png)

![link-3-hover.png](screens/states/link-3-hover.png)

### Screenshot Index (screens/INDEX.md)

# Screenshot Index

## Scroll Journey

> Shows the cinematic state at each point of the page

| Scroll | Y Position | File |
|--------|-----------|------|
| 0% | 0px | `screens/scroll/scroll-000.png` |
| 17% | 1280px | `screens/scroll/scroll-017.png` |
| 33% | 2485px | `screens/scroll/scroll-033.png` |
| 50% | 3766px | `screens/scroll/scroll-050.png` |
| 67% | 5046px | `screens/scroll/scroll-067.png` |
| 83% | 6251px | `screens/scroll/scroll-083.png` |
| 100% | 7531px | `screens/scroll/scroll-100.png` |

## Video First Frames

- Video 1 (content): `screens/scroll/video-1-frame.png`

## Pages

| Page | URL | File |
|------|-----|------|
| Brilliant | Your Personal Tutor for Math and Coding | `https://brilliant.org` | `screens/pages/home.png` |
| Coding Skills That Matter in the Age of AI | Brilliant | `https://brilliant.org/coding-skills/` | `screens/pages/coding-skills.png` |
| Brilliant for Educators | `https://brilliant.org/educators/?from=brilliant` | `screens/pages/educators.png` |
| Topics | Brilliant | Your Personal Tutor for Math & Coding | `https://brilliant.org/courses/` | `screens/pages/courses.png` |
| Brilliant Premium | Learn Without Limits | `https://brilliant.org/subscribe/` | `screens/pages/subscribe.png` |

## Sections

| Page | Section | File |
|------|---------|------|
| home | #1 (section) | `screens/sections/home-section-1.png` |
| home | #2 (section) | `screens/sections/home-section-2.png` |
| home | #9 ([class*="section"]) | `screens/sections/home-section-9.png` |
| educators | #1 (section) | `screens/sections/educators-section-1.png` |
| educators | #2 (section) | `screens/sections/educators-section-2.png` |

## Homepage Screenshots (screenshots/)

![homepage.png](screenshots/homepage.png)

