import type { Metadata } from "next";

import { PageHeader, Section } from "@/components/ui";
import { legal } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms on which the Explorer Towers website is published.",
};

const SECTIONS = [
  {
    heading: "About the images",
    body: [
      legal.disclaimer,
      "Every image is labelled as a render or as site photography. Where site photography does not yet exist, no render is shown in its place.",
    ],
  },
  {
    heading: "About the information",
    body: [
      "Areas, prices, payment terms, availability, storey counts and completion dates are released by the developer and confirmed in writing. Where a figure has not been released, this site says so rather than estimating it.",
      "Nothing published here is an offer, and nothing here forms part of a contract.",
    ],
  },
  {
    heading: "Inquiries and reservations",
    body: [
      "Submitting a form on this site records your interest and passes it to the sales team. It does not reserve a residence and does not hold stock.",
      "A reservation exists only once the developer confirms it in writing under the sales process in force at the time.",
    ],
  },
  {
    heading: "Availability of the site",
    body: [
      "We aim to keep this site available and current, but we do not guarantee uninterrupted access, and content may be revised without notice.",
    ],
  },
  {
    heading: "Ownership",
    body: [
      "The imagery, drawings, text and marks on this site belong to the developer or to those it has licensed them from. Ownership terms are set out in the project agreement and are pending confirmation for publication.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHeader
        kicker="Terms"
        title="Terms of use"
        lead="Working draft, subject to the developer's review before launch."
      />

      <Section>
        <div className="max-w-2xl space-y-12">
          {SECTIONS.map((section) => (
            <section key={section.heading}>
              <h2 className="display-md text-balance">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 24)}
                  className="mt-4 leading-relaxed text-stone-600 text-pretty"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </Section>
    </>
  );
}
