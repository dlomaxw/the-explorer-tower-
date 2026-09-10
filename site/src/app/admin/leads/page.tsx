import Link from "next/link";

import { requireUser } from "@/lib/guard";
import { listLeads } from "@/lib/crm";
import { listUsers } from "@/lib/auth";
import { STAGE_LIST } from "@/lib/pipeline";
import { can, canReadLeads, leadScope } from "@/lib/roles";
import { PriorityDot, StagePill, When } from "@/components/admin-ui";
import { requestNow } from "@/lib/now";

export const metadata = { title: "Leads" };

export default async function LeadsPage({
  searchParams,
}: PageProps<"/admin/leads">) {
  const user = await requireUser("/admin/leads");
  const params = await searchParams;

  const one = (key: string) =>
    typeof params[key] === "string" ? (params[key] as string) : "";

  if (!canReadLeads(user.role)) {
    return (
      <p className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-600">
        Your role does not include access to prospect records.
      </p>
    );
  }

  const [leads, users] = await Promise.all([
    listLeads(user, {
      stage: one("stage"),
      owner: one("owner"),
      search: one("q"),
      priority: one("priority"),
      overdue: one("overdue") === "1",
    }),
    can(user.role, "leads:assign") ? listUsers() : Promise.resolve([]),
  ]);

  // Contact columns are omitted entirely for roles without the capability,
  // rather than rendered and hidden with CSS.
  const showContact = can(user.role, "leads:read:contact");
  const now = requestNow();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Leads</h1>
          <p className="mt-1 text-sm text-slate-600">
            {leadScope(user.role) === "assigned"
              ? "Leads assigned to you."
              : "Every lead on the project."}
            {leads.length > 0 ? ` ${leads.length} shown.` : ""}
          </p>
        </div>
      </div>

      <form
        method="get"
        className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4"
      >
        <label className="min-w-52 flex-1">
          <span className="mb-1.5 block text-xs font-medium text-slate-600">
            Search
          </span>
          <input
            name="q"
            defaultValue={one("q")}
            placeholder="Name, reference, email or phone"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-medium text-slate-600">
            Stage
          </span>
          <select
            name="stage"
            defaultValue={one("stage")}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All stages</option>
            {STAGE_LIST.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.ordinal}. {stage.label}
              </option>
            ))}
          </select>
        </label>

        {users.length > 0 ? (
          <label>
            <span className="mb-1.5 block text-xs font-medium text-slate-600">
              Owner
            </span>
            <select
              name="owner"
              defaultValue={one("owner")}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">Anyone</option>
              <option value="unassigned">Unassigned</option>
              {users.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <label className="flex items-center gap-2 pb-2 text-sm">
          <input
            type="checkbox"
            name="overdue"
            value="1"
            defaultChecked={one("overdue") === "1"}
            className="size-4 rounded border-slate-300"
          />
          Overdue only
        </label>

        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Apply
        </button>
        <Link
          href="/admin/leads"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
        >
          Reset
        </Link>
      </form>

      {leads.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center text-sm text-slate-500">
          No leads match. Inquiries from the public site arrive here
          automatically, at stage one.
        </p>
      ) : (
        <div className="scroll-x rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-4xl text-sm">
            <thead className="border-b border-slate-200 text-left text-xs text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Reference</th>
                {showContact ? (
                  <th className="px-4 py-3 font-medium">Contact</th>
                ) : null}
                <th className="px-4 py-3 font-medium">Stage</th>
                <th className="px-4 py-3 font-medium">Owner</th>
                <th className="px-4 py-3 font-medium">Next action</th>
                <th className="px-4 py-3 font-medium">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="inline-flex items-center gap-2 font-medium hover:underline"
                    >
                      <PriorityDot priority={lead.priority} />
                      {lead.full_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">
                    {lead.reference}
                  </td>
                  {showContact ? (
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {lead.email ?? lead.phone ?? "—"}
                    </td>
                  ) : null}
                  <td className="px-4 py-3">
                    <StagePill stage={lead.stage} />
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {lead.owner_name ?? (
                      <span className="text-amber-700">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {lead.next_action ? (
                      <>
                        <span className="block">{lead.next_action}</span>
                        <span className="text-slate-500">
                          <When iso={lead.next_action_due} relative now={now} />
                        </span>
                      </>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    <When iso={lead.created_at} relative now={now} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
