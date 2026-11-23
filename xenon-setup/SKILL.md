---
name: xenon-setup
description: Clone a complete Claude Code setup onto any machine — every skill, agent, slash command, hook, rule, CLAUDE.md, settings.json (permissions, env, model, effort, hooks), user MCP server, plugin marketplace, plugin (with its enabled/disabled state) and the external CLIs they depend on (rtk, tokensave, headroom, scrapling, uv). Use when someone says "set up my Claude Code like yours", "replicate / clone / mirror / back up / restore my Claude Code setup", "make this machine match", "Xenon setup", or after changing the setup and wanting the snapshot refreshed. Secrets never leave the machine: they become ${XENON_*} placeholders filled from a local secrets file at install time.
---

# Xenon Setup

One command captures a Claude Code setup into `snapshot/`; one command reproduces it anywhere.
The snapshot is plain files committed to this repo, so the setup is versioned, diffable and shareable.

```
node xenon-setup/scripts/xenon.mjs export     # source machine: refresh snapshot/ from ~/.claude
node xenon-setup/scripts/xenon.mjs install    # target machine: make ~/.claude match snapshot/
node xenon-setup/scripts/xenon.mjs verify     # either machine: list every difference (exit 1 if any)
```

Requirements on the target: Node 18+, git, and Claude Code installed (`claude` on PATH, for plugins).
Python + pip are needed only for the pip-based tools (headroom, scrapling, uv).

## What is captured

| Piece | Source | How it is restored |
|---|---|---|
| Skills, agents, commands, hooks, rules, output styles | `~/.claude/<dir>/` (symlinks resolved, `node_modules`/`.git`/venvs skipped) | Copied; skills that were git clones are re-cloned from their remote, copy as fallback |
| CLAUDE.md, RTK.md, nexus.json, keybindings, statusline | `~/.claude/` | Copied |
| settings.json | everything: hooks, permissions, env, model, effort, enabledPlugins, extraKnownMarketplaces, skillOverrides, theme… | Written whole; absolute hook commands that don't exist on the target are re-resolved on PATH |
| User MCP servers | `mcpServers` in `~/.claude.json` | Merged into the target's `~/.claude.json` (nothing else in that file is touched) |
| Plugin marketplaces + plugins | `plugins/known_marketplaces.json`, `installed_plugins.json` | `claude plugin marketplace add` → `claude plugin install` → `claude plugin disable` for the ones that were off |
| External tools | detected versions of rtk, tokensave, headroom, scrapling, uv, python, node, git | Installed with the hint commands in `TOOLS` (pip ones pinned to the captured version) |

Not captured, on purpose: history, sessions, projects, caches, telemetry, file-history, backups, and
anything machine- or conversation-specific. Home-directory paths are stored as `{{HOME}}` and rewritten
to the target's home on install, so Windows ↔ macOS ↔ Linux works for anything not tied to `.exe` files.

## Secrets

`export` never writes a credential:
- MCP `headers`/`env` values and any credential-length value under a key like `*token*`, `*key*`,
  `authorization`, `secret`, `password` become `${XENON_<PATH>}` placeholders (a `Bearer ` prefix is kept).
- Known key shapes (OpenRouter/Anthropic/OpenAI `sk-…`, GitHub, Google, Slack, z.ai, Context7, bearer
  tokens) found inside any copied file are replaced with `<REDACTED_BY_XENON>`.
- A final leak scan over the whole snapshot aborts the export (exit 2) if anything secret-shaped remains.

`snapshot/secrets.example.env` lists every placeholder and where it is used. On the target:

```
cp xenon-setup/snapshot/secrets.example.env secrets.env   # fill in your own keys; never commit it
node xenon-setup/scripts/xenon.mjs install --secrets secrets.env
```

Placeholders can also come from environment variables of the same name. Unfilled ones are reported.

## Running it (agent procedure)

**Refresh the snapshot** (the user changed their setup, or asks to "update Xenon"):
1. `node xenon-setup/scripts/xenon.mjs export` — read the summary; it must end with `leak scan: clean`.
2. `git diff --stat xenon-setup/snapshot` and tell the user what changed (skills added/removed, MCP, plugins).
3. Commit and push only if the user asked to.

**Set up a new machine:**
1. Clone this repo, then `node xenon-setup/scripts/xenon.mjs install --dry-run` and show the user the plan.
2. Get the secrets file filled (ask the user — never invent or fetch keys), then run `install --secrets <file>`.
3. Have the user restart Claude Code, then run `verify`; every `✗` line is a remaining gap to fix.

Flags: `--dry-run` (print only), `--skip-tools`, `--skip-plugins`, `--from <dir>` / `--out <dir>` (another snapshot location).

## Safety

- Every file and directory it overwrites is first copied to `<path>.xenon-backup-<timestamp>`.
- `install` replaces each skill/agent/command that the snapshot contains; extra ones already on the target are left alone.
- Tool installs run real package managers (winget, cargo, pip, brew). Use `--dry-run` first on a machine you care about.
- A marketplace sourced from a local directory (e.g. one shipped inside an npm package) is skipped if that directory doesn't exist on the target; install the package that provides it and re-run.

## Failure modes this prevents

- "Same skills, different behaviour": settings, hooks, skill overrides and plugin enabled-state travel with the skills.
- Leaked keys in a public repo: placeholders + redaction + a blocking leak scan.
- Broken hooks after moving machines: home paths are templated and missing absolute commands are re-resolved.
- Silent drift: `verify` gives a concrete list of what is missing instead of "looks about right".
