# Inspiration sources (50+)

How to use this file: pick **4–8 sources across different categories** (award gallery + curated
directory + motion showcase + product-specific), search using the frame from `references/SCOUT.md`,
and extract *structure*. Record what you took in `.beyond-ui/scout.md`.

Legend: **★** = especially machine-readable / high signal for an agent · **⚠** = study only, never
copy assets or copy text (licence or plagiarism risk).

## Galleries & directories — the quality ceiling (60+ sources)

| Source | URL | What it gives | Scout method |
|---|---|---|---|
| Awwwards | awwwards.com | The industry quality bar; daily winners across sites/apps/motion | Browse `/websites/` + technology tags (`/websites/three-js/`, `/websites/animation/`) |
| Awwwards Animation collection | awwwards.com/awwwards/collections/animation/ | 243 curated UI-animation & micro-interaction clips, each linking its source site | Read the collection, note the motion grammar per site |
| Awwwards Elements | awwwards.com/elements/ | Isolated UI elements judged alone: preloader, scroll, footer, 3D interaction | Best when only one component is in scope |
| CSS Design Awards | cssdesignawards.com | Independent jury with per-criterion scores (UI/UX/innovation) | Winners list `/wotd-award-winners`; per-site pages link the live site |
| FWA | thefwa.com | Cutting-edge/interactive, often WebGL | Daily showcase; expect heavy experiments |
| SiteInspire | siteinspire.com | Curated, strong typographic and layout judgement | `/websites/category/<category>` (typographic, minimal, grid-layout, unusual-layout) |
| Land-book | land-book.com | Landing-page-specific, filterable by industry/style/colour/type | Fetch returns markdown; `/design/landing-page`, `?sort=` |
| Recent (formerly Godly) | recent.design | Award-grade showcase + isolated components, video-first | Item pages `/i/<id>-<slug>`; categories Web/Interface/Motion/3D |
| Minimal Gallery | minimal.gallery | Restraint, whitespace, editorial discipline | Tag URLs `minimal.gallery/tag/<tag>/` |
| Httpster | httpster.net | Independently curated, art-directed/quirky editorial sites | Static HTML list; entries link out with `?ref=` |
| Hoverstat.es | hoverstat.es | Interaction-design focused: how things respond | Study hover/scroll/state behaviour; RSS available |
| One Page Love | onepagelove.com | Single-page structures done well | `/genre/<portfolio\|landing-page\|app\|product>`; fetch returns markdown |
| Lapa Ninja | **lapa.ninja** (not lapaninja.com) | 7,300+ landing-page designs + 15,000 screenshots | Cloudflare-protected: use search-indexed pages |
| Refero | refero.design | Real product UI screenshots by screen and flow | Fetchable shell; search by product/pattern in-app |
| Mobbin | mobbin.com | 500k+ real screens/flows (mobile + web + sites) | Agent-first: `/llms.txt`, MCP at `api.mobbin.com/mcp`, `/explore/<surface>` |
| SaaSpo | saaspo.com | 1,400+ SaaS landing pages + section library | `/sections`, `/style/<style>` |
| ScreensDesign | screensdesign.com | 2,700 top-grossing iOS apps: flows, paywalls, onboarding, revenue signals + MCP | Absorbed scrnshts.club, designvault.io, uisources.com — scout here |
| Page Flows | **pageflows.com** (not page-flows.com) | 100k+ recorded real-user flows with annotations | `/ios/`, `/android/`, `/web/`, `/emails/` |
| Nicelydone | nicelydone.club | 204k+ real SaaS screenshots from 500+ apps, searchable by text *inside* the screenshots | Fetch returns markdown; text-in-screenshot search is the killer query |
| Pttrns | pttrns.com | 7,000+ curated mobile design patterns by screen/flow (free) | Browse pattern categories |
| Collect UI | collectui.com | Daily curated UI shots + network directory | Homepage feed |
| Dark Design | dark.design | Dark-mode-first designs, curated | Best reference for dark themes done well |
| Dark Mode Design | darkmodedesign.com | Another dark-mode showcase | Single-page HTML, easy to parse |
| Designspells | designspells.com | Micro-interactions and delightful details | Where the "ownable moment" comes from |
| Navbar Gallery | navbar.gallery | 550+ navbars tagged by type (dropdown, megamenu, search, sidebar, tabs) | Per-entry page `/navbar/<slug>` |
| Footer.design | footer.design | Footer patterns | `/sites/<slug>` entries |
| Hero Gallery | hero.gallery | Hero catalog with editorial teardowns (layout, copy, CTA, tone, colour, tech) | Content-negotiation returns the whole annotated catalog as text |
| Curated.design | curated.design | Curated general gallery | RSS at `/rss.xml` |
| Really Good Designs | reallygooddesigns.com | Trend roundups and themed example collections | `/inspiration/<topic>` |
| Savee | savee.com | Designer-curated reference stream (typography, photography, tech) | `/inspiration/` stream; `/mcp/` endpoint |
| Cosmos | cosmos.so | Community visual clusters/moodboards | Discover feed |
| Muzli / Search by Muzli | muz.li, search.muz.li | Daily curated feed + cross-source design search with colour search | `search.muz.li` for keyword/pattern lookup |
| Case Study Club | casestudy.club | Teardowns of real product case studies | `/issues/<NNN>/` |
| Codrops | tympanus.net/codrops | Technique tutorials + demo source + Webzibition (2,000+ sites) | `/codrops/category/tutorials/`; demos under `tympanus.net/Development/` |
| Made in Webflow | webflow.com/made-in-webflow | Community showcase with **cloneable** sites and interaction collections | `/made-in-webflow/animation/popular`; "Cloneable sites only" filter |
| Behance | behance.net | Case studies with process | Read the thinking, not the render |
| Dribbble | dribbble.com | Concept shots, UI exploration, trends | `dribbble.com/search/<term>` — mockups, not shipped UI |
| Pinterest | pinterest.com | Moodboard breadth: type/colour/texture boards | `pinterest.com/search/pins/?q=<term>` — build the moodboard here |
| UiPedia | uipedia.design | "Wikipedia of UI design": curated resource directory + designer portfolio index | `/resources`, `/portfolios` |
| Figma Community | figma.com/community | Free files: design systems, UI kits, wireframes | Study a real system's structure |

**Agent-friendliness ranking** (how machine-readable the output is): 21st.dev (llms.txt, `.md` twins,
OpenAPI, MCP, registry install) > shadcn registry > Mobbin (MCP + API) > MotionSites (markdown via
content negotiation) > Land-book > Hero Gallery > Three.js Resources > Savee > Httpster / Minimal
Gallery / Recent > ScreensDesign.

**Scouting patterns worth knowing:**
- Award-site pages link the live source site (`?ref=`/`?utm_` outbound URLs). Harvest those hrefs, then
  fetch the real production HTML/CSS — this is the highest-value loop for a coding agent.
- Tag-URL grammars: Awwwards `/websites/<tag>/`, SiteInspire `/websites/category/<cat>`, Minimal
  Gallery `/tag/<tag>/`, Mobbin `/explore/<surface>`, Three.js Resources `/showcase/tags/<tag>`,
  reallygooddesigns `/inspiration/<topic>`, Land-book `/design/<page-type>`.
- **Avoid as primary targets:** Pinterest/Instagram (login walls), Dribbble/Behance for *shipped-UI*
  research (they are mockups — style reference only), uigarage.net (closing down), and the unverified
  domains below.

**Do not cite (verified dead on 2026-09-19):** lapaninja.com, page-flows.com, screens.design,
huemorus.com, hallo.design, inspirationde.com, usabilitygeek.com, ui-sources.com (redirects).

## Technique & effect showcases

| Source | URL | What it gives | Scout method | |
|---|---|---|---|---|
| Motion Sites | motionsites.ai/templates | Motion-heavy site templates + prompt-style specs | Direct motion-system reference | ★ |
| 21st.dev | 21st.dev | 12,000+ React/Tailwind/shadcn components with live previews and copyable TSX | Agent-first: `llms.txt`, `.md` twin on any page, OpenAPI at `/openapi.json`, MCP at `/mcp`, shadcn-CLI install |
| 21st.dev Three.js collection | 21st.dev/community/components/s/three-js | 49 Three.js-powered React components (shader backgrounds, globes, particle waves) | Fetch the tag URL with a `.md` suffix for the full list |
| Three.js Resources showcase | threejsresources.com/showcase | Real WebGL sites filterable by category + technology (GSAP, R3F, GLSL, Tailwind) | `/showcase/categories/<cat>`, `/showcase/technologies/<tech>`, `/showcase/tags/<tag>`, paginated |
| ShaderGradient | shadergradient.co | Parametric gradient backgrounds + copyable params | Generate, copy params, ship |
| Jitter templates | jitter.video/templates/ui-elements | 50+ animated UI elements (toggles, loaders, search bars, buttons) as motion templates | Per-template URLs; export GIF/MP4/Lottie — study timing/easing |
| Aceternity UI | ui.aceternity.com | High-impact effect components with previews | See the effect, install it, restyle it | ★ |
| Magic UI | magicui.design | Marketing polish components + demos | Same | ★ |
| React Bits | reactbits.dev | 100+ animated components, filterable | Same | ★ |
| Anime.js showcase | animejs.com | What the engine can do (timelines, SVG, stagger) | Pick the right primitive before coding | |
| GSAP showcase / demos | gsap.com/showcase | Production GSAP sites | Learn scroll-scene grammar | ★ |
| Lenis demos | lenis.darkroom.engineering | Smooth-scroll behaviour | How to smooth-scroll without nausea | |
| Rive community | rive.app/community | Interactive state-machine animations | Reuse instead of hand-animating | ★ |
| LottieFiles | lottiefiles.com | Ready-made micro-animations | Free tier + licences vary per asset | ★ |
| CodePen | codepen.io | Micro-techniques and experiments | Search a technique; verify quality before adopting | ⚠ |
| Framer Motion examples | motion.dev/examples | Canonical patterns with source | Copy the pattern, not just the vibe | ★ |
| Scroll-driven animations (Chrome) | scroll-driven-animations.style | CSS-only scroll animation demos | Zero-JS reveals where supported | ★ |
| View Transitions demos | (Chrome/Next docs) | Route + shared-element transitions | The cheapest page-transition approach | |
| Spline community | spline.design/community | Designer-authored 3D scenes | When 3D is required and time is short | ⚠ |
| Figma motion/animation files | figma.com/community/search?resource_type=… | Motion specs in file form | Timing/easing references | ★ |

## Colour, type, texture and asset sourcing

| Source | URL | What it gives |
|---|---|---|
| Huemorus / Coolors / Realtime Colors | coolors.co, realtimecolors.com | Palettes verified in a real UI context (Realtime Colors previews tokens live) ★ |
| Happy Hues | happyhues.co | Palettes with real semantic usage examples ★ |
| Fontshare / Google Fonts / Velvetyne / Font Squirrel | fontshare.com, fonts.google.com, velvetyne.fr | Type sourcing (pairing rules in `references/DESIGN.md`) ★ |
| Typewolf / Fonts In Use | typewolf.com, fontsinuse.com | Real-world pairing and context evidence |
| fffuel / Haikei / MagicPattern | fffuel.co, haikei.app, magicpattern.design | Generated SVG/CSS textures, blobs, mesh gradients, patterns ★ |
| Transparent Textures / Coolbackgrounds / Meshgradient | transparenttextures.com, coolbackgrounds.io, meshgradient.in | Static background assets |
| 3dicons / Iconscout / Icons8 | 3dicons.co | 3D iconography with consistent lighting (licences vary) |
| unDraw / Storyset / Humaaans / Open Peeps | undraw.co … | Illustration sets — pick one, keep its style |
| Lucide / Phosphor / Tabler / Iconify | lucide.dev, phosphoricons.com, tabler.io/icons | Icon systems (one per project) ★ |
| SVG Repo / SVGOMG | svgrepo.com, jakearchibald.github.io/svgomg | Sourcing + optimising SVG ★ |

## How to scout well (agent procedure)

1. **Open 4–8 sources**, no more. Breadth without extraction is procrastination.
2. For each source: screenshot the reference, name the technique in one sentence, and note what you
   will *not* take (identity, copy, assets).
3. **Always** include one product-specific source (Mobbin/Refero/ScreensDesign for apps,
   Land-book/SaaSpo for marketing, 21st.dev/Nicelydone for dense product surfaces).
4. **Always** include one technique source (Codrops, Motion Sites, 21st.dev, shadergradient, Jitter)
   so the result has at least one thing that is properly built rather than approximated.
5. Convert every observation into either (a) a section in the layout, (b) a token, or (c) an entry in
   the library map. Observations that convert into nothing are deleted.
6. Licence check before reuse: galleries are for study; component sites and asset libraries state
   per-asset licences. Never lift logos, photography, illustrations or copy.

## Machine-readable scouting (preferred for agents)

Several sources expose agent surfaces — use them instead of scraping HTML when available:

- **21st.dev**: `llms.txt`, `.md` twins (append `.md` to a component URL), `/openapi.json`, `/mcp`,
  plus `npx @21st-dev/cli@latest init` — components arrive as TSX, not screenshots.
- **Mobbin**: `/llms.txt`, `/mcp.md`, endpoint `api.mobbin.com/mcp`, REST API on team plans.
- **ScreensDesign / Page Flows / Three.js Resources / Savee / MotionSites**: each exposes MCP and/or
  markdown content negotiation.
- **Award sites** (Awwwards, CSSDA, FWA): harvest outbound links carrying `?ref=`/`?utm_` — those are
  the live production sites; fetch them for real HTML/CSS/motion behaviour.
- **Land-book / Hero Gallery / One Page Love / Nicelydone**: content negotiation returns full markdown
  listings with their filter grammars.

Pattern-search URLs that go straight to what you need: `dribbble.com/search/<term>`,
`pinterest.com/search/pins/?q=<term>`, `search.muz.li`, Awwwards `/websites/<tag>/`, Minimal Gallery
`/tag/<tag>/`, reallygooddesigns `/inspiration/<topic>`.
