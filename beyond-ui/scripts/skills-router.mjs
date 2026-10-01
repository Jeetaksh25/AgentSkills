#!/usr/bin/env node
/**
 * beyond-ui skills router — deterministic upstream-skill selection and enforcement.
 *
 *   node scripts/skills-router.mjs detect [projectDir]      -> .beyond-ui/project-profile.json (stack/surface detection)
 *   node scripts/skills-router.mjs select  [projectDir]     -> picks exactly 5 pool skills + the 5 permanent = 10
 *                                                             (.beyond-ui/active-skills.json) and installs ONLY those
 *   node scripts/skills-router.mjs install [projectDir]     -> install the 10 selected skills (idempotent, skip-if-present)
 *   node scripts/skills-router.mjs digest  [projectDir]     -> .beyond-ui/SKILL.md: the condensed per-project skill
 *                                                             (rules extracted from the 10 installed SKILL.md files)
 *   node scripts/skills-router.mjs prune   [projectDir]     -> remove beyond-ui-installed skills that are not active
 *   node scripts/skills-router.mjs verify  [projectDir]     -> assert 5 permanent + 5 selected + citations per skill; exit 1 otherwise
 *   node scripts/skills-router.mjs status  [projectDir]     -> human-readable report
 *
 * WHY THIS EXISTS: the old bootstrap installed every skill in the catalogue (~33 folders) and agents
 * then used none of them. This router makes skill use (a) DETERMINISTIC — the same project profile
 * always yields the same 10 skills, scored from assets/skills-catalog.json, ties broken by stars then
 * id, and (b) MECHANICALLY PROVABLE — `digest` writes the rules the agent must follow into
 * .beyond-ui/SKILL.md with per-skill provenance, and `verify` fails unless every active skill is
 * cited at least once in state.json -> ruleCitations.
 *
 * The 5+5 split is a hard contract (catalog.selection): 5 permanent top-star design skills + 5
 * routed for THIS project. `verify` also asserts the reference count is 5, not 10 — the other
 * half of the waste this replaces.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const cmd = args[0] || "status";
// first non-flag argument after the command names the project directory (default: cwd)
const dirArg = args.slice(1).find((a) => !a.startsWith("--"));
const projectDir = path.resolve(dirArg && fs.existsSync(dirArg) ? dirArg : process.cwd());

const catalog = JSON.parse(fs.readFileSync(path.join(skillRoot, "assets", "skills-catalog.json"), "utf8"));
const beyondDir = path.join(projectDir, ".beyond-ui");
const profilePath = path.join(beyondDir, "project-profile.json");
const activePath = path.join(beyondDir, "active-skills.json");
const statePath = path.join(beyondDir, "state.json");
const digestPath = path.join(beyondDir, "SKILL.md");
const designSkillPath = path.join(beyondDir, "DESIGN-SKILL.md");
const scoutPath = path.join(beyondDir, "scout.md");
const planPath = path.join(beyondDir, "PLAN.json");
const blockMapPath = path.join(beyondDir, "BLOCK-MAP.md");
const sectionPlanPath = path.join(beyondDir, "SECTION-PLAN.md");

const log = (...a) => console.log(...a);
const readJson = (p, d = null) => { try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return d; } };
const writeJson = (p, v) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n"); };
const run = (c, a, o = {}) => execFileSync(c, a, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], shell: process.platform === "win32", timeout: 600000, ...o });

const skillsDir = process.env.BEYOND_UI_SKILLS_DIR
  ? path.resolve(process.env.BEYOND_UI_SKILLS_DIR)
  : path.join(projectDir, ".agents", "skills");

// ---------------------------------------------------------------------------- detect
function detect() {
  const profile = {
    name: path.basename(projectDir),
    framework: "", frameworkVersion: "", tailwind: "", motionLib: "", rn: false, ts: false,
    surface: ["web"], concern: [], stack: [],
    detectedAt: new Date().toISOString(),
  };
  const pkg = readJson(path.join(projectDir, "package.json"), null);
  const dev = { ...(pkg?.dependencies || {}), ...(pkg?.devDependencies || {}) };
  if (pkg) {
    profile.ts = !!dev.typescript || fs.existsSync(path.join(projectDir, "tsconfig.json"));
    if (dev.next) { profile.framework = "next"; profile.frameworkVersion = dev.next; profile.stack.push("react", "next"); }
    else if (dev["@sveltejs/kit"]) { profile.framework = "sveltekit"; profile.frameworkVersion = dev["@sveltejs/kit"]; profile.stack.push("svelte"); }
    else if (dev.nuxt || dev.vue) { profile.framework = dev.nuxt ? "nuxt" : "vue"; profile.stack.push("vue"); }
    else if (dev.astro) { profile.framework = "astro"; profile.frameworkVersion = dev.astro; profile.stack.push("astro"); }
    else if (dev.vite) { profile.framework = "vite"; profile.frameworkVersion = dev.vite; if (dev.react) profile.stack.push("react"); }
    else if (dev.react) { profile.framework = "react"; profile.stack.push("react"); }
    if (dev.react && !profile.stack.includes("react")) profile.stack.push("react");
    if (dev["react-native"] || dev.expo) { profile.rn = true; profile.framework = profile.framework || (dev.expo ? "expo" : "react-native"); profile.stack.push("react-native"); if (dev.expo) profile.stack.push("expo"); }
    if (dev.tailwindcss) profile.tailwind = dev.tailwindcss.replace(/^[\^~]/, "");
    if (dev.motion || dev["framer-motion"]) profile.motionLib = dev.motion ? "motion" : "framer-motion";
    else if (dev.gsap) profile.motionLib = "gsap";
    else if (dev["animejs"]) profile.motionLib = "anime";
  }
  if (fs.existsSync(path.join(projectDir, "components.json"))) profile.stack.push("shadcn");
  if (fs.existsSync(path.join(projectDir, "app"))) profile.stack.push("app-router");
  // surface hints from folder names / manifest files
  const entries = fs.existsSync(projectDir) ? fs.readdirSync(projectDir, { withFileTypes: true }) : [];
  const dirNames = entries.filter((e) => e.isDirectory()).map((e) => e.name.toLowerCase());
  if (profile.rn) { profile.surface = ["mobile", "mobile-app"]; profile.concern.push("mobile"); }
  if (dirNames.some((d) => ["app", "packages", "src"].includes(d)) && (dev.next || dev["react-router-dom"])) profile.surface.push("app");
  if (readJson(path.join(projectDir, "electron-builder.yml")) || dev.electron || dev["@tauri-apps/cli"] || dev.tauri) {
    profile.surface.push("desktop"); profile.concern.push("desktop");
  }
  if (readJson(path.join(projectDir, "package.json"), {})?.name) profile.name = readJson(path.join(projectDir, "package.json")).name;
  // concern hints from dependencies
  if (dev["@tanstack/react-table"] || dev["ag-grid-community"]) profile.concern.push("dense-ui");
  if (dev.recharts || dev["@tremor/react"] || dev["chart.js"] || dev["d3"]) profile.concern.push("data-viz");
  if (dev["react-hook-form"] || dev.zod) profile.concern.push("forms");
  if (dev.three || dev["@react-three/fiber"]) profile.concern.push("3d");
  if (dev["framer-motion"] || dev.motion || dev.gsap) profile.concern.push("motion");
  profile.concern.push("anti-slop", "quality", "craft");
  profile.stack = [...new Set(profile.stack)];
  profile.concern = [...new Set(profile.concern)];
  writeJson(profilePath, profile);
  log(`detect -> ${path.relative(projectDir, profilePath)}`);
  log(`  framework=${profile.framework} tailwind=${profile.tailwind || "none"} motion=${profile.motionLib || "none"} surface=[${profile.surface}] stack=[${profile.stack}] concern=[${profile.concern}]`);
  return profile;
}

// ---------------------------------------------------------------------------- select
const norm = (s) => String(s || "").toLowerCase().trim();
const overlap = (a, b) => { const B = new Set((b || []).map(norm)); return (a || []).filter((x) => B.has(norm(x))).length; };

function scoreUnit(unit, profile) {
  const t = unit.tags || { surface: [], stack: [], concern: [] };
  const sSurf = overlap(t.surface, profile.surface);
  const sStack = overlap(t.stack, profile.stack);
  const sConc = overlap(t.concern, profile.concern);
  const total = 2 * sSurf + 2 * sStack + 3 * sConc + (sSurf + sStack + sConc > 0 ? 1 : 0);
  return { total, sSurf, sStack, sConc };
}

function select() {
  const profile = readJson(profilePath) || detect();
  const want = catalog.selection.poolCount;
  const scored = catalog.pool.map((u) => ({ unit: u, ...scoreUnit(u, profile) }));
  scored.sort((a, b) => (b.total - a.total) || (b.unit.starCount - a.unit.starCount) || (a.unit.id < b.unit.id ? -1 : 1));
  const chosen = scored.slice(0, want);
  const active = {
    profile: { name: profile.name, framework: profile.framework, surface: profile.surface, concern: profile.concern },
    permanent: catalog.permanent.map((p) => ({ id: p.id, label: p.label, repo: p.repo, starCount: p.starCount, use: p.use, install: p.install })),
    selected: chosen.map((c) => ({ id: c.unit.id, label: c.unit.label, repo: c.unit.repo, starCount: c.unit.starCount, score: c.total, why: `surface ${c.sSurf} · stack ${c.sStack} · concern ${c.sConc}`, use: c.unit.use, install: c.unit.install })),
    total: catalog.permanent.length + chosen.length,
    referenceTarget: 5,
    selectedAt: new Date().toISOString(),
  };
  writeJson(activePath, active);
  log(`select -> ${path.relative(projectDir, activePath)}  (${active.permanent.length} permanent + ${active.selected.length} selected = ${active.total} skills)`);
  active.permanent.concat(active.selected).forEach((s, i) => log(`  ${String(i + 1).padStart(2)}. ${s.id.padEnd(28)} ★${String(s.starCount).padStart(6)}  score=${s.score ?? "permanent"}`));
  log(`\n  rejected pool (installed only on demand):`);
  scored.slice(want).forEach((c) => log(`    - ${c.unit.id.padEnd(28)} ★${String(c.unit.starCount).padStart(6)}  score=${c.total}`));
  const state = readJson(statePath);
  if (state) {
    state.skills = {
      ...(state.skills || {}),
      router: "assets/skills-catalog.json",
      permanent: active.permanent.map((s) => s.id),
      selected: active.selected.map((s) => s.id),
      total: active.total,
    };
    writeJson(statePath, state);
  }
  return active;
}

// ---------------------------------------------------------------------------- install
function cloneInstall(entry) {
  const { repo, paths, alt } = entry;
  const pending = Object.entries(paths).filter(([, dest]) => !fs.existsSync(path.join(skillsDir, dest, "SKILL.md")));
  if (pending.length === 0) return { ok: true, installed: Object.keys(paths).length, skipped: true };
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "beyond-ui-"));
  try {
    run("git", ["clone", "--depth", "1", repo, path.join(tmp, "repo")]);
    fs.mkdirSync(skillsDir, { recursive: true });
    for (const [rel, dest] of pending) {
      const src = path.join(tmp, "repo", rel);
      if (!fs.existsSync(path.join(src, "SKILL.md"))) return { ok: false, error: `expected skill at "${rel}" in ${repo}` };
      fs.rmSync(path.join(skillsDir, dest), { recursive: true, force: true });
      fs.cpSync(src, path.join(skillsDir, dest), { recursive: true });
    }
    return { ok: true, installed: pending.length };
  } catch (e) {
    return { ok: false, error: String(e.stderr || e.message).split("\n")[0], alt };
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
}

function cliInstall(entry) {
  const skills = entry.install.skills || [entry.install.skill];
  try {
    run("npx", ["-y", "skills", "add", entry.install.repo, "-a", "universal", ...skills.flatMap((s) => ["--skill", s]), "-y"]);
    return { ok: true, installed: skills.length };
  } catch (e) {
    return { ok: false, error: String(e.stderr || e.message).split("\n")[0] };
  }
}

function install() {
  const active = readJson(activePath) || select();
  const units = [...catalog.permanent, ...catalog.pool];
  const failures = [];
  const installedBy = [];
  log(`install -> ${skillsDir.replace(projectDir, ".")}  (${active.permanent.length + active.selected.length} skills, nothing else)`);
  for (const ref of [...active.permanent, ...active.selected]) {
    const unit = units.find((u) => u.id === ref.id);
    if (!unit) { failures.push(`${ref.id} — not in catalog`); continue; }
    const inst = unit.install;
    const res = inst.type === "clone" ? cloneInstall(inst) : cliInstall(unit);
    if (res.ok) { log(`  OK   ${unit.id}${res.skipped ? " (already present)" : ""}`); installedBy.push(unit.id); }
    else { log(`  FAIL ${unit.id}: ${res.error}${res.alt ? ` (try: ${res.alt})` : ""}`); failures.push(`${unit.id} — ${res.error}`); }
  }
  const state = readJson(statePath);
  if (state) {
    state.skills = { ...(state.skills || {}), installed: [...new Set([...(state.skills?.installed || []), ...installedBy])], installedByBeyondUi: [...new Set([...(state.skills?.installedByBeyondUi || []), ...installedBy])], missing: failures.map((f) => ({ name: f.split(" — ")[0], reason: f, readInstead: `https://raw.githubusercontent.com/${(units.find((u) => u.id === f.split(" — ")[0])?.repo || "")}/HEAD/SKILL.md` })) };
    writeJson(statePath, state);
  }
  if (failures.length) { log(`\n${failures.length} FAILED — fetch the raw SKILL.md and read it instead, record in state.json -> skills.missing`); process.exit(1); }
  log(`\n  all ${active.permanent.length + active.selected.length} active skills present.`);
}

// ---------------------------------------------------------------------------- digest
const FENCE = /^```/;
function stripFences(md) {
  const out = []; let inFence = false;
  for (const line of md.split("\n")) { if (FENCE.test(line)) { inFence = !inFence; continue; } if (!inFence) out.push(line); }
  return out.join("\n");
}

function extractRules(unit) {
  const inst = unit.install;
  const dests = inst.type === "clone" ? Object.values(inst.paths) : (inst.skills || [inst.skill]);
  const patterns = (unit.rulePatterns || ["^.*\\b(must|never|always|avoid|don't|Do not)\\b.*$"]).map((p) => new RegExp(p, "i"));
  const rules = [];
  for (const dest of dests) {
    const file = path.join(skillsDir, dest, "SKILL.md");
    if (!fs.existsSync(file)) continue;
    const body = stripFences(fs.readFileSync(file, "utf8"));
    for (const raw of body.split("\n")) {
      const line = raw.trim().replace(/^[-*]\s+/, "").replace(/^\d+[.)]\s+/, "");
      if (line.length < 25 || line.length > 220) continue;
      if (/^#/.test(line) || /^\|/.test(line)) continue;
      if (patterns.some((re) => re.test(line))) rules.push(line);
      if (rules.length >= 14) break;
    }
    if (rules.length >= 14) break;
  }
  return [...new Set(rules)].slice(0, 12);
}

function digest() {
  const active = readJson(activePath);
  if (!active) { log("digest: run 'select' first"); process.exit(1); }
  const units = [...catalog.permanent, ...catalog.pool];
  const all = [...active.permanent, ...active.selected];
  const designSkill = fs.existsSync(designSkillPath) ? fs.readFileSync(designSkillPath, "utf8") : "";
  const blockMap = fs.existsSync(blockMapPath) ? fs.readFileSync(blockMapPath, "utf8") : "";
  const sectionPlan = fs.existsSync(sectionPlanPath) ? fs.readFileSync(sectionPlanPath, "utf8") : "";
  const plan = readJson(planPath, null);

  const byPhase = new Map();
  for (const ref of all) {
    const unit = units.find((u) => u.id === ref.id) || ref;
    for (const ph of unit.phases || ["build"]) {
      if (!byPhase.has(ph)) byPhase.set(ph, []);
      byPhase.get(ph).push(ref.id);
    }
  }

  const lines = [];
  lines.push("---");
  lines.push(`name: ${active.profile?.name || "project"}-design`);
  lines.push(`description: The condensed, per-project design skill generated by beyond-ui. Rules hand-picked from exactly ${all.length} upstream skills (${active.permanent.length} permanent + ${active.selected.length} selected). Read this BEFORE building UI in this project; it is the single source of the rules this build must satisfy.`);
  lines.push("license: MIT");
  lines.push("---");
  lines.push("");
  lines.push(`# ${active.profile?.name || "Project"} — design skill (beyond-ui synthesis)`);
  lines.push("");
  lines.push(`Generated ${new Date().toISOString().slice(0, 10)} from ${all.length} upstream skills and ${designSkill ? "the teardown synthesis" : "no teardown synthesis yet"}. **Everything below is extracted from real upstream rules or this run's evidence. Nothing here is decoration: if a rule is listed, the build is checked against it.**`);
  lines.push("");
  lines.push("## 0. Roster — the only skills in play (5 permanent + 5 selected)");
  lines.push("");
  lines.push("| # | Skill | ★ | Role | When it binds |");
  lines.push("|---|---|---|---|---|");
  all.forEach((s, i) => { const u = units.find((x) => x.id === s.id) || s; lines.push(`| ${i + 1} | \`${s.id}\` | ${s.starCount} | ${i < active.permanent.length ? "permanent" : "selected"} | ${(u.use || "").split(":")[0]} |`); });
  lines.push("");
  lines.push(`Reference sites for this project: **exactly ${active.referenceTarget}** (not 10). Skills installed: **exactly ${all.length}** (not 33). \`node scripts/skills-router.mjs verify\` fails the run otherwise.`);
  lines.push("");
  for (const ref of all) {
    const u = units.find((x) => x.id === ref.id) || ref;
    lines.push(`## ${ref.id}`);
    lines.push("");
    lines.push(`**Source:** ${u.repo} ★${u.starCount}${u.install?.type === "clone" ? ` (clone: \`${u.install.repo}\`)` : ` (\`npx skills add ${u.install.repo} --skill ${u.install.skill || (u.install.skills || []).join(" --skill ")}\`)`}`);
    lines.push("");
    lines.push(`**Use it for:** ${u.use}`);
    lines.push("");
    const rules = extractRules(u);
    if (rules.length) {
      lines.push("**Binding rules (extracted from the installed SKILL.md):**");
      lines.push("");
      for (const r of rules) lines.push(`- ${r}`);
    } else {
      lines.push("_No static rule lines extracted (skill is prose/checklist-shaped). Follow the skill's own checklist at the phases above._");
    }
    lines.push("");
    lines.push(`> Cite as \`skill://${ref.id} -> <rule>\` in \`.beyond-ui/state.json -> ruleCitations\` when it changes a decision.`);
    lines.push("");
  }
  lines.push("## Phase → skill routing (use the right skill at the right moment)");
  lines.push("");
  lines.push("| Phase | Skills to actually apply |");
  lines.push("|---|---|");
  for (const [ph, ids] of byPhase) lines.push(`| ${ph} | ${ids.map((i) => `\`${i}\``).join(", ")} |`);
  lines.push("");
  if (designSkill) {
    lines.push("## Project direction + evidence (from the 5-reference teardown)");
    lines.push("");
    lines.push(designSkill.split("\n").slice(0, 120).join("\n"));
    lines.push("");
    lines.push("…full evidence and per-site deep-dives: `.beyond-ui/DESIGN-SKILL.md`.");
    lines.push("");
  }
  if (sectionPlan && blockMap) {
    lines.push("## Build sheet — the hand-picked blocks (import these, do not reinvent)");
    lines.push("");
    lines.push(sectionPlan);
    lines.push("");
    lines.push("### Import map");
    lines.push("");
    lines.push(blockMap);
    lines.push("");
    if (plan) lines.push(`_Archetype: ${plan.archetype?.key} · motion grammar: ${plan.motion?.grammar} · registries in play: ${(plan.registryDiscipline?.inPlay || []).join(", ") || "shadcn"}_`);
    lines.push("");
  }
  lines.push("## Hard floor");
  lines.push("");
  lines.push("- **Import, don't reinvent.** Base controls come from `npx shadcn@latest add …`; animated/effect components come from the registries in the build sheet. Hand-writing a button, dialog, marquee or text-effect that a registry ships is a defect.");
  lines.push("- **5 references, not 10. 10 skills, not 33.** Both numbers are enforced.");
  lines.push("- **Every load-bearing decision cites its source** (`skill://<id> -> <rule>`, `DESIGN-SKILL.md §n`, or `teardown/<slug>`).");
  lines.push("- **Verify like a user.** Screenshots at 390/768/1440, keyboard pass, reduced-motion pass, console clean — then the QA journey through the real app (`node scripts/qa.mjs journey`).");
  lines.push("");
  fs.mkdirSync(beyondDir, { recursive: true });
  fs.writeFileSync(digestPath, lines.join("\n"));
  log(`digest -> ${path.relative(projectDir, digestPath)}  (${all.length} skills, ${lines.length} lines)`);
  const state = readJson(statePath);
  if (state) { state.skills = { ...(state.skills || {}), digest: ".beyond-ui/SKILL.md", digestSkills: all.map((s) => s.id) }; writeJson(statePath, state); }
}

// ---------------------------------------------------------------------------- prune
function prune() {
  const active = readJson(activePath);
  if (!active) { log("prune: run 'select' first"); return; }
  const keep = new Set();
  const units = [...catalog.permanent, ...catalog.pool];
  for (const ref of [...active.permanent, ...active.selected]) {
    const u = units.find((x) => x.id === ref.id);
    if (!u) continue;
    if (u.install.type === "clone") Object.values(u.install.paths).forEach((d) => keep.add(d));
    else (u.install.skills || [u.install.skill]).forEach((d) => keep.add(d));
  }
  const state = readJson(statePath);
  const byBeyond = new Set(state?.skills?.installedByBeyondUi || []);
  if (!fs.existsSync(skillsDir)) return;
  let removed = 0;
  for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;
    if (keep.has(name)) continue;
    if (!byBeyond.has(name) && !(state?.skills?.installed || []).includes(name)) continue; // never touch user-installed skills
    fs.rmSync(path.join(skillsDir, name), { recursive: true, force: true });
    log(`  pruned ${name}`);
    removed++;
  }
  log(`prune: removed ${removed} non-active skill folder(s); ${keep.size} active kept.`);
}

// ---------------------------------------------------------------------------- verify
function verify() {
  const active = readJson(activePath);
  const state = readJson(statePath);
  const problems = [];
  if (!active) problems.push("no .beyond-ui/active-skills.json — run `node scripts/skills-router.mjs select`");
  if (active) {
    if (active.permanent.length !== catalog.selection.permanentCount) problems.push(`permanent count ${active.permanent.length} != ${catalog.selection.permanentCount}`);
    if (active.selected.length !== catalog.selection.poolCount) problems.push(`selected count ${active.selected.length} != ${catalog.selection.poolCount} (must be 5, not 10)`);
    if (active.total !== catalog.selection.totalActive) problems.push(`total ${active.total} != ${catalog.selection.totalActive}`);
    // every active skill present on disk or documented as missing
    const missing = state?.skills?.missing || [];
    for (const ref of [...active.permanent, ...active.selected]) {
      const u = [...catalog.permanent, ...catalog.pool].find((x) => x.id === ref.id);
      const inst = u?.install;
      const dests = inst?.type === "clone" ? Object.values(inst.paths) : (inst?.skills || [inst?.skill]).filter(Boolean);
      const present = dests.some((d) => fs.existsSync(path.join(skillsDir, d, "SKILL.md")));
      const documented = missing.some((m) => m.name === ref.id && m.readInstead && /^https?:\/\//.test(m.readInstead));
      if (!present && !documented) problems.push(`skill ${ref.id} neither installed nor URL-documented`);
    }
    // per-skill citation coverage — the "actually used them" proof
    const citations = state?.ruleCitations || [];
    for (const ref of [...active.permanent, ...active.selected]) {
      const used = citations.some((c) => String(c.source || "").includes(`skill://${ref.id}`));
      if (!used) problems.push(`no rule citation from skill://${ref.id} — read it and cite a rule that changed a decision`);
    }
  }
  // the "5 not 10" reference assertion
  const sel = readJson(path.join(beyondDir, "references-selection.json"), { selected: [] });
  const refs = (sel.selected || state?.selection?.selected || []).length;
  if (refs > 5) problems.push(`references-selection has ${refs} selected — the target is 5, not 10`);
  const digestOk = fs.existsSync(digestPath);
  if (!digestOk) problems.push(".beyond-ui/SKILL.md (condensed project skill) missing — run `node scripts/skills-router.mjs digest`");

  if (problems.length) {
    log("skills-router verify: FAIL");
    problems.forEach((p) => log(`  - ${p}`));
    process.exit(1);
  }
  log(`skills-router verify: PASS — ${active.permanent.length} permanent + ${active.selected.length} selected = ${active.total} skills, ${refs} references, digest present, every skill cited.`);
}

function status() {
  const active = readJson(activePath);
  const state = readJson(statePath);
  log(`skills router status — ${projectDir}`);
  log(`  catalog: ${catalog.permanent.length} permanent + ${catalog.pool.length} pool units (stars verified ${catalog.starsVerified})`);
  if (active) {
    log(`  active:  ${active.permanent.length} permanent + ${active.selected.length} selected = ${active.total}`);
    [...active.permanent, ...active.selected].forEach((s) => log(`    - ${s.id} ★${s.starCount}${s.score !== undefined ? ` score=${s.score}` : ""}`));
    log(`  references target: ${active.referenceTarget}`);
  } else log("  active:  (not selected yet — run `select`)");
  if (state?.skills?.missing?.length) log(`  missing: ${state.skills.missing.map((m) => m.name).join(", ")}`);
  const citations = state?.ruleCitations || [];
  log(`  citations: ${citations.length}`);
}

if (cmd === "detect") detect();
else if (cmd === "select") select();
else if (cmd === "install") install();
else if (cmd === "digest") digest();
else if (cmd === "prune") prune();
else if (cmd === "verify") verify();
else if (cmd === "status") status();
else { log(`unknown command '${cmd}' — detect | select | install | digest | prune | verify | status`); process.exit(1); }
