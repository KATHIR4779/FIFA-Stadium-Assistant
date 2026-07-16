// ============================================================================
// FIFA World Cup 2026 Venue Data
// All 16 host stadiums across USA, Mexico, and Canada
// ============================================================================

import { Venue } from "../types";

export const venues: Venue[] = [
  {
    id: "metlife",
    name: "MetLife Stadium",
    city: "East Rutherford, NJ",
    country: "USA",
    capacity: 82500,
    sections: [
      { id: "lower-100", name: "Lower Bowl 100s", level: "lower", gateAccess: "Gate A" },
      { id: "lower-200", name: "Lower Bowl 200s", level: "lower", gateAccess: "Gate B" },
      { id: "mid-300", name: "Mezzanine 300s", level: "middle", gateAccess: "Gate C" },
      { id: "upper-400", name: "Upper Deck 400s", level: "upper", gateAccess: "Gate D" },
      { id: "vip-suite", name: "VIP Suites", level: "vip", gateAccess: "VIP Entrance" },
    ],
    amenities: [
      "Food courts on every level",
      "Family restrooms near Gates A & C",
      "First-aid stations at Sections 110, 230, 340",
      "Fan merchandise shops at Gates A, B, D",
      "Water refill stations throughout concourse",
      "Prayer/meditation rooms near Gate C",
    ],
    accessibilityFeatures: [
      "Wheelchair seating in Sections 104, 129, 228, 334",
      "Elevator access at Gates A, B, C",
      "Sensory rooms near Section 115",
      "Assistive listening devices at Guest Services",
      "Braille signage at all gates",
      "Companion seating available",
    ],
    sustainabilityFeatures: [
      "Zero-waste sorting stations every 50 meters",
      "Compostable food containers at all vendors",
      "Electric shuttle from transit hub",
      "Solar panels powering 30% of stadium operations",
    ],
    emergencyExits: [
      "Gate A — North exit to Lot A",
      "Gate B — East exit to Lot J",
      "Gate C — South exit to transit plaza",
      "Gate D — West exit to Lot G",
      "Emergency exits at each stairwell (marked with green signs)",
    ],
  },
  {
    id: "sofi",
    name: "SoFi Stadium",
    city: "Inglewood, CA",
    country: "USA",
    capacity: 70240,
    sections: [
      { id: "lower-100", name: "Lower Bowl 100s", level: "lower", gateAccess: "Gate 1" },
      { id: "mid-200", name: "Club Level 200s", level: "middle", gateAccess: "Gate 2" },
      { id: "upper-300", name: "Upper Level 300s", level: "upper", gateAccess: "Gate 3" },
      { id: "vip-suites", name: "Luxury Suites", level: "vip", gateAccess: "VIP Gate" },
    ],
    amenities: [
      "Oculus 360° video board",
      "Food hall with 20+ vendors",
      "Family zones near Gate 1",
      "First-aid at Sections 112, 225",
      "Free Wi-Fi throughout stadium",
    ],
    accessibilityFeatures: [
      "ADA seating in all levels",
      "Ramped access from parking structure",
      "Sensory-friendly spaces at Level 1",
      "Sign language interpreters on request",
      "Audio description service available",
    ],
    sustainabilityFeatures: [
      "LEED Gold certified facility",
      "Rainwater harvesting system",
      "100% renewable energy powered",
      "Reusable cup program",
    ],
    emergencyExits: [
      "Gate 1 — South to Century Blvd",
      "Gate 2 — East to parking structure",
      "Gate 3 — North to Prairie Ave",
      "VIP Gate — West to Hollywood Park",
    ],
  },
  {
    id: "at-and-t",
    name: "AT&T Stadium",
    city: "Arlington, TX",
    country: "USA",
    capacity: 80000,
    sections: [
      { id: "lower-100", name: "Lower Level 100s", level: "lower", gateAccess: "Gate A" },
      { id: "main-200", name: "Main Level 200s", level: "middle", gateAccess: "Gate B" },
      { id: "upper-300", name: "Upper Level 300s", level: "upper", gateAccess: "Gate C" },
      { id: "hall-fame", name: "Hall of Fame Level", level: "vip", gateAccess: "Gate D" },
    ],
    amenities: [
      "World's largest column-free interior",
      "Giant center-hung HD display",
      "Miller Lite Club & Bud Light Club",
      "First-aid near Sections 101, 220, 345",
      "ATMs on every level",
    ],
    accessibilityFeatures: [
      "Wheelchair platforms in every section",
      "Elevator banks at all corners",
      "Service animal relief areas",
      "Closed captioning on video boards",
    ],
    sustainabilityFeatures: [
      "LED lighting throughout",
      "Water recycling for landscape",
      "Recycling stations at every concession area",
    ],
    emergencyExits: [
      "Gate A — North plaza",
      "Gate B — East parking",
      "Gate C — South plaza",
      "Gate D — West lot",
    ],
  },
  {
    id: "hard-rock",
    name: "Hard Rock Stadium",
    city: "Miami Gardens, FL",
    country: "USA",
    capacity: 65326,
    sections: [
      { id: "lower-100", name: "Lower Bowl 100s", level: "lower", gateAccess: "Gate 1" },
      { id: "club-200", name: "Club Level 200s", level: "middle", gateAccess: "Gate 2" },
      { id: "upper-300", name: "Upper Deck 300s", level: "upper", gateAccess: "Gate 4" },
      { id: "vip-72", name: "72 Club", level: "vip", gateAccess: "VIP West" },
    ],
    amenities: [
      "Canopy shade structure",
      "Misting fans in concourse",
      "International food village",
      "First-aid near Gate 2",
    ],
    accessibilityFeatures: [
      "ADA seating with shade coverage",
      "Cooling stations for mobility-impaired guests",
      "Accessible drop-off zones",
      "Assistive listening systems",
    ],
    sustainabilityFeatures: [
      "Solar canopy generating clean energy",
      "Waste diversion program (75% target)",
      "Locally sourced food options",
    ],
    emergencyExits: [
      "Gate 1 — NW parking",
      "Gate 2 — NE plaza",
      "Gate 4 — South lot",
      "VIP West — dedicated VIP exit",
    ],
  },
  {
    id: "lincoln",
    name: "Lincoln Financial Field",
    city: "Philadelphia, PA",
    country: "USA",
    capacity: 69596,
    sections: [
      { id: "lower-100", name: "Lower Level 100s", level: "lower", gateAccess: "Gate A" },
      { id: "mid-200", name: "Mezzanine 200s", level: "middle", gateAccess: "Gate B" },
      { id: "upper-200", name: "Upper Level 200s", level: "upper", gateAccess: "Gate C" },
    ],
    amenities: [
      "Eagles team store",
      "Multiple craft beer gardens",
      "First-aid stations near Gates A, C",
    ],
    accessibilityFeatures: [
      "Wheelchair seating in all levels",
      "Sensory kits at Guest Services",
      "Elevator access at all gates",
    ],
    sustainabilityFeatures: [
      "Over 11,000 solar panels installed",
      "14 micro wind turbines",
      "SCA certified sustainability leader",
    ],
    emergencyExits: [
      "Gate A — South Broad Street",
      "Gate B — East Pattison Ave",
      "Gate C — West parking lots",
    ],
  },
  {
    id: "lumen",
    name: "Lumen Field",
    city: "Seattle, WA",
    country: "USA",
    capacity: 68740,
    sections: [
      { id: "lower-100", name: "Lower Bowl 100s", level: "lower", gateAccess: "North Gate" },
      { id: "club-200", name: "Club Level", level: "middle", gateAccess: "Club Entrance" },
      { id: "upper-300", name: "Upper Bowl 300s", level: "upper", gateAccess: "South Gate" },
    ],
    amenities: [
      "Craft beer marketplace",
      "Local food vendor showcase",
      "First-aid in Sections 109, 310",
    ],
    accessibilityFeatures: [
      "ADA seating on all levels",
      "Light rail access directly to stadium",
      "Service animal areas",
    ],
    sustainabilityFeatures: [
      "Composting program at all food areas",
      "Public transit incentives for fans",
      "Biodegradable serviceware",
    ],
    emergencyExits: [
      "North Gate — Occidental Ave",
      "South Gate — Royal Brougham Way",
      "East concourse exits",
    ],
  },
  {
    id: "gillette",
    name: "Gillette Stadium",
    city: "Foxborough, MA",
    country: "USA",
    capacity: 65878,
    sections: [
      { id: "lower-100", name: "Lower Bowl 100s", level: "lower", gateAccess: "Gate A" },
      { id: "club-200", name: "Putnam Club", level: "middle", gateAccess: "Gate B" },
      { id: "upper-300", name: "Upper Level 300s", level: "upper", gateAccess: "Gate C" },
    ],
    amenities: [
      "Patriot Place shopping/dining complex",
      "Hall at Patriot Place museum",
      "First-aid at Gates A, C",
    ],
    accessibilityFeatures: [
      "Wheelchair access at all levels",
      "Accessible parking in Lot 1",
      "Companion seating program",
    ],
    sustainabilityFeatures: [
      "Recycling stations at every gate",
      "Energy-efficient LED lights",
      "Electric vehicle charging stations",
    ],
    emergencyExits: [
      "Gate A — North to Rt. 1",
      "Gate B — East to Patriot Place",
      "Gate C — West parking lots",
    ],
  },
  {
    id: "mercedes",
    name: "Mercedes-Benz Stadium",
    city: "Atlanta, GA",
    country: "USA",
    capacity: 71000,
    sections: [
      { id: "lower-100", name: "Lower Bowl 100s", level: "lower", gateAccess: "Gate 1" },
      { id: "mid-200", name: "200 Level", level: "middle", gateAccess: "Gate 3" },
      { id: "upper-300", name: "300 Level", level: "upper", gateAccess: "Gate 5" },
    ],
    amenities: [
      "Retractable roof & halo video board",
      "Fan-first pricing on food & drinks",
      "First-aid near Gate 1, Gate 5",
    ],
    accessibilityFeatures: [
      "ADA seating on every level",
      "Sensory-inclusive certified venue",
      "Wheelchair escorts available",
    ],
    sustainabilityFeatures: [
      "LEED Platinum certified",
      "4,000 solar panels on-site",
      "Storm water collection cisterns",
    ],
    emergencyExits: [
      "Gate 1 — Northside Dr",
      "Gate 3 — MLK Jr Dr",
      "Gate 5 — Mitchell St",
    ],
  },
  {
    id: "nrg",
    name: "NRG Stadium",
    city: "Houston, TX",
    country: "USA",
    capacity: 72220,
    sections: [
      { id: "lower-100", name: "Lower Level 100s", level: "lower", gateAccess: "North Gate" },
      { id: "club-300", name: "Club Level 300s", level: "middle", gateAccess: "Club Gate" },
      { id: "upper-500", name: "Upper Level 500s", level: "upper", gateAccess: "South Gate" },
    ],
    amenities: [
      "Retractable roof for climate control",
      "BBQ food hall",
      "First-aid at North & South gates",
    ],
    accessibilityFeatures: [
      "ADA seating throughout",
      "Accessible restrooms on all levels",
      "Hearing loop system in key areas",
    ],
    sustainabilityFeatures: [
      "HVAC energy recovery systems",
      "LED lighting retrofit completed",
      "Fan rideshare coordination program",
    ],
    emergencyExits: [
      "North Gate — Kirby Dr",
      "South Gate — NRG Parkway",
      "Club Gate — Fannin St exit",
    ],
  },
  {
    id: "arrowhead",
    name: "GEHA Field at Arrowhead Stadium",
    city: "Kansas City, MO",
    country: "USA",
    capacity: 76416,
    sections: [
      { id: "lower-100", name: "Lower Level 100s", level: "lower", gateAccess: "Gate A" },
      { id: "upper-300", name: "Upper Level 300s", level: "upper", gateAccess: "Gate D" },
      { id: "vip-club", name: "Chairman's Club", level: "vip", gateAccess: "Gate F" },
    ],
    amenities: [
      "Famous BBQ vendor row",
      "Chiefs Hall of Honor",
      "First-aid at Gate A, Gate D",
    ],
    accessibilityFeatures: [
      "Wheelchair seating in lower & upper levels",
      "Accessible parking in Lot B",
      "Guest Services mobility assistance",
    ],
    sustainabilityFeatures: [
      "Recycling & composting program",
      "Water bottle refill stations",
      "Shuttle service from downtown KC",
    ],
    emergencyExits: [
      "Gate A — North to I-70",
      "Gate D — South lot",
      "Gate F — East Blue Ridge exit",
    ],
  },
  {
    id: "bmo",
    name: "BMO Field",
    city: "Toronto, ON",
    country: "Canada",
    capacity: 45500,
    sections: [
      { id: "lower-100", name: "Lower Bowl", level: "lower", gateAccess: "Gate 1" },
      { id: "east-stand", name: "East Stand", level: "middle", gateAccess: "Gate 3" },
      { id: "upper-200", name: "Upper Deck", level: "upper", gateAccess: "Gate 5" },
    ],
    amenities: [
      "Lakeside location at Exhibition Place",
      "Local craft brewery section",
      "First-aid at Gates 1, 5",
    ],
    accessibilityFeatures: [
      "Accessible entrance at Gate 1",
      "Wheelchair areas in all stands",
      "TTC accessible transit connections",
    ],
    sustainabilityFeatures: [
      "Green roof on south stand",
      "Electric GO Transit connections",
      "Zero single-use plastics policy",
    ],
    emergencyExits: [
      "Gate 1 — Lakeshore Blvd",
      "Gate 3 — Princes' Blvd",
      "Gate 5 — Manitoba Dr",
    ],
  },
  {
    id: "bc-place",
    name: "BC Place",
    city: "Vancouver, BC",
    country: "Canada",
    capacity: 54500,
    sections: [
      { id: "lower-100", name: "Lower Bowl", level: "lower", gateAccess: "Gate A" },
      { id: "mid-200", name: "Upper Bowl", level: "middle", gateAccess: "Gate D" },
      { id: "club", name: "Edgewater Casino Club", level: "vip", gateAccess: "Gate B" },
    ],
    amenities: [
      "Retractable roof",
      "SkyTrain connection (Stadium-Chinatown station)",
      "Pacific Rim food vendors",
      "First-aid at Gate A, Gate D",
    ],
    accessibilityFeatures: [
      "SkyTrain elevator access",
      "Wheelchair seating on all levels",
      "Accessible drop-off on Expo Blvd",
    ],
    sustainabilityFeatures: [
      "Retractable roof reduces energy use",
      "Transit-first access planning",
      "Waste diversion program",
    ],
    emergencyExits: [
      "Gate A — Beatty St",
      "Gate B — Expo Blvd",
      "Gate D — Pacific Blvd",
    ],
  },
  {
    id: "azteca",
    name: "Estadio Azteca",
    city: "Mexico City",
    country: "Mexico",
    capacity: 87523,
    sections: [
      { id: "platea", name: "Platea (Lower)", level: "lower", gateAccess: "Acceso 1" },
      { id: "preferente", name: "Preferente (Middle)", level: "middle", gateAccess: "Acceso 5" },
      { id: "cabecera", name: "Cabecera (Upper)", level: "upper", gateAccess: "Acceso 9" },
      { id: "palcos", name: "Palcos (VIP)", level: "vip", gateAccess: "Acceso VIP" },
    ],
    amenities: [
      "Historic two-time World Cup Final venue",
      "Tacos & traditional Mexican cuisine vendors",
      "First-aid at Acceso 1, 5, 9",
      "Fan festival area outside Acceso 1",
    ],
    accessibilityFeatures: [
      "Wheelchair ramps at main entrances",
      "Dedicated accessible seating in Platea",
      "Accessible restrooms at all levels",
      "Bilingual (Spanish/English) accessibility staff",
    ],
    sustainabilityFeatures: [
      "Metro Azteca station (direct access)",
      "Reforestation program in surrounding areas",
      "Solar-powered auxiliary lighting",
    ],
    emergencyExits: [
      "Acceso 1 — Calzada de Tlalpan",
      "Acceso 5 — South parking area",
      "Acceso 9 — East avenue",
      "Acceso VIP — Dedicated VIP road",
    ],
  },
  {
    id: "akron",
    name: "Estadio Akron",
    city: "Guadalajara",
    country: "Mexico",
    capacity: 49850,
    sections: [
      { id: "lower", name: "Zona Baja", level: "lower", gateAccess: "Puerta 1" },
      { id: "upper", name: "Zona Alta", level: "upper", gateAccess: "Puerta 3" },
      { id: "vip", name: "Zona VIP", level: "vip", gateAccess: "Puerta VIP" },
    ],
    amenities: [
      "Volcano-inspired architecture",
      "Regional Jalisco cuisine",
      "First-aid at Puerta 1, 3",
    ],
    accessibilityFeatures: [
      "Ramp access at all gates",
      "Wheelchair spaces in Zona Baja",
      "Assistance staff at every entrance",
    ],
    sustainabilityFeatures: [
      "Natural ventilation design",
      "Water recycling system",
      "Green transportation shuttle from city center",
    ],
    emergencyExits: [
      "Puerta 1 — West avenue",
      "Puerta 3 — East parking",
      "Puerta VIP — North exit road",
    ],
  },
  {
    id: "monterrey",
    name: "Estadio BBVA",
    city: "Monterrey",
    country: "Mexico",
    capacity: 53500,
    sections: [
      { id: "lower", name: "Lower Ring", level: "lower", gateAccess: "Gate 1" },
      { id: "upper", name: "Upper Ring", level: "upper", gateAccess: "Gate 4" },
      { id: "vip-box", name: "Premium Boxes", level: "vip", gateAccess: "VIP Gate" },
    ],
    amenities: [
      "Mountain backdrop views (Cerro de la Silla)",
      "Northern Mexican cuisine (cabrito, machaca)",
      "First-aid at Gate 1, Gate 4",
    ],
    accessibilityFeatures: [
      "Modern facility with full ADA-equivalent access",
      "Elevator service to all levels",
      "Accessible restrooms throughout",
    ],
    sustainabilityFeatures: [
      "Energy-efficient design",
      "LED stadium lighting",
      "Public transit connections",
    ],
    emergencyExits: [
      "Gate 1 — Av. Pablo Livas",
      "Gate 4 — South parking",
      "VIP Gate — Dedicated VIP road",
    ],
  },
  {
    id: "levis",
    name: "Levi's Stadium",
    city: "Santa Clara, CA",
    country: "USA",
    capacity: 68500,
    sections: [
      { id: "lower-100", name: "Lower Bowl 100s", level: "lower", gateAccess: "Gate A" },
      { id: "club-200", name: "Club Level", level: "middle", gateAccess: "Gate B" },
      { id: "upper-300", name: "Upper Level 300s", level: "upper", gateAccess: "Gate C" },
      { id: "suites", name: "Luxury Suites", level: "vip", gateAccess: "Suite Entrance" },
    ],
    amenities: [
      "49ers Museum",
      "Intel & SAP technology showcases",
      "Levi's Stadium app for in-seat ordering",
      "First-aid at Gate A, Gate C",
    ],
    accessibilityFeatures: [
      "ADA seating in every section",
      "VTA light rail accessible stop",
      "Sensory bags at Guest Relations",
      "Wheelchair storage areas",
    ],
    sustainabilityFeatures: [
      "LEED Gold certified",
      "Green roof & native plant garden on NW terrace",
      "Bike valet parking",
      "On-site recycled water treatment",
    ],
    emergencyExits: [
      "Gate A — Tasman Dr",
      "Gate B — Great America Pkwy",
      "Gate C — Stars & Stripes Dr",
      "Suite Entrance — VIP lot",
    ],
  },
];

/**
 * Look up a venue by its ID.
 * Returns undefined if not found.
 */
export function getVenueById(id: string): Venue | undefined {
  return venues.find((v) => v.id === id);
}

/**
 * Get a summary list of venues (id and name only), useful for dropdowns.
 */
export function getVenueSummaries(): Array<{ id: string; name: string; city: string }> {
  return venues.map(({ id, name, city }) => ({ id, name, city }));
}
