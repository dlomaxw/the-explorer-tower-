"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { contactDigits } from "@/content/site";
import { track } from "@/components/analytics";

/**
 * The floating WhatsApp action.
 *
 * A plain link to `wa.me`, not an embedded chat: an embed would load a
 * third-party script on every page and put the visitor's message through
 * someone else's server before it reaches the sales team. The link opens the
 * visitor's own WhatsApp, which is where the conversation actually happens.
 *
 * It is a real anchor, so it works without JavaScript, is reachable by
 * keyboard, and can be opened in a new tab like any other link. The panel is
 * an enhancement on top; the link underneath never depends on it.
 *
 * Spec §11: a click measures intent, not a conversation — the event is named
 * `whatsapp_click` and carries no personal data.
 */

const GREETING =
  "Hello, I saw Explorer Towers online and would like more information.";

export function WhatsAppWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  // Hidden on the admin console — it is a public sales action, not a tool.
  const hidden = pathname.startsWith("/admin");

  // Appear after a moment rather than on top of the opening sequence.
  useEffect(() => {
    if (hidden) return;
    const timer = window.setTimeout(() => setReady(true), 1200);
    return () => window.clearTimeout(timer);
  }, [hidden]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (hidden) return null;

  const href = `https://wa.me/${contactDigits.whatsapp}?text=${encodeURIComponent(GREETING)}`;

  return (
    <div
      className={`fixed right-4 bottom-4 z-60 flex flex-col items-end gap-3 transition-opacity duration-500 md:right-6 md:bottom-6 ${
        ready ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {open ? (
        <div
          role="dialog"
          aria-label="Chat on WhatsApp"
          className="w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 shadow-2xl"
        >
          <div className="bg-[#075E54] px-4 py-3 text-stone-50">
            <p className="text-sm font-medium">Explorer Towers sales</p>
            <p className="text-xs text-stone-300">
              Replies during working hours
            </p>
          </div>
          <div className="px-4 py-4">
            <p className="rounded-xl rounded-tl-sm bg-stone-100 px-3.5 py-2.5 text-sm leading-relaxed text-ink">
              Hello. Ask us about availability, prices or booking a site visit
              and we will come back to you.
            </p>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { placement: "panel" })}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-medium text-[#0b3b2e] transition-opacity hover:opacity-90"
            >
              <WhatsAppGlyph className="size-4" />
              Open WhatsApp
            </a>
            <p className="mt-3 text-center text-[11px] text-stone-500">
              Opens in WhatsApp. We never see your chat until you send it.
            </p>
          </div>
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        {!open ? (
          <span className="hidden rounded-full bg-stone-50/95 px-3.5 py-2 text-xs text-ink shadow-lg backdrop-blur-sm sm:block">
            Chat with sales
          </span>
        ) : null}

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? "Close WhatsApp panel" : "Chat with sales on WhatsApp"}
          className="grid size-14 place-items-center rounded-full bg-[#25D366] text-[#0b3b2e] shadow-xl transition-transform hover:scale-105 motion-reduce:transition-none"
        >
          {open ? (
            <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          ) : (
            <WhatsAppGlyph className="size-7" />
          )}
        </button>
      </div>

      {/*
        The no-JavaScript path. The button above toggles a panel; this is the
        link itself, so the action survives with scripting unavailable.
      */}
      <noscript>
        <a
          href={href}
          className="rounded-full bg-[#25D366] px-4 py-2 text-sm text-[#0b3b2e]"
        >
          Chat on WhatsApp
        </a>
      </noscript>
    </div>
  );
}

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39a9.87 9.87 0 0 0 4.74 1.21h.01c5.45 0 9.89-4.44 9.89-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.1.81.83-3.03-.2-.31a8.17 8.17 0 0 1-1.26-4.39c0-4.54 3.7-8.23 8.23-8.23a8.17 8.17 0 0 1 5.81 2.41 8.15 8.15 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.05-.39-2-1.23a7.4 7.4 0 0 1-1.38-1.72c-.14-.24-.01-.37.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.09-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.84-.2-.48-.4-.42-.55-.43h-.48c-.16 0-.43.06-.65.31-.23.24-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.74 2.65 4.2 3.72.59.25 1.05.4 1.4.52.59.18 1.13.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.28Z" />
    </svg>
  );
}
