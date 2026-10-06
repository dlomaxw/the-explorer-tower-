---
version: 2
name: "Casements Africa: Twelve Frames (9:16)"
description: >
  Frame spec for the Casements Africa whole-website film, direction A "Twelve Frames", PORTRAIT 9:16 (1080x1920).
  One metaphor, taken from the logo (a window drawn as overlapping green frames): every product line lives in a green
  window frame ("pane") on a light steel ground, the camera travels down a tall wall of panes, and the green frame lines
  are the thread: they draw a pane, extend into the next pane's edge (the mullion bridge) and at the end join into the
  logo. Quality is shown by large, clean, close-up photos of the products. One accent only, the brand yellow, for the
  key-word box of each subtitle and the periods of the labels. No client buildings, no client names or logos.
unit: 1080×1920
principle: readable without sound · one thing to look at at a time · one accent, one highlight mechanism · the voice cues every reveal · products, not clients

colors:
  ground: "#f4f6f2"            # light steel ground of the whole film
  ground-2: "#e8ede6"
  card: "#ffffff"
  green: "#1f7a3d"             # brand green: the frames
  green-dark: "#14572c"
  green-deep: "#0f2f1b"
  green-pale: "#e8f4ec"
  ink: "#101010"               # text on the light ground (brand black)
  ink-soft: "#2a2f29"
  ink-mute: "#6a6458"
  accent: "#f5b800"            # THE accent: brand yellow
  accent-deep: "#d99f00"
  on-green: "#ffffff"

fonts:
  Montserrat: { files: ["assets/fonts/montserrat-latin-400-normal.woff2 (400)", "assets/fonts/montserrat-latin-600-normal.woff2 (600)", "assets/fonts/montserrat-latin-800-normal.woff2 (800)"] }

typography:
  subtitle:   { fontFamily: "Montserrat", px: 56, weight: 600, lineHeight: 68, note: "the sentence of the voice, centered in the portrait band y 1330 to 1520 (up to 2 lines, 45 characters at most per chunk), word by word on its timestamps; ink on the light ground; a pane or photo that sits behind the band gets a pale scrim so the contrast stays at 4.5:1" }
  label:      { fontFamily: "Montserrat", px: 52, weight: 800, lineHeight: 1.05, tracking: "-0.01em", note: "product-line labels in the green bar of a pane, white on green, followed by a yellow period" }
  display:    { fontFamily: "Montserrat", px: 120, weight: 800, lineHeight: 1.0, tracking: "-0.04em", note: "the hook words, « Built to last. » and « Delivered as promised. » and the end-card name; the sentence IS the image, no subtitle meanwhile" }
  numeral:    { fontFamily: "Montserrat", px: 96, weight: 800, tabularNums: true, note: "every number rolls: 60+, 500+, 12, the phone digits" }
  micro:      { fontFamily: "Montserrat", px: 24, weight: 600, tracking: "0.25em", upper: true }
  chip:       { fontFamily: "Montserrat", px: 30, weight: 600 }

components:
  ground:
    background: "solid ground + one very soft green radial (6%) behind the focal pane + grain 3%. Full-duration class=\"clip\" layer."
  pane:
    look: "a green frame (22 px stroke, color green), the photo inside (cover-fit), a label bar at the foot (green background, white label text 52 px, yellow period), soft shadow 0 30px 70px rgba(16,16,16,.22). Sizes: pane-large 960x1000, pane-half 450x560 (2x2 grid), pane-strip 960x420."
    motion: "the frame lines DRAW first (svg-path-draw, 0.3 s expo.out), then the photo arrives from x1.15 and blurred 14 px to sharp inside the frame (0.2 s expo.out), then the label bar slides up 20 px (0.15 s). Never faded in at final size."
  mullion:
    look: "a 22 px green line (the shared edge between two panes) with a black round node (30 px) at each crossing, like the logo."
    motion: "extends from the edge of the current pane into the edge of the next one (the bridge), svg-path-draw, 0.4 s expo.out"
  key-word-box (THE highlight mechanism, one per sentence):
    look: "a rectangle in the accent color, radius 6px, overflowing the word by 0.14em on each side; the word turns ink (#101010) inside."
    motion: "scaleX 0 → 1 from the left (0.16 s power3.out), 0 to 2 frames before the word is spoken."
  word-by-word:
    rule: "each subtitle word appears ON its cue, grey (ink at 40%): fromTo {opacity:0, y:8, blur 6px} → full in 0.14 s, immediateRender:false, then full ink in 0.2 s. Before a seam the subtitle leaves: opacity 1 → 0 and blur 0 → 6 px in 0.14 s."
  stat-chip:
    look: "white chip, 3 px green border, numeral 96 px + micro label: « 60+ Years of Experience », « ISO Certified », « 500+ Projects Delivered », « 100% Genuine Materials ». Numbers roll to their value."
  logo-plate:
    look: "white plate, 14 px green border, assets/img/logo-full.png (the real logo), shadow 0 40px 90px rgba(16,16,16,.25)."
  contact-card:
    look: "white card 960 px wide, 14 px green border; micro labels (CALL, VISIT, WEB, OPEN) over 44 px values; the phone number « +256 752 » in a yellow box then « 700 700 »; hours « Mon–Fri 8:00–5:30 · Sat 8:00–1:00 »."
  cursor:
    description: "white macOS arrow with dark outline and shadow; arrives in ONE curved move (0.4 to 0.5 s power3.out) and clicks directly: press (scale .85, 0.06 s) + yellow ripple ring."
  end-card:
    description: "light ground, logo plate, « Built to last. Delivered as promised. », contact card, button « casements.co.ug » clicked by the cursor, 2 to 3 s of living hold (slow drift, a light sweep along the frame lines), then a cut to the ground color / black in the last frame."

negative:
  - "No client buildings, no client names, logos or project captions anywhere. Only the products, the factory and the Casements logo."
  - "No second highlight mechanism: the key-word box is the ONLY way a word of a subtitle is emphasized."
  - "No invented facts: no prices, no certifications beyond « ISO Certified », no counts other than 60+, 500+, 12 product lines."
  - "No customer reviews (the source marks them as placeholders)."
  - "No hue other than green, yellow, black, white and the product photos."
  - "No Inter, Space Grotesk, Geist, system-ui. No emoji."
  - "No bouncy/elastic/back.out eases. No repeat:-1, no CSS animation."
  - "No decor without meaning; nothing in the subtitle band but the subtitle."
  - "Never tween letterSpacing. Never show a photo at final size without its arrival (x1.15 + blur)."
---

# Casements Africa: frame spec

A light film built on one idea from the logo. The ground is pale steel. Every product line is a **pane**: a green
frame that draws itself, a clean close-up of the product inside, a green label bar with the line's name and a yellow
period. The camera travels DOWN a tall wall of panes (portrait), station to station, one product line per sentence.
The shared edge between two panes is a **mullion**: the green line that leaves one pane becomes the edge of the next
(the bridge), so the film never cuts, it hands over.

The film opens on four panes (Aluminium. Glass. Steel. Wood.) in total silence, then the voice carries it through
the twelve product lines, the four-step process (the panes turn into a drawing, a build, an installation), the
promise « Built to last. Delivered as promised. » on the real figures (60+ years, ISO certified, 500+ projects,
100% genuine materials), and ends on the logo, the contact card and the website.

Everything the viewer reads is Montserrat. The sentence of the voice is a subtitle in the portrait band
(y 1330 to 1520), word by word, with exactly one key word per sentence in a small yellow box that traces itself first.
