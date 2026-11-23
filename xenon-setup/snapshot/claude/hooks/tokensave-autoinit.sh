#!/bin/sh
# Auto-index git projects with tokensave on session start (runs in background, never blocks).
TS="{{HOME}}/.local/bin/tokensave.exe"
top=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
[ -d "$top/.tokensave" ] && exit 0
case "$top" in ""|"/"|"$HOME"|"{{HOME}}") exit 0;; esac
(
  cd "$top" || exit 0
  echo n | "$TS" init >/dev/null 2>&1
  ex=$(git rev-parse --git-path info/exclude 2>/dev/null)
  [ -n "$ex" ] && mkdir -p "$(dirname "$ex")" && grep -qx ".tokensave" "$ex" 2>/dev/null || echo ".tokensave" >> "$ex"
) >/dev/null 2>&1 &
exit 0
