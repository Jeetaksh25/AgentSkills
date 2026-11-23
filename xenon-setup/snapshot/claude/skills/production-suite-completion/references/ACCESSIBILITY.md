# Accessibility — operable, announced, legible

Accessibility is not a score. A page can score 1.0 on an automated audit and still be impossible to
use with a keyboard, because automated rules check markup, not interaction. Audit the tree, then use
the product the way a keyboard user does: Tab only, no mouse.

## 1. Native semantics before ARIA (P0)

- Buttons are `<button type="button">` (or `type="submit"` inside a form). Links that navigate are
  `<a href>`. A clickable `<div>` loses Space/Enter activation, role announcement, form submission
  and disabled semantics — rebuilding them with `tabindex` and key handlers is strictly worse than
  the native element.
- ARIA changes the announced name and role; it adds no behaviour. `role="button"` does not make an
  element focusable or activatable by the keyboard.
- **`aria-label` on a role-less `div` does nothing.** Some roles are name-prohibited, and a plain
  `div` has no role, so the label is ignored by assistive tech. Put the name where a role exists, or
  make the element genuinely semantic.
- One `role="alert"` per message. Never nest `role="alert"` inside `role="alert"` — the inner one
  re-announces the whole subtree and the user hears the message twice, garbled.
- Prefer `<dialog>` or a correctly-roled modal over a hand-rolled overlay; if hand-rolled, the full
  contract in §5 applies.
- Landmarks: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`. One `<main>` per page. Multiple
  `<nav>` elements get distinguishable accessible names.

## 2. Headings and structure (P1)

- Exactly one `<h1>` per page, and it describes the page's content. Two H1s (usually a site logo H1
  plus a page-title H1) is a defect; demote the logo to a link or a `div`.
- No skipped levels: `h1 → h2 → h3`. Visual size is CSS; heading level is structure. A card title
  that needs to look small is still whatever level the hierarchy requires — style it with a class.
- Headings describe content, not styling or position ("Account settings", not "Big text" or "Left
  column").
- Do not use a heading for a decorative or repeating label; use a paragraph.
- Modal and route changes should present a new H1/heading so screen-reader users know the context
  changed.

## 3. Labels and form semantics (P0)

- Every input has a **programmatically associated** label: `<label for>` matching the input `id`, or
  `aria-labelledby` pointing at real text. Wrapping the input in the label also works and is fine.
- Placeholders are not labels. They vanish on input, fail contrast rules frequently, and are not
  reliably announced as the name. A form whose only label is a placeholder fails this item.
- Help text and error text are linked with `aria-describedby` so they are announced with the field.
  Multiple ids are space-separated.
- Errors are not color alone: the message carries a text/icon cue, and the field sets
  `aria-invalid="true"`. Red border plus red text with no words fails both contrast intent and this
  rule.
- Required fields are indicated programmatically (`required`, or `aria-required="true"`), not only by
  a red asterisk whose meaning is unexplained.
- Group related controls with `<fieldset>`/`<legend>` (radio groups, address blocks, date parts) so
  the group name is announced.
- Validation timing: validate on submit and on blur, clear an error as soon as the user corrects it.
  Validating on every keystroke of a length-constrained field announces errors mid-typing.
- On submit failure, move focus to the error summary or the first invalid field, and make the summary
  links jump to each field.

## 4. Keyboard operability (P0)

- Every interactive element is reachable and operable with Tab/Shift+Tab, Enter, Space and arrows as
  appropriate. Test by removing the mouse entirely through each core flow.
- No positive `tabindex`. `tabindex="1"` reorders the whole document's tab sequence and makes the
  rest of the page unpredictable. Use DOM order.
- `tabindex="-1"` is the correct tool for programmatic focus targets (dialog container, skipped-to
  heading).
- Escape closes overlays: dialogs, popovers, menus, comboboxes, mobile nav. Every one of them.
- Composite widgets follow the expected pattern: menu/tabs/tree use arrow keys and roving
  `tabindex`; listbox uses arrows and type-ahead; combobox uses arrows plus Enter/Escape. Do not
  invent a pattern for a widget that already has a WAI-ARIA authoring practice.
- Focus is never trapped accidentally: a container with `tabindex` plus a key handler that eats Tab
  will strand users. Only dialogs trap focus (§5).
- Scrollable regions (a table with `overflow: auto`) need `tabindex="0"` and an accessible name, or
  keyboard users cannot scroll them.

## 5. Dialog focus contract (P0)

- On open: focus moves **into** the dialog (first meaningful control, or the dialog itself if the
  content is textual).
- While open: focus is **trapped**; Tab and Shift+Tab cycle within the dialog only.
- Background content is **inert** — `inert`, `aria-hidden="true"` on siblings, or the native
  `<dialog>` modal behaviour. A visually dimmed but tabbable background is a P0.
- The dialog is announced with its accessible name, wired via `aria-labelledby` to the visible title;
  a description via `aria-describedby` where the body explains consequences.
- On close: focus **returns to the trigger**. Focus falling to `<body>` is the classic defect — the
  user loses their place entirely.
- Escape closes; the close/cancel control is reachable; opening does not auto-focus a destructive
  primary button.
- Content behind the dialog does not scroll while it is open, and the scroll position is restored on
  close.

## 6. Contrast (P0)

- WCAG AA: **4.5:1** for body text, **3:1** for large text (≥24px, or ≥18.66px bold) and for UI
  component boundaries, icons and focus indicators.
- Measure the **computed style** of the live element (`getComputedStyle`, or a browser extension that
  reports the rendered pair) — not the palette source. Themes, alpha layers, dark mode and CSS
  variables frequently resolve to a different pair than the design tokens suggest.
- Over images, gradients and translucent surfaces, contrast depends on the rendered backdrop at that
  pixel. Fix with a scrim/overlay or a solid text background; do not assume the average image
  luminance.
- Check the muted text (`#999`-style secondary copy, timestamps, helper text) and borders/divider
  lines — the two places dark themes fail most. Headings are usually fine and prove nothing.
- Disabled controls are exempt from the ratio, but must still be distinguishable from enabled ones by
  more than opacity alone when the state matters.
- Focus indicators need 3:1 against both the component and the surrounding background, and must be
  visible in the dark theme as well as the light one. Test both.
- Placeholder text is not exempt; if it is used as hint text it must meet contrast (and it is still
  not a label, §3).

## 7. Reduced motion (P1)

- Honour `prefers-reduced-motion: reduce` for every non-essential animation: entrances, parallax,
  auto-playing carousels, shimmer/pulse skeletons, page transitions, animated counters.
- Library defaults count. Many carousel, chart and animation libraries animate by default; pass the
  reduced-motion option or gate the component. "Our CSS respects it" is not true when the library
  does not.
- Essential motion (a progress bar reflecting real progress) may remain; reduce it, do not remove the
  information.
- Implement inside a `@media (prefers-reduced-motion: reduce)` block that disables transition and
  animation durations, and check the toggle in devtools during the audit.
- Vestibular triggers: large-area movement, zooming, parallax and spinning loaders are the ones to
  cut first.

## 8. Alt text policy (P1)

- **Meaningful** image: describe the information it conveys in context, in one sentence, not its
  appearance. The same photo needs different alt on a product page and in a blog post.
- **Decorative** image: `alt=""` (empty, present). Omit the `alt` attribute entirely and screen
  readers may announce the filename.
- **Functional** image (icon inside a link or button): alt describes the action ("Search"), not the
  picture. If the control already has a visible text label, the icon is decorative — `alt=""`.
- No keyword stuffing, no "image of"/"picture of" prefixes (the role is already announced), no
  filename as alt (`IMG_2043.jpg`).
- Images of text carry the text in alt; better, replace them with real text.
- Complex images (charts, diagrams) need a short alt plus a longer description nearby or via
  `aria-describedby`.

## 9. Decorative glyphs and numbers (P1)

- Rank numbers, bullet glyphs, emoji used as icons, and index counters announced before every row
  are noise: the screen reader says "1, 2, 3…" or "star, star, star" over the content. Mark them
  `aria-hidden="true"` and convey any real meaning in the accessible name of the row or control.
- A rank that carries meaning must be in the accessible name ("Rank 3 of 12"), not only in a hidden
  visual.
- Icon-only buttons need an accessible name (`aria-label` or visually hidden text); the SVG itself is
  decorative and gets `aria-hidden="true"` plus `focusable="false"`.
- Repeated "→", "•", separators and chevrons in lists and breadcrumbs are decorative; hide them or
  use CSS pseudo-content, which is not announced.
- Decorative SVGs without a `<title>` are announced as "graphic" — add `aria-hidden` unless they mean
  something.

## 10. Live regions (P1)

- `aria-live="polite"` for async results the user is waiting for: filter result counts, "3 results
  updated", background-save confirmations. `role="status"` is the polite shorthand.
- `role="alert"` / `aria-live="assertive"` only for errors and time-critical failures; assertive
  interrupts whatever the user is reading, so it must be rare.
- Announce filter and search result counts, and the outcome of a bulk action ("12 items deleted").
- Avoid double announcement: one live region per message. If a toast and an inline message both carry
  the same error, only one of them is announced. Nested alerts are the same bug in markup form (§1).
- The live region must exist in the DOM **before** the text is inserted. Mounting a region with its
  message already inside often announces nothing.
- Do not put a live region around content that changes on every keystroke; debounce or announce only
  the settled result.
- Toasts must not move focus; announce instead (§4 of `UX.md` for the toast/inline split).

## 11. Language and direction (P1)

- `<html lang="en">` (correct BCP-47 tag) on every page; a missing `lang` makes screen readers use
  the wrong voice and breaks hyphenation and translation tooling.
- `dir="rtl"` where the content is right-to-left, and `dir="auto"` on user-generated text blocks so
  the browser infers direction per element.
- Inline foreign-language phrases get their own `lang` attribute; otherwise they are pronounced with
  the wrong phonology.
- Language is per-page, not per-site: a single-locale tag on a multi-locale app is a defect.

## 12. Skip links and landmarks (P2)

- A "Skip to main content" link is the first focusable element on the page, visible on focus (not
  `display: none` until hover in a way that traps it), and targets the `<main>` element with
  `tabindex="-1"` where needed.
- Landmark structure matches the visual page: one `banner`, one `main`, one `contentinfo`; navs are
  labelled when there are several.
- The footer and header must not be inside `<main>`; a persistent shell wrapping everything in
  `main` breaks the skip link's whole purpose.

## 13. The automated gate is not the gate (P0)

- Lighthouse accessibility **1.0**, or a per-audit written waiver naming the audit id and the reason.
  A waiver for "color-contrast" with a real justification (brand-mandated disabled state) is
  acceptable; an unexplained waiver is not.
- Run axe (the full rule set, including best-practice rules) against **every** public route and the
  key authenticated ones, via browser automation, on the production build.
- Automated tools catch roughly a third of real issues: they can verify a label exists, not that it
  is meaningful; that a name exists, not that it makes sense; that roles exist, not that focus order
  is sane.
- The manual pass covers what automation cannot: keyboard-only traversal of each core flow, dialog
  focus entry/trap/return, screen-reader reading order (NVDA/JAWS/VoiceOver on at least one flow),
  contrast of dynamic themes, and zoom to 200% without loss of content.
- **The trap:** passing automated a11y while remaining unusable with a keyboard. Score 1.0 plus a
  dialog that never receives focus, or a custom dropdown with no arrow-key support, is a false green.
  Record the manual evidence (flow, keys pressed, observed focus) alongside the score.

## Checklist mapping

- `A11Y-01` — native semantics over ARIA substitutes
- `A11Y-02` — one logical H1, ordered headings
- `A11Y-03` — programmatic label on every input
- `A11Y-04` — keyboard reaches every control
- `A11Y-05` — visible focus indicators
- `A11Y-06` — modal focus trapped and restored
- `A11Y-07` — WCAG AA contrast met
- `A11Y-08` — reduced motion respected
- `A11Y-09` — meaningful alt text on images
- `A11Y-10` — decorative images hidden
- `A11Y-11` — dynamic changes announced
- `A11Y-12` — decorative numbers and glyphs hidden
- `A11Y-13` — errors associated with fields
- `A11Y-14` — no nested or duplicate alerts
- `A11Y-15` — automated accessibility gate passes
- `A11Y-16` — page language and direction set
