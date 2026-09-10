"use client";

import { useEffect, useRef, useState } from "react";

import { LOGO_PATH, LOGO_SUBPATHS, LOGO_VIEW_BOX } from "./logo-path";

/**
 * The Explorer mark.
 *
 * The artwork is one continuous line stored as a filled outline. The reveal
 * strokes that outline contour by contour with a dash offset running to zero —
 * so the mark draws itself — and then the solid fill inks in underneath.
 *
 * Contour lengths are measured from the DOM rather than guessed, so the timing
 * holds at any rendered size. Until they are measured, and whenever JavaScript
 * or motion is unavailable, the mark renders solid and complete.
 */

interface MarkProps {
  /** Total milliseconds for the whole mark to draw. */
  drawMs?: number;
  delayMs?: number;
  animate?: boolean;
  className?: string;
  /** Give the mark an accessible name; omit to mark it decorative. */
  title?: string;
}

export function LogoMark({
  drawMs = 2400,
  delayMs = 0,
  animate = false,
  className,
  title,
}: MarkProps) {
  const groupRef = useRef<SVGGElement>(null);
  const [lengths, setLengths] = useState<number[] | null>(null);

  useEffect(() => {
    if (!animate) return;
    const group = groupRef.current;
    if (!group) return;

    const paths = Array.from(group.querySelectorAll("path"));
    try {
      setLengths(paths.map((path) => path.getTotalLength()));
    } catch {
      // Measurement unavailable; the solid mark is already on screen.
    }
  }, [animate]);

  const drawing = animate && lengths !== null;
  const total = lengths?.reduce((sum, value) => sum + value, 0) ?? 0;

  // Contours draw in sequence, each taking a share of the budget proportional
  // to its length, so the line moves at a steady speed across the whole mark.
  // Built by scanning the running total rather than mutating a local, so the
  // render stays a pure function of its inputs.
  const schedule = (lengths ?? []).map((length, index, all) => {
    const share = total > 0 ? (length / total) * drawMs : 0;
    const before = all
      .slice(0, index)
      .reduce((sum, value) => sum + (total > 0 ? (value / total) * drawMs : 0), 0);
    return {
      length,
      start: delayMs + before,
      duration: Math.max(share, 120),
    };
  });

  return (
    <svg
      viewBox={LOGO_VIEW_BOX}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={className}
    >
      <path
        d={LOGO_PATH}
        fill="currentColor"
        style={
          drawing
            ? {
                fillOpacity: 0,
                animation: `logo-ink 900ms ease-out ${delayMs + drawMs - 500}ms forwards`,
              }
            : undefined
        }
      />
      <g
        ref={groupRef}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.1}
        vectorEffect="non-scaling-stroke"
      >
        {LOGO_SUBPATHS.map((d, index) => {
          const step = schedule[index];
          return (
            <path
              key={index}
              d={d}
              style={
                drawing && step
                  ? {
                      strokeDasharray: step.length,
                      strokeDashoffset: step.length,
                      animation: `logo-draw ${step.duration}ms linear ${step.start}ms forwards`,
                    }
                  : { strokeOpacity: 0 }
              }
            />
          );
        })}
      </g>
    </svg>
  );
}

/**
 * Mark plus wordmark, stacked. `EXPLORER` is set in the display serif until the
 * brand typeface is supplied; the letterspacing follows the supplied artwork.
 */
export function Logo({
  animate = false,
  className,
  markClassName = "h-14 w-auto",
  wordClassName = "text-[0.72rem]",
  delayMs = 0,
  drawMs = 2400,
}: {
  animate?: boolean;
  className?: string;
  markClassName?: string;
  wordClassName?: string;
  delayMs?: number;
  drawMs?: number;
}) {
  return (
    <span
      className={`inline-flex flex-col items-center gap-2.5 ${className ?? ""}`}
    >
      <LogoMark
        animate={animate}
        delayMs={delayMs}
        drawMs={drawMs}
        className={markClassName}
        title="Explorer"
      />
      <span
        className={`font-display leading-none tracking-[0.34em] ${wordClassName}`}
        style={
          animate
            ? {
                animation: `rise-in 800ms ease-out ${delayMs + drawMs - 400}ms both`,
              }
            : undefined
        }
      >
        EXPLORER
      </span>
    </span>
  );
}
