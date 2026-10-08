# Billing (Polar) — Setup & Operations

> Status: code complete and tested against a **fake** Polar. Nothing has been run against real Polar yet — the first sandbox checkout is the real test.
> Provider: [Polar](https://polar.sh) as **Merchant of Record** (it is the legal seller and handles VAT/sales tax). Payouts go through Stripe Connect Express to an Armenian bank account in local currency — confirm your account type is accepted during Polar's payout onboarding.

## How it works

```
Browser ──POST /api/billing/checkout──▶ Backend ──checkouts.create──▶ Polar
   ◀──────────── { url } ───────────────────┘
   └─ redirect to Polar's hosted checkout (card entry never touches our site)
Polar ──POST /api/billing/webhook (signed)──▶ Backend ──▶ subscriptions collection
Browser ──GET /api/billing/subscription──▶ plan, status, renewal date
```

- **Identity link:** the user's own id is sent to Polar as `external_customer_id`. Webhooks echo it back, so there is no mapping table.
- **Source of truth:** the signed webhook. Any `subscription.*` event carries the full subscription, so a single handler stores whatever Polar says is true now. Replays and out-of-order delivery are safe (a stale-event guard on `modified_at`).
- **Repair path:** `POST /api/billing/sync` pulls the user's subscriptions from Polar. The billing page calls it after returning from checkout, because the redirect can beat the webhook.
- **Fails closed:** with no `POLAR_WEBHOOK_SECRET` every webhook is rejected (503). Unsigned or tampered requests get 403.
- **Not enforced yet:** `featureGateService.canAccess()` exists but is wired to no route, and returns `true` for everyone until `BILLING_ENFORCED=true`. Turning payments on does not restrict anyone.

## Environment variables (`backend/.env`)

| Variable | Required | Notes |
|---|---|---|
| `POLAR_ACCESS_TOKEN` | yes | Organization Access Token. **Sandbox and production tokens are different.** Never expose to the browser. |
| `POLAR_PRO_PRODUCT_ID` | yes | UUID of the Pro product (sandbox and production have different ids). |
| `POLAR_WEBHOOK_SECRET` | yes | Signing secret of the webhook endpoint (`whsec_…`). |
| `POLAR_ENVIRONMENT` | no | `sandbox` (default) or `production`. Only the exact string `production` goes live. |
| `FRONTEND_URL` | yes | Already set; used for the checkout success/return URLs. |
| `BILLING_ENFORCED` | no | Leave unset during the pilot. `true` makes `canAccess()` actually restrict. |

## First-time setup (sandbox)

1. Create a sandbox account at <https://sandbox.polar.sh> and an organization. Sandbox is fully isolated from production and uses Stripe test cards.
2. **Products → New product:** "Pro", recurring, monthly, price **$15** (still an open pricing decision — see `docs/strategy/BUSINESS_MODEL.md`). Copy the product id.
3. **Settings → Developers → New Access Token** with at least the scopes `checkouts:write`, `customer_sessions:write`, `subscriptions:read`. Copy it once (it is shown once).
4. **Webhooks:** Polar must be able to reach your server, so `localhost` will not work. Run a tunnel (`ngrok http 3000`, or `cloudflared tunnel --url http://localhost:3000`) and add an endpoint:
   - URL: `https://<tunnel-host>/api/billing/webhook`
   - Format: raw
   - Events: all `subscription.*` events (the handler ignores everything else)
   - Copy the signing secret.
5. Put the four values in `backend/.env`, restart the backend.
6. Test: open `/pricing` while logged in → **Upgrade to Pro** → pay with `4242 4242 4242 4242`, any future date, any CVC → you return to `/billing?checkout=success` and the plan reads **Pro**.
7. Test cancellation from **Manage billing** (Polar's customer portal) and watch the date change to "Cancels on …".

## Going to production

Repeat steps 1–5 in the **production** Polar dashboard (new token, new product, new webhook secret, webhook URL = your deployed backend), then set `POLAR_ENVIRONMENT=production`. Do not reuse sandbox values. Payout onboarding (Finance → Account) must be finished before real money can be paid out.

## Operating notes

- **Statuses:** `active`, `trialing` and `past_due` grant Pro. `past_due` is a deliberate grace period while Polar retries the card; Polar's own dunning moves it to `canceled`/`unpaid`, which removes access. `paused`, `canceled`, `unpaid` do not.
- **Cancel at period end:** the subscription stays `active` with `cancel_at_period_end=true` until the paid period ends, so the user keeps Pro until then (the UI shows "Cancels on …").
- **Missed webhook safety net:** access is also denied when the paid period ended more than 3 days ago, even if no event ever said so. A user can self-heal by opening `/billing`, which can call `/sync`.
- **Polar retries** failed deliveries up to 10 times, then disables the endpoint after 10 consecutive failures. We return 202 for anything we deliberately ignore, 403/400 for requests no retry can fix, and 500 only for our own failures.
- **Rate limits:** checkout, portal and sync are limited to 10 requests per minute per user.
- **API version:** pinned to `@polar-sh/sdk/2026-10`. Polar's API is date-versioned; changing it is a deliberate edit in `polarClient.js`, `webhookService.js` and `billing.controller.js`.
- **Enforcement later:** to gate a feature, call `canAccess(db, userId, "pro")` from the route/service (exported from `backend/modules/billing`). Gates can be added one at a time; they are all inert until `BILLING_ENFORCED=true`.

## What is NOT built

- Teams plan checkout (Teams is "Contact sales"). Seat-based pricing needs its own product and flow.
- Regional / discounted pricing.
- Any route actually gated by plan (the pilot runs everything free by design).
- Email receipts and invoices — Polar sends and hosts them.
