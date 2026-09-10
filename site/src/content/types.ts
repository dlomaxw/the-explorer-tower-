/**
 * Content model for the public site.
 *
 * Everything the public pages render comes from `site.ts` through these types.
 * Stage 3 replaces the static module with CMS-backed loaders; the page
 * components read the same shapes either way.
 *
 * Spec §2: prices, stock counts, areas, completion dates, legal claims and
 * contacts are publishable only after client approval. Unapproved values are
 * modelled as `Pending`, never as a plausible-looking default.
 */

/** A value the client has not yet approved for publication. */
export type Pending = { readonly status: "pending"; readonly prompt: string };

/** A value cleared for publication. */
export type Approved<T> = { readonly status: "approved"; readonly value: T };

export type Publishable<T> = Approved<T> | Pending;

export const approved = <T,>(value: T): Approved<T> => ({ status: "approved", value });

export const pending = (prompt: string): Pending => ({ status: "pending", prompt });

export const isApproved = <T,>(field: Publishable<T>): field is Approved<T> =>
  field.status === "approved";

/** Renders the approved value, or the approved alternative wording (spec §2). */
export const publishedText = (field: Publishable<string>): string =>
  isApproved(field) ? field.value : field.prompt;

export type MediaKind = "render" | "photograph";

export interface Media {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  /** Describes the image for assistive technology (spec §13 accessibility). */
  readonly alt: string;
  /** Shown under the image in galleries and lightboxes. */
  readonly caption: string;
  /**
   * Spec §4: architectural renders must stay visually distinct from actual
   * site photography. The UI labels every item from this field.
   */
  readonly kind: MediaKind;
  readonly category: MediaCategory;
  /** CSS object-position, used for art-directed crops. */
  readonly focal?: string;
}

export type MediaCategory =
  | "exterior"
  | "interior"
  | "amenities"
  | "construction";

export interface AnimationScene {
  readonly id: string;
  readonly media: Media;
  /** Portrait-friendly focal point for the mobile crop (spec §3). */
  readonly mobileFocal: string;
  readonly kicker?: string;
  readonly heading?: string;
  readonly body?: string;
  /** Peak scale for the slow push-in. Constrained to 1.0–1.06 by spec §3. */
  readonly zoomTo: number;
}

/**
 * The three residence tiers carry the three brand grounds from the supplied
 * logo artwork: white for the two-bedroom, forest green for the three-bedroom,
 * clay brown for the penthouse. `data-tier` on a container switches every
 * accent inside it (see globals.css).
 */
export type Tier = "two-bedroom" | "three-bedroom" | "penthouse";

export interface ResidenceType {
  readonly slug: Tier;
  readonly name: string;
  /** Null where the developer has not released a bedroom count. */
  readonly bedrooms: number | null;
  /** Short label used where the full name is too long, e.g. nav and chips. */
  readonly shortName: string;
  /** Net internal area in m². Requires the approved schedule of areas. */
  readonly area: Publishable<string>;
  readonly areaBasis: Publishable<string>;
  readonly price: Publishable<string>;
  readonly availability: Publishable<string>;
  readonly paymentPlan: Publishable<string>;
  readonly floorPlan: Publishable<Media>;
  readonly summary: string;
  /** Features legible in the approved renders. No invented specification. */
  readonly features: readonly string[];
  readonly hero: Media;
  readonly gallery: readonly Media[];
  /** Set where the gallery is standing in for imagery not yet supplied. */
  readonly mediaNote?: string;
}

/** A clip, always played behind a poster and never automatically. */
export interface VideoClip {
  readonly src: string;
  readonly poster: Media;
  readonly durationLabel: string;
}

/** A titled exterior clip shown in the film strip. */
export interface Film {
  readonly id: string;
  readonly title: string;
  readonly clip: VideoClip;
}

/** One view of a room, in a particular residence type. */
export interface InteriorView {
  readonly label: string;
  readonly media: Media;
  readonly clip?: VideoClip;
}

/**
 * A room in the interior showcase. Each room can be shown in more than one
 * residence type, and the viewer crossfades between them.
 */
export interface InteriorRoom {
  readonly id: string;
  readonly name: string;
  readonly tagline: string;
  readonly body: string;
  readonly views: readonly InteriorView[];
}

export interface Amenity {
  readonly name: string;
  readonly description: string;
  readonly media?: Media;
}

export interface ProjectFact {
  readonly label: string;
  readonly value: Publishable<string>;
}

export interface ProgressUpdate {
  readonly date: string;
  readonly title: string;
  readonly body: string;
  readonly media: readonly Media[];
}

export interface Download {
  readonly title: string;
  readonly description: string;
  readonly file: Publishable<{ href: string; revised: string; sizeLabel: string }>;
}

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

export interface FaqSection {
  readonly heading: string;
  readonly items: readonly FaqItem[];
}
