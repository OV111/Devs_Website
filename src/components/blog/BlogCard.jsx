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

import JohnDoe from "../../assets/postsProfiles/JohnDoe.png";
import AdaByte from "../../assets/postsProfiles/AdaByte.png";
import DmitryPetrov from "../../assets/postsProfiles/DmitryPetrov.png";
import AliceKeyes from "../../assets/postsProfiles/AliceKeyes.png";
import WilliamChen from "../../assets/postsProfiles/WilliamChen.png";
import GraceHopper from "../../assets/postsProfiles/GraceHopper.png";

const pictureMap = {
  "JohnDoe.png": JohnDoe,
  "AdaByte.png": AdaByte,
  "DmitryPetrov.png": DmitryPetrov,
  "AliceKeyes.png": AliceKeyes,
  "WilliamChen.png": WilliamChen,
  "GraceHopper.png": GraceHopper,
};

const FictionalUsers = [
  { name: "John Doe", userName: "@johndoe", pictures: JohnDoe },
  { name: "Ada Byte", userName: "@adabyte", pictures: AdaByte },
  { name: "Dmitry Petrov", userName: "@dmit_petrov", pictures: DmitryPetrov },
  { name: "Alice Keyes", userName: "@alice_keys", pictures: AliceKeyes },
  { name: "William Chen", userName: "@will_chen", pictures: WilliamChen },
  { name: "Grace Hopper", userName: "@gracehopper", pictures: GraceHopper },
];

const normalizePost = (post) => {
  const isDefault = post.isDefault === true;

  const rawId = isDefault ? post.id : String(post._id);
  const prefixedId = `${isDefault ? "sys" : "blog"}_${rawId}`;

  const readTime =
    typeof post.readTime === "number"
      ? `${post.readTime} min`
      : (post.readTime ?? "1 min");

  return {
    id: prefixedId,
    rawId,
    isDefault,
    title: post.title ?? "Untitled",
    description: post.description ?? post.content ?? "",
    image: post.image ?? post.coverImage ?? "",
    pictures: post.pictures ?? null,
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
    firstName: post.firstName ?? null,
    lastName: post.lastName ?? null,
    userName: post.userName ?? null,
    author: post.author ?? null,
    slug: post.slug ?? null,
  };
};

const BlogCard = ({ card }) => {
  const { auth } = useAuthStore();

  const post = normalizePost(card);

  const fallbackSeed = String(post.id ?? post.title ?? "");
  const fallbackIndex =
    [...fallbackSeed].reduce((sum, char) => sum + char.charCodeAt(0), 0) %
    FictionalUsers.length;
  const fallbackUser = FictionalUsers[fallbackIndex];

  const resolvedPicture = auth
    ? pictureMap[post.pictures?.split("/").pop()]
    : fallbackUser.pictures;

  const authorName = auth
    ? `${post.firstName ?? ""} ${post.lastName ?? ""}`.trim() || "Unknown User"
    : fallbackUser.name;
  const userName = auth ? post.userName || "@userName" : fallbackUser.userName;

  const tags = Array.isArray(post.tags)
    ? post.tags
    : typeof post.tags === "string"
      ? post.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

  return (
    <Card className="w-full max-w-[400px] overflow-hidden rounded-2xl border-none bg-violet-50/40 dark:bg-slate-900">
      <div className="relative h-56 border-b border-violet-200 bg-violet-200/60 dark:border-slate-700 dark:bg-slate-800">
        <img
          src={post.image || null}
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
                _displayPicture: auth
                  ? post.pictures?.split("/").pop()
                  : (fallbackUser.pictures?.split("/").pop() ?? null),
              },
            }}
            className="shrink-0 rounded-full bg-violet-500/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-violet-400 dark:bg-violet-600 dark:hover:bg-violet-500"
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
        <CardTitle className="overflow-hidden pb-3 text-xl leading-tight text-slate-900 dark:text-slate-100">
          {post.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-2 pt-0">
        <p className="h-[72px] overflow-hidden text-sm leading-6 text-slate-600 dark:text-slate-300">
          {post.description}
        </p>
      </CardContent>

      <CardFooter className="items-center justify-between border-t border-violet-100 px-6 py-3 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <img
            src={resolvedPicture}
            alt={auth ? authorName : fallbackUser.name}
            className="h-10 w-10 rounded-full"
          />
          <div className="flex flex-col">
            <span className="h-5 overflow-x-hidden text-sm font-semibold text-slate-700 dark:text-slate-200">
              {authorName}
            </span>
            <span className="h-4 overflow-x-hidden text-xs font-semibold text-gray-400 dark:text-slate-400">
              {userName}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
          <button
            type="button"
            className={`rounded-full p-2 ${auth ? "cursor-pointer" : "cursor-not-allowed"} transition hover:bg-rose-50 hover:text-rose-500`}
          >
            <FaRegHeart />
          </button>
          <button
            type="button"
            className={`rounded-full p-2 ${auth ? "cursor-pointer" : "cursor-not-allowed"} transition hover:bg-rose-50 hover:text-blue-500`}
          >
            <FaRegComment />
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-full p-2 transition hover:bg-emerald-50 hover:text-emerald-500"
          >
            <FiShare />
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
