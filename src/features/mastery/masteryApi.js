import { API_BASE_URL, authHeaders } from "../../../constants/api";

export const fetchMastery = async () => {
  let res;
  try {
    res = await fetch(`${API_BASE_URL}/api/mastery`, {
      headers: authHeaders(),
      credentials: "include",
    });
  } catch {
    throw new Error("Couldn't reach the server. Check your connection.");
  }

  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw new Error(json?.message ?? "Couldn't load your progress.");
  }
  return json.data;
};
