import { useState, useEffect, useRef } from "react";
import { Check, Copy, X } from "lucide-react";
import { FaXTwitter, FaFacebook, FaLinkedinIn } from "react-icons/fa6";
import { FiMail } from "react-icons/fi";

const SharePopover = ({ url, title, onClose }) => {
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback for older browsers
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const socials = [
    {
      label: "Twitter / X",
      icon: <FaXTwitter className="h-4 w-4" />,
      href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`,
    },
    {
      label: "Facebook",
      icon: <FaFacebook className="h-4 w-4" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
    },
    {
      label: "LinkedIn",
      icon: <FaLinkedinIn className="h-4 w-4" />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
    },
    {
      label: "Email",
      icon: <FiMail className="h-4 w-4" />,
      href: `mailto:?subject=${encodedTitle}&body=${encoded}`,
    },
  ];

  return (
    <div
      ref={ref}
      className="absolute bottom-10 right-0 z-50 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-900"
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Share</p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-0.5 cursor-pointer text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mb-3 flex gap-2">
        {socials.map(({ label, icon, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="flex flex-1 items-center justify-center rounded-lg border border-gray-200 py-2 text-gray-600 transition hover:border-violet-400 hover:bg-violet-50 hover:text-violet-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-violet-500 dark:hover:bg-violet-950/30 dark:hover:text-violet-400"
          >
            {icon}
          </a>
        ))}
      </div>

      <div className="relative">
        <input
          readOnly
          value={url}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-10 text-xs text-gray-600 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
        />
        <button
          type="button"
          onClick={handleCopy}
          disabled={copied}
          aria-label="Copy to clipboard"
          className="absolute inset-y-0 right-2 flex items-center text-gray-400 transition hover:text-violet-600 dark:hover:text-violet-400 disabled:pointer-events-none"
        >
          {copied
            ? <Check className="h-3.5 w-3.5 text-emerald-500" />
            : <Copy className="h-3.5 w-3.5" />
          }
        </button>
      </div>
    </div>
  );
};

export default SharePopover;
