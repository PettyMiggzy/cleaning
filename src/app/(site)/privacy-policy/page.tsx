import type { Metadata } from "next";
import { PageHero } from "@/components/sections";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE.name} collects, uses and protects the information you share through our website.`,
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero crumbs={[{ name: "Privacy Policy", path: "/privacy-policy" }]} title="Privacy Policy" lead="Last updated: November 2026" />
      <section className="section bg-white">
        <div className="container-x">
          <article className="prose-ecc mx-auto max-w-3xl">
            <p>
              {SITE.name} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your privacy. This policy explains what
              information we collect through this website, how we use it, and the choices you have.
            </p>

            <h2>Information we collect</h2>
            <p>When you submit a booking request, photo estimate request, review or contact form, we collect the information you provide, which may include:</p>
            <ul>
              <li>Your name, phone number and email address</li>
              <li>Property address, city, ZIP code and property details (type, bedrooms, bathrooms, square footage)</li>
              <li>Your requested service, preferred dates and times, and special instructions</li>
              <li>Photos you upload of the areas you would like cleaned</li>
              <li>Reviews and ratings you choose to submit</li>
            </ul>
            <p>
              Like most websites, our hosting provider may automatically record basic technical information such as your IP
              address, browser type and pages visited. If Google Analytics is enabled, it uses cookies to help us understand how
              visitors use the site.
            </p>

            <h2>How we use your information</h2>
            <ul>
              <li>To respond to your requests and provide cleaning estimates</li>
              <li>To schedule, confirm and perform cleaning services</li>
              <li>To contact you by phone, text message or email about your request</li>
              <li>To publish reviews you submit (only after you consent and we verify them)</li>
              <li>To keep the website secure and prevent spam or abuse</li>
              <li>To improve our website and services</li>
            </ul>

            <h2>Photos</h2>
            <p>
              Photos you upload or text to us are used only to review your request and prepare your estimate. They are not
              published on our website. Before-and-after photos shown in our gallery are added by our team from completed jobs.
            </p>

            <h2>How we share information</h2>
            <p>
              We do not sell or rent your personal information. We share information only with service providers that help us run
              our business and website (such as web hosting and email delivery), or when required by law.
            </p>

            <h2>Text messages</h2>
            <p>
              If you text us or ask us to contact you by text, we will use your number to communicate about your cleaning request
              and service. Message and data rates may apply. You can ask us to stop texting you at any time.
            </p>

            <h2>Data security & retention</h2>
            <p>
              Our website uses HTTPS encryption, and form submissions are stored securely with access limited to our team. We keep
              information only as long as needed for the purposes described above or as required by law.
            </p>

            <h2>Your choices</h2>
            <p>
              You may ask us to access, correct or delete the personal information you have shared with us by contacting us using
              the details below.
            </p>

            <h2>Children&apos;s privacy</h2>
            <p>This website is not intended for children under 13, and we do not knowingly collect their information.</p>

            <h2>Changes to this policy</h2>
            <p>We may update this policy from time to time. The &ldquo;last updated&rdquo; date above reflects the latest version.</p>

            <h2>Contact us</h2>
            <p>
              {SITE.name}
              <br />
              {SITE.city}, {SITE.stateName}
              <br />
              Phone/Text: <a href={SITE.phones.primary.tel}>{SITE.phones.primary.display}</a> ·{" "}
              <a href={SITE.phones.secondary.tel}>{SITE.phones.secondary.display}</a>
              <br />
              Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
