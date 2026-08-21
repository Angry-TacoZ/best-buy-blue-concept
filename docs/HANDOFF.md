# Goal

Create and publish an independent Best Buy concept demo showing a quiet, cursor-attached shopping agent with visible browser-local memory and a three-finalist college-laptop flow.

# Current status

The memory-curated vertical slice is merged and published at `https://angry-tacoz.github.io/best-buy-blue-concept/`. PR #4 passed CI and was squash-merged to `main` as `2a2771d7ad122a9f23d5a7c1dc29e68c1b93f8d3`. Memory-snapshot curation now carries one laptop from the landing page through an illustrative checkout and completion state. The existing landing, catalogue, shortlist, memory comparison, and Blue behavior remain intact.

The `codex/fix-finalists-navigation` branch fixes the header `Finalists` link so it reveals and scrolls to the same shortlist as the yellow `Show three finalists` button. A blocking external AI review finding about keyboard focus has been addressed: Enter-key activation now moves focus to the newly rendered shortlist heading while mouse/touch activation remains scroll-only. The published site does not include this fix until the branch is re-reviewed, merged, and deployed.

# Decisions

- Public, low-risk static concept; fictional products and illustrative prices only.
- Warm stone and oatmeal surfaces replace pure-white retail space.
- Desktop-only pointer experience with an explicit small-screen notice.
- Memory starts enabled with immediate disclosure and remains inspectable, editable, disableable, clearable, and restorable.
- Recommendation logic is deterministic and returns one ultralight, one durable, and one value finalist.
- The seeded profile includes a CAD class. Supported CAD terms activate explicit GPU, installed-memory, and performance weighting.
- Turning memory off preserves the saved scenario but intentionally ignores it, returning generic tips and changing the first finalist from dedicated to integrated graphics.
- No API, backend, authentication, analytics, live Best Buy data, model calls, or transactional checkout.
- Curation is created only when the shopper clicks the new landing-page action. It stores a typed snapshot of memory rather than reading mutable preferences throughout the journey.
- Checkout is a local simulation with no personal-data fields, payment details, reservation, or purchase side effect.

# Changed files

- React/TypeScript application under `src/`
- Unit/component and Playwright coverage under `tests/`
- Verification, CI, Pages deployment, and documentation configuration
- CAD-aware scoring, editable coursework, product GPU/RAM specifications, and the memory-impact comparison
- `README.md` copy refinement
- `src/lib/curation.ts` and typed journey state for generation-time memory snapshots
- New curated-laptops, journey-header, checkout, and completion presentation components
- A new landing-page curation handoff; existing sections and interactions remain in place
- Shared shortlist-reveal behavior for the header `Finalists` link and yellow finalist button, with unit and Playwright regression coverage
- Keyboard-origin tracking, a programmatically focusable shortlist heading, and visible heading focus treatment for accessible navigation

# Verification

- Lint, strict TypeScript, and production build passed.
- Nineteen unit/component tests passed, including generation-time snapshot immutability and memory-off curation.
- Sixteen Playwright tests passed across 1440×900 and 1024×768, covering the existing experience plus the generated curation, checkout, and no-purchase completion path.
- Axe reported no serious or critical violations after entrance motion settled.
- Local browser inspection confirmed the curated, checkout, and completion layouts, no horizontal overflow, and no page-origin console errors.
- Canonical verifier returned `PASS` for declared scope `public-low-risk`.
- Predeployment secret/API exposure scan passed.
- GitHub Verify and Pages workflows passed on the merged source state.
- The deployed application returned the expected title, catalogue, product imagery, memory disclosure, and shortlist controls at the public URL.
- Public browser checks at 1440×900 and 1024×768 found no page-origin console errors or horizontal overflow.
- PR #2 and both post-merge GitHub workflows passed on merge commit `c8c1c2478d7a66dc3293ac50a0ff20ada7bd059b`.
- Live smoke testing confirmed memory-on finalists `HALO 14 / FORGE 14 / ATLAS 14`, memory-off finalists `AER 13 / FORGE 14 / ATLAS 14`, no horizontal overflow, and no page-origin console warnings or errors.
- PR #4, post-merge Verify, and GitHub Pages deployment passed for merge commit `2a2771d7ad122a9f23d5a7c1dc29e68c1b93f8d3`.
- Public smoke testing confirmed three CAD-aware curated products, HALO 14 checkout continuity, the no-purchase completion state, zero checkout overflow, and no page-origin warnings or errors.
- The finalist-navigation fix passed the canonical verifier: ESLint, strict TypeScript, 20 unit/component tests, and production build.
- The complete Playwright suite passed with 17 tests and one intentional compact-width skip; the header link revealed three finalists and scrolled the shortlist into view at 1440px, while header navigation remains intentionally hidden below 1100px.
- The external review focus finding was reproduced with a failing real Enter-key Playwright test, then verified passing with focus on the shortlist heading. The complete verifier and Playwright suite passed again after the fix.

# Next task

Re-review the finalist-navigation fix. After approval, merge and deploy through the existing GitHub Pages workflow. Real transactional integration remains intentionally out of scope.

# Risks or blockers

- The external review finding is addressed, but re-review approval is still required before merge under the workspace review gate.
- Products, pricing, reviews, availability, saved memory, and recommendations are illustrative—not live retail data.
- Checkout demonstrates continuity and human approval only; it must not be mistaken for transactional functionality.
