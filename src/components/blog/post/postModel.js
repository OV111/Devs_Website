import JohnDoe from "../../../assets/postsProfiles/JohnDoe.png";
import AdaByte from "../../../assets/postsProfiles/AdaByte.png";
import DmitryPetrov from "../../../assets/postsProfiles/DmitryPetrov.png";
import AliceKeyes from "../../../assets/postsProfiles/AliceKeyes.png";
import WilliamChen from "../../../assets/postsProfiles/WilliamChen.png";
import GraceHopper from "../../../assets/postsProfiles/GraceHopper.png";

import fs1React from "../../../assets/blog-pics/fs1React.jpg";
import BuildingRestApi from "../../../assets/blog-pics/BuildingRestApi.png";
import NodejsMongodb from "../../../assets/blog-pics/nodejsmongodb.png";
import AuthStrategiesBack from "../../../assets/blog-pics/AuthStrategiesBack.png";
import Caching from "../../../assets/blog-pics/caching.png";
import ScalableDesign from "../../../assets/blog-pics/scalabledesign.png";

// Built-in ("sys") posts reference local files by name; user posts use full
// Cloudinary URLs. resolveAsset handles both.
const COVERS = {
  "fs1React.jpg": fs1React,
  "BuildingRestApi.png": BuildingRestApi,
  "nodejsmongodb.png": NodejsMongodb,
  "AuthStrategiesBack.png": AuthStrategiesBack,
  "caching.png": Caching,
  "scalabledesign.png": ScalableDesign,
};

const AVATARS = {
  "JohnDoe.png": JohnDoe,
  "AdaByte.png": AdaByte,
  "DmitryPetrov.png": DmitryPetrov,
  "AliceKeyes.png": AliceKeyes,
  "WilliamChen.png": WilliamChen,
  "GraceHopper.png": GraceHopper,
};

const resolveAsset = (url, map) => {
  if (!url || typeof url !== "string") return null;
  if (url.startsWith("http")) return url;
  return map[url.split("/").pop()] ?? null;
};

/** "blog_<mongoId>" or "sys_<n>" -> { type, rawId }, or null if malformed. */
export const decodePostId = (prefixedId = "") => {
  const idx = prefixedId.indexOf("_");
  if (idx < 1) return null;
  return { type: prefixedId.slice(0, idx), rawId: prefixedId.slice(idx + 1) };
};

/** Same scheme DynamicIslandTOC uses, so heading anchors and its list agree. */
export const slugify = (text = "") =>
  text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

export const formatDate = (date) =>
  date
    ? date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

const toList = (value) =>
  Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

const toCount = (value) =>
  Array.isArray(value) ? value.length : Number(value) || 0;

/**
 * One shape for the page, whatever it was given. The API returns a full post;
 * the card links here with a trimmed copy in router state (no `content`).
 *
 * @typedef {Object} PostView
 * @property {string}  title
 * @property {string}  description
 * @property {string}  content      markdown ("" for a card preview)
 * @property {string|null} cover
 * @property {string}  category
 * @property {string}  difficulty
 * @property {string}  readTime     e.g. "5 min"
 * @property {string[]} tags
 * @property {string[]} layerIds    roadmap layers this post is tagged to
 * @property {Date|null} createdAt
 * @property {number}  likes
 * @property {number}  comments
 * @property {number|null} views
 * @property {{ name: string, userName: string, picture: string|null }} author
 */
export const toPostView = (post) => {
  const a = post.author && typeof post.author === "object" ? post.author : {};
  const fullName = `${a.firstName ?? post.firstName ?? ""} ${a.lastName ?? post.lastName ?? ""}`.trim();

  const readTime =
    typeof post.readTime === "number"
      ? `${post.readTime} min`
      : String(post.readTime ?? "").trim() || "1 min";

  return {
    title: post.title ?? "Untitled",
    description: post.description ?? "",
    content: post.content ?? "",
    cover:
      resolveAsset(post.coverImage, COVERS) ?? resolveAsset(post.image, COVERS),
    category: post.category ?? "",
    difficulty: post.difficulty ?? "",
    readTime,
    tags: toList(post.tags),
    layerIds: toList(post.layerIds),
    createdAt: post.createdAt ? new Date(post.createdAt) : null,
    likes: toCount(post.likes),
    comments: toCount(post.comments),
    views: typeof post.views === "number" ? post.views : null,
    author: {
      // Never invent an author: with no data it is the platform, not a fake person.
      name: post._displayName || fullName || "Vahoha community",
      userName: post._displayUserName || a.userName || post.userName || post.username || "",
      picture: resolveAsset(
        a.pictures ?? post.pictures ?? post._displayPicture,
        AVATARS,
      ),
    },
  };
};
