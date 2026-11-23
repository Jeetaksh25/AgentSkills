# Content, copy and the metadata surface

A perfect layout around placeholder text is a placeholder. Copy is part of the design brief, and the
highest-leverage anti-slop lever there is: AI-looking pages are usually AI-*written* pages.

## Copy rules

1. **Specific beats clever.** "Turns a 40-line SQL query into a shareable chart in 3 seconds" beats
   "Unlock the power of your data". Numbers, nouns, and mechanics.
2. **Ban the LLM lexicon:** empower, supercharge, seamless, effortless, unleash, elevate, revolutionize,
   game-changing, cutting-edge, next-level, "in today's fast-paced world", "take it to the next level",
   "we're excited to announce". If a sentence would fit any product in the category, it is filler.
3. **Verbs on buttons**, first person where natural: `Start free trial`, `Create project`, `Invite
   teammate` — not `Submit`, `Learn more`, `Click here`. The button says what happens next.
4. **Headlines earn their size**: ≤ 10 words, a claim or a tension, not a category label. Subheads
   carry the mechanism. Body carries proof.
5. **One idea per section**, stated in the first line. If a section needs a paragraph before it makes
   sense, the section is wrong.
6. **Real proof or none.** Never invent metrics, customers, awards, testimonials, or logos. If the
   project has no proof yet, design the honest version (build in public, waitlist, changelog) and
   label the placeholder `<!-- REQUIRES REAL DATA -->` in the source, never in the visible copy.
7. **Microcopy is UX**: field hints, error recovery ("That email is already registered — sign in
   instead?"), empty states with a next action, destructive confirmations that name the object
   ("Delete *Billing API key*?"), and success messages that say what to do next.
8. **Voice consistency**: pick person (we/you), tense, and capitalisation (Sentence case is the safer
   default in product UI) and hold them across every string, including buttons, tooltips and emails.

## Section inventory (choose by content, not by habit)

- **Hero**: value proposition + primary action + the shortest possible proof. Variants worth using:
  asymmetric type-led, split with a real product surface, annotated screenshot, single-metric,
  editorial full-bleed. Avoid: centered headline + two buttons + floating dashboard mockup with
  fake data.
- **Proof**: one strong testimonial with a name, role and company; a real logo wall; a
  metric with its measurement definition; a case-study link. Not: five anonymous quotes.
- **Feature depth**: 1–3 deep features with annotated UI, not nine shallow ones with icons.
- **Objection handling**: pricing honesty, security/compliance, migration effort, "what if I stop".
- **Comparison**: a real table against the actual alternatives beats three identical cards.
- **Process/how it works**: 3–5 steps, each with the artifact produced.
- **FAQ**: real questions, answered in ≤ 3 sentences, first one above the fold of the section.
- **Closing CTA**: restate the value, single action, no new information.
- **Footer**: real navigation, real legal, real status/changelog, contact. Not a wall of links.

## Metadata and share surface (part of the design)

- `title` ≤ 60 chars, specific; `description` ≤ 155 chars, benefit + mechanism; canonical URL.
- OG image designed, not auto-generated: 1200×630, real type at ≥ 48px, brand colour, no text near
  the edges (cropping), legible as a thumbnail.
- `theme-color` matching the page background in both schemes; favicon set; `apple-touch-icon`;
  web manifest for installable surfaces.
- Structured data only where truthful (`Organization`, `Product`, `FAQPage`, `Article`, `SoftwareApplication`).
- Social handles and preview verified with a real card debugger when available.

## Imagery

- **Real product surfaces** beat abstract 3D blobs. Screenshot the actual UI, annotate it, and let it
  carry the section.
- If illustration is needed, use a coherent set (one library, one stroke weight, one palette).
- Photography needs a consistent grade and crop ratio; never mix stock styles.
- Every image: explicit dimensions (no CLS), `loading="lazy"` below the fold, `priority` for the LCP
  image, modern format (AVIF/WebP), meaningful `alt` for content images, decorative `alt=""` otherwise.
- Never ship a screenshot with visible browser chrome, a cursor artifact, or fake lorem UI inside it.

## The final read-through

Read the whole page aloud. Any sentence that a human would not say gets rewritten. Then check: does
every heading make sense with the images removed? Does every button alone explain its outcome? Would
a competitor's name fit in this copy? If yes, it is still generic.
