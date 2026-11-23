---
name: revolut-design
description: Design system skill for revolut. Activate when building UI components, pages, or any visual elements. Provides exact color tokens, typography scale, spacing grid, component patterns, and craft rules. Read references/DESIGN.md before writing any CSS or JSX. Includes ultra-mode visual journey: read references/ANIMATIONS.md, references/LAYOUT.md, references/COMPONENTS.md, and references/INTERACTIONS.md for full motion and layout details.
---

# revolut Design System

You are building UI for **revolut**. Dark-themed, neutral palette, sans-serif typography (Inter), compact density on a 4px grid, flat elevation (no shadows).

## Visual Reference

**IMPORTANT**: Study ALL screenshots below before writing any UI. Match colors, typography, spacing, layout, and motion exactly as shown.

### Homepage

![revolut Homepage](screenshots/homepage.png)

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

- **Flat elevation** — depth through color shifts and borders, never shadows. Surfaces get progressively lighter to indicate elevation.
- **Solid colors only** — no gradients anywhere. Every surface is a single flat color.
- **Type pairing** — Inter for body/UI text, Aeonik Pro for headings/display. Never introduce a third typeface.
- **compact density** — 4px base grid. Every dimension is a multiple of 4.
- **neutral palette** — the color temperature runs neutral, matching the sans-serif typography.
- **Minimal motion** — prefer instant state changes. Only use transitions for loading and page transitions.

## Color System

### Core Palette

| Role | Token | Hex | Use |
|------|-------|-----|-----|
| Background | `--background` | `#1f1f1f` | Page/app background |
| Surface | `--surface` | `#000000` | Cards, panels, modals |
| Text Primary | `--text-primary` | `#ffffff` | Headings, body text |
| Text Muted | `--text-muted` | `#717173` | Captions, placeholders |

### Extended Palette

- `#c9c9cd`
- `#6fa0ff`

### CSS Variable Tokens

```css
--rui-color-channel-accent: 55 108 213;
--rui-color-channel-accent-control-neutral: 40 40 40;
--rui-color-channel-accent-neutral: 40 40 40;
--rui-color-channel-action-background: 55 108 213;
--rui-color-channel-action-background-neutral: 238 238 238;
--rui-color-channel-action-photo-header-background: 55 108 213;
--rui-color-channel-action-photo-header-background-neutral: 255 255 255;
--rui-color-channel-background: 255 255 255;
--rui-color-channel-grouped-background: 247 247 247;
--rui-color-channel-nested-background: 31 31 31;
--rui-color-channel-popover-background: 255 255 255;
--rui-color-channel-search-background: 31 31 31;
--rui-color-channel-segmented-background: 31 31 31;
--rui-color-channel-disabled-background: 247 247 247;
--rui-color-channel-foreground: 31 31 31;
--rui-color-channel-on-accent: 255 255 255;
--rui-color-channel-on-accent-neutral: 255 255 255;
--rui-color-channel-red-action-background: 254 246 245;
--rui-color-accent: #376cd5;
--rui-color-accent-control-neutral: #282828;
```

## Typography

### Font Stack

- **Inter** — Heading 1, Heading 2, Heading 3
- **Aeonik Pro** — Body, Caption

### Font Sources

```css
@font-face {
  font-family: "Inter";
  src: url("fonts/Inter-SemiBold.ttf") format("truetype");
  font-weight: 600;
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
```

### Type Scale

| Role | Family | Size | Weight |
|------|--------|------|--------|
| Heading 1 | Inter | 48px / 3rem | 700 |
| Heading 2 | Inter | 32px / 2rem | 600 |
| Heading 3 | Inter | 24px / 1.5rem | 600 |
| Body | Aeonik Pro | 16px / 1rem | 400 |
| Caption | Aeonik Pro | 12px / 0.75rem | 400 |

### Typography Rules

- Body/UI: **Inter**, Headings: **Aeonik Pro** — these are the only display fonts
- Max 3-4 font sizes per screen
- Headings: weight 600-700, body: weight 400
- Use color and opacity for text hierarchy, not additional font sizes
- Line height: 1.5 for body, 1.2 for headings

## Spacing & Layout

### Base Grid: 4px

Every dimension (margin, padding, gap, width, height) must be a multiple of **4px**.

### Spacing Scale

`4, 6, 8, 10, 12, 16, 18, 20, 24, 32, 34, 36` px

### Spacing as Meaning

| Spacing | Use |
|---------|-----|
| 4-8px | Tight: related items (icon + label, avatar + name) |
| 12-16px | Medium: between groups within a section |
| 24-32px | Wide: between distinct sections |
| 48px+ | Vast: major page section breaks |

### Border Radius

Scale: `12px, 16px, 24px, 50px`
Default: `24px`

## Component Patterns

### Card

```css
.card {
  background: #000000;
  border-radius: 24px;
  padding: 16px;
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
  background: #444444;
  color: #ffffff;
  border-radius: 24px;
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
  border-radius: 24px;
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
  background: #1f1f1f;
  border: 1px solid #444444;
  border-radius: 24px;
  padding: 8px 12px;
  color: #ffffff;
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
  background: #000000;
  color: #717173;
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
  border-radius: 50px;
  padding: 24px;
  max-width: 480px;
  width: 90vw;
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
  color: #717173;
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
  color: #717173;
  padding: 8px 12px;
  border-radius: 24px;
  transition: color 150ms;
}
.nav-link:hover { color: #ffffff; }
```

```html
<nav class="nav">
  <a href="/" class="nav-link active">Home</a>
  <a href="/about" class="nav-link">About</a>
  <a href="/pricing" class="nav-link">Pricing</a>
  <button class="btn-primary" style="margin-left: auto">Get Started</button>
</nav>
```

## Animation & Motion

This project uses **subtle motion**. Transitions smooth state changes without calling attention.

### Motion Guidelines

- **Duration:** 150-300ms for micro-interactions, 300-500ms for page transitions
- **Easing:** `ease-out` for enters, `ease-in` for exits
- **Direction:** Elements enter from bottom/right, exit to top/left
- **Reduced motion:** Always respect `prefers-reduced-motion` — disable animations when set

## Depth & Elevation

This design uses **flat elevation** — no box-shadows anywhere.

### Elevation Strategy

| Level | Technique | Use |
|-------|-----------|-----|
| 0 — Base | Background color | Page background |
| 1 — Raised | Lighter surface + subtle border | Cards, panels |
| 2 — Floating | Even lighter surface + stronger border | Dropdowns, popovers |
| 3 — Overlay | Backdrop + modal surface | Modals, dialogs |

## Anti-Patterns (Never Do)

- **No box-shadow** on any element — use borders and surface colors for depth
- **No gradients** — solid colors only, everywhere
- **No blur effects** — no backdrop-blur, no filter: blur()
- **No zebra striping** — tables and lists use borders for separation
- **No invented colors** — every hex value must come from the palette above
- **No arbitrary spacing** — every dimension is a multiple of 4px
- **No extra fonts** — only Inter and Aeonik Pro are allowed
- **No arbitrary border-radius** — use the scale: 12px, 16px, 24px, 50px
- **No opacity for disabled states** — use muted colors instead

## Workflow

1. **Read** `references/DESIGN.md` before writing any UI code
2. **Pick colors** from the Color System section — never invent new ones
3. **Set typography** — Inter, Aeonik Pro only, using the type scale
4. **Build layout** on the 4px grid — check every margin, padding, gap
5. **Match components** to patterns above before creating new ones
6. **Apply elevation** — flat, surface color shifts only
7. **Validate** — every value traces back to a design token. No magic numbers.

## Brand Spec

- **Site URL:** `https://www.revolut.com/`
- **Brand typeface:** Inter

## Quick Reference

```
Background:     #1f1f1f
Surface:        #000000
Text:           #ffffff / #717173
Accent:         (not extracted)
Border:         (not extracted)
Font:           Inter
Spacing:        4px grid
Radius:         24px
Components:     0 detected
```

## When to Trigger

Activate this skill when:
- Creating new components, pages, or visual elements for revolut
- Writing CSS, Tailwind classes, styled-components, or inline styles
- Building page layouts, templates, or responsive designs
- Reviewing UI code for design consistency
- The user mentions "revolut" design, style, UI, or theme
- Generating mockups, wireframes, or visual prototypes

---

# Full Reference Files

> Every output file is embedded below. Claude has full design system context from /skills alone.

## Design System Tokens (DESIGN.md)

# revolut DESIGN.md

> Auto-generated design system — reverse-engineered via static analysis by skillui.
> Frameworks: None detected
> Colors: 6 · Fonts: 2 · Components: 0
> Icon library: not detected · State: not detected
> Primary theme: dark · Dark mode toggle: no · Motion: none

## Visual Reference

**Match this design exactly** — study colors, fonts, spacing, and component shapes before writing any UI code.

![revolut Homepage](../screenshots/homepage.png)

---

## 1. Visual Theme & Atmosphere

This is a **dark-themed** interface with a flat, neutral visual language. Elevation is achieved through color and border shifts rather than shadows — a clean, industrial aesthetic. Typography pairs **Aeonik Pro** for display/headings with **Inter** for body text, creating clear visual hierarchy through type contrast. Spacing follows a **4px base grid** (compact density), with scale: 4, 6, 8, 10, 12, 16, 18, 20px.

---

## 2. Color Palette & Roles

| Token | Hex | Role | Use |
|---|---|---|---|
| background | `#1f1f1f` | background | Page background, darkest surface |
| surface | `#000000` | surface | Card and panel backgrounds |
| text-primary | `#ffffff` | text-primary | Headings and body text |
| text-muted | `#717173` | text-muted | Captions, placeholders, secondary info |
| info | `#6fa0ff` | info | Informational highlights |
| unknown | `#c9c9cd` | unknown | Palette color |

### CSS Variable Tokens

```css
--rui-color-channel-accent: 55 108 213;
--rui-color-channel-accent-control-neutral: 40 40 40;
--rui-color-channel-accent-neutral: 40 40 40;
--rui-color-channel-action-background: 55 108 213;
--rui-color-channel-action-background-neutral: 238 238 238;
--rui-color-channel-action-photo-header-background: 55 108 213;
--rui-color-channel-action-photo-header-background-neutral: 255 255 255;
--rui-color-channel-background: 255 255 255;
--rui-color-channel-grouped-background: 247 247 247;
--rui-color-channel-nested-background: 31 31 31;
--rui-color-channel-popover-background: 255 255 255;
--rui-color-channel-search-background: 31 31 31;
--rui-color-channel-segmented-background: 31 31 31;
--rui-color-channel-disabled-background: 247 247 247;
--rui-color-channel-foreground: 31 31 31;
--rui-color-channel-on-accent: 255 255 255;
--rui-color-channel-on-accent-neutral: 255 255 255;
--rui-color-channel-red-action-background: 254 246 245;
--rui-color-accent: #376cd5;
--rui-color-accent-control-neutral: #282828;
```


---

## 3. Typography Rules

**Font Stack:**
- **Inter** — Heading 1, Heading 2, Heading 3
- **Aeonik Pro** — Body, Caption

**Font Sources:**

```css
@font-face {
  font-family: "Inter";
  src: url("fonts/Inter-SemiBold.ttf") format("truetype");
  font-weight: 600;
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
```

| Role | Font | Size | Weight |
|---|---|---|---|
| Heading 1 | Inter | 48px / 3rem | 700 |
| Heading 2 | Inter | 32px / 2rem | 600 |
| Heading 3 | Inter | 24px / 1.5rem | 600 |
| Body | Aeonik Pro | 16px / 1rem | 400 |
| Caption | Aeonik Pro | 12px / 0.75rem | 400 |

**Typographic Rules:**
- Limit to 2 font families max per screen
- Use **Inter** for body/UI text, **Aeonik Pro** for display/headings
- Maintain consistent hierarchy: no more than 3-4 font sizes per screen
- Headings use bold (600-700), body uses regular (400)
- Line height: 1.5 for body text, 1.2 for headings
- Use color and opacity for secondary hierarchy, not additional font sizes


---

## 4. Component Stylings

No components detected. Scan `src/components/` or `components/` to populate this section.

---

## 5. Layout Principles

- **Base spacing unit:** 4px
- **Spacing scale:** 4, 6, 8, 10, 12, 16, 18, 20, 24, 32, 34, 36
- **Border radius:** 12px, 16px, 24px, 50px

**Spacing as Meaning:**
| Spacing | Use |
|---|---|
| 4-8px | Tight: related items within a group |
| 12-16px | Medium: between groups |
| 24-32px | Wide: between sections |
| 48px+ | Vast: major section breaks |


---

## 6. Depth & Elevation

No box-shadow values detected. The design uses a **flat visual style** — elevation is conveyed through background color shifts and borders rather than shadows.

**Elevation Strategy:**
| Level | Technique | Use |
|---|---|---|
| 0 — Base | Background color | Page background |
| 1 — Raised | Lighter surface + subtle border | Cards, panels |
| 2 — Floating | Even lighter surface + stronger border | Dropdowns, popovers |
| 3 — Overlay | Backdrop + modal surface | Modals, dialogs |


---

## 8. Do's and Don'ts

### Do's

- Use `#1f1f1f` as the primary page background
- Pair **Inter** (body) with **Aeonik Pro** (display) — these are the only allowed fonts
- Follow the **4px** spacing grid for all margins, padding, and gaps
- Use border and background shifts for elevation — not shadows
- Use border-radius from the scale: 12px, 16px, 24px, 50px

### Don'ts

- Don't introduce colors outside this palette — extend the design tokens first
- Don't introduce additional font families beyond Inter and Aeonik Pro
- Don't use arbitrary spacing values — stick to multiples of 4px
- Don't add box-shadow — this design system uses flat elevation
- Don't use gradients — the design uses solid colors only
- Don't use arbitrary border-radius values — pick from the defined scale
- Don't use backdrop-blur or blur effects

### Anti-Patterns (detected from codebase)

- No box-shadow on any element
- No gradient backgrounds
- No blur or backdrop-blur effects
- No zebra striping on tables/lists


---

## 9. Responsive Behavior

No breakpoints detected. Consider adding responsive breakpoints to the design system.

---

## 10. Agent Prompt Guide

Use these as starting points when building new UI:

### Build a Card

```
Background: #000000
Border: 1px solid var(--border)
Radius: 24px
Padding: 16px
Font: Inter
No shadows — use borders and surface colors for depth.
```

### Build a Button

```
Primary: bg var(--accent), text white
Ghost: bg transparent, border var(--border)
Padding: 8px 16px
Radius: 24px
Hover: opacity 0.9 or lighter shade
Focus: ring with var(--accent)
```

### Build a Page Layout

```
Background: #1f1f1f
Max-width: 1280px, centered
Grid: 4px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface: #000000
Label: #717173 (muted, 12px, uppercase)
Value: #ffffff (primary, 24-32px, bold)
Status: use success/warning/danger from Section 2
```

### Build a Form

```
Input bg: #1f1f1f
Input border: 1px solid var(--border)
Focus: border-color var(--accent)
Label: #717173 12px
Spacing: 16px between fields
Radius: 24px
```

### General Component

```
1. Read DESIGN.md Sections 2-6 for tokens
2. Colors: only from palette
3. Font: Inter, type scale from Section 3
4. Spacing: 4px grid
5. Components: match patterns from Section 4
6. Elevation: flat, surface shifts
```

## Visual Guide — Screenshots (VISUAL_GUIDE.md)

# revolut — Visual Guide

> Master visual reference. Study every screenshot carefully before implementing any UI.
> Match colors, layout, typography, spacing, and motion states exactly.

## Scroll Journey

The page has cinematic scroll animations. Each screenshot below shows the exact visual state at that scroll depth.
**Replicate these transitions precisely** — the design changes dramatically as you scroll.

### Hero — Above the fold

*Scroll position: 0px of 8727px total*

![Hero — Above the fold](../screens/scroll/scroll-000.png)

### 17% scroll depth

*Scroll position: 1331px of 8727px total*

![17% scroll depth](../screens/scroll/scroll-017.png)

### 33% scroll depth

*Scroll position: 2583px of 8727px total*

![33% scroll depth](../screens/scroll/scroll-033.png)

### 50% scroll depth

*Scroll position: 3914px of 8727px total*

![50% scroll depth](../screens/scroll/scroll-050.png)

### 67% scroll depth

*Scroll position: 5244px of 8727px total*

![67% scroll depth](../screens/scroll/scroll-067.png)

### 83% scroll depth

*Scroll position: 6496px of 8727px total*

![83% scroll depth](../screens/scroll/scroll-083.png)

### Footer — End of page

*Scroll position: 7827px of 8727px total*

![Footer — End of page](../screens/scroll/scroll-100.png)

## Full Page Screenshots

### Banking & Beyond | Revolut United Kingdom

*URL: `https://www.revolut.com/`*

![Banking & Beyond | Revolut United Kingdom](../screens/pages/home.png)

### Business Account | Manage Your Finances | Revolut Business

*URL: `https://www.revolut.com/business/`*

![Business Account | Manage Your Finances | Revolut Business](../screens/pages/business.png)

### About us | Revolut United Kingdom

*URL: `https://www.revolut.com/discover-our-company/`*

![About us | Revolut United Kingdom](../screens/pages/discover-our-company.png)

### All-in-one finance app for your money | Revolut United Kingdom

*URL: `https://www.revolut.com/bank-account/`*

![All-in-one finance app for your money | Revolut United Kingdom](../screens/pages/bank-account.png)

### Joint accounts | Revolut United Kingdom

*URL: `https://www.revolut.com/joint-accounts/`*

![Joint accounts | Revolut United Kingdom](../screens/pages/joint-accounts.png)

## Section Screenshots

Clipped sections showing individual components in context.

### Section 1 — `section`

*1440×900px*

![Section 1](../screens/sections/home-section-1.png)

### Section 1 — `section`

*1440×900px*

![Section 1](../screens/sections/business-section-1.png)

### Section 2 — `section`

*1000×740px*

![Section 2](../screens/sections/business-section-2.png)

### Section 1 — `section`

*1440×900px*

![Section 1](../screens/sections/discover-our-company-section-1.png)

### Section 2 — `section`

*1000×740px*

![Section 2](../screens/sections/discover-our-company-section-2.png)

### Section 1 — `section`

*1440×900px*

![Section 1](../screens/sections/bank-account-section-1.png)

### Section 2 — `section`

*1000×740px*

![Section 2](../screens/sections/bank-account-section-2.png)

### Section 1 — `section`

*1440×900px*

![Section 1](../screens/sections/joint-accounts-section-1.png)

### Section 2 — `section`

*1000×740px*

![Section 2](../screens/sections/joint-accounts-section-2.png)

## Animations & Motion (ANIMATIONS.md)

# Animation Reference

> Cinematic motion design extracted from live DOM. Follow these specs exactly to recreate the experience.

## Motion Technology Stack

Pure CSS animations — no external animation libraries detected.

## Scroll Journey

The page is **8,727px** tall. Each frame below shows what the user sees at that scroll depth.

> **Use these screenshots to understand WHAT animates, WHEN it animates, and HOW it moves.**

### 0% — Top / Hero
Scroll position: 0px

![Scroll 0%](../screens/scroll/scroll-000.png)

### 17% — Opening Section
Scroll position: 1,331px

![Scroll 17%](../screens/scroll/scroll-017.png)

### 33% — First Feature Section
Scroll position: 2,583px

![Scroll 33%](../screens/scroll/scroll-033.png)

### 50% — Mid-Page
Scroll position: 3,914px

![Scroll 50%](../screens/scroll/scroll-050.png)

### 67% — Lower Content
Scroll position: 5,244px

![Scroll 67%](../screens/scroll/scroll-067.png)

### 83% — Near Footer
Scroll position: 6,496px

![Scroll 83%](../screens/scroll/scroll-083.png)

### 100% — Bottom / Footer
Scroll position: 7,827px

![Scroll 100%](../screens/scroll/scroll-100.png)

## Video Elements

| # | Role | Autoplay | Loop | Muted | Size | First Frame |
|---|------|----------|------|-------|------|-------------|
| 1 | background | — | — | ✓ | 1440×900 | — |
| 2 | background | — | — | ✓ | 1440×900 | — |
| 3 | background | — | — | ✓ | 1440×900 | — |
| 4 | content | — | — | ✓ | 450×600 | — |
| 5 | background | — | — | ✓ | 1000×432 | — |

- **Source:** `https://assets.revolut.com/published-assets-v3/5b4c4cc6-f5e3-4013-abb9-02ed70191f31/79c359d8-7025-4121-924b-b7880f97bcf4`
- **Source:** `https://assets.revolut.com/published-assets-v3/94a4cf97-5819-45b0-8219-b7b16e94ecac/959ae3c2-0d48-4c3e-a30e-2defda91b1f0`
- **Source:** `https://assets.revolut.com/published-assets-v3/01191ed4-da4e-4f6b-927b-62523ffec28d/b2e3f4d8-5321-4e16-9942-34f83106159b`
- **Source:** `https://assets.revolut.com/published-assets-v3/7bf7c951-27c0-4ceb-9021-881e85ca6b25/332f5fdd-c0b9-44be-8dea-fc17b3d6ccdf`
- **Source:** `https://assets.revolut.com/published-assets-v3/a07a910c-0df4-45f5-b0ca-7864377877a3/0da52da5-f59c-4863-a918-d8861c032000`
- **Poster:** `https://assets.revolut.com/published-assets-v3/94150ea7-4f5d-4931-9947-ab0518bea769/07844b11-869f-4b91-a5e5-ae2605f6c1c8`

## CSS Keyframes (15 extracted)

### `@keyframes lranf5w`

Duration: `0.6s` · Easing: `cubic-bezier(0, 0, 0.2, 1)` · Delay: `0.6s` · Fill: `both`

Used by: `.lranf510`

```css
@keyframes lranf5w {
  0% {
    opacity: 0;
    filter: blur(8px);
  }
  100% {
    opacity: 1;
    filter: blur(0px);
  }
}
```

> Opacity fade · Filter effect (blur/brightness)

### `@keyframes lranf5x`

Duration: `0.6s` · Easing: `cubic-bezier(0.8, 0, 1, 1)` · Fill: `both`

Used by: `.lranf511`

```css
@keyframes lranf5x {
  0% {
    opacity: 1;
    filter: blur(0px);
  }
  100% {
    opacity: 0;
    filter: blur(8px);
  }
}
```

> Opacity fade · Filter effect (blur/brightness)

### `@keyframes gdhgct1`

Duration: `1.5s` · Easing: `cubic-bezier(0.45, 0, 0.55, 1)` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.gdhgct6`

```css
@keyframes gdhgct1 {
  0% {
    clip-path: inset(26% 39% round 20px);
  }
  100% {
    clip-path: inset(-5% round 20px);
  }
}
```

> Clip-path reveal

### `@keyframes _11q409s0`

Duration: `0.16s` · Easing: `cubic-bezier(0.16, 1, 0.3, 1)` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `._11q409s6._11q409s6`

```css
@keyframes _11q409s0 {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
```

> Opacity fade

### `@keyframes _11q409s1`

Duration: `1.5s` · Easing: `cubic-bezier(0.45, 0, 0.55, 1)` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `._11q409s9`

```css
@keyframes _11q409s1 {
  0% {
    transform: scale(0.8);
  }
  100% {
    transform: scale(1);
  }
}
```

> Transform/motion animation

### `@keyframes _11q409s2`

Duration: `1.5s` · Easing: `cubic-bezier(0.33, 0, 0.2, 1)` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `._11q409sc`

```css
@keyframes _11q409s2 {
  0% {
    max-width: calc(159.341px);
  }
  100% {
    max-width: calc(362.2px);
  }
}
```

> Dimension expand/collapse

### `@keyframes _11q409s4`

Duration: `1.5s` · Easing: `cubic-bezier(0.33, 0, 0.2, 1)` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `._11q409sf`

```css
@keyframes _11q409s4 {
  0% {
    opacity: 0;
  }
  12% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes _1ubh0r0`

Duration: `1.4s` · Easing: `ease-in-out` · Delay: `0s` · Iteration: `infinite` · Fill: `backwards`

Used by: `[data-pending] ._1ubh0r4 > div`

```css
@keyframes _1ubh0r0 {
  0% {
  }
  14.29% {
  }
  57.14% {
  }
  71.43% {
  }
  100% {
  }
}
```

> Background color/gradient shift · Background position (shimmer/scroll)

### `@keyframes _1ubh0r1`

Duration: `2.2s`

Used by: `[data-pending][data-pin-size="6"] ._1ubh0r4 > div`

```css
@keyframes _1ubh0r1 {
  0% {
  }
  9.09% {
  }
  54.55% {
  }
  63.64% {
  }
  100% {
  }
}
```

> Background color/gradient shift · Background position (shimmer/scroll)

### `@keyframes _1ubh0r2`

Duration: `3s`

Used by: `[data-pending][data-pin-size="8"] ._1ubh0r4 > div`

```css
@keyframes _1ubh0r2 {
  0% {
  }
  6.67% {
  }
  53.33% {
  }
  60% {
  }
  100% {
  }
}
```

> Background color/gradient shift · Background position (shimmer/scroll)

### `@keyframes _1ubh0r3`

Duration: `3.4s`

Used by: `[data-pending][data-pin-size="9"] ._1ubh0r4 > div`

```css
@keyframes _1ubh0r3 {
  0% {
  }
  5.88% {
  }
  52.94% {
  }
  58.82% {
  }
  100% {
  }
}
```

> Background color/gradient shift · Background position (shimmer/scroll)

### `@keyframes _14z6uq10`

```css
@keyframes _14z6uq10 {
  0% {
    transform: translateX(0px);
  }
  100% {
    transform: translateX(-50%);
  }
}
```

> Transform/motion animation

### `@keyframes lranf5e`

```css
@keyframes lranf5e {
  0% {
    --lranf55: 0;
  }
  100% {
    --lranf55: 1;
  }
}
```

### `@keyframes gdhgct0`

```css
@keyframes gdhgct0 {
  0% {
    clip-path: inset(49.5% round 20px);
  }
  100% {
    clip-path: inset(-5% round 20px);
  }
}
```

> Clip-path reveal

### `@keyframes _11q409s3`

```css
@keyframes _11q409s3 {
  0% {
    max-width: calc(221.307px);
  }
  100% {
    max-width: calc(498.389px);
  }
}
```

> Dimension expand/collapse

## Motion Tokens (CSS Variables)

### Duration Tokens

```css
--rui-duration-xs: 100ms;
--rui-duration-sm: 200ms;
--rui-duration-md: 300ms;
--rui-duration-lg: 450ms;
--rui-duration-xl: 900ms;
--rui-duration-skeleton: 1500ms;
```

### Easing Tokens

```css
--rui-timing-sm: var(--rui-duration-sm) var(--rui-easing-default);
--rui-timing-md: var(--rui-duration-md) var(--rui-easing-default);
--rui-timing-lg: var(--rui-duration-lg) var(--rui-easing-default);
--rui-timing-xl: var(--rui-duration-xl) var(--rui-easing-default);
--rui-timing-shadow: var(--rui-duration-sm) var(--rui-easing-shadow);
```

## Global Transition Declarations

These `transition` values were extracted from CSS rules across the site:

```css
transition: color var(--rui-timing-md),background-color var(--rui-timing-md);
transition: opacity var(--rui-timing-md),transform var(--rui-duration-md) var(--rui-easing-toast);
transition: opacity var(--rui-timing-md),height var(--rui-timing-md);
transition: transform 0.2s ease-out;
transition: width var(--rui-timing-md),height var(--rui-timing-md),opacity var(--rui-timing-md);
transition: background-color var(--rui-timing-md);
transition: opacity 0.1s linear;
transition: opacity 0.6s;
transition: opacity 0.6s ease-in-out;
transition: background-color var(--rui-timing-md) color var(--rui-timing-md) opacity var(--rui-timing-md) box-shadow var(--rui-timing-shadow) border-color var(--rui-timing-md);
transition: background-size var(--_1yxq2ae2) linear;
transition: transform 0.35s, opacity 0.35s;
```

## How to Recreate This Motion Design

### Step 2 — Scroll-Reveal Pattern

Elements that animate into view follow this pattern:

```css
/* Initial hidden state */
.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 100ms var(--rui-duration-sm) var(--rui-easing-default),
              transform 100ms var(--rui-duration-sm) var(--rui-easing-default);
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Step 3 — Key Motion Principles

- **Video backgrounds** — use `<video autoplay loop muted playsinline>` for background videos. Always include a poster image fallback
- **Duration scale:** `100ms` · `200ms` · `300ms` · `450ms` · `900ms` · `1500ms` · `0.2s` · `0.1s` · `0.6s` · `0.35s` — use these values, never invent new durations
- **Always add** `@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`

### Step 4 — Scroll Journey Reference

Match what happens at each scroll position:

- **0%** (`0px`) → `screens/scroll/scroll-000.png`
- **17%** (`1331px`) → `screens/scroll/scroll-017.png`
- **33%** (`2583px`) → `screens/scroll/scroll-033.png`
- **50%** (`3914px`) → `screens/scroll/scroll-050.png`
- **67%** (`5244px`) → `screens/scroll/scroll-067.png`
- **83%** (`6496px`) → `screens/scroll/scroll-083.png`
- **100%** (`7827px`) → `screens/scroll/scroll-100.png`

## Layout & Grid (LAYOUT.md)

# Layout Reference

> Auto-extracted from live DOM. Use this to understand how the site is structured spatially.

## Spacing System

**Base grid:** 4px

**Scale:** `4, 6, 8, 10, 12, 16, 18, 20, 24, 32, 34, 36, 40, 56, 64` px

| Spacing | Semantic Use |
|---------|-------------|
| 4px | Tight — within a component |
| 8px | Medium — between sibling items |
| 16px | Wide — between sections |
| 32px | Vast — major section breaks |

## Flex Layouts

| Element | Direction | Justify | Align | Gap | Children |
|---------|-----------|---------|-------|-----|----------|
| `footer.Box-rui__sc-1475jr3-0.cphwlp` | column | — | — | — | 7 |
| `section#d7935e2a-c366-4f3c-b85a-889d6967ad40.Box-rui__sc-147` | row | center | — | — | 1 |
| `section#25c59cb0-f8e8-454a-8b59-daa3df89bfee.Box-rui__sc-147` | row | center | — | — | 4 |
| `section#e7a957ad-b891-4afa-bafe-6cb1eea2ec02.Box-rui__sc-147` | row | center | — | — | 3 |
| `section#62bd35ab-ee15-478c-9d1c-b1b5f8679c4e.Box-rui__sc-147` | row | center | — | — | 2 |
| `section#f85a3566-de16-46d6-8408-83754f1f5a94.Box-rui__sc-147` | row | center | — | — | 1 |
| `section.Box-rui__sc-1475jr3-0.duZJLI` | column | center | — | 24px | 2 |
| `section.Box-rui__sc-1475jr3-0.cphwlp` | column | center | center | — | 3 |

## Structural Containers

### `<main>` (`main.Box-rui__sc-1475jr3-0.Position-rui__sc-o54rtt-0`)

```
display:          block
max-width:        100%
children:         9
```

### `<footer>` (`footer.Box-rui__sc-1475jr3-0.cphwlp`)

```
display:          flex
flex-direction:   column
justify-content:  —
align-items:      —
padding:          40px 220px
children:         7
```

### `<header>` (`header.Box-rui__sc-1475jr3-0.dIUuxU`)

```
display:          block
children:         1
```

### `<section>` (`section#24b6c305-36ff-4886-aeee-8c47f38a1369.Box-rui__sc-147`)

```
display:          block
children:         1
```

### `<section>` (`section#7de98943-92c4-4e70-9e2b-6944c4773cb7.Box-rui__sc-147`)

```
display:          block
max-width:        1000px
children:         1
```

### `<section>` (`section#555d9fc5-8b62-4cf0-b16a-0f4ad21cfa42.Box-rui__sc-147`)

```
display:          block
max-width:        1000px
children:         1
```

### `<section>` (`section#d7935e2a-c366-4f3c-b85a-889d6967ad40.Box-rui__sc-147`)

```
display:          flex
flex-direction:   row
justify-content:  center
align-items:      —
children:         1
```

### `<section>` (`section#dbfef89c-d350-446d-b9dc-6f86320453f6.Box-rui__sc-147`)

```
display:          block
max-width:        1000px
children:         1
```

### `<section>` (`section#f3ff6372-53a2-43d5-b3ff-8d1a14f1e5d2.Box-rui__sc-147`)

```
display:          block
padding:          0px 0px 60px
max-width:        1000px
children:         1
```

### `<section>` (`section#45f4d4d8-fef6-46c7-b4b7-2fac5beaad69.Box-rui__sc-147`)

```
display:          block
max-width:        1000px
children:         1
```

### `<section>` (`section#0ccc8c70-b8ff-40f3-ae78-3b0491e47ab4.Box-rui__sc-147`)

```
display:          block
max-width:        1000px
children:         1
```

### `<section>` (`section#bfac11be-4608-4f98-af14-eb4f8bf585f6.Box-rui__sc-147`)

```
display:          block
max-width:        1000px
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
| **ButtonBase  ButtonStateLayer Rui  Sc 1kvyxgj 0** | button | 28× | `.ButtonBase__ButtonStateLayer-rui__sc-1kvyxgj-0`, `.dcaAJA` |
| **Ellipsis  EllipsisBase Rui  Sc 88yoza 0** | unknown | 22× | `.Ellipsis__EllipsisBase-rui__sc-88yoza-0`, `.dLKIrZ` |
| **Button Rui  Sc 43qi8e 0** | button | 15× | `.Button-rui__sc-43qi8e-0`, `.ButtonBase-rui__sc-1kvyxgj-2`, `.ButtonBase__ButtonBaseWrapper-rui__sc-1kvyxgj-1` |
| **Box Rui  Sc 1475jr3 0** | unknown | 11× | `.Box-rui__sc-1475jr3-0`, `.Position-rui__sc-o54rtt-0`, `.Position__Absolute-rui__sc-o54rtt-2` |
| **Button Rui  Sc 43qi8e 0** | button | 8× | `.Button-rui__sc-43qi8e-0`, `.ButtonBase-rui__sc-1kvyxgj-2`, `.ButtonBase__ButtonBaseWrapper-rui__sc-1kvyxgj-1` |
| **Box Rui  Sc 1475jr3 0** | unknown | 7× | `.Box-rui__sc-1475jr3-0`, `.Flex-rui__sc-1tnvnxg-0`, `.Stack-rui__sc-1l68xd2-0` |
| **AspectRatio  Base Rui  Sc 1ogtlhd 2** | unknown | 7× | `.AspectRatio__Base-rui__sc-1ogtlhd-2`, `.Box-rui__sc-1475jr3-0`, `.cNWhKn` |
| **AspectRatio  Content Rui  Sc 1ogtlhd 1** | unknown | 7× | `.AspectRatio__Content-rui__sc-1ogtlhd-1`, `.dTnZqq` |
| **Box Rui  Sc 1475jr3 0** | unknown | 7× | `.Box-rui__sc-1475jr3-0`, `.dqBMpu` |
| **AspectRatio  Spacer Rui  Sc 1ogtlhd 0** | unknown | 7× | `.AspectRatio__Spacer-rui__sc-1ogtlhd-0`, `.iHEczm` |
| **Box Rui  Sc 1475jr3 0** | badge | 7× | `.Box-rui__sc-1475jr3-0`, `.Text-rui__sc-1mtagir-0`, `.ixiagf` |
| **1s42b4a3** | unknown | 5× | `._1s42b4a3` |
| **Box Rui  Sc 1475jr3 0** | list-item | 4× | `.Box-rui__sc-1475jr3-0`, `.dpXLVE` |
| **Box Rui  Sc 1475jr3 0** | unknown | 3× | `.Box-rui__sc-1475jr3-0`, `._3jquhb6`, `.dIUuxU` |
| **Box Rui  Sc 1475jr3 0** | unknown | 3× | `.Box-rui__sc-1475jr3-0`, `.Position-rui__sc-o54rtt-0`, `.Position__Relative-rui__sc-o54rtt-3` |
| **Box Rui  Sc 1475jr3 0** | unknown | 3× | `.Box-rui__sc-1475jr3-0`, `.Position-rui__sc-o54rtt-0`, `.Position__Absolute-rui__sc-o54rtt-2` |
| **Box Rui  Sc 1475jr3 0** | unknown | 3× | `.Box-rui__sc-1475jr3-0`, `.Position-rui__sc-o54rtt-0`, `.Position__Absolute-rui__sc-o54rtt-2` |
| **Box Rui  Sc 1475jr3 0** | unknown | 3× | `.Box-rui__sc-1475jr3-0`, `.Position-rui__sc-o54rtt-0`, `.Position__Relative-rui__sc-o54rtt-3` |
| **Box Rui  Sc 1475jr3 0** | list-item | 3× | `.Box-rui__sc-1475jr3-0`, `.bYtbZs` |
| **Box Rui  Sc 1475jr3 0** | unknown | 3× | `.Box-rui__sc-1475jr3-0`, `.Position-rui__sc-o54rtt-0`, `.Position__Relative-rui__sc-o54rtt-3` |

## List Items

### Box Rui  Sc 1475jr3 0

**Instances found:** 4

**CSS classes:** `.Box-rui__sc-1475jr3-0` `.dpXLVE`

**HTML structure:**

```html
<li class="Box-rui__sc-1475jr3-0 dpXLVE" style="list-style: none;"><figure class="Box-rui__sc-1475jr3-0 Flex-rui__sc-1tnvnxg-0 Stack-rui__sc-1l68xd2-0 VStack-rui__sc-1o1h7kq-0 kkzcbR kejIvn bpDMRq"><div class="Box-rui__sc-1475jr3-0 AspectRatio__Base-rui__sc-1ogtlhd-2 cNWhKn eQcXqV"><div class="AspectRatio__Content-rui__sc-1ogtlhd-1 dTnZqq"><img alt="#3 most downloaded finance app" src="https://assets.revolut.com/published-assets-v3/baf74063-c481-431d-85a0-9e5743572f28/91d20a70-1a2d-46e1-8f45-ebd7e83196a8.png" class="Box-rui__sc-1475jr3-0 dqBMpu" style="object-fit: contain;"></div><div role="no
```

**Base styles (from design tokens):**

```css
.Box-rui__sc-1475jr3-0 {
  padding: 4px 0;
}```

### Box Rui  Sc 1475jr3 0

**Instances found:** 3

**CSS classes:** `.Box-rui__sc-1475jr3-0` `.bYtbZs`

**HTML structure:**

```html
<li class="Box-rui__sc-1475jr3-0 bYtbZs" style="list-style: none;"><figure class="Box-rui__sc-1475jr3-0 Flex-rui__sc-1tnvnxg-0 Stack-rui__sc-1l68xd2-0 VStack-rui__sc-1o1h7kq-0 kkzcbR kejIvn bpDMRq"><div class="Box-rui__sc-1475jr3-0 AspectRatio__Base-rui__sc-1ogtlhd-2 cNWhKn eQcXqV"><div class="AspectRatio__Content-rui__sc-1ogtlhd-1 dTnZqq"><img alt="Best International Payments Provider 2025" src="https://assets.revolut.com/published-assets-v3/c5c49070-312c-4567-8359-6ffc1624cafa/931fbf11-937a-45d4-9c9d-7078412a8ba9.png" class="Box-rui__sc-1475jr3-0 dqBMpu" style="object-fit: contain;"></div><d
```

**Base styles (from design tokens):**

```css
.Box-rui__sc-1475jr3-0 {
  padding: 4px 0;
}```

## Buttons

### ButtonBase  ButtonStateLayer Rui  Sc 1kvyxgj 0

**Instances found:** 28

**CSS classes:** `.ButtonBase__ButtonStateLayer-rui__sc-1kvyxgj-0` `.dcaAJA`

**HTML structure:**

```html
<span data-rui="state-layer" class="ButtonBase__ButtonStateLayer-rui__sc-1kvyxgj-0 dcaAJA"></span>
```

**Base styles (from design tokens):**

```css
.ButtonBase__ButtonStateLayer-rui__sc-1kvyxgj-0 {
  color: #ffffff;
  border-radius: 24px;
  padding: 4px 8px;
  cursor: pointer;
}```

### Button Rui  Sc 43qi8e 0

**Instances found:** 15

**CSS classes:** `.Button-rui__sc-43qi8e-0` `.ButtonBase-rui__sc-1kvyxgj-2` `.ButtonBase__ButtonBaseWrapper-rui__sc-1kvyxgj-1` `.ButtonLayout__StyledButtonBase-rui__sc-po3gd3-2` `._16881lo8` `._1mojfz40`

**HTML structure:**

```html
<a data-pending="false" class="ButtonBase__ButtonBaseWrapper-rui__sc-1kvyxgj-1 eoTkuX ButtonBase-rui__sc-1kvyxgj-2 ButtonLayout__StyledButtonBase-rui__sc-po3gd3-2 eGcQbb Button-rui__sc-43qi8e-0 hwEpEy _16881lo8 _1mojfz40 _1mojfz41 _1mojfz42 _1mojfz44 _1mojfz46 _1mojfz48 _1mojfz49 _3jquhb3 _3jquhb4" href="/" aria-disabled="false" style="--_3jquhb0: var(--rui-color-white); --_3jquhb1: var(--website-navigation-button-hover-background);"><span data-rui="state-layer" class="ButtonBase__ButtonStateLayer-rui__sc-1kvyxgj-0 dcaAJA"></span><span class="Ellipsis__EllipsisBase-rui__sc-88yoza-0 dLKIrZ">Per
```

**Base styles (from design tokens):**

```css
.Button-rui__sc-43qi8e-0 {
  color: #ffffff;
  border-radius: 24px;
  padding: 4px 8px;
  cursor: pointer;
}```

### Button Rui  Sc 43qi8e 0

**Instances found:** 8

**CSS classes:** `.Button-rui__sc-43qi8e-0` `.ButtonBase-rui__sc-1kvyxgj-2` `.ButtonBase__ButtonBaseWrapper-rui__sc-1kvyxgj-1` `.ButtonLayout__StyledButtonBase-rui__sc-po3gd3-2` `._16881lo8` `._1mojfz40`

**HTML structure:**

```html
<button data-pending="false" class="ButtonBase__ButtonBaseWrapper-rui__sc-1kvyxgj-1 eoTkuX ButtonBase-rui__sc-1kvyxgj-2 ButtonLayout__StyledButtonBase-rui__sc-po3gd3-2 eGcQbb Button-rui__sc-43qi8e-0 hwEpEy _16881lo8 _1mojfz40 _1mojfz41 _1mojfz42 _1mojfz44 _1mojfz46 _1mojfz48 _1mojfz49 _3jquhb3 _3jquhb5" type="button" style="--_3jquhb0: var(--rui-color-white); --_3jquhb1: var(--website-navigation-button-hover-background);"><span data-rui="state-layer" class="ButtonBase__ButtonStateLayer-rui__sc-1kvyxgj-0 dcaAJA"></span><span class="Ellipsis__EllipsisBase-rui__sc-88yoza-0 dLKIrZ"><span class="Bo
```

**Base styles (from design tokens):**

```css
.Button-rui__sc-43qi8e-0 {
  color: #ffffff;
  border-radius: 24px;
  padding: 4px 8px;
  cursor: pointer;
}```

## Badges & Chips

### Box Rui  Sc 1475jr3 0

**Instances found:** 7

**CSS classes:** `.Box-rui__sc-1475jr3-0` `.Text-rui__sc-1mtagir-0` `.ixiagf` `.jUDyLH`

**HTML structure:**

```html
<figcaption class="Box-rui__sc-1475jr3-0 Text-rui__sc-1mtagir-0 ixiagf jUDyLH">#3 most downloaded finance app</figcaption>
```

**Base styles (from design tokens):**

```css
.Box-rui__sc-1475jr3-0 {
  background: #000000;
  border-radius: 24px;
  padding: 2px 4px;
  font-size: 12px;
}```

## Other Components

### Ellipsis  EllipsisBase Rui  Sc 88yoza 0

**Instances found:** 22

**CSS classes:** `.Ellipsis__EllipsisBase-rui__sc-88yoza-0` `.dLKIrZ`

**HTML structure:**

```html
<span class="Ellipsis__EllipsisBase-rui__sc-88yoza-0 dLKIrZ">Personal</span>
```

**Base styles (from design tokens):**

```css
.Ellipsis__EllipsisBase-rui__sc-88yoza-0 {
  background: #000000;
  padding: 4px;
}```

### Box Rui  Sc 1475jr3 0

**Instances found:** 11

**CSS classes:** `.Box-rui__sc-1475jr3-0` `.Position-rui__sc-o54rtt-0` `.Position__Absolute-rui__sc-o54rtt-2` `._1b5jxmm0` `._1b5jxmm1` `.bvLCyt`

**HTML structure:**

```html
<div class="Box-rui__sc-1475jr3-0 Position-rui__sc-o54rtt-0 Position__Absolute-rui__sc-o54rtt-2 dIUuxU bvLCyt dImZqz _1b5jxmm0 _1b5jxmm1"><div class="Box-rui__sc-1475jr3-0 Position-rui__sc-o54rtt-0 Position__Relative-rui__sc-o54rtt-3 SuKVK bvLCyt jauuRS" style="will-change: transform; transform: translateY(0px);"><div class="Box-rui__sc-1475jr3-0 AspectRatio__Base-rui__sc-1ogtlhd-2 kUsMEh eQcXqV"><div class="AspectRatio__Content-rui__sc-1ogtlhd-1 dTnZqq"><picture><source srcset="https://assets.revolut.com/published-assets-v3/ecad5fbe-66ca-48bb-8694-ffe6f33d3ef9/b639119d-f475-48cb-a239-a14eeda2
```

**Base styles (from design tokens):**

```css
.Box-rui__sc-1475jr3-0 {
  background: #000000;
  padding: 4px;
}```

### Box Rui  Sc 1475jr3 0

**Instances found:** 7

**CSS classes:** `.Box-rui__sc-1475jr3-0` `.Flex-rui__sc-1tnvnxg-0` `.Stack-rui__sc-1l68xd2-0` `.VStack-rui__sc-1o1h7kq-0` `.bpDMRq` `.kejIvn`

**HTML structure:**

```html
<figure class="Box-rui__sc-1475jr3-0 Flex-rui__sc-1tnvnxg-0 Stack-rui__sc-1l68xd2-0 VStack-rui__sc-1o1h7kq-0 kkzcbR kejIvn bpDMRq"><div class="Box-rui__sc-1475jr3-0 AspectRatio__Base-rui__sc-1ogtlhd-2 cNWhKn eQcXqV"><div class="AspectRatio__Content-rui__sc-1ogtlhd-1 dTnZqq"><img alt="#3 most downloaded finance app" src="https://assets.revolut.com/published-assets-v3/baf74063-c481-431d-85a0-9e5743572f28/91d20a70-1a2d-46e1-8f45-ebd7e83196a8.png" class="Box-rui__sc-1475jr3-0 dqBMpu" style="object-fit: contain;"></div><div role="none" ratio="2.8875" class="AspectRatio__Spacer-rui__sc-1ogtlhd-0 iHE
```

**Base styles (from design tokens):**

```css
.Box-rui__sc-1475jr3-0 {
  background: #000000;
  padding: 4px;
}```

### AspectRatio  Base Rui  Sc 1ogtlhd 2

**Instances found:** 7

**CSS classes:** `.AspectRatio__Base-rui__sc-1ogtlhd-2` `.Box-rui__sc-1475jr3-0` `.cNWhKn` `.eQcXqV`

**HTML structure:**

```html
<div class="Box-rui__sc-1475jr3-0 AspectRatio__Base-rui__sc-1ogtlhd-2 cNWhKn eQcXqV"><div class="AspectRatio__Content-rui__sc-1ogtlhd-1 dTnZqq"><img alt="#3 most downloaded finance app" src="https://assets.revolut.com/published-assets-v3/baf74063-c481-431d-85a0-9e5743572f28/91d20a70-1a2d-46e1-8f45-ebd7e83196a8.png" class="Box-rui__sc-1475jr3-0 dqBMpu" style="object-fit: contain;"></div><div role="none" ratio="2.8875" class="AspectRatio__Spacer-rui__sc-1ogtlhd-0 iHEczm"></div></div>
```

**Base styles (from design tokens):**

```css
.AspectRatio__Base-rui__sc-1ogtlhd-2 {
  background: #000000;
  padding: 4px;
}```

### AspectRatio  Content Rui  Sc 1ogtlhd 1

**Instances found:** 7

**CSS classes:** `.AspectRatio__Content-rui__sc-1ogtlhd-1` `.dTnZqq`

**HTML structure:**

```html
<div class="AspectRatio__Content-rui__sc-1ogtlhd-1 dTnZqq"><img alt="#3 most downloaded finance app" src="https://assets.revolut.com/published-assets-v3/baf74063-c481-431d-85a0-9e5743572f28/91d20a70-1a2d-46e1-8f45-ebd7e83196a8.png" class="Box-rui__sc-1475jr3-0 dqBMpu" style="object-fit: contain;"></div>
```

**Base styles (from design tokens):**

```css
.AspectRatio__Content-rui__sc-1ogtlhd-1 {
  background: #000000;
  padding: 4px;
}```

### Box Rui  Sc 1475jr3 0

**Instances found:** 7

**CSS classes:** `.Box-rui__sc-1475jr3-0` `.dqBMpu`

**HTML structure:**

```html
<img alt="#3 most downloaded finance app" src="https://assets.revolut.com/published-assets-v3/baf74063-c481-431d-85a0-9e5743572f28/91d20a70-1a2d-46e1-8f45-ebd7e83196a8.png" class="Box-rui__sc-1475jr3-0 dqBMpu" style="object-fit: contain;">
```

**Base styles (from design tokens):**

```css
.Box-rui__sc-1475jr3-0 {
  background: #000000;
  padding: 4px;
}```

### AspectRatio  Spacer Rui  Sc 1ogtlhd 0

**Instances found:** 7

**CSS classes:** `.AspectRatio__Spacer-rui__sc-1ogtlhd-0` `.iHEczm`

**HTML structure:**

```html
<div role="none" ratio="2.8875" class="AspectRatio__Spacer-rui__sc-1ogtlhd-0 iHEczm"></div>
```

**Base styles (from design tokens):**

```css
.AspectRatio__Spacer-rui__sc-1ogtlhd-0 {
  background: #000000;
  padding: 4px;
}```

### 1s42b4a3

**Instances found:** 5

**CSS classes:** `._1s42b4a3`

**HTML structure:**

```html
<img src="https://assets.revolut.com/published-assets-v3/19a77012-2cdb-4d13-aca9-b5dfbd6fc5c4/3e343861-8410-48fc-a6fa-224b4f5e002a.png" srcset="https://assets.revolut.com/published-assets-v3/d6d0bfe6-bc41-44db-8dde-dd3665b3c359/00544e46-b5db-4906-b0ed-87b558057f3f.png 1080w, https://assets.revolut.com/published-assets-v3/d6d0bfe6-bc41-44db-8dde-dd3665b3c359/e306c6b0-8d4e-4b03-ae84-c2e6c4da0904.png 2048w, https://assets.revolut.com/published-assets-v3/d6d0bfe6-bc41-44db-8dde-dd3665b3c359/65411b9a-e95d-4c34-a38e-d3e4fa53fa8d.png 3840w" alt="" loading="lazy" decoding="async" class="_1s42b4a3" sty
```

**Base styles (from design tokens):**

```css
._1s42b4a3 {
  background: #000000;
  padding: 4px;
}```

### Box Rui  Sc 1475jr3 0

**Instances found:** 3

**CSS classes:** `.Box-rui__sc-1475jr3-0` `._3jquhb6` `.dIUuxU`

**HTML structure:**

```html
<div class="Box-rui__sc-1475jr3-0 dIUuxU _3jquhb6"><a data-pending="false" class="ButtonBase__ButtonBaseWrapper-rui__sc-1kvyxgj-1 eoTkuX ButtonBase-rui__sc-1kvyxgj-2 ButtonLayout__StyledButtonBase-rui__sc-po3gd3-2 eGcQbb Button-rui__sc-43qi8e-0 hwEpEy _16881lo8 _1mojfz40 _1mojfz41 _1mojfz42 _1mojfz44 _1mojfz46 _1mojfz48 _1mojfz49 _3jquhb3 _3jquhb4" href="/" aria-disabled="false" style="--_3jquhb0: var(--rui-color-white); --_3jquhb1: var(--website-navigation-button-hover-background);"><span data-rui="state-layer" class="ButtonBase__ButtonStateLayer-rui__sc-1kvyxgj-0 dcaAJA"></span><span class="
```

**Base styles (from design tokens):**

```css
.Box-rui__sc-1475jr3-0 {
  background: #000000;
  padding: 4px;
}```

### Box Rui  Sc 1475jr3 0

**Instances found:** 3

**CSS classes:** `.Box-rui__sc-1475jr3-0` `.Position-rui__sc-o54rtt-0` `.Position__Relative-rui__sc-o54rtt-3` `.bvLCyt` `.eCpgMt` `.jauuRS`

**HTML structure:**

```html
<section id="24b6c305-36ff-4886-aeee-8c47f38a1369" data-blockid="24b6c305-36ff-4886-aeee-8c47f38a1369" class="Box-rui__sc-1475jr3-0 Position-rui__sc-o54rtt-0 Position__Relative-rui__sc-o54rtt-3 eCpgMt bvLCyt jauuRS"><div class="Box-rui__sc-1475jr3-0 Position-rui__sc-o54rtt-0 Position__Absolute-rui__sc-o54rtt-2 kBHHdO hLNKFN dImZqz"><div class="Box-rui__sc-1475jr3-0 Position-rui__sc-o54rtt-0 Position__Relative-rui__sc-o54rtt-3 kYjNIg bvLCyt jauuRS"><div class="Box-rui__sc-1475jr3-0 Position-rui__sc-o54rtt-0 Position__Absolute-rui__sc-o54rtt-2 ievSqM bvLCyt dImZqz k3clxj0"><picture><source srcse
```

**Base styles (from design tokens):**

```css
.Box-rui__sc-1475jr3-0 {
  background: #000000;
  padding: 4px;
}```

### Box Rui  Sc 1475jr3 0

**Instances found:** 3

**CSS classes:** `.Box-rui__sc-1475jr3-0` `.Position-rui__sc-o54rtt-0` `.Position__Absolute-rui__sc-o54rtt-2` `.bvLCyt` `.dImZqz` `.fQmcYA`

**HTML structure:**

```html
<div class="Box-rui__sc-1475jr3-0 Position-rui__sc-o54rtt-0 Position__Absolute-rui__sc-o54rtt-2 fQmcYA bvLCyt dImZqz" style="transition-timing-function: cubic-bezier(0.35, 0, 0, 1); position: absolute; transition-property: transform; bottom: 0px; left: 50%; width: calc(49.6063vh); height: calc(70vh); transform-origin: center bottom; background: var(--rui-color-background); transform: translateX(-50%) scale(1); transition-duration: 0ms; transition-delay: 100ms;"></div>
```

**Base styles (from design tokens):**

```css
.Box-rui__sc-1475jr3-0 {
  background: #000000;
  padding: 4px;
}```

### Box Rui  Sc 1475jr3 0

**Instances found:** 3

**CSS classes:** `.Box-rui__sc-1475jr3-0` `.Position-rui__sc-o54rtt-0` `.Position__Absolute-rui__sc-o54rtt-2` `._1jdrb1u0` `.dIUuxU` `.dImZqz`

**HTML structure:**

```html
<div class="Box-rui__sc-1475jr3-0 Position-rui__sc-o54rtt-0 Position__Absolute-rui__sc-o54rtt-2 dIUuxU hIMVUM dImZqz _1jdrb1u0" style="cursor: auto; transition: transform 350ms, opacity 350ms; z-index: -1; transform: translateX(calc(-1 * var(--website-hero-carousel-gap) * var(--website-hero-carousel-rtl-multiplier, 1))) translateX(calc(var(--website-hero-carousel-left-translate) * var(--website-hero-carousel-rtl-multiplier, 1))) scale(0.9); opacity: 1;"><div class="Box-rui__sc-1475jr3-0 Position-rui__sc-o54rtt-0 Position__Relative-rui__sc-o54rtt-3 eSGthF bvLCyt jauuRS" style="transition-timing
```

**Base styles (from design tokens):**

```css
.Box-rui__sc-1475jr3-0 {
  background: #000000;
  padding: 4px;
}```

### Box Rui  Sc 1475jr3 0

**Instances found:** 3

**CSS classes:** `.Box-rui__sc-1475jr3-0` `.Position-rui__sc-o54rtt-0` `.Position__Relative-rui__sc-o54rtt-3` `.bvLCyt` `.eSGthF` `.jauuRS`

**HTML structure:**

```html
<div class="Box-rui__sc-1475jr3-0 Position-rui__sc-o54rtt-0 Position__Relative-rui__sc-o54rtt-3 eSGthF bvLCyt jauuRS" style="transition-timing-function: cubic-bezier(0.35, 0, 0, 1); transition-property: transform, opacity; transform: translateX(-20%); opacity: 0; transition-duration: 0ms; transition-delay: 100ms;"><picture><source srcset="https://assets.revolut.com/published-assets-v3/d6d0bfe6-bc41-44db-8dde-dd3665b3c359/00544e46-b5db-4906-b0ed-87b558057f3f.png 1080w, https://assets.revolut.com/published-assets-v3/d6d0bfe6-bc41-44db-8dde-dd3665b3c359/e306c6b0-8d4e-4b03-ae84-c2e6c4da0904.png 20
```

**Base styles (from design tokens):**

```css
.Box-rui__sc-1475jr3-0 {
  background: #000000;
  padding: 4px;
}```

### Box Rui  Sc 1475jr3 0

**Instances found:** 3

**CSS classes:** `.Box-rui__sc-1475jr3-0` `.Position-rui__sc-o54rtt-0` `.Position__Relative-rui__sc-o54rtt-3` `.SuKVK` `.bvLCyt` `.jauuRS`

**HTML structure:**

```html
<div class="Box-rui__sc-1475jr3-0 Position-rui__sc-o54rtt-0 Position__Relative-rui__sc-o54rtt-3 SuKVK bvLCyt jauuRS" style="will-change: transform; transform: translateY(0px);"><div class="Box-rui__sc-1475jr3-0 AspectRatio__Base-rui__sc-1ogtlhd-2 kUsMEh eQcXqV"><div class="AspectRatio__Content-rui__sc-1ogtlhd-1 dTnZqq"><picture><source srcset="https://assets.revolut.com/published-assets-v3/ecad5fbe-66ca-48bb-8694-ffe6f33d3ef9/b639119d-f475-48cb-a239-a14eeda2b5e2.png 1080w, https://assets.revolut.com/published-assets-v3/ecad5fbe-66ca-48bb-8694-ffe6f33d3ef9/652bf5bf-c982-4989-809d-c47cdd51204b.p
```

**Base styles (from design tokens):**

```css
.Box-rui__sc-1475jr3-0 {
  background: #000000;
  padding: 4px;
}```

## Component Rules

- Match class names exactly from the patterns above
- Each component instance must be visually identical to others of its type
- Do not add extra wrappers or change the DOM structure

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
transition: box-shadow 0.2s cubic-bezier(0.4, 0.3, 0.8, 0.6);
transition: background-color 0.3s cubic-bezier(0.15, 0.5, 0.5, 1), color 0.3s cubic-bezier(0.15, 0.5, 0.5, 1), opacity 0.3s cubic-bezier(0.15, 0.5, 0.5, 1), box-shadow 0.2s cubic-bezier(0.4, 0.3, 0.8, 0.6), outline 0.2s cubic-bezier(0.4, 0.3, 0.8, 0.6);
transition: all;
transition: color 0.3s cubic-bezier(0.15, 0.5, 0.5, 1), background-color 0.3s cubic-bezier(0.15, 0.5, 0.5, 1);
```

Apply these to all interactive elements. Never invent new durations or easings.

## Button Interactions

### Button 1 — `Close`

**States:**

- Default: `../screens/states/button-1-default.png`
- Hover: `../screens/states/button-1-hover.png`
- Focus: `../screens/states/button-1-focus.png`

**Transition:** `box-shadow 0.2s cubic-bezier(0.4, 0.3, 0.8, 0.6)`

_No visible style changes detected for this element._

### Button 2 — `India`

**States:**

- Default: `../screens/states/button-2-default.png`
- Hover: `../screens/states/button-2-hover.png`
- Focus: `../screens/states/button-2-focus.png`

**Transition:** `box-shadow 0.2s cubic-bezier(0.4, 0.3, 0.8, 0.6)`

_No visible style changes detected for this element._

### Button 3 — `Send`

**States:**

- Default: `../screens/states/button-3-default.png`
- Hover: `../screens/states/button-3-hover.png`
- Focus: `../screens/states/button-3-focus.png`

**Transition:** `background-color 0.3s cubic-bezier(0.15, 0.5, 0.5, 1), color 0.3s cubic-bezier(0.15, 0.5, 0.5, 1), opacity 0.3s cubic-bezier(0.15, 0.5, 0.5, 1), box-shadow 0.2s cubic-bezier(0.4, 0.3, 0.8, 0.6), outline 0.2s cubic-bezier(0.4, 0.3, 0.8, 0.6)`

_No visible style changes detected for this element._

## Link Interactions

### Link 1 — `a`

**States:**

- Default: `../screens/states/link-1-default.png`
- Hover: `../screens/states/link-1-hover.png`
- Focus: `../screens/states/link-1-focus.png`

**Transition:** `all`

_No visible style changes detected for this element._

### Link 2 — `Personal`

**States:**

- Default: `../screens/states/link-2-default.png`
- Hover: `../screens/states/link-2-hover.png`
- Focus: `../screens/states/link-2-focus.png`

**Transition:** `color 0.3s cubic-bezier(0.15, 0.5, 0.5, 1), background-color 0.3s cubic-bezier(0.15, 0.5, 0.5, 1)`

_No visible style changes detected for this element._

### Link 3 — `Business`

**States:**

- Default: `../screens/states/link-3-default.png`
- Hover: `../screens/states/link-3-hover.png`
- Focus: `../screens/states/link-3-focus.png`

**Transition:** `color 0.3s cubic-bezier(0.15, 0.5, 0.5, 1), background-color 0.3s cubic-bezier(0.15, 0.5, 0.5, 1)`

_No visible style changes detected for this element._

## Interaction Rules

- Transition durations in use: `0.2s`, `0.3s`
- Always respect `prefers-reduced-motion` — set all transitions to `0s` when enabled

## Design Tokens — JSON Files

### tokens/colors.json
```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "core": {
    "text-primary": {
      "value": "#ffffff",
      "role": "text-primary"
    },
    "background": {
      "value": "#1f1f1f",
      "role": "background"
    },
    "surface": {
      "value": "#000000",
      "role": "surface"
    },
    "text-muted": {
      "value": "#717173",
      "role": "text-muted"
    }
  },
  "status": {},
  "extended": {
    "color-c9c9cd": {
      "value": "#c9c9cd",
      "role": "unknown"
    },
    "color-6fa0ff": {
      "value": "#6fa0ff",
      "role": "info"
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
      "value": "4px",
      "px": 4
    },
    "sm": {
      "value": "6px",
      "px": 6
    },
    "md": {
      "value": "8px",
      "px": 8
    },
    "lg": {
      "value": "10px",
      "px": 10
    },
    "xl": {
      "value": "12px",
      "px": 12
    },
    "2xl": {
      "value": "16px",
      "px": 16
    },
    "3xl": {
      "value": "18px",
      "px": 18
    },
    "4xl": {
      "value": "20px",
      "px": 20
    },
    "5xl": {
      "value": "24px",
      "px": 24
    },
    "6xl": {
      "value": "32px",
      "px": 32
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
    "min": 4,
    "max": 64
  }
}
```

### tokens/typography.json
```json
{
  "families": [
    "Inter",
    "Aeonik Pro"
  ],
  "scale": {
    "heading-1": {
      "fontFamily": "Inter",
      "fontSize": "48px / 3rem",
      "fontWeight": "700",
      "lineHeight": null,
      "source": "computed"
    },
    "heading-2": {
      "fontFamily": "Inter",
      "fontSize": "32px / 2rem",
      "fontWeight": "600",
      "lineHeight": null,
      "source": "computed"
    },
    "heading-3": {
      "fontFamily": "Inter",
      "fontSize": "24px / 1.5rem",
      "fontWeight": "600",
      "lineHeight": null,
      "source": "computed"
    },
    "body": {
      "fontFamily": "Aeonik Pro",
      "fontSize": "16px / 1rem",
      "fontWeight": "400",
      "lineHeight": null,
      "source": "computed"
    },
    "caption": {
      "fontFamily": "Aeonik Pro",
      "fontSize": "12px / 0.75rem",
      "fontWeight": "400",
      "lineHeight": null,
      "source": "computed"
    }
  },
  "fontFaces": [],
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

- `fonts/Inter-Black.ttf`
- `fonts/Inter-Bold.ttf`
- `fonts/Inter-ExtraBold.ttf`
- `fonts/Inter-ExtraLight.ttf`
- `fonts/Inter-Light.ttf`
- `fonts/Inter-Medium.ttf`
- `fonts/Inter-Regular.ttf`
- `fonts/Inter-SemiBold.ttf`
- `fonts/Inter-Thin.ttf`

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

![bank-account.png](screens/pages/bank-account.png)

![business.png](screens/pages/business.png)

![discover-our-company.png](screens/pages/discover-our-company.png)

![home.png](screens/pages/home.png)

![joint-accounts.png](screens/pages/joint-accounts.png)

### Section Clips (screens/sections/)

*Clipped individual sections and components*

![bank-account-section-1.png](screens/sections/bank-account-section-1.png)

![bank-account-section-2.png](screens/sections/bank-account-section-2.png)

![business-section-1.png](screens/sections/business-section-1.png)

![business-section-2.png](screens/sections/business-section-2.png)

![discover-our-company-section-1.png](screens/sections/discover-our-company-section-1.png)

![discover-our-company-section-2.png](screens/sections/discover-our-company-section-2.png)

![home-section-1.png](screens/sections/home-section-1.png)

![joint-accounts-section-1.png](screens/sections/joint-accounts-section-1.png)

![joint-accounts-section-2.png](screens/sections/joint-accounts-section-2.png)

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
| 17% | 1331px | `screens/scroll/scroll-017.png` |
| 33% | 2583px | `screens/scroll/scroll-033.png` |
| 50% | 3914px | `screens/scroll/scroll-050.png` |
| 67% | 5244px | `screens/scroll/scroll-067.png` |
| 83% | 6496px | `screens/scroll/scroll-083.png` |
| 100% | 7827px | `screens/scroll/scroll-100.png` |

## Pages

| Page | URL | File |
|------|-----|------|
| Banking & Beyond | Revolut United Kingdom | `https://www.revolut.com/` | `screens/pages/home.png` |
| Business Account | Manage Your Finances | Revolut Business | `https://www.revolut.com/business/` | `screens/pages/business.png` |
| About us | Revolut United Kingdom | `https://www.revolut.com/discover-our-company/` | `screens/pages/discover-our-company.png` |
| All-in-one finance app for your money | Revolut United Kingdom | `https://www.revolut.com/bank-account/` | `screens/pages/bank-account.png` |
| Joint accounts | Revolut United Kingdom | `https://www.revolut.com/joint-accounts/` | `screens/pages/joint-accounts.png` |

## Sections

| Page | Section | File |
|------|---------|------|
| home | #1 (section) | `screens/sections/home-section-1.png` |
| business | #1 (section) | `screens/sections/business-section-1.png` |
| business | #2 (section) | `screens/sections/business-section-2.png` |
| discover-our-company | #1 (section) | `screens/sections/discover-our-company-section-1.png` |
| discover-our-company | #2 (section) | `screens/sections/discover-our-company-section-2.png` |
| bank-account | #1 (section) | `screens/sections/bank-account-section-1.png` |
| bank-account | #2 (section) | `screens/sections/bank-account-section-2.png` |
| joint-accounts | #1 (section) | `screens/sections/joint-accounts-section-1.png` |
| joint-accounts | #2 (section) | `screens/sections/joint-accounts-section-2.png` |

## Homepage Screenshots (screenshots/)

![homepage.png](screenshots/homepage.png)

