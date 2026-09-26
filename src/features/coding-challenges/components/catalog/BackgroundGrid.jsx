/** Faint fading grid texture behind the hero. */
export default function BackgroundGrid() {
  return (
    <div
      className="pointer-events-none absolute top-0 left-0 right-0 h-[400px] z-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
        maskImage:
          "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent), linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        maskComposite: "intersect",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent), linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        WebkitMaskComposite: "destination-in",
      }}
    />
  );
}
