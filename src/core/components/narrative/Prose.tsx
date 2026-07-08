import { ReactNode } from "react";
import katex from "katex";

/**
 * Prose — the tiny markdown + KaTeX renderer for v2 lesson content.
 *
 * Authoring content is *data* (strings), not JSX, so it is localizable, diffable,
 * and writable without touching React. The supported surface is deliberately
 * minimal — no raw HTML, no links:
 *   inline:  **bold**  *italic*  `code`  $…$ (KaTeX)
 *   block:   $$…$$ display math, blank-line separated paragraphs (tell beats)
 *
 * `parseInline` is the inline pass (used by coupled passages); `Prose` is the
 * block pass (used by tell beats). Both rely on katex for math rendering.
 */

let keySeq = 0;
const nextKey = () => `prose-${keySeq++}`;

function renderMath(tex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(tex, { throwOnError: false, displayMode, output: "html" });
  } catch {
    return tex;
  }
}

const INLINE_RE = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)|(\$([^$\n]+)\$)/;

/** Parse a single line of inline markdown into React nodes (recurses into emphasis). */
export function parseInline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = INLINE_RE.exec(text.slice(last))) !== null) {
    const idx = m.index;
    if (idx > 0) out.push(text.slice(last, last + idx));
    if (m[2] !== undefined) {
      out.push(<strong key={nextKey()}>{parseInline(m[2])}</strong>);
    } else if (m[4] !== undefined) {
      out.push(<em key={nextKey()}>{parseInline(m[4])}</em>);
    } else if (m[6] !== undefined) {
      out.push(
        <code key={nextKey()} className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.85em]">
          {m[6]}
        </code>,
      );
    } else if (m[8] !== undefined) {
      out.push(
        <span
          key={nextKey()}
          className="katex-inline align-baseline"
          dangerouslySetInnerHTML={{ __html: renderMath(m[8], false) }}
        />,
      );
    }
    last += idx + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function pushParagraphs(text: string, out: ReactNode[]) {
  const paras = text
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  paras.forEach((p) =>
    out.push(
      <p key={nextKey()} className="mb-4 leading-relaxed last:mb-0">
        {parseInline(p.replace(/\n/g, " "))}
      </p>,
    ),
  );
}

interface ProseProps {
  /** Markdown source (inline subset + optional $$…$$ blocks). */
  md: string;
  className?: string;
}

/** Block-level renderer for tell beats: paragraphs + $$display math$$. */
export function Prose({ md, className }: ProseProps) {
  const nodes: ReactNode[] = [];
  const blockRe = /\$\$([\s\S]+?)\$\$/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = blockRe.exec(md)) !== null) {
    if (m.index > last) pushParagraphs(md.slice(last, m.index), nodes);
    nodes.push(
      <div
        key={`prose-bm-${i++}`}
        className="my-5 text-center"
        dangerouslySetInnerHTML={{ __html: renderMath(m[1], true) }}
      />,
    );
    last = blockRe.lastIndex;
  }
  if (last < md.length) pushParagraphs(md.slice(last), nodes);
  return <div className={className}>{nodes}</div>;
}

export default Prose;
