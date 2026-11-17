import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { requireAdmin } from "@/lib/auth";
import { SITE } from "@/lib/site";
import { store } from "@/lib/store";
import { deleteSubmission, saveSubmissionNotes } from "../../../actions";
import { formatWhen, Panel, StatusBadge, TYPE_LABEL } from "../../shared";
import { StatusPicker } from "./StatusPicker";

export default async function RequestDetail({ params }: PageProps<"/admin/requests/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const s = await store().getSubmission(id).catch(() => null);
  if (!s) notFound();
  const digits = s.phone.replace(/\D/g, "").slice(-10);
  const first = s.name.split(" ")[0];
  const smsBody = encodeURIComponent(`Hi ${first}, this is Emili's Cleaning Co. Thank you for your request! `);

  return (
    <>
      <Link href="/admin/requests" className="mb-5 inline-flex items-center gap-1 text-sm font-semibold text-plum-700">
        <Icon name="chevronRight" className="size-4 rotate-180" /> All requests
      </Link>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold tracking-[0.15em] text-plum-700 uppercase">{TYPE_LABEL[s.type]}</p>
          <h1 className="mt-1 font-serif text-4xl">{s.name}</h1>
          <p className="mt-1 text-muted">
            Received {formatWhen(s.createdAt)} · Ref #{s.id.slice(-8).toUpperCase()}
          </p>
        </div>
        <StatusBadge status={s.status} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <Panel>
            <h2 className="font-serif text-2xl">Details</h2>
            <dl className="mt-4 divide-y divide-silver-100">
              {[["Phone", s.phone] as const, ["Email", s.email] as const, ...s.fields].map(([k, v]) =>
                v ? (
                  <div key={k} className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr]">
                    <dt className="text-sm font-semibold text-muted">{k}</dt>
                    <dd className="whitespace-pre-wrap text-ink">{v}</dd>
                  </div>
                ) : null,
              )}
            </dl>
          </Panel>

          {s.photos.length > 0 && (
            <Panel>
              <h2 className="font-serif text-2xl">Photos ({s.photos.length})</h2>
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {s.photos.map((k, i) => (
                  <li key={k}>
                    <a href={`/media/private/${k}`} target="_blank" rel="noopener" className="block aspect-square overflow-hidden rounded-2xl bg-silver-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/media/private/${k}`} alt={`Customer photo ${i + 1}`} className="size-full object-cover transition hover:scale-105" />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted">Tap a photo to open it full size.</p>
            </Panel>
          )}
        </div>

        <div className="space-y-6">
          <Panel>
            <h2 className="font-serif text-2xl">Contact {first}</h2>
            <div className="mt-4 grid gap-2">
              {digits.length === 10 && (
                <>
                  <a href={`tel:+1${digits}`} className="btn btn-primary">
                    <Icon name="phone" className="size-5" /> Call {s.phone}
                  </a>
                  <a href={`sms:+1${digits}?&body=${smsBody}`} className="btn btn-outline">
                    <Icon name="message" className="size-5" /> Text {first}
                  </a>
                </>
              )}
              {s.email && (
                <a
                  href={`mailto:${s.email}?subject=${encodeURIComponent(`Your ${SITE.name} request`)}`}
                  className="btn btn-outline"
                >
                  <Icon name="mail" className="size-5" /> Email
                </a>
              )}
            </div>
          </Panel>
          <Panel>
            <h2 className="font-serif text-2xl">Status</h2>
            <p className="mt-1 text-sm text-muted">Bookings are requests until you confirm them with the customer.</p>
            <div className="mt-4">
              <StatusPicker id={s.id} status={s.status} />
            </div>
          </Panel>
          <Panel>
            <h2 className="font-serif text-2xl">Private notes</h2>
            <form action={saveSubmissionNotes} className="mt-4 space-y-3">
              <input type="hidden" name="id" value={s.id} />
              <textarea name="notes" defaultValue={s.notes ?? ""} className="field" placeholder="Quote given, confirmed time, crew assigned…" />
              <button className="btn btn-outline btn-sm" type="submit">
                Save notes
              </button>
            </form>
          </Panel>
          <form action={deleteSubmission}>
            <input type="hidden" name="id" value={s.id} />
            <button type="submit" className="flex items-center gap-2 text-sm font-semibold text-rose-700 hover:underline">
              <Icon name="trash" className="size-4" /> Delete this request and its photos
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
