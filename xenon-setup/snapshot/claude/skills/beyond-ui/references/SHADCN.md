# shadcn/ui — the component base

Every interactive primitive in the UI comes from shadcn/ui. This file is the operative manual:
setup, theming, token discipline, extension rules, and the narrow cases where shadcn is the wrong
answer.

## Why it is the base

shadcn is not a dependency — it is source you own, generated into `components/ui`, built on Radix
(accessibility, focus management, aria wiring, collision handling) and Tailwind (tokens, dark mode).
That combination is exactly what hand-rolled components never reproduce: correct focus traps, escape
handling, `aria-expanded`, screen-reader announcements, RTL, and keyboard navigation for free.

It is also the lingua franca of the animated registries: Magic UI, Aceternity, animate-ui, Kokonut,
Cult, Eldora, Syntax, Motion Primitives and others ship *as shadcn registries*, meaning they install
into the same system, share the same CSS variables, and compose with `Button`, `Card`, `Dialog`
without an adapter layer. Choosing shadcn is what makes every other library in this skill compatible.

## Setup (check before you run anything)

```bash
# Is it already here?
ls components/ui 2>/dev/null | head; cat components.json 2>/dev/null
```

If `components.json` exists, **do not re-run init** — it will overwrite customised tokens and
aliases. Add components to the existing system instead.

Fresh install (Tailwind v4 + Next/Vite; adapt for other frameworks):

```bash
npx shadcn@latest init
npx shadcn@latest add button card input label dialog dropdown-menu sheet tabs tooltip sonner
```

Facts that change what you write:

- Tailwind v4 → theme lives in CSS (`@theme`, `@custom-variant dark`, OKLCH variables in
  `globals.css`). Tailwind v3 → `tailwind.config.ts` + `hsl(var(--…))`. Never mix the two.
- `components.json` `aliases` decide import paths (`@/components/ui/...`). Read it, do not assume.
- Registries install by namespace: `npx shadcn@latest add @magicui/marquee`. Cross-namespace
  installs are fine; conflicting primitives (two `Button`s) are not — keep one.
- RSC: shadcn components are server-safe except those marked `"use client"`. Animated registry
  components are almost all client. Push `"use client"` to the leaf, not the page.

## Token discipline

The theme is the design system. One file owns it.

```css
:root {
  --background: oklch(0.99 0.003 90);
  --foreground: oklch(0.18 0.01 90);
  --primary:    /* the product's accent, not the default slate */;
  --radius: 0.75rem;
  /* beyond-ui extras: ramp, signal, elevation, motion */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 150ms;
}
```

Rules:

1. **No raw colour, radius, or shadow in JSX.** `bg-[#7c3aed]`, `rounded-[13px]`, arbitrary shadows
   are defects. Use `bg-primary`, `rounded-lg`, `shadow-sm` — or add a token.
2. **Dark mode is a token swap.** If a dark rule contains a colour that is not in the token set, the
   theme is not finished.
3. **Restyle by tokens and variants, not forks.** Change `--primary` or add a `cva` variant in
   `components/ui/button.tsx`; do not create `Button2` in a feature folder.
4. **Contrast is checked in both themes**, on every surface the component can sit on (page, card,
   muted, image, gradient).
5. **Preserve `data-slot`/`cn()` patterns** so future `shadcn add --overwrite` upgrades stay possible
   and third-party registry code keeps composing.

## Composition patterns

- **Extend, don't wrap unnecessarily.** `Button asChild` + a link, `DialogTrigger asChild` + custom
  trigger — this is the intended Radix pattern and preserves behaviour.
- **Forms:** `Form` + `react-hook-form` + `zod`, one schema shared with the server action/route
  handler. Never a second client-side validation truth.
- **Overlays:** `Dialog` for blocking tasks, `Sheet`/`Drawer` for mobile and side flows, `Popover`
  for light content, `AlertDialog` for destructive confirms. Never `confirm()`.
- **Feedback:** `sonner` for transient success, inline field errors for validation, `Alert` for
  persistent warnings, skeletons for loading. A toast is not an error message for a form field.
- **Tables/data:** `Table` + `TanStack Table` for real data grids; paginate, virtualise past ~200
  rows. Empty and loading states are part of the component, not the page.
- **Command surfaces:** `Command` palette for power users; keyboard shortcut documented in the UI.
- **Charts:** `shadcn/chart` (Recharts) wrapped in `ChartContainer` so tokens drive series colours.

## When NOT to use shadcn

Documented exceptions, each of which must be named in the scout/design file:

| Case | Instead |
|---|---|
| No React (Vue, Svelte, Astro islands, vanilla) | Framework-native port: shadcn-vue, shadcn-svelte, or Radix-equivalent primitives (Reka UI, Bits UI, Ark UI) with the same token contract |
| React Native | `react-native-reusables` (shadcn's RN port) + NativeWind |
| Primitive genuinely absent upstream | Compose Radix directly and shape it like a shadcn component (`cn`, variants, `data-slot`) so it stays consistent |
| Heavy bespoke visual (canvas/WebGL hero, 3D scene) | Library/effect (Three, R3F, shaders) — still wrapped in shadcn `Card`/layout tokens where it composes |
| Marketing page needs a bespoke editorial layout | Build layout by hand, but keep shadcn primitives for all *controls* (button, dialog, form, nav) |

The exception is never "it was quicker to write a div".

## Pre-merge checklist

- [ ] Every control is a shadcn primitive (or the same contract) — no raw `<button>`/`<input>`/`<select>`
- [ ] Focus visible on every interactive element, in both themes
- [ ] Dialog/Sheet: escape closes, focus traps, focus returns to trigger
- [ ] Dark mode passes contrast where new colours were introduced
- [ ] No arbitrary values where a token exists; tokens added for anything reused twice
- [ ] Removed every installed-but-unused registry component (they carry deps and CSS weight)
- [ ] Keyboard-only run-through of the primary flow succeeds
