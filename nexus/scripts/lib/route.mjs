import { CAP, MODELS, resolve } from "./config.mjs";

const SIGNALS = {
  security: /\b(auth\w*|password|passwd|token|secret|credential|crypto\w*|encrypt\w*|permission|rbac|payment|billing|stripe|pii|oauth|jwt|csrf|xss|sql ?injection|session|cookie|api ?key)\b/i,
  strongSecurity: /\b(auth\w*|password|secret|credential|crypto\w*|encrypt\w*|permission|payment|billing|pii|oauth|jwt)\b/i,
  irreversible: /\b(drop|truncate|migrat\w+|production|prod|force[- ]push|backfill|schema|publish|release|rollback|deploy\w*)\b/i,
  broad: /\b(across|all (the )?(files|services|modules|packages)|everywhere|monorepo|public api|breaking|codebase[- ]wide|every)\b/i,
  ambiguous: /\b(design|architect\w*|approach|options?|trade-?offs?|should we|not sure|best way|strategy|rework|redesign|decide)\b/i,
  scale: /\b(each|\d{2,}|dozens?|hundreds?|multiple|several|bulk)\b/i,
  novel: /\b(new (library|framework|language|stack)|never (used|done)|from scratch|prototype|unfamiliar|spike)\b/i,
  ui: /\b(ui|ux|page|screen|layout|css|visual|component|animation|responsive|theme|look|looks)\b/i,
};

const VERBS = [
  ["reviewer", /\b(review|audit|check (my|this|the) (diff|pr|change))\b/i],
  ["debugger", /\b(bug|fix|error|fail\w*|crash\w*|flaky|regression|broken|exception|stack ?trace|slow|leak|wrong)\b/i],
  ["scout", /\b(where|find|locate|which files?|who calls|call sites?|usages?|trace|map|explore)\b/i],
  ["runner", /\b(run|execute)\b.*\b(tests?|build|lint|typecheck|type-check|suite)\b/i],
  ["drone", /\b(rename|reformat|format|typo|changelog|readme|docstrings?|comments?|boilerplate|bump|reword\w*)\b/i],
  ["researcher", /\b(research|compare|documentation|docs|which library|upgrade guide|release notes|version)\b/i],
  ["tester", /\b(tests?|coverage|spec|fixtures?)\b/i],
  ["builder", /\b(implement|add|build|create|write|feature|support|refactor|migrate|port|integrate|make|update|change)\b/i],
];

const FLOWS = {
  scout: [["scout", "answer the question"]],
  runner: [["runner", "run and report"]],
  drone: [["drone", "apply the fully specified edit"], ["runner", "only if output would be long"]],
  researcher: [["researcher", "gather facts; you decide"]],
  reviewer: [["reviewer", "independent review of the diff"]],
  tester: [["tester", "write or repair the tests"], ["runner", "confirm they pass"]],
  debugger: [["runner", "reproduce and capture the failing lines"], ["debugger", "root cause plus minimal fix"], ["runner", "confirm the fix"]],
  builder: [["builder", "implement the settled approach"], ["tester", "cover the new behaviour"], ["runner", "build and test"]],
};

const LOWERABLE = new Set(["scout", "drone", "researcher", "builder", "tester", "qa"]);
const UPGRADABLE = new Set(["scout", "drone", "researcher", "builder", "tester", "qa", "runner"]);
const STEP_UP = { low: "medium", medium: "high", high: "high" };
const STEP_DOWN = { high: "medium", medium: "low", low: "low" };
const nextModel = (m) => MODELS[Math.min(MODELS.indexOf(m) + 1, MODELS.length - 1)];

function adapt(role, pin, ctx) {
  if (!ctx.adaptive || !pin) return { ...pin, arrow: "", why: "" };
  if (ctx.highs === 0 && !ctx.critical && ctx.words <= 30 && LOWERABLE.has(role) && pin.effort === "medium") {
    return { model: pin.model, effort: "low", arrow: "↓effort", why: "every signal is low and the task is short" };
  }
  if (ctx.highs >= 2 && UPGRADABLE.has(role)) {
    return { model: nextModel(pin.model), effort: "high", arrow: "↑model", why: `${ctx.highs} high signals (${ctx.highNames.join(", ")})` };
  }
  if (ctx.highs === 1 && pin.effort !== "high" && role !== "runner") {
    return { model: pin.model, effort: STEP_UP[pin.effort], arrow: "↑effort", why: `one high signal (${ctx.highNames[0]})` };
  }
  return { ...pin, arrow: "", why: "" };
}

export function route(task, cfg) {
  const text = String(task || "").trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  const { adaptive, roles, profile } = resolve(cfg);
  if (profile === "off") return { off: true, steps: [], notes: ["Nexus is off; work as default Claude Code."] };

  const hit = Object.fromEntries(Object.entries(SIGNALS).map(([k, re]) => [k, re.test(text)]));
  const highNames = ["broad", "scale", "ambiguous", "novel"].filter((k) => hit[k]);
  const critical = hit.strongSecurity || (hit.irreversible && /\b(drop|truncate|migrat\w+|production|backfill|schema)\b/i.test(text));
  const ctx = { adaptive, words, highs: highNames.length, highNames, critical };

  const primary = VERBS.find(([, re]) => re.test(text))?.[0] || "builder";
  let flow = [...FLOWS[primary]];
  const needsDesign = primary === "builder" && (hit.ambiguous || (hit.irreversible && hit.broad));
  if (needsDesign) flow = [["scout", "map the area first"], ["architect", "fix the design and split into units"], ...flow.map(([r, n]) => [r, r === "builder" ? "execute each unit of the plan" : n])];
  if (hit.ui && ["builder", "debugger", "drone"].includes(primary)) flow.push(["qa", "render it and check it with your own eyes"]);
  if (["builder", "debugger", "tester", "drone"].includes(primary)) flow.push(["reviewer", "only if the diff is over the review threshold or touches more than one file"]);
  if (hit.security && !["scout", "runner", "researcher"].includes(primary)) flow.push(["sentinel", "mandatory security pass before done"]);

  const seen = new Set();
  const steps = [];
  for (const [role, note] of flow) {
    const name = `nexus-${role}`;
    const pin = roles[name];
    if (!pin) continue;
    const key = `${role}:${note}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const a = role === "sentinel" || role === "architect" ? { ...pin, arrow: "", why: "" } : adapt(role, pin, ctx);
    steps.push({ agent: name, role, model: a.model, effort: a.effort, arrow: a.arrow, why: a.why, note });
  }

  const notes = [];
  const inline = words <= 12 && ["scout", "runner", "drone"].includes(primary) && !hit.security && !critical;
  if (inline) notes.push("Small and mechanical: do it inline if you can finish in three tool calls; a cold subagent costs more than it saves.");
  if (hit.irreversible) notes.push("Irreversible or production-facing: confirm the plan with the user before executing it.");
  if (critical && !hit.strongSecurity) notes.push("Critical blast radius: the design decision belongs to the architect on Opus, then builders execute.");
  if (hit.security && !["scout", "runner", "researcher"].includes(primary)) notes.push("Security-sensitive: the sentinel pass is a floor, not an option.");
  if (hit.scale) notes.push("Many units: estimate first, launch in waves of maxParallel, one writer per shared file, checkpoint each unit after review.");
  if (hit.broad) notes.push("Wide change: give each builder a disjoint set of files and keep shared files with a single writer.");
  return { primary, signals: hit, highs: highNames, critical, profile, adaptive, inline, steps, notes };
}

export function formatRoute(r) {
  if (r.off) return r.notes.join("\n");
  const lines = [];
  lines.push(`Intent: ${r.primary}   Signals: ${Object.entries(r.signals).filter(([k, v]) => v && k !== "strongSecurity").map(([k]) => k).join(", ") || "none"}   Profile: ${r.profile}${r.adaptive ? " (adaptive)" : ""}`);
  lines.push(`Flow: ${r.steps.map((s) => s.role).join(" → ")}`);
  for (const s of r.steps) {
    const tag = s.arrow ? `${s.arrow}: ${s.why}` : s.note;
    lines.push(`⟶ ${s.agent} · ${s.model}/${s.effort} · ${tag}`);
  }
  for (const n of r.notes) lines.push(`note: ${n}`);
  return lines.join("\n");
}

export { CAP };
