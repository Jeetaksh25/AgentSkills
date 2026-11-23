# Type — chosen like a designer, from the best free libraries

Load in phase 5 (DIRECTION). Gate: G21 (`.beyond-ui/fonts/choice.json`).

AI-built UIs look AI-built largely because of type: the same five families, a decorative display face
on every page heading, and all-caps monospace labels sprinkled as "tech" decoration. This skill never
picks a font from memory.

## The procedure

```bash
node <skill>/scripts/fonts.mjs search      # 10 libraries; overused families excluded automatically
node <skill>/scripts/fonts.mjs specimen    # renders the shortlist with the product's own words
# LOOK at every .beyond-ui/fonts/specimen-*.png
node <skill>/scripts/fonts.mjs choose --display "<family>" --text "<family>" [--mono "<family>"] --why "<reason>"
```

Libraries searched: **Google Fonts, Fontshare, Fontsource** (APIs) and **Velvetyne, Uncut,
Collletttivo, Open Foundry, Use & Modify, Tunera, Font Squirrel** (fetched with Scrapling into
`.beyond-ui/fonts/libraries/`; browse them for faces the APIs do not carry). The 80 most-used Google
families and an explicit ban list (Inter, Roboto, Poppins, Montserrat, Open Sans, Lato, Space Grotesk,
Playfair Display…) are excluded unless the brand already uses one.

## How to choose (what the `--why` must address)

1. **Match the anchor's classification.** Read the anchor's type from its teardown capture or the
   image: neo-grotesk, geometric, humanist, grotesque with character, transitional or high-contrast
   serif, slab, mono. Pick a free face of the same classification and similar x-height and width.
2. **Fit the surface.** App UI and dashboards: one neo-grotesk or grotesk for everything, weight and
   size for hierarchy, tabular numerals. A display face only on marketing heroes, never on app page
   titles. Marketing: one display face with real character plus a quiet text face.
3. **Check the specimen.** Numerals (tabular, clear 1/7, 0/O), small sizes, bold weights, the product's
   longest word at hero size, how the pair sits together.
4. **Mono is for code and data**, not decoration. No all-caps monospace labels, eyebrows or
   "terminal-style" headings unless the product is a terminal.
5. **Record the licence.** Fontshare: ITF Free Font License. Google/Fontsource: OFL. Paid faces only
   when the user has a licence (`--allow-licensed "<note>"`).

## Implementation

- Next.js: `next/font/google` for Google families; `next/font/local` with files from Fontshare or
  Fontsource (`npm i @fontsource-variable/<id>`) for the rest. Never hot-link a CDN in production.
- React Native / Expo: `expo-font` with the downloaded files; Flutter: `pubspec.yaml` fonts; SwiftUI /
  Compose: bundle the files and register them.
- Type scale from the anchor (or Utopia for fluid scales), `text-wrap: balance` on headings, `pretty`
  on body, `font-variant-numeric: tabular-nums` on data.
