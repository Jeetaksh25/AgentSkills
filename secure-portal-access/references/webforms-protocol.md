# Server-rendered form protocols (ASP.NET WebForms and relatives)

Many university, government, banking, and enterprise portals are WebForms applications. They behave in ways that break naive automation, and every one of those behaviours is deliberate enough that you can predict it once you know the pattern.

## Hidden state travels with every request

The login page contains a form whose hidden inputs carry session state:

```html
<input type="hidden" name="__VIEWSTATE" value="BSaOaubDYTzwv5A/dg4sGFsf...">
<input type="hidden" name="__VIEWSTATEGENERATOR" value="DD46A77E">
<input type="hidden" name="__EVENTVALIDATION" value="PYltpAqD9WmS730R...">
<input type="hidden" name="__EVENTTARGET" value="">
<input type="hidden" name="__EVENTARGUMENT" value="">
```

`__VIEWSTATE` is a server-issued snapshot of the control tree. It is opaque, tied to that exact page render, and becomes invalid the moment the server issues a new one. Practical rules:

- Scrape the hidden block from the *most recent* response, never from a cached copy.
- Re-read it after every page load, including after a postback.
- If a POST is rejected for no visible reason, a stale `__VIEWSTATE` is the usual culprit.

## Input names are deliberately random per render

Obfuscated fields change name on every page load:

```
load 1: <input name="bNjOkGW6Kg4V" type="password">
load 2: <input name="LpK4P6B2QRua" type="password">
load 3: <input name="QQgra2Iw53fL" type="password">
```

There is no stable selector. Find the field by **type** or **position**, then read its `name` attribute off the live DOM:

```python
pwd = form.find("input", {"type": "password"})
data[pwd["name"]] = password
```

The same applies to the submit button, which carries its own random name plus a random suffix (`LpK4P6B2QRua` field, `LpK4P6B2QRuauADKUH` button).

## The submit button's name must be in the body

This is the highest-value detail in this file. WebForms determines which control was activated by looking for that control's `name` among the posted fields. If you call `form.submit()` or post with only the text fields, the server treats it as a page load, not a click — so it re-renders the login page and returns **HTTP 200 with no error message**. It looks like the credentials were wrong. They weren't.

```python
btn = form.find("input", {"type": "submit"})
data[btn["name"]] = btn["value"]      # e.g. "Login"
```

Symptom to remember: correct-looking creds, 200 status, login page back, no error text. Check the button field first.

## onchange postbacks reload the page mid-flow

A username field often carries:

```html
<input name="txtU" onchange="setTimeout('__doPostBack(\'txtU\',\'\')', 0)">
```

Filling it and moving focus fires a full server round trip. The response is the same page, but with fresh `__VIEWSTATE`, fresh randomized field names, and — crucially — a freshly reset bot-check widget. A token minted before that reload is now void.

Two working strategies:

1. **Suppress the event.** Assign `.value` through the DOM and null out `onchange`, so no postback fires. Then mint the token and submit in one go.
2. **Embrace the reload.** Type normally, let the postback happen, re-scrape every hidden field and the new field names, wait for the *new* token, then submit.

Strategy 1 is faster and simpler when the site doesn't require the postback (many don't — the postback only refreshes server-side user data). Strategy 2 is more faithful to a real browser and is the safer fallback if strategy 1's POST is rejected.

## Multi-step forms

Some flows deliberately split across pages: username → next → password → next. Others render the password step conditionally. If a POST returns a page that still has a form, parse it and continue the sequence rather than assuming failure. Check whether the response asks for a different field before concluding anything.

## Telling success from failure

Never infer success from a 200. Check all three:

- **URL changed** to something behind the gate (`/Dashboard.aspx`, `/home`, `/portal`).
- **Body contains** content you'd only see when authenticated (the user's name, a nav menu, a logout link).
- **Failure markers absent.** Grep the body for the site's own phrasing: `Invalid User ID`, `Invalid Password`, `Captcha verification failed`, `Please complete the verification`, `Your account is locked`. These sites often surface errors in a JS modal rather than visible markup, so also scan inline scripts for `alert(` and `Swal.fire(` payloads.

A useful control is a deliberate bad-credential attempt early on. The resulting error text tells you exactly what a failure looks like, so your success check is grounded in observed behaviour instead of assumption.
