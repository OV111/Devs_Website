# Pilot Status

> Updated: 2026-10-02 · Tracks the pre-pilot checklist (`ADVISORY_BOARD_REPORT.md` §9) and the fixes from `docs/STARTUP_CRITIQUE_2026-10.md`.

The technical prep for the pilot is mostly done. What's left is mostly yours: content review, setup, and talking to users.

## Done

| Item | Commit | Notes |
| --- | --- | --- |
| Exam cooldown back on | `3c4a6f7` | 30 min after a failed attempt |
| Unseen questions served first; seeder tops banks up to 60 | `3c4a6f7` | No effect until the banks are re-seeded (below) |
| Tab-switch and paste flags on exam attempts | `3c4a6f7` | Review only, never graded |
| Rate limits on LLM routes | `1a8c5d2` | 10/min per user on mentor and teach-back; 40/day on teach-back |
| helmet mounted | `1a8c5d2` | After `/api-docs` (Swagger needs inline scripts) |
| JWT tamper tests actually run | `1a8c5d2` | Were erroring on a bad import; now pass |
| Event tracking (7 events) + admin funnel | `c89aadf` | `GET /api/admin/funnel?days=30` |
| Blog posts tagged with roadmap layers; "Posts for this layer" in the layer drawer | next commit | `layerIds` on posts, `GET /blogs?layer=<id>`, layer picker in the blog editors. SEO for the blog (pre-rendering) deliberately left until after the pilot |
| Docs: critique, exam integrity, outreach kit, XP system | `3c4a6f7`, `1a8c5d2` | Also tabs in the online critique doc |

## Left before the first user

| # | Item | Owner | How |
| --- | --- | --- | --- |
| 1 | Re-seed exam banks for **one track, Layers 1–3** | You | Set `layers: [...]` in `SEED_CONFIG` (`examSeeder.js`), run the seeder |
| 2 | Hand-check every question marked `reviewed: false` | You | About 135 questions. A wrong answer key on a gated exam destroys trust |
| 3 | Make yourself admin so you can read the funnel | You | In MongoDB: set `role: "admin"` on your user |
| 4 | Pick one product name (Vahoha or DevsWebs) | You | Claude can do the find-and-replace after |
| 5 | Remove "AI-proctored" and "hard to fake" claims | You or Claude | `VISION.md` §5; see `docs/EXAM_INTEGRITY.md` |
| 6 | Confirm Redis is on in production | You | Auth rate-limit counters depend on it |
| 7 | Check Groq limits for about 10 concurrent users | You | Move to the paid tier if the free tier rate-limits |
| 8 | Create the $29 one-off product in Polar | You | For the payment test in `docs/OUTREACH_KIT.md` |
| 9 | Run the full loop yourself on production with a new account | You | Sign up, pick a path, take an exam, ask the mentor, then check the funnel shows it |

## Then: the pilot

- Send 5 DMs a day (`docs/OUTREACH_KIT.md`). Target: 15 interviews in 3 weeks.
- **Pass:** at least 3 of 15 pay $29. **Kill/pivot:** zero payers.
- Read the funnel weekly. The number that matters: share of users who return within 7 days and start a second layer.

## Known limits (fine for the pilot)

- Rate-limit counters are in memory: they reset on restart and aren't shared across instances. Move to Redis before scaling out.
- The funnel loads the whole cohort into memory. Fine at pilot scale; switch to an aggregation pipeline before thousands of users.
- `active_day` comes from login and token refresh, so it means "opened the app that day", not "studied".

## Frozen until pilot data says otherwise

Voice exam, Arena features, new paths, awards, XP changes (`docs/XP_SYSTEM.md`), group chat, Teams and employer tiers.
