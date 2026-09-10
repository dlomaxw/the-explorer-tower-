"""Prepare the developer and marketing logos for the website.

The supplied artwork is the two marks side by side — Shoal Group and 969
Development — on a large white square. They are a pair and are used as a pair:
this script only trims the surrounding white and makes it transparent, so the
relationship, spacing and proportions stay exactly as delivered. Nothing is
recoloured, reordered or separated.

Three colourways were supplied (charcoal, blue, navy). Charcoal is the one the
site uses; the others are kept in `content/brand/` in case the client changes
the approved version.

Bright Properties, the marketing agent, gets the same treatment from its own
supplied file. Both marks keep black or dark elements, so wherever either sits
on a dark ground the page puts it on a light plate rather than recolouring
approved brand artwork.

Writes: site/public/media/brand/developers.png
        site/public/media/brand/bright-properties.png
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
BRAND_OUT = ROOT / "site" / "public" / "media" / "brand"

# (source, output, margin in source pixels)
JOBS = [
    (
        ROOT / "content" / "brand" / "developers-charcoal.png",
        BRAND_OUT / "developers.png",
        10,
    ),
    (
        ROOT / "content" / "brand" / "bright logo nb.png",
        BRAND_OUT / "bright-properties.png",
        12,
    ),
]


def is_ground(pixel: tuple[int, int, int, int]) -> bool:
    """True for the white square the artwork was delivered on."""
    red, green, blue, alpha = pixel
    return alpha < 8 or (red > 246 and green > 246 and blue > 246)


def prepare(src: Path, out: Path, margin: int) -> None:
    if not src.exists():
        print(f"skipped  {src.name} (not supplied yet)")
        return

    image = Image.open(src).convert("RGBA")
    width, height = image.size
    pixels = image.load()

    left, right, top, bottom = width, -1, height, -1
    for y in range(height):
        for x in range(width):
            if not is_ground(pixels[x, y]):
                left = min(left, x)
                right = max(right, x)
                top = min(top, y)
                bottom = max(bottom, y)

    if right < 0:
        print(f"skipped  {src.name} (looks blank)")
        return

    box = (
        max(left - margin, 0),
        max(top - margin, 0),
        min(right + 1 + margin, width),
        min(bottom + 1 + margin, height),
    )
    cropped = image.crop(box)

    # Drop the white ground to transparency so the mark sits on the site's warm
    # stone rather than on a white patch that would read as a sticker.
    out_px = cropped.load()
    for y in range(cropped.height):
        for x in range(cropped.width):
            if is_ground(out_px[x, y]):
                out_px[x, y] = (0, 0, 0, 0)

    out.parent.mkdir(parents=True, exist_ok=True)
    cropped.save(out, optimize=True)
    print(
        f"logo     {out.name:<24} {cropped.width}x{cropped.height}  "
        f"{out.stat().st_size / 1000:.0f} KB"
    )


def main() -> None:
    for src, out, margin in JOBS:
        prepare(src, out, margin)


if __name__ == "__main__":
    main()
