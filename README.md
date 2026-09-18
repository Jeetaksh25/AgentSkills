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
| [`beyond-ui`](./beyond-ui) | The ultimate UI design skill: bootstraps the upstream design skills (impeccable, hallmark, ui-ux-pro-max, taste-skill, Anthropic frontend-design, Addy Osmani, Vercel, bencium, accesslint), scouts 60+ award-winning galleries, 55+ template/prompt sources and 40+ animated component registries, then composes real UIs from shadcn/ui plus those libraries — motion, WebGL, SVG, liquid glass and all — so nothing is invented from scratch and nothing looks AI-generated. |

## Installation

Copy a skill folder into your agent's skills directory:

```bash
# Claude Code / OMP style skills directory
cp -r production-suite-completion ~/.claude/skills/

# or a project-local skills directory
mkdir -p .agents/skills && cp -r production-suite-completion .agents/skills/
```

Then reference it in a prompt: *"use the production-suite-completion skill and make this app
production ready."*

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
