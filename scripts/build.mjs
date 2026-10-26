import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderPage, members, site } from "../src/template.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
let base = process.env.BASE_PATH || "/";
if (!base.startsWith("/")) base = `/${base}`;
if (!base.endsWith("/")) base += "/";

// Update generated files in place. Keeping dist alive avoids transient 404s in
// local preview servers and works around Windows file locks from Live Server.
await fs.mkdir(path.join(dist, "assets"), { recursive: true });
await fs.copyFile(path.join(root, "src/styles.css"), path.join(dist, "assets/site.css"));
await fs.copyFile(path.join(root, "src/app.js"), path.join(dist, "assets/app.js"));
await fs.cp(path.join(root, "public/assets"), path.join(dist, "assets"), { recursive: true });

for (const member of members) {
  if (member.portrait) {
    const portraitFile = path.basename(member.portrait);
    const source = path.join(root, "team-members", member.name, "photo", portraitFile);
    const destinationDirectory = path.join(dist, "assets", "team", member.slug);
    await fs.access(source);
    await fs.mkdir(destinationDirectory, { recursive: true });
    await fs.copyFile(source, path.join(destinationDirectory, portraitFile));
  }
  if (member.cvPdf) {
    const cvFile = path.basename(member.cvPdf);
    const source = path.join(root, "team-members", member.name, "cv", cvFile);
    const destinationDirectory = path.join(dist, "assets", "cvs", member.slug);
    await fs.access(source);
    await fs.mkdir(destinationDirectory, { recursive: true });
    await fs.copyFile(source, path.join(destinationDirectory, cvFile));
  }
  for (const project of member.projects) {
    for (const screenshot of project.screenshots) {
      const screenshotFile = path.basename(screenshot.src);
      const source = path.join(root, "team-members", member.name, "projects", screenshotFile);
      const destinationDirectory = path.join(dist, "assets", "projects", member.slug);
      await fs.access(source);
      await fs.mkdir(destinationDirectory, { recursive: true });
      await fs.copyFile(source, path.join(destinationDirectory, screenshotFile));
    }
  }
}

await fs.writeFile(path.join(dist, "index.html"), renderPage("/", base), "utf8");
const appDir = path.join(dist, "app");
await fs.mkdir(appDir, { recursive: true });
await fs.writeFile(path.join(appDir, "index.html"), renderPage("/app/", base), "utf8");
const journeyDir = path.join(dist, "journey");
await fs.mkdir(journeyDir, { recursive: true });
await fs.writeFile(path.join(journeyDir, "index.html"), renderPage("/journey/", base), "utf8");
for (const member of members) {
  const profileDir = path.join(dist, "team", member.slug);
  await fs.mkdir(profileDir, { recursive: true });
  await fs.writeFile(path.join(profileDir, "index.html"), renderPage(`/team/${member.slug}/`, base), "utf8");
}
await fs.writeFile(path.join(dist, "404.html"), renderPage("/not-a-real-page/", base), "utf8");

const inventory = {
  title: site.title,
  basePath: base,
  app: `${base}app/`,
  journey: `${base}journey/`,
  profiles: members.map((member) => `${base}team/${member.slug}/`),
};
await fs.writeFile(path.join(dist, "site-inventory.json"), `${JSON.stringify(inventory, null, 2)}\n`, "utf8");
console.log(`Built ${members.length} portfolio routes with base path ${base}`);
