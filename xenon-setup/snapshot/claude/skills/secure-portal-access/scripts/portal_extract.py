#!/usr/bin/env python3
"""Pull structured records out of a saved HTML capture.

Handles the two shapes almost every legacy portal uses: real <table> grids
and div-grid cards. Also lists every link so you can map the site without
clicking through it.

  python portal_extract.py dump/page.html --tables
  python portal_extract.py dump/page.html --links
  python portal_extract.py dump/page.html --label-value
  python portal_extract.py dump/page.html --json out.json
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

from bs4 import BeautifulSoup

BOILERPLATE = re.compile(
    r"(javascript:|^#$|^mailto:|__doPostBack)", re.IGNORECASE
)


def clean(value: str) -> str:
    return re.sub(r"\s+", " ", value or "").strip()


def tables(soup: BeautifulSoup, min_rows: int = 2) -> list[dict]:
    records = []
    for idx, table in enumerate(soup.find_all("table")):
        # Portal pages are full of layout tables and embedded form widgets.
        # Real data grids never contain inputs; skipping those keeps the
        # output focused on records rather than chrome.
        if table.find(["input", "select", "textarea"]):
            continue
        rows = []
        for tr in table.find_all("tr"):
            cells = [clean(td.get_text(" ", strip=True)) for td in tr.find_all(["td", "th"])]
            if any(cells):
                rows.append(cells)
        if len(rows) < min_rows:
            continue
        header, *body = rows
        width = len(header)
        shaped = [dict(zip(header, r)) for r in body if len(r) == width]
        records.append(
            {
                "table": idx,
                "id": table.get("id") or None,
                "headers": header,
                "row_count": len(body),
                "rows": shaped if shaped else body,
            }
        )
    records.sort(key=lambda r: r["row_count"], reverse=True)
    return records


def links(soup: BeautifulSoup, base: str) -> list[dict]:
    seen, out = set(), []
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if BOILERPLATE.search(href):
            continue
        key = (clean(a.get_text()), href)
        if key in seen:
            continue
        seen.add(key)
        out.append({"label": clean(a.get_text()), "href": href})
    return out


def label_value(soup: BeautifulSoup) -> dict:
    """Capture 'Label : value' pairs rendered as sibling text or table cells."""
    pairs = {}
    text = soup.get_text("\n", strip=True)
    for line in text.split("\n"):
        if ":" not in line:
            continue
        label, _, value = line.partition(":")
        label, value = clean(label), clean(value).lstrip(":").strip()
        if label and value and len(label) < 48 and label not in pairs:
            pairs[label] = value
    for tr in soup.find_all("tr"):
        cells = [clean(td.get_text(" ", strip=True)) for td in tr.find_all(["td", "th"])]
        for i in range(0, len(cells) - 1, 2):
            if cells[i] and cells[i + 1] and cells[i] not in pairs:
                pairs[cells[i].rstrip(":")] = cells[i + 1]
    return pairs


def cards(soup: BeautifulSoup, class_hint: str) -> list[dict]:
    out = []
    for node in soup.select(class_hint):
        text = clean(node.get_text(" ", strip=True))
        if not text:
            continue
        entry = {"text": text}
        href = node.find("a", href=True)
        if href and not BOILERPLATE.search(href["href"]):
            entry["href"] = href["href"]
        out.append(entry)
    return out


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("html")
    parser.add_argument("--tables", action="store_true")
    parser.add_argument("--links", action="store_true")
    parser.add_argument("--label-value", action="store_true")
    parser.add_argument("--card", default=None, help="CSS selector for repeated cards")
    parser.add_argument("--json", default=None)
    parser.add_argument("--text", action="store_true", help="plain rendered text")
    args = parser.parse_args()

    soup = BeautifulSoup(Path(args.html).read_text(encoding="utf-8"), "lxml")
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()

    payload: dict = {}
    if args.tables or not any([args.links, args.label_value, args.card, args.text]):
        payload["tables"] = tables(soup)
    if args.links:
        payload["links"] = links(soup, args.html)
    if args.label_value:
        payload["fields"] = label_value(soup)
    if args.card:
        payload["cards"] = cards(soup, args.card)
    if args.text:
        payload["text"] = soup.get_text("\n", strip=True)

    if args.json:
        Path(args.json).write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"wrote {args.json}")
    else:
        print(json.dumps(payload, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
