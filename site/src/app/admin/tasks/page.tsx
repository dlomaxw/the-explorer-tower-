import Link from "next/link";

import { requireCapability } from "@/lib/guard";
import { openTasks } from "@/lib/crm";
import { can } from "@/lib/roles";
import { When } from "@/components/admin-ui";
import { requestNow } from "@/lib/now";
import { CompleteTaskForm } from "./complete-form";

export const metadata = { title: "Tasks" };

export default async function TasksPage() {
  const user = await requireCapability("tasks:read", "/admin/tasks");
  const tasks = await openTasks(user);

  const now = requestNow();
  const overdue = tasks.filter((task) => new Date(task.due_at).getTime() < now);
  const upcoming = tasks.filter(
    (task) => new Date(task.due_at).getTime() >= now,
  );
  const writable = can(user.role, "tasks:write");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Tasks</h1>
        <p className="mt-1 text-sm text-slate-600">
          Open follow-ups across the leads you can see, soonest first.
        </p>
      </div>

      {tasks.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center text-sm text-slate-500">
          Nothing open. Tasks created on a lead appear here.
        </p>
      ) : (
        <>
          {overdue.length > 0 ? (
            <Group
              title={`Overdue (${overdue.length})`}
              tasks={overdue}
              writable={writable}
              now={now}
              alert
            />
          ) : null}
          {upcoming.length > 0 ? (
            <Group title="Upcoming" tasks={upcoming} writable={writable} now={now} />
          ) : null}
        </>
      )}
    </div>
  );
}

function Group({
  title,
  tasks,
  writable,
  now,
  alert,
}: {
  title: string;
  tasks: Awaited<ReturnType<typeof openTasks>>;
  writable: boolean;
  now: number;
  alert?: boolean;
}) {
  return (
    <section>
      <h2
        className={`mb-3 text-sm font-semibold ${alert ? "text-red-700" : ""}`}
      >
        {title}
      </h2>
      <ul
        className={`divide-y divide-slate-100 rounded-xl border bg-white ${
          alert ? "border-red-200" : "border-slate-200"
        }`}
      >
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex flex-wrap items-start justify-between gap-4 px-4 py-3"
          >
            <div className="min-w-52 flex-1">
              <p className="text-sm font-medium">{task.title}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                <Link
                  href={`/admin/leads/${task.lead_id}`}
                  className="hover:underline"
                >
                  {task.lead_name}
                </Link>
                {" · "}
                {task.lead_reference}
                {" · due "}
                <When iso={task.due_at} relative now={now} />
                {task.owner_name ? ` · ${task.owner_name}` : ""}
              </p>
            </div>
            {writable ? <CompleteTaskForm taskId={task.id} /> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
