# Vahoha (formerly DevsWebs) — Vision

> Living document. Business/product framing only — build status, phase plans, and architecture detail live in `docs/ROADMAP_BUILD_PLAN.md`, `ARCHITECTURE.md`, `BUSINESS_MODEL.md`, and `STARTUP_ADVISOR_ANALYSIS.md`.
> Last updated: 2026-10-02. Corrected against the code and against `docs/STARTUP_CRITIQUE_2026-10.md`: exam-integrity and "no competitor" claims were overstated, traction and billing status were stale.

---

## 1. One-liner

Vahoha is a learning platform for developers who want a roadmap they *earn* — server-graded exams gate every step, and a personal AI mentor guides them through it — instead of another static checklist or generic chatbot.

---

## 2. Problem

Developers learning a new stack (or breaking into one) bounce between YouTube, Stack Overflow, Udemy, and roadmap.sh. Every one of these has the same failure mode: nothing checks whether you actually understood what you consumed. You can "complete" a course, look at a roadmap, or watch a tutorial series and still not be able to do the job — and nobody, including you, finds out until an interview.

Two groups feel this acutely:

- **Self-taught / early-career developers** trying to prove they're job-ready, with no objective signal to point to besides "I built some projects."
- **Career switchers and bootcamp grads** who followed a curriculum but have no verified record of what they actually retained.

Today they solve it by grinding LeetCode (tests algorithms, not the job), collecting free certificates from freeCodeCamp (no verification of understanding), or paying for a bootcamp (expensive, fixed pace, no personalized follow-up).

---

## 3. Solution

Vahoha turns a roadmap into a gate, not a map. Every layer is locked until you pass a server-graded exam on it; failing surfaces your specific weak spots instead of a generic score. A per-user AI mentor sits underneath the whole loop — it knows your active path, your exam history, and your weak spots, and answers Socratically (guides you to the answer, doesn't hand it over) instead of acting like a generic chatbot with no memory of your journey.

The mechanism, end to end:

```
Pick a path → study a layer (curated posts/library) → take the layer exam
   → PASS → next layer unlocks
   → FAIL → weak spots recorded → ask the AI mentor → targeted review → retry
```

The AI mentor is not a bolt-on chat widget — it has live tools into your actual progress, exam history, and weak spots, so its answers are grounded in what you specifically struggled with, not a canned response to your question text alone.

---

## 4. Target users

**Primary persona:** self-taught or early-career developers (roughly 0–3 years experience) who are actively upskilling and want something they can point to that isn't just "I read some docs" — they're motivated, but they lack an accountability structure and an honest signal of their own gaps.

**Early adopters:** developers already in the habit of using roadmap.sh, freeCodeCamp, or LeetCode to structure their own learning — they've already proven they'll self-direct their study, they just don't have a tool that verifies the outcome. Community-first channels (Reddit's r/learnprogramming, r/cscareerquestions, dev Discord/Twitter) are the natural first audience.

---

## 5. Why now

- **LLMs make a real 1:1 mentor economically possible for the first time.** A tool-use agent with live access to a learner's actual data (not a static prompt) was not affordable or buildable as a solo project even two years ago; API pricing and tool-calling maturity make it viable now.
- **The credential trust problem is getting worse, not better.** As AI makes it trivially easy to generate a polished resume, project, or cover letter, the market signal that actually differentiates candidates shifts toward *verified, hard-to-fake proof of understanding* — which is what a graded exam record can provide and a GitHub repo or a resume bullet does not. **Caveat (2026-10-02):** today's exam is multiple choice, which an LLM can answer, and it has no proctoring, so it works as practice and self-diagnosis, not as proof. The spoken teach-back exam is the planned credential (`docs/VOICE_EXAM_SPEC.md`); until it exists, nothing here should be pitched as "verified" or "hard to fake" (`docs/EXAM_INTEGRITY.md`).
- **Existing free platforms (freeCodeCamp, The Odin Project) have enormous audiences but no accountability layer**, leaving room for a product that adds verification on top of a familiar "structured path" mental model. **The lane is narrower than it looked in September:** roadmap.sh now sells an AI tutor with quizzes (about $10/month), and Boot.dev already sells gamified, gated backend learning (see section 9).

---

## 6. Unique advantage (moat)

**Honest assessment (2026-10-02): there is no moat yet.** What exists is a head start and three candidates for one.

- **Gated progression is copyable.** It is a design choice, not a technology. roadmap.sh or Boot.dev could add stricter gating in a sprint. The reasoning that they "won't retrofit it" is a guess, not evidence.
- **The mentor grounded in the learner's state** (live tools into progress, exam history, weak spots, mastery) took real work, but it is the same tool-use loop any competitor with an LLM and a progress table can build.
- **The verified-progression data** is a real moat only with thousands of graded learners and a credential nobody can fake. Today there are zero users and the multiple-choice exam can be faked.
- **The one asset that compounds is calibrated rubrics:** hand-written, human-validated grading criteria for spoken teach-back, checked against human graders. Calibration takes expert time that big players are slow to spend per topic. It has not been started beyond a spec and four sample rubrics.
- **Distribution is the real moat in this market,** and roadmap.sh and freeCodeCamp already own it.

## 7. Business model

Freemium SaaS, expanding later into a two-sided marketplace (developers prove skills → employers pay to find them who already have).

| Tier | Price | For | Includes |
|---|---|---|---|
| Free | $0 | Anyone starting out | Community, first roadmap layers, basic progress |
| Pro | $15/month | Developers actively learning | AI mentor, full roadmap, certificates |
| Teams | $60/seat/month (3-seat minimum) | Companies onboarding developers | Progress tracking, reports, bulk certs |
| Employer Access *(future)* | $299/month | Hiring managers/recruiters | Search verified profiles + progression data |
| Featured Company *(future)* | $599/month | Actively hiring companies | Above + visibility to developers on-platform |

Pricing logic: the original reasoning ("below Cursor and Copilot, covers Claude API cost") no longer holds. The mentor runs on Groq `gpt-oss-120b`, a heavy user costs roughly $1–2/month, so price is a **willingness-to-pay question, not a cost question**, and roadmap.sh Pro is about $10. $15 is a hypothesis to test with a $29 early-access payment (`docs/OUTREACH_KIT.md`). Billing exists (Polar, sandbox-verified) but is switched off: everything is free during the pilot. Unit economics live in `BUSINESS_MODEL.md`.

The employer-facing tiers are Phase 13+ and explicitly gated on reaching 500+ verified developer profiles first — there's no employer product worth selling without a real pool of verified supply.

---

## 8. Market

TODO: no sized TAM/SAM/SOM exists yet for this document — do you want me to build one from public data (e.g. number of self-taught/bootcamp developers per year, freeCodeCamp/roadmap.sh user counts as reference points), or is there a number you already have in mind?

**First niche to win:** one path, fully proven, before anything else. The plan (see `docs/ROADMAP_BUILD_PLAN.md`) is to validate the entire loop — roadmap, exam engine, AI mentor — on the **Backend Developer** path only, with real users, before seeding the other 14 authored paths (Frontend, Full Stack, AI/ML, DevOps, Mobile, GameDev, QA, DataScience, Database, Cloud, Cybersecurity, Blockchain, Web3, Quantum, Languages). Narrow first, wide once the mechanism is proven.

---

## 9. Competitors

| Competitor | What they do | How Vahoha differs |
|---|---|---|
| roadmap.sh | Visual roadmaps, 3M+ users, **now with an AI tutor, generated courses and quizzes (about $10/month)** | Ours is a *gated* path with a mentor tied to your weak spots. They are bigger, cheaper and already have the audience |
| Boot.dev | Gamified, gated backend path with XP, quests and streaks | Our edge would be verified understanding rather than gamified completion. It is the closest competitor in the chosen niche |
| HackerRank (AI interviewer), CodeSignal | AI-assisted, rubric-graded developer assessment, sold to employers | They serve the employer side; a learner-side practice and verification product is adjacent, and they could extend into it |
| freeCodeCamp | Free curriculum + certificates, 10M+ users | Their certificate is completion-based; ours is a verified progression record backed by graded exams and per-layer weak-spot data |
| LeetCode | Algorithm grinding, disconnected from any curriculum | Ours ties problems (and exams) to the specific layer you're actively learning, not generic DSA |
| Generic AI chatbots (ChatGPT, Gemini) | Stateless Q&A, no memory of your learning journey | Our mentor has live tools into your actual progress, exam history, and weak spots — it's grounded in your data, not just the current prompt |
| Bootcamps (e.g. general coding bootcamps) | Paid, fixed-pace, cohort-based, expensive | Self-paced, far cheaper, and the "verified outcome" bootcamps sell as their pitch is something we can generate continuously per-user instead of per-cohort |

Note: freeCodeCamp/The Odin Project are lower threat because they are passive content with no gating, but they anchor willingness to pay at zero. roadmap.sh and Boot.dev are the real head-to-head competitors.

---

## 10. Traction & milestones

**What exists now (as of 2026-10-02):**
- The full learning loop is built and mounted: roadmap with server-side progress, exam engine (server-graded, answer keys server-side, shuffled and unseen-first questions, cooldown), AI mentor with tools into learner state, mastery map, teach-back (one-topic slice)
- Community platform (blogs, profiles, chat, auth); blog posts can be tagged to roadmap layers and appear in the layer drawer
- Coding Arena with sandboxed grading and community proposals
- Billing built on Polar and verified in sandbox; **not enforced**, everything is free
- Pilot analytics: 7 server-side events and an admin funnel
- 15 roadmap categories authored; exam-bank generator built, but banks still have to be seeded and hand-checked for the first track
- **Zero real users, zero revenue, zero interviews with target users**

**Next 90 days:** no new features. Hand-seed and check Backend Layers 1–3, run 15 interviews with self-taught backend developers, ask each for a $29 early-access payment, run the Wizard-of-Oz oral exam by hand, and read the funnel weekly. Day-60 gate and kill criteria are in `docs/STARTUP_REVIEW_2026-10.md` §8–9 and `docs/OUTREACH_KIT.md`.

**If the tests pass:** widen to 50 users on one path, then decide between B2C and instructor-led cohorts (bootcamps and universities) from the data. **If they fail:** treat the project as a portfolio piece; that outcome should be agreed before the experiment starts.

Build status lives in `docs/PILOT_STATUS.md` and `docs/ROADMAP_BUILD_PLAN.md`.

---

## 11. Metrics

The few numbers that actually define success, pulled from the unit-economics model in `BUSINESS_MODEL.md`. The first one is measured by the pilot funnel (`GET /api/admin/funnel`); the rest need paying users and are unmeasured:

- **Layer 1 → Layer 2 completion rate** — the core product-health signal; if this is low, the loop isn't working regardless of anything else.
- **MRR growth rate** — target >15%/month once paid tiers are live; below 10% is a warning sign.
- **Monthly churn** — target <5%; 5–8% is a watch condition, >8% is critical.
- **AI cost per paying user** — about $1–2/month for a heavy user on Groq (estimate, from third-party rate data); alarm at ~$3. A looping tool-use bug can still spike one session.
- **CAC / LTV** — target CAC <$30, LTV >$150 (at $15/mo and 5% churn, LTV ≈ $300).

---

## 12. Long-term vision

Three to five years out, Vahoha is the verification layer between "I learned something" and "I can prove it" for developers — the platform recruiters trust the way they trust a real transcript, because every credential on it is backed by a graded exam and a mentor-observed learning history, not a self-reported claim.

That verified population is what unlocks the second half of the business: an employer-facing marketplace (search, screen, and hire against real verified progression data), screening-as-a-service for companies who want to test their own candidates through the same exam engine, and eventually per-seat licensing to bootcamps and universities who want a credible, data-backed outcomes story for their own students. All of it is downstream of one thing staying true: the credential has to mean something no one can fake. That's the whole bet.

---

## Notes & ideas (not committed, not scoped)

Longer-form speculative concepts — Collaborative Build Teams, Sponsored Real Projects, Screening-as-a-Service, University/Bootcamp Licensing, Voice AI Teach-Back — are written up in detail in `docs/FUTURE_IDEAS.md`. None of them are in scope until the MVP loop above is validated with real users; they're kept there so the idea isn't lost, not because they're next.
