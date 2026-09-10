import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { InquiryForm } from "@/components/inquiry-form";
import { LogoMark } from "@/components/logo";
import { MediaGallery } from "@/components/media-gallery";
import {
  DefinitionRow,
  MediaKindBadge,
  Section,
  SectionHeading,
  Value,
} from "@/components/ui";
import { residences } from "@/content/site";
import { isApproved } from "@/content/types";

export function generateStaticParams() {
  return residences.map((residence) => ({ slug: residence.slug }));
}

export async function generateMetadata(
  props: PageProps<"/residences/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const residence = residences.find((item) => item.slug === slug);
  if (!residence) return {};

  return { title: residence.name, description: residence.summary };
}

export default async function ResidencePage(
  props: PageProps<"/residences/[slug]">,
) {
  const { slug } = await props.params;
  const residence = residences.find((item) => item.slug === slug);
  if (!residence) notFound();

  const others = residences.filter((item) => item.slug !== residence.slug);

  return (
    <div data-tier={residence.slug}>
      <div className="relative h-[72svh] min-h-120 w-full">
        <Image
          src={residence.hero.src}
          alt={residence.hero.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: residence.hero.focal ?? "50% 50%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/88 via-ink/25 to-ink/50" />
        <MediaKindBadge
          kind={residence.hero.kind}
          className="absolute top-28 right-5 md:right-10"
        />

        <div className="shell absolute inset-x-0 bottom-0 pb-14 md:pb-20">
          <Link
            href="/residences"
            className="kicker text-cream/80 transition-colors hover:text-cream"
          >
            ← All residences
          </Link>
          <div className="mt-6 flex items-end gap-6">
            <LogoMark className="hidden h-20 w-auto shrink-0 text-cream sm:block" />
            <div>
              <p className="kicker text-cream">
                {residence.bedrooms === null
                  ? "Upper level"
                  : `${residence.bedrooms} bedrooms`}
              </p>
              <h1 className="display-xl mt-3 text-stone-50 text-balance">
                {residence.name}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* The tier's own ground, carrying its colour across the whole band. */}
      <section className="bg-(--tier-ground) py-16 text-(--tier-ink) md:py-24">
        <div className="shell grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <div>
            <p className="font-display text-2xl leading-relaxed text-balance md:text-3xl">
              {residence.summary}
            </p>

            <h2 className="kicker mt-14 text-(--tier-line)">The residence</h2>
            <ul className="mt-5 grid gap-x-12 sm:grid-cols-2">
              {residence.features.map((feature) => (
                <li
                  key={feature}
                  className="border-b border-current/15 py-3.5 text-base"
                >
                  {feature}
                </li>
              ))}
            </ul>

            {residence.mediaNote ? (
              <p className="mt-10 max-w-xl border-l-2 border-(--tier-line) pl-5 text-sm leading-relaxed text-(--tier-muted)">
                {residence.mediaNote}
              </p>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-3xl bg-stone-50 p-6 text-ink md:p-8">
              <h2 className="kicker text-stone-500">Key information</h2>
              <dl className="mt-5">
                {residence.bedrooms === null ? null : (
                  <DefinitionRow label="Bedrooms">
                    {residence.bedrooms}
                  </DefinitionRow>
                )}
                <DefinitionRow label="Area">
                  <Value field={residence.area} />
                </DefinitionRow>
                <DefinitionRow label="Area basis">
                  <Value field={residence.areaBasis} />
                </DefinitionRow>
                <DefinitionRow label="Price">
                  <Value field={residence.price} />
                </DefinitionRow>
                <DefinitionRow label="Payment">
                  <Value field={residence.paymentPlan} />
                </DefinitionRow>
                <DefinitionRow label="Availability">
                  <Value field={residence.availability} />
                </DefinitionRow>
              </dl>

              <p className="mt-6 text-sm leading-relaxed text-stone-600">
                {isApproved(residence.floorPlan)
                  ? "The dimensioned floor plan is below."
                  : "The dimensioned floor plan is issued by the sales team on request."}
              </p>

              <a
                href="#unit-inquiry"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-stone-50 transition-colors hover:bg-ink-soft"
              >
                Ask about this residence
              </a>
            </div>
          </aside>
        </div>
      </section>

      <Section tone="light">
        <SectionHeading
          kicker="Gallery"
          title={
            residence.bedrooms === null
              ? "The upper level"
              : `Inside the ${residence.bedrooms}-bedroom residence`
          }
        />
        <div className="mt-10">
          <MediaGallery items={residence.gallery} />
        </div>
      </Section>

      <Section tone="muted" id="unit-inquiry">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <SectionHeading
            kicker="Register interest"
            title={`Ask about the ${residence.name.toLowerCase()}`}
            lead="The sales team will come back with the current price, area schedule and payment terms for this residence type."
          />
          <InquiryForm
            kind="inquiry"
            defaultUnit={residence.slug}
            unitOptions={residences.map((item) => ({
              value: item.slug,
              label: item.name,
            }))}
          />
        </div>
      </Section>

      <Section>
        <SectionHeading kicker="Also at Explorer Towers" title="The other residences" />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {others.map((item) => (
            <Link
              key={item.slug}
              href={`/residences/${item.slug}`}
              data-tier={item.slug}
              className="group flex items-center gap-6 rounded-2xl bg-(--tier-ground) p-6 text-(--tier-ink) ring-1 ring-ink/8 transition-transform duration-500 hover:-translate-y-0.5"
            >
              <LogoMark className="h-12 w-auto shrink-0 text-(--tier-line)" />
              <span>
                <span className="display-md block">{item.shortName}</span>
                <span className="mt-1 block text-sm text-(--tier-muted)">
                  View this residence →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}
