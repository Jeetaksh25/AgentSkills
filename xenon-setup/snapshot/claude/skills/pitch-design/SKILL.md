---
name: pitch-design
description: Design system skill for pitch. Activate when building UI components, pages, or any visual elements. Provides exact color tokens, typography scale, spacing grid, component patterns, and craft rules. Read references/DESIGN.md before writing any CSS or JSX. Includes ultra-mode visual journey: read references/ANIMATIONS.md, references/LAYOUT.md, references/COMPONENTS.md, and references/INTERACTIONS.md for full motion and layout details.
---

# pitch Design System

You are building UI for **pitch**. Light-themed, cool palette, monospace typography (Eina 03 Regular), compact density on a 4px grid, expressive motion.

## Visual Reference

**IMPORTANT**: Study ALL screenshots below before writing any UI. Match colors, typography, spacing, layout, and motion exactly as shown.

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

### Animation Stack Detected

- **Web Animations API (14 active)** — animation

## Design Philosophy

- **Layered depth** — use shadow tokens to create a sense of physical layering. Each elevation level has a specific shadow.
- **Gradient accents** — gradients are used thoughtfully for emphasis, not decoration.
- **Single typeface** — Eina 03 Regular carries all text. Hierarchy comes from size, weight, and color — never font mixing.
- **compact density** — 4px base grid. Every dimension is a multiple of 4.
- **cool palette** — the color temperature runs cool, matching the monospace typography.
- **Restrained accent** — `#0000ee` is the only pop of color. Used exclusively for CTAs, links, focus rings, and active states.
- **Expressive motion** — animations are an integral part of the experience. Use spring physics and layout animations.

## Color System

### Core Palette

| Role | Token | Hex | Use |
|------|-------|-----|-----|
| Background | `--background` | `#ffffff` | Page/app background |
| Surface | `--surface` | `#f6f6f6` | Cards, panels, modals |
| Text Primary | `--text-primary` | `#0c021c` | Headings, body text |
| Text Muted | `--text-muted` | `#666666` | Captions, placeholders |
| Accent | `--accent` | `#0000ee` | CTAs, links, focus rings |
| Border | `--border` | `#363636` | Dividers, card borders |

### Extended Palette

- **framer-text-color:** `#000000` — Deep background layer or shadow color
- **framer-link-text-color:** `#0099ff`
- `#5318eb`
- `#270f61`
- `#c6a5ff`
- `#ebe3fe` — Light surface or highlight color
- **rest-color:** `#2a2c37`
- `#c4ee87`

### CSS Variable Tokens

```css
--framer-text-background-color: initial;
--framer-text-background-radius: initial;
--framer-text-background-corner-shape: initial;
--framer-text-background-padding: initial;
--framer-text-background-padding: 0px;
--framer-text-background-color: initial;
--framer-text-background-radius: initial;
--framer-text-background-corner-shape: initial;
--framer-text-background-padding: initial;
--framer-text-background-padding: 0px;
--framer-text-background-color: initial;
--framer-text-background-radius: initial;
--framer-text-background-corner-shape: initial;
--framer-text-background-padding: initial;
--framer-text-background-padding: 0px;
--framer-text-background-color: initial;
--framer-text-background-radius: initial;
--framer-text-background-corner-shape: initial;
--framer-text-background-padding: initial;
--border-bottom-width: 1px;
```

## Typography

### Font Stack

- **Eina 03 Regular** — Heading 1, Heading 2, Heading 3
- **Space Mono** — Body, Caption, Code

### Font Sources

```css
@font-face {
  font-family: "Space Mono";
  src: url("fonts/SpaceMono-Bold.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "Space Mono";
  src: url("fonts/SpaceMono-Regular.ttf") format("truetype");
  font-weight: 400;
}
@font-face {
  font-family: "Eina 03 Regular";
  src: url("fonts/Eina03Regular-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Mark Pro Bold";
  src: url("fonts/MarkProBold-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "Inter";
  src: url("fonts/Inter-Bold.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "Inter";
  src: url("fonts/Inter-Regular.ttf") format("truetype");
  font-weight: 400;
}
@font-face {
  font-family: "Eina 03 Bold";
  src: url("fonts/Eina03Bold-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "Mark Pro Regular";
  src: url("fonts/MarkProRegular-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Eina01-Bold ☞";
  src: url("fonts/Eina01-Bold☞-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Pitch-Lato-UI";
  src: url("fonts/Pitch-Lato-UI-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Pitch-Lato-UI";
  src: url("fonts/Pitch-Lato-UI-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "Mark Pro";
  src: url("fonts/MarkPro-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "Eina01";
  src: url("fonts/Eina01-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "swiper-icons";
  src: url("data:application/font-woff;charset=utf-8;base64, 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") format("woff");
  font-weight: 400;
}
```

### Type Scale

| Role | Family | Size | Weight |
|------|--------|------|--------|
| Heading 1 | Eina 03 Regular | 120px | 700 |
| Heading 2 | Eina 03 Regular | 90px | 700 |
| Heading 3 | Eina 03 Regular | 80px | 700 |
| Body | Space Mono | 14px | 400 |
| Caption | Space Mono | 12px | 400 |
| Code | Space Mono | 14px | 400 |

### Typography Rules

- All text uses **Eina 03 Regular** — never add another font family
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

Scale: `inherit, .375rem, .5625rem, .6em, 1px, 1.5px, 2px, 2em, 2.5px, 3px, 4px, 4.5px, 5px, 5px 0px 0px, 6px, 7px, 8px, 9px, 10px, 11px, 12px, 14px, 15px, 16px, 16px 16px 0px 0px, 18px, 20px, 24px, 25px, 30px, 32px, 34px, 36px, 40px, 46px, 48px, 50px, 60px, 70px, 72px, 80%, 100px, 100%, 999px, unset`
Default: `15px`

### Container

Max-width: `66em`, centered with auto margins.

### Breakpoints

| Name | Value |
|------|-------|
| xs | 22em |
| xs | 23.4em |
| sm | 40em |
| md | 48em |
| lg | 60em |
| xl | 66em |
| xl | 66.0625em |
| xl | 75em |
| xl | 80em |
| 2xl | 90em |
| xs | 320px |
| xs | 375px |
| sm | 550px |
| sm | 599px |
| sm | 600px |
| sm | 608px |
| sm | 629px |
| sm | 630px |
| sm | 640px |
| md | 675px |
| md | 710px |
| md | 730px |
| md | 744px |
| md | 749px |
| md | 750px |
| md | 768px |
| lg | 800px |
| lg | 809px |
| lg | 809.98px |
| lg | 810px |
| lg | 836px |
| lg | 849px |
| lg | 900px |
| lg | 918px |
| lg | 960px |
| lg | 1000px |
| lg | 1024px |
| xl | 1038px |
| xl | 1049px |
| xl | 1050px |
| xl | 1086px |
| xl | 1120px |
| xl | 1199px |
| xl | 1199.98px |
| xl | 1200px |
| xl | 1280px |
| 2xl | 1366px |
| 2xl | 1600px |
| 2xl | 1800px |
| 2xl | 2000px |

Mobile-first: design for small screens, layer on responsive overrides.

## Component Patterns

### Card

```css
.card {
  background: #f6f6f6;
  border: 1px solid #363636;
  border-radius: 15px;
  padding: 16px;
  box-shadow: 0 1px 3px 0 rgba(103,110,144,0.1);
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
  background: #0000ee;
  color: #0c021c;
  border-radius: 15px;
  padding: 8px 16px;
  font-weight: 500;
  transition: opacity 150ms ease;
}
.btn-primary:hover { opacity: 0.9; }

/* Ghost */
.btn-ghost {
  background: transparent;
  border: 1px solid #363636;
  color: #0c021c;
  border-radius: 15px;
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
  border: 1px solid #363636;
  border-radius: 15px;
  padding: 8px 12px;
  color: #0c021c;
  font-size: 14px;
}
.input:focus { border-color: #0000ee; outline: none; }
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
  background: #f6f6f6;
  color: #666666;
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
  background: #f6f6f6;
  border: 1px solid #363636;
  border-radius: unset;
  padding: 24px;
  max-width: 480px;
  width: 90vw;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
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
  color: #666666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #363636;
}
.table td {
  padding: 12px;
  border-bottom: 1px solid #363636;
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
  border-bottom: 1px solid #363636;
}
.nav-link {
  color: #666666;
  padding: 8px 12px;
  border-radius: 15px;
  transition: color 150ms;
}
.nav-link:hover { color: #0c021c; }
.nav-link.active { color: #0000ee; }
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

**Footer** (`html`)

## Page Structure

The following page sections were detected:

- **Navigation** — Top navigation bar (8 items)
- **Hero** — Hero section (detected from heading structure)
- **Faq** — FAQ/accordion section
- **Footer** — Page footer with links and info (58 items)

When building pages, follow this section order and structure.

## Animation & Motion

This project uses **expressive motion**. Animations are part of the design language.

### CSS Animations

- `fadein`
- `fadeout`
- `dropin`
- `dropin-reverse`
- `dropin-small`

### Motion Tokens

- **Duration scale:** `0ms`, `.07s`, `.2s`, `2s`, `50ms`, `75ms`, `80ms`, `90ms`, `100ms`, `110ms`, `120ms`, `125ms`, `140ms`, `150ms`, `160ms`, `200ms`, `225ms`, `235ms`, `250ms`, `280ms`, `300ms`, `380ms`, `400ms`, `430ms`, `500ms`, `800ms`, `1000ms`, `1600ms`
- **Easing functions:** `ease-in`, `cubic-bezier(.6,.2,.2,1)`, `ease-out`, `cubic-bezier(.24,.05,.2,1)`, `cubic-bezier(.4,0,1,1)`, `cubic-bezier(0,0,.2,1)`, `cubic-bezier(.4,0,.2,1)`, `ease`, `ease-in-out`, `linear`, `cubic-bezier(.1,.09,.17,1.01)`, `cubic-bezier(.4,.1,.6,.98)`, `cubic-bezier(.2,0,0,1)`, `cubic-bezier(.5,0,.15,1)`, `cubic-bezier(.85,0,.5,1)`
- **Animated properties:** `opacity`

### Motion Guidelines

- **Duration:** Use values from the duration scale above. Short (0ms) for micro-interactions, long (1600ms) for page transitions
- **Easing:** Use `ease-in` as the default easing curve
- **Direction:** Elements enter from bottom/right, exit to top/left
- **Reduced motion:** Always respect `prefers-reduced-motion` — disable animations when set

## Dark Mode

This project supports **light and dark mode** via CSS variables.

### Token Mapping

| Variable | Light | Dark |
|----------|-------|------|
| `--modal-title-bg` | `var(--white)` | `#2a2c37` |
| `--modal-body-bg` | `var(--white)` | `#2a2c37` |
| `--modal-footer-bg` | `var(--white)` | `#2a2c37` |
| `--modal-body-text-color` | `var(--grey7)` | `#fff` |
| `--modal-close-icon-fill-color` | `var(--grey4)` | `#8f92a3` |
| `--modal-close-icon-fill-color--hover` | `var(--grey6)` | `#d7d8e0` |

### Implementation

- Toggle via `.dark` class on `<html>` or `[data-theme="dark"]`
- Always use CSS variables for colors — never hardcode hex values
- Test both modes for contrast and readability

## Depth & Elevation

### Shadow Tokens

- Subtle: `0 0 0 1px var(--input-border-color--focus)`
- Subtle: `0 0 0 2px rgba(var(--error-rgb),.5)`
- Subtle: `inset 0 0 0 2px rgba(var(--action-rgb),.5)`
- Subtle: `0 0 0 2px rgba(var(--action-rgb),.5)`
- Subtle: `inset 0 0 0 1px rgba(0,0,0,0.1)`
- Subtle: `inset 0 0 0 calc(1/var(--scale-x,1)*1px) var(--deal-room-mixed-highlight-shadow)`

### Z-Index Scale

`0, 1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 20, 22, 25, 50, 98, 99, 100, 101, 102, 103, 104, 105, 110, 150, 199, 499, 500, 501, 502, 999, 1000, 1001, 1003, 1059, 1060, 5000, 6000, 6001, 9990, 9991, 9997, 9998, 9999, 10000, 99999, 100000, 999999, 99999991, 99999999, 999999999`

Use these exact values — never invent z-index values.

## Anti-Patterns (Never Do)

- **No blur effects** — no backdrop-blur, no filter: blur()
- **No zebra striping** — tables and lists use borders for separation
- **No invented colors** — every hex value must come from the palette above
- **No arbitrary spacing** — every dimension is a multiple of 4px
- **No extra fonts** — only Eina 03 Regular and Space Mono are allowed
- **No arbitrary border-radius** — use the scale: .375rem, .5625rem, .6em, 1px, 1.5px, 2px, 2em, 2.5px, 3px, 4px
- **No opacity for disabled states** — use muted colors instead

## Workflow

1. **Read** `references/DESIGN.md` before writing any UI code
2. **Pick colors** from the Color System section — never invent new ones
3. **Set typography** — Eina 03 Regular, Space Mono only, using the type scale
4. **Build layout** on the 4px grid — check every margin, padding, gap
5. **Match components** to patterns above before creating new ones
6. **Apply elevation** — use shadow tokens
7. **Validate** — every value traces back to a design token. No magic numbers.

## Brand Spec

- **Favicon:** `https://framerusercontent.com/images/ZDXuG5VMV3iJ6FfqEQHgtZkhnM.png`
- **Site URL:** `https://pitch.com`
- **Brand color:** `#0000ee`
- **Brand typeface:** Eina 03 Regular

## Quick Reference

```
Background:     #ffffff
Surface:        #f6f6f6
Text:           #0c021c / #666666
Accent:         #0000ee
Border:         #363636
Font:           Eina 03 Regular
Spacing:        4px grid
Radius:         15px
Components:     7 detected
```

## When to Trigger

Activate this skill when:
- Creating new components, pages, or visual elements for pitch
- Writing CSS, Tailwind classes, styled-components, or inline styles
- Building page layouts, templates, or responsive designs
- Reviewing UI code for design consistency
- The user mentions "pitch" design, style, UI, or theme
- Generating mockups, wireframes, or visual prototypes

---

# Full Reference Files

> Every output file is embedded below. Claude has full design system context from /skills alone.

## Design System Tokens (DESIGN.md)

# pitch DESIGN.md

> Auto-generated design system — reverse-engineered via static analysis by skillui.
> Frameworks: None detected
> Colors: 20 · Fonts: 2 · Components: 7
> Icon library: not detected · State: not detected
> Primary theme: light · Dark mode toggle: yes · Motion: expressive

---

## 1. Visual Theme & Atmosphere

This is a **light-themed** interface with a cool, approachable feel. The light background emphasizes content clarity. Typography uses **Eina 03 Regular** throughout — a technical, developer-focused choice that maintains consistency. Spacing follows a **4px base grid** (compact density), with scale: 2, 4, 6, 8, 10, 12, 14, 16px. The palette is predominantly monochromatic with **#0000ee** as the single accent color — used sparingly for interactive elements and emphasis. Motion is expressive — spring physics, layout animations, and staggered reveals are part of the visual language.

---

## 2. Color Palette & Roles

| Token | Hex | Role | Use |
|---|---|---|---|
| framer-link-text-color | `#ffffff` | background | Page background, darkest surface |
| color-background-gray | `#f6f6f6` | surface | Card and panel backgrounds |
| text-primary | `#0c021c` | text-primary | Headings and body text |
| framer-text-color | `#666666` | text-muted | Captions, placeholders, secondary info |
| border | `#363636` | border | Dividers, card borders, outlines |
| accent | `#0000ee` | accent | CTAs, links, focus rings, active states |
| framer-link-text-color | `#0099ff` | info | Informational highlights |
| framer-text-color | `#000000` | unknown | Palette color |
| unknown | `#5318eb` | unknown | Palette color |
| unknown | `#270f61` | unknown | Palette color |
| unknown | `#c6a5ff` | unknown | Palette color |
| unknown | `#ebe3fe` | unknown | Palette color |
| rest-color | `#2a2c37` | unknown | Palette color |
| unknown | `#c4ee87` | unknown | Palette color |
| unknown | `#0d0e13` | unknown | Palette color |
| unknown | `#1e1d28` | unknown | Palette color |
| input-border-color--focus | `#6b53ff` | unknown | Palette color |
| unknown | `#d4d4d4` | unknown | Palette color |
| modal-close-icon-fill-color | `#8f92a3` | unknown | Palette color |
| unknown | `#565965` | unknown | Palette color |

### Dark Mode Token Mapping

| Variable | Light | Dark |
|---|---|---|
| `--modal-title-bg` | `var(--white)` | `#2a2c37` |
| `--modal-body-bg` | `var(--white)` | `#2a2c37` |
| `--modal-footer-bg` | `var(--white)` | `#2a2c37` |
| `--modal-body-text-color` | `var(--grey7)` | `#fff` |
| `--modal-close-icon-fill-color` | `var(--grey4)` | `#8f92a3` |
| `--modal-close-icon-fill-color--hover` | `var(--grey6)` | `#d7d8e0` |

### CSS Variable Tokens

```css
--framer-text-background-color: initial;
--framer-text-background-radius: initial;
--framer-text-background-corner-shape: initial;
--framer-text-background-padding: initial;
--framer-text-background-padding: 0px;
--framer-text-background-color: initial;
--framer-text-background-radius: initial;
--framer-text-background-corner-shape: initial;
--framer-text-background-padding: initial;
--framer-text-background-padding: 0px;
--framer-text-background-color: initial;
--framer-text-background-radius: initial;
--framer-text-background-corner-shape: initial;
--framer-text-background-padding: initial;
--framer-text-background-padding: 0px;
--framer-text-background-color: initial;
--framer-text-background-radius: initial;
--framer-text-background-corner-shape: initial;
--framer-text-background-padding: initial;
--border-bottom-width: 1px;
```


---

## 3. Typography Rules

**Font Stack:**
- **Eina 03 Regular** — Heading 1, Heading 2, Heading 3
- **Space Mono** — Body, Caption, Code

**Font Sources:**

```css
@font-face {
  font-family: "Space Mono";
  src: url("fonts/SpaceMono-Bold.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "Space Mono";
  src: url("fonts/SpaceMono-Regular.ttf") format("truetype");
  font-weight: 400;
}
@font-face {
  font-family: "Eina 03 Regular";
  src: url("fonts/Eina03Regular-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Mark Pro Bold";
  src: url("fonts/MarkProBold-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "Inter";
  src: url("fonts/Inter-Bold.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "Inter";
  src: url("fonts/Inter-Regular.ttf") format("truetype");
  font-weight: 400;
}
@font-face {
  font-family: "Eina 03 Bold";
  src: url("fonts/Eina03Bold-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "Mark Pro Regular";
  src: url("fonts/MarkProRegular-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Eina01-Bold ☞";
  src: url("fonts/Eina01-Bold☞-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Pitch-Lato-UI";
  src: url("fonts/Pitch-Lato-UI-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Pitch-Lato-UI";
  src: url("fonts/Pitch-Lato-UI-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "Mark Pro";
  src: url("fonts/MarkPro-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "Eina01";
  src: url("fonts/Eina01-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "swiper-icons";
  src: url("data:application/font-woff;charset=utf-8;base64, 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") format("woff");
  font-weight: 400;
}
```

| Role | Font | Size | Weight |
|---|---|---|---|
| Heading 1 | Eina 03 Regular | 120px | 700 |
| Heading 2 | Eina 03 Regular | 90px | 700 |
| Heading 3 | Eina 03 Regular | 80px | 700 |
| Body | Space Mono | 14px | 400 |
| Caption | Space Mono | 12px | 400 |
| Code | Space Mono | 14px | 400 |

**Typographic Rules:**
- Use **Eina 03 Regular** for all text — do not mix font families
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

### Data Input (2)

**Button** — `html`
- Animation: 

**Input** — `html`
- State: :focus, :placeholder

### Media (3)

**Image** — `html`

**Icon** — `html`

**Map/Canvas** — `html`



---

## 5. Layout Principles

- **Base spacing unit:** 4px
- **Spacing scale:** 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24
- **Border radius:** inherit, .375rem, .5625rem, .6em, 1px, 1.5px, 2px, 2em, 2.5px, 3px, 4px, 4.5px, 5px, 5px 0px 0px, 6px, 7px, 8px, 9px, 10px, 11px, 12px, 14px, 15px, 16px, 16px 16px 0px 0px, 18px, 20px, 24px, 25px, 30px, 32px, 34px, 36px, 40px, 46px, 48px, 50px, 60px, 70px, 72px, 80%, 100px, 100%, 999px, unset
- **Max content width:** 66em

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

- `0 0 0 1px var(--input-border-color--focus)`
- `0 0 0 2px rgba(var(--error-rgb),.5)`
- `inset 0 0 0 2px rgba(var(--action-rgb),.5)`

### Raised — cards, buttons, interactive elements

- `0 1px 3px 0 rgba(103,110,144,0.1)`
- `var(--focus-box-shadow)`
- `0 2px 6px 0 rgba(25,25,25,0.25)`

### Floating — dropdowns, popovers, modals

- `0 2px 10px rgba(0,0,0,0.08)`
- `0 6px 12px 0 rgba(43,42,53,0.13),0 4px 6px 0 rgba(43,42,53,0.06)`
- `0 2px 20px 0 rgba(0,0,0,0.08)`

### Overlay — full-screen overlays, top-level dialogs

- `0 8px 32px rgba(0,0,0,0.5),0 2px 8px rgba(0,0,0,0.3)`
- `0 8px 24px rgba(0,0,0,0.15),0 2px 8px rgba(0,0,0,0.1)`
- `0 8px 26px rgba(103,110,144,0.2)`

### Z-Index Scale

`0, 1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 20, 22, 25, 50, 98, 99, 100, 101, 102, 103, 104, 105, 110, 150, 199, 499, 500, 501, 502, 999, 1000, 1001, 1003, 1059, 1060, 5000, 6000, 6001, 9990, 9991, 9997, 9998, 9999, 10000, 99999, 100000, 999999, 99999991, 99999999, 999999999`



---

## 7. Animation & Motion

This project uses **expressive motion**. Animations are an integral part of the experience.

### CSS Animations

- `@keyframes fadein`
- `@keyframes fadeout`
- `@keyframes dropin`
- `@keyframes dropin-reverse`
- `@keyframes dropin-small`
- `@keyframes slidein`
- `@keyframes slidein-reverse`
- `@keyframes spin`

### Animated Components

- **Button**: 

### Motion Guidelines

- Duration: 150-300ms for micro-interactions, 300-500ms for page transitions
- Easing: `ease-out` for enters, `ease-in` for exits
- Always respect `prefers-reduced-motion`


---

## 8. Do's and Don'ts

### Do's

- Use `#0000ee` for interactive elements (buttons, links, focus rings)
- Use `#ffffff` as the primary page background
- Use **Eina 03 Regular** for all UI text
- Follow the **4px** spacing grid for all margins, padding, and gaps
- Use the defined shadow tokens for elevation — see Section 6
- Use border-radius from the scale: inherit, .375rem, .5625rem, .6em, 1px
- Reuse existing components from Section 4 before creating new ones
- Always use CSS variables for colors — never hardcode hex
- Test both light and dark modes for contrast

### Don'ts

- Don't introduce colors outside this palette — extend the design tokens first
- Don't mix font families — use Eina 03 Regular consistently
- Don't use arbitrary spacing values — stick to multiples of 4px
- Don't create custom box-shadow values outside the system tokens
- Don't use arbitrary border-radius values — pick from the defined scale
- Don't duplicate component patterns — check Section 4 first
- Don't use backdrop-blur or blur effects

### Anti-Patterns (detected from codebase)

- No blur or backdrop-blur effects
- No zebra striping on tables/lists


---

## 9. Responsive Behavior

| Name | Value | Source |
|---|---|---|
| xs | 22em | css |
| xs | 23.4em | css |
| sm | 40em | css |
| md | 48em | css |
| lg | 60em | css |
| xl | 66em | css |
| xl | 66.0625em | css |
| xl | 75em | css |
| xl | 80em | css |
| 2xl | 90em | css |
| xs | 320px | css |
| xs | 375px | css |
| sm | 550px | css |
| sm | 599px | css |
| sm | 600px | css |
| sm | 608px | css |
| sm | 629px | css |
| sm | 630px | css |
| sm | 640px | css |
| md | 675px | css |
| md | 710px | css |
| md | 730px | css |
| md | 744px | css |
| md | 749px | css |
| md | 750px | css |
| md | 768px | css |
| lg | 800px | css |
| lg | 809px | css |
| lg | 809.98px | css |
| lg | 810px | css |
| lg | 836px | css |
| lg | 849px | css |
| lg | 900px | css |
| lg | 918px | css |
| lg | 960px | css |
| lg | 1000px | css |
| lg | 1024px | css |
| xl | 1038px | css |
| xl | 1049px | css |
| xl | 1050px | css |
| xl | 1086px | css |
| xl | 1120px | css |
| xl | 1199px | css |
| xl | 1199.98px | css |
| xl | 1200px | css |
| xl | 1280px | css |
| 2xl | 1366px | css |
| 2xl | 1600px | css |
| 2xl | 1800px | css |
| 2xl | 2000px | css |

**Approach:** Use `@media (min-width: ...)` queries matching the breakpoints above.


---

## 10. Agent Prompt Guide

Use these as starting points when building new UI:

### Build a Card

```
Background: #f6f6f6
Border: 1px solid #363636
Radius: 15px
Padding: 16px
Font: Eina 03 Regular
Use shadow tokens from Section 6.
```

### Build a Button

```
Primary: bg #0000ee, text white
Ghost: bg transparent, border #363636
Padding: 8px 16px
Radius: 15px
Hover: opacity 0.9 or lighter shade
Focus: ring with #0000ee
```

### Build a Page Layout

```
Background: #ffffff
Max-width: 66em, centered
Grid: 4px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface: #f6f6f6
Label: #666666 (muted, 12px, uppercase)
Value: #0c021c (primary, 24-32px, bold)
Status: use success/warning/danger from Section 2
```

### Build a Form

```
Input bg: #ffffff
Input border: 1px solid #363636
Focus: border-color #0000ee
Label: #666666 12px
Spacing: 16px between fields
Radius: 15px
```

### General Component

```
1. Read DESIGN.md Sections 2-6 for tokens
2. Colors: only from palette
3. Font: Eina 03 Regular, type scale from Section 3
4. Spacing: 4px grid
5. Components: match patterns from Section 4
6. Elevation: shadow tokens
```

## Visual Guide — Screenshots (VISUAL_GUIDE.md)

# pitch — Visual Guide

> Master visual reference. Study every screenshot carefully before implementing any UI.
> Match colors, layout, typography, spacing, and motion states exactly.

**Motion Stack:** **Web Animations API (14 active)**

**WebGL/3D:** Detected (1 canvas elements) — replicate with Three.js or CSS 3D transforms

## Scroll Journey

The page has cinematic scroll animations. Each screenshot below shows the exact visual state at that scroll depth.
**Replicate these transitions precisely** — the design changes dramatically as you scroll.

### Hero — Above the fold

*Scroll position: 0px of 13345px total*

![Hero — Above the fold](../screens/scroll/scroll-000.png)

### 17% scroll depth

*Scroll position: 2116px of 13345px total*

![17% scroll depth](../screens/scroll/scroll-017.png)

### 33% scroll depth

*Scroll position: 4107px of 13345px total*

![33% scroll depth](../screens/scroll/scroll-033.png)

### 50% scroll depth

*Scroll position: 6223px of 13345px total*

![50% scroll depth](../screens/scroll/scroll-050.png)

### 67% scroll depth

*Scroll position: 8338px of 13345px total*

![67% scroll depth](../screens/scroll/scroll-067.png)

### 83% scroll depth

*Scroll position: 10329px of 13345px total*

![83% scroll depth](../screens/scroll/scroll-083.png)

### Footer — End of page

*Scroll position: 12445px of 13345px total*

![Footer — End of page](../screens/scroll/scroll-100.png)

## Full Page Screenshots

### The AI presentation workspace

*URL: `https://pitch.com`*

![The AI presentation workspace](../screens/pages/home.png)

### An MCP for decks worth sending | Pitch

*URL: `https://pitch.com/blog/an-mcp-for-decks-worth-sending`*

![An MCP for decks worth sending | Pitch](../screens/pages/blog-an-mcp-for-decks-worth-sending.png)

### Product | Pitch

*URL: `https://pitch.com/product`*

![Product | Pitch](../screens/pages/product.png)

### Customer Stories | Pitch

*URL: `https://pitch.com/customer-stories`*

![Customer Stories | Pitch](../screens/pages/customer-stories.png)

### 100+ free presentation templates designed by experts | Pitch

*URL: `https://pitch.com/templates`*

![100+ free presentation templates designed by experts | Pitch](../screens/pages/templates.png)

## Section Screenshots

Clipped sections showing individual components in context.

### Section 1 — `section`

*1440×1200px*

![Section 1](../screens/sections/home-section-1.png)

### Section 1 — `section`

*1440×768px*

![Section 1](../screens/sections/blog-an-mcp-for-decks-worth-sending-section-1.png)

### Section 1 — `section`

*1440×1200px*

![Section 1](../screens/sections/product-section-1.png)

### Section 1 — `section`

*1440×454px*

![Section 1](../screens/sections/customer-stories-section-1.png)

### Section 2 — `section`

*1440×716px*

![Section 2](../screens/sections/customer-stories-section-2.png)

### Section 3 — `main > div`

*1122×1200px*

![Section 3](../screens/sections/templates-section-3.png)

### Section 4 — `[class*="hero"]`

*1440×326px*

![Section 4](../screens/sections/templates-section-4.png)

## Animations & Motion (ANIMATIONS.md)

# Animation Reference

> Cinematic motion design extracted from live DOM. Follow these specs exactly to recreate the experience.

## Motion Technology Stack

| Library | Type | Notes |
|---------|------|-------|
| **Web Animations API (14 active)** | animation |  |
| Canvas (1 elements) | WebGL/3D | WebGL context detected — likely Three.js or custom shader |

## Scroll Journey

The page is **13,345px** tall. Each frame below shows what the user sees at that scroll depth.

> **Use these screenshots to understand WHAT animates, WHEN it animates, and HOW it moves.**

### 0% — Top / Hero
Scroll position: 0px

![Scroll 0%](../screens/scroll/scroll-000.png)

### 17% — Opening Section
Scroll position: 2,116px

![Scroll 17%](../screens/scroll/scroll-017.png)

### 33% — First Feature Section
Scroll position: 4,107px

![Scroll 33%](../screens/scroll/scroll-033.png)

### 50% — Mid-Page
Scroll position: 6,223px

![Scroll 50%](../screens/scroll/scroll-050.png)

### 67% — Lower Content
Scroll position: 8,338px

![Scroll 67%](../screens/scroll/scroll-067.png)

### 83% — Near Footer
Scroll position: 10,329px

![Scroll 83%](../screens/scroll/scroll-083.png)

### 100% — Bottom / Footer
Scroll position: 12,445px

![Scroll 100%](../screens/scroll/scroll-100.png)

## Video Elements

| # | Role | Autoplay | Loop | Muted | Size | First Frame |
|---|------|----------|------|-------|------|-------------|
| 1 | background | — | ✓ | ✓ | 1224×816 | — |

- **Source:** `https://res.cloudinary.com/pitch-software/video/upload/v1790324268/MCPVideo.mp4`

## Scroll Animation Patterns

| Pattern | Library | Element Count | Duration | Delay | Easing |
|---------|---------|---------------|----------|-------|--------|
| parallax / sticky scroll | CSS | 1 | — | — | — |

### CSS Implementation

## Global Transition Declarations

These `transition` values were extracted from CSS rules across the site:

```css
transition: opacity 0.4s ease-out;
transition: unset;
transition: transform 167ms cubic-bezier(0.33, 0, 0, 1);
transition: transform 250ms cubic-bezier(0.33, 0, 0, 1);
transition: transform 134ms cubic-bezier(0.45, 0, 0.2, 1);
transition: transform 100ms linear, opacity 80ms linear;
transition: opacity 80ms linear;
```

## How to Recreate This Motion Design

### Step 1 — Install Dependencies

```bash
```

### Step 2 — Scroll-Reveal Pattern

Elements that animate into view follow this pattern:

```css
/* Initial hidden state */
.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Step 3 — Key Motion Principles

- **WebGL/3D layer detected** — product visualizations use Three.js or custom WebGL. Use `<canvas>` with Three.js for 3D product renders
- **Video backgrounds** — use `<video autoplay loop muted playsinline>` for background videos. Always include a poster image fallback
- **Canvas elements (1)** — animated via requestAnimationFrame loop. Use canvas for particle effects, gradient animations, and WebGL scenes
- **Duration scale:** `0.4s` · `167ms` · `250ms` · `134ms` · `100ms` — use these values, never invent new durations
- **Always add** `@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`

### Step 4 — Scroll Journey Reference

Match what happens at each scroll position:

- **0%** (`0px`) → `screens/scroll/scroll-000.png`
- **17%** (`2116px`) → `screens/scroll/scroll-017.png`
- **33%** (`4107px`) → `screens/scroll/scroll-033.png`
- **50%** (`6223px`) → `screens/scroll/scroll-050.png`
- **67%** (`8338px`) → `screens/scroll/scroll-067.png`
- **83%** (`10329px`) → `screens/scroll/scroll-083.png`
- **100%** (`12445px`) → `screens/scroll/scroll-100.png`

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
| `main.framer-1y8qmcr` | column | center | center | 0px | 12 |
| `footer.framer-gneSf.framer-kzKe1` | column | center | center | 0px | 2 |
| `section#hero.framer-rw2nwm` | column | start | center | 0px | 3 |
| `section.framer-b5chfj` | column | center | center | 0px | 1 |
| `section.framer-1bi9kfm` | column | center | center | 0px | 1 |
| `section.framer-1u6rr4m` | column | center | center | 0px | 1 |
| `section.framer-na08tu` | row | center | center | 10px | 2 |
| `section.framer-6lutuk` | column | center | center | 0px | 2 |
| `section#launch.framer-88iktu` | column | center | center | 0px | 1 |
| `section.framer-j63fea` | column | center | center | 0px | 1 |
| `section#faqs.framer-12xq4q2` | column | center | center | 0px | 1 |
| `nav.framer-xxi5k.framer-1cn5a19` | column | center | center | 0px | 1 |
| `section.framer-yIcXL.framer-ZtrnA` | row | center | center | 10px | 1 |
| `section.framer-meaVU.framer-sXXQ8` | column | center | center | 0px | 1 |
| `section` | row | center | center | — | 1 |

## Structural Containers

### `<main>` (`main.framer-1y8qmcr`)

```
display:          flex
flex-direction:   column
justify-content:  center
align-items:      center
gap:              0px
children:         12
```

### `<footer>` (`footer.framer-gneSf.framer-kzKe1`)

```
display:          flex
flex-direction:   column
justify-content:  center
align-items:      center
gap:              0px
padding:          0px 24px
children:         2
```

### `<section>` (`section#hero.framer-rw2nwm`)

```
display:          flex
flex-direction:   column
justify-content:  start
align-items:      center
gap:              0px
children:         3
```

### `<section>` (`section.framer-b5chfj`)

```
display:          flex
flex-direction:   column
justify-content:  center
align-items:      center
gap:              0px
padding:          0px 24px
children:         1
```

### `<section>` (`section.framer-1bi9kfm`)

```
display:          flex
flex-direction:   column
justify-content:  center
align-items:      center
gap:              0px
padding:          0px 24px
children:         1
```

### `<section>` (`section.framer-1u6rr4m`)

```
display:          flex
flex-direction:   column
justify-content:  center
align-items:      center
gap:              0px
padding:          0px 24px
children:         1
```

### `<section>` (`section.framer-na08tu`)

```
display:          flex
flex-direction:   row
justify-content:  center
align-items:      center
gap:              10px
padding:          0px 24px
children:         2
```

### `<section>` (`section.framer-6lutuk`)

```
display:          flex
flex-direction:   column
justify-content:  center
align-items:      center
gap:              0px
padding:          0px 24px
children:         2
```

### `<section>` (`section#launch.framer-88iktu`)

```
display:          flex
flex-direction:   column
justify-content:  center
align-items:      center
gap:              0px
padding:          0px 24px
children:         1
```

### `<section>` (`section.framer-j63fea`)

```
display:          flex
flex-direction:   column
justify-content:  center
align-items:      center
gap:              0px
padding:          0px 24px
children:         1
```

### `<section>` (`section#faqs.framer-12xq4q2`)

```
display:          flex
flex-direction:   column
justify-content:  center
align-items:      center
gap:              0px
padding:          0px 24px
children:         1
```

### `<nav>` (`nav.framer-xxi5k.framer-1cn5a19`)

```
display:          flex
flex-direction:   column
justify-content:  center
align-items:      center
gap:              0px
children:         1
```

## Layout Rules

- Primary layout system: **Flexbox**
- Every spacing value must be a multiple of **4px**
- Never use arbitrary margin/padding values outside the spacing scale

## Component Patterns (COMPONENTS.md)

# Component Reference

> Repeated DOM patterns detected by structural analysis. Each component appeared 3+ times.

## Detected Components

| Component | Category | Instances | Key Classes |
|-----------|----------|-----------|-------------|
| **Framer Styles Preset Ln0uq5** | unknown | 17× | `.framer-styles-preset-ln0uq5`, `.framer-text` |
| **Framer Styles Preset Uusxi2** | unknown | 10× | `.framer-styles-preset-uusxi2`, `.framer-text` |
| **Framer Styles Preset Zdp8sl** | unknown | 10× | `.framer-styles-preset-zdp8sl`, `.framer-text` |
| **Framer Styles Preset 1lo762i** | unknown | 7× | `.framer-styles-preset-1lo762i`, `.framer-text` |
| **Framer Styles Preset Lt0x5g** | unknown | 6× | `.framer-styles-preset-lt0x5g`, `.framer-text` |
| **Framer Uiyp7s** | unknown | 5× | `.framer-uiyp7s` |
| **Framer 1t07z6c** | unknown | 5× | `.framer-1t07z6c`, `.framer-4K6Ds`, `.framer-5CQJC` |
| **Framer K6p9f3** | unknown | 5× | `.framer-k6p9f3` |
| **Framer Styles Preset 1dr9ln0** | unknown | 5× | `.framer-styles-preset-1dr9ln0`, `.framer-text` |
| **Framer 191u31s** | unknown | 4× | `.framer-191u31s`, `.framer-kn1c2`, `.framer-v-vxcegg` |
| **Framer 176r3qo** | unknown | 4× | `.framer-176r3qo`, `.framer-Tuaip`, `.framer-Xn0K6` |
| **Framer 176r3qo** | unknown | 3× | `.framer-176r3qo`, `.framer-Tuaip`, `.framer-Xn0K6` |
| **Framer Ay48d7** | unknown | 3× | `.framer-ay48d7` |
| **Framer T3qg5b** | unknown | 3× | `.framer-t3qg5b` |
| **Framer 1sccnvj** | unknown | 3× | `.framer-1sccnvj` |
| **Framer 3zMmm** | unknown | 3× | `.framer-3zMmm`, `.framer-Gm8St`, `.framer-hygob7` |
| **Framer 1kldjtm** | unknown | 3× | `.framer-1kldjtm` |
| **Framer Uxb7gr** | unknown | 3× | `.framer-uxb7gr` |
| **Framer 9aj2tc** | unknown | 3× | `.framer-9aj2tc` |
| **Framer 3zMmm** | unknown | 3× | `.framer-3zMmm`, `.framer-UuhaG`, `.framer-ZtrnA` |

## Other Components

### Framer Styles Preset Ln0uq5

**Instances found:** 17

**CSS classes:** `.framer-styles-preset-ln0uq5` `.framer-text`

**HTML structure:**

```html
<p class="framer-text framer-styles-preset-ln0uq5" data-styles-preset="Yk5tvs5_6" dir="auto" style="--framer-text-color: var(--extracted-r6o4lv, var(--variable-reference-kAwEiXsB1-XLt5BXpPk));">AI presentations shouldn’t be static. Generate and craft slides with full design control, to quickly create eye-catching, unique decks.</p>
```

**Base styles (from design tokens):**

```css
.framer-styles-preset-ln0uq5 {
  background: #f6f6f6;
  padding: 4px;
}```

### Framer Styles Preset Uusxi2

**Instances found:** 10

**CSS classes:** `.framer-styles-preset-uusxi2` `.framer-text`

**HTML structure:**

```html
<p class="framer-text framer-styles-preset-uusxi2" data-styles-preset="RdhS5mepB" dir="auto" style="--framer-text-color: var(--extracted-r6o4lv, var(--variable-reference-cYQCPgTAS-e4PFlFU1l));">Product</p>
```

**Base styles (from design tokens):**

```css
.framer-styles-preset-uusxi2 {
  background: #f6f6f6;
  padding: 4px;
}```

### Framer Styles Preset Zdp8sl

**Instances found:** 10

**CSS classes:** `.framer-styles-preset-zdp8sl` `.framer-text`

**HTML structure:**

```html
<h3 class="framer-text framer-styles-preset-zdp8sl" data-styles-preset="e6zCx4SoW" dir="auto" style="--framer-text-color: var(--extracted-a0htzi, var(--variable-reference-kAwEiXsB1-XLt5BXpPk));">Slides that are fully editable</h3>
```

**Base styles (from design tokens):**

```css
.framer-styles-preset-zdp8sl {
  background: #f6f6f6;
  padding: 4px;
}```

### Framer Styles Preset 1lo762i

**Instances found:** 7

**CSS classes:** `.framer-styles-preset-1lo762i` `.framer-text`

**HTML structure:**

```html
<h2 class="framer-text framer-styles-preset-1lo762i" data-styles-preset="cCOtIwl3V" dir="auto" style="--framer-text-alignment: center; --framer-text-color: var(--extracted-1of0zx5, var(--token-7cd3dd22-9636-4551-ac3e-271ed57898cf, rgb(12, 2, 28)));">AI presentations with multiplayer mode</h2>
```

**Base styles (from design tokens):**

```css
.framer-styles-preset-1lo762i {
  background: #f6f6f6;
  padding: 4px;
}```

### Framer Styles Preset Lt0x5g

**Instances found:** 6

**CSS classes:** `.framer-styles-preset-lt0x5g` `.framer-text`

**HTML structure:**

```html
<p class="framer-text framer-styles-preset-lt0x5g" data-styles-preset="BQUCFfyh8" dir="auto" style="--framer-text-alignment: center; --framer-text-color: var(--extracted-r6o4lv, var(--token-2659268f-dfd6-4f33-9625-999d245bc24a, rgb(54, 54, 54)));">Rather than prompting AI individually, Pitch brings your team together into one workspace, to collaborate on slides that matter.</p>
```

**Base styles (from design tokens):**

```css
.framer-styles-preset-lt0x5g {
  background: #f6f6f6;
  padding: 4px;
}```

### Framer Uiyp7s

**Instances found:** 5

**CSS classes:** `.framer-uiyp7s`

**HTML structure:**

```html
<div class="framer-uiyp7s" data-framer-component-type="RichTextContainer" style="--extracted-r6o4lv: var(--variable-reference-cYQCPgTAS-e4PFlFU1l); --framer-link-text-color: rgb(0, 153, 255); --framer-link-text-decoration: underline; --variable-reference-cYQCPgTAS-e4PFlFU1l: var(--token-4fbfc342-89ce-48a8-822c-2888df55a915, rgb(255, 255, 255)); transform: none; opacity: 1;"><p class="framer-text framer-styles-preset-uusxi2" data-styles-preset="RdhS5mepB" dir="auto" style="--framer-text-color: var(--extracted-r6o4lv, var(--variable-reference-cYQCPgTAS-e4PFlFU1l));">Product</p></div>
```

**Base styles (from design tokens):**

```css
.framer-uiyp7s {
  background: #f6f6f6;
  padding: 4px;
}```

### Framer 1t07z6c

**Instances found:** 5

**CSS classes:** `.framer-1t07z6c` `.framer-4K6Ds` `.framer-5CQJC` `.framer-kzKe1` `.framer-v-1ti0ogn` `.framer-ySpJZ`

**HTML structure:**

```html
<div class="framer-4K6Ds framer-5CQJC framer-ySpJZ framer-kzKe1 framer-1t07z6c framer-v-1ti0ogn" data-framer-name="Centered Dark" style="width: 100%; opacity: 1;"><div class="framer-k6p9f3" data-framer-component-type="RichTextContainer" style="--extracted-r6o4lv: var(--token-f00c3c0d-390f-4a8d-aee9-60c50c874549, rgb(83, 24, 235)); --framer-link-text-color: rgb(0, 153, 255); --framer-link-text-decoration: underline; will-change: transform; opacity: 0; transform: translateY(20px);"><p class="framer-text framer-styles-preset-1dr9ln0" data-styles-preset="Soq6GMpyy" dir="auto" style="--framer-text-
```

**Base styles (from design tokens):**

```css
.framer-1t07z6c {
  background: #f6f6f6;
  padding: 4px;
}```

### Framer K6p9f3

**Instances found:** 5

**CSS classes:** `.framer-k6p9f3`

**HTML structure:**

```html
<div class="framer-k6p9f3" data-framer-component-type="RichTextContainer" style="--extracted-r6o4lv: var(--token-f00c3c0d-390f-4a8d-aee9-60c50c874549, rgb(83, 24, 235)); --framer-link-text-color: rgb(0, 153, 255); --framer-link-text-decoration: underline; will-change: transform; opacity: 0; transform: translateY(20px);"><p class="framer-text framer-styles-preset-1dr9ln0" data-styles-preset="Soq6GMpyy" dir="auto" style="--framer-text-color: var(--extracted-r6o4lv, var(--token-f00c3c0d-390f-4a8d-aee9-60c50c874549, rgb(83, 24, 235)));">VISION</p></div>
```

**Base styles (from design tokens):**

```css
.framer-k6p9f3 {
  background: #f6f6f6;
  padding: 4px;
}```

### Framer Styles Preset 1dr9ln0

**Instances found:** 5

**CSS classes:** `.framer-styles-preset-1dr9ln0` `.framer-text`

**HTML structure:**

```html
<p class="framer-text framer-styles-preset-1dr9ln0" data-styles-preset="Soq6GMpyy" dir="auto" style="--framer-text-color: var(--extracted-r6o4lv, var(--token-f00c3c0d-390f-4a8d-aee9-60c50c874549, rgb(83, 24, 235)));">VISION</p>
```

**Base styles (from design tokens):**

```css
.framer-styles-preset-1dr9ln0 {
  background: #f6f6f6;
  padding: 4px;
}```

### Framer 191u31s

**Instances found:** 4

**CSS classes:** `.framer-191u31s` `.framer-kn1c2` `.framer-v-vxcegg` `.framer-vxcegg` `.framer-y8Mav`

**HTML structure:**

```html
<a class="framer-y8Mav framer-kn1c2 framer-vxcegg framer-v-vxcegg framer-191u31s" data-framer-name="Variant 1" data-highlight="true" href="./product" style="--1numsot: 12px; opacity: 1;"><div class="framer-uiyp7s" data-framer-component-type="RichTextContainer" style="--extracted-r6o4lv: var(--variable-reference-cYQCPgTAS-e4PFlFU1l); --framer-link-text-color: rgb(0, 153, 255); --framer-link-text-decoration: underline; --variable-reference-cYQCPgTAS-e4PFlFU1l: var(--token-4fbfc342-89ce-48a8-822c-2888df55a915, rgb(255, 255, 255)); transform: none; opacity: 1;"><p class="framer-text framer-styles-
```

**Base styles (from design tokens):**

```css
.framer-191u31s {
  background: #f6f6f6;
  padding: 4px;
}```

### Framer 176r3qo

**Instances found:** 4

**CSS classes:** `.framer-176r3qo` `.framer-Tuaip` `.framer-Xn0K6` `.framer-v-vc7429` `.framer-vc7429`

**HTML structure:**

```html
<a class="framer-Tuaip framer-Xn0K6 framer-vc7429 framer-v-vc7429 framer-176r3qo" data-framer-name="Primary White" data-highlight="true" href="https://app.pitch.com/?login=true" tabindex="0" style="--7evga9: 12px 12px 12px 12px; --border-bottom-width: 0px; --border-color: rgba(0, 0, 0, 0); --border-left-width: 0px; --border-right-width: 0px; --border-style: solid; --border-top-width: 0px; background-color: var(--token-9f3d2b7e-2cad-488a-9e02-167a62e1c960, rgb(255, 255, 255)); border-radius: 30px; opacity: 1;"><div class="framer-xr3fg framer-1vgf21r" style="--p9m3v1: var(--token-7cd3dd22-9636-4
```

**Base styles (from design tokens):**

```css
.framer-176r3qo {
  background: #f6f6f6;
  padding: 4px;
}```

### Framer 176r3qo

**Instances found:** 3

**CSS classes:** `.framer-176r3qo` `.framer-Tuaip` `.framer-Xn0K6` `.framer-v-107t57j` `.framer-vc7429`

**HTML structure:**

```html
<a class="framer-Tuaip framer-Xn0K6 framer-vc7429 framer-v-107t57j framer-176r3qo" data-framer-name="Secondary Green" data-highlight="true" href="https://app.pitch.com/?signup&amp;app_cta=home_header" tabindex="0" style="--7evga9: 12px 12px 12px 12px; --border-bottom-width: 0px; --border-color: rgba(0, 0, 0, 0); --border-left-width: 0px; --border-right-width: 0px; --border-style: solid; --border-top-width: 0px; background-color: var(--token-d7ed0ca3-f22a-4402-ba2c-8b69989dc17e, rgb(196, 238, 135)); height: 100%; border-radius: 4px; opacity: 1;"><div class="framer-xr3fg framer-1vgf21r" style="-
```

**Base styles (from design tokens):**

```css
.framer-176r3qo {
  background: #f6f6f6;
  padding: 4px;
}```

### Framer Ay48d7

**Instances found:** 3

**CSS classes:** `.framer-ay48d7`

**HTML structure:**

```html
<div class="framer-ay48d7" data-framer-name="Header Narrow" style="opacity: 1;"><div class="framer-t3qg5b" data-framer-component-type="RichTextContainer" style="--extracted-1of0zx5: var(--token-7cd3dd22-9636-4551-ac3e-271ed57898cf, rgb(12, 2, 28)); --framer-link-text-color: rgb(0, 153, 255); --framer-link-text-decoration: underline; will-change: transform; opacity: 0; transform: translateY(20px);"><h2 class="framer-text framer-styles-preset-1lo762i" data-styles-preset="cCOtIwl3V" dir="auto" style="--framer-text-alignment: center; --framer-text-color: var(--extracted-1of0zx5, var(--token-7cd3dd
```

**Base styles (from design tokens):**

```css
.framer-ay48d7 {
  background: #f6f6f6;
  padding: 4px;
}```

### Framer T3qg5b

**Instances found:** 3

**CSS classes:** `.framer-t3qg5b`

**HTML structure:**

```html
<div class="framer-t3qg5b" data-framer-component-type="RichTextContainer" style="--extracted-1of0zx5: var(--token-7cd3dd22-9636-4551-ac3e-271ed57898cf, rgb(12, 2, 28)); --framer-link-text-color: rgb(0, 153, 255); --framer-link-text-decoration: underline; will-change: transform; opacity: 0; transform: translateY(20px);"><h2 class="framer-text framer-styles-preset-1lo762i" data-styles-preset="cCOtIwl3V" dir="auto" style="--framer-text-alignment: center; --framer-text-color: var(--extracted-1of0zx5, var(--token-7cd3dd22-9636-4551-ac3e-271ed57898cf, rgb(12, 2, 28)));">AI presentations with multipl
```

**Base styles (from design tokens):**

```css
.framer-t3qg5b {
  background: #f6f6f6;
  padding: 4px;
}```

### Framer 1sccnvj

**Instances found:** 3

**CSS classes:** `.framer-1sccnvj`

**HTML structure:**

```html
<div class="framer-1sccnvj" data-framer-component-type="RichTextContainer" style="--extracted-r6o4lv: var(--token-2659268f-dfd6-4f33-9625-999d245bc24a, rgb(54, 54, 54)); --framer-link-text-color: rgb(0, 153, 255); --framer-link-text-decoration: underline; will-change: transform; opacity: 0; transform: translateY(20px);"><p class="framer-text framer-styles-preset-lt0x5g" data-styles-preset="BQUCFfyh8" dir="auto" style="--framer-text-alignment: center; --framer-text-color: var(--extracted-r6o4lv, var(--token-2659268f-dfd6-4f33-9625-999d245bc24a, rgb(54, 54, 54)));">Rather than prompting AI indiv
```

**Base styles (from design tokens):**

```css
.framer-1sccnvj {
  background: #f6f6f6;
  padding: 4px;
}```

### Framer 3zMmm

**Instances found:** 3

**CSS classes:** `.framer-3zMmm` `.framer-Gm8St` `.framer-hygob7` `.framer-rXq9n` `.framer-v-hygob7`

**HTML structure:**

```html
<div class="framer-Gm8St framer-3zMmm framer-rXq9n framer-hygob7 framer-v-hygob7" data-framer-name="Desktop" style="width: 100%; opacity: 1;"><div class="framer-1xc3w8w" data-framer-name="Icons Small" style="opacity: 1;"><div class="framer-pasp8 framer-1s1itut" style="--1adzpq9: var(--token-bf6e6ad9-0834-4bf8-9a9b-744c9d5daca8, rgb(40, 15, 98)); opacity: 1;"></div></div><div class="framer-1kldjtm" data-framer-name="Header Dark" style="opacity: 1;"><div class="framer-uxb7gr" data-framer-component-type="RichTextContainer" style="--extracted-a0htzi: var(--variable-reference-kAwEiXsB1-XLt5BXpPk); 
```

**Base styles (from design tokens):**

```css
.framer-3zMmm {
  background: #f6f6f6;
  padding: 4px;
}```

### Framer 1kldjtm

**Instances found:** 3

**CSS classes:** `.framer-1kldjtm`

**HTML structure:**

```html
<div class="framer-1kldjtm" data-framer-name="Header Dark" style="opacity: 1;"><div class="framer-uxb7gr" data-framer-component-type="RichTextContainer" style="--extracted-a0htzi: var(--variable-reference-kAwEiXsB1-XLt5BXpPk); --framer-link-text-color: rgb(0, 153, 255); --framer-link-text-decoration: underline; --variable-reference-kAwEiXsB1-XLt5BXpPk: var(--token-bf6e6ad9-0834-4bf8-9a9b-744c9d5daca8, rgb(40, 15, 98)); transform: none; opacity: 1;"><h3 class="framer-text framer-styles-preset-zdp8sl" data-styles-preset="e6zCx4SoW" dir="auto" style="--framer-text-color: var(--extracted-a0htzi, v
```

**Base styles (from design tokens):**

```css
.framer-1kldjtm {
  background: #f6f6f6;
  padding: 4px;
}```

### Framer Uxb7gr

**Instances found:** 3

**CSS classes:** `.framer-uxb7gr`

**HTML structure:**

```html
<div class="framer-uxb7gr" data-framer-component-type="RichTextContainer" style="--extracted-a0htzi: var(--variable-reference-kAwEiXsB1-XLt5BXpPk); --framer-link-text-color: rgb(0, 153, 255); --framer-link-text-decoration: underline; --variable-reference-kAwEiXsB1-XLt5BXpPk: var(--token-bf6e6ad9-0834-4bf8-9a9b-744c9d5daca8, rgb(40, 15, 98)); transform: none; opacity: 1;"><h3 class="framer-text framer-styles-preset-zdp8sl" data-styles-preset="e6zCx4SoW" dir="auto" style="--framer-text-color: var(--extracted-a0htzi, var(--variable-reference-kAwEiXsB1-XLt5BXpPk));">Slides that are fully editable<
```

**Base styles (from design tokens):**

```css
.framer-uxb7gr {
  background: #f6f6f6;
  padding: 4px;
}```

### Framer 9aj2tc

**Instances found:** 3

**CSS classes:** `.framer-9aj2tc`

**HTML structure:**

```html
<div class="framer-9aj2tc" data-framer-component-type="RichTextContainer" style="--extracted-r6o4lv: var(--variable-reference-kAwEiXsB1-XLt5BXpPk); --framer-link-text-color: rgb(0, 153, 255); --framer-link-text-decoration: underline; --variable-reference-kAwEiXsB1-XLt5BXpPk: var(--token-bf6e6ad9-0834-4bf8-9a9b-744c9d5daca8, rgb(40, 15, 98)); transform: none; opacity: 1;"><p class="framer-text framer-styles-preset-ln0uq5" data-styles-preset="Yk5tvs5_6" dir="auto" style="--framer-text-color: var(--extracted-r6o4lv, var(--variable-reference-kAwEiXsB1-XLt5BXpPk));">AI presentations shouldn’t be st
```

**Base styles (from design tokens):**

```css
.framer-9aj2tc {
  background: #f6f6f6;
  padding: 4px;
}```

### Framer 3zMmm

**Instances found:** 3

**CSS classes:** `.framer-3zMmm` `.framer-UuhaG` `.framer-ZtrnA` `.framer-dF5gC` `.framer-rXq9n` `.framer-v-vy6f7y`

**HTML structure:**

```html
<div class="framer-dF5gC framer-ZtrnA framer-UuhaG framer-ySpJZ framer-3zMmm framer-rXq9n framer-vy6f7y framer-v-vy6f7y" data-framer-name="Desktop" style="background-color: var(--token-9f3d2b7e-2cad-488a-9e02-167a62e1c960, rgb(255, 255, 255)); width: 100%; border-radius: 32px; opacity: 1;"><div class="framer-eizncj" style="opacity: 1;"><div class="framer-ikhw8b" style="opacity: 1;"><div class="framer-10votwx" data-framer-component-type="RichTextContainer" style="--extracted-r6o4lv: var(--variable-reference-QbrrIdkVp-C381eG1j_); --framer-link-text-color: rgb(0, 153, 255); --framer-link-text-dec
```

**Base styles (from design tokens):**

```css
.framer-3zMmm {
  background: #f6f6f6;
  padding: 4px;
}```

## Component Rules

- Match class names exactly from the patterns above
- Each component instance must be visually identical to others of its type
- Do not add extra wrappers or change the DOM structure
- Use `#363636` for all dividers within components
- Use `#0000ee` for all interactive/active states

## Interactions & States (INTERACTIONS.md)

# Interaction Reference

> Micro-interactions extracted from live DOM. Recreate these exactly for authentic feel.

## Coverage

| Component Type | Count | States Captured |
|----------------|-------|----------------|
| Button | 3 | default, hover, focus |
| Link | 3 | default, hover, focus |

## Transition System

These transition declarations were extracted from interactive elements:

```css
transition: opacity 0.15s;
transition: all;
transition: background-color 0.15s;
```

Apply these to all interactive elements. Never invent new durations or easings.

## Button Interactions

### Button 1 — `Cerrar banner`

**States:**

- Default: `../screens/states/button-1-default.png`
- Hover: `../screens/states/button-1-hover.png`
- Focus: `../screens/states/button-1-focus.png`

**On hover:**

```css
/* opacity: 1 → */ opacity: 0.6;
```

**On focus:**

```css
/* outline: rgb(0, 0, 0) none 3px → */ outline: rgb(16, 16, 16) auto 1px;
/* outline-color: rgb(0, 0, 0) → */ outline-color: rgb(16, 16, 16);
```

**Transition:** `opacity 0.15s`

### Button 2 — `More features`

**States:**

- Default: `../screens/states/button-2-default.png`
- Hover: `../screens/states/button-2-hover.png`
- Focus: `../screens/states/button-2-focus.png`

**On focus:**

```css
/* outline: rgb(40, 15, 98) none 3px → */ outline: rgb(16, 16, 16) auto 1px;
/* outline-color: rgb(40, 15, 98) → */ outline-color: rgb(16, 16, 16);
```

**Transition:** `all`

### Button 3 — `Prompts`

**States:**

- Default: `../screens/states/button-3-default.png`
- Hover: `../screens/states/button-3-hover.png`
- Focus: `../screens/states/button-3-focus.png`

**On hover:**

```css
/* background-color: rgba(0, 0, 0, 0) → */ background-color: rgba(13, 3, 28, 0.035);
```

**On focus:**

```css
/* outline: rgb(12, 2, 28) none 3px → */ outline: rgb(16, 16, 16) auto 1px;
/* outline-color: rgb(12, 2, 28) → */ outline-color: rgb(16, 16, 16);
```

**Transition:** `background-color 0.15s`

## Link Interactions

### Link 1 — `See what’s new`

**States:**

- Default: `../screens/states/link-1-default.png`
- Hover: `../screens/states/link-1-hover.png`
- Focus: `../screens/states/link-1-focus.png`

**On hover:**

```css
/* text-decoration: none → */ text-decoration: underline;
```

**On focus:**

```css
/* outline: rgb(12, 2, 28) none 3px → */ outline: rgb(16, 16, 16) auto 1px;
/* outline-color: rgb(12, 2, 28) → */ outline-color: rgb(16, 16, 16);
```

**Transition:** `all`

### Link 2 — `Logo - visit homepage`

**States:**

- Default: `../screens/states/link-2-default.png`
- Hover: `../screens/states/link-2-hover.png`
- Focus: `../screens/states/link-2-focus.png`

**On hover:**

```css
/* opacity: 1 → */ opacity: 0.736542;
```

**On focus:**

```css
/* opacity: 1 → */ opacity: 0.993824;
/* outline: rgb(0, 0, 238) none 3px → */ outline: rgb(16, 16, 16) auto 1px;
/* outline-color: rgb(0, 0, 238) → */ outline-color: rgb(16, 16, 16);
```

**Transition:** `all`

### Link 3 — `Product`

**States:**

- Default: `../screens/states/link-3-default.png`
- Hover: `../screens/states/link-3-hover.png`
- Focus: `../screens/states/link-3-focus.png`

**On focus:**

```css
/* outline: rgb(0, 0, 238) none 3px → */ outline: rgb(16, 16, 16) auto 1px;
/* outline-color: rgb(0, 0, 238) → */ outline-color: rgb(16, 16, 16);
```

**Transition:** `all`

## Interaction Rules

- Accent color `#0000ee` is used for focus rings, active states, and hover highlights
- Hover effects use **opacity** changes, not color shifts
- Hover effects include **color transitions** — use the extracted values, not approximations
- Focus states use **outline** (not box-shadow) — always match the extracted focus ring
- Transition durations in use: `0.15s`
- Always respect `prefers-reduced-motion` — set all transitions to `0s` when enabled

## Design Tokens — JSON Files

### tokens/colors.json
```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "core": {
    "text-primary": {
      "value": "#0c021c",
      "role": "text-primary"
    },
    "background": {
      "value": "#ffffff",
      "role": "background",
      "name": "framer-link-text-color"
    },
    "accent": {
      "value": "#0000ee",
      "role": "accent"
    },
    "text-muted": {
      "value": "#666666",
      "role": "text-muted",
      "name": "framer-text-color"
    },
    "border": {
      "value": "#363636",
      "role": "border"
    },
    "surface": {
      "value": "#f6f6f6",
      "role": "surface",
      "name": "color-background-gray"
    }
  },
  "status": {},
  "extended": {
    "framer-text-color": {
      "value": "#000000",
      "role": "unknown",
      "name": "framer-text-color"
    },
    "framer-link-text-color": {
      "value": "#0099ff",
      "role": "info",
      "name": "framer-link-text-color"
    },
    "color-5318eb": {
      "value": "#5318eb",
      "role": "unknown"
    },
    "color-270f61": {
      "value": "#270f61",
      "role": "unknown"
    },
    "color-c6a5ff": {
      "value": "#c6a5ff",
      "role": "unknown"
    },
    "color-ebe3fe": {
      "value": "#ebe3fe",
      "role": "unknown"
    },
    "rest-color": {
      "value": "#2a2c37",
      "role": "unknown",
      "name": "rest-color"
    },
    "color-c4ee87": {
      "value": "#c4ee87",
      "role": "unknown"
    },
    "color-0d0e13": {
      "value": "#0d0e13",
      "role": "unknown"
    },
    "color-1e1d28": {
      "value": "#1e1d28",
      "role": "unknown"
    },
    "input-border-color--focus": {
      "value": "#6b53ff",
      "role": "unknown",
      "name": "input-border-color--focus"
    },
    "color-d4d4d4": {
      "value": "#d4d4d4",
      "role": "unknown"
    },
    "modal-close-icon-fill-color": {
      "value": "#8f92a3",
      "role": "unknown",
      "name": "modal-close-icon-fill-color"
    },
    "color-565965": {
      "value": "#565965",
      "role": "unknown"
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
    "Eina 03 Regular",
    "Space Mono"
  ],
  "scale": {
    "heading-1": {
      "fontFamily": "Eina 03 Regular",
      "fontSize": "120px",
      "fontWeight": "700",
      "lineHeight": null,
      "source": "css"
    },
    "heading-2": {
      "fontFamily": "Eina 03 Regular",
      "fontSize": "90px",
      "fontWeight": "700",
      "lineHeight": null,
      "source": "css"
    },
    "heading-3": {
      "fontFamily": "Eina 03 Regular",
      "fontSize": "80px",
      "fontWeight": "700",
      "lineHeight": null,
      "source": "css"
    },
    "body": {
      "fontFamily": "Space Mono",
      "fontSize": "14px",
      "fontWeight": "400",
      "lineHeight": null,
      "source": "css"
    },
    "caption": {
      "fontFamily": "Space Mono",
      "fontSize": "12px",
      "fontWeight": "400",
      "lineHeight": null,
      "source": "css"
    },
    "code": {
      "fontFamily": "Space Mono",
      "fontSize": "14px",
      "fontWeight": "400",
      "lineHeight": null,
      "source": "css"
    }
  },
  "fontFaces": [
    {
      "family": "Space Mono",
      "src": "https://fonts.gstatic.com/s/spacemono/v17/i7dPIFZifjKcF5UAWdDRUEN2RFq7AwU.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Space Mono",
      "src": "https://fonts.gstatic.com/s/spacemono/v17/i7dMIFZifjKcF5UAWdDRaPpZYFeQHwyVd3U.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "Space Mono",
      "src": "https://fonts.gstatic.com/s/spacemono/v17/i7dSIFZifjKcF5UAWdDRYERE_FeaHi6QZ3WfYg.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "Space Mono",
      "src": "https://fonts.gstatic.com/s/spacemono/v17/i7dNIFZifjKcF5UAWdDRYER8RXi-EwWMbg.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Eina 03 Regular",
      "src": "https://framerusercontent.com/assets/r2tj1pD9b2S1hgQsz6QeRjN6ZXE.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Mark Pro Bold",
      "src": "https://framerusercontent.com/assets/Bx3CxdgVqIs2odjI1FCcD4OKHfc.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/DpPBYI0sL4fYLgAkX8KXOPVt7c.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/4RAEQdEOrcnDkhHiiCbJOw92Lk.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/1K3W8DizY3v4emK8Mb08YHxTbs.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/tUSCtfYVM1I1IchuyCwz9gDdQ.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/VgYFWiwsAC5OYxAycRXXvhze58.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/syRNPWzAMIrcJ3wIlPIP43KjQs.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/GIryZETIX4IFypco5pYZONKhJIo.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/H89BbHkbHDzlxZzxi8uPzTsp90.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/u6gJwDuwB143kpNK1T1MDKDWkMc.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/43sJ6MfOPh1LCJt46OvyDuSbA6o.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/wccHG0r4gBDAIRhfHiOlq6oEkqw.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/WZ367JPwf9bRW6LdTHN8rXgSjw.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/ia3uin3hQWqDrVloC1zEtYHWw.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/2A4Xx7CngadFGlVV4xrO06OBHY.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/CfMzU8w2e7tHgF4T4rATMPuWosA.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/867QObYax8ANsfX4TGEVU9YiCM.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/Oyn2ZbENFdnW7mt2Lzjk1h9Zb9k.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/cdAe8hgZ1cMyLu9g005pAW3xMo.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/DOfvtmE1UplCq161m6Hj8CSQYg.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/pKRFNWFoZl77qYCAIp84lN1h944.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/tKtBcDnBMevsEEJKdNGhhkLzYo.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Eina 03 Bold",
      "src": "https://framerusercontent.com/assets/aEZpo7WWxzF2oEf6lxnwVQ1g.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "Mark Pro Regular",
      "src": "https://framerusercontent.com/assets/hodGzqZFNiEMLmj5kCRFHoPncA.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Eina01-Bold ☞",
      "src": "https://framerusercontent.com/assets/xYzoxwQRsrRj0UGRJl8zoDdcvE.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/5vvr9Vy74if2I6bQbJvbw7SY1pQ.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/EOr0mi4hNtlgWNn9if640EZzXCo.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/Y9k9QrlZAqio88Klkmbd8VoMQc.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/OYrD2tBIBPvoJXiIHnLoOXnY9M.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/JeYwfuaPfZHQhEG8U5gtPDZ7WQ.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/GrgcKwrN6d3Uz8EwcLHZxwEfC4.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/b6Y37FthZeALduNqHicBT6FutY.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/mkY5Sgyq51ik0AMrSBwhm9DJg.woff2",
      "format": "woff2",
      "weight": "900"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/X5hj6qzcHUYv7h1390c8Rhm6550.woff2",
      "format": "woff2",
      "weight": "900"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/gQhNpS3tN86g8RcVKYUUaKt2oMQ.woff2",
      "format": "woff2",
      "weight": "900"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/cugnVhSraaRyANCaUtI5FV17wk.woff2",
      "format": "woff2",
      "weight": "900"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/5HcVoGak8k5agFJSaKa4floXVu0.woff2",
      "format": "woff2",
      "weight": "900"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/rZ5DdENNqIdFTIyQQiP5isO7M.woff2",
      "format": "woff2",
      "weight": "900"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/P2Bw01CtL0b9wqygO0sSVogWbo.woff2",
      "format": "woff2",
      "weight": "900"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/05KsVHGDmqXSBXM4yRZ65P8i0s.woff2",
      "format": "woff2",
      "weight": "900"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/ky8ovPukK4dJ1Pxq74qGhOqCYI.woff2",
      "format": "woff2",
      "weight": "900"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/vvNSqIj42qeQ2bvCRBIWKHscrc.woff2",
      "format": "woff2",
      "weight": "900"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/3ZmXbBKToJifDV9gwcifVd1tEY.woff2",
      "format": "woff2",
      "weight": "900"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/FNfhX3dt4ChuLJq2PwdlxHO7PU.woff2",
      "format": "woff2",
      "weight": "900"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/gcnfba68tfm7qAyrWRCf9r34jg.woff2",
      "format": "woff2",
      "weight": "900"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/efTfQcBJ53kM2pB1hezSZ3RDUFs.woff2",
      "format": "woff2",
      "weight": "900"
    },
    {
      "family": "Pitch-Lato-UI",
      "src": "https://pitch.com/static/platform/asset/lato-regular.1eW9jf9QG7ksLteKT1DLyA.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Pitch-Lato-UI",
      "src": "https://pitch.com/static/platform/asset/lato-medium.nGJhxHRZboMUCFXdH15e_g.woff2",
      "format": "woff2",
      "weight": "500"
    },
    {
      "family": "Pitch-Lato-UI",
      "src": "https://pitch.com/static/platform/asset/lato-bold._Uz_88BaL5EvE5kIXXeuBQ.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "Mark Pro",
      "src": "https://pitch.com/static/platform/asset/markpro-bold.gQ_dlunh5mvD9G1ZNWjzcw.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "Mark Pro",
      "src": "https://pitch.com/static/platform/asset/markpro-heavy.vSV1-7c4sdeFL_L5eMxC_g.woff2",
      "format": "woff2",
      "weight": "800"
    },
    {
      "family": "swiper-icons",
      "src": "data:application/font-woff;charset=utf-8;base64, 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",
      "format": "woff",
      "weight": "400"
    },
    {
      "family": "Eina01",
      "src": "https://pitch.com/static/platform/asset/eina01-regular.KcphlQec_-a9Vwvp9OQ47g.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Eina01",
      "src": "https://pitch.com/static/platform/asset/eina01-bold.Tkh4uKm2Xra_pJDLPzAPMQ.woff2",
      "format": "woff2",
      "weight": "600"
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

- `fonts/Eina01-600.woff2`
- `fonts/Eina01-Bold☞-Regular.woff2`
- `fonts/Eina01-Regular.woff2`
- `fonts/Eina03Bold-700.woff2`
- `fonts/Eina03Regular-Regular.woff2`
- `fonts/Inter-Black.ttf`
- `fonts/Inter-Bold.ttf`
- `fonts/Inter-ExtraBold.ttf`
- `fonts/Inter-ExtraLight.ttf`
- `fonts/Inter-Light.ttf`
- `fonts/Inter-Medium.ttf`
- `fonts/Inter-Regular.ttf`
- `fonts/Inter-SemiBold.ttf`
- `fonts/Inter-Thin.ttf`
- `fonts/MarkPro-700.woff2`
- `fonts/MarkPro-800.woff2`
- `fonts/MarkProBold-700.woff2`
- `fonts/MarkProRegular-Regular.woff2`
- `fonts/Pitch-Lato-UI-500.woff2`
- `fonts/Pitch-Lato-UI-700.woff2`
- `fonts/Pitch-Lato-UI-Regular.woff2`
- `fonts/SpaceMono-Bold.ttf`
- `fonts/SpaceMono-Regular.ttf`

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

### Full Page Screenshots (screens/pages/)

*Full-page screenshots of each crawled URL*

![blog-an-mcp-for-decks-worth-sending.png](screens/pages/blog-an-mcp-for-decks-worth-sending.png)

![customer-stories.png](screens/pages/customer-stories.png)

![home.png](screens/pages/home.png)

![product.png](screens/pages/product.png)

![templates.png](screens/pages/templates.png)

### Section Clips (screens/sections/)

*Clipped individual sections and components*

![blog-an-mcp-for-decks-worth-sending-section-1.png](screens/sections/blog-an-mcp-for-decks-worth-sending-section-1.png)

![customer-stories-section-1.png](screens/sections/customer-stories-section-1.png)

![customer-stories-section-2.png](screens/sections/customer-stories-section-2.png)

![home-section-1.png](screens/sections/home-section-1.png)

![product-section-1.png](screens/sections/product-section-1.png)

![templates-section-3.png](screens/sections/templates-section-3.png)

![templates-section-4.png](screens/sections/templates-section-4.png)

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
| 17% | 2116px | `screens/scroll/scroll-017.png` |
| 33% | 4107px | `screens/scroll/scroll-033.png` |
| 50% | 6223px | `screens/scroll/scroll-050.png` |
| 67% | 8338px | `screens/scroll/scroll-067.png` |
| 83% | 10329px | `screens/scroll/scroll-083.png` |
| 100% | 12445px | `screens/scroll/scroll-100.png` |

## Pages

| Page | URL | File |
|------|-----|------|
| The AI presentation workspace | `https://pitch.com` | `screens/pages/home.png` |
| An MCP for decks worth sending | Pitch | `https://pitch.com/blog/an-mcp-for-decks-worth-sending` | `screens/pages/blog-an-mcp-for-decks-worth-sending.png` |
| Product | Pitch | `https://pitch.com/product` | `screens/pages/product.png` |
| Customer Stories | Pitch | `https://pitch.com/customer-stories` | `screens/pages/customer-stories.png` |
| 100+ free presentation templates designed by experts | Pitch | `https://pitch.com/templates` | `screens/pages/templates.png` |

## Sections

| Page | Section | File |
|------|---------|------|
| home | #1 (section) | `screens/sections/home-section-1.png` |
| blog-an-mcp-for-decks-worth-sending | #1 (section) | `screens/sections/blog-an-mcp-for-decks-worth-sending-section-1.png` |
| product | #1 (section) | `screens/sections/product-section-1.png` |
| customer-stories | #1 (section) | `screens/sections/customer-stories-section-1.png` |
| customer-stories | #2 (section) | `screens/sections/customer-stories-section-2.png` |
| templates | #3 (main > div) | `screens/sections/templates-section-3.png` |
| templates | #4 ([class*="hero"]) | `screens/sections/templates-section-4.png` |

