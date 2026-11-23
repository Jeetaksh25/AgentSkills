# Fidelity — 85% from the references, 15% the product's own

Load in phase 5 (DIRECTION) and keep open through BUILD. Gate: G20 (`scripts/fidelity.mjs check`).

The difference between "AI-generated" and "a designer made this" is mostly that a designer starts
from proven work. This skill makes that mechanical: one **anchor** reference carries the design, the
supporting references and harvested template sections fill the gaps, and the product adds only what
is genuinely its own.

## What the 85% is (taken from the references)

| Aspect | Taken from | How |
|---|---|---|
| Layout and composition | anchor | Grid, column counts, density, section order, where the eye lands |
| Spacing rhythm | anchor | Section padding, gaps, card insets — measured from the teardown or the image |
| Component styling | anchor | Radius, borders, shadows, surface layering, button and input shapes |
| Type system | anchor (+ `fonts.mjs`) | Scale ratio, weight contrast, case, tracking; the *faces* are chosen from free libraries to match its classification (grotesk ↔ grotesk, high-contrast serif ↔ high-contrast serif) |
| Motion grammar | anchor or a motion reference | Easing family, durations, entrance pattern, scroll behaviour |
| Sections the anchor lacks | supporting refs, harvested templates | `harvest.mjs page <url> --pick pricing` and rebuild that section in the anchor's system |

## What the 15% is (the product's own)

- **Content**: every word, number and label, written for this product (`references/CONTENT.md`).
- **Domain completeness**: every item in `brief.md -> Domain content inventory`. An ML dashboard has
  accuracy/precision/recall/F1, loss curves, confusion matrix, parameters, hyperparameters, runs,
  datasets; if the anchor has no place for one, it becomes an `own` section built in the anchor's system.
- **Theme and colour**: the brand's hue, light/dark as the brief or user says; otherwise the anchor's.
- **Adaptations**: what each section changes to fit the content (recorded per section as `adapted`).
- **Craft moments**: the CRAFT.md recipes chosen for this brief.

## Never copied

Copy, logos, photography, illustration, proprietary fonts, and code from sites without an open
licence. Harvested HTML is a structural reference: rebuild with the project's components and tokens.

## The procedure

1. `sources.mjs fetch` saved images to `.beyond-ui/refs/`. **Open and look at every one** (multimodal
   read), and list the ones you viewed in `state.json -> scout.imagesViewed`.
2. Pick the **anchor**: the image or site closest to this product's surface and audience, with the
   most complete system (not the flashiest). Then 4 supporting references. Write them to
   `.beyond-ui/references-selection.json` with `"anchor": true` on one.
   **Image anchors** (a Dribbble or Behance shot, a Mobbin screen): `teardown.mjs` captures the *host*
   site, so its tokens are the gallery's, not the design's — ignore them. Measure the image itself into
   `.beyond-ui/teardown/<slug>/image-analysis.md`: grid and column count, spacing steps (px at the
   image's scale), radius, border and shadow treatment, type classification and scale ratio, palette
   sampled as OKLCH, component inventory, density. Use a live product site among the supporting
   references when computed truth (real CSS, motion) is needed.
3. For sections the anchor lacks, harvest them: `harvest.mjs page <template-url> --pick <roles>` or
   `harvest.mjs prompt <prompt-url>`; look at the PNGs.
4. `fidelity.mjs init`, then fill `.beyond-ui/fidelity.json`: every section's `source`, `evidence`
   (a real file) and `adapted`; every system aspect's source.
5. Build from it. `fidelity.mjs check` must pass: at most 15% `own` sections (minimum one allowed), at
   least half the borrowed sections from the anchor, at most one system aspect besides colour invented.

## When an existing UI looks bad

If the user says the UI looks bad, or CRITIQUE scores a gate below 3, do not patch. Run the loop from
phase 1 as a **full overhaul**: fresh references for the exact surface, a new anchor, a new
fidelity map, a rebuilt page. Keep the data layer and routes; replace the presentation.
