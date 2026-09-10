import Image from "next/image";

import { developerLockup, identity } from "@/content/site";
import { isApproved } from "@/content/types";

/**
 * The developer credit.
 *
 * The two marks are one asset, so there is no arrangement to get wrong here —
 * the component sizes the supplied lockup and never draws the parties
 * separately. Anything that needs to name the developer in prose uses
 * `identity.developer`; this is the artwork.
 *
 * `plate` puts the lockup on a light card. The Shoal mark is a dark block with
 * reversed type, so it disappears on a dark ground; a plate keeps the artwork
 * untouched instead of recolouring approved brand assets to suit the page.
 */
export function DeveloperCredit({
  size = "medium",
  plate = false,
  label = "Developed by",
  showName = true,
  className,
}: {
  size?: "small" | "medium" | "large";
  plate?: boolean;
  label?: string | null;
  /** Set false where the surrounding copy already names the developer. */
  showName?: boolean;
  className?: string;
}) {
  const heights = {
    small: "h-10",
    medium: "h-14 md:h-16",
    large: "h-20 md:h-24",
  } as const;

  const lockup = (
    <Image
      src={developerLockup.src}
      alt={developerLockup.alt}
      width={developerLockup.width}
      height={developerLockup.height}
      // The lockup carries small type — "GROUP" and "DEVELOPMENT". Ask for
      // roughly twice the drawn width so it stays crisp on a dense screen.
      sizes="(min-width: 768px) 560px, 420px"
      quality={90}
      className={`${heights[size]} w-auto`}
    />
  );

  return (
    <div className={className}>
      {label ? (
        <p className="kicker mb-3 text-stone-500">{label}</p>
      ) : null}

      {plate ? (
        <div className="inline-flex rounded-xl bg-stone-50 px-5 py-4">
          {lockup}
        </div>
      ) : (
        lockup
      )}

      {showName && isApproved(identity.developer) ? (
        <p className="mt-3 text-sm text-stone-500">
          {identity.developer.value}
        </p>
      ) : null}
    </div>
  );
}
