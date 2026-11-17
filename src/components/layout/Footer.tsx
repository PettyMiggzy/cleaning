import Link from "next/link";
import { AREAS } from "@/lib/areas";
import { getEnabledServices, getSettings } from "@/lib/data";
import { SERVICE_PAGES } from "@/lib/service-pages";
import { COPY, SITE } from "@/lib/site";
import { servicePage } from "@/i18n/content";
import { getI18n } from "@/i18n/server";
import { Icon, Sparkle, type IconName } from "../Icon";
import { LanguageSwitch } from "./LanguageSwitch";
import { Logo } from "./Logo";
import { Year } from "./Year";

const SOCIAL: { key: "facebook" | "instagram" | "tiktok" | "google" | "yelp" | "nextdoor"; label: string; icon: IconName }[] = [
  { key: "facebook", label: "Facebook", icon: "facebook" },
  { key: "instagram", label: "Instagram", icon: "instagram" },
  { key: "tiktok", label: "TikTok", icon: "tiktok" },
  { key: "google", label: "Google", icon: "google" },
  { key: "yelp", label: "Yelp", icon: "star" },
  { key: "nextdoor", label: "Nextdoor", icon: "home" },
];

export async function Footer() {
  const [{ lang, t, href }, settings, enabledList] = await Promise.all([getI18n(), getSettings(), getEnabledServices()]);
  const enabled = new Set(enabledList.map((s) => s.id));
  const servicePages = SERVICE_PAGES.filter((p) => enabled.has(p.serviceId)).map((p) => servicePage(lang, p));
  const socials = SOCIAL.filter((s) => settings.social[s.key]);

  return (
    <footer className="relative overflow-hidden bg-plum-950 text-plum-100">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(40rem 20rem at 10% 0%, rgba(154,92,211,.35), transparent 60%), radial-gradient(30rem 20rem at 100% 100%, rgba(126,63,191,.3), transparent 60%)",
        }}
      />
      <div className="container-x relative pt-16 pb-28 md:pb-12">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Logo light size={64} />
            <p className="mt-5 font-script text-3xl text-white">{COPY[lang].slogan}</p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-plum-100">
              <Icon name="message" className="size-3.5" />{" "}
              {t("We speak English & Spanish · Hablamos español", "Hablamos español e inglés · We speak English & Spanish")}
            </p>
            <div className="mt-4">
              <LanguageSwitch variant="footer" />
            </div>
            <p className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-plum-200">
              {t(
                `Residential, commercial, deep cleaning and move-out cleaning in ${SITE.city}, ${SITE.state} and surrounding communities.`,
                `Limpieza residencial, comercial, profunda y de mudanza en ${SITE.city}, ${SITE.state} y comunidades cercanas.`,
              )}
            </p>
            <div className="mt-6 space-y-3">
              {[SITE.phones.primary, SITE.phones.secondary].map((p, i) => (
                <div key={p.e164} className="flex flex-wrap items-center gap-3">
                  <span className="w-24 text-xs font-bold tracking-[0.15em] text-plum-300 uppercase">
                    {i === 0 ? t("Primary", "Principal") : t("Secondary", "Secundario")}
                  </span>
                  <a href={p.tel} className="inline-flex min-h-10 items-center font-semibold text-white hover:text-plum-200">
                    {p.display}
                  </a>
                  <span className="flex gap-1.5">
                    <a
                      href={p.tel}
                      className="inline-flex min-h-10 items-center rounded-full border border-white/20 px-4 text-xs font-semibold hover:bg-white/10"
                    >
                      {t("Call", "Llamar")}
                    </a>
                    <a
                      href={p.sms}
                      className="inline-flex min-h-10 items-center rounded-full border border-white/20 px-4 text-xs font-semibold hover:bg-white/10"
                    >
                      {t("Text", "Texto")}
                    </a>
                  </span>
                </div>
              ))}
              <a href={`mailto:${SITE.email}`} className="flex min-h-10 items-center gap-2 text-sm text-plum-200 hover:text-white">
                <Icon name="mail" className="size-4" /> {SITE.email}
              </a>
            </div>
            {socials.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {socials.map((s) => (
                  <a
                    key={s.key}
                    href={settings.social[s.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid size-11 place-items-center rounded-full border border-white/20 text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                    aria-label={s.label}
                  >
                    <Icon name={s.icon} className="size-5" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <FooterCol title={t("Cleaning Services", "Servicios de limpieza")}>
            {servicePages.map((p) => (
              <FooterLink key={p.slug} href={href(`/services/${p.slug}`)}>
                {p.navLabel}
              </FooterLink>
            ))}
            <FooterLink href={href("/services")}>{t("All Cleaning Services", "Todos los servicios")}</FooterLink>
            <FooterLink href={href("/pricing")}>{t("Pricing", "Precios")}</FooterLink>
          </FooterCol>

          <FooterCol title={t("Service Areas", "Zonas de servicio")}>
            {AREAS.map((a) => (
              <FooterLink key={a.slug} href={href(`/service-areas/${a.slug}`)}>
                {a.label}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title={t("Company", "Empresa")}>
            <FooterLink href={href("/about")}>{t("About Us", "Sobre nosotros")}</FooterLink>
            <FooterLink href={href("/photo-estimate")}>{t("Send Pictures for an Estimate", "Enviar fotos para un estimado")}</FooterLink>
            <FooterLink href={href("/book")}>{t("Book Your Cleaning", "Reserve su limpieza")}</FooterLink>
            <FooterLink href={href("/gallery")}>{t("Before & After Gallery", "Galería de antes y después")}</FooterLink>
            <FooterLink href={href("/reviews")}>{t("Customer Reviews", "Reseñas de clientes")}</FooterLink>
            <FooterLink href={href("/faq")}>{t("FAQ", "Preguntas frecuentes")}</FooterLink>
            <FooterLink href={href("/contact")}>{t("Contact Us", "Contáctenos")}</FooterLink>
            <FooterLink href={href("/privacy-policy")}>{t("Privacy Policy", "Política de privacidad")}</FooterLink>
          </FooterCol>
        </div>

        <div className="divider-silver mt-14 opacity-30" />
        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-plum-300 md:flex-row">
          <p>
            © <Year /> {SITE.name} · {SITE.city}, {SITE.stateName}. {t("All rights reserved.", "Todos los derechos reservados.")}
          </p>
          <p className="flex items-center gap-2">
            <Sparkle className="size-3 text-plum-400" />{" "}
            {t("Prices and times shown are estimates until reviewed and approved.", "Los precios y tiempos mostrados son estimados hasta que se revisen y aprueben.")}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-sans text-xs font-bold tracking-[0.2em] text-white uppercase">{title}</h2>
      <ul className="mt-3 text-[0.95rem]">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="inline-flex min-h-10 items-center text-plum-200 transition-colors hover:text-white">
        {children}
      </Link>
    </li>
  );
}
