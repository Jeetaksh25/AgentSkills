import fs from "node:fs";
import path from "node:path";
import { NexusError, homeDir } from "./config.mjs";
import { costModel, unitCost } from "./cost.mjs";

export const VERDICTS = ["clean", "fixes", "blocked", "escalated", "wasted"];
export const ledgerPath = () => path.join(homeDir(), ".claude", "nexus-ledger.jsonl");

export function addEntry(raw) {
  const role = String(raw.role || "").replace(/^nexus-/, "");
  if (!role) throw new NexusError("ledger add needs --role");
  const verdict = raw.verdict || "clean";
  if (!VERDICTS.includes(verdict)) throw new NexusError(`verdict must be one of ${VERDICTS.join("|")}`);
  const entry = {
    at: new Date().toISOString(),
    role,
    model: raw.model || null,
    effort: raw.effort || null,
    tokens: raw.tokens ? Number(raw.tokens) : null,
    ms: raw.ms ? Number(raw.ms) : null,
    verdict,
    note: raw.note ? String(raw.note).slice(0, 200) : "",
    project: path.basename(process.cwd()),
  };
  fs.mkdirSync(path.dirname(ledgerPath()), { recursive: true });
  fs.appendFileSync(ledgerPath(), `${JSON.stringify(entry)}\n`);
  return entry;
}

export function readEntries() {
  if (!fs.existsSync(ledgerPath())) return [];
  const out = [];
  for (const line of fs.readFileSync(ledgerPath(), "utf8").split(/\r?\n/)) {
    if (!line.trim()) continue;
    try {
      out.push(JSON.parse(line));
    } catch {
      /* a torn line is skipped, never fatal */
    }
  }
  return out;
}

export function summarize(entries, { days, project } = {}, cfg = {}) {
  const cutoff = days ? Date.now() - days * 864e5 : 0;
  const rows = entries.filter((e) => (!cutoff || Date.parse(e.at) >= cutoff) && (!project || e.project === project));
  const cm = costModel(cfg);
  const byRole = {};
  for (const e of rows) {
    const r = (byRole[e.role] ||= { n: 0, clean: 0, fixes: 0, blocked: 0, escalated: 0, wasted: 0, tokens: 0, withTokens: 0, ms: 0, withMs: 0, units: 0 });
    r.n++;
    r[e.verdict] = (r[e.verdict] || 0) + 1;
    if (e.tokens) { r.tokens += e.tokens; r.withTokens++; }
    if (e.ms) { r.ms += e.ms; r.withMs++; }
    if (e.model && e.effort && e.tokens) r.units += unitCost(e.model, e.effort, e.tokens / 1000, cm);
  }
  const advice = [];
  for (const [role, r] of Object.entries(byRole)) {
    const cleanRate = r.clean / r.n;
    if (r.n >= 3 && cleanRate < 0.5) advice.push(`${role}: only ${Math.round(cleanRate * 100)}% of ${r.n} delegations were clean first time. Tighten the brief, add a lesson for the recurring defect, or raise its effort.`);
    if (r.blocked >= 2) advice.push(`${role}: ${r.blocked} delegations were blocked by the environment. Run \`nexus.mjs preflight\` before fanning out and stage the work in waves.`);
    const planned = cm.ktokens[role];
    if (r.withTokens >= 3 && planned && r.tokens / r.withTokens > planned * 1000 * 1.5) advice.push(`${role}: averages ${Math.round(r.tokens / r.withTokens / 1000)}k tokens against a ${planned}k plan. Narrow the scope or hand it exact file paths so it does not rediscover them.`);
    if (r.n >= 3 && r.wasted / r.n >= 0.3) advice.push(`${role}: ${Math.round((r.wasted / r.n) * 100)}% of delegations were wasted. Do that work inline or merge it into a neighbouring unit.`);
  }
  return { total: rows.length, byRole, advice };
}

export function formatSummary(s) {
  if (!s.total) return "No delegations recorded yet. Log each one with: nexus.mjs ledger add --role builder --model sonnet --effort medium --tokens 90000 --verdict clean";
  const out = ["role         n  clean fixes blocked esc wasted  avg-ktok  avg-sec  units"];
  for (const [role, r] of Object.entries(s.byRole).sort()) {
    const ktok = r.withTokens ? Math.round(r.tokens / r.withTokens / 1000) : "-";
    const sec = r.withMs ? Math.round(r.ms / r.withMs / 1000) : "-";
    out.push(`${role.padEnd(12)} ${String(r.n).padStart(2)}  ${String(r.clean).padStart(5)} ${String(r.fixes).padStart(5)} ${String(r.blocked).padStart(7)} ${String(r.escalated).padStart(3)} ${String(r.wasted).padStart(6)}  ${String(ktok).padStart(8)} ${String(sec).padStart(8)} ${String(r.units).padStart(6)}`);
  }
  out.push("");
  out.push(s.advice.length ? s.advice.map((a) => `advice: ${a}`).join("\n") : "advice: nothing to change yet.");
  return out.join("\n");
}
