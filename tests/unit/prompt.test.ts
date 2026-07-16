// ============================================================================
// Unit Tests: Prompt Engineering
// Tests system prompt generation for different user contexts
// ============================================================================

import { buildSystemPrompt } from "../../backend/src/services/prompt";
import { UserContext } from "../../backend/src/types";

describe("buildSystemPrompt", () => {
  const baseContext: UserContext = {
    role: "fan",
    venueId: "metlife",
    language: "en",
    accessibility: { mobility: false, vision: false, hearing: false },
  };

  it("includes the FIFA 2026 assistant identity", () => {
    const prompt = buildSystemPrompt(baseContext);
    expect(prompt).toContain("FIFA World Cup 2026 Smart Stadium Assistant");
  });

  it("includes the user role description", () => {
    const prompt = buildSystemPrompt(baseContext);
    expect(prompt).toContain("a fan attending a FIFA World Cup 2026 match");
  });

  it("includes venue name when a valid venue is selected", () => {
    const prompt = buildSystemPrompt(baseContext);
    expect(prompt).toContain("MetLife Stadium");
  });

  it("includes venue sections and amenities", () => {
    const prompt = buildSystemPrompt(baseContext);
    expect(prompt).toContain("Lower Bowl 100s");
    expect(prompt).toContain("Gate A");
    expect(prompt).toContain("First-aid stations");
  });

  it("respects the selected language", () => {
    const spanishContext: UserContext = { ...baseContext, language: "es" };
    const prompt = buildSystemPrompt(spanishContext);
    expect(prompt).toContain("Spanish");
    expect(prompt).toContain("ALWAYS respond in Spanish");
  });

  it("includes accessibility section when mobility is needed", () => {
    const a11yContext: UserContext = {
      ...baseContext,
      accessibility: { mobility: true, vision: false, hearing: false },
    };
    const prompt = buildSystemPrompt(a11yContext);
    expect(prompt).toContain("Accessibility Needs");
    expect(prompt).toContain("Mobility");
    expect(prompt).toContain("wheelchair");
  });

  it("includes all accessibility needs when multiple are selected", () => {
    const a11yContext: UserContext = {
      ...baseContext,
      accessibility: { mobility: true, vision: true, hearing: true },
    };
    const prompt = buildSystemPrompt(a11yContext);
    expect(prompt).toContain("Mobility");
    expect(prompt).toContain("Vision");
    expect(prompt).toContain("Hearing");
  });

  it("omits accessibility section when no needs are declared", () => {
    const prompt = buildSystemPrompt(baseContext);
    expect(prompt).not.toContain("## Accessibility Needs");
  });

  it("includes safety constraints", () => {
    const prompt = buildSystemPrompt(baseContext);
    expect(prompt).toContain("Safety & Behavioral Rules");
    expect(prompt).toContain("NEVER provide medical diagnoses");
    expect(prompt).toContain("NEVER share personal data");
  });

  it("includes few-shot examples for fan role", () => {
    const prompt = buildSystemPrompt(baseContext);
    expect(prompt).toContain("Example Interactions");
    expect(prompt).toContain("Where can I find my seat");
  });

  it("includes volunteer-specific examples for volunteer role", () => {
    const volunteerContext: UserContext = { ...baseContext, role: "volunteer" };
    const prompt = buildSystemPrompt(volunteerContext);
    expect(prompt).toContain("emergency exits");
    expect(prompt).toContain("visually impaired");
  });

  it("handles unknown venue gracefully (no venue context)", () => {
    const unknownVenue: UserContext = { ...baseContext, venueId: "unknown-xyz" };
    const prompt = buildSystemPrompt(unknownVenue);
    // Should still generate a valid prompt without venue details
    expect(prompt).toContain("FIFA World Cup 2026 Smart Stadium Assistant");
    expect(prompt).not.toContain("Current Venue:");
  });
});
