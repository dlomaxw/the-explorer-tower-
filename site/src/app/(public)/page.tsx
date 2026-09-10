import Image from "next/image";

import { FilmStrip } from "@/components/film-strip";
import { InquiryForm } from "@/components/inquiry-form";
import { InteriorShowcase } from "@/components/interior-showcase";
import { OpeningSequence } from "@/components/opening-sequence";
import { Reveal } from "@/components/reveal";
import { ResidenceCard } from "@/components/residence-card";
import { ScrollJourney } from "@/components/scroll-journey";
import {
  ButtonLink,
  DefinitionRow,
  MediaKindBadge,
  Section,
  SectionHeading,
  Value,
} from "@/components/ui";
import {
  amenities,
  animationScenes,
  films,
  interiorRooms,
  media,
  projectFacts,
  projectSummary,
  residences,
} from "@/content/site";

export default function HomePage() {
  return (
    <>
      <OpeningSequence scenes={animationScenes} />

      <ScrollJourney />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <SectionHeading
              kicker="The project"
              title="One curve, carried from the street to the roof"
            />
          </Reveal>
          <Reveal delay={120}>
            <div className="space-y-5 text-lg leading-relaxed text-stone-600 text-pretty">
              {projectSummary.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
              <ButtonLink href="/project" variant="ghost" className="px-0">
                More about the project
              </ButtonLink>
            </div>
          </Reveal>
        </div>

        <Reveal delay={80}>
          <dl className="mt-16 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
            {projectFacts.map((fact) => (
              <DefinitionRow key={fact.label} label={fact.label}>
                <Value field={fact.value} />
              </DefinitionRow>
            ))}
          </dl>
        </Reveal>
      </Section>

      {/* Exterior films, on the dark ground so the frame reads as a screen. */}
      <section className="bg-ink py-20 text-stone-100 md:py-28">
        <div className="shell">
          <Reveal>
            <div className="max-w-2xl">
              <p className="kicker text-cream">Film</p>
              <h2 className="display-lg mt-4 text-balance">
                Five seconds at a time
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-stone-300 text-pretty">
                Short exterior passes — the approach from the street, the drive
                in under the podium, and the descent down the facade past the
                pool. Nothing plays until you press it.
              </p>
            </div>
          </Reveal>
          <div className="mt-10">
            <FilmStrip films={films} />
          </div>
        </div>
      </section>

      <Section tone="muted">
        <Reveal>
          <SectionHeading
            kicker="Residences"
            title="Two bedroom, three bedroom, penthouse"
            lead="Each residence opens along the curved glazing onto a private balcony. Areas, prices and availability are released by the developer and confirmed in writing."
          />
        </Reveal>

        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-3">
          {residences.map((residence, index) => (
            <Reveal key={residence.slug} delay={index * 110} className="h-full">
              <ResidenceCard residence={residence} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Interiors, read room by room, on the dark ground so the images carry. */}
      <section className="overflow-hidden bg-ink py-20 text-stone-100 md:py-28">
        <InteriorShowcase rooms={interiorRooms} />
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <Reveal>
            <div className="relative aspect-4/5 overflow-hidden rounded-3xl">
              <Image
                src={media.skyPoolTerrace.src}
                alt={media.skyPoolTerrace.alt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
                style={{ objectPosition: media.skyPoolTerrace.focal }}
              />
              <MediaKindBadge
                kind={media.skyPoolTerrace.kind}
                className="absolute top-4 right-4"
              />
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div>
              <SectionHeading
                kicker="Amenities"
                title="A pool suspended in the middle of the building"
                lead="At the centre of the plan the floor plate opens and the pool is hung in the gap, open to the city on three sides."
              />
              <ul className="mt-10 grid gap-x-10 gap-y-1 sm:grid-cols-2">
                {amenities.map((amenity) => (
                  <li
                    key={amenity.name}
                    className="border-b border-stone-200 py-4 text-base"
                  >
                    {amenity.name}
                  </li>
                ))}
              </ul>
              <ButtonLink href="/amenities" variant="ghost" className="mt-8 px-0">
                All amenities
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="muted" id="inquiry">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <Reveal>
            <SectionHeading
              kicker="Register interest"
              title="Ask about a residence"
              lead="Tell us what you are looking for and the sales team will come back with current availability, pricing and payment terms."
            />
          </Reveal>
          <Reveal delay={120}>
            <InquiryForm
              kind="inquiry"
              unitOptions={residences.map((residence) => ({
                value: residence.slug,
                label: residence.name,
              }))}
            />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
