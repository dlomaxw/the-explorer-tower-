import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import { identity } from "@/content/site";

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
  robots: {
    // The site stays out of search indexes until the client approves the
    // content and confirms the official domain (spec §14, open inputs).
    index: false,
    follow: false,
  },
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
