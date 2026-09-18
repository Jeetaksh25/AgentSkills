# Code quality — the hygiene gate

Hygiene is the domain where "it looks fine" is most expensive: dead code hides live bugs, a
duplicated helper is two behaviours pretending to be one, a stale comment lies to the next reader.
Every rule here is decided by a command, because reading files until they feel clean does not scale
past the first batch.

## 1. The executable gate

Three commands decide this domain; all must exit 0 with zero errors before a batch closes.

| Gate | Command shape | Pass condition |
|---|---|---|
| Typecheck | `tsc --noEmit` · `mypy .` · `cargo check` · `go vet ./...` | exit 0, zero errors |
| Lint | `eslint . --max-warnings=0` · `ruff check .` · `golangci-lint run` | exit 0, zero errors; every warning triaged by name |
| Build | production build | succeeds; route/asset output recorded in the state file |

- Use the project's own scripts (`npm run typecheck`, not an invented command line). If a script is
  missing, add it in the same batch — a guarantee nobody can run is not a guarantee.
- Add an aggregate `verify` script (`typecheck && lint && build`) and reference it from CI.
- **Wire it into CI or it regresses by the next commit.** A CI job that runs the aggregate script on
  every push and pull request, with the check marked required on the default branch. A green local
  run protects this session only.
- Treat a lint warning as an error you have not justified yet. Two legitimate outcomes: fix it, or
  disable the rule at the narrowest scope **with a reason on the same line**. Never a config-wide
  mute, never `--max-warnings` raised to make the gate pass.
- Type errors silenced with `as any`, `@ts-ignore`, `# type: ignore` or `any`-typed parameters are
  the same failure as a skipped test: the gate reports green and the bug ships. Fix the type or
  narrow the escape to one line with a written reason.
- Strictness drift: if `strict`/`noImplicitAny` is off, turning it on is the single highest-value
  type fix — but land it as its own batch, because it will surface every latent hole at once.

## 2. Scan patterns

Ready to adapt — run from the repo root, after the last code change of the run, not before.

```bash
EXCL="--exclude-dir=node_modules --exclude-dir=.next --exclude-dir=dist --exclude-dir=build
      --exclude-dir=coverage --exclude-dir=.git --exclude-dir=vendor"
SRC="src app pages components lib server api scripts"

# 1. Debug artifacts
grep -rnE $EXCL 'console\.(log|debug|dir|trace)\s*\(|\bdebugger\b|\bprint\s*\(' $SRC
# 2. Shipping debt markers
grep -rnE $EXCL '\b(TODO|FIXME|HACK|XXX|WIP|TEMP)\b' $SRC
# 3. Commented-out code (declaration keywords inside comments)
grep -rnE $EXCL '^[[:space:]]*(//|#|\*)[[:space:]]*(const|let|var|function|class|def|import|export|if|for|return|await)\b' $SRC
# 4. Hardcoded credentials (see SECURITY.md §1 — this is the fast pass, not the full scan)
grep -rnEi $EXCL '(api[_-]?key|secret|token|password|passwd|private[_-]?key)["'"'"']?[[:space:]]*[:=][[:space:]]*["'"'"'][^"'"'"']{8,}' $SRC
# 5. Local/dev origins that must never be the shipped default
grep -rnE $EXCL 'https?://(localhost|127\.0\.0\.1|0\.0\.0\.0|host\.docker\.internal)(:[0-9]+)?' $SRC
# 6. Fixture and placeholder data on production surfaces
grep -rniE $EXCL 'test@|@example\.(com|org|net)|lorem ipsum|john doe|jane doe|foo@bar|acme corp' $SRC
# 7. Compiler escapes used to silence rather than fix
grep -rnE $EXCL 'as any|:[[:space:]]*any\b|<any>|@ts-ignore|@ts-expect-error|# type: ignore|eslint-disable' $SRC
# 8. Disabled rules with no stated reason (bare directive, nothing after it)
grep -rnE $EXCL 'eslint-disable(-next-line|-line)?[[:space:]]*$|@ts-ignore[[:space:]]*$|nolint[[:space:]]*$|noqa[[:space:]]*$' $SRC
# 9. Unused code, if the analyzer is available
npx knip --no-progress 2>/dev/null || npx ts-prune 2>/dev/null || true
```

Record each scan's exact command and its result count in the state file. "Zero matches" is evidence;
"looks clean" is not.

## 3. Judgement, not deletion

Every pattern above has legitimate instances. **Never blanket-delete a match** — a scan is a list of
questions, and the answer for each line is one of: fix, keep-with-reason, or move.

| Pattern | Legitimate instance | Correct action |
|---|---|---|
| `console.*` | bootstrap/migration CLI output, a `catch` that is the only signal before a logger exists | keep only in entry scripts; route app logging through the structured logger; delete the rest |
| `print(...)` | Python CLI, seed script, notebook-converted tooling | keep outside request paths; use `logging` inside them |
| `TODO`/`FIXME` | tracked debt: `TODO(#412): drop the legacy field after migration` | keep if it names a real issue/owner and a trigger; delete vague ones |
| commented-out code | none in shipped code | delete; version control holds history. Exception: a short commented example inside a docstring |
| `test@` / `example.com` | test files, fixtures, factories, seed data | keep, but ensure the surface is test-only (see §4) |
| `as any` / `@ts-ignore` | third-party type gap with no shipped types | keep with a one-line reason and a link; delete the rest |
| `eslint-disable` | a rule genuinely wrong for one construct, e.g. `no-console` in a CLI file | keep with reason; forbid blanket file-level disables |
| localhost URL | dev-only default behind an env check, test fixture | keep behind an explicit env branch; never as the production fallback |
| `DEPRECATED` marker | public API with a documented removal version | keep, and confirm a removal date/version exists |

- Deprecations are only honest if something enforces them. A `@deprecated` JSDoc with no removal
  version, no runtime warning and no issue is decoration — either schedule it or delete the code.
- A `console.error` inside a `catch` that swallows the error is not logging; it is a silent failure.
  See `references/OBSERVABILITY.md`.
- The judgement must be recorded. For every kept match: the path, the reason, and (when applicable)
  the issue link — in the state file, so the second audit can re-check it.

## 4. Dead code and duplication

- **Unused exports.** Run `knip`/`ts-prune` (or the language equivalent) and resolve every hit.
  Exclusions: package entry points declared in the manifest (`main`, `exports`, `bin`), framework
  magic files (route handlers, `page.tsx`, migration files), and a genuine published library surface.
- **Orphan modules** referenced nowhere: delete after confirming nothing imports them dynamically —
  grep for the basename as a string too, because string-keyed registries and lazy `import()` calls do
  not show up in the import graph.
- **Unreachable branches.** Code after an unconditional `return`/`throw`, `if (false)`, a feature
  flag permanently on, a `try` whose body cannot throw. Removing these is how you find the bug they
  were hiding.
- **Duplicated utilities.** Same function in two files, usually copied once and then diverged. Keep
  the copy in the shared module, migrate every call site, delete the other. Do not delete first.
- **Two implementations of one thing** is the failure mode that matters most: two error helpers
  producing different copy, two API clients with different auth/retry behaviour, two date formatters
  producing different strings in different places, two notification paths where one respects the
  user's preferences and one does not. Pick one, migrate everything, delete the loser.
- After deleting a utility, re-run typecheck — unused-import and unresolved-reference errors are the
  proof that the migration was complete. That is a legitimate use of the gate.
- A "backwards-compatibility shim" that nothing calls is dead code. Remove the shim and its caller
  in the same change; do not leave a re-export pointing at a deleted module.

## 5. Dependency hygiene

- **Declared but unimported**: `npx depcheck` (or `knip --dependencies`). Remove them — an unused
  package is bundle weight, install time and attack surface (SECURITY.md §8).
- **`dependencies` vs `devDependencies`**: anything imported by runtime code belongs in
  `dependencies`, even if the bundler inlines it. Anything imported only by tests, linting, type
  checking, or build tooling belongs in `devDependencies`.
- **Dev deps leaking into the runtime bundle** is a production incident class, not a tidiness issue:
  a test-helper import inside a component, a `devDependencies` package imported from a server route,
  a bundler config that externalises in dev but resolves in the production build. Detect by building
  for production and grepping the emitted chunks for the package name, or by reading the bundle
  analysis output — not by trusting the source imports.
- **Transitive bloat**: one import pulling a large tree (`lodash` for `debounce`, `moment` for a
  single format, a full icon set for three icons). Prefer the runtime, a subpath import, or the
  native API. Verify with the bundle analyzer, before and after, with the same settings.
- **Version drift**: multiple majors of the same package in the lockfile, or a caret range so wide
  that a rebuild is not reproducible. Bound versions, commit the lockfile, and upgrade deliberately.
- Duplicate functionality across packages (two HTTP clients, two date libraries, two validation
  libraries) — pick one. Two validation libraries means two sets of coercion rules and one boundary
  that validates differently from the other.

## 6. Consistency rules

Each row is "one implementation, everywhere". Divergent copies are where copy, behaviour and bug
fixes drift apart.

| Concern | One shared implementation | Divergence symptom |
|---|---|---|
| Error handling | one error type/helper producing the app's error shape | files inventing `{error: …}` vs `{message: …}` vs raw strings |
| API client | one fetch wrapper (auth, retry, error mapping, base URL) | some calls set credentials, some forget |
| Date/number formatting | one module (`Intl`-based) with named helpers | `toLocaleDateString` in one file, a hand-rolled `DD/MM` in another |
| Notifications | one toast/notification path | one path respects preferences and rate limits, the other does not |
| Validation | one schema library at the boundary | validated here, assumed there |
| Env access | one `env` module parsed at boot | `process.env.X!` scattered, undefined in production |
| Logging | one structured logger | some paths log structured fields, some log prose |

- The rule is not "DRY at all costs". Two functions that happen to look alike but answer different
  business questions stay separate; the trigger for merging is *shared semantics*, proven by the
  fact that a change to one requires a matching change to the other.
- Migrating call sites is part of the fix. A shared helper used by two of nine callers is worse than
  none, because now there are three behaviours.

## 7. Comment discipline

- Comments explain **why**: the constraint, the upstream bug, the non-obvious ordering. They do not
  narrate `i++`.
- **Delete stale comments.** A comment that contradicts the code is worse than no comment — it is a
  false instruction, and the next reader will trust it. When you change behaviour, grep for comments
  naming the old behaviour in the same batch.
- **No commented-out code as history.** Version control owns history. Its only effect is making
  readers diff two copies of the truth.
- Delete `// removed X`, `// old version`, `// moved to Y` breadcrumbs once the commit exists.
- Licence headers, linter directives, type escapes and generated-file warnings stay — they are
  functional, not editorial.
- Keep `README`/docs claims aligned with the code in the same batch as the code change; a doc that
  describes a removed script is a broken instruction.

## 8. Environment and type safety

- **Validate at the boundary, trust inside.** Parse external data once — request bodies, query and
  path params, env vars, third-party API responses, webhooks, file/CSV imports — into a typed value.
  Never let an unvalidated shape travel deeper than the handler that received it.
- **Typed env access**: one module reads `process.env` (or the platform's env API) once, validates
  every required variable, and exports a typed object. Missing production variables crash at boot
  with a named variable in the message — never a silent `undefined` that becomes `"undefined"` in a
  URL, and never a fallback to a development default.
- **No implicit `any` in new code.** If strictness is currently off, new files still get explicit
  types; annotate the escape hatch you are leaving rather than spreading the hole.
- Distinguish the two directions of unsafety: a value leaving a validated boundary is a contract
  (type it), a value crossing into the database or a third-party API is a trust boundary (validate
  it again for length/range, because types do not enforce runtime constraints).
- Never write a check the compiler has proven unnecessary and never remove one that guards real
  external data. The two failure modes are symmetrical and both ship bugs.

## 9. Re-audit — after the last change, never before

- Hygiene scans run against the **final** tree. An early scan says nothing about the code added in
  later batches; every batch adds new `console.log`, new TODOs, new `as any`, new dead exports.
- Sequence: last code change → run the scan block → fix → re-run typecheck/lint/build → record the
  counts. A scan is only evidence when it is the last thing that ran.
- Any batch that touches code re-opens this domain. Do not carry "CODE-* verified" forward across a
  later batch that added source files.
- Keep the scan in CI (a `hygiene` job) so the next change is caught without a human remembering it.
  A pattern scan that lives only in a document decays within one sprint.
- Record per-scan evidence in the state file: command, match count, and for every retained match the
  reason. The second audit re-runs the same commands and diffs the counts; a count that grew is a
  regression introduced by hardening work.

## Checklist mapping

| ID | Item |
|---|---|
| CODE-01 | Typecheck exits zero |
| CODE-02 | Lint zero errors, warnings triaged |
| CODE-03 | No debug artifacts shipped |
| CODE-04 | No untracked TODO/FIXME debt |
| CODE-05 | No commented-out code |
| CODE-06 | No unused code or orphans |
| CODE-07 | No divergent duplicated utilities |
| CODE-08 | No fixture data in production |
| CODE-09 | No hardcoded credentials |
| CODE-10 | One consistent error handling |
| CODE-11 | Dead exports removed |
| CODE-12 | Comments explain intent |
