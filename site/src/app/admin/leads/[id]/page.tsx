import Link from "next/link";
import { notFound } from "next/navigation";

import { requireUser } from "@/lib/guard";
import { getLead, leadActivities, leadTasks } from "@/lib/crm";
import { listUsers } from "@/lib/auth";
import { STAGE_DEFINITIONS, stageLabel } from "@/lib/pipeline";
import { can } from "@/lib/roles";
import { StagePill, When } from "@/components/admin-ui";
import { requestNow } from "@/lib/now";
import {
  AssignPanel,
  DetailsPanel,
  NotePanel,
  StagePanel,
  TaskPanel,
} from "./lead-panels";

export const metadata = { title: "Lead" };

const ACTIVITY_LABELS: Record<string, string> = {
  "inquiry-received": "Inquiry received",
  "stage-change": "Stage changed",
  assignment: "Assignment",
  note: "Note",
  "call-logged": "Call logged",
  "message-logged": "Message logged",
  "info-shared": "Information shared",
  feedback: "Feedback",
  "task-created": "Task created",
  "task-completed": "Task completed",
  "details-updated": "Details updated",
};

export default async function LeadPage({
  params,
}: PageProps<"/admin/leads/[id]">) {
  const { id } = await params;
  const user = await requireUser(`/admin/leads/${id}`);

  // `getLead` applies the role's visibility rule, so an agent who types
  // another agent's lead id gets a 404 rather than the record (test A07).
  const lead = await getLead(user, id);
  if (!lead) notFound();

  const [activities, tasks, people] = await Promise.all([
    leadActivities(id),
    leadTasks(id),
    can(user.role, "leads:assign") ? listUsers() : Promise.resolve([]),
  ]);

  const showContact = can(user.role, "leads:read:contact");
  const editable = can(user.role, "leads:edit");
  const campaign = JSON.parse(lead.campaign || "{}") as Record<string, string>;
  const now = requestNow();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/leads"
          className="text-xs text-slate-500 hover:underline"
        >
          ← All leads
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-semibold tracking-tight">
            {lead.full_name}
          </h1>
          <StagePill stage={lead.stage} />
          {lead.previous_stage ? (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
              returns to {stageLabel(lead.previous_stage)}
            </span>
          ) : null}
        </div>
        <p className="mt-1 font-mono text-xs text-slate-500">
          {lead.reference} · received <When iso={lead.created_at} />
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <Card title="Inquiry">
            <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
              <Row label="Type">{lead.kind}</Row>
              <Row label="Residence interest">{lead.unit_interest}</Row>
              {showContact ? (
                <>
                  <Row label="Email">
                    {lead.email ? (
                      <a href={`mailto:${lead.email}`} className="hover:underline">
                        {lead.email}
                      </a>
                    ) : null}
                  </Row>
                  <Row label="Phone">
                    {lead.phone ? (
                      <a href={`tel:${lead.phone}`} className="hover:underline">
                        {lead.phone}
                      </a>
                    ) : null}
                  </Row>
                  <Row label="Preferred channel">{lead.preferred_channel}</Row>
                  <Row label="Preferred time">{lead.preferred_time}</Row>
                </>
              ) : (
                <Row label="Contact details">
                  <span className="text-slate-400 italic">
                    Not available to your role
                  </span>
                </Row>
              )}
              <Row label="Time zone">{lead.time_zone}</Row>
              <Row label="Source">{lead.source}</Row>
              <Row label="Landing page">{lead.landing_page}</Row>
              <Row label="Marketing consent">
                {lead.marketing_consent ? "Given" : "Not given"}
                <span className="block text-xs text-slate-500">
                  notice {lead.consent_notice_version}, recorded{" "}
                  <When iso={lead.consent_recorded_at} />
                </span>
              </Row>
            </dl>

            {lead.message ? (
              <div className="mt-4 rounded-lg bg-slate-50 px-4 py-3">
                <p className="mb-1 text-xs font-medium text-slate-500">
                  Their message
                </p>
                <p className="text-sm whitespace-pre-wrap">{lead.message}</p>
              </div>
            ) : null}

            {Object.keys(campaign).length > 0 ? (
              <p className="mt-3 text-xs text-slate-500">
                Campaign:{" "}
                {Object.entries(campaign)
                  .map(([key, value]) => `${key}=${value}`)
                  .join(" · ")}
              </p>
            ) : null}
          </Card>

          {editable ? (
            <Card title="Qualification">
              <DetailsPanel leadId={lead.id} lead={lead} />
            </Card>
          ) : null}

          <Card title="Timeline">
            <ol className="space-y-4">
              {activities.map((activity) => {
                const detail = JSON.parse(activity.detail || "{}") as Record<
                  string,
                  unknown
                >;
                return (
                  <li
                    key={activity.id}
                    className="border-l-2 border-slate-200 pl-4"
                  >
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-sm font-medium">
                        {ACTIVITY_LABELS[activity.type] ?? activity.type}
                      </span>
                      <span className="text-xs text-slate-500">
                        {activity.actor_name} · <When iso={activity.created_at} />
                      </span>
                    </div>
                    {activity.type === "stage-change" ? (
                      <p className="mt-0.5 text-xs text-slate-500">
                        {stageLabel(String(detail.from))} →{" "}
                        {stageLabel(String(detail.to))}
                        {detail.subtype ? ` · ${String(detail.subtype)}` : ""}
                      </p>
                    ) : null}
                    {activity.body ? (
                      <p className="mt-1 text-sm whitespace-pre-wrap text-slate-700">
                        {activity.body}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </Card>
        </div>

        <aside className="space-y-6">
          {can(user.role, "leads:stage") ? (
            <Card title="Pipeline">
              <p className="mb-3 text-xs text-slate-500">
                {STAGE_DEFINITIONS[lead.stage].evidence}
              </p>
              <StagePanel
                leadId={lead.id}
                current={lead.stage}
                canConfirmCommercial={can(user.role, "leads:confirm-commercial")}
              />
            </Card>
          ) : null}

          {people.length > 0 ? (
            <Card title="Assignment">
              <AssignPanel
                leadId={lead.id}
                people={people}
                ownerId={lead.owner_id}
              />
            </Card>
          ) : (
            <Card title="Assignment">
              <p className="text-sm text-slate-600">
                {lead.owner_name ?? "Unassigned"}
              </p>
            </Card>
          )}

          {editable ? (
            <Card title="Add to timeline">
              <NotePanel leadId={lead.id} />
            </Card>
          ) : null}

          <Card title="Tasks">
            {tasks.length === 0 ? (
              <p className="mb-4 text-sm text-slate-500">No tasks yet.</p>
            ) : (
              <ul className="mb-4 space-y-2 text-sm">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-start justify-between gap-2"
                  >
                    <span
                      className={
                        task.status === "done"
                          ? "text-slate-400 line-through"
                          : ""
                      }
                    >
                      {task.title}
                      <span className="block text-xs text-slate-500">
                        due <When iso={task.due_at} relative now={now} />
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {can(user.role, "tasks:write") ? <TaskPanel leadId={lead.id} /> : null}
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="mb-4 text-sm font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-0.5">
        {children || <span className="text-slate-400">—</span>}
      </dd>
    </div>
  );
}
