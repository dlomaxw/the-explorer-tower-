import type { Metadata } from "next";

import { Reveal } from "@/components/reveal";
import { ButtonLink, PageHeader, Section } from "@/components/ui";
import { faqs } from "@/content/site";

export const metadata: Metadata = {
  title: "Questions",
  description:
    "Common questions about the residences, buying and visiting Explorer Towers.",
};

export default function FaqPage() {
  return (
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
  );
}
