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
  contact,
  media,
  neighbourhood,
  neighbourhoodSource,
  routes,
} from "@/content/site";
import { isApproved } from "@/content/types";

export const metadata: Metadata = {
  title: "Location",
  description:
    "Explorer Towers stands on Acacia Avenue, Kampala. Directions and the verified address.",
};

/**
 * Spec §11: both the address and the pin are now confirmed by the client, so
 * the map shows the real coordinates rather than a text search. Journey times
 * to nearby destinations are still not invented — those need the developer's
 * approved list.
 */
const MAP_QUERY = encodeURIComponent(
  "Plot 37 John Babiha Avenue, Acacia Avenue, Kampala, Uganda",
);

export default function LocationPage() {
  const mapPinReady = isApproved(contact.coordinates);

  return (
    <>
      <PageHeader
        kicker="Location"
        title="John Babiha (Acacia) Avenue"
        lead="The tower stands on Plot 37, John Babiha Avenue — still widely known as Acacia Avenue — with the escarpment and the city visible from the upper floors."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div className="relative aspect-4/3 overflow-hidden rounded-3xl">
            <Image
              src={media.streetGoldenHour.src}
              alt={media.streetGoldenHour.alt}
              fill
              priority
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="object-cover"
              style={{ objectPosition: media.streetGoldenHour.focal }}
            />
            <MediaKindBadge
              kind={media.streetGoldenHour.kind}
              className="absolute top-4 right-4"
            />
          </div>

          <div>
            <SectionHeading kicker="Getting there" title="The address" />
            <dl className="mt-8">
              <DefinitionRow label="Address">
                <Value field={contact.address} />
              </DefinitionRow>
              <DefinitionRow label="City">Kampala, Uganda</DefinitionRow>
              <DefinitionRow label="Coordinates">
                {isApproved(contact.coordinates) ? (
                  <span className="tabular-nums">
                    {contact.coordinates.value.lat.toFixed(6)},{" "}
                    {contact.coordinates.value.lng.toFixed(6)}
                  </span>
                ) : (
                  <Value field={contact.coordinates as never} />
                )}
              </DefinitionRow>
            </dl>

            {!mapPinReady ? (
              <p className="mt-8 rounded-xl border border-stone-200 bg-stone-100 px-5 py-4 text-sm leading-relaxed text-stone-600">
                The map shows the street address above. An exact pin is added
                once the developer confirms it.
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink
                href={
                  isApproved(contact.coordinates)
                    ? `https://www.google.com/maps/search/?api=1&query=${contact.coordinates.value.lat},${contact.coordinates.value.lng}`
                    : `https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`
                }
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
              >
                Open in Google Maps
              </ButtonLink>
              <ButtonLink href="/contact#visit">Book a site visit</ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading kicker="The map" title="Where to find us" />
        {/*
          Loaded lazily and inside its own bordered box, so a slow or blocked
          embed never holds up the page or shifts the layout around it. The
          address above stays usable whatever the iframe does.
        */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-stone-200 bg-stone-100">
          <iframe
            title="Map showing Plot 37 John Babiha (Acacia) Avenue, Kampala"
            src={
              isApproved(contact.coordinates)
                ? `https://www.google.com/maps?q=${contact.coordinates.value.lat},${contact.coordinates.value.lng}&z=17&output=embed`
                : `https://www.google.com/maps?q=${MAP_QUERY}&output=embed`
            }
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-[22rem] w-full border-0 md:h-[26rem]"
          />
        </div>
        <p className="mt-4 text-sm text-stone-500">
          Map data by Google. The pin marks the site entrance, not a surveyed
          boundary.
        </p>
      </Section>

      <Section>
        <SectionHeading
          kicker="The surroundings"
          title="What is nearby"
          lead="Kololo sits between the golf course and the city centre. These are the places within reach of the front door."
        />

        <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {neighbourhood.map((group) => (
            <div key={group.heading}>
              <h3 className="kicker text-brass">{group.heading}</h3>
              {group.note ? (
                <p className="mt-3 text-sm leading-relaxed text-stone-600 text-pretty">
                  {group.note}
                </p>
              ) : null}
              <ul className="mt-4 space-y-1.5 text-sm text-stone-700">
                {group.places.map((place) => (
                  <li key={place}>{place}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-12 max-w-3xl border-t border-stone-200 pt-6 text-sm leading-relaxed text-stone-500 text-pretty">
          {neighbourhoodSource}
        </p>
      </Section>

      <Section>
        <SectionHeading
          kicker="Getting around"
          title="Routes into the centre"
          lead="Four roads do most of the work from this corner of Kololo."
        />
        <dl className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
          {routes.map((route) => (
            <div key={route.name}>
              <dt className="font-display text-xl">{route.name}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-stone-600 text-pretty">
                {route.detail}
              </dd>
            </div>
          ))}
        </dl>
        <ButtonLink href="/contact#visit" className="mt-10">
          Book a site visit
        </ButtonLink>
      </Section>
    </>
  );
}
