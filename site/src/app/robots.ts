import type { MetadataRoute } from "next";

import { SITE_INDEXABLE, SITE_URL } from "@/lib/seo";

/**
 * While the site is held back from search, this disallows everything — one
 * clear instruction rather than a per-path patchwork.
 *
 * `/admin` and `/api` stay disallowed either way. That is defence in depth, not
 * the control: the admin area enforces authentication server-side and sends its
 * own noindex headers. A robots file is a request, and only well-behaved
 * crawlers honour it.
 */
export default function robots(): MetadataRoute.Robots {
  if (!SITE_INDEXABLE) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
