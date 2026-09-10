"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import type { AnimationScene } from "@/content/types";
import { ButtonLink, MediaKindBadge } from "@/components/ui";

/**
 * The opening scroll sequence (spec §3).
 *
 * Desktop runs one pinned sequence over ~220vh: a CSS `position: sticky` stage
 * inside a tall track, so scroll progress follows native scrolling, reverses
 * cleanly, and never hijacks the wheel. JavaScript only reads the track's
 * position and writes opacity/transform — if it never runs, the poster and all
 * page content are still there.
 *
 * Mobile and reduced-motion collapse the track with a CSS media query (not a
 * JS branch, so there is no layout jump on hydration) and the scenes are read
 * as ordinary stacked panels instead.
 */

const SCENE_GAP_MS = 520;

/** Fraction of each scroll step spent crossfading; the rest is a clean hold. */
const FADE_SHARE = 0.42;

interface Props {
  scenes: readonly AnimationScene[];
}

export function OpeningSequence({ scenes }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [skipped, setSkipped] = useState(false);
  const [entered, setEntered] = useState(false);

  // Subtle entrance fade, 400-700ms per spec. Runs once, after first paint.
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  const applyProgress = useCallback(() => {
    frameRef.current = null;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    const rect = track.getBoundingClientRect();
    const travel = rect.height - window.innerHeight;

    // Track collapsed to one viewport (mobile, reduced motion, or skipped):
    // hold the poster and let the page scroll normally.
    if (travel <= 8) {
      stage.style.setProperty("--progress", "0");
      return;
    }

    const progress = Math.min(Math.max(-rect.top / travel, 0), 1);
    stage.style.setProperty("--progress", progress.toFixed(4));
  }, []);

  const schedule = useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = window.requestAnimationFrame(applyProgress);
  }, [applyProgress]);

  useEffect(() => {
    if (skipped) return;

    // Initialise only once layout is stable, then follow native scroll.
    schedule();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("orientationchange", schedule);

    // Resizing must recalculate without losing scroll position: the track is
    // measured from its live rect, so re-reading is all that is required.
    const track = trackRef.current;
    const observer = new ResizeObserver(schedule);
    if (track) observer.observe(track);
    observer.observe(document.documentElement);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("orientationchange", schedule);
      observer.disconnect();
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [schedule, skipped]);

  const skip = () => {
    setSkipped(true);
    document.getElementById("after-opening")?.scrollIntoView({ block: "start" });
  };

  const poster = scenes[0];
  const steps = Math.max(scenes.length - 1, 1);

  return (
    <>
      <div
        ref={trackRef}
        data-skipped={skipped || undefined}
        className="relative h-svh md:motion-safe:h-[220vh] data-[skipped]:h-svh!"
      >
        <div
          ref={stageRef}
          style={{ "--progress": "0" } as React.CSSProperties}
          className="sticky top-0 h-svh w-full overflow-hidden bg-ink"
        >
          {/*
            Decorative imagery: the same information is in the headings below.
            `isolate` keeps the layers' z-indexes inside this wrapper — without
            it they compete with the caption and action layers above.
          */}
          <div aria-hidden="true" className="absolute inset-0 isolate">
            {scenes.map((scene, index) => (
              <SceneLayer
                key={scene.id}
                scene={scene}
                index={index}
                steps={steps}
                isPoster={index === 0}
                frozen={skipped}
              />
            ))}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(20,16,12,0.55)_0%,rgba(20,16,12,0.12)_28%,rgba(20,16,12,0.5)_62%,rgba(20,16,12,0.92)_100%)]" />
          </div>

          {/*
            One bottom-anchored block. The captions are layered inside a box of
            reserved height so they crossfade in place without pushing the
            actions around as the sequence advances.
          */}
          {/*
            A local scrim under the type, on top of the page-wide one. The
            scenes vary from a dark street to a bright pool, so the captions
            need contrast that does not depend on which image is showing.
          */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[62%] bg-[linear-gradient(to_top,rgba(20,16,12,0.9)_0%,rgba(20,16,12,0.72)_32%,rgba(20,16,12,0.32)_66%,transparent_100%)]"
          />

          <div className="shell absolute inset-x-0 bottom-0 z-20 pb-16 md:pb-20">
            <div className="relative min-h-64 md:min-h-72">
              {scenes.map((scene, index) => (
                <SceneCaption
                  key={scene.id}
                  scene={scene}
                  index={index}
                  steps={steps}
                  isPoster={index === 0}
                  entered={entered}
                  frozen={skipped}
                />
              ))}
            </div>

            <div className="relative z-10 flex flex-wrap items-center gap-3">
              <ButtonLink href="/residences" variant="light">
                Explore residences
              </ButtonLink>
              <ButtonLink href="/contact#inquiry" variant="outlineLight">
                Register interest
              </ButtonLink>
            </div>
          </div>

          <MediaKindBadge
            kind="render"
            className="absolute top-24 right-5 z-20 md:right-10"
          />

          {!skipped ? (
            <button
              type="button"
              onClick={skip}
              className="absolute right-5 bottom-6 z-20 hidden rounded-full border border-stone-100/40 px-4 py-2 text-xs text-stone-100 transition-colors hover:border-stone-50 hover:bg-stone-50/10 md:right-10 md:motion-safe:block"
            >
              Skip animation
            </button>
          ) : null}
        </div>
      </div>

      {/*
        No stacked fallback here. Where this sequence is not pinned — narrow
        screens, reduced motion — the scroll journey immediately below covers
        the same ground with the approved footage, and running both left mobile
        visitors scrolling through ten full-bleed panels before any copy.
      */}

      <span id="after-opening" className="sr-only" />
      <h1 className="sr-only">
        {poster.heading} — {poster.body}
      </h1>
    </>
  );
}

/**
 * One crossfading image layer. Opacity and transform only, both cheap to
 * composite; the scale range is clamped to the 1.00-1.06 the spec allows.
 */
function SceneLayer({
  scene,
  index,
  steps,
  isPoster,
  frozen,
}: {
  scene: AnimationScene;
  index: number;
  steps: number;
  isPoster: boolean;
  frozen: boolean;
}) {
  const center = index / steps;
  const span = 1 / steps;
  const zoom = (scene.zoomTo - 1).toFixed(4);

  // Each scene holds, then crossfades quickly into the next. A fade spread
  // across the whole step reads as a double exposure rather than a cut, so the
  // blend happens in the last third of the step and each image is held clean
  // either side of it.
  const fadeStart = center - span * FADE_SHARE;
  const fadeSpan = span * FADE_SHARE;

  // Layers stack by index, so the poster stays fully opaque underneath: a later
  // scene that fails to load can never leave a blank stage.
  const opacity = isPoster
    ? 1
    : `clamp(0, calc((var(--progress) - ${fadeStart.toFixed(4)}) / ${fadeSpan.toFixed(4)}), 1)`;

  return (
    <div
      className="absolute inset-0"
      style={{
        opacity: frozen && !isPoster ? 0 : opacity,
        zIndex: index,
      }}
    >
      <Image
        src={scene.media.src}
        alt=""
        fill
        priority={isPoster}
        loading={isPoster ? undefined : "lazy"}
        sizes="100vw"
        className="object-cover will-change-transform"
        style={{
          objectPosition: scene.media.focal ?? "50% 50%",
          transform: frozen
            ? undefined
            : `scale(calc(1 + ${zoom} * clamp(0, calc((var(--progress) - ${fadeStart.toFixed(4)}) / ${(span * 1.6).toFixed(4)}), 1)))`,
        }}
      />
    </div>
  );
}

function SceneCaption({
  scene,
  index,
  steps,
  isPoster,
  entered,
  frozen,
}: {
  scene: AnimationScene;
  index: number;
  steps: number;
  isPoster: boolean;
  entered: boolean;
  frozen: boolean;
}) {
  const center = index / steps;
  const span = 1 / steps;
  const isLast = index === steps;

  const fadeIn = `clamp(0, calc((var(--progress) - ${(center - span * FADE_SHARE).toFixed(4)}) / ${(span * FADE_SHARE * 0.7).toFixed(4)}), 1)`;
  const fadeOut = isLast
    ? "1"
    : `clamp(0, calc(1 - (var(--progress) - ${(center + span * (1 - FADE_SHARE)).toFixed(4)}) / ${(span * FADE_SHARE * 0.7).toFixed(4)}), 1)`;

  const opacity = isPoster
    ? `min(${fadeOut}, 1)`
    : `min(${fadeIn}, ${fadeOut})`;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0"
      style={{
        opacity: frozen ? (isPoster ? 1 : 0) : opacity,
        transition: isPoster ? `opacity ${SCENE_GAP_MS}ms ease-out` : undefined,
      }}
    >
      <div>
        <div
          className="max-w-2xl text-stone-50 drop-shadow-[0_2px_24px_rgba(20,16,12,0.55)]"
          style={{
            opacity: isPoster && !entered ? 0 : 1,
            transform: isPoster && !entered ? "translateY(12px)" : "none",
            transition: isPoster
              ? `opacity ${SCENE_GAP_MS}ms ease-out, transform ${SCENE_GAP_MS}ms ease-out`
              : undefined,
          }}
        >
          {scene.kicker ? (
            <p className="kicker mb-4 text-cream">{scene.kicker}</p>
          ) : null}
          {scene.heading ? (
            <p className={isPoster ? "display-xl" : "display-lg"}>
              {scene.heading}
            </p>
          ) : null}
          {scene.body ? (
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-stone-200 text-pretty">
              {scene.body}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
