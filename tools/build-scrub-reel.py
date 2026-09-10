"""Build the scroll-scrubbed reel: the street, the drive in, and the interior.

Spec §3 rules out faking an exterior-to-interior camera move out of unrelated
stills, and says a real one needs approved matching footage. That footage now
exists, so this script joins the approved clips into a single reel in journey
order and encodes it for scrubbing rather than for playback.

Encoding for scrubbing is a different problem from encoding for play:
  * every frame is a keyframe, so any `currentTime` seek is exact and instant;
  * the frame rate is halved, because scrubbing follows the scroll rather than
    a clock and 12 fps is indistinguishable when the scroll drives it.

Resolution is NOT reduced. An earlier build encoded this at 960x540, and it
showed: the reel plays full-bleed on desktop, so it was being upscaled about
1.6x and the facade turned to mush. All-keyframe 1080p is expensive — roughly
34 MB against 7 MB — but the branch that fetches it is desktop-and-motion-only
and lazily mounted, so a phone never pays for it, and the sharp poster carries
the section until the reel has buffered.

Short GOPs were measured as an alternative (keyint 6 and 12) and saved only
about 25% on this material, which is high-motion at a low frame rate. That is
not worth giving up exact seeking, so every frame stays a keyframe.

Writes: site/public/media/journey/reel.mp4 plus first/last poster frames.
"""

import subprocess
from pathlib import Path

import imageio_ffmpeg

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "site" / "public" / "media"
OUT_DIR = PUBLIC / "journey"
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

WIDTH = 1920
HEIGHT = 1080
FPS = 12
CRF = "25"

# The journey, in order: arrive at the building, go under it, walk in, sit down,
# then up to the pool. Each source is an approved 5-second clip.
SEQUENCE = [
    PUBLIC / "exterior/film-3.mp4",              # looking up from the street
    PUBLIC / "exterior/film-2.mp4",              # driving in
    PUBLIC / "exterior/film-4.mp4",              # under the podium
    PUBLIC / "residences/3-bed/walkthrough-3.mp4",  # entrance hall
    PUBLIC / "residences/3-bed/walkthrough-4.mp4",  # living room
    PUBLIC / "exterior/film-1.mp4",              # the sky pool
]


# Must match CHAPTERS in src/components/scroll-journey.tsx.
CHAPTER_MARKS = [0.04, 0.21, 0.38, 0.55, 0.72, 0.9]


def run(args: list[str]) -> None:
    subprocess.run([FFMPEG, "-y", "-loglevel", "error", *args], check=True)


def main() -> None:
    missing = [clip for clip in SEQUENCE if not clip.exists()]
    if missing:
        raise SystemExit(
            "Run tools/encode-video.py first; missing:\n  "
            + "\n  ".join(str(m.relative_to(ROOT)) for m in missing)
        )

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    reel = OUT_DIR / "reel.mp4"

    # Normalise each clip to one exact size and rate before concatenating. The
    # sources are not all 16:9 — some are 3824x2192 — so they are scaled to
    # cover the frame and centre-cropped rather than letterboxed.
    inputs: list[str] = []
    filters: list[str] = []
    for index, clip in enumerate(SEQUENCE):
        inputs += ["-i", str(clip)]
        filters.append(
            f"[{index}:v]scale={WIDTH}:{HEIGHT}:force_original_aspect_ratio=increase"
            f":flags=lanczos,crop={WIDTH}:{HEIGHT},fps={FPS},"
            f"setsar=1,format=yuv420p[v{index}]"
        )

    joined = "".join(f"[v{i}]" for i in range(len(SEQUENCE)))
    graph = ";".join(filters) + f";{joined}concat=n={len(SEQUENCE)}:v=1:a=0[out]"

    run([
        *inputs,
        "-filter_complex", graph,
        "-map", "[out]",
        "-c:v", "libx264",
        "-preset", "slow",
        "-crf", CRF,
        "-pix_fmt", "yuv420p",
        # Every frame a keyframe: seeking is what this file exists for.
        "-x264-params", "keyint=1:min-keyint=1:scenecut=0",
        "-movflags", "+faststart",
        "-an",
        str(reel),
    ])

    # Posters at the reel's own resolution and near-max JPEG quality: the first
    # frame is what a visitor looks at until the reel buffers, so it carries the
    # section on its own and must not be the weak link.
    run(["-i", str(reel), "-frames:v", "1", "-q:v", "2", str(OUT_DIR / "first.jpg")])
    run(["-sseof", "-0.2", "-i", str(reel), "-frames:v", "1", "-q:v", "2",
         str(OUT_DIR / "last.jpg")])

    # One frame per chapter. Narrow screens do not scrub the reel — seeking
    # video on a phone is expensive — so they read the same journey as stacked
    # panels, and these are the images those panels use.
    duration = len(SEQUENCE) * 5.0
    for index, position in enumerate(CHAPTER_MARKS, start=1):
        run([
            "-ss", f"{position * duration:.2f}",
            "-i", str(reel),
            "-frames:v", "1", "-q:v", "2",
            str(OUT_DIR / f"chapter-{index}.jpg"),
        ])
    print(f"frames   {len(CHAPTER_MARKS)} chapter stills")

    size = reel.stat().st_size / 1_000_000
    print(f"reel     {reel.relative_to(PUBLIC)}  {size:.1f} MB  "
          f"({len(SEQUENCE)} clips, {WIDTH}x{HEIGHT}, {FPS} fps, all-keyframe)")


if __name__ == "__main__":
    main()
