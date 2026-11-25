# Configuration

## `.crew/config.json`

Created by `scripts/init.ps1`; a full example is `assets/config.example.json`. Every key is optional except that a provider must be chosen somewhere.

| Key | Default | Meaning |
|---|---|---|
| `provider` | none | preset id from `assets/providers.json` (also `-Provider`, or `CREW_PROVIDER`) |
| `model` | the preset's default | worker model id (also `-Model`, `CREW_MODEL`, or `CREW_WORKER_MODEL`) |
| `base_url` | the preset's | overrides the preset; required for `custom` |
| `key_env` | the preset's | name of the variable that holds the key; required for `custom` |
| `base_branch` | detected (`origin/HEAD`, then `main`, then `master`) | the branch units are measured against |
| `allowed_executables` | `cargo, rustc, pnpm, npm, npx, node` | programs a brief's checks may run, and the `Bash(<program>:*)` rules a worker gets; `init.ps1` detects them from the project files |
| `autodetect_gates` | `true` | run the Cargo and package-script checks automatically |
| `gates` | `[]` | extra Gate 1 commands: strings, or `{ "name": "...", "command": "..." }` |
| `max_parallel_workers` | `6` | how many workers to run at once |
| `max_fix_rounds` | `2` | worker rounds before escalating a unit |
| `worktree_root` | `<project>.crew` next to the project | where unit worktrees go |
| `commit_trailer` | none | text appended to commits made by `unit.ps1` and `batch.ps1` |
| `pricing` | none | `{ "<model>": { "in_per_million": n, "out_per_million": n } }` for `report.ps1` |

Resolution order for the provider: `-Provider`, then `CREW_PROVIDER`, then the config. For the model: `-Model`, `CREW_MODEL`, `CREW_WORKER_MODEL`, the config, the preset default.

## Environment variables

| Name | Used for |
|---|---|
| the provider's key variable (`OLLAMA_API_KEY`, `OPENROUTER_API_KEY`, `DEEPSEEK_API_KEY`, `ZAI_API_KEY`, `MOONSHOT_API_KEY`, or your `key_env`) | the worker key; process environment first, then the project's `.env` |
| `OLLAMA_HOST` | base URL override for the two Ollama presets (a value without a scheme gets `http://`) |
| `CREW_PROJECT` | run the scripts against another project than the current directory's repository |
| `CREW_PROVIDER`, `CREW_MODEL`, `CREW_WORKER_MODEL` | provider and model overrides |

`.env` is read as `NAME=value` lines (optionally quoted). It is git-ignored by `init.ps1`, the worker deny rules block reading it, and the gates fail if a key or any `.env` value whose name contains KEY, TOKEN, SECRET, PASSWORD, CREDENTIAL or PRIVATE appears in a diff or in any commit since the base.

## `.crew/env.ps1` (optional project hook)

Dot-sourced by every script. Use it for a native toolchain and for a build folder per checkout. It may define `Initialize-CrewUnit`, which `gates.ps1` and `worker.ps1` call with the unit's worktree path:

```powershell
# .crew/env.ps1
$env:AWS_LC_SYS_PREBUILT_NASM = '1'                      # example: a native dependency that needs a flag
function Initialize-CrewUnit([string]$Work) {
    # one build folder per checkout: worktrees that share one let a gate test another unit's code
    $env:CARGO_TARGET_DIR = Join-Path 'D:\build-cache' (Split-Path $Work -Leaf)
}
```

## Prompts and worker settings

The worker prompts are `assets/prompts/worker-build.md`, `worker-test.md` and `worker-review.md`. To change one for a project, copy it to `.crew/prompts/` (or run `init.ps1 -CopyPrompts`); a project copy wins. The project's `.crew/project.md` and `.crew/lessons.md` are appended to every worker prompt. `.crew/worker-settings.json` (copied by `init.ps1`) replaces `assets/worker-settings.json` when present; `worker.ps1` adds the key helper and the connection env to a per-run copy and never edits the original.

## What a run leaves behind

In `.crew/runs/<unit>/` (git-ignored): `<mode>-<unit>-<stamp>.system.md`, `.input.md`, `.settings.json`, `.json` (the CLI's raw result), `gates-<unit>.txt` and `.log`, `review-pack-<unit>.md`, `crossreview-<unit>.md`. The settings file contains the base URL and model but never the key.

`.crew/ledger.csv` columns: `timestamp, unit, mode, variant, provider, model, seconds, turns, ok, input_tokens, output_tokens`. A ledger created before the `provider` column existed keeps its own columns and is still read by `report.ps1`.