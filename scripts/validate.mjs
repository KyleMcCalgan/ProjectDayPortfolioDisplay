import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { features, members, milestones } from "../src/data/content.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const inventory = JSON.parse(await fs.readFile(path.join(dist, "site-inventory.json"), "utf8"));
const builtBase = inventory.basePath;
const sourceSlugs = members.map((member) => member.slug);
assert.equal(members.length, 5, "The hub must contain exactly five profile placeholders.");
assert.equal(new Set(sourceSlugs).size, members.length, "Profile slugs must be unique.");
assert.equal(new Set(features.map((feature) => feature.id)).size, features.length, "Feature IDs must be unique.");
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
assert.match(rootHtml, /Illustrative preview|ILLUSTRATIVE PREVIEW/);
assert.doesNotMatch(rootHtml, /href=["']#["']/i, "The generated site must not contain fake empty links.");
assert.doesNotMatch(rootHtml, /John Doe|Jane Doe|placeholder@|example\.com/i, "No fictitious identities or contact links should ship.");
for (const slug of sourceSlugs) {
  const html = await fs.readFile(path.join(dist, "team", slug, "index.html"), "utf8");
  assert.match(html, new RegExp(`data-member-id="member-\\d{2}"`));
  assert.ok(html.includes(`${builtBase}assets/site.css`), `Stylesheet path missing from ${slug}.`);
  assert.ok(rootHtml.includes(`${builtBase}team/${slug}/`), `Homepage link missing for ${slug}.`);
  assert.match(html, /Approved CV not uploaded/);
  assert.match(html, /No verified feature contributions yet/);
}
const notFound = await fs.readFile(path.join(dist, "404.html"), "utf8");
assert.match(notFound, /PAGE NOT FOUND/);

// Also exercise subpath builds, then leave the deployable project base path in dist.
console.log(`Validated ${members.length} direct profile routes, ${features.length} feature concepts and ${milestones.length} timeline stages.`);
