import "server-only";

import { cache } from "react";

import { contentOverrides } from "./cms";
import {
  amenities as defaultAmenities,
  amenitiesNote as defaultAmenitiesNote,
  contact as defaultContact,
  identity as defaultIdentity,
  legal as defaultLegal,
  projectSummary as defaultSummary,
  residences as defaultResidences,
} from "@/content/site";
import { approved, type Publishable } from "@/content/types";

/**
 * Resolves the public site's content: coded defaults, overlaid with anything
 * edited in the CMS.
 *
 * This is the join between `src/content/site.ts` (the reviewable defaults) and
 * the `content_blocks` table (what the client changed). Pages call
 * `siteContent()` instead of importing the defaults directly, so an edit made
 * in the console actually reaches the page.
 *
 * Wrapped in React's `cache`, so one request resolves the overrides once no
 * matter how many components ask.
 *
 * A CMS value is treated as **approved by definition** — somebody with the
 * authority to edit it typed it in. That is what turns a `pending()`
 * placeholder into a published fact: filling in the sales phone number in the
 * console is the act of approving it.
 */
export const siteContent = cache(async () => {
  const overrides = await contentOverrides();

  /** An override wins; otherwise the coded default stands, pending and all. */
  const field = (
    key: string,
    fallback: Publishable<string>,
  ): Publishable<string> => {
    const value = overrides.get(key)?.trim();
    return value ? approved(value) : fallback;
  };

  const plain = (key: string, fallback: string): string =>
    overrides.get(key)?.trim() || fallback;

  return {
    identity: {
      ...defaultIdentity,
      tagline: plain("identity.tagline", defaultIdentity.tagline),
      developer: field("identity.developer", defaultIdentity.developer),
    },

    contact: {
      ...defaultContact,
      address: field("contact.address", defaultContact.address),
      phone: field("contact.phone", defaultContact.phone),
      whatsapp: field("contact.whatsapp", defaultContact.whatsapp),
      email: field("contact.email", defaultContact.email),
      hours: field("contact.hours", defaultContact.hours),
    },

    home: {
      introHeading: plain(
        "home.intro.heading",
        "One curve, carried from the street to the roof",
      ),
      introBody: plain("home.intro.body", defaultSummary.join("\n\n")).split(
        "\n\n",
      ),
      ctaHeading: plain("home.cta.heading", "Register your interest"),
    },

    projectSummary: plain("project.summary", defaultSummary.join("\n\n")).split(
      "\n\n",
    ),

    residences: defaultResidences.map((residence) => ({
      ...residence,
      summary: plain(`residence.${residence.slug}.summary`, residence.summary),
      price: field(`residence.${residence.slug}.price`, residence.price),
      area: field(`residence.${residence.slug}.area`, residence.area),
      availability: field(
        `residence.${residence.slug}.availability`,
        residence.availability,
      ),
    })),

    amenities: defaultAmenities.map((amenity, index) => ({
      ...amenity,
      description: plain(
        `amenity.${index}.description`,
        amenity.description,
      ),
    })),

    amenitiesNote: plain("amenities.note", defaultAmenitiesNote),

    legal: {
      ...defaultLegal,
      disclaimer: plain("legal.disclaimer", defaultLegal.disclaimer),
    },
  };
});

export type SiteContent = Awaited<ReturnType<typeof siteContent>>;
