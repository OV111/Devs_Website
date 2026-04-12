import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import XIcon from "@mui/icons-material/X";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function UserProfile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollower, setIsFollower] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const request = await fetch(`${API_BASE_URL}/users/${username}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("JWT")}`,
          },
        });
        const response = await request.json();
        console.log(response);
        if (!request.ok) {
          setUser(null);
          setStats({});
          return;
        }

        setUser(response.targetUser ?? null);
        setStats(response.stats ?? {});
        setIsFollowing(Boolean(response.isFollowing));
      } catch (error) {
        console.log(error);
        setUser(null);
        setStats({});
        setIsFollowing(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        const request = await fetch(
          `${API_BASE_URL}/users/${username}/follow`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("JWT")}`,
            },
          },
        );

        if (request.ok) {
          setIsFollowing(false);
          setStats((prev) => ({
            ...prev,
            followersCount: Math.max((prev?.followersCount ?? 0) - 1, 0),
          }));
          toast("Unfollowed!");
        }
      } else {
        const request = await fetch(
          `${API_BASE_URL}/users/${username}/follow`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("JWT")}`,
            },
          },
        );

        if (request.ok) {
          setIsFollowing(true);
          setStats((prev) => ({
            ...prev,
            followersCount: (prev?.followersCount ?? 0) + 1,
          }));
          toast("Followed!");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-800">Loading...</div>;
  }

  if (!user) {
    return <div className="p-6 text-gray-800">User not found.</div>;
  }

  const socialLinks = [
    {
      key: "github",
      href: stats?.githubLink,
      icon: <FaGithub />,
      hover: "hover:text-black",
    },
    {
      key: "linkedin",
      href: stats?.linkedinLink,
      icon: <FaLinkedin />,
      hover: "hover:text-blue-700",
    },
    {
      key: "x",
      href: stats?.twitterLink,
      icon: <XIcon fontSize="inherit" />,
      hover: "hover:text-gray-900",
    },
  ].filter((item) => !!item.href);

  const statItems = [
    { label: "Followers", value: stats?.followersCount ?? 0 },
    { label: "Following", value: stats?.followingCount ?? 0 },
    { label: "Posts", value: stats?.postsCount ?? 0 },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 text-gray-900">
      <Toaster position="top-center" reverseOrder />
      <main className="flex-1">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <img
            src={
              stats?.bannerImage?.replace("/upload/", "/upload/w_1200,h_280,c_fill,f_auto,q_auto/") ||
              "src/assets/user_profile/User_Banner.png"
            }
            alt="Banner"
            className="w-full h-40 sm:h-56 object-cover"
          />

          {/* Avatar */}
          <div className="absolute -bottom-10 sm:-bottom-12 lg:-bottom-14 left-1/2 lg:left-10 -translate-x-1/2 lg:translate-x-0">
            <img
              src={
                stats?.profileImage ||
                "src/assets/user_profile/User_Profile.jpg"
              }
              alt="User"
              className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full object-cover border-4 border-white shadow-md"
            />
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-14 sm:pt-16 lg:pt-20 px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-8">
            {/* User Info */}
            <div className="space-y-1 max-w-2xl text-center lg:text-left">
              <h1 className="text-2xl font-bold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h1>

              <p className="text-gray-700 leading-relaxed">
                {stats?.bio ||
                  "Tell others a bit about yourself — add a bio in settings."}
              </p>

              <p className="text-sm text-gray-500">
                Last active:{" "}
                {stats?.lastActive
                  ? new Date(stats.lastActive).toLocaleString()
                  : "Active now"}
              </p>
            </div>

            {/* Stats & Social */}
            <div className="flex flex-col items-center lg:items-end gap-4 lg:gap-6">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleFollowToggle}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                    isFollowing
                      ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>

                <Link
                  to={`/messages/${username}`}
                  className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                >
                  Message
                </Link>
              </div>

              <div className="flex gap-6 sm:gap-8">
                {statItems.map((item) => (
                  <div key={item.label} className="text-center">
                    <p className="text-lg sm:text-xl font-bold">
                      {item.value}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              {socialLinks.length > 0 && (
                <div className="flex items-center gap-5 text-2xl text-gray-600">
                  {socialLinks.map((item) => (
                    <a
                      key={item.key}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`${item.hover} transition`}
                    >
                      {item.icon}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Posts */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-40 bg-gray-300 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
