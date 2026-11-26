# Build notes: putting a custom site on a client's store

These are lessons from building a client's site on their Glowply store (PROCESS.md stage 5). They were first learned on Marsa, on a test store, 2026-11-26; `clients/marsa-coffee/build/` holds that build's files. Add to this file whenever a build teaches something new.

## Getting in

- **SSH and WP-CLI are enough.** No MCP connector or Agent Connector is needed. `tools/ssh-ability.sh` runs any `breakdance/*` or `glowply/*` ability on the store, as the store's first admin.
- **Before the first build call:**
  1. Back up the database and wp-config: `wp db export ~/backups/<name>.sql`, plus a copy of `wp-config.php`.
  2. Add `define('GLOWPLY_ALLOW_AGENTS', true);` to wp-config.php (`wp config set GLOWPLY_ALLOW_AGENTS true --raw --type=constant`). Without it, glowply-builder-patch unregisters every build ability, even in WP-CLI. Only 10 abilities are left (core and translate).
  3. Check the store runs Breakdance 3.0.1 and glowply-builder-patch (`site-info`). html-to-page and the `glowply/*` seed and image abilities need both.
- **Write the params files with a script** (node `JSON.stringify`), never by hand. Element slugs contain a backslash (`EssentialElements\FImage`), and hand-typed JSON or shell quoting breaks it. The ability then answers with a misleading "required property" error.

## On a store that already has a template

- **A cloned store comes with the template the client imported:** a header, a footer, shop and product templates, Global Blocks and a home page. Don't edit those.
  - Build the client's header, footer, product and shop templates as new templates.
  - Switch the old ones off with `set-template-conditions` and `disabled: true`.
  - Build the home page as a new page, then make it the home page with `set-home-page`.
  - Nothing gets deleted (deletes are permanent), and you can switch back in a minute.
- **The colours go in the five palette entries** (Text, Button, Footer, Accent, Surface) with `set-global-settings`, so Store Setup keeps working for the client. Send the whole `palette.colors` array: it replaces the old one, along with the template's alternative palette sets.
- **The "Glowply template rules" at the end of `get-instructions` are written for templates.** On a custom site they apply only where they are about mechanics. Our design is the client's: an own `:root` design system, html-to-page sections, and fixed copy and links.

## Breakdance and WooCommerce gotchas

- **One selector, one rule.** A comma list in imported CSS turns into separate selectors, and a later rule for the same selector replaces the earlier one at that breakpoint. Write every selector's properties in one rule.
- **`insert-stylesheet` never changes a variable that already exists.** Its responsive values (`:root` inside `@media`) are only taken on the first import.
- **Don't set `color` on `.page a`.** At (0,1,1) it beats one-class buttons such as `.btn`, and the button text then takes the link colour.
- **The loop cart button** is styled by `.breakdance-woocommerce a.button.add_to_cart_button`, which is (0,3,1). To restyle it, qualify the selector the same way: `.x a.button.add_to_cart_button`.
- **html-to-page rewrites `inset-inline-*` to left/right as if the page were LTR.** On an Arabic-only site, write `left`/`right` yourself, thinking right to left.
- **The image element (FImage) is lazy by default,** and `fetchpriority` alone doesn't change that. Switch the hero to eager with `edit-post` (`content.image.lazy_load: false`).
- **Custom fields in a loop:** `bd-bind="post_custom_field" bd-params='{"key":"_my_key"}'`. Hide empty ones with `:empty`.
- **One featured product:** `bd-loop="products" bd-featured="true" bd-limit="1"`.
- **A variation chosen on a card** (grind, size, colour):
  - The loop cart button only links variable products to their page.
  - `?add-to-cart=ID&attribute_pa_x=y` fails silently on stores.
  - The WooCommerce Store API works: GET `/wp-json/wc/store/v1/cart` for the `Nonce` header, then POST `/cart/add-item` with `{id, quantity, variation:[{attribute:"pa_x", value:"y"}]}`.
  - Afterwards, trigger `wc_fragment_refresh` so the header count updates. The mini cart's "open on add" doesn't fire for this kind of add.
- **Header search:** set `design.form.mode: "modal"`. The inline field pushes the header past the screen on phones.
- **Mini cart:** sidebar style with `sidebar_position: "right"`, full screen from `breakpoint_phone_landscape`, subtotal hidden.
- **Scripts:** a site-wide script goes in an `EssentialElements\FJavaScriptCode` element in the footer template (`content.content.javascript_code`).
- **Prices show "EGP", not «ج.م».** No Glowply setting changes this yet (template-guideline's BASE-KIT decision 21 isn't shipped). Set `woocommerce_price_num_decimals` to 0 for whole pounds.

## Speed

- **Effects the browser draws are slow on phones:** SVG filters, `feTurbulence` textures and halftone filters. Render them ahead of time:
  - Halftone photos as 2-colour PNGs (`clients/marsa-coffee/build/halftone.py`). The hero went from about 10 s to about 3.6 s, and from 1.6 MB to 0.5 MB.
  - A stamp or logo with a filter as a small transparent PNG, rendered once in headless Chrome. An SVG icon element can hold `<svg><image href="…"/></svg>`, so its classes and position stay.
- **Store uploads are cached by Cloudflare.** If you overwrite a file in place, add `?v=…` to its URL or the old file keeps being served.
- **The speed floor of today's stores** (measured 2026-11-26, slow 4G, as `tools/speed.mjs` runs it):
  - The server takes 0.9–1.6 s to answer every page: there's no page cache (`cf-cache-status: DYNAMIC`).
  - jQuery and the translate, analytics and order-attribution scripts block rendering.
  - A plain product page lands at 2.4–2.8 s LCP, so the 2.5 s budget can't be met by design work alone (SCORECARD.md).
- **To find what's slow,** use `clients/marsa-coffee/build/speed-probe.mjs`. It blocks or rewrites one thing per run (filters, textures, fonts, plugins) and reports LCP, first paint, server time and when the hero arrives.
- **Measuring pitfalls:**
  - Never use `?p=` as a cache-buster: WordPress reads it as a post id and serves a 404.
  - Headless `--window-size` screenshots of RTL pages can look cut off on the right. Use device emulation, or an iframe harness that measures `scrollWidth` (in RTL the iframe's scrollbar sits on the left).
