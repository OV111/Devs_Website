import { useConnectorNode, useConnection } from "./connectorHooks";
import SubtopicCard from "./SubtopicCard";
import { TREE_TOKENS } from "./treeTokens";

// Mid-level card. Owns a flex-column of its subtopic cards with a fixed gap
// (treeTokens.cardGap) — replaces the old fixed-height slot + manually
// computed child centers, so height is whatever the content actually needs.
const SectionCard = ({ id, title, side, isDone, children = [] }) => {
  const hasChildren = children.length > 0;
  const connectorRef = useConnectorNode(id);

  return (
    <div className={`flex items-center gap-6 ${side === "left" ? "flex-row-reverse" : "flex-row"}`}>
      <div
        ref={connectorRef}
        style={{ width: TREE_TOKENS.sectionWidth }}
        className={`
          flex flex-col justify-center px-3.5 py-3 rounded-2xl shrink-0 relative overflow-hidden border
          transition-colors
          bg-neutral-900/90 ${isDone ? "border-purple-600/40" : "border-neutral-700/50"}
        `}
      >
        <div
          className={`absolute top-0 ${side === "left" ? "right-0" : "left-0"} w-0.5 h-full rounded-full opacity-60`}
          style={{ background: isDone ? "linear-gradient(to bottom, #7c3aed, #a855f7)" : "#303030" }}
        />
        <span
          className={`text-[12px] font-semibold leading-snug ${isDone ? "text-purple-100" : "text-neutral-200"} ${side === "left" ? "text-right" : "text-left"}`}
        >
          {title}
        </span>
        {hasChildren && (
          <span className={`text-[9px] mt-1 ${isDone ? "text-purple-400" : "text-neutral-500"} ${side === "left" ? "text-right" : "text-left"}`}>
            {children.length} subtopic{children.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {hasChildren && (
        <div className="flex flex-col shrink-0" style={{ gap: TREE_TOKENS.cardGap }}>
          {children.map((c, i) => {
            const subtopicId = `${id}-sub-${i}`;
            return (
              <SectionToSubtopicLink key={subtopicId} sectionId={id} subtopicId={subtopicId} isDone={isDone}>
                <SubtopicCard
                  id={subtopicId}
                  title={c.title}
                  description={c.description}
                  resources={c.resources ?? []}
                  side={side}
                  isDone={isDone}
                />
              </SectionToSubtopicLink>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Registers the section->subtopic connector edge. Split out so each subtopic
// row declares its own connection without SectionCard needing to know the
// connector wiring details.
const SectionToSubtopicLink = ({ sectionId, subtopicId, isDone, children }) => {
  useConnection(`${sectionId}->${subtopicId}`, {
    fromId: sectionId,
    toId: subtopicId,
    dashed: !isDone,
    color: isDone ? TREE_TOKENS.doneColor : "#404040",
    strokeWidth: 1,
    opacity: 0.55,
  });
  return children;
};

export default SectionCard;
