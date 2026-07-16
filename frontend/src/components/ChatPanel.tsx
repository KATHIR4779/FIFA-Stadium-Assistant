// ============================================================================
// ChatPanel Component
// Main chat interface with message list, input, and ARIA live region
// ============================================================================

import React, { useRef, useEffect, useState, useCallback } from "react";
import type { Message } from "../types";
import { MessageBubble, TypingIndicator } from "./MessageBubble";

interface ChatPanelProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  isMockMode: boolean;
  onSendMessage: (message: string) => void;
}

/** Quick action suggestions for empty chat state */
const QUICK_ACTIONS = [
  { icon: "🗺️", label: "Find my seat", message: "How do I find my seat at Section 200?" },
  { icon: "♿", label: "Accessibility help", message: "What accessibility features are available at this stadium?" },
  { icon: "🍔", label: "Food & drinks", message: "Where can I find food and drinks nearby?" },
  { icon: "🌱", label: "Sustainability tips", message: "How can I be more sustainable at the World Cup?" },
  { icon: "🚌", label: "Transportation", message: "What's the best way to get to the stadium by public transit?" },
  { icon: "🚑", label: "Emergency info", message: "Where are the emergency exits and first-aid stations?" },
];

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  isLoading,
  error,
  isMockMode,
  onSendMessage,
}) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (input.trim() && !isLoading) {
        onSendMessage(input);
        setInput("");
        // Reset textarea height
        if (inputRef.current) {
          inputRef.current.style.height = "auto";
        }
      }
    },
    [input, isLoading, onSendMessage]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends, Shift+Enter adds newline
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const handleQuickAction = (message: string) => {
    onSendMessage(message);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full">
      {/* Mock mode banner */}
      {isMockMode && messages.length > 0 && (
        <div
          className="px-4 py-2 bg-yellow-500/10 border-b border-yellow-500/20 text-yellow-300 text-xs text-center"
          role="status"
        >
          🟡 Running in offline mode — responses are pre-built mock data.
          Set <code className="bg-yellow-500/10 px-1 rounded">OPENAI_API_KEY</code> for live AI.
        </div>
      )}

      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4"
        role="log"
        aria-label="Chat conversation"
        aria-live="polite"
        aria-relevant="additions"
      >
        {isEmpty ? (
          /* Welcome screen */
          <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center text-3xl mb-5 shadow-xl shadow-fifa-magenta/20">
              ⚽
            </div>
            <h2 className="font-display text-2xl font-bold mb-2">
              <span className="gradient-text">Welcome to FIFA 2026</span>
            </h2>
            <p className="text-gray-400 text-sm max-w-md mb-8 leading-relaxed">
              Your AI-powered Smart Stadium Assistant. Ask me anything about
              navigation, accessibility, food, transportation, sustainability, and more.
            </p>

            {/* Quick action grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-lg w-full">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.message)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-white/10
                             bg-white/5 text-gray-300 text-xs hover:bg-white/10 hover:border-white/20
                             hover:text-white transition-all duration-200 hover:scale-[1.02] active:scale-95"
                  aria-label={`Quick action: ${action.label}`}
                >
                  <span className="text-lg" aria-hidden="true">{action.icon}</span>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Message list */
          <div role="list" aria-label="Messages">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div
          className="mx-4 mb-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs"
          role="alert"
        >
          ⚠️ {error}
        </div>
      )}

      {/* Input area */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-white/10 px-4 py-3 bg-fifa-dark/50 backdrop-blur-sm"
        aria-label="Send a message"
      >
        <div className="flex items-end gap-2 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your stadium experience..."
              className="chat-input resize-none pr-12"
              rows={1}
              maxLength={1000}
              disabled={isLoading}
              aria-label="Type your message"
              aria-describedby="input-hint"
            />
            <span id="input-hint" className="sr-only">
              Press Enter to send, Shift+Enter for a new line
            </span>
            {/* Character counter */}
            {input.length > 800 && (
              <span
                className={`absolute right-3 bottom-2 text-[10px] ${
                  input.length > 950 ? "text-red-400" : "text-gray-500"
                }`}
                aria-live="polite"
              >
                {input.length}/1000
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="btn-primary p-3 flex-shrink-0"
            aria-label="Send message"
          >
            {isLoading ? (
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-600 mt-2">
          Enter to send · Shift+Enter for new line · Max 1000 characters
        </p>
      </form>
    </div>
  );
};
