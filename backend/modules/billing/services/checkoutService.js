import { ObjectId } from "mongodb";
import { BillingError } from "../lib/billingError.js";
import { isEntitled } from "../lib/entitlements.js";
import { getSubscription } from "./subscriptionService.js";

/**
 * Start a Polar checkout for the Pro plan.
 *
 * The user's own id goes to Polar as `external_customer_id`. That is the whole
 * identity link: when the webhook later says "customer X subscribed", X is our
 * user id, so there is no mapping table to keep in sync and nothing to look up.
 *
 * The price and product are never taken from the request — the client only asks
 * for "pro", and the product id comes from server config, so a tampered request
 * cannot buy a different (or cheaper) product.
 */
export const createCheckoutSession = async (db, polar, config, userId) => {
  const existing = await getSubscription(db, userId);
  if (isEntitled(existing)) {
    // A second subscription would double-charge. Point them at the portal.
    throw new BillingError(
      409,
      "ALREADY_SUBSCRIBED",
      "You already have an active subscription. Manage it from your billing page.",
    );
  }

  const user = await db
    .collection("users")
    .findOne({ _id: new ObjectId(userId) }, { projection: { email: 1 } });

  const checkout = await polar.checkouts.create({
    products: [config.proProductId],
    external_customer_id: String(userId),
    customer_email: user?.email ?? null,
    metadata: { userId: String(userId) },
    success_url: `${config.frontendUrl}/billing?checkout=success`,
    return_url: `${config.frontendUrl}/pricing`,
  });

  return { url: checkout.url };
};

/**
 * A one-time link to Polar's hosted customer portal, where the customer manages
 * their card, downloads invoices and cancels. Using it means we never build or
 * store any of that ourselves.
 */
export const createPortalSession = async (polar, config, userId) => {
  try {
    const session = await polar.customerSessions.create({
      external_customer_id: String(userId),
      return_url: `${config.frontendUrl}/billing`,
    });
    return { url: session.customer_portal_url };
  } catch (err) {
    // Polar only has a customer after their first checkout. A 404 here is the
    // normal "you have never paid" state, not a server fault.
    if (err?.statusCode === 404 || err?.status === 404) {
      throw new BillingError(
        409,
        "NO_BILLING_ACCOUNT",
        "There is no billing account yet. Subscribe first.",
      );
    }
    throw err;
  }
};
