import { CheckCircle, ArrowRight, Circle, Flag } from "lucide-react";
import { Button } from "@/core/components/ui/button";

interface SectionCompletionProps {
  onComplete: () => void;
  /** Advance to next section. Optional; when absent only the toggle is active. */
  onNext?: () => void;
  isCompleted: boolean;
  isLastSection: boolean;
}

/**
 * Unambiguous completion control (Path A2). Two distinct affordances:
 *   - A toggle (left) that ONLY marks the section complete, without advancing.
 *     Lets a learner check off a section and keep reading.
 *   - A primary action (right) that is the explicit "what happens next":
 *       not last → "Complete & continue" (marks complete if needed, then onNext once)
 *       last     → "Finish lesson" (marks complete, does not advance)
 *
 * `onNext` is invoked at most once per click and never on the last section, so
 * there is no dead click and no double-advance.
 */
export const SectionCompletion = ({ onComplete, onNext, isCompleted, isLastSection }: SectionCompletionProps) => {
  // Primary action: always advances (or finishes). Completes if not already.
  const handlePrimary = () => {
    if (!isCompleted) {
      onComplete();
    }
    if (!isLastSection) {
      onNext?.();
    }
  };

  // Toggle: mark complete in place; never advances.
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isCompleted) {
      onComplete();
    }
  };

  const primaryLabel = isLastSection ? "Finish lesson" : "Complete & continue";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-6 border-t border-slate-200 mt-6">
      <button
        onClick={handleToggle}
        disabled={isCompleted}
        className="focus:outline-none flex items-center gap-2 group disabled:cursor-default"
        aria-label={isCompleted ? 'Section completed' : 'Mark section as complete'}
      >
        {isCompleted ? (
          <CheckCircle className="w-6 h-6 text-green-500" />
        ) : (
          <Circle className="w-6 h-6 text-slate-400 transition-transform group-hover:scale-110 group-active:scale-90" />
        )}
        <span className={isCompleted ? 'text-green-600 font-semibold' : 'text-slate-600'}>
          {isCompleted ? 'Completed' : 'Mark as completed'}
        </span>
      </button>

      <Button onClick={handlePrimary} className="character-accent text-white hover:opacity-90">
        {isLastSection ? <Flag className="w-4 h-4 mr-2" /> : <ArrowRight className="w-4 h-4 mr-2" />}
        {primaryLabel}
      </Button>
    </div>
  );
};
