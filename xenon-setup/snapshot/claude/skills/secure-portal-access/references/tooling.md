# Tooling: install and verify the stack

## What's actually required

Only two things are non-negotiable for a Turnstile-gated portal:

1. **A real Chrome or Edge install.** Turnstile will not issue tokens to headless or patched browsers.
2. **Playwright's Python package**, used purely as a CDP client — it drives your Chrome but doesn't launch it.

Everything below is optional convenience.

## Verified install commands

```bash
python -m pip install -U playwright curl_cffi beautifulsoup4 lxml
```

`playwright install chromium` is **not** needed when you attach to a system Chrome over CDP. Install it only if you want Playwright's bundled builds for sites with no bot check.

Check what you have:

```bash
python -c "import playwright, curl_cffi, bs4, lxml; print('ok')"
python -c "from playwright.sync_api import sync_playwright; print('sync ok')"
```

## Optional: stealth browser builds

Two projects ship patched Firefox builds aimed at exactly this problem. They sometimes pass checks that plain Chrome doesn't, at the cost of a large download and slower startup. Try system Chrome first; reach for these only if it genuinely can't pass.

**Camoufox** — patched Firefox, patches C++ internals rather than JS shims:

```bash
python -m pip install -U "camoufox[geoip]"
python -m camoufox fetch
```

```python
from camoufox.sync_api import Camoufox
with Camoufox(headless=False) as browser:
    page = browser.new_page()
    page.goto(url)
```

Note: `camoufox[geoip]` needs Python ≤3.12 on some platforms; check the wheel availability before relying on it.

**Patchright** — a drop-in Playwright replacement that removes the CDP and `navigator.webdriver` tells:

```bash
python -m pip install -U patchright
```

```python
from patchright.async_api import async_playwright
```

It's API-identical to Playwright, so swapping the import is usually the whole change. Worth trying when you need driver-launched convenience but Chrome-over-CDP isn't available (containers, CI).

**browser-use** — an LLM-driven browser agent. Useful when a flow is genuinely unpredictable and you'd rather describe the goal than script clicks. It requires Python ≥3.11 on every published release, so it won't install on 3.10:

```bash
python -m pip install -U browser-use
```

Treat it as a last resort for this task: an agent clicking through a login is slower and less deterministic than a scripted flow, and it still can't pass an interactive puzzle.

**scrapling** — a scraping framework with its own stealth fetchers and a Cloudflare solver:

```bash
python -m pip install -U scrapling
```

It exposes `StealthyFetcher` and session objects that wrap patchright/camoufox. Useful for ordinary protected pages, but note its Cloudflare solver targets interstitials and embedded widgets; it cannot manufacture a Turnstile token for an arbitrary site key on demand.

## MCP servers and plugins

If your agent supports MCP, a browser-automation server can replace hand-rolled Playwright for the exploration phase. The ones worth knowing:

- **Scrapling MCP** (community, `Jeetaksh25/Scrapling-Plugin`) — exposes `open_session`, `session_fetch`, `stealthy_fetch` and friends as tools. Session objects persist cookies, which is handy for re-reading a portal across turns. Caveat observed in practice: its `session_fetch` can time out on slow portals while a direct CDP-attached Playwright call succeeds, so don't treat it as the only path.
- **Playwright MCP** (`microsoft/playwright-mcp`) — accessibility-tree-driven browser control, good for click-through exploration.

Either is fine for discovering the flow; do the actual login with the scripted approach because it needs precise DOM control.

## Verifying the browser can be driven

Before debugging a portal, confirm the harness works:

```python
import subprocess, tempfile, time
from pathlib import Path
from playwright.async_api import async_playwright

chrome = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
profile = Path(tempfile.gettempdir()) / "cdp-check"
subprocess.Popen([chrome, "--remote-debugging-port=9333",
                  f"--user-data-dir={profile}", "about:blank"])

async with async_playwright() as pw:
    browser = await pw.chromium.connect_over_cdp("http://127.0.0.1:9333")
    page = browser.contexts[0].pages[0]
    await page.goto("https://example.com")
    print(await page.title())
```

If that prints a title, your stack is sound and any further failure is portal-specific.
