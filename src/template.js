import { features, members, milestones, site } from "./data/content.js";

const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[character]));

const pathFor = (base, path = "") => `${base}${String(path).replace(/^\/+/, "")}`;
const icon = (name, size = 18) => {
  const shapes = {
    arrow: '<path d="M4 12h15M13 5l7 7-7 7"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    sparkle: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/>',
    wallet: '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 9h18M16 14h2"/><path d="M6 6V4a1 1 0 0 1 1-1h11"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
  };
  return `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${shapes[name] || shapes.arrow}</svg>`;
};

function header(base, profile = false) {
  const links = [
    ["About", "#about"], ["Features", "#features"], ["Team", "#team"],
    ["Skills", "#skills"], ["Journey", "#journey"],
  ];
  return `<header class="site-header"><div class="nav-shell wrap">
    <a class="brand" href="${pathFor(base)}" aria-label="SpendSense home">
      <span class="brand-mark" aria-hidden="true"><span></span><span></span><span></span></span>
      <span>SpendSense</span><small>TEAM HUB</small>
    </a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-nav" aria-label="Open navigation"><span></span><span></span></button>
    <nav class="main-nav" id="main-nav" aria-label="Main navigation">
      ${profile ? `<a class="nav-back" href="${pathFor(base, "#team")}">← Back to team</a>` : links.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}
    </nav>
    ${profile ? `<a class="nav-action" href="${pathFor(base, "#team")}">Team directory ${icon("arrow", 15)}</a>` : `<a class="nav-action" href="#features">Explore SpendSense ${icon("arrow", 15)}</a>`}
  </div></header>`;
}

function footer(base) {
  return `<footer class="site-footer"><div class="wrap footer-main">
    <a class="brand footer-brand" href="${pathFor(base)}"><span class="brand-mark" aria-hidden="true"><span></span><span></span><span></span></span><span>SpendSense</span><small>TEAM HUB</small></a>
    <p>A project showcase built to connect the product with the people behind it.</p>
    <a class="footer-top" href="#top">Back to top ↑</a>
  </div><div class="wrap footer-bottom"><span>Project Day · Team portfolio hub</span><span>Public profile content is pending team approval.</span></div></footer>`;
}

function shell({ base, title, description, body, profileId = "" }) {
  const baseUrl = pathFor(base);
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#f8f6f2"><meta name="description" content="${escapeHtml(description)}">
<meta property="og:type" content="website"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}">
<title>${escapeHtml(title)}</title><link rel="icon" type="image/svg+xml" href="${pathFor(base, "assets/favicon.svg")}"><link rel="stylesheet" href="${pathFor(base, "assets/site.css")}">
</head><body id="top" ${profileId ? `data-member-id="${escapeHtml(profileId)}"` : ""}>
${header(base, Boolean(profileId))}<main>${body}</main>${footer(base)}
<div class="achievement" data-achievement role="status" aria-live="polite" hidden><span class="achievement-mark">${icon("check", 18)}</span><span><strong>Team explorer</strong><small>You visited all five portfolio pages.</small></span><button type="button" aria-label="Dismiss achievement" data-dismiss-achievement>${icon("close", 16)}</button></div>
<script>window.SITE_BASE = ${JSON.stringify(baseUrl)}; window.SITE_DATA = ${JSON.stringify({ members, features })};</script>
<script type="module" src="${pathFor(base, "assets/app.js")}"></script></body></html>`;
}

function previewArt() {
  return `<div class="preview-frame" aria-label="Illustrative interface placeholder, not a SpendSense screenshot">
    <div class="preview-bar"><span class="preview-brand"><span class="brand-mark small" aria-hidden="true"><span></span><span></span><span></span></span>SpendSense</span><span class="preview-status">ILLUSTRATIVE PREVIEW</span></div>
    <div class="preview-content"><div class="preview-side"><span class="preview-dot active"></span><span class="preview-line wide"></span><span class="preview-dot"></span><span class="preview-line"></span><span class="preview-dot"></span><span class="preview-line short"></span></div>
    <div class="preview-main"><div class="preview-welcome"><div><span class="preview-label">MONEY OVERVIEW</span><span class="preview-title">A clearer view of your money.</span></div><span class="preview-avatar">S</span></div>
      <div class="preview-columns"><div class="preview-module"><span class="preview-label">SPENDING OVER TIME</span><svg class="preview-chart" viewBox="0 0 360 100" role="img" aria-label="Decorative chart placeholder"><path d="M0 80 C40 74 42 42 82 54 S128 76 160 52 210 63 242 34 295 50 330 20 350 26 360 12"/><path class="chart-fade" d="M0 80 C40 74 42 42 82 54 S128 76 160 52 210 63 242 34 295 50 330 20 350 26 360 12 L360 100 L0 100Z"/></svg><div class="preview-lines"><i></i><i></i><i></i><i></i></div></div>
        <div class="preview-module preview-module-pink"><span class="preview-label">YOUR NEXT STEP</span><span class="preview-circle"><span></span></span><span class="preview-skeleton"></span><span class="preview-skeleton short"></span></div></div>
      <div class="preview-bottom"><span>Personal finance tools</span><span>Made to explore</span></div>
    </div></div><p class="preview-caption"><span class="caption-pin"></span>Layout illustration · replace with an approved app screenshot</p>`;
}

function featurePanel(feature, base) {
  const tech = feature.technologies.length
    ? feature.technologies.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")
    : `<span class="soft-note">No verified technologies added.</span>`;
  const contributors = feature.contributions.length
    ? feature.contributions.map((contribution) => {
        const member = members.find((item) => item.id === contribution.memberId);
        if (!member) return "";
        return `<a class="contributor-link" href="${pathFor(base, `team/${member.slug}/`)}"><span class="mini-avatar">${escapeHtml(member.name.slice(-2))}</span><span><strong>${escapeHtml(member.name)}</strong><small>${escapeHtml(contribution.role)}</small></span>${icon("arrow", 16)}</a>`;
      }).join("")
    : `<div class="pending-inline"><span class="pending-icon">?</span><span><strong>Contributor mapping pending</strong><small>Feature ownership has not been supplied yet.</small></span></div>`;
  return `<div class="feature-detail" data-active-feature="${escapeHtml(feature.id)}">
    <div class="feature-copy"><div class="eyebrow-row"><span class="eyebrow">${escapeHtml(feature.category)}</span><span class="status-pill"><i></i> Verification needed</span></div>
      <p class="feature-count">${String(features.indexOf(feature) + 1).padStart(2, "0")} / 0${features.length}</p><h3>${escapeHtml(feature.title)}</h3><p class="feature-summary">${escapeHtml(feature.summary)}</p><p class="feature-explainer">${escapeHtml(feature.detail)}</p>
      <div class="feature-meta"><div><span class="meta-label">TECHNOLOGY</span><div class="tag-row">${tech}</div></div><div><span class="meta-label">CONTRIBUTORS</span><div class="contributor-list">${contributors}</div></div></div>
    </div><div class="feature-visual"><div class="screenshot-placeholder"><div class="screenshot-icon">${icon("wallet", 25)}</div><span class="meta-label">SCREENSHOT NOT PROVIDED</span><p>Add an approved image of this feature to <code>public/assets/screenshots</code>.</p><span class="placeholder-rule"></span><span class="placeholder-rule small"></span><span class="placeholder-rule"></span></div><span class="visual-index">SPENDSENSE / FEATURE ${String(features.indexOf(feature) + 1).padStart(2, "0")}</span></div>
  </div>`;
}

function renderHome(base) {
  const firstFeature = features[0];
  const teamRows = members.map((member, index) => `<article class="member-row">
    <div class="member-index">${String(index + 1).padStart(2, "0")}</div><div class="member-avatar" aria-hidden="true"><span>${String(index + 1).padStart(2, "0")}</span><i></i></div>
    <div class="member-info"><span class="member-status">CONTENT PENDING</span><h3>${escapeHtml(member.name)}</h3><p>${escapeHtml(member.headline)}</p></div>
    <div class="member-skills">Skills pending approval</div><a class="member-cta" href="${pathFor(base, `team/${member.slug}/`)}" aria-label="View ${escapeHtml(member.name)} portfolio">View portfolio ${icon("arrow", 16)}</a>
  </article>`).join("");

  const skillMatches = [...new Set(members.flatMap((member) => member.skills))];
  const skillChips = skillMatches.length
    ? skillMatches.map((skill) => `<button class="skill-chip" type="button" data-skill="${escapeHtml(skill)}" aria-pressed="false">${escapeHtml(skill)}</button>`).join("")
    : `<p class="soft-note skill-pending">Approved developer skill tags will appear here once the team supplies them.</p>`;

  const timeline = milestones.map((milestone, index) => `<li class="milestone"><span class="milestone-node">${String(index + 1).padStart(2, "0")}</span><div><span class="milestone-label">EXAMPLE STAGE · DATE PENDING</span><h3>${escapeHtml(milestone.title)}</h3><p>${escapeHtml(milestone.note)}</p></div></li>`).join("");

  const body = `<section class="hero-section wrap">
    <div class="hero-copy"><p class="eyebrow hero-eyebrow"><span class="eyebrow-square"></span>PROJECT DAY · TEAM HUB</p><h1>Meet the team<br>behind <em>SpendSense.</em></h1>
      <p class="hero-lead">Explore a personal finance project designed to make everyday money tools easier to understand — and meet the people behind the work.</p>
      <div class="hero-actions"><a class="button button-primary" href="#features">Explore the app ${icon("arrow", 17)}</a><a class="button button-text" href="#team">Meet the developers <span>↓</span></a></div>
      <div class="hero-footnote"><span class="footnote-line"></span><span>Five individual portfolios · one shared project</span></div>
    </div><div class="hero-visual">${previewArt()}<div class="floating-note"><span class="note-sparkle">${icon("sparkle", 16)}</span><span><strong>Built to explore.</strong><small>Details verified by the team.</small></span></div></div>
  </section>
  <section class="intro-section section-pad" id="about"><div class="wrap intro-grid"><div><p class="eyebrow">01 · THE PROJECT</p><h2>Good money decisions start with a clearer picture.</h2></div><div class="intro-body"><p>SpendSense is a personal finance application created to help people explore their money with more confidence. This hub connects the product experience to the developers who shaped it.</p><p class="quiet-note"><span>${icon("sparkle", 16)}</span>Product details and team information are being prepared for publication. Unverified items are marked throughout.</p></div></div></section>
  <section class="features-section section-pad" id="features"><div class="wrap"><div class="section-head"><div><p class="eyebrow">02 · EXPLORE THE PRODUCT</p><h2>Ideas in the SpendSense brief.</h2></div><p class="section-description">These topics come from the project plan. Select one to see what still needs verification before it can be presented as a shipped feature.</p></div>
    <div class="feature-explorer"><div class="feature-tabs" role="tablist" aria-label="SpendSense feature concepts">${features.map((feature, index) => `<button class="feature-tab ${index === 0 ? "is-active" : ""}" type="button" role="tab" id="tab-${escapeHtml(feature.id)}" aria-selected="${index === 0}" aria-controls="feature-panel" data-feature-tab="${escapeHtml(feature.id)}"><span>${String(index + 1).padStart(2, "0")}</span>${escapeHtml(feature.title)}<i>${icon("arrow", 14)}</i></button>`).join("")}</div>
      <div id="feature-panel" class="feature-panel" role="tabpanel" aria-live="polite">${featurePanel(firstFeature, base)}</div></div>
    <div class="feature-foot"><span class="status-dot"></span><span>None of these topics are marked as verified product functionality.</span><a href="#team">Meet the team ${icon("arrow", 15)}</a></div>
  </div></section>
  <section class="team-section section-pad" id="team"><div class="wrap"><div class="section-head team-heading"><div><p class="eyebrow">03 · THE PEOPLE</p><h2>Five voices. One project.</h2></div><div class="team-context"><p>Open a full portfolio page for every team member. Names, roles and personal details remain placeholders until approved.</p><span class="content-badge">5 profiles · content pending</span></div></div>
    <div class="members-list">${teamRows}</div>
  </div></section>
  <section class="skills-section section-pad" id="skills"><div class="wrap skills-grid"><div class="skills-intro"><p class="eyebrow">04 · FIND THE RIGHT EXPERIENCE</p><h2>Search skills.<br><em>Find the work.</em></h2><p>Once the team publishes approved skills and project details, search here to find a developer and the work that supports each skill.</p><div class="skill-rule"></div><span class="meta-label">NO PROFICIENCY SCORES · EVIDENCE FIRST</span></div>
    <div class="skills-tool"><label class="search-label" for="skill-search">Search technologies, projects or contributions</label><div class="search-box">${icon("search", 19)}<input type="search" id="skill-search" placeholder="Try a skill or project name" autocomplete="off" aria-describedby="skill-help"><kbd>⌘ K</kbd></div><p id="skill-help" class="search-help">Search is case-insensitive. Skill combinations use AND matching.</p><div class="skill-filters" aria-label="Available skill filters">${skillChips}</div><div class="skill-results" data-skill-results aria-live="polite"><div class="skill-empty"><span class="empty-mark">${icon("search", 21)}</span><strong>Profiles are waiting for approved skills.</strong><p>Add verified skill tags in <code>src/data/content.js</code> to start exploring.</p></div></div></div>
  </div></section>
  <section class="journey-section section-pad" id="journey"><div class="wrap"><div class="section-head"><div><p class="eyebrow">05 · THE JOURNEY</p><h2>A timeline ready for the real story.</h2></div><p class="section-description">The stages below are a planning scaffold from the brief, not a record of confirmed project events. Add dates and evidence when the team verifies them.</p></div>
    <ol class="timeline-list">${timeline}</ol><p class="timeline-footnote">Example sequence · replace with confirmed milestones and dates.</p>
  </div></section>
  <section class="closing-section"><div class="wrap closing-wrap"><div class="closing-copy"><p class="eyebrow">SPENDSENSE · TEAM HUB</p><h2>Good work deserves<br>a clear introduction.</h2><p>Start with the project, then follow the work to the people who made it.</p><a class="button button-light" href="#team">Explore the team ${icon("arrow", 17)}</a></div><div class="mascot-card"><button type="button" class="mascot-button" data-mascot aria-label="Show a SpendSense reminder"><svg viewBox="0 0 120 120" role="img" aria-label="Decorative SpendSense site mascot"><path class="mascot-body" d="M60 15c24 0 42 17 42 40v29c0 15-11 25-26 25H44c-15 0-26-10-26-25V55c0-23 18-40 42-40Z"/><path class="mascot-ear" d="M29 25 17 10l-2 30M91 25l12-15 2 30"/><ellipse class="mascot-cheek" cx="39" cy="61" rx="4" ry="3"/><ellipse class="mascot-cheek" cx="81" cy="61" rx="4" ry="3"/><path class="mascot-eye" d="M43 49v4M77 49v4"/><path class="mascot-smile" d="M51 63c5 6 13 6 18 0"/><path class="mascot-mark" d="M60 28v8m-4-4h8"/></svg></button><div class="mascot-copy"><span class="meta-label">A SMALL REMINDER</span><p data-mascot-message>Tap the mascot for a little money wisdom.</p><small>No sound. Just a friendly nudge.</small></div></div></div></section>`;

  return shell({ base, title: site.title, description: site.description, body });
}

function profileLinks(member, base) {
  const definitions = [
    ["GitHub", member.links.github], ["LinkedIn", member.links.linkedin],
    ["Website", member.links.website], ["Email", member.links.email ? `mailto:${member.links.email}` : ""],
  ].filter(([, url]) => url);
  if (!definitions.length) return `<p class="soft-note">Verified professional links have not been provided.</p>`;
  return definitions.map(([label, url]) => `<a class="profile-link" href="${escapeHtml(url)}" ${url.startsWith("http") ? 'target="_blank" rel="noopener noreferrer"' : ""}>${escapeHtml(label)} ${icon("external", 14)}</a>`).join("");
}

function profileProjects(member, base) {
  if (!member.projects.length) return `<div class="profile-empty"><span class="empty-mark">${icon("wallet", 20)}</span><div><strong>Project entries are pending.</strong><p>Add approved projects, responsibilities, screenshots and links to this profile’s data.</p></div></div>`;
  return `<div class="project-grid">${member.projects.map((project) => `<article class="project-item"><div class="project-image-placeholder"><span>${icon("wallet", 23)}</span><small>PROJECT IMAGE PENDING</small></div><div class="project-item-copy"><span class="eyebrow">PERSONAL PROJECT</span><h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.summary)}</p>${project.responsibility ? `<p class="responsibility"><strong>Role:</strong> ${escapeHtml(project.responsibility)}</p>` : ""}<div class="tag-row">${(project.technologies || []).map((tech) => `<span class="tag">${escapeHtml(tech)}</span>`).join("")}</div><div class="project-links">${project.repoUrl ? `<a href="${escapeHtml(project.repoUrl)}" target="_blank" rel="noopener noreferrer">Repository ${icon("external", 14)}</a>` : ""}${project.demoUrl ? `<a href="${escapeHtml(project.demoUrl)}" target="_blank" rel="noopener noreferrer">Live demo ${icon("external", 14)}</a>` : ""}</div></div></article>`).join("")}</div>`;
}

function profileContributions(member, base) {
  const contributions = features.flatMap((feature) => feature.contributions.filter((item) => item.memberId === member.id).map((item) => ({ feature, contribution: item })));
  if (!contributions.length) return `<div class="profile-empty contribution-empty"><span class="empty-mark">${icon("sparkle", 20)}</span><div><strong>No verified feature contributions yet.</strong><p>Feature ownership is intentionally unassigned until the team confirms who worked on each area.</p><a href="${pathFor(base, "#features")}">Explore feature topics ${icon("arrow", 14)}</a></div></div>`;
  return `<div class="contribution-list">${contributions.map(({ feature, contribution }) => `<article class="contribution-item"><span class="contribution-pin">${icon("check", 16)}</span><div><span class="eyebrow">SPENDSENSE FEATURE</span><h3><a href="${pathFor(base, `#features`)}">${escapeHtml(feature.title)} ${icon("arrow", 14)}</a></h3><p>${escapeHtml(contribution.detail || contribution.role)}</p></div></article>`).join("")}</div>`;
}

function cvBlock(member, base) {
  if (!member.cvPdf) return `<div class="cv-empty"><div class="cv-symbol">PDF</div><div><span class="eyebrow">PUBLIC CV</span><h3>Approved CV not uploaded</h3><p>Only a reviewed, public-facing PDF should be added to this profile. No CV is shared from this placeholder.</p></div></div>`;
  const cv = pathFor(base, member.cvPdf);
  const filename = `${member.name.replace(/[^a-z0-9]+/gi, "_")}_CV.pdf`;
  return `<div class="cv-viewer"><div class="cv-actions"><a class="button button-primary" href="${cv}" download="${escapeHtml(filename)}">Download CV ${icon("arrow", 15)}</a><a class="button button-outline" href="${cv}" target="_blank" rel="noopener noreferrer">Open in a new tab ${icon("external", 14)}</a></div><object data="${cv}" type="application/pdf" aria-label="CV preview for ${escapeHtml(member.name)}"><p>PDF preview is not available in this browser. <a href="${cv}" target="_blank" rel="noopener noreferrer">Open the CV</a> or <a href="${cv}" download="${escapeHtml(filename)}">download it</a>.</p></object></div>`;
}

function renderProfile(member, base) {
  const initials = member.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
  const skillTags = member.skills.length ? member.skills.map((skill) => `<span class="tag">${escapeHtml(skill)}</span>`).join("") : `<span class="soft-note">Approved skills pending.</span>`;
  const portrait = member.portrait
    ? `<img src="${pathFor(base, member.portrait)}" alt="Portrait of ${escapeHtml(member.name)}" loading="lazy">`
    : `<span>${escapeHtml(initials)}</span><small>PHOTO PENDING</small>`;
  const body = `<section class="profile-hero section-pad"><div class="wrap"><a class="profile-back" href="${pathFor(base, "#team")}">← Back to the team directory</a><div class="profile-hero-grid"><div class="profile-identity"><div class="profile-portrait" aria-label="Portrait placeholder for ${escapeHtml(member.name)}">${portrait}<i></i></div><div class="profile-title-block"><span class="content-badge">PROFILE CONTENT PENDING</span><h1>${escapeHtml(member.name)}</h1><p class="profile-headline">${escapeHtml(member.headline)}</p><p class="profile-bio">${escapeHtml(member.bio)}</p><div class="profile-tags">${skillTags}</div><div class="profile-actions"><a class="button button-primary" href="#projects">View projects ${icon("arrow", 16)}</a><a class="button button-outline" href="#cv">CV details</a></div></div></div><aside class="profile-aside"><span class="aside-number">${member.name.slice(-2)}</span><span class="meta-label">SPENDSENSE TEAM</span><p>Personal details are placeholders until reviewed and approved by this developer.</p><div class="aside-rule"></div><span class="meta-label">FEATURES</span><p class="aside-stat">Ownership pending</p></aside></div></div></section>
    <section class="profile-section section-pad"><div class="wrap profile-section-grid"><div class="profile-section-title"><p class="eyebrow">01 · PROJECT WORK</p><h2>SpendSense contributions</h2><p>Feature relationships are maintained in one shared content file.</p></div><div class="profile-section-content">${profileContributions(member, base)}</div></div></section>
    <section class="profile-section profile-projects section-pad" id="projects"><div class="wrap profile-section-grid"><div class="profile-section-title"><p class="eyebrow">02 · SELECTED WORK</p><h2>Projects & experiments</h2><p>Personal projects should show the problem, the developer’s role and the tools used.</p></div><div class="profile-section-content">${profileProjects(member, base)}</div></div></section>
    <section class="profile-section profile-skills section-pad"><div class="wrap profile-section-grid"><div class="profile-section-title"><p class="eyebrow">03 · TOOLKIT</p><h2>Skills & technologies</h2><p>Skills will link to evidence from projects or confirmed contributions.</p></div><div class="profile-section-content skill-evidence"><div class="tag-row">${skillTags}</div><div class="evidence-note"><span>${icon("check", 16)}</span><p>Experience notes and project evidence will appear here when supplied.</p></div></div></div></section>
    <section class="profile-section cv-section section-pad" id="cv"><div class="wrap profile-section-grid"><div class="profile-section-title"><p class="eyebrow">04 · DOCUMENTS</p><h2>Curriculum vitae</h2><p>CVs are optional and should be approved for public sharing.</p></div><div class="profile-section-content">${cvBlock(member, base)}</div></div></section>
    <section class="profile-contact"><div class="wrap contact-grid"><div><p class="eyebrow">05 · CONNECT</p><h2>Follow their work.</h2><p>Verified profile links will appear once they are provided.</p></div><div class="contact-links">${profileLinks(member, base)}</div><a class="button button-outline" href="${pathFor(base, "#team")}">Back to all five profiles ${icon("arrow", 15)}</a></div></section>`;
  return shell({ base, title: `${member.name} · ${site.name} Team`, description: `${member.name}’s mini-portfolio for the SpendSense team hub. Profile information is pending approval.`, body, profileId: member.id });
}

export function renderPage(pathname, base) {
  const slugMatch = pathname.match(/\/team\/([^/]+)\/?$/);
  if (slugMatch) {
    const member = members.find((item) => item.slug === decodeURIComponent(slugMatch[1]));
    if (member) return renderProfile(member, base);
    return renderNotFound(base);
  }
  if (pathname === "/" || pathname.endsWith("/index.html") || pathname === base || pathname === base.slice(0, -1)) return renderHome(base);
  return renderNotFound(base);
}

export function renderNotFound(base) {
  const body = `<section class="not-found wrap"><span class="not-found-number">404</span><p class="eyebrow">PAGE NOT FOUND</p><h1>That page isn’t in this story.</h1><p>Try the SpendSense team hub or choose a profile from the directory.</p><a class="button button-primary" href="${pathFor(base)}">Back to SpendSense ${icon("arrow", 16)}</a></section>`;
  return shell({ base, title: `Page not found · ${site.name}`, description: "This SpendSense team hub page could not be found.", body });
}

export { members, features, milestones, site };
