"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The scroll-scrubbed journey: street, drive in, under the podium, through the
 * entrance, into the living room, up to the pool.
 *
 * Scroll position drives `video.currentTime` directly — the reel does not play
 * on a clock, it is scrubbed, so it runs forward and backward exactly as fast
 * as the visitor scrolls and stops when they stop. Seeks are exact because the
 * reel is encoded all-keyframe (`tools/build-scrub-reel.py`).
 *
 * This is the enhancement spec §3 permits: a genuine exterior-to-interior move
 * assembled from approved matching footage, not a flythrough faked from stills.
 *
 * Which of the two readings a visitor gets is decided by CSS, not JavaScript,
 * so nothing reflows on hydration: wide screens with motion allowed get the
 * pinned scrub, everyone else gets the same journey as stacked panels. The
 * reel is only fetched once the pinned branch is actually visible, so phones
 * never download it, and if it fails the poster and captions remain.
 */

interface Chapter {
  /**
   * Where in the reel this chapter is centred, 0-1. Must match CHAPTER_MARKS
   * in tools/build-scrub-reel.py, which cuts the still for each one.
   */
  at: number;
  kicker: string;
  heading: string;
  alt: string;
}

const CHAPTERS: readonly Chapter[] = [
  {
    at: 0.04,
    kicker: "Acacia Avenue",
    heading: "You arrive on foot",
    alt: "Looking up at Explorer Towers from the pavement at golden hour.",
  },
  {
    at: 0.21,
    kicker: "The approach",
    heading: "Or you drive in",
    alt: "The view from inside a car turning off Acacia Avenue towards the building.",
  },
  {
    at: 0.38,
    kicker: "The podium",
    heading: "And pull in underneath",
    alt: "Driving in beneath the podium of Explorer Towers, past the parked cars.",
  },
  {
    at: 0.55,
    kicker: "Inside",
    heading: "The hall opens ahead of you",
    alt: "The entrance hall of a three-bedroom residence, looking through to the living rooms.",
  },
  {
    at: 0.72,
    kicker: "The living room",
    heading: "And the city arrives with you",
    alt: "The three-bedroom living room, with the curved glazing open to Kampala.",
  },
  {
    at: 0.9,
    kicker: "Above",
    heading: "Then there is the pool",
    alt: "The penthouse pool at dusk, its infinity edge open to the lights of the city.",
  },
];

const REEL = "/media/journey/reel.mp4";
const POSTER = "/media/journey/first.jpg";

export function ScrollJourney() {
  return (
    <>
      <ScrubbedJourney />
      <StackedJourney />
    </>
  );
}

/** Wide screens, motion allowed. Hidden by CSS everywhere else. */
function ScrubbedJourney() {
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef(0);
  const currentRef = useRef(0);

  const [wanted, setWanted] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [progress, setProgress] = useState(0);

  /**
   * The branch is hidden by CSS on phones, so measuring it is how we learn
   * whether this visitor is actually using it. A hidden element has no height;
   * only a laid-out one asks for the reel.
   */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const check = () => {
      const visible = track.getBoundingClientRect().height > 0;
      setWanted(visible);
      return visible;
    };

    if (check()) return;
    const observer = new ResizeObserver(check);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  const read = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    const travel = rect.height - window.innerHeight;
    if (travel <= 8) return 0;
    return Math.min(Math.max(-rect.top / travel, 0), 1);
  }, []);

  useEffect(() => {
    if (!wanted) return;

    const onScroll = () => {
      const value = read();
      targetRef.current = value;
      setProgress(value);
    };

    /**
     * The playhead eases toward the scroll target on its own loop. Writing
     * `currentTime` straight from the scroll handler makes the picture jitter
     * on a trackpad; easing toward it stays smooth without noticeable lag.
     *
     * The loop lives inside the effect so it can schedule itself without a
     * component-scope binding referring to its own declaration.
     */
    const tick = () => {
      const video = videoRef.current;
      const target = targetRef.current;
      const next = currentRef.current + (target - currentRef.current) * 0.12;
      currentRef.current = Math.abs(target - next) < 0.0004 ? target : next;

      if (video && video.readyState >= 2 && Number.isFinite(video.duration)) {
        const time = currentRef.current * video.duration;
        if (Math.abs(video.currentTime - time) > 1 / 24) {
          video.currentTime = time;
        }
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
  }, [read, wanted]);

  const showVideo = ready && !failed;

  return (
    <section
      ref={trackRef}
      aria-label="From the street to the living room"
      className="relative hidden bg-ink md:motion-safe:block md:motion-safe:h-[420svh]"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="absolute inset-0 isolate">
          <Image
            src={POSTER}
            alt="Explorer Towers seen from the street at golden hour, at the start of the journey into the building."
            fill
            sizes="100vw"
            className="object-cover"
            style={{ opacity: showVideo ? 0 : 1 }}
          />

          {wanted ? (
            <video
              ref={videoRef}
              src={REEL}
              poster={POSTER}
              muted
              playsInline
              preload="auto"
              // Never plays on a clock: the scroll is the transport.
              onLoadedData={() => setReady(true)}
              onError={() => setFailed(true)}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ opacity: showVideo ? 1 : 0 }}
            />
          ) : null}

          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(20,16,12,0.45)_0%,rgba(20,16,12,0.08)_30%,rgba(20,16,12,0.55)_66%,rgba(20,16,12,0.94)_100%)]" />
        </div>

        <div className="shell absolute inset-x-0 bottom-0 z-10 pb-16 md:pb-24">
          <div className="relative min-h-40 md:min-h-48">
            {CHAPTERS.map((chapter, index) => {
              const previous = CHAPTERS[index - 1];
              const next = CHAPTERS[index + 1];

              // Each chapter fades only toward its neighbours, so the first and
              // last hold to the ends of the reel and the sequence never opens
              // or closes on an unlabelled frame.
              const fade = (neighbour: Chapter | undefined) =>
                neighbour
                  ? Math.abs(neighbour.at - chapter.at) * 0.55
                  : Number.POSITIVE_INFINITY;

              const distance = progress - chapter.at;
              const window_ = distance < 0 ? fade(previous) : fade(next);
              const opacity = Math.max(
                0,
                1 - Math.abs(distance) / Math.max(window_, 0.01),
              );

              return (
                <div
                  key={chapter.heading}
                  className="absolute inset-x-0 bottom-0"
                  style={{ opacity }}
                >
                  <p className="kicker mb-3 text-cream drop-shadow-[0_1px_12px_rgba(20,16,12,0.9)]">
                    {chapter.kicker}
                  </p>
                  <p className="display-lg max-w-xl text-stone-50 text-balance drop-shadow-[0_2px_24px_rgba(20,16,12,0.6)]">
                    {chapter.heading}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-stone-100/25" aria-hidden="true">
              <div
                className="h-px bg-cream"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <p className="kicker shrink-0 text-stone-400">Keep scrolling</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Narrow screens and reduced motion: the same journey as stacked panels, each
 * on the frame that chapter is cut from. Every image is lazy, so a desktop
 * visitor — for whom this branch is `display: none` — fetches none of them.
 */
function StackedJourney() {
  return (
    <section
      aria-label="From the street to the living room"
      className="bg-ink md:motion-safe:hidden"
    >
      {CHAPTERS.map((chapter, index) => (
        <div
          key={chapter.heading}
          className="relative isolate flex min-h-[78svh] flex-col justify-end overflow-hidden py-14"
        >
          <Image
            src={`/media/journey/chapter-${index + 1}.jpg`}
            alt={chapter.alt}
            fill
            sizes="100vw"
            loading="lazy"
            className="-z-10 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/30 to-ink/25" />
          <div className="shell">
            <p className="kicker mb-3 text-cream">{chapter.kicker}</p>
            <p className="display-md max-w-md text-stone-50 text-balance">
              {chapter.heading}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
