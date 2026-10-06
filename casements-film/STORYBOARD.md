---
format: 1080x1920
duration: "53.3s"
message: "Casements Africa: aluminium, glass, steel and wood, twelve product lines, one factory in Kampala, built to last and delivered as promised."
arc: Hook → Heritage → Products → Factory → Process → Promise → Contact → CTA
audience: "Developers, architects, homeowners and facility managers in Uganda looking for doors, windows, glass, steel and interior finishes"
mode: autonomous
captions: disabled
music: "none (voice and sound effects only), mix in assets/audio/mix.wav mounted at root by the orchestrator"
direction: "A « Twelve Frames » (portrait 9:16): green window-frame panes on a light steel ground, the camera descends a wall of panes"
styleframes: "styleframes/A1.png (1.5 s), styleframes/A2.png (11 s), styleframes/A3.png (49 s)"
patterns: ../patterns/STORYBOARD-CRAFT.md, ../patterns/PATTERNS.md
---

## Video direction

- **One world** (frame.md): a tall wall of panes on a light steel ground in 1080x1920, travelled by one camera that only descends (never a back-and-forth). Every product line is one pane: a green frame that draws, a close-up product photo, a green label bar with a yellow period. All 14 frames are in the light world; each frame paints its own full-bleed ground as a `class="clip"` layer.
- **Invisible seams**: every frame enters with `cut`; each seam falls at the top of the blur of a camera descent and the `handoff_out` of frame N is copied word for word into the `handoff_in` of frame N+1. No hard cut in this film (all hand-overs go through the mullion line); the final cut to the ground at 53.3 s ends the film.
- **Text** (readable without sound): every sentence of the voice is a `subtitle` in the portrait band (y 1330 to 1520, up to 2 lines, nothing else in it) that arrives WORD BY WORD on the timestamps given in each frame (`word@seconds`, frame-local). Exactly ONE word per sentence sits in the `key-word-box`. Typographic moments (the words are the image): the four material labels (0 to 2.43), « Built to last. Delivered as promised. » (33.73 to 36.75), « Casements. » (36.75 to 38.75).
- **Products, not clients**: only product photos, the factory and the logo appear. No client buildings, names or logos. Claims on screen are the approved ones: 60+ years, ISO certified, 500+ projects delivered, 100% genuine materials, since 1965.
- **Real content** (frame.md): contact « +256 752 700 700 », « Plot 86, 5th Street, Industrial Area, Kampala », « casements.co.ug », hours « Mon–Fri 8:00–5:30 · Sat 8:00–1:00 », the twelve product lines of the site.
- **Motion grammar**: two speeds, gestures of 1 to 6 images (expo.out) and linear drifts that never stop; every photo arrives x1.15 and blurred 14 px then settles; frames draw before their content; no frozen hold (every hold names its living layer); no effect transition.
- **Visible copy**: exactly the quoted copy of the Scene lines, nothing else.
- **Negative list**: slideshow, screensaver, doubled object, colored text instead of the box, abstract symbol, any hue other than green, yellow, black, white and the photos, any client building or name, any invented fact.

**MONDE**
- Acte 1 (0.00 à 2.43) : the wall top, four panes in a 2x2 grid ; stations pane centers (270,610) (780,610) (270,1240) (780,1240) ; fond pale steel with a green radial
- Acte 2 (2.43 à 25.52) : the wall column x 60 to 1020, panes 960 wide stacked with 60 px gutters, one product line per station, camera descending ; stations: heritage (540,700), doors (540,800), curtain wall (540,800), facade (540,860), glass/partitions/railings (540,1100), steel (540,1100), ceilings/hardware/blinds (540,1100), mini homes (540,800)
- Acte 3 (25.52 à 36.75) : the twelve-pane grid, the factory, the four process panes, the promise ; fond pale steel
- Acte 4 (36.75 à 53.30) : the logo plate, address card, contact card, website button, end hold ; fond pale steel
- Couleurs de rôle : accent (yellow) = the key word of each sentence and the periods of the labels ; green = the frames and the label bars ; black = the nodes and the text

**SIGNATURES**
- Mécanisme 1 « Le cadre » (the frame draws): 0.00, 0.15, 0.30, 0.45, 2.48, 4.49, 5.20, 5.99, 7.04, 9.71, 13.63, 14.77, 15.83, 16.67, 17.80, 18.60, 19.66, 20.85, 22.02, 23.01, 25.52, 29.34, 36.75, 46.43 (24 times, one per pane)
- Mécanisme 2 « Le meneau » (the mullion bridge): 6.64, 9.20, 12.90, 15.90, 18.70, 22.60, 25.10, 33.30, 36.40, 40.60, 46.00 (the line that leaves one pane is the edge of the next)
- Registres de texte : subtitle word by word (blur 6 px → 0, 0.14 s) ; key-word box (scaleX from the left, 0.16 s) ; label bar (slides up 20 px, 0.15 s) ; display words (x1.5 blur 18 px → sharp, 0.2 s)
- Rimes : the four frames that draw the hook (0.00 to 0.45) are redrawn as the page-wide frame sweep of the end card (49.30), and the logo mark that grows at 33.2 returns above the contact card

**PARTITION CAMÉRA** (global times) : 0.00 drift down 2 %/s · 2.00 descent toward cam(0.50,0.40) · 4.60 descent to the doors pane · 8.70 push into the opened leaf · 9.71 settle on the curtain wall · 11.00 move down to the facade · 12.50 tilt up the towers · 13.40 descent to the glass strips · 14.00 to 15.00 one move per word · 16.40 descent to the steel pane · 19.40 descent to the ceilings pane · 22.80 descent to the mini home · 25.40 pull back to the twelve grid · 28.00 push into the factory · 29.34 settle on the process pane · 33.40 ascent to the logo · 36.40 ascent to the plate · 40.60 ascent to the contact card · 45.60 push toward the card · 47.00 push · 49.00 to 53.30 slow push, no stop

**VOIX** : timings in onsets.json ; silences over 0.4 s, each written as a shot with its silent action : 0.00 à 2.46 (the silent hook: four panes draw in) · 49.56 à 53.30 (the end hold: sweep and drift)

**COUPES** (quota of the voice) : none (0 hard cuts: every seam is a mullion hand-over)

**RYTHME** : hook (0 to 2.4 s): 8 events / 2.4 s ; products (2.4 to 25.5 s): 7 shots / 10 s ; factory and process (25.5 to 33.7 s): 6 shots / 10 s ; contact (36.8 to 53.3 s): 3 shots / 10 s

**SON** (global times, on the gestures) : click-soft 0.00, 0.15, 0.30, 0.45 · pop 0.30, 0.75, 1.20, 1.65 · whoosh-short 2.46 · ping 2.96 · click-soft 4.49, 5.20, 5.99 · whoosh-short 6.64 · pop 7.04 · whoosh-short 8.68 · whoosh-short 10.01 · ping 11.18 · whoosh-short 12.80 · pop 13.88, 14.77, 15.83 · pop 16.85, 17.78, 18.58 · pop 19.85, 20.85, 22.02 · pop 23.20 · ping 24.91 · pop 25.76 · ping 26.00 · whoosh-short 28.00 · click-soft 29.58, 30.96, 31.85, 32.70 · pop 30.17, 31.46, 32.31, 33.39 · pop 33.93, 35.17 · pop 36.97 · key-press 38.75, 39.15, 40.38 · click 41.38 to 45.88 on each digit group · notification 49.30 · sparkle 49.60


## Frame 1: Four materials · 0.00 → 2.43

- scene: the four panes: Aluminium, Glass, Steel, Wood
- duration: 2.43s
- transition_in: cut
- status: animated
- src: compositions/frames/01-hook.html
- voiceover: ""
- type: hook
- blueprint: grid-card-assemble (Adapt)
- focal: the four panes: Aluminium, Glass, Steel, Wood
- rules: svg-path-draw, waterfall-entry
- world: light
- handoff_in: aucun (ouverture du film) ; première image = the ground (pale steel) with the four empty pane frames just starting to draw at their positions (2x2 grid, 450x560, x 60 and 570, y 330 and 960), nothing else on screen, the camera at cam(0.50, 0.28, 1.0)
- handoff_out: à 2.43 : cam(0.50, 0.28, 1.0, rx 0, rz 0) the wall top: four panes in a 2x2 grid (450x560 each, x 60 and 570, y 330 and 960, 22 px green frames drawn, photos sharp, labels « Aluminium. » « Glass. » « Steel. » « Wood. » settled with their yellow periods), one black node at the center crossing, the whole grid drifting up at 2 %/s with blur 6 px as the camera starts to descend; micro tag « SINCE 1965 · KAMPALA » at the top; no subtitle; grain 3%

Word cues: 

Scene 1 (0.00 à 2.43 s) : P1, four materials in silence
  TEXTE ÉCRAN : display « Aluminium. Glass. Steel. Wood. » as four pane labels, no subtitle (silent hook), no box ; écart aucun
  IMAGE DE DÉPART : handoff_in.
  ÉTAPES : 0.00 the four frames draw (0.3 s each, 0.15 s apart) ; 0.30 the aluminium photo arrives in pane 1 (x1.15, blur 14 px to sharp, 0.2 s), label « Aluminium. » slides up ; 0.75 glass pane, label « Glass. » ; 1.20 steel pane, « Steel. » ; 1.65 wood pane, « Wood. » ; 1.90 the black node appears at the center crossing and the micro tag « SINCE 1965 · KAMPALA » types in ; 2.15 the camera begins its descent
  PISTE CAMÉRA : slow drift down 2 %/s from 0.00 ; 2.00 à 2.43 start of the descent toward cam(0.50, 0.40, 1.0) expo.in, blur 6 px at the top
  COUCHES ET PROFONDEUR : pale ground with a green radial ; sharp panes ; the node and frames are the animated layer
  OBJET-PONT ET VECTEUR : the center node → the first black node of the wall in the next shot
  SON : click-soft at 0.00, 0.15, 0.30, 0.45 (0.4 each, one per frame) ; pop at 0.30, 0.75, 1.20, 1.65 (0.3)
  IMAGE CLÉ : 1.65 : the 2x2 grid complete with all four labels and yellow periods


## Frame 2: Sixty years · 2.43 → 7.04

- scene: the 60+ counter and the doors, windows and skylights panes
- duration: 4.61s
- transition_in: cut
- status: animated
- src: compositions/frames/02-sixty-years.html
- voiceover: "sixty years of building Uganda's doors windows and skylines"
- type: solution
- blueprint: camera-journey (Adapt)
- focal: the 60+ counter and the doors, windows and skylights panes
- rules: counting-dynamic-scale, svg-path-draw
- world: light
- handoff_in: à 0.00 : cam(0.50, 0.28, 1.0, rx 0, rz 0) the wall top: four panes in a 2x2 grid (450x560 each, x 60 and 570, y 330 and 960, 22 px green frames drawn, photos sharp, labels « Aluminium. » « Glass. » « Steel. » « Wood. » settled with their yellow periods), one black node at the center crossing, the whole grid drifting up at 2 %/s with blur 6 px as the camera starts to descend; micro tag « SINCE 1965 · KAMPALA » at the top; no subtitle; grain 3%
- handoff_out: à 4.61 : cam(0.50, 0.62, 1.0, rx 0, rz 0) the camera is in a downward move at about 90 %/s with blur 12 px; the skylights pane (960x420, x 60) is leaving through the top edge; the doors and windows pane-large (960x1000, green frame already drawn, sliding-door photo) enters from the bottom with its top at y 1380, x1.1, blurred 12 px; the green mullion line (22 px, black node) joins them at screen y 1350; the 60+ counter has left; no subtitle; grain 3%

Word cues: sixty@0.03 years@0.51 of@0.97 building@1.06 Uganda's@1.44 doors@2.06 windows@2.77 and@3.42 skylines@3.56

Scene 1 (0.00 à 2.60 s) : P2, sixty years of building
  TEXTE ÉCRAN : subtitle « sixty years of building » word by word from 0.03, [boîte : sixty] at 0.03 ; counter « 60+ » (numeral 96 px) rolling 0 to 60 ; écart avance 0.1 s
  IMAGE DE DÉPART : handoff_in.
  ÉTAPES : 0.03 the four panes slide up and out (0.2 s expo.in, x0.8 blur) ; 0.05 the green frame of a pane-large draws and the « 60+ » counter rolls over its photo (the factory photo, about-factory) 0 to 60 in 0.9 s with the micro label « YEARS OF EXPERIENCE » ; 0.50 the box on « sixty » ; 1.00 the counter settles and a thin yellow line draws under it ; 1.45 « SINCE 1965 » tag ; 2.00 the pane-large lifts out the top
  PISTE CAMÉRA : drift down 4 %/s ; 2.00 à 2.60 move toward cam(0.50, 0.52, 1.0) expo.inOut
  COUCHES ET PROFONDEUR : blurred pane edge foreground ; sharp photo and counter ; ground
  OBJET-PONT ET VECTEUR : the pane-large lifting out → the Uganda's doors pane arrives below it (vector: up, 0.5 s expo.in)
  SON : whoosh-short at 0.03 (0.4), pop at 0.05 (0.3), ping at 0.50 (0.4)
  IMAGE CLÉ : 0.50 : the factory pane with the counter at 18 and the box on sixty

Scene 2 (2.60 à 4.61 s) : P3, Uganda's doors, windows and skylines
  TEXTE ÉCRAN : subtitle « Uganda's doors, windows and skylines » word by word from 1.44 (doors 2.06, windows 2.77, skylines 3.56), [boîte : skylines] at 3.56 ; labels « Doors. » « Windows. » « Skylights. » ; écart avance 0.1 s
  IMAGE DE DÉPART : the counter pane leaving through the top
  ÉTAPES : 2.60 the pane « Doors. » (bifold door photo, pane-half 450x560) draws at the left on « doors » (2.06) ; 2.70 pane « Windows. » (top-hung window photo) draws at the right on « windows » (2.77) ; 3.40 the strip pane « Skylights. » (glass skylight photo, 960x420) draws below on « skylines » (3.56) with the box ; 3.90 the three panes settle ; 4.20 the strip pane's bottom frame line extends downward as the mullion bridge
  PISTE CAMÉRA : drift down 5 %/s ; 4.20 à 4.61 descent toward cam(0.50, 0.62, 1.0) expo.in, blur 12 px at the end
  COUCHES ET PROFONDEUR : blurred pane edges foreground ; sharp panes ; the mullion line is the animated layer
  OBJET-PONT ET VECTEUR : the skylights pane's bottom line → the top edge of the doors-and-windows pane-large (vector: down, 0.4 s expo.in)
  SON : click-soft at 2.06, 2.77, 3.56 (0.4), whoosh-short at 4.20 (0.4)
  IMAGE CLÉ : 3.56 : doors and windows panes above, the skylights strip arriving, the box on skylines


## Frame 3: Doors and windows · 7.04 → 9.71

- scene: the aluminium pane-large and its leaf opening
- duration: 2.67s
- transition_in: cut
- status: animated
- src: compositions/frames/03-doors-windows.html
- voiceover: "doors and windows that open the way"
- type: benefit
- blueprint: camera-journey (Adapt)
- focal: the aluminium pane-large and its leaf opening
- rules: coordinate-target-zoom, svg-path-draw
- world: light
- handoff_in: à 0.00 : cam(0.50, 0.62, 1.0, rx 0, rz 0) the camera is in a downward move at about 90 %/s with blur 12 px; the skylights pane (960x420, x 60) is leaving through the top edge; the doors and windows pane-large (960x1000, green frame already drawn, sliding-door photo) enters from the bottom with its top at y 1380, x1.1, blurred 12 px; the green mullion line (22 px, black node) joins them at screen y 1350; the 60+ counter has left; no subtitle; grain 3%
- handoff_out: à 2.67 : cam(0.50, 0.70, 1.0, rx 0, rz 0) the camera is in a downward move at about 90 %/s with blur 12 px; the aluminium pane-large (its leaf open 70 degrees, the curtain wall photo already visible through the opening) fills the screen at x1.3 and blurred 12 px; its label bar has left; the opening is the next pane; no subtitle; grain 3%

Word cues: doors@0.25 and@0.65 windows@0.79 that@1.36 open@1.64 the@1.89 way@2.01

Scene 1 (0.00 à 2.67 s) : P4, doors and windows that open the way
  TEXTE ÉCRAN : subtitle « doors and windows that open the way » word by word from 0.25 (open 1.64, the 2.0, way 2.0), [boîte : open] at 1.64 ; label « Aluminium doors & windows. » ; écart avance 0.1 s
  IMAGE DE DÉPART : handoff_in.
  ÉTAPES : 0.00 the pane-large settles (0.3 s expo.out), sliding-door photo sharp ; 0.25 subtitle starts ; 0.45 label bar « Aluminium doors & windows. » ; 0.90 four small chips slide in under the label: « Bi-fold » « Sliding » « Pivot » « Revolving » (0.1 s apart) ; 1.64 box on « open » and the right leaf of the frame swings open 70 degrees in 0.5 s (rotation about its hinge, the next pane's photo, the curtain wall, visible through the opening) ; 2.30 the opening grows to fill the screen
  PISTE CAMÉRA : slow push 4 %/s ; 1.64 à 2.67 push into the opening toward cam(0.50, 0.70, 1.3) expo.in, blur 12 px at the end
  COUCHES ET PROFONDEUR : blurred green frame foreground ; sharp pane ; the curtain wall photo behind the leaf
  OBJET-PONT ET VECTEUR : the opening leaf → the curtain wall pane (vector: into the opening, 0.8 s expo.in)
  SON : pop at 0.00 (0.3), click at 0.90, 1.00, 1.10, 1.20 (0.3), whoosh-short at 1.64 (0.5)
  IMAGE CLÉ : 1.64 : the pane with its leaf opening and the box on open


## Frame 4: Curtain wall and facade · 9.71 → 13.63

- scene: the curtain wall pane then the facade pane, tilting up the towers
- duration: 3.92s
- transition_in: cut
- status: animated
- src: compositions/frames/04-curtain-wall-facade.html
- voiceover: "curtain walls and facades that dress the tallest towers"
- type: benefit
- blueprint: camera-journey (Adapt)
- focal: the curtain wall pane then the facade pane, tilting up the towers
- rules: depth-of-field-blur, svg-path-draw
- world: light
- handoff_in: à 0.00 : cam(0.50, 0.70, 1.0, rx 0, rz 0) the camera is in a downward move at about 90 %/s with blur 12 px; the aluminium pane-large (its leaf open 70 degrees, the curtain wall photo already visible through the opening) fills the screen at x1.3 and blurred 12 px; its label bar has left; the opening is the next pane; no subtitle; grain 3%
- handoff_out: à 3.92 : cam(0.50, 0.84, 1.0, rx 0, rz 0) the camera is in a downward move at about 90 %/s with blur 12 px; the facade pane-large (sun-shading photo) is leaving through the top; three panes of the glass line (pane-strip 960x420 each, green frames drawn, glass photo in the first) enter from the bottom, the first with its top at y 1400, blurred 12 px; the green mullion line at screen y 1340; no subtitle; grain 3%

Word cues: curtain@0.30 walls@0.60 and@1.07 facades@1.17 that@1.86 dress@2.02 the@2.38 tallest@2.49 towers@3.10

Scene 1 (0.00 à 1.84 s) : P5, curtain walls and facades
  TEXTE ÉCRAN : subtitle « curtain walls and facades » word by word from 0.30 (facades 1.17), [boîte : facades] at 1.17 ; label « Curtain wall. » then « Facade. » ; écart avance 0.1 s
  IMAGE DE DÉPART : handoff_in.
  ÉTAPES : 0.00 the opening completes into the curtain wall pane-large (modern high-rise glass photo) ; 0.30 subtitle starts ; 0.40 label bar « Curtain wall. » ; 0.80 chips « Unitized » « Semi-unitized » « Stick » ; 1.17 box on « facades » and the pane's lower frame line extends into a second pane-large (aluminium fins photo) drawing below ; 1.50 label « Facade. »
  PISTE CAMÉRA : descent 6 %/s ; 1.30 à 1.84 move down toward cam(0.50, 0.76, 1.0) expo.inOut
  COUCHES ET PROFONDEUR : blurred frame foreground ; sharp pane ; second pane arriving
  OBJET-PONT ET VECTEUR : the lower frame line → the top edge of the facade pane (vector: down, 0.4 s expo.out)
  SON : pop at 0.00 (0.3), click at 0.80, 0.90, 1.00, ping at 1.17 (0.4)
  IMAGE CLÉ : 1.17 : the curtain wall pane with the facade pane drawing under it, box on facades

Scene 2 (1.84 à 3.92 s) : P6, that dress the tallest towers
  TEXTE ÉCRAN : subtitle « that dress the tallest towers » word by word from 1.86 (towers 3.10), [boîte : towers] at 3.10 ; écart avance 0.1 s
  IMAGE DE DÉPART : the facade pane (aluminium fins) at the center, subtitle chunk 1 leaving
  ÉTAPES : 1.86 subtitle starts ; 2.00 the fins photo slides up inside its frame (parallax 60 px) ; 2.30 the sun shading photo replaces it as a second layer sliding in from the bottom ; 2.70 the camera starts tilting up along the photo (the tallest towers) ; 3.10 box on « towers » ; 3.40 the pane lifts out through the top ; 3.60 the glass pane enters from the bottom
  PISTE CAMÉRA : tilt up 8 %/s then 3.40 à 3.92 descent to cam(0.50, 0.84, 1.0) expo.in, blur 12 px
  COUCHES ET PROFONDEUR : blurred frame foreground ; sharp facade photos ; parallax of two photo layers
  OBJET-PONT ET VECTEUR : the facade pane → the glass strip pane entering (vector: down, 0.5 s expo.in)
  SON : whoosh-short at 3.40 (0.4), ping at 3.10 (0.4)
  IMAGE CLÉ : 3.10 : the facade pane with two photo layers and the box on towers


## Frame 5: Glass, partitions, railings · 13.63 → 16.67

- scene: three panes, one per word
- duration: 3.04s
- transition_in: cut
- status: animated
- src: compositions/frames/05-glass-partitions-railings.html
- voiceover: "glass partitions railings"
- type: benefit
- blueprint: grid-card-assemble (Adapt)
- focal: three panes, one per word
- rules: waterfall-entry, svg-path-draw
- world: light
- handoff_in: à 0.00 : cam(0.50, 0.84, 1.0, rx 0, rz 0) the camera is in a downward move at about 90 %/s with blur 12 px; the facade pane-large (sun-shading photo) is leaving through the top; three panes of the glass line (pane-strip 960x420 each, green frames drawn, glass photo in the first) enter from the bottom, the first with its top at y 1400, blurred 12 px; the green mullion line at screen y 1340; no subtitle; grain 3%
- handoff_out: à 3.04 : cam(0.50, 0.90, 1.0, rx 0, rz 0) the camera is in a downward move at about 90 %/s with blur 12 px; the railings pane (staircase photo) is leaving through the top; the steel gates pane-large enters from the bottom with its top at y 1420, x1.1, blurred 12 px; the green mullion line at screen y 1360; no subtitle; grain 3%

Word cues: glass@0.25 partitions@1.14 railings@2.20

Scene 1 (0.00 à 3.04 s) : P7, glass, partitions, railings
  TEXTE ÉCRAN : subtitle « glass » then « partitions » then « railings » each alone on its cue, [boîte : glass] at 0.25, [boîte : partitions] at 1.14, [boîte : railings] at 2.20 ; labels « Glass. » « Partitions. » « Railings. » ; écart avance 0.1 s
  IMAGE DE DÉPART : handoff_in.
  ÉTAPES : 0.00 the glass strip pane (laminated glass photo) settles ; 0.25 box on « glass », label « Glass. » ; 1.14 box on « partitions » and the second strip pane (frameless glass partition photo) draws below, label « Partitions. » ; 2.20 box on « railings » and the third strip pane (glass staircase photo) draws, label « Railings. » ; 2.70 the third pane's bottom frame line extends down as the bridge
  PISTE CAMÉRA : descent 5 %/s with a move at each word (0.9 à 1.30 and 2.0 à 2.4, expo.inOut) ; 2.70 à 3.04 descent toward cam(0.50, 0.90, 1.0)
  COUCHES ET PROFONDEUR : blurred frame foreground ; sharp panes ; neighbours blurred 2 px
  OBJET-PONT ET VECTEUR : each pane's bottom line → the next pane's top edge (vector: down, 0.4 s expo.out)
  SON : pop at 0.25, 1.14, 2.20 (0.3), click at 1.14, 2.20 (0.3)
  IMAGE CLÉ : 1.14 : three panes stacked, the partitions pane in focus


## Frame 6: Steel · 16.67 → 19.66

- scene: gates, grills and roller shutters panes
- duration: 2.99s
- transition_in: cut
- status: animated
- src: compositions/frames/06-steel.html
- voiceover: "steel gates grills and roller shutters"
- type: benefit
- blueprint: grid-card-assemble (Adapt)
- focal: gates, grills and roller shutters panes
- rules: waterfall-entry, svg-path-draw
- world: light
- handoff_in: à 0.00 : cam(0.50, 0.90, 1.0, rx 0, rz 0) the camera is in a downward move at about 90 %/s with blur 12 px; the railings pane (staircase photo) is leaving through the top; the steel gates pane-large enters from the bottom with its top at y 1420, x1.1, blurred 12 px; the green mullion line at screen y 1360; no subtitle; grain 3%
- handoff_out: à 2.99 : cam(0.50, 0.95, 1.0, rx 0, rz 0) the camera is in a downward move at about 90 %/s with blur 12 px; the roller shutters pane is leaving through the top; the ceilings pane (coffered ceiling photo) enters from the bottom with its top at y 1440, x1.1, blurred 12 px; the green mullion line at screen y 1370; no subtitle; grain 3%

Word cues: steel@0.18 gates@0.59 grills@1.11 and@1.78 roller@1.91 shutters@2.25

Scene 1 (0.00 à 2.99 s) : P8, steel gates, grills and roller shutters
  TEXTE ÉCRAN : subtitle « steel gates, grills and roller shutters » word by word from 0.18 (grills 1.11, roller 1.91, shutters 2.25), [boîte : grills] at 1.11 ; labels « Steel gates. » « Grills. » « Shutters. » ; écart avance 0.1 s
  IMAGE DE DÉPART : handoff_in.
  ÉTAPES : 0.00 the steel gates pane-large settles (ornamental gate photo) ; 0.18 subtitle starts ; 0.30 label « Steel gates. » ; 0.95 the sliding grille pane (stainless sliding grille photo, strip) draws on « grills » with the box ; 1.50 label « Grills. » ; 1.91 the roller shutter pane (white roller shutters photo, strip) draws on « roller » ; 2.25 « shutters » label « Shutters. » ; 2.70 bottom frame line extends down
  PISTE CAMÉRA : descent 5 %/s ; moves at 0.8 à 1.2 and 1.7 à 2.1 expo.inOut ; 2.70 à 2.99 toward cam(0.50, 0.95, 1.0)
  COUCHES ET PROFONDEUR : blurred frame foreground ; sharp panes
  OBJET-PONT ET VECTEUR : bottom line → next top edge (vector: down, 0.3 s expo.out)
  SON : pop at 0.00, 0.95, 1.91 (0.3), click at 0.95, 1.91 (0.3)
  IMAGE CLÉ : 1.11 : gates and grille panes with the box on grills


## Frame 7: Ceilings, hardware, blinds · 19.66 → 23.01

- scene: three panes, one per word
- duration: 3.35s
- transition_in: cut
- status: animated
- src: compositions/frames/07-ceilings-hardware-blinds.html
- voiceover: "ceilings door hardware roller blinds"
- type: benefit
- blueprint: grid-card-assemble (Adapt)
- focal: three panes, one per word
- rules: waterfall-entry, svg-path-draw
- world: light
- handoff_in: à 0.00 : cam(0.50, 0.95, 1.0, rx 0, rz 0) the camera is in a downward move at about 90 %/s with blur 12 px; the roller shutters pane is leaving through the top; the ceilings pane (coffered ceiling photo) enters from the bottom with its top at y 1440, x1.1, blurred 12 px; the green mullion line at screen y 1370; no subtitle; grain 3%
- handoff_out: à 3.35 : cam(0.50, 0.97, 1.0, rx 0, rz 0) the camera is in a downward move at about 90 %/s with blur 12 px; the roller blinds pane (zebra blind photo) is leaving through the top; the mini home pane-large (circular uniport photo, green frame drawn) enters from the bottom with its top at y 1450, x1.1, blurred 12 px; the green mullion line at screen y 1380; no subtitle; grain 3%

Word cues: ceilings@0.19 door@1.19 hardware@1.46 roller@2.36 blinds@2.64

Scene 1 (0.00 à 3.35 s) : P9, ceilings, door hardware, roller blinds
  TEXTE ÉCRAN : subtitle « ceilings » then « door hardware » then « roller blinds », [boîte : ceilings] at 0.19, [boîte : hardware] at 1.46, [boîte : blinds] at 2.64 ; labels « Ceilings. » « Door hardware. » « Roller blinds. » ; écart avance 0.1 s
  IMAGE DE DÉPART : handoff_in.
  ÉTAPES : 0.00 the ceilings pane (coffered ceiling photo) settles ; 0.19 box on « ceilings » label « Ceilings. » ; 1.19 the door hardware pane (handles board photo) draws, 1.46 box on « hardware » label « Door hardware. » ; 2.36 the roller blinds pane (zebra blind photo) draws, 2.64 box on « blinds » label « Roller blinds. » ; 3.10 bottom frame line extends down
  PISTE CAMÉRA : descent 5 %/s with a move per word ; 3.10 à 3.35 toward cam(0.50, 0.97, 1.0)
  COUCHES ET PROFONDEUR : blurred frame foreground ; sharp panes
  OBJET-PONT ET VECTEUR : bottom line → next top edge (vector: down, 0.3 s expo.out)
  SON : pop at 0.19, 1.46, 2.64 (0.3), click at 1.19, 2.36 (0.3)
  IMAGE CLÉ : 1.46 : ceilings above, the hardware pane in focus


## Frame 8: Mini homes · 23.01 → 25.52

- scene: the mini home pane and the one-hour ring
- duration: 2.51s
- transition_in: cut
- status: animated
- src: compositions/frames/08-mini-homes.html
- voiceover: "even mini homes that go up in an hour"
- type: benefit
- blueprint: camera-journey (Adapt)
- focal: the mini home pane and the one-hour ring
- rules: stat-bars-and-fills, svg-path-draw
- world: light
- handoff_in: à 0.00 : cam(0.50, 0.97, 1.0, rx 0, rz 0) the camera is in a downward move at about 90 %/s with blur 12 px; the roller blinds pane (zebra blind photo) is leaving through the top; the mini home pane-large (circular uniport photo, green frame drawn) enters from the bottom with its top at y 1450, x1.1, blurred 12 px; the green mullion line at screen y 1380; no subtitle; grain 3%
- handoff_out: à 2.51 : cam(0.50, 0.50, 1.0, rx 0, rz 0) the mini home pane has shrunk to the first cell (top-left) of a 3x4 grid of twelve panes (each 300x360 with its frame drawn, grid x 60 to 1020, y 330 to 1650), the other eleven cells still empty green frames drawing; blur 8 px from a camera still pulling back; the one-hour ring has gone; no subtitle; grain 3%

Word cues: even@0.19 mini@0.44 homes@0.76 that@1.20 go@1.34 up@1.57 in@1.70 an@1.80 hour@1.90

Scene 1 (0.00 à 2.51 s) : P10, even mini homes that go up in an hour
  TEXTE ÉCRAN : subtitle « even mini homes that go up in an hour » word by word from 0.19 (mini 0.44, homes 0.76, hour 1.90), [boîte : hour] at 1.90 ; label « Mini homes. » ; counter « 1 hour » ; écart avance 0.1 s
  IMAGE DE DÉPART : handoff_in.
  ÉTAPES : 0.00 the mini home pane-large settles (circular uniport photo) ; 0.19 subtitle starts ; 0.40 label « Mini homes. » ; 1.00 a thin yellow ring (the hour) draws around a clock icon at the pane's corner ; 1.90 box on « hour » and the ring fills 0 to 100% in 0.6 s (stat-bars-and-fills) with the numeral « 1 hour » rolling ; 2.20 the pane shrinks toward the top-left cell of the next grid
  PISTE CAMÉRA : slow push 4 %/s ; 2.10 à 2.51 pull-back toward cam(0.50, 0.50, 1.0) expo.inOut, blur 8 px
  COUCHES ET PROFONDEUR : blurred frame foreground ; sharp pane ; the ring is the animated layer
  OBJET-PONT ET VECTEUR : the pane shrinking → the first cell of the twelve-pane grid (vector: toward the top-left, 0.4 s expo.in)
  SON : pop at 0.00, click at 1.00, ping at 1.90 (0.4)
  IMAGE CLÉ : 1.90 : the mini home pane with the ring filling and the box on hour


## Frame 9: Twelve lines, one factory · 25.52 → 29.34

- scene: twelve small panes assembling, then the factory photo
- duration: 3.82s
- transition_in: cut
- status: animated
- src: compositions/frames/09-twelve-factory.html
- voiceover: "twelve product lines one factory in kampala"
- type: benefit
- blueprint: constellation-hub (Adapt)
- focal: twelve small panes assembling, then the factory photo
- rules: counting-dynamic-scale, center-outward-expansion
- world: light
- handoff_in: à 0.00 : cam(0.50, 0.50, 1.0, rx 0, rz 0) the mini home pane has shrunk to the first cell (top-left) of a 3x4 grid of twelve panes (each 300x360 with its frame drawn, grid x 60 to 1020, y 330 to 1650), the other eleven cells still empty green frames drawing; blur 8 px from a camera still pulling back; the one-hour ring has gone; no subtitle; grain 3%
- handoff_out: à 3.82 : cam(0.50, 0.50, 1.15, rx 0, rz 0) the factory photo (about-factory-2) fills the frame at x1.15 blurred 10 px with a pale scrim; the twelve-pane grid has dissolved into its frame lines which converge to one pane-large outline (960x1000, 22 px green line, empty) at the center, drawing; the tag « KAMPALA » at the top left; no subtitle; grain 3%

Word cues: twelve@0.24 product@0.63 lines@1.03 one@1.82 factory@2.06 in@2.89 kampala@3.01

Scene 1 (0.00 à 2.50 s) : P11, twelve product lines
  TEXTE ÉCRAN : subtitle « twelve product lines » word by word from 0.24 (product 0.63, lines 1.03), [boîte : twelve] at 0.24 ; numeral « 12 » rolling ; écart avance 0.1 s
  IMAGE DE DÉPART : handoff_in.
  ÉTAPES : 0.00 the grid of twelve frames is on screen with cell 1 filled ; 0.24 box on « twelve » ; 0.30 to 1.60 the other eleven cells fill with their photos one every 0.1 s, in the order of the film (doors and windows, curtain wall, facade, glass, partitions, railings, steel, ceilings, hardware, blinds, mini homes) with a pop each ; 1.60 the numeral « 12 » rolls in at the center over a pale scrim ; 2.20 the grid frame lines draw outward
  PISTE CAMÉRA : slow push 3 %/s ; 2.10 à 2.50 pull toward cam(0.50, 0.50, 1.15)
  COUCHES ET PROFONDEUR : blurred foreground frame ; sharp grid ; the fill cascade is the animated layer
  OBJET-PONT ET VECTEUR : the grid frame lines → the single outline of the factory pane (vector: converging to the center, 0.5 s expo.in)
  SON : pop at 0.30 then every 0.1 s to 1.60 (0.2), ping at 0.24 (0.4)
  IMAGE CLÉ : 1.20 : the twelve-pane grid with eight cells filled

Scene 2 (2.50 à 3.82 s) : P12, one factory, in Kampala
  TEXTE ÉCRAN : subtitle « one factory in Kampala » word by word from 1.82 (factory 2.06, in 2.89, kampala 3.01), [boîte : Kampala] at 3.01 ; tag « KAMPALA » ; écart avance 0.1 s
  IMAGE DE DÉPART : the twelve-pane grid with all cells filled, the numeral 12 centered
  ÉTAPES : 2.50 the grid dissolves into its frame lines which converge to one pane-large outline ; 2.60 the factory photo (workers in green uniforms) arrives inside it x1.15 blurred to sharp ; 2.80 subtitle starts ; 3.01 box on « Kampala » and the tag « KAMPALA » types in ; 3.40 the outline draws a second line downward (the process starts)
  PISTE CAMÉRA : push 5 %/s ; 3.40 à 3.82 push toward cam(0.50, 0.50, 1.15) with blur 10 px
  COUCHES ET PROFONDEUR : blurred outline foreground ; sharp factory photo ; pale scrim
  OBJET-PONT ET VECTEUR : the pane-large outline → the first of the four process panes (vector: center, 0.3 s expo.out)
  SON : whoosh-short at 2.50 (0.4), pop at 2.60 (0.3), ping at 3.01 (0.4)
  IMAGE CLÉ : 3.01 : the factory pane with the tag KAMPALA and the box


## Frame 10: Share, draw, build, install · 29.34 → 33.73

- scene: one pane that becomes a drawing, a build and an installation
- duration: 4.39s
- transition_in: cut
- status: animated
- src: compositions/frames/10-process.html
- voiceover: "share your idea we draw it we build it we install it"
- type: demo
- blueprint: camera-journey (Adapt)
- focal: one pane that becomes a drawing, a build and an installation
- rules: svg-path-draw, depth-of-field-blur
- world: light
- handoff_in: à 0.00 : cam(0.50, 0.50, 1.15, rx 0, rz 0) the factory photo (about-factory-2) fills the frame at x1.15 blurred 10 px with a pale scrim; the twelve-pane grid has dissolved into its frame lines which converge to one pane-large outline (960x1000, 22 px green line, empty) at the center, drawing; the tag « KAMPALA » at the top left; no subtitle; grain 3%
- handoff_out: à 4.39 : cam(0.50, 0.50, 1.0, rx 0, rz 0) four numbered panes in a vertical column have just completed (1 idea, 2 drawing, 3 build, 4 installed); they scale down and slide up through the top edge at about 600 px/s with blur 12 px; the logo mark (green frames) grows from the center, 300 px wide; no subtitle; grain 3%

Word cues: share@0.24 your@0.54 idea@0.83 we@1.62 draw@1.76 it@2.12 we@2.51 build@2.63 it@2.97 we@3.36 install@3.50 it@4.05

Scene 1 (0.00 à 4.39 s) : P13, share your idea, we draw it, we build it, we install it
  TEXTE ÉCRAN : subtitle « share your idea » then « we draw it » then « we build it » then « we install it », [boîte : idea] at 0.83, [boîte : draw] at 1.76, [boîte : build] at 2.63, [boîte : install] at 3.50 ; numerals « 1 » « 2 » « 3 » « 4 » at the pane corner ; écart avance 0.1 s
  IMAGE DE DÉPART : handoff_in.
  ÉTAPES : 0.00 the outline pane is empty ; 0.24 numeral « 1 » rolls in and an idea sketch (a rough yellow window outline) draws on « share » ; 1.62 « 2 » and the sketch becomes a precise green drawing with dimension lines (« 1800 mm » ) on « draw » ; 2.50 « 3 » and the drawing fills with the aluminium profile photo (worker assembling a frame, hero-img8) on « build » ; 3.37 « 4 » and the frame appears installed in a wall (sliding-door photo) on « install » ; 4.00 the pane lifts out through the top
  PISTE CAMÉRA : slow drift down 3 %/s ; a gentle push (4 %/s) on each step ; 3.90 à 4.39 descent toward cam(0.50, 0.50, 1.0)
  COUCHES ET PROFONDEUR : blurred frame foreground ; sharp content ; the drawn lines are the animated layer
  OBJET-PONT ET VECTEUR : the installed frame → the logo mark growing from its frame lines (vector: up and out, 0.4 s expo.in)
  SON : click-soft at 0.24, 1.62, 2.50, 3.37 (0.4), pop at 0.83, 1.76, 2.63, 3.50 (0.3)
  IMAGE CLÉ : 2.63 : the drawing filling with the profile photo, numeral 3, box on build


## Frame 11: Built to last · 33.73 → 36.75

- scene: the promise and the four stat chips
- duration: 3.02s
- transition_in: cut
- status: animated
- src: compositions/frames/11-built-to-last.html
- voiceover: "built to last delivered as promised"
- type: benefit
- blueprint: kinetic-type-beats (Adapt)
- focal: the promise and the four stat chips
- rules: counting-dynamic-scale, kinetic-beat-slam
- world: light
- handoff_in: à 0.00 : cam(0.50, 0.50, 1.0, rx 0, rz 0) four numbered panes in a vertical column have just completed (1 idea, 2 drawing, 3 build, 4 installed); they scale down and slide up through the top edge at about 600 px/s with blur 12 px; the logo mark (green frames) grows from the center, 300 px wide; no subtitle; grain 3%
- handoff_out: à 3.02 : cam(0.50, 0.50, 1.0, rx 0, rz 0) the four stat chips (white, 3 px green border, numerals settled: 60+, ISO, 500+, 100%) are moving up out of the frame at about 500 px/s with blur 10 px; the logo plate (white, 14 px green border, 800 px wide) rises from the bottom edge, its top at y 1500, x1.1, blurred 10 px; no subtitle; grain 3%

Word cues: built@0.20 to@0.50 last@0.59 delivered@1.44 as@1.98 promised@2.21

Scene 1 (0.00 à 3.02 s) : P14, built to last, delivered as promised
  TEXTE ÉCRAN : display « Built to last. » at 0.20 then « Delivered as promised. » at 1.44 (typographic moments, no subtitle) ; four stat chips « 60+ Years of Experience » « ISO Certified » « 500+ Projects Delivered » « 100% Genuine Materials » ; écart synchro
  IMAGE DE DÉPART : handoff_in.
  ÉTAPES : 0.00 the logo mark (300 px) at the top center ; 0.20 « Built to last. » arrives x1.5 blurred 18 px and settles with the yellow period ; 0.60 chips 1 and 2 slide in (0.1 s apart) with the numerals rolling 0 to 60 and the label ISO ; 1.44 « Delivered as promised. » lands ; 1.80 chips 3 and 4 slide in, 500 rolling 0 to 500 and 100% rolling ; 2.60 everything starts moving up
  PISTE CAMÉRA : slow push 4 %/s ; 2.60 à 3.02 ascent toward cam(0.50, 0.50, 1.0) with blur 10 px
  COUCHES ET PROFONDEUR : blurred frame foreground ; sharp text and chips
  OBJET-PONT ET VECTEUR : the chips → leaving upward as the logo plate rises (vector: up, 0.4 s expo.in)
  SON : pop at 0.20, 1.44 (0.4), click at 0.60, 1.80 (0.3), whoosh-short at 2.60 (0.4)
  IMAGE CLÉ : 1.44 : the two promise lines and the four chips


## Frame 12: Casements and the address · 36.75 → 40.92

- scene: the logo plate and the address card
- duration: 4.17s
- transition_in: cut
- status: animated
- src: compositions/frames/12-address.html
- voiceover: "casements plot eighty six fifth street industrial area"
- type: cta
- blueprint: logo-assemble-lockup (Adapt)
- focal: the logo plate and the address card
- rules: svg-path-draw, center-outward-expansion
- world: light
- handoff_in: à 0.00 : cam(0.50, 0.50, 1.0, rx 0, rz 0) the four stat chips (white, 3 px green border, numerals settled: 60+, ISO, 500+, 100%) are moving up out of the frame at about 500 px/s with blur 10 px; the logo plate (white, 14 px green border, 800 px wide) rises from the bottom edge, its top at y 1500, x1.1, blurred 10 px; no subtitle; grain 3%
- handoff_out: à 4.17 : cam(0.50, 0.50, 1.0, rx 0, rz 0) the logo plate has settled at the top (y 220 to 900) and the address card (white, green border, 960 px wide) is complete below it; the logo plate and the address card start to slide up at about 300 px/s with blur 6 px as the contact card rises from the bottom edge, its top at y 1450, blurred 10 px; no subtitle; grain 3%

Word cues: casements@0.22 plot@1.19 eighty@1.46 six@1.70 fifth@2.40 street@2.54 industrial@2.99 area@3.63

Scene 1 (0.00 à 2.00 s) : P15, Casements
  TEXTE ÉCRAN : display « Casements. » (display 120 px) at 0.22 over the logo plate ; écart synchro
  IMAGE DE DÉPART : handoff_in.
  ÉTAPES : 0.00 the logo plate (800 px, white, green border) settles at the top (y 220) ; 0.22 the plate's frame lines draw a second time (a pulse) and « Casements. » types under it ; 0.80 the micro tag « ALUMINIUM · GLASS · STEEL · WOOD » slides in ; 1.30 the address card's frame draws below the plate
  PISTE CAMÉRA : slow push 4 %/s
  COUCHES ET PROFONDEUR : blurred frame foreground ; sharp plate
  OBJET-PONT ET VECTEUR : the plate's frame lines → the address card's frame (vector: down, 0.3 s expo.out)
  SON : pop at 0.00 (0.3), click-soft at 0.22 (0.4)
  IMAGE CLÉ : 0.22 : the logo plate with the word Casements and its yellow period

Scene 2 (2.00 à 4.17 s) : P16, plot eighty-six, Fifth Street, Industrial Area
  TEXTE ÉCRAN : subtitle « plot eighty-six, fifth street, industrial area » word by word from 1.19 (plot 1.19, fifth 2.40, area 3.63), [boîte : eighty-six] at 1.70, [boîte : area] at 3.63 ; address card lines « Plot 86 » « 5th Street » « Industrial Area, Kampala » ; écart avance 0.1 s
  IMAGE DE DÉPART : the plate and the address card frame drawn
  ÉTAPES : 2.00 the address card fills (white, green border) and « Plot 86 » rolls in on « eighty-six » ; 2.45 « 5th Street » types in on « fifth street » ; 3.50 « Industrial Area, Kampala » types in on « area » ; 3.90 the plate and the card start to slide up
  PISTE CAMÉRA : push 3 %/s ; 3.90 à 4.17 ascent with blur 6 px
  COUCHES ET PROFONDEUR : blurred frame foreground ; sharp card
  OBJET-PONT ET VECTEUR : the card → sliding up as the contact card rises (vector: up, 0.3 s expo.in)
  SON : key-press at 2.00, 2.45, 3.50 (0.3), ping at 1.70, 3.63 (0.4)
  IMAGE CLÉ : 3.50 : the plate above and the address card with three lines


## Frame 13: Call · 40.92 → 46.43

- scene: the contact card and the number rolling in
- duration: 5.51s
- transition_in: cut
- status: animated
- src: compositions/frames/13-call.html
- voiceover: "call plus two five six seven five two seven zero zero seven zero zero"
- type: cta
- blueprint: dataviz-countup (Adapt)
- focal: the contact card and the number rolling in
- rules: counting-dynamic-scale, stat-bars-and-fills
- world: light
- handoff_in: à 0.00 : cam(0.50, 0.50, 1.0, rx 0, rz 0) the logo plate has settled at the top (y 220 to 900) and the address card (white, green border, 960 px wide) is complete below it; the logo plate and the address card start to slide up at about 300 px/s with blur 6 px as the contact card rises from the bottom edge, its top at y 1450, blurred 10 px; no subtitle; grain 3%
- handoff_out: à 5.51 : cam(0.50, 0.50, 1.0, rx 0, rz 0) the contact card (960 px wide, white, green border) is centered with « +256 752 700 700 » fully rolled in (« +256 752 » in the yellow box), micro labels CALL, OPEN visible, slow push-in 3 %/s, blur 4 px; the logo mark sits above it at 40% opacity; no subtitle; grain 3%

Word cues: call@0.20 plus@0.46 two@0.86 five@1.05 six@1.30 seven@1.93 five@2.25 two@2.56 seven@3.07 zero@3.47 zero@3.75 seven@4.27 zero@4.68 zero@4.96

Scene 1 (0.00 à 2.59 s) : P17, call plus two five six
  TEXTE ÉCRAN : subtitle « call plus two five six » word by word from 0.20 (plus 0.46, six 1.30), [boîte : six] at 1.30 ; micro label « CALL » ; phone row « +256 752 700 700 » with « +256 752 » in a yellow box ; écart avance 0.1 s
  IMAGE DE DÉPART : handoff_in.
  ÉTAPES : 0.00 the contact card is in place (960 px wide, top 560) ; 0.20 label « CALL » types in ; 0.46 « +256 » rolls in digit by digit (0.1 s per digit) on « plus two five six » ; 1.30 box on « six » ; 1.60 the yellow box closes around « +256 752 » once the 752 rolls on its cue
  PISTE CAMÉRA : push 3 %/s
  COUCHES ET PROFONDEUR : blurred frame foreground ; sharp card ; digits are the animated layer
  OBJET-PONT ET VECTEUR : the digit groups → the rest of the number (vector: right, 0.2 s expo.out)
  SON : click at 0.46, 0.80, 1.05, 1.30 (0.3)
  IMAGE CLÉ : 1.30 : the card with +256 rolled in and the box on six

Scene 2 (2.59 à 5.51 s) : P18, seven five two, seven zero zero, seven zero zero
  TEXTE ÉCRAN : subtitle « seven five two, seven zero zero, seven zero zero » word by word from 1.93 (seven 1.93, five 2.25, two 2.56, seven 3.07, zero 3.47, zero 3.75, seven 4.27, zero 4.68, zero 4.96), [boîte : two] at 2.56, [boîte : zero] at 3.75, [boîte : zero] at 4.96 ; hours « Mon–Fri 8:00–5:30 · Sat 8:00–1:00 » ; écart avance 0.1 s
  IMAGE DE DÉPART : the card with +256 rolled in
  ÉTAPES : 1.93 « 752 » rolls on its cue ; 3.07 « 700 » rolls ; 4.27 « 700 » rolls (the number is complete at 5.0) ; 4.30 the hours line « Mon–Fri 8:00–5:30 · Sat 8:00–1:00 » slides in under the number ; 5.00 a thin yellow underline draws under the number ; 5.20 push toward the card
  PISTE CAMÉRA : push 3 %/s ; 5.10 à 5.51 push toward cam(0.50, 0.50, 1.05) with blur 4 px
  COUCHES ET PROFONDEUR : blurred frame foreground ; sharp card
  OBJET-PONT ET VECTEUR : the card → stays; the end card hold begins
  SON : click at 1.93, 2.30, 2.56, 3.07, 3.47, 3.75, 4.27, 4.68, 4.96 (0.25)
  IMAGE CLÉ : 4.96 : the complete number with the underline drawing and the hours line


## Frame 14: Visit casements.co.ug · 46.43 → 53.30

- scene: the logo, the promise and the website button
- duration: 6.87s
- transition_in: cut
- status: animated
- src: compositions/frames/14-end-card.html
- voiceover: "or visit casements dot c o dot u g"
- type: cta
- blueprint: logo-assemble-lockup (Adapt)
- focal: the logo, the promise and the website button
- rules: cursor-click-ripple, svg-path-draw
- world: light
- handoff_in: à 0.00 : cam(0.50, 0.50, 1.0, rx 0, rz 0) the contact card (960 px wide, white, green border) is centered with « +256 752 700 700 » fully rolled in (« +256 752 » in the yellow box), micro labels CALL, OPEN visible, slow push-in 3 %/s, blur 4 px; the logo mark sits above it at 40% opacity; no subtitle; grain 3%
- handoff_out: aucun (fin du film, cut au noir à 6.87)

Word cues: or@0.17 visit@0.33 casements@0.87 dot@1.46 c@1.74 o@2.05 dot@2.29 u@2.60 g@2.82

Scene 1 (0.00 à 2.00 s) : P19, or visit
  TEXTE ÉCRAN : subtitle « or visit » word by word from 0.17 (visit 0.33), [boîte : visit] at 0.33 ; micro label « WEB » ; écart avance 0.1 s
  IMAGE DE DÉPART : handoff_in.
  ÉTAPES : 0.00 the contact card is centered with the full number ; 0.17 subtitle starts ; 0.33 box on « visit » ; 0.50 the card's frame lines draw a pulse and the micro label « WEB » types in ; 1.00 the website button « casements.co.ug » (green, white text, 760 px wide) rises x1.1 blurred then settles
  PISTE CAMÉRA : push 3 %/s
  COUCHES ET PROFONDEUR : blurred frame foreground ; sharp card
  OBJET-PONT ET VECTEUR : the button → stays
  SON : pop at 0.33 (0.3), click-soft at 0.50 (0.3)
  IMAGE CLÉ : 0.50 : the card with the WEB label and the box on visit

Scene 2 (2.00 à 6.87 s) : P20, casements dot c o dot u g, then the click and the hold
  TEXTE ÉCRAN : subtitle « casements dot c o dot u g » word by word from 0.87 (dot 1.43, c 1.71, o 2.02, dot 2.26, u 2.57, g 2.79), [boîte : casements] at 0.87 ; end-card text « Built to last. Delivered as promised. » ; ending ; écart avance 0.1 s
  IMAGE DE DÉPART : the button risen under the card
  ÉTAPES : 2.00 the button settles ; 2.30 a cursor arrives in ONE curved move (0.45 s power3.out) and clicks the button directly at 2.85 (press, yellow ripple ring) ; 3.00 the button fills yellow ; 3.30 the frame lines of the whole page draw a final sweep around the screen (the logo's grid) ; 3.80 « Built to last. Delivered as promised. » types at the top ; 4.00 to 6.40 living hold: slow push 3 %/s, a light sweep along the frame lines every 1.2 s ; 6.50 cut to ground ; 6.87 end
  PISTE CAMÉRA : push 3 %/s throughout, no stop ; 6.40 à 6.87 hold on the final image
  COUCHES ET PROFONDEUR : blurred frame foreground at the corners ; sharp card ; the frame sweep and the light are the living layers
  OBJET-PONT ET VECTEUR : the final ground
  SON : notification at 3.00 (0.7), click at 2.85 (0.4), sparkle at 3.30 (0.3)
  IMAGE CLÉ : 3.00 : the button pressed in yellow with the ripple, the card and the tagline
