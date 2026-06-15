# DevsFlow — Vision & Product Roadmap

> Living document — update this as the vision evolves.
> Last updated: 2026-06-11 — full code audit performed; every status below was verified against the actual codebase, not memory.

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

Most developers learn by bouncing between YouTube, Stack Overflow, and random tutorials hoping something sticks. DevsFlow ends that.

Every developer who joins gets a personal AI mentor that knows them, a structured roadmap they earn layer by layer, and only can pass with exams and coding challenges built for where they actually are — not random DSA grinding.

**DevsFlow will become the platform serious developers use to go from zero to production-ready.**

---

## What Makes This Genuinely Different

| What exists today                     | What DevsFlow does                                             |
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
| Community Platform (blogs, profiles, chat, auth) | ✅ Built — but chat has a live security hole (Architecture Health #1)                                                                                                                                                                 |
| Roadmap UI                                       | 🔧 Frontend shell built; 15 path JSONs in `src/data/roadmaps/`; progress is **localStorage-only** — no backend wiring                                                                                                                 |
| User Progress Tracking                           | 🔧 `userProgressService.js` built — no route exposes it                                                                                                                                                                               |
| Exam History & Weak Spots                        | 🔧 `examHistoryService.js` + `weakSpotService.js` built — not wired                                                                                                                                                                   |
| Challenge Results                                | 🔧 `challengeResultService.js` built — not wired                                                                                                                                                                                      |
| Dev Library                                      | 🔧 **Further along than previously documented**: route mounted at `/library` with 6 endpoints, UI on master, seeder exists with real content — needs seeder run + `layer_ids` linking                                                 |
| AI Agent — frontend                              | 🔧 **Substantially built** (previously documented as "not started"): `AiAgent.jsx` + `AiAgentLanding.jsx` + `useAgentStream` SSE hook + 6 child components + Zustand store, routes mounted in router — currently running on mock data |
| AI Agent — backend                               | ❌ `aiAgentService.js`, `aiAgentController.js`, `aiAgent.routes.js` are **empty files**, not mounted in `app.js`. Frontend calls `/api/ai-agent/*` → 404                                                                              |
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

When one real user can do that on production, DevsFlow exists. Until then, it's a community blog with ambitions.

**In scope (Phases A–E below, ~4–6 weeks of focused work, 3 months with buffer):**
critical bug fixes → roadmap backend → roadmap UI wiring → exam engine → AI agent backend.

**Explicitly out of scope for 3 months (deferred backlog, Phases 4–14):**
Admin Panel, Problem Solving Arena, Weekly Challenges, Capstone, Awards, Public Progress Profiles, Company Portal, Platform Intelligence, monetization. Each has an entry criterion listed in the Deferred Backlog section — do not start one early because it feels fun.

**One cheap exception:** the Dev Library is ~90% done. Running the seeder and surfacing entries inside layers is a half-day task and makes Layer 1 study material real. It rides along with Phase B.

---

## Architecture Health — Known Issues & Decisions

> Surfaced via architectural review (2026-06-10), re-verified against code (2026-06-11). All Critical items confirmed still present.
> Fix the **Critical** items before any new feature work. The former "open decisions" are now **recommendations** — say yes or no to each and move on.

### 🔴 Critical — Fix Before Next Feature (confirmed in code 2026-06-11)

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

---

### 🟡 Recommendations — Say Yes/No and Move On

Each former "decision required" is now a concrete recommendation with reasoning. Default answer is in bold.

**4. Process topology → YES: pin Railway to 1 instance, document it here.**
HTTP, WebSocket, and the BullMQ worker share one process; the `rooms` Map and `getWss()` are in-memory. Two instances = silently split rooms and dropped notifications. Redis pub/sub fan-out is the correct multi-instance answer, but it's a week of work that buys nothing until you have enough traffic to need a second instance — which, for a pre-MVP product, you don't.
_Revisit when:_ sustained concurrent WebSocket connections approach what one Railway instance handles, or notifications start lagging.

**5. AI provider → YES: commit to Anthropic. Install `@anthropic-ai/sdk`; remove `@google/generative-ai`; remove `groq-sdk` unless given an explicit job.**
The agent design (tool use loop, SSE streaming, prompt caching of the static system prompt) is written around the Anthropic API, and the SDK supports all of it natively. Concrete model choices:

- **Agent conversations:** `claude-sonnet-4-6` — $3 / $15 per MTok, native tool use, 1M context.
- **Cheap structured calls** (exam MCQ generation, grading short answers, classification): `claude-haiku-4-5` — $1 / $5 per MTok. This replaces any job Groq was hypothetically for.
- **Prompt caching:** cache reads cost ~0.1× input price (~90% savings on the static system prompt). One caveat the old doc missed: Sonnet 4.6's minimum cacheable prefix is **2048 tokens** — a short system prompt silently won't cache, so the agent's static prefix (persona + Socratic rules + tool definitions) should be written to exceed that.
  Carrying three AI SDKs as a solo dev is pure liability. Delete the unused ones the day the agent backend starts.

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
- The full migration (15-min access tokens + httpOnly-cookie refresh + revocation) is required **before DevsFlow asks employers to trust its profiles** (Phase 9), because XSS + localStorage JWT = stolen credentialed identity. It is not required to test the learning loop with early users. Schedule it as the entry ticket to Phase 9.

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

This is the core innovation. roadmap.sh shows you a map. **DevsFlow makes you earn it.**

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

### 3. AI Agent Per User — 🔧 FRONTEND BUILT, BACKEND EMPTY

> Audited: the chat UI is real — `AiAgent.jsx`, `AiAgentLanding.jsx`, `useAgentStream.js` (SSE), `SessionsSidebar`, `MessageList`, `ChatInput`, `ChatTopBar`, `AgentContextPanel`, `ToolUseBlock`, `useAiAgentStore` — all on master with routes mounted. It runs on `agentMockData.js`. The backend three files (`aiAgentService.js`, `aiAgentController.js`, `aiAgent.routes.js`) are empty and unmounted. The work remaining is exactly the backend half of the original design.

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
  get_user_progress()      → current path, layer, exam scores
  get_layer_content()      → what the user is studying right now
  search_platform_posts()  → relevant DevsFlow posts by topic
  get_exam_history()       → past scores, failed topics
  log_weak_spot(topic)     → persist struggles to MongoDB
   ↓
Socratic response, streamed via SSE, logged to MongoDB
```

**Technical decisions (updated with verified model IDs and pricing):**

| Decision            | Choice                                                                    | Why                                                             |
| ------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Model               | `claude-sonnet-4-6` (Anthropic) — $3/$15 per MTok                         | Native tool use, strong instruction-following                   |
| Cheap-call model    | `claude-haiku-4-5` — $1/$5 per MTok                                       | Exam generation, grading, classification                        |
| Context strategy    | Tool-use agent — fetches live data on demand                              | Never stale, never bloated                                      |
| Memory — short-term | Last 20 conversation turns                                                | Cheap, predictable                                              |
| Memory — long-term  | MongoDB: `topics_mastered[]`, `weak_spots[]`, summarized `activity_log[]` | Survives across sessions                                        |
| Streaming           | SSE from Express (frontend hook already built)                            | Perceived performance                                           |
| Prompt caching      | Cache the static system prefix — reads ~0.1× input cost                   | Keep the static prefix ≥ 2048 tokens or it silently won't cache |
| Behavior rule       | Socratic — guide, never give full answers                                 | Khanmigo's lesson: users learn more, feel accomplished          |
| Cost controls       | 30 msgs/day, 20-turn cap, in `platformConfig`                             | Hard pre-condition, ships with the first route                  |

**Agent context initialized on signup:**

```
ai_agent_context: {
  skill_level: "beginner",
  active_path: null,
  current_layer: null,
  topics_mastered: [],
  weak_spots: [],
  activity_log: [],        ← summarized periodically
  sessions: []             ← compressed past sessions
}
```

**Backend files to fill (frontend equivalents already exist):**

```
backend/
  routes/aiAgent.routes.js       ← /api/ai-agent/stream (SSE), /api/ai-agent/sessions
  services/agent/
    contextService.js            ← builds the agent's view of the user
    toolsService.js              ← implements every tool
    memoryService.js             ← sliding window + activity_log summarization
    sessionService.js            ← conversation session CRUD
    streamService.js             ← Anthropic call, tool-use loop, SSE emit
```

---

### 4. Problem Solving Arena — 🔧 MOCK UI, NO BACKEND — DEFERRED

> Audited: not a "coming soon" placeholder — `CodingChallenges.jsx` renders a full mock-data-driven UI and `ChallengeArena.jsx` exists at `/coding-challenges/:id`. No backend of any kind.

LeetCode gives you random problems. DevsFlow gives you problems that match your path — every problem tied to a roadmap path and layer.

**Problem types:** code challenges (run/validate in-browser) · debug challenges · system design (AI-graded) · build challenges.
**Agent connection:** progressive hints, post-solve explanation, contribution to exam-readiness score.

| LeetCode                        | DevsFlow Problems           |
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

**Work:** the three Critical fixes (chat auth hole + socket cleanup, worker Redis password, `connectDB` throw) · `app.use(helmet())` · install `@anthropic-ai/sdk`, remove `@google/generative-ai` and `mongoose` (and `groq-sdk` unless given a job) · decide `/api` prefix convention in writing (Recommendation #10).

**Done means:**

- A second authenticated user sending a crafted `join_room` for a room they're not a member of gets rejected (manually tested with two accounts).
- Killing a socket removes it from the `rooms` Map (no broadcast to dead connections).
- A notification fires end-to-end on Railway production (proves the worker authenticates to Redis).
- `MONGO_URI` unset → server crashes at startup with the real error, not a downstream `TypeError`.
- `helmet` headers visible in any response.
- `package.json` has `@anthropic-ai/sdk` and lacks the removed SDKs.

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

### Phase E — AI Agent Backend

**Work** (frontend already exists — this is the backend half only):

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
- [ ] Public API for roadmap data — let others build on top of DevsFlow paths?
- [ ] ATS integration for the Company Portal (export verified profiles to Greenhouse, Lever, etc.)?
- [ ] Developer referral system — earn XP or subscription credit for referring a developer who converts to Pro?

---

## Collaborative Build Teams (New Feature Idea — 2026-06-11)

**Concept:** Developers on DevsFlow group together socially, pick a real project they want to build, and the AI assigns tasks to each member based on their known skill level and learning progress. The team ships a real product together.

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
- [ ] Do completed Build Team projects get a public profile page on DevsFlow?
- [ ] Can a Build Team project become a portfolio piece linked to each member's profile?

---

## Sponsored Real Projects (Future Revenue Idea — 2026-06-12)

> Builds directly on Collaborative Build Teams. This is the revenue endgame for that feature.

**Concept:** A company pays DevsFlow ($2–5K) to have a Build Team deliver a real small product — an internal tool, an MVP, a dashboard. DevsFlow takes a 15–20% platform fee; the rest is split among the team members based on completed tasks.

**Why everyone wins:**

- **Developers** — get paid real money, gain real work experience, and ship a verified portfolio piece ("built for an actual client" beats any tutorial project)
- **Company** — gets cheap delivery on small projects AND a recruiting preview: they watch a team work for weeks before deciding to hire anyone (better signal than any interview)
- **DevsFlow** — earns the platform fee, and every sponsored project generates verified work-history data that makes the hiring marketplace more valuable

**How it works:**

1. Company posts a project with budget and scope; DevsFlow (AI-assisted) validates the scope is junior-team-sized
2. Money goes into escrow (Stripe — NOT crypto, see web3 notes)
3. AI matches a Build Team whose verified skills fit the project, splits it into tasks, assigns by skill level
4. AI + milestones track progress; company sees demo checkpoints
5. On delivery and acceptance: escrow releases, split by contribution, DevsFlow takes its cut
6. The project becomes a verified portfolio piece on every member's profile

**Why this is the most unique revenue stream:**
"Junior-team-as-a-service with AI project management" doesn't exist. Toptal/Upwork sell individual senior freelancers. Agencies are expensive. Nobody sells coordinated junior teams with AI doing the task-splitting and the platform vouching for each member's verified skill level.

**Prerequisites (in order):**

1. Build Teams working with free/community projects first — prove the AI task-splitting actually produces shipped software
2. A pool of users with verified skills (exam engine live)
3. Escrow + contribution-based payout system
4. Only then approach companies — first ones likely from the community itself or local market

**Open questions:**

- [ ] Who handles scope disputes between company and team? (DevsFlow arbitration? AI-assisted?)
- [ ] Quality guarantee — does DevsFlow refund if the team fails to deliver? (Probably yes, from escrow — never deliver = company pays nothing)
- [ ] Legal: contractor relationships, taxes per country, liability for delivered code
- [ ] Minimum platform maturity before charging real companies (reputation risk if early projects fail)

---

## Screening-as-a-Service (Future Revenue Idea — 2026-06-12)

> Reuses the Exam Engine. Near-zero extra cost per sale — the infrastructure is being built anyway for the roadmap gating.

**Concept:** Companies send their **own job candidates** through DevsFlow's exam engine as a hiring screen, and pay **$30–50 per assessment**. The candidate doesn't need to be a DevsFlow user — the company just sends them a link.

**Why it works:**

- The exam engine already exists for roadmap gating — same AI-generated, skill-targeted exams, just pointed at an external candidate
- Marginal cost per assessment is almost zero (one AI exam generation + grading run)
- Companies already pay for this elsewhere (HackerRank, Codility, TestGorilla) — proven market, proven willingness to pay
- Every external candidate who takes a screen discovers DevsFlow → free user acquisition funnel

**How it works:**

1. Company creates a screening request: role, stack, seniority level
2. DevsFlow generates a tailored exam (theory + practical coding challenge) from the same engine that powers roadmap layer exams
3. Company sends the link to candidates; they take it (proctoring/anti-cheat measures needed)
4. Company gets a structured report: score, strengths, weak spots, comparison against DevsFlow's verified user base ("scores better than 70% of devs who passed Backend Layer 3")
5. Billed per assessment, or monthly bundles (e.g. 20 assessments/month)

**The hidden advantage over HackerRank/Codility:**
DevsFlow's comparison baseline is real — thousands of verified developers with known skill levels took these same exam types while actually learning. "Better than 70% of our verified Layer 3 devs" is a benchmark competitors can't fake, because their test-takers are anonymous one-time strangers.

**Prerequisites:**

1. Exam engine live and proven on DevsFlow's own users first
2. Enough verified users that the comparison benchmark is statistically meaningful
3. Anti-cheat / proctoring strategy (AI-assisted code review for plagiarism, time analysis, etc.)
4. Simple company-facing dashboard (can start as a manual/email process for the first customers)

**Open questions:**

- [ ] Per-assessment pricing vs monthly subscription bundles — or both?
- [ ] Do screened candidates get an offer to join DevsFlow with their results pre-loaded as a starting profile?
- [ ] White-label option (company's branding on the exam) at a higher price tier?
- [ ] How to handle cheating/AI-assistance during remote assessments?

---

## University & Bootcamp Licensing (Future Revenue Idea — 2026-06-12)

> The same platform, sold per-seat to institutions. One deal = hundreds of users at once.

**Concept:** Universities and coding bootcamps license DevsFlow per student per semester. Their students get the roadmaps, exam engine, and AI mentor; their instructors get a dashboard showing each student's real progress, exam results, and weak spots.

**Why institutions would pay:**

- **Bootcamps** — their entire sales pitch is job outcomes. DevsFlow's verified-skill data *proves* outcomes ("94% of our grads passed Backend Layer 3") in a way no bootcamp can fake today. That proof is worth real money to their marketing
- **Universities** — CS programs are theory-heavy; DevsFlow adds the practical, measured track without faculty needing to build anything
- **Both** — instructor dashboards replace gut feeling with data: who's falling behind, on what exactly, before exams reveal it too late

**Business model:**

- Per-seat pricing: roughly $10–30/student/month (institutions pay less per seat than individuals, but buy hundreds at once)
- One mid-size bootcamp (200 students) ≈ $2–6K/month from a single contract
- Semester or annual contracts → predictable revenue, unlike consumer churn

**Why this is leverage, not extra work:**
This is the same product already being built — roadmaps, exams, AI agent, progress tracking. The only new pieces are: organization accounts, an instructor dashboard (a read-only view over data that already exists), and seat-based billing.

**Strategic side effects:**

- Hundreds of students onboarded per deal → solves the cold-start problem institutionally instead of one user at a time
- Students who graduate keep their DevsFlow profile → flow straight into the hiring marketplace funnel
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
