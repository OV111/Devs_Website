import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaRegBookmark, FaBookmark, FaRegComment, FaRegHeart, FaHeart } from "react-icons/fa6";
import { FiShare } from "react-icons/fi";
import SharePopover from "./SharePopover";
import CommentPopover from "./CommentPopover";
import toast from "react-hot-toast";
import useAuthStore from "../../stores/useAuthStore";
import useBlogInteractionsStore from "../../stores/useBlogInteractionsStore";
import { API_BASE_URL, authHeaders } from "../../../constants/api";

import fs1React    from "../../assets/blog-pics/fs1React.jpg";
import buildingApi from "../../assets/blog-pics/BuildingRestApi.png";
import nodeMongo   from "../../assets/blog-pics/nodejsmongodb.png";
import authStrat   from "../../assets/blog-pics/AuthStrategiesBack.png";
import caching     from "../../assets/blog-pics/caching.png";
import scalable    from "../../assets/blog-pics/scalabledesign.png";

import JohnDoe     from "../../assets/postsProfiles/JohnDoe.png";
import AdaByte     from "../../assets/postsProfiles/AdaByte.png";
import DmitryPetrov from "../../assets/postsProfiles/DmitryPetrov.png";
import AliceKeyes  from "../../assets/postsProfiles/AliceKeyes.png";
import WilliamChen from "../../assets/postsProfiles/WilliamChen.png";
import GraceHopper from "../../assets/postsProfiles/GraceHopper.png";

const blogImgMap = {
  "fs1React.jpg":          fs1React,
  "BuildingRestApi.png":   buildingApi,
  "nodejsmongodb.png":     nodeMongo,
  "AuthStrategiesBack.png":authStrat,
  "caching.png":           caching,
  "scalabledesign.png":    scalable,
};

const pictureMap = {
  "JohnDoe.png":     JohnDoe,
  "AdaByte.png":     AdaByte,
  "DmitryPetrov.png": DmitryPetrov,
  "AliceKeyes.png":  AliceKeyes,
  "WilliamChen.png": WilliamChen,
  "GraceHopper.png": GraceHopper,
};

const resolveAsset = (url, map) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return map[url.split("/").pop()] ?? null;
};

const normalizePost = (post) => {
  const isDefault = post.isDefault === true;

  const rawId = isDefault ? post.id : String(post._id);
  const prefixedId = `${isDefault ? "sys" : "blog"}_${rawId}`;

  const readTime =
    typeof post.readTime === "number"
      ? `${post.readTime} min`
      : (post.readTime ?? "1 min");

  const authorObj =
    post.author && typeof post.author === "object" ? post.author : {};

  const firstName = authorObj.firstName ?? post.firstName ?? null;
  const lastName = authorObj.lastName ?? post.lastName ?? null;
  const userName = authorObj.userName ?? post.userName ?? post.username ?? null;
  const pictures = authorObj.pictures ?? post.pictures ?? null;
  return {
    id: prefixedId,
    rawId,
    isDefault,
    title: post.title ?? "Untitled",
    description: post.description ?? post.content ?? "",
    image: post.image ?? post.coverImage ?? "",
    pictures,
    tags: Array.isArray(post.tags)
      ? post.tags
      : typeof post.tags === "string"
        ? post.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    readTime,
    createdAt: post.createdAt ? new Date(post.createdAt) : new Date(),
    firstName,
    lastName,
    userName,
    author: post.author ?? null,
    slug: post.slug ?? null,
  };
};

const BlogCard = ({ card }) => {
  const { auth } = useAuthStore();
  const { savedIds, likedIds, toggleSaved, toggleLiked } = useBlogInteractionsStore();

  const post = normalizePost(card);

  const resolvedPicture = resolveAsset(post.pictures, pictureMap);
  const resolvedCover   = resolveAsset(post.image, blogImgMap);
  const authorName = `${post.firstName ?? ""} ${post.lastName ?? ""}`.trim() || "Unknown";
  const userName = post.userName ?? "";
  const authorInitial = authorName.charAt(0).toUpperCase();

  const liked = likedIds.has(post.rawId);
  const saved = savedIds.has(post.rawId);
  const initialLikes = Array.isArray(card.likes) ? card.likes.length : 0;
  const initialComments = Array.isArray(card.comments) ? card.comments.length : 0;
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [commentsCount, setCommentsCount] = useState(initialComments);
  const [likeLoading, setLikeLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const closeShare = useCallback(() => setShareOpen(false), []);
  const closeComment = useCallback(() => setCommentOpen(false), []);

  const handleLike = async () => {
    if (!auth || post.isDefault || likeLoading) return;
    const wasLiked = liked;
    toggleLiked(post.rawId);
    setLikesCount((prev) => (wasLiked ? prev - 1 : prev + 1));
    setLikeLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/blogs/${post.rawId}/like`, {
        method: "POST",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!data.success) throw new Error();
      setLikesCount(data.likesCount);
    } catch {
      toggleLiked(post.rawId);
      setLikesCount((prev) => (wasLiked ? prev + 1 : prev - 1));
      toast.error("Failed to like post");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleSave = async () => {
    if (!auth || post.isDefault || saveLoading) return;
    toggleSaved(post.rawId);
    setSaveLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/blogs/${post.rawId}/favourite`, {
        method: "POST",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!data.success) throw new Error();
    } catch {
      toggleSaved(post.rawId);
      toast.error("Failed to save post");
    } finally {
      setSaveLoading(false);
    }
  };

  const tags = post.tags.slice(0, 2);
  const date = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const canInteract = auth && !post.isDefault;
  const iconBtn = (active, activeClass) =>
    `relative z-10 flex items-center gap-1 rounded-full p-1.5 transition-colors ${
      canInteract ? "cursor-pointer" : "cursor-not-allowed opacity-60"
    } ${active ? activeClass : "hover:text-neutral-900 dark:hover:text-white"}`;

  return (
    // The whole card opens the post: the title link stretches over it
    // (after:absolute after:inset-0), and the action buttons sit above that
    // layer with z-10 so they stay clickable on their own.
    <article className="group relative flex h-full min-h-[478px] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700">
      <div className="relative h-56 shrink-0 overflow-hidden bg-neutral-100 dark:bg-neutral-900">
        {resolvedCover && (
          <img
            src={resolvedCover}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={!canInteract || saveLoading}
          aria-label={saved ? "Remove from saved" : "Save post"}
          aria-pressed={saved}
          className={`absolute top-3 right-3 z-10 rounded-full bg-black/60 p-2 backdrop-blur-sm transition-colors ${
            saved ? "text-purple-400" : "text-white hover:text-purple-300"
          } ${canInteract ? "cursor-pointer" : "cursor-not-allowed"}`}
        >
          {saved ? <FaBookmark size={13} /> : <FaRegBookmark size={13} />}
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-5">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <h3 className="line-clamp-2 text-lg leading-snug font-medium text-neutral-900 transition-colors group-hover:text-purple-500 dark:text-neutral-100">
          <Link
            to={`/posts/${post.id}`}
            state={{
              post: {
                ...post,
                _displayName: authorName,
                _displayUserName: userName,
                _displayPicture: auth ? (post.pictures ?? null) : null,
              },
            }}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {post.title}
          </Link>
        </h3>

        {post.description && (
          <p className="line-clamp-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
            {post.description}
          </p>
        )}

        {/* Explicit cue that the card opens the post. Not a separate link:
            the stretched title link already covers the card, so this is
            visual only (aria-hidden) and the arrow nudges on hover. */}
        <span
          aria-hidden="true"
          className="mt-auto flex items-center gap-1 pt-1 text-xs font-medium text-neutral-500 transition-colors group-hover:text-purple-500"
        >
          Read article
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </span>
      </div>

      <footer className="flex items-center justify-between gap-3 border-t border-neutral-200 px-5 py-3 dark:border-neutral-800">
        <div className="flex min-w-0 items-center gap-2.5">
          {resolvedPicture ? (
            <img
              src={resolvedPicture}
              alt=""
              className="h-7 w-7 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              {authorInitial}
            </span>
          )}
          <div className="min-w-0 leading-tight">
            <p className="truncate text-xs font-medium text-neutral-800 dark:text-neutral-200">
              {authorName}
            </p>
            <p className="truncate text-[11px] text-neutral-500">
              {date} · {post.readTime} read
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center text-neutral-400 dark:text-neutral-500">
          <button
            type="button"
            onClick={handleLike}
            disabled={!canInteract || likeLoading}
            aria-label={liked ? "Unlike post" : "Like post"}
            aria-pressed={liked}
            className={iconBtn(liked, "text-rose-500")}
          >
            {liked ? <FaHeart className="h-3.5 w-3.5" /> : <FaRegHeart className="h-3.5 w-3.5" />}
            {likesCount > 0 && <span className="text-xs">{likesCount}</span>}
          </button>

          <div className="relative z-10">
            <button
              type="button"
              onClick={() => {
                setCommentOpen((prev) => !prev);
                setShareOpen(false);
              }}
              aria-label="Comments"
              aria-expanded={commentOpen}
              className={iconBtn(commentOpen, "text-sky-500")}
            >
              <FaRegComment className="h-3.5 w-3.5" />
              {commentsCount > 0 && <span className="text-xs">{commentsCount}</span>}
            </button>
            {commentOpen && !post.isDefault && (
              <CommentPopover
                blogId={post.rawId}
                onClose={closeComment}
                onCountChange={setCommentsCount}
              />
            )}
          </div>

          <div className="relative z-10">
            <button
              type="button"
              onClick={() => {
                setShareOpen((prev) => !prev);
                setCommentOpen(false);
              }}
              aria-label="Share post"
              aria-expanded={shareOpen}
              className={`relative z-10 cursor-pointer rounded-full p-1.5 transition-colors ${
                shareOpen ? "text-emerald-500" : "hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <FiShare className="h-3.5 w-3.5" />
            </button>
            {shareOpen && (
              <SharePopover
                url={`${window.location.origin}/posts/${post.id}`}
                title={post.title}
                onClose={closeShare}
              />
            )}
          </div>
        </div>
      </footer>
    </article>
  );
};

export default BlogCard;
