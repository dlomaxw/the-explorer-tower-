import { requireCapability } from "@/lib/guard";
import { recentAudit } from "@/lib/crm";
import { When } from "@/components/admin-ui";

export const metadata = { title: "Audit" };

/**
 * The append-only record of sensitive changes (spec §12).
 *
 * Read-only by construction: nothing in the application updates or deletes an
 * audit row, and this screen offers no way to try.
 */
export default async function AuditPage() {
  await requireCapability("audit:read", "/admin/audit");
  const events = await recentAudit();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Audit</h1>
        <p className="mt-1 max-w-prose text-sm text-slate-600">
          Stage changes, assignments and other sensitive actions, newest first.
          Entries are written once and never edited or removed.
        </p>
      </div>

      {events.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center text-sm text-slate-500">
          Nothing recorded yet.
        </p>
      ) : (
        <div className="scroll-x rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-3xl text-sm">
            <thead className="border-b border-slate-200 text-left text-xs text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Who</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="px-4 py-3 text-xs whitespace-nowrap text-slate-500">
                    <When iso={event.created_at} />
                  </td>
                  <td className="px-4 py-3">{event.actor_name}</td>
                  <td className="px-4 py-3 font-mono text-xs">{event.action}</td>
                  <td className="px-4 py-3 font-mono text-xs break-all text-slate-500">
                    {event.detail}
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
