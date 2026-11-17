import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { CTASection, FaqList, PageHero, PricingCards } from "@/components/sections";
import { CheckList, Eyebrow, PhoneLines, PrimaryCtas, SectionHeading } from "@/components/ui";
import { AREAS } from "@/lib/areas";
import { getEnabledServices, isServiceEnabled } from "@/lib/data";
import { faqSchema, serviceSchema } from "@/lib/schema";
import { getServicePage, SERVICE_PAGES } from "@/lib/service-pages";
import { getCategory } from "@/lib/services-catalog";

// Unlisted slugs are 404s, so a blocking render is fine here.
export const instant = false;

export function generateStaticParams() {
  return SERVICE_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) return {};
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `/services/${page.slug}` },
    openGraph: { title: page.metaTitle, description: page.metaDescription, images: [{ url: page.image }] },
  };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page || !(await isServiceEnabled(page.serviceId))) notFound();

  const enabled = await getEnabledServices();
  const related = page.relatedCategories.map((c) => ({
    category: getCategory(c),
    services: enabled.filter((s) => s.categories.includes(c)).slice(0, 12),
  }));
  const others = SERVICE_PAGES.filter((p) => p.slug !== page.slug && enabled.some((s) => s.id === p.serviceId));

  return (
    <>
      <JsonLd data={serviceSchema({ name: page.navLabel, description: page.metaDescription, path: `/services/${page.slug}` })} />
      <JsonLd data={faqSchema(page.faqs)} />
      <PageHero
        crumbs={[
          { name: "Services", path: "/services" },
          { name: page.navLabel, path: `/services/${page.slug}` },
        ]}
        eyebrow={page.kicker}
        title={page.h1}
        lead={<p>{page.intro[0]}</p>}
        image={page.image}
        imageAlt={page.imageAlt}
      >
        <PrimaryCtas />
      </PageHero>

      <section className="section bg-white">
        <div className="container-x grid gap-14 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <Eyebrow>What&apos;s Included</Eyebrow>
            <h2 className="h2 mt-4">Your {page.navLabel.toLowerCase()} checklist</h2>
            {page.intro.slice(1).map((p) => (
              <p key={p.slice(0, 20)} className="lead mt-5">
                {p}
              </p>
            ))}
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {page.included.map((block) => (
                <div key={block.title} className="silver-ring card reveal bg-white p-6 shadow-soft">
                  <h3 className="flex items-center gap-2 font-serif text-xl">
                    <Icon name="sparkles" className="size-5 text-plum-500" /> {block.title}
                  </h3>
                  <CheckList items={block.items} className="mt-4 text-[0.97rem]" />
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted">
              Every home is different — tell us your priorities in your special instructions and we&apos;ll focus on what matters
              most to you.
            </p>
          </div>
          <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
            <div className="bg-plum-luxe rounded-[2rem] p-7 text-white shadow-lift">
              <p className="text-xs font-bold tracking-[0.2em] text-plum-200 uppercase">Pricing</p>
              <p className="mt-3 font-serif text-3xl text-white">
                {page.pricingMode === "custom"
                  ? "Custom estimate"
                  : page.pricingMode === "deep"
                    ? "Hourly rate + 25–30%"
                    : "From $100/hr for the crew"}
              </p>
              <p className="mt-3 text-plum-100">{page.pricingNote}</p>
              <div className="mt-6 grid gap-3">
                <Link href={`/book?service=${page.serviceId}`} className="btn btn-light w-full">
                  <Icon name="calendar" className="size-5" /> Book {page.navLabel}
                </Link>
                <Link href="/photo-estimate" className="btn btn-ghost-light w-full">
                  <Icon name="camera" className="size-5" /> Free Photo Estimate
                </Link>
              </div>
            </div>
            <div className="silver-ring card bg-white p-7 shadow-soft">
              <h3 className="font-serif text-xl">Perfect for</h3>
              <CheckList items={page.idealFor} className="mt-4 text-[0.97rem]" />
            </div>
            <PhoneLines compact />
          </aside>
        </div>
      </section>

      <section className="section bg-lavender">
        <div className="container-x">
          <SectionHeading
            eyebrow="Hourly Crew Rates"
            title="Transparent pricing"
            lead={
              page.pricingMode === "custom"
                ? `${page.navLabel} is quoted as a custom estimate. Our standard hourly crew rates are shown for reference.`
                : page.pricingMode === "deep"
                  ? "Deep cleaning is 25–30% additional to the hourly crew rates below. 2-hour minimum."
                  : "The hourly rate covers the entire crew. 2-hour minimum applies to all bookings."
            }
          />
          <div className="mt-14">
            <PricingCards compact />
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x">
          <SectionHeading eyebrow="Related Services" title="Add-ons & related cleaning" />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {related
              .filter((r) => r.services.length)
              .map((r) => (
                <div key={r.category.id} className="silver-ring card reveal overflow-hidden bg-white shadow-soft" style={{ borderRadius: "1.75rem" }}>
                  <div className="relative h-40">
                    <Image src={r.category.image} alt="" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-plum-950/75 to-transparent" />
                    <h3 className="absolute bottom-4 left-6 font-serif text-2xl text-white">{r.category.name}</h3>
                  </div>
                  <ul className="flex flex-wrap gap-2 p-6">
                    {r.services.map((s) => (
                      <li key={s.id}>
                        <Link
                          href={`/book?service=${s.id}`}
                          className="inline-flex min-h-10 items-center rounded-full border border-silver-200 px-4 text-sm font-semibold text-ink-soft transition hover:border-plum-300 hover:bg-plum-50 hover:text-plum-800"
                        >
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="px-6 pb-6">
                    <Link href={`/services#${r.category.id}`} className="inline-flex min-h-10 items-center gap-2 font-bold text-plum-700">
                      View all {r.category.shortName.toLowerCase()} services <Icon name="arrowRight" className="size-4" />
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      <section className="section bg-lavender">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>Questions</Eyebrow>
            <h2 className="h2 mt-4">{page.navLabel} FAQ</h2>
            <div className="mt-8">
              <FaqList items={page.faqs} />
            </div>
            <Link href="/faq" className="mt-6 inline-flex min-h-10 items-center gap-2 font-bold text-plum-700">
              More questions & answers <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
          <div>
            <Eyebrow>Where We Clean</Eyebrow>
            <h2 className="h2 mt-4">{page.navLabel} near you</h2>
            <ul className="mt-8 grid grid-cols-2 gap-3">
              {AREAS.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/service-areas/${a.slug}`}
                    className="silver-ring card flex items-center gap-2 rounded-2xl px-4 py-3.5 font-semibold text-ink shadow-soft hover:text-plum-700"
                  >
                    <Icon name="mapPin" className="size-4 text-plum-600" /> {a.label}
                  </Link>
                </li>
              ))}
            </ul>
            {others.length > 0 && (
              <>
                <h3 className="mt-10 font-serif text-xl">Other popular services</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {others.map((o) => (
                    <Link key={o.slug} href={`/services/${o.slug}`} className="chip hover:bg-plum-200">
                      {o.navLabel}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <CTASection title={`Ready to book ${page.navLabel.toLowerCase()}?`} />
    </>
  );
}
