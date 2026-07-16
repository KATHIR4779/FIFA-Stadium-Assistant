// ============================================================================
// usePreferences Hook
// Manages user preferences with localStorage persistence
// ============================================================================

import { useState, useCallback, useEffect } from "react";
import type { UserContext, UserRole, SupportedLanguage, AccessibilityNeeds } from "../types";

const STORAGE_KEY = "fifa2026_preferences";

/** Default user context */
const defaultContext: UserContext = {
  role: "fan",
  venueId: "metlife",
  language: "en",
  accessibility: {
    mobility: false,
    vision: false,
    hearing: false,
  },
};

/**
 * Load saved preferences from localStorage, falling back to defaults.
 */
function loadPreferences(): UserContext {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<UserContext>;
      return {
        ...defaultContext,
        ...parsed,
        accessibility: {
          ...defaultContext.accessibility,
          ...(parsed.accessibility || {}),
        },
      };
    }
  } catch {
    // Corrupt localStorage — ignore and use defaults
  }
  return { ...defaultContext };
}

/**
 * Custom hook for managing user preferences.
 * Persists to localStorage on every change.
 */
export function usePreferences() {
  const [userContext, setUserContext] = useState<UserContext>(loadPreferences);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userContext));
    } catch {
      // localStorage full or unavailable — silently fail
    }
  }, [userContext]);

  const setRole = useCallback((role: UserRole) => {
    setUserContext((prev) => ({ ...prev, role }));
  }, []);

  const setVenueId = useCallback((venueId: string) => {
    setUserContext((prev) => ({ ...prev, venueId }));
  }, []);

  const setLanguage = useCallback((language: SupportedLanguage) => {
    setUserContext((prev) => ({ ...prev, language }));
  }, []);

  const setAccessibility = useCallback((accessibility: AccessibilityNeeds) => {
    setUserContext((prev) => ({ ...prev, accessibility }));
  }, []);

  const toggleAccessibility = useCallback((key: keyof AccessibilityNeeds) => {
    setUserContext((prev) => ({
      ...prev,
      accessibility: {
        ...prev.accessibility,
        [key]: !prev.accessibility[key],
      },
    }));
  }, []);

  return {
    userContext,
    setRole,
    setVenueId,
    setLanguage,
    setAccessibility,
    toggleAccessibility,
  };
}
