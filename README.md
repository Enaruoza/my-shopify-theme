# AZOURANE MOROCCAN COSMETICS - Official Shopify Theme

A premium, highly converting Online Store 2.0 Shopify theme built from scratch for AZOURANE. This theme uses standard OS 2.0 folder structures, is HTML-first with strictly additive JavaScript, and avoids heavy build steps for maximum reliability and performance.

## 1. How to Upload the Theme
1. Commit all files in this repository to the `main` branch.
2. In your Shopify Admin, go to **Online Store > Themes**.
3. Under "Theme library", click **Add Theme** and select **Connect from GitHub**.
4. Authorize Shopify to read your GitHub account and select this repository branch.
5. The theme will automatically sync and build.

## 2. Collections Setup
To power the Drops Hub and Drops Journey logic properly, you must create the following collections in Shopify Admin:
- **`core-stock`**: Add products like AMAAN Cleanser and AFOULKI Face Cream that are always pushed.
- **`october-remnants`**: Add remaining products from the previous drop. Truthful low-stock messaging automatically appears if inventory tracking is enabled.
- **`coming-soon-next-drop`**: Optional collection for future displays.

## 3. Metafields for Enhanced Visuals (Optional)
This theme anticipates the following Product Metafields, which you can map in your Theme Editor for product pages to dynamically inject color lines and visual style coding:
- `product.metafields.azourane.accent_color` (Single line text: hex code, e.g. `#2B4B77` for Tifawt)
- `product.metafields.azourane.pattern_key` (Single line text)
- `product.metafields.azourane.texture_image` (File -> Image)

*Note: If these metafields are omitted, the theme relies on `settings_schema.json` global brand colors.*

## 4. Key Architectural Decisions
- **No Build Steps**: Styles are natively authored in `assets/base.css.liquid` and `assets/global.js`. No `npm`, Vite, or Tailwind pipelines required.
- **Progressive Enhancement Cart**: Built using standard HTML forms. Javascript overrides the forms via `assets/global.js` using Shopify's Section Rendering API to open the slide-out drawer seamlessly.
- **JSON Templates**: Homepage (`index.json`), pages, and the specifically built Drops template (`page.drops.json`) rely fully on Shopify 2.0 Custom Sections (found in `/sections/`).
