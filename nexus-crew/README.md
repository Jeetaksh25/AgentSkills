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

Then ask Claude to "use the nexus crew" for the task. Claude plans the units, writes a brief for each, and the scripts do the rest: `unit.ps1` (worktree), `worker.ps1` (build, test, review), `gates.ps1`, `review-pack.ps1`, `batch.ps1` (unattended), `report.ps1` (cost). `SKILL.md` is the full procedure.

## How it keeps quality up

- A worker writes the failing tests first, then the code, in its own git worktree.
- Gate 1 runs your checks and scans the diff and every commit for secrets.
- Gate 2: a second worker cross-reviews, and must name a wrong implementation for each test to catch weak tests.
- Gate 3: a Claude reviewer sized to the tier reads a compact review pack. Nothing merges without it.
- At most two worker fix rounds, then a Claude builder takes the unit.

## What was verified

Run on 2026-11-25 against Ollama Cloud with a real DeepSeek model: init, brief, worktree, worker build (tests first), gates, review pack, worker cross-review (it found a real gap in the tests), merge, ledger report, a leaked secret failing the scan, and a committed checkpoint still showing in the pack. OpenRouter, DeepSeek direct, Z.ai and Moonshot were checked at the endpoint level only (invalid-key probes and the providers' docs); run `check-provider.ps1` with your key to confirm yours.

## Layout

See the files table in `SKILL.md`. Provider details and troubleshooting: `references/providers.md`. Briefs, tiers, the fix loop and Windows notes: `references/pipeline.md`. Config keys and the project hook: `references/configuration.md`.