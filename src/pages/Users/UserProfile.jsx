import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import XIcon from "@mui/icons-material/X";
import UserBanner from "../../assets/user_profile/User_Banner.png";
import { fetchUserProfile, toggleFollow as toggleFollowApi } from "@/services/usersApi";

const ProfileSkeleton = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950 animate-pulse">
    <div className="relative">
      <div className="w-full h-40 sm:h-56 bg-gray-200 dark:bg-gray-800" />
      <div className="absolute -bottom-10 sm:-bottom-13 lg:-bottom-14 left-14 sm:left-16 lg:left-10 -translate-x-1/2 lg:translate-x-0 z-1">
        <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full bg-gray-300 dark:bg-gray-700 border-3 border-white dark:border-gray-900" />
      </div>
    </div>

    <div className="px-4 pt-16 sm:px-6 lg:px-10 lg:pt-20">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
        <div className="space-y-3 max-w-2xl">
          <div className="h-7 w-52 rounded-lg bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-80 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-3 w-44 rounded bg-gray-200 dark:bg-gray-800" />
        </div>
        <div className="flex flex-col items-start lg:items-end gap-6">
          <div className="flex gap-3">
            <div className="h-9 w-24 rounded-lg bg-gray-200 dark:bg-gray-800" />
            <div className="h-9 w-24 rounded-lg bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className="flex gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center space-y-1.5">
                <div className="h-6 w-10 rounded bg-gray-200 dark:bg-gray-800 mx-auto" />
                <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-800" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[478px] rounded-2xl bg-gray-200 dark:bg-gray-800" />
        ))}
      </div>
    </div>
  </div>
);

const UserNotFound = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center text-center px-4">
    <p className="mb-4 text-6xl select-none">👤</p>
    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
      User not found
    </h1>
    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
      The profile you&apos;re looking for doesn&apos;t exist or has been removed.
    </p>
    <Link
      to="/"
      className="mt-6 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500"
    >
      Go home
    </Link>
  </div>
);

export default function UserProfile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollower, setIsFollower] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    fetchUserProfile(username)
      .then((response) => {
        setUser(response.targetUser ?? null);
        setStats(response.stats ?? {});
        setIsFollowing(Boolean(response.isFollowing));
        setIsFollower(Boolean(response.isFollower));
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [username]);

  const handleFollowToggle = async () => {
    if (followLoading) return;
    setFollowLoading(true);
    const wasFollowing = isFollowing;
    setIsFollowing(!wasFollowing);
    setStats((prev) => ({
      ...prev,
      followersCount: (prev?.followersCount ?? 0) + (wasFollowing ? -1 : 1),
    }));
    try {
      const res = await toggleFollowApi(username, wasFollowing);
      if (!res.ok) throw new Error();
      toast.success(wasFollowing ? "Unfollowed" : "Now following!");
    } catch {
      setIsFollowing(wasFollowing);
      setStats((prev) => ({
        ...prev,
        followersCount: (prev?.followersCount ?? 0) + (wasFollowing ? 1 : -1),
      }));
      toast.error("Something went wrong");
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) return <ProfileSkeleton />;
  if (notFound || !user) return <UserNotFound />;

  const authorInitial =
    `${user?.firstName ?? ""}${user?.lastName ?? ""}`.charAt(0).toUpperCase() || "?";

  const socialLinks = [
    {
      key: "github",
      href: stats?.githubLink,
      icon: <FaGithub />,
      className: "hover:text-black dark:hover:text-gray-100",
    },
    {
      key: "linkedin",
      href: stats?.linkedinLink,
      icon: <FaLinkedin />,
      className: "hover:text-blue-600 dark:hover:text-blue-400",
    },
    {
      key: "x",
      href: stats?.twitterLink,
      icon: <XIcon fontSize="inherit" />,
      className: "hover:text-gray-900 dark:hover:text-gray-100",
    },
  ].filter((item) => !!item.href);

  const statItems = [
    { label: "Followers", value: stats?.followersCount ?? 0 },
    { label: "Following", value: stats?.followingsCount ?? 0 },
    { label: "Posts", value: stats?.postsCount ?? 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Toaster position="top-center" reverseOrder />

      <div className="relative">
        <img
          src={
            stats?.bannerImage?.replace(
              "/upload/",
              "/upload/w_1200,h_280,c_fill,f_auto,q_auto/",
            ) || UserBanner
          }
          alt="Banner"
          className="w-full h-40 sm:h-56 object-cover z-0"
        />

        <div className="absolute -bottom-10 sm:-bottom-13 lg:-bottom-14 left-14 sm:left-16 lg:left-10 -translate-x-1/2 lg:translate-x-0 z-1">
          <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-3 border-white dark:border-gray-900 shadow-sm">
            {stats?.profileImage ? (
              <img
                src={stats.profileImage.replace(
                  "/upload/",
                  "/upload/w_112,h_112,c_fill,f_auto,q_auto/",
                )}
                alt={`${user?.firstName} ${user?.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-purple-100 dark:bg-purple-700 text-purple-700 dark:text-white text-2xl sm:text-3xl font-bold">
                {authorInitial}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pt-16 sm:px-6 lg:px-10 lg:pt-20">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          {/* User info */}
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {user?.firstName} {user?.lastName}
              </h1>
              {isFollower && (
                <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                  Follows you
                </span>
              )}
            </div>

            <p className="text-sm text-gray-400 dark:text-gray-500">
              @{user?.username}
            </p>

            <p className="text-gray-700 dark:text-gray-300">
              {stats?.bio || "No bio yet."}
            </p>

            {stats?.location && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats.location}
              </p>
            )}

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last active:{" "}
              {stats?.lastActive
                ? new Date(stats.lastActive).toLocaleString()
                : "Recently"}
            </p>
          </div>

          {/* Actions + stats + social */}
          <div className="flex flex-col items-start lg:items-end gap-6">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleFollowToggle}
                disabled={followLoading}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer disabled:opacity-60 ${
                  isFollowing
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    : "bg-violet-600 text-white hover:bg-violet-500"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
              <Link
                to={`/messages/${username}`}
                className="px-5 py-2 rounded-lg text-sm font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Message
              </Link>
            </div>

            <div className="flex gap-8">
              {statItems.map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-base font-bold text-gray-900 dark:text-gray-100 lg:text-xl">
                    {item.value}
                  </p>
                  <p className="text-base text-gray-600 dark:text-gray-400 lg:text-sm">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            {socialLinks.length > 0 && (
              <div className="flex items-center gap-6 text-2xl text-gray-600 dark:text-gray-400">
                {socialLinks.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`transition ${item.className}`}
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Posts */}
        <div className="mt-12 pb-16">
          <div className="col-span-3 flex flex-col items-center justify-center py-20 text-center">
            <p className="mb-4 text-5xl select-none">✍️</p>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              No posts yet
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              {user?.firstName} hasn&apos;t published anything yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
