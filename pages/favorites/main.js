(function initFavoritesPage() {
  const page = document.querySelector(".favorites-page");
  if (!page) return;

  const params = new URLSearchParams(window.location.search);
  if (params.has("empty")) {
    page.querySelector(".favorites-page__filled")?.remove();
    window.worFavorites?.setCount(0);
    setEmptyState(page, true);
    return;
  }

  page.addEventListener("favorites-page:update", () => updateFavoritesPage(page));

  updateFavoritesPage(page);
})();

function formatItemsCount(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} товар`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} товара`;
  return `${count} товаров`;
}

function updateFavoritesPage(page) {
  const items = page.querySelectorAll(".favorites-page__grid .product-card");
  const count = items.length;

  page.querySelectorAll("[data-fav-page-count]").forEach((el) => {
    el.textContent = formatItemsCount(count);
  });

  window.worFavorites?.setCount(count);
  setEmptyState(page, count === 0);
}

function setEmptyState(page, isEmpty) {
  page.classList.toggle("favorites-page--empty", isEmpty);

  if (isEmpty) {
    page.querySelectorAll("[data-fav-page-count]").forEach((el) => {
      el.textContent = "0 товаров";
    });
    window.worFavorites?.setCount(0);
  }
}
