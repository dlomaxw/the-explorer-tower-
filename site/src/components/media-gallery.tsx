"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { MediaKindBadge } from "@/components/ui";
import type { Media, MediaCategory } from "@/content/types";

/**
 * Filterable grid with an accessible lightbox (spec §2).
 *
 * The lightbox is a real dialog: focus moves into it, Escape and the arrow keys
 * work, focus returns to the thumbnail that opened it, and the page behind it
 * cannot be scrolled or tabbed into.
 */

const CATEGORY_LABELS: Record<MediaCategory, string> = {
  exterior: "Exterior",
  interior: "Interiors",
  amenities: "Amenities",
  construction: "Construction",
};

interface Props {
  items: readonly Media[];
  filterable?: boolean;
}

export function MediaGallery({ items, filterable = false }: Props) {
  const [category, setCategory] = useState<MediaCategory | "all">("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggersRef = useRef<(HTMLButtonElement | null)[]>([]);
  const lastTriggerRef = useRef<number | null>(null);

  const categories = Array.from(new Set(items.map((item) => item.category)));
  const visible =
    category === "all"
      ? items
      : items.filter((item) => item.category === category);

  // The dialog is opened and closed imperatively rather than from an effect on
  // `openIndex`. Driving it from state races with the browser's own Escape
  // handling: the dialog closes, `onClose` clears the state, and an effect that
  // still sees the old value immediately re-opens it.
  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const changeCategory = (next: MediaCategory | "all") => {
    close();
    setCategory(next);
  };

  const open = useCallback((index: number) => {
    lastTriggerRef.current = index;
    setOpenIndex(index);
    dialogRef.current?.showModal();
  }, []);

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((current) => {
        if (current === null) return current;
        const next = (current + delta + visible.length) % visible.length;
        return next;
      });
    },
    [visible.length],
  );

  useEffect(() => {
    if (openIndex === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, step]);

  // Returning focus to the thumbnail keeps keyboard position after closing.
  const onDialogClose = () => {
    const index = lastTriggerRef.current;
    setOpenIndex(null);
    if (index !== null) triggersRef.current[index]?.focus();
  };

  const active = openIndex === null ? null : visible[openIndex];

  return (
    <div>
      {filterable && categories.length > 1 ? (
        <div className="scroll-x -mx-1 mb-10 flex gap-2 px-1 pb-2">
          <FilterChip
            active={category === "all"}
            onClick={() => changeCategory("all")}
          >
            All
          </FilterChip>
          {categories.map((value) => (
            <FilterChip
              key={value}
              active={category === value}
              onClick={() => changeCategory(value)}
            >
              {CATEGORY_LABELS[value]}
            </FilterChip>
          ))}
        </div>
      ) : null}

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item, index) => (
          <li key={item.src}>
            <button
              type="button"
              ref={(node) => {
                triggersRef.current[index] = node;
              }}
              onClick={() => open(index)}
              className="group relative block aspect-4/3 w-full overflow-hidden rounded-xl bg-stone-200"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                loading={index < 6 ? undefined : "lazy"}
                priority={index < 3}
                sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                style={{ objectPosition: item.focal ?? "50% 50%" }}
              />
              <MediaKindBadge
                kind={item.kind}
                className="absolute top-3 right-3"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-4 text-left text-sm text-stone-100">
                {item.caption}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={onDialogClose}
        onClick={(event) => {
          // Clicking the backdrop (the dialog element itself) closes it.
          if (event.target === dialogRef.current) close();
        }}
        aria-label="Image viewer"
        className="max-h-none max-w-none bg-transparent backdrop:bg-ink/92 open:fixed open:inset-0 open:grid open:h-full open:w-full open:place-items-center"
      >
        {active ? (
          <div className="relative flex h-full w-full flex-col justify-center p-4 md:p-10">
            <div className="relative mx-auto w-full max-w-6xl">
              <Image
                src={active.src}
                alt={active.alt}
                width={active.width}
                height={active.height}
                sizes="100vw"
                className="mx-auto h-auto max-h-[74svh] w-auto rounded-lg object-contain"
              />
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-stone-300">
                <p>{active.caption}</p>
                <p>
                  {(openIndex ?? 0) + 1} of {visible.length}
                </p>
              </div>
            </div>

            <div className="absolute inset-x-4 top-4 flex justify-end md:inset-x-10 md:top-10">
              <button
                type="button"
                autoFocus
                onClick={close}
                className="rounded-full border border-stone-100/40 px-4 py-2 text-sm text-stone-100 hover:bg-stone-50/10"
              >
                Close
              </button>
            </div>

            {visible.length > 1 ? (
              <div className="absolute inset-x-4 bottom-4 flex justify-between md:inset-x-10 md:bottom-10">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="rounded-full border border-stone-100/40 px-4 py-2 text-sm text-stone-100 hover:bg-stone-50/10"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="rounded-full border border-stone-100/40 px-4 py-2 text-sm text-stone-100 hover:bg-stone-50/10"
                >
                  Next
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </dialog>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full border px-5 py-2 text-sm transition-colors ${
        active
          ? "border-ink bg-ink text-stone-50"
          : "border-stone-300 text-stone-600 hover:border-ink hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
