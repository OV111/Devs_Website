import process from "node:process";

/**
 * Graceful shutdown.
 *
 * Hosting platforms stop the old instance on every deploy (and Render's free
 * plan on every sleep) by sending SIGTERM, then killing it a few seconds later.
 * Exiting immediately would cut requests mid-flight — including a Polar webhook
 * or an exam submission half-written to the database.
 *
 * Order matters: stop taking NEW work first, then let current work finish, then
 * close the things that work depended on (queue worker, Redis, MongoDB).
 * A hard deadline guarantees the process still exits if something hangs.
 *
 * Every dependency is injected so the sequence is testable without a server.
 */
export const createShutdown = ({
  server,
  wss = null,
  closers = [],
  exit = (code) => process.exit(code),
  timeoutMs = 10_000,
  log = console,
}) => {
  let started = false;

  return async (signal) => {
    if (started) return; // a second SIGTERM/SIGINT must not restart the sequence
    started = true;
    log.log(`${signal} received — shutting down gracefully…`);

    const deadline = setTimeout(() => {
      log.error("shutdown: deadline reached, forcing exit");
      exit(1);
    }, timeoutMs);
    deadline.unref?.();

    try {
      // 1. Stop accepting new HTTP connections; resolves when open requests finish.
      const httpClosed = new Promise((resolve) => server.close(() => resolve()));

      // 2. WebSockets keep the HTTP server open forever unless told to go.
      //    1001 = "going away", so clients know to reconnect to the new instance.
      if (wss) for (const client of wss.clients) client.close(1001, "Server restarting");

      await httpClosed;

      // 3. Close dependencies, in the order given (worker before Redis, Mongo last).
      for (const [name, close] of closers) {
        try {
          await close();
        } catch (err) {
          log.error(`shutdown: closing ${name} failed:`, err.message);
        }
      }

      clearTimeout(deadline);
      log.log("shutdown complete");
      exit(0);
    } catch (err) {
      log.error("shutdown: unexpected error:", err);
      exit(1);
    }
  };
};
