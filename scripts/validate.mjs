import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { features, members, milestones, productScreenshots } from "../src/data/content.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const inventory = JSON.parse(await fs.readFile(path.join(dist, "site-inventory.json"), "utf8"));
const builtBase = inventory.basePath;
const sourceSlugs = members.map((member) => member.slug);
assert.equal(members.length, 5, "The hub must contain exactly five profile placeholders.");
assert.equal(new Set(sourceSlugs).size, members.length, "Profile slugs must be unique.");
assert.equal(new Set(features.map((feature) => feature.id)).size, features.length, "Feature IDs must be unique.");
assert.equal(productScreenshots.length, 6, "The product gallery should include all six supplied app screens.");
assert.ok(milestones.length >= 4 && milestones.length <= 6, "The timeline scaffold should contain four to six milestones.");
for (const feature of features) {
  for (const contribution of feature.contributions) {
    assert.ok(members.some((member) => member.id === contribution.memberId), `Unknown contributor ${contribution.memberId} on ${feature.id}.`);
  }
}

const rootHtml = await fs.readFile(path.join(dist, "index.html"), "utf8");
assert.ok(rootHtml.includes(`window.SITE_BASE = ${JSON.stringify(builtBase)}`), "Generated links must use the configured base path.");
assert.ok(rootHtml.includes(`${builtBase}assets/site.css`), "Stylesheet URL must respect the configured base path.");
assert.ok(rootHtml.includes(`${builtBase}assets/app.js`), "Script URL must respect the configured base path.");
assert.ok(rootHtml.indexOf('id="team"') < rootHtml.indexOf('id="product"'), "The team directory must appear before the product section.");
assert.match(rootHtml, /data-product-tab="dashboard"/);
assert.match(rootHtml, /assets\/mascot\/mascot-neutral\.svg/);
assert.doesNotMatch(rootHtml, /href=["']#["']/i, "The generated site must not contain fake empty links.");
assert.doesNotMatch(rootHtml, /John Doe|Jane Doe|placeholder@|example\.com/i, "No fictitious identities or contact links should ship.");
for (const screen of productScreenshots) {
  assert.ok(rootHtml.includes(`"id":"${screen.id}"`), `The generated gallery data is missing ${screen.id}.`);
  const imagePath = path.join(dist, "assets", screen.image.replace(/^assets\//, ""));
  await fs.access(imagePath);
}
for (const asset of ["mascot-neutral.svg", "overalls.svg", "sweat-band.svg"]) {
  await fs.access(path.join(dist, "assets", "mascot", asset));
}
for (const slug of sourceSlugs) {
  const html = await fs.readFile(path.join(dist, "team", slug, "index.html"), "utf8");
  assert.match(html, new RegExp(`data-member-id="member-\\d{2}"`));
  assert.ok(html.includes(`${builtBase}assets/site.css`), `Stylesheet path missing from ${slug}.`);
  assert.ok(rootHtml.includes(`${builtBase}team/${slug}/`), `Homepage link missing for ${slug}.`);
  assert.match(html, /Public CV not added/);
  assert.match(html, /Verified contributions are ready to add/);
}
const notFound = await fs.readFile(path.join(dist, "404.html"), "utf8");
assert.match(notFound, /PAGE NOT FOUND/);

// Also exercise subpath builds, then leave the deployable project base path in dist.
console.log(`Validated ${members.length} profile routes, ${productScreenshots.length} app screenshots and the mascot assets.`);
