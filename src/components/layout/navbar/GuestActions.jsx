import { Link } from "react-router-dom";

// One entry point for guests: /get-started opens on signup and has its own
// "log in instead" toggle, so a separate Log in link only splits attention.
// `fullWidth` makes it a thumb-sized button for the mobile menu.
const GuestActions = ({
  showBadge = false,
  fullWidth = false,
  className = "",
}) => (
  <div className={`flex items-center gap-3 ${className}`}>
    {showBadge && (
      <span className="hidden rounded-full border border-purple-400/40 px-2 py-0.5 text-[11px] font-medium text-purple-300 lg:inline">
        Free during beta
      </span>
    )}
    <Link
      to="/get-started"
      className={`text-sm font-medium text-gray-100 transition hover:text-purple-500 ${
        fullWidth
          ? "flex-1 rounded-md border border-white/20 py-2.5 text-center"
          : "py-1.5"
      }`}
    >
      Get Started
    </Link>
  </div>
);

export default GuestActions;
