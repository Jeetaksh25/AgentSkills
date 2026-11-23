#!/usr/bin/env node
/**
 * beyond-ui harvest — take PARTICULAR sections from a template, a reference site or a prompt spec,
 * never the whole thing. Each section lands as its own screenshot + cleaned markup + measured styles,
 * so the agent rebuilds just that section (85% from the source, 15% the product's own).
 *
 *   node scripts/harvest.mjs page <url> [projectDir] [--pick hero,pricing] [--viewport 1440x900]
 *   node scripts/harvest.mjs prompt <url|file.md> [projectDir] [--pick hero,features]
 *   node scripts/harvest.mjs list [projectDir]
 *
 * page:   renders the page (Playwright), scrolls it to trigger lazy content, splits it into sections
 *         (landmarks + large top-level blocks), names each by role, and writes per section:
 *         <n>-<role>.png, <n>-<role>.html (scripts/styles/data-URIs stripped), and index.json with the
 *         computed type, colour, spacing and radius of the section's heading, body, button and surface.
 * prompt: fetches a prompt/spec page with Scrapling (or reads a local file) and splits it into one
 *         prompt per section by headings or "Section N" markers.
 * Output: .beyond-ui/harvest/<slug>/  — cite as `harvest/<slug>#<n>-<role>` in fidelity.json.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { launchChromium } from "./lib/browser.mjs";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const cmd = argv[0];
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : d; };
const valueIdx = new Set(argv.flatMap((a, i) => (a.startsWith("--") ? [i + 1] : [])));
const positional = argv.slice(1).filter((a, i) => !a.startsWith("--") && !valueIdx.has(i + 1));
const target = positional[0];
const projectDir = path.resolve(positional.slice(1).find((a) => fs.existsSync(a)) || process.cwd());
if (!path.relative(skillRoot, projectDir).startsWith("..")) { console.log("harvest: run from the target project, not the skill folder"); process.exit(1); }
const pick = (opt("pick", "") || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
const harvestRoot = path.join(projectDir, ".beyond-ui", "harvest");
const slugOf = (u) => { try { const x = new URL(u); return `${x.hostname.replace(/^www\./, "")}${x.pathname}`.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 60).toLowerCase(); } catch { return path.basename(u).replace(/\.[^.]+$/, "").replace(/[^a-z0-9]+/gi, "-").toLowerCase(); } };
const log = (...a) => console.log(...a);

const ROLES = [
  ["nav", /\b(nav|navbar|header|topbar|menu)\b/i],
  ["hero", /\b(hero|masthead|banner|intro|above-the-fold|splash)\b/i],
  ["logos", /\b(logos?|clients|trusted|brands|customers-strip)\b/i],
  ["features", /\b(features?|benefits|capabilities|services|bento|grid)\b/i],
  ["how", /\b(how-it-works|steps|process|workflow)\b/i],
  ["product", /\b(product|showcase|demo|screens?|preview)\b/i],
  ["stats", /\b(stats|metrics|numbers|kpi)\b/i],
  ["testimonials", /\b(testimonials?|reviews?|quotes?|wall-of-love)\b/i],
  ["pricing", /\b(pricing|plans?|tiers?)\b/i],
  ["faq", /\b(faq|questions|accordion)\b/i],
  ["cta", /\b(cta|call-to-action|signup|get-started|waitlist|newsletter)\b/i],
  ["footer", /\b(footer|colophon)\b/i],
  ["sidebar", /\b(sidebar|sidenav|drawer)\b/i],
  ["table", /\b(table|datagrid|list-view)\b/i],
  ["chart", /\b(chart|graph|analytics|plot)\b/i],
  ["form", /\b(form|auth|login|signin|contact)\b/i],
];

async function page() {
  if (!/^https?:\/\//.test(target || "")) { log("usage: harvest.mjs page <url> [--pick hero,pricing]"); process.exit(2); }
  const [w, h] = opt("viewport", "1440x900").split("x").map(Number);
  const browser = await launchChromium(projectDir);
  if (!browser) { log("harvest: playwright not installed — run `node <skill>/scripts/install-tools.mjs`"); process.exit(1); }
  const pg = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await pg.goto(target, { waitUntil: "networkidle", timeout: 60000 }).catch(() => pg.goto(target, { waitUntil: "load", timeout: 60000 }));
  await pg.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += Math.round(innerHeight * 0.8)) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 250)); }
    window.scrollTo(0, 0);
  });
  await pg.waitForTimeout(800);
  const roles = ROLES.map(([r, re]) => [r, re.source, re.flags]);
  const sections = await pg.evaluate((roles) => {
    const RE = roles.map(([r, s, f]) => [r, new RegExp(s, f)]);
    const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.height > 120 && r.width > innerWidth * 0.5 && cs.display !== "none" && cs.visibility !== "hidden"; };
    let blocks = [...document.querySelectorAll("header, nav, main > *, section, footer, body > div > *, [class*=section], [data-section]")].filter(vis);
    for (let pass = 0; pass < 6; pass++) {
      const next = [];
      for (const el of blocks) {
        const kids = [...el.children].filter(vis);
        if (el.getBoundingClientRect().height > innerHeight * 1.6 && kids.length >= 2) next.push(...kids);
        else next.push(el);
      }
      blocks = [...new Set(next)];
    }
    blocks = blocks.filter((el) => !(el.getBoundingClientRect().height > innerHeight * 1.6 && blocks.some((o) => o !== el && el.contains(o))));
    blocks = blocks.filter((el) => !blocks.some((o) => o !== el && o.contains(el)));
    blocks.sort((a, b) => a.getBoundingClientRect().top + scrollY - (b.getBoundingClientRect().top + scrollY));
    const uniq = [];
    for (const el of blocks) { const t = el.getBoundingClientRect().top + scrollY; if (!uniq.some((u) => Math.abs(u.t - t) < 40)) uniq.push({ el, t }); }
    const style = (el) => { if (!el) return null; const cs = getComputedStyle(el); return { font: cs.fontFamily.split(",")[0].replace(/["']/g, ""), size: cs.fontSize, weight: cs.fontWeight, lineHeight: cs.lineHeight, tracking: cs.letterSpacing, transform: cs.textTransform, color: cs.color, bg: cs.backgroundColor, radius: cs.borderRadius, padding: cs.padding }; };
    return uniq.slice(0, 24).map(({ el, t }, i) => {
      const sig = `${el.tagName} ${el.id} ${el.className} ${el.getAttribute("aria-label") || ""} ${(el.querySelector("h1,h2,h3")?.innerText || "").slice(0, 80)}`;
      const role = (el.tagName === "FOOTER" && "footer") || (el.tagName === "NAV" && "nav") || (i <= 2 && el.querySelector("h1") && "hero") || (RE.find(([, re]) => re.test(sig)) || [el.getBoundingClientRect().height < 160 && i === 0 ? "nav" : el.querySelector("h1") ? "hero" : "section"])[0];
      const r = el.getBoundingClientRect();
      el.setAttribute("data-harvest", String(i));
      return {
        index: i, role, top: Math.round(t), height: Math.round(r.height),
        headings: [...el.querySelectorAll("h1,h2,h3")].slice(0, 6).map((x) => x.innerText.replace(/\s+/g, " ").trim().slice(0, 120)),
        ctas: [...el.querySelectorAll("a,button")].map((x) => x.innerText.replace(/\s+/g, " ").trim()).filter((s) => s && s.length < 40).slice(0, 6),
        media: { images: el.querySelectorAll("img,picture").length, video: el.querySelectorAll("video").length, canvas: el.querySelectorAll("canvas").length, svg: el.querySelectorAll("svg").length },
        layout: (() => { const cs = getComputedStyle(el.firstElementChild || el); return { display: cs.display, columns: cs.gridTemplateColumns, gap: cs.gap, maxWidth: getComputedStyle(el).maxWidth }; })(),
        styles: { surface: style(el), heading: style(el.querySelector("h1,h2,h3")), body: style(el.querySelector("p")), button: style(el.querySelector("button, a[class*=btn], a[class*=button]")) },
      };
    });
  }, roles);
  const dir = path.join(harvestRoot, slugOf(target));
  if (!pick.length) fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const kept = [];
  for (const s of sections) {
    if (pick.length && !pick.includes(s.role)) continue;
    const name = `${String(s.index).padStart(2, "0")}-${s.role}`;
    const loc = pg.locator(`[data-harvest="${s.index}"]`).first();
    await loc.scrollIntoViewIfNeeded().catch(() => {});
    await pg.waitForTimeout(500);
    await loc.screenshot({ path: path.join(dir, `${name}.png`) }).catch(() => {});
    const html = await loc.evaluate((el) => {
      const c = el.cloneNode(true);
      c.querySelectorAll("script,style,noscript,iframe,link").forEach((x) => x.remove());
      c.querySelectorAll("*").forEach((x) => { for (const a of [...x.attributes]) { if (/^on/i.test(a.name) || (a.value || "").startsWith("data:") || a.value.length > 400) x.removeAttribute(a.name); } });
      return c.outerHTML.slice(0, 40000);
    }).catch(() => "");
    fs.writeFileSync(path.join(dir, `${name}.html`), `<!-- harvested from ${target} — structure reference only: rewrite copy, never ship third-party assets -->\n${html}\n`);
    kept.push({ ...s, id: name, png: path.relative(projectDir, path.join(dir, `${name}.png`)).replace(/\\/g, "/"), html: path.relative(projectDir, path.join(dir, `${name}.html`)).replace(/\\/g, "/") });
  }
  await browser.close();
  fs.writeFileSync(path.join(dir, "index.json"), JSON.stringify({ source: target, at: new Date().toISOString(), viewport: `${w}x${h}`, sections: kept }, null, 2) + "\n");
  for (const s of kept) log(`  ${s.id.padEnd(18)} ${String(s.height).padStart(5)}px  ${s.headings[0] || ""}`.slice(0, 120));
  log(`harvest -> ${path.relative(projectDir, dir)} (${kept.length} section(s)); LOOK at each png, then rebuild only the sections you need and cite them as harvest/${slugOf(target)}#<id>`);
}

function promptCmd() {
  if (!target) { log("usage: harvest.mjs prompt <url|file.md> [--pick hero,features]"); process.exit(2); }
  const dir = path.join(harvestRoot, slugOf(target));
  fs.mkdirSync(dir, { recursive: true });
  let text = "";
  if (/^https?:\/\//.test(target)) {
    const out = path.join(dir, "source.md");
    spawnSync(process.execPath, [path.join(skillRoot, "scripts", "scrapling.mjs"), "scrape", target, out], { encoding: "utf8", timeout: 300000 });
    text = fs.existsSync(out) ? fs.readFileSync(out, "utf8") : "";
  } else text = fs.readFileSync(path.resolve(target), "utf8");
  if (!text.trim()) { log("harvest: nothing fetched"); process.exit(1); }
  const parts = [];
  const re = /^(#{1,4}\s+.+|(?:\*\*)?(?:section|page|screen)\s*\d*[:.)-].*|\d+\.\s+[A-Z][^\n]{2,60}:?\s*)$/gim;
  const marks = [...text.matchAll(re)].map((m) => m.index);
  if (!marks.length) parts.push({ title: "full", body: text });
  else {
    if (marks[0] > 0) parts.push({ title: "preamble", body: text.slice(0, marks[0]) });
    marks.forEach((m, i) => { const body = text.slice(m, marks[i + 1] ?? text.length); parts.push({ title: body.split("\n")[0].replace(/[#*]/g, "").trim().slice(0, 60), body }); });
  }
  const roleOf = (t) => (ROLES.find(([, r]) => r.test(t)) || ["section"])[0];
  const kept = [];
  parts.forEach((p, i) => {
    const role = roleOf(`${p.title} ${p.body.slice(0, 200)}`);
    if (pick.length && !pick.includes(role)) return;
    const name = `prompt-${String(i).padStart(2, "0")}-${role}`;
    fs.writeFileSync(path.join(dir, `${name}.md`), `<!-- from ${target}: structure and motion spec only; rewrite every line of copy for this product -->\n${p.body.trim()}\n`);
    kept.push({ id: name, role, title: p.title, chars: p.body.length });
  });
  fs.writeFileSync(path.join(dir, "prompts.json"), JSON.stringify({ source: target, at: new Date().toISOString(), sections: kept }, null, 2) + "\n");
  for (const k of kept) log(`  ${k.id.padEnd(26)} ${k.title}`);
  log(`harvest -> ${path.relative(projectDir, dir)} (${kept.length} prompt section(s))`);
}

function list() {
  if (!fs.existsSync(harvestRoot)) { log("harvest: nothing harvested yet"); return; }
  for (const d of fs.readdirSync(harvestRoot)) {
    const idx = [path.join(harvestRoot, d, "index.json"), path.join(harvestRoot, d, "prompts.json")].map((p) => { try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return null; } }).filter(Boolean);
    for (const i of idx) log(`${d}: ${i.sections.map((s) => s.id).join(", ")}`);
  }
}

const cmds = { page, prompt: promptCmd, list };
if (!cmds[cmd]) { log("usage: node scripts/harvest.mjs page|prompt|list  (see header)"); process.exit(2); }
await cmds[cmd]();
