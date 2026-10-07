import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { DynamicIslandTOC } from "@/components/ui/dynamic-island-toc";
import { ArrowLeft } from "lucide-react";
import { FaHeart, FaRegComment, FaRegHeart } from "react-icons/fa6";
import { FiShare } from "react-icons/fi";
import useAuthStore from "../../stores/useAuthStore";
import { fetchComments } from "../../services/commentsApi";
import CommentPopover from "./CommentPopover";
import SharePopover from "./SharePopover";
import PostMarkdown from "./post/PostMarkdown";
import { decodePostId, formatDate, toPostView } from "./post/postModel";
import useBlogActions from "./post/useBlogActions";
import useBlogPost from "./post/useBlogPost";

// Sidebar cards use the same surface as the blog cards (BlogCard.jsx).
const SIDE_CARD =
  "rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950";

// Same prose styling the page always had, handed to the shared markdown renderer.
const PROSE =
  "space-y-4 text-[15px] leading-[1.85] text-slate-700 dark:text-slate-300 prose prose-slate dark:prose-invert max-w-none prose-headings:font-serif prose-headings:text-slate-900 dark:prose-headings:text-white prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-p:leading-relaxed prose-code:text-violet-600 dark:prose-code:text-violet-400 prose-pre:bg-slate-900 prose-pre:text-slate-100";

const backClass =
  "group mb-6 inline-flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-500 transition-colors hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-300";

// A small round arrow that slides left on hover, then the label.
const BackContent = () => (
  <>
    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 transition-colors group-hover:border-violet-400 group-hover:bg-violet-500/10 dark:border-neutral-800 dark:group-hover:border-violet-500/50">
      <ArrowLeft
        size={15}
        aria-hidden="true"
        className="transition-transform duration-200 group-hover:-translate-x-0.5"
      />
    </span>
    Back to posts
  </>
);

function BackLink() {
  const navigate = useNavigate();
  const { key } = useLocation();
  // "default" means the page was opened directly (new tab, shared link): there
  // is no history to go back to, so go to the post list instead.
  return key === "default" ? (
    <Link to="/blogs" className={backClass}>
      <BackContent />
    </Link>
  ) : (
    <button type="button" onClick={() => navigate(-1)} className={backClass}>
      <BackContent />
    </button>
  );
}

function Avatar({ author, className, fallbackClass }) {
  return author.picture ? (
    <img src={author.picture} alt={author.name} className={className} />
  ) : (
    <div className={fallbackClass}>{author.name.charAt(0)}</div>
  );
}

// Everything that needs the loaded post lives here, so its hooks start with
// real data (like counts) instead of placeholders.
function LoadedPost({ id, raw }) {
  const { auth } = useAuthStore();
  const { type, rawId } = decodePostId(id);
  const post = toPostView(raw);
  const { author } = post;

  const actions = useBlogActions({
    rawId,
    isDefault: type !== "blog",
    initialLikes: post.likes,
  });
  const [commentsCount, setCommentsCount] = useState(post.comments);
  const [commentOpen, setCommentOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const closeComment = useCallback(() => setCommentOpen(false), []);

  // The post payload has no comment count, so read it once for the details card.
  const canComment = type === "blog";
  useEffect(() => {
    if (!canComment) return;
    let cancelled = false;
    fetchComments(rawId)
      .then((list) => !cancelled && setCommentsCount(list.length))
      .catch(() => {}); // the count is cosmetic; the popover reports its own errors
    return () => {
      cancelled = true;
    };
  }, [rawId, canComment]);
  const closeShare = useCallback(() => setShareOpen(false), []);

  const date = formatDate(post.createdAt);
  const dimmed = !actions.canInteract && "cursor-not-allowed opacity-60";

  return (
    <DynamicIslandTOC>
      {/* React 19 hoists these into <head>. */}
      <title>{`${post.title} · Vahoha`}</title>
      {post.description && <meta name="description" content={post.description} />}

      <main className="mx-auto max-w-5xl px-4 pb-20 pt-6 sm:pt-10">
        <BackLink />

        {/* Phones: the box grows with its text, so a long title can't be
            clipped at the top. sm+: the original fixed 380px hero. */}
        <div className="relative mb-8 flex min-h-[300px] items-end overflow-hidden rounded-2xl bg-slate-900 sm:mb-10 sm:h-[380px]">
          {post.cover && (
            <img
              src={post.cover}
              alt={post.title}
              className="absolute inset-0 h-full w-full object-cover opacity-60"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-slate-950/40" />
          <div className="relative w-full p-5 sm:p-8">
            {/* Gradient pill with a soft violet glow; the diamond is the accent. */}
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/30 bg-gradient-to-r from-violet-500/40 via-fuchsia-500/25 to-violet-500/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-100 shadow-[0_0_24px_-6px_rgba(167,139,250,0.9)] backdrop-blur-md">
              <span aria-hidden="true" className="text-fuchsia-300">
                ◆
              </span>
              {post.category}
            </span>
            <h1 className="mb-4 font-serif text-2xl font-semibold leading-tight text-white sm:text-3xl md:text-4xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex items-center gap-2">
                <Avatar
                  author={author}
                  className="h-8 w-8 rounded-full border border-white/20 object-cover"
                  fallbackClass="flex h-8 w-8 items-center justify-center rounded-full bg-violet-800 text-xs font-medium text-violet-200"
                />
                <span className="text-sm text-white/80">
                  <span className="font-medium text-white">{author.name}</span>
                  {author.userName && (
                    <span className="ml-1 text-white/50">{author.userName}</span>
                  )}
                </span>
              </div>
              <span className="text-white/30">·</span>
              <span className="text-sm text-white/60">🕐 {post.readTime} read</span>
              <span className="text-white/30">·</span>
              <span className="text-sm text-white/60">{date}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-[1fr_240px]">
          <article>
            <p className="mb-8 border-l-4 border-violet-500 pl-4 font-serif text-base italic sm:pl-5 sm:text-lg leading-relaxed text-slate-500 dark:text-slate-400">
              {post.description}
            </p>
            <PostMarkdown content={post.content} className={PROSE} />

            {post.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2 border-t border-violet-100 pt-6 dark:border-slate-700">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-800 dark:bg-violet-900/40 dark:text-violet-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </article>

          <aside className="space-y-4">
            <div className={SIDE_CARD}>
              <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-slate-400">
                Post details
              </p>
              {[
                ["Category", post.category || "—"],
                ["Difficulty", post.difficulty || "—"],
                ["Read time", post.readTime],
                ["Published", date || "—"],
                ["Likes", actions.likesCount],
                ["Comments", commentsCount],
                ["Views", post.views ?? "—"],
              ].map(([label, val]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-violet-100 py-2 text-sm last:border-none dark:border-slate-700"
                >
                  <span className="text-slate-500 dark:text-slate-400">{label}</span>
                  <span className="block max-w-[120px] truncate text-[12px] font-medium capitalize text-slate-700 dark:text-slate-200">
                    {val}
                  </span>
                </div>
              ))}
            </div>

            <div className={SIDE_CARD}>
              <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-slate-400">
                Author
              </p>
              <div className="flex items-center gap-3">
                <Avatar
                  author={author}
                  className="h-10 w-10 rounded-full object-cover"
                  fallbackClass="flex h-10 w-10 items-center justify-center rounded-full bg-violet-200 text-sm font-medium text-violet-800"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {author.name}
                  </p>
                  <p className="text-xs text-slate-400">{author.userName}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={actions.toggleLike}
                disabled={!actions.canInteract || actions.likeBusy}
                aria-pressed={actions.liked}
                title={actions.canInteract ? undefined : "Sign in to like user posts"}
                className={`flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-500 ${dimmed || "cursor-pointer"}`}
              >
                {actions.liked ? <FaHeart /> : <FaRegHeart />}
                {actions.liked ? "Liked" : "Like this post"}
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setCommentOpen((open) => !open);
                    setShareOpen(false);
                  }}
                  disabled={!canComment}
                  aria-expanded={commentOpen}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-violet-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 ${canComment ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
                >
                  <FaRegComment /> {auth ? "Leave a comment" : "Comments"}
                </button>
                {commentOpen && canComment && (
                  <CommentPopover
                    blogId={rawId}
                    onClose={closeComment}
                    onCountChange={setCommentsCount}
                  />
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShareOpen((open) => !open);
                    setCommentOpen(false);
                  }}
                  aria-expanded={shareOpen}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-violet-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-violet-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <FiShare /> Share
                </button>
                {shareOpen && (
                  <SharePopover
                    url={`${window.location.origin}/posts/${id}`}
                    title={post.title}
                    onClose={closeShare}
                  />
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </DynamicIslandTOC>
  );
}

const centered = "flex min-h-dvh flex-col items-center justify-center gap-4";

function PostPage({ id }) {
  const { post: raw, loading, error, retry } = useBlogPost(id);

  if (raw) return <LoadedPost id={id} raw={raw} />;

  if (loading) {
    return (
      <div className={centered}>
        <p className="text-slate-400">Loading post...</p>
      </div>
    );
  }

  return (
    <div className={centered}>
      <p className="text-slate-400">{error ?? "Post not found."}</p>
      <div className="flex gap-4 text-sm">
        <button onClick={retry} className="cursor-pointer text-violet-500 hover:underline">
          Try again
        </button>
        <Link to="/blogs" className="text-slate-400 hover:text-violet-500">
          Back to posts
        </Link>
      </div>
    </div>
  );
}

// Keyed by id so moving from one post to another starts from a clean state.
export default function ReadMore() {
  const { id } = useParams();
  return <PostPage key={id} id={id} />;
}
