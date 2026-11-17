import Link from "next/link";
import { Icon } from "@/components/Icon";
import { requireAdmin } from "@/lib/auth";
import { store, type SubmissionStatus, type SubmissionType } from "@/lib/store";
import { AdminHeader, fieldValue, formatWhen, StatusBadge, TYPE_LABEL, TypeBadge } from "../shared";

const TYPES: SubmissionType[] = ["booking", "estimate", "contact"];
const STATUSES: SubmissionStatus[] = ["new", "contacted", "scheduled", "completed", "declined"];

export default async function RequestsPage({ searchParams }: PageProps<"/admin/requests">) {
  await requireAdmin();
  const sp = await searchParams;
  const type = TYPES.find((t) => t === sp.type);
  const status = STATUSES.find((t) => t === sp.status);
  const all = await store().listSubmissions().catch(() => []);
  const list = all.filter((s) => (!type || s.type === type) && (!status || s.status === status));

  const href = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const next = { type, status, ...patch };
    for (const [k, v] of Object.entries(next)) if (v) p.set(k, v);
    const q = p.toString();
    return `/admin/requests${q ? `?${q}` : ""}`;
  };

  return (
    <>
      <AdminHeader title="Requests" subtitle="Booking requests, photo estimates and contact messages from the website." />
      <div className="mb-4 flex flex-wrap gap-2">
        <FilterChip href={href({ type: undefined })} active={!type}>
          All types
        </FilterChip>
        {TYPES.map((t) => (
          <FilterChip key={t} href={href({ type: t })} active={type === t}>
            {TYPE_LABEL[t]}s ({all.filter((s) => s.type === t).length})
          </FilterChip>
        ))}
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        <FilterChip href={href({ status: undefined })} active={!status} small>
          Any status
        </FilterChip>
        {STATUSES.map((s) => (
          <FilterChip key={s} href={href({ status: s })} active={status === s} small>
            <span className="capitalize">{s}</span> ({all.filter((x) => x.status === s).length})
          </FilterChip>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-silver-300 bg-white p-10 text-center text-muted">
          <Icon name="inbox" className="mx-auto size-10 text-plum-300" />
          <p className="mt-3">No requests match these filters.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {list.map((s) => (
            <li key={s.id}>
              <Link
                href={`/admin/requests/${s.id}`}
                className={`block rounded-3xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft ${
                  s.status === "new" ? "border-plum-300" : "border-silver-200"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <TypeBadge type={s.type} />
                  <StatusBadge status={s.status} />
                  {s.photos.length > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-silver-100 px-2.5 py-1 text-xs font-bold text-ink">
                      <Icon name="camera" className="size-3.5" /> {s.photos.length}
                    </span>
                  )}
                  <span className="ml-auto text-xs text-muted">{formatWhen(s.createdAt)}</span>
                </div>
                <p className="mt-3 text-lg font-bold text-ink">{s.name}</p>
                <p className="text-sm text-muted">
                  {[s.phone, fieldValue(s, "Cleaning Service") || fieldValue(s, "Topic"), fieldValue(s, "City"), fieldValue(s, "Preferred Date")]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function FilterChip({ href, active, children, small }: { href: string; active: boolean; children: React.ReactNode; small?: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full font-semibold transition ${small ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"} ${
        active ? "bg-plum-700 text-white" : "border border-silver-200 bg-white text-ink hover:border-plum-300"
      }`}
    >
      {children}
    </Link>
  );
}
