import { Toaster, toast } from "react-hot-toast";
import { useRef, useState } from "react";

import { UploadCloud, X } from "lucide-react";
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ImageDropZone = ({ label, image, currentUrl, onImageChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);
  const [cleared, setCleared] = useState(false);

  const preview = cleared
    ? null
    : image
      ? URL.createObjectURL(image)
      : currentUrl || null;

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error("Image must be under 5 MB");
      return;
    }
    setCleared(false);
    onImageChange(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="flex flex-col gap-2 flex-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 cursor-pointer transition-colors duration-200 ${
          isDragging
            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
            : "border-gray-300 hover:border-purple-400 dark:border-gray-700 dark:hover:border-purple-500"
        }`}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="preview"
              className="h-24 w-full object-cover rounded-md"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onImageChange(null);
                setCleared(true);
              }}
              className="absolute top-2 right-2 rounded-full bg-gray-800/60 p-0.5 text-white hover:bg-red-600 transition"
            >
              <X size={14} />
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {image ? image.name : "Current image — click or drop to replace"}
            </span>
          </>
        ) : (
          <>
            <UploadCloud
              size={28}
              className="text-gray-400 dark:text-gray-500"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              <span className="font-medium text-purple-600 dark:text-purple-400">
                Click to browse
              </span>{" "}
              or drag & drop
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              PNG, JPG, WEBP — max 5 MB
            </p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    </div>
  );
};

export default ImageDropZone;
