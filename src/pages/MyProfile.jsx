import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SOCIAL_LINKS from "../../constants/SocialLinks";
import LoadingSuspense from "../components/feedback/LoadingSuspense";
import SideBar from "./My-Profile/components/SideBar";
import useProfileStore from "@/stores/useProfileStore";
import useAuthStore from "@/stores/useAuthStore";
import BlogCard from "@/components/blog/BlogCard";
import { updateLastActive } from "@/services/profileApi";
import UserBanner from "../assets/user_profile/User_Banner.png";
import {
  ACCENT,
  MOCK_PATHS,
  MOCK_CAPSTONES,
  MOCK_EXAMS,
  MOCK_BADGES,
  GLANCE_STATS,
  DEVSCOIN_BALANCE,
  DEVSCOIN_TXN,
  ACTIVITY_GRID,
  ACTIVITY_COLORS,
  TOTAL_CONTRIBUTIONS,
} from "./My-Profile/components/profileData";
import {
  SectionHeader,
  PathCard,
  CapstoneCard,
  ExamRow,
  DevsCoinSection,
} from "./My-Profile/components/ProfileSections";

// ── Main component ─────────────────────────────────────────────

const MyProfile = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { user, stats, blogs, isLoading, isBlogsLoading, fetchProfile, updateStats, fetchUserBlogs } =
    useProfileStore();

  const [isSideBarOpened, setIsSideBarOpened] = useState(window.innerWidth >= 1024);

  const isActive = async (userId) => {
    const now = await updateLastActive(userId);
    if (now) updateStats({ lastActive: now });
  };

  useEffect(() => {
    if (!user) {
      fetchProfile().then((result) => {
        if (result === "unauthorized") { logout(); navigate("/get-started"); return; }
        if (result?.userId) { isActive(result.userId); fetchUserBlogs(result.userId); }
      });
    } else {
      if (stats?.userId) { isActive(stats.userId); fetchUserBlogs(stats.userId); }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleResize = () => {
      window.innerWidth < 1024 ? setIsSideBarOpened(false) : setIsSideBarOpened(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading) return <LoadingSuspense />;

  return (
    <div className="flex">
      <SideBar isOpen={isSideBarOpened} onClose={() => setIsSideBarOpened(false)} />

      <div className="flex-1 min-w-0">
        {/* Banner */}
        <div className="relative">
          <img
            src={stats?.bannerImage?.replace("/upload/", "/upload/w_1200,h_280,c_fill,f_auto,q_auto/") || UserBanner}
            alt="Banner"
            className="w-full h-40 sm:h-56 object-cover"
          />
          <div className="absolute -bottom-10 sm:-bottom-13 lg:-bottom-14 left-14 sm:left-16 lg:left-10 -translate-x-1/2 lg:translate-x-0 z-1">
            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-3 border-white dark:border-gray-900 shadow-sm">
              {stats?.profileImage ? (
                <img
                  src={stats.profileImage.replace("/upload/", "/upload/w_112,h_112,c_fill,f_auto,q_auto/")}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-purple-100 dark:bg-purple-700 text-purple-700 dark:text-white text-2xl sm:text-3xl font-bold">
                  {user?.firstName?.[0]?.toUpperCase()}
                  {user?.lastName?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile header */}
        <div className="px-0 pt-16 sm:px-6 lg:px-10 lg:pt-20">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="space-y-1 max-w-2xl">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-gray-700 dark:text-gray-300">
                {stats?.bio || "Tell others a bit about yourself - add a bio in settings."}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last active:{" "}
                {stats?.lastActive ? new Date(stats.lastActive).toLocaleString() : "Active now"}
              </p>
            </div>
            <div className="flex flex-col items-start lg:items-end gap-6">
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

        {/* ── New two-column section ── */}
        <div className="flex gap-6 px-4 sm:px-6 lg:px-10 mt-10 pb-16">

          {/* Main column */}
          <div className="flex-1 min-w-0 space-y-8">

            {/* PATHS */}
            <div>
              <SectionHeader title="paths" right="verified by devsflow" />
              <div className="space-y-3">
                {MOCK_PATHS.map((p) => <PathCard key={p.id} path={p} />)}
              </div>
            </div>

            {/* CAPSTONES */}
            <div>
              <SectionHeader title="capstones · verified portfolio" right="ai-reviewed" />
              <div className="space-y-3">
                {MOCK_CAPSTONES.map((c) => <CapstoneCard key={c.id} c={c} />)}
              </div>
            </div>

            {/* ACTIVITY */}
            <div>
              <SectionHeader title="activity · last 12 months" right={`${TOTAL_CONTRIBUTIONS} contributions`} />
              <div
                className="px-4 py-4 rounded-sm overflow-x-auto"
                style={{ border: "1px solid #1a1a1a", backgroundColor: "#0d0d0d" }}
              >
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
                  <span className="text-[10px]" style={{ color: "#444" }}>less</span>
                  {ACTIVITY_COLORS.map((c, i) => (
                    <div key={i} className="w-[11px] h-[11px] rounded-[2px]" style={{ backgroundColor: c }} />
                  ))}
                  <span className="text-[10px]" style={{ color: "#444" }}>more</span>
                </div>
              </div>
            </div>

            {/* EXAM HISTORY */}
            <div>
              <SectionHeader title="exam history · verified" right="scores cryptographically signed" />
              <div className="space-y-2">
                {MOCK_EXAMS.map((e) => <ExamRow key={e.id} exam={e} />)}
              </div>
            </div>

            {/* DEVSCOIN */}
            <div>
              <SectionHeader title="devscoin" right={`${DEVSCOIN_BALANCE.toLocaleString()} DC`} />
              <DevsCoinSection />
            </div>

            {/* BLOGS */}
            <div>
              <SectionHeader title="posts" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isBlogsLoading || !stats?.userId ? (
                  <div className="col-span-3 flex items-center justify-center py-16">
                    <p className="text-sm text-gray-400">Loading posts...</p>
                  </div>
                ) : blogs.length === 0 ? (
                  <div className="col-span-3 flex flex-col items-center justify-center py-16 text-center">
                    <div className="mb-4 text-5xl">✍️</div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No posts yet</h3>
                    <p className="mt-1 text-sm text-gray-400">You haven't published anything yet.</p>
                    <Link
                      to="add-blog"
                      className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500"
                    >
                      Write a post
                    </Link>
                  </div>
                ) : (
                  blogs.map((blog) => <BlogCard key={String(blog._id)} card={blog} />)
                )}
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="w-60 shrink-0 hidden xl:block space-y-7">

            {/* BADGES */}
            <div>
              <SectionHeader title={`badges · 14 of 84`} right="all →" />
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
                    <p className="text-[9px] text-center font-bold leading-tight whitespace-pre-line"
                      style={{ color: badge.earned ? badge.color : "#333" }}>
                      {badge.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* AT A GLANCE */}
            <div>
              <SectionHeader title="at a glance" />
              <div className="space-y-2">
                {GLANCE_STATS.map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between text-[12px]">
                    <span style={{ color: "#555" }}>{label}</span>
                    <span className="font-semibold" style={{ color: ACCENT }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* DEVSCOIN */}
            <div>
              <SectionHeader title="devscoin" />
              <div
                className="px-4 py-4 rounded-sm"
                style={{ border: "1px solid #2d1b4e", backgroundColor: "#0f0b1a" }}
              >
                {/* Balance */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-bold" style={{ color: ACCENT }}>◈</span>
                  <div>
                    <p className="text-[10px]" style={{ color: "#444" }}>balance</p>
                    <p className="text-lg font-bold leading-tight" style={{ color: ACCENT }}>
                      {DEVSCOIN_BALANCE.toLocaleString()}
                      <span className="text-[11px] font-normal ml-1" style={{ color: "#555" }}>DC</span>
                    </p>
                  </div>
                </div>
                {/* Earned / Spent */}
                <div className="flex gap-3 mb-3">
                  {[
                    { label: "earned", value: `+${DEVSCOIN_TXN.filter(t => t.type === "earn").reduce((s, t) => s + t.amount, 0)}`, color: "#4ade80" },
                    { label: "spent",  value: `−${DEVSCOIN_TXN.filter(t => t.type === "spend").reduce((s, t) => s + t.amount, 0)}`, color: "#f87171" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex-1 px-2 py-1.5 rounded-sm text-center" style={{ backgroundColor: "#111", border: "1px solid #1a1a1a" }}>
                      <p className="text-[9px]" style={{ color: "#444" }}>{label}</p>
                      <p className="text-[12px] font-semibold" style={{ color }}>{value}</p>
                    </div>
                  ))}
                </div>
                {/* Last transactions */}
                <div className="space-y-1.5">
                  {DEVSCOIN_TXN.slice(0, 3).map((txn, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px]">
                      <span className="truncate mr-2" style={{ color: "#555" }}>{txn.reason}</span>
                      <span className="shrink-0 font-semibold tabular-nums" style={{ color: txn.type === "earn" ? "#4ade80" : "#f87171" }}>
                        {txn.type === "earn" ? "+" : "−"}{txn.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* FOR HIRING */}
            <div
              className="px-4 py-4 rounded-sm"
              style={{ border: `1px solid #2d1b4e`, backgroundColor: "#0f0b1a" }}
            >
              <p className="text-[11px] font-bold tracking-widest mb-2" style={{ color: ACCENT }}>
                // FOR HIRING
              </p>
              <p className="text-[11px] mb-4" style={{ color: "#555" }}>
                Every score is verified by DevsWebs. Capstones are agent-reviewed. Nothing on this profile is
                self-reported.
              </p>
              <button
                className="w-full text-[12px] py-2 rounded-sm transition-opacity hover:opacity-80"
                style={{ border: `1px solid ${ACCENT}`, color: ACCENT, backgroundColor: "transparent" }}
              >
                contact about hiring →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
