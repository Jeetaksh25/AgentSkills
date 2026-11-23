import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const SKILL_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
export const MODELS = ["haiku", "sonnet", "opus"];
export const EFFORTS = ["low", "medium", "high", "xhigh"];
export const PROFILES = ["auto", "low", "medium", "high", "off"];
export const CAP = { haiku: "Haiku", sonnet: "Sonnet", opus: "Opus" };

export class NexusError extends Error {}

export const homeDir = () => process.env.NEXUS_HOME || os.homedir();

export function paths(project = false, cwd = process.cwd()) {
  const base = project ? path.join(cwd, ".claude") : path.join(homeDir(), ".claude");
  return {
    base,
    skillDest: path.join(base, "skills", "nexus"),
    agentsDest: path.join(base, "agents"),
    userCfgPath: path.join(base, "nexus.json"),
  };
}

export function readJson(p) {
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch (e) {
    throw new NexusError(`Cannot parse ${p}: ${e.message}`);
  }
}

export function merge(a, b) {
  if (!b) return a;
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) {
    out[k] = v && typeof v === "object" && !Array.isArray(v) && a[k] && typeof a[k] === "object" ? merge(a[k], v) : v;
  }
  return out;
}

export function loadConfig(cwd = process.cwd()) {
  const layers = [
    ["defaults", path.join(SKILL_DIR, "assets", "nexus.config.json")],
    ["user", path.join(homeDir(), ".claude", "nexus.json")],
    ["project", path.join(cwd, ".claude", "nexus.json")],
  ];
  let cfg = {};
  const used = [];
  for (const [label, p] of layers) {
    const j = readJson(p);
    if (j) {
      cfg = merge(cfg, j);
      used.push(`${label}: ${p}`);
    }
  }
  return { cfg, used };
}

export function resolve(cfg) {
  const profile = cfg.profile || "auto";
  if (profile === "off") return { profile, adaptive: false, roles: {} };
  const p = cfg.profiles?.[profile];
  if (!p) throw new NexusError(`unknown profile "${profile}" (use ${PROFILES.join("|")})`);
  const baseRoles = p.base ? cfg.profiles[p.base].roles : p.roles;
  const roles = merge(baseRoles, cfg.roles || {});
  const out = {};
  for (const [role, r] of Object.entries(roles)) out[role] = { model: String(r.model).toLowerCase(), effort: r.effort };
  return { profile, adaptive: !!p.adaptive, summary: p.summary, roles: out };
}

export function validate(cfg) {
  const problems = [];
  if (!PROFILES.includes(cfg.profile || "auto")) problems.push(`profile must be one of ${PROFILES.join("|")}`);
  const forbidden = new Set([...(cfg.policy?.forbiddenModels || []), "fable", "inherit"].map((m) => String(m).toLowerCase()));
  const check = (where, r) => {
    if (r.model !== undefined) {
      const m = String(r.model).toLowerCase();
      if (forbidden.has(m)) problems.push(`${where}: model "${r.model}" is forbidden (Nexus never routes to Fable or inherit)`);
      else if (!MODELS.includes(m)) problems.push(`${where}: model must be one of ${MODELS.join("|")}`);
    }
    if (r.effort !== undefined) {
      if (r.effort === "max") problems.push(`${where}: max effort is never allowed`);
      else if (r.effort === "xhigh") problems.push(`${where}: xhigh cannot be a default effort; it is a last-resort escalation only`);
      else if (!EFFORTS.includes(r.effort)) problems.push(`${where}: effort must be one of low|medium|high`);
    }
  };
  for (const [name, p] of Object.entries(cfg.profiles || {})) for (const [role, r] of Object.entries(p.roles || {})) check(`profiles.${name}.${role}`, r);
  for (const [role, r] of Object.entries(cfg.roles || {})) check(`roles.${role}`, r);

  const positive = (where, v) => {
    if (v !== undefined && !(typeof v === "number" && Number.isFinite(v) && v > 0)) problems.push(`${where} must be a positive number`);
  };
  const pol = cfg.policy || {};
  for (const k of ["maxEscalations", "reviewThresholdLines", "maxParallel", "confirmAboveUnits"]) positive(`policy.${k}`, pol[k]);
  for (const [k, v] of Object.entries(cfg.cost?.modelWeight || {})) positive(`cost.modelWeight.${k}`, v);
  for (const [k, v] of Object.entries(cfg.cost?.effortWeight || {})) positive(`cost.effortWeight.${k}`, v);
  for (const [k, v] of Object.entries(cfg.cost?.ktokens || {})) positive(`cost.ktokens.${k}`, v);
  return problems;
}

export function loadValid(cwd = process.cwd()) {
  const { cfg } = loadConfig(cwd);
  const problems = validate(cfg);
  if (problems.length) throw new NexusError(`invalid config:\n  ${problems.join("\n  ")}`);
  return cfg;
}

export function statusLine(cfg) {
  const r = resolve(cfg);
  if (r.profile === "off") return "Nexus profile: off — disabled. Behave as default Claude Code; do not route to nexus-* agents.";
  const pins = Object.entries(r.roles).map(([k, v]) => `${k.replace("nexus-", "")}=${v.model}/${v.effort}`).join(" ");
  return `Nexus profile: ${r.profile}${r.adaptive ? " (adaptive)" : " (fixed pins)"} — ${pins}`;
}
