import "server-only";

import { randomUUID } from "node:crypto";

import { data } from "./data";
import type { SessionUser } from "./auth";
import { deleteObject, putObject } from "./r2";
import { ACCEPTED_MIME, type MediaAsset } from "./media-types";

export { MEDIA_CATEGORIES, ACCEPTED_MIME } from "./media-types";
export type { MediaAsset, MediaCategory } from "./media-types";

/**
 * Editable content and the media library (spec §4).
 *
 * Content is an **overlay**, not a replacement. Every editable string has a
 * default in `src/content/site.ts`; a row here overrides it by key. That means
 * an empty database renders the site exactly as the code describes it, the
 * defaults stay reviewable in version control, and clearing an override is a
 * real "revert to default" rather than blanking the page.
 *
 * Every change writes a revision with the author, the time and the previous
 * value, so rollback is reading an old row rather than hoping for a backup.
 */

export interface ContentBlock {
  key: string;
  value: string;
  status: string;
  updated_at: string;
  updated_by: string | null;
}

export interface Revision {
  id: string;
  key: string;
  value: string;
  status: string;
  created_at: string;
  actor_name: string;
  summary: string | null;
}

/** Every override, as a map. Cheap enough to fetch whole — it is a few dozen rows. */
export async function contentOverrides(): Promise<Map<string, string>> {
  try {
    const db = await data();
    const rows = await db.query<{ key: string; value: string }>(
      "SELECT key, value FROM content_blocks WHERE status = 'approved'",
    );
    return new Map(rows.map((row) => [row.key, row.value]));
  } catch {
    // The site must render if the database is unreachable: fall back to the
    // coded defaults rather than failing the page.
    return new Map();
  }
}

export async function listContent(): Promise<ContentBlock[]> {
  const db = await data();
  return db.query<ContentBlock>(
    "SELECT * FROM content_blocks ORDER BY key",
  );
}

export async function revisionsFor(key: string): Promise<Revision[]> {
  const db = await data();
  return db.query<Revision>(
    "SELECT * FROM content_revisions WHERE key = ? ORDER BY created_at DESC LIMIT 25",
    [key],
  );
}

export async function setContent(
  user: SessionUser,
  key: string,
  value: string,
  summary?: string,
): Promise<void> {
  const db = await data();
  const now = new Date().toISOString();

  // The revision is written first, so a failure part-way leaves a recorded
  // intent rather than a silent change with no history.
  await db.batch([
    {
      sql: `INSERT INTO content_revisions (id, key, value, status, created_at, actor_id, actor_name, summary)
            VALUES (?, ?, ?, 'approved', ?, ?, ?, ?)`,
      params: [randomUUID(), key, value, now, user.id, user.name, summary ?? null],
    },
    {
      sql: `INSERT INTO content_blocks (key, value, status, updated_at, updated_by)
            VALUES (?, ?, 'approved', ?, ?)
            ON CONFLICT(key) DO UPDATE SET
              value = excluded.value,
              status = excluded.status,
              updated_at = excluded.updated_at,
              updated_by = excluded.updated_by`,
      params: [key, value, now, user.id],
    },
    {
      sql: `INSERT INTO audit_events (id, created_at, actor_id, actor_name, action, entity, entity_id, detail)
            VALUES (?, ?, ?, ?, 'content.update', 'content', ?, ?)`,
      params: [
        randomUUID(),
        now,
        user.id,
        user.name,
        key,
        JSON.stringify({ length: value.length }),
      ],
    },
  ]);
}

/** Removes the override so the coded default takes over again. */
export async function clearContent(
  user: SessionUser,
  key: string,
): Promise<void> {
  const db = await data();
  const now = new Date().toISOString();

  await db.batch([
    {
      sql: `INSERT INTO content_revisions (id, key, value, status, created_at, actor_id, actor_name, summary)
            VALUES (?, ?, '', 'cleared', ?, ?, ?, 'Reverted to the built-in default')`,
      params: [randomUUID(), key, now, user.id, user.name],
    },
    { sql: "DELETE FROM content_blocks WHERE key = ?", params: [key] },
  ]);
}

// ---------------------------------------------------------------------------
// Media library
// ---------------------------------------------------------------------------


export async function listMedia(options: {
  category?: string;
  includeArchived?: boolean;
} = {}): Promise<MediaAsset[]> {
  const db = await data();
  const where: string[] = [];
  const params: string[] = [];

  if (!options.includeArchived) where.push("archived = 0");
  if (options.category) {
    where.push("category = ?");
    params.push(options.category);
  }

  return db.query<MediaAsset>(
    `SELECT * FROM media_assets
      ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
      ORDER BY created_at DESC LIMIT 300`,
    params,
  );
}

export async function getMedia(id: string): Promise<MediaAsset | null> {
  const db = await data();
  return db.first<MediaAsset>("SELECT * FROM media_assets WHERE id = ?", [id]);
}

export class MediaError extends Error {}

export async function uploadMedia(
  user: SessionUser,
  input: {
    file: File;
    title: string;
    alt: string;
    caption?: string;
    kind: string;
    category: string;
  },
): Promise<MediaAsset> {
  const limit = ACCEPTED_MIME[input.file.type];
  if (!limit) {
    throw new MediaError(
      `${input.file.type || "That file type"} is not accepted. Use JPEG, PNG, WebP, AVIF, MP4, WebM or PDF.`,
    );
  }
  if (input.file.size > limit) {
    throw new MediaError(
      `That file is ${(input.file.size / 1024 / 1024).toFixed(1)} MB; the limit for ${input.file.type} is ${limit / 1024 / 1024} MB.`,
    );
  }

  // Alt text is required, not optional. An image published without it is an
  // accessibility failure, and the library is where that gets caught.
  const alt = input.alt.trim();
  if (!alt) {
    throw new MediaError("Describe the image for screen readers before uploading.");
  }

  const id = randomUUID();
  const extension = input.file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const storageKey = `media/${input.category}/${id}.${extension}`;
  const buffer = Buffer.from(await input.file.arrayBuffer());

  // R2 first: a database row pointing at an object that does not exist is
  // worse than an upload with no row, which is merely orphaned bytes.
  await putObject(storageKey, buffer, input.file.type);

  const db = await data();
  const now = new Date().toISOString();

  await db.execute(
    `INSERT INTO media_assets
       (id, storage_key, kind, category, title, alt, caption, mime, bytes, approved, created_at, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
    [
      id,
      storageKey,
      input.kind,
      input.category,
      input.title.trim() || input.file.name,
      alt,
      input.caption?.trim() || null,
      input.file.type,
      input.file.size,
      now,
      user.id,
    ],
  );

  const created = await getMedia(id);
  if (!created) throw new MediaError("The upload was not recorded.");
  return created;
}

export async function updateMedia(
  user: SessionUser,
  id: string,
  input: {
    title?: string;
    alt?: string;
    caption?: string;
    kind?: string;
    category?: string;
    approved?: boolean;
  },
): Promise<void> {
  const asset = await getMedia(id);
  if (!asset) throw new MediaError("That asset does not exist.");

  const db = await data();
  await db.batch([
    {
      sql: `UPDATE media_assets SET title = ?, alt = ?, caption = ?, kind = ?, category = ?, approved = ?
            WHERE id = ?`,
      params: [
        input.title?.trim() || asset.title,
        input.alt?.trim() || asset.alt,
        input.caption?.trim() ?? asset.caption,
        input.kind ?? asset.kind,
        input.category ?? asset.category,
        input.approved === undefined ? asset.approved : input.approved ? 1 : 0,
        id,
      ],
    },
    {
      sql: `INSERT INTO audit_events (id, created_at, actor_id, actor_name, action, entity, entity_id, detail)
            VALUES (?, ?, ?, ?, 'media.update', 'media', ?, ?)`,
      params: [
        randomUUID(),
        new Date().toISOString(),
        user.id,
        user.name,
        id,
        JSON.stringify(input),
      ],
    },
  ]);
}

/**
 * Archives an asset. The object stays in R2 and the row stays in the database:
 * spec §4 warns before deleting media used on a published page, and archiving
 * keeps that reversible. Permanent deletion is a separate, deliberate act.
 */
export async function archiveMedia(
  user: SessionUser,
  id: string,
): Promise<void> {
  const db = await data();
  await db.batch([
    { sql: "UPDATE media_assets SET archived = 1 WHERE id = ?", params: [id] },
    {
      sql: `INSERT INTO audit_events (id, created_at, actor_id, actor_name, action, entity, entity_id, detail)
            VALUES (?, ?, ?, ?, 'media.archive', 'media', ?, '{}')`,
      params: [randomUUID(), new Date().toISOString(), user.id, user.name, id],
    },
  ]);
}

export async function purgeMedia(
  user: SessionUser,
  id: string,
): Promise<void> {
  const asset = await getMedia(id);
  if (!asset) return;

  await deleteObject(asset.storage_key);

  const db = await data();
  await db.batch([
    { sql: "DELETE FROM media_assets WHERE id = ?", params: [id] },
    {
      sql: `INSERT INTO audit_events (id, created_at, actor_id, actor_name, action, entity, entity_id, detail)
            VALUES (?, ?, ?, ?, 'media.delete', 'media', ?, ?)`,
      params: [
        randomUUID(),
        new Date().toISOString(),
        user.id,
        user.name,
        id,
        JSON.stringify({ storageKey: asset.storage_key, title: asset.title }),
      ],
    },
  ]);
}
