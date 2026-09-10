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

const CATALOG_BRANCH_SECTION_ALIASES = {
  clothes: "apparel",
  "other-squash": "squash",
  "other-beach": "beach-tennis",
  "other-pickle": "pickleball",
  brands: "tennis-adult",
};

const CATALOG_BRAND_SLUGS = {
  "7/6": "7-6",
  "Pro Kennex": "prokennex",
  "Tour Spin": "tourspin",
  "Robin Soderling": "robinsoderling",
  "String Projekt": "stringprojekt",
  "Neva Sport": "nevasport",
  "Li-Ning": "li-ning",
};

const CATALOG_SIDEBAR_LABEL_SECTIONS = {
  tennis: { "Натяжка струн": "tennis-stringing" },
  padel: {
    Мячи: "padel-balls",
    "Сумки и чехлы": "padel-bags",
    "Обувь для падел": "padel-shoes",
    Аксессуары: "padel-acc",
  },
  table: {
    Ракетки: "table-rackets",
    Накладки: "table-rubbers",
    Мячи: "table-balls",
    Столы: "table-tables",
    Аксессуары: "table-acc",
  },
  badminton: {
    Ракетки: "badminton-rackets",
    Воланы: "badminton-shuttle",
    Струны: "badminton-strings",
    Сумки: "badminton-bags",
    Обувь: "badminton-shoes",
  },
  shoes: {
    "Мужская обувь": "shoes-men",
    "Женская обувь": "shoes-women",
    "Детская обувь": "shoes-kids",
    "Все кроссовки": "shoes",
  },
  clothes: {
    "Мужская одежда": "apparel-men",
    "Женская одежда": "apparel-women",
    "Детская одежда": "apparel-kids",
    "Вся одежда": "apparel",
  },
  "other-squash": {
    Ракетки: "squash-rackets",
    Мячи: "squash-balls",
    Сумки: "squash",
  },
  "other-beach": {
    Ракетки: "beach-rackets",
    Мячи: "beach-balls",
    Сумки: "beach-bags",
  },
  "other-pickle": {
    Ракетки: "pickle-rackets",
    Мячи: "pickle-balls",
    Аксессуары: "pickle-acc",
  },
};

const CATALOG_SIDEBAR_BRAND_BRANCHES = new Set([
  "tennis-adult",
  "tennis-kids",
  "tennis-strings",
  "tennis-balls",
  "tennis-bags",
  "padel-rackets",
  "brands",
]);

function getCatalogBasePath() {
  if (/\/pages\/catalog\//.test(window.location.pathname)) return "./";
  return "../catalog/";
}

function resolveCatalogHref(href) {
  if (!href) return "";
  if (href.startsWith("../catalog/")) return getCatalogBasePath() + href.slice("../catalog/".length);
  if (href.startsWith("./")) return getCatalogBasePath() + href.slice(2);
  return href;
}

function catalogBranchSectionId(branchId) {
  return CATALOG_BRANCH_SECTION_ALIASES[branchId] || branchId;
}

function catalogBrandSlug(label) {
  if (CATALOG_BRAND_SLUGS[label]) return CATALOG_BRAND_SLUGS[label];
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function buildCatalogSidebarUrl(section, brand) {
  const params = new URLSearchParams();
  if (section) params.set("section", section);
  if (brand) params.set("brand", brand);
  return `${getCatalogBasePath()}?${params}`;
}

function buildCatalogNavLinkIndex() {
  const index = new Map();

  qsa(".nav__mega-col").forEach((col) => {
    let currentSection = null;
    qsa("a[href*='catalog/?section=']", col).forEach((link) => {
      const href = resolveCatalogHref(link.getAttribute("href"));
      const label = link.textContent.trim();
      if (!label) return;

      const url = new URL(href, window.location.href);
      const section = url.searchParams.get("section");
      const brand = url.searchParams.get("brand");

      if (link.closest(".nav__mega-title")) {
        currentSection = section;
        index.set(`${section}::${label}`, href);
        return;
      }

      if (link.closest(".nav__mega-list") && currentSection) {
        index.set(`${currentSection}::${label}`, href);
        return;
      }

      if (section) index.set(`${section}::${label}`, href);
      if (brand) index.set(`${section}::${label}`, href);
    });
  });

  qsa(".nav__trigger[href*='catalog/?section=']").forEach((link) => {
    const href = resolveCatalogHref(link.getAttribute("href"));
    const label = link.childNodes[0]?.textContent?.trim() || link.textContent.trim();
    const section = new URL(href, window.location.href).searchParams.get("section");
    if (label && section) index.set(`${section}::${label}`, href);
  });

  return index;
}

function resolveCatalogSidebarItemUrl(branchId, label, linkIndex) {
  const section = catalogBranchSectionId(branchId);
  const fromNav = linkIndex.get(`${section}::${label}`);
  if (fromNav) return fromNav;

  const mapped = CATALOG_SIDEBAR_LABEL_SECTIONS[branchId]?.[label];
  if (mapped) return buildCatalogSidebarUrl(mapped);

  if (CATALOG_SIDEBAR_BRAND_BRANCHES.has(branchId)) {
    const brandSection = branchId === "brands" ? "tennis-adult" : section;
    return buildCatalogSidebarUrl(brandSection, catalogBrandSlug(label));
  }

  if (branchId.endsWith("-acc") || branchId === "tennis-acc") {
    return buildCatalogSidebarUrl(section);
  }

  return buildCatalogSidebarUrl(section);
}

function getBranchCatalogUrl(branchId) {
  return buildCatalogSidebarUrl(catalogBranchSectionId(branchId));
}

function enhanceCatalogColLinks(col, branchId, linkIndex) {
  qsa("a.catalog-sidebar__item", col).forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href !== "#") return;
    const label = link.textContent.trim();
    link.href = resolveCatalogSidebarItemUrl(branchId, label, linkIndex);
  });

  qsa("[data-catalog-branch]", col).forEach((item) => {
    const id = item.getAttribute("data-catalog-branch");
    if (id) item.dataset.catalogHref = getBranchCatalogUrl(id);
  });
}

function getSidebarAssetPath(relativePath) {
  const sample =
    qs("#catalog-sidebar .catalog-sidebar__chevron")?.getAttribute("src") ||
    qs(".header .logo__img")?.getAttribute("src");
  if (!sample) return `../../shared/${relativePath}`;
  return sample.replace(/(?:images\/(?:brand|icons)\/)?[^/]+$/, relativePath);
}

function initCatalogSidebar() {
  const sidebar = qs("#catalog-sidebar");
  const panel = qs("[data-catalog-panel]", sidebar);
  const col0 = qs('[data-catalog-col="0"]', sidebar);
  const col1 = qs('[data-catalog-col="1"]', sidebar);
  const col2 = qs('[data-catalog-col="2"]', sidebar);
  const triggers = qsa("[data-catalog-open]");
  if (!sidebar || !panel || !col0 || !col1 || !col2) return;

  const catalogLinkIndex = buildCatalogNavLinkIndex();
  let lastFocus = null;
  const hoverMode = () =>
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(max-width: 860px)").matches;
  const mobileNav = () => window.matchMedia("(max-width: 860px)").matches;

  qsa("[data-catalog-branch]", sidebar).forEach((item) => {
    const branchId = item.getAttribute("data-catalog-branch");
    if (branchId) item.dataset.catalogHref = getBranchCatalogUrl(branchId);
  });

  qsa("template[id^='catalog-branch-']", sidebar).forEach((tpl) => {
    const branchId = tpl.id.replace("catalog-branch-", "");
    enhanceCatalogColLinks(tpl.content, branchId, catalogLinkIndex);
  });

  const sidebarHead = qs(".catalog-sidebar__head", sidebar);
  let sidebarLogo = qs("[data-catalog-logo]", sidebar);
  let sidebarHeadBack = qs(".catalog-sidebar__back-link--head", sidebar);
  let sidebarHeadBackText = qs("[data-catalog-back-text]", sidebar);

  if (sidebarHead && !qs("[data-catalog-head-start]", sidebarHead)) {
    const headStart = document.createElement("div");
    headStart.className = "catalog-sidebar__head-start";
    headStart.setAttribute("data-catalog-head-start", "");

    const title = qs(".catalog-sidebar__title", sidebarHead);
    const logoSrc = qs(".header .logo__img")?.getAttribute("src") || getSidebarAssetPath("images/brand/logo.png");
    const chevronSrc =
      qs("#catalog-sidebar .catalog-sidebar__chevron")?.getAttribute("src") ||
      getSidebarAssetPath("images/icons/chevron-right.svg");

    sidebarLogo = document.createElement("a");
    sidebarLogo.className = "catalog-sidebar__logo logo";
    sidebarLogo.href = getSitePageHref("home");
    sidebarLogo.setAttribute("aria-label", "Мир ракеток — на главную");
    sidebarLogo.dataset.catalogLogo = "";
    sidebarLogo.innerHTML = `<img class="logo__img" src="${logoSrc}" alt="" width="112" height="23" />`;

    sidebarHeadBack = document.createElement("button");
    sidebarHeadBack.className = "catalog-sidebar__back-link catalog-sidebar__back-link--head";
    sidebarHeadBack.type = "button";
    sidebarHeadBack.setAttribute("data-catalog-back", "");
    sidebarHeadBack.hidden = true;
    sidebarHeadBack.innerHTML = `<img class="catalog-sidebar__chevron catalog-sidebar__chevron--back" src="${chevronSrc}" alt="" width="8" height="14" /><span data-catalog-back-text>вернуться к главному меню</span>`;
    sidebarHeadBackText = qs("[data-catalog-back-text]", sidebarHeadBack);

    if (title) headStart.appendChild(title);
    headStart.append(sidebarLogo, sidebarHeadBack);

    const closeBtn = qs(".catalog-sidebar__close", sidebarHead);
    sidebarHead.insertBefore(headStart, closeBtn);
  }

  function setMobileCatalogHead(mode, backLabel) {
    if (!mobileNav()) return;
    if (sidebarLogo) sidebarLogo.hidden = mode !== "root";
    if (sidebarHeadBack) sidebarHeadBack.hidden = mode !== "drilled";
    if (sidebarHeadBackText && backLabel) sidebarHeadBackText.textContent = backLabel;
  }

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

      const titleEl = document.createElement("a");
      titleEl.className = "catalog-sidebar__section";
      titleEl.href = getBranchCatalogUrl(branchId);
      titleEl.textContent = title;

      head.appendChild(titleEl);
      col.appendChild(head);
      setMobileCatalogHead("drilled", backLabel);
    }
    col.appendChild(tpl.content.cloneNode(true));
    enhanceCatalogColLinks(col, branchId, catalogLinkIndex);
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

    if (!fillCol(nextCol, branchId, mobileNav() ? title : null, backLabel)) return;

    if (nextColIndex === 1) {
      col2.innerHTML = "";
    }

    setDepth(nextColIndex);
  }

  function resetBranches() {
    clearActive(col0);
    clearActive(col1);
    col1.innerHTML = "";
    col2.innerHTML = "";
    setDepth(0);
    setMobileCatalogHead("root");
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
    if (event.target.closest(".catalog-sidebar__section")) return;
    if (event.target.closest("a.catalog-sidebar__item")) return;

    const back = event.target.closest("[data-catalog-back]");
    if (back) {
      event.preventDefault();
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

    const branchItem = event.target.closest("[data-catalog-branch]");
    if (!branchItem || !sidebar.contains(branchItem)) return;

    if (mobileNav()) {
      event.preventDefault();
      const col = branchItem.closest("[data-catalog-col]");
      if (!col) return;
      const colIndex = Number(col.getAttribute("data-catalog-col"));
      if (colIndex === 0) openBranch(col0, branchItem, 1);
      if (colIndex === 1) openBranch(col1, branchItem, 2);
      return;
    }

    event.preventDefault();
    const href = branchItem.dataset.catalogHref || getBranchCatalogUrl(branchItem.getAttribute("data-catalog-branch"));
    if (href) window.location.href = href;
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSidebar();
  });
}

let mobileSearchScrollY = 0;
let mobileSearchOverlay = null;
let mobileSearchTouchLock = null;
const mobileSearchScreenMq = window.matchMedia("(max-width: 860px)");

function ensureMobileSearchOverlay() {
  if (mobileSearchOverlay) return mobileSearchOverlay;
  mobileSearchOverlay = document.createElement("div");
  mobileSearchOverlay.className = "mobile-search-screen";
  mobileSearchOverlay.hidden = true;
  mobileSearchOverlay.setAttribute("aria-hidden", "true");
  document.body.appendChild(mobileSearchOverlay);
  return mobileSearchOverlay;
}

function setMobileSearchTouchLock(active) {
  if (active && !mobileSearchTouchLock) {
    mobileSearchTouchLock = (event) => {
      if (!document.body.classList.contains("is-mobile-search-open")) return;
      if (event.target.closest(".search-suggest__scroll")) return;
      event.preventDefault();
    };
    document.addEventListener("touchmove", mobileSearchTouchLock, { passive: false });
    return;
  }

  if (!active && mobileSearchTouchLock) {
    document.removeEventListener("touchmove", mobileSearchTouchLock);
    mobileSearchTouchLock = null;
  }
}

function clearMobileSearchViewportVars() {
  document.documentElement.style.removeProperty("--mobile-vv-offset-top");
  document.documentElement.style.removeProperty("--mobile-vv-height");
  document.documentElement.style.removeProperty("--mobile-search-panel-top");
  document.documentElement.style.removeProperty("--mobile-search-panel-h");
}

function setMobileSearchScreen(open) {
  if (!mobileSearchScreenMq.matches) {
    if (!open) {
      document.documentElement.classList.remove("is-mobile-search-open");
      document.body.classList.remove("is-mobile-search-open");
      clearMobileSearchViewportVars();
      setMobileSearchTouchLock(false);
      mobileSearchOverlay?.remove();
      mobileSearchOverlay = null;
    }
    return;
  }

  if (open) {
    mobileSearchScrollY = window.scrollY;
    ensureMobileSearchOverlay();
    document.documentElement.classList.add("is-mobile-search-open");
    document.body.classList.add("is-mobile-search-open");
    mobileSearchOverlay.hidden = false;
    setMobileSearchTouchLock(true);
    window.worSearch?.syncPanel?.();
    return;
  }

  document.documentElement.classList.remove("is-mobile-search-open");
  document.body.classList.remove("is-mobile-search-open");
  if (mobileSearchOverlay) mobileSearchOverlay.hidden = true;
  setMobileSearchTouchLock(false);
  clearMobileSearchViewportVars();
  window.scrollTo(0, mobileSearchScrollY);
}

function initMobileHeader() {
  const header = qs(".header");
  const searchInput = qs(".search__input");

  qsa("[data-search-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const open = header?.classList.toggle("is-search-open");
      setMobileSearchScreen(open);
      if (open) {
        window.worSearch?.openIdle?.();
        requestAnimationFrame(() => window.worSearch?.syncPanel?.());
      } else {
        window.worSearch?.close();
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!header?.classList.contains("is-search-open")) return;
    header.classList.remove("is-search-open");
    setMobileSearchScreen(false);
    window.worSearch?.close();
  });
}

function getSharedAssetPath(relativePath) {
  const link = qs('link[href*="shared/css/base.css"]');
  const href = link?.getAttribute("href") || "../../shared/css/base.css";
  const marker = "shared/";
  const index = href.indexOf(marker);
  if (index === -1) return `../../shared/${relativePath}`;
  return `${href.slice(0, index + marker.length)}${relativePath}`;
}

function getPageProductImage(imagePath) {
  const match = window.location.pathname.match(/\/pages\/([^/]+)\//);
  const page = match?.[1] || "home";
  if (page === "home") return `./images/${imagePath}`;
  return `../home/images/${imagePath}`;
}

const SEARCH_INDEX = {
  products: [
    {
      title: "Ракетка Babolat Pure Drive Team",
      brand: "Babolat",
      price: "12 990 ₽",
      href: "../product/",
      image: "products/cart-babolat.png",
      terms: ["babolat", "pure", "drive", "team", "ракетка", "теннис"],
    },
    {
      title: "Ракетка Babolat Pure Aero",
      brand: "Babolat",
      price: "15 490 ₽",
      href: "../product/",
      image: "products/cart-babolat.png",
      terms: ["babolat", "pure", "aero", "ракетка", "теннис"],
    },
    {
      title: "Ракетка Babolat Pure Drive 2024",
      brand: "Babolat",
      price: "18 900 ₽",
      href: "../product/",
      image: "products/cart-babolat.png",
      terms: ["babolat", "pure", "drive", "2024", "ракетка", "теннис"],
    },
    {
      title: "Ракетка Babolat Boost Drive",
      brand: "Babolat",
      price: "9 990 ₽",
      href: "../product/",
      image: "products/cart-babolat.png",
      terms: ["babolat", "boost", "drive", "ракетка", "теннис"],
    },
  ],
  categories: [
    {
      title: "Взрослые теннисные ракетки",
      href: "../catalog/?section=tennis-adult",
      terms: ["взрослые", "теннис", "ракетки", "ракетка"],
    },
    {
      title: "Теннисные сумки",
      href: "../catalog/?section=tennis-bags",
      terms: ["теннис", "сумки", "сумка", "bag"],
    },
  ],
  brands: [
    {
      title: "Babolat",
      href: "../catalog/?section=tennis-adult&brand=babolat",
      terms: ["babolat", "баболат", "бабо"],
    },
    {
      title: "Wilson",
      href: "../catalog/?section=tennis-adult&brand=wilson",
      terms: ["wilson", "уилсон", "вилсон"],
    },
    {
      title: "Head",
      href: "../catalog/?section=tennis-adult&brand=head",
      terms: ["head", "хед"],
    },
    {
      title: "Yonex",
      href: "../catalog/?section=tennis-adult&brand=yonex",
      terms: ["yonex", "йонекс"],
    },
    {
      title: "Tecnifibre",
      href: "../catalog/?section=tennis-adult&brand=tecnifibre",
      terms: ["tecnifibre", "технифайбр", "технифибре"],
    },
    {
      title: "Bullpadel",
      href: "../catalog/?section=padel-rackets&brand=bullpadel",
      terms: ["bullpadel", "буллпадел", "булпадел"],
    },
    {
      title: "Asics",
      href: "../catalog/?section=shoes-men&brand=asics",
      terms: ["asics", "асикс"],
    },
  ],
};

function normalizeSearchQuery(value) {
  return String(value || "")
    .trim()
    .toLocaleLowerCase("ru-RU")
    .replace(/\s+/g, " ");
}

function matchesSearchQuery(query, terms = [], title = "") {
  const normalizedQuery = normalizeSearchQuery(query);
  if (!normalizedQuery) return false;
  const haystack = `${title} ${terms.join(" ")}`.toLocaleLowerCase("ru-RU");
  return haystack.includes(normalizedQuery);
}

function filterSearchCategories(query, hasOtherMatches) {
  const matched = SEARCH_INDEX.categories.filter((item) =>
    matchesSearchQuery(query, [...item.terms], item.title)
  );
  if (matched.length) return matched;
  if (hasOtherMatches) return SEARCH_INDEX.categories;
  return [];
}

function brandSlug(title) {
  return String(title || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}

function filterSearchBrands(query, products) {
  const matched = SEARCH_INDEX.brands.filter((item) =>
    matchesSearchQuery(query, [...item.terms], item.title)
  );
  const byTitle = new Map(
    SEARCH_INDEX.brands.map((item) => [item.title.toLowerCase(), item])
  );
  const seen = new Set(matched.map((item) => item.title.toLowerCase()));
  const fromProducts = [];

  products.forEach((product) => {
    const title = String(product.brand || "").trim();
    if (!title) return;
    const key = title.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);

    const known = byTitle.get(key);
    if (known) {
      fromProducts.push(known);
      return;
    }

    fromProducts.push({
      title,
      href: `../catalog/?section=tennis-adult&brand=${encodeURIComponent(brandSlug(title))}`,
      terms: [key],
    });
  });

  return [...matched, ...fromProducts];
}

function buildSearchResultsUrl(query) {
  return `../search/?q=${encodeURIComponent(query.trim())}`;
}

const FOOTER_CATALOG_SECTIONS = {
  Бадминтон: {
    Ракетки: "badminton-rackets",
    Наборы: "badminton",
    Воланы: "badminton-shuttle",
    "Сумки. Рюкзаки. Чехлы": "badminton-bags",
  },
  "Большой теннис": {
    "Взрослые ракетки": "tennis-adult",
    "Детские ракетки": "tennis-kids",
    "Теннисные мячи": "tennis-balls",
    "Сумки. Рюкзаки. Чехлы": "tennis-bags",
    "Теннисные струны": "tennis-strings",
    Аксессуары: "tennis-acc",
  },
  "Теннисная обувь": {
    "Мужские кроссовки": "shoes-men",
    "Женские кроссовки": "shoes-women",
    "Детские кроссовки": "shoes-kids",
  },
  Падел: {
    "Взрослые ракетки": "padel-rackets",
    "Детские ракетки": "padel-rackets",
    "Мячи для падел": "padel-balls",
    "Сумки. Рюкзаки. Чехлы": "padel-bags",
    Аксессуары: "padel-acc",
  },
  "Теннисная одежда": {
    "Мужская одежда": "apparel-men",
    "Женская одежда": "apparel-women",
    "Одежда для мальчиков": "apparel-kids",
    "Одежда для девочек": "apparel-kids",
  },
  "Настольный теннис": {
    "Ракетки готовые": "table-rackets",
    "Ракетки собранные": "table-rackets",
    "Сборки чемпионов": "table-rackets",
    Основания: "table-rackets",
    Накладки: "table-rubbers",
    Наборы: "table-rackets",
    Мячи: "table-balls",
    Сетки: "table-acc",
    "Чехлы для ракеток": "table-acc",
    Аксессуары: "table-acc",
  },
  "Другие виды спорта": {
    "Кроссовки для бега": "other",
    "Бутсы футбольные": "other",
    Сквош: "squash",
    Кроссминтон: "other",
    "Пляжный теннис": "beach-tennis",
    Фрисби: "other",
    "Мячи футбольные": "other",
    "Мячи волейбольные": "other",
    "Мячи баскетбольные": "other",
    Пиклбол: "pickleball",
  },
};

const FOOTER_INFO_LINKS = {
  Магазины: "stores",
  Доставка: "delivery",
  Гарантия: "warranty",
  "Подарочные сертификаты": "gift-cards",
  "Политика конфиденциальности": "privacy",
};

function getSitePageHref(pageName) {
  const isTargetPage = new RegExp(`/pages/${pageName}/`).test(window.location.pathname);
  if (isTargetPage) return "./";
  return `../${pageName}/`;
}

function getCatalogPageHref(section) {
  const isCatalogPage = /\/pages\/catalog\/?/.test(window.location.pathname);
  const base = isCatalogPage ? "./" : "../catalog/";
  return `${base}?section=${encodeURIComponent(section)}`;
}

function applyFooterSectionLinks(root, headingText) {
  const infoMap = headingText === "Информация" ? FOOTER_INFO_LINKS : null;
  const catalogMap = FOOTER_CATALOG_SECTIONS[headingText];
  if (!infoMap && !catalogMap) return;

  qsa(".footer__links a", root).forEach((link) => {
    const label = link.textContent.replace(/\s+/g, " ").trim();
    if (infoMap?.[label]) {
      link.href = getSitePageHref(infoMap[label]);
      return;
    }
    const section = catalogMap?.[label];
    if (section) link.href = getCatalogPageHref(section);
  });
}

function initFooterCatalogLinks() {
  qsa(".footer .footer__section").forEach((section) => {
    const heading = qs(".footer__heading", section)?.textContent?.replace(/\s+/g, " ").trim();
    if (!heading) return;
    applyFooterSectionLinks(section, heading);
  });

  qsa(".footer .footer-acc").forEach((acc) => {
    const heading = qs(".footer-acc__summary > span", acc)?.textContent?.replace(/\s+/g, " ").trim();
    if (!heading) return;
    applyFooterSectionLinks(acc, heading);
  });
}

function initFooterBottom() {
  const footer = qs(".footer");
  if (!footer || qs(".footer__bottom", footer)) return;

  const bottom = document.createElement("div");
  bottom.className = "footer__bottom";

  const copyright = document.createElement("p");
  copyright.className = "footer__copyright";
  copyright.textContent = "© 2026 Мир ракеток";

  const legal = document.createElement("nav");
  legal.className = "footer__legal";
  legal.setAttribute("aria-label", "Юридическая информация");

  const privacyLink = document.createElement("a");
  privacyLink.href = getSitePageHref("privacy");
  privacyLink.textContent = "Политика конфиденциальности";

  const consentLink = document.createElement("a");
  consentLink.href = getSitePageHref("consent");
  consentLink.textContent = "Согласие на обработку персональных данных";

  legal.append(privacyLink, consentLink);
  bottom.append(copyright, legal);

  const anchor = qs("[data-contacts-source]", footer);
  footer.insertBefore(bottom, anchor ?? null);
}

function searchHasResults(queryRaw) {
  const query = normalizeSearchQuery(queryRaw);
  if (!query) return false;

  const products = SEARCH_INDEX.products.filter((item) =>
    matchesSearchQuery(query, [...item.terms, item.brand], item.title)
  );
  const brands = filterSearchBrands(query, products);
  const categories = filterSearchCategories(query, products.length > 0 || brands.length > 0);

  return products.length > 0 || categories.length > 0 || brands.length > 0;
}

window.worSearchIndex = {
  hasResults: searchHasResults,
  buildResultsUrl: buildSearchResultsUrl,
};

function initSearch() {
  const form = qs("[data-search-form]");
  const input = qs(".search__input", form);
  const submitBtn = qs(".search__submit", form);
  if (!form || !input) return;

  const clearBtn = document.createElement("button");
  clearBtn.type = "button";
  clearBtn.className = "search__clear";
  clearBtn.hidden = true;
  clearBtn.setAttribute("aria-label", "Очистить поиск");

  const clearIcon = document.createElement("img");
  clearIcon.src = getSharedAssetPath("images/icons/search-clear.png");
  clearIcon.alt = "";
  clearIcon.width = 24;
  clearIcon.height = 24;
  clearBtn.appendChild(clearIcon);

  if (submitBtn) submitBtn.before(clearBtn);
  else form.appendChild(clearBtn);

  const safeArea = document.createElement("div");
  safeArea.className = "search__safe-area";
  safeArea.setAttribute("aria-hidden", "true");

  const mobileRow = document.createElement("div");
  mobileRow.className = "search__row";

  const backBtn = document.createElement("button");
  backBtn.type = "button";
  backBtn.className = "search__back";
  backBtn.setAttribute("aria-label", "Закрыть поиск");

  const backIcon = document.createElement("img");
  backIcon.className = "search__back-icon";
  backIcon.src = getSharedAssetPath("images/icons/search-back.svg");
  backIcon.alt = "";
  backIcon.width = 8;
  backIcon.height = 14;
  backBtn.appendChild(backIcon);

  const field = document.createElement("div");
  field.className = "search__field";
  field.append(input, clearBtn);
  if (submitBtn) field.appendChild(submitBtn);

  mobileRow.append(backBtn, field);
  form.prepend(mobileRow);
  form.prepend(safeArea);

  const dropdown = document.createElement("div");
  dropdown.className = "search-suggest";
  dropdown.id = "search-suggest";
  dropdown.hidden = true;
  dropdown.setAttribute("role", "region");
  dropdown.setAttribute("aria-label", "Подсказки поиска");
  form.appendChild(dropdown);

  input.setAttribute("aria-controls", dropdown.id);
  input.setAttribute("aria-expanded", "false");
  input.setAttribute("aria-autocomplete", "list");

  const mobileSearchMq = window.matchMedia("(max-width: 860px)");
  const isMobileSearch = () => mobileSearchMq.matches;
  const header = qs(".header");

  function isMobileKeyboardOpen(viewport) {
    return window.innerHeight - viewport.height - viewport.offsetTop > 50;
  }

  function clearMobileSearchPanelMetrics() {
    document.documentElement.style.removeProperty("--mobile-search-panel-top");
    document.documentElement.style.removeProperty("--mobile-search-panel-h");
    dropdown.classList.remove("search-suggest--keyboard-top");
  }

  function syncMobileSearchViewport() {
    const viewport = window.visualViewport;
    const searchOpen = isMobileSearch() && header?.classList.contains("is-search-open");

    if (!searchOpen || !viewport) {
      return;
    }

    document.documentElement.style.setProperty("--mobile-vv-offset-top", `${viewport.offsetTop}px`);
    document.documentElement.style.setProperty("--mobile-vv-height", `${viewport.height}px`);
  }

  function syncMobileSearchPanelMetrics() {
    const viewport = window.visualViewport;
    const searchOpen = isMobileSearch() && header?.classList.contains("is-search-open");

    if (!searchOpen) {
      clearMobileSearchViewportVars();
      dropdown.classList.remove("search-suggest--keyboard-top");
      return;
    }

    syncMobileSearchViewport();

    if (!viewport || dropdown.hidden) {
      clearMobileSearchPanelMetrics();
      return;
    }

    const headerRect = header.getBoundingClientRect();
    const panelTop = headerRect.bottom;
    const visibleBottom = viewport.offsetTop + viewport.height;
    let panelBottom = visibleBottom;

    const tabbar = qs(".tabbar");
    if (tabbar) {
      const tabbarTop = tabbar.getBoundingClientRect().top;
      if (tabbarTop > headerRect.bottom && tabbarTop < visibleBottom) {
        panelBottom = tabbarTop;
      }
    }

    const panelHeight = Math.max(0, panelBottom - panelTop);

    document.documentElement.style.setProperty("--mobile-search-panel-top", `${panelTop}px`);
    document.documentElement.style.setProperty("--mobile-search-panel-h", `${panelHeight}px`);

    const keyboardOpen = isMobileKeyboardOpen(viewport);
    const canCenterContent = panelHeight >= 220;
    dropdown.classList.toggle("search-suggest--keyboard-top", keyboardOpen && !canCenterContent);
  }

  function scheduleMobileSearchPanelSync() {
    syncMobileSearchPanelMetrics();
    window.requestAnimationFrame(syncMobileSearchPanelMetrics);
    window.setTimeout(syncMobileSearchPanelMetrics, 120);
    window.setTimeout(syncMobileSearchPanelMetrics, 320);
  }

  function bindMobileSearchViewportSync() {
    if (bindMobileSearchViewportSync.bound) return;
    bindMobileSearchViewportSync.bound = true;

    const resync = () => scheduleMobileSearchPanelSync();
    window.visualViewport?.addEventListener("resize", resync);
    window.visualViewport?.addEventListener("scroll", resync);
    window.addEventListener("resize", resync);
    mobileSearchMq.addEventListener("change", resync);
  }

  bindMobileSearchViewportSync();

  function setOpen(open) {
    dropdown.hidden = !open;
    input.setAttribute("aria-expanded", String(open));
    form.classList.toggle("is-suggest-open", open);
  }

  function closeSuggest() {
    dropdown.classList.remove("search-suggest--idle", "search-suggest--empty");
    setOpen(false);
    clearMobileSearchPanelMetrics();
  }

  backBtn.addEventListener("click", () => {
    header?.classList.remove("is-search-open");
    setMobileSearchScreen(false);
    closeSuggest();
  });

  function renderIdleSuggest() {
    if (!isMobileSearch()) {
      closeSuggest();
      return;
    }

    dropdown.replaceChildren();

    const idle = document.createElement("div");
    idle.className = "search-suggest__idle";

    const idleImage = document.createElement("img");
    idleImage.className = "search-suggest__idle-image";
    idleImage.src = getSharedAssetPath("images/illustrations/search-hints.png");
    idleImage.alt = "";
    idleImage.width = 128;
    idleImage.height = 64;

    const idleText = document.createElement("p");
    idleText.className = "search-suggest__idle-text";
    idleText.textContent = "Введите поисковый запрос, чтобы увидеть подсказки";

    idle.append(idleImage, idleText);
    dropdown.appendChild(idle);
    dropdown.classList.add("search-suggest--idle");
    setOpen(true);
    scheduleMobileSearchPanelSync();
  }

  function syncSearchFieldState() {
    const hasValue = input.value.trim().length > 0;
    clearBtn.hidden = !hasValue;
    if (submitBtn) submitBtn.hidden = hasValue;
  }

  function clearSearch() {
    input.value = "";
    syncSearchFieldState();
    if (isMobileSearch() && qs(".header.is-search-open")) {
      renderIdleSuggest();
    } else {
      closeSuggest();
    }
    input.focus();
  }

  clearBtn.addEventListener("click", clearSearch);

  function renderSuggest(queryRaw) {
    const query = normalizeSearchQuery(queryRaw);
    if (!query) {
      renderIdleSuggest();
      return;
    }

    dropdown.classList.remove("search-suggest--idle", "search-suggest--empty");

    const products = SEARCH_INDEX.products.filter((item) =>
      matchesSearchQuery(query, [...item.terms, item.brand], item.title)
    );
    const brands = filterSearchBrands(query, products);
    const hasOtherMatches = products.length > 0 || brands.length > 0;
    const categories = filterSearchCategories(query, hasOtherMatches);
    const hasResults = products.length || categories.length || brands.length;

    dropdown.replaceChildren();

    if (!hasResults) {
      const empty = document.createElement("div");
      empty.className = "search-suggest__empty";

      const emptyImage = document.createElement("img");
      emptyImage.className = "search-suggest__empty-image";
      emptyImage.src = getSharedAssetPath("images/illustrations/search-empty.png");
      emptyImage.alt = "";
      emptyImage.width = 128;
      emptyImage.height = 64;

      const emptyTitle = document.createElement("p");
      emptyTitle.className = "search-suggest__empty-title";
      emptyTitle.textContent = "Ничего не нашли";

      const emptyDesc = document.createElement("p");
      emptyDesc.className = "search-suggest__empty-desc";
      emptyDesc.textContent = `По запросу «${queryRaw.trim()}» товаров не найдено.\nПопробуйте изменить запрос или сбросить фильтры.`;

      empty.append(emptyImage, emptyTitle, emptyDesc);
      dropdown.appendChild(empty);
      if (isMobileSearch()) {
        dropdown.classList.add("search-suggest--empty");
      }
      setOpen(true);
      scheduleMobileSearchPanelSync();
      return;
    }

    const scroll = document.createElement("div");
    scroll.className = "search-suggest__scroll";

    if (products.length) {
      scroll.appendChild(createSuggestSection("Товары", products.map(renderProductLink)));
    }

    if (categories.length) {
      if (products.length) scroll.appendChild(createDivider());
      scroll.appendChild(createSuggestSection("Категории", categories.map(renderCategoryLink)));
    }

    if (brands.length) {
      if (products.length || categories.length) scroll.appendChild(createDivider());
      scroll.appendChild(createSuggestSection("Бренды", brands.map(renderBrandLink)));
    }

    dropdown.appendChild(scroll);

    const footer = document.createElement("div");
    footer.className = "search-suggest__footer";
    const allLink = document.createElement("a");
    allLink.className = "search-suggest__all";
    allLink.href = buildSearchResultsUrl(queryRaw);

    const allText = document.createElement("span");
    allText.className = "search-suggest__all-text";
    allText.textContent = `Все результаты по запросу «${queryRaw.trim()}»`;

    const allArrow = document.createElement("img");
    allArrow.className = "search-suggest__all-arrow";
    allArrow.src = getSharedAssetPath("images/icons/search-arrow-right.png");
    allArrow.alt = "";
    allArrow.width = 16;
    allArrow.height = 16;

    allLink.append(allText, allArrow);
    footer.appendChild(allLink);
    dropdown.appendChild(footer);

    setOpen(true);
    scheduleMobileSearchPanelSync();
  }

  function createDivider() {
    const divider = document.createElement("div");
    divider.className = "search-suggest__divider";
    divider.setAttribute("role", "separator");
    return divider;
  }

  function createSuggestSection(title, nodes) {
    const section = document.createElement("section");
    section.className = "search-suggest__section";

    const heading = document.createElement("h3");
    heading.className = "search-suggest__heading";
    heading.textContent = title;
    section.appendChild(heading);

    nodes.forEach((node) => section.appendChild(node));
    return section;
  }

  function renderProductLink(item) {
    const link = document.createElement("a");
    link.className = "search-suggest__product";
    link.href = item.href;
    link.innerHTML = `
      <img class="search-suggest__product-img" src="${getPageProductImage(item.image)}" alt="" width="55" height="55" />
      <span class="search-suggest__product-body">
        <span class="search-suggest__product-title">${escapeHtml(item.title)}</span>
        <span class="search-suggest__product-meta">
          <span class="search-suggest__product-brand">${escapeHtml(item.brand)}</span>
          <span class="search-suggest__product-price">${escapeHtml(item.price)}</span>
        </span>
      </span>
    `;
    link.addEventListener("click", closeSuggest);
    return link;
  }

  function renderCategoryLink(item) {
    const link = document.createElement("a");
    link.className = "search-suggest__link";
    link.href = item.href;
    link.textContent = item.title;
    link.addEventListener("click", closeSuggest);
    return link;
  }

  function renderBrandLink(item) {
    const link = document.createElement("a");
    link.className = "search-suggest__link search-suggest__link--brand";
    link.href = item.href;
    link.textContent = item.title;
    link.addEventListener("click", closeSuggest);
    return link;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function goToResults(query) {
    const normalized = normalizeSearchQuery(query);
    if (!normalized) return;
    window.location.href = buildSearchResultsUrl(query);
  }

  input.addEventListener("input", () => {
    syncSearchFieldState();
    renderSuggest(input.value);
  });

  input.addEventListener("focus", () => {
    syncSearchFieldState();
    if (normalizeSearchQuery(input.value)) {
      renderSuggest(input.value);
    } else {
      renderIdleSuggest();
    }
    scheduleMobileSearchPanelSync();
  });

  input.addEventListener("blur", () => {
    window.setTimeout(scheduleMobileSearchPanelSync, 100);
  });

  syncSearchFieldState();

  const urlQuery = new URLSearchParams(window.location.search).get("q");
  if (urlQuery) {
    input.value = urlQuery;
    syncSearchFieldState();
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    goToResults(input.value);
  });

  dropdown.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });

  document.addEventListener("click", (event) => {
    if (form.contains(event.target)) return;
    if (event.target.closest("[data-search-toggle]")) return;
    closeSuggest();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSuggest();
  });

  window.worSearch = {
    close: closeSuggest,
    render: renderSuggest,
    openIdle: renderIdleSuggest,
    syncPanel: scheduleMobileSearchPanelSync,
  };
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
initSearch();
initContactsSheet();
initFavorites();
initCart();
initFooterCatalogLinks();
initFooterBottom();
