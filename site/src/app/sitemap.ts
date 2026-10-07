import type { MetadataRoute } from "next";

import {
  amenities,
  animationScenes,
  galleryItems,
  residences,
} from "@/content/site";
import { PUBLIC_PATHS, SITE_INDEXABLE, SITE_URL, listSeo } from "@/lib/seo";

/**
 * The sitemap lists only pages that are actually indexable.
 *
 * A page the CMS marks `noindex` is omitted: a sitemap that contradicts the
 * page's own robots directive is a real SEO fault, not a harmless inconsistency.
 *
 * What is deliberately not here:
 *
 *   * `lastModified`. It used to be "now", which stamps every page as changed
 *     on every deploy. Google only trusts a lastmod that has been accurate in
 *     the past, so a date that is wrong every time teaches it to ignore the
 *     field for the whole site. No date is better than a false one, and there
 *     is no per-page edit history to draw a true one from.
 *   * `changeFrequency` and `priority`. Google states it ignores both.
 *
 * What is: images. A property is shopped for with the eyes, and Google Images
 * is a real route to it; listing the renders against the page they appear on
 * is how they get found.
 */
function imagesFor(path: string): string[] {
  const absolute = (src: string) => `${SITE_URL}${src}`;

  if (path === "/") {
    return animationScenes.slice(0, 4).map((scene) => absolute(scene.media.src));
  }
  if (path === "/amenities") {
    return amenities
      .flatMap((amenity) => (amenity.media ? [amenity.media.src] : []))
      .map(absolute);
  }
  if (path === "/gallery") {
    return galleryItems.slice(0, 40).map((item) => absolute(item.src));
  }
  if (path === "/residences") {
    return residences.map((residence) => absolute(residence.hero.src));
  }

  const detail = residences.find((r) => path === `/residences/${r.slug}`);
  if (detail) {
    return [detail.hero, ...detail.gallery].map((item) => absolute(item.src));
  }
  return [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!SITE_INDEXABLE) return [];

  const overrides = await listSeo();
  const blocked = new Set(
    overrides.filter((row) => row.noindex === 1).map((row) => row.path),
  );

  return PUBLIC_PATHS.filter((path) => !blocked.has(path)).map((path) => {
    const images = [...new Set(imagesFor(path))];
    return {
      url: `${SITE_URL}${path}`,
      ...(images.length > 0 ? { images } : {}),
    };
  });
}
