import type { Metadata } from "next";
import Image from "next/image";

import {
  ButtonLink,
  DefinitionRow,
  MediaKindBadge,
  PageHeader,
  Section,
  SectionHeading,
  Value,
} from "@/components/ui";
import {
  buildingLevels,
  identity,
  media,
  projectFacts,
  projectSummary,
} from "@/content/site";
import { DeveloperCredit } from "@/components/developer-credit";
import { isApproved } from "@/content/types";

export const metadata: Metadata = {
  title: "The project",
  description:
    "Explorer Towers on Acacia Avenue, Kampala: the design idea, the facade, and the facts confirmed so far.",
};

const DESIGN_NOTES = [
  {
    title: "The balcony line",
    body: "Each floor is edged by a single curved slab that runs the full width of the facade and turns the corners without a break. The line is what you see from the street; the rooms behind it follow the same geometry.",
    image: media.frontElevationDusk,
  },
  {
    title: "The opening in the middle",
    body: "The plan is cut open near the top of the building. That gap carries daylight down through the floors and holds the penthouse pool between them.",
    image: media.sectionCutawayDusk,
  },
  {
    title: "The base",
    body: "The tower sits on a raised podium. Cars arrive underneath and residents enter under cover, with the fitness room glazed above the drop-off.",
    image: media.arrivalPodium,
  },
];

export default function ProjectPage() {
  return (
    <>
      <PageHeader
        kicker="The project"
        title="A tower built around a single line"
        lead={identity.tagline}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <SectionHeading kicker="Overview" title="Explorer Towers" />
          <div className="space-y-5 text-lg leading-relaxed text-stone-600 text-pretty">
            {projectSummary.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading kicker="Design" title="Three things to look at" />
        <div className="mt-14 space-y-16 lg:space-y-24">
          {DESIGN_NOTES.map((note, index) => (
            <article
              key={note.title}
              className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
            >
              <div
                className={`relative aspect-16/10 overflow-hidden rounded-2xl ${
                  index % 2 === 1 ? "lg:order-2" : ""
                }`}
              >
                <Image
                  src={note.image.src}
                  alt={note.image.alt}
                  fill
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: note.image.focal ?? "50% 50%" }}
                />
                <MediaKindBadge
                  kind={note.image.kind}
                  className="absolute top-4 right-4"
                />
              </div>
              <div>
                <h3 className="display-md text-balance">{note.title}</h3>
                <p className="mt-4 text-lg leading-relaxed text-stone-600 text-pretty">
                  {note.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          kicker="The building"
          title="How it stacks up"
          lead="Taken from the approved section drawing. Three apartments to a typical floor, with the penthouse arranged as a duplex over the top two."
        />
        <ol className="mt-10 border-t border-stone-200">
          {buildingLevels.map((level) => (
            <li
              key={level.name}
              className="grid gap-x-8 gap-y-1 border-b border-stone-200 py-5 sm:grid-cols-[13rem_1fr]"
            >
              <p
                className={`font-display text-xl ${
                  level.kind === "penthouse" ? "text-brass" : ""
                }`}
              >
                {level.name}
              </p>
              <p className="leading-relaxed text-stone-600 text-pretty">
                {level.detail}
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-stone-500 text-pretty">
          The total number of residences is released by the developer and is
          not inferred from the drawing.
        </p>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <SectionHeading
            kicker="Project facts"
            title="What is confirmed"
            lead="Anything not yet released by the developer is shown as such rather than estimated. Ask the sales team for the current position."
          />
          <div>
            <dl>
              {projectFacts.map((fact) => (
                <DefinitionRow key={fact.label} label={fact.label}>
                  <Value field={fact.value} />
                </DefinitionRow>
              ))}
              <DefinitionRow label="Developer">
                <Value field={identity.developer} />
              </DefinitionRow>
            </dl>

            {isApproved(identity.developer) ? (
              <div className="mt-8 rounded-xl border border-stone-200 bg-stone-100 px-6 py-6">
                <DeveloperCredit size="large" showName={false} />
                <p className="mt-5 text-sm leading-relaxed text-stone-600 text-pretty">
                  Explorer Towers is developed by{" "}
                  <span className="text-ink">{identity.developer.value}</span>{" "}
                  with Shoal Group.
                </p>
              </div>
            ) : (
              <p className="mt-8 rounded-xl border border-stone-200 bg-stone-100 px-5 py-4 text-sm leading-relaxed text-stone-600">
                The developer profile is published once the legal entity and
                public trading name are confirmed. Until then this page names
                the project only.
              </p>
            )}

            <ButtonLink href="/contact#inquiry" className="mt-8">
              Ask about availability
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
