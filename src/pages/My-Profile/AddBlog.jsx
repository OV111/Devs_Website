import React, { useMemo, useState } from "react";
import { Send, X, ImagePlus } from "lucide-react";
import { TextField, FormLabel, Chip } from "@mui/material";
import SaveAsOutlinedIcon from "@mui/icons-material/SaveAsOutlined";
import { Toaster, toast } from "react-hot-toast";
import SideBar from "./components/SideBar";
import useThemeStore from "../../stores/useThemeStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ReccomendedTags = [
  "JavaScript",
  "React",
  "TypeScript",
  "Node.js",
  "CSS",
  "HTML",
  "Python",
];
let category = [
  "Full Stack Development",
  "Mobile Development",
  "Game Development",
  "ML & AI",
  "Backend Development",
  "Quality Assurance",
  "DevOps",
  "Data Science",
  "Cybersecurity",
  "Cloud Computing",
  "Data Science",
  "Database Management",
  "Quantum Computing",
];

export default function AddBlog() {
  const { theme } = useThemeStore();
  const isDarkMode = theme === "dark";
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [cover, setCover] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const readTime = useMemo(() => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  }, [content]);

  const suggestedTags = useMemo(() => {
    const text = `${title} ${description} ${content}`.toLowerCase();
    return ReccomendedTags.filter((tag) => text.includes(tag.toLowerCase()));
  }, [title, description, content]);

  const addTag = (tag) => {
    if (!tags.includes(tag)) setTags([...tags, tag]);
  };

  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCover(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (status) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("content", content);
      formData.append("tags", JSON.stringify(tags));
      formData.append("status", status);
      if (cover) formData.append("cover", cover);

      const res = await fetch(`${API_BASE_URL}/blogs`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed");
      toast.success(status === "draft" ? "Draft saved" : "Blog published 🚀");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
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
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <SaveAsOutlinedIcon fontSize="small" /> Save draft
            </button>
            <button
              onClick={() => handleSubmit("published")}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-fuchsia-700 dark:bg-fuchsia-500 dark:hover:bg-fuchsia-600"
            >
              <Send className="h-4 w-4" /> Publish
            </button>
          </div>
        </header>

        <section className="grid gap-5 space-y-6">
          <TextField
            label="Title"
            required
            value={title}
            className="w-100 rounded-lg border  border-gray-300 text-base outline-none lg:max-w-100"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a compelling title for your post..."
            fullWidth
            size="small"
            sx={{
              "& .MuiInputLabel-root": {
                color: isDarkMode ? "#9ca3af" : "#6b7280",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: isDarkMode ? "#d1d5db" : "#374151",
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                color: isDarkMode ? "#f3f4f6" : "#111827",
                backgroundColor: isDarkMode ? "#111827" : "#ffffff",
                "& fieldset": {
                  borderColor: isDarkMode ? "#374151" : "#d1d5db",
                },
                "&:hover fieldset": {
                  borderColor: isDarkMode ? "#4b5563" : "#9ca3af",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#6b7280",
                },
              },
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a brief summary that will appear in blog listings..."
            multiline
            sx={{
              "& .MuiInputLabel-root": {
                color: isDarkMode ? "#9ca3af" : "#6b7280",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: isDarkMode ? "#d1d5db" : "#374151",
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                color: isDarkMode ? "#f3f4f6" : "#111827",
                backgroundColor: isDarkMode ? "#111827" : "#ffffff",
                "& fieldset": {
                  borderColor: isDarkMode ? "#374151" : "#d1d5db",
                },
                "&:hover fieldset": {
                  borderColor: isDarkMode ? "#4b5563" : "#9ca3af",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#6b7280",
                },
              },
              "& .MuiFormHelperText-root": {
                color: isDarkMode ? "#9ca3af" : "#6b7280",
              },
              "& .MuiInputBase-root": { height: 90 },
              "& .MuiInputBase-input": {
                padding: "4px 8px",
                fontSize: { lg: "16px", xs: "12px" },
              },
            }}
            minRows={2.5}
            fullWidth
            helperText={`${description.length}/100 characters recommended`}
          />
          <div>
            <div className="mb-1 flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Content (Markdown supported)</span>
              <span>{readTime} min read</span>
            </div>
            <TextField
              value={content}
              onChange={(e) => setContent(e.target.value)}
              multiline
              minRows={10}
              fullWidth
              placeholder="Write your post content here…"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  color: isDarkMode ? "#f3f4f6" : "#111827",
                  backgroundColor: isDarkMode ? "#111827" : "#ffffff",
                  "& fieldset": {
                    borderColor: isDarkMode ? "#374151" : "#d1d5db",
                  },
                  "&:hover fieldset": {
                    borderColor: isDarkMode ? "#4b5563" : "#9ca3af",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#6b7280",
                  },
                },
              }}
            />
          </div>

          <div>
            <FormLabel sx={{ color: isDarkMode ? "#d1d5db" : "#374151" }}>
              Tags:
            </FormLabel>
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
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

          <div>
            <select className="ml-2 rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
              <option value="">Select category</option>
              {category.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FormLabel sx={{ color: isDarkMode ? "#d1d5db" : "#374151" }}>
              Cover image
            </FormLabel>
            <label className="mt-2 block h-40 cursor-pointer rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center transition duration-300 hover:border-purple-500 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-purple-400">
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Cover preview"
                    className="h-48 w-full rounded-lg object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setCover(null);
                      setPreview(null);
                    }}
                    className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-700 dark:text-gray-300">
                  <ImagePlus className="h-8 w-8" />
                  <p>Click to upload cover image</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG / JPG • up to 10MB
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                hidden
              />
            </label>
          </div>
        </section>
      </main>
    </div>
  );
}
