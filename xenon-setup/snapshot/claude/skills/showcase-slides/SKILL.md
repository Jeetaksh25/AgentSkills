---
name: showcase-slides
description: Creates presentation-grade slide decks as one self-contained web page (16:9, fills any screen, smooth animations, animated charts, count-up numbers, full-bleed photos, speaker notes with timer, fullscreen, keyboard-only arrow navigation, slide list, blackout, print-to-PDF) for any topic and any audience - class projects, research talks, pitches, product launches, workshops, school reports, travel or story nights, weddings and events, portfolios. Use when the user asks for slides, a deck, a presentation, a slideshow, a talk, a pitch deck, a showcase or "something to present", or invokes showcase-slides by name. It plans the story with action titles, picks exhibits from a component library, downloads free-licence images for an offline deck, builds with a fixed engine and verifies every slide with a headless QA pass (overflow, empty space, text size, contrast, word budget) and screenshots before delivery. Not for editable .pptx/.key files, documents or spreadsheets unless the user asks for a web deck.
---

# Showcase Slides

You produce decks that look designed, read from the back of a room and present themselves smoothly.
The **engine is fixed** (controls, auto-fit, animation, charts, QA, print); you only write content
in a small HTML vocabulary. Never edit the engine files for a single deck and never hand-roll your
own slide framework: consistency and the QA guarantees come from the engine.

Paths below are relative to this skill's folder (for example `~/.claude/skills/showcase-slides`).

## What every deck gets automatically

- 1920×1080 stage scaled to any screen; content **auto-fits the free height** (no empty bottoms,
  no overflow); numbers and labels shrink to fit their boxes.
- Slide transitions, staggered reveals, growing charts, count-up numbers, drawn arrows, slow photo
  zoom; reduced-motion respected.
- Presenter controls: **→ ↓ next · ← ↑ back · Home/End · F fullscreen · N notes + timer · G slide
  list · B blackout · ? help · Esc**. No click, wheel or space navigation (nothing advances by
  accident). Build steps reveal one per →. Ctrl+P prints one slide per page (PDF).
- Four themes (`paper`, `midnight`, `editorial`, `swiss`), accent and font overrides.
- `?qa` audit mode and `?static` screenshot mode used by the scripts below.

## Requirements

Node 18+ and any Chromium browser (Chrome, Edge, Chromium, Brave; set `CHROME_PATH` if it is not
found). Internet only for fonts and for downloading images; the finished deck runs offline
(system fonts are the fallback).

## Workflow

Each step ends in a checkable condition. Do not skip QA or the visual check.

### 1. Brief

Read the request and any files the user points to. Settle the brief from `references/content.md`
§1 (audience, goal, setting, duration, tone, sources, images). Ask **one** short question only when
a missing answer changes the deck (for example the facts to present); otherwise use the defaults
and say which you used.
**Done when:** you can state topic, audience, slide count, theme and image plan in one line.

### 2. Outline (ghost deck)

Write the slide list: one action title per slide (a full sentence with the takeaway) and the
exhibit you will use (`references/components.md`). Follow the archetype table in
`references/content.md` §2 and the variety rules in §5. Show the outline to the user in a few lines
and continue; stop for approval only if they asked to review it or the deck exceeds ~20 slides.
**Done when:** the titles alone tell the full story and ≥60% of content slides have a visual exhibit.

### 3. Images (when the plan includes them)

Follow `references/content.md` §8: find free-licence photos (Unsplash, Pexels, Wikimedia Commons,
official press kits), write a manifest like `assets/example-photo-images.json`, then download:

```bash
node scripts/fetch-images.mjs <deck-dir> --manifest <deck-dir>/images.json
```

The script keeps only real image files (JPEG, PNG, WebP, GIF, AVIF; 15 MB cap) and writes
`img/credits.json`. Never hotlink images (blank offline) and never use images the user could not
legally show.
**Done when:** every planned image exists in `<deck-dir>/img/` with a recorded credit.

### 4. Write the deck source

Create `<deck-dir>/deck.html`: one `<deck>` element containing `<section class="slide">` blocks.
Start from `assets/starter-deck.html` (a data-heavy class talk) or `assets/example-photo-deck.html`
(a photo-led story) and replace the content; use only classes from `references/components.md`.

```html
<deck title="Deck title" theme="paper" footer="Event or course · organisation">
  <section class="slide cover">…</section>
  <section class="slide">
    <div class="kicker">Section</div>
    <h2 class="title">Action title that states the takeaway</h2>
    …one exhibit…
    <aside class="notes">What to say out loud.</aside>
  </section>
</deck>
```

Rules: real facts only (cite in `data-source`); 40–80 body words; speaker notes on every slide;
one `card accent` at most per slide; consistent tone colours; credits for every photo; optional
deck-specific CSS in a `<style>` block inside `<deck>` (layout tweaks only, never font sizes).
Theme choice and overrides: `references/design-system.md`.
**Done when:** the file contains the full outline with no stand-in text.

### 5. Build

```bash
node scripts/build.mjs <deck-dir>/deck.html            # writes <deck-dir>/index.html
```

**Done when:** the build prints the slide count with notes on every slide and no missing images.

### 6. QA loop (mandatory)

```bash
node scripts/qa.mjs <deck-dir>/index.html
```

Fix every **error** (overflow, text under 20px, contrast, clipped text, content spilling out of a
box, broken image, unresolved placeholder, more than 110 words) and every **warning** (underfilled,
too dense, wordy, long title, missing notes, repeated layout, too few visuals), or state why a
specific warning is intended. Fix content first: shorten, split, merge, swap the exhibit. Rebuild
and rerun until clean.
**Done when:** QA reports 0 errors, and each remaining warning has a stated reason.

### 7. Look at every slide (mandatory)

```bash
node scripts/snap.mjs <deck-dir>/index.html            # <deck-dir>/snaps/slide-01.png …
```

Open **every** PNG (image viewer or Read tool) and check what QA cannot see: awkward line breaks or
one-word last lines in titles, misaligned rows, a chart whose highlight does not match the title,
text over a face or the subject of a photo, inconsistent tone colours, anything that looks
template-like rather than designed. Fix, rebuild, re-run QA, re-snap the changed slides.
**Done when:** you have viewed every slide after the last change and found nothing to fix.

### 8. Deliver

Open the deck (`node scripts/build.mjs <deck> --open`, or the OS opener) and tell the user:
the file path, the controls (→/← move, F fullscreen, N notes, G list, B blackout, ? help), that
Ctrl+P saves a PDF, and how it was checked (QA result, slides viewed). If the project has a launcher
script (for example a `.bat`, npm script or Makefile), offer to add a line that opens the deck.
Delete the `snaps/` folder unless the user wants the images.

## Stop condition

The run ends when steps 6 and 7 are both clean on the final build and the deck is delivered, or
when a real blocker remains (missing facts only the user has, no browser for QA) and you have told
the user exactly what is missing. "It probably looks fine" is not a stop condition.

## Quality bar (what "better than a normal deck" means)

- Every content slide answers its title with one exhibit; the titles alone tell the story.
- The body fills the screen (QA fill ≥ 74%) without shrinking text (zoom ≥ 0.86).
- Nothing below 20px; all text meets WCAG contrast; nothing clipped or spilling.
- Numbers are real, sourced, unit-labelled, and animate in; one highlight per chart.
- Photos are relevant, credited, offline, and never fight the text.
- Speaker notes make the deck presentable by someone who did not write it.

## Files

| File | Purpose |
|---|---|
| `assets/engine.css` | Layout, components, motion, print and static modes (do not edit per deck) |
| `assets/engine.js` | Navigation, steps, notes, auto-fit, chart builders, count-ups, QA audit |
| `assets/themes.css` | Theme tokens for paper, midnight, editorial, swiss |
| `assets/shell.html` | Page template the build fills in |
| `assets/starter-deck.html` | 15-slide data talk using every chart and flow component |
| `assets/example-photo-deck.html` | 5-slide photo-led story (photo cover, media, gallery, quote) |
| `assets/example-photo-images.json` | Image manifest for the photo example |
| `scripts/build.mjs` | deck.html → single self-contained index.html (`--out`, `--open`) |
| `scripts/qa.mjs` | Headless audit, exit 1 on errors (`--json`, `--strict`) |
| `scripts/snap.mjs` | Screenshot every slide in its final state (`--slides 2,5`, `--out`) |
| `scripts/fetch-images.mjs` | Download and verify images, record credits |
| `scripts/chrome.mjs` | Finds and runs a headless Chromium browser |
| `references/components.md` | Every component with markup and when to use it |
| `references/design-system.md` | Canvas, auto-fit, type, colour, themes, motion, image rules |
| `references/content.md` | Brief, archetypes, action titles, word budget, notes, honesty, images |

## Failure modes this skill prevents

| Failure | Prevented by |
|---|---|
| Empty bottom half or content cut off on the projector | auto-fit zoom + QA fill/overflow checks |
| Text unreadable from the back row | 20px floor and contrast checks in QA |
| Numbers jittering or spilling out of cards | tabular figures, reserved widths, shrink-to-fit |
| Slides advancing by accident during a talk | arrow-only navigation, no click or wheel |
| Images missing in a classroom without Wi-Fi | fetch-images.mjs + build warning on hotlinks |
| Walls of text, same layout over and over | word budget, repetition and visual-share checks |
| Made-up statistics | facts-from-sources rule and placeholder check |
| "Looks fine" without looking | mandatory snapshot review of every slide |
