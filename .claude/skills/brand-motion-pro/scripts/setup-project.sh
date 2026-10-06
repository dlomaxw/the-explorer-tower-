#!/bin/bash
# setup-project.sh <project-dir> <brand.json>
# Creates a self-contained HyperFrames project for a brand-locked motion film:
#   - pinned local CLI (hyperframes 0.8.82) and gsap 3.14.2, vendored so no CDN is needed (CDNs are often blocked)
#   - brand tokens, fonts and the motion kit (brand-init.py)
#   - a starter index.html you build the film in (single file) or split into compositions/frames/*.html
# Run from anywhere. Needs node 20+, npm, python3, ffmpeg.
set -euo pipefail
[ $# -eq 2 ] || { echo "usage: setup-project.sh <project-dir> <brand.json>" >&2; exit 2; }
HERE="$(cd "$(dirname "$0")" && pwd)"; SKILL="$(dirname "$HERE")"
PROJ="$1"; BRAND="$(cd "$(dirname "$2")" && pwd)/$(basename "$2")"
mkdir -p "$PROJ"; PROJ="$(cd "$PROJ" && pwd)"; cd "$PROJ"
export HYPERFRAMES_NO_TELEMETRY=1 DO_NOT_TRACK=1 HYPERFRAMES_SKIP_SKILLS=1 HYPERFRAMES_NO_UPDATE_CHECK=1

NAME="$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['name'])" "$BRAND" | tr 'A-Z ' 'a-z-')"
W="$(python3 -c "import json,sys;print(json.load(open(sys.argv[1])).get('format',{}).get('width',1920))" "$BRAND")"
H="$(python3 -c "import json,sys;print(json.load(open(sys.argv[1])).get('format',{}).get('height',1080))" "$BRAND")"
FPS="$(python3 -c "import json,sys;print(json.load(open(sys.argv[1])).get('format',{}).get('fps',30))" "$BRAND")"

if [ ! -f package.json ]; then
  cat > package.json <<JSON
{ "name": "$NAME", "private": true, "version": "0.0.0",
  "dependencies": { "hyperframes": "0.8.82", "gsap": "3.14.2" } }
JSON
fi
npm install --silent --no-audit --no-fund
mkdir -p assets/vendor assets/img assets/audio compositions/frames renders
cp node_modules/gsap/dist/gsap.min.js assets/vendor/gsap.min.js
printf '{ "id": "%s", "name": "%s", "width": %s, "height": %s, "fps": %s }\n' "$NAME" "$NAME" "$W" "$H" "$FPS" > meta.json
printf '{ "$schema": "https://hyperframes.heygen.com/schema/hyperframes.json", "paths": { "blocks": "compositions", "components": "compositions/components", "assets": "assets" } }\n' > hyperframes.json
python3 "$HERE/brand-init.py" "$PROJ" "$BRAND" || echo "(contrast warnings above: fix the brand colours or accept knowingly)"
if [ ! -f index.html ]; then
  sed -e "s/{{W}}/$W/g" -e "s/{{H}}/$H/g" -e "s/{{NAME}}/$NAME/g" "$SKILL/templates/index.template.html" > index.html
fi
cat > .gitignore <<'GI'
node_modules/
renders/
snapshots/
.hyperframes/
GI
echo
echo "Project ready: $PROJ"
echo "Next: write the script, make the voice, then build index.html with the kit (see SKILL.md step 3)."
echo "Check: cd $PROJ && npx hyperframes check ; npx hyperframes snapshot --at 1,2,3 ; npx hyperframes render -q draft"
