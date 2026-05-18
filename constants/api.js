export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const JWT_KEY = "JWT";

export const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem(JWT_KEY)}`,
});
