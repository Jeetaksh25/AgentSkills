# Playbook — the decision procedure (which skill, which source, which tool, when)

Load this at phase 0 and keep it open. It answers, without asking the user, the questions an agent gets
wrong on its own: **which skill do I invoke now, where do I pull this piece from, how do I fetch it,
and what do I decide when nobody said.**

## 1. Two kinds of skills

- **Routed skills (exactly 10).** Chosen by `scripts/skills-router.mjs`, installed by the bootstrap,
  condensed into `.beyond-ui/SKILL.md`. Their rules bind the whole build and each is cited (G3, G7).
- **Phase specialists.** Skills that are *already present* in the agent's environment and do one job
  better than any reference file. Invoke them at the phase below; never install one just to satisfy
  this table. Cite them like routed skills (`skill://<name> -> <rule>`) and record each invocation in
  `state.json -> skills.invoked` as `{ "skill", "phase", "why" }`.

**Resolving a skill name.** Names vary by install (plugin prefixes, `-skill` suffixes). Take the first
hit: the agent's Skill tool listing (Claude Code: invoke with the Skill tool) →
`~/.claude/skills/<name>/SKILL.md` → `.claude/skills/` or `.agents/skills/` in the project → the router's
install → the raw `SKILL.md` URL in `assets/skills-catalog.json`. Names separated by `/` are equivalents.

## 2. Phase → skills and scripts (the "when" column is the decision)

| Phase | Invoke | When |
|---|---|---|
| 0 Brief | `scripts/sources.mjs brief "<idea>"` + `references/BRIEF.md` | Always. The idea alone is enough; complete brief.md yourself. |
| 0 Recon | `superpowers:brainstorming` | Only if the idea is ambiguous about the product itself. Never to ask about UI. |
| 0 Recon | `taste-redesign-skill` / `redesign-existing-projects`, `bencium-design-design-audit` | An existing UI is being redesigned: audit first. If it fails critique, run a full overhaul (FIDELITY.md). |
| 1 Source | `scripts/sources.mjs pick` + `fetch` (Scrapling, automatic) | Always. Never wait for the user to name sites. |
| 1 Source | `design-inspiration-index` | If present, to cross-check the gallery picks for this brief. |
| 1 Source | `browser-use` (official skill from github.com/browser-use/browser-use) | A gallery needs scrolling, filters or clicks that `fetch` cannot do; also to judge feel in QA. |
| 1 Source | `firecrawl-search` / `firecrawl-scrape` | Only when authenticated, as an extra discovery path. |
| 1 Source | `hallmark` | Extracting a design system from a URL or screenshot the user supplied. |
| 2 Select | `<studio>-design` skills: `linear-design`, `okc-design`, `activetheory-design`, `bruno-simon-design`, `revolut-design`, `monzo-design`, `pitch-design`, `brilliant-design`, `copilot-design`, `splitwise-design` | When one matches the lane (§3): its live site joins the 5 references and the skill is read as its deep-dive. Grammar only. |
| 5 Direction | `frontend-design` / `anthropic-frontend-design` | Always. |
| 5 Direction | `ui-ux-pro-max` / `ui-ux-pro-max-ui-ux-pro-max` | Always: its database for the product type's style, palette and landing pattern, as evidence. |
| 5 Direction | `taste-taste-skill` / `design-taste-frontend` | Always: the Design Read and the three dials. |
| 5 Direction | exactly **one lane skill** from §3 | Always. |
| 5 Direction | `scripts/fonts.mjs` + `references/TYPE.md`, then `bencium-design-typography` / `ui-typography` | Always: search 10 libraries, render the specimen, look, choose; then enforce typographic correctness. |
| 5 Direction | `refactoring-ui-01…10` in order, or `refactoring-ui-meta-refactor-ui` | Building or repairing the token system. |
| 5 Direction | `scripts/fidelity.mjs` + `references/FIDELITY.md` | Always: anchor + section map before any code. |
| 6 Compose | `shadcn-components` / `ui-ux-pro-max-ui-styling` (web), the platform's base kit (`references/PLATFORMS.md`) | Always: every control. |
| 6 Compose | `magicui-components`, `acernity-components`, `reactbits-components`, `motion-components` | The 2–3 registries in play. |
| 6 Compose | `scripts/harvest.mjs page|prompt` | A template or prompt has the section the anchor lacks. |
| 7 Build | `frontend-ui-engineering` | Always. |
| 7 Build | `impeccable` / `impeccable-impeccable` | Always: `animate`, `bolder`, `quieter`, `polish`; its detectors after each section. |
| 7 Build | `gsap-skills` | GSAP picked: pinning, scrubbed timelines, SVG, SplitText. Default for marketing pages, with Lenis. |
| 7 Build | `animejs-skills` | Anime.js v4 picked: SVG draw/morph, staggers. |
| 7 Build | `taste-gpt-tasteskill` | GSAP-heavy scroll storytelling. |
| 7 Build | `vercel-composition-patterns`, `vercel-react-best-practices` | React stacks. |
| 7 Build | `vercel-react-view-transitions` | Route transitions inside a React app. |
| 7 Build | `vercel-react-native-skills` / `react-native-expert` | Expo / React Native. |
| 7 Build | `flutter-expert` · `swift-expert` · `kotlin-specialist` | Flutter · SwiftUI · Jetpack Compose. |
| 7 Build | `taste-output-skill` / `full-output-enforcement` | Any long file or multi-file generation. |
| 7 Build | `taste-imagegen-frontend-web` / `-mobile`, then `taste-image-to-code-skill` | An image-generation tool is available and the lane is visual-first. |
| 8 QA | `playwright-skill` / `playwright-expert`, `browser-use` | Always. |
| 9 Critique | `hallmark` (slop test), `impeccable` (`critique`, `audit`), `refactoring-ui-06-eliminate-visual-clutter` | Always, against the rendered page. |
| 9 Critique | `accesslint-accessibility-scan` + `-inspect`, then `-fix`, `-diff` | Always on the main page/screens. |
| 12 Ship | `production-suite-completion` | Always for anything deployed. |
| 12 Ship | `accesslint-accessibility-audit`, `web-design-guidelines`, `vercel-optimize`, `bencium-design-bencium-aeo` | Multi-page sites; final interface audit; Next/Vercel perf; marketing sites for AI search. |
| after | `brag` / `hyperframes` | Offer (do not run) a launch video once shipped. |

## 3. Choosing the one lane skill

Decide by **who buys**, then by tone. Pick the first row that fits; record it in
`state.json -> skills.lane` with the reason.

| Brief signal | Lane skill | Studio skill that may join the references |
|---|---|---|
| Developer or team buyer: dev tool, B2B SaaS, infra, API | `taste-minimalist-skill` / `minimalist-ui` | `linear-design` |
| Consumer finance, banking, payments | `taste-soft-skill` / `high-end-visual-design` | `revolut-design`, `monzo-design` |
| Shared expenses, everyday utility | `taste-soft-skill` | `splitwise-design` |
| Learning, education, interactive explainers | `taste-soft-skill` | `brilliant-design` |
| AI assistant, chat-first product | `taste-minimalist-skill` | `copilot-design` |
| Presentations, docs, collaborative creation | `taste-minimalist-skill` | `pitch-design` |
| Other consumer/prosumer product, "feels expensive" | `taste-soft-skill` / `high-end-visual-design` | `okc-design` |
| Immersive, WebGL-first, studio showcase | `bencium-design-bencium-impact-designer` | `activetheory-design` |
| Playful, 3D, game-like | `bencium-design-bencium-innovative-ux-designer` | `bruno-simon-design` |
| Data-dense, terminal, Swiss/brutal editorial | `taste-brutalist-skill` / `industrial-brutalist-ui` | — |
| Campaign or launch where originality is the brief | `bencium-design-bencium-innovative-ux-designer` | — |
| Enterprise, regulated, WCAG-first | `bencium-design-bencium-controlled-ux-designer` | — |
| Story-led scroll page | `taste-gpt-tasteskill` | `okc-design` |
| Brand identity is part of the job | `taste-brandkit` / `brandkit`, `ui-ux-pro-max-brand` | — |

## 4. Where each piece comes from

`assets/sources.json` is the ranked catalog: **8 categories, 50+ sources each**
(references, animated components, components/kits, design rules, typography, motion libraries,
templates and prompts, assets). `references/SOURCES-CATALOG.md` is its readable form;
`sources.mjs list <category> --platform mobile` filters it. `sources.mjs pick` chooses from it for the
brief. Pull in this order; stop at the first source that ships it.

| Piece | First choice | Then | Last resort |
|---|---|---|---|
| Controls | the platform's base kit (`PLATFORMS.md`): shadcn/ui on React web | Radix / Base UI / React Aria | never hand-rolled |
| Sections | the plan's block (`BLOCK-MAP.md`), the anchor's section rebuilt | `harvest.mjs` from a picked template; Shadcnblocks, Magic UI, Aceternity, 21st.dev | custom, with a reason |
| Animated pieces | the top `animated` picks for this platform | the rest of the `animated` category | custom |
| Choreography, reveals, glass, curtain, cursor, shader bg | `references/CRAFT.md` | Codrops, GSAP demos | — |
| Motion engine | Motion (React UI), GSAP + ScrollTrigger + Lenis (marketing scroll), Reanimated (RN), platform APIs (native) | Anime.js v4 | — |
| Fonts | `fonts.mjs` across 10 free libraries | the brand's licensed faces | never a reflex default |
| Icons, illustration, colour | the `assets` picks; one icon set | — | never emoji |
| Library API questions | Context7 | the library's docs | memory (never for versioned APIs) |

## 5. How to fetch

1. **`sources.mjs fetch`** — always first, automatic. It drives the Scrapling CLI with automatic
   get → fetch → stealthy-fetch escalation, repairs missing Scrapling/Patchright browsers once by
   itself, saves pages to `.beyond-ui/sources/` and reference images to `.beyond-ui/refs/`.
2. **Scrapling MCP tools** for follow-ups: `mcp__scrapling__make_request` → `fetch` →
   `stealthy_fetch`, `css_selector` for the cards you need, `bulk_*` for many URLs, `screenshot` for a
   visual of one page.
3. **Agent-native endpoints**: 21st.dev `.md` twins and `llms.txt`, shadcn registry JSON,
   motionsites.ai MCP, GitHub raw files.
4. **browser-use** for galleries that need interaction; **Firecrawl** when authenticated.
5. **Web search** for discovery: `site:awwwards.com <category>`, `site:dribbble.com <surface>`,
   `site:mobbin.com <app type>`.
6. **Real browser capture** for computed truth (`capture-site.mjs`, `harvest.mjs page`).

Never: execute code downloaded from a gallery, ship a reference's assets, copy, or imagery, scrape
behind a login, or accept terms on the user's behalf.

## 6. Prompt and template sourcing

1. `sources.mjs pick` already chose the templates category for this archetype (Motion Sites, 21st.dev,
   v0, Aura, Stitch, Relume…), and `fetch` saved them with their preview images.
2. Look at the template images; for each section the anchor lacks, harvest **only that section**:
   `harvest.mjs page <template-url> --pick pricing,faq` or `harvest.mjs prompt <prompt-url> --pick hero`.
3. Rebuild the harvested section in the anchor's system with the project's components; cite it in
   `fidelity.json` as `template:<harvest id>`.
4. Rewrite all content for this product; never paste a template's copy, metrics or testimonials.

## 7. Decisions when nothing is specified

The skill never stops to ask about these; it decides and records the decision.

| Unspecified | Decision |
|---|---|
| Platform and stack | The repo's (`sources.mjs detect`). Empty repo: the table in `PLATFORMS.md` (web → Next.js + Tailwind v4 + shadcn + Motion + GSAP + Lenis; mobile → Expo + NativeWind + RN Reusables + Reanimated). Scaffold before the bootstrap. |
| Theme, palette | No default. The user's request or project decides; if silent, the anchor reference does. |
| Fonts | `fonts.mjs` — matched to the anchor's classification, chosen from the specimen. |
| Motion level | Marketing: GSAP + ScrollTrigger + Lenis + registry animated components + CRAFT R1/R2/R6/R8. App UI: Motion micro-interactions, animated charts, layout transitions. Native: platform springs. |
| Content | From the brief's domain inventory; specific, no invented metrics or logos; labelled gaps where proof is missing. |
| Viewports / devices | Web: design 390 / 768 / 1440, test 320–1920. Mobile: small and large phone, tablet if supported. |
| Deploy | Production pass anyway; deploying or submitting to stores only when the user asks. |

Ask the user only for what cannot be inferred and would be wrong to invent: real customers and numbers,
brand assets that exist somewhere, or a hard constraint that contradicts the brief.
