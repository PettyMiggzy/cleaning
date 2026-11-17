import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingForm } from "@/components/forms/BookingForm";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/sections";
import { getFormServiceGroups } from "@/lib/form-services";

export const metadata: Metadata = {
  title: "Book Your Cleaning Online",
  description:
    "Request your house, apartment, deep, move-out or commercial cleaning online. Choose 2, 3 or 4 cleaners, pick your hours and see your estimated price instantly. Spring, TX.",
  alternates: { canonical: "/book" },
};

export default async function BookPage() {
  const groups = await getFormServiceGroups();
  return (
    <>
      <PageHero
        crumbs={[{ name: "Book Your Cleaning", path: "/book" }]}
        eyebrow="Online Booking Request"
        title={
          <>
            Book your cleaning <span className="text-gradient italic">in minutes</span>
          </>
        }
        lead="Choose your service, crew and hours, see your estimated price, and send your request. We'll call or text to confirm before anything is scheduled."
      >
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-semibold text-ink-soft">
          {["Instant price estimate", "2, 3 or 4 cleaners", "Confirmed by call or text"].map((t) => (
            <span key={t} className="flex items-center gap-2">
              <Icon name="checkCircle" className="size-5 text-plum-600" /> {t}
            </span>
          ))}
        </div>
      </PageHero>
      <section className="section !pt-12 bg-white">
        <div className="container-x">
          <Suspense fallback={<div className="h-[60rem] animate-pulse rounded-[2rem] bg-plum-50" />}>
            <BookingForm groups={groups} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
