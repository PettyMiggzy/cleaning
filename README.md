# Emili's Cleaning Co. — Website

**A Cleaner Home, A Happier You!**

Premium, mobile-first website for Emili's Cleaning Co. (Spring, TX), built with Next.js 16, React 19 and Tailwind CSS 4.

Live: https://emiliscleaningco.com · Admin: https://emiliscleaningco.com/admin

## What's included

| Area | Details |
| --- | --- |
| **Languages** | Full English and Spanish sites. English lives at the root (`/pricing`), Spanish under `/es` (`/es/pricing`). EN \| ES switch in the header, mobile menu and footer keeps you on the same page; `hreflang` + a bilingual sitemap tell Google which page is which. Spanish-browser visitors on English pages get a dismissible "¿Prefiere ver este sitio en español?" banner. Forms ask for a preferred language, flag Spanish requests, and send customers Spanish confirmation emails. |
| **Pages** | Home, About, All Services, House / Apartment / Maid / Deep / Move-In / Move-Out / Commercial cleaning, Pricing, Send Pictures for an Estimate, Service Areas (+ 8 city pages), Before & After Gallery, Customer Reviews, FAQ, Contact, Book Your Cleaning, Privacy Policy |
| **Pricing** | 2 / 3 / 4 cleaner cards ($100 / $150 / $200 per hour for the whole crew, 2-hour minimum), additional pricing table, interactive price calculator (deep cleaning +25–30%, custom-estimate services) |
| **Photo estimates** | Multi-photo upload straight from the phone camera or gallery (photos are optimized in the browser before upload), plus click-to-text buttons for both numbers |
| **Booking requests** | Service, 2/3/4 cleaners, hours, live estimated price, date, arrival window, address, photos, instructions, contact info. Requests are **not** auto-confirmed. |
| **Services** | 147 services in 8 categories (names match Google Business Profile): 131 on by default, 16 optional specialty services that start disabled. Each can be turned on/off and its English and Spanish descriptions edited in the admin. |
| **Admin dashboard** | `/admin` — requests inbox with photos & status tracking, service on/off + descriptions + custom services, reviews (add/approve/hide), before & after gallery uploads, social links |
| **Reviews** | Real reviews only (added in the admin or submitted by customers and approved). Google-styled section with “Review us on Google” button. |
| **SEO** | Unique titles & descriptions, clean URLs, heading structure, XML sitemap, robots.txt, LocalBusiness / Service / FAQ / Breadcrumb structured data, Open Graph image, Search Console + GA4 support |
| **Contact** | Call and text buttons for both lines everywhere, sticky mobile action bar (Call · Text · Photos · Book) |
| **Security** | HTTPS headers (HSTS etc.), server-side validation, honeypot + timing spam checks, rate limiting, private customer photos (admin only), signed admin sessions |

### Previewing the reviews section

Until real reviews are added, visitors see an honest "Our Google reviews will appear here" message.
To show the business owner what the finished section looks like, open **`/?preview=reviews`** or **`/reviews?preview=reviews`**.
Those sample reviews are only rendered for that link (never for normal visitors or search engines) and disappear automatically once real reviews are published.

> Publishing invented reviews to the public is prohibited by the FTC's rule on fake reviews and Google's policies — always use genuine customer reviews on the live site.

## Languages (English / Spanish)

- **Routing:** `src/proxy.ts` serves English from the clean URLs (internally `/en/…`, a visible `/en/…` redirects to the clean URL) and Spanish from `/es/…`. All pages live under `src/app/[lang]/`; the admin area (`/admin`) is English only.
- **Translations:**
  - UI text is written next to the English with `t("English", "Español")` (`src/i18n/config.ts`; `getI18n()` on the server, `useI18n()` in client components).
  - Structured content has Spanish companions: `services-catalog.es.ts` (147 services + categories), `service-pages.es.ts`, `areas.es.ts`, `faqs.es.ts`. Adding a service means adding its English entry **and** its Spanish entry (missing Spanish falls back to English).
  - Brand copy (slogan, description) is in `COPY` in `src/lib/site.ts`.
- **Admin:** each service has an optional Spanish description; custom services and gallery photos take optional Spanish names/captions. Customer reviews are shown exactly as written.
- **SEO:** Spanish pages have their own titles, descriptions, canonical URL, `hreflang` alternates, FAQ/breadcrumb structured data, `<html lang="es-US">`, and a Spanish share image (`public/og-es.jpg`).

## Configuration

Copy `env.example` and set the variables on your host.

| Variable | Purpose |
| --- | --- |
| `ADMIN_PASSWORD` | **Required.** Admin dashboard password |
| `DATABASE_URL` | Postgres connection string (recommended for production). Tables are created automatically. |
| `DATA_DIR` | Disk storage folder when no database is configured (default `./data`; `/app/data` in Docker) |
| `GMAIL_USER` + `GMAIL_APP_PASSWORD` | Send notification emails through Gmail ([create an App Password](https://myaccount.google.com/apppasswords)) |
| `RESEND_API_KEY` / `SMTP_*` | Alternative email providers |
| `NOTIFY_EMAIL` | Where notifications go (default `emiliscleaningco@gmail.com`) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID |
| `GOOGLE_SITE_VERIFICATION` | Google Search Console verification code |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL (default `https://emiliscleaningco.com`) |

Business details (name, phones, email, service areas) live in `src/lib/site.ts` and `src/lib/areas.ts`.
The master service list is `src/lib/services-catalog.ts`; detailed service-page content is `src/lib/service-pages.ts`.

## Development

```bash
npm install
npm run dev          # http://localhost:3000  (admin password in dev: "admin")
npm run build && npm start
```

## Deployment

The included `Dockerfile` builds a small standalone image that listens on port 3000.
If you don't set `DATABASE_URL`, mount a persistent volume at `/app/data` so uploads and admin changes survive redeploys.

## Images

Team and service photos in `public/images` are AI-generated (Venice) brand imagery. Replace them with real team photos whenever possible — the before & after gallery should always use photos from real completed jobs.
