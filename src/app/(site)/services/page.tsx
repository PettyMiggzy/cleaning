import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { CTASection, PageHero } from "@/components/sections";
import { ServicesExplorer } from "@/components/ServicesExplorer";
import { PrimaryCtas, SectionHeading } from "@/components/ui";
import { getEnabledByCategory, getEnabledServices } from "@/lib/data";
import { SERVICE_PAGES } from "@/lib/service-pages";

export const metadata: Metadata = {
  title: "All Cleaning Services",
  description:
    "Browse every cleaning service from Emili's Cleaning Co. — residential, deep cleaning, move-in/move-out, commercial, kitchen, bathroom and interior cleaning in Spring, TX and nearby.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const [groups, enabled] = await Promise.all([getEnabledByCategory(), getEnabledServices()]);
  const ids = new Set(enabled.map((s) => s.id));
  const major = SERVICE_PAGES.filter((p) => ids.has(p.serviceId));

  return (
    <>
      <PageHero
        crumbs={[{ name: "Services", path: "/services" }]}
        eyebrow="Complete Cleaning Services"
        title={
          <>
            Every clean you need, <span className="text-gradient italic">all in one place</span>
          </>
        }
        lead="Residential, deep cleaning, move-in and move-out, commercial, kitchen, bathroom and interior cleaning — organized so you can quickly find exactly what you need."
      >
        <div className="flex justify-center">
          <PrimaryCtas />
        </div>
      </PageHero>

      {major.length > 0 && (
        <section className="section !pb-6 bg-white">
          <div className="container-x">
            <SectionHeading eyebrow="Most Requested" title="Our signature services" />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {major.map((p) => (
                <Link
                  key={p.slug}
                  href={`/services/${p.slug}`}
                  className="silver-ring card card-hover reveal group flex items-center gap-4 bg-white p-3 pr-5 shadow-soft"
                >
                  <span className="relative size-20 shrink-0 overflow-hidden rounded-2xl">
                    <Image src={p.image} alt="" fill sizes="80px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-serif text-lg font-semibold text-ink">{p.navLabel}</span>
                    <span className="block text-xs text-muted">{p.kicker}</span>
                  </span>
                  <Icon name="chevronRight" className="size-5 text-plum-400 transition group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section bg-white">
        <div className="container-x">
          <SectionHeading
            eyebrow="Browse by Category"
            title="Find your service"
            lead="Pick a category or search. Every service can be booked online or quoted from your photos."
          />
          <div className="mt-10">
            <ServicesExplorer
              groups={groups.map((g) => ({
                id: g.category.id,
                name: g.category.name,
                tagline: g.category.tagline,
                description: g.category.description,
                image: g.category.image,
                pricing: g.category.pricing,
                services: g.services.map((s) => ({ id: s.id, name: s.name, description: s.description })),
              }))}
            />
          </div>
        </div>
      </section>

      <CTASection title="Not sure which service you need?" lead="Send us pictures and we'll recommend the right service, crew size and time — free." />
    </>
  );
}
