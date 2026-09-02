function qs(selector, root = document) {
  return root.querySelector(selector);
}

function qsa(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}

const CATALOG_SECTIONS = {
  tennis: {
    title: "Большой теннис",
    crumbs: [{ label: "Большой теннис", current: true }],
    subnav: [
      { label: "Взрослые ракетки", section: "tennis-adult" },
      { label: "Детские ракетки", section: "tennis-kids" },
      { label: "Теннисные мячи", section: "tennis-balls" },
      { label: "Сумки. Рюкзаки. Чехлы", section: "tennis-bags" },
      { label: "Теннисные струны", section: "tennis-strings" },
      { label: "Аксессуары", section: "tennis-acc" },
      { label: "Натяжка струн", section: "tennis-stringing" },
      { label: "Подарочные сертификаты", section: "gift-cards" },
    ],
    brands: ["Babolat", "Head", "Prince", "Pro Kennex", "Tecnifibre", "Wilson", "Yonex", "7/6"],
    series: false,
  },
  "tennis-adult": {
    title: "Взрослые ракетки",
    crumbs: [
      { label: "Большой теннис" },
      { label: "Взрослые ракетки", current: true },
    ],
    subnav: [
      { label: "Взрослые ракетки", section: "tennis-adult" },
      { label: "Детские ракетки", section: "tennis-kids" },
      { label: "Теннисные мячи", section: "tennis-balls" },
      { label: "Сумки. Рюкзаки. Чехлы", section: "tennis-bags" },
      { label: "Теннисные струны", section: "tennis-strings" },
      { label: "Аксессуары", section: "tennis-acc" },
      { label: "Натяжка струн", section: "tennis-stringing" },
      { label: "Подарочные сертификаты", section: "gift-cards" },
    ],
    brands: ["Babolat", "Head", "Prince", "Pro Kennex", "Tecnifibre", "Wilson", "Yonex", "7/6"],
    series: true,
  },
  "tennis-kids": {
    title: "Детские ракетки",
    crumbs: [
      { label: "Большой теннис" },
      { label: "Детские ракетки", current: true },
    ],
    subnav: [
      { label: "Взрослые ракетки", section: "tennis-adult" },
      { label: "Детские ракетки", section: "tennis-kids" },
      { label: "Теннисные мячи", section: "tennis-balls" },
      { label: "Сумки. Рюкзаки. Чехлы", section: "tennis-bags" },
      { label: "Теннисные струны", section: "tennis-strings" },
      { label: "Аксессуары", section: "tennis-acc" },
    ],
    brands: ["Babolat", "Head", "Pro Kennex", "Tecnifibre", "Tour Spin", "Wilson", "Yonex", "7/6"],
    series: false,
  },
  "tennis-balls": {
    title: "Теннисные мячи",
    crumbs: [
      { label: "Большой теннис" },
      { label: "Теннисные мячи", current: true },
    ],
    subnav: [
      { label: "Взрослые ракетки", section: "tennis-adult" },
      { label: "Детские ракетки", section: "tennis-kids" },
      { label: "Теннисные мячи", section: "tennis-balls" },
      { label: "Сумки. Рюкзаки. Чехлы", section: "tennis-bags" },
      { label: "Теннисные струны", section: "tennis-strings" },
    ],
    brands: ["7/6", "Diadem", "Head", "Robin Soderling", "Tecnifibre", "Wilson"],
    series: false,
  },
  "tennis-bags": {
    title: "Сумки. Рюкзаки. Чехлы",
    crumbs: [
      { label: "Большой теннис" },
      { label: "Сумки. Рюкзаки. Чехлы", current: true },
    ],
    subnav: [
      { label: "Взрослые ракетки", section: "tennis-adult" },
      { label: "Детские ракетки", section: "tennis-kids" },
      { label: "Теннисные мячи", section: "tennis-balls" },
      { label: "Сумки. Рюкзаки. Чехлы", section: "tennis-bags" },
      { label: "Теннисные струны", section: "tennis-strings" },
    ],
    brands: ["Babolat", "Head", "Joma", "Kawasaki", "Kumpoo", "Neva Sport", "Tecnifibre", "Wilson"],
    series: false,
  },
  "tennis-strings": {
    title: "Теннисные струны",
    crumbs: [
      { label: "Большой теннис" },
      { label: "Теннисные струны", current: true },
    ],
    subnav: [
      { label: "Взрослые ракетки", section: "tennis-adult" },
      { label: "Теннисные струны", section: "tennis-strings" },
      { label: "Натяжка струн", section: "tennis-stringing" },
    ],
    brands: ["Babolat", "Diadem", "Head", "Luxilon", "MSV", "Robin Soderling", "String Projekt", "Tecnifibre", "Wilson"],
    series: false,
  },
  "tennis-acc": {
    title: "Аксессуары",
    crumbs: [
      { label: "Большой теннис" },
      { label: "Аксессуары", current: true },
    ],
    subnav: [
      { label: "Взрослые ракетки", section: "tennis-adult" },
      { label: "Аксессуары", section: "tennis-acc" },
      { label: "Подарочные сертификаты", section: "gift-cards" },
    ],
    brands: [],
    series: false,
  },
  "tennis-stringing": {
    title: "Натяжка струн",
    crumbs: [
      { label: "Большой теннис" },
      { label: "Натяжка струн", current: true },
    ],
    subnav: [
      { label: "Теннисные струны", section: "tennis-strings" },
      { label: "Натяжка струн", section: "tennis-stringing" },
    ],
    brands: [],
    series: false,
  },
  "gift-cards": {
    title: "Подарочные сертификаты",
    crumbs: [{ label: "Подарочные сертификаты", current: true }],
    subnav: [{ label: "Подарочные сертификаты", section: "gift-cards" }],
    brands: [],
    series: false,
  },
  padel: {
    title: "Падел",
    crumbs: [{ label: "Падел", current: true }],
    subnav: [
      { label: "Ракетки для падел", section: "padel-rackets" },
      { label: "Мячи", section: "padel-balls" },
      { label: "Сумки и чехлы", section: "padel-bags" },
      { label: "Обувь для падел", section: "padel-shoes" },
      { label: "Аксессуары", section: "padel-acc" },
    ],
    brands: ["Bullpadel", "Babolat", "Head", "Wilson", "Adidas"],
    series: false,
  },
  "padel-rackets": {
    title: "Ракетки для падел",
    crumbs: [
      { label: "Падел", href: "?section=padel" },
      { label: "Ракетки для падел", current: true },
    ],
    subnav: [
      { label: "Ракетки для падел", section: "padel-rackets" },
      { label: "Мячи", section: "padel-balls" },
      { label: "Сумки и чехлы", section: "padel-bags" },
      { label: "Обувь для падел", section: "padel-shoes" },
      { label: "Аксессуары", section: "padel-acc" },
    ],
    brands: ["Bullpadel", "Babolat", "Head", "Wilson", "Adidas"],
    series: false,
  },
  "padel-balls": {
    title: "Мячи для падел",
    crumbs: [
      { label: "Падел", href: "?section=padel" },
      { label: "Мячи", current: true },
    ],
    subnav: [
      { label: "Ракетки для падел", section: "padel-rackets" },
      { label: "Мячи", section: "padel-balls" },
      { label: "Сумки и чехлы", section: "padel-bags" },
    ],
    brands: ["Head", "Bullpadel", "Wilson"],
    series: false,
  },
  "padel-bags": {
    title: "Сумки и чехлы",
    crumbs: [
      { label: "Падел", href: "?section=padel" },
      { label: "Сумки и чехлы", current: true },
    ],
    subnav: [
      { label: "Ракетки для падел", section: "padel-rackets" },
      { label: "Сумки и чехлы", section: "padel-bags" },
    ],
    brands: ["Bullpadel", "Babolat", "Head"],
    series: false,
  },
  "padel-shoes": {
    title: "Обувь для падел",
    crumbs: [
      { label: "Падел", href: "?section=padel" },
      { label: "Обувь для падел", current: true },
    ],
    subnav: [
      { label: "Ракетки для падел", section: "padel-rackets" },
      { label: "Обувь для падел", section: "padel-shoes" },
    ],
    brands: ["Asics", "Babolat", "Head"],
    series: false,
  },
  "padel-acc": {
    title: "Аксессуары",
    crumbs: [
      { label: "Падел", href: "?section=padel" },
      { label: "Аксессуары", current: true },
    ],
    subnav: [
      { label: "Ракетки для падел", section: "padel-rackets" },
      { label: "Аксессуары", section: "padel-acc" },
    ],
    brands: [],
    series: false,
  },
  table: {
    title: "Настольный теннис",
    crumbs: [{ label: "Настольный теннис", current: true }],
    subnav: [
      { label: "Ракетки", section: "table-rackets" },
      { label: "Накладки", section: "table-rubbers" },
      { label: "Мячи", section: "table-balls" },
      { label: "Столы", section: "table-tables" },
      { label: "Аксессуары", section: "table-acc" },
    ],
    brands: ["Butterfly", "Donic", "Stiga", "Yasaka", "Tibhar"],
    series: false,
  },
  "table-rackets": {
    title: "Ракетки",
    crumbs: [
      { label: "Настольный теннис", href: "?section=table" },
      { label: "Ракетки", current: true },
    ],
    subnav: [
      { label: "Ракетки", section: "table-rackets" },
      { label: "Накладки", section: "table-rubbers" },
      { label: "Мячи", section: "table-balls" },
      { label: "Столы", section: "table-tables" },
      { label: "Аксессуары", section: "table-acc" },
    ],
    brands: ["Butterfly", "Donic", "Stiga", "Yasaka"],
    series: false,
  },
  "table-rubbers": {
    title: "Накладки",
    crumbs: [
      { label: "Настольный теннис", href: "?section=table" },
      { label: "Накладки", current: true },
    ],
    subnav: [
      { label: "Ракетки", section: "table-rackets" },
      { label: "Накладки", section: "table-rubbers" },
      { label: "Мячи", section: "table-balls" },
    ],
    brands: ["Butterfly", "Donic", "Tibhar"],
    series: false,
  },
  "table-balls": {
    title: "Мячи",
    crumbs: [
      { label: "Настольный теннис", href: "?section=table" },
      { label: "Мячи", current: true },
    ],
    subnav: [
      { label: "Ракетки", section: "table-rackets" },
      { label: "Мячи", section: "table-balls" },
    ],
    brands: ["Butterfly", "Donic", "Stiga"],
    series: false,
  },
  "table-tables": {
    title: "Столы",
    crumbs: [
      { label: "Настольный теннис", href: "?section=table" },
      { label: "Столы", current: true },
    ],
    subnav: [
      { label: "Столы", section: "table-tables" },
      { label: "Аксессуары", section: "table-acc" },
    ],
    brands: ["Donic", "Stiga"],
    series: false,
  },
  "table-acc": {
    title: "Аксессуары",
    crumbs: [
      { label: "Настольный теннис", href: "?section=table" },
      { label: "Аксессуары", current: true },
    ],
    subnav: [
      { label: "Ракетки", section: "table-rackets" },
      { label: "Аксессуары", section: "table-acc" },
    ],
    brands: [],
    series: false,
  },
  badminton: {
    title: "Бадминтон",
    crumbs: [{ label: "Бадминтон", current: true }],
    subnav: [
      { label: "Ракетки", section: "badminton-rackets" },
      { label: "Воланы", section: "badminton-shuttle" },
      { label: "Струны", section: "badminton-strings" },
      { label: "Сумки", section: "badminton-bags" },
      { label: "Обувь", section: "badminton-shoes" },
    ],
    brands: ["Yonex", "Li-Ning", "Kawasaki", "Victor", "RSL", "Asics"],
    series: false,
  },
  "badminton-rackets": {
    title: "Ракетки",
    crumbs: [
      { label: "Бадминтон", href: "?section=badminton" },
      { label: "Ракетки", current: true },
    ],
    subnav: [
      { label: "Ракетки", section: "badminton-rackets" },
      { label: "Воланы", section: "badminton-shuttle" },
      { label: "Струны", section: "badminton-strings" },
      { label: "Сумки", section: "badminton-bags" },
      { label: "Обувь", section: "badminton-shoes" },
    ],
    brands: ["Yonex", "Li-Ning", "Kawasaki", "Victor"],
    series: false,
  },
  "badminton-shuttle": {
    title: "Воланы",
    crumbs: [
      { label: "Бадминтон", href: "?section=badminton" },
      { label: "Воланы", current: true },
    ],
    subnav: [
      { label: "Ракетки", section: "badminton-rackets" },
      { label: "Воланы", section: "badminton-shuttle" },
    ],
    brands: ["Yonex", "Li-Ning", "RSL"],
    series: false,
  },
  "badminton-strings": {
    title: "Струны",
    crumbs: [
      { label: "Бадминтон", href: "?section=badminton" },
      { label: "Струны", current: true },
    ],
    subnav: [
      { label: "Ракетки", section: "badminton-rackets" },
      { label: "Струны", section: "badminton-strings" },
    ],
    brands: ["Yonex", "Li-Ning"],
    series: false,
  },
  "badminton-bags": {
    title: "Сумки",
    crumbs: [
      { label: "Бадминтон", href: "?section=badminton" },
      { label: "Сумки", current: true },
    ],
    subnav: [
      { label: "Ракетки", section: "badminton-rackets" },
      { label: "Сумки", section: "badminton-bags" },
    ],
    brands: ["Yonex", "Li-Ning", "Kawasaki"],
    series: false,
  },
  "badminton-shoes": {
    title: "Обувь",
    crumbs: [
      { label: "Бадминтон", href: "?section=badminton" },
      { label: "Обувь", current: true },
    ],
    subnav: [
      { label: "Ракетки", section: "badminton-rackets" },
      { label: "Обувь", section: "badminton-shoes" },
    ],
    brands: ["Yonex", "Li-Ning", "Asics"],
    series: false,
  },
  shoes: {
    title: "Теннисная обувь",
    crumbs: [{ label: "Теннисная обувь", current: true }],
    subnav: [
      { label: "Мужская обувь", section: "shoes-men" },
      { label: "Женская обувь", section: "shoes-women" },
      { label: "Детская обувь", section: "shoes-kids" },
      { label: "Все кроссовки", section: "shoes" },
    ],
    brands: ["Asics", "Nike", "Adidas", "Wilson", "Babolat", "Head"],
    series: false,
  },
  "shoes-men": {
    title: "Мужская обувь",
    crumbs: [
      { label: "Теннисная обувь", href: "?section=shoes" },
      { label: "Мужская обувь", current: true },
    ],
    subnav: [
      { label: "Мужская обувь", section: "shoes-men" },
      { label: "Женская обувь", section: "shoes-women" },
      { label: "Детская обувь", section: "shoes-kids" },
    ],
    brands: ["Asics", "Nike", "Adidas", "Wilson", "Babolat"],
    series: false,
  },
  "shoes-women": {
    title: "Женская обувь",
    crumbs: [
      { label: "Теннисная обувь", href: "?section=shoes" },
      { label: "Женская обувь", current: true },
    ],
    subnav: [
      { label: "Мужская обувь", section: "shoes-men" },
      { label: "Женская обувь", section: "shoes-women" },
      { label: "Детская обувь", section: "shoes-kids" },
    ],
    brands: ["Asics", "Nike", "Adidas", "Wilson"],
    series: false,
  },
  "shoes-kids": {
    title: "Детская обувь",
    crumbs: [
      { label: "Теннисная обувь", href: "?section=shoes" },
      { label: "Детская обувь", current: true },
    ],
    subnav: [
      { label: "Мужская обувь", section: "shoes-men" },
      { label: "Женская обувь", section: "shoes-women" },
      { label: "Детская обувь", section: "shoes-kids" },
    ],
    brands: ["Asics", "Nike", "Head"],
    series: false,
  },
  apparel: {
    title: "Теннисная одежда",
    crumbs: [{ label: "Теннисная одежда", current: true }],
    subnav: [
      { label: "Мужская одежда", section: "apparel-men" },
      { label: "Женская одежда", section: "apparel-women" },
      { label: "Детская одежда", section: "apparel-kids" },
    ],
    brands: [],
    series: false,
  },
  "apparel-men": {
    title: "Мужская одежда",
    crumbs: [
      { label: "Теннисная одежда", href: "?section=apparel" },
      { label: "Мужская одежда", current: true },
    ],
    subnav: [
      { label: "Мужская одежда", section: "apparel-men" },
      { label: "Женская одежда", section: "apparel-women" },
      { label: "Детская одежда", section: "apparel-kids" },
    ],
    brands: [],
    series: false,
  },
  "apparel-women": {
    title: "Женская одежда",
    crumbs: [
      { label: "Теннисная одежда", href: "?section=apparel" },
      { label: "Женская одежда", current: true },
    ],
    subnav: [
      { label: "Мужская одежда", section: "apparel-men" },
      { label: "Женская одежда", section: "apparel-women" },
      { label: "Детская одежда", section: "apparel-kids" },
    ],
    brands: [],
    series: false,
  },
  "apparel-kids": {
    title: "Детская одежда",
    crumbs: [
      { label: "Теннисная одежда", href: "?section=apparel" },
      { label: "Детская одежда", current: true },
    ],
    subnav: [
      { label: "Мужская одежда", section: "apparel-men" },
      { label: "Женская одежда", section: "apparel-women" },
      { label: "Детская одежда", section: "apparel-kids" },
    ],
    brands: [],
    series: false,
  },
  other: {
    title: "Другие виды спорта",
    crumbs: [{ label: "Другие виды спорта", current: true }],
    subnav: [
      { label: "Сквош", section: "squash" },
      { label: "Пляжный теннис", section: "beach-tennis" },
      { label: "Пиклбол", section: "pickleball" },
    ],
    brands: [],
    series: false,
  },
  squash: {
    title: "Сквош",
    crumbs: [
      { label: "Другие виды спорта", href: "?section=other" },
      { label: "Сквош", current: true },
    ],
    subnav: [
      { label: "Ракетки", section: "squash-rackets" },
      { label: "Мячи", section: "squash-balls" },
      { label: "Обувь", section: "squash-shoes" },
    ],
    brands: [],
    series: false,
  },
  "squash-rackets": {
    title: "Ракетки",
    crumbs: [
      { label: "Сквош", href: "?section=squash" },
      { label: "Ракетки", current: true },
    ],
    subnav: [
      { label: "Ракетки", section: "squash-rackets" },
      { label: "Мячи", section: "squash-balls" },
      { label: "Обувь", section: "squash-shoes" },
    ],
    brands: [],
    series: false,
  },
  "squash-balls": {
    title: "Мячи",
    crumbs: [
      { label: "Сквош", href: "?section=squash" },
      { label: "Мячи", current: true },
    ],
    subnav: [
      { label: "Ракетки", section: "squash-rackets" },
      { label: "Мячи", section: "squash-balls" },
    ],
    brands: [],
    series: false,
  },
  "squash-shoes": {
    title: "Обувь",
    crumbs: [
      { label: "Сквош", href: "?section=squash" },
      { label: "Обувь", current: true },
    ],
    subnav: [
      { label: "Ракетки", section: "squash-rackets" },
      { label: "Обувь", section: "squash-shoes" },
    ],
    brands: [],
    series: false,
  },
  "beach-tennis": {
    title: "Пляжный теннис",
    crumbs: [
      { label: "Другие виды спорта", href: "?section=other" },
      { label: "Пляжный теннис", current: true },
    ],
    subnav: [
      { label: "Ракетки", section: "beach-rackets" },
      { label: "Мячи", section: "beach-balls" },
      { label: "Сумки", section: "beach-bags" },
    ],
    brands: [],
    series: false,
  },
  "beach-rackets": {
    title: "Ракетки",
    crumbs: [
      { label: "Пляжный теннис", href: "?section=beach-tennis" },
      { label: "Ракетки", current: true },
    ],
    subnav: [
      { label: "Ракетки", section: "beach-rackets" },
      { label: "Мячи", section: "beach-balls" },
      { label: "Сумки", section: "beach-bags" },
    ],
    brands: [],
    series: false,
  },
  "beach-balls": {
    title: "Мячи",
    crumbs: [
      { label: "Пляжный теннис", href: "?section=beach-tennis" },
      { label: "Мячи", current: true },
    ],
    subnav: [
      { label: "Ракетки", section: "beach-rackets" },
      { label: "Мячи", section: "beach-balls" },
    ],
    brands: [],
    series: false,
  },
  "beach-bags": {
    title: "Сумки",
    crumbs: [
      { label: "Пляжный теннис", href: "?section=beach-tennis" },
      { label: "Сумки", current: true },
    ],
    subnav: [
      { label: "Ракетки", section: "beach-rackets" },
      { label: "Сумки", section: "beach-bags" },
    ],
    brands: [],
    series: false,
  },
  pickleball: {
    title: "Пиклбол",
    crumbs: [
      { label: "Другие виды спорта", href: "?section=other" },
      { label: "Пиклбол", current: true },
    ],
    subnav: [
      { label: "Ракетки", section: "pickle-rackets" },
      { label: "Мячи", section: "pickle-balls" },
      { label: "Аксессуары", section: "pickle-acc" },
    ],
    brands: [],
    series: false,
  },
  "pickle-rackets": {
    title: "Ракетки",
    crumbs: [
      { label: "Пиклбол", href: "?section=pickleball" },
      { label: "Ракетки", current: true },
    ],
    subnav: [
      { label: "Ракетки", section: "pickle-rackets" },
      { label: "Мячи", section: "pickle-balls" },
      { label: "Аксессуары", section: "pickle-acc" },
    ],
    brands: [],
    series: false,
  },
  "pickle-balls": {
    title: "Мячи",
    crumbs: [
      { label: "Пиклбол", href: "?section=pickleball" },
      { label: "Мячи", current: true },
    ],
    subnav: [
      { label: "Ракетки", section: "pickle-rackets" },
      { label: "Мячи", section: "pickle-balls" },
    ],
    brands: [],
    series: false,
  },
  "pickle-acc": {
    title: "Аксессуары",
    crumbs: [
      { label: "Пиклбол", href: "?section=pickleball" },
      { label: "Аксессуары", current: true },
    ],
    subnav: [
      { label: "Ракетки", section: "pickle-rackets" },
      { label: "Аксессуары", section: "pickle-acc" },
    ],
    brands: [],
    series: false,
  },
};

function brandSlug(name) {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}

function brandLabelFromSlug(slug, brands) {
  if (!slug) return "";
  const match = brands.find((name) => brandSlug(name) === slug);
  return match || slug;
}

const BRAND_SERIES = {
  babolat: [
    { slug: "pure-aero", label: "Pure Aero" },
    { slug: "pure-drive", label: "Pure Drive" },
    { slug: "pure-strike", label: "Pure Strike" },
    { slug: "boost", label: "Boost" },
    { slug: "evoke", label: "Evoke" },
  ],
  head: [
    { slug: "burn", label: "Burn" },
    { slug: "extreme", label: "Extreme" },
    { slug: "gravity", label: "Gravity" },
    { slug: "prestige", label: "Prestige" },
    { slug: "radical", label: "Radical" },
    { slug: "speed", label: "Speed" },
  ],
  wilson: [
    { slug: "blade", label: "Blade" },
    { slug: "clash", label: "Clash" },
    { slug: "pro-staff", label: "Pro Staff" },
    { slug: "ultra", label: "Ultra" },
  ],
  yonex: [
    { slug: "ezone", label: "EZONE" },
    { slug: "vcore", label: "VCORE" },
    { slug: "percept", label: "PERCEPT" },
  ],
  tecnifibre: [
    { slug: "tfight", label: "T-Fight" },
    { slug: "tflash", label: "T-Flash" },
  ],
  prince: [
    { slug: "beast", label: "Beast" },
    { slug: "phantom", label: "Phantom" },
    { slug: "twist", label: "Twist" },
  ],
  prokennex: [{ slug: "ki", label: "Ki" }],
};

function getSeriesForBrand(brandSlugValue) {
  if (!brandSlugValue) return [];
  return BRAND_SERIES[brandSlugValue] || [];
}

function parseSeriesParam(value) {
  if (!value) return [];
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function buildCatalogUrl({ section, brand, series = [] }) {
  const params = new URLSearchParams();
  if (section) params.set("section", section);
  if (brand) params.set("brand", brand);
  if (series.length) params.set("series", series.join(","));
  const qs = params.toString();
  return qs ? `?${qs}` : window.location.pathname;
}

function renderSeriesOptions(form, brandSlugValue, selectedSeries = []) {
  const seriesBlock = qs("[data-filter-series]", form);
  if (!seriesBlock) return;

  const body = qs("[data-series-options]", seriesBlock) || qs(".filter-acc__body", seriesBlock);
  if (!body) return;

  const items = getSeriesForBrand(brandSlugValue);
  if (!items.length) {
    body.innerHTML = "";
    seriesBlock.hidden = true;
    return;
  }

  body.innerHTML = items
    .map(({ slug, label }) => {
      const checked = selectedSeries.includes(slug) ? "checked" : "";
      return `<label class="filter-option"><input type="checkbox" name="series" value="${slug}" ${checked} /> <span>${label}</span></label>`;
    })
    .join("");
  seriesBlock.hidden = false;
  seriesBlock.open = true;
}

function updateCatalogBrandPresentation(sectionKey, brand, selectedSeries = []) {
  const config = CATALOG_SECTIONS[sectionKey] || CATALOG_SECTIONS["tennis-adult"];
  const brandLabel = brand ? brandLabelFromSlug(brand, config.brands) : "";

  document.title = `${brandLabel || config.title} — Мир ракеток`;

  const titleEl = qs("[data-catalog-title]");
  if (titleEl) titleEl.textContent = brandLabel || config.title;

  const crumbs = qs("[data-catalog-crumbs]");
  if (crumbs) {
    const sectionHref = `?section=${sectionKey}`;
    const items = [
      `<li class="breadcrumbs__item"><a href="../home/">Главная</a></li>`,
      ...config.crumbs.map((crumb, index) => {
        const isLastConfigCrumb = index === config.crumbs.length - 1;
        if (crumb.current && brand && isLastConfigCrumb) {
          return `<li class="breadcrumbs__item"><a href="${sectionHref}">${crumb.label}</a></li>`;
        }
        if (crumb.current) {
          return `<li class="breadcrumbs__item"><span aria-current="page">${crumb.label}</span></li>`;
        }
        if (crumb.href) {
          return `<li class="breadcrumbs__item"><a href="${crumb.href}">${crumb.label}</a></li>`;
        }
        return `<li class="breadcrumbs__item"><span>${crumb.label}</span></li>`;
      }),
    ];

    if (brand) {
      items.push(`<li class="breadcrumbs__item"><span aria-current="page">${brandLabel}</span></li>`);
    }

    crumbs.innerHTML = items.join("");
  }

  renderMobileTags(config, sectionKey, brand, selectedSeries);

  if (catalogFilterUI) catalogFilterUI.rebuild();
}

function handleBrandFilterChange(form, input) {
  const params = new URLSearchParams(window.location.search);
  const sectionKey = params.get("section") || "tennis-adult";
  const brand = (input.value || "").toLowerCase();

  if (isMobileCatalog()) {
    window.location.href = brand
      ? buildCatalogUrl({ section: sectionKey, brand })
      : buildCatalogUrl({ section: sectionKey });
    return;
  }

  window.history.replaceState(
    {},
    "",
    brand ? buildCatalogUrl({ section: sectionKey, brand }) : buildCatalogUrl({ section: sectionKey })
  );

  syncSeriesVisibility(form);
  updateCatalogBrandPresentation(sectionKey, brand, []);
  updateCatalogFilterUI(form);
}

function refreshMobileTagsFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const sectionKey = params.get("section") || "tennis-adult";
  const brand = (params.get("brand") || "").toLowerCase();
  const selectedSeries = parseSeriesParam(params.get("series"));
  const config = CATALOG_SECTIONS[sectionKey] || CATALOG_SECTIONS["tennis-adult"];
  renderMobileTags(config, sectionKey, brand, selectedSeries);
}

function applyMobileBrandSelection(sectionKey, brand, selectedSeries = []) {
  window.history.pushState(
    {},
    "",
    buildCatalogUrl({ section: sectionKey, brand, series: selectedSeries })
  );

  const form = qs("[data-filters-form]");
  if (form) {
    qsa('input[name="brand"]', form).forEach((input) => {
      input.checked = brand ? input.value === brand : input.value === "";
    });
    syncSeriesVisibility(form);
  }

  updateCatalogBrandPresentation(sectionKey, brand, selectedSeries);
  if (form) updateCatalogFilterUI(form);
}

function renderMobileTags(config, sectionKey, brand, selectedSeries = []) {
  const root = qs("[data-catalog-mobile-tags]");
  const brandGrid = qs("[data-brand-tags]");
  const seriesGrid = qs("[data-series-tags]");
  if (!root || !brandGrid || !seriesGrid) return;

  const showTags = isMobileCatalog() && config.brands.length > 0;
  if (!showTags) {
    root.hidden = true;
    return;
  }

  root.hidden = false;
  root.removeAttribute("hidden");

  if (brand && config.series) {
    brandGrid.hidden = true;
    brandGrid.innerHTML = "";
    seriesGrid.hidden = false;
    seriesGrid.removeAttribute("hidden");

    const items = getSeriesForBrand(brand);
    seriesGrid.innerHTML = items
      .map(({ slug, label }) => {
        const active = selectedSeries.includes(slug);
        return `<button type="button" class="catalog-tag${active ? " is-active" : ""}" data-series-tag="${slug}">${label}</button>`;
      })
      .join("");
    return;
  }

  if (brand) {
    brandGrid.hidden = true;
    seriesGrid.hidden = true;
    root.hidden = true;
    return;
  }

  brandGrid.hidden = false;
  brandGrid.removeAttribute("hidden");
  seriesGrid.hidden = true;
  brandGrid.innerHTML = config.brands
    .map((name) => {
      const slug = brandSlug(name);
      return `<button type="button" class="catalog-tag" data-brand-tag="${slug}" data-section="${sectionKey}">${name}</button>`;
    })
    .join("");
}

function initMobileTags() {
  const root = qs("[data-catalog-mobile-tags]");
  if (!root) return;

  root.addEventListener("click", (event) => {
    const brandBtn = event.target.closest("[data-brand-tag]");
    if (brandBtn) {
      if (!isMobileCatalog()) return;
      applyMobileBrandSelection(
        brandBtn.dataset.section || "tennis-adult",
        brandBtn.dataset.brandTag,
        []
      );
      return;
    }

    const seriesBtn = event.target.closest("[data-series-tag]");
    if (!seriesBtn) return;

    const params = new URLSearchParams(window.location.search);
    const sectionKey = params.get("section") || "tennis-adult";
    const brand = (params.get("brand") || "").toLowerCase();
    if (!brand) return;

    const slug = seriesBtn.dataset.seriesTag;
    const current = parseSeriesParam(params.get("series"));
    const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
    applyMobileBrandSelection(sectionKey, brand, next);
  });

  window.addEventListener("popstate", refreshMobileTagsFromUrl);
}

function initCatalogState() {
  const params = new URLSearchParams(window.location.search);
  const sectionKey = params.get("section") || "tennis-adult";
  const brand = (params.get("brand") || "").toLowerCase();
  const selectedSeries = parseSeriesParam(params.get("series"));
  const config = CATALOG_SECTIONS[sectionKey] || CATALOG_SECTIONS["tennis-adult"];

  updateCatalogBrandPresentation(sectionKey, brand, selectedSeries);

  const subnav = qs("[data-catalog-subnav]");
  if (subnav) {
    subnav.innerHTML = config.subnav
      .map((item) => {
        const active = item.section === sectionKey;
        const href = `?section=${item.section}`;
        return `<li><a class="catalog-subnav__link${active ? " is-active" : ""}" href="${href}"${
          active ? ' aria-current="page"' : ""
        }>${item.label}</a></li>`;
      })
      .join("");
  }

  const brandBox = qs("[data-brand-options]");
  if (brandBox) {
    const options = [
      `<label class="filter-option"><input type="radio" name="brand" value="" ${
        brand ? "" : "checked"
      } /> <span>Все</span></label>`,
      ...config.brands.map((name) => {
        const slug = brandSlug(name);
        const checked = brand && brand === slug ? "checked" : "";
        return `<label class="filter-option"><input type="radio" name="brand" value="${slug}" ${checked} /> <span>${name}</span></label>`;
      }),
    ];
    brandBox.innerHTML = options.join("");
  }

  const seriesBlock = qs("[data-filter-series]");
  const form = qs("[data-filters-form]");
  if (form && brand && config.series) {
    renderSeriesOptions(form, brand, selectedSeries);
  } else if (seriesBlock) {
    seriesBlock.hidden = !(config.series && brand);
  }

  const brandAcc = qs("[data-filter-brand]");
  if (brandAcc) {
    brandAcc.hidden = config.brands.length === 0;
  }
}

const QUICK_FILTER_SECTIONS = [
  { key: "series", label: "Серия", selector: "[data-filter-series]" },
  { key: "price", label: "Цена (₽)", selector: '[data-filter-acc="price"]' },
  { key: "weight", label: "Вес без струн (гр)", selector: '[data-filter-acc="weight"]' },
  { key: "head", label: "Размер головы (см²)", selector: '[data-filter-acc="head"]' },
  { key: "balance", label: "Баланс (мм)", selector: '[data-filter-acc="balance"]' },
  { key: "grip", label: "Размер ручки", selector: '[data-filter-acc="grip"]' },
  { key: "material", label: "Материал", selector: '[data-filter-acc="material"]' },
  { key: "strings", label: "Наличие струн", selector: '[data-filter-acc="strings"]' },
];

let activeQuickFilter = null;
let catalogFilterUI = null;

function updateRangeFill(group) {
  const inputs = qsa('input[type="number"]', group);
  if (inputs.length < 2) return;

  const [minNum, maxNum] = inputs;
  const min = Number(minNum.min);
  const max = Number(maxNum.max);
  const span = max - min || 1;
  const minVal = Number(minNum.value);
  const maxVal = Number(maxNum.value);
  const minPct = ((minVal - min) / span) * 100;
  const maxPct = ((maxVal - min) / span) * 100;
  const sliders = qs(".filter-range__sliders", group);

  sliders?.style.setProperty("--range-min", `${minPct}%`);
  sliders?.style.setProperty("--range-max", `${maxPct}%`);
}

function attachRangeSync(group, onChange) {
  const inputs = qsa('input[type="number"]', group);
  const ranges = qsa('input[type="range"]', group);
  if (inputs.length < 2 || ranges.length < 2) return;

  const [minNum, maxNum] = inputs;
  const [minRange, maxRange] = ranges;

  function clamp() {
    let minVal = Number(minNum.value);
    let maxVal = Number(maxNum.value);
    const min = Number(minNum.min);
    const max = Number(maxNum.max);
    if (Number.isNaN(minVal)) minVal = min;
    if (Number.isNaN(maxVal)) maxVal = max;
    minVal = Math.max(min, Math.min(minVal, max));
    maxVal = Math.max(min, Math.min(maxVal, max));
    if (minVal > maxVal) minVal = maxVal;
    minNum.value = String(minVal);
    maxNum.value = String(maxVal);
    if (!minRange.disabled) minRange.value = String(minVal);
    if (!maxRange.disabled) maxRange.value = String(maxVal);
    updateRangeFill(group);
    onChange?.();
  }

  minNum.addEventListener("change", clamp);
  maxNum.addEventListener("change", clamp);
  minRange.addEventListener("input", () => {
    if (Number(minRange.value) > Number(maxRange.value)) {
      minRange.value = maxRange.value;
    }
    minNum.value = minRange.value;
    updateRangeFill(group);
    onChange?.();
  });
  maxRange.addEventListener("input", () => {
    if (Number(maxRange.value) < Number(minRange.value)) {
      maxRange.value = minRange.value;
    }
    maxNum.value = maxRange.value;
    updateRangeFill(group);
    onChange?.();
  });

  updateRangeFill(group);
  group.__updateRangeFill = () => updateRangeFill(group);
}

function syncFilterBodies(fromBody, toBody) {
  const fromInputs = qsa("input", fromBody);
  const toInputs = qsa("input", toBody);

  fromInputs.forEach((fromInput, index) => {
    const toInput = toInputs[index];
    if (!toInput || fromInput.type !== toInput.type) return;

    if (fromInput.type === "radio" || fromInput.type === "checkbox") {
      toInput.checked = fromInput.checked;
    } else {
      toInput.value = fromInput.value;
    }
    toInput.disabled = fromInput.disabled;
  });

  qsa("[data-range]", toBody).forEach((group) => group.__updateRangeFill?.());
}

function syncSeriesVisibility(form) {
  const series = qs("[data-filter-series]", form);
  if (!series) return;
  const params = new URLSearchParams(window.location.search);
  const sectionKey = params.get("section") || "tennis-adult";
  const brand = (params.get("brand") || "").toLowerCase();
  const selectedSeries = parseSeriesParam(params.get("series"));
  const config = CATALOG_SECTIONS[sectionKey] || CATALOG_SECTIONS["tennis-adult"];
  if (!config.series || !brand) {
    series.hidden = true;
    qsa('input[name="series"]', series).forEach((input) => {
      input.checked = false;
    });
    return;
  }

  renderSeriesOptions(form, brand, selectedSeries);
}

function pushQuickCloneToSource() {
  if (!activeQuickFilter?.clone || !activeQuickFilter.body) return;
  syncFilterBodies(activeQuickFilter.clone, activeQuickFilter.body);
  qsa("[data-range]", activeQuickFilter.body).forEach((group) => group.__updateRangeFill?.());
}

function syncOpenQuickCloneFromSource() {
  if (!activeQuickFilter?.clone || !activeQuickFilter.body) return;
  syncFilterBodies(activeQuickFilter.body, activeQuickFilter.clone);
}

function formatFilterNumber(value) {
  return Number(value).toLocaleString("ru-RU");
}

function isRangeFilterActive(form, key) {
  const group = qs(`[data-range="${key}"]`, form);
  if (!group) return false;
  const [minNum, maxNum] = qsa('input[type="number"]', group);
  return minNum.value !== minNum.defaultValue || maxNum.value !== maxNum.defaultValue;
}

function getRangeFilterLabel(form, key) {
  const group = qs(`[data-range="${key}"]`, form);
  if (!group) return "";
  const [minNum, maxNum] = qsa('input[type="number"]', group);
  const unit = group.dataset.unit?.trim() || "";
  const suffix = unit ? ` ${unit}` : "";
  return `${formatFilterNumber(minNum.value)} – ${formatFilterNumber(maxNum.value)}${suffix}`;
}

function resetRangeFilter(form, key) {
  const group = qs(`[data-range="${key}"]`, form);
  if (!group) return;
  const nums = qsa('input[type="number"]', group);
  const ranges = qsa('input[type="range"]:not(:disabled)', group);
  nums.forEach((num, index) => {
    num.value = num.defaultValue;
    if (ranges[index]) ranges[index].value = num.defaultValue;
  });
  const updateRangeFill = group.__updateRangeFill;
  if (updateRangeFill) updateRangeFill();
}

function getQuickFilterCount(form, key) {
  if (key === "brand") {
    const selected = qs('input[name="brand"]:checked', form);
    return selected?.value ? 1 : 0;
  }
  if (key === "series") {
    return qsa('input[name="series"]:checked', form).length;
  }
  if (["price", "weight", "head", "balance"].includes(key)) {
    return isRangeFilterActive(form, key) ? 1 : 0;
  }
  if (key === "grip") {
    return qsa('input[name="grip"]:checked', form).length;
  }
  if (key === "material") {
    return qsa('input[name="material"]:checked', form).length;
  }
  if (key === "strings") {
    return qs('input[name="strings"]:checked', form) ? 1 : 0;
  }
  return 0;
}

function isQuickFilterActive(form, key) {
  return getQuickFilterCount(form, key) > 0;
}

function collectActiveFilters(form) {
  const items = [];

  const brand = qs('input[name="brand"]:checked', form);
  if (brand?.value) {
    items.push({
      id: "brand",
      label: brand.closest("label")?.querySelector("span")?.textContent?.trim() || "Бренд",
      clear: () => {
        const all = qs('input[name="brand"][value=""]', form);
        if (all) {
          all.checked = true;
          all.dispatchEvent(new Event("change", { bubbles: true }));
        }
      },
    });
  }

  qsa('input[name="series"]:checked', form).forEach((input) => {
    items.push({
      id: `series-${input.value}`,
      label: input.closest("label")?.querySelector("span")?.textContent?.trim() || input.value,
      clear: () => {
        input.checked = false;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      },
    });
  });

  ["price", "weight", "head", "balance"].forEach((key) => {
    if (!isRangeFilterActive(form, key)) return;
    items.push({
      id: key,
      label: getRangeFilterLabel(form, key),
      clear: () => {
        resetRangeFilter(form, key);
        form.dispatchEvent(new Event("change", { bubbles: true }));
      },
    });
  });

  qsa('input[name="grip"]:checked', form).forEach((input) => {
    items.push({
      id: `grip-${input.value}`,
      label: `Размер ручки ${input.value}`,
      clear: () => {
        input.checked = false;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      },
    });
  });

  qsa('input[name="material"]:checked', form).forEach((input) => {
    items.push({
      id: `material-${input.value}`,
      label: input.closest("label")?.querySelector("span")?.textContent?.trim() || input.value,
      clear: () => {
        input.checked = false;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      },
    });
  });

  const strings = qs('input[name="strings"]:checked', form);
  if (strings) {
    items.push({
      id: "strings",
      label: strings.closest("label")?.querySelector("span")?.textContent?.trim() || "Струны",
      clear: () => {
        strings.checked = false;
        strings.dispatchEvent(new Event("change", { bubbles: true }));
      },
    });
  }

  return items;
}

function updateCatalogFilterUI(form) {
  if (!form) form = qs("[data-filters-form]");
  if (!form) return;

  qsa("[data-filter-select]", qs("[data-quick-filters]") || document).forEach((select) => {
    const key = select.dataset.filterSelect;
    const label = select.dataset.filterLabel || "";
    const textEl = qs(".catalog-filter-select__text", select);
    const countEl = qs(".catalog-filter-select__count", select);
    const count = getQuickFilterCount(form, key);

    select.classList.toggle("is-active", count > 0);
    if (textEl) textEl.textContent = label;
    if (countEl) {
      countEl.textContent = String(count);
      countEl.hidden = count === 0;
    }
  });

  const activeRoot = qs("[data-active-filters]");
  const activeList = qs("[data-active-filters-list]");
  if (!activeRoot || !activeList) return;

  const items = collectActiveFilters(form);
  activeRoot.hidden = items.length === 0;
  activeList.innerHTML = items
    .map(
      (item) => `
        <li class="catalog-active-filters__chip">
          <span>${item.label}</span>
          <button class="catalog-active-filters__chip-remove" type="button" aria-label="Убрать фильтр ${item.label}" data-active-filter-remove="${item.id}"><img src="../../shared/images/icons/close.svg" alt="" width="14" height="14" /></button>
        </li>
      `
    )
    .join("");

  qsa("[data-active-filter-remove]", activeList).forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = items.find((entry) => entry.id === btn.dataset.activeFilterRemove);
      item?.clear();
      updateCatalogFilterUI(form);
    });
  });
}

function isMobileCatalog() {
  return window.matchMedia("(max-width: 860px)").matches;
}

function closeQuickFilterDropdown() {
  if (!activeQuickFilter) return;

  pushQuickCloneToSource();
  const { select, mode, panel, bodyEl, sheet } = activeQuickFilter;

  if (mode === "mobile" && sheet && bodyEl) {
    sheet.classList.remove("is-open");
    document.documentElement.style.overflow = "";
    window.setTimeout(() => {
      if (!sheet.classList.contains("is-open")) {
        sheet.hidden = true;
        bodyEl.innerHTML = "";
      }
    }, 280);
  } else if (panel) {
    panel.innerHTML = "";
    panel.hidden = true;
  }

  select.classList.remove("is-open");
  qs(".catalog-filter-select__trigger", select)?.setAttribute("aria-expanded", "false");
  activeQuickFilter = null;
}

function toggleQuickFilterDropdown(select, section) {
  if (activeQuickFilter?.select === select) {
    closeQuickFilterDropdown();
    return;
  }
  closeQuickFilterDropdown();

  const sourceBody = qs(".filter-acc__body", section);
  const panel = qs(".catalog-filter-select__panel", select);
  const trigger = qs(".catalog-filter-select__trigger", select);
  const form = qs("[data-filters-form]");
  if (!sourceBody || !panel || !trigger || !form) return;

  const clone = sourceBody.cloneNode(true);
  clone.classList.add("filter-acc__body--clone");
  syncFilterBodies(sourceBody, clone);

  const syncToSource = (event) => {
    pushQuickCloneToSource();
    if (event?.target?.name === "brand") {
      closeQuickFilterDropdown();
      handleBrandFilterChange(form, event.target);
      return;
    }
    if (event?.target?.name === "series") {
      syncSeriesVisibility(form);
    }
    updateCatalogFilterUI(form);
  };

  qsa("[data-range]", clone).forEach((group) => attachRangeSync(group, syncToSource));
  clone.addEventListener("change", syncToSource);
  clone.addEventListener("input", syncToSource);

  if (isMobileCatalog()) {
    const sheet = qs("#filter-select-sheet");
    const bodyEl = qs("[data-filter-select-body]", sheet);
    const titleEl = qs("[data-filter-select-title]", sheet);
    if (!sheet || !bodyEl) return;

    bodyEl.innerHTML = "";
    bodyEl.appendChild(clone);
    if (titleEl) titleEl.textContent = select.dataset.filterLabel || "";

    sheet.hidden = false;
    requestAnimationFrame(() => sheet.classList.add("is-open"));
    document.documentElement.style.overflow = "hidden";
    activeQuickFilter = { select, section, body: sourceBody, clone, bodyEl, sheet, mode: "mobile" };
  } else {
    panel.appendChild(clone);
    panel.hidden = false;
    activeQuickFilter = { select, section, body: sourceBody, clone, panel, mode: "desktop" };
  }

  select.classList.add("is-open");
  trigger.setAttribute("aria-expanded", "true");
}

function buildQuickFilters(form) {
  const container = qs("[data-quick-filters]");
  if (!container || !form) return;

  closeQuickFilterDropdown();
  container.innerHTML = "";

  QUICK_FILTER_SECTIONS.forEach(({ key, label, selector }) => {
    const section = qs(selector, form);
    if (!section || section.hidden) return;
    if (isMobileCatalog() && (key === "brand" || key === "series")) return;

    const select = document.createElement("div");
    select.className = "catalog-filter-select";
    select.dataset.filterSelect = key;
    select.dataset.filterLabel = label;
    select.innerHTML = `
      <button class="catalog-filter-select__trigger" type="button" aria-expanded="false" aria-haspopup="listbox">
        <span class="catalog-filter-select__text">${label}</span>
        <span class="catalog-filter-select__count" hidden>0</span>
        <img src="../../shared/images/icons/down-muted.svg" alt="" width="16" height="16" />
      </button>
      <div class="catalog-filter-select__panel" hidden></div>
    `;

    qs(".catalog-filter-select__trigger", select)?.addEventListener("click", () => {
      toggleQuickFilterDropdown(select, section);
    });

    container.appendChild(select);
  });

  updateCatalogFilterUI(form);
}

function initQuickFilters() {
  const form = qs("[data-filters-form]");
  if (!form) return;

  buildQuickFilters(form);

  document.addEventListener("click", (event) => {
    if (event.target.closest(".catalog-filter-select")) return;
    if (event.target.closest("#filter-select-sheet")) return;
    closeQuickFilterDropdown();
  });

  qsa("[data-filter-select-close]", qs("#filter-select-sheet") || document).forEach((btn) => {
    btn.addEventListener("click", closeQuickFilterDropdown);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeQuickFilterDropdown();
  });

  qs("[data-active-filters-clear]")?.addEventListener("click", () => {
    qs("[data-filters-clear]")?.click();
  });

  catalogFilterUI = {
    rebuild: () => buildQuickFilters(form),
    update: () => updateCatalogFilterUI(form),
  };
}

function initCatalogSort() {
  const root = qs("[data-catalog-sort]");
  if (!root) return;

  const trigger = qs("[data-sort-trigger]", root);
  const menu = qs("[data-sort-menu]", root);
  const labelEl = qs("[data-sort-label]", root);
  if (!trigger || !menu) return;

  function close() {
    root.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
    menu.hidden = true;
  }

  function open() {
    root.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
    menu.hidden = false;
  }

  trigger.addEventListener("click", () => {
    if (menu.hidden) open();
    else close();
  });

  qsa('input[type="radio"][data-sort]', menu).forEach((input) => {
    input.addEventListener("change", () => {
      if (!input.checked) return;
      const optionLabel = input.closest("label")?.querySelector("span")?.textContent?.trim();
      if (optionLabel && labelEl) labelEl.textContent = optionLabel;
      close();
    });
  });

  document.addEventListener("click", (event) => {
    if (!root.contains(event.target)) close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
}

function syncSeriesToUrl(form) {
  const params = new URLSearchParams(window.location.search);
  const section = params.get("section") || "tennis-adult";
  const brand = (params.get("brand") || "").toLowerCase();
  const series = qsa('input[name="series"]:checked', form).map((item) => item.value);
  window.history.replaceState({}, "", buildCatalogUrl({ section, brand, series }));
  renderMobileTags(
    CATALOG_SECTIONS[section] || CATALOG_SECTIONS["tennis-adult"],
    section,
    brand,
    series
  );
}

function initCatalogFilters() {
  const forms = qsa("[data-filters-form]");
  if (!forms.length) return;

  forms.forEach((form) => {
    syncSeriesVisibility(form);
    qsa("[data-range]", form).forEach((group) => attachRangeSync(group));

    form.addEventListener("change", (event) => {
      if (event.target.name === "brand") {
        handleBrandFilterChange(form, event.target);
        return;
      }
      if (event.target.name === "series") {
        syncSeriesToUrl(form);
      }
      if (activeQuickFilter?.body?.contains(event.target)) {
        syncOpenQuickCloneFromSource();
      }
      updateCatalogFilterUI(form);
    });
    form.addEventListener("input", (event) => {
      if (activeQuickFilter?.body?.contains(event.target)) {
        syncOpenQuickCloneFromSource();
      }
      updateCatalogFilterUI(form);
    });

    const clearBtn = qs("[data-filters-clear]", form.closest("[data-catalog-filters]"));
    clearBtn?.addEventListener("click", () => {
      form.reset();
      qsa("[data-range]", form).forEach((group) => {
        const nums = qsa('input[type="number"]', group);
        const ranges = qsa('input[type="range"]:not(:disabled)', group);
        nums.forEach((num, i) => {
          num.value = num.defaultValue;
          if (ranges[i]) ranges[i].value = num.defaultValue;
        });
        updateRangeFill(group);
      });
      const allBrand = qs('input[name="brand"][value=""]', form);
      if (allBrand) allBrand.checked = true;
      syncSeriesVisibility(form);
      const params = new URLSearchParams(window.location.search);
      params.delete("brand");
      params.delete("series");
      const section = params.get("section") || "tennis-adult";
      window.location.href = buildCatalogUrl({ section });
      closeQuickFilterDropdown();
      if (catalogFilterUI) catalogFilterUI.rebuild();
      updateCatalogFilterUI(form);
    });
  });
}

function initFiltersSheet() {
  const sheet = qs("#filters-sheet");
  const aside = qs("[data-catalog-aside]");
  const body = qs("[data-filters-sheet-body]", sheet);
  const openBtns = qsa("[data-filters-open]");
  const closeBtns = qsa("[data-filters-close]", sheet);
  if (!sheet || !aside || !body || !openBtns.length) return;

  const source = qs("[data-catalog-filters]", aside);
  if (!source) return;

  let placedInSheet = false;

  function placeInSheet() {
    if (placedInSheet) return;
    body.appendChild(source);
    placedInSheet = true;
  }

  function placeInAside() {
    if (!placedInSheet) return;
    aside.appendChild(source);
    placedInSheet = false;
  }

  function open() {
    closeQuickFilterDropdown();
    placeInSheet();
    sheet.hidden = false;
    requestAnimationFrame(() => sheet.classList.add("is-open"));
    document.documentElement.style.overflow = "hidden";
  }

  function close() {
    sheet.classList.remove("is-open");
    document.documentElement.style.overflow = "";
    window.setTimeout(() => {
      sheet.hidden = true;
      if (!window.matchMedia("(max-width: 860px)").matches) placeInAside();
    }, 280);
  }

  openBtns.forEach((btn) => btn.addEventListener("click", open));
  closeBtns.forEach((btn) => btn.addEventListener("click", close));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && sheet.classList.contains("is-open")) close();
  });

  window.addEventListener("resize", () => {
    closeQuickFilterDropdown();
    refreshMobileTagsFromUrl();
    if (catalogFilterUI) catalogFilterUI.rebuild();
    if (!window.matchMedia("(max-width: 860px)").matches) {
      sheet.classList.remove("is-open");
      sheet.hidden = true;
      document.documentElement.style.overflow = "";
      placeInAside();
    }
  });
}

initCatalogState();
initCatalogSort();
initCatalogFilters();
initQuickFilters();
initMobileTags();
initFiltersSheet();
refreshMobileTagsFromUrl();
