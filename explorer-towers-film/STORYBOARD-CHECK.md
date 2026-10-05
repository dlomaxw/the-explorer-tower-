# Storyboard check — Explorer Towers (A+C mix)

Verdicts: **held**, **held after fix**, **not held** (with reason). Timing computed, not estimated.

## Computed checks

- 11 frames, durations sum to **49.80 s** = `TOTAL` in `build-audio.sh` and the voice montage (49.80 s). Held.
- 10 seams, every `handoff_out` equals the next `handoff_in` word for word. Held. Seam 7>8 (32.30) is the one wanted hard cut (pivot black to contact), with a position match on the yellow hairline.
- `frame-packets.mjs` builds 11 packets under the 48 KB limit (largest 44.9 KB). Held after fix (frame 5 was 48.2 KB; dropped one rule).
- No `{{` placeholder left in `frame.md` or `STORYBOARD.md`. Held.

## The 15-point grid (patterns/STORYBOARD-CRAFT.md § 5)

1. Header with world map, role colors, signatures with dates, text registers: **held**.
2. Every shot has a camera track (drift + dated moves): **held**.
3. No step gap over 1 s (0.3 s in the first 3 s): **held after fix** (frame 1 scene 1 now has an event every 0.3 s). The render-time motion-energy check is still to run in step 6.
4. Appearances ≤ 0.2 s, drifts ≥ 1 s, the 0.3 to 0.9 s zone only for camera or cursor with expo/power3/power4: **held after fix**. Line draws of 0.4 to 0.7 s now use expo.out, the card rise went from 0.3 s to 0.2 s. **Not held, accepted:** the pin-to-paper wipe (0.35 s expo.in) and the card collapse (0.4 s expo.in) are treated as camera moves; flag them in the pilot if they read as effects.
5. Every hold over 0.5 s names a living layer: **held** (line, caustics, steam, hairline drift, twinkling windows, slow drift in the end card).
6. Every junction names its bridge object or vector: **held** (line, pin, card edge, slat edge, hairline, collapsed card).
7. At most 2 "effect" transitions in the film: **held** (2: day-to-night grade at 3.10 to 3.90, pin-to-paper wipe at 10.50).
8. Hard cuts within the voice's quota (0 to 4): **held** (1, at 32.30, with its line in the header).
9. Every main element has a written start state (x1.1 to x6 + blur, or a point): **held**.
10. Each word-image has its offset; composition changes land on the first word of the idea ±0.1 s or in a silence; every silence over 0.4 s is a shot with its action: **held** (gag 3.00 to 5.69, pivot 31.35 to 32.44, end hold).
11. At least 3 voice verbs played physically at ±0.1 s: **held** ("curve" drawn by the line at 0.40, "roof" touched at 2.57, "called" changing the label at 3.86 local frame 2, "looks after" is figurative and not counted).
12. Half the shots have 3 depth levels, a parallax per act, giant words pass behind or in front of an object: **not held for the giant words**. Display words sit in front of the render without passing behind an object. Fix in the pilot if it looks flat (frame 1: put the facade rail in front of "One").
13. Animated layers: running ≥ 2, peak 3 to 4, one active element at a time: **held**.
14. Rhyme: the line that climbs the tower in the hook climbs it again at 48.30, and the wordmark underline replays the curve: **held**.
15. End: a gathering gesture, a cursor that arrives in a curve and clicks directly (pressed state, ripple), 2 to 3 s of living hold, exit to black: **held** (click at 46.82, hold 47 to 49.80, black at 49.80).

## House rules

- Words only from the approved site content: prices, phone, hours, address exactly as in `site/src/content/site.ts`. No completion date, no areas, no penthouse price. **Held.**
- Email is on screen only, never spoken. **Held.**
- Developer lockup and Bright Properties logo plus the render disclaimer on the end card. **Held.**
- No generated music; sound effects only from `media-use`'s bundled folder (36 events, every name exists). **Held.**

## Open risks to look at in the pilot (frame 1)

- The yellow line must follow the real balcony curve; the styleframe A1 line was a loose squiggle.
- The sauna render is a wood close-up and may read weak in the slat. Swap for the lobby lounge if so.
- Whisper could not be downloaded here; word times come from a forced aligner, snapped on sound onsets. Listen to the gag and the pivot.
