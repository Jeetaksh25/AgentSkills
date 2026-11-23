#!/usr/bin/env python3
"""Reuse a saved session to walk pages and dump their text.

Reattaches to the Chrome instance recorded in session.json (or relaunches a
headful Chrome with the saved cookies), visits each URL, and writes the
rendered text next to a full HTML capture.

  python portal_fetch.py --session session.json --out-dir dump \
      --url /lpuums/frmStudentProfile.aspx --url /lpuums/Reports/rptCourseWiseStudentAttendance.aspx

Relative URLs resolve against the base URL stored in the session file.
Pass --wait-ms for single-page apps that paint after load.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import re
import sys
import tempfile
from pathlib import Path
from urllib.parse import urljoin

import shutil
import subprocess
import time


def slug(url: str) -> str:
    tail = re.sub(r"[^A-Za-z0-9]+", "-", url.split("?")[0]).strip("-")
    return (tail[-80:] or "page").lower()


def launch(chrome: str, port: int, profile: Path):
    proc = subprocess.Popen(
        [
            chrome,
            f"--remote-debugging-port={port}",
            f"--user-data-dir={profile}",
            "--no-first-run",
            "--no-default-browser-check",
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
    return proc


async def collect(args, session: dict) -> int:
    from playwright.async_api import async_playwright

    playwright = await async_playwright().start()
    proc = None
    port = session.get("port")

    reuse = False
    if port and not args.fresh:
        try:
            browser = await playwright.chromium.connect_over_cdp(f"http://127.0.0.1:{port}")
            reuse = True
        except Exception:
            reuse = False

    if not reuse:
        if not args.chrome:
            raise SystemExit("session browser is gone; pass --chrome PATH to relaunch")
        port = port or 9333
        profile = Path(tempfile.gettempdir()) / f"portal-profile-{port}"
        shutil.rmtree(profile, ignore_errors=True)
        profile.mkdir(parents=True, exist_ok=True)
        proc = launch(args.chrome, port, profile)
        browser = await playwright.chromium.connect_over_cdp(f"http://127.0.0.1:{port}")
        context = browser.contexts[0]
        if session.get("cookies"):
            await context.add_cookies(session["cookies"])
        page = await context.new_page()
    else:
        context = browser.contexts[0]
        page = context.pages[0] if context.pages else await context.new_page()

    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    base = session.get("url", "")

    index = []
    for raw in args.url:
        target = urljoin(base, raw) if not raw.startswith("http") else raw
        entry = {"url": target}
        try:
            response = await page.goto(target, wait_until="load", timeout=90000)
            if args.wait_ms:
                await page.wait_for_timeout(args.wait_ms)
            text = await page.evaluate("() => document.body.innerText")
            html = await page.content()
            name = slug(target)
            (out_dir / f"{name}.txt").write_text(text, encoding="utf-8")
            (out_dir / f"{name}.html").write_text(html, encoding="utf-8")
            entry.update(
                status=response.status if response else None,
                chars=len(text),
                text_file=f"{name}.txt",
                title=await page.title(),
            )
        except Exception as exc:  # one bad page must not abort the batch
            entry.update(error=f"{type(exc).__name__}: {exc}")
        index.append(entry)
        print(json.dumps(entry), flush=True)

    (out_dir / "index.json").write_text(json.dumps(index, indent=2), encoding="utf-8")

    if proc and not args.keep_open:
        subprocess.run(
            ["taskkill", "/F", "/PID", str(proc.pid)], capture_output=True, check=False
        )
    await playwright.stop()
    return 0 if all("error" not in e for e in index) else 1


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--session", default="session.json")
    parser.add_argument("--url", action="append", required=True, help="repeatable")
    parser.add_argument("--out-dir", default="dump")
    parser.add_argument("--wait-ms", type=int, default=2500)
    parser.add_argument("--chrome", default=None)
    parser.add_argument("--fresh", action="store_true", help="ignore the saved browser")
    parser.add_argument("--keep-open", action="store_true")
    args = parser.parse_args()

    session = json.loads(Path(args.session).read_text(encoding="utf-8"))
    return asyncio.run(collect(args, session))


if __name__ == "__main__":
    raise SystemExit(main())
