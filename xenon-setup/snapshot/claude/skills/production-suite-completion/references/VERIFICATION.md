# Verification — how to prove a claim

## The rule

A checklist item reaches `verified` only with `{command, observed result}` recorded in the state
file. Everything else is `fixed` (code changed, not yet observed) or `open`.

`fixed` ≠ `verified`. Never promote without observation. If the observation is impossible in the
current environment (no credentials, no deployed origin), record `blocked` with a named need.

## Build the command set once

Discover the real commands from the manifest. The canonical shape for a JS/TS project:

```
typecheck : tsc --noEmit            (or the framework's typecheck script)
lint      : eslint . --max-warnings=0   (or next lint / ruff check / golangci-lint)
unit      : node --test / vitest run / jest --ci / pytest -q
integration: the API/route test script
build     : the production build
start     : the production server
audit     : lighthouse / axe / size checks
```

If any of these do not exist, create them as manifest scripts in the same batch — an unverifiable
guarantee is worth nothing, and a script is the cheapest form of permanence. Add an aggregate
`verify` script (typecheck && lint && unit && build) and wire it into CI.

Write the resolved commands into `state.json.commands` so a resumed run does not rediscover them.

## Evidence by change type

| Change | What counts as evidence |
|---|---|
| Server/API | real request: method, path, status code, response headers, body excerpt |
| Auth/authorization | the request made **as a non-privileged or unauthenticated client** that now fails |
| Database index | the explain/plan output showing an index scan instead of a collection scan, before and after |
| Query/pagination | row count returned vs total, and the endpoint's page semantics |
| Validation | the malformed payload and the 4xx it now produces |
| UI/state | browser screenshot or DOM assertion of the state (loading/empty/error/success) |
| Accessibility | audit id + score, or the specific rule that now passes plus the element |
| Contrast/theme | computed style values from a live page (`getComputedStyle`), not the palette source |
| Security headers | response headers captured from a production-mode server |
| SEO | rendered `<head>` for each page; the sitemap/robots body; a 404 status for an unknown URL |
| Performance | the tool, the settings/profile, the numbers before and after |
| Legal/content | the file, the page that renders it, and confirmation there is no fabricated data |
| Deployment | the command, the exit code, and the produced artifact/output |
| Cleanup | a query showing the test records are gone |

## Browser verification

Prefer automated browser driving over description. Practical checklist for any UI claim:

1. Navigate to the real URL (production build server if the gate is a gate; dev is fine mid-batch).
2. Wait for the state you are asserting, not a fixed delay.
3. Assert the rendered DOM/CSS — computed styles, `aria-*`, focus position, network calls.
4. Capture a screenshot for any visual claim (theme, layout, contrast, empty state).
5. Check the console for errors and the network panel for failed or duplicated requests.

Two traps: (a) a page that "looks right" in a screenshot can still be wrong in the accessibility
tree — check both; (b) hydration-dependent UI is invisible to a static HTML fetch, so fetch-based
"verification" of an interactive state is not verification.

## Test data hygiene

Verification writes real records: test accounts, boards, votes, uploads. Always:

- Use an obvious namespace (prefix, plus-addressed email, `test_` handles) and a reserved domain.
- Clean up after the run: delete created records through the app's own delete path where possible,
  otherwise directly in the store.
- Record the post-cleanup confirmation (`count = 0`) as the evidence for `TEST-10`.
- Never run destructive verification against real user data. Point at a scratch database or the
  seeded demo data, and say which one you used.

## Regression discipline

After every batch, and **mandatorily** after any of these changes, re-run the end-to-end user flow
check, because they are the categories that silently break working behaviour:

- security headers / CSP
- caching or cache invalidation
- auth/session logic
- middleware or routing
- database schema or index changes
- dependency upgrades

If a batch breaks something, fix forward in the same batch. Do not accumulate broken state across
batches — the run must end with a green gate, not a pile of "known broken" notes.

## Re-verification of previously green items

At the end of the run, re-run the full gate set once more against the final artifact. Items verified
in batch 3 can be invalidated by batch 7 (a new route missing metadata, a new page failing contrast,
a new dependency adding weight). The final gate run is the one that counts in the report.

## When verification is genuinely impossible

Say so plainly, with the reason and what would unblock it:

- requires a verified sending domain (real email delivery)
- requires production credentials or infrastructure access
- requires legal review of jurisdiction-specific text
- requires real customer data (testimonials, logos, case studies)
- requires a decision the owner must make (pricing, whether to charge)

These go in `blocked[]` and into the report's Remaining section. Everything else must be verified.
An honest blocked item is a success; a faked green is the failure mode this skill exists to prevent.
