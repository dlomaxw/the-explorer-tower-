import type { Metadata } from "next";

import { buildMetadata, breadcrumbsFor } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

import { FilmStrip } from "@/components/film-strip";
import { MediaGallery } from "@/components/media-gallery";
import { PageHeader, Section } from "@/components/ui";
import { films, galleryItems, legal } from "@/content/site";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/gallery",
    title: "Render gallery: facade, interiors, amenities",
    description:
      "Renders of the facade, residences, pool terrace and amenities at Explorer Towers, an apartment tower in Kololo, Kampala.",
  });
}

export default function GalleryPage() {
  return (
    <>
      <JsonLd data={breadcrumbsFor("/gallery")} />
      <PageHeader
        kicker="Gallery"
        title="The building, inside and out"
        lead="Every image here is an architectural render and is labelled as one. Construction photography appears on the Progress page as it is taken."
      />

      <section className="bg-ink py-16 text-stone-100 md:py-20">
        <div className="shell">
          <h2 className="kicker text-cream">Film</h2>
          <div className="mt-6">
            <FilmStrip films={films} />
          </div>
        </div>
      </section>

      <Section>
        <h2 className="kicker mb-8 text-brass">Stills</h2>
        <MediaGallery items={galleryItems} filterable />
        <p className="mt-14 max-w-3xl text-sm leading-relaxed text-stone-500 text-pretty">
          {legal.disclaimer}
        </p>
      </Section>
    </>
  );
}
