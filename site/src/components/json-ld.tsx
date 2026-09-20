/**
 * Structured data, emitted as JSON-LD.
 *
 * This is what lets a search engine — and an AI assistant reading the page —
 * understand the site as facts rather than as prose: that this is an apartment
 * complex, at this address, in Kampala, with residences at these prices, and
 * that these questions have these answers. Rich results and assistant answers
 * are built from exactly this.
 *
 * Rendered as a plain `<script type="application/ld+json">` rather than through
 * `next/script`, because crawlers need it present in the served HTML rather
 * than injected once the page becomes interactive.
 *
 * The content is built server-side from approved data only, so nothing user
 * supplied reaches this. `JSON.stringify` output is still escaped for `<`, which
 * is the one character that could otherwise close the script element early.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
