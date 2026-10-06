#!/usr/bin/env python3
"""align-words.py <voice.(mp3|wav)> "<exact spoken text>" <out.json> [--word word=PH PH ...]

Word timings by forced alignment with pocketsphinx (offline: no model download, no API key). Use it when Whisper is not
available. The text must be what the voice SAYS (numbers spelled out: "plot thirty five"), lowercase, no punctuation.
Unknown words (brand names, places) need a pronunciation: --word kampala="K AA M P AA L AH".
The beams are opened wide: with the defaults the aligner often fails on a 45 s file.
Output: [{"w": "word", "start": s, "end": s}, ...] in seconds. Check the result against the audio (waveform or listen)
before trusting it: forced alignment cannot tell you that the voice said the wrong word.
"""
import json, os, re, subprocess, sys, tempfile
from pocketsphinx import Decoder, get_model_path

if len(sys.argv) < 4:
    sys.exit(__doc__)
voice, text, out = sys.argv[1], sys.argv[2].lower(), sys.argv[3]
extra = {}
if "--word" in sys.argv:
    for a in sys.argv[sys.argv.index("--word") + 1:]:
        k, v = a.split("=", 1)
        extra[k.lower()] = v
raw = tempfile.mktemp(suffix=".raw")
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", voice, "-ar", "16000", "-ac", "1", "-f", "s16le", raw], check=True)
mp = get_model_path()
d = Decoder(hmm=mp + "/en-us/en-us", dict=mp + "/en-us/cmudict-en-us.dict", loglevel="FATAL",
            beam=1e-200, wbeam=1e-150, pbeam=1e-200, maxhmmpf=-1)
vocab = {l.split()[0] for l in open(mp + "/en-us/cmudict-en-us.dict")}
for w in sorted(set(text.split())):
    if w not in vocab and w not in extra:
        print(f"  ! '{w}' is not in the dictionary: add --word {w}=\"PH PH ...\"")
for w, ph in extra.items():
    try:
        d.add_word(w, ph, True)
    except Exception:  # already in the dictionary: keep the stock pronunciation
        pass
d.set_align_text(text)
d.start_utt(); d.process_raw(open(raw, "rb").read(), full_utt=True); d.end_utt()
words = [{"w": re.sub(r"\(\d\)", "", s.word), "start": round(s.start_frame / 100, 2), "end": round(s.end_frame / 100, 2)}
         for s in d.seg() if not (s.word.startswith("<") or s.word == "[SPEECH]" or s.word.startswith("++"))]
os.remove(raw)
json.dump(words, open(out, "w"), indent=0)
print(f"{len(words)} words aligned of {len(text.split())} -> {out}")
