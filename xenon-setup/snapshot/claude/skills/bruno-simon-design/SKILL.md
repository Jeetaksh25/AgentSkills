---
name: bruno-simon-design
description: Design system skill for bruno-simon. Activate when building UI components, pages, or any visual elements. Provides exact color tokens, typography scale, spacing grid, component patterns, and craft rules. Read references/DESIGN.md before writing any CSS or JSX.
---

# bruno-simon Design System

You are building UI for **bruno-simon**. Light-themed, warm palette, sans-serif typography (Pally-Regular), standard density on a 5px grid.

## Visual Reference

**IMPORTANT**: Study ALL screenshots below before writing any UI. Match colors, typography, spacing, layout, and motion exactly as shown.

### Homepage

![bruno-simon Homepage](screenshots/homepage.png)

> Read `references/DESIGN.md` for full token details.

## Design Philosophy

- **Layered depth** — use shadow tokens to create a sense of physical layering. Each elevation level has a specific shadow.
- **Gradient accents** — gradients are used thoughtfully for emphasis, not decoration.
- **Type pairing** — Pally-Regular for body/UI text, Nunito for headings/display. Never introduce a third typeface.
- **standard density** — 5px base grid. Every dimension is a multiple of 5.
- **warm palette** — the color temperature runs warm, matching the sans-serif typography.
- **Restrained accent** — `#d5ff95` is the only pop of color. Used exclusively for CTAs, links, focus rings, and active states.
- **Subtle motion** — transitions smooth state changes. Keep durations under 300ms, use ease-out curves.

## Color System

### Core Palette

| Role | Token | Hex | Use |
|------|-------|-----|-----|
| Background | `--background` | `#ffffff` | Page/app background |
| Surface | `--surface` | `#ffceca` | Cards, panels, modals |
| Text Primary | `--text-primary` | `#251f2b` | Headings, body text |
| Text Muted | `--text-muted` | `#555555` | Captions, placeholders |
| Accent | `--accent` | `#d5ff95` | CTAs, links, focus rings |
| Border | `--border` | `#1d1721` | Dividers, card borders |

### Status Colors

| Status | Hex | Use |
|--------|-----|-----|
| Warning | `#ffc67b` | Caution states, pending items |
| Danger | `#c21515` | Errors, destructive actions |

### Extended Palette

- `#46123b`
- `#ff6a7c`
- `#141414` — Deep background layer or shadow color
- `#ff87a2`
- `#cccccc`
- `#000000` — Deep background layer or shadow color

## Typography

### Font Stack

- **Pally-Regular** — Heading 1, Heading 2, Heading 3
- **Nunito** — Body, Caption

### Font Sources

```css
@font-face {
  font-family: "Pally-Regular";
  src: url("fonts/Pally-Regular-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Pally-Medium";
  src: url("fonts/Pally-Medium-500.woff2") format("woff2");
  font-weight: 500;
}
@font-face {
  font-family: "Pally-Bold";
  src: url("fonts/Pally-Bold-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "Amatic SC";
  src: url("fonts/AmaticSC-Bold.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "Amatic SC";
  src: url("fonts/AmaticSC-Regular.ttf") format("truetype");
  font-weight: 400;
}
@font-face {
  font-family: "Nunito";
  src: url("fonts/Nunito-Bold.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "Nunito";
  src: url("fonts/Nunito-Regular.ttf") format("truetype");
  font-weight: 400;
}
```

### Type Scale

| Role | Family | Size | Weight |
|------|--------|------|--------|
| Heading 1 | Pally-Regular | 64px | 700 |
| Heading 2 | Pally-Regular | 48px | 700 |
| Heading 3 | Pally-Regular | 2.5rem | 700 |
| Body | Nunito | 16px | 400 |
| Caption | Nunito | 20px | 400 |

### Typography Rules

- Body/UI: **Pally-Regular**, Headings: **Nunito** — these are the only display fonts
- Max 3-4 font sizes per screen
- Headings: weight 600-700, body: weight 400
- Use color and opacity for text hierarchy, not additional font sizes
- Line height: 1.5 for body, 1.2 for headings

## Spacing & Layout

### Base Grid: 5px

Every dimension (margin, padding, gap, width, height) must be a multiple of **5px**.

### Spacing Scale

`5, 10, 15, 20, 25, 30, 35, 40, 50, 70, 80` px

### Spacing as Meaning

| Spacing | Use |
|---------|-----|
| 2.5-5px | Tight: related items within a group |
| 10px | Medium: between groups |
| 15-20px | Wide: between sections |
| 30px+ | Vast: major section breaks |

### Border Radius

Scale: `4px, 6px, 8px, 15px`
Default: `8px`

### Container

Max-width: `1100px`, centered with auto margins.

### Breakpoints

| Name | Value |
|------|-------|
| xs | 360px |
| xs | 440px |
| sm | 520px |
| lg | 800px |
| lg | 870px |
| xl | 1100px |

Mobile-first: design for small screens, layer on responsive overrides.

## Component Patterns

### Card

```css
.card {
  background: #ffceca;
  border: 1px solid #1d1721;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 0 4px #251f2b77;
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
  background: #d5ff95;
  color: #251f2b;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 500;
  transition: opacity 150ms ease;
}
.btn-primary:hover { opacity: 0.9; }

/* Ghost */
.btn-ghost {
  background: transparent;
  border: 1px solid #1d1721;
  color: #251f2b;
  border-radius: 8px;
  padding: 10px 20px;
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
  border: 1px solid #1d1721;
  border-radius: 8px;
  padding: 10px 15px;
  color: #251f2b;
  font-size: 14px;
}
.input:focus { border-color: #d5ff95; outline: none; }
```

```html
<input class="input" type="text" placeholder="Search..." />
```

### Badge / Chip

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  background: #ffceca;
  color: #555555;
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
  background: #ffceca;
  border: 1px solid #1d1721;
  border-radius: 15px;
  padding: 30px;
  max-width: 480px;
  width: 90vw;
  box-shadow: 0 0 4px #0007;
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
  padding: 10px 15px;
  font-weight: 500;
  font-size: 12px;
  color: #555555;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #1d1721;
}
.table td {
  padding: 15px;
  border-bottom: 1px solid #1d1721;
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
  gap: 10px;
  padding: 15px 20px;
  border-bottom: 1px solid #1d1721;
}
.nav-link {
  color: #555555;
  padding: 10px 15px;
  border-radius: 8px;
  transition: color 150ms;
}
.nav-link:hover { color: #251f2b; }
.nav-link.active { color: #d5ff95; }
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

## Page Structure

The following page sections were detected:

- **Hero** — Hero section (detected from heading structure)

When building pages, follow this section order and structure.

## Animation & Motion

This project uses **subtle motion**. Transitions smooth state changes without calling attention.

### CSS Animations

- `map-player-animation`

### Motion Tokens

- **Duration scale:** `.45s`, `100ms`, `150ms`, `300ms`, `600ms`
- **Easing functions:** `cubic-bezier(.4,1.6,.65,1)`, `cubic-bezier(.42,0,.47,-.55)`, `cubic-bezier(.49,2.2,.53,.75)`, `cubic-bezier(.65,-1,.45,1)`
- **Animated properties:** `opacity`

### Motion Guidelines

- **Duration:** Use values from the duration scale above. Short (.45s) for micro-interactions, long (600ms) for page transitions
- **Easing:** Use `cubic-bezier(.4,1.6,.65,1)` as the default easing curve
- **Direction:** Elements enter from bottom/right, exit to top/left
- **Reduced motion:** Always respect `prefers-reduced-motion` — disable animations when set

## Depth & Elevation

### Shadow Tokens

- Raised (cards, buttons): `0 0 4px #251f2b77`
- Raised (cards, buttons): `0 0 4px #0007`

### Z-Index Scale

`1, 9`

Use these exact values — never invent z-index values.

## Anti-Patterns (Never Do)

- **No blur effects** — no backdrop-blur, no filter: blur()
- **No zebra striping** — tables and lists use borders for separation
- **No invented colors** — every hex value must come from the palette above
- **No arbitrary spacing** — every dimension is a multiple of 5px
- **No extra fonts** — only Pally-Regular and Nunito are allowed
- **No arbitrary border-radius** — use the scale: 4px, 6px, 8px, 15px
- **No opacity for disabled states** — use muted colors instead
- **No pill shapes** — this design doesn't use rounded-full / 9999px radius

## Workflow

1. **Read** `references/DESIGN.md` before writing any UI code
2. **Pick colors** from the Color System section — never invent new ones
3. **Set typography** — Pally-Regular, Nunito only, using the type scale
4. **Build layout** on the 5px grid — check every margin, padding, gap
5. **Match components** to patterns above before creating new ones
6. **Apply elevation** — use shadow tokens
7. **Validate** — every value traces back to a design token. No magic numbers.

## Brand Spec

- **Favicon:** `./favicons/favicon-96x96.png`
- **Site URL:** `https://bruno-simon.com/`
- **Brand color:** `#d5ff95`
- **Brand typeface:** Pally-Regular

## Quick Reference

```
Background:     #ffffff
Surface:        #ffceca
Text:           #251f2b / #555555
Accent:         #d5ff95
Border:         #1d1721
Font:           Pally-Regular
Spacing:        5px grid
Radius:         8px
Components:     8 detected
```

## When to Trigger

Activate this skill when:
- Creating new components, pages, or visual elements for bruno-simon
- Writing CSS, Tailwind classes, styled-components, or inline styles
- Building page layouts, templates, or responsive designs
- Reviewing UI code for design consistency
- The user mentions "bruno-simon" design, style, UI, or theme
- Generating mockups, wireframes, or visual prototypes

---

# Full Reference Files

> Every output file is embedded below. Claude has full design system context from /skills alone.

## Design System Tokens (DESIGN.md)

# bruno-simon DESIGN.md

> Auto-generated design system — reverse-engineered via static analysis by skillui.
> Frameworks: None detected
> Colors: 14 · Fonts: 2 · Components: 8
> Icon library: not detected · State: not detected
> Primary theme: light · Dark mode toggle: no · Motion: subtle

## Visual Reference

**Match this design exactly** — study colors, fonts, spacing, and component shapes before writing any UI code.

![bruno-simon Homepage](../screenshots/homepage.png)

---

## 1. Visual Theme & Atmosphere

This is a **light-themed** interface with a warm, approachable feel. The light background emphasizes content clarity. Typography pairs **Nunito** for display/headings with **Pally-Regular** for body text, creating clear visual hierarchy through type contrast. Spacing follows a **5px base grid** (standard density), with scale: 5, 10, 15, 20, 25, 30, 35, 40px. The palette is predominantly monochromatic with **#d5ff95** as the single accent color — used sparingly for interactive elements and emphasis. Motion is subtle — smooth transitions (150-300ms) ease state changes without drawing attention.

---

## 2. Color Palette & Roles

| Token | Hex | Role | Use |
|---|---|---|---|
| background | `#ffffff` | background | Page background, darkest surface |
| surface | `#ffceca` | surface | Card and panel backgrounds |
| text-primary | `#251f2b` | text-primary | Headings and body text |
| text-muted | `#555555` | text-muted | Captions, placeholders, secondary info |
| border | `#1d1721` | border | Dividers, card borders, outlines |
| accent | `#d5ff95` | accent | CTAs, links, focus rings, active states |
| danger | `#c21515` | danger | Error states, destructive actions |
| warning | `#ffc67b` | warning | Warning states, caution indicators |
| unknown | `#46123b` | unknown | Palette color |
| unknown | `#ff6a7c` | unknown | Palette color |
| unknown | `#141414` | unknown | Palette color |
| unknown | `#ff87a2` | unknown | Palette color |
| unknown | `#cccccc` | unknown | Palette color |
| unknown | `#000000` | unknown | Palette color |


---

## 3. Typography Rules

**Font Stack:**
- **Pally-Regular** — Heading 1, Heading 2, Heading 3
- **Nunito** — Body, Caption

**Font Sources:**

```css
@font-face {
  font-family: "Pally-Regular";
  src: url("fonts/Pally-Regular-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Pally-Medium";
  src: url("fonts/Pally-Medium-500.woff2") format("woff2");
  font-weight: 500;
}
@font-face {
  font-family: "Pally-Bold";
  src: url("fonts/Pally-Bold-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "Amatic SC";
  src: url("fonts/AmaticSC-Bold.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "Amatic SC";
  src: url("fonts/AmaticSC-Regular.ttf") format("truetype");
  font-weight: 400;
}
@font-face {
  font-family: "Nunito";
  src: url("fonts/Nunito-Bold.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "Nunito";
  src: url("fonts/Nunito-Regular.ttf") format("truetype");
  font-weight: 400;
}
```

| Role | Font | Size | Weight |
|---|---|---|---|
| Heading 1 | Pally-Regular | 64px | 700 |
| Heading 2 | Pally-Regular | 48px | 700 |
| Heading 3 | Pally-Regular | 2.5rem | 700 |
| Body | Nunito | 16px | 400 |
| Caption | Nunito | 20px | 400 |

**Typographic Rules:**
- Limit to 2 font families max per screen
- Use **Pally-Regular** for body/UI text, **Nunito** for display/headings
- Maintain consistent hierarchy: no more than 3-4 font sizes per screen
- Headings use bold (600-700), body uses regular (400)
- Line height: 1.5 for body text, 1.2 for headings
- Use color and opacity for secondary hierarchy, not additional font sizes


---

## 4. Component Stylings

### Data Display (2)

**Badge** — `html`

**List** — `html`

### Data Input (2)

**Button** — `html`
- Animation: 

**Input** — `html`
- State: :focus, :placeholder

### Overlay (1)

**Modal** — `html`

### Media (3)

**Image** — `html`

**Icon** — `html`

**Map/Canvas** — `html`



---

## 5. Layout Principles

- **Base spacing unit:** 5px
- **Spacing scale:** 5, 10, 15, 20, 25, 30, 35, 40, 50, 70, 80
- **Border radius:** 4px, 6px, 8px, 15px
- **Max content width:** 1100px

**Spacing as Meaning:**
| Spacing | Use |
|---|---|
| 2.5-5px | Tight: related items within a group |
| 10px | Medium: between groups |
| 15-20px | Wide: between sections |
| 30px+ | Vast: major section breaks |


---

## 6. Depth & Elevation

### Raised — cards, buttons, interactive elements

- `0 0 4px #251f2b77`
- `0 0 4px #0007`

### Z-Index Scale

`1, 9`



---

## 7. Animation & Motion

This project uses **subtle motion**. Transitions smooth state changes without demanding attention.

### CSS Animations

- `@keyframes map-player-animation`

### Animated Components

- **Button**: 

### Motion Guidelines

- Duration: 150-300ms for micro-interactions, 300-500ms for page transitions
- Easing: `ease-out` for enters, `ease-in` for exits
- Always respect `prefers-reduced-motion`


---

## 8. Do's and Don'ts

### Do's

- Use `#d5ff95` for interactive elements (buttons, links, focus rings)
- Use `#ffffff` as the primary page background
- Pair **Pally-Regular** (body) with **Nunito** (display) — these are the only allowed fonts
- Follow the **5px** spacing grid for all margins, padding, and gaps
- Use the defined shadow tokens for elevation — see Section 6
- Use border-radius from the scale: 4px, 6px, 8px, 15px
- Reuse existing components from Section 4 before creating new ones

### Don'ts

- Don't introduce colors outside this palette — extend the design tokens first
- Don't introduce additional font families beyond Pally-Regular and Nunito
- Don't use arbitrary spacing values — stick to multiples of 5px
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
| xs | 360px | css |
| xs | 440px | css |
| sm | 520px | css |
| lg | 800px | css |
| lg | 870px | css |
| xl | 1100px | css |

**Approach:** Use `@media (min-width: ...)` queries matching the breakpoints above.


---

## 10. Agent Prompt Guide

Use these as starting points when building new UI:

### Build a Card

```
Background: #ffceca
Border: 1px solid #1d1721
Radius: 8px
Padding: 20px
Font: Pally-Regular
Use shadow tokens from Section 6.
```

### Build a Button

```
Primary: bg #d5ff95, text white
Ghost: bg transparent, border #1d1721
Padding: 10px 20px
Radius: 8px
Hover: opacity 0.9 or lighter shade
Focus: ring with #d5ff95
```

### Build a Page Layout

```
Background: #ffffff
Max-width: 1100px, centered
Grid: 5px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface: #ffceca
Label: #555555 (muted, 12px, uppercase)
Value: #251f2b (primary, 24-32px, bold)
Status: use success/warning/danger from Section 2
```

### Build a Form

```
Input bg: #ffffff
Input border: 1px solid #1d1721
Focus: border-color #d5ff95
Label: #555555 12px
Spacing: 20px between fields
Radius: 8px
```

### General Component

```
1. Read DESIGN.md Sections 2-6 for tokens
2. Colors: only from palette
3. Font: Pally-Regular, type scale from Section 3
4. Spacing: 5px grid
5. Components: match patterns from Section 4
6. Elevation: shadow tokens
```

## Bundled Fonts (fonts/)

The following font files are bundled in the `fonts/` directory:

- `fonts/AmaticSC-Bold.ttf`
- `fonts/AmaticSC-Regular.ttf`
- `fonts/Nunito-Black.ttf`
- `fonts/Nunito-Bold.ttf`
- `fonts/Nunito-ExtraBold.ttf`
- `fonts/Nunito-ExtraLight.ttf`
- `fonts/Nunito-Light.ttf`
- `fonts/Nunito-Medium.ttf`
- `fonts/Nunito-Regular.ttf`
- `fonts/Nunito-SemiBold.ttf`
- `fonts/Pally-Bold-700.ttf`
- `fonts/Pally-Bold-700.woff`
- `fonts/Pally-Bold-700.woff2`
- `fonts/Pally-Medium-500.ttf`
- `fonts/Pally-Medium-500.woff`
- `fonts/Pally-Medium-500.woff2`
- `fonts/Pally-Regular-Regular.ttf`
- `fonts/Pally-Regular-Regular.woff`
- `fonts/Pally-Regular-Regular.woff2`

Use these local font files in `@font-face` declarations instead of fetching from Google Fonts.

## Homepage Screenshots (screenshots/)

![homepage.png](screenshots/homepage.png)

