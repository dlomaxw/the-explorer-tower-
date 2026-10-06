#!/usr/bin/env python3
"""brand-init.py <project-dir> <brand.json>

Turns a brand definition into everything a HyperFrames composition needs, so the brand (colours, fonts, logo, tone)
is applied from tokens and never hard-coded:

  <project>/assets/brand/tokens.css   CSS variables (--mk-*) used by motion-kit.css
  <project>/assets/fonts.css          @font-face rules for the local woff2 files
  <project>/assets/fonts/*.woff2      fonts fetched from the @fontsource npm packages (OFL fonts), or your own files
  <project>/assets/vendor/            gsap, icons.js, motion-kit.js, motion-kit.css (copied from this skill)
  <project>/frame.md                  the brand-locked frame spec (colours, type scale, components, negatives)
  <project>/brand.json                a copy of the brand definition

It also prints a contrast table (WCAG ratios of every text/background pair) and exits 1 if a required pair fails.
Fonts: "source": "fontsource:<slug>" downloads the woff2 (latin subset) for the listed weights; "source": "files"
expects assets/fonts/<file> to exist already (any licensed brand font: you drop the woff2 yourself).
"""
import json, os, shutil, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
SKILL = os.path.dirname(HERE)


def hex_rgb(h):
    h = h.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def rgb_hex(c):
    return "#%02x%02x%02x" % tuple(max(0, min(255, int(round(v)))) for v in c)


def lum(h):
    def f(v):
        v /= 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = hex_rgb(h)
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)


def contrast(a, b):
    la, lb = lum(a), lum(b)
    if la < lb:
        la, lb = lb, la
    return (la + 0.05) / (lb + 0.05)


def mix(a, b, t):
    ra, rb = hex_rgb(a), hex_rgb(b)
    return rgb_hex([ra[i] * (1 - t) + rb[i] * t for i in range(3)])


def best_on(bg, dark="#101010", light="#ffffff"):
    return light if contrast(bg, light) >= contrast(bg, dark) else dark


def derive(brand):
    c = dict(brand.get("colors", {}))
    if "primary" not in c:
        sys.exit("brand.json: colors.primary is required")
    c.setdefault("secondary", mix(c["primary"], "#000000", 0.35))
    c.setdefault("accent", c["primary"])
    c.setdefault("ink", "#101010")
    c.setdefault("bg", "#f6f7f9")
    c.setdefault("surface", "#ffffff")
    c.setdefault("ink_soft", mix(c["ink"], c["bg"], 0.35))
    c.setdefault("line", mix(c["ink"], c["bg"], 0.88))
    c.setdefault("on_primary", best_on(c["primary"]))
    c.setdefault("on_accent", best_on(c["accent"]))
    return c


def fetch_fonts(brand, project):
    fdir = os.path.join(project, "assets", "fonts")
    os.makedirs(fdir, exist_ok=True)
    css = []
    families = {}
    for role, f in brand.get("fonts", {}).items():
        families[role] = f
    for role, f in families.items():
        fam, weights, src = f["family"], f.get("weights", [400, 700]), f.get("source", "files")
        if src.startswith("fontsource:"):
            slug = src.split(":", 1)[1]
            need = [w for w in weights if not os.path.exists(os.path.join(fdir, f"{slug}-latin-{w}-normal.woff2"))]
            if need:
                tmp = tempfile.mkdtemp(prefix="fs-")
                r = subprocess.run(["npm", "install", "--no-save", "--silent", "--prefix", tmp, f"@fontsource/{slug}"],
                                   capture_output=True, text=True)
                src_dir = os.path.join(tmp, "node_modules", "@fontsource", slug, "files")
                if r.returncode != 0 or not os.path.isdir(src_dir):
                    print(f"  ! could not fetch @fontsource/{slug} ({r.stderr.strip()[:120]}); put the woff2 files in assets/fonts/ yourself")
                else:
                    for w in need:
                        s = os.path.join(src_dir, f"{slug}-latin-{w}-normal.woff2")
                        if os.path.exists(s):
                            shutil.copy(s, fdir)
                        else:
                            print(f"  ! {slug} has no weight {w}")
                shutil.rmtree(tmp, ignore_errors=True)
            for w in weights:
                css.append('@font-face{font-family:"%s";font-weight:%s;font-style:normal;font-display:block;src:url("fonts/%s-latin-%s-normal.woff2") format("woff2")}' % (fam, w, slug, w))
        else:
            for w in weights:
                fn = f.get("files", {}).get(str(w))
                if not fn:
                    sys.exit(f"brand.json: fonts.{role}.files['{w}'] missing for a 'files' font")
                if not os.path.exists(os.path.join(fdir, fn)):
                    print(f"  ! missing assets/fonts/{fn}")
                css.append('@font-face{font-family:"%s";font-weight:%s;font-style:normal;font-display:block;src:url("fonts/%s") format("woff2")}' % (fam, w, fn))
    return "\n".join(css) + "\n"


def tokens_css(brand, c):
    fonts = brand.get("fonts", {})
    disp = fonts.get("display", fonts.get("body", {"family": "sans-serif"}))["family"]
    body = fonts.get("body", fonts.get("display", {"family": "sans-serif"}))["family"]
    radius = brand.get("radius", 28)
    dark = lum(c["bg"]) < 0.25  # on a dark ground a light shadow glows: use black, stronger
    shadow = f"0 30px 70px {rgba('#000000', .6)}" if dark else f"0 30px 70px {rgba(c['ink'], .16)}"
    shadow_brand = f"0 30px 80px {rgba(c['primary'], .35)}"
    return (":root{\n"
            f"  --mk-primary:{c['primary']};\n  --mk-secondary:{c['secondary']};\n  --mk-accent:{c['accent']};\n"
            f"  --mk-ink:{c['ink']};\n  --mk-ink-soft:{c['ink_soft']};\n  --mk-bg:{c['bg']};\n  --mk-surface:{c['surface']};\n"
            f"  --mk-line:{c['line']};\n  --mk-on-primary:{c['on_primary']};\n  --mk-on-accent:{c['on_accent']};\n"
            f"  --mk-font-display:\"{disp}\",system-ui,sans-serif;\n  --mk-font-body:\"{body}\",system-ui,sans-serif;\n"
            + (f"  --mk-font-mono:\"{fonts['mono']['family']}\",ui-monospace,monospace;\n" if "mono" in fonts else "")
            +
            f"  --mk-display-weight:{brand.get('fonts', {}).get('display', {}).get('display_weight', 800)};\n"
            f"  --mk-radius:{radius}px;\n  --mk-shadow:{shadow};\n  --mk-shadow-brand:{shadow_brand};\n}}\n")


def rgba(h, a):
    r, g, b = hex_rgb(h)
    return f"rgba({r},{g},{b},{a})"


def contrast_table(c):
    pairs = [("ink on bg", c["ink"], c["bg"], 4.5, True), ("ink on surface", c["ink"], c["surface"], 4.5, True),
             ("ink-soft on bg", c["ink_soft"], c["bg"], 4.5, False),
             ("on-primary on primary", c["on_primary"], c["primary"], 4.5, True),
             ("on-accent on accent", c["on_accent"], c["accent"], 4.5, True),
             ("primary on bg (large text / icons)", c["primary"], c["bg"], 3.0, True),
             ("primary on surface (chips)", c["primary"], c["surface"], 3.0, True),
             ("accent on bg (decor only)", c["accent"], c["bg"], 1.5, False)]
    ok = True
    print("\nContrast (WCAG):")
    for name, fg, bg, need, req in pairs:
        r = contrast(fg, bg)
        good = r >= need
        ok = ok and (good or not req)
        print(f"  {'OK ' if good else ('FAIL' if req else 'warn')}  {name:<38} {r:5.2f}:1 (need {need})")
    return ok


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    project, bj = os.path.abspath(sys.argv[1]), sys.argv[2]
    brand = json.load(open(bj, encoding="utf-8"))
    if (brand.get("_example") or brand.get("_draft")) and os.environ.get("ALLOW_EXAMPLE") != "1":
        sys.exit("brand-init: this brand.json is a sample/draft (_example/_draft). Every film uses ITS OWN confirmed brand.\n"
                 "Fill in the real brand (see references/brand-system.md) or set ALLOW_EXAMPLE=1 for the demo only.")
    c = derive(brand)
    os.makedirs(os.path.join(project, "assets", "brand"), exist_ok=True)
    os.makedirs(os.path.join(project, "assets", "vendor"), exist_ok=True)
    print(f"Brand: {brand.get('name', '?')}")
    fonts_css = fetch_fonts(brand, project)
    open(os.path.join(project, "assets", "fonts.css"), "w").write(fonts_css)
    open(os.path.join(project, "assets", "brand", "tokens.css"), "w").write(tokens_css(brand, c))
    kit = os.path.join(SKILL, "assets", "motion-kit")
    for fn in ("motion-kit.js", "motion-kit.css", "icons.js"):
        shutil.copy(os.path.join(kit, fn), os.path.join(project, "assets", "vendor", fn))
    dst = os.path.join(project, "brand.json")
    if os.path.abspath(bj) != os.path.abspath(dst):
        shutil.copy(bj, dst)
    # frame.md from template
    tpl = open(os.path.join(SKILL, "templates", "frame.template.md"), encoding="utf-8").read()
    fonts = brand.get("fonts", {})
    rep = {"{{name}}": brand.get("name", ""), "{{tagline}}": brand.get("tagline", ""),
           "{{display_font}}": fonts.get("display", fonts.get("body", {})).get("family", ""),
           "{{body_font}}": fonts.get("body", fonts.get("display", {})).get("family", ""),
           "{{width}}": str(brand.get("format", {}).get("width", 1920)), "{{height}}": str(brand.get("format", {}).get("height", 1080))}
    for k, v in c.items():
        rep["{{c_" + k + "}}"] = v
    for k, v in rep.items():
        tpl = tpl.replace(k, v)
    fm = os.path.join(project, "frame.md")
    if os.path.exists(fm) and os.environ.get("FORCE_FRAME_MD") != "1":
        print("  frame.md exists: kept (FORCE_FRAME_MD=1 to regenerate)")
    else:
        open(fm, "w", encoding="utf-8").write(tpl)
    ok = contrast_table(c)
    print("\nWrote tokens.css, fonts.css, frame.md, vendor kit. Link in index.html:\n"
          '  <link rel="stylesheet" href="assets/fonts.css"> <link rel="stylesheet" href="assets/brand/tokens.css">\n'
          '  <link rel="stylesheet" href="assets/vendor/motion-kit.css">')
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
