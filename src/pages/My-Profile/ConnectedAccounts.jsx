import { useState, useEffect } from "react";
import SideBar from "./components/SideBar";
import useProfileStore from "@/stores/useProfileStore";
import useThemeStore from "@/stores/useThemeStore";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import XIcon from "@mui/icons-material/X";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SOCIAL_FIELDS = [
  {
    key: "githubLink",
    label: "GitHub",
    icon: <FaGithub className="h-4 w-4" />,
    placeholder: "https://github.com/username",
  },
  {
    key: "linkedinLink",
    label: "LinkedIn",
    icon: <FaLinkedin className="h-4 w-4" />,
    placeholder: "https://linkedin.com/in/username",
  },
  {
    key: "twitterLink",
    label: "Twitter / X",
    icon: <XIcon sx={{ fontSize: 16 }} />,
    placeholder: "https://x.com/username",
  },
  {
    key: "mediumLink",
    label: "Medium",
    icon: <span className="text-xs font-bold leading-none">M</span>,
    placeholder: "https://medium.com/@username",
  },
];

const ConnectedAccounts = () => {
  const { user, stats, isLoading, fetchProfile, updateStats } =
    useProfileStore();
  const { theme } = useThemeStore();
  const isDarkMode = theme === "dark";

  const [links, setLinks] = useState({
    githubLink: "",
    linkedinLink: "",
    twitterLink: "",
    mediumLink: "",
  });
  const [saving, setSaving] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    if (!user && !stats) fetchProfile();
  }, []);

  useEffect(() => {
    if (!stats) return;
    setLinks({
      githubLink: stats.githubLink || "",
      linkedinLink: stats.linkedinLink || "",
      twitterLink: stats.twitterLink || "",
      mediumLink: stats.mediumLink || "",
    });
  }, [stats]);

  const saveLinks = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("JWT");
      const formData = new FormData();
      Object.entries(links).forEach(([k, v]) => formData.append(k, v));
      const res = await fetch(`${API_BASE_URL}/my-profile/settings`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        updateStats(data.stats);
        toast.success("Links saved");
      } else {
        toast.error(data.message || "Failed to save");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const connectGitHub = () => {
    const token = localStorage.getItem("JWT");
    window.location.href = `${API_BASE_URL}/auth/github/link?token=${token}`;
  };

  const disconnectGitHub = async () => {
    setDisconnecting(true);
    try {
      const token = localStorage.getItem("JWT");
      const res = await fetch(`${API_BASE_URL}/auth/github/disconnect`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        await fetchProfile();
        toast.success("GitHub disconnected");
      } else {
        toast.error("Failed to disconnect");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDisconnecting(false);
    }
  };

  const skeletonProps = {
    borderRadius: 8,
    baseColor: isDarkMode ? "#1f2937" : "#ebebeb",
    highlightColor: isDarkMode ? "#374151" : "#f5f5f5",
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <SideBar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 lg:text-2xl">
              Connected Accounts
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your linked social profiles and OAuth connections
            </p>
          </div>
          <button
            onClick={saveLinks}
            disabled={saving}
            className="rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-fuchsia-700 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>

        <div className="mt-8 grid gap-10 max-w-xl">
          {/* Social profile URLs */}
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Social Profiles
            </p>
            <div className="grid gap-3">
              {SOCIAL_FIELDS.map(({ key, label, icon, placeholder }) => (
                <div key={key} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400">
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                      {label}
                    </label>
                    {isLoading ? (
                      <Skeleton height={34} {...skeletonProps} />
                    ) : (
                      <input
                        type="url"
                        value={links[key]}
                        placeholder={placeholder}
                        onChange={(e) =>
                          setLinks((p) => ({ ...p, [key]: e.target.value }))
                        }
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-600"
                      />
                    )}
                  </div>
                  <div
                    className={`mt-5 h-2 w-2 shrink-0 rounded-full ${
                      links[key]
                        ? "bg-green-400"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* OAuth connections */}
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              OAuth
            </p>
            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center gap-3">
                <FaGithub className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    GitHub
                  </p>
                  {user?.githubId ? (
                    <p className="text-xs text-green-500">
                      Connected
                      {user?.githubLogin ? ` as @${user.githubLogin}` : ""}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Not connected
                    </p>
                  )}
                </div>
              </div>
              {user?.githubId ? (
                <button
                  onClick={disconnectGitHub}
                  disabled={disconnecting}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-800 dark:hover:bg-red-950/30"
                >
                  {disconnecting ? "…" : "Disconnect"}
                </button>
              ) : (
                <button
                  onClick={connectGitHub}
                  className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  Connect
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectedAccounts;
