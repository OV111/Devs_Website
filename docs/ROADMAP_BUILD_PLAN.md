# Vahoha (formerly DevsWebs) — Roadmap Build Plan

> **Update 2026-10-02:** the Current State table below was rewritten against the code; the phase text further down is the original plan and is kept for reference. Live status: `docs/PILOT_STATUS.md`.

> Moved out of VISION.md 2026-09-30 to keep that document investor-readable. This is the working build-status and phase-plan doc — update it as phases complete. `VISION.md` should stay a business/product doc; this is where implementation reality lives.
> Last audit: 2026-09-27 (AI Mentor re-audit) / 2026-09-26 (Phase E verification pass, architecture health) / 2026-06-11 (original audit).

---

## Current State — Audited Snapshot

| Feature | Status |
| --- | --- |
| Community Platform (blogs, profiles, chat, auth) | Built. Chat room-join hole fixed. Blogs can be tagged to roadmap layers (`layerIds`) |
| Roadmap | Built: tracks and layers seeded into MongoDB, progress server-side (`/api/roadmaps`), tree UI, "Posts for this layer" in the layer drawer |
| Exam Engine | Built (`/api/exams`): server-graded, 15 questions per attempt, pass at 80, shuffled choices, unseen-first, cooldown on, integrity flags. Banks must be seeded and hand-checked per layer (`docs/EXAM_INTEGRITY.md`) |
| Exam History, Weak Spots, Mastery | Built and wired; `modules/mastery` exposes per-topic status |
| Dev Library | Built (`/library`); layer linking and content depth still to do |
| AI Mentor | Built and verified: `/api/ai-agent`, sessions, SSE streaming, tool loop, learner context, 30/day cap, per-user burst limit |
| Teach-Back | One-topic slice built; full voice exam is a spec (`docs/VOICE_EXAM_SPEC.md`) |
| Problem Solving Arena | Built (`modules/coding-challenges`): catalog, `isolated-vm` grading, proposals, XP hints, daily submission cap. Built early, against this plan's own deferral rule |
| Billing | Built on Polar, sandbox-verified, inert (`docs/BILLING.md`) |
| Analytics | Built: 7 events, admin funnel |
| Ship It Capstone | UI shell only |
| Admin Panel, Public Progress Profiles, Weekly Challenges, Platform Intelligence | Not started |

--- | --- |
| Community Platform (blogs, profiles, chat, auth) | Built — the chat room-join hole is fixed (re-verified 2026-09-26) |
| Roadmap UI | Frontend shell built; 15 path JSONs in `src/data/roadmaps/`; progress is localStorage-only — no backend wiring |
| User Progress Tracking | `userProgressService.js` built — no route exposes it |
| Exam History & Weak Spots | `examHistoryService.js` + `weakSpotService.js` built — not wired |
| Challenge Results | `challengeResultService.js` built — not wired |
| Dev Library | Route mounted at `/library` with 6 endpoints, UI on master, seeder exists with real content — needs seeder run + `layer_ids` linking |
| AI Mentor — frontend | Built: `AiAgent.jsx` + `AiAgentLanding.jsx` + `useAgentStream` SSE hook + child components + Zustand store, routes mounted in router |
| AI Mentor — backend | Built and verified — routes mounted at `/api/ai-agent`, sessions CRUD, SSE streaming, 7-tool tool-use loop, 20-turn window, 30/day cap, Zod-validated |
| Problem Solving Arena | Mock-data UI exists (`CodingChallenges.jsx` + `ChallengeArena.jsx`, routes mounted) — no backend |
| Exam Engine | Not started — history/weak-spot services ready, needs AI call layer |
| Ship It Capstone | `CapstonePage.jsx` exists with `/capstone` route — UI shell only, no backend |
| Admin Panel | Not started |
| Public Progress Profiles | Not started — `userProgressService` ready, needs frontend display |
| Weekly Challenges | Not started |
| Platform Intelligence | Not started |

---

## The MVP Loop — the only thing that matters for the next 3 months

The product's core promise is one sentence: "earn the roadmap layer by layer, with an AI mentor who knows you." Everything that doesn't directly close that loop for **one path** is a distraction right now.

**The MVP loop, end-to-end, for the Backend Developer path only:**

```
Sign up → pick Backend path → study Layer 1 (posts + library resources)
   → take Layer 1 exam (AI-generated MCQ, server-graded)
   → PASS → Layer 2 unlocks (visible, animated, persisted server-side)
   → FAIL → weak spots recorded → ask the AI mentor → targeted review → retry
```

When one real user can do that on production, Vahoha exists. Until then, it's a community blog with ambitions.

**In scope (Phases A–E, ~4–6 weeks focused work, 3 months with buffer):** critical bug fixes → roadmap backend → roadmap UI wiring → exam engine → AI mentor backend.

**Explicitly out of scope for 3 months:** Admin Panel, Problem Solving Arena, Weekly Challenges, Capstone, Awards, Public Progress Profiles, Company Portal, Platform Intelligence, monetization. Each has an entry criterion in the Deferred Backlog section below — do not start one early because it feels fun.

**One cheap exception:** the Dev Library is ~90% done. Running the seeder and surfacing entries inside layers is a half-day task and makes Layer 1 study material real. It rides along with Phase B.

---

## Architecture Health — Known Issues & Decisions

> Surfaced via architectural review 2026-06-10, re-verified against code 2026-06-11 and again 2026-09-26.

### Critical — all resolved (re-verified in code 2026-09-26)

1. **WebSocket room-join authorization hole — fixed.** `chatHandler.js` checks room membership before allowing entry; the client-dictated `members` overwrite is gone. Socket cleanup on close is in place.
2. **NotificationWorker missing Redis password — fixed.** `workers/notificationWorker.js` now imports the shared `redisConnection` from `config/redis.js`.
3. **`connectDB` swallows connection failure — fixed.** `config/db.js` now throws; the server fails fast at boot.

**Still outstanding:** (helmet is now mounted.) `@google/generative-ai`, `groq-sdk`, and `mongoose` are all still in `package.json` (`groq-sdk` is intentionally kept — it's the live provider, see decision #5 below).

### Standing decisions

4. **Process topology:** pin to 1 instance. HTTP/WebSocket/BullMQ worker share one process; `rooms` Map is in-memory. Revisit when concurrent WebSocket connections approach one instance's limits, or notifications start lagging.
5. **AI provider: Groq, not Anthropic** (decided 2026-09-26, supersedes an earlier Anthropic recommendation). Groq has a free tier; the Anthropic API does not — for a solo pre-revenue project, cost is the binding constraint. Model: `openai/gpt-oss-120b` (131K context) for agent conversations, `openai/gpt-oss-20b` for cheap calls (conversation titling). Groq retires models periodically — if streaming starts 404ing, check `GET https://api.groq.com/openai/v1/models` and update `MODEL` in `services/agent/streamService.js`.
6. **Exam integrity:** reviewed question bank per layer + AI-generated per-attempt variation, all state server-side. Generate with Haiku/equivalent, review once by hand, store server-side; sample + vary per attempt; answers never leave the server. Pass threshold default 80 (configurable).
7. **Agent cost controls:** 30 messages/day free-tier cap, 20-turn conversation window before summarization, Haiku-class fallback for low-stakes turns if costs spike. These ship in the same PR as the first streaming route, not "later."
8. **Input validation:** Zod, at the route boundary, for every new route starting from the roadmap/exam/agent phases. Don't backfill existing community routes. `mongoose` is installed but unused (native driver everywhere) — remove it.
9. **Auth hardening:** `helmet` now (one-line, no excuse). Full migration to httpOnly-cookie refresh tokens is required before the credential/profile launch (Phase 9 in the deferred backlog), not before MVP.
10. **Route namespace:** `/api/...` for all new routes starting now. Legacy bare-mounted routes (`auth`, `post`, `user`, `account`) migrate opportunistically — don't block MVP on it.
11. **Workspace split (frontend/backend package.json):** defer. Zero user impact.

---

## AI Mentor — architecture reference

> Re-audited 2026-09-27 against the running code.

Live today: `routes/aiAgent.routes.js` mounted at `/api/ai-agent` with 7 authenticated routes — `GET /context`, `GET /sessions`, `GET /sessions/:id`, `POST /sessions`, `PATCH /sessions/:id`, `DELETE /sessions/:id`, `POST /stream`. All Zod-validated.

Verified working (live against Groq): streaming, the multi-round tool-use loop, all 7 tools returning real MongoDB data, session persistence, the 30/day cap returning 429 + `resetAt`, and the Socratic refusal guardrail (asked point-blank for an exam answer, the agent refused and redirected with a question).

**Tools (`backend/tools/agentTools.js`):** `get_user_progress`, `get_exam_history`, `get_weak_spots`, `log_weak_spot`, `search_posts`, `search_library`, `get_user_profile`.

**Shipped since first audit:** session rename/delete/pin, auto-generated conversation titles, the `/context` command + endpoint, text file attachments (client extraction, server-enforced caps, prompt-injection fencing), Markdown rendering with syntax highlighting, and Teach-Back grading (`POST /api/exams/submit-teach-back` + `…-followup`).

**Not built:** long-term cross-session memory (today the agent re-reads tools each turn; nothing persists across sessions — see the mentor plan below), `platformConfig` collection (caps are currently exported module constants, not DB-driven).

### From chat agent → real mentor — staged build plan

The agent today answers well but doesn't durably know the learner beyond what tools return per-turn. Staged plan, ordered so each stage ships something usable on its own:

| # | Stage | Unblocks | Effort |
| --- | --- | --- | --- |
| 0 | Canonical topic slug | everything | S |
| 1 | LearnerContext aggregator | 2, 4 | M |
| 2 | Wire into mentor | usable win | S |
| 3 | Curriculum Knowledge Layer | 5 | M + content |
| 4 | Adaptive Engine | 5 | M |
| 5 | Mentor Orchestrator / strategy | — | M |
| 6 | Current-activity context | — | S |
| 7 | Cross-session learner memory | — | M |

- **Stage 0:** canonical topic key (`toSlug()`), backfilled across weak spots, teach-back sessions, exam history. Every later stage joins on this — do it first or rewrite stages 1–4 later.
- **Stage 1:** `learnerContextService.js` — pure `deriveTopicStatus`/`buildTopicStates`, unit-tested with no DB. Exit: `getLearnerContext(db, userId)` returns real merged topic states.
- **Stage 2:** inject a summarized learner context into the system prompt each turn + a `get_learner_context` tool. **This is the first stage the user feels — ship here before going further.**
- **Stage 3:** `concepts` collection (definitions, prerequisites, misconceptions) as single source of truth; rubrics reference it instead of duplicating. Content authoring is the real cost — seed only the active layer first.
- **Stage 4:** move mastery derivation to write-time; hook exam/teach-back/challenge submit → upsert `learnerMastery`; add a `getNextAction(userId)` signal.
- **Stage 5:** restructure the mentor prompt/loop with explicit internal ordering and strategy guardrails (never define a concept the learner has a live misconception on). Keep it one LLM call with the existing tool loop.
- **Stage 6:** frontend sends current page context (`{ path, layer, topicSlug, surface }`) with each message.
- **Stage 7:** durable per-learner notes beyond the 20-turn window, written as signals into `weakSpots`/`learnerMastery` — never a private truth store.

**Sequencing call:** stages 0–2 are the high-value core, independent of curriculum content — treat as one push, then reassess whether 3 or 4 matters more.

**Open decision before Stage 0 starts:** backfill `slug` into existing collections, or normalize at read time only?

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

exam_question_banks           ← reviewed per-layer banks
├── path, layer
└── questions[] ← { stem, choices[], answer_idx, topic }   ← never sent to client

platformConfig                ← examPassThreshold (80), agentDailyMessageCap (30),
                                 agentMaxTurns (20) — tunable without deploy — NOT YET BUILT

user_ai_context                ← merged into usersStats or its own collection
├── skill_level, topics_mastered[], weak_spots[], activity_log[] (summarized)

agent_sessions                 ← conversation session CRUD for the agent
```

**Deferred collections (kept for reference):** `problems`, `weekly_challenges`, `weekly_submissions`, `user_achievements`, `capstone_projects`, `awards`, `user_awards`, `companies`, `company_users`, `connection_requests`.

---

## Build Order — Part 1: The MVP Loop (next 3 months)

### Phase 0 — Community Platform — done

Blogs, profiles, follows, chat, notifications, auth, search.

### Phase A — Critical Fixes & Hygiene — first, non-negotiable

**Work:** the three Critical fixes (done) · `app.use(helmet())` (only item left) · remove `@google/generative-ai` and `mongoose` · keep `groq-sdk` · decide `/api` prefix convention in writing.

**Done means:** crafted `join_room` for a non-member room is rejected · killing a socket removes it from the `rooms` Map · a notification fires end-to-end on production · `MONGO_URI` unset crashes at startup with the real error · `helmet` headers visible in any response · `package.json` keeps `groq-sdk`, lacks `@google/generative-ai` and `mongoose`.

**Estimate:** 1–2 days.

### Phase B — Learning Layer Backend (+ Library ride-along)

**Work:** write `backend/seeders/roadmapSeeder.js` reading `src/data/roadmaps/backend.json` · seed Backend path, 3 layers minimum · routes `GET /api/roadmaps`, `GET /api/roadmaps/:pathId/layers`, `GET /api/roadmaps/progress`, `POST /api/roadmaps/progress` wired to `userProgressService` · Zod validation on every route · mount behind `authenticate` · create `platformConfig` with `examPassThreshold: 80` · ride-along: run `seedLibrary.js` against production, link `layer_ids`.

**Done means:** `GET /api/roadmaps` returns the Backend path from MongoDB · `GET /api/roadmaps/backend/layers` returns ≥3 ordered layers with real ObjectIds · `POST /api/roadmaps/progress` persists across sessions · malformed body gets a 400 with a Zod error, not a 500 · `GET /library/layer/:layerId` returns at least one seeded resource for Layer 1.

**Risks:** the roadmap JSON shape may not map 1:1 to the planned MongoDB schema — budget time for the transform.

**Estimate:** 2–4 days.

### Phase C — Roadmap UI Wiring

**Work:** point `useRoadmapStore` at the Phase B API instead of localStorage · locked/unlocked rendering from server progress · unlock animation (GSAP/Framer Motion already in the stack) · progress indicator on the path.

**Done means:** progress persists across browsers/sessions and survives a full localStorage clear · a locked layer cannot be opened from the UI and the API rejects it server-side too · non-Backend paths render as browse-only without errors.

**Risks:** the store's shape differs from the API's shape — this is a refactor of state flow, not a fetch swap.

**Estimate:** 2–3 days.

### Phase D — Exam Engine MVP

**Work:** generate Layer 1–3 Backend question banks, review by hand, store in `exam_question_banks` · `POST /api/exams/generate` (sample + AI variation, answers stay server-side) · `POST /api/exams/submit` (server grading → `examHistoryService` → `weakSpotService` → on pass `userProgressService` unlocks) · attempt limits + cooldown per `userId + path + layer` · server-side time limit · fix the `passedAt`→`takenAt` naming · Zod everywhere.

**Done means:** full loop on production — take Layer 1 exam, score ≥ threshold, Layer 2 unlocks (verified in DB and UI) · the network tab never contains a correct answer or answer index · failing records missed topics in `weakSpots` · attempt 4 within cooldown is rejected server-side · late submission is rejected server-side regardless of client claims.

**Risks:** MCQ-only tests recognition, not ability — acceptable for MVP but be honest in UI copy ("knowledge check"). AI-generated banks need real human review or quality variance makes failures feel unfair.

**Estimate:** 4–6 days (including bank review).

### Phase E — AI Mentor Backend — built, see architecture reference above

Pass 1 (streaming chat, sessions, cost caps) and Pass 2 (tool-use loop) are both implemented and verified against production Groq. See "AI Mentor — architecture reference" above for current state and the staged mentor plan for what's next.

### MVP victory condition

One real user (not the founder) on production: signs up → picks Backend → studies Layer 1 → fails the exam → sees weak spots → asks the mentor about them → retakes → passes → watches Layer 2 unlock. When that happens, ship it publicly and start the deferred backlog conversation with actual usage data.

---

## Build Order — Part 2: Deferred Backlog (do not start before the MVP loop is live)

| # | Phase | One-liner | Entry criterion |
| --- | --- | --- | --- |
| 4 | Admin Panel | Manage users/posts/reports, approve curriculum | Real users exist and moderation is consuming your time |
| 5 | Dev Library completion | Videos tab, more content, agent-driven recommendations | MVP live |
| 6 | Problem Solving Arena | Path-specific problems, in-browser runner, community submissions | MVP users asking for practice between exams; runner is multi-week — scope it then |
| 7+ | Exam Engine v2 | Code-challenge + short-answer question types, AI grading | MCQ engine validated by real pass/fail data |
| 8 | Agent Gets Smarter | Passive activity monitoring, proactive nudges, certificates, premium tier | Tool-use agent live ≥1 month with usage data |
| 9 | Public Progress Profiles | Streaks, XP, badges, employer-readable verified records | Auth hardening done + users with real progress to display |
| 10 | Weekly Challenges | Monday drops, leaderboard, badges | Retention worth optimizing — i.e., a user base |
| 11 | Ship It Capstone | Agent-reviewed real project gates the certificate | First user completes all exams of a path |
| 12 | Awards System | Rare, verified, timestamped recognition | Phases 9–11 live — awards reference their events |
| 13 | Company Portal & Talent Marketplace | Separate company auth, talent search, paid tiers | 500+ verified developer profiles with completed paths |
| 14 | Platform Intelligence | Learning analytics, content quality signals, drop-off analytics, A/B infra | Enough users for the data to mean anything; start logging raw events earlier (cheap) so the data exists when this opens |

Detailed specs for these phases (award tables, company-portal pricing, capstone flow, weekly-challenge mechanics) were written in earlier versions of `VISION.md` and remain valid as design references — see `git log --follow VISION.md` rather than re-deriving them.

---

## Layer Videos — planned (deferred until after MVP loop)

Videos live inside the layer, not on a separate page — the layer is the unit you study, get examined on, and unlock.

- **Source:** curated YouTube embeds — no hosting cost, no new infrastructure.
- **Data shape:** `videos[]` array per layer in the existing roadmap JSON; migrates to MongoDB when roadmap data moves server-side in Phase B.
- **UI:** a "Videos" section in the layer detail view; thumbnail-first rendering, real iframe only on click, one live iframe at a time.
- **Later payoff:** play events feed the mentor ("you watched the HTTP video but failed HTTP questions") and Platform Intelligence.
- **Dev Library connection:** the Library's Videos tab is just a query across all layers' `videos[]` — single source of truth.

---

## UI/UX ideas

- Roadmap as a visual node graph — paths branch, layers connect.
- Locked nodes greyed out with a lock icon; passing an exam triggers an unlock animation.
- Each profile shows active path and current layer publicly.
- Leaderboard of who's furthest on each path.
- Certificates on path completion — verifiable, shareable.
