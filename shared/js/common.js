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

function initCatalogSidebar() {
  const sidebar = qs("#catalog-sidebar");
  const panel = qs("[data-catalog-panel]", sidebar);
  const col0 = qs('[data-catalog-col="0"]', sidebar);
  const col1 = qs('[data-catalog-col="1"]', sidebar);
  const col2 = qs('[data-catalog-col="2"]', sidebar);
  const triggers = qsa("[data-catalog-open]");
  if (!sidebar || !panel || !col0 || !col1 || !col2) return;

  let lastFocus = null;
  const hoverMode = () =>
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(max-width: 860px)").matches;
  const mobileNav = () => window.matchMedia("(max-width: 860px)").matches;

  function lockBody(locked) {
    document.body.classList.toggle("is-locked", locked);
  }

  function setDepth(depth) {
    panel.dataset.depth = String(depth);
    col1.hidden = depth < 1;
    col2.hidden = depth < 2;
    col0.classList.toggle("is-front", depth === 0);
    col1.classList.toggle("is-front", depth === 1);
    col2.classList.toggle("is-front", depth === 2);
  }

  function clearActive(col) {
    qsa(".catalog-sidebar__item.is-active", col).forEach((el) => el.classList.remove("is-active"));
  }

  function fillCol(col, branchId, title, backLabel) {
    const tpl = qs(`#catalog-branch-${branchId}`);
    if (!tpl) return false;
    col.innerHTML = "";
    if (title && mobileNav()) {
      const head = document.createElement("div");
      head.className = "catalog-sidebar__subhead";

      const back = document.createElement("button");
      back.className = "catalog-sidebar__back-link";
      back.type = "button";
      back.setAttribute("data-catalog-back", "");
      const backText = document.createElement("span");
      backText.textContent = backLabel || "вернуться к главному меню";
      back.innerHTML =
        '<img class="catalog-sidebar__chevron catalog-sidebar__chevron--back" src="../../shared/images/icons/chevron-right.svg" alt="" width="8" height="14" />';
      back.appendChild(backText);

      const titleEl = document.createElement("p");
      titleEl.className = "catalog-sidebar__section";
      titleEl.textContent = title;

      head.append(back, titleEl);
      col.appendChild(head);
    }
    col.appendChild(tpl.content.cloneNode(true));
    return true;
  }

  function openBranch(fromCol, item, nextColIndex) {
    const branchId = item.getAttribute("data-catalog-branch");
    if (!branchId) return;
    const title = item.querySelector("span")?.textContent?.trim() || item.textContent.trim();
    const nextCol = nextColIndex === 1 ? col1 : col2;
    clearActive(fromCol);
    item.classList.add("is-active");

    let backLabel = "вернуться к главному меню";
    if (nextColIndex === 2) {
      const parentTitle =
        qs(".catalog-sidebar__section", col1)?.textContent?.trim() ||
        qs('[data-catalog-col="0"] .catalog-sidebar__item.is-active span', sidebar)?.textContent?.trim() ||
        "меню";
      backLabel = `вернуться к ${parentTitle.toLowerCase()}`;
    }

    if (!fillCol(nextCol, branchId, hoverMode() ? null : title, backLabel)) return;
    setDepth(nextColIndex);
    if (nextColIndex === 1) {
      col2.innerHTML = "";
      col2.hidden = true;
      panel.dataset.depth = "1";
      col2.classList.remove("is-front");
      col1.classList.add("is-front");
      col0.classList.remove("is-front");
    }
  }

  function resetBranches() {
    clearActive(col0);
    clearActive(col1);
    col1.innerHTML = "";
    col2.innerHTML = "";
    setDepth(0);
  }

  function openSidebar() {
    lastFocus = document.activeElement;
    sidebar.hidden = false;
    triggers.forEach((btn) => btn.setAttribute("aria-expanded", "true"));
    lockBody(true);
    resetBranches();
    panel.focus();
  }

  function closeSidebar() {
    if (sidebar.hidden) return;
    sidebar.hidden = true;
    triggers.forEach((btn) => btn.setAttribute("aria-expanded", "false"));
    lockBody(false);
    resetBranches();
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  triggers.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      if (sidebar.hidden) openSidebar();
      else closeSidebar();
    });
  });

  qsa("[data-catalog-close]", sidebar).forEach((btn) => {
    btn.addEventListener("click", closeSidebar);
  });

  sidebar.addEventListener("mouseover", (event) => {
    if (!hoverMode()) return;
    const item = event.target.closest("[data-catalog-branch]");
    if (!item || !sidebar.contains(item)) return;
    const col = item.closest("[data-catalog-col]");
    if (!col) return;
    const colIndex = Number(col.getAttribute("data-catalog-col"));
    if (colIndex === 0) openBranch(col0, item, 1);
    if (colIndex === 1) openBranch(col1, item, 2);
  });

  sidebar.addEventListener("click", (event) => {
    const back = event.target.closest("[data-catalog-back]");
    if (back) {
      const depth = Number(panel.dataset.depth || 0);
      if (depth >= 2) {
        clearActive(col1);
        col2.innerHTML = "";
        setDepth(1);
      } else {
        resetBranches();
      }
      return;
    }

    if (hoverMode()) return;
    const item = event.target.closest("[data-catalog-branch]");
    if (!item || !sidebar.contains(item)) return;
    const col = item.closest("[data-catalog-col]");
    if (!col) return;
    const colIndex = Number(col.getAttribute("data-catalog-col"));
    if (colIndex === 0) openBranch(col0, item, 1);
    if (colIndex === 1) openBranch(col1, item, 2);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSidebar();
  });
}

function initMobileHeader() {
  const header = qs(".header");
  const searchInput = qs(".search__input");

  qsa("[data-search-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const open = header?.classList.toggle("is-search-open");
      if (open) searchInput?.focus();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    header?.classList.remove("is-search-open");
  });
}

function initContactsSheet() {
  const sheet = qs("#contacts-sheet");
  const panel = qs(".contacts-sheet__panel", sheet);
  const body = qs("[data-contacts-sheet-body]", sheet);
  const source = qs("[data-contacts-source]");
  const openBtns = qsa("[data-contacts-open]");
  let lastFocus = null;
  let filled = false;
  let closing = false;

  if (!sheet || !panel || !body) return;

  function fillBody() {
    if (filled || !source) return;
    body.replaceChildren(...[...source.children].map((node) => node.cloneNode(true)));
    filled = true;
  }

  function lockBody(locked) {
    document.body.classList.toggle("is-locked", locked);
  }

  function getFocusable(root) {
    return qsa(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      root
    ).filter((el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true");
  }

  function openContactsSheet() {
    fillBody();
    lastFocus = document.activeElement;
    closing = false;
    sheet.hidden = false;
    requestAnimationFrame(() => {
      sheet.classList.add("is-open");
    });
    openBtns.forEach((btn) => btn.setAttribute("aria-expanded", "true"));
    lockBody(true);
    panel.focus();
  }

  function closeContactsSheet() {
    if (sheet.hidden || closing) return;
    closing = true;
    sheet.classList.remove("is-open");
    openBtns.forEach((btn) => btn.setAttribute("aria-expanded", "false"));

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      sheet.hidden = true;
      closing = false;
      lockBody(false);
      if (lastFocus && typeof lastFocus.focus === "function") {
        lastFocus.focus();
      }
    };

    panel.addEventListener("transitionend", finish, { once: true });
    window.setTimeout(finish, 320);
  }

  openBtns.forEach((btn) => {
    btn.addEventListener("click", openContactsSheet);
  });

  qsa("[data-contacts-close]").forEach((btn) => {
    btn.addEventListener("click", closeContactsSheet);
  });

  sheet.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeContactsSheet();
      return;
    }
    if (event.key !== "Tab" || sheet.hidden) return;
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
}

function initFavorites() {
  const badges = qsa("[data-fav-badge]");
  const buttons = qsa(".product-card__fav");

  function syncButton(btn) {
    const active = btn.classList.contains("is-active");
    btn.setAttribute("aria-pressed", String(active));
    btn.setAttribute("aria-label", active ? "Убрать из избранного" : "В избранное");
  }

  function syncBadge() {
    const count = buttons.filter((btn) => btn.classList.contains("is-active")).length;
    badges.forEach((badge) => {
      badge.textContent = String(count);
      badge.hidden = count <= 0;
    });
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

function initCart() {
  const badges = qsa("[data-cart-badge]");
  let count = 0;

  function syncBadge() {
    badges.forEach((badge) => {
      badge.textContent = String(count);
      badge.hidden = count <= 0;
    });
  }

  qsa(".product-card__cart").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      count += 1;
      syncBadge();
    });
  });

  syncBadge();
}

initNavMenus();
initCatalogSidebar();
initMobileHeader();
initContactsSheet();
initFavorites();
initCart();
