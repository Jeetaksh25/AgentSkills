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
 *   4. firecrawl-cli (global npm) + core skills     — deep content crawl; needs FIRECRAWL_API_KEY
 *   5. agent skills from GitHub, via npx skills:
 *      lackeyjb/playwright-skill, firecrawl/skills, browser-use (bmaltais/browser-use-skill)
 *
 * Config resolution: process env > <project>/.beyond-ui/config.json > <skill>/assets/config.json
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

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
    playwright: { ...defaults.playwright, ...project.playwright }, galleries: project.galleries || defaults.galleries };
  if (process.env.FIRECRAWL_API_KEY) merged.firecrawlApiKey = process.env.FIRECRAWL_API_KEY;
  return merged;
}

function updateState(mutator) {
  if (!fs.existsSync(statePath)) return;
  const state = JSON.parse(fs.readFileSync(statePath, "utf8"));
  mutator(state);
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2) + "\n");
}

const skillDirs = (globalScope) => globalScope
  ? [path.join(os.homedir(), ".claude", "skills"), path.join(os.homedir(), ".agents", "skills")]
  : [path.join(projectDir, ".agents", "skills"), path.join(projectDir, ".claude", "skills")];

function skillPresent(name, globalScope = true) {
  // Check global first (user-level install), then project scope — a global install satisfies us.
  for (const scope of [true, globalScope]) {
    for (const dir of skillDirs(scope)) if (fs.existsSync(path.join(dir, name, "SKILL.md"))) return true;
  }
  return false;
}

function npmGlobalHas(bin) {
  try { run("npx", ["--no-install", bin, "--version"], { stdio: "pipe" }); return true; } catch { return false; }
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
  const { createRequire } = require("node:module");
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

// firecrawl: official CLI + skills (github.com/firecrawl/cli). Requires an API key; skipped without one.
function installFirecrawl(config) {
  const out = { cli: false, skills: false, keySource: "none", active: false };
  if (process.env.FIRECRAWL_API_KEY) out.keySource = "env";
  else if (config.firecrawlApiKey) out.keySource = "project-config";
  if (!out.keySource || out.keySource === "none") {
    log("  firecrawl SKIPPED — no API key. Set FIRECRAWL_API_KEY, or add \"firecrawlApiKey\" to .beyond-ui/config.json (get a key at firecrawl.dev). Continuing without it.");
    return out;
  }
  log(`  firecrawl key source: ${out.keySource}`);
  // Verify the key before investing in installs
  try {
    const probe = fetch("https://api.firecrawl.dev/v2/map", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.firecrawlApiKey}` },
      body: JSON.stringify({ url: "https://example.com", limit: 3 }),
      signal: AbortSignal.timeout(30000),
    });
    // spawnSync-free async probe: do it synchronously via curl-free http
    probe.catch(() => {});
  } catch { /* probe handled below */ }
  const verified = verifyFirecrawlKey(config.firecrawlApiKey);
  if (!verified) {
    log("  firecrawl key INVALID — skipping firecrawl. Continuing with Playwright + plain HTTP.");
    return out;
  }
  out.active = true;
  if (npmGlobalHas("firecrawl")) { out.cli = true; log("  firecrawl-cli present"); }
  else {
    try { run("npm", ["install", "-g", "firecrawl-cli"]); out.cli = true; log("  firecrawl-cli installed"); }
    catch (e) { log("  FAILED: firecrawl-cli install —", String(e.stderr || e.message).split("\n")[0]); }
  }
  if (!out.cli) return out;
  // Skills via the CLI's own installer: scrape/search/crawl/map/interact + firecrawl workflow skills
  try {
    run("firecrawl", ["setup", "core", "-y"], { timeout: 5 * 60 * 1000 });
    out.skills = true; log("  firecrawl core skills installed");
  } catch (e) {
    log("  firecrawl setup core FAILED —", String(e.stderr || e.message).split("\n")[0], "(fall back: npx skills add firecrawl/skills)");
    try { run("npx", ["-y", "skills", "add", "firecrawl/skills", "-y"], { timeout: 5 * 60 * 1000 }); out.skills = true; } catch { /* recorded */ }
  }
  return out;
}

function verifyFirecrawlKey(key) {
  try {
    const body = JSON.stringify({ url: "https://example.com", limit: 3 });
    const res = spawnSync(process.execPath, ["-e", `
      fetch("https://api.firecrawl.dev/v2/map",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer ${key}"},body:'${body.replace(/'/g, "\\'")}'})
        .then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1));`], { encoding: "utf8", timeout: 30000 });
    return res.status === 0;
  } catch { return false; }
}

// agent skills via npx skills (vercel-labs/skills) — skip any already present
function installAgentSkills() {
  const wanted = [
    ["lackeyjb/playwright-skill", "playwright-skill", "Playwright automation for coding agents"],
    ["firecrawl/skills", "firecrawl-scrape", "official Firecrawl scrape/crawl/map skills"],
  ];
  const results = {};
  for (const [repo, skill, why] of wanted) {
    if (skillPresent(skill.replace(/-\d+$/, "").replace(/scrape/, "scrape"))) { results[skill] = "present"; continue; }
    try { run("npx", ["-y", "skills", "add", repo, "--skill", skill, "-g", "-y"], { timeout: 5 * 60 * 1000 }); results[skill] = "installed"; }
    catch (e) { results[skill] = `failed: ${String(e.stderr || e.message).split("\n")[0]}`; }
    log(`  ${skill}: ${results[skill]}`);
  }
  return results;
}

// browser-use: Python LLM agent (github.com/browser-use/browser-use via bmaltais/browser-use-skill).
// Optional, NEVER a hard dependency: used only for bot-walled/login-gated sites scripted capture fails on.
function installBrowserUse() {
  const out = { installed: false };
  if (skillPresent("browser-use")) { out.installed = true; log("  browser-use skill present"); return out; }
  try {
    run("git", ["clone", "--depth", "1", "https://github.com/bmaltais/browser-use-skill",
      path.join(os.homedir(), ".claude", "skills", "browser-use")]);
    out.installed = true;
    log("  browser-use skill cloned (requires uv + Python 3.11+ at first use; LLM key at runtime)");
  } catch (e) {
    log("  browser-use SKIPPED —", String(e.stderr || e.message).split("\n")[0], "(optional: needed only for bot-walled/login-gated sites)");
  }
  return out;
}

function main() {
  log(`beyond-ui tooling installer — project: ${path.relative(projectDir, projectDir) || projectDir}`);
  const config = loadConfig();

  const playwright = installPlaywright();
  const skillui = installSkillui(config);
  const opensrc = installOpensrc();
  const firecrawl = installFirecrawl(config);
  const agentSkills = installAgentSkills();
  const browserUse = installBrowserUse();

  updateState((s) => {
    s.tools = {
      playwright: { package: playwright.package, chromium: playwright.chromium, skill: agentSkills["playwright-skill"] === "installed" || skillPresent("playwright-skill") },
      skillui: skillui.cli,
      opensrc: opensrc.cli,
      firecrawl,
      browserUse,
    };
  });

  log("\n== tooling report ==");
  log(`  playwright: pkg=${playwright.package} chromium=${playwright.chromium}`);
  log(`  skillui: ${skillui.cli} (${config.teardown.skilluiVersion})`);
  log(`  opensrc: ${opensrc.cli}`);
  log(`  firecrawl: active=${firecrawl.active} cli=${firecrawl.cli} skills=${firecrawl.skills} key=${firecrawl.keySource}`);
  log(`  browser-use: ${browserUse.installed ? "available (optional, LLM-driven)" : "absent (optional)"}`);
  const hardFail = !playwright.chromium; // chromium is the only non-optional piece
  log(hardFail
    ? "\n  ACTION REQUIRED — chromium unavailable: ultra teardown and verify are degraded. Fix the download, then re-run."
    : "\n  capture layer ready.");
  process.exit(hardFail ? 1 : 0);
}

main();