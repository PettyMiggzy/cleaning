import { Stars } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { AREA_NAMES } from "@/lib/areas";
import { store, type Review } from "@/lib/store";
import { saveReview } from "../../actions";
import { AdminHeader, Panel } from "../shared";
import { ReviewActions } from "./ReviewActions";

function ReviewFields({ r }: { r?: Review }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="id" value={r?.id ?? ""} />
      <div>
        <label className="field-label">Customer name</label>
        <input name="name" required defaultValue={r?.name} className="field" placeholder="e.g. Maria G." />
      </div>
      <div>
        <label className="field-label">Location</label>
        <input name="location" list="area-list" defaultValue={r?.location} className="field" placeholder="e.g. Spring, TX" />
      </div>
      <div>
        <label className="field-label">Rating</label>
        <select name="rating" defaultValue={r?.rating ?? 5} className="field">
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {"★".repeat(n)} ({n})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="field-label">Date</label>
        <input name="date" type="date" defaultValue={r?.date} className="field" />
      </div>
      <div>
        <label className="field-label">Source</label>
        <select name="source" defaultValue={r?.source ?? "Google"} className="field">
          {["Google", "Facebook", "Yelp", "Nextdoor", "Text message", "Website", "Direct"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="field-label">Service (optional)</label>
        <input name="service" defaultValue={r?.service} className="field" placeholder="e.g. Deep cleaning" />
      </div>
      <div className="sm:col-span-2">
        <label className="field-label">Review text</label>
        <textarea name="text" required defaultValue={r?.text} className="field" />
      </div>
      <label className="flex items-center gap-3 text-sm font-semibold text-ink sm:col-span-2">
        <input type="checkbox" name="published" defaultChecked={r ? r.published : true} className="size-5 accent-plum-700" />
        Show on website
      </label>
    </div>
  );
}

export default async function AdminReviews() {
  await requireAdmin();
  const reviews = ((await store().readDoc<Review[]>("reviews").catch(() => null)) ?? []).sort((a, b) =>
    Number(a.published) - Number(b.published) || b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <>
      <AdminHeader
        title="Reviews"
        subtitle="Add genuine testimonials from real customers (for example, copied from Google), and approve reviews submitted on the website."
      />
      <datalist id="area-list">
        {AREA_NAMES.map((a) => (
          <option key={a} value={`${a}, TX`} />
        ))}
      </datalist>
      <Panel>
        <details>
          <summary className="flex cursor-pointer items-center justify-between font-serif text-2xl">
            Add a review <span className="btn btn-primary btn-sm">+ New</span>
          </summary>
          <form action={saveReview} className="mt-6 space-y-5">
            <ReviewFields />
            <button className="btn btn-primary" type="submit">
              Save review
            </button>
          </form>
        </details>
      </Panel>

      <div className="mt-6 space-y-4">
        {reviews.length === 0 && <p className="rounded-3xl border border-dashed border-silver-300 bg-white p-8 text-center text-muted">No reviews yet.</p>}
        {reviews.map((r) => (
          <Panel key={r.id} className={r.published ? "" : "border-plum-300"}>
            <div className="flex flex-wrap items-center gap-3">
              <Stars rating={r.rating} />
              <strong className="text-ink">{r.name}</strong>
              <span className="text-sm text-muted">{[r.location, r.source, r.date].filter(Boolean).join(" · ")}</span>
              <span
                className={`ml-auto rounded-full px-2.5 py-1 text-xs font-bold ${
                  r.published ? "bg-emerald-100 text-emerald-800" : "bg-plum-600 text-white"
                }`}
              >
                {r.published ? "Published" : r.submittedOnline ? "Awaiting approval" : "Hidden"}
              </span>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-ink-soft">{r.text}</p>
            {(r.email || r.phone) && <p className="mt-2 text-xs text-muted">Private contact: {r.email || r.phone}</p>}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <ReviewActions id={r.id} published={r.published} />
              <details className="w-full">
                <summary className="cursor-pointer text-sm font-semibold text-plum-700">Edit</summary>
                <form action={saveReview} className="mt-4 space-y-4">
                  <ReviewFields r={r} />
                  <button className="btn btn-primary btn-sm" type="submit">
                    Save changes
                  </button>
                </form>
              </details>
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
