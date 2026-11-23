# Deployment — reproducible builds, safe releases, real rollback

Everything in this domain is verified against a **clean checkout**, not against the machine where the
app was developed. The single most common false positive in a production audit is a build that only
works because of untracked local state, a warm cache, or a variable that exists in someone's shell.

Rule: if a fresh clone in a fresh directory cannot build, start, and serve the app, it is not
deployable — regardless of what the dev machine does.

## 1. Production build from a clean checkout (OPS-01)

- Clone into a new directory (or `git worktree add`) with no `node_modules`, no build cache, no local
  `.env`. Install **from the lockfile** (`npm ci` / `pnpm install --frozen-lockfile` /
  `yarn install --immutable` / `pip install -r requirements.txt` with hashes, `--locked` for Cargo) —
  an install that resolves new versions is not reproducible.
- Build the production bundle (`NODE_ENV=production`, framework's production build), then **start the
  production server** and exercise it. A successful build that has never been started in production
  mode is unverified: the failures (missing runtime env, wrong output mode, ESM/CJS mismatch,
  standalone-vs-node_modules packaging) all appear at start, not at build.
- Record the build output: route table with bundle sizes, asset manifest, total first-load JS,
  and any warnings. These numbers are the baseline for OPS-10 and for detecting drift later.
- Warnings are triaged, not scrolled past: a build warning about a missing module or an unresolvable
  import becomes a runtime 500. Record each one and its disposition.
- Verify no untracked file is required: `git status --porcelain` clean after the build (ignore
  ignored build output), and grep the build config for absolute local paths, sibling checkouts, or
  machine-specific env.
- Trap: a postinstall script generating a file that is not committed and not run in CI.
- Trap: case-insensitive filesystem (Windows/macOS) hiding an import whose casing is wrong; the
  Linux build host fails. Check imports against real filenames.

## 2. The CI gate (OPS-02)

- The pipeline runs, in order and failing on the first error: install from lockfile → typecheck →
  lint → tests → build. The gate is only green when all four pass.
- **Prove the gate fails.** A pipeline that cannot fail is decoration. Break something deliberately
  (a type error, a failing assertion, a lint error) on a scratch branch, confirm the pipeline goes
  red at the right stage, then revert — or read the config honestly and record which of the four
  gates is missing. Record the observed run.
- If a stage is absent, add it in the same batch (VERIFICATION.md's command set) rather than
  documenting the gap.
- Pin the runtime version (`.nvmrc` / `engines` / `toolchain` / `python-version`) so CI and the host
  match. A build on Node 22 and a host on Node 18 produces a production-only failure.
- Tests must not be skipped silently: no `--passWithNoTests`, no `|| true` on the test step, no
  `continue-on-error: true` on a gate, no "allow failure" on the build.
- Cache dependencies, never build outputs, across runs; a cached build hiding a broken build is a
  false green.
- Keep secrets out of CI logs (masked variables, no `echo $TOKEN`) — SECURITY.md §1.
- The deploy step must depend on the gate passing, not run in parallel with it.

## 3. Environment variables (OPS-03, OPS-04)

- **Validate required variables at boot** with a clear failure: on start-up, check every required
  variable and exit non-zero naming the missing ones. Fail loudly at boot, never lazily on first
  request — a lazily-discovered missing variable means intermittent 500s in production.
- Missing configuration must never fall back to a development default in a production path:
  `process.env.DB_URL || 'mongodb://localhost:27017/dev'`,
  `SECRET || 'dev-secret'`, `NODE_ENV || 'development'`. Grep for `||` and `??` beside `env.` and
  inspect every hit.
- `.env.example` is complete: **every** variable, each with a description, a placeholder (never a
  real value), and whether it is required. A variable that exists only in the deployment dashboard
  is undiscoverable to a new operator (OPS-13) and will be missing in staging (OPS-12).
- Separate the classes: build-time (inlined into the client bundle — never put a secret there),
  runtime server-only, and public client config. A secret prefixed with the framework's public prefix
  (`NEXT_PUBLIC_*`, `VITE_*`, `REACT_APP_*`) is shipped to every browser — verify in the built
  bundle, not the source.
- Verify the production-mode behaviour explicitly: boot the production server with a required
  variable unset and confirm it fails with a message naming that variable. Then boot with the full
  set and confirm it starts.
- Different config per environment must be per-environment values, not per-environment *code paths*
  (`if (env === 'prod')` branches that only one environment exercises).
- Record the variable inventory (name, purpose, where it is set) in the operator doc.

## 4. No dev values in shipped code (OPS-05, OPS-06)

- Grep the shipped code for development residue and clear every hit:
  `localhost`, `127\.0\.0\.1`, `:3000`/`:8000`/`:5173`, `http://` on non-loopback hosts,
  `ngrok`, `vercel\.app`/preview hosts in canonical/OG URLs, `test` keys, `sk_test`, `sandbox`,
  `example.com`, placeholder URLs left in source, and personal email addresses.
- Any absolute URL in the app must come from configuration (one canonical origin variable), so that
  preview, staging, and production build from the same commit. A hardcoded production domain in the
  codebase is a P1: it makes staging link to production, and it breaks the next domain change.
- Payment/email/API test keys are a P0 if they reach production: a test key silently accepts no real
  payments while appearing to work. Verify the configured key mode in the deployed environment.
- HTTP must be impossible: the origin redirects `http://` → `https://` (308), and
  `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` is served on the real
  domain over HTTPS. **HSTS only counts from a live response on the production origin** — a header
  set only on the dev server does nothing, and a header on an apex domain without the subdomain
  policy leaves subdomains downgradeable.
- Verify `www` vs apex in one direction only (one canonical host, the other 301s to it) and that the
  HSTS header is present on the canonical host. HSTS on a host you cannot serve over HTTPS for its
  subdomains is a self-inflicted outage — check the subdomain inventory first.
- Mixed content: no `http://` subresource on an HTTPS page (browsers block it; check the console).
- Custom domain and DNS: the domain resolves to the platform, the TLS certificate covers the
  canonical host and any `www`, renewal is automatic, and the certificate is valid (not expired, no
  name mismatch). Verify with a real request to the domain, not the platform's default host. Record
  the canonical origin and confirm it matches the `canonical` tags, OG URLs, sitemap, and any
  `APP_URL` variable — origin drift between these is a classic SEO and email-link bug.

## 5. Routing reality (OPS-07)

- **Direct navigation** must work on every route: open each public route (and a nested one) in a
  fresh tab, hard-refresh it (Ctrl/Cmd-Shift-R), and confirm a full document is served with the right
  status — not a blank page, not a 404, not a bare JSON error.
- SPA fallback must be configured: unknown client-side paths serve the app shell with a **200** for
  real app routes, while genuinely unknown paths serve the real 404 page with a **404** status.
  Serving the shell with 200 for everything is a soft-404 farm; serving 404 for valid deep links
  breaks bookmarks.
- Check asset paths under the deployed base path: `/_next/static/*` (or the equivalent) must 404
  only when the asset truly does not exist. A blank page after deploy that renders locally is
  usually a base-path or asset-prefix mismatch.
- Trailing slash and case must be canonicalised: pick one form, redirect the other with 301/308, and
  ensure it applies to the sitemap, internal links, and canonical tags. Verify `/Path/` and `/path`
  do not both serve 200 with different canonical tags.
- Verify the API routes/prefix are reachable on the deployed domain (not only the pages), and that a
  deep link into an authenticated route redirects to login with a return path rather than erroring.
- Check the 404 page itself: correct status, useful content, nav and legal links present
  (LEGAL.md §7), and no client-side error in the console.
- Trap: middleware or a rewrite rule that works on the dev server (or on one host) and not in the
  production deployment; verify on the deployed origin.

## 6. Cache correctness in the deployed environment (OPS-07, OPS-11 supporting)

- Hashed, immutable assets get a long cache: `Cache-Control: public, max-age=31536000, immutable` on
  content-hashed filenames. HTML must be short-lived (`no-cache` or a small `max-age` plus
  revalidation) — HTML cached for a year pins users to a dead build.
- **The classic failure**: long-cached HTML referencing a hashed asset that the new deploy removed →
  users get a blank page and a 404 asset until their cache expires. Fixes: short HTML TTL, deploy
  that keeps prior hashed assets for a window, and cache-busting on the document.
- Invalidation on deploy: know how the cache is purged (platform automatic, CDN purge API, or
  content-hashed URLs making purge unnecessary) and record it. "It just works" is not a mechanism;
  after a deploy, verify a changed page shows the new content in a browser with a warm cache.
- `Vary` on `Accept-Encoding` where compression is content-negotiated; on `Cookie`/`Authorization`
  for anything personalised — a cached authenticated response served to another user is a P0
  (SECURITY.md §9).
- Authenticated/private responses: `Cache-Control: private, no-store` (verify on a live request).
- CDN behaviour differs from origin behaviour; verify headers and staleness **at the edge**
  (`curl -I` against the real domain, twice, noting `age`/`x-cache`), not against the origin.
- Sitemap/robots and any dynamically generated XML: confirm they are not served from a stale cache
  after a content change.

## 7. Migrations (OPS-08 supporting)

- Migrations are ordered, versioned, committed, and applied by a single mechanism — not ad-hoc scripts
  run by hand on production. Record the command and the applied list.
- **Forward-only vs reversible**: state which the project uses. If forward-only, the rollback plan
  must account for schema changes that the previous app version cannot read (see §8) — the artifact
  is rollbackable, the schema may not be.
- Zero-downtime pattern for destructive changes: expand → migrate → contract.
  1. Deploy additive schema (new column/collection/field, nullable, with a default) and code that
     writes both.
  2. Backfill with a bounded, resumable job — never an unbounded update over the whole collection in
     one transaction.
  3. Switch reads to the new shape, verify.
  4. Remove the old field/column in a later release, once nothing reads it.
  A rename or a NOT NULL added in one step takes the app down between the migration and the deploy.
- **Index builds** need care: on large collections a blocking index build stalls writes. Use the
  non-blocking option (`CREATE INDEX CONCURRENTLY`, MongoDB background/rolling build) in production,
  and verify the index exists with the expected keys after the migration (DATA.md).
- Migrations must be idempotent or tracked by a version table/marker so a re-run does not fail the
  deploy or duplicate data.
- Never run a destructive migration (drop, truncate, type change with loss) without a verified backup
  taken immediately before (§9) and a stated way to restore.
- Verify: run migrations against a restored copy of production-shaped data, record the command, the
  duration, and the resulting schema/plan.

## 8. Rollback (OPS-08)

- The previous artifact must be restorable: the platform's previous deployment can be promoted, or
  the exact commit can be rebuilt and redeployed. Record **which** — a rollback path that only exists
  in someone's memory is not a path.
- Write the steps down (command or platform action, expected duration, who can do it) in the operator
  doc, and confirm the artifact is actually retained (platform retention window, or a tagged
  release/image).
- **What rollback does to data written by the new version** is the part teams forget: if v2 wrote a
  new field, changed an enum, or migrated a shape, v1 may fail to parse those rows after rollback.
  Document the answer per release: safe, degraded (which feature), or destructive (needs a
  compensating migration).
- Roll back migrations only where a tested down-migration exists; otherwise document that rollback is
  app-only and name the data risk.
- The decision rule must be written: at what symptom do we roll back rather than fix forward
  (e.g. sustained 5xx above threshold, checkout broken, data corruption suspected).
- Verify the path by exercising it once, ideally in staging: deploy, promote the previous version,
  confirm the app serves and the smoke checklist (§12) passes.
- Trap: a rollback that also requires reverting environment variables, DNS, or cache purge — none of
  which the platform's "redeploy previous" button does. List them.

## 9. Backups and restore (OPS-12 supporting)

- Backups configured and confirmed with a real artefact: where they live, the schedule, the retention
  window, the encryption, and the account that can restore them. A dashboard toggle with no verified
  artefact is a hypothesis.
- **Run a restore drill.** Restore into a scratch database, then verify counts and a couple of known
  records match the source. Record the command, the duration, and the observed counts. An untested
  backup is not a backup.
- State the point-in-time recovery window (how much data a worst case loses) and whether it is
  acceptable.
- Backups are only useful with the matching schema/version: note whether the restore requires the app
  version that wrote it.
- Cover the non-database stores too: object storage/uploads, and any external system holding data the
  product cannot regenerate. Verify each is covered or explicitly recorded as unrecoverable.
- Restrict who can restore — a restore path is a data-exfiltration path (SECURITY.md §9).
- Retention of backups must be consistent with the privacy policy's deletion promise; state how long
  a deleted account can persist inside backups and how that is handled (LEGAL.md §3/§7).

## 10. Dependencies and lockfile (OPS-09)

- Commit the lockfile; install from it in CI and production. A rebuild that resolves new versions is
  not reproducible and can ship an unreviewed change.
- Define the cadence and the owner: e.g. a weekly automated update PR, reviewed and merged by a named
  person, with patch/minor merged after the gate is green and majors scheduled deliberately.
- Run the ecosystem audit (`npm audit`, `pip-audit`, `govulncheck`) in CI or on the cadence, and
  record findings — SECURITY.md §8 owns resolution; this item owns the routine.
- Remove unused dependencies: each is attack surface, install time, and bundle weight.
- Bound versions, and inspect lockfile diffs in review — a lockfile change that was not intended is
  how a compromised or breaking transitive dep arrives.
- Record the runtime version support window (Node LTS end-of-life) and upgrade before it lapses.
- Verify: fresh install from the lockfile in a clean directory produces the same resolved versions.

## 11. Bundle size and Lighthouse (OPS-10, OPS-11)

- Bundle size must be visible **in the build output** (the framework's route/asset table) and tracked
  over time. Record the numbers per deploy: total first-load JS, largest chunks, and any route that
  grew. A build that hides sizes cannot detect the 300KB regression that ruins mobile conversion.
- Record the largest chunks and their contents; a bundle that grew by a library someone imported in
  one component is the usual cause.
- Run Lighthouse/PageSpeed against the **production artifact on the real URL** (deployed origin, or
  the production server locally), mobile profile, on the audited public pages. Record the four scores
  and the CWV metrics — see SKILL.md's gate thresholds (perf ≥ 0.90, a11y = 1.0, best practices
  ≥ 0.95, SEO ≥ 0.95; LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms).
- Enforce the thresholds, don't just report them: record the run in the state file, and fail the item
  if a floor is missed. If the project already declares stricter budgets, theirs win.
- Run it in a state a real visitor experiences: no dev-only scripts, no localhost CDN, cache warmed
  the way a returning user has it, and the consent banner in its default state. A score measured
  behind a debug build is fiction.
- Numbers, not adjectives: "perf 0.94 → 0.98, LCP 3.1s → 1.9s" is evidence; "improved" is not.

## 12. Environments and the operator doc (OPS-12, OPS-13)

- **Staging distinct from production**: separate database, separate credentials, separate storage
  bucket, separate payment keys (test mode), separate mail capture, and — critically — no shared
  database. Sharing a database between staging and production is a P0: a staging migration or test
  run destroys production data.
- Staging should be deployable the same way as production (same pipeline, different variables), and
  it must not be indexed (`X-Robots-Tag: noindex` or `robots.txt` disallow plus auth) — a public
  staging site competes with production and leaks unreleased features.
- If the project genuinely runs a single environment, record an explicit risk note: what a bad deploy
  costs, why staging was skipped, and what substitutes for it (rollback discipline, smoke checklist).
  Silence is not an acceptable answer here.
- The deployment doc must let a stranger ship: prerequisites (accounts, access, CLI version), the
  exact commands in order, the required environment variables and where they are set, the migration
  step, how to verify the deploy, the rollback command, the failure modes with their symptom → cause,
  and **where the logs live**.
- Keep it accurate after each change (a stale command is worse than none), and include the health
  URL and the smoke checklist (§13) in it.
- Verify by following the doc literally from a clean checkout with a second pair of eyes (or by
  reading each command and confirming it exists and is current).

## 13. Post-deploy smoke checklist

Run after every deploy, against the deployed origin, before declaring success:

| Check | Expected |
|---|---|
| Health endpoint | documented status, dependencies healthy |
| Home page | 200, real content, no console errors |
| Auth | signup or login succeeds with a scratch account; logout works; the session cookie is set |
| Primary flow | the core product action completes end to end (create → view → result) |
| Error page | an unknown URL returns the designed 404 page with a **404** status |
| Deep link | a nested route loads on hard refresh |
| Assets | no 404s in the network panel; CSS/JS from the new build |
| `robots.txt` / `sitemap.xml` | served, 200, correct canonical origin, staging excluded |
| Legal links | footer links resolve on app and marketing pages (LEGAL.md §7) |
| Logs | the deploy's requests appear in the log sink; no unexpected `error` lines |
| Cleanup | scratch accounts/records created by the smoke run removed, deletion confirmed |

Record the run (timestamp, commit, each row's observed result) in the state file. A deploy without a
recorded smoke run is `fixed`, not `verified`.

## Checklist mapping

| ID | Item |
|---|---|
| OPS-01 | Production build from clean checkout |
| OPS-02 | CI gate fails on typecheck/lint/test/build |
| OPS-03 | Env vars documented and validated |
| OPS-04 | No dev defaults in production paths |
| OPS-05 | HTTPS enforced |
| OPS-06 | Custom domain and DNS verified |
| OPS-07 | Direct navigation and refresh work |
| OPS-08 | Rollback path defined |
| OPS-09 | Dependency update process defined |
| OPS-10 | Bundle size visible and tracked |
| OPS-11 | Lighthouse against production build |
| OPS-12 | Staging distinct from production |
| OPS-13 | Deployment doc accurate for new operator |
