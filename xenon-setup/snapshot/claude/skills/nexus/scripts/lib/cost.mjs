import { NexusError, merge, resolve } from "./config.mjs";

const DEFAULTS = {
  modelWeight: { haiku: 1, sonnet: 3, opus: 5 },
  effortWeight: { low: 0.6, medium: 1, high: 1.7, xhigh: 3 },
  ktokens: { scout: 30, runner: 15, drone: 25, researcher: 60, builder: 90, tester: 80, debugger: 100, reviewer: 60, architect: 70, sentinel: 60, qa: 70 },
};

export const costModel = (cfg) => merge(DEFAULTS, cfg.cost || {});

export const unitCost = (model, effort, ktokens, cm) => Math.round(cm.modelWeight[model] * cm.effortWeight[effort] * ktokens);

export function parseSpec(spec) {
  const m = /^(?:nexus-)?([a-z]+)(?::(\d+))?(?:@(haiku|sonnet|opus)\/(low|medium|high|xhigh))?$/.exec(spec.trim());
  if (!m) throw new NexusError(`bad unit "${spec}" (use role[:count][@model/effort], e.g. builder:4 or reviewer:2@opus/high)`);
  return { role: m[1], count: m[2] ? Number(m[2]) : 1, model: m[3], effort: m[4] };
}

export function estimate(specs, cfg) {
  const { roles, profile } = resolve(cfg);
  if (profile === "off") throw new NexusError("Nexus is off; there is nothing to estimate.");
  const cm = costModel(cfg);
  const rows = [];
  for (const s of specs.map(parseSpec)) {
    const pin = roles[`nexus-${s.role}`];
    if (!pin) throw new NexusError(`unknown role "${s.role}"`);
    const model = s.model || pin.model;
    const effort = s.effort || pin.effort;
    const k = cm.ktokens[s.role] ?? 60;
    const each = unitCost(model, effort, k, cm);
    rows.push({ role: s.role, count: s.count, model, effort, ktokens: k, each, total: each * s.count });
  }
  const total = rows.reduce((n, r) => n + r.total, 0);
  const peak = rows.reduce((n, r) => n + r.count, 0);
  const warnings = [];
  const maxParallel = cfg.policy?.maxParallel ?? 4;
  const confirm = cfg.policy?.confirmAboveUnits ?? 1200;
  if (peak > maxParallel) warnings.push(`${peak} agents at once exceeds maxParallel (${maxParallel}): launch in waves of ${maxParallel}, and review each wave before the next`);
  if (total > confirm) warnings.push(`estimated ${total} units is above confirmAboveUnits (${confirm}): tell the user the plan and cost first`);
  return { rows, total, peak, warnings };
}

export function formatEstimate(e) {
  const out = ["role         n  model/effort   ktok  each  total"];
  for (const r of e.rows) out.push(`${r.role.padEnd(12)} ${String(r.count).padStart(1)}  ${`${r.model}/${r.effort}`.padEnd(13)} ${String(r.ktokens).padStart(4)} ${String(r.each).padStart(5)} ${String(r.total).padStart(6)}`);
  out.push(`total ${e.total} relative units (a haiku/medium 30k-token scout is 30). Compare plans, not dollars.`);
  for (const w of e.warnings) out.push(`warning: ${w}`);
  return out.join("\n");
}
