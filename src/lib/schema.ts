import { AREAS } from "./areas";
import { absoluteUrl, SITE } from "./site";

/** schema.org LocalBusiness — consistent NAP info for Google. */
export function localBusinessSchema(extra: { sameAs?: string[]; services?: string[] } = {}) {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": absoluteUrl("/#business"),
    name: SITE.name,
    slogan: SITE.slogan,
    description: `${SITE.description} ${SITE.goal}`,
    url: SITE.url,
    logo: absoluteUrl(SITE.logo),
    image: [absoluteUrl("/images/house-cleaning-team-spring-tx.webp"), absoluteUrl(SITE.logo)],
    telephone: SITE.phones.primary.e164,
    email: SITE.email,
    priceRange: "$$",
    currenciesAccepted: "USD",
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.city,
      addressRegion: SITE.state,
      addressCountry: SITE.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    areaServed: AREAS.map((a) => ({ "@type": "City", name: a.label })),
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: SITE.phones.primary.e164,
        contactType: "customer service",
        areaServed: "US",
      },
      {
        "@type": "ContactPoint",
        telephone: SITE.phones.secondary.e164,
        contactType: "customer service",
        areaServed: "US",
      },
    ],
    ...(extra.sameAs?.length ? { sameAs: extra.sameAs } : {}),
    ...(extra.services?.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Cleaning Services",
            itemListElement: extra.services.map((name) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name },
            })),
          },
        }
      : {}),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function serviceSchema(opts: { name: string; description: string; path: string; areas?: string[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    serviceType: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    provider: { "@id": absoluteUrl("/#business") },
    areaServed: (opts.areas ?? AREAS.map((a) => a.label)).map((name) => ({ "@type": "City", name })),
  };
}
