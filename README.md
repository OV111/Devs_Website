<div align="center">

# Vahoha

**Developer learning that won't let you fake it.**

Roadmaps you have to *earn*: server-graded exams gate every layer, and an AI mentor guides you through your weak spots.

[vahoha.com](https://vahoha.com) · [@vahoha_](https://x.com/vahoha_)

![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_7-646CFF?style=flat-square&logo=vite&logoColor=white)

</div>

---

## What is Vahoha?

Vahoha is a learning platform for developers who want proof they actually understood what they studied. Every roadmap layer is locked until you pass a server-graded exam on it; failing records your specific weak spots, and a personal AI mentor (grounded in your real progress and exam history) helps you close them before you retry. Community posts and coding challenges sit around that core loop. Built from scratch, solo, by Vahe Ohanyan. (Formerly called DevsWebs; the repository folder still uses the old name.)

---

## Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite 7, Tailwind v4, Zustand, Framer Motion, GSAP, CodeMirror |
| **Backend** | Node.js 22 (ESM), Express 5, MongoDB (native driver), WebSockets (`ws`), Zod |
| **AI** | Groq (`openai/gpt-oss-120b`) for the mentor, teach-back grading and exam-bank generation |
| **Auth** | JWT access tokens (15 min) + rotating httpOnly refresh cookie, bcrypt, Google and GitHub OAuth |
| **Billing** | Polar (Merchant of Record), signed webhooks. Built, **not enforced** (`BILLING_ENFORCED=false`) |
| **Infrastructure** | Redis, BullMQ, Cloudinary, `isolated-vm` (code-runner sandbox), Docker |
| **Email** | Resend |
| **Testing** | Vitest (unit, integration, API, security, performance, concurrency, WebSocket, queue), Playwright (E2E) |
| **DX** | Husky, lint-staged, ESLint, Swagger UI, nodemon |

---

## Features

**The core loop**

- **Learning roadmaps:** 15 categories of visual paths with tracks and layers. Each layer is locked until you pass its exam; progress is saved server-side
- **Exam engine:** server-graded multiple choice, 15 questions per attempt, pass mark 80. Answer keys never leave the server, choices are shuffled per attempt, unseen questions are served first, 3 attempts per day plus a cooldown after a fail
- **AI mentor:** per-user agent with tools into your progress, exam history and weak spots. Socratic (guides, doesn't hand over answers); streaming, sessions, 30 messages a day
- **Teach-back:** explain a topic in your own words and get it graded against a rubric. One slice shipped; the full voice exam is a spec (`docs/VOICE_EXAM_SPEC.md`)
- **Mastery:** per-topic status and a "next step" derived from exams, teach-back and challenge results
- **Dev library:** curated books, docs and guides mapped to roadmap layers
- **Blog posts tagged to layers:** a layer shows the posts written for it

**Around it**

- **Coding challenges (Arena):** catalog, sandboxed grading, community proposals with admin review, XP-priced hints
- **Community:** Markdown blog, profiles, follows, DMs and group chat over WebSockets, queue-backed notifications
- **Billing:** Polar checkout and subscription state (inert until enabled)
- **Pilot analytics:** 7 server-side events and an admin-only funnel (`GET /api/admin/funnel`)
- **Search**, **OAuth**, **dark/light theme**

---

## Getting Started

### Prerequisites

- Node.js 22
- MongoDB (local or Atlas)
- Redis (local or Docker). Optional: set `REDIS_ENABLED=false` to skip it

### Install

```bash
npm install
# create backend/.env: see Environment Variables below (there is no .env.example yet)
```

### Run

```bash
# Frontend + backend + Redis together
npm run dev:full

# Frontend only
npm run dev

# Backend only
npm run server

# Start Redis via Docker (if not already running)
npm run redis
```

### Seed content (once per database)

```bash
npm run seed:roadmap                     # tracks and layers
npm run seed:challenges                  # Arena challenges
npm run seed:concepts                    # concept definitions for the mentor
npm run seed:rubrics                     # teach-back rubrics
node backend/seeders/examSeeder.js       # exam banks via Groq; see docs/EXAM_INTEGRITY.md
npm run admin:grant -- you@example.com   # make yourself an admin
```

### Build

```bash
npm run build
```

---

## Testing

```bash
npm run test:unit           # Unit tests
npm run test:integration    # Integration (real MongoDB via in-memory server)
npm run test:api            # API contract tests
npm run test:websocket      # WebSocket tests
npm run test:queue          # BullMQ worker tests
npm run test:security       # Security tests
npm run test:performance    # Performance benchmarks
npm run test:concurrency    # Race-condition and concurrency tests
npm run test:unit:coverage  # Coverage report
npm run lint
```

---

## Project Structure

```
├── backend/
│   ├── app.js              # Express app factory (helmet, CORS, routes)
│   ├── server.js           # Entry point (HTTP + WebSocket + workers)
│   ├── config/             # DB (and indexes), Redis, Cloudinary, Swagger
│   ├── routes/             # Route definitions
│   ├── controllers/        # Route handlers
│   ├── services/           # Business logic (exam engine, events, blogs, agent/…)
│   ├── modules/            # Self-contained features: billing, mastery, coding-challenges, contact
│   ├── middleware/         # authenticate, requireAdmin, validate, aiRateLimit
│   ├── tools/              # Mentor tool definitions
│   ├── seeders/ scripts/   # Content seeding and one-off maintenance
│   ├── workers/ queues/    # BullMQ
│   ├── websocket/          # Chat server
│   └── tests/              # unit | integration | api | security | perf | ws | queue
├── src/
│   ├── features/           # One folder per product area (Roadmap, AI-Agent, mastery, billing, …)
│   ├── pages/              # Route-level pages
│   ├── components/         # Shared UI
│   ├── stores/             # Zustand state
│   └── data/roadmaps/      # Roadmap content, one JSON file per category
├── constants/              # Shared constants (API base URL, categories)
├── config/                 # Vitest configs per test suite
├── docs/                   # Plans, specs and strategy (index below)
└── public/                 # Static assets
```

---

## Environment Variables

`backend/.env`:

```env
# Server
PORT=5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# Database
MONGO_URI=

# Auth (note the capitalisation of JWT_Secret)
JWT_Secret=
JWT_REFRESH_SECRET=
GOOGLE_CLIENT_ID=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Redis (optional: REDIS_ENABLED=false skips it)
REDIS_ENABLED=true
REDIS_URL=

# AI
GROQ_API_KEY=

# Images and email
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=

# Billing (see docs/BILLING.md); keep BILLING_ENFORCED=false during the pilot
POLAR_ACCESS_TOKEN=
POLAR_PRO_PRODUCT_ID=
POLAR_WEBHOOK_SECRET=
BILLING_ENFORCED=false
```

Frontend (`.env`): `VITE_API_BASE_URL`, `VITE_WS_URL`, `VITE_GOOGLE_CLIENT_ID`.
Other switches (`MAINTENANCE_MODE`, `ALLOW_UNSAFE_RUNNER`, `WS_EXTRA_ORIGINS`, `CONTACT_INBOX`) are explained in `docs/DEPLOYMENT.md`.

---

## API Docs

Swagger UI is available at `/api-docs` when the backend is running.

---

## Status

| Status | Milestone |
|---|---|
| ✅ | Community platform: blogs, profiles, follows, real-time chat |
| ✅ | Learning roadmap: server-side progress, locked layers |
| ✅ | Dev library: curated resources linked to roadmap layers |
| ✅ | Exam engine: server-graded layer exams, pass at 80 |
| ✅ | AI mentor: tools into your progress, Socratic, sessions |
| ✅ | Mastery map and learner context |
| ✅ | Coding challenges (Arena): sandboxed grading, proposals |
| ✅ | Billing: Polar, sandbox-verified, not enforced |
| ✅ | Pilot analytics: events and funnel |
| 🟡 | Exam banks: generator built; banks must be seeded and hand-checked per layer |
| 🔲 | Voice exam (teach-back): specified, not built |
| 🔲 | Public progress profiles, certificates, admin panel |
| 🔲 | Real users: the pilot has not started |

Day-to-day status and the pre-pilot checklist: `docs/PILOT_STATUS.md`.

---

## Deployment

Backend on Render (`render.yaml`), frontend on Vercel (`vercel.json`), database on MongoDB Atlas. Railway still works (`railway.json`, `nixpacks.toml`, `Dockerfile`). Full steps: `docs/DEPLOYMENT.md`.

---

## Docs

| Doc | What it is |
|---|---|
| `docs/strategy/VISION.md` | Business and product framing |
| `docs/PILOT_STATUS.md` | What's done, what's left before the first user |
| `docs/STARTUP_CRITIQUE_2026-10.md` | Brutally honest review of the project |
| `docs/STARTUP_REVIEW_2026-10.md` | Competitive review and 90-day plan |
| `docs/OUTREACH_KIT.md` | How to find and interview the first users |
| `docs/EXAM_INTEGRITY.md` | Anti-cheating plan and its honest limits |
| `docs/XP_SYSTEM.md` | XP ideas, each with a critique |
| `docs/ROADMAP_BUILD_PLAN.md` | Build status and phase plan |
| `docs/VOICE_EXAM_SPEC.md` | Spoken teach-back exam spec |
| `docs/BILLING.md`, `docs/DEPLOYMENT.md` | Operations |
| `docs/FUTURE_IDEAS.md` | Unscoped ideas, parked until the pilot |
| `docs/ARCHITECTURE.md`, `docs/Security.md`, `docs/ISSUES.md` | Technical status |
| `docs/strategy/BUSINESS_MODEL.md`, `docs/strategy/GROWTH_PLAYBOOK.md`, `docs/strategy/ADVISORY_BOARD_REPORT.md`, `docs/strategy/STARTUP_ADVISOR_ANALYSIS.md` | Strategy |

---

<div align="center">

*Built by Vahe — one laptop, one idea, every line of code.*

</div>
