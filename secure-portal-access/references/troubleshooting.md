# Troubleshooting by symptom

Find the symptom, apply the fix. These are ordered by how often they actually occur.

| Symptom | Cause | Fix |
|---|---|---|
| POST returns the login page, 200, no error | Submit button's `name` missing from the body | Read the button's name off the live DOM and include it ([webforms-protocol.md](webforms-protocol.md)) |
| `Captcha verification failed.` | Token was forged, expired, or belonged to a previous page load | Re-mint after any reload; never reuse |
| `Please complete the verification.` | Token field empty at submit time | Poll the hidden input, don't assume the widget finished |
| Widget spins on "Verifying..." forever | Burned profile, headless mode, or driver-launched browser | Fresh profile dir, headless off, CDP attach to self-launched Chrome |
| Token appears but submit fails after typing the username | `onchange` postback reloaded the page and invalidated both token and `__VIEWSTATE` | Set values via DOM, null out `onchange`, submit immediately |
| Login succeeds but next page redirects to login | Cookies not preserved across requests | Keep one browser context, or copy cookies into your HTTP client |
| Saved HTML has empty body, browser showed content | Captured before the app painted | Wait for a selector or marker text; raise `--wait-ms` |
| Report page shows only headers, no rows | Report viewer renders asynchronously, often in a second load | Fill the report parameters, submit, then wait for the table marker |
| Table parse returns nothing | Content is a div grid or nested table | Try `--card` with a class hint, or `--text` to see raw layout |
| `Frame was detached` while polling | The challenge iframe is replaced on retry | Re-resolve the frame each pass instead of holding a reference |
| Everything works, then breaks next day | Token/selector changed, or profile aged out | Re-scan selectors from the live page; use a fresh profile |
| Login works in a normal window but not in automation | Window occluded/minimised, or automation flags present | Keep the window visible; launch Chrome yourself rather than through the driver |
| `net::ERR_ABORTED` on CSS/JS assets | Assets genuinely 404 on the server | Ignore; it doesn't affect the flow |
| `postMessage ... target origin does not match` warnings | Widget/parent origin mismatch, often benign | Ignore unless the token never appears |

## Diagnostic order for a stuck login

Work top-down; each step rules out a whole class of cause.

1. **Can you load the page at all?** `curl_cffi` GET. If no, it's network/DNS/site-down, not automation.
2. **Is the token being minted?** Poll `input[name="cf-turnstile-response"]`. If it stays empty after ~20s on a fresh profile, it's [bot-checks.md](bot-checks.md), not your form code.
3. **Is the token accepted?** Submit deliberately with an empty token, then with a junk token. Different error strings distinguish "missing" from "invalid", which tells you whether the server is even evaluating it.
4. **Are the field names current?** Print the `name` of every input immediately before submitting. Random names must match the page you're about to post.
5. **Is the button field present?** Print the submit input's name and confirm it's in your payload.
6. **What does the server say?** Search the response body and inline scripts for `alert(`, `Swal.fire(`, `Invalid`, `error`. Server-side failures often surface only there.
7. **Did the destination actually change?** Compare URL and body against a known authenticated page, not against absence of errors.

## Credential handling

Read the password from an environment variable rather than a CLI argument — process listings and shell history are both trivially readable, and pasting a password into a chat or a script leaves it in transcripts and backups.

```python
password = os.environ["PORTAL_PASSWORD"]
```

Never write credentials into `session.json`, a config file, or a log. The session file only needs cookies, user agent, and the browser's debugging port.

## When to stop and hand back to the user

Stop automating and ask the user to complete the step themselves if:

- The bot check presents an interactive puzzle that doesn't clear on its own.
- The account requires MFA, an OTP, or a push approval you can't receive.
- The site reports the account locked.
- The next action would change state — payment, registration, application, deletion, password change — and the user didn't explicitly ask for it.

That isn't failure; it's the boundary. Offer the fallback: the user signs in interactively once, exports cookies or leaves the browser open, and you continue from there.
