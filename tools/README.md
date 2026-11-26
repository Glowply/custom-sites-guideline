# Tools

Copied once on 2026-11-24 and owned here from now on. They don't track the originals: if one changes in template-guideline, copy the change over on purpose.

| Tool | What it does | Came from |
|---|---|---|
| `speed.mjs` | Loads each URL in headless Chrome as a phone on slow 4G (150 ms latency, 1.6 Mbps down, 750 kbps up, CPU ×4, 390×844) and prints LCP, load time and bytes by type as JSON | The 2026-11-23 design skill trials (session scratchpad) |
| `run-ability.js` | Prints the WP-CLI command that runs one Breakdance ability on a site, with the params base64-encoded so Arabic survives the shell | template-guideline/ship-now/tools/run-ability.js |
| `ssh-ability.sh` + `ability.php` | Runs one ability on a store over SSH (`wp eval-file -`, as the first admin) and prints its JSON. Needs `GLOWPLY_ALLOW_AGENTS` on the store (BUILD-NOTES.md) | Written 2026-11-26 for the Marsa build |

```
node tools/speed.mjs https://client-store.myglowply.com/ https://client-store.myglowply.com/product/x/
node tools/run-ability.js breakdance/site-info - https://client-store.myglowply.com/ <admin-login>
tools/ssh-ability.sh <user@host[:port]> breakdance/site-info
tools/ssh-ability.sh <user@host[:port]> breakdance/html-to-page page.json
```

Speed varies a lot between runs (1.4–3.3 s on the same page in the trials): run each URL 5 times and use the median.

## Not copied, used where they are

- **Screenshots:** the Impeccable launcher, `impeccable shot --viewport 1440x900,390x844 --full --out <dir>`.
- **Design:** the Impeccable, unslop and taste-skill skills.
- **template-guideline's** `build-demo.js`, `real-store-check.js` and the demo data tools: they build library demos and test against the rough sample store, which a custom site doesn't need. They're used only when promoting a design to a template (OWNER-RULES rule 4).
