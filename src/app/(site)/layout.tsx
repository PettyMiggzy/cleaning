import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { JsonLd } from "@/components/JsonLd";
import { getEnabledServices, getSettings } from "@/lib/data";
import { localBusinessSchema } from "@/lib/schema";
import { SERVICE_PAGES } from "@/lib/service-pages";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [settings, enabled] = await Promise.all([getSettings(), getEnabledServices()]);
  const sameAs = Object.values(settings.social).filter((v): v is string => !!v);
  const enabledIds = new Set(enabled.map((s) => s.id));
  const mainServices = SERVICE_PAGES.filter((p) => enabledIds.has(p.serviceId)).map((p) => p.navLabel);

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[100] rounded-full bg-plum-700 px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <JsonLd data={localBusinessSchema({ sameAs, services: mainServices })} />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <MobileActionBar />
    </>
  );
}
