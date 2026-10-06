# Portrait (9:16, 1080x1920) layout spec: the same film, re-laid for a tall screen

Same voice, same timings, same words, same effects and signatures as the 16:9 film in `../explorer-towers-film/`
(its finished frames `compositions/frames/NN-*.html` are the reference: copy their timeline logic and re-layout it).
This document replaces every pixel position and every horizontal move of the 16:9 storyboard.

## Canvas and safe areas

- Canvas 1080 x 1920, 30 fps. Side margins 60 px (content inside x 60 to 1020).
- Top safe margin: nothing important above y 200 (phone UI). Bottom: nothing important below y 1560 (Reels/TikTok UI covers the bottom ~340 px).
- **Subtitle band**: y 1330 to 1520, centered, 56 px Montserrat 600, up to 2 lines (30 characters per line, 45 per chunk), same word-by-word reveal, same yellow key-word box; the band carries nothing else.
- Display words (Cormorant Garamond): « One » 260 px, « curve. » 230 px, amenity words 130 px (« Covered parking. » 80 px), « Come and see it. » 140 px, wordmark « Explorer Towers » on TWO lines (« Explorer » / « Towers ») 150 px.

## Moves: horizontal becomes vertical

- Every "pan right / lateral pan" of the 16:9 film becomes a pan DOWN (the world travels upward), same timing and easing. "Slide left" becomes "slide up". "Slides in from the right" becomes "slides in from the bottom". Never back-and-forth.
- Zooms and dives are unchanged.

## Recurring objects (copy these dimensions in every frame that shows them)

- **Facade (frame 1)**: assets/img/street-golden-hour.png cover-fit on 1080x1920 at scale 1.9 around the tower (tower centered at x 52%, roof at y 12%); the yellow line follows the balcony curve at that scale.
- **Aerial (frames 1, 2, 3, 10, 11)**: assets/img/aerial-dusk.webp scaled to height 2100 (cover), tower base at 50% / 46% of the frame; camera dive scales as in 16:9.
- **Residence cards (frames 3 to 5)**: 900 px wide, 840 px tall (render 470 px tall on top, name 40 px, FROM label, price 72 px); x = 90. World = one tall column, cards 1000 px apart (two-bedroom top, three-bedroom middle, penthouse bottom), the camera pans DOWN from card to card. The penthouse swell fills the frame (1080 wide) before the pool full-bleed.
- **Pool full-bleed (frame 5)**: sky-pool-penthouse.webp cover on 1080x1920; the four slices are HORIZONTAL bands (480 px tall each) sliding up.
- **Amenity bands (frame 6)**: five horizontal bands 1080 wide x 960 tall, stacked on one tall world (gym, sauna, garden, lounge, covered parking) with padding bands above and below so no black ever shows; the camera pans DOWN station to station; the display word sits at the foot of its band.
- **Contact card (frames 8 to 10)**: 960 px wide (x 60), radius 32, top 640, height about 760, rows stacked as in 16:9; phone row numeral 92 px (« +256 750 » in the yellow box, « 421224 » ink-dark); « Come and see it. » stacked at the top (y 230 to 560), left aligned at x 90. Frame 10: the card centers vertically (top 560) while the Viewings row takes focus.
- **End card (frame 11)**: centered column. Wordmark two lines at y 330 to 640, stroke under « Towers »; tagline in micro caps on two lines at y 700; phone at y 800 (84 px); button « WhatsApp +256 750 421224 » (860 px wide) at y 940; url at y 1030; logo plates side by side at y 1160 (each 450 px wide, 150 px tall); disclaimer at y 1330 to 1400 in 18 px (inside the safe area, above the bottom UI zone). The subtitle band is NOT used in frame 11 except as the 16:9 storyboard says (tagline words).

## Handoffs

The `handoff_in` / `handoff_out` states in STORYBOARD.md are already written for portrait: they are binding. The first image of a frame is exactly its handoff_in, the last image exactly its handoff_out.
