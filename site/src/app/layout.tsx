import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import { identity } from "@/content/site";
import { SITE_INDEXABLE } from "@/lib/seo";

import "./globals.css";

/**
 * Root layout.
 *
 * Deliberately thin: fonts, global styles and the document shell. The public
 * site's header, footer and intro live in `(public)/layout.tsx` so the private
 * admin area does not inherit them — internal screens must not carry public
 * navigation (spec §2).
 */

/** Working typefaces until the approved brand fonts are supplied (spec §3). */
const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${identity.projectName} — ${identity.tagline}`,
    template: `%s — ${identity.projectName}`,
  },
  description:
    "Two- and three-bedroom residences and a six-bedroom penthouse on John Babiha (Acacia) Avenue, Kampala, designed around a continuous curved balcony.",
  // Inherited by every page that does not build its own metadata, so this is
  // the single switch for the whole public site. It follows SITE_INDEXABLE
  // rather than being hard-coded: while the flag is off the site stays out of
  // search entirely, and the admin area sets its own noindex regardless.
  robots: SITE_INDEXABLE
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#14100c",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
