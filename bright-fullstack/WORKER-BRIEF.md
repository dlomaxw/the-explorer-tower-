# Worker brief: build ONE frame of the Bright Illuminated film (portrait 9:16, 1080x1920)

You build one frame as a HyperFrames sub-composition, in the brand identity of THIS client only. You do not see the
conversation: this brief, the files below and your frame block are your whole world. Quality bar: agency-grade product
motion design, extra visible and crisp in portrait, every element animated with purpose.

## Read first (in this order)
1. `PROJECT/frame.md`   brand tokens, type scale, components, negatives: binding. The brand is yellow `#FAE104` on near-black.
2. `PROJECT/STORYBOARD.md`: your `## Frame N` block (scene lines, word cues, handoffs, sounds, key image) AND the
   `handoff_out` line of the previous frame (your first image must equal it) AND the `handoff_in` line of the next frame.
3. `SKILL/references/motion-language.md`, `ui-and-icons.md`, `depth-and-3d.md`, `pitfalls.md`
4. The kit you must use: `PROJECT/assets/vendor/motion-kit.js` (MK.*), `motion-kit.css` (components), `icons.js` (32 icons).
5. A working reference of the quality and of how the kit is used: `SKILL/examples/demo-northwind/index.html` (single file, other
   brand: copy the techniques, never its colours or words) and the frame skeleton `SKILL/templates/frame.template.html`.

## Output
`PROJECT/compositions/frames/<frame-id>.html` is the ONLY file you write: a single `<template>` (style, root, scripts),
composition id = the frame id, every id prefixed with your `fNN-`, canvas 1080x1920, 30 fps, duration D (given).
The timeline is registered as `window.__timelines["<frame-id>"]`. Write a complete first version early, then refine.

## Brand rules (hard)
- Colours ONLY as `var(--mk-primary|secondary|accent|ink|ink-soft|bg|surface|line|on-primary|on-accent)` (or rgba() of white/black
  for shadows). No hex literal except inside SVG data you cannot style otherwise (then still use the token via `style="stroke:var(--mk-primary)"`).
- Fonts ONLY `var(--mk-font-display|body|mono)`. Mono (IBM Plex Mono) only for terminal / API / code text. Never another family.
- Yellow is the ONLY accent: the key-word box, the caret, the CTA, one highlight per beat. Everything else is white, grey, near-black.
- The logo is `assets/img/logo-full.png` (yellow mark + white word, transparent) and `assets/img/mark.png` (yellow B only). Never recolour or stretch.
- Only facts from the storyboard (the client's page). No invented numbers, prices, clients, testimonials, photos.
- No imagery is supplied: build everything from kit parts (cards, tiles, mockups, charts, icons, SVG lines). Icons from `MK_ICONS` via
  `MK.icon(name,{size,stroke})`, drawn on with `MK.drawIcon`. A missing icon: draw it on the same 24 grid inside your frame file.

## Layout (portrait)
Canvas 1080 x 1920. Side margins 60 px. Content zone y 120 to 1400. **Subtitle band y 1450 to 1640** holds the subtitle and nothing
else. Bottom 280 px stay empty. Text sizes for portrait: display 120-150, headline 72-90, UI text >= 30, micro labels >= 24 (tracking .22em),
icons 90-160 px, cards at least 800 px wide when they are the hero. Everything must read at phone size: big, few, centred on the
vertical axis, one hero per beat.

## Subtitle (the voice) and word cues
Word cues in your block are frame-local seconds. Use `MK.subtitle(tl, "#fNN-subK", [["word", cue, boxFlag], ...], {out: t})` for each
chunk (one `div` per chunk, same position, absolutely placed in the band, font-size 56px, line-height 68px, `.mk-root` class, centred):
a word appears 1 frame BEFORE its cue (the kit does it), ONE key-word box per sentence (the boxed words are listed in your block),
chunk 1 leaves (MK.exit or the `out` option) before chunk 2 enters, the last chunk is gone 0.12 s before the end of the frame.
A display moment (« Ready to ship? », the phone number, the frame-1 title) replaces the subtitle: no subtitle then.

## Motion rules
Follow `motion-language.md`: hierarchy of arrival (ground, container, hero, detail, text, accent), stagger 0.06-0.14 s, expo.out gestures
0.5-0.8 s plus slow linear drifts, exits 40-60 % faster than entries, no bounce/elastic, no hold longer than 1 s without a living layer
(finite), depth (parallax / `MK.tilt` / `MK.float`) in this frame, blur capped at 18 px. An event every 0.5-1 s.
Put hits on the music beat grid when the voice allows it (the beats in your prompt, frame-local seconds, +/- 0.05 s).
BLOCKING: hide anything not visible at t=0 with `MK.hide(sel)` / `gsap.set` / CSS `opacity:0` (never `tl.set` at 0); every `fromTo`
that starts after 0 has `immediateRender:false` (kit functions already do); every reveal's destination says `opacity:1`;
tween only x, y, scale, rotation(X/Y/Z), z, opacity, filter (never width/height/top/left/letterSpacing); no `repeat:-1`, no CSS
animation, no `Math.random`/`Date`; never write a dollar sign or a script tag inside script text; `style.visibility` only `"inherit"`.
Scripts are loaded exactly like the skeleton (gsap, icons.js, motion-kit.js from `assets/vendor/`). No network assets, no `<audio>`.

## Handoffs (invisible seams)
The first image of your frame equals the previous frame's `handoff_out`; your last image equals your `handoff_out` (which the next
frame starts from). No element is born or dies in the 2 images around a seam. Build the incoming state at t=0 exactly as described
(position, scale, blur) and move into your first beat; build your end state precisely (the next frame copies it).

## SEE your work (mandatory loop)
You may run exactly ONE command, never anything else of the CLI:
`bash SKILL/scripts/preview-frame.sh PROJECT <frame-id> t1,t2,t3,...`  (frame-local seconds; it renders only your frame in a private
folder and prints the PNG paths; it never touches the project). Use it at: 0.0, 0.1, each key moment, the key image time, D-0.1,
D-0.03. Open the PNGs with the Read tool and judge them like an art director: is it big and legible on a phone, centred, balanced,
hierarchical, branded, nothing cut at the edges, nothing overlapping, subtitle band free, no empty void, the 3D / icons / numbers
really animating? The preview also prints `hyperframes check` findings for your frame: fix every error. (Contrast warnings on a
key-word box sibling are known false positives; layout `info` lines are fine.) Iterate until it is right. Do not edit any other file,
do not run assemble/render, do not touch STORYBOARD.md, frame.md or index.html.

Reply with ONE line: file written, what the last image is, and any deviation from the storyboard.
