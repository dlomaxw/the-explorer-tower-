import type { NextConfig } from "next";

/**
 * The canonical host is www.explorertower.ug.
 *
 * A site reachable on two hosts is two sites as far as a search engine is
 * concerned, so the apex permanently redirects to www rather than serving the
 * same pages twice. Keeping this here rather than in the Vercel dashboard means
 * the rule is versioned and reviewable with everything else.
 *
 * The rule is inert until DNS exists: `has: host` cannot match a hostname
 * nobody can resolve, so this is safe to ship before the domain is live.
 */
const CANONICAL_HOST = "www.explorertower.ug";
const APEX_HOST = "explorertower.ug";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: APEX_HOST }],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
