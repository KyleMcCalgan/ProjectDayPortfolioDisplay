import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const teamDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../team-members",
);

function readValue(rawValue, location) {
  const value = rawValue.trim();
  if (value.startsWith('"') && value.endsWith('"')) {
    try {
      return JSON.parse(value);
    } catch {
      throw new Error(`Invalid quoted value in ${location}.`);
    }
  }
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1);
  return value;
}

function parseProfile(source, filename) {
  const entries = {};
  for (const [index, rawLine] of source.split(/\r?\n/).entries()) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separator = line.indexOf("=");
    if (separator < 1) throw new Error(`Expected KEY=value in ${filename}:${index + 1}.`);

    const key = line.slice(0, separator).trim();
    if (!/^[A-Z][A-Z0-9_]*$/.test(key)) {
      throw new Error(`Invalid key "${key}" in ${filename}:${index + 1}.`);
    }
    if (Object.hasOwn(entries, key)) {
      throw new Error(`Duplicate key "${key}" in ${filename}:${index + 1}.`);
    }
    entries[key] = readValue(line.slice(separator + 1), `${filename}:${index + 1}`);
  }
  return entries;
}

const list = (value = "") => value.split(",").map((item) => item.trim()).filter(Boolean);
const isTrue = (value = "") => value.toLowerCase() === "true";

function indexedGroups(entries, prefix) {
  const groups = new Map();
  const pattern = new RegExp(`^${prefix}_(\\d+)_(.+)$`);

  for (const [key, value] of Object.entries(entries)) {
    const match = key.match(pattern);
    if (!match) continue;
    const index = Number(match[1]);
    if (!groups.has(index)) groups.set(index, {});
    groups.get(index)[match[2]] = value;
  }

  return [...groups.entries()].sort(([left], [right]) => left - right);
}

async function loadMember(folderName) {
  const filename = path.join(teamDirectory, folderName, "profile.env");
  const entries = parseProfile(await fs.readFile(filename, "utf8"), filename);
  const required = (key) => {
    if (!entries[key]) throw new Error(`Missing ${key} in ${filename}.`);
    return entries[key];
  };

  const id = required("ID");
  const slug = required("SLUG");
  const name = required("NAME");
  const cvFile = entries.CV_FILE || "";
  const configuredPortraitFile = entries.PORTRAIT_FILE || "";
  if (cvFile && (path.basename(cvFile) !== cvFile || /[\\/]/.test(cvFile))) {
    throw new Error(`CV_FILE must be a filename inside ${folderName}/cv.`);
  }
  if (configuredPortraitFile && (path.basename(configuredPortraitFile) !== configuredPortraitFile || /[\\/]/.test(configuredPortraitFile))) {
    throw new Error("PORTRAIT_FILE must be a filename inside " + folderName + "/photo.");
  }
  if (configuredPortraitFile && !/\.(jpe?g|png|webp)$/i.test(configuredPortraitFile)) {
    throw new Error("PORTRAIT_FILE must be a JPG, PNG, or WebP image in " + folderName + "/photo.");
  }

  const photoDirectory = path.join(teamDirectory, folderName, "photo");
  let photoFiles = [];
  try {
    photoFiles = (await fs.readdir(photoDirectory, { withFileTypes: true }))
      .filter((entry) => entry.isFile() && /\.(jpe?g|png|webp)$/i.test(entry.name))
      .map((entry) => entry.name);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  if (configuredPortraitFile && !photoFiles.includes(configuredPortraitFile)) {
    throw new Error("PORTRAIT_FILE \"" + configuredPortraitFile + "\" was not found in " + folderName + "/photo.");
  }
  if (!configuredPortraitFile && photoFiles.length > 1) {
    throw new Error("Multiple photos found in " + folderName + "/photo. Set PORTRAIT_FILE to choose one.");
  }
  const portraitFile = configuredPortraitFile || photoFiles[0] || "";

  const projects = indexedGroups(entries, "PROJECT").map(([, fields]) => {
    const screenshotFiles = list(fields.SCREENSHOT);
    const screenshotAlts = (fields.SCREENSHOT_ALT || "").split("|").map((item) => item.trim());
    for (const screenshotFile of screenshotFiles) {
      if (path.basename(screenshotFile) !== screenshotFile || /[\\/]/.test(screenshotFile)) {
        throw new Error("PROJECT_SCREENSHOT must be filenames inside " + folderName + "/projects.");
      }
      if (!/\.(jpe?g|png|webp|svg)$/i.test(screenshotFile)) {
        throw new Error("Project screenshots must be JPG, PNG, WebP, or SVG images in " + folderName + "/projects.");
      }
    }
    return {
      title: fields.TITLE || "",
      summary: fields.SUMMARY || "",
      responsibility: fields.RESPONSIBILITY || "",
      technologies: list(fields.TECHNOLOGIES),
      screenshotLayout: fields.SCREENSHOT_LAYOUT === "side-by-side" ? "side-by-side" : "stacked",
      repoUrl: fields.REPO_URL || "",
      demoUrl: fields.DEMO_URL || "",
      screenshots: screenshotFiles.map((screenshotFile, index) => ({
        src: `assets/projects/${slug}/${screenshotFile}`,
        alt: screenshotAlts[index] || `${fields.TITLE || name} project preview`,
      })),
    };
  });

  const contributions = indexedGroups(entries, "CONTRIBUTION").map(([, fields]) => ({
    featureId: fields.FEATURE_ID || "",
    title: fields.TITLE || "",
    role: fields.ROLE || "",
    detail: fields.DETAIL || "",
  }));

  return {
    order: Number(required("ORDER")),
    id,
    slug,
    name,
    headline: entries.HEADLINE || "",
    bio: entries.BIO || "",
    isPlaceholder: isTrue(entries.IS_PLACEHOLDER),
    isMock: isTrue(entries.IS_MOCK),
    portrait: portraitFile ? `assets/team/${slug}/${portraitFile}` : "",
    skills: list(entries.SKILLS),
    projects,
    links: {
      github: entries.GITHUB_URL || "",
      linkedin: entries.LINKEDIN_URL || "",
      website: entries.WEBSITE_URL || "",
      email: entries.EMAIL || "",
    },
    cvPdf: cvFile ? `assets/cvs/${slug}/${cvFile}` : "",
    contributions,
  };
}

const folders = await fs.readdir(teamDirectory, { withFileTypes: true });
const loadedMembers = await Promise.all(
  folders.filter((entry) => entry.isDirectory()).map((entry) => loadMember(entry.name)),
);
loadedMembers.sort((left, right) => left.order - right.order);

if (new Set(loadedMembers.map((member) => member.id)).size !== loadedMembers.length) {
  throw new Error("Team profile IDs must be unique.");
}
if (new Set(loadedMembers.map((member) => member.slug)).size !== loadedMembers.length) {
  throw new Error("Team profile slugs must be unique.");
}
if (new Set(loadedMembers.map((member) => member.order)).size !== loadedMembers.length) {
  throw new Error("Team profile ORDER values must be unique.");
}
if (loadedMembers.some((member) => !Number.isInteger(member.order) || member.order < 1)) {
  throw new Error("Team profile ORDER values must be positive whole numbers.");
}

export const members = loadedMembers;
