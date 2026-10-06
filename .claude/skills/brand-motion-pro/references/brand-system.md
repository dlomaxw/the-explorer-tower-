# Brand system: one project, one identity

The single most important rule of this skill: **every film is built from its own brand definition, and from nothing
else.** Colours, fonts, logo, tone of voice, even the shape language come from `<project>/brand.json`. A film for client B
must never contain a colour, a typeface, a logo, a phrase or an image that belongs to client A, and it must never
fall back on "my usual look".

## 0. The gate (no film starts without it)

1. One folder per film at the repository root: `<project>/`. Its `brand.json` is the only source of identity.
2. No `brand.json` for THIS client yet → run the intake below. Do not start from another project's folder, do not copy
   its `frame.md`, tokens, fonts or assets, do not "adapt" the sample brand.
3. `scripts/brand-init.py` refuses a `brand.json` that is marked `_example` or `_draft`.
4. `scripts/brand-lint.py <project>` runs before every render and fails on: a colour that is not a brand colour, a
   font that is not a brand font, tokens out of date with `brand.json`, another brand's name in the text
   (`forbidden_names`). Set `forbidden_names` to the names of the other brands/projects in the same workspace.

## 1. Intake: get the identity from the client, not from taste

Ask once, in one structured message (skip what the user already gave; never ask for a key or a password):

| Need | Why | Accept |
|---|---|---|
| Logo, full and mark, light and dark versions | the logo is the ground truth of the brand colour and the transition object | SVG > PNG with transparency > a screenshot (last resort, say so) |
| Brand colours (hex), and which is primary / accent | binds every colour decision | a guideline PDF, a hex list, or a website/repo to extract from |
| Fonts (families + weights) and where they are licensed | binds every type decision | OFL fonts (Google Fonts via `@fontsource`) or licensed woff2 files the client supplies |
| Tone of voice, language, forbidden words | script and subtitles | 3 adjectives + an example sentence the client likes |
| Approved claims and contact details | no invented facts | the site content, a fact sheet |
| Do-nots | negative list | competitors' names, clients who must not appear, imagery rules |

**Extraction when the client has a website or repo** (it usually does):
`python3 scripts/brand-extract.py <site-or-repo-dir> --logo <logo.png> --name "Client"` counts the colours and fonts the
source really uses, ignores third-party widget colours (WhatsApp green, Facebook blue...) and writes a
`brand.draft.json` marked `"_draft": true`. The **logo's own colours win** over CSS frequency. A draft is a proposal:
show it to the user, fix it, then delete the `_draft` line.

Source priority when they disagree: brand guideline > logo files > the live website CSS > what the existing marketing
looks like > your assumption (never; ask).

## 2. `brand.json`

```json
{
  "name": "Client Name",
  "tagline": "approved tagline",
  "colors": { "primary": "#...", "secondary": "#...", "accent": "#...", "ink": "#...", "bg": "#...", "surface": "#..." },
  "fonts": {
    "display": { "family": "Family", "weights": [800], "source": "fontsource:family-slug", "display_weight": 800 },
    "body":    { "family": "Family", "weights": [500, 700], "source": "fontsource:family-slug" }
  },
  "logo": { "full": "assets/img/logo-full.png", "mark": "assets/img/mark.png" },
  "radius": 28,
  "format": { "width": 1920, "height": 1080, "fps": 30 },
  "forbidden_names": ["Other Client", "Other Project"]
}
```
`primary`, `secondary`, `accent`, `ink`, `bg`, `surface` drive everything; `ink-soft`, `line`, `on-primary`, `on-accent` are
derived with a contrast check (WCAG 4.5:1 text, 3:1 large text/icons) and printed by `brand-init.py`. A required pair
that fails is a brand problem to raise with the client (e.g. a pale accent on white), not something to hide.
Licensed fonts: `"source": "files"` and `"files": {"700": "BrandSans-Bold.woff2"}`; the woff2 goes in `assets/fonts/`.

`python3 scripts/brand-init.py <project> brand.json` writes `assets/brand/tokens.css` (the `--mk-*` variables),
`assets/fonts.css`, the brand-locked `frame.md`, and copies the motion kit. From then on **write `var(--mk-primary)`,
never `#0b5fff`**. A new client = a new `brand.json`, and the whole film re-skins.

## 3. Using the identity well

* **Colour roles (60/30/10)**: `bg`/`surface` ≈ 60 %, `ink` and `primary` ≈ 30 %, `accent` ≈ 10 % and no more. The
  accent is rationed: the key-word box of a sentence, the one CTA, a peak stroke. If everything is accent, nothing is.
* **Typography**: two families at most (often one family, two weights). A fixed scale (display 120-140, headline 72-84,
  subtitle 52, UI 34, micro 22 with 0.22 em tracking for 1080p; scale for other canvases). Tabular numerals on every
  number. Never a font that is not in `brand.json`, never `system-ui` as a visible face.
* **Logo**: use the supplied files only. Never recolour, stretch, outline, add effects or redraw from a screenshot.
  Keep clear space equal to the height of the mark's main shape. Reveal it by drawing/revealing the real shape, then hold
  it still. If the client supplies an SVG, `MK.draw` can draw it on; if only a PNG exists, reveal it with
  `MK.photo`/`MK.window` instead of pretending to trace it.
* **Shape language**: take the radius, stroke weight and corner style from the logo (a squared logo wants small radii;
  a rounded one wants large radii). Put it in `radius`. Keep one stroke weight for all frames and icons.
* **Imagery**: only the client's real photos/footage, product shots and renders. No stock people standing in for the
  client, no invented testimonials, prices, certifications or counts. Everything on screen is traceable to the brand source.
* **Voice**: the client's tone and language. Numbers and URLs spelled the way they are spoken in the voice script.
* **Missing font licence**: never substitute silently. Propose the closest OFL alternatives (with a visual
  comparison) and wait for approval; record the choice in `brand.json`.

## 4. Several brands in one workspace

Each in its own folder with its own `brand.json`, `assets/`, `frame.md`, voice and music. Shared things allowed: the skill,
the motion kit (it is brand-neutral), the pinned CLI. Not shared: tokens, fonts, logos, copy, imagery, voice, sfx choices
that carry meaning. Before delivering, run `brand-lint.py` and open the contact sheet asking one question: "could this
frame belong to anyone else?" If yes, the brand is not expressed strongly enough (shapes, colour use, type, the logo-derived
transition object).
