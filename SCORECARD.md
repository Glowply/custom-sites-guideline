# Custom site scorecard

Adapted on 2026-11-24 from template-guideline's template scorecard (the weights the owner set on 2026-11-23). What changes: a custom site has one client and known content, so the template-only tests are gone, and "looks like the client's brand" replaces "doesn't look like every other store". **The weights below are a draft until the owner agrees them.**

## Required before each review round and before sign-off (pass/fail)

1. **Fast on patchy mobile data.** Home and a product page, `tools/speed.mjs`, median of 5 runs. Budget (proposed, same as templates): main image ≤ 2.5 s on slow 4G, home ≤ 1.5 MB.
   - *Measured 2026-11-26:* today's stores answer in 0.9–1.6 s with no page cache, and a plain product page already lands at 2.4–2.8 s. Until that's fixed for the platform, judge a site by how far it sits above the store's own product page, and record both numbers (BUILD-NOTES.md, "Speed").
2. **Nothing breaks.** Logged out at 1440, 390 and 320: no sideways scroll, nothing cut off or overlapping, no broken images, no empty boxes, no English leaking into an Arabic page.
3. **Readable Arabic, right to left.** Body text ≥ 16 px on a phone, enough line height, the client's fonts render (no fallback flash that changes the layout).
4. **It's the client's brand.** Logo, colours, fonts and voice match BRAND.md, or the direction the client picked.
5. **Every claim is true.** Each promise on the page traces back to the brief or the client (proposed rule P4).
6. **Checkout works.** A test order with the client's payment methods (cash on delivery where they offer it) goes through, and the order email arrives.

## Weighted (0–10 each, times the weight)

| Weight | Factor |
|---|---|
| ×4 | Looks cared for, made for this client |
| ×3 | Clear what's sold, feels like a real shop |
| ×3 | Category navigation and search |
| ×3 | Product cards: photo, name, price, enough detail to choose |
| ×3 | Add to cart is obvious and gives feedback (consider "buy now") |
| ×3 | Short checkout |
| ×2 | Clear prices, sale prices honest |
| ×2 | WhatsApp, returns and cash on delivery visible |
| ×2 | The client can edit what they said they'll edit (HANDOVER.md) |
| ×1 | Thumb reach on a phone |
| ×1 | Older Android phones |

Dropped from the template scorecard: "any store name, no logo" (we know the name and have the logo), "few things to replace" (nothing is replaced, it's their content) and the real-store test (we build with their real content from the start).
