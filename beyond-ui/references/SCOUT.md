# Scout — the source universe and the protocol

Scouting is not "looking at pretty websites". It is evidence collection: find what already solves
this exact problem, name it, extract the structure, and map every element you will build to
something that already ships it.

**Timebox:** scout is 15–25% of the total UI task. On a landing page that is real work — 6–10
references studied, not skimmed.

## Protocol

### 1. Frame the search (5 lines, written down)

```
domain:      <what the product is, in the user's words>
audience:    <who uses it, and how technical they are>
aesthetic:   <3–5 keywords: e.g. editorial, brutalist, warm-paper, dense, kinetic>
constraints: <stack, brand colours if any, existing type, dark mode, i18n, a11y target>
budget:      <bundle/performance limits, "no WebGL", etc.>
```

Everything the scout returns is filtered by these lines. Without them, scouting degenerates into
collecting 30 beautiful sites that have nothing to do with the product.

### 2. Cast a wide net — inspiration galleries

Open `references/INSPIRATION.md`. Select **4–8 different sources**, deliberately mixing: an
award gallery (awwwards / Awwwards animation collection / FWA / CSS Design Awards), a curated
directory (recent.design / land-book / siteinspire / minimal.gallery / Refero), a motion showcase
(motionsites.ai, codrops, hoverstat.es), and a product-specific one (Mobbin for app flows,
SaaSpo for SaaS marketing, Land-book for landing pages, 21st.dev / threejsresources for
technique-level component work).

**Prefer sources with agent surfaces** where they exist (`references/INSPIRATION.md` →
*Machine-readable scouting*): `.md` twins, `llms.txt`, MCP endpoints and OpenAPI return components and
catalogues as text instead of screenshots — less guessing, faster extraction. Award sites give you
outbound `?ref=` links to the real production sites; fetch those for actual HTML/CSS/motion.

Search by the aesthetic keywords **and** by domain. Collect **6–12 concrete references** and, for
each, extract structure (not pixels): how the hero is composed, how sections alternate density, how
the nav behaves on scroll, how the CTA recurs, how one distinctive moment is built.

Record per reference: URL · what specifically is being taken · the technique observed · what is
deliberately *not* taken (a whole-site clone is plagiarism; a section grammar is craft).

### 3. Harvest structure — prompt and template sources

Open `references/PROMPTS.md`. Pull **3–5 prompts** matching the surface being built (landing page,
pricing, dashboard, onboarding, portfolio, docs page). Prompts are valuable because they encode
section order and content shape. Treat them as *structure input*, never as content: rewrite every
line for this product, keep the skeleton, discard the adjectives.

Also check template libraries (Tailwind UI/Cruip/HyperUI/Flowbite blocks, Framer/Webflow templates)
for the section inventory: hero variants, feature grids, testimonial shapes, pricing tables, footers.
Copy structure and spacing rhythm; never copy copy, logos, or assets.

### 4. Map to libraries — do not plan to build anything that exists

Open `references/COMPONENTS.md` (animated registries + install commands) and `references/LIBRARIES.md`
(technologies). For each element the design needs, write the mapping:

| Element | Library / registry | Exact consume step |
|---|---|---|
| e.g. marquee logo wall | Magic UI `marquee` | `npx shadcn@latest add @magicui/marquee` |
| e.g. hero background | shadergradient | `npm i @shadergradient/react` + params from shadergradient.co |
| e.g. number counters | NumberFlow | `npm i @number-flow/react` |
| e.g. page transitions | View Transitions + `next-view-transitions` | `npm i next-view-transitions` |
| e.g. buttons/inputs/dialogs | shadcn/ui | `npx shadcn@latest add button dialog input` |

**Rule:** if ≥ 70% of the elements on the page are hand-written, the scout was not done. Every
"we'll just build it" must be justified by a real reason (licence, bundle, incompatibility, taste).

### 5. Check compatibility before committing

For every library chosen: Tailwind version, `motion` vs `framer-motion` peer, React version, RSC
compatibility, bundle weight, licence, and whether it is actively maintained. A registry component
written for Tailwind v3 in a v4 project will silently lose styling — verify before installing.

### 6. Write the artefact

`.beyond-ui/scout.md` (template: `assets/scout-template.md`):

```markdown
# Scout — <surface> — <date>
## Frame        (the 5 lines)
## Direction    (the aesthetic name + the 3 references it derives from)
## References   (6–12 entries: URL | taken | technique | not taken)
## Prompts      (3–5 entries: source URL | structure adopted | content rewritten how)
## Library map  (element → library → exact command)
## Rejected     (candidates seen and why they do not fit)
## Risks        (compat/perf/licence concerns and the mitigation)
```

`Rejected` is not optional. It proves the scout was real and prevents re-litigating the direction
mid-build.

## Source universe

| Catalogue | File | Size |
|---|---|---|
| Award galleries, curated directories, motion showcases, technique archives | `references/INSPIRATION.md` | 60+ sources |
| Template/prompt libraries and block marketplaces | `references/PROMPTS.md` | 55+ sources |
| Animated component registries with install commands | `references/COMPONENTS.md` | 40+ registries |
| Animation/3D/effect/SVG/asset libraries | `references/LIBRARIES.md` · `references/EFFECTS.md` | 45+ libraries |
| Upstream design skills to follow and defer to | `references/SKILLS.md` | 12+ skills |

## Scout quality bar

- A reference you cannot name the technique from is not a reference — look at it properly or drop it.
- Minimum 6 references on any page-level task; 3 on a single component.
- Every library in the map has a verified install fact (it exists, it works on this stack).
- The direction in `scout.md` is specific enough that two agents would produce *similar* pages.
- If nothing in the universe fits, say so explicitly and state what makes this surface genuinely
  novel — that claim needs its own justification, and it is rare.

## Anti-patterns

- Scrolling a gallery and writing the first idea that comes to mind (that idea is the model's prior,
  i.e. slop).
- Copying one site's whole layout. Steal grammar; compose your own.
- Collecting 30 references and using none — the library map is the deliverable, not the bookmark list.
- Scouting the aesthetic but not the *content shape*: award sites win on structure and copy as much
  as on visuals.
- Ignoring the prompt sources because "they are just marketing copy" — they encode section order,
  which is the hardest part to get right.
