// ============================================================================
// useChat Hook
// Manages chat state, sends messages to the backend, handles loading/errors
// ============================================================================

import { useState, useCallback, useRef } from "react";
import type { Message, UserContext } from "../types";
import { sendChatMessage, ApiError } from "../api/client";

/** Generate a simple unique ID for messages */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/** Generate or retrieve a session ID (persisted per browser tab) */
function getSessionId(): string {
  let sessionId = sessionStorage.getItem("fifa2026_session_id");
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    sessionStorage.setItem("fifa2026_session_id", sessionId);
  }
  return sessionId;
}

/**
 * Custom hook for chat functionality.
 * Manages message list, loading state, error state, and API communication.
 */
export function useChat(userContext: UserContext) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMockMode, setIsMockMode] = useState(false);
  const abortRef = useRef(false);

  /**
   * Send a message and get the AI response.
   */
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      setError(null);
      abortRef.current = false;

      // Add user message immediately for responsive UI
      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content: content.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const response = await sendChatMessage({
          message: content.trim(),
          sessionId: getSessionId(),
          userContext,
        });

        if (abortRef.current) return;

        const assistantMessage: Message = {
          id: generateId(),
          role: "assistant",
          content: response.reply,
          timestamp: Date.now(),
          isMock: response.isMock,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsMockMode(response.isMock);
      } catch (err) {
        if (abortRef.current) return;

        const errorMessage =
          err instanceof ApiError
            ? err.message
            : "Something went wrong. Please try again.";
        setError(errorMessage);

        // Add error as a system message so user can see it in context
        const errorMsg: Message = {
          id: generateId(),
          role: "assistant",
          content: `⚠️ ${errorMessage}`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        if (!abortRef.current) {
          setIsLoading(false);
        }
      }
    },
    [isLoading, userContext]
  );

  /**
   * Clear the conversation and start fresh.
   */
  const clearChat = useCallback(() => {
    abortRef.current = true;
    setMessages([]);
    setIsLoading(false);
    setError(null);
    // Generate a new session ID for the fresh conversation
    sessionStorage.removeItem("fifa2026_session_id");
  }, []);

  return {
    messages,
    isLoading,
    error,
    isMockMode,
    sendMessage,
    clearChat,
  };
}
