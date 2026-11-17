import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { PriceCalculator } from "@/components/PriceCalculator";
import { AdditionalPricing, CTASection, FaqList, PageHero, PricingCards } from "@/components/sections";
import { Eyebrow, SectionHeading } from "@/components/ui";
import { FAQ_GROUPS } from "@/lib/faqs";
import { CREWS } from "@/lib/pricing";
import { faqSchema } from "@/lib/schema";
import { absoluteUrl, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cleaning Prices & Hourly Rates",
  description:
    "Transparent hourly cleaning rates in Spring, TX: 2 cleaners $100/hr, 3 cleaners $150/hr, 4 cleaners $200/hr for the whole crew. 2-hour minimum. Try our instant price calculator.",
  alternates: { canonical: "/pricing" },
};

const pricingFaqs = FAQ_GROUPS.find((g) => g.title === "Pricing")!.items;

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "OfferCatalog",
          name: `${SITE.name} hourly cleaning rates`,
          url: absoluteUrl("/pricing"),
          itemListElement: CREWS.map((c) => ({
            "@type": "Offer",
            name: c.title,
            price: c.rate,
            priceCurrency: "USD",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: c.rate,
              priceCurrency: "USD",
              unitCode: "HUR",
              referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "HUR" },
            },
            eligibleQuantity: { "@type": "QuantitativeValue", minValue: 2, unitCode: "HUR" },
          })),
        }}
      />
      <JsonLd data={faqSchema(pricingFaqs)} />
      <PageHero
        crumbs={[{ name: "Pricing", path: "/pricing" }]}
        eyebrow="Transparent Hourly Rates"
        title={
          <>
            Honest pricing, <span className="text-gradient italic">no surprises</span>
          </>
        }
        lead="Choose your crew size and hours. The hourly rate covers the entire crew — not each individual cleaner — and a 2-hour minimum applies to all bookings."
      />

      <section className="section bg-white">
        <div className="container-x">
          <PricingCards />
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
            {[
              ["users", "Whole-crew rate", "One hourly price covers every cleaner on your crew."],
              ["clock", "2-hour minimum", "Applies to all bookings, any crew size."],
              ["camera", "Free photo estimates", "Send pictures — we'll estimate time & price."],
            ].map(([icon, t, d]) => (
              <div key={t} className="reveal flex gap-3 rounded-2xl bg-plum-50/70 p-4">
                <Icon name={icon as "users"} className="mt-0.5 size-6 shrink-0 text-plum-700" />
                <span>
                  <span className="block font-bold text-ink">{t}</span>
                  <span className="text-sm text-muted">{d}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-lavender" id="calculator">
        <div className="container-x">
          <SectionHeading
            eyebrow="Price Calculator"
            title={
              <>
                Estimate your price <span className="text-gradient italic">in seconds</span>
              </>
            }
            lead="Pick your type of cleaning, crew size and hours to see your estimated price instantly."
          />
          <div className="mt-12 grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
            <PriceCalculator />
            <div className="space-y-6">
              <AdditionalPricing />
              <div className="silver-ring card bg-white p-6 shadow-soft">
                <h3 className="font-serif text-xl">Example estimates</h3>
                <ul className="mt-4 space-y-3 text-[0.97rem]">
                  <li className="flex justify-between gap-3 border-b border-silver-100 pb-3">
                    <span>2 cleaners × 3 hours</span>
                    <strong className="text-ink">$300</strong>
                  </li>
                  <li className="flex justify-between gap-3 border-b border-silver-100 pb-3">
                    <span>3 cleaners × 4 hours</span>
                    <strong className="text-ink">$600</strong>
                  </li>
                  <li className="flex justify-between gap-3 border-b border-silver-100 pb-3">
                    <span>4 cleaners × 2 hours (minimum)</span>
                    <strong className="text-ink">$400</strong>
                  </li>
                  <li className="flex justify-between gap-3">
                    <span>Deep clean · 2 cleaners × 4 hours</span>
                    <strong className="text-ink">$500 – $520</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>What Affects Time</Eyebrow>
            <h2 className="h2 mt-4">How long will my cleaning take?</h2>
            <p className="lead mt-5">Every space is different. Time depends on:</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "Size of the home or space",
                "Number of bedrooms & bathrooms",
                "Current condition & buildup",
                "Standard vs. deep cleaning",
                "Add-ons like ovens, fridges & cabinets",
                "Crew size (more cleaners = less time)",
              ].map((t) => (
                <li key={t} className="flex gap-2.5 rounded-2xl bg-plum-50/70 p-4 text-[0.97rem]">
                  <Icon name="sparkles" className="mt-0.5 size-5 shrink-0 text-plum-600" /> {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-[1.75rem] bg-plum-luxe p-7 text-white">
              <p className="font-serif text-2xl text-white">The easiest way to know? Send us pictures.</p>
              <p className="mt-2 text-plum-100">
                We&apos;ll recommend the right crew, estimate the time and give you an estimated price — free.
              </p>
              <Link href="/photo-estimate" className="btn btn-light mt-5">
                <Icon name="camera" className="size-5" /> Send Pictures for a Free Estimate
              </Link>
            </div>
          </div>
          <div>
            <Eyebrow>Pricing FAQ</Eyebrow>
            <h2 className="h2 mt-4">Common pricing questions</h2>
            <div className="mt-8">
              <FaqList items={pricingFaqs} />
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
