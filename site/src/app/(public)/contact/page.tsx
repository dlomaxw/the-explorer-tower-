import type { Metadata } from "next";

import { InquiryForm } from "@/components/inquiry-form";
import { Reveal } from "@/components/reveal";
import {
  DefinitionRow,
  PageHeader,
  Section,
  SectionHeading,
  Value,
} from "@/components/ui";
import { residences } from "@/content/site";
import { siteContent } from "@/lib/content";
import { isApproved } from "@/content/types";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Register interest, request a callback, arrange a meeting or book a site visit at Explorer Towers.",
};

const unitOptions = residences.map((residence) => ({
  value: residence.slug,
  label: residence.name,
}));

/** The four capture flows of spec §5, each with its own anchor. */
const FLOWS = [
  {
    id: "inquiry",
    kind: "inquiry" as const,
    title: "Register interest",
    lead: "Tell us which residence interests you and the sales team will come back with current availability, pricing and payment terms.",
  },
  {
    id: "callback",
    kind: "callback" as const,
    title: "Request a callback",
    lead: "Leave a number and the best time to reach you. We will call within the team's working hours.",
  },
  {
    id: "meeting",
    kind: "meeting" as const,
    title: "Arrange a meeting",
    lead: "In person in Kampala or online, whichever suits. Give us a preferred slot and we will confirm.",
  },
  {
    id: "visit",
    kind: "visit" as const,
    title: "Book a site visit",
    lead: "Visits are accompanied by a representative. We will confirm the time, the access route and what to bring.",
  },
];

export default async function ContactPage() {
  // Resolved content: the coded defaults overlaid with anything edited in the
  // console, so a phone number filled in there appears here immediately.
  const { contact } = await siteContent();

  return (
    <>
      <PageHeader
        kicker="Contact"
        title="Talk to the sales team"
        lead="Four ways to reach us. Every one of them creates a tracked record with a reference number, assigned to a named person."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading kicker="Details" title="Where to find us" />
            <dl className="mt-8">
              <DefinitionRow label="Address">
                <Value field={contact.address} />
              </DefinitionRow>
              <DefinitionRow label="Phone">
                {isApproved(contact.phone) ? (
                  <a
                    href={`tel:${contact.phone.value.replace(/[^\d+]/g, "")}`}
                    className="underline underline-offset-4 hover:text-gold"
                  >
                    {contact.phone.value}
                  </a>
                ) : (
                  <Value field={contact.phone} />
                )}
              </DefinitionRow>
              <DefinitionRow label="WhatsApp">
                {isApproved(contact.whatsapp) ? (
                  <a
                    href={`https://wa.me/${contact.whatsapp.value.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:text-gold"
                  >
                    {contact.whatsapp.value}
                  </a>
                ) : (
                  <Value field={contact.whatsapp} />
                )}
              </DefinitionRow>
              <DefinitionRow label="Email">
                {isApproved(contact.email) ? (
                  <a
                    href={`mailto:${contact.email.value}`}
                    className="underline underline-offset-4 hover:text-gold"
                  >
                    {contact.email.value}
                  </a>
                ) : (
                  <Value field={contact.email} />
                )}
              </DefinitionRow>
              <DefinitionRow label="Hours">
                <Value field={contact.hours} />
              </DefinitionRow>
            </dl>

          </aside>

          <div className="space-y-20">
            {FLOWS.map((flow) => (
              <Reveal key={flow.id}>
                <section id={flow.id} className="scroll-mt-28">
                  <SectionHeading title={flow.title} lead={flow.lead} />
                  <div className="mt-8">
                    <InquiryForm
                      kind={flow.kind}
                      unitOptions={unitOptions}
                    />
                  </div>
                </section>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
