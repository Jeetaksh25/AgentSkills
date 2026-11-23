---
name: copilot-design
description: Design system skill for copilot. Activate when building UI components, pages, or any visual elements. Provides exact color tokens, typography scale, spacing grid, component patterns, and craft rules. Read references/DESIGN.md before writing any CSS or JSX. Includes ultra-mode visual journey: read references/ANIMATIONS.md, references/LAYOUT.md, references/COMPONENTS.md, and references/INTERACTIONS.md for full motion and layout details.
---

# copilot Design System

You are building UI for **copilot**. Light-themed, cool palette, monospace typography (Matter Variable Thin), compact density on a 4px grid.

## Visual Reference

**IMPORTANT**: Study ALL screenshots below before writing any UI. Match colors, typography, spacing, layout, and motion exactly as shown.

### Homepage

![copilot Homepage](screenshots/homepage.png)

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

## Design Philosophy

- **Layered depth** — use shadow tokens to create a sense of physical layering. Each elevation level has a specific shadow.
- **Gradient accents** — gradients are used thoughtfully for emphasis, not decoration.
- **Single typeface** — Matter Variable Thin carries all text. Hierarchy comes from size, weight, and color — never font mixing.
- **compact density** — 4px base grid. Every dimension is a multiple of 4.
- **cool palette** — the color temperature runs cool, matching the monospace typography.
- **Restrained accent** — `#0000ee` is the only pop of color. Used exclusively for CTAs, links, focus rings, and active states.
- **Subtle motion** — transitions smooth state changes. Keep durations under 300ms, use ease-out curves.

## Color System

### Core Palette

| Role | Token | Hex | Use |
|------|-------|-----|-----|
| Background | `--background` | `#ffffff` | Page/app background |
| Text Primary | `--text-primary` | `#000000` | Headings, body text |
| Text Muted | `--text-muted` | `#5979a6` | Captions, placeholders |
| Accent | `--accent` | `#0000ee` | CTAs, links, focus rings |

### Status Colors

| Status | Hex | Use |
|--------|-----|-----|
| Success | `#03c749` | Confirmations, positive trends |
| Warning | `#f27f0c` | Caution states, pending items |
| Danger | `#ff4433` | Errors, destructive actions |

### Extended Palette

- **framer-link-text-color:** `#0099ff`
- `#11263b`
- `#031835` — Deep background layer or shadow color
- `#000814` — Deep background layer or shadow color
- `#5e85ba`
- **border-color:** `#3388ff`
- `#7f8ba4`
- `#000f24` — Deep background layer or shadow color

### CSS Variable Tokens

```css
--framer-text-background-color: initial;
--framer-text-background-radius: initial;
--framer-text-background-corner-shape: initial;
--framer-text-background-padding: initial;
--border-bottom-width: 1px;
--border-color: #38f;
--border-left-width: 1px;
--border-right-width: 1px;
--border-style: solid;
--border-top-width: 1px;
--border-bottom-width: 1px;
--border-left-width: 1px;
--border-right-width: 1px;
--border-style: solid;
--border-top-width: 1px;
--framer-link-text-background-padding: 0px;
--framer-link-text-background-radius: 0px;
--framer-text-background-color: initial;
--framer-text-background-radius: initial;
--framer-text-background-corner-shape: initial;
```

## Typography

### Font Stack

- **Matter Variable Thin** — Heading 1, Heading 2, Heading 3
- **Fragment Mono** — Body, Caption, Code

### Font Sources

```css
@font-face {
  font-family: "Fragment Mono";
  src: url("fonts/FragmentMono-Regular.ttf") format("truetype");
  font-weight: 400;
}
@font-face {
  font-family: "Matter Variable Thin";
  src: url("fonts/MatterVariableThin-100.woff2") format("woff2");
  font-weight: 100;
}
@font-face {
  font-family: "Matter Regular";
  src: url("fonts/MatterRegular-430.woff2") format("woff2");
  font-weight: 430;
}
@font-face {
  font-family: "Matter SemiBold";
  src: url("fonts/MatterSemiBold-670.woff2") format("woff2");
  font-weight: 670;
}
@font-face {
  font-family: "Matter SemiBold Italic";
  src: url("fonts/MatterSemiBoldItalic-670.woff2") format("woff2");
  font-weight: 670;
}
@font-face {
  font-family: "Matter Regular Italic";
  src: url("fonts/MatterRegularItalic-430.woff2") format("woff2");
  font-weight: 430;
}
@font-face {
  font-family: "Matter Medium";
  src: url("fonts/MatterMedium-570.woff2") format("woff2");
  font-weight: 570;
}
@font-face {
  font-family: "Matter Heavy";
  src: url("fonts/MatterHeavy-900.woff2") format("woff2");
  font-weight: 900;
}
@font-face {
  font-family: "Matter Heavy Italic";
  src: url("fonts/MatterHeavyItalic-900.woff2") format("woff2");
  font-weight: 900;
}
@font-face {
  font-family: "Matter Medium Italic";
  src: url("fonts/MatterMediumItalic-570.woff2") format("woff2");
  font-weight: 570;
}
@font-face {
  font-family: "Jokker Regular";
  src: url("fonts/JokkerRegular-Regular.woff2") format("woff2");
  font-weight: 400;
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
  font-family: "Jokker Semibold";
  src: url("fonts/JokkerSemibold-600.woff2") format("woff2");
  font-weight: 600;
}
@font-face {
  font-family: "Matter-TRIAL SemiBold";
  src: url("fonts/Matter-TRIALSemiBold-670.woff2") format("woff2");
  font-weight: 670;
}
@font-face {
  font-family: "Jokker Medium";
  src: url("fonts/JokkerMedium-500.woff2") format("woff2");
  font-weight: 500;
}
@font-face {
  font-family: "Jokker Heavy";
  src: url("fonts/JokkerHeavy-900.woff2") format("woff2");
  font-weight: 900;
}
@font-face {
  font-family: "Jokker Bold Italic";
  src: url("fonts/JokkerBoldItalic-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "Jokker Bold";
  src: url("fonts/JokkerBold-700.woff2") format("woff2");
  font-weight: 700;
}
```

### Type Scale

| Role | Family | Size | Weight |
|------|--------|------|--------|
| Heading 1 | Matter Variable Thin | calc(var(--framer-blockquote-font-size,var(--framer-font-size,16px))*var(--framer-font-size-scale,1)) | 700 |
| Heading 2 | Matter Variable Thin | calc(var(--framer-link-hover-font-size,var(--framer-blockquote-font-size,var(--framer-font-size,16px)))*var(--framer-font-size-scale,1)) | 700 |
| Heading 3 | Matter Variable Thin | calc(var(--framer-link-current-font-size,var(--framer-link-font-size,var(--framer-font-size,16px)))*var(--framer-font-size-scale,1)) | 700 |
| Body | Fragment Mono | calc(var(--framer-link-hover-font-size,var(--framer-link-current-font-size,var(--framer-link-font-size,var(--framer-font-size,16px))))*var(--framer-font-size-scale,1)) | 400 |
| Caption | Fragment Mono | var(--framer-font-size,16px) | 400 |
| Code | Fragment Mono | 14px | 400 |

### Typography Rules

- All text uses **Matter Variable Thin** — never add another font family
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

Scale: `inherit, 5px, 5.67px, 6px, 8px, 12px, 12px 12px 16px 16px, 14px, 16px, 16px 16px 28px 28px, 17px, 20px, 22px, 24px, 28px, 32px, 40px, 48px, 100%, 120px`
Default: `17px`

### Container

Max-width: `1199px`, centered with auto margins.

### Breakpoints

| Name | Value |
|------|-------|
| lg | 809px |
| lg | 809.98px |
| lg | 810px |
| xl | 1199px |
| 2xl | 1439px |
| 2xl | 1439.98px |
| 2xl | 1440px |

Mobile-first: design for small screens, layer on responsive overrides.

## Component Patterns

### Card

```css
.card {
  background: #ffffff;
  border-radius: 17px;
  padding: 16px;
  box-shadow: rgba(0, 0, 0, 0.07) 0px 0.362176px 0.651917px -1.5px, rgba(0, 0, 0, 0.05) 0px 3px 5.4px -3px;
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
  color: #000000;
  border-radius: 17px;
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
  border-radius: 17px;
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
  border-radius: 17px;
  padding: 8px 12px;
  color: #000000;
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
  background: #ffffff;
  color: #5979a6;
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
  border-radius: 120px;
  padding: 24px;
  max-width: 480px;
  width: 90vw;
  box-shadow: inset 0px 0px 12px 1px var(--token-748e9427-2299-40c6-98d4-e156257c2eac,#ffffff0f),inset 0px -4px 8px 0px #00000052;
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
  color: #5979a6;
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
  color: #5979a6;
  padding: 8px 12px;
  border-radius: 17px;
  transition: color 150ms;
}
.nav-link:hover { color: #000000; }
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

## Page Structure

The following page sections were detected:

- **Hero** — Hero section (detected from heading structure)
- **Faq** — FAQ/accordion section

When building pages, follow this section order and structure.

## Animation & Motion

This project uses **subtle motion**. Transitions smooth state changes without calling attention.

### Motion Tokens

- **Duration scale:** `400ms`
- **Easing functions:** `cubic-bezier(.44,0,.56,1)`
- **Animated properties:** `color`

### Motion Guidelines

- **Duration:** Use values from the duration scale above. Short (400ms) for micro-interactions, long (400ms) for page transitions
- **Easing:** Use `cubic-bezier(.44,0,.56,1)` as the default easing curve
- **Direction:** Elements enter from bottom/right, exit to top/left
- **Reduced motion:** Always respect `prefers-reduced-motion` — disable animations when set

## Depth & Elevation

### Shadow Tokens

- Subtle: `rgba(0, 0, 0, 0.12) 0px 0.83px 1px 0px`
- Raised (cards, buttons): `rgba(0, 0, 0, 0.07) 0px 0.362176px 0.651917px -1.5px, rgba(0, 0, 0, 0.05) 0px 3px 5.4px -3px`
- Floating (dropdowns, popovers): `inset 0px 0px 12px 1px var(--token-748e9427-2299-40c6-98d4-e156257c2eac,#ffffff0f),inset 0px -4px 8px 0px #00000052`
- Floating (dropdowns, popovers): `0 0 0 1px #0000000f,0 1px 1px -.5px #0000000f,0 3px 3px -1.5px #0000000f,0 6px 6px -3px #0000000a,0 12px 12px -6px #00000014`
- Floating (dropdowns, popovers): `rgba(255, 255, 255, 0.16) 4px 4px 16px -4px inset, rgba(0, 0, 0, 0.2) -4px -4px 16px -4px inset, rgba(255, 255, 255, 0.08) 4px 4px 8px 0px inset, rgba(255, 255, 255, 0.4) 1px 1px 1px -0.5px inset`
- Floating (dropdowns, popovers): `rgba(38, 113, 217, 0.08) 0px 0px 12px 1px inset, rgba(0, 0, 0, 0.32) 0px -4px 8px 0px inset`

### Z-Index Scale

`0, 1, 2, 3, 4, 5, 9, 10`

Use these exact values — never invent z-index values.

## Anti-Patterns (Never Do)

- **No blur effects** — no backdrop-blur, no filter: blur()
- **No zebra striping** — tables and lists use borders for separation
- **No invented colors** — every hex value must come from the palette above
- **No arbitrary spacing** — every dimension is a multiple of 4px
- **No extra fonts** — only Matter Variable Thin and Fragment Mono are allowed
- **No arbitrary border-radius** — use the scale: 5px, 5.67px, 6px, 8px, 12px, 14px, 16px, 17px, 20px, 22px
- **No opacity for disabled states** — use muted colors instead
- **No pill shapes** — this design doesn't use rounded-full / 9999px radius

## Workflow

1. **Read** `references/DESIGN.md` before writing any UI code
2. **Pick colors** from the Color System section — never invent new ones
3. **Set typography** — Matter Variable Thin, Fragment Mono only, using the type scale
4. **Build layout** on the 4px grid — check every margin, padding, gap
5. **Match components** to patterns above before creating new ones
6. **Apply elevation** — use shadow tokens
7. **Validate** — every value traces back to a design token. No magic numbers.

## Brand Spec

- **Favicon:** `https://framerusercontent.com/images/Ee1b14M1PJ0JDxNUK6Dz8dnBgQ.png`
- **Site URL:** `https://www.copilot.money/`
- **Brand color:** `#0000ee`
- **Brand typeface:** Matter Variable Thin

## Quick Reference

```
Background:     #ffffff
Surface:        (not extracted)
Text:           #000000 / #5979a6
Accent:         #0000ee
Border:         (not extracted)
Font:           Matter Variable Thin
Spacing:        4px grid
Radius:         17px
Components:     3 detected
```

## When to Trigger

Activate this skill when:
- Creating new components, pages, or visual elements for copilot
- Writing CSS, Tailwind classes, styled-components, or inline styles
- Building page layouts, templates, or responsive designs
- Reviewing UI code for design consistency
- The user mentions "copilot" design, style, UI, or theme
- Generating mockups, wireframes, or visual prototypes

---

# Full Reference Files

> Every output file is embedded below. Claude has full design system context from /skills alone.

## Design System Tokens (DESIGN.md)

# copilot DESIGN.md

> Auto-generated design system — reverse-engineered via static analysis by skillui.
> Frameworks: None detected
> Colors: 20 · Fonts: 2 · Components: 3
> Icon library: not detected · State: not detected
> Primary theme: light · Dark mode toggle: no · Motion: subtle

## Visual Reference

**Match this design exactly** — study colors, fonts, spacing, and component shapes before writing any UI code.

![copilot Homepage](../screenshots/homepage.png)

---

## 1. Visual Theme & Atmosphere

This is a **light-themed** interface with a cool, approachable feel. The light background emphasizes content clarity. Typography uses **Matter Variable Thin** throughout — a technical, developer-focused choice that maintains consistency. Spacing follows a **4px base grid** (compact density), with scale: 2, 4, 6, 8, 10, 12, 14, 16px. The accent color **#0000ee** anchors interactive elements (buttons, links, focus rings). Motion is subtle — smooth transitions (150-300ms) ease state changes without drawing attention.

---

## 2. Color Palette & Roles

| Token | Hex | Role | Use |
|---|---|---|---|
| border-color | `#ffffff` | background | Page background, darkest surface |
| framer-text-color | `#000000` | text-primary | Headings and body text |
| text-muted | `#5979a6` | text-muted | Captions, placeholders, secondary info |
| accent | `#0000ee` | accent | CTAs, links, focus rings, active states |
| danger | `#ff4433` | danger | Error states, destructive actions |
| success | `#03c749` | success | Success states, positive indicators |
| warning | `#f27f0c` | warning | Warning states, caution indicators |
| framer-link-text-color | `#0099ff` | info | Informational highlights |
| unknown | `#11263b` | unknown | Palette color |
| unknown | `#031835` | unknown | Palette color |
| unknown | `#000814` | unknown | Palette color |
| unknown | `#5e85ba` | unknown | Palette color |
| border-color | `#3388ff` | unknown | Palette color |
| unknown | `#7f8ba4` | unknown | Palette color |
| unknown | `#000f24` | unknown | Palette color |
| unknown | `#00204d` | unknown | Palette color |
| border-color | `#1c6cff` | unknown | Palette color |
| unknown | `#e1b321` | unknown | Palette color |
| unknown | `#94ae43` | unknown | Palette color |
| unknown | `#00acfe` | unknown | Palette color |

### CSS Variable Tokens

```css
--framer-text-background-color: initial;
--framer-text-background-radius: initial;
--framer-text-background-corner-shape: initial;
--framer-text-background-padding: initial;
--border-bottom-width: 1px;
--border-color: #38f;
--border-left-width: 1px;
--border-right-width: 1px;
--border-style: solid;
--border-top-width: 1px;
--border-bottom-width: 1px;
--border-left-width: 1px;
--border-right-width: 1px;
--border-style: solid;
--border-top-width: 1px;
--framer-link-text-background-padding: 0px;
--framer-link-text-background-radius: 0px;
--framer-text-background-color: initial;
--framer-text-background-radius: initial;
--framer-text-background-corner-shape: initial;
```


---

## 3. Typography Rules

**Font Stack:**
- **Matter Variable Thin** — Heading 1, Heading 2, Heading 3
- **Fragment Mono** — Body, Caption, Code

**Font Sources:**

```css
@font-face {
  font-family: "Fragment Mono";
  src: url("fonts/FragmentMono-Regular.ttf") format("truetype");
  font-weight: 400;
}
@font-face {
  font-family: "Matter Variable Thin";
  src: url("fonts/MatterVariableThin-100.woff2") format("woff2");
  font-weight: 100;
}
@font-face {
  font-family: "Matter Regular";
  src: url("fonts/MatterRegular-430.woff2") format("woff2");
  font-weight: 430;
}
@font-face {
  font-family: "Matter SemiBold";
  src: url("fonts/MatterSemiBold-670.woff2") format("woff2");
  font-weight: 670;
}
@font-face {
  font-family: "Matter SemiBold Italic";
  src: url("fonts/MatterSemiBoldItalic-670.woff2") format("woff2");
  font-weight: 670;
}
@font-face {
  font-family: "Matter Regular Italic";
  src: url("fonts/MatterRegularItalic-430.woff2") format("woff2");
  font-weight: 430;
}
@font-face {
  font-family: "Matter Medium";
  src: url("fonts/MatterMedium-570.woff2") format("woff2");
  font-weight: 570;
}
@font-face {
  font-family: "Matter Heavy";
  src: url("fonts/MatterHeavy-900.woff2") format("woff2");
  font-weight: 900;
}
@font-face {
  font-family: "Matter Heavy Italic";
  src: url("fonts/MatterHeavyItalic-900.woff2") format("woff2");
  font-weight: 900;
}
@font-face {
  font-family: "Matter Medium Italic";
  src: url("fonts/MatterMediumItalic-570.woff2") format("woff2");
  font-weight: 570;
}
@font-face {
  font-family: "Jokker Regular";
  src: url("fonts/JokkerRegular-Regular.woff2") format("woff2");
  font-weight: 400;
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
  font-family: "Jokker Semibold";
  src: url("fonts/JokkerSemibold-600.woff2") format("woff2");
  font-weight: 600;
}
@font-face {
  font-family: "Matter-TRIAL SemiBold";
  src: url("fonts/Matter-TRIALSemiBold-670.woff2") format("woff2");
  font-weight: 670;
}
@font-face {
  font-family: "Jokker Medium";
  src: url("fonts/JokkerMedium-500.woff2") format("woff2");
  font-weight: 500;
}
@font-face {
  font-family: "Jokker Heavy";
  src: url("fonts/JokkerHeavy-900.woff2") format("woff2");
  font-weight: 900;
}
@font-face {
  font-family: "Jokker Bold Italic";
  src: url("fonts/JokkerBoldItalic-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "Jokker Bold";
  src: url("fonts/JokkerBold-700.woff2") format("woff2");
  font-weight: 700;
}
```

| Role | Font | Size | Weight |
|---|---|---|---|
| Heading 1 | Matter Variable Thin | calc(var(--framer-blockquote-font-size,var(--framer-font-size,16px))*var(--framer-font-size-scale,1)) | 700 |
| Heading 2 | Matter Variable Thin | calc(var(--framer-link-hover-font-size,var(--framer-blockquote-font-size,var(--framer-font-size,16px)))*var(--framer-font-size-scale,1)) | 700 |
| Heading 3 | Matter Variable Thin | calc(var(--framer-link-current-font-size,var(--framer-link-font-size,var(--framer-font-size,16px)))*var(--framer-font-size-scale,1)) | 700 |
| Body | Fragment Mono | calc(var(--framer-link-hover-font-size,var(--framer-link-current-font-size,var(--framer-link-font-size,var(--framer-font-size,16px))))*var(--framer-font-size-scale,1)) | 400 |
| Caption | Fragment Mono | var(--framer-font-size,16px) | 400 |
| Code | Fragment Mono | 14px | 400 |

**Typographic Rules:**
- Use **Matter Variable Thin** for all text — do not mix font families
- Maintain consistent hierarchy: no more than 3-4 font sizes per screen
- Headings use bold (600-700), body uses regular (400)
- Line height: 1.5 for body text, 1.2 for headings
- Use color and opacity for secondary hierarchy, not additional font sizes


---

## 4. Component Stylings

### Data Input (1)

**Button** — `html`

### Media (2)

**Image** — `html`

**Icon** — `html`



---

## 5. Layout Principles

- **Base spacing unit:** 4px
- **Spacing scale:** 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24
- **Border radius:** inherit, 5px, 5.67px, 6px, 8px, 12px, 12px 12px 16px 16px, 14px, 16px, 16px 16px 28px 28px, 17px, 20px, 22px, 24px, 28px, 32px, 40px, 48px, 100%, 120px
- **Max content width:** 1199px

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

- `rgba(0, 0, 0, 0.12) 0px 0.83px 1px 0px`

### Raised — cards, buttons, interactive elements

- `rgba(0, 0, 0, 0.07) 0px 0.362176px 0.651917px -1.5px, rgba(0, 0, 0, 0.05) 0px 3px 5.4px -3px`

### Floating — dropdowns, popovers, modals

- `inset 0px 0px 12px 1px var(--token-748e9427-2299-40c6-98d4-e156257c2eac,#ffffff0f),inset 0px -4px 8px 0px #00000052`
- `0 0 0 1px #0000000f,0 1px 1px -.5px #0000000f,0 3px 3px -1.5px #0000000f,0 6px 6px -3px #0000000a,0 12px 12px -6px #00000014`
- `rgba(255, 255, 255, 0.16) 4px 4px 16px -4px inset, rgba(0, 0, 0, 0.2) -4px -4px 16px -4px inset, rgba(255, 255, 255, 0.08) 4px 4px 8px 0px inset, rgba(255, 255, 255, 0.4) 1px 1px 1px -0.5px inset`

### Overlay — full-screen overlays, top-level dialogs

- `0px 0px 8px 1px var(--token-748e9427-2299-40c6-98d4-e156257c2eac,#ffffff0f),0px .48175px .86715px -.5px #0000000f,0px 1.83083px 3.29549px -1px #00000014,0px 8px 14.4px -1.5px #00000024`
- `rgba(255, 255, 255, 0.16) 0px 24px 64px -12px inset, rgba(0, 0, 0, 0.16) 0px -24px 40px -12px inset, rgba(255, 255, 255, 0.16) 0px 0.636953px 1.14652px -0.5px inset, rgba(255, 255, 255, 0.17) 0px 1.9316px 3.47689px -1px inset, rgba(255, 255, 255, 0.19) 0px 5.10612px 9.19102px -1.5px inset, rgba(255, 255, 255, 0.24) 0px 16px 28.8px -2px inset`

### Z-Index Scale

`0, 1, 2, 3, 4, 5, 9, 10`



---

## 7. Animation & Motion

This project uses **subtle motion**. Transitions smooth state changes without demanding attention.

### Motion Guidelines

- Duration: 150-300ms for micro-interactions, 300-500ms for page transitions
- Easing: `ease-out` for enters, `ease-in` for exits
- Always respect `prefers-reduced-motion`


---

## 8. Do's and Don'ts

### Do's

- Use `#0000ee` for interactive elements (buttons, links, focus rings)
- Use `#ffffff` as the primary page background
- Use **Matter Variable Thin** for all UI text
- Follow the **4px** spacing grid for all margins, padding, and gaps
- Use the defined shadow tokens for elevation — see Section 6
- Use border-radius from the scale: inherit, 5px, 5.67px, 6px, 8px
- Reuse existing components from Section 4 before creating new ones

### Don'ts

- Don't introduce colors outside this palette — extend the design tokens first
- Don't mix font families — use Matter Variable Thin consistently
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
| lg | 809px | css |
| lg | 809.98px | css |
| lg | 810px | css |
| xl | 1199px | css |
| 2xl | 1439px | css |
| 2xl | 1439.98px | css |
| 2xl | 1440px | css |

**Approach:** Use `@media (min-width: ...)` queries matching the breakpoints above.


---

## 10. Agent Prompt Guide

Use these as starting points when building new UI:

### Build a Card

```
Background: #ffffff
Border: 1px solid var(--border)
Radius: 17px
Padding: 16px
Font: Matter Variable Thin
Use shadow tokens from Section 6.
```

### Build a Button

```
Primary: bg #0000ee, text white
Ghost: bg transparent, border var(--border)
Padding: 8px 16px
Radius: 17px
Hover: opacity 0.9 or lighter shade
Focus: ring with #0000ee
```

### Build a Page Layout

```
Background: #ffffff
Max-width: 1199px, centered
Grid: 4px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface: #ffffff
Label: #5979a6 (muted, 12px, uppercase)
Value: #000000 (primary, 24-32px, bold)
Status: use success/warning/danger from Section 2
```

### Build a Form

```
Input bg: #ffffff
Input border: 1px solid var(--border)
Focus: border-color #0000ee
Label: #5979a6 12px
Spacing: 16px between fields
Radius: 17px
```

### General Component

```
1. Read DESIGN.md Sections 2-6 for tokens
2. Colors: only from palette
3. Font: Matter Variable Thin, type scale from Section 3
4. Spacing: 4px grid
5. Components: match patterns from Section 4
6. Elevation: shadow tokens
```

## Visual Guide — Screenshots (VISUAL_GUIDE.md)

# copilot — Visual Guide

> Master visual reference. Study every screenshot carefully before implementing any UI.
> Match colors, layout, typography, spacing, and motion states exactly.

## Scroll Journey

The page has cinematic scroll animations. Each screenshot below shows the exact visual state at that scroll depth.
**Replicate these transitions precisely** — the design changes dramatically as you scroll.

### Hero — Above the fold

*Scroll position: 0px of 8777px total*

![Hero — Above the fold](../screens/scroll/scroll-000.png)

### 17% scroll depth

*Scroll position: 1339px of 8777px total*

![17% scroll depth](../screens/scroll/scroll-017.png)

### 33% scroll depth

*Scroll position: 2599px of 8777px total*

![33% scroll depth](../screens/scroll/scroll-033.png)

### 50% scroll depth

*Scroll position: 3939px of 8777px total*

![50% scroll depth](../screens/scroll/scroll-050.png)

### 67% scroll depth

*Scroll position: 5278px of 8777px total*

![67% scroll depth](../screens/scroll/scroll-067.png)

### 83% scroll depth

*Scroll position: 6538px of 8777px total*

![83% scroll depth](../screens/scroll/scroll-083.png)

### Footer — End of page

*Scroll position: 7877px of 8777px total*

![Footer — End of page](../screens/scroll/scroll-100.png)

## Full Page Screenshots

### Your money, beautifully organized | Copilot Money – Personal Finance App for Web, iPhone, Mac and iPad

*URL: `https://www.copilot.money/`*

![Your money, beautifully organized | Copilot Money – Personal Finance App for Web, iPhone, Mac and iPad](../screens/pages/home.png)

### Sign Up | Copilot Money – Personal Finance App for Web, iPhone, Mac and iPad

*URL: `https://www.copilot.money/sign-up`*

![Sign Up | Copilot Money – Personal Finance App for Web, iPhone, Mac and iPad](../screens/pages/sign-up.png)

### Download | Copilot Money – Personal Finance App for Web, iPhone, Mac and iPad

*URL: `https://www.copilot.money/download`*

![Download | Copilot Money – Personal Finance App for Web, iPhone, Mac and iPad](../screens/pages/download.png)

### About | Copilot Money – Personal Finance App for Web, iPhone, Mac and iPad

*URL: `https://www.copilot.money/about`*

![About | Copilot Money – Personal Finance App for Web, iPhone, Mac and iPad](../screens/pages/about.png)

### Careers | Copilot Money – Personal Finance App for Web, iPhone, Mac and iPad

*URL: `https://www.copilot.money/careers`*

![Careers | Copilot Money – Personal Finance App for Web, iPhone, Mac and iPad](../screens/pages/careers.png)

## Animations & Motion (ANIMATIONS.md)

# Animation Reference

> Cinematic motion design extracted from live DOM. Follow these specs exactly to recreate the experience.

## Motion Technology Stack

Pure CSS animations — no external animation libraries detected.

## Scroll Journey

The page is **8,777px** tall. Each frame below shows what the user sees at that scroll depth.

> **Use these screenshots to understand WHAT animates, WHEN it animates, and HOW it moves.**

### 0% — Top / Hero
Scroll position: 0px

![Scroll 0%](../screens/scroll/scroll-000.png)

### 17% — Opening Section
Scroll position: 1,339px

![Scroll 17%](../screens/scroll/scroll-017.png)

### 33% — First Feature Section
Scroll position: 2,599px

![Scroll 33%](../screens/scroll/scroll-033.png)

### 50% — Mid-Page
Scroll position: 3,939px

![Scroll 50%](../screens/scroll/scroll-050.png)

### 67% — Lower Content
Scroll position: 5,278px

![Scroll 67%](../screens/scroll/scroll-067.png)

### 83% — Near Footer
Scroll position: 6,538px

![Scroll 83%](../screens/scroll/scroll-083.png)

### 100% — Bottom / Footer
Scroll position: 7,877px

![Scroll 100%](../screens/scroll/scroll-100.png)

## Global Transition Declarations

These `transition` values were extracted from CSS rules across the site:

```css
transition: color 0.4s cubic-bezier(0.44, 0, 0.56, 1);
transition: opacity 0.4s ease-out;
transition: unset;
```

## How to Recreate This Motion Design

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

- **Duration scale:** `0.4s` — use these values, never invent new durations
- **Always add** `@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`

### Step 4 — Scroll Journey Reference

Match what happens at each scroll position:

- **0%** (`0px`) → `screens/scroll/scroll-000.png`
- **17%** (`1339px`) → `screens/scroll/scroll-017.png`
- **33%** (`2599px`) → `screens/scroll/scroll-033.png`
- **50%** (`3939px`) → `screens/scroll/scroll-050.png`
- **67%** (`5278px`) → `screens/scroll/scroll-067.png`
- **83%** (`6538px`) → `screens/scroll/scroll-083.png`
- **100%** (`7877px`) → `screens/scroll/scroll-100.png`

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

## Layout Rules

- **Container max-width:** `1200px` — always center with `margin: auto`
- Every spacing value must be a multiple of **4px**
- Never use arbitrary margin/padding values outside the spacing scale

## Component Patterns (COMPONENTS.md)

# Component Reference

> Repeated DOM patterns detected by structural analysis. Each component appeared 3+ times.

## Detected Components

| Component | Category | Instances | Key Classes |
|-----------|----------|-----------|-------------|
| **Framer Text** | unknown | 22× | `.framer-text` |
| **Framer Text** | unknown | 22× | `.framer-text` |
| **Framer 0BTje** | unknown | 14× | `.framer-0BTje`, `.framer-9qv9sm`, `.framer-v-9qv9sm` |
| **Framer 3lrlgo Container** | unknown | 14× | `.framer-3lrlgo-container` |
| **Framer Rw4ywu** | unknown | 14× | `.framer-rw4ywu` |
| **Framer Styles Preset 1oxr269** | unknown | 10× | `.framer-styles-preset-1oxr269`, `.framer-text` |
| **Framer 1746wg6** | unknown | 9× | `.framer-1746wg6` |
| **Framer 13womcw** | unknown | 9× | `.framer-13womcw` |
| **Framer Zg9d2t** | unknown | 9× | `.framer-zg9d2t` |
| **Framer 1dawl9c** | unknown | 5× | `.framer-1dawl9c` |
| **Framer 1b3onae** | unknown | 5× | `.framer-1b3onae` |
| **Framer Styles Preset 12dqiqe** | unknown | 5× | `.framer-styles-preset-12dqiqe`, `.framer-text` |
| **Framer 0A3RT** | unknown | 5× | `.framer-0A3RT`, `.framer-11vj6is`, `.framer-EwN1d` |
| **Framer 1s6m0dh** | unknown | 5× | `.framer-1s6m0dh` |
| **Framer Styles Preset Lnt6hx** | unknown | 4× | `.framer-styles-preset-lnt6hx`, `.framer-text` |
| **Framer Styles Preset Kbbyr6** | unknown | 4× | `.framer-styles-preset-kbbyr6`, `.framer-text` |
| **Framer Styles Preset Lnt6hx** | unknown | 4× | `.framer-styles-preset-lnt6hx`, `.framer-text` |
| **Framer 1bn9fda** | unknown | 3× | `.framer-1bn9fda` |
| **Framer Jd2jf9** | unknown | 3× | `.framer-jd2jf9` |
| **Framer 179f67z** | unknown | 3× | `.framer-179f67z`, `.framer-gui7r`, `.framer-v-179f67z` |

## Other Components

### Framer Text

**Instances found:** 22

**CSS classes:** `.framer-text`

**HTML structure:**

```html
<p class="framer-text" style="--font-selector:Q1VTVE9NVjI7TWF0dGVyLVRSSUFMIFNlbWlCb2xk;--framer-font-family:&quot;Matter-TRIAL SemiBold&quot;, sans-serif;--framer-font-size:28px;--framer-font-weight:670;--framer-letter-spacing:0.04em;--framer-line-height:100%;--framer-text-alignment:center;--framer-text-stroke-color:var(--extracted-1nvstw5, rgb(255, 255, 255));--framer-text-stroke-width:var(--extracted-1kkmzbh, 0.4px);--framer-text-transform:uppercase"><span data-text-fill="true" class="framer-text" style="background-image:linear-gradient(5deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 
```

**Base styles (from design tokens):**

```css
.framer-text {
  padding: 4px;
}```

### Framer Text

**Instances found:** 22

**CSS classes:** `.framer-text`

**HTML structure:**

```html
<span data-text-fill="true" class="framer-text" style="background-image:linear-gradient(5deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)">Baby</span>
```

**Base styles (from design tokens):**

```css
.framer-text {
  padding: 4px;
}```

### Framer 0BTje

**Instances found:** 14

**CSS classes:** `.framer-0BTje` `.framer-9qv9sm` `.framer-v-9qv9sm`

**HTML structure:**

```html
<div name="Baby" class="framer-0BTje framer-9qv9sm framer-v-9qv9sm" data-border="true" data-framer-name="Default" style="--border-bottom-width: 0.5px; --border-color: rgba(255, 255, 255, 0.24); --border-left-width: 0.5px; --border-right-width: 0.5px; --border-style: solid; --border-top-width: 0.5px; backdrop-filter: blur(6px); background-color: rgb(255, 51, 170); filter: blur(2px); border-radius: 40px; box-shadow: rgba(255, 255, 255, 0.16) 0px 24px 64px -12px inset, rgba(0, 0, 0, 0.16) 0px -24px 40px -12px inset, rgba(255, 255, 255, 0.16) 0px 0.636953px 1.14652px -0.5px inset, rgba(255, 255, 2
```

**Base styles (from design tokens):**

```css
.framer-0BTje {
  padding: 4px;
}```

### Framer 3lrlgo Container

**Instances found:** 14

**CSS classes:** `.framer-3lrlgo-container`

**HTML structure:**

```html
<div class="framer-3lrlgo-container" data-framer-name="Emoji" name="Emoji" style="opacity: 1;"><div name="Emoji" class="framer-4ITLy framer-1p986xo framer-v-14gjji7" data-framer-name="Bear" style="height: 100%; width: 100%; opacity: 1;"><div class="framer-15uyftl" data-framer-name="Bear" style="transform: translateY(-50%); opacity: 1;"><div style="position:absolute;border-radius:inherit;corner-shape:inherit;top:0;right:0;bottom:0;left:0" data-framer-background-image-wrapper="true"><img decoding="auto" width="671" height="889" sizes="(min-width: 1440px) calc(48px - 4px), (min-width: 810px) and 
```

**Base styles (from design tokens):**

```css
.framer-3lrlgo-container {
  padding: 4px;
}```

### Framer Rw4ywu

**Instances found:** 14

**CSS classes:** `.framer-rw4ywu`

**HTML structure:**

```html
<div class="framer-rw4ywu" data-framer-name="Label" data-framer-component-type="RichTextContainer" style="justify-content: center; --extracted-1kkmzbh: 0.4px; --extracted-1nvstw5: rgb(255, 255, 255); --framer-paragraph-spacing: 0px; transform: none; opacity: 1;"><p class="framer-text" style="--font-selector:Q1VTVE9NVjI7TWF0dGVyLVRSSUFMIFNlbWlCb2xk;--framer-font-family:&quot;Matter-TRIAL SemiBold&quot;, sans-serif;--framer-font-size:28px;--framer-font-weight:670;--framer-letter-spacing:0.04em;--framer-line-height:100%;--framer-text-alignment:center;--framer-text-stroke-color:var(--extracted-1nv
```

**Base styles (from design tokens):**

```css
.framer-rw4ywu {
  padding: 4px;
}```

### Framer Styles Preset 1oxr269

**Instances found:** 10

**CSS classes:** `.framer-styles-preset-1oxr269` `.framer-text`

**HTML structure:**

```html
<h3 class="framer-text framer-styles-preset-1oxr269" data-styles-preset="AaP2vWkfA">Know where your money goes</h3>
```

**Base styles (from design tokens):**

```css
.framer-styles-preset-1oxr269 {
  padding: 4px;
}```

### Framer 1746wg6

**Instances found:** 9

**CSS classes:** `.framer-1746wg6`

**HTML structure:**

```html
<div class="framer-1746wg6" data-border="true" data-framer-name="Borders – Light" style="--border-bottom-width: 1px; --border-color: var(--token-0c13141b-b1d7-49c9-87aa-1973fa797251, rgba(10, 14, 20, 0.06)); --border-left-width: 1px; --border-right-width: 1px; --border-style: solid; --border-top-width: 1px; mask: linear-gradient(340deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.75) 100%); border-radius: 24px; opacity: 1;"></div>
```

**Base styles (from design tokens):**

```css
.framer-1746wg6 {
  padding: 4px;
}```

### Framer 13womcw

**Instances found:** 9

**CSS classes:** `.framer-13womcw`

**HTML structure:**

```html
<div class="framer-13womcw" data-framer-name="Text" style="opacity: 1;"><div class="framer-zg9d2t" data-framer-name="Title" data-framer-component-type="RichTextContainer" style="--framer-paragraph-spacing: 0px; transform: none; opacity: 1;"><h3 class="framer-text framer-styles-preset-1oxr269" data-styles-preset="AaP2vWkfA">Know where your money goes</h3></div><div class="framer-1pt06gq" data-framer-name="Subtitle" data-framer-component-type="RichTextContainer" style="--framer-paragraph-spacing: 0px; transform: none; opacity: 1;"><p class="framer-text framer-styles-preset-10xey1b" data-styles-p
```

**Base styles (from design tokens):**

```css
.framer-13womcw {
  padding: 4px;
}```

### Framer Zg9d2t

**Instances found:** 9

**CSS classes:** `.framer-zg9d2t`

**HTML structure:**

```html
<div class="framer-zg9d2t" data-framer-name="Title" data-framer-component-type="RichTextContainer" style="--framer-paragraph-spacing: 0px; transform: none; opacity: 1;"><h3 class="framer-text framer-styles-preset-1oxr269" data-styles-preset="AaP2vWkfA">Know where your money goes</h3></div>
```

**Base styles (from design tokens):**

```css
.framer-zg9d2t {
  padding: 4px;
}```

### Framer 1dawl9c

**Instances found:** 5

**CSS classes:** `.framer-1dawl9c`

**HTML structure:**

```html
<div class="framer-1dawl9c" data-framer-name="Content" style="opacity: 1;"><div class="framer-1b3onae" data-framer-name="Label" data-framer-component-type="RichTextContainer" style="justify-content: center; --extracted-r6o4lv: rgba(255, 255, 255, 0.6); --framer-paragraph-spacing: 0px; backdrop-filter: blur(6px); transform: none; opacity: 1;"><p class="framer-text" style="--font-selector:Q1VTVE9NVjI7Sm9ra2VyIE1lZGl1bQ==;--framer-font-family:&quot;Jokker Medium&quot;, &quot;Jokker Medium Placeholder&quot;, sans-serif;--framer-font-size:12px;--framer-font-weight:500;--framer-line-height:120%;--fr
```

**Base styles (from design tokens):**

```css
.framer-1dawl9c {
  padding: 4px;
}```

### Framer 1b3onae

**Instances found:** 5

**CSS classes:** `.framer-1b3onae`

**HTML structure:**

```html
<div class="framer-1b3onae" data-framer-name="Label" data-framer-component-type="RichTextContainer" style="justify-content: center; --extracted-r6o4lv: rgba(255, 255, 255, 0.6); --framer-paragraph-spacing: 0px; backdrop-filter: blur(6px); transform: none; opacity: 1;"><p class="framer-text" style="--font-selector:Q1VTVE9NVjI7Sm9ra2VyIE1lZGl1bQ==;--framer-font-family:&quot;Jokker Medium&quot;, &quot;Jokker Medium Placeholder&quot;, sans-serif;--framer-font-size:12px;--framer-font-weight:500;--framer-line-height:120%;--framer-text-alignment:center;--framer-text-color:var(--extracted-r6o4lv, rgba
```

**Base styles (from design tokens):**

```css
.framer-1b3onae {
  padding: 4px;
}```

### Framer Styles Preset 12dqiqe

**Instances found:** 5

**CSS classes:** `.framer-styles-preset-12dqiqe` `.framer-text`

**HTML structure:**

```html
<h2 class="framer-text framer-styles-preset-12dqiqe" data-styles-preset="CgSy_fpJx">Track your spending, boost your savings</h2>
```

**Base styles (from design tokens):**

```css
.framer-styles-preset-12dqiqe {
  padding: 4px;
}```

### Framer 0A3RT

**Instances found:** 5

**CSS classes:** `.framer-0A3RT` `.framer-11vj6is` `.framer-EwN1d` `.framer-V3DgT` `.framer-qeYQH` `.framer-v-9zs0wr`

**HTML structure:**

```html
<div class="framer-qeYQH framer-EwN1d framer-V3DgT framer-0A3RT framer-11vj6is framer-v-9zs0wr" data-framer-name="Categories 2x1" style="backdrop-filter: blur(12px); background: radial-gradient(79% 75% at 79% 82.5%, rgb(0, 15, 36) 0%, rgb(0, 13, 31) 100%); width: 100%; border-radius: 24px; box-shadow: none; opacity: 1;"><div class="framer-1s6m0dh" data-border="true" data-framer-name="Borders – Dark" style="--border-bottom-width: 1px; --border-color: var(--token-617ebe1f-8369-4b89-bb0f-d1dbd6f18add, rgba(51, 136, 255, 0.16)); --border-left-width: 1px; --border-right-width: 1px; --border-style: 
```

**Base styles (from design tokens):**

```css
.framer-0A3RT {
  padding: 4px;
}```

### Framer 1s6m0dh

**Instances found:** 5

**CSS classes:** `.framer-1s6m0dh`

**HTML structure:**

```html
<div class="framer-1s6m0dh" data-border="true" data-framer-name="Borders – Dark" style="--border-bottom-width: 1px; --border-color: var(--token-617ebe1f-8369-4b89-bb0f-d1dbd6f18add, rgba(51, 136, 255, 0.16)); --border-left-width: 1px; --border-right-width: 1px; --border-style: solid; --border-top-width: 1px; mask: linear-gradient(315deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.55) 50.3836%, rgb(0, 0, 0) 100%); border-radius: 24px; opacity: 1;"></div>
```

**Base styles (from design tokens):**

```css
.framer-1s6m0dh {
  padding: 4px;
}```

### Framer Styles Preset Lnt6hx

**Instances found:** 4

**CSS classes:** `.framer-styles-preset-lnt6hx` `.framer-text`

**HTML structure:**

```html
<p class="framer-text framer-styles-preset-lnt6hx" data-styles-preset="qkiMH0crZ" dir="auto" style="--framer-text-color:var(--extracted-r6o4lv, var(--token-6c739b43-e488-44bc-9172-83a9051fc8b3, rgba(255, 255, 255, 0.9)))"><!--$--><a class="framer-text framer-styles-preset-kbbyr6" data-styles-preset="IP9FVj8JX" href="./#features-dark">Features</a><!--/$--></p>
```

**Base styles (from design tokens):**

```css
.framer-styles-preset-lnt6hx {
  padding: 4px;
}```

### Framer Styles Preset Kbbyr6

**Instances found:** 4

**CSS classes:** `.framer-styles-preset-kbbyr6` `.framer-text`

**HTML structure:**

```html
<a class="framer-text framer-styles-preset-kbbyr6" data-styles-preset="IP9FVj8JX" href="./#features-dark">Features</a>
```

**Base styles (from design tokens):**

```css
.framer-styles-preset-kbbyr6 {
  padding: 4px;
}```

### Framer Styles Preset Lnt6hx

**Instances found:** 4

**CSS classes:** `.framer-styles-preset-lnt6hx` `.framer-text`

**HTML structure:**

```html
<p class="framer-text framer-styles-preset-lnt6hx" data-styles-preset="qkiMH0crZ" style="--framer-text-color:var(--extracted-r6o4lv, var(--token-52cb9075-b104-4670-bb51-13204c74b2cc, rgb(17, 38, 59)))">Get started</p>
```

**Base styles (from design tokens):**

```css
.framer-styles-preset-lnt6hx {
  padding: 4px;
}```

### Framer 1bn9fda

**Instances found:** 3

**CSS classes:** `.framer-1bn9fda`

**HTML structure:**

```html
<div class="framer-1bn9fda" data-framer-name="Inner" style="background: linear-gradient(rgb(26, 102, 255) 0%, rgb(26, 102, 255) 100%) rgb(26, 102, 255); border-radius: 20px; box-shadow: rgba(255, 255, 255, 0.16) 4px 4px 16px -4px inset, rgba(0, 0, 0, 0.2) -4px -4px 16px -4px inset, rgba(255, 255, 255, 0.08) 4px 4px 8px 0px inset, rgba(255, 255, 255, 0.4) 1px 1px 1px -0.5px inset; opacity: 1;"><div class="framer-18ilz1e" data-framer-name="Brand mark" style="border-radius: 6.8px; box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 1px 0px; opacity: 1;"><div class="framer-iyqnbk" data-border="true" data-fram
```

**Base styles (from design tokens):**

```css
.framer-1bn9fda {
  padding: 4px;
}```

### Framer Jd2jf9

**Instances found:** 3

**CSS classes:** `.framer-jd2jf9`

**HTML structure:**

```html
<div class="framer-jd2jf9" data-framer-name="Label" data-framer-component-type="RichTextContainer" style="justify-content: center; --extracted-1kkmzbh: 0.2px; --extracted-1nvstw5: rgb(255, 255, 255); --extracted-r6o4lv: rgb(255, 255, 255); --framer-paragraph-spacing: 0px; transform: none; opacity: 1;"><p class="framer-text" style="--font-selector:Q1VTVE9NO0pva2tlciBNZWRpdW0=;--framer-font-family:&quot;Jokker Medium&quot;, &quot;Jokker Medium Placeholder&quot;, sans-serif;--framer-font-size:24px;--framer-font-weight:500;--framer-line-height:24px;--framer-text-alignment:center;--framer-text-colo
```

**Base styles (from design tokens):**

```css
.framer-jd2jf9 {
  padding: 4px;
}```

### Framer 179f67z

**Instances found:** 3

**CSS classes:** `.framer-179f67z` `.framer-gui7r` `.framer-v-179f67z`

**HTML structure:**

```html
<div class="framer-gui7r framer-179f67z framer-v-179f67z" data-framer-name="Default" style="width: 100%; opacity: 1;"><div data-framer-component-type="SVG" data-framer-name="Left" parentsize="0" _constraints="[object Object]" rotation="0" shadows="" class="framer-l14zmo" aria-hidden="true" style="image-rendering: pixelated; flex-shrink: 0; background-size: 100% 100%; background-image: url(&quot;data:image/svg+xml,&lt;svg xmlns=%22http://www.w3.org/2000/svg%22 xmlns:xlink=%22http://www.w3.org/1999/xlink%22 viewBox=%220 0 31.103 64.085%22 overflow=%22visible%22&gt;&lt;g&gt;&lt;defs&gt;&lt;linear
```

**Base styles (from design tokens):**

```css
.framer-179f67z {
  padding: 4px;
}```

## Component Rules

- Match class names exactly from the patterns above
- Each component instance must be visually identical to others of its type
- Do not add extra wrappers or change the DOM structure
- Use `#0000ee` for all interactive/active states

## Interactions & States (INTERACTIONS.md)

# Interaction Reference

> Micro-interactions extracted from live DOM. Recreate these exactly for authentic feel.

## Coverage

| Component Type | Count | States Captured |
|----------------|-------|----------------|
| Link | 3 | default, hover, focus |

## Transition System

These transition declarations were extracted from interactive elements:

```css
transition: all;
transition: color 0.4s cubic-bezier(0.44, 0, 0.56, 1);
```

Apply these to all interactive elements. Never invent new durations or easings.

## Link Interactions

### Link 1 — `a`

**States:**

- Default: `../screens/states/link-1-default.png`
- Hover: `../screens/states/link-1-hover.png`
- Focus: `../screens/states/link-1-focus.png`

**On focus:**

```css
/* outline: rgb(0, 0, 238) none 3px → */ outline: rgb(16, 16, 16) auto 1px;
/* outline-color: rgb(0, 0, 238) → */ outline-color: rgb(16, 16, 16);
```

**Transition:** `all`

### Link 2 — `Features`

**States:**

- Default: `../screens/states/link-2-default.png`
- Hover: `../screens/states/link-2-hover.png`
- Focus: `../screens/states/link-2-focus.png`

**On hover:**

```css
/* color: rgba(255, 255, 255, 0.9) → */ color: rgba(108, 139, 180, 0.99);
/* border-color: rgba(255, 255, 255, 0.9) → */ border-color: rgba(108, 139, 180, 0.99);
/* outline: rgba(255, 255, 255, 0.9) none 3px → */ outline: rgba(108, 139, 180, 0.99) none 3px;
/* outline-color: rgba(255, 255, 255, 0.9) → */ outline-color: rgba(108, 139, 180, 0.99);
```

**On focus:**

```css
/* outline: rgba(255, 255, 255, 0.9) none 3px → */ outline: rgb(16, 16, 16) auto 1px;
/* outline-color: rgba(255, 255, 255, 0.9) → */ outline-color: rgb(16, 16, 16);
```

**Transition:** `color 0.4s cubic-bezier(0.44, 0, 0.56, 1)`

### Link 3 — `Pricing`

**States:**

- Default: `../screens/states/link-3-default.png`
- Hover: `../screens/states/link-3-hover.png`
- Focus: `../screens/states/link-3-focus.png`

**On hover:**

```css
/* color: rgba(255, 255, 255, 0.9) → */ color: rgba(108, 139, 180, 0.99);
/* border-color: rgba(255, 255, 255, 0.9) → */ border-color: rgba(108, 139, 180, 0.99);
/* outline: rgba(255, 255, 255, 0.9) none 3px → */ outline: rgba(108, 139, 180, 0.99) none 3px;
/* outline-color: rgba(255, 255, 255, 0.9) → */ outline-color: rgba(108, 139, 180, 0.99);
```

**On focus:**

```css
/* outline: rgba(255, 255, 255, 0.9) none 3px → */ outline: rgb(16, 16, 16) auto 1px;
/* outline-color: rgba(255, 255, 255, 0.9) → */ outline-color: rgb(16, 16, 16);
```

**Transition:** `color 0.4s cubic-bezier(0.44, 0, 0.56, 1)`

## Interaction Rules

- Accent color `#0000ee` is used for focus rings, active states, and hover highlights
- Hover effects include **color transitions** — use the extracted values, not approximations
- Focus states use **outline** (not box-shadow) — always match the extracted focus ring
- Transition durations in use: `0.4s`
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
      "name": "framer-text-color"
    },
    "background": {
      "value": "#ffffff",
      "role": "background",
      "name": "border-color"
    },
    "text-muted": {
      "value": "#5979a6",
      "role": "text-muted"
    },
    "accent": {
      "value": "#0000ee",
      "role": "accent"
    }
  },
  "status": {
    "warning": {
      "value": "#f27f0c",
      "role": "warning"
    },
    "success": {
      "value": "#03c749",
      "role": "success"
    },
    "danger": {
      "value": "#ff4433",
      "role": "danger"
    }
  },
  "extended": {
    "framer-link-text-color": {
      "value": "#0099ff",
      "role": "info",
      "name": "framer-link-text-color"
    },
    "color-11263b": {
      "value": "#11263b",
      "role": "unknown"
    },
    "color-031835": {
      "value": "#031835",
      "role": "unknown"
    },
    "color-000814": {
      "value": "#000814",
      "role": "unknown"
    },
    "color-5e85ba": {
      "value": "#5e85ba",
      "role": "unknown"
    },
    "border-color": {
      "value": "#1c6cff",
      "role": "unknown",
      "name": "border-color"
    },
    "color-7f8ba4": {
      "value": "#7f8ba4",
      "role": "unknown"
    },
    "color-000f24": {
      "value": "#000f24",
      "role": "unknown"
    },
    "color-00204d": {
      "value": "#00204d",
      "role": "unknown"
    },
    "color-e1b321": {
      "value": "#e1b321",
      "role": "unknown"
    },
    "color-94ae43": {
      "value": "#94ae43",
      "role": "unknown"
    },
    "color-00acfe": {
      "value": "#00acfe",
      "role": "unknown"
    }
  },
  "meta": {
    "theme": "light",
    "extracted": "2026-10-18"
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
    "Matter Variable Thin",
    "Fragment Mono"
  ],
  "scale": {
    "heading-1": {
      "fontFamily": "Matter Variable Thin",
      "fontSize": "calc(var(--framer-blockquote-font-size,var(--framer-font-size,16px))*var(--framer-font-size-scale,1))",
      "fontWeight": "700",
      "lineHeight": null,
      "source": "css"
    },
    "heading-2": {
      "fontFamily": "Matter Variable Thin",
      "fontSize": "calc(var(--framer-link-hover-font-size,var(--framer-blockquote-font-size,var(--framer-font-size,16px)))*var(--framer-font-size-scale,1))",
      "fontWeight": "700",
      "lineHeight": null,
      "source": "css"
    },
    "heading-3": {
      "fontFamily": "Matter Variable Thin",
      "fontSize": "calc(var(--framer-link-current-font-size,var(--framer-link-font-size,var(--framer-font-size,16px)))*var(--framer-font-size-scale,1))",
      "fontWeight": "700",
      "lineHeight": null,
      "source": "css"
    },
    "body": {
      "fontFamily": "Fragment Mono",
      "fontSize": "calc(var(--framer-link-hover-font-size,var(--framer-link-current-font-size,var(--framer-link-font-size,var(--framer-font-size,16px))))*var(--framer-font-size-scale,1))",
      "fontWeight": "400",
      "lineHeight": null,
      "source": "css"
    },
    "caption": {
      "fontFamily": "Fragment Mono",
      "fontSize": "var(--framer-font-size,16px)",
      "fontWeight": "400",
      "lineHeight": null,
      "source": "css"
    },
    "code": {
      "fontFamily": "Fragment Mono",
      "fontSize": "14px",
      "fontWeight": "400",
      "lineHeight": null,
      "source": "css"
    }
  },
  "fontFaces": [
    {
      "family": "Fragment Mono",
      "src": "https://fonts.gstatic.com/s/fragmentmono/v6/4iCr6K5wfMRRjxp0DA6-2CLnN4FNh4UI_1U.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Matter Variable Thin",
      "src": "https://framerusercontent.com/assets/FkkmJUFrC7WkrdO8JwWOZk6ZsTQ.woff2",
      "format": "woff2",
      "weight": "100"
    },
    {
      "family": "Matter Regular",
      "src": "https://framerusercontent.com/assets/3121Tsk68mHZwJJf1twQpB418.woff2",
      "format": "woff2",
      "weight": "430"
    },
    {
      "family": "Matter SemiBold",
      "src": "https://framerusercontent.com/assets/ODEa6AVNH3HOjTVde2fZEWKVVao.woff2",
      "format": "woff2",
      "weight": "670"
    },
    {
      "family": "Matter SemiBold Italic",
      "src": "https://framerusercontent.com/assets/z2d2DZivK0FnfQzrndQMW25XaKk.woff2",
      "format": "woff2",
      "weight": "670"
    },
    {
      "family": "Matter Regular Italic",
      "src": "https://framerusercontent.com/assets/FEOb6tEHtv7mJtgeY76ORnFwrwE.woff2",
      "format": "woff2",
      "weight": "430"
    },
    {
      "family": "Matter Medium",
      "src": "https://framerusercontent.com/assets/zhl7xb7lRo26db3SQvE84y4ccA0.woff2",
      "format": "woff2",
      "weight": "570"
    },
    {
      "family": "Matter Heavy",
      "src": "https://framerusercontent.com/assets/qhpNTLnb5Ydq6UHByXocuchCno.woff2",
      "format": "woff2",
      "weight": "900"
    },
    {
      "family": "Matter Heavy Italic",
      "src": "https://framerusercontent.com/assets/3cyb1nnKG1n0E4IW0OZ5AcQk8.woff2",
      "format": "woff2",
      "weight": "900"
    },
    {
      "family": "Matter Medium Italic",
      "src": "https://framerusercontent.com/assets/dSMkls66XYp3orjc7LvpLGuk.woff2",
      "format": "woff2",
      "weight": "570"
    },
    {
      "family": "Jokker Regular",
      "src": "https://framerusercontent.com/assets/pc8NgKtLqbWU3UUQJobBhDZluM.woff2",
      "format": "woff2",
      "weight": "400"
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
      "family": "Jokker Semibold",
      "src": "https://framerusercontent.com/assets/titenLuGocWoKtfsJtx6dXLuioM.woff2",
      "format": "woff2",
      "weight": "600"
    },
    {
      "family": "Matter-TRIAL SemiBold",
      "src": "https://framerusercontent.com/assets/tcL1TKBrmy376sZHKZZcVZDQWgQ.woff2",
      "format": "woff2",
      "weight": "670"
    },
    {
      "family": "Jokker Medium",
      "src": "https://framerusercontent.com/assets/MIJfOnqlX0RU6hcUu7Aq1Lh6rI.woff2",
      "format": "woff2",
      "weight": "500"
    },
    {
      "family": "Jokker Heavy",
      "src": "https://framerusercontent.com/assets/3BD77a3vAB7GCb5MMHcO0BtNXj8.woff2",
      "format": "woff2",
      "weight": "900"
    },
    {
      "family": "Jokker Bold Italic",
      "src": "https://framerusercontent.com/assets/aWUJbw5D0BgOrCLOpwvuTjMQMg.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "Jokker Bold",
      "src": "https://framerusercontent.com/assets/23QdaMnjgN1gbGPQPLvn68IXZQ.woff2",
      "format": "woff2",
      "weight": "700"
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
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/5A3Ce6C9YYmCjpQx9M4inSaKU.woff2",
      "format": "woff2",
      "weight": "500"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/Qx95Xyt0Ka3SGhinnbXIGpEIyP4.woff2",
      "format": "woff2",
      "weight": "500"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/6mJuEAguuIuMog10gGvH5d3cl8.woff2",
      "format": "woff2",
      "weight": "500"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/xYYWaj7wCU5zSQH0eXvSaS19wo.woff2",
      "format": "woff2",
      "weight": "500"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/otTaNuNpVK4RbdlT7zDDdKvQBA.woff2",
      "format": "woff2",
      "weight": "500"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/UjlFhCnUjxhNfep4oYBPqnEssyo.woff2",
      "format": "woff2",
      "weight": "500"
    },
    {
      "family": "Inter",
      "src": "https://framerusercontent.com/assets/DolVirEGb34pEXEp8t8FQBSK4.woff2",
      "format": "woff2",
      "weight": "500"
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

- `fonts/FragmentMono-Regular.ttf`
- `fonts/Inter-Black.ttf`
- `fonts/Inter-Bold.ttf`
- `fonts/Inter-ExtraBold.ttf`
- `fonts/Inter-ExtraLight.ttf`
- `fonts/Inter-Light.ttf`
- `fonts/Inter-Medium.ttf`
- `fonts/Inter-Regular.ttf`
- `fonts/Inter-SemiBold.ttf`
- `fonts/Inter-Thin.ttf`
- `fonts/JokkerBold-700.woff2`
- `fonts/JokkerBoldItalic-700.woff2`
- `fonts/JokkerHeavy-900.woff2`
- `fonts/JokkerMedium-500.woff2`
- `fonts/JokkerRegular-Regular.woff2`
- `fonts/JokkerSemibold-600.woff2`
- `fonts/Matter-TRIALSemiBold-670.woff2`
- `fonts/MatterHeavy-900.woff2`
- `fonts/MatterHeavyItalic-900.woff2`
- `fonts/MatterMedium-570.woff2`
- `fonts/MatterMediumItalic-570.woff2`
- `fonts/MatterRegular-430.woff2`
- `fonts/MatterRegularItalic-430.woff2`
- `fonts/MatterSemiBold-670.woff2`
- `fonts/MatterSemiBoldItalic-670.woff2`
- `fonts/MatterVariableThin-100.woff2`

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

![about.png](screens/pages/about.png)

![careers.png](screens/pages/careers.png)

![download.png](screens/pages/download.png)

![home.png](screens/pages/home.png)

![sign-up.png](screens/pages/sign-up.png)

### Interaction States (screens/states/)

*Hover, focus, and active state captures*

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
| 17% | 1339px | `screens/scroll/scroll-017.png` |
| 33% | 2599px | `screens/scroll/scroll-033.png` |
| 50% | 3939px | `screens/scroll/scroll-050.png` |
| 67% | 5278px | `screens/scroll/scroll-067.png` |
| 83% | 6538px | `screens/scroll/scroll-083.png` |
| 100% | 7877px | `screens/scroll/scroll-100.png` |

## Pages

| Page | URL | File |
|------|-----|------|
| Your money, beautifully organized | Copilot Money – Personal Finance App for Web, iPhone, Mac and iPad | `https://www.copilot.money/` | `screens/pages/home.png` |
| Sign Up | Copilot Money – Personal Finance App for Web, iPhone, Mac and iPad | `https://www.copilot.money/sign-up` | `screens/pages/sign-up.png` |
| Download | Copilot Money – Personal Finance App for Web, iPhone, Mac and iPad | `https://www.copilot.money/download` | `screens/pages/download.png` |
| About | Copilot Money – Personal Finance App for Web, iPhone, Mac and iPad | `https://www.copilot.money/about` | `screens/pages/about.png` |
| Careers | Copilot Money – Personal Finance App for Web, iPhone, Mac and iPad | `https://www.copilot.money/careers` | `screens/pages/careers.png` |

## Homepage Screenshots (screenshots/)

![homepage.png](screenshots/homepage.png)

