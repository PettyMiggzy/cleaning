import { AREAS } from "./areas";
import { absoluteUrl, COPY, SITE } from "./site";

/** schema.org LocalBusiness — consistent NAP info for Google. */
export function localBusinessSchema(extra: { sameAs?: string[]; services?: string[]; lang?: "en" | "es" } = {}) {
  const lang = extra.lang ?? "en";
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": absoluteUrl("/#business"),
    name: SITE.name,
    slogan: COPY[lang].slogan,
    description: `${COPY[lang].description} ${COPY[lang].goal}`,
    url: SITE.url,
    logo: absoluteUrl(SITE.logo),
    image: [absoluteUrl("/images/house-cleaning-team-spring-tx.webp"), absoluteUrl(SITE.logo)],
    telephone: SITE.phones.primary.e164,
    email: SITE.email,
    priceRange: "$$",
    knowsLanguage: ["en", "es"],
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
        availableLanguage: ["English", "Spanish"],
      },
      {
        "@type": "ContactPoint",
        telephone: SITE.phones.secondary.e164,
        contactType: "customer service",
        areaServed: "US",
        availableLanguage: ["English", "Spanish"],
      },
    ],
    ...(extra.sameAs?.length ? { sameAs: extra.sameAs } : {}),
    ...(extra.services?.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: lang === "es" ? "Servicios de limpieza" : "Cleaning Services",
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

export function serviceSchema(opts: { name: string; description: string; path: string; areas?: string[]; lang?: "en" | "es" }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    serviceType: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    inLanguage: opts.lang === "es" ? "es-US" : "en-US",
    provider: { "@id": absoluteUrl("/#business") },
    areaServed: (opts.areas ?? AREAS.map((a) => a.label)).map((name) => ({ "@type": "City", name })),
  };
}
