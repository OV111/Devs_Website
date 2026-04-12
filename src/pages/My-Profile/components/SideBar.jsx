import { sidebarArr } from "../../../../constants/Sidebars.jsx";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../../stores/useAuthStore.js";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useThemeStore from "../../../stores/useThemeStore.js";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { LogOut } from "lucide-react";
import useProfileStore from "@/stores/useProfileStore.js";
export default function SideBar({ isOpen, onClose }) {
  const { user, stats, isLoading, fetchProfile, updateStats } =
    useProfileStore();

  const { theme } = useThemeStore();
  const isDarkMode = theme === "dark";
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();
  const [openImage, setOpenImage] = useState(false);
  const fullName =
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Name Surname";
  const email = user?.email ?? "example@.com";
  const avatarSrc = stats?.profileImage ?? "";

  const handleLogOut = async () => {
    try {
      const request = await fetch(`${API_BASE_URL}/log-out`, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        credentials: "include", // sending cookie
      });
      let response = await request.json();
      if (request.ok) {
        localStorage.removeItem("JWT");
        toast.success(response.message, { duration: 1500 });
        logout();
        navigate("/get-started");
      } else {
        toast.error("Log Out Failed!");
        console.error("Log Out failed!");
      }
    } catch (err) {
      console.log(err);
      toast.error("Log Out Failed", { position: "top-center" });
    }
  };

  useEffect(() => {
    if (!user) fetchProfile();
  }, []);

  return (
    <>
      <aside className="flex min-h-screen w-10 flex-col overflow-hidden border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-800 dark:bg-gray-950 lg:w-56 lg:static lg:sticky  lg:top-0">
        <div className="border-b border-gray-100 py-3 px-0 dark:border-gray-800 lg:px-3">
          <div className="flex items-center justify-center gap-3 mx-auto">
            <button
              onClick={() => {
                if (avatarSrc) setOpenImage(true);
              }}
              className={isLoading ? "cursor-default" : "cursor-pointer"}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="lg:mx-0 mx-auto w-8 h-8 rounded-full bg-gray-200 animate-pulse dark:bg-gray-700" />
              ) : avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt="Profile"
                  className="lg:mx-0 mx-auto w-8 h-8 object-cover rounded-full"
                />
              ) : (
                <div className="lg:mx-0 mx-auto w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-700 flex items-center justify-center text-xs font-bold text-purple-700 dark:text-white">
                  {user?.firstName?.[0]?.toUpperCase()}
                  {user?.lastName?.[0]?.toUpperCase()}
                </div>
              )}
            </button>
            <div className="hidden lg:block min-w-0 overflow-hidden">
              {isLoading ? (
                <div className="space-y-1">
                  <Skeleton
                    width={172}
                    height={16}
                    borderRadius={8}
                    baseColor={isDarkMode ? "#1f2937" : "#ebebeb"}
                    highlightColor={isDarkMode ? "#374151" : "#f5f5f5"}
                  />
                  <Skeleton
                    width={172}
                    height={14}
                    borderRadius={8}
                    baseColor={isDarkMode ? "#1f2937" : "#ebebeb"}
                    highlightColor={isDarkMode ? "#374151" : "#f5f5f5"}
                  />
                </div>
              ) : (
                <>
                  <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-100">
                    {fullName}
                  </p>
                  <p className="truncate text-xs font-medium text-gray-500 dark:text-gray-400">
                    {email}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        {openImage && (
          <div
            className="fixed inset-0 z-5 flex items-center justify-center bg-black/70 p-4"
            onClick={() => setOpenImage(false)}
          >
            <img
              src={avatarSrc}
              alt="Profile"
              className="max-w-[70vw] max-h-[70vh] rounded-2xl transition duration-200 scale-100"
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
          </div>
        )}

        <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto px-0 mt-2 lg:mt-0 gap-3 lg:gap-0 py-0 lg:px-2 lg:py-2">
          {sidebarArr.map((group) => (
            <div
              key={group.section}
              className="grid text-lg py-0 lg:pt-2 gap-3 lg:gap-1"
            >
              <p className="hidden px-2 py-0 text-[9px] uppercase tracking-wider text-gray-400 font-semibold dark:text-gray-400 lg:block lg:py-0.5">
                {group.section}
              </p>

              {group.items.map((item) => (
                <NavLink
                  key={`${item.to}-${item.label}`}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    (() => {
                      const isAliasActive = item.activePaths?.includes(
                        location.pathname,
                      );
                      const active = isActive || isAliasActive;
                      return `flex w-10 items-center justify-center gap-0 rounded-none py-0 px-0 text-gray-700 transition-colors lg:hover:bg-purple-100 dark:text-gray-100 lg:dark:hover:bg-fuchsia-950/30  lg:mx-auto lg:w-full lg:justify-start lg:gap-2 lg:rounded-lg lg:py-2 lg:px-3 ${
                        active
                          ? "lg:bg-purple-50 text-purple-600 lg:dark:bg-fuchsia-950/30 dark:text-purple-600 "
                          : ""
                      }`;
                    })()
                  }
                >
                  <p className="flex items-center">{item.icon}</p>
                  <p className="hidden text-[14px] lg:block">{item.label}</p>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div
          onClick={() => {
            handleLogOut();
          }}
          className="group mt-auto flex cursor-pointer items-center justify-center border-t border-gray-100 py-3.5 text-gray-700 transition-colors hover:bg-red-50 hover:text-red-600 dark:border-gray-800 dark:text-gray-100 dark:hover:bg-red-950/40 dark:hover:text-red-400 lg:justify-between lg:px-4"
        >
          <p className="hidden text-[16px] font-medium lg:block">Logout</p>
          <LogOut size={16} />
        </div>
      </aside>
    </>
  );
}
