# DevsFlow

**The developer community platform built to evolve into the biggest AI-integrated learning experience for developers.**

A full-stack platform where developers read, write, connect, and learn — with a roadmap you have to *earn*, and an AI agent that knows where you are on your journey.

---

## Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite 7, Tailwind v4, Zustand, Framer Motion, GSAP, Three.js |
| **Backend** | Node.js, Express 5, MongoDB/Mongoose, WebSockets (ws) |
| **Auth** | JWT, bcrypt, Google OAuth |
| **Infra** | Redis, BullMQ (job queues), Cloudinary (media), Docker |
| **Testing** | Vitest (unit, integration, security, performance, concurrency), Playwright (E2E) |
| **DX** | Husky, lint-staged, ESLint, Swagger UI, nodemon |

---

## What's Built

- **Blog platform** — posts organized by tech category (Backend, Frontend, Full Stack, AI/ML, DevOps, Mobile, QA, Game Dev)
- **User profiles** — follow/follower system, favorites, avatar upload via Cloudinary
- **Real-time chat** — WebSocket-powered DMs with live notifications
- **Search** — cross-platform content and user search
- **Notifications** — async delivery via BullMQ worker queue
- **Learning Roadmap** — interactive visual roadmap with progress tracking per path
- **Dev Library** — curated books, docs, and guides linked to roadmap layers
- **AI Agent** — per-user agent with persistent context (Anthropic API)
- **Coding Challenges** — category-specific problem arena tied to your roadmap layer
- **Google OAuth** — one-click sign-in with account linking
- **Dark/Light theme** — system-aware with Zustand persistence

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Redis (local or Docker)

### Install

```bash
npm install
cp backend/.env.example backend/.env
# Fill in your values
```

### Run

```bash
# Frontend + backend + Redis together
npm run dev:full

# Frontend only
npm run dev

# Backend only
nodemon backend/server.js

# Start Redis via Docker (if not running)
npm run redis
```

### Build

```bash
npm run build
```

---

## Testing

```bash
npm run test:unit          # Unit tests
npm run test:integration   # Integration tests (real MongoDB via memory server)
npm run test:api           # API endpoint tests
npm run test:websocket     # WebSocket tests
npm run test:security      # Security tests
npm run test:performance   # Performance benchmarks
npm run test:concurrency   # Concurrency / race-condition tests
npm run test:unit:coverage # Coverage report
```

---

## Project Structure

```
├── backend/
│   ├── app.js              # Express app factory
│   ├── server.js           # Entry point (HTTP + WebSocket + workers)
│   ├── config/             # DB, Redis, Cloudinary config
│   ├── routes/             # API route definitions
│   ├── controllers/        # Route handlers
│   ├── models/             # Mongoose schemas
│   ├── middleware/         # Auth, rate limiting, validation
│   ├── workers/            # BullMQ background workers
│   └── websocket/          # WebSocket server logic
├── src/
│   ├── pages/              # Route-level page components
│   ├── components/         # Reusable UI components
│   ├── features/           # Feature modules (Roadmap, AI Agent, Blogs, etc.)
│   ├── stores/             # Zustand state stores
│   ├── services/           # API client functions
│   ├── layouts/            # Page layout wrappers
│   └── routes/             # Protected route wrappers
├── constants/              # Shared constants (categories, sidebar items)
├── tests/                  # Playwright E2E tests
├── config/                 # Vitest config variants
└── public/                 # Static assets
```

---

## API Docs

Swagger UI is available at `/api-docs` when the backend is running.

---

## Environment Variables

```env
# Backend — backend/.env
PORT=5000
MONGO_URI=
JWT_SECRET=
REDIS_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
ANTHROPIC_API_KEY=
```

---

## Roadmap

The platform is being built in phases:

- [x] Community platform — blogs, profiles, follow system, real-time chat
- [x] Learning roadmap — interactive visual paths with progress tracking
- [x] Dev library — curated resources linked to roadmap layers
- [x] AI agent — per-user agent with persistent context
- [ ] Exam engine — AI-generated layer exams (90/100 to pass and unlock next layer)
- [ ] Problem solving arena — category-specific challenges tied to your roadmap layer
- [ ] Admin panel — user management, post moderation, analytics
- [ ] Certificates — verifiable completion badges per path

---

## Deployment

Configured for Railway (`railway.json`, `nixpacks.toml`) and Vercel (`vercel.json`) out of the box.

---

*Built by Vahe — one laptop, one idea, every line of code.*
