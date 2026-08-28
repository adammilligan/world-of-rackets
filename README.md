# Изменения 21 августа

Документ для разработчика Blade-шаблонов. Ниже — правки, которые нужно перенести в Laravel.

Эталон вёрстки:
- `pages/home/index.html` — футер, category-card → раздел
- `pages/product/index.html` / `in-store.html` / `single.html` — PDP + крошки
- `pages/catalog/index.html` — **каталог раздела** (эталон «Взрослые ракетки») + фильтры
- `pages/catalog/styles.css` / `pages/catalog/main.js`
- `shared/css/base.css`
- `pages/home/styles.css` (карточки товаров)
- `pages/product/styles.css`
- `pages/product/main.js`

---

## 1. Ширина большого экрана: 1920

Было: `--container: 1648px` (+ gutters 40×2 = **1728**).  
Стало: `--container: 1840px` (+ gutters 40×2 = **1920**).

```css
:root {
  --container: 1840px;
  --page-gutter: 40px;
}
```

В шаблонах/CSS убрать хардкод `1648px` — везде `var(--container)` (hero, категории, карусели на главной).

У `.footer` на desktop padding: `87px var(--page-gutter) 145px` (вместо фиксированных `155px` по бокам).

---

## 2. Футер — новая структура (desktop)

### Бренд-колонка (порядок сверху вниз)

1. Логотип компании (`.logo--footer`, img **140×28**)
2. Иконки мессенджеров (`.footer__social`)
3. Телефон (`.footer__phone`, шрифт **20px**)
4. Почта (`.footer__email`, шрифт **20px**)

Обёртки `.footer__contacts` / `.footer__contacts-top` больше не нужны.

```html
<div class="footer__brand">
  <a class="logo logo--footer" href="{{ route('home') }}" aria-label="Мир ракеток — на главную">
    <img class="logo__img" src="..." alt="" width="140" height="28" />
  </a>
  <div class="footer__social">
    <!-- telegram, bip -->
  </div>
  <a class="footer__phone" href="tel:...">+7 (919) 773-40-33</a>
  <a class="footer__email" href="mailto:...">info@mirraketok.ru</a>
</div>
```

### Навигация — 4 колонки × 2 ряда разделов

Вместо старых «Информация» + «Каталог» — развёрнутые разделы. Каждая `.footer__col` содержит две `.footer__section` (верхний и нижний ряд).

| Колонка | Верх | Низ |
|---------|------|-----|
| 1 | Информация | Бадминтон |
| 2 | Большой теннис | Теннисная обувь |
| 3 | Падел | Теннисная одежда |
| 4 | Настольный теннис | Другие виды спорта |

Полный список ссылок — в эталоне `pages/home/index.html` (блок `.footer__desktop`).

Каркас:

```html
<nav class="footer__nav" aria-label="Разделы сайта">
  <div class="footer__col">
    <section class="footer__section">
      <h3 class="footer__heading">Информация</h3>
      <ul class="footer__links">...</ul>
    </section>
    <section class="footer__section">
      <h3 class="footer__heading">Бадминтон</h3>
      <ul class="footer__links">...</ul>
    </section>
  </div>
  <!-- ещё 3 колонки -->
</nav>
```

### Типографика и сетка (CSS уже в `base.css`)

- Заголовки разделов `.footer__heading` — **18px** / weight 600
- Ссылки `.footer__links a` — **14px** / weight 500, line-height 18px
- Телефон / почта — **20px** / weight 600
- Логотип футера — **140×28** (`.logo--footer .logo__img`)
- Сетка: 5 равных колонок (бренд + 4 раздела), `column-gap: 24px`, `row-gap: 64px`
- Нижний ряд разделов выровнен по одной линии (`grid-auto-flow: column`, у `.footer__nav` и `.footer__col` — `display: contents`)
- Фон desktop: `var(--color-footer)` (`#eef6a7`)

---

## 3. Футер — mobile

### Фон

На `≤860px` у `.footer` фон **белый** (`var(--color-bg)`), не лаймовый.

### Аккордеоны

После блока «Контакты» (`data-contacts-source`) — не «Доставка / Гарантия / О нас», а разделы каталога:

1. Информация  
2. Большой теннис  
3. Падел  
4. Настольный теннис  
5. Бадминтон  
6. Теннисная обувь  
7. Теннисная одежда  
8. Другие виды спорта  

В теле аккордеона — список `.footer__links` (те же ссылки, что в desktop).  
Блок контактов (`data-contacts-source`) **не трогать** — от него зависит модалка контактов и страница «в магазине».

---

## 4. Карточка товара — одно фото

Если у товара **одна** фотография, слева нет колонки миниатюр и скролла.

### JS (`pages/product/main.js`)

В `initProductGallery`: если `[data-gallery-image]` ≤ 1, на корне галереи вешается класс `product-gallery--single`, дальше инициализация слайдера/миниатюр не нужна.

### CSS (`pages/product/styles.css`)

```css
.product-gallery--single {
  grid-template-columns: minmax(0, 1fr);
}

.product-gallery--single .product-gallery__thumbs-col,
.product-gallery--single .product-gallery__arrow,
.product-gallery--single .product-gallery__dots {
  display: none;
}
```

В Blade: рендерить миниатюры / стрелки / точки только при `count($images) > 1` **или** оставить разметку и полагаться на JS+CSS (класс добавится сам).

### Превью в вёрстке

Файл `pages/product/single.html` — копия карточки товара с одним `data-gallery-image`.  
Нужен только для проверки вида без миниатюр; в Laravel отдельный шаблон не обязателен — достаточно условия по числу фото.

Открыть локально: `/pages/product/single.html`

---

## 5. Каталог раздела с фильтрами

Отдельная страница раздела (не хаб «всего каталога»). URL общего каталога **нет**.

Эталон: `pages/catalog/index.html` («Взрослые ракетки»).

### Навигация

```
Главная → (клик по разделу) → /catalog/ (страница раздела) → карточка товара
```

- Крошки на разделе: `Главная` → `Большой теннис` (текст) → `Взрослые ракетки` (current). **Без пункта «Каталог».**
- На PDP: убрать ссылку «Каталог»; «Взрослые ракетки» → route раздела.
- Category-card «Взрослые ракетки» на главной ведёт на страницу раздела.

### Desktop layout

Сетка: слева подрубрики + фильтры (~288px), справа H1 + сортировка + `ul.products.products--grid` (3 колонки).

Классы:
- `.catalog-layout` / `.catalog-aside` / `.catalog-main`
- `.catalog-subnav` — список подрубрик
- `.catalog-filters` / `.filter-acc` — аккордеоны фильтров
- `.catalog-sort` — dropdown сортировки
- `.products--grid` — переопределяет карусельный `.products` из home CSS

Фильтры (UI): бренд (radio) → при выборе появляется **Серия**; цена / вес / голова / баланс (range + inputs); размер ручки; материал; наличие струн; «Очистить фильтр».

### Mobile (≤860px)

- Сайдбар скрыт.
- Кнопка «Фильтры» открывает `.filters-sheet` (bottom sheet); DOM фильтров переносится в sheet через JS.
- Сетка 2 колонки.

### JS (`pages/catalog/main.js`)

- sort dropdown
- brand → show/hide series
- clear filters
- filters sheet open/close + move panel

Подключить: `base.css` + `home/styles.css` (карточки) + `catalog/styles.css` + `common.js` + `catalog/main.js`.

Открыть локально: `/pages/catalog/`

### Навигация с главной / mega-menu

| Клик | URL |
|------|-----|
| Пункт меню «Падел» | `?section=padel` |
| «Ракетки для падел» | `?section=padel-rackets` |
| Бренд (напр. Bullpadel) | `?section=padel-rackets&brand=bullpadel` |

`main.js` читает `section` + `brand` и обновляет заголовок, крошки, подрубрики и выбранный бренд.  
`.nav__trigger` — ссылки; на desktop меню по hover, клик ведёт в раздел.

---

## Чеклист для Blade

- [ ] `--container: 1840px`; убрать хардкод `1648px`
- [ ] Partial футера desktop: новая бренд-колонка (лого → мессенджеры → телефон → почта)
- [ ] Partial футера desktop: 4 колонки с двумя `.footer__section` в каждой
- [ ] Partial футера mobile: аккордеоны по разделам каталога; контакты без изменений
- [ ] Подключить обновлённый `base.css` (типографика, сетка, белый фон mobile)
- [ ] Страница товара: поддержка `product-gallery--single` (JS + CSS)
- [ ] Размеры логотипа футера: 140×28
- [ ] Шаблон каталога раздела (не общий `/catalog` index-хаб)
- [ ] Крошки без «Каталог»; ссылки раздел ↔ PDP
- [ ] Фильтры desktop + mobile sheet; `catalog/styles.css` + `catalog/main.js`
- [ ] Mega-menu / category-card → `section` + опционально `brand`

---

## Не менялось в этой итерации

- Модалка контактов, safe area, hover навбара (уже перенесены ранее)
- Tabbar, sidebar-каталог, корзина, избранное
- Логика `data-contacts-source` / contacts sheet
- Реальная серверная фильтрация/сортировка товаров (только UI)