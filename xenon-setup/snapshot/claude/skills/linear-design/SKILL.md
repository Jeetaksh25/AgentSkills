---
name: linear-design
description: Design system skill for linear. Activate when building UI components, pages, or any visual elements. Provides exact color tokens, typography scale, spacing grid, component patterns, and craft rules. Read references/DESIGN.md before writing any CSS or JSX. Includes ultra-mode visual journey: read references/ANIMATIONS.md, references/LAYOUT.md, references/COMPONENTS.md, and references/INTERACTIONS.md for full motion and layout details.
---

# linear Design System

You are building UI for **linear**. Light-themed, cool palette, sans-serif typography (Inter Variable), compact density on a 4px grid, expressive motion.

## Visual Reference

**IMPORTANT**: Study ALL screenshots below before writing any UI. Match colors, typography, spacing, layout, and motion exactly as shown.

### Homepage

![linear Homepage](screenshots/homepage.png)

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

- **Web Animations API (85 active)** — animation

## Design Philosophy

- **Layered depth** — use shadow tokens to create a sense of physical layering. Each elevation level has a specific shadow.
- **Gradient accents** — gradients are used thoughtfully for emphasis, not decoration.
- **Single typeface** — Inter Variable carries all text. Hierarchy comes from size, weight, and color — never font mixing.
- **compact density** — 4px base grid. Every dimension is a multiple of 4.
- **cool palette** — the color temperature runs cool, matching the sans-serif typography.
- **Restrained accent** — `#7170ff` is the only pop of color. Used exclusively for CTAs, links, focus rings, and active states.
- **Expressive motion** — animations are an integral part of the experience. Use spring physics and layout animations.

## Color System

### Core Palette

| Role | Token | Hex | Use |
|------|-------|-----|-----|
| Background | `--background` | `#ffffff` | Page/app background |
| Surface | `--surface` | `#f4f2f4` | Cards, panels, modals |
| Text Primary | `--text-primary` | `#080808` | Headings, body text |
| Text Muted | `--text-muted` | `#8b93a1` | Captions, placeholders |
| Accent | `--accent` | `#7170ff` | CTAs, links, focus rings |
| Border | `--border` | `#191d20` | Dividers, card borders |

### Status Colors

| Status | Hex | Use |
|--------|-----|-----|
| Success | `#27a644` | Confirmations, positive trends |
| Danger | `#f34e52` | Errors, destructive actions |

### Extended Palette

- **color-text-quaternary:** `#6b6b6b`
- `#9c9da1`
- **border-solid:** `#2a2e33`
- **color-button-invert-bg:** `#e2e4e7` — Light surface or highlight color
- **color-indigo:** `#5e6ad2`
- `#585a5c`
- `#6d78d5`
- **color-border-tertiary:** `#3e3e44`

### CSS Variable Tokens

```css
--header-border: transparent;
--header-border: #ffffff14;
--header-border: #00000014;
--header-border: #ffffff14;
--header-border: #00000014;
--card-width: 400px;
--card-height: 560px;
--card-gap: 12px;
--card-radius: 12px;
--plan-tail-accent: #21b3ff;
--label-muted: var(--color-text-quaternary);
--border-solid: #2a2e33;
--border-thin: #24282c;
--border-faint-thin: #191d21;
--border-frame: #151616;
--timeline-block-border: #ffffff1f;
--agent-chip-border: #ffffff14;
--agent-card-border: #ffffff1f;
--layer-popover: 600;
--border-hairline: 1px;
```

## Typography

### Font Stack

- **Inter Variable** — Heading 1, Heading 2, Heading 3, Body, Caption
- **Berkeley Mono** — Code

### Font Sources

```css
@font-face {
  font-family: "Inter Variable";
  src: url("fonts/InterVariable-100.woff2") format("woff2");
  font-weight: 100;
}
@font-face {
  font-family: "Berkeley Mono";
  src: url("fonts/BerkeleyMono-100.woff2") format("woff2");
  font-weight: 100;
}
```

### Type Scale

| Role | Family | Size | Weight |
|------|--------|------|--------|
| Heading 1 | Inter Variable | 40px | 700 |
| Heading 2 | Inter Variable | 38px | 700 |
| Heading 3 | Inter Variable | 2.25rem | 700 |
| Body | Inter Variable | 13px | 400 |
| Caption | Inter Variable | 12px | 400 |
| Code | Berkeley Mono | 14px | 400 |

### Typography Rules

- All text uses **Inter Variable** — never add another font family
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

Scale: `inherit, .3em, 1rem, 1.5px, 2px, 3px, 3.5px, 4px, 5px, 6px, 8px, 9px, 10px, 12px, 14px, 16px, 20px, 22px, 24px, 100%, 100px, 400px, 999px`
Default: `9px`

### Container

Max-width: `1280px`, centered with auto margins.

### Breakpoints

| Name | Value |
|------|-------|
| sm | 640px |
| md | 641px |
| md | 768px |
| lg | 769px |
| lg | 928px |
| lg | 1024px |
| xl | 1025px |
| xl | 1140px |
| xl | 1280px |
| 2xl | 1281px |
| 2xl | 1439px |
| 2xl | 1440px |
| 2xl | 1536px |

Mobile-first: design for small screens, layer on responsive overrides.

## Component Patterns

### Card

```css
.card {
  background: #f4f2f4;
  border: 1px solid #191d20;
  border-radius: 9px;
  padding: 16px;
  box-shadow: var(--shadow-medium);
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
  background: #7170ff;
  color: #080808;
  border-radius: 9px;
  padding: 8px 16px;
  font-weight: 500;
  transition: opacity 150ms ease;
}
.btn-primary:hover { opacity: 0.9; }

/* Ghost */
.btn-ghost {
  background: transparent;
  border: 1px solid #191d20;
  color: #080808;
  border-radius: 9px;
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
  border: 1px solid #191d20;
  border-radius: 9px;
  padding: 8px 12px;
  color: #080808;
  font-size: 14px;
}
.input:focus { border-color: #7170ff; outline: none; }
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
  background: #f4f2f4;
  color: #8b93a1;
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
  background: #f4f2f4;
  border: 1px solid #191d20;
  border-radius: 999px;
  padding: 24px;
  max-width: 480px;
  width: 90vw;
  box-shadow: 0 0 0 10px #f34f5200;
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
  color: #8b93a1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #191d20;
}
.table td {
  padding: 12px;
  border-bottom: 1px solid #191d20;
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
  border-bottom: 1px solid #191d20;
}
.nav-link {
  color: #8b93a1;
  padding: 8px 12px;
  border-radius: 9px;
  transition: color 150ms;
}
.nav-link:hover { color: #080808; }
.nav-link.active { color: #7170ff; }
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

**Navigation** (`html`)

## Page Structure

The following page sections were detected:

- **Navigation** — Top navigation bar (9 items)
- **Hero** — Hero section (detected from heading structure)
- **Footer** — Page footer with links and info (42 items)

When building pages, follow this section order and structure.

## Animation & Motion

This project uses **expressive motion**. Animations are part of the design language.

### CSS Animations

- `_6QN9Vq_tooltipOpen`
- `_6QN9Vq_tooltipClose`
- `WinFxq_contextMenuIn`
- `WinFxq_contextMenuOut`
- `TZTsQG_mobileMenuIn`

### Motion Tokens

- **Duration scale:** `0s`, `0ms`, `.1s`, `.15s`, `.25s`, `.3s`, `.35s`, `.5s`, `1.8s`, `2s`, `2.4s`, `2.5s`, `5s`, `60ms`, `80ms`, `100ms`, `120ms`, `150ms`, `160ms`, `200ms`, `220ms`, `400ms`, `500ms`, `600ms`, `700ms`, `1000ms`
- **Easing functions:** `ease-out`, `ease`, `cubic-bezier(.32,.72,0,1)`, `ease-in-out`, `linear`, `cubic-bezier(.43,.07,.59,.94)`, `cubic-bezier(.45,1.45,.8,1)`, `cubic-bezier(.16,1,.3,1)`

### Motion Guidelines

- **Duration:** Use values from the duration scale above. Short (0s) for micro-interactions, long (1000ms) for page transitions
- **Easing:** Use `ease-out` as the default easing curve
- **Direction:** Elements enter from bottom/right, exit to top/left
- **Reduced motion:** Always respect `prefers-reduced-motion` — disable animations when set

## Depth & Elevation

### Shadow Tokens

- Subtle: `0 1px #0006`
- Subtle: `0 0 0 1px #00000014,var(--shadow-low)`
- Subtle: `inset 0 0 0 1px var(--color-border-translucent)`
- Subtle: `inset 0 0 0 1px var(--color-border-primary)`
- Subtle: `inset 1px 0 0 0 var(--color-border-primary)`
- Subtle: `0 0 0 2px #6d78d526`

### Z-Index Scale

`0, 1, 2, 10`

Use these exact values — never invent z-index values.

## Anti-Patterns (Never Do)

- **No blur effects** — no backdrop-blur, no filter: blur()
- **No zebra striping** — tables and lists use borders for separation
- **No invented colors** — every hex value must come from the palette above
- **No arbitrary spacing** — every dimension is a multiple of 4px
- **No extra fonts** — only Inter Variable and Berkeley Mono are allowed
- **No arbitrary border-radius** — use the scale: .3em, 1rem, 1.5px, 2px, 3px, 3.5px, 4px, 5px, 6px, 8px
- **No opacity for disabled states** — use muted colors instead

## Workflow

1. **Read** `references/DESIGN.md` before writing any UI code
2. **Pick colors** from the Color System section — never invent new ones
3. **Set typography** — Inter Variable, Berkeley Mono only, using the type scale
4. **Build layout** on the 4px grid — check every margin, padding, gap
5. **Match components** to patterns above before creating new ones
6. **Apply elevation** — use shadow tokens
7. **Validate** — every value traces back to a design token. No magic numbers.

## Brand Spec

- **Favicon:** `/favicon.ico`
- **Site URL:** `https://linear.app`
- **Brand color:** `#7170ff`
- **Brand typeface:** Inter Variable

## Quick Reference

```
Background:     #ffffff
Surface:        #f4f2f4
Text:           #080808 / #8b93a1
Accent:         #7170ff
Border:         #191d20
Font:           Inter Variable
Spacing:        4px grid
Radius:         9px
Components:     7 detected
```

## When to Trigger

Activate this skill when:
- Creating new components, pages, or visual elements for linear
- Writing CSS, Tailwind classes, styled-components, or inline styles
- Building page layouts, templates, or responsive designs
- Reviewing UI code for design consistency
- The user mentions "linear" design, style, UI, or theme
- Generating mockups, wireframes, or visual prototypes

---

# Full Reference Files

> Every output file is embedded below. Claude has full design system context from /skills alone.

## Design System Tokens (DESIGN.md)

# linear DESIGN.md

> Auto-generated design system — reverse-engineered via static analysis by skillui.
> Frameworks: None detected
> Colors: 20 · Fonts: 2 · Components: 7
> Icon library: not detected · State: not detected
> Primary theme: light · Dark mode toggle: no · Motion: expressive

## Visual Reference

**Match this design exactly** — study colors, fonts, spacing, and component shapes before writing any UI code.

![linear Homepage](../screenshots/homepage.png)

---

## 1. Visual Theme & Atmosphere

This is a **light-themed** interface with a cool, approachable feel. The light background emphasizes content clarity. Typography uses **Inter Variable** throughout — a clean, modern choice that maintains consistency. Spacing follows a **4px base grid** (compact density), with scale: 2, 4, 6, 8, 10, 12, 14, 16px. The accent color **#7170ff** anchors interactive elements (buttons, links, focus rings). Motion is expressive — spring physics, layout animations, and staggered reveals are part of the visual language.

---

## 2. Color Palette & Roles

| Token | Hex | Role | Use |
|---|---|---|---|
| header-border | `#ffffff` | background | Page background, darkest surface |
| color-bg-tertiary | `#f4f2f4` | surface | Card and panel backgrounds |
| theme-color | `#080808` | text-primary | Headings and body text |
| color-text-tertiary | `#8b93a1` | text-muted | Captions, placeholders, secondary info |
| color-text-secondary | `#d2d7de` | text-muted | Captions, placeholders, secondary info |
| color-text-secondary | `#b4bcd0` | text-muted | Captions, placeholders, secondary info |
| border-faint-thin | `#191d20` | border | Dividers, card borders, outlines |
| color-accent | `#7170ff` | accent | CTAs, links, focus rings, active states |
| color-link-primary | `#828fff` | accent | CTAs, links, focus rings, active states |
| color-red | `#f34e52` | danger | Error states, destructive actions |
| color-green | `#27a644` | success | Success states, positive indicators |
| color-indigo | `#5e6ad2` | info | Informational highlights |
| color-text-quaternary | `#6b6b6b` | unknown | Palette color |
| unknown | `#9c9da1` | unknown | Palette color |
| border-solid | `#2a2e33` | unknown | Palette color |
| color-button-invert-bg | `#e2e4e7` | unknown | Palette color |
| unknown | `#585a5c` | unknown | Palette color |
| unknown | `#6d78d5` | unknown | Palette color |
| color-border-tertiary | `#3e3e44` | unknown | Palette color |
| color-blue | `#4ea7fc` | unknown | Palette color |

### CSS Variable Tokens

```css
--header-border: transparent;
--header-border: #ffffff14;
--header-border: #00000014;
--header-border: #ffffff14;
--header-border: #00000014;
--card-width: 400px;
--card-height: 560px;
--card-gap: 12px;
--card-radius: 12px;
--plan-tail-accent: #21b3ff;
--label-muted: var(--color-text-quaternary);
--border-solid: #2a2e33;
--border-thin: #24282c;
--border-faint-thin: #191d21;
--border-frame: #151616;
--timeline-block-border: #ffffff1f;
--agent-chip-border: #ffffff14;
--agent-card-border: #ffffff1f;
--layer-popover: 600;
--border-hairline: 1px;
```


---

## 3. Typography Rules

**Font Stack:**
- **Inter Variable** — Heading 1, Heading 2, Heading 3, Body, Caption
- **Berkeley Mono** — Code

**Font Sources:**

```css
@font-face {
  font-family: "Inter Variable";
  src: url("fonts/InterVariable-100.woff2") format("woff2");
  font-weight: 100;
}
@font-face {
  font-family: "Berkeley Mono";
  src: url("fonts/BerkeleyMono-100.woff2") format("woff2");
  font-weight: 100;
}
```

| Role | Font | Size | Weight |
|---|---|---|---|
| Heading 1 | Inter Variable | 40px | 700 |
| Heading 2 | Inter Variable | 38px | 700 |
| Heading 3 | Inter Variable | 2.25rem | 700 |
| Body | Inter Variable | 13px | 400 |
| Caption | Inter Variable | 12px | 400 |
| Code | Berkeley Mono | 14px | 400 |

**Typographic Rules:**
- Use **Inter Variable** for all text — do not mix font families
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
- **Border radius:** inherit, .3em, 1rem, 1.5px, 2px, 3px, 3.5px, 4px, 5px, 6px, 8px, 9px, 10px, 12px, 14px, 16px, 20px, 22px, 24px, 100%, 100px, 400px, 999px
- **Max content width:** 1280px

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

- `0 1px #0006`
- `0 0 0 1px #00000014,var(--shadow-low)`
- `inset 0 0 0 1px var(--color-border-translucent)`

### Raised — cards, buttons, interactive elements

- `var(--shadow-medium)`
- `0 0 0 2px var(--color-bg-primary),0 0 0 4px var(--color-brand-bg)`
- `inset 0 0 0 1px #ffffff08,inset 0 1px #ffffff0a,0 0 0 1px #0009,0 4px 4px #0000001a`

### Floating — dropdowns, popovers, modals

- `0 0 0 10px #f34f5200`
- `0 4px 12px #00000026`
- `inset 0 0 12px 0 var(--timeline-block-inset)`

### Overlay — full-screen overlays, top-level dialogs

- `0 8px 32px #08090a`
- `0 8px 32px #08090a0d`
- `0 0 32px #0006,0 0 0 1px #000`

### Z-Index Scale

`0, 1, 2, 10`



---

## 7. Animation & Motion

This project uses **expressive motion**. Animations are an integral part of the experience.

### CSS Animations

- `@keyframes _6QN9Vq_tooltipOpen`
- `@keyframes _6QN9Vq_tooltipClose`
- `@keyframes WinFxq_contextMenuIn`
- `@keyframes WinFxq_contextMenuOut`
- `@keyframes TZTsQG_mobileMenuIn`
- `@keyframes TZTsQG_mobileMenuOut`
- `@keyframes TZTsQG_slideFromRight`
- `@keyframes TZTsQG_slideFromLeft`

### Animated Components

- **Button**: 

### Motion Guidelines

- Duration: 150-300ms for micro-interactions, 300-500ms for page transitions
- Easing: `ease-out` for enters, `ease-in` for exits
- Always respect `prefers-reduced-motion`


---

## 8. Do's and Don'ts

### Do's

- Use `#7170ff` for interactive elements (buttons, links, focus rings)
- Use `#ffffff` as the primary page background
- Use **Inter Variable** for all UI text
- Follow the **4px** spacing grid for all margins, padding, and gaps
- Use the defined shadow tokens for elevation — see Section 6
- Use border-radius from the scale: inherit, .3em, 1rem, 1.5px, 2px
- Reuse existing components from Section 4 before creating new ones

### Don'ts

- Don't introduce colors outside this palette — extend the design tokens first
- Don't mix font families — use Inter Variable consistently
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
| sm | 640px | css |
| md | 641px | css |
| md | 768px | css |
| lg | 769px | css |
| lg | 928px | css |
| lg | 1024px | css |
| xl | 1025px | css |
| xl | 1140px | css |
| xl | 1280px | css |
| 2xl | 1281px | css |
| 2xl | 1439px | css |
| 2xl | 1440px | css |
| 2xl | 1536px | css |

**Approach:** Use `@media (min-width: ...)` queries matching the breakpoints above.


---

## 10. Agent Prompt Guide

Use these as starting points when building new UI:

### Build a Card

```
Background: #f4f2f4
Border: 1px solid #191d20
Radius: 9px
Padding: 16px
Font: Inter Variable
Use shadow tokens from Section 6.
```

### Build a Button

```
Primary: bg #7170ff, text white
Ghost: bg transparent, border #191d20
Padding: 8px 16px
Radius: 9px
Hover: opacity 0.9 or lighter shade
Focus: ring with #7170ff
```

### Build a Page Layout

```
Background: #ffffff
Max-width: 1280px, centered
Grid: 4px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface: #f4f2f4
Label: #8b93a1 (muted, 12px, uppercase)
Value: #080808 (primary, 24-32px, bold)
Status: use success/warning/danger from Section 2
```

### Build a Form

```
Input bg: #ffffff
Input border: 1px solid #191d20
Focus: border-color #7170ff
Label: #8b93a1 12px
Spacing: 16px between fields
Radius: 9px
```

### General Component

```
1. Read DESIGN.md Sections 2-6 for tokens
2. Colors: only from palette
3. Font: Inter Variable, type scale from Section 3
4. Spacing: 4px grid
5. Components: match patterns from Section 4
6. Elevation: shadow tokens
```

## Visual Guide — Screenshots (VISUAL_GUIDE.md)

# linear — Visual Guide

> Master visual reference. Study every screenshot carefully before implementing any UI.
> Match colors, layout, typography, spacing, and motion states exactly.

**Motion Stack:** **Web Animations API (85 active)**

## Scroll Journey

The page has cinematic scroll animations. Each screenshot below shows the exact visual state at that scroll depth.
**Replicate these transitions precisely** — the design changes dramatically as you scroll.

### Hero — Above the fold

*Scroll position: 0px of 9960px total*

![Hero — Above the fold](../screens/scroll/scroll-000.png)

### 17% scroll depth

*Scroll position: 1540px of 9960px total*

![17% scroll depth](../screens/scroll/scroll-017.png)

### 33% scroll depth

*Scroll position: 2990px of 9960px total*

![33% scroll depth](../screens/scroll/scroll-033.png)

### 50% scroll depth

*Scroll position: 4530px of 9960px total*

![50% scroll depth](../screens/scroll/scroll-050.png)

### 67% scroll depth

*Scroll position: 6070px of 9960px total*

![67% scroll depth](../screens/scroll/scroll-067.png)

### 83% scroll depth

*Scroll position: 7520px of 9960px total*

![83% scroll depth](../screens/scroll/scroll-083.png)

### Footer — End of page

*Scroll position: 9060px of 9960px total*

![Footer — End of page](../screens/scroll/scroll-100.png)

## Full Page Screenshots

### Linear – The system for product development

*URL: `https://linear.app`*

![Linear – The system for product development](../screens/pages/home.png)

### Linear – The system for product development

*URL: `https://linear.app/homepage`*

![Linear – The system for product development](../screens/pages/homepage.png)

### Linear Customers

*URL: `https://linear.app/customers`*

![Linear Customers](../screens/pages/customers.png)

### Pricing – Linear

*URL: `https://linear.app/pricing`*

![Pricing – Linear](../screens/pages/pricing.png)

### Now – Updates from the Linear team

*URL: `https://linear.app/now`*

![Now – Updates from the Linear team](../screens/pages/now.png)

## Section Screenshots

Clipped sections showing individual components in context.

### Section 8 — `main > div`

*1436×1200px*

![Section 8](../screens/sections/home-section-8.png)

### Section 8 — `main > div`

*1436×1200px*

![Section 8](../screens/sections/homepage-section-8.png)

### Section 2 — `header`

*1280×213px*

![Section 2](../screens/sections/customers-section-2.png)

### Section 3 — `main > div`

*1436×984px*

![Section 3](../screens/sections/pricing-section-3.png)

### Section 2 — `header`

*1280×213px*

![Section 2](../screens/sections/now-section-2.png)

## Animations & Motion (ANIMATIONS.md)

# Animation Reference

> Cinematic motion design extracted from live DOM. Follow these specs exactly to recreate the experience.

## Motion Technology Stack

| Library | Type | Notes |
|---------|------|-------|
| **Web Animations API (85 active)** | animation |  |

## Scroll Journey

The page is **9,960px** tall. Each frame below shows what the user sees at that scroll depth.

> **Use these screenshots to understand WHAT animates, WHEN it animates, and HOW it moves.**

### 0% — Top / Hero
Scroll position: 0px

![Scroll 0%](../screens/scroll/scroll-000.png)

### 17% — Opening Section
Scroll position: 1,540px

![Scroll 17%](../screens/scroll/scroll-017.png)

### 33% — First Feature Section
Scroll position: 2,990px

![Scroll 33%](../screens/scroll/scroll-033.png)

### 50% — Mid-Page
Scroll position: 4,530px

![Scroll 50%](../screens/scroll/scroll-050.png)

### 67% — Lower Content
Scroll position: 6,070px

![Scroll 67%](../screens/scroll/scroll-067.png)

### 83% — Near Footer
Scroll position: 7,520px

![Scroll 83%](../screens/scroll/scroll-083.png)

### 100% — Bottom / Footer
Scroll position: 9,060px

![Scroll 100%](../screens/scroll/scroll-100.png)

## CSS Keyframes (176 extracted)

### `@keyframes grid-dot-0-0-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-0-0-upDown`

```css
@keyframes grid-dot-0-0-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-0-1-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-0-1-upDown`

```css
@keyframes grid-dot-0-1-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 1;
  }
  42.8571% {
    opacity: 1;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 1;
  }
  64.2857% {
    opacity: 1;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-0-2-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-0-2-upDown`

```css
@keyframes grid-dot-0-2-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 1;
  }
  35.7143% {
    opacity: 1;
  }
  35.7143% {
    opacity: 1;
  }
  42.8571% {
    opacity: 1;
  }
  42.8571% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  57.1429% {
    opacity: 1;
  }
  57.1429% {
    opacity: 1;
  }
  64.2857% {
    opacity: 1;
  }
  64.2857% {
    opacity: 1;
  }
  71.4286% {
    opacity: 1;
  }
  71.4286% {
    opacity: 1;
  }
  78.5714% {
    opacity: 1;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-0-3-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-0-3-upDown`

```css
@keyframes grid-dot-0-3-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 1;
  }
  42.8571% {
    opacity: 1;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 1;
  }
  64.2857% {
    opacity: 1;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-0-4-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-0-4-upDown`

```css
@keyframes grid-dot-0-4-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-1-0-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-1-0-upDown`

```css
@keyframes grid-dot-1-0-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-1-1-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-1-1-upDown`

```css
@keyframes grid-dot-1-1-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 1;
  }
  35.7143% {
    opacity: 1;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 1;
  }
  71.4286% {
    opacity: 1;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-1-2-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-1-2-upDown`

```css
@keyframes grid-dot-1-2-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 1;
  }
  28.5714% {
    opacity: 1;
  }
  28.5714% {
    opacity: 1;
  }
  35.7143% {
    opacity: 1;
  }
  35.7143% {
    opacity: 1;
  }
  42.8571% {
    opacity: 1;
  }
  42.8571% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 1;
  }
  64.2857% {
    opacity: 1;
  }
  64.2857% {
    opacity: 1;
  }
  71.4286% {
    opacity: 1;
  }
  71.4286% {
    opacity: 1;
  }
  78.5714% {
    opacity: 1;
  }
  78.5714% {
    opacity: 1;
  }
  85.7143% {
    opacity: 1;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-1-3-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-1-3-upDown`

```css
@keyframes grid-dot-1-3-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 1;
  }
  35.7143% {
    opacity: 1;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 1;
  }
  71.4286% {
    opacity: 1;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-1-4-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-1-4-upDown`

```css
@keyframes grid-dot-1-4-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-2-0-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-2-0-upDown`

```css
@keyframes grid-dot-2-0-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-2-1-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-2-1-upDown`

```css
@keyframes grid-dot-2-1-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 1;
  }
  28.5714% {
    opacity: 1;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 1;
  }
  78.5714% {
    opacity: 1;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-2-2-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-2-2-upDown`

```css
@keyframes grid-dot-2-2-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 1;
  }
  21.4286% {
    opacity: 1;
  }
  21.4286% {
    opacity: 1;
  }
  28.5714% {
    opacity: 1;
  }
  28.5714% {
    opacity: 1;
  }
  35.7143% {
    opacity: 1;
  }
  35.7143% {
    opacity: 1;
  }
  42.8571% {
    opacity: 1;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 1;
  }
  71.4286% {
    opacity: 1;
  }
  71.4286% {
    opacity: 1;
  }
  78.5714% {
    opacity: 1;
  }
  78.5714% {
    opacity: 1;
  }
  85.7143% {
    opacity: 1;
  }
  85.7143% {
    opacity: 1;
  }
  92.8571% {
    opacity: 1;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-2-3-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-2-3-upDown`

```css
@keyframes grid-dot-2-3-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 1;
  }
  28.5714% {
    opacity: 1;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 1;
  }
  78.5714% {
    opacity: 1;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-2-4-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-2-4-upDown`

```css
@keyframes grid-dot-2-4-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-3-0-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-3-0-upDown`

```css
@keyframes grid-dot-3-0-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-3-1-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-3-1-upDown`

```css
@keyframes grid-dot-3-1-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 1;
  }
  21.4286% {
    opacity: 1;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 1;
  }
  85.7143% {
    opacity: 1;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-3-2-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-3-2-upDown`

```css
@keyframes grid-dot-3-2-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 1;
  }
  14.2857% {
    opacity: 1;
  }
  14.2857% {
    opacity: 1;
  }
  21.4286% {
    opacity: 1;
  }
  21.4286% {
    opacity: 1;
  }
  28.5714% {
    opacity: 1;
  }
  28.5714% {
    opacity: 1;
  }
  35.7143% {
    opacity: 1;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 1;
  }
  78.5714% {
    opacity: 1;
  }
  78.5714% {
    opacity: 1;
  }
  85.7143% {
    opacity: 1;
  }
  85.7143% {
    opacity: 1;
  }
  92.8571% {
    opacity: 1;
  }
  92.8571% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-3-3-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-3-3-upDown`

```css
@keyframes grid-dot-3-3-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 1;
  }
  21.4286% {
    opacity: 1;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 1;
  }
  85.7143% {
    opacity: 1;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-3-4-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-3-4-upDown`

```css
@keyframes grid-dot-3-4-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-4-0-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-4-0-upDown`

```css
@keyframes grid-dot-4-0-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-4-1-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-4-1-upDown`

```css
@keyframes grid-dot-4-1-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 1;
  }
  14.2857% {
    opacity: 1;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 1;
  }
  92.8571% {
    opacity: 1;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-4-2-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-4-2-upDown`

```css
@keyframes grid-dot-4-2-upDown {
  0% {
    opacity: 1;
  }
  7.14286% {
    opacity: 1;
  }
  7.14286% {
    opacity: 1;
  }
  14.2857% {
    opacity: 1;
  }
  14.2857% {
    opacity: 1;
  }
  21.4286% {
    opacity: 1;
  }
  21.4286% {
    opacity: 1;
  }
  28.5714% {
    opacity: 1;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 1;
  }
  85.7143% {
    opacity: 1;
  }
  85.7143% {
    opacity: 1;
  }
  92.8571% {
    opacity: 1;
  }
  92.8571% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-4-3-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-4-3-upDown`

```css
@keyframes grid-dot-4-3-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 1;
  }
  14.2857% {
    opacity: 1;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 1;
  }
  92.8571% {
    opacity: 1;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-4-4-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-4-4-upDown`

```css
@keyframes grid-dot-4-4-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-0-0-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-0-0-pong`

```css
@keyframes grid-dot-0-0-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-0-1-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-0-1-pong`

```css
@keyframes grid-dot-0-1-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-0-2-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-0-2-pong`

```css
@keyframes grid-dot-0-2-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-0-3-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-0-3-pong`

```css
@keyframes grid-dot-0-3-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-0-4-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-0-4-pong`

```css
@keyframes grid-dot-0-4-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-1-0-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-1-0-pong`

```css
@keyframes grid-dot-1-0-pong {
  0% {
    opacity: 1;
  }
  12.5% {
    opacity: 1;
  }
  12.5% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-1-1-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-1-1-pong`

```css
@keyframes grid-dot-1-1-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-1-2-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-1-2-pong`

```css
@keyframes grid-dot-1-2-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-1-3-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-1-3-pong`

```css
@keyframes grid-dot-1-3-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-1-4-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-1-4-pong`

```css
@keyframes grid-dot-1-4-pong {
  0% {
    opacity: 1;
  }
  12.5% {
    opacity: 1;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-2-0-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-2-0-pong`

```css
@keyframes grid-dot-2-0-pong {
  0% {
    opacity: 1;
  }
  12.5% {
    opacity: 1;
  }
  12.5% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-2-1-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-2-1-pong`

```css
@keyframes grid-dot-2-1-pong {
  0% {
    opacity: 1;
  }
  12.5% {
    opacity: 1;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-2-2-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-2-2-pong`

```css
@keyframes grid-dot-2-2-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-2-3-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-2-3-pong`

```css
@keyframes grid-dot-2-3-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-2-4-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-2-4-pong`

```css
@keyframes grid-dot-2-4-pong {
  0% {
    opacity: 1;
  }
  12.5% {
    opacity: 1;
  }
  12.5% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-3-0-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-3-0-pong`

```css
@keyframes grid-dot-3-0-pong {
  0% {
    opacity: 1;
  }
  12.5% {
    opacity: 1;
  }
  12.5% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-3-1-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-3-1-pong`

```css
@keyframes grid-dot-3-1-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-3-2-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-3-2-pong`

```css
@keyframes grid-dot-3-2-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-3-3-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-3-3-pong`

```css
@keyframes grid-dot-3-3-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-3-4-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-3-4-pong`

```css
@keyframes grid-dot-3-4-pong {
  0% {
    opacity: 1;
  }
  12.5% {
    opacity: 1;
  }
  12.5% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-4-0-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-4-0-pong`

```css
@keyframes grid-dot-4-0-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-4-1-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-4-1-pong`

```css
@keyframes grid-dot-4-1-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-4-2-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-4-2-pong`

```css
@keyframes grid-dot-4-2-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-4-3-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-4-3-pong`

```css
@keyframes grid-dot-4-3-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-4-4-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-4-4-pong`

```css
@keyframes grid-dot-4-4-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-0-0-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-0-0-agent`

```css
@keyframes grid-dot-0-0-agent {
  0% {
    opacity: 1;
  }
  6.25% {
    opacity: 1;
  }
  6.25% {
    opacity: 1;
  }
  12.5% {
    opacity: 1;
  }
  12.5% {
    opacity: 1;
  }
  18.75% {
    opacity: 1;
  }
  18.75% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  31.25% {
    opacity: 1;
  }
  31.25% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  43.75% {
    opacity: 1;
  }
  43.75% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-0-1-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-0-1-agent`

```css
@keyframes grid-dot-0-1-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 1;
  }
  12.5% {
    opacity: 1;
  }
  12.5% {
    opacity: 1;
  }
  18.75% {
    opacity: 1;
  }
  18.75% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  31.25% {
    opacity: 1;
  }
  31.25% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  43.75% {
    opacity: 1;
  }
  43.75% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-0-2-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-0-2-agent`

```css
@keyframes grid-dot-0-2-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 1;
  }
  18.75% {
    opacity: 1;
  }
  18.75% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  31.25% {
    opacity: 1;
  }
  31.25% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  43.75% {
    opacity: 1;
  }
  43.75% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-0-3-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-0-3-agent`

```css
@keyframes grid-dot-0-3-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-0-4-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-0-4-agent`

```css
@keyframes grid-dot-0-4-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-1-0-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-1-0-agent`

```css
@keyframes grid-dot-1-0-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  31.25% {
    opacity: 1;
  }
  31.25% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  43.75% {
    opacity: 1;
  }
  43.75% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-1-1-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-1-1-agent`

```css
@keyframes grid-dot-1-1-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 1;
  }
  31.25% {
    opacity: 1;
  }
  31.25% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  43.75% {
    opacity: 1;
  }
  43.75% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-1-2-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-1-2-agent`

```css
@keyframes grid-dot-1-2-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  43.75% {
    opacity: 1;
  }
  43.75% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-1-3-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-1-3-agent`

```css
@keyframes grid-dot-1-3-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 1;
  }
  43.75% {
    opacity: 1;
  }
  43.75% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-1-4-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-1-4-agent`

```css
@keyframes grid-dot-1-4-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-2-0-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-2-0-agent`

```css
@keyframes grid-dot-2-0-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-2-1-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-2-1-agent`

```css
@keyframes grid-dot-2-1-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-2-2-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-2-2-agent`

```css
@keyframes grid-dot-2-2-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-2-3-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-2-3-agent`

```css
@keyframes grid-dot-2-3-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-2-4-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-2-4-agent`

```css
@keyframes grid-dot-2-4-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-3-0-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-3-0-agent`

```css
@keyframes grid-dot-3-0-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-3-1-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-3-1-agent`

```css
@keyframes grid-dot-3-1-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-3-2-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-3-2-agent`

```css
@keyframes grid-dot-3-2-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-3-3-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-3-3-agent`

```css
@keyframes grid-dot-3-3-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-3-4-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-3-4-agent`

```css
@keyframes grid-dot-3-4-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-4-0-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-4-0-agent`

```css
@keyframes grid-dot-4-0-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-4-1-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-4-1-agent`

```css
@keyframes grid-dot-4-1-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-4-2-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-4-2-agent`

```css
@keyframes grid-dot-4-2-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-4-3-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-4-3-agent`

```css
@keyframes grid-dot-4-3-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-4-4-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-4-4-agent`

```css
@keyframes grid-dot-4-4-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-0-0-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-0-0-upDown`

```css
@keyframes grid-dot-0-0-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-0-1-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-0-1-upDown`

```css
@keyframes grid-dot-0-1-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 1;
  }
  42.8571% {
    opacity: 1;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 1;
  }
  64.2857% {
    opacity: 1;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-0-2-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-0-2-upDown`

```css
@keyframes grid-dot-0-2-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 1;
  }
  35.7143% {
    opacity: 1;
  }
  35.7143% {
    opacity: 1;
  }
  42.8571% {
    opacity: 1;
  }
  42.8571% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  57.1429% {
    opacity: 1;
  }
  57.1429% {
    opacity: 1;
  }
  64.2857% {
    opacity: 1;
  }
  64.2857% {
    opacity: 1;
  }
  71.4286% {
    opacity: 1;
  }
  71.4286% {
    opacity: 1;
  }
  78.5714% {
    opacity: 1;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-0-3-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-0-3-upDown`

```css
@keyframes grid-dot-0-3-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 1;
  }
  42.8571% {
    opacity: 1;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 1;
  }
  64.2857% {
    opacity: 1;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-0-4-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-0-4-upDown`

```css
@keyframes grid-dot-0-4-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-1-0-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-1-0-upDown`

```css
@keyframes grid-dot-1-0-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-1-1-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-1-1-upDown`

```css
@keyframes grid-dot-1-1-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 1;
  }
  35.7143% {
    opacity: 1;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 1;
  }
  71.4286% {
    opacity: 1;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-1-2-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-1-2-upDown`

```css
@keyframes grid-dot-1-2-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 1;
  }
  28.5714% {
    opacity: 1;
  }
  28.5714% {
    opacity: 1;
  }
  35.7143% {
    opacity: 1;
  }
  35.7143% {
    opacity: 1;
  }
  42.8571% {
    opacity: 1;
  }
  42.8571% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 1;
  }
  64.2857% {
    opacity: 1;
  }
  64.2857% {
    opacity: 1;
  }
  71.4286% {
    opacity: 1;
  }
  71.4286% {
    opacity: 1;
  }
  78.5714% {
    opacity: 1;
  }
  78.5714% {
    opacity: 1;
  }
  85.7143% {
    opacity: 1;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-1-3-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-1-3-upDown`

```css
@keyframes grid-dot-1-3-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 1;
  }
  35.7143% {
    opacity: 1;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 1;
  }
  71.4286% {
    opacity: 1;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-1-4-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-1-4-upDown`

```css
@keyframes grid-dot-1-4-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-2-0-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-2-0-upDown`

```css
@keyframes grid-dot-2-0-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-2-1-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-2-1-upDown`

```css
@keyframes grid-dot-2-1-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 1;
  }
  28.5714% {
    opacity: 1;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 1;
  }
  78.5714% {
    opacity: 1;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-2-2-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-2-2-upDown`

```css
@keyframes grid-dot-2-2-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 1;
  }
  21.4286% {
    opacity: 1;
  }
  21.4286% {
    opacity: 1;
  }
  28.5714% {
    opacity: 1;
  }
  28.5714% {
    opacity: 1;
  }
  35.7143% {
    opacity: 1;
  }
  35.7143% {
    opacity: 1;
  }
  42.8571% {
    opacity: 1;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 1;
  }
  71.4286% {
    opacity: 1;
  }
  71.4286% {
    opacity: 1;
  }
  78.5714% {
    opacity: 1;
  }
  78.5714% {
    opacity: 1;
  }
  85.7143% {
    opacity: 1;
  }
  85.7143% {
    opacity: 1;
  }
  92.8571% {
    opacity: 1;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-2-3-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-2-3-upDown`

```css
@keyframes grid-dot-2-3-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 1;
  }
  28.5714% {
    opacity: 1;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 1;
  }
  78.5714% {
    opacity: 1;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-2-4-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-2-4-upDown`

```css
@keyframes grid-dot-2-4-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-3-0-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-3-0-upDown`

```css
@keyframes grid-dot-3-0-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-3-1-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-3-1-upDown`

```css
@keyframes grid-dot-3-1-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 1;
  }
  21.4286% {
    opacity: 1;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 1;
  }
  85.7143% {
    opacity: 1;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-3-2-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-3-2-upDown`

```css
@keyframes grid-dot-3-2-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 1;
  }
  14.2857% {
    opacity: 1;
  }
  14.2857% {
    opacity: 1;
  }
  21.4286% {
    opacity: 1;
  }
  21.4286% {
    opacity: 1;
  }
  28.5714% {
    opacity: 1;
  }
  28.5714% {
    opacity: 1;
  }
  35.7143% {
    opacity: 1;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 1;
  }
  78.5714% {
    opacity: 1;
  }
  78.5714% {
    opacity: 1;
  }
  85.7143% {
    opacity: 1;
  }
  85.7143% {
    opacity: 1;
  }
  92.8571% {
    opacity: 1;
  }
  92.8571% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-3-3-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-3-3-upDown`

```css
@keyframes grid-dot-3-3-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 1;
  }
  21.4286% {
    opacity: 1;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 1;
  }
  85.7143% {
    opacity: 1;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-3-4-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-3-4-upDown`

```css
@keyframes grid-dot-3-4-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-4-0-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-4-0-upDown`

```css
@keyframes grid-dot-4-0-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-4-1-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-4-1-upDown`

```css
@keyframes grid-dot-4-1-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 1;
  }
  14.2857% {
    opacity: 1;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 1;
  }
  92.8571% {
    opacity: 1;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-4-2-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-4-2-upDown`

```css
@keyframes grid-dot-4-2-upDown {
  0% {
    opacity: 1;
  }
  7.14286% {
    opacity: 1;
  }
  7.14286% {
    opacity: 1;
  }
  14.2857% {
    opacity: 1;
  }
  14.2857% {
    opacity: 1;
  }
  21.4286% {
    opacity: 1;
  }
  21.4286% {
    opacity: 1;
  }
  28.5714% {
    opacity: 1;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 1;
  }
  85.7143% {
    opacity: 1;
  }
  85.7143% {
    opacity: 1;
  }
  92.8571% {
    opacity: 1;
  }
  92.8571% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-4-3-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-4-3-upDown`

```css
@keyframes grid-dot-4-3-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 1;
  }
  14.2857% {
    opacity: 1;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 1;
  }
  92.8571% {
    opacity: 1;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-4-4-upDown`

Duration: `2800ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-4-4-upDown`

```css
@keyframes grid-dot-4-4-upDown {
  0% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  7.14286% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  14.2857% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  21.4286% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  28.5714% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  35.7143% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  42.8571% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  57.1429% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  64.2857% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  71.4286% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  78.5714% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  85.7143% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  92.8571% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-0-0-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-0-0-pong`

```css
@keyframes grid-dot-0-0-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-0-1-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-0-1-pong`

```css
@keyframes grid-dot-0-1-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-0-2-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-0-2-pong`

```css
@keyframes grid-dot-0-2-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-0-3-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-0-3-pong`

```css
@keyframes grid-dot-0-3-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-0-4-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-0-4-pong`

```css
@keyframes grid-dot-0-4-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-1-0-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-1-0-pong`

```css
@keyframes grid-dot-1-0-pong {
  0% {
    opacity: 1;
  }
  12.5% {
    opacity: 1;
  }
  12.5% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-1-1-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-1-1-pong`

```css
@keyframes grid-dot-1-1-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-1-2-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-1-2-pong`

```css
@keyframes grid-dot-1-2-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-1-3-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-1-3-pong`

```css
@keyframes grid-dot-1-3-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-1-4-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-1-4-pong`

```css
@keyframes grid-dot-1-4-pong {
  0% {
    opacity: 1;
  }
  12.5% {
    opacity: 1;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-2-0-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-2-0-pong`

```css
@keyframes grid-dot-2-0-pong {
  0% {
    opacity: 1;
  }
  12.5% {
    opacity: 1;
  }
  12.5% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-2-1-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-2-1-pong`

```css
@keyframes grid-dot-2-1-pong {
  0% {
    opacity: 1;
  }
  12.5% {
    opacity: 1;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-2-2-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-2-2-pong`

```css
@keyframes grid-dot-2-2-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-2-3-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-2-3-pong`

```css
@keyframes grid-dot-2-3-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-2-4-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-2-4-pong`

```css
@keyframes grid-dot-2-4-pong {
  0% {
    opacity: 1;
  }
  12.5% {
    opacity: 1;
  }
  12.5% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-3-0-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-3-0-pong`

```css
@keyframes grid-dot-3-0-pong {
  0% {
    opacity: 1;
  }
  12.5% {
    opacity: 1;
  }
  12.5% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-3-1-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-3-1-pong`

```css
@keyframes grid-dot-3-1-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-3-2-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-3-2-pong`

```css
@keyframes grid-dot-3-2-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-3-3-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-3-3-pong`

```css
@keyframes grid-dot-3-3-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-3-4-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-3-4-pong`

```css
@keyframes grid-dot-3-4-pong {
  0% {
    opacity: 1;
  }
  12.5% {
    opacity: 1;
  }
  12.5% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-4-0-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-4-0-pong`

```css
@keyframes grid-dot-4-0-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-4-1-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-4-1-pong`

```css
@keyframes grid-dot-4-1-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-4-2-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-4-2-pong`

```css
@keyframes grid-dot-4-2-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-4-3-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-4-3-pong`

```css
@keyframes grid-dot-4-3-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  37.5% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-4-4-pong`

Duration: `1600ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-4-4-pong`

```css
@keyframes grid-dot-4-4-pong {
  0% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-0-0-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-0-0-agent`

```css
@keyframes grid-dot-0-0-agent {
  0% {
    opacity: 1;
  }
  6.25% {
    opacity: 1;
  }
  6.25% {
    opacity: 1;
  }
  12.5% {
    opacity: 1;
  }
  12.5% {
    opacity: 1;
  }
  18.75% {
    opacity: 1;
  }
  18.75% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  31.25% {
    opacity: 1;
  }
  31.25% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  43.75% {
    opacity: 1;
  }
  43.75% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-0-1-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-0-1-agent`

```css
@keyframes grid-dot-0-1-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 1;
  }
  12.5% {
    opacity: 1;
  }
  12.5% {
    opacity: 1;
  }
  18.75% {
    opacity: 1;
  }
  18.75% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  31.25% {
    opacity: 1;
  }
  31.25% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  43.75% {
    opacity: 1;
  }
  43.75% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-0-2-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-0-2-agent`

```css
@keyframes grid-dot-0-2-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 1;
  }
  18.75% {
    opacity: 1;
  }
  18.75% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  31.25% {
    opacity: 1;
  }
  31.25% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  43.75% {
    opacity: 1;
  }
  43.75% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-0-3-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-0-3-agent`

```css
@keyframes grid-dot-0-3-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-0-4-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-0-4-agent`

```css
@keyframes grid-dot-0-4-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-1-0-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-1-0-agent`

```css
@keyframes grid-dot-1-0-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  31.25% {
    opacity: 1;
  }
  31.25% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  43.75% {
    opacity: 1;
  }
  43.75% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-1-1-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-1-1-agent`

```css
@keyframes grid-dot-1-1-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 1;
  }
  31.25% {
    opacity: 1;
  }
  31.25% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  43.75% {
    opacity: 1;
  }
  43.75% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-1-2-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-1-2-agent`

```css
@keyframes grid-dot-1-2-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  37.5% {
    opacity: 1;
  }
  43.75% {
    opacity: 1;
  }
  43.75% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-1-3-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-1-3-agent`

```css
@keyframes grid-dot-1-3-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 1;
  }
  43.75% {
    opacity: 1;
  }
  43.75% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-1-4-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-1-4-agent`

```css
@keyframes grid-dot-1-4-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-2-0-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-2-0-agent`

```css
@keyframes grid-dot-2-0-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-2-1-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-2-1-agent`

```css
@keyframes grid-dot-2-1-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  56.25% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-2-2-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-2-2-agent`

```css
@keyframes grid-dot-2-2-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-2-3-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-2-3-agent`

```css
@keyframes grid-dot-2-3-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-2-4-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-2-4-agent`

```css
@keyframes grid-dot-2-4-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-3-0-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-3-0-agent`

```css
@keyframes grid-dot-3-0-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  62.5% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-3-1-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-3-1-agent`

```css
@keyframes grid-dot-3-1-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  68.75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-3-2-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-3-2-agent`

```css
@keyframes grid-dot-3-2-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-3-3-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-3-3-agent`

```css
@keyframes grid-dot-3-3-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-3-4-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-3-4-agent`

```css
@keyframes grid-dot-3-4-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-4-0-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-4-0-agent`

```css
@keyframes grid-dot-4-0-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  81.25% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-4-1-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-4-1-agent`

```css
@keyframes grid-dot-4-1-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  87.5% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-4-2-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-4-2-agent`

```css
@keyframes grid-dot-4-2-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  93.75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-4-3-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-4-3-agent`

```css
@keyframes grid-dot-4-3-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes grid-dot-4-4-agent`

Duration: `3200ms` · Easing: `steps(1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.grid-dot-4-4-agent`

```css
@keyframes grid-dot-4-4-agent {
  0% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  6.25% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  12.5% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  18.75% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  31.25% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  37.5% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  43.75% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  56.25% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  62.5% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  68.75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  81.25% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  87.5% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  93.75% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

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

### `@keyframes fadeIn`

Used by: `[data-vaul-overlay][data-vaul-snap-points="false"][data-state="open"]`

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

### `@keyframes fadeOut`

Used by: `[data-vaul-overlay][data-state="closed"]`

```css
@keyframes fadeOut {
  100% {
    opacity: 0;
  }
}
```

> Opacity fade

### `@keyframes slideFromBottom`

Used by: `[data-vaul-drawer][data-vaul-snap-points="false"][data-vaul-drawer-direction="bo`

```css
@keyframes slideFromBottom {
  0% {
    transform: translate3d(0,var(--initial-transform,100%),0);
  }
  100% {
    transform: translate3d(0px, 0px, 0px);
  }
}
```

> Transform/motion animation

### `@keyframes slideToBottom`

Used by: `[data-vaul-drawer][data-vaul-snap-points="false"][data-vaul-drawer-direction="bo`

```css
@keyframes slideToBottom {
  100% {
    transform: translate3d(0,var(--initial-transform,100%),0);
  }
}
```

> Transform/motion animation

### `@keyframes slideFromTop`

Used by: `[data-vaul-drawer][data-vaul-snap-points="false"][data-vaul-drawer-direction="to`

```css
@keyframes slideFromTop {
  0% {
    transform: translate3d(0,calc(var(--initial-transform,100%) * -1),0);
  }
  100% {
    transform: translate3d(0px, 0px, 0px);
  }
}
```

> Transform/motion animation

### `@keyframes slideToTop`

Used by: `[data-vaul-drawer][data-vaul-snap-points="false"][data-vaul-drawer-direction="to`

```css
@keyframes slideToTop {
  100% {
    transform: translate3d(0,calc(var(--initial-transform,100%) * -1),0);
  }
}
```

> Transform/motion animation

### `@keyframes slideFromLeft`

Used by: `[data-vaul-drawer][data-vaul-snap-points="false"][data-vaul-drawer-direction="le`

```css
@keyframes slideFromLeft {
  0% {
    transform: translate3d(calc(var(--initial-transform,100%) * -1),0,0);
  }
  100% {
    transform: translate3d(0px, 0px, 0px);
  }
}
```

> Transform/motion animation

### `@keyframes slideToLeft`

Used by: `[data-vaul-drawer][data-vaul-snap-points="false"][data-vaul-drawer-direction="le`

```css
@keyframes slideToLeft {
  100% {
    transform: translate3d(calc(var(--initial-transform,100%) * -1),0,0);
  }
}
```

> Transform/motion animation

### `@keyframes slideFromRight`

Used by: `[data-vaul-drawer][data-vaul-snap-points="false"][data-vaul-drawer-direction="ri`

```css
@keyframes slideFromRight {
  0% {
    transform: translate3d(var(--initial-transform,100%),0,0);
  }
  100% {
    transform: translate3d(0px, 0px, 0px);
  }
}
```

> Transform/motion animation

### `@keyframes slideToRight`

Used by: `[data-vaul-drawer][data-vaul-snap-points="false"][data-vaul-drawer-direction="ri`

```css
@keyframes slideToRight {
  100% {
    transform: translate3d(var(--initial-transform,100%),0,0);
  }
}
```

> Transform/motion animation

### `@keyframes PSAPAG_dialogOpen`

Duration: `0.18s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.PSAPAG_content[data-open]`

```css
@keyframes PSAPAG_dialogOpen {
  0% {
    opacity: 0;
    transform: translate(-50%, -49%) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}
```

> Fade + motion enter animation

### `@keyframes PSAPAG_dialogClose`

Duration: `0.18s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.PSAPAG_content[data-ending-style]`

```css
@keyframes PSAPAG_dialogClose {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -49%) scale(0.95);
  }
}
```

> Fade + motion enter animation

### `@keyframes PSAPAG_fadeIn`

Duration: `0.18s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.PSAPAG_overlay[data-open]`

```css
@keyframes PSAPAG_fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes PSAPAG_fadeOut`

Duration: `0.18s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `none`

Used by: `.PSAPAG_overlay[data-ending-style]`

```css
@keyframes PSAPAG_fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
```

> Opacity fade

### `@keyframes rWdRxW_statusFlash`

```css
@keyframes rWdRxW_statusFlash {
  0% {
    filter: brightness();
    animation-timing-function: var(--ease-out-cubic);
  }
  8% {
    filter: brightness(1.6);
    animation-timing-function: var(--ease-out-cubic);
  }
  60%, 100% {
    filter: brightness();
  }
}
```

> Filter effect (blur/brightness)

### `@keyframes rWdRxW_statusPulse`

```css
@keyframes rWdRxW_statusPulse {
  0% {
    opacity: 0.7;
    animation-timing-function: var(--ease-out-cubic);
    transform: scale(0.375);
  }
  60%, 100% {
    opacity: 0;
    transform: scale(1);
  }
}
```

> Fade + motion enter animation

### `@keyframes lAb7VG_highlight`

```css
@keyframes lAb7VG_highlight {
  20%, 80% {
    background-color: var(--bg);
  }
}
```

> Background color/gradient shift · Border animation

### `@keyframes UVNdXW_open`

```css
@keyframes UVNdXW_open {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
```

> Fade + motion enter animation

### `@keyframes UVNdXW_close`

```css
@keyframes UVNdXW_close {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.9);
  }
}
```

> Fade + motion enter animation

## Motion Tokens (CSS Variables)

### Duration Tokens

```css
--speed-highlightFadeOut: .15s;
--speed-quickTransition: .1s;
--speed-highlightFadeIn: 0s;
--speed-regularTransition: .25s;
```

### Easing Tokens

```css
--ease-out-quad: cubic-bezier(.25, .46, .45, .94);
--ease-in-out-quart: cubic-bezier(.77, 0, .175, 1);
--ease-in-out-circ: cubic-bezier(.785, .135, .15, .86);
--ease-out-quart: cubic-bezier(.165, .84, .44, 1);
--ease-in-circ: cubic-bezier(.6, .04, .98, .335);
--ease-in-quart: cubic-bezier(.895, .03, .685, .22);
--ease-in-out-cubic: cubic-bezier(.645, .045, .355, 1);
--ease-in-out-quint: cubic-bezier(.86, 0, .07, 1);
--ease-in-out-expo: cubic-bezier(1, 0, 0, 1);
--ease-out-circ: cubic-bezier(.075, .82, .165, 1);
--ease-out-quint: cubic-bezier(.23, 1, .32, 1);
--ease-in-quint: cubic-bezier(.755, .05, .855, .06);
--ease-in-quad: cubic-bezier(.55, .085, .68, .53);
--ease-out-expo: cubic-bezier(.19, 1, .22, 1);
--ease-out-cubic: cubic-bezier(.215, .61, .355, 1);
--ease-in-out-quad: cubic-bezier(.455, .03, .515, .955);
--ease-in-expo: cubic-bezier(.95, .05, .795, .035);
--ease-in-cubic: cubic-bezier(.55, .055, .675, .19);
--mask-ease: #0003;
```

## Global Transition Declarations

These `transition` values were extracted from CSS rules across the site:

```css
transition: transform 0.4s;
transition: transform 0.4s, opacity 0.4s, height 0.4s, box-shadow 0.2s;
transition: opacity 0.4s, box-shadow 0.2s;
transition: opacity 0.1s, background 0.2s, border-color 0.2s;
transition: opacity 0.4s;
transition: transform 0.5s, opacity 0.2s;
transition: opacity 0.2s, transform 0.2s;
transition: transform 0.5s cubic-bezier(0.32, 0.72, 0, 1);
transition: opacity 0.5s cubic-bezier(0.32, 0.72, 0, 1);
transition: opacity .2s var(--ease-out-quart);
transition: filter var(--speed-highlightFadeOut) var(--ease-out-cubic);
transition: all var(--speed-highlightFadeOut) var(--ease-out-cubic);
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
  transition: opacity .15s cubic-bezier(.25, .46, .45, .94),
              transform .15s cubic-bezier(.25, .46, .45, .94);
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Step 3 — Key Motion Principles

- **Duration scale:** `.15s` · `.1s` · `0s` · `.25s` · `0.4s` · `0.2s` — use these values, never invent new durations
- **Always add** `@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`

### Step 4 — Scroll Journey Reference

Match what happens at each scroll position:

- **0%** (`0px`) → `screens/scroll/scroll-000.png`
- **17%** (`1540px`) → `screens/scroll/scroll-017.png`
- **33%** (`2990px`) → `screens/scroll/scroll-033.png`
- **50%** (`4530px`) → `screens/scroll/scroll-050.png`
- **67%** (`6070px`) → `screens/scroll/scroll-067.png`
- **83%** (`7520px`) → `screens/scroll/scroll-083.png`
- **100%** (`9060px`) → `screens/scroll/scroll-100.png`

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
| `div._5l06ia_container.MwJdiW_root` | column | — | — | — | 3 |
| `main._5l06ia_content` | column | — | — | — | 2 |
| `nav.TZTsQG_menuRoot` | row | — | center | — | 1 |
| `section.dYXc1G_homepagePrefooter` | column | center | center | 40px | 2 |
| `div.ImRUSq_root.ImRUSq_column` | column | — | — | 8px | 2 |
| `div.ImRUSq_root.ImRUSq_column` | column | — | — | 8px | 2 |
| `div.ImRUSq_root.ImRUSq_column` | column | — | — | 8px | 2 |
| `header.qM9FAa_header` | row | space-between | center | — | 2 |
| `header._9Zs8oG_initiativesBoxHeader` | row | — | center | — | 1 |
| `div.ImRUSq_root.ImRUSq_column` | column | — | — | — | 5 |
| `div.ImRUSq_root.ImRUSq_column` | column | — | — | — | 5 |
| `div.ImRUSq_root.ImRUSq_column` | column | — | — | — | 5 |
| `div.ImRUSq_root.ImRUSq_column` | column | — | — | — | 5 |
| `div.Dc5tqa_authorInfoDesktop.ImRUSq_root` | column | — | — | — | 2 |
| `div.Dc5tqa_authorInfoDesktop.ImRUSq_root` | column | — | — | — | 2 |

## Structural Containers

### `<main>` (`main._5l06ia_content`)

```
display:          flex
flex-direction:   column
justify-content:  —
align-items:      —
padding:          72px 0px 0px
children:         2
```

### `<footer>` (`footer.Jmh1Wq_footer`)

```
display:          block
max-width:        100%
children:         1
```

### `<header>` (`header.TZTsQG_header`)

```
display:          block
children:         1
```

### `<nav>` (`nav.TZTsQG_menuRoot`)

```
display:          flex
flex-direction:   row
justify-content:  —
align-items:      center
children:         1
```

### `<section>` (`section.b-30Va_root.b-30Va_rootHomepage`)

```
display:          block
padding:          128px 0px
children:         3
```

### `<section>` (`section.b-30Va_root.b-30Va_rootHomepage`)

```
display:          block
padding:          128px 0px
children:         3
```

### `<section>` (`section.b-30Va_root.b-30Va_rootHomepage`)

```
display:          block
padding:          128px 0px
children:         3
```

### `<section>` (`section.b-30Va_root.b-30Va_rootHomepage`)

```
display:          block
padding:          128px 0px
children:         3
```

### `<section>` (`section#customers.Dc5tqa_container.hide-laptop`)

```
display:          block
children:         3
```

### `<section>` (`section.dYXc1G_homepagePrefooter`)

```
display:          flex
flex-direction:   column
justify-content:  center
align-items:      center
gap:              40px
children:         2
```

### `<header>` (`header.qM9FAa_header`)

```
display:          flex
flex-direction:   row
justify-content:  space-between
align-items:      center
padding:          20px 23px 19px
children:         2
```

### `<header>` (`header._9Zs8oG_initiativesBoxHeader`)

```
display:          flex
flex-direction:   row
justify-content:  —
align-items:      center
padding:          24px 32px 0px
children:         1
```

## Layout Rules

- **Container max-width:** `100%` — always center with `margin: auto`
- Primary layout system: **Flexbox**
- Every spacing value must be a multiple of **4px**
- Never use arbitrary margin/padding values outside the spacing scale

## Component Patterns (COMPONENTS.md)

# Component Reference

> Repeated DOM patterns detected by structural analysis. Each component appeared 3+ times.

## Detected Components

| Component | Category | Instances | Key Classes |
|-----------|----------|-----------|-------------|
| **Mmx1Wq NavItem** | card | 11× | `.Mmx1Wq_navItem` |
| **I MUeq Root** | unknown | 5× | `.I_mUeq_root`, `.TZTsQG_anchor` |
| **B0yXq Root** | unknown | 5× | `.-B0yXq_root` |
| **GJ9TEa PurposeLift** | unknown | 5× | `.GJ9TEa_purposeLift` |
| **GJ9TEa PurposeEdge** | unknown | 5× | `.GJ9TEa_purposeEdge` |
| **ImRUSq Align Center** | unknown | 4× | `.ImRUSq_align-center`, `.ImRUSq_root` |
| **KFZpfa CategoryTitle** | unknown | 4× | `.KFZpfa_categoryTitle`, `.dvwHH`, `.sc-KOGVz` |
| **KFZpfa PropertyRow** | unknown | 4× | `.KFZpfa_propertyRow` |
| **MR81zG Item** | card | 4× | `.MR81zG_item` |
| **B 30Va Root** | unknown | 4× | `.b-30Va_root`, `.b-30Va_rootHomepage` |
| **B 30Va Header** | unknown | 4× | `.b-30Va_header` |
| **Fzcv4W Inset** | unknown | 4× | `.Fzcv4W_inset`, `.Fzcv4W_insetLarge`, `.b-30Va_titleContainer` |
| **B 30Va Title** | unknown | 4× | `.b-30Va_title`, `.lmPTvT`, `.sc-KOGVz` |
| **TZTsQG Item** | card | 3× | `.TZTsQG_item`, `.hide-tablet` |
| **ImRUSq Root** | unknown | 3× | `.ImRUSq_root` |
| **KFZpfa ActivityListRow** | unknown | 3× | `.KFZpfa_activityListRow` |
| **KFZpfa Category** | unknown | 3× | `.KFZpfa_category` |
| **GJ9TEa Benefit** | unknown | 3× | `.GJ9TEa_benefit`, `._9PBFba_a` |
| **GPncVY** | unknown | 3× | `.gPncVY`, `.sc-KOGVz` |
| **KFzTUE** | unknown | 3× | `.kFzTUE`, `.sc-KOGVz` |

## Cards

### Mmx1Wq NavItem

**Instances found:** 11

**CSS classes:** `.Mmx1Wq_navItem`

**HTML structure:**

```html
<button data-active="false" data-interactive="true" class="Mmx1Wq_navItem"><svg width="14" height="14" viewBox="0 0 16 16" role="img" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" class="sx-13wgh6h sx-31pjnn sx-m5nenu sx-1fwcy2r sx-13jp3wb sx-18202ia sx-ge2tmq" style="--x---icon-default-color:#9c9da1" fill="#9c9da1"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.3354 1.08228C11.7059 1.27438 11.8561 1.74156 11.6708 2.12576L9.5593 6.50508C9.39923 6.83707 9.64113 7.22224 10.0097 7.22224H14C14 7.22224 14.2275 7.22219 14.25 7.22219C14.6642 7.22219 15 7.57041 15 7.999
```

**Base styles (from design tokens):**

```css
.Mmx1Wq_navItem {
  background: #f4f2f4;
  border: 1px solid #191d20;
  border-radius: 9px;
  padding: 8px;
}```

### MR81zG Item

**Instances found:** 4

**CSS classes:** `.MR81zG_item`

**HTML structure:**

```html
<li class="MR81zG_item"><svg width="57" height="40" viewBox="61.5 8 57 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg" overflow="visible"><g transform="translate(61.5 8)"><path fill-rule="evenodd" clip-rule="evenodd" d="M23.7479 4.3625C25.5757 2.44375 28.1159 1.25 30.9287 1.25C34.6709 1.25 37.9298 3.35625 39.6708 6.475C41.1825 5.79375 42.8553 5.4125 44.6087 5.4125C51.3558 5.4125 56.8203 10.975 56.8203 17.8437C56.8203 24.7125 51.3496 30.275 44.6087 30.275C43.7847 30.275 42.9792 30.1937 42.2048 30.0312C40.6745 32.7812 37.7563 34.6438 34.4107 34.6438C33.0104 34.6438 31.6846 34.3187 30.
```

**Base styles (from design tokens):**

```css
.MR81zG_item {
  background: #f4f2f4;
  border: 1px solid #191d20;
  border-radius: 9px;
  padding: 8px;
}```

### TZTsQG Item

**Instances found:** 3

**CSS classes:** `.TZTsQG_item` `.hide-tablet`

**HTML structure:**

```html
<li class="hide-tablet TZTsQG_item"><a href="/customers" class="TZTsQG_anchor I_mUeq_root" rel="noopener">Customers</a></li>
```

**Base styles (from design tokens):**

```css
.TZTsQG_item {
  background: #f4f2f4;
  border: 1px solid #191d20;
  border-radius: 9px;
  padding: 8px;
}```

## Other Components

### I MUeq Root

**Instances found:** 5

**CSS classes:** `.I_mUeq_root` `.TZTsQG_anchor`

**HTML structure:**

```html
<a href="/customers" class="TZTsQG_anchor I_mUeq_root" rel="noopener">Customers</a>
```

**Base styles (from design tokens):**

```css
.I_mUeq_root {
  background: #f4f2f4;
  padding: 4px;
}```

### B0yXq Root

**Instances found:** 5

**CSS classes:** `.-B0yXq_root`

**HTML structure:**

```html
<div class="-B0yXq_root"><div class="WS84WW_wrapper" aria-label="A screenshot of the Linear app showing the issue that's currently in progress"><div class="WS84WW_background" aria-hidden="true" style="opacity:0"></div><div class="WS84WW_shadows hide-laptop" style="opacity:0"><img src="https://linear.app/cdn-cgi/imagedelivery/fO02fVwohEs9s9UHFwon6A/6600ca96-e49b-4fd9-c03a-7979faddad00/f=auto,fit=scale-down,metadata=none,width=2560" alt="" width="1920" height="1080" loading="lazy" decoding="async" class="Sz_9La_root" data-nimg="1" data-nosnippet="true" data-loaded="false"></div><div class="WS84W
```

**Base styles (from design tokens):**

```css
.-B0yXq_root {
  background: #f4f2f4;
  padding: 4px;
}```

### GJ9TEa PurposeLift

**Instances found:** 5

**CSS classes:** `.GJ9TEa_purposeLift`

**HTML structure:**

```html
<g class="GJ9TEa_purposeLift" style="--lift-delay:0s"><path fill="#08090A" d="M250.355 179.668a3.43 3.43 0 0 1 1.895 3.067v16.302a3.43 3.43 0 0 1-1.895 3.067L136.85 258.855a10.29 10.29 0 0 1-9.2 0L14.145 202.103a3.43 3.43 0 0 1-1.895-3.067V182.735c0-1.299.734-2.486 1.895-3.067L129.183 122.149a6.86 6.86 0 0 1 6.134 0z"></path><path stroke="#D0D6E0" stroke-width="0.5" d="M14.145 202.103a3.43 3.43 0 0 1-1.895-3.067V182.735c0-1.299.734-2.486 1.895-3.067L129.183 122.149a6.86 6.86 0 0 1 6.134 0L250.355 179.668a3.43 3.43 0 0 1 1.895 3.067v16.302a3.43 3.43 0 0 1-1.895 3.067"></path><path class="GJ9TEa
```

**Base styles (from design tokens):**

```css
.GJ9TEa_purposeLift {
  background: #f4f2f4;
  padding: 4px;
}```

### GJ9TEa PurposeEdge

**Instances found:** 5

**CSS classes:** `.GJ9TEa_purposeEdge`

**HTML structure:**

```html
<path class="GJ9TEa_purposeEdge" stroke="#D0D6E0" stroke-width="0.5" d="M250.355 202.103L136.85 258.855a10.29 10.29 0 0 1-9.2 0L14.145 202.103"></path>
```

**Base styles (from design tokens):**

```css
.GJ9TEa_purposeEdge {
  background: #f4f2f4;
  padding: 4px;
}```

### ImRUSq Align Center

**Instances found:** 4

**CSS classes:** `.ImRUSq_align-center` `.ImRUSq_root`

**HTML structure:**

```html
<div class="ImRUSq_root ImRUSq_align-center" style="gap:8px"><span class="sc-KOGVz gbPGKr KFZpfa_counter"><span class="sc-KOGVz ksYBsH">1</span> / 84</span><div class="ImRUSq_root"><button aria-label="Previous issue" class="_1uFtza_navButton" tabindex="-1"><svg width="14" height="14" viewBox="0 0 16 16" role="img" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" class="sx-13wgh6h sx-31pjnn sx-m5nenu sx-1fwcy2r sx-13jp3wb sx-18202ia sx-ge2tmq" style="--x---icon-default-color:var(--color-text-quaternary)" fill="var(--color-text-quaternary)"><path d="M11.48 5.674a.75.75 0 1
```

**Base styles (from design tokens):**

```css
.ImRUSq_align-center {
  background: #f4f2f4;
  padding: 4px;
}```

### KFZpfa CategoryTitle

**Instances found:** 4

**CSS classes:** `.KFZpfa_categoryTitle` `.dvwHH` `.sc-KOGVz`

**HTML structure:**

```html
<span class="sc-KOGVz dvwHH KFZpfa_categoryTitle">Reviews</span>
```

**Base styles (from design tokens):**

```css
.KFZpfa_categoryTitle {
  background: #f4f2f4;
  padding: 4px;
}```

### KFZpfa PropertyRow

**Instances found:** 4

**CSS classes:** `.KFZpfa_propertyRow`

**HTML structure:**

```html
<div class="KFZpfa_propertyRow"><svg width="16" height="16" viewBox="0 0 16 16" role="img" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" class="sx-13wgh6h sx-31pjnn sx-m5nenu sx-1fwcy2r sx-13jp3wb sx-18202ia sx-ge2tmq" style="--x---icon-default-color:var(--color-indigo)" fill="var(--color-indigo)"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.98535 2.75C11.78 2.75037 13.2354 4.2053 13.2354 6V10.1094C14.2573 10.4233 15 11.3752 15 12.5C15 13.8807 13.8807 15 12.5 15C12.4974 15 12.4948 14.999 12.4922 14.999C12.4899 14.999 12.4876 15 12.4854 15C11.1047 15 9.98543 13.
```

**Base styles (from design tokens):**

```css
.KFZpfa_propertyRow {
  background: #f4f2f4;
  padding: 4px;
}```

### B 30Va Root

**Instances found:** 4

**CSS classes:** `.b-30Va_root` `.b-30Va_rootHomepage`

**HTML structure:**

```html
<section class="b-30Va_root b-30Va_rootHomepage"><div class="b-30Va_header"><div class="Fzcv4W_inset Fzcv4W_insetLarge b-30Va_titleContainer"><h2 class="sc-KOGVz lmPTvT b-30Va_title" style="max-width:18ch">Intake<br>and integrations</h2></div><div class="Fzcv4W_inset b-30Va_descriptionContainer"><p class="sc-KOGVz ePlzPw b-30Va_descriptionText">Automatically turn conversations and cus…</p><div class="b-30Va_actionWrapper"><a href="/intake" class="qqCMlG_root I_mUeq_root" rel="noopener"><span class="sc-KOGVz dBXtTb qqCMlG_label">Learn more</span><span class="sc-KOGVz dBXtTb qqCMlG_suffix" style
```

**Base styles (from design tokens):**

```css
.b-30Va_root {
  background: #f4f2f4;
  padding: 4px;
}```

### B 30Va Header

**Instances found:** 4

**CSS classes:** `.b-30Va_header`

**HTML structure:**

```html
<div class="b-30Va_header"><div class="Fzcv4W_inset Fzcv4W_insetLarge b-30Va_titleContainer"><h2 class="sc-KOGVz lmPTvT b-30Va_title" style="max-width:18ch">Intake<br>and integrations</h2></div><div class="Fzcv4W_inset b-30Va_descriptionContainer"><p class="sc-KOGVz ePlzPw b-30Va_descriptionText">Automatically turn conversations and cus…</p><div class="b-30Va_actionWrapper"><a href="/intake" class="qqCMlG_root I_mUeq_root" rel="noopener"><span class="sc-KOGVz dBXtTb qqCMlG_label">Learn more</span><span class="sc-KOGVz dBXtTb qqCMlG_suffix" style="margin-left:6px"><span>→</span></span></a></div
```

**Base styles (from design tokens):**

```css
.b-30Va_header {
  background: #f4f2f4;
  padding: 4px;
}```

### Fzcv4W Inset

**Instances found:** 4

**CSS classes:** `.Fzcv4W_inset` `.Fzcv4W_insetLarge` `.b-30Va_titleContainer`

**HTML structure:**

```html
<div class="Fzcv4W_inset Fzcv4W_insetLarge b-30Va_titleContainer"><h2 class="sc-KOGVz lmPTvT b-30Va_title" style="max-width:18ch">Intake<br>and integrations</h2></div>
```

**Base styles (from design tokens):**

```css
.Fzcv4W_inset {
  background: #f4f2f4;
  padding: 4px;
}```

### B 30Va Title

**Instances found:** 4

**CSS classes:** `.b-30Va_title` `.lmPTvT` `.sc-KOGVz`

**HTML structure:**

```html
<h2 class="sc-KOGVz lmPTvT b-30Va_title" style="max-width:18ch">Intake<br>and integrations</h2>
```

**Base styles (from design tokens):**

```css
.b-30Va_title {
  background: #f4f2f4;
  padding: 4px;
}```

### ImRUSq Root

**Instances found:** 3

**CSS classes:** `.ImRUSq_root`

**HTML structure:**

```html
<div class="ImRUSq_root" style="gap:6px"><button class="Mmx1Wq_searchButton" aria-label="Search workspace" tabindex="-1"><svg width="16" height="16" viewBox="0 0 16 16" role="img" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" class="sx-13wgh6h sx-31pjnn sx-m5nenu sx-1fwcy2r sx-13jp3wb sx-18202ia sx-ge2tmq" style="--x---icon-default-color:currentColor" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 2C9.76142 2 12 4.23858 12 7C12 8.11012 11.6375 9.13519 11.0254 9.96484L13.7803 12.7197L13.832 12.7764C14.0723 13.0709 14.0549 13.5057 13.7803 13.780
```

**Base styles (from design tokens):**

```css
.ImRUSq_root {
  background: #f4f2f4;
  padding: 4px;
}```

### KFZpfa ActivityListRow

**Instances found:** 3

**CSS classes:** `.KFZpfa_activityListRow`

**HTML structure:**

```html
<div class="KFZpfa_activityListRow"><div class="KFZpfa_activityIconSlot"><div class="sx-78zum5 sx-1n2onr6 sx-6s0dn4 sx-l56j7k sx-14ju556 sx-2lah0s sx-1y5e3q9 sx-5lhr3w sx-16ye13r" style="--x-width:14px;--x-height:14px;height:14px;width:14px"><img src="https://webassets.linear.app/images/ornj730p/production/f79251b06e9edeeacbf2875384defe629e000b3c-352x352.png?w=72&amp;q=95&amp;auto=format&amp;dpr=2" width="14" height="14" alt="Avatar of Karri" class="sx-16rqkct sx-h8yej3 sx-5yr21d sx-47corl sx-l1xv1r"></div></div><div class="KFZpfa_activityText"><span><span class="sc-KOGVz dYCPFa">Linear</span>
```

**Base styles (from design tokens):**

```css
.KFZpfa_activityListRow {
  background: #f4f2f4;
  padding: 4px;
}```

### KFZpfa Category

**Instances found:** 3

**CSS classes:** `.KFZpfa_category`

**HTML structure:**

```html
<div class="KFZpfa_category"><span class="sc-KOGVz dvwHH KFZpfa_categoryTitle">Reviews</span><div class="KFZpfa_propertyRow"><svg width="16" height="16" viewBox="0 0 16 16" role="img" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" class="sx-13wgh6h sx-31pjnn sx-m5nenu sx-1fwcy2r sx-13jp3wb sx-18202ia sx-ge2tmq" style="--x---icon-default-color:var(--color-indigo)" fill="var(--color-indigo)"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.98535 2.75C11.78 2.75037 13.2354 4.2053 13.2354 6V10.1094C14.2573 10.4233 15 11.3752 15 12.5C15 13.8807 13.8807 15 12.5 15C12.4974
```

**Base styles (from design tokens):**

```css
.KFZpfa_category {
  background: #f4f2f4;
  padding: 4px;
}```

### GJ9TEa Benefit

**Instances found:** 3

**CSS classes:** `.GJ9TEa_benefit` `._9PBFba_a`

**HTML structure:**

```html
<div class="GJ9TEa_benefit _9PBFba_a"><span class="sc-KOGVz eHoboT GJ9TEa_figure" style="opacity:0.4">Fig 0.1</span><div class="GJ9TEa_illustration"><svg xmlns="http://www.w3.org/2000/svg" width="265" height="262" fill="none" viewBox="0 0 265 262" style="--purpose-lift:31.667px"><g class="GJ9TEa_purposeLift" style="--lift-delay:0s"><path fill="#08090A" d="M250.355 179.668a3.43 3.43 0 0 1 1.895 3.067v16.302a3.43 3.43 0 0 1-1.895 3.067L136.85 258.855a10.29 10.29 0 0 1-9.2 0L14.145 202.103a3.43 3.43 0 0 1-1.895-3.067V182.735c0-1.299.734-2.486 1.895-3.067L129.183 122.149a6.86 6.86 0 0 1 6.134 0z">
```

**Base styles (from design tokens):**

```css
.GJ9TEa_benefit {
  background: #f4f2f4;
  padding: 4px;
}```

### GPncVY

**Instances found:** 3

**CSS classes:** `.gPncVY` `.sc-KOGVz`

**HTML structure:**

```html
<span class="sc-KOGVz gPncVY">Purpose-built</span>
```

**Base styles (from design tokens):**

```css
.gPncVY {
  background: #f4f2f4;
  padding: 4px;
}```

### KFzTUE

**Instances found:** 3

**CSS classes:** `.kFzTUE` `.sc-KOGVz`

**HTML structure:**

```html
<p class="sc-KOGVz kFzTUE">Linear is shaped by the practices and principles of world-class product teams.</p>
```

**Base styles (from design tokens):**

```css
.kFzTUE {
  background: #f4f2f4;
  padding: 4px;
}```

## Component Rules

- Match class names exactly from the patterns above
- Each component instance must be visually identical to others of its type
- Do not add extra wrappers or change the DOM structure
- Use `#191d20` for all dividers within components
- Use `#7170ff` for all interactive/active states

## Interactions & States (INTERACTIONS.md)

# Interaction Reference

> Micro-interactions extracted from live DOM. Recreate these exactly for authentic feel.

## Coverage

| Component Type | Count | States Captured |
|----------------|-------|----------------|
| Button | 3 | default, hover, focus |
| Role Button | 2 | default, hover, focus |
| Link | 3 | default, hover, focus |
| Input | 1 | default, hover, focus |

## Transition System

These transition declarations were extracted from interactive elements:

```css
transition: color 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94), background 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
transition: background 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94);
transition: border 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94), color 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94);
transition: all;
```

Apply these to all interactive elements. Never invent new durations or easings.

## Button Interactions

### Button 1 — `Product`

**States:**

- Default: `../screens/states/button-1-default.png`
- Hover: `../screens/states/button-1-hover.png`
- Focus: `../screens/states/button-1-focus.png`

**On hover:**

```css
/* background-color: rgba(0, 0, 0, 0) → */ background-color: rgba(255, 255, 255, 0.08);
/* color: rgb(138, 143, 152) → */ color: rgb(247, 248, 248);
/* border-color: rgb(138, 143, 152) → */ border-color: rgb(247, 248, 248);
```

**On focus:**

```css
/* outline: rgba(0, 0, 0, 0) none 3px → */ outline: rgb(94, 105, 209) solid 1px;
/* outline-color: rgba(0, 0, 0, 0) → */ outline-color: rgb(94, 105, 209);
```

**Transition:** `color 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94), background 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)`

### Button 2 — `Resources`

**States:**

- Default: `../screens/states/button-2-default.png`
- Hover: `../screens/states/button-2-hover.png`
- Focus: `../screens/states/button-2-focus.png`

**On hover:**

```css
/* background-color: rgba(0, 0, 0, 0) → */ background-color: rgba(255, 255, 255, 0.08);
/* color: rgb(138, 143, 152) → */ color: rgb(247, 248, 248);
/* border-color: rgb(138, 143, 152) → */ border-color: rgb(247, 248, 248);
```

**On focus:**

```css
/* outline: rgba(0, 0, 0, 0) none 3px → */ outline: rgb(94, 105, 209) solid 1px;
/* outline-color: rgba(0, 0, 0, 0) → */ outline-color: rgb(94, 105, 209);
```

**Transition:** `color 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94), background 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)`

### Button 3 — `Linear`

**States:**

- Default: `../screens/states/button-3-default.png`
- Hover: `../screens/states/button-3-hover.png`
- Focus: `../screens/states/button-3-focus.png`

**On hover:**

```css
/* background-color: rgba(0, 0, 0, 0) → */ background-color: rgba(255, 255, 255, 0.03);
```

**On focus:**

```css
/* outline: rgba(0, 0, 0, 0) none 3px → */ outline: rgb(94, 105, 209) solid 1px;
/* outline-color: rgba(0, 0, 0, 0) → */ outline-color: rgb(94, 105, 209);
```

**Transition:** `background 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94)`

## Role Button Interactions

### Role Button 1 — `Get started`

**States:**

- Default: `../screens/states/role-button-1-default.png`
- Hover: `../screens/states/role-button-1-hover.png`
- Focus: `../screens/states/role-button-1-focus.png`

**On hover:**

```css
/* background-color: rgb(229, 229, 230) → */ background-color: rgb(255, 255, 255);
```

**On focus:**

```css
/* outline: rgba(0, 0, 0, 0) none 3px → */ outline: rgb(94, 105, 209) solid 1px;
/* outline-color: rgba(0, 0, 0, 0) → */ outline-color: rgb(94, 105, 209);
```

**Transition:** `border 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94), color 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94)`

### Role Button 2 — `Contact sales`

**States:**

- Default: `../screens/states/role-button-2-default.png`
- Hover: `../screens/states/role-button-2-hover.png`
- Focus: `../screens/states/role-button-2-focus.png`

**On hover:**

```css
/* background-color: rgba(255, 255, 255, 0.05) → */ background-color: rgb(25, 26, 27);
```

**On focus:**

```css
/* outline: rgba(0, 0, 0, 0) none 3px → */ outline: rgb(94, 105, 209) solid 1px;
/* outline-color: rgba(0, 0, 0, 0) → */ outline-color: rgb(94, 105, 209);
```

**Transition:** `border 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94), color 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94)`

## Link Interactions

### Link 1 — `Navigate to home`

**States:**

- Default: `../screens/states/link-1-default.png`
- Hover: `../screens/states/link-1-hover.png`
- Focus: `../screens/states/link-1-focus.png`

**On focus:**

```css
/* outline: rgba(0, 0, 0, 0) none 3px → */ outline: rgb(94, 105, 209) solid 1px;
/* outline-color: rgba(0, 0, 0, 0) → */ outline-color: rgb(94, 105, 209);
```

**Transition:** `all`

### Link 2 — `Customers`

**States:**

- Default: `../screens/states/link-2-default.png`
- Hover: `../screens/states/link-2-hover.png`
- Focus: `../screens/states/link-2-focus.png`

**On hover:**

```css
/* background-color: rgba(0, 0, 0, 0) → */ background-color: rgba(255, 255, 255, 0.08);
/* color: rgb(138, 143, 152) → */ color: rgb(247, 248, 248);
/* border-color: rgb(138, 143, 152) → */ border-color: rgb(247, 248, 248);
```

**On focus:**

```css
/* outline: rgba(0, 0, 0, 0) none 3px → */ outline: rgb(94, 105, 209) solid 1px;
/* outline-color: rgba(0, 0, 0, 0) → */ outline-color: rgb(94, 105, 209);
```

**Transition:** `color 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94), background 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)`

### Link 3 — `Pricing`

**States:**

- Default: `../screens/states/link-3-default.png`
- Hover: `../screens/states/link-3-hover.png`
- Focus: `../screens/states/link-3-focus.png`

**On hover:**

```css
/* background-color: rgba(0, 0, 0, 0) → */ background-color: rgba(255, 255, 255, 0.08);
/* color: rgb(138, 143, 152) → */ color: rgb(247, 248, 248);
/* border-color: rgb(138, 143, 152) → */ border-color: rgb(247, 248, 248);
```

**On focus:**

```css
/* outline: rgba(0, 0, 0, 0) none 3px → */ outline: rgb(94, 105, 209) solid 1px;
/* outline-color: rgba(0, 0, 0, 0) → */ outline-color: rgb(94, 105, 209);
```

**Transition:** `color 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94), background 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)`

## Input Interactions

### Input 1 — `input`

**States:**

- Default: `../screens/states/input-1-default.png`
- Hover: `../screens/states/input-1-hover.png`
- Focus: `../screens/states/input-1-focus.png`

**Transition:** `all`

_No visible style changes detected for this element._

## Interaction Rules

- Accent color `#7170ff` is used for focus rings, active states, and hover highlights
- Hover effects include **color transitions** — use the extracted values, not approximations
- Focus states use **outline** (not box-shadow) — always match the extracted focus ring
- Transition durations in use: `0.1s`, `0.16s`
- Always respect `prefers-reduced-motion` — set all transitions to `0s` when enabled

## Design Tokens — JSON Files

### tokens/colors.json
```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "core": {
    "background": {
      "value": "#ffffff",
      "role": "background",
      "name": "header-border"
    },
    "text-muted": {
      "value": "#b4bcd0",
      "role": "text-muted",
      "name": "color-text-secondary"
    },
    "text-primary": {
      "value": "#080808",
      "role": "text-primary",
      "name": "theme-color"
    },
    "border": {
      "value": "#191d20",
      "role": "border",
      "name": "border-faint-thin"
    },
    "surface": {
      "value": "#f4f2f4",
      "role": "surface",
      "name": "color-bg-tertiary"
    },
    "accent": {
      "value": "#828fff",
      "role": "accent",
      "name": "color-link-primary"
    }
  },
  "status": {
    "danger": {
      "value": "#f34e52",
      "role": "danger",
      "name": "color-red"
    },
    "success": {
      "value": "#27a644",
      "role": "success",
      "name": "color-green"
    }
  },
  "extended": {
    "color-text-quaternary": {
      "value": "#6b6b6b",
      "role": "unknown",
      "name": "color-text-quaternary"
    },
    "color-9c9da1": {
      "value": "#9c9da1",
      "role": "unknown"
    },
    "border-solid": {
      "value": "#2a2e33",
      "role": "unknown",
      "name": "border-solid"
    },
    "color-button-invert-bg": {
      "value": "#e2e4e7",
      "role": "unknown",
      "name": "color-button-invert-bg"
    },
    "color-indigo": {
      "value": "#5e6ad2",
      "role": "info",
      "name": "color-indigo"
    },
    "color-585a5c": {
      "value": "#585a5c",
      "role": "unknown"
    },
    "color-6d78d5": {
      "value": "#6d78d5",
      "role": "unknown"
    },
    "color-border-tertiary": {
      "value": "#3e3e44",
      "role": "unknown",
      "name": "color-border-tertiary"
    },
    "color-blue": {
      "value": "#4ea7fc",
      "role": "unknown",
      "name": "color-blue"
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
    "Inter Variable",
    "Berkeley Mono"
  ],
  "scale": {
    "heading-1": {
      "fontFamily": "Inter Variable",
      "fontSize": "40px",
      "fontWeight": "700",
      "lineHeight": null,
      "source": "css"
    },
    "heading-2": {
      "fontFamily": "Inter Variable",
      "fontSize": "38px",
      "fontWeight": "700",
      "lineHeight": null,
      "source": "css"
    },
    "heading-3": {
      "fontFamily": "Inter Variable",
      "fontSize": "2.25rem",
      "fontWeight": "700",
      "lineHeight": null,
      "source": "css"
    },
    "body": {
      "fontFamily": "Inter Variable",
      "fontSize": "13px",
      "fontWeight": "400",
      "lineHeight": null,
      "source": "css"
    },
    "caption": {
      "fontFamily": "Inter Variable",
      "fontSize": "12px",
      "fontWeight": "400",
      "lineHeight": null,
      "source": "css"
    },
    "code": {
      "fontFamily": "Berkeley Mono",
      "fontSize": "14px",
      "fontWeight": "400",
      "lineHeight": null,
      "source": "css"
    }
  },
  "fontFaces": [
    {
      "family": "Inter Variable",
      "src": "https://static.linear.app/fonts/InterVariable.woff2?v=4.1",
      "format": "woff2",
      "weight": "100"
    },
    {
      "family": "Inter Variable",
      "src": "https://static.linear.app/fonts/InterVariable-Italic.woff2?v=4.1",
      "format": "woff2",
      "weight": "100"
    },
    {
      "family": "Berkeley Mono",
      "src": "https://static.linear.app/fonts/Berkeley-Mono-Variable.woff2?v=3.2",
      "format": "woff2",
      "weight": "100"
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

- `fonts/BerkeleyMono-100.woff2`
- `fonts/InterVariable-100.woff2`

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

![customers.png](screens/pages/customers.png)

![home.png](screens/pages/home.png)

![homepage.png](screens/pages/homepage.png)

![now.png](screens/pages/now.png)

![pricing.png](screens/pages/pricing.png)

### Section Clips (screens/sections/)

*Clipped individual sections and components*

![customers-section-2.png](screens/sections/customers-section-2.png)

![home-section-8.png](screens/sections/home-section-8.png)

![homepage-section-8.png](screens/sections/homepage-section-8.png)

![now-section-2.png](screens/sections/now-section-2.png)

![pricing-section-3.png](screens/sections/pricing-section-3.png)

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

![input-1-hover.png](screens/states/input-1-hover.png)

![link-1-default.png](screens/states/link-1-default.png)

![link-1-focus.png](screens/states/link-1-focus.png)

![link-1-hover.png](screens/states/link-1-hover.png)

![link-2-default.png](screens/states/link-2-default.png)

![link-2-focus.png](screens/states/link-2-focus.png)

![link-2-hover.png](screens/states/link-2-hover.png)

![link-3-default.png](screens/states/link-3-default.png)

![link-3-focus.png](screens/states/link-3-focus.png)

![link-3-hover.png](screens/states/link-3-hover.png)

![role-button-1-default.png](screens/states/role-button-1-default.png)

![role-button-1-focus.png](screens/states/role-button-1-focus.png)

![role-button-1-hover.png](screens/states/role-button-1-hover.png)

![role-button-2-default.png](screens/states/role-button-2-default.png)

![role-button-2-focus.png](screens/states/role-button-2-focus.png)

![role-button-2-hover.png](screens/states/role-button-2-hover.png)

### Screenshot Index (screens/INDEX.md)

# Screenshot Index

## Scroll Journey

> Shows the cinematic state at each point of the page

| Scroll | Y Position | File |
|--------|-----------|------|
| 0% | 0px | `screens/scroll/scroll-000.png` |
| 17% | 1540px | `screens/scroll/scroll-017.png` |
| 33% | 2990px | `screens/scroll/scroll-033.png` |
| 50% | 4530px | `screens/scroll/scroll-050.png` |
| 67% | 6070px | `screens/scroll/scroll-067.png` |
| 83% | 7520px | `screens/scroll/scroll-083.png` |
| 100% | 9060px | `screens/scroll/scroll-100.png` |

## Pages

| Page | URL | File |
|------|-----|------|
| Linear – The system for product development | `https://linear.app` | `screens/pages/home.png` |
| Linear – The system for product development | `https://linear.app/homepage` | `screens/pages/homepage.png` |
| Linear Customers | `https://linear.app/customers` | `screens/pages/customers.png` |
| Pricing – Linear | `https://linear.app/pricing` | `screens/pages/pricing.png` |
| Now – Updates from the Linear team | `https://linear.app/now` | `screens/pages/now.png` |

## Sections

| Page | Section | File |
|------|---------|------|
| home | #8 (main > div) | `screens/sections/home-section-8.png` |
| homepage | #8 (main > div) | `screens/sections/homepage-section-8.png` |
| customers | #2 (header) | `screens/sections/customers-section-2.png` |
| pricing | #3 (main > div) | `screens/sections/pricing-section-3.png` |
| now | #2 (header) | `screens/sections/now-section-2.png` |

## Homepage Screenshots (screenshots/)

![homepage.png](screenshots/homepage.png)

