(function initSearchPage() {
  const page = document.querySelector("[data-search-page]");
  if (!page) return;

  const empty = page.querySelector("[data-search-empty]");
  const emptyDesc = page.querySelector("[data-search-empty-desc]");
  const results = page.querySelector("[data-search-results]");
  const pageDesc = page.querySelector("[data-search-page-desc]");
  const clearBtn = page.querySelector("[data-search-page-clear]");

  function getQuery() {
    return new URLSearchParams(window.location.search).get("q")?.trim() || "";
  }

  function pluralizeGoods(count) {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod100 >= 11 && mod100 <= 14) return "товаров";
    if (mod10 === 1) return "товар";
    if (mod10 >= 2 && mod10 <= 4) return "товара";
    return "товаров";
  }

  function getResultCount() {
    return results?.querySelectorAll(".product-card").length || 0;
  }

  function renderState() {
    const query = getQuery();
    const hasResults = query && window.worSearchIndex?.hasResults(query);

    if (pageDesc) {
      if (hasResults) {
        const count = getResultCount();
        pageDesc.textContent = `По запросу «${query}» найдено ${count} ${pluralizeGoods(count)}`;
        pageDesc.hidden = false;
      } else {
        pageDesc.hidden = true;
        pageDesc.textContent = "";
      }
    }

    if (hasResults) {
      empty.hidden = true;
      results.hidden = false;
      return;
    }

    empty.hidden = false;
    results.hidden = true;

    if (emptyDesc) {
      const label = query || "…";
      emptyDesc.textContent = query
        ? `По запросу «${label}» товаров не найдено.\nПопробуйте изменить запрос или сбросить фильтры.`
        : "Введите запрос в строке поиска, чтобы найти товары в каталоге.";
    }
  }

  clearBtn?.addEventListener("click", () => {
    const input = document.querySelector(".search__input");
    if (input) {
      input.value = "";
      window.worSearch?.close();
    }
    window.location.href = "../home/";
  });

  renderState();
})();
