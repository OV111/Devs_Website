import { useState, useEffect, useRef } from "react";
import { Send, Trash2, Loader2 } from "lucide-react";
import { fetchComments, postComment, deleteComment } from "../../services/commentsApi";
import useAuthStore from "../../stores/useAuthStore";
import useProfileStore from "../../stores/useProfileStore";
import toast from "react-hot-toast";
import Popover from "./Popover";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const CommentPopover = ({ blogId, onClose, onCountChange }) => {
  const { auth } = useAuthStore();
  const { user } = useProfileStore();
  const listRef = useRef(null);

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComments(blogId)
      .then(setComments)
      .catch(() => setError("Could not load comments."))
      .finally(() => setLoading(false));
  }, [blogId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    try {
      const newComment = await postComment(blogId, trimmed);
      setComments((prev) => {
        const updated = [newComment, ...prev];
        onCountChange?.(updated.length);
        return updated;
      });
      setText("");
      setTimeout(() => {
        listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      }, 50);
    } catch {
      // Keep the text so the user can retry, but say that it failed.
      toast.error("Couldn't post your comment. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    setDeletingId(commentId);
    try {
      await deleteComment(blogId, commentId);
      setComments((prev) => {
        const updated = prev.filter((c) => c._id !== commentId);
        onCountChange?.(updated.length);
        return updated;
      });
    } catch {
      toast.error("Failed to delete comment");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Popover title="Comments" badge={comments.length} onClose={onClose} className="w-80">
      <div ref={listRef} className="flex max-h-60 flex-col gap-3 overflow-y-auto px-4 py-3">
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
          </div>
        ) : error ? (
          <p className="py-4 text-center text-xs text-neutral-500">{error}</p>
        ) : comments.length === 0 ? (
          <p className="py-4 text-center text-xs text-neutral-500">No comments yet. Be the first!</p>
        ) : (
          comments.map((c) => {
            const authorName =
              `${c.author?.firstName ?? ""} ${c.author?.lastName ?? ""}`.trim() || "Anonymous";
            const initial = authorName.charAt(0).toUpperCase();
            const isOwn = user && (c.author?._id === user._id || c.author?._id === user.id);

            return (
              <div key={c._id} className="group/comment flex gap-2.5">
                {c.author?.pictures?.startsWith("http") ? (
                  <img src={c.author.pictures} alt="" className="h-7 w-7 shrink-0 rounded-full object-cover" />
                ) : (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[10px] font-semibold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                    {initial}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="truncate text-xs font-medium text-neutral-800 dark:text-neutral-200">
                      {authorName}
                    </span>
                    <div className="flex shrink-0 items-center gap-1">
                      <span className="text-[10px] text-neutral-500">{timeAgo(c.createdAt)}</span>
                      {isOwn && (
                        <button
                          type="button"
                          onClick={() => handleDelete(c._id)}
                          disabled={deletingId === c._id}
                          aria-label="Delete comment"
                          className="cursor-pointer rounded p-0.5 text-neutral-400 opacity-0 transition group-hover/comment:opacity-100 hover:text-red-400 focus-visible:opacity-100 disabled:opacity-50"
                        >
                          {deletingId === c._id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed break-words text-neutral-600 dark:text-neutral-400">
                    {c.text}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="border-t border-neutral-100 px-4 py-3 dark:border-neutral-800">
        {auth ? (
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment…"
              aria-label="Write a comment"
              maxLength={500}
              className="min-w-0 flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:placeholder:text-neutral-600 dark:focus:border-neutral-600"
            />
            <button
              type="submit"
              disabled={!text.trim() || submitting}
              aria-label="Post comment"
              className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-neutral-900 text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            </button>
          </form>
        ) : (
          <p className="text-center text-xs text-neutral-500">Sign in to leave a comment</p>
        )}
      </div>
    </Popover>
  );
};

export default CommentPopover;
