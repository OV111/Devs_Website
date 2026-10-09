import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import vahohaMark from "@/assets/vahoha_mark_circle_96.webp";

// The brand name is a logo, so it must render identically everywhere: same
// typeface as the hero headline (Geist), same weight, same tracking. Only the
// size changes per placement, and only through these presets.
const SIZES = {
  sm: "text-lg",
  md: "text-xl",
};

// `markOnMobile`: below the md breakpoint the name collapses to the logo mark, so
// a crowded mobile navbar keeps its space. The link keeps its aria-label either way.
const Wordmark = ({ size = "md", className, markOnMobile = false }) => (
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
    {markOnMobile ? (
      <>
        <img src={vahohaMark} alt="" width={32} height={32} className="block h-8 w-8 rounded-full md:hidden" />
        <span className="hidden md:inline">Vahoha</span>
      </>
    ) : (
      "Vahoha"
    )}
  </Link>
);

export default Wordmark;
