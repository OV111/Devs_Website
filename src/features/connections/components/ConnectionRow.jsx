import { Link } from "react-router-dom";
import defaultAvatar from "@/assets/user_profile/User_Profile.jpg";
import { displayName, isMutual, timeAgo } from "../lib/connections";

const CHIP = "rounded-full border px-2 py-0.5 text-xs font-medium";

/** Follow / Following, where Following turns into Unfollow on hover or focus. */
function FollowButton({ user, name, pending, onToggle }) {
  const following = user.youFollow;
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => onToggle(user)}
      aria-pressed={following}
      aria-label={`${following ? "Unfollow" : "Follow"} ${name}`}
      className={`group min-w-[104px] shrink-0 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 disabled:cursor-wait disabled:opacity-60 ${
        following
          ? "border-white/15 text-neutral-200 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-300 focus-visible:border-red-500/50"
          : "border-transparent bg-purple-600 text-white hover:bg-purple-500"
      }`}
    >
      {following ? (
        <>
          <span className="group-hover:hidden group-focus-visible:hidden">
            Following
          </span>
          <span className="hidden group-hover:inline group-focus-visible:inline">
            Unfollow
          </span>
        </>
      ) : (
        "Follow"
      )}
    </button>
  );
}

/**
 * One person in a followers / following list. The avatar and name open their
 * profile; the badge says how they relate to you; the date says since when.
 */
export default function ConnectionRow({ user, kind, pending, onToggle }) {
  const name = displayName(user);
  const profile = `/users/${user.username}`;
  const bio = user.stats?.bio?.trim();
  const since = timeAgo(user.followedAt);

  return (
    <li className="flex items-center gap-4 px-4 py-4 sm:px-5">
      {/* The name link below is the accessible one; this just widens the click target. */}
      <Link to={profile} className="shrink-0 rounded-full" tabIndex={-1} aria-hidden="true">
        <img
          src={user.stats?.profileImage || defaultAvatar}
          alt=""
          className="size-12 rounded-full bg-neutral-800 object-cover"
          loading="lazy"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link
            to={profile}
            className="truncate text-[15px] font-semibold text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
          >
            {name}
          </Link>
          <span className="truncate text-sm text-neutral-400">
            @{user.username}
          </span>
          {isMutual(user) ? (
            <span
              className={`${CHIP} border-purple-500/30 bg-purple-500/10 text-purple-200`}
            >
              Mutual
            </span>
          ) : user.followsYou ? (
            <span
              className={`${CHIP} border-white/10 bg-white/[0.04] text-neutral-300`}
            >
              Follows you
            </span>
          ) : null}
        </div>

        {bio && (
          <p className="mt-1 line-clamp-1 text-sm text-neutral-300">{bio}</p>
        )}

        {since && (
          <p className="mt-1 text-xs text-neutral-500">
            {kind === "followers" ? "Followed you" : "You followed"} {since}
          </p>
        )}
      </div>

      <FollowButton
        user={user}
        name={name}
        pending={pending}
        onToggle={onToggle}
      />
    </li>
  );
}
