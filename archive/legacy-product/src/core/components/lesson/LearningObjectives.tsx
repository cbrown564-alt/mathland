
import { useState } from "react";
import { CheckCircle, Circle } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";

interface LearningObjectivesProps {
  objectives: string[];
  completed: boolean[];
  onToggle: (index: number) => void;
  onComplete: () => void;
  isCompleted: boolean;
}

export const LearningObjectives = ({ objectives, completed, onToggle, onComplete, isCompleted }: LearningObjectivesProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const completedCount = completed.filter(Boolean).length;

  return (
    <Card className="mb-8 border-l-4 border-l-blue-400">
      <CardHeader 
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            🎯 Learning Objectives
            {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
          </span>
          <span className="text-sm font-normal text-gray-500">
            {completedCount}/{objectives.length} completed
          </span>
        </CardTitle>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          <p className="text-gray-600 mb-4">By the end of this lesson, you'll be able to:</p>
          
          <div className="space-y-3">
            {objectives.map((objective, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onToggle(index)}
              >
                {completed[index] ? (
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                )}
                <p className={`text-gray-700 ${completed[index] ? 'line-through text-gray-500' : ''}`}>
                  {objective}
                </p>
              </div>
            ))}
          </div>
          
          <div className="pt-4 border-t">
            <Button
              onClick={onComplete}
              disabled={completedCount < objectives.length}
              className={`${isCompleted ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600'}`}
              size="sm"
            >
              {isCompleted ? 'Objectives Reviewed' : `Complete All Objectives (${completedCount}/${objectives.length})`}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
