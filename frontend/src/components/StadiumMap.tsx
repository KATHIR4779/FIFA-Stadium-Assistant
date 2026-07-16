// ============================================================================
// StadiumMap Component
// Detailed interactive SVG stadium diagram with section highlighting
// ============================================================================

import React, { useState } from "react";

interface StadiumMapProps {
  /** Currently selected venue ID */
  venueId: string;
  /** Sections mentioned in the latest AI response (to highlight) */
  highlightedSections?: string[];
}

/** Section data for the SVG map */
interface MapSection {
  id: string;
  label: string;
  level: "lower" | "middle" | "upper" | "vip" | "field" | "amenity";
}

/**
 * Interactive SVG stadium map.
 * Sections glow when hovered or highlighted by the AI assistant.
 */
export const StadiumMap: React.FC<StadiumMapProps> = React.memo(({
  highlightedSections = [],
}) => {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const sections: MapSection[] = [
    // Field
    { id: "field", label: "Playing Field", level: "field" },
    // Lower bowl
    { id: "lower-north", label: "Lower North 100s", level: "lower" },
    { id: "lower-south", label: "Lower South 100s", level: "lower" },
    { id: "lower-east", label: "Lower East 100s", level: "lower" },
    { id: "lower-west", label: "Lower West 100s", level: "lower" },
    // Middle
    { id: "mid-north", label: "Middle North 200s", level: "middle" },
    { id: "mid-south", label: "Middle South 200s", level: "middle" },
    { id: "mid-east", label: "Middle East 200s", level: "middle" },
    { id: "mid-west", label: "Middle West 200s", level: "middle" },
    // Upper
    { id: "upper-north", label: "Upper North 300s", level: "upper" },
    { id: "upper-south", label: "Upper South 300s", level: "upper" },
    { id: "upper-east", label: "Upper East 300s", level: "upper" },
    { id: "upper-west", label: "Upper West 300s", level: "upper" },
    // VIP
    { id: "vip-west", label: "VIP Suites", level: "vip" },
    // Amenities
    { id: "gate-a", label: "Gate A", level: "amenity" },
    { id: "gate-b", label: "Gate B", level: "amenity" },
    { id: "gate-c", label: "Gate C", level: "amenity" },
    { id: "gate-d", label: "Gate D", level: "amenity" },
    { id: "first-aid", label: "First Aid", level: "amenity" },
    { id: "food-court", label: "Food Court", level: "amenity" },
  ];

  const levelColors: Record<string, { base: string; hover: string; stroke: string }> = {
    field:   { base: "#166534", hover: "#22c55e", stroke: "#4ade80" },
    lower:   { base: "#1e3a5f", hover: "#3b82f6", stroke: "#60a5fa" },
    middle:  { base: "#3d1a78", hover: "#8b2fc9", stroke: "#a855f7" },
    upper:   { base: "#4a1942", hover: "#e040a0", stroke: "#f472b6" },
    vip:     { base: "#78521a", hover: "#ffd700", stroke: "#fbbf24" },
    amenity: { base: "#0e4a4a", hover: "#00c9a7", stroke: "#34d399" },
  };

  const isHighlighted = (id: string) =>
    highlightedSections.some((s) => id.includes(s) || s.includes(id));

  const getSectionColor = (section: MapSection) => {
    const colors = levelColors[section.level];
    if (isHighlighted(section.id) || hoveredSection === section.id) {
      return colors.hover;
    }
    return colors.base;
  };

  const getSectionStroke = (section: MapSection) => {
    const colors = levelColors[section.level];
    if (isHighlighted(section.id) || hoveredSection === section.id) {
      return colors.stroke;
    }
    return "rgba(255,255,255,0.15)";
  };

  const handleMouseEnter = (sectionId: string, e: React.MouseEvent) => {
    setHoveredSection(sectionId);
    const svgRect = (e.currentTarget as SVGElement).closest("svg")?.getBoundingClientRect();
    if (svgRect) {
      setTooltipPos({
        x: e.clientX - svgRect.left,
        y: e.clientY - svgRect.top - 10,
      });
    }
  };

  const handleMouseLeave = () => setHoveredSection(null);

  const sectionData = sections.find((s) => s.id === hoveredSection);

  return (
    <div className="glass-card p-4">
      <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-fifa-sky" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        Stadium Map
      </h3>
      <div className="relative" role="img" aria-label="Interactive stadium map showing sections, gates, and amenities. Hover or tab through sections for details.">
        <svg
          viewBox="0 0 500 400"
          className="w-full h-auto"
          role="group"
          aria-label="Stadium sections"
        >
          {/* Background */}
          <defs>
            <radialGradient id="stadiumGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(77,201,246,0.08)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect x="0" y="0" width="500" height="400" fill="url(#stadiumGlow)" rx="16" />

          {/* ===== UPPER BOWL (outermost ring) ===== */}
          {/* Upper North */}
          <path
            d="M 80 60 Q 250 10 420 60 L 400 100 Q 250 55 100 100 Z"
            fill={getSectionColor(sections[9])}
            stroke={getSectionStroke(sections[9])}
            strokeWidth="1.5"
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={(e) => handleMouseEnter("upper-north", e)}
            onMouseLeave={handleMouseLeave}
            role="button"
            tabIndex={0}
            aria-label="Upper North 300s section"
          />
          {/* Upper South */}
          <path
            d="M 100 300 Q 250 345 400 300 L 420 340 Q 250 390 80 340 Z"
            fill={getSectionColor(sections[10])}
            stroke={getSectionStroke(sections[10])}
            strokeWidth="1.5"
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={(e) => handleMouseEnter("upper-south", e)}
            onMouseLeave={handleMouseLeave}
            role="button"
            tabIndex={0}
            aria-label="Upper South 300s section"
          />
          {/* Upper East */}
          <path
            d="M 420 60 L 460 90 L 460 310 L 420 340 L 400 300 L 430 280 L 430 120 L 400 100 Z"
            fill={getSectionColor(sections[11])}
            stroke={getSectionStroke(sections[11])}
            strokeWidth="1.5"
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={(e) => handleMouseEnter("upper-east", e)}
            onMouseLeave={handleMouseLeave}
            role="button"
            tabIndex={0}
            aria-label="Upper East 300s section"
          />
          {/* Upper West */}
          <path
            d="M 80 60 L 100 100 L 70 120 L 70 280 L 100 300 L 80 340 L 40 310 L 40 90 Z"
            fill={getSectionColor(sections[12])}
            stroke={getSectionStroke(sections[12])}
            strokeWidth="1.5"
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={(e) => handleMouseEnter("upper-west", e)}
            onMouseLeave={handleMouseLeave}
            role="button"
            tabIndex={0}
            aria-label="Upper West 300s section"
          />

          {/* ===== MIDDLE BOWL ===== */}
          {/* Middle North */}
          <path
            d="M 120 110 Q 250 75 380 110 L 360 140 Q 250 110 140 140 Z"
            fill={getSectionColor(sections[5])}
            stroke={getSectionStroke(sections[5])}
            strokeWidth="1.5"
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={(e) => handleMouseEnter("mid-north", e)}
            onMouseLeave={handleMouseLeave}
            role="button"
            tabIndex={0}
            aria-label="Middle North 200s section"
          />
          {/* Middle South */}
          <path
            d="M 140 260 Q 250 290 360 260 L 380 290 Q 250 325 120 290 Z"
            fill={getSectionColor(sections[6])}
            stroke={getSectionStroke(sections[6])}
            strokeWidth="1.5"
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={(e) => handleMouseEnter("mid-south", e)}
            onMouseLeave={handleMouseLeave}
            role="button"
            tabIndex={0}
            aria-label="Middle South 200s section"
          />
          {/* Middle East */}
          <path
            d="M 380 110 L 410 130 L 410 270 L 380 290 L 360 260 L 385 245 L 385 155 L 360 140 Z"
            fill={getSectionColor(sections[7])}
            stroke={getSectionStroke(sections[7])}
            strokeWidth="1.5"
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={(e) => handleMouseEnter("mid-east", e)}
            onMouseLeave={handleMouseLeave}
            role="button"
            tabIndex={0}
            aria-label="Middle East 200s section"
          />
          {/* Middle West + VIP overlay */}
          <path
            d="M 120 110 L 140 140 L 115 155 L 115 245 L 140 260 L 120 290 L 90 270 L 90 130 Z"
            fill={getSectionColor(sections[8])}
            stroke={getSectionStroke(sections[8])}
            strokeWidth="1.5"
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={(e) => handleMouseEnter("mid-west", e)}
            onMouseLeave={handleMouseLeave}
            role="button"
            tabIndex={0}
            aria-label="Middle West 200s section"
          />

          {/* ===== VIP SUITES (small strip on west side) ===== */}
          <rect
            x="82" y="165" width="12" height="70" rx="3"
            fill={getSectionColor(sections[13])}
            stroke={getSectionStroke(sections[13])}
            strokeWidth="1.5"
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={(e) => handleMouseEnter("vip-west", e)}
            onMouseLeave={handleMouseLeave}
            role="button"
            tabIndex={0}
            aria-label="VIP Suites section"
          />
          <text x="88" y="204" fontSize="6" fill="white" textAnchor="middle" className="pointer-events-none select-none" aria-hidden="true">V</text>

          {/* ===== LOWER BOWL ===== */}
          {/* Lower North */}
          <path
            d="M 155 150 Q 250 125 345 150 L 330 170 Q 250 150 170 170 Z"
            fill={getSectionColor(sections[1])}
            stroke={getSectionStroke(sections[1])}
            strokeWidth="1.5"
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={(e) => handleMouseEnter("lower-north", e)}
            onMouseLeave={handleMouseLeave}
            role="button"
            tabIndex={0}
            aria-label="Lower North 100s section"
          />
          {/* Lower South */}
          <path
            d="M 170 230 Q 250 250 330 230 L 345 250 Q 250 275 155 250 Z"
            fill={getSectionColor(sections[2])}
            stroke={getSectionStroke(sections[2])}
            strokeWidth="1.5"
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={(e) => handleMouseEnter("lower-south", e)}
            onMouseLeave={handleMouseLeave}
            role="button"
            tabIndex={0}
            aria-label="Lower South 100s section"
          />
          {/* Lower East */}
          <path
            d="M 345 150 L 370 165 L 370 235 L 345 250 L 330 230 L 350 220 L 350 180 L 330 170 Z"
            fill={getSectionColor(sections[3])}
            stroke={getSectionStroke(sections[3])}
            strokeWidth="1.5"
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={(e) => handleMouseEnter("lower-east", e)}
            onMouseLeave={handleMouseLeave}
            role="button"
            tabIndex={0}
            aria-label="Lower East 100s section"
          />
          {/* Lower West */}
          <path
            d="M 155 150 L 170 170 L 150 180 L 150 220 L 170 230 L 155 250 L 130 235 L 130 165 Z"
            fill={getSectionColor(sections[4])}
            stroke={getSectionStroke(sections[4])}
            strokeWidth="1.5"
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={(e) => handleMouseEnter("lower-west", e)}
            onMouseLeave={handleMouseLeave}
            role="button"
            tabIndex={0}
            aria-label="Lower West 100s section"
          />

          {/* ===== PLAYING FIELD ===== */}
          <rect
            x="165" y="175" width="170" height="50" rx="4"
            fill={getSectionColor(sections[0])}
            stroke={getSectionStroke(sections[0])}
            strokeWidth="1.5"
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={(e) => handleMouseEnter("field", e)}
            onMouseLeave={handleMouseLeave}
            role="button"
            tabIndex={0}
            aria-label="Playing field"
          />
          {/* Field markings */}
          <line x1="250" y1="175" x2="250" y2="225" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" className="pointer-events-none" />
          <circle cx="250" cy="200" r="12" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" className="pointer-events-none" />
          <rect x="170" y="188" width="16" height="24" rx="1" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" className="pointer-events-none" />
          <rect x="314" y="188" width="16" height="24" rx="1" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" className="pointer-events-none" />

          {/* ===== GATES ===== */}
          {/* Gate A - North */}
          <g
            className="cursor-pointer"
            onMouseEnter={(e) => handleMouseEnter("gate-a", e)}
            onMouseLeave={handleMouseLeave}
            role="button"
            tabIndex={0}
            aria-label="Gate A - North entrance"
          >
            <rect x="238" y="38" width="24" height="14" rx="3" fill={getSectionColor(sections[14])} stroke={getSectionStroke(sections[14])} strokeWidth="1" />
            <text x="250" y="49" fontSize="7" fill="white" textAnchor="middle" className="pointer-events-none select-none font-semibold" aria-hidden="true">A</text>
          </g>
          {/* Gate B - East */}
          <g
            className="cursor-pointer"
            onMouseEnter={(e) => handleMouseEnter("gate-b", e)}
            onMouseLeave={handleMouseLeave}
            role="button"
            tabIndex={0}
            aria-label="Gate B - East entrance"
          >
            <rect x="462" y="193" width="24" height="14" rx="3" fill={getSectionColor(sections[15])} stroke={getSectionStroke(sections[15])} strokeWidth="1" />
            <text x="474" y="204" fontSize="7" fill="white" textAnchor="middle" className="pointer-events-none select-none font-semibold" aria-hidden="true">B</text>
          </g>
          {/* Gate C - South */}
          <g
            className="cursor-pointer"
            onMouseEnter={(e) => handleMouseEnter("gate-c", e)}
            onMouseLeave={handleMouseLeave}
            role="button"
            tabIndex={0}
            aria-label="Gate C - South entrance"
          >
            <rect x="238" y="348" width="24" height="14" rx="3" fill={getSectionColor(sections[16])} stroke={getSectionStroke(sections[16])} strokeWidth="1" />
            <text x="250" y="359" fontSize="7" fill="white" textAnchor="middle" className="pointer-events-none select-none font-semibold" aria-hidden="true">C</text>
          </g>
          {/* Gate D - West */}
          <g
            className="cursor-pointer"
            onMouseEnter={(e) => handleMouseEnter("gate-d", e)}
            onMouseLeave={handleMouseLeave}
            role="button"
            tabIndex={0}
            aria-label="Gate D - West entrance"
          >
            <rect x="14" y="193" width="24" height="14" rx="3" fill={getSectionColor(sections[17])} stroke={getSectionStroke(sections[17])} strokeWidth="1" />
            <text x="26" y="204" fontSize="7" fill="white" textAnchor="middle" className="pointer-events-none select-none font-semibold" aria-hidden="true">D</text>
          </g>

          {/* ===== FIRST AID ===== */}
          <g
            className="cursor-pointer"
            onMouseEnter={(e) => handleMouseEnter("first-aid", e)}
            onMouseLeave={handleMouseLeave}
            role="button"
            tabIndex={0}
            aria-label="First Aid station"
          >
            <circle cx="420" cy="85" r="10" fill={getSectionColor(sections[18])} stroke={getSectionStroke(sections[18])} strokeWidth="1" />
            <text x="420" y="89" fontSize="10" fill="white" textAnchor="middle" className="pointer-events-none select-none" aria-hidden="true">+</text>
          </g>

          {/* ===== FOOD COURT ===== */}
          <g
            className="cursor-pointer"
            onMouseEnter={(e) => handleMouseEnter("food-court", e)}
            onMouseLeave={handleMouseLeave}
            role="button"
            tabIndex={0}
            aria-label="Food Court area"
          >
            <circle cx="80" cy="315" r="10" fill={getSectionColor(sections[19])} stroke={getSectionStroke(sections[19])} strokeWidth="1" />
            <text x="80" y="319" fontSize="9" fill="white" textAnchor="middle" className="pointer-events-none select-none" aria-hidden="true">🍔</text>
          </g>

          {/* ===== SECTION LABELS ===== */}
          <text x="250" y="200" fontSize="9" fill="rgba(255,255,255,0.7)" textAnchor="middle" dominantBaseline="middle" className="pointer-events-none select-none" aria-hidden="true">⚽ FIELD</text>

          <text x="250" y="82" fontSize="7" fill="rgba(255,255,255,0.5)" textAnchor="middle" className="pointer-events-none select-none" aria-hidden="true">UPPER 300s</text>
          <text x="250" y="128" fontSize="7" fill="rgba(255,255,255,0.5)" textAnchor="middle" className="pointer-events-none select-none" aria-hidden="true">MIDDLE 200s</text>
          <text x="250" y="160" fontSize="7" fill="rgba(255,255,255,0.5)" textAnchor="middle" className="pointer-events-none select-none" aria-hidden="true">LOWER 100s</text>
          <text x="250" y="268" fontSize="7" fill="rgba(255,255,255,0.5)" textAnchor="middle" className="pointer-events-none select-none" aria-hidden="true">LOWER 100s</text>
          <text x="250" y="305" fontSize="7" fill="rgba(255,255,255,0.5)" textAnchor="middle" className="pointer-events-none select-none" aria-hidden="true">MIDDLE 200s</text>
          <text x="250" y="335" fontSize="7" fill="rgba(255,255,255,0.5)" textAnchor="middle" className="pointer-events-none select-none" aria-hidden="true">UPPER 300s</text>

          {/* Compass indicator */}
          <text x="250" y="25" fontSize="8" fill="rgba(255,255,255,0.4)" textAnchor="middle" className="pointer-events-none select-none" aria-hidden="true">N ↑</text>
        </svg>

        {/* Tooltip */}
        {hoveredSection && sectionData && (
          <div
            className="absolute z-10 px-3 py-1.5 rounded-lg bg-black/90 border border-white/20 text-xs text-white shadow-xl pointer-events-none"
            style={{
              left: `${Math.min(tooltipPos.x, 350)}px`,
              top: `${tooltipPos.y}px`,
              transform: "translate(-50%, -100%)",
            }}
            role="tooltip"
          >
            <span className="font-semibold">{sectionData.label}</span>
            <span className="text-gray-400 ml-2 capitalize">({sectionData.level})</span>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3 text-[10px] text-gray-400" aria-label="Map legend">
        {[
          { color: "#1e3a5f", label: "Lower Bowl" },
          { color: "#3d1a78", label: "Middle Bowl" },
          { color: "#4a1942", label: "Upper Bowl" },
          { color: "#78521a", label: "VIP" },
          { color: "#0e4a4a", label: "Gates / Amenities" },
          { color: "#166534", label: "Field" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ background: color }} aria-hidden="true" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
});
