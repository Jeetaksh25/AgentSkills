# <UNIT-ID> - <short title>

Tier: <0|1|2|3>  |  Builder: <worker | claude-sonnet-medium | claude-opus-medium>  |  Reviewer: <haiku-high | sonnet-high | opus-medium | opus-high>
Plan item: <where this comes from: checklist line, issue, or user request>

## Goal
<One paragraph: what exists when this unit is done, and why.>

## Files
<Only these may be created or changed.>
- `path/to/file` (new | edit)

## Interfaces
<Exact signatures, types, file formats, error cases. No design decision may be left open for a tier 0-1 unit.>

## Done-tests
<Each becomes a test. Behaviour, not implementation.>
1. <given / when / then>

## Checks
<Each line is run by gates.ps1. The executable must be in allowed_executables.>
- `<command>`

## Constraints
- Follow .crew/project.md.
- <performance, safety, dependency limits>

## Out of scope
- <what NOT to do>