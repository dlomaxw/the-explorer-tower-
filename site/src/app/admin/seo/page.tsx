import { requireUser } from "@/lib/guard";
import { PUBLIC_PATHS, SITE_INDEXABLE, SITE_URL, listSeo } from "@/lib/seo";
import { SeoRow } from "./seo-editor";

export const metadata = { title: "SEO" };

/** Human-readable fallbacks, matching what each page sets in code. */
const FALLBACK_TITLES: Record<string, string> = {
  "/": "Explorer Towers — Curved-balcony residences above Kampala",
  "/project": "The project",
  "/residences": "Residences",
  "/residences/two-bedroom": "Two-bedroom residence",
  "/residences/three-bedroom": "Three-bedroom residence",
  "/residences/penthouse": "Penthouse",
  "/amenities": "Amenities",
  "/gallery": "Gallery",
  "/location": "Location",
  "/progress": "Progress",
  "/downloads": "Downloads",
  "/contact": "Contact",
  "/faq": "Frequently asked questions",
  "/privacy": "Privacy",
  "/terms": "Terms",
};

export default async function SeoPage() {
  await requireUser("/admin/seo");
  const overrides = await listSeo();
  const byPath = new Map(overrides.map((row) => [row.path, row]));

  return (
    <div className="grid gap-5">
      <header>
        <h1 className="text-lg font-medium tracking-tight">SEO</h1>
        <p className="mt-1 max-w-2xl text-[12px] text-[var(--ink-2)]">
          Titles, descriptions and indexing per page. Every page has a sensible
          default in code; anything set here overrides it without a deploy.
        </p>
      </header>

      <section
        className={`panel p-5 ${SITE_INDEXABLE ? "" : "border-[var(--warn)]/30"}`}
      >
        <h2 className="text-[13px] font-medium">
          {SITE_INDEXABLE
            ? "This site is open to search engines"
            : "This site is held back from search engines"}
        </h2>
        <p className="mt-1 max-w-2xl text-[12px] text-[var(--ink-2)]">
          {SITE_INDEXABLE ? (
            <>
              Pages are indexable, robots.txt allows crawling, and the sitemap
              lists every page not individually set to noindex.
            </>
          ) : (
            <>
              Every page sends <code>noindex, nofollow</code>, robots.txt
              disallows everything, and the sitemap is empty. This is
              deliberate: the site must not be indexed while prices and the
              developer name are unconfirmed. Set{" "}
              <code>SITE_INDEXABLE=true</code> and <code>SITE_URL</code> to open
              it.
            </>
          )}
        </p>

        <dl className="mt-3 grid gap-x-8 gap-y-2 text-[11px] sm:grid-cols-2">
          <Row label="Site URL">{SITE_URL}</Row>
          <Row label="Structured data">ApartmentComplex + Accommodation</Row>
          <Row label="robots.txt">
            <a href="/robots.txt" className="underline underline-offset-2">
              view
            </a>
          </Row>
          <Row label="Sitemap">
            <a href="/sitemap.xml" className="underline underline-offset-2">
              view
            </a>
          </Row>
        </dl>

        <p className="mt-3 text-[11px] text-[var(--ink-3)]">
          Structured data publishes only approved facts. An unconfirmed price is
          left out of the graph rather than filled with a placeholder — a false
          claim to a search engine is still a false claim.
        </p>
      </section>

      <section className="panel p-5">
        <h2 className="mb-2 text-[13px] font-medium">Pages</h2>
        <div>
          {PUBLIC_PATHS.map((path) => {
            const row = byPath.get(path);
            return (
              <SeoRow
                key={path}
                path={path}
                title={row?.title ?? ""}
                description={row?.description ?? ""}
                canonical={row?.canonical ?? ""}
                noindex={row?.noindex === 1}
                fallbackTitle={FALLBACK_TITLES[path] ?? path}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-between gap-4 border-b border-[var(--line)] pb-1">
      <dt className="text-[var(--ink-3)]">{label}</dt>
      <dd className="truncate">{children}</dd>
    </div>
  );
}
