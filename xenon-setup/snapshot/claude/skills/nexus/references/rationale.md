# Why the defaults are what they are

Read this when tuning the config or when a routing decision is challenged. Each default answers one
question: *what is the cheapest configuration that does this job right the first time?* A re-run
costs more than the difference between two tiers, so "right the first time" dominates.

## The models (no Fable)

| Tier | Strength | Spend it on |
|---|---|---|
| **Haiku** | Very fast, cheap, reliable at well-specified and read-heavy work | Search, command running, transcription-style edits |
| **Sonnet** | Strong coder and reviewer; the best quality per unit of usage for most engineering | Implementation, tests, debugging, review, research |
| **Opus** | Deepest judgement; best when a wrong call is expensive or irreversible | Architecture, decomposition of ambiguous work, security |

Fable is excluded by design (the user's requirement), and `inherit` is excluded with it, because an
inheriting agent silently takes the parent's model — which could be Fable or an unnecessarily
expensive tier. Every Nexus agent pins its own model.

## Effort is a separate dial from model

Raising effort buys more thinking from the same model; raising the model buys better judgement and
knowledge. They fix different failures (see SKILL.md section 4), which is why the escalation ladder
tries the cheaper fix that matches the symptom first, rather than always jumping to Opus.

## Role by role

- **nexus-scout — Haiku/medium.** Locating code is pattern matching over tool output. Haiku does it fast
  and keeps the big reads out of the orchestrator's context, which is the real saving.
- **nexus-runner — Haiku/medium, ceiling medium.** Running a suite and extracting the failing lines needs no
  reasoning. Diagnosing is deliberately someone else's job, so its ceiling stays at medium.
- **nexus-drone — Haiku/medium.** Safe only because the brief removes every decision. Its `NEEDS-DECISION`
  exit is the guardrail: a mis-routed unit bounces back instead of being guessed at.
- **nexus-researcher — Sonnet/medium.** Reading docs and reconciling versions needs comprehension, not
  deep deliberation. Final decisions are not its job, so it doesn't need Opus.
- **nexus-builder — Sonnet/medium.** Most implementation, once the approach is set, is well within
  Sonnet at medium. High effort here mostly produces longer deliberation over already-made choices.
  Raised automatically by complexity signals when warranted.
- **nexus-tester — Sonnet/medium.** Good tests need understanding of behaviour and edge cases (not
  Haiku), but rarely deep reasoning.
- **nexus-debugger — Sonnet/high.** Root-causing is hypothesis-driven reasoning under uncertainty;
  effort pays off directly. Sonnet first, because most bugs are local; Opus only on escalation.
- **nexus-reviewer — Sonnet/high.** Finding defects someone else missed needs careful reasoning. Kept
  at Sonnet because review is frequent; Opus review for every diff would dominate usage.
- **nexus-architect — Opus/high.** Decisions here are copied into every later unit; a weak decision
  multiplies rework. This is the single best place to spend Opus. Floor is high.
- **nexus-sentinel — Opus/high, never downgraded.** Security misses are the most expensive failure
  class and the hardest to detect afterwards. Floor is high in every mode.



## Effort limits and profiles

`low` is allowed and is the right setting for units with no judgement in them (lookups, running
commands, fully specified edits); in `auto` it is chosen per unit by the signals, never by default
for judgement-bearing work. `max` is never used: it burns usage for marginal gains. `xhigh` is a
single last-resort step for a truly extreme problem that already failed at `high` on a stronger model;
model escalation comes first because a judgement gap is far more common than a thinking-depth gap.

`auto` is recommended over the fixed `medium` profile because a fixed pin is wrong in both
directions: it overpays for trivial units and underpowers the rare hard one. `auto` keeps the
`medium` pins as its centre and moves per unit. `low` keeps the model mix and lowers effort, because
moving Sonnet work to Haiku causes re-runs that cost more than they save. `high` upgrades the roles
where judgement decides the outcome (debugging, review) to Opus and leaves mechanical roles cheap,
since more intelligence on a test run buys nothing.

## What changed from the obvious "one agent per job title" table

- **No separate Planner agent.** Ordinary decomposition is done by the orchestrator, which already
  holds the context; hard decomposition is done by the architect as part of the design. A mid-tier
  planner would re-read the same material and add a hop.
- **No separate Documentation agent.** Documenting known behaviour is transcription (drone);
  documenting a design needs understanding (builder at medium effort).
- **A QA role was added.** Reviewers read code, so they pass work whose rendered result is broken.
  A role that runs the thing and looks at it closes that gap, cheaply, per defect found.
- **A Runner was added.** Test and build output is the largest context sink in agentic coding;
  isolating it on Haiku is one of the biggest savings available.
- **Delegation itself is gated.** Every subagent starts cold. Small tasks are faster and cheaper inline;
  delegation is reserved for isolation, parallelism, tier mismatch or independent review.

## Main session

Recommended: Sonnet at high effort. Coordination is judgement-heavy, but the hardest calls are handed
to the architect, so the orchestrator does not need to be Opus all session. `/model opusplan` is a
good alternative for plan-heavy work.

## Why the later additions exist

Each one answers a failure observed in a long, parallel, real session, not a theory.

- **Fan-out gate.** Eleven builders were launched at once while the environment was refusing writes.
  Each drafted a full file three times and saved nothing. Preflight, a parallelism cap and the rule to
  stop dispatching on `BLOCKED` make that failure cost one agent, not eleven.
- **Router.** The same signal and flow decisions were re-derived in prose every time. Computing them
  deterministically is faster, consistent, and leaves the orchestrator free for the exceptions. It is
  advisory: keywords miss context, so the orchestrator may overrule it.
- **Ledger and lessons.** Reviewers found the same defect classes in file after file because each builder
  started cold. A lessons block in the next brief turns one reviewer finding into a rule every later
  agent follows. The ledger then shows which roles earn their cost, so the profile can follow data.
- **Fix-forward rule.** Sending small fixes back through a cold agent re-read the repo to find what the
  orchestrator already knew. Exact fixes from reviewers go to a drone or are applied inline.
- **A leaner `SKILL.md`.** The skill loads on every activation, so every line is paid for every session.
  Detail lives in `references/`, read only when needed, and `doctor` enforces the budget.
- **Honest agents.** Agents must say what they did not run or render. An unqualified "done" was the
  most common way a defect reached the orchestrator.
