"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

import { LogoMark } from "@/components/logo";

/**
 * Primary navigation (spec §2).
 *
 * Works by touch and keyboard; the mobile panel is a disclosure driven by a
 * real button, Escape closes it, and focus stays in document order. The private
 * team login lives at /admin and is deliberately absent here.
 */

const NAV = [
  { href: "/project", label: "Project" },
  { href: "/residences", label: "Residences" },
  { href: "/amenities", label: "Amenities" },
  { href: "/gallery", label: "Gallery" },
  { href: "/location", label: "Location" },
  { href: "/progress", label: "Progress" },
  { href: "/downloads", label: "Downloads" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Navigating closes the menu. Adjusting during render rather than in an
  // effect avoids a frame where the new page shows with the menu still open.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Transparent while the opening sequence fills the viewport.
  const transparent = pathname === "/" && !scrolled && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,color] duration-500 ${
        transparent
          ? "border-b border-transparent bg-transparent text-stone-50"
          : "border-b border-stone-200/80 bg-stone-50/85 text-ink backdrop-blur-xl"
      }`}
    >
      <div className="shell flex h-18 items-center justify-between gap-6 md:h-22">
        <Link
          href="/"
          aria-label="Explorer Towers, home"
          className="flex items-center gap-3"
        >
          <LogoMark
            className={`h-9 w-auto shrink-0 transition-colors duration-500 md:h-10 ${
              transparent ? "text-stone-50" : "text-gold"
            }`}
          />
          <span className="font-display text-[0.62rem] leading-none tracking-[0.32em] whitespace-nowrap md:text-[0.7rem]">
            EXPLORER
            <span className="mt-1 block text-[0.85em] tracking-[0.3em] opacity-70">
              TOWERS
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-7">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative py-1 text-sm transition-opacity after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                      active ? "after:scale-x-100" : "opacity-80 hover:opacity-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/contact#inquiry"
            className={`hidden rounded-full px-5 py-2.5 text-sm font-medium transition-colors sm:inline-flex ${
              transparent
                ? "bg-stone-50 text-ink hover:bg-white"
                : "bg-ink text-stone-50 hover:bg-ink-soft"
            }`}
          >
            Register interest
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls={panelId}
            className="-mr-2 inline-flex items-center gap-2.5 rounded-full px-3 py-2 text-sm xl:hidden"
          >
            <span className="grid gap-1.5" aria-hidden="true">
              <span
                className={`block h-px w-5 bg-current transition-transform duration-300 ${
                  open ? "translate-y-[3.5px] rotate-6" : ""
                }`}
              />
              <span
                className={`block h-px w-5 bg-current transition-transform duration-300 ${
                  open ? "-translate-y-[3.5px] -rotate-6" : ""
                }`}
              />
            </span>
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <div
        id={panelId}
        hidden={!open}
        className="border-t border-stone-200 bg-stone-50 text-ink xl:hidden"
      >
        <nav aria-label="Primary, mobile" className="shell py-6">
          <ul className="grid gap-px">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block border-b border-stone-200 py-3.5 font-display text-2xl"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/contact#inquiry"
            className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-stone-50"
          >
            Register interest
          </Link>
        </nav>
      </div>
    </header>
  );
}
