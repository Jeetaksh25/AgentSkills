# UI-Skills Catalog & Routing Index

Source: ui-skills.com registry (`syntax-syndicate/ui-skills`). ~80 skills from multiple authors, organized by topic. Each entry: `slug` — description (topics). Raw content lives at `https://raw.githubusercontent.com/<user>/<repo>/main/<path>`.

## Routing rules

- Prefer **1 skill**. Use 2 only for two clear angles. Use 3 only for broad review/redesign/multi-surface work. Never more than 3.
- Route by **topic, then stack, then specificity**. Prefer specific over broad; framework-specific when the stack is obvious.
- For quick cleanup, prefer the most specific craft/visual/layout skill available.
- If unsure, inspect the category and pick the safest narrow skill.

## Primary design topics

accessibility · motion · systems · visual · interaction · performance · craft · taste · typography · color · 3d

Related-topic map (each topic → its four nearest neighbors):

| Topic | Related |
|---|---|
| accessibility | testing, color, interaction, frontend |
| motion | interaction, performance, visual, remotion |
| systems | architecture, frontend, tooling, craft |
| visual | color, typography, craft, taste |
| interaction | motion, visual, accessibility, frontend |
| performance | tooling, frontend, testing, motion |
| craft | visual, systems, typography, taste |
| taste | visual, craft, interaction, motion |
| typography | visual, craft, systems, accessibility |
| color | visual, accessibility, systems, craft |
| 3d | threejs, visual, interaction, performance |

## Craft / polish / deslop

- `baseline-ui` — deslop UI: fix spacing, hierarchy, typography, small layout (systems, visual, craft). **Start here for any cleanup.**
- `ui-skills-root` — routing layer; select smallest useful skill set (systems, tooling, architecture).
- `emil-design-eng` — Emil Kowalski's design-engineering philosophy: UI polish, components, animation, production craft (craft, taste, visual).
- `make-interfaces-feel-better` — micro-interactions, typography, visual details (craft, interaction, visual).
- `polish` (impeccable) — final quality pass for spacing, alignment, consistency (craft, visual, systems).
- `layout` (impeccable) — fix spacing, composition, hierarchy rhythm (craft, systems, visual).
- `typeset` (impeccable) — typography systems, hierarchy, readability, cadence (typography, craft, visual).
- `distill` (impeccable) — simplify noisy interfaces, remove non-essential complexity (systems, interaction, craft).
- `impeccable` — flagship: production-grade, anti-generic frontend interfaces (craft, visual, systems).
- `shape` (impeccable) — structured design interview → actionable design brief before coding (interaction, systems, architecture).

## Taste / visual direction

- `design-taste-frontend` (taste-skill) — anti-slop design decisions, motion quality, architecture discipline (taste, visual, frontend).
- `high-end-visual-design` (soft-skill) — premium typography, spacing, depth, animation systems (taste, craft, visual).
- `minimalist-ui` (minimalist-skill) — editorial minimal: monochrome palettes, typographic contrast, restrained visuals (taste, visual, systems).
- `industrial-brutalist-ui` (brutalist-skill) — raw mechanical: Swiss print structure + terminal brutalism (taste, visual, interaction).
- `gpt-taste` (gpt-tasteskill) — high-agency UX/UI: strict layout variance, typography, GSAP motion (taste, systems, frontend).
- `stitch-design-taste` (stitch-skill) — semantic design-system for Google Stitch, anti-generic rules (systems, tooling, taste).
- `redesign-existing-projects` (redesign-skill) — audit & upgrade existing interfaces to premium quality, preserve function (craft, visual, interaction).
- `swiss-design` — grid discipline, typography hierarchy, clean editorial composition (visual, typography, systems).
- `bolder` (impeccable) — increase visual impact for too-safe/bland interfaces (visual, interaction, taste).
- `quieter` (impeccable) — tone down overly intense designs, keep quality & hierarchy (visual, systems, craft).

## Motion / interaction

- `12-principles-of-animation` — Disney's 12 principles applied to web: timing/easing/physics/staging audit (motion, interaction, visual).
- `interaction-design` (wshobson) — microinteractions, motion design, transitions, feedback patterns (interaction, motion, visual).
- `animate` (impeccable) — purposeful animation & micro-interactions supporting usability (motion, interaction, frontend).
- `delight` (impeccable) — personality & memorable moments via interaction details (interaction, motion, taste).
- `overdrive` (impeccable) — high-impact: advanced animation, shaders, ambitious systems (motion, visual, taste).
- `mastering-animate-presence` — Motion/Framer Motion exit/presence patterns & fixes (motion, interaction, frontend).
- `morphing-icons` — icon components that morph between SVG shapes (motion, visual, frontend).
- `to-spring-or-not-to-spring` — when springs vs easing curves produce better motion (motion, performance, frontend).
- `pseudo-elements` — CSS pseudo-elements & View Transitions for hover/decorative/transitions (motion, visual, frontend).
- `transitions-dev` — production-ready CSS transition snippets: cards, modals, dropdowns, panels, pages (motion, interaction, frontend).
- `fixing-motion-performance` — audit/fix animation perf: layout thrashing, compositor props, scroll-linked, blur (motion, performance, frontend).
- `adapt` (impeccable) — responsive design across breakpoints, devices, platform constraints (interaction, systems, frontend).

## Color

- `oklch-skill` — practical OKLCH workflow for consistent, accessible, tunable color systems (color, accessibility, systems).
- `colorize` (impeccable) — strategic color systems for dull/monochrome/flat interfaces (color, visual, systems).

## Accessibility

- `fixing-accessibility` — audit/fix ARIA, keyboard, focus, contrast, form errors (accessibility, testing, frontend).
- `wcag-audit-patterns` (wshobson) — WCAG 2.2 audits with automated + manual verification & remediation (accessibility, testing, frontend).
- `audit-and-fix` (AccessLint) — accessibility detection, prioritization, practical fixes (accessibility, testing, frontend).
- `web-quality-audit` (addyosmani) — Lighthouse-style perf/a11y/best-practices/SEO (performance, accessibility, testing).

## Systems / component architecture

- `frontend-ui-engineering` (addyosmani) — component architecture, responsive, a11y, maintainable patterns (frontend, systems, accessibility).
- `shadcn` — project-aware shadcn/ui workflow: search, add, compose, fix (systems, tooling, frontend).
- `frontend-design` (anthropics) — distinctive production-grade interfaces, avoid generic AI aesthetics (visual, systems, frontend).
- `interface-design` (Dammyjay93) — dashboards, admin panels, SaaS; craft & consistency (visual, systems, interaction).
- `ui-ux-pro-max` — 50+ styles, 97 palettes, 9 stacks for professional interfaces (visual, systems, frontend).
- `design-lab` (0xdesign) — interactive design exploration: interviews, variants, refine via feedback (visual, interaction, systems).
- `harden` (impeccable) — production-ready empty states, edge cases, errors, onboarding, i18n (testing, systems, frontend).
- `clarify` (impeccable) — labels, microcopy, UX messaging clarity (interaction, systems, frontend).
- `critique` (impeccable) — structured UX scoring, persona checks, remediation (testing, visual, taste).
- `audit` (impeccable) — technical UI quality: a11y, perf, theming, responsive, anti-patterns (testing, accessibility, performance).
- `optimize` (impeccable) — rendering, motion smoothness, assets, load speed (performance, frontend, testing).

## Framework-specific

- `next-best-practices` · `next-cache-components` · `next-upgrade` (Vercel) — Next.js file conventions, RSC, caching, upgrades (nextjs).
- `react-best-practices` (Vercel) — rendering perf, bundle, scalable architecture (frontend, performance, systems).
- `react-router-framework-mode` (remix-run) — loaders, actions, middleware, route modules (frontend, architecture, interaction).
- `svelte-code-writer` (sveltejs) — modern Svelte patterns, composition, production impl (frameworks, frontend, tooling).
- `vue` · `vue-best-practices` · `vue-router-best-practices` · `vue-testing-best-practices` · `vue-pinia-best-practices` · `vue-jsx-best-practices` · `vue-options-api-best-practices` · `vue-debug-guides` · `vueuse-functions` (antfu / vuejs-ai) — Vue 3 Composition API, Pinia, Router, testing, JSX, debugging (vue).
- `nuxt` (antfu) — Nuxt SSR, auto-imports, file-based routing, server routes (nuxt, frontend, performance).
- `pinia` (antfu) — type-safe Pinia stores, getters, actions (vue, systems, frontend).
- `react-native-best-practices` (callstack) — RN perf: FPS, TTI, bundle, memory, re-renders, animations (react-native, performance, frontend).
- `swiftui-ui-patterns` (dimillian) — SwiftUI views, tab architecture, screen composition (swiftui, interaction, systems).
- Three.js (cloudai-x): `threejs-fundamentals` · `threejs-animation` · `threejs-geometry` · `threejs-interaction` · `threejs-lighting` · `threejs-loaders` · `threejs-materials` · `threejs-postprocessing` · `threejs-shaders` · `threejs-textures` (threejs).
- `remotion-best-practices` — build videos with Remotion + React (video, motion, remotion).
- `frontend-slides` — animation-rich HTML presentations / PPT→web slides (video, visual, frontend).

## Tooling / quality

- `antfu` (antfu) — opinionated JS/TS tooling & conventions (tooling, frontend, performance).
- `pnpm` · `vite` · `vitest` · `turborepo` · `tsdown` · `unocss` · `slidev` · `vitepress` (antfu) — package mgmt, build, test, monorepo, bundling, atomic CSS, slides, docs (tooling/testing).
- `playwright-cli` (microsoft) — browser automation, test generation, tracing, E2E (testing, tooling, frontend).
- `agent-browser` (Vercel) — browser automation CLI for AI agents: nav, forms, extraction, screenshots, QA (testing, tooling, frontend).
- `react-doctor` (millionco) — detect security/perf/correctness/architecture regressions (testing, performance, frontend).
- `budge` (millionco) — single-property CSS/Tailwind live-tuning widget for Next.js App Router (visual, tooling, frontend).
- `full-output-enforcement` (output-skill) — enforce complete non-truncated code output (tooling, testing, frontend).
- `web-design-guidelines` (Vercel/antfu) — review UI code against Vercel web interface guidelines (visual, accessibility, frontend).
- `fixing-metadata` — audit/fix page metadata: titles, meta, OG, Twitter, canonical, JSON-LD (architecture, frontend, tooling).
- `rams` (rams.ai) — real-time design feedback: a11y, spacing, typography, contrast, component quality (visual, accessibility, interaction).
- `generating-sounds-with-ai` · `sounds-on-the-web` (raphaelsalaja) — Web Audio synthesis & interface sound feedback (interaction, accessibility).
- `bencium-innovative-ux-designer` — distinctive production-grade frontend, avoid generic AI aesthetics (visual, systems, frontend).
- `canvas-design` (anthropics) — original visual design/art on digital canvases: form, space, color (visual, interaction, frontend).
- AccessLint marketplace: `contrast-checker` · `link-purpose` · `refactor` · `use-of-color` — compatibility listings for AccessLint installs (accessibility, testing).

## CLI (when online)

```bash
npx ui-skills start                     # entry / routing
npx ui-skills categories                # list categories
npx ui-skills list --category <cat>     # skills in a category
npx ui-skills get <slug>                 # fetch one skill
```

## Source repos (for raw fetches)

Raw skill content: `https://raw.githubusercontent.com/<user>/<repo>/main/<path>` — paths are in the registry under each entry. Key authors: `ibelick/ui-skills`, `anthropics/skills`, `vercel-labs/agent-skills`, `vercel-labs/next-skills`, `shadcn-ui/ui`, `antfu/skills`, `addyosmani/agent-skills`, `pbakaus/impeccable`, `emilkowalski/skill`, `raphaelsalaja/skill`, `vuejs-ai/skills`, `jakubkrehel/oklch-skill`, `Leonxlnx/taste-skill`, `wshobson/agents`, `CloudAI-X/threejs-skills`, `remotion-dev/skills`, `dimillian/skills`, `zeke/swiss-design-skill`, `microsoft/playwright-cli`, `callstackincubator/agent-skills`, `millionco/skills`, `millionco/react-doctor`, `nextlevelbuilder/ui-ux-pro-max-skill`, `Dammyjay93/interface-design`, `0xdesign/design-plugin`, `jakubkrehel/make-interfaces-feel-better`, `AccessLint/claude-marketplace`, `bencium/bencium-marketplace`, `zarazhangrui/frontend-slides`, `rams/rams-ai`.