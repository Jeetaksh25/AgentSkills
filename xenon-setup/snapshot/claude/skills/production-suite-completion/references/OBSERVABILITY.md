# Observability — logs, ids, errors, alerts

You cannot fix what you cannot see. The observability findings in an audit are usually absences:
no request id, no log line on the 500 path, no error tracker, no uptime check, no owner for the
alert. This domain is verified by **breaking something on purpose** and reading the output.

Verify against a production-mode server. A dev server's pretty-printed output, its stack traces and
its hot reload hide exactly the failures this domain is about.

## 1. Structured logging (OBS-01)

- **One logger**, created once and imported everywhere. Not `console.log` scattered across modules,
  not two logger instances with different formats, not a logger per module with divergent fields.
- Log **keyed fields**, not interpolated strings: `log.info("request", { method, path, status, ms })`
  emits machine-parseable JSON. `log.info(\`GET ${path} ${status}\`)` cannot be queried, grouped, or
  alerted on; parsing it back out of prose is a defect.
- Consistent field names across the codebase (`requestId`, `durationMs`, `statusCode`, `userId`).
  Pick one spelling per concept — `duration` in one module and `ms` in another makes aggregation
  impossible.
- Log levels carry meaning:
  - `debug` — local diagnosis, off in production.
  - `info` — a completed unit of work: request completed, job finished, user action with business
    meaning.
  - `warn` — the request succeeded but something needs attention: fallback used, retry, deprecated
    path, validation rejected, quota near limit.
  - `error` — an operation failed and someone may need to act. Every `error` is a potential alert.
- Do not log an expected 401/404 from a hostile client at `error`; that trains the team to ignore the
  level. Log auth failures at `warn` with the reason, and rate-limit hits at `info`/`warn`.
- **Every request produces one line on completion** with at minimum: `requestId`, `method`, `path`
  (route pattern, not the raw URL with query strings), `status`, `durationMs`, and `userId` when
  authenticated. Without this, latency and error-rate questions can only be answered by guessing.
- One line per request, not one per middleware step. Multiple partial lines per request make counting
  impossible.
- Levels and redaction configured by environment; no `debug` firehose in production (cost, and PII
  exposure via headers).
- Trap: logging inside a `try` with the log statement after the throwing call so it never runs.
- Trap: the logger writes to stdout only, and the platform does not capture or retain it. Verify the
  line is retrievable in the deployed environment, not just visible locally.

## 2. Correlation IDs (OBS-02)

- Generate a request id **at the edge** (middleware/proxy, or the first handler): accept a
  well-formed inbound `X-Request-Id` if a trusted platform sets one, otherwise generate
  (`crypto.randomUUID()`), and never trust an arbitrary client value into logs unvalidated or
  unbounded (length-cap and character-restrict it).
- Return it in the response header (`X-Request-Id`) on success **and** on error, including 4xx/5xx
  and streaming/timeout paths.
- Include it in every log line for that request — the request line, the error line, any job it
  spawns, and any outbound call (downstream API header, DB context, email send).
- Thread it through async work: a background job or a queue consumer logs the originating
  `requestId`, or the chain breaks at the boundary and the trace dead-ends.
- Attach it to the error-tracker event so a report maps to the same id.
- **The payoff is the round trip**: a user reports an id from an error page, and one search returns
  the whole trace — request line, error line, stack, timing. Verify exactly that round trip (§10).
- Trap: the id is generated in a logger wrapper that is instantiated per module, giving multiple ids
  per request.
- Trap: the id is in the response header but the 500 path bypasses the middleware and logs nothing —
  the id exists but traces nothing (§3).

## 3. The 500 path (OBS-03) — P0

- An unhandled error that returns a generic "Something went wrong" with **no server-side log** makes
  every incident undebuggable: the user sees the failure, the operator sees nothing. This is a P0
  even though the app "works".
- The error handler must: log at `error` with the full stack, the `requestId`, the route, method,
  status, and the authenticated subject; then return a safe generic body (plus the request id) to the
  client. Never a stack trace, never an internal class or collection name, never a query fragment
  (see SECURITY.md §4/§5).
- A global handler must exist for both flavours of failure:
  - synchronous/async thrown errors reaching the framework's error boundary;
  - unhandled promise rejections and uncaught exceptions at the process level (log, then exit
    cleanly so the supervisor restarts a known-bad process rather than leaving it in an undefined
    state).
- Framework error boundaries on the client catch render errors, but they do not replace the server
  log — a client boundary that swallows an error the server also never logged leaves no trace
  anywhere.
- Verify the path by deliberately throwing: add a temporary route (or a query flag) that throws, hit
  it against the production build, capture the generic response body, and then find the matching log
  line by its `requestId`. Remove the trigger afterwards and confirm the route is gone.
- Trap: `catch (e) {}` — an empty block. Grep for it. Every swallow is a future unanswerable
  incident.
- Trap: `console.error(e)` on a serverless/container platform where stdout is not collected, or a
  logger writing to a file that the ephemeral filesystem discards.
- Trap: the generic error page returns 200 (see API.md / SEO.md — error pages must carry the right
  status, or monitoring and crawlers both misread it).

## 4. Error tracking (OBS-04)

- Client and server exceptions both reported, with release/version and (where available) sourcemap
  upload so stacks are symbolicated. An unsymbolicated minified stack names no file and no line —
  it is nearly useless for a fix.
- Tag events with `environment`, `release`, and the `requestId`; set `userId` only as a pseudonymous
  id, never email or name.
- Scrub before sending: no cookies, no `Authorization` headers, no request bodies, no PII (§5). Most
  SDKs ship this off by default; turn it on and verify with a test event.
- Noise control: expected 4xx (validation, auth, not-found) should not create issues; otherwise the
  signal drowns and the real P0 is missed.
- Group by root cause, and make triage a stated routine: unreported, unread error events are the same
  as no tracker.
- **Or an explicit waiver.** If the project will not run a third-party tracker (privacy, self-hosted
  constraint), record a written waiver in the state file naming the substitute — e.g. structured
  server logs with a defined retention plus an alert on the error-line rate. The rule is that a
  failure must be discoverable by someone; the mechanism may be a documented choice.
- Trap: an SDK installed with an empty/unset DSN so it silently collects nothing. Send a deliberate
  test error and confirm it appears in the dashboard.

## 5. What must never be logged (and never sent to a tracker)

| Never log | Why | Instead |
|---|---|---|
| Passwords, password reset tokens, verification codes | credential exposure in logs and backups | log the event only ("password_reset_requested") |
| Session cookies, `Authorization` headers, API keys, JWTs | full account takeover from log access | log a token fingerprint/hash prefix if correlation is needed |
| Full request bodies | catches PII, payment data, private content by accident | log the fields you need, explicitly |
| PII: emails in bulk, addresses, phone numbers, DOB, health | privacy policy and legal exposure; log retention usually exceeds data retention | pseudonymous user id |
| Payment data: card numbers, CVV, full processor payloads | PCI scope, and never yours to store | processor reference id and status |
| Encryption keys, DB connection strings, env dumps, `.env` contents into errors | secret leak through the log sink | log the variable *name* that is missing |
| Precise location, IP in high-cardinality form | privacy and cost | truncate/anonymize if needed at all |

- Verify with a real search of the log sink for `password`, `token`, `authorization`, `cookie`, `@`
  (email), and `card`. Finding any is a finding.
- Request-body logging middlewares are the usual offender — check whether it is enabled in
  production config, not just present in code.
- The privacy policy must describe log retention (LEGAL.md §3): if logs hold IPs, the policy says so.

## 6. Latency and database monitoring (OBS-05)

- Measure **percentiles**, not averages. An average hides the p99 that users actually feel: a p50 of
  40ms with a p99 of 4s is a broken product with a healthy mean. Record p50/p95/p99 per route.
- Log `durationMs` for every request (§1) and compute the percentiles per route pattern — a global
  aggregate is dominated by whichever route is called most.
- Slow-query logging: enable the DB's threshold logging (Postgres `log_min_duration_statement`,
  MongoDB profiler / `slowms`), pick a threshold tied to the product's budget, and name the queries
  found. Pair with DATA.md (indexes, N+1) — this is the mechanism that finds them in production.
- Thresholds with meaning: define what is acceptable per route (e.g. list endpoints p95 < 300ms,
  writes p95 < 500ms) and alert when exceeded for a sustained window, not on a single spike.
- Watch the connection pool: saturation and wait time are the usual source of latency cliffs. Log
  pool stats, and check the pool size against the deployment model — serverless needs a
  pooler/smaller pool (OPS.md).
- Also monitor external calls: third-party API and mail latency is a common invisible stall. Time
  them and log the duration as its own field.
- Trap: latency measured only in the browser includes network and hydration; server-side latency must
  be measured server-side (or via a server-timing header), otherwise you optimise the wrong thing.

## 7. Uptime monitoring (OBS-06)

- One documented target: the exact URL, the expected status code, the body/field that proves health,
  the interval, the timeout, the regions, and **who is alerted**.
- Prefer a health endpoint that checks its dependencies (DB connectivity, and any required third
  party) and returns 503 when a dependency is down, over a check that only proves the process is
  listening. But keep it cheap — a health check that runs an expensive query becomes the outage.
- Do not point the probe at a page requiring auth, at the homepage (which can 200 while the API is
  broken), or at a URL that redirects (a 301 may be treated as healthy while the target is down).
- Probe both the origin/edge and, if a CDN is in front, a path that bypasses the cache — otherwise
  you monitor the cache, not the application.
- Verify the alerting actually fires: take the endpoint down (or point the probe at a
  deliberately-failing path) and confirm the notification arrives at the documented recipient.
- Record where the monitor lives and who can edit it. A monitor nobody owns is a monitor that gets
  silently disabled during a migration.

## 8. Product analytics (OBS-07, OBS-08)

- Track the **activation funnel**: landing → signup start → signup complete → first success →
  conversion (see CONVERSION.md §10). `first_success` is the product's core value action.
- Vanity events (`page_view`, `scroll`, `time_on_page`) do not answer any product question on their
  own. Keep them if the team queries them; otherwise they are cost and noise.
- Event discipline: a stable name, a defined firing point (client or server), a documented property
  set, and a named question it answers. Every event maps to a decision someone makes.
- Fire state-changing and money events **server-side** — a client event lost to a redirect or an ad
  blocker produces a funnel that does not exist.
- No sensitive payloads in events: no emails, no message content, no poll answers beyond the id, no
  payment data. Pseudonymous ids only.
- **Keys and config:** a browser-side key is by definition public — use the provider's public/write
  key, restrict it by origin in the provider console, and keep the admin/read key server-only.
  Anything privileged in client code is a leak (SECURITY.md §1). Verify by inspecting the built
  client bundle, not the source.
- Privacy posture must match the shipped policy and the consent state (LEGAL.md §3/§4): if analytics
  is non-essential, it must not load before consent, and the policy must name the provider. A tracker
  firing pre-consent while the banner says otherwise is a defect in two domains.
- Do-not-track / consent withdrawal must actually stop collection, and the stored consent state must
  gate script loading, not just the banner UI.
- Verify with the network panel and the provider's live view: the event arrives, with the expected
  properties, only after consent.

## 9. 404 and broken-link monitoring (OBS-09)

- A 404 spike is the earliest signal of a bad deploy, a broken link, a renamed route, or a botched
  migration. Make it visible: log every 404 with `path`, `referrer`, `userAgent`, and `requestId`.
- Aggregate 404s by path and by referrer, and check the list after every deploy — the top entries
  name the broken links directly.
- Watch specifically for asset 404s (`/_next/*`, `/static/*`, `/assets/*`, old hashed filenames,
  `/favicon.ico`): these mean the deploy shipped HTML referencing assets that are not there — the
  classic stale-HTML-vs-new-assets mismatch (OPS.md §7).
- Exclude noise that will otherwise drown the signal: scanner probes, `well-known` and `.env` probes,
  and legitimate 404s from your own 404 page assets.
- Fix forward: for a removed public route, add a redirect rather than letting it 404; then verify the
  redirect returns 301/308 to a 200.
- Confirm the 404 path returns an actual 404 status with a useful page (not 200-with-error-content),
  and that the page still carries the site's nav, footer and legal links (LEGAL.md §7).

## 10. Alerting and ownership (OBS-10)

- Every alert has a named owner and a channel that a human reads. An alert that lands nowhere is
  worse than no alert, because it creates the false belief the system is watched.
- Document the trigger and the escalation path, even when it is manual:
  - trigger → threshold and window (e.g. 5xx rate > 1% for 5 minutes; health check failing twice;
    error-line count > 20/min; p95 latency above budget for 10 minutes);
  - recipient → who, on which channel, with a stated response expectation (LEGAL.md §8 applies to
    any published number);
  - escalation → what happens if the first recipient does not respond.
- Alert on symptoms users feel (5xx rate, health, latency, funnel break) rather than on causes (CPU,
  memory) as the primary trigger; causes are for diagnosis.
- Keep the count small enough that every alert is actionable. Alert fatigue is how a real outage gets
  ignored at 3am.
- Include the request id in the alert payload where possible, so the responder starts from a trace.
- Record the runbook pointer: what to check first (logs, health, last deploy), and the rollback path
  (OPS.md §8). An alert with no next step is a notification, not a response.
- Verify: force the condition once and confirm the alert fires and reaches the documented recipient.

## 11. Verification recipe

Reproduce a failure and prove the trace exists, end to end:

1. Run the production build and start the production server.
2. Trigger a deliberate error (§3) and capture the response status, body, and `X-Request-Id`
   header.
3. Confirm the body is generic and leaks nothing (no stack, no internals).
4. Search the log sink for that request id; confirm the error line exists with stack, route,
   method, status, and duration.
5. Search the error tracker for the same id/event; confirm it is symbolicated and tagged.
6. Make a normal request; confirm one line with the request line fields of §1, and that the id in the
   response header matches the logged id.
7. Send a 404 and confirm it is logged with referrer, and visible in the 404 aggregate.
8. Confirm the uptime probe returns the documented status against the documented URL.
9. Remove the deliberate error trigger; confirm the route is gone and the gates are green again.

Partial credit is not available here: a request id that does not appear in the log line, or an error
line without a stack, fails the item.

## Checklist mapping

| ID | Item |
|---|---|
| OBS-01 | Structured server logs |
| OBS-02 | Request/correlation IDs logged |
| OBS-03 | Server-side logging of unexpected errors |
| OBS-04 | Client and server error tracking |
| OBS-05 | API latency and DB monitoring |
| OBS-06 | Uptime monitoring target documented |
| OBS-07 | Meaningful analytics events only |
| OBS-08 | Analytics keys not exposed as secrets |
| OBS-09 | 404 monitoring available |
| OBS-10 | Alerting path defined |
