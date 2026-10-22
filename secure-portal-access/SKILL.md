---
name: secure-portal-access
description: Log into a web portal behind Cloudflare Turnstile or a similar bot check with a real browser, keep the session alive, and read everything behind the login. Use this whenever a user supplies credentials for a school, university, employer, bank-adjacent, government, or other account portal and asks you to sign in, pull their profile, grades, transcripts, attendance, payslips, invoices, statements, schedules, or "everything on my account" — including when they say a normal scraper gets blocked, gets a captcha, or bounces back to the login page. Also use it when a login page reloads mid-flow, renames its own form fields, or when POSTing credentials returns the login page again.
---

# Secure Portal Access

Getting past a modern login is three separate problems, and mixing them up is why most attempts fail. Solve them in order:

1. **Reach the page** — plain HTTP is usually fine. The page is public.
2. **Pass the bot check** — this needs a real browser. It is not a header problem.
3. **Speak the site's form protocol** — server-rendered portals carry session state in hidden fields and often rename their own inputs on every load.

Most failures happen because people treat (2) as an HTTP problem or (3) as a simple field fill. Work through the stages below, and check `references/` when a stage misbehaves.

## Decide the target shape first

Look at the login page source before writing any automation.

| Symptom in the HTML | What it means | Go to |
|---|---|---|
| `__VIEWSTATE`, `__EVENTVALIDATION`, `aspNetHidden` | ASP.NET WebForms; state is server-side | [references/webforms-protocol.md](references/webforms-protocol.md) |
| `cf-turnstile`, `challenges.cloudflare.com` | Cloudflare Turnstile widget | [references/bot-checks.md](references/bot-checks.md) |
| Password input whose `name` changes on every load | Obfuscated field names, re-scan before every POST | [references/webforms-protocol.md](references/webforms-protocol.md) |
| React/Next/Vue shell, `__NEXT_DATA__`, empty `<div id="root">` | Client-rendered SPA; scrape after paint | [references/spa-apps.md](references/spa-apps.md) |
| `onchange="__doPostBack(...)"` on the username box | Typing triggers a full reload | [references/webforms-protocol.md](references/webforms-protocol.md) |

## Stage 1 — Confirm plain HTTP is enough for the page itself

Before launching a browser, check that the page is reachable and see what it actually is:

```python
from curl_cffi import requests
r = requests.get(url, impersonate="chrome", timeout=30)
```

`curl_cffi` with `impersonate` reproduces a real browser's TLS and HTTP/2 fingerprint, which clears most CDN checks on ordinary page loads. If this returns the login form, good — you have the markup and a cheap way to re-read it later.

What this **cannot** do is produce a bot-check token. Those are minted by JavaScript running against the site key, so they require an actual browser. Don't spend time trying to forge one; the server validates it against Cloudflare and rejects anything synthetic.

## Stage 2 — Drive a real browser from a clean profile

The single biggest determinant of success is whether the browser is a fresh, unmodified Chrome. Launch Chrome yourself and attach over CDP rather than letting Playwright or Puppeteer launch it — driver-launched browsers get fingerprinted, and profiles that have already seen automation tend to hang on the verifier indefinitely.

```python
chrome = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
subprocess.Popen([chrome, f"--remote-debugging-port={port}",
                  f"--user-data-dir={fresh_temp_dir}",
                  "--no-first-run", "--no-default-browser-check", "about:blank"])

playwright = await async_playwright().start()
browser = await playwright.chromium.connect_over_cdp(f"http://127.0.0.1:{port}")
```

A brand-new profile usually clears the check silently in a few seconds. If it sits on "Verifying..." past ~20 seconds, the profile is burned — delete it and use a new directory rather than waiting longer.

`scripts/portal_login.py` implements this end to end, including the token wait, the form submit, and session saving. Run it before writing your own version:

```bash
python scripts/portal_login.py --config targets/aspnet-turnstile.json --user <id>
```

It reads the password from `PORTAL_PASSWORD` so credentials stay out of shell history and process listings.

## Stage 3 — Obey the form's own protocol

Two traps account for nearly every silent failure:

**The username box reloads the page.** Portals often attach an `onchange` postback to the user-ID field. Typing then tabbing away submits, reloads, and issues a *new* password field name and a *new* bot-check token. Any token you grabbed before that reload is dead. Either fill the field without firing change events, or let the reload happen first and only then wait for the token.

**The submit button's name is a real form field.** ASP.NET decides which control was clicked by the presence of that control's `name` in the POST body. A bare `form.submit()` omits it, so the server renders the login page again with no error message at all. Read the button's `name` and `value` off the live DOM and include them.

Set values through the DOM and submit natively:

```javascript
user.value = opts.user;
user.onchange = null;                       // don't trigger the postback
pass.value = opts.password;
hidden('__EVENTTARGET').value = '';        // clear any leftover event routing
extra = hiddenInput(submit.name, submit.value);
HTMLFormElement.prototype.submit.call(form);
```

Then **verify against the destination**, not against the absence of an error. Check the resulting URL and body for expected content, and scan for known failure strings. Portals frequently report failure with a modal that a naive check misses, or with a 200 and the login markup.

## Stage 4 — Keep the session, then walk the site

Session cookies are what you actually need. Save them along with the user agent and the CDP port so a later run can reuse a live browser or rebuild a context:

```bash
python scripts/portal_fetch.py --session session.json --out-dir dump \
    --url /profile.aspx --url /results.aspx --url /attendance.aspx
```

Capture both rendered text and raw HTML per page — text is what you read, HTML is what you re-parse when a selector turns out wrong. Save each page as its own file so one failure doesn't lose the batch.

To find pages you weren't told about, dump the navigation once and read it rather than guessing filenames:

```bash
python scripts/portal_extract.py dump/dashboard.html --links
```

Legacy portals expose their whole feature map in that one call — every report, form, and sub-app appears as a link. Note which links point at report viewers, since those usually need parameters posted before they render anything.

## Stage 5 — Extract, and separate render time from load time

```bash
python scripts/portal_extract.py dump/page.html --tables      # grid data
python scripts/portal_extract.py dump/page.html --label-value # "Name : X" pairs
python scripts/portal_extract.py dump/page.html --text
```

Two things to expect:

- **Report viewers render late.** Server-side report engines (SSRS and friends) return a shell, then paint a viewer, often two page loads later. Wait for the marker text you expect, not a fixed sleep.
- **SPAs need an explicit settle.** If the saved HTML has a nearly empty body while the browser showed content, the page was captured too early. Increase `--wait-ms` or wait on a selector.

## Reporting to the user

Users asking for "everything on my account" want organized facts, not a page dump. Group what you found: identity, program/role, academic or financial records, and anything time-sensitive. Call out deadlines, balances, and required actions explicitly — that's usually the reason they asked.

Flag anything security-relevant you noticed, such as an expiring password or a pending verification, and never echo the password back in the summary.

## Boundaries

Access only accounts the user owns and has given you credentials for. Don't attempt to bypass a check you can't legitimately pass, and don't touch other people's records. Avoid submitting forms that change state — payments, registrations, applications, password resets — unless the user explicitly asked for that action; reading is the default.

## Reference map

| File | Read it when |
|---|---|
| [references/bot-checks.md](references/bot-checks.md) | The verifier hangs, never issues a token, or the site adds a challenge mid-flow |
| [references/webforms-protocol.md](references/webforms-protocol.md) | Hidden state fields, randomized names, postbacks, or a POST that silently fails |
| [references/spa-apps.md](references/spa-apps.md) | Empty HTML shell, client-side routing, or data behind an API |
| [references/troubleshooting.md](references/troubleshooting.md) | Something failed and the symptom table doesn't explain it |
| [references/tooling.md](references/tooling.md) | You need to install or verify the browser/automation stack |
| [references/verified-target.md](references/verified-target.md) | You want a known-good configuration to copy, including one portal's exact selectors and dead ends |
