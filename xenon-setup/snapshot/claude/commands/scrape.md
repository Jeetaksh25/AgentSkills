---
description: Fetch a URL with Scrapling and return clean, AI-targeted content
argument-hint: <url> [css-selector]
allowed-tools: Bash, Read
---

Fetch `$1` with Scrapling and return its content.

Follow the **scrapling** skill. Do this:

1. If Scrapling MCP tools are available (`make_request`, `fetch`, `stealthy_fetch`), use them — `make_request` first, escalating to `fetch` then `stealthy_fetch` if the content is empty, JS-only, or blocked.
2. Otherwise use the CLI, writing to a temp file and reading it back:
   - `scrapling extract get "$1" <tmp>.md --ai-targeted`
   - add `--css-selector "$2"` when a selector was given
3. If no selector was given, find the field the user actually wants and write a CSS selector for it rather than returning the whole page.
4. Report the extracted content as markdown, then delete any temp file.

Never fetch credentials or private data from a domain the user did not name.
