import React, { useEffect, useRef, useState } from "react";
import DeleteAccount from "@/features/profile/components/DeleteAccount";
import { Toaster, toast } from "react-hot-toast";
import SideBar from "./components/SideBar";
import useProfileStore from "@/stores/useProfileStore";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useThemeStore from "@/stores/useThemeStore";
import ImageDropZone from "./components/ImageDropZone";
import { saveSettings, checkUsernameAvailable } from "@/services/profileApi";
import { Loader2, Check, X } from "lucide-react";

const Settings = () => {
  const { user, stats, isLoading, fetchProfile, updateStats, updateUser } =
    useProfileStore();
  const { theme } = useThemeStore();
  const isDarkMode = theme === "dark";
  const skeletonProps = {
    borderRadius: 8,
    baseColor: isDarkMode ? "#1f2937" : "#ebebeb",
    highlightColor: isDarkMode ? "#374151" : "#f5f5f5",
  };
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    username: "",
    bio: "",
    location: "",
    timezone: "",
    postsCount: 0,
    githubLink: "",
    linkedinLink: "",
    twitterLink: "",
  });
  const [originalData, setOriginalData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);

  // idle | checking | available | taken | invalid
  const [usernameStatus, setUsernameStatus] = useState("idle");
  const usernameCheckTimeout = useRef(null);

  useEffect(() => {
    const uname = formData.username;

    // Nothing typed, or it's still the user's current username — no need
    // to hit the server just to confirm they own their own name.
    if (!uname || uname === originalData.username) {
      setUsernameStatus("idle");
      return;
    }
    if (uname.length < 3) {
      setUsernameStatus("invalid");
      return;
    }

    setUsernameStatus("checking");
    clearTimeout(usernameCheckTimeout.current);
    usernameCheckTimeout.current = setTimeout(async () => {
      try {
        const { available } = await checkUsernameAvailable(uname);
        setUsernameStatus(available ? "available" : "taken");
      } catch {
        setUsernameStatus("idle");
      }
    }, 400);

    return () => clearTimeout(usernameCheckTimeout.current);
  }, [formData.username, originalData.username]);

  useEffect(() => {
    if (!user && !stats) fetchProfile();
  }, []);

  useEffect(() => {
    if (!user || !stats) return;
    const userData = {
      fname: user.firstName || "",
      lname: user.lastName || "",
      username: user.username || "",
      bio: stats.bio || "",
      location: stats.location || "",
      timezone: stats.timezone || "",
      postsCount: stats.postsCount || 0,
      githubLink: stats.githubLink || "",
      linkedinLink: stats.linkedinLink || "",
      twitterLink: stats.twitterLink || "",
      mediumLink: stats.mediumLink || "",
    };
    setFormData(userData);
    setOriginalData(userData);
  }, [user, stats]);

  const SaveChanges = async () => {
    if (usernameStatus === "taken" || usernameStatus === "invalid") {
      toast.error("Please choose an available username");
      return;
    }
    if (usernameStatus === "checking") {
      toast.error("Still checking that username, one sec");
      return;
    }
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== originalData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });
      if (profileImage) formDataToSend.append("profileImage", profileImage);
      if (bannerImage) formDataToSend.append("bannerImage", bannerImage);

      const response = await saveSettings(formDataToSend);

      const updatedData = {
        fname: response.user.firstName || "",
        lname: response.user.lastName || "",
        username: response.user.username || "",
        bio: response.stats.bio || "",
        location: response.stats.location || "",
        timezone: response.stats.timezone || "",
        postsCount: response.stats.postsCount || 0,
        githubLink: response.stats.githubLink || "",
        linkedinLink: response.stats.linkedinLink || "",
        twitterLink: response.stats.twitterLink || "",
        mediumLink: response.stats.mediumLink || "",
      };
      setFormData(updatedData);
      setOriginalData(updatedData);
      updateUser(response.user);
      updateStats(response.stats);
      toast.success(response.message || "Changes saved successfully");
      setProfileImage(null);
      setBannerImage(null);
    } catch (err) {
      toast.error(err.message || "Failed to save changes");
    }
  };
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex min-h-screen">
      <Toaster position="top-center" reverseOrder />
      <SideBar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center lg:gap-50">
          <h1 className="mb-2 font-semibold text-xl text-gray-900 dark:text-gray-100 lg:text-2xl">
            Settings
          </h1>

          <button
            onClick={SaveChanges}
            className="flex items-center gap-1.5 rounded-lg bg-fuchsia-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-fuchsia-700 disabled:opacity-50 cursor-pointer"
          >
            Save Changes
          </button>
        </div>
        <p className="max-w-xl pb-8 text-sm text-gray-700 dark:text-gray-300 lg:text-lg">
          Manage your account settings and preferences
        </p>

        <div className="grid gap-8" id="general">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-20">
            <div className="grid gap-2 w-full lg:max-w-[400px]">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              {isLoading ? (
                <Skeleton height={38} {...skeletonProps} />
              ) : (
                <input
                  type="text"
                  value={formData.fname}
                  placeholder="Full Name"
                  className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 outline-none placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
                  onChange={(e) => handleChange("fname", e.target.value)}
                />
              )}
            </div>
            <div className="grid gap-2 w-full lg:max-w-[400px]">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Name
              </label>
              {isLoading ? (
                <Skeleton height={38} {...skeletonProps} />
              ) : (
                <input
                  type="text"
                  value={formData.lname}
                  placeholder="Last Name"
                  className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 outline-none placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
                  onChange={(e) => handleChange("lname", e.target.value)}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-20">
            <div className="grid gap-2 w-full lg:max-w-[400px]">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              {isLoading ? (
                <Skeleton height={38} {...skeletonProps} />
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    value={formData.username}
                    placeholder="username"
                    maxLength={16}
                    className={`w-full rounded-lg border bg-white p-2 pr-9 text-gray-900 outline-none placeholder:text-gray-400 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 ${
                      usernameStatus === "taken" || usernameStatus === "invalid"
                        ? "border-red-400 dark:border-red-500"
                        : usernameStatus === "available"
                          ? "border-green-400 dark:border-green-500"
                          : "border-gray-300 dark:border-gray-700"
                    }`}
                    onChange={(e) =>
                      handleChange(
                        "username",
                        // Mirrors the backend's sanitizeUsername so a user
                        // never types a character the server will reject.
                        e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""),
                      )
                    }
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {usernameStatus === "checking" && (
                      <Loader2
                        size={16}
                        className="animate-spin text-gray-400"
                      />
                    )}
                    {usernameStatus === "available" && (
                      <Check size={16} className="text-green-500" />
                    )}
                    {(usernameStatus === "taken" ||
                      usernameStatus === "invalid") && (
                      <X size={16} className="text-red-500" />
                    )}
                  </span>
                </div>
              )}
              {usernameStatus === "taken" ? (
                <p className="text-xs text-red-500">
                  That username is already taken.
                </p>
              ) : usernameStatus === "invalid" ? (
                <p className="text-xs text-red-500">
                  Username must be at least 3 characters.
                </p>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Lowercase letters and numbers only, 3–16 characters. This is
                  your public profile link.
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-6 max-w-[880px]">
            {isLoading ? (
              <>
                <div className="flex-1">
                  <Skeleton height={120} {...skeletonProps} />
                </div>
                <div className="flex-1">
                  <Skeleton height={120} {...skeletonProps} />
                </div>
              </>
            ) : (
              <>
                <ImageDropZone
                  label="Profile Image"
                  image={profileImage}
                  currentUrl={stats?.profileImage}
                  onImageChange={setProfileImage}
                />
                <ImageDropZone
                  label="Banner Image"
                  image={bannerImage}
                  currentUrl={stats?.bannerImage}
                  onImageChange={setBannerImage}
                />
              </>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-20">
            <div className="grid gap-2 w-full lg:max-w-[400px]">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Bio
              </label>
              {isLoading ? (
                <Skeleton height={38} {...skeletonProps} />
              ) : (
                <input
                  type="text"
                  value={formData.bio}
                  placeholder="Tell others a bit about yourself and what you're passionate about..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
                  onChange={(e) => handleChange("bio", e.target.value)}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-20">
            <div className="grid gap-2 w-full lg:max-w-[400px]">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Time Zone
              </label>
              {isLoading ? (
                <Skeleton height={38} {...skeletonProps} />
              ) : (
                <input
                  type="text"
                  value={formData.timezone}
                  placeholder="e.g. UTC +4"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
                  onChange={(e) => handleChange("timezone", e.target.value)}
                />
              )}
            </div>
            <div className="grid gap-2 w-full lg:max-w-[400px]">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Location
              </label>
              {isLoading ? (
                <Skeleton height={38} {...skeletonProps} />
              ) : (
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  placeholder="City, Country"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
                  onChange={(e) => handleChange("location", e.target.value)}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-20">
            <div className="grid gap-2 w-full lg:max-w-[400px]">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Github
              </label>
              {isLoading ? (
                <Skeleton height={38} {...skeletonProps} />
              ) : (
                <input
                  type="text"
                  value={formData.githubLink}
                  placeholder="Enter URL"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
                  onChange={(e) => handleChange("githubLink", e.target.value)}
                />
              )}
            </div>
            <div className="grid gap-2 w-full lg:max-w-[400px]">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Linkedin
              </label>
              {isLoading ? (
                <Skeleton height={38} {...skeletonProps} />
              ) : (
                <input
                  type="text"
                  value={formData.linkedinLink}
                  placeholder="Enter URL"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
                  onChange={(e) => handleChange("linkedinLink", e.target.value)}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-20">
            <div className="grid gap-2 w-full lg:max-w-[400px]">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Twitter
              </label>
              {isLoading ? (
                <Skeleton height={38} {...skeletonProps} />
              ) : (
                <input
                  type="text"
                  value={formData.twitterLink}
                  placeholder="Enter URL"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
                  onChange={(e) => handleChange("twitterLink", e.target.value)}
                />
              )}
            </div>
          </div>

          <DeleteAccount />
       <button
            onClick={SaveChanges}
            className="flex items-center gap-1.5 rounded-lg bg-fuchsia-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-fuchsia-700 disabled:opacity-50 cursor-pointer"
            >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
