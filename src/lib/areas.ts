export type ServiceArea = {
  slug: string;
  name: string;
  /** e.g. "Spring, TX" */
  label: string;
  county: string;
  lat: number;
  lng: number;
  zips: string[];
  communities: string[];
  intro: string;
  detail: string;
  homeBase?: boolean;
};

export const AREAS: ServiceArea[] = [
  {
    slug: "spring-tx",
    name: "Spring",
    label: "Spring, TX",
    county: "Harris & Montgomery County",
    lat: 30.0799,
    lng: -95.4172,
    zips: ["77373", "77379", "77386", "77388", "77389"],
    communities: ["Old Town Spring", "Gleannloch Farms", "Northgate Forest", "Champion Forest", "Spring Creek", "Harmony"],
    intro:
      "Spring is home base for Emili's Cleaning Co. We clean houses, apartments and businesses all over Spring — from the shady streets near Old Town Spring to the newer neighborhoods off the Grand Parkway.",
    detail:
      "Because we're local, scheduling in Spring is easy and flexible. Whether you need a one-time deep clean before guests arrive, recurring biweekly maid service, or a move-out clean before your final walkthrough, our crews are close by.",
    homeBase: true,
  },
  {
    slug: "klein-tx",
    name: "Klein",
    label: "Klein, TX",
    county: "Harris County",
    lat: 30.0425,
    lng: -95.5275,
    zips: ["77379", "77388", "77389", "77375"],
    communities: ["Klein", "Champions area", "Louetta", "Kuykendahl corridor", "Vintage Park area"],
    intro:
      "Klein families stay busy — school, sports, work and everything in between. Our Klein house cleaning and maid services give you your evenings and weekends back.",
    detail:
      "We clean single-family homes, townhomes and apartments throughout the Klein area, and we're just minutes away from our Spring home base for fast, flexible scheduling.",
  },
  {
    slug: "the-woodlands-tx",
    name: "The Woodlands",
    label: "The Woodlands, TX",
    county: "Montgomery & Harris County",
    lat: 30.1658,
    lng: -95.4613,
    zips: ["77380", "77381", "77382", "77384", "77385", "77389"],
    communities: ["Alden Bridge", "Cochran's Crossing", "College Park", "Creekside Park", "Grogan's Mill", "Indian Springs", "Panther Creek", "Sterling Ridge"],
    intro:
      "From Creekside Park to Panther Creek, we help homeowners and businesses in The Woodlands keep their spaces beautiful, fresh and guest-ready.",
    detail:
      "Larger Woodlands homes often benefit from a 3- or 4-person crew so detailed cleaning gets done in less time. Not sure what you need? Text us a few photos and we'll recommend the right crew size.",
  },
  {
    slug: "tomball-tx",
    name: "Tomball",
    label: "Tomball, TX",
    county: "Harris County",
    lat: 30.0972,
    lng: -95.6161,
    zips: ["77375", "77377"],
    communities: ["Old Town Tomball", "Tomball Parkway (SH 249) corridor", "Northpointe", "Lakewood Forest"],
    intro:
      "Tomball has small-town charm and fast-growing neighborhoods — and we're happy to keep both sparkling with dependable house and commercial cleaning.",
    detail:
      "We serve homes, rentals and small businesses throughout Tomball with transparent hourly pricing, flexible scheduling and free photo estimates.",
  },
  {
    slug: "cypress-tx",
    name: "Cypress",
    label: "Cypress, TX",
    county: "Harris County",
    lat: 29.9691,
    lng: -95.6972,
    zips: ["77429", "77433", "77410"],
    communities: ["Bridgeland", "Towne Lake", "Fairfield", "Coles Crossing", "Cypress Creek Lakes"],
    intro:
      "Cypress homeowners trust professional cleaners to keep busy households running smoothly. Our Cypress maid service fits around your schedule.",
    detail:
      "From master-planned communities to established neighborhoods, we provide house cleaning, deep cleaning and move-in/move-out cleaning across Cypress.",
  },
  {
    slug: "humble-tx",
    name: "Humble",
    label: "Humble, TX",
    county: "Harris County",
    lat: 29.9988,
    lng: -95.2622,
    zips: ["77338", "77346", "77396"],
    communities: ["Atascocita", "Eagle Springs", "Fall Creek", "Downtown Humble", "Lake Houston area"],
    intro:
      "Need a reliable house cleaner in Humble or Atascocita? Emili's Cleaning Co. brings professional, friendly cleaning crews to homes and businesses across the Humble area.",
    detail:
      "We offer one-time cleans, recurring maid service, deep cleaning and rental turnovers — with prices you'll know up front.",
  },
  {
    slug: "kingwood-tx",
    name: "Kingwood",
    label: "Kingwood, TX",
    county: "Harris & Montgomery County",
    lat: 30.0466,
    lng: -95.1885,
    zips: ["77339", "77345", "77325"],
    communities: ["Kings Forest", "Elm Grove", "Woodland Hills", "Kingwood Lakes", "Town Center area"],
    intro:
      "Kingwood — the Livable Forest — deserves homes that feel just as fresh. We provide detailed house cleaning and maid services throughout Kingwood's villages.",
    detail:
      "Choose a 2, 3 or 4-person crew for routine cleaning, a seasonal deep clean, or a move-in/move-out clean before your next chapter.",
  },
  {
    slug: "conroe-tx",
    name: "Conroe",
    label: "Conroe, TX",
    county: "Montgomery County",
    lat: 30.3119,
    lng: -95.4561,
    zips: ["77301", "77302", "77303", "77304", "77384", "77385"],
    communities: ["Downtown Conroe", "Lake Conroe area", "Grand Central Park", "Woodforest", "April Sound area"],
    intro:
      "From downtown Conroe to the homes around Lake Conroe, we help families, vacation-home owners and businesses keep their spaces spotless.",
    detail:
      "We clean primary residences, lake homes, short-term rentals and offices throughout Conroe — just send pictures for a free time estimate.",
  },
];

export function getArea(slug: string) {
  return AREAS.find((a) => a.slug === slug);
}

export const AREA_NAMES = AREAS.map((a) => a.name);
