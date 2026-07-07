import { useState } from "react";
import { ChevronDown, ChevronUp, Info, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/core/components/ui/card";

interface ReadSectionProps {
  content?: string;
  analogy?: string;
  keyPoints?: string[];
  digDeeper?: string;
  whyMatters?: string;
}

const hasContent = (props: ReadSectionProps) =>
  Boolean(props.content || props.analogy || (props.keyPoints && props.keyPoints.length) || props.digDeeper || props.whyMatters);

/**
 * Renders the "Read" section of a lesson. When lesson data is missing we show a
 * neutral "content coming soon" empty state rather than leaking cross-domain
 * placeholder text into every lesson (Path A4).
 */
export const ReadSection = (props: ReadSectionProps) => {
  const [expanded, setExpanded] = useState(false);

  if (!hasContent(props)) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-3" />
        <p className="font-semibold text-slate-700">Content coming soon</p>
        <p className="text-sm text-slate-500 mt-1">
          The reading for this section is still being written.
        </p>
      </div>
    );
  }

  const { content, analogy, keyPoints, digDeeper, whyMatters } = props;

  return (
    <div className="space-y-6">
      {/* Main Content */}
      {content && (
        <div className="text-slate-700 leading-relaxed mb-2">
          {content}
        </div>
      )}
      {/* Analogy */}
      {analogy && (
        <div className="bg-blue-50 border-l-4 border-blue-300 rounded-lg p-4 mb-2">
          <div className="font-semibold text-blue-800 mb-1">Analogy</div>
          <div className="italic text-blue-700">{analogy}</div>
        </div>
      )}
      {/* Key Points */}
      {keyPoints && keyPoints.length > 0 && (
        <div>
          <div className="font-semibold text-slate-800 mb-1">Key Points</div>
          <ul className="list-disc pl-6 space-y-1">
            {keyPoints.map((point, i) => (
              <li key={i} className="text-slate-700">{point}</li>
            ))}
          </ul>
        </div>
      )}
      {/* Dig Deeper (Expandable) */}
      {digDeeper && (
        <div>
          <button
            className="flex items-center gap-2 text-blue-600 font-medium hover:underline focus:outline-none mb-1"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Dig Deeper
          </button>
          {expanded && (
            <div className="bg-slate-50 border-l-4 border-slate-300 rounded-lg p-4 mt-1 text-slate-700">
              {digDeeper}
            </div>
          )}
        </div>
      )}
      {/* Why This Matters */}
      {whyMatters && (
        <Card className="bg-yellow-50 border-l-4 border-yellow-400">
          <CardContent className="flex items-start gap-3 p-4">
            <Info className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
            <div>
              <div className="font-semibold text-yellow-900 mb-1">Why This Matters</div>
              <div className="text-yellow-800">{whyMatters}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
