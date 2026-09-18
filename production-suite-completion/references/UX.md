# UX — state coverage, friction, and failure recovery

Users never experience your happy path. They experience the slow request, the empty list, the double
tap, the expired session and the typo. Audit the states nobody designed, because that is where the
defects are. A surface that only implements loading and success is unfinished even when it looks
complete in development — development always has data and a warm cache.

## 1. The state matrix (P0)

Every async surface renders exactly one of these, and the audit enumerates them **per surface** from
the route table and component tree, never from memory.

| State | Trigger | Minimum requirement |
|---|---|---|
| idle | before first fetch | stable layout, no spinner for zero elapsed time |
| loading | request in flight | skeleton for content, spinner for actions, `aria-busy` on the region |
| partial | some queries resolved | render what arrived; never blank the page for a slow sibling query |
| empty — no data yet | success, zero records | explanation plus the primary next action |
| empty — no results | success, filters exclude everything | different copy, plus "clear filters" |
| error — retryable | 5xx, timeout, offline | plain-language cause, retry, escape hatch |
| error — permanent | 4xx, forbidden, validation | cause and what to do instead; no retry loop |
| success | write completed | confirmation that names what changed |
| offline | `navigator.onLine === false` or fetch rejected | banner, writes disabled, queued intent or explicit loss notice |

- Derive the rendered state from a discriminated union or an explicit `status` field. Deriving it
  from `items.length === 0` collapses "still loading" and "loaded, nothing there" into one UI — the
  single most common defect in this domain.
- **Partial is real.** A dashboard with four independent queries must not gate the four cards on
  `Promise.all`; a failing chart must not blank the table beside it.
- Record the evidence as a screenshot per state per surface. "The loading state exists" is a claim;
  the screenshot is the proof.

## 2. Loading and skeletons

- Skeletons must occupy the **final layout's dimensions**: same row height, same column count, same
  aspect ratio. A skeleton that is 40px shorter than the loaded row produces CLS and a visible jump.
- Delay the skeleton: mount it only after ~150–200ms in flight, and keep it visible for a minimum
  ~300ms once shown. Rendering instantly and vanishing on a 60ms cached response reads as a flicker
  and is worse than no skeleton at all.
- Never swap a skeleton for a spinner for the same region; never show both.
- Set `aria-busy="true"` on the updating region and keep the prior content mounted when refreshing
  in place — replacing a populated table with skeletons destroys scroll position and focus.
- Route-level loading UI must render the page shell (header, nav) so navigation feels instantaneous;
  a full-page spinner throws away the only part that was already correct.
- Placeholder "shimmer" must respect `prefers-reduced-motion`. See `ACCESSIBILITY.md` §7.

## 3. Empty states (P1)

Anatomy: **what happened · why · the next action.** All three, or it is not an empty state.

- "No data yet" and "no results for this filter" are different messages. Conflating them makes users
  believe the product is broken when their own filter is wrong. The filter case must offer
  "clear filters" / "show all" as a one-click action.
- The action must be a real control (button or link), not the word "try adding something".
- First-run empty states carry onboarding weight: name the object, give the one action that produces
  the first row, and link to help if the concept is non-obvious.
- Error-empty hybrids (fetch failed, so the list is also empty) render the **error** state. An empty
  state over a failed request tells the user their data is gone.
- Do not hide the empty state behind a "hide when empty" prop on a shared table component; that prop
  exists to suppress the message you actually need.

## 4. Error states (P1)

Copy contract: cause in plain language, what the user can do, and whether their data survived.

- Distinguish error copy from **validation** copy. "Something went wrong" over a field is wrong;
  validation speaks about the field, errors speak about the operation.
- Retry affordance only when retryable. A 403 or a schema rejection will fail again; offering
  "Try again" on a permanent error trains users to loop.
- Always give an escape hatch: back to the list, back to safety, contact support with the request id.
- Never render a stack trace, a raw error object, an HTTP status alone ("Error 500"), or a database
  message. Log the detail; show the sentence.
- Surface the correlation/request id in a copyable form when support is the next step, and map it to
  the server log line (see `OBSERVABILITY.md`).
- Distinguish "your change failed" (input preserved, safe to retry) from "we are not sure it
  succeeded" (timeout after a write — offer a status check or refresh, never a blind retry).

## 5. Success and the toast/inline split (P1)

- **Toast = additive acknowledgement.** Inline = anything the user must still act on. A warning the
  user must fix, a partial failure, a required next step — inline, next to the thing.
- A toast is never the only record of a failure. If it disappears, the evidence disappears. Errors
  that matter persist inline until resolved.
- Success toasts name the changed object ("Board archived"), not "Success". Success that is already
  visible in the UI (the row vanished) needs no toast at all.
- One notification system per app. Two libraries producing two visual languages is a defect the
  audit names explicitly.
- Toasts must not steal focus, must be dismissible, and must persist long enough to read a full
  sentence (or stay until dismissed for destructive/irreversible outcomes).
- Cap the stack; auto-dismiss duplicates emitted in the same tick.

## 6. Duplicate submission and input preservation (P0)

- Disable the submit control the moment it is activated and keep it disabled until the outcome is
  known. Keep the **action label** during the busy state — swapping it for "Updating…" changes the
  hit target's meaning and is read as a different button.
- Client-side disabling is an affordance, not a guarantee: the server must be idempotent for every
  write that matters (idempotency key, natural unique constraint, upsert). A network blip after the
  request left the browser is invisible to the disable flag.
- **Never clear the form on failure.** Preserve every field value, re-focus the first invalid field,
  and keep the user's scroll position. Losing a long form to a 500 is a support ticket.
- Preserve input across the auth boundary too: a session expiry mid-form must not discard the draft
  (§13).
- Debounce or gate rapid-fire actions (like/upvote, increment) so double clicks cannot enqueue two
  mutations, and reconcile the count from the server's authoritative value.

## 7. Optimistic updates — the contract (P1)

An optimistic update is a promise you must be able to break loudly.

- Render the predicted state immediately; on failure, roll back **with a visible reason** and
  preserve the user's input so they can retry. Silent revert is the defect: the UI changes, then
  changes back, and the user believes they are hallucinating.
- Never let a stale server value overwrite a newer local intent. If the user toggled at T=2 and a
  response for the T=1 request lands at T=3, the response is obsolete — carry a request sequence or
  timestamp per resource and discard out-of-order responses.
- Guard against the double-fetch race: an in-flight list refresh that resolves after a local mutation
  must merge with the mutation, not replace the list.
- Reconcile to the server's returned entity rather than to your prediction; predicted fields
  (server-computed totals, ids, timestamps) are exactly the ones you cannot guess.
- Optimistic updates are for reversible, low-stakes interactions. Money, deletions and irreversible
  state transitions wait for confirmation.

## 8. Destructive actions (P0)

- Confirm before the irreversible one: deletion, bulk overwrite, publish, send, permanent archive.
- The dialog **names the object** — "Delete *Q3 planning*?" — never "Are you sure?". The user must
  be able to verify they picked the right row without dismissing the dialog.
- Require explicit intent for bulk destructive actions: type the count or the object name, or a
  second-step confirm that states the number of affected records. A single click on a "select all"
  is not intent.
- Do not mix native `window.confirm` with a styled dialog. The pair produces two visual languages,
  blocks the main thread, cannot be styled, cannot show detail, and is the tell that the destructive
  path was an afterthought.
- State the consequence and the reversibility in the body: "This also removes 34 votes. This cannot
  be undone." If it can be undone, say so and offer the undo instead of a scare dialog.
- Keep the destructive button's label stable through the busy state; label the confirm button with
  the verb ("Delete"), not "OK".

## 9. Unsaved changes (P1)

- A dirty form warns on in-app navigation (router block / route guard) and on tab close
  (`beforeunload`).
- `beforeunload` caveats: it only fires on real unload, is ignored without a prior user gesture, and
  custom text is not displayed by modern browsers. It does **not** cover client-side route changes,
  so SPAs need the router-level guard too. Do not rely on it as the only protection.
- Prefer draft persistence over nagging: autosave the draft locally (or server-side) so the warning
  is a courtesy, not the only thing standing between the user and lost work.
- Track dirtiness by comparing against the last saved snapshot, not by a "any keystroke ever" flag —
  a user who types and undoes is not dirty.

## 10. Focus management (P1)

- After creating or opening something, move focus to the new content (the new row, the new panel,
  the dialog's first meaningful element). Never leave focus on a control that no longer exists.
- After closing a dialog or menu, restore focus to the element that opened it. **Focus dropping to
  `<body>` is the classic defect** — the keyboard user is teleported to the top of the document.
- Never steal focus for toasts, banners or live counters; announce them instead (§5, and
  `ACCESSIBILITY.md` §10).
- After an in-place list mutation that removes the focused row, move focus to the next logical row or
  the list container, not to `<body>`.
- After client-side navigation, move focus to the main heading or the main landmark so the next Tab
  starts in the new page rather than mid-way through the persistent shell.

## 11. 404 and error boundaries (P1)

- Custom 404: branded, navigable (the real nav and footer), with search or a path back to the main
  surface, and it must return a real 404 status for unknown routes *and* unknown records — see
  `SEO.md` §11 for the soft-404 trap.
- Route-level error boundary: branded, explains that this section failed, offers **reset/retry** in
  place, and does not take the whole app down. A single failing widget must not blank the shell.
- Root error boundary catches what route boundaries miss; it is the last resort, not the only one.
- Error boundaries do not catch: event-handler throws, async rejections outside React, or errors in
  the boundary itself. Those need explicit handling and a server-side log (`OBSERVABILITY.md`).
- The recovery affordance must actually reset the boundary state; a "Reload" that re-navigates to
  the same broken route without clearing the error state is theatre.
- In production, boundary UI shows a message and a correlation id — never the component stack.

## 12. Responsive audit (P1)

Method, not vibes. Drive the real pages at 375 / 768 / 1280 (and 1440+) and record per viewport:

- Horizontal overflow: `document.documentElement.scrollWidth > clientWidth` must be false. Find the
  offending element by walking for `offsetWidth > container`.
- Tap targets ≥ 44×44 CSS px (WCAG 2.5.8 minimum is 24; ship 44). Check icon buttons, table row
  actions, close buttons, pagination.
- Sticky CTA: it must not cover content, the last row of a list, or the footer — reserve padding via
  a spacer or `scroll-padding`. A sticky bar that hides the form's submit button below it is a P1.
- Mobile keyboard/overlay: fixed-position elements and `100vh` layouts break under the on-screen
  keyboard (`100dvh` and `visualViewport` are the fixes). Dialogs anchored to the viewport bottom
  must scroll, not clip.
- Horizontal scroll traps: `overflow-x: auto` on a table inside a narrow card needs a visible scroll
  affordance or a stacked mobile layout, not a silently cut-off column.
- Nav collapse: the mobile menu must be reachable, closable with Escape, and must not leave the
  underlying page scrollable while open.
- Sticky CTAs and their spacing belong to conversion work too — see `CONVERSION.md`.

## 13. Clipboard and share (P2)

- `navigator.share` exists on desktop Chrome but opens a **sheet that cannot copy**; it is not a
  clipboard. Always provide an explicit "Copy link" affordance alongside any share button.
- `navigator.clipboard` is unavailable on plain-HTTP origins (non-localhost) and in some embedded
  webviews. Feature-detect, and fall back to a hidden-textarea `document.execCommand('copy')` path or
  a selectable input the user can copy manually.
- Confirm the copy ("Link copied") — clipboard writes fail silently on permission denial, and the
  failure is otherwise invisible.
- Share URLs must be the canonical production URL, not the current `location.href` with its tracking
  params or a preview origin (see `SEO.md` §2).

## 14. Session expiry (P1)

- Detect expiry before the write fails (token `exp` where available) and prompt re-auth in place.
- Re-auth must not lose work: capture the draft, re-authenticate (modal or redirect with a return
  path), then restore the form and the exact route.
- A 401 mid-request should be retried automatically **once** after a successful re-auth, not surfaced
  as a generic error.
- On logout everywhere / revoked session, clear cached user data from the client store, not just the
  cookie, or the next user on the device sees the previous one's screen.

## 15. Offline and network failure (P0)

- Detect offline (`navigator.onLine`, `online`/`offline` events) and show a persistent banner;
  disable writes that cannot succeed rather than letting them fail after the round trip.
- Failed requests never silently drop user data. Either queue with a visible pending state, or tell
  the user plainly that the change was not saved.
- Retry with bounded backoff for idempotent reads; never auto-retry a non-idempotent write without an
  idempotency key.
- Distinguish "you are offline" from "the server is down" from "this request is invalid" — three
  different messages, three different user actions.
- Reconnect must reconcile: refresh the affected data, flush the queue, and confirm what was
  eventually saved.

## Checklist mapping

- `UX-01` — loading state on every async surface
- `UX-02` — skeletons for content-heavy surfaces
- `UX-03` — empty states explain and act
- `UX-04` — actionable error states
- `UX-05` — success confirmation for important actions
- `UX-06` — one consistent notification system
- `UX-07` — destructive actions require confirmation
- `UX-08` — unsaved-changes protection
- `UX-09` — offline and network failures handled
- `UX-10` — retry affordance on failed requests
- `UX-11` — custom 404 page
- `UX-12` — custom error boundary / 500 page
- `UX-13` — route-level server-error recovery
- `UX-14` — responsive audit across viewports
- `UX-15` — sticky mobile CTA where needed
- `UX-16` — primary CTA above the fold
- `UX-17` — focus management for dialogs and actions
- `UX-18` — no duplicate submits, input preserved
- `UX-19` — session expiry handled gracefully
- `UX-20` — optimistic updates roll back visibly
- `UX-21` — copy and share work on plain HTTP
