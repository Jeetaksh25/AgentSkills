# Data — correctness that only breaks at scale

Most data-layer defects are invisible in development, where every collection has twelve rows and one
user. They appear at production volume as timeouts, duplicate rows, and silently wrong counts. Every
finding here needs evidence from the real store: a query plan, a row count, a constraint definition.

## 1. Unbounded queries (P0)

- The diagnostic question for **every** list read: **"does this query grow with the data?"** If the
  answer is yes and there is no explicit limit, it is a defect regardless of how fast it is today.
- Grep the data layer for list reads and confirm each carries `limit` / `take` / `LIMIT` / a cursor:
  `find(`, `findMany`, `select(`, `all()`, `scan(`, `list(`, `.toArray()`, `aggregate(`.
- `find({})` with no limit is the archetype. So is an `.all()` inside a loop, an `include` that fans
  out, and an admin CSV export that materialises the whole collection into memory.
- A "bounded by the UI" defence is not a defence: the UI applies its own limit only when the UI makes
  the request. The same endpoint reachable directly, or from a script, returns everything.
- Aggregations that scan a whole collection (`countDocuments({})`, a `$group` with no leading
  `$match`) grow with the data too. Bound and index them (section 6).
- Evidence: an explain plan showing the docs-examined count, or a run against a production-sized
  dataset, recorded as a number.

## 2. Pagination: offset versus keyset

- **Offset (`skip`/`LIMIT n OFFSET m`) degrades linearly.** The server walks and discards `m` rows
  before returning any. Page 500 of a 10k-row set reads 10k rows to return 20. Fine for small, stable,
  admin-facing sets; wrong for anything user-facing and growing.
- **Keyset/cursor** seeks directly: `WHERE (created_at, id) < (:cursor_ts, :cursor_id) ORDER BY
  created_at DESC, id DESC LIMIT n`. Constant cost at any depth.
- Index requirements differ:
  - Offset needs an index covering the `ORDER BY` (plus the filter), otherwise every page is a sort.
  - Keyset needs a **compound index whose order matches the cursor tuple** — `(created_at DESC, id
    DESC)` — or the seek degrades into a scan.
- Keyset caveats to state rather than discover at 3am:
  - No random page access. "Jump to page 7" disappears from the UI, replaced by "load more"/infinite.
  - The cursor must be **opaque and signed** (an HMAC over a fixed tuple). Accepting a raw
    user-supplied `?after=<field>` is sort-injection: the client chooses the index.
  - The sort key must be **unique and immutable**. Paginating on a mutable `updated_at` or a
    non-unique `name` skips or repeats rows; pair it with a tiebreaker (`id`).
- Cap `limit` server-side (default 20, max 100). A client-supplied `limit=100000` is an unbounded
  query wearing a limit.

## 3. The pagination contract (the classic bug)

The most common real-world data bug is not a missing index — it is a **contract mismatch between the
API and the UI**.

- The API supports `?page=`/`?cursor=`. The client fetches page 1 only (or `/api/items` with no
  params) and then **filters, sorts or slices locally**. Consequences: records beyond the first page
  are unreachable, "sort by price" ranks only the loaded page, and the result count shown to the user
  is the page size, not the total.
- Fix on the client: send filter/sort/limit as query params; render the returned page; fetch the next
  page from the pagination control. The server decides membership and order.
- Fix on the server: return pagination metadata in a **stable shape** — `items`, plus a cursor or
  `{ page, pageSize, total, hasMore }` — and honour `sort`/`filter` params rather than letting the
  client re-sort. Do not compute `total` with an unbounded `count` on every request; estimate, cache,
  or return `hasMore` from a `limit + 1` probe.
- Verify by asserting the same query both ways: `GET /api/items?sort=price_asc&page=2` must return the
  same records as sorting the full set server-side. A test that only checks page 1 will not catch it.

## 4. N+1 queries

- Signature: a list read followed by a per-item read (a `for` loop, a `.map(async …)` that awaits, a
  resolver that lazily loads a relation per parent).
- Detect with query logging in a real request: count the queries and compare to the row count. N+1 on
  a 20-row page is 21 queries; on a 200-row page it is 201 and looks like an outage.
- Fixes:
  - **Batch with `$in`/`IN`**: collect the ids, one query, group in memory.
  - **Dataloader/request-scoped batching**: collect keys within a tick, issue one query, resolve all
    callers (the standard fix in GraphQL resolvers and any resolver-style layer).
  - **Join or eager load** in one round trip — but check what `populate`/`include` actually do: some
    issue a second query per relation (still N+1), and nested includes multiply. Read the emitted
    SQL/query log, not the ORM docs.
  - Denormalise a hot field (stored `authorName`) when reads far outnumber writes — with a documented
    invalidation path.
- N+1 also hides in serialisers: a `toJSON` that touches a lazy relation fires a query per row.

## 5. Projections and field selection

- Never return the whole document from a list endpoint. Select explicit fields (`select`/`projection`).
- Exclude by default: password/hash, tokens, internal notes, full audit blobs, large text bodies,
  history arrays, embedded binary/base64, private contact details. A projection that omits the hash is
  a security control *and* a bandwidth win.
- Detail endpoints may return more, but still not secrets — "the detail page needs it" is a habit;
  check what the client reads.
- A wide projection also slows document-store queries (more bytes from disk, larger working set).
  Measure the payload size before and after.
- Guard the shape with a test asserting a known-sensitive key is absent from a list response.

## 6. Aggregations bounded by scope

- **Every** stage filters by an indexed owner/tenant key. An aggregation that does not begin with a
  `$match` on an indexed tenant/owner/date field scans the collection.
- `$match` after `$group`/`$project` is expensive and often a logic error: the pipeline already
  computed everything. Push filters as early as possible.
- `$lookup` runs a sub-query per input document by default — the join equivalent of N+1. Batch with
  `$lookup` + `let`/`pipeline` on an indexed foreign key, or prefetch with `$in` and merge.
- `$unionWith`/`UNION` branches execute separately: each needs its own index, and the result is bounded
  only if each branch is bounded.
- Never aggregate across tenants then filter in application code — that reads every tenant's data into
  the process. The tenant filter belongs in the first stage.
- Add `$limit` wherever the business question allows ("top 10"); an unbounded `$sort` without an index
  is a blocking in-memory sort.
- Verify with `allowDiskUse` off in test: a pipeline that only succeeds with disk spilling will fail at
  production volume.

## 7. Connection pooling by deploy target

- State the pool size **with reasoning**; an unstated default is a finding.
- Long-lived server: pool sized to the database's connection limit divided across instances, with
  headroom for migrations and admin tools: `instances × poolSize + admin headroom ≤ max_connections`.
- Serverless / scale-to-zero: each instance opens its own pool, so concurrency multiplies connections
  and exhausts the database. Use an external pooler (PgBouncer, the platform's connection proxy) or a
  bounded `maxPoolSize` per instance (`1–5`), not the driver default.
- Managed database limits are real and small (often tens to low hundreds). Log and alert on connection
  errors; "too many clients" at peak is the classic serverless launch failure.
- Set `idleTimeoutMillis`/`idleTimeout` and close the pool on shutdown (see `references/API.md`) or the
  deploy leaves zombie connections until the server times them out.

## 8. Index creation lifecycle

- Index creation belongs at **boot or in a migration**, never on the request path. `ensureIndexes()` in
  a model's constructor, a `db.collection.createIndex()` at module load in a request-time import, or a
  "check the index exists then create it" guard per request all add latency and can race.
- Per-process memoisation (`if (!indexed) { … indexed = true }`) is not enough: the flag resets on every
  cold start and every serverless instance, so the check-and-create hits the database repeatedly. The
  index definition belongs in a migration that runs once.
- Create indexes in the background / outside peak hours for large collections — a foreground index
  build on a big collection blocks writes.
- Record index definitions somewhere reviewable (a migrations directory or schema file), not only in
  the code path that created them; otherwise the next environment cannot be rebuilt from source.
- Verify against the live database (`getIndexes()` / `pg_indexes`), not the source. A migration that
  silently failed leaves the production collection unindexed.

## 9. Uniqueness constraints must match application normalisation

- The unique index and the write path must use the **same** normalisation. This is the highest-value
  check in this file because the failure is silent and destructive.
- Example: the server stores `email` as typed (`"Alice@Example.com "`), the client trims and
  lowercases before its duplicate check → two rows for one human; the UI believes duplicates are
  impossible because its own check passes.
- Fixes, pick one and apply everywhere: store a normalised field with the unique index on it
  (`emailNormalized`), or normalise on write and enforce with a **case-insensitive collation** index.
  Do not mix approaches across endpoints.
- Same class of bug for: usernames (case, unicode NFKC, whitespace), slugs (`Foo Bar` vs `foo-bar`),
  phone numbers (punctuation stripped on one path only), identifiers arriving in different unicode
  normal forms.
- Race condition: application-level "check then insert" is not a constraint — two concurrent requests
  both pass. Only the unique index prevents the duplicate; handle the conflict error (409) explicitly.
- Verify by inserting the same logical value twice through the real API and asserting the second is
  rejected, **not** by reading the schema.

## 10. Obsolete index retirement

- `createIndexes` only adds. Changing an index definition (field order, added `partialFilterExpression`,
  a key that is now normalised) leaves the **old index in place**, consuming writes and storage.
- Worse: a stale **unique** index blocks writes the new code believes are legal — inserting a record
  the new rules allow fails with a duplicate-key error naming a field the code no longer touches.
- Retirement: list live indexes, diff against the intended set in source, drop those not in the set via
  a migration (not by hand in one environment). Never drop an index whose purpose you cannot explain —
  check the query plan first.
- Redundant **prefix** indexes: `{a:1}` is redundant when `{a:1,b:1}` exists (the longer index serves
  prefix queries); the reverse is not true. Keep the compound, drop the prefix.
- Record the retirement in migration history so a restored old backup plus a replay of migrations
  arrives at the intended set.

## 11. Transactions for multi-document invariants

- Any invariant spanning more than one document/row must be inside a transaction (session): vote
  tallies, money transfers, ownership changes, inventory decrement, "create post + create its
  notification", unique-per-owner counters.
- Wrap in the store's transaction primitive (`session.withTransaction`, `BEGIN/COMMIT`, `$transaction`).
  An `await` on two independent writes is not atomic, however close together in the source they look.
- What goes **inside**: the read that establishes the precondition, the writes, and any read whose value
  is returned to the client as the post-state (section 12).
- What goes **outside**: network calls, email sends, third-party API requests, file uploads. A network
  call inside a transaction holds locks for the duration of someone else's outage and will time out.
  Emit the side effect after commit (an outbox/queue is the disciplined form).
- Transient failures (write conflicts, deadlocks, `TransientTransactionError`) are normal under
  contention: retry the whole transaction with bounded exponential backoff. `withTransaction` retries
  for you; a hand-rolled `BEGIN` does not — add the loop or accept spurious 500s under load.
- Keep transactions short. One that awaits user input, a sleep, or an unbounded query blocks writers.
- Verify under concurrency: fire the same operation twice in parallel and assert the invariant held
  (one winner, correct final tally), not just that each request returned 200.

## 12. Read consistency after commit

- A value read **outside** the transaction can lag the committed write — the counter you increment in
  the transaction is read from a different connection/read-your-writes gap and returns the pre-write
  value.
- Fixes: compute the post-state **inside** the transaction and return it; return the transactional
  write result (`findOneAndUpdate` with `returnDocument: 'after'`); or re-read on the same session.
- Classic symptom: the optimistic UI shows 5 votes, the response body says 4, and the UI flickers back.
  The user-visible number must come from the same consistent read as the write.
- On read replicas, a write followed immediately by a replica read returns stale data. Route the
  post-write read to the primary, or accept eventual consistency and do not render "saved" from a
  replica read.
- Aggregates derived from writes (totals, counts, rankings) must be recomputed in the same transaction
  or marked stale with a defined refresh path.

## 13. Soft delete and retention

- Choose explicitly: hard delete, or soft delete with a `deletedAt` field and a documented retention
  window. Undocumented soft delete is the worst of both worlds — data silently retained, queries
  silently wrong.
- Every read must exclude soft-deleted rows (a default scope/filter). A forgotten filter in one
  endpoint resurfaces deleted content and looks like a security leak.
- **Uniqueness vs soft delete**: a plain unique index on `email` blocks re-registration after a soft
  delete. Use a partial unique index (`{ deletedAt: null }` / `WHERE deleted_at IS NULL`) — matching
  the documented behaviour: "deleted accounts free their email".
- Counters, aggregates and search indexes must exclude soft-deleted rows too; otherwise totals include
  ghosts and search returns deleted items.
- Retention: define what is purged and when, and make purge actually run (a scheduled job, not a script
  in a README). Personal-data deletion must cover derived stores (sessions, caches, search index) —
  see `references/SECURITY.md`.
- Verify by soft-deleting a record and asserting it is absent from every list, search, count and the
  duplicate check.

## 14. Search indexing

- **Unanchored, case-insensitive regex on an unindexed field is a full collection scan per keystroke.**
  `{ name: /foo/i }` or `LIKE '%foo%'` cannot use a standard B-tree index; combined with
  search-as-you-type it is the most reliable way to take a database down.
- Options, in ascending cost: anchored prefix regex on an indexed field (`^foo`, which *can* use the
  index) when only prefix search is needed; a **text index** with `$text`/full-text `tsvector` for word
  search; a purpose-built search engine (Atlas Search, Meilisearch, OpenSearch) when relevance,
  ranking, or fuzzy matching is required.
- MongoDB specifics: a text index serves `$text` only — it does not accelerate `$regex`. A
  case-insensitive collation index accelerates case-insensitive **equality and prefix**, not a
  contains-match.
- Keep the search index in sync with writes explicitly (index-on-write, or a background sync with a
  measured lag). Document the lag; do not let users believe search is real-time if it is not.
- Bound search results (section 1) and debounce the input (`references/PERFORMANCE.md`). Even an
  indexed search needs a limit.
- Verify with an explain plan proving index use, at production data volume.

## 15. Absolute timestamps and clock skew

- Store **absolute instants** in UTC (`timestamptz`, or a `Date`/`ISODate`). Never store a local-time
  string or a naive date; a DST boundary will silently shift records by an hour.
- The trap: **validating a client-supplied timestamp against `Date.now()` at parse time does not
  protect against a client clock ahead of the server.** A client whose clock is 10 minutes fast submits
  an expiry that is already in the past server-side, and the record is instantly expired (or rejected
  unpredictably).
- Fixes: derive expiry/`createdAt`/`updatedAt` from the server clock, never from the payload. If a
  client timestamp must be accepted (an offline-capable client), clamp it to a sane window of server
  time and record both values.
- Store a timezone separately when the *local* time matters (a user's chosen 9am reminder): the
  absolute instant plus the IANA zone. Never infer the zone from the server's locale.
- Comparisons and range queries must be on the absolute field so indexes apply; formatting to local
  time is presentation.
- Verify by writing with the server clock, reading it back, and comparing against the expected instant —
  and by a test that a future client timestamp cannot create an already-expired record.

## 16. Migration strategy and reversibility

- Every schema change is a **numbered, ordered migration** committed to source — not a manual command
  someone ran in the production console, and not an ad-hoc `ensureIndexes` at boot (section 8).
- List them in order with a one-line purpose each, and describe the **rollback** for each in the
  deployment doc (`references/DEPLOYMENT.md`). Destructive steps (dropped column, dropped index,
  backfill) need the reverse step written while the forward one is written.
- Expand/contract for zero-downtime on live data: add the new nullable field → backfill in a bounded,
  resumable batch job → dual-write both shapes → switch reads → remove the old field. A migration that
  renames a column in place breaks the version of the app still running.
- Migrations run once, tracked in a schema/version collection with the applied timestamp and checksum.
  A migration that re-runs must be a no-op, not a duplicate write.
- Verify: run the full migration chain against an empty database (fresh install) and against a copy of
  the current production schema (upgrade path). Only testing one is how a fresh deploy fails after the
  upgrade path was tested.

## 17. Seed and demo data isolation

- Seeded/demo records must live in a **reserved namespace** that cannot collide with real user data: a
  reserved handle/email domain (`@example.invalid`), a `seed: true` flag, or a separate demo tenant —
  plus identifiers that are obviously synthetic.
- The seed must be **idempotent**: running it twice does not duplicate rows or fail on the unique index.
  Upsert by a stable seed key rather than blind insert.
- Ship an **unseed** that removes exactly what seed created (by the reserved marker), so a demo dataset
  can be cleared from a real environment without guesswork.
- Never seed into a database that could hold real user data without the marker; a demo "Alice" account
  with a working password in production is a security finding, and demo rows skew analytics and counts.
- Verify: run seed twice, assert row count unchanged; run unseed, assert the reserved namespace is
  empty and non-seed rows untouched.

## 18. Backups and restore

- Backups configured (managed snapshot, `pg_dump`/`mongodump` schedule, or the platform's point-in-time
  recovery) with a stated retention window.
- **The restore procedure is written down**, not assumed: where the backup lives, the exact restore
  command, the target environment, who runs it, and expected downtime. An untested backup is a
  hypothesis.
- Do at least one restore drill into a scratch database and record the date, the backup used, and the
  row counts compared.
- Verify the backup actually contains data (file size, row count at restore) — a backup job failing
  silently for weeks is common and only discovered during an incident.
- The restore target is parameterised, never hardcoded, so a drill cannot overwrite production.
- Cover each store, not just the primary database: object storage, search index, cache. A restored
  database with an empty search index is a broken search, not a restored site.

## Checklist mapping

| ID | Sev | Item |
|---|---|---|
| DATA-01 | P0 | No unbounded query anywhere |
| DATA-02 | P1 | Pagination on every collection endpoint |
| DATA-03 | P1 | Cursor pagination for large tables |
| DATA-04 | P1 | No N+1 query patterns |
| DATA-05 | P1 | Projections return only required fields |
| DATA-06 | P1 | Aggregations bounded to caller scope |
| DATA-07 | P1 | Connection pooling fits deploy target |
| DATA-08 | P1 | Index creation off the request path |
| DATA-09 | P1 | Uniqueness matches normalization rules |
| DATA-10 | P2 | Obsolete indexes retired |
| DATA-11 | P1 | Multi-document writes transactional |
| DATA-12 | P1 | Returned values consistent with write |
| DATA-13 | P2 | Soft-delete and retention defined |
| DATA-14 | P1 | Search uses an index or engine |
| DATA-15 | P2 | Timestamps stored as absolute instants |
| DATA-16 | P2 | Migrations documented and reversible |
| DATA-17 | P1 | Seed/demo data cannot collide |
| DATA-18 | P2 | Backups plus written restore procedure |
