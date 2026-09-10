import Link from "next/link";

import { LogoMark } from "@/components/logo";
import { siteContent } from "@/lib/content";
import { isApproved } from "@/content/types";
import { Value } from "@/components/ui";
import { DeveloperCredit } from "@/components/developer-credit";
import { MarketingCredit } from "@/components/marketing-credit";

const COLUMNS = [
  {
    heading: "The project",
    links: [
      { href: "/project", label: "Overview" },
      { href: "/residences", label: "Residences" },
      { href: "/amenities", label: "Amenities" },
      { href: "/location", label: "Location" },
    ],
  },
  {
    heading: "Media",
    links: [
      { href: "/gallery", label: "Gallery" },
      { href: "/progress", label: "Construction progress" },
      { href: "/downloads", label: "Downloads" },
    ],
  },
  {
    heading: "Enquire",
    links: [
      { href: "/contact#inquiry", label: "Register interest" },
      { href: "/contact#callback", label: "Request a callback" },
      { href: "/contact#visit", label: "Book a site visit" },
      { href: "/faq", label: "Questions" },
    ],
  },
] as const;

export async function SiteFooter() {
  const { contact, identity } = await siteContent();

  return (
    <footer className="bg-ink text-stone-300">
      <div className="shell py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <LogoMark className="h-16 w-auto text-cream" title="Explorer" />
            <p className="font-display mt-3 text-sm leading-none tracking-[0.34em] text-cream">
              EXPLORER TOWERS
            </p>
            <p className="mt-5 max-w-xs leading-relaxed text-pretty">
              {identity.tagline}
            </p>
            <address className="mt-6 space-y-1 text-sm not-italic">
              <p>
                <Value field={contact.address} />
              </p>
              <p>
                {isApproved(contact.phone) ? (
                  <a
                    href={`tel:${contact.phone.value.replace(/[^\d+]/g, "")}`}
                    className="hover:text-cream"
                  >
                    {contact.phone.value}
                  </a>
                ) : (
                  <Link href="/contact" className="hover:text-cream">
                    {contact.phone.prompt}
                  </Link>
                )}
              </p>
              <p>
                {isApproved(contact.email) ? (
                  <a
                    href={`mailto:${contact.email.value}`}
                    className="hover:text-cream"
                  >
                    {contact.email.value}
                  </a>
                ) : (
                  <Link href="/contact" className="hover:text-cream">
                    {contact.email.prompt}
                  </Link>
                )}
              </p>
            </address>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="kicker text-stone-500">{column.heading}</h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-cream">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 border-t border-stone-700/60 pt-10">
          {/*
            The approved lockup, on a light plate. The Shoal mark is a dark
            block with reversed type and would vanish against this footer, and
            recolouring supplied brand artwork is not ours to do.
          */}
          {/*
            Aligned from the top so the two kickers sit on one line and the
            plates below them line up, rather than being pushed around by
            whichever block happens to carry more text.
          */}
          <div className="mb-10 flex flex-wrap items-start gap-x-14 gap-y-10">
            <DeveloperCredit
              plate
              size="medium"
              label="Developed by"
              showName={false}
            />
            <MarketingCredit tone="dark" showOffice />
          </div>

          {/*
            The render disclaimer lives on /terms rather than here. It is linked
            below, every image carries its own Render badge, and repeating the
            paragraph in the footer of every page added weight without adding
            protection.
          */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500">
            <p>
              © {new Date().getFullYear()} {identity.projectName}. A development
              by <Value field={identity.developer} /> with Shoal Group.
            </p>
            <ul className="flex flex-wrap gap-5">
              <li>
                <Link href="/privacy" className="hover:text-stone-300">
                  Privacy notice
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-stone-300">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
