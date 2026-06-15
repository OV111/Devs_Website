import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { Send, Eye, Pencil } from "lucide-react";
import SaveAsOutlinedIcon from "@mui/icons-material/SaveAsOutlined";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { useParams, useNavigate } from "react-router-dom";
import SideBar from "./components/SideBar";
import ImageDropZone from "./components/ImageDropZone";
import {
  CATEGORIES,
  DIFFICULTIES,
  RECOMMENDED_TAGS,
} from "../../../constants/addBlog.js";
import { authHeaders } from "../../../constants/api.js";
import { updateBlog } from "../../services/blogsApi.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EMPTY = {
  title: "",
  description: "",
  content: "",
  tags: [],
  category: "",
  difficulty: "",
  cover: null,
  preview: null,
};

function useForm(initial) {
  const [fields, setFields] = useState(initial);
  const set = useCallback((key, value) =>
    setFields((prev) => ({ ...prev, [key]: value })), []);
  return { fields, set, setFields };
}

const inputCls =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 transition focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-600 dark:focus:border-gray-500";

const selectCls =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fields, set, setFields } = useForm(EMPTY);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [contentTab, setContentTab] = useState("write");
  const tagInputRef = useRef(null);

  // Load existing blog
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/blogs/id/${id}`, {
          headers: authHeaders(),
        });
        const data = await res.json();
        if (!data.success) throw new Error("Not found");
        const b = data.data;
        setFields({
          title: b.title ?? "",
          description: b.description ?? "",
          content: b.content ?? "",
          tags: Array.isArray(b.tags) ? b.tags : [],
          category: b.category ?? "",
          difficulty: b.difficulty ?? "",
          cover: null,
          preview: b.coverImage ?? null,
        });
      } catch {
        toast.error("Could not load blog");
        navigate("/my-profile/my-blogs");
      } finally {
        setIsFetching(false);
      }
    };
    load();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const wordCount = useMemo(
    () => fields.content.trim().split(/\s+/).filter(Boolean).length,
    [fields.content]
  );
  const readTime = useMemo(() => Math.max(1, Math.ceil(wordCount / 200)), [wordCount]);

  const suggestedTags = useMemo(() => {
    const text = `${fields.title} ${fields.description} ${fields.content}`.toLowerCase();
    return RECOMMENDED_TAGS.filter(
      (tag) => text.includes(tag.toLowerCase()) && !fields.tags.includes(tag)
    ).slice(0, 8);
  }, [fields.title, fields.description, fields.content, fields.tags]);

  const addTag = (tag) => {
    const clean = tag.trim();
    if (clean && !fields.tags.includes(clean) && fields.tags.length < 10)
      set("tags", [...fields.tags, clean]);
  };

  const removeTag = (tag) =>
    set("tags", fields.tags.filter((t) => t !== tag));

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
      setTagInput("");
    } else if (e.key === "Backspace" && !tagInput && fields.tags.length) {
      removeTag(fields.tags[fields.tags.length - 1]);
    }
  };

  const handleSubmit = async (status) => {
    if (!fields.title.trim() || !fields.content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("title", fields.title);
      formData.append("description", fields.description);
      formData.append("content", fields.content);
      formData.append("tags", JSON.stringify(fields.tags));
      formData.append("category", fields.category);
      formData.append("difficulty", fields.difficulty);
      formData.append("status", status);
      if (fields.cover) formData.append("cover", fields.cover);

      await updateBlog(id, formData);
      toast.success(status === "draft" ? "Draft updated" : "Blog published!");
      navigate("/my-profile/my-blogs");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex min-h-screen">
        <SideBar />
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-fuchsia-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SideBar />

      <div className="flex-1 overflow-auto thin-scrollbar">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-gray-50 px-6 py-1.5 dark:border-gray-800 dark:bg-gray-950">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 lg:text-2xl">
              Edit Post
            </h1>
            <p className="text-xs text-gray-400">
              {readTime} min read · {wordCount} words
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleSubmit("draft")}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
            >
              <SaveAsOutlinedIcon sx={{ fontSize: 16 }} />
              Save draft
            </button>
            <button
              onClick={() => handleSubmit("published")}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 rounded-lg bg-fuchsia-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-fuchsia-700 disabled:opacity-50 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              Publish
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-6 p-6 lg:flex-row lg:gap-8">
          {/* Writing area */}
          <div className="flex flex-1 flex-col gap-5">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={fields.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Enter a compelling title…"
                className={inputCls + " text-base font-medium"}
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Short Description
                </label>
                <span
                  className={`text-xs ${fields.description.length > 300 ? "text-red-400" : "text-gray-400"}`}
                >
                  {fields.description.length}/300
                </span>
              </div>
              <textarea
                value={fields.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="A brief summary shown in blog listings…"
                rows={3}
                className={inputCls + " resize-none"}
              />
            </div>

            {/* Content with Write/Preview tabs */}
            <div className="flex-1">
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Content <span className="text-red-400">*</span>
                  <span className="ml-1 font-normal text-gray-400">(Markdown supported)</span>
                </label>
                <div className="flex overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setContentTab("write")}
                    className={`flex items-center gap-1 px-3 py-1 text-xs transition cursor-pointer ${
                      contentTab === "write"
                        ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                        : "bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Pencil className="h-3 w-3" />
                    Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentTab("preview")}
                    className={`flex items-center gap-1 px-3 py-1 text-xs transition cursor-pointer ${
                      contentTab === "preview"
                        ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                        : "bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Eye className="h-3 w-3" />
                    Preview
                  </button>
                </div>
              </div>

              {contentTab === "write" ? (
                <textarea
                  value={fields.content}
                  onChange={(e) => set("content", e.target.value)}
                  placeholder="Write your post here… Markdown is supported."
                  rows={20}
                  className={inputCls + " resize-y font-mono text-sm leading-relaxed"}
                />
              ) : (
                <div className="min-h-[480px] rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
                  {fields.content.trim() ? (
                    <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-semibold prose-code:rounded prose-code:bg-gray-100 prose-code:px-1 prose-code:text-sm dark:prose-code:bg-gray-800">
                      <ReactMarkdown>{fields.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm italic text-gray-400">
                      Nothing to preview yet.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex w-full flex-col gap-5 lg:w-72 lg:shrink-0">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                Cover Image
              </label>
              <ImageDropZone
                label=""
                image={fields.cover}
                currentUrl={fields.preview}
                onImageChange={(file) => {
                  set("cover", file);
                  set("preview", file ? URL.createObjectURL(file) : null);
                }}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                Category
              </label>
              <select
                value={fields.category}
                onChange={(e) => set("category", e.target.value)}
                className={selectCls}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                Difficulty
              </label>
              <div className="flex gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => set("difficulty", d)}
                    className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition cursor-pointer ${
                      fields.difficulty === d
                        ? "border-fuchsia-500 bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-950/40 dark:text-fuchsia-400"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-gray-600"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Tags
                </label>
                <span className="text-xs text-gray-400">{fields.tags.length}/10</span>
              </div>

              <div
                onClick={() => tagInputRef.current?.focus()}
                className="flex min-h-[38px] flex-wrap gap-1.5 rounded-lg border border-gray-200 bg-white px-2 py-1.5 cursor-text dark:border-gray-700 dark:bg-gray-900"
              >
                {fields.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  ref={tagInputRef}
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder={fields.tags.length === 0 ? "Add tags…" : ""}
                  className="min-w-[60px] flex-1 bg-transparent text-xs text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-600"
                />
              </div>
              <p className="mt-1 text-[10px] text-gray-400">Press Enter or comma to add</p>

              {suggestedTags.length > 0 && (
                <div className="mt-2">
                  <p className="mb-1 text-[10px] text-gray-400">Suggested</p>
                  <div className="flex flex-wrap gap-1">
                    {suggestedTags.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => addTag(t)}
                        className="rounded-md border border-gray-200 px-2 py-0.5 text-[11px] text-gray-500 transition hover:border-fuchsia-400 hover:text-fuchsia-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-fuchsia-500 dark:hover:text-fuchsia-400 cursor-pointer"
                      >
                        #{t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
