# Nexus Crew

Cheap workers build, Claude plans and reviews. A skill for Claude Code that moves the building of a large task onto inexpensive models (DeepSeek, GLM, Kimi, Qwen and others) and keeps Claude for the parts that need it: planning, the hard units, and the review that gates every merge.

It is a separate skill from [`nexus`](../nexus). Nexus routes Claude models and efforts; Nexus Crew adds non-Claude workers and the gated pipeline around them. When the Nexus agents are installed, Nexus Crew uses them for its Claude roles; without them it falls back to plain Agent calls. It never changes Nexus.

## What you need

- A worker API that speaks the Anthropic Messages API, and its key: Ollama Cloud or local, OpenRouter, DeepSeek, Z.ai, Moonshot, or any gateway. This is the only extra cost.
- The `claude` CLI, `git`, `node`, and PowerShell 5.1 or 7. Developed and tested on Windows.
- A git repository.

## Quick start

```powershell
$crew = "$HOME\.claude\skills\nexus-crew\scripts"
cd <your project>
& "$crew\init.ps1" -Provider openrouter          # or ollama-cloud, ollama-local, deepseek, zai, moonshot, custom
# add OPENROUTER_API_KEY=... to .env (git-ignored by init)
& "$crew\check-provider.ps1"                      # key, model, tool calling, real CLI round trip -> READY
```

Then ask Claude to "use the nexus crew" for the task. Claude picks a mode (Direct, Lite, Full or Batch), writes a brief per unit, and runs one `loop.ps1` per unit: the worker builds, the gates run, the worker fixes what failed, a second worker cross-reviews, the worker fixes that, and the loop prints one `LOOP READY` or `LOOP ESCALATE` line. Claude then reviews the pack once and merges. `SKILL.md` is the full procedure.

## How it keeps quality up

- A worker writes the failing tests first, then the code, in its own git worktree.
- Gate 1 runs your checks and scans the diff and every commit for secrets. Tests that need a stopped service (Docker, a database) show as `[SKIP]` with the start command, never as a silent pass.
- Gate 2: a second worker cross-reviews, and must name a wrong implementation for each test to catch weak tests.
- Gate 3: a Claude reviewer sized to the tier reads a compact review pack. Nothing merges without it.
- Up to three worker fix rounds inside the loop, which stops early when a round changes nothing; then a Claude builder takes the unit.

## How it keeps workers from overthinking

Every worker run gets a discipline prompt (one short plan, no re-reading, stop after three identical failures), `--effort low`, a turn cap, a thinking-token cap and a wall-clock timeout that kills the process tree. Fix rounds see only the newest fix list and the gate digest, not the whole brief again. Limits are per mode in `worker_budget`.

## Measured, not estimated

`claude-log.ps1` records each Claude delegation's tokens next to the worker runs; `report.ps1` prints the token split, the cost of both sides, and what the worker share would have cost on Claude.

## What was verified

Run on 2026-11-25 against Ollama Cloud with a real DeepSeek model: init, brief, worktree, worker build (tests first), gates, review pack, worker cross-review (it found a real gap in the tests), merge, ledger report, a leaked secret failing the scan, and a committed checkpoint still showing in the pack. Run on 2026-11-26 with DeepSeek V4.1 Flash on Ollama Cloud: a full `loop.ps1` (build in 26 s/12 turns, gates, cross-review PASS, READY in 1.2 min); a Claude-style fix round through `-FixFirst` (applied in 11 s/7 turns); an unfixable gate, where the worker reported BLOCKED with a correct diagnosis in 16 s and the loop escalated instead of spinning; gates with a stopped service (`[SKIP]` plus hint); the UTF-8 fix-round writer; the bounded runner's quoting and timeout kill; and the worker/Claude cost report. OpenRouter, DeepSeek direct, Z.ai and Moonshot were checked at the endpoint level only (invalid-key probes and the providers' docs); run `check-provider.ps1` with your key to confirm yours.

## Layout

See the files table in `SKILL.md`. Provider details and troubleshooting: `references/providers.md`. Briefs, tiers, the fix loop and Windows notes: `references/pipeline.md`. Config keys and the project hook: `references/configuration.md`.