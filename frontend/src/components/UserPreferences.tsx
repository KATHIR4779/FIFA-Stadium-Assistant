// ============================================================================
// UserPreferences Component
// Sidebar panel for selecting role, venue, language, and accessibility needs
// ============================================================================

import React, { useEffect, useState } from "react";
import type {
  UserRole,
  SupportedLanguage,
  AccessibilityNeeds,
  VenueSummary,
} from "../types";
import { LANGUAGE_OPTIONS, ROLE_OPTIONS } from "../types";
import { fetchVenues } from "../api/client";

interface UserPreferencesProps {
  role: UserRole;
  venueId: string;
  language: SupportedLanguage;
  accessibility: AccessibilityNeeds;
  onRoleChange: (role: UserRole) => void;
  onVenueChange: (venueId: string) => void;
  onLanguageChange: (language: SupportedLanguage) => void;
  onAccessibilityToggle: (key: keyof AccessibilityNeeds) => void;
  onClearChat: () => void;
}

export const UserPreferences: React.FC<UserPreferencesProps> = ({
  role,
  venueId,
  language,
  accessibility,
  onRoleChange,
  onVenueChange,
  onLanguageChange,
  onAccessibilityToggle,
  onClearChat,
}) => {
  const [venues, setVenues] = useState<VenueSummary[]>([]);

  // Fetch venues on mount
  useEffect(() => {
    fetchVenues()
      .then(setVenues)
      .catch(() => {
        // Fallback venues if backend is unreachable
        setVenues([
          { id: "metlife", name: "MetLife Stadium", city: "East Rutherford, NJ" },
          { id: "sofi", name: "SoFi Stadium", city: "Inglewood, CA" },
          { id: "azteca", name: "Estadio Azteca", city: "Mexico City" },
          { id: "bmo", name: "BMO Field", city: "Toronto, ON" },
        ]);
      });
  }, []);

  return (
    <aside
      className="space-y-5"
      role="complementary"
      aria-label="User preferences and settings"
    >
      {/* Role Selection */}
      <fieldset>
        <legend className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Your Role
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {ROLE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onRoleChange(option.value)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                role === option.value
                  ? "bg-fifa-purple/40 border border-fifa-magenta/50 text-white shadow-lg shadow-fifa-purple/20"
                  : "border border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200 hover:bg-white/5"
              }`}
              aria-pressed={role === option.value}
              aria-label={`Select role: ${option.label}`}
            >
              <span aria-hidden="true">{option.icon}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {/* Venue Selection */}
      <div>
        <label
          htmlFor="venue-select"
          className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2"
        >
          Stadium
        </label>
        <select
          id="venue-select"
          value={venueId}
          onChange={(e) => onVenueChange(e.target.value)}
          className="select-field"
          aria-label="Select your stadium"
        >
          {venues.map((venue) => (
            <option key={venue.id} value={venue.id}>
              {venue.name} — {venue.city}
            </option>
          ))}
        </select>
      </div>

      {/* Language Selection */}
      <div>
        <label
          htmlFor="language-select"
          className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2"
        >
          Language
        </label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
          className="select-field"
          aria-label="Select your preferred language"
        >
          {LANGUAGE_OPTIONS.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Accessibility Needs */}
      <fieldset>
        <legend className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Accessibility Needs
        </legend>
        <div className="space-y-2">
          {[
            { key: "mobility" as const, icon: "♿", label: "Mobility Support", desc: "Wheelchair routes, elevators, ramps" },
            { key: "vision" as const, icon: "👁️", label: "Vision Support", desc: "Audio guidance, braille, high contrast" },
            { key: "hearing" as const, icon: "🦻", label: "Hearing Support", desc: "Captions, sign language, visual alerts" },
          ].map(({ key, icon, label, desc }) => (
            <label
              key={key}
              className={`flex items-start gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                accessibility[key]
                  ? "bg-fifa-teal/10 border border-fifa-teal/30"
                  : "border border-white/5 hover:border-white/15 hover:bg-white/5"
              }`}
            >
              <input
                type="checkbox"
                checked={accessibility[key]}
                onChange={() => onAccessibilityToggle(key)}
                className="sr-only"
                aria-describedby={`a11y-${key}-desc`}
              />
              <div
                className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-colors ${
                  accessibility[key]
                    ? "bg-fifa-teal border-fifa-teal"
                    : "border-gray-500"
                }`}
                aria-hidden="true"
              >
                {accessibility[key] && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-sm text-white">
                  <span aria-hidden="true">{icon}</span>
                  {label}
                </div>
                <p id={`a11y-${key}-desc`} className="text-[11px] text-gray-500 mt-0.5">
                  {desc}
                </p>
              </div>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Clear Chat */}
      <button
        onClick={onClearChat}
        className="w-full btn-secondary flex items-center justify-center gap-2"
        aria-label="Clear conversation and start new chat"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        New Conversation
      </button>

      {/* Info card */}
      <div className="glass-card p-3 text-[11px] text-gray-500 leading-relaxed">
        <p className="mb-1.5 font-medium text-gray-400">💡 Tips</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Ask about seat locations, food, restrooms</li>
          <li>Request wheelchair-accessible routes</li>
          <li>Get sustainability & recycling tips</li>
          <li>Ask in any of the 10 supported languages</li>
        </ul>
      </div>
    </aside>
  );
};
