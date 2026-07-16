// ============================================================================
// Venues Route
// GET /api/venues — returns all FIFA 2026 venue data
// GET /api/venues/:id — returns a single venue by ID
// ============================================================================

import { Router, Request, Response } from "express";
import { venues, getVenueById, getVenueSummaries } from "../data/venues";

const router = Router();

/**
 * GET /api/venues
 * Returns summary list of all venues (for dropdown population).
 * Add ?full=true to get complete venue data.
 */
router.get("/", (req: Request, res: Response) => {
  const full = req.query.full === "true";

  // Venues data is static, safe to cache for 24 hours
  res.set("Cache-Control", "public, max-age=86400");

  if (full) {
    res.json({ venues });
  } else {
    res.json({ venues: getVenueSummaries() });
  }
});

/**
 * GET /api/venues/:id
 * Returns full data for a single venue.
 */
router.get("/:id", (req: Request, res: Response) => {
  const venue = getVenueById(req.params.id as string);

  if (!venue) {
    res.status(404).json({
      error: "Venue not found",
      code: "VENUE_NOT_FOUND",
    });
    return;
  }

  res.json({ venue });
});

export default router;
