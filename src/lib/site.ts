/**
 * Single source of truth for business details.
 * Everything on the site (header, footer, structured data, emails) reads from here,
 * so contact information stays consistent everywhere — including Google Business Profile.
 */

function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.NODE_ENV === "development") return "http://localhost:3000";
  return "https://emiliscleaningco.com";
}

export const SITE = {
  name: "Emili's Cleaning Co.",
  legalName: "Emili's Cleaning Co.",
  shortName: "Emili's Cleaning",
  slogan: "A Cleaner Home, A Happier You!",
  headline: "Professional House Cleaning & Maid Services in Spring, TX",
  description:
    "Emili's Cleaning Co. provides professional residential, apartment, commercial, deep cleaning, and move-out cleaning services throughout Spring and surrounding communities.",
  goal:
    "Our goal is to provide dependable cleaning services with transparent pricing, flexible scheduling, and easy estimates.",
  url: resolveSiteUrl(),
  email: "emiliscleaningco@gmail.com",
  /** The team speaks both languages — hablamos español. */
  languages: ["English", "Spanish"],
  city: "Spring",
  state: "TX",
  stateName: "Texas",
  country: "US",
  geo: { lat: 30.0799, lng: -95.4172 },
  logo: "/brand/emilis-cleaning-co-logo.png",
  phones: {
    primary: {
      label: "Primary Business Line",
      display: "(281) 662-9871",
      e164: "+12816629871",
      tel: "tel:+12816629871",
      sms: "sms:+12816629871",
    },
    secondary: {
      label: "Secondary Business Line",
      display: "(832) 756-8502",
      e164: "+18327568502",
      tel: "tel:+18327568502",
      sms: "sms:+18327568502",
    },
  },
} as const;

/** Brand copy per language (slogan, tagline, description). */
export const COPY = {
  en: {
    slogan: SITE.slogan,
    headline: SITE.headline,
    description: SITE.description,
    goal: SITE.goal,
  },
  es: {
    slogan: "¡Un hogar más limpio, una vida más feliz!",
    headline: "Limpieza profesional de casas y servicio de limpieza doméstica en Spring, TX",
    description:
      "Emili's Cleaning Co. ofrece servicios profesionales de limpieza residencial, de apartamentos, comercial, limpieza profunda y limpieza de mudanza en Spring y las comunidades cercanas.",
    goal: "Nuestro objetivo es ofrecer un servicio de limpieza confiable, con precios transparentes, horarios flexibles y estimados fáciles.",
  },
} as const;

export type PhoneLine = (typeof SITE.phones)[keyof typeof SITE.phones];

export const PHONE_LINES: PhoneLine[] = [SITE.phones.primary, SITE.phones.secondary];

/** Absolute URL helper for metadata / structured data. */
export function absoluteUrl(path = "/") {
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}
