import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { isApproved, type Media, type Publishable } from "@/content/types";

const cx = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(" ");

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

/**
 * Variants rather than per-call colour overrides: two conflicting utilities in
 * one class string resolve by stylesheet order, not by the order they are
 * written, so overriding a variant's colour from `className` is unreliable.
 * Anything that needs different colours gets a variant here.
 */
type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "light"
  | "outlineLight";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-ink text-stone-50 hover:bg-ink-soft",
  secondary:
    "border border-stone-300 bg-transparent text-ink hover:border-ink hover:bg-stone-100",
  ghost: "text-ink underline underline-offset-4 hover:text-brass",
  // For dark grounds and over imagery.
  light: "bg-stone-50 text-ink hover:bg-white",
  outlineLight:
    "border border-stone-100/45 bg-transparent text-stone-50 hover:border-stone-50 hover:bg-stone-50/12",
};

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return (
    <Link
      {...props}
      className={cx(buttonBase, buttonVariants[variant], className)}
    />
  );
}

export function Button({
  variant = "primary",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant }) {
  return (
    <button
      {...props}
      className={cx(buttonBase, buttonVariants[variant], className)}
    />
  );
}

// ---------------------------------------------------------------------------
// Page furniture
// ---------------------------------------------------------------------------

export function Section({
  children,
  className,
  tone = "light",
  ...props
}: ComponentProps<"section"> & { tone?: "light" | "muted" | "dark" }) {
  const tones = {
    light: "bg-stone-50 text-ink",
    muted: "bg-stone-100 text-ink",
    dark: "bg-ink text-stone-100",
  } as const;

  return (
    <section
      {...props}
      className={cx("py-16 md:py-24 lg:py-section", tones[tone], className)}
    >
      <div className="shell">{children}</div>
    </section>
  );
}

export function SectionHeading({
  kicker,
  title,
  lead,
  align = "left",
}: {
  kicker?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
}) {
  return (
    <header
      className={cx(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
      )}
    >
      {kicker ? (
        <p className="kicker mb-4 text-brass">{kicker}</p>
      ) : null}
      <h2 className="display-lg text-balance">{title}</h2>
      {lead ? (
        <p className="mt-5 text-lg leading-relaxed text-stone-600 text-pretty">
          {lead}
        </p>
      ) : null}
    </header>
  );
}

export function PageHeader({
  kicker,
  title,
  lead,
  children,
}: {
  kicker: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-stone-200 bg-stone-100 pt-32 pb-14 md:pt-40 md:pb-20">
      <div className="shell">
        <p className="kicker mb-5 text-brass">{kicker}</p>
        <h1 className="display-xl max-w-4xl text-balance">{title}</h1>
        {lead ? (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone-600 text-pretty">
            {lead}
          </p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Content-integrity primitives (spec §2, §4)
// ---------------------------------------------------------------------------

/**
 * Renders an approved value, or the approved alternative wording when the
 * client has not released the real one. Never invents a plausible default.
 */
export function Value({
  field,
  className,
}: {
  field: Publishable<string>;
  className?: string;
}) {
  if (isApproved(field)) {
    return <span className={className}>{field.value}</span>;
  }
  return (
    <span className={cx("text-stone-500 italic", className)}>
      {field.prompt}
    </span>
  );
}

/**
 * Spec §4: renders must stay visually distinct from actual site photography.
 * Every image on the site carries this label.
 */
export function MediaKindBadge({
  kind,
  className,
}: {
  kind: Media["kind"];
  className?: string;
}) {
  return (
    <span
      className={cx(
        "kicker rounded-full px-3 py-1 backdrop-blur-sm",
        kind === "render"
          ? "bg-ink/55 text-stone-100"
          : "bg-stone-50/85 text-ink",
        className,
      )}
    >
      {kind === "render" ? "Render" : "Site photograph"}
    </span>
  );
}

export function DefinitionRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-stone-200 py-4">
      <dt className="text-sm text-stone-500">{label}</dt>
      <dd className="text-right text-base">{children}</dd>
    </div>
  );
}

export function EmptyState({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-100 px-6 py-14 text-center">
      <h3 className="display-md">{title}</h3>
      <p className="mx-auto mt-4 max-w-lg leading-relaxed text-stone-600 text-pretty">
        {body}
      </p>
      {children ? <div className="mt-8">{children}</div> : null}
    </div>
  );
}
