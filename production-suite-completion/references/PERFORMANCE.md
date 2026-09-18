# Performance — cutting bytes and time where it changes behaviour

Performance work is measurement work. Every change here needs a before/after number from the same
tool with the same settings and the same network profile, recorded in the state file. A perf claim
without a measurement is a preference.

## 1. Baseline first

- Measure the **production build** (`build` + `start`), never the dev server — dev builds are
  unminified, unhashed, and several times larger.
- Record per route: first-load JS (gzip), LCP, CLS, INP, transferred bytes. Lighthouse mobile
  throttling for the headline number, a real network trace for confirmation.
- Identify the **LCP element** per template (hero image, H1, hero video poster) before optimising
  anything. Optimising a non-LCP element moves nothing.
- Fix findings in descending byte/ms cost. Re-measure after each batch; a change that does not move
  a metric either did not apply or is being masked.

## 2. Cache headers and invalidation

Header choice is a correctness decision, not a speed knob. Getting it wrong ships another user's
data to the wrong person.

| Response class | Header | Why |
|---|---|---|
| Public, immutable asset (hashed) | `Cache-Control: public, max-age=31536000, immutable` | Never re-fetched |
| Public read, shareable | `Cache-Control: public, s-maxage=60, stale-while-revalidate=300` | CDN serves stale while revalidating; users never wait on the origin |
| Authenticated / per-user | `Cache-Control: private, no-store` | `private` alone still allows browser caching; per-user data needs `no-store` |
| Frequently mutated public read | `Cache-Control: public, max-age=0, s-maxage=30, stale-while-revalidate=60` | Cheap invalidation window without full freshness |
| Any mutation response | `Cache-Control: no-store` | Never cache a write acknowledgement |

- `no-cache` ≠ `no-store`. `no-cache` stores then revalidates — fine for a public page, unacceptable
  for an authenticated one.
- **A CDN header does nothing for a server-rendered DB read.** `s-maxage` only helps when the whole
  response is byte-identical for every requester for the cache lifetime. If the route reads a cookie,
  embeds a session, or renders per-user data, the CDN either bypasses or (worse, if the header lies)
  caches the first user's page and serves it to everyone. Verify by requesting the same URL as two
  identities and diffing the bodies.
- Set `Vary: Cookie, Authorization` when a response genuinely varies; if you need `Vary` on a
  per-user response, the response should be `no-store` instead.
- Invalidation: after a mutation, purge by cache tag/path (`revalidateTag`/`revalidatePath`,
  `surrogate-key` purge) — not "wait for max-age". If the platform has no purge API, choose `max-age`
  short enough that the stale window is acceptable, and say so in the state file.
- Never cache a response that depends on a request header you did not put in `Vary`.

## 3. Immutable assets

- Fingerprint every asset by content hash (`app.4f2a1c.js`). Without a hash you cannot use a long
  `max-age`, and without a long `max-age` every visit re-downloads the bundle.
- `immutable` is correct only for hashed URLs; an unhashed `/logo.svg` with `immutable` is
  un-fixable without a rename.
- HTML entry documents are the exception: `no-cache` (or a very short `s-maxage`) so a deploy is
  picked up. The hashed assets they reference carry the long cache.

## 4. Query speed is a performance topic

- The slowest request on a page is usually a database scan, not a bundle. Cross-check the data layer
  (`references/DATA.md`): every filtered, sorted, or looked-up field needs an index; compound indexes
  ordered equality → sort → range (PERF-03/04).
- Evidence is an explain plan (`IXSCAN`, not `COLLSCAN`) and a latency number, not a schema reading.
- Unbounded reads are P0 for a different reason (DATA-01) but they are also the largest latency risk.

## 5. Image pipeline

- Serve AVIF/WebP with a fallback (`<picture>` with an `<img>` inside, or the framework's optimiser —
  `next/image`, `nuxt-img`, `@sveltejs/enhanced-img`). A "modern format" served to browsers without
  it is a broken image, not a fast one.
- Always set intrinsic `width`/`height` (or `aspect-ratio`). Missing dimensions is the single largest
  CLS source.
- `srcset` + `sizes` on every responsive image. `sizes` must describe the real rendered width at each
  breakpoint; a wrong `sizes` makes the browser pick the desktop variant — the bug looks like "images
  are huge on mobile" with a correct-looking `srcset`.
- Lazy-load below-the-fold images only: `loading="lazy"` (or framework `priority={false}`).
  **The LCP image must not be lazy** — lazy-loading it delays the largest paint by a full
  intersection-observer round trip. Give the hero `fetchpriority="high"` and, where the format allows,
  a `<link rel="preload" as="image">`.
- Do not preload more than one or two images. Preloading a carousel's second slide competes with the
  hero for bandwidth on mobile.
- Cap source files at the resolution the largest breakpoint actually renders (typically ≤ 2× the CSS
  width). Downscale before uploading; a 4000px JPEG in a 600px slot is pure waste.
- Never ship images the page does not show: a logo marquee with 40 hidden logos is 40 requests.

## 6. Route and component code splitting

- Route-level splitting is the default in every modern framework; verify it in build output — each
  route should produce its own chunk (PERF-08). A single monolithic `main.js` means a config problem
  (missing dynamic route, or a shared barrel imported by the shell).
- Dynamically import anything that is not needed for first paint: rich-text/markdown editors, charting
  libraries, maps, 3D viewers, PDF renderers, date pickers, and **modals** (`next/dynamic`,
  `React.lazy` + `Suspense`, `defineAsyncComponent`).
- A modal in the initial chunk costs every visitor bytes for a dialog most never open. Load on open,
  with a skeleton — not on hover, which is unreliable on touch.
- Do not `import` the heavy library to use one function; import the submodule (`lodash/debounce`,
  `date-fns/format`) or replace it with a 10-line local helper.
- Check that splitting actually happened: grep the built chunk graph for the library name; if it is in
  the entry chunk, the dynamic import was hoisted away (usually by a static re-export from a barrel).

## 7. Re-render discipline

- **Measure before memoising.** React DevTools Profiler (or the equivalent) identifies the component
  that re-renders; blanket `React.memo`/`useMemo`/`useCallback` adds comparison cost to every render
  and hides the real problem.
- The fix that beats memoisation is **state colocation**: move the state down to the component that
  needs it. A search input's state in a page-level provider re-renders the whole tree per keystroke;
  the same state inside the input re-renders the input.
- Memoise at measured hot spots: expensive derived lists, context values that feed many consumers, and
  props to memoised children (`useCallback` is pointless without `React.memo` on the receiver).
- Do not allocate in render: no `new Date()` formatting loops, no `.sort()` on props, no `.filter()`
  rebuild per render for large arrays. Compute above the component, or in `useMemo` when the input
  genuinely changes rarely.
- Context is not a state manager: a provider whose value is a new object every render invalidates
  every consumer. Split contexts by change frequency (auth vs theme vs filters).
- Virtualise genuinely long lists (hundreds+ of rows) — but only after confirming the row count; a
  virtual list adds complexity and breaks find-in-page.

## 8. Debounce, throttle, and request bounding

- Search-as-you-type: debounce `200–300ms`, require a **minimum length** (2–3 chars), and abort stale
  requests (`AbortController`, or an axios cancel token / `fetch` signal). Without the abort, a slow
  early response can land after a fast later one and overwrite the correct results.
- Drop out-of-order responses by sequence number when the transport cannot abort.
- **Never debounce the input's own value.** Debouncing `value` makes typing feel broken; debounce the
  *request* (or the derived query), keep the input controlled at full speed.
- Scroll/resize/drag handlers: throttle to one per frame via `requestAnimationFrame`, and read layout
  in the frame callback rather than interleaving reads and writes (layout thrash).
- Never attach an un-throttled `scroll` handler that calls `getBoundingClientRect()` per event; that
  is forced synchronous layout on the main thread.
- Cap the burst: a filter panel that fires five requests on mount should debounce-and-batch into one.

## 9. Build output

- Production mode everywhere it matters: `NODE_ENV=production`, framework production flags, no
  `--watch`, no source maps served publicly unless intentional, no dev-only React/profiling build.
  A dev build shipped to production is the largest single perf defect and looks like a config bug.
- Minify JS and CSS (framework default — verify in the output, do not assume). Check a bundled file
  for readable identifiers.
- Tree-shaking traps: **barrel files** (`index.ts` re-exporting everything) defeat elimination when the
  bundler cannot prove purity; CJS dependencies cannot be shaken; side-effectful imports (a module that
  patches a global on import) keep the whole graph; `import * as ns` pulls the namespace. Prefer direct
  path imports. Mark genuine side-effect-free packages (`"sideEffects": false`) only when true.
- Dynamic `import()` without a static string defeats splitting — pass a literal or a map of literals.
- **Dependency audit**: every declared dependency needs at least one real import site (PERF-15). An
  unused dependency is bytes in the lockfile, install time, and attack surface. Check with a
  dependency-usage scan, then remove from the manifest and re-install.
- Watch for a duplicate library version in the lockfile (two copies of a date or icon library both
  bundled because a transitive dependency pinned another major).

## 10. Third-party scripts

- Nothing third-party belongs in `<head>` without `defer`/`async`, and nothing analytics-related
  belongs on the critical path at all. A synchronous `<script src>` in `<head>` blocks render for its
  entire download.
- Use the framework's script component when it exists (`next/script` with `strategy="afterInteractive"`
  or `"lazyOnload"`), otherwise `defer` (order-preserving, non-blocking).
- Gate analytics/marketing scripts on consent: load the tag only after the user opts in. Loading it
  early "for performance" then suppressing the beacon is a compliance bug, not a fast site.
- Widgets (chat, embeds, maps, video) are the usual LCP killer. Replace an iframe with a static poster
  plus click-to-load, and give the placeholder fixed dimensions.
- Cap the count. Each third party is an unbounded latency dependency you do not control; audit the
  network trace for domains you did not intend to contact.

## 11. Fonts

- `woff2` only — no `.ttf`/`.otf`/`.eot` in the served path.
- Subset to the character sets actually used (latin + any required locale); a full CJK or icon set is
  megabytes for a few glyphs.
- `font-display: swap` (or `optional` for a purely decorative face). `block` is invisible text for up
  to 3s.
- Preload the **one** critical face (the body or hero weight actually painted above the fold). Preload
  more and you delay the LCP image — fonts and images compete for the same early bandwidth.
- Ship the weights you use: a family loaded in 6 weights is 6 downloads; variable fonts collapse that
  to one file where supported.
- Self-host where licensing allows; a third-party font host adds a DNS/TLS handshake to the critical
  path and a privacy question.
- Font swap causes CLS. Mitigate with `size-adjust`/metric-matched fallback (`@font-face` fallback with
  adjusted metrics, or the framework's font module) so the fallback occupies the same space.

## 12. Above-the-fold and LCP

- Server-render (or statically generate) the hero. The LCP element arriving in HTML beats any amount of
  client tuning.
- **No client-only fetch for the LCP element.** A hero that renders only after a mount-time `useEffect`
  fetch guarantees an LCP after hydration plus a network round trip.
- No layout-shifting placeholders: fixed dimensions on the hero container, no cookie banner pushed
  above the content after paint, no late-injected announcement bar.
- Preconnect (`<link rel="preconnect">`) to the image/font origin actually used above the fold; drop
  preconnects to origins that are not on the critical path (each costs a connection).
- Check the LCP attribution in the trace (element + phase: TTFB, load delay, load time, render delay)
  and fix the dominant phase. A slow TTFB is a backend/cache problem, not an image problem.

## 13. Critical CSS

- Inline the above-the-fold CSS (framework default in Next.js App Router, or a critical-CSS pass)
  so the first paint does not wait on a stylesheet round trip.
- Do not inline the whole stylesheet: it is duplicated on every navigation and blocks HTML parsing.
- Ensure the full stylesheet still loads (async or `media`-swapped) — inlining without the follow-up
  link produces an unstyled page after the fold.

## 14. Initial JS budget

- State the budget explicitly and record it in the state file: **first-load JS per route under
  ~130–200 KB gzip** for a typical marketing/app shell, less for a content page, more only for a
  genuinely app-like route (with a written reason).
- Measure per route from the build output (Next.js prints First Load JS per route; other bundlers via
  a stats/analyzer plugin). Record the number for each audited route.
- Treat budget regression like a failing test: if a change pushes a route over budget, fix or justify
  it in the same batch.
- Watch the shared chunk as well as the route chunk — a heavy dependency in the shared chunk taxes
  every route.

## 15. Compression and delivery

- Brotli preferred, gzip fallback. Verify **live**: `content-encoding: br` on a real response at the
  production origin. Platform config that never applies (a proxy overriding it, an already-compressed
  image type) is invisible locally.
- Do not compress already-compressed formats (jpg/png/webp/avif/woff2/mp4) — wasted CPU, no gain; most
  servers/edges handle this, confirm.
- Static assets through a CDN with `cache-control` intact; asset URLs should resolve to the CDN host
  (PERF-22). A CDN that strips or overrides `cache-control` silently defeats section 3.
- Keep asset host consistent with the preconnects and CSP declared elsewhere.

## 16. Request discipline

- De-duplicate identical in-flight GETs (a shared fetcher/query cache — React Query, SWR, a request
  memo for the framework). Two components requesting `/api/me` on mount should produce one request.
- **Request waterfalls**: independent fetches that `await` each other. Kick off parallel requests
  (`Promise.all`) unless the second genuinely depends on the first.
- Prefetch with discipline: prefetching route code on link hover is cheap and usually good; prefetching
  every plausible next page's data on idle is bandwidth theft on mobile. Prefetch only the documented
  high-value transition.
- Avoid the double-fetch of SSR-then-hydrate: pass server data to the client and hydrate the cache
  instead of re-requesting on mount.
- Inspect the network trace for the page: one request per distinct resource, no repeats, no 304 storm
  caused by a cache-busting query param (`?t=Date.now()`).

## 17. Keep computation off the render path

- Sort, aggregate, filter and format on the server, not in a render or a keystroke handler. Sorting a
  full page of records client-side to show ten is both a latency and a correctness problem (the
  ranking is page-local — see `references/DATA.md`).
- Move per-item derived work into the query (computed field, aggregation, `order_by`) or precompute on
  write for expensive values (counts, rankings, search keys).
- Offload genuinely heavy CPU (parsing large files, image processing) to a worker or the server; never
  on the main thread in a click handler.
- Cache pure expensive results across renders (module-level memo keyed by input, server cache with a
  tag) rather than recomputing per render.

## 18. CLS and INP

- **CLS**: reserve space for every media, embed, ad slot and iframe (`width`/`height`,
  `aspect-ratio`, or a fixed `min-height` container). Reserve room for late banners above the content
  or render them below it. Do not insert content above existing content after paint.
- Never animate layout properties (`width`, `height`, `top`, `left`, `margin`); animate `transform`
  and `opacity`.
- **INP**: keep interaction handlers short (< 200ms total main-thread work). Break long tasks —
  chunk loops, `setTimeout(…, 0)`, `scheduler.yield()`, or `requestIdleCallback` for non-urgent work.
- Yield before doing expensive work in a click handler: paint the pending state (spinner/disabled
  button) first, then run the heavy path, so the user sees a response within one frame.
- Do not run synchronous storage/JSON serialisation of large payloads in an input or scroll handler.
- `content-visibility: auto` on long offscreen sections can help paint, but it skips rendering —
  it breaks find-in-page, can shift scroll anchoring, and removes content from the a11y tree until
  rendered. Never apply it to the LCP element, above-the-fold content, or any anchor target; use
  `contain-intrinsic-size` to avoid a scroll-height jump when it activates.
- Long tasks during hydration are the usual INP cause on load-heavy pages; reduce initial JS (section
  14) before micro-optimising handlers.

## Checklist mapping

| ID | Sev | Item |
|---|---|---|
| PERF-01 | P1 | Cache headers plus correct invalidation |
| PERF-02 | P1 | Immutable long-lived asset caching |
| PERF-03 | P1 | Index every filtered/sorted field |
| PERF-04 | P2 | Compound indexes match query shape |
| PERF-05 | P1 | Images modern format with fallback |
| PERF-06 | P1 | Responsive srcset/sizes served |
| PERF-07 | P1 | Below-fold lazy, LCP excluded |
| PERF-08 | P1 | Route-level code splitting |
| PERF-09 | P1 | Heavy components dynamically imported |
| PERF-10 | P1 | Re-renders reduced where measured |
| PERF-11 | P1 | Debounce API-backed search inputs |
| PERF-12 | P2 | Throttle scroll/resize handlers |
| PERF-13 | P1 | Production minified bundles |
| PERF-14 | P2 | Tree-shaking effective, no barrel bloat |
| PERF-15 | P1 | Unused dependencies removed |
| PERF-16 | P1 | Third-party scripts deferred |
| PERF-17 | P1 | Font loading optimized |
| PERF-18 | P1 | Above-the-fold LCP optimized |
| PERF-19 | P2 | Critical CSS inlined |
| PERF-20 | P1 | Initial JS within budget |
| PERF-21 | P1 | Brotli/gzip compression verified live |
| PERF-22 | P2 | Assets via CDN with headers |
| PERF-23 | P1 | No duplicate or redundant requests |
| PERF-24 | P2 | Expensive computation off render path |
| PERF-25 | P1 | CLS eliminated, space reserved |
| PERF-26 | P1 | INP within budget, no long tasks |
