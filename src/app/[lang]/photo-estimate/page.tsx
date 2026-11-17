import type { Metadata } from "next";
import Image from "next/image";
import { EstimateForm } from "@/components/forms/EstimateForm";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/sections";
import { Eyebrow } from "@/components/ui";
import { getFormServiceGroups } from "@/lib/form-services";
import { PHONE_LINES } from "@/lib/site";
import { isLang, pick } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/i18n/meta";

export async function generateMetadata({ params }: PageProps<"/[lang]/photo-estimate">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = pick(lang);
  return pageMetadata(lang, "/photo-estimate", {
    title: t("Send Pictures for a Free Cleaning Estimate", "Envíe fotos para un estimado de limpieza gratis"),
    description: t(
      "Not sure how many hours your cleaning will take? Send pictures of your rooms and Emili's Cleaning Co. will recommend a crew, estimate the time and price — free. Spring, TX.",
      "¿No está seguro de cuántas horas tomará su limpieza? Envíe fotos de sus cuartos y Emili's Cleaning Co. le recomendará un equipo y calculará el tiempo y el precio — gratis. Spring, TX.",
    ),
    image: "/images/send-photos-estimate.webp",
  });
}

export default async function PhotoEstimatePage() {
  const { t } = await getI18n();
  const groups = await getFormServiceGroups();
  return (
    <>
      <PageHero
        crumbs={[{ name: t("Send Pictures for an Estimate", "Enviar fotos para un estimado"), path: "/photo-estimate" }]}
        eyebrow={t("Free Photo Estimates", "Estimados gratis con fotos")}
        title={t(
          <>
            Send Us Pictures &amp; Get a <span className="text-gradient italic">Free Cleaning Time Estimate!</span>
          </>,
          <>
            Envíenos fotos y reciba un <span className="text-gradient italic">estimado gratis del tiempo de limpieza</span>
          </>,
        )}
        lead={t(
          "Not sure how many hours your cleaning will take? Simply send us pictures of the rooms or areas you need cleaned.",
          "¿No está seguro de cuántas horas tomará su limpieza? Simplemente envíenos fotos de los cuartos o áreas que necesita limpiar.",
        )}
        image="/images/send-photos-estimate.webp"
        imageAlt={t(
          "Customer taking a photo of a kitchen with a smartphone for a cleaning estimate",
          "Cliente tomando una foto de una cocina con su teléfono para un estimado de limpieza",
        )}
      />

      <section className="section bg-white">
        <div className="container-x grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
          <div>
            <EstimateForm groups={groups} />
          </div>
          <aside className="space-y-6 lg:sticky lg:top-32">
            <div className="silver-ring card bg-white p-7 shadow-soft">
              <Eyebrow>{t("How It Works", "Cómo funciona")}</Eyebrow>
              <p className="mt-4 text-ink-soft">
                {t(
                  "Our team will review the photos, recommend the appropriate cleaning crew, estimate how long the job will take, and provide an estimated price before scheduling.",
                  "Nuestro equipo revisará las fotos, recomendará el equipo de limpieza adecuado, calculará cuánto tiempo tomará el trabajo y le dará un precio estimado antes de programar.",
                )}
              </p>
              <ol className="mt-6 space-y-4">
                {t(
                  ["Upload photos of each area", "We review & recommend a crew", "You get a time & price estimate", "Approve and we schedule"],
                  ["Suba fotos de cada área", "Revisamos y recomendamos un equipo", "Usted recibe un estimado de tiempo y precio", "Usted aprueba y nosotros programamos"],
                ).map((step, i) => (
                  <li key={step} className="flex items-center gap-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-plum-700 text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-ink">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-plum-luxe overflow-hidden rounded-[2rem] text-white shadow-lift">
              <div className="relative h-36">
                <Image src="/images/kitchen-cleaning.webp" alt="" fill sizes="400px" className="object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c0d2e] to-transparent" />
                <p className="absolute bottom-3 left-6 font-serif text-2xl text-white">{t("Prefer to text?", "¿Prefiere enviar un texto?")}</p>
              </div>
              <div className="space-y-3 p-6 pt-3">
                <p className="text-plum-100">{t("Text your pictures directly to either number:", "Envíe sus fotos por texto directamente a cualquiera de los dos números:")}</p>
                {PHONE_LINES.map((p, i) => (
                  <a key={p.e164} href={p.sms} className="btn btn-light w-full justify-between !px-5">
                    <span className="text-left leading-tight">
                      <span className="block text-[0.65rem] tracking-[0.14em] text-muted uppercase">{i ? t("Secondary", "Secundario") : t("Primary", "Principal")}</span>
                      {p.display}
                    </span>
                    <Icon name="message" className="size-5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-plum-200 bg-plum-50 p-5 text-sm leading-relaxed text-ink-soft">
              <p className="flex items-center gap-2 font-bold text-plum-800">
                <Icon name="clipboard" className="size-5" /> {t("Good to know", "Es bueno saber")}
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>{t("Completion times and pricing are estimates until reviewed and approved.", "Los tiempos de realización y los precios son estimados hasta que se revisen y aprueben.")}</li>
                <li>{t("A few wide photos per room is perfect — no need to tidy first.", "Unas cuantas fotos amplias por cuarto son perfectas — no necesita ordenar antes.")}</li>
                <li>{t("Photos are only used to prepare your estimate.", "Las fotos solo se usan para preparar su estimado.")}</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
