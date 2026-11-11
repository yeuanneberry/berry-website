# Berry website

This repository owns only Yeuanne Berry's portfolio. The independent berry-docs
repository owns the documentation reader; berry-desktop owns canonical guides. Read README.md and NOTICE.md before editing.

- Use Astro + React with static output; no React islands currently hydrate.
  Mobile navigation uses native dialog and vanilla JavaScript with a no-JS fallback.
  Its early controller must work before optional animation downloads. Use the
  shared Lucide Icon component and respect reduced-motion preferences.
- About's ASCII portrait is generated from the approved artwork using the
  reviewed foreground-mask.svg; outside the character stays blank. Regenerate
  with scripts/generate-ascii-portrait.mjs; keep its mask/text/manifest together.
- Preserve Yeuanne Berry branding with accurate, page-specific titles/descriptions and versioned social images. External links open a
  new tab with noopener/noreferrer and an accessible hint; internal routes stay put.
- pnpm is the package manager. Keep exact direct versions and pnpm-lock.yaml.
- Preserve default noindex and disabled analytics. SITE_URL/SITE_INDEXABLE and
  optional analytics are explicit build settings, not evidence of deployment.
  Read docs/LAUNCH.md before changing CSP, code styles or Cloudflare configuration.
  Keep early-script hashes valid; never add
  broad unsafe-inline allowances. Local Cloudflare checks use an isolated local D1 database and intercepted synthetic origins; no live analytics.
- Keep the site independent of berry-docs and berry-desktop at build/runtime.
  The portfolio has no docs-site links, DOCS_URL setting or reader analytics.
  Do not reintroduce reader routes or generated guides in this repository.
- Project OG cards use one composition inside Berry's dark frame: the project name once, a brief description and contribution credit. Use only subtle project font/color cues; no nested preview card, project screenshot or logo. Keep build-time fonts local with their licenses.
- The portfolio may feature the five approved projects delivered through Yappers;
  preserve confirmed contribution credits.
  Keep branding independent of desktop wallpaper and fandom names. The explicitly
  supplied portrait is approved for the profile and favicon.
- Keep analytics aggregate-only and owner-authenticated. Fixed page/event/destination enums are the collection contract; no visitor IDs, raw events or IP storage. Preserve DNT/GPC, per-origin opt-out and the exact-origin gate.
- Keep credentials, live configuration, operational receipts, account setup,
  deployment actions and remote administration outside the website.
- Use one writer per file. The coordinator owns manifests, lockfiles, tests,
  documentation, Git, installation and final verification. A task worker owns
  only the paths named in its task brief and must not spawn further workers.
- Use semantic HTML, visible keyboard focus, readable contrast and reduced motion.
- Prefer the patch tool for source edits. Shell commands must be one reliable
  physical line; complex logic belongs in a complete repository-owned script,
  validated and invoked explicitly. Do not author files through shell heredocs.
- The selected task brief is the coordinator's reviewed plan. Work directly from
  it and the relevant code; avoid repeating global setup or unrelated inventories.
- Validate with pnpm check. Browser tests exercise the production preview at
  desktop and phone sizes. Inspect real screenshots for visual changes.
- No deployment, domain/DNS changes, sign-in, global changes or model experiments
  are part of this task. Domain setup is deferred by the owner.
