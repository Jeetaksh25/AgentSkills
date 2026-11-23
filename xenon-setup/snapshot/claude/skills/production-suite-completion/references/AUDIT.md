# Audit — finding what is actually wrong

The audit is the highest-leverage step. A shallow audit produces a cosmetic pass; this skill's value
comes from finding the defects that compile, typecheck and pass unit tests while still being broken
for a real user.

## Method

1. **Enumerate the surface.** Every route (page and API), every server module, every model/schema,
   every config file, every background/async path, every external integration. Produce the list
   before judging anything; a route you never opened is a route you never audited.
2. **Read the real code for each item.** Not the README, not the comments — they describe intent,
   and the gap between intent and implementation is exactly where the findings live.
3. **Exercise it live.** Hit the API, load the page, submit the form, fail the network.
4. **Record findings with severity and evidence.** `file:line` or a captured request/response.
   A finding without evidence is a guess, and guesses create busywork.
5. **Diff against the checklist.** `assets/checklist.json` is the floor, not the ceiling. Anything
   domain-specific the app needs (payments, file uploads, real-time, multi-tenancy) is added to the
   state file's `findings` with a made-up ID and a severity.

## Severity ladder

- **P0 — blocks real users or loses data.** Auth bypass, secrets in the repo, unbounded query on a
  growing collection, a rate limiter that collapses to one shared bucket on the real host, a
  production-only crash, broken payment or data-loss path, 200 responses for missing resources.
- **P1 — visibly broken or unsafe at scale.** Missing pagination, client-side-only enforcement,
  unindexed hot query, silent failures with no diagnostics, missing states, a11y failures on core
  flows, missing CI gate, no tests.
- **P2 — polish, correctness, operational gap.** Inconsistent copy, missing breadcrumbs, dead
  dependency, missing structured data, docs drift.

Ask of every finding: *what happens at 10k users / with a hostile client / on a slow phone?* That
question produces the P0s that ordinary reading misses.

## Where the real defects hide

Check these deliberately — they are the categories that pass casual review:

**Trust boundaries.** Client-side route guards; ownership checked at the route but not the record
(IDOR); "internal" endpoints callable by anyone; rate-limit keys derived from spoofable headers
(X-Forwarded-For without a trusted-proxy check) or collapsing to a constant; identity taken from the
request body rather than the session; authorization performed but its result discarded.

**Unbounded work.** List endpoints without a limit; aggregations that scan the whole collection;
a dashboard that loads every record of a growing collection then filters in the browser; a sitemap
or export that queries thousands of documents per request; a search that regex-scans an unindexed
field on every keystroke. Ask: *does this query grow with the data?* If yes, it is a P1.

**Concurrency and correctness.** Read-then-write races; counters updated outside the transaction;
uniqueness enforced after a `findOne` rather than by the database; a normalization applied on write
that differs from the normalization used for dedupe in the UI (the classic: server keeps
punctuation, client strips it, so duplicates exist while the UI blocks them).

**Silent failure.** A 500 path that logs nothing; a caught error swallowed with an empty block;
`console.log` in place of structured logging; no request/correlation ID; error messages that leak
internal class names; a user-visible error ID that cannot be traced to a log line.

**Configuration reality.** Rate limiting that only works on one host; cache headers that assume a
CDN; `NODE_ENV`-dependent behaviour that differs in production; a health endpoint that reports
unhealthy in a legitimate deployment; connection pools sized for a long-lived server but deployed on
serverless; indexes created on every request.

**State and lifecycle.** Loading states that never render; optimistic updates that never roll back;
focus lost to `<body>` when a panel closes; a confirm dialog for some destructive actions and
`window.confirm` for others; duplicate submits producing duplicate records; empty vs filtered-out
emptiness conflated.

**Honesty.** Fabricated trust content; a legal page describing data the app does not collect;
structured data claiming ratings that do not exist; a "response within 24 hours" promise nobody can
keep. These are P0 for a commercial product even though no test catches them.

## Adversarial second audit

Run this **after** the checklist is nominally complete, with a deliberately different lens. Read the
product as ten different people and write down what each one hits:

1. **First-time visitor** — understands the value in one screen? primary action obvious?
2. **New user** — signup, verification, first success, first empty state.
3. **Returning user** — deep link, session expiry, bookmarks, back button.
4. **Mobile user** — 375px width, thumb reach, sticky actions, tap targets, keyboard overlay.
5. **Slow-network user** — throttled: skeletons, blocked rendering, double submits, timeouts.
6. **User who errs** — wrong input, duplicate, offline mid-action, permission denied. What is
   recoverable? What is silently lost?
7. **Search engine** — rendered head, canonicals, sitemap, 404 status, private pages excluded.
8. **Screen-reader user** — heading order, announcements, focus order, control names, decorative noise.
9. **Maintainer** — can a stranger run it? Are commands documented? Is there dead code, duplicated
   utility, unexplained magic?
10. **Production operator** — deploy, rollback, logs, health, alerts, migrations, backups.

Also run the reverse question on every completed batch: *what did I change that could break something
that already worked?* Caching, CSP and auth changes are the usual suspects.

## Finding triage

- Two findings with one root cause → one fix, listed once. Fixing symptoms one at a time is how runs
  become endless.
- A finding that requires a product decision → implement the conservative version, note the
  assumption, list it in the report.
- A finding that requires an external input → `blocked` with the named need.
- A finding outside the product's scope → `n/a` with a one-line reason. Do not silently drop it.
