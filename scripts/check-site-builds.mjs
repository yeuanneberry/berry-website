#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import pages from "../apps/web/page-metadata.json" with { type: "json" };
const root = new URL("../", import.meta.url), origin = "https://portfolio.example.test";
const baseEnv = { ...process.env, CF_WEB_ANALYTICS_ENABLED: "false", CF_WEB_ANALYTICS_TOKEN: "", ANALYTICS_ENABLED: "false" };
delete baseEnv.DOCS_URL;
await assert.rejects(access(new URL('apps/web/docs.config.mjs', root)));
await assert.rejects(access(new URL('apps/web/src/components/DocsLink.astro', root)));
for (const setting of [
  { SITE_URL:"", SITE_INDEXABLE:"true" },{ SITE_URL:"http://example.test", SITE_INDEXABLE:"true" },
  { SITE_URL:origin+"/nested/", SITE_INDEXABLE:"false" }, { SITE_URL:origin,SITE_INDEXABLE:"yes" },
  { SITE_URL:origin,SITE_INDEXABLE:"false",ANALYTICS_ENABLED:"true" },
  { SITE_URL:origin,SITE_INDEXABLE:"true",ANALYTICS_ENABLED:"yes" },
  { SITE_URL:origin,SITE_INDEXABLE:"true",CF_WEB_ANALYTICS_ENABLED:"true" },
]) {
  const invalid=spawnSync(process.execPath,["--input-type=module","--eval","await import('./apps/web/site.config.mjs')"],{cwd:fileURLToPath(root),encoding:"utf8",env:{...baseEnv,...setting}});
  assert.notEqual(invalid.status,0,"Unsafe site/analytics configuration must fail");
}
const decode = value => value.replaceAll("&amp;","&").replaceAll("&quot;",'"').replaceAll("&#39;","'").replaceAll("&#x27;","'").replaceAll("&lt;","<").replaceAll("&gt;",">");
for (const fixture of [{name:"local",url:"",indexable:false},{name:"preview",url:origin,indexable:false},{name:"production",url:origin,indexable:true},{name:"analytics",url:origin,indexable:true,analytics:true}]) {
  const directory=new URL(".cache/site-builds/"+fixture.name+"/",root);
  const build=spawnSync("pnpm",["--filter","web","build","--outDir",fileURLToPath(directory)],{cwd:fileURLToPath(root),encoding:"utf8",env:{...baseEnv,SITE_URL:fixture.url,SITE_INDEXABLE:String(fixture.indexable),ANALYTICS_ENABLED:String(Boolean(fixture.analytics))}});
  if(build.status!==0)throw Error(build.stdout+build.stderr);
  const read=path=>readFile(new URL(path,directory),"utf8"), titles=new Set(), images=new Set();
  for (const [route,meta] of Object.entries(pages)) {
    const html=await read(route==="/404/"?"404.html":route.slice(1)+"index.html");
    assert.equal(decode(html.match(/<title>(.*?)<\/title>/s)[1]),meta.title);
    assert.equal(decode(html.match(/name="description" content="([^"]+)"/)[1]),meta.description);
    assert.ok(!titles.has(meta.title),"Titles must be unique"); titles.add(meta.title);
    assert.doesNotMatch(html,/cloudflareinsights\.com/);
    assert.doesNotMatch(html, /docs_open|data-analytics-related-origin|data-stats-target="docs"|href="[^"]*(?:\/docs\/|4322)/);
    assert.ok(html.includes('data-analytics-enabled="'+Boolean(fixture.analytics)+'"'));
    const image=html.match(/property="og:image" content="([^"]+)"/)[1], imageURL=new URL(image);
    assert.match(imageURL.pathname,/^\/og\/[a-z0-9-]+-[a-f0-9]{16}\.png$/);
    assert.ok(!images.has(imageURL.pathname),"Each route needs its own card"); images.add(imageURL.pathname);
    const bytes=await readFile(new URL(imageURL.pathname.slice(1),directory));
    assert.equal(bytes.readUInt32BE(16),1200); assert.equal(bytes.readUInt32BE(20),630); assert.ok(bytes.length<1000000);
    assert.ok(html.includes('name="robots" content="'+(fixture.indexable&&route!=="/404/"?"index, follow":"noindex, nofollow")+'"'));
    if (fixture.url && route!=="/404/") assert.ok(html.includes('rel="canonical" href="'+origin+route+'"')); else assert.doesNotMatch(html,/rel="canonical"/);
  }
  await assert.rejects(access(new URL("docs/index.html",directory)));
  const home=await read("index.html");
  assert.doesNotMatch(home, /docs_open|data-analytics-related-origin|data-stats-target="docs"|href="[^"]*\/docs\//);
  const privacy=await read("privacy/index.html");
  assert.ok(privacy.includes(fixture.analytics?"Limited first-party analytics is enabled":"Analytics is currently disabled"));
  if(fixture.indexable) {
    const sitemap=await read("sitemap-0.xml");
    for(const route of Object.keys(pages).filter(p=>p!=="/404/"))assert.ok(sitemap.includes(origin+route));
    assert.doesNotMatch(sitemap,/404|localhost|127\.0\.0\.1|\/docs\//);
    assert.ok((await read("robots.txt")).includes(origin+"/sitemap-index.xml"));
  } else { assert.equal(await read("robots.txt"),"User-agent: *\nDisallow: /\n");await assert.rejects(access(new URL("sitemap-index.xml",directory))); }
  if(fixture.url)assert.ok(home.includes('type="application/ld+json"'));
  console.log("PASS "+fixture.name+": every route metadata, unique image, indexing, canonical, sitemap and first-party analytics state");
}
