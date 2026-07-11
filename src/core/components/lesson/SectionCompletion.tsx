import { CheckCircle, ArrowRight, Flag } from "lucide-react";
import { Button } from "@/core/components/ui/button";

interface SectionCompletionProps {
  onComplete: () => void;
  /** Advance to next section. Optional; when absent only the toggle is active. */
  onNext?: () => void;
  isCompleted: boolean;
  isLastSection: boolean;
}

/**
 * One primary action is the explicit "what happens next":
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

  const primaryLabel = isLastSection ? "Finish lesson" : "Complete & continue";

  return (
    <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200 mt-6">
      {isCompleted && <span className="flex items-center gap-2 text-sm font-semibold text-green-600"><CheckCircle className="h-5 w-5" /> Completed</span>}
      <Button onClick={handlePrimary} className="character-accent text-white hover:opacity-90">
        {isLastSection ? <Flag className="w-4 h-4 mr-2" /> : <ArrowRight className="w-4 h-4 mr-2" />}
        {primaryLabel}
      </Button>
    </div>
  );
};
