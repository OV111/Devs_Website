import { API_BASE_URL, authHeaders } from "../../constants/api";

export const fetchComments = async (blogId) => {
  const res = await fetch(`${API_BASE_URL}/blogs/${blogId}/comments`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch comments");
  return data.comments ?? [];
};

export const postComment = async (blogId, text) => {
  const res = await fetch(`${API_BASE_URL}/blogs/${blogId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ text }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to post comment");
  return data.comment;
};

export const deleteComment = async (blogId, commentId) => {
  const res = await fetch(`${API_BASE_URL}/blogs/${blogId}/comments/${commentId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete comment");
  return data;
};
