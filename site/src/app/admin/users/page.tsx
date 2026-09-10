import { requireCapability } from "@/lib/guard";
import { listUsers } from "@/lib/auth";
import { ROLE_DESCRIPTIONS, ROLE_LABELS, ROLES } from "@/lib/roles";
import { When } from "@/components/admin-ui";
import { requestNow } from "@/lib/now";
import { NewUserForm } from "./new-user-form";

export const metadata = { title: "Users" };

export default async function UsersPage() {
  await requireCapability("users:manage", "/admin/users");
  const people = await listUsers();
  const now = requestNow();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Users and roles</h1>
        <p className="mt-1 max-w-prose text-sm text-slate-600">
          Roles decide what each person can reach. Every check is applied on the
          server, so hiding a screen is never what protects the data behind it.
        </p>
      </div>

      <section className="scroll-x rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-3xl text-sm">
          <thead className="border-b border-slate-200 text-left text-xs text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Last signed in</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {people.map((person) => (
              <tr key={person.id}>
                <td className="px-4 py-3 font-medium">
                  {person.name}
                  {person.disabled ? (
                    <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
                      disabled
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-slate-600">{person.email}</td>
                <td className="px-4 py-3">{ROLE_LABELS[person.role]}</td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  <When iso={person.lastLoginAt} relative now={now} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold">Add a user</h2>
          <NewUserForm />
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold">What each role can do</h2>
          <dl className="space-y-3 text-sm">
            {ROLES.map((role) => (
              <div key={role}>
                <dt className="font-medium">{ROLE_LABELS[role]}</dt>
                <dd className="text-xs leading-relaxed text-slate-600">
                  {ROLE_DESCRIPTIONS[role]}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
