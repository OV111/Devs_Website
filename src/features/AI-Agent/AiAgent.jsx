// ─────────────────────────────────────────────────────────────
//  PAGE: AI-Agent  (/ai-agent)
//  Auth-only page — only visible to logged-in users
// ─────────────────────────────────────────────────────────────

// PAGE LAYOUT
// ┌──────────────────────────────────────────────────────┐
// │  Left sidebar  │       Main chat area                │
// │  (conversation │  ┌──────────────────────────────┐   │
// │   history)     │  │  message thread              │   │
// │                │  │  (user + AI bubbles)         │   │
// │  - list of     │  └──────────────────────────────┘   │
// │    past chats  │  [ input box + send button ]        │
// │  - "New Chat"  │                                     │
// │    button      │                                     │
// └──────────────────────────────────────────────────────┘

// ── HEADER SECTION ───────────────────────────────────────────
// - Page title: "AI Dev Assistant"
// - Short subtitle: "Ask anything about code, get instant answers"
// - Mode selector tabs (pill style):
//     • General  •  Code Review  •  Debug  •  Explain Code

// ── LEFT SIDEBAR ─────────────────────────────────────────────
// - "New Chat" button at the top (creates a fresh session)
// - Scrollable list of previous chat sessions
//     each item shows: session title (auto-generated from first message)
//                      + relative timestamp  e.g. "2h ago"
// - Active session is highlighted in purple
// - On small screens sidebar collapses into a slide-in drawer

// ── MAIN CHAT AREA ───────────────────────────────────────────

// EMPTY STATE (no messages yet)
// - Centered illustration or icon (robot / code icon)
// - Headline: "What can I help you build?"
// - 4 quick-start suggestion cards the user can click:
//     • "Review my code snippet"
//     • "Explain this error message"
//     • "Suggest resources from DevsWebs"
//     • "Help me pick a tech stack"

// MESSAGE THREAD
// - User messages: right-aligned, purple bubble
// - AI messages: left-aligned, dark-card bubble
// - AI messages that contain code:
//     rendered in a syntax-highlighted code block
//     with a "Copy" button in the top-right corner
// - AI messages can include:
//     • inline links to blog posts on DevsWebs (from search)
//     • inline links to relevant Roadmaps
//     • inline links to Coding Libs
// - Loading state: animated typing indicator (three dots) while AI responds
// - Each AI message has a thumbs up / thumbs down feedback button

// INPUT BAR (pinned to bottom)
// - Textarea that auto-grows with content
// - Paperclip icon → attach a code snippet or paste a file path
// - Send button (disabled while AI is responding)
// - Keyboard shortcut hint: "Enter to send · Shift+Enter for new line"
// - Character / token counter showing remaining context limit

// ── MODES (selected via header tabs) ─────────────────────────

// GENERAL MODE (default)
//   - Open-ended dev Q&A
//   - AI has context of the current user's saved roadmap and favorite categories
//     so answers are personalized (e.g. "based on your Backend roadmap...")

// CODE REVIEW MODE
//   - User pastes code into a dedicated code editor panel (monaco / codemirror)
//   - Language auto-detected, can be manually changed via dropdown
//   - AI returns structured feedback:
//       • Summary of what the code does
//       • Issues found (with line references)
//       • Suggested improvements
//       • Refactored version (collapsible)

// DEBUG MODE
//   - Two input fields: "Code" + "Error message / stack trace"
//   - AI pinpoints the likely cause and shows a fix
//   - Option to copy the fixed snippet directly

// EXPLAIN CODE MODE
//   - User pastes any code snippet
//   - AI returns a plain-English breakdown, line by line if needed
//   - Complexity level slider: Beginner / Mid / Expert
//     (controls how deep the explanation goes)

// ── SIDEBAR EXTRAS ───────────────────────────────────────────
// - "Suggested for you" section at the bottom of the sidebar:
//     3 blog posts from DevsWebs relevant to recent chat topics
//     pulled via the existing blogsApi search endpoint
// - Small disclaimer: "AI can make mistakes. Always verify code."

// ── STATE MANAGEMENT ─────────────────────────────────────────
// - useAiAgentStore (new Zustand store)
//     sessions: []           — list of past conversations
//     activeSessionId: null  — currently open session
//     messages: []           — messages for the active session
//     isLoading: false       — AI response in-flight
//     mode: 'general'        — active mode tab
// - Sessions persisted to localStorage so they survive page refresh
// - On mount: restore last active session if one exists

// ── API / SERVICE LAYER ──────────────────────────────────────
// - src/services/aiAgentApi.js  (new file, mirrors pattern of blogsApi.js)
//     sendMessage(sessionId, mode, content) → POST /ai-agent/chat
//     getSessions()                         → GET  /ai-agent/sessions
//     deleteSession(sessionId)              → DELETE /ai-agent/sessions/:id
//     submitFeedback(messageId, vote)       → POST /ai-agent/feedback

// ── RESPONSIVE BEHAVIOR ──────────────────────────────────────
// - Desktop (md+): sidebar always visible on the left
// - Mobile: sidebar hidden, accessible via a hamburger/history icon
//   Chat area takes full width on mobile
//   Input bar stays pinned at the bottom of the viewport
