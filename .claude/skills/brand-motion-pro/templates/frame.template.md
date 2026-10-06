---
version: 2
name: "{{name}}: brand-locked frame spec"
description: >
  Frame spec generated from brand.json by brand-init.py. It is the ONLY style source for every frame of this film:
  colours, fonts, components and the negative list below are binding. Tagline: {{tagline}}
unit: {{width}}×{{height}}
principle: readable without sound · one thing to look at at a time · one accent, one highlight mechanism · the brand is never reinterpreted

colors:
  primary: "{{c_primary}}"
  secondary: "{{c_secondary}}"
  accent: "{{c_accent}}"          # THE accent: key-word boxes, one CTA, peak strokes
  ink: "{{c_ink}}"
  ink-soft: "{{c_ink_soft}}"
  bg: "{{c_bg}}"
  surface: "{{c_surface}}"
  line: "{{c_line}}"
  on-primary: "{{c_on_primary}}"
  on-accent: "{{c_on_accent}}"

fonts:
  display: "{{display_font}}"
  body: "{{body_font}}"
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

# {{name}}: frame spec

Write one paragraph here after the brand intake: the single metaphor of the film, the worlds (light/dark), how the
logo shape becomes the transition object, and what the camera does. Keep it under 150 words.
