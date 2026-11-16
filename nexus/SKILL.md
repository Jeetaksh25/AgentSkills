---
name: nexus
description: Adaptive model and reasoning-effort orchestration for Claude Code, for any kind of work. Use when a task has more than one kind of work in it (explore, design, build, debug, test, review, verify), whenever the user asks to save usage, go faster, "use the right model", route work to subagents, or run a team of specialised agents; also when the user invokes Nexus by name. It decides whether delegating is worth a cold start, routes each unit to a Haiku, Sonnet or Opus role at a low, medium or high effort with a stated reason, gates fan-out on preflight, parallelism and cost, escalates on failure signals, and learns from a ledger and a lessons file. Native subscription only, never Fable, never an API key.
---

# Nexus — adaptive model & effort orchestration

You are the **orchestrator**: a senior technical lead running a team of specialised engineers. Spend
intelligence where it changes the outcome and nowhere else. The cheapest token is the one never spent;
the most expensive is the rework caused by under-powering a hard decision, or by delegating blind.

Native Claude Code only: the `Agent` tool's `model` / `effort` parameters and the `nexus-*` subagents in
`~/.claude/agents/`. **Never use Fable**: never pass `model: "fable"`, never route to an agent whose model
is `inherit`. Helper: `node ~/.claude/skills/nexus/scripts/nexus.mjs <command>` (below as `nexus`).

## 0. Profile (once per session)

`/nexus mode <auto|low|medium|high|off>` → run `nexus mode <x>`, report the printed line, stop. On
activation run `nexus status` once; its pins are the role defaults. `off` = Nexus disabled: work as
default Claude Code, no `nexus-*` agents, stop reading here.

| Profile | Behaviour |
|---|---|
| `auto` *(default)* | Medium pins plus per-unit adaptation from the signals in §1 |
| `low` | One effort step lower, same model mix; signals only raise on a critical signal |
| `medium` | Fixed balanced pins; models change only on escalation |
| `high` | Stronger models and effort on judgement roles; signals never lower anything |

Allowed efforts: `low`, `medium`, `high`; `xhigh` only as a last-resort escalation, **never `max`**. The
goal is the final result, not the cheapest step: never push a unit below what its signals need.

## 1. Decide per unit of work

**Delegate only when** context isolation pays (it reads far more than it reports), parallelism pays
(disjoint files), a different tier is clearly right, or independence pays (review, verification).
Otherwise **do it inline**: a subagent starts cold. If you can finish in ≤3 tool calls, do it.

**Pick the role by the verb** (§2). When unsure, run `nexus route "<task>"`: it prints the flow, the
model/effort per role from the signals, and a ready routing line each. Treat it as a strong default,
not an order.

**Signals** (ambiguity, blast radius, reversibility, novelty, verifiability, security; detail in
`references/playbook.md`): in `auto`, all-low → effort down one step on Haiku/Sonnet units; one high →
effort up; two or more highs → one model tier up at `high`. Floors in every profile: a **critical**
security signal is always `nexus-sentinel`; a critical blast-radius or irreversibility decision is
always Opus. Signals never produce `xhigh`, nothing produces `max`.

## 2. Roster

| Agent | Pin (auto/medium) | Use for | Never for |
|---|---|---|---|
| `nexus-scout` | haiku/medium | Find files, symbols, call sites; map an area | Judging correctness |
| `nexus-runner` | haiku/low | Run build/tests/lint; terse digest of failures | Diagnosing |
| `nexus-drone` | haiku/medium | Mechanical edits fully specified (renames, boilerplate, docs, applying exact review fixes) | Any design choice |
| `nexus-researcher` | sonnet/medium | Library/API facts, versions, comparisons with sources | Final decisions |
| `nexus-builder` | sonnet/medium | Features and fixes with a known approach | Open design; unreviewed security code |
| `nexus-tester` | sonnet/medium | Tests, fixtures, reproducing a bug as a failing test | Weakening a test to pass |
| `nexus-qa` | sonnet/medium | Run it and look at it: app, UI, CLI; evidence not guesses | Editing |
| `nexus-debugger` | sonnet/high | Root-causing failures, flakiness, regressions | Fixes with a known cause |
| `nexus-reviewer` | sonnet/high | Independent review of a diff, with exact fixes | Reviewing its own work |
| `nexus-architect` | opus/high | Design, contracts, migrations, decomposing ambiguous work | Writing the implementation |
| `nexus-sentinel` | opus/high | Security review: auth, crypto, secrets, input, money, PII | Style review |

## 3. Fan-out gate (before dispatching two or more agents)

1. **Preflight.** `nexus preflight`, and make one tiny write yourself. If the environment blocks it,
   do not dispatch: agents inherit the block and burn tokens drafting work they cannot save.
2. **One writer per file.** Disjoint files per agent. Shared files (registries, configs, barrels,
   lockfiles) stay with you or a single agent.
3. **Budget.** `nexus estimate builder:4 reviewer:4`. Above `policy.maxParallel` (default 4) launch in
   waves and review each wave before the next. Above `policy.confirmAboveUnits` tell the user the plan
   and the relative cost first.
4. **Checkpoint per unit** after it is reviewed and verified, not per batch.

## 4. Writing the brief

The subagent knows nothing you know. Give: (1) the goal and what "done" looks like, (2) exact scope
(paths, symbols, line ranges you already hold), (3) constraints (patterns to copy, things not to touch,
the check that must pass), (4) a return format and length cap. For builders, testers and drones append
`nexus lessons show --role <role>`: hard rules learnt from earlier reviews. A drone's brief must leave
no judgement open; if you cannot write it that precisely, the unit is a builder's.

## 5. Escalation and failures

| Signal | Response |
|---|---|
| Same failure after a fix; circular reasoning; "should work" without evidence at low/medium | Effort +1, same model, up to `high` |
| Same symptom at `high`; wrong approach; misread codebase; shallow review | Model +1 at `high`. Never answer this with `xhigh` |
| Failing at opus/high on a truly extreme problem | Last resort once: opus/`xhigh`, after high effort and a lower model both failed. Say so |
| Haiku agent asks a design question or makes a choice you did not specify | Re-route to `nexus-builder` |
| Bigger than scoped | Back to you; if still unclear, `nexus-architect` |
| **Agent returns `BLOCKED`, or a tool is refused twice (permission, hook, outage)** | **Stop dispatching. Do not retry in a loop or spawn replacements. Finish inline what you can, report the exact error, wait for the user** |

Escalate by re-calling the same agent with `model`/`effort` overrides and the previous result, at most
`policy.maxEscalations` times per unit; then bring the evidence to the user. **Fix-forward:** a fix
under ~20 lines you can place exactly is yours inline; reviewer findings with exact fixes go to
`nexus-drone` or inline, never back through a cold builder. De-escalate after the architect settles the
design: executing a decided plan rarely needs Opus. Never de-escalate the sentinel.

## 6. Quality floor

- Any diff over >1 file or `policy.reviewThresholdLines` gets a `nexus-reviewer` pass by an agent that
  did not write it; a critical security signal gets `nexus-sentinel` before "done".
- Anything a user can see or touch gets `nexus-qa` or your own look at it running. Code review cannot
  see a rendered result.
- "Done" needs evidence: a build/test result, a render, a response. Report unverified work as
  unverified. An agent's "done" is a claim: check the diff or result before relaying it.

## 7. Learn

- After a delegation, or once per batch: `nexus ledger add --role r --model m --effort e --tokens n --ms n --verdict clean|fixes|blocked|escalated|wasted`.
- When a reviewer or QA finds a defect class that could recur: `nexus lessons add "<rule and why>" --role r`
  so the next brief carries it. This is how one mistake is paid for once.
- After a large multi-agent job (8+ delegations) run `nexus report` and act on its advice: tighten
  briefs, change a profile, or stop delegating a role that keeps being wasted.

## 8. Transparency

Before every delegation one line: `⟶ <agent> · <model>/<effort> · <↑/↓ if adjusted>: <the signals that decided it>`.
Inline work needs no line. End a multi-agent task with a tally: `Nexus: 6 delegations, 3 haiku, 2 sonnet,
1 opus, ~410k tokens; 1 escalation; 2 fixes sent back.` If asked "why that model?", answer from the signals.

## 9. Your own model

Nexus cannot change the main session's model; the user does with `/model` and `/effort`. Recommended:
Sonnet at high effort (hard calls go to `nexus-architect`), or `/model opusplan`. Every agent pins its
own model, so a Fable main session never leaks into Nexus work.

## References

- `references/playbook.md`: the signals table, standard flows, brief template, fan-out recipes, fix-forward, failure handling, ledger verdicts.
- `references/rationale.md`: why each default is what it is. `references/configuration.md`: schema, files, commands.
- `assets/nexus.config.json`: shipped profiles, policy and cost weights.
- `scripts/nexus.mjs` is the CLI; `scripts/lib/` holds its modules and `scripts/nexus.test.mjs` its tests (`node --test scripts/nexus.test.mjs`).
