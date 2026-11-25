---
name: nexus-crew
description: Moves the building of a large task onto cheap worker models while Claude only plans and reviews. Workers are headless Claude Code sessions pointed at any Anthropic-compatible API (Ollama Cloud or local, OpenRouter, DeepSeek, Z.ai, Moonshot, or a custom gateway), so it needs a worker API key but no extra Claude usage. Runs a gated pipeline: one git worktree and written brief per unit, a worker that writes the tests and then the code, automatic gates with a secret scan, a cross-review by a second worker, a tier-sized Claude review, and a merge only after that review. Use when the user wants to cut Claude usage on a big build, says "nexus crew", "use the crew", "cheap workers", "DeepSeek workers" or "delegate the building", or when a plan splits into many independent units. A separate skill from nexus, which it complements.
---

# Nexus Crew: cheap workers build, Claude plans and reviews

**Goal: Opus-level quality at a fraction of the Claude usage.** Workers on a cheap API write the tests and most of the code. Claude plans, builds only the hard units, and reviews everything before it merges.

**Nexus Crew is its own skill, separate from `nexus`.** Nexus chooses a Claude model and effort per task. Nexus Crew moves the *building* onto non-Claude workers and wraps it in gates. They fit together: when the Nexus agents are installed, the Claude roles below use them (`nexus-architect`, `nexus-reviewer`, `nexus-builder`, `nexus-sentinel`, `nexus-debugger`); when they are not, the same roles run as plain Agent calls with the model and effort named in the table. Nexus Crew never edits or requires Nexus. Follow Nexus's model rules: never Fable.

You (the main session, ideally Opus at medium effort) are the **Orchestrator**. You never write tier 0-1 code yourself.

## 0. Requirements

| Need | Why | Check |
|---|---|---|
| A worker API with an Anthropic-compatible endpoint and its key | the workers run on it; this is the only extra cost | `scripts/check-provider.ps1` prints `verdict   : READY` |
| `claude` CLI, `git`, PowerShell 5.1 or 7, `node` on PATH | a worker is a headless Claude Code session; node runs the key helper and most gates | `Get-Command claude, git, node` |
| A git repository with a clean base branch | one worktree and branch per unit | `git status --short` is empty |

Providers (details, prices and troubleshooting in `references/providers.md`; the presets live in `assets/providers.json`):

| Provider id | Needs | Cost |
|---|---|---|
| `ollama-cloud` | `OLLAMA_API_KEY` | per Ollama plan; verified end to end |
| `ollama-local` | a pulled model that supports tools | free, code stays on the machine |
| `openrouter` | `OPENROUTER_API_KEY` | pay per token; DeepSeek V4.1 Flash about 0.15 USD in / 0.60 out per million |
| `deepseek` | `DEEPSEEK_API_KEY` | pay per token, direct |
| `zai`, `moonshot` | their key and a model name | pay per token |
| `custom` | `base_url`, `key_env`, `model` in the config | any Anthropic-compatible gateway (LiteLLM, claude-code-router, a company proxy) |

**Privacy:** a worker sends the brief and every file it reads to the provider. Use a provider you may share that code with, or `ollama-local`.

## 1. One-time setup per project

```powershell
$crew = "$HOME\.claude\skills\nexus-crew\scripts"
& "$crew\init.ps1" -Provider openrouter      # creates .crew\ and git-ignores .env and .crew/runs/
# put the key in the environment or in <project>\.env  (OPENROUTER_API_KEY=...). Never commit it.
& "$crew\check-provider.ps1"                 # key, model, tool calling, and the real claude round trip
```

Then edit `.crew/project.md` (stack, commands, conventions, never-touch list) and, if the project needs a native toolchain or a build folder per checkout, add `.crew/env.ps1` (see `references/configuration.md`).

Done when: `check-provider.ps1` ends with `READY` and its `cli trip` line says `OK`. If it says NOT READY, fix that first; do not dispatch workers into a failing provider.

## 2. Roles and routing

| Tier | Work | Builder | Gate 3 reviewer (Claude) |
|---|---|---|---|
| 0 trivial | boilerplate, config, renames, docs, simple components | worker (`scripts/worker.ps1 -Mode build`) | `nexus-reviewer`, model haiku, effort high |
| 1 standard | clear-spec features | worker | `nexus-reviewer`, sonnet, high |
| 2 complex | algorithms, concurrency, performance paths, heavy UI | `nexus-builder` sonnet/medium, after a worker wrote the tests | `nexus-reviewer`, opus, medium |
| 3 critical | unsafe or FFI, auth, crypto, money, IPC and security boundaries | `nexus-builder` opus/medium, after a worker wrote the tests | `nexus-reviewer` opus/high, plus `nexus-sentinel` for security |

Helpers: planning `nexus-architect` (opus/high), file mapping `nexus-scout` (haiku/medium), stuck failures `nexus-debugger` (sonnet/high). Without the Nexus agents, use `Agent` with `subagent_type: general-purpose` and the same model and effort, and tell reviewers to stay read-only. When unsure of a tier, pick the higher one.

## 3. Procedure for a feature or phase

Set `$crew` as in section 1 and run the scripts from the project root.

1. **Plan.** Send the goal and the relevant docs to the planner. Ask for units with: id, tier, files, interfaces, done-tests, checks, out-of-scope. **Show the user the unit table (id, title, tier, builder) before dispatching.**
2. **Write the briefs** to `.crew/units/<ID>.md` from `.crew/units/_TEMPLATE.md` (source: `assets/unit-template.md`). A tier 0-1 brief must leave no design decision open; if it cannot, raise the tier. **Check each brief is saved before dispatching anything that reads it**; never send the edit and the worker launch in the same parallel batch (a blocked edit left a worker running on the old brief).
3. **Start worktrees:** `& "$crew\unit.ps1" -Action start -Unit <ID>`, one per unit. Units that run in parallel must not share files; shared files (manifests, lockfiles, registries) stay with you, done before or after the wave.
4. **Build.**
   - Tier 0-1: `& "$crew\worker.ps1" -Unit <ID> -Mode build`, in the background, up to `max_parallel_workers` at once.
   - Tier 2-3: `-Mode test` first (the worker writes failing tests), then dispatch the Claude builder with the brief and worktree path, told to make the tests pass, stay in the worktree and not commit.
   - Hard or new tier 1: best-of-3 with `-Variant 1..3`; the reviewer picks one, abort the others.
5. **Gate 1:** `& "$crew\gates.ps1" -Unit <ID>`. On FAIL, append a `## Fix round N` section with the digest (`.crew/runs/<ID>/gates-<ID>.txt`) to the brief and re-run the worker. Run **one gate at a time** on a busy machine.
6. **Gate 2 (tier 0-1):** `& "$crew\review-pack.ps1" -Unit <ID>`, then `& "$crew\worker.ps1" -Unit <ID> -Mode review`. Fix `FIXES` findings in a worker round, then re-run Gate 1.
7. **Gate 3:** regenerate the pack, then dispatch the tier's Claude reviewer with only the pack path: "Review `.crew/runs/<ID>/review-pack-<ID>.md`. Read worktree files only if the diff is truncated or context is needed. Return VERDICT PASS or FIXES with exact fixes." Before each Claude dispatch, if the user set a usage ceiling, check the host's usage view.
8. **Fix loop: at most `max_fix_rounds` (default 2) per builder.** Fixes under about 20 lines that you can place exactly, apply inline in the worktree; bigger fixes go back to the same builder as an exact list. After the second failed worker round, escalate the unit to a Claude builder (tier up). If a Claude builder still fails, re-plan with the planner and tell the user.
9. **Merge:** `& "$crew\unit.ps1" -Action finish -Unit <ID> -Message "<type(scope): summary>"` (a Conventional Commit; add your attribution trailer, or set `commit_trailer` in the config). Then tick your checklist, and push if the user asked for checkpoints.
10. **Learn.** Every defect a Claude reviewer found that could recur becomes one line in `.crew/lessons.md`: the rule, then why. It is injected into every worker prompt and review pack.

Unattended work (the Claude budget is spent, or the user is away): `& "$crew\batch.ps1" -Build U-002,U-003 -GateOnly U-001 -Push` builds, gates, checkpoints and cross-reviews, merges nothing, and writes `.crew/STATUS.md`.

End-of-batch report: `& "$crew\report.ps1"` for worker runs, minutes, tokens and an estimated cost; add the Claude delegations from your own count. Example: `Crew: 9 units, 6 worker-built, 2 Sonnet, 1 Opus. Gates 9/9. Cross-review fixes 3. Claude review fixes 2. Escalations 1. Merged U-001..U-009.`

## 4. Hard rules

- **Nothing merges without a Claude review (Gate 3)**, for every tier.
- Claude reviewers read the review pack, not the codebase, unless the pack says it is truncated.
- Never pass `.env` contents or secrets into briefs or prompts. Workers cannot read `.env` (deny rules) and the gates scan the diff and every commit since the base for configured keys.
- Workers never commit or push. Only `unit.ps1 -Action finish` commits, plus you for shared files and batch checkpoints.
- One writer per file per wave. Workers that return `STATUS: BLOCKED` get an answer from the docs or an escalation; never let them guess design.
- If the worker launcher fails twice (auth, network, provider outage), stop dispatching and report the exact error. Do not loop.
- Before reporting done: gates PASS, Claude review PASS, merged. Report anything unverified as unverified.

## 5. Failure modes this skill prevents

Each one happened in a real run; the scripts and rules above exist because of them.

| Failure | Defence |
|---|---|
| Every worker failed with `Invalid API key` and then ran for minutes: a settings `env` block in the user's `~/.claude/settings.json` set `ANTHROPIC_BASE_URL` to a local proxy, and settings env beats the process environment even with `--bare`, so the provider key went to the wrong host | the worker writes base URL, model and key helper into its own `--settings` file (which outranks user settings); `check-provider.ps1` ends with a real CLI round trip that catches it |
| `apiKeyHelper` written as `cmd /c echo %KEY%` hangs under Git Bash | helper is `node -p "process.env.NEXUS_CREW_KEY"`, which behaves the same in cmd and bash |
| A review pack and secret scan built from `git diff HEAD` were empty once WIP was committed | diffs are taken against the merge base with the base branch, and the scan also walks every commit since it |
| Worktrees sharing one build folder let a gate test another unit's code | `.crew/env.ps1` defines `Initialize-CrewUnit` to give each checkout its own build folder |
| Timing-sensitive tests failed when several gates ran at once | one gate at a time; never loosen the assertion |
| A worker launched in the same batch as a blocked brief edit ran on the old brief | verify the brief on disk before dispatch |
| Weak tests passed for a wrong implementation | the cross-review prompt demands a mutation check per test; lessons accumulate |
| Unbounded fix loops | two worker rounds, then a Claude builder |

## 6. Files

| Path | Purpose |
|---|---|
| `scripts/_common.ps1` | shared helpers: project root, config, provider resolution, worker settings, ledger |
| `scripts/init.ps1` | creates `.crew/` in a project and the ignore rules |
| `scripts/check-provider.ps1` | preflight: key, model, tool calling, real CLI round trip |
| `scripts/unit.ps1` | start, path, finish and abort a unit worktree |
| `scripts/worker.ps1` | one worker run (build, test or review) on the chosen provider; `-DryRun` shows it without running |
| `scripts/gates.ps1` | Gate 1 digest: detected checks, config gates, brief checks, change check, secret scan |
| `scripts/review-pack.ps1` | compact pack for reviewers |
| `scripts/batch.ps1` | unattended build, gate, checkpoint and cross-review |
| `scripts/report.ps1` | ledger summary: runs, minutes, tokens, estimated cost |
| `assets/providers.json` | provider presets and their verification status |
| `assets/config.example.json` | every config key, filled in |
| `assets/worker-settings.json` | deny rules every worker gets |
| `assets/unit-template.md`, `assets/project-template.md`, `assets/lessons-header.md` | templates copied by `init.ps1` |
| `assets/prompts` | worker prompts for build, test and review; copy to `.crew/prompts` to customise |
| `references/providers.md` | per-provider setup, auth, prices, troubleshooting |
| `references/pipeline.md` | briefs, tiers, fix loop, parallelism, Windows notes |
| `references/configuration.md` | config keys, environment variables, the `env.ps1` hook, ledger columns |

In the project: `.crew/config.json`, `project.md`, `lessons.md`, `ledger.csv`, `units/`, `runs/` (git-ignored), optional `env.ps1`, `prompts/`, `worker-settings.json`.