#!/usr/bin/env python3
"""Log into a Turnstile-gated ASP.NET portal in a real Chrome and save the session.

Launches Chrome with a throwaway profile over CDP, waits for a genuine
Turnstile token, submits the login form the way the browser would, then
writes session.json (cookies + CDP port) for the companion scripts.

  python portal_login.py --config targets/aspnet-turnstile.json --user 12345678

Password comes from --password or the PORTAL_PASSWORD env var.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import os
import socket
import subprocess
import sys
import tempfile
import time
from pathlib import Path

import shutil

CHROME_CANDIDATES = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
]


def find_chrome(override: str | None = None) -> str:
    if override:
        return override
    for path in CHROME_CANDIDATES:
        if Path(path).exists():
            return path
    found = shutil.which("chrome") or shutil.which("google-chrome") or shutil.which("chromium")
    if found:
        return found
    raise SystemExit("No Chrome/Chromium found. Pass --chrome PATH.")


def free_port() -> int:
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def launch_chrome(chrome: str, port: int, profile: Path) -> subprocess.Popen:
    proc = subprocess.Popen(
        [
            chrome,
            f"--remote-debugging-port={port}",
            f"--user-data-dir={profile}",
            "--no-first-run",
            "--no-default-browser-check",
            "--disable-blink-features=AutomationControlled",
            "about:blank",
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    import urllib.request

    for _ in range(60):
        try:
            urllib.request.urlopen(f"http://127.0.0.1:{port}/json/version", timeout=1).read()
            return proc
        except Exception:
            time.sleep(0.5)
    proc.kill()
    raise SystemExit("Chrome did not expose its debugging port.")


async def wait_for_token(page, selector: str, reloads: int, per_reload: int) -> tuple[str, int]:
    """Turnstile only emits a token once it silently decides the client is human.

    On a warmed-up or automated profile it can sit on 'Verifying...' forever,
    so each attempt starts from a cold navigation. A fresh profile usually
    resolves on the first or second load; older profiles never do.
    """
    for attempt in range(reloads):
        await page.reload(wait_until="domcontentloaded")
        await page.wait_for_timeout(2500)
        for _ in range(per_reload):
            token = await page.evaluate(
                "(sel) => { const el = document.querySelector(sel); return el ? el.value : ''; }",
                selector,
            )
            if token:
                return token, attempt
            await page.wait_for_timeout(1500)
    return "", reloads


async def do_login(args, cfg) -> tuple[int, dict]:
    from playwright.async_api import async_playwright

    chrome = find_chrome(args.chrome)
    port = free_port()
    profile = Path(tempfile.gettempdir()) / f"portal-profile-{port}"
    shutil.rmtree(profile, ignore_errors=True)
    profile.mkdir(parents=True, exist_ok=True)

    proc = launch_chrome(chrome, port, profile)
    playwright = await async_playwright().start()
    browser = await playwright.chromium.connect_over_cdp(f"http://127.0.0.1:{port}")
    context = browser.contexts[0]
    page = context.pages[0] if context.pages else await context.new_page()

    await page.goto(cfg["login_url"], wait_until="domcontentloaded", timeout=90000)

    token, attempt = await wait_for_token(
        page, cfg["token_selector"], args.reloads, args.token_polls
    )
    if not token:
        return 1, {
            "ok": False,
            "stage": "turnstile",
            "detail": (
                f"No Turnstile token after {args.reloads} reloads. "
                "Try closing every other Chrome window, deleting the profile "
                f"directory {profile}, and rerunning; also confirm the sitekey "
                "in the page has not changed."
            ),
            "port": port,
        }

    # Filling through the DOM (rather than typing) keeps the user-id field's
    # onchange postback from firing. That postback reloads the page and
    # invalidates __VIEWSTATE plus the freshly minted token.
    outcome = await page.evaluate(
        """(opts) => {
            const form = document.querySelector(opts.formSelector) || document.forms[0];
            const user = document.querySelector(opts.userSelector);
            const pass = document.querySelector(opts.passwordSelector);
            const submit = form.querySelector(opts.submitSelector);
            if (!form || !user || !pass) return {ok: false, why: 'field-missing'};

            user.value = opts.user;
            user.onchange = null;
            user.setAttribute('onchange', '');
            pass.value = opts.password;

            const target = form.querySelector('input[name="__EVENTTARGET"]');
            const argument = form.querySelector('input[name="__EVENTARGUMENT"]');
            if (target) target.value = '';
            if (argument) argument.value = '';

            if (!submit) return {ok: false, why: 'submit-missing'};
            // HTMLFormElement.submit() omits the clicked control, so WebForms
            // would treat this as a plain page load and silently re-render the
            // login form. Mirror the button into a hidden input.
            const mirror = document.createElement('input');
            mirror.type = 'hidden';
            mirror.name = submit.name;
            mirror.value = submit.value;
            form.appendChild(mirror);

            const info = {
                ok: true,
                formAction: form.action,
                passwordField: pass.name,
                submitField: submit.name,
                tokenLength: (document.querySelector(opts.tokenSelector) || {}).value?.length || 0,
            };
            HTMLFormElement.prototype.submit.call(form);
            return info;
        }""",
        {
            "formSelector": cfg.get("form_selector", "form"),
            "userSelector": cfg["user_selector"],
            "passwordSelector": cfg.get("password_selector", "input[type=password]"),
            "submitSelector": cfg.get("submit_selector", "input[type=submit]"),
            "tokenSelector": cfg["token_selector"],
            "user": args.user,
            "password": args.password,
        },
    )

    if not outcome.get("ok"):
        return 1, {"ok": False, "stage": "form", "detail": outcome, "port": port}

    await page.wait_for_load_state("domcontentloaded")
    await page.wait_for_timeout(cfg.get("settle_ms", 6000))

    # A redirect chain can still be mid-flight, leaving document.body briefly
    # null. Poll until the document is real instead of failing the run.
    body, url = "", page.url
    for _ in range(10):
        try:
            body = (await page.evaluate("() => document.body ? document.body.innerText : ''")) or ""
            url = page.url
            if body:
                break
        except Exception:
            pass
        await page.wait_for_timeout(1500)

    markers = cfg.get("failure_markers", [])
    failure = next((m for m in markers if m.lower() in body.lower()), None)
    success = cfg.get("success_url_contains", "") in url
    if not success:
        success = all(k.lower() in body.lower() for k in cfg.get("success_body_contains", []))

    cookies = await context.cookies()
    user_agent = await page.evaluate("() => navigator.userAgent")

    result = {
        "ok": bool(success and not failure),
        "stage": "login",
        "attempt": attempt,
        "url": url,
        "failure_marker": failure,
        "token_length": outcome.get("tokenLength"),
        "password_field": outcome.get("passwordField"),
        "submit_field": outcome.get("submitField"),
        "port": port,
        "pid": proc.pid,
        "profile": str(profile),
        "user_agent": user_agent,
        "cookies": cookies,
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "body_head": body[:400],
    }
    return (0 if result["ok"] else 1), result


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", required=True, help="target descriptor json")
    parser.add_argument("--user", required=True)
    parser.add_argument("--password", default=os.environ.get("PORTAL_PASSWORD"))
    parser.add_argument("--out", default="session.json")
    parser.add_argument("--chrome", default=None)
    parser.add_argument("--reloads", type=int, default=8)
    parser.add_argument("--token-polls", type=int, default=14)
    parser.add_argument("--close-browser", action="store_true", help="kill Chrome on exit")
    args = parser.parse_args()

    if not args.password:
        print("error: pass --password or set PORTAL_PASSWORD", file=sys.stderr)
        return 2

    cfg = json.loads(Path(args.config).read_text(encoding="utf-8"))
    code, result = asyncio.run(do_login(args, cfg))

    if args.close_browser and result.get("pid"):
        subprocess.run(
            ["taskkill", "/F", "/PID", str(result["pid"])],
            capture_output=True,
            check=False,
        ) if os.name == "nt" else os.kill(result["pid"], 9)
        result["browser_closed"] = True

    result.pop("password", None)
    Path(args.out).write_text(json.dumps(result, indent=2), encoding="utf-8")

    print(json.dumps({k: v for k, v in result.items() if k != "cookies"}, indent=2))
    return code


if __name__ == "__main__":
    raise SystemExit(main())
