// ============================================================================
// Chat Route
// POST /api/chat — processes user messages through OpenAI with context
// ============================================================================

import { Router, Request, Response } from "express";
import { ChatRequest, ChatMessage } from "../types";
import { sanitizeMiddleware } from "../middleware/sanitize";
import { sessionManager } from "../services/session";
import { getAIResponse } from "../services/gemini";

const router = Router();

/**
 * POST /api/chat
 *
 * Request body: { message, sessionId, userContext }
 * Response: { reply, sessionId, isMock }
 *
 * The sanitizeMiddleware validates and cleans the input before this handler runs.
 */
router.post("/", sanitizeMiddleware, async (req: Request, res: Response) => {
  try {
    const { message, sessionId, userContext } = req.body as ChatRequest;

    // Get or create the session
    const session = sessionManager.getOrCreate(sessionId, userContext);

    // Add the user's message to the session history
    const userMsg: ChatMessage = {
      role: "user",
      content: message,
      timestamp: Date.now(),
    };
    sessionManager.addMessage(sessionId, userMsg);

    // Get the conversation history for context
    const history = sessionManager.getMessages(sessionId);

    // Call the AI service (or mock fallback)
    const { reply, isMock } = await getAIResponse(message, history, userContext);

    // Add the assistant's reply to the session history
    const assistantMsg: ChatMessage = {
      role: "assistant",
      content: reply,
      timestamp: Date.now(),
    };
    sessionManager.addMessage(sessionId, assistantMsg);

    // Send the response
    res.json({
      reply,
      sessionId,
      isMock,
    });
  } catch (error) {
    console.error("[Chat] Unexpected error:", error);
    res.status(500).json({
      error: "An unexpected error occurred. Please try again.",
      code: "INTERNAL_ERROR",
    });
  }
});

export default router;
