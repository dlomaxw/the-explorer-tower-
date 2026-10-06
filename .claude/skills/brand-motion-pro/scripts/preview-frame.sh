#!/bin/bash
# preview-frame.sh <project-dir> <frame-id> <t1,t2,...> [--sheet]
# Private preview of ONE frame, safe to run while other frames are being built in parallel (it never touches the
# project's index.html): makes /tmp/bf-preview-<frame-id>/ with symlinks to the project's assets, a mini index that
# mounts only that frame, runs `hyperframes snapshot` at the given frame-local times and prints the PNG paths.
# Open the PNGs (Read tool) to SEE the frame. Times are frame-local seconds.
set -euo pipefail
[ $# -ge 3 ] || { echo "usage: preview-frame.sh <project-dir> <frame-id> <t1,t2,...>" >&2; exit 2; }
PROJ="$(cd "$1" && pwd)"; ID="$2"; TIMES="$3"
export HYPERFRAMES_NO_TELEMETRY=1 DO_NOT_TRACK=1 HYPERFRAMES_SKIP_SKILLS=1 HYPERFRAMES_NO_UPDATE_CHECK=1
FILE="$PROJ/compositions/frames/$ID.html"; [ -f "$FILE" ] || { echo "no $FILE" >&2; exit 1; }
W="$(python3 -c "import json;print(json.load(open('$PROJ/meta.json'))['width'])")"
H="$(python3 -c "import json;print(json.load(open('$PROJ/meta.json'))['height'])")"
D="$(python3 - "$FILE" <<'PY'
import re,sys
t=open(sys.argv[1],encoding='utf-8').read()
m=re.search(r'data-composition-id="[^"]+"[^>]*data-duration="([\d.]+)"',t)
print(m.group(1) if m else "5")
PY
)"
T="/tmp/bf-preview-$ID"; mkdir -p "$T/compositions/frames"
ln -sfn "$PROJ/assets" "$T/assets"; ln -sfn "$PROJ/node_modules" "$T/node_modules"
cp "$PROJ/package.json" "$PROJ/meta.json" "$PROJ/hyperframes.json" "$T/" 2>/dev/null || true
cp "$FILE" "$T/compositions/frames/$ID.html"
GROUND="$(grep -o -- '--mk-bg:[^;]*' "$PROJ/assets/brand/tokens.css" | head -1 | cut -d: -f2)"
cat > "$T/index.html" <<HTML
<!doctype html>
<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=$W, height=$H" />
<script src="assets/vendor/gsap.min.js"></script>
<link rel="stylesheet" href="assets/fonts.css" /><link rel="stylesheet" href="assets/brand/tokens.css" /><link rel="stylesheet" href="assets/vendor/motion-kit.css" />
<style>*{margin:0;padding:0;box-sizing:border-box}html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000}
#root{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:${GROUND:-#000}}.scene{position:absolute;inset:0;width:100%;height:100%}</style></head>
<body><div id="root" data-composition-id="main" data-start="0" data-duration="$D" data-width="$W" data-height="$H">
<div id="el-$ID" class="scene" data-composition-id="$ID" data-composition-src="compositions/frames/$ID.html" data-start="0" data-duration="$D" data-track-index="1"></div></div>
<script>window.__timelines=window.__timelines||{};window.__timelines["main"]=gsap.timeline({paused:true});window.__timelines["main"].to({}, {duration:$D},0);</script>
</body></html>
HTML
cd "$T"; rm -rf snapshots
npx hyperframes snapshot --at "$TIMES" 2>&1 | grep -E "✗|error|Error|failed|snapshots/frame" || true
echo "PNGs: $T/snapshots/  (sheet: $T/snapshots/contact-sheet*.jpg)"
echo "--- check (frame alone) ---"
npx hyperframes check 2>&1 | grep -E "✗|⚠|error\(s\)|Check (passed|failed)" | cut -c1-220 | head -20 || true
