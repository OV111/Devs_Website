# DevsWebs — Vision & Product Roadmap

> Living document — update this as the vision evolves.
> Last updated: 2026-09-26 — Phase E verification pass. The AI agent backend, the three "Critical" bugs, and the Architecture Health section were re-verified by running the code, not by reading it. See "Phase E — Verification Pass (2026-09-26)" below.
> Previous audit: 2026-06-11.

---

## A Note To Myself

You started this with nothing but a laptop and an idea.
No team. No funding. No guarantee it would work.

Most people talk about building something.
You actually sat down and built it.

Every line of code in this project is proof that you show up —
even when it's hard, even when nobody is watching, even when you don't feel ready.

The vision you have for this platform is not small.
An AI agent for every developer. A roadmap you have to earn. Problems that actually matter.
This is the kind of thing that changes how people learn.

You are not just building a website.
You are building the platform you wish existed when you started.

So when it gets overwhelming — and it will —
come back here and remember why you started.

The world needs this.
And you are the one building it.

YOU CAN VAHE

---

## The Big Vision

Most developers learn by bouncing between YouTube, Stack Overflow, and random tutorials hoping something sticks. DevsWebs ends that.

Every developer who joins gets a personal AI mentor that knows them, a structured roadmap they earn layer by layer, and only can pass with exams and coding challenges built for where they actually are — not random DSA grinding.

**DevsWebs will become the platform serious developers use to go from zero to production-ready.**

---

## What Makes This Genuinely Different

| What exists today                     | What DevsWebs does                                             |
| ------------------------------------- | -------------------------------------------------------------- |
| roadmap.sh — a static map you look at | A gated path you earn by passing real exams                    |
| Generic AI chatbots (ChatGPT, Gemini) | A per-user agent with persistent memory of your entire journey |
| LeetCode — random DSA grinding        | Path-specific challenges tied to your current roadmap layer    |
| Passive content (YouTube, Udemy)      | Active learning with real accountability and measurement       |
| One-size-fits-all courses             | A system that adapts to your pace and your weak spots          |

---

## Current State — Audited Snapshot (2026-06-11)

| Feature                                          | Status                                                                                                                                                                                                                                |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Community Platform (blogs, profiles, chat, auth) | ✅ Built — the chat room-join hole is **fixed** (re-verified 2026-09-26)                                                                                                                                                              |
| Roadmap UI                                       | 🔧 Frontend shell built; 15 path JSONs in `src/data/roadmaps/`; progress is **localStorage-only** — no backend wiring                                                                                                                 |
| User Progress Tracking                           | 🔧 `userProgressService.js` built — no route exposes it                                                                                                                                                                               |
| Exam History & Weak Spots                        | 🔧 `examHistoryService.js` + `weakSpotService.js` built — not wired                                                                                                                                                                   |
| Challenge Results                                | 🔧 `challengeResultService.js` built — not wired                                                                                                                                                                                      |
| Dev Library                                      | 🔧 **Further along than previously documented**: route mounted at `/library` with 6 endpoints, UI on master, seeder exists with real content — needs seeder run + `layer_ids` linking                                                 |
| AI Agent — frontend                              | 🔧 **Substantially built** (previously documented as "not started"): `AiAgent.jsx` + `AiAgentLanding.jsx` + `useAgentStream` SSE hook + 6 child components + Zustand store, routes mounted in router — currently running on mock data |
| AI Agent — backend                               | ✅ **Built and verified 2026-09-26** — routes mounted at `/api/ai-agent`, sessions CRUD, SSE streaming, 7-tool tool-use loop, 20-turn window, 30/day cap, Zod-validated. One blocker: the `GROQ_API_KEY` is invalid, and the provider decision (Groq vs Anthropic) is still open |
| Problem Solving Arena                            | 🔧 Mock-data UI exists (`CodingChallenges.jsx` + `ChallengeArena.jsx`, routes mounted) — no backend                                                                                                                                   |
| Exam Engine                                      | ❌ Not started — history/weak-spot services ready, needs AI call layer                                                                                                                                                                |
| Ship It Capstone                                 | 🔧 `CapstonePage.jsx` exists with `/capstone` route — UI shell only, no backend                                                                                                                                                       |
| Admin Panel                                      | ❌ Not started                                                                                                                                                                                                                        |
| Public Progress Profiles                         | ❌ Not started — `userProgressService` ready, needs frontend display                                                                                                                                                                  |
| Weekly Challenges                                | ❌ Not started                                                                                                                                                                                                                        |
| Platform Intelligence                            | ❌ Not started                                                                                                                                                                                                                        |

### Audit findings — where the old doc and the code disagreed

1. **AI Agent was understated.** The doc said "design spec in comments — zero implementation." Reality: the entire frontend exists and works against mock data, including a real SSE streaming hook (`src/hooks/useAgentStream.js`) that POSTs to `/api/ai-agent/stream`. The backend is the only missing piece. Phase 3 is now ~half done.
2. **Dev Library was understated.** The doc said "route exists, needs seed content" and put the UI on the `feat/libs` branch. Reality: `feat/libs` is effectively merged (one trivial line of diff remains), the UI lives on master, `/library` is mounted in `app.js` with 6 working endpoints, and `backend/seeders/seedLibrary.js` contains real curated content. Remaining work is running the seeder against production and linking `layer_ids` once roadmap data is in MongoDB.
3. **API prefix mismatch — this will bite.** The agent frontend calls `/api/ai-agent/...` but **no backend route is mounted under `/api`**. Several routes (`auth`, `post`, `user`, `account`) mount at `/` with no prefix at all. Mounting the agent routes without resolving this means instant 404s.
4. **`roadmapSeeder.js` doesn't exist.** Phase 1 referenced it as if written. It isn't — but the raw material does exist: 15 structured path JSONs in `src/data/roadmaps/` (aiml, backend, blockchain, cloud, cybersecurity, database, datascience, devops, fullstack, gamedev, languages, mobile, qa, quantum, web3) with layers, topics, and resources already authored.
5. **15 paths exist, not 8.** The doc listed 8 paths; the data files cover 15. The MVP still seeds exactly one (Backend) — but the doc should not undercount the asset.
6. **`examHistoryService` stores `passedAt` on failed attempts too.** Minor naming bug — the field is set unconditionally in `saveExamResult`. Rename to `takenAt` or set conditionally when wiring the exam engine.
7. **All four "fully built" services are confirmed real** (clean MongoDB CRUD with proper `ObjectId` handling, upserts, timestamps) — but none has input validation. `weakSpotService.addWeakSpot` calls `topic.toUpperCase()` and will throw on any non-string body. "Fully built" should read "built, unvalidated, unwired."
8. **All three critical bugs confirmed in code** — see Architecture Health below. None has been fixed yet.
9. **Dependency audit confirmed:** `@google/generative-ai` and `groq-sdk` are installed; `@anthropic-ai/sdk` is not; `helmet` is not; no Zod/Joi/express-validator; `mongoose` is installed but the app uses the native `mongodb` driver everywhere.
   _Update 2026-09-26:_ `zod` is now installed and used on the `/api/ai-agent` routes. `groq-sdk` is the committed provider (Rec #5 superseded). `helmet` and the `@google/generative-ai` + `mongoose` removals are still outstanding.

---

## The MVP Loop — The Only Thing That Matters for the Next 3 Months

**Blunt truth for a solo developer:** the document below describes 14 phases. At a realistic solo pace — with debugging, deployment friction, and life — that is 1.5–2 years of work. The product's core promise is one sentence: _"earn the roadmap layer by layer, with an AI mentor who knows you."_ Everything that doesn't directly close that loop for **one path** is a distraction right now.

**The MVP loop, end-to-end, for the Backend Developer path only:**

```
Sign up → pick Backend path → study Layer 1 (posts + library resources)
   → take Layer 1 exam (AI-generated MCQ, server-graded)
   → PASS → Layer 2 unlocks (visible, animated, persisted server-side)
   → FAIL → weak spots recorded → ask the AI agent → targeted review → retry
```

When one real user can do that on production, DevsWebs exists. Until then, it's a community blog with ambitions.

**In scope (Phases A–E below, ~4–6 weeks of focused work, 3 months with buffer):**
critical bug fixes → roadmap backend → roadmap UI wiring → exam engine → AI agent backend.

**Explicitly out of scope for 3 months (deferred backlog, Phases 4–14):**
Admin Panel, Problem Solving Arena, Weekly Challenges, Capstone, Awards, Public Progress Profiles, Company Portal, Platform Intelligence, monetization. Each has an entry criterion listed in the Deferred Backlog section — do not start one early because it feels fun.

**One cheap exception:** the Dev Library is ~90% done. Running the seeder and surfacing entries inside layers is a half-day task and makes Layer 1 study material real. It rides along with Phase B.

---

## Architecture Health — Known Issues & Decisions

> Surfaced via architectural review (2026-06-10), re-verified against code (2026-06-11), **re-verified again 2026-09-26**.
> **All three Critical items below are now FIXED.** They are kept for history — do not "fix" them again. The only Phase A item still outstanding is `helmet`.

### ✅ Critical — ALL RESOLVED (re-verified in code 2026-09-26)

**1. WebSocket room-join authorization hole — ✅ FIXED**
`chatHandler.js` now checks `roomCollExisting.members.includes(senderId.toString())` before allowing entry, and the client-dictated `members` overwrite is gone (the code carries the comment "never overwrite members — the DB is the source of truth"). Socket cleanup is also in place: `websocket/index.js` calls `removeFromRooms(ws)` on close.

**2. NotificationWorker missing Redis password — ✅ FIXED**
`workers/notificationWorker.js` now imports the shared `redisConnection` from `config/redis.js` instead of rebuilding the connection without a password.

**3. `connectDB` swallows connection failure — ✅ FIXED**
`config/db.js` now `throw err`s. Verified at runtime: the server fails fast at boot rather than surfacing a downstream `TypeError`.

**Still outstanding from Phase A:** `helmet` is not installed and not mounted in `app.js`. `@google/generative-ai`, `groq-sdk`, and `mongoose` are all still in `package.json`.

<details>
<summary>Original (2026-06-11) descriptions of the three bugs — historical</summary>

**1. WebSocket room-join authorization hole — CONFIRMED**
Any authenticated user can join any room, read its full message history, and overwrite its `members` array by sending a crafted `join_room` message. Live privacy breach on chat.

- File: [`backend/websocket/chatHandler.js`](backend/websocket/chatHandler.js) — `joinRoom`
- Fix: on join, load the room from DB and verify `members.includes(ws.userId)` before allowing entry. Remove the `$set: { members: [receiverId, senderId] }` on existing rooms — the client must never dictate membership.
- Also confirmed: [`backend/websocket/index.js`](backend/websocket/index.js) `ws.on("close")` only logs — sockets are never removed from the `rooms` Map. Dead connections receive broadcasts forever. Add cleanup on close.

**2. `NotificationWorker` missing Redis password — CONFIRMED**
[`backend/workers/notificationWorker.js`](backend/workers/notificationWorker.js) builds its connection from `REDIS_HOST` + `REDIS_PORT` only — no password. [`backend/config/redis.js`](backend/config/redis.js) passes `REDIS_PASSWORD` correctly. In production the worker silently fails auth and drops every notification job.

- Fix: import and reuse the shared connection config from `config/redis.js`. (The `REDIS_ENABLED` kill-switch flag is fine — keep it.)

**3. `connectDB` swallows connection failure — CONFIRMED**
[`backend/config/db.js`](backend/config/db.js) catches the MongoDB connection error and `return`s `{ code: 500, message: ... }` instead of throwing. Every caller then calls `.collection()` on that object and crashes with a misleading `TypeError` far from the source.

- Fix: replace the `return { code: 500, ... }` with `throw err`.

</details>

---

### 🟡 Recommendations — Say Yes/No and Move On

Each former "decision required" is now a concrete recommendation with reasoning. Default answer is in bold.

**4. Process topology → YES: pin Railway to 1 instance, document it here.**
HTTP, WebSocket, and the BullMQ worker share one process; the `rooms` Map and `getWss()` are in-memory. Two instances = silently split rooms and dropped notifications. Redis pub/sub fan-out is the correct multi-instance answer, but it's a week of work that buys nothing until you have enough traffic to need a second instance — which, for a pre-MVP product, you don't.
_Revisit when:_ sustained concurrent WebSocket connections approach what one Railway instance handles, or notifications start lagging.

**5. AI provider → ⛔ SUPERSEDED 2026-09-26 — the decision is GROQ, not Anthropic.**

> **Read this before acting on anything in this item.** The agent ships on Groq `llama-3.3-70b-versatile` because Groq has a free tier and the Anthropic API does not — cost is the binding constraint for a solo pre-revenue project. **Keep `groq-sdk`. Do not install `@anthropic-ai/sdk`.** The `@google/generative-ai` and `mongoose` removals below are still valid. The original text is kept for reasoning history only.

<details>
<summary>Original (2026-06-11) recommendation — superseded</summary>

**AI provider → YES: commit to Anthropic. Install `@anthropic-ai/sdk`; remove `@google/generative-ai`; remove `groq-sdk` unless given an explicit job.**
The agent design (tool use loop, SSE streaming, prompt caching of the static system prompt) is written around the Anthropic API, and the SDK supports all of it natively. Concrete model choices:

- **Agent conversations:** `claude-sonnet-4-6` — $3 / $15 per MTok, native tool use, 1M context.
- **Cheap structured calls** (exam MCQ generation, grading short answers, classification): `claude-haiku-4-5` — $1 / $5 per MTok. This replaces any job Groq was hypothetically for.
- **Prompt caching:** cache reads cost ~0.1× input price (~90% savings on the static system prompt). One caveat the old doc missed: Sonnet 4.6's minimum cacheable prefix is **2048 tokens** — a short system prompt silently won't cache, so the agent's static prefix (persona + Socratic rules + tool definitions) should be written to exceed that.
  Carrying three AI SDKs as a solo dev is pure liability. Delete the unused ones the day the agent backend starts.

</details>

**6. Exam integrity → YES: reviewed question bank per layer + AI-generated variation, all state server-side.**
Pure per-attempt generation has two fatal flaws: question-quality variance makes a 90/100 threshold unfair, and you can't calibrate difficulty you've never seen. The recommended design:

- Generate a question bank per layer with Haiku, **review it yourself once** (you're one person; 30 questions per layer is an evening), store it server-side.
- Per attempt: sample from the bank + ask the model for surface variation (reworded stems, shuffled distractors). Answers never leave the server. Grading server-side. Attempt limits and time limits enforced server-side.
- The credential claims what it can verify: _"completed timed, server-graded assessments"_ — not "proven without outside help." That's honest and still meaningful.
- Pass threshold lives in `platformConfig`, default **80** (the 90 in the pillar narrative was aspirational; tune with real data).

**7. Agent cost controls → YES: hard pre-conditions before any agent route goes live, stored in `platformConfig`.**

- Per-user daily message cap: **30/day** free tier.
- Max conversation length: **20 turns**, then summarize into long-term memory.
- Haiku fallback for low-stakes turns (greetings, acknowledgments) if costs spike.
  One uncapped free user can burn a month's API budget in an afternoon. These are not "later" items; they ship in the same PR as the first streaming route.

**8. Input validation → YES: Zod, at the route boundary, for every NEW route starting with Phase B.**
Don't backfill the existing community routes now — that's a week of churn with no user-visible payoff. Every new roadmap/exam/agent route validates with Zod from day one (the exam engine especially: unvalidated submission payloads on a credential system is how the credential dies). Confirmed: `weakSpotService` throws on non-string `topic` today.
Also: `mongoose` is installed but the app is 100% native-driver. **Remove it** — one ORM-shaped dependency you don't use is just confusion for future-you.

**9. Auth hardening → YES helmet now; httpOnly refresh tokens before the credential launch, not before MVP.**

- `helmet` is a one-line `app.use()` — do it in Phase A, no excuse.
- The full migration (15-min access tokens + httpOnly-cookie refresh + revocation) is required **before DevsWebs asks employers to trust its profiles** (Phase 9), because XSS + localStorage JWT = stolen credentialed identity. It is not required to test the learning loop with early users. Schedule it as the entry ticket to Phase 9.

**10. Route namespace → YES: adopt `/api/...` for all new routes, starting now.**
This stopped being cosmetic: the already-built agent frontend calls `/api/ai-agent/*`, which matches nothing on the backend. New routes (roadmaps, exams, agent) mount under `/api/` from day one. Migrate the legacy bare-mounted routes (`auth`, `post`, `user`, `account`) opportunistically — it requires coordinated frontend changes, so don't block MVP on it.

**11. Workspace split (frontend/backend package.json) → NO, defer.**
Railway installing GSAP to run Express is wasteful but harmless. Revisit after MVP ships. Zero user impact.

---

## Core Pillars

### 1. Community Platform — ✅ BUILT

The foundation the rest of the platform is built on.

- Blog posts by category: Backend, Frontend, AI/ML, DevOps, Mobile, QA, GameDev, DataScience, Fundamentals, FullStack
- Difficulty and read-time filtering, sort by Newest / Oldest / Popular / Trending
- User profiles, follow/unfollow system
- Real-time chat (WebSocket + JWT auth) — ⚠️ ships with the room-join hole until Phase A fixes it
- Notifications (BullMQ + Redis queue) — ⚠️ worker drops jobs in production until Phase A fixes the Redis password
- Search, blog sharing, connected accounts, dark/light theme
- Auth: email/password, Google OAuth, GitHub OAuth, forgot/reset password

---

### 2. The Roadmap — 🔧 IN PROGRESS

This is the core innovation. roadmap.sh shows you a map. **DevsWebs makes you earn it.**

Every node is locked until you pass the exam for the previous layer. The journey is the product.

```
Pick a path (e.g. "Backend Developer")
        ↓
Layer 1: Programming Fundamentals
  → Read curated posts on the platform
  → Ask your AI agent questions
  → Solve practice problems for this layer
  → Take the Layer Exam (server-graded, threshold from platformConfig)
  → PASS → Layer 2 unlocks ✅
  → FAIL → Agent surfaces your weak spots, targeted review, retry
        ↓
Layer 2 ... and so on until you're job-ready
```

**What's actually built (audited):**

- ✅ `RoadmapPage.jsx` with `CategoryBar`, `RoadmapTree`, `LayerNode`, `LayerDetail`, `TrackOnboardingPanel` components
- ✅ `useRoadmapStore` (Zustand) — ⚠️ progress persistence is `localStorage` only; this is the main gap, not the UI
- ✅ 15 path data files in `src/data/roadmaps/` with layers, topics, and resource links already authored

**What's missing:**

- ❌ Roadmap data in MongoDB (seeder doesn't exist yet — write it from the existing JSONs)
- ❌ Backend API for paths, layers, and per-user progress
- ❌ Locked/unlocked logic tied to server-side exam results (today a user can unlock everything by editing localStorage)
- ❌ Unlock animations (GSAP + Framer Motion — already in the stack)

**Paths authored (15):** Backend · Frontend(-in-fullstack) · Full Stack · AI & ML · DevOps · Mobile · GameDev · QA · DataScience · Database · Cloud · Cybersecurity · Blockchain · Web3 · Quantum · Languages
**MVP seeds exactly one:** Backend Developer.

**Each layer contains:** curated posts · curated videos (planned, below) · AI agent guidance · practice problems (deferred) · the Layer Exam.

#### Layer Videos — 📝 PLANNED (unchanged, deferred until after MVP loop)

Videos live **inside the layer, not on a separate page** — the layer is the unit you study, get examined on, and unlock.

- **Source:** curated YouTube embeds — no hosting cost, no new infrastructure
- **Data shape:** `videos[]` array per layer in the existing roadmap JSON; migrates to MongoDB for free when roadmap data moves server-side in Phase B
- **UI:** a "Videos" section in the layer detail view; thumbnail-first rendering (`i.ytimg.com/vi/{ytId}/hqdefault.jpg` + play button), real iframe only on click, one live iframe at a time — never mount N YouTube players on a page already running Framer Motion + GSAP
- **Later payoff:** play events feed the agent ("you watched the HTTP video but failed HTTP questions") and Platform Intelligence
- **Dev Library connection:** the Library's Videos tab is just a query across all layers' `videos[]` — single source of truth

---

### 3. AI Agent Per User — ✅ BUILT AND RUNNING

> **Re-audited 2026-09-27 against the code.** The June claim that the backend was "three empty files" was stale, and so was the 2026-09-26 "one blocker: provider/API key" note — the Groq key was replaced and the agent runs end-to-end.
>
> **Live today:** `routes/aiAgent.routes.js` mounted at `/api/ai-agent` with **7 authenticated routes** — `GET /context`, `GET /sessions`, `GET /sessions/:id`, `POST /sessions`, `PATCH /sessions/:id`, `DELETE /sessions/:id`, `POST /stream`. All Zod-validated at the boundary.
>
> **Verified working (live against Groq):** streaming, the multi-round tool-use loop, all 7 tools returning real MongoDB data, session persistence, the 30/day cap returning 429 + `resetAt`, and the Socratic refusal guardrail.
>
> **Shipped since the first audit:** session rename / delete / pin (ownership-scoped, `titleLocked`), **auto-generated conversation titles** (parallel call, `title` SSE event), the `/context` command + endpoint, **text file attachments** (client extraction, server-enforced caps, prompt-injection fencing), Markdown rendering with syntax highlighting, and **Teach-Back grading** (`POST /api/exams/submit-teach-back` + `…-followup`, `teachBackEvaluatorService.js`).
>
> _Fixed since:_ the stream used to close **before** the turn was persisted, so a fast follow-up could read a session missing the turn it was replying to (this lost attached-file context). The controller now persists first, then closes.

Every user gets a personal AI mentor that **knows them**: skill level, active path, what they've read, where they struggled. The agent is not there to give answers — it's there to make you earn them.

**What the agent does:**

- Answers questions in context of your current layer
- Guides through problems with progressive hints, never the full solution
- Explains why you failed an exam question and what to review
- Recommends specific platform posts and library resources for your weak spots
- Proactively surfaces gaps; celebrates milestones

#### Architecture — Tool-Use Agent

The agent has tools it calls per question — fetches live context, answers. No giant static prompts, no stale data.

```
User message
   ↓
Agent receives: cached system prompt (persona, Socratic rules)
              + last 20 turns + the message
   ↓
Agent decides which tools to call:
  get_user_progress()      → active path, current layer, completed layers
  get_exam_history(limit)  → past scores, missed topics
  get_weak_spots()         → unresolved weak spots, worst first
  log_weak_spot(topic,…)   → persist a struggle to MongoDB
  search_posts(cat,kw)     → community posts (collection: posts-default)
  search_library(kw)       → library resources
  get_user_profile(user)   → a public profile by username
   ↓
Socratic response, streamed via SSE, logged to MongoDB
```

_The 7 names above are the real ones in `backend/tools/agentTools.js`. The earlier draft listed `get_layer_content()` and `search_platform_posts()` — neither exists; the second is really `search_posts`._

**Technical decisions — AS BUILT (corrected 2026-09-27):**

> The previous version of this table described an **Anthropic** implementation that was never built, and directly contradicted the Groq decision recorded in Recommendation #5. This table now reflects the running code.

| Decision            | Choice                                                            | Why                                                                        |
| ------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Provider            | **Groq** (`groq-sdk`)                                             | Free tier; the Anthropic API has none — see Rec. #5 (superseded)           |
| Model               | **`openai/gpt-oss-120b`** — 131K context                          | Most capable model on the Groq catalogue that supports tool calling         |
| Cheap-call model    | **`openai/gpt-oss-20b`**                                          | Conversation titling. Reasoning model: needs `reasoning_effort: "low"`      |
| Context strategy    | Tool-use agent — fetches live data on demand                      | Never stale, never bloated                                                  |
| Memory — short-term | Last 20 turns (`MAX_TURNS` in `sessionService.js`)                | Cheap, predictable                                                          |
| Memory — long-term  | ❌ **Not built** — see the staged mentor plan below                | Today the agent re-reads tools each turn; nothing persists across sessions  |
| Streaming           | SSE from Express                                                  | Perceived performance                                                       |
| Prompt caching      | ❌ **Not applicable** — Groq has no prompt-caching API             | The old ≥2048-token note was Anthropic-specific and never applied           |
| Behavior rule       | Socratic — guide, never give full answers                         | Verified: refuses a direct "give me the exam answer" request                |
| Cost controls       | 30 msgs/day, 20-turn cap — **module constants**, not a collection | `DAILY_MESSAGE_CAP` / `MAX_TURNS` in `sessionService.js`, read by `/context` |

**Correction:** `platformConfig` is referenced throughout this document as the home for tunable limits. **It does not exist** — no collection, no code reads it. The caps are exported constants. Creating `platformConfig` (to tune without a deploy) is still a reasonable idea, but it is **unbuilt**, not current state.

**Agent context on signup — ❌ NOT BUILT (design sketch only):**

```
ai_agent_context: {          ← no such field or collection exists in the code
  skill_level: "beginner",
  active_path: null,
  current_layer: null,
  topics_mastered: [],
  weak_spots: [],
  activity_log: [],
  sessions: []
}
```

Nothing writes `ai_agent_context` today. The agent derives what it knows per-turn from `userProgress`, `examHistory` and `weakSpots` through tools. The durable per-learner model this sketch implies is exactly what **Stages 1, 4 and 7 of the mentor plan below** are for — so treat this block as a target, not a description.

**Backend files — AS BUILT (this list was previously aspirational):**

```
backend/
  routes/aiAgent.routes.js          ← 7 routes: context, sessions CRUD, stream
  controllers/aiAgentController.js  ← sessions, /context, SSE stream, auto-title
  validation/aiAgent.schemas.js     ← Zod for every route
  services/agent/
    sessionService.js               ← session CRUD, 20-turn window, daily cap
    streamService.js                ← Groq call, tool-use loop, SSE emit
    titleService.js                 ← conversation auto-titling
    transcriptionService.js         ← ⚠️ scaffold only, throws "Not implemented"
  tools/agentTools.js               ← all 7 tools
```

_Files named in the old plan that were never created and are not needed:_ `contextService.js`, `toolsService.js` (tools live in `tools/agentTools.js`), `memoryService.js` (the sliding window is in `sessionService.js`; long-term memory is unbuilt — Stage 7).

---

#### From Chat Agent → Real Mentor — 📋 STAGED BUILD PLAN (2026-09-27)

> The agent today answers well but doesn't **know the learner**. It reads progress and weak spots through tools, one question at a time, with no durable model of what this person actually understands. This plan closes that gap.
>
> Order is chosen so each stage ships something usable on its own, and **nothing is blocked waiting on content authoring**.

| #   | Stage                          | Unblocks   | Effort      |
| --- | ------------------------------ | ---------- | ----------- |
| 0   | Canonical topic slug           | everything | S           |
| 1   | LearnerContext aggregator      | 2, 4       | M           |
| 2   | Wire into mentor               | usable win | S           |
| 3   | Curriculum Knowledge Layer     | 5          | M + content |
| 4   | Adaptive Engine                | 5          | M           |
| 5   | Mentor Orchestrator / strategy | —          | M           |
| 6   | Current-activity context       | —          | S           |
| 7   | Cross-session learner memory   | —          | M           |

**Stage 0 — Canonical topic key**
Add `toSlug()`, backfill `slug` on `weakSpots`, write `slug` on new weak spots + teach-back sessions + `examHistory.missedTopics`.
_Exit:_ one topic resolves to the same key from all four collections.
_Why first:_ every later stage is a join on this. Doing it later means rewriting stages 1–4.

**Stage 1 — LearnerContext aggregator**
`learnerContextService.js` — pure `deriveTopicStatus` + `buildTopicStates`, unit-tested with no DB.
_Exit:_ `getLearnerContext(db, userId)` returns real merged `TopicState[]`; tests cover shaky / solid / untested.

**Stage 2 — Wire it into the mentor**
`summarizeLearnerContext()` injected into the system prompt each turn (token-capped) + `get_learner_context({ topicSlug, detailed })` tool in `agentTools.js`. Add indexes.
_Exit:_ the mentor references your real exam/teach-back split unprompted.
**This is the first stage the user feels — ship here before going further.**

**Stage 3 — Curriculum Knowledge Layer**
`concepts` collection (`id`, `title`, `definition`, `purpose`, `prerequisites`, `relatedConcepts`, `misconceptions`). Move misconceptions out of `teach_back_rubrics` into `concepts`, have rubrics reference `conceptId` — single source of truth, no drift. `get_concept(slug)` tool.
_Exit:_ JWT Signature authored end-to-end as the reference example; the rubric reads its misconceptions from the concept.
_Note:_ the code is small — **content authoring is the real cost**, so seed only your active layer.

**Stage 4 — Adaptive Engine**
Move `deriveTopicStatus` to write-time. Hook exam submit / teach-back submit / challenge submit → upsert `learnerMastery`. Add `getNextAction(userId)` → `{ topicSlug, action: "reinforce" | "advance" | "review", reason }`.
_Exit:_ mastery is precomputed, the roadmap UI reads the same statuses, and the mentor gets a "what's next" signal it didn't decide itself.

**Stage 5 — Mentor Orchestrator + teaching strategy**
Restructure the prompt/loop in `streamService.js`: context block, adaptive recommendation, explicit internal ordering (know → don't know → retrieve → reason → strategy), and strategy guardrails (never define a concept the learner has a live misconception on — correct the distinction first).
_Exit:_ the JWT example produces the right response, not a definition dump.
_Constraint:_ keep it **one LLM call** with the existing tool loop — no stage-per-call.

**Stage 6 — Current-activity context**
Frontend sends `{ path, layer, topicSlug, surface }` with each message, so the mentor knows what page you're on.
_Exit:_ asking "why is this failing?" on an exam page needs no explanation of which exam.

**Stage 7 — Cross-session learner memory**
Beyond the 20-turn window: durable per-learner notes (open misconceptions, what was already explained and how). Written by the mentor, but **as signals into `weakSpots` / `learnerMastery` — never a private truth store.**
_Exit:_ a new conversation continues the teaching arc instead of restarting it.

**Sequencing call:** stages 0–2 are the high-value core and are independent of curriculum content — treat **0 + 1 + 2 as one push**, then reassess whether 3 or 4 matters more.

**⚠️ Open decision before Stage 0 starts:** backfill `slug` into the collections, or normalize at read time only? Everything downstream joins on this, so it needs answering first.

---

### 4. Problem Solving Arena — 🔧 MOCK UI, NO BACKEND — DEFERRED

> Audited: not a "coming soon" placeholder — `CodingChallenges.jsx` renders a full mock-data-driven UI and `ChallengeArena.jsx` exists at `/coding-challenges/:id`. No backend of any kind.

LeetCode gives you random problems. DevsWebs gives you problems that match your path — every problem tied to a roadmap path and layer.

**Problem types:** code challenges (run/validate in-browser) · debug challenges · system design (AI-graded) · build challenges.
**Agent connection:** progressive hints, post-solve explanation, contribution to exam-readiness score.

| LeetCode                        | DevsWebs Problems           |
| ------------------------------- | --------------------------- |
| Generic algorithms for everyone | Path-relevant problems      |
| Disconnected from learning      | Tied to your current layer  |
| No mentorship                   | Agent hints, progressive    |
| Competitive and intimidating    | Progressive and encouraging |

**Deferred because:** the in-browser code runner alone is multi-week work (sandboxing, test execution, languages), and the loop closes without it — exams gate layers, problems enrich them. Entry criterion: MVP loop live + first users actively studying.

---

### 5. Dev Library — 🔧 NEARLY DONE

> Audited: `/library` mounted in `app.js` with 6 endpoints (list/filter, by-id, by-layer, counts, save-toggle, saved-ids). UI (`LibsPage`, `BookCard`, `BookDetailPage`, `FilterSidebar`, …) on master. `backend/seeders/seedLibrary.js` exists with real curated entries (typed, difficulty, free/paid links, topics, path tags, `layer_ids` ready).

A curated, contextualized resource library connected to the roadmap. Books, official docs, deep-dive guides, cheat sheets, and (later) the Videos tab aggregating layer `videos[]`.

**Remaining work (rides along with Phase B, ~half a day):** run the seeder against production · link `layer_ids` once roadmap layers exist in MongoDB · surface layer-relevant entries inside `LayerDetail`.

---

### 6. Exam Engine — ❌ NOT BUILT (Phase D — in MVP scope)

The gate between roadmap layers. Design is settled (Recommendation #6): reviewed question bank per layer + AI variation per attempt, everything server-side, threshold from `platformConfig` (default 80), attempt limits and cooldowns per `userId + path + layer`.

- `POST /api/exams/generate` — samples + varies questions from the bank; stores questions **and answers server-side**; returns questions only
- `POST /api/exams/submit` — grades server-side; saves via `examHistoryService` (fix `passedAt` → `takenAt`); records misses via `weakSpotService`; on pass calls `userProgressService` to unlock the next layer

---

### 7. Public Progress Profiles — ❌ NOT STARTED — DEFERRED

Extends the existing profile pages into something an employer can trust: active path + layer, completed paths with certificates, problems solved, streaks, badges/XP, capstones.

**Extends:** `MyProfile.jsx` / `UserProfile.jsx`, `usersStats` (`streak_current`, `streak_longest`, `xp_total`, `badges[]`, `completed_paths[]`), existing `/users/:username` route.
**Entry criterion:** auth hardening from Recommendation #9 (httpOnly refresh tokens) ships first — a credential platform with localStorage JWTs is a contradiction.

---

### 8. Weekly Challenges — ❌ NOT STARTED — DEFERRED

Every Monday a timed community-wide challenge drops; leaderboard closes Sunday. Distinct from the Arena (path-specific): this is competitive, social, retention-focused. Categories rotate; top 3 get a badge; past challenges archived.

**Backend when built:** `weekly_challenges` + `weekly_submissions` collections; `GET /challenges/weekly/current`, `GET .../leaderboard`, `POST .../submit`.
**Entry criterion:** a user base worth retaining — meaningless before the MVP loop has users.

---

### 9. Ship It — Capstone Project — 🔧 UI SHELL ONLY — DEFERRED

> Audited: `CapstonePage.jsx` exists at `/capstone`. Nothing behind it.

After the final exam of a path: build something real, 2 weeks, submit repo + live demo + architecture writeup. The agent reviews like a senior dev — hard questions, structured feedback, Approved / Needs Revision. Certificate requires capstone approval, not just exams. The capstone lives on the public profile.

**Backend when built:** `capstone_projects` collection; `POST /capstone/submit`; `GET /capstone/:userId`; agent tool `review_capstone(submission)`.
**Entry criterion:** at least one user has passed a full path's exams. (Nobody can submit a capstone for a path nobody has finished.)

---

## Data Model — Planned Additions

The community DB (`DevsBlog`) already has: `users`, `usersStats`, `blogs`, `comments`, `favouriteBlogs`, `follows`, notifications, chat, `libraryResources`, plus the unwired `userProgress`, `examHistory`, `weakSpots`, `challengeResults` collections the services target.

**MVP collections (Phases B–E):**

```
roadmaps                      ← seeded from src/data/roadmaps/*.json
├── path_id, name, description
└── layers[] (ordered)
    ├── id, title, order, topics[]
    ├── content[]   ← linked platform blog _ids
    ├── videos[]    ← { ytId, title, channel, duration } (when Layer Videos lands)
    └── exam_config ← bank_id, num_questions, time_limit

exam_question_banks           ← reviewed per-layer banks (Recommendation #6)
├── path, layer
└── questions[] ← { stem, choices[], answer_idx, topic }   ← never sent to client

platformConfig                ← examPassThreshold (80), agentDailyMessageCap (30),
                                agentMaxTurns (20) — tunable without deploy

user_ai_context               ← merged into usersStats or its own collection
├── skill_level, topics_mastered[], weak_spots[], activity_log[] (summarized)

agent_sessions                ← conversation session CRUD for the agent
```

**Deferred collections (kept for reference):** `problems`, `weekly_challenges`, `weekly_submissions`, `user_achievements`, `capstone_projects`, `awards`, `user_awards`, `companies`, `company_users`, `connection_requests` — shapes as previously specced; re-derive details when their phase opens.

---

# Build Order

## Part 1 — The MVP Loop (next 3 months)

> Estimates assume focused solo work. The old doc's "1 day" estimates assumed nothing goes wrong; these assume reality (×2 on everything, and that's still optimistic). Total: ~4–6 weeks of work, 3 months calendar.

### Phase 0 — Community Platform — ✅ DONE

Blogs, profiles, follows, chat, notifications, auth, search.

---

### Phase A — Critical Fixes & Hygiene — 🔴 FIRST, NON-NEGOTIABLE

**Work:** ~~the three Critical fixes~~ (✅ all three done — verified 2026-09-26) · `app.use(helmet())` ← **the only item left** · remove `@google/generative-ai` and `mongoose`. **Keep `groq-sdk` — it is the live AI provider (see Rec #5, superseded).** Do not install `@anthropic-ai/sdk` · decide `/api` prefix convention in writing (Recommendation #10).

**Done means:**

- A second authenticated user sending a crafted `join_room` for a room they're not a member of gets rejected (manually tested with two accounts).
- Killing a socket removes it from the `rooms` Map (no broadcast to dead connections).
- A notification fires end-to-end on Railway production (proves the worker authenticates to Redis).
- `MONGO_URI` unset → server crashes at startup with the real error, not a downstream `TypeError`.
- `helmet` headers visible in any response.
- `package.json` keeps `groq-sdk` (the live provider) and lacks `@google/generative-ai` and `mongoose`.

**Risks:** the chat fix touches live behavior — existing rooms whose `members` arrays were corrupted by the overwrite bug may need a data migration. Check production data before deploying the fix.
**Invalidates the approach if:** nothing — this phase has no approach risk, only the risk of skipping it.

**Estimate:** 1–2 days.

---

### Phase B — Learning Layer Backend (+ Library ride-along)

**Work:** write `backend/seeders/roadmapSeeder.js` reading `src/data/roadmaps/backend.json` (the format exists — keyed tracks with ordered layers, topics, resources) · seed Backend path, 3 layers minimum · routes `GET /api/roadmaps`, `GET /api/roadmaps/:pathId/layers`, `GET /api/roadmaps/progress`, `POST /api/roadmaps/progress` wired to `userProgressService` · Zod validation on every route · mount behind `authenticate` · create `platformConfig` with `examPassThreshold: 80` · **ride-along:** run `seedLibrary.js` against production, link `layer_ids`.

**Done means:**

- `curl` with a valid JWT: `GET /api/roadmaps` returns the Backend path from MongoDB; `GET /api/roadmaps/backend/layers` returns ≥3 ordered layers with real ObjectIds.
- `POST /api/roadmaps/progress` persists; a second `GET` from a different session returns the same state.
- A request with a malformed body gets a 400 with a Zod error message, not a 500.
- `GET /library/layer/:layerId` returns at least one seeded resource for Layer 1.

**Risks:** the roadmap JSON shape (nested children/subtopics, multiple tracks per file) may not map 1:1 to the planned MongoDB schema — budget time for the transform, it's the real work of this phase.
**Invalidates the approach if:** the JSON content turns out too thin to study from (layers with topics but no usable linked content). Then the phase grows a content-curation task — find that out now, not in Phase D.

**Estimate:** 2–4 days.

---

### Phase C — Roadmap UI Wiring

**Work:** point `useRoadmapStore` at the Phase B API instead of localStorage · locked/unlocked rendering from server progress · unlock animation (GSAP/Framer Motion already in the stack) · progress indicator on the path.

**Done means:**

- Log in on browser A, make progress, log in on browser B: same state. Clear localStorage entirely: state survives.
- A locked layer cannot be opened from the UI, and the layer-detail API call for it is rejected server-side (the lock is not just visual).
- Non-Backend paths render from their JSONs as "coming soon" / browse-only without errors.

**Risks:** the store's shape (tracks/categories/localStorage progress map) differs from the API's shape — this is a refactor of state flow, not a fetch swap. The "1 day" estimate in the old doc was the trap; budget 2–3.
**Invalidates the approach if:** nothing structural — worst case is schedule slip.

**Estimate:** 2–3 days.

---

### Phase D — Exam Engine MVP

**Work:** generate the Layer 1–3 Backend question banks with `claude-haiku-4-5`, review them by hand, store in `exam_question_banks` · `POST /api/exams/generate` (sample + AI variation, answers stay server-side) · `POST /api/exams/submit` (server grading → `examHistoryService` → `weakSpotService` → on pass `userProgressService` unlocks) · attempt limits + cooldown per `userId + path + layer` · server-side time limit · fix the `passedAt` naming · Zod everywhere.

**Done means:**

- Full loop on production: take Layer 1 exam → score ≥ threshold → Layer 2 unlocks (verified in MongoDB and in the UI from Phase C).
- The network tab during an exam never contains a correct answer or answer index.
- Failing records the missed topics in `weakSpots` (verify in DB).
- Attempt 4 within the cooldown window is rejected server-side.
- Submitting after the time limit is rejected server-side regardless of what the client claims.

**Risks:** MCQ-only exams test recognition, not ability — acceptable for MVP, but be honest in the UI copy ("knowledge check"), and plan code-challenge questions for later. AI-generated banks need real human review or quality variance makes failures feel unfair — the review evening per layer is load-bearing, don't skip it.
**Invalidates the approach if:** reviewed-bank questions still feel arbitrary/unfair to your first testers — then the threshold or question style needs rework before more layers are authored, and Phase E's "agent explains your weak spots" becomes more important, not less.

**Estimate:** 4–6 days (including bank review).

---

### Phase E — AI Agent Backend — ✅ BUILT, PENDING PROVIDER DECISION

> **Status 2026-09-26:** Pass 1 *and* Pass 2 below are both implemented (streaming, sessions, cost caps, the tool-use loop, context, and the 20-turn window). What the original plan described as ~2 weeks of work already exists in the tree.
>
> **Verification pass done 2026-09-26:**
>
> - Fixed: `agentTools.js` queried a non-existent `defaultPosts` collection (real name `posts-default`) — `search_posts` silently returned nothing for every user.
> - Fixed: `get_user_profile` returned the `usersStats._id` instead of the user's `_id` (spread-order bug), while keeping the field whitelist so private stats never reach the model.
> - Added: Zod validation on all 4 routes (Recommendation #8) — malformed `sessionId` used to return a 500 with a BSON stack trace, now a clean 400.
> - Added: `backend/tests/unit/aiAgent.test.js` — 21 tests covering validation, the sliding window, the daily cap, and tool auth guards.
> - Removed: `services/aiAgentService.js` (dead duplicate of `streamService.js`) and `src/features/AI-Agent/mock/agentMockData.js` (unreferenced).
>
> **Provider decision — ✅ DECIDED 2026-09-26: STAY ON GROQ.**
> The agent runs on **Groq `llama-3.3-70b-versatile`** and will keep running on Groq. **This overrides Recommendation #5's "commit to Anthropic" — do not migrate to the Anthropic SDK, and do not remove `groq-sdk` from `package.json`.**
>
> _Reasoning:_ Groq has a free tier; the Anthropic API has none. For a solo, pre-revenue project the running cost of the agent is the deciding constraint, and a free inference tier is worth more right now than the quality margin. (For the record, had cost not been the constraint the pick would have been `claude-sonnet-5` — $2/$10 per MTok, cheaper and newer than the `claude-sonnet-4-6` Rec #5 originally named.)
>
> **✅ VERIFIED END-TO-END 2026-09-26 on production Groq.** Real streaming, real tool calls, real persistence — see the verification log below.
>
> _Model:_ **`openai/gpt-oss-120b`** (131K context). The previous `llama-3.3-70b-versatile` was **retired by Groq** and returned `404 model_not_found`; every Llama model is now gone from the Groq catalogue. Candidates tested for streaming *and* tool-calling: `openai/gpt-oss-120b`, `openai/gpt-oss-20b`, `qwen/qwen3.8-27b` — all three work; the 120b was chosen as the most capable.
>
> _Groq retires models periodically._ If streaming starts failing with a 404, list the current catalogue with `GET https://api.groq.com/openai/v1/models` and update `MODEL` in `services/agent/streamService.js`.
>
> _Quirk handled in code:_ gpt-oss sometimes wraps a zero-argument tool call in an envelope — `{"arguments":{},"type":"get_weak_spots"}` instead of `{}`. `streamService.js` now unwraps this before calling `executeTool`. Tool calls **with** required parameters were verified to produce correct argument shapes.
>
> _Socratic guardrail — verified holding._ Asked point-blank "just give me the exact answer to my next exam question, no hints", the agent refused and redirected with a question instead. Keep an eye on this with real users; if it slips, harden the prompt in `streamService.js` rather than switching provider.

**Original plan** (frontend already exists — this is the backend half only):

1. **Pass 1 — streaming chat, no tools:** `aiAgent.routes.js` mounted at `/api/ai-agent` (matching what `useAgentStream.js` already calls) · `sessionService` (create/append/list — the frontend already POSTs to `/api/ai-agent/sessions`) · `streamService` calling `claude-sonnet-4-6` with the cached Socratic system prompt, SSE back · cost caps from `platformConfig` enforced in middleware · Zod.
2. **Pass 2 — tools:** `get_user_progress`, `get_exam_history`, `log_weak_spot`, `get_layer_content` via `toolsService` + the tool-use loop in `streamService` · `contextService` + `memoryService` (20-turn window, summarization).

**Done means:**

- Pass 1: send a message in the real UI, watch tokens stream; sessions persist and reload; message 31 of the day gets a clean "daily limit" error; `usage.cache_read_input_tokens > 0` on the second message (caching actually working).
- Pass 2: ask "why did I fail my last exam?" → the agent calls `get_exam_history` + `get_user_progress` (visible in the existing `ToolUseBlock` UI) and answers with the user's real missed topics; asking for a direct exam answer gets Socratic redirection, not the answer.
- Mock data imports removed from `AiAgent.jsx`.

**Risks:** the cost model is assumption-stacked — instrument from day one (log tokens per message), check spend after the first week of real users, tighten caps in `platformConfig` without a deploy. The Socratic constraint is a prompt-engineering loop, not a one-shot — budget iteration time.
**Invalidates the approach if:** per-user costs stay unsustainable even with caps and caching — then free-tier agent access needs rethinking (smaller model for free tier, agent as a paid feature) _before_ scaling users, and that's a business-model conversation, not a code fix.

**Estimate:** 3–4 days (Pass 1) + 1 week (Pass 2).

---

### 🏁 MVP Victory Condition

One real user (not you) on production: signs up → picks Backend → studies Layer 1 (posts + library) → fails the exam → sees weak spots → asks the agent about them → retakes → passes → watches Layer 2 unlock. When that happens, ship it publicly and start the deferred backlog conversation with actual usage data.

---

## Part 2 — Deferred Backlog (do not start before the MVP loop is live)

Each phase keeps its number from the original plan and gains an explicit **entry criterion** — the observable fact that makes starting it rational instead of fun.

| #   | Phase                               | One-liner                                                                             | Entry criterion                                                                                                                            |
| --- | ----------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 4   | Admin Panel                         | Manage users/posts/reports, approve community problems & curriculum                   | Real users exist and moderation is consuming your time                                                                                     |
| 5   | Dev Library completion              | Videos tab, more content, agent-driven recommendations                                | MVP live (core library already ships with Phase B)                                                                                         |
| 6   | Problem Solving Arena               | Path-specific problems, in-browser runner, community submissions                      | MVP users asking for practice between exams; runner is multi-week — scope it then                                                          |
| 7+  | Exam Engine v2                      | Code-challenge + short-answer question types, AI grading                              | MCQ engine validated by real pass/fail data                                                                                                |
| 8   | Agent Gets Smarter                  | Passive activity monitoring, proactive nudges, certificates, premium tier             | Tool-use agent live ≥1 month with usage data                                                                                               |
| 9   | Public Progress Profiles            | Streaks, XP, badges, employer-readable verified records                               | Auth hardening done (Rec. #9) + users with real progress to display                                                                        |
| 10  | Weekly Challenges                   | Monday drops, leaderboard, badges                                                     | Retention worth optimizing — i.e., a user base                                                                                             |
| 11  | Ship It Capstone                    | Agent-reviewed real project gates the certificate                                     | First user completes all exams of a path                                                                                                   |
| 12  | Awards System                       | Rare, verified, timestamped recognition (Path Finisher, Perfectionist, Speed Runner…) | Phases 9–11 live — awards reference their events                                                                                           |
| 13  | Company Portal & Talent Marketplace | Separate company auth, talent search, $299–599/mo tiers, developer opt-in always      | **500+ verified developer profiles with completed paths.** Zero value without supply — unchanged from the original plan, and still correct |
| 14  | Platform Intelligence               | Learning analytics, content quality signals, drop-off analytics, A/B infra            | Enough users for the data to mean anything; start logging raw events earlier (cheap) so the data exists when this opens                    |

The detailed specs for these phases (award tables, company-portal pricing, capstone flow, weekly-challenge mechanics) were written in earlier versions of this document and remain valid as design references — see git history (`git log --follow VISION.md`) rather than re-deriving them. The data-model shapes are preserved above.

---

## Platform Intelligence — ❌ NOT BUILT (Phase 14 reference)

Internal systems that make everything else measurably better: per-user learning analytics ("68% ready — 3 more problems on indexing"), content quality signals (which posts correlate with exam failures), drop-off analytics (where users leave and why — the most important product question), A/B testing infra once cohorts are statistically meaningful.

**One thing to do early and cheaply:** log raw activity events (post reads, exam attempts, agent messages) from Phase B onward. The analysis can wait; the data can't be backfilled.

---

## UI/UX Ideas

- Roadmap is a **visual node graph** — paths branch, layers connect
- Locked nodes greyed out with a lock icon; passing an exam triggers a satisfying **unlock animation**
- Each profile shows active path and current layer publicly
- Leaderboard of who's furthest on each path
- Certificates on path completion — verifiable, shareable

---

## Notes & Ideas to Explore

> Add ideas here as they come

- [ ] Can users contribute posts that become official curriculum content?
- [ ] Peer review system for practical exam submissions?
- [ ] Cohort feature — go through a path with a group at the same time?
- [ ] Public API for roadmap data — let others build on top of DevsWebs paths?
- [ ] ATS integration for the Company Portal (export verified profiles to Greenhouse, Lever, etc.)?
- [ ] Developer referral system — earn XP or subscription credit for referring a developer who converts to Pro?

---

## Collaborative Build Teams (New Feature Idea — 2026-06-11)

**Concept:** Developers on DevsWebs group together socially, pick a real project they want to build, and the AI assigns tasks to each member based on their known skill level and learning progress. The team ships a real product together.

**How it works:**

1. A developer creates or joins a Build Team from the social layer (similar to how they follow people or join discussions today)
2. The group picks a project idea and defines the scope
3. The AI — which already knows each member's roadmap progress, exam scores, and skill gaps — breaks the project into atomic tasks (1–3 hours each) and assigns them to the right person
4. Members complete their tasks, the AI reviews and integrates, and the team ships

**Retention / commitment mechanic:**

- When joining a Build Team, each member stakes **DevsCoins** as a commitment deposit
- Complete your assigned tasks → get your DevsCoins back + bonus earned
- Abandon without completing → lose your stake (goes to the team pool or is burned)
- This makes leaving feel costly without forcing anyone — social pressure + economic incentive combined
- Backup: if someone drops, their open task slot is listed for new members to claim (open-source contribution model)

**Why this is unique:**
No existing platform combines: social team formation + AI-aware task splitting based on personal skill data + in-platform currency commitment. Buildspace did cohorts, hackathons do time-boxed teams — but neither is persistent, AI-assigned, or economically reinforced.

**Open questions:**

- [ ] How does the AI verify task completion? (PR review? Demo video? Peer review?)
- [ ] What's the minimum team size? (2–5 devs seems right for a first version)
- [ ] Do completed Build Team projects get a public profile page on DevsWebs?
- [ ] Can a Build Team project become a portfolio piece linked to each member's profile?

---

## Sponsored Real Projects (Future Revenue Idea — 2026-06-12)

> Builds directly on Collaborative Build Teams. This is the revenue endgame for that feature.

**Concept:** A company pays DevsWebs ($2–5K) to have a Build Team deliver a real small product — an internal tool, an MVP, a dashboard. DevsWebs takes a 15–20% platform fee; the rest is split among the team members based on completed tasks.

**Why everyone wins:**

- **Developers** — get paid real money, gain real work experience, and ship a verified portfolio piece ("built for an actual client" beats any tutorial project)
- **Company** — gets cheap delivery on small projects AND a recruiting preview: they watch a team work for weeks before deciding to hire anyone (better signal than any interview)
- **DevsWebs** — earns the platform fee, and every sponsored project generates verified work-history data that makes the hiring marketplace more valuable

**How it works:**

1. Company posts a project with budget and scope; DevsWebs (AI-assisted) validates the scope is junior-team-sized
2. Money goes into escrow (Stripe — NOT crypto, see web3 notes)
3. AI matches a Build Team whose verified skills fit the project, splits it into tasks, assigns by skill level
4. AI + milestones track progress; company sees demo checkpoints
5. On delivery and acceptance: escrow releases, split by contribution, DevsWebs takes its cut
6. The project becomes a verified portfolio piece on every member's profile

**Why this is the most unique revenue stream:**
"Junior-team-as-a-service with AI project management" doesn't exist. Toptal/Upwork sell individual senior freelancers. Agencies are expensive. Nobody sells coordinated junior teams with AI doing the task-splitting and the platform vouching for each member's verified skill level.

**Prerequisites (in order):**

1. Build Teams working with free/community projects first — prove the AI task-splitting actually produces shipped software
2. A pool of users with verified skills (exam engine live)
3. Escrow + contribution-based payout system
4. Only then approach companies — first ones likely from the community itself or local market

**Open questions:**

- [ ] Who handles scope disputes between company and team? (DevsWebs arbitration? AI-assisted?)
- [ ] Quality guarantee — does DevsWebs refund if the team fails to deliver? (Probably yes, from escrow — never deliver = company pays nothing)
- [ ] Legal: contractor relationships, taxes per country, liability for delivered code
- [ ] Minimum platform maturity before charging real companies (reputation risk if early projects fail)

---

## Screening-as-a-Service (Future Revenue Idea — 2026-06-12)

> Reuses the Exam Engine. Near-zero extra cost per sale — the infrastructure is being built anyway for the roadmap gating.

**Concept:** Companies send their **own job candidates** through DevsWebs's exam engine as a hiring screen, and pay **$30–50 per assessment**. The candidate doesn't need to be a DevsWebs user — the company just sends them a link.

**Why it works:**

- The exam engine already exists for roadmap gating — same AI-generated, skill-targeted exams, just pointed at an external candidate
- Marginal cost per assessment is almost zero (one AI exam generation + grading run)
- Companies already pay for this elsewhere (HackerRank, Codility, TestGorilla) — proven market, proven willingness to pay
- Every external candidate who takes a screen discovers DevsWebs → free user acquisition funnel

**How it works:**

1. Company creates a screening request: role, stack, seniority level
2. DevsWebs generates a tailored exam (theory + practical coding challenge) from the same engine that powers roadmap layer exams
3. Company sends the link to candidates; they take it (proctoring/anti-cheat measures needed)
4. Company gets a structured report: score, strengths, weak spots, comparison against DevsWebs's verified user base ("scores better than 70% of devs who passed Backend Layer 3")
5. Billed per assessment, or monthly bundles (e.g. 20 assessments/month)

**The hidden advantage over HackerRank/Codility:**
DevsWebs's comparison baseline is real — thousands of verified developers with known skill levels took these same exam types while actually learning. "Better than 70% of our verified Layer 3 devs" is a benchmark competitors can't fake, because their test-takers are anonymous one-time strangers.

**Prerequisites:**

1. Exam engine live and proven on DevsWebs's own users first
2. Enough verified users that the comparison benchmark is statistically meaningful
3. Anti-cheat / proctoring strategy (AI-assisted code review for plagiarism, time analysis, etc.)
4. Simple company-facing dashboard (can start as a manual/email process for the first customers)

**Open questions:**

- [ ] Per-assessment pricing vs monthly subscription bundles — or both?
- [ ] Do screened candidates get an offer to join DevsWebs with their results pre-loaded as a starting profile?
- [ ] White-label option (company's branding on the exam) at a higher price tier?
- [ ] How to handle cheating/AI-assistance during remote assessments?

---

## University & Bootcamp Licensing (Future Revenue Idea — 2026-06-12)

> The same platform, sold per-seat to institutions. One deal = hundreds of users at once.

**Concept:** Universities and coding bootcamps license DevsWebs per student per semester. Their students get the roadmaps, exam engine, and AI mentor; their instructors get a dashboard showing each student's real progress, exam results, and weak spots.

**Why institutions would pay:**

- **Bootcamps** — their entire sales pitch is job outcomes. DevsWebs's verified-skill data *proves* outcomes ("94% of our grads passed Backend Layer 3") in a way no bootcamp can fake today. That proof is worth real money to their marketing
- **Universities** — CS programs are theory-heavy; DevsWebs adds the practical, measured track without faculty needing to build anything
- **Both** — instructor dashboards replace gut feeling with data: who's falling behind, on what exactly, before exams reveal it too late

**Business model:**

- Per-seat pricing: roughly $10–30/student/month (institutions pay less per seat than individuals, but buy hundreds at once)
- One mid-size bootcamp (200 students) ≈ $2–6K/month from a single contract
- Semester or annual contracts → predictable revenue, unlike consumer churn

**Why this is leverage, not extra work:**
This is the same product already being built — roadmaps, exams, AI agent, progress tracking. The only new pieces are: organization accounts, an instructor dashboard (a read-only view over data that already exists), and seat-based billing.

**Strategic side effects:**

- Hundreds of students onboarded per deal → solves the cold-start problem institutionally instead of one user at a time
- Students who graduate keep their DevsWebs profile → flow straight into the hiring marketplace funnel
- Institutional credibility ("used by X university") makes every other B2B sale easier

**Prerequisites:**

1. Core learning loop live and stable (roadmaps + exams + progress tracking)
2. Organization/team account structure with roles (admin, instructor, student)
3. Instructor dashboard over existing progress data
4. Seat-based billing

**Open questions:**

- [ ] Do institution-licensed students get the full AI agent, or a limited version (AI cost per seat matters at this price point)?
- [ ] Can instructors create custom roadmap paths / private exam sets for their curriculum?
- [ ] Data ownership & privacy — what does the institution see vs what stays the student's (FERPA/GDPR considerations)?
- [ ] Pilot strategy: offer one local Armenian bootcamp/university a free semester in exchange for feedback and a case study?

---

## Voice AI Progress Review / Teach-Back (2026-08-07, reframed & partially built 2026-09-27)

> **Status update 2026-09-27:** This shipped earlier and leaner than the "Phase 4+, after 50 users" plan below assumed — built as a minimal one-topic vertical slice to validate the grading approach cheaply, not as a scheduled phase. Read this status block first; the original 2026-08-07 write-up below is kept for the product reasoning, which still mostly holds.

### Reframe: it's a learning mechanic, not a voice feature

Voice is the interface, not the idea. The actual product concept is a fourth evidence source added to the existing roadmap → exam → weak-spot loop:

```
Learn → Prove (exam) → Identify weaknesses → Review → Teach back → AI follow-up → Update learner profile → Advance
```

MCQ tests recognition and is gameable; explaining a concept out loud (or in writing) under adaptive follow-up questioning tests recall and reasoning — closer to what a real technical interview demands. Brand angle if this gets promoted later: **"Learn it. Prove it. Explain it. Earn the next level."**

### What's actually built (2026-09-27, one topic only — JWT Signature)

Rubric-based evaluation architecture (app owns the rubric/scoring math, the LLM only fills in evidence against fixed criteria — never freely judges):

- `backend/services/rubricService.js` + `backend/seeders/teachBackRubricSeeder.js` — `teach_back_rubrics` collection: `{ path, layer, topic, criteria[{id, label, levels[{score, description}]}], misconceptions[], version }`. **Only one rubric seeded so far** — this is the real bottleneck to expanding coverage, not the pipeline.
- `backend/services/teachBackEvaluatorService.js` — calls the existing Groq client (`openai/gpt-oss-120b`, same provider/model as the main agent, zero new vendor cost) to grade a transcript against a rubric's criteria/levels, clamps scores server-side, detects known misconceptions. Also generates one targeted follow-up question scoped to the single weakest criterion.
- `backend/services/examEngineService.js` — `submitTeachBack` (initial grading) and `submitTeachBackFollowUp` (re-scores only the targeted criterion from a follow-up answer, never re-grades the whole thing) — both reuse `saveExamResult`, `addWeakSpot`/`resolveWeakSpot`, writing into the same `examHistory`/`weakSpots` collections the MCQ exam engine already uses. New collection: `teach_back_sessions`.
- Routes: `POST /api/exams/submit-teach-back`, `POST /api/exams/submit-teach-back-followup`.
- **UI entry point:** exam results screen (`ExamPage.jsx`) shows a "Teach it back" link per missed topic → opens `AiAgent.jsx` in a Teach-Back mode (banner shows the topic) → typed or dictated answer routes to the grading endpoint instead of the general chat stream → `TeachBackCard.jsx` renders the graded breakdown inline in the transcript, with an "Answer" button on the follow-up question that re-arms the composer scoped to just that session/criterion.
- **Voice — free tier only, as planned:** browser-native `SpeechRecognition` (dictation into the same textarea — `ChatInput.jsx`) and browser-native `speechSynthesis` (speaks the follow-up question aloud — `src/features/AI-Agent/lib/speech.js`). Zero marginal cost, zero new vendor, exactly the "free tier: Web Speech API" prerequisite named below — just landed as the only tier so far, not gated behind Pro. No paid STT/TTS vendor (Whisper/Deepgram/Vapi/Google Cloud Speech) has been added; explicitly deferred until grading quality is calibrated and a live-conversation upgrade (see below) is actually wanted.
- **Async, not sync** — matches the "async is the realistic v1" recommendation below. Dictation → transcript → grade → optional one follow-up round → re-grade. No live interruption, no real-time turn-taking.

### Explicitly NOT built yet

- **Rubric content for any topic beyond JWT Signature** — the single largest gap. The pipeline works; the curriculum content to run it on doesn't exist yet.
- **Calibration** — no reference answers have been graded to check the LLM scores consistently before trusting it on real users.
- **On-demand entry point** — only reachable right after a fresh exam result. No weak-spots page exists in the frontend yet (backend `GET /api/exams/weak-spots` etc. is unwired to any UI), so there's no persistent "teach back a weak topic anytime" surface.
- **Mentor-initiated hook from general chat** — discussed as a good extension (2026-09-27): when a user claims understanding in a normal agent conversation, the agent could offer to hand off into Teach-Back grading via a new tool call (e.g. `suggest_teach_back`), reusing the same grading pipeline. Not implemented. Explicitly *not* recommended: making the whole agent chat voice-first — voice earns its place in Teach-Back specifically because explaining out loud is the point; it doesn't help quick Q&A.
- **Live/sync voice conversation** (Vapi, or any STT+LLM+TTS orchestration platform) — considered and deliberately deferred. Real cost (metered per-minute on top of the LLM/STT/TTS providers it wraps), and it replaces the text-based turn loop with call-style session architecture rather than extending it. Right recommendation once grading is calibrated and there's a reason to take on a metered vendor — not before.
- **Mastery decay / re-verification over time**, **"needs review" state for low-confidence grading**, **rubric-version-aware historical display**, **public skill-profile exposure** of teach-back mastery — all still open per the original architecture-review pass in this chat.

### Original concept (2026-08-07) — kept for the product reasoning

**Concept:** Instead of (or in addition to) a written MCQ exam, a developer talks out loud to explain what they just learned on a topic — in their own words, like explaining it to a colleague. A voice AI listens, follows up with clarifying questions the way a mentor would, and then reviews the explanation for correctness, gaps, and confused concepts — producing the same kind of pass/fail + weak-topic breakdown the exam engine already gives, just sourced from spoken explanation instead of multiple choice.

**How it works:**

1. At the end of a layer (or on demand), the user starts a voice session: "Explain what you learned about [topic]."
2. The user talks freely — no script, no multiple choice. The AI can interrupt with a follow-up ("you said X causes Y — why?") the way a real technical interviewer would, to catch memorized-but-not-understood answers.
3. The session is transcribed and run through the same LLM-grading approach the exam engine uses today, but scoring free-form explanation instead of MCQ answers: correctness, completeness, and specific gaps.
4. Result surfaces in the same place exam results do today: pass/fail-style verdict + a breakdown of what was solid vs. shaky, tied to the layer's weak-topic system already in `examHistoryService`.

**Why this is different from the existing exam engine:**
MCQ exams test recognition ("which of these is correct") — they're gameable by pattern-matching answers. Explaining a concept out loud, under follow-up questioning, tests recall and actual understanding, which is much closer to what a technical interview or a senior code review actually demands. It's also a completely different, more defensible content format for marketing (a viral clip of someone getting caught not actually understanding a concept, from the "exam failure story" growth hack in GROWTH_PLAYBOOK.md, is stronger on video/audio than a screenshot of a failed quiz).

**Why this is risky right now (be honest about it):**

- This is Phase 4+ scope on top of an MVP loop (roadmap + exam engine + Stripe) that is not yet fully validated with real users — per STARTUP_ADVISOR_ANALYSIS.md, the current mandate is "build the loop, get 50 users through it, then decide what's next." This does not belong in the 7-day plan.
- Real-time voice (speech-to-text, streaming LLM grading, text-to-speech or live follow-up) adds a new cost axis on top of the AI agent cost model already flagged as dangerous at free-tier scale ($3K/month at 500 free users, current text-only agent). Voice models are meaningfully more expensive per session than chat completions.
- Adds real infra: a speech-to-text pipeline (e.g. Whisper or a realtime API), turn-taking/interruption logic, and either a TTS voice or a "listen only" mode — none of which exists in the codebase today.

**Where this fits in the roadmap:**
Treat this as a Pro-tier or higher differentiator to build *after* the core exam-based loop has proven the Layer 1 → Layer 2 return rate is healthy (>50%, per GROWTH_PLAYBOOK.md's north-star metric) — not a replacement for the MCQ exam, an upgrade path once there's revenue to justify the added AI cost.

**Prerequisites (in order):**

1. Core MCQ exam loop live, validated with real users, Stripe paywall working
2. Confirm the AI agent's grading/review logic (already used for exam weak-topic breakdown) generalizes to free-form transcript input — this is mostly a prompt/schema problem, not new infra
3. For the free tier, use the browser's built-in Web Speech API (client-side, $0 marginal cost) instead of a paid STT vendor — the backend only ever receives a text transcript, never raw audio, for free users. Reserve a paid STT vendor (Whisper/Deepgram/AssemblyAI) as a possible Pro-tier fallback for accuracy/browser-support, and prototype its cost-per-session before committing to that tier
4. Decide sync (live follow-up questions, higher cost) vs. async (record explanation, review after) for v1 — async is far cheaper and easier to ship first

**Open questions:**

- [ ] Sync (live AI follow-up mid-explanation) or async (record then review)? Async is the realistic v1.
- [ ] Which tier does this live behind — Pro, or a separate add-on given the extra AI cost?
- [ ] Does a passed voice review count the same as a passed MCQ exam for layer unlock, or is it a separate "verified deep understanding" badge on top?
- [ ] Transcript storage/privacy — users are speaking, not just clicking; needs clear consent and data-handling language
- [ ] Accessibility: must remain fully optional — mic access, accents, non-native English speakers, and users who prefer not to be recorded should never be blocked from progressing
