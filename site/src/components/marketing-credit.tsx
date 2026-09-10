import { existsSync } from "node:fs";
import path from "node:path";

import Image from "next/image";

import { marketingAgent } from "@/content/site";

/**
 * The marketing agent credit.
 *
 * Separate from the developer lockup on purpose: 969 Development Company
 * Limited builds it, Bright Properties markets it, and running the two credits
 * together would imply a relationship that is not there.
 *
 * The logo is optional. The artwork has not been handed over yet, so the
 * component checks for the file at render time and falls back to the name set
 * in type. That means no broken image in the meantime, and the logo appears on
 * its own the moment the file is dropped in — no code change needed.
 */

const LOGO_FILE = path.join(process.cwd(), "public", marketingAgent.logo);

export function MarketingCredit({
  className,
  tone = "light",
  showOffice = false,
}: {
  className?: string;
  /** `dark` for the footer, where the ground is ink rather than stone. */
  tone?: "light" | "dark";
  /** Include the office address and a link to it on the map. */
  showOffice?: boolean;
}) {
  const hasLogo = existsSync(LOGO_FILE);

  const muted = tone === "dark" ? "text-stone-500" : "text-stone-500";
  const strong = tone === "dark" ? "text-stone-300" : "text-ink";

  return (
    <div className={className}>
      <p className={`kicker mb-3 ${muted}`}>{marketingAgent.role}</p>

      {/*
        The plate and the office sit on one row, so this mark lines up with the
        developer lockup beside it instead of being pushed up by text stacked
        underneath. The plate exists for the same reason the lockup's does: the
        wordmark is black and would vanish against the footer.

        Both plates are built to the same height, so the two marks align on a
        shared baseline even though their proportions differ.
      */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        {hasLogo ? (
          <span className="inline-flex shrink-0 items-center rounded-xl bg-stone-50 px-5 py-4">
            <Image
              src={marketingAgent.logo}
              alt={marketingAgent.name}
              width={539}
              height={256}
              sizes="(min-width: 768px) 320px, 240px"
              quality={90}
              className="h-14 w-auto md:h-16"
            />
          </span>
        ) : (
          <p className={`font-display text-lg ${strong}`}>
            {marketingAgent.name}
          </p>
        )}

        {showOffice ? (
          <div className={`text-sm leading-relaxed ${muted}`}>
            <p>{marketingAgent.legalName}</p>
            <p>{marketingAgent.office.address}</p>
            <a
              href={marketingAgent.office.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block underline underline-offset-4 hover:text-brass"
            >
              Find the office on the map
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
