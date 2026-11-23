---
disable-model-invocation: true
name: design-inspiration-index
description: Scout design language across 55+ award galleries, app-screenshot libraries, and component/motion references before generating UI — pick the right sources per brief, extract concrete tokens instead of vibes, and synthesize (never copy one site).
---

# design-inspiration-index: Scout Before You Generate

> **Premise:** AI-generated UI defaults to a recognizable slop aesthetic (purple mesh hero, three equal feature cards, Inter + slate-900, glassmorphism on everything) because the model has no reference for *what good looks like right now*. This skill fixes that by forcing a short, structured scouting pass across curated inspiration sources **before** any code is written. The output of scouting is a small set of concrete tokens (type, color, spacing, motion, composition) — not a moodboard of feelings.

This is the companion to `design-taste-frontend` (which governs *how* to build). Use this one to decide *what language to build in*.

---

## 0. When to invoke

Invoke this skill **before generating UI** when any of these hold:

- The brief is open-ended on aesthetic ("make it look good", "modern", "premium", "Awwwards-y", "Linear-style").
- You're about to default to a known slop pattern and want a better reference.
- The user named a vibe word, brand, or competitor without giving concrete references.
- You're redesigning and need to read the *current* visual language of the competitive set.

**Do not invoke** when the brief already pins a documented design system (Material, Polaris, Carbon, GDS, Geist, an in-repo token set) — go straight to that system's tokens instead. Scouting adds nothing when the answer is already canonical.

**Do not invoke** for pure data tables, internal tools with an existing component library, or anything where the visual language is fixed by the platform. Scouting is for *finding* a language, not applying a known one.

---

## 1. The scouting workflow (5 steps, ~10 minutes)

### Step 1 — State the design read (one line)
Before opening any site, declare: *"Reading this as: \<page kind> for \<audience>, with a \<vibe> language, leaning toward \<reference family>."*
Examples:
- *"Reading this as: B2B SaaS landing for technical buyers, with a Linear-style minimalist language, leaning toward Geist/recent.design."*
- *"Reading this as: iOS onboarding flow for a fintech, leaning toward Mobbin/Page Flows."*
- *"Reading this as: editorial portfolio for a creative studio, leaning toward SiteInspire/Httpster."*

This line picks your categories (next step). If you can't write it, ask **one** clarifying question — never a multi-question dump.

### Step 2 — Pick 2–3 source categories, not 10 sites
Use the routing table in [`references/sites-catalog.md`](./references/sites-catalog.md). For a SaaS landing, that's *landing galleries* + *real-product screenshots* (so you balance concept vs. shipped). For mobile product UI, that's *app-screenshot galleries* + *one design-system doc* (for tokens). Do **not** browse all categories — that produces moodboard fatigue, not decisions.

### Step 3 — Scout with extraction prompts, not browsing
For each chosen source, run a specific extraction question (Section 3). You are not "looking for inspiration" — you are mining for tokens. Spend ~3 minutes per source; if a source yields nothing in 3 minutes, drop it.

### Step 4 — Capture tokens, not screenshots
Record a short token sheet (Section 4): type pairing, palette, spacing scale, radius, motion timing/easing, and 2–3 composition moves. This sheet is what you hand to the build step. Screenshots are allowed but the *tokens* are the deliverable.

### Step 5 — Synthesize, never copy
Combine tokens from 2–3 sources into one coherent language. If your final design is visibly traceable to a single site, you copied, you didn't synthesize. The test: a designer familiar with your references should not be able to point at one and say "this is that site."

---

## 2. The source categories (condensed — full catalog in references/)

| Category | What it answers | Lead sources |
|---|---|---|
| **Award galleries** | "What does award-judged good look like right now?" (spectacle-leaning) | Awwwards, CSS Design Awards, FWA |
| **Landing galleries** | "How do marketing/landing pages compose heroes, pricing, CTAs?" | recent.design (ex-Godly), Curated.design, Landingfolio, One Page Love, SiteInspire, Httpster |
| **App-screenshot galleries** | "How do *shipped* products actually solve this screen/flow?" | Mobbin, Page Flows, Screenlane, Pttrns |
| **Component libraries (coded)** | "What are the real, accessible primitives I should assemble from?" | shadcn/ui, Tailwind UI, Mantine, Geist |
| **Motion galleries** | "What timing/easing/choreography makes interactions feel right?" | UI Motion (decoded+code), Codrops, UIMovement, Framer examples |
| **Design-system docs** | "What are the canonical tokens when a real system applies?" | Material 3, Apple HIG, Polaris, Carbon, GDS, USWDS |
| **Type & color** | "What pairing/palette escapes the default?" | Typewolf, Fonts In Use, Realtime Colors, Happy Hues |

The exhaustive 55+ list with URLs, current status, and per-site extraction notes lives in [`references/sites-catalog.md`](./references/sites-catalog.md). Always prefer that file over recalling a URL from memory — sites move (e.g. **Godly → recent.design**), and several are marked with caveats (BestWebsite.gallery SOTDs stalled Nov 2024; Dribbble/Aceternity overuse risks).

---

## 3. What to extract from each category (the extraction prompts)

These are the questions to hold in mind while scouting. Tokens, not vibes.

### Award & landing galleries
- **Type:** What are the two typefaces (display + body)? Serif or sans display? What weight/size ratio between hero H1 and body? Is there a mono accent?
- **Color:** How many hues? Is there a single accent against near-monochrome, or a rich palette? Background tone (warm vs. cool gray)? How is dark mode handled?
- **Composition:** Hero layout (left-aligned text vs. centered vs. asymmetric)? Section rhythm (alternating, full-bleed, sticky)? Where does social proof sit? How dense is the nav?
- **Motion:** Is scroll-driven choreography used? Hero entrance animation? Hover micro-interactions? How aggressive (Linear-subtle vs. Awwwards-cinematic)?
- **Tech:** What stack does the site advertise (GSAP, Lenis, Three.js, Framer, Webflow)? Match it to your build constraints.

### App-screenshot galleries (real product)
- **Density:** Real apps pack more than Dribbble shots. Note the actual information density — rows, metadata, action placement.
- **Navigation:** Tab bar vs. drawer vs. segmented? Where do primary actions live? How is state (selected/loading/error/empty) shown?
- **Empty/loading/error states:** Capture these explicitly — galleries hide them, but they're the make-or-break of product UI. Use Mobbin/Page Flows filters to find them.
- **Touch targets & spacing:** Real iOS/Android spacing — don't import web scales into mobile.
- **Dark mode:** If the app ships dark mode, note how it treats elevated surfaces, not just the background.

### Component libraries (coded)
- **Spacing scale:** Note the actual scale (Tailwind's 4/8/12/16/24/32/48/64… or a custom 4px base). Steal the scale, don't invent one.
- **Radius system:** Is there a consistent radius (e.g. all `rounded-lg`) or a deliberate ramp (chips small, cards medium, sheets large)?
- **State coverage:** Does the component define hover/focus/active/disabled/loading/error? A real library does; a concept shot doesn't.
- **Accessibility:** Focus rings, ARIA, keyboard nav. shadcn/Radix and Mantine are the bar.

### Motion galleries
- **Timing:** Spring vs. duration+easing. If spring: stiffness + damping. If easing: the curve (e.g. `cubic-bezier(0.22, 1, 0.36, 1)` for a snappy "out"). Default duration 200–300ms for UI, 400–600ms for entrances.
- **Physical feel:** Resistance, overshoot, snap. Note the *character* (playful Duolingo vs. precise Stripe vs. inertial iOS).
- **Trigger:** What initiates the motion (hover, press, scroll, view-enter, data-load)? Match the trigger to your interaction model.
- **Decoded code:** UI Motion (uimotion.fyi) gives CSS/React/Framer Motion code — copy the values, not the whole component, and adapt to your system.

### Design-system docs
- **Token names:** Steal the token *naming convention* (e.g. Material's `surface-container`, Carbon's `$spacing-05`, GDS's scale). Consistency of naming matters more than the exact values.
- **Motion tokens:** Material 3 and Apple HIG define motion *durations and curves as tokens* — use these as the floor for any motion you add.
- **Accessibility floors:** GDS/USWDS define contrast, target size, focus treatment that is *legally validated*. Treat them as the minimum, not the ceiling.

---

## 4. The token sheet (your scouting deliverable)

Capture this compactly. Aim for under one screen of text. This is what feeds the build.

```
TYPE:    display "<family> <weight>", body "<family> <weight>", [mono accent "<family>"]
COLOR:   bg <tone>, surface <tone>, text <tone>, accent <hue>, [muted/border]
SPACING: base <px>, scale <list>, container max-width <px>
RADIUS:  system <ramp or single>
MOTION:  ui <duration ms> <easing>, entrance <duration> <easing>, [spring stiffness/damping]
COMP:    hero <layout>, section <rhythm>, nav <density>, proof <placement>
3 MOVES: <the two-three composition/motion ideas worth stealing, generalized>
```

A real example for a "Linear-style dev-tool landing":
```
TYPE:    display "Geist Sans 600", body "Geist Sans 400", mono "Geist Mono 400"
COLOR:   bg #0A0A0A, surface #111, text #EDEDED, accent #5B8CFF, border #1F1F1F
SPACING: base 4px, scale 4/8/12/16/24/32/48/64, container max 1152px
RADIUS:  single rounded-lg (8px) on cards/buttons; pills for tags
MOTION:  ui 200ms cubic-bezier(0.22,1,0.36,1), entrance 500ms same, no spring
COMP:    hero left-aligned, sticky section nav, proof as logo row above CTA
3 MOVES: (1) sticky-scrolling section nav that highlights active section,
         (2) subtle background grid that fades behind content on scroll,
         (3) number-ticker counters on stats that animate on view-enter.
```

---

## 5. Core principles

1. **Scout to escape the default, not to copy.** The goal of scouting is to notice a *better* default exists, then internalize its tokens. The output is your own coherent language, never a clone.
2. **Balance concept vs. shipped.** Award/landing galleries show what's *possible*; app-screenshot galleries show what *works under constraints*. Always scout one of each for product UI. Concept-only scouting produces Dribbble-pretty-but-unusable UI.
3. **Extract tokens, not vibes.** "Premium" is a vibe; `bg #0A0A0A, surface #111, accent #5B8CFF, Geist 600` is a token set. Only tokens survive into code.
4. **Match the source to the brief's constraint floor.** If the brief is accessibility-critical or regulated, GDS/USWDS *override* aesthetic preference — scout them first, Awwwards never.
5. **Prefer decoded/code sources for motion.** UIMovement gives ideas; UI Motion (uimotion.fyi) gives ideas + working timing/easing values. The latter is buildable; the former is a wishlist.
6. **Steal the system, not the instance.** Borrow a spacing *scale*, a radius *ramp*, a motion *curve family* — these compose across any layout. Borrowing a single hero composition copies one site and dates instantly.
7. **Verify freshness for trend work.** For "current aesthetic," prefer daily feeds (recent.design, Curated.design, Awwwards WOTD). For timeless patterns (navigation, empty states), older archives (Mobbin, Pttrns) are fine.
8. **Acknowledge borrowed vs. official.** In code comments, mark what is *inspired by* a site vs. *from* an official library. Don't imply an official package when you hand-built a borrowed pattern.

---

## 6. Per-brief scouting recipes

### SaaS / dev-tool landing (Linear/Vercel family)
1. **recent.design** + **Curated.design** (category: Design Tools / Dev Tools) — capture hero, section rhythm, pricing.
2. **Geist** design system — steal the spacing/type/dark palette tokens.
3. **Landingfolio** components — pull the actual pricing/feature-section code.
Extract: monochrome + single accent, left-aligned hero, sticky section nav, subtle motion (200ms). Avoid: Aceternity spotlight glows (overused cliché).

### Premium / agency / experimental
1. **Awwwards** (filter by your tech: GSAP, Three.js, WebGL) — capture composition + choreography.
2. **Codrops** — find the *how-to* for any effect you want to adopt; check the date.
3. **UI Motion** — decode the motion timing/easing into buildable values.
Extract: bold type contrasts, asymmetric grids, scroll-driven sequences, spring physics. Avoid: copying one site's exact hero; avoid spectacle that hurts conversion if the page must convert.

### Mobile product UI
1. **Mobbin** — filter by pattern (onboarding, paywall, settings, empty state) and by 3–5 market-leading apps in the vertical.
2. **Page Flows** — capture the *sequence*, not just screens: where friction is removed, how progress is communicated.
3. **Apple HIG** — for the canonical motion characteristics, spacing, and materials.
Extract: real density (higher than Dribbble), tab-bar patterns, empty/loading/error coverage, iOS spacing. Avoid: importing web scales or Dribbble-density.

### Editorial / minimal / portfolio
1. **SiteInspire** (filter style: minimalist) + **Httpster** — calibrate restraint; these are the most consistently tasteful.
2. **Minimal Gallery** — confirm what *true* minimal looks like so you don't underdo it.
3. **Typewolf** — pick a non-Inter display/body pairing.
Extract: generous whitespace, strong type hierarchy, restrained palette (often 1–2 colors + black/white), grid discipline. Avoid: minimal that is actually just empty (no hierarchy).

### Accessible / trust-first / public-sector
1. **GDS (GOV.UK Design System)** — the canonical reference; treat as floor.
2. **USWDS** — US federal equivalent.
3. **Page Flows / Mobbin** — for any consumer-facing flow, to keep it humane (don't let accessibility become sterile).
Extract: validated contrast/target-size/focus, content-first layout, plain-language patterns. Override *all* aesthetic preference with these. Awwwards is irrelevant here.

---

## 7. Anti-patterns (anti-AI-slop)

- **Single-site cloning.** If your output is traceable to one inspiration site, you copied. Always synthesize ≥2 sources.
- **Dribbble-as-truth.** Dribbble shots routinely break accessibility, density, and real-data constraints. Fine for color/palette ideas; never copy a shot into shipped product UI without validating against real content + WCAG.
- **Aceternity/Magic-UI defaulting.** The "spotlight card + purple glow + bento grid" combination is the new slop signature. Use these components only when the brief is explicitly experimental, and customize the palette/animation away from defaults.
- **Award spectacle in conversion pages.** Awwwards winners optimize for impression, not conversion. Borrowing their layout for a page that must convert (pricing, signup) often *hurts* conversion. Re-scout against real SaaS galleries (recent.design, Refero) for conversion work.
- **Token-free moodboards.** A folder of screenshots with no recorded type/color/spacing tokens is inspiration theater. The token sheet (Section 4) is the deliverable; without it, scouting didn't happen.
- **Defaulting to Inter + slate-900.** The single most recognizable LLM tell. Scout Typewolf/Fonts In Use for one alternative pairing before reaching for Inter. Even one swap (e.g. display serif + Inter body) breaks the tell.
- **Ignoring the constraint floor.** Applying Awwwards motion to an accessibility-critical brief, or importing a mobile gallery's density to a desktop data tool. The brief's constraint floor (Section 5.4) beats aesthetic preference every time.
- **Browsing all categories.** Scouting 10 sites across 6 categories produces decision fatigue, not a language. Pick 2–3 categories, 1–2 sources each, and stop.
- **Treating concept shots as shipped.** Concept galleries (Dribbble, Collectui, Awwwards) show what *could* be; shipped galleries (Mobbin, Page Flows, Refero) show what *works*. Match the source type to the question you're answering.
- **Forgetting the source moved.** Re-check `references/sites-catalog.md` for current status — Godly→recent.design, BestWebsite.gallery SOTDs stalled, UIMovement now a Medium pub. Stale URLs waste a scouting pass.

---

## 8. How this skill relates to others

- **`design-taste-frontend`** consumes the token sheet produced here and governs the build (the three dials, design-system mapping, audit-first redesign). Use *this* skill to produce the tokens; use *design-taste-frontend* to apply them.
- **`dataviz`** owns all chart/color decisions for data visualization — do not scout palettes here for charts.
- **Design-system docs (Material/Polaris/Carbon/GDS/Geist)** are a *category within this index*; when a brief maps to one, skip scouting and go straight to that system's tokens, then use `design-taste-frontend` to build.

---

*Reference catalog: [`references/sites-catalog.md`](./references/sites-catalog.md) — 55+ sites with URLs, current status (verified Aug 2026), and per-site extraction notes. Consult it before recalling any URL from memory.*