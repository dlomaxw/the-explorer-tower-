import { Analytics } from "@/components/analytics";
import { LogoIntro } from "@/components/logo-intro";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppWidget } from "@/components/whatsapp-widget";
import { SiteHeader } from "@/components/site-header";

/**
 * The public site's chrome.
 *
 * Scoped to this route group so `/admin` renders without it. The skip link is
 * the first focusable element on every public page.
 */
export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-stone-50"
      >
        Skip to content
      </a>
      <Analytics />
      <LogoIntro />
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      <WhatsAppWidget />
    </>
  );
}
