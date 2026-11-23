# SEO — metadata, indexability, and shareable surfaces

SEO defects are invisible in development because development serves one URL and one record. Everything
here is verified against the **rendered** page on the production origin: the `<head>` that the server
actually emits, the sitemap body, the status code of an unknown route. Reading the source proves
nothing.

## 1. Titles and descriptions (P0)

- One unique `<title>` and one unique `meta[name=description]` per indexable page. Duplicates across
  pages are a finding, not a default.
- Titles and descriptions come from a **template plus record-derived values**: a root template like
  `%s · Acme` (or the framework's `title.template`), and for detail pages the record's own name,
  category or identifier. A single global string in the root layout is the classic failure — every
  page ships the same title and the framework made it convenient.
- Length discipline: titles ~50–60 characters before truncation, descriptions ~120–160. Not a hard
  cap; a truncated title that loses the distinguishing words is the actual problem.
- The title must disambiguate the page within the site. "Home" on the home page, "Dashboard" on the
  dashboard, "Q3 planning · Boards · Acme" on the detail page.
- Descriptions are written to be clicked, not stuffed: what the page contains and why it matters.
  Never auto-truncate body text into a description; it produces mid-sentence fragments.
- Private surfaces (login, account, admin, reset) should be `noindex` and still have sensible titles
  for the browser tab (§12).
- Verify by fetching the rendered `<head>` of a sample of routes — including two different detail
  pages of the same type — and diffing title/description. If the two detail pages match, the
  template is not record-derived.

## 2. Canonical URLs and the production origin (P0)

- Every indexable page declares `<link rel="canonical">` with the absolute, production-origin URL of
  that page, including the correct trailing-slash convention and without tracking/query junk.
- **Localhost or preview URLs leaking into canonicals, OG tags or the sitemap is a common and
  damaging defect.** It happens whenever the base URL is derived from the request host or a dev
  default. Set one canonical base from configuration (an env var validated at boot), and never derive
  it from `location.origin`.
- Self-referencing canonicals are the norm. Use a cross-page canonical only where genuinely
  duplicate content exists (filtered/sorted variants, paginated parameters) and it must point at the
  canonical version, not at a different record.
- Paginated lists: canonicalise page 1 to the clean URL; do not canonicalise page 3 back to page 1 —
  that de-indexes the deeper pages.
- Canonical and OG `url` must agree; a mismatch is a defect the audit records.

## 3. robots.txt (P1)

- Served at `/robots.txt` with `200` and `text/plain` on the production origin.
- Contains an absolute `Sitemap:` line pointing at the production sitemap URL.
- Disallow the private and non-content surfaces: `/api/`, `/admin/`, `/account/`, `/auth/`,
  `/settings/`, `/preview/`, `/draft/`, search-result endpoints if they are infinite, and any path
  that serves user data.
- Do not block CSS/JS assets: Google must render the page, and a blocked stylesheet makes the page
  look broken to the crawler.
- Blocking a URL in `robots.txt` prevents crawling, not indexing — a disallowed URL can still be
  indexed from external links. Anything that must not appear in results needs `noindex` **and** the
  disallow (§12).
- Never ship the dev `Disallow: /` or a staging `robots.txt` to production; verify by fetching it.
- Keep it consistent with the sitemap: a URL disallowed in `robots.txt` must not be listed in the
  sitemap.

## 4. Sitemaps (P1)

- Generated from the real route/record space, not hand-written. Public URLs only — no admin, account,
  auth, API, or unpublished/private records.
- Cached, not rebuilt per crawl: a sitemap that queries the entire database on every request is a
  self-inflicted DoS and will time out under crawl load. Revalidate on a schedule or on write.
- Bounded: an XML sitemap holds at most 50,000 URLs / 50MB; beyond that, split and use a sitemap
  index. A sitemap that silently truncates at the first 1,000 rows is a defect.
- `lastmod` is honest: only set when the record actually changed, in W3C datetime format with
  timezone. A `lastmod` of "now" on every request is ignored by crawlers and teaches them to distrust
  the file.
- Referenced from `robots.txt`, returns `200` with `application/xml`, and every listed URL returns
  `200` — a sitemap full of 404s or redirects wastes crawl budget.
- Include only canonical URLs (no `?sort=`, no session ids, no tracking params).
- Record the URL count and a spot-check of three entries as evidence.

## 5. Open Graph (P1)

- Complete on every shareable page: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`,
  `og:site_name`. Missing `og:type` or `og:url` makes platforms guess.
- `og:image` must be an **absolute** URL on the production origin, reachable without authentication,
  and served with an image content type. Relative paths are silently dropped by most platforms.
- Dimensions: 1200×630 for the standard `summary_large_image` card; state `og:image:width` and
  `og:image:height` so the platform can size the card before download. Other ratios cause cropping or
  a fallback to a tiny thumbnail.
- `og:url` equals the canonical; `og:title` may differ from the `<title>` only deliberately (shorter,
  more clickable), and the difference should be intentional.
- `og:image:alt` describes the image for the growing number of clients that surface it.
- Social crawlers do not execute JavaScript. Metadata injected client-side after hydration is
  invisible to them — metadata must be in the server-rendered `<head>` (Next.js `generateMetadata`,
  similar per-framework equivalents), which is why the audit fetches the raw response.

## 6. Per-resource social cards (P1)

- Shareable content must unfurl **the actual item**, not the site default: a board link shows that
  board's title, description and image; a profile link shows the profile.
- Implement per-record OG values in the same function that renders the page's metadata, driven by the
  fetched record — never a static default that only the homepage overrides.
- Provide a generated image path where a per-record image is expected (an OG image route or a
  generated card), and fall back to a sensible branded default rather than a broken URL.
- Test by fetching the shared URL's raw HTML (a social debugger or a plain `curl` of the page) and
  asserting the per-record values appear — not by previewing the page in your own browser.

## 7. Twitter/X cards (P2)

- `twitter:card` (`summary_large_image` for wide images, `summary` otherwise), plus `twitter:title`,
  `twitter:description`, `twitter:image` with an absolute URL.
- X falls back to Open Graph when its own tags are absent, but do not rely on it — declare both.
- Keep the card type consistent with the image dimensions in §5; a `summary_large_image` card with a
  square image gets cropped unpredictably.

## 8. Structured data (P0)

- Only what is **true**. No fabricated aggregate ratings, review counts, prices, availability,
  addresses, opening hours or awards. Inventing them is both an SEO liability (manual action on
  spammy structured data) and a trust/legal problem (`LEGAL.md`).
- Emit JSON-LD in a script tag, server-rendered. Relevant types: `Organization` and `WebSite` (with
  `SearchAction`) on the root, `Product`/`Service` on offering pages, `FAQPage` on genuine FAQ
  content, `BreadcrumbList` on hierarchy pages, `Article`/`BlogPosting` on editorial pages.
- Validate against the schema before shipping: schema.org shape plus a structured-data validator.
  Required properties missing (e.g. `Product` without `offers` when the product is sold) produce
  warnings or nothing at all.
- URLs inside structured data are absolute and canonical; ids stable.
- **Escape user content in JSON-LD.** A record title containing `</script>` breaks out of the script
  tag — an XSS vector, not just an SEO bug. Serialize with a JSON encoder and escape `<`/`/`
  sequences, or serve with a strict CSP (`SECURITY.md` §5).
- Keep structured data consistent with the visible page: a `FAQPage` whose questions are not on the
  page is a mismatch and can be treated as spam.

## 9. Breadcrumbs (P2)

- Where a real hierarchy exists, render breadcrumbs in the UI **and** mirror them in
  `BreadcrumbList` JSON-LD. The schema must match the visible trail.
- The trail reflects the actual hierarchy (Home › Boards › Board name), not the browser history. If
  the user arrived from search, history is meaningless.
- The current page is the last item and is not a link; intermediate levels are links.
- Separators (`/`, `›`) are decorative and must not be announced (`ACCESSIBILITY.md` §9).
- On flat structures (no real hierarchy), omit breadcrumbs rather than inventing a fake trail.

## 10. Internal linking (P1)

- No orphan public pages: every indexable URL is reachable by following links from the homepage
  within a reasonable depth. The sitemap is a fallback, not a substitute for navigation.
- Links earn their place: no footer dumps of hundreds of keyword links, no invisible link blocks.
  Crawl-budget and user trust both suffer.
- Anchor text describes the destination ("Pricing", "How voting works"), not "click here" or "read
  more". Keyword-stuffed anchors repeated site-wide read as manipulation.
- Related-content links (related boards, next in series) both distribute authority and keep sessions
  alive — one relevant link beats five generic ones.
- Verify orphan-freedom by diffing the set of indexable URLs from the sitemap against the set
  reachable by an automated crawl with no sitemap input; every URL in the first set missing from the
  second is a finding.

## 11. URL structure (P1)

- Readable, stable slugs: `/boards/q3-planning` not `/boards/64f3a9…`. Human-readable URLs get
  shared, quoted and remembered.
- Prefer a stable identifier where renaming is expected: either keep the slug and redirect the old
  one forever, or address the record by id with the slug as decoration (`/boards/64f3a9/q3-planning`)
  so a rename does not break links.
- Never put session ids, tracking parameters or internal keys in canonical URLs. Session ids in URLs
  fragment caching and indexing and leak across shares.
- Lowercase, hyphenated, no underscores, no trailing `?`/`&` litter, consistent trailing slash.
- Redirect (301) the old path whenever a slug changes; a rename that 404s loses the accumulated
  links.
- Query strings are for filtering/sorting, not identity; do not build an indexable page per sort
  permutation (§2 on canonicalisation).

## 12. 404 correctness (P0)

- An unknown **route** returns HTTP 404. An unknown **record** (a valid route with a non-existent id)
  returns HTTP 404 too, not a 200 shell that renders "not found" with the site chrome.
- The **soft-404 trap**: rendering a "not found" component inside a page that still returns `200`.
  Search engines index those URLs as low-value content and keep them forever. Framework specifics
  matter here — `notFound()` / `throw 404` / `render(status=404)` must actually set the status in the
  route handler, and a client-side catch that renders a not-found component after a fetch does not.
- Verify with a status check, not by eyeballing: request a random path and a random id under a real
  route and assert `404` in the response line, plus an unknown id under a nested route.
- The 404 page itself is branded, navigable and returns 404 — see `UX.md` §11.
- Deleted records: decide between 404 and 410 (`410 Gone` communicates permanence), and never leave
  the old URL returning 200 with stale content.

## 13. Indexability of private surfaces (P0)

- Dashboard, account, auth, admin, API and preview surfaces: `noindex` **and** absent from the
  sitemap **and** listed in `robots.txt`. All three, because each covers a different path (the
  sitemap is a hint, robots controls crawling, `noindex` controls indexing).
- `X-Robots-Tag: noindex` on the response is the reliable mechanism for non-HTML responses and files;
  a `<meta name="robots">` only works on HTML pages that are crawled.
- **Beware client-rendered `noindex`.** A tag injected after hydration is invisible to crawlers that
  do not execute JavaScript, and even those that do may index the page in the meantime. Set the meta
  tag server-side.
- Auth-gated pages should not be reachable at all by a crawler; `noindex` is defence in depth, not
  authorization (`SECURITY.md` §2).
- Do not put private URLs in the sitemap "with a noindex hint" — that is a contradiction and leaks
  the URL list.

## 14. Image and asset SEO (P2)

- Descriptive filenames: `q3-planning-board.png`, not `IMG_2043.png` or `image-final-v2.png`.
- `alt` present and meaningful on content images; decorative images get `alt=""` (see
  `ACCESSIBILITY.md` §8 for the policy — the two requirements are the same attribute).
- Explicit `width` and `height` (or an aspect-ratio box) so the layout reserves space, which prevents
  CLS and is also a performance requirement (`PERFORMANCE.md`).
- Serve modern formats (`webp`/`avif` with fallbacks), and size-appropriate variants via
  `srcset`/`sizes` — a 3000px hero delivered to a phone is a Core Web Vitals problem that also
  wastes crawl budget.
- Lazy-load below-the-fold images (`loading="lazy"`) but never the LCP image; that reverses the
  performance goal.
- Favicon set and web app manifest present and valid; a missing touch icon degrades the shared-link
  surface on mobile.
- No text baked into images for content that search engines must read; that includes hero images and
  infographics whose text matters.

## 15. The production metadata audit method (P1)

- Fetch the rendered `<head>` of every route in a scripted pass against the production build —
  `curl`/fetch per URL — and diff titles, descriptions, canonicals and OG tags across routes. Source
  review cannot see what a metadata factory produces, and a diff across routes is how duplication is
  found.
- Assert on the response, not the DOM after hydration: status codes for the 404 checks, raw HTML for
  the metadata checks, `robots.txt` and sitemap bodies as text.
- The trap this section exists for: **duplicating metadata across pages while believing the framework
  default covers it.** A root-level default title/description is a fallback for pages that forget to
  set their own, not a substitute — every page that renders the identical string is a defect the diff
  will show immediately.
- Re-run the metadata audit after every batch that adds a route, because new routes are the ones that
  ship without metadata.

## Checklist mapping

- `SEO-01` — unique title per indexable page
- `SEO-02` — unique meta description per page
- `SEO-03` — canonical URLs declared
- `SEO-04` — robots.txt correct
- `SEO-05` — XML sitemap generated and cached
- `SEO-06` — Open Graph metadata complete
- `SEO-07` — social share image renders correctly
- `SEO-08` — Twitter/X card metadata present
- `SEO-09` — structured data only where truthful
- `SEO-10` — breadcrumbs where hierarchy exists
- `SEO-11` — internal linking connects related pages
- `SEO-12` — SEO-friendly URL structure
- `SEO-13` — invalid URLs return 404, not soft 200
- `SEO-14` — private surfaces excluded from indexing
- `SEO-15` — per-page metadata not identical site-wide
- `SEO-16` — image and asset SEO details handled
- `SEO-17` — per-resource social preview for shareable content
- `SEO-18` — production origin used in metadata
