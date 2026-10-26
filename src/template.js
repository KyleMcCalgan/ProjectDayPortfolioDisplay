import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { features, journey, members, partners, productScreenshots, site } from "./data/content.js";

const journeyImageDir = fileURLToPath(new URL("../public/assets/journey/", import.meta.url));

// Images dropped into public/assets/journey/<stop id>/ replace the default screenshots.
// Short, wide PNGs (e.g. a sign-in card) are fitted rather than cropped like tall app screens.
function isWideImage(file) {
  if (!file.toLowerCase().endsWith(".png")) return false;
  try {
    const header = fs.readFileSync(file).subarray(16, 24);
    return header.readUInt32BE(0) / header.readUInt32BE(4) > 0.5;
  } catch {
    return false;
  }
}

function journeyImages(stop) {
  try {
    return fs.readdirSync(`${journeyImageDir}${stop.id}`)
      .filter((file) => /\.(png|jpe?g|webp|gif|svg)$/i.test(file))
      .sort()
      .map((file) => ({
        wide: isWideImage(`${journeyImageDir}${stop.id}/${file}`),
        image: `assets/journey/${stop.id}/${file}`,
        alt: `${stop.title}: ${file.replace(/\.[^.]+$/, "").replace(/^\d+[-_ ]*/, "").replace(/[-_]+/g, " ")}`,
      }));
  } catch {
    return [];
  }
}

const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[character]));

const pathFor = (base, path = "") => {
  const target = String(path);
  return `${base}${target.startsWith("/") ? target.slice(1) : target}`;
};

const icon = (name, size = 18) => {
  const shapes = {
    arrow: '<path d="M4 12h15M13 5l7 7-7 7"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/>',
    wallet: '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 9h18M16 14h2"/>',
  };
  return `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${shapes[name] || shapes.arrow}</svg>`;
};

function header(base, active = "team") {
  const teamCurrent = active === "team" ? ' aria-current="page"' : "";
  const appCurrent = active === "app" ? ' aria-current="page"' : "";
  const journeyCurrent = active === "journey" ? ' aria-current="page"' : "";
  return `<header class="site-header"><div class="nav-shell wrap">
    <a class="brand" href="${pathFor(base)}" aria-label="SpendSense team page">
      <img class="brand-mark" src="${pathFor(base, "assets/favicon.svg?v=2")}" alt="" width="34" height="34"><span class="brand-name">SpendSense</span>
    </a>
    <nav class="main-nav" aria-label="Main navigation">
      <a href="${pathFor(base)}"${teamCurrent}>Team</a><a href="${pathFor(base, "app/")}"${appCurrent}>App</a><a href="${pathFor(base, "journey/")}"${journeyCurrent}>Journey</a>
    </nav>
  </div></header>`;
}

function footer(base) {
  return `<footer class="site-footer"><div class="wrap footer-inner">
    <a class="brand footer-brand" href="${pathFor(base)}" aria-label="SpendSense team page"><img class="brand-mark" src="${pathFor(base, "assets/favicon.svg?v=2")}" alt="" width="28" height="28"><span class="brand-name">SpendSense</span></a>
    <span>Project Day team portfolio</span>
    <span class="footer-links"><a class="footer-app-link" href="${pathFor(base, "journey/")}">Our journey ${icon("arrow", 14)}</a><a class="footer-app-link" href="${pathFor(base, "app/")}">View the app ${icon("arrow", 14)}</a></span>
  </div></footer>`;
}

function introMascot(base) {
  return `<figure class="intro-mascot" aria-hidden="true"><img src="${pathFor(base, "assets/mascot/mascot-neutral.svg")}" alt="" loading="lazy"></figure>`;
}

function shell({ base, title, description, body, active = "team", profileId = "", pageData = {} }) {
  const baseUrl = pathFor(base);
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#f3faf6"><meta name="description" content="${escapeHtml(description)}">
<meta property="og:type" content="website"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}">
<title>${escapeHtml(title)}</title><link rel="icon" type="image/svg+xml" href="${pathFor(base, "assets/favicon.svg?v=2")}"><link rel="stylesheet" href="${pathFor(base, "assets/site.css")}">
</head><body id="top" ${profileId ? `data-member-id="${escapeHtml(profileId)}"` : ""}>
${header(base, active)}<main>${body}</main>${footer(base)}
<script>window.SITE_BASE = ${JSON.stringify(baseUrl)}; window.SITE_DATA = ${JSON.stringify(pageData)};</script>
<script type="module" src="${pathFor(base, "assets/app.js")}"></script></body></html>`;
}

function renderTeamPage(base) {
  const teamCards = members.map((member, index) => {
    const number = String(index + 1).padStart(2, "0");
    return `<a class="member-card" href="${pathFor(base, `team/${member.slug}/`)}" aria-label="Open portfolio for ${escapeHtml(member.name)}">
      <span class="member-card-photo">${member.portrait ? `<img class="member-photo" src="${pathFor(base, member.portrait)}" alt="" loading="lazy">` : `<span class="member-index">${number}</span>`}</span>
      <span class="member-card-content"><span class="member-arrow">${icon("arrow", 20)}</span><span class="member-copy"><strong>${escapeHtml(member.name)}</strong>${member.headline && !member.isPlaceholder ? `<span class="member-role">${escapeHtml(member.headline)}</span>` : ""}<span class="member-card-link">${member.isMock ? "Sample profile · Open portfolio" : "View portfolio"}</span></span></span>
    </a>`;
  }).join("");

  const body = `<section class="page team-page wrap" id="team">
    <header class="page-intro page-intro-with-mascot team-intro">
      <div class="page-intro-copy"><h1>Meet the <span>team.</span></h1>
      <p>Five teammates behind SpendSense. Choose a card to explore each portfolio.</p>
      <a class="site-visit-link" href="${escapeHtml(site.applicationUrl)}" target="_blank" rel="noopener noreferrer">Visit spendsense.co.za ${icon("external", 13)}</a></div>
      ${introMascot(base)}
    </header>
    <nav class="team-directory" aria-label="SpendSense team profiles">${teamCards}</nav>
    <p class="team-note">Introductions, roles, and project details will be added as the team approves them.</p>
  </section>`;

  return shell({ base, title: "The SpendSense Team", description: site.description, body, active: "team" });
}

function renderAppPage(base) {
  const tabs = productScreenshots.map((screen, index) => {
    const active = index === 0;
    return `<button class="product-tab ${active ? "is-active" : ""}" type="button" role="tab" id="tab-${escapeHtml(screen.id)}" aria-selected="${active}" aria-controls="product-screen" tabindex="${active ? "0" : "-1"}" data-product-tab="${escapeHtml(screen.id)}">${escapeHtml(screen.title)}</button>`;
  }).join("");

  const firstScreen = productScreenshots[0];
  const imagePath = pathFor(base, firstScreen.image);
  const firstHighlights = (firstScreen.highlights || []).map((highlight) => `<li>${escapeHtml(highlight)}</li>`).join("");
  const body = `<section class="page app-page wrap" id="app">
    <header class="page-intro page-intro-with-mascot app-intro">
      <div class="page-intro-copy"><h1>Explore the app.</h1>
        <p>These six screens are a small preview of SpendSense.</p>
        <a class="app-more-link" href="${escapeHtml(site.applicationUrl)}" target="_blank" rel="noopener noreferrer">Explore more at spendsense.co.za ${icon("external", 13)}</a>
      </div>
      ${introMascot(base)}
    </header>
    <nav class="product-tabs" role="tablist" aria-label="SpendSense app screens">${tabs}</nav>
    <section class="product-display" id="product-screen" role="tabpanel" aria-labelledby="tab-dashboard" aria-live="polite">
      <figure class="product-frame">
        <div class="product-image-window">
          <img data-product-image src="${imagePath}" alt="${escapeHtml(firstScreen.alt)}">
          <p class="product-image-error" data-product-error hidden>The screenshot could not be loaded. Select another screen or try again later.</p>
        </div>
      </figure>
      <aside class="product-details" aria-label="Selected app screen details">
        <h2 data-product-title>${escapeHtml(firstScreen.title)}</h2>
        <p data-product-summary>${escapeHtml(firstScreen.summary || firstScreen.alt)}</p>
        <ul class="product-highlights" data-product-highlights>${firstHighlights}</ul>
        <p class="product-details-note">These views are a small window into the wider SpendSense experience.</p>
      </aside>
    </section>
  </section>`;

  return shell({ base, title: "Explore the SpendSense App", description: "Browse real SpendSense app screens for Home, Calendar, Simulation, Quests, Friends, and Mascot.", body, active: "app", pageData: { productScreenshots } });
}

function partnersMarkup(base, className) {
  return `<section class="journey-partners ${className}" aria-label="Team and partners"><h2>Built by MARK2, for EPI-USE Labs &amp; Advance</h2><ul>${partners.map((partner) => `<li><span class="partner-logo"><img src="${pathFor(base, partner.image)}" alt="${escapeHtml(partner.name)} logo" loading="lazy"></span><span class="partner-note">${escapeHtml(partner.note)}</span></li>`).join("")}</ul></section>`;
}

function renderJourneyPage(base) {
  const screenById = new Map(productScreenshots.map((screen) => [screen.id, screen]));
  const stops = journey.map((stop, index) => {
    const customShots = journeyImages(stop);
    const shots = customShots.length ? customShots : stop.shots.map((id) => screenById.get(id)).filter(Boolean);
    const media = shots.length
      ? `<div class="journey-shots">${shots.map((shot) => `<figure class="journey-shot${shot.wide ? " is-wide" : ""}"><img src="${pathFor(base, shot.image)}" alt="${escapeHtml(shot.alt)}" loading="lazy"></figure>`).join("")}</div>`
      : `<div class="journey-numeral" aria-hidden="true">${escapeHtml(stop.number)}</div>`;
    const built = stop.built.length ? `<ul class="journey-built">${stop.built.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : "";
    const challenge = stop.challenge
      ? `<aside class="journey-challenge"><strong>Challenge: ${escapeHtml(stop.challenge.title)}</strong><p>${escapeHtml(stop.challenge.text)}</p></aside>`
      : "";
    const issueMeta = stop.issues ? `<span>${stop.issues} issues</span>` : "";
    const tags = stop.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
    const partnerBlock = stop.id === "project-day" ? partnersMarkup(base, "journey-partners-inline") : "";
    return `<div class="journey-stop journey-stop-${index + 1}" role="tabpanel" id="journey-panel-${escapeHtml(stop.id)}" aria-labelledby="journey-tab-${escapeHtml(stop.id)}" data-journey-slide>
      <span class="journey-node" aria-hidden="true">${escapeHtml(stop.number)}</span>
      <article class="journey-card${shots.length > 2 ? " journey-card-wide" : ""}" aria-labelledby="${escapeHtml(stop.id)}-title">
        <div class="journey-media">${media}</div>
        <div class="journey-copy">
          <p class="journey-meta"><span>${escapeHtml(stop.label || `Demo ${stop.number}`)}</span><span>${escapeHtml(stop.period)}</span>${issueMeta}</p>
          <h2 id="${escapeHtml(stop.id)}-title">${escapeHtml(stop.title)}</h2>
          <p class="journey-tagline">${escapeHtml(stop.tagline)}</p>
          <p>${escapeHtml(stop.summary)}</p>
          ${built}${challenge}
          ${tags ? `<div class="tag-row">${tags}</div>` : ""}${partnerBlock}
        </div>
      </article>
    </div>`;
  }).join("");

  const tabs = journey.map((stop, index) => `<button class="journey-tab${index === 0 ? " is-active" : ""}" type="button" role="tab" id="journey-tab-${escapeHtml(stop.id)}" aria-selected="${index === 0}" aria-controls="journey-panel-${escapeHtml(stop.id)}" tabindex="${index === 0 ? "0" : "-1"}" data-journey-tab>${escapeHtml(stop.tab)}</button>`).join("");
  const body = `<section class="page journey-page wrap" id="journey">
    <header class="page-intro page-intro-with-mascot journey-intro">
      <div class="page-intro-copy"><h1>Our <span>journey.</span></h1>
      <p>Four demos, one app. See how SpendSense grew from a blank repository into what you see today.</p>
      <a class="app-more-link" href="${pathFor(base, "app/")}">Explore the finished app ${icon("arrow", 13)}</a></div>
      ${introMascot(base)}
    </header>
    <div class="journey-carousel" data-journey-carousel>
      <nav class="journey-tabs" role="tablist" aria-label="SpendSense demos">${tabs}</nav>
      <div class="journey-timeline" data-journey-pages>${stops}</div>
    </div>
    ${partnersMarkup(base, "journey-partners-footer")}
    <p class="journey-note">Built from the project's GitHub milestones and issues.</p>
  </section>`;
  return shell({ base, title: "The SpendSense Journey", description: "How SpendSense was built across four demos, from foundations to simulation, receipt scanning and mascot guidance.", body, active: "journey" });
}

function profileLinks(member) {
  const definitions = [
    ["GitHub", member.links.github], ["LinkedIn", member.links.linkedin],
    ["Website", member.links.website], ["Email", member.links.email ? "mailto:" + member.links.email : ""],
  ].filter(([, url]) => url);
  if (!definitions.length) return '<p class="profile-empty">No public links added yet.</p>';
  return definitions.map(([label, url]) =>
    '<a class="profile-link" href="' + escapeHtml(url) + '"' +
    (url.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : "") +
    '>' + escapeHtml(label) + " " + icon("external", 14) + "</a>",
  ).join("");
}

function profileProjects(member) {
  if (!member.projects.length) return '<p class="profile-empty">Projects will appear here when they are ready to share.</p>';
  const cards = member.projects.map((project, index) => {
    const technologies = (project.technologies || []).map((tech) =>
      '<span class="tag">' + escapeHtml(tech) + "</span>",
    ).join("");
    const repositoryLink = project.repoUrl
      ? '<a href="' + escapeHtml(project.repoUrl) + '" target="_blank" rel="noopener noreferrer">Repository ' + icon("external", 14) + "</a>"
      : "";
    const demoLink = project.demoUrl
      ? '<a href="' + escapeHtml(project.demoUrl) + '" target="_blank" rel="noopener noreferrer">Live demo ' + icon("external", 14) + "</a>"
      : "";
    const responsibility = project.responsibility
      ? '<p class="responsibility"><strong>Role:</strong> ' + escapeHtml(project.responsibility) + "</p>"
      : "";
    const screenshot = project.screenshots?.[0];
    const projectImage = screenshot
      ? '<img src="' + pathFor(base, screenshot.src) + '" alt="' + escapeHtml(screenshot.alt) + '" loading="lazy">'
      : '<span class="project-image-fallback">' + icon("wallet", 23) + "<span>Project preview</span></span>";

    return '<article class="project-item">' +
      '<div class="project-image-placeholder">' + projectImage + "</div>" +
      '<div class="project-item-copy"><div class="project-title-row"><h3>' + escapeHtml(project.title) + '</h3><span class="project-index">' + String(index + 1).padStart(2, "0") + "</span></div>" +
      "<p>" + escapeHtml(project.summary) + "</p>" + responsibility +
      '<div class="tag-row">' + technologies + "</div>" +
      '<div class="project-links">' + repositoryLink + demoLink + "</div></div></article>";
  }).join("");
  return '<div class="project-list">' + cards + "</div>";
}

function profileContributions(member, base) {
  // Listed in the order written in profile.env, so the most important work comes first.
  const contributions = member.contributions || [];
  if (!contributions.length) return '<p class="profile-empty">Confirmed SpendSense work will appear here.</p>';
  const items = contributions.map((contribution, index) =>
    '<article class="contribution-item"><span class="contribution-number">' + String(index + 1).padStart(2, "0") +
    '</span><div class="contribution-copy"><h3><a href="' + pathFor(base, "app/") + '">' +
    escapeHtml(contribution.title) + " " + icon("arrow", 14) + "</a></h3>" +
    (contribution.role ? '<p class="contribution-role">' + escapeHtml(contribution.role) + "</p>" : "") +
    (contribution.detail ? "<p>" + escapeHtml(contribution.detail) + "</p>" : "") +
    "</div></article>",
  ).join("");
  return '<div class="contribution-list">' + items + "</div>";
}
function cvBlock(member, base) {
  if (!member.cvPdf) return `<p class="profile-empty">No public CV has been added.</p>`;
  const cv = pathFor(base, member.cvPdf);
  const filename = `${member.name.replace(/[^a-z0-9]+/gi, "_")}_${member.isMock ? "Sample_" : ""}CV.pdf`;
  return '<div class="cv-preview"><h3 class="cv-preview-title">CV preview</h3>' +
    '<iframe class="cv-preview-frame" src="' + escapeHtml(cv) + '#view=FitH" title="' + escapeHtml(member.name) + ' CV preview" loading="lazy"></iframe>' +
    '<p class="cv-preview-note">If the preview does not load, use Open in a new tab or Download CV below.</p></div>' +
    '<div class="cv-actions"><a class="button button-primary" href="' + escapeHtml(cv) + '" download="' + escapeHtml(filename) + '">Download CV ' + icon("arrow", 15) + '</a><a class="text-link" href="' + escapeHtml(cv) + '" target="_blank" rel="noopener noreferrer">Open in a new tab ' + icon("external", 14) + '</a></div>';
}

function renderProfile(member, base) {
  const number = member.id.slice(-2);
  const avatar = member.portrait
    ? '<img class="profile-portrait" src="' + pathFor(base, member.portrait) + '" alt="Portrait of ' + escapeHtml(member.name) + '" loading="lazy">'
    : '<span class="profile-number" aria-hidden="true">' + number + "</span>";
  const skillTags = member.skills.length
    ? member.skills.map((skill) => '<span class="tag">' + escapeHtml(skill) + "</span>").join("")
    : '<p class="profile-empty">Approved skills will appear here.</p>';
  const profileAreas = [
    { id: "profile", label: "Profile" },
    { id: "work", label: "Work" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "contact", label: "Contact" },
  ];
  const areaTabs = profileAreas.map((area, index) =>
    '<button class="profile-tab' + (index === 0 ? ' is-active' : '') + '" type="button" role="tab" id="profile-tab-' + area.id +
    '" aria-selected="' + (index === 0) + '" aria-controls="profile-panel-' + area.id + '" tabindex="' + (index === 0 ? '0' : '-1') +
    '" data-profile-tab="' + area.id + '">' + area.label + '</button>',
  ).join("");
  const profileDots = profileAreas.map((area, index) =>
    '<button class="profile-dot' + (index === 0 ? ' is-active' : '') + '" type="button" data-profile-dot="' + index +
    '" aria-label="Show ' + area.label + ' page"' + (index === 0 ? ' aria-current="step"' : '') + '><span></span></button>',
  ).join("");
  const areaPanels =
    '<div class="profile-slide profile-slide-intro" id="profile-panel-profile" role="tabpanel" aria-labelledby="profile-tab-profile" data-profile-slide="profile">' +
      '<header class="profile-hero" role="region" aria-label="' + escapeHtml(member.name) + ' profile information" tabindex="0"><div class="profile-visual">' + avatar +
        '<span class="profile-visual-label">Team member ' + number + "</span></div>" +
        '<div class="profile-intro">' +
          (member.isMock ? '<span class="sample-badge">Sample profile</span>' : "") +
          "<h1>" + escapeHtml(member.name) + "</h1>" +
          '<p class="profile-headline">' + escapeHtml(member.headline) + "</p>" +
          '<p class="profile-bio">' + escapeHtml(member.bio) + "</p>" +
        "</div></header>" +
    "</div>" +
    '<div class="profile-slide" id="profile-panel-work" role="tabpanel" aria-labelledby="profile-tab-work" data-profile-slide="work"><section class="profile-section" tabindex="0">' +
      '<header class="profile-section-heading"><h2>SpendSense work</h2><a class="section-jump" href="' + pathFor(base, "app/") + '">Explore the app ' + icon("arrow", 14) + "</a></header>" +
      profileContributions(member, base) +
    "</section></div>" +
    '<div class="profile-slide" id="profile-panel-projects" role="tabpanel" aria-labelledby="profile-tab-projects" data-profile-slide="projects"><section class="profile-section" tabindex="0">' +
      '<header class="profile-section-heading"><h2>Projects</h2></header>' + profileProjects(member) +
    "</section></div>" +
    '<div class="profile-slide profile-slide-fill" id="profile-panel-skills" role="tabpanel" aria-labelledby="profile-tab-skills" data-profile-slide="skills"><section class="profile-section profile-fill-section profile-skills" tabindex="0">' +
      '<header class="profile-section-heading"><h2>Skills</h2></header><div class="tag-row">' + skillTags + "</div>" +
    "</section></div>" +
    '<div class="profile-slide profile-slide-fill" id="profile-panel-contact" role="tabpanel" aria-labelledby="profile-tab-contact" data-profile-slide="contact"><section class="profile-section profile-fill-section profile-contact" tabindex="0">' +
      '<header class="profile-section-heading"><h2>Find me</h2></header><div class="contact-links">' + profileLinks(member) + "</div>" + cvBlock(member, base) +
    "</section></div>";
  const body = '<section class="page profile-page wrap">' +
    '<a class="profile-back" href="' + pathFor(base) + '">' + icon("arrow", 15) + "All teammates</a>" +
    '<div class="profile-content">' +
      '<nav class="profile-tabs" role="tablist" aria-label="' + escapeHtml(member.name) + ' portfolio areas">' + areaTabs + "</nav>" +
      '<div class="profile-carousel" data-profile-carousel><div class="profile-pages" data-profile-pages>' + areaPanels +
      '</div><nav class="profile-pager" aria-label="' + escapeHtml(member.name) + ' page navigation">' + profileDots + "</nav></div>" +
    "</div></section>";
  return shell({
    base,
    title: member.name + " | SpendSense Team",
    description: member.name + "'s portfolio page for the SpendSense team hub.",
    body,
    active: "team",
    profileId: member.id,
    pageData: { members: [member] },
  });
}
export function renderPage(pathname, base) {
  const relativePath = pathname === base || pathname === base.slice(0, -1)
    ? "/"
    : pathname.startsWith(base) ? `/${pathname.slice(base.length)}` : pathname;
  const normalizedPath = relativePath.endsWith("/") ? relativePath : `${relativePath}/`;
  const slugMatch = normalizedPath.match(/^\/team\/([^/]+)\/$/);
  if (slugMatch) {
    const member = members.find((item) => item.slug === decodeURIComponent(slugMatch[1]));
    if (member) return renderProfile(member, base);
    return renderNotFound(base);
  }
  if (normalizedPath === "/app/") return renderAppPage(base);
  if (normalizedPath === "/journey/") return renderJourneyPage(base);
  if (normalizedPath === "/") return renderTeamPage(base);
  return renderNotFound(base);
}

export function renderNotFound(base) {
  const body = `<section class="page not-found wrap"><span class="not-found-number">404</span><h1>This page isn't here.</h1><p>Choose a team profile or take a look at the app screens.</p><div class="not-found-links"><a class="button button-primary" href="${pathFor(base)}">Team page ${icon("arrow", 15)}</a><a class="text-link" href="${pathFor(base, "app/")}">View the app ${icon("arrow", 15)}</a></div></section>`;
  return shell({ base, title: `Page not found | ${site.name}`, description: "This SpendSense team hub page could not be found.", body });
}

export { members, features, journey, partners, productScreenshots, site };
