(function initCartPage() {
  const page = document.querySelector(".cart-page");
  if (!page) return;

  const params = new URLSearchParams(window.location.search);
  if (params.has("empty")) {
    window.worCart?.setCount(0);
    setEmptyState(page, true);
    return;
  }

  page.querySelectorAll(".cart-item").forEach((item) => {
    if (!item.dataset.unitPrice) {
      const current = parsePrice(item.querySelector(".cart-item__price-current")?.textContent);
      const old = parsePrice(item.querySelector(".cart-item__price-old")?.textContent);
      item.dataset.unitPrice = String(current);
      item.dataset.unitOld = String(old);
    }
    syncItemQty(item, getItemQty(item));
  });

  page.addEventListener("click", (event) => {
    const minusBtn = event.target.closest("[data-cart-minus]");
    const plusBtn = event.target.closest("[data-cart-plus]");
    const deleteBtn = event.target.closest("[data-cart-delete]");
    const favBtn = event.target.closest(".cart-item__action--fav");

    if (minusBtn) {
      event.preventDefault();
      if (minusBtn.disabled) return;
      const item = minusBtn.closest(".cart-item");
      syncItemQty(item, getItemQty(item) - 1);
      updateCart(page);
      return;
    }

    if (plusBtn) {
      event.preventDefault();
      const item = plusBtn.closest(".cart-item");
      syncItemQty(item, getItemQty(item) + 1);
      updateCart(page);
      return;
    }

    if (deleteBtn) {
      event.preventDefault();
      deleteBtn.closest(".cart-item")?.remove();
      updateCart(page);
      return;
    }

    if (favBtn) {
      event.preventDefault();
      favBtn.classList.toggle("is-active");
      const active = favBtn.classList.contains("is-active");
      favBtn.setAttribute("aria-pressed", String(active));
      favBtn.setAttribute("aria-label", active ? "Убрать из избранного" : "Добавить в избранное");
    }
  });

  updateCart(page);
})();

function parsePrice(text) {
  if (!text) return 0;
  return Number(text.replace(/[^\d]/g, "")) || 0;
}

function formatPrice(value) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
}

function formatItemsCount(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} товар`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} товара`;
  return `${count} товаров`;
}

function getItemQty(item) {
  const valueEl = item.querySelector(".cart-item__qty-value");
  return Number(valueEl?.textContent) || 1;
}

function syncItemQty(item, qty) {
  const nextQty = Math.max(1, qty);
  item.querySelectorAll(".cart-item__qty-value").forEach((el) => {
    el.textContent = String(nextQty);
  });
  item.querySelectorAll("[data-cart-minus]").forEach((btn) => {
    btn.disabled = nextQty <= 1;
  });
}

function updateCart(page) {
  const items = [...page.querySelectorAll(".cart-item")];

  if (!items.length) {
    setEmptyState(page, true);
    return;
  }

  setEmptyState(page, false);

  let totalQty = 0;
  let subtotal = 0;
  let oldTotal = 0;

  items.forEach((item) => {
    const qty = getItemQty(item);
    const unitPrice = Number(item.dataset.unitPrice) || 0;
    const unitOld = Number(item.dataset.unitOld) || 0;
    totalQty += qty;
    subtotal += unitPrice * qty;
    oldTotal += unitOld * qty;
  });

  const discount = Math.max(0, oldTotal - subtotal);
  const countLabel = `${totalQty} шт.`;

  page.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = formatItemsCount(totalQty);
  });

  page.querySelectorAll("[data-cart-summary-count]").forEach((el) => {
    el.textContent = countLabel;
  });
  page.querySelectorAll("[data-cart-summary-subtotal]").forEach((el) => {
    el.textContent = formatPrice(subtotal);
  });
  page.querySelectorAll("[data-cart-summary-discount]").forEach((el) => {
    el.textContent = discount > 0 ? `–${formatPrice(discount).replace(" ₽", "")} ₽` : "0 ₽";
  });
  page.querySelectorAll("[data-cart-summary-total]").forEach((el) => {
    el.textContent = formatPrice(subtotal);
  });

  document.querySelectorAll("[data-cart-badge]").forEach((badge) => {
    badge.textContent = String(totalQty);
    badge.hidden = totalQty <= 0;
  });

  window.worCart?.setCount(totalQty);
}

function setEmptyState(page, isEmpty) {
  page.classList.toggle("cart-page--empty", isEmpty);
  page.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = "0 товаров";
  });
  document.querySelectorAll("[data-cart-badge]").forEach((badge) => {
    badge.textContent = "0";
    badge.hidden = true;
  });

  window.worCart?.setCount(0);
}
