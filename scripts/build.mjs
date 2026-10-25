import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderPage, members, site } from "../src/template.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
let base = process.env.BASE_PATH || "/";
if (!base.startsWith("/")) base = `/${base}`;
if (!base.endsWith("/")) base += "/";

await fs.rm(dist, { recursive: true, force: true });
await fs.mkdir(path.join(dist, "assets"), { recursive: true });
await fs.copyFile(path.join(root, "src/styles.css"), path.join(dist, "assets/site.css"));
await fs.copyFile(path.join(root, "src/app.js"), path.join(dist, "assets/app.js"));
await fs.cp(path.join(root, "public/assets"), path.join(dist, "assets"), { recursive: true });

await fs.writeFile(path.join(dist, "index.html"), renderPage("/", base), "utf8");
for (const member of members) {
  const profileDir = path.join(dist, "team", member.slug);
  await fs.mkdir(profileDir, { recursive: true });
  await fs.writeFile(path.join(profileDir, "index.html"), renderPage(`/team/${member.slug}/`, base), "utf8");
}
await fs.writeFile(path.join(dist, "404.html"), renderPage("/not-a-real-page/", base), "utf8");

const inventory = {
  title: site.title,
  basePath: base,
  profiles: members.map((member) => `${base}team/${member.slug}/`),
};
await fs.writeFile(path.join(dist, "site-inventory.json"), `${JSON.stringify(inventory, null, 2)}\n`, "utf8");
console.log(`Built ${members.length} portfolio routes with base path ${base}`);
