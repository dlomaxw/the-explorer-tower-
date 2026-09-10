import type { MetadataRoute } from "next";

import { PUBLIC_PATHS, SITE_INDEXABLE, SITE_URL, listSeo } from "@/lib/seo";

/**
 * The sitemap lists only pages that are actually indexable.
 *
 * While the site is held back from search — pending the confirmed developer
 * name and official domain — it returns empty rather than advertising URLs that
 * every page tells crawlers not to index. A page the CMS marks `noindex` is
 * likewise omitted: a sitemap that contradicts the page's own robots directive
 * is a real SEO fault, not a harmless inconsistency.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!SITE_INDEXABLE) return [];

  const overrides = await listSeo();
  const blocked = new Set(
    overrides.filter((row) => row.noindex === 1).map((row) => row.path),
  );

  const now = new Date();

  return PUBLIC_PATHS.filter((path) => !blocked.has(path)).map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "/progress" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/residences") ? 0.8 : 0.6,
  }));
}
