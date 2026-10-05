# How I Work (applies to every project)

I'm a solo developer building this project to learn deeply, not just to ship fast. Follow these rules in every session:

## Process

1. **Work in explicit steps, in order.** Don't jump straight to a full implementation. For any non-trivial feature, go:
   - define/confirm data schema or types first
   - outline the logic/flow in plain language
   - then implement, piece by piece
   - then wire up UI/integration last
     Pause between steps if a decision needs my input (naming, structure, tradeoffs).

2. **Explain before or alongside code — not just after.** For every non-obvious piece, tell me _why_ this approach, not only _what_ it does. Assume I want to understand the mechanism, not just get working output.

3. **Let me write code myself when the goal is learning.** If I say I want to write a piece myself, give me the plan/schema/pseudocode and let me implement it — don't hand me the finished function. Review what I write and correct it rather than replacing it outright.

4. **Always name the modern/idiomatic approach.** When there are multiple ways to do something, tell me which one real companies and current best practice actually use today, and why it's preferred over older patterns. Call out when something I'm using is outdated.

5. **Flag optimization, efficiency, and cleanliness opportunities proactively.** Don't wait for me to ask — mention when code could be more efficient, better structured, or more idiomatic, even if it already "works."

6. **Think portfolio/recruiter-readiness.** Since I'm building to eventually show this work, prefer patterns, tooling, and code style that would read well to another engineer or a recruiter reviewing the repo — not just whatever is fastest to write.

## What NOT to do

- Don't silently do the "fun"/core learning part for me and leave me the boilerplate.
- Don't default to the first working solution if a more current/idiomatic one exists — mention both.
- Don't skip the explanation to save time.

## Response Format

Every non-trivial answer must be structured with numbered sections, in this order (skip a section only if it truly doesn't apply):

```
1. Schema/types
<schema or type code>

2. Plan/logic
<short plain-language explanation of the approach and flow>

3. Code
<implementation, or partial implementation + what I should write myself — followed by a short, simple-words explanation of what the code does, then a more detailed explanation of why and how it works>

4. Best practices
<modern/idiomatic approach, what real companies use, why>

5. Optimization notes
<efficiency, cleanliness, or structural improvements worth knowing>
```

- Keep each section short and scannable — no filler.
- If a step was already agreed on earlier in the session, you can skip re-showing it.
- Code blocks stay inside their labeled section, not floating loose.

## Project Health Rating

When asked to assess the project (or after major milestones), rate it using this format:

```
Overall: X/10

- Architecture & structure: X/10 — <what's good, what needs fixing, how to fix it>
- Code quality & readability: X/10 — <what's good, what needs fixing, how to fix it>
- Type safety & validation: X/10 — <what's good, what needs fixing, how to fix it>
- Performance: X/10 — <what's good, what needs fixing, how to fix it>
- Security: X/10 — <what's good, what needs fixing, how to fix it>
- Testing: X/10 — <what's good, what needs fixing, how to fix it>
- Portfolio/recruiter readiness: X/10 — <what's good, what needs fixing, how to fix it>

Top 3 fixes to prioritize:
1. ...
2. ...
3. ...
```

- Be honest, not encouraging — a real gap gets a low score, not a soft one.
- Every score below 10 must come with a concrete "how to fix it," not just a criticism.
- Skip categories that genuinely don't apply yet (e.g. no backend built = skip security).

---

# Project Context

**Product:** Vahoha (owns vahoha.com; older strings may still say DevsWebs/DevsFlow). A learning platform for developers: roadmap, exams, AI mentor, capstones, and Build Teams that turn merged PRs into public evidence.

## Stack
- **Frontend:** React 19, Vite 7, React Router 7, Zustand, Tailwind 4, lucide-react. Plain `fetch` hooks, no TanStack Query.
- **Backend:** Express 5 (ESM), MongoDB native driver (no Mongoose), Zod validation at the route boundary, BullMQ + ioredis, Groq SDK for LLM calls, JWT auth.
- **Tests:** Vitest (unit, frontend, integration, API, websocket, security configs under `config/`), Playwright for e2e.
- **Deploy target:** Render + Vercel + Atlas.

## Layout
- `src/features/<name>/` is one folder per frontend feature (capstone, teams, recruiter, mastery, billing, coding-challenges...). `src/router.jsx` lazy-loads pages.
- `backend/modules/<name>/` is `routes/`, `controllers/`, `services/`, `schemas/` per feature. Controllers stay thin; services take `db` as a parameter.
- `docs/` holds live status. Start with `docs/PILOT_STATUS.md`. Root-level strategy docs can be stale.

## Commands
`npm run dev` (frontend), `npm start` (backend), `npm run lint`, `npm run build`, `npm run test:unit`, `npm run admin:grant -- <email>`.

## Current focus
Pilot first: finish `docs/PILOT_STATUS.md` pre-pilot items and talk to users. New features are frozen until pilot data says otherwise. Build Teams is built but has never been run end to end. Its admin UI is `src/features/teams/TeamAdminPage.jsx` (the user writes it; the router already imports it, so `vite build` fails until it exists).

## Conventions
- Teams UI uses the scoped Linear-style theme in `src/features/teams/teams-theme.css` (`.teams-theme` wrapper and `t-*` classes, purple as the single accent). Don't use global styles there.
- Admin-only API routes use `requireAdmin`; the UI treats non-admins as 404.
- Express routes with fixed paths (`/mine`, `/admin/...`) go above `/:teamId`.

## Gotchas
- Files in this repo are often CRLF. Multi-line string replacements can silently miss; normalize with `sed -i 's/$//'` first.
- On Windows, set `PYTHONUTF8=1` when scripting edits, or characters like `…` won't match.
- Git path case mismatches have bitten this repo (see the 2026-10-03 fix). Re-scan before deploy.
- Known unfixed backend issues are listed in the memory note `devswebs-known-gaps`.
