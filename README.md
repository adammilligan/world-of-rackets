# Мир ракеток — документация для переноса в Laravel Blade

Документ для backend-разработчика: что перенести из статического прототипа в Blade-шаблоны Laravel.

**Дата актуализации:** 2 сентября 2026

---

## Эталонные файлы

| Область | Путь |
|---------|------|
| Главная | `pages/home/index.html` |
| Каталог раздела | `pages/catalog/index.html`, `pages/catalog/main.js`, `pages/catalog/styles.css` |
| Поиск | `pages/search/index.html`, `pages/search/main.js`, `pages/search/styles.css` |
| Карточка товара | `pages/product/index.html`, `single.html`, `in-store.html` |
| Корзина / оформление | `pages/cart/`, `pages/checkout/` |
| Личный кабинет | `pages/account/` |
| Общие стили / JS | `shared/css/base.css`, `shared/js/common.js`, `shared/js/validation.js` |
| Карточки товаров (CSS) | `pages/home/styles.css` |

---

## Рекомендуемая структура Blade

```
resources/views/
├── layouts/app.blade.php
├── partials/
│   ├── topbar.blade.php
│   ├── header.blade.php          ← search, nav, badges
│   ├── nav.blade.php             ← mega-menu (можно внутри header)
│   ├── footer.blade.php          ← desktop + mobile
│   ├── footer-bottom.blade.php   ← copyright + legal (лучше статикой, не JS)
│   ├── tabbar.blade.php
│   ├── catalog-sidebar.blade.php ← sidebar + все <template>
│   ├── contacts-source.blade.php
│   └── contacts-sheet.blade.php
├── components/product-card.blade.php
└── pages/ ...
```

**Порядок в `<body>` (важен):**
1. skip-link → topbar → header → `@yield('content')` → footer → tabbar
2. catalog-sidebar → contacts-source → contacts-sheet
3. `common.js` + `@stack('scripts')`

**Маппинг URL:**

| Прототип | Laravel |
|----------|---------|
| `/pages/home/` | `/` |
| `/pages/catalog/?section=X&brand=Y` | `/catalog?section=X&brand=Y` |
| `/pages/search/?q=X` | `/search?q=X` |
| `/pages/product/` | `/product/{slug}` |
| `/pages/cart/` | `/cart` |
| `/pages/checkout/` | `/checkout` |
| `/pages/account/login.html` | `/login` |
| `/pages/gift-cards/` | `/gift-cards` |

---

## 1. Глобальные CSS-переменные и breakpoints

```css
:root {
  --container: 1840px;      /* + gutters 40×2 = 1920px */
  --page-gutter: 40px;      /* 16px на ≤860px */
  --header-h: 70px;
  --tabbar-h: 64px;
  --color-footer: #eef6a7;
  --color-accent: #dceb3c;
}
```

| Breakpoint | Поведение |
|------------|-----------|
| `≤860px` | Mobile: tabbar, burger, catalog-sidebar fullscreen, mobile search, filters sheet, белый footer |
| `861px+` | Desktop: mega-menu hover, catalog-sidebar 3 колонки |
| `≤1100px` | Каталог: grid 2 колонки, уменьшен gap |

**Классы на `<html>` / `<body>` (ставит JS):**
- `html.js`
- `body.is-locked` — открыты sidebar / contacts
- `body.is-mobile-search-open`, `html.is-mobile-search-open` — mobile search
- `header.is-search-open` — активный mobile search в header

Убрать хардкод `1648px` — везде `var(--container)`.

---

## 2. Футер

### 2.1 Desktop (`.footer__desktop`)

**Сетка:** 5 колонок — `.footer__brand` + 4× `.footer__col` (в каждой по 2 `.footer__section`).

**Brand column (`.footer__brand`), порядок сверху вниз:**
1. `.logo.logo--footer` — img **140×28**
2. `.footer__social` — telegram, bip
3. `.footer__phone` — 20px / weight 600
4. `.footer__email` — 20px / weight 600

**4 колонки навигации (верхний + нижний ряд):**

| Колонка | Верх | Низ |
|---------|------|-----|
| 1 | Информация | Бадминтон |
| 2 | Большой теннис | Теннисная обувь |
| 3 | Падел | Теннисная одежда |
| 4 | Настольный теннис | Другие виды спорта |

Полный список ссылок — `pages/home/index.html` (`.footer__desktop`).

**CSS:** padding `87px var(--page-gutter) 145px`, фон `#eef6a7`.

### 2.2 Mobile (`.footer__mobile`)

- Фон **белый** (`var(--color-bg)`)
- `<details class="footer-acc">` — аккордеоны:
  1. Контакты (карточки магазинов)
  2. Доставка, Гарантия и возврат
  3. Информация
  4. Большой теннис, Падел, Настольный теннис, Бадминтон, Теннисная обувь, Теннисная одежда, Другие виды спорта

> **Важно:** блок `[data-contacts-source]` не трогать — от него зависят модалка контактов и «Только в магазине» на PDP.

> **Blade:** `.footer__mobile` есть только на главной. На остальных страницах mobile-аккордеоны не рендерятся — это ожидаемо.

### 2.3 Нижняя строка футера (`.footer__bottom`) — **НОВОЕ**

Сейчас вставляется JS (`initFooterBottom`), в Laravel лучше **статический partial**.

```html
<div class="footer__bottom">
  <p class="footer__copyright">© 2026 Мир ракеток</p>
  <nav class="footer__legal" aria-label="Юридическая информация">
    <a href="{{ route('privacy') }}">Политика конфиденциальности</a>
    <a href="{{ route('consent') }}">Согласие на обработку персональных данных</a>
  </nav>
</div>
```

**Desktop:** grid 5 колонок — copyright в col 1, legal-ссылки в col 4–5 (через `display: contents` на `.footer__legal`).

**Mobile:** flex column, gap 16px, padding `24px 16px 16px`, border-top.

Размещение: **перед** `[data-contacts-source]` внутри `.footer`.

### 2.4 Footer links JS (fallback)

`initFooterCatalogLinks()` подставляет href по тексту заголовка. В Blade лучше сразу рендерить `route()` / `?section=`.

---

## 3. Header и поиск

### 3.1 Header

| Элемент | Классы / data | Поведение |
|---------|---------------|-----------|
| Burger | `.header__burger`, `data-catalog-open` | Mobile: открывает catalog-sidebar |
| Catalog | `.header__catalog`, `data-catalog-open` | Desktop: «Каталог» |
| Search | `[data-search-form]`, `input[name=q]` | Suggest + submit |
| Badges | `[data-fav-badge]`, `[data-cart-badge]` | localStorage (в Laravel — session/API) |
| Mobile search btn | `[data-search-toggle]` | Открывает mobile search |

Submit формы → `/search?q={query}`.

### 3.2 Mobile search — **НОВОЕ**

При открытии на `≤860px`:
- `body.is-mobile-search-open` + overlay `.mobile-search-screen` (fullscreen, `100dvh`, не сдвигается с клавиатурой)
- Header фиксируется по `visualViewport.offsetTop` (CSS vars: `--mobile-vv-offset-top`, `--mobile-vv-height`)
- Панель `.search-suggest` подстраивается под видимую область
- Tabbar **остаётся видимым** (`z-index: 110`)
- Инпут **16px** (без зума iOS), autofocus при открытии **отключён** — клавиатура только после тапа
- Стрелка назад: `shared/images/icons/search-back.svg`
- Header search bar: 56px, padding `0 16px`, border-bottom 1px, инпут 42px с border accent

**Suggest (JS-only DOM):**
- `.search-suggest__section` — «Товары», «Категории», «Бренды»
- `.search-suggest--idle` / `--empty` / `--keyboard-top`
- «Все результаты по запросу…» → `/search?q=`

**API для backend:** заменить mock `SEARCH_INDEX` в `common.js` на Laravel API; сохранить:
```js
window.worSearchIndex = { hasResults(q), buildResultsUrl(q) }
window.worSearch = { close, render, openIdle, syncPanel }
```

---

## 4. Nav / Mega-menu

```html
<li class="nav__item">
  <a class="nav__trigger" href="/catalog?section=tennis"
     aria-expanded="false" aria-controls="nav-panel-tennis" aria-haspopup="true">
    Большой теннис
    <img class="nav__chevron" ... />
  </a>
  <div class="nav__panel" id="nav-panel-tennis" role="region" aria-hidden="true">
    <div class="nav__mega"> <!-- nav__mega--compact для обуви/одежды -->
      <div class="nav__mega-col">
        <p class="nav__mega-title"><a href="?section=tennis-adult">Взрослые ракетки</a></p>
        <ul class="nav__mega-list">
          <li><a href="?section=tennis-adult&brand=babolat">Babolat</a></li>
        </ul>
      </div>
    </div>
  </div>
</li>
```

**Поведение (`initNavMenus`):**
- **Desktop:** hover открывает panel; **клик по `.nav__trigger` → навигация** в раздел
- **Mobile:** клик → навигация
- Escape закрывает panels

**Top-level → `section`:**

| Пункт | section |
|-------|---------|
| Большой теннис | `tennis` |
| Падел | `padel` |
| Настольный теннис | `table` |
| Бадминтон | `badminton` |
| Теннисная обувь | `shoes` |
| Теннисная одежда | `apparel` |
| Другие виды спорта | `other` |

---

## 5. Catalog Sidebar — **ОБНОВЛЕНО**

Partial: `partials/catalog-sidebar.blade.php` — один раз на все страницы + все `<template id="catalog-branch-*">`.

### Структура

```html
<div class="catalog-sidebar" id="catalog-sidebar" hidden>
  <button class="catalog-sidebar__backdrop" data-catalog-close></button>
  <div class="catalog-sidebar__panel" role="dialog" data-catalog-panel data-depth="0">
    <div class="catalog-sidebar__head">
      <p class="catalog-sidebar__title">...</p>
      <button class="catalog-sidebar__close" data-catalog-close>...</button>
    </div>
    <div class="catalog-sidebar__cols">
      <div class="catalog-sidebar__col" data-catalog-col="0">...</div>
      <div class="catalog-sidebar__col" data-catalog-col="1" hidden></div>
      <div class="catalog-sidebar__col" data-catalog-col="2" hidden></div>
    </div>
  </div>
  <template id="catalog-branch-tennis">...</template>
  <!-- ... все branch templates ... -->
</div>
```

### Triggers

- `[data-catalog-open]` — burger, кнопка «Каталог», tabbar
- `[data-catalog-close]` — backdrop, крестик
- `[data-catalog-branch="{id}"]` — пункт с подменю
- `[data-catalog-back]` — «вернуться…» (генерируется JS на mobile)

### Поведение навигации — **НОВОЕ**

| Режим | Hover / drill | Клик |
|-------|---------------|------|
| **Desktop** | `mouseover` на branch → проваливание в col1/col2 | **переход в каталог** `?section=` |
| **Mobile** | — | клик по пункту с подменю → **drill down**; красный заголовок `.catalog-sidebar__section` и leaf-ссылки `<a>` → **переход в каталог** |

**Mobile subhead** (после drill):
- Кнопка «вернуться к…» — `[data-catalog-back]`
- Красный заголовок `.catalog-sidebar__section` — **ссылка** на раздел (`<a href="?section=...">`)

**Крестик закрытия — НОВОЕ:** при `data-depth="1|2"` на mobile **не скрывать** `.catalog-sidebar__head` — скрывается только `.catalog-sidebar__title`, крестик остаётся справа.

### Ссылки в sidebar

JS (`common.js`) резолвит `href="#"` через mega-menu + maps:
- `CATALOG_BRANCH_SECTION_ALIASES`: `clothes→apparel`, `other-squash→squash`, `other-beach→beach-tennis`, `other-pickle→pickleball`
- Brand lists → `?section={branch}&brand={slug}`
- Leaf items → те же URL, что в nav

**В Blade (рекомендуется):** проставить реальные `href` сразу в templates — JS enhancement станет fallback.

**Root branches:** `tennis`, `padel`, `table`, `badminton`, `shoes`, `clothes`, `other`, `brands` + nested (`tennis-adult`, `padel-rackets`, …).

---

## 6. Tabbar (mobile)

```html
<nav class="tabbar" aria-label="Мобильная навигация">
  <button class="tabbar__item" data-catalog-open>Каталог</button>
  <a class="tabbar__item" href="/favorites">
    <span class="tabbar__badge" data-fav-badge></span>
  </a>
  <a class="tabbar__item" href="/cart">
    <span class="tabbar__badge" data-cart-badge></span>
  </a>
  <a class="tabbar__item" href="/account">...</a>
  <button class="tabbar__item" data-search-toggle>Поиск</button>
</nav>
```

Visible only `≤860px`, fixed bottom. При mobile search tabbar **не скрывается**.

---

## 7. Contacts

### `[data-contacts-source]` (hidden)
3 карточки `.footer-acc__card` — интернет-магазин + 2 магазина. Metro: `.metro.metro--gray/orange/brown`.

### `#contacts-sheet`
Mobile bottom sheet: `[data-contacts-open]` → клонирование source в `[data-contacts-sheet-body]`. Swipe-to-dismiss, Escape, focus trap.

---

## 8. Каталог раздела

**Отдельной страницы «весь каталог» нет** — только раздел по `?section=`.

### URL

```
/catalog?section={section}
/catalog?section={section}&brand={slug}
/catalog?section={section}&brand={slug}&series=pure-aero,pure-drive
```

- Default section (если нет param): `tennis-adult`
- Brand slug: lowercase (`7/6` → `7-6`, `Pro Kennex` → `prokennex`)

### Крошки (без «Каталог»)

`Главная` → `{родитель}` → `{раздел}` → `{бренд?}`

JS рендерит в `[data-catalog-crumbs]` из `CATALOG_SECTIONS` в `catalog/main.js`. **В Laravel:** отдавать из контроллера.

### Layout

```html
<main class="catalog-page">
  <nav class="breadcrumbs"><ol data-catalog-crumbs>...</ol></nav>
  <div class="catalog-layout">
    <aside class="catalog-aside" data-catalog-aside>
      <div data-catalog-filters>
        <nav class="catalog-subnav"><ul data-catalog-subnav>...</ul></nav>
        <form data-filters-form>...</form>
        <button data-filters-clear>Очистить фильтр</button>
      </div>
    </aside>
    <div class="catalog-main">
      <h1 data-catalog-title>...</h1>
      <div class="catalog-main__head">
        <div data-quick-filters></div>
        <div data-catalog-mobile-tags>           <!-- НОВОЕ: mobile -->
          <div class="catalog-tag-grid" data-brand-tags></div>
          <div class="catalog-tag-grid" data-series-tags hidden></div>
        </div>
        <button data-filters-open>Фильтры</button>
        <div data-catalog-sort>...</div>
      </div>
      <div data-active-filters hidden>...</div>
      <ul class="products products--grid">@each product-card</ul>
    </div>
  </div>
</main>
```

### Mobile brand/series tags — **НОВОЕ**

На `≤860px` бренд/серия **убраны из filters sheet** — вместо них горизонтальные `.catalog-tag` кнопки над сеткой:
- `[data-brand-tags]` — бренды раздела
- `[data-series-tags]` — серии (только `tennis-adult` + выбранный brand)
- Активный: `.catalog-tag.is-active`
- Клик → `?section=&brand=&series=`

### Фильтры (UI, server-side нужен backend)

| Фильтр | data-attr | name |
|--------|-----------|------|
| Бренд | `data-filter-brand` | `brand` radio |
| Серия | `data-filter-series` | `series` checkbox |
| Цена / вес / голова / баланс | `data-filter-acc`, `data-range` | range + inputs |
| Ручка / материал / струны | `data-filter-acc` | checkbox / radio |

**Series map (`BRAND_SERIES`):** babolat, head, wilson, yonex, tecnifibre, prince, prokennex.

**Сортировка** (`data-catalog-sort`): `default`, `expensive`, `cheap`, `az`, `za` — **только UI**.

### Mobile filters sheet

`#filters-sheet` — DOM `[data-catalog-filters]` переносится в bottom sheet через JS. Grid товаров: **2 колонки**.

### Scripts

```
base.css + home/styles.css + catalog/styles.css + common.js + catalog/main.js
```

### Все section slugs

`tennis`, `tennis-adult`, `tennis-kids`, `tennis-balls`, `tennis-bags`, `tennis-strings`, `tennis-acc`, `tennis-stringing`, `gift-cards`, `padel`, `padel-rackets`, `padel-balls`, `padel-bags`, `padel-shoes`, `padel-acc`, `table`, `table-rackets`, `table-rubbers`, `table-balls`, `table-tables`, `table-acc`, `badminton`, `badminton-rackets`, `badminton-shuttle`, `badminton-strings`, `badminton-bags`, `badminton-shoes`, `shoes`, `shoes-men`, `shoes-women`, `shoes-kids`, `apparel`, `apparel-men`, `apparel-women`, `apparel-kids`, `other`, `squash`, `squash-rackets`, `squash-balls`, `squash-shoes`, `beach-tennis`, `beach-rackets`, `beach-balls`, `beach-bags`, `pickleball`, `pickle-rackets`, `pickle-balls`, `pickle-acc`

---

## 9. Страница поиска — **НОВОЕ**

`pages/search/index.html` — отдельная страница результатов.

```html
<main class="catalog-page search-page" data-search-page>
  <header class="search-page__head">
    <h1 class="search-page__title">Результаты поиска</h1>
    <p class="search-page__desc" data-search-page-desc hidden>
      По запросу «…» найдено N товаров
    </p>
  </header>
  <!-- фильтры / sort как в catalog, но без subnav -->
  <div data-search-empty hidden>Ничего не нашли + кнопки</div>
  <div data-search-results>...</div>
</main>
```

**URL:** `/search?q={query}` + optional `&brand=&series=`

**Отличия от catalog:**
- Нет `section` в URL
- `[data-catalog-subnav]` не используется
- `[data-search-page-clear]` → редирект на главную
- Проверка результатов через `window.worSearchIndex.hasResults(q)`

**Типографика (`search/styles.css`):**
- `.search-page__head` — `padding-inline: 16px`
- Title: Manrope 500, 20px
- Desc: 12px, line-height 20px

**Scripts:** `common.js` + `catalog/main.js` + `search/main.js`

---

## 10. Карточка товара (PDP)

### Одно фото

JS: если `[data-gallery-image]` ≤ 1 → класс `product-gallery--single`.

```css
.product-gallery--single .product-gallery__thumbs-col,
.product-gallery--single .product-gallery__arrow,
.product-gallery--single .product-gallery__dots { display: none; }
```

Эталон: `pages/product/single.html`.

### Крошки (без «Каталог»)

`Главная` → `Большой теннис` (text) → `Взрослые ракетки` (link `?section=tennis-adult`) → brand → product.

### Key data-attrs

- `[data-product-gallery]`, `[data-gallery-thumb]`, `[data-gallery-prev/next]`
- `[data-product-qty]`, `[data-product-tabs]`, `[data-tab=description|specs|delivery]`
- `[data-product-buy-bar]`, `[data-product-stores-list]` ← заполняется из contacts-source

---

## 11. Product Card (component)

```html
<li class="product-card">
  <div class="product-card__shell">
    <a class="product-card__link" href="..."></a>
    <div class="product-card__media">
      <span class="badge badge--new|badge--sale">...</span>
      <button class="product-card__fav" aria-pressed="false">...</button>
      <img ... />
    </div>
    <div class="product-card__body">...</div>
  </div>
  <button class="btn product-card__cart">В корзину</button>
</li>
```

Grid override: `.products--grid` в `catalog/styles.css`.

---

## 12. Валидация форм — **НОВОЕ**

`shared/js/validation.js` → `window.FormValidation`.

Подключать на: login, register, profile, checkout.

| Метод | Правила |
|-------|---------|
| `validateText` | required, anti-XSS (`<script>`, `javascript:`, `on*=`) |
| `validateRuEmail` | домены `.ru`, `.рф`, `.xn--p1ai` |
| `validateRuPhone` | +7/7/8 → `+7XXXXXXXXXX` |
| `validatePassword` | min **8** символов |
| `validateLoginIdentity` | email ИЛИ phone |

**Разметка поля:**
```html
<div class="auth-field" data-field="email">
  <input ... />
  <p class="auth-field__error" data-field-error hidden></p>
</div>
```
Invalid: `.is-invalid` на `[data-field]`.

**Регистрация (`auth.js`):**
- Кнопка «Зарегистрироваться» **всегда активна**
- Без галочки `agreement` → ошибка «Необходимо принять условия»

**Laravel:** дублировать правила в `FormRequest`.

---

## 13. Корзина и оформление

### Cart (`pages/cart/`)
- `[data-cart-count]`, `[data-unit-price]`, `[data-cart-minus/plus/delete]`
- `[data-cart-summary-*]` — пересчёт client-side
- `?empty` → `.cart-page--empty`

### Checkout (`pages/checkout/`)
- `[data-checkout-form]` — name, phone, email, delivery, payment, address, privacy
- Phone mask: `+7 (999) 999-99-99`
- `?success=1` → `.checkout-page--success`
- Validation через `FormValidation`

---

## 14. Личный кабинет

| Страница | data-attr | Scripts |
|----------|-----------|---------|
| login | `data-login-form` | validation.js + auth.js |
| register | `data-register-form` | validation.js + auth.js |
| orders | `data-account-page` | main.js |
| profile | `data-profile-form`, `data-password-form` | validation.js + main.js |

### Logout modal (mobile) — **НОВОЕ**

- Desktop: `[data-logout-modal]` — `.account-logout-modal`
- Mobile: `[data-logout-sheet]` — bottom sheet на базе `.contacts-sheet`
- **Mobile стили:** на всю ширину, без крестика, текст по центру, кнопки на всю ширину
- JS: `querySelectorAll("[data-logout-confirm]")` — все кнопки подтверждения

---

## 15. Shared JS API

| Init | Файл |
|------|------|
| `initNavMenus`, `initCatalogSidebar`, `initSearch`, `initMobileHeader` | common.js |
| `initContactsSheet`, `initFavorites`, `initCart` | common.js |
| `initFooterBottom`, `initFooterCatalogLinks` | common.js |

```js
window.worFavorites = { getCount, setCount, increment, decrement, syncBadges }
window.worCart = { getCount, setCount, increment, syncBadges }
window.worSearchIndex = { hasResults, buildResultsUrl }
window.worSearch = { close, render, openIdle, syncPanel }
window.FormValidation = { validateText, validateRuEmail, ... }
```

**localStorage keys:** `wor-fav-count`, `wor-cart-count` → в Laravel заменить на session/API.

---

## 16. Подключение CSS/JS по страницам

| Страница | CSS | JS |
|----------|-----|-----|
| Все | `base.css` | `common.js` |
| home | `home/styles.css` | `home/main.js` |
| catalog | `home/styles.css`, `catalog/styles.css` | `catalog/main.js` |
| search | + `search/styles.css` | + `search/main.js` |
| product | `home/styles.css`, `product/styles.css` | `product/main.js` |
| cart | `home/styles.css`, `cart/styles.css` | `cart/main.js` |
| checkout | `checkout/styles.css` | `validation.js`, `checkout/main.js` |
| account auth | `account/auth.css` | `validation.js`, `auth.js` |
| account | `account/styles.css` | `validation.js`, `account/main.js` |
| favorites | `home/styles.css`, `favorites/styles.css` | `favorites/main.js` |
| gift-cards | `product/styles.css`, `gift-cards/styles.css` | `product/main.js`, `gift-cards/main.js` |
| info pages | page-specific CSS | `common.js` only |

---

## 17. Чеклист для Blade

### Layout / shared
- [ ] Extract 9 shared partials (сейчас ~1500 строк дублируются на каждой странице)
- [ ] `--container: 1840px`; убрать хардкод `1648px`
- [ ] Подключить `base.css`, `common.js` на всех страницах

### Footer
- [ ] Desktop: brand column (logo → social → phone → email)
- [ ] Desktop: 4 nav columns × 2 sections
- [ ] Mobile: accordion по разделам каталога
- [ ] **Static `footer-bottom` partial** (copyright + legal links)
- [ ] Logo footer: 140×28

### Header / Search
- [ ] Search form `[data-search-form]` + suggest markup hooks
- [ ] Mobile search overlay + CSS vars для keyboard
- [ ] Badges `[data-fav-badge]`, `[data-cart-badge]`

### Navigation
- [ ] Mega-menu с реальными `href` на `?section=&brand=`
- [ ] Catalog sidebar partial + все `<template>` с href (или JS fallback)
- [ ] Sidebar: desktop click → navigate, mobile branch → drill / section title + leaf links → navigate, **close btn visible at depth 1–2**
- [ ] Tabbar mobile

### Catalog
- [ ] Route `/catalog?section=&brand=&series=`
- [ ] `CATALOG_SECTIONS` data из backend (title, crumbs, subnav, brands)
- [ ] Filters UI + **server-side фильтрация**
- [ ] Mobile brand/series tags `[data-brand-tags]`, `[data-series-tags]`
- [ ] Filters sheet mobile
- [ ] Breadcrumbs без «Каталог»

### Search
- [ ] Route `/search?q=`
- [ ] Page template `search-page`
- [ ] API вместо mock `SEARCH_INDEX`

### Forms
- [ ] `validation.js` + Blade FormRequest с теми же правилами
- [ ] Register: agreement checkbox validation

### Product
- [ ] `product-gallery--single` condition
- [ ] Breadcrumbs без «Каталог»
- [ ] Stores list from contacts partial

### Account
- [ ] Logout modal desktop + sheet mobile

---

## 18. Ограничения прототипа (backend должен заменить)

| Область | Сейчас | Нужно в Laravel |
|---------|--------|-----------------|
| Фильтры / sort | UI only | Query builder + pagination |
| Search | Mock `SEARCH_INDEX` | Full-text / Elasticsearch |
| Cart / favorites count | localStorage | Session / DB |
| Footer / sidebar links | частично JS maps | `@foreach` из config/DB |
| Auth forms | demo redirects | реальные routes + validation |
| Product listing | статичный HTML | `@foreach($products)` |
| Согласие на обработку ПД | `href="#"` | реальный route |

---

## 19. Локальный просмотр

```bash
python3 -m http.server 8767 --bind 0.0.0.0
# http://127.0.0.1:8767/pages/home/
# http://127.0.0.1:8767/pages/catalog/?section=tennis-adult
# http://127.0.0.1:8767/pages/search/?q=babolat
```

---

## 20. Приоритет миграции

1. **Layout + partials** — убрать дублирование HTML
2. **Footer + footer-bottom + nav links** — статические href
3. **Catalog page** — section/brand/series routing + product loop
4. **Catalog sidebar** — один partial, href в templates
5. **Search** — page + API
6. **Validation** — FormRequest
7. **Cart / favorites / checkout** — backend integration
8. **Mobile search + filters sheet** — JS уже готов, нужна только разметка
