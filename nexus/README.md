# Nexus — adaptive model & effort orchestration for Claude Code

Nexus turns a Claude Code session into a senior tech lead running a team of specialised engineers,
where each engineer gets exactly the intelligence and reasoning effort their work needs.

- **Ten pinned subagents** — scout, runner, drone (Haiku); researcher, builder, tester, debugger,
  reviewer (Sonnet); architect, sentinel (Opus). Each has its own model, effort and tool set.
- **A routing protocol** — decide first whether delegating is worth a cold start at all, then pick the
  role by the verb of the work, then adjust model/effort with six complexity signals.
- **Escalation that matches the symptom** — more effort when the model needs to think harder, a
  stronger model when it lacks judgement, back to the user after two tries.
- **A quality floor** — independent review for non-trivial diffs, a mandatory security pass for
  sensitive code, and evidence before "done".
- **Transparent** — one routing line per delegation explains the model and effort chosen.
- **Subscription only** — native subagents and the `Agent` tool's `model`/`effort`; no API keys, no
  external routers. **Never uses Fable** (and never `inherit`, which could reach it).

## Install

Requires Node 18+.

```bash
git clone <this repo> && cd AgentSkills
node nexus/scripts/nexus.mjs install      # skill -> ~/.claude/skills/nexus, agents -> ~/.claude/agents
node nexus/scripts/nexus.mjs doctor       # verify
```

Then start a new Claude Code session. Use `--project` to install into the current repo's `.claude/`
instead, and `--link` to keep the skill symlinked to your checkout.

Manual install: copy `nexus/` to `~/.claude/skills/nexus` and `nexus/agents/*.md` to `~/.claude/agents/`.

## Use

Just work normally — Nexus triggers on multi-part tasks, or say "use Nexus". For best results run the
main session on Sonnet at high effort (`/model sonnet`, `/effort high`), or `/model opusplan`.

## Profiles

Pick one; it is saved and persists across sessions until you change it:

| Profile | Behaviour |
|---|---|
| `auto` *(default)* | Medium pins + per-unit adaptation. The best overall configuration. |
| `low` | Lower effort and cheaper configurations (Sonnet/Opus still used where needed, at lower effort). |
| `medium` | Balanced fixed pins. |
| `high` | Stronger models and higher effort on judgement-heavy roles. |
| `off` | Disabled: default Claude Code behaviour. |

In Claude Code: `/nexus mode low`. In a terminal: `node ~/.claude/skills/nexus/scripts/nexus.mjs mode low`.
Efforts used: low, medium, high; xhigh only as a last-resort escalation; never max.

## Customise

Put overrides in `~/.claude/nexus.json` or `<project>/.claude/nexus.json`, then
`node ~/.claude/skills/nexus/scripts/nexus.mjs sync`. See
[`references/configuration.md`](references/configuration.md); the reasoning behind each default is in
[`references/rationale.md`](references/rationale.md).
