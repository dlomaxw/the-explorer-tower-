# Voice, music, sound effects

## Voice (made by the user, never by the skill)

The user records the voice (for example in the ElevenLabs web app) from the approved script. Never ask for an API key,
never store one. Script text for the voice spells out numbers and URLs the way they are said ("plot thirty five", "call
plus two five six ..."). Save the file as `assets/audio/voix.mp3`.

**Always verify the voice says what the script says** (a re-generated take can change a number or a name). A quick
free-form decode of the critical phrase with pocketsphinx (`Decoder` with the stock LM) catches "fifty-five" vs "thirty-five".

## Word timings

`python3 scripts/align-words.py voix.mp3 "exact spoken text" words.json --word name="PH PH"` produces
`[{w, start, end}]` by forced alignment, offline (Whisper models often cannot be downloaded in sandboxes). Add a
pronunciation for every unknown word (brand names, places). Cut long silences into the voice first (silence at a seam is
free room for an effect). Write the cues into the storyboard frame by frame as `word@seconds` **frame-local**.

## A corrected voice after the picture exists

Do not re-time every frame. `python3 scripts/retime-voice.py --voice new.mp3 --new-words new-words.json --cues old-words.json --total T --out voix-montage.wav`
warps each phrase of the new voice onto the existing cues (±12 % at most) and guarantees no word trails its cue by more than
0.03 s. Then rebuild the mix. Change on-screen text in the frames only where the wording changed.

## Music

Only music the client supplies or that is licensed (CC0 libraries); never generated music unless the client asks.
`scripts/build-mix.py` loops a short track with a 2 s crossfade, fades in 0.8 s and out 2.6 s, ducks it under the voice
(sidechain compression) and normalises the final mix to **-16 LUFS, true peak ≤ -1.5 dBTP**. A music file that peaks above
0 dBFS (loud loops often do) is fine: the mix normalises it. Music level `--music-vol 0.5` ≈ -26 LUFS under the voice;
raise to 0.7 for instrumental-only stretches (the sidechain already lifts it in pauses).
Let the user choose by ear: build 2-3 mixes (`mix-A.wav`, `mix-B.wav`) and swap them with the same render.

## Sound effects

Small, locked on the gesture, never on the voice: soft click on draws, pop on tiles, a short whoosh on scene windows,
ping on a result, one signature sound at the key moment. List them in `assets/audio/sfx-events.json`
(`[["click-soft", 12.3, 0.5], ...]`, seconds on the final timeline, volumes 0.3-0.7). SFX come from a licensed library (the
HeyGen `media-use` set shipped in the repository is Pixabay-licensed); never bundle third-party audio into this skill.

## Mount

```html
<audio id="mix" data-start="0" data-duration="49.8" data-track-index="11" src="assets/audio/mix.wav" data-volume="1"></audio>
```
at the root of `index.html` (the `<audio>` needs an `id` or it is silent). Videos stay muted.
