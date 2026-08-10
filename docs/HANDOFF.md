# Goal

Create and publish an independent Best Buy concept demo showing a quiet, cursor-attached shopping agent with visible browser-local memory and a three-finalist college-laptop flow.

# Current status

The full visual and functional draft is running locally at `http://127.0.0.1:4173/` on branch `codex/ambient-blue-demo`. Local verification is complete; GitHub publication and Pages deployment are next.

# Decisions

- Public, low-risk static concept; fictional products and illustrative prices only.
- Warm stone and oatmeal surfaces replace pure-white retail space.
- Desktop-only pointer experience with an explicit small-screen notice.
- Memory starts enabled with immediate disclosure and remains inspectable, editable, disableable, clearable, and restorable.
- Recommendation logic is deterministic and returns one ultralight, one durable, and one value finalist.
- No API, backend, authentication, analytics, live Best Buy data, model calls, or checkout.

# Changed files

- React/TypeScript application under `src/`
- Unit/component and Playwright coverage under `tests/`
- Verification, CI, Pages deployment, and documentation configuration

# Verification

- Lint, strict TypeScript, and production build passed.
- Twelve unit/component tests passed.
- Ten Playwright tests passed across 1440×900 and 1024×768, covering the primary flow, memory disable/restore, overflow, reduced motion, no-audio behavior, and automated accessibility.
- Axe reported no serious or critical violations after entrance motion settled.
- Local HTTP returned 200 and browser interaction checks showed no console errors.
- Canonical verifier returned `PASS` for declared scope `public-low-risk`.
- Predeployment secret/API exposure scan passed.
- Live deployment and smoke testing remain pending.

# Next task

Create the public GitHub repository, push the verified branch, open the draft PR, complete CI, merge, deploy Pages, and smoke-test the live URL.

# Risks or blockers

- GitHub Pages repository and permissions are not configured yet.
- Production readiness remains conditional until CI and the live smoke test pass.
