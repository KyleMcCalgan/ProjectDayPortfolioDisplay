
import { features, members, productScreenshots, site } from "./data/content.js";

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

function header(base, profile = false) {
  const teamHref = profile ? pathFor(base, "#team") : "#team";
  const productHref = profile ? pathFor(base, "#product") : "#product";
  return `<header class="site-header"><div class="nav-shell wrap">
    <a class="brand" href="${pathFor(base)}" aria-label="SpendSense team hub">
      <span class="brand-mark" aria-hidden="true">S</span><span class="brand-name">SpendSense</span><span class="brand-tag">TEAM HUB</span>
    </a>
    <nav class="main-nav" aria-label="Main navigation">
      <a href="${teamHref}">The team</a><a href="${productHref}">The app</a>
    </nav>
    <a class="nav-action" href="${escapeHtml(site.applicationUrl)}" target="_blank" rel="noopener noreferrer">Visit SpendSense ${icon("external", 15)}</a>
  </div></header>`;
}

function footer(base) {
  return `<footer class="site-footer"><div class="wrap footer-main">
    <a class="brand footer-brand" href="${pathFor(base)}"><span class="brand-mark" aria-hidden="true">S</span><span class="brand-name">SpendSense</span><span class="brand-tag">TEAM HUB</span></a>
    <p>A closer look at the people and product behind SpendSense.</p>
    <a class="footer-top" href="#top">Back to top ${icon("arrow", 14)}</a>
  </div><div class="wrap footer-bottom"><span>Project Day team portfolio</span><span>Team details are ready for the developers' approved introductions.</span></div></footer>`;
}

function shell({ base, title, description, body, profileId = "" }) {
  const baseUrl = pathFor(base);
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#f3faf6"><meta name="description" content="${escapeHtml(description)}">
<meta property="og:type" content="website"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}">
<title>${escapeHtml(title)}</title><link rel="icon" type="image/svg+xml" href="${pathFor(base, "assets/favicon.svg")}"><link rel="stylesheet" href="${pathFor(base, "assets/site.css")}">
</head><body id="top" ${profileId ? `data-member-id="${escapeHtml(profileId)}"` : ""}>
${header(base, Boolean(profileId))}<main>${body}</main>${footer(base)}
<script>window.SITE_BASE = ${JSON.stringify(baseUrl)}; window.SITE_DATA = ${JSON.stringify({ members, features, productScreenshots })};</script>
<script type="module" src="${pathFor(base, "assets/app.js")}"></script></body></html>`;
}

function renderHome(base) {
  const teamRows = members.map((member, index) => {
    const number = String(index + 1).padStart(2, "0");
    return `<a class="member-row" href="${pathFor(base, `team/${member.slug}/`)}" aria-label="Open portfolio for ${escapeHtml(member.name)}">
      <span class="member-index">${number}</span>
      <span class="member-copy"><strong>${escapeHtml(member.name)}</strong><small>Developer introduction ready to add</small></span>
      <span class="member-status">PROFILE ${number}</span>
      <span class="member-arrow">${icon("arrow", 18)}</span>
    </a>`;
  }).join("");

  const tabs = productScreenshots.map((screen, index) => {
    const active = index === 0;
    return `<button class="product-tab ${active ? "is-active" : ""}" type="button" role="tab" id="tab-${escapeHtml(screen.id)}" aria-selected="${active}" aria-controls="product-screen" tabindex="${active ? "0" : "-1"}" data-product-tab="${escapeHtml(screen.id)}">${escapeHtml(screen.title)}</button>`;
  }).join("");

  const firstScreen = productScreenshots[0];
  const fullImage = pathFor(base, firstScreen.image);
  const body = `<section class="hero-section wrap">
    <div class="hero-copy">
      <p class="eyebrow hero-eyebrow"><span class="eyebrow-dot"></span>PROJECT DAY · TEAM HUB</p>
      <h1>Meet the people<br>behind <span>SpendSense.</span></h1>
      <p class="hero-lead">Five teammates. One shared product. Start with the people, then take a look through the app they built.</p>
      <div class="hero-actions"><a class="button button-primary" href="#team">Meet all five ${icon("arrow", 16)}</a><a class="button button-text" href="#product">Explore the app</a></div>
    </div>
    <a class="hero-count" href="#team" aria-label="Meet all five team members"><strong>05</strong><span>TEAM<br>PROFILES</span><i>Scroll to meet everyone ${icon("arrow", 15)}</i></a>
  </section>

  <section class="team-section section-pad" id="team"><div class="wrap">
    <div class="section-heading">
      <div><p class="eyebrow">01 · THE PEOPLE</p><h2>The team behind<br>the product.</h2></div>
      <p class="section-description">Open a portfolio to learn about each developer's work, skills, and experience. Approved names and introductions can be added to these profiles.</p>
    </div>
    <div class="team-directory" aria-label="SpendSense team profiles">${teamRows}</div>
    <p class="team-foot"><span class="status-dot"></span>Five profile pages are ready for the team's approved details.</p>
  </div></section>

  <section class="product-section section-pad" id="product"><div class="wrap">
    <div class="section-heading product-heading">
      <div><p class="eyebrow">02 · THE PRODUCT</p><h2>SpendSense at a glance.</h2></div>
      <p class="section-description">Choose a screen to explore the actual app. These mobile references come from the screenshots provided for this team hub.</p>
    </div>
    <div class="product-tabs" role="tablist" aria-label="SpendSense app screens">${tabs}</div>
    <div class="product-display" id="product-screen" role="tabpanel" aria-labelledby="tab-dashboard" aria-live="polite">
      <div class="product-copy">
        <p class="product-count" data-product-count>01 <span>/ 06 SCREENS</span></p>
        <h3 data-product-heading>${escapeHtml(firstScreen.heading)}</h3>
        <p data-product-description>${escapeHtml(firstScreen.description)}</p>
        <a class="button button-dark" href="${escapeHtml(site.applicationUrl)}" target="_blank" rel="noopener noreferrer">Visit SpendSense ${icon("external", 15)}</a>
        <p class="product-hint">Scroll inside the screenshot to see the full page.</p>
      </div>
      <figure class="product-frame">
        <div class="product-image-window" role="region" tabindex="0" aria-label="Scrollable SpendSense screenshot">
          <img data-product-image src="${fullImage}" alt="${escapeHtml(firstScreen.alt)}" loading="lazy">
          <p class="product-image-error" data-product-error hidden>The screenshot could not be loaded. Select another screen or try again later.</p>
        </div>
        <figcaption><span data-product-caption>SPENDSENSE APP · ${escapeHtml(firstScreen.title.toUpperCase())}</span><a data-product-full-image href="${fullImage}" target="_blank" rel="noopener noreferrer">Open full image ${icon("external", 13)}</a></figcaption>
      </figure>
    </div>
  </div></section>

  <section class="mascot-section section-pad"><div class="wrap mascot-wrap">
    <div class="mascot-copy">
      <p class="eyebrow">03 · A FAMILIAR FACE</p><h2>Say hello to<br><span>Spendy.</span></h2>
      <p>The SpendSense mascot joins the app as a friendly guide. Here Spendy wears the same overalls and sweatband shown in your mascot screen.</p>
      <a class="button button-primary" href="${escapeHtml(site.applicationUrl)}" target="_blank" rel="noopener noreferrer">Meet Spendy in the app ${icon("external", 15)}</a>
      <small class="mascot-credit">Official mascot artwork and clothing from SpendSense.</small>
    </div>
    <figure class="mascot-stage" role="img" aria-label="SpendSense mascot Spendy wearing overalls and a sweatband">
      <img class="mascot-layer mascot-body" src="${pathFor(base, "assets/mascot/mascot-neutral.svg")}" alt="" loading="lazy">
      <img class="mascot-layer mascot-overalls" src="${pathFor(base, "assets/mascot/overalls.svg")}" alt="" loading="lazy">
      <img class="mascot-layer mascot-sweatband" src="${pathFor(base, "assets/mascot/sweat-band.svg")}" alt="" loading="lazy">
      <span class="mascot-ground" aria-hidden="true"></span>
    </figure>
  </div></section>`;

  return shell({ base, title: site.title, description: site.description, body });
}

function profileLinks(member) {
  const definitions = [
    ["GitHub", member.links.github], ["LinkedIn", member.links.linkedin],
    ["Website", member.links.website], ["Email", member.links.email ? `mailto:${member.links.email}` : ""],
  ].filter(([, url]) => url);
  if (!definitions.length) return `<p class="soft-note">Verified professional links have not been provided.</p>`;
  return definitions.map(([label, url]) => `<a class="profile-link" href="${escapeHtml(url)}" ${url.startsWith("http") ? 'target="_blank" rel="noopener noreferrer"' : ""}>${escapeHtml(label)} ${icon("external", 14)}</a>`).join("");
}

function profileProjects(member) {
  if (!member.projects.length) return `<div class="profile-empty"><span class="empty-mark">${icon("wallet", 21)}</span><div><strong>Projects are ready to add.</strong><p>Add a short summary, the developer's role, tools, and a link or screenshot.</p></div></div>`;
  return `<div class="project-list">${member.projects.map((project) => `<article class="project-item"><div class="project-image-placeholder"><span>${icon("wallet", 23)}</span><small>PROJECT IMAGE</small></div><div class="project-item-copy"><span class="eyebrow">SELECTED WORK</span><h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.summary)}</p>${project.responsibility ? `<p class="responsibility"><strong>Role:</strong> ${escapeHtml(project.responsibility)}</p>` : ""}<div class="tag-row">${(project.technologies || []).map((tech) => `<span class="tag">${escapeHtml(tech)}</span>`).join("")}</div><div class="project-links">${project.repoUrl ? `<a href="${escapeHtml(project.repoUrl)}" target="_blank" rel="noopener noreferrer">Repository ${icon("external", 14)}</a>` : ""}${project.demoUrl ? `<a href="${escapeHtml(project.demoUrl)}" target="_blank" rel="noopener noreferrer">Live demo ${icon("external", 14)}</a>` : ""}</div></div></article>`).join("")}</div>`;
}

function profileContributions(member, base) {
  const contributions = features.flatMap((feature) => feature.contributions.filter((item) => item.memberId === member.id).map((item) => ({ feature, contribution: item })));
  if (!contributions.length) return `<div class="profile-empty"><span class="empty-mark">${icon("arrow", 20)}</span><div><strong>Verified contributions are ready to add.</strong><p>Feature ownership stays unassigned until the team confirms who worked on each part.</p><a href="${pathFor(base, "#product")}">Explore SpendSense screens ${icon("arrow", 14)}</a></div></div>`;
  return `<div class="contribution-list">${contributions.map(({ feature, contribution }) => `<article class="contribution-item"><span class="contribution-pin">${icon("arrow", 16)}</span><div><span class="eyebrow">SPENDSENSE</span><h3><a href="${pathFor(base, "#product")}">${escapeHtml(feature.title)} ${icon("arrow", 14)}</a></h3><p>${escapeHtml(contribution.detail || contribution.role)}</p></div></article>`).join("")}</div>`;
}

function cvBlock(member, base) {
  if (!member.cvPdf) return `<div class="profile-empty cv-empty"><span class="cv-symbol">PDF</span><div><strong>Public CV not added</strong><p>Only an approved, public-facing PDF should be linked from this profile.</p></div></div>`;
  const cv = pathFor(base, member.cvPdf);
  const filename = `${member.name.replace(/[^a-z0-9]+/gi, "_")}_CV.pdf`;
  return `<div class="cv-viewer"><div class="cv-actions"><a class="button button-primary" href="${cv}" download="${escapeHtml(filename)}">Download CV ${icon("arrow", 15)}</a><a class="button button-outline" href="${cv}" target="_blank" rel="noopener noreferrer">Open in a new tab ${icon("external", 14)}</a></div><object data="${cv}" type="application/pdf" aria-label="CV preview for ${escapeHtml(member.name)}"><p>PDF preview is not available. <a href="${cv}" target="_blank" rel="noopener noreferrer">Open the CV</a>.</p></object></div>`;
}

function renderProfile(member, base) {
  const number = member.id.slice(-2);
  const skillTags = member.skills.length ? member.skills.map((skill) => `<span class="tag">${escapeHtml(skill)}</span>`).join("") : `<span class="soft-note">Approved skills ready to add.</span>`;
  const body = `<section class="profile-hero section-pad"><div class="wrap">
    <a class="profile-back" href="${pathFor(base, "#team")}">${icon("arrow", 15)} Back to the team</a>
    <div class="profile-panel">
      <div class="profile-number" aria-hidden="true">${number}</div>
      <div class="profile-intro">
        <p class="eyebrow">SPENDSENSE TEAM · PORTFOLIO ${number}</p>
        <span class="content-badge">INTRODUCTION PENDING</span>
        <h1>${escapeHtml(member.name)}</h1>
        <p class="profile-headline">${escapeHtml(member.headline)}</p>
        <p class="profile-bio">${escapeHtml(member.bio)}</p>
        <nav class="profile-jump" aria-label="Portfolio sections"><a href="#work">Work</a><a href="#projects">Projects</a><a href="#details">Profile details</a></nav>
      </div>
    </div>
  </div></section>
  <section class="profile-section section-pad" id="work"><div class="wrap profile-section-grid">
    <div class="profile-section-title"><p class="eyebrow">01 · PROJECT WORK</p><h2>SpendSense contributions</h2></div>
    <div class="profile-section-content">${profileContributions(member, base)}</div>
  </div></section>
  <section class="profile-section section-pad" id="projects"><div class="wrap profile-section-grid">
    <div class="profile-section-title"><p class="eyebrow">02 · SELECTED WORK</p><h2>Projects & experiments</h2></div>
    <div class="profile-section-content">${profileProjects(member)}</div>
  </div></section>
  <section class="profile-details-section section-pad" id="details"><div class="wrap profile-detail-grid">
    <div class="profile-detail-block"><p class="eyebrow">03 · TOOLKIT</p><h2>Skills & technologies</h2><div class="tag-row">${skillTags}</div></div>
    <div class="profile-detail-block"><p class="eyebrow">04 · CONNECT</p><h2>Find their work</h2><div class="contact-links">${profileLinks(member)}</div></div>
    <div class="profile-detail-block"><p class="eyebrow">05 · DOCUMENTS</p><h2>Curriculum vitae</h2>${cvBlock(member, base)}</div>
  </div></section>`;
  return shell({ base, title: `${member.name} · SpendSense Team`, description: `${member.name}'s portfolio page for the SpendSense team hub.`, body, profileId: member.id });
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
  const body = `<section class="not-found wrap"><span class="not-found-number">404</span><p class="eyebrow">PAGE NOT FOUND</p><h1>This page isn't in the team hub.</h1><p>Head back to the team directory or explore the SpendSense app screens.</p><a class="button button-primary" href="${pathFor(base)}">Back to the team ${icon("arrow", 16)}</a></section>`;
  return shell({ base, title: `Page not found · ${site.name}`, description: "This SpendSense team hub page could not be found.", body });
}

export { members, features, productScreenshots, site };
