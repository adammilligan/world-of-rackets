document.documentElement.classList.add("js");

function qs(selector, root = document) {
  return root.querySelector(selector);
}

function qsa(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}

function initNavMenus() {
  const nav = qs(".nav");
  const items = qsa(".nav__item");
  let closeTimer = null;

  const hoverMode = () =>
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(max-width: 860px)").matches;

  function cancelClose() {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
  }

  function scheduleClose() {
    cancelClose();
    closeTimer = window.setTimeout(() => {
      items.forEach(closeItem);
      closeTimer = null;
    }, 140);
  }

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
    const panel = qs(".nav__panel", item);
    if (!trigger) return;

    trigger.addEventListener("click", (event) => {
      // Desktop: hover opens menu; click on section link navigates.
      if (hoverMode() && trigger.tagName === "A" && trigger.getAttribute("href")) {
        return;
      }
      // Mobile / no-href: toggle panel; prevent navigation if submenu needed... 
      // Top-level links still navigate to section catalog as requested.
      if (trigger.tagName === "A" && trigger.getAttribute("href") && !hoverMode()) {
        return;
      }
      event.preventDefault();
      if (item.classList.contains("is-open")) {
        closeItem(item);
      } else {
        openItem(item);
      }
    });

    if (hoverMode()) {
      const handleEnter = () => {
        cancelClose();
        openItem(item);
      };

      trigger.addEventListener("mouseenter", handleEnter);
      panel?.addEventListener("mouseenter", handleEnter);
      trigger.addEventListener("mouseleave", scheduleClose);
      panel?.addEventListener("mouseleave", scheduleClose);
    }

    item.addEventListener("focusin", () => openItem(item));

    item.addEventListener("focusout", (event) => {
      if (item.contains(event.relatedTarget)) return;
      closeItem(item);
    });
  });

  nav?.addEventListener("mouseleave", () => {
    if (hoverMode()) scheduleClose();
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
  const handle = qs(".contacts-sheet__handle", sheet);
  const head = qs(".contacts-sheet__head", sheet);
  const title = qs(".contacts-sheet__title", sheet);
  const body = qs("[data-contacts-sheet-body]", sheet);
  const source = qs("[data-contacts-source]");
  const openBtns = qsa("[data-contacts-open]");
  let lastFocus = null;
  let filled = false;
  let closing = false;
  let dragging = false;
  let dragMode = null;
  let dragStartY = 0;

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

  function resetPanelDrag() {
    dragging = false;
    dragMode = null;
    panel.style.transition = "";
    panel.style.transform = "";
  }

  function finishClose() {
    sheet.hidden = true;
    closing = false;
    resetPanelDrag();
    lockBody(false);
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  function openContactsSheet() {
    fillBody();
    lastFocus = document.activeElement;
    closing = false;
    resetPanelDrag();
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
    resetPanelDrag();
    sheet.classList.remove("is-open");
    openBtns.forEach((btn) => btn.setAttribute("aria-expanded", "false"));

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      finishClose();
    };

    panel.addEventListener("transitionend", finish, { once: true });
    window.setTimeout(finish, 320);
  }

  function closeContactsSheetFromDrag() {
    if (sheet.hidden || closing) return;
    closing = true;
    dragging = false;
    dragMode = null;
    openBtns.forEach((btn) => btn.setAttribute("aria-expanded", "false"));
    sheet.classList.remove("is-open");
    panel.style.transition = "transform 0.22s ease";
    panel.style.transform = "translateY(100%)";

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      finishClose();
    };

    panel.addEventListener("transitionend", finish, { once: true });
    window.setTimeout(finish, 320);
  }

  function initContactsSheetSwipe() {
    const dismissThreshold = 80;

    panel.addEventListener(
      "touchstart",
      (event) => {
        if (event.touches.length !== 1 || closing || sheet.hidden) return;
        dragStartY = event.touches[0].clientY;
        dragMode = null;
        dragging = false;
      },
      { passive: true }
    );

    panel.addEventListener(
      "touchmove",
      (event) => {
        if (event.touches.length !== 1 || closing || sheet.hidden) return;
        const currentY = event.touches[0].clientY;
        const deltaY = currentY - dragStartY;

        if (!dragMode) {
          if (Math.abs(deltaY) < 8) return;
          const fromHandle = handle && handle.contains(event.target);
          const fromHead = head && head.contains(event.target);
          if ((fromHandle || fromHead) && deltaY > 0) {
            dragMode = "dismiss";
          } else if (body.scrollTop <= 0 && deltaY > 0) {
            dragMode = "dismiss";
          } else {
            dragMode = "scroll";
            return;
          }
        }

        if (dragMode !== "dismiss" || deltaY <= 0) return;

        event.preventDefault();
        dragging = true;
        panel.style.transition = "none";
        panel.style.transform = `translateY(${deltaY}px)`;
      },
      { passive: false }
    );

    function onTouchEnd(event) {
      if (dragMode !== "dismiss") {
        dragMode = null;
        dragging = false;
        return;
      }

      const endY = event.changedTouches[0]?.clientY ?? dragStartY;
      const deltaY = endY - dragStartY;
      dragMode = null;

      if (!dragging || deltaY <= 0) {
        resetPanelDrag();
        return;
      }

      if (deltaY >= dismissThreshold) {
        closeContactsSheetFromDrag();
        return;
      }

      panel.style.transition = "transform 0.2s ease";
      panel.style.transform = "translateY(0)";
      panel.addEventListener(
        "transitionend",
        () => {
          if (!closing) resetPanelDrag();
        },
        { once: true }
      );
    }

    panel.addEventListener("touchend", onTouchEnd, { passive: true });
    panel.addEventListener("touchcancel", onTouchEnd, { passive: true });
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

  initContactsSheetSwipe();
}

const FAV_COUNT_KEY = "wor-fav-count";

function readFavCount() {
  try {
    const raw = localStorage.getItem(FAV_COUNT_KEY);
    if (raw === null) return null;
    return Math.max(0, Number(raw) || 0);
  } catch {
    return null;
  }
}

function writeFavCount(count) {
  const value = Math.max(0, count);
  try {
    localStorage.setItem(FAV_COUNT_KEY, String(value));
  } catch {
    /* ignore quota / private mode */
  }
  syncFavBadges(value);
  return value;
}

function syncFavBadges(count = readFavCount() ?? 0) {
  qsa("[data-fav-badge]").forEach((badge) => {
    badge.textContent = String(count);
    badge.hidden = count <= 0;
  });
}

window.worFavorites = {
  getCount() {
    return readFavCount() ?? 0;
  },
  setCount(count) {
    return writeFavCount(count);
  },
  increment(by = 1) {
    return writeFavCount((readFavCount() ?? 0) + by);
  },
  decrement(by = 1) {
    return writeFavCount((readFavCount() ?? 0) - by);
  },
  syncBadges: syncFavBadges,
};

function initFavorites() {
  syncFavBadges();

  qsa(".product-card__fav").forEach((btn) => {
    function syncButton() {
      const active = btn.classList.contains("is-active");
      btn.setAttribute("aria-pressed", String(active));
      btn.setAttribute("aria-label", active ? "Убрать из избранного" : "В избранное");
    }

    syncButton();
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const wasActive = btn.classList.contains("is-active");
      btn.classList.toggle("is-active");
      syncButton();

      if (wasActive) {
        window.worFavorites.decrement(1);
      } else {
        window.worFavorites.increment(1);
      }

      const favoritesPage = btn.closest(".favorites-page");
      if (favoritesPage && wasActive && btn.closest(".favorites-page__grid")) {
        btn.closest(".product-card")?.remove();
        favoritesPage.dispatchEvent(new CustomEvent("favorites-page:update"));
      }
    });
  });
}

const CART_COUNT_KEY = "wor-cart-count";

function readCartCount() {
  try {
    const raw = localStorage.getItem(CART_COUNT_KEY);
    if (raw === null) return null;
    return Math.max(0, Number(raw) || 0);
  } catch {
    return null;
  }
}

function writeCartCount(count) {
  const value = Math.max(0, count);
  try {
    localStorage.setItem(CART_COUNT_KEY, String(value));
  } catch {
    /* ignore quota / private mode */
  }
  syncCartBadges(value);
  return value;
}

function syncCartBadges(count = readCartCount() ?? 0) {
  qsa("[data-cart-badge]").forEach((badge) => {
    badge.textContent = String(count);
    badge.hidden = count <= 0;
  });
}

function incrementCartCount(by = 1) {
  const current = readCartCount() ?? 0;
  return writeCartCount(current + by);
}

window.worCart = {
  getCount() {
    return readCartCount() ?? 0;
  },
  setCount(count) {
    return writeCartCount(count);
  },
  increment(by = 1) {
    return incrementCartCount(by);
  },
  syncBadges: syncCartBadges,
};

function initCart() {
  syncCartBadges();

  qsa(".product-card__cart, .product-buy__cart").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      incrementCartCount(1);
    });
  });
}

initNavMenus();
initCatalogSidebar();
initMobileHeader();
initContactsSheet();
initFavorites();
initCart();
