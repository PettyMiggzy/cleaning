import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { CTASection, PageHero } from "@/components/sections";
import { ServicesExplorer } from "@/components/ServicesExplorer";
import { PrimaryCtas, SectionHeading } from "@/components/ui";
import { getEnabledByCategory, getEnabledServices } from "@/lib/data";
import { SERVICE_PAGES } from "@/lib/service-pages";
import { category, servicePage, serviceText } from "@/i18n/content";
import { isLang, pick } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/i18n/meta";

export async function generateMetadata({ params }: PageProps<"/[lang]/services">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = pick(lang);
  return pageMetadata(lang, "/services", {
    title: t("All Cleaning Services", "Todos los servicios de limpieza"),
    description: t(
      "Browse every cleaning service from Emili's Cleaning Co. — residential, deep cleaning, move-in/move-out, commercial, kitchen, bathroom and interior cleaning in Spring, TX and nearby.",
      "Explore todos los servicios de limpieza de Emili's Cleaning Co. — residencial, limpieza profunda, mudanza (entrada/salida), comercial, cocina, baños e interiores en Spring, TX y zonas cercanas.",
    ),
  });
}

export default async function ServicesPage() {
  const { lang, t, href } = await getI18n();
  const [groups, enabled] = await Promise.all([getEnabledByCategory(), getEnabledServices()]);
  const ids = new Set(enabled.map((s) => s.id));
  const major = SERVICE_PAGES.filter((p) => ids.has(p.serviceId)).map((p) => servicePage(lang, p));

  return (
    <>
      <PageHero
        crumbs={[{ name: t("Services", "Servicios"), path: "/services" }]}
        eyebrow={t("Complete Cleaning Services", "Servicios de limpieza completos")}
        title={t(
          <>
            Every clean you need, <span className="text-gradient italic">all in one place</span>
          </>,
          <>
            Toda la limpieza que necesita, <span className="text-gradient italic">en un solo lugar</span>
          </>,
        )}
        lead={t(
          "Residential, deep cleaning, move-in and move-out, commercial, kitchen, bathroom and interior cleaning — organized so you can quickly find exactly what you need.",
          "Residencial, limpieza profunda, mudanza (entrada y salida), comercial, cocina, baños e interiores — organizados para que encuentre rápido exactamente lo que necesita.",
        )}
      >
        <div className="flex justify-center">
          <PrimaryCtas />
        </div>
      </PageHero>

      {major.length > 0 && (
        <section className="section !pb-6 bg-white">
          <div className="container-x">
            <SectionHeading eyebrow={t("Most Requested", "Los más solicitados")} title={t("Our signature services", "Nuestros servicios estrella")} />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {major.map((p) => (
                <Link
                  key={p.slug}
                  href={href(`/services/${p.slug}`)}
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
            eyebrow={t("Browse by Category", "Explore por categoría")}
            title={t("Find your service", "Encuentre su servicio")}
            lead={t(
              "Pick a category or search. Every service can be booked online or quoted from your photos.",
              "Elija una categoría o busque. Cada servicio se puede reservar en línea o cotizar a partir de sus fotos.",
            )}
          />
          <div className="mt-10">
            <ServicesExplorer
              groups={groups.map((g) => {
                const c = category(lang, g.category);
                return {
                  id: c.id,
                  name: c.name,
                  tagline: c.tagline,
                  description: c.description,
                  image: c.image,
                  pricing: c.pricing,
                  services: g.services.map((s) => serviceText(lang, s)),
                };
              })}
            />
          </div>
        </div>
      </section>

      <CTASection
        title={t("Not sure which service you need?", "¿No está seguro de qué servicio necesita?")}
        lead={t(
          "Send us pictures and we'll recommend the right service, crew size and time — free.",
          "Envíenos fotos y le recomendaremos el servicio, el tamaño del equipo y el tiempo adecuados — gratis.",
        )}
      />
    </>
  );
}
