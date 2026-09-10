# Explorer Towers — public website

The build described in `Explorer_Towers_Website_CRM_Specification.docx`: the full
public site, inquiry capture that persists a lead before telling anyone it
succeeded, and the CRM behind it — authentication, six roles, the twelve-stage
pipeline, tasks and an audit trail, on Cloudflare D1.

Bookings, marketing operations, reporting and the provider integrations
(spec §§7–11) are **not** built yet — see [What comes next](#what-comes-next).

---

## Running it

```bash
npm --prefix site install
npm --prefix site run dev
```

Then open http://localhost:3000 (Next picks the next free port if 3000 is taken).
The CRM is at `/admin`; with no account yet, that redirects to `/admin/setup`.

Configuration lives in `site/.env.local`, which is gitignored and therefore not
in the repo. Recreate it from `site/.env.example`.

```bash
npm --prefix site run build    # production build
npm --prefix site run lint     # eslint, including the React Compiler rules
npx --prefix site tsc --noEmit # type check
```

Requires Node 20.9+; built against Node 24 and Next.js 16 (Turbopack, React 19).

---

## Layout

```
content/                    supplied stills and the logo PDF — the masters
3bedroom render video/      supplied 3-bedroom walkthrough masters
exterior video animation/   supplied 4K exterior masters
tools/                      asset pipeline (see below)
site/                       the Next.js app
  src/content/              the content layer — everything the pages render
  src/components/           UI
  src/lib/                  validation, lead storage, hooks
  public/media/             generated delivery assets (do not hand-edit)
```

Source media is never edited in place. Everything under `site/public/media/` is
produced by the scripts in `tools/` and can be deleted and rebuilt.

---

## Asset pipeline

Run in this order after new media is supplied:

```bash
python tools/sync-assets.py      # stills → public/media, trims letterboxing
python tools/encode-video.py     # 4K masters → 1080p variants + posters
python tools/build-scrub-reel.py # joins clips into the scroll-scrubbed reel
python tools/extract-logo.py     # logo PDF → SVG path (only if the logo changes)
```

`encode-video.py` needs ffmpeg: `python -m pip install imageio-ffmpeg`.

What this buys: the supplied exterior masters are 4K at 35–55 Mbps. Delivered as
supplied, the film section alone would be 190 MB. After transcoding it is 25 MB,
and nothing is fetched until a visitor asks for it.

| | supplied | delivered |
|---|---|---|
| exterior clips (7) | 191 MB | 25 MB |
| 3-bed walkthroughs (6) | 61 MB | 24 MB |
| scrub reel | — | 34 MB |

### Why the scrub reel is 34 MB

It is 1920×1080, all-keyframe, and that is deliberate. An earlier build encoded
it at 960×540 to keep it to 7 MB, and it showed: the reel plays full-bleed on
desktop, so it was upscaled about 1.6× and the facade turned to mush.

Every frame is a keyframe so that a `currentTime` seek is exact and instant,
which is what makes the scrub feel attached to the scroll. That is expensive.
Short GOPs were measured as an alternative — keyint 6 and 12 — and saved only
about 25% on this material, which is high-motion at a low frame rate; not worth
giving up exact seeking. Dropping to 10 fps saved 4%, because with every frame a
keyframe each one costs the same.

The cost is contained rather than paid by everyone: the branch that fetches the
reel is desktop-and-motion-only and lazily mounted, so a phone never downloads a
byte of it, and the 1080p poster carries the section until it has buffered.

### The logo

`tools/extract-logo.py` pulls the mark out of
`content/Explorer Logos not original_260821_141622.pdf` as real vector geometry —
the goat and hill are PDF path operators, not a raster — and writes
`site/src/components/logo-path.ts`. That is what lets the mark draw itself: the
reveal strokes each contour with a dash offset running to zero, then the solid
fill inks in underneath.

The wordmark is set in Cormorant Garamond as a stand-in. The supplied PDF embeds
a subset of *The Seasons*; **the brand typeface still needs to be supplied and
licensed for web use** before launch. The file is also named "not original", so
the artwork itself needs confirming as the approved mark.

---

## The three tiers

The supplied logo comes in three colourways, and they carry the residence tiers:

| Tier | Ground | Line |
|---|---|---|
| Two-bedroom | white `#faf8f5` | gold `#8a5f1c` |
| Three-bedroom | forest `#2f4a17` | cream `#f7d7a2` |
| Penthouse | clay `#7a3f10` | cream `#f7d7a2` |

Setting `data-tier="penthouse"` on any container switches every accent inside it
— see the `[data-tier]` blocks in `src/app/globals.css`. The residence cards, the
detail pages and the cross-links all work off that one attribute.

---

## Motion

Four distinct pieces, all built to the same rules: native scroll only (no wheel
hijacking), opacity and transform only, and every one degrades to readable
content if JavaScript, motion or media is unavailable.

**Logo intro** (`logo-intro.tsx`) — the mark draws itself on arrival. Not a
loading gate: the page underneath is already rendered and interactive, the
overlay is `inert`, any interaction dismisses it, and it plays once per session.

**Opening sequence** (`opening-sequence.tsx`) — five approved stills crossfading
across one pinned 220vh track, with a 1.00–1.06 push-in. Stills only, deliberately:
spec §3 forbids faking a flythrough from unrelated images.

**Scroll journey** (`scroll-journey.tsx`) — the exterior-to-interior move, from
the street to the sky pool. Scroll position drives `video.currentTime` directly,
so it runs forward and backward exactly as fast as the visitor scrolls. This is
the enhancement §3 permits *because* matching approved footage now exists.

**Interior showcase** (`interior-showcase.tsx`) — the interiors read room by room
rather than residence by residence, with a frame that widens toward full bleed as
it crosses the viewport, and walkthrough clips where they exist.

### How each degrades

| Condition | What happens |
|---|---|
| No JavaScript | Poster stills, all copy, all links and forms work |
| `prefers-reduced-motion` | No intro, no pin, no scrub; stacked panels instead |
| Narrow screen | Same — and the 7 MB reel is never fetched |
| Video fails | Poster remains; captions and content unaffected |
| Reel fails to load | `onError` keeps the poster; nothing blanks |

Nothing plays on its own and nothing has sound. Film previews start on hover
where there is a hovering pointer, and on scroll-into-view where there is not.

---

## Content integrity

The spec is emphatic that unapproved facts must not be published, and this is
enforced in the type system rather than by discipline. Every releasable field is
`Publishable<T>` — either `approved(value)` or `pending("wording to show
instead")` — and `<Value>` renders whichever it is. There is no way to display a
price without deciding whether it is approved.

Currently `pending`, and needing the developer before launch:

- Developer legal and trading name (**the source calls this both Shoal Group and
  Gabonn Associates — this must be resolved**)
- Prices, payment terms, availability, schedule of areas and the area basis
- Storey count, total residences, tenure, expected completion
- Phone, WhatsApp, email, working hours
- The verified map pin (the address is approved; the pin is not, so no map is
  embedded and no journey times are invented)
- Brochure, floor plans, area schedule for download
- Privacy wording and retention periods

Two more places where the site declines to guess:

- **Progress** has no site photography, so it shows an empty state rather than
  renders standing in for construction. Every image site-wide is labelled
  *Render* by `<MediaKindBadge>`, driven by a required `kind` field.
- **The penthouse** is shown through the sky-pool and sectional renders, with a
  note saying so, because no penthouse interiors have been supplied.

---

## Inquiry capture

Four flows — inquiry, callback, meeting, site visit — through one form and one
endpoint, `POST /api/inquiries`.

What it does today:

- validates on the server, whatever the browser did
- requires a name plus at least one contact method; per-flow rules on top
- normalises email and phone before storing
- **writes the lead before returning success**, and returns a reference (`ET-260907-4DFE4`)
- collapses retries: a repeated `requestId` returns the original reference and
  writes no second row
- separates the service acknowledgement from optional marketing consent, and
  stores the consent notice version with the lead
- records first-touch campaign parameters and landing page, never personal data
- rate limits, and has a honeypot
- opens each lead at pipeline stage `01-new-inquiry`

Verified end to end: two identical submissions produced one row and one shared
reference; a submission with no contact method was rejected 422.

Storage is **Cloudflare D1** (database `explorer-towers`). A driver interface in
`src/lib/data/` chooses between D1 and a local SQLite file — set
`DATA_DRIVER=sqlite` to develop without writing to the shared database. The same
migrations run on either, tracked in a `schema_migrations` table and written to
be safe when two instances start at once.

Notification dispatch is deliberately absent rather than stubbed. Its place is
marked in the route handler, after the write, so a failed send can never lose a
saved lead.

---

## The CRM

At `/admin`, never linked from the public site, `noindex, nofollow`, and rendered
outside the public layout so no internal screen carries public navigation.

### Access control

The six roles from spec §7, expressed as capabilities rather than as role
comparisons scattered through the code:

| Role | Leads visible | Notable limits |
|---|---|---|
| System administrator | All | — |
| Bright manager | All | Cannot confirm a reservation or sale |
| Sales / inquiry agent | Assigned only | No audit, no users, no export |
| Content editor | None | Never reaches prospect contact data |
| Client approver | All | The only role that can confirm commercially |
| Client viewer | All | Read-only, and without contact details |

Two rules live in the data layer rather than at the call site: visibility becomes
a `WHERE` clause, so a screen that forgets to filter still cannot leak another
agent's records; and every capability is re-checked on the server. Navigation
hides what a role cannot do, but hiding is never what protects it.

**Verified against the live database.** Signed in as a sales agent, an unassigned
lead's URL returned 404 and the list showed nothing. That same lead was then
assigned to the agent and — with no other change — the URL returned 200 and the
list showed one row. That is acceptance test A07.

### The pipeline

All twelve stages from the proposal, each declaring the evidence its transition
requires. The prompt and the outcome list change with the selected stage, and the
rules are applied again server-side: a stage change with no note is refused
whether it arrives from the form or from a crafted post.

Three things the specification is specific about, implemented rather than implied:

- **Stage 11 remembers where it came from.** Follow-up can fall due at any point,
  so moving to it must not erase commercial progress; the lead can be handed back.
- **Stage 10 is the client's decision.** Only a role holding
  `leads:confirm-commercial` can record a reservation or sale. Bright can
  coordinate and record a position; it cannot mark an unconfirmed sale complete.
- **A logged call is not a verified call.** The timeline keeps what somebody
  recorded separate from what the system observed.

Skips and backward moves are permitted — the spec requires it — and each is
written to the audit trail with the person, the time and the before and after.

### Audit

Append-only. Nothing in the application updates or deletes an audit row, and the
screen offers no way to try.

## Accessibility and performance

Built to the §13 targets; **not yet formally tested against them.**

Done: keyboard operation throughout, visible focus rings, skip link, labelled
form errors tied by `aria-describedby`, alt text on every image, a real `<dialog>`
lightbox that traps focus and returns it to the thumbnail, reduced-motion
support everywhere, and no horizontal overflow at any width (verified at 375px
and 1440px).

Still required before launch: an audit against WCAG 2.2 AA, screen-reader
testing, and field/lab measurement of LCP, INP and CLS on the agreed device and
network profile. The Core Web Vitals numbers in the spec are targets that
implementation testing has to establish, and this build has not established them.

---

## Known limitations

Read these before deploying.

- **D1 batches are not atomic.** Cloudflare's REST API accepts either several
  statements with no parameters, or one statement with parameters — never both.
  Since no value is ever interpolated into SQL here, `batch()` runs statements in
  sequence. Callers order them so the row that matters lands first: a lead is
  written before its timeline entry, so a failure part-way leaves a real lead
  with a thin history rather than a lost enquiry. **The fix is to run D1 through
  a Workers binding**, whose `db.batch()` is a real transaction; only
  `src/lib/data/d1-driver.ts` changes.
- **MFA is not implemented.** Spec §12 requires it for privileged roles. Sessions
  are otherwise sound — scrypt hashes, hashed opaque tokens, server-side
  revocation, hard expiry — but this is a genuine gap, not an approximation.
- **The two Cloudflare tokens are not equivalent.** One carries D1 write; the
  other is read-only for D1 and fails any DDL or INSERT with error 7500 while
  still answering SELECTs. `.env.local` records which is which.
- The database holds **test data** from verification: two leads ("Amina Nakato",
  "Phone Test"), one sales-agent account, ~260 seeded page views and 83 events,
  one uploaded media asset, one content override (the sales phone number), and a
  `probe_t` table left by a permissions check. Clear these before handover.
- **The R2 credentials are not interchangeable either.** The `bf953882…` pair
  returns AccessDenied on this bucket; the `f6fdfcfe…` pair has write access.
- Only the contact page and footer read the CMS overlay so far. The resolver
  (`src/lib/content.ts`) covers every registered field, but the remaining public
  pages still import the coded defaults directly — wiring them is mechanical.
- `robots` is `noindex` in `layout.tsx`. **Remove that once the content is
  approved and the domain confirmed** — it is there so a staging deploy cannot be
  indexed carrying unapproved prices.
- The rate limiter is per-instance and in-memory.
- Next warns in development that the stacked journey images have `sizes="100vw"`
  while not rendered at full width. They are 100vw whenever that branch is
  visible; the warning comes from measuring it while CSS has it hidden.

---

## What comes next

Following the spec's own delivery sequence:

1. **Resolve the identity question** and the open inputs listed above. Several
   pages are written to show them the moment they arrive.
2. **Close the two CRM gaps above** — the Workers binding for atomic writes, and
   MFA for privileged roles.
3. **Bookings and meetings (§7)**, including the transactional capacity check
   that acceptance test A06 exercises.
4. **Marketing operations and approvals (§8)** — the content calendar, versioned
   approval, and the rule that editing approved artwork invalidates its approval.
5. **Reporting (§9)** and the CMS, so `src/content/` can be swapped for
   CMS-backed loaders behind the same types.
6. **Integrations (§11)** with the fallbacks the spec requires — each one has to
   be demonstrated, not merely configured.

### Acceptance tests (§13)

| Test | Status |
|---|---|
| A01 Public navigation | Holds — every route, no overflow at 375px or 1440px |
| A02 Animation | Holds — pin, reverse, mobile, reduced motion, media failure |
| A03 CMS | Not built |
| A04 Lead capture | Holds — one row per submission, retry-safe, 422 with no contact |
| A05 CRM | Partly — assign, note, stage, task and search verified; export not built |
| A06 Bookings | Not built |
| A07 Permissions | Holds — verified by flipping assignment on the live database |
| A08 Approvals | Not built |
| A09 Reporting | Not built |
| A10 Recovery | Not built |

---

## Going live on www.explorertower.ug

The domain is attached to the Vercel project and the apex-to-www redirect is in
`next.config.ts`. Two things remain, in this order.

### 1. Point DNS at Vercel

At the `.ug` registrar, either set both records:

| Type | Name | Value |
|---|---|---|
| A | `explorertower.ug` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

or delegate the whole zone to `ns1.vercel-dns.com` and `ns2.vercel-dns.com`.

A CNAME is preferred for `www` over the A record Vercel suggests: it follows
Vercel's own address if that ever changes. The apex has to be an A record,
because CNAME is not allowed at a zone apex.

Vercel verifies automatically and issues the certificate. Check with:

```bash
npx vercel domains inspect www.explorertower.ug
```

### 2. Switch the canonical URL

**Only once DNS resolves.** `SITE_URL` currently points at the Vercel address,
deliberately: canonical tags and the sitemap must not advertise a host nobody
can reach, which is what would happen if this were switched early.

```bash
npx vercel env rm SITE_URL production --yes
printf 'https://www.explorertower.ug' | npx vercel env add SITE_URL production
npx vercel deploy --prod
```

Then confirm the swap took:

```bash
curl -s https://www.explorertower.ug/robots.txt
curl -sI https://explorertower.ug/ | grep -i location
```

The first should name the new sitemap host, the second should show a 308 to
`https://www.explorertower.ug/`.

### 3. Tell Google the site moved

The Vercel address is already indexed. After the switch, add
`www.explorertower.ug` in Google Search Console and submit
`https://www.explorertower.ug/sitemap.xml`. The canonical tags will do most of
the work, but the sooner the new host is submitted the less time the old one
spends competing with it.
