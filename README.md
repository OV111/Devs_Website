<div align="center">

# DevsWebs

**The developer community platform built to evolve into the biggest AI-integrated learning experience for developers.**

Read. Write. Connect. Learn — on a roadmap you have to *earn*.

![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_7-646CFF?style=flat-square&logo=vite&logoColor=white)

</div>

---

## What is DevsWebs?

DevsWebs is a full-stack developer community platform — a place to publish technical articles, follow other developers, work through curated learning roadmaps, and interact with an AI agent that understands where you are on your journey. Built from scratch, solo, with every line intentional.

---

## Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite 7, Tailwind v4, Zustand, Framer Motion, GSAP, Three.js |
| **Backend** | Node.js (ESM), Express 5, MongoDB, Mongoose, WebSockets (`ws`) |
| **Auth** | JWT, bcrypt, Google OAuth, GitHub OAuth |
| **Infrastructure** | Redis, BullMQ, Cloudinary, Docker |
| **Email** | Resend |
| **Testing** | Vitest (unit · integration · security · performance · concurrency), Playwright (E2E) |
| **DX** | Husky, lint-staged, ESLint, Swagger UI, nodemon |

---

## Features

- **Blog platform** — Markdown editor, posts organized by category (Backend, Frontend, Full Stack, AI/ML, DevOps, Mobile, QA, Game Dev), likes and comments
- **User profiles** — follow/follower system, favorites, Cloudinary avatar upload
- **Real-time chat** — WebSocket-powered DMs with live notification delivery
- **Notifications** — async queue-backed delivery via BullMQ worker
- **Learning roadmaps** — interactive visual paths with per-layer progress tracking
- **Dev library** — curated books, docs, and guides mapped to roadmap layers
- **AI Agent** — per-user agent with persistent context (Anthropic API)
- **Coding challenges** — category-specific problem arena tied to your roadmap layer
- **Search** — cross-entity full-text search (posts, users, categories)
- **OAuth** — Google + GitHub one-click sign-in with account linking
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
# Fill in your values — see Environment Variables below
```

### Run

```bash
# Frontend + backend + Redis together
npm run dev:full

# Frontend only
npm run dev

# Backend only
nodemon backend/server.js

# Start Redis via Docker (if not already running)
npm run redis
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
npm run test:security       # Security tests
npm run test:performance    # Performance benchmarks
npm run test:concurrency    # Race-condition and concurrency tests
npm run test:unit:coverage  # Coverage report
```

---

## Project Structure

```
├── backend/
│   ├── app.js              # Express app factory
│   ├── server.js           # Entry point (HTTP + WebSocket + workers)
│   ├── config/             # DB, Redis, Cloudinary, Swagger config
│   ├── routes/             # API route definitions
│   ├── controllers/        # Route handlers
│   ├── services/           # Business logic layer
│   ├── middleware/         # Auth, rate limiting, error handling
│   ├── workers/            # BullMQ background workers
│   ├── websocket/          # WebSocket server and chat handler
│   └── tests/              # unit | integration | api | security | perf | ws
├── src/
│   ├── pages/              # Route-level page components
│   ├── components/         # Shared UI (Navbar, Search, …)
│   ├── stores/             # Zustand state (auth, profile, …)
│   ├── utils/              # Client-side helpers (sanitize, …)
│   └── routes/             # Protected route wrappers
├── constants/              # Shared constants (categories, nav items)
├── config/                 # Vitest configs per test suite
└── public/                 # Static assets
```

---

## Environment Variables

```env
# Server
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database
MONGO_URI=

# Auth
JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Redis
REDIS_URL=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email
RESEND_API_KEY=

# AI
ANTHROPIC_API_KEY=
```

---

## API Docs

Swagger UI is available at `/api-docs` when the backend is running.

---

## Roadmap

| Status | Milestone |
|---|---|
| ✅ | Community platform — blogs, profiles, follow system, real-time chat |
| ✅ | Learning roadmap — interactive visual paths with progress tracking |
| ✅ | Dev library — curated resources linked to roadmap layers |
| ✅ | AI agent — per-user agent with persistent context |
| 🔲 | Exam engine — AI-generated layer exams (90/100 to unlock next layer) |
| 🔲 | Problem solving arena — category-specific challenges tied to roadmap layer |
| 🔲 | Admin panel — user management, post moderation, analytics |
| 🔲 | Certificates — verifiable completion badges per path |

---

## Deployment

Configured for Railway (`railway.json`, `nixpacks.toml`) and Vercel (`vercel.json`) out of the box.

---

<div align="center">

*Built by Vahe — one laptop, one idea, every line of code.*

</div>
