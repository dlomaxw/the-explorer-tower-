"use client";

import { useState } from "react";

import { resetContentAction, saveContentAction } from "../website-actions";
import { ActionForm, FormMessage, SubmitButton } from "@/components/admin-ui";
import type { EditableField } from "@/content/editable";

/**
 * One editable string.
 *
 * Collapsed until opened, because a page of forty open textareas is unusable.
 * The current value is shown either way, so scanning what the site says does
 * not require opening anything.
 *
 * "Using the default" is a real state, not a blank: clearing an override
 * restores the value written in code, which is what makes an accidental edit
 * recoverable without a backup.
 */
export function ContentField({
  field,
  current,
  overridden,
}: {
  field: EditableField;
  current: string;
  overridden: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[var(--line)] py-3 last:border-b-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[13px] font-medium">{field.label}</p>
            {field.awaitingApproval && !overridden ? (
              <span className="rounded-full border border-[var(--warn)]/40 bg-[var(--warn)]/10 px-2 py-0.5 text-[10px] text-[var(--warn)]">
                Awaiting the client
              </span>
            ) : null}
            {overridden ? (
              <span className="rounded-full border border-[var(--line-strong)] px-2 py-0.5 text-[10px] text-[var(--ink-3)]">
                Edited
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 text-[11px] text-[var(--ink-3)]">{field.where}</p>
          <p className="mt-1.5 line-clamp-2 text-[12px] whitespace-pre-wrap text-[var(--ink-2)]">
            {current || (
              <span className="text-[var(--ink-3)] italic">
                Empty — the page shows an approved alternative instead.
              </span>
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="shrink-0 rounded-lg border border-[var(--line-strong)] px-3 py-1.5 text-[12px] transition-colors hover:bg-[var(--surface-3)]"
        >
          {open ? "Close" : "Edit"}
        </button>
      </div>

      {open ? (
        <div className="mt-3 grid gap-3 rounded-lg bg-[var(--surface-1)] p-3">
          <ActionForm action={saveContentAction} className="grid gap-3">
            {({ pending, state }) => (
              <>
                <FormMessage state={state} />
                <input type="hidden" name="key" value={field.key} />

                {field.multiline ? (
                  <textarea
                    name="value"
                    rows={6}
                    defaultValue={current}
                    aria-label={field.label}
                  />
                ) : (
                  <input
                    name="value"
                    defaultValue={current}
                    aria-label={field.label}
                  />
                )}

                <input
                  name="summary"
                  placeholder="What changed, and why (optional — saved to the history)"
                  aria-label="Change summary"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <SubmitButton pending={pending}>Save</SubmitButton>
                  <code className="text-[10px] text-[var(--ink-3)]">
                    {field.key}
                  </code>
                </div>
              </>
            )}
          </ActionForm>

          {overridden ? (
            <ActionForm action={resetContentAction} className="flex">
              {({ pending }) => (
                <>
                  <input type="hidden" name="key" value={field.key} />
                  <SubmitButton pending={pending} variant="secondary">
                    Revert to the built-in default
                  </SubmitButton>
                </>
              )}
            </ActionForm>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
