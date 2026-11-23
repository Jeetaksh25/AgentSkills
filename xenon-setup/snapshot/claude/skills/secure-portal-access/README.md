# secure-portal-access

A skill for AI agents: sign into a portal protected by Cloudflare Turnstile (or a similar
bot check) with a real browser, keep the session, and read what is behind the login.

The technique was developed and verified against a real university portal
(ASP.NET WebForms + Cloudflare Turnstile + a Next.js student dashboard), but nothing in the
instructions is specific to that site — the reference files explain the general mechanics so
the workflow transfers.

## What it covers

- **Reaching the page** — `curl_cffi` with browser impersonation clears CDN edges on ordinary
  GETs, so you only need a browser for the check itself.
- **Passing Turnstile** — launch system Chrome yourself, attach over CDP, use a brand-new
  profile. Headless and driver-launched browsers hang on "Verifying…" indefinitely.
- **Speaking WebForms** — randomised input names, `__VIEWSTATE` state, `onchange` postbacks,
  and the submit-button-name trap that makes a correct login look like a wrong password.
- **Keeping the session** — cookies, user agent and CDP port saved to `session.json`.
- **Reading the portal** — batch page capture (text + HTML), link discovery, table and
  label-value extraction, SPA settle handling.

## Layout

```
secure-portal-access/
├── SKILL.md                            # workflow the agent follows
├── scripts/
│   ├── portal_login.py                 # launch Chrome, pass Turnstile, submit, save session
│   ├── portal_fetch.py                 # reuse session, batch-dump pages
│   └── portal_extract.py               # tables / links / label-value / cards from HTML
├── targets/
│   └── aspnet-turnstile.json           # pattern descriptor; copy per portal
└── references/
    ├── bot-checks.md                   # why Turnstile stalls and how to make it pass
    ├── webforms-protocol.md            # hidden state, random names, postbacks, submit trap
    ├── spa-apps.md                     # shell pages, API capture, deep links, tabs
    ├── troubleshooting.md              # symptom → cause → fix table
    └── tooling.md                      # install/verify playwright, curl_cffi, camoufox, etc.
```

## Quick start

```bash
export PORTAL_PASSWORD='…'
python scripts/portal_login.py --config targets/aspnet-turnstile.json --user <id>
python scripts/portal_fetch.py --session session.json --out-dir dump \
    --url /profile.aspx --url /results.aspx
python scripts/portal_extract.py dump/page.html --links
```

## Requirements

- Python 3.9+ with `playwright`, `curl_cffi`, `beautifulsoup4`, `lxml`
- A real Chrome or Edge installation (not Playwright's bundled Chromium)
- No `playwright install` needed — the scripts attach to your system browser over CDP

## Installing as a skill

Copy the directory into a skills root:

```bash
cp -r secure-portal-access ~/.claude/skills/
cp -r secure-portal-access ~/.omp/skills/
```

Point `skills.customDirectories` at `D:/AgentSkills` to load it from there instead.

## Scope

For accounts the user owns and has authorised. The skill deliberately stops at interactive
puzzles, MFA, and state-changing actions, and says so in `references/troubleshooting.md`.
