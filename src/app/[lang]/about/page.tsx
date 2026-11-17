import type { Metadata } from "next";
import Image from "next/image";
import { Icon, Sparkle } from "@/components/Icon";
import { CTASection, PageHero } from "@/components/sections";
import { CheckList, Eyebrow, SectionHeading } from "@/components/ui";
import { COPY, SITE } from "@/lib/site";
import { isLang, pick } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/i18n/meta";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = pick(lang);
  return pageMetadata(lang, "/about", {
    title: t("About Us — Meet Emili", "Sobre nosotros — Conozca a Emili"),
    description: t(
      "Emili's Cleaning Co. is a Spring, Texas cleaning company providing dependable residential and commercial cleaning with transparent pricing, flexible scheduling and easy estimates.",
      "Emili's Cleaning Co. es una empresa de limpieza de Spring, Texas que ofrece limpieza residencial y comercial confiable, con precios transparentes, horarios flexibles y estimados fáciles.",
    ),
    image: "/images/emilis-cleaning-team.webp",
  });
}

export default async function AboutPage() {
  const { lang, t } = await getI18n();
  const copy = COPY[lang];
  const VALUES = [
    {
      icon: "heart" as const,
      title: t("Care in every detail", "Cuidado en cada detalle"),
      text: t(
        "We treat every home and business like it's our own — thoughtful, respectful and thorough.",
        "Tratamos cada hogar y cada negocio como si fuera nuestro — con atención, respeto y esmero.",
      ),
    },
    {
      icon: "dollar" as const,
      title: t("Transparent pricing", "Precios transparentes"),
      text: t(
        "Simple hourly crew rates shown up front, with free estimates from your photos.",
        "Tarifas por hora del equipo claras desde el inicio, con estimados gratis a partir de sus fotos.",
      ),
    },
    {
      icon: "calendar" as const,
      title: t("Flexible scheduling", "Horarios flexibles"),
      text: t(
        "One-time, weekly, biweekly or monthly — we work around your life.",
        "Una sola vez, semanal, quincenal o mensual — nos adaptamos a su vida.",
      ),
    },
    {
      icon: "message" as const,
      title: t("English & Spanish", "Español e inglés"),
      text: t(
        "Call or text either of our two lines — we speak English and Spanish. ¡Hablamos español!",
        "Llame o envíe un texto a cualquiera de nuestras dos líneas — hablamos español e inglés. ¡Hablamos español!",
      ),
    },
  ];
  return (
    <>
      <PageHero
        crumbs={[{ name: t("About Us", "Sobre nosotros"), path: "/about" }]}
        eyebrow={t("Our Story", "Nuestra historia")}
        title={t(
          <>
            A cleaner home, <span className="text-gradient italic">a happier you</span>
          </>,
          <>
            Un hogar más limpio, <span className="text-gradient italic">una vida más feliz</span>
          </>,
        )}
        lead={t(
          `${SITE.name} is a Spring, Texas cleaning company serving homes and businesses across the north Houston area.`,
          `${SITE.name} es una empresa de limpieza de Spring, Texas que atiende casas y negocios en toda el área norte de Houston.`,
        )}
        image="/images/emilis-cleaning-team.webp"
        imageAlt={t(
          "Emili's Cleaning Co. team in white and purple uniforms outside a Texas home",
          "Equipo de Emili's Cleaning Co. con uniformes blancos y morados frente a una casa de Texas",
        )}
      />

      <section className="section bg-white">
        <div className="container-x grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative mx-auto w-full max-w-md">
            <div className="silver-frame arch">
              <div className="arch relative aspect-[4/5] overflow-hidden">
                <Image src="/brand/emili.jpg" alt={t("Emili, founder of Emili's Cleaning Co.", "Emili, fundadora de Emili's Cleaning Co.")} fill sizes="(min-width:1024px) 28rem, 90vw" className="object-cover" />
              </div>
            </div>
            <Sparkle className="animate-twinkle absolute -top-4 right-8 size-8 text-plum-400" />
            <div className="silver-ring card animate-float absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-2xl bg-white px-6 py-3 text-center shadow-lift">
              <p className="font-script text-4xl text-plum-700">Emili</p>
              <p className="text-xs font-bold tracking-[0.18em] text-muted uppercase">{t("Founder", "Fundadora")}</p>
            </div>
          </div>
          <div>
            <Eyebrow>{t("Meet Emili", "Conozca a Emili")}</Eyebrow>
            <h2 className="h2 mt-4">{t("Dependable cleaning, done with heart", "Limpieza confiable, hecha con cariño")}</h2>
            <div className="lead mt-6 space-y-5">
              <p>
                {t(
                  `${SITE.name} was founded by Emili with a simple goal: to give families and businesses in Spring and the surrounding communities a cleaning service they can truly count on.`,
                  `${SITE.name} fue fundada por Emili con una meta sencilla: ofrecer a las familias y negocios de Spring y las comunidades cercanas un servicio de limpieza en el que realmente puedan confiar.`,
                )}
              </p>
              <p>
                {copy.description} {copy.goal}
              </p>
              <p>
                {t(
                  "Whether it's a weekly refresh, a top-to-bottom deep clean, or getting a home ready for move-out day, our crews show up ready to make your space shine — so you can spend your time on what matters most.",
                  "Ya sea una limpieza semanal, una limpieza profunda de arriba abajo o preparar una casa para el día de la mudanza, nuestros equipos llegan listos para hacer brillar su espacio — para que usted dedique su tiempo a lo que más importa.",
                )}
              </p>
            </div>
            <p className="mt-8 font-script text-4xl text-plum-700">{copy.slogan}</p>
          </div>
        </div>
      </section>

      <section className="section bg-lavender">
        <div className="container-x">
          <SectionHeading eyebrow={t("What We Stand For", "En qué creemos")} title={t("Our promise to every client", "Nuestra promesa a cada cliente")} />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="silver-ring card card-hover reveal bg-white p-7 shadow-soft">
                <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-plum-500 to-plum-800 text-white shadow-glow">
                  <Icon name={v.icon} className="size-6" />
                </span>
                <h3 className="mt-5 font-serif text-xl">{v.title}</h3>
                <p className="mt-2 text-[0.97rem] text-ink-soft">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>{t("What We Do", "Lo que hacemos")}</Eyebrow>
            <h2 className="h2 mt-4">{t("Residential, commercial & move-out cleaning", "Limpieza residencial, comercial y de mudanza")}</h2>
            <CheckList
              className="mt-8"
              items={t(
                [
                  "House cleaning & recurring maid service",
                  "Apartment, condo & townhouse cleaning",
                  "Deep cleaning — baseboards, fans, cabinets, grout & more",
                  "Move-in, move-out & rental turnover cleaning",
                  "Office, retail, salon & common-area cleaning",
                  "Free time estimates from your photos",
                ],
                [
                  "Limpieza de casas y servicio doméstico recurrente",
                  "Limpieza de apartamentos, condominios y casas adosadas",
                  "Limpieza profunda — zoclos, ventiladores, gabinetes, lechada y más",
                  "Limpieza de mudanza (entrada y salida) y entre inquilinos",
                  "Limpieza de oficinas, tiendas, salones y áreas comunes",
                  "Estimados de tiempo gratis a partir de sus fotos",
                ],
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ["/images/kitchen-cleaning.webp", t("Kitchen being wiped down", "Limpieza de una cocina")],
              ["/images/bathroom-cleaning.webp", t("Shower glass being cleaned", "Limpieza del vidrio de una ducha")],
              ["/images/maid-service-bed-making.webp", t("Bed being made with fresh linens", "Cama tendida con sábanas limpias")],
              ["/images/commercial-office-cleaning.webp", t("Office conference table being cleaned", "Limpieza de una mesa de juntas de oficina")],
            ].map(([src, alt], i) => (
              <div key={src} className={`reveal relative aspect-square overflow-hidden rounded-[1.75rem] shadow-soft ${i % 2 ? "translate-y-8" : ""}`}>
                <Image src={src} alt={alt} fill sizes="(min-width:1024px) 22vw, 45vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
