const base = window.SITE_BASE || "/";
const data = window.SITE_DATA || { members: [], features: [] };
const byId = (id) => document.getElementById(id);
const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[character]));

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  nav?.classList.toggle("is-open", open);
});
nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  nav.classList.remove("is-open");
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", "Open navigation");
}));

const featurePanel = byId("feature-panel");
const featureTabs = [...document.querySelectorAll("[data-feature-tab]")];
function featureMarkup(feature) {
  const idx = data.features.indexOf(feature);
  const technology = feature.technologies?.length
    ? feature.technologies.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")
    : `<span class="soft-note">No verified technologies added.</span>`;
  const linkedContributors = (feature.contributions || []).map((entry) => {
    const member = data.members.find((item) => item.id === entry.memberId);
    if (!member) return "";
    return `<a class="contributor-link" href="${base}team/${encodeURIComponent(member.slug)}/"><span class="mini-avatar">${escapeHtml(member.name.slice(-2))}</span><span><strong>${escapeHtml(member.name)}</strong><small>${escapeHtml(entry.role)}</small></span><span aria-hidden="true">→</span></a>`;
  }).join("");
  const contributors = linkedContributors || `<div class="pending-inline"><span class="pending-icon">?</span><span><strong>Contributor mapping pending</strong><small>Feature ownership has not been supplied yet.</small></span></div>`;
  return `<div class="feature-detail" data-active-feature="${escapeHtml(feature.id)}"><div class="feature-copy"><div class="eyebrow-row"><span class="eyebrow">${escapeHtml(feature.category)}</span><span class="status-pill"><i></i> Verification needed</span></div><p class="feature-count">${String(idx + 1).padStart(2, "0")} / 0${data.features.length}</p><h3>${escapeHtml(feature.title)}</h3><p class="feature-summary">${escapeHtml(feature.summary)}</p><p class="feature-explainer">${escapeHtml(feature.detail)}</p><div class="feature-meta"><div><span class="meta-label">TECHNOLOGY</span><div class="tag-row">${technology}</div></div><div><span class="meta-label">CONTRIBUTORS</span><div class="contributor-list">${contributors}</div></div></div></div><div class="feature-visual"><div class="screenshot-placeholder"><div class="screenshot-icon"><svg aria-hidden="true" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 9h18M16 14h2M6 6V4a1 1 0 0 1 1-1h11"/></svg></div><span class="meta-label">SCREENSHOT NOT PROVIDED</span><p>Add an approved image of this feature to <code>public/assets/screenshots</code>.</p><span class="placeholder-rule"></span><span class="placeholder-rule small"></span><span class="placeholder-rule"></span></div><span class="visual-index">SPENDSENSE / FEATURE ${String(idx + 1).padStart(2, "0")}</span></div></div>`;
}

function renderFeature(feature) {
  if (!featurePanel) return;
  featurePanel.innerHTML = featureMarkup(feature);
  const screenshot = feature.screenshots?.[0];
  const source = typeof screenshot === "string" ? screenshot : screenshot?.src;
  if (!source) return;
  const image = document.createElement("img");
  image.src = `${base}${source.replace(/^\/+/, "")}`;
  image.alt = typeof screenshot === "object" && screenshot.alt ? screenshot.alt : `SpendSense ${feature.title} screenshot`;
  image.loading = "lazy";
  image.addEventListener("error", () => {
    const fallback = document.createElement("div");
    fallback.className = "screenshot-placeholder";
    fallback.textContent = "Screenshot unavailable — add the approved image to public/assets/screenshots.";
    figure.replaceWith(fallback);
  }, { once: true });
  const figure = document.createElement("figure");
  figure.className = "feature-image";
  const caption = document.createElement("figcaption");
  caption.textContent = "Approved SpendSense screenshot";
  figure.append(image, caption);
  featurePanel.querySelector(".screenshot-placeholder")?.replaceWith(figure);
}

function renderProjectImages() {
  const member = data.members.find((entry) => entry.id === document.body.dataset.memberId);
  if (!member) return;
  member.projects?.forEach((project, index) => {
    const screenshot = project.screenshots?.[0];
    const source = typeof screenshot === "string" ? screenshot : screenshot?.src;
    const slot = document.querySelectorAll(".project-image-placeholder")[index];
    if (!source || !slot) return;
    const image = document.createElement("img");
    image.src = `${base}${source.replace(/^\/+/, "")}`;
    image.alt = typeof screenshot === "object" && screenshot.alt ? screenshot.alt : `${project.title} project screenshot`;
    image.loading = "lazy";
    image.addEventListener("error", () => {
      const missing = document.createElement("small");
      missing.className = "image-unavailable";
      missing.textContent = "PROJECT IMAGE UNAVAILABLE";
      image.replaceWith(missing);
    }, { once: true });
    slot.replaceChildren(image);
  });
}

if (data.features[0]) renderFeature(data.features[0]);
renderProjectImages();
document.querySelectorAll(".profile-portrait img").forEach((image) => image.addEventListener("error", () => {
  const member = data.members.find((entry) => entry.id === document.body.dataset.memberId);
  const fallback = document.createElement("span");
  fallback.className = "portrait-fallback";
  fallback.textContent = member?.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase() || "SS";
  image.replaceWith(fallback);
}, { once: true }));

featureTabs.forEach((tab) => tab.addEventListener("click", () => {
  const selected = data.features.find((feature) => feature.id === tab.dataset.featureTab);
  if (!selected || !featurePanel) return;
  featureTabs.forEach((item) => {
    const active = item === tab;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-selected", String(active));
    item.tabIndex = active ? 0 : -1;
  });
  renderFeature(selected);
}));
featureTabs.forEach((tab, index) => tab.addEventListener("keydown", (event) => {
  if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? featureTabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + featureTabs.length) % featureTabs.length;
  featureTabs[nextIndex]?.focus();
  featureTabs[nextIndex]?.click();
}));

const skillInput = byId("skill-search");
const skillResults = document.querySelector("[data-skill-results]");
const selectedSkills = new Set();
const chipButtons = [...document.querySelectorAll("[data-skill]")];
function evidenceText(member) {
  return [
    member.name, member.headline, ...(member.skills || []),
    ...(member.projects || []).flatMap((project) => [project.title, project.summary, ...(project.technologies || [])]),
  ].join(" ").toLocaleLowerCase();
}
function updateSkillResults() {
  if (!skillResults) return;
  const query = skillInput?.value.trim().toLocaleLowerCase() || "";
  const matched = data.members.filter((member) => {
    const skillSet = new Set((member.skills || []).map((skill) => skill.toLocaleLowerCase()));
    const containsAllSelected = [...selectedSkills].every((skill) => skillSet.has(skill.toLocaleLowerCase()));
    return containsAllSelected && (!query || evidenceText(member).includes(query));
  });
  if (!matched.length) {
    skillResults.innerHTML = `<div class="skill-empty"><span class="empty-mark">⌕</span><strong>No matching team members.</strong><p>Try another search or clear the selected skills.</p><button type="button" class="skill-reset" data-reset-skills>Reset filters</button></div>`;
    skillResults.querySelector("[data-reset-skills]")?.addEventListener("click", resetSkills);
    return;
  }
  skillResults.innerHTML = matched.map((member) => `<div class="skill-result-row"><div><span class="mini-avatar">${escapeHtml(member.name.slice(-2))}</span><span><strong>${escapeHtml(member.name)}</strong><small>${(member.skills || []).length ? escapeHtml(member.skills.join(" · ")) : "Skills pending approval"}</small></span></div><a href="${base}team/${encodeURIComponent(member.slug)}/">View portfolio →</a></div>`).join("");
}
function resetSkills() {
  selectedSkills.clear();
  if (skillInput) skillInput.value = "";
  chipButtons.forEach((button) => button.setAttribute("aria-pressed", "false"));
  updateSkillResults();
}
skillInput?.addEventListener("input", updateSkillResults);
chipButtons.forEach((button) => button.addEventListener("click", () => {
  const skill = button.dataset.skill;
  if (selectedSkills.has(skill)) selectedSkills.delete(skill); else selectedSkills.add(skill);
  button.setAttribute("aria-pressed", String(selectedSkills.has(skill)));
  updateSkillResults();
}));
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    if (!skillInput) return;
    event.preventDefault();
    skillInput.focus();
  }
  if (event.key === "Escape" && document.activeElement === skillInput) {
    skillInput.value = "";
    updateSkillResults();
    skillInput.blur();
  }
});

const mascotButton = document.querySelector("[data-mascot]");
const mascotMessage = document.querySelector("[data-mascot-message]");
const reminders = [
  "Small steps add up to steady progress.",
  "A plan is a tool, not a test.",
  "Understanding comes before optimizing.",
  "Make room for the things that matter to you.",
  "Good questions are part of good money habits.",
];
mascotButton?.addEventListener("click", () => {
  if (!mascotMessage) return;
  const next = reminders[Math.floor(Math.random() * reminders.length)];
  mascotMessage.textContent = next;
  mascotButton.setAttribute("aria-label", `Show another reminder. Current reminder: ${next}`);
});

const memberId = document.body.dataset.memberId;
const achievement = document.querySelector("[data-achievement]");
const dismissAchievement = document.querySelector("[data-dismiss-achievement]");
function recordProfileVisit() {
  if (!memberId) return;
  try {
    const storageKey = "spendsense-team-profile-visits-v1";
    const visits = new Set(JSON.parse(localStorage.getItem(storageKey) || "[]"));
    visits.add(memberId);
    localStorage.setItem(storageKey, JSON.stringify([...visits]));
    if (data.members.length === 5 && data.members.every((member) => visits.has(member.id)) && achievement) {
      achievement.hidden = false;
    }
  } catch {
    // Profile pages work normally when local storage is disabled.
  }
}
recordProfileVisit();
dismissAchievement?.addEventListener("click", () => { if (achievement) achievement.hidden = true; });

const revealNodes = document.querySelectorAll(".section-head, .intro-grid, .member-row, .milestone, .profile-section-grid");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealNodes.forEach((node) => { node.dataset.reveal = ""; observer.observe(node); });
}
