import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import PageShell from "./components/PageShell";
import { SURFACE } from "@/components/ui/surface";
import ConnectionsSkeleton from "@/features/connections/components/ConnectionsSkeleton";
import { displayName, timeAgo } from "@/features/connections/lib/connections";
import defaultAvatar from "@/assets/user_profile/User_Profile.jpg";
import { getBlockedUserList, unblockUser } from "./chat/chatControlsApi";

const LINK_BUTTON =
  "mt-1 text-sm font-medium text-purple-300 underline hover:text-purple-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400";

function Notice({ title, body, action }) {
  return (
    <div className="flex flex-col items-start gap-2 px-5 py-10">
      <p className="text-base font-semibold text-neutral-100">{title}</p>
      {body && <p className="max-w-md text-sm text-neutral-400">{body}</p>}
      {action}
    </div>
  );
}

function BlockedRow({ user, pending, onUnblock }) {
  const name = displayName(user);
  const since = timeAgo(user.blockedAt);

  return (
    <li className="flex items-center gap-4 px-4 py-4 sm:px-5">
      <img
        src={user.profileImage || defaultAvatar}
        alt=""
        className="size-12 shrink-0 rounded-full bg-neutral-800 object-cover"
        loading="lazy"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link
            to={`/users/${user.username}`}
            className="truncate text-[15px] font-semibold text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
          >
            {name}
          </Link>
          <span className="truncate text-sm text-neutral-400">@{user.username}</span>
        </div>
        {since && <p className="mt-1 text-xs text-neutral-400">Blocked {since}</p>}
      </div>
      <button
        type="button"
        disabled={pending}
        onClick={() => onUnblock(user)}
        aria-label={`Unblock ${name}`}
        className="shrink-0 rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-neutral-200 transition-colors hover:border-white/30 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Unblocking…" : "Unblock"}
      </button>
    </li>
  );
}

export default function BlockedUsers() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState(null);
  const [pendingIds, setPendingIds] = useState(() => new Set());

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      setUsers(await getBlockedUserList());
      setStatus("ready");
    } catch (err) {
      setError(err);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Optimistic: the row leaves immediately and comes back (at its old
  // position) if the server says no, so the list never lies about the result.
  const handleUnblock = async (user) => {
    setPendingIds((prev) => new Set(prev).add(user._id));
    try {
      await unblockUser(user._id);
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
      toast.success(`Unblocked ${displayName(user)}`);
    } catch (err) {
      toast.error(err.message || "Couldn't unblock this user");
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(user._id);
        return next;
      });
    }
  };

  return (
    <PageShell
      title="Blocked users"
      subtitle="Blocked people can't message you, and you can't message them."
    >
      <section className={`${SURFACE} mt-6 overflow-hidden`}>
        {status === "loading" && <ConnectionsSkeleton rows={3} />}

        {status === "error" && (
          <div role="alert">
            <Notice
              title="Couldn't load blocked users"
              body={error?.message}
              action={
                <button type="button" onClick={load} className={LINK_BUTTON}>
                  Try again
                </button>
              }
            />
          </div>
        )}

        {status === "ready" && users.length === 0 && (
          <Notice
            title="You haven't blocked anyone"
            body="If you block someone from a chat, they'll show up here and you can unblock them any time."
          />
        )}

        {status === "ready" && users.length > 0 && (
          <ul className="divide-y divide-white/[0.06]">
            {users.map((user) => (
              <BlockedRow
                key={user._id}
                user={user}
                pending={pendingIds.has(user._id)}
                onUnblock={handleUnblock}
              />
            ))}
          </ul>
        )}
      </section>
    </PageShell>
  );
}
