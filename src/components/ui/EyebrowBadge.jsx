import React from "react";

/**
 * EyebrowBadge — Linear/Vercel-style status pill used as a page section label.
 *
 * Props:
 *   label   – short tag shown in the colored chip (e.g. "v0.1", "new", "beta")
 *   text    – descriptor text after the chip (e.g. "problems · path-specific")
 *   dot     – show animated pulse dot instead of a text chip  (default false)
 *   color   – "purple" | "green" | "amber" | "blue" | "rose"  (default "purple")
 */

const THEMES = {
  purple: {
    dot:        "#a855f7",
    chipBg:     "rgba(168,85,247,0.15)",
    chipText:   "#c084fc",
    chipBorder: "rgba(168,85,247,0.25)",
    glow:       "rgba(168,85,247,0.08)",
    border:     "rgba(168,85,247,0.18)",
  },
  green: {
    dot:        "#22c55e",
    chipBg:     "rgba(34,197,94,0.12)",
    chipText:   "#4ade80",
    chipBorder: "rgba(34,197,94,0.2)",
    glow:       "rgba(34,197,94,0.06)",
    border:     "rgba(34,197,94,0.15)",
  },
  amber: {
    dot:        "#f59e0b",
    chipBg:     "rgba(245,158,11,0.12)",
    chipText:   "#fbbf24",
    chipBorder: "rgba(245,158,11,0.2)",
    glow:       "rgba(245,158,11,0.06)",
    border:     "rgba(245,158,11,0.15)",
  },
  blue: {
    dot:        "#60a5fa",
    chipBg:     "rgba(96,165,250,0.12)",
    chipText:   "#93c5fd",
    chipBorder: "rgba(96,165,250,0.2)",
    glow:       "rgba(96,165,250,0.06)",
    border:     "rgba(96,165,250,0.15)",
  },
  rose: {
    dot:        "#f43f5e",
    chipBg:     "rgba(244,63,94,0.12)",
    chipText:   "#fb7185",
    chipBorder: "rgba(244,63,94,0.2)",
    glow:       "rgba(244,63,94,0.06)",
    border:     "rgba(244,63,94,0.15)",
  },
};

export default function EyebrowBadge({
  label,
  text,
  dot = false,
  color = "purple",
}) {
  const t = THEMES[color] ?? THEMES.purple;

  return (
    <span
      style={{
        display:        "inline-flex",
        alignItems:     "center",
        gap:            8,
        padding:        "5px 12px 5px 8px",
        borderRadius:   9999,
        border:         `1px solid ${t.border}`,
        background:     `linear-gradient(135deg, ${t.glow} 0%, rgba(255,255,255,0.02) 100%)`,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        fontSize:       11,
        fontWeight:     500,
        letterSpacing:  "0.04em",
        color:          "#94a3b8",
        userSelect:     "none",
        whiteSpace:     "nowrap",
      }}
    >
      {dot ? (
        /* Animated pulse dot — Linear live-status style */
        <span style={{ position: "relative", display: "inline-flex", width: 7, height: 7 }}>
          <span
            style={{
              position:        "absolute",
              inset:           0,
              borderRadius:    "50%",
              background:      t.dot,
              opacity:         0.5,
              animation:       "eyebrow-ping 1.6s cubic-bezier(0,0,0.2,1) infinite",
            }}
          />
          <span
            style={{
              position:     "relative",
              borderRadius: "50%",
              width:        7,
              height:       7,
              background:   t.dot,
            }}
          />
          <style>{`
            @keyframes eyebrow-ping {
              75%, 100% { transform: scale(2.2); opacity: 0; }
            }
          `}</style>
        </span>
      ) : (
        /* Solid chip — Clerk / Resend style */
        <span
          style={{
            display:      "inline-flex",
            alignItems:   "center",
            padding:      "2px 7px",
            borderRadius: 9999,
            background:   t.chipBg,
            border:       `1px solid ${t.chipBorder}`,
            fontSize:     10,
            fontWeight:   700,
            letterSpacing: "0.08em",
            color:        t.chipText,
            lineHeight:   1.4,
            fontFamily:   "monospace",
          }}
        >
          {label}
        </span>
      )}

      <span style={{ color: "#64748b", fontFamily: "monospace", fontSize: 11 }}>
        {text}
      </span>
    </span>
  );
}
