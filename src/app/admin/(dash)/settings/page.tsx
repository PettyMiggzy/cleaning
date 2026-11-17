import { requireAdmin } from "@/lib/auth";
import { emailConfigured, notifyAddress } from "@/lib/notify";
import { SITE } from "@/lib/site";
import { store, type SiteSettings } from "@/lib/store";
import { saveSettings } from "../../actions";
import { AdminHeader, Panel } from "../shared";

const FIELDS: { name: keyof SiteSettings["social"] | "googleReviewUrl"; label: string; placeholder: string }[] = [
  { name: "google", label: "Google Business Profile", placeholder: "https://g.page/…" },
  { name: "googleReviewUrl", label: "Google “Leave a review” link", placeholder: "https://g.page/r/…/review" },
  { name: "facebook", label: "Facebook", placeholder: "https://facebook.com/…" },
  { name: "instagram", label: "Instagram", placeholder: "https://instagram.com/…" },
  { name: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@…" },
  { name: "yelp", label: "Yelp", placeholder: "https://yelp.com/biz/…" },
  { name: "nextdoor", label: "Nextdoor", placeholder: "https://nextdoor.com/…" },
];

export default async function AdminSettings() {
  await requireAdmin();
  const s = (await store().readDoc<SiteSettings>("settings").catch(() => null)) ?? { social: {} };
  const value = (n: string) => (n === "googleReviewUrl" ? s.googleReviewUrl : s.social?.[n as keyof SiteSettings["social"]]) ?? "";

  return (
    <>
      <AdminHeader title="Settings" subtitle="Social media links appear in the footer and on the Contact page once added." />
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Panel>
          <h2 className="font-serif text-2xl">Social media &amp; Google</h2>
          <form action={saveSettings} className="mt-5 grid gap-4">
            {FIELDS.map((f) => (
              <div key={f.name}>
                <label className="field-label" htmlFor={f.name}>
                  {f.label}
                </label>
                <input id={f.name} name={f.name} defaultValue={value(f.name)} placeholder={f.placeholder} className="field" inputMode="url" />
              </div>
            ))}
            <div>
              <button className="btn btn-primary" type="submit">
                Save settings
              </button>
            </div>
          </form>
        </Panel>
        <Panel>
          <h2 className="font-serif text-2xl">Business information</h2>
          <p className="mt-1 text-sm text-muted">Shown consistently across the website and in Google structured data.</p>
          <dl className="mt-4 space-y-3 text-sm">
            {[
              ["Name", SITE.name],
              ["Primary phone", SITE.phones.primary.display],
              ["Secondary phone", SITE.phones.secondary.display],
              ["Email", SITE.email],
              ["Location", `${SITE.city}, ${SITE.state}`],
              ["Website", SITE.url],
              ["Notifications", emailConfigured() ? `Emails go to ${notifyAddress()}` : "Email not configured"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="font-semibold text-muted">{k}</dt>
                <dd className="break-all text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-xs text-muted">To change business details, update src/lib/site.ts in the website code.</p>
        </Panel>
      </div>
    </>
  );
}
