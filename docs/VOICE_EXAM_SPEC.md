# Voice Exam — Product & Technical Spec

> **Status: DRAFT for approval. No implementation exists.** Written 2026-10-01.
> Sources read: `VISION.md` (repo root, not `docs/`), `docs/ROADMAP_BUILD_PLAN.md`, `docs/FUTURE_IDEAS.md`, `ARCHITECTURE.md`, `BUSINESS_MODEL.md`, and the live exam / teach-back / mastery / mentor code.
> Tooling note: the Product Management `write-spec` skill and the `frontend-design` skill are **not installed** in this environment. The spec follows a write-spec-style structure by hand; §16 describes screens in prose rather than a designed mockup.
> **Decisions recorded 2026-10-01:** (1) **soft gate** — MCQ still unlocks the next layer, voice exam adds "verified" status; (2) **Free tier gets ≥3 graded voice exams/month** (quota per account across all tracks — to confirm); (3) every core prompt covers all `mustHave` concepts (Q2 = A); (4) examiner TTS **deferred**, and where used it should be a **free option** (browser `speechSynthesis` or self-hosted open-source), not a paid vendor; (5) human senior mentors / exemplar answers are a **future idea** (§20), not V1.
> Pricing figures in §11–12 are approximate list prices from memory — **re-verify every number before committing to a provider.**

---

## 0. Findings from the code that change the plan

These are facts from the repo, not assumptions. Several contradict the brief or the older docs, so they are listed first.

| # | Finding | Consequence |
|---|---|---|
| F1 | **MCQ is per layer, not per mini-topic.** `examEngineService.generateAttempt` serves one 15-question exam per layer; questions carry a `topic` tag; pass = 80% overall (`PASS_THRESHOLD`). Layer completion is written as `userProgress.layerProgress.<layer> = "done"` on MCQ pass. | "Unlocks only after all MCQs in the layer are passed" must be defined against this. See Open Question Q4. |
| F2 | **There is no billing, tier or feature-gate code anywhere in the backend** (`grep` for subscription/tier/stripe/featureGate: nothing). `BUSINESS_MODEL.md` Step 3 (Stripe + `featureGateService`) is unbuilt. | Free/Pro/Edu limits cannot be enforced yet. Phase 6 is blocked on billing; earlier phases gate by allow-list/flag. | **Update 2026-10-02: resolved in part.** Polar billing, subscription state and `featureGateService.canAccess()` now exist (`backend/modules/billing`); nothing is gated yet.
| F3 | **Teach-back already exists as a one-topic slice**: `teachBackEvaluatorService` (0–3 level rubric, Groq `openai/gpt-oss-120b`, temp 0.1), `submitTeachBack` + follow-up, `teach_back_rubrics` (4 rubrics total), `teach_back_sessions`, browser dictation (`useSpeechDictation`), and `TeachBackCard` which **reads the mentor's reply aloud via browser `speechSynthesis`**. | Reuse the ideas, not the code: the voice exam needs concept-level 0/1/2 scoring with verified quotes, a turn log and a state machine. The spoken mentor reply is the behaviour you said you do not want. |
| F4 | **Teach-back writes a pseudo-exam into `examHistory`** (`saveExamResult` inside `submitTeachBack`/`FollowUp`). | The voice exam must **not** write `examHistory` — it would double-count in `loadTopicEvidence`. It gets its own collection and a dedicated evidence adapter (§12). |
| F5 | **Rubric keys are inconsistent.** One rubric uses `layer: "layer-6"` (not a real layer id; real ids look like `api-dev-1`, `node-dev-6`); the other three use `api-dev-1` at *mini-topic* granularity ("DNS — domain resolution…"). | New rubrics are keyed by real `layerId` and live in a new collection. The old four are left alone. |
| F6 | **`voiceReview*` (route, controller, service) and `transcriptionService.js` are empty 501/throw scaffolds, and the route is not mounted in `app.js`.** | Free to replace/rename. Recommend deleting the `voiceReview*` names in favour of `voiceExam*` to avoid two concepts. |
| F7 | **LLM endpoints still have no rate limit**, `helmet` is not mounted, no input validation lib on old routes (`docs`/audit 2026-09-24). Zod and `express-rate-limit` *are* installed. | Voice endpoints cost real money per call; per-user rate limits + Zod are a **hard prerequisite**, not a nice-to-have. | **Update 2026-10-02: resolved in part.** `helmet` is mounted and the mentor and teach-back routes have per-user rate limits (`middleware/aiRateLimit.js`); voice endpoints would reuse them.
| F8 | **Dependencies:** `openai`, `groq-sdk`, `cloudinary`, `bullmq`, `zod`, `express-rate-limit` are installed. **No `multer`/busboy, no S3/R2 SDK.** | Audio upload needs one new dependency; Cloudinary can store audio (as `video` resource type) as a no-new-vendor V1. |
| F9 | **Mastery pipeline already ranks teach-back evidence above MCQ** (`deriveTopicStatus`: teach-back <60 ⇒ `shaky`). `deriveNextAction` is a pure function. | The voice exam plugs in as a third evidence source with one small adapter — no rewrite of mastery or the mentor. |
| F10 | **Docs drift:** `VISION.md` still describes the roadmap/exam as unbuilt; both are built. Exam banks exist for 4 backend tracks (40 layers × 15 Qs). | Don't trust status tables; this spec is based on code. |

---

## 1. Summary

Add a **spoken "teach-back" final exam per layer**. The learner explains the whole layer out loud (Feynman technique); an examiner asks 2–3 targeted follow-ups, one at a time; the answer is graded against a **hand-authored rubric of concepts**, not the model's overall impression. The MCQ exam stays exactly as it is — the voice exam sits beside it as the harder, harder-to-fake signal.

Core principles (each is enforced in **code**, not in prompts):

1. The app owns the pass/fail math; the LLM only fills evidence against fixed concepts.
2. Every credited concept must cite a quote that **actually appears in the learner's transcript** (code-verified).
3. One examiner question open at a time — a state machine, not a convention.
4. Grade content only. Accent, fluency, pace and confidence never reach the grader.
5. Every exam is an ordered **turn log**, so live conversation later is a transport change, not a data-model change.

---

## 2. Goals / Non-goals

**Goals**
- G1. A layer-level oral exam that tests recall + reasoning, with a pass/fail result a learner can trust as fair.
- G2. Failing is *productive*: weak concepts feed the mentor, and a mentor review gates the retry.
- G3. Results strengthen the platform's mastery data and the "verified progression" moat (benchmarks, certificates).
- G4. Total AI cost per paying user stays under the ~$6/month ceiling **including** the mentor chat (§12).
- G5. Backend Developer path only for V1.

**Non-goals (V1)**
- N1. Live real-time interview (designed for, not built).
- N2. Webcam/screen proctoring.
- N3. Replacing or removing the MCQ exam.
- N4. Grading pronunciation, fluency, accent or "confidence".
- N5. Any non-Backend path.
- N6. Per-retry charges (never — conflicts with fair grading).
- N7. The AI mentor *speaking its answers* to the learner. (Examiner TTS is a separate, optional decision — Q3.)

---

## 3. User stories & acceptance criteria

**US1 — Take the exam.** *As a learner who passed a layer's MCQ, I explain the layer out loud and get a verdict.*
- AC: Start is rejected server-side (403 + reason code) unless the layer's MCQ requirement is met, no cooldown/gate is pending, and quota remains.
- AC: Recording auto-stops at 5:00; follow-up answers auto-stop at 1:30; the whole attempt has an absolute server-side deadline (default 15:00). Reconnecting resumes the same attempt; the clock never pauses.
- AC: Result shows pass/fail and (Pro) per-concept breakdown.

**US2 — One question at a time.** *As a learner I am never asked two things at once.*
- AC: At most one unanswered examiner turn exists per attempt (DB-enforced via guarded update). A second `POST /turns` for the same examiner turn returns 409.
- AC: Every examiner turn is a single question ≤ 40 words; multi-question output is rejected and regenerated, then falls back to the authored probe.

**US3 — Fair grading.** *As a learner with an accent, I am graded on what I said, not how.*
- AC: The grader receives only transcript text + rubric. No audio metadata, STT confidence, pause data or language/locale.
- AC: Typed fallback exists and is graded identically (marked `source:"typed"` in the record).
- AC: STT is given the layer's glossary to bias technical terms.

**US4 — Fail usefully.** *As a learner who failed, I know what to fix and can't brute-force retries.*
- AC: Retry is blocked until **24h elapsed AND a mentor review is complete for every weak concept** (§7).
- AC: Every concept scored 0 or 1 appears as a weak spot (`source:"voice_exam"`) and in the mentor's learner context.
- AC: The retry uses a different core prompt than the previous attempt.

**US5 — Practice without pressure.** *As a nervous learner I rehearse in the same format with no record.*
- AC: Practice has no deadline pressure UI, stores no audio, writes no history/weak-spots/mastery, has no cooldown, and is capped per day (cost).

**US6 — Attempt history.** *As a learner I see "passed on attempt 2" on my profile.*
- AC: History lists every graded attempt per layer with date, attempt number, pass/fail. Practice never appears.

**US7 — Pro verified certificate** *(later phase)*: shareable page with score, rubric breakdown and 2–3 short audio clips (≤15s, learner-consented).

**US8 — Instructor** *(Edu phase)*: cohort weak-spot stats, custom rubrics/prompts, instructor-set rules.

---

## 4. Exam flow & state machine

### 4.1 Happy path (V1, async)

```
eligibility ✓ → start → examiner prompt shown (text; optional audio)
  → learner records explanation (≤5:00) → STT
  → ANALYZE (cheap pass: which assessed concepts are shallow/missing?)
  → follow-up 1 (one question) → learner answers (≤1:30) → STT
  → follow-up 2 [→ follow-up 3] …
  → GRADE (two independent graders) → result
```

Follow-up count = `min(3, number of assessed concepts scored <2 in ANALYZE)`, minimum 2 if any mustHave < 2, otherwise 1 "stretch" question on the strongest concept's edge case. **Code chooses which concept to probe** (lowest-scoring mustHave first); the LLM only phrases the question. Each concept carries an authored `probe` string used as fallback.

### 4.2 States

```
CREATED → AWAITING_EXPLANATION → TRANSCRIBING → ANALYZING
        → AWAITING_ANSWER(n) → TRANSCRIBING(n) → … → GRADING → COMPLETED
Terminal side exits: EXPIRED (deadline), ABANDONED (client), FAILED_TECHNICAL (server fault)
```

Invariants, all enforced by `findOneAndUpdate({_id, state: <expected>, openTurnIdx: <n>}, …)` so concurrent/double submits cannot corrupt the log:

- I1. Exactly one open examiner turn while in an `AWAITING_*` state; none otherwise.
- I2. A user turn must reference the open examiner turn (`replyTo`).
- I3. The next examiner turn is created only after the previous user turn is persisted.
- I4. `deadlineAt` is absolute and server-computed; all transitions re-check it.
- I5. `GRADING` runs at most once per attempt (idempotent by state guard).

### 4.3 Examiner neutrality (code-enforced)
- Examiner text must not contain evaluative words (`correct|wrong|great|good|exactly|nice|right|incorrect…`) — regex gate → regenerate → fall back to authored probe.
- Examiner never reveals or hints at an answer; never adds a concept absent from the rubric.
- One TTS voice, fixed rate, no emotive styling (if TTS is enabled — Q3).

---

## 5. Rubric & grading

### 5.1 Rubric shape (per layer, hand-authored)

```
concepts[]: { id, label, conceptSlug, weight, mustHave,
              anchors: { 0: "missing…", 1: "shallow…", 2: "solid…" },
              probe: "authored fallback follow-up" }
criticalMisconceptions[]: { id, description, conceptId? }   // each ⇒ auto-fail
passRule: { mustHaveMinScore: 1, totalPct: 70 }
glossary[]: technical terms (STT biasing)
```
Target size: 5–6 `mustHave` + 3–5 optional concepts + 2–4 critical misconceptions per layer. `conceptSlug = toTopicSlug(label)` so it joins to `concepts`, `weakSpots` and `learnerMastery` (F9).

### 5.2 Scoring
- Per concept 0/1/2 (missing / shallow / solid), each ≥1 **requires a verbatim-ish quote** from the learner's turns. Code normalises (lowercase, strip punctuation) and checks the quote is a substring/fuzzy match of the transcript; if not, that concept is **downgraded to 0** (guards hallucinated credit and credit for the examiner's own words — only `role:"user"` turns are graded).
- `totalPct = Σ(weight × score) / Σ(weight × 2) × 100` over the assessed concepts.
- **Pass** = every `mustHave` ≥ 1 **AND** `totalPct ≥ 70` **AND** no critical misconception.
- A critical misconception counts only if it carries a verified quote of the learner *asserting* it (not mentioning it to reject it).

### 5.3 Dual grading
- Two independent grader runs; per concept take `min(scoreA, scoreB)`; misconception flagged only if both runs flag it, or one flags it with a verified quote (decision Q-G1).
- **Independence:** same model at temp 0.1 twice is nearly the same answer. Use two different models/families, or at minimum a different prompt framing + shuffled concept order. (Cost impact: §12.)
- **Disagreement flag** (`needsReview:true`): any concept differs by 2, pass/fail differs between runs, or holistic differs by >2. Flagged attempts are logged for calibration and reviewable; the learner still receives the (lower) verdict in V1, plus a one-click regrade request (Q10).

### 5.4 Holistic score (benchmarking only)
- 1–10 over clarity, depth, follow-up handling. Stored with `graderModel` + `promptVersion`. **Never used for pass/fail.**
- Percentile ("better than X% of devs") computed only within the same `rubricVersion` and grader version and only when N ≥ 50 for that layer (LLM holistic scores drift between model versions; showing a percentile off 8 people is dishonest).

### 5.5 What is hidden from the grader (fairness)
Audio, STT confidence, word timings, pauses, filler counts, locale, account data, typed-vs-spoken. The grader prompt states the transcript is machine-transcribed and may contain mis-heard technical terms; it should credit a term when intent is unambiguous from context and the glossary.

---

## 6. Prompt bank

- 3–5 hand-written **core prompts per layer**, each tagged `coversConceptIds`.
- **Coverage invariant (recommended — Q2): every prompt covers *all* `mustHave` concepts**, differing in scenario and in which optional concepts it elicits. This keeps the pass rule identical across attempts and prompts. (The brief's weaker rule — "the bank collectively covers all mustHave" — means a single attempt can't be fairly judged on mustHave it never asked about.) A seed-time validator and a unit test fail the build if any prompt misses a mustHave.
- **Retry uses a different prompt** than the previous attempt; selection = least-recently-seen, never equal to last.
- **Rewrap by AI (Phase 4+, not V1):** the LLM may restyle a core prompt into a fresh scenario but may not add concepts. Enforced by a verifier pass ("does the rewritten prompt require any concept outside list X?") with fallback to the authored text on any failure. V1 uses pre-authored scenario skins only.
- Bank-leak risk: 3–5 prompts is small; users can share them. Mitigated by skins/rewrap and by follow-ups being generated per answer — see Risks.

---

## 7. After failing

- **24h cooldown** from the failed attempt's end **and** **mentor review on every weak concept** (concepts scored 0–1) before retry. `retryAvailableAt = max(failedAt + 24h, gate complete)`; UI shows which condition is outstanding.
- **Gate record** (`voice_exam_gates`): `{userId, layerId, failedAttemptId, requiredConceptSlugs[], completed[{slug, at, evidence}], unlockAt}`.
- **Gate completion (V1 definition, Q8):** a `mentor_teaching_log` entry for that slug **after** the failure, in a session with ≥3 learner messages about it. (The log alone is mentor-asserted and gameable; the learner-turn count is a cheap floor.) **Upgrade path:** replace with a short mentor-led concept check (2 questions, scored by the existing evaluator).
- The mentor is told about the pending gate through the learner context and `deriveNextAction` gains a `voice_exam_remediation` action (pure function, unit-testable).
- **Attempt accounting:** abandoning after seeing the prompt counts as an attempt (24h cooldown, no mentor gate); a server/STT fault (`FAILED_TECHNICAL`) is **never** counted.
- Attempt history on the profile: `passed on attempt N`.

---

## 8. Anti-cheating (medium) & integrity

In scope: follow-up questions (unpredictable, answered cold), absolute time limit, no pause, server-side everything, one active attempt per user per layer, rate limits.

Soft signals — **recorded for integrity review only, never graded**: time-to-first-word on follow-ups, typed-answer paste events, very high words/sec on typed answers. Kept strictly separate from the grading input (§5.5).

Out of scope: webcam, screen capture, device lockdown. Honest residual risk: a second-screen LLM prompted live can answer; follow-ups and the verified-quote rule raise the cost but do not eliminate it.

**Privacy/consent:** explicit consent screen before first graded exam; raw audio deleted after grading + short retention (default 30 days, then deleted) except clips the learner opts into for a certificate; transcripts retained (needed for regrade/disputes); deletion endpoint; vendor zero-retention / no-training flags required; audio is never sent to the grader.

---

## 9. Data model (MongoDB, native driver, `DevsBlog`)

```
voice_exam_rubrics        { _id, path, layerId, version, status:"draft|published",
                            concepts[], criticalMisconceptions[], passRule, glossary[],
                            ownerOrgId:null, reviewedBy, reviewedAt }
                          unique: { layerId, version }

voice_exam_prompts        { _id, path, layerId, rubricVersion, text, skin, coversConceptIds[],
                            ttsKey?, status }              // validator enforces §6 invariant

voice_exam_attempts       { _id, userId, path, layerId, mode:"graded|practice", attemptNo,
                            rubricVersion, promptId, rulesSnapshot{timeLimit, cooldownH, passRule…},
                            state, openTurnIdx, startedAt, deadlineAt, endedAt,
                            turns[ {idx, role:"examiner|user", kind:"prompt|explanation|followup|answer",
                                    conceptId?, text, source:"stt|typed|llm|authored",
                                    audio:{ref, durationMs, mime}|null,
                                    stt:{provider, model, segments[{start,end,text}], conf}|null,
                                    startedAt, endedAt } ],
                            grading{ runs[ {model, promptVersion, concepts[{id,score,quote,verified}],
                                            misconceptions[{id,quote,verified}], holistic{clarity,depth,followup,overall}} ],
                                     final{concepts[], totalPct, mustHaveOk, criticalHit, passed, holistic},
                                     disagreement{flag, reasons[]} },
                            integrity{signals[]}, cost{sttSec, tokensIn, tokensOut, ttsChars, usd},
                            graderVersion }
                          indexes: { userId, layerId, startedAt:-1 }, { state, deadlineAt } (expiry sweep)

voice_exam_gates          (see §7)
voice_exam_consents       { userId, version, acceptedAt, clipsOptIn }
certificates (Pro)        { _id, userId, attemptId, publicId, issuedAt, clips[] }      // later
orgs / cohorts (Edu)      later; rubrics/prompts already carry ownerOrgId
```

Design notes: `turns[]` is embedded (bounded ~8 entries) so state transitions are single atomic updates. `rulesSnapshot` freezes the rules at start so later plan/org rule changes never rewrite history. `rulesResolver(user, layer)` = defaults → plan → org override.

---

## 10. API (all under `/api/voice-exams`, `authenticate`, Zod-validated, rate-limited per user and per IP)

| Method & path | Purpose |
|---|---|
| `GET /eligibility?layerId=` | `{eligible, reasons[], mcq:{passed}, cooldownUntil, gate:{pending[]}, quota:{used,limit,resetAt}}` |
| `POST /` `{layerId, mode}` | Start; server picks prompt; returns attempt id, prompt, `deadlineAt`, limits |
| `POST /:id/turns` multipart(audio) or JSON(text) + `replyTo` | Submit user turn; server transcribes; returns next examiner turn **or** `{state:"grading"}` |
| `GET /:id` | State, visible turns, result when complete (Pro: full report) |
| `POST /:id/abandon` | Mark abandoned |
| `POST /:id/regrade` | One regrade request (flag + queue) |
| `GET /history?layerId=` | Graded attempts for profile |
| `GET /:id/report` | Pro: per-concept breakdown + evidence |
| `DELETE /me/audio` | Privacy deletion |

Audio: ≤8 MB, mime allow-list (`audio/webm;codecs=opus`, `audio/mp4` for Safari), server-measured duration, silence/min-speech check (Whisper hallucinates on silence). V1 uploads through the API; move to signed direct upload if volume demands.

**Mentor tools:** `get_voice_exam_status` (gate state, weak concepts). Weak spots reuse the existing `addWeakSpot` (`source:"voice_exam"`).

---

## 11. STT / TTS options

**STT** (provider interface keeps the existing stub shape: `transcribeAudio(buffer, mime, {glossary}) → {text, durationSec, segments}`)

| Option | Approx. price | Latency | Notes |
|---|---|---|---|
| **Groq `whisper-large-v3-turbo`** *(recommended V1)* | ~$0.04 / audio-hour | Very fast | Already have a Groq key + SDK; supports `prompt` biasing for glossary; segment timestamps (certificate clips). |
| Groq `whisper-large-v3` | ~$0.11 / hr | Fast | Higher accuracy on accents/jargon; use as fallback or for retries of low-confidence audio. |
| OpenAI `gpt-4o-mini-transcribe` | ~$0.003 / min | Fast | `openai` SDK already installed; good second source. |
| Deepgram Nova-3 | ~$0.004 / min | Streaming-capable | Best fit for the **live** phase; unnecessary for V1 async. |
| Browser Web Speech API | $0 | Real-time | Chrome/Edge only, sends audio to Google, weak on jargon. **Practice mode only**, never graded exams (fairness: free users must not get worse STT). |

**TTS (examiner voice — optional, Q3)**

| Option | Approx. price | Notes |
|---|---|---|
| Browser `speechSynthesis` | $0 | Inconsistent, robotic voices; "calm neutral" not guaranteed. |
| OpenAI `gpt-4o-mini-tts` / `tts-1` | ~$0.015–0.02 per exam | Steerable tone; **cache core-prompt audio at seed time** so only follow-ups are synthesised. |
| ElevenLabs | ~$0.05–0.15 per exam | Best quality; likely over budget. |

---

## 12. AI cost model

Assumptions per **graded** exam: 4 min explanation + 3 × 45 s answers ≈ **6.25 min** user audio; examiner speech ≈ **1,300 chars**; LLM ≈ **16k tokens in / 3.4k out** across: ANALYZE (1), follow-up phrasing (3), final grading (2 runs × ~4k in / 1.2k out), prompt handling.

| Component | Low-cost stack | **Recommended** | Premium |
|---|---|---|---|
| STT | Groq turbo ≈ $0.004 | Groq turbo ≈ $0.004 | OpenAI/Deepgram ≈ $0.02–0.03 |
| LLM | all Groq `gpt-oss-120b` ≈ $0.005 | cheap model for analyze/follow-up + **two stronger-model grading runs** ≈ $0.065 | Sonnet-class throughout ≈ $0.10 |
| TTS | browser = $0 | cached prompts + OpenAI follow-ups ≈ $0.01–0.02 | ElevenLabs ≈ $0.10 |
| **Total / graded exam** | **≈ $0.01** | **≈ $0.08–0.09** | **≈ $0.25–0.30** |

- **Practice mode** (browser STT, one cheap grade, no TTS, no storage) ≈ **$0.01**.
- **Storage:** 6 min Opus ≈ 1–2 MB; negligible at 30-day retention.
- **Per Pro user/month:** realistic 4 graded + 6 practice ≈ **$0.40**; abuse ceiling (one graded/day = 30) ≈ **$2.70** before practice caps.
- **Budget reality:** `BUSINESS_MODEL.md` already allocates ~$3–5/user/month to the mentor. The $6 cap is shared, so the voice exam gets a **soft sub-budget of ~$1.50/user/month**, enforced by a per-user monthly `cost.usd` meter that blocks practice first, then raises a flag on graded attempts.
- **Free tier:** 3 graded exams/month ≈ $0.27 per active exam-taker on the recommended stack (≈ $0.03 on the all-Groq/free-TTS stack). At 1,000 active free users ≈ $270 (≈ $30 on the cheap stack) — use the cheap stack for free users. Quota is **per account across all tracks**, otherwise 172 tracks make it unbounded. Practice for free users gets a small monthly cap.
- **Edu:** price per student per cohort ≥ 5× estimated per-student cost; confirm after Phase 5 gives real per-exam cost telemetry.

---

## 13. Integration with mentor & weak-spot storage

- **Weak spots:** each concept scored 0–1 → `addWeakSpot(db, userId, {topic: concept.label, path, layer, source:"voice_exam"})`. A later score of 2 → `resolveWeakSpot`. (Note existing semantics: `failCount ≥ 2` ⇒ `shaky` in `deriveTopicStatus`.)
- **Mastery:** one adapter in `loadTopicEvidence` maps verified per-concept results into the existing `teachBacks` evidence shape (`topicSlug`, `score = concept pct`, `misconceptionsDetected`). `deriveTopicStatus`, `buildTopicStates`, `getNextAction`, `get_learner_context` then work **unchanged** — voice evidence automatically outranks MCQ, as the mastery policy already intends.
- **Mentor gate:** `deriveNextAction` gains `voice_exam_remediation`; the mentor's system prompt receives the weak concepts (names + misconceptions) through the existing learner-context path; `log_teaching_attempt` already records what the mentor tried.
- **No `examHistory` writes** (F4). Layer unlock is **not changed in V1** (see Q1).

---

## 14. Plans & gating

| | Free | Pro | Group / Edu |
|---|---|---|---|
| MCQ | ✓ | ✓ | ✓ |
| Graded voice exam | 3 / month (per account, all tracks) | every layer (24h cooldown) | every layer, instructor rules |
| Result detail | pass/fail + weak-concept **names** | full report, evidence, mentor review | + cohort weak-spot stats |
| Practice mode | small monthly cap | higher daily cap | per org |
| Certificate | — | shareable, verified, audio clips | co-branded |
| Custom rubrics/prompts | — | — | ✓ |

Rules: **never charge per retry.** Free users must still see which concepts to fix (names only) or the mentor gate is meaningless — so "pass/fail only" means *no scores or evidence*, not *no direction*. **Dependency:** none of this is enforceable until billing/feature-gate exists (F2); until then use an allow-list flag.

---

## 15. Metrics

| Metric | Target / use |
|---|---|
| First-attempt pass rate | 40–70% (<20% ⇒ unfair/too hard; >90% ⇒ not discriminating) |
| Grader agreement (pass/fail, run A vs B) | ≥ 90%; disagreement-flag rate < 10% |
| **Human calibration** (golden set, Cohen's κ) | ≥ 0.7 **before any hard gate** |
| Completion rate (started → graded) | track; technical-failure rate < 2% |
| Retry success after mentor gate | % passing attempt 2; time-to-retry |
| Weak-spot resolution after gate | % of gated concepts later scoring 2 |
| STT quality | WER on glossary terms (sampled) |
| Perceived fairness | 1-question post-exam "felt fair" ≥ 4/5 |
| Regrade request / overturn rate | overturn > 15% ⇒ grader/rubric defect |
| Cost per graded exam / per paying user | within §12 sub-budget |
| MCQ-pass → voice-start conversion | engagement |
| Layer N → N+1 time | must not regress when voice exam ships |

---

## 16. UI notes (prose — `frontend-design` skill unavailable)

- **Entry:** layer detail shows a "Voice exam" card beside "Take exam": status (locked/ready/cooldown/gate), attempts, quota.
- **Pre-exam:** consent (first time), mic check (level meter), what to expect, "Practice first" link. Calm, low-stimulus visual design — oral exams are stressful.
- **Recording screen:** one large prompt, big record/stop, countdown for the *segment* and a quiet overall deadline, no live transcript in graded mode (it invites self-editing); waveform only.
- **Between turns:** neutral "Transcribing…" state; the next question appears as text (+ optional audio).
- **Results:** pass/fail first; Pro shows concept bars with quoted evidence; failures show the **mentor review checklist** and the retry-unlock time.
- **Accessibility:** typed fallback, captions for any examiner audio, keyboard operable, no time pressure in practice.
- **Reuse:** `useSpeechDictation` stays for practice mode; graded mode uses `MediaRecorder` → server STT.

---

## 17. Open questions (with recommendations)

| # | Question | Recommendation |
|---|---|---|
| Q1 | **Hard or soft gate?** Does the voice exam *block* the next layer, or grant a "verified" status while MCQ still unlocks? Free allows only 1 voice exam/month — a hard gate would cap free users at 1 layer/month. | **Soft gate in V1** (MCQ unlock unchanged, voice = "verified" + certificate eligibility). Switch to a hard gate for Pro only after Phase 5 calibration (κ ≥ 0.7). Avoids a migration of `layerProgress` and avoids locking people out on an uncalibrated LLM grader. |
| Q2 | Prompt coverage: every prompt covers all mustHave (A) or bank covers collectively (B)? | **A.** |
| Q3 | **Examiner TTS.** The brief wants a calm examiner voice and budgets TTS; earlier you said you do *not* want the AI answering by voice. Is spoken *examiner questions* in scope, with **no spoken feedback**? | Text-only V1; add optional examiner TTS in Phase 4. Never speak feedback or mentor replies. |
| Q4 | MCQ granularity: keep one MCQ per layer (today) or build per-mini-topic MCQs? | Keep per-layer for now; "all MCQs passed" = the layer MCQ passed. Per-topic MCQs are a separate project. |
| Q5 | Typed fallback: open to everyone or accessibility-declared only? Paste from an LLM is the obvious cheat. | Open to all in V1 but paste disabled, marked `typed` on the result/certificate; reconsider with data. |
| Q6 | Practice prompts: separate pool or shared with graded? Shared spoils the bank. | Separate pool (≥2 per layer); extra authoring cost. |
| Q7 | Can the learner edit the transcript before it is graded? | **No** in graded mode (it becomes a typing channel); yes in practice. Offer "flag a mis-heard term" instead. |
| Q8 | What counts as "mentor review complete"? | V1 log + ≥3 learner turns; upgrade to a 2-question mentor check. |
| Q9 | Abandonment/technical-failure accounting | As §7. |
| Q10 | Regrade/appeal: free, capped, who reviews? | One free regrade per attempt, handled by a third grader run; human queue only for flagged. |
| Q11 | Audio retention & clip consent | 30-day audio retention, transcripts kept, clips opt-in per certificate. |
| Q12 | Tier detection before billing exists | Env/allow-list flag now; `featureGateService` slot reserved. |
| Q13 | Rubric authorship/review (the real long pole) | Human-authored; LLM may *draft*, a human publishes (`reviewedBy` required). ~2–3 h/layer ⇒ pilot **one layer, then one track (10)**, not all 40. |
| Q14 | Pilot layer | Backend "Authentication & Security" (JWT content/concepts partly exist) — confirm real `layerId` first. |
| Q15 | Second grader model | Different family from the first; budget in §12. |
| Q16 | Free-tier monthly window | Rolling 30 days. |

## 18. Risks

1. **Grader unfairness/inconsistency** — the product-defining risk. Mitigation: rubric + verified quotes + dual grading + golden-set calibration; soft gate until proven.
2. **STT bias against accents/jargon** — content scoring inherits transcription errors. Mitigation: glossary biasing, typed fallback, no-edit-but-flag, WER tracking, never gate on STT confidence.
3. **Content cost** — rubrics/prompts are hand-authored; 40 layers is ~100 hours. Pilot narrow.
4. **Cost drift** — dual strong-model grading + TTS can erode the $6 ceiling alongside mentor chat. Per-user cost meter, practice caps.
5. **Prompt-bank leak** — 3–5 prompts is small. Skins/rewrap, per-answer follow-ups; accept some residual.
6. **Hallucinated credit / quote forging** — handled by code verification (§5.2).
7. **Missing foundations** — no billing (F2), no rate limits (F7), no object storage (F8). Each is a blocker for its phase.
8. **Privacy** — voice is biometric-adjacent; consent + retention + vendor no-training flags required before launch.
9. **Stress/anxiety** — mitigated by practice mode and calm UX; track "felt fair".
10. **Double-counting evidence** — avoided by not writing `examHistory` (F4).

---

## 19. Phased build plan (smallest working loop first)

Each phase leaves the app working and ships something testable. **Phase 1 deliberately has no audio** — it proves the hard, risky part (grading + turn model) cheaply.

| Phase | Scope | Exit criteria |
|---|---|---|
| **0 — Decisions & content** (no code) | Resolve Q1–Q8; author **one** layer: rubric, 3–5 prompts, glossary, probes, 2 practice prompts; build the prompt-coverage validator + test | Rubric/prompts reviewed and published in the DB seed |
| **1 — Text-only vertical slice** | `voice_exam_*` collections, state machine, turn log, dual grading engine with quote verification + pass rule, one-question-at-a-time invariants, typed turns only, minimal UI, allow-list flag, Zod + rate limits | One layer can be taken end-to-end in text; unit tests for pass rule, quote verification, state-guard races, coverage validator; golden transcripts (≥10) behave as labelled |
| **2 — Voice in** | `MediaRecorder` → upload → Groq Whisper STT with glossary; recording UI, segment timers, absolute deadline, mic check, consent; audio storage + retention job | Spoken exam works on Chrome + Safari; STT failure ⇒ `FAILED_TECHNICAL`, not counted |
| **3 — Failure loop** | Weak spots + mastery adapter, `voice_exam_gates`, 24h cooldown, mentor gate + `deriveNextAction` action + `get_voice_exam_status` tool, profile attempt history | Fail → weak spots appear in mentor context → gate clears → retry on a different prompt |
| **4 — Examiner voice + practice** | Practice mode (no storage/history, caps, separate prompts), optional examiner TTS with cached prompt audio, calm UX polish, optional prompt rewrap with verifier | Practice never touches history/mastery; examiner never emits evaluative language |
| **5 — Calibration & fairness** | Golden set ≥30 human-labelled transcripts incl. STT-noise variants; agreement/κ dashboard; flagged-attempt review queue; regrade flow; per-exam cost telemetry | κ ≥ 0.7, flag rate < 10%, cost within §12 — **only then** consider a hard gate |
| **6 — Plans & quotas** *(blocked on billing)* | `featureGateService`, Free 1/month + caps, Pro unlimited w/ cooldown, per-user cost meter | Quotas enforced server-side |
| **7 — Pro value** | Full report, benchmarks (N≥50), verified certificate page with consented clips | Shareable verify URL works |
| **8 — Group / Edu** | Orgs, cohorts, instructor dashboard, custom rubrics/prompts, instructor rule overrides (`rulesResolver`) | One pilot cohort |
| **9 — Live conversation** | Streaming STT + LLM + TTS over WebSocket against the **same** turn model | Live exam produces the same attempt document shape |

**Scale-up order after the pilot layer works:** remaining 9 layers of the pilot track → the other 3 backend tracks, gated on Phase 5 metrics, not on enthusiasm.

---

## 20. Future idea — human senior mentors & exemplar answers (NOT in V1)

Raised 2026-10-01. Concept: besides the AI mentor, **real senior engineers** take part — e.g. listening to the best voice answers of top-rated students, and top students getting an opportunity out of it. Exact shape is undecided; candidates: (1) anonymised, consented **exemplar answers** played to learners as "how a top student explained X"; (2) human reviewers for flagged/top-scoring exams (also the human calibration set for §5/Phase 5); (3) an opportunity for top students (recognition, paid mentoring, mentor pipeline, employer visibility); (4) a human in the post-fail review gate.

Notes: this **conflicts with `BUSINESS_MODEL.md`** ("no human instructors — the AI agent is the mentor"); recorded there as a possible future direction rather than a decision. Requires per-clip learner consent. Design hook already in the data model: attempts store per-concept scores, verified quotes and STT segment timestamps, which is most of what exemplars/reviews would need. Overlaps the Edu tier and the long-term employer marketplace.

---

*Awaiting approval. Nothing in this document has been implemented.*
