const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");
const navLinks = [...document.querySelectorAll(".nav-link")];

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  primaryNav.classList.toggle("is-open", !isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    primaryNav.classList.remove("is-open");
  });
});

const sections = [...document.querySelectorAll("#home, #about, #services, #contact")];
const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visibleSections = entries.filter((entry) => entry.isIntersecting);
    if (!visibleSections.length) return;
    const currentSection = visibleSections.sort(
      (a, b) => b.intersectionRatio - a.intersectionRatio,
    )[0].target;
    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${currentSection.id}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  },
  { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.1, 0.25, 0.5] },
);
sections.forEach((section) => sectionObserver.observe(section));

const carousel = document.querySelector(".service-carousel");
const track = document.querySelector(".service-track");
const cards = [...document.querySelectorAll(".service-card")];
const dots = [...document.querySelectorAll(".carousel-dot")];
const previousButton = document.querySelector('[data-direction="prev"]');
const nextButton = document.querySelector('[data-direction="next"]');
const count = document.querySelector(".carousel-count strong");
let activeService = 0;
let touchStartX = 0;

function visibleCardCount() {
  if (window.matchMedia("(max-width: 700px)").matches) return 1;
  if (window.matchMedia("(max-width: 980px)").matches) return 2;
  return 3;
}

function updateCarousel(index) {
  const maxIndex = Math.max(0, cards.length - visibleCardCount());
  activeService = Math.min(Math.max(index, 0), maxIndex);
  track.style.transform = `translateX(-${cards[activeService].offsetLeft}px)`;
  dots.forEach((dot, dotIndex) => {
    dot.hidden = dotIndex > maxIndex;
    const active = dotIndex === activeService;
    dot.classList.toggle("is-active", active);
    if (active) dot.setAttribute("aria-current", "true");
    else dot.removeAttribute("aria-current");
  });
  count.textContent = String(activeService + 1).padStart(2, "0");
  previousButton.disabled = activeService === 0;
  nextButton.disabled = activeService === maxIndex;
}

previousButton.addEventListener("click", () => updateCarousel(activeService - 1));
nextButton.addEventListener("click", () => updateCarousel(activeService + 1));
dots.forEach((dot, index) => {
  dot.addEventListener("click", () => updateCarousel(index));
});
carousel.addEventListener(
  "touchstart",
  (event) => {
    touchStartX = event.changedTouches[0].screenX;
  },
  { passive: true },
);
carousel.addEventListener(
  "touchend",
  (event) => {
    const distance = event.changedTouches[0].screenX - touchStartX;
    if (Math.abs(distance) > 45) updateCarousel(activeService + (distance < 0 ? 1 : -1));
  },
  { passive: true },
);
window.addEventListener("resize", () => updateCarousel(activeService));
updateCarousel(0);

document.querySelector("#current-year").textContent = new Date().getFullYear();
