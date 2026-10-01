#!/usr/bin/env node
/**
 * beyond-ui scrapling bridge — keyless content acquisition for teardown references.
 *
 * Replaces the Firecrawl bridge: no API key, no account, no quota. Scrapling is the acquisition
 * engine (stealth, Cloudflare, sessions, retries, spiders); Playwright capture remains the layer
 * that extracts DESIGN truth (tokens, keyframes, interaction diffs). Content shape comes from here.
 *
 * This file is the FALLBACK path. The Scrapling-Plugin registers an MCP server exposing the same
 * capability as 13 agent-invoked tools (make_request -> fetch -> stealthy_fetch, plus sessions and
 * screenshot) with no shell and no intermediate file. Prefer those when `check` reports
 * `mcp: true`; this script earns its place for batch/CI runs, `deep` fan-out, and any harness with
 * no MCP server. Both routes sanitize hidden content, so neither can feed raw markup to the model.
 *
 *   node scripts/scrapling.mjs check                                  -> availability report (JSON)
 *   node scripts/scrapling.mjs scrape <url> <out.md>      [--css <sel>] [--mode get|fetch|stealth]
 *   node scripts/scrapling.mjs map    <url> <out.json>    [--limit 30]  -> same-origin link inventory
 *   node scripts/scrapling.mjs deep   <url> <outDir>      [--pages 3]   -> content.md + pages/*.md + links.json
 *
 * Engine resolution (first that works wins):
 *   1. `scrapling` on PATH
 *   2. <python> -m scrapling.cli        (--python <exe>, or env BEYOND_UI_PYTHON)
 *   3. docker run --rm pyd4vinci/scrapling
 *
 * Escalation is automatic: `get` (plain HTTP, impersonated) -> `fetch` (JS/DOM) -> `stealthy-fetch`
 * (stealth + optional Cloudflare solving). Escalation only costs stealth, never speed, so it is
 * always attempted before giving up. `--ai-targeted` is passed on every call: it strips nav/ads and
 * sanitizes hidden content that can carry a prompt injection.
 *
 * Exit codes: 0 = content written (or cleanly skipped, e.g. no engine available);
 *             1 = the request was attempted and failed on every tier.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const argv = process.argv.slice(2);
const cmd = argv[0];
const hasFlag = (f) => argv.includes(f);
const getOpt = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };

const log = (...a) => console.log(...a);
const isWin = process.platform === "win32";

const quoteArg = (x) => { const s = String(x); return /[\s"&|<>^]/.test(s) ? `"${s.replace(/"/g, '\\"')}"` : s; };
function tryRun(exe, args, opts = {}) {
  const useShell = isWin && !path.isAbsolute(exe);
  return execFileSync(exe, useShell ? args.map(quoteArg) : args, {
    encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], shell: useShell, ...opts,
  });
}
function probe(exe, args, opts = {}) {
  try { return { ok: true, out: tryRun(exe, args, opts).toString().trim() }; }
  catch (e) { return { ok: false, out: String((e.stdout || "") + (e.stderr || "")).trim().split("\n")[0] || e.message }; }
}

// Is the Scrapling-Plugin MCP server registered with the agent? When it is, the agent should be
// calling mcp__scrapling__make_request / fetch / stealthy_fetch directly and only reach for this
// script on `deep` fan-out or when the tools are unavailable. Mirrors install-tools.mjs's probe.
function probeMcp() {
  const server = getOpt("--mcp-server", process.env.BEYOND_UI_MCP_SERVER || "scrapling");
  const home = process.env.USERPROFILE || process.env.HOME || "";
  const files = [path.resolve(".mcp.json"), path.join(home, ".claude.json")].filter(Boolean);
  for (const file of files) {
    try {
      const j = JSON.parse(fs.readFileSync(file, "utf8"));
      const scopes = [j.mcpServers, ...Object.values(j.projects || {}).map((p) => p?.mcpServers)];
      if (scopes.some((s) => s && Object.prototype.hasOwnProperty.call(s, server))) {
        return { registered: true, server, file };
      }
    } catch { /* absent or malformed — keep looking */ }
  }
  return { registered: false, server, file: null };
}

// ------------------------------------------------------------------ engine resolution
function resolveEngine() {
  const python = getOpt("--python", process.env.BEYOND_UI_PYTHON || null);

  if (probe("scrapling", ["--version"]).ok) return { kind: "bin", label: "scrapling (PATH)" };

  const candidates = python ? [python] : (isWin ? ["python", "python3", "py"] : ["python3", "python"]);
  for (const exe of candidates) {
    const r = probe(exe, ["-m", "scrapling.cli", "--version"]);
    if (r.ok) return { kind: "module", exe, label: `${exe} -m scrapling.cli` };
  }

  if (probe("docker", ["--version"]).ok && probe("docker", ["image", "inspect", "pyd4vinci/scrapling"]).ok) {
    return { kind: "docker", label: "docker pyd4vinci/scrapling" };
  }
  if (probe("docker", ["--version"]).ok) {
    // Image not pulled yet — still usable (docker pulls on run). Report it, but only use it if asked.
    if (hasFlag("--docker")) return { kind: "docker", label: "docker pyd4vinci/scrapling (pull on first run)" };
    return { kind: "none", label: "none", hint: "docker present; pass --docker to use pyd4vinci/scrapling" };
  }
  return { kind: "none", label: "none", hint: 'pip install "scrapling[all]>=0.4.15" && scrapling install --force' };
}

function invoke(engine, args, timeoutMs) {
  const runArgs = engine.kind === "docker"
    ? ["run", "--rm", "pyd4vinci/scrapling", ...args]
    : args;
  const exe = engine.kind === "bin" ? "scrapling" : engine.kind === "module" ? engine.exe : "docker";
  const prefix = engine.kind === "module" ? ["-m", "scrapling.cli"] : [];
  return tryRun(exe, [...prefix, ...runArgs], { timeout: timeoutMs });
}

// ------------------------------------------------------------------ extraction
/**
 * Extract one URL to one file. Escalates tiers unless --mode pins one.
 * Returns { ok, tier, bytes, error }.
 */
function extract(engine, url, outFile, { css, mode, timeoutMs }) {
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  const tiers = mode ? [mode] : ["get", "fetch", "stealthy-fetch"];
  const ext = path.extname(outFile).toLowerCase();
  let lastErr = "";
  for (const tier of tiers) {
    const args = ["extract", tier, url, outFile, "--ai-targeted"];
    if (css) args.push("--css-selector", css);
    if (ext === ".html") args.push("--disable-resources");
    if (tier === "get") args.push("--timeout", "30");
    else args.push("--timeout", String(timeoutMs), "--network-idle");
    if (tier === "stealthy-fetch") args.push("--solve-cloudflare");
    try {
      invoke(engine, args, timeoutMs + 60000);
      const bytes = fs.existsSync(outFile) ? fs.statSync(outFile).size : 0;
      if (bytes > 0) return { ok: true, tier, bytes };
      lastErr = `${tier}: empty output`;
    } catch (e) {
      lastErr = `${tier}: ${String((e.stdout || "") + (e.stderr || "")).trim().split("\n").filter(Boolean).pop() || e.message}`;
    }
    if (fs.existsSync(outFile) && fs.statSync(outFile).size === 0) fs.rmSync(outFile, { force: true });
  }
  return { ok: false, tier: null, bytes: 0, error: lastErr };
}

const sameOrigin = (base, href) => {
  try {
    const u = new URL(href, base);
    const b = new URL(base);
    return u.origin === b.origin && !/\.(png|jpe?g|svg|webp|avif|gif|pdf|zip|mp4|webm|woff2?|css|js|ico)$/i.test(u.pathname);
  } catch { return false; }
};
const norm = (href, base) => { const u = new URL(href, base); u.hash = ""; return u.href.replace(/\/$/, ""); };

function mapLinks(engine, url, outJson, { limit, timeoutMs, css }) {
  fs.mkdirSync(path.dirname(outJson), { recursive: true });
  const tmp = path.join(path.dirname(outJson), ".links.html");
  const r = extract(engine, url, tmp, { css: "a", mode: null, timeoutMs });
  const links = [];
  if (r.ok) {
    const html = fs.readFileSync(tmp, "utf8");
    for (const m of html.matchAll(/href\s*=\s*["']([^"']+)["']/gi)) {
      const href = m[1];
      if (!sameOrigin(url, href)) continue;
      const abs = norm(href, url);
      if (!links.includes(abs)) links.push(abs);
    }
    fs.rmSync(tmp, { force: true });
  }
  const base = norm(url, url);
  const ordered = [base, ...links.filter((l) => l !== base)];
  const picked = ordered.slice(0, limit);
  fs.writeFileSync(outJson, JSON.stringify({ url, count: links.length, links: picked, tier: r.tier || null }, null, 2) + "\n");
  return { count: links.length, links: picked, tier: r.tier };
}

// ------------------------------------------------------------------ commands
function main() {
  if (!cmd || !["check", "scrape", "map", "deep"].includes(cmd)) {
    console.error("usage: node scripts/scrapling.mjs check | scrape <url> <out.md> | map <url> <out.json> | deep <url> <outDir>");
    process.exit(1);
  }

  const engine = resolveEngine();
  const mcp = probeMcp();
  if (cmd === "check") {
    const report = {
      preferred: mcp.registered ? "mcp" : "cli",
      mcp: mcp.registered,
      mcpServer: mcp.registered ? `mcp__${mcp.server}__*` : null,
      mcpHint: mcp.registered ? null : "not registered — npx -y github:Jeetaksh25/Scrapling-Plugin --agent claude-code (or use the CLI below)",
      engine: engine.kind, label: engine.label, hint: engine.hint || null,
      version: engine.kind === "none" ? null : probe(engine.kind === "bin" ? "scrapling" : engine.kind === "module" ? engine.exe : "docker",
        engine.kind === "module" ? ["-m", "scrapling.cli", "--version"] : engine.kind === "bin" ? ["--version"] : ["--version"]).out,
    };
    console.log(JSON.stringify(report, null, 2));
    process.exit(engine.kind === "none" && !mcp.registered ? 1 : 0);
  }

  if (engine.kind === "none") {
    const via = mcp.registered
      ? ` — but the MCP server IS registered: call mcp__${mcp.server}__make_request / fetch / stealthy_fetch instead of this script`
      : " (content layer SKIPPED; Playwright capture still runs)";
    log(`scrapling: NO CLI ENGINE${via}`);
    process.exit(0);
  }

  const url = argv[1];
  const target = argv[2];
  if (!url || !target) { console.error(`${cmd} needs <url> <out>`); process.exit(1); }
  const timeoutMs = parseInt(getOpt("--timeout", "60000"), 10);
  const css = getOpt("--css", getOpt("--css-selector", null));
  const mode = getOpt("--mode", null);
  if (mode && !["get", "fetch", "stealthy-fetch"].includes(mode)) { console.error(`unknown --mode ${mode}`); process.exit(1); }
  log(`scrapling: engine=${engine.label}`);

  if (cmd === "scrape") {
    const r = extract(engine, url, path.resolve(target), { css, mode, timeoutMs });
    if (!r.ok) { console.error(`scrapling FAILED: ${r.error}`); process.exit(1); }
    log(`  scrape ok via ${r.tier} -> ${target} (${r.bytes} bytes)`);
    return;
  }

  if (cmd === "map") {
    const limit = parseInt(getOpt("--limit", "30"), 10);
    const r = mapLinks(engine, url, path.resolve(target), { limit, timeoutMs, css });
    log(`  map ok: ${r.count} same-origin links (${r.links.length} kept)`);
    return;
  }

  // deep: page content + link inventory + top-N same-origin pages, all as markdown
  const outDir = path.resolve(target);
  const pages = parseInt(getOpt("--pages", "3"), 10);
  fs.mkdirSync(path.join(outDir, "pages"), { recursive: true });
  let any = false;

  const main1 = extract(engine, url, path.join(outDir, "content.md"), { css, mode, timeoutMs });
  any = any || main1.ok;
  log(`  content.md: ${main1.ok ? `ok via ${main1.tier} (${main1.bytes} bytes)` : `FAILED (${main1.error})`}`);

  const mapped = mapLinks(engine, url, path.join(outDir, "links.json"), { limit: pages + 1, timeoutMs, css });
  log(`  links.json: ${mapped.count} links`);

  const results = [];
  for (const link of mapped.links.slice(0, pages)) {
    const slug = link.replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 60) || "page";
    const file = path.join(outDir, "pages", `${slug}.md`);
    const r = extract(engine, link, file, { css: null, mode, timeoutMs });
    results.push({ url: link, ok: r.ok, tier: r.tier, bytes: r.bytes, file: path.relative(outDir, file) });
    log(`  page ${r.ok ? "ok" : "FAILED"} [${r.tier || "-"}] ${link}`);
    any = any || r.ok;
  }
  fs.writeFileSync(path.join(outDir, "content-manifest.json"),
    JSON.stringify({ url, engine: engine.label, main: main1, pages: results, at: new Date().toISOString() }, null, 2) + "\n");
  process.exit(any ? 0 : 1);
}

main();
