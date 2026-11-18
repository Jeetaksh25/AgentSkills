# Component catalog

Every component below is plain HTML inside a `<section class="slide">`. The engine (inlined by
`build.mjs`) wraps the content, sizes it to fill the screen, animates it, and renders the
data-driven charts. Pick components by the **message**, not by habit: one exhibit per slide that
makes the action title obvious.

Contents: slide anatomy · slide attributes · layouts · text · cards · stats · charts (vertical bars,
horizontal bars, dot plot, heat map, donut, mix bar) · flows · timeline · segmented bar · comparison ·
callout and equation · quote · lists · chips and pills · images (photo slides, media, gallery) ·
cover, divider, closing · references · build steps · speaker notes · tones.

---

## Slide anatomy

```html
<section class="slide" data-source="Source or photo credit shown in the footer">
  <div class="kicker">Section label</div>
  <h2 class="title">Action title: a full sentence that states the takeaway</h2>
  <!-- the exhibit: any components below -->
  <aside class="notes">What the presenter says on this slide.</aside>
</section>
```

- `kicker` + `h2.title` stay pinned at the top; everything else becomes the auto-fitted body.
- The footer (left: `data-source` or the deck `footer`; right: page number) is added automatically.
- Do not add your own wrappers for spacing or centering: the engine centers the body vertically and
  scales it (60%–160%) until it fills the free height without overflowing.
- Spacing helpers between blocks: `mt-s` (16px), `mt` (32px), `mt-l` (56px).

## Slide attributes

| Attribute | Effect |
|---|---|
| `class="slide cover"` | Inverse title slide, no footer, glow background |
| `class="slide divider"` / `closing` / `inverse` | Inverse colour scheme (section break, conclusion, emphasis) |
| `data-bg="img/x.jpg"` | Full-bleed photo slide with scrim and slow zoom (see Images) |
| `data-scrim="left|bottom|full|none"` | Where the dark gradient sits on a photo slide (default `full`) |
| `data-bg-pos="center 30%"` | Focal point of the background photo |
| `data-source="..."` | Footer text for this slide: citation or photo credit |
| `data-foot="none"` | Hide the footer on this slide |
| `data-title="..."` | Title used in the slide list (default: the slide's heading) |
| `data-zoom-max="1.3"` | Cap the auto-fit zoom (rarely needed) |
| `data-glow="off"` | Remove the glow on inverse slides |

## Layouts

```html
<div class="split">…left…</div>            <!-- 1.25fr | 1fr, vertically centered -->
<div class="split even">…</div>             <!-- 1fr | 1fr -->
<div class="split wide-right">…</div>       <!-- 1fr | 1.25fr -->
<div class="split top">…</div>              <!-- align to top instead of center -->
<div class="grid-2">…</div> <div class="grid-3">…</div> <div class="grid-4">…</div>
<div class="row">…</div>  <div class="col">…</div>   <!-- flex; add .wrap, .center, .gap-s, .gap-l -->
```

Rule of thumb: chart or image on the left, interpretation on the right (reading order), or exhibit on
top and two or three cards underneath.

## Text

| Class | Size at 1080p | Use |
|---|---|---|
| `h1.display` | 104px | Cover and divider headline only |
| `h2.title` | 58px | Action title of every content slide |
| `.h3` | 36px | Card heading |
| `.lead` | 38px | Subtitle, one key sentence |
| `.p` | 30px | Body sentence (max two per card) |
| `.small` | 24px | Supporting detail |
| `.label` | 22px caps | Overline above a chart or card |
| `.eq` | 34px mono | Formula |
| `.accent-text` `.pos-text` `.neg-text` `.warn-text` `.muted` | colour helpers | Emphasise a word |

Sizes grow with the auto-fit zoom; the QA script fails any text that renders below 20px.

## Cards

```html
<div class="card">…</div>          <!-- white surface, soft shadow -->
<div class="card soft">…</div>     <!-- tinted, flat: secondary info -->
<div class="card outline">…</div>  <!-- transparent with border -->
<div class="card accent">…</div>   <!-- filled accent colour, white text: the one key fact -->
<div class="card ink">…</div>      <!-- inverse (dark) surface: formulas, summaries -->
<div class="card tight">…</div>    <!-- less padding -->
```

Use **one** `card accent` per slide at most; it is the visual answer to the title.

## Stats

```html
<div class="stat-row">                       <!-- cards sized to their numbers automatically -->
  <div class="card stat accent"><div class="v"><span data-count="1249101">1,249,101</span></div><div class="l">answers</div></div>
  <div class="card"><div class="stat pos"><div class="v"><span data-count="98.8">98.8</span><small>%</small></div><div class="l">within one level</div></div></div>
</div>
<div class="stat-row bare">…stats without cards (cover slides)…</div>
```

- `data-count` makes the number count up from zero when the slide appears; decimals follow the
  value (`98.8` → one decimal). Put the final formatted value inside too, for print and no-JS.
- `<small>` holds the unit (`%`, `M`, `km`, `s`).
- Tone on the stat colours the number: `stat accent|pos|neg|warn`.
- `card stat accent` = filled accent card. For a white card with an accent number, nest:
  `<div class="card"><div class="stat accent">…</div></div>`.
- Numbers shrink automatically to fit their card; `stat-row` columns are proportioned to the numbers.

## Charts (data-driven)

Write the data as attributes; the engine draws, labels and animates the chart. Values may be
decimals; the label shows the value as written (`data-text` overrides it).

### Vertical bars

```html
<div class="vchart" data-max="100" data-suffix="%" style="--h:480px" data-ref="47.9" data-ref-label="baseline 47.9%">
  <div class="grp" data-label="Topic mastery">
    <i data-v="74" data-tone="muted" data-name="Simulated data"></i>
    <i data-v="50.9" data-tone="neg" data-name="Real students"></i>
  </div>
  <div class="grp" data-label="Pacing"><i data-v="93" data-tone="muted"></i><i data-v="56" data-tone="neg"></i></div>
</div>
```

`data-name` on the first group builds the legend. Without `.grp`, each `<i data-label>` is its own
bar. `data-ref` draws a dashed reference line (baseline, target).

### Horizontal bars (rankings, importance, survey shares)

```html
<div class="hchart" data-max="25" data-suffix="%">
  <i data-v="23.4" data-label="Attempt rate" data-tone="accent"></i>
  <i data-v="6.9" data-label="Score ratio"></i>               <!-- default tone muted -->
</div>
```

Highlight the bars the title talks about with a tone; leave the rest muted. Add `data-hl` to bold a row.

### Dot plot (small differences on a zoomed axis)

```html
<div class="dotplot" data-min="66" data-max="72" data-step="1">
  <i data-v="69.6" data-label="Ensemble" data-hl></i>
  <i data-v="69.3" data-label="Gradient boosting" data-tone="pos"></i>
  <i data-v="68.6" data-label="Decision Tree"></i>
</div>
```

Use instead of bars when values are close and the axis does not start at zero; state the axis range
in the label above it.

### Heat map / confusion matrix

```html
<div class="heat" data-cols="Weak|Needs practice|Strong" data-rows="Weak|Needs practice|Strong"
     data-values="843,178,18;120,1637,358;35,675,552" data-mode="row" data-diag></div>
```

`data-mode="row"` shades by row share and prints row percentages, `all` shades by global max,
`none` prints counts only. `data-diag` outlines the diagonal. Lists use `|`, rows `;`, values `,`.

### Donut (one proportion)

```html
<div class="donut" data-v="51.5" data-label="balanced accuracy" data-tone="accent" style="--size:330px"></div>
```

Two donuts side by side (model vs baseline) read well; never more than three.

### Mix bar (composition that sums to 100)

```html
<div class="mix" data-parts="weak:23.6:neg|needs practice:46.1:warn|strong:30.3:pos"></div>
```

## Flows and processes

```html
<div class="flow numbered">                 <!-- arrows and number badges added automatically -->
  <div class="node"><b>Collect</b><span>one short line</span></div>
  <div class="node alt"><b>Clean</b><span>…</span></div>      <!-- alt = warm tint (external step) -->
  <div class="node hl"><b>Model</b><span>…</span></div>       <!-- hl = the step this talk is about -->
</div>
```

For a two-row "snake" (more than four steps), place nodes and arrows on a grid explicitly; arrows
are `.arrow`, `.arrow left`, `.arrow down`:

```html
<div class="flow-grid" style="grid-template-columns: 1fr 70px 1fr 70px 1fr 70px 1fr; grid-template-rows: auto 64px auto">
  <div class="node" style="grid-column:1; grid-row:1"><span class="badge">1</span><b>Step</b><span>…</span></div>
  <div class="arrow" style="grid-column:2; grid-row:1"></div>
  …
  <div class="arrow down" style="grid-column:7; grid-row:2"></div>
  <div class="node" style="grid-column:7; grid-row:3">…</div>
  <div class="arrow left" style="grid-column:6; grid-row:3"></div>
</div>
<div class="legend mt"><span><i class="alt"></i>External step</span><span><i class="hl"></i>This work</span></div>
```

Nodes: 2–6 words in `<b>`, one short line in `<span>`.

## Timeline

```html
<div class="timeline">
  <div class="done"><div class="when">2023</div><div class="what">Prototype</div><div class="why">one line</div></div>
  <div><div class="when">2025</div><div class="what">Launch</div><div class="why">one line</div></div>
</div>
```

`done` fills the dot. 3–6 items.

## Segmented bar (what comes before, during, after)

```html
<div class="seg">
  <div class="t-muted" style="--f:22"><b>Before</b>context</div>
  <div class="t-accent" style="--f:26"><b>Now</b>features</div>
  <div class="t-pos" style="--f:52"><b>After</b>outcome</div>
</div>
```

`--f` sets relative width. Tones: `t-muted t-accent t-pos t-neg t-warn`.

## Comparison

```html
<div class="vs">
  <div class="card">…option A…</div>
  <div class="mid">vs</div>
  <div class="card">…option B…</div>
</div>
```

Also: before/after, myth/fact, plan/actual. Keep the two cards structurally identical.

## Callout and equation

```html
<div class="callout">The one sentence you want remembered, with <b>the number</b>.</div>
<div class="callout neg|pos|warn">…</div>
<div class="card ink"><div class="label">Score</div><div class="eq mt-s">R = 0.6 · S + 0.4 · M</div></div>
```

## Quote

```html
<section class="slide"><p class="quote">A short, real quotation.</p><p class="cite">Name, role, year</p></section>
```

Quotes must be real and attributed. Works beautifully on a photo slide (`data-bg`, `data-scrim="bottom"`).

## Lists

```html
<ul class="points"><li><b>Lead phrase</b> and a short completion</li></ul>   <!-- max 5 items -->
<ol class="numbered"><li><b>Step</b> explanation</li></ol>                   <!-- ordered steps -->
```

Lists are the weakest exhibit; prefer a flow, timeline, comparison or chart when the content has
structure.

## Chips and pills

```html
<div class="chips"><span class="chip">feature</span><span class="chip accent">key one</span></div>
<span class="pill accent|pos|neg|warn">status</span>
```

Chips list many short terms (features, tools, ingredients); chip text does not count towards the
word budget. Pills label states and categories.

## Images

All images live next to the deck in `img/` (download them with `scripts/fetch-images.mjs`; never
hotlink). Every image needs `alt` text and a credit in `data-source` or `.credit`.

### Full-bleed photo slide

```html
<section class="slide" data-bg="img/hero.jpg" data-scrim="left" data-source="Photo: Name / Unsplash">
  <div class="kicker">Chapter two</div>
  <h1 class="display">Big statement over a photo</h1>
  <p class="lead mt">One supporting line</p>
</section>
```

- `left`: text on the left 1000px, photo visible on the right (pick photos with empty left side).
- `bottom`: text sits at the bottom (quotes, closing lines); `full`: even darkening for busy photos.
- Works with `cover` too (`class="slide cover" data-bg=…`). Text turns white automatically.

### Media (image inside a layout)

```html
<div class="split wide-right">
  <ul class="points">…</ul>
  <div class="media" style="--mh:620px"><img src="img/valley.jpg" alt="…"><div class="cap"><b>Caption title</b>detail</div></div>
</div>
```

- `--mh` minimum height; `--pos` focal point (`style="--pos: center 30%"` on the img).
- `.media.contain` shows the whole image (diagrams, screenshots, logos) instead of cropping.
- `.media.circle` for portraits. `.credit` puts a small credit badge in the corner.

### Gallery

```html
<div class="gallery" style="--cols:3; --rh:330px">
  <div class="media wide"><img src="img/a.jpg" alt="…"><div class="cap"><b>Title</b>detail</div></div>
  <div class="media tall"><img src="img/b.jpg" alt="…"></div>
  <div class="media"><img src="img/c.jpg" alt="…"></div>
  <div class="media"><img src="img/d.jpg" alt="…"></div>
</div>
```

`wide` spans two columns, `tall` two rows; fill the grid exactly (3 columns × 2 rows = 6 cells).

### Figure (screenshots, diagrams with a caption)

```html
<div class="figure"><img src="img/screen.png" alt="…"><div class="caption">What to notice</div></div>
```

## Cover, divider, closing

```html
<section class="slide cover">
  <div class="kicker">Event · date</div>
  <h1 class="display mt">Title as a statement</h1>
  <p class="lead mt">One-line subtitle</p>
  <div class="stat-row bare mt-l">…2–4 headline numbers…</div>
  <div class="byline mt-l"><span>Presenter · role</span><span>Organisation</span></div>
</section>

<section class="slide divider"><div class="num">02</div><h1 class="display mt">Section name</h1></section>

<section class="slide closing">
  <div class="kicker">Conclusions</div>
  <h2 class="title">The answer to the question the talk opened with</h2>
  …three cards with the take-aways…
</section>
```

The closing slide stays up during questions: put the take-aways and contact details on it, never a
bare "Thank you".

## References

```html
<ul class="refs"><li><b>Author (year).</b> Title. Venue.</li></ul>
```

## Build steps (reveal on arrow press)

Add `class="step"` to any element: it stays hidden until the presenter presses → , one step per
press, before the deck moves to the next slide (← hides it again). Use for a punchline, a reveal of
the answer, or bullets that must not be read ahead. Two or three steps per slide at most.

## Speaker notes

```html
<aside class="notes">2–4 spoken sentences: the point, the number to say out loud, the transition.</aside>
```

Press **N** while presenting to show the notes, the elapsed time and the next slide's title.

## Tones

`accent` (main colour, "this is the point"), `pos` (good, growth, correct), `neg` (bad, loss, error),
`warn` (caution, partial), `muted` (context, the rest). Keep meanings consistent across the deck:
if pink means "real students" on one chart it means that on every chart.
