// ============================================================================
// Gemini Service
// Handles all communication with the Gemini API, with retry logic and fallback
// ============================================================================

import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatMessage, UserContext } from "../types";
import { buildSystemPrompt } from "./prompt";
import { getMockResponse } from "../data/mockResponses";

/** Whether a valid API key is configured */
const hasApiKey = (): boolean => {
  const key = process.env.GEMINI_API_KEY;
  return Boolean(key && key !== "your-gemini-key-here" && key.length > 10);
};

let genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI | null {
  if (!hasApiKey()) return null;
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  }
  return genAI;
}

function getModelName(): string {
  return process.env.GEMINI_MODEL || "gemini-2.5-flash";
}

const MAX_RETRIES = 2;

/**
 * Call the Gemini API with the full conversation context.
 *
 * Falls back to mock responses if:
 * - No API key is configured
 * - API is unreachable after retries
 * - Any unexpected error occurs
 */
export async function getAIResponse(
  userMessage: string,
  conversationHistory: ChatMessage[],
  userContext: UserContext
): Promise<{ reply: string; isMock: boolean }> {
  const client = getClient();

  if (!client) {
    console.log("[Gemini] No API key configured — using mock responses");
    return {
      reply: getMockResponse(userMessage, userContext),
      isMock: true,
    };
  }

  const systemPrompt = buildSystemPrompt(userContext);
  
  // Format history for Gemini API
  const history = conversationHistory.map(msg => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }]
  }));

  const model = client.getGenerativeModel({
    model: getModelName(),
    systemInstruction: systemPrompt,
  });

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const chat = model.startChat({
        history,
      });
      
      const result = await chat.sendMessage(userMessage);
      const reply = result.response.text();

      if (!reply) {
        throw new Error("Empty response from Gemini");
      }

      return { reply: reply.trim(), isMock: false };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < MAX_RETRIES) {
        const delay = Math.pow(2, attempt) * 1000;
        console.warn(`[Gemini] Error (attempt ${attempt + 1}/${MAX_RETRIES + 1}), retrying in ${delay}ms:`, lastError.message);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      break;
    }
  }

  console.error("[Gemini] All retries failed, falling back to mock:", lastError?.message);
  return {
    reply: getMockResponse(userMessage, userContext),
    isMock: true,
  };
}
