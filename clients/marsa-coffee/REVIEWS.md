# Reviews: «مرسى» Marsa

Every time the client sees work, it's logged here: what they saw, what they said, what we changed. Two review rounds are included after the direction pick (proposed rule P2). For this trial the owner plays the client.

## Direction pick — shown 2026-11-25, waiting for the client

**Shown:** `mockups/direction-1`, `direction-2` and `direction-3`, side by side in `mockups/compare.html`. Each was built with combo B (Impeccable direction and build through its finish review, then an unslop audit). The direction cards are in `mockups/DIRECTIONS.md`.

Our checks before showing, run 2026-11-25:

| | 1 · Drawer Wall | 2 · Roast Calendar | 3 · Overprint |
|---|---|---|---|
| Sideways scroll at 1440 / 390 / 320 | none | none | none |
| Broken images | none | none | none |
| Speed, slow 4G, median of 5 runs | **1.82 s**, 803 KB | **1.76 s**, 452 KB | **10.1 s**, 1.6 MB: **fails** |
| Finish review | fix → 7 fixed, 2 regressions fixed after its last pass | fix → 8 fixed, 1 partial fixed after its last pass | fix → 4 of 8 still partial |
| unslop | light slop, polished | light slop, polished | light slop, polished |
| Claims | all from BRIEF.md | all from BRIEF.md or HOME.md | all from BRIEF.md or HOME.md |

What to know about each:

1. **Drawer Wall**
   - The most shop-like: every coffee has its grind and add-to-cart in the wall, and the best seller is buyable in the first screen.
   - Coffee photos only show when a drawer is opened.
   - It's the densest of the three.
2. **Roast Calendar**
   - The next roast day is the hero, as a red «٢٩». The dates come from one small function, ready to switch to the real date.
   - The best seller is buyable in the first screen.
   - Coffees are sheets in a sideways row on phones.
   - On load, today's sheet tears away.
3. **Overprint**
   - The closest to their bag: kraft, navy ink, the red sticker.
   - Every photo is printed as a navy halftone, so the products are hard to make out.
   - Too slow as built: the halftone filter is drawn in the browser. A real build would print the halftones into small image files.
   - It also has a test hook that loads every photo when an automated browser visits. That hook must go before a real build.

- **Picked:** direction 3, Overprint (2026-11-26, the owner playing the client).
- **Their comments:** «build direction 3»
- **What the build changes from the mockup:**
  - The halftone duotones are rendered into image files ahead of time instead of being drawn by an SVG filter in the browser. That was the cause of the 10.1 s.
  - The test hook that loaded every photo for automated browsers is dropped.
- **Where:** sadasdtest.myglowply.com, a test store, instead of a library subsite.

## Round 1 — <date>

- **Shown:**
- **Their list:**
  1.
- **Done:**

## Round 2 — <date>

- **Shown:**
- **Their list:**
  1.
- **Done:**
