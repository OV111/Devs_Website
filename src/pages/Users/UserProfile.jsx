import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { FiMapPin, FiClock, FiMessageSquare } from "react-icons/fi";
import { Ellipsis } from "lucide-react";
import UserBanner from "../../assets/user_profile/User_Banner.png";
import { fetchUserProfile, toggleFollow } from "@/services/usersApi";
import { fetchUserBlogs } from "@/services/blogsApi";
import BlogCard from "@/components/blog/BlogCard";
import useProfileStore from "@/stores/useProfileStore";
import ProfileSkeleton from "./ProfileSkeleton";
import SOCIAL_LINKS from "../../../constants/SocialLinks";

const UserNotFound = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center text-center px-4">
    <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-950/40">
      <svg
        className="h-9 w-9 text-violet-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    </div>
    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
      User not found
    </h1>
    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
      The profile you&apos;re looking for doesn&apos;t exist or has been
      removed.
    </p>
    <Link
      to="/"
      className="mt-6 rounded-full bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 transition shadow-sm shadow-violet-500/20"
    >
      Go home
    </Link>
  </div>
);

function relativeTime(dateStr) {
  if (!dateStr) return "Recently";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function UserProfile() {
  const { username } = useParams();
  const { user: loggedInUser } = useProfileStore();
  const isOwnProfile = loggedInUser?.username === username;
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollower, setIsFollower] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setIsMenuOpen(false);
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        const response = await fetchUserProfile(username);
        const fetchedStats = response.stats ?? {};
        setUser(response.targetUser ?? null);
        setStats(fetchedStats);
        setIsFollowing(Boolean(response.isFollowing));
        setIsFollower(Boolean(response.isFollower));

        if (fetchedStats.userId) {
          const blogsData = await fetchUserBlogs(fetchedStats.userId, 6);
          setBlogs(blogsData);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
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
      const res = await toggleFollow(username, wasFollowing);
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
    `${user?.firstName ?? ""}${user?.lastName ?? ""}`.charAt(0).toUpperCase() ||
    "?";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Toaster position="top-center" reverseOrder />

      <div className="max-w-6xl mx-auto">
        <div className="relative">
          <div className="overflow-hidden rounded-b-3xl">
            <img
              src={
                stats?.bannerImage?.replace(
                  "/upload/",
                  "/upload/w_1200,h_280,c_fill,f_auto,q_auto/",
                ) || UserBanner
              }
              alt="Banner"
              className="w-full h-52 sm:h-64 object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/5 to-transparent rounded-b-3xl" />
          </div>

          <div className="absolute -bottom-12 sm:-bottom-14 left-5 sm:left-8">
            <div className="ring-4 ring-gray-50 dark:ring-gray-950 rounded-full shadow-lg">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden">
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
                  <div className="w-full h-full flex items-center justify-center bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-white text-3xl sm:text-4xl font-bold">
                    {authorInitial}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-18 sm:pt-22 px-5 sm:px-8 pb-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-10">
            <div className="space-y-2 max-w-lg">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  {user?.firstName} {user?.lastName}
                </h1>
                {isFollower && (
                  <span className="rounded-full bg-violet-100 dark:bg-violet-950/60 px-2.5 py-0.5 text-xs font-semibold text-violet-600 dark:text-violet-400 ring-1 ring-violet-200 dark:ring-violet-900/60">
                    Follows you
                  </span>
                )}
              </div>

              <p className="text-sm font-medium text-gray-400 dark:text-gray-500">
                @{user?.username}
              </p>

              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 pt-0.5">
                {stats?.bio || "No bio yet."}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-gray-400 dark:text-gray-500">
                {stats?.location && (
                  <span className="flex items-center gap-1.5">
                    <FiMapPin className="h-3.5 w-3.5 shrink-0" />
                    {stats.location}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <FiClock className="h-3.5 w-3.5 shrink-0" />
                  Active {relativeTime(stats?.lastActive)}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-start lg:items-end gap-5 shrink-0">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleFollowToggle}
                  disabled={followLoading || isOwnProfile}
                  className={`group flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                    isFollowing
                      ? "bg-violet-600 hover:bg-violet-500 shadow-sm shadow-violet-500/30"
                      : "bg-fuchsia-600 hover:bg-fuchsia-700"
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <span className="flex items-center gap-1.5 group-hover:hidden">
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Following
                      </span>
                      <span className="hidden group-hover:flex items-center">
                        Unfollow
                      </span>
                    </>
                  ) : (
                    "Follow"
                  )}
                </button>

                <Link
                  to={isOwnProfile ? "#" : `/my-profile/chats`}
                  onClick={isOwnProfile ? (e) => e.preventDefault() : undefined}
                  className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold ring-1 ring-gray-200 dark:ring-gray-700 text-gray-600 dark:text-gray-300 transition-all duration-200 ${
                    isOwnProfile
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <FiMessageSquare className="h-3.5 w-3.5" />
                  Message
                </Link>

                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    aria-label="More options"
                    aria-expanded={isMenuOpen}
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    className="cursor-pointer rounded-full bg-gray-100 p-2.5 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <Ellipsis className="h-4 w-4" />
                  </button>

                  {isMenuOpen && (
                    <ul className="absolute right-0 z-10 mt-2 grid w-52 gap-1 overflow-hidden rounded-2xl border border-gray-200 bg-white/95 p-2 shadow-xl shadow-black/10 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/95 dark:shadow-black/40">
                      {[
                        {
                          label: "Copy Profile Link",
                          onClick: () => {
                            navigator.clipboard.writeText(window.location.href);
                            toast.success("Link copied!");
                            setIsMenuOpen(false);
                          },
                        },
                        {
                          label: "Share Profile",
                          onClick: () => {
                            if (navigator.share) {
                              navigator.share({ url: window.location.href });
                            } else {
                              navigator.clipboard.writeText(
                                window.location.href,
                              );
                              toast.success("Link copied!");
                            }
                            setIsMenuOpen(false);
                          },
                        },
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={item.onClick}
                          className="w-full cursor-pointer rounded-lg border border-transparent bg-gray-50 px-3 py-2 text-left text-xs font-medium text-gray-800 transition-all duration-200 hover:border-gray-200 hover:bg-gray-100 dark:bg-gray-800/70 dark:text-gray-200 dark:hover:border-gray-600 dark:hover:bg-gray-800"
                        >
                          <li>{item.label}</li>
                        </button>
                      ))}
                      {!isOwnProfile && (
                        <>
                          <button
                            type="button"
                            onClick={() => setIsMenuOpen(false)}
                            className="w-full cursor-pointer rounded-lg border border-transparent bg-red-50 px-3 py-2 text-left text-xs font-medium text-red-700 transition-all duration-200 hover:border-red-200 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-300 dark:hover:border-red-900/70 dark:hover:bg-red-950/50"
                          >
                            <li>Report User</li>
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsMenuOpen(false)}
                            className="w-full cursor-pointer rounded-lg border border-transparent bg-red-50 px-3 py-2 text-left text-xs font-medium text-red-700 transition-all duration-200 hover:border-red-200 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-300 dark:hover:border-red-900/70 dark:hover:bg-red-950/50"
                          >
                            <li>Block User</li>
                          </button>
                        </>
                      )}
                    </ul>
                  )}
                </div>
              </div>

              <div className="flex gap-8">
                {[
                  { label: "Followers", value: stats?.followersCount ?? 0 },
                  { label: "Following", value: stats?.followingsCount ?? 0 },
                  { label: "Posts", value: stats?.postsCount ?? 0 },
                ].map((item) => (
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

              <div className="flex items-center gap-6 text-2xl text-gray-600 dark:text-gray-400">
                {SOCIAL_LINKS.map((item) =>
                  stats?.[item.key] ? (
                    <a
                      key={item.key}
                      href={stats[item.key]}
                      target="_blank"
                      rel="noreferrer"
                      className={`transition ${item.hover}`}
                    >
                      {item.icon}
                    </a>
                  ) : (
                    <span
                      key={item.key}
                      className="opacity-25 cursor-not-allowed"
                    >
                      {item.icon}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide shrink-0">
              Posts
            </h2>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            {(stats?.postsCount ?? 0) > 0 && (
              <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500 tabular-nums">
                {stats.postsCount ?? 0}
              </span>
            )}
          </div>

          <div className="mt-6 pb-4">
            {blogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800/80">
                  <svg
                    className="h-6 w-6 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  No posts yet
                </h3>
                <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                  {user?.firstName} hasn&apos;t published anything yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {blogs.slice(0, 6).map((blog) => (
                  <BlogCard key={String(blog._id)} card={blog} />
                ))}
              </div>
            )}
          </div>
          <div className="mt-10 flex items-center gap-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide shrink-0">
              Progress
            </h2>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            {(stats?.postsCount ?? 0) > 0 && (
              <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500 tabular-nums">
                {stats.postsCount ?? 0}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
