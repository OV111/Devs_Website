import { API_BASE_URL, authHeaders } from "../../../constants/api";

/**
 * Thin client for /api/billing. Kept separate from the hook so the network
 * details (headers, error shape) live in one place and the hook only deals in
 * state.
 *
 * The server always answers `{ success, data }` or `{ success:false, code,
 * message }`. `code` is the stable part the UI may branch on; `message` is
 * written to be shown to the user as-is.
 */
export class BillingApiError extends Error {
  constructor(message, { code, status } = {}) {
    super(message);
    this.name = "BillingApiError";
    this.code = code;
    this.status = status;
  }
}

const request = async (path, { method = "GET", body } = {}) => {
  let res;
  try {
    res = await fetch(`${API_BASE_URL}/api/billing${path}`, {
      method,
      headers: { "Content-Type": "application/json", ...authHeaders() },
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new BillingApiError("Couldn't reach the server. Check your connection.", {
      code: "NETWORK",
    });
  }

  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw new BillingApiError(json?.message ?? "Something went wrong.", {
      code: json?.code,
      status: res.status,
    });
  }
  return json.data;
};

export const fetchSubscription = () => request("/subscription");
export const createCheckout = () => request("/checkout", { method: "POST", body: { plan: "pro" } });
export const createPortal = () => request("/portal", { method: "POST" });
export const syncSubscription = () => request("/sync", { method: "POST" });
