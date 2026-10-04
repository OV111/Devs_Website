# Future Ideas — Not Scoped, Not Committed

> Moved out of VISION.md 2026-09-30 to keep that document investor-readable. These are speculative concepts kept so the idea isn't lost — none are in scope until the MVP loop (see `ROADMAP_BUILD_PLAN.md`) is validated with real users.

---

## Collaborative Build Teams (2026-06-11)

**Concept:** Developers on Vahoha group together socially, pick a real project they want to build, and the AI assigns tasks to each member based on their known skill level and learning progress. The team ships a real product together.

**How it works:**

1. A developer creates or joins a Build Team from the social layer (similar to how they follow people or join discussions today)
2. The group picks a project idea and defines the scope
3. The AI — which already knows each member's roadmap progress, exam scores, and skill gaps — breaks the project into atomic tasks (1–3 hours each) and assigns them to the right person
4. Members complete their tasks, the AI reviews and integrates, and the team ships

**Retention / commitment mechanic:**

- When joining a Build Team, each member stakes DevsCoins as a commitment deposit
- Complete your assigned tasks → get your DevsCoins back + bonus earned
- Abandon without completing → lose your stake (goes to the team pool or is burned)
- This makes leaving feel costly without forcing anyone — social pressure + economic incentive combined
- Backup: if someone drops, their open task slot is listed for new members to claim (open-source contribution model)

**Why this is unique:** No existing platform combines social team formation + AI-aware task splitting based on personal skill data + in-platform currency commitment. Buildspace did cohorts, hackathons do time-boxed teams — but neither is persistent, AI-assigned, or economically reinforced.

**Added 2026-10-04 — grouping by shared aim, and the startup outcome:**

- Teams form around a shared goal (e.g. "backend, mid-level in six months"), not only a project idea. Matching reads the mastery data: same target, complementary strengths and gaps.
- Entry gate: a passed track capstone and defense, so every member has a verified baseline.
- Teamwork is evidence in its own right: reviewing teammates' code, PR history and shipped features show the collaboration skill that separates mid-level from junior. It should feed the same mastery/evidence spine, not a separate "team score".
- The project could be defended together using the existing capstone defense.
- A team may choose to turn the project into a startup. That is an outcome, not a feature: build nothing for it. Equity, IP and legal questions are real and out of scope.
- Validate first: run one team by hand (chat group plus shared repo) before any product work.

**Open questions:**

- [ ] How does the AI verify task completion? (PR review? Demo video? Peer review?)
- [ ] What's the minimum team size? (2–5 devs seems right for a first version)
- [ ] Do completed Build Team projects get a public profile page on Vahoha?
- [ ] Can a Build Team project become a portfolio piece linked to each member's profile?

---

## Sponsored Real Projects (2026-06-12)

> Builds directly on Collaborative Build Teams. This is the revenue endgame for that feature.

**Concept:** A company pays Vahoha ($2–5K) to have a Build Team deliver a real small product — an internal tool, an MVP, a dashboard. Vahoha takes a 15–20% platform fee; the rest is split among the team members based on completed tasks.

**Why everyone wins:**

- **Developers** — get paid real money, gain real work experience, and ship a verified portfolio piece ("built for an actual client" beats any tutorial project)
- **Company** — gets cheap delivery on small projects AND a recruiting preview: they watch a team work for weeks before deciding to hire anyone (better signal than any interview)
- **Vahoha** — earns the platform fee, and every sponsored project generates verified work-history data that makes the hiring marketplace more valuable

**How it works:**

1. Company posts a project with budget and scope; Vahoha (AI-assisted) validates the scope is junior-team-sized
2. Money goes into escrow (Stripe — not crypto)
3. AI matches a Build Team whose verified skills fit the project, splits it into tasks, assigns by skill level
4. AI + milestones track progress; company sees demo checkpoints
5. On delivery and acceptance: escrow releases, split by contribution, Vahoha takes its cut
6. The project becomes a verified portfolio piece on every member's profile

**Why this is the most unique revenue stream:** "Junior-team-as-a-service with AI project management" doesn't exist. Toptal/Upwork sell individual senior freelancers. Agencies are expensive. Nobody sells coordinated junior teams with AI doing the task-splitting and the platform vouching for each member's verified skill level.

**Prerequisites (in order):**

1. Build Teams working with free/community projects first — prove the AI task-splitting actually produces shipped software
2. A pool of users with verified skills (exam engine live)
3. Escrow + contribution-based payout system
4. Only then approach companies — first ones likely from the community itself or local market

**Open questions:**

- [ ] Who handles scope disputes between company and team? (Vahoha arbitration? AI-assisted?)
- [ ] Quality guarantee — does Vahoha refund if the team fails to deliver? (Probably yes, from escrow — never deliver = company pays nothing)
- [ ] Legal: contractor relationships, taxes per country, liability for delivered code
- [ ] Minimum platform maturity before charging real companies (reputation risk if early projects fail)

---

## Screening-as-a-Service (2026-06-12)

> Reuses the Exam Engine. Near-zero extra cost per sale — the infrastructure is being built anyway for the roadmap gating.

**Concept:** Companies send their own job candidates through Vahoha's exam engine as a hiring screen, and pay $30–50 per assessment. The candidate doesn't need to be a Vahoha user — the company just sends them a link.

**Why it works:**

- The exam engine already exists for roadmap gating — same AI-generated, skill-targeted exams, just pointed at an external candidate
- Marginal cost per assessment is almost zero (one AI exam generation + grading run)
- Companies already pay for this elsewhere (HackerRank, Codility, TestGorilla) — proven market, proven willingness to pay
- Every external candidate who takes a screen discovers Vahoha → free user acquisition funnel

**How it works:**

1. Company creates a screening request: role, stack, seniority level
2. Vahoha generates a tailored exam (theory + practical coding challenge) from the same engine that powers roadmap layer exams
3. Company sends the link to candidates; they take it (proctoring/anti-cheat measures needed)
4. Company gets a structured report: score, strengths, weak spots, comparison against Vahoha's verified user base ("scores better than 70% of devs who passed Backend Layer 3")
5. Billed per assessment, or monthly bundles (e.g. 20 assessments/month)

**The hidden advantage over HackerRank/Codility:** Vahoha's comparison baseline is real — thousands of verified developers with known skill levels took these same exam types while actually learning. "Better than 70% of our verified Layer 3 devs" is a benchmark competitors can't fake, because their test-takers are anonymous one-time strangers.

**Prerequisites:**

1. Exam engine live and proven on Vahoha's own users first
2. Enough verified users that the comparison benchmark is statistically meaningful
3. Anti-cheat / proctoring strategy (AI-assisted code review for plagiarism, time analysis, etc.)
4. Simple company-facing dashboard (can start as a manual/email process for the first customers)

**Open questions:**

- [ ] Per-assessment pricing vs monthly subscription bundles — or both?
- [ ] Do screened candidates get an offer to join Vahoha with their results pre-loaded as a starting profile?
- [ ] White-label option (company's branding on the exam) at a higher price tier?
- [ ] How to handle cheating/AI-assistance during remote assessments?

---

## University & Bootcamp Licensing (2026-06-12)

> The same platform, sold per-seat to institutions. One deal = hundreds of users at once.

**Concept:** Universities and coding bootcamps license Vahoha per student per semester. Their students get the roadmaps, exam engine, and AI mentor; their instructors get a dashboard showing each student's real progress, exam results, and weak spots.

**Why institutions would pay:**

- **Bootcamps** — their entire sales pitch is job outcomes. Vahoha's verified-skill data proves outcomes ("94% of our grads passed Backend Layer 3") in a way no bootcamp can fake today.
- **Universities** — CS programs are theory-heavy; Vahoha adds the practical, measured track without faculty needing to build anything.
- **Both** — instructor dashboards replace gut feeling with data: who's falling behind, on what exactly, before exams reveal it too late.

**Business model:**

- Per-seat pricing: roughly $10–30/student/month (institutions pay less per seat than individuals, but buy hundreds at once)
- One mid-size bootcamp (200 students) ≈ $2–6K/month from a single contract
- Semester or annual contracts → predictable revenue, unlike consumer churn

**Why this is leverage, not extra work:** This is the same product already being built — roadmaps, exams, AI agent, progress tracking. The only new pieces are: organization accounts, an instructor dashboard (a read-only view over data that already exists), and seat-based billing.

**Strategic side effects:**

- Hundreds of students onboarded per deal → solves the cold-start problem institutionally instead of one user at a time
- Students who graduate keep their Vahoha profile → flow straight into the hiring marketplace funnel
- Institutional credibility ("used by X university") makes every other B2B sale easier

**Prerequisites:**

1. Core learning loop live and stable (roadmaps + exams + progress tracking)
2. Organization/team account structure with roles (admin, instructor, student)
3. Instructor dashboard over existing progress data
4. Seat-based billing

**Open questions:**

- [ ] Do institution-licensed students get the full AI agent, or a limited version (AI cost per seat matters at this price point)?
- [ ] Can instructors create custom roadmap paths / private exam sets for their curriculum?
- [ ] Data ownership & privacy — what does the institution see vs what stays the student's (FERPA/GDPR considerations)?
- [ ] Pilot strategy: offer one local bootcamp/university a free semester in exchange for feedback and a case study?

---

## Voice AI Progress Review / Teach-Back

> **Status 2026-09-27:** A minimal one-topic vertical slice (JWT Signature only) has actually shipped — see `ROADMAP_BUILD_PLAN.md` / the AI Mentor section for what's real. This entry is the original product reasoning and the parts still not built.

### Reframe: it's a learning mechanic, not a voice feature

Voice is the interface, not the idea. The actual product concept is a fourth evidence source added to the existing roadmap → exam → weak-spot loop:

```
Learn → Prove (exam) → Identify weaknesses → Review → Teach back → AI follow-up → Update learner profile → Advance
```

MCQ tests recognition and is gameable; explaining a concept out loud (or in writing) under adaptive follow-up questioning tests recall and reasoning — closer to what a real technical interview demands. Potential brand angle: "Learn it. Prove it. Explain it. Earn the next level."

### What's built (one topic only, JWT Signature)

- Rubric-based evaluation: the app owns the rubric/scoring math, the LLM only fills in evidence against fixed criteria — never freely judges.
- Grading via the existing Groq agent client, reusing the same tool-use provider (zero new vendor cost).
- Server routes for initial teach-back grading and a single scoped follow-up question.
- UI entry point from a missed exam topic into a teach-back mode inside the AI mentor chat.
- Voice input/output on the free tier only, via the browser-native Web Speech API — zero marginal cost, zero new vendor.
- Async only (dictate → transcript → grade → optional one follow-up → re-grade) — no live interruption or real-time turn-taking.

### Explicitly not built yet

- Rubric content for any topic beyond JWT Signature — the single largest gap; the pipeline works, the curriculum content doesn't exist yet.
- Calibration — no reference answers have been graded to confirm the LLM scores consistently before trusting it on real users.
- An on-demand entry point (a persistent "teach back a weak topic anytime" surface) — today it's only reachable right after a fresh exam result.
- A mentor-initiated hook from general chat (agent offers to hand off into teach-back mid-conversation).
- Live/sync voice conversation (a metered STT+LLM+TTS platform) — deliberately deferred; real per-minute cost, and it replaces the current text-based turn loop with call-style session architecture rather than extending it.
- Mastery decay/re-verification over time, a "needs review" state for low-confidence grading, rubric-version-aware historical display, public skill-profile exposure of teach-back mastery.

### Why this was risky to build early (reasoning, still relevant to scope decisions)

- This is scope on top of an MVP loop (roadmap + exam engine) that isn't yet fully validated with real users — the mandate is "build the loop, get real users through it, then decide what's next."
- Real-time voice adds a new cost axis on top of an AI agent cost model that's already the primary margin risk (see `BUSINESS_MODEL.md`).
- It needs real infra — a speech-to-text pipeline, turn-taking/interruption logic, and either a TTS voice or a "listen only" mode.

**Where this fits:** a Pro-tier or higher differentiator, built out further only after the core exam-based loop has proven the Layer 1 → Layer 2 return rate is healthy — not a replacement for the MCQ exam.

**Open questions:**

- [ ] Sync (live AI follow-up mid-explanation) or async (record then review)? Async is the realistic default.
- [ ] Which tier does this live behind — Pro, or a separate add-on given the extra AI cost?
- [ ] Does a passed voice review count the same as a passed MCQ exam for layer unlock, or is it a separate "verified deep understanding" badge on top?
- [ ] Transcript storage/privacy — users are speaking, not just clicking; needs clear consent and data-handling language.
- [ ] Accessibility: must remain fully optional — mic access, accents, non-native English speakers, and users who prefer not to be recorded should never be blocked from progressing.

---

## Production Incident Scenarios (2026-10-04)

The learner has a working app, then an incident: "API response time went from 100ms to 4s." They inspect, reason, find the cause, fix it and explain it (observe → reproduce → hypothesise → gather evidence → test → fix → verify). Candidates: memory leak, race condition, database bottleneck, broken auth, failed deploy, cache invalidation, API timeout, queue failure, bad error handling. This is the later tier of scenario challenges (`ROADMAP_BUILD_PLAN.md`, Loop strengthening), an extension of Coding Challenges and Capstones rather than a new subsystem. Open: curated sandbox projects versus injecting faults into the learner's own repo (experiment).

---

## Evidence Profile and Employer Assessments (2026-10-04)

**Evidence profile:** each skill (frontend, backend, databases, testing, system design) shown with the evidence behind it: evaluated challenges, capstones, defenses, scenarios. Never a bare number. Extends the planned public profiles and certificate `/verify` page. Depends on calibrated rubrics.

**Employer assessments:** same infrastructure, reversed: a company creates an assessment, a candidate builds, Vahoha evaluates, the company receives evidence. This is the Screening-as-a-Service idea above; it is not a current requirement and Vahoha is not a hiring platform.

---

## Other unsorted ideas

- [ ] Can users contribute posts that become official curriculum content?
- [ ] Peer review system for practical exam submissions?
- [ ] Cohort feature — go through a path with a group at the same time?
- [ ] Public API for roadmap data — let others build on top of Vahoha paths?
- [ ] ATS integration for the Company Portal (export verified profiles to Greenhouse, Lever, etc.)?
- [ ] Developer referral system — earn XP or subscription credit for referring a developer who converts to Pro?
