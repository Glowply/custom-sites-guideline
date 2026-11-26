# How a custom site gets made

Each stage leaves a file in `clients/<slug>/` and has a gate: the next stage starts only when the gate is met. Rules: [OWNER-RULES.txt](OWNER-RULES.txt). Checks: [SCORECARD.md](SCORECARD.md).

| # | Stage | Leaves | Gate |
|---|---|---|---|
| 1 | Intake | `BRIEF.md`, raw material in `private/` | The brief has the "must know" answers filled in |
| 2 | Brand | `BRAND.md` | Logo, colours, fonts and voice written down, or marked "we choose" |
| 3 | Content | `content/` (copy, product list, page list) | Every page has its copy, in the client's words or approved by them |
| 4 | Direction | `mockups/` (2–3 home page directions, 1440 + 390) | The client picks one, logged in `REVIEWS.md` |
| 5 | Build | Pages on the client's store | SCORECARD.md required checks pass |
| 6 | Review rounds | `REVIEWS.md` | Each round's changes done and re-checked |
| 7 | Sign-off | `SIGN-OFF.md` | The client's written OK |
| 8 | Launch | `HANDOVER.md` | Domain, payments, shipping and email work on the live site |
| 9 | Handover | `HANDOVER.md` filled in | The client knows how to edit what they'll edit |

Copy `clients/_example/` to `clients/<slug>/` to start. The slug is lowercase letters, digits and dashes.

## 1. Intake

Fill in `BRIEF.md` with the client: what they sell, who buys, where (country, currency, cash on delivery or not), what the site must do, what they like and hate (links), and the deadline. Contracts, invoices and logins go in `private/` (never committed, rule 3).

## 2. Brand

If they have a brand, write it down in `BRAND.md` as they use it: logo files, exact colours, fonts, words they use and avoid. If they don't, write "we choose" and the direction stage picks it. There is no palette limit here: a custom site uses the client's colours. Arabic type still has to read well at 16 px on a phone (SCORECARD.md).

## 3. Content

Real copy and real products before design, so the design is built around what's there: the store name as it will appear, the categories, the product count, which products have photos. This is what replaces template-guideline's rough-store test: we know the client's real content, so we design for it.

## 4. Direction

Two or three home page directions as single HTML mockups at 1440 and 390, with the client's content and photos.

- New look: **combo B** — Impeccable picks a direction and builds (through its finish review), then unslop audits and polishes.
- The client has a site whose look must stay: **combo C** — unslop cleans it, then Impeccable's typeset, layout, animate, adapt and harden.

Give each build the brief, BRAND.md, the content and SCORECARD.md up front. Screenshots: the Impeccable launcher's `shot --viewport 1440x900,390x844 --full`. Show the client, and log their pick and comments in `REVIEWS.md`.

## 5. Build

On the client's Glowply store, with Breakdance (the MCP tools, `tools/run-ability.js`, or over SSH with `tools/ssh-ability.sh`). Read [BUILD-NOTES.md](BUILD-NOTES.md) first: the setup steps and the gotchas earlier builds hit. Build the home, shop, product, cart, checkout and the content pages from `content/`. Check logged out at 1440, 390 and 320, and run `tools/speed.mjs` on the home and a product page (median of 5 runs).

## 6. Review rounds

Two rounds are included (proposed rule P2). For each round: log the client's list in `REVIEWS.md`, make the changes, re-run the checks, send screenshots.

## 7–9. Sign-off, launch, handover

The client's OK goes in `SIGN-OFF.md`. At launch, check the live domain: a test order with cash on delivery, the order emails, shipping zones, WhatsApp link. `HANDOVER.md` records what the client edits themselves and how, the support period, and the logins they hold (names only; the logins themselves stay in `private/`).

## Promote to a template

Optional, after launch (rule 4). If a design would make a good template, ask the client, then rebuild it in template-guideline as a new theme: take out the client's name, logo, photos and copy, fit it to the 5 palette roles and the approved font pairs, write a demo, and run the real-store check. It goes through template-guideline's own rules from there, including the inactive feed entry and the owner's sign-off.
