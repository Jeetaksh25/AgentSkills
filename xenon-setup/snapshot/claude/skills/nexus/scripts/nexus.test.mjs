import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { SKILL_DIR, loadConfig, resolve, validate } from "./lib/config.mjs";
import { estimate } from "./lib/cost.mjs";
import { checkAgentSources, checkSkillBudget } from "./lib/health.mjs";
import { addEntry, ledgerPath, readEntries, summarize } from "./lib/ledger.mjs";
import { addLesson, listLessons, removeLesson, showLessons } from "./lib/lessons.mjs";
import { route } from "./lib/route.mjs";

const CLI = path.join(SKILL_DIR, "scripts", "nexus.mjs");
const home = fs.mkdtempSync(path.join(os.tmpdir(), "nexus-home-"));
const work = fs.mkdtempSync(path.join(os.tmpdir(), "nexus-work-"));
process.env.NEXUS_HOME = home;

const cfg = () => loadConfig(work).cfg;
const cli = (...args) => spawnSync(process.execPath, [CLI, ...args], { cwd: work, env: { ...process.env, NEXUS_HOME: home }, encoding: "utf8" });

test("shipped config is valid and defines every role in every profile", () => {
  const c = cfg();
  assert.deepEqual(validate(c), []);
  for (const profile of ["low", "medium", "high"]) assert.ok(c.profiles[profile].roles["nexus-qa"], `qa missing in ${profile}`);
  const auto = resolve(c);
  assert.equal(auto.adaptive, true);
  assert.equal(Object.keys(auto.roles).length, 11);
});

test("validate rejects fable, inherit, max, xhigh pins and bad numbers", () => {
  const bad = { profile: "auto", roles: { "nexus-builder": { model: "fable" } }, policy: { maxParallel: 0 }, profiles: { medium: { roles: { "nexus-scout": { model: "inherit", effort: "max" }, "nexus-drone": { model: "haiku", effort: "xhigh" } } } } };
  const problems = validate(bad).join("\n");
  assert.match(problems, /fable/);
  assert.match(problems, /inherit/);
  assert.match(problems, /max effort/);
  assert.match(problems, /xhigh/);
  assert.match(problems, /maxParallel/);
});

test("route: a bug in payment code flows through debugger and a mandatory sentinel pass", () => {
  const r = route("fix the flaky payment webhook test", cfg());
  assert.equal(r.primary, "debugger");
  const roles = r.steps.map((s) => s.role);
  assert.deepEqual(roles.slice(0, 2), ["runner", "debugger"]);
  assert.ok(roles.includes("sentinel"));
  assert.ok(r.steps.find((s) => s.role === "sentinel").effort === "high");
});

test("route: ambiguous wide work starts with scout and architect, and UI work adds qa", () => {
  const r = route("redesign the caching approach across all services", cfg());
  assert.deepEqual(r.steps.slice(0, 2).map((s) => s.role), ["scout", "architect"]);
  const ui = route("add a responsive pricing page layout", cfg());
  assert.ok(ui.steps.some((s) => s.role === "qa"));
});

test("route: tiny mechanical work is advised inline, and an off profile routes nowhere", () => {
  const r = route("rename getUser to fetchUser", cfg());
  assert.equal(r.inline, true);
  const off = route("anything", { ...cfg(), profile: "off" });
  assert.equal(off.off, true);
  assert.equal(off.steps.length, 0);
});

test("route: a pure lookup about security code needs no sentinel, and a large batch is not lowered", () => {
  const find = route("where is the session cookie set", cfg());
  assert.equal(find.primary, "scout");
  assert.ok(!find.steps.some((s) => s.role === "sentinel"));
  const batch = route("add 20 new visual themes to the gallery, each with its own stylesheet", cfg());
  const builder = batch.steps.find((s) => s.role === "builder");
  assert.equal(builder.effort, "high");
  assert.ok(batch.notes.some((n) => /waves/.test(n)));
});

test("route: adaptive profile raises a build with two high signals one model tier", () => {
  const r = route("implement a new framework integration across all packages", cfg());
  const builder = r.steps.find((s) => s.role === "builder");
  assert.equal(builder.model, "opus");
  assert.equal(builder.effort, "high");
});

test("estimate: sums relative cost and warns on fan-out and budget", () => {
  const e = estimate(["builder:4", "reviewer:4"], cfg());
  assert.equal(e.peak, 8);
  assert.ok(e.warnings.some((w) => /maxParallel/.test(w)));
  const small = estimate(["scout:1"], cfg());
  assert.equal(small.total, Math.round(1 * 1 * 30));
  assert.equal(small.warnings.length, 0);
  assert.throws(() => estimate(["nonsense!"], cfg()), /bad unit/);
  assert.throws(() => estimate(["wizard:1"], cfg()), /unknown role/);
});

test("lessons: add, dedupe, filter by role, merge scopes and remove", () => {
  assert.equal(addLesson("Word effects use transform and opacity only so headings do not re-wrap", { role: "builder", cwd: work }).added, true);
  assert.equal(addLesson("word effects use TRANSFORM and opacity only, so headings do not re-wrap!", { role: "builder", cwd: work }).added, false);
  addLesson("Every repeating tile must start and end at the same height", { global: true, cwd: work });
  assert.match(showLessons("builder", { cwd: work }), /transform and opacity/);
  assert.doesNotMatch(showLessons("tester", { cwd: work }), /transform and opacity/);
  assert.match(showLessons("tester", { cwd: work }), /repeating tile/);
  assert.equal(listLessons({ cwd: work }).length, 2);
  assert.throws(() => addLesson("too short", { cwd: work }), /sentence/);
  removeLesson(1, { global: true, cwd: work });
  assert.equal(listLessons({ cwd: work }).length, 1);
});

test("ledger: records, tolerates a torn line and turns patterns into advice", () => {
  for (let i = 0; i < 3; i++) addEntry({ role: "nexus-builder", model: "sonnet", effort: "medium", tokens: "200000", verdict: i === 0 ? "clean" : "fixes", note: "css" });
  addEntry({ role: "runner", verdict: "blocked", model: "haiku", effort: "low", tokens: 9000 });
  addEntry({ role: "runner", verdict: "blocked", model: "haiku", effort: "low", tokens: 9000 });
  fs.appendFileSync(ledgerPath(), "{not json\n");
  assert.equal(readEntries().length, 5);
  const s = summarize(readEntries(), {}, cfg());
  assert.equal(s.byRole.builder.n, 3);
  const advice = s.advice.join("\n");
  assert.match(advice, /builder: only 33%/);
  assert.match(advice, /builder: averages 200k tokens against a 90k plan/);
  assert.match(advice, /runner: 2 delegations were blocked/);
  assert.throws(() => addEntry({ role: "builder", verdict: "great" }), /verdict/);
});

test("health: the shipped agents pass, a broken one fails, the skill stays within its budget", () => {
  assert.deepEqual(checkAgentSources(path.join(SKILL_DIR, "agents")), []);
  const bad = fs.mkdtempSync(path.join(os.tmpdir(), "nexus-agents-"));
  fs.writeFileSync(path.join(bad, "nexus-x.md"), "---\nname: nexus-y\ndescription: short\nmodel: inherit\neffort: max\n---\nbody");
  const problems = checkAgentSources(bad).join("\n");
  assert.match(problems, /does not match the file name/);
  assert.match(problems, /never inherit/);
  assert.match(problems, /effort "max"/);
  assert.match(problems, /BLOCKED/);
  assert.deepEqual(checkSkillBudget(path.join(SKILL_DIR, "SKILL.md"), 170), []);
});

test("cli: mode, status, install, doctor and preflight work end to end", () => {
  const mode = cli("mode", "low");
  assert.equal(mode.status, 0, mode.stderr);
  assert.match(cli("status").stdout, /Nexus profile: low \(fixed pins\).*builder=sonnet\/low/);
  assert.equal(cli("mode", "bogus").status, 1);
  assert.equal(cli("mode", "auto").status, 0);

  const install = cli("install");
  assert.equal(install.status, 0, install.stderr);
  assert.ok(fs.existsSync(path.join(home, ".claude", "agents", "nexus-qa.md")));
  assert.ok(fs.existsSync(path.join(home, ".claude", "skills", "nexus", "scripts", "lib", "route.mjs")));
  const doctor = cli("doctor");
  assert.equal(doctor.status, 0, doctor.stdout + doctor.stderr);
  assert.match(doctor.stdout, /Nexus is healthy/);

  const pre = cli("preflight");
  assert.equal(pre.status, 0, pre.stdout + pre.stderr);
  assert.match(pre.stdout, /fan-out: OK/);

  assert.equal(cli("mode", "off").status, 0);
  assert.equal(fs.readdirSync(path.join(home, ".claude", "agents")).filter((f) => f.startsWith("nexus-")).length, 0);
  cli("mode", "auto");
});

test("cli: route, estimate, lessons and report print useful output", () => {
  assert.match(cli("route", "fix", "the", "login", "bug").stdout, /⟶ nexus-debugger/);
  assert.match(cli("estimate", "builder:2", "reviewer:2").stdout, /total \d+ relative units/);
  assert.match(cli("lessons", "add", "Never animate letter-spacing on words because headings re-wrap", "--role", "builder").stdout, /lesson saved/);
  assert.match(cli("lessons", "show", "--role", "builder").stdout, /letter-spacing/);
  assert.match(cli("ledger", "add", "--role", "builder", "--verdict", "clean", "--tokens", "50000").stdout, /recorded builder/);
  assert.match(cli("report").stdout, /builder/);
  assert.equal(cli("route").status, 1);
});

test("cli: usage text names every command", () => {
  const out = execFileSync(process.execPath, [CLI], { env: { ...process.env, NEXUS_HOME: home }, encoding: "utf8" });
  for (const c of ["route", "estimate", "preflight", "lessons", "ledger", "report"]) assert.match(out, new RegExp(c));
});
