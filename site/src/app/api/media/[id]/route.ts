import { getMedia } from "@/lib/cms";
import { getObject } from "@/lib/r2";

/**
 * Serves an uploaded asset.
 *
 * Media goes through the application rather than a public bucket URL so that
 * approval is enforced: an unapproved asset is visible to signed-in staff in
 * the library, but is not fetchable by the public site. Approved assets are
 * cached hard — the id is unique per upload, so the URL changes when the file
 * does and a stale cache is impossible.
 */
export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const asset = await getMedia(id);
  if (!asset || asset.archived === 1) {
    return new Response("Not found", { status: 404 });
  }

  const object = await getObject(asset.storage_key);
  if (!object) return new Response("Not found", { status: 404 });

  return new Response(object.body, {
    headers: {
      "Content-Type": object.contentType,
      "Content-Length": String(asset.bytes),
      "Cache-Control": asset.approved
        ? "public, max-age=31536000, immutable"
        : "private, no-store",
    },
  });
}
