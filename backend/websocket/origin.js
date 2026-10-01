import process from "node:process";

/**
 * Which browser origins may open a WebSocket to this server.
 *
 * Browsers attach an Origin header to every WebSocket handshake and do NOT apply
 * CORS to it, so without this check any website a logged-in user visits could
 * open a socket to the API in their name. Auth here is a token sent over the
 * socket, which limits the damage, but refusing foreign origins at the handshake
 * closes the door entirely.
 *
 * Requests with no Origin come from non-browser clients (server-to-server, test
 * tools). They are allowed: a non-browser client can forge any Origin anyway, so
 * rejecting the empty one would add no security and break tooling.
 */
export const allowedOrigins = (env = process.env) =>
  new Set(
    [
      env.FRONTEND_URL,
      ...(env.WS_EXTRA_ORIGINS ?? "").split(","),
      // The Vite dev server, but never in production.
      env.NODE_ENV === "production" ? null : "http://localhost:5173",
    ]
      .map((o) => (o ?? "").trim().replace(/\/$/, ""))
      .filter(Boolean),
  );

export const isOriginAllowed = (origin, allowed = allowedOrigins()) =>
  !origin || allowed.has(origin.replace(/\/$/, ""));
