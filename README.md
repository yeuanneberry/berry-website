# Berry website

The main Yeuanne Berry portfolio: five project case studies and a curated public-code collection. The featured websites were delivered through Yappers; each case study records the owner's specific contribution.

Astro + React, static output. The documentation reader is maintained independently in `berry-docs`; canonical guides belong to `berry-desktop`. This repo owns no reader routes or generated guide content. See [repository separation](docs/REPOSITORY-SPLIT.md).

Mobile navigation uses a full-screen native dialog with an early inline controller;
it works before animation scripts download. Without JavaScript the regular links
remain visible. Open/close buttons share the same size and header alignment; their
header divider spans the same full width in both states. Page-specific titles and descriptions retain the Yeuanne Berry branding. External links open a new tab with
noopener/noreferrer and an accessible hint; internal navigation stays in place.
The original portrait supplies high-density responsive WebP display images and
PNG favicon/touch icons. Fonts and
preview images are served locally. Each route has a versioned 1200×630 social image. Project cards keep Berry's dark frame and monospace branding, with one project title, a brief description and contribution credit; subtle font and color choices hint at each project. There is no visitor account or visitor-side GitHub request. Optional first-party statistics use a small Worker and D1 aggregate counters, with an owner-only dashboard at `/admin/stats/`. Collection is disabled by default and restricted to the exact configured production origin. See the public `/privacy/` page for the exact measurements, purposes, retention and browser opt-out.

Selected Lucide icons render as static Astro SVGs. Motion's vanilla JavaScript
mini entry adds 220ms menu entrances and 160ms exits; CSS uses 140ms interaction
transitions, a 240ms settle for project previews and 320ms introductions. Each
page arrives in two beats 70ms apart: the introduction, then the first block
below it. The home portrait settles into its tilt, About's ASCII portrait prints
row by row, and the menu panel fades in where `@starting-style` is supported.
Icons lean the way their link leads, and a card's single stretched link rings
the whole card on keyboard focus. Reduced motion disables decorative movement,
including hover lifts and icon nudges; colour and border feedback remain.
Core menu behavior never waits for Motion, and interrupted transitions keep native
focus and background-scroll handling until the dialog is closed.

## Local use

Use Node >=22.23.4 and the pinned pnpm 12.11.2. No environment file is needed.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

The local site listens on http://127.0.0.1:4321. No domain or deployment is
configured. The intended domain is yeuanneberry.moe; purchase and DNS are deferred.
Workers Static Assets configuration and local-only proofs are prepared; no
hosting account, deployment or live analytics was activated. See
[launch preparation](docs/LAUNCH.md) for CSP, local headers and analytics settings.
See [site build settings](docs/SITE-BUILDS.md) for explicit production URLs and
indexing. Local/preview builds remain unindexed by default; production fixtures
are checked locally without publishing them.

```sh
pnpm check
```

This checks portrait integrity, types, the static production build, and Chromium
at desktop/phone sizes, plus separate preview/production metadata builds and
initial asset budgets, plus local Worker/D1 authentication, aggregate storage, privacy controls and browser-event checks. [Performance notes](docs/PERFORMANCE.md) distinguish local
loading observations from real visitor metrics. Install the matching browser once with
`pnpm exec playwright install chromium` if needed. Test screenshots/traces under
test-results are ignored. The test preview uses Astro's `--ignore-lock` mode so
Playwright owns its foreground lifetime in agent environments.

## Content ownership

`apps/web/src/data/work.ts` owns the reviewed project records. Keep contribution,
visual credits and Yappers attribution accurate. A source field stays null unless
the code is public. Public GitHub metadata is curated in `data/repositories.ts`;
forks are labelled and no unverified changes, metrics or stack are claimed.

The portfolio has no docs-site links or build settings. Neither app needs the other's checkout to install, build or run. Each owns its own copy of the small workspace configuration package. Public GitHub links to Berry desktop remain part of the code collection.

About uses a static ASCII derivative of the supplied portrait, in 80x48 desktop
and 48x29 phone grids. A reviewed SVG foreground mask selects the character;
contrast uses those pixels and the surrounding background becomes literal spaces.
Positive tonal mapping keeps the hair dark and face light; restrained detail
enhancement before downsampling preserves the glasses, eyes and mouth. The
selected rendering is compared with two alternatives using the actual font:

```sh
node scripts/preview-ascii-portrait.mjs
```

This writes desktop/phone comparisons to ignored `test-results/ascii-comparison`.
About's Work and Berry sections sit side by side on desktop and stack on phones.
Home and About show the owner's pronunciation guide from
`apps/web/src/data/profile.ts`.
Generate or verify the portrait offline from the repository root:

```sh
node scripts/generate-ascii-portrait.mjs
pnpm check-ascii
```

Text artifacts and their source/settings/toolchain manifest are checked in under
`apps/web/src/assets/ascii` alongside `foreground-mask.svg`. After reviewing a
mask change, regenerate both sizes and the manifest together. The manifest pins
the original image and mask hashes. The generator uses locked Sharp and bundled
libvips;
`--check` verifies that toolchain's output. No visitor-side conversion, canvas or
external service is involved. Individual characters are hidden from assistive
technology; the portrait has one accessible description. Home/header images and
favicons keep using the original image. Preserve the derivative's asset notice.

Original code and documentation use [MIT](LICENSE). Read the separate
[asset notices](NOTICE.md) before reusing images or fonts. Domain configuration
and website deployment are separate from source publication.

## Dependencies

Direct versions and pnpm-lock.yaml are pinned. Preserve the tested React
integration 7.0.0 / Vite React plugin 6.1.1 / oxc-transform-react 0.145.0 peer
combination unless a deliberate update resolves all peer requirements. Keep
`pnpm peers check` clean. No generator or global tooling update is needed to edit
this site.

Wrangler is pinned as development tooling for local static-asset and analytics proofs. No command in `pnpm check` deploys or accesses a remote database. Its pinned
esbuild/workerd installers are the two approved package builds. Exact release-age
exceptions in `pnpm-workspace.yaml` cover Wrangler and its bundled Miniflare
version; review those exceptions when deliberately upgrading the local tool.
