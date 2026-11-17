import type { Metadata } from "next";
import { ReviewForm } from "@/components/forms/ReviewForm";
import { Icon } from "@/components/Icon";
import { GoogleReviews } from "@/components/GoogleReviews";
import { CTASection, PageHero } from "@/components/sections";
import { Eyebrow, Stars } from "@/components/ui";
import { getPublishedReviews, getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Customer Reviews",
  description:
    "Read genuine reviews from Emili's Cleaning Co. customers in Spring, TX and nearby — and share your own experience.",
  alternates: { canonical: "/reviews" },
};

export default async function ReviewsPage() {
  const [reviews, settings] = await Promise.all([getPublishedReviews(), getSettings()]);
  const avg = reviews.length ? reviews.reduce((n, r) => n + r.rating, 0) / reviews.length : 0;

  return (
    <>
      <PageHero
        crumbs={[{ name: "Customer Reviews", path: "/reviews" }]}
        eyebrow="Genuine Customer Reviews"
        title={
          <>
            What our clients <span className="text-gradient italic">are saying</span>
          </>
        }
        lead="Every review on this page comes from a real customer of Emili's Cleaning Co."
      >
        {reviews.length > 0 && (
          <div className="flex items-center justify-center gap-3">
            <Stars rating={Math.round(avg)} className="size-6" />
            <span className="font-semibold text-ink">
              {avg.toFixed(1)} average · {reviews.length} review{reviews.length === 1 ? "" : "s"}
            </span>
          </div>
        )}
      </PageHero>

      <section className="section bg-white">
        <div className="container-x">
          <GoogleReviews reviews={reviews} googleReviewUrl={settings.googleReviewUrl} showWriteLink={false} />
        </div>
      </section>

      <section className="section bg-lavender" id="write-a-review">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>Share Your Experience</Eyebrow>
            <h2 className="h2 mt-4">Leave a review</h2>
            <p className="lead mt-5">
              Your feedback helps us improve and helps your neighbors find a cleaning company they can trust. Reviews appear on
              the site after a quick verification by our team.
            </p>
            {settings.googleReviewUrl && (
              <a href={settings.googleReviewUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline mt-8">
                <Icon name="google" className="size-5" /> Review us on Google
              </a>
            )}
          </div>
          <ReviewForm />
        </div>
      </section>
      <CTASection />
    </>
  );
}
