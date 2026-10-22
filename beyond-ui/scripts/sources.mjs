#!/usr/bin/env node
/**
 * beyond-ui sources — the autopilot for references, components, fonts, motion and templates.
 * Turns a one-line product idea into ranked sources, then FETCHES them with Scrapling (never optional)
 * and saves reference images the agent must look at before designing.
 *
 *   node scripts/sources.mjs brief "<idea>" [--platform web|mobile|desktop] [projectDir]
 *   node scripts/sources.mjs detect [projectDir]                 -> .beyond-ui/platform.json
 *   node scripts/sources.mjs pick [projectDir] [--k 8]           -> .beyond-ui/fetch-plan.json
 *   node scripts/sources.mjs fetch [projectDir] [--images 12]    -> .beyond-ui/sources/**, refs/**, fetch-log.json
 *   node scripts/sources.mjs status [projectDir]                 -> what was fetched, what to look at next
 *   node scripts/sources.mjs viewed <image...>                   -> record the reference images you actually opened (G2b)
 *   node scripts/sources.mjs list <category> [--platform mobile] [--tag ai]
 *   node scripts/sources.mjs check [--search]                    -> validate every catalog URL (maintenance)
 *   node scripts/sources.mjs docs                                -> regenerate references/SOURCES-CATALOG.md
 *
 * Catalog: assets/sources.json (8 categories, 50+ ranked entries each). Fetch engine: scripts/scrapling.mjs
 * (Scrapling CLI, automatic get -> fetch -> stealthy-fetch escalation); plain HTTP only when Scrapling is
 * missing, and that is recorded so G2b can see it.
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(fs.readFileSync(path.join(skillRoot, "assets", "sources.json"), "utf8"));
const argv = process.argv.slice(2);
const cmd = argv[0];
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : d; };
const positional = argv.slice(1).filter((a, i, all) => !a.startsWith("--") && !(i > 0 && all[i - 1].startsWith("--") && !["--search"].includes(all[i - 1])));
const log = (...a) => console.log(...a);
const readJson = (p, d = null) => { try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return d; } };
const writeJson = (p, v) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n"); };

function projectFrom(list) {
  const dir = list.find((a) => fs.existsSync(a) && fs.statSync(a).isDirectory());
  const p = path.resolve(dir || process.cwd());
  if (!path.relative(skillRoot, p).startsWith("..")) { log("sources: run from the target project, not the skill folder"); process.exit(1); }
  return p;
}

const TAGS = {
  ai: /\b(ai|gpt|llm|assistant|chat ?bot|copilot|agent|ml|machine learning|model|inference|prompt)\b/i,
  saas: /\b(saas|b2b|platform|workspace|team|crm|subscription|startup)\b/i,
  dashboard: /\b(dashboard|admin|analytics|metrics|monitor|console|panel|reporting|charts?|tracking)\b/i,
  "mobile-app": /\b(mobile|ios|android|app store|play store|expo|react native|flutter|phone|capacitor)\b/i,
  ecommerce: /\b(shop|store|e-?commerce|cart|checkout|product catalog|dtc|marketplace)\b/i,
  fintech: /\b(fintech|bank|finance|payments?|wallet|invest|trading|crypto|budget)\b/i,
  portfolio: /\b(portfolio|personal site|resume|cv|showcase)\b/i,
  agency: /\b(agency|studio|creative)\b/i,
  editorial: /\b(blog|magazine|editorial|news|publication|journal|writing)\b/i,
  education: /\b(course|learn|education|school|student|tutor|study)\b/i,
  health: /\b(health|fitness|medical|wellness|meditation|habit)\b/i,
  game: /\b(game|gaming|esports|play)\b/i,
  "3d": /\b(3d|three\.?js|webgl|immersive|configurator)\b/i,
  landing: /\b(landing|marketing site|homepage|launch|waitlist|website)\b/i,
  productivity: /\b(notes?|todo|tasks?|calendar|planner|productivity|docs?|knowledge)\b/i,
  devtool: /\b(developer|devtool|api|sdk|cli|code|github|deploy|infra)\b/i,
};
const PLATFORM_RE = { mobile: /\b(mobile|ios|android|expo|react native|flutter|capacitor|phone app)\b/i, desktop: /\b(desktop|electron|tauri|macos app|windows app|menubar)\b/i };

function detect(projectDir) {
  const has = (f) => fs.existsSync(path.join(projectDir, f));
  const pkg = readJson(path.join(projectDir, "package.json"), {});
  const d = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  const out = { kinds: [], framework: null, stack: [], webPreview: true };
  const add = (k) => { if (!out.kinds.includes(k)) out.kinds.push(k); };
  if (d.expo || d["react-native"]) { add("mobile"); out.framework = d.expo ? "expo" : "react-native"; out.stack.push("react-native"); out.webPreview = !!(d["react-native-web"] || d.expo); }
  if (d["@capacitor/core"] || has("capacitor.config.ts") || has("capacitor.config.json")) { add("mobile"); add("web"); out.stack.push("capacitor"); }
  if (d["@ionic/react"] || d["@ionic/vue"] || d["@ionic/angular"]) out.stack.push("ionic");
  if (d.electron) { add("desktop"); add("web"); out.stack.push("electron"); }
  if (d["@tauri-apps/api"] || has("src-tauri")) { add("desktop"); add("web"); out.stack.push("tauri"); }
  if (has("pubspec.yaml")) { add("mobile"); out.framework = out.framework || "flutter"; out.stack.push("flutter"); out.webPreview = has("web"); }
  if (has("Package.swift") || fs.readdirSync(projectDir).some((f) => f.endsWith(".xcodeproj"))) { add("mobile"); out.framework = out.framework || "swiftui"; out.stack.push("swiftui"); out.webPreview = false; }
  if ((has("build.gradle") || has("build.gradle.kts") || has("settings.gradle.kts")) && !d["react-native"] && !has("pubspec.yaml")) { add("mobile"); out.framework = out.framework || "compose"; out.stack.push("jetpack-compose"); out.webPreview = false; }
  const web = [["next", "next"], ["nuxt", "nuxt"], ["@sveltejs/kit", "sveltekit"], ["astro", "astro"], ["@angular/core", "angular"], ["solid-js", "solid"], ["@builder.io/qwik", "qwik"], ["vue", "vue"], ["react-router", "react-router"], ["vite", "vite"], ["react", "react"]];
  for (const [dep, name] of web) if (d[dep]) { add("web"); out.framework = out.framework || name; out.stack.push(name); break; }
  if (d.tailwindcss || d["@tailwindcss/postcss"] || d.nativewind) out.stack.push("tailwind");
  if (has("components.json")) out.stack.push("shadcn");
  for (const m of ["gsap", "motion", "framer-motion", "animejs", "lenis", "react-native-reanimated", "moti"]) if (d[m]) out.stack.push(m);
  if (!out.kinds.length) { out.kinds.push("unknown"); out.empty = !pkg.name && !has("pubspec.yaml"); }
  return out;
}

function tagsFor(text) { return Object.entries(TAGS).filter(([, re]) => re.test(text)).map(([t]) => t); }

function briefCmd() {
  const idea = positional.find((a) => !fs.existsSync(a)) || "";
  const projectDir = projectFrom(positional.filter((a) => a !== idea));
  if (!idea) { log('usage: sources.mjs brief "<product idea>" [--platform web|mobile|desktop]'); process.exit(2); }
  const platformFlag = opt("platform", null);
  const det = detect(projectDir);
  const platforms = platformFlag ? platformFlag.split(",") : det.kinds[0] !== "unknown" ? det.kinds : Object.entries(PLATFORM_RE).filter(([, re]) => re.test(idea)).map(([k]) => k);
  if (!platforms.length) platforms.push("web");
  const tags = tagsFor(idea);
  const surface = tags.includes("dashboard") ? "app" : platforms.includes("mobile") && !platforms.includes("web") ? "mobile app" : "landing page";
  const keywords = [...new Set(idea.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !/^(the|and|for|with|app|that|this|make|build|want|need|create|website|page|mobile|ios|android|web|desktop|apps|application|my|our|simple|new|good)$/.test(w)))].slice(0, 6);
  const beyondDir = path.join(projectDir, ".beyond-ui");
  const brief = { idea, platforms, surface, tags, keywords, query: keywords.slice(0, 3).join(" "), detected: det, at: new Date().toISOString() };
  writeJson(path.join(beyondDir, "brief.json"), brief);
  const md = `# Brief — ${idea}

> Generated by \`sources.mjs brief\`; the agent completes every TODO from the idea, the repo and web search.
> Never ask the user for what can be inferred. Read references/BRIEF.md.

## Product
- Idea: ${idea}
- Platforms: ${platforms.join(", ")}
- Surface(s): ${surface}
- Tags: ${tags.join(", ") || "TODO"}
- Audience (who buys, who uses): TODO
- Primary action (the one thing a visitor/user should do): TODO
- Competitors / category leaders (web search, 3–5 URLs): TODO

## Screens / pages (in order)
TODO — list every page or screen. For each: purpose, primary action, sections/regions.

## Domain content inventory (what an expert in this domain expects to see)
TODO — e.g. an ML model dashboard: accuracy/precision/recall/F1, loss curves, confusion matrix, parameters,
hyperparameters, dataset and version, training runs, latency/cost. A notes app: capture, search, tags,
sync status, editor, shortcuts. Nothing on this list may be missing from the build.

## Theme and tone
Decided from the anchor reference and the brief (light, dark or both). A preference the user states wins.

## Constraints
TODO — existing brand, stack, licences, deadlines; or "none stated".
`;
  if (!fs.existsSync(path.join(beyondDir, "brief.md"))) fs.writeFileSync(path.join(beyondDir, "brief.md"), md);
  log(`brief -> .beyond-ui/brief.md + brief.json  platforms=${platforms.join(",")} surface=${surface} tags=${tags.join(",") || "-"} query="${brief.query}"`);
  log("next: complete brief.md, then `node <skill>/scripts/sources.mjs pick && node <skill>/scripts/sources.mjs fetch`");
}

function detectCmd() {
  const projectDir = projectFrom(positional);
  const det = detect(projectDir);
  writeJson(path.join(projectDir, ".beyond-ui", "platform.json"), det);
  log(JSON.stringify(det, null, 2));
}

function score(entry, platforms, tags, rank) {
  const platOk = entry.platforms.some((p) => platforms.includes(p));
  if (!platOk) return -1;
  const hits = entry.tags.filter((t) => tags.includes(t)).length;
  return 100 - rank + hits * 25 + (entry.search ? 5 : 0);
}

function pickCmd() {
  const projectDir = projectFrom(positional);
  const beyondDir = path.join(projectDir, ".beyond-ui");
  const brief = readJson(path.join(beyondDir, "brief.json"));
  if (!brief) { log('pick: run `sources.mjs brief "<idea>"` first'); process.exit(1); }
  const det = detect(projectDir);
  const platforms = [...new Set([...(brief.platforms || []), ...det.kinds.filter((k) => k !== "unknown")])];
  const surfaceTags = brief.surface === "app" ? ["dashboard", "real-product", "saas", "shots", "case-study"] : brief.surface === "mobile app" ? ["mobile-app", "flows", "shots"] : ["landing", "award", "motion"];
  const tags = [...new Set([...(brief.tags || []), ...surfaceTags, ...det.stack])];
  const kOverride = opt("k", null);
  const q = encodeURIComponent(brief.query || brief.keywords?.join(" ") || "");
  const slug = String(brief.query || brief.keywords?.join(" ") || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const plan = { at: new Date().toISOString(), platforms, tags, query: brief.query, categories: {} };
  for (const [cat, c] of Object.entries(catalog.categories)) {
    const k = parseInt(kOverride || c.pick, 10);
    const ranked = c.entries.map((e) => ({ e, s: score(e, platforms, tags, e.rank) })).filter((x) => x.s >= 0).sort((a, b) => b.s - a.s).slice(0, k);
    plan.categories[cat] = ranked.map(({ e, s }) => ({
      id: e.id, name: e.name, rank: e.rank, score: s, fetch: e.fetch, note: e.note,
      urls: [...new Set([e.search && q ? e.search.replace("{q}", q).replace("{slug}", slug) : null, e.url, e.index].filter(Boolean))],
      mcp: e.fetch === "stealth" ? "mcp__scrapling__stealthy_fetch" : e.fetch === "fetch" ? "mcp__scrapling__fetch" : "mcp__scrapling__make_request",
    }));
  }
  if (catalog.categories.typography.pairings) plan.pairings = catalog.categories.typography.pairings;
  if (catalog.categories.typography.banned) plan.bannedFonts = catalog.categories.typography.banned;
  writeJson(path.join(beyondDir, "fetch-plan.json"), plan);
  for (const [cat, list] of Object.entries(plan.categories)) log(`  ${cat.padEnd(11)} ${list.map((x) => x.name).join(" · ")}`);
  log(`fetch-plan -> .beyond-ui/fetch-plan.json (platforms=${platforms.join(",")}, query="${brief.query}")`);
  log("next: `node <skill>/scripts/sources.mjs fetch` (Scrapling) — or call the listed mcp__scrapling__* tool per URL");
}

const IMG_RE = /https?:\/\/[^\s)"'<>]+?\.(?:png|jpe?g|webp|avif)(?:\?[^\s)"'<>]*)?/gi;
const IMG_SKIP = /avatar|logo|favicon|icon|sprite|badge|emoji|flag|announcement|placeholder|\/assets\/|gravatar|tracking|pixel|1x1|spinner/i;
const IMG_KEEP = /upload|shot|screen|cover|preview|thumb|still|media|image|og|capture|hero|gallery|project|work|site|cdn/i;
const upsize = (u) => u.replace(/resize=\d+x\d+/, "resize=1600x1200").replace(/([?&])(w|width)=\d+/, "$1$2=1600");

let repaired = false;
function scrape(url, out) {
  const run = () => spawnSync(process.execPath, [path.join(skillRoot, "scripts", "scrapling.mjs"), "scrape", url, out], { encoding: "utf8", timeout: 300000, env: { ...process.env, PYTHONIOENCODING: "utf-8" } });
  const run2 = (mode) => spawnSync(process.execPath, [path.join(skillRoot, "scripts", "scrapling.mjs"), "scrape", url, out, "--mode", mode], { encoding: "utf8", timeout: 300000, env: { ...process.env, PYTHONIOENCODING: "utf-8" } });
  let r = run();
  let text = `${r.stdout || ""}${r.stderr || ""}`;
  if (r.status !== 0 && !repaired && /(playwright|patchright|camoufox) (install|fetch)|2550|Executable doesn't exist|browserType.launch/i.test(text)) {
    repaired = true;
    log("  scrapling browsers missing — running `scrapling install --force` once, then retrying");
    spawnSync("scrapling", ["install", "--force"], { encoding: "utf8", timeout: 1200000, shell: process.platform === "win32", env: { ...process.env, PYTHONIOENCODING: "utf-8", PLAYWRIGHT_SKIP_BROWSER_GC: "1" } });
    for (const py of [process.env.BEYOND_UI_PYTHON, "python", "python3", "py"].filter(Boolean)) {
      const p = spawnSync(py, ["-m", "patchright", "install", "chromium"], { encoding: "utf8", timeout: 1200000, shell: process.platform === "win32", env: { ...process.env, PLAYWRIGHT_SKIP_BROWSER_GC: "1" } });
      if (p.status === 0) break;
    }
    r = run();
    text = `${r.stdout || ""}${r.stderr || ""}`;
  }
  for (const mode of ["fetch", "stealthy-fetch"]) {
    if (r.status === 0 && fs.existsSync(out) && fs.statSync(out).size > 200) break;
    if (r.status === 0 || !/FAILED/.test(text)) { r = run2(mode); text = `${r.stdout || ""}${r.stderr || ""}`; }
  }
  const ok = r.status === 0 && fs.existsSync(out) && fs.statSync(out).size > 200;
  const engine = /NO CLI ENGINE|no engine|not installed/i.test(text) ? "none" : "scrapling";
  const tier = (text.match(/via ([a-z-]+)/) || [])[1] || "-";
  return { ok, engine, tier, detail: text.split(/\r?\n/).filter((l) => /scrape|fail|error/i.test(l) && !/Deprecation/.test(l)).slice(-1)[0]?.slice(0, 200) || "" };
}

async function plainFetch(url, out) {
  try {
    const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (beyond-ui)" }, redirect: "follow" });
    const html = await res.text();
    const imgs = [...new Set(html.match(IMG_RE) || [])].map((u) => `![](${u})`).join("\n");
    const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 60000);
    fs.writeFileSync(out, `${text}\n\n${imgs}\n`);
    return { ok: res.ok && text.length > 200, engine: "node-fetch", tier: "get", detail: `HTTP ${res.status}` };
  } catch (e) { return { ok: false, engine: "node-fetch", tier: "get", detail: e.message }; }
}

async function downloadImages(md, dir, max) {
  const urls = [...new Set((md.match(IMG_RE) || []).map(upsize))].filter((u) => !IMG_SKIP.test(u) && IMG_KEEP.test(u)).slice(0, max);
  const saved = [];
  fs.mkdirSync(dir, { recursive: true });
  for (const [i, u] of urls.entries()) {
    try {
      const res = await fetch(u, { headers: { "user-agent": "Mozilla/5.0 (beyond-ui)", referer: new URL(u).origin } });
      const type = res.headers.get("content-type") || "";
      if (!res.ok || !/image\/(png|jpe?g|webp|avif)/.test(type)) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 12000) continue;
      const ext = type.includes("png") ? "png" : type.includes("webp") ? "webp" : type.includes("avif") ? "avif" : "jpg";
      const file = path.join(dir, `${String(i + 1).padStart(2, "0")}.${ext}`);
      fs.writeFileSync(file, buf);
      saved.push({ file, url: u, bytes: buf.length });
    } catch { /* skip */ }
  }
  return saved;
}

async function fetchCmd() {
  const projectDir = projectFrom(positional);
  const beyondDir = path.join(projectDir, ".beyond-ui");
  const plan = readJson(path.join(beyondDir, "fetch-plan.json"));
  if (!plan) { log("fetch: run `sources.mjs pick` first"); process.exit(1); }
  const maxImages = parseInt(opt("images", "12"), 10);
  const only = opt("only", null)?.split(",");
  const logPath = path.join(beyondDir, "fetch-log.json");
  const prior = readJson(logPath, { entries: [] });
  const done = new Set(prior.entries.filter((e) => e.ok).map((e) => e.url));
  const entries = [...prior.entries];
  const imageCats = new Set(["references", "templates", "animated"]);
  const FETCH_K = { references: 8, templates: 6, animated: 4, components: 3, motion: 2, rules: 2, assets: 2, typography: 0 };
  for (const [cat, list] of Object.entries(plan.categories)) {
    if (only && !only.includes(cat)) continue;
    for (const src of list.slice(0, only ? list.length : FETCH_K[cat] ?? 2)) {
      for (const [ui, url] of src.urls.entries()) {
        if (done.has(url)) break;
        const out = path.join(beyondDir, "sources", cat, `${src.id}${ui ? `-${ui}` : ""}.md`);
        fs.mkdirSync(path.dirname(out), { recursive: true });
        let r = scrape(url, out);
        if (!r.ok && r.engine === "none") r = await plainFetch(url, out);
        let images = [];
        if (r.ok && imageCats.has(cat) && ui === 0) images = await downloadImages(fs.readFileSync(out, "utf8"), path.join(beyondDir, "refs", cat, src.id), maxImages);
        const rec = { category: cat, source: src.id, url, ok: r.ok, engine: r.engine, tier: r.tier, file: r.ok ? path.relative(projectDir, out).replace(/\\/g, "/") : null, images: images.map((x) => path.relative(projectDir, x.file).replace(/\\/g, "/")), detail: r.detail, at: new Date().toISOString() };
        entries.push(rec);
        log(`  ${r.ok ? "ok  " : "FAIL"} ${cat.padEnd(11)} ${src.name.padEnd(26)} ${r.engine}/${r.tier}${images.length ? `  +${images.length} images` : ""}${r.ok ? "" : `  ${r.detail}`}`);
        writeJson(logPath, summarize(entries));
        if (r.ok) break;
      }
    }
  }
  const s = summarize(entries);
  writeJson(logPath, s);
  log(`\nfetched ${s.okCount}/${s.attempted} (scrapling ${s.scraplingShare}%), ${s.imageCount} reference images in .beyond-ui/refs/ across ${s.categoriesOk.length} categories`);
  log("next: LOOK at every image in .beyond-ui/refs/references (and templates), pick the anchor + 4 supporting references, record them in references-selection.json (anchor: true on one)");
}

function summarize(entries) {
  const ok = entries.filter((e) => e.ok);
  return {
    at: new Date().toISOString(),
    attempted: entries.length,
    okCount: ok.length,
    scraplingShare: ok.length ? Math.round((ok.filter((e) => e.engine === "scrapling").length / ok.length) * 100) : 0,
    imageCount: entries.reduce((n, e) => n + (e.images?.length || 0), 0),
    categoriesOk: [...new Set(ok.map((e) => e.category))],
    entries,
  };
}

function statusCmd() {
  const projectDir = projectFrom(positional);
  const s = readJson(path.join(projectDir, ".beyond-ui", "fetch-log.json"));
  if (!s) { log("status: nothing fetched yet"); return; }
  log(`fetched ${s.okCount}/${s.attempted}, scrapling ${s.scraplingShare}%, images ${s.imageCount}, categories: ${s.categoriesOk.join(", ")}`);
  const viewed = readJson(path.join(projectDir, ".beyond-ui", "state.json"), {})?.scout?.imagesViewed || [];
  const imgs = s.entries.flatMap((e) => e.images || []);
  log(`images viewed (state.scout.imagesViewed): ${viewed.length}/${imgs.length}`);
  for (const i of imgs.filter((x) => !viewed.includes(x)).slice(0, 40)) log(`  look: ${i}`);
}

function viewedCmd() {
  const projectDir = projectFrom([]);
  const statePath = path.join(projectDir, ".beyond-ui", "state.json");
  const state = readJson(statePath, {});
  const files = positional.filter((f) => /\.(png|jpe?g|webp|avif)$/i.test(f) && fs.existsSync(path.resolve(projectDir, f))).map((f) => path.relative(projectDir, path.resolve(projectDir, f)).replace(/\\/g, "/"));
  state.scout = { ...(state.scout || {}), imagesViewed: [...new Set([...(state.scout?.imagesViewed || []), ...files])] };
  writeJson(statePath, state);
  log(`viewed: +${files.length} (total ${state.scout.imagesViewed.length}) — record only images you actually opened`);
}

function listCmd() {
  const cat = positional[0];
  const c = catalog.categories[cat];
  if (!c) { log(`categories: ${Object.keys(catalog.categories).join(", ")}`); process.exit(2); }
  const plat = opt("platform", null);
  const tag = opt("tag", null);
  log(`# ${c.title} — ${c.purpose}`);
  for (const e of c.entries) {
    if (plat && !e.platforms.includes(plat)) continue;
    if (tag && !e.tags.includes(tag)) continue;
    log(`${String(e.rank).padStart(3)}. ${e.name.padEnd(30)} ${e.url}  [${e.platforms.join("/")}] ${e.note}`);
  }
}

async function checkCmd() {
  const withSearch = argv.includes("--search");
  const urls = [];
  for (const [cat, c] of Object.entries(catalog.categories)) for (const e of c.entries) {
    urls.push({ cat, id: e.id, kind: "url", url: e.url });
    if (e.index) urls.push({ cat, id: e.id, kind: "index", url: e.index });
    if (withSearch && e.search) urls.push({ cat, id: e.id, kind: "search", url: e.search.replace("{q}", "dashboard").replace("{slug}", "dashboard") });
  }
  const results = [];
  const run = async (u) => {
    try {
      const ctl = new AbortController();
      const t = setTimeout(() => ctl.abort(), 20000);
      const res = await fetch(u.url, { redirect: "follow", signal: ctl.signal, headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36", accept: "text/html,*/*" } });
      clearTimeout(t);
      const state = res.status < 400 ? "ok" : [401, 403, 429, 503, 520, 521, 522, 523, 525].includes(res.status) ? "protected" : "dead";
      results.push({ ...u, status: res.status, state, final: res.url });
    } catch (e) { results.push({ ...u, status: 0, state: "dead", error: String(e.cause?.code || e.message) }); }
  };
  for (let i = 0; i < urls.length; i += 16) await Promise.all(urls.slice(i, i + 16).map(run));
  for (const r of results.filter((x) => x.state === "dead" && x.status === 0)) {
    if (/HEADERS_OVERFLOW/.test(r.error || "")) { r.state = "protected"; continue; }
    results.splice(results.indexOf(r), 1);
    await run(r);
  }
  for (const r of results) if (r.state === "dead" && r.status === 0) r.state = "unreachable";
  const bad = results.filter((r) => r.state === "dead");
  for (const r of results.filter((x) => x.state === "unreachable")) log(`  unreachable from this network ${r.cat}/${r.id} ${r.url} -> ${r.error}`);
  for (const r of bad) log(`  DEAD ${r.cat}/${r.id} ${r.kind} ${r.url} -> HTTP ${r.status}`);
  log(`\ncheck: ${results.filter((r) => r.state === "ok").length} ok, ${results.filter((r) => r.state === "protected").length} protected (alive, needs stealth), ${results.filter((r) => r.state === "unreachable").length} unreachable (network; retry elsewhere), ${bad.length} dead (HTTP 4xx/5xx) of ${results.length}`);
  writeJson(process.env.BEYOND_UI_CHECK_OUT || path.join(os.tmpdir(), "beyond-ui-sources-check.json"), results);
  process.exit(bad.length ? 1 : 0);
}

function docsCmd() {
  const lines = ["# Sources catalog (generated)", "", "> Generated from `assets/sources.json` by `node scripts/sources.mjs docs`. Do not edit by hand.", "> Ranked: 1 = best for an autonomous agent (quality × agent-readability × licence clarity).", "> The agent never waits for the user to name sites: `sources.mjs pick` chooses from these lists and `sources.mjs fetch` retrieves them with Scrapling.", ""];
  for (const [key, c] of Object.entries(catalog.categories)) {
    lines.push(`## ${c.title} (\`${key}\`, ${c.entries.length})`, "", c.purpose, "", "| # | Source | Platforms | Fetch | Use |", "|---|---|---|---|---|");
    for (const e of c.entries) lines.push(`| ${e.rank} | [${e.name}](${e.url}) | ${e.platforms.join(", ")} | ${e.fetch} | ${e.note.replace(/\|/g, "/")} |`);
    if (c.pairings) {
      lines.push("", "**Pairings that avoid AI-slop defaults**", "", "| Display | Text | Source | Licence | Mood |", "|---|---|---|---|---|");
      for (const p of c.pairings) lines.push(`| ${p.display} | ${p.text}${p.mono ? ` + ${p.mono}` : ""} | ${p.source} | ${p.licence} | ${p.mood} |`);
    }
    if (c.banned) lines.push("", `**Never by reflex:** ${c.banned.join(", ")}.`);
    lines.push("");
  }
  fs.writeFileSync(path.join(skillRoot, "references", "SOURCES-CATALOG.md"), lines.join("\n"));
  log(`docs -> references/SOURCES-CATALOG.md (${Object.values(catalog.categories).reduce((n, c) => n + c.entries.length, 0)} sources)`);
}

const cmds = { brief: briefCmd, detect: detectCmd, pick: pickCmd, fetch: fetchCmd, viewed: viewedCmd, status: statusCmd, list: listCmd, check: checkCmd, docs: docsCmd };
if (!cmds[cmd]) { log("usage: node scripts/sources.mjs brief|detect|pick|fetch|status|list|check|docs  (see header)"); process.exit(2); }
await cmds[cmd]();
