# Workflow in detail (gates, artefacts, dispatch)

Each step ends with a **gate**: show the artefact, get a go, then continue. Nothing is animated before the storyboard is approved.

## 0. Brand intake (gate: brand.json confirmed)
`references/brand-system.md`. Output: `<project>/brand.json` with no `_draft`/`_example`, logo files in `assets/img/`.
Then `scripts/setup-project.sh <project> <brand.json>`: pinned CLI + vendored GSAP + tokens + fonts + kit + frame spec.
Open `frame.md` and write its closing paragraph: the single metaphor of the film, derived from the logo shape and the product.

## 1. Brief and script (gate: script approved)
Format (aspect, duration 30-60 s), audience, one message, the approved facts and contact details. Three short concepts, one
sentence each, then the full script of the chosen one in two forms: *staged* (beat table: time, on screen, voice) and
*voice text* (numbers spelled out). No invented facts. Ask for the missing facts instead of filling them.

## 2. Voice (gate: user supplies the file)
The user records it (`references/audio.md`). You verify the critical phrases, cut it, align the words
(`align-words.py`), and save `onsets.json`. Silent beats (a hook, an end hold) are written as shots with their own action.

## 3. Storyboard (gate: approved)
Three directions as styleframes (static PNGs at 3 key moments each) when the user has no preference; then one storyboard.
Per frame (one frame = one or two sentences = 2.5-7 s), write:
* time range and duration, camera track, **handoff_in / handoff_out** (camera scale/offset, blur, objects, text at the seam),
* word cues (frame-local), the key word of each sentence (one accent box),
* the scene lines: on-screen text, start image, steps with times (an event every 0.5-1 s), **which components appear**
  (UI part, icon, 3D object, footage clip) and what each one *says*, sound events, the key image,
* the object-bridge: what carries over to the next frame (the logo shape, a line, a card).
Plan the **component mix** across the film: roughly one product/UI beat, one icon beat, one 3D or footage beat per 10-12 s,
alternated with typographic beats. Check the sum of durations equals the voice length and every boundary sits in a silence.

## 4. Build
* Short films (≤ 20 s, 1-4 scenes): a single `index.html` built with the kit (see `examples/demo-northwind/index.html`).
* Longer films: one **sub-composition per frame** (`compositions/frames/NN-name.html`, `<template>` with a root and its own timeline)
  built by **one sub-agent per frame**, in parallel, then assembled in `index.html` with `data-composition-src`.
  Pilot first: build frame 1 alone, snapshot it, lock the look, then dispatch the rest.
Dispatch template for a frame builder (absolute paths, it sees nothing else):
```
You build ONE frame of a HyperFrames motion design. These files are your whole world; read them first:
1. <PROJECT>/frame.md           (brand tokens, type, components, negatives: binding)
2. <PROJECT>/STORYBOARD.md block for <frame_id> (cues, steps, handoffs)
3. <SKILL>/references/motion-language.md, ui-and-icons.md, depth-and-3d.md, video-scenes.md, pitfalls.md
Use the motion kit (assets/vendor/motion-kit.js: MK.*). Colours only as var(--mk-*), fonts only the brand fonts.
Output: <PROJECT>/compositions/frames/<frame_id>.html (the only file you write). Canvas WxH, 30 fps, duration D s.
Rules: first image == handoff_in, last image == handoff_out; nothing born or dying in the 2 images around a seam;
hide with gsap.set/CSS (never tl.set at 0); every reveal fromTo ends with opacity:1 and has immediateRender:false;
transforms/opacity/filter only; no repeat:-1, no Math.random; subtitles word by word on the cues (0-2 frames early) with ONE
key-word box; subtitle gone 0.1 s before the seam; open every photo you use; no network assets; no <audio>.
Do not run any hyperframes command. Write a complete first version early, then refine. Reply in one line.
```
Fixes: resume the same builder with the exact finding and the two image paths; do not dispatch a new one.

## 5. Audio (gate: user chooses by ear when options exist)
sfx events locked on the picture, music loop/duck, loudness (`references/audio.md`). Mount `mix.wav` at the root.

## 6. Checks (every item, before any delivery)
```bash
python3 <SKILL>/scripts/brand-lint.py   <project>      # own brand only, no leaks
python3 <SKILL>/scripts/comp-lint.py    <project>      # known traps
cd <project> && npx hyperframes check                  # lint + runtime + layout + motion + contrast
bash <SKILL>/scripts/seam-check.sh <project> 2.43 7.04 # image before/after every seam; read the contact sheets
npx hyperframes snapshot --at <every key image>        # open them: readable, nothing cut at the edge, safe margins
```
Review the contact sheets against the checklist in `checklist.md`.

## 7. Render and deliver
`npx hyperframes render -q draft -o renders/draft.mp4` first (fast), look at stills from it, then `-q standard` for the final.
`ffmpeg ... blackdetect/freezedetect` on the render must show only intended black. Send a web copy
(`scripts/compress.sh`), report duration, resolution, what was and was not verified (never claim you watched it if you only
inspected stills), and push the source (renders stay out of git: `renders/` is gitignored).
