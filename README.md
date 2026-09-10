# Мир ракеток — changelog

Краткое описание изменений текущего коммита.

**Дата:** 10 сентября 2026

---

## Страница согласия / пользовательского соглашения

- Добавлена `pages/consent/` (`index.html` + `styles.css`)
- Ссылка в футере (`initFooterBottom`) ведёт на `/pages/consent/` вместо `#`
- Регистрация: «Пользовательское соглашение» → `../consent/`
- Checkout: политика ПД → `../privacy/`

---

## Поиск (suggest)

- Расширен mock `SEARCH_INDEX.brands` (Wilson, Head, Yonex, Tecnifibre, Bullpadel, Asics + синонимы)
- Бренды в suggest: матч по индексу + бренды из найденных товаров (`filterSearchBrands`)
- Нормализация запроса через `toLocaleLowerCase("ru-RU")`
- Типографика suggest: крупнее заголовки секций, товары (бренд + цена отдельно), ссылки категорий/брендов
- Класс `.search-suggest__link--brand` для брендов

---

## Header / nav / footer (UI)

- Header: вместо градиентных псевдоэлементов — `box-shadow`; на главной (с `.hero`) тень отключена
- Nav: прозрачный фон, высота `52px`, больший нижний padding
- Footer desktop: первая колонка шире (`minmax(14rem, 1fr)`), на узких экранах gap/телефоны компактнее
- Legal-ссылки: `line-height: 1.4`, underline offset `3px`

---

## Главная — мобильный скролл каруселей

- `touch-action: pan-x pan-y` у `.categories` и `.products-carousel__viewport`
- `initHorizontalScrollPassthrough`: вертикальный жест скроллит страницу, горизонтальный — карусель

---

## PDP — иконки характеристик

- Иконки: `spec-weight.png`, `spec-head.png`, `spec-balance.png`
- Модификаторы: `.product-specs__icon--weight|head|balance` на `index.html` и `single.html`

---

## Затронутые файлы

| Файл | Изменение |
|------|-----------|
| `pages/consent/*` | новая страница |
| `shared/js/common.js` | consent href, search brands/suggest |
| `shared/css/base.css` | header, nav, footer, suggest |
| `pages/home/main.js`, `styles.css` | scroll passthrough, header shadow |
| `pages/product/*` | иконки specs |
| `pages/account/register.html` | ссылка на consent |
| `pages/checkout/index.html` | ссылка на privacy |
| `shared/images/icons/spec-*.png` | новые ассеты |

---

## Локальный просмотр

```bash
python3 -m http.server 8767 --bind 0.0.0.0
# http://127.0.0.1:8767/pages/home/
# http://127.0.0.1:8767/pages/consent/
# http://127.0.0.1:8767/pages/product/
```
