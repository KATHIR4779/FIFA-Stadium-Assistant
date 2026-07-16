// ============================================================================
// Integration Test: GET /api/venues
// Tests venue listing and individual venue lookup
// ============================================================================

import request from "supertest";
import { app } from "../../backend/src/index";

process.env.NODE_ENV = "test";

describe("GET /api/venues", () => {
  it("returns a list of venue summaries", async () => {
    const res = await request(app)
      .get("/api/venues")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body).toHaveProperty("venues");
    expect(Array.isArray(res.body.venues)).toBe(true);
    expect(res.body.venues.length).toBeGreaterThanOrEqual(16);

    // Each summary should have id, name, city
    const first = res.body.venues[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("name");
    expect(first).toHaveProperty("city");
  });

  it("returns full venue data when ?full=true is set", async () => {
    const res = await request(app)
      .get("/api/venues?full=true")
      .expect(200);

    const first = res.body.venues[0];
    expect(first).toHaveProperty("sections");
    expect(first).toHaveProperty("amenities");
    expect(first).toHaveProperty("accessibilityFeatures");
    expect(first).toHaveProperty("capacity");
  });
});

describe("GET /api/venues/:id", () => {
  it("returns a single venue by ID", async () => {
    const res = await request(app)
      .get("/api/venues/metlife")
      .expect(200);

    expect(res.body).toHaveProperty("venue");
    expect(res.body.venue.id).toBe("metlife");
    expect(res.body.venue.name).toBe("MetLife Stadium");
    expect(res.body.venue.sections.length).toBeGreaterThan(0);
  });

  it("returns 404 for a non-existent venue", async () => {
    const res = await request(app)
      .get("/api/venues/nonexistent-stadium")
      .expect(404);

    expect(res.body).toHaveProperty("code", "VENUE_NOT_FOUND");
  });
});

describe("GET /api/health", () => {
  it("returns health status", async () => {
    const res = await request(app)
      .get("/api/health")
      .expect(200);

    expect(res.body).toHaveProperty("status", "ok");
    expect(res.body).toHaveProperty("service", "FIFA2026SmartAssistant");
    expect(res.body).toHaveProperty("timestamp");
    expect(res.body).toHaveProperty("activeSessions");
  });
});
