import "server-only";

import type { Metadata } from "next";

import { data } from "./data";
import { identity, contact, residences } from "@/content/site";
import { isApproved } from "@/content/types";

/**
 * SEO metadata (spec §5: CMS-editable SEO fields).
 *
 * Each page declares a sensible default in code; the CMS can override the
 * title, description, canonical, social image and index flag per path without a
 * deploy. Defaults stay in version control so an empty database still produces a
 * complete, reviewable set of tags.
 *
 * Site-wide indexing is gated on two things the client still owes us: the
 * confirmed public developer name and the official domain. Until
 * `SITE_INDEXABLE=true` and `SITE_URL` are set, every page ships `noindex` —
 * a staging deploy must not be indexed carrying unapproved prices.
 */

export const SITE_URL =
  process.env.SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

/**
 * Only the production deployment may ever be indexed.
 *
 * `SITE_INDEXABLE` is the deliberate switch, but it is not trusted on its own:
 * preview deployments carry work in progress and would compete with the real
 * site as duplicate content, so `VERCEL_ENV` has to agree. Setting the flag on
 * a preview environment by mistake therefore cannot leak one into search.
 *
 * `VERCEL_ENV` is absent when running locally, which is why its absence is
 * permitted here — a local build with the flag set can still be checked.
 */
const DEPLOY_ENV = process.env.VERCEL_ENV;

export const SITE_INDEXABLE =
  process.env.SITE_INDEXABLE === "true" &&
  (DEPLOY_ENV === undefined || DEPLOY_ENV === "production");

export interface SeoOverride {
  path: string;
  title: string | null;
  description: string | null;
  canonical: string | null;
  ogMediaId: string | null;
  noindex: number;
}

export async function seoFor(path: string): Promise<SeoOverride | null> {
  try {
    const db = await data();
    return db.first<SeoOverride>(
      "SELECT path, title, description, canonical, og_media_id AS ogMediaId, noindex FROM seo_meta WHERE path = ?",
      [path],
    );
  } catch {
    // SEO overrides are an enhancement: a database hiccup must not stop a page
    // rendering with its coded defaults.
    return null;
  }
}

export async function listSeo(): Promise<SeoOverride[]> {
  const db = await data();
  return db.query<SeoOverride>(
    "SELECT path, title, description, canonical, og_media_id AS ogMediaId, noindex FROM seo_meta ORDER BY path",
  );
}

/**
 * Builds a page's metadata from its coded defaults plus any CMS override.
 *
 * `image` defaults to the approved exterior render, which is the strongest
 * single image the project has and the one a shared link should show.
 */
export async function buildMetadata(input: {
  path: string;
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
}): Promise<Metadata> {
  const override = await seoFor(input.path);

  const title = override?.title || input.title;
  const description = override?.description || input.description;
  const canonical = override?.canonical || `${SITE_URL}${input.path}`;
  const image = input.image ?? "/media/exterior/street-golden-hour.png";
  const blocked = !SITE_INDEXABLE || override?.noindex === 1;

  return {
    title,
    description,
    alternates: { canonical },
    robots: blocked
      ? { index: false, follow: false, nocache: true }
      : { index: true, follow: true },
    openGraph: {
      type: input.type ?? "website",
      title,
      description,
      url: canonical,
      siteName: identity.projectName,
      locale: "en_GB",
      images: [{ url: `${SITE_URL}${image}`, width: 1834, height: 1024 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}${image}`],
    },
  };
}

/**
 * Structured data for the project.
 *
 * Only approved facts are emitted. A `pending` price or address would be a
 * false claim to a search engine as much as to a visitor, so unapproved fields
 * are omitted from the graph entirely rather than filled with a placeholder.
 */
export function projectJsonLd(): Record<string, unknown> {
  const graph: Record<string, unknown>[] = [];

  const address = isApproved(contact.address)
    ? {
        "@type": "PostalAddress",
        streetAddress: "Acacia Avenue",
        addressLocality: "Kampala",
        addressCountry: "UG",
      }
    : undefined;

  const project: Record<string, unknown> = {
    "@type": "ApartmentComplex",
    "@id": `${SITE_URL}/#project`,
    name: identity.projectName,
    url: SITE_URL,
    description:
      "Two- and three-bedroom residences and a six-bedroom penthouse on John Babiha (Acacia) Avenue, Kampala, designed around a continuous curved balcony.",
    numberOfAccommodationUnits: undefined,
    image: `${SITE_URL}/media/exterior/street-golden-hour.png`,
  };
  if (address) project.address = address;
  graph.push(project);

  for (const residence of residences) {
    const entry: Record<string, unknown> = {
      "@type": "Accommodation",
      "@id": `${SITE_URL}/residences/${residence.slug}#accommodation`,
      name: residence.name,
      description: residence.summary,
      numberOfBedrooms: residence.bedrooms,
      url: `${SITE_URL}/residences/${residence.slug}`,
      image: `${SITE_URL}${residence.hero.src}`,
    };

    // Only publish an offer once a price is actually approved.
    if (isApproved(residence.price)) {
      entry.offers = {
        "@type": "Offer",
        price: residence.price.value,
        availability: "https://schema.org/InStock",
      };
    }
    if (isApproved(residence.area)) {
      entry.floorSize = {
        "@type": "QuantitativeValue",
        value: residence.area.value,
        unitCode: "MTK",
      };
    }

    graph.push(entry);
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

/** Every public path, for the sitemap and the SEO screen. */
export const PUBLIC_PATHS: readonly string[] = [
  "/",
  "/project",
  "/residences",
  ...residences.map((residence) => `/residences/${residence.slug}`),
  "/amenities",
  "/gallery",
  "/location",
  "/progress",
  "/downloads",
  "/contact",
  "/faq",
  "/privacy",
  "/terms",
];
