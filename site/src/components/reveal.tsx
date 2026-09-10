"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Reveals its children as they scroll into view.
 *
 * Progressive enhancement, deliberately: the content is rendered visible in the
 * markup and only *becomes* hidden once this component has mounted and
 * confirmed both IntersectionObserver and a no-preference motion setting. With
 * JavaScript off, motion reduced, or the observer unavailable, everything is
 * simply on screen — the animation can never hide content it then fails to
 * bring back (spec §3, §13).
 */

interface Props {
  children: ReactNode;
  /** Milliseconds to wait after the element enters view. */
  delay?: number;
  /** Distance travelled, in pixels. */
  distance?: number;
  as?: ElementType;
  className?: string;
}

export function Reveal({
  children,
  delay = 0,
  distance = 24,
  as: Tag = "div",
  className,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // Anything already on screen at mount stays put; only content still below
    // the fold gets hidden, so the first paint never flickers.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) return;

    setArmed(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const hidden = armed && !shown;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: hidden ? 0 : 1,
        transform: hidden ? `translateY(${distance}px)` : "none",
        transition: armed
          ? `opacity 900ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 900ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`
          : undefined,
      }}
    >
      {children}
    </Tag>
  );
}

/** Staggers a list of children, each revealing shortly after the last. */
export function RevealGroup({
  children,
  step = 90,
  className,
  as,
}: {
  children: ReactNode[];
  step?: number;
  className?: string;
  as?: ElementType;
}) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <Reveal key={index} as={as} delay={index * step}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
