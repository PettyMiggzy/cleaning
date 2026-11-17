import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { CTASection, PageHero } from "@/components/sections";
import { ServiceAreaMap } from "@/components/ServiceAreaMap";
import { SectionHeading } from "@/components/ui";
import { AREAS } from "@/lib/areas";
import { isLang, pick } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/i18n/meta";

export async function generateMetadata({ params }: PageProps<"/[lang]/service-areas">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = pick(lang);
  return pageMetadata(lang, "/service-areas", {
    title: t("Service Areas — Spring, The Woodlands, Klein & More", "Zonas de servicio — Spring, The Woodlands, Klein y más"),
    description: t(
      "Emili's Cleaning Co. serves Spring, Klein, The Woodlands, Tomball, Cypress, Humble, Kingwood and Conroe, TX with house cleaning, maid service, deep cleaning and move-out cleaning.",
      "Emili's Cleaning Co. atiende Spring, Klein, The Woodlands, Tomball, Cypress, Humble, Kingwood y Conroe, TX con limpieza de casas, servicio de limpieza doméstica, limpieza profunda y limpieza de mudanza.",
    ),
  });
}

export default async function ServiceAreasPage() {
  const { t, href } = await getI18n();
  return (
    <>
      <PageHero
        crumbs={[{ name: t("Service Areas", "Zonas de servicio"), path: "/service-areas" }]}
        eyebrow={t("Where We Clean", "Dónde limpiamos")}
        title={t(
          <>
            Serving Spring &amp; the <span className="text-gradient italic">north Houston area</span>
          </>,
          <>
            Atendemos Spring y el <span className="text-gradient italic">área norte de Houston</span>
          </>,
        )}
        lead={t(
          "Based in Spring, Texas, our crews provide residential and commercial cleaning across eight nearby communities.",
          "Con base en Spring, Texas, nuestros equipos ofrecen limpieza residencial y comercial en ocho comunidades cercanas.",
        )}
      />
      <section className="section bg-white">
        <div className="container-x grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:items-center">
          <ServiceAreaMap />
          <div>
            <h2 className="h2">{t("Communities we serve", "Comunidades que atendemos")}</h2>
            <p className="lead mt-4">{t("Tap a city to see the services, pricing and booking options available there.", "Toque una ciudad para ver los servicios, precios y opciones de reservación disponibles ahí.")}</p>
            <ul className="mt-8 space-y-3">
              {AREAS.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={href(`/service-areas/${a.slug}`)}
                    className="silver-ring card card-hover group flex items-center justify-between gap-4 rounded-2xl px-5 py-4 shadow-soft"
                  >
                    <span className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-full bg-plum-100 text-plum-700">
                        <Icon name="mapPin" className="size-5" />
                      </span>
                      <span>
                        <span className="block font-serif text-xl font-semibold text-ink">{a.label}</span>
                        <span className="block text-xs text-muted">
                          {a.homeBase ? t("Home base · ", "Base principal · ") : ""}{t("ZIPs", "Códigos postales")} {a.zips.slice(0, 4).join(", ")}
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
          <SectionHeading eyebrow={t("Interactive Map", "Mapa interactivo")} title={t("Find us on Google Maps", "Encuéntrenos en Google Maps")} />
          <div className="silver-frame mt-12 overflow-hidden rounded-[2rem]">
            <iframe
              title={t("Map of Spring, TX and surrounding service areas", "Mapa de Spring, TX y las zonas de servicio cercanas")}
              src={`https://maps.google.com/maps?q=Spring,+TX&z=10&hl=${t("en", "es")}&output=embed`}
              className="block h-[26rem] w-full rounded-[1.6rem] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="mt-4 text-center text-sm text-muted">
            {t("Outside these areas? Call or text us — we may still be able to help.", "¿Fuera de estas zonas? Llámenos o envíenos un texto — quizás aún podamos ayudarle.")}
          </p>
        </div>
      </section>
      <CTASection />
    </>
  );
}
