# Nexus playbook

Depth for the rules in `SKILL.md`. Read the section you need; none of it is required reading.

## Complexity signals

Score the unit, then apply the profile rule in `SKILL.md` §1.

| Signal | Low | High | Critical |
|---|---|---|---|
| Ambiguity | Exact spec, one obvious approach | Several viable approaches, trade-offs | Requirements conflict or are unknown |
| Blast radius | One file, local | Many files, a shared module, a public API | Data migration, schema, auth, billing |
| Reversibility | Trivial to undo | Costly to undo | Irreversible (data loss, published API, production) |
| Novelty | A pattern exists in the repo: copy it | New pattern for this repo | New to the ecosystem, no prior art |
| Verifiability | A test or compiler proves it | Partly checkable | Only judgement can tell |
| Security | None | Touches user input | Auth, crypto, secrets, permissions, money |

`nexus route` detects these from the task text with keywords. It is a first pass: correct it when you
know something the words do not say.

## Standard flows

| Work | Flow |
|---|---|
| Small change (≤3 files, clear) | Inline. A runner only if the test output is long |
| Feature | scout (if the area is unknown) → you plan → builder ×N → tester → runner → reviewer (+ qa if visible) |
| Hard feature or redesign | scout → architect (plan with a role per unit) → builders and drones → runner → reviewer → sentinel if flagged |
| Bug | runner (reproduce) → debugger (cause and fix) → runner → reviewer if non-trivial |
| Visible change | the normal flow, then qa before "done" |
| Security-sensitive anything | the normal flow plus a mandatory sentinel pass |
| Mechanical sweep (rename, format, docs) | You write the exact rule once, then drones on disjoint files, then a runner |
| Research then decide | researcher gathers facts, you decide (or architect if irreversible) |

## Brief template

```
Goal: <one sentence, and what done looks like>
Scope: <paths, symbols, line ranges you already hold; files you must NOT touch>
Constraints: <pattern to copy, the check that must pass, style rules>
Hard rules from earlier reviews: <output of: nexus lessons show --role <role>>
Return: <what to report, at most N lines; say what you did not verify>
```

Why each part: without scope the agent rediscovers what you hold; without the lessons block it repeats
a defect a reviewer already caught; without a return cap its report fills your context.

## Fan-out recipes

**Many independent files (stylesheets, modules, docs).** One builder per file, disjoint paths, you keep
the registry or index each one plugs into. Launch in waves of `maxParallel`. Review each wave, then
register and checkpoint units one at a time so each commit is attributable.

**Build then review pipeline.** Reviewers can start as soon as one builder finishes; they read only.
Send the findings (with exact fixes) to a drone or fix them inline, then re-run the check that failed.

**Research before design.** Researchers in parallel on disjoint questions, then one architect decision.

**Never** run two writers on one file, and never fan out while the tree has unrelated uncommitted work:
the diffs stop being attributable.

## Environment failures

A permission prompt, a hook gate or a classifier outage is not a code problem. Symptoms: the same tool
refused twice, an agent reporting `BLOCKED`, or agents "drafting" without saving.

1. Stop dispatching. Spawning replacements multiplies the burn.
2. Do inline whatever still works; read-only work usually does.
3. Report the exact error text and what is pending, in the order you will resume.
4. After it recovers, do one tiny write yourself before dispatching again (`nexus preflight`).

If an agent had designed its output before being blocked, its report usually contains the design. Resume
from that; do not re-brief from scratch.

## Fix-forward

Reviewer and QA findings carry an exact fix. Routing:

- Under ~20 lines you can place exactly: apply inline.
- Many mechanical fixes across files: one drone per file with the exact edits listed.
- A fix that changes behaviour or needs a decision: back to the builder with the finding and the
  previous result, at higher effort (see escalation).

Do not send "please fix these" to a cold agent: it re-reads everything to find what you already know.

## Ledger verdicts

| Verdict | Meaning |
|---|---|
| `clean` | Used as delivered |
| `fixes` | Needed changes after review or QA |
| `blocked` | The environment refused it; no work saved |
| `escalated` | Re-run at higher effort or a stronger model |
| `wasted` | Result unused, or cheaper inline |

`nexus report` turns repeated patterns into advice: low clean rate (tighten the brief, add a lesson),
repeated blocks (preflight and waves), token overrun (narrower scope, exact paths), wasted work (do it
inline). Review it after big jobs and change the profile or the briefs accordingly.

## UI and visible work

A reviewer cannot see a render. For anything visible: run it, load the page, look at it at desktop and
phone width, read the console. Judge by what is on screen. Typical defects only a render shows:
overlapping layers, text on low-contrast surfaces, images that 404, layout shift while content
animates, clipped long strings, controls that do nothing.
