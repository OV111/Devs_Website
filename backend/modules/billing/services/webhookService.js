import { webhooks } from "@polar-sh/sdk/2026-10";
import { BillingError } from "../lib/billingError.js";
import { applyPolarSubscription } from "./subscriptionService.js";

/**
 * Verify and apply one Polar webhook.
 *
 * Fails CLOSED: with no signing secret configured every request is rejected.
 * Skipping verification "until it is set up" would let anyone on the internet
 * POST a fake `subscription.active` and grant themselves Pro.
 *
 * `rawBody` must be the untouched request bytes (a Buffer) — the signature is
 * computed over the exact body, so a parsed-and-reserialised body never verifies.
 */
export const handlePolarWebhook = async (db, rawBody, headers, config) => {
  if (!config.webhookSecret) {
    throw new BillingError(503, "WEBHOOK_NOT_CONFIGURED", "Webhook secret not set.");
  }

  const event = await webhooks.validateEvent(
    rawBody,
    {
      "webhook-id": headers["webhook-id"] ?? "",
      "webhook-timestamp": headers["webhook-timestamp"] ?? "",
      "webhook-signature": headers["webhook-signature"] ?? "",
    },
    config.webhookSecret,
  );

  // Every subscription.* event (created, updated, active, canceled, uncanceled,
  // past_due, revoked, ...) carries the FULL current subscription in `data`. So
  // one code path handles them all: store whatever Polar says is true now. No
  // per-event state machine to get subtly wrong, and a replayed event is safe
  // because applyPolarSubscription ignores anything older than what we hold.
  if (event.type.startsWith("subscription.")) {
    const result = await applyPolarSubscription(db, event.data, config);
    return { type: event.type, ...result };
  }

  return { type: event.type, applied: false, reason: "ignored-type" };
};
