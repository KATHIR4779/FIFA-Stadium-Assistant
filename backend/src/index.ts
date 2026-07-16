// ============================================================================
// Server Entry Point
// Initializes Express with security middleware and mounts all routes
// ============================================================================

import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

import healthRouter from "./routes/health";
import venuesRouter from "./routes/venues";
import chatRouter from "./routes/chat";

const app = express();
const PORT = process.env.PORT || 3001;

// ---------------------------------------------------------------------------
// Security Middleware
// ---------------------------------------------------------------------------

// Helmet sets various HTTP security headers
app.use(helmet());

// Compress all HTTP responses
app.use(compression());

// CORS — allow frontend dev server
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    maxAge: 86400, // 24 hours
  })
);

// Rate limiting — 30 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please wait a moment and try again.",
    code: "RATE_LIMIT_EXCEEDED",
  },
});
app.use("/api/chat", limiter);

// Body parsing with size limit (prevent large payload attacks)
app.use(express.json({ limit: "10kb" }));

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

app.use("/api/health", healthRouter);
app.use("/api/venues", venuesRouter);
app.use("/api/chat", chatRouter);

// ---------------------------------------------------------------------------
// 404 handler
// ---------------------------------------------------------------------------

app.use((_req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    code: "NOT_FOUND",
  });
});

// ---------------------------------------------------------------------------
// Global error handler
// ---------------------------------------------------------------------------

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("[Server] Unhandled error:", err);
    res.status(500).json({
      error: "Internal server error",
      code: "INTERNAL_ERROR",
    });
  }
);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

// Export the app for testing (supertest) before calling listen
export { app };

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    const hasKey =
      process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY !== "your-gemini-key-here";
    console.log(`
╔══════════════════════════════════════════════════════╗
║   ⚽ FIFA 2026 Smart Stadium Assistant — Backend    ║
╠══════════════════════════════════════════════════════╣
║   Server:  http://localhost:${PORT}                    ║
║   Health:  http://localhost:${PORT}/api/health          ║
║   Mode:    ${hasKey ? "🟢 Live (Gemini)" : "🟡 Mock (no API key)"}              ║
╚══════════════════════════════════════════════════════╝
    `);
  });
}
