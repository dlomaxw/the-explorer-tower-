import type { Metadata } from "next";
import Image from "next/image";

import {
  ButtonLink,
  MediaKindBadge,
  PageHeader,
  Section,
  SectionHeading,
} from "@/components/ui";
import { amenities, amenitiesNote, media } from "@/content/site";

export const metadata: Metadata = {
  title: "Amenities",
  description:
    "The fitness room, covered arrival, parking and shared spaces at Explorer Towers, shown as designed.",
};

export default function AmenitiesPage() {
  const featured = amenities.filter((amenity) => amenity.media);
  const rest = amenities.filter((amenity) => !amenity.media);

  return (
    <>
      <PageHeader
        kicker="Amenities"
        title="What the building shares"
        lead={amenitiesNote}
      />

      <Section>
        <div className="space-y-16 lg:space-y-24">
          {featured.map((amenity, index) => (
            <article
              key={amenity.name}
              className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
            >
              <div
                className={`relative aspect-4/3 overflow-hidden rounded-3xl ${
                  index % 2 === 1 ? "lg:order-2" : ""
                }`}
              >
                <Image
                  src={amenity.media!.src}
                  alt={amenity.media!.alt}
                  fill
                  priority={index === 0}
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: amenity.media!.focal ?? "50% 50%" }}
                />
                <MediaKindBadge
                  kind={amenity.media!.kind}
                  className="absolute top-4 right-4"
                />
              </div>
              <div>
                <h2 className="display-lg text-balance">{amenity.name}</h2>
                <p className="mt-5 text-lg leading-relaxed text-stone-600 text-pretty">
                  {amenity.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading kicker="Also in the building" title="Shared spaces" />
        <ul className="mt-10 grid gap-x-12 md:grid-cols-2">
          {rest.map((amenity) => (
            <li key={amenity.name} className="border-b border-stone-200 py-6">
              <h3 className="font-display text-2xl">{amenity.name}</h3>
              <p className="mt-2 leading-relaxed text-stone-600 text-pretty">
                {amenity.description}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <section className="relative isolate overflow-hidden py-24 md:py-32">
        <Image
          src={media.skyPoolFacade.src}
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-ink/70" />
        <div className="shell text-center text-stone-50">
          <h2 className="display-lg mx-auto max-w-2xl text-balance">
            See the shared spaces in person
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-stone-200 text-pretty">
            Site visits are arranged with a representative who can walk you
            through what is built and what is still to come.
          </p>
          <ButtonLink href="/contact#visit" variant="light" className="mt-9">
            Book a site visit
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
