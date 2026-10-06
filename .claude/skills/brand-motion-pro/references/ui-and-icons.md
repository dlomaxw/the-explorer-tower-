# Animated UI and icons

Product/UI scenes make an animation read as *a real product*: charts that fill, numbers that roll, a toggle that
flips, a toast that slides in, a cursor that clicks. Build them from kit parts so they inherit the brand tokens.

## Parts (all brand-driven, in `assets/vendor/motion-kit.css`)

| Part | Class / builder | Animate with |
|---|---|---|
| Card (surface, radius, shadow) | `.mk-card`, `.mk-card-brand`, `.mk-glass` | `MK.reveal`, `MK.tilt` |
| Chip / badge | `.mk-chip`, `.mk-badge` | `MK.reveal(..., {stagger})` |
| Button (accent) / primary button | `.mk-btn`, `.mk-btn-primary` | `MK.cursor` + `MK.press` + `MK.sweep` |
| Toggle, progress, toast | `.mk-toggle`, `.mk-progress`, `.mk-toast` | `MK.toggle`, `MK.progress`, `MK.toast` |
| Icon tile | `MK.tile(id, icon, label)` | `MK.drawIcon` (+ tile pop) |
| Phone / browser shell | `MK.phone(id, inner)`, `MK.browser(id, url, inner)` | `MK.tilt`, `MK.float`, footage inside (see video-scenes.md) |
| Bars, ring gauge | `.mk-bar-col`, `.mk-ring-fill` | `MK.bars`, `MK.ring` |
| Numbers | any element | `MK.count(tl, sel, at, dur, from, to, {sep, suffix, decimals})` |
| Typed text | any element | `MK.type` |
| Cursor + ripple | `.mk-cursor`, `.mk-ripple` | `MK.cursor` (one curved move, then a click) |

Scene recipe (what the demo does): container reveals (0.5 s) → chart bars grow (0.7 s, stagger 0.07) → ring fills while its
number rolls (1.1 s) → list rows slide in (stagger 0.12) → icon tiles pop and draw → a toast confirms the result. Order and
stagger carry the story; keep each scene to **one** hero element and 2-3 supporting ones.

## Icons

`assets/vendor/icons.js` ships 32 original 24-grid stroke icons (phone, mail, pin, clock, check, shield, star, arrow, play,
home, building, key, bolt, chart, bars, user, users, gear, search, globe, calendar, tool, truck, lock, heart, layers, cube,
spark, send, download, bell, card). `MK.icon(name, {size, stroke, color})` returns an `<svg>`; **set the colour from a
token** (`color: var(--mk-primary)` on the parent, icons use `currentColor`).

* One stroke weight for the whole film (1.7-2 at 24 grid), round caps, match the logo's stroke character.
* Always draw icons on (`MK.drawIcon`): stroke draws 0.55 s, tile pops (scale .8 → 1) as the stroke starts.
* Need an icon that does not exist? Draw it on the same 24 grid with the same stroke rules, add it to `MK_ICONS` in the
  project's copy of `icons.js`. Do not paste artwork from other icon sets unless its licence allows it and the client
  agrees, and never fill icons with colours outside the palette.
* Brand pictograms (the client's own symbols) come from the client's files, drawn on with `MK.draw` if vector.

## UI content rules

* Real content only: real product names, real numbers the client approved, real routes/places. Placeholder UI text that
  looks like data must be obviously illustrative or taken from the brand source; never invent statistics, customers,
  testimonials or prices.
* Realistic UI proportions: touch targets ≥ 44 px at phone scale, body text ≥ 24 px at 1080p so it reads when compressed.
* Light UI on a dark scene (or the reverse) separates the device from the ground; add the brand shadow token, not a new one.
* A chart must show a believable relation (bars ordered by time, one highlighted in the accent) not random heights.

## Cursor and click

`MK.cursor(tl, "#cur", from, to, at, dur, "#ripple")` arrives in one curved move (x eases out, y eases in-out), presses
(scale .85, 0.06 s), springs back, and fires the ripple; it returns the click time, on which you call `MK.press` for the
button and trigger the result (a sweep, a toast, the next scene). The cursor never hesitates or wanders.
