
const base = window.SITE_BASE || "/";
const data = { members: [], productScreenshots: [], ...(window.SITE_DATA || {}) };

const tabs = Array.from(document.querySelectorAll("[data-product-tab]"));
const productImage = document.querySelector("[data-product-image]");
const productError = document.querySelector("[data-product-error]");
const productTitle = document.querySelector("[data-product-title]");
const productSummary = document.querySelector("[data-product-summary]");
const productHighlights = document.querySelector("[data-product-highlights]");

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
  if (productTitle) productTitle.textContent = screen.title;
  if (productSummary) productSummary.textContent = screen.summary || screen.alt;
  if (productHighlights) {
    productHighlights.replaceChildren(...(screen.highlights || []).map((highlight) => {
      const item = document.createElement("li");
      item.textContent = highlight;
      return item;
    }));
  }
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

const profileSwipeLayout = window.matchMedia("(max-width: 860px)");
let lastProfileIndex = 0;

// On small screens the page scrolls normally, so the swipe area is only as tall as the active section.
function fitProfileHeight(index) {
  if (!profilePages) return;
  profilePages.style.height = profileSwipeLayout.matches && profileSlides[index] ? `${profileSlides[index].offsetHeight}px` : "";
}

if (profilePages && "ResizeObserver" in window) {
  const profileObserver = new ResizeObserver(() => {
    const activeIndex = profileTabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true");
    fitProfileHeight(Math.max(activeIndex, 0));
  });
  profileSlides.forEach((slide) => profileObserver.observe(slide));
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
  fitProfileHeight(selectedIndex);
  if (selectedIndex !== lastProfileIndex) {
    lastProfileIndex = selectedIndex;
    if (profileSwipeLayout.matches && window.scrollY > profilePages.offsetTop) window.scrollTo({ top: 0, behavior: "auto" });
  }
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
    const screenshots = (project.screenshots || []).filter(Boolean);
    const slot = document.querySelectorAll(".project-image-placeholder")[index];
    if (!screenshots.length || !slot) return;
    slot.classList.toggle("has-multiple", screenshots.length > 1);
    slot.classList.toggle("is-side-by-side", screenshots.length > 1 && project.screenshotLayout === "side-by-side");
    slot.replaceChildren(...screenshots.map((screenshot) => {
      const source = typeof screenshot === "string" ? screenshot : screenshot.src;
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
      return image;
    }));
  });
}

renderProjectImages();

const journeyCarousel = document.querySelector("[data-journey-carousel]");
if (journeyCarousel) {
  const pages = journeyCarousel.querySelector("[data-journey-pages]");
  const slides = Array.from(journeyCarousel.querySelectorAll("[data-journey-slide]"));
  const tabs = Array.from(journeyCarousel.querySelectorAll("[data-journey-tab]"));
  const swipeLayout = window.matchMedia("(max-width: 860px)");
  let current = 0;

  // Inactive slides are only hidden from assistive tech while the carousel layout is active.
  function select(index, scroll = false) {
    current = Math.max(0, Math.min(index, slides.length - 1));
    tabs.forEach((tab, i) => {
      tab.classList.toggle("is-active", i === current);
      tab.setAttribute("aria-selected", String(i === current));
      tab.tabIndex = i === current ? 0 : -1;
    });
    slides.forEach((slide, i) => {
      const hidden = swipeLayout.matches && i !== current;
      slide.inert = hidden;
      slide.setAttribute("aria-hidden", String(hidden));
    });
    fitHeight();
    if (scroll && swipeLayout.matches) {
      const left = slides[current].offsetLeft - slides[0].offsetLeft;
      if (Math.abs(left - pages.scrollLeft) >= 1) {
        const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
        pages.scrollTo({ left, behavior });
      }
    }
  }

  // The page scrolls normally, so the swipe area is only as tall as the demo being shown.
  function fitHeight() {
    pages.style.height = swipeLayout.matches ? `${slides[current].offsetHeight}px` : "";
  }
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(() => fitHeight());
    slides.forEach((slide) => observer.observe(slide));
  }

  let frame = 0;
  pages.addEventListener("scroll", () => {
    if (!swipeLayout.matches || frame) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      const index = Math.round(pages.scrollLeft / pages.clientWidth);
      if (index !== current) {
        select(index);
        if (window.scrollY > journeyCarousel.offsetTop) window.scrollTo({ top: 0, behavior: "auto" });
      }
    });
  }, { passive: true });

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      select(index, true);
      if (swipeLayout.matches && window.scrollY > journeyCarousel.offsetTop) window.scrollTo({ top: 0, behavior: "auto" });
    });
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 :
        (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
      tabs[next].focus();
      select(next, true);
    });
  });
  swipeLayout.addEventListener("change", () => select(current, true));
  window.addEventListener("resize", () => select(current, true));
  select(0);
}
