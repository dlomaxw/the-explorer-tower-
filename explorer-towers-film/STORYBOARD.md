---
format: 1920x1080
duration: "49.8s"
message: "Explorer Towers: curved-balcony residences above Kampala, where to find them, what they cost and how to reach us."
arc: Hook → Place → Offer → Amenities → Pivot → Contact → CTA
audience: "Buyers and investors looking for an apartment in Kololo, Kampala"
mode: autonomous
captions: disabled
music: "pre-mixed with voice and SFX in assets/audio/mix.wav (mounted at root by the orchestrator)"
direction: "A+C mix: A \"The Curve\" (daylight offer, yellow line) with C \"Above Kampala\" (cinematic aerial opening, amenity slats, end card)"
styleframes: "styleframes/A1.png (0.4 s), styleframes/A2.png (15 s), styleframes/A3.png (35 s), styleframes/C1.png (0.4 s), styleframes/C2.png (24.4 s), styleframes/C3.png (44 s)"
patterns: ../patterns/STORYBOARD-CRAFT.md, ../patterns/PATTERNS.md
---

## Video direction

- **One world** (frame.md): the tower and its district, travelled by one camera and one yellow line. Frame 1 = DAYLIGHT facade turning to night; frames 2 = night aerial; frames 3-5 = OFFER on the paper ground; frames 6-11 = night: amenities, pivot, contact, END CARD. Each frame paints its own full-bleed ground as a `class="clip"` layer.
- **Invisible seams**: every frame enters with `cut`; each seam falls at the top of the blur of a camera move and the `handoff_out` of frame N is copied word for word into the `handoff_in` of frame N+1. Wanted exception: hard cut at 32.30, from the black of the pivot to the contact scene (position match: the yellow hairline stays at the same place).
- **Text** (readable without sound): every sentence of the voice is a `subtitle` at the bottom center (band y 890 to 980, nothing else in it) that arrives WORD BY WORD on the timestamps given in each frame (`word@seconds`, frame-local). Exactly ONE word per sentence sits in the `key-word-box` (named in the Scene lines as [boîte : …]). Typographic moments (the words are the image, no subtitle meanwhile): the hook « One curve. » (0.05 to 2.98), the amenity words (24.48 to 29.36), « Come and see it. » (32.44 to 33.13), the wordmark (42.26 to 43.57).
- **Peaks**: 4 peaks [trait : …]: curve (0.40), Avenue (9.78), application (23.25), see it (32.91). A thin accent stroke under THE key word.
- **One thing to look at**: in every shot the camera isolates the subject of the sentence; a clear zoom or pan in one direction, never a back-and-forth; equal margins; no decor without meaning.
- **Real interfaces** (frame.md): only real renders from `site/public/media` copied in `assets/img/` and the real logos; prices and contact exactly as on the site (two-bedroom from USD 300,000, three-bedroom from USD 400,000, penthouses on application; +256 750 421224; 9:30am to 7:00pm; Plot 37 John Babiha (Acacia) Avenue, Kololo, Kampala; email on screen only).
- **Motion grammar**: two speeds, gestures of 1 to 6 images (expo.out) and linear drifts that never stop; elements arrive too big and blurred then settle; no frozen hold; no effect transition.
- **Visible copy**: exactly the quoted copy of the Scene lines, nothing else.
- **Negative list**: slideshow, screensaver, doubled object, colored text instead of the box, abstract symbol, any hue other than the accent except the real renders and logos, any invented fact (no completion date, no areas, no penthouse price).

**MONDE**
- Acte 1 (0.00 à 3.10) : the facade in golden hour ; station facade foot (0.48, 0.95) → roof (0.50, 0.15) ; fond golden sky with moving clouds
- Acte 2 (3.10 à 10.50) : the aerial of Kololo at night ; stations tower (0.52, 0.48), pin (0.52, 0.50) ; fond aerial render at 45% brightness with rings of lights
- Acte 3 (10.50 à 24.18) : the paper ground ; stations two-bedroom card (0.25, 0.5), three-bedroom (0.50, 0.5), penthouse (0.75, 0.5) ; fond paper with a warm radial
- Acte 4 (24.18 à 42.10) : night ; slats gym → sauna → garden → lounge → arrival on one wide canvas, then black, then the contact card ; fond canvas with a halo
- Acte 5 (42.10 à 49.80) : the night aerial dimmed, the end card
- Couleurs de rôle : accent = the line, the key word of each sentence, the 4 peaks ; négatif = every other hue is a real render or a real logo

**SIGNATURES**
- Mécanisme 1 « La ligne » : 0.30, 1.50, 4.70, 7.20 (avenue), 9.78, 14.90 (under the price), 20.30 (penthouse border), 24.00, 31.50 (hairline), 32.60 (card border), 41.80 (collapsed card), 42.90 (under Towers), 48.30 (tower curve) (13 times)
- Mécanisme 2 « Tranche » : 24.18, 24.30, 24.40, 24.50, 24.60 (slats slide in), then each pan station 25.0, 26.2, 27.2, 28.3 (the slice that carries the next image)
- Registres de texte : subtitle word by word (blur 6 px → 0, 0.14 s) ; key-word box (scaleX from the left, 0.16 s) ; peak stroke (draws from the left, 0.3 to 0.5 s) ; display words (x1.5 blur 18 px → sharp, 0.2 s)
- Rimes : the line that climbs the tower at 0.30 climbs it again in the end card at 48.30 ; the balcony curve of the hook returns as the underline of the wordmark at 42.90

**PARTITION CAMÉRA** (global times) : 0.00 drift up facade · 0.90 move cam(0.48,0.42,1.5) · 2.20 tilt up to the roof · 3.10 clear the roof into the sky · 4.00 tilt down onto the aerial · 5.40 dive toward the plot · 7.10 push to cam(0.52,0.50,2.0) · 9.90 dive to cam(0.52,0.50,3.0) · 10.50 settle on paper · 14.90 pan right to the three-bedroom · 18.15 pan right to the penthouse · 19.90 push to cam(0.50,0.50,1.6) · 23.70 slide left into the slats · 25.08 pan to sauna · 26.00 pan to garden · 27.10 pan to lounge · 28.00 pan to arrival · 29.47 grow into reception · 31.35 cut to black · 32.30 hard cut to contact · 34.50 push to phone · 39.30 push to Viewings · 41.00 pull-out · 42.10 open onto the aerial · 42.10 to 49.80 slow orbit drift

**VOIX** : timings in onsets.json ; silences over 0.4 s, each written as a shot with its silent action : 3.00 à 5.69 (the gag: the day turns to night) · 31.35 à 32.44 (the pivot on black) · 45.00 à 49.80 (the end card hold)

**COUPES** (quota of the voice) : 32.30 · « come » · hard cut from the black of the pivot to the contact scene, the act change from the offer to the call to action, masked by the hairline position match

**RYTHME** : opening and place (0 to 12 s): 9 shots / 10 s ; offer (12 to 24 s): 6 shots / 10 s ; amenities (24 to 29.5 s): 10 shots / 10 s ; contact (32 to 42 s): 5 shots / 10 s

**SON** (global times, on the gestures) : whoosh-cinematic 0.05 · click-soft 0.40 · riser 1.50 · sparkle 3.90 · pop 5.69 · key-press 6.00 · click-soft 9.78 · whoosh-short 10.50 · pop 10.75 · click 13.54 · ping 15.05 · click 16.82 · ping 17.65 · whoosh-short 20.28 · sparkle 22.06 · whoosh-short 23.64 · click-soft 24.48 · click-soft 25.41 · click-soft 26.50 · click-soft 27.42 · whoosh-short 29.47 · riser 29.47 (to the pivot) · impact-bass-1 31.43 · whoosh 32.30 · click 34.90, 35.66, 36.37, 37.70, 38.68 · sparkle 42.26 · notification 46.90 · click 46.82


## Frame 1: The curve · 0.00 → 5.40

- scene: The real facade, one yellow line climbs the balconies, then the day turns to night over Kololo
- duration: 5.40s
- transition_in: cut
- status: animated
- src: compositions/frames/01-curve.html
- voiceover: "one curve from the street to the roof"
- type: hook
- blueprint: camera-journey (Adapt)
- focal: the yellow line climbing the real balcony curve
- rules: svg-path-draw, depth-of-field-blur
- world: light
- handoff_in: aucun (ouverture du film) ; première image = the golden-hour facade of Explorer Towers filling the frame at scale 1.35 with the sky above, the first yellow dot of the line at the foot of the curve, nothing else on screen (the first word « One » arrives on the first frame event)
- handoff_out: à 5.40 : cam(0.50, 0.50, 1.0, rx 0, rz 0) aerial of Kololo at night, top-down tilt, tower centered at 52% / 48% of frame, blur 10 px of a camera still sliding downward at about 4 %/s; every window of the tower lit amber, the district lights on in rings around it; the yellow avenue line (5 px, glow) runs from bottom-left to the tower; no text on screen; grain 4%

Word cues: one@0.05 curve@0.40 from@1.50 the@1.67 street@1.74 to@2.38 the@2.49 roof@2.57

Scene 1 (0.00 à 1.50 s) : P1, P1, the facade and the title
  TEXTE ÉCRAN : subtitle « one curve » word by word from 0.05, [boîte : curve] at 0.40 ; display « One curve. » (One upright 210 px, curve. italic yellow) ; écart synchro ; [trait : curve] draws 0.40 to 0.80
  IMAGE DE DÉPART : handoff_in.
  ÉTAPES : 0.05 « One » slams in from x1.6 blur 24 px to sharp (0.18 s expo.out) ; 0.30 the line starts drawing at the foot of the curve ; 0.40 « curve. » arrives x1.5 blur 20 px and settles (0.2 s) with the box and the stroke ; 0.60 balcony rings light up from the bottom, one every 0.15 s ; 0.90 the line reaches the second balcony ring ; 1.20 a motion-blur ghost of the facade slides 40 px up
  PISTE CAMÉRA : drift up the facade 6 %/s ; 0.90 à 1.50 move toward cam(0.48, 0.42, 1.5) expo.inOut, blur 8 px at the top
  COUCHES ET PROFONDEUR : blurred sky foreground cut by the top edge ; sharp facade ; street trees at the bottom corners ; the line is the animated layer
  OBJET-PONT ET VECTEUR : the line → continues up the next shot (vector: up the facade, 0.6 s power2.inOut)
  SON : whoosh-cinematic at 0.05 (volume 0.5), click-soft at 0.40
  IMAGE CLÉ : 0.40 : the facade at scale 1.4, « One » white upright top-left, « curve. » yellow italic below it, the yellow line half way up the second balcony ring

Scene 2 (1.50 à 3.10 s) : P2, P2, the line climbs to the roof
  TEXTE ÉCRAN : subtitle « from the street to the roof » word by word from 1.50, [boîte : roof] at 2.57 ; écart avance 0.1 s
  IMAGE DE DÉPART : the facade and the yellow line half way up the balconies, title gone (blur 12 px out, 0.15 s)
  ÉTAPES : 1.50 subtitle chunk starts, one word every 0.1 s ; 1.70 the line passes a balcony ring and the ring glows 0.2 s, repeated at 1.95 and 2.20 ; 2.35 the roof blade lights its edge ; 2.57 « roof » box traces, the line touches the roof blade ; 2.80 subtitle leaves ; 3.00 the line exits the top of the frame
  PISTE CAMÉRA : drift up 8 %/s ; 2.20 à 3.10 tilt up toward cam(0.50, 0.15, 1.8) expo.in, blur 10 px
  COUCHES ET PROFONDEUR : foreground balcony rail blurred at the bottom edge ; sharp facade ; sky and clouds drifting in the background
  OBJET-PONT ET VECTEUR : the line → leaves by the top of the frame (vector: up, 0.4 s expo.in) and returns as the avenue in P3
  SON : riser from 1.5 to 3.0 (volume 0.3)
  IMAGE CLÉ : 2.57 : the roof blade lit, the line touching it, « from the street to the roof » with the box on roof

Scene 3 (3.10 à 5.40 s) : P3, P3, the silent gag: the day turns to night
  TEXTE ÉCRAN : aucun texte (silence 3.00 à 5.69 voulu)
  IMAGE DE DÉPART : sky above the roof, the top of the frame empty, the line gone
  ÉTAPES : 3.10 the camera clears the roof into the sky, golden grade to blue in 0.8 s ; 3.60 the sky gives way to the aerial render of the district (aerial-dusk) sliding in from the bottom at 300 px/s ; 3.90 first lights come on around the tower, staggered 0.08 s from the tower outward ; 4.30 the tower windows light amber one floor at a time (0.05 s per floor) ; 4.70 the yellow avenue line draws in from the bottom-left (svg-path-draw 0.7 s expo.out) ; 5.10 camera settles into a slow slide down
  PISTE CAMÉRA : 3.10 à 4.00 continue the tilt up ; 4.00 à 5.40 tilt down onto the aerial, 0.5 s expo.out then drift 4 %/s
  COUCHES ET PROFONDEUR : blurred rooftops foreground at the lower corners ; sharp tower ; district lights as the animated background
  OBJET-PONT ET VECTEUR : the line → the avenue (same yellow, same width)
  SON : sparkle at 3.90 (volume 0.4), whoosh-short at 3.60
  IMAGE CLÉ : 4.30 : the aerial of Kololo at night, the tower lit amber, the avenue line drawing toward it


## Frame 2: Plot 37 · 5.40 → 10.50

- scene: The pin lands on Plot 37 and the avenue gets its name
- duration: 5.10s
- transition_in: cut
- status: outline
- src: compositions/frames/02-plot.html
- voiceover: "plot thirty seven john babiha also called acacia avenue"
- type: solution
- blueprint: spatial-pan-stations (Adapt)
- focal: the pin on Plot 37 over the night aerial
- rules: coordinate-target-zoom, svg-path-draw
- world: dark
- handoff_in: à 0.00 : cam(0.50, 0.50, 1.0, rx 0, rz 0) aerial of Kololo at night, top-down tilt, tower centered at 52% / 48% of frame, blur 10 px of a camera still sliding downward at about 4 %/s; every window of the tower lit amber, the district lights on in rings around it; the yellow avenue line (5 px, glow) runs from bottom-left to the tower; no text on screen; grain 4%
- handoff_out: à 5.10 : cam(0.52, 0.50, 3.0, rx 0, rz 0) push-in onto the plot, blur 12 px of a camera still diving at about 20 %/s; aerial night at 45% brightness, street grid and yellow avenue line crossing the frame; the yellow pin (100 px, glow) at the exact center, radius-170 yellow halo at 8% opacity; no text on screen; grain 4%

Word cues: plot@0.29 thirty@0.60 seven@0.86 john@1.76 babiha@2.04 also@2.99 called@3.31 acacia@3.86 avenue@4.38

Scene 1 (0.00 à 2.55 s) : P4, P4, the pin lands on Plot 37
  TEXTE ÉCRAN : subtitle « plot thirty-seven, John Babiha, » word by word from 0.29, [boîte : seven] at 0.60 ; label « Plot 37 » ; écart avance 0.1 s
  IMAGE DE DÉPART : handoff_in.
  ÉTAPES : 0.29 the pin drops from x3 blurred 16 px onto the tower in 0.2 s expo.out ; 0.45 the halo (r 170, 8%) swells ; 0.60 « Plot 37 » label assembles letter by letter (0.04 s each) next to the pin ; 0.90 the coordinates roll in micro caps 0.3282° N · 32.5871° E ; 1.40 « Kololo · Kampala · Uganda » tag fades in top-left (blur 6 to 0) ; 1.76 « John Babiha (Acacia) Avenue, Kololo » slides along the avenue line
  PISTE CAMÉRA : dive toward the plot 10 %/s ; 1.70 à 2.55 push-in toward cam(0.52, 0.50, 2.0) expo.in, blur 8 px
  COUCHES ET PROFONDEUR : blurred rooftop foreground ; sharp pin and label ; aerial night as background ; the avenue line is the animated layer
  OBJET-PONT ET VECTEUR : the pin → stays and grows into the next shot's anchor
  SON : pop at 0.29 (0.5), key-press at 0.60 (0.3)
  IMAGE CLÉ : 0.60 : the pin on the tower, « Plot 37 » big, coordinates rolling, subtitle « plot thirty-seven » with the box on seven

Scene 2 (2.55 à 5.10 s) : P5, P5, the avenue gets its name
  TEXTE ÉCRAN : subtitle « also called Acacia Avenue. » word by word from 2.99, [boîte : Avenue] at 4.38 ; [trait : Avenue] draws 4.38 to 4.89 ; écart synchro
  IMAGE DE DÉPART : pin and label at 2.0 scale, subtitle chunk 1 leaving
  ÉTAPES : 2.60 the street label « John Babiha Avenue » runs along the avenue line ; 2.99 « also » arrives ; 3.31 « called » ; 3.86 the label letters converge into « Acacia Avenue » (0.5 s expo.out, each letter x from ±0.4em to 0) ; 4.38 the box and the stroke under « Avenue » ; 4.70 pin halo pulses once ; 4.85 camera push toward the pin
  PISTE CAMÉRA : slow push 12 %/s ; 4.50 à 5.10 dive toward cam(0.52, 0.50, 3.0) expo.in, blur 12 px at the end
  COUCHES ET PROFONDEUR : blurred night foliage foreground ; sharp label and line ; aerial street grid behind
  OBJET-PONT ET VECTEUR : the pin → fixed at the center of the frame, the camera dives to it (vector: toward the pin, 0.6 s expo.in) and it becomes the paper wipe in the next frame
  SON : click-soft at 4.38
  IMAGE CLÉ : 4.38 : the Acacia Avenue label with the yellow stroke under « Avenue », the pin at center


## Frame 3: Kololo and the two-bedroom · 10.50 → 15.78

- scene: The pin opens into paper: Kololo, Kampala, and the two-bedroom card with its price
- duration: 5.28s
- transition_in: cut
- status: outline
- src: compositions/frames/03-kololo-two-bed.html
- voiceover: "kololo kampala two bedroom homes from three hundred thousand dollars"
- type: benefit
- blueprint: grid-card-assemble (Adapt)
- focal: the two-bedroom residence card and its rolling price
- rules: counting-dynamic-scale, waterfall-entry
- world: light
- handoff_in: à 0.00 : cam(0.52, 0.50, 3.0, rx 0, rz 0) push-in onto the plot, blur 12 px of a camera still diving at about 20 %/s; aerial night at 45% brightness, street grid and yellow avenue line crossing the frame; the yellow pin (100 px, glow) at the exact center, radius-170 yellow halo at 8% opacity; no text on screen; grain 4%
- handoff_out: à 5.28 : cam(0.55, 0.50, 1.0, rx 0, rz 0) lateral pan to the right in progress at about 120 %/s, blur 14 px; paper ground; the two-bedroom card leaves to the left edge (blurred), the three-bedroom card enters at center-right at x1.1 and 80% of its width visible, the penthouse card blurred at the right edge; USD 300,000 already settled in its yellow box; no subtitle on screen; grain 3%

Word cues: kololo@0.25 kampala@1.05 two@2.21 bedroom@2.37 homes@2.74 from@3.18 three@3.54 hundred@3.76 thousand@4.13 dollars@4.55

Scene 1 (0.00 à 2.00 s) : P6, P6, the pin opens into paper: Kololo, Kampala
  TEXTE ÉCRAN : subtitle « Kololo, Kampala. » word by word from 0.25, [boîte : Kololo] at 0.25 ; display word « Kololo » settles ; écart synchro
  IMAGE DE DÉPART : handoff_in.
  ÉTAPES : 0.00 the pin dot (yellow) grows from 100 px to the full frame in 0.35 s expo.in, wiping to paper (the iris is the pin) ; 0.25 « Kololo » appears in display italic 150 px x1.5 blur 18 px and settles ; 0.60 the map lines fade into paper and become faint hairlines ; 1.05 « Kampala » arrives on the right of « Kololo » ; 1.40 hairlines resolve into the white outline of a card edge entering from the bottom ; 1.75 first card edge at the bottom of the frame
  PISTE CAMÉRA : from the dive, settle: 0.00 à 0.40 expo.out to cam(0.50, 0.50, 1.0) ; drift up 3 %/s ; 1.75 à 2.00 tilt toward cam(0.50, 0.58, 1.0)
  COUCHES ET PROFONDEUR : blurred hairlines foreground ; sharp display words ; paper ground with a soft warm radial
  OBJET-PONT ET VECTEUR : the pin → the paper wipe ; the card edge → the first residence card
  SON : whoosh-short at 0.00 (0.5), pop at 0.25 (0.3)
  IMAGE CLÉ : 0.25 : paper ground, « Kololo » in big yellow-free italic ink-dark, the subtitle with the box on Kololo

Scene 2 (2.00 à 5.28 s) : P7, P7, the two-bedroom card and its price
  TEXTE ÉCRAN : subtitle « two-bedroom homes from » then « three hundred thousand dollars » word by word from 2.21, [boîte : dollars] at 4.55 ; écart avance 0.1 s
  IMAGE DE DÉPART : paper ground, first card edge rising at the bottom, display words gone
  ÉTAPES : 2.00 the two-bedroom card rises from the bottom edge with a parallax of 80 px (0.2 s expo.out), render on top ; 2.21 subtitle starts ; 2.60 the three-bedroom card appears blurred 6 px at the right edge ; 3.10 the card name « Two-bedroom » types in 0.2 s ; 3.54 « FROM » label then the price counter rolls USD 0 to 300,000 over 1.0 s (counter rule) ; 4.55 the box traces on « dollars » and the price gets its yellow box ; 4.90 the line draws under the price box, 0.4 s expo.out
  PISTE CAMÉRA : slow push 4 %/s ; 4.60 à 5.28 pan right toward cam(0.55, 0.50, 1.0) expo.inOut, blur 14 px at the top
  COUCHES ET PROFONDEUR : blurred penthouse card at the far right edge ; sharp two-bedroom card ; paper ground ; the counter is the animated layer
  OBJET-PONT ET VECTEUR : the price box → stays and the card is pushed left by the pan (vector: left, 0.6 s expo.inOut) as the next card arrives
  SON : click at 3.54 (0.3), ping at 4.55 (0.4)
  IMAGE CLÉ : 4.55 : the two-bedroom card centered, USD 300,000 in its yellow box, subtitle « three hundred thousand dollars » with the box on dollars


## Frame 4: Three-bedroom and penthouses · 15.78 → 21.14

- scene: The three-bedroom card and the penthouse card swell into the pool
- duration: 5.36s
- transition_in: cut
- status: outline
- src: compositions/frames/04-three-bed-penthouses.html
- voiceover: "three bedroom from four hundred thousand and two six bedroom penthouses"
- type: benefit
- blueprint: camera-journey (Adapt)
- focal: the three-bedroom card then the penthouse card
- rules: counting-dynamic-scale, center-outward-expansion
- world: light
- handoff_in: à 0.00 : cam(0.55, 0.50, 1.0, rx 0, rz 0) lateral pan to the right in progress at about 120 %/s, blur 14 px; paper ground; the two-bedroom card leaves to the left edge (blurred), the three-bedroom card enters at center-right at x1.1 and 80% of its width visible, the penthouse card blurred at the right edge; USD 300,000 already settled in its yellow box; no subtitle on screen; grain 3%
- handoff_out: à 5.36 : cam(0.50, 0.50, 1.6, rx 0, rz 0) push-in toward the penthouse card, blur 10 px; the penthouse card fills 70% of the frame with the sky-pool render, its yellow border drawn, the other two cards pushed out left and blurred 8 px; paper ground only visible at the edges; no subtitle on screen; grain 3%

Word cues: three@0.19 bedroom@0.39 from@1.08 four@1.37 hundred@1.57 thousand@1.87 and@2.74 two@3.31 six@3.63 bedroom@4.06 penthouses@4.47

Scene 1 (0.00 à 2.36 s) : P8, P8, the three-bedroom card and its price
  TEXTE ÉCRAN : subtitle « three-bedroom, from » then « four hundred thousand » word by word from 0.19, [boîte : thousand] at 1.87 ; écart avance 0.1 s
  IMAGE DE DÉPART : handoff_in.
  ÉTAPES : 0.00 the pan settles on the three-bedroom card (0.35 s expo.out) ; 0.19 subtitle starts ; 0.45 name « Three-bedroom » types ; 0.70 « FROM » label ; 0.85 price counter rolls USD 0 to 400,000 over 1.0 s ; 1.30 the two-bedroom card drifts left and blurs to 8 px ; 1.87 the box on « thousand » and the yellow box on the price ; 2.20 camera starts to pan right
  PISTE CAMÉRA : settle 0.00 à 0.35 ; drift 3 %/s ; 2.00 à 2.36 start pan right toward cam(0.62, 0.50, 1.0)
  COUCHES ET PROFONDEUR : blurred two-bedroom card at left ; sharp three-bedroom card ; blurred penthouse card at the right edge
  OBJET-PONT ET VECTEUR : the price box → stays on its card as the pan leaves it
  SON : click at 0.85 (0.3), ping at 1.87 (0.4)
  IMAGE CLÉ : 1.87 : the three-bedroom card centered with USD 400,000 boxed

Scene 2 (2.36 à 5.36 s) : P9, P9, the penthouses
  TEXTE ÉCRAN : subtitle « and two six-bedroom penthouses, » word by word from 2.74, [boîte : penthouses] at 4.47 ; écart avance 0.1 s
  IMAGE DE DÉPART : the pan to the right in progress, the penthouse card arriving
  ÉTAPES : 2.36 the pan lands on the penthouse card (0.4 s expo.out) ; 2.74 « and » ; 3.00 name « Six-bedroom penthouses » types ; 3.40 the sky-pool render drifts up 30 px inside its frame ; 3.90 « PRICE » label ; 4.47 box on « penthouses » ; 4.50 the card swells x1.8 (0.4 s power3.out) pushing the others off ; 4.90 the yellow border draws round the card (the line)
  PISTE CAMÉRA : settle 2.36 à 2.76 ; push 8 %/s ; 4.50 à 5.36 push toward cam(0.50, 0.50, 1.6) expo.in, blur 10 px
  COUCHES ET PROFONDEUR : blurred two-bedroom card pushed left ; sharp penthouse card ; paper ground at the edges
  OBJET-PONT ET VECTEUR : the penthouse card → the full-bleed pool (vector: outward growth, 0.9 s expo.in)
  SON : whoosh-short at 4.50 (0.4)
  IMAGE CLÉ : 4.47 : the penthouse card swelling, the pool render glowing, yellow border drawing


## Frame 5: Priced on application · 21.14 → 24.18

- scene: The pool, then « On application » and the render slices into slats
- duration: 3.04s
- transition_in: cut
- status: outline
- src: compositions/frames/05-on-application.html
- voiceover: "each with its own pool priced on application"
- type: benefit
- blueprint: kinetic-type-beats (Adapt)
- focal: the pool render and « On application »
- rules: svg-path-draw
- world: light
- handoff_in: à 0.00 : cam(0.50, 0.50, 1.6, rx 0, rz 0) push-in toward the penthouse card, blur 10 px; the penthouse card fills 70% of the frame with the sky-pool render, its yellow border drawn, the other two cards pushed out left and blurred 8 px; paper ground only visible at the edges; no subtitle on screen; grain 3%
- handoff_out: à 3.04 : cam(0.50, 0.50, 1.2, rx 0, rz 0) the pool render full-bleed, split along four vertical cuts that are sliding apart to the left at about 400 px/s, blur 12 px, paper ground gone; night grade starting (brightness 70%); the yellow line along the pool glass edge; no text on screen; grain 4%

Word cues: each@0.11 with@0.35 its@0.53 own@0.67 pool@0.92 priced@1.58 on@1.94 application@2.11

Scene 1 (0.00 à 1.38 s) : P10, P10, each with its own pool
  TEXTE ÉCRAN : subtitle « each with its own pool, » word by word from 0.11, [boîte : pool] at 0.92 ; écart avance 0.1 s
  IMAGE DE DÉPART : handoff_in.
  ÉTAPES : 0.00 the card growth completes into the full-bleed pool render ; 0.11 subtitle starts ; 0.30 water caustics shimmer across the render (animated layer) ; 0.60 the glass edge catches a highlight sweeping left to right ; 0.92 box on « pool » ; 1.20 sparkle on the water surface
  PISTE CAMÉRA : push 6 %/s toward the pool edge ; 1.10 à 1.38 hold the push
  COUCHES ET PROFONDEUR : blurred balcony rail foreground ; sharp pool and glass ; sky at the top
  OBJET-PONT ET VECTEUR : the card → full-bleed pool
  SON : sparkle at 0.92 (0.3)
  IMAGE CLÉ : 0.92 : the pool full-bleed, « each with its own pool » with the box on pool

Scene 2 (1.38 à 3.04 s) : P11, P11, priced on application
  TEXTE ÉCRAN : subtitle « priced on application. » word by word from 1.58, [boîte : application] at 2.11 ; [trait : application] draws 2.11 to 2.60 ; display « On application » in italic 110 px ; écart synchro
  IMAGE DE DÉPART : pool full-bleed, push in progress
  ÉTAPES : 1.58 « priced » ; 1.70 the render darkens to 70% brightness (0.3 s) ; 1.95 display « On application » lands x1.4 blur 14 px and settles over the pool ; 2.11 box on « application » and the stroke ; 2.50 the render starts to slice vertically (four cuts) ; 2.80 the slices slide left at 400 px/s
  PISTE CAMÉRA : push 6 %/s ; 2.50 à 3.04 slide left toward cam(0.80, 0.50, 1.2) expo.in, blur 12 px
  COUCHES ET PROFONDEUR : blurred rail foreground ; sharp display words ; pool behind
  OBJET-PONT ET VECTEUR : the pool → four slats (vector: left, 0.54 s expo.in)
  SON : whoosh-short at 2.50 (0.5)
  IMAGE CLÉ : 2.11 : « On application » italic over the dimmed pool with the stroke under application


## Frame 6: Amenities, five stations · 24.18 → 29.47

- scene: Five amenity slats traversed by one camera: gym, sauna, garden, lounge, covered parking
- duration: 5.29s
- transition_in: cut
- status: outline
- src: compositions/frames/06-amenities.html
- voiceover: "a gym a sauna a garden a lounge covered parking"
- type: benefit
- blueprint: spatial-pan-stations (Adapt)
- focal: five amenity slats traversed by one camera
- rules: depth-of-field-blur, kinetic-beat-slam
- world: dark
- handoff_in: à 0.00 : cam(0.50, 0.50, 1.2, rx 0, rz 0) the pool render full-bleed, split along four vertical cuts that are sliding apart to the left at about 400 px/s, blur 12 px, paper ground gone; night grade starting (brightness 70%); the yellow line along the pool glass edge; no text on screen; grain 4%
- handoff_out: à 5.29 : cam(0.80, 0.50, 1.0, rx 0, rz 0) lateral pan to the right ending, blur 12 px; night; the arrival-podium slat (covered parking) at center sharp-fading, the lounge slat blurred 3 px at left; display words gone; no text on screen; grain 4%

Word cues: a@0.24 gym@0.30 a@1.20 sauna@1.23 a@2.22 garden@2.32 a@3.22 lounge@3.24 covered@4.30 parking@4.63

Scene 1 (0.00 à 1.80 s) : P12, P12, a gym, a sauna
  TEXTE ÉCRAN : display « A gym. » at 0.30 and « A sauna. » at 1.23 (typographic moments, no subtitle) ; écart synchro
  IMAGE DE DÉPART : handoff_in.
  ÉTAPES : 0.00 the slats slide into place as slices from the right (0.2 s expo.out each, 0.06 s apart) ; 0.30 « A gym. » lands x1.5 blur 16 px on the gym slat ; 0.55 gym slat light sweeps (the treadmill glints) ; 0.90 the camera starts its pan to the sauna slat ; 1.23 « A sauna. » lands on the sauna slat ; 1.50 steam particles rise across the sauna slat
  PISTE CAMÉRA : pan left to right station to station: 0.90 à 1.30 expo.inOut to the sauna ; drift 5 %/s
  COUCHES ET PROFONDEUR : blurred neighbour slats 1 to 3 px ; sharp active slat ; night ground
  OBJET-PONT ET VECTEUR : the slat edge → the next slat (the pan carries the slice)
  SON : click-soft at 0.30 (0.4), click-soft at 1.23 (0.4)
  IMAGE CLÉ : 0.30 : the gym slat sharp with « A gym. » in italic, the others blurred

Scene 2 (1.80 à 3.52 s) : P13, P13, a garden, a lounge
  TEXTE ÉCRAN : display « A garden. » at 2.32 and « A lounge. » at 3.22 (typographic moments) ; écart synchro
  IMAGE DE DÉPART : sauna slat sharp, steam rising, pan in progress
  ÉTAPES : 1.80 pan starts to the garden slat ; 2.32 « A garden. » lands ; 2.60 leaves of the garden render sway ; 2.90 the pan moves to the lounge slat ; 3.22 « A lounge. » lands ; 3.45 a lamp glow on the lounge slat
  PISTE CAMÉRA : pan 1.80 à 2.20 and 2.90 à 3.20 expo.inOut ; drift 5 %/s
  COUCHES ET PROFONDEUR : blurred slats at 1 to 3 px ; sharp active slat
  OBJET-PONT ET VECTEUR : the slat edge → the next slat
  SON : click-soft at 2.32 (0.4), click-soft at 3.22 (0.4)
  IMAGE CLÉ : 2.32 : the garden slat with « A garden. » italic

Scene 3 (3.52 à 5.29 s) : P14, P14, covered parking
  TEXTE ÉCRAN : display « Covered parking. » at 4.30 (typographic moment, 90 px) ; écart synchro
  IMAGE DE DÉPART : lounge slat sharp, the arrival-podium slat blurred at the right
  ÉTAPES : 3.52 pan toward the arrival slat ; 4.30 « Covered parking. » lands ; 4.60 headlights sweep across the arrival render ; 4.90 the camera pushes slightly in ; 5.10 the pan to the right starts again
  PISTE CAMÉRA : pan 3.52 à 4.00 expo.inOut ; push 5 %/s ; 5.00 à 5.29 pan right to cam(0.80, 0.50, 1.0) blur 12 px
  COUCHES ET PROFONDEUR : blurred lounge slat at left ; sharp arrival slat
  OBJET-PONT ET VECTEUR : the slat → the lobby render behind the next frame
  SON : whoosh-short at 5.00 (0.3)
  IMAGE CLÉ : 4.30 : the arrival slat sharp with « Covered parking. » in italic


## Frame 7: The team, then black · 29.47 → 32.30

- scene: The team that looks after it all, then black with a yellow hairline
- duration: 2.83s
- transition_in: cut
- status: outline
- src: compositions/frames/07-team-pivot.html
- voiceover: "and a team that looks after it all"
- type: benefit
- blueprint: titlecard-reveal (Adapt)
- focal: the reception render, then black with the yellow hairline
- rules: svg-path-draw
- world: dark
- handoff_in: à 0.00 : cam(0.80, 0.50, 1.0, rx 0, rz 0) lateral pan to the right ending, blur 12 px; night; the arrival-podium slat (covered parking) at center sharp-fading, the lounge slat blurred 3 px at left; display words gone; no text on screen; grain 4%
- handoff_out: à 2.83 : cam(0.50, 0.50, 1.15, rx 0, rz 0) black, the screen empty except one yellow hairline (4 px, 420 px long, glow) at the exact center drifting right at 20 px/s; no render, no text, no subtitle; the room silent under the music cut; grain 4% only

Word cues: and@0.11 a@0.23 team@0.30 that@0.78 looks@0.90 after@1.22 it@1.58 all@1.67

Scene 1 (0.00 à 1.88 s) : P15, P15, a team that looks after it all
  TEXTE ÉCRAN : subtitle « and a team that looks after it all. » word by word from 0.11, [boîte : team] at 0.30 ; écart avance 0.1 s
  IMAGE DE DÉPART : handoff_in.
  ÉTAPES : 0.00 the arrival slat grows full-bleed into the reception render ; 0.11 subtitle starts ; 0.40 the render slows its drift (the ending of the list) ; 0.80 a warm light sweeps the reception desk ; 1.20 the render darkens to 60% ; 1.68 last word spoken
  PISTE CAMÉRA : push 5 %/s toward the desk ; calm
  COUCHES ET PROFONDEUR : blurred plant foreground ; sharp reception ; soft night ground
  OBJET-PONT ET VECTEUR : the slat → the reception render
  SON : riser from 0.00 to 1.88 (0.5) leading into the cut
  IMAGE CLÉ : 0.30 : the reception render with « and a team that looks after it all » and the box on team

Scene 2 (1.88 à 2.83 s) : P16, P16, the pivot on black
  TEXTE ÉCRAN : aucun texte (silence 31.35 à 32.44 voulu)
  IMAGE DE DÉPART : reception render darkened, the last word leaving
  ÉTAPES : 1.88 the image cuts to black on the end of « all » in 0.10 s (the pivot, the music is cut) ; 1.95 impact-bass low hit ; 2.10 the yellow hairline fades up at the center (4 px, 420 px) ; 2.40 the hairline starts to drift right and to glow brighter ; 2.70 hairline pulse
  PISTE CAMÉRA : no camera ; hairline drift 20 px/s
  COUCHES ET PROFONDEUR : pure black ; one living layer: the hairline
  OBJET-PONT ET VECTEUR : the hairline → the border of the contact card in the next frame
  SON : impact-bass-1 at 1.95 (0.7)
  IMAGE CLÉ : 2.40 : black with the yellow hairline at center, nothing else


## Frame 8: Come and see it · 32.30 → 34.72

- scene: « Come and see it. » and the contact card border draws from the hairline
- duration: 2.42s
- transition_in: cut
- status: outline
- src: compositions/frames/08-come-and-see-it.html
- voiceover: "come and see it call or whatsapp"
- type: cta
- blueprint: kinetic-type-beats (Adapt)
- focal: the display words « Come and see it. » and the card border
- rules: svg-path-draw, kinetic-beat-slam
- world: dark
- handoff_in: à 0.00 : cam(0.50, 0.50, 1.15, rx 0, rz 0) black, the screen empty except one yellow hairline (4 px, 420 px long, glow) at the exact center drifting right at 20 px/s; no render, no text, no subtitle; the room silent under the music cut; grain 4% only
- handoff_out: à 2.42 : cam(0.50, 0.50, 1.05, rx 0, rz 0) night dusk tower render at 45% brightness blurred 3 px behind, drifting left at 1.5 %/s; the contact card (800 px, white) fully in place at the right with its phone row showing empty placeholders in a yellow box; display words 'Come and see it.' settled at the left; no subtitle; grain 4%

Word cues: come@0.14 and@0.30 see@0.41 it@0.61 call@1.23 or@1.62 whatsapp@1.77

Scene 1 (0.00 à 1.30 s) : P17, P17, come and see it
  TEXTE ÉCRAN : display « Come and see it. » (Come and upright 120 px, see it. italic yellow) at 0.14, [trait : see it] draws 0.61 to 1.10 ; écart synchro
  IMAGE DE DÉPART : handoff_in.
  ÉTAPES : 0.00 hard cut from black: the hairline stays and the dusk tower render fades in blurred 3 px behind (0.3 s) ; 0.14 « Come » lands x1.5 blur 18 px ; 0.30 « and » ; 0.42 « see » ; 0.61 « it. » with the stroke ; 0.90 the hairline grows into a rounded rectangle path at the right (the card border draws, 0.4 s expo.out) ; 1.10 the card fills white from its border
  PISTE CAMÉRA : drift left 1.5 %/s ; 0.00 à 0.40 push-in 6 %/s
  COUCHES ET PROFONDEUR : blurred tower behind ; sharp display words ; card border as the animated layer
  OBJET-PONT ET VECTEUR : the hairline → the border of the contact card
  SON : whoosh at 0.00 (0.3), pop at 1.10 (0.3)
  IMAGE CLÉ : 0.61 : the dusk tower dimmed, « Come and see it. » with « see it. » yellow italic and its stroke, the card border drawing at the right

Scene 2 (1.30 à 2.42 s) : P18, P18, call or WhatsApp
  TEXTE ÉCRAN : subtitle « call or whatsapp » word by word from 1.23, [boîte : whatsapp] at 1.77 ; micro label « CALL OR WHATSAPP » in the card ; écart avance 0.1 s
  IMAGE DE DÉPART : the card fully drawn, display words settled
  ÉTAPES : 1.30 label « CALL OR WHATSAPP » types in the card ; 1.50 the phone row shows three empty groups in a yellow box ; 1.77 the box on « whatsapp » ; 2.00 the other rows (VIEWINGS, EMAIL, VISIT) slide in 0.15 s apart with their labels only ; 2.30 camera settles for the number
  PISTE CAMÉRA : drift left 1.5 %/s ; 2.00 à 2.42 push toward the phone row
  COUCHES ET PROFONDEUR : blurred tower behind ; sharp card ; display words at left
  OBJET-PONT ET VECTEUR : the card → stays, the number fills its phone row in the next frame
  SON : key-press at 1.30 (0.3)
  IMAGE CLÉ : 1.77 : the card with « CALL OR WHATSAPP » and the empty phone row, subtitle with the box on whatsapp


## Frame 9: The number · 34.72 → 39.66

- scene: The phone number rolls in digit by digit
- duration: 4.94s
- transition_in: cut
- status: outline
- src: compositions/frames/09-number.html
- voiceover: "plus two five six seven five zero four two one two two four"
- type: cta
- blueprint: dataviz-countup (Adapt)
- focal: the phone number rolling in the contact card
- rules: counting-dynamic-scale, stat-bars-and-fills
- world: dark
- handoff_in: à 0.00 : cam(0.50, 0.50, 1.05, rx 0, rz 0) night dusk tower render at 45% brightness blurred 3 px behind, drifting left at 1.5 %/s; the contact card (800 px, white) fully in place at the right with its phone row showing empty placeholders in a yellow box; display words 'Come and see it.' settled at the left; no subtitle; grain 4%
- handoff_out: à 4.94 : cam(0.50, 0.50, 1.12, rx 0, rz 0) push-in toward the Viewings row of the contact card, blur 8 px; the card shows +256 750 421224 complete, rows VIEWINGS, EMAIL, VISIT visible; night tower render blurred 3 px behind; subtitle band empty; grain 4%

Word cues: plus@0.18 two@0.49 five@0.69 six@0.94 seven@1.65 five@1.95 zero@2.21 four@2.98 two@3.12 one@3.35 two@3.96 two@4.13 four@4.34

Scene 1 (0.00 à 2.38 s) : P19, P19, plus two five six, seven five zero
  TEXTE ÉCRAN : subtitle « plus two five six, » then « seven five zero » word by word from 0.18, [boîte : six] at 0.94, [boîte : zero] at 2.21 ; the phone row on screen ; écart avance 0.1 s
  IMAGE DE DÉPART : handoff_in.
  ÉTAPES : 0.18 « +256 » rolls into the first yellow box digit by digit (0.1 s per digit) on plus two five six ; 0.94 box on six ; 1.65 « 750 » rolls in on seven five zero ; 2.21 box on zero ; 0.60 the card tilts 1 degree toward the viewer (rx 2) ; 1.30 the card glow sweeps
  PISTE CAMÉRA : push-in 4 %/s ; 1.60 à 2.38 push toward cam(0.50, 0.50, 1.08) expo.inOut
  COUCHES ET PROFONDEUR : blurred tower behind ; sharp card ; digits as the animated layer
  OBJET-PONT ET VECTEUR : the digit groups → the rest of the number in the next shot
  SON : click at 0.18, click at 0.94, click at 1.65, click at 2.21 (0.3 each)
  IMAGE CLÉ : 0.94 : the card with +256 rolled in, the box on six

Scene 2 (2.38 à 4.94 s) : P20, P20, four two one, two two four
  TEXTE ÉCRAN : subtitle « four two one, » then « two two four. » word by word from 2.98, [boîte : one] at 3.35, [boîte : four] at 4.34 ; écart avance 0.1 s
  IMAGE DE DÉPART : the card with +256 750 rolled in
  ÉTAPES : 2.98 « 421 » rolls in digit by digit ; 3.35 box on one ; 3.96 « 224 » rolls in ; 4.34 box on four ; 4.50 the full number settles in ink-dark with « +256 750 » in the yellow box ; 4.70 camera pushes toward the Viewings row
  PISTE CAMÉRA : drift 4 %/s ; 4.50 à 4.94 push toward cam(0.50, 0.58, 1.12) expo.inOut, blur 8 px
  COUCHES ET PROFONDEUR : blurred tower behind ; sharp card
  OBJET-PONT ET VECTEUR : the card → stays, Viewings row becomes the focus
  SON : click at 2.98, click at 3.35, click at 3.96, click at 4.34 (0.3 each)
  IMAGE CLÉ : 4.34 : the complete number +256 750 421224 with the yellow box on +256 750


## Frame 10: Viewings · 39.66 → 42.10

- scene: Viewings: the hours bar fills, then the card collapses into a line
- duration: 2.44s
- transition_in: cut
- status: outline
- src: compositions/frames/10-viewings.html
- voiceover: "viewings nine thirty to seven"
- type: cta
- blueprint: dataviz-countup (Adapt)
- focal: the hours bar filling from 9:30 to 7:00
- rules: stat-bars-and-fills, svg-path-draw
- world: dark
- handoff_in: à 0.00 : cam(0.50, 0.50, 1.12, rx 0, rz 0) push-in toward the Viewings row of the contact card, blur 8 px; the card shows +256 750 421224 complete, rows VIEWINGS, EMAIL, VISIT visible; night tower render blurred 3 px behind; subtitle band empty; grain 4%
- handoff_out: à 2.44 : cam(0.50, 0.50, 1.0, rx 0, rz 0) the contact card has collapsed into one yellow horizontal line (5 px, 900 px wide, glow) at y 540, still contracting toward the center at 600 px/s; night aerial at 35% brightness, blurred 6 px, behind; no text on screen; grain 4%

Word cues: viewings@0.23 nine@0.92 thirty@1.20 to@1.54 seven@1.69

Scene 1 (0.00 à 1.40 s) : P21, P21, viewings
  TEXTE ÉCRAN : subtitle « viewings » word by word from 0.23, [boîte : viewings] at 0.23 ; label « VIEWINGS » ; écart avance 0.1 s
  IMAGE DE DÉPART : handoff_in.
  ÉTAPES : 0.00 the Viewings row fills the frame (push completes) ; 0.23 box on « viewings » ; 0.50 the yellow bar (26 px, empty track) draws under the row ; 0.80 the 9:30 marker rolls in left ; 1.00 « 9:30am » counter rolls ; 1.20 EMAIL and VISIT rows fade in below, small
  PISTE CAMÉRA : settle 0.00 à 0.30 ; drift 3 %/s
  COUCHES ET PROFONDEUR : blurred card edge foreground ; sharp row ; tower behind
  OBJET-PONT ET VECTEUR : the track → the filled hours bar
  SON : pop at 0.23 (0.3), click at 1.00 (0.3)
  IMAGE CLÉ : 0.23 : the Viewings row with the empty yellow track

Scene 2 (1.40 à 2.44 s) : P22, P22, nine thirty to seven
  TEXTE ÉCRAN : subtitle « nine thirty to seven » word by word from 0.91, [boîte : thirty] at 1.20 ; écart avance 0.1 s
  IMAGE DE DÉPART : Viewings row with the empty track
  ÉTAPES : 1.40 the yellow bar fills from 9:30 to 7:00 over 0.8 s (stat-bars-and-fills) ; 1.60 « 7:00pm » counter rolls ; 1.70 the card collapses toward the center in 0.4 s expo.in ; 2.10 the card becomes one yellow horizontal line (the line) ; 2.30 the line keeps contracting
  PISTE CAMÉRA : pull-out 1.70 à 2.44 toward cam(0.50, 0.50, 1.0) expo.in, blur 10 px
  COUCHES ET PROFONDEUR : blurred tower behind ; sharp card shrinking
  OBJET-PONT ET VECTEUR : the card → the yellow horizontal line (vector: contracting toward the center, 0.6 s expo.in)
  SON : whoosh-short at 1.70 (0.4)
  IMAGE CLÉ : 1.40 : the bar filling from 9:30 to 7:00 with « nine thirty to seven » and the box on thirty


## Frame 11: Explorer Towers · 42.10 → 49.80

- scene: The wordmark assembles, plates rise, a cursor clicks the WhatsApp button, living hold, black
- duration: 7.70s
- transition_in: cut
- status: outline
- src: compositions/frames/11-end-card.html
- voiceover: "explorer towers curved balcony residences above kampala"
- type: cta
- blueprint: logo-assemble-lockup (Adapt)
- focal: the wordmark, plates and the button click
- rules: cursor-click-ripple, svg-path-draw
- world: dark
- handoff_in: à 0.00 : cam(0.50, 0.50, 1.0, rx 0, rz 0) the contact card has collapsed into one yellow horizontal line (5 px, 900 px wide, glow) at y 540, still contracting toward the center at 600 px/s; night aerial at 35% brightness, blurred 6 px, behind; no text on screen; grain 4%
- handoff_out: aucun (fin du film, noir à 7.70)

Word cues: explorer@0.16 towers@0.81 curved@1.88 balcony@2.23 residences@2.68 above@3.50 kampala@3.83

Scene 1 (0.00 à 2.00 s) : P23, P23, the wordmark
  TEXTE ÉCRAN : display « Explorer Towers » (serif 600, 170 px) at 0.16, [trait : Towers] draws 0.81 to 1.30 ; écart synchro
  IMAGE DE DÉPART : handoff_in.
  ÉTAPES : 0.00 the line opens upward into the night aerial (it becomes the avenue again, 0.4 s) ; 0.16 « Explorer » falls in letter by letter, each letter x1.4 blurred, sharp in 0.12 s ; 0.60 « Towers » follows ; 0.81 the stroke draws under « Towers » ; 1.20 window lights flicker on in the aerial behind ; 1.60 camera starts a slow orbit drift
  PISTE CAMÉRA : drift down and left 3 %/s ; no stops
  COUCHES ET PROFONDEUR : blurred aerial foreground at the corners ; sharp wordmark ; night aerial dimmed behind
  OBJET-PONT ET VECTEUR : the line → the stroke under the wordmark (the rhyme with the hook)
  SON : sparkle at 0.16 (0.3)
  IMAGE CLÉ : 0.81 : the wordmark with the yellow stroke under Towers over the dimmed night aerial

Scene 2 (2.00 à 4.30 s) : P24, P24, the promise and the plates
  TEXTE ÉCRAN : subtitle « curved-balcony residences above Kampala » word by word from 1.88 then micro caps tagline, [boîte : Kampala] at 3.83 ; plates ; écart synchro
  IMAGE DE DÉPART : wordmark settled with its stroke
  ÉTAPES : 2.00 the tagline in micro caps types word by word under the wordmark on its cues ; 3.83 box on « Kampala » ; 3.20 the phone « +256 750 421224 » rolls in ; 3.50 the two logo plates rise 40 px from the bottom edge (0.25 s expo.out, 0.1 s apart) ; 3.90 the disclaimer line fades in at the bottom ; 4.10 url « www.explorertower.ug » in small
  PISTE CAMÉRA : slow drift 3 %/s
  COUCHES ET PROFONDEUR : blurred aerial foreground ; sharp text and plates
  OBJET-PONT ET VECTEUR : the plates → stay (the end card is the hold)
  SON : click-soft at 3.20 (0.3), pop at 3.50 (0.3)
  IMAGE CLÉ : 3.83 : wordmark, tagline with the box on Kampala, phone, plates at the bottom, disclaimer

Scene 3 (4.30 à 7.70 s) : P25, P25, the click and the living hold
  TEXTE ÉCRAN : button label « WhatsApp +256 750 421224 » ; aucun subtitle ; écart aucun
  IMAGE DE DÉPART : end card complete
  ÉTAPES : 4.30 the button rises x1.1 blurred 6 px and settles ; 4.70 a cursor arrives in ONE curved move (0.45 s power3.out) and clicks directly: press (scale .85, 0.06 s), yellow ripple ring ; 4.80 notification sound ; 5.00 the button fills with the accent ; 5.50 the tower windows twinkle in sequence ; 6.20 the yellow line traces the tower's curve once more in the aerial (the rhyme, 1.0 s) ; 7.00 slow drift continues ; 7.70 black
  PISTE CAMÉRA : drift 3 %/s then 6.20 à 7.70 slow push 4 %/s ; no stops
  COUCHES ET PROFONDEUR : blurred aerial foreground ; sharp end card ; twinkling windows as the living layer
  OBJET-PONT ET VECTEUR : the final black
  SON : notification at 4.80 (0.7), click at 4.72 (0.4)
  IMAGE CLÉ : 5.00 : the end card with the button pressed in yellow and the ripple expanding
