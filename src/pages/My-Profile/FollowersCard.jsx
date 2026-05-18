import SOCIAL_LINKS from "../../../constants/SocialLinks";
import defaultAvatar from "../../assets/user_profile/User_Profile.jpg";

const FollowersCard = ({
  user,
  isFollowing,
  onToggleFollow,
  actionLoading,
}) => {
  const displayName =
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || user?.username;

  const formatTimeAgo = (input) => {
    const date = new Date(input);
    if (!input || Number.isNaN(date.getTime())) return "N/A";
    const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000);
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    const units = [
      ["year", 60 * 60 * 24 * 365],
      ["month", 60 * 60 * 24 * 30],
      ["week", 60 * 60 * 24 * 7],
      ["day", 60 * 60 * 24],
      ["hour", 60 * 60],
      ["minute", 60],
      ["second", 1],
    ];
    for (const [unit, secondsInUnit] of units) {
      const value = Math.round(diffSeconds / secondsInUnit);
      if (Math.abs(value) >= 1) return rtf.format(value, unit);
    }
    return "just now";
  };
  const lastActiveText = formatTimeAgo(user?.stats?.lastActive);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-800/50 p-4 transition-all duration-200 hover:border-purple-300 dark:hover:border-purple-700/60">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={user?.stats?.profileImage || defaultAvatar}
            alt="profile image"
            className="h-11 w-11 rounded-full bg-gray-200 dark:bg-gray-700 object-cover ring-1 ring-gray-100  lg:h-14 lg:w-14"
          />
          <div className="min-w-0">
            <p className="truncate text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-gray-100">
              {displayName}
            </p>
            <p className="truncate overflow-hidden text-sm text-gray-400 dark:text-gray-500">@{user?.username}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">

          {SOCIAL_LINKS.filter((item) => user?.stats?.[item.key]).map((item) => (
            <a
              key={item.key}
              href={user.stats[item.key]}
              target="_blank"
              rel="noreferrer"
              className={`text-gray-400 dark:text-gray-500 transition-colors text-lg ${item.hover}`}
            >
              {item.icon}
            </a>
          ))}
          <button
            type="button"
            disabled={actionLoading}
            onClick={() => onToggleFollow(user, isFollowing)}
            className={`rounded-lg px-2 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold transition-all duration-200 ${
              isFollowing
                ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/60"
                : "bg-purple-600 dark:bg-purple-500 text-white hover:bg-purple-700 dark:hover:bg-purple-600"
            } ${actionLoading ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
          >
            {actionLoading ? "..." : isFollowing ? "Following" : "Follow"}
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{user?.stats?.bio || "-"}</p>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between pt-3 border-t border-gray-100 dark:border-gray-700/50 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span>{user?.stats?.location || "Location not set"}</span>
          <span className="text-gray-300 dark:text-gray-600">•</span>
          <span>Last Active: {lastActiveText}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="font-medium text-gray-700 dark:text-gray-300">{user?.stats?.followersCount ?? 0} <span className="font-normal text-gray-400 dark:text-gray-500">Followers</span></span>
          <span className="text-gray-300 dark:text-gray-600">·</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">{user?.stats?.followingsCount ?? 0} <span className="font-normal text-gray-400 dark:text-gray-500">Following</span></span>
          <span className="text-gray-300 dark:text-gray-600">·</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">{user?.stats?.postsCount ?? 0} <span className="font-normal text-gray-400 dark:text-gray-500">Posts</span></span>
        </div>
      </div>
    </div>
  );
};

export default FollowersCard;
