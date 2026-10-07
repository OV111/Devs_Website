import posthog from "posthog-js";

const projectToken = import.meta.env.VITE_POSTHOG_KEY;
const apiHost = import.meta.env.VITE_POSTHOG_HOST;
const missingConfig = !projectToken
  ? "VITE_POSTHOG_KEY"
  : !apiHost
    ? "VITE_POSTHOG_HOST"
    : null;

export const isPostHogConfigured = !missingConfig;

if (missingConfig) {
  if (import.meta.env.DEV) {
    throw new Error(
      `${missingConfig} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingConfig} is configured`,
    );
  }
} else {
  posthog.init(projectToken, {
    api_host: apiHost,
    defaults: "2026-05-30",
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
  });
}

export default posthog;
