# Gates — the mechanical definition of done

A gate is a command with a pass condition. Nothing in this skill counts as complete because it looks
complete; it counts as complete because a gate exited 0 and the output was read.

## Gate table

| Gate | Command shape | Pass condition | Blocking |
|---|---|---|---|
| Types | `tsc --noEmit` / `go build ./...` / `mypy` | exit 0, zero errors | yes |
| Lint | `eslint . --max-warnings=0` / `ruff check` | exit 0, zero errors | yes |
| Unit | `vitest run` / `node --test` / `pytest -q` | all pass, none skipped to get green | yes |
| Integration/E2E | the API or browser suite | all pass | yes |
| Build | production build | exit 0, artifact emitted | yes |
| Coverage | coverage reporter vs thresholds | changed-lines ≥ 80% where a suite exists | advisory → enforce if already configured |
| Secrets | `gitleaks detect --redact` | no findings (**`--redact` is not optional** — otherwise the secret lands in the transcript) | yes |
| Dependency audit | `npm audit --audit-level=high` / `osv-scanner` | no high/critical unresolved | yes |
| SAST | `semgrep --config p/default --config p/owasp-top-ten` | no high findings | advisory |
| Bundle size | `size-limit` / `bundlewatch` | under declared budget | yes once a budget exists |
| Accessibility | Lighthouse a11y + `axe` with tags `wcag2a,wcag2aa,wcag21a,wcag21aa` | Lighthouse a11y = 1.0; axe: zero critical or serious | yes |
| Performance | Lighthouse ≥ 3 runs, median or optimistic aggregation | performance ≥ 0.90 mobile | yes |
| Core Web Vitals | Lighthouse audit values, or field data if available | LCP ≤ 2500 ms, CLS ≤ 0.1, INP ≤ 200 ms | yes |
| SEO | Lighthouse SEO category | ≥ 0.95 | yes |
| Best practices | Lighthouse best-practices category | ≥ 0.95 | yes |
| Smoke | health + primary flow against the built artifact | expected status and content | yes |

Run Lighthouse with a fixed config (`numberOfRuns: 3`, explicit `formFactor`, explicit throttling) and
record the profile with the score. A score without its profile is not evidence.

## Cost-ordered tiers

Slow checks in the edit loop kill the loop, so split them by cost:

- **fast** (< 5 s) — types, lint on changed files, secret scan. Run after every edit.
- **task** (< 90 s) — full test suite, changed-line coverage. Run when you believe a batch is done.
- **full** (minutes) — build, E2E/a11y/perf against the built artifact, audit scans. Run at batch
  boundary and once more against the final artifact.

## Threshold right-sizing

Fixed thresholds that the codebase cannot meet are worse than none: a permanently red gate is an
ignored gate. When a real target does not exist yet, **ratchet**: record today's number and forbid
regression (with a small tolerance, ~0.5%), then raise it as the number improves. Never lower a
threshold to make a change pass — that is the tamper move described below.

Where the project already declares a stricter budget, the project wins.

## Anti-tamper: gates that cannot be passed by weakening them

The failure mode this section exists for: an agent under pressure makes the gate green by disabling
the thing the gate measures. Pin a base and check the diff, not just the result.

```bash
export DONE_BASE=$(git rev-parse HEAD)   # at session start, before any edit

# 1. test files must not have been weakened
git diff --name-only "$DONE_BASE" -- '**/*.test.*' '**/*.spec.*' '**/tests/**'

# 2. no new suppressions / skips / stubs introduced
git diff "$DONE_BASE" | grep -E '^\+.*(\.skip\(|\.only\(|@ts-ignore|@ts-expect-error|eslint-disable|# noqa|# type: ignore|it\.todo|\bTODO\b)'

# 3. no gate config weakened (thresholds, ignore lists, CI triggers)
git diff "$DONE_BASE" -- '**/.lighthouserc*' '**/size-limit*' '**/*.config.*' '.github/**'
```

Both commands must come back empty. Compare against the **pinned base**, not `HEAD` — an agent that
commits its own tampering passes a `HEAD` diff. Do not pipe into `grep -q` (SIGPIPE/pipefail trap).

Five tamper moves to watch: a threshold moved down, a test made easier, a checker silenced, work
declared done while unfinished, a new permanent exception added.

## Completion sentinel

Emit the completion signal only when every non-blocked gate has exited 0 **against the current
commit**, and the gate output was read. If the run is driven by an external loop (a Stop-hook style
controller or an orchestrator), it should re-run the gate command itself and only accept completion
when it exits 0 — a prose claim of green is not a gate. Loop budgets must include an escape hatch:
two consecutive iterations with no measurable progress → stop as blocked and report.

## Honest verdicts

End the run with exactly one label, and say which:

- `ready` — every applicable gate green, nothing blocked.
- `partial_with_accepted_risks` — gates green; named items consciously deferred with reasons.
- `blocked` — specific external inputs missing (credentials, legal review, real data, infrastructure).
- `scan_incomplete` — parts of the audit could not be performed; say which and why.

Never report `ready` with an unverified claim inside it.
