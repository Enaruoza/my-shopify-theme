/* AZOURANE Global Javascript */

document.addEventListener('DOMContentLoaded', () => {
  initAjaxCart();
});

class CartAPI {
  static async add(formData) {
    const response = await fetch(`${window.routes.cart_add_url}.js`, {
      method: 'POST',
      body: formData
    });
    return response.json();
  }

  static async update(line, quantity) {
    const response = await fetch(`${window.routes.cart_change_url}.js`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: line, quantity: quantity })
    });
    return response.json();
  }

  static async fetchSection(sectionId) {
    const response = await fetch(`${window.routes.cart_url}?section_id=${sectionId}`);
    return response.text();
  }
}

function initAjaxCart() {
  const drawerContainer = document.getElementById('cart-drawer-container');
  if (!drawerContainer) return;

  // Listen for Add To Cart submits globally
  document.body.addEventListener('submit', async (e) => {
    const form = e.target;
    if (form.getAttribute('action') === window.routes.cart_add_url || form.action.includes(window.routes.cart_add_url)) {
      e.preventDefault();
      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) submitBtn.innerHTML = '<span class="loading-overlay__spinner"></span>';

      try {
        const formData = new FormData(form);
        await CartAPI.add(formData);
        await renderCartDrawer();
        openCartDrawer();
      } catch (err) {
        console.error('Failed to add to cart:', err);
      } finally {
        if (submitBtn) submitBtn.innerHTML = originalText;
      }
    }
  });

  // Delegate cart UI events globally to handle dynamically re-rendered HTML
  document.body.addEventListener('click', async (e) => {

    // Header cart icon triggers physical open
    if (e.target.closest('.header__cart-link')) {
      e.preventDefault();
      openCartDrawer();
    }

    // Close overlay or button clicks
    if (e.target.matches('.drawer-overlay') || e.target.closest('#CartDrawerClose') || e.target.closest('#CartDrawerContinue')) {
      closeCartDrawer();
    }

    // Quantity Plus/Minus buttons logic
    const qtyBtn = e.target.closest('.qty-btn');
    if (qtyBtn) {
      e.preventDefault();
      const input = qtyBtn.parentElement.querySelector('input');
      const line = input.dataset.line;
      let currentQty = parseInt(input.value);

      if (qtyBtn.classList.contains('plus')) currentQty++;
      if (qtyBtn.classList.contains('minus')) currentQty--;

      if (currentQty < 0) currentQty = 0;
      input.value = currentQty;

      await updateCartItem(line, currentQty);
    }
  });
}

async function renderCartDrawer() {
  const sectionId = 'main-cart-drawer';
  const container = document.getElementById('cart-drawer-container');

  if (!container) return;

  try {
    const html = await CartAPI.fetchSection(sectionId);
    if (html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      // We pluck the shopify section HTML to ensure we don't break wrapper
      const newDrawer = doc.getElementById('shopify-section-' + sectionId);
      if (newDrawer) {
        container.innerHTML = newDrawer.innerHTML;
      }
    }
  } catch (err) {
    console.error('Failed to render drawer section:', err);
  }
}

async function updateCartItem(lineKey, quantity) {
  const innerDrawer = document.getElementById('CartDrawerInner');
  if (innerDrawer) innerDrawer.style.opacity = '0.5';
  if (innerDrawer) innerDrawer.style.pointerEvents = 'none';

  try {
    await CartAPI.update(lineKey, quantity);
    await renderCartDrawer();
  } catch (err) {
    console.error('Update failed:', err);
  }

  // Opacity will be reset by the renderCartDrawer DOM replacement naturally.
}

function openCartDrawer() {
  document.documentElement.style.overflow = 'hidden'; // Lock background scrolling
  const drawer = document.getElementById('CartDrawer');
  const overlay = document.getElementById('CartDrawerOverlay');
  if (drawer) drawer.classList.add('is-active');
  if (overlay) overlay.classList.add('is-active');
}

function closeCartDrawer() {
  document.documentElement.style.overflow = ''; // Unlock background scrolling
  const drawer = document.getElementById('CartDrawer');
  const overlay = document.getElementById('CartDrawerOverlay');
  if (drawer) drawer.classList.remove('is-active');
  if (overlay) overlay.classList.remove('is-active');
}
