# Branding — the details that make it read as a real product

Branding items are all small, all visible, and all individually cheap. What they have in common: a
user notices them only when they are wrong. A missing favicon, a placeholder OG card or a footer
full of dead links does not fail a test — it tells the visitor the product is a weekend project.
Verify each one on a real surface (tab, unfurl, install prompt, inbox), never in source.

## 1. Icons and favicon set

Serve, from the site root, so no path prefix or redirect breaks them:

| File | Purpose |
|---|---|
| `favicon.ico` | legacy browsers and bookmarks; 16/32/48 multi-size inside one ICO |
| `favicon.svg` | modern browsers; scales cleanly at any DPI |
| `icon-192.png`, `icon-512.png` | manifest icons (`512` also used for install/splash) |
| `icon-512-maskable.png` | Android adaptive icon: mark inside the safe zone (inner ~80%) |
| `apple-touch-icon.png` | 180x180, **opaque** background, no transparency, no rounded corners |
| `og-image.png` | 1200x630, referenced by every page's metadata |

- Declare them in the document head in addition to the manifest; do not rely on a bundler convention
  alone if the deployed path prefix differs from the framework's assumption.
- **Verify in the network panel**: load the production origin, filter for `favicon`, `icon`,
  `apple-touch`, `manifest` — every request resolves to 200 with the right `Content-Type`. A 404 on
  `favicon.ico` (or on a file the framework expects under a different prefix) is the single most
  common branding defect, and it is invisible in the source.
- Check the tab itself: some browsers cache aggressively — hard-reload or a fresh profile before
  concluding it is missing.
- A dark-mode-only logo on a transparent SVG becomes invisible in a light tab; if you ship
  `favicon.svg`, include a `prefers-color-scheme` media query inside the SVG, or keep a
  light-background-safe mark.
- Sizes matter: a 500x500 PNG declared as 180x180 will be letterboxed by iOS. Write the real
  dimensions in the manifest and the link tags, matching the file on disk.
- Cache-bust after replacing icons (hashed filename or a query string); a stale icon survives
  redeployment in the CDN and in browser caches for weeks.

## 2. Web app manifest

- Required fields, each consistent with the real brand: `name` (full product name), `short_name`
  (what fits under an icon), `start_url`, `display` (`standalone` or `minimal-ui`), `theme_color`,
  `background_color`, `icons` with `sizes`, `type` and `purpose`.
- `name`/`short_name` must match the product name used in the UI, the legal pages and the emails. A
  manifest still carrying the template's project name is a tell.
- `theme_color` and `background_color` must be the actual palette, not `#ffffff` from a scaffold —
  they drive the splash screen and the installed-app chrome, where a wrong colour looks broken.
- `start_url` must be a real route that renders for an unauthenticated visitor (a marketing or login
  page), not a route that immediately redirects into an error.
- Verify by installing: the install prompt appears, the installed window opens at `start_url` with
  the right name and icon, and the splash uses the declared background. Also fetch the manifest URL
  directly and check it parses as JSON — a trailing comma or a framework-managed route returning
  HTML both read as "no manifest" to the browser.
- Manifest and metadata must agree: `theme_color` in the manifest, `theme-color` in the head, and
  any `viewport`/`color-scheme` declarations should describe the same visual product.

## 3. Browser theme color

- Emit `theme-color` per scheme, with an explicit media query — one value is wrong for one of the
  two themes, and the mismatch shows as a light URL bar above a dark page (or vice versa):
  `<meta name="theme-color" content="#f8fafc" media="(prefers-color-scheme: light)">` and the dark
  variant beside it.
- Match `color-scheme` to the themes actually implemented, so form controls, scrollbars and the
  default canvas agree with the app instead of flashing white.
- The declared colour must equal the rendered header/background behind it; sample it from a live
  page in both themes rather than from the palette file — tokens, opacity overlays and gradient
  headers routinely differ from the raw value.
- If the page changes theme at runtime (a theme toggle), update or re-resolve the meta tag; a
  hardcoded `theme-color` next to a working toggle is a visible inconsistency on mobile.

## 4. The default OG image

- One composed, on-brand 1200x630 card used as the site-wide default, plus per-page overrides where
  a page has a meaningful distinct preview (product, article, pricing).
- It is not a logo on a colour block. Include what a stranger needs to decide to click: product name,
  a one-line value proposition, the mark. **The copy must be legible at thumbnail size** — check it
  scaled to ~200px wide; body text under ~40px at full size disappears.
- Correct absolute URL in `og:image`, with `og:image:width`/`height` and `og:image:alt` matching the
  file. A relative URL resolves differently depending on the crawler's base and silently produces a
  blank preview.
- **Verify by unfurling a real link** — send the production URL to a chat client or a card validator
  and look at the rendered preview, or fetch the image URL directly and confirm it is a PNG/JPEG of
  the declared size. Do not verify by reading the meta tags; a tag pointing at a 404 passes every
  source-level check.
- A framework-generated placeholder card (a gradient with the route path) is worse than a designed
  one only if it is unbranded. If you must generate, inject the real logo and brand colours — a
  default grey card reads as unfinished.
- Cache-bust the OG image when it changes: crawlers and chat clients cache previews for days.

## 5. Footer as a commercial signal

- Group links, don't stream them: **Product** (features, pricing, changelog, status),
  **Company** (about, contact, careers if real), **Resources** (docs, help, blog, API), **Legal**
  (privacy, terms, cookies, DPA). Four columns render on desktop and stack or collapse on mobile.
- **Every link resolves.** A footer is where dead links accumulate: `href="#"`, a route that was
  renamed, a page never built, a link to a template's demo. Crawl every footer link against the
  production build and record the status codes.
- Remove the link instead of pointing it at `#`. A dead legal link is a trust problem, not a
  cosmetic one (LEGAL.md).
- **A support/contact entry point is mandatory** and must lead somewhere a human answers: a contact
  page, a support address on the product's own domain, or a documented help route — not "coming
  soon", not a mailto to a personal address, not a chat widget with no fallback.
- Include the product name and, where the site represents a registered entity, the legal entity and
  address (LEGAL.md §company). Never invent an entity, registration number or address — build the
  structure and mark the placeholder.
- Copyright: `© <current year> <product name>`, using the **same product name as everywhere else**.
  A hardcoded year from the template is the most common footer defect; compute it or update it in
  the same run.
- Mobile: no wall of links. Collapse groups behind a disclosure or lay them out in short columns;
  check that the footer does not consume multiple screens before the last row is reachable.
- Verify the rendered footer: every group present, every link 200 (or an intentional external 3xx),
  the year correct, and no truncated or overlapping text at 360px width.

## 6. Navigation coherence

- Every primary route reachable from the header on a desktop viewport, and from the mobile pattern
  on a 360px viewport. Reachable means one action from the landing page, not three taps deep.
- Active state visible and distinguishable by more than colour alone (weight, underline, indicator)
  — colour-only active state fails for low-vision users and is a common "looks unfinished" bug.
- The mobile pattern (drawer, sheet, bottom bar) **must not hide the main action**. If the primary
  CTA is a signup or a start action, it stays visible outside the collapsed menu, or the menu opens
  with it as the first item.
- Keyboard and screen-reader coherence: the mobile menu button has an accessible name and an
  expanded/collapsed state; opening the menu traps focus and closing returns focus to the trigger
  (ACCESSIBILITY.md).
- Navigation labels match the page titles they lead to. A nav item "Pricing" landing on a page
  titled "Plans" is small; three such mismatches is a coherence problem.
- Deep links and back/forward must work: every nav target is a real URL (not a client-side state
  change), so a user can share it and refresh it.
- Verify by driving the real browser at both viewports: enumerate the nav links, follow each, assert
  the destination rendered and the active state landed on the right item.

## 7. Brand and copy consistency

- **One product name, spelled identically** in the UI, page titles, metadata, manifest, emails,
  invoices, legal pages, error messages and the footer. Grep the codebase for the variants
  (casing, hyphenation, old codename) and eliminate them — a stray template name in a meta tag is
  the loudest possible signal that nobody reviewed the build.
- **No lorem ipsum, no template copy, no placeholder names** anywhere in shipped surfaces — including
  alt text, `aria-label`s, empty states, email templates, `README` shown publicly, and the manifest.
  Run a scan (`lorem ipsum`, `Lorem`, `Your Company`, `Acme`, `MyApp`, `example.com`) and fix every
  hit on a production route.
- Tone of voice: one register across marketing, product and transactional copy. Button labels,
  errors and emails should sound like the same product. A chatty empty state next to a legalistic
  error message reads as two different apps.
- Capitalisation conventions for feature names, headings and buttons stay consistent (pick sentence
  case or title case for headings and hold it).
- **Logo variants for light and dark**: a dark-ink logo on a dark background is invisible. Ship both
  (or a currentColor/masked SVG) and switch with `prefers-color-scheme` or the app's theme class;
  check each surface — header, footer, email (which has no CSS variables), OG image, favicon.
- Alt text for the logo is the product name, or empty when the name is adjacent text — not "logo",
  not the filename (ACCESSIBILITY.md).
- Every user-visible string is reviewable: keep copy in one place per surface so the next pass does
  not chase wording through components.

## 8. Transactional email branding

Templates required for a complete product: address **verification**, **password reset**, **welcome**,
**notification** (the generic account/security notice), and **deletion confirmation** (account or
data deletion). If the product sends invoices or receipts, they belong to this set.

- Same brand as the app: logo (hosted at an absolute URL on the product domain), palette, typography
  fallbacks, consistent header/footer, the same product name.
- **Every template has a plain-text alternative**, and the text version carries the same action link.
  A text/plain-only recipient who cannot reset their password is a broken account.
- Sender identity matches the domain that actually sends: a `From` on the product's domain with the
  domain authenticated (SPF/DKIM/DMARC), and a `Reply-To` that a human reads. A `no-reply@` from a
  third-party or template domain is a deliverability and trust problem.
- Subject lines are specific and branded (`Reset your <Product> password`), not `Notification` or
  `[Template] Confirm your account`.
- Links are absolute `https` URLs on the production domain, built from configuration — never
  `localhost`, never a relative path, never a hardcoded preview URL. Fetch every link in the rendered
  email and confirm status 200 (or the expected redirect) before considering the template done.
- No sensitive data in the body or in the URL: no passwords, no full account records, no internal
  IDs, no tokens in a query string that lands in referrer headers or analytics. Tokens are scoped to
  one purpose and one account, single-use and expiring — cross-reference SECURITY.md §3.
- Deletion confirmation states what was deleted, what is retained and for how long, and how to
  contact support — this is a legal/trust surface as much as a branding one (LEGAL.md).
- Verify by rendering and by sending: render each template (including the text part) and send at
  least one real message to a real inbox on a supported client, then read it on mobile. Email clients
  strip CSS and block images by default — check the design survives images-off and dark mode.
- Preview/personalisation tokens must never reach a live send: a message that arrives reading
  `Hi {{firstName}}` is a visible defect and a data-quality bug.

## 9. The small-detail sweep

Everything a first-time visitor sees in their first minute. Each line is "make it look like a real
product", and each is verifiable.

| Surface | Check |
|---|---|
| Browser tab | favicon renders, title is the page's real title (not the template's), no duplicated app name |
| Share preview | OG title, description and image render correctly in a real unfurl, on the landing page and one deep page |
| Install prompt | manifest is valid, install works, icon and name are correct after install |
| 404 page | branded, explains what happened, offers navigation back and a search/help route, returns a real 404 status (SEO.md) |
| Error pages | boundary/500 page branded, no stack trace, offers reload/back and a support route, distinct from the 404 (UX.md) |
| Loading/empty states | no unstyled flash of raw text or default spinner where the product should be visible |
| Auth screens | logo, product name and copy match the rest of the site; no default framework auth UI |
| Print/share artefacts | browser print and "copy link" produce something presentable (no clipped layout, no `localhost`) |
| Social metadata | every public page carries the product name in `og:site_name`, not the framework's |

- Sweep order: production build → open the landing page in a clean profile → tab icon, title, share
  preview, then a 404 URL, then a route behind auth, then install. Screenshot each; the screenshots
  are the evidence.
- Anything that says "Example", "MyApp", the framework name or the template author is a P0-grade
  brand defect even though its severity is P2 — it is the first thing a reviewer sees.

## Checklist mapping

| ID | Item |
|---|---|
| BRAND-01 | Favicon and icon set complete |
| BRAND-02 | Touch icon and manifest |
| BRAND-03 | Theme color both schemes |
| BRAND-04 | OG image on-brand, verified |
| BRAND-05 | Footer complete, links resolve |
| BRAND-06 | Navigation coherent, mobile action visible |
| BRAND-07 | Name and tone consistent |
| BRAND-08 | Transactional emails branded |
| BRAND-09 | No sensitive data in email |
