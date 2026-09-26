import { Star, CheckCircle2 } from "lucide-react";
import { C, FONT_MONO } from "../../lib/arenaTheme";
import { renderInlineCode } from "../../lib/richText";
import Badge from "./Badge";
import SectionHead from "./SectionHead";

export default function ProblemPanel({ challenge }) {
  return (
    <div className="thin-scrollbar flex flex-col h-full overflow-y-auto gap-5 px-5 py-5">
      <div className="flex flex-wrap gap-1.5">
        <Badge color={C.text} bg="#18181f" border={C.faint}>{challenge.slug}</Badge>
        <Badge color={C.green} bg="#06190f" border="#0e3d1e">{challenge.type}</Badge>
        <Badge color={C.amber} bg="#190f00" border="#3d2700">{challenge.difficulty}</Badge>
        <Badge color={C.purple} bg="#160828" border="#3b1e6e">+{challenge.xp} XP</Badge>
        {challenge.done && (
          <span
            className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-widest"
            style={{ color: C.green, background: "#06190f", border: `1px solid #0e3d1e` }}
          >
            <CheckCircle2 size={10} />
            SOLVED
          </span>
        )}
      </div>

      {challenge.weakTopic && (
        <div
          className="flex items-center gap-1.5 self-start px-3 py-1 rounded-full"
          style={{ background: "#1c1200", border: `1px solid #4a3200`, color: C.amber }}
        >
          <Star size={10} fill={C.amber} />
          <span className="text-[10px] font-bold tracking-widest uppercase">Your weak topic</span>
        </div>
      )}

      <h1 className="text-[20px] font-bold leading-snug" style={{ color: C.text }}>
        {challenge.title}
      </h1>

      <p
        className="text-[13px] leading-relaxed"
        style={{ color: "#8a8a9a" }}
        dangerouslySetInnerHTML={{ __html: renderInlineCode(challenge.description) }}
      />

      <div>
        <SectionHead>The task</SectionHead>
        <p
          className="text-[13px] leading-relaxed"
          style={{ color: "#8a8a9a" }}
          dangerouslySetInnerHTML={{ __html: renderInlineCode(challenge.task) }}
        />
      </div>

      <div>
        <SectionHead>Constraints</SectionHead>
        <ul className="flex flex-col gap-2">
          {challenge.constraints.map((c, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[13px]" style={{ color: "#8a8a9a" }}>
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: C.purple }} />
              <span dangerouslySetInnerHTML={{ __html: renderInlineCode(c) }} />
            </li>
          ))}
        </ul>
      </div>

      <div>
        <SectionHead>Example usage</SectionHead>
        <pre
          className="thin-scrollbar text-[12px] leading-relaxed p-4 rounded-lg overflow-x-auto"
          style={{
            background: "#0e0e14",
            border: `1px solid ${C.border}`,
            color: "#b0b0c0",
            fontFamily: FONT_MONO,
          }}
        >
          {challenge.example}
        </pre>
      </div>
    </div>
  );
}
