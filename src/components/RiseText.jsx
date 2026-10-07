import { Fragment } from "react";
import "./RiseText.css";

// Splits a word into its "core" (letters/digits/'/-) and any trailing
// punctuation, so a period after the highlighted word doesn't get underlined.
const splitTrailingPunctuation = (word) => {
  const match = word.match(/^([\w'-]*)(\W*)$/);
  return match ? [match[1], match[2]] : [word, ""];
};

const RiseText = ({
  lines,
  highlight = "",

  as: Tag = "h1",
  stagger = 60,
  duration = 700,
  className = "",
  style = {},
}) => {
  const fullText = lines.join(" ");
  let wordIndex = 0;

  return (
    <Tag className={className} style={style} aria-label={fullText}>
      {lines.map((line, lineIndex) => {
        const words = line.split(" ");
        return (
          <Fragment key={lineIndex}>
            <span className="rt-line" aria-hidden="true">
              {words.map((word, wordInLine) => {
                const delay = wordIndex * stagger;
                wordIndex += 1;

                const [core, trailing] = splitTrailingPunctuation(word);
                const isHighlight =
                  highlight && core.toLowerCase() === highlight.toLowerCase();

                return (
                  <span
                    key={wordInLine}
                    className="rt-word"
                    style={{
                      animationDelay: `${delay}ms`,
                      animationDuration: `${duration}ms`,
                    }}
                  >
                    {isHighlight ? (
                      <span
                        className="rt-highlight"
                        style={{
                          "--rt-underline-delay": `${delay + duration}ms`,
                        }}
                      >
                        {core}
                      </span>
                    ) : (
                      core
                    )}
                    {trailing}
                    {wordInLine < words.length - 1 ? " " : ""}
                  </span>
                );
              })}
            </span>
            {/* Lets lines flow as one paragraph when a caller makes .rt-line inline. */}
            {lineIndex < lines.length - 1 ? " " : ""}
          </Fragment>
        );
      })}
    </Tag>
  );
};

export default RiseText;
