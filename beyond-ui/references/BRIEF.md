# Brief — from a one-line idea to a buildable spec, without asking

Load at phase 0. The user may give only a product idea ("an app for tracking ML experiments"). The
agent turns that into a complete brief itself. Asking the user to describe the UI is a failure of
this skill.

```bash
node <skill>/scripts/sources.mjs brief "<the idea, verbatim>" [--platform web|mobile|desktop]
```

That writes `.beyond-ui/brief.json` (platforms, surface, tags, search query) and `.beyond-ui/brief.md`
with TODOs. Complete every TODO:

1. **Product and audience.** Who buys, who uses, what they do today instead. Infer from the idea,
   the repo (README, package names, existing routes) and a web search for the category.
2. **Category leaders.** Web-search 3–5 competitors or adjacent products; note what users expect from
   them. These are content and feature evidence, not visual references.
3. **Platforms.** From the repo (`sources.mjs detect`) or the idea's words. "App" with no platform word
   and no repo means web; "mobile app" means Expo unless the repo says otherwise
   (`references/PLATFORMS.md`).
4. **Surfaces.** Marketing site, app UI, or both. An app idea gets the app UI first; a landing page is
   added only when the idea implies acquisition (launch, waitlist, pricing).
5. **Screens and sections.** Every page or screen, in order, each with its purpose and primary action.
6. **Domain content inventory.** What an expert in this domain expects to see. Write it as a checklist;
   the build fails review if any item is missing. Examples:
   - ML model dashboard: accuracy, precision, recall, F1, loss/accuracy curves, confusion matrix,
     parameters count, hyperparameters (learning rate, batch size, epochs, optimizer, schedule),
     dataset + version, training runs with status/duration/cost, latency, hardware, model card.
   - Notes app: capture, editor with formatting, search, tags/folders, sync state, shortcuts, empty state.
   - Fintech: balance, transactions with categories, spending chart, cards, transfers, security cues.
   - E-commerce: product grid, filters, PDP with gallery/variants/reviews, cart, checkout, order status.
7. **Theme and tone.** Only what the user or brand states. If nothing is stated, the anchor reference
   decides (FIDELITY.md). There is no default theme.
8. **Constraints.** Brand assets, stack, licences, deadlines.

Then continue straight into `sources.mjs pick` and `fetch`. Ask the user only for things that cannot
be inferred and would be wrong to invent: real customer names, real metrics, brand assets.
