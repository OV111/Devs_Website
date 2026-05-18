import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sortOptions, filterOptions } from "../../../constants/FollowersPage";
import SideBar from "./components/SideBar";
import FollowersCard from "./FollowersCard";
import {
  fetchFollowers as fetchFollowersApi,
  fetchFollowing as fetchFollowingApi,
  toggleFollow,
} from "@/services/followersApi";

const PAGE_LIMIT = 2; // 20 for ui is normal

const Followers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sortBy, setSortBy] = useState("Most Relevant");
  const [activeFilter, setActiveFilter] = useState("All");
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [followersPage, setFollowerPage] = useState(1);
  const [followingPage, setFollowingPage] = useState(1);
  const [followersHasMore, setFollowersHasMore] = useState(true);
  const [followingHasMore, setFollowingHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const followersView = location.pathname.endsWith("/following");

  const fetchFollowers = useCallback(async () => {
    try {
      const response = await fetchFollowersApi(followersPage, PAGE_LIMIT);
      if (followersPage === 1) {
        setFollowers(response.followers ?? []);
      } else {
        setFollowers((prev) => [...prev, ...(response.followers ?? [])]);
      }
      setFollowersCount(response.followersCount ?? 0);
      setFollowingCount(response.followingCount ?? 0);
      setFollowersHasMore(Boolean(response.hasMore));
    } catch (err) {
      console.error("followers fetch error", err);
    } finally {
      setLoadingMore(false);
      setInitialLoading(false);
    }
  }, [followersPage]);

  const fetchFollowing = useCallback(async () => {
    try {
      const response = await fetchFollowingApi(followingPage, PAGE_LIMIT);
      if (followingPage === 1) {
        setFollowings(response.following ?? []);
      } else {
        setFollowings((prev) => [...prev, ...(response.following ?? [])]);
      }
      setFollowersCount(response.followersCount ?? 0);
      setFollowingCount(response.followingCount ?? 0);
      setFollowingHasMore(Boolean(response.hasMore));
    } catch (err) {
      console.error("following fetch error", err);
    } finally {
      setLoadingMore(false);
      setInitialLoading(false);
    }
  }, [followingPage]);

  useEffect(() => {
    if (followersView) {
      fetchFollowing();
    } else {
      fetchFollowers();
      fetchFollowing();
    }
  }, [followersView, fetchFollowers, fetchFollowing]);

  useEffect(() => {
    setFollowerPage(1);
    setFollowingPage(1);
    setFollowersHasMore(true);
    setFollowingHasMore(true);
    setLoadingMore(false);
    setInitialLoading(true);
  }, [followersView]);

  const handleFollowToggle = async (user, isFollowing) => {
    if (!user?.username) return;

    try {
      setActionLoadingId(user._id ?? user.id ?? user.username);
      const res = await toggleFollow(user.username, isFollowing);
      if (!res.ok) return;
      if (isFollowing) {
        setFollowings((prev) =>
          prev.filter(
            (item) =>
              (item._id ?? item.id ?? item.username) !==
              (user._id ?? user.id ?? user.username),
          ),
        );
        setFollowingCount((prev) => Math.max(prev - 1, 0));
      } else {
        setFollowings((prev) => {
          const exists = prev.some(
            (item) =>
              (item._id ?? item.id ?? item.username) ===
              (user._id ?? user.id ?? user.username),
          );
          if (exists) return prev;
          return [...prev, user];
        });
        setFollowingCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("follow toggle error", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const usersList = followersView ? followings : followers;
  const followingUsernames = useMemo(
    () => new Set(followings.map((user) => String(user?.username ?? ""))),
    [followings],
  );

  const sortedList = useMemo(() => {
    if (sortBy === "Newest") {
      return [...usersList].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    } else if (sortBy === "Oldest") {
      return [...usersList].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );
    }
    return usersList;
  }, [usersList, sortBy]);

  const filteredList = useMemo(() => {
    if (activeFilter === "Mutuals") {
      return sortedList.filter((user) =>
        followingUsernames.has(String(user?.username ?? "")),
      );
    }
    return sortedList;
  }, [sortedList, activeFilter, followingUsernames]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <SideBar />

      <div className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-8">
        <h1 className="mb-1 font-bold text-2xl lg:text-3xl text-gray-900 dark:text-gray-100">
          {followersView ? "Following" : "Followers"}
        </h1>

        <p className="pb-6 text-sm lg:text-base text-gray-500 dark:text-gray-400 max-w-xl">
          {followersView ? "People you are following" : "People who follow you"}
        </p>

        <div className="bg-white dark:bg-gray-900 w-full rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex flex-wrap justify-between items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate("/my-profile/followers")}
                className={`rounded-lg px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium cursor-pointer transition-all duration-200 ${
                  !followersView
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-700 dark:hover:text-purple-300"
                }`}
              >
                Followers ({followersCount})
              </button>
              <button
                type="button"
                onClick={() => navigate("/my-profile/following")}
                className={`rounded-lg px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium cursor-pointer transition-all duration-200 ${
                  followersView
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-700 dark:hover:text-purple-300"
                }`}
              >
                Following ({followingCount})
              </button>
            </div>

            <ul className="flex flex-wrap items-center gap-1 sm:gap-2 text-sm">
              <li className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                Sort:
              </li>
              {sortOptions.map((option) => (
                <li key={option}>
                  <button
                    type="button"
                    onClick={() => setSortBy(option)}
                    className={`cursor-pointer rounded-md px-2 sm:px-3 py-1 text-xs font-medium transition-all duration-200 ${
                      sortBy === option
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-700 dark:hover:text-purple-300"
                    }`}
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <ul className="flex flex-wrap gap-1 sm:gap-2">
              {filterOptions.map((option) => {
                const Icon = option.icon;
                const isActive = activeFilter === option.content;

                return (
                  <li key={option.content}>
                    <button
                      type="button"
                      onClick={() => setActiveFilter(option.content)}
                      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-700 dark:hover:text-purple-300"
                      }`}
                    >
                      <Icon fontSize="small" />
                      <span>{option.content}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="px-4 py-3 space-y-3">
            {initialLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-800/50 p-4 animate-pulse"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 lg:h-14 lg:w-14 rounded-full bg-gray-200 dark:bg-gray-700" />
                        <div className="space-y-2">
                          <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                          <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
                        </div>
                      </div>
                      <div className="h-8 w-20 rounded-lg bg-gray-200 dark:bg-gray-700" />
                    </div>
                    <div className="mt-3 h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50 flex flex-col gap-2 sm:flex-row sm:justify-between">
                      <div className="h-3 w-full sm:w-40 rounded bg-gray-200 dark:bg-gray-700" />
                      <div className="h-3 w-full sm:w-36 rounded bg-gray-200 dark:bg-gray-700" />
                    </div>
                  </div>
                ))
              : filteredList.map((user) => (
                  <FollowersCard
                    key={user._id ?? user.id}
                    user={user}
                    isFollowing={followingUsernames.has(
                      String(user?.username ?? ""),
                    )}
                    actionLoading={
                      actionLoadingId === (user._id ?? user.id ?? user.username)
                    }
                    onToggleFollow={handleFollowToggle}
                  />
                ))}
          </div>

          <div className="px-4 pb-4">
            {(followersView ? followingHasMore : followersHasMore) && (
              <button
                type="button"
                disabled={loadingMore}
                onClick={() => {
                  setLoadingMore(true);
                  if (followersView) {
                    setFollowingPage((prev) => prev + 1);
                  } else {
                    setFollowerPage((prev) => prev + 1);
                  }
                }}
                className={`w-full rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  loadingMore
                    ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                    : "cursor-pointer bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                {loadingMore ? "Loading..." : "Load more"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Followers;
