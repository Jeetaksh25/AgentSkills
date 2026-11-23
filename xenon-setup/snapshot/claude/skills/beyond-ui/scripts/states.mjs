#!/usr/bin/env node
/**
 * beyond-ui state coverage audit — the "states are designed, not assumed" gate input (G16).
 *
 *   node scripts/states.mjs [projectDir]
 *
 * CRITIQUE.md hard fail 13: "Broken states. Missing loading/empty/error; a loading state that jumps
 * layout; an empty state with no action." It is the most common defect in AI-built UI and the one a
 * screenshot never reveals, because a screenshot only ever shows the happy path. Every async surface
 * in the source is found and required to have designed loading, empty AND error states — as real
 * markup or components, not a bare `<div>Loading…</div>` spinner-only afterthought.
 *
 * Writes `.beyond-ui/states-audit.json` (G16 reads it and refuses the run when an async surface
 * ships without its states). Exit 1 when a surface is missing states.
 */
import fs from "node:fs";
import path from "node:path";

const projectDir = path.resolve(process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : process.cwd());
const beyondDir = path.join(projectDir, ".beyond-ui");
const outPath = path.join(beyondDir, "states-audit.json");

const log = (...a) => console.log(...a);
const readJson = (p, d = null) => { try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return d; } };
const writeJson = (p, v) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n"); };

const SRC_DIRS = ["app", "src", "components", "pages", "routes", "views", "ui", "widgets", "features", "layouts"];
const SKIP = /node_modules|\.next|\.nuxt|\.svelte-kit|dist|build|out|coverage|\.beyond-ui|\.agents|\.git|public/;
const EXT = /\.(tsx|jsx|vue|svelte|ts|js)$/;
const UI_DIR = /[\/\\]components[\/\\]ui[\/\\]/; // shadcn primitives: not surfaces

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (SKIP.test(p.replace(/\\/g, "/"))) continue;
    if (e.isDirectory()) walk(p, out);
    else if (EXT.test(e.name)) out.push(p);
  }
  return out;
}
function sourceFiles() {
  const found = [];
  for (const d of SRC_DIRS) walk(path.join(projectDir, d), found);
  return found.filter((f) => !UI_DIR.test(f.replace(/\\/g, "/")));
}

// what makes a surface "async": it fetches, subscribes, or is fed by a data hook
const ASYNC_RE = /\b(useQuery|useSWR|useMutation|fetch\(|axios|useEffect\s*\([^)]*\)\s*=>[\s\S]{0,400}(fetch|await|subscribe)|use[A-Z]\w*(Query|Data|List|Items|Table|Stats|Metrics|Billing|Invoices|User|Profile|Feed|Results)|getServerSideProps|generateStaticParams|loader\s*[:=]|createServerFn)\b/;
const ASYNC_DECL = /(async function|async \(|await\s+|\.then\(|Promise<|Suspense|use\(|observable|QueryClient|useAsync)/;

// the three required states, each with the signals that count as a designed implementation
const STATES = [
  {
    key: "loading",
    // skeleton > spinner-only: a designed loading state reserves layout (hallmark/impeccable rule)
    test: (t) => /(Skeleton|<Skeleton\b|isLoading|isPending|loading\.(tsx|jsx|vue|svelte)|loading\s*[:=]|Loading\b|Spinner)/i.test(t),
    designed: (t) => /(Skeleton|animate-pulse|shimmer|aria-busy)/i.test(t),
    hint: "design a layout-reserving loading state (Skeleton / animate-pulse / aria-busy), not a bare spinner",
  },
  {
    key: "empty",
    test: (t) => /(EmptyState|NoResults|isEmpty|length\s*===?\s*0|!data\.|!items|No\s+\w+\s+yet|nothing (here|to show)|empty-?state)/i.test(t),
    // an empty state with no way forward is a hard fail (CRITIQUE-13: "an empty state with no action")
    designed: (t) => /(EmptyState|Empty\b|No\s+\w+\s+(yet|found)|Create|Add|Start|Import|Get started|first\s+\w+)/i.test(t),
    hint: "design the empty state with a next action (create/add/import), not just 'No data'",
  },
  {
    key: "error",
    test: (t) => /(ErrorState|isError|error\s*[:=]|catch\s*\(|onError|ErrorBoundary|Something went wrong|try again|retry)/i.test(t),
    designed: (t) => /(ErrorState|ErrorBoundary|Something went wrong|retry|Try again|catch\s*\()/i.test(t),
    hint: "design the error state: a named failure plus recovery (retry / sign in / contact), announced (aria-live)",
  },
];

const files = sourceFiles();
const fileText = new Map(files.map((f) => [f, fs.readFileSync(f, "utf8")]));

const surfaces = [];
for (const [f, t] of fileText) {
  const rel = path.relative(projectDir, f).replace(/\\/g, "/");
  const isAsync = ASYNC_RE.test(t) || (ASYNC_DECL.test(t) && /(page|view|screen|dashboard|table|list|feed|panel|modal|drawer)/i.test(rel));
  if (!isAsync) continue;
  const row = { file: rel, states: {}, missing: [], weak: [] };
  for (const s of STATES) {
    const has = s.test(t);
    const designed = has && s.designed(t);
    row.states[s.key] = has ? (designed ? "designed" : "weak") : "missing";
    if (!has) row.missing.push(s.key);
    else if (!designed) row.weak.push(s.key);
  }
  surfaces.push(row);
}

const complete = surfaces.filter((s) => s.missing.length === 0 && s.weak.length === 0);
const partial = surfaces.filter((s) => s.missing.length > 0 || s.weak.length > 0);

const report = {
  at: new Date().toISOString(),
  scannedFiles: files.length,
  asyncSurfaces: surfaces.length,
  complete: complete.map((s) => s.file),
  partial: partial.map((s) => ({ file: s.file, missing: s.missing, weak: s.weak })),
  byState: Object.fromEntries(STATES.map((s) => [s.key, surfaces.filter((r) => r.states[s.key] !== "missing").length])),
  // pass requires: at least one async surface was found (an app with data has one), and every one of
  // them designs all three states
  pass: surfaces.length > 0 && partial.length === 0,
};
writeJson(outPath, report);

// merge into state.json so the run state carries the audit
try {
  const state = JSON.parse(fs.readFileSync(path.join(beyondDir, "state.json"), "utf8"));
  state.states = {
    report: path.relative(projectDir, outPath).replace(/\\/g, "/"),
    asyncSurfaces: surfaces.length,
    complete: complete.length,
    partial: partial.length,
    pass: report.pass,
  };
  fs.writeFileSync(path.join(beyondDir, "state.json"), JSON.stringify(state, null, 2) + "\n");
} catch { /* no state yet is fine */ }

log(`states audit — ${files.length} source files, ${surfaces.length} async surface(s)`);
if (surfaces.length === 0) {
  log("  no async surface found — if this app genuinely fetches nothing, say so in state.deferred; otherwise the scan missed it");
} else {
  log(`  complete: ${complete.length}/${surfaces.length}   loading:${report.byState.loading} empty:${report.byState.empty} error:${report.byState.error}`);
  for (const s of partial) {
    const bits = [...s.missing.map((m) => `missing ${m}`), ...s.weak.map((m) => `weak ${m}`)];
    log(`  INCOMPLETE ${s.file} — ${bits.join(", ")}`);
    for (const k of s.missing) log(`      ${STATES.find((x) => x.key === k).hint}`);
  }
}
log(report.pass ? "\nstates: PASS — every async surface designs loading + empty + error" : "\nstates: FAIL — design the missing states (G16 reads states-audit.json)");
process.exit(report.pass ? 0 : 1);
