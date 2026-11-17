import Link from "next/link";
import { AREAS } from "@/lib/areas";
import { getEnabledServices, getSettings } from "@/lib/data";
import { SERVICE_PAGES } from "@/lib/service-pages";
import { SITE } from "@/lib/site";
import { Icon, Sparkle, type IconName } from "../Icon";
import { Logo } from "./Logo";
import { Year } from "./Year";

const SOCIAL: { key: "facebook" | "instagram" | "tiktok" | "google" | "yelp" | "nextdoor"; label: string; icon: IconName }[] = [
  { key: "facebook", label: "Facebook", icon: "facebook" },
  { key: "instagram", label: "Instagram", icon: "instagram" },
  { key: "tiktok", label: "TikTok", icon: "tiktok" },
  { key: "google", label: "Google", icon: "google" },
  { key: "yelp", label: "Yelp", icon: "star" },
  { key: "nextdoor", label: "Nextdoor", icon: "home" },
];

export async function Footer() {
  const [settings, enabledList] = await Promise.all([getSettings(), getEnabledServices()]);
  const enabled = new Set(enabledList.map((s) => s.id));
  const servicePages = SERVICE_PAGES.filter((p) => enabled.has(p.serviceId));
  const socials = SOCIAL.filter((s) => settings.social[s.key]);

  return (
    <footer className="relative overflow-hidden bg-plum-950 text-plum-100">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(40rem 20rem at 10% 0%, rgba(154,92,211,.35), transparent 60%), radial-gradient(30rem 20rem at 100% 100%, rgba(126,63,191,.3), transparent 60%)",
        }}
      />
      <div className="container-x relative pt-16 pb-28 md:pb-12">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Logo light size={64} />
            <p className="mt-5 font-script text-3xl text-white">{SITE.slogan}</p>
            <p className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-plum-200">
              Residential, commercial, deep cleaning and move-out cleaning in {SITE.city}, {SITE.state} and surrounding
              communities.
            </p>
            <div className="mt-6 space-y-3">
              {[SITE.phones.primary, SITE.phones.secondary].map((p, i) => (
                <div key={p.e164} className="flex flex-wrap items-center gap-3">
                  <span className="w-24 text-xs font-bold tracking-[0.15em] text-plum-300 uppercase">
                    {i === 0 ? "Primary" : "Secondary"}
                  </span>
                  <a href={p.tel} className="font-semibold text-white hover:text-plum-200">
                    {p.display}
                  </a>
                  <span className="flex gap-1.5">
                    <a
                      href={p.tel}
                      className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold hover:bg-white/10"
                    >
                      Call
                    </a>
                    <a
                      href={p.sms}
                      className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold hover:bg-white/10"
                    >
                      Text
                    </a>
                  </span>
                </div>
              ))}
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 pt-1 text-sm text-plum-200 hover:text-white">
                <Icon name="mail" className="size-4" /> {SITE.email}
              </a>
            </div>
            {socials.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {socials.map((s) => (
                  <a
                    key={s.key}
                    href={settings.social[s.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid size-11 place-items-center rounded-full border border-white/20 text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                    aria-label={s.label}
                  >
                    <Icon name={s.icon} className="size-5" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <FooterCol title="Cleaning Services">
            {servicePages.map((p) => (
              <FooterLink key={p.slug} href={`/services/${p.slug}`}>
                {p.navLabel}
              </FooterLink>
            ))}
            <FooterLink href="/services">All Cleaning Services</FooterLink>
            <FooterLink href="/pricing">Pricing</FooterLink>
          </FooterCol>

          <FooterCol title="Service Areas">
            {AREAS.map((a) => (
              <FooterLink key={a.slug} href={`/service-areas/${a.slug}`}>
                {a.label}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Company">
            <FooterLink href="/about">About Us</FooterLink>
            <FooterLink href="/photo-estimate">Send Pictures for an Estimate</FooterLink>
            <FooterLink href="/book">Book Your Cleaning</FooterLink>
            <FooterLink href="/gallery">Before &amp; After Gallery</FooterLink>
            <FooterLink href="/reviews">Customer Reviews</FooterLink>
            <FooterLink href="/faq">FAQ</FooterLink>
            <FooterLink href="/contact">Contact Us</FooterLink>
            <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
          </FooterCol>
        </div>

        <div className="divider-silver mt-14 opacity-30" />
        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-plum-300 md:flex-row">
          <p>
            © <Year /> {SITE.name} · {SITE.city}, {SITE.stateName}. All rights reserved.
          </p>
          <p className="flex items-center gap-2">
            <Sparkle className="size-3 text-plum-400" /> Prices and times shown are estimates until reviewed and approved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-sans text-xs font-bold tracking-[0.2em] text-white uppercase">{title}</h2>
      <ul className="mt-5 space-y-2.5 text-[0.95rem]">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-plum-200 transition-colors hover:text-white">
        {children}
      </Link>
    </li>
  );
}
