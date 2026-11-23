# Design system

The engine fixes the canvas, type scale, motion and contrast so every deck starts at a professional
baseline. Your job is to choose the theme, the exhibit and the words; never fight the system with
inline font sizes or absolute positioning.

## Canvas

- Stage: **1920 × 1080**, scaled uniformly to any screen (letterboxed), so a layout that is right in
  QA is right on the projector.
- Safe area: 110px side margins; title band at the top; footer band at the bottom (34px from edge).
- **Auto-fit:** the body under the title is zoomed between 60% and 160% (deck default `zoom-max`
  1.6) until it fills the free height without overflowing. Consequences:
  - Sparse slides grow; dense slides shrink. QA warns when a slide shrinks below 86% (too dense) or
    fills under 74% at maximum zoom (too empty) — fix the content, not the CSS.
  - Fixed pixel sizes inside the body scale with it; keep their ratios sensible.
  - Stat numbers, heat-map cells and node titles shrink to fit their box automatically.

## Type

One family per theme (display may differ), sized for a room:

| Role | Size | Notes |
|---|---|---|
| Cover headline (`h1.display`) | 104px | balanced line breaks |
| Action title (`h2.title`) | 58px | max two lines, about 6–14 words |
| Card heading (`.h3`) | 36px | |
| Lead | 38px | one sentence |
| Body (`.p`, lists) | 30–32px | |
| Small, labels, captions | 22–24px | minimum anywhere: 20px rendered (QA error below) |

Titles use `text-wrap: balance`, paragraphs `text-wrap: pretty`, numbers tabular figures.

## Colour

Every theme defines the same tokens, so components work in all of them:

| Token | Meaning |
|---|---|
| `--bg`, `--card`, `--soft` | page, raised surface, tinted surface |
| `--ink`, `--ink2`, `--muted` | headings, body, captions |
| `--accent`, `--accent-strong`, `--accent-ink`, `--accent-soft` | brand colour for marks, filled cards, text, tints |
| `--pos` / `--neg` / `--warn` (+ `-ink`, `-soft`, `-line`) | semantic tones |
| `--inv-*` | inverse (dark) scheme for cover, divider, closing, `card ink` |

Rules:
- Max **three hues** on a slide besides neutrals: accent plus at most two semantic tones.
- Colour carries meaning; keep the same colour for the same thing across all slides.
- Everything else muted: highlight only what the title talks about.
- Contrast is verified by QA (4.5:1 for normal text, 3:1 for large/bold text).

## Themes

| Theme | Character | Good for |
|---|---|---|
| `paper` | warm off-white, Geist, blue accent, soft cards | class projects, research, product, general default |
| `midnight` | deep navy-black, Inter Tight, indigo accent, glow | tech launches, hackathons, evening events, dark rooms |
| `editorial` | ivory, Fraunces serif headlines, deep red accent | stories, travel, history, literature, culture, weddings |
| `swiss` | pure white, Inter Tight 800, orange-red accent, sharp radius | design, architecture, bold statements, business |

Override per deck: `<deck theme="paper" accent="#0f9d58" font="Space Grotesk">`. The accent
override derives strong, ink, soft and halo variants automatically; any Google Fonts family works
for `font`. Pick accents with enough depth (avoid pale yellow or neon on white).

## Spacing

Gap scale: 12 · 16 · 22 · 28 · 32 · 48 · 56. Cards pad 34px/38px. Prefer `mt-s / mt / mt-l` and
the layout gaps over custom margins. White space is fine: auto-fit already removes dead space at the
bottom, so do not pad slides with filler.

## Motion

- Slide change: 0.85s slide-and-fade in the direction of travel.
- Reveal: blocks rise in sequence (85ms stagger); charts grow; numbers count up; arrows draw;
  photos settle with a slow zoom.
- Steps (`.step`) give controlled reveals; never more than three per slide.
- `prefers-reduced-motion` and the `?static` mode disable motion; PDF export prints final states.

## Images

- Full-bleed photos carry emotion (cover, chapter openers, the closing line); media and galleries
  carry evidence (places, products, people, screenshots).
- Choose photos with calm areas where the text goes; set the focal point with `data-bg-pos` or
  `--pos`, and the scrim side with `data-scrim`.
- One visual language per deck: similar colour temperature, all photos or all illustrations.
- Resolution: 2400px wide for full-bleed, 1200–1600px for media tiles. Keep the deck under ~25 MB.
- Every image has `alt` text and a credit; QA fails broken images and flags missing alt text.

## Do and don't

| Do | Don't |
|---|---|
| One exhibit that proves the title | Paste the paragraph you would say |
| Highlight one bar, mute the rest | Rainbow charts with a legend lookup |
| Real numbers with units and a source | Invented or rounded-away statistics |
| Consistent tones and themes | A new colour on every slide |
| Photos downloaded into `img/` | Hotlinked images that vanish offline |
| Let auto-fit size the body | Inline font sizes and absolute positioning |
