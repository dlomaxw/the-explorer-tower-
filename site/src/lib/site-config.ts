/**
 * The canonical host, in one place.
 *
 * Deliberately a constant rather than an environment variable. The domain is
 * fixed now, and every page's canonical tag and the whole sitemap are built
 * from it: an env var that can drift silently points search engines at the
 * wrong host with nothing failing to show for it. `next.config.ts` reads the
 * same values to redirect the apex, so the redirect and the canonical can
 * never disagree.
 *
 * Plain constants with no imports, because `next.config.ts` is loaded outside
 * the application bundle.
 */

export const CANONICAL_HOST = "www.explorertower.ug";
export const APEX_HOST = "explorertower.ug";
export const CANONICAL_ORIGIN = `https://${CANONICAL_HOST}`;

/**
 * Where this build believes it lives.
 *
 * Production always uses the canonical origin. Preview deployments use their
 * own generated URL so that links in a preview stay inside that preview, and
 * local development uses localhost. `SITE_URL` remains an override for the
 * unusual case, but it cannot quietly outrank the canonical host in production.
 */
export function resolveSiteUrl(): string {
  const deployEnv = process.env.VERCEL_ENV;

  if (deployEnv === "production") return CANONICAL_ORIGIN;

  const override = process.env.SITE_URL?.replace(/\/$/, "");
  if (override) return override;

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;

  return "http://localhost:3000";
}
