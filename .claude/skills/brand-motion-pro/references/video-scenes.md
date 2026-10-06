# Video scenes: footage inside the animation

Footage turns a graphic film into a real one: a factory floor behind a headline, a screen recording inside a phone, a
drone shot behind the logo. HyperFrames decodes and seeks `<video>` frame-exactly; the rules below keep it deterministic.

## Source of footage (licence first)

Only footage the client owns or has licensed: their own shoots, product screen recordings, renders, drone clips. Never scrape
stock sites or social media; if stock is needed, the client picks and licenses it and the licence is recorded in the project.
No faces of real people who have not agreed to appear. The brand rules apply: footage is graded and framed in the brand's way.

## Prepare every clip (one command)

```bash
ffmpeg -i in.mov -an -vf "scale=1920:-2,fps=30,format=yuv420p" -c:v libx264 -crf 20 -preset slow \
       -g 30 -movflags +faststart assets/video/clip.mp4        # trim: -ss 3.0 -t 5.0 ; portrait: scale=1080:-2
```
* constant 30 fps, H.264 `yuv420p`, short keyframe interval (`-g 30`) so seeks are cheap, **no audio track** (sound goes on a
  separate `<audio>`), exact resolution you need (never ship 4K into a 1080p film), file < ~30 MB.
* HDR/10-bit phone footage: convert to SDR 8-bit first.
* Variable-frame-rate screen recordings: the `fps=30` filter fixes them.

## Placing a video

```html
<video id="vBackdrop" class="clip mk-video" src="assets/video/clip.mp4"
       data-start="0" data-duration="4.3" data-track-index="2" muted playsinline
       style="position:absolute;left:0;top:0;width:1920px;height:1080px;object-fit:cover;opacity:0"></video>
```
(or `MK.video(id, src, {start, dur, x, y, w, h, radius})` to generate it.)
* **A timed `<video>` must not sit inside another element that has `data-start`** (wrong source frames). Scene wrappers in a
  single-file composition are plain divs without `data-start`; only the ground, videos and audio carry timing.
* Always `muted playsinline`, an `id`, `class="clip"`, `data-start`, `data-duration`, `data-track-index`; never `crossorigin`.
* `data-media-start="3.5"` skips into the source; the clip plays at normal speed for `data-duration`.
* Start it hidden (`opacity:0` inline) and reveal with `MK.videoIn(tl, "#vBackdrop", at, {from:1.14, to:1.06, drift:1.0, until:4.2})`
  (arrives x1.14 + blur, settles, then a slow Ken Burns). Fade it out before its slot ends (`MK.videoOut`) so the last frame never hangs.
* In a sub-composition file, the video id and timing are scene-local; the runtime rebases them.

## Make footage belong to the brand

* **Grade**: overlay `.mk-grade` (primary → secondary at 65-85 % opacity) for a branded duotone backdrop behind type, or
  `.mk-grade-soft` (multiply 38 %) to keep the footage natural but tinted. Tune the overlay opacity in the tween.
* **Scrim for legibility**: `.mk-scrim-bottom` or a card behind text so contrast stays ≥ 4.5:1. Never put text straight on
  busy footage.
* **Vignette** (`.mk-vignette`) and grain (`.mk-grain`, 3 %) glue footage and graphics together.
* **Frames and windows**: crop footage into the brand's shapes: rounded card (`border-radius` token), the logo's silhouette
  with `clip-path: inset()/circle()`, or reveal it through `MK.window` (circle from a point, inset wipe). Polygons cannot tween.
* **On a device**: place the `<video>` inside `.mk-screen` of `MK.phone` / inside `.mk-body` of `MK.browser`, sized to the
  screen. It tilts in 3D with its shell. UI overlays (toast, cards) sit above it with a higher `z-index`.
* **Picture-in-picture / side-by-side**: one video per panel, offset the starts by 0.1-0.2 s, equal margins.

## Sound

Footage audio is not used. Voice, music and sfx are mixed by `scripts/build-mix.py` into one `mix.wav` mounted as an
`<audio id="mix" data-start="0" data-duration="T" data-track-index="11" src="assets/audio/mix.wav">` at the root.

## Checks

`npx hyperframes check` (the runtime stage decodes every video), `snapshot --at` at several times inside each clip to prove it
advances, and a draft render. `--proxy` (on by default) transcodes browser-hostile codecs. Large clips slow the render:
trim to the used range.
