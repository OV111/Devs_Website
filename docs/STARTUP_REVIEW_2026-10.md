# Vahoha (formerly DevsWebs) — Startup Review, October 2026

> **Date:** 2026-10-01 · **Reviewer stance:** skeptical YC-partner style, written to be useful rather than kind.
> **Founder context taken from your brief:** solo, junior, also job-hunting, zero users, zero revenue.
>
> ### How this was produced (and its limits)
>
> - **Read:** `docs/strategy/VISION.md` (repo root, not `docs/`), `docs/strategy/BUSINESS_MODEL.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP_BUILD_PLAN.md`, `docs/FUTURE_IDEAS.md`, `docs/VOICE_EXAM_SPEC.md`, `docs/strategy/STARTUP_ADVISOR_ANALYSIS.md`, plus the backend route mounts, exam/agent services and `git log`. I did **not** run the app, and I have no user or usage data, because none exists.
> - **`docs/strategy/STARTUP_ADVISOR_ANALYSIS.md` is not an independent opinion.** I (Claude) edited it earlier today to bring its status claims up to date. This review challenges several of its recommendations; see §"Where I'm overturning the previous opinion".
> - **Plugins.** The Product Management plugin (`competitive-brief`, `product-brainstorming`, `metrics-review`, `roadmap-update`) is installed on disk (v1.2.0) but **not loaded into this session**, because plugins load at startup. I followed the `competitive-brief` structure by hand. **No `market-researcher` skill exists** in any installed marketplace, and I found no dedicated positioning/ICP skill in the Product Management plugin (the separate `marketingskills` marketplace has `product-marketing` and `customer-research`, also not loaded). Restart Claude Code and rerun if you want those invoked formally.
> - **Market claims are cited** `[S#]` with a source list at the end. Several junior-job-market statistics come from low-quality aggregator blogs whose numbers disagree (50–73% declines). Treat them as *direction, not magnitude*.
> - Everything labelled **"my judgment"** is a threshold or opinion, not an industry fact.

---

## 1. Verdict

You have built, alone, the engineering of a product that many funded teams would take a year to build, and you have **no evidence that anyone wants it**. The idea (earn each roadmap layer by passing a server-graded exam, with a mentor that knows your weak spots) is coherent but **no longer unique**: roadmap.sh now sells an AI tutor with quizzes for $10/month to 3.2M learners [S1][S2], Boot.dev sells gamified backend learning at a price point above yours [S3], and voice-based, rubric-graded AI interviews are now a shipped HackerRank product [S5] and the core of two higher-ed startups [S6][S7]. The one thing that still looks differentiated is the **rubric-verified spoken teach-back exam**, and that is exactly the piece that is a nine-phase spec with zero code, needs hours of human-authored content per layer, and must be calibrated against human graders before anyone should trust it. The honest state is: **a strong portfolio project and a plausible startup hypothesis, with the startup part untested.** The next 90 days should be spent finding out whether anyone will pay (individuals or an institution) using the cheapest possible tests, *not* building the next feature.

---

## 2. Top 3 strengths

1. **The engineering is real and unusually complete for a solo junior.** Roadmap routes, exam engine (server-side keys, shuffled choices, attempt limits), a tool-using mentor with session persistence, Zod validation, tests across unit/integration/security/concurrency folders. The cost to *get a pilot running* is small. (Evidence: `backend/app.js` mounts; `examEngineService.js` strips `answerIdx` before responding.)
2. **Your AI cost structure is almost irrelevant, which removes the usual B2C-AI killer.** At verified Groq rates ($0.15/M input, $0.60/M output for `gpt-oss-120b`; Whisper turbo $0.04/audio-hour [S13]), a chat message is roughly $0.001 and a graded voice exam is on the order of cents (your spec estimates $0.08–0.09 with two stronger grading runs). Your constraint is **users and trust**, not margin.
3. **You've correctly identified the right *kind* of differentiation: evidence over content.** "Prove you understood" is a real and growing need: professors are adopting oral exams specifically because AI broke written assessment [S8], and employers are automating voice screens [S5]. You are pointed at a true trend. (Whether *you* can capture it is a different question; see problems.)

---

## 3. Top 5 problems, ranked by severity

### P1 — No demand evidence at all, and the plan to get it is too weak *(fatal if unaddressed)*
Zero users, zero conversations logged, zero events recorded. Four months of commits since the June advice to "recruit 10 users" went into the Arena, group chat, voice review scaffolds and a rebrand. Every number in `docs/strategy/BUSINESS_MODEL.md` is an assumption. The earlier plan's success bar ("≥5 of 10 hand-recruited users return for Layer 2") is also **too weak**: ten hand-picked, polite users returning is not evidence anyone will pay.

### P2 — The "no one has AI + roadmap + exams" claim is stale; differentiation has shrunk to the voice teach-back
Your docs (including the one I edited today) still lean on "nobody combines gated progression + AI mentor + verified profile." Today: roadmap.sh has an AI tutor with generated courses, quizzes and unlimited chat at $10/month (3.2M active learners claimed) [S1]; Boot.dev is a gamified, backend-focused, XP/quest-gated product with 1M+ students claimed [S3]; CodeSignal's Cosmo does adaptive AI tutoring [S4]. *Gating* is a design choice anyone can copy; the data moat requires users you don't have. See §7.

### P3 — Scope: the product is far bigger than the loop, and the *spec'd* next step is bigger still
Built beyond the MVP loop: Arena with a server-side code-execution sandbox, community challenge proposals, group chat, voice-review scaffolds, 15 authored paths (exam banks reportedly exist for only 4 backend tracks, per `VOICE_EXAM_SPEC.md` F10). The voice exam spec is nine phases, ~2–3 hours of rubric authoring per layer, a 30-transcript calibration set (κ ≥ 0.7) before any hard gate, and it depends on billing that doesn't exist (its own finding F2). For one junior founder who is also job-hunting, that is a year of work before the first user feedback on the thing that makes you different.

### P4 — The buyer for the long-term story doesn't exist yet, and the B2C buyer is price-anchored by free
The employer-credential thesis needs employers to trust a credential from an unknown platform, in a market where entry-level hiring has contracted [S11]. Fewer junior openings means *more* need to prove skill, but also fewer employers with junior budgets, and learners with less money. On the B2C side, your closest substitutes are free (freeCodeCamp [S10], The Odin Project, roadmap.sh's free tier) or cheap ($10 roadmap.sh [S1], ~$15–20 Codecademy [S16]), and the *gate* is a feature many learners actively dislike: a paid product that blocks you from the next lesson is a harder sell than one that helps you. Nobody has told you they'd pay for the gate.

### P5 — Credibility risks inside the product itself
(a) Exam banks are LLM-generated; human review of answer keys is **unconfirmed**. A wrong key on a gated exam is a trust-destroying bug with exactly your audience. (b) The mentor runs on an open-weight model chosen for cost; one Socratic-refusal test passed, which is not a quality bar. (c) The spoken-exam fairness problem (accent, STT errors on jargon) is the product-defining risk by your own spec's admission. (d) Mid-stream rebrand (homepage says Vahoha, docs say DevsWebs) before a single outside user has seen either.

---

## 4. Evaluation against your ten questions

### 4.1 Problem: real, painful, will people pay?
- **Real:** yes. Developers can't prove what they know; AI makes written proof cheap to fake. Professors adopting oral exams [S8] and HackerRank launching an AI voice interviewer [S5] both show the verification problem is being paid for, **but by institutions and employers, not by self-taught learners**.
- **Painful enough for a self-taught learner to pay $15/month?** Unknown. The evidence in your repo is your own persona ("Keanu"), written by an AI advisor, not a real person you spoke to. No interview, survey, or Reddit thread in the docs shows someone saying "I'd pay for this."
- **Junior job market context:** postings and hiring for entry-level developers have fallen sharply since 2022 by most accounts, but magnitudes vary widely across low-quality sources (25%–73%) [S11]. Direction is credible; numbers are not. It cuts both ways (§P4).

### 4.2 Target user: too broad?
The persona is specific (self-taught, 18 months in, 12 applications, 2 screens, no offers). The **docs** are not: the platform serves 15 paths, blog readers, community chatters, Arena grinders, plus future employers, teams and universities. Pick one: *self-taught backend developers who have been applying for 3+ months without offers.* That is a findable person (r/cscareerquestions, r/learnprogramming [S14], Discords [S15]) and the only one whose pain the gated-exam-plus-weak-spots loop addresses directly.

### 4.3 Product: is roadmap → exam → mentor → voice teach-back the right MVP?
**Roadmap → exam → mentor is the right MVP, and it's built. Voice teach-back is not part of the MVP; it is the next hypothesis.** Reasons: it's the differentiator, but it's unvalidated, expensive to author, risky on fairness, and blocked on missing infrastructure. Test the *idea* of an oral exam with a **Wizard-of-Oz** version first: run 5–8 live oral teach-back sessions over Zoom using your draft rubric for one layer, graded by you. That tests whether learners find it valuable and fair, and whether your rubric produces defensible grades, without building audio, STT, state machines or calibration dashboards.

### 4.4 Built vs needed: what doesn't serve the loop?

| Built | Serves the MVP loop? | Recommendation |
|---|---|---|
| Roadmap routes + UI, exam engine, mentor, weak spots, mastery | **Yes** | Continue; harden |
| Blogs, follows, notifications, profile | No (but it's the original product and costs nothing to leave running) | **Freeze**, don't extend |
| Group chat, 1:1 chat (WebSocket) | No | **Freeze**; it's also a scaling and moderation liability |
| Arena + code-execution sandbox + community proposals | No | **Freeze**; review `runnerService.js` security before any public traffic (code execution is the biggest attack surface in the repo) |
| 11 of 15 path JSONs without exam banks | No | **Pause**; Backend only |
| `voiceReview*` empty scaffolds | No | Delete or leave; don't build |
| Teach-back (one topic, JWT) | Partially: it's a prototype of the real hypothesis | Keep as a demo for Wizard-of-Oz tests |
| Rebrand to Vahoha | No | **Finish or revert today**; don't half-live in two names |

### 4.5 Differentiation / moat vs. named competitors
See §7. Short version: **no moat today**; a possible future moat in *validated, human-calibrated rubrics* plus *a population of graded learners*, both of which require users and months of authoring you haven't started.

### 4.6 Business model: who pays first? Is B2B-edu faster than B2C?
- **B2C $15:** plausible but unproven; roadmap.sh Pro is $10 with AI quizzes [S1]; Codecademy Plus/Pro $14.99–$19.99 (annual) [S16]; Scrimba Pro about $24.50/month annual [S16]; Boot.dev about $59/month or $399/year per review sites [S3]; CodeSignal's Cosmo+ is $24.99 [S4]; LeetCode Premium $35/month or ~$179/year [S9]. $15 sits mid-market, which is neither a differentiator nor a problem. Your own cost structure no longer requires it.
- **B2B-edu (bootcamps, universities):** I would put this on equal footing with B2C, not behind it, for three reasons. (1) **Cold start:** one instructor can supply 20–100 users and structured feedback in a single deal, which is the thing B2C is worst at. (2) **The demand signal for oral/verified assessment is strongest here:** professors are moving to oral exams because of AI [S8], and startups are chasing it with pilots at real universities [S6][S7]. (3) You already have an instructor-friendly artifact: weak-spot data per student. **Against it:** bootcamps have consolidated and several have closed [S12]; the survivors are a small, wary set of buyers; universities have long procurement cycles and privacy rules (FERPA/GDPR); and **OralExam.ai and verballí are already pitching exactly the oral-assessment story to faculty** [S6][S7], with ready credibility (university pilots). I found **no pricing or purchase evidence** for either: OralExam.ai explicitly says tiers and prices are not set [S6]. So edu demand is *signalled*, not *proven*.
- **Who pays first:** I can't tell you; you can't either. That's why §8 tests both with a small experiment instead of choosing.

### 4.7 Go-to-market: first 10 / 100 / 1,000
See §9 for the plan; the summary:
- **First 10:** hand-recruited via DMs to people who publicly described the problem (e.g. r/learnprogramming at 4.4M members [S14] limits self-promotion to a weekly thread, so DM, don't post), plus 2–3 instructors.
- **First 100:** one instructor-led cohort (20–50) plus one honest Reddit/X story post *after* the pilot gives you a real result to report.
- **First 1,000:** do not plan this yet. Any plan for 1,000 users written before 20 real users exist is fiction.

### 4.8 Unit economics
Verified rates [S13]: `gpt-oss-120b` $0.15 / $0.60 per million input/output tokens; Whisper large-v3-turbo $0.04 per audio hour.

| Item | Estimate | Basis |
|---|---|---|
| Mentor message | ~$0.001–0.002 | ~5k input + ~600 output tokens at the rates above |
| Heavy Pro user at the 30/day cap | ~$1–2/month | 900 messages/month |
| Whisper STT, 6.25 min of audio per graded exam | < $0.01 | $0.04/hr × 0.104 hr ≈ $0.004 |
| Graded voice exam, all-in | ~$0.08–0.09 | your spec's recommended stack (two stronger grading runs, cached examiner prompts) |
| Fixed hosting | ~$100–160/month | `docs/strategy/BUSINESS_MODEL.md`, not re-verified |

**Conclusion: AI cost is a rounding error against a $10–15 price.** The real unit-economics costs are **your hours**: rubric authoring (~2–3 hours/layer per your spec), calibration, support, instructor onboarding, and sales/outreach. At $15/month, 10 paying users cover hosting; 100 paying users is $1,500/month before Stripe. That doesn't replace a junior developer salary, so don't plan your life around the B2C outcome in year one.

### 4.9 Biggest risks and assumptions most likely to be wrong
See §6 (the three riskiest) and the problems above.

### 4.10 Founder fit and constraints
- **Strength:** you can ship. The git history proves it.
- **Constraint 1, attention:** a job search is a full-time activity with a fast, high-probability payoff. The honest comparison is: *every hour on Vahoha has lower expected income than the same hour on applications*, but the project is also your strongest portfolio asset. Both are true. Decide explicitly how many hours per week each gets; this plan assumes **~10–15 hours/week for Vahoha**, and you should rescale if that's wrong.
- **Constraint 2, selling:** your history shows a strong building instinct and no selling behavior yet. The first 90 days are mostly the thing you've been avoiding.
- **Constraint 3, scope tolerance:** you already have a "scope drift under uncertainty" pattern (the Arena). Build a rule: *no code that isn't named in the current week's milestone.*
- **Legitimate alternative outcome:** treat this as a portfolio project with a bounded 90-day startup experiment attached. If the tests fail, you've lost nothing the portfolio doesn't already capture. Decide this *before* the experiment, so a negative result isn't a crisis.

---

## 5. Where I'm overturning the previous opinion (`docs/strategy/STARTUP_ADVISOR_ANALYSIS.md`)

| Previous position | This review |
|---|---|
| "Layer 1 → Layer 2 return >50% means you have something" | **Too weak.** n=10 hand-recruited users measures politeness. Add willingness-to-pay and a "very disappointed if gone" score |
| "Build Stripe only if ≥5 of 10 return" | **Wrong order.** Test payment *before* building billing, with a Stripe Payment Link (no integration) or a manual invoice |
| "Nothing combines gated progression + AI mentor + verified profile" | **Stale.** roadmap.sh AI tutor + quizzes [S1][S2], Boot.dev [S3], Cosmo [S4]; the unique claim is now the *rubric-verified oral exam* |
| B2C primary; B2B-edu = "later" | **Test both in parallel.** The edu path solves cold-start and matches the strongest demand signal [S8] |
| Scenario A: "freeze features, run the pilot" | **Agree**, but the pilot must include a payment test and an institution conversation |
| "The 3 scenarios" framing | Missing a fourth: **stop and treat it as a portfolio piece** if tests fail, and say so in advance |

---

## 6. STOP / START / CONTINUE

**STOP**
- Building features (Arena, group chat, voice-review scaffolds, new paths). Until a named user asks.
- Writing strategy documents. There are now ~10. The next document should be interview notes.
- Quoting "70%+ margin", "$15", or "500 verified profiles" as facts anywhere.
- Half-living in two names. Pick Vahoha or DevsWebs this week.

**START**
- Customer interviews (§8, Q-lists in §10). Target 15 in the first 3 weeks.
- A one-page event log (7 events). Without it the pilot generates anecdotes.
- Manual, Wizard-of-Oz oral teach-back sessions over Zoom for one layer, graded by you with the draft rubric.
- One institution conversation per week (instructors, bootcamp owners, CS-club leads).
- A weekly written log of what you learned from *people*, not what you built.

**CONTINUE**
- Backend path only; Layers 1–3 only.
- Server-side exam integrity; the Groq decision (revisit only on quality complaints).
- The pre-pilot hardening checklist in `docs/strategy/ADVISORY_BOARD_REPORT.md` §9 (helmet, cooldown, bank review, Redis).
- Treating gating as a hypothesis to defend with data, not a belief.

---

## 7. Competitive brief (compact, `competitive-brief` structure)

| Player | What it is now | Price (as found) | Threat to you | Where you differ |
|---|---|---|---|---|
| **roadmap.sh** | 3.2M active learners claimed; AI tutor generates courses, guides, roadmaps, quizzes; Pro includes unlimited AI chats/quizzes; Team plan with progress tracking [S1][S2] | Pro $10/mo annual; Team $10/seat/mo, min 3 [S1] | **High**: same audience, same roadmaps, now with AI, and cheaper | Gated, server-graded progression; rubric-based verification |
| **Boot.dev** | Gamified backend path (Python/Go/SQL/Docker…), XP/quests/streaks; 1.2M+ students claimed [S3] | ~$59/mo or $399/yr (per review sites) [S3] | **High** for the *backend* niche you picked | Boot.dev gates via paywall/progression game; you'd add oral verification and a mentor tied to your weak spots. Verify what its AI features actually do before claiming difference |
| **freeCodeCamp** | Free, 11+ certifications, project-based [S10] | Free | Medium: free anchors willingness to pay | Verified understanding vs completion badge (your own doc's claim; its user figure was not re-verified) |
| **LeetCode** | Algorithm practice; Premium adds Ask Leet AI credits and mock interviews [S9] | $35/mo or ~$179/yr [S9] | Low–medium: different job-to-be-done (interview puzzles) | Review sites note mock interviews have **no voice** feedback [S9]; yours would (later) |
| **HackerRank "Chakra"** | AI interviewer: voice/video screening against an employer rubric, adaptive follow-ups, evidence-backed reports; now with an in-line code editor [S5] | Not found (enterprise) | **Strategic**: it proves rubric-based voice evaluation of developers is a funded product category, *on the employer side*. A learner-side practice/verification product is adjacent, and HackerRank could extend into it | You serve the learner before the interview; cheaper; longitudinal (a history, not one screen) |
| **CodeSignal (Cosmo)** | AI tutor app, 300+ short courses, "Duolingo for job skills"; assessments business [S4] | Learn free; Cosmo+ $24.99/mo [S4] | Medium: tutor + assessment under one roof | Narrower, deeper on one backend path |
| **OralExam.AI** | AI voice oral exams for educators; beta, high-school pilot now, university courses this fall; pricing not set [S6] | Not set [S6] | **High for the edu strategy**: they are ahead on instructor trust and are targeting your edu buyers | Developer-specific rubrics; a continuous learning loop, not one-off assessments |
| **verballí** | Voice-first oral assessment for higher-ed faculty; AI grading against the faculty's rubric; voice authentication; pilots at Illinois State and Boston University (per its search snippet) [S7] | Not found | **High for edu** | Same as above; you'd win only on domain depth |

**Reading across the table:** the *oral/voice verification of understanding* is a hot, funded idea in both edu (OralExam.AI, verballí) and hiring (HackerRank). You are not early to the *idea*; you could be early to the **developer-learner** version. Nobody in this table is selling "an AI that makes a self-taught backend learner explain a layer out loud, grades it against a rubric, and feeds the gaps to a mentor" to individuals. That empty cell is either a gap or a graveyard; interviews decide which.

**Honest moat assessment:** (1) *Gating* is copyable. (2) *Data advantage* needs thousands of graded learners. (3) *Rubric quality* is the one asset that compounds, because calibrated rubrics take real expert time, but only if your graders agree with humans (κ ≥ 0.7 per your own spec). (4) *Distribution* is the actual moat in this market, and roadmap.sh and freeCodeCamp already own it.

---

## 8. The three riskiest assumptions and the cheapest test for each

*(A fourth, optional test for the "flight simulator" concept is in §12 as A4. It is not one of the three because it is an alternative wedge, not a risk to the current plan.)*

### A1 — "A self-taught backend developer will pay for gated progression + a mentor when roadmap.sh and freeCodeCamp are free or $10"
- **Cheapest test (≈ 1–2 weeks, near-zero code):** interview 15 people who match the ICP (Q-list §10). Then offer each a **paid early-access slot** through a Stripe Payment Link (no billing code needed): e.g. $29 for 3 months, refundable. Count actual payments, not "sounds great".
- **Pass (my judgment):** ≥ 3 of 15 interviewees pay, **or** ≥ 40% answer "very disappointed" to "how would you feel if you couldn't use this anymore" after a real session (the standard Sean Ellis threshold; I recall it as a commonly used PMF heuristic, not a law).
- **Kill/pivot signal:** zero payments from 15 qualified people, or the pain described is "I can't get interviews", not "I don't know what I don't know".

### A2 — "An oral teach-back exam is something learners value, perceive as fair, and a rubric can grade reliably"
- **Cheapest test (≈ 2 weeks, zero code):** **Wizard-of-Oz.** Author one layer's rubric (5–6 must-have concepts, 2–4 critical misconceptions), then run 6–8 live 15-minute Zoom sessions where you act as the examiner and score by the rubric afterwards. Have a second person (a friend who's a working developer) independently score the recordings. Ask each learner: *"Did that feel fair? Would you do another?"*
- **Pass (my judgment):** your two scorers agree on pass/fail in ≥ 6 of 8; ≥ 6 of 8 learners say it felt fair and they'd do another; at least 3 name something specific they didn't know.
- **Kill/pivot signal:** scorers disagree often (then no LLM will be consistent either), or learners describe it as stressful and pointless. In that case cut voice from the roadmap permanently.

### A3 — "An institution will adopt this and pay (or at minimum put it in a syllabus)"
- **Cheapest test (≈ 3–4 weeks):** send 20 short messages to bootcamp owners, instructors of intro backend/web courses at universities and community colleges, and CS-club leaders. Ask for a 20-minute call (questions in §10). Offer one **free cohort pilot** (10–30 students) in exchange for weekly feedback and a written outcome. Provide the instructor view as a **CSV/Notion export**, not a built dashboard.
- **Pass (my judgment):** ≥ 5 calls booked from 20 messages; **at least one instructor commits a cohort in writing** (email is enough) and says what they would pay *if it worked*.
- **Kill/pivot signal:** instructors say "nice" but won't put it in front of students, or they say procurement/privacy blocks anything before next academic year. Then edu is a 2027 strategy, not a 90-day one.

---

## 9. 90-day plan (≈ 10–15 hours/week; rescale if different)

**Rules:** no new features except those named below; one-page weekly log (what I learned from people); decision gates at Day 30/60/90.

| Week | Milestone | Metric / evidence |
|---|---|---|
| **1** | Decide the name. Pre-pilot hardening (helmet, re-enable exam cooldown, confirm Redis in prod, confirm Backend L1–3 bank answer keys by hand, Groq paid tier or confirm limits). 7 event types logging to MongoDB. Draft interview scripts. | Checklist done; events visible in DB; *you* ran the full loop as a fresh account |
| **2** | Send 30 DMs to ICP matches (people who publicly described the problem; **DM, don't post**). Send 20 institution messages. | ≥ 8 ICP calls booked; ≥ 4 institution calls booked |
| **3** | Hold 10–15 ICP interviews. Hold the institution calls that landed. | 10+ interview notes written same-day; 3 recurring pain phrases extracted |
| **4** | Pilot 1: 10 users do Layer 1 while you **watch** (screen share, don't help). Draft the oral-exam rubric for one layer. **Day-30 gate:** are the interviewees describing the problem you assumed? | Completion of L1; every stall logged; ICP pain confirmed or not |
| **5** | Fix only the top 3 pilot problems. Pre-sale test begins: Payment Link for early access to every interviewee and pilot user. | Payments received (count); "very disappointed" score |
| **6** | Wizard-of-Oz oral exam sessions (6–8). Second scorer reviews recordings. **Also run A4 (§12):** one hand-made "real task" with AI allowed, 5–8 juniors, plus 2 hiring-manager reviews. | Scorer agreement; learner fairness answers; A4 pass criteria |
| **7** | Institution pilot starts if any instructor committed: 10–30 students, CSV export of progress and weak spots. | Students onboarded; weekly activity |
| **8** | **Day-60 gate** (see decision table below). | Pass/fail on A1, A2, A3 |
| **9–10** | Act on the gate. If B2C passes: minimal billing (Stripe Checkout + one feature flag, not a full `featureGateService`). If edu passes: instructor needs list; keep the CSV export. If A2 passes: voice-exam Phase 0 (rubric + prompts for one layer) only. | One thing shipped, tied to evidence |
| **11–12** | Widen to ~50 users: one honest "what 10 developers taught me" story post (Reddit weekly promo thread / X / Dev.to) with *real numbers from your pilot*. Continue instructor pilot. | Signups, L1→L2 return, payments, weekly retention |
| **13** | **Day-90 review.** Write a 1-page decision: continue / narrow / pivot to edu / pause as portfolio. | Decision recorded with the numbers that drove it |

### Gates (my judgment thresholds)

| Gate | Continue if | Otherwise |
|---|---|---|
| **Day 30** | ≥ 10 qualified interviews done; ≥ 60% describe the same pain | Reposition or choose a different ICP before more building |
| **Day 60** | A1 **or** A3 passes. A2 passes only if you intend to keep voice in the plan. If A2 and A4 both pass, pick **one** as the wedge | If A1, A2, A3, A4 all fail: stop active building; treat as portfolio |
| **Day 90** | ≥ 5 paying users **or** one institution paid/committed-in-writing **and** a rising L1→L2 return | Same: the data picked the outcome, not your enthusiasm |

### Roadmap update (`roadmap-update` style)

- **Now:** hardening, events, interviews, pilot, Wizard-of-Oz oral exam, payment-link test.
- **Next (only if gated in):** minimal billing; instructor export; voice-exam Phase 0 (one layer, no code), then Phase 1 (text-only slice).
- **Later:** audio, calibration dashboard, certificates, orgs/cohorts, live conversation, employer features.
- **Never (unless asked for by a named user):** Build Teams, Sponsored Projects, Screening-as-a-Service. These live in `docs/FUTURE_IDEAS.md` and each requires users you don't have.

### Metrics definitions (`metrics-review` style)

| Metric | Definition | Why |
|---|---|---|
| Qualified interviews | ICP match + described the problem unprompted | Demand evidence |
| Pre-sale conversion | payers / (interviewees + pilot users offered) | The one metric that isn't politeness |
| Sean Ellis score | % "very disappointed" after a real session | PMF proxy (heuristic) |
| L1 completion | users finishing Layer 1 within 14 days / users started | Loop health |
| L1→L2 return (7 days) | returned for L2 / completed L1 | Retention proxy (weaker than the two above) |
| Scorer agreement | pass/fail agreement, human vs human | Gate for any automated grading |
| Institution commitments | written yes from an instructor | Edu demand |

---

## 10. Questions to ask

**Ten for potential users** (self-taught backend learners; ask about past behavior, not opinions; do not pitch until the end)
1. Tell me about the last time you studied something technical. What did you use, and what made you stop?
2. How do you decide that you "know" a topic well enough to move on? What did you do the last time you weren't sure?
3. What have you already paid for to learn to code (courses, subscriptions, mentors)? How much, and was it worth it?
4. Have you used roadmap.sh, freeCodeCamp, Boot.dev, or an AI tutor? What did you like and what made you stop?
5. Have you applied for developer jobs? How many applications, how many screens, what feedback did you get?
6. What was the last technical question in an interview or screen that you couldn't answer well? What did you do about it afterwards?
7. Do you use ChatGPT/Claude/Copilot while learning? What do you trust it for and what do you not trust it for?
8. If a tool refused to let you move on until you proved you understood a topic, how would you feel about that? Has anything like that ever made you quit or made you improve?
9. Have you ever explained a concept out loud to someone (or to yourself) to check you understood it? What happened? Would you do that with software that listened and graded you?
10. (Pitch last) *"I'd like you to try this for a week and pay $X up front; what would stop you?"*

**Five for bootcamp owners / instructors**
1. How do you currently know, mid-course, which students are about to fall behind, and what happens when you find out?
2. When a student graduates, what evidence do you give employers that they actually understand the material? Who checks it?
3. How have you adjusted assessment since AI tools became common? Have you tried oral exams, and what stopped you from doing more of them?
4. Walk me through how you bought the last tool your program adopted: who decided, what budget it came from, how long it took, and what data/privacy approvals were needed.
5. If a pilot ran for one cohort at no cost, what would you need to see in the first three weeks to keep it, and what would make you shut it down?

---

## 11. What would change my mind

- **More optimistic:** five or more ICP interviewees prepay, or two instructors independently commit cohorts. That moves this from "portfolio plus experiment" to "startup with a wedge".
- **More pessimistic:** interviews reveal that learners want *more content and fewer gates*, or that every instructor already uses a free tool for this. Then the problem is real but your solution is aimed at the wrong job.

---

## 12. Alternative concept: a "flight simulator for developer jobs" (added 2026-10-01)

**The concept (from the founder).** Developers prove they're job-ready by doing real work alongside AI: realistic tickets (fix a bug in a messy codebase, add a feature, review a pull request), AI allowed but **graded on judgment** (catching AI mistakes, code quality, explaining decisions), an AI mentor that hints but never hands over answers, a public verified skill profile, a personalized "next task" from weak spots, and small review "squads". Learners pay; companies pay to hire from it.
**Problem statement:** AI made entry-level work look replaceable and resumes/certificates mean little; companies can't tell who works well with AI.

### 12.1 How much of the current project it covers

Weights and percentages are my judgment from reading the repo, not measurements.

| Piece | Weight | Current project | Overlap |
|---|---|---|---|
| Real tasks (bugs, features, PR review) | 30% | Arena runs sandboxed *small* challenges; no messy codebases, tickets or PR reviews | ~15% |
| AI allowed, graded on judgment | 25% | Exams are AI-free; nothing scores how someone uses AI. Rubric/grading machinery (teach-back) is reusable | ~5% |
| AI mentor, hints not answers | 10% | Built: Socratic refusal, tools into weak spots | ~90% |
| Verified public skill profile | 15% | Exam history and mastery data exist; no profile or shareable record | ~25% |
| "Next task" from weak spots | 10% | Weak-spot / next-action engine exists; there are no tasks to recommend | ~60% |
| Squads | 10% | Group chat and follows only; no review or accountability mechanics | ~20% |
| **Weighted total** | | | **~26%** |

**Reading:** about a quarter of the concept by feature weight, and ~10% of the part that defines it (realistic tasks + judgment scoring). Reusable chassis: auth, mentor, grading and mastery engines, sandbox. It is a different product on the same chassis, not an extension of the gated roadmap.

### 12.2 Assessment

**Stronger than the current framing:** "juniors can't get hired and employers can't tell who works well with AI" is a sharper pain than "learners skip content", and the buyer (employers) is clearer. It aligns with the evidence in §4.1 that verification is the area being paid for.

**You would not be early.** AI-assisted assessment is already mainstream on the *employer* side (sources from search snippets and blogs, not vendor pages, so verify before quoting):
- Meta, Google and Canva are reported to run AI-assisted coding rounds [S17].
- CoderPad scores how candidates prompt, troubleshoot and validate AI output inside a monitored IDE [S18].
- HackerRank candidates report getting an unfamiliar repository and a built-in coding agent, then debugging or implementing a scoped feature [S17][S19].
- CodeSignal says about a third of its customers adopted the format in 2025 [S19].

The **learner-side** version (practice on realistic tasks, build a record before applying) is less obviously taken, but I did not research it; absence from a few searches is not proof.

**Why it is harder to build than the current product:**
- Each task needs a believable messy codebase, a ticket, hidden defects and a judgment rubric: days of authoring per task, versus ~2–3 hours per layer for the voice-exam rubrics.
- Per-task reproducible environments, and grading that is fair and hard to game.
- Judgment grading has the same calibration problem as the voice exam (§8 A2), with a harder rubric.

**Unproven claims:** "employers will trust it" and "companies pay to hire from it" are the same untested assumptions as before, reworded. Squads add moderation and cold-start problems with no evidence anyone wants them.

### 12.3 Recommendation

Do **not** rebuild around it yet. Test it by hand, like the voice exam, as **assumption A4** (below). If it passes, it becomes the wedge, with the gated roadmap as the "path" feeding it and the mentor / mastery / grading engines reused.

### A4 — "Juniors find realistic AI-allowed tasks valuable, and hiring managers would let the result change a decision"
- **Cheapest test (~2 weeks, zero platform code):** author **one** realistic task by hand (a small repo with a seeded bug plus a PR to review). Give it to 5–8 juniors with AI allowed. Grade their judgment yourself with a short rubric (did they catch the AI's mistake, justify decisions, review the PR sensibly?). Ask each: *did it feel like real work, did you learn something, would you pay for more?* Then show two or three anonymized results to **two hiring managers** and ask whether it would change a screening decision.
- **Pass (my judgment):** ≥ 5 of 8 say it felt like real work and name something they learned; ≥ 3 would pay or re-do another task; both hiring managers say it adds signal beyond a resume. Your grading must also be consistent: have a second person grade the same submissions and agree on ≥ 6 of 8.
- **Kill/pivot signal:** learners treat it as another exercise, or hiring managers say they already get this signal from their own AI-assisted interview rounds [S17][S18][S19]. Then the employer-side market is covered and you would be competing with incumbents.

**Plan impact:** run A4 in Weeks 5–6 of §9 alongside the Wizard-of-Oz oral exam; treat the two as competing "wedge" candidates and let the Day-60 gate pick one.

---

## Sources

- **[S1]** roadmap.sh Premium: [roadmap.sh/premium](https://roadmap.sh/premium) (price $10/mo billed annually; Team $10/seat/mo, min 3; 3.2M active learners, 160K+ roadmaps, 150K+ courses, 1M+ AI conversations; all as stated on the page)
- **[S2]** roadmap.sh AI tutor announcements: [x.com/roadmapsh (Jan 2026)](https://x.com/roadmapsh/status/2012345631180808423)
- **[S3]** Boot.dev: [coddy.tech/vs/boot-dev](https://coddy.tech/vs/boot-dev), [codingphase.com review](https://codingphase.com/blog/is-boot-dev-worth-it), [boot.dev blog comparison](https://www.boot.dev/blog/education/bootdev-vs-codecademy) (price and "1.2M students" figures come from review sites and the company blog and were not independently verified)
- **[S4]** CodeSignal: [codesignal.com/pricing](https://codesignal.com/pricing/); [VentureBeat on Cosmo](https://venturebeat.com/ai/codesignals-new-ai-tutoring-app-cosmo-wants-to-be-the-duolingo-for-job-skills)
- **[S5]** HackerRank Chakra: [YC Launch post](https://www.ycombinator.com/launches/PQb-chakra-ai-interviewer-that-finally-works); [HackerRank on X](https://x.com/hackerrank/status/2080304717465522435); [HackerRank on AI interviewers](https://www.hackerrank.com/writing/how-does-an-ai-interviewer-work)
- **[S6]** OralExam.AI: [oralexam.ai](https://oralexam.ai/); [pricing page](https://oralexam.ai/pricing) ("We have not set tiers, prices, or seat counts")
- **[S7]** verballí: [verballi.ai](https://verballi.ai/) (title: "AI-Proof Oral Assessments for Higher Ed"; the pilot details come from a search-result summary and are **unverified** because the page fetch returned only the title)
- **[S8]** The Washington Post, college professors using oral exams to combat AI (Dec 2025): [washingtonpost.com](https://www.washingtonpost.com/education/2025/12/12/ai-artificial-intelligence-college-oral-exam/) (I saw the headline and snippet only, not the full article)
- **[S9]** LeetCode pricing and mock interviews: [designgurus.io](https://www.designgurus.io/blog/is-leetcode-premium-worth-it); [spacecomplexity.ai comparison](https://spacecomplexity.ai/blog/best-ai-mock-interview-platforms)
- **[S10]** freeCodeCamp 2026: [skillcrush review](https://skillcrush.com/blog/freecodecamp-review/); [hackr.io review](https://hackr.io/blog/freecodecamp-review)
- **[S11]** Junior market (low-quality aggregators; magnitudes disagree, treat as directional): [hakia](https://hakia.com/news/junior-developer-crisis-2026/); [byteiota](https://byteiota.com/developer-hiring-crisis-2026-40-worse-junior-drops-73/); [DEV Community](https://dev.to/rudratosh/junior-developer-jobs-didnt-disappear-the-bar-for-them-quietly-moved-and-nobody-sent-the-memo-2kc8)
- **[S12]** Bootcamp market: [hakia: who survived the shakeout](https://hakia.com/news/bootcamp-market-2026/); [Scrimba bootcamp guide](https://scrimba.com/articles/best-coding-bootcamps-in-2026-costs-job-rates-and-how-to-choose/) (average cost $12–22K; placement claims 70–84% are self-reported and the BloomTech/CFPB case shows why to discount them)
- **[S13]** Groq pricing: [CloudZero Groq pricing guide](https://www.cloudzero.com/blog/groq-pricing/) (gpt-oss-120b $0.15 in / $0.60 out per 1M tokens; Whisper large-v3-turbo $0.04/hr; per search-result summaries, **re-verify on groq.com before committing**)
- **[S14]** r/learnprogramming (4.4M members; limits self-promotion to a weekly thread): [thehiveindex.com](https://thehiveindex.com/communities/r-learnprogramming/)
- **[S15]** The Odin Project Discord (~92–95K members per tracking sites): [deepcord](https://www.deepcord.com/server/51zpuc8shf)
- **[S16]** Codecademy and Scrimba pricing: [Capterra](https://www.capterra.com/p/266830/Codecademy/); [Scrimba](https://scrimba.com/articles/best-ai-tools-and-courses-for-learning-to-code/)

- **[S17]** AI-assisted coding interviews at big tech: [Exponent/Aced on Google's format](https://www.tryexponent.com/blog/google-ai-coding-interview); [Northeastern careers guide](https://careers.northeastern.edu/blog/2026/05/13/googles-ai-assisted-coding-interview-2026-guide/) (search snippets and secondary guides, not company announcements)
- **[S18]** CoderPad on AI-enabled hiring: [coderpad.io/use-case/ai-enabled-hiring](https://coderpad.io/use-case/ai-enabled-hiring/)
- **[S19]** CodeSignal and format overviews: [CodeSignal on AI assessment platforms](https://codesignal.com/blog/best-ai-assessment-platforms/); [PracHub overview](https://prachub.com/resources/ai-assisted-coding-assessments-in-2027-companies-platforms-rules-and-scoring) (the "third of customers" claim is CodeSignal's own and unverified)

*Not verified anywhere in this review: freeCodeCamp's "10M+ users" (from your own docs), HackerRank's Chakra pricing, any employer's willingness to pay for a DevsWebs/Vahoha credential, and the actual quality of your mentor and exam banks.*
