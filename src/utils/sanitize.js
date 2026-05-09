// utils/sanitize.js  ← create this file separately
export const sanitizeInput = (value) => {
  if (typeof value !== "string") return value;
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/data:/gi, "")
    .replace(/vbscript:/gi, "")
    .replace(/(['"])/g, "")
    .replace(/--/g, "")
    .replace(/\/\*/g, "")
    .trim();
};