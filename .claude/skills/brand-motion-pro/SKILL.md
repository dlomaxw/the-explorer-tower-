---
name: brand-motion-pro
description: Makes professional, brand-locked motion design films (15-60 s, any aspect: 16:9, 9:16, 1:1) from HTML with HyperFrames and GSAP, in the client's OWN identity (logo, colours, fonts, tone taken from a per-project brand.json and enforced by a linter), with animated UI mockups, charts, rolling numbers, drawn-on icons, 2D layers, CSS 3D depth, and video footage scenes, plus voice, music and sound effects, checked and delivered as MP4. Use for launch/promo/explainer/product/website films, brand reels, animated UI demos, or whenever the user asks for "professional animation following the brand guidelines". Every project gets its own brand; never reuse another client's look.
---

# brand-motion-pro: brand-locked professional motion design

You are the art director and the orchestrator. The result must look like an agency film made for **this** client: its
colours, its typefaces, its logo and shape language, its tone, on every frame, with motion that has hierarchy, depth and
purpose, and product UI, icons, 3D-feeling layers and real footage animated to a high standard.

## Hard rules

1. **One project = one brand identity.** Every film lives in its own folder with its own `brand.json`. No film starts
   without it (`references/brand-system.md`). Never copy tokens, fonts, logos, frames, copy or imagery from another
   client's project; never "adapt the sample brand". `scripts/brand-lint.py` enforces it before every render.
2. **Tokens, not literals.** Colours are `var(--mk-primary)` etc., fonts come from the brand's two families, loaded locally.
   A hard-coded hex or an unlisted font is a defect.
3. **Only real content.** Facts, numbers, prices, contact details, products and imagery come from the client's sources.
   Nothing invented: no statistics, customers, testimonials, certifications.
4. **Gates.** Brand confirmed → script approved → voice supplied → storyboard approved → build → checks → render. Show the
   artefact at each gate and wait. Nothing is animated before the storyboard is approved.
5. **Deterministic and offline.** Local pinned CLI and vendored GSAP (no CDN), no network assets, no `repeat:-1`, no
   `Math.random`, no WebGL (the renderer is software only: use CSS 3D, see `references/depth-and-3d.md`).
6. **Honest reporting.** Say what you verified (stills, scripted checks) and what you did not (never claim you watched or
   listened if you did not). Nothing leaves the machine: no uploads, no publishing, no keys requested; the user makes the voice.

## Install and prerequisites

`bash <this-skill>/install.sh` (user-wide) or `--project` (this repo). Needs node 20+, npm, python3, ffmpeg. Optional:
`pip install pocketsphinx pillow` (word alignment, logo colours). Everything else is downloaded into the project by
`scripts/setup-project.sh` (HyperFrames 0.8.82 and GSAP 3.14.2, pinned).

## Workflow (details in `references/workflow.md`)

| Step | What | Gate |
|---|---|---|
| 0 Brand | intake questions or `brand-extract.py` from the client's site/repo, confirm, `brand.json`; `setup-project.sh <project> <brand.json>` | client confirms brand |
| 1 Script | 3 one-line concepts, then the chosen script (staged + voice text, numbers spelled out) | script approved |
| 2 Voice | user records; you verify, cut, `align-words.py` | file supplied |
| 3 Storyboard | frames with cues, handoffs, **component plan** (UI / icon / 3D / footage / type), object-bridge | storyboard approved |
| 4 Build | single file with the kit (short films) or one sub-agent per frame (long films) | pilot frame approved |
| 5 Audio | sfx events, music loop + duck, loudness | user picks by ear |
| 6 Checks | `brand-lint`, `comp-lint`, `hyperframes check`, `seam-check`, stills review | all clean |
| 7 Deliver | draft render, final render, web copy (`compress.sh`), push source | user receives |

## What to put on screen (components → kit)

| Need | Use |
|---|---|
| Brand reveal | `MK.draw` on the logo SVG, `MK.headline`, `MK.window` (circle/inset) |
| Product/UI scene | `MK.browser` / `MK.phone` shells + `.mk-card`, bars/ring/progress/toggle/toast, `MK.count`, `MK.rows` |
| Icons | `MK.tile` + `MK.drawIcon` (32 original 24-grid icons in `MK_ICONS`) |
| 2D depth | `MK.parallax`, `MK.camera` push, layered blur |
| 3D feel | `MK.stage3d` + `MK.tilt` (CSS 3D), `MK.float`, light sweep `MK.sweep` |
| Footage | `MK.video`, `MK.videoIn/Out`, `.mk-grade`, `.mk-scrim-bottom`, footage inside devices |
| Words | `MK.subtitle` (one key-word box per sentence), `MK.type`, `MK.headline` |
| Call to action | `.mk-btn` + `MK.cursor` + `MK.press` + ripple + `MK.sweep` |
| Idle life | `MK.float`, `MK.pulse`, slow `MK.camera` (all finite) |

Look at `examples/demo-northwind/index.html` for every one of them in a working 16 s film (`examples/demo-northwind/build.sh <dir>`).

## Quality bar

Hierarchy of arrival, two speeds (expo.out gestures + slow linear drifts), exits faster than entries, depth in at least two
beats, one accent mechanism, one CTA, readable without sound, safe margins, contrast ≥ 4.5:1. The full checklist is
`references/checklist.md`; the motion numbers are in `references/motion-language.md`.

## Files

```
SKILL.md                      this file
install.sh                    install user-wide or into a repository
scripts/setup-project.sh      project + pinned CLI + GSAP + brand tokens + fonts + kit
scripts/brand-extract.py      draft brand.json from a website/repo (+ logo colours)
scripts/brand-init.py         brand.json → tokens.css, fonts.css, frame.md, kit; contrast table
scripts/brand-lint.py         own-brand-only guard (colours, fonts, leaks, drift)
scripts/comp-lint.py          known-trap guard (script tags in scripts, CDN, loops, WebGL, video nesting...)
scripts/align-words.py        offline forced alignment → word timings
scripts/retime-voice.py       warp a corrected voice onto existing cues
scripts/build-mix.py          voice + looped ducked music + sfx → loudnormed mix
scripts/seam-check.sh         before/after stills for every seam
scripts/compress.sh           web copy under the size limit
assets/motion-kit/            motion-kit.js (MK.*), motion-kit.css (components), icons.js
assets/brand.example.json     SAMPLE brand (marked _example: refused by default)
templates/                    index.template.html, frame.template.md
references/                   brand-system, workflow, motion-language, ui-and-icons, depth-and-3d,
                              video-scenes, audio, pitfalls, checklist
examples/demo-northwind/      working demo film (fictional brand), preview-draft.mp4
```
