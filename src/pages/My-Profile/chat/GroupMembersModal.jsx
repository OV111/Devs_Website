import { useEffect, useMemo, useState } from "react";
import { X, Shield, ShieldOff, UserMinus, UserPlus, LogOut } from "lucide-react";
import {
  getGroupChatDetails,
  addGroupMember,
  removeGroupMember,
  setGroupMemberAdmin,
  leaveGroupChat,
} from "./groupChatApi";

const GroupMembersModal = ({
  roomId,
  currentUserId,
  mutualFollowers,
  onClose,
  onLeft,
}) => {
  const [group, setGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddingOpen, setIsAddingOpen] = useState(false);
  const [busyMemberId, setBusyMemberId] = useState(null);

  const refresh = async () => {
    setIsLoading(true);
    try {
      const { group: data } = await getGroupChatDetails(roomId);
      setGroup(data);
    } catch (err) {
      setError(err.message || "Failed to load group");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const isSelfAdmin = group?.admins?.includes(String(currentUserId));

  const addableFollowers = useMemo(() => {
    if (!group) return [];
    const memberSet = new Set(group.members);
    return mutualFollowers.filter((u) => !memberSet.has(String(u._id)));
  }, [group, mutualFollowers]);

  const runAction = async (memberId, action) => {
    setBusyMemberId(memberId);
    setError("");
    try {
      await action();
      await refresh();
    } catch (err) {
      setError(err.message || "Action failed");
    } finally {
      setBusyMemberId(null);
    }
  };

  const handleLeave = async () => {
    setBusyMemberId(currentUserId);
    try {
      await leaveGroupChat(roomId);
      onLeft();
      onClose();
    } catch (err) {
      setError(err.message || "Could not leave group");
      setBusyMemberId(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-2xl border border-gray-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:max-w-sm sm:rounded-2xl sm:pb-4 dark:border-gray-700 dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {group?.name || "Group members"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <X size={18} />
          </button>
        </div>

        {isLoading ? (
          <p className="py-8 text-center text-sm text-gray-400">Loading...</p>
        ) : (
          <>
            {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

            <div className="mt-3 max-h-64 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700">
              {group?.memberDetails?.map((member) => {
                const memberId = String(member._id);
                const isOwner = memberId === group.createdBy;
                const isMemberAdmin = group.admins.includes(memberId);
                const isBusy = busyMemberId === memberId;

                return (
                  <div
                    key={memberId}
                    className="flex items-center gap-3 border-b border-gray-100 px-3 py-2 last:border-b-0 dark:border-gray-800"
                  >
                    <img
                      src={member.stats?.profileImage}
                      alt=""
                      className="h-7 w-7 shrink-0 rounded-full bg-purple-100 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-gray-800 dark:text-gray-100">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {isOwner ? "Owner" : isMemberAdmin ? "Admin" : "Member"}
                      </p>
                    </div>

                    {isSelfAdmin && memberId !== String(currentUserId) && !isOwner && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={isBusy}
                          title={isMemberAdmin ? "Demote" : "Make admin"}
                          onClick={() =>
                            runAction(memberId, () =>
                              setGroupMemberAdmin(roomId, memberId, !isMemberAdmin),
                            )
                          }
                          className="cursor-pointer rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-40 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                        >
                          {isMemberAdmin ? <ShieldOff size={14} /> : <Shield size={14} />}
                        </button>
                        <button
                          type="button"
                          disabled={isBusy}
                          title="Remove from group"
                          onClick={() =>
                            runAction(memberId, () => removeGroupMember(roomId, memberId))
                          }
                          className="cursor-pointer rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40 dark:hover:bg-red-950/30"
                        >
                          <UserMinus size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {isSelfAdmin && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setIsAddingOpen((prev) => !prev)}
                  className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-fuchsia-600 hover:text-fuchsia-700"
                >
                  <UserPlus size={14} />
                  Add member
                </button>

                {isAddingOpen && (
                  <div className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700">
                    {addableFollowers.length === 0 ? (
                      <p className="px-3 py-3 text-center text-xs text-gray-400">
                        Everyone you can add is already in this group.
                      </p>
                    ) : (
                      addableFollowers.map((user) => (
                        <button
                          type="button"
                          key={user._id}
                          disabled={busyMemberId === user._id}
                          onClick={() =>
                            runAction(user._id, () => addGroupMember(roomId, user._id))
                          }
                          className="flex w-full cursor-pointer items-center gap-3 border-b border-gray-100 px-3 py-2 text-left last:border-b-0 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-800 dark:hover:bg-gray-800/60"
                        >
                          <img
                            src={user.stats?.profileImage}
                            alt=""
                            className="h-6 w-6 shrink-0 rounded-full bg-purple-100 object-cover"
                          />
                          <span className="truncate text-sm text-gray-800 dark:text-gray-100">
                            {user.firstName} {user.lastName}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={handleLeave}
              disabled={busyMemberId === currentUserId}
              className="mt-4 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-red-200 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-40 dark:border-red-900/50 dark:hover:bg-red-950/30"
            >
              <LogOut size={14} />
              Leave group
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GroupMembersModal;
