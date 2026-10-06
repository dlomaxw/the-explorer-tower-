---
version: 2
name: "Explorer Towers: launch frame"
description: >
  PORTRAIT 9:16 (1080x1920) version. Layout, safe areas and sizes: PORTRAIT.md (it overrides every pixel value below). Video-first frame spec for the Explorer Towers launch film, direction A+C mix (A "The Curve" for the daylight offer
  world, C "Above Kampala" for the cinematic aerial opening, amenity slats and end card). One metaphor: a single yellow
  line follows the tower's curved balcony from the street to the roof, then becomes the avenue, the price underline,
  the contact card border and the wordmark underline. Three worlds: DAYLIGHT (facade, then the white-paper offer
  cards), DUSK/NIGHT (aerial, amenity slats, pivot black, contact, end card). One accent only, Bright yellow, kept for
  the key-word box of each subtitle, the line and 4 peak strokes. The sentence of the voice is a subtitle at the bottom
  center that arrives word by word, except in the typographic moments where the words are the image.
unit: 1080×1920 (9:16 portrait, layout in PORTRAIT.md)
principle: readable without sound · one thing to look at at a time · one accent, one highlight mechanism · the voice cues every reveal

colors:
  canvas: "#0c0c0e"            # night stage (aerial, slats, pivot, contact, end card)
  canvas-2: "#101216"          # secondary dark surface
  paper: "#f7f4ec"             # light world ground (offer)
  paper-2: "#efe9db"
  card-light: "#ffffff"
  ink: "#ffffff"               # text on dark
  ink-soft: "#d9dbe0"
  ink-mute: "#8d929c"
  ink-dark: "#111111"          # text on light
  ink-dark-soft: "#6a6458"
  hairline-light: "#e4dccb"
  accent: "#FFD60A"            # Bright Properties yellow: THE accent
  accent-light: "#FFE55C"
  accent-deep: "#C9A400"
  accent-glow: "#FFF0A0"

# Local woff2 files only (assets/fonts/), never a network @import. SIL Open Font License.
fonts:
  Montserrat: { files: ["assets/fonts/montserrat-latin-400-normal.woff2 (400)", "assets/fonts/montserrat-latin-600-normal.woff2 (600)", "assets/fonts/montserrat-latin-800-normal.woff2 (800)"] }
  Cormorant Garamond: { files: ["assets/fonts/cormorant-garamond-latin-500-normal.woff2 (500)", "assets/fonts/cormorant-garamond-latin-500-italic.woff2 (500 italic)", "assets/fonts/cormorant-garamond-latin-600-normal.woff2 (600)"] }

typography:
  subtitle:   { fontFamily: "Montserrat", px: 56, weight: 600, lineHeight: 68, tracking: "0", note: "PORTRAIT: the sentence of the voice centered in the band y 1330 to 1520 (up to 2 lines) that carries nothing else; (16:9 note follows) at the BOTTOM CENTER (inside the band that carries nothing else), 45 characters at most per chunk (a longer sentence splits into chunks that replace each other), word by word on its timestamps; a light shadow detaches it from the ground; ink on dark ground, ink-dark on the paper world. Never at the top left" }
  display:    { fontFamily: "Cormorant Garamond", px: 210, weight: 500, style: italic, lineHeight: 0.88, note: "ONLY the hook ('One curve.', up to 300 px), the amenity words ('A gym.', 150 px), 'Come and see it.' (120 px) and the wordmark 'Explorer Towers' (170 px, weight 600 upright). The sentence IS the image; no subtitle at the bottom meanwhile" }
  headline:   { fontFamily: "Montserrat", px: 110, weight: 800, lineHeight: 0.98, tracking: "-0.03em", note: "'One' in the hook only" }
  numeral:    { fontFamily: "Montserrat", px: 70, weight: 800, tabularNums: true, note: "prices and phone digits, every number rolls to its value, none is simply posed" }
  ui:         { fontFamily: "Montserrat", px: 34, weight: 600, lineHeight: 1.3 }
  micro:      { fontFamily: "Montserrat", px: 20, weight: 600, tracking: "0.25em", upper: true }

components:
  ground-light:
    background: "solid paper + one very soft warm radial (accent at 6%) behind the focal card + grain 3%. Full-duration class=\"clip\" layer."
  ground-dark:
    background: "full-bleed render (aerial night, dusk facade) darkened to 45-55% brightness + vignette + grain 4%, or solid canvas + one soft accent halo (14% opacity, blur 120px). Full-duration class=\"clip\" layer, never on #root."
  the-line:
    look: "THE signature: a 14 px (hook) or 5 px (later) accent stroke with round caps and a soft accent glow (drop-shadow 0 0 18px accent). It follows a real curve: the balcony curve, the avenue, the underline of a price."
    motion: "svg-path-draw (stroke-dashoffset 1 → 0), draws of 0.3 to 0.9 s use expo.out, draws of 1 s or more are linear, never a loop. Exits by continuing out of frame (vector up or right, expo.in 0.4 s) and returns at the next role."
  word-by-word:
    rule: "Each word of the subtitle appears ON its voice timestamp, grey (ink at 40%): fromTo {opacity:0, y:8, filter:blur(6px)} → {opacity:1, y:0, blur(0)} in 0.14 s, immediateRender:false, then full ink in 0.2 s. Before a seam the subtitle leaves: opacity 1 → 0 and blur 0 → 6 px in 0.14 s."
  key-word-box (THE highlight mechanism, one per sentence):
    look: "a rectangle in the accent color, radius 6px, overflowing the word by 0.14em on each side; the word turns to ink-dark inside."
    motion: "scaleX 0 → 1 from the left (transform-origin left, 0.16 s power3.out), 0 to 2 frames before the word is spoken."
    rule: "ONE box per sentence, on the word the storyboard names as [boîte : …]. No other colored text anywhere except the italic 'curve.' and 'see it.' of the display moments."
  peak-stroke (4 peaks: curve, Avenue, application, see it):
    look: "a thin accent stroke (5 px, round caps) under THE key word only."
    motion: "draws from the left (scaleX 0 → 1, 0.3 to 0.5 s power2.out) while the word is spoken."
  residence-card:
    look: "white card (card-light), radius 28px, shadow 0 30px 80px rgba(60,50,20,.18), 520 px wide, render on top (360 px high), name in 34 px Montserrat 800, price in 58 px Montserrat 800 with a micro 'FROM' label. Real renders only (assets/img/living-2bed.png, living-3bed.png, sky-pool-penthouse.webp)."
    motion: "arrives from ×1.2 and blurred 12 px or from the bottom edge with a parallax of 80 px, settles in 0.2 s expo.out; a blurred neighbour card stays at the edge for depth."
  amenity-slat:
    look: "a vertical slice of a real render (gym, sauna, garden, lounge, arrival), full height 1080, 380 to 700 px wide, darkened gradient at the bottom, the amenity word in display italic at its foot."
    motion: "slats slide in as slices from the right, 0.2 s expo.out; the camera pans across them (spatial-pan-stations); the active slat is sharp, the others blurred 1 to 3 px."
  contact-card:
    look: "white card 800 px, radius 32px, micro labels (CALL OR WHATSAPP, VIEWINGS, EMAIL, VISIT) over ui values; the phone number in numeral with '+256 750' inside a key-word box and the rest in ink-dark. Email is ON SCREEN ONLY, never spoken."
    motion: "the yellow line draws its border, then the rows enter 0.15 s apart; digits roll in groups on their cue."
  logo-plates:
    look: "two white plates radius 18px at the bottom of the end card: left the developer lockup (assets/img/developers.png, Shoal Group, 969 Development, Gabonn Associates), right 'Marketing by' + the Bright Properties logo (assets/img/bright-properties.png)."
  cursor:
    description: "White macOS arrow with dark outline + drop shadow; arrives in ONE curved move (0.4 to 0.5 s power3.out) and clicks directly: press (scale .85, 0.06 s) + accent ripple ring that expands and fades."
  end-card:
    description: "night aerial dimmed, wordmark 'Explorer Towers' assembled letter by letter, the line draws under it, tagline in micro caps, phone, URL www.explorertower.ug in small, logo plates, disclaimer 'Images are architectural renders prepared for marketing. Dimensions, finishes and landscaping are indicative.', ONE button 'WhatsApp +256 750 421224', a cursor clicks it, then 2 to 3 s of living hold (aerial drift, windows twinkling), then black."

negative:
  - "No second highlight mechanism: the key-word box is the ONLY way a word of a subtitle is emphasized."
  - "No big subtitle: 56 px; nothing but the subtitle in the band y 1330 to 1520."
  - "One thing to look at at a time. Side-by-side layouts keep equal left and right margins."
  - "No camera back-and-forth on the decor (a clear zoom or pan in one direction is welcome)."
  - "No invented facts: no completion date, no floor areas, no penthouse price, no 'sold' or 'limited' claims. Prices are exactly: two-bedroom from USD 300,000, three-bedroom from USD 400,000, penthouses on application."
  - "No hue other than the accent, except the real renders and the real logos."
  - "No Inter, Space Grotesk, Geist, system-ui. No emoji."
  - "No bouncy/elastic/back.out eases. No breathing loops, no repeat:-1."
  - "No visible text that is not listed in the Scene lines."
  - "Never tween letterSpacing."
---

# Explorer Towers: frame spec

The film has one metaphor and three grounds. **The curve** opens it on the real facade in golden light: one yellow
line climbs the balconies from the street to the roof and leaves the frame, then a silent beat flips the day to night
and the line comes back as John Babiha (Acacia) Avenue on the aerial of Kololo. A pin lands on Plot 35; the pin
expands into the **paper ground** where the three residences sit as white cards (daylight world: offer and prices).
The pool of the penthouse splits into **amenity slats** (night world), a pivot on black ("a team that looks after it
all", then nothing), and the **contact card** where the number rolls in. The line collapses into a hairline that
opens into the **end card** on the night aerial.

Everything the viewer reads is Montserrat, the display words are Cormorant Garamond italic. The sentence of the voice
is a subtitle at the bottom center, word by word, with exactly one key word per sentence in a small accent box that
traces itself first. A thin accent stroke under the key word marks the 4 peaks.
