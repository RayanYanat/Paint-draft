import { Fragment } from "react";

/**
 * SplitWords — wraps each word in an overflow-hidden box with an inner
 * `.split-word` span. Sections set `.split-word` to yPercent:100 and animate
 * to 0 (each word rises into its box). Spaces sit between the boxes so the
 * heading still wraps naturally.
 *
 * The small padding/negative-margin pair keeps descenders (g, y, p) from
 * being clipped by the overflow-hidden box.
 */
export default function SplitWords({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span
            className="inline-block overflow-hidden align-bottom"
            style={{ paddingBottom: "0.12em", marginBottom: "-0.12em" }}
          >
            <span className={`inline-block split-word ${className ?? ""}`}>{word}</span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </>
  );
}
