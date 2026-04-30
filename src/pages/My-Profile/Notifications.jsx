import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import SideBar from "./components/SideBar";
import { getNotifications } from "@/services/notificationsApi";
import useNotificationStore from "@/stores/useNotificationStore";
import {
  FILTERS,
  TYPE_META,
  FILTER_TYPE_MAP,
} from "../../../constants/notifications";

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const Notifications = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  const { notifications, unreadCount, setNotifications } =
    useNotificationStore();

  const filtered = notifications.filter((n) => {
    if (activeFilter === "Unread") return !n.read;
    const mappedType = FILTER_TYPE_MAP[activeFilter];
    if (mappedType) return n.type === mappedType;
    return true;
  });

  const handleMarkRead = (id) => {
    setNotifications(
      notifications.map((n) => (n._id === id ? { ...n, read: true } : n)),
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter((n) => n._id !== id));
  };

  const handleNavigate = (notif) => {
    handleMarkRead(notif._id);
    if (notif.type === "follow") navigate(`/users/${notif.senderUsername}`);
    else if (notif.type === "new_message") navigate(`/my-profile/chats`);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      const data = await getNotifications();
      if (data) setNotifications(data);
      setLoading(false);
    };
    fetchNotifications();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <SideBar />

      <div className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-1">
          <h1 className="font-bold text-2xl lg:text-3xl text-gray-900 dark:text-gray-100">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors cursor-pointer"
            >
              <CheckCheck size={14} />
              Mark all as read
            </button>
          )}
        </div>

        <p className="pb-6 text-sm lg:text-base text-gray-500 dark:text-gray-400">
          {unreadCount > 0
            ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
            : "You're all caught up"}
        </p>

        <div className="bg-white dark:bg-gray-900 w-full rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex flex-wrap items-center gap-1.5 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                className={`relative rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium cursor-pointer transition-all duration-200 ${
                  activeFilter === f
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-700 dark:hover:text-purple-300"
                }`}
              >
                {f}
                {f === "Unread" && unreadCount > 0 && (
                  <span
                    className={`px-1.5 rounded-full ml-1 ${activeFilter === "Unread" ? "bg-white text-purple-600" : "bg-purple-600 text-white"}`}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 px-4 py-4 animate-pulse"
                >
                  <div className="shrink-0 h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="h-3.5 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                  <div className="h-3 w-10 rounded bg-gray-200 dark:bg-gray-700 shrink-0" />
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                  <Bell
                    size={25}
                    className="text-gray-400 dark:text-gray-500"
                  />
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {activeFilter === "Unread"
                    ? "You're all caught up"
                    : "No notifications yet"}
                </p>
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  {activeFilter === "Unread"
                    ? "All notifications have been read."
                    : "When someone follows you, likes your post, or messages you — it'll show up here."}
                </p>
              </div>
            ) : (
              filtered.map((notif) => {
                const meta = TYPE_META[notif.type] ?? TYPE_META.follow;
                const Icon = meta.icon;
                return (
                  <div
                    key={notif._id}
                    onClick={() => handleNavigate(notif)}
                    className={`group flex items-start gap-3 px-4 py-4 cursor-pointer transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800/60 ${
                      !notif.read
                        ? "bg-purple-50/40 dark:bg-fuchsia-950/10"
                        : ""
                    }`}
                  >
                    <div
                      className={`shrink-0 flex items-center justify-center h-9 w-9 rounded-full ${meta.bg}`}
                    >
                      <Icon size={16} className={meta.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 dark:text-gray-100 leading-snug">
                        <span className="font-semibold">
                          {notif.senderName}
                        </span>{" "}
                        <span className="text-gray-500 dark:text-gray-400">
                          {meta.label}
                        </span>
                        {notif.meta?.postTitle && (
                          <>
                            {" — "}
                            <span className="font-medium text-gray-700 dark:text-gray-200 italic truncate">
                              "{notif.meta.postTitle}"
                            </span>
                          </>
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                        {timeAgo(notif.createdAt)}
                      </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      {!notif.read && (
                        <span className="h-2 w-2 rounded-full bg-purple-500 mt-1" />
                      )}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        {!notif.read && (
                          <button
                            type="button"
                            title="Mark as read"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkRead(notif._id);
                            }}
                            className="p-1 rounded-md text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors"
                          >
                            <CheckCheck size={14} />
                          </button>
                        )}
                        <button
                          type="button"
                          title="Delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notif._id);
                          }}
                          className="p-1 rounded-md text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
