# AgentSkills

A collection of skills that make AI coding agents substantially more powerful — drop a folder into
your agent's skills directory and the agent gains a whole discipline it did not have before.

Each skill is self-contained: a `SKILL.md` that tells the agent when and how to use it, plus
`references/` it loads only when it needs depth, and `assets/` for machine-readable data or templates.
Skills are written to be **executable knowledge** — every checklist item carries an acceptance
condition, every claim an agent makes must carry evidence, and every skill states the failure modes it
exists to prevent.

## Skills in this repo

| Skill | What it does |
|---|---|
| [`production-suite-completion`](./production-suite-completion) | Takes a working app to genuinely production-ready: audits performance, database, API, security, UX, accessibility, SEO, legal, observability, deployment, branding and code hygiene, then fixes, verifies, re-audits and reports — autonomously, in one run, until every gate is green or explicitly blocked on real-world input. |
| [`beyond-ui`](./beyond-ui) | The ultimate UI design skill: deterministically routes exactly 10 upstream skills (5 permanent star-ranked design skills — Anthropic frontend-design, ui-ux-pro-max, Addy Osmani, taste-skill, impeccable — plus 5 routed for the project), self-installs a keyless tool layer (Playwright + chromium, skillui, opensrc, Scrapling, browser-use), scouts 60+ award-winning galleries, 55+ template/prompt sources and 40+ animated component registries, tears down exactly 5 award-winning references in the project's own domain into one binding condensed project skill (`.beyond-ui/SKILL.md`) with real extracted tokens, type scales, keyframes and measured contrast ratios — then **IMPORTS the base components from shadcn/ui and the animated components from the registries** (`.beyond-ui/SECTION-PLAN.md` + `BLOCK-MAP.md`, exact `npx shadcn@latest add @ns/item` commands, enforced to 2–3 registries, import-first audit), exercises the built app like a human (`qa.mjs` journey) and gates the run with `verify-run.mjs` (G1–G14) so the evidence, the plan and the built result provably line up. Nothing is invented from scratch and nothing looks AI-generated. |

## Installation

The default is **every detected harness at once** — a machine usually has Claude Code, OMP and the
cross-tool `.agents/` layout together, and installing into only one of them is how a skill silently
goes stale in the others:

```bash
node scripts/install-skills.mjs            # all detected harness dirs, symlinked (stays current)
node scripts/install-skills.mjs --list     # show what would be installed
node scripts/install-skills.mjs --target ~/.omp/skills    # one explicit destination (repeatable)
node scripts/install-skills.mjs --copy     # copy instead of symlink (needs re-running after updates)
```

Symlinked installs track the repo automatically; `--copy` installs freeze and must be re-run.

Or install by hand — copy the whole folder (it is self-contained):

```bash
cp -r beyond-ui ~/.claude/skills/     # Claude Code
cp -r beyond-ui ~/.omp/skills/        # OMP (oh-my-pi)
cp -r beyond-ui ~/.agents/skills/     # cross-tool layout
```

Then reference it in a prompt: *"use the beyond-ui skill and build me a landing page that looks
designed."* The skill's own bootstrap then installs the upstream design skills and the tool layer on
first use — nothing else has to be set up by hand, and no API keys are required.

## Anatomy of a skill here

```
<skill-name>/
  SKILL.md            # frontmatter (name, description) + the operating loop
  references/*.md     # deep dives, loaded per domain on demand
  assets/*.json       # machine-readable checklists, templates, thresholds
```

The `description` frontmatter is what the agent matches against a user's request, so it lists the
phrases that should trigger the skill and the cases that should not.

## Design principles

- **Evidence over assertion.** "Verified" means a command was run and its output recorded — not that
  the code was read.
- **Progressive disclosure.** The main file stays small; depth lives in references the agent loads
  only for the domain it is working on.
- **Loops that terminate.** Every skill defines its stop condition precisely, so a run ends in a
  green gate or a named blocker, never in vague progress.
- **No fabrication.** Skills that touch content, trust or legal surface build structure and label
  placeholders rather than inventing facts.

## Contributing

Add a sibling folder named after the skill, keep `SKILL.md` focused, push depth into `references/`,
and give every item an acceptance condition.

## License

MIT — see individual skill folders for their own license notes.
