import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Send, X, ImagePlus } from "lucide-react";
import { TextField, FormLabel, Chip } from "@mui/material";
import SaveAsOutlinedIcon from "@mui/icons-material/SaveAsOutlined";
import { Toaster, toast } from "react-hot-toast";
import SideBar from "./components/SideBar";
import useThemeStore from "../../stores/useThemeStore";

import ImageDropZone from "./components/ImageDropZone";
import {
  CATEGORIES,
  DIFFICULTIES,
  RECOMMENDED_TAGS,
} from "../../../constants/addBlog.js";

// ── useForm ────────────────────────────────────────────────────────────────
function useForm(initial) {
  const [fields, setFields] = useState(initial);

  const set = useCallback((key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  }, []);

  const reset = useCallback(() => setFields(initial), [initial]);

  return { fields, set, reset };
}

// ── useDebouncedSave (disabled until /blogs/autosave route exists) ─────────
// async function saveDraft(fields) {
//   const token = localStorage.getItem("token");
//   try {
//     const formData = new FormData();
//     formData.append("title", fields.title);
//     formData.append("description", fields.description);
//     formData.append("content", fields.content);
//     formData.append("tags", JSON.stringify(fields.tags));
//     formData.append("category", fields.category);
//     formData.append("difficulty", fields.difficulty);
//     formData.append("status", "draft");
//     if (fields.cover) formData.append("cover", fields.cover);
//     await fetch(`${import.meta.env.VITE_API_BASE_URL}/blogs/autosave`, {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}` },
//       body: formData,
//     });
//   } catch {
//     // silent fail
//   }
// }

// function useDebouncedSave(fields, delay = 1500) {
//   const isFirstRender = useRef(true);
//   useEffect(() => {
//     if (isFirstRender.current) { isFirstRender.current = false; return; }
//     if (!fields.title && !fields.content) return;
//     const timer = setTimeout(() => saveDraft(fields), delay);
//     return () => clearTimeout(timer);
//   }, [fields.title, fields.content, fields.description, fields.tags, fields.category]);
// }

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const INITIAL_FIELDS = {
  title: "",
  description: "",
  content: "",
  tags: [],
  category: "",
  difficulty: "",
  cover: null,
  preview: null,
};

export default function AddBlog() {
  const { theme } = useThemeStore();
  const isDarkMode = theme === "dark";
  const { fields, set, reset } = useForm(INITIAL_FIELDS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useDebouncedSave(fields); // uncomment once /blogs/autosave route is ready

  const readTime = useMemo(() => {
    const words = fields.content.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  }, [fields.content]);


  const suggestedTags = useMemo(() => {
    const text =
      `${fields.title} ${fields.description} ${fields.content}`.toLowerCase();
    return RECOMMENDED_TAGS.filter((tag) => text.includes(tag.toLowerCase()));
  }, [fields.title, fields.description, fields.content]);

  const addTag = (tag) => {
    if (!fields.tags.includes(tag)) set("tags", [...fields.tags, tag]);
  };
  const removeTag = (tag) => {
    set(
      "tags",
      fields.tags.filter((t) => t !== tag),
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    set("cover", file);
    set("preview", URL.createObjectURL(file));
  };
  const clearCover = (e) => {
    e.preventDefault();
    set("cover", null);
    set("preview", null);
  };

  const handleSubmit = async (status) => {
    const token = localStorage.getItem("JWT");
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

      const res = await fetch(`${API_BASE_URL}/blogs`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed");
      toast.success(status === "draft" ? "Draft saved" : "Blog published");
      if (status === "published") reset();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputSx = {
    "& .MuiInputLabel-root": { color: isDarkMode ? "#9ca3af" : "#6b7280" },
    "& .MuiInputLabel-root.Mui-focused": {
      color: isDarkMode ? "#d1d5db" : "#374151",
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      color: isDarkMode ? "#f3f4f6" : "#111827",
      backgroundColor: isDarkMode ? "#111827" : "#ffffff",
      "& fieldset": { borderColor: isDarkMode ? "#374151" : "#d1d5db" },
      "&:hover fieldset": { borderColor: isDarkMode ? "#4b5563" : "#9ca3af" },
      "&.Mui-focused fieldset": { borderColor: "#6b7280" },
    },
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <SideBar />
      <Toaster position="top-center" />

      <main className="m-8 w-full max-w-5xl flex-1">
        <header className="mb-10 grid items-start justify-between lg:flex">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 lg:text-3xl">
              Write a new blog
            </h1>
            <p className="mt-1 text-base text-gray-600 dark:text-gray-300 lg:text-xl">
              Share knowledge with the developer community
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleSubmit("draft")}
              disabled={isSubmitting}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <SaveAsOutlinedIcon fontSize="small" /> Save draft
            </button>
            <button
              onClick={() => handleSubmit("published")}
              disabled={isSubmitting}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-fuchsia-700 dark:bg-fuchsia-500 dark:hover:bg-fuchsia-600"
            >
              <Send className="h-4 w-4" /> Publish
            </button>
          </div>
        </header>

        <section className="grid gap-5 space-y-6">
          <TextField
            label="Title"
            required
            value={fields.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Enter a compelling title for your post..."
            fullWidth
            size="small"
            sx={{
              ...inputSx,
              "& .MuiInputBase-root": { height: 40 },
              "& .MuiInputBase-input": {
                padding: "2px 12px",
                fontSize: { lg: "16px", xs: "12px" },
              },
            }}
          />

          <TextField
            label="Short Description"
            required
            value={fields.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Write a brief summary that will appear in blog listings..."
            multiline
            minRows={2.5}
            fullWidth
            helperText={`${fields.description.length}/100 characters recommended`}
            sx={{
              ...inputSx,

              "& .MuiFormHelperText-root": {
                color: isDarkMode ? "#9ca3af" : "#6b7280",
              },

              // remove fixed height
              "& .MuiInputBase-root": {
                minHeight: 90,
                alignItems: "flex-start",
              },

              "& .MuiInputBase-input": {
                padding: "12px 8px",
                fontSize: { lg: "16px", xs: "12px" },
              },
            }}
          />

          <div>
            <div className="mb-1 flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Content (Markdown supported)</span>
              <span>{readTime} min read</span>
            </div>
            <TextField
              value={fields.content}
              onChange={(e) => set("content", e.target.value)}
              multiline
              minRows={10}
              fullWidth
              placeholder="Write your post content here…"
              sx={inputSx}
            />
          </div>

          <div>
            <FormLabel sx={{ color: isDarkMode ? "#d1d5db" : "#374151" }}>
              Tags:
            </FormLabel>
            <div className="mt-2 flex flex-wrap gap-2">
              {fields.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => removeTag(tag)}
                  sx={{
                    color: isDarkMode ? "#e5e7eb" : "#374151",
                    backgroundColor: isDarkMode ? "#1f2937" : "#f3f4f6",
                  }}
                />
              ))}
            </div>
            {suggestedTags.length > 0 && (
              <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Suggested:
                {suggestedTags.map((t) => (
                  <button
                    key={t}
                    onClick={() => addTag(t)}
                    className="ml-2 text-fuchsia-600 hover:underline dark:text-fuchsia-400"
                  >
                    #{t}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={fields.category}
              onChange={(e) => set("category", e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={fields.difficulty}
              onChange={(e) => set("difficulty", e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            >
              <option value="">Select difficulty</option>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <ImageDropZone
            label="Cover Image"
            image={fields.cover}
            currentUrl={fields.preview}
            onImageChange={(file) => {
              set("cover", file);
              set("preview", file ? URL.createObjectURL(file) : null);
            }}
          />
        </section>
      </main>
    </div>
  );
}
