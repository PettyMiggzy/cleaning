import { BeforeAfter } from "@/components/BeforeAfter";
import { requireAdmin } from "@/lib/auth";
import { AREA_NAMES } from "@/lib/areas";
import { store, type GalleryItem } from "@/lib/store";
import { updateGalleryItem } from "../../actions";
import { AdminHeader, Panel } from "../shared";
import { GalleryDelete, GalleryUpload } from "./GalleryClient";

export default async function AdminGallery() {
  await requireAdmin();
  const items = (await store().readDoc<GalleryItem[]>("gallery").catch(() => null)) ?? [];
  return (
    <>
      <AdminHeader title="Before & After Gallery" subtitle="Upload photos from real completed jobs. Add a description, the service and the location." />
      <datalist id="area-list">
        {AREA_NAMES.map((a) => (
          <option key={a} value={`${a}, TX`} />
        ))}
      </datalist>
      <Panel>
        <h2 className="font-serif text-2xl">Upload a new before &amp; after</h2>
        <GalleryUpload />
      </Panel>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {items.map((g) => (
          <Panel key={g.id}>
            <BeforeAfter before={g.before} after={g.after} alt={g.title} />
            <form action={updateGalleryItem} className="mt-5 grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="id" value={g.id} />
              <div className="sm:col-span-2">
                <label className="field-label">Title</label>
                <input name="title" defaultValue={g.title} className="field" />
              </div>
              <div className="sm:col-span-2">
                <label className="field-label">
                  Title in Spanish <span className="font-normal text-muted">(optional)</span>
                </label>
                <input name="titleEs" defaultValue={g.titleEs ?? ""} className="field" />
              </div>
              <div>
                <label className="field-label">Service</label>
                <input name="service" defaultValue={g.service} className="field" />
              </div>
              <div>
                <label className="field-label">Location</label>
                <input name="location" list="area-list" defaultValue={g.location} className="field" />
              </div>
              <div className="sm:col-span-2">
                <label className="field-label">Description</label>
                <textarea name="description" defaultValue={g.description} className="field !min-h-20" />
              </div>
              <div className="sm:col-span-2">
                <label className="field-label">
                  Description in Spanish <span className="font-normal text-muted">(optional)</span>
                </label>
                <textarea name="descriptionEs" defaultValue={g.descriptionEs ?? ""} className="field !min-h-20" />
              </div>
              <label className="flex items-center gap-3 text-sm font-semibold text-ink">
                <input type="checkbox" name="published" defaultChecked={g.published} className="size-5 accent-plum-700" />
                Show on website
              </label>
              <div className="flex items-center justify-end gap-2">
                <GalleryDelete id={g.id} />
                <button className="btn btn-primary btn-sm" type="submit">
                  Save
                </button>
              </div>
            </form>
          </Panel>
        ))}
      </div>
      {items.length === 0 && (
        <p className="mt-6 rounded-3xl border border-dashed border-silver-300 bg-white p-8 text-center text-muted">
          No gallery photos yet. Upload your first before &amp; after above.
        </p>
      )}
    </>
  );
}
