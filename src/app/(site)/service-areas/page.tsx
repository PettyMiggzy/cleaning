import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { CTASection, PageHero } from "@/components/sections";
import { ServiceAreaMap } from "@/components/ServiceAreaMap";
import { SectionHeading } from "@/components/ui";
import { AREAS } from "@/lib/areas";

export const metadata: Metadata = {
  title: "Service Areas — Spring, The Woodlands, Klein & More",
  description:
    "Emili's Cleaning Co. serves Spring, Klein, The Woodlands, Tomball, Cypress, Humble, Kingwood and Conroe, TX with house cleaning, maid service, deep cleaning and move-out cleaning.",
  alternates: { canonical: "/service-areas" },
};

export default function ServiceAreasPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Service Areas", path: "/service-areas" }]}
        eyebrow="Where We Clean"
        title={
          <>
            Serving Spring &amp; the <span className="text-gradient italic">north Houston area</span>
          </>
        }
        lead="Based in Spring, Texas, our crews provide residential and commercial cleaning across eight nearby communities."
      />
      <section className="section bg-white">
        <div className="container-x grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:items-center">
          <ServiceAreaMap />
          <div>
            <h2 className="h2">Communities we serve</h2>
            <p className="lead mt-4">Tap a city to see the services, pricing and booking options available there.</p>
            <ul className="mt-8 space-y-3">
              {AREAS.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/service-areas/${a.slug}`}
                    className="silver-ring card card-hover group flex items-center justify-between gap-4 rounded-2xl px-5 py-4 shadow-soft"
                  >
                    <span className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-full bg-plum-100 text-plum-700">
                        <Icon name="mapPin" className="size-5" />
                      </span>
                      <span>
                        <span className="block font-serif text-xl font-semibold text-ink">{a.label}</span>
                        <span className="block text-xs text-muted">
                          {a.homeBase ? "Home base · " : ""}ZIPs {a.zips.slice(0, 4).join(", ")}
                          {a.zips.length > 4 ? "…" : ""}
                        </span>
                      </span>
                    </span>
                    <Icon name="arrowRight" className="size-5 text-plum-500 transition group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="section bg-lavender">
        <div className="container-x">
          <SectionHeading eyebrow="Interactive Map" title="Find us on Google Maps" />
          <div className="silver-frame mt-12 overflow-hidden rounded-[2rem]">
            <iframe
              title="Map of Spring, TX and surrounding service areas"
              src="https://maps.google.com/maps?q=Spring,+TX&z=10&output=embed"
              className="block h-[26rem] w-full rounded-[1.6rem] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="mt-4 text-center text-sm text-muted">
            Outside these areas? Call or text us — we may still be able to help.
          </p>
        </div>
      </section>
      <CTASection />
    </>
  );
}
