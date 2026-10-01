import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { API_BASE_URL } from "../../../../constants/api";

const MAX_POSTS = 5;

/**
 * Published blog posts tagged with this roadmap layer: the "study" step of
 * study -> exam -> weak spots. Optional by design: no posts, a slow network or
 * a failed request all render nothing rather than an error in the drawer.
 */
const LayerPosts = ({ layerId, onNavigate }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Abort on layer change so a slow response for the previous layer can't
    // overwrite the list for the one now showing.
    const controller = new AbortController();
    setPosts([]);
    fetch(
      `${API_BASE_URL}/blogs?layer=${encodeURIComponent(layerId)}&limit=${MAX_POSTS}`,
      { signal: controller.signal },
    )
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((json) => setPosts(json.data ?? []))
      .catch(() => {}); // optional section: failures (and aborts) just show nothing
    return () => controller.abort();
  }, [layerId]);

  if (posts.length === 0) return null;

  return (
    <div>
      <h3 className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-neutral-600 mb-3">
        <FileText size={12} />
        Posts for this layer
      </h3>
      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post._id}>
            {/* /posts/:id expects the "blog_" prefix (see decodePostId in ReadMore) */}
            <Link
              to={`/posts/blog_${post._id}`}
              onClick={onNavigate}
              className="block py-2 px-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-600 transition-colors"
            >
              <p className="text-sm font-medium text-neutral-200 truncate">{post.title}</p>
              {post.readTime && (
                <p className="text-[11px] text-neutral-600 mt-0.5">{post.readTime} min read</p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LayerPosts;
