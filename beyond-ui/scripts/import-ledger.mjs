#!/usr/bin/env node
/**
 * beyond-ui import ledger — "IMPORT, don't reinvent" made mechanically checkable.
 *
 *   node scripts/import-ledger.mjs plan   [projectDir]   # derive the import ledger from PLAN.json
 *   node scripts/import-ledger.mjs audit  [projectDir]   # prove every planned block was IMPORTED; scan for hand-rolled UI
 *   node scripts/import-ledger.mjs status [projectDir]   # human-readable report
 *
 * WHY: agents routinely write a hero, a marquee or a dialog from scratch while the registry that
 * ships it sits uninstalled. The plan (scripts/plan.mjs) already names every block with an exact
 * install command; this ledger (a) records those planned imports, (b) verifies each one actually
 * landed as a file that is imported by real source, and (c) flags raw hand-rolled controls
 * (`<button>`, `<input>`, `<dialog>`, custom tooltips/toasts...) outside `components/ui`.
 *
 * Escape hatch, used sparingly and audited: put `beyond-ui:custom <reason>` in a comment directly
 * above the hand-written element, or record it in state.json -> components.handWritten with a
 * reason. Anything else is a defect and fails the audit (verify-run G13).
 *
 * Output: .beyond-ui/import-ledger.json + .beyond-ui/import-audit.json (both read by G13).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const cmd = args[0] || "status";
const projectDir = path.resolve(args.slice(1).find((a) => !a.startsWith("--") && fs.existsSync(a)) || process.cwd());

const beyondDir = path.join(projectDir, ".beyond-ui");
const ledgerPath = path.join(beyondDir, "import-ledger.json");
const auditPath = path.join(beyondDir, "import-audit.json");
const planPath = path.join(beyondDir, "PLAN.json");
const statePath = path.join(beyondDir, "state.json");

const log = (...a) => console.log(...a);
const readJson = (p, d = null) => { try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return d; } };
const writeJson = (p, v) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n"); };

// source dirs/files to scan; everything else is build output or vendored
const SRC_DIRS = ["app", "src", "components", "pages", "lib", "routes", "views", "ui", "widgets", "layouts"];
const SKIP = /node_modules|\.next|\.nuxt|\.svelte-kit|dist|build|out|coverage|\.beyond-ui|\.agents|\.git|public|assets[\/\\]static/;
const EXT = /\.(tsx|jsx|vue|svelte|ts|js)$/;
// controls shadcn/ui ships — writing these by hand is a defect (non-negotiable #4)
const DENY_RAW = ["button", "input", "select", "textarea", "dialog", "checkbox", "radio", "switch", "slider", "progress", "accordion", "tabs", "tooltip", "toast", "popover", "dropdown", "navigation", "sheet", "menubar", "command", "combobox"];
const UI_DIR_HINT = /[\/\\]components[\/\\]ui[\/\\]/;

function walkSource(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (SKIP.test(p.replace(/\\/g, "/"))) continue;
    if (e.isDirectory()) walkSource(p, out);
    else if (EXT.test(e.name)) out.push(p);
  }
  return out;
}

function sourceFiles() {
  const found = [];
  for (const d of SRC_DIRS) walkSource(path.join(projectDir, d), found);
  return found;
}

const pascal = (s) => String(s).split(/[-_ ]/).map((x) => x.charAt(0).toUpperCase() + x.slice(1)).join("");
const kebab = (s) => String(s).replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

// ---------------------------------------------------------------------------- plan
function planLedger() {
  const plan = readJson(planPath);
  if (!plan) { log("import-ledger plan: .beyond-ui/PLAN.json missing — run `node scripts/plan.mjs` first"); process.exit(1); }
  const entries = [];
  const add = (e) => { if (!entries.some((x) => x.item === e.item && x.section === e.section)) entries.push(e); };

  for (const item of plan.primitives?.items || []) {
    add({ kind: "shadcn-primitives", section: "primitives", namespace: "shadcn/ui", item, command: plan.primitives.command, status: "planned", files: [], importedIn: [] });
  }
  for (const s of plan.sections || []) {
    for (const src of s.sources || []) {
      const kind = src.kind === "shadcn-primitives" ? "shadcn-primitives" : src.kind === "npm" ? "npm" : "shadcn-registry";
      if (kind === "shadcn-primitives") {
        for (const item of src.items || []) add({ kind, section: s.id, namespace: "shadcn/ui", item, command: src.command, status: "planned", files: [], importedIn: [] });
      } else {
        add({ kind, section: s.id, namespace: src.namespace || "", item: src.item || src.install, command: src.command || src.install, status: "planned", files: [], importedIn: [] });
      }
    }
    if (s.primary && !s.sources?.length) {
      add({ kind: s.primary.kind === "npm" ? "npm" : "shadcn-registry", section: s.id, namespace: s.primary.namespace || "", item: s.primary.item, command: s.primary.command || s.primary.install, status: "planned", files: [], importedIn: [] });
    }
  }
  writeJson(ledgerPath, { generatedFrom: ".beyond-ui/PLAN.json", at: new Date().toISOString(), entries });
  log(`import-ledger plan -> ${path.relative(projectDir, ledgerPath)}  (${entries.length} planned imports)`);
  entries.forEach((e) => log(`  [${e.kind}] ${e.namespace ? e.namespace + "/" : ""}${e.item}  <- ${e.section}`));
}

// ---------------------------------------------------------------------------- audit
function audit() {
  const ledger = readJson(ledgerPath);
  const state = readJson(statePath, {});
  const files = sourceFiles();
  const fileText = new Map(files.map((f) => [f, fs.readFileSync(f, "utf8")]));

  // 1. coverage: planned imports landed as files AND are referenced by real source
  const entries = ledger?.entries || [];
  for (const e of entries) {
    const kebabItem = kebab(e.item);
    const candidates = [kebabItem, pascal(e.item), String(e.item).replace(/[^a-z0-9]/gi, "").toLowerCase()];
    e.files = files.filter((f) => candidates.some((c) => c && f.replace(/\\/g, "/").toLowerCase().includes(c.toLowerCase()))).map((f) => path.relative(projectDir, f).replace(/\\/g, "/"));
    e.importedIn = files.filter((f) => {
      const t = fileText.get(f) || "";
      return candidates.some((c) => c && new RegExp(`(import|from|require)[^\\n]*${c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i").test(t))
        || candidates.some((c) => c && new RegExp(`<${pascal(e.item)}[\\s/>]`, "i").test(t));
    }).map((f) => path.relative(projectDir, f).replace(/\\/g, "/"));
    e.status = e.files.length === 0 ? "missing" : e.importedIn.length === 0 ? "installed-unused" : "imported";
  }

  // 2. raw hand-rolled controls outside components/ui
  const rawViolations = [];
  for (const [f, t] of fileText) {
    const rel = path.relative(projectDir, f).replace(/\\/g, "/");
    if (UI_DIR_HINT.test(rel)) continue;
    const lines = t.split("\n");
    lines.forEach((line, i) => {
      for (const tag of DENY_RAW) {
        const m = line.match(new RegExp(`<${tag}[\\s/>]`, "i"));
        if (!m) continue;
        // a `beyond-ui:custom <reason>` comment on the same line or within the 3 lines above exempts it
        const context = lines.slice(Math.max(0, i - 3), i + 1).join("\n");
        if (/beyond-ui:custom/.test(context)) continue; // documented bespoke element
        rawViolations.push({ file: rel, line: i + 1, element: tag, snippet: line.trim().slice(0, 120) });
      }
    });
  }

  // 3. hand-written components must carry a reason
  const handWritten = state?.components?.handWritten || [];
  const unreasoned = handWritten.filter((h) => !h.reason);

  // 4. registry/shadcn installs recorded in state must exist
  const recorded = [...(state?.components?.shadcn || []).map((x) => ({ item: String(x), kind: "shadcn-primitives" })), ...(state?.components?.registry || [])];
  const recordedMissing = recorded.filter((r) => {
    const c = kebab(r.item || r.element || "");
    return c && !files.some((f) => f.replace(/\\/g, "/").toLowerCase().includes(c.toLowerCase()));
  });

  const missing = entries.filter((e) => e.status === "missing");
  const unused = entries.filter((e) => e.status === "installed-unused");
  const imported = entries.filter((e) => e.status === "imported");

  const report = {
    at: new Date().toISOString(),
    scannedFiles: files.length,
    planned: entries.length,
    imported: imported.length,
    missing: missing.map((e) => ({ item: e.item, section: e.section, command: e.command })),
    installedUnused: unused.map((e) => e.item),
    rawViolations: rawViolations.slice(0, 40),
    handWrittenUnreasoned: unreasoned,
    recordedMissing: recordedMissing.map((r) => r.item || r.element),
    pass: missing.length === 0 && rawViolations.length === 0 && unreasoned.length === 0 && entries.length > 0,
  };
  writeJson(auditPath, report);

  log(`import-ledger audit — ${files.length} source files scanned`);
  log(`  planned imports: ${report.planned}   imported: ${report.imported}   missing: ${report.missing.length}   installed-unused: ${report.installedUnused.length}`);
  if (report.missing.length) report.missing.forEach((m) => log(`  MISSING   ${m.item} (${m.section}) — run: ${m.command}`));
  if (report.installedUnused.length) log(`  UNUSED    ${report.installedUnused.join(", ")} — import it where the plan says, or prune it`);
  if (report.rawViolations.length) report.rawViolations.forEach((v) => log(`  RAW       ${v.file}:${v.line} <${v.element}> — import from shadcn/registry or mark \`beyond-ui:custom <reason>\``));
  if (report.handWrittenUnreasoned.length) log(`  UNREASONED hand-written components: ${report.handWrittenUnreasoned.map((h) => h.element).join(", ")}`);
  log(report.pass ? "\nimport-ledger: PASS — every planned block imported, no unmarked hand-rolled controls" : "\nimport-ledger: FAIL — fix the items above (G13 reads import-audit.json)");
  if (!report.pass) process.exit(1);
}

function status() {
  const ledger = readJson(ledgerPath);
  const auditR = readJson(auditPath);
  log(`import ledger — ${projectDir}`);
  if (ledger) {
    const byStatus = {};
    for (const e of ledger.entries) byStatus[e.status || "planned"] = (byStatus[e.status || "planned"] || 0) + 1;
    log(`  entries: ${ledger.entries.length}  ${JSON.stringify(byStatus)}`);
    ledger.entries.slice(0, 20).forEach((e) => log(`    [${e.status || "planned"}] ${e.namespace ? e.namespace + "/" : ""}${e.item}`));
  } else log("  (no ledger — run `plan` after scripts/plan.mjs)");
  if (auditR) log(`  last audit: ${auditR.pass ? "PASS" : "FAIL"} at ${auditR.at} (${auditR.imported}/${auditR.planned} imported, ${auditR.rawViolations.length} raw violations)`);
}

if (cmd === "plan") planLedger();
else if (cmd === "audit") audit();
else if (cmd === "status") status();
else { log(`unknown command '${cmd}' — plan | audit | status`); process.exit(1); }
