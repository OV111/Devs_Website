import process from "process";

/**
 * An env value that is really a template placeholder ("...", "whsec_...",
 * "<paste here>") is the same as unset. Without this, a half-filled .env would
 * report billing as configured and then fail at Polar with a confusing 401 on the
 * user's first click, instead of cleanly saying "billing isn't live yet".
 */
const readSecret = (value) => {
  const v = (value ?? "").trim();
  if (!v || v.endsWith("...") || /^<.+>$/.test(v)) return "";
  return v;
};

/**
 * Billing configuration, read from the environment on demand.
 *
 * Read lazily (a function, not a module-level constant) so tests can pass their
 * own env and so a missing variable fails at the call that needs it, with a
 * clear message, instead of crashing the whole server at import time.
 *
 * Defaults are deliberately the SAFE ones:
 *   - environment is "sandbox" unless POLAR_ENVIRONMENT is exactly "production",
 *     so a forgotten variable can never charge a real card;
 *   - gates are NOT enforced unless BILLING_ENFORCED is exactly "true" — the
 *     pilot runs everything free (see BUSINESS_MODEL.md).
 */
export const getBillingConfig = (env = process.env) => ({
  accessToken: readSecret(env.POLAR_ACCESS_TOKEN),
  webhookSecret: readSecret(env.POLAR_WEBHOOK_SECRET),
  environment: env.POLAR_ENVIRONMENT === "production" ? "production" : "sandbox",
  proProductId: readSecret(env.POLAR_PRO_PRODUCT_ID),
  frontendUrl: (env.FRONTEND_URL || "http://localhost:5173").trim().replace(/\/$/, ""),
  enforced: env.BILLING_ENFORCED === "true",
});

/** Can we create checkouts at all? (The webhook needs only the secret.) */
export const isBillingConfigured = (config) =>
  Boolean(config.accessToken && config.proProductId);

/**
 * Which plan a Polar product grants. Unknown products return null on purpose:
 * a stray product in the Polar organisation (a future Teams plan, a test item)
 * must never silently grant Pro.
 */
export const getPlanForProduct = (productId, config) => {
  if (productId && productId === config.proProductId) return "pro";
  return null;
};
