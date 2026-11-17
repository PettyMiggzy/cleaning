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
import { getFormServiceGroups } from "@/lib/form-services";
import { SERVICE_PAGES } from "@/lib/service-pages";
import { COPY, SITE } from "@/lib/site";
import { category, faqByEnglishQuestion, servicePage, serviceText } from "@/i18n/content";
import { getI18n } from "@/i18n/server";

export default async function HomePage() {
  const { lang, t, href } = await getI18n();
  const [enabled, groups, formGroups, reviews, gallery, settings] = await Promise.all([
    getEnabledServices(),
    getEnabledByCategory(),
    getFormServiceGroups(),
    getPublishedReviews(),
    getPublishedGallery(),
    getSettings(),
  ]);
  const enabledIds = new Set(enabled.map((s) => s.id));
  const featured = SERVICE_PAGES.filter((p) => enabledIds.has(p.serviceId)).map((p) => servicePage(lang, p));
  const marquee = enabled.slice(0, 24).map((s) => serviceText(lang, s).name);
  const copy = COPY[lang];

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
              <Icon name="mapPin" className="size-4" /> {t("Spring, TX · Residential · Commercial · Move-Outs", "Spring, TX · Residencial · Comercial · Mudanzas")}
            </p>
            <h1 className="display animate-rise delay-1 mt-6">
              {t(
                <>
                  Professional House Cleaning &amp; Maid Services in <span className="text-gradient italic">Spring, TX</span>
                </>,
                <>
                  Limpieza profesional de casas y servicio doméstico en <span className="text-gradient italic">Spring, TX</span>
                </>,
              )}
            </h1>
            <p className="script animate-rise delay-2 mt-5 text-[2.6rem] text-plum-700 sm:text-5xl">{copy.slogan}</p>
            <p className="lead animate-rise delay-3 mt-5 max-w-2xl">
              {copy.description} {copy.goal}
            </p>
            <PrimaryCtas className="animate-rise delay-4 mt-8" />
            <p className="animate-rise delay-4 mt-5 flex w-fit items-center gap-2.5 rounded-full border border-plum-200 bg-white/80 px-4 py-2 text-sm font-semibold text-plum-800 shadow-soft backdrop-blur">
              <Icon name="message" className="size-4 shrink-0" />
              <span>
                {t("We speak English & Spanish", "Hablamos español e inglés")} <span className="text-plum-400">·</span>{" "}
                <span className="whitespace-nowrap italic">{t("Hablamos español", "We speak English")}</span>
              </span>
            </p>
            <div className="animate-rise delay-5 mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href={SITE.phones.primary.tel} className="group flex min-h-12 items-center gap-3">
                <span className="grid size-12 place-items-center rounded-full bg-plum-100 text-plum-700 transition group-hover:bg-plum-700 group-hover:text-white">
                  <Icon name="phone" />
                </span>
                <span className="leading-tight">
                  <span className="block text-xs font-bold tracking-[0.16em] text-plum-700 uppercase">{t("Call or Text", "Llame o envíe texto")}</span>
                  <span className="block font-serif text-2xl font-semibold text-ink">{SITE.phones.primary.display}</span>
                </span>
              </a>
              <span className="hidden h-10 w-px bg-silver-200 sm:block" />
              <span className="leading-tight">
                <span className="block text-xs font-bold tracking-[0.16em] text-muted uppercase">{t("Secondary", "Secundario")}</span>
                <span className="flex items-center gap-2">
                  <a href={SITE.phones.secondary.tel} className="inline-flex min-h-11 items-center font-serif text-xl font-semibold text-ink hover:text-plum-700">
                    {SITE.phones.secondary.display}
                  </a>
                  <a href={SITE.phones.secondary.sms} className="inline-flex min-h-10 items-center rounded-full bg-plum-100 px-4 text-sm font-bold text-plum-800">
                    {t("Text", "Texto")}
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
                  alt={t("Two smiling Emili's Cleaning Co. cleaners in white and purple uniforms in a bright, spotless living room", "Dos profesionales sonrientes de Emili's Cleaning Co. con uniformes blancos y morados en una sala luminosa e impecable")}
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
                  alt={t(`${SITE.name} logo`, `Logotipo de ${SITE.name}`)}
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
                <span className="block font-bold text-ink">{t("Free Photo Estimates", "Estimados gratis con fotos")}</span>
                <span className="text-muted">{t("Send pictures, get a time & price", "Envíe fotos y reciba tiempo y precio")}</span>
              </span>
            </div>
            <div className="silver-ring card absolute -right-2 bottom-16 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-lift backdrop-blur lg:-right-6">
              <span className="text-sm leading-tight">
                <span className="block text-xs font-bold tracking-[0.14em] text-plum-700 uppercase">{t("2 Cleaners", "2 profesionales")}</span>
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
            eyebrow={t("Our Cleaning Services", "Nuestros servicios de limpieza")}
            title={t(
              <>
                Spotless spaces, <span className="text-gradient italic">beautifully</span> cared for
              </>,
              <>
                Espacios impecables, <span className="text-gradient italic">cuidados con esmero</span>
              </>,
            )}
            lead={t(
              "From weekly maid service to top-to-bottom deep cleans, move-outs and offices — choose the service that fits your space.",
              "Desde servicio doméstico semanal hasta limpiezas profundas, mudanzas y oficinas — elija el servicio que se adapte a su espacio.",
            )}
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <Link
                key={p.slug}
                href={href(`/services/${p.slug}`)}
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
                    {p.pricingMode === "custom"
                      ? t("Custom estimate", "Estimado personalizado")
                      : p.pricingMode === "deep"
                        ? t("Hourly + 25–30%", "Por hora + 25–30%")
                        : t("From $100/hr per crew", "Desde $100/hr por equipo")}
                  </p>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-plum-100 text-plum-700 transition group-hover:bg-plum-700 group-hover:text-white">
                    <Icon name="arrowRight" className="size-5" />
                  </span>
                </div>
              </Link>
            ))}
            <Link
              href={href("/services")}
              className="card card-hover reveal bg-plum-luxe group flex flex-col justify-between p-7 text-white shadow-lift"
              style={{ borderRadius: "1.75rem" }}
            >
              <div>
                <Sparkle className="size-6 text-plum-300" />
                <h3 className="mt-5 font-serif text-3xl text-white">{t("All Cleaning Services", "Todos los servicios de limpieza")}</h3>
                <p className="mt-3 text-plum-100">
                  {t(
                    `Explore ${enabled.length} services across ${groups.length} categories — kitchens, bathrooms, rentals, offices and more.`,
                    `Explore ${enabled.length} servicios en ${groups.length} categorías — cocinas, baños, rentas, oficinas y más.`,
                  )}
                </p>
              </div>
              <ul className="mt-6 flex flex-wrap gap-2">
                {groups.map((g) => (
                  <li key={g.category.id} className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-plum-100">
                    {category(lang, g.category).shortName}
                  </li>
                ))}
              </ul>
              <span className="mt-8 inline-flex items-center gap-2 font-bold">
                {t("View all services", "Ver todos los servicios")} <Icon name="arrowRight" className="size-5 transition group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────── Photo estimate ───────────── */}
      <section className="section relative overflow-hidden bg-white" id="photo-estimate">
        <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Eyebrow>{t("Free Photo Estimates", "Estimados gratis con fotos")}</Eyebrow>
            <h2 className="h2 mt-4">
              {t(
                <>
                  Send Us Pictures &amp; Get a <span className="text-gradient italic">Free Cleaning Time Estimate!</span>
                </>,
                <>
                  Envíenos fotos y reciba un <span className="text-gradient italic">estimado gratis del tiempo de limpieza</span>
                </>,
              )}
            </h2>
            <p className="lead mt-5">
              {t(
                "Not sure how many hours your cleaning will take? Simply send us pictures of the rooms or areas you need cleaned.",
                "¿No está seguro de cuántas horas tomará su limpieza? Simplemente envíenos fotos de los cuartos o áreas que necesita limpiar.",
              )}
            </p>
            <p className="mt-4 text-ink-soft">
              {t(
                "Our team will review the photos, recommend the appropriate cleaning crew, estimate how long the job will take, and provide an estimated price before scheduling.",
                "Nuestro equipo revisará las fotos, recomendará el equipo de limpieza adecuado, calculará cuánto tiempo tomará el trabajo y le dará un precio estimado antes de programar.",
              )}
            </p>
            <ol className="mt-8 space-y-5">
              {[
                ["camera", t("Snap a few photos", "Tome unas cuantas fotos"), t("Wide shots of each room or area you'd like cleaned.", "Fotos amplias de cada cuarto o área que desea limpiar.")],
                ["send", t("Send them to us", "Envíenoslas"), t("Upload them here or text them to either of our numbers.", "Súbalas aquí o envíelas por texto a cualquiera de nuestros números.")],
                ["clipboard", t("Get your estimate", "Reciba su estimado"), t("We'll recommend a crew, estimate the time and price.", "Le recomendaremos un equipo y calcularemos el tiempo y el precio.")],
              ].map(([icon, ttl, d], i) => (
                <li key={ttl} className="flex gap-4">
                  <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-plum-500 to-plum-800 text-white shadow-glow">
                    <Icon name={icon as "camera"} className="size-5" />
                    <span className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-white text-xs font-bold text-plum-700 shadow">
                      {i + 1}
                    </span>
                  </span>
                  <span>
                    <span className="block font-bold text-ink">{ttl}</span>
                    <span className="block text-[0.97rem] text-muted">{d}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="silver-ring card mt-9 bg-plum-50/70 p-5" style={{ ["--ring-fill" as string]: "#faf6fd" }}>
              <p className="text-xs font-bold tracking-[0.18em] text-plum-700 uppercase">{t("Or text pictures directly", "O envíe las fotos directamente por texto")}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {[SITE.phones.primary, SITE.phones.secondary].map((p, i) => (
                  <a key={p.e164} href={p.sms} className="btn btn-outline w-full justify-between !px-5">
                    <span className="text-left leading-tight">
                      <span className="block text-[0.65rem] tracking-[0.14em] text-muted uppercase">{i ? t("Secondary", "Secundario") : t("Primary", "Principal")}</span>
                      {p.display}
                    </span>
                    <Icon name="message" className="size-5 text-plum-700" />
                  </a>
                ))}
              </div>
              <p className="mt-4 text-sm text-muted">
                {t("Completion times and pricing are estimates until reviewed and approved.", "Los tiempos de realización y los precios son estimados hasta que se revisen y aprueben.")}
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
            eyebrow={t("Transparent Hourly Rates", "Tarifas por hora transparentes")}
            title={t(
              <>
                Simple, honest pricing <span className="text-gradient italic">for the whole crew</span>
              </>,
              <>
                Precios simples y honestos <span className="text-gradient italic">para todo el equipo</span>
              </>,
            )}
            lead={t(
              "The hourly rate covers the entire crew — not each individual cleaner. A 2-hour minimum applies to all bookings.",
              "La tarifa por hora cubre a todo el equipo — no a cada profesional por separado. Todas las reservaciones tienen un mínimo de 2 horas.",
            )}
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
              <Link href={href("/pricing")} className="btn btn-outline w-full">
                {t("See full pricing details", "Ver todos los detalles de precios")} <Icon name="arrowRight" className="size-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── How it works ───────────── */}
      <section className="section bg-white">
        <div className="container-x">
          <SectionHeading eyebrow={t("How It Works", "Cómo funciona")} title={t("Booking a cleaning is easy", "Reservar una limpieza es fácil")} />
          <div className="relative mt-14 grid gap-6 md:grid-cols-3">
            <div className="divider-silver absolute top-10 right-[16%] left-[16%] hidden md:block" />
            {[
              ["calendar", t("Request your cleaning", "Solicite su limpieza"), t("Book online, send pictures for an estimate, or simply call or text us.", "Reserve en línea, envíe fotos para un estimado, o simplemente llámenos o envíenos un texto.")],
              ["checkCircle", t("We confirm the details", "Confirmamos los detalles"), t("We'll confirm your crew, date, arrival time and estimated price with you.", "Confirmaremos con usted el equipo, la fecha, la hora de llegada y el precio estimado.")],
              ["heart", t("Relax & enjoy", "Relájese y disfrute"), t("Our crew arrives and gets to work — you come home to a fresh, happy space.", "Nuestro equipo llega y se pone manos a la obra — usted regresa a un hogar fresco y feliz.")],
            ].map(([icon, ttl, d], i) => (
              <div key={ttl} className="reveal relative text-center">
                <span className="silver-ring card relative mx-auto grid size-20 place-items-center rounded-full bg-white text-plum-700 shadow-lift">
                  <Icon name={icon as "calendar"} className="size-8" />
                  <span className="absolute -top-1 -right-1 grid size-7 place-items-center rounded-full bg-plum-700 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                </span>
                <h3 className="mt-6 font-serif text-2xl">{ttl}</h3>
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
                  alt={t("Cleaning team in white and purple uniforms outside a beautiful Texas home", "Equipo de limpieza con uniformes blancos y morados frente a una hermosa casa de Texas")}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="silver-ring card absolute -right-3 -bottom-10 w-44 overflow-hidden rounded-3xl bg-white p-2 shadow-lift sm:-right-10 sm:w-52">
              <div className="relative aspect-square overflow-hidden rounded-2xl">
                <Image src="/brand/emili.jpg" alt={t("Emili, founder of Emili's Cleaning Co.", "Emili, fundadora de Emili's Cleaning Co.")} fill sizes="208px" className="object-cover" />
              </div>
              <p className="px-2 pt-2 pb-1 text-center font-script text-3xl text-plum-700">Emili</p>
            </div>
          </div>
          <div className="reveal">
            <Eyebrow>{t("Why Families Choose Us", "Por qué las familias nos eligen")}</Eyebrow>
            <h2 className="h2 mt-4">
              {t(
                <>
                  Dependable cleaning with a <span className="text-gradient italic">personal touch</span>
                </>,
                <>
                  Limpieza confiable con un <span className="text-gradient italic">toque personal</span>
                </>,
              )}
            </h2>
            <p className="lead mt-5">
              {t(
                "Emili's Cleaning Co. is a Spring, Texas cleaning company built on a simple promise: dependable service, transparent pricing and a home you're happy to come back to.",
                "Emili's Cleaning Co. es una empresa de limpieza de Spring, Texas construida sobre una promesa sencilla: servicio confiable, precios transparentes y un hogar al que da gusto regresar.",
              )}
            </p>
            <CheckList
              className="mt-7"
              items={t(
                [
                  "Up-front hourly pricing for the entire crew",
                  "2, 3 or 4-person crews to fit any home or business",
                  "Flexible one-time, weekly, biweekly & monthly scheduling",
                  "Free time estimates from your photos",
                  "Easy to reach — call or text either of our two lines",
                  "We speak English & Spanish — hablamos español",
                ],
                [
                  "Precios por hora claros desde el inicio para todo el equipo",
                  "Equipos de 2, 3 o 4 personas para cualquier casa o negocio",
                  "Horarios flexibles: una sola vez, semanal, quincenal o mensual",
                  "Estimados de tiempo gratis a partir de sus fotos",
                  "Fácil de contactar — llame o envíe texto a cualquiera de nuestras dos líneas",
                  "Hablamos español e inglés",
                ],
              )}
            />
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={href("/about")} className="btn btn-primary">
                {t("About Emili's Cleaning Co.", "Conozca Emili's Cleaning Co.")} <Icon name="arrowRight" className="size-5" />
              </Link>
              <Link href={href("/reviews")} className="btn btn-outline">
                {t("Read Reviews", "Ver reseñas")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Service areas ───────────── */}
      <section className="section bg-white">
        <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div className="reveal">
            <Eyebrow>{t("Service Areas", "Zonas de servicio")}</Eyebrow>
            <h2 className="h2 mt-4">
              {t(
                <>
                  Proudly serving Spring &amp; <span className="text-gradient italic">surrounding communities</span>
                </>,
                <>
                  Con orgullo atendemos Spring y <span className="text-gradient italic">las comunidades cercanas</span>
                </>,
              )}
            </h2>
            <p className="lead mt-5">
              {t(
                "Based in Spring, Texas, our crews clean homes and businesses across the north Houston area.",
                "Con base en Spring, Texas, nuestros equipos limpian casas y negocios en toda el área norte de Houston.",
              )}
            </p>
            <ul className="mt-8 grid grid-cols-2 gap-3">
              {AREAS.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={href(`/service-areas/${a.slug}`)}
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
            eyebrow={t("Customer Reviews", "Reseñas de clientes")}
            title={t(
              <>
                Kind words from <span className="text-gradient italic">happy clients</span>
              </>,
              <>
                Palabras amables de <span className="text-gradient italic">clientes felices</span>
              </>,
            )}
          />
          <div className="mt-12">
            <GoogleReviews reviews={reviews} googleReviewUrl={settings.googleReviewUrl} limit={6} />
          </div>
          {reviews.length > 6 && (
            <div className="mt-10 text-center">
              <Link href={href("/reviews")} className="btn btn-outline">
                {t("Read all reviews", "Leer todas las reseñas")} <Icon name="arrowRight" className="size-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ───────────── Gallery ───────────── */}
      {gallery.length > 0 && (
        <section className="section bg-white">
          <div className="container-x">
            <SectionHeading eyebrow={t("Before & After", "Antes y después")} title={t("Real results from real jobs", "Resultados reales de trabajos reales")} />
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {gallery.slice(0, 3).map((g) => (
                <figure key={g.id} className="silver-ring card reveal bg-white p-3 shadow-soft" style={{ borderRadius: "1.75rem" }}>
                  <BeforeAfter before={g.before} after={g.after} alt={(lang === "es" && g.titleEs) || g.title} />
                  <figcaption className="px-2 pt-4 pb-2">
                    <p className="font-serif text-xl text-ink">{(lang === "es" && g.titleEs) || g.title}</p>
                    <p className="text-sm text-muted">{[g.service, g.location].filter(Boolean).join(" · ")}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href={href("/gallery")} className="btn btn-outline">
                {t("View the full gallery", "Ver la galería completa")} <Icon name="arrowRight" className="size-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ───────────── FAQ ───────────── */}
      <section className="section bg-white">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>{t("FAQ", "Preguntas frecuentes")}</Eyebrow>
            <h2 className="h2 mt-4">{t("Questions? We've got answers.", "¿Preguntas? Tenemos respuestas.")}</h2>
            <p className="lead mt-5">{t("Everything you need to know about pricing, booking and estimates.", "Todo lo que necesita saber sobre precios, reservaciones y estimados.")}</p>
            <Link href={href("/faq")} className="btn btn-outline mt-8">
              {t("View all FAQs", "Ver todas las preguntas")} <Icon name="arrowRight" className="size-5" />
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
              .map((q) => faqByEnglishQuestion(lang, q))
              .filter((f): f is NonNullable<typeof f> => !!f)}
          />
        </div>
      </section>

      <CTASection />
    </>
  );
}
