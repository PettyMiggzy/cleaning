import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/forms/ContactForm";
import { Icon, type IconName } from "@/components/Icon";
import { PageHero } from "@/components/sections";
import { Eyebrow, PhoneLines } from "@/components/ui";
import { AREAS } from "@/lib/areas";
import { getSettings } from "@/lib/data";
import { SITE } from "@/lib/site";
import { isLang, pick } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { pageMetadata } from "@/i18n/meta";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = pick(lang);
  return pageMetadata(lang, "/contact", {
    title: t("Contact Us — Call or Text", "Contáctenos — llame o envíe un texto"),
    description: t(
      `Contact Emili's Cleaning Co. in Spring, TX. Call or text ${SITE.phones.primary.display} (primary) or ${SITE.phones.secondary.display} (secondary), or send us a message.`,
      `Contacte a Emili's Cleaning Co. en Spring, TX. Llame o envíe un texto al ${SITE.phones.primary.display} (principal) o al ${SITE.phones.secondary.display} (secundario), o envíenos un mensaje. Hablamos español.`,
    ),
  });
}

const SOCIAL: { key: keyof Awaited<ReturnType<typeof getSettings>>["social"]; label: string; icon: IconName }[] = [
  { key: "facebook", label: "Facebook", icon: "facebook" },
  { key: "instagram", label: "Instagram", icon: "instagram" },
  { key: "tiktok", label: "TikTok", icon: "tiktok" },
  { key: "google", label: "Google Business Profile", icon: "google" },
  { key: "yelp", label: "Yelp", icon: "star" },
  { key: "nextdoor", label: "Nextdoor", icon: "home" },
];

export default async function ContactPage() {
  const { t, href } = await getI18n();
  const settings = await getSettings();
  const socials = SOCIAL.filter((s) => settings.social[s.key]);
  return (
    <>
      <PageHero
        crumbs={[{ name: t("Contact Us", "Contáctenos"), path: "/contact" }]}
        eyebrow={t("We'd Love to Hear From You", "Nos encantará saber de usted")}
        title={t(
          <>
            Call, text or <span className="text-gradient italic">send a message</span>
          </>,
          <>
            Llame, envíe un texto o <span className="text-gradient italic">escríbanos un mensaje</span>
          </>,
        )}
        lead={t(
          "Both of our numbers accept calls and text messages. For the fastest estimate, text us pictures of the areas you need cleaned.",
          "Ambos números aceptan llamadas y mensajes de texto. Para un estimado más rápido, envíenos por texto fotos de las áreas que necesita limpiar.",
        )}
      />
      <section className="section bg-white">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-8">
            <div>
              <Eyebrow>{t("Phone & Text", "Teléfono y texto")}</Eyebrow>
              <div className="mt-5">
                <PhoneLines compact />
              </div>
            </div>
            <div className="silver-ring card bg-white p-6 shadow-soft">
              <div className="flex items-center gap-4">
                <span className="grid size-12 place-items-center rounded-2xl bg-plum-100 text-plum-700">
                  <Icon name="mail" />
                </span>
                <div>
                  <p className="text-xs font-bold tracking-[0.16em] text-plum-700 uppercase">{t("Email", "Correo electrónico")}</p>
                  <a href={`mailto:${SITE.email}`} className="font-semibold break-all text-ink hover:text-plum-700">
                    {SITE.email}
                  </a>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-4 border-t border-silver-100 pt-5">
                <span className="grid size-12 place-items-center rounded-2xl bg-plum-100 text-plum-700">
                  <Icon name="mapPin" />
                </span>
                <div>
                  <p className="text-xs font-bold tracking-[0.16em] text-plum-700 uppercase">{t("Based In", "Con base en")}</p>
                  <p className="font-semibold text-ink">
                    {SITE.city}, {SITE.stateName}
                  </p>
                  <p className="text-sm text-muted">{t("Serving", "Atendemos")} {AREAS.map((a) => a.name).join(", ")}</p>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-4 border-t border-silver-100 pt-5">
                <span className="grid size-12 place-items-center rounded-2xl bg-plum-100 text-plum-700">
                  <Icon name="message" />
                </span>
                <div>
                  <p className="text-xs font-bold tracking-[0.16em] text-plum-700 uppercase">{t("Languages", "Idiomas")}</p>
                  <p className="font-semibold text-ink">{t("English & Spanish", "Español e inglés")}</p>
                  <p className="text-sm text-muted">{t("¡Hablamos español! Call or text in the language you prefer.", "¡Hablamos español! Llame o envíe un texto en el idioma que prefiera.")}</p>
                </div>
              </div>
            </div>
            <div className="silver-ring card bg-white p-6 shadow-soft">
              <p className="text-xs font-bold tracking-[0.16em] text-plum-700 uppercase">{t("Follow Us", "Síganos")}</p>
              {socials.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {socials.map((s) => (
                    <a
                      key={s.key}
                      href={settings.social[s.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                    >
                      <Icon name={s.icon} className="size-4" /> {s.label}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted">{t("Our social media pages are coming soon.", "Nuestras páginas de redes sociales llegarán pronto.")}</p>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href={href("/book")} className="btn btn-primary">
                <Icon name="calendar" className="size-5" /> {t("Book Your Cleaning", "Reserve su limpieza")}
              </Link>
              <Link href={href("/photo-estimate")} className="btn btn-outline">
                <Icon name="camera" className="size-5" /> {t("Free Photo Estimate", "Estimado gratis con fotos")}
              </Link>
            </div>
          </div>
          <div>
            <h2 className="h2">{t("Send us a message", "Envíenos un mensaje")}</h2>
            <p className="mt-3 mb-8 text-ink-soft">{t("We'll get back to you as soon as possible.", "Le responderemos lo antes posible.")}</p>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
