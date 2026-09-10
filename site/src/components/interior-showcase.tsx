"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { MediaKindBadge } from "@/components/ui";
import { useMotionAllowed } from "@/lib/use-media-query";
import type { InteriorRoom } from "@/content/types";

/**
 * The interiors, room by room.
 *
 * Two controls: a room selector, and — where the same room exists in more than
 * one residence type — a view selector that crossfades between them.
 *
 * The frame also opens as it scrolls through the middle of the viewport: it
 * starts inset and rounded, then widens toward full bleed as it centres. That
 * is driven by native scroll position written into a CSS variable, so it
 * reverses cleanly, never hijacks the wheel, and animates only cheap
 * properties. Under reduced motion the frame is simply open (spec §3).
 */

interface Props {
  rooms: readonly InteriorRoom[];
}

export function InteriorShowcase({ rooms }: Props) {
  const [roomId, setRoomId] = useState(rooms[0]?.id ?? "");
  const [viewIndex, setViewIndex] = useState(0);

  const frameRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const expands = useMotionAllowed();

  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const room = rooms.find((item) => item.id === roomId) ?? rooms[0];
  const active = room.views[Math.min(viewIndex, room.views.length - 1)];

  const selectRoom = (id: string) => {
    setRoomId(id);
    setViewIndex(0);
    setPlaying(false);
  };

  const selectView = (index: number) => {
    setViewIndex(index);
    setPlaying(false);
  };

  // Playback is always started by the visitor: no autoplay, no sound (spec §3).
  const play = () => {
    setPlaying(true);
    window.requestAnimationFrame(() => void videoRef.current?.play());
  };

  const applyOpen = useCallback(() => {
    rafRef.current = null;
    const frame = frameRef.current;
    if (!frame) return;

    const rect = frame.getBoundingClientRect();
    const viewport = window.innerHeight;

    // 0 while the frame is entering, 1 once its centre reaches the middle of
    // the viewport, held at 1 while it leaves upward.
    const centre = rect.top + rect.height / 2;
    const progress = 1 - Math.min(Math.max((centre - viewport * 0.4) / (viewport * 0.6), 0), 1);

    frame.style.setProperty("--open", progress.toFixed(3));
  }, []);

  const schedule = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = window.requestAnimationFrame(applyOpen);
  }, [applyOpen]);

  useEffect(() => {
    if (!expands) return;

    schedule();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
  }, [expands, schedule]);

  return (
    <div>
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <p className="kicker text-brass-soft">Interior showcase</p>
            <h2 className="display-lg mt-4 text-balance">{room.name}</h2>
            <p className="font-display mt-2 text-xl text-stone-400">
              {room.tagline}
            </p>
          </div>
          <p className="self-end text-lg leading-relaxed text-stone-300 text-pretty">
            {room.body}
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <div
            role="tablist"
            aria-label="Room"
            className="scroll-x -mx-1 flex gap-2 px-1 pb-1"
          >
            {rooms.map((item) => {
              const selected = item.id === room.id;
              return (
                <button
                  key={item.id}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  onClick={() => selectRoom(item.id)}
                  className={`shrink-0 rounded-full border px-5 py-2.5 text-sm transition-colors duration-300 ${
                    selected
                      ? "border-brass-soft bg-brass-soft/15 text-brass-soft"
                      : "border-stone-100/20 text-stone-300 hover:border-stone-100/50 hover:text-stone-100"
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          {room.views.length > 1 ? (
            <div
              role="tablist"
              aria-label="Residence type"
              className="flex shrink-0 gap-1 rounded-full border border-stone-100/15 p-1"
            >
              {room.views.map((view, index) => {
                const selected = index === viewIndex;
                return (
                  <button
                    key={view.label}
                    role="tab"
                    type="button"
                    aria-selected={selected}
                    onClick={() => selectView(index)}
                    className={`rounded-full px-4 py-2 text-xs transition-colors duration-300 ${
                      selected
                        ? "bg-stone-100 text-ink"
                        : "text-stone-400 hover:text-stone-100"
                    }`}
                  >
                    {view.label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      <div
        ref={frameRef}
        style={{ "--open": expands ? "0" : "1" } as React.CSSProperties}
        className="mt-8"
      >
        <div
          className="relative mx-auto aspect-16/10 overflow-hidden"
          style={{
            // Inset and corner radius both relax toward zero as the frame opens.
            width: "calc(100% - (1 - var(--open)) * min(12vw, 12rem))",
            maxWidth: "calc(84rem + var(--open) * 40rem)",
            borderRadius: "calc(1.5rem - var(--open) * 0.75rem)",
            transition: "none",
          }}
        >
          {room.views.map((view, index) => (
            <Image
              key={view.media.src}
              src={view.media.src}
              alt={index === viewIndex ? view.media.alt : ""}
              aria-hidden={index === viewIndex ? undefined : true}
              fill
              sizes="100vw"
              priority={index === 0}
              className="object-cover transition-opacity duration-700 ease-out"
              style={{
                opacity: index === viewIndex ? 1 : 0,
                objectPosition: view.media.focal ?? "50% 50%",
              }}
            />
          ))}

          {/*
            The clip is only mounted once the visitor asks for it, so nothing
            downloads a video on page load. If it fails, the still stays.
          */}
          {active.clip && playing ? (
            <video
              ref={videoRef}
              key={active.clip.src}
              src={active.clip.src}
              poster={active.clip.poster.src}
              controls
              playsInline
              loop
              muted
              onEnded={() => setPlaying(false)}
              className="absolute inset-0 z-10 h-full w-full bg-ink object-cover"
            />
          ) : null}

          <MediaKindBadge
            kind={active.media.kind}
            className="absolute top-5 right-5 z-20"
          />

          {active.clip && !playing ? (
            <button
              type="button"
              onClick={play}
              className="absolute inset-0 z-20 grid place-items-center"
            >
              <span className="flex items-center gap-3 rounded-full bg-ink/65 px-6 py-3.5 text-sm text-stone-50 backdrop-blur-sm transition-colors hover:bg-ink/85">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
                  <path d="M8 5.5v13l11-6.5z" />
                </svg>
                Play walkthrough
                <span className="text-stone-400">{active.clip.durationLabel}</span>
              </span>
            </button>
          ) : null}

          {!playing ? (
            <p className="kicker absolute bottom-5 left-5 z-20 rounded-full bg-ink/55 px-4 py-2 text-stone-200 backdrop-blur-sm">
              {active.media.caption}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
