import type { Metadata } from "next";
import Image from "next/image";
import { Icon, Sparkle } from "@/components/Icon";
import { CTASection, PageHero } from "@/components/sections";
import { CheckList, Eyebrow, SectionHeading } from "@/components/ui";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us — Meet Emili",
  description:
    "Emili's Cleaning Co. is a Spring, Texas cleaning company providing dependable residential and commercial cleaning with transparent pricing, flexible scheduling and easy estimates.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  { icon: "heart" as const, title: "Care in every detail", text: "We treat every home and business like it's our own — thoughtful, respectful and thorough." },
  { icon: "dollar" as const, title: "Transparent pricing", text: "Simple hourly crew rates shown up front, with free estimates from your photos." },
  { icon: "calendar" as const, title: "Flexible scheduling", text: "One-time, weekly, biweekly or monthly — we work around your life." },
  { icon: "message" as const, title: "English & Spanish", text: "Call or text either of our two lines — we speak English and Spanish. ¡Hablamos español!" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "About Us", path: "/about" }]}
        eyebrow="Our Story"
        title={
          <>
            A cleaner home, <span className="text-gradient italic">a happier you</span>
          </>
        }
        lead={`${SITE.name} is a Spring, Texas cleaning company serving homes and businesses across the north Houston area.`}
        image="/images/emilis-cleaning-team.webp"
        imageAlt="Emili's Cleaning Co. team in white and purple uniforms outside a Texas home"
      />

      <section className="section bg-white">
        <div className="container-x grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative mx-auto w-full max-w-md">
            <div className="silver-frame arch">
              <div className="arch relative aspect-[4/5] overflow-hidden">
                <Image src="/brand/emili.jpg" alt="Emili, founder of Emili's Cleaning Co." fill sizes="(min-width:1024px) 28rem, 90vw" className="object-cover" />
              </div>
            </div>
            <Sparkle className="animate-twinkle absolute -top-4 right-8 size-8 text-plum-400" />
            <div className="silver-ring card animate-float absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-2xl bg-white px-6 py-3 text-center shadow-lift">
              <p className="font-script text-4xl text-plum-700">Emili</p>
              <p className="text-xs font-bold tracking-[0.18em] text-muted uppercase">Founder</p>
            </div>
          </div>
          <div>
            <Eyebrow>Meet Emili</Eyebrow>
            <h2 className="h2 mt-4">Dependable cleaning, done with heart</h2>
            <div className="lead mt-6 space-y-5">
              <p>
                {SITE.name} was founded by Emili with a simple goal: to give families and businesses in Spring and the surrounding
                communities a cleaning service they can truly count on.
              </p>
              <p>
                {SITE.description} {SITE.goal}
              </p>
              <p>
                Whether it&apos;s a weekly refresh, a top-to-bottom deep clean, or getting a home ready for move-out day, our crews
                show up ready to make your space shine — so you can spend your time on what matters most.
              </p>
            </div>
            <p className="mt-8 font-script text-4xl text-plum-700">{SITE.slogan}</p>
          </div>
        </div>
      </section>

      <section className="section bg-lavender">
        <div className="container-x">
          <SectionHeading eyebrow="What We Stand For" title="Our promise to every client" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="silver-ring card card-hover reveal bg-white p-7 shadow-soft">
                <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-plum-500 to-plum-800 text-white shadow-glow">
                  <Icon name={v.icon} className="size-6" />
                </span>
                <h3 className="mt-5 font-serif text-xl">{v.title}</h3>
                <p className="mt-2 text-[0.97rem] text-ink-soft">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>What We Do</Eyebrow>
            <h2 className="h2 mt-4">Residential, commercial &amp; move-out cleaning</h2>
            <CheckList
              className="mt-8"
              items={[
                "House cleaning & recurring maid service",
                "Apartment, condo & townhouse cleaning",
                "Deep cleaning — baseboards, fans, cabinets, grout & more",
                "Move-in, move-out & rental turnover cleaning",
                "Office, retail, salon & common-area cleaning",
                "Free time estimates from your photos",
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ["/images/kitchen-cleaning.webp", "Kitchen being wiped down"],
              ["/images/bathroom-cleaning.webp", "Shower glass being cleaned"],
              ["/images/maid-service-bed-making.webp", "Bed being made with fresh linens"],
              ["/images/commercial-office-cleaning.webp", "Office conference table being cleaned"],
            ].map(([src, alt], i) => (
              <div key={src} className={`reveal relative aspect-square overflow-hidden rounded-[1.75rem] shadow-soft ${i % 2 ? "translate-y-8" : ""}`}>
                <Image src={src} alt={alt} fill sizes="(min-width:1024px) 22vw, 45vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
