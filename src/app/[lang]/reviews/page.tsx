import type { Metadata } from "next";
import { ReviewForm } from "@/components/forms/ReviewForm";
import { Icon } from "@/components/Icon";
import { GoogleReviews } from "@/components/GoogleReviews";
import { CTASection, PageHero } from "@/components/sections";
import { Eyebrow, Stars } from "@/components/ui";
import { getPublishedReviews, getSettings } from "@/lib/data";
import { isLang, pick } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/i18n/meta";

export async function generateMetadata({ params }: PageProps<"/[lang]/reviews">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = pick(lang);
  return pageMetadata(lang, "/reviews", {
    title: t("Customer Reviews", "Reseñas de clientes"),
    description: t(
      "Read genuine reviews from Emili's Cleaning Co. customers in Spring, TX and nearby — and share your own experience.",
      "Lea reseñas genuinas de clientes de Emili's Cleaning Co. en Spring, TX y zonas cercanas — y comparta su propia experiencia.",
    ),
  });
}

export default async function ReviewsPage() {
  const { lang, t } = await getI18n();
  const [reviews, settings] = await Promise.all([getPublishedReviews(), getSettings()]);
  const avg = reviews.length ? reviews.reduce((n, r) => n + r.rating, 0) / reviews.length : 0;

  return (
    <>
      <PageHero
        crumbs={[{ name: t("Customer Reviews", "Reseñas de clientes"), path: "/reviews" }]}
        eyebrow={t("Genuine Customer Reviews", "Reseñas genuinas de clientes")}
        title={t(
          <>
            What our clients <span className="text-gradient italic">are saying</span>
          </>,
          <>
            Lo que dicen <span className="text-gradient italic">nuestros clientes</span>
          </>,
        )}
        lead={t(
          "Every review on this page comes from a real customer of Emili's Cleaning Co.",
          "Cada reseña en esta página viene de un cliente real de Emili's Cleaning Co.",
        )}
      >
        {reviews.length > 0 && (
          <div className="flex items-center justify-center gap-3">
            <Stars rating={Math.round(avg)} className="size-6" label={t(`${Math.round(avg)} out of 5 stars`, `${Math.round(avg)} de 5 estrellas`)} />
            <span className="font-semibold text-ink">
              {lang === "es"
                ? `${avg.toFixed(1)} de promedio · ${reviews.length} ${reviews.length === 1 ? "reseña" : "reseñas"}`
                : `${avg.toFixed(1)} average · ${reviews.length} review${reviews.length === 1 ? "" : "s"}`}
            </span>
          </div>
        )}
      </PageHero>

      <section className="section bg-white">
        <div className="container-x">
          <GoogleReviews reviews={reviews} googleReviewUrl={settings.googleReviewUrl} showWriteLink={false} />
        </div>
      </section>

      <section className="section bg-lavender" id="write-a-review">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>{t("Share Your Experience", "Comparta su experiencia")}</Eyebrow>
            <h2 className="h2 mt-4">{t("Leave a review", "Deje una reseña")}</h2>
            <p className="lead mt-5">
              {t(
                "Your feedback helps us improve and helps your neighbors find a cleaning company they can trust. Reviews appear on the site after a quick verification by our team.",
                "Su opinión nos ayuda a mejorar y ayuda a sus vecinos a encontrar una empresa de limpieza de confianza. Las reseñas aparecen en el sitio después de una verificación rápida de nuestro equipo.",
              )}
            </p>
            {settings.googleReviewUrl && (
              <a href={settings.googleReviewUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline mt-8">
                <Icon name="google" className="size-5" /> {t("Review us on Google", "Reseñenos en Google")}
              </a>
            )}
          </div>
          <ReviewForm />
        </div>
      </section>
      <CTASection />
    </>
  );
}
