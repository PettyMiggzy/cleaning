import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { PriceCalculator } from "@/components/PriceCalculator";
import { CTASection, PageHero, PricingCards } from "@/components/sections";
import { ServiceAreaMap } from "@/components/ServiceAreaMap";
import { Eyebrow, PhoneLines, PrimaryCtas, SectionHeading } from "@/components/ui";
import { AREAS, getArea } from "@/lib/areas";
import { getEnabledByCategory, getEnabledServices } from "@/lib/data";
import { serviceSchema } from "@/lib/schema";
import { SERVICE_PAGES } from "@/lib/service-pages";
import { SITE } from "@/lib/site";

// Unlisted slugs are 404s, so a blocking render is fine here.
export const instant = false;

export function generateStaticParams() {
  return AREAS.map((a) => ({ city: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/service-areas/[city]">): Promise<Metadata> {
  const { city } = await params;
  const area = getArea(city);
  if (!area) return {};
  const title = `House Cleaning & Maid Services in ${area.label}`;
  const description = `Professional house cleaning, maid service, deep cleaning, move-out and commercial cleaning in ${area.label}. 2–4 person crews from $100/hr for the whole crew. Call or text ${SITE.phones.primary.display}.`;
  return { title, description, alternates: { canonical: `/service-areas/${area.slug}` }, openGraph: { title, description } };
}

const AREA_IMAGES = [
  "/images/house-cleaner-arriving.webp",
  "/images/kitchen-cleaning.webp",
  "/images/cleaning-team-dusting.webp",
  "/images/bathroom-cleaning.webp",
  "/images/apartment-cleaning.webp",
  "/images/maid-service-bed-making.webp",
  "/images/deep-cleaning-baseboards.webp",
  "/images/emilis-cleaning-team.webp",
];

export default async function CityPage({ params }: PageProps<"/service-areas/[city]">) {
  const { city } = await params;
  const area = getArea(city);
  if (!area) notFound();
  const idx = AREAS.indexOf(area);

  const [groups, enabled] = await Promise.all([getEnabledByCategory(), getEnabledServices()]);
  const ids = new Set(enabled.map((s) => s.id));
  const major = SERVICE_PAGES.filter((p) => ids.has(p.serviceId));
  const nearby = AREAS.filter((a) => a.slug !== area.slug);

  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: `House Cleaning in ${area.label}`,
          description: area.intro,
          path: `/service-areas/${area.slug}`,
          areas: [area.label],
        })}
      />
      <PageHero
        crumbs={[
          { name: "Service Areas", path: "/service-areas" },
          { name: area.label, path: `/service-areas/${area.slug}` },
        ]}
        eyebrow={area.homeBase ? "Our Home Base" : `Serving ${area.county}`}
        title={
          <>
            House Cleaning &amp; Maid Services in <span className="text-gradient italic">{area.label}</span>
          </>
        }
        lead={<p>{area.intro}</p>}
        image={AREA_IMAGES[idx % AREA_IMAGES.length]}
        imageAlt={`Professional cleaner from Emili's Cleaning Co. serving ${area.label}`}
      >
        <PrimaryCtas />
      </PageHero>

      <section className="section bg-white">
        <div className="container-x grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <Eyebrow>Cleaning Services in {area.name}</Eyebrow>
            <h2 className="h2 mt-4">Services available in {area.label}</h2>
            <p className="lead mt-5">{area.detail}</p>
            {major.length > 0 && (
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {major.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/services/${p.slug}`}
                    className="silver-ring card card-hover group flex items-center justify-between gap-3 rounded-2xl px-5 py-4 shadow-soft"
                  >
                    <span>
                      <span className="block font-semibold text-ink">
                        {p.navLabel} in {area.name}
                      </span>
                      <span className="text-xs text-muted">{p.kicker}</span>
                    </span>
                    <Icon name="arrowRight" className="size-5 shrink-0 text-plum-500 transition group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            )}
            <div className="mt-10 space-y-6">
              {groups.map((g) => (
                <div key={g.category.id}>
                  <h3 className="font-serif text-xl">{g.category.name}</h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {g.services.slice(0, 10).map((s) => (
                      <li key={s.id}>
                        <Link
                          href={`/book?service=${s.id}`}
                          className="inline-flex rounded-full border border-silver-200 px-3 py-1.5 text-sm text-ink-soft transition hover:border-plum-300 hover:bg-plum-50 hover:text-plum-800"
                        >
                          {s.name}
                        </Link>
                      </li>
                    ))}
                    {g.services.length > 10 && (
                      <li>
                        <Link href={`/services#${g.category.id}`} className="inline-flex rounded-full bg-plum-100 px-3 py-1.5 text-sm font-semibold text-plum-800">
                          +{g.services.length - 10} more
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
            <div className="silver-ring card bg-white p-7 shadow-soft">
              <h3 className="font-serif text-xl">Areas & ZIP codes</h3>
              <p className="mt-3 text-sm text-muted">Communities we commonly serve around {area.name}:</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {area.communities.map((c) => (
                  <li key={c} className="chip">
                    {c}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm font-semibold text-ink">ZIP codes: {area.zips.join(" · ")}</p>
            </div>
            <PhoneLines compact />
          </aside>
        </div>
      </section>

      <section className="section bg-lavender">
        <div className="container-x">
          <SectionHeading
            eyebrow={`${area.name} Cleaning Prices`}
            title="Hourly rates for the whole crew"
            lead="2-hour minimum applies. Deep cleaning is 25–30% additional; move-in/move-out, commercial and specialty cleaning are custom estimates."
          />
          <div className="mt-14">
            <PricingCards compact />
          </div>
          <div className="mt-12">
            <PriceCalculator />
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow>Service Area Map</Eyebrow>
            <h2 className="h2 mt-4">{area.label} &amp; nearby</h2>
            <div className="mt-8">
              <ServiceAreaMap active={area.slug} />
            </div>
          </div>
          <div>
            <div className="silver-frame overflow-hidden rounded-[2rem]">
              <iframe
                title={`Map of ${area.label}`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(`${area.name}, TX`)}&z=12&output=embed`}
                className="block h-[22rem] w-full rounded-[1.6rem] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <h3 className="mt-8 font-serif text-xl">Nearby areas we serve</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {nearby.map((a) => (
                <li key={a.slug}>
                  <Link href={`/service-areas/${a.slug}`} className="chip hover:bg-plum-200">
                    <Icon name="mapPin" className="size-3.5" /> {a.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CTASection title={`Book your ${area.name} cleaning today`} />
    </>
  );
}
