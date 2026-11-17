import { AREAS } from "@/lib/areas";
import { getEnabledServices } from "@/lib/data";
import { SERVICE_PAGES } from "@/lib/service-pages";
import { SITE } from "@/lib/site";
import { servicePage } from "@/i18n/content";
import { getI18n } from "@/i18n/server";
import { Icon } from "../Icon";
import { HeaderNav, type NavGroup } from "./HeaderNav";
import { LanguageSwitch } from "./LanguageSwitch";

export async function Header() {
  const [{ lang, t }, enabledList] = await Promise.all([getI18n(), getEnabledServices()]);
  const enabled = new Set(enabledList.map((s) => s.id));
  const servicePages = SERVICE_PAGES.filter((p) => enabled.has(p.serviceId)).map((p) => servicePage(lang, p));

  const groups: NavGroup[] = [
    {
      label: t("Services", "Servicios"),
      href: "/services",
      links: [
        ...servicePages.map((p) => ({ href: `/services/${p.slug}`, label: p.navLabel, note: p.kicker })),
        {
          href: "/services",
          label: t("All Cleaning Services", "Todos los servicios de limpieza"),
          note: t("Browse every service we offer", "Vea todos los servicios que ofrecemos"),
          featured: true,
        },
      ],
    },
    { label: t("Pricing", "Precios"), href: "/pricing" },
    { label: t("Photo Estimate", "Estimado con fotos"), href: "/photo-estimate" },
    {
      label: t("Service Areas", "Zonas de servicio"),
      href: "/service-areas",
      links: [
        ...AREAS.map((a) => ({ href: `/service-areas/${a.slug}`, label: a.label })),
        { href: "/service-areas", label: t("View Service Area Map", "Ver el mapa de zonas de servicio"), featured: true },
      ],
    },
    {
      label: t("About", "Nosotros"),
      href: "/about",
      links: [
        { href: "/about", label: t("About Us", "Sobre nosotros"), note: t("Meet Emili & our story", "Conozca a Emili y nuestra historia") },
        {
          href: "/gallery",
          label: t("Before & After Gallery", "Galería de antes y después"),
          note: t("Real completed cleaning jobs", "Trabajos de limpieza reales"),
        },
        { href: "/reviews", label: t("Customer Reviews", "Reseñas de clientes"), note: t("What our clients say", "Lo que dicen nuestros clientes") },
        { href: "/faq", label: t("FAQ", "Preguntas frecuentes"), note: t("Pricing, booking & more", "Precios, reservaciones y más") },
      ],
    },
    { label: t("Contact", "Contacto"), href: "/contact" },
  ];

  return (
    <>
      <div className="bg-plum-950 text-[0.8rem] text-plum-100">
        <div className="container-x flex h-10 items-center justify-center gap-6 md:justify-between">
          <p className="hidden items-center gap-2 whitespace-nowrap xl:flex">
            <Icon name="mapPin" className="size-3.5 text-plum-300" />
            {t("Proudly serving Spring, Klein, The Woodlands & nearby", "Atendemos Spring, Klein, The Woodlands y zonas cercanas")}
            <span className="text-plum-400">·</span>
            <span className="font-semibold text-white">{t("We speak English & Spanish", "Hablamos español e inglés")}</span>
          </p>
          <div className="flex h-full items-center gap-2 font-semibold tracking-wide whitespace-nowrap sm:gap-4">
            <a href={SITE.phones.primary.tel} className="flex h-full items-center gap-1.5 px-1 hover:text-white">
              <Icon name="phone" className="size-3.5 text-plum-300" />
              <span className="hidden sm:inline">{t("Call or Text", "Llame o envíe texto")}</span> {SITE.phones.primary.display}
            </a>
            <span className="text-plum-400" aria-hidden>
              |
            </span>
            <a href={SITE.phones.secondary.tel} className="flex h-full items-center gap-1.5 px-1 hover:text-white">
              <span className="hidden sm:inline">{t("Secondary", "Secundario")}</span> {SITE.phones.secondary.display}
            </a>
          </div>
          <div className="hidden md:block">
            <LanguageSwitch variant="bar" />
          </div>
        </div>
      </div>
      <HeaderNav groups={groups} />
    </>
  );
}
