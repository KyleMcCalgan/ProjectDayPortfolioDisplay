
const base = window.SITE_BASE || "/";
const data = { members: [], productScreenshots: [], ...(window.SITE_DATA || {}) };

const tabs = Array.from(document.querySelectorAll("[data-product-tab]"));
const productImage = document.querySelector("[data-product-image]");
const productError = document.querySelector("[data-product-error]");

function selectProduct(tab) {
  const screens = data.productScreenshots || [];
  const screen = screens.find((item) => item.id === tab.dataset.productTab);
  if (!screen || !productImage) return;

  tabs.forEach((item, index) => {
    const active = item === tab;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-selected", String(active));
    item.tabIndex = active ? 0 : -1;
  });

  productImage.alt = screen.alt;
  productImage.src = base + screen.image;
  productImage.hidden = false;
  if (productError) productError.hidden = true;
  document.querySelector("#product-screen")?.setAttribute("aria-labelledby", tab.id);
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectProduct(tab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 :
      (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    tabs[next]?.focus();
    tabs[next]?.click();
  });
});

const profileTabs = Array.from(document.querySelectorAll("[data-profile-tab]"));
const profilePages = document.querySelector("[data-profile-pages]");
const profileSlides = Array.from(document.querySelectorAll("[data-profile-slide]"));
const profileDots = Array.from(document.querySelectorAll("[data-profile-dot]"));
const profileScrollCards = Array.from(document.querySelectorAll(".profile-section, .profile-slide-intro .profile-hero"));
let programmaticProfileIndex = null;
let profileScrollTimer;
let profileScrollFrameQueued = false;

profileScrollCards.forEach((card) => {
  let fadeTimer;
  card.addEventListener("scroll", () => {
    card.classList.add("is-scrolling");
    window.clearTimeout(fadeTimer);
    fadeTimer = window.setTimeout(() => card.classList.remove("is-scrolling"), 800);
  }, { passive: true });
});

function nearestProfileIndex() {
  if (!profilePages) return 0;
  return Math.max(0, Math.min(Math.round(profilePages.scrollLeft / profilePages.clientWidth), profileSlides.length - 1));
}

function finishProgrammaticProfileScroll() {
  if (programmaticProfileIndex === null) return;
  const index = programmaticProfileIndex;
  programmaticProfileIndex = null;
  clearTimeout(profileScrollTimer);
  selectProfileArea(index);
}

function updateProfileFromScroll() {
  if (programmaticProfileIndex !== null) return;
  selectProfileArea(nearestProfileIndex());
}

function selectProfileArea(index, shouldScroll = false) {
  if (!profileTabs.length || !profileSlides.length) return;
  const selectedIndex = Math.max(0, Math.min(index, profileTabs.length - 1));
  profileTabs.forEach((tab, tabIndex) => {
    const active = tabIndex === selectedIndex;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  profileSlides.forEach((slide, slideIndex) => {
    const active = slideIndex === selectedIndex;
    slide.setAttribute("aria-hidden", String(!active));
    slide.inert = !active;
  });
  profileDots.forEach((dot, dotIndex) => {
    const active = dotIndex === selectedIndex;
    dot.classList.toggle("is-active", active);
    if (active) dot.setAttribute("aria-current", "step");
    else dot.removeAttribute("aria-current");
  });

  if (!profilePages || !profileSlides[selectedIndex]) return;
  if (shouldScroll) {
    const offset = profileSlides[selectedIndex].offsetLeft - profileSlides[0].offsetLeft;
    if (Math.abs(offset - profilePages.scrollLeft) >= 1) {
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
      programmaticProfileIndex = selectedIndex;
      profilePages.scrollTo({ left: offset, behavior });
      return;
    }
  }
}

profileTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectProfileArea(index, true));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? profileTabs.length - 1 :
      (index + (event.key === "ArrowRight" ? 1 : -1) + profileTabs.length) % profileTabs.length;
    profileTabs[next]?.focus();
    selectProfileArea(next, true);
  });
});

profileDots.forEach((dot) => {
  dot.addEventListener("click", () => selectProfileArea(Number(dot.dataset.profileDot), true));
});

if (profilePages && profileSlides.length && profileTabs.length) {
  profilePages.addEventListener("scroll", () => {
    if (programmaticProfileIndex !== null) {
      clearTimeout(profileScrollTimer);
      profileScrollTimer = window.setTimeout(finishProgrammaticProfileScroll, 180);
      return;
    }
    if (profileScrollFrameQueued) return;
    profileScrollFrameQueued = true;
    window.requestAnimationFrame(() => {
      profileScrollFrameQueued = false;
      updateProfileFromScroll();
    });
  }, { passive: true });
  profilePages.addEventListener("scrollend", () => {
    if (programmaticProfileIndex !== null) finishProgrammaticProfileScroll();
    else updateProfileFromScroll();
  });

  selectProfileArea(0);

  window.addEventListener("resize", () => {
    const activeIndex = profileTabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true");
    selectProfileArea(activeIndex < 0 ? 0 : activeIndex, true);
  });
}

productImage?.addEventListener("error", () => {
  productImage.hidden = true;
  if (productError) productError.hidden = false;
}, { once: true });

function renderProjectImages() {
  const member = data.members.find((entry) => entry.id === document.body.dataset.memberId);
  if (!member) return;
  member.projects?.forEach((project, index) => {
    const screenshot = project.screenshots?.[0];
    const source = typeof screenshot === "string" ? screenshot : screenshot?.src;
    const slot = document.querySelectorAll(".project-image-placeholder")[index];
    if (!source || !slot) return;
    const image = document.createElement("img");
    image.src = base + source.replace(/^\/+/, "");
    image.alt = typeof screenshot === "object" && screenshot.alt ? screenshot.alt : project.title + " project screenshot";
    image.loading = "lazy";
    image.addEventListener("error", () => {
      const missing = document.createElement("small");
      missing.className = "image-unavailable";
      missing.textContent = "Project image unavailable.";
      image.replaceWith(missing);
    }, { once: true });
    slot.replaceChildren(image);
  });
}

renderProjectImages();
