---
name: production-suite-completion
description: Use when a project must be taken from "it works" to production-ready - a full autonomous hardening pass over performance, database, API, security, UX, accessibility, SEO, legal, observability, ops and code hygiene. Trigger phrases include "make it production ready", "production-suite-completion", "harden this app", "professional pass", "audit and fix everything", "ship-ready", "run the full production checklist", "verify everything and fix until green". Not for single-file bug fixes or one-off feature work.
license: MIT
---

# Production Suite Completion

Drive a repository from working prototype to a launchable product: audit, fix, verify, re-audit, until
every gate in `assets/checklist.json` is either **passing with recorded evidence** or **explicitly
blocked on external input**. Autonomy is the point — never stop to ask "should I continue?".

## Non-negotiables

1. **Preserve behaviour.** The product's concept, stack, visual identity and working features stay.
   Refactoring is only allowed as a consequence of fixing a real production defect.
2. **Evidence or it did not happen.** Every item marked done carries a command and its observed
   result. "I checked" is not evidence. A claim without a command is a lie waiting to surface.
3. **Never fabricate.** No invented testimonials, logos, statistics, certifications, SLAs, company
   details or legal facts. Build the structure, label the placeholder
   (`<!-- REQUIRES REAL BUSINESS DATA -->`), list it in Remaining.
4. **Smallest reliable solution.** No new SaaS, no new service, no new dependency when the existing
   stack solves it. Production-ready ≠ complicated.
5. **Never break the build to fix a checklist item.** Typecheck, lint, tests, build must pass at the
   end of every batch, not only at the end of the run.
6. **Security is never traded for convenience.** No secrets in the repo, no client-side-only
   authorization, no stack traces in responses.

## Phase 0 — Recon (before any edit)

Do all of this, then stop reading and start working:

- Read the manifest (`package.json` / `pyproject.toml` / `go.mod` / …), lockfile, framework config,
  tsconfig, lint config, env examples, CI config, `README`, and any existing docs folder.
- Establish the **verification command set** — the exact commands that decide "done". If a script
  does not exist, create it (see `references/VERIFICATION.md`).
- Establish the **app's real run mode**: dev server vs production build + start. Audits and gates run
  against the production build; feature verification may use either, but the final run must be
  production.
- Detect what is *not* present: tests, CI, health endpoint, error boundaries, sitemap, robots, legal
  pages, favicon set, manifest, analytics, structured logging. Absence is the work list.

Then create the state file (next section). No edits before it exists.

## State file — the loop's memory

Create `.production-suite/state.json` in the project root (gitignored or committed, project's choice)
and update it after **every** batch. It is what makes a multi-hour run survivable across context
limits and restarts.

```json
{
  "started": "<ISO date>",
  "stack": { "framework": "", "runtime": "", "db": "", "auth": "", "deployTarget": "" },
  "commands": { "typecheck": "", "lint": "test": "", "build": "", "start": "", "audit": "" },
  "gates": { "typecheck": "unrun", "lint": "unrun", "tests": "unrun", "build": "unrun", "lighthouse": "unrun" },
  "items": {
    "PERF-01": { "status": "open|fixed|verified|blocked|n/a", "evidence": "", "files": [], "note": "" }
  },
  "findings": [
    { "id": "SEC-03", "sev": "P1", "summary": "", "evidence": "file:line", "fix": "" }
  ],
  "blocked": [ { "id": "", "reason": "", "needs": "" } ],
  "batch": 0
}
```

Rules: `verified` requires evidence. `blocked` requires a named external dependency (credential,
legal review, real customer data, infrastructure access). `n/a` requires a one-line reason.
Seed `items` from `assets/checklist.json` — 150+ items across 14 domains, each with `sev` and a
`verify` statement. Never invent your own IDs; the IDs are how the final report proves coverage.

## The loop

```
RECON → STATE → AUDIT (findings, severity-ranked) → PLAN (batches)
      → BATCH: fix → verify → record evidence → next
      → GATE: typecheck · lint · tests · build · lighthouse
      → SECOND AUDIT (adversarial, different lens)
      → GATE again → FINAL REPORT
```

**Batching.** Group by blast radius, not by checklist order: P0 items first (data loss, auth
bypass, broken prod config), then P1 correctness, then scale/ops, then polish. 3–8 related items per
batch is the sweet spot — large enough to be worth a build, small enough to isolate a regression.
After each batch: run the verification command set, fix regressions immediately, update state.

**Severity.** P0 blocks real users, loses data, or breaks production. P1 is visibly broken or unsafe
at scale. P2 is polish, correctness or an operational gap. Fix P0/P1 to completion; P2 items may be
deferred only with a written reason in `Remaining`.

**Audit depth.** Read the real code and exercise the real app — not the README. Findings must cite
`file:line` or a live request/response. Run two independent audits and diff them; the second pass
exists because the first one always misses something (see `references/AUDIT.md` for the adversarial
lenses: first-time visitor, new user, returning user, mobile user, slow-network user, user who errs,
search engine, screen-reader user, maintainer, production operator).

**Stop condition.** All checklist items `verified`, `blocked` or `n/a`; all gates green against the
current commit; second audit findings resolved or deferred with reason. Then write the report and
close with exactly one label from `references/GATES.md` (`ready`, `partial_with_accepted_risks`,
`blocked`, `scan_incomplete`). Nothing else ends the run — and nothing may be labelled `ready` while
it contains an unverified claim.

## Gates — what "green" means

Run these against the production build, not the dev server:

| Gate | Pass condition |
|---|---|
| Typecheck | exits 0, zero errors |
| Lint | exits 0, zero errors; warnings triaged individually |
| Tests | all pass; failures fixed, never skipped or marked todo |
| Build | production build succeeds, route/asset output recorded |
| Lighthouse | performance ≥ 0.90 mobile, accessibility = 1.0, best-practices ≥ 0.95, SEO ≥ 0.95 on every audited public page |
| Core Web Vitals | LCP ≤ 2.5s (mobile field-equivalent), CLS ≤ 0.1, INP ≤ 200ms |
| Accessibility | automated a11y clean; any waiver names the audit id and the reason |
| Security | no high/critical advisories; headers verified live; secret scan clean |

Thresholds are floors, not goals. If the project already declares stricter budgets, theirs win.
Record the numbers, not adjectives — "perf 0.94 → 0.98" beats "improved performance".

## Domain routing

Read the reference for a domain **when you start that domain**, not all at once — that is the whole
point of splitting them. Each reference holds the deep checklist, framework-agnostic fix patterns,
and the traps that make the naive fix wrong.

| Domain | IDs | Reference |
|---|---|---|
| Performance, bundles, images, caching, CWV | `PERF-*` | `references/PERFORMANCE.md` |
| Database: indexes, pagination, N+1, transactions | `DATA-*` | `references/DATA.md` |
| API contracts, validation, status codes, rate limits | `API-*` | `references/API.md` |
| Security: headers, authz, CSRF, secrets, deps | `SEC-*` | `references/SECURITY.md` |
| UX states: loading, empty, error, destructive, responsive | `UX-*` | `references/UX.md` |
| Accessibility | `A11Y-*` | `references/ACCESSIBILITY.md` |
| SEO, OG, structured data, indexability | `SEO-*` | `references/SEO.md` |
| Legal, trust, truthful content | `LEGAL-*` | `references/LEGAL.md` |
| Conversion & marketing surface | `CONV-*` | `references/CONVERSION.md` |
| Analytics, logging, request IDs, monitoring | `OBS-*` | `references/OBSERVABILITY.md` |
| Deployment, CI, env, rollback | `OPS-*` | `references/DEPLOYMENT.md` |
| Code hygiene, dead code, secrets in source | `CODE-*` | `references/CODE_QUALITY.md` |
| Branding, footer, icons, emails | `BRAND-*` | `references/BRANDING.md` |
| Tests, browser verification, final proof | `TEST-*` | `references/VERIFICATION.md` |
| Report format, evidence tables, Remaining section | — | `references/REPORTING.md` |
| Adversarial second-audit lenses | — | `references/AUDIT.md` |
| Gate commands, thresholds, anti-tamper, verdict labels | — | `references/GATES.md` |
| Machine-readable item list (severity + verify per item) | all | `assets/checklist.json` |
| Scaffold the state file from the checklist | — | `scripts/init-state.mjs` |

## Verification discipline

A fix is not done when the code compiles. It is done when the **user-visible behaviour** was
observed after the change:

- UI change → drive the real page (browser automation), and read the rendered DOM/CSS rather than
  trusting the source. Several classes of bug (specificity, theme variables, focus order, contrast)
  are invisible in source and obvious in a screenshot.
- API change → make the real request and record status, headers and body.
- Data change → query the real database and record the result count/shape.
- Perf change → measure before and after with the same tool and settings.
- Anything involving cleanup (test records, fixtures, seeds) → confirm the store is back to its
  pre-test state.

Where a test *can* be made executable, make it executable — a guarantee that only a human can check
decays immediately. Prefer adding a script to the manifest over a manual ritual.

## Traps that make agents fail this task

- **Declaring done from code reading.** The most common failure. If you did not run it, it is not
  verified — mark it `fixed`, not `verified`.
- **Fixing everything and verifying never.** Batch, verify, record. Repeat.
- **Checklist sprawl.** Do not read all references up front; load per domain.
- **Cosmetic compliance.** `aria-label` on a `div`, a sitemap that lists private routes, a CSP that
  exists but is bypassed by `unsafe-eval` left in from debugging, a "loading state" that never
  renders. Fix the substance.
- **Trust-boundary blindness.** Client-side guards are UX, not security. Every authorization claim
  needs a server-side check exercised from a non-privileged client.
- **Breaking live behaviour while hardening.** Security headers, caching and CSP routinely break
  working features. Re-run the full user-flow check after each such change.
- **Test data left behind.** Verification writes real rows. Clean up and confirm.
- **Silent scope explosion.** Do not build new features. If an item implies a feature (reports,
  winner selection, notifications), implement the minimum that satisfies the item and say so.
- **Stopping to ask.** Ask only when a decision is genuinely the owner's (pricing, legal entity,
  whether to charge money). Otherwise choose the conservative option, state it, move on.

## Final report

Use `references/REPORTING.md`. Structure: Completed (by domain, with counts) · Changed files ·
Measurements (before → after) · Security · SEO · Legal · UX · Infrastructure · Blocked/Remaining
(each with what it needs) · Verification table (command → result). Report only what was verified;
partial work is described as partial. The report is the deliverable — a reader must be able to
re-derive every claim from it.
