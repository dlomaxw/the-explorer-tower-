"""Build the browser and device icons from the Explorer mark.

The mark and the "EXPLORER" wordmark are one image, but a favicon is rendered
at 16-32px: the wordmark is illegible there and only muddies the shape. So the
goat and hill are cropped out on their own and the lettering is dropped, which
is what a favicon of a wordmarked logo is supposed to be.

The mark is a single gold hairline on white. Reproduced that way it is
invisible at favicon size: scaled to 16px the line falls below one pixel and
what survives is a pale smudge. Thickening the stroke does not rescue it
either — the drawing turns to mush before it turns legible.

So the icon uses the *silhouette*. The outline is closed, the outside is
flood-filled, and whatever the line encloses becomes a solid shape: the goat on
its hill, as a mass rather than as a contour. A solid shape survives any
reduction, which is the whole job of a favicon. It is drawn in cream on the
brand gold for contrast against light and dark browser chrome alike.

Writes: site/src/app/icon.png        (browser tab, picked up by Next)
        site/src/app/apple-icon.png  (iOS home screen)
        site/public/favicon.ico      (legacy, multi-size)
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "content" / "logo-colourways" / "white-gold.png"
APP = ROOT / "site" / "src" / "app"
PUBLIC = ROOT / "site" / "public"

CREAM = (247, 244, 237, 255)
GOLD = (138, 95, 28, 255)

GROUND = GOLD
INK = CREAM

# The supplied square is mark above, wordmark below. Keep the top portion only.
MARK_BOTTOM = 0.70


def trim(image: Image.Image) -> Image.Image:
    """Crop to the drawn pixels, ignoring the white ground."""
    pixels = image.convert("RGBA").load()
    width, height = image.size
    left, right, top, bottom = width, -1, height, -1

    for y in range(height):
        for x in range(width):
            red, green, blue, alpha = pixels[x, y]
            if alpha > 8 and not (red > 244 and green > 244 and blue > 244):
                left, right = min(left, x), max(right, x)
                top, bottom = min(top, y), max(bottom, y)

    if right < 0:
        raise SystemExit("logo source looks blank")
    return image.crop((left, top, right + 1, bottom + 1))


def key_out_white(image: Image.Image) -> Image.Image:
    """Turn the white delivery ground transparent.

    Without this the mark arrives as gold-on-white and pasting it onto the
    cream canvas leaves a visible white rectangle around the drawing.
    """
    image = image.convert("RGBA")
    pixels = image.load()
    for y in range(image.height):
        for x in range(image.width):
            red, green, blue, _ = pixels[x, y]
            if red > 240 and green > 240 and blue > 240:
                pixels[x, y] = (0, 0, 0, 0)
    return image


def silhouette(image: Image.Image) -> Image.Image:
    """Solid shape from the outline: flood the outside, keep what is enclosed.

    `close` bridges the hairline's small gaps first, so the flood cannot leak
    through the drawing and swallow the animal along with the background.
    """
    pixels = image.convert("RGBA").load()
    drawn = Image.new("L", image.size, 0)
    target = drawn.load()
    for y in range(image.height):
        for x in range(image.width):
            red, green, blue, _ = pixels[x, y]
            target[x, y] = 0 if (red > 240 and green > 240 and blue > 240) else 255

    closed = drawn.filter(ImageFilter.MaxFilter(5))
    flood = closed.copy()
    ImageDraw.floodfill(flood, (0, 0), 128, thresh=10)

    mask = Image.new("L", image.size, 0)
    out, flooded, line = mask.load(), flood.load(), closed.load()
    for y in range(image.height):
        for x in range(image.width):
            if flooded[x, y] == 0 or line[x, y] == 255:
                out[x, y] = 255

    shape = Image.new("RGBA", image.size, INK)
    shape.putalpha(mask)
    return shape


def trim_alpha(image: Image.Image) -> Image.Image:
    box = image.getchannel("A").getbbox()
    return image.crop(box) if box else image


def build(size: int, padding: float = 0.12) -> Image.Image:
    source = Image.open(SRC).convert("RGBA")
    mark = source.crop((0, 0, source.width, int(source.height * MARK_BOTTOM)))
    mark = trim_alpha(silhouette(mark))

    box = int(size * (1 - padding * 2))
    scale = min(box / mark.width, box / mark.height)
    drawn = mark.resize(
        (max(int(mark.width * scale), 1), max(int(mark.height * scale), 1)),
        Image.LANCZOS,
    )

    canvas = Image.new("RGBA", (size, size), GROUND)
    canvas.paste(drawn, ((size - drawn.width) // 2, (size - drawn.height) // 2), drawn)
    return canvas


def main() -> None:
    APP.mkdir(parents=True, exist_ok=True)

    icon = build(512)
    icon.save(APP / "icon.png", optimize=True)
    print(f"icon     icon.png         512x512  {(APP / 'icon.png').stat().st_size / 1000:.0f} KB")

    # Apple wants a filled square with no transparency and less inset.
    apple = build(180, padding=0.10).convert("RGB")
    apple.save(APP / "apple-icon.png", optimize=True)
    print(f"icon     apple-icon.png   180x180  {(APP / 'apple-icon.png').stat().st_size / 1000:.0f} KB")

    # Legacy .ico carries several sizes; browsers pick what they need.
    ico = PUBLIC / "favicon.ico"
    build(256).save(ico, sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
    print(f"icon     favicon.ico      multi    {ico.stat().st_size / 1000:.0f} KB")


if __name__ == "__main__":
    main()
