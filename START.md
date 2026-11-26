# Start a custom site with an AI

Paste the prompt below into Claude Code, or any AI that can run a terminal, on any computer. Fill in the `<…>` parts and delete the lines that don't apply. Everything the AI needs to know is in this repo, so the prompt only says who the client is, where their store is and how far to go.

## The prompt

```text
Make a custom Glowply website for a client.

Repo: https://github.com/Glowply/custom-sites-guideline
Clone it into ./custom-sites (or `git pull` if it's already there), then
follow its CLAUDE.md, "Starting a session", before anything else.

Client: <brand name>, <what they sell>, <city/country>
  New client → start at intake.  Existing → continue clients/<slug>/.
What I have: <Instagram / old site / WhatsApp catalogue links, notes,
  a folder of their photos on this computer>

Store: https://<store>.myglowply.com
SSH: <user>@<host> -p <port>, WordPress in public_html (my key is added)
This store is: <a test store / the client's live store>
You may: back up the store, set GLOWPLY_ALLOW_AGENTS, build on it.

Go as far as: <the 3 direction mockups | build direction <N> | review round <N> | launch>
Then stop and tell me what's next.
Commit as you go; push only when I say.
```

### Shorter versions

- **Continue a client:** `Continue clients/<slug>/ in https://github.com/Glowply/custom-sites-guideline (follow CLAUDE.md, "Starting a session"). Go as far as <stage>. SSH: <user>@<host>.`
- **Client feedback:** `Client <slug> sent this for review round <N>: <paste their list>. Log it in REVIEWS.md, make the changes on the store, re-check, then show me.`
- **Mockups only, no store yet:** leave out the Store and SSH lines. The AI stops after the direction mockups.

## What to fill in, and why

| Line | Why it matters |
|---|---|
| Client + what you have | The intake (BRIEF.md) is built from this. Anything missing becomes a question in the brief, not a guess. |
| Store + SSH | That's how the AI gets in: SSH and WP-CLI, no connector. Add your SSH key on the store first. |
| Test or live | On a live store the AI builds on new templates and pages, and switches over only after you approve (proposed rule P5). |
| You may | Backing up the store and setting `GLOWPLY_ALLOW_AGENTS` in wp-config are needed before any build. Saying so up front saves a round of questions. |
| Go as far as | The process has gates that need a person: the direction pick, each review round and sign-off. The AI stops at the first gate it reaches, or at the stage you name, whichever comes first. |
| Push only when I say | Owner rule 1. This repo is public: anything pushed is on the internet. |

## Before the first time on a computer

- **Required:** Git, Node 22 or newer, Python 3 with Pillow (`pip install pillow`), Google Chrome, and an SSH key added on the store. Windows, macOS and Linux all work. If Chrome isn't in its usual place, set `CHROME` to its path.
- **For stock photos:** the Pixabay key in `~/.glowply/stock-keys.env` (`PIXABAY_API_KEY=…`). It's never committed; ask the owner for it.
- **To push:** write access to Glowply/custom-sites-guideline. Reading needs no access, because the repo is public.

## What not to paste into the prompt

The prompt and anything you paste can end up in the repo, and the repo is public. So keep these out of it:

- Phone numbers, emails, addresses, contracts, prices you agreed with the client, logins.
- Put those in `clients/<slug>/private/` on your computer instead. That folder is never committed (owner rule 3).
