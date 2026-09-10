"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * The first-party measurement beacon.
 *
 * Sends a page view on entry and on every client-side navigation, plus named
 * events raised through `track()`. What it deliberately does not do:
 *
 *   * no cookie, no localStorage identity — the session id lives in
 *     `sessionStorage`, so it dies with the tab and never follows anyone back;
 *   * no query strings are transmitted, only the path, so a value someone typed
 *     into a URL cannot leak into analytics;
 *   * campaign parameters are read from the entry URL only, and only the five
 *     well-known UTM keys.
 *
 * `sendBeacon` where available, so leaving the page never blocks on the request
 * and a navigation cannot lose the last view.
 */

const SESSION_KEY = "explorer:session";
const ENTRY_KEY = "explorer:entry-sent";

function sessionId(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const fresh =
      globalThis.crypto?.randomUUID?.() ??
      `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(SESSION_KEY, fresh);
    return fresh;
  } catch {
    // Storage blocked. A per-load id still counts the visit; it just cannot be
    // stitched into a session.
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

function send(payload: Record<string, unknown>): void {
  try {
    const body = JSON.stringify({ ...payload, sessionId: sessionId() });
    const url = "/api/collect";

    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
      return;
    }

    void fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Measurement must never break a page.
  }
}

/** Raise a named event from anywhere in the client tree. */
export function track(
  name: string,
  detail: Record<string, string | number> = {},
): void {
  send({
    type: "event",
    name,
    detail,
    path: window.location.pathname,
  });
}

export function Analytics() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    // React runs effects twice in development StrictMode; guarding on the path
    // keeps one navigation from being counted as two.
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    let isEntry = false;
    try {
      isEntry = !sessionStorage.getItem(ENTRY_KEY);
      if (isEntry) sessionStorage.setItem(ENTRY_KEY, "1");
    } catch {
      // Treated as a non-entry view rather than inflating entry counts.
    }

    const params = new URLSearchParams(window.location.search);

    send({
      type: "view",
      path: pathname,
      // Only the referring URL, and only on the entry view — later views inside
      // the site would otherwise report the site as its own referrer.
      referrer: isEntry ? document.referrer || null : null,
      utmSource: params.get("utm_source"),
      utmMedium: params.get("utm_medium"),
      utmCampaign: params.get("utm_campaign"),
      isEntry,
    });
  }, [pathname]);

  return null;
}
