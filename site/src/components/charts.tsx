"use client";

import { useId, useState } from "react";

import { fmt } from "@/lib/format";

/**
 * Chart primitives for the dashboard.
 *
 * Hand-built SVG rather than a charting library: these are four simple forms,
 * and a library would cost more bytes than the whole admin bundle while making
 * the palette and accessibility rules harder to hold to.
 *
 * Colour comes from `--series-1..4`, defined once on `.viz` in the dashboard
 * stylesheet. Those four steps were checked with the palette validator against
 * the dark surface: all pass the lightness band, chroma floor, adjacent CVD
 * separation, normal-vision floor and 3:1 contrast. Do not add a fifth series
 * without re-running it — fold the tail into "Other" instead.
 *
 * Every chart ships a table view for the same data, so nothing is conveyed by
 * colour alone and a screen reader gets numbers rather than a picture.
 */



function useTable(): [boolean, () => void] {
  const [open, setOpen] = useState(false);
  return [open, () => setOpen((value) => !value)];
}

function TableToggle({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[11px] text-[var(--ink-3)] underline underline-offset-2 transition-colors hover:text-[var(--ink-1)]"
    >
      {open ? "Hide table" : "Table"}
    </button>
  );
}

export function ChartFrame({
  title,
  hint,
  right,
  children,
  table,
}: {
  title: string;
  hint?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  table?: React.ReactNode;
}) {
  const [open, toggle] = useTable();

  return (
    <section className="panel flex flex-col p-5">
      <header className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div>
          <h3 className="text-[13px] font-medium text-[var(--ink-1)]">{title}</h3>
          {hint ? (
            <p className="mt-0.5 text-[11px] text-[var(--ink-3)]">{hint}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          {right}
          {table ? <TableToggle open={open} onClick={toggle} /> : null}
        </div>
      </header>

      <div className="min-h-0 flex-1">{children}</div>

      {table && open ? (
        <div className="scroll-x mt-4 border-t border-[var(--line)] pt-3">
          {table}
        </div>
      ) : null}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Time series
// ---------------------------------------------------------------------------

export interface SeriesPoint {
  day: string;
  views: number;
  visitors: number;
}

/**
 * Two-line time series with a shared crosshair.
 *
 * One y-axis for both series — they are the same unit (people/pages per day),
 * which is the only case where two lines belong on one scale. A second scale
 * would let any pair of lines be made to look correlated.
 */
export function TimeSeries({ points }: { points: SeriesPoint[] }) {
  const clipId = useId();
  const [hover, setHover] = useState<number | null>(null);

  if (points.length === 0) {
    return <Empty>No traffic recorded yet.</Empty>;
  }

  const W = 720;
  const H = 200;
  const PAD = { top: 12, right: 12, bottom: 22, left: 34 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const peak = Math.max(1, ...points.map((p) => Math.max(p.views, p.visitors)));
  const step = points.length > 1 ? innerW / (points.length - 1) : 0;

  const x = (i: number) => PAD.left + i * step;
  const y = (v: number) => PAD.top + innerH - (v / peak) * innerH;

  const path = (pick: (p: SeriesPoint) => number) =>
    points.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(pick(p))}`).join(" ");

  const area = (pick: (p: SeriesPoint) => number) =>
    `${path(pick)} L${x(points.length - 1)},${PAD.top + innerH} L${x(0)},${PAD.top + innerH} Z`;

  const ticks = [0, 0.5, 1].map((t) => Math.round(peak * t));
  const active = hover === null ? null : points[hover];

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`Daily page views and visitors over ${points.length} days`}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <clipPath id={clipId}>
            <rect x={PAD.left} y={PAD.top} width={innerW} height={innerH} />
          </clipPath>
          <linearGradient id={`${clipId}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--series-1)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--series-1)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {ticks.map((value) => (
          <g key={value}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(value)}
              y2={y(value)}
              stroke="var(--line)"
              strokeWidth="1"
            />
            <text
              x={PAD.left - 8}
              y={y(value) + 3.5}
              textAnchor="end"
              className="fill-[var(--ink-3)] text-[9px] tabular-nums"
            >
              {fmt(value)}
            </text>
          </g>
        ))}

        <g clipPath={`url(#${clipId})`}>
          <path d={area((p) => p.views)} fill={`url(#${clipId}-fill)`} />
          <path
            d={path((p) => p.views)}
            fill="none"
            stroke="var(--series-1)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d={path((p) => p.visitors)}
            fill="none"
            stroke="var(--series-2)"
            strokeWidth="2"
            strokeDasharray="3 3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </g>

        {hover !== null ? (
          <line
            x1={x(hover)}
            x2={x(hover)}
            y1={PAD.top}
            y2={PAD.top + innerH}
            stroke="var(--ink-3)"
            strokeWidth="1"
          />
        ) : null}

        {active ? (
          <>
            <circle
              cx={x(hover!)}
              cy={y(active.views)}
              r="4"
              fill="var(--series-1)"
              stroke="var(--surface-2)"
              strokeWidth="2"
            />
            <circle
              cx={x(hover!)}
              cy={y(active.visitors)}
              r="4"
              fill="var(--series-2)"
              stroke="var(--surface-2)"
              strokeWidth="2"
            />
          </>
        ) : null}

        {/* Hit targets are full-height columns, far easier to hit than the line. */}
        {points.map((point, index) => (
          <rect
            key={point.day}
            x={x(index) - step / 2}
            y={PAD.top}
            width={Math.max(step, 6)}
            height={innerH}
            fill="transparent"
            onMouseEnter={() => setHover(index)}
          />
        ))}

        <text
          x={PAD.left}
          y={H - 6}
          className="fill-[var(--ink-3)] text-[9px]"
        >
          {points[0]?.day.slice(5)}
        </text>
        <text
          x={W - PAD.right}
          y={H - 6}
          textAnchor="end"
          className="fill-[var(--ink-3)] text-[9px]"
        >
          {points.at(-1)?.day.slice(5)}
        </text>
      </svg>

      <figcaption className="mt-2 flex flex-wrap items-center gap-4 text-[11px] text-[var(--ink-2)]">
        <Key colour="var(--series-1)">Page views</Key>
        <Key colour="var(--series-2)" dashed>
          Visitors
        </Key>
        {active ? (
          <span className="ml-auto tabular-nums text-[var(--ink-1)]">
            {active.day} · {fmt(active.views)} views · {fmt(active.visitors)}{" "}
            visitors
          </span>
        ) : null}
      </figcaption>
    </figure>
  );
}

function Key({
  colour,
  dashed,
  children,
}: {
  colour: string;
  dashed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg width="16" height="6" aria-hidden="true">
        <line
          x1="0"
          y1="3"
          x2="16"
          y2="3"
          stroke={colour}
          strokeWidth="2"
          strokeDasharray={dashed ? "3 3" : undefined}
        />
      </svg>
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Ranked bars
// ---------------------------------------------------------------------------

export interface BarRow {
  label: string;
  value: number;
  hint?: string;
}

/**
 * Horizontal bars for a ranked list.
 *
 * One hue, not one per row: these rows are a magnitude ranking, not distinct
 * identities, so colour would carry no information. Labels sit outside the bar
 * so a short bar's label stays readable.
 */
export function RankedBars({
  rows,
  colour = "var(--series-1)",
  max,
}: {
  rows: BarRow[];
  colour?: string;
  max?: number;
}) {
  if (rows.length === 0) return <Empty>Nothing recorded yet.</Empty>;

  const peak = max ?? Math.max(1, ...rows.map((row) => row.value));

  return (
    <ul className="flex flex-col gap-2.5">
      {rows.map((row) => (
        <li key={row.label} className="grid gap-1">
          <div className="flex items-baseline justify-between gap-3 text-[11px]">
            <span className="truncate text-[var(--ink-1)]" title={row.label}>
              {row.label}
            </span>
            <span className="shrink-0 tabular-nums text-[var(--ink-2)]">
              {fmt(row.value)}
              {row.hint ? (
                <span className="ml-1 text-[var(--ink-3)]">{row.hint}</span>
              ) : null}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-[var(--line)]">
            <div
              className="h-1.5 rounded-full"
              style={{
                width: `${Math.max((row.value / peak) * 100, 1.5)}%`,
                background: colour,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// Funnel
// ---------------------------------------------------------------------------

export function Funnel({
  steps,
}: {
  steps: { label: string; value: number; note?: string }[];
}) {
  const top = Math.max(1, steps[0]?.value ?? 1);

  return (
    <ol className="flex flex-col gap-3">
      {steps.map((step, index) => {
        const previous = index > 0 ? steps[index - 1].value : null;
        const rate =
          previous && previous > 0
            ? Math.round((step.value / previous) * 100)
            : null;

        return (
          <li key={step.label}>
            <div className="mb-1 flex items-baseline justify-between gap-3">
              <span className="text-[11px] text-[var(--ink-1)]">
                {step.label}
              </span>
              <span className="tabular-nums text-[13px] font-medium text-[var(--ink-1)]">
                {fmt(step.value)}
                {rate !== null ? (
                  <span className="ml-2 text-[11px] font-normal text-[var(--ink-3)]">
                    {rate}%
                  </span>
                ) : null}
              </span>
            </div>
            <div className="h-7 rounded-md bg-[var(--line)]">
              <div
                className="flex h-7 items-center rounded-md px-2"
                style={{
                  width: `${Math.max((step.value / top) * 100, 2)}%`,
                  background: `color-mix(in oklab, var(--series-1) ${100 - index * 16}%, var(--surface-2))`,
                }}
              />
            </div>
            {step.note ? (
              <p className="mt-1 text-[10px] leading-snug text-[var(--ink-3)]">
                {step.note}
              </p>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

// ---------------------------------------------------------------------------
// Sparkline & misc
// ---------------------------------------------------------------------------

export function Sparkline({
  values,
  colour = "var(--series-1)",
}: {
  values: number[];
  colour?: string;
}) {
  if (values.length < 2) return null;

  const W = 96;
  const H = 24;
  const peak = Math.max(1, ...values);
  const step = W / (values.length - 1);
  const d = values
    .map((v, i) => `${i ? "L" : "M"}${i * step},${H - (v / peak) * H}`)
    .join(" ");

  return (
    <svg width={W} height={H} aria-hidden="true" className="overflow-visible">
      <path
        d={d}
        fill="none"
        stroke={colour}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="grid h-full min-h-24 place-items-center text-center text-[11px] text-[var(--ink-3)]">
      {children}
    </p>
  );
}

export function DataTable({
  head,
  rows,
}: {
  head: string[];
  rows: (string | number)[][];
}) {
  return (
    <table className="w-full text-[11px]">
      <thead className="text-left text-[var(--ink-3)]">
        <tr>
          {head.map((cell) => (
            <th key={cell} className="py-1 pr-4 font-medium">
              {cell}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="text-[var(--ink-2)]">
        {rows.map((row, index) => (
          <tr key={index}>
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                className={`py-1 pr-4 ${cellIndex ? "tabular-nums" : ""}`}
              >
                {typeof cell === "number" ? fmt(cell) : cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
