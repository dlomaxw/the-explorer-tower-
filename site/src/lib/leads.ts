import "server-only";

import { randomUUID } from "node:crypto";

import { data } from "./data";
import type { InquiryKind } from "./inquiry-schema";

/**
 * Inquiry persistence (spec §5).
 *
 * The lead is written before the visitor is told anything succeeded, and a
 * repeated `requestId` returns the original reference rather than creating a
 * second record — which is what acceptance test A04 checks. Storage itself is
 * whichever driver `./data` selected; nothing here knows or cares.
 */

export interface LeadInput {
  kind: InquiryKind;
  fullName: string;
  email: string | null;
  phone: string | null;
  preferredChannel: string | null;
  unitInterest: string | null;
  message: string | null;
  preferredTime: string | null;
  timeZone: string | null;
  /** Separate from the service acknowledgement, per spec §5. */
  marketingConsent: boolean;
  consentNoticeVersion: string;
  source: string | null;
  landingPage: string | null;
  campaign: Record<string, string>;
  /** Client-generated; repeated submissions of the same form must collapse. */
  requestId: string;
}

export interface StoredLead {
  reference: string;
  createdAt: string;
  duplicate: boolean;
}

/**
 * Human-quotable reference returned to the visitor and used by the sales team
 * to find the record. Date-prefixed so it sorts and reads sensibly.
 */
function nextReference(now: Date): string {
  const stamp = now.toISOString().slice(2, 10).replace(/-/g, "");
  const suffix = randomUUID().replace(/-/g, "").slice(0, 5).toUpperCase();
  return `ET-${stamp}-${suffix}`;
}

export async function saveLead(input: LeadInput): Promise<StoredLead> {
  const db = await data();

  const existing = await db.first<{ reference: string; created_at: string }>(
    "SELECT reference, created_at FROM leads WHERE request_id = ?",
    [input.requestId],
  );

  if (existing) {
    return {
      reference: existing.reference,
      createdAt: existing.created_at,
      duplicate: true,
    };
  }

  const now = new Date();
  const createdAt = now.toISOString();
  const reference = nextReference(now);
  const id = randomUUID();

  // The lead and its opening timeline entry land together: a record can never
  // exist with no history explaining where it came from.
  await db.batch([
    {
      sql: `INSERT INTO leads (
              id, reference, request_id, kind, created_at, updated_at, full_name,
              email, phone, preferred_channel, unit_interest, message,
              preferred_time, time_zone, marketing_consent,
              consent_notice_version, consent_recorded_at, source, landing_page,
              campaign, stage, stage_changed_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      params: [
        id,
        reference,
        input.requestId,
        input.kind,
        createdAt,
        createdAt,
        input.fullName,
        input.email,
        input.phone,
        input.preferredChannel,
        input.unitInterest,
        input.message,
        input.preferredTime,
        input.timeZone,
        input.marketingConsent ? 1 : 0,
        input.consentNoticeVersion,
        createdAt,
        input.source,
        input.landingPage,
        JSON.stringify(input.campaign),
        // Stage 01 of the twelve-stage pipeline (spec §6).
        "01-new-inquiry",
        createdAt,
      ],
    },
    {
      sql: `INSERT INTO activities (id, lead_id, type, body, detail, actor_id, actor_name, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      params: [
        randomUUID(),
        id,
        "inquiry-received",
        `${input.kind} received from the website`,
        JSON.stringify({
          source: input.source,
          landingPage: input.landingPage,
          campaign: input.campaign,
        }),
        null,
        "Website",
        createdAt,
      ],
    },
  ]);

  return { reference, createdAt, duplicate: false };
}

export async function countLeads(): Promise<number> {
  const db = await data();
  const row = await db.first<{ n: number }>("SELECT COUNT(*) AS n FROM leads");
  return row?.n ?? 0;
}
