function initHeroSlider(root) {
  const slides = qsa(".hero__slide", root);
  if (slides.length < 2) return;

  const prevBtn = qs(".hero__arrow--prev", root);
  const nextBtn = qs(".hero__arrow--next", root);
  const dots = qsa(".hero__dot", root);
  let index = slides.findIndex((slide) => slide.classList.contains("is-active"));
  if (index < 0) index = 0;

  function goTo(nextIndex) {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    dots.forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle("is-active", active);
      if (active) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });
  }

  slides.forEach((slide, i) => {
    slide.setAttribute("aria-hidden", String(i !== index));
  });

  prevBtn?.addEventListener("click", () => goTo(index - 1));
  nextBtn?.addEventListener("click", () => goTo(index + 1));
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => goTo(i));
  });
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

qsa(".hero__slider").forEach(initHeroSlider);
qsa("[data-products-carousel]").forEach(initProductsCarousel);
