# Performance observations

Measured 2026-10-27 with local Chromium, cold browser contexts, unthrottled
localhost traffic and the project's 1440x900 / 375x812 viewports. These are lab
observations, not production Core Web Vitals or guarantees about visitors.

The historical combined-site baseline was `2864392`. Before/after checks covered
`/`, `/about/`, `/work/` and `/docs/customize/` at both sizes. Following separation,
website checks cover `/`, `/about/`, `/work/` and `/code/`; reader performance is
checked in berry-docs. The table below records the historical baseline, not a new
measurement of the split.

| Initial resource | Baseline | Updated | Check |
| --- | ---: | ---: | --- |
| Font, decoded bytes | 273,900 | 92,392 | Below 100,000 per page |
| External JavaScript | None | None | No off-origin requests |
| First-party JavaScript | 9,053 | 9,053 | Below 25,000 per page |
| CSS | Below 24,000 | Below 24,000 | Below 30,000 per page |

WOFF2 reduces font delivery by 181,508 bytes (about 66%). Fontconfig reported
matching family, style and character coverage for the TTF and WOFF2. The exact
WOFF2 URL is preloaded and used by CSS, so there is one browser font request.
Original TTF bytes remain as the conversion source and for build-time artwork.

`tests/performance.spec.ts` records initial LCP, FCP, CLS and resource sizes for
each cold page into `test-results/.../performance.json`. It enforces the byte
budgets above and CLS <=0.1. Timing values are reported without a fragile local
millisecond threshold. Only visible introduction animations are awaited; closed
native controls can contain pending transitions irrelevant to initial rendering.

Image bytes below the fold, slow-device/network behavior, INP and real visitor
percentiles are outside this check. Existing tests still verify image loading,
responsive sources, high-density pixels, keyboard interaction and reduced motion.
Real-user measurement can be enabled at launch after the analytics configuration
is reviewed. No live visitor metrics exist for this unhosted site.

## First-party measurement preparation

The historical byte table above predates the first-party collector. Current browser tests enforce the same font/CSS/JS budgets on disabled builds. The collector is bundled locally; the web-vitals module is imported only on 10% of eligible production page loads. The local Worker proof exercises that sampled path separately. Received LCP/INP/CLS rating counts are aggregate distributions, not exact p75 values or unique visitor counts. No live performance statistics exist yet.

The 2026-11-11 follow-up measured 14,127 JavaScript bytes, 92,392 font bytes and
11,829–16,611 CSS bytes across the four website routes at both test viewports.
Recorded CLS was zero in these local runs. These remain unthrottled lab results;
they do not predict production timing or replace measurements after launch.
