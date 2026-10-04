import { v2 as cloudinary } from "cloudinary";

// Stored values are delivery URLs, e.g.
//   https://res.cloudinary.com/<cloud>/image/upload/v1712345678/devs_website/abc123.jpg
// Deleting needs the public_id ("devs_website/abc123") and the resource type.
const CLOUDINARY_URL =
  /^https?:\/\/res\.cloudinary\.com\/[^/]+\/(image|raw|video)\/upload\/(?:[^/]+\/)*?(?:v\d+\/)?(devs_website\/[^?#]+)/i;

/**
 * Parse a Cloudinary delivery URL into what `destroy` needs, or null when the
 * value isn't one of ours (empty, another host, or outside our upload folder —
 * so this can never be pointed at someone else's asset).
 * Raw files (e.g. a CV) keep their extension in the public_id; images don't.
 */
export const parseCloudinaryUrl = (url) => {
  if (typeof url !== "string") return null;
  const match = CLOUDINARY_URL.exec(url);
  if (!match) return null;
  const [, resourceType, path] = match;
  const publicId =
    resourceType.toLowerCase() === "raw" ? path : path.replace(/\.[a-z0-9]+$/i, "");
  return { resourceType: resourceType.toLowerCase(), publicId };
};

/**
 * Best-effort removal of uploaded files. Called after the account's database
 * rows are gone, so a Cloudinary hiccup must not undo or block the deletion —
 * failures are logged and the rest are still attempted.
 */
export const deleteCloudinaryAssets = async (urls, uploader = cloudinary.uploader) => {
  const targets = urls.map(parseCloudinaryUrl).filter(Boolean);
  const results = await Promise.allSettled(
    targets.map((t) =>
      uploader.destroy(t.publicId, { resource_type: t.resourceType, invalidate: true }),
    ),
  );
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error("Cloudinary cleanup failed for", targets[i].publicId, r.reason);
    }
  });
  return { attempted: targets.length, failed: results.filter((r) => r.status === "rejected").length };
};
