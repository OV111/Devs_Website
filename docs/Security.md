# Security — Vahoha (formerly DevsWebs)

> **Status review: 2026-10-02** — every finding from the 2026-06-11 white-box audit was re-checked against the code (grep and reading, no penetration test). The original audit follows the status section unchanged, as the historical record.
> **Original audit:** 2026-06-11 | Scope: Express/MongoDB backend, JWT auth, WebSocket chat, OAuth flows, React frontend | Method: white-box code review

---

## Status of the 2026-06-11 findings

| # | Finding | Severity | Status | Evidence / what remains |
|---|---|---|---|---|
| 1 | Live secrets in `backend/.env` | Critical | **Unknown: you must confirm** | `.env` is git-ignored and not tracked. Whether the credentials were rotated cannot be checked from code. Sandbox Polar token and webhook secret were also pasted into a chat: rotate before production |
| 2 | Chat IDOR (any user reads any room) | Critical | **Fixed** | `chatService.js` checks `room.members.includes(...)`; the client-dictated `members` overwrite is gone |
| 3 | JWT: 7-day tokens, no revocation | High | **Fixed** | 15-minute access tokens plus rotating refresh tokens stored server-side and revocable (`jwtToken.js`, `refreshTokenService.js`). `/verify-token` still only checks the signature |
| 4 | JWT in the OAuth redirect URL | High | **Fixed** | GitHub callback sets the refresh cookie and redirects to `/oauth-success` with no token in the URL |
| 5 | OAuth auto-link by email | High | **Open** | GitHub sign-in still matches `{ $or: [{ githubId }, { email }] }` and Google matches by `email`, so someone controlling a matching email on the provider side gets the existing account. The CSRF `state` problem is fixed (single-use nonce), but the nonce store is in memory, so it fails across restarts or multiple instances |
| 6 | NoSQL operator injection on auth routes | High | **Open** | No type validation on auth bodies and no Zod schema on those routes. Login happens to throw on a non-string `email` before querying (500, not 400); signup and forgot-password were not re-tested |
| 7 | `PUT /my-profile/` trusts a body `id` | High | **Partly fixed** | `updateLastActive` now derives the id from the verified token. The `/my-profile` router still doesn't mount the `authenticate` middleware; each controller parses the token itself |
| 8 | Session cookie `secure: false` | Medium | **Fixed** | The plaintext user-id session cookie is gone; the refresh cookie is `httpOnly`, `secure: true` (`authController.js`) |
| 9 | Username enumeration on login | Medium | **Open** | Login still returns `404 "User is not Found!"` vs `401 "Password is incorrect"` |
| 10 | Internal `err.message` leaked | Medium | **Open** | Several handlers still return `error: err.message` (e.g. `signUp`, login route). No global error handler |
| 11 | No rate limiting outside login/signup; Redis failure → 500 | Medium | **Partly fixed** | Added: login/signup/reset limiters, billing limits (10/min), LLM routes (mentor stream, teach-back: 10/min per user, 40/day teach-back), daily cap on Arena submissions. Redis calls on login are null-guarded. Still unlimited: search, comments, blog creation, WebSocket. Counters are in memory |
| 12 | Missing security headers | Medium | **Fixed** | `helmet()` mounted in `app.js` (default policy). It is mounted after `/api-docs` on purpose: helmet's default CSP blocks Swagger UI's inline scripts |
| 13 | Swagger UI public | Low | **Open** | `/api-docs` is mounted unconditionally |
| 14 | `dangerouslySetInnerHTML` in the Arena | Low → **Medium** | **Open, risk grew** | Now `renderInlineCode()` in `ProblemPanel` and `HintsPanel`, which only restyles `<code>` and does not sanitize. Challenge text now comes from the database and community proposals, so it is a real stored-XSS path. Sanitize with DOMPurify or render Markdown |

## New surface since June

| Area | Risk | Status |
|---|---|---|
| **Arena code runner** (`modules/coding-challenges/services/runnerService.js`) executes submitted code | Still the largest attack surface | **Contained by design, not independently reviewed.** Code runs in an `isolated-vm` V8 isolate (64 MB, 5 s). If that native addon fails to build, production refuses submissions (fails closed) instead of using the weaker child-process fallback, unless `ALLOW_UNSAFE_RUNNER=true` (never set it). Check `GET /api/challenges/submissions/runner` reports `isolated-vm` after each deploy. A second look at the isolate is still worth doing before public traffic |
| **Billing webhook** (`/api/billing/webhook`) | Forged webhooks could grant Pro | Signature verified over the raw body; fails closed with no secret (503), 403 on bad signature (`docs/BILLING.md`). Gating is inert until `BILLING_ENFORCED=true` |
| **LLM endpoints** (mentor, teach-back) | Quota exhaustion, runaway cost | Per-user burst and daily limits added; mentor also has its 30/day cap. Counters are in memory |
| **Exam integrity** | Credential can be faked | Answer keys server-side, choices shuffled, unseen-first, cooldown on; tab-switch and paste counts recorded as flags only. Multiple-choice cannot be made ChatGPT-proof (`docs/EXAM_INTEGRITY.md`) |
| **Admin endpoints** (`/api/admin/funnel`, challenge review) | Privilege escalation | `requireAdmin` re-reads the role from the database on every request and answers 404 to non-admins. First admin is created with `npm run admin:grant` |
| **Attachments to the mentor** | Prompt injection | Client extraction, server-enforced size caps, prompt-injection fencing |

## Fix order now

| Priority | Fix | Effort |
|---|---|---|
| 1 | Confirm all secrets were rotated; rotate the pasted Polar sandbox credentials | Ops |
| 2 | Confirm the runner reports `isolated-vm` in production and have the isolate reviewed before public traffic | Medium |
| 3 | Sanitize challenge HTML (finding 14) | Low |
| 4 | Stop auto-linking OAuth accounts by email (finding 5) | Medium |
| 5 | Zod-validate auth bodies (finding 6) | Low |
| 6 | One generic login error (finding 9) and remove `error: err.message` (finding 10) | Trivial |
| 7 | Mount `authenticate` on all `/my-profile` routes (finding 7) | Low |
| 8 | Hide `/api-docs` in production (finding 13) | Trivial |
| 9 | Move rate-limit counters and the OAuth nonce store to Redis before running more than one instance | Medium |

---

# Original audit (2026-06-11)

## Summary

I reviewed the Express/MongoDB backend, JWT auth, WebSocket chat, OAuth flows, and the React frontend. The single most urgent issue is that **live production secrets are sitting in `backend/.env`** — rotate those today regardless of anything else. Below are all findings, ordered by severity.

---

## Findings

### 🔴 CRITICAL — Live secrets exposed in `.env`

📍 **Location:** `backend/.env`

💥 **Attack scenario:** The file contains real, working credentials: a MongoDB Atlas connection string with username + password, the JWT signing secret, Cloudinary API secret, a Resend API key, and Gemini/Groq keys. A second commented-out DB URI with another password is also present. Anyone who obtains this file gets full read/write to the entire database, can forge any user's JWT (full account takeover of every account), upload/delete media, and send mail as you. The JWT secret leak alone means auth is completely broken — an attacker mints a token for any `id`.

🛡️ **Fix:**

1. **Rotate every credential now**: Atlas DB password, `JWT_Secret` (invalidates all existing tokens — acceptable), Cloudinary secret, Resend, Gemini, Groq, and the GitHub OAuth client secret.
2. Confirm the file is git-ignored and purge it from history if ever committed:
```bash
git rm --cached backend/.env
echo "backend/.env" >> .gitignore
# scrub history with git filter-repo if it was ever pushed
```
3. Generate a strong random JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
4. Move secrets to the host's secret manager (Railway/Render env vars), never a file in the tree.

---

### 🔴 CRITICAL — Chat IDOR: any user can read any conversation

📍 **Location:** `backend/websocket/chatHandler.js` — `joinRoom`

💥 **Attack scenario:** `joinRoom` trusts the client-supplied `roomId` and `receiverId` with no check that the authenticated user is actually a member of that room. It even *overwrites* `members` to `[receiverId, senderId]` on join. An authenticated attacker sends `{type:"join_room", roomId:"<any room>", receiverId:"<self>"}` and immediately receives the full `message_history` for that room — reading private DMs between other users. Room IDs are likely derived from the two user IDs, so they're guessable.

🛡️ **Fix:** Before joining, load the room and verify membership; never overwrite `members` from client input.
```js
const room = await roomCollection.findOne({ _id: roomId.toString() });
if (room && !room.members.includes(senderId.toString())) {
  return ws.send(JSON.stringify({ type: "error", message: "Forbidden" }));
}
```
Derive `roomId` server-side from the sorted pair of user IDs and reject any room the user isn't part of.

---

### 🟠 HIGH — JWT delivers no revocation and `/verify-token` is trust-only

📍 **Location:** `backend/utils/jwtToken.js`, `backend/routes/auth.routes.js` — `GET /verify-token`

💥 **Attack scenario:** `/verify-token` only validates the signature and returns `{valid:true/false}` — it doesn't confirm the user still exists or isn't deleted/banned. Combined with 7-day tokens, no refresh, and no revocation/blacklist, a stolen token is valid for a week with no way to kill it. There's also no token versioning, so rotating the secret is your only revocation tool.

🛡️ **Fix:** Add short-lived access tokens (15 min) + refresh tokens stored httpOnly, include a `tokenVersion` claim you can bump per-user to revoke, and check the user exists/is active on every protected request.

---

### 🟠 HIGH — JWT delivered via URL query string on OAuth success

📍 **Location:** `backend/controllers/authController.js:304` (GitHub callback), `src/components/feedback/OAuthSuccess.jsx`

💥 **Attack scenario:** GitHub callback redirects to `/oauth-success?token=<JWT>`. Tokens in URLs leak through browser history, the `Referer` header to any third-party resource on that page, server access logs, and proxy logs. Anyone who reads one of those gets a 7-day valid session.

🛡️ **Fix:** Set the token in an httpOnly, Secure, SameSite cookie server-side during the redirect, or POST it via a short-lived one-time code exchanged for the token. Never put JWTs in URLs.

---

### 🟠 HIGH — OAuth account auto-linking by email → account takeover

📍 **Location:** `backend/controllers/authController.js:286` — `githubCallback` sign-in mode

💥 **Attack scenario:** Sign-in matches `{$or:[{githubId},{email: primaryEmail}]}`. If a victim registered with email/password, an attacker who creates a GitHub account using the victim's email address is handed the victim's existing account — no password needed. The `state`-based link flow (`authController.js:196`) is also a base64 JWT with no CSRF/nonce protection, making it vulnerable to OAuth login-CSRF.

🛡️ **Fix:** Never auto-link accounts by email alone — require the logged-in user to explicitly link, or force email re-verification before merging. Use a signed, single-use `state` nonce for CSRF protection on the OAuth flow rather than embedding the JWT.

---

### 🟠 HIGH — NoSQL operator injection in login / forgot-password

📍 **Location:** `backend/controllers/authController.js` — `login`, `forgotPassword`, `signUp`

💥 **Attack scenario:** `email` and `password` come straight from `req.body` into `users.findOne({ email })` without type validation. Sending `{"email": {"$gt": ""}}` makes Mongo match the first user in the collection. For `forgotPassword` this lets an attacker trigger a password reset against an arbitrary matched user. The pattern exists anywhere `req.body` fields flow directly into MongoDB queries.

🛡️ **Fix:** Validate and coerce all inputs to strings before querying. Add a schema validator (zod or Joi) on every route:
```js
if (typeof email !== "string" || typeof password !== "string")
  return res.status(400).json({ message: "Invalid input" });
```

---

### 🟠 HIGH — Broken/missing auth on `PUT /my-profile/` (updateLastActive) + inconsistent auth pattern

📍 **Location:** `backend/controllers/profileController.js:32`, `backend/routes/profile.routes.js`

💥 **Attack scenario:** `PUT /my-profile/` has no auth middleware and takes `id` directly from the request body. Any anonymous caller can write `lastActive` for any user ID. More broadly, none of the `/my-profile` routes mount the `authenticate` middleware — each controller re-implements token parsing inconsistently (`replace("Bearer ")` vs `split(" ")[1]`), creating gaps and inconsistencies.

🛡️ **Fix:** Apply the `authenticate` middleware to the entire `/my-profile` router and derive the user ID from `req.user._id`, never from the request body:
```js
// profile.routes.js
router.use(authenticate); // apply once for all routes

// profileController.js — updateLastActive
export const updateLastActive = async (req, res) => {
  const { lastActive } = req.body; // id comes from req.user._id
  const result = await updateLastActiveService(req.app.locals.db, req.user._id, lastActive);
  ...
};
```

---

### 🟡 MEDIUM — Insecure session cookie flags

📍 **Location:** `backend/routes/auth.routes.js:208` — login route

💥 **Attack scenario:** The session cookie is set with `secure: false` and stores the raw user ID as plaintext. Over plain HTTP the cookie travels in cleartext. Even though JWT is the primary auth mechanism, shipping `secure: false` in production enables interception and exposes internal user IDs unnecessarily.

🛡️ **Fix:**
```js
res.cookie("session", String(result.userId), {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // ← fix
  sameSite: "strict",
  maxAge: 60 * 60 * 1000,
  path: "/",
});
```

---

### 🟡 MEDIUM — Username enumeration via differentiated login error messages

📍 **Location:** `backend/controllers/authController.js:110-122` — `login`

💥 **Attack scenario:** Login returns `404 "User is not Found!"` when the email doesn't exist, but `401 "Password is incorrect"` when it does. An attacker can enumerate which email addresses have registered accounts. (`forgotPassword` correctly uses a uniform message — match that behavior here.)

🛡️ **Fix:** Return a single generic `401 "Invalid email or password"` for both the not-found and wrong-password cases.

---

### 🟡 MEDIUM — Internal error messages leaked to clients

📍 **Location:** Throughout — `auth.routes.js:143`, most controllers return `error: err.message`

💥 **Attack scenario:** Raw `err.message` from Node.js/MongoDB driver is returned in JSON responses, disclosing schema names, driver versions, and internal logic to attackers.

🛡️ **Fix:** Log details server-side with a correlation ID; return only a generic message to the client:
```js
// Generic error handler
app.use((err, req, res, next) => {
  const id = crypto.randomUUID();
  console.error({ id, err });
  res.status(500).json({ message: "Internal server error", ref: id });
});
```
Remove all `error: err.message` from production response bodies.

---

### 🟡 MEDIUM — No rate limiting outside login/signup; Redis failure causes 500

📍 **Location:** `backend/routes/auth.routes.js`, `backend/routes/blogs.routes.js`, WebSocket

💥 **Attack scenario:** `forgot-password`, `reset-password`, comment posting, blog creation, search, and the WebSocket have no rate limits — enabling password-reset email bombing, comment/blog spam, and brute-force of reset tokens. Additionally, the login/signup handlers call `redisConnection.get(...)` directly without the null guard used by `redisIncr`; if Redis is unavailable these routes throw and return 500, a self-inflicted DoS. `express-rate-limit` is installed but not applied globally.

🛡️ **Fix:** Apply `express-rate-limit` globally and with tighter limits on sensitive routes. Guard every direct Redis call with a null check:
```js
const count = redisConnection ? await redisConnection.get(key) : null;
```

---

### 🟡 MEDIUM — Missing security headers (no Helmet)

📍 **Location:** `backend/app.js`

💥 **Attack scenario:** No CSP, HSTS, `X-Content-Type-Options`, `X-Frame-Options`, or `Referrer-Policy`. This widens the blast radius of any XSS (no CSP to block execution), allows clickjacking, MIME-type sniffing, and referrer-based token leakage (compounded by the JWT-in-URL finding).

🛡️ **Fix:**
```js
import helmet from "helmet";
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
    },
  },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
}));
```

---

### 🟢 LOW — Swagger UI exposed publicly in production

📍 **Location:** `backend/app.js:23`

💥 **Attack scenario:** `/api-docs` serves a complete map of every endpoint, parameter name, and schema to any unauthenticated visitor, significantly lowering the cost of recon.

🛡️ **Fix:**
```js
if (process.env.NODE_ENV !== "production") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
```

---

### 🟢 LOW — `dangerouslySetInnerHTML` in ChallengeArena (future XSS risk)

📍 **Location:** `src/features/CodingChallenges/ChallengeArena.jsx` — lines 299, 308, 319, 480

💥 **Attack scenario:** HTML is injected from `challenge.description`, `challenge.task`, and `challenge.hints`. Currently this is static local data (low risk), but if challenge content ever becomes user- or DB-sourced this is a stored-XSS sink. An XSS here would steal the JWT straight out of `localStorage`.

🛡️ **Fix:** Sanitize with DOMPurify before injecting, or switch to `react-markdown` (already a dependency):
```js
import DOMPurify from "dompurify";
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(challenge.description) }} />
```

---

## What's Done Well

- bcrypt at 13 rounds with correct salting.
- Password reset uses hashed single-use tokens with 1-hour expiry.
- `forgotPassword` returns a uniform response (no email enumeration).
- Regex search input is properly escaped in `searchService.js`.
- `ObjectId` validity is checked on most ID parameters.
- Comment deletion has a correct ownership check (author match).
- Login rate limiting exists for both IP and email axes via Redis.

---

## Priority Fix Order

| Priority | Finding | Effort |
|---|---|---|
| 1 | Rotate all secrets in `.env`, remove from tree | Low (ops) |
| 2 | Fix chat-room IDOR — verify membership before join | Low (code) |
| 3 | Stop putting JWTs in OAuth redirect URLs | Medium |
| 4 | Fix OAuth account auto-linking by email | Medium |
| 5 | Add input type validation to close NoSQL injection | Low (code) |
| 6 | Mount `authenticate` middleware consistently on all `/my-profile` routes | Low (code) |
| 7 | Add Helmet + security headers | Low (1 line) |
| 8 | Fix `secure: false` cookie flag | Trivial |
| 9 | Unify login error messages (stop username enumeration) | Trivial |
| 10 | Remove `error: err.message` from production responses | Low |
