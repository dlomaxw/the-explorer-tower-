# Worker brief: build ONE frame of the Speke Group film (portrait 9:16, 1080x1920)

You build one frame as a HyperFrames sub-composition, in the brand identity of THIS client only (Speke Group, Uganda hotels,
resorts, apartments and venues). You do not see the conversation: this brief, the files below and your frame block are your
whole world. Quality bar: agency-grade hospitality film, extra visible and crisp in portrait, every element animated with purpose.
PROJECT = /home/user/the-explorer-tower-/speke-group-film ; SKILL = /home/user/the-explorer-tower-/.claude/skills/brand-motion-pro

## Read first (in this order)
1. `PROJECT/frame.md` (tokens, type scale, components, negatives: binding) and `PROJECT/brand.json`.
   Brand: maroon `--mk-primary` #6f2033 (deep `--mk-secondary` #5c1728), gold `--mk-accent` #c9a227, cream ground `--mk-bg` #f7f2e9,
   sand `--mk-surface`/`--mk-line`, dark brown `--mk-ink` #3a2020. Playfair Display (display) + Inter (body).
2. `PROJECT/STORYBOARD.md`: your `## Frame N` block (scene lines, WORD CUES, handoffs, sounds, key image) AND the `handoff_out`
   of the previous frame (your first image must equal it) AND the `handoff_in` of the next frame. The cue times beat the guide
   times written in the scene text.
3. `SKILL/references/motion-language.md`, `ui-and-icons.md`, `depth-and-3d.md`, `video-scenes.md`, `pitfalls.md`
4. The kit: `PROJECT/assets/vendor/motion-kit.js` (MK.*), `motion-kit.css`, `icons.js` (32 icons).
5. A working reference of quality and kit use: `SKILL/examples/demo-northwind/index.html` (other brand: copy techniques, never its
   colours or words) and the frame skeleton `SKILL/templates/frame.template.html`.

## Output
`PROJECT/compositions/frames/<frame-id>.html` is the ONLY file you write: a single `<template>` (style, root, scripts),
composition id = the frame id, every id prefixed with your `fNN-`, canvas 1080x1920, 30 fps, duration D (given).
The timeline is registered as `window.__timelines["<frame-id>"]`. Write a complete first version early, then refine.

## Brand rules (hard)
- Colours ONLY as `var(--mk-primary|secondary|accent|ink|ink-soft|bg|surface|line|on-primary|on-accent)` or rgba() of white/black
  for shadows / veils. No hex literal. Gold is the accent: lines, rings, key-word box, one highlight per beat. Maroon and cream are the worlds.
- Fonts ONLY `var(--mk-font-display)` (Playfair Display: voice sentences, numbers, titles) and `var(--mk-font-body)` (Inter: labels, small caps
  tracking .22em, contact card). Never another family, no mono.
- The logo is `assets/img/logo-source.png` (180x113 px, maroon seal + black wordmark on white-ish): show it ONLY on a cream/white card, at most
  1.9x of its size (342 px wide), never full width, never recoloured, never stretched. A sharper file will replace it later: keep its element as `<img>` with a stable id.
- Imagery: ONLY the client's own files in `assets/img/*.webp` and `assets/media/*.mp4` (list them with ls). Photos are about 450-690 px wide: show them in
  cards 560-900 px wide with a 1x-1.4x ken-burns at most, NEVER full-bleed. Video (1080 wide) may be full-bleed. Videos: `<video muted playsinline>` with
  `data-start`, `data-duration`, a track index, as in `SKILL/references/video-scenes.md` (no `<audio>`, no loop attribute).
- Only facts from the storyboard (the client's own site): 13 properties, 900+ rooms, 45 conference rooms, 1920s / 1996, largest privately owned marina in Uganda,
  ballrooms for 1,000-1,400 guests, World's Best Luxury Convention Resort (Luxe Global Awards 2026), contact details. The only web address on screen is `spekegroup.com`.
  No invented numbers, prices, names, testimonials. No other brand's name anywhere.
- Icons from `MK_ICONS` via `MK.icon(name,{size,stroke})`, drawn on with `MK.drawIcon`; a missing icon is drawn on the same 24 grid inside your frame file.

## Layout (portrait)
Canvas 1080 x 1920. Side margins 60 px. Content zone y 120 to 1400. **Subtitle band y 1450 to 1640** holds the subtitle and nothing else.
Bottom 280 px stay empty. Sizes: display 110-150 (numbers up to 220), headline 72-90, UI text >= 30, micro labels >= 24 (tracking .22em),
icons 90-160, cards at least 700 px wide when they are the hero. Everything must read at phone size: big, few, centred, one hero per beat.
On a photo/video ground put a gradient veil under the subtitle so it stays readable (cream text on maroon veil).

## Subtitle (the voice) and word cues
Word cues in your block are frame-local seconds. Use `MK.subtitle(tl, "#fNN-subK", [["word", cue, boxFlag], ...], {out: t})` per chunk (one `div` per
chunk, same position in the band, font-size 56px, line-height 68px, `.mk-root` class, centred, display font): a word appears 1 frame BEFORE its cue (the kit does it),
ONE key-word box (gold) per sentence (the boxed words are listed in your block), chunk 1 leaves before chunk 2 enters, the last chunk is gone 0.12 s before the end
of the frame (except the end card, which keeps the address). Frame 1 has display text instead of the subtitle: no subtitle there.
Digit forms (1,400, 2026, 1996, 1920s) are shown as the cue list writes them. On a maroon world the subtitle is cream with a gold box; on cream it is maroon-ink with a gold box (contrast >= 4.5).

## Motion rules
Follow `motion-language.md`: arrival hierarchy (ground, container, hero, detail, text, accent), stagger 0.06-0.14 s, expo.out gestures 0.5-0.8 s plus slow linear
drifts, exits 40-60 % faster than entries, no bounce/elastic, no hold longer than 1 s without a living layer (finite), depth (parallax / `MK.tilt` / `MK.float`) in
this frame, blur capped at 18 px, an event every 0.5-1 s. Numbers roll with the kit counter on their cue word. Hits on the music beat (about 0.63 s) when the voice allows.
BLOCKING: hide anything not visible at t=0 with `MK.hide(sel)` / `gsap.set` / CSS `opacity:0` (never `tl.set` at 0); every `fromTo` starting after 0 has
`immediateRender:false`; every reveal's destination says `opacity:1`; tween only x, y, scale, rotation(X/Y/Z), z, opacity, filter, clipPath (never width/height/top/left/letterSpacing);
no `repeat:-1`, no CSS animation, no `Math.random`/`Date`; never write a dollar sign or a script tag inside script text; `style.visibility` only `"inherit"`.
Scripts load exactly like the skeleton (gsap, icons.js, motion-kit.js from `assets/vendor/`). No network assets.

## Handoffs (invisible seams)
Your first image equals the previous frame's `handoff_out`; your last image equals your `handoff_out` (the next frame starts from it). No element is born or dies
in the 2 images around a seam. Build the incoming state at t=0 exactly as described and move into your first beat; build your end state precisely.

## SEE your work (mandatory loop)
You may run exactly ONE command, never anything else of the CLI:
`bash /home/user/the-explorer-tower-/.claude/skills/brand-motion-pro/scripts/preview-frame.sh /home/user/the-explorer-tower-/speke-group-film <frame-id> t1,t2,t3,...`
(frame-local seconds; renders only your frame privately and prints PNG paths). Use it at 0.0, 0.1, each key moment, the key image time, D-0.1, D-0.03.
Open the PNGs with the Read tool and judge like an art director: big and legible on a phone, centred, balanced, hierarchical, branded, nothing cut at the edges,
nothing overlapping, subtitle band free of other content, no empty void, 3D / icons / numbers really animating, footage visible. The preview also prints
`hyperframes check` findings: fix every error (contrast warnings on a key-word box sibling are known false positives). Iterate until it is right.
Do not edit any other file, do not run assemble/render, do not touch STORYBOARD.md, frame.md or index.html.

Reply with ONE line: file written, what the last image is, and any deviation from the storyboard.
