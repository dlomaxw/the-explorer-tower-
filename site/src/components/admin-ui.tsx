"use client";

import { useActionState } from "react";
import type { ReactNode } from "react";

import type { ActionState } from "@/app/admin/actions";
import { STAGE_DEFINITIONS, type Stage } from "@/lib/pipeline";

/**
 * Admin form and display primitives.
 *
 * Forms are driven by `useActionState`, so they submit and report errors
 * without JavaScript having to be present for the post itself to work — the
 * server action is a real form target.
 */

const cx = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(" ");

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-600">
        {label}
      </span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-slate-900";

export function SubmitButton({
  children,
  pending,
  variant = "primary",
}: {
  children: ReactNode;
  pending?: boolean;
  variant?: "primary" | "secondary";
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={cx(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60",
        variant === "primary"
          ? "bg-slate-900 text-white hover:bg-slate-700"
          : "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50",
      )}
    >
      {pending ? "Working…" : children}
    </button>
  );
}

export function FormMessage({ state }: { state: ActionState }) {
  if (state.error) {
    return (
      <p
        role="alert"
        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
      >
        {state.error}
      </p>
    );
  }
  if (state.ok) {
    return (
      <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
        Saved.
      </p>
    );
  }
  return null;
}

/** Wraps a server action with its own state and pending flag. */
export function ActionForm({
  action,
  children,
  className,
}: {
  action: (state: ActionState, form: FormData) => Promise<ActionState>;
  children: (helpers: { pending: boolean; state: ActionState }) => ReactNode;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form action={formAction} className={className}>
      {children({ pending, state })}
    </form>
  );
}

const STAGE_TONES: Record<string, string> = {
  new: "bg-blue-50 text-blue-800 border-blue-200",
  active: "bg-slate-100 text-slate-800 border-slate-300",
  meeting: "bg-violet-50 text-violet-800 border-violet-200",
  commercial: "bg-emerald-50 text-emerald-800 border-emerald-200",
  paused: "bg-amber-50 text-amber-900 border-amber-200",
  closed: "bg-slate-50 text-slate-500 border-slate-200",
};

export function StagePill({ stage }: { stage: Stage }) {
  const definition = STAGE_DEFINITIONS[stage];
  if (!definition) return <span className="text-xs">{stage}</span>;

  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        STAGE_TONES[definition.tone],
      )}
    >
      <span className="tabular-nums opacity-60">{definition.ordinal}</span>
      {definition.label}
    </span>
  );
}

export function PriorityDot({ priority }: { priority: string }) {
  const tone =
    priority === "high"
      ? "bg-red-500"
      : priority === "low"
        ? "bg-slate-300"
        : "bg-amber-400";
  return (
    <span
      className={cx("inline-block size-2 rounded-full", tone)}
      title={`${priority} priority`}
    />
  );
}

/**
 * Dates render in Africa/Kampala, with the raw timestamp on hover.
 *
 * A relative label ("in 3 days") needs a reference point, and this is a client
 * component: reading the clock here would give one answer on the server and
 * another at hydration. So `now` is passed in by the server page that renders
 * it, and without it the component shows the absolute date rather than
 * guessing.
 */
export function When({
  iso,
  relative,
  now,
}: {
  iso: string | null;
  relative?: boolean;
  now?: number;
}) {
  if (!iso) return <span className="text-slate-400">—</span>;

  const date = new Date(iso);
  const formatted = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Kampala",
  }).format(date);

  if (!relative || now === undefined) {
    return <time dateTime={iso}>{formatted}</time>;
  }

  const days = Math.round((date.getTime() - now) / 86_400_000);
  const label =
    days === 0
      ? "today"
      : days === 1
        ? "tomorrow"
        : days === -1
          ? "yesterday"
          : days > 0
            ? `in ${days} days`
            : `${Math.abs(days)} days ago`;

  return (
    <time dateTime={iso} title={formatted} className={days < 0 ? "text-red-700" : ""}>
      {label}
    </time>
  );
}
