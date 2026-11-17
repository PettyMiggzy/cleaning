import type { Metadata, Viewport } from "next";
import { Great_Vibes, Montserrat, Playfair_Display } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { SITE } from "@/lib/site";
import "./globals.css";

const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"], display: "swap" });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], display: "swap" });
const vibes = Great_Vibes({ variable: "--font-vibes", subsets: ["latin"], weight: "400", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | House Cleaning & Maid Services in Spring, TX`,
    template: `%s | ${SITE.name}`,
  },
  description: `${SITE.description} Transparent hourly pricing, flexible scheduling and free photo estimates. Call or text ${SITE.phones.primary.display}.`,
  applicationName: SITE.name,
  keywords: [
    "house cleaning Spring TX",
    "maid service Spring TX",
    "deep cleaning Spring TX",
    "move out cleaning Spring TX",
    "apartment cleaning",
    "commercial cleaning",
    "cleaning service The Woodlands",
    "house cleaners Klein TX",
  ],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_US",
    url: "/",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${SITE.name} — ${SITE.slogan}` }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${montserrat.variable} ${playfair.variable} ${vibes.variable}`}>
      <body className="min-h-dvh antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
