// ============================================================================
// Input Sanitization Middleware
// Prevents prompt injection, XSS, and validates input constraints
// ============================================================================

import { Request, Response, NextFunction } from "express";
import { ChatRequest, ApiError } from "../types";

/** Maximum allowed message length (characters) */
const MAX_MESSAGE_LENGTH = 1000;

/** Maximum session ID length */
const MAX_SESSION_ID_LENGTH = 64;

/**
 * Patterns that indicate prompt injection attempts.
 * These try to override the system prompt or escape the assistant's role.
 */
const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?(previous|above|prior)\s+(instructions|prompts|rules)/i,
  /you\s+are\s+now\s+(a|an)\s+/i,
  /system\s*:\s*/i,
  /\bact\s+as\b.*\b(admin|root|developer|hacker)\b/i,
  /reveal\s+(your|the)\s+(system|initial|original)\s+prompt/i,
  /forget\s+(everything|all|your)\s+(you|instructions|rules)/i,
  /override\s+(safety|content|filter|restriction)/i,
  /jailbreak/i,
  /DAN\s*mode/i,
  /pretend\s+you\s+(have\s+)?no\s+(restrictions|limits|rules)/i,
];

/**
 * Strip HTML tags from a string to prevent stored XSS.
 */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}

/**
 * Check if a message contains prompt injection patterns.
 * Returns the matched pattern name, or null if clean.
 */
export function detectPromptInjection(message: string): string | null {
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(message)) {
      return pattern.source;
    }
  }
  return null;
}

/**
 * Sanitize a user message: strip HTML, trim, enforce length limits.
 */
export function sanitizeMessage(message: string): string {
  let cleaned = stripHtml(message);
  cleaned = cleaned.trim();
  // Replace multiple whitespace with single space
  cleaned = cleaned.replace(/\s+/g, " ");
  // Truncate to max length
  if (cleaned.length > MAX_MESSAGE_LENGTH) {
    cleaned = cleaned.substring(0, MAX_MESSAGE_LENGTH);
  }
  return cleaned;
}

/**
 * Validate the structure and content of a ChatRequest body.
 * Returns an error object if invalid, or null if valid.
 */
export function validateChatRequest(body: unknown): ApiError | null {
  if (!body || typeof body !== "object") {
    return { error: "Request body must be a JSON object", code: "INVALID_BODY" };
  }

  const { message, sessionId, userContext } = body as Partial<ChatRequest>;

  // Validate message
  if (!message || typeof message !== "string") {
    return { error: "Message is required and must be a string", code: "INVALID_MESSAGE" };
  }
  if (message.trim().length === 0) {
    return { error: "Message cannot be empty", code: "EMPTY_MESSAGE" };
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return {
      error: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`,
      code: "MESSAGE_TOO_LONG",
    };
  }

  // Validate sessionId
  if (!sessionId || typeof sessionId !== "string") {
    return { error: "Session ID is required and must be a string", code: "INVALID_SESSION_ID" };
  }
  if (sessionId.length > MAX_SESSION_ID_LENGTH) {
    return { error: "Session ID is too long", code: "SESSION_ID_TOO_LONG" };
  }

  // Validate userContext
  if (!userContext || typeof userContext !== "object") {
    return { error: "User context is required", code: "INVALID_CONTEXT" };
  }

  const validRoles = ["fan", "volunteer", "staff", "organizer"];
  if (!validRoles.includes(userContext.role)) {
    return { error: `Role must be one of: ${validRoles.join(", ")}`, code: "INVALID_ROLE" };
  }

  const validLanguages = ["en", "es", "fr", "pt", "ar", "de", "ja", "ko", "zh", "hi"];
  if (!validLanguages.includes(userContext.language)) {
    return {
      error: `Language must be one of: ${validLanguages.join(", ")}`,
      code: "INVALID_LANGUAGE",
    };
  }

  if (!userContext.venueId || typeof userContext.venueId !== "string") {
    return { error: "Venue ID is required", code: "INVALID_VENUE" };
  }

  if (!userContext.accessibility || typeof userContext.accessibility !== "object") {
    return { error: "Accessibility preferences are required", code: "INVALID_ACCESSIBILITY" };
  }

  return null;
}

/**
 * Express middleware that validates and sanitizes incoming chat requests.
 */
export function sanitizeMiddleware(req: Request, res: Response, next: NextFunction): void {
  const validationError = validateChatRequest(req.body);
  if (validationError) {
    res.status(400).json(validationError);
    return;
  }

  const body = req.body as ChatRequest;

  // Check for prompt injection
  const injectionMatch = detectPromptInjection(body.message);
  if (injectionMatch) {
    res.status(400).json({
      error: "Your message contains disallowed patterns. Please rephrase your question.",
      code: "PROMPT_INJECTION_DETECTED",
    } satisfies ApiError);
    return;
  }

  // Sanitize the message in-place
  body.message = sanitizeMessage(body.message);

  next();
}
