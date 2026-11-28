# Owner notes

What the owner has told an AI while working, kept so the next AI knows it (OWNER-RULES rule 5). **Read this at the start of every session.** If you have a memory of your own, save these there too.

**Adding a note:** whenever the owner gives a note, correction or preference, add it here in the same session, newest first: the date, the client (or "all"), the note in the owner's words (any language), and how to apply it. Commit it and push that commit (the owner's standing OK, rule 5), after checking that no `private/` file, contact detail or login is in it. A newer note beats an older note or rule: say so in the note.

Notes that became standing rules are marked **→ rule N** (OWNER-RULES.txt).

---

## 2026-11-28 — all clients

- **Keep the notes in the repo.** "Add a rule to the repo to instruct any AI connected to the repo to create a memory that any notes taken by the user using the AI be pushed to the repo, to instruct the next AI connecting to the repo … and to always update the repo with notes from the user." → rule 5
- **Never delete the merchant's products or categories.** "Should not ever ever ever delete any products or categories created by the merchant on his own website." Not empty ones, not ones that look like duplicates or tests. → rule 6
- **Menus are not Global Blocks.** "Not using global blocks in menus." Build menus with the builder's Menu element. → rule 7
- **A design's categories come with it.** "Import the categories set in the design library design if [it] should." When a library design's menu or tiles use categories the store lacks, create them with the design's exact names and the merchant's own photos. → rule 8

## 2026-11-28 — Rona (rona.myglowply.com, template `rona`)

- **The menu broke on phones; make it a real menu.** "المنيو بايظه شويه وممكن تخليها مينو مش جلوبال بلوك." The header's category loop (a Term Loop repeating a Global Block) overlapped on phones. Now a Breakdance Menu element with «المزيد» and a burger on phones. → rule 7
- **Category names are the owner's.** «عيش وعجين» became «عيش ومعجنات», and the owner added مصنعات، لحوم بلدي، منتجات فلاحي، منتجات المطبخ البيتي، الحلويات والبسكوتات. Use the owner's names exactly; keep categories you weren't asked to remove.
- **Create the categories on the store, with images, and make them show.** "ممكن تدخل وتعمل الكاتجوري وتحط الصور وتخليها تظهر في الاقسام." Done with the client's photos already in the media library (no new media), products put into categories by their names, tiles raised to show all filled categories. → rule 8
- **When the owner sends a reference, follow it exactly.** "عايزه الهيرو زي الصوره دي بظبط." The owner's explicit request beats the template rules: build it as asked, list each rule it overrides in the design's `ownerOverrides` (`clients/<slug>/mockups/template-inputs.json`), and tell the owner once what each override means; don't keep refusing.
- **The owner can change the client's text.** "بدل مجمدات وبهارات خليها متجر رونى": the hero title became the store name.
- **Make a mockup the owner can open anywhere.** The mockup HTML didn't load in the file preview (photos in another folder). Always also give a self-contained page (photos built in) or a link.
- **Going live: staged first.** When the owner gives store access without saying how, import with everything switched off, show that visitors see no change, then switch on the owner's OK (`clients/rona/import/README.md`).
