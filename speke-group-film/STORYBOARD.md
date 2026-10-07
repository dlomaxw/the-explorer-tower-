---
format: 1080x1920
duration: "49.9s"
message: "Speke Group: thirteen hotels, resorts, serviced apartments and event venues across Uganda, 900+ rooms, 45 conference rooms, the largest private marina in Uganda and the 2026 World's Best Luxury Convention Resort. spekegroup.com"
arc: Hook → Figures → Heritage → Marina → Experiences → Events → Award → CTA
audience: "Business and leisure travellers, event planners and families looking for a stay or a venue in Uganda"
mode: autonomous
captions: disabled
music: "speke music (about 95 bpm) from the user, looped and ducked under the voice; mix in assets/audio/mix.wav"
direction: "One Warm Welcome: the client's own footage and photos in a cream, maroon and gold world, the gold line and the cream disc as the thread; Playfair Display for headlines and numbers, Inter for labels"
---

## Video direction

- **Timing rule**: the word cues of each frame are the truth; the times written inside the scene blocks are guides and must follow the cues (a number rolls ON its word).

- **One world**: cream ground (#f7f2e9) and maroon (#6f2033, deep #5c1728), gold (#c9a227, soft #d4af6a) as the ONLY accent; Playfair Display for the voice sentences and numbers, Inter for small labels and the contact card. Never another colour or font.
- **Real imagery only**: the client's footage (hero-properties-mobile, hero-paradise-mobile) and photos from the site; nothing stock, nothing generated. Photos are small (about 690 px wide): always shown in cards at most 2x, never full-bleed. Footage frames are 1080 wide and may go full-bleed.
- **Object-bridge**: the gold line (6 px) and the cream disc / gold ring that grow from one frame into the next.
- **Components**: counters that roll, photo cards in 3D, timeline, icon tiles that draw on, award seal with drawn laurel, contact card, one CTA with a cursor click.
- **Invisible seams**: every frame hands over to the next (handoff_out copied word for word into handoff_in), no hard cut.
- **Text**: the voice sentence as subtitle in the band y 1450 to 1640 (word by word, 0-2 frames early, ONE key-word box per sentence); numbers are spelled as spoken in the cues but may be shown as digits (1,400, 2026, 1996) as the cue lists say; frame 1 uses display text instead of the subtitle.
- **Facts**: only the site's own: 13 properties, 900+ rooms, 45 conference rooms, 1920s / 1996, largest privately owned marina in Uganda, 1,000-1,400 guest ballrooms, World's Best Luxury Convention Resort (Luxe Global Awards, 2026), the contact details. The address on screen is spekegroup.com only.
- **Music**: hits on the beat grid (about 0.63 s) when the voice allows (±0.05 s). **Safe area**: 60 px side margins, bottom 280 px free but for the subtitle band (y 1450-1640).

**SIGNATURES**
- « The gold line »: 6 px, 0.00 frame 1 hairline, 20.00 split (frame 4), 32.20 opens (frame 6), 13.6 handoff
- « The cream disc / gold ring »: 13.60, 38.00, 43.40


## Frame 1: Distinctive places · 0.00 → 6.20

- scene: Distinctive places
- id: 01-welcome
- duration: 6.20s
- transition_in: cut
- status: animated
- src: compositions/frames/01-welcome.html
- type: solution
- blueprint: spatial-pan-stations (Adapt)
- focal: Distinctive places
- rules: svg-path-draw, waterfall-entry
- world: dark
- voiceover: "Distinctive places across Uganda. One warm welcome. This is Speke Group."
- subtitle chunks (45 characters at most): ['Distinctive places across Uganda.', 'One warm welcome.', 'This is Speke Group.']
- key-word boxes (one per sentence): ['places', 'warm', 'Speke']
- handoff_in: black ground, nothing on screen at 0.00 (opening, the film starts on the footage)
- handoff_out: at 6.20 the hero footage (hero-properties-mobile.mp4) is full-bleed under a maroon veil (maroon-deep, 90 % opacity, no other element on screen); subtitle gone

Word cues (frame-local seconds): Distinctive@0.00 places@0.66 across@1.22 Uganda.@1.70 One@2.86 warm@3.09 welcome.@3.66 This@4.64 is@5.04 Speke@5.27 Group.@5.64

Scene 1 (0.00 to 6.20 s): the page's own opening, on the client's own footage
  TEXTE ECRAN: display « Distinctive Places Across Uganda. » then gold line « One Warm Welcome » (Playfair Display, cream and gold-soft), logo card with the seal at 4.6 (the supplied 180x113 px logo used small, on a cream card, never stretched), « Hotels · Apartments · Resorts » small caps under it
  ETAPES: 0.00 footage fades up from the ground (hero-properties-mobile.mp4, loops finite, slow push 4 %/s) under a maroon-to-transparent gradient from the bottom ; 0.10 a gold hairline draws across at y 520 ; 0.35 « Distinctive Places » rises word by word (stagger 0.09, blur 12 to 0) ; 1.70 « Across Uganda. » ; 2.90 the gold line « One Warm Welcome » draws letter group by group ; 4.60 logo card slides up in 3D (rotateX 8 to 0) ; 5.60 the card glows once ; 5.95 the maroon veil closes (opacity to 0.9) = handoff
  CAMERA: footage push 4 %/s, parallax between footage (slow) and titles (faster) ; hero text 120-140 px
  COUCHES: footage · maroon veil gradient · gold hairline · titles · logo card · subtitle band replaced by display text (no subtitle in this frame)
  OBJET-PONT: the footage under the veil becomes the maroon ground of frame 2
  SON: whoosh-cinematic 0.00, sparkle 2.90, pop 4.60
  IMAGE CLE: 4.80: footage, gold line « One Warm Welcome » lit, logo card landing


## Frame 2: 13, 900+, 45 · 6.20 → 13.60

- scene: 13, 900+, 45
- id: 02-figures
- duration: 7.40s
- transition_in: cut
- status: animated
- src: compositions/frames/02-figures.html
- type: solution
- blueprint: spatial-pan-stations (Adapt)
- focal: 13, 900+, 45
- rules: svg-path-draw, waterfall-entry
- world: dark
- voiceover: "Thirteen properties. Over nine hundred rooms. Hotels, resorts, serviced apartments and event venues."
- subtitle chunks (45 characters at most): ['Thirteen properties.', 'Over nine hundred rooms.', 'Hotels, resorts, serviced apartments', 'and event venues.']
- key-word boxes (one per sentence): ['Thirteen', 'hundred', 'venues']
- handoff_in: at 6.20 the hero footage (hero-properties-mobile.mp4) full-bleed under a maroon veil 90 %, nothing else (copy of frame 1 handoff_out)
- handoff_out: at 13.60 a cream disc (radius 1500 px, centre x 540 y 960) covers the whole screen = cream ground, nothing else visible

Word cues (frame-local seconds): Thirteen@0.16 properties.@0.74 Over@1.67 nine@1.91 hundred@2.32 rooms.@2.85 Hotels,@3.73 resorts,@4.38 serviced@5.18 apartments@5.62 and@6.21 event@6.44 venues.@6.73

Scene 1 (6.20 to 13.60 s): three numbers, four kinds of place
  TEXTE ECRAN: rolling counters « 13 » PROPERTIES (6.55), « 900+ » ROOMS (8.05), « 45 » CONFERENCE ROOMS (full mention at 9.8, with the figure but spoken only in frame 6: shown here as a bonus tile), then four icon tiles HOTELS · RESORTS · APARTMENTS · EVENT VENUES (icons from MK_ICONS: bed, wave/sun, building, calendar or nearest; draw missing ones on the 24 grid), numbers Playfair 200 px cream, labels Inter 28 px gold-soft, tracking .22em
  ETAPES: 0.00 veil becomes solid maroon ground (the footage fades under it to 0 by 0.5) ; 0.30 gold ring draws around the counter zone ; 0.16 « 13 » rolls up on thirteen (0.9 s expo) ; 1.9 « 900+ » rolls on nine hundred ; 3.73 the 4 tiles flip in 3D one by one on the words hotels@3.73, resorts@4.38, serviced apartments@5.18, event venues@6.44 (cues below) ; 6.9 tiles slide down, a cream disc grows from the last tile (0.9 s expo.in) to cover the screen = handoff
  CAMERA: slow z push on the number stack, tiles with MK.tilt
  COUCHES: maroon ground + faint gold radial · counters · gold ring · tiles with icons · subtitle band
  OBJET-PONT: the cream disc
  SON: pop on each counter at 0.16, 1.9 ; click-soft on each tile ; whoosh-short 6.9
  IMAGE CLE: 3.4: « 900+ » rolled up, « 13 » above it in gold-lined card, tiles about to arrive


## Frame 3: Speke Hotel, 1920s to 1996 · 13.60 → 20.00

- scene: Speke Hotel, 1920s to 1996
- id: 03-heritage
- duration: 6.40s
- transition_in: cut
- status: animated
- src: compositions/frames/03-heritage.html
- type: solution
- blueprint: spatial-pan-stations (Adapt)
- focal: Speke Hotel, 1920s to 1996
- rules: svg-path-draw, waterfall-entry
- world: light
- voiceover: "It began with Speke Hotel, a Kampala landmark from the 1920s, acquired in 1996."
- subtitle chunks (45 characters at most): ['It began with Speke Hotel,', 'a Kampala landmark from the 1920s,', 'acquired in 1996.']
- key-word boxes (one per sentence): ['Speke', '1996']
- handoff_in: cream ground, nothing else on screen
- handoff_out: at 20.00 cream ground with one gold line (6 px, full width, x 0 to 1080) at y 960, nothing else

Word cues (frame-local seconds): It@0.25 began@0.38 with@0.77 Speke@0.95 Hotel,@1.34 a@2.12 Kampala@2.19 landmark@2.68 from@3.22 the@3.36 1920s,@3.43 acquired@4.41 in@4.90 1996.@5.05

Scene 1 (13.60 to 20.00 s): from an archive photo to a year
  TEXTE ECRAN: archive photo card (about-history-1960.webp, caption « Speke Hotel, Kampala », the client's caption: « under its earlier owners, before the Group acquired it in 1996 »), timeline « 1920s ──── 1996 » with Playfair years 150 px maroon, gold dots
  ETAPES: 0.00 cream ground, paper grain ; 0.15 the photo card rises with a sepia-to-colour wipe, 3D tilt, shadow ; 0.9 timeline line draws left to right ; 3.43 « 1920s » appears on the word 1920s (cue) ; 3.9 the photo slides up, the line becomes a thick maroon bar ; 4.41 « 1996 » counts from 1920 to 1996 on the word acquired (set by 5.05, hold, gold underline) ; 5.7 the timeline line straightens to the horizontal gold line at y 960 = handoff
  CAMERA: slow push 3 %/s on the photo, gentle parallax on the year
  COUCHES: cream ground · photo card · timeline · years · subtitle band
  OBJET-PONT: the gold line
  SON: pop 3.43, click-soft 4.41 to 5.05 (ticks on the counter), sparkle 5.1
  IMAGE CLE: 5.3: « 1996 » set large in maroon on the timeline, photo card tilted above it


## Frame 4: Largest private marina in Uganda · 20.00 → 26.20

- scene: Largest private marina in Uganda
- id: 04-marina
- duration: 6.20s
- transition_in: cut
- status: animated
- src: compositions/frames/04-marina.html
- type: solution
- blueprint: spatial-pan-stations (Adapt)
- focal: Largest private marina in Uganda
- rules: svg-path-draw, waterfall-entry
- world: dark
- voiceover: "On the shores of Lake Victoria, Speke Resort Munyonyo has the largest privately owned marina in Uganda."
- subtitle chunks (45 characters at most): ['On the shores of Lake Victoria,', 'Speke Resort Munyonyo has the largest', 'privately owned marina in Uganda.']
- key-word boxes (one per sentence): ['largest']
- handoff_in: cream ground with one gold line (6 px, full width) at y 960, nothing else (copy of frame 3 handoff_out)
- handoff_out: at 26.20 the footage is fully covered by a cream wash = cream ground, nothing else on screen

Word cues (frame-local seconds): On@0.17 the@0.31 shores@0.38 of@0.79 Lake@0.88 Victoria,@1.09 Speke@1.88 Resort@2.26 Munyonyo@2.62 has@3.26 the@3.48 largest@3.57 privately@4.16 owned@4.71 marina@4.87 in@5.33 Uganda.@5.49

Scene 1 (20.00 to 26.20 s): the lake
  TEXTE ECRAN: « Speke Resort Munyonyo » (small caps, gold-soft), display « The largest privately owned marina in Uganda » (Playfair 100 px, cream, 3 lines), a location chip « Lake Victoria »
  ETAPES: 0.00 the gold line at y 960 splits open (top half up, bottom half down, 0.8 s expo.out) revealing hero-paradise-mobile.mp4 (lakeside thatched cottages on Lake Victoria, the client's footage; if the 1080x1440 file is shorter than the frame fill the rest with the same footage scaled, never stretched) ; 0.9 maroon gradient from the bottom rises ; 1.0 chip « Lake Victoria » pops ; 1.9 small caps « Speke Resort Munyonyo » ; 3.5 display title assembles word by word on « largest privately owned marina » (cues 3.57 to 5.49, whole title set by 5.0) ; 4.3 photo card (l-marina.webp) slides in 3D bottom-right as a second proof ; 5.7 a cream wash covers everything from the bottom (0.5 s) = handoff
  CAMERA: footage drifts 5 %/s (slow aerial feel), titles faster parallax
  COUCHES: footage · maroon gradient · chip · display title · photo card · subtitle band (on the gradient)
  OBJET-PONT: the cream wash
  SON: whoosh-cinematic 0.00, pop 1.0, sparkle 4.3
  IMAGE CLE: 5.0: footage open, « The largest privately owned marina in Uganda » fully set, chip lit


## Frame 5: Spa, gym, pools, riding, lakeside · 26.20 → 32.20

- scene: Spa, gym, pools, riding, lakeside
- id: 05-experiences
- duration: 6.00s
- transition_in: cut
- status: animated
- src: compositions/frames/05-experiences.html
- type: solution
- blueprint: spatial-pan-stations (Adapt)
- focal: Spa, gym, pools, riding, lakeside
- rules: svg-path-draw, waterfall-entry
- world: light
- voiceover: "Spas. Gyms. Pools. Horse riding. Lakeside Sundays with live jazz."
- subtitle chunks (45 characters at most): ['Spas. Gyms. Pools.', 'Horse riding.', 'Lakeside Sundays with live jazz.']
- key-word boxes (one per sentence): ['Gyms.', 'riding.', 'jazz.']
- handoff_in: cream ground, nothing else on screen
- handoff_out: at 32.20 cream ground with one gold line (6 px, full width) at y 960, nothing else

Word cues (frame-local seconds): Spas.@0.31 Gyms.@1.22 Pools.@1.95 Horse@2.75 riding.@3.04 Lakeside@3.79 Sundays@4.33 with@4.87 live@5.04 jazz.@5.40

Scene 1 (26.20 to 32.20 s): five experiences, one tile each, on the voice
  TEXTE ECRAN: five photo tiles (l-spa.webp 447 px square, l-gym.webp, l-pools.webp, l-equestrian.webp, l-lakeside.webp) with a Playfair label each (« Spa », « Gym », « Pools », « Equestrian », « Lakeside Sundays · live jazz ») and a gold icon from MK_ICONS or drawn on the 24 grid
  ETAPES: 0.00 cream ground ; 0.25 the spa tile slides in on the word spas (3D rotateY 20 to 0) ; 1.2 gym (on gyms) ; 1.9 pools ; 2.7 equestrian on horse ; 3.8 lakeside tile large with an animated sound-wave line (jazz) on the word jazz ; the tiles form a stack that parallaxes ; 5.7 the stack drops away, the gold line draws across y 960 = handoff
  CAMERA: tiles on a slow z-drift (6 %/s), the active tile is 1.15x
  COUCHES: cream ground · tiles (photo + shadow) · icons · labels · subtitle band
  OBJET-PONT: the gold line
  SON: pop on every tile, sparkle on jazz, whoosh-short 5.7
  IMAGE CLE: 4.4: lakeside tile in front with the sound-wave line, the four earlier tiles stacked behind it


## Frame 6: 45 conference rooms, up to 1,400 guests · 32.20 → 38.00

- scene: 45 conference rooms, up to 1,400 guests
- id: 06-conference
- duration: 5.80s
- transition_in: cut
- status: animated
- src: compositions/frames/06-conference.html
- type: solution
- blueprint: spatial-pan-stations (Adapt)
- focal: 45 conference rooms, up to 1,400 guests
- rules: svg-path-draw, waterfall-entry
- world: dark
- voiceover: "Forty-five conference rooms, from boardrooms to ballrooms for up to 1,400 guests."
- subtitle chunks (45 characters at most): ['Forty-five conference rooms,', 'from boardrooms to ballrooms', 'for up to 1,400 guests.']
- key-word boxes (one per sentence): ['Forty-five', '1,400']
- handoff_in: cream ground with one gold line (6 px, full width) at y 960, nothing else (copy of frame 5 handoff_out)
- handoff_out: at 38.00 maroon ground with a gold ring (6 px stroke, radius 300, centre x 540 y 800), nothing else

Word cues (frame-local seconds): Forty-five@0.26 conference@0.99 rooms,@1.49 from@1.89 boardrooms@2.23 to@2.86 ballrooms@2.97 for@3.66 up@3.81 to@3.90 1,400@4.00 guests.@5.12

Scene 1 (32.20 to 38.00 s): from a boardroom to a ballroom
  TEXTE ECRAN: counter « 45 » (Playfair 220 px cream) with label « CONFERENCE ROOMS », then three stacked photo frames growing in size: boardroom (v-oak is not available: use v-jacaranda or meetings-bg.webp), conference (v-palm.webp), ballroom (v-victoria.webp, v-speke-ballroom.webp), and a counter « 1,400 » with label « GUESTS »
  ETAPES: 0.00 the gold line opens into a maroon ground ; 0.25 « 45 » rolls up on forty-five ; 1.3 three photo frames fan out in 3D, smallest to largest, on boardrooms to ballrooms (each 0.5 s) ; 3.4 « 1,400 » rolls to its value on fourteen hundred, a crowd of 12 gold dots multiplies behind it ; 5.4 everything collapses into a gold ring at x 540 y 800 = handoff
  CAMERA: slow push, ballroom photo with a Ken Burns drift
  COUCHES: maroon ground · photo frames · counters · dots · subtitle band
  OBJET-PONT: the gold ring
  SON: pop on 45, whoosh-short on each frame, impact-bass-1 on 1,400 (soft)
  IMAGE CLE: 4.4: the ballroom photo large, « 1,400 » rolled, « 45 » in small above


## Frame 7: World's Best Luxury Convention Resort, 2026 · 38.00 → 43.40

- scene: World's Best Luxury Convention Resort, 2026
- id: 07-award
- duration: 5.40s
- transition_in: cut
- status: animated
- src: compositions/frames/07-award.html
- type: solution
- blueprint: spatial-pan-stations (Adapt)
- focal: World's Best Luxury Convention Resort, 2026
- rules: svg-path-draw, waterfall-entry
- world: dark
- voiceover: "In 2026, our Convention Centre was named World's Best Luxury Convention Resort."
- subtitle chunks (45 characters at most): ['In 2026, our Convention Centre', "was named World's Best", 'Luxury Convention Resort.']
- key-word boxes (one per sentence): ['2026,', 'Luxury']
- handoff_in: maroon ground with a gold ring (6 px stroke, radius 300, centre x 540 y 800), nothing else (copy of frame 6 handoff_out)
- handoff_out: at 43.40 a cream disc (radius 1500 px, centre x 540 y 800) covers the whole screen = cream ground, nothing else visible

Word cues (frame-local seconds): In@0.20 2026,@0.33 our@1.38 Convention@1.63 Centre@2.16 was@2.45 named@2.65 World's@2.91 Best@3.40 Luxury@3.82 Convention@4.31 Resort.@4.81

Scene 1 (38.00 to 43.40 s): the award
  TEXTE ECRAN: inside the ring: a gold award seal (laurel drawn from two arcs, a star) with « 2026 » in Playfair 150 px; display « World's Best Luxury Convention Resort » (Playfair 90 px cream), « Luxe Global Awards » small caps gold-soft, photo p-convention-centre.webp as a card behind
  ETAPES: 0.00 the ring holds then its stroke thickens ; 0.2 laurel arcs draw (0.8 s) ; 0.5 « 2026 » rolls from 2020 ; 1.6 title « World's Best » rises, 3.0 « Luxury Convention Resort » ; 3.3 « Luxe Global Awards » underlined by a gold line ; 4.2 gold sparkle sweep over the seal ; 5.0 a cream disc grows from the seal centre (0.4 s expo.in) = handoff
  CAMERA: z push 4 %/s, the seal with MK.tilt
  COUCHES: maroon ground · photo card (low opacity) · ring + laurel · year · title · subtitle band
  OBJET-PONT: the cream disc
  SON: sparkle 0.5, chime 1.6, whoosh-short 5.0
  IMAGE CLE: 2.4: seal complete, « 2026 » set, « World's Best » rising


## Frame 8: Speke Group, spekegroup.com · 43.40 → 49.90

- scene: Speke Group, spekegroup.com
- id: 08-cta
- duration: 6.50s
- transition_in: cut
- status: animated
- src: compositions/frames/08-cta.html
- type: solution
- blueprint: spatial-pan-stations (Adapt)
- focal: Speke Group, spekegroup.com
- rules: svg-path-draw, waterfall-entry
- world: light
- voiceover: "Speke Group. Hotels, apartments, resorts. Visit spekegroup.com"
- subtitle chunks (45 characters at most): ['Speke Group.', 'Hotels, apartments, resorts.', 'Visit spekegroup.com']
- key-word boxes (one per sentence): ['spekegroup.com']
- handoff_in: cream ground, nothing else on screen
- handoff_out: end card holds to 49.90: cream ground, logo, address, no motion beyond the slow breathing

Word cues (frame-local seconds): Speke@0.32 Group.@0.73 Hotels,@1.49 apartments,@2.27 resorts.@3.10 Visit@4.11 spekegroup.com@4.44

Scene 1 (43.40 to 49.90 s): end card
  TEXTE ECRAN: logo (supplied 180x113 px logo, shown at most 2x with a soft cream card, NEVER full width; replace with the hi-res file when the client sends it), « Hotels · Apartments · Resorts », display « spekegroup.com » (Playfair 110 px maroon with a gold underline), contact card: « (+256) 707 711 750 », « info@spekegroup.com », « 4th Floor, Crane Chambers, Kampala Road, Uganda » (Inter 32 px)
  ETAPES: 0.00 cream ground, the logo card rises in 3D ; 0.9 « Hotels · Apartments · Resorts » ; 2.2 « spekegroup.com » assembles letter group by letter group, gold underline draws ; 3.4 contact card slides up, phone and email lines tick in ; 4.6 a cursor clicks a maroon « Visit spekegroup.com » button (button text is the address only), ripple ; 5.0 to 6.5 hold with a slow gold sparkle sweep and breathing scale (finite)
  CAMERA: slow push 2 %/s
  COUCHES: cream ground · logo card · address · contact card · button · subtitle band (until « dot com », then the address stays alone)
  OBJET-PONT: none (end)
  SON: pop 0.0, sparkle 2.2, click 4.6
  IMAGE CLE: 5.6: logo, spekegroup.com in maroon with gold underline, contact card and button
