// Escapes regex metacharacters so user- or LLM-supplied text is matched
// literally. Never pass raw input to `$regex` / `new RegExp` — a stray "(" is
// a 500, and a crafted pattern like "(a+)+$" can pin the DB CPU (ReDoS).
export const escapeRegex = (value = "") =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
