import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Analytics } from "@/components/Analytics";
import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { LangSuggest } from "@/components/layout/LangSuggest";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { getEnabledServices, getSettings } from "@/lib/data";
import { fontVariables } from "@/lib/fonts";
import { localBusinessSchema } from "@/lib/schema";
import { SERVICE_PAGES } from "@/lib/service-pages";
import { servicePage } from "@/i18n/content";
import { COPY, SITE } from "@/lib/site";
import { LangProvider } from "@/i18n/client";
import { LANGS, LANG_META, isLang, localizePath, pick } from "@/i18n/config";
import "../globals.css";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = pick(lang);
  const description = t(
    `${COPY.en.description} Transparent hourly pricing, flexible scheduling and free photo estimates. We speak English & Spanish. Call or text ${SITE.phones.primary.display}.`,
    `${COPY.es.description} Precios por hora transparentes, horarios flexibles y estimados gratis con fotos. Hablamos español. Llame o envíe un texto al ${SITE.phones.primary.display}.`,
  );
  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: t(
        `${SITE.name} | House Cleaning & Maid Services in Spring, TX`,
        `${SITE.name} | Limpieza de casas y servicio doméstico en Spring, TX`,
      ),
      template: `%s | ${SITE.name}`,
    },
    description,
    applicationName: SITE.name,
    keywords: t(
      [
        "house cleaning Spring TX",
        "maid service Spring TX",
        "deep cleaning Spring TX",
        "move out cleaning Spring TX",
        "apartment cleaning",
        "commercial cleaning",
        "cleaning service The Woodlands",
        "house cleaners Klein TX",
        "limpieza de casas Spring TX",
        "servicio de limpieza en español",
      ],
      [
        "limpieza de casas Spring TX",
        "servicio de limpieza doméstica Spring TX",
        "limpieza profunda Spring TX",
        "limpieza de mudanza Spring TX",
        "limpieza de apartamentos",
        "limpieza comercial",
        "limpieza de casas cerca de mí",
        "servicio de limpieza The Woodlands",
        "limpieza de casas Klein TX",
        "house cleaning Spring TX",
      ],
    ),
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: LANG_META[lang].ogLocale,
      alternateLocale: LANGS.filter((l) => l !== lang).map((l) => LANG_META[l].ogLocale),
      url: localizePath(lang, "/"),
      images: [{ url: lang === "es" ? "/og-es.jpg" : "/og.jpg", width: 1200, height: 630, alt: `${SITE.name} — ${COPY[lang].slogan}` }],
    },
    twitter: { card: "summary_large_image", images: [lang === "es" ? "/og-es.jpg" : "/og.jpg"] },
    alternates: {
      canonical: localizePath(lang, "/"),
      languages: { en: "/", es: "/es", "x-default": "/" },
    },
    formatDetection: { telephone: false },
    verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = pick(lang);

  const [settings, enabled] = await Promise.all([getSettings(), getEnabledServices()]);
  const sameAs = Object.values(settings.social).filter((v): v is string => !!v);
  const enabledIds = new Set(enabled.map((s) => s.id));
  const mainServices = SERVICE_PAGES.filter((p) => enabledIds.has(p.serviceId)).map((p) => servicePage(lang, p).navLabel);

  return (
    <html lang={LANG_META[lang].htmlLang} className={fontVariables}>
      <body className="min-h-dvh antialiased">
        <LangProvider lang={lang}>
          <a
            href="#main"
            className="sr-only z-[100] rounded-full bg-plum-700 px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          >
            {t("Skip to content", "Saltar al contenido")}
          </a>
          <JsonLd data={localBusinessSchema({ sameAs, services: mainServices, lang })} />
          <LangSuggest />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <MobileActionBar />
          <Analytics />
        </LangProvider>
      </body>
    </html>
  );
}
