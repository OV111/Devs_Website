// ! For now the posts default is not fixable with read-more but i will fix in db
import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { FaRegHeart, FaRegComment } from "react-icons/fa6";
import { FiShare } from "react-icons/fi";
import useAuthStore from "../../stores/useAuthStore";

import JohnDoe from "../../assets/postsProfiles/JohnDoe.png";
import AdaByte from "../../assets/postsProfiles/AdaByte.png";
import DmitryPetrov from "../../assets/postsProfiles/DmitryPetrov.png";
import AliceKeyes from "../../assets/postsProfiles/AliceKeyes.png";
import WilliamChen from "../../assets/postsProfiles/WilliamChen.png";
import GraceHopper from "../../assets/postsProfiles/GraceHopper.png";

import fs1React from "../../assets/blog-pics/fs1React.jpg";
import BuildingRestApi from "../../assets/blog-pics/BuildingRestApi.png";
import NodejsMongodb from "../../assets/blog-pics/nodejsmongodb.png";
import AuthStrategiesBack from "../../assets/blog-pics/AuthStrategiesBack.png";
import Caching from "../../assets/blog-pics/caching.png";
import ScalableDesign from "../../assets/blog-pics/scalabledesign.png";

const imageMap = {
  "fs1React.jpg": fs1React,
  "BuildingRestApi.png": BuildingRestApi,
  "nodejsmongodb.png": NodejsMongodb,
  "AuthStrategiesBack.png": AuthStrategiesBack,
  "caching.png": Caching,
  "scalabledesign.png": ScalableDesign,
};

const pictureMap = {
  "JohnDoe.png": JohnDoe,
  "AdaByte.png": AdaByte,
  "DmitryPetrov.png": DmitryPetrov,
  "AliceKeyes.png": AliceKeyes,
  "WilliamChen.png": WilliamChen,
  "GraceHopper.png": GraceHopper,
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const decodePostId = (prefixedId) => {
  const idx = prefixedId.indexOf("_");
  return {
    type: prefixedId.slice(0, idx), // "blog" | "sys"
    rawId: prefixedId.slice(idx + 1),
  };
};

const FictionalUsers = [
  { name: "John Doe", userName: "@johndoe", pictures: JohnDoe },
  { name: "Ada Byte", userName: "@adabyte", pictures: AdaByte },
  { name: "Dmitry Petrov", userName: "@dmit_petrov", pictures: DmitryPetrov },
  { name: "Alice Keyes", userName: "@alice_keys", pictures: AliceKeyes },
  { name: "William Chen", userName: "@will_chen", pictures: WilliamChen },
  { name: "Grace Hopper", userName: "@gracehopper", pictures: GraceHopper },
];

const resolveAuthor = (post, auth) => {
  if (!auth) {
    const fallbackSeed = String(post.rawId ?? post.title ?? "");
    const fallbackIndex =
      [...fallbackSeed].reduce((sum, char) => sum + char.charCodeAt(0), 0) %
      FictionalUsers.length;
    return {
      authorName: FictionalUsers[fallbackIndex].name,
      userName: FictionalUsers[fallbackIndex].userName,
      picture: FictionalUsers[fallbackIndex].pictures,
    };
  }

  if (post._displayName) {
    const pic = post._displayPicture;
    return {
      authorName: post._displayName,
      userName: post._displayUserName || "",
      picture: pic?.startsWith("http") ? pic : (pictureMap[pic] ?? null),
    };
  }

  if (post.author && typeof post.author === "object") {
    const { firstName, lastName, userName, pictures } = post.author;
    return {
      authorName:
        `${firstName ?? ""} ${lastName ?? ""}`.trim() || "Unknown Author",
      userName: userName || "",
      picture: pictures?.startsWith("http")
        ? pictures
        : (pictureMap[pictures?.split("/").pop()] ?? null),
    };
  }

  return {
    authorName:
      `${post.firstName ?? ""} ${post.lastName ?? ""}`.trim() ||
      "Unknown Author",
    userName: post.userName || "",
    picture: post.pictures?.startsWith("http")
      ? post.pictures
      : (pictureMap[post.pictures?.split("/").pop()] ?? null),
  };
};

const ReadMore = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth } = useAuthStore();
  const { id } = useParams(); // "blog_69f88..." or "sys_0"

  const [post, setPost] = useState(location.state?.post ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);

        const { type, rawId } = decodePostId(id);

        const endpoint =
          type === "blog"
            ? `${API_BASE_URL}/blogs/id/${rawId}`
            : `${API_BASE_URL}/posts/${rawId}`;

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Post not found");

        const data = await res.json();
        setPost(data.data ?? data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading && !post) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-400">Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-400">{error ?? "Post not found."}</p>
      </div>
    );
  }

  const { authorName, userName, picture } = resolveAuthor(post, auth);

  // blog posts: Cloudinary URL (starts with http)
  // default posts: local asset via imageMap
  const coverImage = post.coverImage?.startsWith("http")
    ? post.coverImage
    : post.image?.startsWith("http")
      ? post.image
      : (imageMap[post.image?.split("/").pop()] ?? null);

  const readTime =
    typeof post.readTime === "number"
      ? `${post.readTime} min`
      : (post.readTime ?? "1 min");

  const tags = Array.isArray(post.tags)
    ? post.tags
    : typeof post.tags === "string"
      ? post.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

  const likes = Array.isArray(post.likes) ? post.likes.length : post.likes || 0;

  return (
    <main className="mx-auto max-w-5xl px-4 pb-20 pt-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm cursor-pointer text-slate-500 transition hover:text-violet-600 dark:text-slate-400"
      >
        ← Back to posts
      </button>

      <div className="relative mb-10 h-[380px] overflow-hidden rounded-2xl bg-slate-900">
        {coverImage && (
          <img
            src={coverImage}
            alt={post.title}
            className="h-full w-full object-cover opacity-60 "
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-slate-950/40" />
        {/* <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" /> */}
        <div className="absolute inset-x-0 bottom-0 p-8">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-500/20 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-violet-300">
            ◆ {post.category}
          </span>
          <h1 className="mb-4 font-serif text-3xl font-semibold leading-tight text-white md:text-4xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              {picture ? (
                <img
                  src={picture}
                  alt={authorName}
                  className="h-8 w-8 rounded-full border border-white/20 object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-800 text-xs font-medium text-violet-200">
                  {authorName.charAt(0)}
                </div>
              )}
              <span className="text-sm text-white/80">
                <span className="font-medium text-white">{authorName}</span>
                {userName && (
                  <span className="ml-1 text-white/50">{userName}</span>
                )}
              </span>
            </div>
            <span className="text-white/30">·</span>
            <span className="text-sm text-white/60">🕐 {readTime} read</span>
            <span className="text-white/30">·</span>
            <span className="text-sm text-white/60">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-10 md:grid-cols-[1fr_240px]">
        <article>
          <p className="mb-8 border-l-4 border-violet-500 pl-5 font-serif text-lg italic leading-relaxed text-slate-500 dark:text-slate-400">
            {post.description}
          </p>
          <div className="space-y-4 text-[15px] leading-[1.85] text-slate-700 dark:text-slate-300">
            <p>{post.content}</p>
          </div>

          {tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2 border-t border-violet-100 pt-6 dark:border-slate-700">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-800 dark:bg-violet-900/40 dark:text-violet-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5 dark:border-slate-700 dark:bg-slate-900">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-slate-400">
              Post details
            </p>
            {[
              ["Category", post.category ?? "—"],
              ["Difficulty", post.difficulty ?? "—"],
              ["Read time", readTime],
              [
                "Published",
                new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
              ],
              ["Likes", likes],
              ["Views", post.views ?? "—"],
            ].map(([label, val]) => (
              <div
                key={label}
                className="flex items-center justify-between border-b border-violet-100 py-2 text-sm last:border-none dark:border-slate-700"
              >
                <span className="text-slate-500 dark:text-slate-400">
                  {label}
                </span>
                <span className="font-medium capitalize text-[12px] text-slate-200 truncate max-w-[120px] block">
                  {val}
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5 dark:border-slate-700 dark:bg-slate-900">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-slate-400">
              Author
            </p>
            <div className="flex items-center gap-3">
              {picture ? (
                <img
                  src={picture}
                  alt={authorName}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-200 text-sm font-medium text-violet-800">
                  {authorName.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {authorName}
                </p>
                <p className="text-xs text-slate-400">{userName}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              className={`flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500 ${!auth && "cursor-not-allowed opacity-60"}`}
            >
              <FaRegHeart /> Like this post
            </button>
            <button
              type="button"
              className={`flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-violet-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 ${!auth && "cursor-not-allowed opacity-60"}`}
            >
              <FaRegComment /> Leave a comment
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-violet-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <FiShare /> Share
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default ReadMore;
