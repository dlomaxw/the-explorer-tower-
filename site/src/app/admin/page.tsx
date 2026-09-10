import Link from "next/link";

import { fmt } from "@/lib/format";
import { requireUser } from "@/lib/guard";
import { listLeads, openTasks, stageCounts } from "@/lib/crm";
import { overview } from "@/lib/analytics";
import { requestNow } from "@/lib/now";
import { STAGE_LIST } from "@/lib/pipeline";
import { canReadLeads } from "@/lib/roles";
import { StagePill, When } from "@/components/admin-ui";
import { ChartFrame, Sparkline, TimeSeries } from "@/components/charts";

export const metadata = { title: "Overview" };

export default async function AdminHome() {
  const user = await requireUser("/admin");
  const now = requestNow();
  const sales = canReadLeads(user.role);

  const [traffic, counts, tasks, recent] = await Promise.all([
    overview(14),
    sales ? stageCounts(user) : Promise.resolve<Record<string, number>>({}),
    sales ? openTasks(user) : Promise.resolve([]),
    sales ? listLeads(user) : Promise.resolve([]),
  ]);

  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
  const overdue = tasks.filter(
    (task) => new Date(task.due_at).getTime() < now,
  );
  const unassigned = recent.filter((lead) => !lead.owner_id).length;

  return (
    <div className="grid gap-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-lg font-medium tracking-tight">
            {greeting()}, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-[12px] text-[var(--ink-2)]">
            {sales
              ? total === 0
                ? "No leads yet. Inquiries from the website arrive here automatically."
                : `${total} active ${total === 1 ? "lead" : "leads"} in the pipeline.`
              : "Content and website tools are in the Website group."}
          </p>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Visitors"
          value={traffic.totalVisitors}
          caption="last 14 days"
          href="/admin/analytics"
          spark={traffic.days.map((d) => d.visitors)}
        />
        <Metric
          label="Page views"
          value={traffic.totalViews}
          caption="last 14 days"
          href="/admin/analytics"
          spark={traffic.days.map((d) => d.views)}
        />
        {sales ? (
          <>
            <Metric
              label="Active leads"
              value={total}
              caption={unassigned ? `${unassigned} unassigned` : "all assigned"}
              href="/admin/leads"
              tone={unassigned ? "warn" : undefined}
            />
            <Metric
              label="Overdue tasks"
              value={overdue.length}
              caption={`${tasks.length} open`}
              href="/admin/tasks"
              tone={overdue.length ? "bad" : undefined}
            />
          </>
        ) : null}
      </section>

      <ChartFrame
        title="Traffic"
        hint="Page views and unique visitors, last 14 days"
        right={
          <Link
            href="/admin/analytics"
            className="text-[11px] text-[var(--ink-3)] underline underline-offset-2 hover:text-[var(--ink-1)]"
          >
            Full analysis
          </Link>
        }
      >
        <TimeSeries points={traffic.days} />
      </ChartFrame>

      {sales ? (
        <>
          <section className="panel p-5">
            <h2 className="mb-4 text-[13px] font-medium">Pipeline</h2>
            <div className="scroll-x -mx-1 px-1">
              <div className="flex min-w-max gap-2">
                {STAGE_LIST.map((stage) => {
                  const count = counts[stage.id] ?? 0;
                  return (
                    <Link
                      key={stage.id}
                      href={`/admin/leads?stage=${stage.id}`}
                      className="min-w-30 flex-1 rounded-lg border border-[var(--line)] px-3 py-2.5 transition-colors hover:border-[var(--line-strong)] hover:bg-[var(--surface-3)]"
                    >
                      <span
                        className={`block text-xl font-medium tabular-nums ${
                          count ? "" : "text-[var(--ink-3)]"
                        }`}
                      >
                        {count}
                      </span>
                      <span className="mt-1 block text-[10px] leading-tight text-[var(--ink-3)]">
                        {stage.ordinal}. {stage.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          <div className="grid gap-5 lg:grid-cols-2">
            <section className="panel p-5">
              <h2 className="mb-3 text-[13px] font-medium">Next tasks</h2>
              {tasks.length === 0 ? (
                <Blank>Nothing due. Tasks created on a lead appear here.</Blank>
              ) : (
                <ul className="divide-y divide-[var(--line)]">
                  {tasks.slice(0, 6).map((task) => (
                    <li key={task.id} className="py-2.5 first:pt-0">
                      <Link
                        href={`/admin/leads/${task.lead_id}`}
                        className="text-[13px] hover:underline"
                      >
                        {task.title}
                      </Link>
                      <p className="mt-0.5 text-[11px] text-[var(--ink-3)]">
                        {task.lead_name} · due{" "}
                        <When iso={task.due_at} relative now={now} />
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="panel p-5">
              <h2 className="mb-3 text-[13px] font-medium">Latest inquiries</h2>
              {recent.length === 0 ? (
                <Blank>
                  Inquiries submitted on the public site appear here the moment
                  they are saved.
                </Blank>
              ) : (
                <ul className="divide-y divide-[var(--line)]">
                  {recent.slice(0, 6).map((lead) => (
                    <li key={lead.id} className="py-2.5 first:pt-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="text-[13px] hover:underline"
                        >
                          {lead.full_name}
                        </Link>
                        <StagePill stage={lead.stage} />
                      </div>
                      <p className="mt-0.5 text-[11px] text-[var(--ink-3)]">
                        {lead.reference} ·{" "}
                        <When iso={lead.created_at} relative now={now} />
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      ) : null}
    </div>
  );
}

/** Kampala time, since that is where the sales team works. */
function greeting(): string {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hour12: false,
      timeZone: "Africa/Kampala",
    }).format(new Date()),
  );
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function Metric({
  label,
  value,
  caption,
  href,
  spark,
  tone,
}: {
  label: string;
  value: number;
  caption?: string;
  href: string;
  spark?: number[];
  tone?: "warn" | "bad";
}) {
  const colour =
    tone === "bad"
      ? "text-[var(--bad)]"
      : tone === "warn"
        ? "text-[var(--warn)]"
        : "";

  return (
    <Link
      href={href}
      className="panel panel-lit flex flex-col p-4 transition-colors hover:border-[var(--line-strong)]"
    >
      <p className="text-[11px] text-[var(--ink-3)]">{label}</p>
      <p className={`mt-1 text-2xl font-medium tabular-nums ${colour}`}>
        {fmt(value)}
      </p>
      <div className="mt-auto flex items-end justify-between gap-2 pt-2">
        {caption ? (
          <span className="text-[10px] text-[var(--ink-3)]">{caption}</span>
        ) : (
          <span />
        )}
        {spark && spark.some((n) => n > 0) ? (
          <Sparkline values={spark} />
        ) : null}
      </div>
    </Link>
  );
}

function Blank({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed border-[var(--line)] px-4 py-8 text-center text-[12px] text-[var(--ink-3)]">
      {children}
    </p>
  );
}
