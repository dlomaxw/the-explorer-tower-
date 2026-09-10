import type { Metadata } from "next";

import { FilmStrip } from "@/components/film-strip";
import { MediaGallery } from "@/components/media-gallery";
import { PageHeader, Section } from "@/components/ui";
import { films, galleryItems, legal } from "@/content/site";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Exterior, interior and amenity images of Explorer Towers, filterable by category.",
};

export default function GalleryPage() {
  return (
    <>
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
