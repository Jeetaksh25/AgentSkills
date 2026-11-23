---
name: monzo-design
description: Design system skill for monzo. Activate when building UI components, pages, or any visual elements. Provides exact color tokens, typography scale, spacing grid, component patterns, and craft rules. Read references/DESIGN.md before writing any CSS or JSX. Includes ultra-mode visual journey: read references/ANIMATIONS.md, references/LAYOUT.md, references/COMPONENTS.md, and references/INTERACTIONS.md for full motion and layout details.
---

# monzo Design System

You are building UI for **monzo**. Dark-themed, cool palette, sans-serif typography (MonzoSansDisplay), compact density on a 4px grid, expressive motion.

## Visual Reference

**IMPORTANT**: Study ALL screenshots below before writing any UI. Match colors, typography, spacing, layout, and motion exactly as shown.

### Homepage

![monzo Homepage](screenshots/homepage.png)

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

![Video 1 (background)](screens/scroll/video-1-frame.png)

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
- **Type pairing** — MonzoSansDisplay for body/UI text, Oldschool for headings/display. Never introduce a third typeface.
- **compact density** — 4px base grid. Every dimension is a multiple of 4.
- **cool palette** — the color temperature runs cool, matching the sans-serif typography.
- **Restrained accent** — `#0000ee` is the only pop of color. Used exclusively for CTAs, links, focus rings, and active states.
- **Expressive motion** — animations are an integral part of the experience. Use spring physics and layout animations.

## Color System

### Core Palette

| Role | Token | Hex | Use |
|------|-------|-----|-----|
| Background | `--background` | `#091723` | Page/app background |
| Surface | `--surface` | `#000000` | Cards, panels, modals |
| Text Primary | `--text-primary` | `#ffffff` | Headings, body text |
| Text Muted | `--text-muted` | `#3b4c54` | Captions, placeholders |
| Accent | `--accent` | `#0000ee` | CTAs, links, focus rings |

### Status Colors

| Status | Hex | Use |
|--------|-----|-----|
| Success | `#f2f8f3` | Confirmations, positive trends |
| Danger | `#ff4f40` | Errors, destructive actions |

### Extended Palette

- **theme-color:** `#112231`
- **color-blue-500:** `#218fb7`
- **calc-chart-take-home:** `#2eafc0`
- **color-teal-550:** `#016b83`
- **color-grey-200:** `#e3ebe4` — Light surface or highlight color
- **color-navy-700:** `#2c3a43`
- `#d9ff6f`
- `#ffd7f0` — Light surface or highlight color

### CSS Variable Tokens

```css
--color-blue-accent: #009ace;
--color-red-accent: #ff3b30;
--color-green-accent: #44d12c;
--semantic-background-primary: var(--color-white);
--semantic-background-secondary: var(--color-grey-100);
--semantic-background-accent: var(--color-brand);
--semantic-background-overlay-lighter: var(--alpha-white-30);
--semantic-background-overlay-light: var(--alpha-white-70);
--semantic-background-overlay-dark: var(--alpha-navy-30);
--semantic-background-overlay-darker: var(--alpha-navy-70);
--semantic-content-primary: var(--color-navy-900);
--semantic-content-secondary: var(--alpha-navy-60);
--semantic-content-accent: var(--color-brand);
--semantic-inverse-content-primary: var(--color-white);
--semantic-inverse-content-secondary: var(--alpha-white-90);
--semantic-inverse-action-border-secondary-default: var(--color-white);
--semantic-inverse-action-border-secondary-disabled: var(--alpha-white-30);
--semantic-inverse-action-border-secondary-loading: var(--color-white);
--semantic-inverse-action-fill-primary-default: var(--color-white);
--semantic-inverse-action-fill-primary-hover: var(--color-grey-200);
```

## Typography

### Font Stack

- **MonzoSansDisplay** — Heading 1, Heading 2, Heading 3
- **Oldschool** — Body, Caption
- **Maison Neue Mono Web** — Code

### Font Sources

```css
@font-face {
  font-family: "Oldschool";
  src: url("fonts/Oldschool-800.woff2") format("woff2");
  font-weight: 800;
}
@font-face {
  font-family: "MonzoSansDisplay";
  src: url("fonts/MonzoSansDisplay-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "MonzoSansDisplay";
  src: url("fonts/MonzoSansDisplay-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "MonzoSansText";
  src: url("fonts/MonzoSansText-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "MonzoSansText";
  src: url("fonts/MonzoSansText-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Maison Neue Web";
  src: url("fonts/MaisonNeueWeb-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Maison Neue Mono Web";
  src: url("fonts/MaisonNeueMonoWeb-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Maison Neue Mono Web";
  src: url("fonts/MaisonNeueMonoWeb-700.woff2") format("woff2");
  font-weight: 700;
}
```

### Type Scale

| Role | Family | Size | Weight |
|------|--------|------|--------|
| Heading 1 | MonzoSansDisplay | 10rem | 700 |
| Heading 2 | MonzoSansDisplay | 8.5rem | 700 |
| Heading 3 | MonzoSansDisplay | 6.5625rem | 700 |
| Body | Oldschool | 1rem | 400 |
| Caption | Oldschool | 1.125rem | 400 |
| Code | Maison Neue Mono Web | 14px | 400 |

### Typography Rules

- Body/UI: **MonzoSansDisplay**, Headings: **Oldschool** — these are the only display fonts
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

Scale: `1rem, inherit, .25rem, .375rem, .5rem, .625rem, .75rem, 1.25rem, 1.5rem, 1.75rem, 1.875rem, 2rem, 3px, 4px, 6px, 6.25rem, 8px, 10px, 12px, 16px, 18px, 20px, 24px, 25%, 30px, 32px, 34px, 40px, 50px, 55px, 64px, 64px 64px 0px 0px, 100px, 100%, 128px, 200px, 500px, 999px, unset`
Default: `16px`

### Container

Max-width: `90rem`, centered with auto margins.

### Breakpoints

| Name | Value |
|------|-------|
| xs | 30rem |
| sm | 30.0625rem |
| sm | 38.5rem |
| md | 43.75rem |
| md | 48rem |
| lg | 48.0625rem |
| lg | 51.25rem |
| lg | 51.31rem |
| lg | 56.25rem |
| lg | 61.25rem |
| lg | 64rem |
| xl | 65rem |
| xl | 65.0625rem |
| xl | 71.25rem |
| xl | 80rem |
| 2xl | 90rem |
| xs | 394px |
| xs | 430px |
| xs | 480px |
| sm | 500px |
| sm | 600px |
| md | 767px |
| md | 768px |
| lg | 769px |
| lg | 800px |
| lg | 820px |
| lg | 821px |
| lg | 850px |
| lg | 900px |
| lg | 1024px |
| xl | 1040px |
| xl | 1041px |
| xl | 1250px |
| 2xl | 1300px |
| 2xl | 1440px |
| 2xl | 1567px |
| 2xl | 1568px |

Mobile-first: design for small screens, layer on responsive overrides.

## Component Patterns

### Card

```css
.card {
  background: #000000;
  border-radius: 16px;
  padding: 16px;
  box-shadow: inset 0 0 0 var(--spacing-3x-small) var(--checkbox-checkmark-border);
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
  color: #ffffff;
  border-radius: 16px;
  padding: 8px 16px;
  font-weight: 500;
  transition: opacity 150ms ease;
}
.btn-primary:hover { opacity: 0.9; }

/* Ghost */
.btn-ghost {
  background: transparent;
  border: 1px solid #444444;
  color: #ffffff;
  border-radius: 16px;
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
  background: #091723;
  border: 1px solid #444444;
  border-radius: 16px;
  padding: 8px 12px;
  color: #ffffff;
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
  background: #000000;
  color: #3b4c54;
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
  background: #000000;
  border-radius: unset;
  padding: 24px;
  max-width: 480px;
  width: 90vw;
  box-shadow: 0 4px 20px rgba(0,0,0,.15);
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
  color: #3b4c54;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #444444;
}
.table td {
  padding: 12px;
  border-bottom: 1px solid #444444;
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
  color: #3b4c54;
  padding: 8px 12px;
  border-radius: 16px;
  transition: color 150ms;
}
.nav-link:hover { color: #ffffff; }
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

**Button** (`html`)

## Page Structure

The following page sections were detected:

- **Navigation** — Top navigation bar (44 items)
- **Hero** — Hero section (detected from heading structure)
- **Faq** — FAQ/accordion section
- **Footer** — Page footer with links and info (44 items)

When building pages, follow this section order and structure.

## Animation & Motion

This project uses **expressive motion**. Animations are part of the design language.

### CSS Animations

- `reveal`
- `RevealInView_reveal__AqI33`
- `LoadingIndicator_spin__R3reU`
- `Dialog_slide-up-from-bottom__fTybb`
- `Dialog_slide-down-to-bottom__IaASz`

### Motion Tokens

- **Duration scale:** `0s`, `.3s`, `50ms`, `100ms`, `200ms`, `250ms`, `300ms`, `350ms`, `400ms`, `500ms`, `1000ms`
- **Easing functions:** `linear`, `ease-in-out`, `ease`, `ease-out`, `cubic-bezier(0,0,.12,1)`, `cubic-bezier(.4,0,.2,1)`, `cubic-bezier(.445,.05,.55,.95)`, `cubic-bezier(.22,0,.12,1)`
- **Animated properties:** `background-color`

### Motion Guidelines

- **Duration:** Use values from the duration scale above. Short (0s) for micro-interactions, long (1000ms) for page transitions
- **Easing:** Use `linear` as the default easing curve
- **Direction:** Elements enter from bottom/right, exit to top/left
- **Reduced motion:** Always respect `prefers-reduced-motion` — disable animations when set

## Depth & Elevation

### Shadow Tokens

- Subtle: `0 0 0 2px var(--semantic-action-outline-focus)`
- Subtle: `0 1px 1px 0 transparent`
- Subtle: `0 1px 1px 0 rgba(0,0,0,.1)`
- Raised (cards, buttons): `inset 0 0 0 var(--spacing-3x-small) var(--checkbox-checkmark-border)`
- Raised (cards, buttons): `inset 0 0 0 var(--size-4x-small) var(--checkbox-checkmark-disabled)`
- Raised (cards, buttons): `var(--elevation-level3-h-offset) var(--elevation-level3-v-offset) var(--elevation-level3-blur)0 var(--elevation-level3-color)`

### Z-Index Scale

`0, 1, 2, 3, 4, 9, 10, 11, 20, 99, 100, 101, 102, 103, 200, 999, 1000`

Use these exact values — never invent z-index values.

## Anti-Patterns (Never Do)

- **No blur effects** — no backdrop-blur, no filter: blur()
- **No zebra striping** — tables and lists use borders for separation
- **No invented colors** — every hex value must come from the palette above
- **No arbitrary spacing** — every dimension is a multiple of 4px
- **No extra fonts** — only MonzoSansDisplay and Oldschool and Maison Neue Mono Web are allowed
- **No arbitrary border-radius** — use the scale: 1rem, .25rem, .375rem, .5rem, .625rem, .75rem, 1.25rem, 1.5rem, 1.75rem, 1.875rem
- **No opacity for disabled states** — use muted colors instead

## Workflow

1. **Read** `references/DESIGN.md` before writing any UI code
2. **Pick colors** from the Color System section — never invent new ones
3. **Set typography** — MonzoSansDisplay, Oldschool, Maison Neue Mono Web only, using the type scale
4. **Build layout** on the 4px grid — check every margin, padding, gap
5. **Match components** to patterns above before creating new ones
6. **Apply elevation** — use shadow tokens
7. **Validate** — every value traces back to a design token. No magic numbers.

## Brand Spec

- **Favicon:** `https://static-assets.monzo.com/monzo-com/db51ee0a62b80ce437affc9d764e213751834982/_next/static/media/favicon.4c6ebc6f.svg`
- **Site URL:** `https://monzo.com/`
- **Brand color:** `#0000ee`
- **Brand typeface:** MonzoSansDisplay

## Quick Reference

```
Background:     #091723
Surface:        #000000
Text:           #ffffff / #3b4c54
Accent:         #0000ee
Border:         (not extracted)
Font:           MonzoSansDisplay
Spacing:        4px grid
Radius:         16px
Components:     6 detected
```

## When to Trigger

Activate this skill when:
- Creating new components, pages, or visual elements for monzo
- Writing CSS, Tailwind classes, styled-components, or inline styles
- Building page layouts, templates, or responsive designs
- Reviewing UI code for design consistency
- The user mentions "monzo" design, style, UI, or theme
- Generating mockups, wireframes, or visual prototypes

---

# Full Reference Files

> Every output file is embedded below. Claude has full design system context from /skills alone.

## Design System Tokens (DESIGN.md)

# monzo DESIGN.md

> Auto-generated design system — reverse-engineered via static analysis by skillui.
> Frameworks: None detected
> Colors: 20 · Fonts: 3 · Components: 6
> Icon library: not detected · State: not detected
> Primary theme: dark · Dark mode toggle: no · Motion: expressive

## Visual Reference

**Match this design exactly** — study colors, fonts, spacing, and component shapes before writing any UI code.

![monzo Homepage](../screenshots/homepage.png)

---

## 1. Visual Theme & Atmosphere

This is a **dark-themed** interface with a cool tone. Depth is expressed through layered shadows and subtle surface color variation. Typography pairs **Oldschool** for display/headings with **MonzoSansDisplay** for body text, creating clear visual hierarchy through type contrast. Spacing follows a **4px base grid** (compact density), with scale: 2, 4, 6, 8, 10, 12, 14, 16px. The accent color **#0000ee** anchors interactive elements (buttons, links, focus rings). Motion is expressive — spring physics, layout animations, and staggered reveals are part of the visual language.

---

## 2. Color Palette & Roles

| Token | Hex | Role | Use |
|---|---|---|---|
| color-navy-900 | `#091723` | background | Page background, darkest surface |
| color-black | `#000000` | surface | Card and panel backgrounds |
| color-white | `#ffffff` | text-primary | Headings and body text |
| color-navy-600 | `#3b4c54` | text-muted | Captions, placeholders, secondary info |
| accent | `#0000ee` | accent | CTAs, links, focus rings, active states |
| color-brand | `#ff4f40` | danger | Error states, destructive actions |
| color-grey-100 | `#f2f8f3` | success | Success states, positive indicators |
| theme-color | `#112231` | info | Informational highlights |
| color-blue-500 | `#218fb7` | unknown | Palette color |
| calc-chart-take-home | `#2eafc0` | unknown | Palette color |
| color-teal-550 | `#016b83` | unknown | Palette color |
| color-grey-200 | `#e3ebe4` | unknown | Palette color |
| color-navy-700 | `#2c3a43` | unknown | Palette color |
| unknown | `#d9ff6f` | unknown | Palette color |
| unknown | `#ffd7f0` | unknown | Palette color |
| color-blue-200 | `#bbf6e2` | unknown | Palette color |
| avatar-color-orange-70 | `#ff945a` | unknown | Palette color |
| color-grey-300 | `#c9d0c6` | unknown | Palette color |
| avatar-color-lime-70 | `#99af73` | unknown | Palette color |
| unknown | `#dffff7` | unknown | Palette color |

### CSS Variable Tokens

```css
--color-blue-accent: #009ace;
--color-red-accent: #ff3b30;
--color-green-accent: #44d12c;
--semantic-background-primary: var(--color-white);
--semantic-background-secondary: var(--color-grey-100);
--semantic-background-accent: var(--color-brand);
--semantic-background-overlay-lighter: var(--alpha-white-30);
--semantic-background-overlay-light: var(--alpha-white-70);
--semantic-background-overlay-dark: var(--alpha-navy-30);
--semantic-background-overlay-darker: var(--alpha-navy-70);
--semantic-content-primary: var(--color-navy-900);
--semantic-content-secondary: var(--alpha-navy-60);
--semantic-content-accent: var(--color-brand);
--semantic-inverse-content-primary: var(--color-white);
--semantic-inverse-content-secondary: var(--alpha-white-90);
--semantic-inverse-action-border-secondary-default: var(--color-white);
--semantic-inverse-action-border-secondary-disabled: var(--alpha-white-30);
--semantic-inverse-action-border-secondary-loading: var(--color-white);
--semantic-inverse-action-fill-primary-default: var(--color-white);
--semantic-inverse-action-fill-primary-hover: var(--color-grey-200);
```


---

## 3. Typography Rules

**Font Stack:**
- **MonzoSansDisplay** — Heading 1, Heading 2, Heading 3
- **Oldschool** — Body, Caption
- **Maison Neue Mono Web** — Code

**Font Sources:**

```css
@font-face {
  font-family: "Oldschool";
  src: url("fonts/Oldschool-800.woff2") format("woff2");
  font-weight: 800;
}
@font-face {
  font-family: "MonzoSansDisplay";
  src: url("fonts/MonzoSansDisplay-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "MonzoSansDisplay";
  src: url("fonts/MonzoSansDisplay-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "MonzoSansText";
  src: url("fonts/MonzoSansText-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "MonzoSansText";
  src: url("fonts/MonzoSansText-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Maison Neue Web";
  src: url("fonts/MaisonNeueWeb-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Maison Neue Mono Web";
  src: url("fonts/MaisonNeueMonoWeb-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Maison Neue Mono Web";
  src: url("fonts/MaisonNeueMonoWeb-700.woff2") format("woff2");
  font-weight: 700;
}
```

| Role | Font | Size | Weight |
|---|---|---|---|
| Heading 1 | MonzoSansDisplay | 10rem | 700 |
| Heading 2 | MonzoSansDisplay | 8.5rem | 700 |
| Heading 3 | MonzoSansDisplay | 6.5625rem | 700 |
| Body | Oldschool | 1rem | 400 |
| Caption | Oldschool | 1.125rem | 400 |
| Code | Maison Neue Mono Web | 14px | 400 |

**Typographic Rules:**
- Limit to 3 font families max per screen
- Use **MonzoSansDisplay** for body/UI text, **Oldschool** for display/headings
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
- **Border radius:** 1rem, inherit, .25rem, .375rem, .5rem, .625rem, .75rem, 1.25rem, 1.5rem, 1.75rem, 1.875rem, 2rem, 3px, 4px, 6px, 6.25rem, 8px, 10px, 12px, 16px, 18px, 20px, 24px, 25%, 30px, 32px, 34px, 40px, 50px, 55px, 64px, 64px 64px 0px 0px, 100px, 100%, 128px, 200px, 500px, 999px, unset
- **Max content width:** 90rem

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

- `0 0 0 2px var(--semantic-action-outline-focus)`
- `0 1px 1px 0 transparent`
- `0 1px 1px 0 rgba(0,0,0,.1)`

### Raised — cards, buttons, interactive elements

- `inset 0 0 0 var(--spacing-3x-small) var(--checkbox-checkmark-border)`
- `inset 0 0 0 var(--size-4x-small) var(--checkbox-checkmark-disabled)`
- `var(--elevation-level3-h-offset) var(--elevation-level3-v-offset) var(--elevation-level3-blur)0 var(--elevation-level3-color)`

### Floating — dropdowns, popovers, modals

- `0 4px 20px rgba(0,0,0,.15)`
- `0 0 20px rgba(0,0,0,.2)`
- `0 4px 12px 0 rgba(0,0,0,.16)`

### Overlay — full-screen overlays, top-level dialogs

- `.4px .4px .7px rgba(0,0,0,.02),1px 1px 1.7px rgba(0,0,0,.028),1.9px 1.9px 3.3px rgba(0,0,0,.035),3.4px 3.4px 5.8px rgba(0,0,0,.042),6.3px 6.3px 10.9px rgba(0,0,0,.05),15px 15px 26px rgba(0,0,0,.07)`
- `.7px .5px 2.2px rgba(0,0,0,.02),1.7px 1.3px 5.3px rgba(0,0,0,.028),3.1px 2.4px 10px rgba(0,0,0,.035),5.6px 4.2px 17.9px rgba(0,0,0,.042),10.4px 7.9px 33.4px rgba(0,0,0,.05),25px 19px 80px rgba(0,0,0,.07)`
- `0 8px 32px 0 rgba(0,0,0,.161)`

### Z-Index Scale

`0, 1, 2, 3, 4, 9, 10, 11, 20, 99, 100, 101, 102, 103, 200, 999, 1000`



---

## 7. Animation & Motion

This project uses **expressive motion**. Animations are an integral part of the experience.

### CSS Animations

- `@keyframes reveal`
- `@keyframes RevealInView_reveal__AqI33`
- `@keyframes LoadingIndicator_spin__R3reU`
- `@keyframes Dialog_slide-up-from-bottom__fTybb`
- `@keyframes Dialog_slide-down-to-bottom__IaASz`
- `@keyframes Dialog_slide-down-from-top__xcLuU`
- `@keyframes Dialog_slide-up-to-top__2bglz`
- `@keyframes Dialog_fade-in__H8_ns`

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
- Use `#091723` as the primary page background
- Pair **MonzoSansDisplay** (body) with **Oldschool** (display) — these are the only allowed fonts
- Follow the **4px** spacing grid for all margins, padding, and gaps
- Use the defined shadow tokens for elevation — see Section 6
- Use border-radius from the scale: 1rem, inherit, .25rem, .375rem, .5rem
- Reuse existing components from Section 4 before creating new ones

### Don'ts

- Don't introduce colors outside this palette — extend the design tokens first
- Don't introduce additional font families beyond MonzoSansDisplay and Oldschool and Maison Neue Mono Web
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
| xs | 30rem | css |
| sm | 30.0625rem | css |
| sm | 38.5rem | css |
| md | 43.75rem | css |
| md | 48rem | css |
| lg | 48.0625rem | css |
| lg | 51.25rem | css |
| lg | 51.31rem | css |
| lg | 56.25rem | css |
| lg | 61.25rem | css |
| lg | 64rem | css |
| xl | 65rem | css |
| xl | 65.0625rem | css |
| xl | 71.25rem | css |
| xl | 80rem | css |
| 2xl | 90rem | css |
| xs | 394px | css |
| xs | 430px | css |
| xs | 480px | css |
| sm | 500px | css |
| sm | 600px | css |
| md | 767px | css |
| md | 768px | css |
| lg | 769px | css |
| lg | 800px | css |
| lg | 820px | css |
| lg | 821px | css |
| lg | 850px | css |
| lg | 900px | css |
| lg | 1024px | css |
| xl | 1040px | css |
| xl | 1041px | css |
| xl | 1250px | css |
| 2xl | 1300px | css |
| 2xl | 1440px | css |
| 2xl | 1567px | css |
| 2xl | 1568px | css |

**Approach:** Use `@media (min-width: ...)` queries matching the breakpoints above.


---

## 10. Agent Prompt Guide

Use these as starting points when building new UI:

### Build a Card

```
Background: #000000
Border: 1px solid var(--border)
Radius: 16px
Padding: 16px
Font: MonzoSansDisplay
Use shadow tokens from Section 6.
```

### Build a Button

```
Primary: bg #0000ee, text white
Ghost: bg transparent, border var(--border)
Padding: 8px 16px
Radius: 16px
Hover: opacity 0.9 or lighter shade
Focus: ring with #0000ee
```

### Build a Page Layout

```
Background: #091723
Max-width: 90rem, centered
Grid: 4px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface: #000000
Label: #3b4c54 (muted, 12px, uppercase)
Value: #ffffff (primary, 24-32px, bold)
Status: use success/warning/danger from Section 2
```

### Build a Form

```
Input bg: #091723
Input border: 1px solid var(--border)
Focus: border-color #0000ee
Label: #3b4c54 12px
Spacing: 16px between fields
Radius: 16px
```

### General Component

```
1. Read DESIGN.md Sections 2-6 for tokens
2. Colors: only from palette
3. Font: MonzoSansDisplay, type scale from Section 3
4. Spacing: 4px grid
5. Components: match patterns from Section 4
6. Elevation: shadow tokens
```

## Visual Guide — Screenshots (VISUAL_GUIDE.md)

# monzo — Visual Guide

> Master visual reference. Study every screenshot carefully before implementing any UI.
> Match colors, layout, typography, spacing, and motion states exactly.

## Scroll Journey

The page has cinematic scroll animations. Each screenshot below shows the exact visual state at that scroll depth.
**Replicate these transitions precisely** — the design changes dramatically as you scroll.

### Hero — Above the fold

*Scroll position: 0px of 13739px total*

![Hero — Above the fold](../screens/scroll/scroll-000.png)

### 17% scroll depth

*Scroll position: 2183px of 13739px total*

![17% scroll depth](../screens/scroll/scroll-017.png)

### 33% scroll depth

*Scroll position: 4237px of 13739px total*

![33% scroll depth](../screens/scroll/scroll-033.png)

### 50% scroll depth

*Scroll position: 6420px of 13739px total*

![50% scroll depth](../screens/scroll/scroll-050.png)

### 67% scroll depth

*Scroll position: 8602px of 13739px total*

![67% scroll depth](../screens/scroll/scroll-067.png)

### 83% scroll depth

*Scroll position: 10656px of 13739px total*

![83% scroll depth](../screens/scroll/scroll-083.png)

### Footer — End of page

*Scroll position: 12839px of 13739px total*

![Footer — End of page](../screens/scroll/scroll-100.png)

## Video Backgrounds

These videos play as background elements. Use first-frame as poster image while video loads.

### Video 1 (background)

*Source: `https://videos.ctfassets.net/ro61k101ee59/1xilbYtiiVx3eb5ie2XSp0/c8369937cff9bd6...`*

![Video 1 first frame](../screens/scroll/video-1-frame.png)

## Full Page Screenshots

### Monzo | Open a Free Account

*URL: `https://monzo.com/`*

![Monzo | Open a Free Account](../screens/pages/home.png)

### Open a Free Online Bank Account in Minutes with Monzo

*URL: `https://monzo.com/current-account/personal`*

![Open a Free Online Bank Account in Minutes with Monzo](../screens/pages/current-account-personal.png)

### Open a Joint Bank Account | Simplify Shared Costs with Monzo

*URL: `https://monzo.com/current-account/joint-account`*

![Open a Joint Bank Account | Simplify Shared Costs with Monzo](../screens/pages/current-account-joint-account.png)

### Monzo for Under 16s | A Free Bank Account for Kids

*URL: `https://monzo.com/current-account/under-16s`*

![Monzo for Under 16s | A Free Bank Account for Kids](../screens/pages/current-account-under-16s.png)

### A Bank Account for 16-17 Year Olds | Teen Bank Accounts

*URL: `https://monzo.com/current-account/16-17`*

![A Bank Account for 16-17 Year Olds | Teen Bank Accounts](../screens/pages/current-account-16-17.png)

## Section Screenshots

Clipped sections showing individual components in context.

### Section 1 — `section`

*1440×868px*

![Section 1](../screens/sections/home-section-1.png)

### Section 1 — `section`

*1440×957px*

![Section 1](../screens/sections/current-account-personal-section-1.png)

### Section 1 — `section`

*1440×957px*

![Section 1](../screens/sections/current-account-joint-account-section-1.png)

### Section 1 — `section`

*1440×957px*

![Section 1](../screens/sections/current-account-under-16s-section-1.png)

### Section 1 — `section`

*1440×957px*

![Section 1](../screens/sections/current-account-16-17-section-1.png)

## Animations & Motion (ANIMATIONS.md)

# Animation Reference

> Cinematic motion design extracted from live DOM. Follow these specs exactly to recreate the experience.

## Motion Technology Stack

Pure CSS animations — no external animation libraries detected.

## Scroll Journey

The page is **13,739px** tall. Each frame below shows what the user sees at that scroll depth.

> **Use these screenshots to understand WHAT animates, WHEN it animates, and HOW it moves.**

### 0% — Top / Hero
Scroll position: 0px

![Scroll 0%](../screens/scroll/scroll-000.png)

### 17% — Opening Section
Scroll position: 2,183px

![Scroll 17%](../screens/scroll/scroll-017.png)

### 33% — First Feature Section
Scroll position: 4,237px

![Scroll 33%](../screens/scroll/scroll-033.png)

### 50% — Mid-Page
Scroll position: 6,420px

![Scroll 50%](../screens/scroll/scroll-050.png)

### 67% — Lower Content
Scroll position: 8,602px

![Scroll 67%](../screens/scroll/scroll-067.png)

### 83% — Near Footer
Scroll position: 10,656px

![Scroll 83%](../screens/scroll/scroll-083.png)

### 100% — Bottom / Footer
Scroll position: 12,839px

![Scroll 100%](../screens/scroll/scroll-100.png)

## Video Elements

| # | Role | Autoplay | Loop | Muted | Size | First Frame |
|---|------|----------|------|-------|------|-------------|
| 1 | background | — | ✓ | ✓ | 1392×750 | [view](../screens/scroll/video-1-frame.png) |
| 2 | content | — | — | ✓ | 320×320 | — |
| 3 | content | — | — | ✓ | 320×320 | — |
| 4 | content | — | — | ✓ | 320×320 | — |
| 5 | content | — | — | ✓ | 571×571 | — |
| 6 | content | — | — | ✓ | 571×571 | — |

**Video 1 first frame:**

![Video 1 Frame](../screens/scroll/video-1-frame.png)

- **Source:** `https://videos.ctfassets.net/ro61k101ee59/1xilbYtiiVx3eb5ie2XSp0/c8369937cff9bd6738d03a469fcc6db6/get-busy-living-hero-d`
- **Source:** `https://videos.ctfassets.net/ro61k101ee59/6AFbuMpRI0ebzQEnrp3lJE/9e22f4dbddef1b98f2aecc91bfaa2371/homepage-savings.webm`
- **Source:** `https://videos.ctfassets.net/ro61k101ee59/6IFsZZwlhwkLCj6pYcYqLY/08f88636ed34f876e7226b8347817405/homepage-investments__`

## Scroll Animation Patterns

| Pattern | Library | Element Count | Duration | Delay | Easing |
|---------|---------|---------------|----------|-------|--------|
| scroll-reveal | Locomotive Scroll | 3 | — | — | — |
| parallax / sticky scroll | CSS | 1 | — | — | — |

### Locomotive Scroll Implementation

### CSS Implementation

## CSS Keyframes (33 extracted)

### `@keyframes MobileMenuUS_slideIn__VxxAp`

Duration: `0.3s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.MobileMenuUS_slideIn__VxxAp`, `.MobileMenuUS_slideInInstant__RpJ_X`

```css
@keyframes MobileMenuUS_slideIn__VxxAp {
  100% {
    transform: translateX(0px);
  }
  0% {
    transform: translateX(100%);
  }
}
```

> Transform/motion animation

### `@keyframes MobileMenuUS_slideOut__L7_vZ`

Duration: `0.3s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.MobileMenuUS_slideOut__L7_vZ`, `.MobileMenuUS_slideOutInstant__kQKlh`

```css
@keyframes MobileMenuUS_slideOut__L7_vZ {
  100% {
    transform: translateX(100%);
  }
  0% {
    transform: translateX(0px);
  }
}
```

> Transform/motion animation

### `@keyframes Thumbnail_spinning__XiENl`

Duration: `1s` · Easing: `linear` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.Thumbnail_spinning__XiENl`

```css
@keyframes Thumbnail_spinning__XiENl {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(1turn);
  }
}
```

> Transform/motion animation

### `@keyframes FadeImage_slideIn__OFQyh`

Duration: `0.35s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.FadeImage_imageActive__qKzj_`

```css
@keyframes FadeImage_slideIn__OFQyh {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes FadeImage_slideOut__SWgjX`

Duration: `0.35s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.FadeImage_imageExiting__U6pbr`

```css
@keyframes FadeImage_slideOut__SWgjX {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
```

> Opacity fade

### `@keyframes PaymentCardFan_slideIn__9QpON`

Duration: `0.35s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.PaymentCardFan_infoPanel__4k76E`

```css
@keyframes PaymentCardFan_slideIn__9QpON {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes PaymentCardFan_slideOut__yAfoe`

Duration: `0.35s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.PaymentCardFan_infoPanel__4k76E.PaymentCardFan_infoPanelTransitioning__IDcll`

```css
@keyframes PaymentCardFan_slideOut__yAfoe {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
```

> Opacity fade

### `@keyframes Navigation_enterFromTop__ODcdP`

Duration: `0.25s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.Navigation_navigationViewport__a1arA[data-state="open"]`

```css
@keyframes Navigation_enterFromTop__ODcdP {
  0% {
    opacity: 0;
    transform: translateY(-100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes Navigation_navigationCurtainFadeIn__DelHx`

Duration: `0.15s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.Navigation_navigationCurtain__624Wk`

```css
@keyframes Navigation_navigationCurtainFadeIn__DelHx {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes NavigationTopLevelItems_enterFromRight__rh5Av`

Duration: `0.25s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.NavigationTopLevelItems_navigationSubViewport__EWUey[data-state="open"]`

```css
@keyframes NavigationTopLevelItems_enterFromRight__rh5Av {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes NavigationTopLevelItems_exitToRight__B1v3a`

Duration: `0.25s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.NavigationTopLevelItems_navigationSubViewport__EWUey[data-state="closed"]`

```css
@keyframes NavigationTopLevelItems_exitToRight__B1v3a {
  0% {
    opacity: 1;
    transform: translateX(0px);
  }
  100% {
    opacity: 0;
    transform: translateX(100%);
  }
}
```

> Fade + motion enter animation

### `@keyframes Navigation_enterFromTop___eVNt`

Duration: `0.25s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.Navigation_navigationViewport__kx9_O[data-state="open"]`

```css
@keyframes Navigation_enterFromTop___eVNt {
  0% {
    opacity: 0;
    transform: translateY(-100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes Navigation_navigationCurtainFadeIn__m11fe`

Duration: `0.15s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.Navigation_navigationCurtain__vWlu_`

```css
@keyframes Navigation_navigationCurtainFadeIn__m11fe {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes NavigationTopLevelItems_enterFromRight__rLqHz`

Duration: `0.25s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.NavigationTopLevelItems_navigationSubViewport__PmoUS[data-state="open"]`

```css
@keyframes NavigationTopLevelItems_enterFromRight__rLqHz {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes NavigationTopLevelItems_exitToRight__xbwhC`

Duration: `0.25s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.NavigationTopLevelItems_navigationSubViewport__PmoUS[data-state="closed"]`

```css
@keyframes NavigationTopLevelItems_exitToRight__xbwhC {
  0% {
    opacity: 1;
    transform: translateX(0px);
  }
  100% {
    opacity: 0;
    transform: translateX(100%);
  }
}
```

> Fade + motion enter animation

### `@keyframes Spinner_spinnerRing__b3mNf`

Duration: `1.2s` · Easing: `cubic-bezier(0.5, 0, 0.5, 1)` · Delay: `0s` · Iteration: `infinite` · Fill: `none`

Used by: `.Spinner_spinnerRing__b3mNf div`

```css
@keyframes Spinner_spinnerRing__b3mNf {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(1turn);
  }
}
```

> Transform/motion animation

### `@keyframes LoadingIndicator_spin__R3reU`

```css
@keyframes LoadingIndicator_spin__R3reU {
  100% {
    transform: rotate(1turn);
  }
}
```

> Transform/motion animation

### `@keyframes Dialog_slide-up-from-bottom__fTybb`

```css
@keyframes Dialog_slide-up-from-bottom__fTybb {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0px);
  }
}
```

> Transform/motion animation

### `@keyframes Dialog_slide-down-to-bottom__IaASz`

```css
@keyframes Dialog_slide-down-to-bottom__IaASz {
  0% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(100%);
  }
}
```

> Transform/motion animation

### `@keyframes Dialog_slide-down-from-top__xcLuU`

```css
@keyframes Dialog_slide-down-from-top__xcLuU {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0px);
  }
}
```

> Transform/motion animation

### `@keyframes Dialog_slide-up-to-top__2bglz`

```css
@keyframes Dialog_slide-up-to-top__2bglz {
  0% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(-100%);
  }
}
```

> Transform/motion animation

### `@keyframes Dialog_fade-in__H8_ns`

```css
@keyframes Dialog_fade-in__H8_ns {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes Dialog_fade-out__ed0nG`

```css
@keyframes Dialog_fade-out__ed0nG {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
```

> Opacity fade

### `@keyframes Marker_progress-fill__rsyF1`

```css
@keyframes Marker_progress-fill__rsyF1 {
  0% {
    inline-size: 0px;
  }
  100% {
    inline-size: 100%;
  }
}
```

### `@keyframes CardCarouselAnimation_rotate__Fcd9M`

```css
@keyframes CardCarouselAnimation_rotate__Fcd9M {
  0%, 6.25% {
    transform: rotate(0turn);
  }
  12.5%, 18.75% {
    transform: rotate(45deg);
  }
  25%, 31.25% {
    transform: rotate(90deg);
  }
  37.5%, 43.75% {
    transform: rotate(135deg);
  }
  50%, 56.25% {
    transform: rotate(0.5turn);
  }
  62.5%, 68.75% {
    transform: rotate(225deg);
  }
  75%, 81.25% {
    transform: rotate(270deg);
  }
  87.5%, 93.75% {
    transform: rotate(315deg);
  }
  100% {
    transform: rotate(1turn);
  }
}
```

> Transform/motion animation

### `@keyframes CardCarouselAnimation_scale__6BAAV`

```css
@keyframes CardCarouselAnimation_scale__6BAAV {
  0%, 6.25% {
    transform: scale(1.44);
  }
  12.5%, 43.75% {
    transform: scale(1);
  }
  50%, 56.25% {
    transform: scale(1.44);
  }
  62.5%, 93.75% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.44);
  }
}
```

> Transform/motion animation

### `@keyframes FloatingHeartAnimation_flutter-left__gseaI`

```css
@keyframes FloatingHeartAnimation_flutter-left__gseaI {
  70% {
    opacity: 0.5;
  }
  100% {
    transform: translateX(calc(-50% - 12px)) translateY(calc(-50% - var(--floating-heart-y-travel)));
    opacity: 0;
  }
}
```

> Fade + motion enter animation

### `@keyframes FloatingHeartAnimation_flutter-right___CYMD`

```css
@keyframes FloatingHeartAnimation_flutter-right___CYMD {
  70% {
    opacity: 0.5;
  }
  100% {
    transform: translateX(calc(-50% + 12px)) translateY(calc(-50% - var(--floating-heart-y-travel)));
    opacity: 0;
  }
}
```

> Fade + motion enter animation

### `@keyframes FloatingHeartAnimation_flutter-center__G9CKH`

```css
@keyframes FloatingHeartAnimation_flutter-center__G9CKH {
  70% {
    opacity: 0.5;
  }
  100% {
    transform: translateX(calc(-50% + 6px)) translateY(calc(-50% - var(--floating-heart-y-travel)));
    opacity: 0;
  }
}
```

> Fade + motion enter animation

### `@keyframes ShimmeringBankCardAnimation_shimmer__tOAFk`

```css
@keyframes ShimmeringBankCardAnimation_shimmer__tOAFk {
  30%, 100% {
    transform: translateX(400%) skewX(-20deg);
  }
}
```

> Transform/motion animation

### `@keyframes ContributionSelector_estimateCenterFadeIn__mUreT`

```css
@keyframes ContributionSelector_estimateCenterFadeIn__mUreT {
  0% {
    opacity: 0;
    transform: translateY(3px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes TakeHomeBreakdown_estimateCenterFadeIn__tRbnQ`

```css
@keyframes TakeHomeBreakdown_estimateCenterFadeIn__tRbnQ {
  0% {
    opacity: 0;
    transform: translateY(3px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
```

> Fade + motion enter animation

### `@keyframes Result_estimateCenterFadeIn__EfaOW`

```css
@keyframes Result_estimateCenterFadeIn__EfaOW {
  0% {
    opacity: 0;
    transform: translateY(3px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
```

> Fade + motion enter animation

## Global Transition Declarations

These `transition` values were extracted from CSS rules across the site:

```css
transition: opacity var(--motion-duration-extra-long) var(--motion-easing-flow);
transition: background-color var(--motion-duration-long) var(--motion-easing-linear);
transition: background-color 0.3s ease-in-out;
transition: unset;
transition: color var(--motion-duration-short) var(--motion-easing-linear);
transition: border-color var(--motion-duration-medium) var(--motion-easing-flow);
transition: transform var(--motion-duration-medium) var(--motion-easing-flow);
transition: text-decoration-color var(--motion-duration-medium) var(--motion-easing-flow),-webkit-text-decoration-color var(--motion-duration-medium) var(--motion-easing-flow);
transition: background-color var(--motion-duration-long) var(--motion-easing-flow);
transition: text-decoration-color var(--motion-duration-long) var(--motion-easing-flow),-webkit-text-decoration-color var(--motion-duration-long) var(--motion-easing-flow);
transition: background-color var(--motion-duration-short) var(--motion-easing-linear),background-image var(--motion-duration-short) var(--motion-easing-linear);
transition: background-color 0.2s;
```

## How to Recreate This Motion Design

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

- **Video backgrounds** — use `<video autoplay loop muted playsinline>` for background videos. Always include a poster image fallback
- **Duration scale:** `0.3s` · `0.2s` · `0.25s` — use these values, never invent new durations
- **Always add** `@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`

### Step 4 — Scroll Journey Reference

Match what happens at each scroll position:

- **0%** (`0px`) → `screens/scroll/scroll-000.png`
- **17%** (`2183px`) → `screens/scroll/scroll-017.png`
- **33%** (`4237px`) → `screens/scroll/scroll-033.png`
- **50%** (`6420px`) → `screens/scroll/scroll-050.png`
- **67%** (`8602px`) → `screens/scroll/scroll-067.png`
- **83%** (`10656px`) → `screens/scroll/scroll-083.png`
- **100%** (`12839px`) → `screens/scroll/scroll-100.png`

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
| `section.MediaColumn_MediaColumn__46P2O.MediaText_MediaText__` | row | — | center | 64px | 2 |
| `section.FeatureHighlightsGrid_FeatureHighlightsGrid__ANIxf.F` | row | — | — | 64px | 3 |
| `section.MediaColumn_MediaColumn__46P2O.MediaColumn_MediaColu` | row-reverse | — | center | 48px | 2 |
| `article.MicroArticle.UiSpotlight_UiSpotlight__article__Dzins` | column | center | center | — | 3 |
| `div.AppFraudRanking_container__h9bmJ` | column | — | — | 16px | 3 |
| `nav.Navigation_navigation__MiBte` | row | space-between | center | 16px | 3 |
| `section.Swiper_Root__v645F.CardsCarousel_CardsCarousel__muud` | column | — | — | 32px | 3 |
| `article.MicroArticle.FeatureHighlightsGrid_FeatureHighlights` | column | center | center | — | 3 |
| `article.Card_Card__aSCdZ.Card_Card--primary__vlN_c` | column-reverse | — | — | — | 2 |
| `article.Card_Card__aSCdZ.Card_Card--primary__vlN_c` | column-reverse | — | — | — | 2 |
| `article.Card_Card__aSCdZ.Card_Card--primary__vlN_c` | column-reverse | — | — | — | 2 |
| `article.Card_Card__aSCdZ.Card_Card--primary__vlN_c` | column-reverse | — | — | — | 2 |

## Grid Layouts

| Element | Template Columns | Gap | Children |
|---------|-----------------|-----|----------|
| `footer.Footer_footer__BdQyf` | `608px 608px` | 48px | 7 |
| `section.Highlights_Highlights__TJ9oz.Highlights_Highlights--` | `1152px 240px` | 48px | 4 |
| `section.Highlights_Highlights__TJ9oz.Highlights--scrollable` | `1152px 240px` | 48px | 3 |
| `section.Highlights_Highlights__TJ9oz.Highlights--scrollable` | `1184px` | 48px | 2 |
| `ul.AccountAndPlans_AccountAndPlans__grid__7aOgu` | `421.328px 421.328px 421.344px` | 24px | 6 |

## Structural Containers

### `<header>` (`header.HeaderVariant_sticky__PakDB`)

```
display:          block
max-width:        100%
children:         1
```

### `<main>` (`main#mainContent.Main_main__qK_Jw`)

```
display:          block
max-width:        100%
children:         13
```

### `<section>` (`section.BasicSectionContainer_basicSectionContainer__c9eBG.B`)

```
display:          block
padding:          64px 24px 0px
max-width:        100%
children:         1
```

### `<section>` (`section.BasicSectionContainer_basicSectionContainer__c9eBG.B`)

```
display:          block
padding:          0px 24px 64px
max-width:        100%
children:         1
```

### `<section>` (`section.AccountAndPlans_AccountAndPlans__xjVY6.monzo-com-des`)

```
display:          block
max-width:        100%
children:         1
```

### `<section>` (`section.monzo-com-design-system.UiSpotlight_Container__nrFUg`)

```
display:          block
max-width:        100%
children:         1
```

### `<section>` (`section.BasicSectionContainer_basicSectionContainer__c9eBG.B`)

```
display:          block
padding:          64px 24px
max-width:        100%
children:         1
```

### `<section>` (`section.BasicSectionContainer_basicSectionContainer__c9eBG.B`)

```
display:          block
padding:          64px 24px
max-width:        100%
children:         1
```

### `<footer>` (`footer.Footer_footer__BdQyf`)

```
display:          grid
grid-template-columns: 608px 608px
gap:              48px
padding:          64px
max-width:        100%
children:         7
```

### `<section>` (`section.Highlights_Highlights__TJ9oz.Highlights_Highlights--`)

```
display:          grid
grid-template-columns: 1152px 240px
gap:              48px
padding:          64px 0px 0px
max-width:        1568px
children:         4
```

### `<section>` (`section.Highlights_Highlights__TJ9oz.Highlights--scrollable`)

```
display:          grid
grid-template-columns: 1152px 240px
gap:              48px
padding:          64px 0px
max-width:        1568px
children:         3
```

### `<section>` (`section.Highlights_Highlights__TJ9oz.Highlights--scrollable`)

```
display:          grid
grid-template-columns: 1184px
gap:              48px
padding:          64px
max-width:        1568px
children:         2
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
| **Button Text  5HT7** | button | 39× | `.Button_text__5HT7_` |
| **MicroArticleInternal MicroArticle  Body  B7i9j** | unknown | 25× | `.MicroArticleInternal_MicroArticle__body__b7i9j`, `.MicroArticle__body` |
| **AutoPlayVideo AutoPlayVideo  Video  XSoHg** | unknown | 20× | `.AutoPlayVideo_AutoPlayVideo__video__xSoHg` |
| **Button Button  Content  MwBf1** | button | 20× | `.Button_Button__content__mwBf1` |
| **MicroArticleInternal MicroArticle  Title  DjgeA** | unknown | 19× | `.MicroArticleInternal_MicroArticle__title__DjgeA`, `.MicroArticle__title` |
| **Card Card  Col  FrtMx** | card | 18× | `.Card_Card__col__FrtMx`, `.Card__content` |
| **MicroArticleInternal MicroArticle  Buttons  BLyBT** | button | 16× | `.MicroArticleInternal_MicroArticle__buttons__BLyBT`, `.MicroArticle__buttons` |
| **Highlights Highlights  Slide  Scroll  FgJiF** | unknown | 14× | `.Highlights_Highlights__slide--scroll__fgJiF`, `.Highlights__slide` |
| **Card Card  Primary  VlN C** | card | 14× | `.Card_Card--primary__vlN_c`, `.Card_Card__aSCdZ`, `.FeatureCard_FeatureCard__ShcHA` |
| **Button** | button | 9× | `.Button`, `.Button--medium`, `.Button--primary` |
| **MicroArticleInternal MicroArticle  Title  DjgeA** | unknown | 6× | `.MicroArticleInternal_MicroArticle__title__DjgeA`, `.MicroArticle__title` |
| **IconButton IconButton  Medium  JnnUj** | button | 6× | `.IconButton_IconButton--medium__JnnUj`, `.IconButton_IconButton--outlined__4Jkyq`, `.IconButton_IconButton__2Fva_` |
| **Card  Article** | card | 6× | `.Card__article`, `.MicroArticle` |
| **Button** | button | 6× | `.Button`, `.Button--secondary`, `.Button--small` |
| **BasicSectionContainer BasicSectionContainer  C9eBG** | unknown | 4× | `.BasicSectionContainer_basicSectionContainer__c9eBG`, `.BasicSectionContainer_bgColor__RX0NM`, `.BasicSectionContainer_fullWidthOnMobile__2O2mj` |
| **ContentfulFeatureCardHighlights ContentfulFeatureCardHighlights  DXYDy** | card | 4× | `.ContentfulFeatureCardHighlights_ContentfulFeatureCardHighlights__dXYDy`, `.monzo-com-design-system` |
| **RevealInView RevealInView  Scroll  IKS4s** | unknown | 4× | `.RevealInView_RevealInView--scroll__IKS4s`, `.RevealInView_RevealInView__SQbci` |
| **Hero HeroAsset  JKoT8** | unknown | 3× | `.Hero_heroAsset__JKoT8` |
| **Highlights Highlights  Article  3Jwby** | unknown | 3× | `.Highlights_Highlights__article__3Jwby`, `.MicroArticle` |
| **Highlights Highlights  Track  Scroll  5xlzZ** | unknown | 3× | `.Highlights_Highlights__track--scroll__5xlzZ`, `.Highlights_Highlights__track__LDgsB` |

## Cards

### Card Card  Col  FrtMx

**Instances found:** 18

**CSS classes:** `.Card_Card__col__FrtMx` `.Card__content`

**HTML structure:**

```html
<div class="Card_Card__col__FrtMx Card__content"><div class="MicroArticle MicroArticle Card__article"><h3 class="MicroArticleInternal_MicroArticle__title__DjgeA MicroArticle__title">Current accounts</h3><div class="MicroArticleInternal_MicroArticle__body__b7i9j MicroArticle__body"><p>From joint accounts and accounts for kid…</p></div><div class="MicroArticleInternal_MicroArticle__buttons__BLyBT MicroArticle__buttons"><a aria-disabled="false" href="https://monzo.com/current-account" class="Button_Button__7VWsG Button_Button--secondary__tL6g5 Button_Button--small__6j0MM Button Button--secondary 
```

**Base styles (from design tokens):**

```css
.Card_Card__col__FrtMx {
  background: #000000;
  border-radius: 16px;
  padding: 8px;
}```

### Card Card  Primary  VlN C

**Instances found:** 14

**CSS classes:** `.Card_Card--primary__vlN_c` `.Card_Card__aSCdZ` `.FeatureCard_FeatureCard__ShcHA`

**HTML structure:**

```html
<article class="Card_Card__aSCdZ Card_Card--primary__vlN_c FeatureCard_FeatureCard__ShcHA" tabindex="0"><div class="Card_Card__col__FrtMx Card__content"><div class="MicroArticle MicroArticle Card__article"><h3 class="MicroArticleInternal_MicroArticle__title__DjgeA MicroArticle__title">Current accounts</h3><div class="MicroArticleInternal_MicroArticle__body__b7i9j MicroArticle__body"><p>From joint accounts and accounts for kid…</p></div><div class="MicroArticleInternal_MicroArticle__buttons__BLyBT MicroArticle__buttons"><a aria-disabled="false" href="https://monzo.com/current-account" class="Bu
```

**Base styles (from design tokens):**

```css
.Card_Card--primary__vlN_c {
  background: #000000;
  border-radius: 16px;
  padding: 8px;
}```

### Card  Article

**Instances found:** 6

**CSS classes:** `.Card__article` `.MicroArticle`

**HTML structure:**

```html
<div class="MicroArticle MicroArticle Card__article"><h3 class="MicroArticleInternal_MicroArticle__title__DjgeA MicroArticle__title">Current accounts</h3><div class="MicroArticleInternal_MicroArticle__body__b7i9j MicroArticle__body"><p>From joint accounts and accounts for kid…</p></div><div class="MicroArticleInternal_MicroArticle__buttons__BLyBT MicroArticle__buttons"><a aria-disabled="false" href="https://monzo.com/current-account" class="Button_Button__7VWsG Button_Button--secondary__tL6g5 Button_Button--small__6j0MM Button Button--secondary Button--small" type="button" data-monzoanalytics-
```

**Base styles (from design tokens):**

```css
.Card__article {
  background: #000000;
  border-radius: 16px;
  padding: 8px;
}```

### ContentfulFeatureCardHighlights ContentfulFeatureCardHighlights  DXYDy

**Instances found:** 4

**CSS classes:** `.ContentfulFeatureCardHighlights_ContentfulFeatureCardHighlights__dXYDy` `.monzo-com-design-system`

**HTML structure:**

```html
<div class="monzo-com-design-system ContentfulFeatureCardHighlights_ContentfulFeatureCardHighlights__dXYDy"><div class="RevealInView_RevealInView__SQbci RevealInView_RevealInView--scroll__IKS4s" style="--appearance-order:0;--appearance-order-mobile:0;--appearance-order-portrait-tablet:0;--appearance-order-landscape-tablet:0;--appearance-order-desktop:0"><section aria-label="Feature cards showcasing Monzo's accounts" aria-labelledby="highlights-get-the-most-out-of-monzo" class="Highlights_Highlights__TJ9oz Highlights_Highlights--footed__CWLD0 Highlights--scrollable Highlights_Highlights--cards-
```

**Base styles (from design tokens):**

```css
.ContentfulFeatureCardHighlights_ContentfulFeatureCardHighlights__dXYDy {
  background: #000000;
  border-radius: 16px;
  padding: 8px;
}```

## Buttons

### Button Text  5HT7

**Instances found:** 39

**CSS classes:** `.Button_text__5HT7_`

**HTML structure:**

```html
<span class="Button_text__5HT7_">Open a free Monzo account</span>
```

**Base styles (from design tokens):**

```css
.Button_text__5HT7_ {
  background: #0000ee;
  color: #ffffff;
  border-radius: 16px;
  padding: 4px 8px;
  cursor: pointer;
}```

### Button Button  Content  MwBf1

**Instances found:** 20

**CSS classes:** `.Button_Button__content__mwBf1`

**HTML structure:**

```html
<b class="Button_Button__content__mwBf1" aria-hidden="false">Open a free Monzo account</b>
```

**Base styles (from design tokens):**

```css
.Button_Button__content__mwBf1 {
  background: #0000ee;
  color: #ffffff;
  border-radius: 16px;
  padding: 4px 8px;
  cursor: pointer;
}```

### MicroArticleInternal MicroArticle  Buttons  BLyBT

**Instances found:** 16

**CSS classes:** `.MicroArticleInternal_MicroArticle__buttons__BLyBT` `.MicroArticle__buttons`

**HTML structure:**

```html
<div class="MicroArticleInternal_MicroArticle__buttons__BLyBT MicroArticle__buttons"><a aria-disabled="false" href="https://monzo.com/sign-up" class="Button_Button__7VWsG Button_Button--primary__wwzbg Button_Button--medium__hxBko Button Button--primary Button--medium" type="button" data-monzoanalytics-no-tracking="true"><b class="Button_Button__content__mwBf1" aria-hidden="false">Open a free Monzo account</b></a></div>
```

**Base styles (from design tokens):**

```css
.MicroArticleInternal_MicroArticle__buttons__BLyBT {
  background: #0000ee;
  color: #ffffff;
  border-radius: 16px;
  padding: 4px 8px;
  cursor: pointer;
}```

### Button

**Instances found:** 9

**CSS classes:** `.Button` `.Button--medium` `.Button--primary` `.Button_Button--medium__hxBko` `.Button_Button--primary__wwzbg` `.Button_Button__7VWsG`

**HTML structure:**

```html
<a aria-disabled="false" href="https://monzo.com/sign-up" class="Button_Button__7VWsG Button_Button--primary__wwzbg Button_Button--medium__hxBko Button Button--primary Button--medium" type="button" data-monzoanalytics-no-tracking="true"><b class="Button_Button__content__mwBf1" aria-hidden="false">Open a free Monzo account</b></a>
```

**Base styles (from design tokens):**

```css
.Button {
  background: #0000ee;
  color: #ffffff;
  border-radius: 16px;
  padding: 4px 8px;
  cursor: pointer;
}```

### IconButton IconButton  Medium  JnnUj

**Instances found:** 6

**CSS classes:** `.IconButton_IconButton--medium__JnnUj` `.IconButton_IconButton--outlined__4Jkyq` `.IconButton_IconButton__2Fva_`

**HTML structure:**

```html
<button data-monzoanalytics-action-id="highlights_prev_clicked" data-monzoanalytics-action-parameters="category=interaction&amp;action=click&amp;link_text=Previous slide&amp;link_location=FeatureCardHighlights - Get the most out of Monzo&amp;link_type=on page control&amp;currentUrl=/" type="button" aria-label="Go to previous slide" aria-busy="false" aria-disabled="true" class="IconButton_IconButton__2Fva_ IconButton_IconButton--outlined__4Jkyq IconButton_IconButton--medium__JnnUj" disabled="" tabindex="-1"><span class="IconButton_IconButton__content__5JrNv" aria-hidden="false"><svg class="Base
```

**Base styles (from design tokens):**

```css
.IconButton_IconButton--medium__JnnUj {
  background: #0000ee;
  color: #ffffff;
  border-radius: 16px;
  padding: 4px 8px;
  cursor: pointer;
}```

### Button

**Instances found:** 6

**CSS classes:** `.Button` `.Button--secondary` `.Button--small` `.Button_Button--secondary__tL6g5` `.Button_Button--small__6j0MM` `.Button_Button__7VWsG`

**HTML structure:**

```html
<a aria-disabled="false" href="https://monzo.com/current-account" class="Button_Button__7VWsG Button_Button--secondary__tL6g5 Button_Button--small__6j0MM Button Button--secondary Button--small" type="button" data-monzoanalytics-no-tracking="true"><b class="Button_Button__content__mwBf1" aria-hidden="false">Learn more</b></a>
```

**Base styles (from design tokens):**

```css
.Button {
  background: #0000ee;
  color: #ffffff;
  border-radius: 16px;
  padding: 4px 8px;
  cursor: pointer;
}```

## Other Components

### MicroArticleInternal MicroArticle  Body  B7i9j

**Instances found:** 25

**CSS classes:** `.MicroArticleInternal_MicroArticle__body__b7i9j` `.MicroArticle__body`

**HTML structure:**

```html
<div class="MicroArticleInternal_MicroArticle__body__b7i9j MicroArticle__body"><p>Whatever stage of life you're at, we've …</p></div>
```

**Base styles (from design tokens):**

```css
.MicroArticleInternal_MicroArticle__body__b7i9j {
  background: #000000;
  padding: 4px;
}```

### AutoPlayVideo AutoPlayVideo  Video  XSoHg

**Instances found:** 20

**CSS classes:** `.AutoPlayVideo_AutoPlayVideo__video__xSoHg`

**HTML structure:**

```html
<video aria-label="" aria-hidden="true" class="AutoPlayVideo_AutoPlayVideo__video__xSoHg" data-state="playingOnLoop" loop="" playsinline="" preload="none"><source src="https://videos.ctfassets.net/ro61k101ee59/1xilbYtiiVx3eb5ie2XSp0/c8369937cff9bd6738d03a469fcc6db6/get-busy-living-hero-desktop.webm" type="video/webm"><source src="https://videos.ctfassets.net/ro61k101ee59/2atWib6ZzHKkNa9vYJHbJD/4e3adf740233878155a41448dee5c5a8/get-busy-living-hero-desktop.mp4" type="video/mp4"></video>
```

**Base styles (from design tokens):**

```css
.AutoPlayVideo_AutoPlayVideo__video__xSoHg {
  background: #000000;
  padding: 4px;
}```

### MicroArticleInternal MicroArticle  Title  DjgeA

**Instances found:** 19

**CSS classes:** `.MicroArticleInternal_MicroArticle__title__DjgeA` `.MicroArticle__title`

**HTML structure:**

```html
<h3 class="MicroArticleInternal_MicroArticle__title__DjgeA MicroArticle__title">Current accounts</h3>
```

**Base styles (from design tokens):**

```css
.MicroArticleInternal_MicroArticle__title__DjgeA {
  background: #000000;
  padding: 4px;
}```

### Highlights Highlights  Slide  Scroll  FgJiF

**Instances found:** 14

**CSS classes:** `.Highlights_Highlights__slide--scroll__fgJiF` `.Highlights__slide`

**HTML structure:**

```html
<div class="Highlights__slide Highlights_Highlights__slide--scroll__fgJiF"><article class="Card_Card__aSCdZ Card_Card--primary__vlN_c FeatureCard_FeatureCard__ShcHA" tabindex="0"><div class="Card_Card__col__FrtMx Card__content"><div class="MicroArticle MicroArticle Card__article"><h3 class="MicroArticleInternal_MicroArticle__title__DjgeA MicroArticle__title">Current accounts</h3><div class="MicroArticleInternal_MicroArticle__body__b7i9j MicroArticle__body"><p>From joint accounts and accounts for kid…</p></div><div class="MicroArticleInternal_MicroArticle__buttons__BLyBT MicroArticle__buttons">
```

**Base styles (from design tokens):**

```css
.Highlights_Highlights__slide--scroll__fgJiF {
  background: #000000;
  padding: 4px;
}```

### MicroArticleInternal MicroArticle  Title  DjgeA

**Instances found:** 6

**CSS classes:** `.MicroArticleInternal_MicroArticle__title__DjgeA` `.MicroArticle__title`

**HTML structure:**

```html
<h2 class="MicroArticleInternal_MicroArticle__title__DjgeA MicroArticle__title" id="highlights-get-the-most-out-of-monzo">Get the most out of Monzo</h2>
```

**Base styles (from design tokens):**

```css
.MicroArticleInternal_MicroArticle__title__DjgeA {
  background: #000000;
  padding: 4px;
}```

### BasicSectionContainer BasicSectionContainer  C9eBG

**Instances found:** 4

**CSS classes:** `.BasicSectionContainer_basicSectionContainer__c9eBG` `.BasicSectionContainer_bgColor__RX0NM` `.BasicSectionContainer_fullWidthOnMobile__2O2mj` `.BasicSectionContainer_noTopPadding__gBkgA`

**HTML structure:**

```html
<section class="BasicSectionContainer_basicSectionContainer__c9eBG BasicSectionContainer_bgColor__RX0NM BasicSectionContainer_noTopPadding__gBkgA BasicSectionContainer_fullWidthOnMobile__2O2mj"><div class="BasicSectionContainer_basicSectionContainerContent__kFgj_ BasicSectionContainer_fullWidthOnMobile__2O2mj"><article><div class="Hero_hero__1rnBa undefined Hero_juxtaposedToHeader__Mr_NV"><div class="Hero_backgroundPicture__6Wti1 Hero_backgroundPictureDesignSystem__64YKA Hero_hasBackgroundGradient__gdp6S"><div class="AutoPlayVideo_AutoPlayVideo__IzcQy Hero_backgroundVideo__mynMW" style="--aspe
```

**Base styles (from design tokens):**

```css
.BasicSectionContainer_basicSectionContainer__c9eBG {
  background: #000000;
  padding: 4px;
}```

### RevealInView RevealInView  Scroll  IKS4s

**Instances found:** 4

**CSS classes:** `.RevealInView_RevealInView--scroll__IKS4s` `.RevealInView_RevealInView__SQbci`

**HTML structure:**

```html
<div class="RevealInView_RevealInView__SQbci RevealInView_RevealInView--scroll__IKS4s" style="--appearance-order:0;--appearance-order-mobile:0;--appearance-order-portrait-tablet:0;--appearance-order-landscape-tablet:0;--appearance-order-desktop:0"><section aria-label="Feature cards showcasing Monzo's accounts" aria-labelledby="highlights-get-the-most-out-of-monzo" class="Highlights_Highlights__TJ9oz Highlights_Highlights--footed__CWLD0 Highlights--scrollable Highlights_Highlights--cards-4-or-more__356a2" data-scroll="start" data-scrollable="true"><div class="MicroArticle MicroArticle Highlight
```

**Base styles (from design tokens):**

```css
.RevealInView_RevealInView--scroll__IKS4s {
  background: #000000;
  padding: 4px;
}```

### Hero HeroAsset  JKoT8

**Instances found:** 3

**CSS classes:** `.Hero_heroAsset__JKoT8`

**HTML structure:**

```html
<img src="https://images.ctfassets.net/ro61k101ee59/2ST9v6xxvjtK1fn5aU57Yw/4576856ecf5a05874bb3da186a0071ef/which-current-account-november-2025.png" alt="Which? Recommended Provider for Current Accounts, November 2025." class="Hero_heroAsset__JKoT8" loading="eager" style="width:135px;height:auto">
```

**Base styles (from design tokens):**

```css
.Hero_heroAsset__JKoT8 {
  background: #000000;
  padding: 4px;
}```

### Highlights Highlights  Article  3Jwby

**Instances found:** 3

**CSS classes:** `.Highlights_Highlights__article__3Jwby` `.MicroArticle`

**HTML structure:**

```html
<div class="MicroArticle MicroArticle Highlights_Highlights__article__3Jwby"><h2 class="MicroArticleInternal_MicroArticle__title__DjgeA MicroArticle__title" id="highlights-get-the-most-out-of-monzo">Get the most out of Monzo</h2><div class="MicroArticleInternal_MicroArticle__body__b7i9j MicroArticle__body"><p>Whatever stage of life you're at, we've …</p></div><div class="MicroArticleInternal_MicroArticle__buttons__BLyBT MicroArticle__buttons"><a aria-disabled="false" href="https://monzo.com/sign-up" class="Button_Button__7VWsG Button_Button--primary__wwzbg Button_Button--medium__hxBko Button B
```

**Base styles (from design tokens):**

```css
.Highlights_Highlights__article__3Jwby {
  background: #000000;
  padding: 4px;
}```

### Highlights Highlights  Track  Scroll  5xlzZ

**Instances found:** 3

**CSS classes:** `.Highlights_Highlights__track--scroll__5xlzZ` `.Highlights_Highlights__track__LDgsB`

**HTML structure:**

```html
<div class="Highlights_Highlights__track__LDgsB Highlights_Highlights__track--scroll__5xlzZ"><div class="Highlights_Highlights__slides___gmTa Highlights_Highlights__slides--scroll__MfnSJ" style="--visible-items:4"><div class="Highlights__slide Highlights_Highlights__slide--scroll__fgJiF"><article class="Card_Card__aSCdZ Card_Card--primary__vlN_c FeatureCard_FeatureCard__ShcHA" tabindex="0"><div class="Card_Card__col__FrtMx Card__content"><div class="MicroArticle MicroArticle Card__article"><h3 class="MicroArticleInternal_MicroArticle__title__DjgeA MicroArticle__title">Current accounts</h3><div
```

**Base styles (from design tokens):**

```css
.Highlights_Highlights__track--scroll__5xlzZ {
  background: #000000;
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
| Button | 3 | default, hover, focus |
| Link | 3 | default, hover, focus |

## Transition System

These transition declarations were extracted from interactive elements:

```css
transition: all;
transition: background-color 0.3s cubic-bezier(0, 0, 1, 1);
transition: background-color 0.2s;
transition: background-color 0.3s ease-in-out 0.1s, color 0.3s ease-in-out 0.1s;
```

Apply these to all interactive elements. Never invent new durations or easings.

## Button Interactions

### Button 1 — `Personal`

**States:**

- Default: `../screens/states/button-1-default.png`
- Hover: `../screens/states/button-1-hover.png`
- Focus: `../screens/states/button-1-focus.png`

**Transition:** `all`

_No visible style changes detected for this element._

### Button 2 — `Go to next slide`

**States:**

- Default: `../screens/states/button-2-default.png`
- Hover: `../screens/states/button-2-hover.png`
- Focus: `../screens/states/button-2-focus.png`

**Transition:** `background-color 0.3s cubic-bezier(0, 0, 1, 1)`

_No visible style changes detected for this element._

### Button 3 — `Start auto-playing slides`

**States:**

- Default: `../screens/states/button-3-default.png`
- Hover: `../screens/states/button-3-hover.png`
- Focus: `../screens/states/button-3-focus.png`

**Transition:** `background-color 0.3s cubic-bezier(0, 0, 1, 1)`

_No visible style changes detected for this element._

## Link Interactions

### Link 1 — `Monzo Bank Homepage`

**States:**

- Default: `../screens/states/link-1-default.png`
- Hover: `../screens/states/link-1-hover.png`
- Focus: `../screens/states/link-1-focus.png`

**Transition:** `background-color 0.2s`

_No visible style changes detected for this element._

### Link 2 — `Business`

**States:**

- Default: `../screens/states/link-2-default.png`
- Hover: `../screens/states/link-2-hover.png`
- Focus: `../screens/states/link-2-focus.png`

**Transition:** `all`

_No visible style changes detected for this element._

### Link 3 — `Sign up`

**States:**

- Default: `../screens/states/link-3-default.png`
- Hover: `../screens/states/link-3-hover.png`
- Focus: `../screens/states/link-3-focus.png`

**Transition:** `background-color 0.3s ease-in-out 0.1s, color 0.3s ease-in-out 0.1s`

_No visible style changes detected for this element._

## Interaction Rules

- Accent color `#0000ee` is used for focus rings, active states, and hover highlights
- Transition durations in use: `0.3s`, `0.2s`, `0.1s`
- Always respect `prefers-reduced-motion` — set all transitions to `0s` when enabled

## Design Tokens — JSON Files

### tokens/colors.json
```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "core": {
    "background": {
      "value": "#091723",
      "role": "background",
      "name": "color-navy-900"
    },
    "text-primary": {
      "value": "#ffffff",
      "role": "text-primary",
      "name": "color-white"
    },
    "surface": {
      "value": "#000000",
      "role": "surface",
      "name": "color-black"
    },
    "accent": {
      "value": "#0000ee",
      "role": "accent"
    },
    "text-muted": {
      "value": "#3b4c54",
      "role": "text-muted",
      "name": "color-navy-600"
    }
  },
  "status": {
    "success": {
      "value": "#f2f8f3",
      "role": "success",
      "name": "color-grey-100"
    },
    "danger": {
      "value": "#ff4f40",
      "role": "danger",
      "name": "color-brand"
    }
  },
  "extended": {
    "theme-color": {
      "value": "#112231",
      "role": "info",
      "name": "theme-color"
    },
    "color-blue-500": {
      "value": "#218fb7",
      "role": "unknown",
      "name": "color-blue-500"
    },
    "calc-chart-take-home": {
      "value": "#2eafc0",
      "role": "unknown",
      "name": "calc-chart-take-home"
    },
    "color-teal-550": {
      "value": "#016b83",
      "role": "unknown",
      "name": "color-teal-550"
    },
    "color-grey-200": {
      "value": "#e3ebe4",
      "role": "unknown",
      "name": "color-grey-200"
    },
    "color-navy-700": {
      "value": "#2c3a43",
      "role": "unknown",
      "name": "color-navy-700"
    },
    "color-d9ff6f": {
      "value": "#d9ff6f",
      "role": "unknown"
    },
    "color-ffd7f0": {
      "value": "#ffd7f0",
      "role": "unknown"
    },
    "color-blue-200": {
      "value": "#bbf6e2",
      "role": "unknown",
      "name": "color-blue-200"
    },
    "avatar-color-orange-70": {
      "value": "#ff945a",
      "role": "unknown",
      "name": "avatar-color-orange-70"
    },
    "color-grey-300": {
      "value": "#c9d0c6",
      "role": "unknown",
      "name": "color-grey-300"
    },
    "avatar-color-lime-70": {
      "value": "#99af73",
      "role": "unknown",
      "name": "avatar-color-lime-70"
    },
    "color-dffff7": {
      "value": "#dffff7",
      "role": "unknown"
    }
  },
  "meta": {
    "theme": "dark",
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
    "MonzoSansDisplay",
    "Oldschool",
    "Maison Neue Mono Web"
  ],
  "scale": {
    "heading-1": {
      "fontFamily": "MonzoSansDisplay",
      "fontSize": "10rem",
      "fontWeight": "700",
      "lineHeight": null,
      "source": "css"
    },
    "heading-2": {
      "fontFamily": "MonzoSansDisplay",
      "fontSize": "8.5rem",
      "fontWeight": "700",
      "lineHeight": null,
      "source": "css"
    },
    "heading-3": {
      "fontFamily": "MonzoSansDisplay",
      "fontSize": "6.5625rem",
      "fontWeight": "700",
      "lineHeight": null,
      "source": "css"
    },
    "body": {
      "fontFamily": "Oldschool",
      "fontSize": "1rem",
      "fontWeight": "400",
      "lineHeight": null,
      "source": "css"
    },
    "caption": {
      "fontFamily": "Oldschool",
      "fontSize": "1.125rem",
      "fontWeight": "400",
      "lineHeight": null,
      "source": "css"
    },
    "code": {
      "fontFamily": "Maison Neue Mono Web",
      "fontSize": "14px",
      "fontWeight": "400",
      "lineHeight": null,
      "source": "css"
    }
  },
  "fontFaces": [
    {
      "family": "Oldschool",
      "src": "https://monzo.com/static/fonts/OldschoolGroteskCompact-ExtraBold.woff2",
      "format": "woff2",
      "weight": "800"
    },
    {
      "family": "MonzoSansDisplay",
      "src": "https://monzo.com/static/fonts/MonzoSansDisplay-ExtraBold.woff2",
      "format": "woff2",
      "weight": "800"
    },
    {
      "family": "MonzoSansDisplay",
      "src": "https://monzo.com/static/fonts/MonzoSansDisplay-Bold.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "MonzoSansDisplay",
      "src": "https://monzo.com/static/fonts/MonzoSansDisplay-BoldItalic.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "MonzoSansDisplay",
      "src": "https://monzo.com/static/fonts/MonzoSansDisplay-Italic.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "MonzoSansDisplay",
      "src": "https://monzo.com/static/fonts/MonzoSansDisplay-Medium.woff2",
      "format": "woff2",
      "weight": "500"
    },
    {
      "family": "MonzoSansDisplay",
      "src": "https://monzo.com/static/fonts/MonzoSansDisplay-MediumItalic.woff2",
      "format": "woff2",
      "weight": "500"
    },
    {
      "family": "MonzoSansDisplay",
      "src": "https://monzo.com/static/fonts/MonzoSansDisplay-Regular.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "MonzoSansDisplay",
      "src": "https://monzo.com/static/fonts/MonzoSansDisplay-SemiBold.woff2",
      "format": "woff2",
      "weight": "600"
    },
    {
      "family": "MonzoSansDisplay",
      "src": "https://monzo.com/static/fonts/MonzoSansDisplay-SemiBoldItalic.woff2",
      "format": "woff2",
      "weight": "600"
    },
    {
      "family": "MonzoSansText",
      "src": "https://monzo.com/static/fonts/MonzoSansText-Bold.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "MonzoSansText",
      "src": "https://monzo.com/static/fonts/MonzoSansText-BoldItalic.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "MonzoSansText",
      "src": "https://monzo.com/static/fonts/MonzoSansText-Italic.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "MonzoSansText",
      "src": "https://monzo.com/static/fonts/MonzoSansText-Medium.woff2",
      "format": "woff2",
      "weight": "500"
    },
    {
      "family": "MonzoSansText",
      "src": "https://monzo.com/static/fonts/MonzoSansText-MediumItalic.woff2",
      "format": "woff2",
      "weight": "500"
    },
    {
      "family": "MonzoSansText",
      "src": "https://monzo.com/static/fonts/MonzoSansText-Regular.woff2",
      "format": "woff2",
      "weight": "000"
    },
    {
      "family": "MonzoSansText",
      "src": "https://monzo.com/static/fonts/MonzoSansText-SemiBold.woff2",
      "format": "woff2",
      "weight": "600"
    },
    {
      "family": "MonzoSansText",
      "src": "https://monzo.com/static/fonts/MonzoSansText-SemiBoldItalic.woff2",
      "format": "woff2",
      "weight": "600"
    },
    {
      "family": "Maison Neue Web",
      "src": "https://monzo.com/static/fonts/maisonneueweb-bold.woff",
      "format": "woff",
      "weight": "700"
    },
    {
      "family": "Maison Neue Web",
      "src": "https://monzo.com/static/fonts/maisonneueweb-bold.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "Maison Neue Web",
      "src": "https://monzo.com/static/css/fonts/maisonneueweb-bold-italic.woff",
      "format": "woff",
      "weight": "700"
    },
    {
      "family": "Maison Neue Web",
      "src": "https://monzo.com/static/fonts/maisonneueweb-bold-italic.woff2",
      "format": "woff2",
      "weight": "700"
    },
    {
      "family": "Maison Neue Web",
      "src": "https://monzo.com/static/fonts/maisonneueweb-demi.woff",
      "format": "woff",
      "weight": "600"
    },
    {
      "family": "Maison Neue Web",
      "src": "https://monzo.com/static/fonts/maisonneueweb-demi.woff2",
      "format": "woff2",
      "weight": "600"
    },
    {
      "family": "Maison Neue Web",
      "src": "https://monzo.com/static/fonts/maisonneueweb-medium-webfont.woff",
      "format": "woff",
      "weight": "400"
    },
    {
      "family": "Maison Neue Web",
      "src": "https://monzo.com/static/fonts/maisonneueweb-medium-webfont.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Maison Neue Web",
      "src": "https://monzo.com/static/fonts/maisonneueweb-medium-italic-webfont.woff",
      "format": "woff",
      "weight": "400"
    },
    {
      "family": "Maison Neue Web",
      "src": "https://monzo.com/static/fonts/maisonneueweb-medium-italic-webfont.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Maison Neue Mono Web",
      "src": "https://monzo.com/static/fonts/maisonneueweb-mono.woff",
      "format": "woff",
      "weight": "400"
    },
    {
      "family": "Maison Neue Mono Web",
      "src": "https://monzo.com/static/fonts/maisonneueweb-mono.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Maison Neue Mono Web",
      "src": "https://monzo.com/static/fonts/maisonneueweb-mono-italic.woff",
      "format": "woff",
      "weight": "400"
    },
    {
      "family": "Maison Neue Mono Web",
      "src": "https://monzo.com/static/fonts/maisonneueweb-mono-italic.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Maison Neue Mono Web",
      "src": "https://monzo.com/static/fonts/maisonneueweb-mono-bold.woff",
      "format": "woff",
      "weight": "700"
    },
    {
      "family": "Maison Neue Mono Web",
      "src": "https://monzo.com/static/fonts/maisonneueweb-mono-bold.woff2",
      "format": "woff2",
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

- `fonts/MaisonNeueMonoWeb-700.woff`
- `fonts/MaisonNeueMonoWeb-700.woff2`
- `fonts/MaisonNeueMonoWeb-Regular.woff`
- `fonts/MaisonNeueMonoWeb-Regular.woff2`
- `fonts/MaisonNeueWeb-Regular.woff`
- `fonts/MaisonNeueWeb-Regular.woff2`
- `fonts/MonzoSansDisplay-500.woff2`
- `fonts/MonzoSansDisplay-600.woff2`
- `fonts/MonzoSansDisplay-700.woff2`
- `fonts/MonzoSansDisplay-800.woff2`
- `fonts/MonzoSansDisplay-Regular.woff2`
- `fonts/MonzoSansText-000.woff2`
- `fonts/MonzoSansText-500.woff2`
- `fonts/MonzoSansText-600.woff2`
- `fonts/MonzoSansText-700.woff2`
- `fonts/MonzoSansText-Regular.woff2`
- `fonts/Oldschool-800.woff2`

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

![current-account-16-17.png](screens/pages/current-account-16-17.png)

![current-account-joint-account.png](screens/pages/current-account-joint-account.png)

![current-account-personal.png](screens/pages/current-account-personal.png)

![current-account-under-16s.png](screens/pages/current-account-under-16s.png)

![home.png](screens/pages/home.png)

### Section Clips (screens/sections/)

*Clipped individual sections and components*

![current-account-16-17-section-1.png](screens/sections/current-account-16-17-section-1.png)

![current-account-joint-account-section-1.png](screens/sections/current-account-joint-account-section-1.png)

![current-account-personal-section-1.png](screens/sections/current-account-personal-section-1.png)

![current-account-under-16s-section-1.png](screens/sections/current-account-under-16s-section-1.png)

![home-section-1.png](screens/sections/home-section-1.png)

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
| 17% | 2183px | `screens/scroll/scroll-017.png` |
| 33% | 4237px | `screens/scroll/scroll-033.png` |
| 50% | 6420px | `screens/scroll/scroll-050.png` |
| 67% | 8602px | `screens/scroll/scroll-067.png` |
| 83% | 10656px | `screens/scroll/scroll-083.png` |
| 100% | 12839px | `screens/scroll/scroll-100.png` |

## Video First Frames

- Video 1 (background): `screens/scroll/video-1-frame.png`

## Pages

| Page | URL | File |
|------|-----|------|
| Monzo | Open a Free Account | `https://monzo.com/` | `screens/pages/home.png` |
| Open a Free Online Bank Account in Minutes with Monzo | `https://monzo.com/current-account/personal` | `screens/pages/current-account-personal.png` |
| Open a Joint Bank Account | Simplify Shared Costs with Monzo | `https://monzo.com/current-account/joint-account` | `screens/pages/current-account-joint-account.png` |
| Monzo for Under 16s | A Free Bank Account for Kids | `https://monzo.com/current-account/under-16s` | `screens/pages/current-account-under-16s.png` |
| A Bank Account for 16-17 Year Olds | Teen Bank Accounts | `https://monzo.com/current-account/16-17` | `screens/pages/current-account-16-17.png` |

## Sections

| Page | Section | File |
|------|---------|------|
| home | #1 (section) | `screens/sections/home-section-1.png` |
| current-account-personal | #1 (section) | `screens/sections/current-account-personal-section-1.png` |
| current-account-joint-account | #1 (section) | `screens/sections/current-account-joint-account-section-1.png` |
| current-account-under-16s | #1 (section) | `screens/sections/current-account-under-16s-section-1.png` |
| current-account-16-17 | #1 (section) | `screens/sections/current-account-16-17-section-1.png` |

## Homepage Screenshots (screenshots/)

![homepage.png](screenshots/homepage.png)

