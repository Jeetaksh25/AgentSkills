#!/usr/bin/env node
/**
 * beyond-ui firecrawl bridge — deep content crawl for teardown references. Optional: with no key,
 * every command degrades to a no-op and the caller continues with Playwright + plain HTTP.
 *
 *   node scripts/firecrawl.mjs scrape <url> <out.md>   [--mobile]   -> page content as markdown
 *   node scripts/firecrawl.mjs map <url> <out.json>     [--limit 30] -> site link inventory
 *   node scripts/firecrawl.mjs deep <url> <outDir> [--pages 5]      -> scrape + map + top-N pages as markdown
 *
 * Key resolution: process env FIRECRAWL_API_KEY > <project>/.beyond-ui/config.json. No key ships with the repo.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectDir = process.cwd();

function resolveKey() {
  if (process.env.FIRECRAWL_API_KEY) return { key: process.env.FIRECRAWL_API_KEY, source: "env" };
  const candidates = [path.join(projectDir, ".beyond-ui", "config.json"), path.join(skillRoot, "assets", "config.json")];
  for (const file of candidates) {
    try {
      const cfg = JSON.parse(fs.readFileSync(file, "utf8"));
      if (cfg.firecrawlApiKey) return { key: cfg.firecrawlApiKey, source: path.relative(projectDir, file) };
    } catch { /* absent */ }
  }
  return { key: null, source: "none" };
}

async function fc(endpoint, key, body) {
  const res = await fetch(`https://api.firecrawl.dev/v2/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(120000),
  });
  if (!res.ok) throw new Error(`${endpoint} -> HTTP ${res.status}: ${await res.text().catch(() => "")}`);
  const json = await res.json();
  if (!json.success) throw new Error(`${endpoint} failed: ${JSON.stringify(json).slice(0, 300)}`);
  return json.data;
}

const getOpt = (name, dflt) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : dflt;
};
const hasFlag = (name) => process.argv.includes(name);

async function main() {
  const [cmd, url, target] = process.argv.slice(2, 5);
  if (!cmd || !url || !["scrape", "map", "deep"].includes(cmd)) {
    console.error("usage: node scripts/firecrawl.mjs scrape|map|deep <url> <out> [--pages 5] [--limit 30] [--mobile]");
    process.exit(1);
  }
  const { key, source } = resolveKey();
  if (!key) {
    console.log(`firecrawl: no API key (${source}) — SKIPPED. Set FIRECRAWL_API_KEY or add firecrawlApiKey to .beyond-ui/config.json. Continuing without deep crawl.`);
    process.exit(0); // deliberate soft-exit: firecrawl is an enhancement, never a blocker
  }
  console.log(`firecrawl: key from ${source}`);

  try {
    if (cmd === "scrape") {
      const formats = ["markdown"];
      if (hasFlag("--mobile")) formats.push("screenshot@mobile");
      const data = await fc("scrape", key, { url, formats, onlyMainContent: !hasFlag("--full-content") });
      const md = typeof data === "string" ? data : data.markdown ?? "";
      fs.mkdirSync(path.dirname(path.resolve(target)), { recursive: true });
      fs.writeFileSync(target, typeof md === "string" ? md : JSON.stringify(md, null, 2));
      console.log(`scrape ok -> ${target} (${(typeof md === "string" ? md : JSON.stringify(md)).length} chars)`);
    } else if (cmd === "map") {
      const limit = parseInt(getOpt("--limit", "50"), 10);
      const data = await fc("map", key, { url, limit });
      fs.mkdirSync(path.dirname(path.resolve(target)), { recursive: true });
      fs.writeFileSync(target, JSON.stringify(data.links ?? [], null, 2));
      console.log(`map ok -> ${target} (${(data.links ?? []).length} links)`);
    } else if (cmd === "deep") {
      const pages = parseInt(getOpt("--pages", "5"), 10);
      const dir = path.resolve(target);
      fs.mkdirSync(dir, { recursive: true });
      const [scrape, mapData] = await Promise.all([
        fc("scrape", key, { url, formats: ["markdown"], onlyMainContent: true }),
        fc("map", key, { url, limit: 60 }).catch(() => ({ links: [] })),
      ]);
      const md = typeof scrape === "string" ? scrape : scrape.markdown ?? "";
      fs.writeFileSync(path.join(dir, "content.md"), md);
      const links = (mapData.links ?? []).map((l) => (typeof l === "string" ? l : l.url)).filter((l) => l && l.startsWith("http"));
      fs.writeFileSync(path.join(dir, "links.json"), JSON.stringify(links, null, 2));
      console.log(`deep: landing content.md (${md.length} chars), ${links.length} links`);
      const sameOrigin = new URL(url).origin;
      const inner = links.filter((l) => { try { return new URL(l).origin === sameOrigin; } catch { return false; } }).slice(0, pages);
      for (const link of inner) {
        try {
          const d = await fc("scrape", key, { url: link, formats: ["markdown"], onlyMainContent: true });
          const m = typeof d === "string" ? d : d.markdown ?? "";
          const slug = new URL(link).pathname.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "index";
          fs.writeFileSync(path.join(dir, `page-${slug}.md`), `# ${link}\n\n${m}`);
          console.log(`  + ${slug}.md (${m.length})`);
        } catch (e) { console.error(`  skip ${link}: ${e.message}`); }
      }
    }
  } catch (e) {
    console.error(`firecrawl FAILED: ${e.message}`);
    process.exit(0); // soft-fail: caller falls back to Playwright capture
  }
}

main();