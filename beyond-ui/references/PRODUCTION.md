# Production pass — ship it, do not just finish it

Load this in phase 12 (SHIP), after the gates through G17 are green and the design is frozen
(`scripts/parity.mjs baseline`). Gate: G18 (`scripts/production-check.mjs`), and G19 must still pass
afterwards: the production pass may not change how the site looks.

## Step 1 — invoke the right skill

| Available | Do |
|---|---|
| `production-suite-completion` | Invoke it. It owns the full hardening pass (perf, security, SEO, legal, ops, a11y, observability) and its own state/report. Tell it the design is frozen and that `parity.mjs check` must pass at the end. |
| `accesslint-accessibility-audit` (or `-scan` + `-inspect`) | Run it against the production build for the a11y tier; fix with `accesslint-accessibility-fix`; guard with `accesslint-accessibility-diff`. |
| `vercel-react-best-practices`, `vercel-optimize` | Bundle and server-perf review for Next/React. |
| `web-design-guidelines` | Final interface-guidelines audit with `file:line` output. |
| none of the above | Execute the checklist below yourself. |

## Step 2 — the checklist (Next.js App Router shown; every stack needs the same surface)

**Metadata, one helper for every page.** A `pageMetadata({ title, description, path, og })` function
returns title, description, `alternates.canonical` (per page — a root-layout canonical silently tells
search engines every page is the home page), Open Graph (`type`, `url`, `siteName`, `locale`, a
1200×630 image with alt) and a Twitter `summary_large_image` card. Every public page calls it; titles
and descriptions are unique. A `privateMetadata(title)` sibling returns `robots: { index: false,
follow: false }` and no canonical for auth, dashboard, settings and payment surfaces.

**Share images, generated at build.** `app/og/[slug]/route.tsx` with `ImageResponse`,
`dynamic = "force-static"`, `dynamicParams = false` and `generateStaticParams()` over a card table, so
`/og/<slug>.png` is a static file and unknown slugs 404. Fonts are read with `readFile` from a repo
folder **outside** `public/` (commercial font files in `public/` are a licence breach anyone can
download). The card uses the site's real type, page tone and accent — it is part of the design.

**Crawl surface.**
- `app/sitemap.ts`: every public route on the canonical origin, honest fixed `lastModified` dates
  (not "now" on every request).
- `app/robots.ts`: disallow `/api/` and private surfaces; `sitemap:` points at the canonical origin.
- The canonical origin is the one that serves 200 (if `example.com` 308s to `www.example.com`, every
  canonical, `og:url` and sitemap entry uses `www`).
- `app/manifest.ts` with the page tone as `theme_color`/`background_color`, and icons 192, 512 and a
  maskable 512; `apple-touch-icon` 180; `favicon.ico` with 16/32/48.

**Structured data.** JSON-LD for `Organization` (real `sameAs` links, `logo`, `@id`) and `WebSite`
in the root layout; `SoftwareApplication`/`Product`/`FAQPage` where the content is really there.
Never invent prices, ratings or offers. Serialise with `JSON.stringify(data).replace(/</g, "\\u003c")`.

**Headers** (`next.config` `headers()` or the host's config): HSTS, `X-Content-Type-Options: nosniff`,
`X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, a
`Permissions-Policy` that denies what the site never uses, COOP, a CSP at least covering `base-uri`,
`object-src 'none'`, `frame-ancestors`, `form-action`, `upgrade-insecure-requests`;
`poweredByHeader: false`; `X-Robots-Tag: noindex, nofollow` on private routes and `/api/`; long cache
headers on static media.

**Errors are designed pages.** `not-found.tsx` in the brand (real 404 status, a way back),
`error.tsx` with retry, `global-error.tsx`. A `/api/health` route for uptime checks and CI.

**Data and API hardening.** Never subscribe the browser to a whole collection to show a count (use a
server count or an aggregate query, refreshed while the tab is visible). Validate and length-cap every
API input, rate-limit public POSTs, whitelist anything that ends up in an outgoing email, never return
provider error text, log error names not payloads, return 503 when a required secret is missing.

**Images and fonts.** `next/image` (or equivalent) with AVIF/WebP, explicit sizes, a capped
`deviceSizes` list, `priority` only on the LCP image; fonts through `next/font` with `display: swap`
and only the weights used.

**Ops.** `.env.example` committed, `typecheck`/`lint`/`build`/`test:smoke` scripts, a CI workflow
(typecheck → lint → `npm audit --omit=dev --audit-level=high` → build → start → smoke), a README a new
operator can follow.

## Step 3 — smoke tests that prove it (node:test, no dependencies)

```js
import { test } from "node:test";
import assert from "node:assert/strict";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const ORIGIN = process.env.SITE_ORIGIN ?? "https://www.example.com";
const PUBLIC = ["/", "/pricing", "/about"];
const get = async (p) => { const res = await fetch(BASE + p, { redirect: "manual" }); return { res, body: await res.text() }; };
const meta = (html, re) => (html.match(re) || [])[1];

test("unique canonical metadata and one h1 per public page", async () => {
  const titles = new Set();
  for (const p of PUBLIC) {
    const { res, body } = await get(p);
    assert.equal(res.status, 200, p);
    const title = meta(body, /<title>([^<]*)<\/title>/);
    assert.ok(title && !titles.has(title), `unique title ${p}`);
    titles.add(title);
    assert.equal(meta(body, /<link rel="canonical" href="([^"]*)"/), p === "/" ? ORIGIN : ORIGIN + p);
    assert.match(meta(body, /<meta property="og:image" content="([^"]*)"/) ?? "", /^https:\/\//);
    assert.equal((body.match(/<h1[\s>]/g) || []).length, 1, `one h1 ${p}`);
  }
});

test("unknown routes are real 404s", async () => {
  assert.equal((await get("/definitely-missing")).res.status, 404);
});

test("robots, sitemap and manifest are served", async () => {
  assert.match((await get("/robots.txt")).body, /Sitemap:/);
  assert.equal((await get("/sitemap.xml")).res.status, 200);
  assert.equal((await get("/manifest.webmanifest")).res.status, 200);
});

test("security headers", async () => {
  const { res } = await get("/");
  for (const h of ["strict-transport-security", "x-content-type-options", "referrer-policy", "content-security-policy"]) assert.ok(res.headers.get(h), h);
  assert.equal(res.headers.get("x-powered-by"), null);
});
```

## Step 4 — prove it, then freeze-compare

```bash
npm run build && npx next start -p 3100
node scripts/production-check.mjs http://localhost:3100     # G18: files + live crawl surface + headers
BASE_URL=http://localhost:3100 node --test tests/smoke.test.mjs
node scripts/parity.mjs check http://localhost:3100         # G19: the pass changed nothing visible
```

Write `.beyond-ui/PRODUCTION.md` (or let `production-suite-completion` write its report): what was
fixed, what was measured (Lighthouse per page, mobile and desktop), and the **accepted risks** — any
score that could only be reached by changing the design, stated plainly with the number, for the
user to decide on.

## Store apps (Expo / React Native, Capacitor, Flutter, SwiftUI, Compose)

The web checklist applies to any marketing site or web build. A store app additionally ships:

- App name, bundle id / application id, version and build number set; a deep-link scheme.
- App icon in every required size (adaptive icon on Android, no alpha on iOS) and a splash screen in
  the brand's page tone, generated from one source image (`expo prebuild` / `@capacitor/assets` /
  `flutter_launcher_icons`).
- Permission strings that explain *why* (iOS `NS*UsageDescription`, Android rationale UI); request
  permissions in context, never at launch.
- Privacy policy URL, App Store privacy labels / Play data-safety answers drafted in
  `.beyond-ui/PRODUCTION.md` for the user to submit.
- Store screenshots designed (not raw captures): 6.7"/6.5" iPhone, iPad if supported, Android phone;
  the Scrnshts and Screensdesign references from the catalog show the current bar.
- Offline and slow-network states, crash reporting wired, release build tested on a real device or
  simulator.
- Submitting to a store is the user's action; prepare everything, then hand it over.
