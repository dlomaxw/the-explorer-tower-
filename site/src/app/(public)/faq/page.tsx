import type { Metadata } from "next";

import { buildMetadata, faqJsonLd, breadcrumbsFor } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

import { Reveal } from "@/components/reveal";
import { ButtonLink, PageHeader, Section } from "@/components/ui";
import { faqs } from "@/content/site";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/faq",
    title: "FAQ: buying an apartment in Kampala",
    description:
      "Answers on buying a two-bedroom, three-bedroom or penthouse apartment in Kampala: prices, location, amenities, floors, visits and reservations.",
  });
}

export default function FaqPage() {
  return (
    <>
      <JsonLd data={breadcrumbsFor("/faq")} />
      <JsonLd data={faqJsonLd()} />
    <>
      <PageHeader
        kicker="Questions"
        title="Asked and answered"
        lead="If your question is not here, send it through and someone will answer it directly."
      />

      <Section>
        <div className="space-y-16">
          {faqs.map((section) => (
            <Reveal key={section.heading}>
              <section>
                <h2 className="kicker text-brass">{section.heading}</h2>
                <dl className="mt-6">
                  {section.items.map((item) => (
                    <div
                      key={item.question}
                      className="border-b border-stone-200 py-7"
                    >
                      <dt className="font-display text-2xl text-balance">
                        {item.question}
                      </dt>
                      <dd className="mt-3 max-w-2xl leading-relaxed text-stone-600 text-pretty">
                        {item.answer}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            </Reveal>
          ))}
        </div>

        <div className="mt-16">
          <ButtonLink href="/contact#inquiry">Ask a question</ButtonLink>
        </div>
      </Section>
    </>
    </>
  );
}
