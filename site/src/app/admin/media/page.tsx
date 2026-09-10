import { requireUser } from "@/lib/guard";
import { listMedia } from "@/lib/cms";
import { r2Configured } from "@/lib/r2";
import { AssetCard, UploadPanel } from "./media-panels";

export const metadata = { title: "Media" };

export default async function MediaPage() {
  await requireUser("/admin/media");

  const configured = r2Configured();
  const assets = configured ? await listMedia() : [];

  const unapproved = assets.filter((asset) => !asset.approved).length;

  return (
    <div className="grid gap-5">
      <header>
        <h1 className="text-lg font-medium tracking-tight">Media</h1>
        <p className="mt-1 max-w-2xl text-[12px] text-[var(--ink-2)]">
          Images, video and documents for the public site. Files are stored in
          Cloudflare R2 and served through the application, so an unapproved
          asset stays visible to the team but is never fetchable by the public.
        </p>
      </header>

      {!configured ? (
        <div className="panel p-6">
          <p className="text-[13px]">Media storage is not configured.</p>
          <p className="mt-1 text-[12px] text-[var(--ink-3)]">
            Set R2_S3_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and
            R2_BUCKET, then reload.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[20rem_1fr]">
          <section className="panel h-fit p-5">
            <h2 className="mb-3 text-[13px] font-medium">Add a file</h2>
            <UploadPanel />
          </section>

          <section>
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-[13px] font-medium">
                Library
                <span className="ml-2 text-[11px] font-normal text-[var(--ink-3)]">
                  {assets.length} {assets.length === 1 ? "file" : "files"}
                  {unapproved ? ` · ${unapproved} awaiting approval` : ""}
                </span>
              </h2>
            </div>

            {assets.length === 0 ? (
              <p className="panel px-4 py-12 text-center text-[12px] text-[var(--ink-3)]">
                Nothing uploaded yet. The renders currently on the site are
                served from the build; anything added here can replace them.
              </p>
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {assets.map((asset) => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
