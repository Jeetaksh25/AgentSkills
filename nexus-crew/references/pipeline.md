# Pipeline details

## Tiers

Pick the tier by the cost of a wrong answer, not by size. When unsure, pick the higher tier.

| Tier | Typical work | Who builds | Gate 2 | Gate 3 |
|---|---|---|---|---|
| 0 | boilerplate, config, renames, docs, simple components | worker | worker cross-review | Claude haiku, high effort |
| 1 | clear-spec features | worker | worker cross-review | Claude sonnet, high |
| 2 | algorithms, concurrency, performance paths, heavy UI | Claude sonnet/medium after a worker wrote the tests | none (Claude builds) | Claude opus, medium |
| 3 | unsafe or FFI, auth, crypto, money, security boundaries | Claude opus/medium after a worker wrote the tests | none | Claude opus high, plus the sentinel for security |

## Writing a brief

A brief is the contract. A worker has no other context, so what the brief leaves open, the worker will guess.

1. **Goal**: one paragraph, what exists when the unit is done.
2. **Files**: the only files that may change.
3. **Interfaces**: exact signatures, formats and error cases. Acceptance: a reviewer can find code for every sentence.
4. **Done-tests**: each is "given, when, then" and becomes a test. Include boundaries and error paths.
5. **Checks**: one backticked command per line under `## Checks`; the executable must be in `allowed_executables`.
6. **Constraints and out of scope**.

If a tier 0-1 brief cannot be written without an open design question, the unit is a tier 2 unit.

## The worker contract

Build and test workers end with exactly: `STATUS: DONE | BLOCKED`, `FILES:`, `TESTS:`, `NOTES:`. Review workers end with `VERDICT: PASS | FIXES` and numbered findings, each with an exact fix. `BLOCKED` means the brief needs a decision: answer it from the docs or escalate, and never let the worker guess. Workers run with deny rules (`assets/worker-settings.json`): no `.env`, no commit, push, checkout, reset or merge, no web access.

## Gates

- **Gate 1** (`gates.ps1`): detected checks (Cargo, or the package scripts typecheck, lint, test), the `gates` in the config, the brief's checks, a change check against the base branch, and a secret scan of the diff and every commit since the base. Exit code 1 on any FAIL.
- **Gate 2**: a second worker reads the review pack and looks for spec gaps and weak tests (for each test it must name a wrong implementation that would still pass).
- **Gate 3**: Claude, sized by tier, reads only the pack.

## Fix loop and escalation

`loop.ps1` runs the fix loop on the worker: Gate 1 fails, `fix-round.ps1 -FromGates` appends `## Fix round N` (numbered, UTF-8 without BOM), `worker.ps1 -Mode fix` gets only that round plus the digest, and Gate 1 runs again. That repeats up to `max_fix_rounds` (default 3). The loop stops early when a round leaves exactly the same failures ("no progress") or a worker reports BLOCKED, TIMEOUT or TURN_LIMIT. After Gate 1 passes, one worker cross-review runs, and its FIXES get one more fix round. An ESCALATE goes to a Claude builder one tier up, then `loop.ps1 -SkipBuild`; if that fails too, re-plan with the planner and tell the user.

Claude review fixes: write them to a file as an exact numbered list, run `fix-round.ps1 -File <list> -Title 'Claude review'`, then `loop.ps1 -SkipBuild -FixFirst -NoCrossReview`. Fixes you can place exactly and that are under about 20 lines are faster inline. Never append to a brief with Add-Content, Set-Content or Out-File.

## Parallelism and machine load

Up to `max_parallel_workers` workers run at once (default 6); they mostly wait on the network. Gates are different: compiling and timing-sensitive tests compete for the CPU, and a test that passes alone can fail with four builds running. Run **one gate at a time**, and treat a failure that disappears on an idle machine as a flake to record, not as a reason to loosen the assertion.

## Best-of-N

For a hard or new tier 1 unit, start `-Variant 1..3` worktrees, build all three, gate all three, and let the reviewer pick one. Abort the others with `unit.ps1 -Action abort`.

## Review packs

`review-pack.ps1` writes brief, gate results, the cross-review, the lessons and the diff (against the merge base, lockfiles excluded from the body, 1500 lines by default; raise `-MaxDiffLines` for a big unit). Claude reads this file and nothing else unless the pack says it is truncated. That is what keeps Gate 3 cheap.

## Lessons

`.crew/lessons.md` holds one line per recurring defect: the rule, then the reason. It is appended to every worker system prompt and to every pack, so a mistake is paid for once.

## Unattended runs and checkpoints

`batch.ps1` is for when Claude is unavailable or the budget is spent. A checkpoint commit happens only after the secret scan passed, and `-Push` pushes the crew branch, so work survives a crash. Nothing merges unattended.

## Windows notes

- Workers read the brief from a UTF-8 file, not stdin: Windows PowerShell 5.1 pipes stdin to native programs as ASCII and turns non-ASCII text into `?`.
- Paths with spaces are quoted in the worker prompt, and `--add-dir` and `--settings` paths are passed as separate arguments.
- In PowerShell strings, `$name:` is read as a drive-qualified variable; write `${name}:`.
- Keep scripts ASCII-only so Windows PowerShell 5.1 does not need a BOM.
- The key helper is `node -p`, not `cmd /c`, because `/c` is rewritten into a path under Git Bash.
- PowerShell 7 on Linux or macOS: the scripts avoid Windows-only calls where they can (`sh -c` instead of `cmd /c`), but this has not been run there.

## Cost accounting

Worker runs are logged to `.crew/ledger.csv` (see `references/configuration.md`) and summarised by `report.ps1`, with an estimate for models listed under `pricing`. Claude-side usage is not in that ledger; take it from the host's usage view or the Nexus ledger.