# Motion language: what makes it look professional

Amateur motion is everything arriving the same way at the same time and then sitting still. Professional motion has a
hierarchy, two speeds, depth, and a reason for every movement. The numbers below are tuned for 30 fps.

## Principles

1. **One thing to look at at a time.** Each sentence/beat owns the screen. Secondary elements arrive after the primary
   one and leave before the next beat. Never two competing reveals inside the same 0.4 s.
2. **Hierarchy through order**: background → container → hero element → supporting detail → text → accent. Reveal in
   that order, 60-120 ms apart. The eye follows the order of arrival.
3. **Two speeds.** *Gestures* are fast and decelerate hard (`expo.out`, 0.4-0.8 s). *Drifts* are slow and linear (a
   camera creeping 2-4 %/s, a 3D object turning 4° in 3 s). A frame that only has gestures feels twitchy; one that only has
   drifts feels like a slideshow. Every hold names its living layer.
4. **Enter slow-in/fast-out reversed**: entries ease out (arrive and settle), exits ease in and are 40-60 % faster than the
   entry. Never bounce, elastic or back eases: they read as toy-like.
5. **Motion has direction and a source.** Things come from where they logically live (a toast from the top, a list from
   the side the user reads from, a panel from the edge it docks to). Pick one primary travel axis per film and keep to it.
6. **Blur is a material.** Entries from depth start at 8-14 px blur and resolve sharp; exits blur out. Cap the blur
   (`MK.MAX_BLUR` = 18) and never blur an element larger than ~1800 px.
7. **Numbers roll, strokes draw, panels grow from an anchor.** Nothing "just appears" at final size.
8. **Silence is a design tool**: one beat (0.4-1.0 s) with only a slow drift lets the previous idea land.
9. **Rhythm**: something new every 0.5-1.0 s, never the same layout for more than 3 s, a clear accent beat every 3-4 s.

## Durations and eases (defaults in `MK.ease`)

| Gesture | Duration | Ease |
|---|---|---|
| Card / panel / photo arrival | 0.5-0.7 s | `expo.out` (`MK.reveal`, `MK.photo`) |
| Icon draw-on | 0.45-0.7 s, stagger 0.08 | `power2.inOut` (`MK.drawIcon`) |
| Number roll | 0.9-1.6 s | `power3.out` (`MK.count`) |
| Bars / ring / progress | 0.7-1.2 s | `expo.out` / `power3.out` |
| Key-word box | 0.16 s | `power3.out`, starts 0-2 frames before the word |
| Subtitle word | 0.14 s (blur 6 → 0) | `power3.out` |
| Exit | 0.2-0.3 s | `power2.in` (`MK.exit`) |
| Camera push (drift) | 3-6 s, 2-4 %/s | `none` |
| Scene change | 0.5-0.8 s | a window (`MK.window`: circle/inset), a camera move or a blur-through. **Never a hard cut unless meant.** |

Stagger 0.06-0.14 s per item (0.08 for icons, 0.12 for list rows). More than 6 items: stagger from the centre or group them.

## Camera and transitions

* Treat the screen as a camera looking at a world: scale/translate a wrapper (`MK.camera`) instead of fading things.
  Push in on the subject (+3-8 %), never pull back and forth on the same decor.
* Scene changes through **brand-shaped windows**: reveal the next scene inside a circle from a point of interest, an
  inset wipe in the direction of travel, or the logo shape growing to fill the frame. This ties transitions to the brand.
* **Seams** between independently built frames must be invisible: the last image of frame N equals the first image of
  frame N+1 (same camera scale/offset, same blur, same objects). Write the handoff state in the storyboard and verify
  with `scripts/seam-check.sh`.
* Exits that continue the motion (up, blurred) hand over better than fades.

## Text

* Headlines enter word by word through a mask (`MK.headline`): `yPercent` 115 → 0, 70 ms stagger. Balanced line breaks
  (`text-wrap: balance`, already on `.mk-display`).
* The voice sentence is a subtitle (`MK.subtitle`): each word appears on its cue, 0-2 frames **early, never late**, with
  exactly **one** key word per sentence in an accent box. No second highlight mechanism anywhere.
* Short text only on screen: ≤ 7 words per headline, ≤ 45 characters per subtitle chunk.
* Numbers: tabular figures, roll to the value, unit in the same weight or lighter.

## What not to do

* No decor without meaning, no particles "for energy", no gradients that are not in the brand.
* No loop that never ends (`repeat:-1`): idle motion is a finite yoyo computed from the duration (`MK.float`, `MK.pulse`).
* No simultaneous reveals of everything, no uniform fade-ins, no sliding stock text.
* No motion that reveals nothing: if you cannot say what a movement tells the viewer, delete it.
