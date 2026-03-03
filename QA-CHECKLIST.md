# AZOURANE Theme QA Checklist

Run through these mandatory tests to ensure the theme operates reliably at native Shopify standards.

## 1. Add to Cart Core Reliability
- [ ] **1) Add to cart works on product page with JS enabled**: Click ATC -> Spinner appears -> Slide-out Drawer opens -> Cart count increases.
- [ ] **2) Add to cart works on product page with JS disabled**: Disable JS in DevTools -> Click ATC -> Page navigates directly to `/cart` -> Product is present.

## 2. AJAX Drawer UI State
- [ ] **3) Cart drawer opens and shows item after add**: Slide-out is right-aligned, overlay mask appears, and focus is trapped properly.
- [ ] **4) Quantity update works in cart drawer**: Increasing/decreasing item quantities triggers an API reload, fading the drawer momentarily without full page refresh.
- [ ] **5) Remove works in cart drawer**: Setting quantity to 0 removes the item cleanly.
- [ ] **6) Free shipping threshold progress bar**: Changing item quantities dynamically updates the free shipping logic (adds green completed state when $79 limit is reached).

## 3. Product & Merchandising Tests
- [ ] **7) Collection quick add works**: Quick add button from `store-featured-collection` triggers Add To Cart successfully.
- [ ] **8) Drops Hub (october-remnants) truthful scarcity**: Verify that the "Only X remaining" badge only renders if inventory count is under the configurable threshold AND tracked by Shopify. Ensures compliance with non-fake timer policies.

## 4. General Native Tests
- [ ] **9) Search works**: Search template properly loops over `search.results` returning products.
- [ ] **10) Mobile viewpost**: The 1400px page grid breaks logically on `< 768px` viewports natively in `base.css`.
