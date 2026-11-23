# Security — hardening without breaking the product

Security work breaks working features more often than any other domain (headers, CSP, cookie flags,
auth refactors). After every change here, re-run the full user-flow check.

## 1. Secrets

- Scan tracked files, not the working tree: `git grep -nE '(api[_-]?key|secret|token|password|passwd|private[_-]?key)'`
  plus a dedicated scanner in CI. Check history, not just HEAD — a rotated key that was committed is
  still exposed.
- Only `.env.example` (or equivalent) is committed, with every variable documented and no real values.
- Required production variables are validated **at boot** with a clear failure message; a missing
  secret must crash loudly, never silently fall back to a development default.
- Nothing privileged ships to the browser: inspect the client bundle for keys, and check that any
  public analytics/browser key is genuinely public.
- Logging must never contain tokens, cookies, passwords, full user records, or raw request bodies.

## 2. Authorization (the #1 source of real vulnerabilities)

- Every mutating route: authenticate → authorize → validate → execute. In that order.
- **Per-resource, not per-route.** After loading the record, verify the caller owns or may act on it.
  A route that checks "is logged in" is not authorization.
- Test from the adversary's seat: request another user's record by ID with a valid session of your
  own. The correct answer is 403 or 404 — never 200, never a partial leak.
- Never trust client-supplied role, owner id, or price. Derive identity from the session only.
- Client-side guards are UX affordances. They do not count as enforcement, and the audit must state
  which server check backs each one.
- Admin/internal paths: verify they are unreachable without the privilege, and are excluded from
  indexing and from the sitemap.

## 3. Sessions, tokens, cookies

- Bounded lifetime, server-side expiry, and a working revocation path (a version/epoch bump that
  invalidates existing sessions — and prove it invalidates both reads and writes).
- Cookies: `HttpOnly`, `Secure`, `SameSite` appropriate to the flow, scoped path/domain. Verify in a
  real response header, not in the source.
- Reset and verification tokens: single-use, expiring, scoped to one purpose and one account, and
  never leaked to another account by forwarding the message (bind by HMAC or equivalent).
- Enumeration safety: identical responses and timing for existing vs non-existing accounts on login,
  reset, and signup. Password reset must not confirm whether an address exists.
- Session payload: expose only what the client uses. Internal fields (version counters, internal ids)
  stripped from the serialized session.
- Brute force: per-account lockout or progressive delay, not only per-IP/per-email. An attacker
  rotating the target address sidesteps a purely per-email bucket; an attacker sharing an IP
  sidesteps a purely per-IP bucket.
- Password storage: current algorithm (bcrypt/argon2/scrypt) with a sane cost; enforce a reasonable
  minimum length and cap the input length to avoid hashing cost abuse.

## 4. Input handling

- Validate every user-controlled value server-side against a schema, including query params and path
  params — not just bodies.
- Parameterize all queries; no string concatenation into query languages. For document databases,
  reject objects where scalars are expected (operator injection: `{ $gt: "" }` arriving as a value).
- Escape on output; never inject user content into HTML, attributes or `dangerouslySetInnerHTML`
  without sanitization. Rich text gets an allowlist sanitizer.
- Cap request bodies; reject oversized payloads before parsing.
- Uploads: validate MIME and extension server-side, cap size, never store in an executable/served-
  as-code location, generate the stored filename, and strip metadata where relevant.

## 5. Transport and headers

Verify these on the production origin (a live response), not by reading config:

| Header | Purpose |
|---|---|
| `Content-Security-Policy` | XSS containment. Build it from what the app actually loads; avoid `unsafe-inline`/`unsafe-eval` unless proven necessary, and never ship debug-only relaxations |
| `Strict-Transport-Security` | HTTPS enforcement |
| `X-Content-Type-Options: nosniff` | MIME confusion |
| `Referrer-Policy` | Leak control for outbound links |
| `X-Frame-Options`/`frame-ancestors` | Clickjacking |
| `Permissions-Policy` | Disable unused browser features |

CSP discipline: implement it in report-only first if the surface is large, watch for violations across
every route, then enforce. A CSP that breaks the app is worse than none; a CSP with `unsafe-eval` left
from a debugging session is theatre. Record which directives are non-trivial and why.

## 6. CSRF and cross-origin

- If auth is cookie-based, protect mutations with same-site cookies plus an origin/CSRF check.
- Origin checks must accept the *configured* application origins, not one hardcoded URL (a single
  hardcoded origin breaks every other deployment and is a common production-only failure).
- Ensure checks apply to every mutating route — and note that "GET is safe" stops being true the day
  someone adds a side effect to a GET.
- CORS: enumerate known origins in production. Wildcard plus credentials is always a bug. Restrict
  methods and headers to what is used.

## 7. Abuse and rate limiting

- Key on a **trusted** client identity. Behind a proxy, only trust headers the platform edge sets and
  overwrites; otherwise every user shares one bucket and a single attacker locks out the platform.
  Verify on the deployed origin, because this failure mode is invisible locally.
- Separate buckets for the sensitive paths: login, registration, password reset, writes, expensive
  reads. A single blanket bucket both under- and over-protects.
- Include an identity dimension *and* an account dimension for auth endpoints.
- Return 429 with a retry hint; make the limiter idempotent so a retry does not double-count.

## 8. Dependencies

- Run the ecosystem audit and record the output in the state file.
- Resolve high/critical; where a finding is unavoidable, record the advisory, the exposure, and the
  mitigation — do not silently ignore.
- Remove unused packages: an unused dependency is attack surface plus bundle weight.
- Commit the lockfile; pin or bound versions so a rebuild is reproducible.

## 9. Data protection

- Personal data: collect only what the product uses, say so in the privacy policy, and make deletion
  actually delete (or anonymize) across every store, including sessions and derived aggregates.
- Soft-deleted records must be excluded from all reads and from uniqueness constraints, or deleted
  records will silently block future writes.
- Backups: configured, and the restore procedure written down. An untested backup is a hypothesis.
