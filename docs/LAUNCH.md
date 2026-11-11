# Launch preparation

The website is prepared locally, not deployed. Domain purchase, DNS, hosting accounts and remote database creation remain pending. Astro still emits static pages. A separate Worker handles only first-party statistics and the private dashboard; static routes do not depend on the database.

## Local proof

`pnpm check` includes `pnpm check-analytics` (SQLite-backed Worker tests) and `pnpm check-cloudflare` (real local Wrangler/D1 and Chromium). The latter creates a fresh ignored local database, checks authentication, aggregate writes, scheduled cleanup, privacy choices, event payloads and dashboard layouts, then stops the process group and removes its fixture state. Synthetic HTTPS responses are intercepted and served locally. No live visitor events or remote database operations are involved.

`pnpm preview:cloudflare` inspects the default disabled build on 127.0.0.1:4343. Astro dev/preview does not apply `_headers`; local proof is separate from deployed edge acceptance.

## Security policy

Astro emits hashed CSP for the early menu controller and generated WebSite JSON-LD. No broad `unsafe-inline`, `unsafe-eval`, remote scripts or analytics origins are permitted. Inline style attributes are disabled. The documentation app owns its separate Markdown/highlighter policy.

`apps/web/public/_headers` adds framing, MIME, referrer, browser-feature and HSTS restrictions; hash-named assets use immutable caching. Its CSP header contains only `frame-ancestors` so it does not block Astro's hashes. The Worker supplies its own no-store, noindex, strict CSP and framing headers for API/admin responses.

## First-party statistics contract

`analytics/config.mjs` owns fixed page and destination labels. `analytics/worker.mjs` accepts only a versioned, allowlisted schema under 1 KiB. It never reads IP addresses or saves event/request rows. Accepted events atomically increment separate daily/monthly marginal counters; browser and referral dimensions cannot be joined into individual histories.

The public privacy page lists every field, event trigger and purpose. Page views are once per visible page load; clicks once per approved destination per load. Only 10% of eligible loads import the local web-vitals library, reporting LCP/INP/CLS rating buckets without raw values. Unknown paths yield only a generic missing-page count. The browser honors DNT/GPC and per-origin opt-out, fails closed when storage is inaccessible, and sends no cookies or referrer on collection requests.

Daily buckets include the current UTC day and preceding 89 days. Monthly buckets include the current month and preceding 12 calendar months. The scheduled job deletes expired buckets; reports also filter by cutoff if cleanup has failed. The dashboard displays the last purge and marks missing/stale maintenance. Recovery copies and provider logs have separate retention, described on the privacy page.

## Build and runtime configuration

| Setting | Location | Default / requirement |
| --- | --- | --- |
| `SITE_URL` | Build and Worker vars | Same exact public HTTPS origin; unset until confirmed |
| `SITE_INDEXABLE` | Build only | `false`; must be `true` to enable browser collection |
| `ANALYTICS_ENABLED` | Build and Worker vars | `false` independently in both places |
| `STATS_DB` | Worker D1 binding | Checked-in all-zero ID is a local placeholder, never a production ID |
| `STATS_OWNER_TOKEN` | Worker secret only | Unique high-entropy secret of 32–256 characters; never in build env, HTML, Git or URLs |
| `RATE_LIMITER`, `ADMIN_LIMITER` | Worker bindings | Fixed website keys; 600/min ingest and 60/min owner requests |
| Scheduled trigger | Worker config | Daily 03:17 UTC deletion job |
| `LOCAL_ANALYTICS_TEST` | Local test fixture only | Loopback-only HTTP exception; omit from production |

The retired `CF_WEB_ANALYTICS_ENABLED=true` or nonempty `CF_WEB_ANALYTICS_TOKEN` settings are rejected. Do not enable Cloudflare Web Analytics auto-injection, another third-party beacon, or cross-site tracking.

Owner access is HTTPS HTTP Basic authentication at `/admin/stats/`, username `owner` and the Worker secret as password. Every `/admin` path, including scripts/data, requires authentication; unconfigured admin access fails closed. Browser Basic credentials can remain cached until the browser session is closed; rotate the secret to revoke access. There is no public dashboard or automatic export. Account/security access at the host is separately governed.

Origin headers are validation, not authentication: public event submissions can be forged. Fixed site-wide rate keys avoid application IP processing but let an abusive sender consume the shared allowance. Cloudflare rate limits are approximate and scoped to each edge location; this is not a billing-grade counter or a strict global quota. The dashboard explains blockers, bots, sampling, repeats and missing events.

## Later launch

After domain ownership and deployment authorization are established:

1. Confirm both site origins, hosting plan and provider processing/logging/backup retention. Update the public privacy page with the actual arrangement, rather than promising no provider access. Assess applicable consent/notice requirements for the selected audience before activating collection.
2. Provision this website's Worker/D1 resources; replace this repository's placeholder ID. Initialize `analytics/schema.sql` against the intended database through the authorized operator workflow. Never use a production ID in local fixtures. The website's schema accepts only page views, approved outbound actions, sampled Web Vitals ratings and the generic 404 event; docs targets and reader events are rejected.
3. Set the encrypted owner secret and matching runtime origin; keep collection disabled. Keep application observability disabled and verify any account-level log delivery settings. Do not log request headers, bodies, authorization or IP addresses.
4. Build with confirmed metadata/origins, publish only with authorization, and verify deployed static headers, routing, canonicals, sitemap, social cards and all unauthenticated admin denials.
5. Verify authenticated dashboard access, both rate bindings and the scheduled purge, including its recorded timestamp. Confirm D1 recovery history (currently up to 7 days Free / 30 days paid), update the notice, and verify provider access/retention settings.
6. Enable both build and runtime `ANALYTICS_ENABLED` only when the above checks are complete. Confirm one sanitized test event arrives and opt-out/DNT/GPC remain silent; remove synthetic counters through the authorized maintenance workflow. This local task did not activate collection.

Rollback collection immediately by setting runtime `ANALYTICS_ENABLED=false`; rebuild disabled to update the public build-status notice. Keep purge scheduling active until retained aggregates expire. Restore the previous artifact if needed. Database removal and backup expiry are separate deliberate operations.

References reviewed 2026-11-11:

- [Worker asset routing](https://developers.cloudflare.com/workers/static-assets/routing/advanced/worker-script/)
- [D1 batch API](https://developers.cloudflare.com/d1/worker-api/d1-database/)
- [D1 limits and recovery](https://developers.cloudflare.com/d1/platform/limits/)
- [Worker rate-limit binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
- [Worker Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/)
- [Astro CSP](https://docs.astro.build/en/reference/configuration-reference/#securitycsp)
