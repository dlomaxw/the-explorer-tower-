#!/bin/bash
# install.sh [--project]
# Installs the brand-motion-pro skill so Claude Code finds it anywhere:
#   default      ~/.claude/skills/brand-motion-pro   (all your projects, every session on this machine)
#   --project    ./.claude/skills/brand-motion-pro   (this repository only; commit it to share with the team)
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
if [ "${1:-}" = "--project" ]; then DEST="$PWD/.claude/skills/brand-motion-pro"; else DEST="$HOME/.claude/skills/brand-motion-pro"; fi
mkdir -p "$(dirname "$DEST")"
if [ "$HERE" != "$DEST" ]; then rm -rf "$DEST"; cp -r "$HERE" "$DEST"; fi
chmod +x "$DEST"/scripts/* "$DEST"/install.sh 2>/dev/null || true
echo "Installed: $DEST"
echo "Requirements: node 20+, npm, python3, ffmpeg. Optional: pip install pocketsphinx pillow (word alignment, logo colours)."
echo "Use it: tell Claude \"use the brand-motion-pro skill\" and give it your brand (logo, colours, fonts) or a website/repo to extract it from."
