import React, { useEffect,  useState } from "react";
import DeleteAccount from "@/features/profile/components/DeleteAccount";
import { Toaster, toast } from "react-hot-toast";
import SideBar from "./components/SideBar";
import useProfileStore from "@/stores/useProfileStore";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useThemeStore from "@/stores/useThemeStore";
import ImageDropZone from "./components/ImageDropZone";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const Settings = () => {
  const { user, stats, isLoading, fetchProfile, updateStats } =
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
    bio: "",
    location: "",
    postsCount: 0,
    githubLink: "",
    linkedinLink: "",
    twitterLink: "",
  });
  const [originalData, setOriginalData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);

  useEffect(() => {
    if (!user && !stats) fetchProfile();
  }, []);

  useEffect(() => {
    if (!user || !stats) return;
    const userData = {
      fname: user.firstName || "",
      lname: user.lastName || "",
      bio: stats.bio || "",
      location: stats.location || "",
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
    try {
      const token = localStorage.getItem("JWT");
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== originalData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });
      if (profileImage) formDataToSend.append("profileImage", profileImage);

      if (bannerImage) formDataToSend.append("bannerImage", bannerImage);

      const request = await fetch(`${API_BASE_URL}/my-profile/settings`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });
      const response = await request.json();
      if (request.ok && response.stats && response.user) {
        const updatedData = {
          fname: response.user.firstName || "",
          lname: response.user.lastName || "",
          bio: response.stats.bio || "",
          location: response.stats.location || "",
          postsCount: response.stats.postsCount || 0,
          githubLink: response.stats.githubLink || "",
          linkedinLink: response.stats.linkedinLink || "",
          twitterLink: response.stats.twitterLink || "",
        };
        setFormData(updatedData);
        setOriginalData(updatedData);
        updateStats(response.stats);
        toast.success(response.message || "Changes saved successfully");

        setProfileImage(null);
        setBannerImage(null);
      } else {
        toast.error(response.message || "Failed to save changes");
      }
    } catch (err) {
      console.error("Error saving settings:", err);
    }
  };
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Toaster position="top-center" reverseOrder />
      <SideBar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <h1 className="mb-2 font-semibold text-xl text-gray-900 dark:text-gray-100 lg:text-2xl">
          Settings
        </h1>
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

          <div className="flex gap-6 max-w-3xl">
            {isLoading ? (
              <>
                <div className="flex-1"><Skeleton height={120} {...skeletonProps} /></div>
                <div className="flex-1"><Skeleton height={120} {...skeletonProps} /></div>
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
                  placeholder="e.g. UTC +4"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
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

          <button
            onClick={SaveChanges}
            className="w-full cursor-pointer rounded-lg bg-fuchsia-600 px-6 py-3 text-lg font-semibold text-white transition duration-300 hover:bg-fuchsia-700 dark:bg-fuchsia-500 dark:hover:bg-fuchsia-600 lg:w-full sm:w-fit"
          >
            Save Changes
          </button>
          <DeleteAccount />
        </div>
      </div>
    </div>
  );
};

export default Settings;
