# Goal

Create and publish an independent Best Buy concept demo showing a quiet, cursor-attached shopping agent with visible browser-local memory and a three-finalist college-laptop flow.

# Current status

The verified baseline is published at `https://angry-tacoz.github.io/best-buy-blue-concept/`. A CAD-aware memory comparison is implemented locally and awaiting its focused PR, CI, merge, and Pages deployment. The local development server remains available at `http://127.0.0.1:4173/` for this session.

# Decisions

- Public, low-risk static concept; fictional products and illustrative prices only.
- Warm stone and oatmeal surfaces replace pure-white retail space.
- Desktop-only pointer experience with an explicit small-screen notice.
- Memory starts enabled with immediate disclosure and remains inspectable, editable, disableable, clearable, and restorable.
- Recommendation logic is deterministic and returns one ultralight, one durable, and one value finalist.
- The seeded profile includes a CAD class. Supported CAD terms activate explicit GPU, installed-memory, and performance weighting.
- Turning memory off preserves the saved scenario but intentionally ignores it, returning generic tips and changing the first finalist from dedicated to integrated graphics.
- No API, backend, authentication, analytics, live Best Buy data, model calls, or checkout.

# Changed files

- React/TypeScript application under `src/`
- Unit/component and Playwright coverage under `tests/`
- Verification, CI, Pages deployment, and documentation configuration
- CAD-aware scoring, editable coursework, product GPU/RAM specifications, and the memory-impact comparison

# Verification

- Lint, strict TypeScript, and production build passed.
- Sixteen unit/component tests passed.
- Fourteen Playwright tests passed across 1440×900 and 1024×768, covering editable CAD coursework, the memory-on/off shortlist change, the primary flow, memory disable/restore, overflow, reduced motion, no-audio behavior, and automated accessibility.
- Axe reported no serious or critical violations after entrance motion settled.
- Local HTTP returned 200 and browser interaction checks showed no console errors.
- Canonical verifier returned `PASS` for declared scope `public-low-risk`.
- Predeployment secret/API exposure scan passed.
- GitHub Verify and Pages workflows passed on the merged source state.
- The deployed application returned the expected title, catalogue, product imagery, memory disclosure, and shortlist controls at the public URL.
- Public browser checks at 1440×900 and 1024×768 found no page-origin console errors or horizontal overflow.

# Next task

Open a focused PR for the CAD-memory comparison, complete CI, merge, deploy Pages, and smoke-test the updated public URL.

# Risks or blockers

- No release blocker remains for the declared public, low-risk static-demo scope.
- Products, pricing, reviews, availability, saved memory, and recommendations are illustrative—not live retail data.
