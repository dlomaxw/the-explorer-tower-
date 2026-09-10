import Link from "next/link";

import { fmt } from "@/lib/format";
import { requireUser } from "@/lib/guard";
import { overview } from "@/lib/analytics";
import {
  ChartFrame,
  DataTable,
  Funnel,
  RankedBars,
  TimeSeries,
} from "@/components/charts";

export const metadata = { title: "Analytics" };

const RANGES = [7, 30, 90] as const;

const CHANNEL_LABELS: Record<string, string> = {
  direct: "Direct",
  "organic-search": "Search",
  social: "Social",
  referral: "Referral",
  email: "Email",
  paid: "Paid",
  campaign: "Campaign link",
};

const EVENT_LABELS: Record<string, string> = {
  view_unit: "Viewed a residence",
  brochure_download: "Brochure download",
  inquiry_submitted: "Inquiry submitted",
  callback_requested: "Callback requested",
  meeting_requested: "Meeting requested",
  visit_requested: "Visit requested",
  whatsapp_click: "WhatsApp click",
  phone_click: "Phone click",
  gallery_open: "Gallery opened",
  film_play: "Film played",
  journey_complete: "Journey completed",
};

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireUser("/admin/analytics");
  const params = await searchParams;

  const requested = Number(
    typeof params.days === "string" ? params.days : "30",
  );
  const days = RANGES.includes(requested as (typeof RANGES)[number])
    ? requested
    : 30;

  const report = await overview(days);
  const hasData = report.totalViews > 0;

  return (
    <div className="grid gap-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-lg font-medium tracking-tight">Analytics</h1>
          <p className="mt-1 max-w-2xl text-[12px] text-[var(--ink-2)]">
            First-party measurement. No third-party tag, no cookie, and no
            durable identifier — visitors are counted with a salted hash that
            rotates daily, so nobody can be recognised across days or joined
            back to a lead.
          </p>
        </div>

        <nav aria-label="Date range" className="flex gap-1">
          {RANGES.map((range) => (
            <Link
              key={range}
              href={`/admin/analytics?days=${range}`}
              aria-current={range === days ? "true" : undefined}
              className={`rounded-lg border px-3 py-1.5 text-[12px] transition-colors ${
                range === days
                  ? "border-[var(--accent)] text-[var(--ink-1)]"
                  : "border-[var(--line)] text-[var(--ink-3)] hover:text-[var(--ink-1)]"
              }`}
            >
              {range}d
            </Link>
          ))}
        </nav>
      </header>

      {!hasData ? (
        <div className="panel p-8 text-center">
          <p className="text-[13px] text-[var(--ink-1)]">
            No traffic recorded in this period.
          </p>
          <p className="mx-auto mt-2 max-w-md text-[12px] text-[var(--ink-3)]">
            Measurement starts the moment somebody loads a public page. If the
            site has just been deployed, this fills in on its own.
          </p>
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Visitors" value={report.totalVisitors} hint="unique per day" />
        <Stat label="Page views" value={report.totalViews} />
        <Stat label="Sessions" value={report.totalSessions} />
        <Stat
          label="Pages per session"
          value={
            report.totalSessions
              ? Math.round((report.totalViews / report.totalSessions) * 10) / 10
              : 0
          }
          decimal
        />
      </section>

      <ChartFrame
        title="Traffic"
        hint="Page views and unique visitors per day"
        table={
          <DataTable
            head={["Day", "Views", "Visitors"]}
            rows={report.days.map((d) => [d.day, d.views, d.visitors])}
          />
        }
      >
        <TimeSeries points={report.days} />
      </ChartFrame>

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartFrame
          title="Where visitors come from"
          hint="Grouped by channel. A UTM label always wins over an inferred referrer."
          table={
            <DataTable
              head={["Channel", "Visitors", "Views"]}
              rows={report.channels.map((c) => [
                CHANNEL_LABELS[c.channel] ?? c.channel,
                c.visitors,
                c.views,
              ])}
            />
          }
        >
          <RankedBars
            rows={report.channels.map((c) => ({
              label: CHANNEL_LABELS[c.channel] ?? c.channel,
              value: c.visitors,
            }))}
          />
          <p className="mt-3 text-[10px] leading-snug text-[var(--ink-3)]">
            “Direct” honestly includes app opens, QR scans and browsers that
            strip the referrer — it is not only people typing the address.
          </p>
        </ChartFrame>

        <ChartFrame
          title="Interest to inquiry"
          hint="Each step counts distinct events, not a strict path through the site"
        >
          <Funnel steps={report.funnel} />
        </ChartFrame>

        <ChartFrame
          title="Most viewed pages"
          table={
            <DataTable
              head={["Path", "Views", "Visitors"]}
              rows={report.pages.map((p) => [p.path, p.views, p.visitors])}
            />
          }
        >
          <RankedBars
            rows={report.pages.map((p) => ({
              label: p.path,
              value: p.views,
            }))}
            colour="var(--series-3)"
          />
        </ChartFrame>

        <ChartFrame title="Referring sites">
          <RankedBars
            rows={report.referrers.map((r) => ({
              label: r.host,
              value: r.views,
            }))}
            colour="var(--series-2)"
          />
        </ChartFrame>

        <ChartFrame title="Devices">
          <RankedBars
            rows={report.devices.map((d) => ({
              label: d.device,
              value: d.visitors,
            }))}
            colour="var(--series-4)"
          />
        </ChartFrame>

        <ChartFrame
          title="Countries"
          hint="From the edge network's country header — coarse, and absent for some visitors"
        >
          <RankedBars
            rows={report.countries.map((c) => ({
              label: c.country,
              value: c.visitors,
            }))}
            colour="var(--series-3)"
          />
        </ChartFrame>
      </div>

      <ChartFrame
        title="Actions taken"
        hint="Clicks measure intent. A WhatsApp click means the button was pressed, never that a conversation happened."
        table={
          <DataTable
            head={["Event", "Count"]}
            rows={report.events.map((e) => [
              EVENT_LABELS[e.name] ?? e.name,
              e.count,
            ])}
          />
        }
      >
        <RankedBars
          rows={report.events.map((e) => ({
            label: EVENT_LABELS[e.name] ?? e.name,
            value: e.count,
          }))}
        />
      </ChartFrame>

      {report.campaigns.length > 0 ? (
        <ChartFrame title="Campaigns" hint="From utm_campaign on the entry URL">
          <DataTable
            head={["Campaign", "Source", "Views"]}
            rows={report.campaigns.map((c) => [
              c.campaign,
              c.source ?? "—",
              c.views,
            ])}
          />
        </ChartFrame>
      ) : null}
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  decimal,
}: {
  label: string;
  value: number;
  hint?: string;
  decimal?: boolean;
}) {
  return (
    <div className="panel panel-lit p-4">
      <p className="text-[11px] text-[var(--ink-3)]">{label}</p>
      <p className="mt-1 text-2xl font-medium tabular-nums">
        {decimal ? value.toFixed(1) : fmt(value)}
      </p>
      {hint ? (
        <p className="mt-0.5 text-[10px] text-[var(--ink-3)]">{hint}</p>
      ) : null}
    </div>
  );
}
