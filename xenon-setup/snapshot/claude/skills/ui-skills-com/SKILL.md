---
disable-model-invocation: true
name: ui-skills-com
description: Apply UI craft, spacing, type, color, motion, and anti-slop constraints when building, polishing, or auditing web interfaces.
---

# UI-Skills (ui-skills.com)

A self-contained distillation of the design-engineering methodology behind ui-skills.com — a meta-collection of opinionated constraints for design engineers. The site routes agents to the smallest useful skill for a task; this document inlines the load-bearing rules so you can apply them without a network round-trip.

## When to invoke

Use this skill before writing or changing any web interface code, and when auditing existing UI for "AI slop." Specifically:

- Building a new component, page, dashboard, marketing surface, or dialog.
- Polishing, redesigning, or deslopping an existing interface.
- Choosing spacing, typography, color, animation, or interaction patterns.
- Reviewing a diff for craft, accessibility, or motion-performance regressions.
- Deciding whether to animate at all, and how.

Do NOT invoke for non-UI backend, data, or infra work. If the task is clearly framework-specific (Next.js cache, Vue reactivity, Three.js shaders), prefer that framework's dedicated skill instead — see `references/skill-catalog.md` for the routing index.

## Core philosophy

- **Taste is trained, not innate.** Good taste is developed by studying great work and reverse-engineering it. In a world where everyone's software is "good enough," craft is the differentiator.
- **Unseen details compound.** Most polish is consciously invisible — "a thousand barely audible voices all singing in tune." Aggregate invisible correctness is what makes interfaces feel good without users knowing why.
- **Restraint over decoration.** The default answer to "should I add a gradient/glow/animation?" is no, unless explicitly requested. Strong hierarchy comes from contrast in size, weight, space, and tone — not ornament.
- **Smallest useful context.** Prefer one narrow skill over a broad one. Never load more than three skills for a single task. Route by topic, then stack, then specificity.
- **Refinement preserves identity; redesign preserves truth.** Refinement keeps the incumbent look, behavior, and copy. Redesign keeps product truth, content, function, and native affordances. Never blur the two.

## The deslop baseline (apply first)

These are the non-negotiable constraints that prevent generic AI-generated interfaces. Enforce them before any creative work.

**Stack defaults:** use the project's existing primitives first; use Tailwind CSS defaults unless custom values already exist; use `cn` (`clsx` + `tailwind-merge`) for class logic; use accessible primitives (Base UI, Radix, React Aria) for anything with keyboard/focus behavior — never rebuild keyboard/focus by hand; never mix primitive systems on the same surface; add `aria-label` to icon-only buttons.

**Interaction:** use `AlertDialog` for destructive/irreversible actions; use structural skeletons for loading; use `h-dvh` not `h-screen`; respect `safe-area-inset` on fixed elements; show errors next to where the action happens; never block paste in inputs.

**Animation:** never add animation unless explicitly requested; animate only compositor props (`transform`, `opacity`); never animate layout props (`width height top left margin padding`); avoid animating paint props (`background color`) except small local UI; use `ease-out` on entrance; never exceed 200ms for interaction feedback; pause looping animations off-screen; respect `prefers-reduced-motion`; never introduce custom easing unless requested; avoid animating large images or full-screen surfaces.

**Typography:** `text-balance` on headings, `text-pretty` on body; `tabular-nums` for data; `truncate`/`line-clamp` for dense UI; never modify `letter-spacing` unless requested.

**Layout:** fixed `z-index` scale only (no arbitrary `z-*`); `size-*` for squares instead of `w-*`+`h-*`.

**Performance:** never animate large `blur()` or `backdrop-filter`; never apply `will-change` outside an active animation; never use `useEffect` for anything expressible as render logic.

**Design:** never use gradients (especially purple/multicolor) unless requested; never use glow as a primary affordance; use Tailwind's default shadow scale; give every empty state one clear next action; limit accent color to one per view; use existing theme/Tailwind tokens before introducing new colors.

## Spacing & layout

**Scale.** Use a documented scale, not one-off values. A base-4 system (4, 8, 12, 16, 20, 24, 32, 40, 48, 64…) gives the useful middle steps an 8-only scale misses. Name spacing roles semantically (`--space-section`, `--space-card-pad`), not by raw value.

```css
:root{
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px;
  --space-5:20px; --space-6:24px; --space-8:32px; --space-10:40px;
  --space-12:48px; --space-16:64px;
}
```

**Rhythm.** Create rhythm through deliberate contrast between tight and generous intervals — never one repeated value (everything equal weight). Prefer `gap` on flex/grid containers over per-child margins for sibling rhythm; use margins only when `gap` doesn't express the relationship. Repetition supports recognition; break it only when content or priority changes.

**Grouping & proximity.** Group by meaning; use proximity before adding containers or decoration. Related items close, distinct groups separated. Don't let containers compensate for weak proximity.

**Composition.** Layout turns product priority into reading order, grouping, rhythm, and usable space. Identify the primary task path, what groups vs separates, what leads vs supports. Let hierarchy follow product priority, not framework defaults. Predictable linear structure for operate/read modes; asymmetric/fluid composition acceptable for persuade/experience modes.

**The squint test.** Blur detail and confirm primary element, secondary element, and major groups are identifiable in order. Density should match use frequency and content complexity at every supported size. Verify narrow, wide, zoomed, localized, empty, overlay, and small-touch-target states — DOM/focus order must still agree with visual order.

## Typography

**Roles, not sizes.** Define the fewest roles that make hierarchy unmistakable: heading, body, label, metadata, data. Token names describe purpose, not values. Roles must be distinguishable at a glance — watch for adjacent sizes/weights too close to carry different jobs. Repeated roles stay identical across screens and states. Combine size, weight, space, and tone together; don't rely on size alone.

**Body floor.** 1rem / 16px is the web body floor unless a dense role, platform convention, or user setting justifies otherwise. Keep prose measure in 45–75ch. Tune line-height inversely with measure (wider lines need more leading), to the face/width/language/contrast — not a universal ratio. Use paragraph spacing OR first-line indent as the paragraph separator, not both.

**Families & weights.** Ask "is every family necessary?" — don't introduce a second family without a role only it can perform. Don't make type decorative at the expense of comprehension. Load only the weights/assets you use; provide metric-compatible fallbacks to avoid invisible text and disruptive reflow.

**Dark surface compensation.** Light text on dark surfaces needs compensation on all three perceptual axes: slightly more line-height, a touch more tracking, one step more weight when the face needs it.

**Features.** Use `tabular-nums` for data tables, `text-balance` for headings, `text-pretty` for paragraphs. Stress-test with long headings, localization expansion, zoom, narrow containers, missing weights, and fallback scenarios.

```css
h1,h2,h3{ text-wrap:balance; }
p,li{ text-wrap:pretty; }
table.data,td.num{ font-variant-numeric:tabular-nums; }
```

## Color (OKLCH)

Prefer OKLCH over HSL/hex for new work. Perceptually uniform lightness, stable hue across lightness, independent chroma, and gamut awareness.

**Syntax:** `oklch(L C H / alpha)` — L 0–1, C 0–~0.4 (0 = gray; max depends on L and H), H 0–360°, alpha slash-separated. Format L and C to 3 decimals, strip trailing zeros, render `-0` as `0`.

**Building scales.** Fix a hue and step L in perceptually equal increments (e.g. 0.15 → 0.95). Keep chroma consistent by using the same *percentage* of each hue's maximum chroma, not the same absolute value — this gives consistent vividness across hues. Watch for drift: > 10° spread across steps = visible drift; rebuild with a constant hue. Derive dark mode by reversing the light L mapping, never hand-picking.

**Contrast.** Adjust L only — chroma has negligible effect on contrast, keep C and H fixed and shift L until the ratio passes. Check foreground against its *actual* background, not white.

| Rule | Value |
|---|---|
| Light/dark boundary | L > 0.6 → light bg, dark text |
| Light bg (L > 0.85) | text L < 0.45 |
| Dark bg (L < 0.25) | text L > 0.75 |
| WCAG AA normal text | 4.5:1 |
| WCAG AAA normal text | 7:1 |

**Gamut.** High-chroma values clip in sRGB — clamp chroma to the max for the L/H pair. Provide an sRGB fallback, then enhance in P3:

```css
.btn{ background: oklch(0.62 0.20 25); }                 /* sRGB */
@media (color-gamut: p3){
  .btn{ background: oklch(0.62 0.24 25); }                 /* P3 */
}
```

**Tailwind v4.** Define scales directly in `@theme`:

```css
@theme{
  --color-primary-50:  oklch(0.97 0.02 260);
  --color-primary-100: oklch(0.93 0.04 260);
  --color-primary-500: oklch(0.62 0.19 260);
  --color-primary-900: oklch(0.27 0.05 260);
}
```

## Motion

### Should this animate at all? (frequency decides)

| Frequency | Example | Motion |
|---|---|---|
| 100+/day | command palette, ⌘K | **None ever** |
| tens/day | hovers, list nav | remove or drastically reduce |
| occasional | modals, drawers, toasts | standard |
| rare/first-time | onboarding, celebrations | can add delight |

Never animate keyboard-initiated actions — they repeat hundreds of times daily and animation makes them feel slow.

### Timing

- User-initiated animations must complete within **300ms**. A 180ms dropdown feels more responsive than 400ms; a faster spinner makes the app feel faster even at identical load time.
- Similar elements share identical timing. Don't run a primary button at 200ms and secondary at 150ms.
- Context menus should not animate on entrance (exit only).
- Durations by element: button press 100–160ms; tooltips/small popovers 125–200ms; dropdowns/selects 150–250ms; modals/drawers 200–500ms.

### Easing

- Entrance → `ease-out` (arrive fast, settle gently). **Never `ease-in` on UI** — it delays the moment users watch most.
- Exit → `ease-in` (build momentum before departure).
- Moving/morphing on screen → `ease-in-out`.
- Hover/color change → `ease`.
- Constant motion (progress) → `linear` (the only valid linear use).
- Default fallback → `ease-out`.

Prefer custom cubic-bezier over built-in CSS easings:

```css
--ease-out:    cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
```

### Mechanism (performance)

- Animate **only `transform` and `opacity`** — they skip layout and paint, run on GPU.
- Never animate layout props (`width height top left margin padding`) — triggers all three rendering steps.
- Animate paint props (`background color`) only on small isolated elements.
- Don't animate CSS variables for transform/opacity/position; don't animate inherited CSS variables — update `transform` directly on elements.
- Measure once, then animate via transform (FLIP): batch all DOM reads before writes; never interleave layout reads and writes in the same frame.
- Don't drive animation from `scrollTop`/`scrollY`/scroll events — use Scroll/View Timelines (`animation-timeline: view()`) or IntersectionObserver for reveal/pause.
- `will-change` is temporary and surgical — never apply it outside an active animation; avoid many or large promoted layers.
- CSS animations beat JS under load (run off main thread); use WAAPI for programmatic, hardware-accelerated, interruptible animation with no library.
- Framer Motion shorthand `x`/`y`/`scale` use main-thread rAF — use full `transform: "translateX()"` strings for hardware acceleration.

```js
// FLIP: measure once, animate via transform
const first = el.getBoundingClientRect();
el.classList.add('moved');
const last  = el.getBoundingClientRect();
el.style.transform = `translateX(${first.left - last.left}px)`;
requestAnimationFrame(() => { el.style.transition = 'transform .3s'; el.style.transform = ''; });
```

### Physics & feel

- Active/pressed state with `transform: scale(0.97–0.98)` on `:active`, `transition: transform 160ms ease-out`. Keep squash/stretch in the 0.95–1.05 range — `scale(0.8)` is too extreme.
- Use springs (not easing curves) when you want overshoot-and-settle; keep bounce subtle (0.1–0.3). Apple-style: `{ type:"spring", duration:0.5, bounce:0.2 }`. Springs stay interruptible with velocity; CSS restarts from zero — springs are right for reversible gestures.
- Stagger entrances 30–80ms per item (never > 50ms); stagger is decorative and must never block interaction.
- Asymmetric timing: slow where the user decides (hold-to-delete 2s linear), fast where the system responds (release 200ms ease-out).
- Momentum dismissal: dismiss on velocity (`distance/time` > ~0.11) regardless of distance — a quick flick should work. Damp at boundaries with increasing friction, not a hard wall; set pointer capture so drag survives the pointer leaving bounds.
- Never animate from `scale(0)` — nothing real disappears and reappears; start from `scale(0.95)` + `opacity: 0`.
- Popovers use `transform-origin: var(--transform-origin)` to scale from their trigger; modals keep centered origin.
- CSS transitions over keyframes for rapidly-triggered UI (toasts, toggles) — transitions retarget mid-animation; keyframes restart.
- Blur to mask imperfect crossfades (`filter: blur(2px)` during transition), keep under 20px (expensive, Safari especially).

### Staging (Disney principles, web-applied)

- **One focal point:** only one element animates prominently at a time.
- **Dim the background** for modals/dialogs to direct focus (e.g. `var(--black-a6)`).
- **Respect z-index layering** on animated elements.

### Accessibility for motion

- `prefers-reduced-motion`: *reduce*, don't eliminate — keep opacity/color transitions that aid comprehension, remove movement/position.
- Gate hover animations behind `@media (hover: hover) and (pointer: fine)` to prevent false positives on touch.

```css
@starting-style for entry without JS:
.toast{ opacity:1; transition:opacity .4s ease; @starting-style{ opacity:0; } }
```

### Motion review checklist

| Smell | Fix |
|---|---|
| `transition: all` | specify exact properties |
| `scale(0)` entry | start `scale(0.95)` + `opacity:0` |
| `ease-in` on UI | `ease-out` or custom curve |
| centered transform-origin on popover | set to trigger location |
| animation on keyboard action | remove entirely |
| duration > 300ms on UI | 150–250ms |
| hover without media query | `@media (hover:hover) and (pointer:fine)` |
| keyframes on rapid-trigger | use transitions |
| Framer `x`/`y` under load | `transform: "translateX()"` |
| same enter/exit speed | exit faster than enter |
| all elements appear at once | 30–80ms stagger |

## Interaction & component patterns

- **Buttons:** `:active{ transform:scale(0.97) }` with `transition:transform 160ms ease-out`. Keep scale 0.95–0.98.
- **Tooltips:** delay initial appearance to avoid accidental activation; once one is open, adjacent tooltips appear instantly (`transition-duration:0ms`) so the toolbar feels fast.
- **Toasts (Sonner principles):** no hooks/context — `<Toaster/>` once, `toast()` from anywhere; good defaults matter more than options; handle edge cases invisibly (pause timers when tab hidden, fill gaps in stacks, capture pointer during drag); use transitions not keyframes (rapidly added); match motion to component personality.
- **Empty states:** always one clear next action.
- **Destructive actions:** `AlertDialog`, never a plain confirm.
- **Loading:** structural skeletons, not spinners for content.
- **Errors:** shown next to where the action happens, linked via `aria-describedby`.

## Accessibility floor

Enforce before creative work; prefer minimal targeted fixes over rewrites.

- **Names:** every interactive control has an accessible name; icon-only buttons get `aria-label`; decorative icons `aria-hidden`; inputs/select/textareas labeled; links have meaningful text (not "click here").
- **Keyboard:** no `div`/`span` as button without full keyboard support; all interactive elements Tab-reachable; visible focus; `tabindex` never > 0; Escape closes dialogs/overlays.
- **Focus & dialogs:** trap focus while open; restore to trigger on close; set initial focus inside; opening a dialog must not scroll the page.
- **Semantics:** prefer native (`button`/`a`/`input`) over role hacks; lists use `ul`/`ol`+`li`; no skipped heading levels; `th` for table headers.
- **Forms:** errors linked via `aria-describedby`; required announced; invalid sets `aria-invalid`; helper text associated; disabled submit explains why.
- **Announcements:** critical errors `aria-live`; loading `aria-busy`/status text; toasts never the only channel for critical info; expandable uses `aria-expanded`+`aria-controls`.
- **Contrast & states:** sufficient contrast for text/icons; hover-only interactions need keyboard equivalents; disabled state never by color alone; never remove focus outline without a visible replacement.
- **Media & motion:** correct alt text (meaningful or empty); captions for speech; respect `prefers-reduced-motion`; no autoplay with sound.
- Don't add ARIA when native semantics already solve it; don't migrate UI libraries unless asked.

## Anti-patterns to avoid (anti-AI-slop)

This is the consolidated list of things that make UI read as generic/AI-generated. Hard-avoid unless explicitly requested:

- Gradients, especially purple and multicolor gradients.
- Glow effects as primary affordances.
- Arbitrary `z-index` values (use a fixed scale).
- `h-screen` (use `h-dvh`).
- Animating `width/height/top/left/margin/padding` or large `blur()`/`backdrop-filter` surfaces.
- `scale(0)` entrances; `ease-in` on UI; `transition: all`; durations over 300ms for interactions.
- Animation on high-frequency or keyboard-initiated actions.
- Modifying `letter-spacing` ad hoc; one-off spacing values; `w-*`+`h-*` for squares (use `size-*`).
- Introducing a new color/family/weight without using existing tokens first.
- More than one accent color per view.
- Empty states without a single clear next action.
- `will-change` outside an active animation; `useEffect` for render logic.
- Rebuilding keyboard/focus/scroll-into-view behavior by hand instead of an accessible primitive.
- Mixing primitive systems (Radix + Base UI + Aria) on the same interaction surface.
- Blocking paste in inputs; showing errors far from the action; spinners where skeletons belong.
- Hand-picking dark-mode colors instead of deriving by reversing the light L mapping.
- Splitting the difference into "polish on the discarded look" during a redesign.
- Decorative type at the expense of comprehension; a second font family without a role only it can perform.

## Workflow

1. **Decide if the task is UI-related.** If not, return "no skill needed."
2. **Identify the topic** (spacing, type, color, motion, interaction, accessibility, craft, taste, systems).
3. **Load the smallest useful context** — this file covers the cross-cutting floor; for deep framework/topic work, route via `references/skill-catalog.md` (one skill preferred, two for two clear angles, three only for broad review; never more than three).
4. **Apply the deslop baseline first**, then the topic-specific guidance above.
5. **Review with fresh eyes** — play motion in slow motion / frame-by-frame; squint-test layout; test touch on real devices; verify zoom, localization, empty, and reduced-motion states.
6. **Report findings** as: violation (exact snippet) → why it matters (one sentence) → concrete fix (code-level). Fix critical issues first (accessible names, keyboard, focus, tool boundaries, never-patterns).

## Routing to deeper skills

For framework-specific or deep-topic work, the ui-skills.com registry indexes ~80 skills across authors (Anthropic, Vercel, shadcn, antfu, addyosmani, pbakaus/impeccable, emilkowalski, raphael-salaja, Vuejs-ai, etc.). The full catalog with slugs, topics, and source repos is in `references/skill-catalog.md`. Prefer the most specific narrow skill for the task; prefer framework-specific skills when the stack is obvious.