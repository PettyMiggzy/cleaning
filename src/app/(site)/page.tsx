import Image from "next/image";
import Link from "next/link";
import { EstimateForm } from "@/components/forms/EstimateForm";
import { Icon, Sparkle } from "@/components/Icon";
import { PriceCalculator } from "@/components/PriceCalculator";
import { GoogleReviews } from "@/components/GoogleReviews";
import { AdditionalPricing, CTASection, FaqList, PricingCards, TrustStrip } from "@/components/sections";
import { ServiceAreaMap } from "@/components/ServiceAreaMap";
import { BeforeAfter } from "@/components/BeforeAfter";
import { CheckList, Eyebrow, PrimaryCtas, SectionHeading } from "@/components/ui";
import { AREAS } from "@/lib/areas";
import { getEnabledByCategory, getEnabledServices, getPublishedGallery, getPublishedReviews, getSettings } from "@/lib/data";
import { ALL_FAQS } from "@/lib/faqs";
import { getFormServiceGroups } from "@/lib/form-services";
import { SERVICE_PAGES } from "@/lib/service-pages";
import { SITE } from "@/lib/site";

export default async function HomePage() {
  const [enabled, groups, formGroups, reviews, gallery, settings] = await Promise.all([
    getEnabledServices(),
    getEnabledByCategory(),
    getFormServiceGroups(),
    getPublishedReviews(),
    getPublishedGallery(),
    getSettings(),
  ]);
  const enabledIds = new Set(enabled.map((s) => s.id));
  const featured = SERVICE_PAGES.filter((p) => enabledIds.has(p.serviceId));
  const marquee = enabled.slice(0, 24).map((s) => s.name);

  return (
    <>
      {/* ───────────── Hero ───────────── */}
      <section className="relative overflow-hidden bg-white">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(48rem 32rem at 85% 10%, rgba(210,178,241,.45), transparent 60%), radial-gradient(40rem 26rem at 0% 100%, rgba(244,236,252,.9), transparent 60%)",
          }}
        />
        <Sparkle className="animate-twinkle absolute top-24 left-[46%] hidden size-5 text-plum-300 lg:block" />
        <Sparkle className="animate-twinkle absolute bottom-24 left-[4%] size-4 text-plum-300 [animation-delay:1.1s]" />
        <div className="container-x relative grid items-center gap-14 pt-10 pb-20 md:pt-14 lg:grid-cols-[1.08fr_1fr] lg:gap-10 lg:pb-28">
          <div>
            <p className="chip animate-rise">
              <Icon name="mapPin" className="size-4" /> Spring, TX · Residential · Commercial · Move-Outs
            </p>
            <h1 className="display animate-rise delay-1 mt-6">
              Professional House Cleaning &amp; Maid Services in <span className="text-gradient italic">Spring, TX</span>
            </h1>
            <p className="script animate-rise delay-2 mt-5 text-[2.6rem] text-plum-700 sm:text-5xl">{SITE.slogan}</p>
            <p className="lead animate-rise delay-3 mt-5 max-w-2xl">
              {SITE.description} {SITE.goal}
            </p>
            <PrimaryCtas className="animate-rise delay-4 mt-8" />
            <p className="animate-rise delay-4 mt-5 flex w-fit items-center gap-2.5 rounded-full border border-plum-200 bg-white/80 px-4 py-2 text-sm font-semibold text-plum-800 shadow-soft backdrop-blur">
              <Icon name="message" className="size-4 shrink-0" />
              <span>
                We speak English &amp; Spanish <span className="text-plum-400">·</span> <span className="whitespace-nowrap italic">Hablamos español</span>
              </span>
            </p>
            <div className="animate-rise delay-5 mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href={SITE.phones.primary.tel} className="group flex min-h-12 items-center gap-3">
                <span className="grid size-12 place-items-center rounded-full bg-plum-100 text-plum-700 transition group-hover:bg-plum-700 group-hover:text-white">
                  <Icon name="phone" />
                </span>
                <span className="leading-tight">
                  <span className="block text-xs font-bold tracking-[0.16em] text-plum-700 uppercase">Call or Text</span>
                  <span className="block font-serif text-2xl font-semibold text-ink">{SITE.phones.primary.display}</span>
                </span>
              </a>
              <span className="hidden h-10 w-px bg-silver-200 sm:block" />
              <span className="leading-tight">
                <span className="block text-xs font-bold tracking-[0.16em] text-muted uppercase">Secondary</span>
                <span className="flex items-center gap-2">
                  <a href={SITE.phones.secondary.tel} className="inline-flex min-h-11 items-center font-serif text-xl font-semibold text-ink hover:text-plum-700">
                    {SITE.phones.secondary.display}
                  </a>
                  <a href={SITE.phones.secondary.sms} className="inline-flex min-h-10 items-center rounded-full bg-plum-100 px-4 text-sm font-bold text-plum-800">
                    Text
                  </a>
                </span>
              </span>
            </div>
          </div>

          <div className="animate-rise delay-2 relative mx-auto w-full max-w-[34rem]">
            <div className="silver-frame arch">
              <div className="arch relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/images/house-cleaning-team-spring-tx.webp"
                  alt="Two smiling Emili's Cleaning Co. cleaners in white and purple uniforms in a bright, spotless living room"
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(min-width: 1024px) 34rem, 92vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="animate-float absolute -bottom-8 -left-2 sm:-left-10">
              <div className="rounded-full p-[3px] shadow-lift" style={{ background: "linear-gradient(140deg,#fbfbfc,#bfc3cb 30%,#fff 50%,#9ea3ad 75%,#eceef2)" }}>
                <Image
                  src="/brand/emilis-cleaning-co-logo.webp"
                  alt={`${SITE.name} logo`}
                  width={300}
                  height={300}
                  className="size-32 rounded-full sm:size-40"
                  priority
                />
              </div>
            </div>
            <div className="silver-ring card absolute top-10 -right-2 hidden items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-lift backdrop-blur sm:flex lg:-right-8">
              <span className="grid size-10 place-items-center rounded-full bg-plum-100 text-plum-700">
                <Icon name="camera" className="size-5" />
              </span>
              <span className="text-sm leading-tight">
                <span className="block font-bold text-ink">Free Photo Estimates</span>
                <span className="text-muted">Send pictures, get a time & price</span>
              </span>
            </div>
            <div className="silver-ring card absolute -right-2 bottom-16 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-lift backdrop-blur lg:-right-6">
              <span className="text-sm leading-tight">
                <span className="block text-xs font-bold tracking-[0.14em] text-plum-700 uppercase">2 Cleaners</span>
                <span className="font-serif text-2xl font-semibold text-ink">$100</span>
                <span className="text-muted">/hr</span>
              </span>
            </div>
            <Sparkle className="animate-twinkle absolute -top-3 left-10 size-7 text-plum-400" />
          </div>
        </div>

        {/* Marquee */}
        <div className="relative border-y border-silver-100 bg-plum-50/60 py-4">
          <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
            <div className="animate-marquee flex shrink-0 items-center gap-8 pr-8">
              {[...marquee, ...marquee].map((s, i) => (
                <span key={i} className="flex items-center gap-8 font-serif text-xl whitespace-nowrap text-ink/80 italic">
                  {s}
                  <Sparkle className="size-3 text-plum-400" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Trust ───────────── */}
      <section className="py-14">
        <div className="container-x">
          <TrustStrip />
        </div>
      </section>

      {/* ───────────── Services ───────────── */}
      <section className="section bg-lavender" id="services">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our Cleaning Services"
            title={
              <>
                Spotless spaces, <span className="text-gradient italic">beautifully</span> cared for
              </>
            }
            lead="From weekly maid service to top-to-bottom deep cleans, move-outs and offices — choose the service that fits your space."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <Link
                key={p.slug}
                href={`/services/${p.slug}`}
                className={`card card-hover reveal group relative flex flex-col overflow-hidden bg-white shadow-soft ${
                  i === 0 ? "lg:col-span-2 lg:row-span-1" : ""
                }`}
                style={{ borderRadius: "1.75rem" }}
              >
                <div className={`relative flex-1 overflow-hidden ${i === 0 ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
                  <Image
                    src={p.image}
                    alt={p.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-lux)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-plum-950/70 via-plum-950/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="text-xs font-bold tracking-[0.18em] text-plum-200 uppercase">{p.kicker}</p>
                    <h3 className="mt-1 font-serif text-2xl text-white sm:text-[1.7rem]">{p.navLabel}</h3>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 p-5">
                  <p className="text-[0.95rem] text-muted">
                    {p.pricingMode === "custom" ? "Custom estimate" : p.pricingMode === "deep" ? "Hourly + 25–30%" : "From $100/hr per crew"}
                  </p>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-plum-100 text-plum-700 transition group-hover:bg-plum-700 group-hover:text-white">
                    <Icon name="arrowRight" className="size-5" />
                  </span>
                </div>
              </Link>
            ))}
            <Link
              href="/services"
              className="card card-hover reveal bg-plum-luxe group flex flex-col justify-between p-7 text-white shadow-lift"
              style={{ borderRadius: "1.75rem" }}
            >
              <div>
                <Sparkle className="size-6 text-plum-300" />
                <h3 className="mt-5 font-serif text-3xl text-white">All Cleaning Services</h3>
                <p className="mt-3 text-plum-100">
                  Explore {enabled.length} services across {groups.length} categories — kitchens, bathrooms, rentals, offices and
                  more.
                </p>
              </div>
              <ul className="mt-6 flex flex-wrap gap-2">
                {groups.map((g) => (
                  <li key={g.category.id} className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-plum-100">
                    {g.category.shortName}
                  </li>
                ))}
              </ul>
              <span className="mt-8 inline-flex items-center gap-2 font-bold">
                View all services <Icon name="arrowRight" className="size-5 transition group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────── Photo estimate ───────────── */}
      <section className="section relative overflow-hidden bg-white" id="photo-estimate">
        <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Eyebrow>Free Photo Estimates</Eyebrow>
            <h2 className="h2 mt-4">
              Send Us Pictures &amp; Get a <span className="text-gradient italic">Free Cleaning Time Estimate!</span>
            </h2>
            <p className="lead mt-5">
              Not sure how many hours your cleaning will take? Simply send us pictures of the rooms or areas you need cleaned.
            </p>
            <p className="mt-4 text-ink-soft">
              Our team will review the photos, recommend the appropriate cleaning crew, estimate how long the job will take, and
              provide an estimated price before scheduling.
            </p>
            <ol className="mt-8 space-y-5">
              {[
                ["camera", "Snap a few photos", "Wide shots of each room or area you'd like cleaned."],
                ["send", "Send them to us", "Upload them here or text them to either of our numbers."],
                ["clipboard", "Get your estimate", "We'll recommend a crew, estimate the time and price."],
              ].map(([icon, t, d], i) => (
                <li key={t} className="flex gap-4">
                  <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-plum-500 to-plum-800 text-white shadow-glow">
                    <Icon name={icon as "camera"} className="size-5" />
                    <span className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-white text-xs font-bold text-plum-700 shadow">
                      {i + 1}
                    </span>
                  </span>
                  <span>
                    <span className="block font-bold text-ink">{t}</span>
                    <span className="block text-[0.97rem] text-muted">{d}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="silver-ring card mt-9 bg-plum-50/70 p-5" style={{ ["--ring-fill" as string]: "#faf6fd" }}>
              <p className="text-xs font-bold tracking-[0.18em] text-plum-700 uppercase">Or text pictures directly</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {[SITE.phones.primary, SITE.phones.secondary].map((p, i) => (
                  <a key={p.e164} href={p.sms} className="btn btn-outline w-full justify-between !px-5">
                    <span className="text-left leading-tight">
                      <span className="block text-[0.65rem] tracking-[0.14em] text-muted uppercase">{i ? "Secondary" : "Primary"}</span>
                      {p.display}
                    </span>
                    <Icon name="message" className="size-5 text-plum-700" />
                  </a>
                ))}
              </div>
              <p className="mt-4 text-sm text-muted">
                Completion times and pricing are estimates until reviewed and approved.
              </p>
            </div>
          </div>
          <div className="reveal">
            <EstimateForm groups={formGroups} compact />
          </div>
        </div>
      </section>

      {/* ───────────── Pricing ───────────── */}
      <section className="section bg-lavender" id="pricing">
        <div className="container-x">
          <SectionHeading
            eyebrow="Transparent Hourly Rates"
            title={
              <>
                Simple, honest pricing <span className="text-gradient italic">for the whole crew</span>
              </>
            }
            lead="The hourly rate covers the entire crew — not each individual cleaner. A 2-hour minimum applies to all bookings."
          />
          <div className="mt-14">
            <PricingCards />
          </div>
          <div className="mt-14 grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
            <div className="reveal">
              <PriceCalculator />
            </div>
            <div className="reveal space-y-6">
              <AdditionalPricing />
              <Link href="/pricing" className="btn btn-outline w-full">
                See full pricing details <Icon name="arrowRight" className="size-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── How it works ───────────── */}
      <section className="section bg-white">
        <div className="container-x">
          <SectionHeading eyebrow="How It Works" title="Booking a cleaning is easy" />
          <div className="relative mt-14 grid gap-6 md:grid-cols-3">
            <div className="divider-silver absolute top-10 right-[16%] left-[16%] hidden md:block" />
            {[
              ["calendar", "Request your cleaning", "Book online, send pictures for an estimate, or simply call or text us."],
              ["checkCircle", "We confirm the details", "We'll confirm your crew, date, arrival time and estimated price with you."],
              ["heart", "Relax & enjoy", "Our crew arrives and gets to work — you come home to a fresh, happy space."],
            ].map(([icon, t, d], i) => (
              <div key={t} className="reveal relative text-center">
                <span className="silver-ring card relative mx-auto grid size-20 place-items-center rounded-full bg-white text-plum-700 shadow-lift">
                  <Icon name={icon as "calendar"} className="size-8" />
                  <span className="absolute -top-1 -right-1 grid size-7 place-items-center rounded-full bg-plum-700 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                </span>
                <h3 className="mt-6 font-serif text-2xl">{t}</h3>
                <p className="mx-auto mt-2 max-w-xs text-ink-soft">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── About teaser ───────────── */}
      <section className="section bg-lavender overflow-hidden">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <div className="reveal relative mx-auto w-full max-w-lg">
            <div className="silver-frame rounded-[2.5rem]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2.1rem]">
                <Image
                  src="/images/emilis-cleaning-team.webp"
                  alt="Cleaning team in white and purple uniforms outside a beautiful Texas home"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="silver-ring card absolute -right-3 -bottom-10 w-44 overflow-hidden rounded-3xl bg-white p-2 shadow-lift sm:-right-10 sm:w-52">
              <div className="relative aspect-square overflow-hidden rounded-2xl">
                <Image src="/brand/emili.jpg" alt="Emili, founder of Emili's Cleaning Co." fill sizes="208px" className="object-cover" />
              </div>
              <p className="px-2 pt-2 pb-1 text-center font-script text-3xl text-plum-700">Emili</p>
            </div>
          </div>
          <div className="reveal">
            <Eyebrow>Why Families Choose Us</Eyebrow>
            <h2 className="h2 mt-4">
              Dependable cleaning with a <span className="text-gradient italic">personal touch</span>
            </h2>
            <p className="lead mt-5">
              Emili&apos;s Cleaning Co. is a Spring, Texas cleaning company built on a simple promise: dependable service,
              transparent pricing and a home you&apos;re happy to come back to.
            </p>
            <CheckList
              className="mt-7"
              items={[
                "Up-front hourly pricing for the entire crew",
                "2, 3 or 4-person crews to fit any home or business",
                "Flexible one-time, weekly, biweekly & monthly scheduling",
                "Free time estimates from your photos",
                "Easy to reach — call or text either of our two lines",
                "We speak English & Spanish — hablamos español",
              ]}
            />
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/about" className="btn btn-primary">
                About Emili&apos;s Cleaning Co. <Icon name="arrowRight" className="size-5" />
              </Link>
              <Link href="/reviews" className="btn btn-outline">
                Read Reviews
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Service areas ───────────── */}
      <section className="section bg-white">
        <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div className="reveal">
            <Eyebrow>Service Areas</Eyebrow>
            <h2 className="h2 mt-4">
              Proudly serving Spring &amp; <span className="text-gradient italic">surrounding communities</span>
            </h2>
            <p className="lead mt-5">
              Based in Spring, Texas, our crews clean homes and businesses across the north Houston area.
            </p>
            <ul className="mt-8 grid grid-cols-2 gap-3">
              {AREAS.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/service-areas/${a.slug}`}
                    className="silver-ring card card-hover flex items-center justify-between gap-2 rounded-2xl px-4 py-3.5 font-semibold text-ink shadow-soft hover:text-plum-700"
                  >
                    <span className="flex items-center gap-2">
                      <Icon name="mapPin" className="size-4 text-plum-600" />
                      {a.label}
                    </span>
                    <Icon name="chevronRight" className="size-4 text-plum-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal">
            <ServiceAreaMap />
          </div>
        </div>
      </section>

      {/* ───────────── Reviews ───────────── */}
      <section className="section bg-lavender">
        <div className="container-x">
          <SectionHeading
            eyebrow="Customer Reviews"
            title={
              <>
                Kind words from <span className="text-gradient italic">happy clients</span>
              </>
            }
          />
          <div className="mt-12">
            <GoogleReviews reviews={reviews} googleReviewUrl={settings.googleReviewUrl} limit={6} />
          </div>
          {reviews.length > 6 && (
            <div className="mt-10 text-center">
              <Link href="/reviews" className="btn btn-outline">
                Read all reviews <Icon name="arrowRight" className="size-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ───────────── Gallery ───────────── */}
      {gallery.length > 0 && (
        <section className="section bg-white">
          <div className="container-x">
            <SectionHeading eyebrow="Before & After" title="Real results from real jobs" />
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {gallery.slice(0, 3).map((g) => (
                <figure key={g.id} className="silver-ring card reveal bg-white p-3 shadow-soft" style={{ borderRadius: "1.75rem" }}>
                  <BeforeAfter before={g.before} after={g.after} alt={g.title} />
                  <figcaption className="px-2 pt-4 pb-2">
                    <p className="font-serif text-xl text-ink">{g.title}</p>
                    <p className="text-sm text-muted">{[g.service, g.location].filter(Boolean).join(" · ")}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/gallery" className="btn btn-outline">
                View the full gallery <Icon name="arrowRight" className="size-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ───────────── FAQ ───────────── */}
      <section className="section bg-white">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="h2 mt-4">Questions? We&apos;ve got answers.</h2>
            <p className="lead mt-5">Everything you need to know about pricing, booking and estimates.</p>
            <Link href="/faq" className="btn btn-outline mt-8">
              View all FAQs <Icon name="arrowRight" className="size-5" />
            </Link>
          </div>
          <FaqList
            items={[
              "How does your pricing work?",
              "Is there a minimum?",
              "How much does deep cleaning cost?",
              "How do I know how many hours I need?",
              "Is my appointment confirmed when I submit a booking request?",
              "Do you speak Spanish? · ¿Hablan español?",
              "What areas do you serve?",
            ]
              .map((q) => ALL_FAQS.find((f) => f.q === q))
              .filter((f): f is (typeof ALL_FAQS)[number] => !!f)}
          />
        </div>
      </section>

      <CTASection />
    </>
  );
}
