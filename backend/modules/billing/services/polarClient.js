import { createPolar } from "@polar-sh/sdk/2026-10";
import { getBillingConfig, isBillingConfigured } from "../lib/billingConfig.js";
import { BillingError } from "../lib/billingError.js";

/**
 * One Polar client per process.
 *
 * Pinned to the "2026-10" API version on purpose: Polar's API is date-versioned,
 * so a fixed import means a Polar release can never change the shape of our
 * webhook payloads underneath us. Moving versions is a deliberate edit here.
 */
let client = null;

export const getPolar = (config = getBillingConfig()) => {
  if (client) return client;

  if (!isBillingConfigured(config)) {
    throw new BillingError(
      503,
      "BILLING_NOT_CONFIGURED",
      "Billing is not available yet.",
    );
  }

  client = createPolar({
    accessToken: config.accessToken,
    environment: config.environment,
    // Checkout creation is on the user's critical path; fail fast rather than
    // leaving the button spinning on a slow upstream.
    timeout: 15,
  });
  return client;
};

/** Test seam: inject a fake client, or pass null to reset. */
export const setPolarClient = (fake) => {
  client = fake;
};
