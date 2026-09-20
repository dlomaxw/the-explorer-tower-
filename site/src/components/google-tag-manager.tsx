import Script from "next/script";

/**
 * Google Tag Manager.
 *
 * The container id comes from `NEXT_PUBLIC_GTM_ID` rather than being written
 * in here, and that variable is set on the production environment only. Two
 * things follow from that: preview deployments and local development never
 * load the container, so nobody's test clicks land in the client's analytics;
 * and changing or removing the container is a Vercel setting rather than a
 * code change. With the variable unset, both components render nothing at all.
 *
 * `afterInteractive` is the right strategy here. The container is not needed to
 * render anything, so loading it before the page is interactive would spend the
 * visitor's first moments on measurement instead of on the building.
 *
 * Consent: this loads the container unconditionally. GTM and whatever tags sit
 * inside it may set cookies before a visitor has agreed to anything, which the
 * specification's §11 asks to be configured rather than assumed. See the note
 * in README under "Analytics and consent" — the fix belongs in the container
 * (Consent Mode defaults) as much as in this file.
 */

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export function GoogleTagManager() {
  if (!GTM_ID) return null;

  return (
    <Script id="gtm-init" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  );
}

/**
 * The no-JavaScript fallback, which must be the first thing inside `<body>`.
 *
 * It is a bare iframe rather than anything from `next/script`, because the
 * whole point is that it works when no script runs at all.
 */
export function GoogleTagManagerNoScript() {
  if (!GTM_ID) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        // Decorative to assistive technology: it carries no content a reader
        // could use, and without a title a screen reader announces the URL.
        title="Google Tag Manager"
      />
    </noscript>
  );
}
