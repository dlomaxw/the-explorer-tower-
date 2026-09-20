import "server-only";

import type { Metadata } from "next";

import { data } from "./data";
import { resolveSiteUrl } from "./site-config";
import { faqs, identity, contact, residences } from "@/content/site";
import { isApproved } from "@/content/types";

/**
 * SEO metadata (spec §5: CMS-editable SEO fields).
 *
 * Each page declares a sensible default in code; the CMS can override the
 * title, description, canonical, social image and index flag per path without a
 * deploy. Defaults stay in version control so an empty database still produces a
 * complete, reviewable set of tags.
 *
 * The canonical origin comes from `site-config.ts`, not from an environment
 * variable, so canonical tags and the sitemap cannot be pointed at the wrong
 * host by a stale setting. Indexing is still a deliberate switch, and still
 * refuses to apply anywhere but production.
 */

export const SITE_URL = resolveSiteUrl();

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
    /*
     * The root layout appends " — Explorer Towers" to every title. The home
     * page already ends with the project name, so it opts out of the template
     * rather than announcing the project twice in one tab.
     */
    title: input.path === "/" ? { absolute: title } : title,
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
        streetAddress: "Plot 37 John Babiha (Acacia) Avenue, Kololo",
        addressLocality: "Kampala",
        addressRegion: "Central Region",
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
    // Kololo is how people in Kampala name this address, and it is the term
    // they search. It belongs in the graph as well as in the prose.
    areaServed: [
      { "@type": "City", name: "Kampala" },
      { "@type": "Country", name: "Uganda" },
    ],
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

    /*
     * Only publish an offer once there is a real number behind it, and express
     * a "from" price as a minimum rather than as the price — otherwise the
     * cheapest residence's figure is advertised as the price of every one.
     *
     * No `availability`: the developer has not released stock figures, and
     * claiming InStock to a search engine is as much a false statement as
     * printing it on the page would be.
     */
    if (isApproved(residence.price) && residence.priceFrom) {
      entry.offers = {
        "@type": "Offer",
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: residence.priceFrom.amount,
          priceCurrency: residence.priceFrom.currency,
        },
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

/**
 * FAQ structured data.
 *
 * This is the piece that puts the site's own answers in front of someone who
 * asked Google or an assistant "where can I buy a three-bedroom apartment in
 * Kampala". Without it the answers are just paragraphs; with it they are a
 * machine-readable question-and-answer set that can be quoted directly.
 *
 * Every question on the page is included, because Google's guidance is that
 * the markup must match the visible content — a set that differs from what a
 * visitor can read is grounds for the rich result being dropped entirely.
 */
export function faqJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/faq#faq`,
    mainEntity: faqs.flatMap((section) =>
      section.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    ),
  };
}

/**
 * Breadcrumbs for a page below the top level, so a search result shows the
 * path through the site rather than a bare URL.
 */
export function breadcrumbJsonLd(
  trail: readonly { name: string; path: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
    })),
  };
}
