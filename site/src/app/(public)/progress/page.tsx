import type { Metadata } from "next";

import { MediaGallery } from "@/components/media-gallery";
import { ButtonLink, EmptyState, PageHeader, Section } from "@/components/ui";
import { progressUpdates } from "@/content/site";

export const metadata: Metadata = {
  title: "Construction progress",
  description:
    "Dated construction updates and site photography from Explorer Towers.",
};

export default function ProgressPage() {
  return (
    <>
      <PageHeader
        kicker="Progress"
        title="Construction updates"
        lead="This page carries dated site photography only. Architectural renders live in the Gallery and are never shown here as progress."
      />

      <Section>
        {progressUpdates.length === 0 ? (
          <EmptyState
            title="No site updates published yet"
            body="Construction photography has not been handed over. Rather than show renders in its place, this page stays empty until real dated site images exist. Ask to be told when the first update is published."
          >
            <ButtonLink href="/contact#inquiry">
              Tell me when progress is published
            </ButtonLink>
          </EmptyState>
        ) : (
          <ol className="space-y-16">
            {progressUpdates.map((update) => (
              <li key={update.date}>
                <article>
                  <p className="kicker text-brass">
                    <time dateTime={update.date}>
                      {new Date(update.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                  </p>
                  <h2 className="display-md mt-3">{update.title}</h2>
                  <p className="mt-4 max-w-2xl leading-relaxed text-stone-600 text-pretty">
                    {update.body}
                  </p>
                  {update.media.length > 0 ? (
                    <div className="mt-8">
                      <MediaGallery items={update.media} />
                    </div>
                  ) : null}
                </article>
              </li>
            ))}
          </ol>
        )}
      </Section>
    </>
  );
}
