import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { CTASection, FaqList, PageHero } from "@/components/sections";
import { Eyebrow } from "@/components/ui";
import { faqSchema } from "@/lib/schema";
import { allFaqs, faqGroups } from "@/i18n/content";
import { isLang, pick } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/i18n/meta";

export async function generateMetadata({ params }: PageProps<"/[lang]/faq">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = pick(lang);
  return pageMetadata(lang, "/faq", {
    title: t("Frequently Asked Questions", "Preguntas frecuentes"),
    description: t(
      "Answers about Emili's Cleaning Co. pricing, 2-hour minimums, deep cleaning, photo estimates, booking requests and service areas in Spring, TX.",
      "Respuestas sobre los precios de Emili's Cleaning Co., el mínimo de 2 horas, la limpieza profunda, los estimados con fotos, las solicitudes de reservación y las zonas de servicio en Spring, TX.",
    ),
  });
}

export default async function FaqPage() {
  const { lang, t } = await getI18n();
  const groups = faqGroups(lang);
  return (
    <>
      <JsonLd data={faqSchema(allFaqs(lang))} />
      <PageHero
        crumbs={[{ name: t("FAQ", "Preguntas frecuentes"), path: "/faq" }]}
        eyebrow={t("Frequently Asked Questions", "Preguntas frecuentes")}
        title={t(
          <>
            Questions &amp; <span className="text-gradient italic">answers</span>
          </>,
          <>
            Preguntas y <span className="text-gradient italic">respuestas</span>
          </>,
        )}
        lead={t(
          "Everything you need to know about pricing, booking, estimates and our service areas.",
          "Todo lo que necesita saber sobre precios, reservaciones, estimados y nuestras zonas de servicio.",
        )}
      />
      <section className="section bg-white">
        <div className="container-x grid gap-12 lg:grid-cols-[16rem_1fr]">
          <nav aria-label={t("FAQ sections", "Secciones de preguntas frecuentes")} className="hidden lg:block">
            <ul className="sticky top-32 space-y-2">
              {groups.map((g, i) => (
                <li key={g.title}>
                  <a href={`#faq-${i}`} className="block rounded-xl px-4 py-2.5 font-semibold text-ink hover:bg-plum-50 hover:text-plum-700">
                    {g.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-14">
            {groups.map((g, i) => (
              <section key={g.title} id={`faq-${i}`}>
                <Eyebrow>{g.title}</Eyebrow>
                <div className="mt-5">
                  <FaqList items={g.items} />
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
      <CTASection
        title={t("Still have questions?", "¿Todavía tiene preguntas?")}
        lead={t("Call or text us anytime — or send pictures for a free estimate.", "Llámenos o envíenos un texto cuando quiera — o envíe fotos para un estimado gratis.")}
      />
    </>
  );
}
