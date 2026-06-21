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
import { SectionHeader, PathCard, CapstoneCard, ExamRow, ForHiringPanel } from "../My-Profile/components/ProfileSections";
import {
  MOCK_BADGES,
  MOCK_CERTIFICATES,
  MOCK_PATHS,
  MOCK_CAPSTONES,
  MOCK_EXAMS,
  ACTIVITY_GRID,
  ACTIVITY_COLORS,
  TOTAL_CONTRIBUTIONS,
  ACCENT,
} from "../My-Profile/components/profileData";

const UserNotFound = () => (
  <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-center px-4">
    <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-violet-950/40">
      <svg className="h-9 w-9 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>
    <h1 className="text-2xl font-bold text-gray-100">User not found</h1>
    <p className="mt-2 text-sm text-gray-500 max-w-xs">
      The profile you&apos;re looking for doesn&apos;t exist or has been removed.
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
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsMenuOpen(false);
    };
    const handleEsc = (e) => { if (e.key === "Escape") setIsMenuOpen(false); };
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
    `${user?.firstName ?? ""}${user?.lastName ?? ""}`.charAt(0).toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Toaster position="top-center" reverseOrder />

      <div className="max-w-6xl mx-auto">
        {/* Banner */}
        <div className="relative">
          <img
            src={stats?.bannerImage?.replace("/upload/", "/upload/w_1200,h_280,c_fill,f_auto,q_auto/") || UserBanner}
            alt="Banner"
            className="w-full h-40 sm:h-56 object-cover"
          />
          <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-gray-950 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-gray-950 to-transparent pointer-events-none" />

          <div className="absolute -bottom-10 sm:-bottom-13 left-5 sm:left-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-3 border-white dark:border-gray-900 shadow-sm">
              {stats?.profileImage ? (
                <img
                  src={stats.profileImage.replace("/upload/", "/upload/w_112,h_112,c_fill,f_auto,q_auto/")}
                  alt={`${user?.firstName} ${user?.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-white text-2xl sm:text-3xl font-bold">
                  {authorInitial}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile header */}
        <div className="pt-16 sm:pt-20 px-5 sm:px-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-10">
            {/* Left: name / bio / meta */}
            <div className="space-y-1.5 max-w-lg">
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
              <p className="text-sm font-medium text-gray-400 dark:text-gray-500">@{user?.username}</p>
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

            {/* Right: actions / stats / socials */}
            <div className="flex flex-col items-start lg:items-end gap-5 shrink-0">
              {/* Action buttons */}
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
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Following
                      </span>
                      <span className="hidden group-hover:flex items-center">Unfollow</span>
                    </>
                  ) : (
                    "Follow"
                  )}
                </button>

                <Link
                  to={isOwnProfile ? "#" : `/my-profile/chats`}
                  onClick={isOwnProfile ? (e) => e.preventDefault() : undefined}
                  className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold ring-1 ring-gray-200 dark:ring-gray-700 text-gray-600 dark:text-gray-300 transition-all duration-200 ${
                    isOwnProfile ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-800"
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
                              navigator.clipboard.writeText(window.location.href);
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

              {/* Stats */}
              <div className="flex gap-8">
                {[
                  { label: "Followers", value: stats?.followersCount ?? 0 },
                  { label: "Following", value: stats?.followingsCount ?? 0 },
                  { label: "Posts", value: stats?.postsCount ?? 0 },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <p className="text-base font-bold text-gray-900 dark:text-gray-100 lg:text-xl">{item.value}</p>
                    <p className="text-base text-gray-600 dark:text-gray-400 lg:text-sm">{item.label}</p>
                  </div>
                ))}
              </div>

              {/* Social links */}
              <div className="flex items-center gap-6 text-2xl text-gray-600 dark:text-gray-400">
                {SOCIAL_LINKS.map((item) =>
                  stats?.[item.key] ? (
                    <a key={item.key} href={stats[item.key]} target="_blank" rel="noreferrer" className={`transition ${item.hover}`}>
                      {item.icon}
                    </a>
                  ) : (
                    <span key={item.key} className="opacity-25 cursor-not-allowed">{item.icon}</span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Two-column body */}
        <div className="flex gap-6 px-5 sm:px-8 mt-2 pb-16">

          {/* Main column */}
          <div className="flex-1 min-w-0 space-y-0">

            {/* Activity */}
            <div>
              <SectionHeader title="activity · last 12 months" right={`${TOTAL_CONTRIBUTIONS} contributions`} />
              <div className="px-4 py-4 rounded-sm overflow-x-auto border border-gray-200 dark:border-gray-800">
                <div className="flex gap-[3px]">
                  {ACTIVITY_GRID.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[3px]">
                      {week.map((val, di) => (
                        <div
                          key={di}
                          className="w-[11px] h-[11px] rounded-[2px]"
                          style={{ backgroundColor: ACTIVITY_COLORS[val] }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 mt-3 justify-end">
                  <span className="text-[10px] text-gray-400 dark:text-gray-600">less</span>
                  {ACTIVITY_COLORS.map((c, i) => (
                    <div key={i} className="w-[11px] h-[11px] rounded-[2px]" style={{ backgroundColor: c }} />
                  ))}
                  <span className="text-[10px] text-gray-400 dark:text-gray-600">more</span>
                </div>
              </div>
            </div>

            {/* Paths */}
            <div>
              <SectionHeader title="paths" right="verified by devswebs" />
              <div className="space-y-3">
                {MOCK_PATHS.map((p) => <PathCard key={p.id} path={p} />)}
              </div>
            </div>

            {/* Capstones */}
            <div>
              <SectionHeader title="capstones · verified portfolio" right="ai-reviewed" />
              <div className="space-y-3">
                {MOCK_CAPSTONES.map((c) => <CapstoneCard key={c.id} c={c} />)}
              </div>
            </div>

            {/* Exam history */}
            <div>
              <SectionHeader title="exam history · verified" right="scores cryptographically signed" />
              <div className="space-y-2">
                {MOCK_EXAMS.map((e) => <ExamRow key={e.id} exam={e} />)}
              </div>
            </div>

            {/* Posts */}
            <div>
              <SectionHeader
                title="posts"
                right={(stats?.postsCount ?? 0) > 0 ? String(stats.postsCount) : undefined}
              />
              {blogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center rounded-sm border border-dashed border-gray-200 dark:border-gray-800">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800/80">
                    <svg className="h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">No posts yet</h3>
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
          </div>

          {/* Right panel */}
          <div className="w-60 shrink-0 hidden xl:block space-y-0">

            {/* For hiring */}
            <div>
              <SectionHeader title="for hiring" />
              <ForHiringPanel cvUrl={stats?.cvUrl ?? null} />
            </div>

            {/* Certificates */}
            <div>
              <SectionHeader title="certificates" />
              <div className="space-y-2">
                {MOCK_CERTIFICATES.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-center gap-3 px-3 py-3 rounded-sm border border-gray-800"
                  >
                    <div
                      className="w-9 h-9 rounded-sm flex items-center justify-center text-[11px] font-bold shrink-0"
                      style={{ border: `2px solid ${cert.color}`, backgroundColor: cert.bg, color: cert.color }}
                    >
                      {cert.char}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-gray-100 truncate">{cert.title}</p>
                      <p className="text-[10px] font-mono text-gray-600">{cert.score} · {cert.issued}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* At a glance */}
            <div>
              <SectionHeader title="at a glance" />
              <div className="space-y-2">
                {[
                  { label: "posts written", value: stats?.postsCount ?? 0 },
                  { label: "followers", value: stats?.followersCount ?? 0 },
                  { label: "following", value: stats?.followingsCount ?? 0 },
                  { label: "location", value: stats?.location || "—" },
                  { label: "last active", value: relativeTime(stats?.lastActive) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between text-[12px]">
                    <span className="text-gray-400 dark:text-gray-600">{label}</span>
                    <span className="font-semibold" style={{ color: ACCENT }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div>
              <SectionHeader title="badges" right="all →" />
              <div className="grid grid-cols-2 gap-3">
                {MOCK_BADGES.map((badge, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-[13px] font-bold"
                      style={{
                        border: `2px solid ${badge.earned ? badge.color : "#1f1f1f"}`,
                        backgroundColor: badge.earned ? badge.bg : "#0d0d0d",
                        color: badge.earned ? badge.color : "#333",
                        opacity: badge.earned ? 1 : 0.4,
                      }}
                    >
                      {badge.char}
                    </div>
                    <p
                      className="text-[9px] text-center font-bold leading-tight whitespace-pre-line"
                      style={{ color: badge.earned ? badge.color : "#333" }}
                    >
                      {badge.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
