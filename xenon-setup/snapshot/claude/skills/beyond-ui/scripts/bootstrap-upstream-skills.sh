#!/usr/bin/env bash
# beyond-ui bootstrap: install the upstream design skills this skill composes.
#
#   bash scripts/bootstrap-upstream-skills.sh            # project scope -> .agents/skills
#   bash scripts/bootstrap-upstream-skills.sh --global   # user scope    -> ~/.agents/skills
#   bash scripts/bootstrap-upstream-skills.sh --check    # report only, install nothing
#
# ONE destination, never two — see bootstrap-upstream-skills.mjs for why. Never silently skips:
# anything that fails to install is reported at the end with the reason.

set -uo pipefail

SCOPE_FLAG=""
AGENT_FLAG="-a universal"
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

if [ -n "$SCOPE_FLAG" ]; then
  SKILLS_DIR="${BEYOND_UI_SKILLS_DIR:-$HOME/.agents/skills}"
else
  SKILLS_DIR="${BEYOND_UI_SKILLS_DIR:-.agents/skills}"
fi

installed_list() {
  [ -d "$SKILLS_DIR" ] && ls -1 "$SKILLS_DIR" 2>/dev/null
}

report_installed() {
  echo "== currently installed skills in $SKILLS_DIR =="
  installed_list | sed 's/^/  /' | head -n 60
}

FAILED=()
MISSING=()

# --- CLI-installable skills (vercel-labs/skills layout) ----------------------
# Skill ids must match upstream exactly: the CLI installs nothing (exit 0) on a wrong name.
cli_install() { # repo, skill names...
  local repo="$1"; shift
  if [ "$CHECK_ONLY" -eq 1 ]; then return 0; fi
  local args=()
  for s in "$@"; do args+=(--skill "$s"); done
  echo "-> npx skills add $repo ${args[*]:-}"
  if [ "$have_npx" -eq 0 ]; then FAILED+=("$repo (npx unavailable)"); return 1; fi
  # -a universal pins the destination; without it the CLI fans out to every agent it detects.
  npx -y skills add "$repo" "${args[@]}" $AGENT_FLAG $SCOPE_FLAG -y || { FAILED+=("$repo (cli install failed)"); return 1; }
}

cli_install "vercel-labs/agent-skills" \
  web-design-guidelines vercel-react-best-practices vercel-composition-patterns \
  vercel-react-view-transitions vercel-react-native-skills

cli_install "addyosmani/agent-skills" frontend-ui-engineering

cli_install "anthropics/skills" frontend-design skill-creator

# --- clone-and-copy skills (repos that are not skills-CLI native) ------------
# Repos that are not skills-CLI native. Each clone is an explicit list of "relPath:destName" for the
# same reason as in the .mjs — several of these ship dozens of near-duplicate SKILL.md folders and the
# install set has to be pinned, not discovered. A path that moves upstream fails loudly.
clone_install() { # repo, "rel:dest" ...
  local repo="$1"; shift
  if [ "$CHECK_ONLY" -eq 1 ]; then return 0; fi
  local pending=() spec
  for spec in "$@"; do
    local dest="${spec##*:}"
    [ -f "$SKILLS_DIR/$dest/SKILL.md" ] || pending+=("$spec")
  done
  if [ "${#pending[@]}" -eq 0 ]; then
    echo "-> $repo: all skill(s) already present - skipping clone"
    return 0
  fi
  local tmp
  tmp="$(mktemp -d)"
  echo "-> git clone $repo"
  if ! git clone --depth 1 "$repo" "$tmp/repo" >/dev/null 2>&1; then
    FAILED+=("$repo (clone failed)"); rm -rf "$tmp"; return 1
  fi
  mkdir -p "$SKILLS_DIR"
  for spec in "${pending[@]}"; do
    local rel="${spec%%:*}" dest="${spec##*:}" src
    src="$tmp/repo/$rel"
    if [ ! -f "$src/SKILL.md" ]; then
      FAILED+=("$repo - expected skill at \"$rel\" (upstream layout changed?)")
      continue
    fi
    rm -rf "$SKILLS_DIR/$dest"
    cp -r "$src" "$SKILLS_DIR/$dest"
    echo "   installed $dest"
  done
  rm -rf "$tmp"
}

clone_install "https://github.com/pbakaus/impeccable" \
  ".agent/skills/impeccable:impeccable"
clone_install "https://github.com/nutlope/hallmark" \
  "skills/hallmark:hallmark"
clone_install "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill" \
  ".claude/skills/ui-ux-pro-max:ui-ux-pro-max" \
  ".claude/skills/ui-styling:ui-styling" \
  ".claude/skills/design-system:design-system"
clone_install "https://github.com/leonxlnx/taste-skill" \
  "skills/taste-skill:taste"
clone_install "https://github.com/bencium/bencium-claude-code-design-skill" \
  "bencium-controlled-ux-designer/skills/bencium-controlled-ux-designer:bencium-controlled-ux-designer" \
  "bencium-innovative-ux-designer/skills/bencium-innovative-ux-designer:bencium-innovative-ux-designer" \
  "bencium-impact-designer/skills/bencium-impact-designer:bencium-impact-designer"
clone_install "https://github.com/accesslint/claude-marketplace" \
  "plugins/accesslint/skills/accessibility-scan:accessibility-scan" \
  "plugins/accesslint/skills/accessibility-inspect:accessibility-inspect" \
  "plugins/accesslint/skills/accessibility-audit:accessibility-audit" \
  "plugins/accesslint/skills/accessibility-fix:accessibility-fix" \
  "plugins/accesslint/skills/accessibility-diff:accessibility-diff"
clone_install "https://github.com/gnurio/refactoring-ui-plugin" \
  "skills/meta-refactor-ui:refactor-ui" \
  "skills/01-establish-visual-hierarchy:establish-visual-hierarchy" \
  "skills/02-apply-typography-scale:apply-typography-scale" \
  "skills/03-build-color-palette:build-color-palette" \
  "skills/04-apply-consistent-spacing:apply-consistent-spacing" \
  "skills/05-design-button-hierarchy:design-button-hierarchy" \
  "skills/06-eliminate-visual-clutter:eliminate-visual-clutter" \
  "skills/07-design-empty-states:design-empty-states" \
  "skills/08-use-shadows-appropriately:use-shadows-appropriately" \
  "skills/09-manage-color-contrast:manage-color-contrast" \
  "skills/10-group-related-elements:group-related-elements"

report_installed

if [ "$CHECK_ONLY" -eq 1 ]; then
  echo
  echo "== capability report =="
  missing=()
  while IFS= read -r n; do
    if [ ! -f "$SKILLS_DIR/$n/SKILL.md" ]; then
      missing+=("$n")
    fi
  done <<'EOF'
web-design-guidelines
vercel-react-best-practices
vercel-composition-patterns
vercel-react-view-transitions
vercel-react-native-skills
frontend-ui-engineering
frontend-design
skill-creator
impeccable
hallmark
ui-ux-pro-max
ui-styling
design-system
taste
bencium-controlled-ux-designer
bencium-innovative-ux-designer
bencium-impact-designer
accessibility-scan
accessibility-inspect
accessibility-audit
accessibility-fix
accessibility-diff
refactor-ui
establish-visual-hierarchy
apply-typography-scale
build-color-palette
apply-consistent-spacing
design-button-hierarchy
eliminate-visual-clutter
design-empty-states
use-shadows-appropriately
manage-color-contrast
group-related-elements
EOF
  if [ "${#missing[@]}" -gt 0 ]; then
    printf '  MISSING:   %s\n' "${missing[@]}"
    echo
    echo "  ACTION REQUIRED: for each miss, fetch the upstream SKILL.md raw URL and read it before"
    echo "  doing UI work, then record it in .beyond-ui/state.json -> skills.missing."
    exit 1
  fi
  echo "  all upstream skills present."
  exit 0
fi

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


# ---- tool layer (beyond-ui v3 - always installed, skip-if-present) ----
echo
echo "== tool layer (capture/teardown) =="
SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"
node "$SKILL_DIR/scripts/install-tools.mjs" || echo "  TOOL LAYER INCOMPLETE - ultra teardown and verify are degraded until chromium is installed."
