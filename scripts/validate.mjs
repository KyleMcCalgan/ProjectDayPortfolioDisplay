import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { features, journey, members, productScreenshots } from "../src/data/content.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const inventory = JSON.parse(await fs.readFile(path.join(dist, "site-inventory.json"), "utf8"));
const builtBase = inventory.basePath;
const sourceSlugs = members.map((member) => member.slug);

assert.equal(members.length, 5, "The team page must contain five profile links.");
assert.equal(new Set(sourceSlugs).size, members.length, "Profile slugs must be unique.");
assert.equal(new Set(features.map((feature) => feature.id)).size, features.length, "Feature IDs must be unique.");
assert.equal(productScreenshots.length, 6, "The app page should include all six supplied screens.");
assert.equal(inventory.app, `${builtBase}app/`, "The app route must use the configured base path.");

for (const feature of features) {
  for (const contribution of feature.contributions) {
    assert.ok(members.some((member) => member.id === contribution.memberId), `Unknown contributor ${contribution.memberId} on ${feature.id}.`);
  }
}

assert.equal(inventory.journey, `${builtBase}journey/`, "The journey route must use the configured base path.");
assert.equal(new Set(journey.map((stop) => stop.id)).size, journey.length, "Journey stop IDs must be unique.");
for (const stop of journey) {
  for (const id of stop.shots) assert.ok(productScreenshots.some((screen) => screen.id === id), `Unknown screenshot ${id} on ${stop.id}.`);
}
const journeyHtml = await fs.readFile(path.join(dist, "journey", "index.html"), "utf8");
assert.ok(journeyHtml.includes(`${builtBase}assets/site.css`), "Journey stylesheet must respect the base path.");
for (const stop of journey) assert.ok(journeyHtml.includes(`id="${stop.id}-title"`), `Journey page is missing ${stop.id}.`);
const rootHtml =await fs.readFile(path.join(dist, "index.html"), "utf8");
const appHtml = await fs.readFile(path.join(dist, "app", "index.html"), "utf8");
assert.ok(rootHtml.includes(`window.SITE_BASE = ${JSON.stringify(builtBase)}`), "Generated links must use the configured base path.");
for (const html of [rootHtml, appHtml]) {
  assert.ok(html.includes(`${builtBase}assets/site.css`), "Stylesheet URL must respect the configured base path.");
  assert.ok(html.includes(`${builtBase}assets/app.js`), "Script URL must respect the configured base path.");
  assert.ok(html.includes(`${builtBase}assets/mascot/mascot-neutral.svg`), "Mascot URL must respect the configured base path.");
  assert.doesNotMatch(html, /href=["']#["']/i, "Generated pages must not contain fake empty links.");
}

assert.match(rootHtml, /id="team"/);
assert.doesNotMatch(rootHtml, /data-product-tab=/, "The team directory and app gallery belong on separate pages.");
assert.match(appHtml, /role="tablist" aria-label="SpendSense app screens"/);
assert.match(appHtml, /data-product-pages/);
assert.doesNotMatch(rootHtml + appHtml, /class="eyebrow"/, "Page headings should not repeat eyebrow labels.");
assert.doesNotMatch(rootHtml + appHtml, /John Doe|Jane Doe|placeholder@|example\.com/i, "No fictitious identities or contact links should ship.");

for (const slug of sourceSlugs) {
  const html = await fs.readFile(path.join(dist, "team", slug, "index.html"), "utf8");
  assert.match(html, new RegExp(`data-member-id="member-\\d{2}"`));
  assert.ok(html.includes(`${builtBase}assets/site.css`), `Stylesheet path missing from ${slug}.`);
  assert.ok(html.includes(`${builtBase}assets/app.js`), `Script path missing from ${slug}.`);
  assert.ok(html.includes(`${builtBase}`), `Team return path missing from ${slug}.`);
  assert.ok(rootHtml.includes(`${builtBase}team/${slug}/`), `Homepage link missing for ${slug}.`);
  assert.match(html, /Find me/);
  const member = members.find((entry) => entry.slug === slug);
  if (member.cvPdf) {
    assert.ok(html.includes(`${builtBase}${member.cvPdf}`), `CV link missing from ${slug}.`);
    assert.match(html, /class="cv-preview-frame"/);
  }
}

for (const screen of productScreenshots) {
  assert.ok(appHtml.includes(`data-product-tab="${screen.id}"`), `The app gallery is missing the ${screen.id} tab.`);
  assert.ok(appHtml.includes(`id="product-panel-${screen.id}"`), `The app gallery is missing the ${screen.id} panel.`);
  assert.ok(appHtml.includes(`aria-controls="product-panel-${screen.id}"`), `The ${screen.id} tab is not connected to its panel.`);
  assert.ok(appHtml.includes(`src="${builtBase}${screen.image}"`), `The app gallery is missing the ${screen.id} image.`);
  await fs.access(path.join(dist, "assets", screen.image.replace(/^assets\//, "")));
}
for (const asset of ["mascot-neutral.svg", "overalls.svg", "sweat-band.svg"]) {
  await fs.access(path.join(dist, "assets", "mascot", asset));
}

const notFound = await fs.readFile(path.join(dist, "404.html"), "utf8");
assert.match(notFound, /This page isn't here/);
console.log(`Validated the team page, app page, ${members.length} profiles, ${productScreenshots.length} screenshots, and mascot assets.`);
