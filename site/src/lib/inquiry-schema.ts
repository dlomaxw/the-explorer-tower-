/**
 * Shared validation for the four inquiry flows (spec §5).
 *
 * Imported by both the form and the route handler, but the route handler is
 * the authority: the browser copy exists only to give fast feedback, and the
 * server re-runs every rule on the raw payload.
 */

import { DEFAULT_DIAL_ISO, checkPhone, findDialCode } from "./dial-codes";

export const INQUIRY_KINDS = [
  "inquiry",
  "callback",
  "meeting",
  "visit",
] as const;

export type InquiryKind = (typeof INQUIRY_KINDS)[number];

/** Bumped whenever the privacy wording changes; stored with every lead. */
export const CONSENT_NOTICE_VERSION = "2026-09-draft-1";

export const LIMITS = {
  fullName: 120,
  email: 254,
  phone: 32,
  message: 2000,
  preferredTime: 120,
  unitInterest: 80,
  timeZone: 64,
} as const;

export interface InquiryPayload {
  kind: InquiryKind;
  fullName: string;
  email: string;
  /** ISO code of the selected dialling country, e.g. "UG". */
  phoneCountry: string;
  /** National number as typed, without the dialling code. */
  phone: string;
  preferredChannel: string;
  unitInterest: string;
  message: string;
  preferredTime: string;
  timeZone: string;
  marketingConsent: boolean;
  requestId: string;
  landingPage: string;
  source: string;
  campaign: Record<string, string>;
  /** Honeypot. Real visitors never fill this. */
  company: string;
}

export type FieldErrors = Partial<Record<keyof InquiryPayload | "form", string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Keeps digits and a single leading +, so numbers compare consistently. */
export function normalisePhone(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const digits = trimmed.replace(/[^\d]/g, "");
  return trimmed.startsWith("+") ? `+${digits}` : digits;
}

export function normaliseEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

const isKind = (value: unknown): value is InquiryKind =>
  typeof value === "string" && (INQUIRY_KINDS as readonly string[]).includes(value);

/**
 * Applies every rule and returns both the errors and the cleaned values.
 *
 * A phone number is required on every flow: it is the channel the sales team
 * actually uses, and an inquiry without one cannot be followed up by call or
 * WhatsApp. The number is validated against the selected country's real
 * national length rather than a generic "looks like a phone" pattern, so a
 * short or mistyped number is caught at entry instead of at first call.
 *
 * Requirements per flow follow spec §5, with the phone rule on top:
 *   inquiry  — name, phone, and a message or unit interest
 *   callback — name, phone, and a preferred time
 *   meeting  — name, phone, and a preferred time
 *   visit    — name, phone, and a preferred time
 */
export function validateInquiry(raw: Partial<InquiryPayload>): {
  errors: FieldErrors;
  values: InquiryPayload;
} {
  const errors: FieldErrors = {};

  const kind: InquiryKind = isKind(raw.kind) ? raw.kind : "inquiry";
  const fullName = (raw.fullName ?? "").trim();
  const email = normaliseEmail(raw.email ?? "");
  const phoneCountry = (raw.phoneCountry ?? DEFAULT_DIAL_ISO).trim().toUpperCase();
  const phoneNational = (raw.phone ?? "").trim();
  const message = (raw.message ?? "").trim();
  const preferredTime = (raw.preferredTime ?? "").trim();
  const unitInterest = (raw.unitInterest ?? "").trim();
  const preferredChannel = (raw.preferredChannel ?? "").trim();
  const timeZone = (raw.timeZone ?? "").trim().slice(0, LIMITS.timeZone);

  if (!fullName) {
    errors.fullName = "Enter your name.";
  } else if (fullName.length > LIMITS.fullName) {
    errors.fullName = `Keep this under ${LIMITS.fullName} characters.`;
  }

  if (email && !EMAIL.test(email)) {
    errors.email = "Enter a valid email address.";
  } else if (email.length > LIMITS.email) {
    errors.email = "That email address is too long.";
  }

  if (!findDialCode(phoneCountry)) {
    errors.phoneCountry = "Choose a country code.";
  }

  // Required on every flow, and checked against the country's real number
  // length rather than a loose pattern.
  const check = checkPhone(phoneCountry, phoneNational);
  if (!check.ok) {
    errors.phone = check.error;
  } else if (check.e164.length > LIMITS.phone) {
    errors.phone = "That phone number is too long.";
  }

  const phone = check.ok ? check.e164 : normalisePhone(phoneNational);

  if (kind === "inquiry" && !message && !unitInterest) {
    errors.message = "Tell us which residence interests you, or add a message.";
  }

  if (kind !== "inquiry" && !preferredTime) {
    errors.preferredTime = "Give us a preferred day and time.";
  }

  if (message.length > LIMITS.message) {
    errors.message = `Keep this under ${LIMITS.message} characters.`;
  }
  if (preferredTime.length > LIMITS.preferredTime) {
    errors.preferredTime = "That is longer than we can store.";
  }
  if (unitInterest.length > LIMITS.unitInterest) {
    errors.unitInterest = "That is longer than we can store.";
  }

  return {
    errors,
    values: {
      kind,
      fullName,
      email,
      phoneCountry,
      phone,
      preferredChannel,
      unitInterest,
      message,
      preferredTime,
      timeZone,
      marketingConsent: raw.marketingConsent === true,
      requestId: (raw.requestId ?? "").trim(),
      landingPage: (raw.landingPage ?? "").trim().slice(0, 512),
      source: (raw.source ?? "").trim().slice(0, 64),
      campaign: raw.campaign ?? {},
      company: (raw.company ?? "").trim(),
    },
  };
}

export const KIND_LABELS: Record<InquiryKind, string> = {
  inquiry: "General inquiry",
  callback: "Callback request",
  meeting: "Meeting request",
  visit: "Site visit request",
};
