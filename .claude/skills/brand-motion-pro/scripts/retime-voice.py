#!/usr/bin/env python3
"""retime-voice.py --voice new.mp3 --new-words new-words.json --cues old-words.json --total 49.8 --out voix-montage.wav

A corrected or re-recorded voice rarely has the same pacing as the one the picture was built on. Instead of re-timing
every frame, warp the NEW voice onto the existing cues:
  1. split the new voice into phrases at gaps > 0.10 s (from align-words.py output),
  2. stretch/compress each phrase (atempo, clamped to 0.88..1.12 so it never sounds processed) to the length of the
     same phrase in the old cue file, anchored on the phrase centre,
  3. shift each phrase earlier/later so no word lands LATE (a subtitle must never trail the voice): late <= 0.03 s,
  4. place the phrases on a silent timeline of --total seconds.
Report: worst late/early word offsets, computed analytically (no ASR round-trip, which is unreliable at file starts).
Both word files use [{"w","start","end"}] (the old file may also use "s"/"e" keys). Words must match one to one.
"""
import argparse, json, subprocess, sys

ap = argparse.ArgumentParser()
ap.add_argument("--voice", required=True); ap.add_argument("--new-words", required=True)
ap.add_argument("--cues", required=True); ap.add_argument("--total", type=float, required=True)
ap.add_argument("--out", required=True); ap.add_argument("--gap", type=float, default=0.10)
ap.add_argument("--clamp", type=float, default=0.12)
a = ap.parse_args()


def load(p):
    d = json.load(open(p))
    d = d if isinstance(d, list) else d["words"]
    return [{"w": x["w"], "s": x.get("start", x.get("s")), "e": x.get("end", x.get("e"))} for x in d]


new, old = load(a.new_words), load(a.cues)
if len(new) != len(old):
    sys.exit(f"word count differs: new {len(new)} vs cues {len(old)}; align the same script text")
segs, cur = [], [0]
for i in range(1, len(new)):
    if new[i]["s"] - new[i - 1]["e"] > a.gap:
        segs.append(cur); cur = [i]
    else:
        cur.append(i)
segs.append(cur)
pad = 0.04
inputs = ["-i", a.voice]
g = ["[0]aformat=sample_rates=44100:channel_layouts=mono,asplit=%d%s" % (len(segs), "".join(f"[s{k}]" for k in range(len(segs))))]
labels, offs = [], []
for k, s in enumerate(segs):
    i0, i1 = s[0], s[-1]
    ns, ne = new[i0]["s"] - pad, new[i1]["e"] + pad
    nd, od = new[i1]["e"] - new[i0]["s"], old[i1]["e"] - old[i0]["s"]
    f = min(1 + a.clamp, max(1 - a.clamp, nd / od))
    om, nm = (old[i0]["s"] + old[i1]["e"]) / 2, (new[i0]["s"] + new[i1]["e"]) / 2
    at = max(0.0, om - (nm - ns) / f)
    d = [old[i]["s"] - (at + (new[i]["s"] - ns) / f) for i in s]  # >0: word is spoken before its cue (subtitle late)
    corr = max(d) - 0.03 if max(d) > 0.03 else 0.0
    at += corr
    offs += [x - corr for x in d]
    g.append(f"[s{k}]atrim={ns:.3f}:{ne:.3f},asetpts=PTS-STARTPTS,atempo={f:.4f},afade=t=in:d=0.01,"
             f"afade=t=out:st={max(0, (ne - ns) / f - 0.01):.3f}:d=0.01,adelay={int(at * 1000)}[a{k}]")
    labels.append(f"[a{k}]")
g.append("".join(labels) + f"amix=inputs={len(labels)}:normalize=0:duration=longest,apad=whole_dur={a.total},atrim=0:{a.total},"
         "aformat=sample_rates=44100:channel_layouts=stereo[out]")
subprocess.run(["ffmpeg", "-y", "-v", "error", *inputs, "-filter_complex", ";".join(g), "-map", "[out]", a.out], check=True)
print(f"{len(segs)} phrases -> {a.out}\n  word offsets vs cues: latest {max(offs):+.2f}s (must be <= +0.03), earliest {min(offs):+.2f}s (ok down to -0.20)")
if max(offs) > 0.05:
    print("  ! some words trail their cue: lower --gap or re-cut the phrase")
