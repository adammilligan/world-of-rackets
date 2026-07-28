document.documentElement.classList.add("js");

function qs(selector, root = document) {
  return root.querySelector(selector);
}

function qsa(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}

function initNavMenus() {
  const items = qsa(".nav__item");

  function closeItem(item) {
    const trigger = qs(".nav__trigger", item);
    const panel = qs(".nav__panel", item);
    item.classList.remove("is-open");
    trigger?.setAttribute("aria-expanded", "false");
    panel?.setAttribute("aria-hidden", "true");
  }

  function openItem(item) {
    items.forEach((other) => {
      if (other !== item) closeItem(other);
    });
    const trigger = qs(".nav__trigger", item);
    const panel = qs(".nav__panel", item);
    item.classList.add("is-open");
    trigger?.setAttribute("aria-expanded", "true");
    panel?.setAttribute("aria-hidden", "false");
  }

  items.forEach((item) => {
    const trigger = qs(".nav__trigger", item);
    if (!trigger) return;

    trigger.addEventListener("click", () => {
      if (item.classList.contains("is-open")) {
        closeItem(item);
      } else {
        openItem(item);
      }
    });

    item.addEventListener("mouseenter", () => openItem(item));
    item.addEventListener("mouseleave", () => closeItem(item));
    item.addEventListener("focusin", () => openItem(item));

    item.addEventListener("focusout", (event) => {
      if (item.contains(event.relatedTarget)) return;
      closeItem(item);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    items.forEach(closeItem);
  });
}

function initCatalogMega() {
  const wrap = qs(".header__catalog-wrap");
  const trigger = qs(".header__catalog", wrap);
  const panel = qs("#mega-menu");
  if (!wrap || !trigger || !panel) return;

  function setOpen(open) {
    wrap.classList.toggle("is-open", open);
    trigger.setAttribute("aria-expanded", String(open));
    panel.setAttribute("aria-hidden", String(!open));
  }

  trigger.addEventListener("click", () => {
    setOpen(!wrap.classList.contains("is-open"));
  });

  wrap.addEventListener("mouseenter", () => setOpen(true));
  wrap.addEventListener("mouseleave", () => setOpen(false));
  wrap.addEventListener("focusin", () => setOpen(true));

  wrap.addEventListener("focusout", (event) => {
    if (wrap.contains(event.relatedTarget)) return;
    setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
}

function initMobileHeader() {
  const header = qs(".header");
  const drawer = qs("#mobile-drawer");
  const panel = qs(".drawer__panel", drawer);
  const burger = qs("[data-drawer-open]");
  const searchToggle = qs("[data-search-toggle]");
  const searchInput = qs(".search__input");
  let lastFocus = null;

  function lockBody(locked) {
    document.body.classList.toggle("is-locked", locked);
  }

  function getFocusable(root) {
    return qsa(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      root
    ).filter((el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true");
  }

  function openDrawer() {
    if (!drawer || !panel) return;
    lastFocus = document.activeElement;
    drawer.hidden = false;
    burger?.setAttribute("aria-expanded", "true");
    lockBody(true);
    if (!panel.hasAttribute("tabindex")) {
      panel.setAttribute("tabindex", "-1");
    }
    const focusable = getFocusable(panel);
    (focusable[0] || panel).focus();
  }

  function closeDrawer() {
    if (!drawer || drawer.hidden) return;
    drawer.hidden = true;
    burger?.setAttribute("aria-expanded", "false");
    lockBody(false);
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  qsa("[data-drawer-open]").forEach((btn) => {
    btn.addEventListener("click", openDrawer);
  });

  qsa("[data-drawer-close]").forEach((btn) => {
    btn.addEventListener("click", closeDrawer);
  });

  drawer?.addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || !panel || drawer.hidden) return;
    const focusable = getFocusable(panel);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
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

  function syncButton(btn) {
    const active = btn.classList.contains("is-active");
    btn.setAttribute("aria-pressed", String(active));
    btn.setAttribute("aria-label", active ? "Убрать из избранного" : "В избранное");
  }

  function syncBadge() {
    const count = buttons.filter((btn) => btn.classList.contains("is-active")).length;
    if (!badge) return;
    badge.textContent = String(count);
    badge.hidden = count <= 0;
  }

  buttons.forEach((btn) => {
    syncButton(btn);
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      btn.classList.toggle("is-active");
      syncButton(btn);
      syncBadge();
    });
  });

  syncBadge();
}

initNavMenus();
initCatalogMega();
initMobileHeader();
initFavorites();
