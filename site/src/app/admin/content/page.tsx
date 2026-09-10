import { requireUser } from "@/lib/guard";
import { contentOverrides } from "@/lib/cms";
import { AWAITING, EDITABLE } from "@/content/editable";
import { ContentField } from "./content-editor";

export const metadata = { title: "Content" };

export default async function ContentPage() {
  await requireUser("/admin/content");
  const overrides = await contentOverrides();

  const outstanding = AWAITING.filter((field) => !overrides.has(field.key));

  return (
    <div className="grid gap-5">
      <header>
        <h1 className="text-lg font-medium tracking-tight">Content</h1>
        <p className="mt-1 max-w-2xl text-[12px] text-[var(--ink-2)]">
          Every editable string on the public site. A field you have not edited
          uses the value written in code, so the site is never broken by an empty
          database and reverting is always possible.
        </p>
      </header>

      {outstanding.length > 0 ? (
        <section className="panel border-[var(--warn)]/30 p-5">
          <h2 className="text-[13px] font-medium text-[var(--warn)]">
            {outstanding.length} facts still awaiting the client
          </h2>
          <p className="mt-1 max-w-2xl text-[12px] text-[var(--ink-2)]">
            These are unconfirmed, so the public site shows an approved
            alternative — “Price on request” rather than a number somebody
            guessed. Filling one in here publishes it.
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {outstanding.map((field) => (
              <li
                key={field.key}
                className="rounded-full border border-[var(--line-strong)] px-2.5 py-1 text-[11px] text-[var(--ink-2)]"
              >
                {field.label}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {EDITABLE.map((group) => (
        <section key={group.id} className="panel p-5">
          <h2 className="text-[13px] font-medium">{group.title}</h2>
          <p className="mt-1 mb-2 max-w-2xl text-[11px] text-[var(--ink-3)]">
            {group.description}
          </p>
          <div>
            {group.fields.map((field) => (
              <ContentField
                key={field.key}
                field={field}
                current={overrides.get(field.key) ?? field.default}
                overridden={overrides.has(field.key)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
