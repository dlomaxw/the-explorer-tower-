"""Prepare the October 2026 amenity renders for delivery.

The supplied set is a mix: 1672x941 PNGs at ~2.5 MB each and a few 8K frames at
over 30 MB. None of that belongs in a deploy, so each is resized to a sensible
delivery width and written as a quality-80 WebP — typically 2 MB down to under
250 KB with no visible loss at the sizes the page actually renders.

Only the interior and grounds renders are taken. The exterior frames in the
same folder are deliberately left out: the site keeps its existing exterior
set, and mixing two different facade treatments would read as two buildings.
"""

from pathlib import Path

from PIL import Image

Image.MAX_IMAGE_PIXELS = None

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "content" / "amenities-2026-10"
DEST = ROOT / "site" / "public" / "media" / "amenities"

MAX_WIDTH = 1800
QUALITY = 80

# source file -> delivery slug
JOBS = {
    "Golden-hour travertine glass lounge (1).png": "lobby-lounge",
    "Ivory Travertine Sunken Lounge (2).png": "reception",
    "Walnut Media Dining Room with Travertine (3).png": "media-room",
    "Elegant Walnut and Travertine Boardroom (4).png": "conference-room",
    "Ivory Travertine Lounge and Dining (5).png": "residents-lounge",
    "Ivory travertine boardroom with walnut table (6).png": "meeting-room",
    "Warm ivory and walnut dining hall (10).png": "dining-hall",
    "Image14_000.png": "sauna",
    "IMG_0778_Playground_Render_8K.png": "playground",
}


def main() -> None:
    DEST.mkdir(parents=True, exist_ok=True)
    missing = [name for name in JOBS if not (SRC / name).exists()]
    if missing:
        raise SystemExit("missing:\n  " + "\n  ".join(missing))

    for name, slug in JOBS.items():
        source = SRC / name
        image = Image.open(source).convert("RGB")
        if image.width > MAX_WIDTH:
            height = round(image.height * MAX_WIDTH / image.width)
            image = image.resize((MAX_WIDTH, height), Image.LANCZOS)

        out = DEST / f"{slug}.webp"
        image.save(out, "WEBP", quality=QUALITY, method=6)
        print(
            f"  {slug:<18} {image.width}x{image.height}  "
            f"{source.stat().st_size / 1e6:5.1f} MB -> {out.stat().st_size / 1000:4.0f} KB"
        )


if __name__ == "__main__":
    main()
