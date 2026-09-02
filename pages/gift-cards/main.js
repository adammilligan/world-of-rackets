(function initGiftCardsPage() {
  const root = document.querySelector("[data-gift-cards]");
  if (!root) return;

  const denomButtons = [...root.querySelectorAll("[data-denom]")];

  let selectedDenom = Number(denomButtons.find((btn) => btn.classList.contains("is-active"))?.dataset.denom || 3000);

  function getQty() {
    const value = root.querySelector("[data-qty-value]");
    return Math.max(1, Number(value?.textContent || 1));
  }

  denomButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedDenom = Number(btn.dataset.denom);
      denomButtons.forEach((item) => {
        const isActive = item === btn;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
    });
  });

  root.querySelectorAll("[data-gift-add]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      if (window.worCart) {
        window.worCart.increment(getQty());
      }
    });
  });

  const favButtons = [...root.querySelectorAll(".product-buy__fav")];

  function syncFavButtons(source) {
    const active = source.classList.contains("is-active");
    favButtons.forEach((btn) => {
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
      btn.setAttribute("aria-label", active ? "Убрать из избранного" : "В избранное");
    });
  }

  favButtons.forEach((btn) => {
    btn.addEventListener("click", () => syncFavButtons(btn));
  });

  const mobileMq = window.matchMedia("(max-width: 860px)");

  function scrollAccordionClearOfBar(acc) {
    if (!mobileMq.matches || !acc.open) return;

    const bar = document.querySelector(".product-buy--bar");
    if (!bar) return;

    window.setTimeout(() => {
      const barTop = bar.getBoundingClientRect().top;
      const content = acc.querySelector(".product-acc__body, .gift-cards-page__acc-body") || acc;
      const overlap = content.getBoundingClientRect().bottom - barTop + 24;
      if (overlap > 0) {
        window.scrollBy({ top: overlap, behavior: "smooth" });
      }
    }, 50);
  }

  root.querySelectorAll(".product-acc, .gift-cards-page__acc").forEach((acc) => {
    acc.addEventListener("toggle", () => scrollAccordionClearOfBar(acc));
  });
})();
