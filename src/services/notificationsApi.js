import { API_BASE_URL, authHeaders } from "../../constants/api";

export const getNotifications = async () => {
  try {
    const request = await fetch(`${API_BASE_URL}/my-profile/notifications`, {
      method: "GET",
      headers: authHeaders(),
    });
    if (!request.ok) return null;
    const response = await request.json();
    return response;
  } catch (err) {
    console.error("getNotifications failed:", err);
  }
};

// Writes throw on failure so the page can roll back its optimistic update.
const write = async (path, method) => {
  const res = await fetch(`${API_BASE_URL}/my-profile/notifications${path}`, {
    method,
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Notification update failed");
};

export const markNotificationRead = (id) =>
  write(`/${encodeURIComponent(id)}/read`, "PATCH");
export const markAllNotificationsRead = () => write("/read-all", "PATCH");
export const deleteNotification = (id) =>
  write(`/${encodeURIComponent(id)}`, "DELETE");
