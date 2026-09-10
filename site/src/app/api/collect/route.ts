import {
  deviceFrom,
  isEventName,
  recordEvent,
  recordView,
  today,
  visitorHash,
} from "@/lib/analytics";

/**
 * The measurement endpoint (spec §11).
 *
 * Accepts a page view or a named event from the first-party beacon. The client
 * sends only a path, a referrer and campaign parameters; identity is derived
 * here, on the server, from request headers that are never stored.
 *
 * Always answers 204 — measurement must never surface an error to a visitor or
 * hold up a page. A failure is logged and dropped.
 */

export const runtime = "nodejs";

function clientIp(request: Request): string | null {
  // Cloudflare sets CF-Connecting-IP; the rest are the usual proxy headers.
  const header =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for");
  return header?.split(",")[0].trim() ?? null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const str = (key: string) =>
      typeof body[key] === "string" ? (body[key] as string) : null;

    const sessionId = str("sessionId");
    if (!sessionId) return new Response(null, { status: 204 });

    const userAgent = request.headers.get("user-agent");
    const day = today();
    const hash = visitorHash(clientIp(request), userAgent, day);
    const country = request.headers.get("cf-ipcountry");

    if (body.type === "event") {
      const name = body.name;
      if (isEventName(name)) {
        await recordEvent({
          name,
          path: str("path"),
          sessionId,
          visitorHash: hash,
          detail:
            typeof body.detail === "object" && body.detail !== null
              ? (body.detail as Record<string, string | number>)
              : {},
        });
      }
      return new Response(null, { status: 204 });
    }

    await recordView({
      path: str("path") ?? "/",
      referrer: str("referrer"),
      utmSource: str("utmSource"),
      utmMedium: str("utmMedium"),
      utmCampaign: str("utmCampaign"),
      sessionId,
      visitorHash: hash,
      country,
      device: deviceFrom(userAgent),
      isEntry: body.isEntry === true,
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("[collect] dropped", error);
    return new Response(null, { status: 204 });
  }
}
