import { AREAS } from "@/lib/areas";
import { getEnabledServices } from "@/lib/data";
import { SERVICE_PAGES } from "@/lib/service-pages";
import { SITE } from "@/lib/site";
import { Icon } from "../Icon";
import { HeaderNav, type NavGroup } from "./HeaderNav";

export async function Header() {
  const enabled = new Set((await getEnabledServices()).map((s) => s.id));
  const servicePages = SERVICE_PAGES.filter((p) => enabled.has(p.serviceId));

  const groups: NavGroup[] = [
    {
      label: "Services",
      href: "/services",
      links: [
        ...servicePages.map((p) => ({ href: `/services/${p.slug}`, label: p.navLabel, note: p.kicker })),
        { href: "/services", label: "All Cleaning Services", note: "Browse every service we offer", featured: true },
      ],
    },
    { label: "Pricing", href: "/pricing" },
    { label: "Photo Estimate", href: "/photo-estimate" },
    {
      label: "Service Areas",
      href: "/service-areas",
      links: [
        ...AREAS.map((a) => ({ href: `/service-areas/${a.slug}`, label: a.label })),
        { href: "/service-areas", label: "View Service Area Map", featured: true },
      ],
    },
    {
      label: "About",
      href: "/about",
      links: [
        { href: "/about", label: "About Us", note: "Meet Emili & our story" },
        { href: "/gallery", label: "Before & After Gallery", note: "Real completed cleaning jobs" },
        { href: "/reviews", label: "Customer Reviews", note: "What our clients say" },
        { href: "/faq", label: "FAQ", note: "Pricing, booking & more" },
      ],
    },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <div className="bg-plum-950 text-[0.8rem] text-plum-100">
        <div className="container-x flex h-10 items-center justify-center gap-6 md:justify-between">
          <p className="hidden items-center gap-2 md:flex">
            <Icon name="mapPin" className="size-3.5 text-plum-300" />
            Proudly serving Spring, Klein, The Woodlands &amp; nearby
            <span className="text-plum-400">·</span>
            <span className="font-semibold text-white">We speak English &amp; Spanish</span>
          </p>
          <div className="flex h-full items-center gap-2 font-semibold tracking-wide sm:gap-4">
            <a href={SITE.phones.primary.tel} className="flex h-full items-center gap-1.5 px-1 hover:text-white">
              <Icon name="phone" className="size-3.5 text-plum-300" />
              <span className="hidden sm:inline">Call or Text</span> {SITE.phones.primary.display}
            </a>
            <span className="text-plum-400" aria-hidden>
              |
            </span>
            <a href={SITE.phones.secondary.tel} className="flex h-full items-center gap-1.5 px-1 hover:text-white">
              <span className="hidden sm:inline">Secondary</span> {SITE.phones.secondary.display}
            </a>
          </div>
        </div>
      </div>
      <HeaderNav groups={groups} />
    </>
  );
}
