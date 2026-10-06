#!/bin/bash
# build.sh <target-dir>  : builds the Northwind demo film (fictional brand, 16 s, 1920x1080) into <target-dir>.
# It shows every capability of the kit: footage under a brand grade, draw-on logo, 3D browser mockup with live charts,
# animated icon tiles, rolling counters, a phone in 3D with footage on its screen, toast/toggle/progress UI, a subtitle
# with the single key-word box, a cursor that clicks a CTA, light sweep and a living end hold.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; SK="$(dirname "$(dirname "$HERE")")"
T="$1"
ALLOW_EXAMPLE=1 bash "$SK/scripts/setup-project.sh" "$T" "$HERE/brand.json"
cp "$HERE/index.html" "$T/index.html"; mkdir -p "$T/assets/video"; cp "$HERE"/assets/video/*.mp4 "$T/assets/video/"
cd "$T"
ALLOW_EXAMPLE=1 python3 "$SK/scripts/brand-lint.py" . ; python3 "$SK/scripts/comp-lint.py" .
export HYPERFRAMES_NO_TELEMETRY=1 DO_NOT_TRACK=1 HYPERFRAMES_SKIP_SKILLS=1 HYPERFRAMES_NO_UPDATE_CHECK=1
npx hyperframes check
echo "render:  cd $T && npx hyperframes render -q draft -o renders/demo.mp4"
