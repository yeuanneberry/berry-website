# Website and reader separation

The combined source at `yeuanneberry/yeuanneberry.moe`, revision
`d49e048dd003a4fce5591faab6237d1270b3f760`, was separated locally into two
independent repositories. The original checkout was renamed `berry-website`;
`berry-docs` was cloned locally with independent Git objects. Both retain the
original commit history. Historical revisions contain the combined application.

| Owner | Responsibility |
| --- | --- |
| berry-website | Portfolio, work case studies, public-code collection, About and website privacy |
| berry-docs | Documentation landing pages, `/docs/` reader, generated chapters, reader sync and integrity checks |
| berry-desktop | Canonical guides and desktop presets; unchanged by this extraction |
| berry-tools | Independent tools product; unchanged by this extraction |

The website no longer emits `/docs/` or chapter routes. Its header, footer and
pages have no docs-site links, and builds require no `DOCS_URL` setting. Website
statistics exclude docs destinations and reader events. The docs app retains its existing `/docs/` paths and
heading links. No live redirects are needed because neither site was deployed.

Each checkout owns its own `packages/config`, dependencies, pinned lockfile,
CI, tests and static output. There are no sibling source imports. The docs
project needs berry-desktop only when deliberately refreshing/verifying upstream
guide projections; ordinary builds use its checked-in reviewed chapters.

## Local review

In each repository, run `pnpm install --frozen-lockfile`, then `pnpm dev`.
The website uses port 4321; docs uses 4322. Both retain default noindex and
disabled analytics. Website browser tests use 4331 and local Cloudflare checks
use 4343. Docs uses separate test ports, so the suites can run independently.
Run `pnpm peers check` and `pnpm check` in each repository.

## Repository publication

The public source repositories are `yeuanneberry/berry-website` and
`yeuanneberry/berry-docs`. On 11 November 2026 the owner authorized publication;
the existing portfolio repository was renamed and the dedicated reader repository
was created after retained-history and asset-notice review. Each local origin
now identifies its own repository. The old GitHub repository address redirects;
it is not the website domain. Package and Workers names match these independent
products. Source publication does not deploy either site or enable analytics.
Domain purchase, hosting authentication and deployed acceptance remain separate.

## Recovery

The pre-split commit remains reachable in both repositories. Inspect it in a
separate worktree if recovery is needed; do not reset either working tree over
uncommitted work. Restore from that revision only after preserving the completed
split changes. The main checkout's folder move can be reversed only if its old
path is still unused. Unrelated Berry repositories are outside this migration.

## Historical initial website separation validation

Validated locally on 2026-11-11 with Node 26.13.0, pnpm 12.11.2 and the project's
pinned Playwright Chromium 1248. The first browser attempt could not launch
because only Chromium 1254 was installed; installing the pinned browser resolved
that environment mismatch.

- Frozen dependency installation and peer checks pass.
- `pnpm check` passes: deterministic portrait verification, zero type diagnostics,
  11 static pages, four metadata/indexing/analytics build fixtures, 39 passing
  browser tests. The phone-only header check is skipped in the desktop project.
- Local Cloudflare checks pass for headers, routing, 404s and hostname-gated
  analytics with a synthetic beacon. No real analytics was sent by those checks.
- The expanded destination-origin validation and metadata fixtures were rerun
  after adding additional loopback cases; they pass.
- Desktop (1440×900) and phone (375×812) home screenshots were visually reviewed;
  portfolio content and links remain readable without horizontal overflow.
- With both real preview servers running on 4321/4322, Chromium followed the
  website's docs link, opened a chapter, and returned through the docs Website
  link at both viewports. All six chapter cards were present; titles and origins
  were correct and no browser errors occurred. Both preview servers were stopped
  after the check.

Browser evidence is generated under ignored `test-results/`; local command logs
are under ignored `.cache/`. These checks do not establish deployment readiness,
domain ownership or public availability of a new repository.

## Historical analytics, privacy and discovery follow-up

Implemented locally on 2026-11-11 after the separation. Each app owns its own
collector, labels, retention job and private dashboard. The website does not
store docs reading events or share its database with the reader. No remote
repository, domain, deployment or production collection was changed.

The website now has page-specific metadata, WebSite JSON-LD, eleven versioned
1200×630 cards, precise privacy disclosures and a keyboard-operable browser
opt-out. Approved page views, coarse discovery/compatibility categories,
outbound actions, sampled performance ratings and generic 404s increment
aggregate counters. Raw event histories and visitor identifiers are not stored.
See [launch preparation](LAUNCH.md) for the exact contract and remaining setup.

Final local evidence:

- `pnpm check` passes: portrait integrity, ten SQLite-backed backend tests, zero
  type diagnostics, eleven static pages, four metadata fixtures and 43 passing
  Chromium browser tests. One desktop-inapplicable phone-header test is skipped.
- Local Worker/D1 proof passes for authenticated admin paths, transactional
  aggregates, scheduled cleanup, strict schemas and exact-origin collection.
  Browser cases verify DNT/GPC, unavailable storage, opt-out persistence,
  immediate opt-in, click deduplication, 404 sanitization and sampled Web Vitals.
  Backgrounding is simulated after real browser paints/interactions to flush
  measurements without teardown cancelling the intercepted local requests.
- The private dashboard's daily/monthly ranges, empty data and unavailable-data
  state are checked; a failed refresh hides prior data. Mobile/desktop dashboard
  and privacy screenshots plus representative social cards were visually reviewed.
- `pnpm peers check` and `git diff --check` pass. Application logging/collection
  remain disabled in checked-in configuration; test secrets/state are local and
  ignored, and the proof removes its temporary database on completion.

These results verify local software behavior, not live hosting policy or
production reporting. The actual processor settings, backup retention, domain,
database identity and owner secret must be confirmed during authorized launch.
