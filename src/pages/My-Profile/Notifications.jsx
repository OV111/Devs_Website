import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, Trash2, UserPlus, MessageCircle, Heart, FileText } from "lucide-react";
import SideBar from "./components/SideBar";
import { getNotifications } from "@/services/notificationsApi";
import useNotificationStore from "@/stores/useNotificationStore";
import { FILTERS, TYPE_META, FILTER_TYPE_MAP } from "../../../constants/notifications";

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const FILTER_ICONS = {
  All: Bell,
  Unread: Bell,
  Follows: UserPlus,
  Messages: MessageCircle,
  Likes: Heart,
};

const Notifications = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  const { notifications, unreadCount, setNotifications } = useNotificationStore();

  const filtered = notifications.filter((n) => {
    if (activeFilter === "Unread") return !n.read;
    const mappedType = FILTER_TYPE_MAP[activeFilter];
    if (mappedType) return n.type === mappedType;
    return true;
  });

  const handleMarkRead = (id) => {
    setNotifications(notifications.map((n) => (n._id === id ? { ...n, read: true } : n)));
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

      <div className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Notifications
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "You're all caught up"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-violet-600 dark:text-violet-400 ring-1 ring-violet-200 dark:ring-violet-900/60 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors cursor-pointer"
            >
              <CheckCheck size={13} />
              Mark all read
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1.5 mb-6 overflow-x-auto pb-1">
          {FILTERS.map((f) => {
            const Icon = FILTER_ICONS[f];
            const isActive = activeFilter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                className={`flex items-center gap-1.5 shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-violet-600 text-white shadow-sm shadow-violet-500/30"
                    : "bg-gray-100 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                <Icon size={12} />
                {f}
                {f === "Unread" && unreadCount > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none ${
                    isActive ? "bg-white text-violet-600" : "bg-violet-600 text-white"
                  }`}>
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Notification list */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
          {loading ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4 px-5 py-4 animate-pulse">
                  <div className="shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800" />
                  <div className="flex-1 space-y-2.5 min-w-0 pt-1">
                    <div className="h-3 w-2/3 rounded-full bg-gray-200 dark:bg-gray-800" />
                    <div className="h-2.5 w-1/3 rounded-full bg-gray-200 dark:bg-gray-800" />
                  </div>
                  <div className="h-2.5 w-10 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0 mt-1" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <Bell size={26} className="text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {activeFilter === "Unread" ? "You're all caught up" : "No notifications yet"}
              </p>
              <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500 max-w-xs">
                {activeFilter === "Unread"
                  ? "All notifications have been read."
                  : "When someone follows you, likes your post, or messages you — it'll show up here."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800/60">
              {filtered.map((notif) => {
                const meta = TYPE_META[notif.type] ?? TYPE_META.follow;
                const Icon = meta.icon;
                return (
                  <div
                    key={notif._id}
                    onClick={() => handleNavigate(notif)}
                    className={`group relative flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                      !notif.read ? "bg-violet-50/50 dark:bg-violet-950/10" : ""
                    }`}
                  >
                    {/* Unread indicator bar */}
                    {!notif.read && (
                      <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full bg-violet-500" />
                    )}

                    {/* Icon */}
                    <div className={`shrink-0 flex items-center justify-center h-10 w-10 rounded-full ${meta.bg}`}>
                      <Icon size={16} className={meta.color} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-sm text-gray-800 dark:text-gray-100 leading-snug">
                        <span className="font-semibold">{notif.senderName}</span>{" "}
                        <span className="text-gray-500 dark:text-gray-400">{meta.label}</span>
                        {notif.meta?.postTitle && (
                          <>
                            {" — "}
                            <span className="font-medium text-gray-700 dark:text-gray-200 italic">
                              &ldquo;{notif.meta.postTitle}&rdquo;
                            </span>
                          </>
                        )}
                      </p>
                      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                        {timeAgo(notif.createdAt)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="shrink-0 flex items-center gap-1 pt-0.5">
                      {!notif.read && (
                        <span className="h-2 w-2 rounded-full bg-violet-500 mr-1 mt-1" />
                      )}
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        {!notif.read && (
                          <button
                            type="button"
                            title="Mark as read"
                            onClick={(e) => { e.stopPropagation(); handleMarkRead(notif._id); }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors"
                          >
                            <CheckCheck size={14} />
                          </button>
                        )}
                        <button
                          type="button"
                          title="Delete"
                          onClick={(e) => { e.stopPropagation(); handleDelete(notif._id); }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-600">
            {filtered.length} notification{filtered.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
