# Reporting — the final deliverable

The report is what the owner reads and what a future maintainer trusts. It must be derivable back to
evidence, and it must never claim more than was verified.

## Where it goes

Write `.production-suite/REPORT.md` in the project root, and mirror the same content into the project's
docs folder if one exists (`docs/production-suite.md` or similar). Keep the state file next to it so
the raw evidence survives.

## Structure

```markdown
# <Project> — Production Readiness Report

Date · stack · deploy target · run duration · batches · checklist coverage (verified/blocked/n/a/total)

## Verdict
One paragraph: is this production-ready? What is the strongest remaining risk?

## Completed
Per domain, with item counts and the headline changes. Group by domain, not by phase order.

## Measurements
| Metric | Before | After | Tool/profile |
Perf numbers, bundle sizes, query plans, test counts. Only measured values.

## Security
What was hardened, what was verified live (headers, authz tests), what remains.

## SEO / Legal / UX / Infrastructure
Same shape: what exists now, where it lives, what is verified.

## Changed files
Grouped, one line each, with the reason.

## Blocked / Remaining
| Item | What it needs | Owner action |
Only genuinely external items: credentials, legal review, real customer data, infrastructure access,
business decisions. Each with the concrete unblocking action.

## Verification table
| Check | Command | Result |
Every gate and every significant scenario, with the observed output.

## Assumptions made
Decisions taken autonomously because they were not specified, with the reasoning in one line each.
```

## Rules

- **No adjectives where numbers exist.** "Dashboard aggregation bounded" is weak; "dashboard
  aggregation now filters by indexed creator id; p95 query time 1.2s → 40ms on 5k records" is a
  report.
- **Distinguish verified from implemented.** The Verification table carries only observed results;
  the Completed section may describe changes whose verification lives in that table.
- **Partial work is labelled partial.** "Implemented the report model and route; owner inbox UI not
  built" is honest and actionable. "Moderation complete" would be a lie.
- **Blocked items name the unblock.** Not "needs legal" but "needs the operator's registered legal
  entity name and jurisdiction; then replace the two placeholders in `legal/terms`".
- **Clean up before reporting.** Test data removed, scratch files deleted, temporary scripts either
  promoted to real scripts or removed. Report the cleanup confirmation.
- **State the environment.** Which database, which origin, dev or production build, what was stubbed.
  A reader must be able to tell whether "verified" meant "against production" or "against a local
  seeded copy".
- **List assumptions.** Anything decided autonomously (defaults chosen, copy written, conservative
  option taken) is listed so the owner can override it in one revision.

## Anti-patterns

- A report that lists checklist headings with "done" and no evidence — unreviewable.
- Claiming a Lighthouse score without the profile and page list.
- Reporting "all tests pass" when the suite does not cover the flows that were manually verified;
  say which flows were manual.
- Omitting the blocked section because it feels like failure. The blocked list is the most useful part
  of the report for the owner.
- Reporting only what changed and not what was checked and found already correct — the reader needs to
  know the audit's coverage, not just its output.
