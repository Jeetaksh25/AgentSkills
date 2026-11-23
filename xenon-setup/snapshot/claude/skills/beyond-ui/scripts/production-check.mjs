#!/usr/bin/env node
/**
 * beyond-ui production check — the ship surface from references/PRODUCTION.md, proven (G18).
 *
 *   node scripts/production-check.mjs [url] [projectDir] [--routes /a /b]
 *
 * Static: sitemap, robots, 404, error page, manifest, share images, JSON-LD, security headers config,
 * smoke tests, CI, env example, font files exposed in public/.
 * Live (when a url is given — run it against a production build): every public route returns 200 with a
 * unique title and description, a canonical, an absolute og:image, a twitter card and exactly one h1;
 * robots.txt names the sitemap; sitemap.xml is served; unknown routes are real 404s; JSON-LD parses;
 * security headers are present; x-powered-by is gone.
 * Writes `.beyond-ui/production-audit.json`; pass requires the live crawl and zero critical findings.
 */
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const routesAt = args.indexOf("--routes");
const normRoute = (r) => {
  const clean = String(r).split("\\").join("/").replace(/^[A-Za-z]:\/.*?\/Git(?=\/|$)/, "");
  return clean.startsWith("/") ? clean : "/" + clean;
};
const extraRoutes = routesAt >= 0 ? args.slice(routesAt + 1).filter((a) => !/^(--|https?:)/.test(a)).map(normRoute) : [];
const positional = (routesAt >= 0 ? args.slice(0, routesAt) : args).filter((a) => !a.startsWith("--"));
const url = positional.find((a) => /^https?:\/\//.test(a)) || null;
const projectDir = path.resolve(positional.find((a) => !/^https?:\/\//.test(a)) || process.cwd());
const beyondDir = path.join(projectDir, ".beyond-ui");
const outPath = path.join(beyondDir, "production-audit.json");

const findings = [];
const add = (severity, rule, detail) => findings.push({ severity, rule, detail });
const exists = (...rels) => rels.find((r) => fs.existsSync(path.join(projectDir, r))) || null;
const glob = (dir, re, depth = 4, out = []) => {
  const abs = path.join(projectDir, dir);
  if (!fs.existsSync(abs) || depth < 0) return out;
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    if (/^(node_modules|\.next|\.git|dist|build|out)$/.test(e.name)) continue;
    const r = path.join(dir, e.name);
    if (e.isDirectory()) glob(r, re, depth - 1, out);
    else if (re.test(r.replace(/\\/g, "/"))) out.push(r.replace(/\\/g, "/"));
  }
  return out;
};
const read = (r) => { try { return fs.readFileSync(path.join(projectDir, r), "utf8"); } catch { return ""; } };

const pkg = (() => { try { return JSON.parse(read("package.json")); } catch { return {}; } })();
const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
const isNext = !!deps.next;
const appDirs = ["app", "src/app"].filter((d) => fs.existsSync(path.join(projectDir, d)));
const inApp = (re) => appDirs.flatMap((d) => glob(d, re, 6));
const srcFiles = ["app", "src", "pages", "components", "lib"].flatMap((d) => glob(d, /\.(tsx|jsx|ts|js|astro|vue|svelte)$/, 8));
const srcHas = (re) => srcFiles.some((f) => re.test(read(f)));

if (!(isNext ? inApp(/\/sitemap\.(ts|js|xml)$/).length : 0) && !exists("public/sitemap.xml", "static/sitemap.xml") && !srcHas(/sitemap/i)) add("critical", "PR-SITEMAP", "no sitemap (app/sitemap.ts or public/sitemap.xml)");
if (!(isNext ? inApp(/\/robots\.(ts|js|txt)$/).length : 0) && !exists("public/robots.txt", "static/robots.txt")) add("critical", "PR-ROBOTS", "no robots (app/robots.ts or public/robots.txt)");
if (!(isNext ? inApp(/\/not-found\.(tsx|jsx|js)$/).length : 0) && !exists("public/404.html", "src/pages/404.astro", "pages/404.tsx", "src/pages/404.tsx", "src/routes/+error.svelte", "error.vue")) add("critical", "PR-404", "no designed 404 page");
if (isNext && !inApp(/\/error\.(tsx|jsx|js)$/).length) add("warn", "PR-ERROR", "no app/error.tsx (designed error page with retry)");
if (!(isNext ? inApp(/\/manifest\.(ts|js|json|webmanifest)$/).length : 0) && !exists("public/manifest.json", "public/site.webmanifest", "public/manifest.webmanifest")) add("warn", "PR-MANIFEST", "no web manifest");
if (!inApp(/opengraph-image\.|\/og\//).length && !glob("public", /og[^/]*\.(png|jpg|jpeg|webp)$/i, 3).length && !srcHas(/ImageResponse|og:image|openGraph/)) add("critical", "PR-OG", "no share image (opengraph-image, an /og route, or public/og*.png)");
if (!srcHas(/application\/ld\+json/)) add("warn", "PR-JSONLD", "no JSON-LD structured data");
if (isNext && !srcHas(/canonical/)) add("critical", "PR-CANONICAL", "no canonical URLs in metadata (alternates.canonical per page)");

const headerSources = [exists("next.config.ts", "next.config.mjs", "next.config.js"), exists("vercel.json"), exists("netlify.toml"), exists("public/_headers", "_headers"), exists("astro.config.mjs")].filter(Boolean);
const headerText = headerSources.map(read).join("\n");
if (!/Strict-Transport-Security|X-Content-Type-Options/i.test(headerText)) add("critical", "PR-HEADERS", "no security headers configured (next.config headers(), vercel.json, netlify.toml or _headers)");
if (isNext && !/poweredByHeader:\s*false/.test(headerText)) add("warn", "PR-POWERED", "next.config should set poweredByHeader: false");

if (!glob("tests", /smoke|e2e|\.test\.(m?js|ts)$/, 3).length && !glob("e2e", /\.(m?js|ts)$/, 3).length) add("warn", "PR-SMOKE", "no smoke tests (tests/smoke.test.mjs with node:test)");
if (!glob(".github/workflows", /\.ya?ml$/, 1).length) add("warn", "PR-CI", "no CI workflow");
if (srcHas(/process\.env\.|import\.meta\.env\./) && !exists(".env.example", ".env.sample")) add("warn", "PR-ENV", "env vars used but no .env.example");
const exposedFonts = glob("public", /\.(ttf|otf|woff2?|eot|zip)$/i, 4);
if (exposedFonts.length) add("warn", "PR-FONTS", `${exposedFonts.length} font/archive files are publicly downloadable from public/ (e.g. ${exposedFonts[0]}); confirm the licence allows it or move them outside public/`);

const live = { checked: false, routes: [] };

async function crawl() {
  const base = url.replace(/\/$/, "");
  const get = async (p, init) => {
    try {
      const res = await fetch(base + p, { redirect: "manual", ...init });
      return { res, body: await res.text() };
    } catch (e) {
      return { res: null, body: "", error: e.message };
    }
  };
  const home = await get("/");
  if (!home.res) { add("critical", "PR-LIVE", `could not reach ${url}: ${home.error}`); return; }
  live.checked = true;

  const robots = await get("/robots.txt");
  if (robots.res?.status !== 200) add("critical", "PR-ROBOTS-LIVE", "/robots.txt not served");
  else if (!/^sitemap:/im.test(robots.body)) add("warn", "PR-ROBOTS-SITEMAP", "robots.txt does not name the sitemap");

  const sitemap = await get("/sitemap.xml");
  let routes = ["/"];
  if (sitemap.res?.status !== 200) add("critical", "PR-SITEMAP-LIVE", "/sitemap.xml not served");
  else {
    const locs = [...sitemap.body.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
    if (!locs.length) add("critical", "PR-SITEMAP-EMPTY", "sitemap.xml lists no URLs");
    const origins = new Set(locs.map((l) => { try { return new URL(l).origin; } catch { return "invalid"; } }));
    if (origins.size > 1) add("warn", "PR-SITEMAP-ORIGIN", `sitemap mixes origins: ${[...origins].join(", ")}`);
    routes = [...new Set([...routes, ...locs.map((l) => { try { return new URL(l).pathname; } catch { return null; } }).filter(Boolean)])];
  }
  routes = [...new Set([...routes, ...extraRoutes])].slice(0, 20);

  const missing = await get(`/beyond-ui-missing-${Date.now()}`);
  if (missing.res && missing.res.status !== 404) add("critical", "PR-SOFT404", `unknown route returned ${missing.res.status}, not 404`);

  const h = home.res.headers;
  for (const name of ["x-content-type-options", "referrer-policy"]) if (!h.get(name)) add("critical", "PR-HEADER-LIVE", `missing ${name}`);
  for (const name of ["strict-transport-security", "content-security-policy", "permissions-policy"]) if (!h.get(name)) add("warn", "PR-HEADER-LIVE", `missing ${name}`);
  if (h.get("x-powered-by")) add("warn", "PR-POWERED-LIVE", `x-powered-by: ${h.get("x-powered-by")}`);

  const titles = new Map();
  const descriptions = new Map();
  const meta = (html, re) => (html.match(re) || [])[1];
  for (const route of routes) {
    const page = route === "/" ? home : await get(route);
    const status = page.res?.status ?? 0;
    const r = { route, status };
    live.routes.push(r);
    if (status !== 200) { add("critical", "PR-STATUS", `${route} returned ${status}`); continue; }
    const body = page.body;
    if (/<meta[^>]+name="robots"[^>]+noindex/i.test(body)) { r.noindex = true; continue; }
    r.title = meta(body, /<title[^>]*>([^<]*)<\/title>/i);
    r.description = meta(body, /<meta[^>]+name="description"[^>]+content="([^"]*)"/i);
    r.canonical = meta(body, /<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i);
    r.ogImage = meta(body, /<meta[^>]+property="og:image"[^>]+content="([^"]*)"/i);
    r.twitter = meta(body, /<meta[^>]+name="twitter:card"[^>]+content="([^"]*)"/i);
    r.h1 = (body.match(/<h1[\s>]/gi) || []).length;
    if (!r.title) add("critical", "PR-TITLE", `${route} has no <title>`);
    else if (titles.has(r.title)) add("critical", "PR-TITLE-DUP", `${route} shares its title with ${titles.get(r.title)}`);
    else titles.set(r.title, route);
    if (!r.description) add("critical", "PR-DESC", `${route} has no meta description`);
    else if (descriptions.has(r.description)) add("warn", "PR-DESC-DUP", `${route} shares its description with ${descriptions.get(r.description)}`);
    else descriptions.set(r.description, route);
    if (!r.canonical) add("critical", "PR-CANONICAL-LIVE", `${route} has no canonical`);
    else if (route !== "/" && /^https?:\/\/[^/]+\/?$/.test(r.canonical)) add("critical", "PR-CANONICAL-HOME", `${route} canonicalises to the home page (${r.canonical})`);
    if (!r.ogImage) add("critical", "PR-OG-LIVE", `${route} has no og:image`);
    else if (!/^https?:\/\//.test(r.ogImage)) add("warn", "PR-OG-RELATIVE", `${route} og:image is not absolute (set metadataBase)`);
    if (!r.twitter) add("warn", "PR-TWITTER", `${route} has no twitter:card`);
    if (r.h1 !== 1) add("critical", "PR-H1", `${route} has ${r.h1} <h1> elements (want exactly 1)`);
    for (const m of body.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
      try { JSON.parse(m[1]); } catch { add("critical", "PR-JSONLD-INVALID", `${route} has JSON-LD that does not parse`); }
    }
  }
}

if (url) await crawl();
else add("critical", "PR-NO-LIVE", "no url given — run against a production build: node scripts/production-check.mjs http://localhost:3100");

const critical = findings.filter((f) => f.severity === "critical").length;
const warn = findings.length - critical;
const report = { at: new Date().toISOString(), url, framework: isNext ? "next" : pkg.dependencies ? "other" : "unknown", live, critical, warn, pass: live.checked && critical === 0, findings };
fs.mkdirSync(beyondDir, { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(report, null, 2) + "\n");

console.log(`production-check — ${projectDir}${url ? ` against ${url}` : ""}`);
for (const f of findings) console.log(`  ${f.severity === "critical" ? "CRIT" : "warn"}  ${f.rule} — ${f.detail}`);
if (live.checked) console.log(`  crawled ${live.routes.length} route(s)`);
console.log(`\nproduction: ${report.pass ? "PASS" : "FAIL"} — ${critical} critical, ${warn} warn -> ${path.relative(projectDir, outPath)}`);
process.exit(report.pass ? 0 : 1);
