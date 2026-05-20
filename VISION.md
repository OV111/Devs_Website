# DevsFlow — Vision & Product Roadmap

> Living document — update this as the vision evolves.
> Last updated: 2026-05-20

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

Every developer who joins gets a personal AI mentor that knows them, a structured roadmap they earn layer by layer,and only can pass with exams and coding challenges built for where they actually are — not random DSA grinding.

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

## Current State — Honest Snapshot

| Feature                                          | Status                                       |
| ------------------------------------------------ | -------------------------------------------- |
| Community Platform (blogs, profiles, chat, auth) | ✅ Built                                     |
| Roadmap UI                                       | 🔧 Frontend shell built — no backend         |
| Dev Library                                      | 🔧 Page shells exist — no content or backend |
| Admin Panel                                      | ❌ Not started                               |
| AI Agent                                         | ❌ Not started — design spec only            |
| Problem Solving Arena                            | ❌ Not started                               |
| Exam Engine                                      | ❌ Not started                               |
| Public Progress Profiles                         | ❌ Not started                               |
| Weekly Challenges                                | ❌ Not started                               |
| Ship It Capstone                                 | ❌ Not started                               |
| Platform Intelligence                            | ❌ Not started                               |

---

## Core Pillars

### 1. Community Platform — ✅ BUILT

The foundation the rest of the platform is built on.

- Blog posts by category: Backend, Frontend, AI/ML, DevOps, Mobile, QA, GameDev, DataScience, Fundamentals, FullStack
- Difficulty and read-time filtering, sort by Newest / Oldest / Popular / Trending
- User profiles, follow/unfollow system
- Real-time chat (WebSocket + JWT auth)
- Notifications (BullMQ + Redis queue)
- Search
- Auth: email/password, Google OAuth, GitHub OAuth, forgot/reset password
- Blog sharing, connected accounts, dark/light theme

---

### 2. The Roadmap — 🔧 IN PROGRESS

This is the core innovation. roadmap.sh shows you a map. **DevsFlow makes you earn it.**

Every node is locked until you pass the exam for the previous layer — strict 90/100 threshold. The journey is the product.

```
Pick a path (e.g. "Backend Developer")
        ↓
Layer 1: Programming Fundamentals
  → Read curated posts on the platform
  → Ask your AI agent questions
  → Solve practice problems for this layer
  → Take the Layer Exam (AI-generated, 90/100 to pass)
  → PASS → Layer 2 unlocks ✅
  → FAIL → Agent surfaces your weak spots, targeted review, retry
        ↓
Layer 2: How the Web Works (HTTP, APIs, Servers)
        ↓
Layer 3: Node.js Basics
        ↓
... and so on until you're job-ready
```

**What's built:**

- ✅ `RoadmapPage.jsx` with `CategoryBar`, `TrackSelector`, `RoadmapTree` components
- ✅ `useRoadmapStore` (Zustand)

**What's missing:**

- ❌ Roadmap data model in MongoDB (paths, layers, content links)
- ❌ Backend API for paths and layers
- ❌ Locked/unlocked node logic tied to exam results
- ❌ Progress indicators per user per path
- ❌ Unlock animations (GSAP + Framer Motion — already in the stack)

**Paths available:**
Backend Developer · Frontend Developer · Full Stack · AI & ML · DevOps · Mobile · Game Developer · QA Engineer

**Each layer contains:**

1. Learning material — curated platform posts written by the community
2. AI agent guidance — ask questions, get Socratic explanations
3. Practice problems — linked challenges for this specific layer
4. Layer Exam — must pass to unlock the next layer

---

### 3. AI Agent Per User — ❌ NOT BUILT

> Route `/ai-agent` exists. Currently just a detailed design spec in comments — zero implementation.

Every user gets their own personal AI mentor on signup. Not a generic chatbot — an agent that **knows the user**: their skill level, their active path, what they've read, where they struggled, and how fast they progress.

The agent is not there to give answers. It's there to make you earn them — guided questions, targeted hints, explanations calibrated to your level.

**What the agent does:**

- Answers questions in context of your current layer ("you're on Layer 3 of the Backend path — here's how this connects to what you already know")
- Guides you through problems with progressive hints, never giving the full solution
- Explains why you failed an exam question and what to review
- Recommends specific platform posts and library resources for your weak spots
- Proactively surfaces gaps ("you haven't practiced Node.js middleware in a while")
- Celebrates milestones and keeps you moving

#### Architecture — Tool-Use Agent (Industry Standard)

This is how Cursor, GitHub Copilot, and Khan Academy's Khanmigo are built. The agent has tools it can call — it decides what context it needs per question, fetches it live, and answers. No giant static prompts. No stale data.

```
User sends a message
        ↓
Agent receives:
  - System prompt (cached — static rules, persona, Socratic constraints)
  - Last 20 conversation turns (sliding window)
  - User's message
        ↓
Agent decides which tools to call:
  get_user_progress()        → current path, layer, exam scores
  get_layer_content()        → what the user is studying right now
  search_platform_posts()    → find relevant DevsFlow blog posts by topic
  get_exam_history()         → past scores, failed topics, weak areas
  log_weak_spot(topic)       → persist what the user struggled with to MongoDB
        ↓
Agent synthesizes a response:
  - Socratic by default — guides, does not give answers
  - Cites platform posts when relevant ("here's a post from the platform on this exact topic")
  - Adapts explanation depth to user's current layer
        ↓
Response streamed back via SSE (real-time, not one big response)
        ↓
Interaction logged to MongoDB → feeds future context
```

**Technical decisions — based on what works at scale:**

| Decision            | Choice                                                                                    | Why                                                                      |
| ------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Model               | Claude Sonnet (Anthropic API)                                                             | Native tool use, best instruction-following, already in vision           |
| Context strategy    | Tool-use agent — fetches live data on demand                                              | Never stale, never bloated. How Cursor and Copilot work                  |
| Memory — short-term | Last 20 conversation turns                                                                | Cheap, predictable, works well for session context                       |
| Memory — long-term  | MongoDB: user's topics_mastered[], weak_spots[], activity_log[] — summarized periodically | Survives across sessions                                                 |
| Streaming           | Yes — SSE from Express to frontend                                                        | Critical for perceived performance. Every major AI product does this     |
| Prompt caching      | Yes — cache the static system prompt prefix                                               | Anthropic supports this natively. ~90% cost reduction on static sections |
| Agent behavior rule | Socratic — guide, never give full answers                                                 | Khan Academy's Khanmigo lesson. Users learn more, feel accomplished      |

**Agent context initialized on signup:**

```
ai_agent_context: {
  skill_level: "beginner",
  active_path: null,
  current_layer: null,
  topics_mastered: [],
  weak_spots: [],
  activity_log: [],        ← summarized periodically to stay compact
  sessions: []             ← past conversation sessions (compressed)
}
```

**Files needed — properly separated by responsibility:**

```
backend/
  routes/
    aiAgent.routes.js          ← HTTP layer only: /ai-agent/chat (SSE), /ai-agent/sessions

  services/agent/
    contextService.js          ← builds the agent's view of the user
                                  (current path, layer, exam scores, weak spots)
    toolsService.js            ← implements every tool the agent can call
                                  (get_user_progress, get_layer_content,
                                   search_platform_posts, log_weak_spot, get_exam_history)
    memoryService.js           ← sliding window management, summarizes old activity_log
                                  entries so context stays compact across sessions
    sessionService.js          ← conversation session CRUD
                                  (create session, append message, retrieve history, delete)
    streamService.js           ← the Anthropic API call, tool-use loop, SSE emit
                                  orchestrates: contextService → toolsService → stream response

src/
  services/
    aiAgentApi.js              ← frontend fetch layer (mirrors blogsApi.js pattern)

  stores/
    useAiAgentStore.js         ← sessions[], activeSessionId, messages[], isLoading, mode

  features/AI-Agent/
    AiAgent.jsx                ← actual UI implementation
                                  (detailed design spec already written in comments)

---

### 4. Problem Solving Arena — ❌ NOT BUILT

> Route `/coding-challenges` exists. Currently shows "Challenges coming soon" placeholder.

LeetCode gives you random problems. **DevsFlow gives you problems that match your path.**

Every problem is tied to a roadmap path and layer — practicing exactly what you're learning, not random grinding.

```

Backend Developer path
→ REST API design, DB queries, auth logic, rate limiting, caching...

Frontend Developer path
→ DOM manipulation, state management, CSS challenges, accessibility...

AI & ML path
→ Data preprocessing, model evaluation, algorithm implementation...

DevOps path
→ CI/CD pipeline design, Docker configs, infra scripting...

```

**Problem types:**
- Code challenges — run and validate in-browser
- Debug challenges — find and fix the bug in broken code
- System design — AI-graded written explanation
- Build challenges — implement a small feature from scratch

**How the AI agent connects:**
- Stuck? Agent gives progressive hints — never the full answer
- After you solve it, agent can explain the optimal approach and why yours worked (or didn't)
- Solving problems in a layer contributes to your exam readiness score
- Community can submit problems — reviewed and approved by admins

**Why it beats LeetCode for developers:**

| LeetCode | DevsFlow Problems |
| --- | --- |
| Generic algorithms for everyone | Category-specific, path-relevant problems |
| Disconnected from learning | Tied to your current roadmap layer |
| No mentorship | AI agent guides with progressive hints |
| Competitive and intimidating | Progressive and encouraging |
| DSA-heavy | Real-world developer scenarios |

---

### 5. Dev Library — 🔧 IN PROGRESS

> Routes `/coding-libs`, `/coding-libs/books`, `/coding-libs/docs` exist. Page shells (`CodingLibs.jsx`, `Books.jsx`, `Docs.jsx`) are on the `feat/libs` branch. No content or backend yet.

A curated, contextualized resource library connected to the roadmap — not a link dump. Every entry exists because it belongs to a specific learning path.

**What it contains:**
- Books (You Don't Know JS, Clean Code, DDIA, Pragmatic Programmer...)
- Official documentation — curated picks, not every doc ever written
- Deep-dive guides — concepts worth reading in full
- Cheat sheets — Git, SQL, Big O, Regex, common patterns

**Each entry has:** type, difficulty, what you'll actually learn, free/paid links, which roadmap path and layer it belongs to.

**How it connects:**
- Roadmap layers surface their relevant library entries automatically
- AI agent recommends specific resources based on your weak spots
- Replaces Googling "best resources to learn X" — the answer is already here

---

### 6. Exam Engine — ❌ NOT BUILT

The gate between roadmap layers. Pass to unlock. Fail and the agent tells you exactly why.

- Questions dynamically generated by AI based on what you studied in that layer
- No static question bank that gets memorized or leaked
- Four types: multiple choice, code challenges, short answer (AI-graded), practical tasks
- 90/100 threshold to pass
- Fail → agent identifies your weak topics → targeted review → retry

---

### 7. Public Progress Profiles — ❌ NOT BUILT

The profile page already exists. This extends it into something an employer can look at and trust.

Every public profile shows:
- Active roadmap path and current layer
- Completed paths (with certificate links)
- Problems solved count, broken down by path
- Current streak and longest streak
- Badges and XP level
- Capstone projects (title, tech stack, live demo link)

This is the visible proof of everything the roadmap system creates. A DevsFlow profile is not a CV claim — it's a verified record. A developer who completed the Backend path, passed every exam, and shipped a capstone has a profile that speaks for itself.

**What gets extended:**
- `MyProfile.jsx` and `UserProfile.jsx` — add roadmap progress, stats, badges panels
- `usersStats` collection — add `streak_current`, `streak_longest`, `xp_total`, `badges[]`, `completed_paths[]`
- New public route: `/users/:username` already exists — extend the data it surfaces

---

### 8. Weekly Challenges — ❌ NOT BUILT

Every Monday, a new timed challenge drops — open to all users regardless of where they are in their roadmap. 7 days to submit. Leaderboard closes Sunday night.

This is not the same as the Problem Solving Arena (which is path-specific, tied to your current layer). Weekly Challenges are community-wide, competitive, and social.

**How it works:**
- Challenge posted Monday morning — one per week
- Categories rotate (Backend week → Frontend week → AI/ML week → DevOps week...)
- Difficulty is intermediate — accessible to anyone past Layer 2 of any path
- Users submit their solution before the deadline
- Leaderboard ranks by: correctness first, then speed of submission
- Top 3 get a badge, all participants get XP
- Past challenges are archived and remain solvable (just no leaderboard)

**Why this matters for retention:**
Users who aren't actively studying a roadmap layer still have a reason to open DevsFlow every week. The leaderboard creates social competition and visibility. It's the equivalent of a weekly tournament — it turns passive users into active ones.

**New backend needed:**
- `weekly_challenges` collection — challenge document posted each Monday
- `weekly_submissions` collection — user solutions with scores and timestamps
- `GET /challenges/weekly/current` — active challenge
- `GET /challenges/weekly/:id/leaderboard` — top submissions
- `POST /challenges/weekly/:id/submit` — submit solution

---

### 9. Ship It — Capstone Project — ❌ NOT BUILT

After a user passes the final exam of a path, they don't just get a certificate. They get an assignment: **build something real**.

The AI agent acts as a senior developer reviewing their work — asking hard questions, giving structured feedback, pushing them to explain their decisions. The capstone project lives on their public profile as a verified portfolio piece.

**The flow:**
```

User passes final exam of Backend path
↓
Agent assigns a capstone: "Build a production-ready REST API with auth, rate limiting,
and a MongoDB data layer. Deploy it. Document it."
↓
User has 2 weeks to build
↓
User submits: GitHub repo + live demo URL + written explanation of architecture decisions
↓
AI agent reviews:

- Asks questions about specific decisions ("why did you choose this schema structure?")
- Gives structured feedback: architecture, code quality, security gaps, what to improve
- Grades: Approved / Needs Revision
  ↓
  On approval:
- Capstone added to public profile as a verified portfolio piece
- Certificate issued (capstone is a prerequisite — not just passing exams)
- Badge added to profile

```

**Why this gap matters:**
Every learning platform gives you content. Almost none of them make you build something real before calling you done. The gap between "I finished the course" and "I can build production software" is where most developers get stuck. Ship It closes it.

**New backend needed:**
- `capstone_projects` collection — `{ userId, path, title, repo_url, demo_url, writeup, ai_reviews[], status, submitted_at }`
- `POST /capstone/submit` — submit capstone for review
- `GET /capstone/:userId` — fetch user's capstone projects (for profile)
- Agent tool: `review_capstone(submission)` — structured AI review flow

---

## Data Model — Planned Additions

The community platform DB (`DevsBlog`) already has: `users`, `usersStats`, `blogs`, `comments`, `favouriteBlogs`, `follows`, notifications, chat.

**New collections needed:**

```

roadmaps ← paths and layer definitions
├── path_id, name, description
└── layers[] (ordered)
├── id, title, order
├── content[] ← linked platform blog \_ids
├── problems[] ← linked problem \_ids
└── exam_config ← type, difficulty, topics

problems
├── id, title, description
├── path ← which developer category
├── layer ← which roadmap layer
├── difficulty ← beginner / intermediate / advanced
├── type ← code / debug / system-design / build
├── starter_code
├── test_cases[]
├── solution ← hidden, used only for AI grading
└── submitted_by

user_roadmap_progress ← per user per path
├── userId
├── active_path
├── current_layer
├── completed_layers[]
├── unlocked_at{} ← timestamps per layer
└── problems_solved[]

user_exam_history
├── userId, layer_id
├── attempt_number
├── score, passed
└── weak_topics[]

user_ai_context ← merged into usersStats or its own collection
├── userId
├── skill_level
├── topics_mastered[]
├── weak_spots[]
└── activity_log[] ← summarized periodically

weekly_challenges
├── id, title, description
├── type ← code / debug / system-design / build
├── difficulty
├── category ← Backend / Frontend / AI&ML / DevOps...
├── posted_at ← always a Monday
└── closes_at ← the following Sunday

weekly_submissions
├── userId, challengeId
├── solution
├── score ← 0–100
├── rank ← computed after close
└── submitted_at

user_achievements ← extend usersStats or own collection
├── userId
├── xp_total
├── streak_current
├── streak_longest
└── badges[] ← { id, name, description, earned_at }

capstone_projects
├── userId, path
├── title, repo_url, demo_url
├── writeup ← architecture decisions explanation
├── status ← pending / approved / needs_revision
├── ai_reviews[] ← { feedback, questions_asked, rating, reviewed_at }
└── submitted_at

```

---

## Build Order

### Phase 0 — Community Platform — ✅ DONE

Blogs, profiles, follow system, real-time chat, notifications, auth (email + Google + GitHub), search.

### Phase 1 — Admin Panel — ❌ NOT STARTED

Manage users, posts, reports. Approve community problem submissions and curriculum content. Required before community contributions can be trusted.

### Phase 2 — Learning Layer (Backend) — ❌ NOT STARTED

- Roadmap data seeded into MongoDB (paths, layers, content links)
- User progress tracking: active path, current layer, unlocked layers
- API: `GET /roadmaps`, `GET /roadmaps/:path/layers`, `POST /roadmaps/progress`

### Phase 3 — Roadmap UI (Frontend) — 🔧 IN PROGRESS

- Wire the existing UI shell to the Phase 2 backend
- Locked/unlocked node rendering based on user progress
- Animated unlock effects (GSAP + Framer Motion — already in the stack)
- Progress indicators per path on profile

### Phase 4 — AI Agent Per User — ❌ NOT STARTED

- Anthropic API integration with tool-use architecture
- Per-user agent context in MongoDB
- SSE streaming from Express backend
- Full chat UI implementation (design spec already written in `AiAgent.jsx` comments)

### Phase 5 — Dev Library — 🔧 IN PROGRESS

- Seed library content into MongoDB (books, docs, guides, cheat sheets)
- Backend API: `GET /library`, filtered by path/layer/type
- Connect `feat/libs` branch UI shells to the API
- Surface relevant library entries inside roadmap layers

### Phase 6 — Problem Solving Arena — ❌ NOT STARTED

- Problem DB seeded per path and layer
- In-browser code runner and test validator
- AI agent hint system — progressive, Socratic
- Community problem submissions + admin review queue
- Exam readiness score derived from problems solved

### Phase 7 — Exam Engine — ❌ NOT STARTED

- AI-generated exam questions per layer
- Grading system: 90/100 to pass
- Fail flow: agent identifies weak topics, targeted review, retry
- Unlock next layer on pass

### Phase 8 — Agent Gets Smarter — ❌ NOT STARTED

- Passive activity monitoring (what posts the user reads, time spent, etc.)
- Proactive nudges ("you haven't practiced X in 5 days")
- Cross-path skill recognition
- Certificates on path + capstone completion
- Monetization: free tier vs premium AI features

### Phase 9 — Public Progress Profiles — ❌ NOT STARTED

- Extend `MyProfile.jsx` and `UserProfile.jsx` with roadmap progress, streak, XP, badges, completed paths
- Extend `usersStats` with `streak_current`, `streak_longest`, `xp_total`, `badges[]`, `completed_paths[]`
- XP awarded for: reading a post, solving a problem, passing an exam, commenting, completing a layer
- Streak system: at least one meaningful action per day or streak resets
- Profiles become employer-readable — verified progression, not CV claims

### Phase 10 — Weekly Challenges — ❌ NOT STARTED

- Weekly challenge seeded every Monday (admin creates or AI generates)
- Submission window: Monday → Sunday
- Leaderboard: ranked by correctness then speed
- Top 3 earn a badge, all participants earn XP
- Past challenges archived and remain solvable

### Phase 11 — Ship It Capstone — ❌ NOT STARTED

- Triggered automatically when user passes the final exam of any path
- AI agent assigns a capstone project appropriate to the completed path
- User submits: GitHub repo + live demo URL + architecture writeup
- AI agent conducts a structured review — asks hard questions, gives feedback, grades
- Certificate only issued after capstone is approved
- Capstone projects live on public profile as verified portfolio pieces

### Phase 12 — Platform Intelligence — ❌ NOT STARTED

Internal tooling that makes every other phase better over time. See the Platform Intelligence section below.

---

## Platform Intelligence — ❌ NOT BUILT

Internal systems that make the platform measurably better over time. Not visible to users directly, but everything else gets better because of it.

### Learning Analytics Dashboard (for users)

Every user gets a personal weekly summary:
- Time spent this week vs last week
- Posts read, problems solved, exam attempts
- Current exam readiness score for their active layer ("68% ready — 3 more practice problems on database indexing and you're there")
- Predicted pass date for current layer based on pace
- Where you're spending time vs where your weak spots are

This turns passive learning into measurable progress. Users who see their data stay longer.

### Content Quality Signals (for admins)

Track which blog posts correlate with exam failures in the same layer. If 70% of users who fail the Layer 3 exam on "database indexing" last read Post X on that topic — Post X probably doesn't explain it well enough. Surface these signals to admins. Use them to continuously improve the curriculum.

Every piece of content gets a quality score over time:
- Read completion rate (did users finish it or drop off?)
- Correlation with exam pass/fail on related topics
- Engagement: comments, shares, saves
- Agent citation rate (how often does the AI recommend this post?)

### Drop-off Analytics (for admins)

The most important product question: **where do users leave, and why?**

- Which layer has the highest abandonment rate?
- What is the average time spent per layer before users quit vs pass?
- What is the average number of exam attempts before passing vs giving up?
- Which paths have the best completion rates?
- What does the cohort that finishes look like vs the cohort that leaves?

This data should drive every future prioritization decision.

### A/B Testing Infrastructure

Before changing how the roadmap works, the exam difficulty, or the AI agent's tone — test it. A/B test on small user cohorts, measure pass rates and retention, then roll out the better version.

Not needed on day one. Critical once you have enough users to get statistically meaningful results.

---

## UI/UX Ideas

- Roadmap is a **visual node graph** — paths branch, layers connect
- Locked nodes are greyed out with a lock icon
- Passing an exam triggers a satisfying **unlock animation**
- Each user's profile shows their active path and current layer publicly
- Leaderboard of who's furthest on each path
- Certificates on path completion — verifiable, shareable

---

## Notes & Ideas to Explore

> Add ideas here as they come

- [ ] Can users contribute posts that become official curriculum content?
- [ ] Peer review system for practical exam submissions?
- [ ] Cohort feature — go through a path with a group at the same time?
- [ ] Employer-facing profiles showing verified completed paths?
- [ ] Monetization: free tier vs premium AI agent access?
- [ ] Public API for roadmap data — let others build on top of DevsFlow paths?
```
