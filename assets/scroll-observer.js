document.addEventListener('DOMContentLoaded', function () {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  // Target sections and common elements
  const elementsToAnimate = document.querySelectorAll('.shopify-section, .product-card, .collection-card, .article-card, .reveal-text, .master-grid__item, .master-carousel__item');

  elementsToAnimate.forEach(el => {
    el.classList.add('reveal-on-scroll');
    observer.observe(el);
  });
});
