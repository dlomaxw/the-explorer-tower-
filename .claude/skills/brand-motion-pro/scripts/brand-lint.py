#!/usr/bin/env python3
"""brand-lint.py <project-dir>

Brand-identity guard: every film uses ITS OWN brand and nothing else. Fails (exit 1) when the project
  * has no brand.json (a film never starts without its own brand definition),
  * still carries the sample brand (brand.json with "_example": true),
  * has assets/brand/tokens.css that no longer matches brand.json (re-run brand-init.py),
  * uses a colour in index.html / compositions/**/*.html that is not a brand colour, a tint of one, or neutral white/black,
  * uses a font-family that is not one of the two brand families (generic fallbacks are allowed),
  * uses a font file that is not in assets/fonts, or mentions another brand's name (set "forbidden_names" in brand.json:
    the names of other projects/brands whose identity must never leak into this film).
Run it before every render. Colours written as var(--mk-*) always pass: prefer them.
"""
import glob, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
import importlib.util  # noqa: E402
spec = importlib.util.spec_from_file_location("brand_init", os.path.join(HERE, "brand-init.py"))
bi = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bi)

NEUTRAL = {"#fff", "#ffffff", "#000", "#000000"}
GENERIC = {"sans-serif", "serif", "monospace", "system-ui", "inherit", "initial", "cursive"}


def color_distance(a, b):
    ra, rb = bi.hex_rgb(a), bi.hex_rgb(b)
    return sum((x - y) ** 2 for x, y in zip(ra, rb)) ** 0.5


def normalize(h):
    h = h.lower()
    if len(h) == 4:
        h = "#" + "".join(c * 2 for c in h[1:])
    return h[:7]


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    proj = os.path.abspath(sys.argv[1])
    errors, warns = [], []
    bj = os.path.join(proj, "brand.json")
    if not os.path.exists(bj):
        sys.exit("FAIL: no brand.json in the project. Run the brand intake (references/brand-system.md) and brand-init.py first.")
    brand = json.load(open(bj, encoding="utf-8"))
    if (brand.get("_example") or brand.get("_draft")) and os.environ.get("ALLOW_EXAMPLE") != "1":
        errors.append("brand.json is a sample/draft (_example/_draft): replace it with THIS project's confirmed brand")
    c = bi.derive(brand)
    allowed = {normalize(v) for k, v in c.items() if isinstance(v, str) and v.startswith("#")}
    fams = {f["family"].lower() for f in brand.get("fonts", {}).values()}
    forbidden = [n.lower() for n in brand.get("forbidden_names", [])]

    # tokens drift
    tk = os.path.join(proj, "assets", "brand", "tokens.css")
    if not os.path.exists(tk):
        errors.append("assets/brand/tokens.css missing: run brand-init.py")
    else:
        if open(tk).read() != bi.tokens_css(brand, c):
            errors.append("assets/brand/tokens.css is out of date with brand.json: re-run brand-init.py")

    files = [os.path.join(proj, "index.html")] + glob.glob(os.path.join(proj, "compositions", "**", "*.html"), recursive=True)
    fonts_dir = os.path.join(proj, "assets", "fonts")
    for f in files:
        if not os.path.exists(f):
            continue
        t = open(f, encoding="utf-8").read()
        rel = os.path.relpath(f, proj)
        # strip data: urls (svg noise) before looking for colours
        t2 = re.sub(r'url\("data:[^"]*"\)', "", t)
        t2 = re.sub(r"url\('data:[^']*'\)", "", t2)
        # colours only in colour contexts (after ":" "(" "," "=" or a colour property): `#cf0` as an id selector is not a colour
        ctx = re.compile(r"(?:(?::|\(|,)\s*|=\s*[\"']|(?:fill|stroke|color|backgroundColor|background|borderColor|stopColor)\s*:\s*[\"'])(#[0-9a-fA-F]{6}(?![\w-])|#[0-9a-fA-F]{3}(?![\w-]))")
        for m in set(ctx.findall(t2)):
            h = normalize(m)
            r, g, b = bi.hex_rgb(h)
            if h in NEUTRAL or h in allowed or max(r, g, b) - min(r, g, b) <= 8:  # whites, blacks and pure greys are neutral
                continue
            # tints of brand colours (shadows, washes) are fine within a small distance
            near = min((color_distance(h, a) for a in allowed), default=999)
            if near <= 18:
                continue
            errors.append(f"{rel}: colour {m} is not a brand colour (nearest brand colour is {near:.0f} away). Use var(--mk-*)")
        for m in re.finditer(r"font-family\s*:\s*([^;}\"]+)", t2):
            for fam in [x.strip().strip("'\"").lower() for x in m.group(1).split(",")]:
                if fam in GENERIC or fam.startswith("var(") or fam == "" or fam in fams:
                    continue
                errors.append(f"{rel}: font-family '{fam}' is not a brand font ({', '.join(sorted(fams))})")
        for m in re.finditer(r"url\(\s*[\"']?([^\"')]+\.(?:woff2?|ttf|otf))", t2):
            if not os.path.exists(os.path.join(fonts_dir, os.path.basename(m.group(1)))):
                errors.append(f"{rel}: font file {m.group(1)} not in assets/fonts")
        low = t.lower()
        for n in forbidden:
            if n and n in low:
                errors.append(f"{rel}: mentions '{n}', another brand's name (identity leak)")
    # other projects' tokens must not have been copied
    siblings = glob.glob(os.path.join(os.path.dirname(proj), "*", "brand.json"))
    for s in siblings:
        if os.path.abspath(os.path.dirname(s)) == proj:
            continue
        try:
            other = json.load(open(s, encoding="utf-8"))
        except Exception:
            continue
        if other.get("name") == brand.get("name") and other.get("colors") != brand.get("colors"):
            warns.append(f"{s}: same brand name with different colours: is this the same client? keep ONE source of truth per brand")
    print(f"brand-lint: {brand.get('name')}  ({len(files)} file(s) scanned)")
    for w in warns:
        print("  warn ", w)
    for e in errors:
        print("  FAIL ", e)
    if errors:
        sys.exit(1)
    print("  OK    only brand colours, brand fonts, no leaks")


if __name__ == "__main__":
    main()
