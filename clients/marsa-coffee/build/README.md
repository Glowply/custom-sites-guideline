# Build: «مرسى» direction 3 (Overprint)

Built 2026-11-26 on the test store **sadasdtest.myglowply.com** (server4, SSH), from `mockups/direction-3/`. PROCESS.md stage 5.

## How it was built

All the work was done over SSH with WP-CLI, running the store's Breakdance and Glowply build abilities through `wp eval-file`. No Agent Connector or MCP connector was involved. To make that possible, `GLOWPLY_ALLOW_AGENTS` was set in the store's wp-config.

| Step | File | What it does |
|---|---|---|
| Halftones | `halftone.py` | Uses the mockup's own halftone maths, but renders ahead of time to 2-colour PNGs (navy on kraft). The hero is 49 KB, and all 17 photos together are 0.4 MB. This replaces the SVG filter that made the mockup take 10.1 s. |
| Data | `data.php` | Media, the `pa_grind` attribute (5 grinds), 4 categories and 9 products (7 variable coffees, 2 simple tools). The card text lives in `_marsa_origin`, `_marsa_roast`, `_marsa_notes`, `_marsa_grind` (default grind) and `_marsa_methods`. The ids are kept in option `marsa_build`. |
| Design system | `design.css`, `store.css` | Imported with `insert-stylesheet` (collection "Marsa", classes `mr-*`). Global settings: palette Text/Button #1F2A44, Footer #141C30, Accent #B5452F, Surface #F4EFE6; page background #C9A77C; Lalezar and Almarai. |
| Markup | `gen.js` → header, home, footer; `pdp.html`, `shop.html` | `html-to-page`. The products are `bd-loop="products"` cards bound to live data, so prices and names follow the store. |
| Script | `marsa.js` | Sits in the footer as a JavaScript element. It does four things: (1) works out the next roast date from today in Cairo time, using the Sunday/Wednesday rule; (2) runs the grind stamps; (3) adds to cart through the WooCommerce Store API with the chosen grind; (4) makes the method tiles filter the shelf. On the product page it also turns the grind select into stamps. |

The site's ids:
- **Header:** 379
- **Footer:** 380
- **Home:** 381 (now the front page)
- **Loop blocks:** 382–384
- **Product template:** 385
- **Shop template:** 386

The imported Beit templates (300–303) are **disabled, not deleted**, and the old home page 304 is still there. A backup taken before the build is in `~/backups/pre-marsa-20261126.sql` and `wp-config-pre-marsa-20261126.php` on the server.

## Checks (2026-11-26)

| Check | Result |
|---|---|
| Sideways scroll at 390 and 320 | none |
| Roast dates | Thursday 26 Nov gives "Sunday 29 Nov, order by Saturday 11 pm, out Monday 30" ✓ |
| Grind into the cart | «كولومبي · فرنش بريس», «إثيوبي سيدامو · إسبريسو» ✓; cart count updates |
| Method filter | فلتر وV60 shows the 2 matching coffees and presets the grind; reset brings back all 7 ✓ |
| Speed, home (slow 4G, median of 5) | **4.46 s LCP, fails** (budget 2.5 s); 478 KB ✓ (budget 1.5 MB). The mockup was 10.1 s / 1.6 MB. |
| Speed, product page (median of 5) | 2.42 s LCP ✓; 960 KB ✓ |
| Speed after the fixes below, home (median of 7) | **3.57 s LCP, still fails**; 484 KB ✓. Same session's product page: 2.48 s. |

## Speed pass (2026-11-26)

What changed:
- **Hero image.** It was lazy-loaded; it now loads eagerly at `fetchpriority=high`.
  - It was re-rendered at 760 px (`halftone.py … 760 6.2`), 49 KB down to 29 KB.
  - The file was overwritten in place, and the old one kept as `marsa-hero.png.1100.bak`.
  - The URL is now `?v=760`, because Cloudflare was still serving the old file.
- **Stamps.** All five are now images (`stamp-ink.png`, `stamp-kraft.png`, 13–14 KB, rendered from the SVG in headless Chrome) inside the same SVG icon elements, so there are no live turbulence filters on the page. `gen.js` still writes the SVG version: re-running it would bring the filters back.

What `speed-probe.mjs` measured (slow 4G, rewriting or blocking one thing at a time; medians of 5 at about 3.0–3.2 s each):
- Removing the stamp filters, the ink and fibre textures, the fonts or the non-essential plugin CSS/JS each changed LCP by 0.2 s or less, which is inside run-to-run noise.
- The server answers in **0.9–1.6 s** on every request (`cf-cache-status: DYNAMIC`, no page cache). The render-blocking CSS ends at about 2.1–2.5 s.
- The hero (the LCP element) finishes downloading at about 2.15 s but paints 0.4–0.9 s after first paint. No opacity, animation or hidden state delays it, so it's main-thread work.

What's left is mostly platform cost that every Glowply store pays: no page cache, and jQuery plus the translate, analytics and order-attribution scripts blocking. A page cache, or deferring those scripts store-wide, is a platform change, not something for this site.

## Open

1. **Home LCP about 3.6 s** (see "Speed pass"). What's left is the store's server time and blocking platform scripts, not this design.
2. **Prices show "EGP", not «ج».** This affects the whole store: no Glowply setting changes the currency symbol.
3. **/brew/, /roastery/, /wholesale/ and /policies/ don't exist.** content/ has no copy for them (stage 3 gate), so those links 404.
4. **The WhatsApp button links to `#`.** The number isn't set (BRIEF.md).
5. **Shipping is not set up.** The zones (Alexandria EGP 50, other governorates EGP 85) and the payment methods are untouched, so no test order has been placed.
6. **The cart drawer doesn't open after a grind add.** Feedback is the stamp on the card and the cart count.
7. **Prices are whole pounds now.** `woocommerce_price_num_decimals` was set to 0.
