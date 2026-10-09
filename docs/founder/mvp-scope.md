<!-- /founder:mvp-scope · 2026-10-04 · input: Build Teams wishlist, solo founder part time, zero users -->

Assumption: zero users and one published capstone today (VISION.md, 2026-10-02).
Assumption: existing Vahoha code (capstone defense, GitHub client, mastery) is reusable.
Estimate: build times are my estimates for one developer, not measured.

# MVP scope: Build Teams

## 1. Triage

| Feature | Category | Reasoning |
|---|---|---|
| Application form (aim, hours, timezone) | Must have | Need to know who wants in. Use an off-the-shelf form |
| Matching by aim | Must have, by hand | 4 people need no algorithm |
| Shared project brief with roles | Must have | Reuse the capstone brief format |
| Per-member task ownership via GitHub PRs | Must have | PR author and reviewers are free evidence |
| Per-member defense of own diff | Must have | The only part that makes this proof, and the module exists |
| Evidence page per member | Must have | The thing members take away |
| Inactivity release | Should have, by hand | A manual message at day 10 is enough |
| Vacancy list | Should have, by hand | A post in the chat group |
| Peer ratings at the end | Should have | Catches free riders, costs a form |
| Review exchange | Should have | Cheapest teamwork evidence |
| `teams` collection | Won't have | A spreadsheet works for 3 teams |
| AI task assignment | Won't have | Humans can split 5 tasks |
| AI skill-level judge | Won't have | Uncalibrated, will cause disputes |
| Team moves between teams | Won't have | No second team to move to |
| Demo day | Won't have | Needs finished teams first |
| Startup support | Won't have | An outcome, not a feature |
| Sponsored projects | Won't have | Needs trust, payments and legal work |

## 2. MVP
A capstone passer can join a 4-person team, ship a small backend project in 6 weeks, and get a shareable page of their reviewed and defended work.

Features: application form, hand matching, shared brief, GitHub PR tracking, per-member defense, evidence page.

## 3. Flow
1. Learner passes capstone and sees a "Join a team" link.
2. Learner fills a 6-question form.
3. Founder forms the team and sends the brief and repo.
4. Team builds for 6 weeks. Each merged PR gets a reviewer.
5. Each member defends their own PRs.
6. Member gets an evidence page link.

## 4. Technical scope
- Buy: Google Form or Tally, a Discord server, a GitHub organization.
- Build: a per-member variant of the existing capstone defense (Estimate: 3 to 4 days), and a read-only evidence page from PR and defense data (Estimate: 3 days). Total about 1.5 weeks.
- Stack and hosting: current stack and current Render and Vercel setup, no new service.

## 5. Not building yet

| Feature | Why it feels important | Why it can wait | Revisit when |
|---|---|---|---|
| `teams` collection and matching code | Looks like a real product | Spreadsheet handles 3 teams | 10 teams ran by hand |
| AI skill-level judge | Fairness and automation | Not calibrated against humans | 50 human-graded submissions |
| Team moves | Keeps people busy | Needs many teams | 5 teams with open slots at once |
| Sponsored projects | Revenue story | Needs trust and legal work | 10 finished team projects |
| Startup support | Exciting outcome | No evidence anyone wants it | 3 teams ask for it unprompted |

## 6. Launch criteria
Must work: form submits, brief and repo delivered, PR review required before merge, defense runs on a member's own diff, evidence page loads, page shows reviews given and received, a person can leave a team.
May be ugly: page styling, form design, mobile layout.
Test with first 10 users: do they still contribute in week 4, and do they share their evidence page without being asked.
