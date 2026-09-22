#!/usr/bin/env bash
# beyond-ui bootstrap: install the upstream design skills this skill composes.
#
#   bash scripts/bootstrap-upstream-skills.sh            # project scope
#   bash scripts/bootstrap-upstream-skills.sh --global   # user scope (~/<agent>/skills)
#   bash scripts/bootstrap-upstream-skills.sh --check    # report only, install nothing
#
# Never silently skips: anything that fails to install is reported at the end with the reason.

set -uo pipefail

SCOPE_FLAG=""
CHECK_ONLY=0
for arg in "$@"; do
  case "$arg" in
    --global|-g) SCOPE_FLAG="-g" ;;
    --check) CHECK_ONLY=1 ;;
    *) echo "unknown arg: $arg" >&2 ;;
  esac
done

have_npx=1
command -v npx >/dev/null 2>&1 || have_npx=0

installed_list() {
  if [ "$have_npx" -eq 1 ]; then npx -y skills list 2>/dev/null; fi
  ls -1 .agents/skills .claude/skills ~/.claude/skills 2>/dev/null | sort -u
}

report_installed() {
  echo "== currently installed skills =="
  installed_list | sed 's/^/  /' | head -n 60
}

FAILED=()
MISSING=()

# --- CLI-installable skills (vercel-labs/skills layout) ----------------------
cli_install() { # repo, skill names...
  local repo="$1"; shift
  local args=()
  for s in "$@"; do args+=(--skill "$s"); done
  echo "-> npx skills add $repo ${args[*]:-}"
  if [ "$have_npx" -eq 0 ]; then FAILED+=("$repo (npx unavailable)"); return 1; fi
  npx -y skills add "$repo" "${args[@]}" $SCOPE_FLAG -y || { FAILED+=("$repo (cli install failed)"); return 1; }
}

cli_install "vercel-labs/agent-skills" \
  web-design-guidelines react-best-practices composition-patterns react-native-skills

cli_install "addyosmani/agent-skills" frontend-ui-engineering

cli_install "https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design/skills/frontend-design"

# --- clone-and-copy skills (repos that are not skills-CLI native) ------------
clone_install() { # url, dest-skill-name
  local url="$1" name="$2" tmp
  tmp="$(mktemp -d)"
  echo "-> git clone $url"
  if ! git clone --depth 1 "$url" "$tmp/repo" >/dev/null 2>&1; then
    FAILED+=("$url (clone failed)"); rm -rf "$tmp"; return 1
  fi
  local found
  found="$(find "$tmp/repo" -name SKILL.md -maxdepth 4 2>/dev/null | head -n 5)"
  if [ -z "$found" ]; then
    # No SKILL.md: keep the repo as reference material rather than pretending it installed.
    if [ -n "$SCOPE_FLAG" ]; then dest="$HOME/.beyond-ui/upstream/$name"; else dest=".beyond-ui/upstream/$name"; fi
    mkdir -p "$dest" && cp -r "$tmp/repo/." "$dest/"
    echo "   no SKILL.md - stored as reference at $dest"
  else
    if [ -n "$SCOPE_FLAG" ]; then base="$HOME/.claude/skills"; else base=".agents/skills"; fi
    mkdir -p "$base"
    while IFS= read -r skillmd; do
      cp -r "$(dirname "$skillmd")" "$base/$name-$(basename "$(dirname "$skillmd")")"
    done <<< "$found"
    echo "   installed to $base"
  fi
  rm -rf "$tmp"
}

clone_install "https://github.com/pbakaus/impeccable" impeccable
clone_install "https://github.com/nutlope/hallmark" hallmark
clone_install "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill" ui-ux-pro-max
clone_install "https://github.com/leonxlnx/taste-skill" taste
clone_install "https://github.com/bencium/bencium-claude-code-design-skill" bencium-design
clone_install "https://github.com/accesslint/claude-marketplace" accesslint

if [ "$CHECK_ONLY" -eq 1 ]; then
  report_installed
  echo "-- --check mode: nothing installed by this run"
fi

report_installed

echo
echo "== capability report =="
if [ "${#FAILED[@]}" -gt 0 ]; then
  echo "  missing / failed:"
  for f in "${FAILED[@]}"; do echo "    - $f"; done
  echo
  echo "  ACTION REQUIRED: for each failure, fetch the upstream SKILL.md raw URL and read it"
  echo "  before doing UI work, or record the miss in .beyond-ui/state.json -> skills.missing."
  echo "  Do NOT proceed as if the skill had been followed."
  exit 1
fi
echo "  all upstream skills present."


# ---- tool layer (beyond-ui v2 - always installed, skip-if-present) ----
echo
echo "== tool layer (capture/teardown) =="
SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"
node "$SKILL_DIR/scripts/install-tools.mjs" || echo "  TOOL LAYER INCOMPLETE - ultra teardown and verify are degraded until chromium is installed."
