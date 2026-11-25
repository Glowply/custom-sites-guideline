---
version: 1
slug: "stage1-impeccable-html"
primary_target: "stage1-impeccable.html"
related_targets: ["index.html"]
---

# Surface: home page (direction 2 mockup)

Scope: Marsa home page, Arabic RTL, phone-first. Mode: Persuade.
Audience and job: Alexandrian Turkish-coffee drinkers, home V60/espresso starters, small cafés; on phones from Instagram/WhatsApp, patchy data. They must believe the coffee is fresh (dated roast), pick a coffee by brew method, and add to cart with a grind.
Proof on hand: the roast rule only (Sunday/Wednesday, cutoff 11 pm the day before, out next day), delivery costs, returns, payment. No reviews, counts or awards.
Constraints: one self-contained index.html, stock photos from content/photos only, slow 4G, 320/390/1440 widths, red #B5452F for roast dates only, no countdowns.
Memorable moment: today's sheet (Wed 25) tears off to reveal Sunday 29.
Unresolved: live date wiring for the real build (JS function with fixed mockup "now").

## Direction contract

THESIS: The page is the tear-off wall calendar shops hand out, Marsa's name printed on the backboard. The date is the hero, not the beans. It refuses freshness as small print under a dark bean photo with a "shop now" button.

OWN-WORLD: Stamp-navy #1F2A44 printed backboard as the ground; paper-white #F4EFE6 newsprint sheet block, perforated, stapled, punched hang hole, tear edge; kraft #C9A77C cardboard edges and the primary button; date red #B5452F for roast-day numerals and Sundays/Wednesdays in month grids; newsprint grey #8C8A85; slight offset misregistration. Cards are sheets, lists are month grids, product panels are the backboard's printed ad boxes carrying the stamp. Alexandria 900 numerals, 400/500 body; Noto Naskh Arabic small lines.

STORY: Today's roast has closed; next is Sunday 29, order by Saturday 11 pm, out Monday 30. Freshness becomes believable, and the visitor adds المحوّج right there, then browses methods, coffees, the order month grid, brew back-of-sheet, cafés, help.

FIRST VIEWPORT: 390: strip, header, sheet ~55% height with «الأحد», red «٢٩» ~170px, «نوفمبر», «التحميصة الجاية», Naskh cutoff line; below on navy: headline, then printed المحوّج panel with 230 ج, grind select, kraft add-to-cart. 1440: 520px sheet block hangs on the left, headline/lead/«اختار بنّك» on the right, المحوّج ad panel under the sheet, month grid peeking above the fold.

FORM: grounded #1, seed: none (pinned) — "chosen for the client from the 2026-11-25 direction round (assigned seed:058449b6c0e7cfcb went to direction 1)". Pinning words from the request: "Yours is direction 2, Roast Calendar … Build exactly that direction" (DIRECTIONS.md §2, world and first viewport both named). Signature: on load the Wednesday 25 sheet curls and tears away to reveal Sunday 29; in the order section sheets flip order day → roast day → out day. Paper physics only (tear, curl, drop), one direction, 400 ms, no fades; reduced motion shows a static sheet.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
