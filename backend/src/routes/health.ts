// ============================================================================
// Health Check Route
// GET /api/health — liveness probe
// ============================================================================

import { Router, Request, Response } from "express";
import { sessionManager } from "../services/session";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "FIFA2026SmartAssistant",
    timestamp: new Date().toISOString(),
    activeSessions: sessionManager.getActiveSessionCount(),
    hasApiKey: Boolean(
      process.env.OPENAI_API_KEY &&
      process.env.OPENAI_API_KEY !== "sk-your-key-here"
    ),
  });
});

export default router;
