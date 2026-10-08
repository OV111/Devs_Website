import { getBillingConfig } from "../lib/billingConfig.js";
import { getEntitlement } from "./subscriptionService.js";

/**
 * The single place that answers "may this user do this?" — the enforcement point
 * docs/strategy/BUSINESS_MODEL.md calls the most critical business-logic file.
 *
 * Routes call `canAccess` and never look at subscriptions themselves, so changing
 * what a plan includes is a one-file edit.
 *
 * It is wired to NO route yet. Until BILLING_ENFORCED=true every check passes, so
 * adding a gate to a route today changes nothing for anyone. That lets gates be
 * added incrementally and switched on all at once when the pilot says to.
 */

const PLAN_RANK = { free: 0, pro: 1 };

export const getUserPlan = async (db, userId, now = new Date()) => {
  const { plan } = await getEntitlement(db, userId, now);
  return plan;
};

/**
 * @param {"free"|"pro"} minPlan  Lowest plan that may use the feature.
 */
export const canAccess = async (db, userId, minPlan, config = getBillingConfig()) => {
  if (!config.enforced) return true;
  const plan = await getUserPlan(db, userId);
  return PLAN_RANK[plan] >= PLAN_RANK[minPlan];
};
