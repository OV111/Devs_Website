# XP System — Ideas and Critique

> Date: 2026-10-01 · Status: ideas only. Nothing here should be built before the pilot has retention data (`docs/STARTUP_CRITIQUE_2026-10.md`).

## Current state (verified in code)

| What | Where |
| --- | --- |
| XP is stored as `userProgress.xpTotal` | `backend/services/userProgressService.js` |
| **Earned only** by solving Arena coding challenges | `modules/coding-challenges/services/submissionService.js` (`$inc: { xpTotal: xpEarned }`) |
| **Spent only** on Arena hints, with a guarded update so the balance can't go negative | `modules/coding-challenges/services/attemptService.js` (`xpTotal: { $gte: cost }`) |
| The mentor can see it | `services/agent/learnerContextService.js` |
| `incrementXP()` exists but is never called, and it has no guard against going negative | `userProgressService.js` |

So the roadmap, the exams and teach-back, which make up the core loop, give **no XP**. Today XP only means something to Arena users.

## The rule every idea is judged against

**XP measures effort. It never measures proof.** Keep two separate numbers:

| | XP | Mastery / verified results |
| --- | --- | --- |
| Means | "I've been active and put in work" | "I showed I understand this" |
| Comes from | Activity, solving, streaks | Exams and teach-back only |
| Can be spent | Yes (hints and other in-product perks) | Never |
| Can be bought | Never with money | Never |
| Who sees it | Mainly the learner | Learner, and employers later |

If XP can unlock, skip or prove anything, the "earned roadmap" stops meaning anything. That's the same integrity problem as `docs/EXAM_INTEGRITY.md`, just in a different place.

## Ideas, by area

Verdict: **Now** = cheap and safe for the pilot · **Later** = only if pilot data shows the need · **Never** = harms the product.

### 1. Learning loop (roadmap, exams, teach-back)

| Idea | Why it might help | Critique | Verdict |
| --- | --- | --- | --- |
| XP for passing a layer exam (first pass only, more for a higher score) | Connects the core loop to the XP economy, so non-Arena users can afford hints | Passing already unlocks the next layer, so it's a double reward. Without "first pass only", people farm it with retries | **Later** (first pass only) |
| XP for a teach-back explanation that passes | Rewards the hardest, most valuable action | LLM grading isn't calibrated yet (κ target 0.7). Paying out XP on unreliable grades rewards the wrong answers | **Later**, once grading is calibrated |
| XP for reading library resources or "studying" a layer | Rewards preparation | Rewards clicking, not learning, and can't be checked. Easy to farm | **Never** |
| Unlock layers with XP instead of exams | Gives an alternative route for people who struggle with exams | Destroys the core idea: layers must be earned by showing understanding | **Never** |
| Spend XP to skip the cooldown or buy extra exam attempts | Gives XP something useful to buy | Undoes the integrity work (cooldown, unseen-first). Brings back retry-until-pass | **Never** |

### 2. Practice (Arena)

| Idea | Why it might help | Critique | Verdict |
| --- | --- | --- | --- |
| XP for solving challenges | Already built | Fine. Check that re-solving the same challenge can't farm XP | **Keep** (check farming) |
| Spend XP on hints | Already built, with a balance guard | Good design. Keep hints out of exams completely | **Keep** |
| Daily or weekly challenge with bonus XP | Gives people a reason to come back | Needs fresh content every week from a solo founder. The Arena itself is outside the pilot scope | **Later** |

### 3. Retention (streaks, levels, nudges)

| Idea | Why it might help | Critique | Verdict |
| --- | --- | --- | --- |
| Streaks (days in a row with a meaningful action) | Proven in Duolingo and Boot.dev; pulls people back | Causes anxiety and churn when a streak breaks. Trivial actions keep it alive. Only fixes retention, which hasn't been measured yet | **Later**, only if the pilot shows people don't come back |
| Levels (XP thresholds with titles) | A cheap sense of progress | Duplicates roadmap layers, which already show progress. Two progress systems confuse people | **Never**: layers *are* the levels |
| Mentor nudges that mention XP ("50 XP to your next hint") | Uses the mentor you already have | Feels gimmicky. The mentor should talk about weak spots, not points | **Never** in mentor answers |
| XP decay for inactive users | Makes people come back | Punishes people who took a break. Bad feeling, quick churn | **Never** |

### 4. Social (leaderboards, community)

| Idea | Why it might help | Critique | Verdict |
| --- | --- | --- | --- |
| XP leaderboards | Competition motivates some learners | With 10 users it looks empty. It discourages beginners, and cheaters rise to the top. The Arena already has a leaderboard API that nobody uses | **Later**: weekly, opt-in, grouped by level |
| XP for writing blog posts or answering others | Grows community content | Encourages spam and low-effort posts, and needs moderation. The community features are frozen | **Later**, only for content an admin approved |
| XP for approved challenge proposals | Admin review already exists | Fine, because a human checks quality | **Later** (small) |
| XP for referrals (`docs/FUTURE_IDEAS.md:214`) | Growth | XP is worth nothing to a newcomer unless it buys something real. Encourages spam. Subscription credit (a free month) works better | **Later**, as Pro credit, not XP |

### 5. Money (Pro and billing)

| Idea | Why it might help | Critique | Verdict |
| --- | --- | --- | --- |
| Spend XP on extra mentor messages above the daily cap | Something useful to buy | It turns free XP into real AI cost, and it competes with the mentor cap you plan to sell as Pro. Only safe because XP comes from real solving | **Later**, small amounts only |
| Exchange XP for a Pro discount | Rewards loyal users | XP gains real money value, which brings fraud and farming bots, and makes XP a liability in your accounts | **Never** (for now) |
| Buy XP with money | Revenue | Pay-to-win. Destroys trust in everything else on the platform | **Never** |

### 6. Employers and profiles (Phase 9+)

| Idea | Why it might help | Critique | Verdict |
| --- | --- | --- | --- |
| Show XP on the public profile | Signals effort | Employers ignore points: nobody hires because of a Codecademy badge. Next to verified results it blurs what's actually verified | **Never** as the headline. Show verified results; XP optional and small |
| XP on a Teams manager dashboard | Managers see engagement | Measures activity, not skill, and invites managers to judge people by points | **Later**: show mastery, with XP secondary |
| Awards and badges tied to XP milestones | Moments people want to share | Same problem as levels. Awards should mark verified events (like "100/100 on an exam"), not XP totals | **Later**, based on verified events only |

## Overall critique

- **XP is not a differentiator.** Boot.dev already sells XP, quests and streaks to over 1M learners in your exact niche. Copying it makes you look like a smaller Boot.dev.
- **XP fixes retention, and you have no retention data.** Building it before the pilot means guessing the cure before you know the disease.
- **The biggest risk is mixing XP with proof.** Every "Never" above comes down to that.

## Recommendation

1. **Before the pilot:** build nothing. During the pilot, record whether people come back (event tracking).
2. **If fewer than half return for Layer 2:** try **first-pass exam XP** plus **streaks tied to real actions** (an exam, a teach-back or a solved challenge), and measure again.
3. **Housekeeping:** delete the unused `incrementXP()` or give it the same `$gte` guard the Arena uses before anyone calls it.
