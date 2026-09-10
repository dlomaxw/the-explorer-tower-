import "server-only";

import { createHash, randomUUID } from "node:crypto";

import { data } from "./data";

/**
 * First-party traffic measurement (spec §11).
 *
 * Deliberately not a third-party analytics tag. Everything is recorded on our
 * own server, into our own database, and the design starts from what the spec
 * forbids:
 *
 *   * no names, emails or phone numbers ever reach an event — not in a path,
 *     not in a query string, not in a label;
 *   * no cookie and no durable identifier. `visitorHash` is a salted digest of
 *     coarse request properties that **rotates every day**, so a visitor can be
 *     counted once within a day and cannot be recognised tomorrow, correlated
 *     across days, or joined back to a lead;
 *   * the raw IP address is never stored — only its contribution to that
 *     day's hash.
 *
 * Click events measure intent, not outcome: `whatsapp_click` means somebody
 * pressed the button, never that a conversation happened. The dashboard labels
 * them that way.
 */

/**
 * Rotates the hashing salt daily. Set ANALYTICS_SALT in production so the salt
 * is not derivable from the date alone; the default keeps development working.
 */
function dailySalt(day: string): string {
  return `${process.env.ANALYTICS_SALT ?? "explorer-towers-dev"}:${day}`;
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * A per-day pseudonym for one visitor.
 *
 * Built from the IP and user agent, which we never store. Because the salt
 * changes at midnight UTC, the same person produces a different value tomorrow
 * — which is the point: it supports "how many people came today" and refuses
 * "who keeps coming back".
 */
export function visitorHash(
  ip: string | null,
  userAgent: string | null,
  day: string,
): string {
  return createHash("sha256")
    .update(`${dailySalt(day)}|${ip ?? "-"}|${userAgent ?? "-"}`)
    .digest("hex")
    .slice(0, 32);
}

const SEARCH = /google|bing|duckduckgo|yahoo|baidu|yandex|ecosia|brave/i;
const SOCIAL =
  /facebook|instagram|tiktok|linkedin|twitter|^t\.co$|x\.com|pinterest|youtube|whatsapp|reddit/i;
const EMAIL_HOST = /mail\.|outlook|gmail/i;

/**
 * Groups a visit into a channel.
 *
 * A UTM medium always wins, because that is a deliberate label the marketing
 * team applied. Only when there is none do we infer from the referrer, and an
 * unknown referrer stays "referral" rather than being guessed into a category.
 * Absent both, it is "direct" — which honestly includes app opens, QR scans and
 * stripped referrers, and the dashboard says so.
 */
export function classifyChannel(
  referrerHost: string | null,
  utmMedium: string | null,
  utmSource: string | null,
): string {
  const medium = utmMedium?.toLowerCase() ?? "";
  if (medium.includes("cpc") || medium.includes("paid") || medium.includes("ppc")) {
    return "paid";
  }
  if (medium.includes("social")) return "social";
  if (medium.includes("email")) return "email";
  if (medium.includes("organic")) return "organic-search";
  if (medium.includes("referral")) return "referral";
  if (utmSource && !referrerHost) return "campaign";

  if (!referrerHost) return "direct";
  if (SEARCH.test(referrerHost)) return "organic-search";
  if (SOCIAL.test(referrerHost)) return "social";
  if (EMAIL_HOST.test(referrerHost)) return "email";
  return "referral";
}

export function deviceFrom(userAgent: string | null): string {
  if (!userAgent) return "unknown";
  if (/iPad|Tablet/i.test(userAgent)) return "tablet";
  if (/Mobi|Android|iPhone/i.test(userAgent)) return "mobile";
  return "desktop";
}

/** Strips the query string and trims, so nothing personal can ride along. */
export function safePath(raw: string): string {
  const path = raw.split("?")[0].split("#")[0];
  return path.slice(0, 256) || "/";
}

export function referrerHost(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const host = new URL(raw).hostname.replace(/^www\./, "");
    return host.slice(0, 120);
  } catch {
    return null;
  }
}

export interface ViewInput {
  path: string;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  sessionId: string;
  visitorHash: string;
  country: string | null;
  device: string;
  isEntry: boolean;
}

export async function recordView(input: ViewInput): Promise<void> {
  const db = await data();
  const now = new Date();
  const host = referrerHost(input.referrer);

  await db.execute(
    `INSERT INTO page_views (
       id, created_at, day, path, referrer_host, channel,
       utm_source, utm_medium, utm_campaign,
       visitor_hash, session_id, country, device, is_entry
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      randomUUID(),
      now.toISOString(),
      now.toISOString().slice(0, 10),
      safePath(input.path),
      host,
      classifyChannel(host, input.utmMedium, input.utmSource),
      input.utmSource?.slice(0, 120) ?? null,
      input.utmMedium?.slice(0, 120) ?? null,
      input.utmCampaign?.slice(0, 120) ?? null,
      input.visitorHash,
      input.sessionId,
      input.country?.slice(0, 4) ?? null,
      input.device,
      input.isEntry ? 1 : 0,
    ],
  );
}

/** The event names defined in spec §11, plus the scroll-depth marker. */
export const EVENT_NAMES = [
  "view_unit",
  "brochure_download",
  "inquiry_submitted",
  "callback_requested",
  "meeting_requested",
  "meeting_confirmed",
  "visit_requested",
  "visit_confirmed",
  "whatsapp_click",
  "phone_click",
  "gallery_open",
  "film_play",
  "journey_complete",
] as const;

export type EventName = (typeof EVENT_NAMES)[number];

export function isEventName(value: unknown): value is EventName {
  return (
    typeof value === "string" && (EVENT_NAMES as readonly string[]).includes(value)
  );
}

export async function recordEvent(input: {
  name: EventName;
  path: string | null;
  sessionId: string | null;
  visitorHash: string | null;
  detail?: Record<string, string | number>;
}): Promise<void> {
  const db = await data();
  const now = new Date();

  await db.execute(
    `INSERT INTO site_events (id, created_at, day, name, path, session_id, visitor_hash, detail)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      randomUUID(),
      now.toISOString(),
      now.toISOString().slice(0, 10),
      input.name,
      input.path ? safePath(input.path) : null,
      input.sessionId,
      input.visitorHash,
      JSON.stringify(input.detail ?? {}),
    ],
  );
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------

export interface DailyPoint {
  day: string;
  views: number;
  visitors: number;
}

export interface Overview {
  days: DailyPoint[];
  totalViews: number;
  totalVisitors: number;
  totalSessions: number;
  channels: { channel: string; visitors: number; views: number }[];
  pages: { path: string; views: number; visitors: number }[];
  referrers: { host: string; views: number }[];
  devices: { device: string; visitors: number }[];
  countries: { country: string; visitors: number }[];
  campaigns: { campaign: string; source: string | null; views: number }[];
  events: { name: string; count: number }[];
  /** Views → inquiry-intent events → saved leads, for the period. */
  funnel: { label: string; value: number; note?: string }[];
}

const since = (days: number) =>
  new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);

export async function overview(days = 30): Promise<Overview> {
  const db = await data();
  const from = since(days);

  const [
    daily,
    totals,
    channels,
    pages,
    referrers,
    devices,
    countries,
    campaigns,
    events,
    leadCount,
    reach,
  ] = await Promise.all([
    db.query<{ day: string; views: number; visitors: number }>(
      `SELECT day, COUNT(*) AS views, COUNT(DISTINCT visitor_hash) AS visitors
         FROM page_views WHERE day >= ? GROUP BY day ORDER BY day`,
      [from],
    ),
    db.first<{ views: number; visitors: number; sessions: number }>(
      `SELECT COUNT(*) AS views,
              COUNT(DISTINCT visitor_hash) AS visitors,
              COUNT(DISTINCT session_id) AS sessions
         FROM page_views WHERE day >= ?`,
      [from],
    ),
    db.query<{ channel: string; visitors: number; views: number }>(
      `SELECT channel, COUNT(DISTINCT visitor_hash) AS visitors, COUNT(*) AS views
         FROM page_views WHERE day >= ?
         GROUP BY channel ORDER BY visitors DESC`,
      [from],
    ),
    db.query<{ path: string; views: number; visitors: number }>(
      `SELECT path, COUNT(*) AS views, COUNT(DISTINCT visitor_hash) AS visitors
         FROM page_views WHERE day >= ?
         GROUP BY path ORDER BY views DESC LIMIT 12`,
      [from],
    ),
    db.query<{ host: string; views: number }>(
      `SELECT referrer_host AS host, COUNT(*) AS views
         FROM page_views WHERE day >= ? AND referrer_host IS NOT NULL
         GROUP BY referrer_host ORDER BY views DESC LIMIT 10`,
      [from],
    ),
    db.query<{ device: string; visitors: number }>(
      `SELECT device, COUNT(DISTINCT visitor_hash) AS visitors
         FROM page_views WHERE day >= ? GROUP BY device ORDER BY visitors DESC`,
      [from],
    ),
    db.query<{ country: string; visitors: number }>(
      `SELECT country, COUNT(DISTINCT visitor_hash) AS visitors
         FROM page_views WHERE day >= ? AND country IS NOT NULL
         GROUP BY country ORDER BY visitors DESC LIMIT 10`,
      [from],
    ),
    db.query<{ campaign: string; source: string | null; views: number }>(
      `SELECT utm_campaign AS campaign, utm_source AS source, COUNT(*) AS views
         FROM page_views WHERE day >= ? AND utm_campaign IS NOT NULL
         GROUP BY utm_campaign, utm_source ORDER BY views DESC LIMIT 10`,
      [from],
    ),
    db.query<{ name: string; count: number }>(
      `SELECT name, COUNT(*) AS count FROM site_events WHERE day >= ?
         GROUP BY name ORDER BY count DESC`,
      [from],
    ),
    db.first<{ n: number }>(
      "SELECT COUNT(*) AS n FROM leads WHERE substr(created_at, 1, 10) >= ?",
      [from],
    ),
    // Distinct sessions per funnel step, so each stage counts the same kind of
    // thing as the one above it. Counting raw events here would let a step
    // exceed the one before it — a visitor who clicks WhatsApp three times is
    // still one visitor showing intent.
    db.first<{ units: number; intent: number }>(
      `SELECT
         COUNT(DISTINCT CASE WHEN name = 'view_unit' THEN session_id END) AS units,
         COUNT(DISTINCT CASE WHEN name IN ('whatsapp_click','phone_click','brochure_download')
                             THEN session_id END) AS intent
       FROM site_events WHERE day >= ?`,
      [from],
    ),
  ]);

  return {
    days: daily,
    totalViews: totals?.views ?? 0,
    totalVisitors: totals?.visitors ?? 0,
    totalSessions: totals?.sessions ?? 0,
    channels,
    pages,
    referrers,
    devices,
    countries,
    campaigns,
    events,
    // Every step counts distinct sessions, so the percentages mean what they
    // look like. Leads are the exception and are labelled as such: an inquiry
    // is a record, not a session, and somebody can return days later to send one.
    funnel: [
      {
        label: "Sessions",
        value: totals?.sessions ?? 0,
        note: "Visits to the site in this period",
      },
      {
        label: "Viewed a residence",
        value: reach?.units ?? 0,
        note: "Sessions that opened a residence page",
      },
      {
        label: "Showed intent",
        value: reach?.intent ?? 0,
        note: "Sessions that clicked call, WhatsApp or brochure — intent, not contact",
      },
      {
        label: "Saved leads",
        value: leadCount?.n ?? 0,
        note: "Inquiry records written. Counted separately: a lead is a record, not a session.",
      },
    ],
  };
}
