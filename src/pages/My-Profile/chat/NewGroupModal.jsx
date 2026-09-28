import { useMemo, useState } from "react";
import { X, Check } from "lucide-react";
import { createGroupChat } from "./groupChatApi";

const NewGroupModal = ({ mutualFollowers, onClose, onCreated }) => {
  const [name, setName] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const toggleMember = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const canSubmit = useMemo(
    () => name.trim().length > 0 && selectedIds.size >= 2 && !isSubmitting,
    [name, selectedIds, isSubmitting],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    setError("");
    try {
      const { room } = await createGroupChat(name.trim(), [...selectedIds]);
      onCreated(room);
      onClose();
    } catch (err) {
      setError(err.message || "Could not create group");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            New group
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Group name"
            className="w-full rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-fuchsia-400 dark:border-gray-700 dark:text-gray-100"
          />

          <div className="max-h-56 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700">
            {mutualFollowers.length === 0 ? (
              <p className="px-3 py-4 text-center text-xs text-gray-400">
                No mutual followers to add yet.
              </p>
            ) : (
              mutualFollowers.map((user) => {
                const isSelected = selectedIds.has(user._id);
                return (
                  <button
                    type="button"
                    key={user._id}
                    onClick={() => toggleMember(user._id)}
                    className="flex w-full cursor-pointer items-center gap-3 border-b border-gray-100 px-3 py-2 text-left last:border-b-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/60"
                  >
                    <img
                      src={user.stats?.profileImage}
                      alt=""
                      className="h-7 w-7 shrink-0 rounded-full bg-purple-100 object-cover"
                    />
                    <span className="min-w-0 flex-1 truncate text-sm text-gray-800 dark:text-gray-100">
                      {user.firstName} {user.lastName}
                    </span>
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        isSelected
                          ? "border-fuchsia-500 bg-fuchsia-500 text-white"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {isSelected && <Check size={12} />}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <p className="text-[11px] text-gray-400">
            {selectedIds.size} selected · at least 2 members required
          </p>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full cursor-pointer rounded-xl bg-fuchsia-600 py-2 text-sm font-medium text-white transition-colors hover:bg-fuchsia-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSubmitting ? "Creating..." : "Create group"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewGroupModal;
