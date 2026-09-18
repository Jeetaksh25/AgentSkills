# API — contracts that hold under a hostile client

Every API is public whether or not it is documented: anything a browser can send, an attacker can
send. The rules here are enforced **server-side**; client-side validation is UX and counts for
nothing. Verify with real requests (`curl`/fetch against the production build), recording status,
headers and body.

## 1. Validate every input, server-side

- Every handler validates body, query and path params against a **schema** (zod, joi, pydantic,
  class-validator, JSON Schema). No handler reads `req.body.x` unvalidated.
- **Query params and path params are user input too.** They are the values most often interpolated
  straight into a database filter or `sort`, and the most often forgotten.
- Reject unexpected keys (strict schema) rather than ignoring them — an ignored key is a mass-assignment
  risk the day someone spreads the body into an update (`{ ...req.body }`).
- Coerce carefully and explicitly: `"1"` → number, `"true"` → boolean, `""` → null. A schema that
  silently coerces `"undefined"` to `0`, or `"abc"` to `NaN`, produces wrong queries rather than errors.
- Validate the **type** of every value, especially for document databases: an object where a scalar is
  expected is operator injection (`{ $gt: "" }` as a value). Reject non-scalars where scalars are
  required.
- Validate enums against a whitelist: `sort=`, `status=`, `role=`, `format=`, `orderBy=` must map to a
  server-defined set, never be passed to the driver as a field name or direction.
- Bound numbers: `limit`/`page`/`offset` have min and max; a negative or enormous value must be
  rejected, not clamped silently into a surprising query.
- Return `400` (malformed) or `422` (semantically invalid) with the field paths — never a 500 (section
  4).

## 2. Authorization is per-resource, not per-route

- Authentication (who is calling) and authorization (may this caller touch *this* record) are separate
  checks. A route that only verifies a session is not authorized.
- Pattern: authenticate → **load the record scoped to the caller** → act. Prefer `findOne({ _id, ownerId:
  session.userId })` over `findOne({ _id }) then if (doc.ownerId !== me)`. The scoped query cannot be
  forgotten later; the post-hoc comparison eventually is.
- **IDOR test recipe**: with a valid session of your own, request another user's record by id —
  `GET/PATCH/DELETE /api/items/<other-user-item-id>`. Correct answer: `403` or `404`. A `200` is a P0.
  Also test with an id from a different tenant/organization, and a soft-deleted id.
- Test the write paths, not just reads: update, delete, and "action" endpoints (`/publish`, `/share`,
  `/invite`, `/approve`) each need the same check.
- Never accept an owner id, role, price, credit balance or tenant id from the payload; derive it from
  the session. If a field must be settable (admin), gate it behind a separately verified privilege.
- Client-side guards (hidden buttons, disabled inputs, route guards) are UX affordances. The audit must
  name the server check backing each one, or list it as an unprotected action.
- Return `403` for a known-but-forbidden resource when existence is not sensitive; `404` when revealing
  existence is itself a leak (private records, admin paths).

## 3. Consistent envelope and error shape

- One response shape for success and one for failure, everywhere. Mixed shapes (`{data}` here, a bare
  array there, `{items}` elsewhere) force defensive client code and hide contract drift.
- Recommended: success `{ data: …, meta?: … }`; failure `{ error: { code, message, details? } }` with a
  **machine-readable code** (`"validation_failed"`) plus a human message. The client branches on code,
  never on message text.
- One error helper constructs every error response (`apiError(status, code, message, details)`), so a
  new endpoint cannot invent a shape or accidentally serialise an exception object.
- Field names are stable: `snake_case` **or** `camelCase` for the whole API, not per-endpoint. Renaming
  a field is a breaking change (section 15).
- Never return `null` for a field one endpoint returns as an array and another omits. Pick a
  convention for empty (`[]`, `null`, absent) and apply it.
- Error-handling consistency across modules: an unhandled rejection in a background job, a queue
  consumer, or a server action must produce the same logged, correlated error as an HTTP route — not a
  silent `catch {}` that makes the failure invisible (see `references/OBSERVABILITY.md`).

## 4. Status codes

| Status | Use |
|---|---|
| `200` | Successful read or update returning a body |
| `201` | Created, with `Location` (and the created resource) |
| `204` | Success with no body (deletes, no-op updates) |
| `400` | Malformed syntax, unparseable body, bad path param type |
| `401` | No or invalid credentials — "who are you" |
| `403` | Authenticated but not permitted — "you may not" |
| `404` | Not found **or** deliberately hidden from this caller |
| `409` | Conflict: duplicate key, stale version, illegal state transition |
| `422` | Well-formed but semantically invalid (schema validation failure) |
| `429` | Rate limited, with `Retry-After` |
| `500` | Unexpected server fault — nothing the client can fix |
| `503` | Temporarily unable to serve (dependency down, shutting down) |

Classic mistakes, each a finding:

- **`200` with `{ error: … }`.** Breaks every client that branches on status, breaks monitoring and
  caching, and hides failures from the alerting path.
- **`500` for validation.** A bad email is not a server fault; it pollutes error budgets and pages
  someone at 3am.
- **`404` where authorization failed on a *public* resource** confuses users ("it vanished"); **`403`
  where authorization failed on a *private* resource** confirms existence. Pick per resource class.
- **`401` for an authorization failure** — the client will retry the login flow and loop.
- **`400` for a duplicate-key collision** — correct is `409`, so the client can show "already exists"
  instead of "invalid input".

## 5. Never leak internals

- Error responses carry a generic message plus a correlation id (section 6). Never a stack trace,
  driver error, ORM message, class name, file path, SQL/query text, or the fact that a field is indexed.
- Driver errors leak structure: `E11000 duplicate key error collection: app.users index: email_1` tells
  an attacker the collection, the field and the index name. Map it to `409 "already exists"`.
- In production, disable framework debug pages and detailed error output. A stack trace in a response
  is a P0 finding; verify on the deployed origin by triggering a real 500 (a route that throws) and
  reading the body.
- Log the detail **server-side** with the same correlation id, so the operator has the context the
  client does not.
- Do not echo the rejected input wholesale (`details: req.body` on a password form logs and returns the
  password). Echo field paths and safe values only.
- 404 bodies must not distinguish "no such id" from "not yours" when that distinction is sensitive.

## 6. Logging the failure path

- Every `500` logs: the correlation id, route, method, status, duration, user id (if any), and the error
  with stack — server-side only.
- The same correlation id is returned to the client (header `x-request-id` and/or in the error body) so
  a user report can be traced to a log line without guesswork.
- Accept an inbound request id if the platform/edge sets one (a trusted header) so traces span services;
  otherwise generate one per request. Never trust an arbitrary inbound id as an identity.
- Log levels are meaningful: `error` for 5xx and unhandled faults, `warn` for 4xx caused by clients at
  volume, `info` for lifecycle. Everything at `info` buries the signal; everything at `error` makes
  alerting useless.
- Never log secrets, tokens, cookies, passwords, full request bodies, or full user records (see
  `references/SECURITY.md`).
- The unhandled path must be covered too: a global error handler catches what a route forgot, so an
  exception never escapes as an HTML error page or a connection reset.

## 7. Rate limiting

- Key on a **trusted** client identity. Behind a proxy/load balancer, `req.ip` and `X-Forwarded-For` are
  attacker-controlled unless the platform edge overwrites them. Only trust headers the edge sets; when
  the app itself sees a proxy IP, every user shares one bucket and one attacker locks out the platform.
  Verify on the deployed origin, because this is invisible locally.
- Separate buckets per sensitivity: login, registration, password reset, expensive reads (search,
  exports, reports), and writes. One blanket bucket both under- and over-protects.
- Combine an identity dimension (IP) with an account dimension (email/user id) for auth endpoints — an
  attacker rotating the target address sidesteps a per-email bucket; an attacker sharing an IP sidesteps
  a per-IP bucket.
- Return `429` with `Retry-After` (and `RateLimit-*` headers where supported) so clients back off
  correctly.
- Make the limiter **idempotent**: a retry of the same request must not double-count, and a limiter
  backed by a store that is unavailable must fail in the documented direction (usually open for reads,
  closed for auth) — decide and record which.
- Distinguish "too many requests" from "account locked": different codes, different UI.

## 8. Uploads

- Validate **MIME type and extension server-side** — both, not just the extension and not just the
  browser-reported `Content-Type`, which the client controls.
- Cap the size and (for multi-file routes) the count; reject before buffering the whole payload.
- Generate the stored filename; never trust the client's. A user-supplied name is a path-traversal and
  overwrite vector (`../../app.js`, `photo.php`, a name that collides with an existing asset).
- Store outside any executable/served-as-code location; serve from object storage or a static host with
  a non-executable content type, never from a directory the app executes.
- Strip or ignore metadata where it matters (EXIF GPS on user photos); re-encode images rather than
  serving the uploaded bytes.
- Treat a successful upload as untrusted input on read: a downstream renderer must not execute it.
- Verify by uploading a script-renamed-to-`.jpg` and a file over the cap, and confirming both are
  rejected with the right status and no file lands in the served path.

## 9. Request size and timeouts

- Cap request bodies before parsing (`express.json({ limit: '1mb' })` or the platform equivalent) and
  return `413`. An uncapped parser is a memory-exhaustion vector.
- Cap upload sizes and counts separately; a multipart route needs its own limit and a count limit for
  multiple files.
- **Every external call and DB operation gets a timeout.** No unbounded `await fetch(...)`, no driver
  default of "forever". A request that hangs holds a connection slot and a worker until the platform
  kills the process.
- State the **timeout budget** in the state file: e.g. request 30s, DB query 5s, external API 3s,
  total downstream budget under the platform's own limit (often 30–60s for a PaaS). Nested budgets must
  sum to less than the outer one, or the outer limit fires first and the inner timeout is dead code.
- Use `AbortController`/`signal` for HTTP with an explicit timeout; a timeout that only logs is not a
  timeout.
- Fail fast on the health path: a health check that waits on a slow dependency makes the platform kill
  a process that could have served traffic.

## 10. Retry policy

- Retry only **idempotent** and **transient** operations: a GET, a queued job, a read, a
  `PUT`/`DELETE`/`PATCH` that is naturally idempotent, or one carrying an idempotency key.
- Never blind-retry a `CREATE`/`POST` — the first attempt may have succeeded and the response been lost;
  the retry produces a duplicate. This is the double-charge / double-publish bug.
- Classify before retrying: retry on connection reset, timeout, `429`, `502/503/504`; do **not** retry
  on `400/401/403/404/409/422` — the answer will not change.
- Exponential backoff **with jitter** and a bounded attempt count; a fixed-delay retry storm
  synchronises across workers and hammers a recovering dependency.
- Retries on the client side need the same discipline — an axios/fetch interceptor that retries
  everything will duplicate writes.

## 11. Idempotent creates for retryable paths

- Any create a user can double-trigger (double-click, mobile flaky network, client retry after timeout)
  needs protection: an **idempotency key** (client-generated, stored and returned with the same result
  on replay) or a **natural unique constraint** on the business key (a unique index on
  `(userId, slug)`).
- The double-click publish case: clicking "Publish" twice must produce one published item, not two — and
  the same must hold for "post comment", "submit vote", "create order". Verify by firing the request
  twice in parallel and asserting one record.
- Idempotency-key storage needs the same key to return the **original** response, not a fresh one; a key
  that only suppresses the second insert but re-runs the side effects is not idempotency.
- Bound the key lifetime (e.g. 24h) and scope it to the account.
- Do not implement this only in the UI (disable the button after click): the client is not the trust
  boundary, and a retry from a lost response still duplicates.

## 12. Health endpoint

- Returns `200` in **every legitimately deployable configuration** — including when optional
  dependencies (analytics, a feature-flagged service, redis used only as a cache) are unavailable. A
  health check that fails on an optional dependency makes the platform kill healthy instances.
- Reports dependency status: database reachable, and the status of anything genuinely required. Distinguish
  `ok` / `degraded` / `down`, and decide which maps to a non-200 (a failing *required* dependency → `503`).
- Contains **no secrets**: no connection strings, no env values, no build credentials, no user data.
  Version/commit sha and environment name are acceptable.
- **Cheap**: a trivial query (`SELECT 1`, `ping`) with a short timeout — not an aggregation, not a full
  collection count. The health check runs constantly; making it expensive is a self-inflicted outage.
- Unauthenticated by design (the platform must call it) and therefore hardened: rate-limited, no
  detailed internals, and excluded from indexing/sitemap (see `references/SECURITY.md`).

## 13. Graceful shutdown

- On `SIGTERM` (and `SIGINT` locally): stop accepting new connections, let in-flight requests finish
  within a deadline (e.g. 10–30s), then exit.
- Close resources in order: HTTP server → background jobs/databases/queues → database pool → cache.
  A pool closed before in-flight requests finish produces a burst of 500s during every deploy.
- Make the process fail readiness immediately on `SIGTERM` so the platform drains traffic first; then
  finish the deadline.
- Handle `unhandledRejection`/`uncaughtException` by logging and exiting non-zero — a process in an
  unknown state serving traffic is worse than a restart, and the platform will replace it.
- Verify: send `SIGTERM` during a request and confirm the response completes rather than being cut.

## 14. CORS

- Enumerate known origins in production. **Never** `Access-Control-Allow-Origin: *` together with
  `Access-Control-Allow-Credentials: true` — browsers reject it, and the intent behind it is a bug.
- Accept the *configured* application origins (from env), not one hardcoded URL: a single hardcoded
  origin breaks staging and preview deployments — a production-only failure that looks like a mystery.
- Restrict methods and headers to those actually used; a wildcard `Allow-Headers` invites
  header-based probing.
- Handle preflight (`OPTIONS`) explicitly and cache it (`Access-Control-Max-Age`) to avoid a preflight
  round trip on every request.
- CORS is a browser control, not authorization. It does not stop a server-side caller; per-resource
  authorization does (section 2).
- Same-origin app with a same-origin API needs no CORS config at all — a permissive CORS block on such
  an app is pure risk.

## 15. Versioning and backward compatibility

- If any external consumer exists (mobile app, partner, public docs), version explicitly — path
  (`/api/v2/`) or a required header. An unversioned public API cannot change safely.
- Additive changes are safe: new optional response field, new optional request param, new endpoint.
  Breaking changes are: removing/renaming a field, changing a type, making an optional field required,
  changing a status code or an error code, tightening validation.
- Deprecate before removing: document, warn in a response header (`Deprecation`, `Sunset`), keep both
  paths working for a stated window.
- An internal API consumed only by the app's own client may skip versioning — but then the client and
  server must deploy together, and that constraint must be written down.
- Verify backward compatibility by exercising the **previous** client-visible shape, not by reading the
  handler.

## 16. Pagination and filtering contract

- Every collection endpoint exposes a documented, bounded pagination contract; the server decides
  membership and order (see `references/DATA.md` for the full failure mode).
- Accept `limit` (bounded), plus a cursor **or** `page`/`pageSize`; reject both-inconsistent requests
  rather than guessing.
- Accept `sort` and `filter` as named, whitelisted params — never raw field/direction pairs from the
  client, and never a raw query fragment.
- Return stable metadata: `{ items, nextCursor }` or `{ items, page, pageSize, total, hasMore }`.
- The client must not re-sort or client-filter a fetched page; the rankings it computes would be
  page-local and records beyond the first page unreachable. Assert server-side sorting with the
  `?sort=` + `?page=2` comparison test.
- Cache-control for list responses follows section 17: `no-store` when caller-scoped.

## 17. Cache-control separation

- Authenticated or per-user responses: `Cache-Control: private, no-store`. Not `private, max-age=…` —
  per-user data in a shared browser or intermediary cache is a data leak.
- Public, shareable reads: `public, s-maxage=…, stale-while-revalidate=…`, and only when the body is
  byte-identical for every caller (no session, no per-user fields, no cookie read).
- Mutation responses and anything with a one-time token: `no-store`.
- Set `Vary` for headers the response genuinely depends on (`Accept-Language`, `Accept-Encoding`); if
  you need `Vary: Cookie` on a per-user response, the response should be `no-store` instead.
- Verify by requesting the same URL as two different identities and diffing the bodies and the headers
  — this failure mode is silent and only appears with a CDN or shared cache in front.

## 18. Error handling consistency across modules

- One global error handler and one error constructor; routes throw typed errors and the handler maps
  them to status/code. No route builds its own error JSON.
- Async errors must reach the handler: an `await` in a handler without a wrapper (or an unhandled
  promise in Express 4) crashes or hangs instead of returning `500`. Use the framework's async-aware
  pattern or wrap consistently.
- The same class of failure behaves the same in every module: a validation error is `422` whether it
  comes from a route, a server action, a queue consumer or a webhook. Divergence is how clients end up
  with three error paths.
- Background jobs, cron tasks and queue consumers log with the same correlation-id scheme and exit
  non-zero on unrecoverable failure so the platform restarts them.
- Webhooks follow the same rules as routes: validate input, verify signatures, be idempotent (a
  redelivered webhook must not double-apply), return quickly with `2xx` and process asynchronously.
- Verify by triggering each error class once against the production build and recording status, code and
  body shape.

## Checklist mapping

| ID | Sev | Item |
|---|---|---|
| API-01 | P0 | Mutating input validated server-side |
| API-02 | P0 | Authorization enforced per resource |
| API-03 | P1 | Consistent success and error envelope |
| API-04 | P2 | Correct HTTP status semantics |
| API-05 | P1 | Errors never leak internals |
| API-06 | P1 | Rate limiting on sensitive endpoints |
| API-07 | P1 | Rate-limit identity resolves on real host |
| API-08 | P1 | Request size caps enforced with 413 |
| API-09 | P2 | Timeouts on external and DB calls |
| API-10 | P2 | Retries limited to idempotent transient |
| API-11 | P1 | Health endpoint fits platform monitoring |
| API-12 | P2 | Graceful shutdown closes pools and handlers |
| API-13 | P2 | Idempotency for client-retryable creates |
| API-14 | P1 | Uploads validate type, size, content |
| API-15 | P2 | CORS restricted to known origins |
| API-16 | P1 | Cache headers split public and authenticated |
