import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingForm } from "@/components/forms/BookingForm";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/sections";
import { getFormServiceGroups } from "@/lib/form-services";
import { isLang, pick } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/i18n/meta";

export async function generateMetadata({ params }: PageProps<"/[lang]/book">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = pick(lang);
  return pageMetadata(lang, "/book", {
    title: t("Book Your Cleaning Online", "Reserve su limpieza en línea"),
    description: t(
      "Request your house, apartment, deep, move-out or commercial cleaning online. Choose 2, 3 or 4 cleaners, pick your hours and see your estimated price instantly. Spring, TX.",
      "Solicite en línea la limpieza de su casa, apartamento, limpieza profunda, de mudanza o comercial. Elija 2, 3 o 4 profesionales, escoja sus horas y vea su precio estimado al instante. Spring, TX.",
    ),
  });
}

export default async function BookPage() {
  const { t } = await getI18n();
  const groups = await getFormServiceGroups();
  return (
    <>
      <PageHero
        crumbs={[{ name: t("Book Your Cleaning", "Reserve su limpieza"), path: "/book" }]}
        eyebrow={t("Online Booking Request", "Solicitud de reservación en línea")}
        title={t(
          <>
            Book your cleaning <span className="text-gradient italic">in minutes</span>
          </>,
          <>
            Reserve su limpieza <span className="text-gradient italic">en minutos</span>
          </>,
        )}
        lead={t(
          "Choose your service, crew and hours, see your estimated price, and send your request. We'll call or text to confirm before anything is scheduled.",
          "Elija su servicio, equipo y horas, vea su precio estimado y envíe su solicitud. Le llamaremos o enviaremos un texto para confirmar antes de programar algo.",
        )}
      >
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-semibold text-ink-soft">
          {t(
            ["Instant price estimate", "2, 3 or 4 cleaners", "Confirmed by call or text"],
            ["Precio estimado al instante", "2, 3 o 4 profesionales", "Confirmación por llamada o texto"],
          ).map((item) => (
            <span key={item} className="flex items-center gap-2">
              <Icon name="checkCircle" className="size-5 text-plum-600" /> {item}
            </span>
          ))}
        </div>
      </PageHero>
      <section className="section !pt-12 bg-white">
        <div className="container-x">
          <Suspense fallback={<div className="h-[60rem] animate-pulse rounded-[2rem] bg-plum-50" />}>
            <BookingForm groups={groups} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
