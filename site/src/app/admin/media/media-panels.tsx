"use client";

import { useState } from "react";

import {
  archiveMediaAction,
  updateMediaAction,
  uploadMediaAction,
} from "../website-actions";
import { ActionForm, FormMessage, SubmitButton } from "@/components/admin-ui";
import { MEDIA_CATEGORIES, type MediaAsset } from "@/lib/media-types";

/**
 * Upload and edit media.
 *
 * Alt text is a required field, not an optional extra: an image published
 * without a description is an accessibility failure, and the library is the
 * right place to stop it rather than hoping somebody adds it later.
 *
 * "Render or photograph" is equally deliberate. Spec §4 requires construction
 * photography to stay visually distinct from architectural renders, and that
 * badge on the public site is driven by this field.
 */

const KINDS = [
  { value: "render", label: "Architectural render" },
  { value: "photograph", label: "Site photograph" },
];

export function UploadPanel() {
  const [name, setName] = useState<string>("");

  return (
    <ActionForm action={uploadMediaAction} className="grid gap-3">
      {({ pending, state }) => (
        <>
          <FormMessage state={state} />

          <label className="grid gap-1.5">
            <span className="text-[11px] text-[var(--ink-2)]">File</span>
            <input
              type="file"
              name="file"
              required
              accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,application/pdf"
              onChange={(event) => setName(event.target.files?.[0]?.name ?? "")}
              className="!py-2 text-[12px] file:mr-3 file:rounded file:border-0 file:bg-[var(--surface-3)] file:px-3 file:py-1.5 file:text-[12px] file:text-[var(--ink-1)]"
            />
            <span className="text-[10px] text-[var(--ink-3)]">
              JPEG, PNG, WebP, AVIF up to 20 MB · MP4, WebM up to 200 MB · PDF up
              to 40 MB
            </span>
          </label>

          <label className="grid gap-1.5">
            <span className="text-[11px] text-[var(--ink-2)]">Title</span>
            <input name="title" placeholder={name || "Shown in the library"} />
          </label>

          <label className="grid gap-1.5">
            <span className="text-[11px] text-[var(--ink-2)]">
              Alt text <span aria-hidden="true">*</span>
            </span>
            <textarea
              name="alt"
              rows={2}
              required
              placeholder="Describe what the image shows, for someone who cannot see it."
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-[11px] text-[var(--ink-2)]">Caption</span>
            <input name="caption" placeholder="Shown under the image (optional)" />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-[11px] text-[var(--ink-2)]">Kind</span>
              <select name="kind" defaultValue="render">
                {KINDS.map((kind) => (
                  <option key={kind.value} value={kind.value}>
                    {kind.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1.5">
              <span className="text-[11px] text-[var(--ink-2)]">Category</span>
              <select name="category" defaultValue="exterior">
                {MEDIA_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <SubmitButton pending={pending}>Upload</SubmitButton>
          <p className="text-[10px] leading-snug text-[var(--ink-3)]">
            Uploads arrive unapproved. Approve one before it can be used on the
            public site.
          </p>
        </>
      )}
    </ActionForm>
  );
}

export function AssetCard({ asset }: { asset: MediaAsset }) {
  const [open, setOpen] = useState(false);
  const isImage = asset.mime.startsWith("image/");
  const isVideo = asset.mime.startsWith("video/");
  const src = `/api/media/${asset.id}`;

  return (
    <li className="panel overflow-hidden">
      <div className="relative aspect-4/3 bg-[var(--surface-1)]">
        {isImage ? (
          /*
            A plain <img>, not next/image. The library must show exactly what
            was uploaded: running it through the optimiser would resample it,
            and a file that is too dark, wrongly cropped or the wrong aspect
            would be quietly corrected here and then wrong on the public site.
            These are admin-only thumbnails, so the LCP argument does not apply.
          */
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={asset.alt}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : isVideo ? (
          <video
            src={src}
            muted
            playsInline
            preload="metadata"
            controls
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full place-items-center text-[11px] text-[var(--ink-3)]">
            {asset.mime}
          </div>
        )}

        <span
          className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] ${
            asset.kind === "render"
              ? "bg-black/60 text-[var(--ink-1)]"
              : "bg-[var(--good)]/20 text-[var(--good)]"
          }`}
        >
          {asset.kind === "render" ? "Render" : "Photograph"}
        </span>

        {asset.approved ? null : (
          <span className="absolute top-2 right-2 rounded-full bg-[var(--warn)]/20 px-2 py-0.5 text-[10px] text-[var(--warn)]">
            Unapproved
          </span>
        )}
      </div>

      <div className="p-3">
        <p className="truncate text-[12px] font-medium" title={asset.title}>
          {asset.title}
        </p>
        <p className="mt-0.5 text-[10px] text-[var(--ink-3)]">
          {asset.category} · {(asset.bytes / 1024 / 1024).toFixed(1)} MB
        </p>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="mt-2 text-[11px] text-[var(--ink-3)] underline underline-offset-2 hover:text-[var(--ink-1)]"
        >
          {open ? "Close" : "Edit"}
        </button>

        {open ? (
          <div className="mt-3 grid gap-3 border-t border-[var(--line)] pt-3">
            <ActionForm action={updateMediaAction} className="grid gap-2.5">
              {({ pending, state }) => (
                <>
                  <FormMessage state={state} />
                  <input type="hidden" name="id" value={asset.id} />

                  <input
                    name="title"
                    defaultValue={asset.title}
                    aria-label="Title"
                  />
                  <textarea
                    name="alt"
                    rows={2}
                    defaultValue={asset.alt}
                    aria-label="Alt text"
                  />
                  <input
                    name="caption"
                    defaultValue={asset.caption ?? ""}
                    placeholder="Caption"
                    aria-label="Caption"
                  />

                  <select name="kind" defaultValue={asset.kind} aria-label="Kind">
                    {KINDS.map((kind) => (
                      <option key={kind.value} value={kind.value}>
                        {kind.label}
                      </option>
                    ))}
                  </select>

                  <select
                    name="category"
                    defaultValue={asset.category}
                    aria-label="Category"
                  >
                    {MEDIA_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <label className="flex items-center gap-2 text-[12px]">
                    <input
                      type="checkbox"
                      name="approved"
                      defaultChecked={asset.approved === 1}
                      className="!w-auto"
                    />
                    Approved for the public site
                  </label>

                  <SubmitButton pending={pending}>Save</SubmitButton>
                </>
              )}
            </ActionForm>

            <ActionForm action={archiveMediaAction}>
              {({ pending }) => (
                <>
                  <input type="hidden" name="id" value={asset.id} />
                  <SubmitButton pending={pending} variant="secondary">
                    Archive
                  </SubmitButton>
                </>
              )}
            </ActionForm>
          </div>
        ) : null}
      </div>
    </li>
  );
}
