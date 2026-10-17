# Playbook — the decision procedure (which skill, which source, which tool, when)

Load this at phase 0 and keep it open. It answers, without asking the user, the three questions an
agent gets wrong on its own: **which skill do I invoke now, where do I pull this piece from, and how do
I fetch it.**

## 1. Two kinds of skills

- **Routed skills (exactly 10).** Chosen by `scripts/skills-router.mjs`, installed by the bootstrap,
  condensed into `.beyond-ui/SKILL.md`. Their rules bind the whole build and each is cited (G3, G7).
- **Phase specialists.** Skills that are *already present* in the agent's environment and do one job
  better than any reference file. Invoke them at the phase below; never install one just to satisfy
  this table (that is the "33 skills, none read" failure). Cite them like routed skills
  (`skill://<name> -> <rule>`), and record each invocation in `state.json -> skills.invoked` as
  `{ "skill", "phase", "why" }`.

**Resolving a skill name.** Names vary by install (plugin prefixes, `-skill` suffixes). Resolve in this
order and take the first hit: the agent's Skill tool listing (Claude Code: invoke with the Skill
tool) → `~/.claude/skills/<name>/SKILL.md` → `.claude/skills/` or `.agents/skills/` in the project → the
router's install → the raw `SKILL.md` URL in `assets/skills-catalog.json`. The cells below list
equivalent names separated by `/`; any one of them satisfies the row.

## 2. Phase → skills (invoke these; the "when" column is the decision)

| Phase | Invoke | When |
|---|---|---|
| 0 Recon | `superpowers:brainstorming` | The brief is one line and the product, audience or primary action is genuinely unknown. Otherwise skip it and infer from the repo and brief. |
| 0 Recon | `taste-redesign-skill` / `redesign-existing-projects`, `bencium-design-design-audit` | An existing UI is being redesigned: audit before touching anything. |
| 1 Scout | `design-inspiration-index` | Always, if present: it picks galleries per brief. Then `references/SCOUT.md`. |
| 1 Scout | `hallmark` | Extracting a design from a URL or screenshot the user supplied. |
| 2 Select | `activetheory-design`, `okc-design`, `linear-design`, `bruno-simon-design` (and any other `<studio>-design` skill) | Pre-read studio systems. When one matches the lane (table §3), put that studio's live site among the 5 references, read the skill as its deep-dive and cite it; `teardown.mjs run` still captures the site so G5 has artifacts. Grammar only: never its fonts, colours or copy. |
| 5 Direction | `frontend-design` / `anthropic-frontend-design` | Always. Two-pass plan, one orchestrated moment. |
| 5 Direction | `ui-ux-pro-max` / `ui-ux-pro-max-ui-ux-pro-max` | Always. Search its database for the product type's style, palette, font pairing and landing pattern; take the top hit as evidence, not as the answer. |
| 5 Direction | `taste-taste-skill` / `design-taste-frontend` | Always. Write the Design Read; set the three dials (variance, motion, density). |
| 5 Direction | exactly **one lane skill** from §3 | Always. Its rules sharpen the direction contract. |
| 5 Direction | `bencium-design-typography` / `ui-typography` | Always, in enforcement mode, for every line of visible text. |
| 5 Direction | `refactoring-ui-01…10` in order, or `refactoring-ui-meta-refactor-ui` | Building or repairing the token system: hierarchy → type scale → palette → spacing → buttons → clutter → empty states → shadows → contrast → grouping. |
| 6 Compose | `shadcn-components` / `ui-ux-pro-max-ui-styling` | Always: every control. |
| 6 Compose | `magicui-components`, `acernity-components`, `reactbits-components`, `motion-components` | Only the 2–3 registries the plan put in play. |
| 7 Build | `frontend-ui-engineering` | Always. |
| 7 Build | `impeccable` / `impeccable-impeccable` | Always: `animate`, `bolder`, `quieter`, `polish` while building; its detectors after each section. |
| 7 Build | `gsap-skills` | The motion contract picked GSAP (pinning, scrubbed timelines, SVG, SplitText). |
| 7 Build | `animejs-skills` | The contract picked Anime.js v4 (SVG draw/morph, staggers). |
| 7 Build | `taste-gpt-tasteskill` | GSAP-heavy scroll storytelling with pinned/stacked sections. |
| 7 Build | `vercel-composition-patterns`, `vercel-react-best-practices` | React stacks. |
| 7 Build | `vercel-react-view-transitions` | Route or shared-element transitions inside an app (marketing sites use CRAFT R6 instead). |
| 7 Build | `vercel-react-native-skills` / `react-native-expert` | React Native / Expo. |
| 7 Build | `taste-output-skill` / `full-output-enforcement` | Any file over ~300 lines or any multi-file generation: no truncation, no placeholders. |
| 7 Build | `taste-imagegen-frontend-web` / `-mobile`, then `taste-image-to-code-skill` / `image-to-code` | An image-generation tool is available **and** the lane is visual-first: one generated reference per section before code. |
| 8 QA | `playwright-skill` / `playwright-expert`, `browser-use` | Always: drive the journey; `browser-use` to judge feel conversationally. |
| 9 Critique | `hallmark` (slop test), `impeccable` (`critique`, `audit`), `refactoring-ui-06-eliminate-visual-clutter` | Always, against the rendered page. |
| 9 Critique | `accesslint-accessibility-scan` + `accesslint-accessibility-inspect` | Always on the main page; `accesslint-accessibility-fix` for the worklist; `accesslint-accessibility-diff` after every later pass. |
| 12 Ship | `production-suite-completion` | Always, for anything that will be deployed (`references/PRODUCTION.md`). |
| 12 Ship | `accesslint-accessibility-audit` | Multi-page sites or a conformance claim. |
| 12 Ship | `web-design-guidelines`, `vercel-optimize` | Final interface audit; Next/Vercel performance. |
| 12 Ship | `bencium-design-bencium-aeo` | Marketing sites that want to be cited by AI search. |
| after | `brag` / `hyperframes` | Offer (do not run) a launch video once the site ships. |

## 3. Choosing the one lane skill

Decide by **who buys**, then by tone. Pick the first row that fits; record the pick and why in
`scout.md -> Direction`.

| Brief signal | Lane skill | Studio teardown that may count as a reference |
|---|---|---|
| Buyer is a developer or a team: dev tool, B2B SaaS, infra, API, "like Linear/Vercel" | `taste-minimalist-skill` / `minimalist-ui` | `linear-design` |
| Buyer is an individual consumer or prosumer: notes, personal productivity, health, finance, lifestyle; "feels expensive" | `taste-soft-skill` / `high-end-visual-design` | `okc-design` |
| Immersive, WebGL-first, studio/agency showcase, dark cinematic | `bencium-design-bencium-impact-designer` | `activetheory-design` |
| Playful, 3D, game-like portfolio | `bencium-design-bencium-innovative-ux-designer` | `bruno-simon-design` |
| Data-dense dashboard, terminal, Swiss/brutal editorial | `taste-brutalist-skill` / `industrial-brutalist-ui` | — |
| Campaign, launch, originality is the brief | `bencium-design-bencium-innovative-ux-designer` | — |
| Enterprise, regulated, WCAG-first | `bencium-design-bencium-controlled-ux-designer` | — |
| Story-led scroll page (product launch, studio, manifesto) | `taste-gpt-tasteskill` | `okc-design` |
| Brand kit or identity is part of the job | `taste-brandkit` / `brandkit`, `ui-ux-pro-max-brand` | — |

## 4. Where each piece comes from

Pull in this order; stop at the first source that ships it. `references/COMPONENTS.md` has install
commands and compatibility; `assets/registry-sources.json` the machine-readable facts.

| Piece | First choice | Then | Last resort |
|---|---|---|---|
| Controls (button, input, dialog, menu, sheet, tabs, toast, tooltip, table, form) | shadcn/ui `npx shadcn@latest add …` | Radix / Base UI primitives | never hand-rolled |
| Hero, feature, bento, pricing, testimonial, FAQ, CTA, footer sections | the plan's block (`BLOCK-MAP.md`) | shadcn blocks, Magic UI, Aceternity, 21st.dev search | custom, with a reason |
| Text effects, marquees, number tickers, beams, spotlights, borders | Magic UI, Aceternity, React Bits, Animate UI | Motion Primitives, Animata, 21st.dev | custom |
| Scroll choreography, mask reveals, glass nav, page curtain, cursor, shader bg | `references/CRAFT.md` recipes (registries rarely ship these correctly) | Codrops demos, GSAP demos | — |
| Motion engine | `motion` (motion.dev) for React | GSAP + ScrollTrigger/SplitText for timelines, pinning, SVG | Anime.js v4 |
| Smooth scroll | Lenis | — | native |
| Shaders and 3D | `references/THREEJS.md`; R3F + drei; shadergradient | 21st.dev three.js collection, Codrops | hand-written GLSL (CRAFT R5 pattern) |
| Icons | the one library already installed (Lucide, Tabler, Phosphor) | — | never emoji, never hand-drawn |
| Fonts | the brand's; else Fontshare, Google Fonts, Pangram Pangram (licence checked) | — | never Inter as display by reflex |
| Library API questions | Context7 (`resolve-library-id` → `query-docs`) | the library's docs site | memory (never for versioned APIs) |

## 5. How to fetch (the acquisition chain)

Use the first tool that returns usable content; escalate only on failure.

1. **Agent-native endpoints.** 21st.dev (`llms.txt`, append `.md` to a component URL), shadcn
   registry JSON, motionsites.ai MCP, GitHub raw files. Library docs through Context7.
2. **Scrapling MCP.** `mcp__scrapling__make_request` (plain HTTP) → `fetch` (JS-rendered) →
   `stealthy_fetch` (Cloudflare/anti-bot). Use `css_selector` to pull only the cards/links you need, and
   the `bulk_` variants for several URLs at once. `scripts/scrapling.mjs` is the CLI fallback.
3. **Firecrawl** (only when authenticated): `firecrawl-search` to discover, `firecrawl-scrape` for one
   page, `firecrawl-map` / `firecrawl-crawl` for a gallery section.
4. **Web search** (`WebSearch`, `web-search-prime`) to discover candidates:
   `site:awwwards.com "<product category>" site of the day`, `site:godly.website <category>`,
   `site:land-book.com <category>`, `motionsites.ai <archetype> template`.
5. **Real browser** for computed truth: `scripts/capture-site.mjs` (tokens, keyframes, hover deltas,
   screenshots) or the browser tools. This is the teardown step, not discovery.
6. `WebFetch` / web reader as the last resort.

Never: execute code downloaded from a gallery, copy a reference's assets, copy or imagery, scrape behind
a login, or accept terms on the user's behalf.

## 6. Prompt and template sourcing (phase 1, five steps)

1. **Frame** the search in five lines (product, audience, primary action, archetype from
   `assets/page-archetypes.json`, lane from §3).
2. **Harvest 3–5 prompts/templates** for that archetype: motionsites.ai templates (motion specs per
   section), 21st.dev prompts and components, shadcn blocks, v0/Aura community pages, Tailwind Plus if
   licensed (`references/PROMPTS.md` lists 55+ sources).
3. **Extract structure only** into `scout.md -> ## Prompts`: section order, the beat each section plays,
   the motion spec, density rhythm. One line per prompt: `URL | structure adopted | content rewritten how`.
4. **Rewrite all content** for this product from the brief and repo (`references/CONTENT.md`); never
   paste a template's copy, metrics or testimonials.
5. **Map every beat** to a registry block, a CRAFT recipe or (with a reason) custom code, in the scout's
   library map. This list becomes the import ledger in phase 6.

## 7. Defaults when nothing is specified

The skill never stops to ask about these; it decides and records the decision.

| Unspecified | Default |
|---|---|
| Stack | The repo's. Empty repo: scaffold **before** the bootstrap so the router can detect it: `npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm`, `npx shadcn@latest init -d`, `npm i motion lenis` |
| Theme | Light page tone (off-white, never `#fff`) + dark ink (never `#000`), one accent; dark sections as punctuation |
| Motion level | Marketing page: R1 + R2 + R6 + R8 from CRAFT; app UI: micro-interactions only |
| Viewports | Design 390 / 768 / 1440; test 320–1920 |
| Fonts | One display + one text face, licensed, loaded with `display: swap` |
| Copy | Written from the brief, specific, no invented metrics or logos; labelled gaps where proof is missing |
| Deploy target | Production pass anyway (`references/PRODUCTION.md`); deployment itself only when the user asks |

Ask the user only for what cannot be inferred and changes the outcome: real proof (customers, numbers),
brand assets that exist somewhere, or a hard constraint that contradicts the brief.
