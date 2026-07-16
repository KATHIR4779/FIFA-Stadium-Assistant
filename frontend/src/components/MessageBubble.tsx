// ============================================================================
// MessageBubble Component
// Renders individual chat messages with markdown and accessibility
// ============================================================================

import React from "react";
import ReactMarkdown from "react-markdown";
import type { Message } from "../types";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === "user";
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 animate-slide-up`}
      role="listitem"
    >
      <div className="flex flex-col max-w-[85%]">
        {/* Sender label */}
        <div
          className={`flex items-center gap-2 mb-1 text-xs text-gray-500 ${
            isUser ? "justify-end" : "justify-start"
          }`}
        >
          {!isUser && (
            <span className="inline-flex items-center gap-1">
              <span className="w-5 h-5 rounded-full gradient-bg flex items-center justify-center text-[10px]">
                ⚽
              </span>
              <span className="font-medium text-gray-400">Stadium Assistant</span>
            </span>
          )}
          {isUser && <span className="font-medium text-gray-400">You</span>}
          <time dateTime={new Date(message.timestamp).toISOString()} className="text-gray-600">
            {time}
          </time>
          {message.isMock && (
            <span
              className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-[10px] font-medium"
              title="This response was generated in offline mode"
            >
              Mock
            </span>
          )}
        </div>

        {/* Message bubble */}
        <div
          className={isUser ? "chat-bubble-user" : "chat-bubble-assistant"}
          aria-label={`${isUser ? "Your message" : "Assistant response"}: ${message.content.substring(0, 100)}`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Typing indicator shown while the AI is generating a response.
 */
export const TypingIndicator: React.FC = () => (
  <div className="flex justify-start mb-4 animate-fade-in" role="status" aria-label="Assistant is typing">
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-1 text-xs">
        <span className="w-5 h-5 rounded-full gradient-bg flex items-center justify-center text-[10px]">
          ⚽
        </span>
        <span className="font-medium text-gray-400">Stadium Assistant</span>
      </div>
      <div className="chat-bubble-assistant flex items-center gap-1.5 px-5 py-4">
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
        <span className="sr-only">Typing...</span>
      </div>
    </div>
  </div>
);
