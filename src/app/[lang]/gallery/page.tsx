import type { Metadata } from "next";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Icon } from "@/components/Icon";
import { CTASection, PageHero } from "@/components/sections";
import { getPublishedGallery } from "@/lib/data";
import { SITE } from "@/lib/site";
import { isLang, pick } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/i18n/meta";

export async function generateMetadata({ params }: PageProps<"/[lang]/gallery">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = pick(lang);
  return pageMetadata(lang, "/gallery", {
    title: t("Before & After Cleaning Gallery", "Galería de limpieza: antes y después"),
    description: t(
      "See before and after photos from real cleaning jobs completed by Emili's Cleaning Co. in Spring, The Woodlands, Klein and nearby communities.",
      "Vea fotos de antes y después de trabajos de limpieza reales realizados por Emili's Cleaning Co. en Spring, The Woodlands, Klein y comunidades cercanas.",
    ),
  });
}

export default async function GalleryPage() {
  const { lang, t } = await getI18n();
  const items = await getPublishedGallery();
  return (
    <>
      <PageHero
        crumbs={[{ name: t("Before & After Gallery", "Galería de antes y después"), path: "/gallery" }]}
        eyebrow={t("Real Completed Jobs", "Trabajos reales terminados")}
        title={t(
          <>
            Before &amp; <span className="text-gradient italic">after</span>
          </>,
          <>
            Antes y <span className="text-gradient italic">después</span>
          </>,
        )}
        lead={t(
          "Drag the slider on each photo to compare. Every photo here is from an actual cleaning job completed by our team.",
          "Arrastre el control deslizante de cada foto para comparar. Todas las fotos son de trabajos de limpieza reales realizados por nuestro equipo.",
        )}
      />
      <section className="section bg-white">
        <div className="container-x">
          {items.length ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {items.map((g) => (
                <figure key={g.id} className="silver-ring card reveal bg-white p-3 shadow-soft" style={{ borderRadius: "1.75rem" }}>
                  <BeforeAfter before={g.before} after={g.after} alt={(lang === "es" && g.titleEs) || g.title} />
                  <figcaption className="px-2 pt-4 pb-2">
                    <p className="font-serif text-xl text-ink">{(lang === "es" && g.titleEs) || g.title}</p>
                    {(g.service || g.location) && (
                      <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                        {g.service && (
                          <span className="flex items-center gap-1.5">
                            <Icon name="sparkles" className="size-3.5 text-plum-500" /> {g.service}
                          </span>
                        )}
                        {g.location && (
                          <span className="flex items-center gap-1.5">
                            <Icon name="mapPin" className="size-3.5 text-plum-500" /> {g.location}
                          </span>
                        )}
                      </p>
                    )}
                    {((lang === "es" && g.descriptionEs) || g.description) && (
                      <p className="mt-2 text-[0.95rem] text-ink-soft">{(lang === "es" && g.descriptionEs) || g.description}</p>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <div className="silver-ring card mx-auto max-w-2xl bg-white p-10 text-center shadow-soft" style={{ borderRadius: "2rem" }}>
              <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-plum-100 text-plum-700">
                <Icon name="image" className="size-8" />
              </span>
              <h2 className="mt-5 font-serif text-3xl">{t("Our gallery is coming soon", "Nuestra galería llegará pronto")}</h2>
              <p className="mt-3 text-ink-soft">
                {t(
                  "We're adding before-and-after photos from real jobs completed by our team. Check back soon — or call or text",
                  "Estamos agregando fotos de antes y después de trabajos reales realizados por nuestro equipo. Vuelva pronto — o llame o envíe un texto al",
                )}{" "}
                <a href={SITE.phones.primary.tel} className="font-semibold text-plum-700">
                  {SITE.phones.primary.display}
                </a>{" "}
                {t("to talk about your cleaning.", "para hablar sobre su limpieza.")}
              </p>
            </div>
          )}
        </div>
      </section>
      <CTASection />
    </>
  );
}
