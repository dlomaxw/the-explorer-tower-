import type { Metadata } from "next";

import { InquiryForm } from "@/components/inquiry-form";
import { Reveal } from "@/components/reveal";
import { ButtonLink, PageHeader, Section, SectionHeading } from "@/components/ui";
import { downloads, residences } from "@/content/site";
import { isApproved } from "@/content/types";

export const metadata: Metadata = {
  title: "Downloads",
  description:
    "Brochure, floor plans and the schedule of areas for Explorer Towers.",
};

export default function DownloadsPage() {
  const anyReady = downloads.some((item) => isApproved(item.file));

  return (
    <>
      <PageHeader
        kicker="Downloads"
        title="Documents"
        lead="Each document carries the revision date it was issued under. Where a document has not yet been released, ask for it and the sales team will send the current version."
      />

      <Section>
        <ul className="grid gap-4">
          {downloads.map((item, index) => (
            <Reveal key={item.title} as="li" delay={index * 80}>
              <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-stone-200 bg-stone-100 px-6 py-6 md:px-8">
                <div>
                  <h2 className="display-md">{item.title}</h2>
                  <p className="mt-2 max-w-lg leading-relaxed text-stone-600 text-pretty">
                    {item.description}
                  </p>
                </div>

                {isApproved(item.file) ? (
                  <div className="text-right">
                    <ButtonLink href={item.file.value.href} download>
                      Download
                    </ButtonLink>
                    <p className="mt-3 text-xs text-stone-500">
                      Revised {item.file.value.revised} ·{" "}
                      {item.file.value.sizeLabel}
                    </p>
                  </div>
                ) : (
                  <div className="text-right">
                    <ButtonLink href="#request" variant="secondary">
                      {item.file.prompt}
                    </ButtonLink>
                    <p className="mt-3 text-xs text-stone-500">
                      Not yet released for download
                    </p>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </ul>

        {!anyReady ? (
          <p className="mt-10 max-w-2xl text-sm leading-relaxed text-stone-500 text-pretty">
            No document has been approved for public download yet. Rather than
            publish an out-of-date file, this page routes every request to the
            sales team so you receive the current revision.
          </p>
        ) : null}
      </Section>

      <Section tone="muted" id="request">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <SectionHeading
            kicker="Request documents"
            title="Ask for the current versions"
            lead="Tell us which residence you are considering and we will send the brochure, plans and area schedule that apply to it."
          />
          <InquiryForm
            kind="inquiry"
            unitOptions={residences.map((residence) => ({
              value: residence.slug,
              label: residence.name,
            }))}
          />
        </div>
      </Section>
    </>
  );
}
