import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/core/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/core/components/ui/avatar";
import { Progress } from "@/core/components/ui/progress";
import { ForestMappingExplorer, ForestMappingState } from "@/core/components/narrative/ForestMappingExplorer";

interface VeraForestMappingProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  isPreview?: boolean;
}

const VeraForestMapping: React.FC<VeraForestMappingProps> = ({
  onComplete,
  onProgress,
  isPreview = false,
}) => {
  const [achieved, setAchieved] = useState<Set<string>>(new Set());

  const handleStateChange = (s: ForestMappingState) => {
    setAchieved((prev) => {
      if (prev.has(s.tone)) return prev;
      return new Set(prev).add(s.tone);
    });
  };

  const progress = (achieved.size / 3) * 100;
  const progressRef = useRef(onProgress);
  progressRef.current = onProgress;

  useEffect(() => {
    progressRef.current?.(progress);
  }, [progress]);

  const allComplete = achieved.size >= 3;

  return (
    <div className="max-w-5xl mx-auto p-4 bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/lovable-uploads/vera.png" alt="Vera" />
          <AvatarFallback>V</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold text-emerald-900">Vera&apos;s Forest Mapping Capstone</h2>
          <p className="text-sm text-emerald-700/80">
            Design trails, place cameras, and read coordinates — your complete vector toolkit.
          </p>
        </div>
      </div>

      <Card className="mb-4 border-emerald-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-emerald-800">Capstone Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-2 mb-2" />
          <p className="text-xs text-emerald-600">
            {achieved.size} of 3 phases complete — trail design, camera placement, coordinate systems
          </p>
        </CardContent>
      </Card>

      <ForestMappingExplorer variant="light" onStateChange={handleStateChange} />

      {!isPreview && onComplete && (
        <div className="mt-6 flex flex-col items-center gap-2">
          {!allComplete && (
            <p className="text-sm text-emerald-600/70">
              Complete all three phases to finish the capstone.
            </p>
          )}
          <Button onClick={onComplete} disabled={!allComplete} className="bg-emerald-600 hover:bg-emerald-700">
            {allComplete ? "Complete Capstone Project" : "Keep Exploring"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default VeraForestMapping;
