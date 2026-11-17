import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { CTASection, FaqList, PageHero } from "@/components/sections";
import { Eyebrow } from "@/components/ui";
import { ALL_FAQS, FAQ_GROUPS } from "@/lib/faqs";
import { faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers about Emili's Cleaning Co. pricing, 2-hour minimums, deep cleaning, photo estimates, booking requests and service areas in Spring, TX.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqSchema(ALL_FAQS)} />
      <PageHero
        crumbs={[{ name: "FAQ", path: "/faq" }]}
        eyebrow="Frequently Asked Questions"
        title={
          <>
            Questions &amp; <span className="text-gradient italic">answers</span>
          </>
        }
        lead="Everything you need to know about pricing, booking, estimates and our service areas."
      />
      <section className="section bg-white">
        <div className="container-x grid gap-12 lg:grid-cols-[16rem_1fr]">
          <nav aria-label="FAQ sections" className="hidden lg:block">
            <ul className="sticky top-32 space-y-2">
              {FAQ_GROUPS.map((g) => (
                <li key={g.title}>
                  <a href={`#${g.title.toLowerCase().replace(/[^a-z]+/g, "-")}`} className="block rounded-xl px-4 py-2.5 font-semibold text-ink hover:bg-plum-50 hover:text-plum-700">
                    {g.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-14">
            {FAQ_GROUPS.map((g) => (
              <section key={g.title} id={g.title.toLowerCase().replace(/[^a-z]+/g, "-")}>
                <Eyebrow>{g.title}</Eyebrow>
                <div className="mt-5">
                  <FaqList items={g.items} />
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
      <CTASection title="Still have questions?" lead="Call or text us anytime — or send pictures for a free estimate." />
    </>
  );
}
