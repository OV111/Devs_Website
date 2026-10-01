# Exam Integrity — Anti-Cheating Plan

> Date: 2026-10-01 · Status: #1, #2 and #4 built 2026-10-01 (banks not yet re-seeded to 60); #3, #5 not built; #6 ruled out
> Context: fix #2 in `docs/STARTUP_CRITIQUE_2026-10.md`.

## The honest constraint

No unproctored online exam is cheat-proof; HackerRank and CodeSignal accept the same limit. The goal is to **raise the cost of cheating** and to **stop claiming more than the exam proves**. Multiple-choice questions (MCQ) can never be made ChatGPT-proof, because LLMs are very good at them.

## Current state (verified in code)

- `examEngineService.js` already samples and shuffles: `shuffle(bank.questions).slice(0, QUESTIONS_PER_EXAM).map(shuffleChoices)`.
- But `examSeeder.js` makes banks of exactly 15 questions (`QUESTIONS_PER_LAYER = 15`), and the exam serves 15. So **every attempt shows the whole bank**, and after 3 attempts a learner has seen every question.
- `COOLDOWN_ENABLED = false` (temporary flag, never switched back on).
- `TIME_LIMIT_SECS = 600` for the whole exam (about 40s per question).
- No tab-switch or paste logging. No proctoring.
- `VISION.md` §5 claims "AI-proctored exam record." **False today; remove it.**

## Existing ideas in the repo

| Where | Idea | Built? |
| --- | --- | --- |
| `docs/ROADMAP_BUILD_PLAN.md:69` | Reviewed bank + AI-generated per-attempt variation | Sampling yes, variation no; the bank is too small for sampling to matter |
| `docs/VOICE_EXAM_SPEC.md` §8 | Unpredictable follow-ups, strict time limit, no pause, paste and timing logged as review-only signals; no webcam | No |
| `docs/FUTURE_IDEAS.md:111` | "How to handle cheating/AI-assistance during remote assessments?" | Open question |

## Techniques, cheapest first

| # | Technique | Stops | Doesn't stop | Cost |
| --- | --- | --- | --- | --- |
| 1 | **Bigger bank:** about 60 questions per layer, serve a random 15, prefer questions this user hasn't seen | Memorizing and sharing answers | Live ChatGPT | 1–2 days + hand-review of 4x more questions |
| 2 | **Turn the cooldown back on** (`COOLDOWN_ENABLED = true`) | Rapid retrying until you pass | Live ChatGPT | Minutes |
| 3 | **Per-question timer** (about 45s, no going back) | Slows copy-to-ChatGPT | A fast cheater | Hours (frontend + server-side check) |
| 4 | **Integrity signals:** log tab-switch (`visibilitychange`) and paste events, flag only, never affects the grade | Nothing alone; marks suspicious attempts for review | Second device | Hours |
| 5 | **Oral teach-back with follow-ups** (`VOICE_EXAM_SPEC.md`) | Most cheating; it's hard to fake explaining something live | A live LLM on a second screen (raises cost, not airtight) | Weeks |
| 6 | **Webcam/screen proctoring** | Most cheating | Determined cheaters | Expensive, invasive, bad for B2C. **Ruled out** |

## Decision (recommended)

1. **Reposition (free, now).** The MCQ exam is *practice and self-diagnosis*: it unlocks layers and finds weak spots, and cheating only cheats yourself. **Only the oral teach-back counts as the credential.** This matches the industry pattern: practice tests are unproctored, certification is proctored.
2. **Build #1, #2 and #4** so the MCQ exam can't be passed by memorizing, and suspicious attempts are visible.
3. **Validate #5 by hand first.** Run 5 Zoom sessions where the founder acts as the examiner before writing any voice code (`STARTUP_REVIEW_2026-10.md` §8, A2).
4. Until #5 exists, no doc or pitch says "hard to fake" or "verified" about the MCQ exam.

## How to test it worked

- **Memorization test:** take the same layer 3 times; fewer than half the questions should repeat between attempts.
- **ChatGPT test:** someone who hasn't studied, with ChatGPT open, still passes. That's expected for MCQ, and it's why step 1 repositions the exam instead of pretending.
- **Signals test:** switching tabs during an attempt shows up on the stored attempt record.
