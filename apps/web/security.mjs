import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { websiteSchema } from "./seo.mjs";

/** @param {string} text @returns {`sha256-${string}`} */
export const cspHash = text => `sha256-${createHash("sha256").update(text, "utf8").digest("base64")}`;
const navigation = readFileSync(new URL("./src/scripts/navigation.js", import.meta.url), "utf8");

/** @type {NonNullable<import("astro").AstroUserConfig["security"]>["csp"]} */
export const csp = {
  directives: [
    "default-src 'self'", "base-uri 'self'", "object-src 'none'",
    "frame-src 'none'", "form-action 'none'",
    "connect-src 'self'",
  ],
  scriptDirective: {
    resources: [
      { resource: "'self'", kind: "element" }, { resource: "'none'", kind: "attribute" },
    ],
    hashes: [cspHash(navigation), ...(websiteSchema ? [cspHash(websiteSchema)] : [])].map(hash => ({ hash, kind: "element" })),
  },
  styleDirective: {
    resources: [{ resource: "'self'", kind: "element" }, { resource: "'none'", kind: "attribute" }],
  },
};
