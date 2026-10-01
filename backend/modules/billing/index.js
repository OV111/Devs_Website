/**
 * Billing module (Polar) — the only public entry point.
 *
 * `app.js` mounts two things from here, and they MUST be mounted separately:
 *   - `billingRoutes`        under /api/billing, after the JSON parser
 *   - `handleBillingWebhook` at POST /api/billing/webhook, with `express.raw`,
 *                            BEFORE the JSON parser (the signature needs raw bytes)
 *
 * Other modules use `canAccess` / `getUserPlan` to gate features; they never read
 * the subscriptions collection directly.
 */

import billingRoutes from "./routes/billing.routes.js";

export { handleBillingWebhook } from "./controllers/billing.controller.js";
export { canAccess, getUserPlan } from "./services/featureGateService.js";

export default billingRoutes;
