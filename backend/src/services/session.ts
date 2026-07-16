// ============================================================================
// In-Memory Session Manager
// Maintains conversation history per session with sliding window and TTL
// ============================================================================

import { SessionData, ChatMessage, UserContext } from "../types";

/** Maximum messages to keep per session (sliding window) */
const MAX_MESSAGES_PER_SESSION = 20;

/** Session time-to-live in milliseconds (30 minutes) */
const SESSION_TTL_MS = 30 * 60 * 1000;

/** How often to run the cleanup sweep (5 minutes) */
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

/**
 * SessionManager provides in-memory conversation state with:
 * - Sliding window to manage token count
 * - Automatic expiry of stale sessions
 * - Thread-safe operations (single-threaded Node.js)
 */
export class SessionManager {
  private sessions: Map<string, SessionData> = new Map();
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Start periodic cleanup of expired sessions
    this.cleanupTimer = setInterval(() => this.cleanup(), CLEANUP_INTERVAL_MS);
  }

  /**
   * Get or create a session. Updates lastActive timestamp.
   */
  getOrCreate(sessionId: string, userContext: UserContext): SessionData {
    let session = this.sessions.get(sessionId);

    if (!session) {
      session = {
        id: sessionId,
        messages: [],
        userContext,
        createdAt: Date.now(),
        lastActive: Date.now(),
      };
      this.sessions.set(sessionId, session);
    } else {
      session.lastActive = Date.now();
      // Update context if user changed preferences mid-session
      session.userContext = userContext;
    }

    return session;
  }

  /**
   * Add a message to the session, enforcing the sliding window.
   */
  addMessage(sessionId: string, message: ChatMessage): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.messages.push(message);
    session.lastActive = Date.now();

    // Enforce sliding window — keep only the most recent messages
    if (session.messages.length > MAX_MESSAGES_PER_SESSION) {
      const overflow = session.messages.length - MAX_MESSAGES_PER_SESSION;
      session.messages = session.messages.slice(overflow);
    }
  }

  /**
   * Get all messages for a session (for building the OpenAI messages array).
   */
  getMessages(sessionId: string): ChatMessage[] {
    const session = this.sessions.get(sessionId);
    return session ? [...session.messages] : [];
  }

  /**
   * Get the number of active sessions (for monitoring).
   */
  getActiveSessionCount(): number {
    return this.sessions.size;
  }

  /**
   * Remove expired sessions.
   */
  cleanup(): number {
    const now = Date.now();
    let removed = 0;

    for (const [id, session] of this.sessions) {
      if (now - session.lastActive > SESSION_TTL_MS) {
        this.sessions.delete(id);
        removed++;
      }
    }

    return removed;
  }

  /**
   * Clear all sessions (for testing).
   */
  clear(): void {
    this.sessions.clear();
  }

  /**
   * Stop the cleanup timer (for graceful shutdown).
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.sessions.clear();
  }
}

// Singleton instance
export const sessionManager = new SessionManager();
