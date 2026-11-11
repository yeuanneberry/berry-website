// @ts-check
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { site } from "./site.config.mjs";
import { csp } from "./security.mjs";

// https://astro.build/config
export default defineConfig({
  site: site.url,
  integrations: [react(), ...(site.indexable ? [sitemap({ filter: page => !page.endsWith("/404/") && !page.endsWith("/404.html") })] : [])],
  output: "static",
  markdown: { syntaxHighlight: false },
  vite: { server: { strictPort: true }, preview: { strictPort: true } },
  security: { csp },
});
