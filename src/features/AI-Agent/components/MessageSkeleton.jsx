/**
 * Placeholder shown while an existing session's history loads.
 *
 * Mirrors the real chat layout — right-aligned user bubbles, full-width agent
 * blocks — so the transcript doesn't visibly jump when content lands. It also
 * signals "a conversation is arriving", which is what the old empty-state
 * ("start a conversation") failed to do.
 */
const Line = ({ width }) => (
  <div className="h-3.5 rounded bg-white/8 animate-pulse" style={{ width }} />
);

const UserBubble = ({ width }) => (
  <div className="flex justify-end">
    <div className="rounded-2xl rounded-br-md px-4 py-3 bg-white/5" style={{ width }}>
      <div className="h-3.5 rounded bg-white/8 animate-pulse" />
    </div>
  </div>
);

const AgentBlock = ({ widths }) => (
  <div className="space-y-2">
    {widths.map((w, i) => (
      <Line key={i} width={w} />
    ))}
  </div>
);

export default function MessageSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading conversation">
      <UserBubble width="45%" />
      <AgentBlock widths={["92%", "85%", "60%"]} />
      <UserBubble width="30%" />
      <AgentBlock widths={["88%", "70%"]} />
    </div>
  );
}
