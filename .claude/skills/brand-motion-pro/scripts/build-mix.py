#!/usr/bin/env python3
"""build-mix.py --voice voix-montage.wav --total 49.8 [--music music.wav] [--sfx sfx-events.json] [--music-vol 0.5] --out mix.wav

Final mix: voice + looped background music (ducked under the voice by sidechain compression, 0.8 s fade in, 2.6 s fade
out) + sound effects at their times, then loudnorm to -16 LUFS / -1.5 dBTP, padded/trimmed to --total.
  * the music is looped with a 2 s crossfade when it is shorter than the film (it never restarts with a click),
  * sfx-events.json: [["click-soft", 12.3, 0.5], ...] = [file name in --sfx-dir without .mp3, seconds, volume],
  * --sfx-dir: $SFX_DIR, else .claude/skills/media-use/audio/assets/sfx found in ., .. or ~ (sound effects are never bundled).
Music level: --music-vol 0.5 gives about -26 LUFS of music under a -16 LUFS voice; lower it if the voice is soft.
"""
import argparse, json, os, subprocess

ap = argparse.ArgumentParser()
ap.add_argument("--voice", required=True); ap.add_argument("--total", type=float, required=True)
ap.add_argument("--music"); ap.add_argument("--sfx"); ap.add_argument("--music-vol", type=float, default=0.5)
ap.add_argument("--sfx-dir", default=os.environ.get("SFX_DIR"))
ap.add_argument("--out", required=True)
a = ap.parse_args()
T = a.total
if a.sfx and not a.sfx_dir:  # find the HeyGen media-use sound-effect folder: project, parent, repo root, home
    for base in (".", "..", os.path.expanduser("~")):
        cand = os.path.join(base, ".claude", "skills", "media-use", "audio", "assets", "sfx")
        if os.path.isdir(cand):
            a.sfx_dir = cand
            break
    else:
        raise SystemExit("build-mix: no sound-effect folder found: pass --sfx-dir or set SFX_DIR")
inputs, g, labels = ["-i", a.voice], [], ["[v]"]
g.append("[0]aformat=sample_rates=44100:channel_layouts=stereo,asplit=2[v][vsc]")
n = 1
if a.music:
    inputs += ["-i", a.music, "-i", a.music]
    g.append("[1]aformat=sample_rates=44100:channel_layouts=stereo[m1]")
    g.append("[2]aformat=sample_rates=44100:channel_layouts=stereo[m2]")
    g.append(f"[m1][m2]acrossfade=d=2:c1=tri:c2=tri,atrim=0:{T},asetpts=N/SR/TB,afade=t=in:st=0:d=0.8,"
             f"afade=t=out:st={T - 2.6}:d=2.6,volume={a.music_vol}[m]")
    g.append("[m][vsc]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=450[md]")
    labels.append("[md]"); n = 3
else:
    g[0] = "[0]aformat=sample_rates=44100:channel_layouts=stereo[v]"
if a.sfx:
    for k, (name, t, vol) in enumerate(json.load(open(a.sfx))):
        inputs += ["-i", os.path.join(a.sfx_dir, name + ".mp3")]
        d = int(t * 1000)
        g.append(f"[{n}]aformat=sample_rates=44100:channel_layouts=stereo,volume={vol},adelay={d}|{d}[e{k}]")
        labels.append(f"[e{k}]"); n += 1
g.append("".join(labels) + f"amix=inputs={len(labels)}:normalize=0:duration=first,alimiter=limit=0.95,"
         f"loudnorm=I=-16:TP=-1.5:LRA=7,apad=whole_dur={T},atrim=0:{T}[out]")
subprocess.run(["ffmpeg", "-y", "-v", "error", *inputs, "-filter_complex", ";".join(g), "-map", "[out]", "-ar", "44100", a.out], check=True)
r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", a.out, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True)
print([l.strip() for l in r.stderr.splitlines() if l.strip().startswith(("I:", "Peak:"))], "->", a.out)
