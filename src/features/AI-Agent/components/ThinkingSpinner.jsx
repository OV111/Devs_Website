import { useId } from "react";
import "./thinking-spinner.css";

// The markup is a string built from the brand geometry, so it is injected once
// instead of being hand-written as 40+ JSX polygons. It contains no user input.
const markup = (id) => `<defs>
<linearGradient id="${id}mL" x1="9" y1="12" x2="39" y2="52" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#C79BFF"/><stop offset=".35" stop-color="#9A5CF2"/><stop offset=".55" stop-color="#7A30E4"/><stop offset=".68" stop-color="#A983F5"/><stop offset="1" stop-color="#5F36B8"/></linearGradient>
<linearGradient id="${id}mR" x1="55" y1="12" x2="27" y2="52" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#F6E6FF"/><stop offset=".35" stop-color="#D49BFF"/><stop offset=".62" stop-color="#7A12F0"/><stop offset=".74" stop-color="#9E5BFF"/><stop offset="1" stop-color="#4E0CB8"/></linearGradient>
<linearGradient id="${id}mS" x1="0" y1="12" x2="0" y2="56" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#7A55C4"/><stop offset=".55" stop-color="#2A2A80"/><stop offset="1" stop-color="#0E1550"/></linearGradient>
</defs><g class="vh-spin__ring"><g transform="rotate(0 32 32) translate(32 32) scale(.54) rotate(180) translate(-32 -59)"><polygon points="4.40,15.40 17.90,15.40 34.40,55.40 20.40,55.40" fill="#0E1550"/><polygon points="9.00,12.00 22.50,12.00 17.90,15.40 4.40,15.40" fill="url(#${id}mS)" stroke-linejoin="round"/><polygon points="9.00,12.00 22.50,12.00 17.90,15.40 4.40,15.40" fill="#0B0226" fill-opacity=".35"/><polygon points="22.50,12.00 39.00,52.00 34.40,55.40 17.90,15.40" fill="url(#${id}mS)" stroke-linejoin="round"/><polygon points="9.00,12.00 22.50,12.00 39.00,52.00 25.00,52.00" fill="url(#${id}mL)" stroke="#E9D8FF" stroke-opacity=".45" stroke-width=".25" stroke-linejoin="round"/><polygon points="36.90,15.40 50.40,15.40 34.40,55.40 20.40,55.40" fill="#0B1046"/><polygon points="41.50,12.00 55.00,12.00 50.40,15.40 36.90,15.40" fill="url(#${id}mS)" stroke-linejoin="round"/><polygon points="41.50,12.00 55.00,12.00 50.40,15.40 36.90,15.40" fill="#0B0226" fill-opacity=".35"/><polygon points="55.00,12.00 39.00,52.00 34.40,55.40 50.40,15.40" fill="url(#${id}mS)" stroke-linejoin="round"/><polygon points="41.50,12.00 55.00,12.00 39.00,52.00 25.00,52.00" fill="url(#${id}mR)" stroke="#F3E8FF" stroke-opacity=".45" stroke-width=".25" stroke-linejoin="round"/></g><g transform="rotate(120 32 32) translate(32 32) scale(.54) rotate(180) translate(-32 -59)"><polygon points="4.40,15.40 17.90,15.40 34.40,55.40 20.40,55.40" fill="#0E1550"/><polygon points="9.00,12.00 22.50,12.00 17.90,15.40 4.40,15.40" fill="url(#${id}mS)" stroke-linejoin="round"/><polygon points="9.00,12.00 22.50,12.00 17.90,15.40 4.40,15.40" fill="#0B0226" fill-opacity=".35"/><polygon points="22.50,12.00 39.00,52.00 34.40,55.40 17.90,15.40" fill="url(#${id}mS)" stroke-linejoin="round"/><polygon points="9.00,12.00 22.50,12.00 39.00,52.00 25.00,52.00" fill="url(#${id}mL)" stroke="#E9D8FF" stroke-opacity=".45" stroke-width=".25" stroke-linejoin="round"/><polygon points="36.90,15.40 50.40,15.40 34.40,55.40 20.40,55.40" fill="#0B1046"/><polygon points="41.50,12.00 55.00,12.00 50.40,15.40 36.90,15.40" fill="url(#${id}mS)" stroke-linejoin="round"/><polygon points="41.50,12.00 55.00,12.00 50.40,15.40 36.90,15.40" fill="#0B0226" fill-opacity=".35"/><polygon points="55.00,12.00 39.00,52.00 34.40,55.40 50.40,15.40" fill="url(#${id}mS)" stroke-linejoin="round"/><polygon points="41.50,12.00 55.00,12.00 39.00,52.00 25.00,52.00" fill="url(#${id}mR)" stroke="#F3E8FF" stroke-opacity=".45" stroke-width=".25" stroke-linejoin="round"/></g><g transform="rotate(240 32 32) translate(32 32) scale(.54) rotate(180) translate(-32 -59)"><polygon points="4.40,15.40 17.90,15.40 34.40,55.40 20.40,55.40" fill="#0E1550"/><polygon points="9.00,12.00 22.50,12.00 17.90,15.40 4.40,15.40" fill="url(#${id}mS)" stroke-linejoin="round"/><polygon points="9.00,12.00 22.50,12.00 17.90,15.40 4.40,15.40" fill="#0B0226" fill-opacity=".35"/><polygon points="22.50,12.00 39.00,52.00 34.40,55.40 17.90,15.40" fill="url(#${id}mS)" stroke-linejoin="round"/><polygon points="9.00,12.00 22.50,12.00 39.00,52.00 25.00,52.00" fill="url(#${id}mL)" stroke="#E9D8FF" stroke-opacity=".45" stroke-width=".25" stroke-linejoin="round"/><polygon points="36.90,15.40 50.40,15.40 34.40,55.40 20.40,55.40" fill="#0B1046"/><polygon points="41.50,12.00 55.00,12.00 50.40,15.40 36.90,15.40" fill="url(#${id}mS)" stroke-linejoin="round"/><polygon points="41.50,12.00 55.00,12.00 50.40,15.40 36.90,15.40" fill="#0B0226" fill-opacity=".35"/><polygon points="55.00,12.00 39.00,52.00 34.40,55.40 50.40,15.40" fill="url(#${id}mS)" stroke-linejoin="round"/><polygon points="41.50,12.00 55.00,12.00 39.00,52.00 25.00,52.00" fill="url(#${id}mR)" stroke="#F3E8FF" stroke-opacity=".45" stroke-width=".25" stroke-linejoin="round"/></g></g>`;

/**
 * Vahoha AI mentor icon. Spins while `thinking` is true and eases to a stop
 * (it simply pauses where it is) when the answer starts streaming.
 */
export default function ThinkingSpinner({ thinking = true, size = 24, label }) {
  // useId() returns things like ":r0:" (React 18) or "«r0»" (React 19), which are
  // not valid inside url(#...), so keep only safe characters.
  const id = "vh" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role="img"
      aria-label={label ?? (thinking ? "Vahoha is thinking" : "Vahoha AI mentor")}
      className={`vh-spin${thinking ? " is-thinking" : ""}`}
      dangerouslySetInnerHTML={{ __html: markup(id) }}
    />
  );
}
