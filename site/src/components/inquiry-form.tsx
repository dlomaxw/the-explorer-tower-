"use client";

import { useId, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui";
import {
  DEFAULT_DIAL_ISO,
  DIAL_CODES,
  findDialCode,
} from "@/lib/dial-codes";
import {
  KIND_LABELS,
  LIMITS,
  validateInquiry,
  type FieldErrors,
  type InquiryKind,
  type InquiryPayload,
} from "@/lib/inquiry-schema";

/**
 * The four inquiry flows share one form (spec §5): general inquiry, callback,
 * meeting request and site visit request. Fields change per flow; the
 * submission path, validation rules and idempotency handling do not.
 *
 * The request id is generated once per filled-in form and reused across
 * retries, so a double click or a flaky connection cannot create two leads.
 */

const CAMPAIGN_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
] as const;

interface Props {
  kind: InquiryKind;
  unitOptions?: readonly { value: string; label: string }[];
  defaultUnit?: string;
  compact?: boolean;
}

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "error"; errors: FieldErrors }
  | { state: "done"; reference: string | null };

export function InquiryForm({
  kind,
  unitOptions = [],
  defaultUnit = "",
  compact = false,
}: Props) {
  const baseId = useId();
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const requestIdRef = useRef<string>("");
  const [country, setCountry] = useState<string>(DEFAULT_DIAL_ISO);
  /**
   * Attribution comes from the URL the visitor is actually on, so it is read
   * at submit time rather than copied into state on mount: it is only ever
   * needed once, and reading it late means a client-side navigation cannot
   * leave the form holding a stale landing page. No personal data goes in here.
   */
  const readContext = () => {
    const params = new URLSearchParams(window.location.search);
    const campaign: Record<string, string> = {};
    for (const key of CAMPAIGN_KEYS) {
      const value = params.get(key);
      if (value) campaign[key] = value.slice(0, 120);
    }
    return {
      landingPage: window.location.pathname + window.location.search,
      campaign,
    };
  };

  const errors = status.state === "error" ? status.errors : {};
  const fieldId = (name: string) => `${baseId}-${name}`;
  const errorId = (name: string) => `${baseId}-${name}-error`;

  const needsTime = kind !== "inquiry";
  const showUnit = kind === "inquiry" || kind === "visit";

  const timeZone = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    } catch {
      return "";
    }
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    if (!requestIdRef.current) {
      requestIdRef.current =
        globalThis.crypto?.randomUUID?.() ??
        `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }

    const context = readContext();

    const payload: Partial<InquiryPayload> = {
      kind,
      fullName: String(data.get("fullName") ?? ""),
      email: String(data.get("email") ?? ""),
      phoneCountry: String(data.get("phoneCountry") ?? DEFAULT_DIAL_ISO),
      phone: String(data.get("phone") ?? ""),
      preferredChannel: String(data.get("preferredChannel") ?? ""),
      unitInterest: String(data.get("unitInterest") ?? ""),
      message: String(data.get("message") ?? ""),
      preferredTime: String(data.get("preferredTime") ?? ""),
      company: String(data.get("company") ?? ""),
      marketingConsent: data.get("marketingConsent") === "on",
      timeZone,
      requestId: requestIdRef.current,
      landingPage: context.landingPage,
      source: "website",
      campaign: context.campaign,
    };

    // Fast local feedback. The server re-runs the same rules regardless.
    const local = validateInquiry(payload);
    if (Object.keys(local.errors).length > 0) {
      setStatus({ state: "error", errors: local.errors });
      return;
    }

    setStatus({ state: "submitting" });

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {
        ok: boolean;
        reference?: string | null;
        errors?: FieldErrors;
      };

      if (!response.ok || !result.ok) {
        setStatus({
          state: "error",
          errors: result.errors ?? {
            form: "We could not send that. Please try again.",
          },
        });
        return;
      }

      setStatus({ state: "done", reference: result.reference ?? null });
    } catch {
      setStatus({
        state: "error",
        errors: {
          form: "No connection. Nothing was sent — please try again.",
        },
      });
    }
  }

  if (status.state === "done") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-stone-300 bg-stone-100 p-8"
      >
        <h3 className="display-md">Thank you — that is with the sales team.</h3>
        <p className="mt-4 leading-relaxed text-stone-600 text-pretty">
          Your {KIND_LABELS[kind].toLowerCase()} has been recorded and assigned.
          Someone will be in touch within the team&rsquo;s published working
          hours.
        </p>
        {status.reference ? (
          <p className="mt-6 text-sm text-stone-600">
            Your reference:{" "}
            <span className="font-mono text-base text-ink">
              {status.reference}
            </span>
          </p>
        ) : null}
      </div>
    );
  }

  const submitting = status.state === "submitting";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={compact ? "" : "rounded-2xl border border-stone-200 bg-stone-100 p-6 md:p-8"}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Full name"
          name="fullName"
          required
          autoComplete="name"
          maxLength={LIMITS.fullName}
          id={fieldId("fullName")}
          errorId={errorId("fullName")}
          error={errors.fullName}
        />

        <Field
          label="Email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={LIMITS.email}
          id={fieldId("email")}
          errorId={errorId("email")}
          error={errors.email}
        />

        <PhoneField
          country={country}
          onCountryChange={setCountry}
          id={fieldId("phone")}
          countryId={fieldId("phoneCountry")}
          errorId={errorId("phone")}
          error={errors.phone}
        />

        <div className="grid gap-2">
          <label
            htmlFor={fieldId("preferredChannel")}
            className="text-sm font-medium"
          >
            Preferred way to reply
          </label>
          <select
            id={fieldId("preferredChannel")}
            name="preferredChannel"
            defaultValue=""
            className="h-12 rounded-lg border border-stone-300 bg-stone-50 px-4 text-base"
          >
            <option value="">No preference</option>
            <option value="email">Email</option>
            <option value="phone">Phone call</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>

        {showUnit && unitOptions.length > 0 ? (
          <div className="grid gap-2">
            <label
              htmlFor={fieldId("unitInterest")}
              className="text-sm font-medium"
            >
              Residence of interest
            </label>
            <select
              id={fieldId("unitInterest")}
              name="unitInterest"
              defaultValue={defaultUnit}
              className="h-12 rounded-lg border border-stone-300 bg-stone-50 px-4 text-base"
            >
              <option value="">Not sure yet</option>
              {unitOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {needsTime ? (
          <Field
            label={
              kind === "callback"
                ? "Best time to call"
                : "Preferred day and time"
            }
            name="preferredTime"
            required
            placeholder="e.g. Thursday afternoon"
            hint={
              timeZone
                ? `We will read this in your time zone (${timeZone}) and confirm in Kampala time.`
                : undefined
            }
            maxLength={LIMITS.preferredTime}
            id={fieldId("preferredTime")}
            errorId={errorId("preferredTime")}
            error={errors.preferredTime}
          />
        ) : null}
      </div>

      <div className="mt-5 grid gap-2">
        <label htmlFor={fieldId("message")} className="text-sm font-medium">
          Message{" "}
          {kind === "inquiry" ? null : (
            <span className="font-normal text-stone-500">(optional)</span>
          )}
        </label>
        <textarea
          id={fieldId("message")}
          name="message"
          rows={4}
          maxLength={LIMITS.message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? errorId("message") : undefined}
          className="rounded-lg border border-stone-300 bg-stone-50 px-4 py-3 text-base"
        />
        {errors.message ? (
          <p id={errorId("message")} className="text-sm text-red-800">
            {errors.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot. Hidden from everyone, including screen readers. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor={fieldId("company")}>Company</label>
        <input
          id={fieldId("company")}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Spec §5: the service acknowledgement is separate from marketing consent. */}
      <p className="mt-6 text-sm leading-relaxed text-stone-600">
        We use these details to answer your {KIND_LABELS[kind].toLowerCase()}.
        That reply is part of the service you asked for.
      </p>

      <label className="mt-4 flex items-start gap-3 text-sm leading-relaxed text-stone-600">
        <input
          type="checkbox"
          name="marketingConsent"
          className="mt-1 size-4 shrink-0 rounded border-stone-300"
        />
        <span>
          Optional: also send me project updates and launch news. You can
          withdraw this at any time; it is not required for a reply.
        </span>
      </label>

      {errors.form ? (
        <p
          role="alert"
          className="mt-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900"
        >
          {errors.form}
        </p>
      ) : null}

      <Button type="submit" disabled={submitting} className="mt-7 w-full sm:w-auto">
        {submitting ? "Sending…" : `Send ${KIND_LABELS[kind].toLowerCase()}`}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  id,
  errorId,
  error,
  hint,
  required,
  ...input
}: {
  label: string;
  name: string;
  id: string;
  errorId: string;
  error?: string;
  hint?: string;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const hintId = `${id}-hint`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}{" "}
        {required ? null : (
          <span className="font-normal text-stone-500">(optional)</span>
        )}
      </label>
      <input
        {...input}
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className="h-12 rounded-lg border border-stone-300 bg-stone-50 px-4 text-base"
      />
      {hint ? (
        <p id={hintId} className="text-xs text-stone-500">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-sm text-red-800">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Country code plus national number.
 *
 * Two controls, one value. The dropdown carries the dialling code and the text
 * input carries only the national part, so nobody has to remember whether to
 * type `+256`, `00256` or `0772`. The placeholder is a real correctly-shaped
 * number for the selected country, which does more to prevent a mistyped entry
 * than any amount of hint text.
 *
 * `inputMode="numeric"` brings up a number pad on phones without blocking the
 * spaces and dashes people naturally type; the server strips them.
 */
function PhoneField({
  country,
  onCountryChange,
  id,
  countryId,
  errorId,
  error,
}: {
  country: string;
  onCountryChange: (iso: string) => void;
  id: string;
  countryId: string;
  errorId: string;
  error?: string;
}) {
  const selected = findDialCode(country) ?? DIAL_CODES[0];
  const lengths = selected.digits;
  const expected =
    lengths.length === 1
      ? `${lengths[0]} digits`
      : `${lengths.slice(0, -1).join(", ")} or ${lengths.at(-1)} digits`;

  return (
    <div className="grid gap-2 sm:col-span-2">
      <label htmlFor={id} className="text-sm font-medium">
        Phone <span aria-hidden="true">*</span>
        <span className="sr-only">(required)</span>
      </label>

      <div className="flex gap-2">
        <select
          id={countryId}
          name="phoneCountry"
          value={country}
          onChange={(event) => onCountryChange(event.target.value)}
          aria-label="Country dialling code"
          className="h-12 w-38 shrink-0 rounded-lg border border-stone-300 bg-stone-50 px-3 text-base"
        >
          {DIAL_CODES.map((entry) => (
            <option key={entry.iso} value={entry.iso}>
              {entry.iso} {entry.dial}
            </option>
          ))}
        </select>

        <input
          id={id}
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          required
          placeholder={selected.example}
          aria-describedby={error ? errorId : `${id}-hint`}
          aria-invalid={error ? true : undefined}
          className={`h-12 min-w-0 flex-1 rounded-lg border bg-stone-50 px-4 text-base ${
            error ? "border-red-600" : "border-stone-300"
          }`}
        />
      </div>

      {error ? (
        <p id={errorId} role="alert" className="text-sm text-red-700">
          {error}
        </p>
      ) : (
        <p id={`${id}-hint`} className="text-sm text-stone-500">
          {selected.name} numbers have {expected} after {selected.dial}. A
          leading zero is fine — we will remove it.
        </p>
      )}
    </div>
  );
}
