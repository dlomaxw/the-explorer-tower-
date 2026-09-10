"""Copy approved source media from content/ into site/public/media/ under stable slugs.

Source files keep their original names in content/ (the master library). The site
references only the slugs written here, so re-running after a content update is safe.
"""
import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "content"
DEST = ROOT / "site" / "public" / "media"

I3 = SRC / "interior" / "3 bedroom"
I2 = SRC / "interior" / "2 bedroom"
VID = SRC / "video animation"

MAP = {
    # exterior renders
    "exterior/street-golden-hour.png": SRC / "13.png",
    "exterior/front-elevation-dusk.png": SRC / "14.png",
    "exterior/section-cutaway-dusk.png": SRC / "15.png",
    "exterior/corner-evening.png": SRC / "16.png",
    "exterior/corner-daylight.png": SRC / "17.png",
    "exterior/arrival-podium.png": SRC / "18.png",
    # amenities
    "amenities/sky-pool-terrace.png": SRC / "pool.png",
    "amenities/sky-pool-facade.png": SRC / "pool close view.png",
    # three-bedroom residence
    "residences/3-bed/living.png": I3 / "ChatGPT Image Sep 7, 2026, 12_22_02 PM (1).png",
    "residences/3-bed/dining.png": I3 / "ChatGPT Image Sep 7, 2026, 12_22_03 PM (2).png",
    "residences/3-bed/kitchen.png": I3 / "ChatGPT Image Sep 7, 2026, 12_22_04 PM (3).png",
    "residences/3-bed/principal-bedroom.png": I3 / "ChatGPT Image Sep 7, 2026, 12_22_05 PM (4).png",
    "residences/3-bed/principal-bathroom.png": I3 / "ChatGPT Image Sep 7, 2026, 12_22_06 PM (5).png",
    "residences/3-bed/entrance-hall.png": I3 / "ChatGPT Image Sep 7, 2026, 12_22_07 PM (6).png",
    "residences/3-bed/guest-bedroom.png": I3 / "ChatGPT Image Sep 7, 2026, 12_22_08 PM (7).png",
    # two-bedroom residence
    "residences/2-bed/living.png": I2 / "ChatGPT Image Sep 7, 2026, 12_38_58 PM (1).png",
    "residences/2-bed/dining.png": I2 / "ChatGPT Image Sep 7, 2026, 12_38_59 PM (2).png",
    "residences/2-bed/kitchen.png": I2 / "ChatGPT Image Sep 7, 2026, 12_39_00 PM (3).png",
    "residences/2-bed/principal-bedroom.png": I2 / "ChatGPT Image Sep 7, 2026, 12_39_00 PM (4).png",
    "residences/2-bed/second-bedroom.png": I2 / "ChatGPT Image Sep 7, 2026, 12_39_01 PM (5).png",
    "residences/2-bed/principal-bathroom.png": I2 / "ChatGPT Image Sep 7, 2026, 12_39_02 PM (6).png",
}

# Video is handled by `tools/encode-video.py`, which writes a 1080p delivery
# variant and a poster rather than copying the 4K masters.


# Renders delivered with letterbox/pillarbox padding. Trimming keeps the crop
# faithful to the supplied design while removing the black frame.
TRIM_BLACK_BARS = {"exterior/arrival-podium.png"}


def trim_black_bars(path: Path) -> None:
    im = Image.open(path).convert("RGB")
    w, h = im.size
    px = im.load()
    dark_col = lambda x: all(sum(px[x, y]) < 24 for y in range(0, h, 8))
    dark_row = lambda y: all(sum(px[x, y]) < 24 for x in range(0, w, 8))

    left = 0
    while left < w and dark_col(left):
        left += 1
    right = w - 1
    while right > left and dark_col(right):
        right -= 1
    top = 0
    while top < h and dark_row(top):
        top += 1
    bottom = h - 1
    while bottom > top and dark_row(bottom):
        bottom -= 1

    box = (left, top, right + 1, bottom + 1)
    if box == (0, 0, w, h):
        return
    im.crop(box).save(path)
    print(f"trimmed  {path.name} {w}x{h} -> {box[2] - box[0]}x{box[3] - box[1]}")


def main() -> None:
    copied = missing = 0
    for slug, src in MAP.items():
        out = DEST / slug
        if not src.exists():
            print(f"MISSING  {src.relative_to(ROOT)}")
            missing += 1
            continue
        out.parent.mkdir(parents=True, exist_ok=True)
        already = out.exists() and (
            slug in TRIM_BLACK_BARS or out.stat().st_size == src.stat().st_size
        )
        if already:
            continue
        shutil.copy2(src, out)
        copied += 1
        print(f"copied   {slug}")
        if slug in TRIM_BLACK_BARS:
            trim_black_bars(out)
    print(f"\n{copied} copied, {missing} missing, {len(MAP)} mapped")


if __name__ == "__main__":
    main()
