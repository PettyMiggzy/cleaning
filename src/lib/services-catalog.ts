import type { PricingMode } from "./pricing";
import { SERVICE_ES } from "./services-catalog.es";

/**
 * Master list of every cleaning service the business offers (or may offer).
 * Names intentionally mirror Google Business Profile service names so the
 * website and the GBP listing stay consistent.
 *
 * Whether a service is visible on the website is controlled from the admin
 * dashboard (/admin/services). `defaultEnabled` is only the starting state.
 */

export type CategoryId =
  | "residential"
  | "deep"
  | "move"
  | "commercial"
  | "kitchen"
  | "bathroom"
  | "interior"
  | "specialty";

export type ServiceCategory = {
  id: CategoryId;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  image: string;
  pricing: PricingMode;
  /** Optional services start disabled and can be activated later in the admin dashboard. */
  optional?: boolean;
};

export const CATEGORIES: ServiceCategory[] = [
  {
    id: "residential",
    name: "Residential Cleaning",
    shortName: "Residential",
    tagline: "Houses, apartments, condos & recurring maid service",
    description:
      "Dependable home cleaning for houses, apartments, condos, townhomes and duplexes — one-time or on a weekly, biweekly or monthly schedule.",
    image: "/images/maid-service-bed-making.webp",
    pricing: "hourly",
  },
  {
    id: "deep",
    name: "Deep Cleaning",
    shortName: "Deep Cleaning",
    tagline: "Top-to-bottom detail work",
    description:
      "A detailed, top-to-bottom clean for homes that need extra attention — baseboards, cabinets, fans, blinds, grout and more.",
    image: "/images/deep-cleaning-baseboards.webp",
    pricing: "deep",
  },
  {
    id: "move",
    name: "Move-In, Move-Out & Rental Cleaning",
    shortName: "Move-In / Move-Out",
    tagline: "Empty homes, rentals & turnovers",
    description:
      "Move-in, move-out, end-of-lease and rental turnover cleaning for tenants, homeowners, landlords, realtors and property managers.",
    image: "/images/move-out-cleaning.webp",
    pricing: "custom",
  },
  {
    id: "commercial",
    name: "Commercial Cleaning",
    shortName: "Commercial",
    tagline: "Offices, retail, salons & common areas",
    description:
      "Reliable cleaning for offices, small businesses, retail stores, salons, leasing offices and common areas — including after-hours service.",
    image: "/images/commercial-office-cleaning.webp",
    pricing: "custom",
  },
  {
    id: "kitchen",
    name: "Kitchen Cleaning",
    shortName: "Kitchen",
    tagline: "Counters, appliances, cabinets & floors",
    description:
      "From everyday wipe-downs to inside-the-oven detail, we leave your kitchen fresh, sanitized and sparkling.",
    image: "/images/kitchen-cleaning.webp",
    pricing: "hourly",
  },
  {
    id: "bathroom",
    name: "Bathroom Cleaning",
    shortName: "Bathroom",
    tagline: "Showers, tubs, tile, glass & fixtures",
    description:
      "Showers, tubs, toilets, glass, tile and fixtures scrubbed, sanitized and polished to a shine.",
    image: "/images/bathroom-cleaning.webp",
    pricing: "hourly",
  },
  {
    id: "interior",
    name: "Additional Interior Cleaning",
    shortName: "Interior Add-Ons",
    tagline: "Dusting, floors, rooms & finishing touches",
    description:
      "Room-by-room cleaning and finishing touches — dusting, floors, glass, doors, stairs, linens, laundry folding and more.",
    image: "/images/cleaning-team-dusting.webp",
    pricing: "hourly",
  },
  {
    id: "specialty",
    name: "Specialty Cleaning",
    shortName: "Specialty",
    tagline: "Construction, carpets, events & more",
    description:
      "Specialty services such as post-construction, carpet and upholstery, exterior windows and event cleaning — quoted per project.",
    image: "/images/clean-living-room.webp",
    pricing: "custom",
    optional: true,
  },
];

type Entry = [name: string, description: string];

const RAW: Record<CategoryId, Entry[]> = {
  residential: [
    ["House Cleaning", "Thorough cleaning of your entire home — kitchens, bathrooms, bedrooms, living areas and floors."],
    ["Residential Cleaning", "Professional cleaning for every kind of home, tailored to your priorities and schedule."],
    ["Maid Service", "Friendly, reliable maid service that keeps your home consistently clean and comfortable."],
    ["Apartment Cleaning", "Efficient, detailed cleaning sized for apartments of any layout."],
    ["Condo Cleaning", "Complete condo cleaning — kitchen, baths, living spaces, balcony doors and floors."],
    ["Townhouse Cleaning", "Multi-level townhome cleaning including stairs, landings and every room."],
    ["Duplex Cleaning", "Cleaning for one or both sides of a duplex — ideal for owners and residents."],
    ["Standard Cleaning", "Our core clean: dusting, surfaces, kitchens, bathrooms, vacuuming and mopping."],
    ["General Cleaning", "An all-around refresh of the spaces you use every day."],
    ["Routine House Cleaning", "Regularly scheduled cleaning that keeps your home guest-ready."],
    ["Light House Cleaning", "A lighter touch-up clean for homes that are already in good shape."],
    ["One-Time Cleaning", "A single visit for special occasions, guests, or whenever you need a hand."],
    ["Weekly Cleaning", "Weekly visits for a consistently clean home — discounts available upon approval."],
    ["Biweekly Cleaning", "Every-other-week cleaning, our most popular recurring schedule — discounts available upon approval."],
    ["Monthly Cleaning", "A monthly reset to stay ahead of dust, grime and buildup."],
    ["Recurring Cleaning", "Set-it-and-forget-it cleaning on the schedule that fits your life."],
    ["Housekeeping Services", "Housekeeping help with cleaning, tidying, bed making and laundry folding."],
    ["Whole-Home Cleaning", "Every room, top to bottom, in a single visit."],
    ["Vacation Home Cleaning", "Cleaning before you arrive or after you leave your second home."],
  ],
  deep: [
    ["Deep House Cleaning", "A detailed top-to-bottom clean that reaches the areas routine cleaning skips."],
    ["Apartment Deep Cleaning", "Detailed deep cleaning for apartments — perfect before guests or after a busy season."],
    ["Kitchen Deep Cleaning", "Degreasing, appliance exteriors, cabinet fronts, backsplash and detailed surfaces."],
    ["Bathroom Deep Cleaning", "Soap scum, hard-water spots, grout and fixtures scrubbed in detail."],
    ["Detailed Cleaning", "Extra attention to edges, corners, trim and fixtures throughout the home."],
    ["Spring Cleaning", "A fresh-start seasonal deep clean for the whole house."],
    ["Seasonal Cleaning", "Seasonal resets to tackle buildup throughout the year."],
    ["Holiday Cleaning", "Get your home guest-ready before (or after) the holidays."],
    ["Baseboard Cleaning", "Hand-wiped baseboards free of dust, scuffs and grime."],
    ["Interior Cabinet Cleaning", "Emptied cabinets wiped and sanitized inside (please empty beforehand)."],
    ["Interior Window Cleaning", "Streak-free interior window glass throughout the home."],
    ["Window Sill Cleaning", "Dust, debris and grime removed from sills and ledges."],
    ["Ceiling Fan Cleaning", "Blades, housings and light kits dusted and wiped."],
    ["Blind Dusting", "Blinds and slats carefully dusted throughout the home."],
    ["Detailed Dusting", "High and low dusting — frames, ledges, vents, decor and furniture."],
    ["Shower & Bathtub Cleaning", "Detailed scrubbing of showers and tubs to remove soap scum and buildup."],
    ["Tile & Grout Scrubbing", "Hand-scrubbed tile and grout lines in kitchens and bathrooms."],
  ],
  move: [
    ["Move-In Cleaning", "Start fresh — a full clean of your new home before you unpack."],
    ["Move-Out Cleaning", "Leave your old home spotless for the next owner, tenant or final walkthrough."],
    ["Apartment Move-Out Cleaning", "Detailed move-out cleaning to help you prepare for your apartment inspection."],
    ["Apartment Move-In Cleaning", "Clean, sanitized cabinets, appliances and bathrooms before move-in day."],
    ["House Move-Out Cleaning", "Whole-house move-out cleaning, inside cabinets and appliances included on request."],
    ["House Move-In Cleaning", "Make your new house truly yours with a fresh, detailed clean."],
    ["End-of-Lease Cleaning", "Cleaning at the end of a lease to help you prepare for the final inspection."],
    ["Rental Property Cleaning", "Cleaning between tenants for owners and landlords."],
    ["Tenant Turnover Cleaning", "Fast, thorough turnovers so your unit is ready for the next resident."],
    ["Vacant Home Cleaning", "Cleaning of empty homes — ready for listing, showing or move-in."],
    ["Empty Apartment Cleaning", "Floor-to-ceiling cleaning of empty apartment units."],
    ["Landlord Cleaning", "Dependable cleaning partner for independent landlords."],
    ["Property Management Cleaning", "Turnover and common-area cleaning for property managers."],
    ["Rental Turnover Cleaning", "Quick-turn cleaning between rentals and residents."],
    ["Pre-Move Cleaning", "Clean the home you're moving into before your belongings arrive."],
    ["Post-Move Cleaning", "Clean up after the movers leave — dust, debris and scuffs handled."],
    ["Real Estate Showing Cleaning", "Make a great first impression for buyers and showings."],
    ["Open House Preparation Cleaning", "A polished, picture-ready home for your open house."],
    ["Airbnb Cleaning", "Guest-ready turnovers with bed making and bathroom resets."],
    ["Vacation Rental Turnover Cleaning", "Reliable turnovers between vacation rental guests."],
  ],
  commercial: [
    ["Commercial Cleaning", "Professional cleaning for businesses of every size."],
    ["Office Cleaning", "Desks, common areas, restrooms and floors cleaned on your schedule."],
    ["Janitorial Cleaning", "Routine janitorial service including trash, restrooms and floors."],
    ["Small Business Cleaning", "Affordable, flexible cleaning for small businesses."],
    ["Retail Store Cleaning", "Clean, inviting sales floors, fitting rooms, glass and restrooms."],
    ["Business Office Cleaning", "A clean, professional workplace for staff and clients."],
    ["Conference Room Cleaning", "Tables, chairs, glass and electronics surfaces wiped and refreshed."],
    ["Office Restroom Cleaning", "Sanitized restrooms, fixtures, mirrors and floors."],
    ["Employee Breakroom Cleaning", "Counters, sinks, microwaves, tables and appliance exteriors cleaned."],
    ["Reception Area Cleaning", "A spotless first impression at your front desk."],
    ["Lobby Cleaning", "Clean, welcoming lobbies, entries and glass doors."],
    ["Waiting Room Cleaning", "Seating, surfaces, floors and touchpoints cleaned and sanitized."],
    ["Leasing Office Cleaning", "Keep your leasing office ready for prospective residents."],
    ["Apartment Common Area Cleaning", "Hallways, mail rooms, fitness centers and shared spaces."],
    ["Clubhouse Cleaning", "Community clubhouse and event-space cleaning."],
    ["Real Estate Office Cleaning", "Clean, client-ready real estate offices."],
    ["Salon Cleaning", "Stations, sinks, mirrors and floors cleaned for salons."],
    ["Barbershop Cleaning", "Chairs, stations, mirrors and floors cleaned for barbershops."],
    ["Recurring Commercial Cleaning", "Scheduled commercial cleaning — daily, weekly or custom."],
    ["After-Hours Office Cleaning", "Evening and after-hours cleaning so work isn't interrupted."],
  ],
  kitchen: [
    ["Kitchen Cleaning", "Counters, sink, appliance exteriors, cabinet fronts and floors cleaned."],
    ["Kitchen Deep Cleaning", "Degreasing, appliance exteriors, cabinet fronts, backsplash and detailed surfaces."],
    ["Oven Interior Cleaning", "Inside-the-oven degreasing of racks, walls and door glass."],
    ["Refrigerator Interior Cleaning", "Shelves, drawers and interior walls wiped and sanitized."],
    ["Microwave Cleaning", "Inside and out — splatters and stains removed."],
    ["Stove Top Cleaning", "Burners, grates and cooktop surfaces degreased."],
    ["Kitchen Countertop Cleaning", "Countertops cleaned and sanitized, safe for your surfaces."],
    ["Kitchen Cabinet Cleaning", "Cabinet doors, handles and fronts wiped of grease and fingerprints."],
    ["Inside Cabinet Cleaning", "Emptied cabinets and drawers wiped inside."],
    ["Kitchen Sink Cleaning", "Sink basin, faucet and fixtures scrubbed and shined."],
    ["Appliance Exterior Cleaning", "Stainless and appliance exteriors cleaned streak-free."],
    ["Kitchen Floor Cleaning", "Kitchen floors swept, mopped and edges detailed."],
    ["Kitchen Backsplash Cleaning", "Backsplash tile and grout wiped and degreased."],
    ["Pantry Surface Cleaning", "Pantry shelves and surfaces wiped down."],
    ["Dishwashing Add-On", "We'll wash or load the dishes while we're there."],
  ],
  bathroom: [
    ["Bathroom Cleaning", "Complete bathroom cleaning — toilets, showers, tubs, sinks, mirrors and floors."],
    ["Bathroom Deep Cleaning", "Soap scum, hard-water spots, grout and fixtures scrubbed in detail."],
    ["Shower Cleaning", "Shower walls, floors, doors and fixtures scrubbed clean."],
    ["Bathtub Cleaning", "Tubs scrubbed and rinsed, rings and buildup removed."],
    ["Toilet Cleaning", "Toilets cleaned and sanitized inside and out."],
    ["Bathroom Sink Cleaning", "Sinks, faucets and drains scrubbed and polished."],
    ["Bathroom Countertop Cleaning", "Vanity counters cleared, cleaned and sanitized."],
    ["Bathroom Mirror Cleaning", "Streak-free mirrors."],
    ["Shower Glass Cleaning", "Glass doors and panels cleaned of spots and soap scum."],
    ["Bathroom Tile Cleaning", "Wall and floor tile scrubbed and wiped."],
    ["Bathroom Grout Cleaning", "Grout lines scrubbed to lift built-up grime."],
    ["Bathroom Floor Cleaning", "Floors and edges cleaned and sanitized."],
    ["Bathroom Fixture Cleaning", "Faucets, handles, towel bars and hardware polished."],
  ],
  interior: [
    ["Dusting Services", "Thorough dusting of surfaces, decor, furniture and fixtures."],
    ["Furniture Dusting", "Tables, dressers, shelves and furniture carefully dusted."],
    ["Surface Sanitizing", "High-touch surfaces wiped and sanitized."],
    ["Interior Glass Cleaning", "Glass tables, doors and interior glass cleaned streak-free."],
    ["Mirror Cleaning", "Every mirror polished streak-free."],
    ["Baseboard Dusting", "Quick dusting of baseboards throughout the home."],
    ["Light Fixture Dusting", "Reachable light fixtures and lamps dusted."],
    ["Ceiling Fan Dusting", "Fan blades dusted to keep air fresh."],
    ["Window Track Cleaning", "Dirt and debris removed from window tracks."],
    ["Interior Door Cleaning", "Doors wiped of fingerprints, scuffs and dust."],
    ["Door Frame Cleaning", "Door frames and trim wiped down."],
    ["Light Switch Cleaning", "Switch plates and outlet covers wiped and sanitized."],
    ["Vacuuming", "Carpets, rugs and floors vacuumed, including edges."],
    ["Hardwood Floor Cleaning", "Hardwood floors cleaned with wood-safe products."],
    ["Tile Floor Cleaning", "Tile floors swept and mopped."],
    ["Laminate Floor Cleaning", "Laminate and vinyl plank floors cleaned streak-free."],
    ["Floor Mopping", "Hard floors mopped throughout the home."],
    ["Staircase Cleaning", "Stairs, railings and banisters vacuumed and wiped."],
    ["Hallway Cleaning", "Hallways dusted, wiped and floors cleaned."],
    ["Bedroom Cleaning", "Bedrooms dusted, tidied, vacuumed and beds made."],
    ["Living Room Cleaning", "Living spaces dusted, vacuumed and refreshed."],
    ["Dining Room Cleaning", "Tables, chairs, fixtures and floors cleaned."],
    ["Home Office Cleaning", "Desks, shelves and floors cleaned (we never disturb paperwork)."],
    ["Laundry Room Cleaning", "Washer and dryer exteriors, counters, sink and floors cleaned."],
    ["Bed Making", "Beds neatly made with your linens."],
    ["Bed Linen Changing", "Fresh linens put on — just leave clean sheets out."],
    ["Laundry Folding", "Clean laundry neatly folded."],
    ["Pet Hair Removal", "Extra attention to pet hair on floors and furniture."],
    ["Indoor Trash Bin Emptying", "Indoor trash emptied and liners replaced."],
  ],
  specialty: [
    ["Post-Construction Cleaning", "Dust and debris cleanup after construction projects."],
    ["Post-Renovation Cleaning", "Cleaning after renovations so you can enjoy your new space."],
    ["New Construction Final Cleaning", "Final clean of new builds before move-in or closing."],
    ["After-Remodel Cleaning", "Dust and debris removal after a kitchen or bath remodel."],
    ["Interior Garage Cleaning", "Interior garage sweeping, dusting and organization help."],
    ["Carpet Cleaning", "Carpet cleaning to refresh high-traffic areas."],
    ["Area Rug Cleaning", "Cleaning to refresh area rugs."],
    ["Upholstery Cleaning", "Fabric furniture cleaning."],
    ["Sofa Cleaning", "Sofa and sectional cleaning."],
    ["Mattress Vacuuming", "Mattresses vacuumed to remove dust and debris."],
    ["Professional Window Cleaning", "Detailed window cleaning service."],
    ["Exterior Window Cleaning", "Exterior window glass cleaning."],
    ["Eco-Friendly Cleaning", "Cleaning with eco-conscious products on request."],
    ["Fragrance-Free Cleaning", "Fragrance-free products for sensitive households."],
    ["Event Preparation Cleaning", "Get your home or venue ready before a party or event."],
    ["Post-Event Cleaning", "Cleanup after parties, gatherings and events."],
  ],
};

export type Service = {
  /** Stable id used for admin overrides and URLs (?service=...) */
  id: string;
  name: string;
  description: string;
  /** Spanish name/description (falls back to English). */
  nameEs: string;
  descriptionEs: string;
  /** Primary category first. */
  categories: CategoryId[];
  pricing: PricingMode;
  defaultEnabled: boolean;
  custom?: boolean;
};

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const PRICING_RANK: Record<PricingMode, number> = { hourly: 0, deep: 1, custom: 2 };

function buildCatalog(): Service[] {
  const map = new Map<string, Service>();
  for (const cat of CATEGORIES) {
    for (const [name, description] of RAW[cat.id]) {
      const id = slugify(name);
      const existing = map.get(id);
      if (existing) {
        existing.categories.push(cat.id);
        if (PRICING_RANK[cat.pricing] > PRICING_RANK[existing.pricing]) existing.pricing = cat.pricing;
        continue;
      }
      map.set(id, {
        id,
        name,
        description,
        nameEs: SERVICE_ES[id]?.name ?? name,
        descriptionEs: SERVICE_ES[id]?.description ?? description,
        categories: [cat.id],
        pricing: /deep/i.test(name) ? "deep" : cat.pricing,
        defaultEnabled: !cat.optional,
      });
    }
  }
  return [...map.values()];
}

export const CATALOG: Service[] = buildCatalog();

export function getCategory(id: CategoryId) {
  return CATEGORIES.find((c) => c.id === id)!;
}
