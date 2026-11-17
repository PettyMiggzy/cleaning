import type { Metadata } from "next";
import Image from "next/image";
import { EstimateForm } from "@/components/forms/EstimateForm";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/sections";
import { Eyebrow } from "@/components/ui";
import { getFormServiceGroups } from "@/lib/form-services";
import { PHONE_LINES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Send Pictures for a Free Cleaning Estimate",
  description:
    "Not sure how many hours your cleaning will take? Send pictures of your rooms and Emili's Cleaning Co. will recommend a crew, estimate the time and price — free. Spring, TX.",
  alternates: { canonical: "/photo-estimate" },
};

export default async function PhotoEstimatePage() {
  const groups = await getFormServiceGroups();
  return (
    <>
      <PageHero
        crumbs={[{ name: "Send Pictures for an Estimate", path: "/photo-estimate" }]}
        eyebrow="Free Photo Estimates"
        title={
          <>
            Send Us Pictures &amp; Get a <span className="text-gradient italic">Free Cleaning Time Estimate!</span>
          </>
        }
        lead="Not sure how many hours your cleaning will take? Simply send us pictures of the rooms or areas you need cleaned."
        image="/images/send-photos-estimate.webp"
        imageAlt="Customer taking a photo of a kitchen with a smartphone for a cleaning estimate"
      />

      <section className="section bg-white">
        <div className="container-x grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
          <div>
            <EstimateForm groups={groups} />
          </div>
          <aside className="space-y-6 lg:sticky lg:top-32">
            <div className="silver-ring card bg-white p-7 shadow-soft">
              <Eyebrow>How It Works</Eyebrow>
              <p className="mt-4 text-ink-soft">
                Our team will review the photos, recommend the appropriate cleaning crew, estimate how long the job will take,
                and provide an estimated price before scheduling.
              </p>
              <ol className="mt-6 space-y-4">
                {["Upload photos of each area", "We review & recommend a crew", "You get a time & price estimate", "Approve and we schedule"].map(
                  (t, i) => (
                    <li key={t} className="flex items-center gap-3">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-plum-700 text-sm font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="font-semibold text-ink">{t}</span>
                    </li>
                  ),
                )}
              </ol>
            </div>

            <div className="bg-plum-luxe overflow-hidden rounded-[2rem] text-white shadow-lift">
              <div className="relative h-36">
                <Image src="/images/kitchen-cleaning.webp" alt="" fill sizes="400px" className="object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c0d2e] to-transparent" />
                <p className="absolute bottom-3 left-6 font-serif text-2xl text-white">Prefer to text?</p>
              </div>
              <div className="space-y-3 p-6 pt-3">
                <p className="text-plum-100">Text your pictures directly to either number:</p>
                {PHONE_LINES.map((p, i) => (
                  <a key={p.e164} href={p.sms} className="btn btn-light w-full justify-between !px-5">
                    <span className="text-left leading-tight">
                      <span className="block text-[0.65rem] tracking-[0.14em] text-muted uppercase">{i ? "Secondary" : "Primary"}</span>
                      {p.display}
                    </span>
                    <Icon name="message" className="size-5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-plum-200 bg-plum-50 p-5 text-sm leading-relaxed text-ink-soft">
              <p className="flex items-center gap-2 font-bold text-plum-800">
                <Icon name="clipboard" className="size-5" /> Good to know
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Completion times and pricing are estimates until reviewed and approved.</li>
                <li>A few wide photos per room is perfect — no need to tidy first.</li>
                <li>Photos are only used to prepare your estimate.</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
