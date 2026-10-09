// PostHog is ~440 KB, so it is loaded after the page is idle instead of on the
// critical path. Callers use the same API (capture/identify/reset); calls made
// before the SDK arrives are queued and replayed once it loads.

const projectToken = import.meta.env.VITE_POSTHOG_KEY;
const apiHost = import.meta.env.VITE_POSTHOG_HOST;
const missingConfig = !projectToken
  ? "VITE_POSTHOG_KEY"
  : !apiHost
    ? "VITE_POSTHOG_HOST"
    : null;

export const isPostHogConfigured = !missingConfig;

let client = null;
const queue = [];

function call(method, args) {
  if (client) client[method](...args);
  else queue.push([method, args]);
}

async function load() {
  const { default: ph } = await import("posthog-js");
  ph.init(projectToken, {
    api_host: apiHost,
    defaults: "2026-05-30",
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
  });
  client = ph;
  for (const [method, args] of queue.splice(0)) client[method](...args);
}

if (missingConfig) {
  if (import.meta.env.DEV) {
    throw new Error(
      `${missingConfig} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingConfig} is configured`,
    );
  }
} else if (typeof window !== "undefined") {
  // Browser only: the build-time prerender imports this module in Node.
  const start = () => load().catch(() => {});
  if ("requestIdleCallback" in window) requestIdleCallback(start, { timeout: 4000 });
  else setTimeout(start, 2000);
}

const posthog = {
  capture: (...args) => call("capture", args),
  identify: (...args) => call("identify", args),
  reset: (...args) => call("reset", args),
};

export default posthog;
