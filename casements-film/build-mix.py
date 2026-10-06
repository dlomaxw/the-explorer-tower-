#!/usr/bin/env python3
"""Casements mix: voice montage + looped supplied music (ducked under the voice) + sfx, loudnorm -16 LUFS / -1.5 dBTP."""
import json, os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
A = "assets/audio/"; SFX = "../.claude/skills/media-use/audio/assets/sfx/"
TOTAL = 53.3
MUSIC_VOL = float(os.environ.get("MUSIC_VOL", "0.5"))
ev = json.load(open(A + "sfx-events.json"))
inputs = ["-i", A + "voix-montage.wav", "-i", A + "musique.mp3", "-i", A + "musique.mp3"]
g = [
  "[0]aformat=sample_rates=44100:channel_layouts=stereo,asplit=2[v][vsc]",
  # loop: track + track again, 2 s crossfade (46 s + 44 s > 53.3 s)
  "[1]aformat=sample_rates=44100:channel_layouts=stereo[m1]", "[2]aformat=sample_rates=44100:channel_layouts=stereo[m2]",
  "[m1][m2]acrossfade=d=2:c1=tri:c2=tri,atrim=0:%s,asetpts=N/SR/TB,afade=t=in:st=0:d=0.8,afade=t=out:st=%s:d=2.6,volume=%s[m]" % (TOTAL, TOTAL-2.6, MUSIC_VOL),
  "[m][vsc]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=450[md]",
]
labels = ["[v]", "[md]"]
for k, (name, t, vol) in enumerate(ev):
    idx = 3 + k
    inputs += ["-i", SFX + name + ".mp3"]
    d = int(t * 1000)
    g.append(f"[{idx}]aformat=sample_rates=44100:channel_layouts=stereo,volume={vol},adelay={d}|{d}[e{k}]")
    labels.append(f"[e{k}]")
g.append("".join(labels) + f"amix=inputs={len(labels)}:normalize=0:duration=first,atrim=0:{TOTAL},alimiter=limit=0.95,loudnorm=I=-16:TP=-1.5:LRA=7[out]")
subprocess.run(["ffmpeg", "-y", "-v", "error", *inputs, "-filter_complex", ";".join(g), "-map", "[out]", "-ar", "44100", A + "mix.wav"], check=True)
print("mix.wav written")
