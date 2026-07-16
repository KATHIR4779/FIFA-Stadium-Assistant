// ============================================================================
// Frontend Type Definitions
// Mirrors backend types for type-safe API communication
// ============================================================================

export type UserRole = "fan" | "volunteer" | "staff" | "organizer";

export interface AccessibilityNeeds {
  mobility: boolean;
  vision: boolean;
  hearing: boolean;
}

export type SupportedLanguage =
  | "en" | "es" | "fr" | "pt" | "ar"
  | "de" | "ja" | "ko" | "zh" | "hi";

export interface UserContext {
  role: UserRole;
  venueId: string;
  language: SupportedLanguage;
  accessibility: AccessibilityNeeds;
}

export interface ChatRequest {
  message: string;
  sessionId: string;
  userContext: UserContext;
}

export interface ChatResponse {
  reply: string;
  sessionId: string;
  isMock: boolean;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  isMock?: boolean;
}

export interface VenueSummary {
  id: string;
  name: string;
  city: string;
}

export interface ApiErrorResponse {
  error: string;
  code: string;
  details?: string;
}

/** Language display labels for the preferences UI */
export const LANGUAGE_OPTIONS: Array<{ value: SupportedLanguage; label: string }> = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "pt", label: "Português" },
  { value: "ar", label: "العربية" },
  { value: "de", label: "Deutsch" },
  { value: "ja", label: "日本語" },
  { value: "ko", label: "한국어" },
  { value: "zh", label: "中文" },
  { value: "hi", label: "हिन्दी" },
];

/** Role display labels */
export const ROLE_OPTIONS: Array<{ value: UserRole; label: string; icon: string }> = [
  { value: "fan", label: "Fan", icon: "🎉" },
  { value: "volunteer", label: "Volunteer", icon: "🤝" },
  { value: "staff", label: "Venue Staff", icon: "👷" },
  { value: "organizer", label: "Organizer", icon: "📋" },
];
