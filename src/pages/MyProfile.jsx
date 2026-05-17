import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import XIcon from "@mui/icons-material/X";
import LoadingSuspense from "../components/feedback/LoadingSuspense";
import SideBar from "./My-Profile/components/SideBar";
import useProfileStore from "@/stores/useProfileStore";
import BlogCard from "@/components/blog/BlogCard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MyProfile = () => {
  const navigate = useNavigate();
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

  const [isSideBarOpened, setIsSideBarOpened] = useState(
    window.innerWidth >= 1024,
  );

  const isActive = async (userId) => {
    if (!userId) return;
    const now = new Date().toLocaleString();
    try {
      const request = await fetch(`${API_BASE_URL}/my-profile`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: userId, lastActive: now }),
      });
      if (request.ok) updateStats({ lastActive: now });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!user) {
      fetchProfile().then((result) => {
        if (result === "unauthorized") {
          localStorage.removeItem("JWT");
          navigate("/get-started");
        }
      });
    }
  }, []);

  useEffect(() => {
    if (!stats?.userId) return;
    isActive(stats.userId);
    fetchUserBlogs(stats.userId);
  }, [stats?.userId]);

  useEffect(() => {
    const handleResize = () => {
      window.innerWidth < 1024
        ? setIsSideBarOpened(false)
        : setIsSideBarOpened(true);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading) {
    return <LoadingSuspense />;
  }

  return (
    <div className="flex  bg-gray-50 dark:bg-gray-950">
      <SideBar
        isOpen={isSideBarOpened}
        onClose={() => setIsSideBarOpened(false)}
      />

      <div className="flex-1">
        <div className="relative">
          <img
            src={
              stats?.bannerImage?.replace(
                "/upload/",
                "/upload/w_1200,h_280,c_fill,f_auto,q_auto/",
              ) || "src/assets/user_profile/User_Banner.png"
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

        <div className="px-4 pt-16 sm:px-6 lg:px-10 lg:pt-20">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="space-y-1 max-w-2xl">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {user?.firstName} {user?.lastName}
              </h1>

              <p className="text-gray-700 dark:text-gray-300">
                {stats?.bio ||
                  "Tell others a bit about yourself - add a bio in settings."}
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last active:{" "}
                {stats?.lastActive
                  ? new Date(stats.lastActive).toLocaleString()
                  : "Active now"}
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
                    <p className="text-base text-gray-600 dark:text-gray-400 lg:text-sm">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-6 text-2xl text-gray-600 dark:text-gray-400">
                <Link
                  to={stats?.githubLink}
                  className="hover:text-black dark:hover:text-gray-100"
                >
                  <FaGithub />
                </Link>
                <Link
                  to={stats?.linkedinLink}
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <FaLinkedin />
                </Link>
                <Link
                  to={stats?.twitterLink}
                  className="hover:text-gray-900 dark:hover:text-gray-100"
                >
                  <XIcon />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isBlogsLoading ? (
              <div className="col-span-3 flex items-center justify-center py-20">
                <p className="text-sm text-gray-400">Loading posts...</p>
              </div>
            ) : blogs.length === 0 ? (
              <div className="col-span-3 flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 text-5xl">✍️</div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  No posts yet
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  You haven't published anything yet. Share your first post!
                </p>
                <Link
                  to="add-blog"
                  className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500"
                >
                  Write a post
                </Link>
              </div>
            ) : (
              blogs.map((blog) => (
                <BlogCard key={String(blog._id)} card={blog} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
