/**
 * Approved content for the Explorer Towers public site.
 *
 * Source imagery: `content/` in the project root, copied to `public/media/`
 * by `tools/sync-assets.py`. Every still supplied so far is an architectural
 * render, so `kind` is "render" throughout — no item claims to be site
 * photography until real photographs are handed over.
 *
 * Fields flagged `pending()` are the §14 "open inputs before launch" list.
 * They render as an approved alternative, never as a plausible guess.
 */
import {
  approved,
  pending,
  type Amenity,
  type AnimationScene,
  type Download,
  type Film,
  type InteriorRoom,
  type FaqSection,
  type Media,
  type ProgressUpdate,
  type ProjectFact,
  type VideoClip,
  type Publishable,
  type ResidenceType,
} from "./types";

const EXT = { width: 1834, height: 1024 } as const;
const EXT_TRIMMED = { width: 1379, height: 1024 } as const;
/** Delivery variants are all normalised to 1080p by `tools/encode-video.py`. */
const WALK = { width: 1920, height: 1080 } as const;
const INT = { width: 1672, height: 941 } as const;

// ---------------------------------------------------------------------------
// Identity
// ---------------------------------------------------------------------------

/**
 * Spec "Basis and scope": the source filename says Shoal Group, the proposal
 * cover says Gabonn Associates. Explorer Towers is the working project title
 * until the legal entity and public developer name are confirmed.
 */
export const identity = {
  projectName: "Explorer Towers",
  /** Text form of the mark, for accessible names and page titles. */
  wordmark: "EXPLORER",
  /**
   * Confirmed by the client. This resolves the question the specification
   * raised in "Basis and scope": the source filename said Shoal Group while
   * the proposal cover said Gabonn Associates. Neither was the answer — the
   * developer is 969 Development Company Limited, and Shoal Group appears
   * alongside it as the second party on the approved lockup.
   */
  developer: approved("969 Development Company Limited") as Publishable<string>,
  tagline: "Curved-balcony residences above Kampala",
  /*
   * Confirmed by the client. Not yet the canonical URL: SITE_URL still
   * points at the Vercel address until DNS for this domain resolves, so
   * canonicals and the sitemap cannot advertise a host nobody can reach.
   */
  domain: approved("www.explorertower.ug") as Publishable<string>,
};

/**
 * The approved developer lockup.
 *
 * The two marks were supplied as one piece of artwork and are used as one:
 * `tools/build-developer-lockup.py` only trims the white ground, so the pairing,
 * spacing and proportions are exactly as delivered. Never separate them, put
 * anything between them, or reorder them.
 *
 * The Shoal block is dark with reversed type, so on a dark background the
 * lockup sits on a light plate rather than being recoloured.
 */
export const developerLockup = {
  src: "/media/brand/developers.png",
  width: 847,
  height: 295,
  alt: "Shoal Group and 969 Development",
  /** Both parties, in the order the artwork sets. */
  parties: ["Shoal Group", "969 Development Company Limited"],
} as const;

export const contact = {
  address: approved(
    "Plot 37 John Babiha (Acacia) Avenue, Kampala, Uganda",
  ) as Publishable<string>,
  phone: approved("+256 750 421224") as Publishable<string>,
  whatsapp: approved("+256 750 421224") as Publishable<string>,
  email: approved("brightthoughtsservices@gmail.com") as Publishable<string>,
  hours: approved("9:30am to 7:00pm") as Publishable<string>,
  /**
   * Confirmed by the client from a dropped Google Maps pin. Kampala sits just
   * north of the equator, so the latitude is a small positive number — that is
   * correct, not a truncated value.
   */
  coordinates: approved({
    lat: 0.3281903,
    lng: 32.5870894,
  }) as Publishable<{ lat: number; lng: number }>,
};

/** Digits only, for `tel:` and `wa.me` links. */
export const contactDigits = {
  phone: "256750421224",
  whatsapp: "256750421224",
} as const;

/**
 * Marketing and lead generation are run by Bright Properties, credited on the
 * site as the marketing agent — distinct from the developer, who is credited
 * with the approved lockup.
 */
export const marketingAgent = {
  /** The brand on the supplied logo. */
  name: "Bright Properties",
  /**
   * The entity behind the brand, as it appears on the proposal, the Google
   * Maps listing and the contact address. Both names are shown where the
   * office is given, so a visitor looking for the office finds the right sign.
   */
  legalName: "Bright Thoughts Services",
  role: "Marketing by",
  logo: "/media/brand/bright-properties.png",
  office: {
    address: "8JC3+CPM, Third St, Kampala",
    coordinates: { lat: 0.3210625, lng: 32.6043125 },
    mapsUrl: "https://maps.app.goo.gl/xsXVLDhs34NdPCdX7",
  },
} as const;

// ---------------------------------------------------------------------------
// Media library
// ---------------------------------------------------------------------------

export const media = {
  streetGoldenHour: {
    src: "/media/exterior/street-golden-hour.png",
    ...EXT,
    alt: "Explorer Towers seen from the street at golden hour, its stacked curved balconies wrapping the corner of the tower.",
    caption: "Street approach, golden hour",
    kind: "render",
    category: "exterior",
    focal: "50% 45%",
  },
  frontElevationDusk: {
    src: "/media/exterior/front-elevation-dusk.png",
    ...EXT,
    alt: "Front elevation of Explorer Towers at dusk, with planted balcony edges and warm interior light across every floor.",
    caption: "Front elevation, dusk",
    kind: "render",
    category: "exterior",
    focal: "50% 42%",
  },
  cornerEvening: {
    src: "/media/exterior/corner-evening.png",
    ...EXT,
    alt: "Corner view of Explorer Towers after sunset, balcony edges picked out in continuous lines of light.",
    caption: "Corner view, evening",
    kind: "render",
    category: "exterior",
    focal: "50% 45%",
  },
  cornerDaylight: {
    src: "/media/exterior/corner-daylight.png",
    ...EXT,
    alt: "Explorer Towers in daylight, showing the full height of the curved balcony stack and the cantilevered roof blade.",
    caption: "Corner view, daylight",
    kind: "render",
    category: "exterior",
    focal: "50% 45%",
  },
  sectionCutawayDusk: {
    src: "/media/exterior/section-cutaway-dusk.png",
    ...EXT,
    alt: "Cutaway section of Explorer Towers at dusk, showing lit apartments floor by floor around the suspended penthouse pool.",
    caption: "Sectional study, dusk",
    kind: "render",
    category: "exterior",
    focal: "50% 45%",
  },
  arrivalPodium: {
    src: "/media/exterior/arrival-podium.png",
    ...EXT_TRIMMED,
    alt: "The arrival level beneath Explorer Towers, with a covered drop-off, a glazed fitness room above and parking beyond.",
    caption: "Arrival and podium level",
    kind: "render",
    category: "exterior",
    focal: "50% 50%",
  },
  skyPoolTerrace: {
    src: "/media/amenities/sky-pool-terrace.png",
    ...INT,
    alt: "A swimmer rests at the infinity edge of the penthouse pool at dusk, looking out over the lights of Kampala.",
    caption: "The penthouse pool, dusk",
    kind: "render",
    category: "amenities",
    focal: "45% 50%",
  },
  skyPoolFacade: {
    src: "/media/amenities/sky-pool-facade.png",
    ...INT,
    alt: "The penthouse pool seen from outside the building, cantilevered between floors with residences visible above and below.",
    caption: "The penthouse pool, suspended in the facade",
    kind: "render",
    category: "amenities",
    focal: "50% 50%",
  },
} as const satisfies Record<string, Media>;

const threeBed = {
  entranceHall: {
    src: "/media/residences/3-bed/entrance-hall.png",
    ...INT,
    alt: "Three-bedroom entrance hall looking through to the living and dining rooms, with a console table and a stone feature wall.",
    caption: "Three-bedroom · entrance hall",
    kind: "render",
    category: "interior",
  },
  living: {
    src: "/media/residences/3-bed/living.png",
    ...INT,
    alt: "Three-bedroom living room with a curved sectional sofa, brass ring chandelier and floor-to-ceiling curved glazing over the city.",
    caption: "Three-bedroom · living room",
    kind: "render",
    category: "interior",
    focal: "55% 50%",
  },
  dining: {
    src: "/media/residences/3-bed/dining.png",
    ...INT,
    alt: "Three-bedroom dining area seating ten at a stone table, opening into the living room and the balcony beyond.",
    caption: "Three-bedroom · dining",
    kind: "render",
    category: "interior",
  },
  kitchen: {
    src: "/media/residences/3-bed/kitchen.png",
    ...INT,
    alt: "Three-bedroom kitchen with a veined stone island, breakfast seating, walnut joinery and integrated ovens.",
    caption: "Three-bedroom · kitchen",
    kind: "render",
    category: "interior",
  },
  principalBedroom: {
    src: "/media/residences/3-bed/principal-bedroom.png",
    ...INT,
    alt: "Three-bedroom principal suite with an upholstered headboard wall, curved corner glazing and a lit walk-in dressing room.",
    caption: "Three-bedroom · principal suite",
    kind: "render",
    category: "interior",
  },
  principalBathroom: {
    src: "/media/residences/3-bed/principal-bathroom.png",
    ...INT,
    alt: "Three-bedroom principal bathroom with a freestanding stone bath by the window, a walk-in rain shower and a twin vanity.",
    caption: "Three-bedroom · principal bathroom",
    kind: "render",
    category: "interior",
  },
  guestBedroom: {
    src: "/media/residences/3-bed/guest-bedroom.png",
    ...INT,
    alt: "Three-bedroom guest suite with fitted walnut wardrobes, a writing desk, balcony access and an en-suite shower room.",
    caption: "Three-bedroom · guest suite",
    kind: "render",
    category: "interior",
  },
} as const satisfies Record<string, Media>;

const twoBed = {
  living: {
    src: "/media/residences/2-bed/living.png",
    ...INT,
    alt: "Two-bedroom living room with a curved sofa facing the balcony, kitchen and dining beyond in one open plan.",
    caption: "Two-bedroom · living room",
    kind: "render",
    category: "interior",
    focal: "50% 50%",
  },
  dining: {
    src: "/media/residences/2-bed/dining.png",
    ...INT,
    alt: "Two-bedroom dining area with an oval stone table for eight, framed artwork and the living room behind.",
    caption: "Two-bedroom · dining",
    kind: "render",
    category: "interior",
  },
  kitchen: {
    src: "/media/residences/2-bed/kitchen.png",
    ...INT,
    alt: "Two-bedroom open kitchen with a long stone island and breakfast stools, looking through to the balcony.",
    caption: "Two-bedroom · kitchen",
    kind: "render",
    category: "interior",
  },
  principalBedroom: {
    src: "/media/residences/2-bed/principal-bedroom.png",
    ...INT,
    alt: "Two-bedroom principal suite with curved corner glazing onto a furnished balcony and an en-suite bathroom alongside.",
    caption: "Two-bedroom · principal suite",
    kind: "render",
    category: "interior",
  },
  principalBathroom: {
    src: "/media/residences/2-bed/principal-bathroom.png",
    ...INT,
    alt: "Two-bedroom principal bathroom with a freestanding bath, a walk-in rain shower and a twin stone vanity.",
    caption: "Two-bedroom · principal bathroom",
    kind: "render",
    category: "interior",
  },
  secondBedroom: {
    src: "/media/residences/2-bed/second-bedroom.png",
    ...INT,
    alt: "Two-bedroom second bedroom with fitted wardrobes, a dressing table and an en-suite shower room.",
    caption: "Two-bedroom · second bedroom",
    kind: "render",
    category: "interior",
  },
} as const satisfies Record<string, Media>;

// ---------------------------------------------------------------------------
// Opening sequence (spec §3)
// ---------------------------------------------------------------------------

/**
 * Five scenes across one pinned sequence. The first is painted immediately as
 * the poster; the rest crossfade on scroll. Stills only — a continuous
 * exterior-to-interior camera move needs matching approved footage, and spec
 * §3 forbids fabricating one from unrelated stills.
 */
export const animationScenes: readonly AnimationScene[] = [
  {
    id: "arrival",
    media: media.streetGoldenHour,
    mobileFocal: "50% 38%",
    kicker: "Acacia Avenue, Kampala",
    heading: "Explorer Towers",
    body: "Curved-balcony residences with the city on every horizon.",
    zoomTo: 1.06,
  },
  {
    id: "elevation",
    media: media.frontElevationDusk,
    mobileFocal: "50% 40%",
    kicker: "The facade",
    heading: "One curve, carried the full height",
    body: "Every balcony edge is drawn as a single unbroken line — planted at the corners, lit along its length.",
    zoomTo: 1.04,
  },
  {
    id: "podium",
    media: media.arrivalPodium,
    mobileFocal: "45% 45%",
    kicker: "Arrival",
    heading: "A covered arrival, a glazed gym above",
    body: "Residents arrive beneath the podium, with the fitness room and pool deck suspended overhead.",
    zoomTo: 1.05,
  },
  {
    id: "interior",
    media: threeBed.living,
    mobileFocal: "55% 50%",
    kicker: "Inside",
    heading: "Rooms that follow the curve",
    body: "Living spaces open along the full sweep of the glazing, framing the escarpment and the skyline.",
    zoomTo: 1.05,
  },
  {
    id: "pool",
    media: media.skyPoolTerrace,
    mobileFocal: "42% 50%",
    kicker: "Above",
    heading: "A pool suspended in the facade",
    body: "Cantilevered between floors, edged to the horizon.",
    zoomTo: 1.04,
  },
];

// ---------------------------------------------------------------------------
// Residences
// ---------------------------------------------------------------------------

export const residences: readonly ResidenceType[] = [
  {
    slug: "two-bedroom",
    name: "Two-bedroom residence",
    shortName: "Two bedroom",
    bedrooms: 2,
    area: pending("Request the schedule of areas"),
    areaBasis: pending("Area basis to be confirmed"),
    price: approved("From USD 300,000"),
    availability: pending("Request current availability"),
    paymentPlan: pending("Request payment terms"),
    floorPlan: pending("Floor plan available on request"),
    summary:
      "Open living, dining and kitchen along the curved glazing, with two en-suite bedrooms and a balcony off the principal suite.",
    features: [
      "Open-plan living, dining and kitchen",
      "Curved floor-to-ceiling glazing to the living space",
      "Stone island kitchen with integrated appliances",
      "Two bedrooms, both en-suite",
      "Fitted walnut wardrobes and dressing table to the second bedroom",
      "Principal bathroom with freestanding bath and walk-in shower",
      "Private balcony",
    ],
    hero: twoBed.living,
    gallery: [
      twoBed.living,
      twoBed.dining,
      twoBed.kitchen,
      twoBed.principalBedroom,
      twoBed.principalBathroom,
      twoBed.secondBedroom,
    ],
  },
  {
    slug: "three-bedroom",
    name: "Three-bedroom residence",
    shortName: "Three bedroom",
    bedrooms: 3,
    area: pending("Request the schedule of areas"),
    areaBasis: pending("Area basis to be confirmed"),
    price: approved("From USD 400,000"),
    availability: pending("Request current availability"),
    paymentPlan: pending("Request payment terms"),
    floorPlan: pending("Floor plan available on request"),
    summary:
      "A private entrance hall opening to separate living and dining rooms along the curve, with a principal suite, dressing room and further en-suite bedrooms.",
    features: [
      "Private entrance hall",
      "Separate living and dining rooms along the curved glazing",
      "Stone island kitchen with breakfast seating and integrated ovens",
      "Principal suite with walk-in dressing room",
      "Principal bathroom with freestanding bath and twin vanity",
      "Further en-suite bedrooms with fitted joinery",
      "Balcony access from the principal rooms",
    ],
    hero: threeBed.living,
    gallery: [
      threeBed.entranceHall,
      threeBed.living,
      threeBed.dining,
      threeBed.kitchen,
      threeBed.principalBedroom,
      threeBed.principalBathroom,
      threeBed.guestBedroom,
    ],
  },
  {
    slug: "penthouse",
    name: "Six-bedroom penthouse",
    shortName: "Penthouse",
    bedrooms: 6,
    area: pending("Request the penthouse area schedule"),
    areaBasis: pending("Area basis to be confirmed"),
    price: pending("Price on application — talk to us"),
    availability: pending("Request current availability"),
    paymentPlan: pending("Request payment terms"),
    floorPlan: pending("Penthouse plan available on request"),
    summary:
      "Six bedrooms at the top of the building, with a swimming pool suspended in the facade and a private cinema room. The pool and the cinema belong to this residence alone.",
    /**
     * The pool and cinema are confirmed by the client. Everything else here is
     * what the approved renders actually show — the room-by-room schedule
     * follows once penthouse drawings are handed over.
     */
    features: [
      "Six bedrooms",
      "Private suspended swimming pool, cantilevered in the facade",
      "Private cinema room",
      "Full-width curved glazing to the principal rooms",
      "Views across Kampala on three sides",
    ],
    hero: media.skyPoolTerrace,
    gallery: [media.skyPoolTerrace, media.skyPoolFacade, media.sectionCutawayDusk],
    /**
     * Spec §2: no invented interiors. The penthouse is shown through the
     * approved pool and sectional renders until its own set is supplied — and
     * the cinema room has no render at all, so it is described, not pictured.
     */
    mediaNote:
      "Penthouse interiors have not yet been released. These images show the suspended pool and the sectional study; there is no render of the cinema room yet.",
  },
];

// ---------------------------------------------------------------------------
// Walkthrough clips (three-bedroom)
// ---------------------------------------------------------------------------

/**
 * Five-second walkthroughs of the three-bedroom residence. Each is paired with
 * a poster taken from the clip itself (`tools/make-posters.py`), so the still a
 * visitor sees before pressing play is the frame the video opens on.
 */
const clip = (
  index: number,
  alt: string,
  caption: string,
): VideoClip => ({
  src: `/media/residences/3-bed/walkthrough-${index}.mp4`,
  durationLabel: "5s",
  poster: {
    src: `/media/residences/3-bed/walkthrough-${index}.jpg`,
    ...WALK,
    alt,
    caption,
    kind: "render",
    category: "interior",
  },
});

const walkthroughs = {
  dining: clip(
    1,
    "Walkthrough of the three-bedroom dining room, panning past the round table towards the living room.",
    "Three-bedroom · dining walkthrough",
  ),
  balcony: clip(
    2,
    "Walkthrough of the three-bedroom balcony, moving along the outdoor dining setting with the city beyond the glass balustrade.",
    "Three-bedroom · balcony walkthrough",
  ),
  entrance: clip(
    3,
    "Walkthrough of the three-bedroom entrance hall, moving past the console and artwork towards the living rooms.",
    "Three-bedroom · entrance walkthrough",
  ),
  living: clip(
    4,
    "Walkthrough of the three-bedroom living room, sweeping across the curved sofa to the full-height glazing.",
    "Three-bedroom · living walkthrough",
  ),
  kitchen: clip(
    5,
    "Walkthrough of the three-bedroom kitchen, tracking along the stone island and breakfast seating.",
    "Three-bedroom · kitchen walkthrough",
  ),
  dressing: clip(
    6,
    "Walkthrough of the three-bedroom dressing room, passing the lit walnut wardrobes and glazed cabinetry.",
    "Three-bedroom · dressing room walkthrough",
  ),
} as const;

// ---------------------------------------------------------------------------
// Exterior films
// ---------------------------------------------------------------------------

/**
 * Five-second exterior clips supplied as 4K masters and delivered here as
 * 1080p variants with posters cut from the clips themselves
 * (`tools/encode-video.py`). Nothing plays until a visitor asks it to.
 */
const film = (
  index: number,
  id: string,
  title: string,
  alt: string,
): Film => ({
  id,
  title,
  clip: {
    src: `/media/exterior/film-${index}.mp4`,
    durationLabel: "5s",
    poster: {
      src: `/media/exterior/film-${index}.jpg`,
      ...WALK,
      alt,
      caption: title,
      kind: "render",
      category: "exterior",
    },
  },
});

export const films: readonly Film[] = [
  film(3, "street", "Street approach",
    "Looking up at Explorer Towers from the pavement at golden hour, the balcony stack rising above the trees."),
  film(6, "sunset", "The tower at sunset",
    "The full height of Explorer Towers seen across the road as the sun sets behind it."),
  film(2, "arrival", "Driving in",
    "Arriving by car, turning off the road and passing under the podium of Explorer Towers."),
  film(4, "podium", "Under the podium",
    "The covered arrival level, with residents crossing to the lobby and cars parked beneath the building."),
  film(5, "forecourt", "The forecourt at dusk",
    "The lit forecourt and drop-off beneath Explorer Towers after dark."),
  film(7, "facade", "Down the facade",
    "An aerial pass down the face of Explorer Towers, showing the penthouse pool suspended at the centre."),
  film(1, "pool", "The penthouse pool",
    "The infinity edge of the penthouse pool at dusk, with the lights of Kampala beyond."),
];

// ---------------------------------------------------------------------------
// Interior showcase
// ---------------------------------------------------------------------------

/**
 * The interiors, read room by room rather than residence by residence, so a
 * visitor can compare the same room across residence types. Copy describes only
 * what is visible in the approved renders.
 */
export const interiorRooms: readonly InteriorRoom[] = [
  {
    id: "living",
    name: "Living room",
    tagline: "Along the curve",
    body: "The sofa follows the sweep of the glazing rather than facing away from it, so the room is oriented to the view on every seat. Stone and walnut run the length of the media wall, lit from within.",
    views: [
      { label: "Three bedroom", media: threeBed.living, clip: walkthroughs.living },
      { label: "Two bedroom", media: twoBed.living },
    ],
  },
  {
    id: "dining",
    name: "Dining",
    tagline: "Open to the room",
    body: "A single stone table under sculptural brass pendants, set in the same volume as the living room so the two read as one space with the balcony beyond.",
    views: [
      { label: "Three bedroom", media: threeBed.dining, clip: walkthroughs.dining },
      { label: "Two bedroom", media: twoBed.dining },
    ],
  },
  {
    id: "kitchen",
    name: "Kitchen",
    tagline: "Stone and walnut",
    body: "A full-height island in veined stone with breakfast seating, integrated ovens behind walnut joinery, and a lit backsplash carried across the run.",
    views: [
      { label: "Three bedroom", media: threeBed.kitchen, clip: walkthroughs.kitchen },
      { label: "Two bedroom", media: twoBed.kitchen },
    ],
  },
  {
    id: "principal-bedroom",
    name: "Principal suite",
    tagline: "Turned to the view",
    body: "The bed faces an upholstered headboard wall while the corner glazing curves away to the balcony. In the three-bedroom the dressing room opens directly off the suite.",
    views: [
      { label: "Three bedroom", media: threeBed.principalBedroom },
      { label: "Two bedroom", media: twoBed.principalBedroom },
    ],
  },
  {
    id: "principal-bathroom",
    name: "Principal bathroom",
    tagline: "Light on stone",
    body: "A freestanding bath set at the window, a walk-in rain shower behind glass, and a twin vanity beneath a backlit mirror.",
    views: [
      { label: "Three bedroom", media: threeBed.principalBathroom },
      { label: "Two bedroom", media: twoBed.principalBathroom },
    ],
  },
  {
    id: "second-bedroom",
    name: "Second bedroom",
    tagline: "Fully fitted",
    body: "Wall-to-wall walnut wardrobes, a dressing table at the window and an en-suite shower room — specified as a principal room in its own right.",
    views: [
      { label: "Three bedroom", media: threeBed.guestBedroom },
      { label: "Two bedroom", media: twoBed.secondBedroom },
    ],
  },
  {
    id: "balcony",
    name: "Balcony",
    tagline: "Outside the glazing",
    body: "The balcony runs the width of the principal rooms behind a frameless glass balustrade, wide enough to dine on, with the city on the far side.",
    views: [
      {
        label: "Three bedroom",
        media: walkthroughs.balcony.poster,
        clip: walkthroughs.balcony,
      },
    ],
  },
  {
    id: "dressing",
    name: "Dressing room",
    tagline: "Off the principal suite",
    body: "A walk-in room of lit walnut joinery, with glazed cabinetry and open hanging on both sides.",
    views: [
      {
        label: "Three bedroom",
        media: walkthroughs.dressing.poster,
        clip: walkthroughs.dressing,
      },
    ],
  },
  {
    id: "entrance",
    name: "Entrance hall",
    tagline: "The arrival inside",
    body: "The three-bedroom opens through a private hall, with a stone feature wall and a console before the living rooms come into view.",
    views: [
      { label: "Three bedroom", media: threeBed.entranceHall, clip: walkthroughs.entrance },
    ],
  },
];

// ---------------------------------------------------------------------------
// Amenities — only what is legible in the approved renders (spec §2)
// ---------------------------------------------------------------------------

export const amenities: readonly Amenity[] = [
  {
    name: "Fitness room",
    description:
      "A glazed fitness room on the podium level, overlooking the arrival court.",
    media: media.arrivalPodium,
  },
  {
    name: "Covered arrival",
    description:
      "A sheltered drop-off beneath the podium, leading directly to the residents' lobby.",
  },
  {
    name: "Resident parking",
    description:
      "Parking at grade and beneath the podium, within the gated boundary wall.",
  },
  {
    name: "Planted balconies",
    description:
      "Planting integrated into the balcony edges and carried up the full height of the facade.",
  },
  {
    name: "Solar site lighting",
    description: "Solar street lighting to the approach and forecourt.",
  },
];

/**
 * How the building stacks up, taken from the approved section drawing and the
 * mix confirmed by the client.
 *
 * The drawing names its own levels — "3RD FL. (TYPICAL)", "10TH FL. (LOWER
 * PENT)", "11TH FL. (UPPER PENT)" — so the penthouse is a duplex over the top
 * two floors rather than a single storey.
 *
 * Note what is deliberately absent: a total unit count. The typical mix is
 * three apartments per floor, but which of the lower levels are residential is
 * not something to infer from a section, so `projectFacts` keeps the total
 * pending until the developer states it.
 */
export const buildingLevels: readonly {
  name: string;
  detail: string;
  kind: "below" | "podium" | "typical" | "penthouse" | "roof";
}[] = [
  {
    name: "Basement",
    detail: "Structured parking below the podium, within the gated boundary.",
    kind: "below",
  },
  {
    name: "Ground floor",
    detail:
      "Covered arrival and drop-off, the residents' lobby, and parking at grade. Solar lighting to the approach and forecourt.",
    kind: "podium",
  },
  {
    name: "Podium",
    detail:
      "A glazed fitness room above the arrival court, looking back over the forecourt.",
    kind: "podium",
  },
  {
    name: "Typical floors",
    detail:
      "Three apartments to a floor: two three-bedroom residences and one two-bedroom.",
    kind: "typical",
  },
  {
    name: "Levels 10 and 11",
    detail:
      "The six-bedroom penthouse, arranged as a duplex over the lower and upper penthouse floors, with the suspended pool and the private cinema room.",
    kind: "penthouse",
  },
  { name: "Roof", detail: "Plant and the cantilevered roof blade.", kind: "roof" },
];

/** The mix on a typical residential floor, as confirmed by the client. */
export const typicalFloorMix = {
  threeBedroom: 2,
  twoBedroom: 1,
  summary: "Two three-bedroom residences and one two-bedroom, per floor.",
} as const;

/**
 * What is around the site.
 *
 * Every entry here was checked against live map data at the confirmed pin
 * (0.3281903, 32.5870894) rather than written from memory. What is deliberately
 * absent is drive times: Kampala traffic makes any single figure misleading,
 * and spec §2 rules out inventing journey times. Distances are described by
 * relationship — same avenue, walking distance, adjoining district — which is
 * checkable, rather than by a number that is not.
 *
 * This is map data, not a developer claim. The page says so.
 */
export interface NearbyGroup {
  heading: string;
  note?: string;
  places: readonly string[];
}

export const neighbourhood: readonly NearbyGroup[] = [
  {
    heading: "The golf course",
    note:
      "Uganda Golf Club is addressed on Kitante Road at John Babiha (Acacia) Avenue — the same avenue as the tower — and its fairways open immediately south-west of the site.",
    places: ["Uganda Golf Club", "Kololo Independence Park"],
  },
  {
    heading: "Shopping",
    note: "Acacia Mall is the closest, on the same avenue.",
    places: [
      "Acacia Mall",
      "Forest Mall, Naguru",
      "Garden City Shopping Mall",
      "The Oasis Mall",
      "Kingdom Kampala",
    ],
  },
  {
    heading: "Health",
    places: [
      "Nakasero Hospital",
      "Kampala Hospital",
      "Case Medical Centre",
      "Victoria Medical Centre",
      "Mulago National Referral Hospital",
    ],
  },
  {
    heading: "Schools",
    places: [
      "Kitante Hill Secondary School",
      "Nakasero Primary School",
      "City Parents School",
      "Lincoln International School",
      "Sir Apollo Kagwa Primary School, Nakasero",
    ],
  },
  {
    heading: "Eating out",
    places: [
      "Mediterraneo Restaurant",
      "Cantine Divino",
      "Zorba",
      "Stonehaven Restaurant & Winery",
      "Piato Restaurant",
    ],
  },
  {
    heading: "Banking",
    places: [
      "Stanbic Bank, Nakasero",
      "Housing Finance Bank, Nakasero",
      "dfcu Bank, Kyadondo",
      "Ecobank Uganda",
    ],
  },
];

/** How the site connects to the rest of the city. */
export const routes: readonly { name: string; detail: string }[] = [
  {
    name: "John Babiha (Acacia) Avenue",
    detail:
      "The site address. Runs south-west past the golf course toward Kitante and the city centre, and north to Kisementi and Acacia Mall.",
  },
  {
    name: "Kira Road",
    detail: "North-west toward Mulago, the museum and Wandegeya.",
  },
  {
    name: "Yusuf Lule Road",
    detail:
      "The main southern route down to Nakasero and the central business district.",
  },
  {
    name: "Upper and Lower Kololo Terrace Road",
    detail: "East across Kololo toward Naguru and the eastern suburbs.",
  },
];

export const neighbourhoodSource =
  "Compiled from map data at the confirmed site pin. Drive times are not published: they vary too much with traffic to be quoted honestly. The sales team will talk you through the journey you care about.";

export const amenitiesNote =
  "Shown as designed. The full schedule of common facilities is confirmed by the sales team.";

/**
 * The suspended pool belongs to the penthouse, not to the building. It was
 * previously listed here as a shared amenity, which would have told every
 * two- and three-bedroom buyer they had access to something they do not.
 */
export const amenitiesExclusion =
  "The suspended swimming pool and the cinema room are private to the penthouse and are not shared facilities.";

// ---------------------------------------------------------------------------
// Project facts and narrative
// ---------------------------------------------------------------------------

export const projectFacts: readonly ProjectFact[] = [
  { label: "Location", value: approved("Acacia Avenue, Kampala") },
  {
    label: "Residence types",
    value: approved("Two bedroom, three bedroom, and a six-bedroom penthouse"),
  },
  { label: "Total residences", value: pending("Request current availability") },
  { label: "Storeys", value: pending("To be confirmed") },
  { label: "Tenure", value: pending("To be confirmed") },
  { label: "Expected completion", value: pending("To be confirmed") },
];

export const projectSummary = [
  "Explorer Towers is a residential tower on Acacia Avenue, Kampala, designed around a single idea carried from the street to the top floor: a curved balcony that wraps the building and never breaks.",
  "The curve does the work. It widens the living rooms, turns every principal bedroom towards a view, and carries planting up the full height of the facade. Near the top the floor plate opens and the penthouse pool is suspended in the gap.",
  "Residences are two and three bedroom, with a six-bedroom penthouse above them. Each opens along floor-to-ceiling glazing onto a private balcony, with stone, walnut and brass carried through the interiors.",
];

// ---------------------------------------------------------------------------
// Gallery, progress, downloads
// ---------------------------------------------------------------------------

/**
 * Every image on the site, in reading order. Residence galleries share images
 * with the amenity set — the penthouse is shown through the sky-pool renders —
 * so the list is deduplicated by source: an image appears in the gallery once.
 */
export const galleryItems: readonly Media[] = (() => {
  const ordered = [
    media.streetGoldenHour,
    media.cornerDaylight,
    media.frontElevationDusk,
    media.cornerEvening,
    media.sectionCutawayDusk,
    media.arrivalPodium,
    media.skyPoolTerrace,
    media.skyPoolFacade,
    ...residences.flatMap((residence) => residence.gallery),
  ];

  const seen = new Set<string>();
  return ordered.filter((item) => {
    if (seen.has(item.src)) return false;
    seen.add(item.src);
    return true;
  });
})();

/**
 * Spec §2: construction photography must stay separate from renders. No site
 * photographs have been handed over, so this list is deliberately empty and
 * the page shows an honest empty state rather than renders in their place.
 */
export const progressUpdates: readonly ProgressUpdate[] = [];

export const downloads: readonly Download[] = [
  {
    title: "Project brochure",
    description: "Full specification, residence layouts and payment information.",
    file: pending("Request the current brochure"),
  },
  {
    title: "Floor plans",
    description: "Dimensioned plans for each residence type.",
    file: pending("Request floor plans"),
  },
  {
    title: "Schedule of areas",
    description: "Net internal area for every residence, with the area basis stated.",
    file: pending("Request the schedule of areas"),
  },
];

export const faqs: readonly FaqSection[] = [
  {
    heading: "The residences",
    items: [
      {
        question: "What sizes are available?",
        answer:
          "Two-bedroom and three-bedroom residences. The dimensioned schedule of areas is issued with the brochure — ask the sales team for the current version.",
      },
      {
        question: "Are the images photographs of the finished building?",
        answer:
          "No. Every image on this site is an architectural render and is labelled as one. Site photography will appear on the Progress page as construction proceeds.",
      },
      {
        question: "Is the furniture included?",
        answer:
          "Furniture and styling shown in the renders are indicative. The delivered specification is set out in the brochure.",
      },
    ],
  },
  {
    heading: "Buying",
    items: [
      {
        question: "What are the prices?",
        answer:
          "Two-bedroom residences start at USD 300,000 and three-bedroom residences at USD 400,000. The penthouse is priced on application. Starting prices are a guide: the price for a particular residence depends on its floor and aspect, and is confirmed in writing by the developer.",
      },
      {
        question: "Can I reserve a residence through this website?",
        answer:
          "No. The website records your interest and passes it to the sales team. A reservation is made only once the developer confirms it in writing.",
      },
      {
        question: "Do you work with buyers outside Uganda?",
        answer:
          "Yes. Tell us your time zone in the inquiry form and a meeting will be arranged to suit it.",
      },
    ],
  },
  {
    heading: "Visiting",
    items: [
      {
        question: "Can I visit the site?",
        answer:
          "Site visits are arranged with a representative. Request one from the Contact page and the team will confirm a time and what to bring.",
      },
      {
        question: "How quickly will someone reply?",
        answer:
          "Inquiries are assigned to a named person as soon as they arrive and answered within the sales team's published working hours.",
      },
    ],
  },
];

export const legal = {
  disclaimer:
    "All images on this site are architectural renders prepared for marketing. Dimensions, finishes, furniture and landscaping are indicative and subject to change. Nothing on this site forms part of an offer or contract.",
};
