import { Buffer } from "node:buffer";
import { webhooks } from "@polar-sh/sdk/2026-10";
import { getBillingConfig, isBillingConfigured } from "../lib/billingConfig.js";
import { BillingError } from "../lib/billingError.js";
import { getPolar } from "../services/polarClient.js";
import { getEntitlement, syncSubscription } from "../services/subscriptionService.js";
import { createCheckoutSession, createPortalSession } from "../services/checkoutService.js";
import { handlePolarWebhook } from "../services/webhookService.js";

// The SDK sets a stable `name` on its transport errors but does not export the
// classes (its `errors` export holds only API-specific ones), so `instanceof`
// is not available here — and `instanceof undefined` would throw inside the very
// handler meant to catch errors. Matching on `name` is what the SDK offers.
const PROVIDER_OUTAGE_ERRORS = new Set([
  "PolarNetworkError",
  "PolarServerError",
  "PolarRateLimitError",
]);

/**
 * Turn an error into a response without leaking internals.
 *   BillingError   -> its own status/code/message (written to be user-facing)
 *   Polar outage   -> 502, so the UI can say "try again" rather than "bug"
 *   anything else  -> logged here, generic 500 to the client
 */
const sendError = (res, err) => {
  if (err instanceof BillingError) {
    return res
      .status(err.status)
      .json({ success: false, code: err.code, message: err.message });
  }

  if (PROVIDER_OUTAGE_ERRORS.has(err?.name)) {
    console.error("billing: Polar unavailable:", err.message);
    return res.status(502).json({
      success: false,
      code: "PROVIDER_UNAVAILABLE",
      message: "The billing provider is unavailable. Please try again shortly.",
    });
  }

  console.error("billing: unexpected error:", err);
  return res
    .status(500)
    .json({ success: false, code: "INTERNAL", message: "Something went wrong." });
};

export const getSubscriptionStatus = async (req, res) => {
  try {
    const config = getBillingConfig();
    const entitlement = await getEntitlement(req.app.locals.db, req.user._id);
    res.json({
      success: true,
      data: {
        // Lets the UI say "billing isn't live" instead of showing a Subscribe
        // button that can only fail.
        configured: isBillingConfigured(config),
        enforced: config.enforced,
        ...entitlement,
      },
    });
  } catch (err) {
    sendError(res, err);
  }
};

export const startCheckout = async (req, res) => {
  try {
    const config = getBillingConfig();
    const data = await createCheckoutSession(
      req.app.locals.db,
      getPolar(config),
      config,
      req.user._id,
    );
    res.json({ success: true, data });
  } catch (err) {
    sendError(res, err);
  }
};

export const openPortal = async (req, res) => {
  try {
    const config = getBillingConfig();
    const data = await createPortalSession(getPolar(config), config, req.user._id);
    res.json({ success: true, data });
  } catch (err) {
    sendError(res, err);
  }
};

export const syncNow = async (req, res) => {
  try {
    const config = getBillingConfig();
    await syncSubscription(req.app.locals.db, getPolar(config), config, req.user._id);
    const entitlement = await getEntitlement(req.app.locals.db, req.user._id);
    res.json({ success: true, data: entitlement });
  } catch (err) {
    sendError(res, err);
  }
};

/**
 * Polar -> us. Mounted in app.js with `express.raw`, BEFORE the global JSON
 * parser: the signature covers the exact bytes, which a parsed body no longer is.
 *
 * Status codes are chosen for Polar's retry behaviour (10 attempts, then the
 * endpoint is disabled):
 *   202  handled, or deliberately ignored — nothing for Polar to retry
 *   403  bad signature — retrying will not help
 *   400  malformed payload — retrying will not help
 *   500  OUR failure — the only case where a retry is useful
 */
export const handleBillingWebhook = async (req, res) => {
  if (!Buffer.isBuffer(req.body)) {
    return res.status(400).json({ error: "Expected a raw JSON body" });
  }

  try {
    await handlePolarWebhook(
      req.app.locals.db,
      req.body,
      req.headers,
      getBillingConfig(),
    );
    return res.status(202).json({ received: true });
  } catch (err) {
    if (err instanceof webhooks.PolarWebhookVerificationError) {
      return res.status(403).json({ error: "Invalid webhook signature" });
    }
    // An event type this API version doesn't know about. Acknowledge it: it is
    // not an error on our side and a retry would just fail again.
    if (err instanceof webhooks.PolarWebhookUnknownTypeError) {
      return res.status(202).json({ received: true, ignored: true });
    }
    if (err instanceof webhooks.PolarWebhookError) {
      return res.status(400).json({ error: "Invalid webhook payload" });
    }
    if (err instanceof BillingError) {
      return res.status(err.status).json({ error: err.code });
    }
    console.error("billing: webhook processing failed:", err);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
};
