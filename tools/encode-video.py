"""Produce web delivery variants and posters for the supplied clips.

Spec §4 asks for approved originals to be preserved and optimised delivery
variants created from them. The masters here are 4K at 35-55 Mbps — fine as
archive, unusable over a Kampala mobile connection — so this script writes a
1080p H.264 variant plus a JPEG poster into `site/public/media/`, and never
touches the source files.

Requires imageio-ffmpeg (`python -m pip install imageio-ffmpeg`).

Usage:  python tools/encode-video.py [--force]
"""

import subprocess
import sys
from pathlib import Path

import imageio_ffmpeg

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "site" / "public" / "media"
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

# Long edge of the delivery variant. The clips are establishing shots played in
# a wide frame, so 1080p is the useful ceiling.
MAX_HEIGHT = 1080
CRF = "24"

Job = tuple[Path, str, float]

EXTERIOR_SRC = ROOT / "exterior video animation"
INTERIOR_SRC = ROOT / "3bedroom render video"


def jobs() -> list[Job]:
    """(source, output slug without extension, poster timestamp in seconds)."""
    found: list[Job] = []

    # Exterior clips are named by upload id; sorting keeps the order stable so
    # the slugs do not shuffle between runs.
    for index, source in enumerate(sorted(EXTERIOR_SRC.glob("*.mp4")), start=1):
        found.append((source, f"exterior/film-{index}", 2.5))

    for index in range(1, 7):
        source = INTERIOR_SRC / f"3bedroom  ({index}).mp4"
        if source.exists():
            found.append((source, f"residences/3-bed/walkthrough-{index}", 2.6))

    return found


def encode(source: Path, target: Path, force: bool) -> bool:
    if target.exists() and not force:
        return False

    target.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [
            FFMPEG, "-y", "-loglevel", "error",
            "-i", str(source),
            # Scale down only; never upscale a clip that is already smaller.
            "-vf", f"scale=-2:'min({MAX_HEIGHT},ih)':flags=lanczos",
            "-c:v", "libx264",
            "-profile:v", "high",
            "-preset", "slow",
            "-crf", CRF,
            "-pix_fmt", "yuv420p",
            # Metadata at the front so playback can start before the full file
            # has arrived.
            "-movflags", "+faststart",
            # These are silent architectural renders.
            "-an",
            str(target),
        ],
        check=True,
    )
    return True


def poster(source: Path, target: Path, at: float, force: bool) -> bool:
    if target.exists() and not force:
        return False

    target.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [
            FFMPEG, "-y", "-loglevel", "error",
            "-ss", str(at),
            "-i", str(source),
            "-frames:v", "1",
            "-vf", f"scale=-2:'min({MAX_HEIGHT},ih)':flags=lanczos",
            "-q:v", "3",
            str(target),
        ],
        check=True,
    )
    return True


def main() -> None:
    force = "--force" in sys.argv
    encoded = postered = skipped = 0

    for source, slug, at in jobs():
        video = PUBLIC / f"{slug}.mp4"
        still = PUBLIC / f"{slug}.jpg"

        if encode(source, video, force):
            encoded += 1
            before = source.stat().st_size / 1_000_000
            after = video.stat().st_size / 1_000_000
            print(f"video    {slug}.mp4   {before:.1f} MB -> {after:.1f} MB")
        else:
            skipped += 1

        if poster(source, still, at, force):
            postered += 1
            print(f"poster   {slug}.jpg   {still.stat().st_size // 1024} KB")

    print(f"\n{encoded} encoded, {postered} posters, {skipped} already present")


if __name__ == "__main__":
    main()
