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
import { SERVICE_PAGES } from "@/lib/service-pages";
import { categoryById, getServicePageBySlug, servicePage, serviceText } from "@/i18n/content";
import { LANGS, isLang } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/i18n/meta";

// Unlisted slugs are 404s, so a blocking render is fine here.
export const instant = false;

export function generateStaticParams() {
  return LANGS.flatMap((lang) => SERVICE_PAGES.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/services/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLang(lang)) return {};
  const page = getServicePageBySlug(lang, slug);
  if (!page) return {};
  return pageMetadata(lang, `/services/${page.slug}`, { title: page.metaTitle, description: page.metaDescription, image: page.image });
}

export default async function ServicePage({ params }: PageProps<"/[lang]/services/[slug]">) {
  const { slug } = await params;
  const { lang, t, href } = await getI18n();
  const page = getServicePageBySlug(lang, slug);
  if (!page || !(await isServiceEnabled(page.serviceId))) notFound();

  const enabled = await getEnabledServices();
  const related = page.relatedCategories.map((c) => ({
    category: categoryById(lang, c),
    services: enabled.filter((s) => s.categories.includes(c)).slice(0, 12).map((s) => serviceText(lang, s)),
  }));
  const others = SERVICE_PAGES.filter((p) => p.slug !== page.slug && enabled.some((s) => s.id === p.serviceId)).map((p) => servicePage(lang, p));

  return (
    <>
      <JsonLd data={serviceSchema({ name: page.navLabel, description: page.metaDescription, path: href(`/services/${page.slug}`), lang })} />
      <JsonLd data={faqSchema(page.faqs)} />
      <PageHero
        crumbs={[
          { name: t("Services", "Servicios"), path: "/services" },
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
            <Eyebrow>{t("What's Included", "Qué incluye")}</Eyebrow>
            <h2 className="h2 mt-4">{t(`Your ${page.navLabel.toLowerCase()} checklist`, `Lo que incluye nuestra ${page.navLabel.toLowerCase()}`)}</h2>
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
              {t(
                "Every home is different — tell us your priorities in your special instructions and we'll focus on what matters most to you.",
                "Cada hogar es diferente — díganos sus prioridades en las instrucciones especiales y nos enfocaremos en lo que más le importa.",
              )}
            </p>
          </div>
          <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
            <div className="bg-plum-luxe rounded-[2rem] p-7 text-white shadow-lift">
              <p className="text-xs font-bold tracking-[0.2em] text-plum-200 uppercase">{t("Pricing", "Precios")}</p>
              <p className="mt-3 font-serif text-3xl text-white">
                {page.pricingMode === "custom"
                  ? t("Custom estimate", "Estimado personalizado")
                  : page.pricingMode === "deep"
                    ? t("Hourly rate + 25–30%", "Tarifa por hora + 25–30%")
                    : t("From $100/hr for the crew", "Desde $100/hr para el equipo")}
              </p>
              <p className="mt-3 text-plum-100">{page.pricingNote}</p>
              <div className="mt-6 grid gap-3">
                <Link href={href(`/book?service=${page.serviceId}`)} className="btn btn-light w-full">
                  <Icon name="calendar" className="size-5" /> {t(`Book ${page.navLabel}`, `Reservar: ${page.navLabel}`)}
                </Link>
                <Link href={href("/photo-estimate")} className="btn btn-ghost-light w-full">
                  <Icon name="camera" className="size-5" /> {t("Free Photo Estimate", "Estimado gratis con fotos")}
                </Link>
              </div>
            </div>
            <div className="silver-ring card bg-white p-7 shadow-soft">
              <h3 className="font-serif text-xl">{t("Perfect for", "Ideal para")}</h3>
              <CheckList items={page.idealFor} className="mt-4 text-[0.97rem]" />
            </div>
            <PhoneLines compact />
          </aside>
        </div>
      </section>

      <section className="section bg-lavender">
        <div className="container-x">
          <SectionHeading
            eyebrow={t("Hourly Crew Rates", "Tarifas por hora del equipo")}
            title={t("Transparent pricing", "Precios transparentes")}
            lead={
              page.pricingMode === "custom"
                ? t(
                    `${page.navLabel} is quoted as a custom estimate. Our standard hourly crew rates are shown for reference.`,
                    `${page.navLabel} se cotiza como un estimado personalizado. Nuestras tarifas por hora estándar se muestran como referencia.`,
                  )
                : page.pricingMode === "deep"
                  ? t(
                      "Deep cleaning is 25–30% additional to the hourly crew rates below. 2-hour minimum.",
                      "La limpieza profunda es 25–30% adicional a las tarifas por hora del equipo que se muestran abajo. Mínimo de 2 horas.",
                    )
                  : t(
                      "The hourly rate covers the entire crew. 2-hour minimum applies to all bookings.",
                      "La tarifa por hora cubre a todo el equipo. Todas las reservaciones tienen un mínimo de 2 horas.",
                    )
            }
          />
          <div className="mt-14">
            <PricingCards compact />
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x">
          <SectionHeading eyebrow={t("Related Services", "Servicios relacionados")} title={t("Add-ons & related cleaning", "Complementos y limpieza relacionada")} />
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
                          href={href(`/book?service=${s.id}`)}
                          className="inline-flex min-h-10 items-center rounded-full border border-silver-200 px-4 text-sm font-semibold text-ink-soft transition hover:border-plum-300 hover:bg-plum-50 hover:text-plum-800"
                        >
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="px-6 pb-6">
                    <Link href={href(`/services#${r.category.id}`)} className="inline-flex min-h-10 items-center gap-2 font-bold text-plum-700">
                      {t(`View all ${r.category.shortName.toLowerCase()} services`, `Ver todos los servicios: ${r.category.shortName}`)} <Icon name="arrowRight" className="size-4" />
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
            <Eyebrow>{t("Questions", "Preguntas")}</Eyebrow>
            <h2 className="h2 mt-4">{t(`${page.navLabel} FAQ`, `Preguntas frecuentes: ${page.navLabel.toLowerCase()}`)}</h2>
            <div className="mt-8">
              <FaqList items={page.faqs} />
            </div>
            <Link href={href("/faq")} className="mt-6 inline-flex min-h-10 items-center gap-2 font-bold text-plum-700">
              {t("More questions & answers", "Más preguntas y respuestas")} <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
          <div>
            <Eyebrow>{t("Where We Clean", "Dónde limpiamos")}</Eyebrow>
            <h2 className="h2 mt-4">{t(`${page.navLabel} near you`, `${page.navLabel} cerca de usted`)}</h2>
            <ul className="mt-8 grid grid-cols-2 gap-3">
              {AREAS.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={href(`/service-areas/${a.slug}`)}
                    className="silver-ring card flex items-center gap-2 rounded-2xl px-4 py-3.5 font-semibold text-ink shadow-soft hover:text-plum-700"
                  >
                    <Icon name="mapPin" className="size-4 text-plum-600" /> {a.label}
                  </Link>
                </li>
              ))}
            </ul>
            {others.length > 0 && (
              <>
                <h3 className="mt-10 font-serif text-xl">{t("Other popular services", "Otros servicios populares")}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {others.map((o) => (
                    <Link key={o.slug} href={href(`/services/${o.slug}`)} className="chip hover:bg-plum-200">
                      {o.navLabel}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <CTASection title={t(`Ready to book ${page.navLabel.toLowerCase()}?`, "¿Listo para reservar su limpieza?")} />
    </>
  );
}
