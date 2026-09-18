# Prompt & template sources (55+)

Template prompts matter because they encode **section order and content shape** — the part of a page
that is hardest to get right and most obvious when it is wrong. Take the skeleton; rewrite every word.

Rules for using this file:

1. **Structure in, identity out.** Adopt the section order, the density rhythm, the component
   inventory. Never adopt the copy, logos, imagery, or a whole visual identity.
2. **Prompts are inputs, not outputs.** An LLM-generated prompt from a generator site describes a
   *generic* page ("modern SaaS landing with hero, features, testimonials"). Use it to check your
   section inventory, then make each section specific to the product.
3. **Licence check per source** (column below). Paid blocks may be studied but not shipped unlicensed.
4. **Cross-check with the prompt-quality rules** in `references/CONTENT.md` before writing copy.

Legend: **F** free · **P** paid/paid-tier · **M** mixed · **⚠** do not ship its output unmodified.

## Prompt generators & prompt libraries

| Source | URL | Artefact | | Notes |
|---|---|---|---|---|
| Templatemo AI Website Prompt Generator | templatemo.com/ai-website-prompt-generator | Full-site prompt from a few inputs | F | Fast starting inventory; rewrite everything |
| Prompt Template (Webflow) | prompt-template.webflow.io | Website prompt templates | F | Section-level prompts in ready-to-paste form |
| v0 by Vercel | v0.app (formerly v0.dev) | Generative UI from a prompt; React + Tailwind + shadcn output | M | Best generative starting point; use it as a *drafting* tool, then apply Beyond UI critique |
| Anthropic prompt library | docs.anthropic.com (prompt library) | Structured prompt patterns | F | Useful for generating section inventories systematically |
| Prompt Engineering Guide (DAIR) | github.com/dair-ai/Prompt-Engineering-Guide | Prompting technique reference | F | Improve how you brief yourself |
| Anthropic prompt-eng tutorial | github.com/anthropics/prompt-eng-interactive-tutorial | Structured prompting course | F | |
| Awesome ChatGPT Prompts | github.com/f/awesome-chatgpt-prompts | Community prompt collection | F | Generic; mine for structure only |
| Awesome Claude Prompts | github.com/langgptai/awesome-claude-prompts | Claude-specific prompt set | F | |
| PromptBase | promptbase.com | Marketplace of prompts | P | Check licence per prompt |
| Snack Prompt | snackprompt.com | Community prompt sharing | F | Quality varies widely |
| 21st.dev prompts | 21st.dev | Prompts + components in one marketplace | M | Pair the prompt with the immediate component install |
| Vibe-coding prompt packs (search GitHub: "cursorrules", "agents.md", "vibe coding prompts") | github.com | Repo-level rule/prompt collections | F | Best used to *constrain* generation, not to source designs |
| Lovable / Bolt prompt galleries | lovable.dev, bolt.new (community showcases) | Full-app prompts and outcomes | M | Study what people ask for, and how it usually looks generic |
| "Awesome-*" design prompt lists | github.com topics: `agent-skills`, `claude-skills`, `prompt-library` | Curated collections | F | Check stars/recency before trusting |

## Block & section libraries (structure to steal, legally)

| Source | URL | Artefact | | Notes |
|---|---|---|---|---|
| Tailwind Plus (Tailwind UI) | tailwindui.com | Production-grade sections + full templates | P | The craft benchmark; licence permits use in your products |
| shadcnblocks | shadcnblocks.com | shadcn section blocks (hero, features, pricing, footer, dashboards) | M | Registry-installable; per-block licence |
| Tailark | tailark.com | Marketing blocks (hero, features, pricing, FAQ, CTA) | F | shadcn-native |
| HyperUI | hyperui.dev | Free Tailwind components by category | F | Structure reference without React |
| Meraki UI | merakiui.com | Tailwind + RTL components | F | Good for RTL/multilingual scouting |
| Flowbite Blocks | flowbite.com/blocks | Large block library (marketing + app) | M | React/HTML variants |
| Preline UI | preline.co | 1,612 free Tailwind components + Pro blocks; ships its own **agent skills** (`npx skills add htmlstreamofficial/preline`), MCP server and per-block AI prompts | M | Best-in-class for non-React stacks; Pro blocks are paid |
| MotionSites templates | motionsites.ai/templates | ~38 full-site AI-ready templates (remixable, GitHub code) + MCP server + academy prompts | M | Study the prompt structure; free tier only |
| DaisyUI | daisyui.com | Component classes + themes | F | Fast prototype layer |
| Float UI | floatui.com | Tailwind sections and components | F | |
| Tailwind Components | tailwindcomponents.com | Community components | F | Quality varies; verify a11y |
| Tailwind Templates / Tailwind Awesome | tailwindtemplates.io, tailwindawesome.com | Template indexes | M | |
| Cruip | cruip.com | Polished landing templates (HTML/React/Next/Vue) | M | Great section rhythm to study |
| Creative Tim | creative-tim.com | Admin + marketing kits | M | |
| Mamba UI / Headless UI patterns | mambaui.com | Tailwind sections | F | |
| Untitled UI | untitledui.com (React port at untitledui.com/react) | Huge Figma design system + components | M | Excellent type/spacing reference; alternative when a project is not on shadcn |
| v0 templates + prompting docs | v0.app/templates, v0.app/docs/text-prompting | Community chats per role + official prompting guidance | F | The prompting docs teach structure; drafts must still pass `references/CRITIQUE.md` |
| Preline agent skills | `npx skills add htmlstreamofficial/preline` | An upstream skill for Tailwind blocks + per-block AI prompts | F | Usable without installing the component library |
| MotionSites MCP | motionsites.ai/mcp | Prompt templates served to agents over MCP | M | Prompt structure only; templates are MotionSites property |
| Untitled UI React | untitledui.com/react | React port of the above (Tailwind + Aria) | M | Useful when a project is not on shadcn |
| Framer templates | framer.com/templates | Complete modern marketing sites (motion included) | M | Best source for *current* marketing conventions |
| Framer marketplace | framer.com/marketplace | Components/plugins | M | |
| Webflow templates | webflow.com/templates | Full site structures by industry | M | Study information architecture |
| Webflow Made in Webflow | webflow.com/made-in-webflow | Live community sites + cloneables | F | Clonable structure; never ship cloneable content |
| Wix / Squarespace / Tilda templates | wix.com/templates, tilda.cc/templates | Industry-specific site structures | M | Useful for non-tech verticals (restaurants, clinics, portfolios) |
| Relume | relume.io | Sitemap + wireframe builder, component library | M | The best tool for *planning* a marketing site's section order |
| Landingfolio / Landingfolio Inspirations | landingfolio.com | Landing examples + sections | F | |
| ThemeForest / TemplateMonster | themeforest.net | Commercial templates for every vertical | P | Structure study; quality varies enormously |
| Framer University / free Framer sections | (community) | Section libraries | M | |
| Figma Community design systems | figma.com/community | Full systems: tokens, components, patterns | F | Best for token/scale study ★ |
| Untitled/Refactoring-UI-inspired kits | figma.com/community | UI kits implementing proven heuristics | F | |
| Shadcn-based Figma kits | figma.com/community | shadcn/ui files, tokens matched | F | Keeps design and code in sync ★ |
| Component gallery (component.gallery) | component.gallery | The component taxonomy itself | F | Use it to make sure you did not forget a state or control ★ |
| Mobbin/Mobbin flows (also a prompt-ish structure source) | mobbin.com | Real flows = required sections | M | Derive the section list from real products |
| AI website builders' prompt galleries (Durable, 10Web, Hostinger AI, Wegic) | various | Industry-specific prompt starters | M | Good vertical vocabulary, poor design quality ⚠ |
| Copy.ai / Jasper template galleries | copy.ai | Marketing copy structures | M | Copy frameworks (PAS, AIDA) — structure for text ⚠ |
| Landing page prompt collections (search: "landing page prompt", "website prompt template") | web | Prompt sets for hero/feature/pricing | F | Treat as checklists, not as designs |

## Using prompts correctly (procedure)

1. Pick **3–5** prompts matching the surface: one full-site, one hero, one pricing/CTA, one
   app-screen, one section you find hard.
2. Diff them: what sections appear in **all** of them is probably structurally required; what appears
   in one is probably noise for this product.
3. Write your own final section list, ordered by the reader's questions (what is this → is it for me →
   can I trust it → what does it cost → how do I start), not by the template's order.
4. Now write the copy from the product's own language (`references/CONTENT.md`), never from the prompt.
5. Record in `.beyond-ui/scout.md` → *Prompts*: source URL, structure adopted, how content was written.

## Anti-patterns

- Pasting a generator prompt into an agent and shipping the output: that is the slop factory this skill
  exists to replace.
- Copying a paid template's copy text or assets — a licence violation and instantly recognisable.
- Adopting a template's *identity* (its type, palette, motion) along with its structure.
- Treating a prompt's section list as complete: most omit proof, objections, security, and states.
- Skipping the prompt step because "we already know what a landing page needs" — that assumption is
  exactly where generic output comes from.
