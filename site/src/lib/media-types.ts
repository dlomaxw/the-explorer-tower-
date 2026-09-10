/**
 * Media shapes shared by the server and the browser.
 *
 * Deliberately free of `server-only` imports. `lib/cms.ts` reaches R2 and the
 * database, so it can never be imported by a client component; the upload form
 * still needs the category list and the row shape, and this is where they live.
 */

export const MEDIA_CATEGORIES = [
  "exterior",
  "interior",
  "amenities",
  "construction",
  "floor-plan",
  "document",
] as const;

export type MediaCategory = (typeof MEDIA_CATEGORIES)[number];

export interface MediaAsset {
  id: string;
  storage_key: string;
  /** "render" or "photograph" — spec §4 keeps the two visually distinct. */
  kind: string;
  category: string;
  title: string;
  alt: string;
  caption: string | null;
  mime: string;
  bytes: number;
  width: number | null;
  height: number | null;
  approved: number;
  created_at: string;
  archived: number;
}

/** What the library accepts, and the ceiling for each. */
export const ACCEPTED_MIME: Record<string, number> = {
  "image/jpeg": 20 * 1024 * 1024,
  "image/png": 20 * 1024 * 1024,
  "image/webp": 20 * 1024 * 1024,
  "image/avif": 20 * 1024 * 1024,
  "video/mp4": 200 * 1024 * 1024,
  "video/webm": 200 * 1024 * 1024,
  "application/pdf": 40 * 1024 * 1024,
};
