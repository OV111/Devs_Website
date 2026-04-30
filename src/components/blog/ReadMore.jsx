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

const ReadMore = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth } = useAuthStore();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  useEffect(() => {
    if (location.state?.post) {
      setPost(location.state.post);
    }
  }, [location.state]);

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-400">Post not found.</p>
      </div>
    );
  }
  console.log(post);
  const resolvedImage = imageMap[post.image?.split("/").pop()];
  const resolvedPicture = pictureMap[post._displayPicture];
  const authorName = post._displayName || "Unknown Author";
  const userName = post._displayUserName || "";

  const tags = Array.isArray(post.tags)
    ? post.tags
    : typeof post.tags === "string"
      ? post.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

  return (
    <main className="mx-auto max-w-4xl px-4 pb-20 pt-28">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm text-slate-500 transition hover:text-violet-600 dark:text-slate-400"
      >
        ← Back to posts
      </button>

      {/* Hero */}
      <div className="relative mb-10 h-[380px] overflow-hidden rounded-2xl bg-slate-900">
        {resolvedImage && (
          <img
            src={resolvedImage}
            alt={post.title}
            className="h-full w-full object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-8">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-500/20 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-violet-300">
            ◆ {post.category}
          </span>
          <h1 className="mb-4 font-serif text-3xl font-semibold leading-tight text-white md:text-4xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              {resolvedPicture ? (
                <img
                  src={resolvedPicture}
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
            <span className="text-sm text-white/60">
              🕐 {post.readTime} read
            </span>
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

      {/* Body */}
      <div className="grid gap-10 md:grid-cols-[1fr_240px]">
        {/* Article */}
        <article>
          <p className="mb-8 border-l-4 border-violet-500 pl-5 font-serif text-lg italic leading-relaxed text-slate-500 dark:text-slate-400">
            {post.description}
          </p>
          <div className="space-y-4 text-[15px] leading-[1.85] text-slate-700 dark:text-slate-300">
            <p>
              This is where the full article content will appear. You can extend
              your post schema with a{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm dark:bg-slate-800">
                content
              </code>{" "}
              field in MongoDB and render it here, supporting Markdown or rich
              text as your platform grows.
            </p>
            <p>
              For now, the description serves as the intro — a clean summary
              that sets context before the reader dives into the full material.
            </p>
          </div>

          {/* Tags */}
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

        {/* Sidebar */}
        <aside className="space-y-4">
          {/* Post details */}
          <div className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5 dark:border-slate-700 dark:bg-slate-900">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-slate-400">
              Post details
            </p>
            {[
              ["Category", post.category],
              ["Read time", post.readTime],
              [
                "Published",
                new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
              ],
              ["Likes", post.likes || "3928"],
              ["Views", post.views || "—"],
            ].map(([label, val]) => (
              <div
                key={label}
                className="flex items-center justify-between border-b border-violet-100 py-2 text-sm last:border-none dark:border-slate-700"
              >
                <span className="text-slate-500 dark:text-slate-400">
                  {label}
                </span>
                <span className="font-medium capitalize text-slate-700 dark:text-slate-200">
                  {val}
                </span>
              </div>
            ))}
          </div>

          {/* Author */}
          <div className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5 dark:border-slate-700 dark:bg-slate-900">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-slate-400">
              Author
            </p>
            <div className="flex items-center gap-3">
              {resolvedPicture ? (
                <img
                  src={resolvedPicture}
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

          {/* Actions */}
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
