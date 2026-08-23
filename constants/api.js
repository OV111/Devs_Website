export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// The access token now lives in memory only — never localStorage — so it is
// unreadable by any injected/third-party script (XSS blast-radius reduction).
// It does not survive a page reload; useAuthStore.init() re-derives it from
// the httpOnly refresh cookie via POST /refresh on app start.
let accessToken = null;

export const getAccessToken = () => accessToken;
export const setAccessToken = (token) => {
  accessToken = token;
};
export const clearAccessToken = () => {
  accessToken = null;
};

export const authHeaders = () => ({
  Authorization: `Bearer ${accessToken ?? ""}`,
});
