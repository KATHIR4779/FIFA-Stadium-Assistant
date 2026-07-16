// ============================================================================
// Shared Type Definitions for the FIFA 2026 Smart Stadium Assistant
// ============================================================================

/** User roles within the stadium ecosystem */
export type UserRole = "fan" | "volunteer" | "staff" | "organizer";

/** Accessibility needs a user may declare */
export interface AccessibilityNeeds {
  mobility: boolean;   // wheelchair, limited mobility
  vision: boolean;     // low vision, blind
  hearing: boolean;    // deaf, hard of hearing
}

/** Supported languages for multilingual assistance */
export type SupportedLanguage =
  | "en" | "es" | "fr" | "pt" | "ar"
  | "de" | "ja" | "ko" | "zh" | "hi";

/** User context sent with every chat request */
export interface UserContext {
  role: UserRole;
  venueId: string;
  language: SupportedLanguage;
  accessibility: AccessibilityNeeds;
}

/** A single message in the conversation */
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

/** Request body for POST /api/chat */
export interface ChatRequest {
  message: string;
  sessionId: string;
  userContext: UserContext;
}

/** Response body from POST /api/chat */
export interface ChatResponse {
  reply: string;
  sessionId: string;
  isMock: boolean;
}

/** Stadium venue data */
export interface Venue {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
  sections: VenueSection[];
  amenities: string[];
  accessibilityFeatures: string[];
  sustainabilityFeatures: string[];
  emergencyExits: string[];
}

/** A section within a stadium */
export interface VenueSection {
  id: string;
  name: string;
  level: "lower" | "middle" | "upper" | "vip";
  gateAccess: string;
}

/** Session data stored in memory */
export interface SessionData {
  id: string;
  messages: ChatMessage[];
  userContext: UserContext;
  createdAt: number;
  lastActive: number;
}

/** API error response */
export interface ApiError {
  error: string;
  code: string;
  details?: string;
}
