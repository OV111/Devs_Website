import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Pencil, Trash2, Send, Eye, FileText } from "lucide-react";
import SideBar from "./components/SideBar";
import { fetchMyBlogs, deleteBlog, updateBlog } from "../../services/blogsApi.js";

const STATUS_COLORS = {
  published: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  draft: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

const DIFF_COLORS = {
  Beginner: "text-emerald-600 dark:text-emerald-400",
  Intermediate: "text-yellow-600 dark:text-yellow-400",
  Advanced: "text-red-500 dark:text-red-400",
};

function fmt(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [publishingId, setPublishingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    try {
      setIsLoading(true);
      const data = await fetchMyBlogs();
      setBlogs(data);
    } catch {
      toast.error("Failed to load your blogs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await deleteBlog(id);
      setBlogs((prev) => prev.filter((b) => b._id.toString() !== id));
      toast.success("Blog deleted");
    } catch {
      toast.error("Failed to delete blog");
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const handlePublish = async (blog) => {
    const newStatus = blog.status === "published" ? "draft" : "published";
    try {
      setPublishingId(blog._id);
      const formData = new FormData();
      formData.append("status", newStatus);
      await updateBlog(blog._id.toString(), formData);
      setBlogs((prev) =>
        prev.map((b) =>
          b._id.toString() === blog._id.toString() ? { ...b, status: newStatus } : b
        )
      );
      toast.success(newStatus === "published" ? "Blog published!" : "Moved to drafts");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setPublishingId(null);
    }
  };

  const published = blogs.filter((b) => b.status === "published");
  const drafts = blogs.filter((b) => b.status === "draft");

  return (
    <div className="flex min-h-screen">
      <SideBar />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-gray-50 px-6 py-1.5 dark:border-gray-800 dark:bg-gray-950">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 lg:text-2xl">
              My Blogs
            </h1>
            <p className="text-xs text-gray-400">
              {published.length} published · {drafts.length} draft{drafts.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => navigate("/my-profile/add-blog")}
            className="flex items-center gap-1.5 rounded-lg bg-fuchsia-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-fuchsia-700 cursor-pointer"
          >
            <Pencil className="h-3.5 w-3.5" />
            New Post
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-fuchsia-500 border-t-transparent" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
              <FileText size={40} className="text-gray-300 dark:text-gray-700" />
              <p className="text-gray-500 dark:text-gray-400">
                You haven't written any blogs yet.
              </p>
              <button
                onClick={() => navigate("/my-profile/add-blog")}
                className="rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white hover:bg-fuchsia-700 cursor-pointer"
              >
                Write your first post
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:items-start sm:gap-4"
                >
                  {/* Cover thumbnail */}
                  {blog.coverImage ? (
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="h-20 w-full rounded-lg object-cover sm:h-16 sm:w-24 sm:shrink-0"
                    />
                  ) : (
                    <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                      <FileText size={20} className="text-gray-400" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_COLORS[blog.status] ?? STATUS_COLORS.draft}`}
                      >
                        {blog.status}
                      </span>
                      {blog.difficulty && (
                        <span className={`text-xs font-medium ${DIFF_COLORS[blog.difficulty] ?? ""}`}>
                          {blog.difficulty}
                        </span>
                      )}
                      {blog.category && (
                        <span className="text-xs text-gray-400">{blog.category}</span>
                      )}
                    </div>
                    <p className="truncate font-medium text-gray-900 dark:text-gray-100">
                      {blog.title}
                    </p>
                    <p className="flex gap-3 text-[11px] text-gray-400">
                      <span>{blog.readTime} min read · {blog.wordCount ?? 0} words</span>
                      <span>{blog.views ?? 0} views</span>
                      <span>{fmt(blog.createdAt)}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => navigate(`/my-profile/edit-blog/${blog._id}`)}
                      title="Edit"
                      className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 cursor-pointer"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>

                    <button
                      onClick={() => handlePublish(blog)}
                      disabled={publishingId === blog._id}
                      title={blog.status === "published" ? "Move to draft" : "Publish"}
                      className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition disabled:opacity-50 cursor-pointer ${
                        blog.status === "published"
                          ? "border-yellow-200 text-yellow-600 hover:bg-yellow-50 dark:border-yellow-800 dark:text-yellow-400 dark:hover:bg-yellow-900/20"
                          : "border-green-200 text-green-600 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20"
                      }`}
                    >
                      {blog.status === "published" ? (
                        <><Eye className="h-3.5 w-3.5" />Unpublish</>
                      ) : (
                        <><Send className="h-3.5 w-3.5" />Publish</>
                      )}
                    </button>

                    <button
                      onClick={() => setConfirmDelete(blog._id)}
                      disabled={deletingId === blog._id}
                      title="Delete"
                      className="flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs text-red-500 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-2 text-base font-semibold text-gray-900 dark:text-gray-100">
              Delete blog?
            </h2>
            <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
              This action cannot be undone. The post will be permanently removed.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deletingId === confirmDelete}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50 cursor-pointer"
              >
                {deletingId === confirmDelete ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
