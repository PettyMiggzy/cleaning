import Link from "next/link";
import { Icon, type IconName } from "@/components/Icon";
import { requireAdmin } from "@/lib/auth";
import { resolveServices } from "@/lib/data";
import { emailConfigured, notifyAddress } from "@/lib/notify";
import { store, type Review, type ServiceSettings } from "@/lib/store";
import { AdminHeader, fieldValue, formatWhen, Panel, StatusBadge, TypeBadge } from "./shared";

export default async function AdminHome() {
  await requireAdmin();
  const s = store();
  const [subs, reviews, services] = await Promise.all([
    s.listSubmissions().catch(() => []),
    s.readDoc<Review[]>("reviews").then((r) => r ?? []).catch(() => []),
    s.readDoc<ServiceSettings>("services").catch(() => null),
  ]);
  const resolved = resolveServices({ overrides: services?.overrides ?? {}, custom: services?.custom ?? [] });
  const newSubs = subs.filter((x) => x.status === "new");
  const pendingReviews = reviews.filter((r) => !r.published);

  const stats: { label: string; value: number; icon: IconName; href: string }[] = [
    { label: "New requests", value: newSubs.length, icon: "inbox", href: "/admin/requests?status=new" },
    { label: "Booking requests", value: subs.filter((x) => x.type === "booking").length, icon: "calendar", href: "/admin/requests?type=booking" },
    { label: "Photo estimates", value: subs.filter((x) => x.type === "estimate").length, icon: "camera", href: "/admin/requests?type=estimate" },
    { label: "Reviews awaiting approval", value: pendingReviews.length, icon: "star", href: "/admin/reviews" },
  ];

  return (
    <>
      <AdminHeader title="Dashboard" subtitle="Welcome back, Emili ✨" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((st) => (
          <Link key={st.label} href={st.href} className="rounded-3xl border border-silver-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
            <span className="grid size-11 place-items-center rounded-2xl bg-plum-100 text-plum-700">
              <Icon name={st.icon} />
            </span>
            <p className="mt-4 font-serif text-4xl font-semibold text-ink">{st.value}</p>
            <p className="text-sm font-semibold text-muted">{st.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Panel>
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl">Latest requests</h2>
            <Link href="/admin/requests" className="text-sm font-bold text-plum-700">
              View all →
            </Link>
          </div>
          {subs.length === 0 ? (
            <p className="mt-6 text-muted">No requests yet. New bookings, photo estimates and messages will appear here.</p>
          ) : (
            <ul className="mt-5 divide-y divide-silver-100">
              {subs.slice(0, 8).map((x) => (
                <li key={x.id}>
                  <Link href={`/admin/requests/${x.id}`} className="flex flex-wrap items-center gap-3 py-3.5 hover:text-plum-700">
                    <TypeBadge type={x.type} />
                    <span className="font-semibold text-ink">{x.name}</span>
                    <span className="text-sm text-muted">{fieldValue(x, "Cleaning Service") || fieldValue(x, "Topic")}</span>
                    <span className="ml-auto flex items-center gap-3">
                      <span className="text-xs text-muted">{formatWhen(x.createdAt)}</span>
                      <StatusBadge status={x.status} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <div className="space-y-6">
          <Panel>
            <h2 className="font-serif text-2xl">Website status</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Icon name={emailConfigured() ? "checkCircle" : "x"} className={`mt-0.5 size-5 shrink-0 ${emailConfigured() ? "text-emerald-600" : "text-rose-600"}`} />
                <span>
                  <strong className="text-ink">Email notifications</strong>
                  <br />
                  {emailConfigured() ? `Sending to ${notifyAddress()}` : "Not configured — requests are saved here only. See README to connect Gmail."}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="checkCircle" className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                <span>
                  <strong className="text-ink">Storage</strong>
                  <br />
                  {s.kind}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="sparkles" className="mt-0.5 size-5 shrink-0 text-plum-600" />
                <span>
                  <strong className="text-ink">Services</strong>
                  <br />
                  {resolved.filter((x) => x.enabled).length} of {resolved.length} enabled
                </span>
              </li>
            </ul>
          </Panel>
          <Panel>
            <h2 className="font-serif text-2xl">Quick actions</h2>
            <div className="mt-4 grid gap-2">
              <Link href="/admin/gallery" className="btn btn-outline btn-sm justify-start">
                <Icon name="imagePlus" className="size-4" /> Upload before &amp; after photos
              </Link>
              <Link href="/admin/reviews" className="btn btn-outline btn-sm justify-start">
                <Icon name="star" className="size-4" /> Add a customer review
              </Link>
              <Link href="/admin/services" className="btn btn-outline btn-sm justify-start">
                <Icon name="sparkles" className="size-4" /> Turn services on or off
              </Link>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
