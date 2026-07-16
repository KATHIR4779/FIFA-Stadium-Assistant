// ============================================================================
// Unit Tests: Session Manager
// Tests sliding window, session expiry, and message limits
// ============================================================================

import { SessionManager } from "../../backend/src/services/session";
import { UserContext, ChatMessage } from "../../backend/src/types";

const mockContext: UserContext = {
  role: "fan",
  venueId: "metlife",
  language: "en",
  accessibility: { mobility: false, vision: false, hearing: false },
};

function createMessage(content: string, role: "user" | "assistant" = "user"): ChatMessage {
  return { role, content, timestamp: Date.now() };
}

describe("SessionManager", () => {
  let manager: SessionManager;

  beforeEach(() => {
    manager = new SessionManager();
  });

  afterEach(() => {
    manager.destroy();
  });

  describe("getOrCreate", () => {
    it("creates a new session if none exists", () => {
      const session = manager.getOrCreate("sess-1", mockContext);
      expect(session.id).toBe("sess-1");
      expect(session.messages).toHaveLength(0);
      expect(session.userContext).toEqual(mockContext);
    });

    it("returns existing session on subsequent calls", () => {
      manager.getOrCreate("sess-1", mockContext);
      manager.addMessage("sess-1", createMessage("hello"));
      const session = manager.getOrCreate("sess-1", mockContext);
      expect(session.messages).toHaveLength(1);
    });

    it("updates user context on re-access", () => {
      manager.getOrCreate("sess-1", mockContext);
      const newContext = { ...mockContext, language: "es" as const };
      const session = manager.getOrCreate("sess-1", newContext);
      expect(session.userContext.language).toBe("es");
    });
  });

  describe("addMessage & sliding window", () => {
    it("adds messages to the session", () => {
      manager.getOrCreate("sess-1", mockContext);
      manager.addMessage("sess-1", createMessage("hello"));
      manager.addMessage("sess-1", createMessage("world"));
      expect(manager.getMessages("sess-1")).toHaveLength(2);
    });

    it("enforces the sliding window (max 20 messages)", () => {
      manager.getOrCreate("sess-1", mockContext);

      // Add 25 messages
      for (let i = 0; i < 25; i++) {
        manager.addMessage("sess-1", createMessage(`message-${i}`));
      }

      const messages = manager.getMessages("sess-1");
      expect(messages).toHaveLength(20);
      // The first 5 should have been trimmed
      expect(messages[0].content).toBe("message-5");
      expect(messages[19].content).toBe("message-24");
    });

    it("returns empty array for non-existent session", () => {
      expect(manager.getMessages("nonexistent")).toHaveLength(0);
    });

    it("does nothing when adding to non-existent session", () => {
      // Should not throw
      manager.addMessage("nonexistent", createMessage("test"));
      expect(manager.getMessages("nonexistent")).toHaveLength(0);
    });
  });

  describe("getActiveSessionCount", () => {
    it("counts active sessions", () => {
      expect(manager.getActiveSessionCount()).toBe(0);
      manager.getOrCreate("sess-1", mockContext);
      expect(manager.getActiveSessionCount()).toBe(1);
      manager.getOrCreate("sess-2", mockContext);
      expect(manager.getActiveSessionCount()).toBe(2);
    });
  });

  describe("cleanup", () => {
    it("removes expired sessions", () => {
      const session = manager.getOrCreate("sess-1", mockContext);
      // Simulate expiry by setting lastActive to 31 minutes ago
      session.lastActive = Date.now() - 31 * 60 * 1000;

      const removed = manager.cleanup();
      expect(removed).toBe(1);
      expect(manager.getActiveSessionCount()).toBe(0);
    });

    it("keeps active sessions", () => {
      manager.getOrCreate("sess-1", mockContext);
      const removed = manager.cleanup();
      expect(removed).toBe(0);
      expect(manager.getActiveSessionCount()).toBe(1);
    });
  });

  describe("clear", () => {
    it("removes all sessions", () => {
      manager.getOrCreate("sess-1", mockContext);
      manager.getOrCreate("sess-2", mockContext);
      manager.clear();
      expect(manager.getActiveSessionCount()).toBe(0);
    });
  });
});
