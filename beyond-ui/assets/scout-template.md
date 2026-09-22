# Scout — <surface> — <date>

## Frame

```
domain:      <what the product is, in the user's own words>
audience:    <who uses it, how technical, what device>
aesthetic:   <3-5 keywords: editorial | brutalist | warm-paper | dense | kinetic | ...>
constraints: <stack + version, brand colours, existing type, dark mode, i18n, a11y target>
budget:      <performance/bundle limits, "no WebGL", motion budget>
```

## Bootstrap evidence

```
installed upstream skills:   <from scripts/bootstrap-upstream-skills.sh output>
missing (and why):           <name -> reason; raw SKILL.md URLs read instead>
```

## Tool layer evidence

```
playwright:   pkg=<y/n> chromium=<y/n>   (from scripts/install-tools.mjs output)
skillui:      <y/n>   opensrc: <y/n>
firecrawl:    active=<y/n> key=<env|project-config|bundled|none>
browser-use:  <y/n — optional>
```

## Direction

**Aesthetic name:** <one phrase, specific: "Swiss editorial on warm paper", not "modern and clean">

Derived from:
1. <reference URL> — <what was taken>
2. <reference URL> — <what was taken>
3. <reference URL> — <what was taken>

## References (6-12)

| # | URL | What is taken | Technique observed | Deliberately not taken |
|---|---|---|---|---|
| 1 | | | | |

## Prompts / templates harvested (3-5)

| Source URL | Structure adopted (section order, content shape) | How content was rewritten |
|---|---|---|
| | | |

## Library map (element -> library -> exact command)

| Element | Library / registry | Consume step (verified on this stack) |
|---|---|---|
| buttons, inputs, dialogs, tabs, toasts | shadcn/ui | `npx shadcn@latest add button input dialog tabs sonner` |
| | | |

Hand-written elements and why (must be a short list):
- <element> — <reason: licence / bundle / incompatibility / genuinely bespoke>

## 3D (only when the brief involves 3D/WebGL)

- **Justified?** <yes/no + one line: is 3D the concept, or decoration>
- **Engine:** <three | r3f + drei | threlte | tresjs | model-viewer | babylon | spline>
- **Scene pattern:** <hero | configurator | scroll-linked | canvas-background | inline | globe | particles | viewer+ar>
- **Assets:** <files, compressed how (gltfjsx --transform / Draco + KTX2), total bytes, licence per asset>
- **Poster / fallback:** <image path; behaviour with no WebGL, reduced motion, slow network>
- **Reference scenes studied:** <threejsresources showcase URLs, 21st.dev three-js entries, awwwards WebGL picks>
- **Measured:** <asset bytes · JS delta · FPS at 4× CPU throttle>

## Teardown synthesis (fill from .beyond-ui/DESIGN-SKILL.md — references/TEARDOWN.md)

- **Selected 10:** <count> teardowns complete (<ultra|degraded|static>) — see references-selection.json
- **Accent chosen from:** DESIGN-SKILL.md §1 — evidence site: <slug>
- **Type pairing chosen from:** DESIGN-SKILL.md §2 — evidence site: <slug>
- **Motion grammar chosen from:** DESIGN-SKILL.md §4 — evidence: keyframes/transitions observed
- **Section grammar adopted:** DESIGN-SKILL.md §5 — sections pruned for this product's content

## Rule citations (running log — references/USAGE.md)

| Decision | Source | Applied in |
|---|---|---|
| <e.g. hover = border+shadow change, no size> | teardown/<slug>/references/INTERACTIONS.md | src/components/ui/button.tsx |
| <e.g. no three-equal-column feature row> | skill://hallmark -> structural-variety | src/app/page.tsx |

## Design contract

- **Type:** display `<face>` (load: <strategy>) · body `<face>` · mono `<face>`; scale ratio `<x>`
- **Colour:** neutrals `<ramp>` · accent `<oklch>` · signal `<oklch>`; dark-mode strategy `<x>`
- **Spacing/rhythm:** base `<4px>` · section rhythm `<description>` · content width `<rem>`
- **Motion:** primary lib `<motion|gsap|anime|css>` · easings `<set>` · durations `<set>` ·
  entrance grammar `<one, named>` · reduced-motion fallback `<x>`
- **Non-goals:** <what this design will not do>

## Rejected

| Candidate | Why rejected |
|---|---|
| | |

## Risks

| Risk (compat / perf / licence / a11y) | Mitigation |
|---|---|
| | |
