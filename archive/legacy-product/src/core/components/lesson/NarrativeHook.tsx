import { Play, CheckCircle } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { CharacterAvatar } from "@/core/components/CharacterAvatar";
import { LessonData } from "@/core/types/lesson";
import { SectionCompletion } from "./SectionCompletion";

interface NarrativeHookProps {
  lesson: LessonData;
  character: {
    name: string;
    fullName: string;
    personality: string;
    avatar: string;
  };
  onComplete: () => void;
  onNext: () => void;
  isCompleted: boolean;
  isLastSection: boolean;
}

export const NarrativeHook = ({ lesson, character, onComplete, onNext, isCompleted, isLastSection }: NarrativeHookProps) => {
  return (
    <div className="space-y-6">
      {/* Main story content follows here */}
      <div className="bg-slate-50 rounded-lg p-4 mb-4">
        <p className="text-slate-700 leading-relaxed">{lesson.narrativeHook.story}</p>
      </div>
      <div className="flex items-start gap-4">
        <CharacterAvatar 
          src={character.avatar} 
          alt={character.fullName}
          size="xl"
          className="mt-1"
        />
        <div className="flex-1">
          <div className="rounded-lg p-4 border-l-4 border-orange-200 bg-orange-50/50">
            <p className="font-medium text-slate-800 mb-2">{character.name} says:</p>
            <p className="text-slate-700 italic">"{lesson.narrativeHook.characterMessage}"</p>
          </div>
        </div>
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
