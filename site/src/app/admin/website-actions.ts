"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/guard";
import {
  MediaError,
  archiveMedia,
  clearContent,
  setContent,
  updateMedia,
  uploadMedia,
} from "@/lib/cms";
import { data } from "@/lib/data";
import { findEditable } from "@/content/editable";
import { PUBLIC_PATHS } from "@/lib/seo";
import type { ActionState } from "./actions";

/**
 * Server actions for the website tools.
 *
 * Every one re-reads the session rather than trusting the form, and content
 * keys are checked against the registry — a crafted post cannot invent a key
 * and write an arbitrary row into the content table.
 */

const text = (form: FormData, key: string) =>
  typeof form.get(key) === "string" ? (form.get(key) as string) : "";

export async function saveContentAction(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const key = text(form, "key");

  if (!findEditable(key)) {
    return { error: "That is not an editable field." };
  }

  try {
    await setContent(user, key, text(form, "value"), text(form, "summary"));
  } catch {
    return { error: "Could not save that change." };
  }

  revalidatePath("/admin/content");
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function resetContentAction(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const key = text(form, "key");

  if (!findEditable(key)) return { error: "That is not an editable field." };

  await clearContent(user, key);
  revalidatePath("/admin/content");
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function uploadMediaAction(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const file = form.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a file to upload." };
  }

  try {
    await uploadMedia(user, {
      file,
      title: text(form, "title"),
      alt: text(form, "alt"),
      caption: text(form, "caption"),
      kind: text(form, "kind") || "render",
      category: text(form, "category") || "exterior",
    });
  } catch (error) {
    return {
      error:
        error instanceof MediaError
          ? error.message
          : "The upload failed. Nothing was saved.",
    };
  }

  revalidatePath("/admin/media");
  return { ok: true };
}

export async function updateMediaAction(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const user = await requireUser();

  try {
    await updateMedia(user, text(form, "id"), {
      title: text(form, "title"),
      alt: text(form, "alt"),
      caption: text(form, "caption"),
      kind: text(form, "kind"),
      category: text(form, "category"),
      approved: form.get("approved") === "on",
    });
  } catch (error) {
    return {
      error: error instanceof MediaError ? error.message : "Could not save.",
    };
  }

  revalidatePath("/admin/media");
  return { ok: true };
}

export async function archiveMediaAction(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  await archiveMedia(user, text(form, "id"));
  revalidatePath("/admin/media");
  return { ok: true };
}

export async function saveSeoAction(
  _state: ActionState,
  form: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const path = text(form, "path");

  // Only real public paths, so the table cannot be filled with junk keys.
  if (!PUBLIC_PATHS.includes(path)) {
    return { error: "That is not a public page." };
  }

  const db = await data();
  await db.execute(
    `INSERT INTO seo_meta (path, title, description, canonical, noindex, updated_at, updated_by)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(path) DO UPDATE SET
       title = excluded.title,
       description = excluded.description,
       canonical = excluded.canonical,
       noindex = excluded.noindex,
       updated_at = excluded.updated_at,
       updated_by = excluded.updated_by`,
    [
      path,
      text(form, "title").trim() || null,
      text(form, "description").trim() || null,
      text(form, "canonical").trim() || null,
      form.get("noindex") === "on" ? 1 : 0,
      new Date().toISOString(),
      user.id,
    ],
  );

  revalidatePath("/admin/seo");
  revalidatePath(path);
  return { ok: true };
}
