const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");

function closeMenu() {
  if (!menuToggle || !mobileNav) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Mở menu");
  mobileNav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", function () {
    const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    menuToggle.setAttribute("aria-label", willOpen ? "Đóng menu" : "Mở menu");
    mobileNav.classList.toggle("is-open", willOpen);
    document.body.classList.toggle("menu-open", willOpen);
  });

  mobileNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMenu();
  });
}

function updateHeader() {
  if (header) header.classList.toggle("is-scrolled", window.scrollY > 20);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const revealItems = document.querySelectorAll(".reveal");

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach(function (item) {
    item.classList.add("is-visible");
  });
} else {
  const revealObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.08,
    rootMargin: "0px 0px -50px"
  });

  revealItems.forEach(function (item) {
    revealObserver.observe(item);
  });
}

const filters = document.querySelectorAll(".filter");
const caseCards = document.querySelectorAll(".case-card");

filters.forEach(function (filterButton) {
  filterButton.addEventListener("click", function () {
    const filter = filterButton.dataset.filter;

    filters.forEach(function (button) {
      const active = button === filterButton;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    caseCards.forEach(function (card) {
      const categories = card.dataset.categories.split(" ");
      const visible = filter === "all" || categories.includes(filter);
      card.classList.toggle("is-hidden", !visible);

      if (!visible) {
        const detail = card.querySelector("details");
        if (detail) detail.open = false;
      }
    });
  });
});

if (filters.length) {
  filters.forEach(function (button, index) {
    button.setAttribute("aria-pressed", String(index === 0));
  });
}

document.querySelectorAll(".case-detail").forEach(function (detail) {
  detail.addEventListener("toggle", function () {
    if (!detail.open) return;

    const card = detail.closest(".case-card");
    if (!card) return;

    document.querySelectorAll(".case-detail[open]").forEach(function (openDetail) {
      if (openDetail !== detail && openDetail.closest(".case-card") === card) {
        openDetail.open = false;
      }
    });
  });
});

const observedSections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".desktop-nav a");

if ("IntersectionObserver" in window && observedSections.length) {
  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;

      navLinks.forEach(function (link) {
        link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
      });
    });
  }, {
    rootMargin: "-35% 0px -58%",
    threshold: 0
  });

  observedSections.forEach(function (section) {
    sectionObserver.observe(section);
  });
}
