import Image from "next/image";
import Link from "next/link";

import { LogoMark } from "@/components/logo";
import { MediaKindBadge } from "@/components/ui";
import { isApproved, type ResidenceType } from "@/content/types";

/**
 * One residence tier, in its own brand ground.
 *
 * `data-tier` switches the `--tier-*` tokens defined in globals.css, so the
 * card, the mark and every accent inside pick up that tier's colours from one
 * attribute: white for the two-bedroom, forest green for the three-bedroom,
 * clay brown for the penthouse.
 */
export function ResidenceCard({
  residence,
  priority = false,
}: {
  residence: ResidenceType;
  priority?: boolean;
}) {
  return (
    <article
      data-tier={residence.slug}
      className="group relative isolate flex h-full flex-col overflow-hidden rounded-3xl bg-(--tier-ground) text-(--tier-ink) ring-1 ring-ink/8 transition-transform duration-500 ease-out hover:-translate-y-1"
    >
      <Link href={`/residences/${residence.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-4/3 overflow-hidden">
          <Image
            src={residence.hero.src}
            alt={residence.hero.alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
            style={{ objectPosition: residence.hero.focal ?? "50% 50%" }}
          />
          <MediaKindBadge
            kind={residence.hero.kind}
            className="absolute top-4 right-4"
          />
        </div>

        <div className="flex flex-1 items-start gap-5 p-6 md:p-8">
          <LogoMark className="mt-1 h-10 w-auto shrink-0 text-(--tier-line)" />
          <div className="flex flex-1 flex-col">
            <p className="kicker text-(--tier-line)">
              {residence.bedrooms === null
                ? "Upper level"
                : `${residence.bedrooms} bedrooms`}
            </p>
            <h3 className="display-md mt-2">{residence.name}</h3>
            <p className="mt-3 leading-relaxed text-(--tier-muted) text-pretty">
              {residence.summary}
            </p>
            {/*
              The price is the line most visitors are looking for, so it gets a
              rule and the tier's own accent rather than sitting in the body
              copy. An unreleased price stays deliberately quieter: it is an
              invitation to ask, not a figure, and should not be mistaken for one.
            */}
            <div className="mt-auto border-t border-(--tier-rule) pt-5">
              {isApproved(residence.price) ? (
                <p className="font-display text-2xl leading-none text-(--tier-line) md:text-[1.75rem]">
                  {residence.price.value}
                </p>
              ) : (
                <p className="text-sm text-(--tier-muted)">
                  {residence.price.prompt}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
