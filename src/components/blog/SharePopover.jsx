import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { FaFacebook, FaLinkedinIn } from "react-icons/fa6";
import { FiMail } from "react-icons/fi";
import XLogo from "../ui/XLogo";
import Popover from "./Popover";

const SharePopover = ({ url, title, onClose }) => {
  const [copied, setCopied] = useState(false);

  // navigator.clipboard is supported by every current browser (it needs a
  // secure context — https or localhost — which the app always runs in), so
  // the old document.execCommand("copy") fallback is gone.
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard permission denied: the link is still selectable in the field.
    }
  };

  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  // `hover` is each network's official brand colour, shown on hover so the
  // icons stay calm at rest but are instantly recognisable when targeted.
  // X's brand colour is black, so it flips to white on dark backgrounds.
  const socials = [
    {
      label: "Share on X",
      icon: <XLogo size={15} />,
      href: `https://x.com/intent/post?url=${encoded}&text=${encodedTitle}`,
      hover: "hover:border-black hover:text-black dark:hover:border-white dark:hover:text-white",
    },
    {
      label: "Share on Facebook",
      icon: <FaFacebook className="h-4 w-4" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      hover: "hover:border-[#1877F2] hover:text-[#1877F2]",
    },
    {
      label: "Share on LinkedIn",
      icon: <FaLinkedinIn className="h-4 w-4" />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
      hover: "hover:border-[#0A66C2] hover:text-[#0A66C2]",
    },
    {
      label: "Share by email",
      icon: <FiMail className="h-4 w-4" />,
      href: `mailto:?subject=${encodedTitle}&body=${encoded}`,
      hover: "hover:border-purple-500 hover:text-purple-500 dark:hover:text-purple-400",
    },
  ];

  return (
    <Popover title="Share" onClose={onClose} className="max-md:right-3 max-md:w-[calc(100%-1.5rem)] md:w-72">
      <div className="flex flex-col gap-3 p-4">
        <div className="flex gap-2">
          {socials.map(({ label, icon, href, hover }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className={`flex flex-1 items-center justify-center rounded-lg border border-neutral-200 py-2 text-neutral-500 transition-colors dark:border-neutral-800 dark:text-neutral-400 ${hover}`}
            >
              {icon}
            </a>
          ))}
        </div>

        <div className="relative">
          <input
            readOnly
            value={url}
            onFocus={(e) => e.target.select()}
            aria-label="Post link"
            className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2 pr-10 pl-3 text-xs text-neutral-600 outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400"
          />
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? "Link copied" : "Copy link"}
            className="absolute inset-y-0 right-2 flex cursor-pointer items-center text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-white"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </Popover>
  );
};

export default SharePopover;
