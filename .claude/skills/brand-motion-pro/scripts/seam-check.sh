#!/bin/bash
# seam-check.sh <project-dir> <seam-time> [<seam-time> ...]
# Snapshots the image 1 frame BEFORE and 1 frame AFTER every seam (cut between two frames/scenes) and builds contact
# sheets. A seam is invisible only if both images show the same camera, the same objects, the same blur, nothing doubled
# and nothing missing. Compare each pair by eye; send mismatches back to the frame builder with the two file names.
set -euo pipefail
[ $# -ge 2 ] || { echo "usage: seam-check.sh <project-dir> <t> [<t>...]" >&2; exit 2; }
cd "$1"; shift
export HYPERFRAMES_NO_TELEMETRY=1 DO_NOT_TRACK=1 HYPERFRAMES_SKIP_SKILLS=1 HYPERFRAMES_NO_UPDATE_CHECK=1
AT=$(python3 - "$@" <<'PY'
import sys
print(",".join(f"{float(t)-0.033:.3f},{float(t)+0.033:.3f}" for t in sys.argv[1:]))
PY
)
rm -rf snapshots
npx hyperframes snapshot --at "$AT" 2>&1 | tail -4
echo "Read snapshots/contact-sheet-*.jpg (pairs: before, after each seam) and the single PNGs for detail."
