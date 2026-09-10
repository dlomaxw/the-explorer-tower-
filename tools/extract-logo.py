"""Extract the Explorer wordmark artwork from the supplied logo PDF into SVG.

The logo in `content/Explorer Logos not original_260821_141622.pdf` is real
vector art: the single-line goat and hill are built from PDF path operators and
used as a clipping path. This script converts those operators into one SVG path
so the site can render the mark at any size and animate it drawing itself.

The PDF page applies `.24 0 0 -.24 0 817.91998 cm`, so a path point (x, y) lands
at PDF user-space (0.24x, 817.92 - 0.24y). Measured from the top of the page —
which is what SVG's y-down space wants — that is simply (0.24x, 0.24y), so the
conversion is a uniform scale with no flip.

Writes: site/src/components/logo-path.ts
"""

import re
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PDF = ROOT / "content" / "Explorer Logos not original_260821_141622.pdf"
OUT = ROOT / "site" / "src" / "components" / "logo-path.ts"

SCALE = 0.24
# The rectangle the artwork clip is drawn inside; the path follows it.
ANCHOR = "337.5 619.20636 2698.0942 1772.7148 re\nW\nn\n"

NUMBER = re.compile(r"-?\d*\.?\d+(?:[eE][-+]?\d+)?")


def content_stream(data: bytes, obj: int) -> str:
    pattern = re.compile(
        rf"{obj} 0 obj\r?\s*<<.*?>>\r?\s*stream\r?\n?(.*?)\r?\n?endstream".encode(),
        re.S,
    )
    match = pattern.search(data)
    if not match:
        raise SystemExit(f"object {obj} not found")
    return zlib.decompress(match.group(1)).decode("latin1")


def fmt(value: float) -> str:
    """Trim to two decimals; the mark is drawn at a few hundred pixels."""
    text = f"{value:.2f}".rstrip("0").rstrip(".")
    return text if text not in ("", "-0") else "0"


def convert(segment: str) -> tuple[str, tuple[float, float, float, float]]:
    tokens = segment.replace("\n", " ").split()
    stack: list[float] = []
    out: list[str] = []
    xs: list[float] = []
    ys: list[float] = []

    def point(index: int) -> str:
        x = stack[index] * SCALE
        y = stack[index + 1] * SCALE
        xs.append(x)
        ys.append(y)
        return f"{fmt(x)} {fmt(y)}"

    for token in tokens:
        if NUMBER.fullmatch(token):
            stack.append(float(token))
            continue

        if token == "m":
            out.append(f"M{point(-2)}")
        elif token == "l":
            out.append(f"L{point(-2)}")
        elif token == "c":
            out.append(f"C{point(-6)} {point(-4)} {point(-2)}")
        elif token == "h":
            out.append("Z")
        else:
            raise SystemExit(f"unexpected operator {token!r}")
        stack.clear()

    # Subpaths left open by the PDF are implicitly closed when used as a clip.
    path = " ".join(out)
    path = re.sub(r"(?<!Z) ?M", " Z M", path)
    path = path.replace("Z Z", "Z").strip().removeprefix("Z ").strip()
    if not path.endswith("Z"):
        path += " Z"

    return path, (min(xs), min(ys), max(xs), max(ys))


def main() -> None:
    stream = content_stream(PDF.read_bytes(), 5)
    start = stream.index(ANCHOR) + len(ANCHOR)
    end = stream.index("\nW\nn", start)

    path, (x0, y0, x1, y1) = convert(stream[start:end])

    # Round the box outward by a whole unit so the stroke never clips.
    box = (
        int(x0) - 1,
        int(y0) - 1,
        int(x1 - x0) + 3,
        int(y1 - y0) + 3,
    )

    # The whole path fills correctly as one element (contours may enclose each
    # other). The split copy exists only so the reveal can stroke each contour
    # on its own timeline.
    subpaths = ["M" + part.strip() for part in path.split("M") if part.strip()]
    listed = ",\n  ".join(f'"{item}"' for item in subpaths)

    OUT.write_text(
        f'''/**
 * The Explorer mark, extracted from the supplied logo PDF by
 * `tools/extract-logo.py`. Do not hand-edit — re-run the script instead.
 *
 * One continuous line describing the goat and the hill it stands on, stored as
 * the filled outline of that line.
 *
 * `LOGO_PATH` is the whole mark and is what gets filled. `LOGO_SUBPATHS` is the
 * same geometry split per contour, used only by the draw-on reveal so each
 * contour can be stroked on its own timeline.
 */
export const LOGO_VIEW_BOX = "{box[0]} {box[1]} {box[2]} {box[3]}";

export const LOGO_PATH =
  "{path}";

export const LOGO_SUBPATHS: readonly string[] = [
  {listed},
];
''',
        encoding="utf-8",
    )

    print(f"bbox  {x0:.1f} {y0:.1f} -> {x1:.1f} {y1:.1f}")
    print(f"viewBox {box}")
    print(f"path  {len(path)} chars, {len(subpaths)} contours -> {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
