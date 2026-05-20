import { API_BASE_URL } from "../../constants/api";

export const requestPasswordReset = async (email) => {
  const res = await fetch(`${API_BASE_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res;
};

export const confirmPasswordReset = async (token, newPassword) => {
  const res = await fetch(`${API_BASE_URL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });
  return res;
};
