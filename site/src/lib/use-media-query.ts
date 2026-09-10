"use client";

import { useSyncExternalStore } from "react";

/**
 * Subscribes to a CSS media query.
 *
 * `useSyncExternalStore` rather than `useEffect` + `setState`: a media query is
 * external state, so React should read it rather than be told about it after
 * the fact. That avoids the extra render an effect-and-set pattern costs, and
 * keeps the server snapshot explicit.
 *
 * The server has no viewport, so `serverValue` decides what is rendered before
 * hydration. Pick the value that produces the safest markup — usually the one
 * that shows content rather than hides it.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** True when the visitor has not asked for reduced motion. */
export function useMotionAllowed(): boolean {
  return !useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** True when the pointer can hover — a mouse or trackpad rather than touch. */
export function useHoverPointer(): boolean {
  return useMediaQuery("(hover: hover)");
}

/**
 * False while rendering on the server and during hydration, true afterwards.
 *
 * For UI that genuinely cannot exist until the client is running — anything
 * that depends on `sessionStorage`, for instance. Using the store rather than
 * an effect keeps the hydration pass matching the server exactly, so React
 * never has to reconcile markup that could not have been rendered twice.
 */
const emptySubscribe = () => () => {};

export function useIsClient(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
