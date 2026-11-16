# Configuring Nexus

## Profiles (saved, persist across sessions)

| Profile | What it does |
|---|---|
| `auto` *(default)* | Medium pins + per-unit adaptation (trivial units → low effort, complex → high or a stronger model). Recommended. |
| `low` | Prefers lower effort and cheaper configurations; Sonnet and Opus still do the work that needs them, at lower effort. |
| `medium` | Balanced fixed pins; models change only on escalation. |
| `high` | Prefers stronger models and higher effort on every judgement-bearing role. |
| `off` | Disables Nexus: nexus agents are removed and Claude Code works as default. |

Switch any time, from Claude Code or a terminal:

```
/nexus mode low
```
```bash
node ~/.claude/skills/nexus/scripts/nexus.mjs mode low            # all projects (saved in ~/.claude/nexus.json)
node ~/.claude/skills/nexus/scripts/nexus.mjs mode high --project # this repo only (.claude/nexus.json)
```

The profile is written to the config file and the `nexus-*` agent pins are re-written immediately, so
it holds for every new session until you change it.

## Effort limits

Allowed: `low`, `medium`, `high`. `xhigh` exists only as a last-resort escalation after a unit has
failed at `high` on a stronger model — it can never be a pin. `max` is rejected everywhere.

## Pinned models and efforts per profile

| Agent | low | medium / auto | high |
|---|---|---|---|
| nexus-scout | haiku/low | haiku/medium | sonnet/low |
| nexus-runner | haiku/low | haiku/low | haiku/medium |
| nexus-drone | haiku/low | haiku/medium | sonnet/low |
| nexus-researcher | sonnet/low | sonnet/medium | sonnet/high |
| nexus-builder | sonnet/low | sonnet/medium | sonnet/high |
| nexus-tester | sonnet/low | sonnet/medium | sonnet/high |
| nexus-debugger | sonnet/medium | sonnet/high | opus/high |
| nexus-reviewer | sonnet/medium | sonnet/high | opus/high |
| nexus-architect | opus/medium | opus/high | opus/high |
| nexus-sentinel | opus/medium | opus/high | opus/high |

## Files (later wins, merged field by field)

1. `assets/nexus.config.json` inside the skill — shipped defaults and profile definitions.
2. `~/.claude/nexus.json` — your saved profile and personal overrides, all projects.
3. `<project>/.claude/nexus.json` — per-project profile/overrides (commit it to share with a team).

`roles` overrides apply on top of whichever profile is active:

```json
{
  "profile": "auto",
  "roles": {
    "nexus-debugger": { "model": "opus" }
  }
}
```

| Field | Values | Meaning |
|---|---|---|
| `profile` | `auto` / `low` / `medium` / `high` / `off` | Active profile |
| `roles.<agent>.model` | `haiku` / `sonnet` / `opus` | Override that agent's model in every profile |
| `roles.<agent>.effort` | `low` / `medium` / `high` | Override that agent's effort (`xhigh` and `max` rejected) |
| `profiles.<name>.roles…` | as above | Redefine a profile itself |
| `policy.maxEscalations` | integer (default 2) | Escalations per unit before Nexus stops and reports to you |
| `policy.forbiddenModels` | list | Never routed to. `fable` and `inherit` are always forbidden |
| `policy.reviewThresholdLines` | integer (default 50) | Changed lines above which a reviewer pass is mandatory |

After editing a file by hand, run `nexus.mjs sync` to re-pin the agents.

## Commands

```bash
node scripts/nexus.mjs install [--project] [--link]   # skill + agents
node scripts/nexus.mjs mode <auto|low|medium|high|off> [--project]
node scripts/nexus.mjs status                         # active profile + pins, one line
node scripts/nexus.mjs sync                           # re-pin agents from the merged config
node scripts/nexus.mjs show                           # merged config as JSON
node scripts/nexus.mjs doctor                         # check install, pins, no Fable, no max
node scripts/nexus.mjs uninstall                      # remove skill and agents (keeps your nexus.json)
```

## Main session model

Nexus does not change the main session's model. Set it with `/model` (e.g. `sonnet` or `opusplan`)
and `/effort`. `CLAUDE_CODE_SUBAGENT_MODEL` does not affect Nexus agents; each pins its own model.
