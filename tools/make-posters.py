"""Generate poster frames for the walkthrough clips.

Every video on the site is click-to-play behind a still (spec §3: no automatic
playback). These posters are that still, taken from the clip itself so the
poster and the first frame the visitor sees always match.

Writes: site/public/media/residences/3-bed/walkthrough-N.jpg
"""

import subprocess
from pathlib import Path

import imageio_ffmpeg

ROOT = Path(__file__).resolve().parent.parent
MEDIA = ROOT / "site" / "public" / "media" / "residences" / "3-bed"
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

# Seconds into each clip to grab. Picked per clip so the poster shows the room
# at its most legible rather than mid-camera-move.
FRAME_AT = {1: 2.6, 2: 2.4, 3: 3.2, 4: 2.4, 5: 2.6, 6: 2.8}


def main() -> None:
    for index, seconds in FRAME_AT.items():
        source = MEDIA / f"walkthrough-{index}.mp4"
        target = MEDIA / f"walkthrough-{index}.jpg"
        if not source.exists():
            print(f"MISSING  {source.name}")
            continue

        subprocess.run(
            [
                FFMPEG,
                "-y",
                "-loglevel", "error",
                "-ss", str(seconds),
                "-i", str(source),
                "-frames:v", "1",
                "-q:v", "3",
                str(target),
            ],
            check=True,
        )
        print(f"poster   {target.name}  @{seconds}s  {target.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
