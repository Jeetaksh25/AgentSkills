# Conversion — a landing surface that tells the truth and converts

A conversion surface fails in two ways: it does not communicate (a stranger cannot tell what the
product is) or it communicates falsely (a mockup, a fake logo wall, a countdown that resets). The
second kind is also a legal defect — this reference enforces both.

Everything here is verified by looking at the rendered page as a stranger would, at 375px and on
desktop, with JavaScript enabled and with it disabled for the server-rendered copy.

## 1. Above-the-fold comprehension (CONV-01)

- **Five-second test.** Show a stranger the first screen with no scrolling and have them state back
  (a) what the product is, (b) who it is for, (c) what to do next. Any missing answer means the fold
  is broken — fix the fold, not the copy around it.
- The headline says what the product does, not how it feels. "Run ranked-choice votes without
  spreadsheets" beats "Vote smarter". The subheadline carries the mechanism or the differentiation;
  body copy carries detail.
- Name the audience when the product is vertical: "for HOAs", "for university societies". A generic
  headline aimed at everyone converts no one.
- The message must exist in the server-rendered HTML. Hero text that appears only after hydration is
  absent for the first paint, for crawlers, and on a slow connection.
- Concrete traps: a full-bleed video/illustration with no text; a carousel whose first slide is
  decorative; a tall nav + banner stack pushing the headline below the fold; a cookie banner covering
  the one sentence that explains the product.
- Mobile-first check at 375px: copy that wraps into a wall of text, or a hero image that pushes the
  CTA off-screen, fails the same test.
- No jargon the audience does not use; no internal product names on the public page.

## 2. One obvious action (CONV-02)

- One primary CTA per screen, with **identical phrasing everywhere it appears** — "Start free", not
  "Start free" / "Get started" / "Sign up now" across three pages.
- Visual priority: one filled/high-contrast button; everything else is secondary (ghost, outline,
  link). Equal-weight buttons make the visitor choose instead of act.
- CTA copy states the outcome or the cost: "Create your first poll — free", "Start 14-day trial".
  Never "Submit", "Click here", or "Learn more" as the primary action.
- The primary action must be reachable on mobile without hunting: visible in the hero, and repeated
  lower on the page or in a sticky bar if the page is long. Repeating the *same* primary is good;
  two competing primaries is not.
- Trap: header "Sign up" while the hero button says "Book a demo" — two funnels, neither completed.
- Trap: the CTA lands on a page with no visible next step, or on a login wall, or on a plan the
  visitor did not choose.
- Secondary/destructive actions must not share the primary's styling; that is a UX and a11y defect
  as well as a conversion one.
- The button's rendered label must match the action's effect (a "Continue" that creates an account is
  a dark pattern — §8).

## 3. The not-ready visitor (CONV-03)

- Every conversion page needs a path for the visitor who will not sign up today: docs, a live demo, a
  sample output, pricing, a "how it works" section, or a low-commitment list.
- Prefer a working artefact over a form. A demo poll anyone can try beats "request a demo" for a
  self-serve product.
- The secondary path must not compete visually with the primary (§2), and must not be a dead end: it
  ends in a next step (docs → CTA, pricing → plan comparison, demo → signup).
- Trap: the only non-signup link goes to a "book a call" booking page for an enterprise motion the
  product does not actually have.
- Trap: nav anchors that scroll to an empty or unbuilt section.
- If the product is self-serve, do not gate the evaluation behind a demo request — that is a
  friction tax on the only people who will ever convert.

## 4. Real product visuals (CONV-04)

- Screenshots must be of the **shipped UI**, captured from the running app, with realistic data.
  Never Figma mockups of unbuilt features; never stock photography of people at laptops.
- Refresh visuals in the same batch as the UI change. A screenshot of a previous design is a false
  claim about the product.
- Prefer: a real screenshot of the core screen; a short screen recording or GIF of the primary flow;
  an interactive demo on seeded real data.
- Screenshot hygiene: no personal data, no test/debug chrome (dev overlays, lorem placeholders), no
  half-loaded states; supply a 2x asset via `srcset`/`sizes` instead of upscaling a PNG; check
  legibility at the rendered size.
- Alt text describes the feature shown ("Vote results with instant-runoff rounds"), not "screenshot".
- No UI yet (API/CLI/library)? Show real terminal output or a real API response. Never a stock image.
- Trap: a hero mockup showing a nav, logo or feature the app does not have.
- Trap: a screenshot with a competitor's or a customer's real data visible.

## 5. Pricing clarity (CONV-05)

- If money changes hands, one page must answer, without asking a human: plan names, price and
  currency per billing period, what each plan includes, the enforced limits (seats, usage, storage),
  and whether tax is included.
- Billing period and renewal are explicit at the point of decision, not only in the ToS.
- No hidden fees at checkout. Setup fees, overages, per-seat scaling, minimum terms — on the pricing
  page and visible before the payment form. A total that changes at checkout is a defect.
- Trial terms appear where the trial starts: length, what happens at the end, whether a card is
  required, and the price charged on conversion.
- The pricing page and the app's entitlement checks must agree. If the app enforces a limit the page
  never mentions (or the page promises a limit the app does not enforce), one of them is wrong.
- Annual discount: show both prices and the absolute saving. "Save 20%" with no numbers is not
  clarity.
- Free tier: state the limits, not "free forever" with undefined ones.
- Trap: a plan in the app's billing config that does not exist on the pricing page; currency
  switching that changes the symbol but not the price.
- The pricing page is part of the conversion surface and must pass §1's comprehension test for the
  buyer: what am I paying for, and what happens if I stop.

## 6. Confirmation states (CONV-06)

- Every conversion action ends on a state that confirms it: signup, waitlist join, contact/demo
  request, newsletter subscribe, purchase, invite acceptance, password-reset request.
- Never land on an unrelated page after a successful action — not the homepage, not a generic
  dashboard, not a 404.
- Say what happens next **and when**: "Check your inbox — the link expires in 24 hours", "We reply
  within 2 business days". Promise only what the team honours (LEGAL.md §8/§10).
- The confirmation must survive refresh and back-navigation without re-submitting or erroring
  (post/redirect/get, or an idempotent route). A refresh that re-posts is how duplicate signups and
  duplicate orders appear.
- Purchase confirmation states what was bought, the amount, and how to get a receipt/invoice.
- Post-signup, the first authenticated screen must not be an empty dashboard: it points at the first
  success action (the activation step) with that action highlighted.
- Trap: a `/thank-you` page reachable by anyone with no state check, so it confirms nothing.
- Trap: an email confirmation that says "click the link we sent" when no email is sent.

## 7. Trust, honestly (CONV-07)

- Trust sections work only with real content: named customers with permission, metrics the team can
  stand behind, the real security posture (from the security findings), the real team.
- When there is none, do one of two things:
  1. Build honest structure with a labelled, inert placeholder (`<!-- REQUIRES REAL BUSINESS DATA -->`
     plus a `blocked[]` entry) — see LEGAL.md §1; or
  2. better, replace social proof with **factual capability statements** the code implements:
     "data stored in the EU", "polls are private by default", "encrypted at rest", "delete your
     account yourself". These are verifiable, durable, and true.
- "Trusted by" with no names, a logo wall of companies that never used it, a `5.0` rating with no
  reviews, a "GDPR ready" badge the app has not earned — all P0 honesty findings (LEGAL-10).
- Security-page claims must match the audit: if the second audit found an open IDOR, do not publish
  "enterprise-grade security" while it is unfixed.
- Testimonials need permission and an attributable name/role. Anonymised quotes must be labelled as
  anonymised.
- Certification badges require the certificate, current for the period. Otherwise remove the badge.
- Trust content must also be *legible*: real content in a section beats no section; a placeholder in
  a live section is acceptable only while labelled.

## 8. No dark patterns (CONV-08)

- **Fake scarcity/urgency.** Countdowns that reset on reload, "3 spots left" that never changes,
  "only today" pricing that is permanent. Remove, or make real by tying it to a genuine deadline.
- **Forced continuity.** A trial that converts without a pre-charge reminder, or a "free" plan that
  requires a card and silently starts billing.
- **Obstructed cancellation.** Cancellation must be reachable in the product in no more steps than
  signing up, with no retention maze that ignores the first click. "Contact sales to cancel" is a
  dark pattern and often illegal (LEGAL.md §5).
- **Pre-ticked consent.** Marketing/newsletter checkboxes default to unchecked; bundling marketing
  consent with a purchase or with terms acceptance is not consent.
- **Confirmshaming.** "No thanks, I don't want to grow my business" — remove; neutral decline copy.
- **Roach motel** account deletion and data export (LEGAL.md §7).
- **Misleading buttons.** A "Continue" that subscribes, a "free" that takes payment, a modal whose
  close control is a disguised accept.
- **Hidden costs** revealed only at the last checkout step.
- Verify by walking the funnel as a hostile user and counting the clicks to leave, cancel, or
  withdraw consent. Record the count.
- Dark patterns also corrupt measurement: an inflated trial-conversion number produced by forced
  continuity is not a successful funnel (§10).

## 9. Signup/newsletter expectation setting (CONV-09)

- Double opt-in (confirmation link) for any list. Record consent — `consentedAt`, source, and the
  IP/UA where the jurisdiction requires it — and keep the record.
- State cadence and content *before* collecting the address: "one email a month, product updates,
  unsubscribe anytime".
- Unsubscribe is one click, works immediately, and is reachable from the app as well as the email.
- The confirmation email must come from a domain the product controls with a working link, and it
  must not be sent from a `no-reply` that cannot receive replies for a transactional or relationship
  message.
- Trap: a newsletter checkbox on signup that subscribes every account, with no unsubscribe link in
  the app.
- Trap: a "waitlist" form that collects addresses and never sends anything.
- Every collected address needs a purpose and a retention rule, and must be listed in the privacy
  policy (LEGAL-02). If the policy does not mention the list, either add it or do not collect it.

## 10. Measurement tie-in

- Define the funnel before claiming the surface performs: `landing_view` → `cta_click` →
  `signup_start` → `signup_complete` → `first_success` → `conversion` (subscribed/paid).
  `first_success` is the activation event — the first poll created, the first report generated,
  whatever the product's core value action is.
- Each event carries: a name, where it fires (client or server), its properties, and the question it
  answers. An event nobody queries is noise.
- Instrumentation follows OBSERVABILITY.md §8: no privileged tokens in client code, no PII or
  sensitive payloads, privacy posture consistent with the privacy policy and cookie consent
  (LEGAL.md §3/§4).
- Money and state changes are tracked server-side (subscription created, account deleted) so the
  funnel does not depend on the client surviving a redirect.
- Vanity metrics — page views, scroll depth, dwell time — do not prove the funnel. Track the
  drop-offs that matter: `signup_start → signup_complete` and `signup_complete → first_success`.
- Report numbers, not adjectives: "activation event fires server-side on record creation; funnel
  measured end to end" is evidence; "improved conversion" is not.
- Cross-reference OBSERVABILITY.md (OBS-07, OBS-08) for the analytics implementation rules.

## Checklist mapping

| ID | Item |
|---|---|
| CONV-01 | Value proposition clear above fold |
| CONV-02 | Primary CTA obvious and consistent |
| CONV-03 | Secondary path for not-ready visitor |
| CONV-04 | Real product visuals |
| CONV-05 | Pricing clarity when charging |
| CONV-06 | Confirmation state after conversion |
| CONV-07 | Trust elements only where genuine |
| CONV-08 | No dark patterns |
| CONV-09 | Newsletter/signup confirmation flow |
