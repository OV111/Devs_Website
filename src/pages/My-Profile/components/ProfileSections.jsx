import CvFileCard from "./CvFileCard";

export function SectionHeader({ title, right }) {
  return (
    <div className="mt-10 flex items-center gap-4 mb-4">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide shrink-0">
        {title}
      </h2>
      <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
      {right && (
        <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400 tabular-nums">
          {right}
        </span>
      )}
    </div>
  );
}

/**
 * CV + an honest summary of what the profile proves. Only claims what the
 * platform really does: capstones are AI-reviewed against a fixed rubric and
 * link to the exact commit. The CV itself is self-uploaded.
 */
export function ForHiringPanel({ editable = false, cvUrl = null, onCvUpload }) {
  return (
    <div className="rounded-2xl border border-white/10 px-4 py-4">
      <p className="text-sm text-gray-400 mb-4">
        Capstones are AI-reviewed against a fixed rubric and link to the exact
        commit, so anyone can check the work. The CV is uploaded by the owner.
      </p>

      <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-gray-400">
        CV
      </p>
      <CvFileCard editable={editable} cvUrl={cvUrl} onUpload={onCvUpload ?? (() => {})} />

      {!editable && cvUrl && (
        <a
          href={cvUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 flex w-full items-center justify-center rounded-lg border border-purple-500/50 py-2 text-sm font-medium text-purple-300 transition-colors hover:bg-purple-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        >
          Download CV ↗
        </a>
      )}
    </div>
  );
}
