---
version: 2
name: "Bright Illuminated: brand-locked frame spec"
description: >
  Frame spec generated from brand.json by brand-init.py. It is the ONLY style source for every frame of this film:
  colours, fonts, components and the negative list below are binding. Tagline: Immersive technology solutions across industries.
unit: 1080×1920
principle: readable without sound · one thing to look at at a time · one accent, one highlight mechanism · the brand is never reinterpreted

colors:
  primary: "#FAE104"
  secondary: "#B8A600"
  accent: "#FAE104"          # THE accent: key-word boxes, one CTA, peak strokes
  ink: "#FFFFFF"
  ink-soft: "#B5B5B5"
  bg: "#0A0A0A"
  ground: "#0A0A0A"
  surface: "#161616"
  line: "#2A2A2A"
  on-primary: "#101010"
  on-accent: "#101010"

fonts:
  display: "Montserrat"
  body: "Montserrat"
  mono: "IBM Plex Mono"            # terminal and API card text ONLY
  note: "local woff2 only (assets/fonts, assets/fonts.css), never a network @import. No other family anywhere."

typography:
  display:  { px: 140, weight: 800, lineHeight: 1.0, tracking: "-0.03em", note: "hook words and the closing line; the sentence IS the image" }
  headline: { px: 84,  weight: 800, lineHeight: 1.05, tracking: "-0.02em" }
  subtitle: { px: 52,  weight: 600, lineHeight: 64, note: "the voice, word by word, one key word in a box of the accent colour" }
  ui:       { px: 34,  weight: 600 }
  numeral:  { px: 120, weight: 800, tabularNums: true, note: "every number rolls to its value (MK.count)" }
  micro:    { px: 22,  weight: 700, tracking: "0.22em", upper: true }

components:
  card:        "class mk-card: surface, radius token, soft shadow; arrives with x1.15 or y+60 and a 12 px blur, settles in 0.5 s expo.out"
  icon-tile:   "class mk-tile: icon drawn on by MK.drawIcon, the tile pops (scale .8 → 1) as the stroke starts"
  device:      "mk-phone / mk-browser shells; they tilt in 3D with MK.tilt (CSS 3D only, no WebGL); screen content is built from kit parts"
  chart:       "bars grow (MK.bars), ring fills (MK.ring), numbers roll (MK.count); never a static chart"
  cta:         "class mk-btn in the accent colour, ONE per film, pressed by the cursor (MK.cursor + MK.press)"
  subtitle:    "MK.subtitle: word by word on the voice cues, ONE key-word box per sentence, nothing else in its band"

negative:
  - "No colour outside the palette above and the real photos/logos. No gradients except primary → secondary."
  - "No font outside the two families above. No Inter, Roboto, Arial, system-ui as a visible face."
  - "No decor without meaning: every shape belongs to the sentence on screen."
  - "No second highlight mechanism: the accent box is the only emphasis on words."
  - "No invented facts, prices, certifications, clients or testimonials. Only content from the brand source."
  - "No bounce/elastic/back eases. No repeat:-1, no CSS animation, no Math.random."
  - "Never tween letterSpacing, width, height, top or left."
---

# Bright Illuminated: frame spec

Write one paragraph here after the brand intake: the single metaphor of the film, the worlds (light/dark), how the
logo shape becomes the transition object, and what the camera does. Keep it under 150 words.
A dark film (ground #0A0A0A) that starts where the client's own page starts: a terminal. The blinking yellow caret
« _ » of the page hero is the object-bridge of the whole film: it types the build command, falls and lands as the edge of a
landing page, becomes the pipeline, the sprint ring and the 48-hour ring, turns into the question mark of « Ready to ship? »
and blinks again on the end card. Everything the viewer reads is Montserrat (IBM Plex Mono only inside the terminal and the
API card, to confirm); yellow #FAE104 is the only accent and the only highlight (key-word boxes, the caret, the CTA).
Products are shown as real UI built from kit parts: browser and phone mockups tilting in 3D, icon tiles that draw on,
charts and numbers that roll, a board that re-lays itself out around the team. The dark logo (yellow mark, white word) is the
only logo; the camera descends through the stack from landing page to enterprise system and ends on the contact card,
the address and the 48-hour offer.
