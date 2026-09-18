# Component registries — install facts

Every entry is a way to get a *finished* component instead of writing one. Registries marked with a
namespace install directly into the shadcn system (`components/ui` + the same CSS variables), which is
why shadcn is the base: it makes all of them composable.

**Before installing anything, verify three things** (this is where most breakage comes from):

1. `package.json` → Tailwind v3 or v4? Many registries still ship v3 snippets.
2. Is `motion` or `framer-motion` already installed, and at which major? Registries targeting
   `motion` (v11+) will add a second, conflicting motion library.
3. React version and RSC — registry components are clients; import them at the leaf.

Always install one at a time and look at the diff (`git diff`) to confirm what landed.

## Tier 1 — shadcn-native registries (namespace install)

| Registry | Namespace / command | Strength (use for) | Notes |
|---|---|---|---|
| **shadcn/ui** | `npx shadcn@latest add button card dialog input …` | Every control: buttons, forms, overlays, tables, nav, charts, toasts | The base. See `references/SHADCN.md` |
| **Magic UI** | `npx shadcn@latest add @magicui/<name>` — e.g. `@magicui/marquee`, `@magicui/terminal`, `@magicui/number-ticker`, `@magicui/shimmer-button` | Marketing polish: marquee, terminal, bento grid, animated text, orbiting circles, particles | Requires `motion`; has an "animated"/"static" component split |
| **Aceternity UI** | `npx shadcn@latest add @aceternity/<name>` (registry `https://ui.aceternity.com/registry/<name>.json`) | High-impact heroes and 3D/spotlight effects: spotlight, aurora background, 3D card, tracing beam, text-generate-effect | Heavy; pick 1–2, never a whole page |
| **animate-ui** | `npx shadcn@latest add @animate-ui/<primitive>` | **Animated versions of the Radix/shadcn primitives themselves** (dialog, tabs, accordion, tooltip, checkbox) — the fix for "shadcn but it just appears" | Ideal pairing with plain shadcn; Motion under the hood |
| **Kokonut UI** | `npx shadcn@latest add @kokonutui/<name>` | Clean modern marketing + dashboard blocks (cards, loaders, gradient text, file upload) | Tasteful defaults, good shadcn fit |
| **Cult UI** | `npx shadcn@latest add @cult-ui/<name>` | Unusual interactive pieces (dynamic islands, texture cards, gradient headings) | Smaller set, higher novelty |
| **Eldora UI** | re-verify before use | Micro-interactions and text effects | **Domain `eldora-ui.com` did not resolve as of 2026-09 — do not cite until re-checked**; the same need is covered by Animata / Magic UI / Motion Primitives text effects |
| **Syntax UI** | `npx shadcn@latest add @syntaxui/<name>` | Animated landing-page sections: hero, testimonials, pricing, CTA, feature blocks | Section-level, fast assembly |
| **Motion Primitives** | `npx motion-primitives@latest add <name>` | Motion *primitives* (transition panels, carousels, text effects, infinite slider, dialogs) that you compose | Well-engineered; closest to a motion system rather than a gallery |
| **React Bits** | `npx shadcn@latest add "https://reactbits.dev/r/<component>-<variant>-<style>"` (component page prints the exact command) | 100+ text/animation/background/component effects, TS + TW variants | Huge catalogue; enforce the direction contract or it becomes a grab bag |
| **Animata** | `npx shadcn@latest add https://animata.design/r/<category>/<component>.json` | Hand-crafted animated sections and 40+ text effects | Strong art direction; Tailwind v4 + framer-motion |
| **coss ui** (formerly Origin UI) | copy-paste / registry URL at `coss.com/ui` | Very large library of *practical* app components: inputs, selects, date pickers, steppers, tables (now Base UI based) | Best for dense product UI, not marketing flash. `originui.com` now redirects here |
| **UI Layouts** | install via the URL shown on the component page | Animated blocks: heroes, scroll effects, 3D and GSAP-driven sections | Pulls in motion/gsap/lenis/three — install selectively |
| **shadcnblocks** | `npx shadcn@latest add @shadcnblocks/<block>` | Full section blocks (heroes, features, pricing, footers, dashboards) | Free tier + paid pro blocks — check the licence per block |
| **Tailark** | copy-paste / registry URL | Marketing blocks: hero, feature, testimonial, pricing, FAQ sections | Free, block-level, shadcn-based |
| **21st.dev** | `npx shadcn@latest add "https://21st.dev/r/<author>/<component>"` | Community marketplace: individual components and effects from many authors | Quality varies wildly — inspect before adopting; great for technique discovery |
| **React Native Reusables** | registry `@react-native-reusables/<name>` (RN CLI) | The shadcn port for React Native / Expo | Same token names as web where possible |
| **shadcn-svelte** | `npx shadcn-svelte@latest add <name>` | SvelteKit equivalent of shadcn/ui (bits-ui based) | Same variable contract |
| **shadcn-vue** | `npx shadcn-vue@latest add <name>` | Vue/Nuxt equivalent (Reka UI based) | Same contract |

## Tier 2 — copy-paste libraries (no registry; paste + own)

| Library | How to consume | Strength |
|---|---|---|
| **Hover.dev** | Copy the component source from hover.dev | Hover/press micro-interactions with real polish |
| **Inspira UI** | `npx shadcn-vue@latest add <component>` | Vue/Nuxt-first animated components |
| **Lunar UI** | dead — `lunarui.com` is a parked domain as of 2026-09 | use Magic UI / Animata instead |
| **Uiverse** | Copy-paste CSS/Tailwind | Micro-details: one-off switches, loaders, badges (community quality — verify a11y) |
| **HyperUI / Meraki UI / Flowbite blocks / Preline** | Copy-paste HTML/Tailwind | Free marketing-section inventory when not on React |
| **Tailwind Plus (Tailwind UI)** | Paid licence, copy-paste | The reference standard for section craft; study even if not licensed |
| **Cruip / Tailwind Templates** | Free/paid templates | Complete landing-page structures to study for section order |
| **Framer / Webflow template galleries** | Paid/free, study + adapt | Modern marketing section patterns, motion conventions |

## Tier 3 — component systems that are *not* shadcn

Use only when the brief demands it; note the exception in the scout file.

| System | Consume | When |
|---|---|---|
| **HeroUI** | `npm i @heroui/react` (Tailwind plugin) | When a project already uses it — its own theming, do not mix with shadcn primitives for the same control |
| **Tremor** | `npm i @tremor/react` | Analytics dashboards; pair with your tokens for colour |
| **Mantine / Chakra / MUI / Ant** | `npm i …` | Only inside projects already committed to them; follow their composition idiom, not shadcn's |
| **Park UI** | `npm i @park-ui/react` (Panda CSS, Ark UI) | Teams on Panda CSS wanting the shadcn feel |
| **DaisyUI** | Tailwind plugin | Rapid prototypes / server-rendered pages without React |
| **Radix Themes** | `npm i @radix-ui/themes` | Fast accessible primitives with their own token system — cannot be combined with shadcn tokens |

## Choosing (decision table)

| Need | First choice | Second |
|---|---|---|
| Buttons, inputs, dialogs, menus, tables, toasts | shadcn/ui | Origin UI, Aceternity |
| The same primitives, but animated on open/close | animate-ui | Motion Primitives |
| Marketing hero with a signature moment | Aceternity (spotlight/aurora/3D card) | Magic UI, React Bits |
| Logo marquee, ticker, orbiting logos, terminal | Magic UI | React Bits |
| Animated text (shimmer, gradient, typewriter, morph) | Magic UI + Motion Primitives | React Bits, Eldora |
| Complete landing sections (hero→footer) | Syntax UI / Tailark / shadcnblocks | Tailwind Plus (study) |
| Dense data product UI | Origin UI + shadcn | Tremor (charts) |
| Animated numbers / stats | NumberFlow (npm) | Magic UI number-ticker |
| Backgrounds: grid, dots, beams, gradients, noise | Magic UI, Aceternity, React Bits | fffuel/haikei for static assets |
| Hover/press micro-interaction | Hover.dev | animate-ui, Cult UI |
| Community one-offs & technique search | 21st.dev | Uiverse |

## Rules

1. **One aesthetic, few registries.** The design contract names the 2–3 registries in play; extras
   require justifying the addition.
2. **Restyle to tokens, immediately.** A registry component shipped with its demo colours is slop;
   map its colours/spacing/radius to the project tokens before it lands in a commit.
3. **Prune.** Delete unused components and their deps; a registry install often drags helpers
   (`utils/cn`, `hooks/`, extra motion variants).
4. **Respect licences.** Most are MIT/free-with-attribution; some blocks are paid. Never ship a paid
   block unlicensed, and never ship a component whose licence you did not read.
5. **Keep the a11y bar.** Copy-paste components often omit focus styles, labels and reduced-motion
   handling — fix them; the upstream skill rules still apply (`references/A11Y-PERF.md`).
6. **Never install a registry component to avoid thinking.** If the design does not need it, it does
   not go in.
