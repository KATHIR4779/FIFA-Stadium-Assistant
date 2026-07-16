# ⚽ FIFA 2026 Smart Stadium Assistant

> **AI-powered stadium concierge for the FIFA World Cup 2026**
> Navigation · Accessibility · Multilingual Help · Sustainability

A production-ready web application for the **Smart Stadiums & Tournament Operations** hackathon challenge. It leverages Generative AI (Google Gemini Flash) to assist fans, volunteers, organizers, and venue staff with real-time, context-aware stadium guidance.

---

## 🎯 Chosen Vertical
**Smart Stadiums & Tournament Operations**
The application directly addresses the challenge of managing massive, diverse crowds across the 16 venues of the 2026 World Cup. It acts as an intelligent layer between stadium infrastructure and the attendees, providing personalized, accessible, and localized support.

## 🧠 Approach and Logic
We approached this problem by building a highly contextual, dynamic prompt engine. Rather than relying on a generic LLM, our backend injects specific venue maps, user roles, language preferences, and accessibility needs into the system prompt *before* it reaches the LLM. This grounds the AI in reality (RAG-lite without a heavy vector database), ensuring responses are accurate, safe, and hyper-relevant to the user's exact situation at their specific stadium.

## ⚙️ How the Solution Works
1. **Context Gathering:** The React frontend collects user preferences (Role, Language, Venue, Accessibility Needs) alongside their chat message.
2. **Sanitization & Security:** The Express backend intercepts the message, strips malicious HTML/XSS, and scans for prompt injection patterns.
3. **Dynamic Prompting:** The `prompt.ts` service builds a system instruction that merges the user's context with static knowledge about the selected venue (e.g., gates, sections, amenities).
4. **AI Generation:** The context and message are sent to the Google Gemini API (with an offline mock fallback if no key is provided).
5. **Stateful Chat:** The `session.ts` manager keeps a sliding window of the last 20 messages in memory, allowing for natural, conversational follow-ups.

## 📌 Assumptions Made
- **Venue Data:** We assumed static JSON data for the 16 stadiums is sufficient for the MVP. In a real-world scenario, this would be tied to a dynamic CMS or database.
- **Connectivity:** We assumed users might face poor cellular reception inside packed stadiums, which is why the system includes a robust offline "Mock Mode" fallback that works without an API key.
- **Language:** We assumed that translating queries on the fly using the LLM's native multilingual capabilities is more efficient than maintaining strict static localization files for every possible chat query.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (React + Vite)                │
│  ┌────────────┐ ┌──────────────┐ ┌───────────────────┐  │
│  │ Chat Panel │ │ Stadium Map  │ │ User Preferences  │  │
│  │ (AI Chat)  │ │ (SVG, hover) │ │ Role/Lang/A11y    │  │
│  └─────┬──────┘ └──────────────┘ └────────┬──────────┘  │
│        └──────────┬───────────────────────┘              │
│                   │  HTTP POST /api/chat                 │
└───────────────────┼─────────────────────────────────────┘
                    ▼
┌───────────────────────────────────────────────────────────┐
│              Backend (Express + TypeScript)                │
│                                                           │
│  POST /api/chat ──► Sanitize ──► Build Prompt ──► Gemini  │
│                      │              │                │    │
│                      │         Venue Knowledge     Reply  │
│                      │         + User Context             │
│                      ▼                                    │
│               Session Manager (sliding window, 20 msgs)   │
│                                                           │
│  GET  /api/venues ──► Static venue data (16 stadiums)     │
│  GET  /api/health ──► Liveness check                      │
└───────────────────────────────────────────────────────────┘
```

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🗺️ **Stadium Navigation** | Find your seat, section, gate, restrooms, food courts, and first-aid |
| ♿ **Accessibility Support** | Tailored guidance for mobility, vision, and hearing needs |
| 🌍 **Multilingual Help** | AI responds in 10 languages (EN, ES, FR, PT, AR, DE, JA, KO, ZH, HI) |
| 🌱 **Sustainability Tips** | Recycling, transit, reusable cups, zero-waste stations |
| 🏟️ **Interactive Stadium Map** | SVG map with hover highlights, gates, amenities, and legend |
| 🔒 **Secure AI Integration** | Server-side only API calls, prompt injection detection, rate limiting |
| 🟡 **Offline Mock Mode** | Works without an API key using contextual mock responses |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, TailwindCSS 3 |
| Backend | Node.js, Express 4, TypeScript |
| AI | Google Gemini Flash (configurable) |
| Testing | Jest, Supertest |
| Security | Helmet, CORS, express-rate-limit, input sanitization |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **npm** 9+
- (Optional) Gemini API key for live AI responses

### 1. Clone and set up environment

```bash
cp .env.example .env
# Edit .env and add your Gemini API key (optional — mock mode works without it)
```

### 2. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Run the app

```bash
# Terminal 1: Backend (port 3001)
cd backend
npm run dev

# Terminal 2: Frontend (port 5173)
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

### 4. Run tests

```bash
cd backend
npm test
```

---

## 📁 Project Structure

```
FIFA/
├── .env.example          # Environment variable template
├── .gitignore
├── README.md
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.js
│   └── src/
│       ├── index.ts             # Express server entry point
│       ├── types.ts             # Shared TypeScript interfaces
│       ├── data/
│       │   ├── venues.ts        # 16 FIFA 2026 stadiums
│       │   └── mockResponses.ts # Offline mock AI responses
│       ├── middleware/
│       │   └── sanitize.ts      # Input validation & prompt injection detection
│       ├── routes/
│       │   ├── chat.ts          # POST /api/chat
│       │   ├── venues.ts        # GET /api/venues
│       │   └── health.ts        # GET /api/health
│       └── services/
│           ├── gemini.ts        # Gemini API client with retry & fallback
│           ├── prompt.ts        # System prompt engineering
│           └── session.ts       # In-memory session manager
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx              # Root layout
│       ├── index.css            # Global styles & design system
│       ├── types.ts             # Frontend type definitions
│       ├── api/
│       │   └── client.ts        # Typed HTTP client
│       ├── hooks/
│       │   ├── useChat.ts       # Chat state management
│       │   └── usePreferences.ts # Preferences with localStorage
│       └── components/
│           ├── Header.tsx        # Branding + accessibility toolbar
│           ├── ChatPanel.tsx     # Chat interface with quick actions
│           ├── MessageBubble.tsx # Message rendering with markdown
│           ├── StadiumMap.tsx    # Interactive SVG stadium map
│           └── UserPreferences.tsx # Settings sidebar
└── tests/
    ├── unit/
    ├── integration/
    └── tsconfig.json
```

---

## 🔐 Security Measures

| Threat | Mitigation |
|--------|-----------|
| **API key exposure** | Server-side only; never sent to client |
| **Prompt injection** | Pattern-based detection + system prompt guardrails |
| **XSS** | HTML stripping on input; React auto-escapes on output |
| **Rate abuse** | 30 req/min per IP via express-rate-limit |
| **Large payloads** | 10KB body limit enforced by Express |
| **HTTP headers** | Helmet sets security headers (CSP, X-Frame, etc.) |
| **Invalid inputs** | Strict validation of role, language, venue, message length |

---

## ♿ Accessibility Features

- **ARIA live regions** for screen reader announcement of new messages
- **Full keyboard navigation** — Tab through all controls, Enter to send
- **Skip-to-content link** for keyboard users
- **High contrast mode** toggle in the header
- **Font size adjustment** (A-/A+) for low vision users
- **WCAG 2.1 AA contrast ratios** in default theme
- **Semantic HTML** (`<main>`, `<nav>`, `<aside>`, `<header>`, `role` attributes)
- **`<noscript>` fallback** for browsers without JavaScript
- **Screen reader hints** (`sr-only` instructions for keyboard shortcuts)

---

## 📊 Evaluation Criteria Mapping

| Criteria | Implementation |
|----------|---------------|
| **Code Quality** | TypeScript strict mode, modular architecture, meaningful names, comments |
| **Security** | Helmet, CORS, rate-limit, input sanitization, prompt injection detection, server-only API key |
| **Efficiency** | Sliding window for token management, in-memory sessions, lazy Gemini client, exponential retry backoff |
| **Testing** | 3 unit test suites (sanitize, prompt, session) + 2 integration test suites (chat API, venues API) |
| **Accessibility** | ARIA labels, keyboard nav, high contrast, font sizing, skip links, noscript fallback, semantic HTML |
| **GenAI Integration** | Context-aware prompts, venue knowledge injection, multilingual, role-specific few-shot examples |

---

## 📝 License

Built for the FIFA World Cup 2026 Hackathon. Not affiliated with FIFA.
