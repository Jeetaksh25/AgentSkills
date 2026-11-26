---
name: nexus-crew
description: Moves the building of a task onto fast, cheap worker models (DeepSeek V4.x by default) while Claude only plans and reviews. Workers are headless Claude Code sessions pointed at any Anthropic-compatible API (Ollama Cloud or local, OpenRouter, DeepSeek, Z.ai, Moonshot, or a custom gateway), so it needs a worker API key but no extra Claude usage. Each unit runs a self-fixing worker loop (build, gates, fix, cross-review, fix) under hard anti-overthinking budgets, and nothing merges before a tier-sized Claude review. Use when the user wants to cut Claude usage on a build, says "nexus crew", "use the crew", "cheap workers", "DeepSeek workers" or "delegate the building", or when a plan splits into several independent units. A separate skill from nexus, which it complements.
---

# Nexus Crew: DeepSeek builds and fixes in a loop, Claude plans and reviews

**Goal: Opus-level quality at a fraction of the Claude usage.** Fast workers write the tests, the code and their own fixes. Claude writes the briefs, builds only tier 3 units, and reviews every unit once before it merges. The orchestrator's job per unit is: write a brief, start one loop, read one line, dispatch one review.

**Nexus Crew is its own skill, separate from `nexus`.** When the Nexus agents are installed, the Claude roles below use them (`nexus-architect`, `nexus-reviewer`, `nexus-builder`, `nexus-sentinel`, `nexus-debugger`); otherwise the same roles run as plain Agent calls with the model and effort in the table. Follow Nexus's model rules: never Fable.

You (the main session, ideally Opus at medium effort) are the **Orchestrator**. You never write tier 0-2 code yourself.

## 0. Pick the mode first (this is where most savings are won or lost)

| Job | Mode | Why |
|---|---|---|
| 1 unit, or fixes under ~50 lines | **Direct**: do it yourself, no crew | brief + loop + review costs more than the work |
| 2-4 units, mostly tier 0-2 | **Lite**: no planner agent (you write the briefs), `loop.ps1` per unit, ONE Claude review over all units at the end | orchestration stays small |
| 5+ units, or any tier 3 | **Full**: planner, per-unit Gate 3, `nexus-sentinel` for tier 3 | the gates pay for themselves |
| Claude budget spent, or user away | **Batch**: `batch.ps1` runs the loops unattended, merges nothing | zero Claude usage until review |

Say the chosen mode and the unit table (id, title, tier, builder) to the user before dispatching.

## 1. Requirements and one-time setup

Needs: a worker API key for an Anthropic-compatible endpoint, `claude`, `git`, `node` and PowerShell 5.1 or 7 on PATH, and a git repository with a clean base branch. Providers (presets in `assets/providers.json`, details in `references/providers.md`): `ollama-cloud` (`OLLAMA_API_KEY`, verified end to end), `ollama-local` (free, code stays local), `openrouter`, `deepseek`, `zai`, `moonshot`, `custom`. **Privacy:** a worker sends the brief and every file it reads to the provider.

```powershell
$crew = "$HOME\.claude\skills\nexus-crew\scripts"
& "$crew\init.ps1" -Provider ollama-cloud     # creates .crew\, git-ignores .env and .crew/runs/
& "$crew\check-provider.ps1"                  # key, model, tool calling, real claude round trip -> READY
```

A key saved with `setx` is found even by shells opened before it was saved (the scripts read the User and Machine scopes). Then fill `.crew/project.md` (stack, commands, conventions, never-touch list). If tests need a local service (Postgres in Docker, Redis), add it to `"services"` in `.crew/config.json` so gates mark those tests `[SKIP]` with a start hint, or swap in a `when_down` command, instead of failing (`references/configuration.md`).

## 2. Routing

| Tier | Work | Builder | Gate 3 reviewer (Claude) |
|---|---|---|---|
| 0 trivial | boilerplate, config, renames, docs, simple components | worker loop | `nexus-reviewer` haiku/high |
| 1 standard | clear-spec features | worker loop | `nexus-reviewer` sonnet/high |
| 2 complex | algorithms, concurrency, performance paths, heavy UI | worker loop with a detailed brief (interfaces, edge cases, the tricky part spelled out) | `nexus-reviewer` opus/medium |
| 3 critical | auth, crypto, money, FFI/unsafe, IPC and security boundaries | worker `-Mode test` writes the tests, then `nexus-builder` opus/medium | `nexus-reviewer` opus/high + `nexus-sentinel` |

A tier 2 unit that escalates goes to `nexus-builder` sonnet/medium, then the loop runs with `-SkipBuild`. When unsure of a tier, pick the higher one.

## 3. Procedure

1. **Plan** (Full mode: `nexus-architect` opus/high; Lite: yourself). Units with: id, tier, files, interfaces, done-tests, checks, out-of-scope. Units in one wave must not share files; shared files (manifests, lockfiles, registries) stay with you.
2. **Briefs** in `.crew/units/<ID>.md` from `_TEMPLATE.md`. A worker brief must leave **no design decision open**: exact signatures, exact strings, exact file list. Every vague word becomes a worker thinking loop. Verify each brief is on disk before dispatching (never edit a brief and launch its worker in the same parallel batch).
   **Goldfish check** (from Google's Elephant-Goldfish Model: you are the elephant, too close to your own brief to see its gaps): `& "$crew\brief-check.ps1" -Unit <ID>` for every brief, in parallel. A fresh, read-only worker with no conversation history reads the brief and the files it names, and prints `BRIEF READY` or `BRIEF GAPS blockers=N majors=N file=<findings>`. Fix every Blocker and Major in the brief (each finding carries the exact replacement text), then re-check. It costs about a minute of worker time and no Claude tokens; in its first real run it found 3 blockers in a brief that had cost three escalations.
3. **Start** `& "$crew\unit.ps1" -Action start -Unit <ID>` per unit. It also installs dependencies in the new worktree (`pnpm install --frozen-lockfile --prefer-offline`, `npm ci` or `yarn` from the lockfile; override with `"setup"` in the config, `""` turns it off). Without that every gate fails.
4. **Loop**: `& "$crew\loop.ps1" -Unit <ID>` in the background, up to `max_parallel_workers` at once. It runs worker build, writes any missing or empty new test file the brief requires (a test-mode worker), Gate 1 staged (the brief's Checks first, the full gates once those pass), worker fix rounds (up to `max_fix_rounds`, default 3), a stall check, one worker cross-review and its fix round, then writes a fresh review pack. It prints **one line**:
   - `LOOP READY unit=... rounds=N gates="PASS" crossreview=FIXED pack=<path>` means go to step 5.
   - `LOOP ESCALATE unit=... reason="..."` means read the reason: `BLOCKED` gets an answer added to the brief (then re-run the loop); `no progress`, `TURN_LIMIT` or repeated failures mean tier up to a Claude builder, then `loop.ps1 -SkipBuild`.
   - A `gates="PASS (n SKIPPED, not verified)"` line is not a full pass: report the skipped gates as unverified.
   - `crossreview=TURN_LIMIT` (or `skipped`) means no worker reviewed the unit: tell the Claude reviewer so it reviews in full.
   - `LEAK` means the worker wrote into the main checkout instead of its worktree: revert those files in the main checkout (the worktree copy is the real one), then re-run.
   - A `scope` gate FAIL lists files changed outside the brief's `## Files`: revert them in the worktree, or widen the brief if the change belongs to the unit (and take it out of any later unit's brief).
   Read only that line and, on ESCALATE, the digest it names. Do not open worker logs unless the line is unclear. Loops can run in parallel: gate runs take a project-wide lock (`gate_lock`), so test suites never run twice at once, and a failed gate is re-run once (`retry_failed_gates`) before a worker is asked to fix it. A test that still fails on the base branch alone is a flaky base test: fix it on the base branch yourself and fast-forward the worktrees (`git -C <worktree> merge --ff-only <base>`); never hand it to a unit worker.
5. **Gate 3**: dispatch the tier's Claude reviewer with only the pack path: "Review `<pack>`. Read worktree files only if the diff is truncated. Return VERDICT PASS or FIXES with exact, numbered fixes (file, change, verbatim strings)." In Lite mode, one reviewer gets all packs. Then **log it**: `& "$crew\claude-log.ps1" -Unit <ID> -Role review -Model <model> -Tokens <total_tokens>` (from the Agent result's usage line). Log every Claude delegation this way.
6. **Claude fixes**: save the reviewer's fix list to a file, then `& "$crew\fix-round.ps1" -Unit <ID> -File <list> -Title 'Claude review'` and `& "$crew\loop.ps1" -Unit <ID> -SkipBuild -NoCrossReview -FixFirst`. Fixes under ~20 lines that you can place exactly, apply inline instead. **Never append to briefs with Add-Content, Set-Content or Out-File**: Windows PowerShell 5.1 writes the ANSI codepage or a BOM; `fix-round.ps1` always writes UTF-8 without a BOM and numbers the round. A second failed Claude review round means re-plan the unit with the planner and tell the user.
7. **Merge**: `& "$crew\unit.ps1" -Action finish -Unit <ID> -Message "<type(scope): summary>"` (Conventional Commit; set `commit_trailer` for attribution).
8. **Learn**: each defect a Claude reviewer found that could recur becomes one line in `.crew/lessons.md` (rule, then why). It is injected into every worker prompt and review pack.
9. **Report**: first log your own (orchestrator) tokens for the batch from the host's usage view (`/context`, or the session usage): `& "$crew\claude-log.ps1" -Unit ALL -Role orchestrator -Model <model> -Tokens <n>`. Without it the split leaves out the biggest Claude cost and the report says so. Then `& "$crew\report.ps1"` prints worker and Claude tokens (delegations and orchestrator), the split, the cost, and what the worker share would have cost on Claude (`compare_model`). Quote its last lines in the end-of-batch report, plus: units, briefs READY first check, loops READY first time, escalations, Claude review fixes, merged.

Unattended: `& "$crew\batch.ps1" -Build U-002,U-003 -GateOnly U-001 -Push` runs the loops, checkpoints and pushes, merges nothing, and appends to `.crew/STATUS.md`.

## 4. Anti-overthinking (DeepSeek and other reasoning workers)

Fast reasoning models loop: they re-read files, restate the plan, and try a fourth variant of a failing fix. The crew stops this at three levels:

- **Prompt**: every worker gets `assets/prompts/worker-discipline.md` first. It allows one plan of at most 8 lines, then short thoughts that each end in a tool call. It bans re-reading files and restating the brief, and it says to stop with `STATUS: BLOCKED` after the same check fails 3 times.
- **Hard budgets** per mode (`worker_budget` in the config): `--effort`, `--max-turns`, `MAX_THINKING_TOKENS` and a wall-clock timeout that kills the process tree. Defaults: build low/60 turns/20 min, test low/40/12, fix low/30/10, review medium/25/10. A run that hits a limit reports `STATUS: TURN_LIMIT` or `STATUS: TIMEOUT`, and the loop escalates instead of retrying.
- **Loop**: fix mode feeds only the newest fix round and the gate digest, not the whole brief again. A fix round that leaves exactly the same failures ends the loop ("no progress"). There is only one cross-review cycle, so two workers never ping-pong.

The main lever is still yours: **a brief with no open decisions**. If loops keep hitting TURN_LIMIT, the brief is too big or vague. Split it or spell out the tricky part; don't raise the budget.

## 5. Hard rules

- **Nothing merges without a Claude review (Gate 3)**, for every tier and mode.
- Claude reviewers read the review pack, not the codebase, unless the pack says it is truncated.
- Never pass `.env` contents or secrets into briefs or prompts. Workers cannot read `.env` (deny rules), and the gates scan the diff and every commit since the base.
- Workers never commit or push. Only `unit.ps1 -Action finish` commits, plus you for shared files and batch checkpoints.
- One writer per file per wave. A `BLOCKED` worker gets an answer from the docs or an escalation; never let it guess a design.
- If the worker launcher fails twice (auth, network, provider outage), stop dispatching and report the exact error.
- Before reporting done: loop READY, Claude review PASS, merged. Report SKIPPED gates and anything else unverified as unverified.

## 6. Failure modes this skill prevents

| Failure (each happened in a real run) | Defence |
|---|---|
| Every worker failed with `Invalid API key`: a settings `env` block in `~/.claude/settings.json` redirected `ANTHROPIC_BASE_URL` | connection details go into the worker's own `--settings` file; `check-provider.ps1` does a real CLI round trip |
| A key saved with `setx` was invisible to an already-open shell | `Get-Setting` also reads the persisted User and Machine scopes |
| `Add-Content` wrote a brief in the ANSI codepage, then with a BOM | `fix-round.ps1` and `Write-Utf8`; every script writes UTF-8 without a BOM and is pure ASCII itself |
| Docker was down, so the Postgres tests "failed", and the orchestrator had to narrow the gates by hand | `services` probing: `[SKIP]` with a start hint or a `when_down` command; the digest header counts skips; `-Only` and `-Skip` |
| A worker re-read and re-planned for many minutes | discipline prompt, effort, turn cap, thinking cap, timeout |
| The orchestrator spent as much effort driving fix rounds as building | `loop.ps1` does build, gates, fixes and cross-review, then returns one line |
| Savings were estimated, not measured | `claude-log.ps1` + `report.ps1` measure both sides and price the difference |
| Review pack and secret scan were empty once WIP was committed | diffs come from the merge base, and the scan walks every commit since |
| Worktrees sharing one build folder tested each other's code | `.crew/env.ps1` `Initialize-CrewUnit` gives each checkout its own folder |
| Timing-sensitive tests failed when gates ran in parallel | one gate run at a time; never loosen an assertion |
| Weak tests passed a wrong implementation | the cross-review demands a mutation check per test; lessons accumulate |
| New worktrees had no `node_modules`, so every gate failed | `unit.ps1 -Action start` runs the lockfile's install (`setup`) |
| Four loops ran the full UI suite at once; unrelated tests timed out and workers spent their whole fix budget on files outside their unit | `gate_lock` serializes gate runs; `retry_failed_gates` re-runs a failure once before a worker sees it |
| A fix worker chasing a flaky test edited two files outside its unit | `scope` gate: every changed file must be in the brief's `## Files` |
| Workers wrote copies of their files into the main checkout by absolute path (the brief lives under `.crew\runs` there) | deny rules for the main checkout in the worker settings, plus a before/after status check that reports `STATUS: LEAK` |
| A worker failed to write a new test file inside the 30-turn fix budget, twice | `worker.ps1 -Mode test` (its own budget) writes missing tests; then `loop.ps1 -SkipBuild` |
| A hook (e.g. GateGuard) blocked the first write of every brief | add `.crew/**` to the hook's exempt globs, or write all briefs in one reviewed step |
| Briefs left decisions open that only showed up as escalations (wrong fixture shape, a test that could never pass) | `brief-check.ps1`: a goldfish reviews each brief before dispatch |
| Fix rounds waited minutes for a full-suite gate run they were going to fail anyway | staged gates (`staged_gates`): brief checks first, full gates only once those pass |
| The report counted delegations but not the orchestrator, so the saving looked bigger than it was | `-Role orchestrator` row and a report warning when it is missing |
| A script change silently broke a defence (stderr parsed as file names; a quoted setup command dropped) | `selftest.ps1` drives every script with a fake worker; run it after any skill change |

## 7. Files

| Path | Purpose |
|---|---|
| `scripts/loop.ps1` | **the main entry point per unit**: build, gates, fix rounds, cross-review, pack, one-line verdict |
| `scripts/worker.ps1` | one worker run: `build`, `test`, `fix` or `review`, with budgets; `-DryRun` shows it |
| `scripts/gates.ps1` | Gate 1: detected checks, config gates, brief checks, services, change check, scope check, secret scan; project-wide gate lock and one retry; `-Only`, `-Skip` |
| `scripts/fix-round.ps1` | appends the next numbered fix round (`-FromGates`, `-FromCrossReview`, `-File`, `-Text`), UTF-8 safe |
| `scripts/review-pack.ps1` | compact pack for reviewers |
| `scripts/claude-log.ps1` | records a Claude delegation's tokens in the ledger |
| `scripts/report.ps1` | worker vs Claude tokens (delegations and orchestrator), cost and saving |
| `scripts/brief-check.ps1` | goldfish review of a brief before dispatch (read-only worker, no history); one-line verdict |
| `scripts/selftest.ps1` | self-test of every script with a fake worker (`scripts/tests/fake-claude.*`); about a minute, no API calls |
| `scripts/batch.ps1` | unattended loops, checkpoints and STATUS.md |
| `scripts/unit.ps1` | start, path, finish and abort a unit worktree |
| `scripts/init.ps1`, `scripts/check-provider.ps1` | setup and preflight |
| `scripts/_common.ps1` | shared helpers: config, provider, budgets, bounded process runner, UTF-8 writer, ledger |
| `assets/prompts/` | `worker-discipline.md` (prepended to every worker), `worker-build`, `-test`, `-fix`, `-review`; copy to `.crew/prompts/` to customise |
| `assets/providers.json`, `assets/config.example.json`, `assets/worker-settings.json`, templates | presets, every config key, worker deny rules, brief/project/lessons templates |
| `references/pipeline.md`, `references/configuration.md`, `references/providers.md` | briefs and tiers in depth, config keys and services, provider setup |
