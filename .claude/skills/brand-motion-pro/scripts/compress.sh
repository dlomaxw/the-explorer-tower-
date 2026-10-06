#!/bin/bash
# compress.sh <in.mp4> <out.mp4> [max-MB=28]
# Web copy of a render (H.264 + AAC, faststart). Raises the CRF until the file fits the chat/e-mail limit.
set -euo pipefail
IN="$1"; OUT="$2"; MAX="${3:-28}"
for CRF in 24 26 28 30 32 34; do
  ffmpeg -y -v error -i "$IN" -c:v libx264 -crf "$CRF" -preset medium -c:a aac -b:a 128k -movflags +faststart "$OUT"
  SZ=$(( $(stat -c %s "$OUT") / 1048576 ))
  echo "crf $CRF -> ${SZ} MB"
  [ "$SZ" -le "$MAX" ] && exit 0
done
echo "still above ${MAX} MB: lower the resolution or the duration" >&2; exit 1
