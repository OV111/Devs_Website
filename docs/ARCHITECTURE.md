# Vahoha (formerly DevsWebs) — Architecture

> Last updated: 2026-10-02. Rewritten from the 2026-06-11 review: every item in that review was re-checked against the code, and its status is recorded in [Status of the June review](#status-of-the-june-2026-review). "Built" means the code exists and is mounted; it does not mean tested with real users.

---

## How to explain Vahoha

### What problem it solves and for whom

Developer learning is fragmented. You follow a YouTube tutorial, read an article, practice on LeetCode — and nothing checks whether you understood any of it. Vahoha is for self-taught and early-career developers: a roadmap where each layer stays locked until you pass a server-graded exam, a mentor that knows your weak spots, and a curated library and community around that loop. The bet is that *gated, measurable progression* is more valuable than more content.

### The core loop

```
Pick a path → study a layer (posts + library) → take the layer exam
   → PASS → next layer unlocks
   → FAIL → weak spots recorded → ask the AI mentor → targeted review → retry
```

### How it is built

Single-instance Express 5 + MongoDB (native driver) + Redis/BullMQ, with WebSockets on the same Node process. Frontend is React 19 + Vite + Zustand, code-split with `React.lazy`. Backend on Render, frontend on Vercel, database on MongoDB Atlas (see `docs/DEPLOYMENT.md`).

| Choice | Reasoning |
|---|---|
| MongoDB native driver | Document-shaped data (layers, attempts, weak spots); keeps queries close to the data model. `mongoose` is not used anywhere |
| Groq `openai/gpt-oss-120b` for the mentor | Chosen 2026-09-26 because Groq has a free tier and a solo pre-revenue project is cost-bound. `MODEL` lives in one place (`services/agent/streamService.js`); Groq retires models, so 404s mean check `/models` first |
| BullMQ | Notification jobs retry and survive restarts; in-process queues would lose them on a crash |
| Zustand | Stores are small (auth, roadmap, agent session, notifications); no Redux boilerplate |
| Polar (Merchant of Record) | Handles VAT and sales tax, and pays out to Armenia, which direct Stripe does not support (`docs/BILLING.md`) |
| Zod at the route boundary | Used on new routes (agent, billing, challenges, mastery). Old community routes are not backfilled |

### The hardest technical problems

1. **Agent tool-use loop with streaming.** The mentor calls backend tools (progress, exam history, weak spots, posts, library, profile) while streaming. Tool results must be interleaved into history before the next model call; the frontend SSE hook handles aborts and incremental chunks.
2. **Exam integrity.** Answer keys never leave the server: the client submits answers and the server grades. Choices are shuffled per attempt, unseen questions are served first, and attempts are limited. Honest limit: a multiple-choice exam cannot be made ChatGPT-proof (`docs/EXAM_INTEGRITY.md`).
3. **Server-authoritative progression.** Layer N+1 unlocks only when the exam is passed at `PASS_THRESHOLD = 80`, stored in `userProgress` server-side. The threshold is a hardcoded constant in `examEngineService.js`; the planned `platformConfig` collection was never built.
4. **Learner model.** Mastery per topic is derived from exams, teach-back and challenge results (`learnerMasteryService`, `modules/mastery`) and fed to the mentor as context, so its answers are grounded in what the learner actually struggled with.

### Planned extensions (direction, not built)

`learnerMastery` is the single evidence spine: exams, teach-back and challenge results already feed it, and the Capstone review (rubric scores 0–4 per criterion) and defense are the next evidence sources. New features should write evidence into this spine through `recomputeMastery`, not into a parallel score or progress store. Per-skill progression (e.g. "databases 6.4 → 7.3") would be a derived view over that evidence with a snapshot per recompute. Content completion and demonstrated mastery stay separate signals. See `docs/ROADMAP_BUILD_PLAN.md` ("Loop strengthening") for what is MVP, V2, future or experiment.

---

## Current layout

### Backend (`backend/`)

| Area | Where | Notes |
|---|---|---|
| App wiring | `app.js`, `server.js` | `app.js` builds the Express app (helmet, CORS, routes); `server.js` adds HTTP + WebSocket + workers |
| Auth | `routes/auth.routes.js`, `controllers/authController.js`, `services/refreshTokenService.js` | 15-minute access tokens, 7-day rotating refresh tokens in an httpOnly cookie; Google and GitHub OAuth; Redis login throttling with `express-rate-limit` fallback |
| Community | `blogs`, `posts`, `profile`, `user`, `search`, `account` routes | Blogs can be tagged with roadmap layers (`layerIds`) |
| Roadmap | `/api/roadmaps` | Tracks and layers seeded into MongoDB; user progress is server-side |
| Exams | `/api/exams`, `services/examEngineService.js` | Generate, submit, teach-back, history, weak spots; integrity flags recorded per attempt |
| Mentor | `/api/ai-agent`, `services/agent/*`, `tools/agentTools.js` | Sessions, SSE streaming, tool loop, 20-turn window, 30 messages/day |
| Mastery | `modules/mastery` | Per-topic status and next action |
| Challenges (Arena) | `modules/coding-challenges` | Catalog, grading in an `isolated-vm` sandbox, proposals with admin review, XP-priced hints, daily submission cap |
| Capstone | `modules/capstone` | Repo review, timed technical defense, certificates, admin overrides |
| Build Teams | `modules/teams`, `/api/teams` | Built 2026-10-04, not yet run on real data. Admin-created team on one GitHub repo; merged PRs synced per member; per-member defense on their own PR diffs (reuses capstone helpers, capstone code untouched); peer ratings; public evidence snapshot at `GET /api/teams/evidence/:publicId` |
| Billing | `modules/billing` | Polar checkout, signed webhook, subscription state. **Inert** until `BILLING_ENFORCED=true` |
| Analytics | `services/eventService.js`, `routes/analytics.routes.js` | 7 server-side events and an admin-only funnel at `GET /api/admin/funnel` |
| Real time | `websocket/`, `workers/notificationWorker.js`, `queues/` | DMs and group chat; notifications via BullMQ |
| Rate limits | `middleware/aiRateLimit.js` plus per-module limiters | Per-user limits on LLM routes; in-memory store (single instance only) |

### Frontend (`src/`)

`features/` holds one folder per product area: `Roadmap`, `AI-Agent`, `coding-challenges`, `mastery`, `billing`, `blogs`, `profile`, `codingLibs`, `capstone`, `teams` (`/team` for members, public `/evidence/:publicId`), plus an unfinished `voiceReview` shell. Stores are in `stores/` (auth, roadmap, agent, notifications, profile, theme). Access tokens live in memory only; the httpOnly refresh cookie restores the session on load.

### MongoDB collections (database `DevsBlog`)

- **Community:** `users`, `usersStats`, `blogs`, `posts`, `comments`, `favouriteBlogs`, `follows`, `notifications`, `rooms`, `messages`, `contact_messages`, `usernameHistory`
- **Auth:** `refreshTokens`, `passwordResets`
- **Learning:** `roadmap_tracks`, `roadmap_layers`, `userProgress`, `exam_question_banks`, `exam_attempts`, `examHistory`, `weakSpots`, `teach_back_rubrics`, `teach_back_sessions`, `concepts`, `learnerMastery`, `mentor_teaching_log`, `libraryResources`, `savedLibraryResources`
- **Mentor:** `agent_sessions`, `agent_usage`
- **Arena:** `challenges`, `challenge_attempts`, `challengeResults`
- **Capstone:** `capstone_briefs`, `capstone_attempts`, `capstone_submissions`, `capstone_reviews`, `capstone_defenses`, `capstone_admin_actions`, `certificates`
- **Teams:** `teams`, `team_contributions`, `team_defenses`, `team_ratings`, `team_evidence`
- **Analytics:** `userEvents`

---

## Status of the June 2026 review

| June finding | Status (2026-10-02) | Evidence |
|---|---|---|
| `useRoadmapStore` mixes state and persistence | **Partly open.** Progress is now saved through the API, but the store still calls a persistence helper itself | `stores/useRoadmapStore.js` (`persistProgress`) |
| Onboarding answers go nowhere | **Fixed** | `startPath` stores `skillLevel` |
| JWT in localStorage | **Fixed** | Access token in memory; httpOnly refresh cookie (`constants/api.js`, `authController.js`) |
| `/api` prefix mismatch | **Decided and applied** to all new routes; legacy routes stay bare (`/blogs`, `/library`, auth) | `app.js` |
| WebSocket rooms Map never shrinks | **Fixed** | `removeFromRooms` on close (`websocket/index.js`) |
| Layer gating relied on localStorage | **Fixed**, server-authoritative | `userProgress`, `examEngineService.js` |
| No consistent error response shape | **Open.** Routes return `{ message }` or `{ error }`; no shared `formatError` or global error handler | — |
| `passedAt` sort on failed attempts | **Fixed** (`takenAt`) | `examHistoryService.js` |
| No server-state cache (React Query) | **Open.** Not adopted | `package.json` |
| `src/hooks/` nearly empty | **Open** | `src/hooks/` has two files |
| Inconsistent `features/` depth | **Open** | — |
| Empty `backend/events/` and `backend/jobs/` | **Still empty** | — |
| Two animation libraries | **Open**, not audited | GSAP and Framer Motion both installed |
| Agent on Anthropic | **Superseded:** Groq `openai/gpt-oss-120b` | `streamService.js` |
| Pass threshold in `platformConfig` | **Not built.** Constant `PASS_THRESHOLD = 80` | `examEngineService.js` |

## Known limits

- **One process.** HTTP, WebSocket and the BullMQ worker share one instance; the WebSocket `rooms` map and the rate-limit counters are in memory. Pin to one instance, or move counters to Redis before scaling out.
- **Funnel query loads the whole signup cohort into memory** (`getFunnel`). Fine for a pilot; use an aggregation pipeline before thousands of users.
- **The Arena executes submitted code** inside an `isolated-vm` isolate. In production it fails closed (submissions refused) if that native addon did not build, unless `ALLOW_UNSAFE_RUNNER=true`. The isolate has not had an independent security review (see `docs/Security.md`).
- **Rate limits are per process,** so a restart resets them.

## Open fixes, in priority order

| # | Fix | Why |
|---|---|---|
| 1 | Sanitize challenge HTML before `dangerouslySetInnerHTML` (`renderInlineCode`) | Challenge content now comes from the database and community proposals, so it is a stored-XSS sink |
| 2 | Verify the runner reports `isolated-vm` in production and get the isolate reviewed before public traffic | Biggest attack surface |
| 3 | Shared error handler and response shape | New contributors keep adding inconsistent shapes |
| 4 | Move rate-limit counters to Redis | Needed before more than one instance |
| 5 | Move `PASS_THRESHOLD` and the mentor caps into config | Tune without a deploy |
| 6 | React Query for server state | Removes refetch-on-navigation |
