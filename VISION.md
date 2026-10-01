# DevsWebs — Vision

> Living document. Business/product framing only — build status, phase plans, and architecture detail live in `docs/ROADMAP_BUILD_PLAN.md`, `ARCHITECTURE.md`, `BUSINESS_MODEL.md`, and `STARTUP_ADVISOR_ANALYSIS.md`.
> Last updated: 2026-09-30.

---

## 1. One-liner

DevsWebs is a learning platform for developers who want a roadmap they *earn* — server-graded exams gate every step, and a personal AI mentor guides them through it — instead of another static checklist or generic chatbot.

---

## 2. Problem

Developers learning a new stack (or breaking into one) bounce between YouTube, Stack Overflow, Udemy, and roadmap.sh. Every one of these has the same failure mode: nothing checks whether you actually understood what you consumed. You can "complete" a course, look at a roadmap, or watch a tutorial series and still not be able to do the job — and nobody, including you, finds out until an interview.

Two groups feel this acutely:

- **Self-taught / early-career developers** trying to prove they're job-ready, with no objective signal to point to besides "I built some projects."
- **Career switchers and bootcamp grads** who followed a curriculum but have no verified record of what they actually retained.

Today they solve it by grinding LeetCode (tests algorithms, not the job), collecting free certificates from freeCodeCamp (no verification of understanding), or paying for a bootcamp (expensive, fixed pace, no personalized follow-up).

---

## 3. Solution

DevsWebs turns a roadmap into a gate, not a map. Every layer is locked until you pass a server-graded exam on it; failing surfaces your specific weak spots instead of a generic score. A per-user AI mentor sits underneath the whole loop — it knows your active path, your exam history, and your weak spots, and answers Socratically (guides you to the answer, doesn't hand it over) instead of acting like a generic chatbot with no memory of your journey.

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
- **The credential trust problem is getting worse, not better.** As AI makes it trivially easy to generate a polished resume, project, or cover letter, the market signal that actually differentiates candidates shifts toward *verified, hard-to-fake proof of understanding* — which is exactly what a server-graded, AI-proctored exam record provides and a GitHub repo or a resume bullet does not.
- **Existing free platforms (freeCodeCamp, The Odin Project, roadmap.sh) have enormous audiences but no accountability layer**, leaving an open lane for a product that adds verification on top of a familiar "structured path" mental model users already trust.

---

## 6. Unique advantage (moat)

- **The verified-progression data itself.** Once developers have taken real exams on the platform, DevsWebs has a comparison baseline ("scores better than 70% of verified Layer 3 devs") that a competitor starting from zero cannot fake or shortcut — this compounds with every user who completes a layer.
- **The mentor is grounded in the learner's actual state**, not a static prompt — replicating this requires building the same tool-use loop over the same progress/exam/weak-spot data model, not just wrapping an LLM API.
- **Gated progression is a structural choice, not a feature toggle.** roadmap.sh could add exams; freeCodeCamp could add an AI tutor. Neither is likely to retrofit *earned* progression onto a free, ungated product without cannibalizing what makes them simple and low-friction today.

TODO: is there a specific technical or content asset (e.g. hand-reviewed question banks, rubric library) you consider defensible enough to call out here, or is the moat purely "the data plus the combination," as written above?

---

## 7. Business model

Freemium SaaS, expanding later into a two-sided marketplace (developers prove skills → employers pay to find them who already have).

| Tier | Price | For | Includes |
|---|---|---|---|
| Free | $0 | Anyone starting out | Community, first roadmap layers, basic progress |
| Pro | $15/month | Developers actively learning | AI mentor, full roadmap, certificates |
| Teams | $60/seat/month (3-seat minimum) | Companies onboarding developers | Progress tracking, reports, bulk certs |
| Employer Access *(future)* | $299/month | Hiring managers/recruiters | Search verified profiles + progression data |
| Featured Company *(future)* | $599/month | Actively hiring companies | Above + visibility to developers on-platform |

Pricing logic: $15/mo sits below Cursor ($20) and GitHub Copilot ($19) — the AI mentor is the cost driver (Claude API calls), and $15 covers that cost at normal usage with margin. Full reasoning and unit economics (cost per user, margin by tier, break-even scenarios) live in `BUSINESS_MODEL.md`.

The employer-facing tiers are Phase 13+ and explicitly gated on reaching 500+ verified developer profiles first — there's no employer product worth selling without a real pool of verified supply.

---

## 8. Market

TODO: no sized TAM/SAM/SOM exists yet for this document — do you want me to build one from public data (e.g. number of self-taught/bootcamp developers per year, freeCodeCamp/roadmap.sh user counts as reference points), or is there a number you already have in mind?

**First niche to win:** one path, fully proven, before anything else. The plan (see `docs/ROADMAP_BUILD_PLAN.md`) is to validate the entire loop — roadmap, exam engine, AI mentor — on the **Backend Developer** path only, with real users, before seeding the other 14 authored paths (Frontend, Full Stack, AI/ML, DevOps, Mobile, GameDev, QA, DataScience, Database, Cloud, Cybersecurity, Blockchain, Web3, Quantum, Languages). Narrow first, wide once the mechanism is proven.

---

## 9. Competitors

| Competitor | What they do | How DevsWebs differs |
|---|---|---|
| roadmap.sh | Free, static visual roadmap, 3M+ users | Ours is a *gated* path — you earn the next layer by passing a real exam, not by clicking a checkbox |
| freeCodeCamp | Free curriculum + certificates, 10M+ users | Their certificate is completion-based; ours is a verified progression record backed by graded exams and per-layer weak-spot data |
| LeetCode | Algorithm grinding, disconnected from any curriculum | Ours ties problems (and exams) to the specific layer you're actively learning, not generic DSA |
| Generic AI chatbots (ChatGPT, Gemini) | Stateless Q&A, no memory of your learning journey | Our mentor has live tools into your actual progress, exam history, and weak spots — it's grounded in your data, not just the current prompt |
| Bootcamps (e.g. general coding bootcamps) | Paid, fixed-pace, cohort-based, expensive | Self-paced, far cheaper, and the "verified outcome" bootcamps sell as their pitch is something we can generate continuously per-user instead of per-cohort |

Note: freeCodeCamp/The Odin Project are considered low competitive threat specifically because they're passive content platforms with no gating — different product category, not a head-to-head competitor for the same buying decision.

---

## 10. Traction & milestones

**What exists now (as of 2026-09-30):**
- Community platform (blogs, profiles, chat, auth) — built and live
- AI mentor backend and frontend — built and running end-to-end (streaming, tool-use loop, session persistence, cost caps)
- Roadmap UI — built, but progress is local-only, not yet backed by a server
- 15 roadmap paths authored as structured content, one (Backend) targeted for the first full loop
- Dev Library (curated resources) — nearly complete
- Zero real users yet; zero revenue yet

**Next 3 months — MVP loop:** the Backend Developer path fully wired server-side: roadmap backend, exam engine (server-graded MCQ with reviewed question banks), and the roadmap UI reading real progress instead of localStorage. Target: one real (non-founder) user completes sign-up → study → exam → pass/fail → mentor review → unlock, on production.

**Next 6 months:** MVP loop live with real users; validate Layer 1 → Layer 2 return rate; begin the Pro tier paywall once the mentor is the clear reason to upgrade.

**Next 12 months:** expand beyond one path if retention data supports it; introduce Teams tier if inbound company interest appears; hold on employer-facing tiers until verified-profile volume justifies them.

Full phase-by-phase build plan lives in `docs/ROADMAP_BUILD_PLAN.md`.

---

## 11. Metrics

The few numbers that actually define success, pulled from the unit-economics model in `BUSINESS_MODEL.md`:

- **Layer 1 → Layer 2 completion rate** — the core product-health signal; if this is low, the loop isn't working regardless of anything else.
- **MRR growth rate** — target >15%/month once paid tiers are live; below 10% is a warning sign.
- **Monthly churn** — target <5%; 5–8% is a watch condition, >8% is critical.
- **AI cost per paying user** — must stay under ~$6/month to protect margin at $15/mo pricing; monitored explicitly because a single heavy user can erase the margin on several others.
- **CAC / LTV** — target CAC <$30, LTV >$150 (at $15/mo and 5% churn, LTV ≈ $300).

---

## 12. Long-term vision

Three to five years out, DevsWebs is the verification layer between "I learned something" and "I can prove it" for developers — the platform recruiters trust the way they trust a real transcript, because every credential on it is backed by a graded exam and a mentor-observed learning history, not a self-reported claim.

That verified population is what unlocks the second half of the business: an employer-facing marketplace (search, screen, and hire against real verified progression data), screening-as-a-service for companies who want to test their own candidates through the same exam engine, and eventually per-seat licensing to bootcamps and universities who want a credible, data-backed outcomes story for their own students. All of it is downstream of one thing staying true: the credential has to mean something no one can fake. That's the whole bet.

---

## Notes & ideas (not committed, not scoped)

Longer-form speculative concepts — Collaborative Build Teams, Sponsored Real Projects, Screening-as-a-Service, University/Bootcamp Licensing, Voice AI Teach-Back — are written up in detail in `docs/FUTURE_IDEAS.md`. None of them are in scope until the MVP loop above is validated with real users; they're kept there so the idea isn't lost, not because they're next.
