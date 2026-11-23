# Client-rendered portals and their APIs

Modern portals increasingly wrap the same legacy data in a React or Next.js shell. The URL you open and the URL serving the data are different, and that changes how you scrape.

## Recognising the shape

Signs the page is a shell:

- Body text is a few nav labels: `Search`, `Home`, `Log out` — nothing of substance.
- `document.body.innerText` returns a couple hundred characters while the browser visibly shows charts and tables.
- The HTML contains `__NEXT_DATA__`, `self.__next_f`, `<div id="root">`, or `window.__NUXT__`.
- An iframe points at a different host than the page you opened.

That last one matters: the outer page is often a thin ASP.NET wrapper that embeds the real app. Check `page.frames` — if a frame's URL is on a different subdomain, that frame is the app, and `page.content()` may not reflect it.

## Waiting correctly

Never sleep and hope. Wait for evidence the data arrived:

```python
await page.wait_for_selector("text=CGPA", timeout=60000)
```

or poll for a value:

```python
for _ in range(40):
    text = await page.evaluate("() => document.body.innerText")
    if "CGPA" in text:
        break
    await page.wait_for_timeout(1500)
```

Charts drawn on `<canvas>` have no text nodes, so their numbers never appear in `innerText`. If a figure only exists in a chart, take a screenshot, or find the API call that fed it.

## Reading the API instead of the DOM

For an SPA, intercepting the underlying requests is usually far more reliable than parsing rendered markup. Attach listeners before navigating:

```python
captured = []
async def on_response(response):
    if "/api/" in response.url:
        try:
            captured.append((response.url, await response.text()))
        except Exception:
            pass                     # navigated away before the body was readable
page.on("response", on_response)
```

Watch for these gotchas:

- **Bodies vanish on navigation.** Playwright can only read a response body until the page navigates. Read immediately inside the handler, and accept that some will be lost.
- **Auth is cookie- or token-based.** The SPA usually stores a bearer token or relies on the cookies your login produced. Reusing the same browser context means you inherit it for free; a fresh context needs the token.
- **Frameworks may stream.** A Next.js App Router response body can look like line-delimited records (`0:{"a":"$@1"...}`) rather than clean JSON. It is still parseable, just not with `json.loads` on the whole string.

If the API is plain REST with a bearer token, you can leave the browser behind once you have the token:

```python
requests.get(api_url, headers={"Authorization": f"Bearer {token}"}, impersonate="chrome")
```

Confirm with one call before committing to it — tokens expire, and some endpoints check origin headers the browser adds automatically.

## Navigating without clicking

Deep-linking works more often than people expect, including into SPAs that use token-in-query redirect wrappers:

```bash
--url /dashboard/examination/result/resultsummary
--url /dashboard/academics/studentSchemeReport
```

If the portal wraps these in an `openapp.aspx?...&pagename=...` redirect, feed that URL directly. The wrapper sets the SPA's auth cookie and forwards you.

Prefer deep links over UI clicking: no selector fragility, no scroll-dependent rendering, and the resulting URL is stable enough to script. Click UI only for state that has no URL — tabs, filters, expandable rows.

## Tabs and client-side state

Tabbed interfaces usually fetch on click and keep everything in memory. Click the tab, wait for its content marker, capture, then move on:

```python
await page.get_by_role("tab", name="Marks").click()
await page.wait_for_timeout(3000)
```

If the tab content is lazily fetched, its request URL is your shortcut next time — capture it as described above.
