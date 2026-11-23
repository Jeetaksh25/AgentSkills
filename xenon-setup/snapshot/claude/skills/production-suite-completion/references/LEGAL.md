# Legal & trust — truthful pages, real mechanisms

Most legal findings in a production audit are honesty findings, not compliance findings: the
fabricated testimonial, the privacy policy describing an analytics tool the app never installed, the
"cancel anytime" that needs an email to support. Each is a user-visible defect with no test that
catches it. Treat this domain as content correctness, verified like any other claim — read the
rendered page, compare it against the implementation, record the comparison.

Legal text is jurisdiction-specific. This reference verifies **truthfulness and mechanism**, not
legal sufficiency. A page claiming "reviewed by counsel" must actually have been reviewed; otherwise
it is another fabricated claim.

## 1. The honesty rule (P0)

- Never fabricate: testimonials, customer names or logos, usage statistics ("10,000 teams"),
  uptime/response-time SLAs, certifications (SOC 2, ISO 27001, HIPAA, "GDPR-compliant"), awards,
  press mentions, team identities, prices, or company registration details.
- Every trust claim resolves to a real, inspectable fact. "Trusted by 10,000 users" needs a query
  returning 10,000, or it is deleted. There is no third option.
- **Placeholder discipline.** When real data does not exist, build the structure and mark it so it
  cannot ship silently: `<!-- REQUIRES REAL BUSINESS DATA -->` in the markup plus an entry in the
  state file's `blocked[]`. A placeholder that renders as plausible fake content is worse than an
  empty slot.
- Placeholders must be visually inert: commented out, or a labelled stub ("Testimonials pending —
  requires real customer quotes"). Never render lorem-ipsum styled as a real quote, and never render
  a `5.0` rating from a hardcoded constant.
- Unsubstantiable content is removed, not softened. "Best in class" → delete. Do not reword as "a
  great choice" and call it fixed.
- Grep the whole repo for the suspects and inspect every hit:
  `testimonial|trusted by|\b[0-9,]{3,}\+?\s*(users|customers|teams)|SOC ?2|ISO ?27001|99\.[0-9]+%|rating|review|as seen in|award|enterprise-grade`.
- Structured data is a claim too: `aggregateRating`, `review`, `award`, `foundingDate`, `address`
  in JSON-LD are assertions about the business. Fabricated ratings are both a lie and a
  search-policy violation.
- Severity: fabricated trust content is P0 for a commercial product even though no test fails.

| Claim | What makes it true | If it cannot be verified |
|---|---|---|
| "99.9% uptime" | monitoring data over a stated window | delete, or restate as a commitment the team can meet |
| Logo wall | permission, and evidence each used the product | delete, or replace with factual capability statements |
| "5.0 from 200 reviews" | the 200 reviews, exported and visible | delete |
| "SOC 2 Type II" | the report, current period | delete the badge |
| "GDPR compliant" | the mechanisms below (§3, §4) actually implemented | replace with what is true ("data stored in EU", "delete your account yourself") |

## 2. Terms of Service — required sections

A page with three paragraphs is not a contract. For a product with accounts, cover these sections;
each must describe what the service actually does.

1. **Acceptance** — what using the service signifies, the effective date/version, how changes are
   communicated.
2. **Eligibility** — minimum age, jurisdictional restrictions, prohibited regions.
3. **Account responsibilities** — accurate information, credential custody, one account per
   person/organisation *if that is enforced*, notification of unauthorised use.
4. **Acceptable use** — the concrete prohibition list, matching the enforcement the product has
   (§6).
5. **Prohibited activity** — illegal use, scraping, reverse engineering, circumventing quotas or
   rate limits, reselling without a licence.
6. **Intellectual property** — who owns the service, who owns user content, trademarks.
7. **User-content licence** — the licence the operator needs to host/display/process user content:
   scope, duration, sublicensable to processors, and how it ends on deletion.
8. **Payments and subscriptions** — processor, billing period, renewal mechanics, price-change
   notice, taxes.
9. **Cancellation and refunds** — see §5.
10. **Availability** — only what the operator can honour. No invented SLA.
11. **Third-party services** — the app depends on them; their terms also apply.
12. **Disclaimers** — "as is" to the extent the governing law permits; do not paste US boilerplate
    into an EU consumer context.
13. **Limitation of liability** — a cap consistent with the jurisdiction; consumer rights cannot be
    contracted away.
14. **Termination** — both directions, notice, what happens to data.
15. **Account deletion** — the route and its effect (§7).
16. **Governing law and venue** (§9).
17. **Contact** — a real, monitored channel (§8).
18. **Changes to the terms** — notice method and effective date.

- Version the text (effective date in the page *and* in the repo) so "you agreed to the version that
  existed then" is answerable.
- A section promising behaviour the product lacks is a defect: an availability clause beside an app
  with no health endpoint, a "we notify you 30 days before changes" with no mechanism, a refund
  clause that contradicts the checkout screen.
- Do not present model/template text as jurisdiction-appropriate. If nobody drafted it for the real
  entity, say so in `blocked[]` rather than implying review.

## 3. Privacy Policy that matches the implementation

Write it from the code, not from a template. Enumerate each data type in a table like this, derived
by reading the code:

| Data | Where it enters | Where it lands | Why | Retention |
|---|---|---|---|---|
| account email | signup form | users collection, sessions | auth, transactional mail | until account deleted |
| hashed password | signup form | users collection | authentication | until account deleted |
| IP + user agent | every request | platform logs, error tracker | abuse prevention, debugging | e.g. 30 days |
| poll responses | the vote form | votes collection | core product | until poll/account deleted |
| billing metadata | checkout | payment processor, subscriptions | billing, tax | statutory period |

- Every processor/vendor named must be one the app actually calls. Enumerate from network calls,
  `package.json` dependencies, and env vars pointing at third-party endpoints. A named vendor the
  app does not use is a false statement; a used vendor the policy omits is a worse one.
- The opposite failure: promising a right the product cannot fulfil ("email us to export your data"
  with no export path and an unmonitored inbox).
- Retention is a number or a precise rule, never "as long as necessary". Derive it from session TTL,
  log retention window, and backup retention.
- User rights must name the mechanism per right: access, correction, deletion, export, objection,
  consent withdrawal. "You may contact us" is not a mechanism unless §7 implements it.
- Data the app *does* collect and the policy omits is the dangerous direction: server logs with IPs,
  error-tracker payloads, cookie identifiers, browser telemetry, payment metadata. Audit those paths
  explicitly.
- State the negative claims the product honours: "we do not sell personal data", "we do not use your
  content to train models" — only when the code supports it.
- Name where data is stored (region of the database/host) and whether it crosses borders.
- Children/special categories: if the product is not for minors, say so and enforce age in
  eligibility, or the clause is decorative.
- The policy must be reachable, dated, and versioned the same way as the ToS.

## 4. Cookies and consent

- Inventory first: enumerate every cookie and storage key the app sets — name, purpose, lifetime,
  first/third-party, essential or not. Capture it in a real browser (devtools → Application →
  Cookies/Storage) on a **logged-out first visit**, then after consent.
- **Essential** means strictly necessary to deliver a service the user requested: session/auth,
  CSRF token, load-balancer affinity, the consent state itself, locale when the request needs it.
- Everything else is non-essential: analytics, ads, A/B assignment, embedded media, session replay,
  product telemetry. Treat it as consent-required.
- Only build a consent banner if non-essential cookies exist. A banner in front of an app that sets
  one session cookie trains users to click through the real one.
- Consent must be: **prior** (nothing non-essential is set before it), **granular** (analytics ≠
  marketing), **as easy to refuse as to accept** (a "Reject all" of equal prominence — no
  burying it behind a second click), and **revocable** (a persistent link reopens the panel).
- Blocking must be real: gate the script, not the banner. A banner that loads the analytics tag and
  then "asks" is the most common fake in this domain. Verify in the network panel that the request is
  absent before consent and present after.
- Third-party scripts injected by the platform are still yours to declare. Enumerate them.
- Consent state in a first-party cookie/localStorage is itself essential and needs no consent.
- The cookie policy page must match the inventory. A stale list is a finding, not cosmetics.

## 5. Money: refunds, cancellation, renewal

- If the product charges, publish: price, currency, billing period, what is included, the limits,
  when renewal happens, how to cancel, and the refund position.
- Cancellation must be self-service in the product. "Email support to cancel" is a dark pattern and,
  in several jurisdictions, a legal problem.
- State the refund rule concretely: "full refund within 14 days; pro-rated thereafter", or "no
  refund after the current period starts, access continues to period end". An ambiguous refund clause
  becomes a chargeback.
- Trial → paid must be disclosed where the trial starts: conversion date, price, whether a card is
  required. Not only in the ToS.
- Price changes: notice period and effect on existing subscribers.
- Taxes: state whether displayed prices include tax and who is responsible for it.
- Failed payment: retries, grace period, and what happens to the user's data during grace.
- The app's subscription state must agree with the policy. If the policy promises access until period
  end, the app cannot hard-lock on cancel.

## 6. Acceptable use and UGC moderation

- A user-generated-content product needs an acceptable-use section **and** moderation levers that
  exist. A prohibition list with no report button, no delete and no block is a promise the product
  does not keep.
- Enumerate the levers, then verify each in the running app: report/flag on content, block between
  users, delete by author and by moderator, suspend/ban an account, rate-limit posting, content
  length and upload caps, link/profanity filtering *if the policy claims it*.
- Match the policy to what is enforced. If the policy forbids spam but nothing rate-limits posting,
  either implement the lever or soften the claim to what is true.
- The report flow tells the reporter what happens next, and moderators can see the queue. A
  documented manual query is acceptable **if it is written down** in the operator doc.
- Define what "delete" means (immediately hidden vs purged, and the backup window) and keep the
  policy consistent with §7.
- If third-party content is hosted at scale, provide a copyright takedown route with a named contact
  and a stated counter-notice position.
- If eligibility excludes minors, enforce (or state the absence of) an age gate.

## 7. Links, acceptance capture, and deletion

- **Footer placement.** Terms, Privacy, and (where applicable) Cookies / Acceptable Use / Refunds are
  linked from a global footer on *every* page: marketing pages, the authenticated app, error pages,
  and any standalone checkout or embed. A footer that only exists on the landing page means the app
  has no legal links.
- **Signup placement.** The signup form links the ToS and Privacy Policy next to the acceptance
  action, and the copy says what submitting means.
- **Acceptance capture.** Record *that* the user accepted, *which version*, and *when*: e.g. a
  `termsVersion` + `acceptedAt` on the user record, or an immutable acceptance row. Verify by
  creating a scratch account and reading the stored values.
- **Deletion** must be a real self-service route (settings → delete account), which:
  - requires re-authentication or a typed confirmation, because it is destructive;
  - revokes sessions and tokens — prove both reads *and* writes fail with the old session afterwards;
  - deletes or irreversibly anonymizes records across **every** store: primary DB, sessions/tokens,
    uploads/object storage, derived aggregates/counters, search indexes, caches;
  - states what is retained, why, and for how long (invoices for tax, abuse logs);
  - resolves the unique-identifier question: either free the email for reuse or state that it stays
    reserved — a silent "soft delete" that also blocks re-signup is the worst of both;
  - ends with a confirmation the user can keep.
- "Email us to delete your account" is a documented fallback for edge cases, never the mechanism.
- Data export, where promised, follows the same rule: a working route, not an inbox.

## 8. Contact and support

- Publish at least one monitored channel: a support alias on a domain the product controls, or a form
  that lands where a human reads it. A personal Gmail address is a finding.
- Do not promise a response time the team cannot keep. "We reply within 2 business days" requires
  someone who does; otherwise state the truth or omit the number (§10).
- Keep the support route reachable **without logging in** — the locked-out user is the one most
  likely to need it.
- Verify the channel operates: send a test message and record that it arrived. Mail to an alias that
  bounces silently is worse than no alias.
- Legal pages link the contact route (ToS §17, Privacy Policy contact).

## 9. Company identity and jurisdiction

- The footer and legal pages carry the operating entity, registered address where required, contact,
  and jurisdiction.
- When these are unknown, do not invent them. Use a labelled placeholder
  (`<!-- REQUIRES REAL BUSINESS DATA -->`) and record a `blocked[]` entry naming exactly what is
  needed (legal entity name, address, registration number, jurisdiction choice).
- The governing-law section must name a jurisdiction. If the operator has not chosen one, mark it
  blocked rather than defaulting to Delaware.
- Registration/VAT numbers and addresses are facts. Placeholders, never guesses.

## 10. FAQ honesty

- Every FAQ answer describes behaviour that exists today. Walk each entry against the product: does
  the feature do what the answer says, in the time it says?
- FAQ is where invented SLAs and capabilities hide: "we back up hourly", "you can export anytime",
  "support replies within 2 hours", "we never share your data". Verify each or delete it.
- Answers state limitations honestly. "Exports include your records; attachments are not included
  yet" beats silence and beats a wrong promise.
- Remove marketing answers that dodge the question. If the honest answer is "not supported", say so.
- Cross-check FAQ claims about data, refunds, deletion, and security against §3, §5, §7 and the
  security findings — the FAQ and the policy must not contradict each other.

## 11. Copyright and attribution

- The footer copyright line is accurate: correct entity, current year (`© 2026 <Entity>` — computed
  or updated in the same pass, never a stale hardcoded year), and no claim over content the operator
  does not own.
- Attribution obligations must be shipped: fonts (SIL OFL requires the notice), icons (MIT/CC-BY
  attribution), images (licence + author), code snippets, map/data providers. Maintain a licences
  page or `THIRD-PARTY-NOTICES`, and remove assets whose licence cannot be established.
- Do not strip licence headers from vendored code, and do not ship a rights-managed font or image
  without a licence.
- User content ownership stays with the user; the operator's claim is the licence in §2.7, not
  ownership.
- Screenshots and OG images containing third-party logos need permission.

## 12. Verification (evidence for this domain)

| Item | Evidence |
|---|---|
| ToS / Privacy / Cookie pages | URL, list of rendered section headings, effective date |
| No fabrication | repo-wide grep hits inspected; each surviving trust claim mapped to a query or file |
| Cookie inventory | devtools cookie/storage dump on a logged-out first visit, before and after consent |
| Consent blocking | network panel shows the non-essential request absent before consent, present after |
| Acceptance capture | the scratch signup's stored `termsVersion` + `acceptedAt` |
| Deletion | post-deletion login fails, the old session token is rejected on read and write, records absent (`count = 0`), unique email reusable if promised |
| Contact | a test message and its observed arrival/response |
| Link placement | each legal page reached from the footer on marketing, app, and error pages |

Every fix here is `fixed` until you have read the rendered page and the stored value. Content changes
are verified by reading the page, not by reading the diff.

## Checklist mapping

| ID | Item |
|---|---|
| LEGAL-01 | ToS describes real service |
| LEGAL-02 | Privacy Policy matches implementation |
| LEGAL-03 | Cookie policy and consent |
| LEGAL-04 | Refund and cancellation policy |
| LEGAL-05 | Acceptable use for UGC |
| LEGAL-06 | Legal links in global footer |
| LEGAL-07 | Terms acceptance captured at signup |
| LEGAL-08 | Self-service account deletion |
| LEGAL-09 | Contact and support route |
| LEGAL-10 | No fabricated trust content |
| LEGAL-11 | Company identity and jurisdiction |
| LEGAL-12 | FAQ answers truthful |
| LEGAL-13 | Copyright notice accurate |
