import { Loader2, CheckCircle2, Wrench } from "lucide-react";

const TOOL_LABELS = {
  get_user_progress: "Fetching your progress",
  get_layer_content: "Loading layer content",
  search_platform_posts: "Searching posts",
  get_exam_history: "Reading exam history",
  log_weak_spot: "Logging weak spot",
};

export default function ToolUseBlock({ name, status }) {
  const label = TOOL_LABELS[name] ?? name;
  const running = status === "running";

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-medium border"
      style={{
        borderColor: running ? "#3a2060" : "#1e3a2a",
        backgroundColor: running ? "#1a0e30" : "#0e2018",
        color: running ? "#a855f7" : "#4ade80",
      }}
    >
      {running ? (
        <Loader2 size={12} className="animate-spin shrink-0" />
      ) : (
        <CheckCircle2 size={12} className="shrink-0" />
      )}
      <Wrench size={11} className="shrink-0 opacity-50" />
      <span>{label}</span>
    </div>
  );
}
