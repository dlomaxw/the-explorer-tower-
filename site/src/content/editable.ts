import {
  amenities,
  amenitiesNote,
  contact,
  identity,
  legal,
  projectSummary,
  residences,
} from "./site";
import { isApproved } from "./types";

/**
 * The registry of editable text.
 *
 * Every entry names one string on the public site, its default from
 * `site.ts`, and where it appears. The CMS edits by key; a key with no stored
 * override falls back to this default, so an empty database renders the site
 * exactly as the code describes it and "revert to default" is real.
 *
 * Adding a field here is what makes it editable — there is no reflection or
 * guessing, so nothing becomes editable by accident and every editable string
 * has a human-readable description attached to it.
 */

export interface EditableField {
  key: string;
  label: string;
  /** Where this appears, in plain language. */
  where: string;
  default: string;
  multiline?: boolean;
  /**
   * True when the default is a `pending()` placeholder — a fact the client
   * still owes us. These are surfaced first in the CMS, because filling them
   * in is the outstanding work.
   */
  awaitingApproval?: boolean;
}

export interface EditableGroup {
  id: string;
  title: string;
  description: string;
  fields: EditableField[];
}

export const EDITABLE: EditableGroup[] = [
  {
    id: "identity",
    title: "Identity and contact",
    description:
      "The details the whole site depends on. Several are still unconfirmed — the source names both Shoal Group and Gabonn Associates, so the developer name must be resolved before launch.",
    fields: [
      {
        key: "identity.tagline",
        label: "Tagline",
        where: "Browser tab, search results, social shares",
        default: identity.tagline,
      },
      {
        key: "identity.developer",
        label: "Developer name",
        where: "Footer, project page, structured data",
        default: isApproved(identity.developer) ? identity.developer.value : "",
        awaitingApproval: !isApproved(identity.developer),
      },
      {
        key: "contact.phone",
        label: "Sales phone number",
        where: "Contact page, header, footer",
        default: isApproved(contact.phone) ? contact.phone.value : "",
        awaitingApproval: !isApproved(contact.phone),
      },
      {
        key: "contact.whatsapp",
        label: "WhatsApp number",
        where: "Contact page, WhatsApp buttons",
        default: isApproved(contact.whatsapp) ? contact.whatsapp.value : "",
        awaitingApproval: !isApproved(contact.whatsapp),
      },
      {
        key: "contact.email",
        label: "Sales email",
        where: "Contact page, footer",
        default: isApproved(contact.email) ? contact.email.value : "",
        awaitingApproval: !isApproved(contact.email),
      },
      {
        key: "contact.hours",
        label: "Viewing hours",
        where: "Contact page",
        default: isApproved(contact.hours) ? contact.hours.value : "",
        awaitingApproval: !isApproved(contact.hours),
      },
      {
        key: "contact.address",
        label: "Address",
        where: "Location page, footer, structured data",
        default: isApproved(contact.address) ? contact.address.value : "",
      },
    ],
  },
  {
    id: "home",
    title: "Home page",
    description: "The opening sequence captions and the introduction below it.",
    fields: [
      {
        key: "home.intro.heading",
        label: "Introduction heading",
        where: "Home, first section after the animation",
        default: "One curve, carried from the street to the roof",
      },
      {
        key: "home.intro.body",
        label: "Introduction text",
        where: "Home, first section after the animation",
        default: projectSummary.join("\n\n"),
        multiline: true,
      },
      {
        key: "home.cta.heading",
        label: "Closing call to action",
        where: "Home, above the footer",
        default: "Register your interest",
      },
    ],
  },
  {
    id: "project",
    title: "Project page",
    description: "The longer description of the building and its design.",
    fields: [
      {
        key: "project.summary",
        label: "Project summary",
        where: "Project page, main text",
        default: projectSummary.join("\n\n"),
        multiline: true,
      },
    ],
  },
  {
    id: "residences",
    title: "Residences",
    description:
      "Per-residence copy. Prices, areas and availability are separate — they are commercial facts and stay unapproved until the developer releases them.",
    fields: residences.flatMap((residence) => [
      {
        key: `residence.${residence.slug}.summary`,
        label: `${residence.name} — summary`,
        where: `Residences list and /residences/${residence.slug}`,
        default: residence.summary,
        multiline: true,
      },
      {
        key: `residence.${residence.slug}.price`,
        label: `${residence.name} — price`,
        where: "Residence card and detail page",
        default: isApproved(residence.price) ? residence.price.value : "",
        awaitingApproval: !isApproved(residence.price),
      },
      {
        key: `residence.${residence.slug}.area`,
        label: `${residence.name} — area`,
        where: "Residence detail page",
        default: isApproved(residence.area) ? residence.area.value : "",
        awaitingApproval: !isApproved(residence.area),
      },
      {
        key: `residence.${residence.slug}.availability`,
        label: `${residence.name} — availability`,
        where: "Residence card and detail page",
        default: isApproved(residence.availability)
          ? residence.availability.value
          : "",
        awaitingApproval: !isApproved(residence.availability),
      },
    ]),
  },
  {
    id: "amenities",
    title: "Amenities",
    description:
      "Only facilities visible in the approved renders are listed. Do not add one that has not been confirmed.",
    fields: [
      {
        key: "amenities.note",
        label: "Amenities note",
        where: "Amenities page, under the list",
        default: amenitiesNote,
        multiline: true,
      },
      ...amenities.map((amenity, index) => ({
        key: `amenity.${index}.description`,
        label: `${amenity.name} — description`,
        where: "Amenities page",
        default: amenity.description,
        multiline: true,
      })),
    ],
  },
  {
    id: "legal",
    title: "Legal and disclaimers",
    description:
      "Privacy wording and retention periods still need client review before launch.",
    fields: [
      {
        key: "legal.disclaimer",
        label: "Image disclaimer",
        where: "Footer, gallery, every residence page",
        default: legal.disclaimer,
        multiline: true,
      },
    ],
  },
];

export const EDITABLE_FIELDS: EditableField[] = EDITABLE.flatMap(
  (group) => group.fields,
);

export function findEditable(key: string): EditableField | undefined {
  return EDITABLE_FIELDS.find((field) => field.key === key);
}

/** Fields whose default is a placeholder — the client's outstanding list. */
export const AWAITING = EDITABLE_FIELDS.filter(
  (field) => field.awaitingApproval,
);
