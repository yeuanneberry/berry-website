#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { mkdir, readFile, writeFile, readdir, unlink } from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";
import pages from "../apps/web/page-metadata.json" with { type: "json" };
import { projectSocialCard } from "./project-social-cards.mjs";
const root = new URL("../", import.meta.url);
const directory = new URL("apps/web/public/og/", root);
await mkdir(directory, { recursive: true });
await mkdir(new URL("apps/web/src/generated/", root), { recursive: true });
const fontfile = fileURLToPath(new URL("apps/web/public/fonts/JetBrainsMono-Regular.ttf", root));
const escape = text => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const text = (value, size, width) => sharp({ text: { text: '<span foreground="#eee8d9">' + escape(value) + '</span>', font: "JetBrains Mono " + size, fontfile, width, rgba: true, wrap: "word" } }).png().toBuffer();
const manifest = {};
for (const [route, page] of Object.entries(pages)) {
  let buffer;
  if (page.id.startsWith("project-")) {
    buffer = await projectSocialCard(page);
  } else {
    const art = await sharp(fileURLToPath(new URL("apps/web/src/assets/" + page.image, root)))
      .resize(300, 300, { fit: "cover", position: "top" }).png().toBuffer();
    const headline = await text(page.headline, 54, 590);
    const subtitle = await text(page.subtitle, 24, 570);
    const brand = await text("YEUANNE BERRY / PORTFOLIO", 18, 1040);
    const frame = Buffer.from('<svg width="1200" height="630"><rect x="32" y="32" width="1136" height="566" fill="none" stroke="#363d3b"/><path d="M72 460H630" stroke="#8e977b" stroke-width="3"/></svg>');
    buffer = await sharp({ create: { width: 1200, height: 630, channels: 4, background: "#191c1c" } })
      .composite([{ input: frame }, { input: brand, left: 72, top: 72 }, { input: headline, left: 72, top: 210 }, { input: subtitle, left: 72, top: 365 }, { input: art, left: 800, top: 175 }])
      .png({ compressionLevel: 9 }).toBuffer();
  }
  const name = page.id + "-" + createHash("sha256").update(buffer).digest("hex").slice(0, 16) + ".png";
  await writeFile(new URL(name, directory), buffer);
  manifest[route] = { path: "/og/" + name, alt: page.headline + " — " + page.subtitle };
}
const used = new Set(Object.values(manifest).map(card => card.path.split("/").pop()));
for (const file of await readdir(directory)) if (/^[a-z0-9-]+\.png$/.test(file) && !used.has(file)) await unlink(new URL(file, directory));
await writeFile(new URL("apps/web/src/generated/social-images.json", root), JSON.stringify(manifest, null, 2) + "\n");
// Retain the previous generic image URL for old embeds; new metadata uses hashed cards.
await writeFile(new URL("apps/web/public/social-card.png", root), await readFile(new URL(manifest["/"].path.slice(1), new URL("apps/web/public/", root))));
console.log("Generated " + Object.keys(manifest).length + " versioned 1200x630 social cards.");
