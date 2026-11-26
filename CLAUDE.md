# custom-sites

Custom websites for single Glowply clients. People start a session with the prompt in START.md. This repo is **public**: everything committed outside `clients/*/private/` can be read by anyone.

## Starting a session

Do these in order before any client work, and say in one line what you found at each step:

1. **Up to date:** `git pull`.
2. **Read:** OWNER-RULES.txt, PROCESS.md, BUILD-NOTES.md, SCORECARD.md. For a store build, also `clients/marsa-coffee/build/README.md` (a worked example).
3. **Client folder:**
   - A new client: copy `clients/_example/` to `clients/<slug>/` (lowercase letters, digits and dashes).
   - An existing client: open `clients/<slug>/` and work out its stage from the files present (the PROCESS.md table).
   - Never skip a gate.
4. **This computer:** check `node -v` (22+), `python -c "import PIL"`, Chrome, and `ssh`. Say what's missing, and what that blocks.
5. **The store** (only when the prompt gives SSH):
   - Run the read-only checks first: `ssh` works, `wp core version`, `wp option get home`, and whether `GLOWPLY_ALLOW_AGENTS` is set.
   - Report the Breakdance and builder-patch versions and the imported template.
   - Before the first write: back up (BUILD-NOTES.md, "Getting in"). Set the flag only if the prompt allows it, otherwise ask.
6. **Plan:** say which stages you'll do and the gate you'll stop at: the first gate that needs a person, or the stage the prompt names, whichever comes first. Then start.

## While working

- **Stop at the gates that need a person:** the direction pick, each review round and sign-off. Show what's ready (screenshots, links), then wait.
- **Commit at the end of each stage.** Push only when the person says (rule 1), after checking that no `private/` file and nothing from rule 3 is in the commits.
- **Never commit or read out anything in `clients/*/private/`.** Never send client details to an outside service (rule 3). Phone numbers, emails, logins, contracts and agreed prices go in `private/`, never in BRIEF.md or REVIEWS.md.
- **Judge with SCORECARD.md.** Its weights and the proposed rules (P1–P6) are drafts: follow them, but ask before treating them as agreed.
- **Design:** combo B for a new look, combo C when the client's existing look must stay (PROCESS.md, "Direction").
- **Template rules don't apply here** (5 palette roles, approved fonts, the real-store check, feed entries), except when promoting a design to a template, which happens in the template-guideline repo.
- **When a build teaches something new** (a gotcha, a working recipe), add it to BUILD-NOTES.md in the same commit.
