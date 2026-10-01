#!/usr/bin/env node
/**
 * beyond-ui tooling installer — the always-on capture/teardown layer. Idempotent; every step
 * detects before installing and records the outcome in <project>/.beyond-ui/state.json -> tools.
 *
 *   node scripts/install-tools.mjs [projectDir]
 *
 * Layers, in order (each skippable when already present — "skip if globally already installed"):
 *   1. playwright (npm library) + chromium binary   — deep capture engine (two SEPARATE checks)
 *   2. skillui (npx)                                — site -> design-system skill extraction
 *   3. opensrc (global npm)                         — read any npm package's real source
 *   4. scrapling MCP (Scrapling-Plugin, claude-code) — the PREFERRED acquisition path: 13 tools the
 *                                                     agent calls directly, no shell
 *   5. scrapling (python)                           — keyless acquisition engine behind that MCP
 *                                                     server: stealth, Cloudflare, sessions, spiders
 *                                                     (replaces firecrawl + browser-use)
 *   6. agent skills from GitHub, via npx skills: lackeyjb/playwright-skill
 *
 * Config resolution: process env > <project>/.beyond-ui/config.json > <skill>/assets/config.json
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectDir = path.resolve(process.argv[2] || process.cwd());
const statePath = path.join(projectDir, ".beyond-ui", "state.json");

const log = (...a) => console.log(...a);
const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], shell: process.platform === "win32", ...opts });

function loadConfig() {
  const defaults = JSON.parse(fs.readFileSync(path.join(skillRoot, "assets", "config.json"), "utf8"));
  let project = {};
  try {
    project = JSON.parse(fs.readFileSync(path.join(projectDir, ".beyond-ui", "config.json"), "utf8"));
  } catch { /* absent — fine */ }
  const merged = { ...defaults, ...project, teardown: { ...defaults.teardown, ...project.teardown },
    playwright: { ...defaults.playwright, ...project.playwright }, galleries: project.galleries || defaults.galleries,
    scrapling: { ...defaults.scrapling, ...project.scrapling } };
  return merged;
}

function updateState(mutator) {
  if (!fs.existsSync(statePath)) return;
  const state = JSON.parse(fs.readFileSync(statePath, "utf8"));
  mutator(state);
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2) + "\n");
}

// ONE skills directory, at both scopes: the cross-agent layout the `skills` CLI calls "universal".
// A per-harness list here (the old `.agents` + `.claude` pair) only ever detects duplicates.
const skillsDir = (globalScope) => globalScope
  ? path.join(os.homedir(), ".agents", "skills")
  : path.join(projectDir, ".agents", "skills");

function skillPresent(name, globalScope = true) {
  // Check global first (user-level install), then project scope — a global install satisfies us.
  for (const scope of [true, globalScope]) {
    if (fs.existsSync(path.join(skillsDir(scope), name, "SKILL.md"))) return true;
  }
  return false;
}

// Is a CLI resolvable globally or via the npx cache? Used for the skip-if-present checks.
function npmGlobalHas(bin) {
  try { run("npx", ["--no-install", bin, "--version"], { stdio: "pipe", timeout: 120000 }); return true; } catch { return false; }
}

// ---------------------------------------------------------------- 1. playwright
function installPlaywright() {
  const out = { package: false, chromium: false, skill: false };
  // Package check: resolvable from the project? (createRequire anchored at cwd avoids parent/global false positives)
  let pkg = null;
  try {
    const req = nodeRequire();
    pkg = req("playwright/package.json").version;
    out.package = true;
    log(`  playwright ${pkg} present (project)`);
  } catch { /* not in project */ }
  if (!out.package && npmGlobalHas("playwright")) { out.package = true; log("  playwright present (global/npx)"); }
  if (!out.package) {
    log("  installing playwright (npm i -D playwright)…");
    try { run("npm", ["i", "-D", "playwright"]); out.package = true; }
    catch (e) { log("  FAILED: npm i playwright —", String(e.stderr || e.message).split("\n")[0]); return out; }
  }
  // Chromium binary check — SEPARATE from the package check (most common skip-logic bug)
  const pwRoot = path.join(process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local"), "ms-playwright");
  const hasChromium = fs.existsSync(pwRoot) && fs.readdirSync(pwRoot).some((d) => d.startsWith("chromium"));
  if (hasChromium) {
    out.chromium = true;
    log("  chromium binary present");
  } else {
    log("  downloading chromium (npx playwright install chromium)…");
    try { run("npx", ["playwright", "install", "chromium"], { timeout: 10 * 60 * 1000 }); out.chromium = true; }
    catch (e) { log("  FAILED: chromium download —", String(e.stderr || e.message).split("\n")[0]); }
  }
  return out;
}

function nodeRequire() {
  // Resolve packages from the PROJECT directory, not this skill's folder: createRequire anchored there.
  return createRequire(path.join(projectDir, "package.json"));
}

// skillui: npx-cached or globally installed?
function installSkillui(cfg) {
  const out = { cli: false };
  if (npmGlobalHas("skillui")) { out.cli = true; log("  skillui present"); return out; }
  // Probe the pinned version non-destructively (downloads to npx cache on first ever use; fine)
  try {
    const v = run("npx", ["-y", cfg.teardown.skilluiVersion, "--help"], { timeout: 5 * 60 * 1000 }).toString();
    out.cli = true; log("  skillui cached via npx");
  } catch (e) { log("  FAILED: skillui probe —", String(e.stderr || e.message).split("\n")[0]); }
  return out;
}

// opensrc: vercel-labs/opensrc — npm package source fetcher
function installOpensrc() {
  const out = { cli: false };
  if (npmGlobalHas("opensrc")) { out.cli = true; log("  opensrc present"); return out; }
  try { run("npm", ["install", "-g", "opensrc"]); out.cli = true; log("  opensrc installed globally"); }
  catch (e) { log("  FAILED: opensrc —", String(e.stderr || e.message).split("\n")[0], "(optional; npm source reads disabled)"); }
  return out;
}

// Scrapling-Plugin (github.com/Jeetaksh25/Scrapling-Plugin) — registers the `scrapling` MCP server
// (13 tools), the `scrapling` skill and the /scrape command into Claude Code. Scoped to
// `claude-code` on purpose: OMP and the other harnesses already have it, and the installer edits
// config files that hold unrelated agent state, so the narrowest correct target is the right one.
// This is the PREFERRED acquisition path — the agent calls the tools directly and never shells out.
// Scoped to user config (~/.claude.json), never project, so the run stays reproducible per machine.
function installScraplingPlugin(cfg) {
  const want = cfg.scrapling?.mcp || {};
  const out = { installed: false, agent: "claude-code", hint: null };
  if (probeMcpServer(want.server || "scrapling")) {
    out.installed = true;
    log(`  scrapling MCP already registered (mcp__${want.server || "scrapling"}__* tools available)`);
    return out;
  }
  if (want.autoInstall === false) {
    out.hint = "autoInstall disabled in .beyond-ui/config.json -> scrapling.mcp.autoInstall";
    log(`  scrapling MCP ABSENT — ${out.hint}`);
    return out;
  }
  log("  installing Scrapling-Plugin (npx -y github:Jeetaksh25/Scrapling-Plugin)…");
  try {
    run("npx", ["-y", "github:Jeetaksh25/Scrapling-Plugin", "--agent", "claude-code", "--scope", "user"], { timeout: 10 * 60 * 1000 });
    out.installed = probeMcpServer(want.server || "scrapling");
    if (out.installed) log("  scrapling MCP registered for claude-code (13 tools + scrapling skill + /scrape)");
    else out.hint = "installer ran but the server is not in ~/.claude.json — run it by hand: npx -y github:Jeetaksh25/Scrapling-Plugin --agent claude-code";
  } catch (e) { out.hint = String(e.stderr || e.message).split("\n")[0]; log(`  FAILED: Scrapling-Plugin — ${out.hint}`); }
  return out;
}

// An MCP server is "registered" if the agent config names it. Claude Code keeps servers in
// ~/.claude.json under mcpServers (user scope) or .mcp.json (project scope); both count.
function probeMcpServer(name) {
  const candidates = [path.join(projectDir, ".mcp.json"), path.join(os.homedir(), ".claude.json")];
  for (const file of candidates) {
    try {
      const j = JSON.parse(fs.readFileSync(file, "utf8"));
      const scopes = [j.mcpServers, j.projects?.[projectDir]?.mcpServers];
      if (scopes.some((s) => s && Object.prototype.hasOwnProperty.call(s, name))) return true;
    } catch { /* absent or malformed — keep looking */ }
  }
  return false;
}

// scrapling CLI: the fallback engine behind the MCP server (github.com/d4vinci/Scrapling, wired by
// the Scrapling-Plugin). Replaces firecrawl AND browser-use: no API key, no account, no LLM, no quota.
// Stealth + Cloudflare solving + sessions + spiders live here; playwright capture still owns the
// DESIGN extraction (tokens, keyframes, interaction diffs). Still required: the MCP server shells out
// to the same CLI, and scripts/scrapling.mjs is the offline path (no MCP, batch runs, CI).
function installScrapling(cfg) {
  const out = { bin: false, module: false, docker: false, engine: "none", version: null, browser: false, hint: null };
  const want = cfg.scrapling || {};
  const python = process.env.BEYOND_UI_PYTHON || want.python || null;
  const probe = (exe, args) => { try { return run(exe, args, { stdio: "pipe", timeout: 60000 }).toString().trim(); } catch { return null; } };

  // 1. the CLI on PATH
  const binVersion = probe("scrapling", ["--version"]);
  if (binVersion) { out.bin = true; out.engine = "bin"; out.version = binVersion.replace(/[^\d.]/g, ""); log(`  scrapling present (PATH) ${out.version}`); }

  // 2. <python> -m scrapling.cli
  if (!out.bin) {
    for (const exe of python ? [python] : (process.platform === "win32" ? ["python", "python3", "py"] : ["python3", "python"])) {
      const v = probe(exe, ["-m", "scrapling.cli", "--version"]);
      if (v) { out.module = true; out.engine = "module"; out.version = v.replace(/[^\d.]/g, ""); log(`  scrapling via ${exe} -m scrapling.cli ${out.version}`); break; }
    }
  }

  // 3. install it if absent (pip is a plain user-space install; never global-sudo)
  if (out.engine === "none") {
    const pip = python ? { exe: python, args: ["-m", "pip"] } : null;
    const hasPip = pip ? !!probe(pip.exe, [...pip.args, "--version"]) : !!probe("pip", ["--version"]);
    if (want.autoInstall === false || !hasPip) {
      out.hint = want.autoInstall === false
        ? "autoInstall disabled in .beyond-ui/config.json -> scrapling.autoInstall"
        : 'no pip found — install manually: pip install "scrapling[all]>=0.4.15" && scrapling install --force';
      log(`  scrapling ABSENT — ${out.hint}`);
    } else {
      log('  installing scrapling (pip install "scrapling[all]>=0.4.15")…');
      try {
        const [c, a] = pip ? [pip.exe, [...pip.args, "install", "scrapling[all]>=0.4.15"]] : ["pip", ["install", "scrapling[all]>=0.4.15"]];
        run(c, a, { timeout: 15 * 60 * 1000 });
        const v = probe("scrapling", ["--version"]) || (pip && probe(pip.exe, [...pip.args.slice(0, 0), "-m", "scrapling.cli", "--version"]));
        if (v) { out.engine = "bin"; out.bin = true; out.version = String(v).replace(/[^\d.]/g, ""); log(`  scrapling installed ${out.version}`); }
      } catch (e) { out.hint = String(e.stderr || e.message).split("\n")[0]; log(`  FAILED: pip install scrapling — ${out.hint}`); }
    }
  }

  // 4. docker fallback — reported, used only when asked for (--docker)
  if (out.engine === "none" && probe("docker", ["--version"])) {
    out.docker = true;
    out.hint = out.hint || "docker present — `node scripts/scrapling.mjs … --docker` works without Python";
    log("  scrapling via docker available (pass --docker to use pyd4vinci/scrapling)");
  }

  // 5. browsers: fetch/stealthy-fetch/screenshot need them; `get` does not.
  if (out.engine !== "none") {
    const st = JSON.parse((() => { try { return run("node", [path.join(skillRoot, "scripts", "scrapling.mjs"), "check"], { stdio: "pipe", timeout: 120000 }).toString(); } catch (e) { return String(e.stdout || "{}"); } })() || "{}");
    out.browser = st.engine && st.engine !== "none";
    if (want.installBrowser !== false && out.browser) {
      log("  ensuring scrapling browsers (scrapling install --force)…");
      try {
        const args = ["install", "--force"];
        if (out.engine === "module") run(out.docker ? "docker" : (python || "python"), ["-m", "scrapling.cli", ...args], { timeout: 20 * 60 * 1000 });
        else run("scrapling", args, { timeout: 20 * 60 * 1000 });
        log("  scrapling browsers ready");
      } catch (e) { log(`  scrapling browsers NOT installed — ${String(e.stderr || e.message).split("\n")[0]} (get works; fetch/stealthy-fetch may not)`); }
    }
  }
  return out;
}

// agent skills via npx skills (vercel-labs/skills) — skip any already present
function installAgentSkills() {
  const wanted = [
    ["lackeyjb/playwright-skill", "playwright-skill", "Playwright automation for coding agents"],
  ];
  const results = {};
  for (const [repo, skill, why] of wanted) {
    if (skillPresent(skill.replace(/-\d+$/, ""))) { results[skill] = "present"; continue; }
    // -a universal: install only into .agents/skills, matching the rest of this skill.
    try { run("npx", ["-y", "skills", "add", repo, "--skill", skill, "--agent", "universal", "-g", "-y"], { timeout: 5 * 60 * 1000 }); results[skill] = "installed"; }
    catch (e) { results[skill] = `failed: ${String(e.stderr || e.message).split("\n")[0]}`; }
    log(`  ${skill}: ${results[skill]}`);
  }
  return results;
}

function main() {
  log(`beyond-ui tooling installer — project: ${path.relative(projectDir, projectDir) || projectDir}`);
  const config = loadConfig();

  const playwright = installPlaywright();
  const skillui = installSkillui(config);
  const opensrc = installOpensrc();
  const scraplingMcp = installScraplingPlugin(config);
  const scrapling = installScrapling(config);
  const agentSkills = installAgentSkills();

  updateState((s) => {
    s.tools = {
      playwright: { package: playwright.package, chromium: playwright.chromium, skill: agentSkills["playwright-skill"] === "installed" || skillPresent("playwright-skill") },
      skillui: skillui.cli,
      opensrc: opensrc.cli,
      scrapling: { mcp: scraplingMcp.installed, engine: scrapling.engine, version: scrapling.version, browser: scrapling.browser, docker: scrapling.docker, hint: scrapling.hint, note: "keyless acquisition: stealth, Cloudflare, sessions, spiders — replaces firecrawl and browser-use. mcp=true means the agent calls mcp__scrapling__* tools; the CLI is the fallback." },
    };
  });

  log("\n== tooling report ==");
  log(`  playwright: pkg=${playwright.package} chromium=${playwright.chromium}`);
  log(`  skillui: ${skillui.cli} (${config.teardown.skilluiVersion})`);
  log(`  opensrc: ${opensrc.cli}`);
  log(`  scrapling MCP: ${scraplingMcp.installed ? "registered (preferred path)" : `absent${scraplingMcp.hint ? ` — ${scraplingMcp.hint}` : ""}`}`);
  log(`  scrapling CLI: engine=${scrapling.engine} version=${scrapling.version || "n/a"} docker=${scrapling.docker}${scrapling.hint ? ` — ${scrapling.hint}` : ""}`);
  const hardFail = !playwright.chromium; // chromium is the only non-optional piece
  log(hardFail
    ? "\n  ACTION REQUIRED — chromium unavailable: ultra teardown and verify are degraded. Fix the download, then re-run."
    : "\n  capture layer ready.");
  if (scrapling.engine === "none") log("  NOTE: no scrapling engine — the content layer falls back to the MCP tools if registered, otherwise it is skipped; tokens/keyframes/interaction capture still runs.");
  process.exit(hardFail ? 1 : 0);
}

main();