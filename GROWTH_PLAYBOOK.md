# DevsWebs — Growth Playbook

> **Classification:** Founder-Only Strategic Document
> **Date:** 2026-06-11
> **Prepared by:** Startup Co-Founder & Product Strategy Advisor
> **Scope:** How to launch, how to get real users, and which discipline to use when (sales vs marketing vs growth)

---

## Table of Contents

1. [How to Actually Start — Week by Week](#1-how-to-actually-start--week-by-week)
2. [The Modern User Acquisition Playbook](#2-the-modern-user-acquisition-playbook)
3. [Sales vs Marketing vs Growth — Know the Difference](#3-sales-vs-marketing-vs-growth--know-the-difference)
4. [The Single Metric That Decides Everything](#4-the-single-metric-that-decides-everything)

---

## 1. How to Actually Start — Week by Week

### Week 1 — Close the Loop (Nothing Else Matters)

Follow the 7-day plan in `STARTUP_ADVISOR_ANALYSIS.md` exactly. One path, three layers, working AI agent, basic exam. Do not touch Weekly Challenges, Awards, Company Portal, or any other phase.

**The only acceptable output of Week 1:** a developer can sign up, study Layer 1, ask the AI agent a question, take a 5-question exam, pass or fail, and have the result saved. That's it.

---

### Week 2 — Get 10 Real People Through It

Not friends who will be nice. Developers who match the Keanu persona — self-taught, job hunting, frustrated. Find them in:

- r/learnprogramming
- The Odin Project Discord
- Your own network if any fit the profile

Watch them use it. Don't help them. Just observe. Write down every place they hesitate, get confused, or quit. Fix the top 3 problems. Ignore everything else.

**The question this week answers:** do people come back for Layer 2 after completing Layer 1?

---

### Week 3 — Wire Stripe, Start Charging

If at least 5 of your 10 users came back for Layer 2, put the paywall at Layer 3. Don't wait for perfect. Don't wait for the Awards system. Wire Stripe Checkout in one day — it is a ~200-line integration. Gate Layer 3 behind $15/month.

**The question this week answers:** will anyone pay?

---

### Simultaneously — Starting Day 1, 20 Minutes a Day

Post on X/Twitter. Not marketing copy — show the actual work:

- "Day 1: seeding the Backend Developer path into MongoDB. Here's the data model."
- "Day 4: first time the AI agent streamed a response. It works."
- "Day 7: 10 developers just went through the loop. Here's what broke."

This builds an audience before you need one. When you launch on Reddit or Product Hunt, you have people who already know the story. Without this, you launch into silence.

---

### What NOT to Do in the First Month

- Do not build the Awards system yet — you have no users to award
- Do not build the Company Portal yet — you have no profiles to show companies
- Do not write a landing page — your Reddit post is your landing page
- Do not optimize bundle size, refactor the codebase, or fix cosmetic issues
- Do not add a second roadmap path until the first one has 20 completions

---

### Realistic Timeline

| Week | Goal |
|---|---|
| 1 | Loop working end-to-end |
| 2 | 10 real users through it, top 3 issues fixed |
| 3 | Stripe live, first paying user |
| 4–6 | Fix what breaks, get to 10 paying users |
| Month 2–3 | Add second path, start Awards system, grow to 50 Pro users |
| Month 4–6 | Company Portal design + first employer conversations |

You do not need funding to get to Month 3. You need $15/month × 10 users = $150 MRR — enough to cover hosting and prove the model. That is the real starting line.

---

## 2. The Modern User Acquisition Playbook

Ranked by effort-to-result for a dev-facing product with $0 budget.

### Tier 1 — Highest Conversion, Do These First

**1. Direct DMs to people already asking for your product (sales)**

The most underrated channel. Go to r/learnprogramming and r/cscareerquestions and search for posts like:

- "How do I know if I'm ready for a junior role?"
- "Finished a course but I feel like I learned nothing"
- "What should I learn next?"

These people are *publicly describing the exact problem you solve*, this week. DM them:

> "I saw your post — I'm building something that diagnoses exactly this. Want to try it free and tell me if it helps?"

Conversion from this is 10–30%, versus ~1% from broadcast posts. **Your first 20 users should all come from here.**

**2. Build in public on X/Twitter — with the modern format (marketing)**

The current meta is not text threads — it is **short screen-recorded videos**. A 30-second clip of the exam failing someone and the AI explaining exactly what they got wrong will outperform any text post. The product is visual — show it moving.

- Post 3x/week
- Reply to every comment
- Engage with bigger accounts in the learn-to-code niche so their audience sees you

**3. Discord communities — give value first (sales/community)**

The Odin Project, freeCodeCamp, 100Devs, Scrimba Discords. Don't post your link on day one — answer people's questions for a week, become recognizable, *then* share "I built something for exactly this problem." Communities ban drive-by promo but welcome members who contribute.

---

### Tier 2 — Big Spikes, Use Once the Loop Works

**4. One well-crafted Reddit post (marketing)**

The format that works: **a story with data, not a pitch.**

> "I built a learning platform where you can't skip levels. 10 developers tried it — 7 failed the Layer 1 exam. Here's what that taught me about tutorial hell."

That title gets clicks because it is honest and slightly provocative. "Check out my platform" gets removed. One good post on r/learnprogramming can bring 500–2,000 visitors in a day.

**5. Short-form video — TikTok / YouTube Shorts / Reels (marketing)**

The learn-to-code audience on TikTok is enormous and underserved by actual products. Format that works:

> "I asked an AI to test whether I actually know JavaScript. It humbled me."

Film yourself (or a tester) taking the exam and reacting. One video hitting even modestly = thousands of exactly-right viewers. **Highest-ceiling free channel right now.**

**6. Hacker News Show HN + Product Hunt (marketing)**

Save these until the product is genuinely solid — you get one good shot at each. HN will stress-test your claims, so the exam integrity story must hold up.

---

### Tier 3 — Compounding, Start Early but Expect Slow Results

**7. SEO via the existing blog platform (marketing)**

You already have a blog system with content. Posts like "Backend developer roadmap 2026 — with exams" target searches your ICP makes daily. Slow burn — 3–6 months to traffic — but it compounds and is free forever.

**8. The built-in viral loop (growth)**

Already designed: shareable progress cards, award shares, public profiles. Build the share button **into the MVP**, not later — every user who passes Layer 1 should be one click away from posting it.

---

### What Does NOT Work Anymore

- **Paid ads** — CAC will exceed LTV at $15/month; don't touch until conversion data exists
- **Cold launching a landing page with a waitlist** — waitlists without an audience collect 12 emails
- **Posting in 20 places at once** — pick 2 channels and go deep; shallow presence everywhere converts nowhere

---

### The Honest Summary

The modern playbook for a dev-facing product with zero budget:

1. **Manual, unscalable recruitment** of the first 20 users (DMs)
2. **One channel of consistent public building** (X or TikTok video)
3. **One big honest story post** (Reddit) when the loop works

Everything else is a distraction until you have 50 users and know your return rate.

The thing founders get wrong: they look for *scalable* channels before they have *any* users. The first 20 users should be hand-recruited, one conversation at a time. "Do things that don't scale" is still the meta — it just looks like Discord DMs and screen recordings now.

---

## 3. Sales vs Marketing vs Growth — Know the Difference

People use these words loosely. They are different disciplines with different timing:

| Term | What It Means | DevsWebs Examples |
|---|---|---|
| **Marketing** | Broad awareness — making people know and want the product | Build in public on X, Reddit story post, TikTok videos, SEO blog posts |
| **Sales** | Direct 1-on-1 conversations to convert a specific person | DMing Reddit users who describe the problem, talking to engineering managers for the Teams tier |
| **Growth** | Mechanisms built *into the product* that bring users | Shareable progress cards, award shares, public profiles, the viral loop |

### Why the Distinction Matters Practically

- **Marketing** scales but is slow to start (nobody knows you)
- **Sales** doesn't scale but works from day one (that's why the first 20 users come from DMs)
- **Growth** only works once you *have* users (a share button with zero users shares nothing)

### The Correct Sequence for DevsWebs

```
SALES first        →  hand-recruit the first 20 users via DMs
MARKETING second   →  build in public, Reddit post, short-form video
GROWTH third       →  viral loop kicks in once real users are passing layers
```

Most technical founders do it backwards — they build growth features and write marketing posts while avoiding the uncomfortable part: directly asking a stranger to try their product. **The DMs are the part that feels awkward and the part that matters most.**

---

## 4. The Single Metric That Decides Everything

> **Layer 1 → Layer 2 return rate within 7 days.**

- Above 50% — you have something. Keep building.
- Below 20% — the loop is broken. Figure out why before adding any new feature.

Everything else — Awards, Company Portal, Weekly Challenges, Platform Intelligence — is only worth building if this number is healthy.

**That number is the startup.** Not the vision document, not the business model. That number.

---

*Generated 2026-06-11 — Revisit after the first 20 users. Every channel ranking above is a hypothesis until your own data confirms it. The channel that brings users who come back for Layer 2 is your channel — double down there and drop the rest.*
