# Outreach Kit — Fix 1: Get a Real Payment Signal

> Date: 2026-10-01 · Context: fix #1 in `docs/STARTUP_CRITIQUE_2026-10.md`
> Goal: 15 interviews in 3 weeks → at least 3 people pay. Zero payers = pivot or stop.

## Who to find

**Target:** self-taught or bootcamp developers aiming at backend roles, applying for 3+ months without an offer.

| Where | How |
| --- | --- |
| r/learnprogramming, r/cscareerquestions | Search: "not ready for junior", "tutorial hell", "finished course still can't", "how do I know if I'm ready", "applied 100 jobs". Only posts from the last 30 days. **DM; don't post links** (self-promo rules) |
| The Odin Project, 100Devs, freeCodeCamp Discords | Answer questions for a few days first, then DM people who described the pain |
| Your own network | Anyone job-hunting for a junior role. Not friends who'll be nice |

**Volume:** 5 DMs a day. Expect about 1 in 4 to reply.

## DM script

**Version A (they posted about the problem):**
> Hey, saw your post about [their exact words]. I'm a self-taught dev too, building a tool around exactly that: figuring out what you actually don't know yet. I'm not selling anything right now. Could I ask you a few questions about how you're studying? 15–20 min on Discord or a call, whenever suits you.

**Version B (general/Discord):**
> Hey, quick one: I'm talking to people learning backend on their own about how they decide they're "ready" to apply. Would you be up for a 15-min chat? I'll share what I learn from everyone.

**Follow-up after 3 days, once only:**
> No worries if you're busy. Still happy to chat if it's useful, otherwise good luck with the search!

**Rules:** no link in the first message; quote their words; ask for their time, not a signup.

## Interview (15–20 min)

Ask about **what they did in the past, not what they'd do in the future**. "Would you use this?" gets polite lies. Listen 80%, talk 20%. Don't pitch until the end.

1. Walk me through how you've been learning backend over the last few months.
2. What did you use? (courses, roadmap.sh, YouTube, LeetCode…) What did you pay for?
3. Tell me about the last time you felt you "finished" something but didn't really understand it. How did you find out?
4. How do you currently decide you're ready to apply, or ready to move on to the next topic?
5. Where are you in the job search? What's happened in interviews so far?
6. What's the hardest part right now: learning, knowing what to learn, or getting interviews? *(If it's "getting interviews", note it: that's a different problem from the one this product solves.)*
7. Have you ever paid for something to fix that? What was it, and was it worth it?
8. What have you tried that didn't work? Why did you stop?
9. If you could wave a wand and fix one thing about how you're learning, what would it be?
10. Who else do you know who's in the same spot? *(referrals)*

**Record right after each call** (in the tracker below): their exact words about the pain, what they pay for today, and the answer to #6.

## Demo + payment ask (only if the pain matched)

1. Have them sign up and take the Layer 1 exam while you watch. **Don't help.** Note where they hesitate.
2. Ask: *"How would you feel if you couldn't use this anymore?"* (very disappointed / somewhat / not). 40%+ "very disappointed" is the usual product-market-fit bar.
3. The ask:
> I'm opening 20 early-access spots: $29 for 3 months of everything, full refund anytime if it's not useful. Want one?

Use a **Polar checkout link** (billing runs on Polar; see `docs/BILLING.md`). Make a one-off $29 product in Polar and share its checkout link. No new code needed. "Maybe later" counts as a no.

## Tracker

| # | Date | Source | Pain (their words) | Pays for today | Main pain (#6) | Disappointed? | Paid $29? |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | | | | | | | |

## Decision at Day 21

| Result | Meaning | Next |
| --- | --- | --- |
| ≥ 3 of 15 paid | Real signal | Keep going: widen to 50 users, stay on the Backend path |
| 1–2 paid, or ≥ 40% "very disappointed" | Weak signal | Fix the top 3 problems you saw in demos, run 10 more interviews |
| 0 paid, or most say the pain is "getting interviews" | No signal for this product | Pivot (e.g. the "flight simulator" idea in `STARTUP_REVIEW_2026-10.md` §12) or treat it as a portfolio project |
