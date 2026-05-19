import { useState, useEffect, useRef } from "react";
import { X, Send, Trash2, Loader2 } from "lucide-react";
import { fetchComments, postComment, deleteComment } from "../../services/commentsApi";
import useAuthStore from "../../stores/useAuthStore";
import useProfileStore from "../../stores/useProfileStore";
import toast from "react-hot-toast";

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
  const ref = useRef(null);
  const listRef = useRef(null);

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

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
      // keep text so user can retry
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
    <div
      ref={ref}
      className="absolute bottom-10 right-0 z-50 flex w-80 flex-col rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Comments
          {comments.length > 0 && (
            <span className="ml-1.5 rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-semibold text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
              {comments.length}
            </span>
          )}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-md p-0.5 text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Comment list */}
      <div
        ref={listRef}
        className="flex max-h-60 flex-col gap-3 overflow-y-auto px-4 py-3 scrollbar-thin"
      >
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
          </div>
        ) : error ? (
          <p className="py-4 text-center text-xs text-gray-400">{error}</p>
        ) : comments.length === 0 ? (
          <p className="py-4 text-center text-xs text-gray-400">
            No comments yet. Be the first!
          </p>
        ) : (
          comments.map((c) => {
            const authorName = `${c.author?.firstName ?? ""} ${c.author?.lastName ?? ""}`.trim() || "Anonymous";
            const initial = authorName.charAt(0).toUpperCase();
            const isOwn = user && (c.author?._id === user._id || c.author?._id === user.id);

            return (
              <div key={c._id} className="flex gap-2.5">
                {c.author?.pictures?.startsWith("http") ? (
                  <img
                    src={c.author.pictures}
                    alt={authorName}
                    className="h-7 w-7 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
                    {initial}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="truncate text-xs font-semibold text-gray-800 dark:text-gray-200">
                      {authorName}
                    </span>
                    <div className="flex shrink-0 items-center gap-1">
                      <span className="text-[10px] text-gray-400">
                        {timeAgo(c.createdAt)}
                      </span>
                      {isOwn && (
                        <button
                          type="button"
                          onClick={() => handleDelete(c._id)}
                          disabled={deletingId === c._id}
                          className="cursor-pointer rounded p-0.5 text-gray-300 transition hover:text-red-400 disabled:opacity-50 dark:text-gray-600"
                        >
                          {deletingId === c._id
                            ? <Loader2 className="h-3 w-3 animate-spin" />
                            : <Trash2 className="h-3 w-3" />
                          }
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                    {c.text}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-800">
        {auth ? (
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment..."
              maxLength={500}
              className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-800 outline-none placeholder:text-gray-400 focus:border-violet-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500 dark:focus:border-violet-500"
            />
            <button
              type="submit"
              disabled={!text.trim() || submitting}
              className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-violet-600 text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <Send className="h-3.5 w-3.5" />
              }
            </button>
          </form>
        ) : (
          <p className="text-center text-xs text-gray-400">
            Sign in to leave a comment
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentPopover;
