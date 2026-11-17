import { SITE } from "./site";

export type Faq = { q: string; a: string };

export const FAQ_GROUPS: { title: string; items: Faq[] }[] = [
  {
    title: "Pricing",
    items: [
      {
        q: "How does your pricing work?",
        a: "We charge by the hour for the whole crew: 2 cleaners are $100/hr, 3 cleaners are $150/hr and 4 cleaners are $200/hr. The hourly rate covers the entire crew, not each individual cleaner.",
      },
      {
        q: "Is there a minimum?",
        a: "Yes. Every booking has a 2-hour minimum — $200 for 2 cleaners, $300 for 3 cleaners and $400 for 4 cleaners.",
      },
      {
        q: "How much does deep cleaning cost?",
        a: "Deep cleaning is 25–30% additional to the hourly crew rate, because it includes detailed work like baseboards, fans, blinds, cabinet fronts and grout.",
      },
      {
        q: "How are move-in, move-out, commercial and specialty cleaning priced?",
        a: "These are custom estimates. Send us pictures of the property and we'll recommend a crew size, estimate the time and give you a price before scheduling.",
      },
      {
        q: "Do you offer discounts for recurring cleaning?",
        a: "Yes — weekly and biweekly cleaning discounts are available upon approval.",
      },
      {
        q: "Are the prices on the website final?",
        a: "Prices and completion times shown on the website are estimates. Your final time and price are confirmed after we review your request (and any pictures) and you approve them.",
      },
    ],
  },
  {
    title: "Booking & Estimates",
    items: [
      {
        q: "How do I know how many hours I need?",
        a: "Send us pictures of the rooms or areas you need cleaned. We'll review them, recommend the right crew size, estimate how long the job will take and give you an estimated price — free.",
      },
      {
        q: "How do I send pictures?",
        a: `Upload them on our Photo Estimate page, or text them directly to ${SITE.phones.primary.display} (primary) or ${SITE.phones.secondary.display} (secondary).`,
      },
      {
        q: "Is my appointment confirmed when I submit a booking request?",
        a: "Not yet. Online bookings are requests. We'll contact you by call or text to confirm the date, arrival time, crew and estimated price. Your appointment is confirmed once we approve it together.",
      },
      {
        q: "Do you speak Spanish? · ¿Hablan español?",
        a: "Yes! Our team speaks English and Spanish — ¡hablamos español! Call or text us in whichever language you prefer, and choose your preferred language on any of our forms.",
      },
      {
        q: "Can I call or text you?",
        a: `Yes! Both of our numbers accept calls and text messages: ${SITE.phones.primary.display} and ${SITE.phones.secondary.display}.`,
      },
      {
        q: "Do I need to be home during the cleaning?",
        a: "Not necessarily. Let us know your entry details (key, lockbox or door code) in your request and we'll confirm the arrangements with you before your appointment.",
      },
    ],
  },
  {
    title: "Services & Areas",
    items: [
      {
        q: "What areas do you serve?",
        a: "We're based in Spring, TX and serve Spring, Klein, The Woodlands, Tomball, Cypress, Humble, Kingwood and Conroe.",
      },
      {
        q: "Do you clean businesses?",
        a: "Yes. We clean offices, small businesses, retail stores, salons, barbershops, leasing offices, clubhouses and apartment common areas. Commercial cleaning is quoted as a custom estimate.",
      },
      {
        q: "Should I do anything before the cleaners arrive?",
        a: "Picking up clutter, toys and dishes lets our crew spend more time cleaning. If you'd like the inside of cabinets or the refrigerator cleaned, please empty them first. Let us know about pets, alarm codes or parking in your special instructions.",
      },
      {
        q: "What if the cleaning takes more or less time than estimated?",
        a: "Estimates are based on the details and pictures you share. If we find the job needs a different amount of time, we'll talk with you about it.",
      },
      {
        q: "Is it okay if I have pets?",
        a: "We love pets! Just tell us about them in your special instructions so our crew knows what to expect.",
      },
    ],
  },
];

export const ALL_FAQS = FAQ_GROUPS.flatMap((g) => g.items);
