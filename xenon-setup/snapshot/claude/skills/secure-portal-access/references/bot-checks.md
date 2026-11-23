# Bot checks and how to pass them

## What Turnstile actually does

The widget runs a JavaScript challenge in an iframe and, when satisfied, writes a token into a hidden input the surrounding form already contains:

```html
<div class="cf-turnstile" data-sitekey="0x4AAAAAAA..."></div>
<!-- becomes -->
<input type="hidden" name="cf-turnstile-response" value="1.uL9pl50...">
```

That token is sent with the form POST and verified **server-side** against Cloudflare's API. This has three consequences worth internalising:

- A token is single-use and short-lived. Reusing one after a page reload fails.
- An empty token produces an explicit message (`Please complete the verification.`); a forged one produces a different message (`Captcha verification failed.`). Those two errors are your fastest diagnostic — they tell you whether the token is missing or invalid.
- Nothing you do in `curl_cffi`, `requests`, or a headless HTTP stack can mint one. The token is the output of a browser fingerprint and behavioural assessment. Plan for a browser.

## Why a browser stalls on "Verifying..."

The widget resolves silently when it trusts the client. When it doesn't, it stays in the spinner state and never calls back. Common causes, in order of likelihood:

1. **The profile has history.** A `--user-data-dir` reused across automation runs accumulates telltale state. Always start from a directory that didn't exist five seconds ago.
2. **The driver launched the browser.** Playwright/Puppeteer-launched Chromium carries patches and launch flags the challenge notices. Launching Chrome yourself and connecting over CDP avoids the launch-time fingerprints entirely.
3. **The window is headless.** Turnstile commonly refuses to issue tokens in headless mode. Run headful; there is no reliable workaround, and a virtual display counts as headful.
4. **The window is occluded or minimised.** Some challenge paths require a rendered, composited frame. Keep the window visible.
5. **The profile is already signed into something else, or has too many tabs.** Close other browsers, use one window.

A fresh profile with a CDP-attached, headful Chrome typically resolves in 2–10 seconds. If a run takes longer than ~20 seconds, abandon it: kill Chrome, delete the profile, and start again. Waiting is not a strategy here.

## Detecting the outcome reliably

Poll the hidden input rather than the widget's visual state, because the DOM is what gets submitted:

```javascript
document.querySelector('input[name="cf-turnstile-response"]').value
```

Empty string means not yet. A value beginning `1.` is a live token. Poll this for roughly 15–30 seconds before reloading the page and trying again — each reload restarts the challenge from scratch and sometimes a second attempt passes where the first was unlucky.

## When it will never work

Some sites enable Turnstile's interactive mode, which presents a real checkbox or a picture puzzle. A click through CDP at the widget's coordinates sometimes satisfies it; more often it escalates. If you see a visible checkbox that does not resolve within a few seconds of clicking, stop — completing a human-verification puzzle programmatically is out of scope, and the honest move is to tell the user the site requires them to sign in interactively, then continue from an exported session if they provide one.

## Other check flavours

| Check | Signature | Approach |
|---|---|---|
| Cloudflare interstitial ("Just a moment...") | `challenge-platform`, 403/503 first response | Usually resolves on its own in a real browser; wait for network idle |
| hCaptcha | `hcaptcha.com`, `data-hcaptcha-sitekey` | Same token-in-hidden-input pattern as Turnstile |
| reCAPTCHA v2 | `gstatic.com/recaptcha`, iframe with checkbox | Interactive; treat like a human-verification puzzle |
| reCAPTCHA v3 | `grecaptcha.execute` in page JS, no visible widget | Score-based; a clean real browser usually passes silently |
| AWS WAF | `awswaf`, `captcha.awswaf.com` | Requires the `aws-waf-token` cookie; real browser needed |

The general pattern is identical across all of them: a hidden input or cookie appears when the check passes, and you poll for it instead of guessing timings.
