function initProductGallery(root) {
  const images = qsa("[data-gallery-image]", root);
  const thumbs = qsa("[data-gallery-thumb]", root);
  const dots = qsa(".product-gallery__dot", root);
  const prevBtn = qs("[data-gallery-prev]", root);
  const nextBtn = qs("[data-gallery-next]", root);
  if (!images.length) return;

  let index = images.findIndex((image) => image.classList.contains("is-active"));
  if (index < 0) index = 0;

  function goTo(nextIndex) {
    index = (nextIndex + images.length) % images.length;
    images.forEach((image, i) => {
      const active = i === index;
      image.classList.toggle("is-active", active);
      image.hidden = !active;
    });
    thumbs.forEach((thumb, i) => {
      thumb.classList.toggle("is-active", i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
    });
    const activeThumb = thumbs[index];
    activeThumb?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener("click", () => goTo(i));
  });

  prevBtn?.addEventListener("click", () => goTo(index - 1));
  nextBtn?.addEventListener("click", () => goTo(index + 1));

  let startX = 0;
  let tracking = false;

  root.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length !== 1 || !window.matchMedia("(max-width: 860px)").matches) return;
      startX = event.touches[0].clientX;
      tracking = true;
    },
    { passive: true }
  );

  root.addEventListener(
    "touchend",
    (event) => {
      if (!tracking) return;
      tracking = false;
      const endX = event.changedTouches[0]?.clientX ?? startX;
      const dx = endX - startX;
      if (Math.abs(dx) < 40) return;
      goTo(dx < 0 ? index + 1 : index - 1);
    },
    { passive: true }
  );
}

function initProductTabs(root) {
  const buttons = qsa("[data-tab]", root);
  const items = qsa(".product-acc", root);
  if (!items.length) return;

  const mq = window.matchMedia("(min-width: 861px)");

  function activate(name) {
    buttons.forEach((button) => {
      const active = button.getAttribute("data-tab") === name;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });
    items.forEach((item) => {
      item.open = item.getAttribute("data-panel") === name;
    });
  }

  function syncDesktopState() {
    if (!mq.matches) return;
    const openItem = items.find((item) => item.open);
    activate(openItem?.getAttribute("data-panel") || "description");
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      activate(button.getAttribute("data-tab"));
    });
  });

  mq.addEventListener("change", () => {
    if (mq.matches) {
      syncDesktopState();
      return;
    }
    buttons.forEach((button) => {
      button.classList.remove("is-active");
      button.setAttribute("aria-selected", "false");
    });
    items.forEach((item) => {
      item.open = false;
    });
  });

  syncDesktopState();
}

function initProductQty() {
  const groups = qsa("[data-product-qty], [data-product-qty-bar]");
  if (!groups.length) return;

  let qty = 1;

  function render() {
    groups.forEach((group) => {
      const value = qs("[data-qty-value]", group);
      if (value) value.textContent = String(qty);
    });
  }

  document.addEventListener("click", (event) => {
    const minus = event.target.closest("[data-qty-minus]");
    const plus = event.target.closest("[data-qty-plus]");
    if (!minus && !plus) return;
    if (minus) qty = Math.max(1, qty - 1);
    if (plus) qty += 1;
    render();
  });

  render();
}

function initProductSizes() {
  qsa(".product-options__sizes, .product-store-sizes__grid").forEach((group) => {
    qsa(".product-size", group).forEach((button) => {
      if (button.disabled || button.classList.contains("is-unavailable")) return;

      button.addEventListener("click", () => {
        qsa(".product-size", group).forEach((item) => {
          item.classList.remove("is-active");
          item.setAttribute("aria-pressed", "false");
        });
        button.classList.add("is-active");
        button.setAttribute("aria-pressed", "true");
      });
    });
  });
}

function initProductStores() {
  const list = qs("[data-product-stores-list]");
  const source = qs("[data-contacts-source]");
  if (!list || !source || list.children.length) return;

  const storeCards = [...source.querySelectorAll(".footer-acc__card")].slice(1);
  if (!storeCards.length) return;

  list.replaceChildren(...storeCards.map((card) => card.cloneNode(true)));
}

function initProductsCarousel(root) {
  const track = qs(".products", root);
  const viewport = qs(".products-carousel__viewport", root);
  const prevBtn = qs(".products-carousel__arrow--prev", root);
  const nextBtn = qs(".products-carousel__arrow--next", root);
  if (!track || !viewport || !prevBtn || !nextBtn) return;

  let index = 0;

  function step() {
    const card = qs(".product-card", track);
    if (!card) return 0;
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap) || 0;
    return card.getBoundingClientRect().width + gap;
  }

  function maxIndex() {
    const size = step();
    if (!size) return 0;
    const visible = Math.max(1, Math.round(viewport.clientWidth / size));
    return Math.max(0, track.children.length - visible);
  }

  function update() {
    const max = maxIndex();
    index = Math.max(0, Math.min(index, max));
    track.style.transform = `translate3d(${-index * step()}px, 0, 0)`;
    prevBtn.disabled = index <= 0;
    nextBtn.disabled = index >= max;
  }

  prevBtn.addEventListener("click", () => {
    index -= 1;
    update();
  });
  nextBtn.addEventListener("click", () => {
    index += 1;
    update();
  });
  window.addEventListener("resize", update);
  update();
}

function initProductFavorites() {
  const scope = qs(".product");
  if (!scope) return;

  const buttons = qsa(".product-card__fav", scope);
  if (buttons.length < 2) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      requestAnimationFrame(() => {
        const active = button.classList.contains("is-active");
        buttons.forEach((other) => {
          if (other === button) return;
          other.classList.toggle("is-active", active);
          other.setAttribute("aria-pressed", String(active));
          other.setAttribute("aria-label", active ? "Убрать из избранного" : "В избранное");
        });
      });
    });
  });
}

qsa("[data-product-gallery]").forEach(initProductGallery);
qsa("[data-product-tabs]").forEach(initProductTabs);
initProductQty();
initProductSizes();
initProductStores();
initProductFavorites();
qsa("[data-products-carousel]").forEach(initProductsCarousel);
