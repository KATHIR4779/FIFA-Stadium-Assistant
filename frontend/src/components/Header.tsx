// ============================================================================
// Header Component
// App header with FIFA 2026 branding and accessibility toolbar
// ============================================================================

import React, { useState } from "react";

interface HeaderProps {
  onToggleHighContrast: () => void;
  isHighContrast: boolean;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleHighContrast,
  isHighContrast,
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const [fontSize, setFontSize] = useState(16);

  const adjustFontSize = (delta: number) => {
    const newSize = Math.min(24, Math.max(12, fontSize + delta));
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
  };

  return (
    <header
      className="sticky top-0 z-50 border-b border-white/10 glass-card"
      role="banner"
    >
      <div className="mx-auto flex items-center justify-between px-4 py-3 max-w-7xl">
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-3">
          {/* Mobile sidebar toggle */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label={isSidebarOpen ? "Close settings panel" : "Open settings panel"}
            aria-expanded={isSidebarOpen}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {isSidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center text-xl font-bold shadow-lg shadow-fifa-magenta/20">
              ⚽
            </div>
            <div>
              <h1 className="font-display text-lg font-bold leading-tight">
                <span className="gradient-text">FIFA 2026</span>
              </h1>
              <p className="text-[10px] text-gray-400 leading-none tracking-wide uppercase">
                Smart Stadium Assistant
              </p>
            </div>
          </div>
        </div>

        {/* Right: Accessibility Toolbar */}
        <nav
          className="flex items-center gap-1 sm:gap-2"
          aria-label="Accessibility controls"
        >
          {/* Font size controls */}
          <div className="hidden sm:flex items-center gap-1 mr-2">
            <button
              onClick={() => adjustFontSize(-2)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors text-xs"
              aria-label="Decrease font size"
              title="Decrease font size"
            >
              A-
            </button>
            <button
              onClick={() => adjustFontSize(2)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors text-sm font-bold"
              aria-label="Increase font size"
              title="Increase font size"
            >
              A+
            </button>
          </div>

          {/* High contrast toggle */}
          <button
            onClick={onToggleHighContrast}
            className={`p-2 rounded-lg transition-colors ${
              isHighContrast
                ? "bg-yellow-500/20 text-yellow-300"
                : "hover:bg-white/10 text-gray-400 hover:text-white"
            }`}
            aria-label={
              isHighContrast ? "Disable high contrast mode" : "Enable high contrast mode"
            }
            aria-pressed={isHighContrast}
            title="Toggle high contrast"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </button>

          {/* FIFA 2026 badge */}
          <div className="hidden md:flex items-center gap-1.5 ml-2 px-3 py-1.5 rounded-full border border-fifa-gold/30 bg-fifa-gold/5">
            <span className="text-fifa-gold text-xs font-semibold tracking-wide">
              🇺🇸🇲🇽🇨🇦 2026
            </span>
          </div>
        </nav>
      </div>
    </header>
  );
};
