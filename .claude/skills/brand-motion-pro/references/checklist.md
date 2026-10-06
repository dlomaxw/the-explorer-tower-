# Professional quality checklist

Brand
- [ ] `brand.json` is this client's, confirmed; `brand-lint.py` passes; no other client's name/colour/font anywhere.
- [ ] Only brand colours (60/30/10), only brand fonts, logo untouched and with clear space.
- [ ] "Could this frame belong to another brand?" Answer must be no.

Story and text
- [ ] Readable without sound; one idea per beat; ≤ 7 words per headline, ≤ 45 characters per subtitle chunk.
- [ ] Only approved facts; numbers/URLs match the brand source and the voice.
- [ ] One accent mechanism for words (the key-word box), one CTA, ≤ 1 accent element per beat besides it.

Motion
- [ ] Hierarchy of arrival (ground → container → hero → detail → text), stagger 0.06-0.14 s.
- [ ] Two speeds: gestures `expo.out` 0.5-0.8 s plus slow linear drifts; no frozen hold > 1 s without a living layer.
- [ ] Exits faster than entries; no bounce/elastic; no hard cut unless intended; seams invisible (before/after stills match).
- [ ] Numbers roll, strokes draw, panels grow from an anchor; nothing appears at final size.
- [ ] Depth: parallax or 3D tilt in at least two beats; shadows from the token; blur ≤ 18 px; ≤ 1 hero 3D object per beat.

UI, icons, footage
- [ ] UI built from kit parts; realistic proportions; text ≥ 24 px at 1080p; charts that fill; one cursor click with ripple.
- [ ] Icons from one stroke weight, drawn on, coloured by tokens.
- [ ] Footage graded with the brand tint, scrim behind text, muted, ids set, faded out before its slot ends, advances in snapshots.

Technical
- [ ] `comp-lint.py` and `hyperframes check` clean (contrast: no required pair below 4.5:1 / 3:1 large).
- [ ] Safe margins ≥ 6 % each side; nothing cut at the edge; subtitle band free of other content.
- [ ] Render: no black segment except intended, no frozen frames, duration = voice + tail, loudness -16 LUFS / ≤ -1.5 dBTP.
- [ ] Web copy < 28 MB; source pushed; renders not committed.
