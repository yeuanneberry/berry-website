# Source and asset notices

This source contains the original portfolio implementation.
Original implementation and documentation are released under the MIT license
in LICENSE, following the owner's approval to proceed with the sharing plan.
The MIT grant excludes the profile artwork, project-preview images and bundled
font described below. Preserve their separate notices when reusing this source.

## Profile

`apps/web/src/assets/profile.png` was explicitly supplied by Yeuanne Berry for
the personal portrait and favicon. SHA-256:
`00496e0f415188fdd24af035ec36670683ccb58ef7aa882b158fb9d98b1e3906`.
Build-time responsive/icon derivatives preserve that artwork. It is not included
in the code license or offered as a generic reusable brand asset.

The foreground mask and text portraits under `apps/web/src/assets/ascii` are
offline derivatives of the same supplied artwork and have the same exclusion
from the code license.
Their manifest records the original source and mask hashes, generator, toolchain
and settings.

## Project previews

Images under `apps/web/src/assets/work` are captures of the five approved public
project homepages, reviewed 2026-10-26. Their websites are linked in the case
studies. Project imagery, logos and visual identity remain with their respective
owners; their presence here does not relicense them as original portfolio code.
Contribution credits distinguish implementation from branding/theme. The
SoftlySang case records the owner's full visual and implementation contribution.
No internal application captures, client records, account screens or dashboard
data are included.

## Font and dependencies

JetBrains Mono is Copyright 2020 The JetBrains Mono Project Authors. The local
WOFF2 is a format conversion of the retained original TTF, without subsetting or
glyph changes (woff2 1.0.2). Its SIL Open Font License 1.1 is retained at
`apps/web/public/fonts/OFL.txt`. Other dependencies retain their own licenses.
Regenerate with `woff2_compress apps/web/public/fonts/JetBrainsMono-Regular.ttf`.
Portfolio social cards retain the portrait and font notices. Project social cards present a brief typographic summary with project-inspired font/color cues inside the Berry portfolio frame; they contain no screenshots, project imagery or reproduced logos.

The unmodified Liberation Sans Bold and Liberation Serif Regular fonts under
`scripts/fonts` are build-time-only inputs for project social cards, not website
font downloads. Copyright 2010 Google Corporation and 2012 Red Hat, Inc.; the
SIL Open Font License 1.1 and reserved-name notices are retained in
`scripts/fonts/Liberation-OFL.txt`. The card typefaces suggest a mood rather than
claiming to reproduce each project's exact font.
No wallpaper or historical desktop artwork is part of this release tree.

Lucide icons and Motion retain their upstream licenses, reproduced in
[third-party notices](THIRD_PARTY_NOTICES.md). Only selected Lucide SVGs are used;
Motion's JavaScript mini entry enhances the native menu controller. The optional web-vitals runtime retains Apache 2.0; its full license is included in `licenses/web-vitals-LICENSE.txt`.

## Documentation reader

The generated Berry reader was extracted into the independent `berry-docs`
repository. Canonical guide content remains owned by `berry-desktop`. This
website does not link to the reader or embed or author its chapters. Historical
Git revisions still retain the original combined tree and its notices.
