#!/usr/bin/env python3
"""comp-lint.py <project-dir>

Static guard for the traps that cost hours, found while building real films. Run it before `hyperframes check`.
Each rule names the symptom you would otherwise chase.

  inline-tag      a script tag (open or close) written inside a comment or string of a script that the bundler inlines
                  -> "r.pause is not a function" at check time, composition dead
  dollar          dollar-dollar / dollar-quote / dollar-ampersand / dollar-backtick in an inlined script
                  -> String.replace in the bundler mangles it, code silently changes
  cdn             a script/link/@import loaded from the network -> blocked renderers, blank page
  loop            repeat:-1 (or CSS animation / @keyframes) -> breaks deterministic seeking
  random          Math.random / Date.now / performance.now in a composition -> non-deterministic frames
  visibility      style.visibility = "visible" -> element leaks over the whole film (use "inherit")
  letterspacing   tweening letterSpacing/width/height/top/left -> layout thrash and jitter (tween transforms only)
  hide-at-zero    tl.set(..., {opacity:0}, 0) -> frame 0 shows the element; use gsap.set / MK.hide / CSS opacity:0
  video-nesting   a <video data-start> inside another element that has data-start -> wrong frames
  video-audio     <video> without muted, or with crossfade/crossorigin
  backdrop        backdrop-filter -> not captured by the renderer
  webgl           WebGL/canvas 3D (three.js) -> the renderer has no WebGL (software mode); use CSS 3D transforms
  poly-clip       tweening a polygon() clip-path -> cannot interpolate; use inset()/circle()
  blur-size       a very large element carrying a heavy blur -> renderer cost and artefacts
"""
import glob, os, re, sys


def scripts_of(html):
    return re.findall(r"<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>", html, flags=re.S)


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    proj = os.path.abspath(sys.argv[1])
    errs = []
    html_files = [f for f in [os.path.join(proj, "index.html")] + glob.glob(os.path.join(proj, "compositions", "**", "*.html"), recursive=True) if os.path.exists(f)]
    js_files = [f for f in glob.glob(os.path.join(proj, "assets", "vendor", "*.js")) if "gsap" not in os.path.basename(f)]

    def add(rule, where, msg):
        errs.append(f"[{rule}] {where}: {msg}")

    for f in js_files:
        t = open(f, encoding="utf-8", errors="ignore").read()
        rel = os.path.relpath(f, proj)
        if re.search(r"</?script", t, flags=re.I):
            add("inline-tag", rel, "contains a script tag in its text (comment or string): remove it")
        if re.search(r"\$[\$&`']", t):
            add("dollar", rel, "contains a dollar-dollar/quote/ampersand/backtick sequence: rename the helper (qs/qsa)")
    for f in html_files:
        t = open(f, encoding="utf-8", errors="ignore").read()
        rel = os.path.relpath(f, proj)
        bodies = scripts_of(t)
        for b in bodies:
            if re.search(r"</?script", b, flags=re.I):
                add("inline-tag", rel, "an inline script contains a script tag in a comment/string")
            if re.search(r"\$[\$&`']", b):
                add("dollar", rel, "an inline script contains a dollar-dollar/quote/ampersand/backtick sequence")
            if re.search(r"repeat\s*:\s*-1", b):
                add("loop", rel, "repeat:-1 found: compute a finite repeat from the duration")
            if re.search(r"Math\.random|Date\.now|performance\.now|new Date\(", b):
                add("random", rel, "non-deterministic call (Math.random/Date): precompute values")
            if re.search(r"style\.visibility\s*=\s*[\"']visible", b):
                add("visibility", rel, 'style.visibility = "visible": use "inherit"')
            if re.search(r"(letterSpacing|width|height|top|left)\s*:\s*[^,}]+[,}][^)]*?(duration|ease)", b) and re.search(r"\.(to|from|fromTo)\(", b):
                for m in re.finditer(r"\.(?:to|from|fromTo)\([^;]*?\{[^}]*\b(letterSpacing|width|height|top|left)\s*:", b):
                    add("letterspacing", rel, f"tween of {m.group(1)}: animate transforms (x, y, scale) instead")
                    break
            if re.search(r"tl\.set\([^;]*opacity\s*:\s*0[^;]*,\s*0\s*\)", b):
                add("hide-at-zero", rel, "tl.set(..., {opacity:0}, 0): use gsap.set / MK.hide / CSS so frame 0 is correct")
            if re.search(r"three(\.module)?\.js|new\s+THREE\.|getContext\(\s*[\"']webgl", b):
                add("webgl", rel, "WebGL/three.js: the renderer is software only; use CSS 3D transforms (MK.tilt, MK.stage3d)")
            if re.search(r"clipPath\s*:\s*[\"']polygon", b):
                add("poly-clip", rel, "polygon() clip-path cannot be tweened: use inset()/circle()")
        for m in re.finditer(r"<(?:script|link)[^>]+(?:src|href)=[\"'](https?:)?//[^\"']+", t):
            add("cdn", rel, "network asset: " + m.group(0)[-80:])
        if re.search(r"@import\s+url\(\s*[\"']?https?:", t):
            add("cdn", rel, "@import of a network stylesheet: vendor the font locally")
        if re.search(r"@keyframes|animation\s*:", t):
            add("loop", rel, "CSS animation/@keyframes: drive everything from the GSAP timeline")
        if re.search(r"backdrop-filter", t):
            add("backdrop", rel, "backdrop-filter is not captured: use a translucent surface")
        for m in re.finditer(r"<video\b[^>]*>", t):
            tag = m.group(0)
            if "muted" not in tag:
                add("video-audio", rel, "<video> must be muted (sound goes on a separate <audio>)")
            if "crossorigin" in tag:
                add("video-audio", rel, "never put crossorigin on <video>/<audio>")
            if "id=" not in tag:
                add("video-audio", rel, "timed <video> needs an id")
    print(f"comp-lint: {len(html_files)} html, {len(js_files)} vendored script(s)")
    for e in sorted(set(errs)):
        print("  FAIL", e)
    if errs:
        sys.exit(1)
    print("  OK    no known trap")


if __name__ == "__main__":
    main()
