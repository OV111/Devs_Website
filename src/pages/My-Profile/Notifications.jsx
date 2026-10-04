import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import PageShell from "./components/PageShell";
import { SURFACE } from "@/components/ui/surface";
import { timeAgo } from "@/features/connections/lib/connections";
import toast from "react-hot-toast";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "@/services/notificationsApi";
import useNotificationStore from "@/stores/useNotificationStore";
import {
  FILTERS,
  TYPE_META,
  FILTER_TYPE_MAP,
} from "../../../constants/notifications";

const DAY = 24 * 60 * 60 * 1000;

/** Today / This week / Earlier — a long flat list is hard to scan. */
const groupOf = (createdAt, now = Date.now()) => {
  const age = now - new Date(createdAt).getTime();
  if (age < DAY) return "Today";
  if (age < 7 * DAY) return "This week";
  return "Earlier";
};
const GROUP_ORDER = ["Today", "This week", "Earlier"];

/** Where a notification leads, if anywhere. */
const hrefFor = (n) => {
  if (n.type === "follow" && n.senderUsername)
    return `/users/${n.senderUsername}`;
  if (n.type === "new_message") return "/my-profile/chats";
  return null;
};

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-purple-400";

function NotificationRow({ notif, onRead, onDelete }) {
  const meta = TYPE_META[notif.type] ?? TYPE_META.follow;
  const Icon = meta.icon;
  const href = hrefFor(notif);

  const body = (
    <>
      <span
        className={`grid size-10 shrink-0 place-items-center rounded-full ${meta.bg}`}
      >
        <Icon size={17} className={meta.color} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] leading-snug text-neutral-200">
          <span className="font-semibold text-white">{notif.senderName}</span>{" "}
          {meta.label}
          {notif.meta?.postTitle && (
            <span className="text-neutral-300">
              {" "}
              — “{notif.meta.postTitle}”
            </span>
          )}
        </span>
        <span className="mt-1 block text-xs text-neutral-500">
          {timeAgo(notif.createdAt)}
          {!notif.read && <span className="sr-only"> · unread</span>}
        </span>
      </span>
    </>
  );
  const bodyClass = `flex min-w-0 flex-1 items-start gap-4 py-4 pl-5 text-left ${FOCUS}`;
  const click = () => !notif.read && onRead(notif._id);

  return (
    <li
      className={`group relative flex items-center gap-1 pr-3 transition-colors hover:bg-white/[0.025] ${
        notif.read ? "" : "bg-purple-500/[0.05]"
      }`}
    >
      {!notif.read && (
        <span
          aria-hidden="true"
          className="absolute inset-y-4 left-0 w-0.5 rounded-full bg-purple-400"
        />
      )}

      {href ? (
        <Link to={href} onClick={click} className={bodyClass}>
          {body}
        </Link>
      ) : (
        <button type="button" onClick={click} className={bodyClass}>
          {body}
        </button>
      )}

      {!notif.read && (
        <span
          aria-hidden="true"
          className="size-2 shrink-0 rounded-full bg-purple-400"
        />
      )}

      {/* Always visible on touch screens; revealed on hover/focus from sm up. */}
      <span className="flex shrink-0 items-center sm:opacity-0 sm:transition-opacity sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
        {!notif.read && (
          <button
            type="button"
            onClick={() => onRead(notif._id)}
            aria-label={`Mark ${notif.senderName}'s notification as read`}
            className={`rounded-lg p-2 text-neutral-400 hover:bg-white/[0.06] hover:text-purple-300 ${FOCUS}`}
          >
            <CheckCheck size={16} aria-hidden="true" />
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(notif._id)}
          aria-label={`Delete ${notif.senderName}'s notification`}
          className={`rounded-lg p-2 text-neutral-400 hover:bg-red-500/10 hover:text-red-300 ${FOCUS}`}
        >
          <Trash2 size={16} aria-hidden="true" />
        </button>
      </span>
    </li>
  );
}

function RowsSkeleton() {
  return (
    <SkeletonTheme baseColor="#171717" highlightColor="#262626">
      <ul
        role="status"
        aria-busy="true"
        aria-label="Loading notifications"
        className="divide-y divide-white/[0.06]"
      >
        {Array.from({ length: 5 }, (_, i) => (
          <li key={i} className="flex items-center gap-4 px-5 py-4">
            <Skeleton circle width={40} height={40} />
            <div className="min-w-0 flex-1">
              <Skeleton width="55%" height={15} />
              <Skeleton width="20%" height={12} className="mt-2" />
            </div>
          </li>
        ))}
      </ul>
    </SkeletonTheme>
  );
}

function Notice({ title, body, action }) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-white/[0.05] text-neutral-400">
        <Bell size={22} aria-hidden="true" />
      </span>
      <p className="mt-4 text-base font-semibold text-neutral-100">{title}</p>
      {body && (
        <p className="mt-1.5 max-w-sm text-sm text-neutral-400">{body}</p>
      )}
      {action}
    </div>
  );
}

const Notifications = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"
  const { notifications, unreadCount, setNotifications } =
    useNotificationStore();

  const load = useCallback(async () => {
    setStatus("loading");
    const data = await getNotifications();
    // The api returns null/undefined when the request fails — that is an error,
    // not an empty inbox.
    if (!Array.isArray(data)) return setStatus("error");
    setNotifications(data);
    setStatus("ready");
  }, [setNotifications]);

  useEffect(() => {
    load();
  }, [load]);

  // Optimistic: update the screen now, persist in the background. On failure,
  // reload from the server rather than restoring a snapshot — a notification
  // pushed over the socket meanwhile would otherwise be lost.
  const persist = async (optimistic, request, failure) => {
    setNotifications(optimistic(notifications));
    try {
      await request();
    } catch {
      toast.error(failure);
      load();
    }
  };

  const markRead = (id) =>
    persist(
      (list) => list.map((n) => (n._id === id ? { ...n, read: true } : n)),
      () => markNotificationRead(id),
      "Couldn't mark that as read. Try again.",
    );
  const markAllRead = () =>
    persist(
      (list) => list.map((n) => ({ ...n, read: true })),
      markAllNotificationsRead,
      "Couldn't mark everything as read. Try again.",
    );
  const remove = (id) =>
    persist(
      (list) => list.filter((n) => n._id !== id),
      () => deleteNotification(id),
      "Couldn't delete that notification. Try again.",
    );

  const filtered = useMemo(
    () =>
      notifications.filter((n) => {
        if (activeFilter === "Unread") return !n.read;
        const type = FILTER_TYPE_MAP[activeFilter];
        return type ? n.type === type : true;
      }),
    [notifications, activeFilter],
  );

  const groups = useMemo(() => {
    const now = Date.now();
    const by = new Map(GROUP_ORDER.map((g) => [g, []]));
    filtered.forEach((n) => by.get(groupOf(n.createdAt, now)).push(n));
    return GROUP_ORDER.map((g) => [g, by.get(g)]).filter(
      ([, rows]) => rows.length > 0,
    );
  }, [filtered]);

  return (
    <PageShell
      title="Notifications"
      subtitle={
        unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"
      }
      actions={
        unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className={`inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-neutral-100 transition-colors hover:border-purple-400/50 hover:text-white ${FOCUS}`}
          >
            <CheckCheck size={16} aria-hidden="true" />
            Mark all read
          </button>
        )
      }
    >
      <div
        role="group"
        aria-label="Filter"
        className="mt-6 flex flex-wrap gap-2"
      >
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={f === activeFilter}
            onClick={() => setActiveFilter(f)}
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
              f === activeFilter
                ? "border-purple-400 bg-purple-500/15 text-purple-100"
                : "border-white/10 text-neutral-300 hover:border-white/25 hover:text-white"
            }`}
          >
            {f}
            {f === "Unread" && unreadCount > 0 && (
              <span className="rounded-full bg-purple-600 px-1.5 py-0.5 font-mono text-xs leading-none text-white">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <section className={`${SURFACE} mt-5 overflow-hidden`}>
        {status === "loading" && <RowsSkeleton />}

        {status === "error" && (
          <div role="alert">
            <Notice
              title="Couldn't load your notifications"
              body="Check your connection and try again."
              action={
                <button
                  type="button"
                  onClick={load}
                  className={`mt-4 rounded-lg bg-purple-600 px-5 py-2 text-sm font-semibold text-white hover:bg-purple-500 ${FOCUS}`}
                >
                  Try again
                </button>
              }
            />
          </div>
        )}

        {status === "ready" && filtered.length === 0 && (
          <Notice
            title={
              activeFilter === "Unread"
                ? "You're all caught up"
                : "Nothing here yet"
            }
            body={
              activeFilter === "All"
                ? "When someone follows you or messages you, it shows up here."
                : "No notifications match this filter."
            }
          />
        )}

        {status === "ready" &&
          groups.map(([group, rows]) => (
            <div
              key={group}
              className="border-t border-white/[0.06] first:border-t-0"
            >
              <h2 className="bg-white/[0.02] px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
                {group}
              </h2>
              <ul className="divide-y divide-white/[0.06]">
                {rows.map((n) => (
                  <NotificationRow
                    key={n._id}
                    notif={n}
                    onRead={markRead}
                    onDelete={remove}
                  />
                ))}
              </ul>
            </div>
          ))}
      </section>
    </PageShell>
  );
};

export default Notifications;
