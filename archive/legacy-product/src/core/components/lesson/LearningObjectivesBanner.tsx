import { Target } from "lucide-react";
import { Card, CardContent } from "@/core/components/ui/card";

interface LearningObjectivesBannerProps {
  objectives: string[];
}

export const LearningObjectivesBanner = ({ objectives }: LearningObjectivesBannerProps) => {
  return (
    <Card className="mb-6 border-l-4 border-l-blue-400 bg-blue-50/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div className="flex flex-col gap-1 w-full">
            <h3 className="font-semibold text-blue-900 mb-1">Learning Objectives</h3>
            <div className="flex flex-wrap gap-2">
              {objectives.map((objective, index) => (
                <span
                  key={index}
                  className="inline-block bg-blue-100 text-blue-800 text-xs font-medium rounded-full px-3 py-1 border border-blue-200 shadow-sm"
                >
                  {objective}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
