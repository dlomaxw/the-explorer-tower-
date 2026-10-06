# Pitfalls that cost real hours (all found building real films)

Run `python3 scripts/comp-lint.py <project>` and `hyperframes check` to catch most of these automatically.

| Symptom | Cause | Fix |
|---|---|---|
| `check_runtime_failure: r.pause is not a function`, composition dead, no clue | a script tag (even in a comment or string) inside a vendored/inlined script; the bundler parses the text | never write script tags in script text; describe in words |
| Code behaves differently after bundling | dollar-dollar / dollar-quote / dollar-ampersand in an inlined script mangled by `String.replace` | no `$` helpers: use `qs()`/`qsa()` |
| Fonts 404 in check, text in a fallback face | `@font-face` urls resolve relative to the **CSS file**; `../fonts/` is also flagged (parent traversal) | keep `fonts.css` in `assets/` and use `url("fonts/x.woff2")` |
| Blank page, GSAP missing | GSAP from a CDN (blocked in sandboxes and offline renders) | vendor `gsap.min.js` in `assets/vendor/` (setup does it) |
| `timeline_id_mismatch` | `window.__timelines[id]` differs from the root `data-composition-id` | same id in both |
| Element visible on frame 0 although hidden "at 0" | `tl.set(.., {opacity:0}, 0)` does not render at playhead 0 | `gsap.set` / `MK.hide` / CSS `opacity:0` |
| Element invisible in the render but fine in preview | `fromTo` hides in the from-vars and never says `opacity:1` in the to-vars; cold workers restore the authored state | explicit `opacity:1` in every reveal's destination |
| `gsap_css_transform_conflict` | CSS `transform:scaleX(0)` plus a GSAP `to` tween on scaleX | remove the CSS transform and use `fromTo` (or `gsap.set`) |
| Elements flash at the wrong time | `fromTo` after t=0 without `immediateRender:false` | add it (the kit does) |
| Layout drifts / jitter | tweening width/height/top/left/letterSpacing | tween transforms only |
| Video frames wrong or the clip vanishes | `<video data-start>` inside another element with `data-start` | scene wrappers have no `data-start` |
| Video silent/odd | audio on the `<video>` or no `id` on the `<audio>` | muted video + separate `<audio id=..>` |
| Heavy artefacts, slow render | blur on an element > ~1800 px, many simultaneous blurred layers | cap at 18 px, split big layers into tiles under the scrim |
| `content_overlap` between a big number and its label | glyph box is ~1.22 × font-size | give the label `margin-top` ≥ 0.3 × the number's size |
| Contrast warning on a key word | the accent box is a sibling, the checker only reads ancestors | put the subtitle on a light surface (card/scrim) so ink on surface passes, accent box on top |
| `invalid_parent_traversal_in_asset_path` | `../` in an asset url | keep assets under the project root |
| Seams jump between independently built frames | each builder invented its own start state | write `handoff_in/out` (camera, blur, objects, text) in the storyboard and run `seam-check.sh` |
| Subtitle still on screen at a cut | exit scheduled at the seam instead of ≥ 0.1 s before | subtitles leave 0.1-0.2 s before the seam |
| Words trail the voice | cue = spoken time, rendered late | appear 0-2 frames **before** the spoken time; `retime-voice.py` keeps late ≤ 0.03 s |
| Wrong number/name in the voice after a re-take | takes differ | decode the critical phrase before building |
| Photos by filename look wrong | workers pick images they have never opened | open every image (or a contact sheet) before using it; never judge a photo by its name |
| Brand leaks between projects | copied tokens/fonts/frames from another client | one `brand.json` per project, `brand-lint.py` with `forbidden_names` |
| Chat/e-mail refuses the render | 40 MB+ file | `scripts/compress.sh in.mp4 out.mp4` (CRF ladder to < 28 MB) |
| `rm -rf *` after `cd` blocked by the safety check | relative glob after a directory change | delete by explicit path, or do not delete (new directories are empty anyway) |
| Backgrounded render cancelled | launched in a subshell that exited | run it with the tool's background mode and wait for its notification |
