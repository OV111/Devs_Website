import { C, FONT_MONO } from "../../lib/arenaTheme";

export default function SectionHead({ children }) {
  return (
    <h2
      className="text-[10px] font-bold tracking-[0.18em] uppercase mb-2"
      style={{ color: C.muted, fontFamily: FONT_MONO }}
    >
      {children}
    </h2>
  );
}
