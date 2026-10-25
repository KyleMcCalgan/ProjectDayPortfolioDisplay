
const base = window.SITE_BASE || "/";
const data = window.SITE_DATA || { members: [], productScreenshots: [] };

const tabs = Array.from(document.querySelectorAll("[data-product-tab]"));
const productImage = document.querySelector("[data-product-image]");
const productHeading = document.querySelector("[data-product-heading]");
const productDescription = document.querySelector("[data-product-description]");
const productCount = document.querySelector("[data-product-count]");
const productCaption = document.querySelector("[data-product-caption]");
const fullImageLink = document.querySelector("[data-product-full-image]");
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

  const index = screens.indexOf(screen);
  productHeading.textContent = screen.heading;
  productDescription.textContent = screen.description;
  productCount.innerHTML = String(index + 1).padStart(2, "0") + ' <span>/ ' + String(screens.length).padStart(2, "0") + ' SCREENS</span>';
  productImage.alt = screen.alt;
  productImage.src = base + screen.image;
  productImage.hidden = false;
  if (productError) productError.hidden = true;
  if (productCaption) productCaption.textContent = "SPENDSENSE APP · " + screen.title.toUpperCase();
  if (fullImageLink) {
    fullImageLink.href = base + screen.image;
    fullImageLink.setAttribute("aria-label", "Open full " + screen.title + " screenshot in a new tab");
  }
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
