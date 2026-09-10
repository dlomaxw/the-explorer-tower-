"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { MediaKindBadge } from "@/components/ui";
import { useHoverPointer, useMotionAllowed } from "@/lib/use-media-query";
import type { Film } from "@/content/types";

/**
 * The exterior films.
 *
 * How playback starts depends on what the device can tell us:
 *   * a pointer that hovers  — the clip previews on hover and stops on leave;
 *   * touch, or no hover     — the clip previews once it is properly on screen;
 *   * either                 — pressing it plays with controls, and controls
 *                              always win over the preview.
 *
 * Previews are muted and loop, so nothing makes noise and nothing plays before
 * the visitor can see it. Reduced motion turns previews off entirely and leaves
 * the poster with its play control. The clip element only mounts when it is
 * wanted, so a page view costs a poster, not several megabytes of video.
 */

type Mode = "poster" | "preview" | "playing";

export function FilmStrip({ films }: { films: readonly Film[] }) {
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<Mode>("poster");

  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const active = films[index];

  // Without a hovering pointer the preview is triggered by the frame coming
  // into view instead. Reduced motion disables previews altogether.
  const motionAllowed = useMotionAllowed();
  const canHover = useHoverPointer();
  const autoPreview = motionAllowed && !canHover;
  const hoverPreview = motionAllowed && canHover;

  const startPreview = useCallback(() => {
    setMode((current) => (current === "playing" ? current : "preview"));
  }, []);

  const stopPreview = useCallback(() => {
    setMode((current) => (current === "playing" ? current : "poster"));
  }, []);

  // Touch and other pointer-less devices: preview while the frame is on screen.
  useEffect(() => {
    if (!autoPreview) return;
    const frame = frameRef.current;
    if (!frame || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? startPreview() : stopPreview()),
      { threshold: 0.6 },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, [autoPreview, startPreview, stopPreview]);

  // Drive the element from the mode rather than calling play() at the call
  // sites, so a fast hover in-and-out cannot leave a pending play() to reject.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (mode === "poster") {
      video.pause();
      return;
    }

    video.currentTime = 0;
    const attempt = video.play();
    if (attempt) attempt.catch(() => setMode("poster"));
  }, [mode, index]);

  const choose = (next: number) => {
    setIndex(next);
    setMode("poster");
  };

  const showVideo = mode !== "poster";

  return (
    <div>
      <div
        ref={frameRef}
        onMouseEnter={hoverPreview ? startPreview : undefined}
        onMouseLeave={hoverPreview ? stopPreview : undefined}
        className="relative aspect-16/9 overflow-hidden rounded-3xl bg-ink"
      >
        <Image
          src={active.clip.poster.src}
          alt={active.clip.poster.alt}
          fill
          sizes="(min-width: 1024px) 74vw, 100vw"
          className="object-cover"
        />

        {showVideo ? (
          <video
            ref={videoRef}
            key={active.clip.src}
            src={active.clip.src}
            poster={active.clip.poster.src}
            controls={mode === "playing"}
            playsInline
            loop
            muted
            className="absolute inset-0 z-10 h-full w-full bg-ink object-cover"
          />
        ) : null}

        {mode !== "playing" ? (
          <button
            type="button"
            onClick={() => setMode("playing")}
            className="absolute inset-0 z-20 grid place-items-center transition-colors"
          >
            <span
              className="flex items-center gap-3 rounded-full bg-ink/70 px-6 py-3.5 text-sm text-stone-50 backdrop-blur-sm transition-opacity duration-500"
              style={{ opacity: mode === "preview" ? 0.35 : 1 }}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="size-4 fill-current"
              >
                <path d="M8 5.5v13l11-6.5z" />
              </svg>
              Play {active.title.toLowerCase()}
              <span className="text-stone-400">{active.clip.durationLabel}</span>
            </span>
          </button>
        ) : null}

        <MediaKindBadge
          kind={active.clip.poster.kind}
          className="absolute top-5 right-5 z-20"
        />
      </div>

      <div
        role="tablist"
        aria-label="Films"
        className="scroll-x mt-4 flex gap-3 pb-2"
      >
        {films.map((item, position) => {
          const selected = position === index;
          return (
            <button
              key={item.id}
              role="tab"
              type="button"
              aria-selected={selected}
              onClick={() => choose(position)}
              className={`group relative aspect-16/9 w-40 shrink-0 overflow-hidden rounded-lg transition-opacity duration-300 md:w-48 ${
                selected ? "ring-2 ring-cream" : "opacity-55 hover:opacity-100"
              }`}
            >
              <Image
                src={item.clip.poster.src}
                alt=""
                fill
                loading="lazy"
                sizes="200px"
                className="object-cover"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent px-3 pt-6 pb-2 text-left text-xs text-stone-100">
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
