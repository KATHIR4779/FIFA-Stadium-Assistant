// ============================================================================
// Mock AI Responses for Offline / No-API-Key Mode
// Returns contextual responses based on keyword matching in user messages
// ============================================================================

import { UserContext } from "../types";

interface MockRule {
  keywords: string[];
  response: string;
}

/** Language-specific greeting prefixes */
const greetings: Record<string, string> = {
  en: "",
  es: "¡Hola! ",
  fr: "Bonjour ! ",
  pt: "Olá! ",
  ar: "مرحبا! ",
  de: "Hallo! ",
  ja: "こんにちは！",
  ko: "안녕하세요! ",
  zh: "你好！",
  hi: "नमस्ते! ",
};

/** Core mock response rules — matched by keywords in the user message */
const mockRules: MockRule[] = [
  {
    keywords: ["seat", "section", "find", "where", "navigate", "directions", "gate", "entrance"],
    response:
      "To find your seat, look for the section number on your ticket. " +
      "Head to the nearest gate — stadium staff at each entrance will help you locate your exact row. " +
      "You can also follow the color-coded signs on the concourse. " +
      "Lower bowl sections are accessed from Ground Level gates, while upper sections require escalators or elevators at the main gate areas.",
  },
  {
    keywords: ["restroom", "bathroom", "toilet", "washroom"],
    response:
      "Restrooms are located on every level of the concourse, approximately every 2–3 sections. " +
      "Family restrooms with baby-changing stations are available near the main gates. " +
      "Accessible restrooms with grab bars and wider stalls are marked with the international accessibility symbol.",
  },
  {
    keywords: ["food", "eat", "drink", "restaurant", "vendor", "hungry", "concession"],
    response:
      "Food and beverage vendors are located throughout the concourse on every level. " +
      "Look for the Food Court areas near the main gates for the widest selection. " +
      "Vegetarian, vegan, halal, and kosher options are available — look for the dietary icons on vendor menus. " +
      "Water refill stations are free and located near every restroom area.",
  },
  {
    keywords: ["wheelchair", "mobility", "accessible", "disability", "elevator", "ramp"],
    response:
      "Wheelchair-accessible seating is available in designated areas on each level. " +
      "Elevators are located at the main gate areas — look for the accessibility signage. " +
      "If you need a wheelchair escort, visit Guest Services near any main gate. " +
      "Companion seating is available next to all accessible positions. " +
      "Accessible drop-off zones are at the main entrance.",
  },
  {
    keywords: ["blind", "vision", "braille", "screen reader", "audio description"],
    response:
      "Braille signage is available at all main gates and wayfinding points. " +
      "Audio description services can be requested at Guest Services. " +
      "Stadium staff are trained to provide verbal wayfinding assistance. " +
      "The stadium app supports screen readers — ask Guest Services for the app download link.",
  },
  {
    keywords: ["deaf", "hearing", "sign language", "caption", "listen"],
    response:
      "Assistive listening devices are available at Guest Services — bring a valid ID for borrowing. " +
      "Video boards display closed captions during announcements. " +
      "Sign language interpreters can be requested in advance through the FIFA accessibility hotline. " +
      "Visual alert systems are installed in restrooms and concourse areas.",
  },
  {
    keywords: ["emergency", "exit", "evacuate", "fire", "safety", "first aid", "medical"],
    response:
      "In an emergency, follow the illuminated green EXIT signs to the nearest stairwell. " +
      "Do NOT use elevators during emergencies. " +
      "First-aid stations are located at multiple points on each level — look for the red cross signs. " +
      "For medical emergencies, alert the nearest stadium staff member or call the in-stadium emergency number displayed on your ticket.",
  },
  {
    keywords: ["transport", "bus", "train", "metro", "uber", "taxi", "parking", "drive"],
    response:
      "Public transit is the recommended way to reach the stadium. Check the local transit authority for World Cup shuttle routes. " +
      "Rideshare (Uber/Lyft) drop-off and pickup zones are clearly marked outside the stadium. " +
      "If you're driving, parking lots open 4 hours before kickoff. " +
      "Electric vehicle charging stations are available in select lots. " +
      "Bike parking and valet are available at the main entrance.",
  },
  {
    keywords: ["sustainable", "recycle", "environment", "green", "eco", "waste", "compost"],
    response:
      "FIFA 2026 is committed to sustainability! Here's how you can help:\n" +
      "• Use the zero-waste sorting bins (landfill / recycling / compost) located every 50 meters.\n" +
      "• Choose the reusable cup option at beverage vendors — you'll receive a small discount.\n" +
      "• Refill your water bottle at free refill stations instead of buying plastic bottles.\n" +
      "• Take public transit or the electric shuttle — it reduces your carbon footprint significantly.\n" +
      "• Compostable containers are used at all official food vendors.",
  },
  {
    keywords: ["weather", "rain", "hot", "cold", "sun", "temperature"],
    response:
      "Check the stadium's roof status — some venues have retractable roofs. " +
      "For outdoor venues, sunscreen stations and misting fans are available on the concourse during hot weather. " +
      "Rain ponchos are sold at merchandise shops. " +
      "Stay hydrated! Free water refill stations are available on every level.",
  },
  {
    keywords: ["wifi", "internet", "phone", "charge", "battery"],
    response:
      "Free Wi-Fi is available throughout the stadium — connect to the 'FIFA2026_FanWiFi' network. " +
      "Phone charging stations are located near Guest Services and select concession areas. " +
      "Download the official FIFA 2026 app before the match for real-time updates, wayfinding, and in-seat ordering.",
  },
  {
    keywords: ["volunteer", "staff", "help", "information", "guest service"],
    response:
      "Stadium volunteers (wearing FIFA-branded vests) are stationed at every gate and throughout the concourse. " +
      "Guest Services desks are located at the main gates — they can help with lost items, accessibility needs, and general questions. " +
      "If you're a volunteer, check in at the Volunteer HQ near the staff entrance for your assignment.",
  },
  {
    keywords: ["hello", "hi", "hey", "help", "what can you"],
    response:
      "Welcome to the FIFA World Cup 2026! 🏟️⚽\n\n" +
      "I'm your Smart Stadium Assistant. I can help you with:\n" +
      "• 🗺️ **Finding your seat** or navigating the stadium\n" +
      "• ♿ **Accessibility support** (mobility, vision, hearing)\n" +
      "• 🚌 **Transportation** to and from the venue\n" +
      "• 🌱 **Sustainability tips** for an eco-friendly experience\n" +
      "• 🍔 **Food & amenities** locations\n" +
      "• 🚑 **Emergency & first-aid** information\n\n" +
      "Just ask me anything about your stadium experience!",
  },
];

/**
 * Find a mock response that matches the user's message by keyword.
 * Falls back to a generic helpful message if no keywords match.
 */
export function getMockResponse(message: string, userContext: UserContext): string {
  const lowerMessage = message.toLowerCase();
  const greeting = greetings[userContext.language] || "";

  // Try to find a matching rule
  for (const rule of mockRules) {
    if (rule.keywords.some((kw) => lowerMessage.includes(kw))) {
      return greeting + rule.response;
    }
  }

  // Default fallback
  return (
    greeting +
    "I'm here to help you with your FIFA World Cup 2026 stadium experience! " +
    "You can ask me about finding your seat, accessibility features, food options, " +
    "transportation, sustainability tips, emergency information, and more. " +
    "What would you like to know?"
  );
}
