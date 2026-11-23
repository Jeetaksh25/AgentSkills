---
name: splitwise-design
description: Design system skill for splitwise. Activate when building UI components, pages, or any visual elements. Provides exact color tokens, typography scale, spacing grid, component patterns, and craft rules. Read references/DESIGN.md before writing any CSS or JSX. Includes ultra-mode visual journey: read references/ANIMATIONS.md, references/LAYOUT.md, references/COMPONENTS.md, and references/INTERACTIONS.md for full motion and layout details.
---

# splitwise Design System

You are building UI for **splitwise**. Light-themed, neutral palette, sans-serif typography (Montserrat), compact density on a 4px grid, expressive motion.

## Visual Reference

**IMPORTANT**: Study ALL screenshots below before writing any UI. Match colors, typography, spacing, layout, and motion exactly as shown.

### Homepage

![splitwise Homepage](screenshots/homepage.png)

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

- **Web Animations API (5 active)** — animation

## Design Philosophy

- **Layered depth** — use shadow tokens to create a sense of physical layering. Each elevation level has a specific shadow.
- **Gradient accents** — gradients are used thoughtfully for emphasis, not decoration.
- **Type pairing** — Montserrat for body/UI text, Lato for headings/display. Never introduce a third typeface.
- **compact density** — 4px base grid. Every dimension is a multiple of 4.
- **neutral palette** — the color temperature runs neutral, matching the sans-serif typography.
- **Expressive motion** — animations are an integral part of the experience. Use spring physics and layout animations.

## Color System

### Core Palette

| Role | Token | Hex | Use |
|------|-------|-----|-----|
| Background | `--background` | `#ffffff` | Page/app background |
| Surface | `--surface` | `#1cc29f` | Cards, panels, modals |
| Text Primary | `--text-primary` | `#000000` | Headings, body text |
| Text Muted | `--text-muted` | `#52595f` | Captions, placeholders |
| Border | `--border` | `#373b3f` | Dividers, card borders |

### Status Colors

| Status | Hex | Use |
|--------|-----|-----|
| Success | `#18a582` | Confirmations, positive trends |
| Danger | `#b4002b` | Errors, destructive actions |

### Extended Palette

- **border-separator:** `#e6e8ee` — Light surface or highlight color
- `#8656cd`
- `#92969a`
- **text-states-success:** `#16715e` — Confirmations, positive trend indicators
- **text-branded-brand:** `#1d856c` — Core brand color
- **bg-secondary:** `#f3f4f8` — Secondary text, placeholder text
- **text-pro-badge-active:** `#421076`
- **text-neutral-disabled:** `#bdc9d4`

### CSS Variable Tokens

```css
--text-neutral-primary: #373b3f;
--text-neutral-primary-inverse: #fff;
--text-neutral-secondary: #52595f;
--border-separator: #e6e8ee;
--border-separator-inverse: #373b3f;
--border-interactive: #6d767e;
--border-interactive-active: #373b3f;
--border-states-error-field: #920829;
--border-states-error-message: #f2c9d4;
--border-states-success-message: #daf7f0;
--border-states-caution-message: #f2efbf;
--border-states-alert-message: #ffddd1;
--border-states-info-message: #d3dbe4;
--border-disabled: #d3dbe4;
--border-focus: #f96817;
--border-pro-surface: #bb85ed;
--border-pro-interactive-active: #e4cafc;
--border-pro-ghost-button: #cea8f1;
--border-pro-ghost-button-inverse: #421076;
--border-pro-notice: #7b44b5;
```

## Typography

### Font Stack

- **Montserrat** — Heading 1, Heading 2, Heading 3
- **Lato** — Body, Caption
- **Menlo** — Code

### Font Sources

```css
@font-face {
  font-family: "Lato";
  src: url("fonts/Lato-Bold.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "Lato";
  src: url("fonts/Lato-Regular.ttf") format("truetype");
  font-weight: 400;
}
@font-face {
  font-family: "Montserrat";
  src: url("fonts/Montserrat-Bold.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "Montserrat";
  src: url("fonts/Montserrat-Regular.ttf") format("truetype");
  font-weight: 400;
}
```

### Type Scale

| Role | Family | Size | Weight |
|------|--------|------|--------|
| Heading 1 | Montserrat | 144px | 700 |
| Heading 2 | Montserrat | 68px | 700 |
| Heading 3 | Montserrat | 60px | 700 |
| Body | Lato | 16px | 400 |
| Caption | Lato | 14px | 400 |
| Code | Menlo | 14px | 400 |

### Typography Rules

- Body/UI: **Montserrat**, Headings: **Lato** — these are the only display fonts
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

Scale: `0.375rem, 0.5rem, 1px, 3px, 4px, 5px, 6px, 7px, 8px, 9px, 10px, 12px, 13px, 14px, 15px, 16px, 18px, 20px, 21px, 23px, 28px, 30px, 40px, 42px, 44px, 50vw, 99px, 100%`
Default: `15px`

### Container

Max-width: `64rem`, centered with auto margins.

### Breakpoints

| Name | Value |
|------|-------|
| xs | 392px |
| xs | 429px |
| sm | 640px |
| md | 750px |
| md | 767px |
| md | 768px |
| lg | 959px |
| lg | 980px |
| lg | 990px |
| lg | 1024px |
| xl | 1280px |

Mobile-first: design for small screens, layer on responsive overrides.

## Component Patterns

### Card

```css
.card {
  background: #1cc29f;
  border: 1px solid #373b3f;
  border-radius: 15px;
  padding: 16px;
  box-shadow: 0px 4px 8px rgba(0,0,0,0.12);
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
  background: #cccccc;
  color: #000000;
  border-radius: 15px;
  padding: 8px 16px;
  font-weight: 500;
  transition: opacity 150ms ease;
}
.btn-primary:hover { opacity: 0.9; }

/* Ghost */
.btn-ghost {
  background: transparent;
  border: 1px solid #373b3f;
  color: #000000;
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
  border: 1px solid #373b3f;
  border-radius: 15px;
  padding: 8px 12px;
  color: #000000;
  font-size: 14px;
}
.input:focus { border-color: var(--accent); outline: none; }
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
  background: #1cc29f;
  color: #52595f;
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
  background: #1cc29f;
  border: 1px solid #373b3f;
  border-radius: 100%;
  padding: 24px;
  max-width: 480px;
  width: 90vw;
  box-shadow: 0px 4px 20px rgba(0,0,0,0.17);
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
  color: #52595f;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #373b3f;
}
.table td {
  padding: 12px;
  border-bottom: 1px solid #373b3f;
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
  border-bottom: 1px solid #373b3f;
}
.nav-link {
  color: #52595f;
  padding: 8px 12px;
  border-radius: 15px;
  transition: color 150ms;
}
.nav-link:hover { color: #000000; }
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

**Input** (`html`)

**Navigation** (`html`)

## Page Structure

The following page sections were detected:

- **Hero** — Hero section (detected from heading structure)
- **Features** — Feature/benefit cards grid (6 items)
- **Faq** — FAQ/accordion section
- **Footer** — Page footer with links and info (21 items)
- **Cta** — Call-to-action section

When building pages, follow this section order and structure.

## Animation & Motion

This project uses **expressive motion**. Animations are part of the design language.

### CSS Animations

- `fillLeftToRight`
- `purpleToRed`
- `purpleToTeal`
- `redToTeal`
- `redToPurple`

### Motion Tokens

- **Duration scale:** `1s`, `2s`, `3s`, `4s`, `5s`, `6s`, `50ms`, `100ms`, `150ms`, `200ms`, `300ms`, `350ms`, `600ms`
- **Easing functions:** `linear`, `ease`, `ease-out`, `ease-in-out`
- **Animated properties:** `border`, `box-shadow`

### Motion Guidelines

- **Duration:** Use values from the duration scale above. Short (1s) for micro-interactions, long (600ms) for page transitions
- **Easing:** Use `linear` as the default easing curve
- **Direction:** Elements enter from bottom/right, exit to top/left
- **Reduced motion:** Always respect `prefers-reduced-motion` — disable animations when set

## Dark Mode

This project supports **light and dark mode** via CSS variables.

### Token Mapping

| Variable | Light | Dark |
|----------|-------|------|
| `--text-neutral-primary` | `#373b3f` | `#fff` |
| `--text-neutral-primary-inverse` | `#fff` | `#373b3f` |
| `--text-neutral-secondary` | `#52595f` | `#bdc9d4` |
| `--text-neutral-tertiary` | `#6d767e` | `#95a0aa` |
| `--text-neutral-disabled` | `#bdc9d4` | `#6d767e` |
| `--text-neutral-placeholder` | `#6d767e` | `#95a0aa` |
| `--text-pro-badge-active` | `#421076` | `#e4cafc` |
| `--text-pro-fill-label` | `#421076` | `#fff` |
| `--text-states-error-strong` | `#920829` | `#dd5c7b` |
| `--text-branded-brand` | `#1d856c` | `#1cc29f` |
| `--text-branded-pro` | `#7b44b5` | `#bb85ed` |
| `--text-branded-pro-purple-bg` | `#7b44b5` | `#ece0f7` |
| `--text-branded-balance-negative` | `#d34508` | `#f96817` |
| `--text-branded-balance-positive` | `#1d856c` | `#1cc29f` |
| `--text-states-error` | `#b4002b` | `#ee87a0` |

### Implementation

- Toggle via `.dark` class on `<html>` or `[data-theme="dark"]`
- Always use CSS variables for colors — never hardcode hex values
- Test both modes for contrast and readability

## Depth & Elevation

### Shadow Tokens

- Subtle: `0 2px 0 0 rgba(55,59,63,0.5)`
- Subtle: `0px 2px 0px 0px #373B3F80`
- Subtle: `0px 0px 0px 0px`
- Subtle: `inset 0 1px 1px rgba(0,0,0,0.075)`
- Subtle: `inset 0 1px 2px rgba(0,0,0,0.025)`
- Subtle: `inset 0 1px 1px rgba(0,0,0,0.05)`

### Z-Index Scale

`0, 1, 2, 3, 9, 10, 20, 98, 99, 100, 999, 1000, 1010, 1020, 1029, 1030, 1040, 1050, 2050, 2060, 2070, 9991, 9999, 99999, 999999, 1000000, 99999999, 99999999999999`

Use these exact values — never invent z-index values.

## Anti-Patterns (Never Do)

- **No blur effects** — no backdrop-blur, no filter: blur()
- **No zebra striping** — tables and lists use borders for separation
- **No invented colors** — every hex value must come from the palette above
- **No arbitrary spacing** — every dimension is a multiple of 4px
- **No extra fonts** — only Montserrat and Lato and Menlo are allowed
- **No arbitrary border-radius** — use the scale: 0.375rem, 0.5rem, 1px, 3px, 4px, 5px, 6px, 7px, 8px, 9px
- **No opacity for disabled states** — use muted colors instead

## Workflow

1. **Read** `references/DESIGN.md` before writing any UI code
2. **Pick colors** from the Color System section — never invent new ones
3. **Set typography** — Montserrat, Lato, Menlo only, using the type scale
4. **Build layout** on the 4px grid — check every margin, padding, gap
5. **Match components** to patterns above before creating new ones
6. **Apply elevation** — use shadow tokens
7. **Validate** — every value traces back to a design token. No magic numbers.

## Brand Spec

- **Favicon:** `/favicon-32x32.png`
- **Site URL:** `https://www.splitwise.com/`
- **Brand typeface:** Montserrat

## Quick Reference

```
Background:     #ffffff
Surface:        #1cc29f
Text:           #000000 / #52595f
Accent:         (not extracted)
Border:         #373b3f
Font:           Montserrat
Spacing:        4px grid
Radius:         15px
Components:     8 detected
```

## When to Trigger

Activate this skill when:
- Creating new components, pages, or visual elements for splitwise
- Writing CSS, Tailwind classes, styled-components, or inline styles
- Building page layouts, templates, or responsive designs
- Reviewing UI code for design consistency
- The user mentions "splitwise" design, style, UI, or theme
- Generating mockups, wireframes, or visual prototypes

---

# Full Reference Files

> Every output file is embedded below. Claude has full design system context from /skills alone.

## Design System Tokens (DESIGN.md)

# splitwise DESIGN.md

> Auto-generated design system — reverse-engineered via static analysis by skillui.
> Frameworks: None detected
> Colors: 20 · Fonts: 3 · Components: 8
> Icon library: not detected · State: not detected
> Primary theme: light · Dark mode toggle: yes · Motion: expressive

## Visual Reference

**Match this design exactly** — study colors, fonts, spacing, and component shapes before writing any UI code.

![splitwise Homepage](../screenshots/homepage.png)

---

## 1. Visual Theme & Atmosphere

This is a **light-themed** interface with a neutral, approachable feel. The light background emphasizes content clarity. Typography pairs **Lato** for display/headings with **Montserrat** for body text, creating clear visual hierarchy through type contrast. Spacing follows a **4px base grid** (compact density), with scale: 2, 4, 6, 8, 10, 12, 14, 16px. Motion is expressive — spring physics, layout animations, and staggered reveals are part of the visual language.

---

## 2. Color Palette & Roles

| Token | Hex | Role | Use |
|---|---|---|---|
| text-neutral-primary-inverse | `#ffffff` | background | Page background, darkest surface |
| bg-brand-surface-tertiary | `#1cc29f` | surface | Card and panel backgrounds |
| text-primary | `#000000` | text-primary | Headings and body text |
| text-neutral-secondary | `#52595f` | text-muted | Captions, placeholders, secondary info |
| text-neutral-tertiary | `#6d767e` | text-muted | Captions, placeholders, secondary info |
| text-neutral-primary | `#373b3f` | border | Dividers, card borders, outlines |
| text-states-error | `#b4002b` | danger | Error states, destructive actions |
| text-branded-balance-positive-large | `#18a582` | success | Success states, positive indicators |
| border-separator | `#e6e8ee` | unknown | Palette color |
| unknown | `#8656cd` | unknown | Palette color |
| unknown | `#92969a` | unknown | Palette color |
| text-states-success | `#16715e` | unknown | Palette color |
| text-branded-brand | `#1d856c` | unknown | Palette color |
| bg-secondary | `#f3f4f8` | unknown | Palette color |
| text-pro-badge-active | `#421076` | unknown | Palette color |
| text-neutral-disabled | `#bdc9d4` | unknown | Palette color |
| border-states-info-message | `#d3dbe4` | unknown | Palette color |
| text-branded-balance-negative-large | `#ed5601` | unknown | Palette color |
| unknown | `#ace4d6` | unknown | Palette color |
| border-pro-interactive-active | `#e4cafc` | unknown | Palette color |

### Dark Mode Token Mapping

| Variable | Light | Dark |
|---|---|---|
| `--text-neutral-primary` | `#373b3f` | `#fff` |
| `--text-neutral-primary-inverse` | `#fff` | `#373b3f` |
| `--text-neutral-secondary` | `#52595f` | `#bdc9d4` |
| `--text-neutral-tertiary` | `#6d767e` | `#95a0aa` |
| `--text-neutral-disabled` | `#bdc9d4` | `#6d767e` |
| `--text-neutral-placeholder` | `#6d767e` | `#95a0aa` |
| `--text-pro-badge-active` | `#421076` | `#e4cafc` |
| `--text-pro-fill-label` | `#421076` | `#fff` |
| `--text-states-error-strong` | `#920829` | `#dd5c7b` |
| `--text-branded-brand` | `#1d856c` | `#1cc29f` |
| `--text-branded-pro` | `#7b44b5` | `#bb85ed` |
| `--text-branded-pro-purple-bg` | `#7b44b5` | `#ece0f7` |
| `--text-branded-balance-negative` | `#d34508` | `#f96817` |
| `--text-branded-balance-positive` | `#1d856c` | `#1cc29f` |
| `--text-states-error` | `#b4002b` | `#ee87a0` |
| `--text-states-error-inverse` | `#ee87a0` | `#b4002b` |
| `--text-states-success` | `#16715e` | `#cbf1e8` |
| `--text-states-success-inverse` | `#cbf1e8` | `#16715e` |
| `--text-states-caution` | `#605f3e` | `#dbd483` |
| `--text-states-alert` | `#a33506` | `#ffc3a8` |

### CSS Variable Tokens

```css
--text-neutral-primary: #373b3f;
--text-neutral-primary-inverse: #fff;
--text-neutral-secondary: #52595f;
--border-separator: #e6e8ee;
--border-separator-inverse: #373b3f;
--border-interactive: #6d767e;
--border-interactive-active: #373b3f;
--border-states-error-field: #920829;
--border-states-error-message: #f2c9d4;
--border-states-success-message: #daf7f0;
--border-states-caution-message: #f2efbf;
--border-states-alert-message: #ffddd1;
--border-states-info-message: #d3dbe4;
--border-disabled: #d3dbe4;
--border-focus: #f96817;
--border-pro-surface: #bb85ed;
--border-pro-interactive-active: #e4cafc;
--border-pro-ghost-button: #cea8f1;
--border-pro-ghost-button-inverse: #421076;
--border-pro-notice: #7b44b5;
```


---

## 3. Typography Rules

**Font Stack:**
- **Montserrat** — Heading 1, Heading 2, Heading 3
- **Lato** — Body, Caption
- **Menlo** — Code

**Font Sources:**

```css
@font-face {
  font-family: "Lato";
  src: url("fonts/Lato-Bold.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "Lato";
  src: url("fonts/Lato-Regular.ttf") format("truetype");
  font-weight: 400;
}
@font-face {
  font-family: "Montserrat";
  src: url("fonts/Montserrat-Bold.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "Montserrat";
  src: url("fonts/Montserrat-Regular.ttf") format("truetype");
  font-weight: 400;
}
```

| Role | Font | Size | Weight |
|---|---|---|---|
| Heading 1 | Montserrat | 144px | 700 |
| Heading 2 | Montserrat | 68px | 700 |
| Heading 3 | Montserrat | 60px | 700 |
| Body | Lato | 16px | 400 |
| Caption | Lato | 14px | 400 |
| Code | Menlo | 14px | 400 |

**Typographic Rules:**
- Limit to 3 font families max per screen
- Use **Montserrat** for body/UI text, **Lato** for display/headings
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

### Data Display (2)

**Card** — `html`

**List** — `html`

### Data Input (2)

**Button** — `html`

**Input** — `html`
- State: :focus, :placeholder

### Media (2)

**Image** — `html`

**Icon** — `html`



---

## 5. Layout Principles

- **Base spacing unit:** 4px
- **Spacing scale:** 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24
- **Border radius:** 0.375rem, 0.5rem, 1px, 3px, 4px, 5px, 6px, 7px, 8px, 9px, 10px, 12px, 13px, 14px, 15px, 16px, 18px, 20px, 21px, 23px, 28px, 30px, 40px, 42px, 44px, 50vw, 99px, 100%
- **Max content width:** 64rem

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

- `0 2px 0 0 rgba(55,59,63,0.5)`
- `0px 2px 0px 0px #373B3F80`
- `0px 0px 0px 0px`

### Raised — cards, buttons, interactive elements

- `0px 4px 8px rgba(0,0,0,0.12)`
- `0px 2px 4px 0px #0000004D`
- `0px 2px 7px 0px #373B3F80`

### Floating — dropdowns, popovers, modals

- `0px 4px 20px rgba(0,0,0,0.17)`
- `0px 0px 15px 0px #00000026`
- `0 5px 10px rgba(0,0,0,0.2)`

### Z-Index Scale

`0, 1, 2, 3, 9, 10, 20, 98, 99, 100, 999, 1000, 1010, 1020, 1029, 1030, 1040, 1050, 2050, 2060, 2070, 9991, 9999, 99999, 999999, 1000000, 99999999, 99999999999999`



---

## 7. Animation & Motion

This project uses **expressive motion**. Animations are an integral part of the experience.

### CSS Animations

- `@keyframes fillLeftToRight`
- `@keyframes purpleToRed`
- `@keyframes purpleToTeal`
- `@keyframes redToTeal`
- `@keyframes redToPurple`
- `@keyframes tealToRed`
- `@keyframes tealToPurple`
- `@keyframes tealToTeal`

### Motion Guidelines

- Duration: 150-300ms for micro-interactions, 300-500ms for page transitions
- Easing: `ease-out` for enters, `ease-in` for exits
- Always respect `prefers-reduced-motion`


---

## 8. Do's and Don'ts

### Do's

- Use `#ffffff` as the primary page background
- Pair **Montserrat** (body) with **Lato** (display) — these are the only allowed fonts
- Follow the **4px** spacing grid for all margins, padding, and gaps
- Use the defined shadow tokens for elevation — see Section 6
- Use border-radius from the scale: 0.375rem, 0.5rem, 1px, 3px, 4px
- Reuse existing components from Section 4 before creating new ones
- Always use CSS variables for colors — never hardcode hex
- Test both light and dark modes for contrast

### Don'ts

- Don't introduce colors outside this palette — extend the design tokens first
- Don't introduce additional font families beyond Montserrat and Lato and Menlo
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
| xs | 392px | css |
| xs | 429px | css |
| sm | 640px | css |
| md | 750px | css |
| md | 767px | css |
| md | 768px | css |
| lg | 959px | css |
| lg | 980px | css |
| lg | 990px | css |
| lg | 1024px | css |
| xl | 1280px | css |

**Approach:** Use `@media (min-width: ...)` queries matching the breakpoints above.


---

## 10. Agent Prompt Guide

Use these as starting points when building new UI:

### Build a Card

```
Background: #1cc29f
Border: 1px solid #373b3f
Radius: 15px
Padding: 16px
Font: Montserrat
Use shadow tokens from Section 6.
```

### Build a Button

```
Primary: bg var(--accent), text white
Ghost: bg transparent, border #373b3f
Padding: 8px 16px
Radius: 15px
Hover: opacity 0.9 or lighter shade
Focus: ring with var(--accent)
```

### Build a Page Layout

```
Background: #ffffff
Max-width: 64rem, centered
Grid: 4px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface: #1cc29f
Label: #52595f (muted, 12px, uppercase)
Value: #000000 (primary, 24-32px, bold)
Status: use success/warning/danger from Section 2
```

### Build a Form

```
Input bg: #ffffff
Input border: 1px solid #373b3f
Focus: border-color var(--accent)
Label: #52595f 12px
Spacing: 16px between fields
Radius: 15px
```

### General Component

```
1. Read DESIGN.md Sections 2-6 for tokens
2. Colors: only from palette
3. Font: Montserrat, type scale from Section 3
4. Spacing: 4px grid
5. Components: match patterns from Section 4
6. Elevation: shadow tokens
```

## Visual Guide — Screenshots (VISUAL_GUIDE.md)

# splitwise — Visual Guide

> Master visual reference. Study every screenshot carefully before implementing any UI.
> Match colors, layout, typography, spacing, and motion states exactly.

**Motion Stack:** **Web Animations API (5 active)**

## Scroll Journey

The page has cinematic scroll animations. Each screenshot below shows the exact visual state at that scroll depth.
**Replicate these transitions precisely** — the design changes dramatically as you scroll.

### Hero — Above the fold

*Scroll position: 0px of 4220px total*

![Hero — Above the fold](../screens/scroll/scroll-000.png)

### 17% scroll depth

*Scroll position: 564px of 4220px total*

![17% scroll depth](../screens/scroll/scroll-017.png)

### 33% scroll depth

*Scroll position: 1096px of 4220px total*

![33% scroll depth](../screens/scroll/scroll-033.png)

### 50% scroll depth

*Scroll position: 1660px of 4220px total*

![50% scroll depth](../screens/scroll/scroll-050.png)

### 67% scroll depth

*Scroll position: 2224px of 4220px total*

![67% scroll depth](../screens/scroll/scroll-067.png)

### 83% scroll depth

*Scroll position: 2756px of 4220px total*

![83% scroll depth](../screens/scroll/scroll-083.png)

### Footer — End of page

*Scroll position: 3320px of 4220px total*

![Footer — End of page](../screens/scroll/scroll-100.png)

## Full Page Screenshots

### Split expenses with friends. :: Splitwise

*URL: `https://www.splitwise.com/`*

![Split expenses with friends. :: Splitwise](../screens/pages/home.png)

### Log in :: Splitwise

*URL: `https://www.splitwise.com/login`*

![Log in :: Splitwise](../screens/pages/login.png)

### Sign up :: Splitwise

*URL: `https://www.splitwise.com/signup`*

![Sign up :: Splitwise](../screens/pages/signup.png)

### Mobile apps :: Splitwise

*URL: `https://www.splitwise.com/mobile`*

![Mobile apps :: Splitwise](../screens/pages/mobile.png)

### About :: Splitwise

*URL: `https://www.splitwise.com/about`*

![About :: Splitwise](../screens/pages/about.png)

## Section Screenshots

Clipped sections showing individual components in context.

### Section 2 — `main > div`

*1280×604px*

![Section 2](../screens/sections/home-section-2.png)

### Section 1 — `footer`

*1440×361px*

![Section 1](../screens/sections/login-section-1.png)

### Section 2 — `main > div`

*1280×665px*

![Section 2](../screens/sections/login-section-2.png)

### Section 1 — `footer`

*1440×361px*

![Section 1](../screens/sections/mobile-section-1.png)

### Section 2 — `main > div`

*1024×342px*

![Section 2](../screens/sections/mobile-section-2.png)

### Section 2 — `main > div`

*1024×1200px*

![Section 2](../screens/sections/about-section-2.png)

## Animations & Motion (ANIMATIONS.md)

# Animation Reference

> Cinematic motion design extracted from live DOM. Follow these specs exactly to recreate the experience.

## Motion Technology Stack

| Library | Type | Notes |
|---------|------|-------|
| **Web Animations API (5 active)** | animation |  |

## Scroll Journey

The page is **4,220px** tall. Each frame below shows what the user sees at that scroll depth.

> **Use these screenshots to understand WHAT animates, WHEN it animates, and HOW it moves.**

### 0% — Top / Hero
Scroll position: 0px

![Scroll 0%](../screens/scroll/scroll-000.png)

### 17% — Opening Section
Scroll position: 564px

![Scroll 17%](../screens/scroll/scroll-017.png)

### 33% — First Feature Section
Scroll position: 1,096px

![Scroll 33%](../screens/scroll/scroll-033.png)

### 50% — Mid-Page
Scroll position: 1,660px

![Scroll 50%](../screens/scroll/scroll-050.png)

### 67% — Lower Content
Scroll position: 2,224px

![Scroll 67%](../screens/scroll/scroll-067.png)

### 83% — Near Footer
Scroll position: 2,756px

![Scroll 83%](../screens/scroll/scroll-083.png)

### 100% — Bottom / Footer
Scroll position: 3,320px

![Scroll 100%](../screens/scroll/scroll-100.png)

## Motion Tokens (CSS Variables)

### Animation Tokens

```css
--bg-pro-fill-animation: #cea8f1;
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
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Step 3 — Key Motion Principles

- **Always add** `@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`

### Step 4 — Scroll Journey Reference

Match what happens at each scroll position:

- **0%** (`0px`) → `screens/scroll/scroll-000.png`
- **17%** (`564px`) → `screens/scroll/scroll-017.png`
- **33%** (`1096px`) → `screens/scroll/scroll-033.png`
- **50%** (`1660px`) → `screens/scroll/scroll-050.png`
- **67%** (`2224px`) → `screens/scroll/scroll-067.png`
- **83%** (`2756px`) → `screens/scroll/scroll-083.png`
- **100%** (`3320px`) → `screens/scroll/scroll-100.png`

## Layout & Grid (LAYOUT.md)

# Layout Reference

> Auto-extracted from live DOM. Use this to understand how the site is structured spatially.

## Spacing System

**Base grid:** 4px

**Scale:** `2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 30, 32` px

| Spacing | Semantic Use |
|---------|-------------|
| 4px | Tight — within a component |
| 8px | Medium — between sibling items |
| 16px | Wide — between sections |
| 32px | Vast — major section breaks |

## Flex Layouts

| Element | Direction | Justify | Align | Gap | Children |
|---------|-----------|---------|-------|-----|----------|
| `div.lg:flex.lg:flex-wrap` | row | — | — | — | 5 |
| `header.flex.items-center` | row | space-between | center | — | 2 |
| `div.container.mx-auto` | row | — | — | — | 2 |
| `div.bg-facets.w-full` | row | space-between | — | — | 2 |
| `div.flex.items-center` | row | center | center | — | 4 |
| `div.flex.flex-wrap` | row | — | — | — | 6 |
| `a.flex.items-center` | row | — | center | — | 1 |
| `div#guest.flex.items-center` | row | — | center | — | 2 |
| `div.lg:flex` | row | — | — | — | 3 |
| `div.flex.flex-col` | column | space-between | — | — | 2 |
| `div.flex.flex-col` | column | space-between | — | — | 2 |
| `div.flex.flex-col` | column | space-between | — | — | 2 |
| `div.flex.flex-col` | column | space-between | — | — | 2 |
| `div.flex.w-full` | row | start | — | — | 5 |
| `div.lg:flex.lg:flex-col` | column | center | — | — | 3 |

## Structural Containers

### `<main>` (`main.bg-facets`)

```
display:          block
children:         2
```

### `<footer>` (`footer.mt-20`)

```
display:          block
children:         2
```

### `<header>` (`header.flex.items-center`)

```
display:          flex
flex-direction:   row
justify-content:  space-between
align-items:      center
padding:          20px 32px
children:         2
```

## Layout Rules

- **Container max-width:** `1280px` — always center with `margin: auto`
- Primary layout system: **Flexbox**
- Every spacing value must be a multiple of **4px**
- Never use arbitrary margin/padding values outside the spacing scale

## Component Patterns (COMPONENTS.md)

# Component Reference

> Repeated DOM patterns detected by structural analysis. Each component appeared 3+ times.

## Detected Components

| Component | Category | Instances | Key Classes |
|-----------|----------|-----------|-------------|
| **Xl:W 4/12** | unknown | 7× | `.xl:w-4/12` |
| **Border** | card | 6× | `.border`, `.border-grey-lightest`, `.external-link` |
| **Font Mont** | unknown | 6× | `.font-mont`, `.text-lg` |
| **Italic** | unknown | 6× | `.italic`, `.text-lg` |
| **Mx Auto** | unknown | 5× | `.mx-auto`, `.w-65` |
| **Fill Current** | unknown | 4× | `.fill-current`, `.w-9` |
| **Align Center** | unknown | 4× | `.align-center`, `.flex`, `.flex-col` |
| **Block** | unknown | 4× | `.block`, `.max-w-95`, `.mb-9` |
| **Text 2xl** | unknown | 4× | `.text-2xl`, `.text-center` |
| **Div** | unknown | 3× |  |
| **Flex** | card | 3× | `.flex`, `.h-12`, `.items-center` |
| **H 12** | unknown | 3× | `.h-12`, `.mr-4`, `.rounded` |
| **Flex** | card | 3× | `.flex`, `.h-12`, `.items-center` |
| **Div** | unknown | 3× |  |
| **Leading Normal** | unknown | 3× | `.leading-normal`, `.text-grey-light` |

## Cards

### Border

**Instances found:** 6

**CSS classes:** `.border` `.border-grey-lightest` `.external-link` `.flex` `.flex-col` `.h-small-card`

**HTML structure:**

```html
<div class="border border-grey-lightest shadow rounded pt-7.5 px-6 pb-4 w-full mb-4 h-small-card lg:h-lg-card flex-col flex justify-between external-link"> <p class="text-lg font-mont">“Fundamental” for tracking finances. As …</p> <div class="flex items-center h-12"> <img class="h-12 w-12 rounded mr-4" src="https://assets.splitwise.com/assets/home_page/logos/ft-1de5bba38d9acbf8a83fb70a75b9cc4b5049d825e8529522d0746d4e0b273b02.png"> <span class="italic text-lg">Financial Times</span> </div> </div>
```

**Base styles (from design tokens):**

```css
.border {
  background: #1cc29f;
  border: 1px solid #373b3f;
  border-radius: 15px;
  padding: 8px;
}```

### Flex

**Instances found:** 3

**CSS classes:** `.flex` `.h-12` `.items-center`

**HTML structure:**

```html
<div class="flex items-center h-12"> <img class="h-12 w-12 rounded mr-4" src="https://assets.splitwise.com/assets/home_page/logos/ft-1de5bba38d9acbf8a83fb70a75b9cc4b5049d825e8529522d0746d4e0b273b02.png"> <span class="italic text-lg">Financial Times</span> </div>
```

**Base styles (from design tokens):**

```css
.flex {
  background: #1cc29f;
  border: 1px solid #373b3f;
  border-radius: 15px;
  padding: 8px;
}```

### Flex

**Instances found:** 3

**CSS classes:** `.flex` `.h-12` `.items-center`

**HTML structure:**

```html
<div class="flex items-center h-12"> <span class="italic text-lg">Ahah S, iOS</span> </div>
```

**Base styles (from design tokens):**

```css
.flex {
  background: #1cc29f;
  border: 1px solid #373b3f;
  border-radius: 15px;
  padding: 8px;
}```

## Other Components

### Xl:W 4/12

**Instances found:** 7

**CSS classes:** `.xl:w-4/12`

**HTML structure:**

```html
<div class="lg:w-5/12 xl:w-4/12 "> <div class="lg:flex lg:flex-col lg:h-full lg:justify-center"> <h1 class="text-center text-3xl lg:text-left lg:text-4xl text-charcoal font-bold leading-tight pt-8 lg:pt-0"> <span class="text-swap-plane"> Less stress when sharing expenses <span class="text-plane text-teal">on trips.</span> </span> <span class="text-swap-house hidden"> Less stress when sharing expenses <span class="text-house text-purple">with housemates.</span> </span> <span class="text-swap-heart hidden"> Less stress when sharing expenses <span class="text-heart text-red">with your partner.</s
```

**Base styles (from design tokens):**

```css
.xl:w-4/12 {
  background: #1cc29f;
  padding: 4px;
}```

### Font Mont

**Instances found:** 6

**CSS classes:** `.font-mont` `.text-lg`

**HTML structure:**

```html
<p class="text-lg font-mont">“Fundamental” for tracking finances. As good as WhatsApp for containing awkwardness.</p>
```

**Base styles (from design tokens):**

```css
.font-mont {
  background: #1cc29f;
  padding: 4px;
}```

### Italic

**Instances found:** 6

**CSS classes:** `.italic` `.text-lg`

**HTML structure:**

```html
<span class="italic text-lg">Financial Times</span>
```

**Base styles (from design tokens):**

```css
.italic {
  background: #1cc29f;
  padding: 4px;
}```

### Mx Auto

**Instances found:** 5

**CSS classes:** `.mx-auto` `.w-65`

**HTML structure:**

```html
<img srcset="https://assets.splitwise.com/assets/home_page/fixtures/asset1@2x-99c3d172e234a3d8928dc4b8bfde04276347ceb341fe83ef090e2193c6d718a9.png 2x, https://assets.splitwise.com/assets/home_page/fixtures/asset1@3x-9ac27cedc1869aff16526b39a05da84bdc9c2c8449589830c51b8e840422b5e8.png 3x" class="mx-auto w-65 lg:w-81" src="https://assets.splitwise.com/assets/home_page/fixtures/asset1-cf9254671560622d1e621c4c9268d399d52bf8b9025eb9836898d04ad32bf8cc.png">
```

**Base styles (from design tokens):**

```css
.mx-auto {
  background: #1cc29f;
  padding: 4px;
}```

### Fill Current

**Instances found:** 4

**CSS classes:** `.fill-current` `.w-9`

**HTML structure:**

```html
<svg class="fill-current w-9 lg:w-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 35"> <path d="M7.844 0L1.961 3.5l11.766 7 3.922 2.333L9.805 17.5 3.922 14 0 16.333l3.922 2.334 1.961 1.166L3.922 21l1.961 1.167V24.5l1.961-1.167v7L11.766 28v-7l7.844-4.667V35l3.922-2.333 1.96-1.167v-7l1.962-1.167V21l-1.961 1.167v-2.334l1.96-1.166v-2.334l-1.96 1.167v-4.667l5.883-3.5L35.298 7V4.667L33.337 3.5l-9.805 5.833L19.61 7l1.961-1.167-1.961-1.166-1.961 1.166-1.961-1.166 1.96-1.167-1.96-1.167L13.727 3.5z"></path> </svg>
```

**Base styles (from design tokens):**

```css
.fill-current {
  background: #1cc29f;
  padding: 4px;
}```

### Align Center

**Instances found:** 4

**CSS classes:** `.align-center` `.flex` `.flex-col` `.h-full` `.justify-between`

**HTML structure:**

```html
<div class="flex flex-col align-center justify-between h-full"> <div> <h1 class="text-2xl text-center font-mont"> Track balances </h1> <p class="text-center block mx-auto px-8 mt-2 text-lg mb-9 max-w-95"> Keep track of shared expenses…</p> </div> <img srcset="https://assets.splitwise.com/assets/home_page/fixtures/asset1@2x-99c3d172e234a3d8928dc4b8bfde04276347ceb341fe83ef090e2193c6d718a9.png 2x, https://assets.splitwise.com/assets/home_page/fixtures/asset1@3x-9ac27cedc1869aff16526b39a05da84bdc9c2c8449589830c51b8e840422b5e8.png 3x" class="mx-auto w-65 lg:w-81" src="https://assets.splitwise.com/a
```

**Base styles (from design tokens):**

```css
.align-center {
  background: #1cc29f;
  padding: 4px;
}```

### Block

**Instances found:** 4

**CSS classes:** `.block` `.max-w-95` `.mb-9` `.mt-2` `.mx-auto` `.px-8`

**HTML structure:**

```html
<p class="text-center block mx-auto px-8 mt-2 text-lg mb-9 max-w-95"> Keep track of shared expenses, balances, and who owes who. </p>
```

**Base styles (from design tokens):**

```css
.block {
  background: #1cc29f;
  padding: 4px;
}```

### Text 2xl

**Instances found:** 4

**CSS classes:** `.text-2xl` `.text-center`

**HTML structure:**

```html
<h1 class="text-2xl text-center"> Organize expenses </h1>
```

**Base styles (from design tokens):**

```css
.text-2xl {
  background: #1cc29f;
  padding: 4px;
}```

### Div

**Instances found:** 3

**HTML structure:**

```html
<div class="md:w-1/2 md:px-2 lg:w-1/3"> <a href="https://www.ft.com/content/8ccd6f0e-18bb-11e9-b93e-f4351a53f1c3" target="_blank"> <div class="border border-grey-lightest shadow rounded pt-7.5 px-6 pb-4 w-full mb-4 h-small-card lg:h-lg-card flex-col flex justify-between external-link"> <p class="text-lg font-mont">“Fundamental” for tracking finances. As …</p> <div class="flex items-center h-12"> <img class="h-12 w-12 rounded mr-4" src="https://assets.splitwise.com/assets/home_page/logos/ft-1de5bba38d9acbf8a83fb70a75b9cc4b5049d825e8529522d0746d4e0b273b02.png"> <span class="italic text-lg">Finan
```

**Base styles (from design tokens):**

```css
.div {
  background: #1cc29f;
  padding: 4px;
}```

### H 12

**Instances found:** 3

**CSS classes:** `.h-12` `.mr-4` `.rounded` `.w-12`

**HTML structure:**

```html
<img class="h-12 w-12 rounded mr-4" src="https://assets.splitwise.com/assets/home_page/logos/ft-1de5bba38d9acbf8a83fb70a75b9cc4b5049d825e8529522d0746d4e0b273b02.png">
```

**Base styles (from design tokens):**

```css
.h-12 {
  background: #1cc29f;
  padding: 4px;
}```

### Div

**Instances found:** 3

**HTML structure:**

```html
<div class="lg:pr-8"> <p class="font-bold text-teal mb-1">Splitwise</p> <ul class="text-grey-light leading-normal"> <li><a href="/about">About</a></li> <li><a href="/press">Press</a></li> <li><a href="https://blog.splitwise.com">Blog</a></li> <li><a href="/jobs">Jobs</a></li> <li><a href="/calculators">Calculators</a></li> </ul> </div>
```

**Base styles (from design tokens):**

```css
.div {
  background: #1cc29f;
  padding: 4px;
}```

### Leading Normal

**Instances found:** 3

**CSS classes:** `.leading-normal` `.text-grey-light`

**HTML structure:**

```html
<ul class="text-grey-light leading-normal"> <li><a href="/about">About</a></li> <li><a href="/press">Press</a></li> <li><a href="https://blog.splitwise.com">Blog</a></li> <li><a href="/jobs">Jobs</a></li> <li><a href="/calculators">Calculators</a></li> <li><a href="https://dev.splitwise.com/">API</a></li> </ul>
```

**Base styles (from design tokens):**

```css
.leading-normal {
  background: #1cc29f;
  padding: 4px;
}```

## Component Rules

- Match class names exactly from the patterns above
- Each component instance must be visually identical to others of its type
- Do not add extra wrappers or change the DOM structure
- Use `#373b3f` for all dividers within components

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
/* outline: rgb(0, 0, 0) none 3px → */ outline: rgb(16, 16, 16) auto 1px;
/* outline-color: rgb(0, 0, 0) → */ outline-color: rgb(16, 16, 16);
```

**Transition:** `all`

### Link 2 — `Log in`

**States:**

- Default: `../screens/states/link-2-default.png`
- Hover: `../screens/states/link-2-hover.png`
- Focus: `../screens/states/link-2-focus.png`

**On focus:**

```css
/* outline: rgb(28, 194, 159) none 3px → */ outline: rgb(16, 16, 16) auto 1px;
/* outline-color: rgb(28, 194, 159) → */ outline-color: rgb(16, 16, 16);
```

**Transition:** `all`

### Link 3 — `Sign up`

**States:**

- Default: `../screens/states/link-3-default.png`
- Hover: `../screens/states/link-3-hover.png`
- Focus: `../screens/states/link-3-focus.png`

**On focus:**

```css
/* outline: rgb(255, 255, 255) none 3px → */ outline: rgb(16, 16, 16) auto 1px;
/* outline-color: rgb(255, 255, 255) → */ outline-color: rgb(16, 16, 16);
```

**Transition:** `all`

## Interaction Rules

- Focus states use **outline** (not box-shadow) — always match the extracted focus ring
- Always respect `prefers-reduced-motion` — set all transitions to `0s` when enabled

## Design Tokens — JSON Files

### tokens/colors.json
```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "core": {
    "border": {
      "value": "#373b3f",
      "role": "border",
      "name": "text-neutral-primary"
    },
    "background": {
      "value": "#ffffff",
      "role": "background",
      "name": "text-neutral-primary-inverse"
    },
    "text-primary": {
      "value": "#000000",
      "role": "text-primary"
    },
    "text-muted": {
      "value": "#6d767e",
      "role": "text-muted",
      "name": "text-neutral-tertiary"
    },
    "surface": {
      "value": "#1cc29f",
      "role": "surface",
      "name": "bg-brand-surface-tertiary"
    }
  },
  "status": {
    "danger": {
      "value": "#b4002b",
      "role": "danger",
      "name": "text-states-error"
    },
    "success": {
      "value": "#18a582",
      "role": "success",
      "name": "text-branded-balance-positive-large"
    }
  },
  "extended": {
    "border-separator": {
      "value": "#e6e8ee",
      "role": "unknown",
      "name": "border-separator"
    },
    "color-8656cd": {
      "value": "#8656cd",
      "role": "unknown"
    },
    "color-92969a": {
      "value": "#92969a",
      "role": "unknown"
    },
    "text-states-success": {
      "value": "#16715e",
      "role": "unknown",
      "name": "text-states-success"
    },
    "text-branded-brand": {
      "value": "#1d856c",
      "role": "unknown",
      "name": "text-branded-brand"
    },
    "bg-secondary": {
      "value": "#f3f4f8",
      "role": "unknown",
      "name": "bg-secondary"
    },
    "text-pro-badge-active": {
      "value": "#421076",
      "role": "unknown",
      "name": "text-pro-badge-active"
    },
    "text-neutral-disabled": {
      "value": "#bdc9d4",
      "role": "unknown",
      "name": "text-neutral-disabled"
    },
    "border-states-info-message": {
      "value": "#d3dbe4",
      "role": "unknown",
      "name": "border-states-info-message"
    },
    "text-branded-balance-negative-large": {
      "value": "#ed5601",
      "role": "unknown",
      "name": "text-branded-balance-negative-large"
    },
    "color-ace4d6": {
      "value": "#ace4d6",
      "role": "unknown"
    },
    "border-pro-interactive-active": {
      "value": "#e4cafc",
      "role": "unknown",
      "name": "border-pro-interactive-active"
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
    "max": 32
  }
}
```

### tokens/typography.json
```json
{
  "families": [
    "Montserrat",
    "Lato",
    "Menlo"
  ],
  "scale": {
    "heading-1": {
      "fontFamily": "Montserrat",
      "fontSize": "144px",
      "fontWeight": "700",
      "lineHeight": null,
      "source": "css"
    },
    "heading-2": {
      "fontFamily": "Montserrat",
      "fontSize": "68px",
      "fontWeight": "700",
      "lineHeight": null,
      "source": "css"
    },
    "heading-3": {
      "fontFamily": "Montserrat",
      "fontSize": "60px",
      "fontWeight": "700",
      "lineHeight": null,
      "source": "css"
    },
    "body": {
      "fontFamily": "Lato",
      "fontSize": "16px",
      "fontWeight": "400",
      "lineHeight": null,
      "source": "css"
    },
    "caption": {
      "fontFamily": "Lato",
      "fontSize": "14px",
      "fontWeight": "400",
      "lineHeight": null,
      "source": "css"
    },
    "code": {
      "fontFamily": "Menlo",
      "fontSize": "14px",
      "fontWeight": "400",
      "lineHeight": null,
      "source": "css"
    }
  },
  "fontFaces": [
    {
      "family": "Lato",
      "src": "https://fonts.gstatic.com/s/lato/v25/S6u8w4BMUTPHjxsAXC-v.ttf",
      "format": "truetype",
      "weight": "400"
    },
    {
      "family": "Lato",
      "src": "https://fonts.gstatic.com/s/lato/v25/S6uyw4BMUTPHjx4wWw.ttf",
      "format": "truetype",
      "weight": "400"
    },
    {
      "family": "Lato",
      "src": "https://fonts.gstatic.com/s/lato/v25/S6u9w4BMUTPHh6UVSwiPHA.ttf",
      "format": "truetype",
      "weight": "700"
    },
    {
      "family": "Montserrat",
      "src": "https://fonts.gstatic.com/s/montserrat/v31/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw5aX8.ttf",
      "format": "truetype",
      "weight": "400"
    },
    {
      "family": "Montserrat",
      "src": "https://fonts.gstatic.com/s/montserrat/v31/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCu173w5aX8.ttf",
      "format": "truetype",
      "weight": "600"
    },
    {
      "family": "Montserrat",
      "src": "https://fonts.gstatic.com/s/montserrat/v31/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM73w5aX8.ttf",
      "format": "truetype",
      "weight": "700"
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

- `fonts/Lato-Black.ttf`
- `fonts/Lato-Bold.ttf`
- `fonts/Lato-Light.ttf`
- `fonts/Lato-Regular.ttf`
- `fonts/Lato-Thin.ttf`
- `fonts/Montserrat-Black.ttf`
- `fonts/Montserrat-Bold.ttf`
- `fonts/Montserrat-ExtraBold.ttf`
- `fonts/Montserrat-ExtraLight.ttf`
- `fonts/Montserrat-Light.ttf`
- `fonts/Montserrat-Medium.ttf`
- `fonts/Montserrat-Regular.ttf`
- `fonts/Montserrat-SemiBold.ttf`
- `fonts/Montserrat-Thin.ttf`

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

![home.png](screens/pages/home.png)

![login.png](screens/pages/login.png)

![mobile.png](screens/pages/mobile.png)

![signup.png](screens/pages/signup.png)

### Section Clips (screens/sections/)

*Clipped individual sections and components*

![about-section-2.png](screens/sections/about-section-2.png)

![home-section-2.png](screens/sections/home-section-2.png)

![login-section-1.png](screens/sections/login-section-1.png)

![login-section-2.png](screens/sections/login-section-2.png)

![mobile-section-1.png](screens/sections/mobile-section-1.png)

![mobile-section-2.png](screens/sections/mobile-section-2.png)

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
| 17% | 564px | `screens/scroll/scroll-017.png` |
| 33% | 1096px | `screens/scroll/scroll-033.png` |
| 50% | 1660px | `screens/scroll/scroll-050.png` |
| 67% | 2224px | `screens/scroll/scroll-067.png` |
| 83% | 2756px | `screens/scroll/scroll-083.png` |
| 100% | 3320px | `screens/scroll/scroll-100.png` |

## Pages

| Page | URL | File |
|------|-----|------|
| Split expenses with friends. :: Splitwise | `https://www.splitwise.com/` | `screens/pages/home.png` |
| Log in :: Splitwise | `https://www.splitwise.com/login` | `screens/pages/login.png` |
| Sign up :: Splitwise | `https://www.splitwise.com/signup` | `screens/pages/signup.png` |
| Mobile apps :: Splitwise | `https://www.splitwise.com/mobile` | `screens/pages/mobile.png` |
| About :: Splitwise | `https://www.splitwise.com/about` | `screens/pages/about.png` |

## Sections

| Page | Section | File |
|------|---------|------|
| home | #2 (main > div) | `screens/sections/home-section-2.png` |
| login | #1 (footer) | `screens/sections/login-section-1.png` |
| login | #2 (main > div) | `screens/sections/login-section-2.png` |
| mobile | #1 (footer) | `screens/sections/mobile-section-1.png` |
| mobile | #2 (main > div) | `screens/sections/mobile-section-2.png` |
| about | #2 (main > div) | `screens/sections/about-section-2.png` |

## Homepage Screenshots (screenshots/)

![homepage.png](screenshots/homepage.png)

