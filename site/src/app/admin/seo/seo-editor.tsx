"use client";

import { useState } from "react";

import { saveSeoAction } from "../website-actions";
import { ActionForm, FormMessage, SubmitButton } from "@/components/admin-ui";

/**
 * Per-page SEO.
 *
 * Titles and descriptions are counted as you type against the lengths search
 * engines actually render — roughly 60 and 160 characters. Going over is not
 * blocked, because that is a rendering behaviour rather than a rule, but it is
 * shown so nobody writes a description that gets cut mid-sentence.
 */

const TITLE_TARGET = 60;
const DESCRIPTION_TARGET = 160;

export function SeoRow({
  path,
  title,
  description,
  canonical,
  noindex,
  fallbackTitle,
}: {
  path: string;
  title: string;
  description: string;
  canonical: string;
  noindex: boolean;
  fallbackTitle: string;
}) {
  const [open, setOpen] = useState(false);
  const [titleValue, setTitleValue] = useState(title);
  const [descriptionValue, setDescriptionValue] = useState(description);

  const counter = (value: string, target: number) => {
    const over = value.length > target;
    return (
      <span className={over ? "text-[var(--warn)]" : "text-[var(--ink-3)]"}>
        {value.length}/{target}
        {over ? " — likely truncated" : ""}
      </span>
    );
  };

  return (
    <div className="border-b border-[var(--line)] py-3 last:border-b-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <code className="text-[12px] text-[var(--ink-1)]">{path}</code>
            {noindex ? (
              <span className="rounded-full border border-[var(--warn)]/40 px-2 py-0.5 text-[10px] text-[var(--warn)]">
                noindex
              </span>
            ) : null}
            {!title && !description ? (
              <span className="rounded-full border border-[var(--line-strong)] px-2 py-0.5 text-[10px] text-[var(--ink-3)]">
                using defaults
              </span>
            ) : null}
          </div>
          <p className="mt-1 truncate text-[12px] text-[var(--ink-2)]">
            {title || fallbackTitle}
          </p>
          {description ? (
            <p className="mt-0.5 line-clamp-2 text-[11px] text-[var(--ink-3)]">
              {description}
            </p>
          ) : null}
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
        <ActionForm
          action={saveSeoAction}
          className="mt-3 grid gap-3 rounded-lg bg-[var(--surface-1)] p-3"
        >
          {({ pending, state }) => (
            <>
              <FormMessage state={state} />
              <input type="hidden" name="path" value={path} />

              <label className="grid gap-1.5">
                <span className="flex justify-between text-[11px] text-[var(--ink-2)]">
                  Title {counter(titleValue, TITLE_TARGET)}
                </span>
                <input
                  name="title"
                  value={titleValue}
                  onChange={(event) => setTitleValue(event.target.value)}
                  placeholder={fallbackTitle}
                />
              </label>

              <label className="grid gap-1.5">
                <span className="flex justify-between text-[11px] text-[var(--ink-2)]">
                  Description {counter(descriptionValue, DESCRIPTION_TARGET)}
                </span>
                <textarea
                  name="description"
                  rows={3}
                  value={descriptionValue}
                  onChange={(event) => setDescriptionValue(event.target.value)}
                />
              </label>

              <label className="grid gap-1.5">
                <span className="text-[11px] text-[var(--ink-2)]">
                  Canonical URL
                </span>
                <input
                  name="canonical"
                  defaultValue={canonical}
                  placeholder="Leave empty to use this page's own address"
                />
              </label>

              <label className="flex items-center gap-2 text-[12px]">
                <input
                  type="checkbox"
                  name="noindex"
                  defaultChecked={noindex}
                  className="!w-auto"
                />
                Keep this page out of search results
              </label>

              <SubmitButton pending={pending}>Save</SubmitButton>
            </>
          )}
        </ActionForm>
      ) : null}
    </div>
  );
}
