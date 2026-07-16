// ============================================================================
// App Component
// Root layout — header, sidebar (preferences + map), and main chat area
// ============================================================================

import React, { useState } from "react";
import { Header } from "./components/Header";
import { ChatPanel } from "./components/ChatPanel";
import { UserPreferences } from "./components/UserPreferences";
import { StadiumMap } from "./components/StadiumMap";
import { usePreferences } from "./hooks/usePreferences";
import { useChat } from "./hooks/useChat";

const App: React.FC = () => {
  const {
    userContext,
    setRole,
    setVenueId,
    setLanguage,
    toggleAccessibility,
  } = usePreferences();

  const { messages, isLoading, error, isMockMode, sendMessage, clearChat } =
    useChat(userContext);

  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleHighContrast = () => {
    setIsHighContrast((prev) => !prev);
    document.documentElement.classList.toggle("high-contrast");
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Skip to main content — accessibility */}
      <a
        href="#main-chat"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100]
                   focus:px-4 focus:py-2 focus:bg-fifa-purple focus:text-white focus:rounded-lg"
      >
        Skip to chat
      </a>

      <Header
        onToggleHighContrast={toggleHighContrast}
        isHighContrast={isHighContrast}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — Desktop: always visible, Mobile: overlay */}
        <>
          {/* Mobile overlay backdrop */}
          {isSidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
              aria-hidden="true"
            />
          )}

          <aside
            className={`
              fixed lg:relative z-50 lg:z-auto
              top-0 left-0 h-full lg:h-auto
              w-80 lg:w-80 xl:w-[340px]
              bg-fifa-dark lg:bg-transparent
              border-r border-white/10
              overflow-y-auto
              p-4 pt-16 lg:pt-4
              transition-transform duration-300 ease-in-out
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
              flex-shrink-0
            `}
            aria-label="Settings and stadium map"
          >
            {/* Mobile close button */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 text-gray-400"
              aria-label="Close settings panel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <UserPreferences
              role={userContext.role}
              venueId={userContext.venueId}
              language={userContext.language}
              accessibility={userContext.accessibility}
              onRoleChange={setRole}
              onVenueChange={setVenueId}
              onLanguageChange={setLanguage}
              onAccessibilityToggle={toggleAccessibility}
              onClearChat={clearChat}
            />

            <div className="mt-5">
              <StadiumMap venueId={userContext.venueId} />
            </div>
          </aside>
        </>

        {/* Main chat area */}
        <main
          id="main-chat"
          className="flex-1 flex flex-col min-w-0 overflow-hidden"
          role="main"
          aria-label="Chat with FIFA 2026 Smart Stadium Assistant"
        >
          <ChatPanel
            messages={messages}
            isLoading={isLoading}
            error={error}
            isMockMode={isMockMode}
            onSendMessage={sendMessage}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
