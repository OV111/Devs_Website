# Vahoha (formerly DevsWebs) — Growth Playbook

> **Classification:** Founder-Only Strategic Document
> **Date:** 2026-06-11 · **Updated:** 2026-10-02
> **Prepared by:** Startup Co-Founder & Product Strategy Advisor
> **Scope:** How to launch, how to get real users, and which discipline to use when (sales vs marketing vs growth)
>
> **What changed in this update:** the learning loop this playbook told you to build in Week 1 is now built (roadmap, exam engine, AI mentor). The plan therefore starts at *Week 0: pre-pilot hardening*, then goes straight to recruiting. Acquisition tactics (sections 2–3) are unchanged because they never depended on the build state. The pricing and timeline in Week 3 and the table below were revised: there is still no billing code, and the $15 price was set when AI costs were higher (see `docs/strategy/BUSINESS_MODEL.md`). **Also decide the product name first** (homepage says Vahoha, everything else says Vahoha).
>
> **Update 2026-10-02:** the Week 0 hardening is mostly done (helmet, cooldown, rate limits on LLM routes, server-side event tracking and an admin funnel). Billing now exists on Polar (not Stripe, which doesn't support Armenia) but is inert. The product name is **Vahoha**. Recruiting now has a working kit: `docs/OUTREACH_KIT.md` (DM scripts, interview questions, payment test, Day-21 decision). The plan also changed in one important way: **test payment before wiring gates**, and don't treat "10 users returned" as enough evidence anyone will pay.

---

## Table of Contents

1. [How to Actually Start — Week by Week](#1-how-to-actually-start--week-by-week)
2. [The Modern User Acquisition Playbook](#2-the-modern-user-acquisition-playbook)
3. [Sales vs Marketing vs Growth — Know the Difference](#3-sales-vs-marketing-vs-growth--know-the-difference)
4. [The Single Metric That Decides Everything](#4-the-single-metric-that-decides-everything)

---

## 1. How to Actually Start — Week by Week

### Week 0 — Pre-Pilot Hardening (mostly done)

Status of the checklist from `docs/strategy/ADVISORY_BOARD_REPORT.md` §9 (full list and owners in `docs/PILOT_STATUS.md`):

- ✅ `helmet` mounted · ✅ exam cooldown back on · ✅ rate limits on the mentor and teach-back routes · ✅ 7 core events recorded server-side, with an admin funnel · ✅ product name decided (Vahoha)
- ❌ Seed exam banks for one track's Layers 1–3 and **hand-check every question** (new questions are flagged `reviewed: false`)
- ❌ Make yourself admin (`npm run admin:grant -- you@example.com`) so you can read the funnel
- ❌ Confirm Redis is on in production, and check Groq's limits for about 10 concurrent users
- ❌ Create the $29 one-off product in Polar for the payment test
- ❌ Run the loop yourself on production with a brand-new account and confirm the events show up

Do **not** extend the Arena, group chat, voice review, XP, or anything from the deferred backlog. They are built; leave them alone.

**The only acceptable output of Week 0:** a stranger could sign up, study Layer 1, ask the mentor a question, take the Layer 1 exam, pass or fail, and you would *see it happen in the funnel*.

---

### Week 1–3 — Interview, Observe, Ask for Money

Not friends who will be nice. Developers who match the persona: self-taught, aiming at backend, applying for 3+ months without an offer. Find them with the kit in `docs/OUTREACH_KIT.md`: r/learnprogramming and r/cscareerquestions (DM, don't post links), The Odin Project and 100Devs Discords, your own network. Five DMs a day.

- **Interview first (15 minutes).** Ask about what they did, not what they would do. The kit has 10 questions.
- **Then watch them take the Layer 1 exam.** Don't help. Write down every hesitation.
- **Then ask:** "How would you feel if you couldn't use this anymore?" and offer a $29 early-access slot (3 months, refundable) through a Polar checkout link. No new code needed.

**The questions this stage answers:** is the pain "I don't know what I don't know" (the product's problem) or "I can't get interviews" (not its problem), and will anyone pay? Target: 15 interviews, at least 3 payments in 3 weeks. Zero payers means pivot or stop. Return for Layer 2 is a secondary signal, read from the funnel.

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
- Do not build another landing page — the Vahoha homepage exists; your Reddit post is the real landing page
- Do not add more features. Not the Arena, not group chat, not voice review. Pilot first
- Do not optimize bundle size, refactor the codebase, or fix cosmetic issues
- Do not add a second roadmap path until the first one has 20 completions

---

### Realistic Timeline

| Week | Goal |
|---|---|
| 0 | Pre-pilot hardening: mostly done; seed and check Backend Layers 1–3 (the remaining work) |
| 1–3 | 15 interviews, observe exams, ask for the $29 payment; fix the top 3 issues |
| Day 21 | Decision: 3+ of 15 paid = widen; 1–2 = fix and repeat; 0 = pivot or stop (`docs/OUTREACH_KIT.md`) |
| 4–6 | Fix what breaks, get to the first paying users |
| Month 2–3 | Widen to 50 users, decide on a second path from data |
| Month 4–6 | Revisit Awards / Teams / employer conversations only if retention supports them |

You do not need funding to get to Month 3. Fixed hosting is on the order of $100–160/month (see `docs/strategy/BUSINESS_MODEL.md`) and AI inference is now cheap, so a handful of paying users covers costs. The real starting line is **retention evidence**, not revenue.

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

- **Paid ads** — CAC will likely exceed LTV at a ~$15/month price; don't touch until conversion data exists
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

| Term | What It Means | Vahoha Examples |
|---|---|---|
| **Marketing** | Broad awareness — making people know and want the product | Build in public on X, Reddit story post, TikTok videos, SEO blog posts |
| **Sales** | Direct 1-on-1 conversations to convert a specific person | DMing Reddit users who describe the problem, talking to engineering managers for the Teams tier |
| **Growth** | Mechanisms built *into the product* that bring users | Shareable progress cards, award shares, public profiles, the viral loop |

### Why the Distinction Matters Practically

- **Marketing** scales but is slow to start (nobody knows you)
- **Sales** doesn't scale but works from day one (that's why the first 20 users come from DMs)
- **Growth** only works once you *have* users (a share button with zero users shares nothing)

### The Correct Sequence for Vahoha

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

*Generated 2026-06-11, updated 2026-10-01 — Revisit after the first 20 users. Every channel ranking above is a hypothesis until your own data confirms it. The channel that brings users who come back for Layer 2 is your channel — double down there and drop the rest.*
