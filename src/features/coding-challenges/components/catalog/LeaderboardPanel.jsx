const LeaderboardSkeleton = () => (
  <div className="flex flex-col gap-1 animate-pulse">
    {[0, 1, 2, 3, 4].map((i) => (
      <div key={i} className="flex items-center gap-2 px-2 py-1.5">
        <div className="h-3 w-5 shrink-0 rounded-sm bg-[#1a1a1a]" />
        <div className="h-5 w-5 shrink-0 rounded-full bg-[#1a1a1a]" />
        <div className="h-3 flex-1 rounded-sm bg-[#1a1a1a]" />
        <div className="h-3 w-8 shrink-0 rounded-sm bg-[#1a1a1a]" />
      </div>
    ))}
  </div>
);

/**
 * Ranked by XP earned from solves in the window — the same rule the server
 * documents, so a user can check their own row against their solve history.
 */
export default function LeaderboardPanel({ leaderboard, loading }) {
  const rows = leaderboard?.rows ?? [];

  const scopeLabel = [
    leaderboard?.layerOrder ? `layer ${leaderboard.layerOrder}` : "global",
    leaderboard?.range,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-mono text-[#444]">// LEADERBOARD</p>
        {!loading && rows.length > 0 && (
          <span className="text-[10px] text-[#2a2a2a]">{scopeLabel}</span>
        )}
      </div>

      {loading && rows.length === 0 ? (
        <LeaderboardSkeleton />
      ) : rows.length === 0 ? (
        <p className="px-2 text-[11px] text-[#444]">
          No solves yet this week — be the first.
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {rows.map(({ rank, initial, name, score, you, profileImage }) => (
            <div
              key={`${rank}-${name}`}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-sm border ${
                you
                  ? "bg-[#0f0b1a] border-[#2d1b4e]"
                  : "bg-transparent border-transparent"
              }`}
            >
              <span
                className={`text-[10px] w-5 shrink-0 tabular-nums text-right ${rank <= 3 ? "text-purple-600" : "text-[#333]"}`}
              >
                {rank <= 3 ? String(rank).padStart(2, "0") : `#${rank}`}
              </span>
              <div
                className={`w-5 h-5 rounded-full overflow-hidden flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  you ? "bg-purple-600 text-white" : "bg-[#1a1a1a] text-[#666]"
                }`}
              >
                {profileImage ? (
                  <img
                    src={profileImage.replace(
                      "/upload/",
                      "/upload/w_40,h_40,c_fill,f_auto,q_auto/",
                    )}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initial
                )}
              </div>
              <span
                className={`flex-1 text-[11px] truncate ${you ? "text-[#e5e5e5]" : "text-[#555]"}`}
              >
                {name}
              </span>
              <span
                className={`text-[11px] font-semibold tabular-nums shrink-0 ${you ? "text-purple-600" : "text-[#444]"}`}
              >
                {score.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
