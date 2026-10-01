# Vahoha (formerly DevsWebs) — Advisory Board Report

> **Update 2026-10-02:** the pre-pilot checklist in section 9 is now mostly done, billing exists (Polar, inert), event tracking exists, and the name is decided. Current status: `docs/PILOT_STATUS.md`. The sections below keep the 2026-10-01 analysis; read the status notes first.

> **Classification:** Founder-Only Strategic Document
> **Date:** 2026-10-01 (supersedes the 2026-06-03 edition)
> **Prepared by:** Virtual C-Suite Advisory Board
> **Project:** Vahoha — AI-Integrated Developer Learning Platform (homepage now brands it **Vahoha**; see Decision Log)
> **Basis:** `git log` through 2026-10-01, `backend/app.js` route mounts, `docs/ROADMAP_BUILD_PLAN.md`, `VISION.md` (2026-09-30), and a read of the services named below. Nothing here was verified by running the app or against production data, so "built" means "code exists and is mounted", not "tested with real users".

---

## Executive Summary

The June report said the risk was **last-mile paralysis**: excellent services with no routes. That is no longer true. Between June and now the learning loop was wired end to end:

- `/api/roadmaps` (progress, start path), `/api/exams` (generate, submit, teach-back, history, weak spots) and `/api/ai-agent` (7 routes, streaming, tool loop) are all mounted in `backend/app.js`.
- The frontend roadmap store now calls the API instead of localStorage.
- Beyond the plan, you also built teach-back grading, voice review, group chat, a learner-mastery/adaptive layer, and a full **coding-challenge Arena** (sandboxed grading, community proposals, XP-priced hints).

**The risk has changed shape.** It is no longer "can it be built" but two other things:

1. **Scope drift.** The Arena was explicitly *deferred* in the build plan ("do not start early because it feels fun") and was built anyway, along with several other non-loop features. This is the exact failure the June report predicted ("the scope is the risk"), in a milder form: the loop got finished, but time that could have gone to users went into features.
2. **Still zero users, zero revenue, zero analytics.** Every number in the business docs is still an assumption.

**The single most important action now:** stop adding features, run the Layer 1 → Layer 2 loop with 10 real people, and instrument it. Remaining engineering work before that is small (list in section 9).

---

## What Changed Since June

| Area | June 2026 | Now (2026-10-01) |
|---|---|---|
| Roadmap backend | Services built, no routes | Routes mounted; roadmap tracks and layers seeded into MongoDB; UI reads server progress |
| Exam engine | "Not started" | Built: 15-question banks, 10-min limit, 3 attempts/day, pass at 80, answer choices shuffled per attempt, teach-back grading |
| AI agent | 1 empty file | Built: SSE streaming, 7 tools, session CRUD, 20-turn window, 30/day cap, Zod validation |
| **AI provider** | Anthropic Claude Sonnet recommended | **Groq (`openai/gpt-oss-120b`)**, decided 2026-09-26 because Groq has a free tier. `@anthropic-ai/sdk` is not installed |
| Pass threshold | 90 (hardcoded) | 80, still hardcoded in `examEngineService.js` (not in `platformConfig`) |
| Arena / challenges | Deferred | Built (sandbox runner, catalog, proposals, hints) |
| Rate limiter | In-memory `Map`, resets on deploy | Redis counters on login when Redis is enabled; `express-rate-limit` as fallback and for signup/reset |
| Session cookie | `secure: false` | `secure: true` (`authController.js`) |
| Payments | None | Polar billing built and sandbox-verified (2026-10-01), **inert**: no route is gated, `BILLING_ENFORCED=false` |
| Analytics | None | **Built 2026-10-02:** 7 server-side events and an admin funnel (`eventService.js`). Still zero users to measure |
| Branding | Vahoha | **Decided: Vahoha** (README, docs and homepage now agree; the repo folder keeps the old name) |

---

## 1. CEO Advisor — Vision, Strategy & Priorities

**The one question that matters now:** *Will a person who is not you finish Layer 1, come back for Layer 2, and tell you what confused them?* You cannot answer it today.

**What the docs now get right.** `VISION.md` was cleaned up on 2026-09-30 and honestly states "zero real users yet; zero revenue yet". `docs/ROADMAP_BUILD_PLAN.md` holds the build detail. That separation is good. Keep it.

**What to fix.**

- **Scope discipline.** The Deferred Backlog has entry criteria for a reason. Arena, group chat and voice review all bypassed them. Re-adopt the rule: *no new feature without a user who asked for it*.
- **README still overstates.** It marks the AI agent as "persistent context" ✅ while `ROADMAP_BUILD_PLAN.md` lists cross-session memory as *not built* (Stage 7). Align it, and decide the product name first.
- **Pick the name.** Homepage says Vahoha; every strategy doc, the README and the repo say Vahoha. Decide before the first public post, because the Reddit and X audience will attach to whatever name they first see.

**CEO directive:** The loop is built. Recruit 10 users by hand, watch them, fix the top 3 problems. Nothing new gets built until that is done.

---

## 2. CTO Advisor — Architecture, Tech Debt & Scaling

### What is good

- `server.js → app.js → routes → controllers → services → MongoDB` is a clean layering, and the agent code is split into focused services (`sessionService`, `streamService`, `learnerContextService`, `teachingLogService`).
- The new `modules/coding-challenges/` folder (controllers, repositories, schemas, services, queue) is the strongest-structured part of the backend. If you want one reference for how to organize future features, it is this.
- Tests exist across unit, integration, security, concurrency, queue and websocket folders. Whether they pass currently was not checked.

### Open issues (verified against code today)

| # | Issue | Evidence | Fix |
|---|---|---|---|
| 1 | **`helmet` not installed** | `grep helmet package.json backend` returns nothing | `npm i helmet`, `app.use(helmet())`. Five minutes |
| 2 | **Cooldown disabled** | `COOLDOWN_ENABLED = false; // TEMP` in `examEngineService.js:31` | Turn back on before any user touches the exam. Without it, retry-until-pass is unlimited within the 3/day cap |
| 3 | **Pass threshold hardcoded** | `const PASS_THRESHOLD = 80` | Move to a `platformConfig` collection so you can tune it from data without redeploying |
| 4 | **`authController` calls `connectDB()` directly** (9 call sites) | `authController.js:106,152,195…` | Pass `req.app.locals.db` into services, as the newer controllers do. Low priority but it is the one inconsistency a reviewer will notice |
| 5 | **Dead dependencies** | `package.json`: `@google/generative-ai`, `mongoose`, `motion`, `@mui/*`, `openai` | `groq-sdk` is the live provider and stays (`config/groq.js`, `examSeeder.js`). `openai` is not imported anywhere in `backend/`; check `src/` then remove. `backend/config/gemini.js` and `scripts/testGemini.js` can go with the Gemini SDK |
| 6 | **Rate-limit fallback is in-memory** | `auth.routes.js:38-62`: `express-rate-limit` uses its default memory store, documented as a fallback; per-IP/per-email Redis counters take precedence when Redis is active | Fine **if Redis is enabled in production** (confirm the env flag on Railway). Signup and reset limiters are memory-only and reset on deploy; acceptable, low risk |
| 7 | **Single-process topology** | HTTP, WebSocket and BullMQ share one process; `rooms` is an in-memory Map (standing decision #4) | Fine for pilot. Revisit only on real load |

### Provider risk (new)

The Groq choice is rational for a pre-revenue solo project, but note two consequences:

- A free tier is a **development** tier. It has rate limits that a handful of simultaneous learners can hit. Budget for Groq's paid tier before the user pilot, not after.
- Groq retires models periodically (your own build plan says so). Keep `MODEL` in one place (it is: `streamService.js`) and add a startup or health check that fails loudly on a 404 from the models endpoint.
- The exam question banks were generated with the same provider (`examSeeder.js`). Banks are stored in MongoDB, so a provider change does not invalidate them. Good.

### CTO priority stack

```
Before the pilot (a day or two total):
  ├── helmet
  ├── re-enable exam cooldown
  ├── confirm Redis is on in production (rate-limit counters)
  └── paid Groq tier (or confirm free-tier limits cover ~10 concurrent users)

Before charging money:
  ├── Stripe Checkout + webhook + feature gate service
  └── platformConfig (threshold, daily caps) instead of module constants

Opportunistic:
  └── dependency cleanup, authController db injection
```

---

## 3. CFO Advisor — Cost Model, Unit Economics & Monetization

The June model assumed Claude Sonnet at about **$0.02 per interaction** and warned of $3,000/month at 500 free users. **That model no longer applies.** The agent runs on Groq's `gpt-oss-120b`, which is priced at a small fraction of Sonnet.

**Revised estimate** (Groq rates for `gpt-oss-120b` are $0.15 per million input tokens and $0.60 per million output tokens per a CloudZero summary of Groq's pricing, found 2026-10-01; confirm on groq.com before committing. The ~$0.001–0.002 per-interaction range below already holds at these rates):

| Item | Tokens | Approx. cost |
|---|---|---|
| Input per interaction (system prompt + learner context + tool results) | ~5,000 | ~$0.00075 |
| Output per interaction | ~600 | ~$0.00045 |
| **Per interaction** | | **~$0.001–0.002** |
| Worst-case Pro user at the 30 msg/day cap | 900 msgs/month | **~$1–2/month** |
| 500 free users × 10 msgs/day | 150,000 msgs/month | **~$150–300/month** |

Three things follow:

1. **AI cost is no longer the margin risk.** The "$6/month per user" cap in the business model is conservative by a wide margin. The real constraint is Groq rate limits and reliability, not dollars.
2. **Gross margin on Pro is much higher than the 67–71% in the June table**, possibly 90%+ before Stripe fees. Treat that as an upside to confirm with real usage, not a plan.
3. **Pricing should be re-examined.** The $15/month price was justified as "covers Claude API calls, below Cursor and Copilot". With cheap inference that argument is gone, and the ICP (self-taught developers, many in price-sensitive regions) may convert better at a lower price or with regional pricing. See Decision Log.

**What is still missing:** any billing code. There is no Stripe integration, no subscription state and no feature gate. The paywall is a hypothesis with zero implementation.

---

## 4. CPO Advisor — Product, PMF & North Star Metric

**North Star (unchanged):** the share of registered users who complete Layer 1 within 30 days. Companion metric: **Layer 1 → Layer 2 return within 7 days**.

**The product loop exists; no one has measured it.** There are no events being recorded. Wire the five events below before the pilot, because the pilot is pointless without them:

```
signup · path_selected · layer_opened · exam_started · exam_submitted{score,passed}
· mentor_message_sent · return_visit
```

One `userEvents` collection and a 20-line helper is enough.

**Pass threshold.** 80 is a better starting point than the 90 in the June docs, and `BUSINESS_MODEL.md` still referenced 90/100 until this update. Keep it configurable. Review the first 20 attempts by hand: if everyone passes, the bank is too easy; if almost no one does, the bank is wrong more often than the learners are.

**Question-bank quality is the credibility risk.** The bank was LLM-generated (`examSeeder.js`); your own plan says "review once by hand". Confirm that review happened. A wrong answer key on a gated exam is the fastest way to turn the "earn it" promise into "this is broken" on Reddit.

**Features that are ahead of demand.** Arena, group chat, voice review and the adaptive-mastery layer all work toward a product larger than the MVP. Keep them in the codebase, but don't promote them in launch messaging. The launch story is one sentence: *pass the exam to unlock the next layer; an AI mentor helps when you fail*.

---

## 5. CMO Advisor — Positioning, ICP & Distribution

The ICP (**Keanu**, 24, self-taught, in the job gap) and positioning are still right. The detailed channel plan lives in `GROWTH_PLAYBOOK.md`, which was refreshed alongside this report.

Two changes:

- **Name first.** Do not start build-in-public under one name and ship under another.
- **There is now something to show.** June's advice ("don't post on Reddit before you have something real") has a different answer today: the loop exists, so recruiting can start as soon as the pre-pilot fixes in section 9 are done.

---

## 6. COO Advisor — Execution Cadence & Build Order

The June build order (roadmap → agent → exam) was followed and is complete. The next order is:

| Priority | Work | Done when |
|---|---|---|
| **1** | Pre-pilot hardening (section 9) | helmet, cooldown, limiter store, Groq tier |
| **2** | Event instrumentation | 7 events recorded in MongoDB |
| **3** | Pilot: 10 hand-recruited users | You have watched ≥ 5 sessions and logged where they stalled |
| **4** | Fix top 3 pilot issues | — |
| **5** | Stripe + feature gate | Only if ≥ 5 of 10 returned for Layer 2 |

Keep the weekly log. If "what did I learn from users this week" is still "nothing" next Sunday, that is the blocker, not the code.

---

## 7. CISO Advisor — Security Posture & Gaps

| Control | Status (2026-10-01) |
|---|---|
| Password hashing, reset flow, JWT middleware, OAuth link flow | ✅ (unchanged, still solid) |
| Session cookie `secure` flag | ✅ Fixed (`secure: true`) |
| Rate limiting on login / signup / reset | ✅ Present. Redis counters primary, in-memory fallback. ⚠️ Confirm Redis is enabled in production |
| WebSocket room-join authorization | ✅ Fixed (re-verified in the build plan 2026-09-26) |
| Notification worker Redis auth | ✅ Fixed |
| Input validation | ✅ Zod on agent and new routes; ⚠️ legacy community routes unvalidated (accepted per decision #8) |
| **HTTP security headers (`helmet`)** | ❌ Not installed |
| **Prompt injection (agent)** | 🔧 Partially: attached files are fenced and the Socratic refusal was tested live. Add: never place another user's data in context, log agent traffic, and run the `ai-security` skill against `streamService.js` |
| **Exam integrity** | ✅ Answer keys stay server-side (`examEngineService.js:156-157` strips `answerIdx` before responding) and choices are shuffled per attempt. Remaining gap: `submit` returns `correctAnswer` per question, which is fine post-submit but means a retried exam reveals the bank over attempts; the 3/day cap and cooldown are what limit that |
| **Coding sandbox** | ⚠️ Server-side grading of user code (`runnerService.js`) is the highest-risk new surface in the repo. It needs its own threat model: resource limits, network isolation, filesystem access. Not reviewed here |
| JWT in localStorage | Accepted tradeoff until the credential/profile launch |

---

## 8. CHRO Advisor — Solo Founder Operating Model

The first-hire advice stands: the thing to hand off first is **curriculum content**, not engineering. The bigger risk this quarter is different: you finished the hard engineering and are about to face the part that feels worse — asking strangers to use it.

Practical guardrails:

- Time-box building to ~50% of the week until the pilot has run.
- Treat the DMs in `GROWTH_PLAYBOOK.md` as a daily task with a number (5 a day), not a mood.
- Building in public is still the accountability mechanism. Start it the day the name is chosen.

---

## 9. The Critical Path — Pre-Pilot Checklist

The June "8-day MVP loop" is done. The remaining path is short:

```
[x] Decide product name (Vahoha); README, title and docs now agree
[x] helmet mounted in app.js
[x] COOLDOWN_ENABLED = true (30 min after a failed attempt)
[ ] Confirm Redis is enabled in production (auth rate-limit counters depend on it)
[ ] Seed Backend Layers 1-3 and hand-check every exam question (new ones are flagged reviewed:false)
[ ] Groq: move off free tier or confirm limits for ~10 concurrent users
[x] Record 7 core events (userEvents) + admin funnel (GET /api/admin/funnel)
[x] Rate-limit the LLM routes (mentor stream, teach-back)
[ ] Make yourself admin (npm run admin:grant) and run the full loop on production as a fresh account
[ ] Recruit users: 15 interviews + $29 payment test (docs/OUTREACH_KIT.md)
```

---

## 10. Decision Log — What to Decide This Week

| Decision | Options | Recommendation | Status |
|---|---|---|---|
| **Product name** | Vahoha / Vahoha | **Vahoha.** README, docs and homepage agree | Decided |
| **AI provider** | Groq / Anthropic | Groq stays for now (cost, decided 2026-09-26). Revisit if answer quality on the Socratic constraint disappoints pilot users | Decided |
| **Exam pass threshold** | 90 / 80 / configurable | 80, move to `platformConfig` | Partly done |
| **Free-tier AI limit** | 15 / 30 per day | 30/day is live; keep, it costs pennies | Decided |
| **Pro price** | $15 / $9 / regional | Hypothesis only. Test after the pilot; cost no longer forces $15 | Open |
| **Paywall placement** | Layer 3 / later | Layer 3 until data says otherwise; **don't build Stripe until ≥5 of 10 pilot users return** | Open |
| **Arena / group chat / voice review** | Keep building / freeze | Freeze. Maintain only | Recommended |

---

## Appendix — Files Referenced

| File | Note |
|---|---|
| `backend/app.js` | Mounts `/api/ai-agent`, `/api/roadmaps`, `/api/exams`, `/api/challenges` |
| `backend/services/examEngineService.js` | `PASS_THRESHOLD = 80`, `COOLDOWN_ENABLED = true`, 3 attempts/day, 15 questions, 600 s |
| `backend/services/agent/sessionService.js` | `MAX_TURNS = 20`, `DAILY_MESSAGE_CAP = 30` |
| `backend/services/agent/streamService.js` | Holds `MODEL` (Groq) |
| `backend/seeders/examSeeder.js` | Generates banks with Groq `openai/gpt-oss-120b` |
| `backend/controllers/authController.js` | `secure: true`; still calls `connectDB()` directly |
| `backend/routes/auth.routes.js` | Redis counters + `express-rate-limit` fallback on login/signup/reset |
| `docs/ROADMAP_BUILD_PLAN.md` | Source of truth for build status |
| `VISION.md` | Business/product framing, last updated 2026-09-30 |

---

*Refreshed 2026-10-01. The June edition's CTO bugs 2 and 3 are fixed, its build order is complete, and its cost model is obsolete. Update this document after the pilot, when real numbers replace the assumptions above.*
