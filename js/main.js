document.documentElement.classList.add("js");

function qs(selector, root = document) {
  return root.querySelector(selector);
}

function qsa(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}

function initHeroSlider(root) {
  const slides = qsa(".hero__slide", root);
  if (slides.length < 2) return;

  const prevBtn = qs(".hero__arrow--prev", root);
  const nextBtn = qs(".hero__arrow--next", root);
  const dots = qsa(".hero__dot", root);
  let index = slides.findIndex((slide) => slide.classList.contains("is-active"));
  if (index < 0) index = 0;

  function goTo(nextIndex) {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
    });
  }

  prevBtn?.addEventListener("click", () => goTo(index - 1));
  nextBtn?.addEventListener("click", () => goTo(index + 1));
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => goTo(i));
  });
}

function initMobileHeader() {
  const header = qs(".header");
  const drawer = qs("#mobile-drawer");
  const searchToggle = qs("[data-search-toggle]");
  const searchInput = qs(".search__input");

  function lockBody(locked) {
    document.body.classList.toggle("is-locked", locked);
  }

  function openDrawer() {
    if (!drawer) return;
    drawer.hidden = false;
    lockBody(true);
  }

  function closeDrawer() {
    if (!drawer || drawer.hidden) return;
    drawer.hidden = true;
    lockBody(false);
  }

  qsa("[data-drawer-open]").forEach((btn) => {
    btn.addEventListener("click", openDrawer);
  });

  qsa("[data-drawer-close]").forEach((btn) => {
    btn.addEventListener("click", closeDrawer);
  });

  searchToggle?.addEventListener("click", () => {
    const open = header?.classList.toggle("is-search-open");
    if (open) {
      searchInput?.focus();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeDrawer();
    header?.classList.remove("is-search-open");
  });
}

function initFavorites() {
  const badge = qs(".icon-btn__badge--fav");
  const buttons = qsa(".product-card__fav");

  function syncBadge() {
    const count = buttons.filter((btn) => btn.classList.contains("is-active")).length;
    if (!badge) return;
    badge.textContent = String(count);
    badge.hidden = count <= 0;
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const active = btn.classList.toggle("is-active");
      btn.setAttribute("aria-pressed", String(active));
      btn.setAttribute("aria-label", active ? "Убрать из избранного" : "В избранное");
      syncBadge();
    });
  });

  syncBadge();
}

qsa(".hero__slider").forEach(initHeroSlider);
initMobileHeader();
initFavorites();
