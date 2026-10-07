import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SOCIAL_LINKS from "../../constants/SocialLinks";
import LoadingSuspense from "../components/feedback/LoadingSuspense";
import SideBar from "./My-Profile/components/SideBar";
import useProfileStore from "@/stores/useProfileStore";
import useAuthStore from "@/stores/useAuthStore";
import BlogCard from "@/components/blog/BlogCard";
import { updateLastActive, saveSettings } from "@/services/profileApi";
import { Toaster, toast } from "react-hot-toast";
import { Pencil } from "lucide-react";
import { SectionHeader, ForHiringPanel } from "./My-Profile/components/ProfileSections";
import useProfileProgress from "@/features/profile/hooks/useProfileProgress";
import AchievementsPanel from "@/features/profile/components/AchievementsPanel";
import RecruiterSettings from "@/features/recruiter/components/RecruiterSettings";
import ResultsStrip from "@/features/profile/components/ResultsStrip";
import { formatLastActive, summarizeProfile } from "@/features/profile/lib/profileSummary";
import { deriveAchievements } from "@/features/profile/lib/achievements";
import {
  AsyncSection,
  CertificateCard,
  ChallengeStats,
  EmptyState,
  ExamRow,
  TrackRow,
} from "@/features/profile/components/ProfileProgress";
import { BlogCardSkeletonGrid } from "@/components/blog/BlogCardSkeleton";
import ProfileBanner from "@/features/profile/components/ProfileBanner";

const MyProfile = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const {
    user,
    stats,
    blogs,
    isLoading,
    isBlogsLoading,
    fetchProfile,
    updateStats,
    fetchUserBlogs,
  } = useProfileStore();

  const { tracks, challenges, certificates, exams, reload } =
    useProfileProgress();

  // Headline and counts come from data the page already loaded.
  const summary = useMemo(
    () => summarizeProfile({ tracks: tracks.data, certificates: certificates.data }),
    [tracks.data, certificates.data],
  );

  // Badges are derived from the same data the sections show.
  const achievementsLoading = [tracks, challenges, certificates, exams].some(
    (section) => section.status === "loading",
  );
  const achievements = useMemo(
    () =>
      deriveAchievements({
        exams: exams.data ?? [],
        challenges: challenges.data,
        tracks: tracks.data ?? [],
        certificates: certificates.data ?? [],
      }),
    [exams.data, challenges.data, tracks.data, certificates.data],
  );

  const [isSideBarOpened, setIsSideBarOpened] = useState(
    window.innerWidth >= 1024,
  );

  const isActive = async (userId) => {
    const now = await updateLastActive(userId);
    if (now) updateStats({ lastActive: now });
  };

  const handleCvUpload = async (file) => {
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append("cvFile", file);
      const result = await saveSettings(fd);
      if (result?.stats?.cvUrl) updateStats({ cvUrl: result.stats.cvUrl });
      toast.success("CV uploaded!");
    } catch {
      toast.error("Failed to upload CV");
    }
  };

  useEffect(() => {
    if (!user) {
      fetchProfile().then((result) => {
        if (result === "unauthorized") {
          logout();
          navigate("/get-started");
          return;
        }
        if (result?.userId) {
          isActive(result.userId);
          fetchUserBlogs(result.userId);
        }
      });
    } else {
      if (stats?.userId) {
        isActive(stats.userId);
        fetchUserBlogs(stats.userId);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleResize = () => {
      window.innerWidth < 1024
        ? setIsSideBarOpened(false)
        : setIsSideBarOpened(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading) return <LoadingSuspense />;

  return (
    <div className="flex">
      {/* Without a Toaster, the "CV uploaded" / failure toasts never appear. */}
      <Toaster position="top-center" />
      <SideBar
        isOpen={isSideBarOpened}
        onClose={() => setIsSideBarOpened(false)}
      />

      <div className="flex-1 min-w-0">
        {/* Banner */}
        <ProfileBanner url={stats?.bannerImage}>
          {stats?.bannerImage ? (
            // Banner already set — a quiet, hover-only edit affordance so it
            // doesn't compete with the photo.
            <Link
              to="settings"
              aria-label="Edit banner image"
              className="absolute top-3 right-3 z-2 flex items-center gap-1.5 rounded-lg max-md:after:absolute max-md:after:-inset-2 bg-black/50 px-2.5 py-1.5 text-xs font-medium text-white opacity-100 backdrop-blur-sm transition-opacity hover:bg-black/70 focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100"
            >
              <Pencil size={12} />
              Edit banner
            </Link>
          ) : (
            // Nothing set yet — the CTA stays visible so the empty state
            // itself invites the action instead of hiding it behind hover.
            <Link
              to="settings"
              className="absolute top-3 right-3 z-2 flex items-center gap-1.5 rounded-lg max-md:after:absolute max-md:after:-inset-2 bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-purple-500"
            >
              <Pencil size={12} />
              Add a banner
            </Link>
          )}

          <div className="absolute -bottom-10 sm:-bottom-13 lg:-bottom-14 left-14 sm:left-16 lg:left-10 -translate-x-1/2 lg:translate-x-0 z-1">
            <Link
              to="settings"
              aria-label="Edit profile photo"
              className="group/avatar relative block w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-3 border-white dark:border-gray-900 shadow-sm"
            >
              {stats?.profileImage ? (
                <img
                  src={stats.profileImage.replace(
                    "/upload/",
                    "/upload/w_112,h_112,c_fill,f_auto,q_auto/",
                  )}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-purple-100 dark:bg-purple-700 text-purple-700 dark:text-white text-2xl sm:text-3xl font-bold">
                  {user?.firstName?.[0]?.toUpperCase()}
                  {user?.lastName?.[0]?.toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover/avatar:opacity-100">
                <Pencil size={18} className="text-white" />
              </div>
            </Link>
          </div>
        </ProfileBanner>

        {/* Profile header */}
        <div className="px-4 pt-16 sm:px-6 lg:px-10 lg:pt-20">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="space-y-1 max-w-2xl">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {user?.firstName} {user?.lastName}
                </h1>
                {/* Visible on touch too — the banner/avatar pencils are hover-only. */}
                <Link
                  to="settings"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 text-sm font-medium text-gray-100 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-400"
                >
                  <Pencil size={14} />
                  Edit profile
                </Link>
              </div>
              {summary.headline && (
                <p className="text-sm font-semibold dark:text-purple-600">
                  {summary.headline}
                </p>
              )}
              <p className="text-gray-700 dark:text-gray-300">
                {stats?.bio ||
                  "Tell others a bit about yourself - add a bio in settings."}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last active: {formatLastActive(stats?.lastActive)}
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
                    <p className="text-base font-bold text-gray-900 dark:text-gray-100 lg:text-xl">
                      {item.value}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-6 text-2xl text-gray-600 dark:text-gray-400">
                {SOCIAL_LINKS.filter((item) => stats?.[item.key]).map((item) => (
                  <a
                    key={item.key}
                    href={stats[item.key]}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className={`relative transition after:absolute after:-inset-2.5 ${item.hover}`}
                  >
                    {item.icon}
                  </a>
                ))}
                {!SOCIAL_LINKS.some((item) => stats?.[item.key]) && (
                  <Link
                    to="settings"
                    className="text-sm text-gray-500 hover:text-gray-300"
                  >
                    Add your links
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content. Below xl: one column, hiring panel first. xl+: main + right column. */}
        <div className="flex flex-col gap-6 px-4 sm:px-6 lg:px-10 mt-6 pb-16 xl:flex-row">
          <aside className="order-first w-full shrink-0 xl:order-last xl:w-60">
            <SectionHeader title="For hiring" />
            <ForHiringPanel
              editable
              onCvUpload={handleCvUpload}
              cvUrl={stats?.cvUrl ?? null}
            />

            <SectionHeader title="Achievements" />
            <AchievementsPanel
              achievements={achievements}
              loading={achievementsLoading}
            />
          </aside>

          <div className="flex-1 min-w-0 space-y-8">
            {/* Same SectionHeader as "For hiring" in the right column, so both
                columns start on the same line (the header carries the top margin). */}
            <section>
              <SectionHeader title="Verified results" right="from graded work" />
              <ResultsStrip
                summary={summary}
                xp={challenges.data?.xpTotal}
                loading={tracks.status === "loading" || certificates.status === "loading"}
              />
            </section>

            {/* CAPSTONES */}
            <section>
              <SectionHeader title="Capstones" right="AI-reviewed" />
              <AsyncSection
                {...certificates}
                onRetry={() => reload("certificates")}
                isEmpty={!certificates.data?.length}
                empty={
                  <EmptyState
                    title="No approved capstone yet"
                    body="When the agent approves a capstone, it appears here with a link anyone can check."
                    to="/capstone"
                    cta="Go to your capstone"
                  />
                }
              >
                <div className="space-y-3">
                  {(certificates.data ?? []).map((c) => (
                    <CertificateCard key={c.publicId} cert={c} />
                  ))}
                </div>
              </AsyncSection>
            </section>

            {/* TRACKS */}
            <section>
              <SectionHeader title="Tracks" />
              <AsyncSection
                {...tracks}
                onRetry={() => reload("tracks")}
                isEmpty={!tracks.data?.length}
                empty={
                  <EmptyState
                    title="No tracks yet"
                    body="Capstones are being written for the roadmap tracks. Keep passing layer exams."
                    to="/roadmaps"
                    cta="Go to the roadmap"
                  />
                }
              >
                <div className="space-y-3">
                  {(tracks.data ?? []).map((t) => (
                    <TrackRow key={t.trackId} track={t} linkTo={`/capstone/${t.trackId}`} />
                  ))}
                </div>
              </AsyncSection>
            </section>

            {/* CODING CHALLENGES */}
            <section>
              <SectionHeader
                title="Coding challenges"
                right={
                  challenges.data ? (
                    <span className="font-semibold text-fuchsia-600">
                      {challenges.data.xpTotal} XP
                    </span>
                  ) : undefined
                }
              />
              <AsyncSection
                {...challenges}
                rows={1}
                onRetry={() => reload("challenges")}
                isEmpty={!challenges.data?.attempted}
                empty={
                  <EmptyState
                    title="No challenges attempted yet"
                    body="Solve coding challenges to build your streak and get ready for layer exams."
                    to="/coding-challenges"
                    cta="Browse challenges"
                  />
                }
              >
                {challenges.data && <ChallengeStats stats={challenges.data} />}
              </AsyncSection>
            </section>

            {/* EXAM HISTORY */}
            <section>
              <SectionHeader title="Exam history" />
              <AsyncSection
                {...exams}
                onRetry={() => reload("exams")}
                isEmpty={!exams.data?.length}
                empty={
                  <EmptyState
                    title="No exams taken yet"
                    body="Pass the exam at the end of each roadmap layer to unlock the next one."
                    to="/roadmaps"
                    cta="Go to the roadmap"
                  />
                }
              >
                <ul className="space-y-2">
                  {(exams.data ?? []).map((e) => (
                    <ExamRow key={String(e._id)} exam={e} />
                  ))}
                </ul>
              </AsyncSection>
            </section>

            {/* SHARE AND VISIBILITY */}
            <section>
              <SectionHeader title="Share and visibility" right="you choose" />
              <div className="space-y-3">
                <RecruiterSettings username={user?.username} />
                <Link
                  to="/team"
                  className="block rounded-xl border border-neutral-800 p-4 text-sm text-neutral-300 transition-colors hover:border-purple-500/50"
                >
                  Open your build team: your defense, peer ratings and merged work.
                </Link>
              </div>
            </section>

            {/* BLOGS */}
            <section>
              <SectionHeader title="Posts" />
              {isBlogsLoading || !stats?.userId ? (
                <BlogCardSkeletonGrid count={3} />
              ) : blogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 text-5xl">✍️</div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    No posts yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
                    You haven't published anything yet.
                  </p>
                  <Link
                    to="add-blog"
                    className="mt-5 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-purple-500"
                  >
                    Write a post
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogs.map((blog) => (
                    <BlogCard key={String(blog._id)} card={blog} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
