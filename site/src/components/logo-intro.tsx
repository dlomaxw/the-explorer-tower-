"use client";

import { useEffect, useState } from "react";

import { Logo } from "@/components/logo";
import { useIsClient, useMotionAllowed } from "@/lib/use-media-query";

/**
 * The mark drawing itself on arrival.
 *
 * Deliberately not a loading gate (spec §3 forbids one). The page underneath is
 * already rendered and interactive; this is an overlay that paints over it for a
 * moment and then leaves. It is inert to assistive technology and to the
 * keyboard, dismisses on any interaction, is skipped entirely under reduced
 * motion, and plays once per session — a visitor moving between pages does not
 * sit through it again.
 */

const SESSION_KEY = "explorer:intro-played";
const DRAW_MS = 2400;
const HOLD_MS = 550;

/**
 * Reads and claims the once-per-session flag in a single step, during the
 * initial state calculation rather than in an effect, so the overlay is never
 * mounted for a visitor who should not see it.
 */
function claimFirstVisit(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.sessionStorage.getItem(SESSION_KEY) === "1") return false;
    window.sessionStorage.setItem(SESSION_KEY, "1");
    return true;
  } catch {
    // Session storage blocked. Play it, and accept that it may play again.
    return true;
  }
}

export function LogoIntro() {
  // The server cannot know whether this session has already seen the intro, so
  // it renders nothing and the client decides once hydration is complete.
  const isClient = useIsClient();
  const motionAllowed = useMotionAllowed();
  const [firstVisit] = useState(claimFirstVisit);
  const [phase, setPhase] = useState<"playing" | "leaving" | "gone">("playing");

  const active = isClient && motionAllowed && firstVisit && phase !== "gone";

  useEffect(() => {
    if (!active || phase !== "playing") return;

    const dismiss = () => setPhase("leaving");
    const timer = window.setTimeout(dismiss, DRAW_MS + HOLD_MS);

    window.addEventListener("pointerdown", dismiss, { once: true });
    window.addEventListener("keydown", dismiss, { once: true });
    window.addEventListener("wheel", dismiss, { once: true, passive: true });
    window.addEventListener("touchstart", dismiss, { once: true, passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("wheel", dismiss);
      window.removeEventListener("touchstart", dismiss);
    };
  }, [active, phase]);

  useEffect(() => {
    if (phase !== "leaving") return;
    const timer = window.setTimeout(() => setPhase("gone"), 900);
    return () => window.clearTimeout(timer);
  }, [phase]);

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      inert
      className="pointer-events-none fixed inset-0 z-90 grid place-items-center bg-stone-50 text-gold transition-opacity duration-700 ease-out"
      style={{ opacity: phase === "leaving" ? 0 : 1 }}
    >
      <Logo
        animate
        drawMs={DRAW_MS}
        markClassName="h-32 w-auto sm:h-40"
        wordClassName="text-sm sm:text-base"
      />
    </div>
  );
}
