import process from "node:process";

/**
 * Readiness check for the hosting platform (Render's healthCheckPath).
 *
 * "Healthy" means the process can actually serve requests, which for this app
 * means MongoDB answers. A check that returned 200 while the database was gone
 * would let the platform route traffic to an instance that can only 500.
 *
 * The ping is time-boxed: a hung database must turn into a fast 503, not a
 * health request that hangs until the platform's own timeout.
 */
export const checkHealth = async (db, { timeoutMs = 3000 } = {}) => {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error("database ping timed out")), timeoutMs);
  });

  try {
    await Promise.race([db.command({ ping: 1 }), timeout]);
    return { ok: true, body: { status: "ok", uptimeSec: Math.round(process.uptime()) } };
  } catch (err) {
    // The reason goes to the log, not the response — health endpoints are public.
    console.error("health: database check failed:", err.message);
    return { ok: false, body: { status: "unavailable" } };
  } finally {
    clearTimeout(timer);
  }
};

/** Plain http handler, so the check runs before (and independently of) Express. */
export const healthHandler = (db) => async (req, res) => {
  const { ok, body } = await checkHealth(db);
  res.writeHead(ok ? 200 : 503, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  });
  res.end(req.method === "HEAD" ? undefined : JSON.stringify(body));
};
