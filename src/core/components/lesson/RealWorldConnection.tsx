import { Globe, CheckCircle } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { SectionCompletion } from "./SectionCompletion";

interface RealWorldConnectionProps {
  connection: string;
  onComplete: () => void;
  onNext: () => void;
  isCompleted: boolean;
  isLastSection: boolean;
}

export const RealWorldConnection = ({ connection, onComplete, onNext, isCompleted, isLastSection }: RealWorldConnectionProps) => {
  return (
    <div className="space-y-6">
      {/* Real-world content follows here */}
      <div className="pl-8 border-l-4 border-orange-200">
        <h4 className="font-semibold text-slate-700 mb-2">Why This Matters</h4>
        {connection ? (
          <p className="text-slate-600 leading-relaxed">{connection}</p>
        ) : (
          <p className="text-slate-500 italic">Real-world connections for this lesson are coming soon.</p>
        )}
      </div>

      <SectionCompletion
        onComplete={onComplete}
        onNext={onNext}
        isCompleted={isCompleted}
        isLastSection={isLastSection}
      />
    </div>
  );
};
