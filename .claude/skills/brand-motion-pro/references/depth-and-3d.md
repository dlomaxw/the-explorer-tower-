# Depth and 3D (2D layers, CSS 3D, parallax)

**The renderer has no WebGL** (HyperFrames renders in headless Chromium with software GL; the check log says
`browserGpuMode → software (WebGL unavailable)`). So: **no three.js, no canvas 3D, no WebGL shaders.** Real depth comes
from three cheap, fully deterministic techniques that look premium when used with discipline.

## 1. CSS 3D transforms (`MK.stage3d`, `MK.tilt`)

Give the parent a perspective and rotate children: browser mockups, phones, cards, logo plates.

```js
MK.stage3d("#stage", 2200, "40%", "50%");          // perspective 2200 px, origin 40% / 50%
MK.tilt(tl, "#browser", 4.05, 1.0, { from:{ry:34, rx:-8, z:-500}, ry:-9, rx:5, z:0, persp:2200 });  // arrives from depth
tl.to("#browser", { rotationY:-5, rotationX:3, duration:3, ease:"none" }, 5.05);                   // slow drift
```
Numbers that look professional: perspective 1800-2400 px; resting tilt 6-14° on Y and 2-6° on X (more reads as gimmick);
travel from `z: -400..-600` with blur; settle in 0.8-1.1 s `expo.out`; then a linear 3-4° drift for the rest of the beat.
Shadows are the depth cue: keep the brand shadow token and let it grow slightly as an object comes forward.

Rules: tween only `rotationX/Y/Z`, `z`, `x`, `y`, `scale`, `opacity`, `filter`. Set `transformPerspective` on the element (in
`MK.tilt`) or `perspective` on the parent, not both with different values. `transform-style: preserve-3d` only on the stage.
Backfaces: rotate no further than ±70°; a card turned past 90° shows its back (hide it or flip content).

## 2. Layered parallax (`MK.parallax`, `MK.camera`)

Separate the scene into 3 layers (ground, mid, hero) in different elements and move them different amounts:
`MK.parallax(tl, [{sel:".bg", depth:.2}, {sel:".mid", depth:.6}, {sel:".fg", depth:1}], at, dur, {x:60, y:20})`.
Background layers may be blurred 2-6 px to push them back; the hero stays sharp. A camera wrapper (`MK.camera`) pushing in
3-6 % over the beat completes the effect. This is the workhorse for photographs and flat renders: a still can feel 3D.

## 3. Staged elements with real depth cues

* Overlap with shadow and scale: front elements 1.0, mid 0.92, back 0.85 with lower contrast.
* Soft glows from the brand colour (`.mk-glow`) behind the hero; one per scene.
* Light sweeps (`MK.sweep`) across glass/metal surfaces after they land: a skewed translucent bar crossing once.
* Perspective grids/floors: draw them as an SVG with converging lines (2D) rather than a blurred 3D floor.
* Isometric looks: `transform: rotateX(55deg) rotateZ(-35deg)` on a flat card stack gives a convincing isometric platform;
  lift layers with `translateZ`.

## Budget

At most one hero 3D object per beat, at most two 3D beats in 15 s. Heavy blur only on elements under ~1800 px. If a frame
renders slowly, reduce the number of simultaneously blurred layers first.

## If a client demands true 3D

Pre-render it elsewhere (Blender/another tool) as a video or transparent image sequence and bring it in as footage
(video-scenes.md). Do not try to run WebGL inside the composition.
