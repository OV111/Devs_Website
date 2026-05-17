import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Link } from "react-router-dom";
import { FaRegBookmark, FaRegComment, FaRegHeart } from "react-icons/fa6";
import { FiShare } from "react-icons/fi";
import useAuthStore from "../../stores/useAuthStore";

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
  "DmitryPetrov.png":DmitryPetrov,
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

  const post = normalizePost(card);

  const resolvedPicture = resolveAsset(post.pictures, pictureMap);
  const resolvedCover   = resolveAsset(post.image, blogImgMap);
  const authorName = `${post.firstName ?? ""} ${post.lastName ?? ""}`.trim() || "Unknown";
  const userName = post.userName || "@username";
  const authorInitial = authorName.charAt(0).toUpperCase();

  const tags = post.tags;

  return (
    <Card className="flex flex-col w-full max-w-[400px] min-h-[478px] overflow-hidden rounded-2xl border-none bg-violet-50/40 dark:bg-slate-900">
      <div className="relative h-56 border-b border-violet-200 bg-violet-200/60 dark:border-slate-700 dark:bg-slate-800">
        <img
          src={resolvedCover || null}
          alt={post.title}
          className="h-full w-full object-cover"
        />
        <button className="absolute right-4 top-4 cursor-pointer rounded-full bg-white/95 p-2 font-medium text-slate-700 shadow-sm transition-colors duration-200 hover:bg-violet-600 hover:text-white dark:bg-slate-800/90 dark:text-slate-200">
          <FaRegBookmark
            className={`${auth ? "cursor-pointer" : "cursor-not-allowed"}`}
          />
        </button>
        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
          <div className="flex max-w-[20rem] flex-wrap gap-1.5 overflow-hidden">
            {tags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="flex min-w-0 items-center justify-center rounded-full bg-violet-950/70 px-3 py-1 text-[8px] font-semibold uppercase tracking-wide text-violet-50 shadow-sm backdrop-blur-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
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
            className="shrink-0 rounded-full bg-purple-600 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-violet-400 dark:bg-purple-600 dark:hover:bg-violet-500"
          >
            Read More
          </Link>
        </div>
      </div>
      <CardHeader className="space-y-3 px-6 pb-0 pt-4">
        <div className="flex items-center justify-between text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
          <span>
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <CardDescription className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {post.readTime} read
          </CardDescription>
        </div>
        <CardTitle className="h-[50px] overflow-hidden pb-3 text-xl leading-tight text-slate-900 dark:text-slate-100">
          {post.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 px-6 pb-2 pt-0">
        <p className="h-[72px] overflow-hidden text-sm leading-6 text-slate-600 dark:text-slate-300">
          {post.description}
        </p>
      </CardContent>

      <CardFooter className="items-center justify-between border-t border-violet-100 px-4 py-3 dark:border-slate-700 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {resolvedPicture ? (
            <img
              src={resolvedPicture}
              alt={authorName}
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full shrink-0 object-cover"
            />
          ) : (
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full shrink-0 bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-300 text-xs sm:text-sm font-bold">
              {authorInitial}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="h-5 overflow-x-hidden text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[100px] sm:max-w-40">
              {authorName}
            </span>
            <span className="h-4 overflow-x-hidden capitalize truncate text-xs font-semibold text-gray-400 dark:text-slate-400 max-w-20 sm:max-w-[150px]">
              {userName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1 text-slate-400 dark:text-slate-500 shrink-0">
          <button
            type="button"
            className={`rounded-full p-1.5 sm:p-2 ${auth ? "cursor-pointer" : "cursor-not-allowed"} transition hover:text-rose-500`}
          >
            <FaRegHeart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
          <button
            type="button"
            className={`rounded-full p-1.5 sm:p-2 ${auth ? "cursor-pointer" : "cursor-not-allowed"} transition hover:text-blue-500`}
          >
            <FaRegComment className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-full p-1.5 sm:p-2 transition hover:text-emerald-500"
          >
            <FiShare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
