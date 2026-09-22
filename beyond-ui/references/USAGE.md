# Usage enforcement — proving the skills and evidence were actually used

The most-reported failure of a beyond-ui run is not bad taste — it is **invisibility**: the agent runs
the skill, installs hallmark and impeccable, writes a scout file, then builds the page from its own
prior and cites none of it. This file is the countermeasure. It makes usage *mechanically checkable*.

## The mechanism: cite every load-bearing decision

Every decision that shaped the UI must carry a citation naming WHERE it came from. The three legal
source kinds:

| Source kind | Format | Example |
|---|---|---|
| Upstream skill rule | `skill://<skill> -> <rule>` | `skill://hallmark -> no three-equal-columns` |
| Synthesized project skill | `DESIGN-SKILL.md §<n>` | `DESIGN-SKILL.md §4 (motion grammar from teardown/linear)` |
| Teardown evidence | `teardown/<slug>/<file>` | `teardown/stripe/references/INTERACTIONS.md (hover = border+shadow, no size change)` |

Citations are appended to `.beyond-ui/state.json -> ruleCitations` as they happen, each:
`{ decision, source, appliedIn }` — the decision in one line, the source that justifies it, and the
file where it was applied. `scripts/verify-run.mjs` G7 fails the run with fewer than 5 (configurable),
or with any citation missing a field.

**Minimum citation coverage** (a run missing any of these categories is incomplete):

1. One rule from **each upstream skill that changed a decision** — hallmark, impeccable, taste,
   Vercel web-design-guidelines at minimum. "Followed impeccable" without a named rule is the exact
   failure this gate exists to catch.
2. One per **direction choice** (type, colour, motion grammar) sourced from `DESIGN-SKILL.md §n`
   or `teardown/<slug>`.
3. One per **hard-fail fix** in critique, naming the CRITIQUE.md rule number.
4. One per **a11y/perf constraint** that shaped the build, sourced to A11Y-PERF.md or
   skill://accesslint.

## When to cite (the workflow hooks)

| Phase | Citation written |
|---|---|
| DIRECTION | each contract field: aesthetic, type, colour, motion grammar -> DESIGN-SKILL.md §n or teardown/<slug> |
| COMPOSE | each registry/library choice -> library map entry or skill://<name> |
| BUILD | each state pattern, token decision, focus treatment -> the rule that demanded it |
| CRITIQUE | every hard fail found AND fixed -> references/CRITIQUE.md rule number |
| VERIFY | each check -> the A11Y-PERF.md / upstream rule it enforces |

## Evidence over assertion

The upstream skills already state the principle (accesslint's evidence basis; hallmark's "show it");
this file applies it to the run itself:

- A claim like "used the teardown data" is verified by `ruleCitations` entries whose `source`
  points at a teardown artifact that **exists on disk** — G5 of verify-run checks the artifacts,
  G7 checks the citations, and a citation to a non-existent file is a fabrication.
- Screenshots named in `verify.screenshots` must exist as real files.
- `critique.gates` scores must have been recorded BEFORE the enforcement gate ran —
  `verify-run.mjs` refuses a pass when `critique.mean` is unset (an unscored page cannot verify).

## The gate

```bash
node scripts/verify-run.mjs            # runs G1–G9, stamps state.json -> enforcement, exit 1 on any fail
```

Gates: G1 state · G2 scout evidence · G3 skills installed-or-documented · G4 selection quality ·
G5 teardown artifacts · G6 DESIGN-SKILL.md completeness · G7 citations · G8 critique scores ·
G9 verify evidence. **Exit 1 means the run is not done** — the report must not claim completion,
and the remedy is to do the missing work, never to relax the gate.

## Reading vs claiming

The bootstrap installs skills; only reading them counts. Proof of reading, per
`references/SKILLS.md`:

1. `state.json -> skills.installed` / `skills.missing` (with `readInstead` URL) — from bootstrap.
2. Rule citations naming that skill — from this file's mechanism.
3. The pre-emit critique stamp — from CRITIQUE.md.

All three together are what "the agent used the skills" means. Anything less is asserted, not shown.