/**
 * Placeholder shown while an existing session's history loads.
 *
 * Deliberately mirrors the real message layout (role dot + label, then lines of
 * text) so the transcript doesn't visibly jump when the real content lands.
 * Alternating user/agent rows hint that a conversation is arriving, not a blank
 * session — which is what the old empty-state implied.
 */
const Line = ({ width }) => (
  <div className="h-3.5 rounded bg-white/8 animate-pulse" style={{ width }} />
);

const Block = ({ isUser, widths }) => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <span
        className="w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ backgroundColor: isUser ? "#555" : "#9333ea" }}
      />
      <span
        className="h-2.5 w-10 rounded animate-pulse"
        style={{ backgroundColor: isUser ? "#3a3a3a" : "#4c1d95" }}
      />
    </div>
    <div className="space-y-2 max-w-2xl">
      {widths.map((w, i) => (
        <Line key={i} width={w} />
      ))}
    </div>
  </div>
);

export default function MessageSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading conversation">
      <Block isUser widths={["45%"]} />
      <Block widths={["92%", "85%", "60%"]} />
      <Block isUser widths={["35%"]} />
      <Block widths={["88%", "70%"]} />
    </div>
  );
}
