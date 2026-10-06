# brand-motion-pro

A Claude Code skill for professional, **brand-locked** motion design films: each project is built in its own identity
(logo, colours, fonts, tone from a per-project `brand.json`, enforced by a linter), with animated UI mockups, charts, rolling
numbers, drawn-on icons, 2D layers, CSS 3D depth and video footage scenes, voice + music + sound effects, delivered as MP4.

## Use it anywhere

```bash
# user-wide: every project on this machine
bash install.sh
# or only inside one repository (commit .claude/skills/brand-motion-pro to share it)
cd my-repo && bash /path/to/brand-motion-pro/install.sh --project
```
Or unzip `brand-motion-pro.zip` into `~/.claude/skills/` (user-wide) or `<repo>/.claude/skills/` (project).
Then, in Claude Code: *"Use the brand-motion-pro skill to make a 40 s launch film for <client>. Here is the logo and the brand colours / the website is <url>."*

Requirements: node 20+, npm, python3, ffmpeg. Optional: `pip install pocketsphinx pillow`.

## Try it (no client needed)

```bash
bash examples/demo-northwind/build.sh /tmp/demo       # builds, lints and checks a 16 s demo (fictional brand)
cd /tmp/demo && npx hyperframes render -q draft -o renders/demo.mp4
```
`examples/demo-northwind/reskin-proof-casements-identity.jpg` shows the SAME film re-skinned by swapping only `brand.json`.

## The idea in four lines

1. `brand.json` per project → tokens (`--mk-*`), fonts, frame spec. Never reuse another client's look (`brand-lint.py` fails the build).
2. A brand-neutral motion kit (`MK.*`) animates cards, charts, icons, devices, 3D tilt, parallax, footage and subtitles from those tokens.
3. Gates: brand → script → voice → storyboard → build → checks → render.
4. Scripted guards (`brand-lint`, `comp-lint`, `hyperframes check`, `seam-check`) catch the traps before a render is wasted.

Start with `SKILL.md`.
