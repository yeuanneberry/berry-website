# Site build settings

Local and preview builds are unindexed by default. No domain, DNS record or
hosting project is created by a build. The intended domain is still deferred.

`apps/web/site.config.mjs` reads these explicit build environment variables:

| Variable | Default | Meaning |
| --- | --- | --- |
| `SITE_URL` | unset | Final HTTPS origin, without a path, query or credentials |
| `SITE_INDEXABLE` | `false` | Emit indexable metadata and a sitemap only when `true` |
| `ANALYTICS_ENABLED` | `false` | Enable the browser collector only in an indexable HTTPS build; separate Worker runtime activation is required |

Preview builds may supply the intended production origin for canonical links and
social cards while keeping `SITE_INDEXABLE=false`. Local builds without an origin
omit canonicals and use localhost social URLs; these are for local review.
Production sharing requires the confirmed origin. Build settings are explicit
process environment values, not automatically loaded from a root `.env` file.

The website has no docs-site destination or build requirement. `SITE_URL` is its
own canonical origin; the independent reader is outside this build.

After the website launch origin is confirmed, a source-only production build uses
that address. The following reserved example domain is a test fixture:

```sh
SITE_URL=https://portfolio.example.test SITE_INDEXABLE=true pnpm build
```

This command builds files only. Domain purchase, hosting and DNS are separate.
Previews need their own build with indexing disabled; a production artifact keeps
its production metadata wherever it is served. The 404 page always stays
unindexed and is excluded from the sitemap.

`apps/web/page-metadata.json` owns each route's title, description, fixed analytics ID and card copy. `scripts/generate-social-card.mjs` generates a distinct 1200×630 PNG for each route before root build/dev/type commands. Portfolio cards use the approved portrait and local JetBrains Mono. The five project cards preserve the Berry dark background, border and monospace branding. Each contains one project name, a short description and the contribution credit, with restrained project font/color cues from `scripts/project-social-cards.mjs` and local build-only fonts in `scripts/fonts`. The renderer uses no nested card, project screenshot or logo. Project entries select a `theme` instead of an `image`. Content hashes in `/og/` filenames invalidate embed caches when artwork changes. Generated files and their manifest are ignored. Preserve artwork and font notices. `/social-card.png` remains a fallback for older shares.

Home emits a small WebSite JSON-LD object only when an origin is configured; its exact bytes are hashed into CSP. No invented ratings, search actions or social profile claims are added. Accurate titles, descriptions and share images improve discoverability and presentation; rankings and reach are not guaranteed.

`pnpm check-site-builds` builds isolated local, preview and synthetic production
fixtures under ignored `.cache/site-builds`. It checks canonicals, social
URLs, robots rules, sitemap contents, 404 indexing and invalid settings without
connecting to the example origin. A fourth synthetic analytics-enabled fixture
supports the local Cloudflare check. These fixtures never deploy. See
[launch preparation](LAUNCH.md) for security and optional analytics maintenance.
