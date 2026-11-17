import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { PriceCalculator } from "@/components/PriceCalculator";
import { AdditionalPricing, CTASection, FaqList, PageHero, PricingCards } from "@/components/sections";
import { Eyebrow, SectionHeading } from "@/components/ui";
import { CREWS } from "@/lib/pricing";
import { faqSchema } from "@/lib/schema";
import { absoluteUrl, SITE } from "@/lib/site";
import { faqGroups } from "@/i18n/content";
import { isLang, pick } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/i18n/meta";

export async function generateMetadata({ params }: PageProps<"/[lang]/pricing">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = pick(lang);
  return pageMetadata(lang, "/pricing", {
    title: t("Cleaning Prices & Hourly Rates", "Precios y tarifas por hora de limpieza"),
    description: t(
      "Transparent hourly cleaning rates in Spring, TX: 2 cleaners $100/hr, 3 cleaners $150/hr, 4 cleaners $200/hr for the whole crew. 2-hour minimum. Try our instant price calculator.",
      "Tarifas por hora transparentes en Spring, TX: 2 profesionales $100/hr, 3 profesionales $150/hr, 4 profesionales $200/hr para todo el equipo. Mínimo de 2 horas. Pruebe nuestra calculadora de precio.",
    ),
  });
}

export default async function PricingPage() {
  const { lang, t, href } = await getI18n();
  // The first FAQ group is "Pricing" in every language.
  const pricingFaqs = faqGroups(lang)[0].items;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "OfferCatalog",
          name: t(`${SITE.name} hourly cleaning rates`, `Tarifas por hora de limpieza de ${SITE.name}`),
          url: absoluteUrl(href("/pricing")),
          itemListElement: CREWS.map((c) => ({
            "@type": "Offer",
            name: t(c.title, c.titleEs),
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
        crumbs={[{ name: t("Pricing", "Precios"), path: "/pricing" }]}
        eyebrow={t("Transparent Hourly Rates", "Tarifas por hora transparentes")}
        title={t(
          <>
            Honest pricing, <span className="text-gradient italic">no surprises</span>
          </>,
          <>
            Precios honestos, <span className="text-gradient italic">sin sorpresas</span>
          </>,
        )}
        lead={t(
          "Choose your crew size and hours. The hourly rate covers the entire crew — not each individual cleaner — and a 2-hour minimum applies to all bookings.",
          "Elija el tamaño del equipo y las horas. La tarifa por hora cubre a todo el equipo — no a cada profesional por separado — y todas las reservaciones tienen un mínimo de 2 horas.",
        )}
      />

      <section className="section bg-white">
        <div className="container-x">
          <PricingCards />
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
            {[
              ["users", t("Whole-crew rate", "Tarifa para todo el equipo"), t("One hourly price covers every cleaner on your crew.", "Un solo precio por hora cubre a todos los profesionales de su equipo.")],
              ["clock", t("2-hour minimum", "Mínimo de 2 horas"), t("Applies to all bookings, any crew size.", "Aplica a todas las reservaciones, sin importar el tamaño del equipo.")],
              ["camera", t("Free photo estimates", "Estimados gratis con fotos"), t("Send pictures — we'll estimate time & price.", "Envíe fotos — estimaremos el tiempo y el precio.")],
            ].map(([icon, ttl, d]) => (
              <div key={ttl} className="reveal flex gap-3 rounded-2xl bg-plum-50/70 p-4">
                <Icon name={icon as "users"} className="mt-0.5 size-6 shrink-0 text-plum-700" />
                <span>
                  <span className="block font-bold text-ink">{ttl}</span>
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
            eyebrow={t("Price Calculator", "Calculadora de precio")}
            title={t(
              <>
                Estimate your price <span className="text-gradient italic">in seconds</span>
              </>,
              <>
                Calcule su precio <span className="text-gradient italic">en segundos</span>
              </>,
            )}
            lead={t(
              "Pick your type of cleaning, crew size and hours to see your estimated price instantly.",
              "Elija el tipo de limpieza, el tamaño del equipo y las horas para ver su precio estimado al instante.",
            )}
          />
          <div className="mt-12 grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
            <PriceCalculator />
            <div className="space-y-6">
              <AdditionalPricing />
              <div className="silver-ring card bg-white p-6 shadow-soft">
                <h3 className="font-serif text-xl">{t("Example estimates", "Ejemplos de estimados")}</h3>
                <ul className="mt-4 space-y-3 text-[0.97rem]">
                  <li className="flex justify-between gap-3 border-b border-silver-100 pb-3">
                    <span>{t("2 cleaners × 3 hours", "2 profesionales × 3 horas")}</span>
                    <strong className="text-ink">$300</strong>
                  </li>
                  <li className="flex justify-between gap-3 border-b border-silver-100 pb-3">
                    <span>{t("3 cleaners × 4 hours", "3 profesionales × 4 horas")}</span>
                    <strong className="text-ink">$600</strong>
                  </li>
                  <li className="flex justify-between gap-3 border-b border-silver-100 pb-3">
                    <span>{t("4 cleaners × 2 hours (minimum)", "4 profesionales × 2 horas (mínimo)")}</span>
                    <strong className="text-ink">$400</strong>
                  </li>
                  <li className="flex justify-between gap-3">
                    <span>{t("Deep clean · 2 cleaners × 4 hours", "Limpieza profunda · 2 profesionales × 4 horas")}</span>
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
            <Eyebrow>{t("What Affects Time", "Qué afecta el tiempo")}</Eyebrow>
            <h2 className="h2 mt-4">{t("How long will my cleaning take?", "¿Cuánto tardará mi limpieza?")}</h2>
            <p className="lead mt-5">{t("Every space is different. Time depends on:", "Cada espacio es diferente. El tiempo depende de:")}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {t(
                [
                  "Size of the home or space",
                  "Number of bedrooms & bathrooms",
                  "Current condition & buildup",
                  "Standard vs. deep cleaning",
                  "Add-ons like ovens, fridges & cabinets",
                  "Crew size (more cleaners = less time)",
                ],
                [
                  "Tamaño de la casa o del espacio",
                  "Número de recámaras y baños",
                  "Estado actual y suciedad acumulada",
                  "Limpieza estándar o profunda",
                  "Extras como hornos, refrigeradores y gabinetes",
                  "Tamaño del equipo (más profesionales = menos tiempo)",
                ],
              ).map((item) => (
                <li key={item} className="flex gap-2.5 rounded-2xl bg-plum-50/70 p-4 text-[0.97rem]">
                  <Icon name="sparkles" className="mt-0.5 size-5 shrink-0 text-plum-600" /> {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-[1.75rem] bg-plum-luxe p-7 text-white">
              <p className="font-serif text-2xl text-white">{t("The easiest way to know? Send us pictures.", "¿La forma más fácil de saberlo? Envíenos fotos.")}</p>
              <p className="mt-2 text-plum-100">
                {t(
                  "We'll recommend the right crew, estimate the time and give you an estimated price — free.",
                  "Le recomendaremos el equipo adecuado, calcularemos el tiempo y le daremos un precio estimado — gratis.",
                )}
              </p>
              <Link href={href("/photo-estimate")} className="btn btn-light mt-5">
                <Icon name="camera" className="size-5" /> {t("Send Pictures for a Free Estimate", "Envíe fotos para un estimado gratis")}
              </Link>
            </div>
          </div>
          <div>
            <Eyebrow>{t("Pricing FAQ", "Preguntas sobre precios")}</Eyebrow>
            <h2 className="h2 mt-4">{t("Common pricing questions", "Preguntas frecuentes sobre precios")}</h2>
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
