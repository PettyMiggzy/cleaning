import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/forms/ContactForm";
import { Icon, type IconName } from "@/components/Icon";
import { PageHero } from "@/components/sections";
import { Eyebrow, PhoneLines } from "@/components/ui";
import { AREAS } from "@/lib/areas";
import { getSettings } from "@/lib/data";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us — Call or Text",
  description: `Contact Emili's Cleaning Co. in Spring, TX. Call or text ${SITE.phones.primary.display} (primary) or ${SITE.phones.secondary.display} (secondary), or send us a message.`,
  alternates: { canonical: "/contact" },
};

const SOCIAL: { key: keyof Awaited<ReturnType<typeof getSettings>>["social"]; label: string; icon: IconName }[] = [
  { key: "facebook", label: "Facebook", icon: "facebook" },
  { key: "instagram", label: "Instagram", icon: "instagram" },
  { key: "tiktok", label: "TikTok", icon: "tiktok" },
  { key: "google", label: "Google Business Profile", icon: "google" },
  { key: "yelp", label: "Yelp", icon: "star" },
  { key: "nextdoor", label: "Nextdoor", icon: "home" },
];

export default async function ContactPage() {
  const settings = await getSettings();
  const socials = SOCIAL.filter((s) => settings.social[s.key]);
  return (
    <>
      <PageHero
        crumbs={[{ name: "Contact Us", path: "/contact" }]}
        eyebrow="We'd Love to Hear From You"
        title={
          <>
            Call, text or <span className="text-gradient italic">send a message</span>
          </>
        }
        lead="Both of our numbers accept calls and text messages. For the fastest estimate, text us pictures of the areas you need cleaned."
      />
      <section className="section bg-white">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-8">
            <div>
              <Eyebrow>Phone &amp; Text</Eyebrow>
              <div className="mt-5">
                <PhoneLines compact />
              </div>
            </div>
            <div className="silver-ring card bg-white p-6 shadow-soft">
              <div className="flex items-center gap-4">
                <span className="grid size-12 place-items-center rounded-2xl bg-plum-100 text-plum-700">
                  <Icon name="mail" />
                </span>
                <div>
                  <p className="text-xs font-bold tracking-[0.16em] text-plum-700 uppercase">Email</p>
                  <a href={`mailto:${SITE.email}`} className="font-semibold break-all text-ink hover:text-plum-700">
                    {SITE.email}
                  </a>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-4 border-t border-silver-100 pt-5">
                <span className="grid size-12 place-items-center rounded-2xl bg-plum-100 text-plum-700">
                  <Icon name="mapPin" />
                </span>
                <div>
                  <p className="text-xs font-bold tracking-[0.16em] text-plum-700 uppercase">Based In</p>
                  <p className="font-semibold text-ink">
                    {SITE.city}, {SITE.stateName}
                  </p>
                  <p className="text-sm text-muted">Serving {AREAS.map((a) => a.name).join(", ")}</p>
                </div>
              </div>
            </div>
            <div className="silver-ring card bg-white p-6 shadow-soft">
              <p className="text-xs font-bold tracking-[0.16em] text-plum-700 uppercase">Follow Us</p>
              {socials.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {socials.map((s) => (
                    <a
                      key={s.key}
                      href={settings.social[s.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                    >
                      <Icon name={s.icon} className="size-4" /> {s.label}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted">Our social media pages are coming soon.</p>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/book" className="btn btn-primary">
                <Icon name="calendar" className="size-5" /> Book Your Cleaning
              </Link>
              <Link href="/photo-estimate" className="btn btn-outline">
                <Icon name="camera" className="size-5" /> Free Photo Estimate
              </Link>
            </div>
          </div>
          <div>
            <h2 className="h2">Send us a message</h2>
            <p className="mt-3 mb-8 text-ink-soft">We&apos;ll get back to you as soon as possible.</p>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
