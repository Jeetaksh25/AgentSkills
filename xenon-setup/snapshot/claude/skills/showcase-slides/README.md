# showcase-slides

Turns a topic, notes or a paper into a presentation-grade slide deck that is a single web page:
it fills any screen, animates smoothly, works offline, and is checked slide by slide before it is
handed over. For any audience: class projects, research talks, pitches, launches, workshops, school
reports, travel and story nights, weddings and events, portfolios.

## What you get

- **Engine, not templates:** one fixed engine handles the 16:9 stage, auto-fit (content grows or
  shrinks to fill the free space), transitions, staggered reveals, animated charts, count-up
  numbers, full-bleed photos with scrims, and print-to-PDF.
- **Presenter controls:** arrow keys only (→ ↓ next, ← ↑ back), F fullscreen, N speaker notes with
  timer, G slide list, B blackout, ? help. Build steps reveal on →.
- **Data-driven components:** vertical and horizontal bars, dot plots, heat maps, donuts, mix bars,
  flows and pipelines, timelines, stat rows, comparisons, galleries.
- **Four themes:** `paper`, `midnight`, `editorial`, `swiss`, plus accent and font overrides.
- **Verification:** `qa.mjs` audits every slide in headless Chrome (overflow, empty space, text
  under 20px, WCAG contrast, clipping, word budget, notes, repetition, visual share) and
  `snap.mjs` screenshots each slide for a visual review.
- **Offline images:** `fetch-images.mjs` downloads free-licence photos into the deck folder,
  verifies they are images and records credits.

## Quick start

```bash
node scripts/build.mjs assets/starter-deck.html --out demo/index.html --open
node scripts/qa.mjs demo/index.html
node scripts/snap.mjs demo/index.html
```

Photo example:

```bash
node scripts/fetch-images.mjs demo-photo --manifest assets/example-photo-images.json
cp assets/example-photo-deck.html demo-photo/deck.html
node scripts/build.mjs demo-photo/deck.html --open
```

Requires Node 18+ and Chrome, Edge, Chromium or Brave (`CHROME_PATH` to override).

See `SKILL.md` for the agent workflow and `references/` for the component catalog, design system
and content guide.
