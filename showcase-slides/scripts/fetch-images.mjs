#!/usr/bin/env node
/**
 * Downloads images for a deck into <deck-dir>/img so the deck works offline (classrooms, venues),
 * verifies that every file really is an image, and records attribution in img/credits.json.
 *
 *   node fetch-images.mjs <deck-dir> --manifest images.json
 *   node fetch-images.mjs <deck-dir> <name>=<url> [<name>=<url> ...] [--credit "<name>=Photo by A on Unsplash"]
 *
 * images.json: [{ "name": "hero", "url": "https://images.unsplash.com/photo-...?w=2400&q=80",
 *                 "credit": "Photo by A on Unsplash", "source": "https://unsplash.com/photos/..." }]
 *
 * Only JPEG, PNG, WebP, GIF and AVIF are accepted (checked by magic bytes, not by the URL), files
 * over 15 MB are refused, and nothing is executed. Prints the relative path to use in the deck.
 */
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const dir = args.find((a, i) => !a.startsWith("--") && !a.includes("=") && !["--manifest", "--credit"].includes(args[i - 1]));
if (!dir) {
  console.error("usage: node fetch-images.mjs <deck-dir> --manifest images.json | <name>=<url> ...");
  process.exit(2);
}

const MAX = 15 * 1024 * 1024;
const credits = {};
args.forEach((a, i) => { if (args[i - 1] === "--credit") { const [k, ...v] = a.split("="); credits[k] = v.join("="); } });

let items = [];
const mi = args.indexOf("--manifest");
if (mi >= 0) items = JSON.parse(fs.readFileSync(args[mi + 1], "utf8"));
for (const [i, a] of args.entries()) {
  if (args[i - 1] === "--credit" || args[i - 1] === "--manifest") continue;
  const m = /^([a-z0-9][a-z0-9_-]*)=(https?:\/\/.+)$/i.exec(a);
  if (m) items.push({ name: m[1], url: m[2], credit: credits[m[1]] || "" });
}
if (!items.length) {
  console.error("no images given");
  process.exit(2);
}

function sniff(buf) {
  const h = buf.subarray(0, 16);
  if (h[0] === 0xff && h[1] === 0xd8 && h[2] === 0xff) return "jpg";
  if (h.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (h.toString("ascii", 0, 4) === "RIFF" && h.toString("ascii", 8, 12) === "WEBP") return "webp";
  if (h.toString("ascii", 0, 4) === "GIF8") return "gif";
  if (h.toString("ascii", 4, 8) === "ftyp" && /avif|avis/.test(h.toString("ascii", 8, 12))) return "avif";
  return null;
}

const imgDir = path.resolve(dir, "img");
fs.mkdirSync(imgDir, { recursive: true });
const creditFile = path.join(imgDir, "credits.json");
const ledger = fs.existsSync(creditFile) ? JSON.parse(fs.readFileSync(creditFile, "utf8")) : {};
let failed = 0;

for (const it of items) {
  const name = String(it.name || "").toLowerCase().replace(/[^a-z0-9_-]/g, "-");
  if (!name || !/^https?:\/\//i.test(it.url || "")) { console.log(`  SKIP  invalid entry ${JSON.stringify(it)}`); failed++; continue; }
  try {
    const res = await fetch(it.url, { redirect: "follow", headers: { "User-Agent": "showcase-slides/1.0 (image fetch for an offline presentation)", Accept: "image/avif,image/webp,image/jpeg,image/png,image/*;q=0.8" }, signal: AbortSignal.timeout(45000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const len = Number(res.headers.get("content-length") || 0);
    if (len > MAX) throw new Error(`too large (${(len / 1048576).toFixed(1)} MB)`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > MAX) throw new Error(`too large (${(buf.length / 1048576).toFixed(1)} MB)`);
    const ext = sniff(buf);
    if (!ext) throw new Error(`not an image (content-type ${res.headers.get("content-type") || "unknown"})`);
    for (const old of fs.readdirSync(imgDir)) if (old.startsWith(`${name}.`) && old !== `${name}.${ext}`) fs.rmSync(path.join(imgDir, old));
    const file = path.join(imgDir, `${name}.${ext}`);
    fs.writeFileSync(file, buf);
    ledger[name] = { file: `img/${name}.${ext}`, url: it.url, credit: it.credit || "", source: it.source || "", bytes: buf.length, fetched: new Date().toISOString().slice(0, 10) };
    console.log(`  OK    img/${name}.${ext}  ${(buf.length / 1024).toFixed(0)} KB${it.credit ? `  (${it.credit})` : "  (no credit recorded)"}`);
  } catch (e) {
    console.log(`  FAIL  ${name}: ${e.message}  ${it.url}`);
    failed++;
  }
}

fs.writeFileSync(creditFile, JSON.stringify(ledger, null, 2));
console.log(`${items.length - failed} of ${items.length} image(s) saved in ${imgDir}; credits in img/credits.json`);
process.exit(failed ? 1 : 0);
