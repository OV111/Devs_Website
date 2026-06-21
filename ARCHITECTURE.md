# DevsWebs — Architecture Review

> Last updated: 2026-06-11 — verified against actual codebase.

---

## How to Explain DevsWebs

### What problem it solves and for whom

Developer learning is fragmented. You follow a YouTube tutorial, read a Medium article, practice on LeetCode, check Stack Overflow — but nothing ties it together. You don't know when you're actually ready to move on, and there's no feedback loop telling you what you're weak at.

DevsWebs solves this for self-taught developers and early-career engineers: it combines a structured roadmap (layered, with locked progression), an integrated exam engine that gates each layer, a curated resource library, a community blog, and an AI mentor that specifically targets your weak spots — in a single product. The core bet is that *gated, measurable progression* is more valuable than more content.

### How the architecture supports scale

Single-instance Express + MongoDB (native driver, not Mongoose) + Redis + BullMQ on Railway. MongoDB native driver was a deliberate choice: Mongoose abstracts away the query layer, and for a document-centric schema (roadmap layers, exam history, weak spots), the native driver is faster and keeps you closer to the actual data model.

Async workloads (notifications, eventually AI pre-processing) are offloaded to BullMQ queues backed by Redis, so the main HTTP thread stays fast. WebSocket (`ws`) handles real-time chat on the same Node process — justified at this scale because a separate WebSocket service would be premature.

Frontend is React + Vite + Zustand. Every route is code-split with `React.lazy`, so the initial bundle only loads what the user's path needs.

### The hardest technical challenges

**1. Agent tool-use loop with streaming.**
The AI mentor isn't just a chatbot — it calls backend tools (`get_user_progress`, `get_exam_history`, `log_weak_spot`) and the Claude API drives the loop. The tricky part is streaming partial text *while* the agent may still be mid-tool-call. The frontend SSE hook handles this with an `AbortController` and incremental `appendStreamChunk`, but the backend has to correctly interleave tool results back into the message history before the next Claude call.

**2. Exam integrity.**
If the correct answers live in the API response, a user inspects the network tab and cheats. The design keeps answers server-side: the frontend submits an answer array, the backend scores it, the network tab never contains a correct answer. This constraint shapes the entire exam API surface.

**3. Gated layer progression.**
Layer N+1 only unlocks when you pass layer N's exam at 80%+. That threshold is stored in a MongoDB `platformConfig` collection, not hardcoded — so you can tune it without a redeploy. The progression state lives server-side in `userProgress`, not localStorage.

### What makes the technical choices defensible

| Choice | Reasoning |
|--------|-----------|
| MongoDB native driver over Mongoose | Control over the exact query shape; no schema-validation overhead; works cleanly with complex aggregations on roadmap + progress + exam data |
| Anthropic over OpenAI for the agent | Claude's 1M context window lets you include a user's full exam history and weak-spot list in the system prompt without chunking; prompt caching makes repeated context cheap |
| BullMQ over in-process queues | Failed notification jobs retry automatically; the queue is durable through restarts — `setImmediate` or `EventEmitter` would lose jobs on crash |
| Zustand over Redux | Stores are simple (auth state, roadmap selection, agent session); Zustand keeps them readable without boilerplate; React Query can be added later for server state |

---

## Architecture Review

### 1. Separation of Concerns

**Verdict: The feature structure is solid; three specific mixing problems need fixing.**

The `features/` directory with co-located components per feature is the right call. The router correctly separates lazy-loaded routes from layout concerns.

**Problem A — `useRoadmapStore` does persistence.**
Inside `setLayerStatus`, the store directly calls `localStorage.setItem`. The store is acting as both state manager and persistence layer. When you wire Phase C (roadmap backend), `setLayerStatus` needs to become an async API call — and the store will need loading/error state it doesn't have. Extract persistence into a thin `roadmapProgressService.js` that the store calls. The store stays synchronous; the service decides whether to hit localStorage or the API.

**Problem B — `RoadmapPage.jsx` has a ghost onboarding flow.**
`handleStart` receives `answers` from `TrackOnboardingPanel` and does `console.log("User answers:", answers)`. The data goes nowhere. When you wire the backend, those answers (skill level, goal) need to create the `userProgress` record. There's currently no path for that data to travel.

**Problem C — JWT in localStorage.**
`useAuthStore` stores the JWT in `localStorage` and sends it as `Authorization: Bearer`. The backend has `cookieParser` wired but the frontend never uses the cookie path. localStorage is readable by any JavaScript on the page (XSS exposure). Before launch: flip to httpOnly cookies — backend sets `Set-Cookie` on login, frontend drops `authHeaders()`, middleware reads from `req.cookies`. The `/verify-token` GET endpoint already works; it needs minimal change.

---

### 2. Scalability — What Breaks First

**#1 — The `/api` prefix mismatch (breaks immediately when you wire the agent).**
The backend mounts everything at root or named paths (`/blogs`, `/library`). The AI agent frontend calls `/api/ai-agent/sessions` and `/api/ai-agent/stream`, which matches nothing. Decision needed now, before Phase B: **prefix all new routes under `/api/`** and leave legacy routes alone. New code is consistent; old code migrates opportunistically.

**#2 — WebSocket rooms Map never shrinks.**
In `backend/websocket/index.js`, `ws.on("close")` only logs. Dead socket references stay in the `rooms` Map forever. On a long-lived Railway process with active chat users, this leaks memory and dead connections receive broadcasts silently. Fix: on `close`, iterate rooms and remove the dead socket reference.

**#3 — `useRoadmapStore` localStorage blocks Phase D (exam engine).**
Layer gating must be server-authoritative. If a user clears localStorage or opens a second device, their progress vanishes and all layers appear unlocked. This is a correctness issue that grows worse with user count.

**#4 — No consistent error response shape on the backend.**
Some routes return `{ message }`, some `{ error }`. Every new contributor will make it worse. A `formatError(code, message)` helper used in all route handlers takes 15 minutes to add and pays off forever.

---

### 3. Performance — Obvious Bottlenecks

**Two animation libraries — justified but worth auditing.**
GSAP for canvas/imperative effects (`SplashCursor`, scroll animations) and Framer Motion for React transitions (`AnimatePresence` in `RoadmapPage`, route transitions) is a defensible split. Framer's bundle is ~30KB gzipped; GSAP core is ~23KB. Run `vite build --mode production` and check the bundle analyzer. If GSAP is only used in 1–2 components, consider CSS animations there instead.

**No server-state caching layer.**
Blog feed, library content, roadmap data — presumably fetched fresh on every mount. Navigating away from Blogs and back re-fetches everything. Adding React Query for server state (alongside Zustand for client state) is the highest-ROI frontend performance change: automatic deduplication, background refresh, stale-while-revalidate.

**`getExamHistory` sorts by `passedAt` even on failed attempts.**
`examHistoryService.js` sets `passedAt` unconditionally on every save. When you query history, failed exams sort incorrectly. Rename to `takenAt` before seeding real data — a data migration after launch is painful.

---

### 4. Developer Experience — What Slows Down Future Contributors

**`src/hooks/` is nearly empty.**
There's `useAgentStream.js` (real SSE streaming), `use-mobile.js` (utility), and a gitkeep. All data fetching presumably lives inside stores or components. As you add API calls in Phase B–E, establish a convention now: custom hooks handle API calls and loading/error state; stores hold derived/shared state. Otherwise each new feature invents its own pattern.

**`features/` has inconsistent depth.**
`AI-Agent/` has `components/` and `mock/` subfolders. `CodingLibs/` dumps everything flat. `Roadmap/` has `components/`. No consistent structure. Simple rule: features with more than 4 files get a `components/` subfolder.

**Dead commented code in production files.**
`RoadmapPage.jsx` lines 66–71 have a commented-out `className` block directly above the active one. Commented code either becomes a `// TODO: #issue` or gets deleted. Stale comments erode confidence in the codebase faster than almost anything else.

**`backend/events/` and `backend/jobs/` are empty gitkeep directories.**
A contributor opening the project sees two empty folders with no explanation. Either add a one-line `README.md` in each or delete them and create them when needed.

---

## Prioritized Fix List

| # | Fix | When |
|---|-----|-------|
| 1 | Decide `/api/` prefix convention, apply to all new routes | Before Phase B |
| 2 | WebSocket `close` handler removes dead socket from `rooms` Map | Phase A |
| 3 | Extract roadmap progress persistence out of the store into a service | Before Phase C |
| 4 | Wire `handleStart` answers in `RoadmapPage` to `userProgress` creation | Phase C |
| 5 | Rename `passedAt` → `takenAt` in `examHistoryService` before seeding real data | Phase D |
| 6 | Add `formatError` helper for consistent backend response shape | Anytime |
| 7 | Audit GSAP vs Framer overlap with bundle analyzer | Before launch |
| 8 | Migrate JWT from localStorage to httpOnly cookie | Before launch (Phase 9 hard requirement) |
