import { motion as Motion } from "framer-motion";
import { Check } from "lucide-react";
import { SURFACE, SectionLabel } from "./ui";
import { fadeUp } from "../lib/motion";

// Only what the platform really issues today.
const APPROVAL_ITEMS = [
  "A capstone certificate with a public verification link",
  "Your repository and exact commit on the certificate",
  "Review and defense scores anyone can check",
  "XP the first time you pass a track capstone",
];

/**
 * "What you earn" — shown before the capstone is started, as motivation.
 * Once there is an attempt the page is about doing the work; after approval
 * the hero links the certificate itself.
 */
export default function OnApprovalCard() {
  return (
    <Motion.aside
      {...fadeUp(0.12)}
      className={`${SURFACE} flex flex-col gap-4 p-6`}
    >
      <SectionLabel>What you earn</SectionLabel>
      <p className="text-sm leading-relaxed text-neutral-300">
        When the agent approves your capstone, you get proof anyone can verify.
      </p>
      <ul className="flex flex-col gap-3">
        {APPROVAL_ITEMS.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-sm text-neutral-200"
          >
            <Check
              size={16}
              className="mt-0.5 shrink-0 text-green-400"
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>
    </Motion.aside>
  );
}
