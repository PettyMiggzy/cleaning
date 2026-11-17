import type { CategoryId } from "./services-catalog";

export type ServicePage = {
  slug: string;
  /** Catalog service id that controls whether this page is live. */
  serviceId: string;
  navLabel: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  kicker: string;
  image: string;
  imageAlt: string;
  intro: string[];
  included: { title: string; items: string[] }[];
  idealFor: string[];
  pricingNote: string;
  pricingMode: "hourly" | "deep" | "custom";
  relatedCategories: CategoryId[];
  faqs: { q: string; a: string }[];
};

const STANDARD_ROOMS = [
  {
    title: "Kitchen",
    items: [
      "Countertops & backsplash wiped and sanitized",
      "Sink & faucet scrubbed and shined",
      "Appliance exteriors & microwave cleaned",
      "Cabinet fronts spot-cleaned",
      "Floors vacuumed and mopped",
    ],
  },
  {
    title: "Bathrooms",
    items: [
      "Toilets cleaned & sanitized inside and out",
      "Showers & tubs scrubbed",
      "Sinks, counters & fixtures polished",
      "Mirrors & glass streak-free",
      "Floors cleaned and mopped",
    ],
  },
  {
    title: "Bedrooms & Living Areas",
    items: [
      "Furniture & reachable surfaces dusted",
      "Ceiling fans & light fixtures dusted",
      "Beds made (linen change on request)",
      "Mirrors & interior glass cleaned",
      "Trash emptied",
    ],
  },
  {
    title: "Throughout the Home",
    items: [
      "Carpets & rugs vacuumed",
      "Hard floors mopped",
      "Baseboards dusted",
      "Light switches & door handles wiped",
      "Stairs & hallways cleaned",
    ],
  },
];

export const SERVICE_PAGES: ServicePage[] = [
  {
    slug: "house-cleaning",
    serviceId: "house-cleaning",
    navLabel: "House Cleaning",
    metaTitle: "House Cleaning in Spring, TX",
    metaDescription:
      "Professional house cleaning in Spring, TX and nearby. 2–4 person crews from $100/hr for the whole crew, flexible scheduling and free photo estimates. Call or text (281) 662-9871.",
    h1: "House Cleaning in Spring, TX",
    kicker: "Residential Cleaning",
    image: "/images/house-cleaner-arriving.webp",
    imageAlt: "Emili's Cleaning Co. house cleaner arriving at a Texas home with cleaning supplies",
    intro: [
      "Come home to a house that feels fresh, calm and completely cared for. Emili's Cleaning Co. provides professional house cleaning for homes throughout Spring, Klein, The Woodlands and the surrounding communities.",
      "Choose a one-time clean or set up weekly, biweekly or monthly service. You pick the crew size, we take care of the details — and you always know the hourly rate up front.",
    ],
    included: STANDARD_ROOMS,
    idealFor: [
      "Busy families and professionals",
      "Getting ready for guests or holidays",
      "Recurring weekly or biweekly upkeep",
      "Homes of every size, from townhomes to large estates",
    ],
    pricingNote:
      "House cleaning is billed hourly for the whole crew, with a 2-hour minimum. Weekly and biweekly clients may qualify for discounts upon approval.",
    pricingMode: "hourly",
    relatedCategories: ["residential", "kitchen", "bathroom", "interior"],
    faqs: [
      {
        q: "How many hours will my house cleaning take?",
        a: "It depends on the size and condition of your home and the crew size you choose. The easiest way to know is to send us pictures — we'll recommend a crew and estimate the time before scheduling.",
      },
      {
        q: "Can I choose which rooms you focus on?",
        a: "Absolutely. Add your priorities in the special instructions when you book and our crew will focus on what matters most to you.",
      },
    ],
  },
  {
    slug: "apartment-cleaning",
    serviceId: "apartment-cleaning",
    navLabel: "Apartment Cleaning",
    metaTitle: "Apartment Cleaning in Spring, TX",
    metaDescription:
      "Apartment and condo cleaning in Spring, TX and nearby — routine cleaning, deep cleaning and move-out cleaning. Transparent hourly pricing. Call or text (281) 662-9871.",
    h1: "Apartment Cleaning in Spring, TX",
    kicker: "Apartments · Condos · Townhomes",
    image: "/images/apartment-cleaning.webp",
    imageAlt: "Cleaner vacuuming a bright modern apartment living room",
    intro: [
      "Apartment living should feel easy. Our apartment cleaning service gives you a spotless kitchen, sparkling bathrooms and fresh living spaces — without giving up your weekend.",
      "We clean apartments, condos and townhomes of every layout across Spring and nearby communities, from quick routine cleans to detailed move-out cleaning before your inspection.",
    ],
    included: STANDARD_ROOMS,
    idealFor: [
      "Studio, 1, 2 and 3-bedroom apartments",
      "Condos and townhomes",
      "Roommates who want a consistent clean",
      "Apartment move-in and move-out",
    ],
    pricingNote:
      "Most apartments are perfect for our 2-cleaner crew at $100/hr for the whole crew (2-hour minimum). Apartment move-out cleaning is quoted as a custom estimate.",
    pricingMode: "hourly",
    relatedCategories: ["residential", "deep", "move"],
    faqs: [
      {
        q: "Do you clean apartments for move-out inspections?",
        a: "Yes. Apartment move-out cleaning is one of our specialties. Send pictures of the unit and we'll provide a custom estimate.",
      },
      {
        q: "How do you get into my apartment?",
        a: "Include your entry details (key, lockbox, door code or front-desk instructions) in your request and we'll confirm the arrangements with you before your appointment.",
      },
    ],
  },
  {
    slug: "maid-services",
    serviceId: "maid-service",
    navLabel: "Maid Services",
    metaTitle: "Maid Services in Spring, TX",
    metaDescription:
      "Reliable maid service in Spring, TX — weekly, biweekly or monthly housekeeping with 2, 3 or 4-person crews. Discounts on recurring service upon approval. Call or text (281) 662-9871.",
    h1: "Maid Services in Spring, TX",
    kicker: "Recurring Housekeeping",
    image: "/images/maid-service-bed-making.webp",
    imageAlt: "Maid making a bed with crisp white linens and a lavender throw",
    intro: [
      "Our maid service keeps your home consistently clean so you can spend your time on the people and things you love. Same high standards, every visit.",
      "Choose weekly, biweekly or monthly housekeeping. Recurring clients may qualify for discounted rates upon approval — just ask when you book.",
    ],
    included: [
      ...STANDARD_ROOMS.slice(0, 3),
      {
        title: "Housekeeping Extras",
        items: [
          "Bed making & linen changing",
          "Laundry folding",
          "Dishwashing add-on",
          "Pet hair removal",
          "Indoor trash bins emptied",
        ],
      },
    ],
    idealFor: [
      "Weekly or biweekly home upkeep",
      "Busy parents and working professionals",
      "Pet owners",
      "Anyone who wants a consistently clean home",
    ],
    pricingNote:
      "Maid service is billed hourly for the whole crew with a 2-hour minimum. Weekly and biweekly discounts are available upon approval.",
    pricingMode: "hourly",
    relatedCategories: ["residential", "interior"],
    faqs: [
      {
        q: "Do you offer discounts for recurring maid service?",
        a: "Yes — weekly and biweekly cleaning discounts are available upon approval. Mention the schedule you'd like when you book.",
      },
      {
        q: "Can you do laundry and change the bed linens?",
        a: "Yes. Bed making, linen changing and laundry folding can be added to any visit. Just leave clean linens out for us.",
      },
    ],
  },
  {
    slug: "deep-cleaning",
    serviceId: "deep-house-cleaning",
    navLabel: "Deep Cleaning",
    metaTitle: "Deep Cleaning Services in Spring, TX",
    metaDescription:
      "Detailed deep house cleaning in Spring, TX — baseboards, cabinets, fans, blinds, grout and more. Deep cleaning is 25–30% added to our hourly crew rate. Free photo estimates.",
    h1: "Deep Cleaning in Spring, TX",
    kicker: "Top-to-Bottom Detail",
    image: "/images/deep-cleaning-baseboards.webp",
    imageAlt: "Cleaner hand-detailing white baseboards during a deep clean",
    intro: [
      "A deep clean reaches the places routine cleaning doesn't — the baseboards, cabinet fronts, ceiling fans, blinds, grout lines and built-up grime that make a home feel tired.",
      "It's the perfect reset before the holidays, after a busy season, before starting recurring service, or any time your home needs extra love.",
    ],
    included: [
      {
        title: "Kitchen Deep Clean",
        items: [
          "Degreasing of stovetop, backsplash & surfaces",
          "Cabinet fronts & handles detailed",
          "Appliance exteriors & microwave inside/out",
          "Oven & refrigerator interiors (on request)",
          "Sink, faucet & floor edges scrubbed",
        ],
      },
      {
        title: "Bathroom Deep Clean",
        items: [
          "Soap scum & hard-water spots removed",
          "Tile & grout scrubbed",
          "Shower glass detailed",
          "Fixtures & hardware polished",
          "Toilets detailed including base",
        ],
      },
      {
        title: "Detail Work",
        items: [
          "Baseboards hand-wiped",
          "Ceiling fans & light fixtures",
          "Blinds & window sills",
          "Door frames, doors & light switches",
          "Interior windows (on request)",
        ],
      },
      {
        title: "Throughout the Home",
        items: [
          "High & low detailed dusting",
          "Furniture dusted and wiped",
          "Floors vacuumed & mopped edge to edge",
          "Stairs & railings detailed",
          "Interior cabinets (please empty first)",
        ],
      },
    ],
    idealFor: [
      "First-time clients",
      "Seasonal, spring & holiday cleaning",
      "Homes that haven't been professionally cleaned in a while",
      "Preparing for guests, events or listing photos",
    ],
    pricingNote:
      "Deep cleaning is priced at our hourly crew rate plus 25–30% additional. Send pictures for an accurate time estimate.",
    pricingMode: "deep",
    relatedCategories: ["deep", "kitchen", "bathroom"],
    faqs: [
      {
        q: "What's the difference between standard and deep cleaning?",
        a: "Standard cleaning maintains a home that's cleaned regularly. Deep cleaning adds detail work — baseboards, fans, blinds, cabinet fronts, grout and buildup — and typically takes longer.",
      },
      {
        q: "How much more does deep cleaning cost?",
        a: "Deep cleaning is 25–30% additional to our hourly crew rate. Send us pictures and we'll estimate the time and price before scheduling.",
      },
    ],
  },
  {
    slug: "move-in-cleaning",
    serviceId: "move-in-cleaning",
    navLabel: "Move-In Cleaning",
    metaTitle: "Move-In Cleaning in Spring, TX",
    metaDescription:
      "Move-in cleaning in Spring, TX and nearby — inside cabinets, appliances, bathrooms and floors cleaned before you unpack. Custom estimates from photos. Call or text (281) 662-9871.",
    h1: "Move-In Cleaning in Spring, TX",
    kicker: "Start Fresh",
    image: "/images/move-out-cleaning.webp",
    imageAlt: "Cleaner mopping the floors of an empty home before move-in",
    intro: [
      "Your new home should feel like yours from day one. Our move-in cleaning sanitizes the kitchen, bathrooms, cabinets and floors so you can unpack with peace of mind.",
      "Empty homes are the easiest to clean thoroughly — we can reach inside every cabinet, drawer and closet before your boxes arrive.",
    ],
    included: [
      {
        title: "Kitchen",
        items: [
          "Inside cabinets & drawers wiped",
          "Inside oven, refrigerator & microwave",
          "Countertops, backsplash & sink sanitized",
          "Appliance exteriors cleaned",
          "Floors mopped edge to edge",
        ],
      },
      {
        title: "Bathrooms",
        items: [
          "Toilets, showers & tubs sanitized",
          "Inside vanities & drawers",
          "Mirrors, glass & fixtures polished",
          "Tile & floors scrubbed",
        ],
      },
      {
        title: "Whole Home",
        items: [
          "Closets & shelves wiped",
          "Baseboards, doors & frames",
          "Window sills & tracks",
          "Light switches & outlet covers",
          "Ceiling fans & fixtures dusted",
          "Floors vacuumed & mopped",
        ],
      },
    ],
    idealFor: [
      "New homeowners",
      "Renters moving into apartments or houses",
      "New construction (final clean available)",
      "Realtors preparing a home for buyers",
    ],
    pricingNote:
      "Move-in cleaning is quoted as a custom estimate. Send pictures of the property and we'll recommend a crew size, estimate the time and give you a price before scheduling.",
    pricingMode: "custom",
    relatedCategories: ["move", "deep"],
    faqs: [
      {
        q: "When should I schedule move-in cleaning?",
        a: "Ideally after the previous occupants have moved out and before your belongings arrive, so we can reach every cabinet, closet and corner.",
      },
      {
        q: "How do you price move-in cleaning?",
        a: "Every empty home is different, so move-in cleaning is a custom estimate. Send us pictures and we'll get back to you with a recommended crew, time and price.",
      },
    ],
  },
  {
    slug: "move-out-cleaning",
    serviceId: "move-out-cleaning",
    navLabel: "Move-Out Cleaning",
    metaTitle: "Move-Out Cleaning in Spring, TX",
    metaDescription:
      "Move-out and end-of-lease cleaning in Spring, TX for tenants, homeowners, landlords and property managers. Custom estimates from photos. Call or text (281) 662-9871.",
    h1: "Move-Out Cleaning in Spring, TX",
    kicker: "End-of-Lease · Rentals · Turnovers",
    image: "/images/move-out-cleaning.webp",
    imageAlt: "Cleaner mopping an empty living room with moving boxes by the door",
    intro: [
      "Moving is stressful enough. Let our crew handle the cleaning so you can focus on your next chapter — and leave your old home ready for the final walkthrough, new owners or next tenants.",
      "We help renters, homeowners, landlords, realtors and property managers with move-out, end-of-lease and rental turnover cleaning across Spring and nearby areas.",
    ],
    included: [
      {
        title: "Kitchen",
        items: [
          "Inside cabinets & drawers",
          "Inside oven, refrigerator & microwave",
          "Stovetop & backsplash degreased",
          "Countertops & sink sanitized",
          "Floors mopped edge to edge",
        ],
      },
      {
        title: "Bathrooms",
        items: [
          "Showers, tubs & toilets scrubbed",
          "Inside vanities & medicine cabinets",
          "Mirrors, glass & fixtures",
          "Tile & floors scrubbed",
        ],
      },
      {
        title: "Whole Home",
        items: [
          "Closets & shelving",
          "Baseboards, doors & frames",
          "Window sills & tracks",
          "Light switches & outlet covers",
          "Ceiling fans & light fixtures",
          "Floors vacuumed & mopped",
        ],
      },
    ],
    idealFor: [
      "Renters preparing for an apartment inspection",
      "Home sellers before closing",
      "Landlords & property managers between tenants",
      "Airbnb & vacation rental turnovers",
    ],
    pricingNote:
      "Move-out cleaning is quoted as a custom estimate. Send pictures for a free time and price estimate before scheduling.",
    pricingMode: "custom",
    relatedCategories: ["move"],
    faqs: [
      {
        q: "Do I need to be there for move-out cleaning?",
        a: "Not necessarily. Share your access details in your request and we'll confirm the arrangements with you before the appointment.",
      },
      {
        q: "Should the home be empty?",
        a: "For the best results, yes — an empty home lets us clean inside every cabinet, closet and corner.",
      },
    ],
  },
  {
    slug: "commercial-cleaning",
    serviceId: "commercial-cleaning",
    navLabel: "Commercial Cleaning",
    metaTitle: "Commercial & Office Cleaning in Spring, TX",
    metaDescription:
      "Commercial and office cleaning in Spring, TX — offices, retail, salons, leasing offices and common areas, including after-hours service. Custom estimates. Call or text (281) 662-9871.",
    h1: "Commercial & Office Cleaning in Spring, TX",
    kicker: "Offices · Retail · Salons · Common Areas",
    image: "/images/commercial-office-cleaning.webp",
    imageAlt: "Commercial cleaner wiping a conference table in a bright modern office",
    intro: [
      "A clean workplace makes a strong impression on clients and keeps your team comfortable and productive. Emili's Cleaning Co. provides dependable commercial cleaning for businesses across Spring and the north Houston area.",
      "We clean offices, small businesses, retail stores, salons, barbershops, leasing offices, clubhouses and apartment common areas — on a recurring schedule or after hours.",
    ],
    included: [
      {
        title: "Work Areas",
        items: [
          "Desks & clear surfaces dusted and wiped",
          "Conference rooms reset",
          "Glass doors & partitions",
          "High-touch points sanitized",
          "Trash & recycling emptied",
        ],
      },
      {
        title: "Restrooms & Breakrooms",
        items: [
          "Toilets, sinks & fixtures sanitized",
          "Mirrors & dispensers wiped",
          "Breakroom counters, sinks & tables",
          "Microwave & appliance exteriors",
        ],
      },
      {
        title: "Lobby & Floors",
        items: [
          "Reception, lobby & waiting rooms",
          "Entry glass & doors",
          "Carpets vacuumed",
          "Hard floors mopped",
        ],
      },
    ],
    idealFor: [
      "Offices & real estate offices",
      "Retail stores, salons & barbershops",
      "Leasing offices, clubhouses & common areas",
      "After-hours & recurring service",
    ],
    pricingNote:
      "Commercial cleaning is quoted as a custom estimate based on your space, schedule and scope. Send pictures or call to set up a walkthrough.",
    pricingMode: "custom",
    relatedCategories: ["commercial"],
    faqs: [
      {
        q: "Can you clean after business hours?",
        a: "Yes — after-hours office cleaning is available so your team and customers aren't interrupted.",
      },
      {
        q: "Do you offer recurring commercial cleaning?",
        a: "Yes. We can set up a recurring schedule that fits your business. Commercial cleaning is quoted as a custom estimate.",
      },
    ],
  },
];

export function getServicePage(slug: string) {
  return SERVICE_PAGES.find((p) => p.slug === slug);
}
