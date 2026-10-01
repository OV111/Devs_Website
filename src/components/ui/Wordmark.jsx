import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// The brand name is a logo, so it must render identically everywhere: same
// typeface as the hero headline (Geist), same weight, same tracking. Only the
// size changes per placement, and only through these presets.
const SIZES = {
  sm: "text-lg",
  md: "text-xl",
};

const Wordmark = ({ size = "md", className }) => (
  <Link
    to="/"
    aria-label="Vahoha home"
    className={cn(
      "font-semibold tracking-[-0.02em] text-white transition-opacity hover:opacity-80",
      SIZES[size],
      className,
    )}
    style={{ fontFamily: '"Geist Variable", system-ui, sans-serif' }}
  >
    Vahoha
  </Link>
);

export default Wordmark;
