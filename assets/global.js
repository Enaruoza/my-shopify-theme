document.addEventListener('DOMContentLoaded', () => {
  // Initialize minimal progressive enhancement
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
      body: JSON.stringify({ line, quantity })
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

  // Render initial drawer
  renderCartDrawer();

  // Listen for Add To Cart submits globally
  document.body.addEventListener('submit', async (e) => {
    const form = e.target;
    if (form.getAttribute('action') === window.routes.cart_add_url) {
      e.preventDefault();
      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if(submitBtn) submitBtn.innerHTML = '<div class="loading-overlay__spinner" style="width:20px;height:20px;display:inline-block"></div>';
      
      try {
        const formData = new FormData(form);
        await CartAPI.add(formData);
        await renderCartDrawer();
        openCartDrawer();
      } catch (err) {
        console.error('Failed to add to cart:', err);
      } finally {
        if(submitBtn) submitBtn.innerHTML = originalText;
      }
    }
  });

  // Delegate cart UI events
  document.body.addEventListener('click', async (e) => {
    // Drawer overlay close
    if (e.target.matches('.drawer-overlay') || e.target.closest('.cart-drawer__close')) {
      closeCartDrawer();
    }
    
    // Header cart icon
    if (e.target.closest('.header__cart-link')) {
      e.preventDefault();
      openCartDrawer();
    }
  });

  document.body.addEventListener('change', async (e) => {
    if (e.target.matches('.cart-drawer-qty')) {
      const line = e.target.dataset.line;
      const quantity = parseInt(e.target.value);
      await updateCartItem(line, quantity);
    }
  });
}

async function renderCartDrawer() {
  const sectionId = 'main-cart-drawer'; // We will build this section
  const container = document.getElementById('cart-drawer-container');
  try {
    const html = await CartAPI.fetchSection(sectionId);
    if(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
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
  const container = document.getElementById('cart-drawer-container');
  container.style.opacity = '0.5';
  container.style.pointerEvents = 'none';
  try {
    await CartAPI.update(lineKey, quantity);
    await renderCartDrawer();
  } catch (err) {
    console.error('Update failed:', err);
  } finally {
    container.style.opacity = '1';
    container.style.pointerEvents = 'auto';
  }
}

function openCartDrawer() {
  const drawer = document.querySelector('.cart-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  if (drawer) drawer.classList.add('is-active');
  if (overlay) overlay.classList.add('is-active');
}

function closeCartDrawer() {
  const drawer = document.querySelector('.cart-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  if (drawer) drawer.classList.remove('is-active');
  if (overlay) overlay.classList.remove('is-active');
}
