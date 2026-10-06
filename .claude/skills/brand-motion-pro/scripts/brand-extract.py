#!/usr/bin/env python3
"""brand-extract.py <source-dir> [--out brand.draft.json] [--name "Brand"]

Proposes a brand.json DRAFT from material you already have for THIS client: a website repo, a design-token file, a
Tailwind config, CSS, an exported brand guideline in markdown. It never invents a brand: it counts what the source
actually uses and writes the result with "_draft": true so that brand-lint refuses to render until a person has
confirmed (or corrected) every field and removed the marker.

  colours: hex colours ranked by frequency (neutrals filtered), mapped to primary / secondary / accent by hue and use
  fonts:   font-family names from CSS/Tailwind/next-font imports, ranked by frequency
  logo:    image files whose names contain logo / mark / wordmark / brand
Scans: *.css *.scss *.ts *.tsx *.js *.json *.md *.html (skips node_modules, .next, dist, renders, snapshots).
"""
import collections, colorsys, json, os, re, sys

SKIP = {"node_modules", ".next", "dist", "build", "renders", "snapshots", ".git", ".hyperframes", "out"}
EXT = (".css", ".scss", ".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".html", ".mjs")
THIRD_PARTY = {"#25d366", "#075e54", "#128c7e", "#34b7f1", "#1877f2", "#4285f4", "#ea4335", "#fbbc05", "#34a853", "#1da1f2", "#0a66c2",
               "#e4405f", "#ff0000", "#0077b5"}  # WhatsApp, Facebook, Google, X, LinkedIn, Instagram, YouTube: widgets, never the brand
GENERIC = {"sans-serif", "serif", "monospace", "system-ui", "inherit", "ui-sans-serif", "ui-serif", "ui-monospace", "initial",
           "-apple-system", "blinkmacsystemfont", "segoe ui", "roboto", "helvetica", "helvetica neue", "arial", "apple color emoji",
           "segoe ui emoji", "noto color emoji", "liberation mono", "menlo", "monaco", "consolas", "courier new", "cursive", "var"}


def hex_rgb(h):
    h = h.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def main():
    args = [a for a in sys.argv[1:]]
    if not args:
        sys.exit(__doc__)
    src = args[0]
    out = "brand.draft.json"
    name = os.path.basename(os.path.abspath(src))
    if "--out" in args:
        out = args[args.index("--out") + 1]
    if "--name" in args:
        name = args[args.index("--name") + 1]
    colors, fonts, logos = collections.Counter(), collections.Counter(), []
    for root, dirs, files in os.walk(src):
        dirs[:] = [d for d in dirs if d not in SKIP]
        for fn in files:
            p = os.path.join(root, fn)
            low = fn.lower()
            if any(k in low for k in ("logo", "wordmark", "brandmark")) and low.endswith((".png", ".svg", ".webp", ".jpg", ".jpeg")):
                logos.append(os.path.relpath(p, src))
            if not low.endswith(EXT) or os.path.getsize(p) > 600_000:
                continue
            try:
                t = open(p, encoding="utf-8", errors="ignore").read()
            except Exception:
                continue
            for m in re.findall(r"#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b", t):
                colors[m.lower() if len(m) == 7 else "#" + "".join(c * 2 for c in m[1:].lower())] += 1
            for m in re.findall(r"font-family\s*:\s*([^;}\n]+)", t):
                for f in m.split(","):
                    f = f.strip().strip("'\"")
                    if f and f.lower() not in GENERIC and not f.startswith("var(") and len(f) < 40:
                        fonts[f] += 1
            for m in re.findall(r"(?:fontFamily|font)\s*[:=]\s*[\[\"']+\s*['\"]?([A-Z][A-Za-z ]{2,30})['\"]?", t):
                if m.lower() not in GENERIC:
                    fonts[m.strip()] += 1
            for m in re.findall(r"from ['\"]next/font/google['\"]", t):
                for fam in re.findall(r"import\s*\{\s*([A-Za-z_, ]+)\}\s*from ['\"]next/font/google", t):
                    for f in fam.split(","):
                        fonts[f.strip().replace("_", " ")] += 3
    logo_cols = []
    if "--logo" in args:
        try:
            from PIL import Image
            im = Image.open(args[args.index("--logo") + 1]).convert("RGBA")
            im.thumbnail((160, 160))
            cnt = collections.Counter()
            for r, g, b, a in im.getdata():
                if a < 200 or max(r, g, b) - min(r, g, b) <= 14:
                    continue
                cnt[(r // 16 * 16 + 8, g // 16 * 16 + 8, b // 16 * 16 + 8)] += 1
            logo_cols = ["#%02x%02x%02x" % c for c, n in cnt.most_common(4)]
        except Exception as e:
            print("  (logo colour read skipped:", e, ")")
    ranked = []
    for h, n in colors.most_common(60):
        r, g, b = hex_rgb(h)
        if h in THIRD_PARTY:
            continue
        if max(r, g, b) - min(r, g, b) <= 14:
            continue  # greys/white/black are neutrals, not brand colours
        hh, ss, vv = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
        if ss < 0.25:
            continue
        ranked.append((h, n, hh, ss, vv))
    primary = logo_cols[0] if logo_cols else (ranked[0][0] if ranked else "#000000")  # the LOGO is the ground truth for the brand colour
    # accent: the most frequent colour whose hue differs from the primary by >= 40 degrees, else the second colour
    accent = None
    for h, n, hh, ss, vv in ranked[1:]:
        if abs(hh - ranked[0][2]) * 360 >= 40 and abs(hh - ranked[0][2]) * 360 <= 320:
            accent = h
            break
    secondary = next((h for h, n, hh, ss, vv in ranked[1:] if h != accent and abs(hh - ranked[0][2]) * 360 < 40), None)
    fam = [f for f, n in fonts.most_common(4)]
    draft = {
        "_draft": True,
        "_how_to_finish": "Confirm every field with the client or the brand guideline, delete the _draft line, then run brand-init.py.",
        "name": name,
        "colors": {"primary": primary, **({"secondary": secondary} if secondary else {}), **({"accent": accent} if accent else {})},
        "fonts": {"display": {"family": fam[0] if fam else "TODO", "weights": [800], "source": "fontsource:TODO-slug"},
                  "body": {"family": fam[1] if len(fam) > 1 else (fam[0] if fam else "TODO"), "weights": [500, 700], "source": "fontsource:TODO-slug"}},
        "logo": {"candidates": logos[:8]},
        "forbidden_names": [],
        "_evidence": {"logo_colours": logo_cols, "top_colours": [[h, n] for h, n, *_ in ranked[:8]], "top_fonts": fonts.most_common(6)},
    }
    json.dump(draft, open(out, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
    print(f"wrote {out}\n  primary {primary}  secondary {secondary}  accent {accent}\n  fonts {fam}\n  logos {logos[:4]}")


if __name__ == "__main__":
    main()
