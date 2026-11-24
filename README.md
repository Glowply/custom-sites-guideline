# Custom sites

Websites made for one Glowply client, not templates. Each runs on the client's own Glowply store (Breakdance + WooCommerce, Arabic RTL). The template library lives next door in [template-guideline](../template-guideline/).

| File | What it is |
|---|---|
| [OWNER-RULES.txt](OWNER-RULES.txt) | The standing rules. Read first. |
| [PROCESS.md](PROCESS.md) | The stages from intake to handover, and what each leaves behind |
| [SCORECARD.md](SCORECARD.md) | Required checks and weighted factors for judging a site |
| [tools/](tools/) | Speed test and the Breakdance ability runner |
| [clients/](clients/) | One folder per client. Copy `_example/` to start. |

**Local only.** There is no remote and nothing is pushed (rule 1). Client contracts, logins and original photos go in `clients/<slug>/private/`, which is never committed (rule 3).

## How this differs from a template

| | Template (template-guideline) | Custom site (here) |
|---|---|---|
| For | Any merchant, any content | One client, known content |
| Colours and fonts | 5 palette roles, approved font pairs | The client's brand |
| Tested with | The rough sample store | The client's real content |
| Must look | Unlike other templates | Like the client's brand |
| Signed off by | The owner, then the feed entry goes active | The client, after review rounds |
| Done when | It's in the library | Launched and handed over |

A good custom design can later become a template, rebuilt in template-guideline under its rules (rule 4).
