# Content: story, words, notes and sources

The engine makes slides look professional; content makes them worth watching. This guide applies to
any deck for anyone: a class project, a pitch, a workshop, a wedding slideshow, a book report, a
travel night, a kids' science fair.

## 1. Brief (decide before writing)

| Question | Default when the user does not say |
|---|---|
| Who is the audience and what do they already know? | Smart non-experts |
| What should they think, feel or do afterwards? | Understand one main idea |
| Where is it shown? (projector, laptop, online, kiosk) | Projector in a room |
| How long is the talk? | 10 minutes |
| Tone? (academic, playful, inspiring, formal, warm) | Match the topic |
| Source material? (files, notes, links, data) | Ask once if facts are needed |
| Images wanted? | Yes for story, event and product decks; selective for academic ones |

Slide count: about **1 slide per minute** (0.7 for data-heavy talks), plus cover and closing. Cap a
regular talk at ~18 slides; move extras to an appendix after the closing slide.

## 2. Archetypes

| Deck | Arc | Typical exhibits | Theme |
|---|---|---|---|
| Class or research project | problem → method → data → results → limits → conclusion | flow, charts, heat map, stats | paper / swiss |
| Pitch or proposal | pain → solution → how it works → proof → plan → ask | vs, flow, stats, timeline, donut | midnight / swiss |
| Product launch | moment → product → features → demo → pricing → availability | photo slides, media, chips, stats | midnight |
| Workshop / training | goal → steps → practice → pitfalls → recap | numbered list, flow, callout, steps | paper |
| Event, wedding, birthday, farewell | welcome → story chapters → moments → thanks | photo slides, gallery, timeline, quote | editorial |
| Travel or story night | hook → journey → highlights → lessons | photo slides, gallery, timeline, stats | editorial |
| Book or film report | context → plot arc → characters → themes → opinion | timeline, vs, quote, media | editorial |
| Kids / school | question → fun facts → how it works → try it → recap | big stats, media, donut, steps | swiss / paper with a bright accent |
| Portfolio | who → selected work → process → contact | gallery, media, flow | swiss / midnight |
| Status update | headline → progress → metrics → risks → next | stats, hchart, timeline, callout | paper |

## 3. Action titles

Every content slide title is a **complete sentence that states the takeaway**, not a topic label.

| Weak (label) | Strong (action title) |
|---|---|
| Results | On unseen students the model is right 69% of the time and almost never badly wrong |
| Day 2 | The forest pass was the steepest climb, and it nearly broke us |
| Market | Students spend 6 hours a week searching for notes they already wrote |

Ghost-deck test: read only the titles in order. They must tell the whole story. If they do not, fix
the outline before writing slides.

## 4. Word budget

- Body text: **40–80 words** per content slide (QA warns above 80 and fails above 110).
- Cards: a heading plus at most two short sentences.
- Lists: max five items, each one line.
- Put the explanation in the speaker notes, not on the slide.

## 5. Variety and rhythm

- At least **60%** of content slides carry a visual exhibit (chart, flow, stats, image, comparison).
- Never the same layout three slides in a row (QA warns).
- Open strong (photo or big statement), alternate dense and light slides, and end on the answer.
- Use a divider slide between major parts of a deck longer than ~12 slides.

## 6. Speaker notes

Every slide gets `<aside class="notes">` with 2–4 sentences the presenter can say out loud:
the point of the slide, the one number to say, the transition to the next slide. When the user said
they must explain things aloud, notes are mandatory, plain-language and specific.

## 7. Facts, numbers and honesty

- Use the user's material first. Every number on a slide must come from a source the user gave or
  one you cite in `data-source`; never invent statistics, quotes, testimonials or results.
- Missing a value? Ask, or leave the slide out. Do not ship stand-in text: QA fails `⟦…⟧`, `[[…]]`,
  to-be-decided markers and lorem ipsum.
- Round consistently, keep units, and show baselines so numbers mean something.
- Quotes must be real and attributed.

## 8. Images from the internet

1. **Plan**: decide which slides need a photo (cover, chapter openers, highlights, closing). Write
   what each one must show and where the empty area for text must be.
2. **Find** with web search or the browser, preferring free-licence sources:
   - Unsplash (`images.unsplash.com/photo-…?w=2400&q=80`) and Pexels (`images.pexels.com/photos/…`):
     free to use, credit the photographer anyway.
   - Wikimedia Commons (`upload.wikimedia.org/...`): check the licence on the file page, credit as
     stated (CC BY / BY-SA require it).
   - Official press kits for products, places and organisations.
   - Avoid: watermarked stock, images of private people, logos used out of context, anything the
     user would not have the right to show.
3. **Download** into the deck folder so it works offline:
   `node scripts/fetch-images.mjs <deck-dir> --manifest images.json` (or `name=url` pairs). The
   script verifies the bytes are an image, caps size, and writes `img/credits.json`.
4. **Use** `img/<name>.jpg` in `data-bg` or `<img>`, add `alt`, and put the credit in the slide's
   `data-source` (or a `.credit` badge).
5. **Check** in the snapshots that text never covers a face or the subject, and adjust focal points.

If no suitable free image exists, use a typographic or chart slide instead; never ship a random
stock photo just to fill space.

## 9. Accessibility

- 20px minimum rendered text, WCAG contrast (both enforced by QA).
- Never rely on colour alone: label bars and states with text.
- Alt text on every image; describe what matters, not "image of".
- Keep motion purposeful; reduced-motion users get a static deck automatically.
