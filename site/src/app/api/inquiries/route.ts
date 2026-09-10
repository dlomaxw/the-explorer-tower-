import type { NextRequest } from "next/server";

import { saveLead } from "@/lib/leads";
import {
  CONSENT_NOTICE_VERSION,
  validateInquiry,
  type InquiryPayload,
} from "@/lib/inquiry-schema";
import { rateLimit } from "@/lib/rate-limit";

/**
 * Inquiry capture (spec §5).
 *
 * The lead is written to storage before any success response is produced, so a
 * visitor is never shown a confirmation for a record that does not exist, and
 * a failure downstream of the write cannot lose a saved lead.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "local";
}

export async function POST(request: NextRequest) {
  let raw: Partial<InquiryPayload>;
  try {
    raw = (await request.json()) as Partial<InquiryPayload>;
  } catch {
    return Response.json(
      { ok: false, errors: { form: "That request could not be read." } },
      { status: 400 },
    );
  }

  const { errors, values } = validateInquiry(raw);

  // Honeypot: accepted silently so a bot learns nothing, but never stored.
  if (values.company) {
    return Response.json({ ok: true, reference: null, stored: false });
  }

  if (!values.requestId) {
    return Response.json(
      { ok: false, errors: { form: "Reload the page and try again." } },
      { status: 400 },
    );
  }

  if (Object.keys(errors).length > 0) {
    return Response.json({ ok: false, errors }, { status: 422 });
  }

  const limit = rateLimit(`inquiry:${clientKey(request)}`, {
    max: 8,
    windowMs: 10 * 60 * 1000,
  });
  if (!limit.allowed) {
    return Response.json(
      {
        ok: false,
        errors: {
          form: "Too many submissions from this connection. Try again shortly, or call the sales team.",
        },
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  try {
    const stored = await saveLead({
      kind: values.kind,
      fullName: values.fullName,
      email: values.email || null,
      phone: values.phone || null,
      preferredChannel: values.preferredChannel || null,
      unitInterest: values.unitInterest || null,
      message: values.message || null,
      preferredTime: values.preferredTime || null,
      timeZone: values.timeZone || null,
      marketingConsent: values.marketingConsent,
      consentNoticeVersion: CONSENT_NOTICE_VERSION,
      source: values.source || null,
      landingPage: values.landingPage || null,
      campaign: values.campaign,
      requestId: values.requestId,
    });

    // Notification dispatch belongs here in Stage 3. It must stay after the
    // write and must not be able to fail the response: the lead is already
    // safe, and a failed send becomes a retryable job, not a lost record.

    return Response.json({
      ok: true,
      reference: stored.reference,
      stored: true,
      duplicate: stored.duplicate,
    });
  } catch (error) {
    console.error("[inquiries] write failed", error);
    return Response.json(
      {
        ok: false,
        errors: {
          form: "We could not save that just now. Nothing was recorded — please try again.",
        },
      },
      { status: 500 },
    );
  }
}
