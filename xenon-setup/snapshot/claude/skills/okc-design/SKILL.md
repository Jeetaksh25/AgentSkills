---
name: okc-design
description: Design system skill for okc. Activate when building UI components, pages, or any visual elements. Provides exact color tokens, typography scale, spacing grid, component patterns, and craft rules. Read references/DESIGN.md before writing any CSS or JSX. Includes ultra-mode visual journey: read references/ANIMATIONS.md, references/LAYOUT.md, references/COMPONENTS.md, and references/INTERACTIONS.md for full motion and layout details.
---

# okc Design System

You are building UI for **okc**. Light-themed, warm palette, sans-serif typography (Arial), compact density on a 4px grid, expressive motion.

## Visual Reference

**IMPORTANT**: Study ALL screenshots below before writing any UI. Match colors, typography, spacing, layout, and motion exactly as shown.

### Homepage

![okc Homepage](screenshots/homepage.png)

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

- **Web Animations API (4 active)** — animation

## Design Philosophy

- **Layered depth** — use shadow tokens to create a sense of physical layering. Each elevation level has a specific shadow.
- **Gradient accents** — gradients are used thoughtfully for emphasis, not decoration.
- **Type pairing** — Arial for body/UI text, Involve for headings/display. Never introduce a third typeface.
- **compact density** — 4px base grid. Every dimension is a multiple of 4.
- **warm palette** — the color temperature runs warm, matching the sans-serif typography.
- **Restrained accent** — `#f07077` is the only pop of color. Used exclusively for CTAs, links, focus rings, and active states.
- **Expressive motion** — animations are an integral part of the experience. Use spring physics and layout animations.

## Color System

### Core Palette

| Role | Token | Hex | Use |
|------|-------|-----|-----|
| Background | `--background` | `#ffffff` | Page/app background |
| Surface | `--surface` | `#f5c2c9` | Cards, panels, modals |
| Text Primary | `--text-primary` | `#2d2d2d` | Headings, body text |
| Text Muted | `--text-muted` | `#808080` | Captions, placeholders |
| Accent | `--accent` | `#f07077` | CTAs, links, focus rings |
| Border | `--border` | `#222222` | Dividers, card borders |

### Extended Palette

- `#0000ee`
- **swiper-preloader-color:** `#000000` — Deep background layer or shadow color
- `#111111` — Deep background layer or shadow color
- `#d8d8d8`
- **about-manifest-muted:** `#383838` — Secondary text, placeholder text

### CSS Variable Tokens

```css
--text-muted: rgb(128,128,128);
--accent: #f07077;
--type-title-card-size: clamp(22px,2.6vw,2.3rem);
--type-title-card-line: 1.2;
--type-title-card-weight: 500;
--text-muted: rgb(180,180,180);
--accent: #f07077;
--parallax-base-primary: 0px;
--parallax-base-secondary: 0px;
--parallax-y-primary: 0px;
--parallax-y-secondary: 0px;
--parallax-y-primary: 0px;
--parallax-y-secondary: 0px;
--reviews-muted: var(--text-muted);
--reviews-accent: var(--accent);
--about-manifest-muted: #383838;
--request-muted-soft: rgba(255,255,255,0.42);
--text-muted: rgb(128,128,128);
--accent: #f07077;
--type-title-card-size: clamp(22px,2.6vw,2.3rem);
```

## Typography

### Font Stack

- **Arial** — Heading 1, Heading 2, Heading 3
- **Involve** — Body, Caption

### Font Sources

```css
@font-face {
  font-family: "Involve";
  src: url("fonts/Involve-Regular.woff2") format("woff2");
  font-weight: 400;
}
```

### Type Scale

| Role | Family | Size | Weight |
|------|--------|------|--------|
| Heading 1 | Arial | min(18.75vw,240px) | 700 |
| Heading 2 | Arial | min(10.8vw,156px) | 700 |
| Heading 3 | Arial | clamp(3.3rem,10vw,10rem) | 700 |
| Body | Involve | 16px | 400 |
| Caption | Involve | clamp(1.1rem,2vw,1.5rem) | 400 |

### Typography Rules

- Body/UI: **Arial**, Headings: **Involve** — these are the only display fonts
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

Scale: `400px, clamp(300px,22vw,400px), 2px, 4px, 6px, 8px, 10px, 16px, 20px, 30px, 999px, clamp(18px,1.5vw,24px), inherit, clamp(18px,5.5vw,40px)`
Default: `16px`

### Container

Max-width: `990px`, centered with auto margins.

### Breakpoints

| Name | Value |
|------|-------|
| xs | 375px |
| xs | 380px |
| xs | 419.98px |
| xs | 480px |
| sm | 499px |
| sm | 590px |
| sm | 640px |
| md | 699px |
| md | 700px |
| md | 720px |
| md | 767px |
| md | 768px |
| lg | 769px |
| lg | 900px |
| lg | 990px |
| lg | 991px |
| lg | 1023px |
| lg | 1024px |
| xl | 1025px |
| xl | 1100px |
| xl | 1101px |
| xl | 1149px |
| xl | 1200px |
| xl | 1280px |
| 2xl | 1390px |
| 2xl | 2000px |
| 2xl | 2001px |

Mobile-first: design for small screens, layer on responsive overrides.

## Component Patterns

### Card

```css
.card {
  background: #f5c2c9;
  border: 1px solid #222222;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 0 0 2px var(--accent);
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
  background: #f07077;
  color: #2d2d2d;
  border-radius: 16px;
  padding: 8px 16px;
  font-weight: 500;
  transition: opacity 150ms ease;
}
.btn-primary:hover { opacity: 0.9; }

/* Ghost */
.btn-ghost {
  background: transparent;
  border: 1px solid #222222;
  color: #2d2d2d;
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
  background: #ffffff;
  border: 1px solid #222222;
  border-radius: 16px;
  padding: 8px 12px;
  color: #2d2d2d;
  font-size: 14px;
}
.input:focus { border-color: #f07077; outline: none; }
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
  background: #f5c2c9;
  color: #808080;
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
  background: #f5c2c9;
  border: 1px solid #222222;
  border-radius: clamp(18px,5.5vw,40px);
  padding: 24px;
  max-width: 480px;
  width: 90vw;
  box-shadow: 0 5px 10px rgba(0,0,0,0.1);
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
  color: #808080;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #222222;
}
.table td {
  padding: 12px;
  border-bottom: 1px solid #222222;
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
  border-bottom: 1px solid #222222;
}
.nav-link {
  color: #808080;
  padding: 8px 12px;
  border-radius: 16px;
  transition: color 150ms;
}
.nav-link:hover { color: #2d2d2d; }
.nav-link.active { color: #f07077; }
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
- Variants: `-interactive`

## Page Structure

The following page sections were detected:

- **Navigation** — Top navigation bar (8 items)
- **Hero** — Hero/banner section with headline and CTAs
- **Faq** — FAQ/accordion section
- **Footer** — Page footer with links and info (5 items)
- **Cta** — Call-to-action section
- **Cards** — Grid of 3 card elements (3 items)
- **Testimonials** — Testimonials/reviews section

When building pages, follow this section order and structure.

## Animation & Motion

This project uses **expressive motion**. Animations are part of the design language.

### CSS Animations

- `shineAccentText`
- `slide-close`
- `slide-open`
- `heroMottoLastLoop`
- `heroMottoSuffixLoop`

### Motion Tokens

- **Duration scale:** `0ms`, `1s`, `2s`, `120ms`, `150ms`, `200ms`, `250ms`, `260ms`, `280ms`, `300ms`, `320ms`, `380ms`, `400ms`, `420ms`, `460ms`, `500ms`, `520ms`, `560ms`, `600ms`, `620ms`, `650ms`, `700ms`, `800ms`, `900ms`, `1000ms`, `1200ms`, `1600ms`, `2000ms`, `4000ms`
- **Easing functions:** `ease`, `ease-out`, `linear`, `cubic-bezier(0.72,0.16,0.345,0.875)`, `cubic-bezier(0.74,0.07,0.34,0.96)`, `cubic-bezier(0.39,0.575,0.565,1)`, `cubic-bezier(0.16,1,0.3,1)`
- **Animated properties:** `top`, `transform`, `opacity`

### Motion Guidelines

- **Duration:** Use values from the duration scale above. Short (0ms) for micro-interactions, long (4000ms) for page transitions
- **Easing:** Use `ease` as the default easing curve
- **Direction:** Elements enter from bottom/right, exit to top/left
- **Reduced motion:** Always respect `prefers-reduced-motion` — disable animations when set

## Depth & Elevation

### Shadow Tokens

- Subtle: `0 0 0 2px var(--accent)`
- Floating (dropdowns, popovers): `0 5px 10px rgba(0,0,0,0.1)`
- Floating (dropdowns, popovers): `rgba(0, 0, 0, 0.1) 0px 5px 10px 0px`
- Overlay (modals, dialogs): `0px 10px 100px rgba(0,0,0,0.17)`
- Overlay (modals, dialogs): `30px 5px 50px rgba(0,0,0,0.12)`
- Overlay (modals, dialogs): `0px 20px 50px rgba(0,0,0,0.1)`

### Z-Index Scale

`0, 1, 2, 3, 6, 7, 8, 10, 35, 40, 50, 90, 1000, 1001, 1002, 1200, 2000, 9999, 99999`

Use these exact values — never invent z-index values.

## Anti-Patterns (Never Do)

- **No blur effects** — no backdrop-blur, no filter: blur()
- **No zebra striping** — tables and lists use borders for separation
- **No invented colors** — every hex value must come from the palette above
- **No arbitrary spacing** — every dimension is a multiple of 4px
- **No extra fonts** — only Arial and Involve are allowed
- **No arbitrary border-radius** — use the scale: 400px, 2px, 4px, 6px, 8px, 10px, 16px, 20px, 30px, 999px
- **No opacity for disabled states** — use muted colors instead

## Workflow

1. **Read** `references/DESIGN.md` before writing any UI code
2. **Pick colors** from the Color System section — never invent new ones
3. **Set typography** — Arial, Involve only, using the type scale
4. **Build layout** on the 4px grid — check every margin, padding, gap
5. **Match components** to patterns above before creating new ones
6. **Apply elevation** — use shadow tokens
7. **Validate** — every value traces back to a design token. No magic numbers.

## Brand Spec

- **Favicon:** `/favicon.svg`
- **Site URL:** `https://okc.media/`
- **Brand color:** `#f07077`
- **Brand typeface:** Arial

## Quick Reference

```
Background:     #ffffff
Surface:        #f5c2c9
Text:           #2d2d2d / #808080
Accent:         #f07077
Border:         #222222
Font:           Arial
Spacing:        4px grid
Radius:         16px
Components:     9 detected
```

## When to Trigger

Activate this skill when:
- Creating new components, pages, or visual elements for okc
- Writing CSS, Tailwind classes, styled-components, or inline styles
- Building page layouts, templates, or responsive designs
- Reviewing UI code for design consistency
- The user mentions "okc" design, style, UI, or theme
- Generating mockups, wireframes, or visual prototypes

---

# Full Reference Files

> Every output file is embedded below. Claude has full design system context from /skills alone.

## Design System Tokens (DESIGN.md)

# okc DESIGN.md

> Auto-generated design system — reverse-engineered via static analysis by skillui.
> Frameworks: None detected
> Colors: 14 · Fonts: 2 · Components: 9
> Icon library: not detected · State: not detected
> Primary theme: light · Dark mode toggle: no · Motion: expressive

## Visual Reference

**Match this design exactly** — study colors, fonts, spacing, and component shapes before writing any UI code.

![okc Homepage](../screenshots/homepage.png)

---

## 1. Visual Theme & Atmosphere

This is a **light-themed** interface with a warm, approachable feel. The light background emphasizes content clarity. Typography pairs **Involve** for display/headings with **Arial** for body text, creating clear visual hierarchy through type contrast. Spacing follows a **4px base grid** (compact density), with scale: 2, 4, 6, 8, 10, 12, 14, 16px. The palette is predominantly monochromatic with **#f07077** as the single accent color — used sparingly for interactive elements and emphasis. Motion is expressive — spring physics, layout animations, and staggered reveals are part of the visual language.

---

## 2. Color Palette & Roles

| Token | Hex | Role | Use |
|---|---|---|---|
| theme-color | `#ffffff` | background | Page background, darkest surface |
| surface | `#f5c2c9` | surface | Card and panel backgrounds |
| text | `#2d2d2d` | text-primary | Headings and body text |
| text-muted | `#808080` | text-muted | Captions, placeholders, secondary info |
| text-muted | `#b4b4b4` | text-muted | Captions, placeholders, secondary info |
| text-muted | `#555555` | text-muted | Captions, placeholders, secondary info |
| border | `#222222` | border | Dividers, card borders, outlines |
| accent | `#f07077` | accent | CTAs, links, focus rings, active states |
| swiper-theme-color | `#007aff` | accent | CTAs, links, focus rings, active states |
| info | `#0000ee` | info | Informational highlights |
| swiper-preloader-color | `#000000` | unknown | Palette color |
| unknown | `#111111` | unknown | Palette color |
| unknown | `#d8d8d8` | unknown | Palette color |
| about-manifest-muted | `#383838` | unknown | Palette color |

### CSS Variable Tokens

```css
--text-muted: rgb(128,128,128);
--accent: #f07077;
--type-title-card-size: clamp(22px,2.6vw,2.3rem);
--type-title-card-line: 1.2;
--type-title-card-weight: 500;
--text-muted: rgb(180,180,180);
--accent: #f07077;
--parallax-base-primary: 0px;
--parallax-base-secondary: 0px;
--parallax-y-primary: 0px;
--parallax-y-secondary: 0px;
--parallax-y-primary: 0px;
--parallax-y-secondary: 0px;
--reviews-muted: var(--text-muted);
--reviews-accent: var(--accent);
--about-manifest-muted: #383838;
--request-muted-soft: rgba(255,255,255,0.42);
--text-muted: rgb(128,128,128);
--accent: #f07077;
--type-title-card-size: clamp(22px,2.6vw,2.3rem);
```


---

## 3. Typography Rules

**Font Stack:**
- **Arial** — Heading 1, Heading 2, Heading 3
- **Involve** — Body, Caption

**Font Sources:**

```css
@font-face {
  font-family: "Involve";
  src: url("fonts/Involve-Regular.woff2") format("woff2");
  font-weight: 400;
}
```

| Role | Font | Size | Weight |
|---|---|---|---|
| Heading 1 | Arial | min(18.75vw,240px) | 700 |
| Heading 2 | Arial | min(10.8vw,156px) | 700 |
| Heading 3 | Arial | clamp(3.3rem,10vw,10rem) | 700 |
| Body | Involve | 16px | 400 |
| Caption | Involve | clamp(1.1rem,2vw,1.5rem) | 400 |

**Typographic Rules:**
- Limit to 2 font families max per screen
- Use **Arial** for body/UI text, **Involve** for display/headings
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
- Variants: `-interactive`

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
- **Border radius:** 400px, clamp(300px,22vw,400px), 2px, 4px, 6px, 8px, 10px, 16px, 20px, 30px, 999px, clamp(18px,1.5vw,24px), inherit, clamp(18px,5.5vw,40px)
- **Max content width:** 990px

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

- `0 0 0 2px var(--accent)`

### Floating — dropdowns, popovers, modals

- `0 5px 10px rgba(0,0,0,0.1)`
- `rgba(0, 0, 0, 0.1) 0px 5px 10px 0px`

### Overlay — full-screen overlays, top-level dialogs

- `0px 10px 100px rgba(0,0,0,0.17)`
- `30px 5px 50px rgba(0,0,0,0.12)`
- `0px 20px 50px rgba(0,0,0,0.1)`

### Z-Index Scale

`0, 1, 2, 3, 6, 7, 8, 10, 35, 40, 50, 90, 1000, 1001, 1002, 1200, 2000, 9999, 99999`



---

## 7. Animation & Motion

This project uses **expressive motion**. Animations are an integral part of the experience.

### CSS Animations

- `@keyframes shineAccentText`
- `@keyframes slide-close`
- `@keyframes slide-open`
- `@keyframes heroMottoLastLoop`
- `@keyframes heroMottoSuffixLoop`
- `@keyframes thirdAnim`
- `@keyframes firstAnim`
- `@keyframes dot1Anim`

### Animated Components

- **Button**: 

### Motion Guidelines

- Duration: 150-300ms for micro-interactions, 300-500ms for page transitions
- Easing: `ease-out` for enters, `ease-in` for exits
- Always respect `prefers-reduced-motion`


---

## 8. Do's and Don'ts

### Do's

- Use `#f07077` for interactive elements (buttons, links, focus rings)
- Use `#ffffff` as the primary page background
- Pair **Arial** (body) with **Involve** (display) — these are the only allowed fonts
- Follow the **4px** spacing grid for all margins, padding, and gaps
- Use the defined shadow tokens for elevation — see Section 6
- Use border-radius from the scale: 400px, clamp(300px,22vw,400px), 2px, 4px, 6px
- Reuse existing components from Section 4 before creating new ones

### Don'ts

- Don't introduce colors outside this palette — extend the design tokens first
- Don't introduce additional font families beyond Arial and Involve
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
| xs | 375px | css |
| xs | 380px | css |
| xs | 419.98px | css |
| xs | 480px | css |
| sm | 499px | css |
| sm | 590px | css |
| sm | 640px | css |
| md | 699px | css |
| md | 700px | css |
| md | 720px | css |
| md | 767px | css |
| md | 768px | css |
| lg | 769px | css |
| lg | 900px | css |
| lg | 990px | css |
| lg | 991px | css |
| lg | 1023px | css |
| lg | 1024px | css |
| xl | 1025px | css |
| xl | 1100px | css |
| xl | 1101px | css |
| xl | 1149px | css |
| xl | 1200px | css |
| xl | 1280px | css |
| 2xl | 1390px | css |
| 2xl | 2000px | css |
| 2xl | 2001px | css |

**Approach:** Use `@media (min-width: ...)` queries matching the breakpoints above.


---

## 10. Agent Prompt Guide

Use these as starting points when building new UI:

### Build a Card

```
Background: #f5c2c9
Border: 1px solid #222222
Radius: 16px
Padding: 16px
Font: Arial
Use shadow tokens from Section 6.
```

### Build a Button

```
Primary: bg #f07077, text white
Ghost: bg transparent, border #222222
Padding: 8px 16px
Radius: 16px
Hover: opacity 0.9 or lighter shade
Focus: ring with #f07077
```

### Build a Page Layout

```
Background: #ffffff
Max-width: 990px, centered
Grid: 4px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface: #f5c2c9
Label: #808080 (muted, 12px, uppercase)
Value: #2d2d2d (primary, 24-32px, bold)
Status: use success/warning/danger from Section 2
```

### Build a Form

```
Input bg: #ffffff
Input border: 1px solid #222222
Focus: border-color #f07077
Label: #808080 12px
Spacing: 16px between fields
Radius: 16px
```

### General Component

```
1. Read DESIGN.md Sections 2-6 for tokens
2. Colors: only from palette
3. Font: Arial, type scale from Section 3
4. Spacing: 4px grid
5. Components: match patterns from Section 4
6. Elevation: shadow tokens
```

## Visual Guide — Screenshots (VISUAL_GUIDE.md)

# okc — Visual Guide

> Master visual reference. Study every screenshot carefully before implementing any UI.
> Match colors, layout, typography, spacing, and motion states exactly.

**Motion Stack:** **Web Animations API (4 active)**

## Scroll Journey

The page has cinematic scroll animations. Each screenshot below shows the exact visual state at that scroll depth.
**Replicate these transitions precisely** — the design changes dramatically as you scroll.

### Hero — Above the fold

*Scroll position: 0px of 11721px total*

![Hero — Above the fold](../screens/scroll/scroll-000.png)

### 17% scroll depth

*Scroll position: 1840px of 11721px total*

![17% scroll depth](../screens/scroll/scroll-017.png)

### 33% scroll depth

*Scroll position: 3571px of 11721px total*

![33% scroll depth](../screens/scroll/scroll-033.png)

### 50% scroll depth

*Scroll position: 5411px of 11721px total*

![50% scroll depth](../screens/scroll/scroll-050.png)

### 67% scroll depth

*Scroll position: 7250px of 11721px total*

![67% scroll depth](../screens/scroll/scroll-067.png)

### 83% scroll depth

*Scroll position: 8981px of 11721px total*

![83% scroll depth](../screens/scroll/scroll-083.png)

### Footer — End of page

*Scroll position: 10821px of 11721px total*

![Footer — End of page](../screens/scroll/scroll-100.png)

## Full Page Screenshots

### OKC Media — создаём сайты, интернет-магазины и цифровые продукты

*URL: `https://okc.media/`*

![OKC Media — создаём сайты, интернет-магазины и цифровые продукты](../screens/pages/home.png)

### Кейсы OKC Media - eCommerce, сайты и брендинг

*URL: `https://okc.media/ru/casestudies/`*

![Кейсы OKC Media - eCommerce, сайты и брендинг](../screens/pages/ru-casestudies.png)

### Журнал OKC Media - eCommerce, UX и брендинг

*URL: `https://okc.media/ru/journal/`*

![Журнал OKC Media - eCommerce, UX и брендинг](../screens/pages/ru-journal.png)

### Наследие — знаковые проекты OKC Media с 2001 года

*URL: `https://okc.media/ru/heritage/`*

![Наследие — знаковые проекты OKC Media с 2001 года](../screens/pages/ru-heritage.png)

### OKC Media - цифровые продукты и брендинг

*URL: `https://okc.media/ru/about/`*

![OKC Media - цифровые продукты и брендинг](../screens/pages/ru-about.png)

## Section Screenshots

Clipped sections showing individual components in context.

### Section 1 — `section`

*1440×828px*

![Section 1](../screens/sections/home-section-1.png)

### Section 2 — `section`

*1210×1200px*

![Section 2](../screens/sections/home-section-2.png)

### Section 1 — `section`

*1440×1200px*

![Section 1](../screens/sections/ru-casestudies-section-1.png)

### Section 1 — `section`

*1440×1200px*

![Section 1](../screens/sections/ru-journal-section-1.png)

### Section 3 — `article`

*1005×303px*

![Section 3](../screens/sections/ru-journal-section-3.png)

### Section 1 — `section`

*1440×1200px*

![Section 1](../screens/sections/ru-heritage-section-1.png)

### Section 1 — `section`

*1440×1200px*

![Section 1](../screens/sections/ru-about-section-1.png)

## Animations & Motion (ANIMATIONS.md)

# Animation Reference

> Cinematic motion design extracted from live DOM. Follow these specs exactly to recreate the experience.

## Motion Technology Stack

| Library | Type | Notes |
|---------|------|-------|
| **Web Animations API (4 active)** | animation |  |
| Canvas (1 elements) | 2D Canvas | 2D canvas rendering |

## Scroll Journey

The page is **11,721px** tall. Each frame below shows what the user sees at that scroll depth.

> **Use these screenshots to understand WHAT animates, WHEN it animates, and HOW it moves.**

### 0% — Top / Hero
Scroll position: 0px

![Scroll 0%](../screens/scroll/scroll-000.png)

### 17% — Opening Section
Scroll position: 1,840px

![Scroll 17%](../screens/scroll/scroll-017.png)

### 33% — First Feature Section
Scroll position: 3,571px

![Scroll 33%](../screens/scroll/scroll-033.png)

### 50% — Mid-Page
Scroll position: 5,411px

![Scroll 50%](../screens/scroll/scroll-050.png)

### 67% — Lower Content
Scroll position: 7,250px

![Scroll 67%](../screens/scroll/scroll-067.png)

### 83% — Near Footer
Scroll position: 8,981px

![Scroll 83%](../screens/scroll/scroll-083.png)

### 100% — Bottom / Footer
Scroll position: 10,821px

![Scroll 100%](../screens/scroll/scroll-100.png)

## Video Elements

| # | Role | Autoplay | Loop | Muted | Size | First Frame |
|---|------|----------|------|-------|------|-------------|
| 1 | content | ✓ | ✓ | ✓ | 595×446 | — |
| 2 | content | ✓ | ✓ | ✓ | 595×446 | — |

- **Source:** `/content/media/video/get/360.mp4`
- **Poster:** `https://okc.media/cache/960/video/get/360.webp`
- **Source:** `/content/media/video/popcorn/popcorn-cover.mp4`
- **Poster:** `https://okc.media/cache/960/video/popcorn/popcorn-thumb.webp`

## CSS Keyframes (12 extracted)

### `@keyframes firstAnim`

Duration: `350ms` · Easing: `cubic-bezier(0.39, 0.6, 0.3, 0.94)` · Delay: `0ms` · Iteration: `1` · Fill: `none`

Used by: `.okc_logo:hover .okc_first, .okc_logo.is-hoverfx .okc_first`, `.okc_logo:hover .okc_second, .okc_logo.is-hoverfx .okc_second`, `.okc_logo:hover .okc_dot2, .okc_logo.is-hoverfx .okc_dot2`

```css
@keyframes firstAnim {
  0%, 100% {
    transform: translate(0px, 0px) scale(1);
  }
  50% {
    transform: translate(-3px, -3px) scale(1.1);
  }
}
```

> Transform/motion animation

### `@keyframes slide-close`

Duration: `0.6s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.slide-close`

```css
@keyframes slide-close {
  0% {
    width: 0px;
    left: 0px;
  }
  100% {
    width: 100%;
    left: 0px;
  }
}
```

> Dimension expand/collapse

### `@keyframes slide-open`

Duration: `0.6s` · Easing: `ease` · Delay: `0s` · Iteration: `1` · Fill: `forwards`

Used by: `.slide-open`

```css
@keyframes slide-open {
  0% {
    width: 100%;
    left: 0px;
  }
  100% {
    width: 0px;
    left: 100%;
  }
}
```

> Dimension expand/collapse

### `@keyframes thirdAnim`

Duration: `350ms` · Easing: `cubic-bezier(0.39, 0.6, 0.3, 0.94)` · Delay: `150ms` · Iteration: `1` · Fill: `none`

Used by: `.okc_logo:hover .okc_third, .okc_logo.is-hoverfx .okc_third`

```css
@keyframes thirdAnim {
  0%, 100% {
    transform: translate(0px, 0px) scale(1);
  }
  50% {
    transform: translate(-2px, -2px) scale(1.07);
  }
}
```

> Transform/motion animation

### `@keyframes dot1Anim`

Duration: `350ms` · Easing: `cubic-bezier(0.39, 0.6, 0.3, 0.94)` · Delay: `50ms` · Iteration: `1` · Fill: `none`

Used by: `.okc_logo:hover .okc_dot1, .okc_logo.is-hoverfx .okc_dot1`

```css
@keyframes dot1Anim {
  0%, 100% {
    transform: translate(0px, 0px) scale(1);
  }
  50% {
    transform: translate(-3px, -3px) scale(1.11);
  }
}
```

> Transform/motion animation

### `@keyframes dot3Anim`

Duration: `350ms` · Easing: `cubic-bezier(0.39, 0.6, 0.3, 0.94)` · Delay: `170ms` · Iteration: `1` · Fill: `none`

Used by: `.okc_logo:hover .okc_dot3, .okc_logo.is-hoverfx .okc_dot3`

```css
@keyframes dot3Anim {
  0%, 100% {
    transform: translate(0px, 0px) scale(1);
  }
  50% {
    transform: translate(-4px, -4px) scale(1.11);
  }
}
```

> Transform/motion animation

### `@keyframes shineAccentText`

```css
@keyframes shineAccentText {
  0% {
    background-position-x: 100%;
    background-position-y: 50%;
  }
  33.333% {
    background-position-x: 0%;
    background-position-y: 50%;
  }
  100% {
    background-position-x: 0%;
    background-position-y: 50%;
  }
}
```

> Background color/gradient shift · Background position (shimmer/scroll)

### `@keyframes heroMottoLastLoop`

```css
@keyframes heroMottoLastLoop {
  0% {
    opacity: 0;
    transform: translateX(-20px);
    filter: blur(10px);
    color: var(--accent);
  }
  10% {
    opacity: 1;
    transform: translateX(0px);
    filter: blur(0px);
    color: var(--accent);
  }
  60% {
    opacity: 1;
    transform: translateX(0px);
    filter: blur(0px);
    color: var(--accent);
  }
  70%, 100% {
    opacity: 0;
    transform: translateX(20px);
    filter: blur(10px);
    color: var(--accent);
  }
}
```

> Fade + motion enter animation · Filter effect (blur/brightness)

### `@keyframes heroMottoSuffixLoop`

```css
@keyframes heroMottoSuffixLoop {
  0% {
    opacity: 0;
    transform: translateX(-20px);
    filter: blur(10px);
    color: var(--accent);
  }
  8% {
    opacity: 1;
    transform: translateX(0px);
    filter: blur(0px);
    color: var(--accent);
  }
  48% {
    opacity: 1;
    transform: translateX(0px);
    filter: blur(0px);
    color: var(--accent);
  }
  58%, 100% {
    opacity: 0;
    transform: translateX(20px);
    filter: blur(10px);
    color: var(--accent);
  }
}
```

> Fade + motion enter animation · Filter effect (blur/brightness)

### `@keyframes swiper-preloader-spin`

```css
@keyframes swiper-preloader-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(1turn);
  }
}
```

> Transform/motion animation

### `@keyframes journal-post-toc-fade`

```css
@keyframes journal-post-toc-fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
```

> Opacity fade

### `@keyframes about-video-fade`

```css
@keyframes about-video-fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.3;
  }
}
```

> Opacity fade

## Motion Tokens (CSS Variables)

### Duration Tokens

```css
--duration: 360ms;
```

### Easing Tokens

```css
--ease: cubic-bezier(0.2, 0.7, 0.2, 1);
```

### Delay Tokens

```css
--intro-menu-delay: 1800ms;
--reveal-delay: 0ms;
```

### Animation Tokens

```css
--animation-step: 100ms;
```

## Global Transition Declarations

These `transition` values were extracted from CSS rules across the site:

```css
transition: top 280ms var(--ease),
    transform 280ms var(--ease),
    opacity 2000ms var(--ease);
transition: opacity 0.4s;
transition: 0.65s;
transition: opacity 1s;
transition: opacity 2s;
transition: opacity 420ms var(--ease);
transition: opacity 0.7s 0.6s;
transition: transform 0.5s;
transition: transform 0.25s, opacity 0.25s;
transition: transform var(--duration) var(--ease),
    opacity var(--duration) var(--ease);
transition: opacity var(--duration) var(--ease);
transition: opacity 0.15s linear;
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
  transition: opacity 360ms cubic-bezier(0.2, 0.7, 0.2, 1),
              transform 360ms cubic-bezier(0.2, 0.7, 0.2, 1);
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Step 3 — Key Motion Principles

- **Canvas elements (1)** — animated via requestAnimationFrame loop. Use canvas for particle effects, gradient animations, and WebGL scenes
- **Duration scale:** `360ms` · `280ms` · `2000ms` · `0.4s` · `0.65s` — use these values, never invent new durations
- **Always add** `@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`

### Step 4 — Scroll Journey Reference

Match what happens at each scroll position:

- **0%** (`0px`) → `screens/scroll/scroll-000.png`
- **17%** (`1840px`) → `screens/scroll/scroll-017.png`
- **33%** (`3571px`) → `screens/scroll/scroll-033.png`
- **50%** (`5411px`) → `screens/scroll/scroll-050.png`
- **67%** (`7250px`) → `screens/scroll/scroll-067.png`
- **83%** (`8981px`) → `screens/scroll/scroll-083.png`
- **100%** (`10821px`) → `screens/scroll/scroll-100.png`

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
| `section.cookie-consent.cookie-consent--visible` | row | — | center | 16px | 2 |
| `div.container.journal-highlights__more-wrap` | row | center | — | — | 1 |
| `a.journal-highlights-card__link` | column | space-between | — | — | 2 |
| `a.journal-highlights-card__link` | column | space-between | — | — | 2 |
| `a.journal-highlights-card__link` | column | space-between | — | — | 2 |

## Grid Layouts

| Element | Template Columns | Gap | Children |
|---------|-----------------|-----|----------|
| `header.top-bar` | `462.578px 399.641px 462.594px` | — | 4 |
| `div.container.grid` | `287.406px 287.406px 287.406px 287.406px` | 20px | 4 |
| `div.container.grid` | `287.406px 287.406px 287.406px 287.406px` | 20px | 2 |
| `div.container.grid` | `287.406px 287.406px 287.406px 287.406px` | 20px | 2 |
| `div.container.grid` | `287.406px 287.406px 287.406px 287.406px` | 20px | 12 |
| `div.container.grid` | `287.406px 287.406px 287.406px 287.406px` | 20px | 2 |
| `div.container.grid` | `287.406px 287.406px 287.406px 287.406px` | 20px | 2 |
| `div.container.grid12` | `82.4688px 82.4688px 82.4688px 82.4688px 82.4688px ` | 20px | 3 |
| `div.container.grid12` | `82.4688px 82.4688px 82.4688px 82.4688px 82.4688px ` | 80px 20px | 2 |
| `div.cases-grid` | `82.4688px 82.4688px 82.4688px 82.4688px 82.4688px ` | 200px 20px | 9 |

## Structural Containers

### `<header>` (`header.top-bar`)

```
display:          grid
grid-template-columns: 462.578px 399.641px 462.594px
padding:          20px 0px 0px
max-width:        2000px
children:         4
```

### `<main>` (`main#main`)

```
display:          block
children:         1
```

### `<footer>` (`footer.site-footer`)

```
display:          block
padding:          100px 0px
children:         2
```

### `<section>` (`section.cookie-consent.cookie-consent--visible`)

```
display:          flex
flex-direction:   row
justify-content:  —
align-items:      center
gap:              16px
padding:          16px 16px 16px 20px
children:         2
```

### `<section>` (`section.hero80`)

```
display:          block
children:         1
```

### `<section>` (`section.container.cases`)

```
display:          block
padding:          0px 0px 40px
max-width:        1740px
children:         2
```

### `<section>` (`section#expertise.section.expertise`)

```
display:          block
children:         1
```

### `<section>` (`section#clients.section.clients`)

```
display:          block
children:         2
```

### `<section>` (`section#awards.section.awards`)

```
display:          block
children:         1
```

### `<section>` (`section#lab.section.journal-highlights`)

```
display:          block
children:         3
```

### `<section>` (`section.contacts-cta`)

```
display:          block
padding:          172.8px 0px 115.2px
children:         1
```

### `<article>` (`article.case`)

```
display:          block
children:         1
```

## Layout Rules

- **Container max-width:** `2000px` — always center with `margin: auto`
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
| **Char** | unknown | 16× | `.char` |
| **Reveal** | unknown | 12× | `.reveal`, `.reveal--init` |
| **Word** | unknown | 10× | `.word` |
| **Case** | unknown | 9× | `.case` |
| **Case  Link** | unknown | 9× | `.case__link` |
| **Case Caption** | unknown | 9× | `.case-caption`, `.reveal`, `.reveal--init` |
| **Case Title** | unknown | 9× | `.case-title` |
| **Case Title  Name** | unknown | 9× | `.case-title__name` |
| **Case Title  Desc** | unknown | 9× | `.case-title__desc` |
| **Case  Media** | unknown | 7× | `.case__media`, `.reveal`, `.reveal--init` |
| **Case  Thumb** | unknown | 7× | `.case__thumb` |
| **Shine** | unknown | 5× | `.shine` |
| **Accordion  Item** | card | 5× | `.accordion__item`, `.reveal`, `.reveal--init` |
| **Accordion  Content** | unknown | 5× | `.accordion__content` |
| **Accordion  Description** | unknown | 5× | `.accordion__description` |
| **Accordion  Tags** | badge | 5× | `.accordion__tags` |
| **Accordion  Summary** | unknown | 4× | `.accordion__summary` |
| **Container** | unknown | 3× | `.container`, `.grid` |
| **Journal Highlights Card** | card | 3× | `.journal-highlights-card`, `.reveal`, `.reveal--init` |
| **Journal Highlights Card  Link** | card | 3× | `.journal-highlights-card__link` |

## Cards

### Accordion  Item

**Instances found:** 5

**CSS classes:** `.accordion__item` `.reveal` `.reveal--init`

**HTML structure:**

```html
<details class="accordion__item reveal reveal--init" style="--reveal-delay: 0ms;" data-reveal-init="1"> <summary id="exp-sum-1" class="accordion__summary" data-cursor="more" data-cursor-text="подробнее"> Магазины с <span class="accent-gradient">большим</span> ассортиментом </summary> <div class="accordion__panel" role="region" aria-labelledby="exp-sum-1" style="height: 0px;"> <div class="accordion__content"> <div class="accordion__description"> Проектируем магазины, г…</div> <ul class="accordion__tags" aria-label="Технологии"> <li>Bitrix</li> <li>1C</li> <li>Фреймворки</li> <li>API</li> <li>He
```

**Base styles (from design tokens):**

```css
.accordion__item {
  background: #f5c2c9;
  border: 1px solid #222222;
  border-radius: 16px;
  padding: 8px;
}```

### Journal Highlights Card

**Instances found:** 3

**CSS classes:** `.journal-highlights-card` `.reveal` `.reveal--init`

**HTML structure:**

```html
<article class="reveal journal-highlights-card reveal--init" data-col="4" role="listitem" style="--reveal-delay: 0ms;" data-reveal-init="1"> <a class="journal-highlights-card__link" href="/ru/journal/lab/kak-nezryachie-vidyat-sayty/" data-cursor="more" data-cursor-text="читать"> <span class="journal-highlights__dot journal-highlights-card__dot" aria-hidden="true"></span> <h3 class="journal-highlights-card__title">Как незрячие «видят» сайты: разговор о д…</h3> </a> </article>
```

**Base styles (from design tokens):**

```css
.journal-highlights-card {
  background: #f5c2c9;
  border: 1px solid #222222;
  border-radius: 16px;
  padding: 8px;
}```

### Journal Highlights Card  Link

**Instances found:** 3

**CSS classes:** `.journal-highlights-card__link`

**HTML structure:**

```html
<a class="journal-highlights-card__link" href="/ru/journal/lab/kak-nezryachie-vidyat-sayty/" data-cursor="more" data-cursor-text="читать"> <span class="journal-highlights__dot journal-highlights-card__dot" aria-hidden="true"></span> <h3 class="journal-highlights-card__title">Как незрячие «видят» сайты: разговор о д…</h3> </a>
```

**Base styles (from design tokens):**

```css
.journal-highlights-card__link {
  background: #f5c2c9;
  border: 1px solid #222222;
  border-radius: 16px;
  padding: 8px;
}```

## Badges & Chips

### Accordion  Tags

**Instances found:** 5

**CSS classes:** `.accordion__tags`

**HTML structure:**

```html
<ul class="accordion__tags" aria-label="Технологии"> <li>Bitrix</li> <li>1C</li> <li>Фреймворки</li> <li>API</li> <li>Headless</li> <li>PIM-подход</li> <li>AI-инструменты</li> </ul>
```

**Base styles (from design tokens):**

```css
.accordion__tags {
  background: #f5c2c9;
  border: 1px solid #222222;
  border-radius: 16px;
  padding: 2px 4px;
  font-size: 12px;
}```

## Other Components

### Char

**Instances found:** 16

**CSS classes:** `.char`

**HTML structure:**

```html
<span class="char" style="--i: 0;">С</span>
```

**Base styles (from design tokens):**

```css
.char {
  background: #f5c2c9;
  padding: 4px;
}```

### Reveal

**Instances found:** 12

**CSS classes:** `.reveal` `.reveal--init`

**HTML structure:**

```html
<div class="reveal reveal--init" data-col="1" role="listitem" style="--reveal-delay: 0ms;" data-reveal-init="1"> <img src="/assets/i/clients/ariston.svg" alt="Ariston" loading="lazy" decoding="async" aria-hidden="true"> </div>
```

**Base styles (from design tokens):**

```css
.reveal {
  background: #f5c2c9;
  padding: 4px;
}```

### Word

**Instances found:** 10

**CSS classes:** `.word`

**HTML structure:**

```html
<span class="word" style="--i: 0;">Создаём</span>
```

**Base styles (from design tokens):**

```css
.word {
  background: #f5c2c9;
  padding: 4px;
}```

### Case

**Instances found:** 9

**CSS classes:** `.case`

**HTML structure:**

```html
<article class="case" data-case-item="" data-case-tags="[&quot;веб&quot;]" data-tags="[&quot;веб&quot;]" data-variant="half-left"> <a href="/ru/casestudies/specialview/" class="case__link" data-cursor="more" data-cursor-text="открыть проект" data-thumb-init="true"> <figure class="case__media reveal reveal--init" aria-hidden="true" style="--reveal-delay: 0ms;" data-reveal-init="1"> <img class="case__thumb is-ready" src="/cache/960/projectPics/specialview/cover-color.webp" srcset="/cache/960/projectPics/specialview/cover-color.webp 960w, /cache/1920/projectPics/specialview/cover-color.webp 1920w
```

**Base styles (from design tokens):**

```css
.case {
  background: #f5c2c9;
  padding: 4px;
}```

### Case  Link

**Instances found:** 9

**CSS classes:** `.case__link`

**HTML structure:**

```html
<a href="/ru/casestudies/specialview/" class="case__link" data-cursor="more" data-cursor-text="открыть проект" data-thumb-init="true"> <figure class="case__media reveal reveal--init" aria-hidden="true" style="--reveal-delay: 0ms;" data-reveal-init="1"> <img class="case__thumb is-ready" src="/cache/960/projectPics/specialview/cover-color.webp" srcset="/cache/960/projectPics/specialview/cover-color.webp 960w, /cache/1920/projectPics/specialview/cover-color.webp 1920w" sizes="(max-width: 375px) 92vw, (max-width: 767px) 88vw, (max-width: 990px) calc(44vw - 10px), (max-width: 1023px) calc(42vw - 10
```

**Base styles (from design tokens):**

```css
.case__link {
  background: #f5c2c9;
  padding: 4px;
}```

### Case Caption

**Instances found:** 9

**CSS classes:** `.case-caption` `.reveal` `.reveal--init`

**HTML structure:**

```html
<div class="case-caption reveal reveal--init" style="--reveal-y: 40px; --reveal-opacity: 2s; --reveal-move: 2.4s; --reveal-delay: 0ms;" data-reveal-init="1"> <div class="case-title"> <span class="case-title__name" role="heading" aria-level="3">Особый взгляд</span> <span class="case-title__desc">медиа для незрячих людей, созданное по с…</span> </div> <ul class="case-tags" aria-label="Особый взгляд"> <li>медиа</li> <li>WCAG/ГОСТ</li> <li>редакторские инструменты</li> <li>Bitrix</li> </ul> </div>
```

**Base styles (from design tokens):**

```css
.case-caption {
  background: #f5c2c9;
  padding: 4px;
}```

### Case Title

**Instances found:** 9

**CSS classes:** `.case-title`

**HTML structure:**

```html
<div class="case-title"> <span class="case-title__name" role="heading" aria-level="3">Особый взгляд</span> <span class="case-title__desc">медиа для незрячих людей, созданное по с…</span> </div>
```

**Base styles (from design tokens):**

```css
.case-title {
  background: #f5c2c9;
  padding: 4px;
}```

### Case Title  Name

**Instances found:** 9

**CSS classes:** `.case-title__name`

**HTML structure:**

```html
<span class="case-title__name" role="heading" aria-level="3">Особый взгляд</span>
```

**Base styles (from design tokens):**

```css
.case-title__name {
  background: #f5c2c9;
  padding: 4px;
}```

### Case Title  Desc

**Instances found:** 9

**CSS classes:** `.case-title__desc`

**HTML structure:**

```html
<span class="case-title__desc">медиа для незрячих людей, созданное по стандартам цифровой доступности</span>
```

**Base styles (from design tokens):**

```css
.case-title__desc {
  background: #f5c2c9;
  padding: 4px;
}```

### Case  Media

**Instances found:** 7

**CSS classes:** `.case__media` `.reveal` `.reveal--init`

**HTML structure:**

```html
<figure class="case__media reveal reveal--init" aria-hidden="true" style="--reveal-delay: 0ms;" data-reveal-init="1"> <img class="case__thumb is-ready" src="/cache/960/projectPics/specialview/cover-color.webp" srcset="/cache/960/projectPics/specialview/cover-color.webp 960w, /cache/1920/projectPics/specialview/cover-color.webp 1920w" sizes="(max-width: 375px) 92vw, (max-width: 767px) 88vw, (max-width: 990px) calc(44vw - 10px), (max-width: 1023px) calc(42vw - 10px), (max-width: 2000px) calc(42vw - 10px), 860px" data-full="/cache/1920/projectPics/specialview/cover-color.webp" data-full-2x="/cach
```

**Base styles (from design tokens):**

```css
.case__media {
  background: #f5c2c9;
  padding: 4px;
}```

### Case  Thumb

**Instances found:** 7

**CSS classes:** `.case__thumb`

**HTML structure:**

```html
<img class="case__thumb is-ready" src="/cache/960/projectPics/specialview/cover-color.webp" srcset="/cache/960/projectPics/specialview/cover-color.webp 960w, /cache/1920/projectPics/specialview/cover-color.webp 1920w" sizes="(max-width: 375px) 92vw, (max-width: 767px) 88vw, (max-width: 990px) calc(44vw - 10px), (max-width: 1023px) calc(42vw - 10px), (max-width: 2000px) calc(42vw - 10px), 860px" data-full="/cache/1920/projectPics/specialview/cover-color.webp" data-full-2x="/cache/3840/projectPics/specialview/cover-color.webp" alt="Особый взгляд" loading="lazy" data-case-thumb-image-fade-init="1
```

**Base styles (from design tokens):**

```css
.case__thumb {
  background: #f5c2c9;
  padding: 4px;
}```

### Shine

**Instances found:** 5

**CSS classes:** `.shine`

**HTML structure:**

```html
<a class="shine " href="/ru/casestudies/">кейсы</a>
```

**Base styles (from design tokens):**

```css
.shine {
  background: #f5c2c9;
  padding: 4px;
}```

### Accordion  Content

**Instances found:** 5

**CSS classes:** `.accordion__content`

**HTML structure:**

```html
<div class="accordion__content"> <div class="accordion__description"> Проектируем магазины, г…</div> <ul class="accordion__tags" aria-label="Технологии"> <li>Bitrix</li> <li>1C</li> <li>Фреймворки</li> <li>API</li> <li>Headless</li> <li>PIM-подход</li> <li>AI-инструменты</li> </ul> </div>
```

**Base styles (from design tokens):**

```css
.accordion__content {
  background: #f5c2c9;
  padding: 4px;
}```

### Accordion  Description

**Instances found:** 5

**CSS classes:** `.accordion__description`

**HTML structure:**

```html
<div class="accordion__description"> Проектируем магазины, где много товаров, свойств, цен, остатков и сценариев выбора. Помогаем навести порядок в каталоге, фильтрах, поиске и карточках товаров, чтобы покупатель быстрее находил нужное, а команда могла управлять ассортиментом без хаоса. </div>
```

**Base styles (from design tokens):**

```css
.accordion__description {
  background: #f5c2c9;
  padding: 4px;
}```

### Accordion  Summary

**Instances found:** 4

**CSS classes:** `.accordion__summary`

**HTML structure:**

```html
<summary id="exp-sum-2" class="accordion__summary" data-cursor="more" data-cursor-text="подробнее"> Монобрендовые магазины </summary>
```

**Base styles (from design tokens):**

```css
.accordion__summary {
  background: #f5c2c9;
  padding: 4px;
}```

### Container

**Instances found:** 3

**CSS classes:** `.container` `.grid`

**HTML structure:**

```html
<div class="container grid"> <div data-col="1"> <div class="pin-placeholder" style="width: 100%; height: 0px; pointer-events: none;"></div><div class="pin-wrap" data-pin="" data-pin-scope="expertise"> <h2 id="expertise-title" class="section-title reveal reveal--init" style="--reveal-opacity: 2s; --reveal-delay: 0ms;" data-reveal-init="1"> экспертиза </h2> </div> </div> <div data-col="3"> <div class="accordion expertise-accordion" role="group" aria-label="Направления экспертизы" data-accordion-init="1"> <details class="accordion__item reveal reveal--init" style="--reveal-delay: 0ms;" data-revea
```

**Base styles (from design tokens):**

```css
.container {
  background: #f5c2c9;
  padding: 4px;
}```

## Component Rules

- Match class names exactly from the patterns above
- Each component instance must be visually identical to others of its type
- Do not add extra wrappers or change the DOM structure
- Use `#222222` for all dividers within components
- Use `#f07077` for all interactive/active states

## Interactions & States (INTERACTIONS.md)

# Interaction Reference

> Micro-interactions extracted from live DOM. Recreate these exactly for authentic feel.

## Coverage

| Component Type | Count | States Captured |
|----------------|-------|----------------|
| Button | 1 | default, hover, focus |
| Link | 3 | default, hover, focus |

## Transition System

These transition declarations were extracted from interactive elements:

```css
transition: background-color 0.36s cubic-bezier(0.2, 0.7, 0.2, 1), color 0.36s cubic-bezier(0.2, 0.7, 0.2, 1), transform 0.36s cubic-bezier(0.2, 0.7, 0.2, 1);
transition: opacity 1s cubic-bezier(0.2, 0.7, 0.2, 1) 1.825s, transform 1s cubic-bezier(0.2, 0.7, 0.2, 1) 1.825s, filter 1s cubic-bezier(0.2, 0.7, 0.2, 1) 1.825s;
transition: opacity 1s cubic-bezier(0.2, 0.7, 0.2, 1) 1.85s, transform 1s cubic-bezier(0.2, 0.7, 0.2, 1) 1.85s, filter 1s cubic-bezier(0.2, 0.7, 0.2, 1) 1.85s;
transition: opacity 1s cubic-bezier(0.2, 0.7, 0.2, 1) 1.875s, transform 1s cubic-bezier(0.2, 0.7, 0.2, 1) 1.875s, filter 1s cubic-bezier(0.2, 0.7, 0.2, 1) 1.875s;
```

Apply these to all interactive elements. Never invent new durations or easings.

## Button Interactions

### Button 1 — `хорошо`

**States:**

- Default: `../screens/states/button-1-default.png`
- Hover: `../screens/states/button-1-hover.png`
- Focus: `../screens/states/button-1-focus.png`

**On hover:**

```css
/* background-color: rgb(255, 255, 255) → */ background-color: rgb(240, 112, 119);
/* color: rgb(34, 34, 34) → */ color: rgb(255, 255, 255);
/* border-color: rgb(34, 34, 34) → */ border-color: rgb(255, 255, 255);
/* outline: rgb(34, 34, 34) none 3px → */ outline: rgb(255, 255, 255) none 3px;
/* outline-color: rgb(34, 34, 34) → */ outline-color: rgb(255, 255, 255);
```

**On focus:**

```css
/* outline: rgb(34, 34, 34) none 3px → */ outline: rgba(255, 255, 255, 0.85) solid 2px;
/* outline-color: rgb(34, 34, 34) → */ outline-color: rgba(255, 255, 255, 0.85);
```

**Transition:** `background-color 0.36s cubic-bezier(0.2, 0.7, 0.2, 1), color 0.36s cubic-bezier(0.2, 0.7, 0.2, 1), transform 0.36s cubic-bezier(0.2, 0.7, 0.2, 1)`

## Link Interactions

### Link 1 — `кейсы`

**States:**

- Default: `../screens/states/link-1-default.png`
- Hover: `../screens/states/link-1-hover.png`
- Focus: `../screens/states/link-1-focus.png`

**On hover:**

```css
/* color: rgb(255, 255, 255) → */ color: rgb(240, 112, 119);
/* border-color: rgb(255, 255, 255) → */ border-color: rgb(240, 112, 119);
/* outline: rgb(255, 255, 255) none 3px → */ outline: rgb(240, 112, 119) none 3px;
/* outline-color: rgb(255, 255, 255) → */ outline-color: rgb(240, 112, 119);
```

**On focus:**

```css
/* outline: rgb(255, 255, 255) none 3px → */ outline: rgba(255, 255, 255, 0.85) solid 2px;
/* outline-color: rgb(255, 255, 255) → */ outline-color: rgba(255, 255, 255, 0.85);
```

**Transition:** `opacity 1s cubic-bezier(0.2, 0.7, 0.2, 1) 1.825s, transform 1s cubic-bezier(0.2, 0.7, 0.2, 1) 1.825s, filter 1s cubic-bezier(0.2, 0.7, 0.2, 1) 1.825s`

### Link 2 — `журнал`

**States:**

- Default: `../screens/states/link-2-default.png`
- Hover: `../screens/states/link-2-hover.png`
- Focus: `../screens/states/link-2-focus.png`

**On hover:**

```css
/* color: rgb(255, 255, 255) → */ color: rgb(240, 112, 119);
/* border-color: rgb(255, 255, 255) → */ border-color: rgb(240, 112, 119);
/* outline: rgb(255, 255, 255) none 3px → */ outline: rgb(240, 112, 119) none 3px;
/* outline-color: rgb(255, 255, 255) → */ outline-color: rgb(240, 112, 119);
```

**On focus:**

```css
/* outline: rgb(255, 255, 255) none 3px → */ outline: rgba(255, 255, 255, 0.85) solid 2px;
/* outline-color: rgb(255, 255, 255) → */ outline-color: rgba(255, 255, 255, 0.85);
```

**Transition:** `opacity 1s cubic-bezier(0.2, 0.7, 0.2, 1) 1.85s, transform 1s cubic-bezier(0.2, 0.7, 0.2, 1) 1.85s, filter 1s cubic-bezier(0.2, 0.7, 0.2, 1) 1.85s`

### Link 3 — `история`

**States:**

- Default: `../screens/states/link-3-default.png`
- Hover: `../screens/states/link-3-hover.png`
- Focus: `../screens/states/link-3-focus.png`

**On hover:**

```css
/* color: rgb(255, 255, 255) → */ color: rgb(240, 112, 119);
/* border-color: rgb(255, 255, 255) → */ border-color: rgb(240, 112, 119);
/* outline: rgb(255, 255, 255) none 3px → */ outline: rgb(240, 112, 119) none 3px;
/* outline-color: rgb(255, 255, 255) → */ outline-color: rgb(240, 112, 119);
```

**On focus:**

```css
/* outline: rgb(255, 255, 255) none 3px → */ outline: rgba(255, 255, 255, 0.85) solid 2px;
/* outline-color: rgb(255, 255, 255) → */ outline-color: rgba(255, 255, 255, 0.85);
```

**Transition:** `opacity 1s cubic-bezier(0.2, 0.7, 0.2, 1) 1.875s, transform 1s cubic-bezier(0.2, 0.7, 0.2, 1) 1.875s, filter 1s cubic-bezier(0.2, 0.7, 0.2, 1) 1.875s`

## Interaction Rules

- Accent color `#f07077` is used for focus rings, active states, and hover highlights
- Hover effects include **color transitions** — use the extracted values, not approximations
- Focus states use **outline** (not box-shadow) — always match the extracted focus ring
- Transition durations in use: `0.36s`, `1s`, `1.825s`, `1.85s`, `1.875s`
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
      "name": "theme-color"
    },
    "text-muted": {
      "value": "#555555",
      "role": "text-muted"
    },
    "accent": {
      "value": "#007aff",
      "role": "accent",
      "name": "swiper-theme-color"
    },
    "text-primary": {
      "value": "#2d2d2d",
      "role": "text-primary",
      "name": "text"
    },
    "border": {
      "value": "#222222",
      "role": "border"
    },
    "surface": {
      "value": "#f5c2c9",
      "role": "surface"
    }
  },
  "status": {},
  "extended": {
    "color-0000ee": {
      "value": "#0000ee",
      "role": "info"
    },
    "swiper-preloader-color": {
      "value": "#000000",
      "role": "unknown",
      "name": "swiper-preloader-color"
    },
    "color-111111": {
      "value": "#111111",
      "role": "unknown"
    },
    "color-d8d8d8": {
      "value": "#d8d8d8",
      "role": "unknown"
    },
    "about-manifest-muted": {
      "value": "#383838",
      "role": "unknown",
      "name": "about-manifest-muted"
    }
  },
  "meta": {
    "theme": "light",
    "extracted": "2026-09-30"
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
    "Arial",
    "Involve"
  ],
  "scale": {
    "heading-1": {
      "fontFamily": "Arial",
      "fontSize": "min(18.75vw,240px)",
      "fontWeight": "700",
      "lineHeight": null,
      "source": "css"
    },
    "heading-2": {
      "fontFamily": "Arial",
      "fontSize": "min(10.8vw,156px)",
      "fontWeight": "700",
      "lineHeight": null,
      "source": "css"
    },
    "heading-3": {
      "fontFamily": "Arial",
      "fontSize": "clamp(3.3rem,10vw,10rem)",
      "fontWeight": "700",
      "lineHeight": null,
      "source": "css"
    },
    "body": {
      "fontFamily": "Involve",
      "fontSize": "16px",
      "fontWeight": "400",
      "lineHeight": null,
      "source": "css"
    },
    "caption": {
      "fontFamily": "Involve",
      "fontSize": "clamp(1.1rem,2vw,1.5rem)",
      "fontWeight": "400",
      "lineHeight": null,
      "source": "css"
    }
  },
  "fontFaces": [
    {
      "family": "Involve",
      "src": "https://okc.media/assets/fonts/Involve-Regular.woff2",
      "format": "woff2",
      "weight": "400"
    },
    {
      "family": "Involve",
      "src": "https://okc.media/assets/fonts/Involve-Regular.woff",
      "format": "woff",
      "weight": "400"
    },
    {
      "family": "Involve",
      "src": "https://okc.media/assets/fonts/Involve-Medium.woff2",
      "format": "woff2",
      "weight": "500"
    },
    {
      "family": "Involve",
      "src": "https://okc.media/assets/fonts/Involve-Medium.woff",
      "format": "woff",
      "weight": "500"
    },
    {
      "family": "Involve",
      "src": "https://okc.media/assets/fonts/Involve-SemiBold.woff2",
      "format": "woff2",
      "weight": "600"
    },
    {
      "family": "Involve",
      "src": "https://okc.media/assets/fonts/Involve-SemiBold.woff",
      "format": "woff",
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

- `fonts/Involve-500.woff`
- `fonts/Involve-500.woff2`
- `fonts/Involve-600.woff`
- `fonts/Involve-600.woff2`
- `fonts/Involve-Regular.woff`
- `fonts/Involve-Regular.woff2`

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

![home.png](screens/pages/home.png)

![ru-about.png](screens/pages/ru-about.png)

![ru-casestudies.png](screens/pages/ru-casestudies.png)

![ru-heritage.png](screens/pages/ru-heritage.png)

![ru-journal.png](screens/pages/ru-journal.png)

### Section Clips (screens/sections/)

*Clipped individual sections and components*

![home-section-1.png](screens/sections/home-section-1.png)

![home-section-2.png](screens/sections/home-section-2.png)

![ru-about-section-1.png](screens/sections/ru-about-section-1.png)

![ru-casestudies-section-1.png](screens/sections/ru-casestudies-section-1.png)

![ru-heritage-section-1.png](screens/sections/ru-heritage-section-1.png)

![ru-journal-section-1.png](screens/sections/ru-journal-section-1.png)

![ru-journal-section-3.png](screens/sections/ru-journal-section-3.png)

### Interaction States (screens/states/)

*Hover, focus, and active state captures*

![button-1-default.png](screens/states/button-1-default.png)

![button-1-focus.png](screens/states/button-1-focus.png)

![button-1-hover.png](screens/states/button-1-hover.png)

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
| 17% | 1840px | `screens/scroll/scroll-017.png` |
| 33% | 3571px | `screens/scroll/scroll-033.png` |
| 50% | 5411px | `screens/scroll/scroll-050.png` |
| 67% | 7250px | `screens/scroll/scroll-067.png` |
| 83% | 8981px | `screens/scroll/scroll-083.png` |
| 100% | 10821px | `screens/scroll/scroll-100.png` |

## Pages

| Page | URL | File |
|------|-----|------|
| OKC Media — создаём сайты, интернет-магазины и цифровые продукты | `https://okc.media/` | `screens/pages/home.png` |
| Кейсы OKC Media - eCommerce, сайты и брендинг | `https://okc.media/ru/casestudies/` | `screens/pages/ru-casestudies.png` |
| Журнал OKC Media - eCommerce, UX и брендинг | `https://okc.media/ru/journal/` | `screens/pages/ru-journal.png` |
| Наследие — знаковые проекты OKC Media с 2001 года | `https://okc.media/ru/heritage/` | `screens/pages/ru-heritage.png` |
| OKC Media - цифровые продукты и брендинг | `https://okc.media/ru/about/` | `screens/pages/ru-about.png` |

## Sections

| Page | Section | File |
|------|---------|------|
| home | #1 (section) | `screens/sections/home-section-1.png` |
| home | #2 (section) | `screens/sections/home-section-2.png` |
| ru-casestudies | #1 (section) | `screens/sections/ru-casestudies-section-1.png` |
| ru-journal | #1 (section) | `screens/sections/ru-journal-section-1.png` |
| ru-journal | #3 (article) | `screens/sections/ru-journal-section-3.png` |
| ru-heritage | #1 (section) | `screens/sections/ru-heritage-section-1.png` |
| ru-about | #1 (section) | `screens/sections/ru-about-section-1.png` |

## Homepage Screenshots (screenshots/)

![homepage.png](screenshots/homepage.png)

