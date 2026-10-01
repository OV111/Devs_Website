import { useCallback, useEffect, useState } from "react";
import {
  createCheckout,
  createPortal,
  fetchSubscription,
  syncSubscription,
} from "../billingApi";

/**
 * Billing state for the current user, plus the two actions that leave the site.
 *
 * `enabled` lets the pricing page use this hook for logged-out visitors without
 * firing a request that can only 401.
 *
 * `checkout` and `portal` redirect the whole window to Polar's hosted pages
 * rather than opening a modal: card entry stays on Polar's domain, so none of it
 * touches our page or our PCI scope.
 */
const useBilling = ({ enabled = true } = {}) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(null); // "checkout" | "portal" | null

  const refresh = useCallback(async () => {
    setError(null);
    try {
      setStatus(await fetchSubscription());
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    // The fetch settles asynchronously, so state is set after the await — not
    // synchronously inside the effect body.
    refresh();
  }, [enabled, refresh]);

  // Runs one action that ends in a redirect. `busy` stays set on success because
  // the page is about to unload; clearing it would flash the button back to idle.
  const redirectVia = useCallback(async (name, create) => {
    setBusy(name);
    try {
      const { url } = await create();
      window.location.assign(url);
    } catch (err) {
      setBusy(null);
      throw err;
    }
  }, []);

  const startCheckout = useCallback(() => redirectVia("checkout", createCheckout), [redirectVia]);
  const openPortal = useCallback(() => redirectVia("portal", createPortal), [redirectVia]);

  /**
   * After returning from checkout the webhook may not have landed yet, so ask the
   * server to pull the subscription from Polar directly instead of polling.
   */
  const syncAfterCheckout = useCallback(async () => {
    try {
      setStatus(await syncSubscription());
      return true;
    } catch (err) {
      setError(err);
      return false;
    }
  }, []);

  return { status, loading, error, busy, refresh, startCheckout, openPortal, syncAfterCheckout };
};

export default useBilling;
